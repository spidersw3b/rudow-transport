# Rudow Transportation

Standalone **Next.js 14 (App Router)** marketing site, **customer portal**, and **admin console** for Rudow Transportation — a sibling brand to Rudow Automotive with the same technical foundation (Next.js, Supabase, NextAuth, Resend) and a distinct navy/blue transport identity.

## 1. Project overview

- **Public site:** Services, about, contact / quote, dedicated transport quote page.
- **Customer portal (`/manage`):** Sign up, sign in, dashboard with request stats and detail modal.
- **Admin (`/admin`):** Dashboard, requests, customers, drivers, fleet, routes (derived from live requests), reports, settings.
- **API routes:** NextAuth credentials, signup, CRUD-style access to `transport_requests`, `fleet_vehicles`, `drivers`, `users`, uploads, and contact/notification email via Resend.

Use a **separate Supabase project** (recommended) or the same project with these tables isolated from other apps.

## 2. Local setup

```bash
npm install
cp .env.local.example .env.local
# Fill in all variables (see sections below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 3. Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, paste `lib/schema.sql` and run it.
3. Copy **Project URL**, **anon key**, and **service role key** into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. **Storage:** create a public bucket named `uploads` (used by `/api/upload`).  
   - For public URLs returned to the browser, configure the bucket as public or use signed URLs (this repo assumes a public bucket for simplicity).

## 4. NextAuth setup

1. Generate a secret:

   ```bash
   openssl rand -base64 32
   ```

   Set `NEXTAUTH_SECRET` and `NEXTAUTH_URL` (local: `http://localhost:3000`).

2. Create the first **admin** user in Supabase (password hashed with bcrypt, cost 12):

   ```bash
   node -e "const b=require('bcryptjs');console.log(b.hashSync('yourpassword',12))"
   ```

   Then in SQL:

   ```sql
   INSERT INTO users (email, name, role, password_hash)
   VALUES (
     'admin@rudowtransportation.net',
     'Admin',
     'admin',
     '$2a$12$HASH_GENERATED_BY_BCRYPT'
   );
   ```

3. Sign in at `/manage/login` with that email and password, then open `/admin/dashboard` (middleware enforces `role = admin` for `/admin`).

## 5. Resend email setup

1. Verify **rudowtransportation.net** (or your sending domain) in [Resend](https://resend.com).
2. Create an API key → `RESEND_API_KEY`.
3. Set `DISPATCH_EMAIL=dispatch@rudowtransportation.net`.  
   New transport requests trigger an email to dispatch (skipped gracefully if `RESEND_API_KEY` is missing in dev).

> **Note:** Resend requires a verified sender domain. Until DNS is verified, use Resend’s test domain workflow from their docs or omit the API key locally.

## 6. Customer accounts

- Self-serve: `/manage/signup` → `POST /api/auth/signup` → bcrypt-hashed row in `users` with `role = customer` → automatic sign-in.
- Manual SQL example:

  ```sql
  INSERT INTO users (email, name, role, password_hash, company, phone)
  VALUES (
    'client@company.com',
    'John Doe',
    'customer',
    '[bcrypt hash]',
    'Fleet Corp',
    '555-000-0000'
  );
  ```

## 7. Adding fleet vehicles

- UI: `/admin/fleet` → **Add vehicle** (`/admin/fleet/add`).
- Or insert rows directly in Supabase against `fleet_vehicles`.

## 8. Vercel deployment

1. Push the repository to GitHub.
2. **Import** the repo in [Vercel](https://vercel.com) — framework preset **Next.js**.
3. Add **all** environment variables from `.env.local.example` (production values).
4. Set `NEXTAUTH_URL` to your production URL (e.g. `https://rudowtransportation.net`).
5. Deploy.

## 9. Connecting a custom domain

1. Register **rudowtransportation.net** (or your chosen domain).
2. Vercel → Project → **Settings → Domains** → add the domain.
3. Add the provided DNS records at your registrar.
4. Allow **10–30 minutes** (sometimes longer) for DNS + TLS.

## 10. Post-launch checklist

- [ ] Submit a quote from `/contact` — confirm email at `dispatch@rudowtransportation.net`.
- [ ] Create at least one **admin** user in Supabase.
- [ ] Replace placeholder JPEGs in `public/images/` with final photography (see `public/images/README.md`).
- [ ] Test **customer signup** and `/manage` dashboard.
- [ ] Test **mobile** layouts (nav, admin sidebar, forms).
- [ ] Click-test all nav links and CTAs.
- [ ] Submit **sitemap** to Google Search Console when the domain is live.

## Project structure highlights

- `app/(marketing)/` — public pages with `SiteNav` + `SiteFooter`.
- `app/manage/` — portal (login/signup unauthenticated; dashboard protected by middleware).
- `app/admin/` — admin shell + pages.
- `components/` — layout, home sections, forms, admin, customer, shared UI.
- `lib/schema.sql` — Postgres schema for Supabase.
- `types/` — shared TypeScript models.

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Next.js dev server       |
| `npm run build`| Production build         |
| `npm run start`| Start production server  |
| `npm run lint` | ESLint (Next core rules) |

---

© Rudow Transportation — internal scaffold for production deployment.
