# SkillSpace

Stage 2: Supabase-connected SkillSpace frontend.

## Environment variables

Create these in Vercel:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

Use the Supabase project URL (without `/rest/v1/`) and the public Publishable key. Never use a secret/service-role key in the browser.

The app now loads active categories and tasks from Supabase and supports email/password sign-up and login.
