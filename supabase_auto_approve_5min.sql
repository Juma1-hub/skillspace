-- SkillSpace: automatically approve task submissions after 5 minutes.
-- Run this script once in Supabase SQL Editor after uploading the project files.
-- A cron job runs every minute, so approval happens within about 5 minutes of submission.

create extension if not exists pg_cron with schema extensions;

create or replace function public.approve_due_task_submissions()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  s record;
  approved_id uuid;
begin
  for s in
    select
      ts.id,
      ts.worker_id,
      ts.task_id,
      coalesce(t.reward_usd, ts.reward_usd) as reward_usd,
      coalesce(t.reward_ksh, ts.reward_ksh) as reward_ksh
    from public.task_submissions ts
    join public.tasks t on t.id = ts.task_id
    where ts.status = 'pending'
      and ts.created_at <= now() - interval '5 minutes'
    order by ts.created_at
  loop
    -- Change the status first inside the same database transaction. This prevents
    -- the same submission from being credited twice if the cron job runs again.
    update public.task_submissions
      set status = 'approved'
    where id = s.id
      and status = 'pending'
    returning id into approved_id;

    if approved_id is not null then
      update public.profiles
      set
        available_balance_usd = coalesce(available_balance_usd, 0) + coalesce(s.reward_usd, 0),
        available_balance_ksh = coalesce(available_balance_ksh, 0) + coalesce(s.reward_ksh, 0),
        free_tasks_used = least(5, coalesce(free_tasks_used, 0) + 1)
      where id = s.worker_id;

      insert into public.wallet_transactions
        (worker_id, type, amount_usd, amount_ksh)
      values
        (s.worker_id, 'earning', coalesce(s.reward_usd, 0), coalesce(s.reward_ksh, 0));
    end if;
  end loop;
end;
$$;

revoke all on function public.approve_due_task_submissions() from public;
grant execute on function public.approve_due_task_submissions() to postgres;

-- Replace an existing job with the same name if this script is run again.
do $$
declare
  existing_job_id bigint;
begin
  select jobid into existing_job_id
  from cron.job
  where jobname = 'skillspace-auto-approve-submissions'
  limit 1;

  if existing_job_id is not null then
    perform cron.unschedule(existing_job_id);
  end if;
end $$;

select cron.schedule(
  'skillspace-auto-approve-submissions',
  '* * * * *',
  $$select public.approve_due_task_submissions();$$
);

-- Optional immediate test: after creating the function, this runs the approval
-- check once without waiting for the next cron minute.
select public.approve_due_task_submissions();
