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
