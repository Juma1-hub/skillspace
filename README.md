# SkillSpace — Full Frontend (Vercel Fixed)

This is the rebuilt SkillSpace frontend, designed for direct upload to the `Juma1-hub/skillspace` GitHub repository and deployment on Vercel.

## Included
- SkillSpace branding with a clean blue/white, Arcade Writers-inspired interface
- Login and signup
- Worker dashboard
- Slide-out navigation
- 9 task categories
- 10 starter tasks in every category (90 frontend starter tasks)
- Working task details and submission flow
- Demo wallet, earnings and transactions
- Surveys
- Profile and settings
- Support page
- Withdraw page with USD/KSh conversion
- Admin area with task posting/editing UI and support/contact settings
- First 5 tasks free, then USD 2 / KSh 260 access fee model displayed
- Withdrawal minimum USD 100 / KSh 13,000
- M-PESA-ready withdrawal UI
- Responsive mobile layout
- Production error and 404 pages

## Vercel deployment
Vercel should detect Next.js automatically. Keep the repository root as the project Root Directory and use the default Node.js setting unless your Vercel project explicitly requires another version.

Build command: `npm run build`

The project includes the TypeScript compiler and React type packages required by a Next.js TypeScript deployment. This matters because Vercel runs the production build in its own environment and does not rely on packages that happen to exist only on a developer machine.

## Demo login
Any non-empty valid-looking email and password will log in in frontend demo mode.

To display the Admin Area, use an email containing `admin`, for example:
`admin@skillspace.test`

## Backend integration
This package is the frontend layer. Supabase authentication/database and M-PESA Daraja should be connected next. Daraja secrets must be stored server-side as Vercel environment variables and must never be exposed in browser code.

## Important
The first ZIP had a client `useSearchParams()` implementation in the task page. Next.js documents that statically rendered routes using `useSearchParams()` need a Suspense boundary; the fixed version now uses the page `searchParams` prop instead, avoiding that production-build failure.
