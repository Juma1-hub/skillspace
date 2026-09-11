-- SkillSpace production fixes: one submission per task, automatic earnings,
-- worker read policies, and Transcription category/jobs.

-- 1) Ensure the automatic approval function credits the worker balance and earnings ledger.
create extension if not exists pg_cron with schema extensions;

alter table public.profiles
  add column if not exists access_unlocked boolean not null default false;

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
    select ts.id, ts.worker_id, ts.task_id,
           coalesce(t.reward_usd, ts.reward_usd, 0) as reward_usd,
           coalesce(t.reward_ksh, ts.reward_ksh, 0) as reward_ksh
    from public.task_submissions ts
    join public.tasks t on t.id = ts.task_id
    where ts.status = 'pending'
      and ts.created_at <= now() - interval '5 minutes'
    order by ts.created_at
  loop
    update public.task_submissions
      set status = 'approved'
    where id = s.id and status = 'pending'
    returning id into approved_id;

    if approved_id is not null then
      update public.profiles
      set available_balance_usd = coalesce(available_balance_usd, 0) + s.reward_usd,
          available_balance_ksh = coalesce(available_balance_ksh, 0) + s.reward_ksh
      where id = s.worker_id;

      insert into public.wallet_transactions (worker_id, type, amount_usd, amount_ksh)
      values (s.worker_id, 'earning', s.reward_usd, s.reward_ksh);
    end if;
  end loop;
end;
$$;

revoke all on function public.approve_due_task_submissions() from public;
grant execute on function public.approve_due_task_submissions() to postgres;

-- 2) A worker may submit each task only once. This is enforced at database level.
-- Remove duplicate historical submissions before creating the unique index.
delete from public.task_submissions a
using public.task_submissions b
where a.worker_id = b.worker_id
  and a.task_id = b.task_id
  and a.id > b.id;

create unique index if not exists task_submissions_one_per_worker_task
on public.task_submissions (worker_id, task_id);

-- 3) Keep the free-task allowance based on actual submissions.
create or replace function public.reserve_free_task_slot()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  submitted_count integer;
  unlocked boolean;
begin
  select count(*)::integer into submitted_count
  from public.task_submissions
  where worker_id = new.worker_id;

  select coalesce(access_unlocked,false) into unlocked
  from public.profiles
  where id = new.worker_id
  for update;

  if not unlocked and submitted_count >= 5 then
    raise exception 'Your 5 free tasks are complete. Please unlock more tasks to continue.';
  end if;

  if not unlocked then
    update public.profiles
    set free_tasks_used = least(5, submitted_count + 1)
    where id = new.worker_id;
  end if;

  return new;
end;
$$;

drop trigger if exists reserve_free_task_slot on public.task_submissions;
create trigger reserve_free_task_slot
before insert on public.task_submissions
for each row execute function public.reserve_free_task_slot();

-- 4) Worker read policies needed by Dashboard/Earnings/Wallet/Profile.
drop policy if exists "Workers can view own wallet transactions" on public.wallet_transactions;
create policy "Workers can view own wallet transactions"
on public.wallet_transactions for select to authenticated
using (worker_id = auth.uid());

drop policy if exists "Workers can view own submissions" on public.task_submissions;
create policy "Workers can view own submissions"
on public.task_submissions for select to authenticated
using (worker_id = auth.uid());

drop policy if exists "Workers can create own submissions" on public.task_submissions;
create policy "Workers can create own submissions"
on public.task_submissions for insert to authenticated
with check (worker_id = auth.uid());

-- 5) Schedule the five-minute approval checker every minute.
do $$
declare existing_job_id bigint;
begin
  select jobid into existing_job_id from cron.job
  where jobname = 'skillspace-auto-approve-submissions' limit 1;
  if existing_job_id is not null then perform cron.unschedule(existing_job_id); end if;
end $$;

select cron.schedule(
  'skillspace-auto-approve-submissions',
  '* * * * *',
  $$select public.approve_due_task_submissions();$$
);

-- Run once immediately so already-due submissions are credited now.
select public.approve_due_task_submissions();

-- 6) Add Transcription as a real worker category and 10 jobs.
insert into public.categories (name, is_active)
select 'Transcription', true
where not exists (select 1 from public.categories where lower(name) = lower('Transcription'));

with transcription_tasks(title, description, instructions, reward_usd, reward_ksh) as (
  values
  ('Transcribe a Short Audio Clip','Transcribe a short clear audio recording into accurate written text.','Listen carefully, type the spoken words accurately, preserve the speaker meaning and mark any unclear word as [unclear].',0.25,33),
  ('Clean a Raw Transcript','Clean a machine-generated transcript while preserving the speaker meaning.','Correct obvious spelling, punctuation and repeated-word errors. Do not rewrite the speaker into different words or change the meaning.',0.30,39),
  ('Transcribe a Customer Call','Create a written transcript from a customer service call recording.','Separate speakers when possible, include the important spoken details and mark portions that cannot be understood.',0.50,65),
  ('Transcribe an Interview','Transcribe a short interview recording accurately.','Identify the interviewer and guest when clear, preserve questions and answers, and mark unclear sections instead of guessing.',0.50,65),
  ('Timestamp an Audio Transcript','Create a transcript with useful timestamps for an audio recording.','Add a timestamp at the start of each major speaker change or important section and keep the wording accurate.',0.40,52),
  ('Transcribe a Voice Note','Turn a short voice note into a clean written transcript.','Write the spoken content accurately, add basic punctuation and preserve names, numbers and important details.',0.25,33),
  ('Review a Transcript for Accuracy','Compare a transcript against its audio and identify errors.','List incorrect words, missing phrases and speaker-label errors. Give the corrected wording for each issue.',0.40,52),
  ('Format a Meeting Transcript','Format a recorded meeting transcript so it is easy to read.','Separate speakers, add punctuation and organize the transcript into readable paragraphs without changing the content.',0.45,59),
  ('Transcribe with Speaker Labels','Produce a transcript with clear speaker labels from a multi-speaker recording.','Use consistent labels such as Speaker 1 and Speaker 2 when names are unknown. Do not guess identities.',0.50,65),
  ('Transcription Quality Check','Perform a final quality check on a completed transcript.','Check spelling, punctuation, speaker labels, missing text and obvious transcription mistakes. Report all issues found.',0.35,46)
), cat as (
  select id from public.categories where lower(name)=lower('Transcription') limit 1
)
insert into public.tasks (category_id,title,description,instructions,reward_usd,reward_ksh,is_active)
select cat.id,t.title,t.description,t.instructions,t.reward_usd,t.reward_ksh,true
from cat cross join transcription_tasks t
where not exists (
  select 1 from public.tasks x
  where x.category_id=cat.id and x.title=t.title
);

-- 7) Keep support/admin policies already used by the project.
drop policy if exists "Admins can update tasks" on public.tasks;
create policy "Admins can update tasks" on public.tasks for update to authenticated
using (public.is_admin()) with check (public.is_admin());
