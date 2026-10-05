-- TripAgency schema for a Supabase project.
-- Run this in the Supabase SQL Editor. Public visitors do not need accounts;
-- only agency owners authenticate through Supabase Auth.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create type public.agency_verification_status as enum (
  'pending',
  'approved',
  'rejected',
  'suspended'
);

create type public.trip_status as enum (
  'draft',
  'published',
  'disabled'
);

create type public.booking_status as enum (
  'pending',
  'in_progress',
  'confirmed',
  'refused',
  'completed'
);

create table public.agencies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 140),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  logo_url text,
  cover_url text,
  description text not null default '',
  email text not null,
  phone text not null,
  whatsapp text not null,
  address text not null,
  city text not null,
  country text not null,
  website text,
  instagram text,
  facebook text,
  created_year integer check (created_year between 1900 and 2100),
  specialties text[] not null default '{}',
  verification_status public.agency_verification_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 180),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  destination text not null,
  country text not null,
  city text not null,
  description text not null,
  price numeric(12, 2) not null check (price > 0),
  currency text not null default 'EUR' check (currency ~ '^[A-Z]{3}$'),
  start_date date,
  end_date date,
  duration_days integer not null check (duration_days > 0),
  nights integer not null check (nights >= 0),
  available_places integer not null default 1 check (available_places >= 0),
  trip_type text not null,
  hotel text,
  transport text,
  meals text,
  transfer text,
  activities text[] not null default '{}',
  highlights text[] not null default '{}',
  included text[] not null default '{}',
  not_included text[] not null default '{}',
  status public.trip_status not null default 'draft',
  main_image text,
  views_count integer not null default 0 check (views_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (start_date is null or end_date is null or end_date >= start_date)
);

create table public.trip_images (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  image_url text not null,
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  unique (trip_id, position)
);

create table public.itinerary_days (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  day_number integer not null check (day_number > 0),
  title text not null,
  description text not null default '',
  created_at timestamptz not null default now(),
  unique (trip_id, day_number)
);

create table public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete restrict,
  agency_id uuid not null references public.agencies(id) on delete restrict,
  client_name text not null check (char_length(client_name) between 2 and 160),
  client_email text not null check (
    client_email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  ),
  client_phone text not null check (char_length(client_phone) between 7 and 40),
  number_of_people integer not null check (number_of_people between 1 and 40),
  requested_date date,
  message text not null default '' check (char_length(message) <= 4000),
  status public.booking_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  booking_request_id uuid not null references public.booking_requests(id) on delete cascade,
  sender_type text not null check (sender_type in ('agency', 'client')),
  sender_id uuid,
  message text not null check (char_length(message) between 1 and 4000),
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  type text not null,
  title text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  trip_id uuid not null references public.trips(id) on delete cascade,
  client_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null default '',
  created_at timestamptz not null default now()
);

create table public.trip_views (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  session_id text not null check (char_length(session_id) between 8 and 160),
  created_at timestamptz not null default now()
);

create index trips_public_search_idx on public.trips (status, destination, trip_type);
create index trips_agency_status_idx on public.trips (agency_id, status);
create index booking_requests_agency_created_idx
  on public.booking_requests (agency_id, created_at desc);
create index booking_requests_trip_idx on public.booking_requests (trip_id);
create index itinerary_days_trip_day_idx
  on public.itinerary_days (trip_id, day_number);
create index trip_images_trip_position_idx
  on public.trip_images (trip_id, position);
create index messages_booking_created_idx
  on public.messages (booking_request_id, created_at);
create index notifications_agency_unread_idx
  on public.notifications (agency_id, is_read, created_at desc);
create index reviews_agency_idx on public.reviews (agency_id, created_at desc);
create index trip_views_trip_created_idx
  on public.trip_views (trip_id, created_at desc);

create trigger agencies_set_updated_at
before update on public.agencies
for each row execute function public.set_updated_at();
create trigger trips_set_updated_at
before update on public.trips
for each row execute function public.set_updated_at();
create trigger booking_requests_set_updated_at
before update on public.booking_requests
for each row execute function public.set_updated_at();

-- Agency verification is controlled by a future administrator, not by an
-- agency owner editing their own profile.
create or replace function public.prevent_agency_status_self_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.verification_status is distinct from new.verification_status
     and auth.uid() is not null then
    raise exception 'Agency verification status can only be changed by an administrator';
  end if;
  return new;
end;
$$;

