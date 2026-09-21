-- Run ONCE in Supabase SQL Editor, after importing participants.csv and feedback.csv.
-- CSV import only creates plain columns. This fixes types, defaults and the safety rules.

-- 1. remove the sample rows
delete from participants;
delete from feedback;

-- 2. correct column types and defaults
alter table participants
  alter column id type uuid using id::uuid,
  alter column created_at type timestamptz using created_at::timestamptz,
  alter column created_at set default now(),
  alter column dob type date using dob::date,
  alter column interests type text[] using string_to_array(interests, ','),
  alter column availability type text[] using string_to_array(availability, ','),
  alter column availability set default '{}',
  alter column city set default 'Demo City',
  alter column name set not null,
  alter column email set not null,
  alter column dob set not null,
  alter column gender set not null,
  alter column neighborhood set not null,
  alter column interests set not null,
  alter column consent_data set not null,
  alter column consent_version set not null;

alter table feedback
  alter column id type uuid using id::uuid,
  alter column created_at type timestamptz using created_at::timestamptz,
  alter column created_at set default now(),
  alter column participant_id type uuid using participant_id::uuid,
  alter column rating set not null,
  alter column consent_store set not null,
  alter column consent_quote set default false,
  alter column consent_contact set default false,
  alter column consent_version set not null;

-- 3. validation rules
alter table participants
  add constraint p_dob_18 check (dob <= current_date - interval '18 years'),
  add constraint p_gender check (gender in ('Woman','Man','Non-binary')),
  add constraint p_hood check (neighborhood in ('Central Market','Lakeside','Old Quarter')),
  add constraint p_interests check (cardinality(interests) >= 1),
  add constraint p_consent check (consent_data = true);
create unique index participants_email_uq on participants (lower(email));

alter table feedback
  add constraint f_rating check (rating between 1 and 5),
  add constraint f_use check (would_use in ('Yes','Maybe','No')),
  add constraint f_consent check (consent_store = true);

-- 4. privacy: visitors can add rows, nobody can read them through the public API
alter table participants enable row level security;
alter table feedback enable row level security;
grant insert on participants to anon;
grant insert on feedback to anon;
create policy "anyone can sign up" on participants for insert to anon with check (consent_data = true);
create policy "anyone can send feedback" on feedback for insert to anon with check (consent_store = true);
