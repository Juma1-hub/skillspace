# SkillSpace — Arcade Style Rebuild

GitHub/Vercel-ready Next.js foundation for SkillSpace.

Included:
- Arcade Writers-inspired clean blue/white UI
- 6 categories with 10 starter/test tasks each (60 tasks)
- Task listing and View Task/submission flow
- Admin UI for adding/editing tasks and contact information
- Supabase environment placeholders
- Direct Safaricom Daraja STK Push endpoint structure and callback endpoint
- USD/KSh display using the current demo rate of 1 USD = KSh 130
- First 5 tasks free, then KSh 260 ($2) after each batch of 5 to unlock the next batch

## Setup
1. Upload the contents to the `Juma1-hub/skillspace` GitHub repository.
2. Add the variables in `.env.example` to Vercel.
3. Connect the existing Supabase project.
4. Wire the forms/API routes to your Supabase tables and RLS policies.
5. Add Safaricom Daraja production credentials when approved.

The STK routes are deliberately credential-free until production Daraja credentials are supplied.