create trigger agencies_prevent_status_self_change
before update of verification_status on public.agencies
for each row execute function public.prevent_agency_status_self_change();

-- A new guest booking creates a private agency notification. Email delivery
-- requires a separately configured Supabase Edge Function and email provider.
create or replace function public.notify_agency_of_booking()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.notifications (agency_id, type, title, message)
  values (
    new.agency_id,
    'booking_request',
    'Nouvelle demande de réservation',
    'Une nouvelle demande a été envoyée pour un voyage publié.'
  );
  return new;
end;
$$;

create trigger booking_request_notification
after insert on public.booking_requests
for each row execute function public.notify_agency_of_booking();

alter table public.agencies enable row level security;
alter table public.trips enable row level security;
alter table public.trip_images enable row level security;
alter table public.itinerary_days enable row level security;
alter table public.booking_requests enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.reviews enable row level security;
alter table public.trip_views enable row level security;

-- Public agency profiles; owners can also read their own pending profile.
create policy "Public can view approved agencies"
on public.agencies for select
using (verification_status = 'approved');

create policy "Agency owners can view their profile"
on public.agencies for select to authenticated
using (user_id = (select auth.uid()));

create policy "Authenticated users can create a pending agency"
on public.agencies for insert to authenticated
with check (
  user_id = (select auth.uid())
  and verification_status = 'pending'
);

create policy "Agency owners can edit their profile"
on public.agencies for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

-- Public visitors see published trips from approved agencies. Owners can
-- manage all of their own trips, including drafts and disabled offers.
create policy "Public can view published trips from approved agencies"
on public.trips for select
using (
  status = 'published'
  and exists (
    select 1 from public.agencies a
    where a.id = agency_id and a.verification_status = 'approved'
  )
);

create policy "Agency owners can view their trips"
on public.trips for select to authenticated
using (
  exists (
    select 1 from public.agencies a
    where a.id = agency_id and a.user_id = (select auth.uid())
  )
);

create policy "Agency owners can create trips"
on public.trips for insert to authenticated
with check (
  exists (
    select 1 from public.agencies a
    where a.id = agency_id and a.user_id = (select auth.uid())
  )
);

create policy "Agency owners can edit their trips"
on public.trips for update to authenticated
using (
  exists (
    select 1 from public.agencies a
    where a.id = agency_id and a.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.agencies a
    where a.id = agency_id and a.user_id = (select auth.uid())
  )
);

create policy "Agency owners can delete their trips"
on public.trips for delete to authenticated
using (
  exists (
    select 1 from public.agencies a
    where a.id = agency_id and a.user_id = (select auth.uid())
  )
);

-- Trip images and itineraries follow the visibility and ownership of the trip.
create policy "Public can view images for public trips"
on public.trip_images for select
using (
  exists (
    select 1 from public.trips t
    where t.id = trip_id and t.status = 'published'
  )
);

create policy "Agency owners can manage trip images"
on public.trip_images for all to authenticated
using (
  exists (
    select 1 from public.trips t
    join public.agencies a on a.id = t.agency_id
    where t.id = trip_id and a.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.trips t
    join public.agencies a on a.id = t.agency_id
    where t.id = trip_id and a.user_id = (select auth.uid())
  )
);

create policy "Public can view itineraries for public trips"
on public.itinerary_days for select
using (
  exists (
    select 1 from public.trips t
    where t.id = trip_id and t.status = 'published'
  )
);

create policy "Agency owners can manage trip itineraries"
on public.itinerary_days for all to authenticated
using (
  exists (
    select 1 from public.trips t
    join public.agencies a on a.id = t.agency_id
    where t.id = trip_id and a.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.trips t
    join public.agencies a on a.id = t.agency_id
    where t.id = trip_id and a.user_id = (select auth.uid())
  )
);

-- Guests may submit a booking request, but only the target agency can read it.
create policy "Guests can request published trips"
on public.booking_requests for insert
with check (
  exists (
    select 1 from public.trips t
    join public.agencies a on a.id = t.agency_id
    where t.id = trip_id
      and t.agency_id = agency_id
      and t.status = 'published'
      and a.verification_status = 'approved'
  )
);

create policy "Agencies can view their booking requests"
on public.booking_requests for select to authenticated
using (
  exists (
    select 1 from public.agencies a
    where a.id = agency_id and a.user_id = (select auth.uid())
  )
);

create policy "Agencies can update their booking requests"
on public.booking_requests for update to authenticated
using (
  exists (
    select 1 from public.agencies a
    where a.id = agency_id and a.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.agencies a
    where a.id = agency_id and a.user_id = (select auth.uid())
  )
);

