# SkillSpace — Full Frontend

A complete, GitHub/Vercel-ready Next.js frontend for SkillSpace.

## Included
- SkillSpace branding with a clean Arcade Writers-inspired layout
- Login and signup
- Worker dashboard
- Slide-out navigation menu
- 9 task categories
- 10 starter tasks per category (90 seeded frontend tasks)
- Task detail and submission flow
- Demo earnings and transactions
- Withdraw page with USD/KSh conversion
- Surveys
- Profile, settings and support
- Admin area for posting/editing task UI and support information
- First 5 tasks free, then USD 2 / KSh 260 access fee model displayed
- Withdrawal minimum USD 100 / KSh 13,000
- M-PESA Daraja-ready withdrawal/payment UI
- Responsive mobile layout

## Deploy
1. Extract this ZIP.
2. Upload the extracted project files to the root of your GitHub `Juma1-hub/skillspace` repository.
3. Commit the files.
4. Import/deploy the repository on Vercel.
5. No `.env` variables are required for this frontend demo build.

## Demo
- Any valid email/password can log in.
- To see Admin Area, log in with an email containing `admin`, for example `admin@skillspace.test`.
- Task submissions update the demo wallet and transaction list in the browser.

## Backend connection
The UI is deliberately structured so Supabase authentication/database and M-PESA Daraja STK Push can be connected next without redesigning the frontend. Do not put Daraja secret credentials in client-side code; use server-side API routes/environment variables when integrating payments.
