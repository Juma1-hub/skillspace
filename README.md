# SkillSpace

SkillSpace is a worker platform where people can find online tasks, submit completed work and track earnings.

## Stack
- Next.js
- Supabase
- GitHub
- Vercel

## Environment variables
Create these in Vercel:

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-sb-publishable-key

## Supabase setup
Run `supabase_contact_and_real_tasks.sql` in the Supabase SQL Editor. It sets the initial support contacts, adds the admin settings update policy, and replaces the existing task records with production-style task content while preserving their rewards.

## Admin contact settings
After an authenticated user has `role = 'admin'` in `profiles`, open `/admin/settings` to change the support email and WhatsApp number. Worker-facing support areas read these values from the `settings` table.

Never put a Supabase service-role or secret key in this project, GitHub, or Vercel client-side environment variables.

## Admin task management

Administrators can open `/admin/tasks` to edit task titles, descriptions, instructions, rewards, categories, and active/inactive status. Worker-facing task content comes from Supabase.


## Automatic task approval

Worker submissions are created with `pending` status. A Supabase pg_cron job checks every minute and automatically approves submissions that are at least 5 minutes old. When approved, the worker balance and free-task count are updated and an earning transaction is recorded. Run `supabase_auto_approve_5min.sql` once in the Supabase SQL Editor.
