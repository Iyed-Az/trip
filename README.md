# TripAgency

TripAgency is a travel marketplace concept for travelers and travel agencies. Travelers can browse and request a trip without creating an account; agencies use a separate authenticated workspace.

## Current build status

The current preview is an explicitly labeled demo. Supabase was selected, but its project URL and public key were not added, so the app is not connected to live data yet. Demo bookings are not sent to an agency, and demo agency actions do not update a server database.

The Supabase schema and RLS policies are in `supabase/schema.sql`. Do not publish this demo as a live booking service until the Supabase connection and its end-to-end flows have been configured and verified.

## Supabase setup

1. Create a Supabase project.
2. Open **SQL Editor** in Supabase and run the complete `supabase/schema.sql` file.
3. In Supabase Authentication, enable email/password for agency accounts. Public travelers do not need accounts.
4. Add the following values as Environment Variables in Vercel (and in a local `.env` for development):
   - `VITE_SUPABASE_URL` — the Supabase project URL.
   - `VITE_SUPABASE_ANON_KEY` — the project's public anon/publishable key.
5. Never put a `service_role` key in the browser or in a `VITE_` variable. All browser access must use the public key with the provided RLS policies.
6. Create an agency account through the app. New agencies begin with verification status `pending`; an administrator must approve them before their offers are visible publicly.
7. The schema creates the `trip-images`, `agency-assets`, and private `agency-documents` Storage buckets. Image object paths must start with the agency UUID.

The RLS rules allow anonymous users to read approved agencies and published trips and submit a booking request. They do not allow anonymous users to read client booking data. Agency owners can only manage records belonging to their own agency.

## Email, messaging, reviews, and realtime

The database creates an agency notification when a guest submits a booking request. Sending email requires a separately configured Supabase Edge Function and an email delivery provider. Client replies and public review submissions are deliberately not exposed as anonymous database writes; add a server-verified booking link or equivalent abuse protection before enabling those writes. Realtime subscriptions also need to be enabled for the selected Supabase tables in the project dashboard.

## Local development

```sh
npm install
npm run dev        # http://localhost:5173
npm run typecheck
npm run build      # outputs to dist/
```

## Deploy on Vercel

Import the repository in Vercel. The Vite preset is detected automatically (`vercel.json` already sets the build command, the `dist` output directory and the SPA rewrite so deep links such as `/voyages/antalya` work on refresh). Images are served from `public/images/`. Do not commit `.env` files or credentials.
