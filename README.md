# SkillSpace Frontend

Frontend-first SkillSpace rebuild for GitHub + Vercel.

## Included
- Next.js App Router
- 6 categories with 10 starter/test tasks each (60 total)
- Working dashboard, menu, task filters, task details and submissions
- First 5 tasks free; KSh 260 / $2 unlocks the next 5 in frontend test mode
- Earnings and transaction history
- Withdrawal request UI with $100 minimum
- Login and signup demo flows
- Profile and settings
- Support page
- Admin task add/edit/delete and contact-information editing
- Responsive desktop/mobile UI

## Current stage
All data is stored in browser localStorage. No Supabase, Daraja credentials or payment secrets are included. Real authentication, database persistence and Safaricom Daraja STK Push will be added after the frontend is approved.

## Vercel
Vercel should detect this as a standard Next.js project. Use the repository root as the Root Directory and the default `next build` command. Node 24.x is recommended for current Vercel builds.
