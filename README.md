# SkillSpace Frontend

A self-contained, GitHub/Vercel-ready SkillSpace frontend foundation.

## Included
- Responsive worker dashboard and slide-out menu
- Login/sign-up gate
- 6 categories with 10 starter tasks each (60 tasks)
- View Task -> Submit flow
- Duplicate-submission prevention
- First 5 tasks free, then $2 / KSh 260 unlock rule messaging
- USD/KSh display using 1 USD = KSh 130
- Earnings and transactions
- Withdrawal minimum $100 / KSh 13,000
- Profile, Settings, Support
- Admin demo area for adding tasks and editing support contacts
- Browser storage fallback so the frontend is functional before Supabase credentials are connected

## Vercel
Upload the project root to GitHub and import the repository into Vercel. No `.env` values are required for the browser-storage mode.

## Supabase
The UI is intentionally separated from backend credentials. Supabase auth/database wiring can be connected to the existing SkillSpace tables without changing the page structure.
