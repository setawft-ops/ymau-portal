# YMAU Côte d’Ivoire Ambassador Training Portal
Next.js 14 + TypeScript + Tailwind + Supabase (Auth, Postgres with RLS, private Storage).

## Accounts you need
1. **Supabase** (free tier works): supabase.com
2. **Vercel** (or any Node host): vercel.com
3. **GitHub** (to connect the repo to Vercel)
No other credentials. Only the Supabase URL and anon key are used; never expose the service-role key.

## Setup
1. Create a Supabase project. In **SQL Editor**, run `supabase/schema.sql`.
2. Supabase → Authentication → URL Configuration: set Site URL to your deployed URL (and `http://localhost:3000` for dev).
3. Copy `.env.example` to `.env.local`; fill in URL and anon key (Project Settings → API).
4. `npm install && npm run dev`
5. Sign up. Then in SQL Editor make yourself admin:
   `update profiles set role='admin' where id=(select id from auth.users where email='you@example.com');`
6. In **Admin**, promote trainers. Trainers/admins upload files in **Library**; students browse and download.

## Deploy
Push to GitHub, import in Vercel, add the two env vars, deploy. Uploads are capped at 25 MB (also check Supabase Storage global limit, 50 MB on free tier).

## Security model
Roles live in `profiles`; Row Level Security enforces them in the database. Storage bucket is private; downloads use 60-second signed URLs.

## Not built yet
Quiz/assessment engine, crisis-lab interactive scenarios, announcements, in-browser file preview, YALE logo (add to `public/` and the header). The Library already supports "Assessment", "Crisis Lab" and "Delegate Toolkit" categories as file collections.
