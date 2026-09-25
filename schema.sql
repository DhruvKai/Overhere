-- Run this once in the Supabase SQL editor.
-- Visitors (the anon role) can INSERT only. Nobody can read rows through the public
-- API; you view and export data in the Supabase dashboard (Table Editor).

create table if not exists participants (
  id              uuid primary key,
  created_at      timestamptz not null default now(),
  name            text not null check (char_length(name) between 1 and 80),
  email           text not null check (char_length(email) between 3 and 120),
  dob             date not null check (dob <= current_date - interval '18 years'),
  gender          text not null check (gender in ('Woman','Man','Non-binary')),
  city            text not null default 'Demo City',
  neighborhood    text not null check (neighborhood in ('Central Market','Lakeside','Old Quarter')),
  interests       text[] not null check (cardinality(interests) >= 1),
  availability    text[] not null default '{}',
  consent_data    boolean not null check (consent_data = true),
  consent_version text not null
);
create unique index if not exists participants_email_uq on participants (lower(email));

create table if not exists feedback (
  id              uuid primary key,
  created_at      timestamptz not null default now(),
  participant_id  uuid,                       -- no foreign key on purpose; may be null
  rating          int  not null check (rating between 1 and 5),
  liked           text check (char_length(liked) <= 1000),
  improve         text check (char_length(improve) <= 1000),
  would_use       text check (would_use in ('Yes','Maybe','No')),
  consent_store   boolean not null check (consent_store = true),
  consent_quote   boolean not null default false,   -- may quote publicly, anonymised
  consent_contact boolean not null default false,   -- may follow up
  consent_version text not null
);

alter table participants enable row level security;
alter table feedback     enable row level security;

create policy "anyone can sign up"      on participants for insert to anon with check (consent_data = true);
create policy "anyone can send feedback" on feedback     for insert to anon with check (consent_store = true);
-- No select/update/delete policies: the public API cannot read or change rows.

-- Deleting someone's data on request (run manually):
--   delete from feedback     where participant_id = '<id>';
--   delete from participants where lower(email) = lower('<their email>');

-- =====================================================================================
-- Added later: usage events + the admin dashboard. If you already ran the part above,
-- run only from here down (once).
-- =====================================================================================

-- What testers do in the sample app (button taps, not personal content). Insert-only, like the rest.
create table if not exists events (
  id             uuid primary key,
  created_at     timestamptz not null default now(),
  participant_id uuid,                       -- null for admin demo accounts
  session_id     uuid,
  name           text  not null check (name ~ '^[a-z_]{2,40}$'),
  props          jsonb not null default '{}'::jsonb check (pg_column_size(props) <= 2000)
);
create index if not exists events_name_idx on events (name);
alter table events enable row level security;
create policy "anyone can log events" on events for insert to anon with check (true);

-- Dashboard password. Nobody can read this table through the API (no policies).
-- Set yours (10+ characters) by running:   insert into admin_secret (pass) values ('your-long-password');
-- Change it later with:                    update admin_secret set pass = 'new-long-password';
create table if not exists admin_secret (pass text not null check (char_length(pass) >= 10));
alter table admin_secret enable row level security;

-- dashboard.html calls this with the password. It returns totals only, never names or emails,
-- and feedback text only where the person agreed to be quoted.
create or replace function admin_stats(pass text) returns jsonb
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from admin_secret s where s.pass = admin_stats.pass) then
    perform pg_sleep(1);                     -- slows down password guessing
    raise exception 'wrong password';
  end if;
  return jsonb_build_object(
    'participants',   (select count(*) from participants),
    'by_gender',      (select coalesce(jsonb_object_agg(gender, n), '{}') from (select gender, count(*) n from participants group by gender) x),
    'by_hood',        (select coalesce(jsonb_object_agg(neighborhood, n), '{}') from (select neighborhood, count(*) n from participants group by neighborhood) x),
    'by_interest',    (select coalesce(jsonb_object_agg(i, n), '{}') from (select unnest(interests) i, count(*) n from participants group by 1) x),
    'signups_by_day', (select coalesce(jsonb_object_agg(d, n), '{}') from (select to_char(created_at at time zone 'Asia/Kolkata', 'YYYY-MM-DD') d, count(*) n from participants where created_at > now() - interval '30 days' group by 1) x),
    'feedback',       (select count(*) from feedback),
    'avg_rating',     (select round(avg(rating)::numeric, 2) from feedback),
    'rating_dist',    (select coalesce(jsonb_object_agg(rating, n), '{}') from (select rating, count(*) n from feedback group by rating) x),
    'would_use',      (select coalesce(jsonb_object_agg(coalesce(would_use, 'No answer'), n), '{}') from (select would_use, count(*) n from feedback group by would_use) x),
    'quotes',         (select coalesce(jsonb_agg(jsonb_build_object('rating', rating, 'liked', liked, 'improve', improve, 'at', created_at) order by created_at desc), '[]')
                         from (select * from feedback where consent_quote and (liked is not null or improve is not null) order by created_at desc limit 30) x),
    'events',         (select coalesce(jsonb_object_agg(name, n), '{}') from (select name, count(*) n from events group by name) x),
    'micro',          (select coalesce(jsonb_object_agg(m, jsonb_build_object('avg', a, 'n', n)), '{}')
                         from (select props->>'moment' m, round(avg((props->>'score')::int), 2) a, count(*) n from events
                               where name = 'micro_feedback' and props->>'score' ~ '^[1-4]$' and props->>'moment' ~ '^[a-z_]{1,20}$' group by 1) x),
    'tried',          (select count(distinct participant_id) from events where participant_id is not null),
    'sessions_30d',   (select count(distinct session_id) from events where created_at > now() - interval '30 days')
  );
end $$;
revoke all on function admin_stats(text) from public;
grant execute on function admin_stats(text) to anon;