-- Direct messaging is private to the agency. Guest reply links need a
-- server-verified booking token and are intentionally not exposed as anon RLS.
create policy "Agencies can view their messages"
on public.messages for select to authenticated
using (
  exists (
    select 1 from public.booking_requests b
    join public.agencies a on a.id = b.agency_id
    where b.id = booking_request_id and a.user_id = (select auth.uid())
  )
);

create policy "Agencies can send messages for their requests"
on public.messages for insert to authenticated
with check (
  sender_type = 'agency'
  and sender_id = (select auth.uid())
  and exists (
    select 1 from public.booking_requests b
    join public.agencies a on a.id = b.agency_id
    where b.id = booking_request_id and a.user_id = (select auth.uid())
  )
);

create policy "Agencies can mark their messages read"
on public.messages for update to authenticated
using (
  exists (
    select 1 from public.booking_requests b
    join public.agencies a on a.id = b.agency_id
    where b.id = booking_request_id and a.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.booking_requests b
    join public.agencies a on a.id = b.agency_id
    where b.id = booking_request_id and a.user_id = (select auth.uid())
  )
);

create policy "Agencies can read their notifications"
on public.notifications for select to authenticated
using (
  exists (
    select 1 from public.agencies a
    where a.id = agency_id and a.user_id = (select auth.uid())
  )
);

create policy "Agencies can mark their notifications read"
on public.notifications for update to authenticated
using (
  exists (
    select 1 from public.agencies a
    where a.id = agency_id and a.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.agencies a
    where a.id = agency_id and a.user_id = (select auth.uid())
  )
);

create policy "Public can view reviews for public agencies"
on public.reviews for select
using (
  exists (
    select 1 from public.agencies a
    where a.id = agency_id and a.verification_status = 'approved'
  )
);

-- Review submission is intentionally not open to anonymous visitors. Add a
-- server-verified booking flow before granting a public insert policy.

create policy "Visitors can record views of published trips"
on public.trip_views for insert
with check (
  exists (
    select 1 from public.trips t
    where t.id = trip_id and t.status = 'published'
  )
);

create policy "Agencies can view traffic for their trips"
on public.trip_views for select to authenticated
using (
  exists (
    select 1 from public.trips t
    join public.agencies a on a.id = t.agency_id
    where t.id = trip_id and a.user_id = (select auth.uid())
  )
);

-- Public travel photos and agency branding. Store files under a first-level
-- folder named with the owning agency UUID.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('trip-images', 'trip-images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('agency-assets', 'agency-assets', true, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('agency-documents', 'agency-documents', false, 10485760, array['application/pdf', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

create policy "Public can view trip and agency images"
on storage.objects for select
using (bucket_id in ('trip-images', 'agency-assets'));

create policy "Agency owners can upload trip and agency images"
on storage.objects for insert to authenticated
with check (
  bucket_id in ('trip-images', 'agency-assets')
  and exists (
    select 1 from public.agencies a
    where a.id::text = (storage.foldername(name))[1]
      and a.user_id = (select auth.uid())
  )
);

create policy "Agency owners can update trip and agency images"
on storage.objects for update to authenticated
using (
  bucket_id in ('trip-images', 'agency-assets')
  and exists (
    select 1 from public.agencies a
    where a.id::text = (storage.foldername(name))[1]
      and a.user_id = (select auth.uid())
  )
)
with check (
  bucket_id in ('trip-images', 'agency-assets')
  and exists (
    select 1 from public.agencies a
    where a.id::text = (storage.foldername(name))[1]
      and a.user_id = (select auth.uid())
  )
);

create policy "Agency owners can delete trip and agency images"
on storage.objects for delete to authenticated
using (
  bucket_id in ('trip-images', 'agency-assets')
  and exists (
    select 1 from public.agencies a
    where a.id::text = (storage.foldername(name))[1]
      and a.user_id = (select auth.uid())
  )
);

create policy "Agency owners can manage their private verification documents"
on storage.objects for all to authenticated
using (
  bucket_id = 'agency-documents'
  and exists (
    select 1 from public.agencies a
    where a.id::text = (storage.foldername(name))[1]
      and a.user_id = (select auth.uid())
  )
)
with check (
  bucket_id = 'agency-documents'
  and exists (
    select 1 from public.agencies a
    where a.id::text = (storage.foldername(name))[1]
      and a.user_id = (select auth.uid())
  )
);