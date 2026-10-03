-- =====================================================================================
-- Overhere shared app: accounts, activities, requests, chat and notifications.
-- Run this once in the Supabase SQL editor, after schema.sql. Running it again is safe:
-- it only replaces the functions, and the sample people and plans are added only once.
--
-- How it is protected: every table has row level security turned on and NO policies, so the
-- browser cannot read or change a table directly. The app only calls the functions at the
-- bottom of this file. Each one checks who is signed in (auth.uid()) and what they may do,
-- for example that a women-only plan is never sent to someone whose profile says Man.
-- =====================================================================================

-- ---------- tables ----------

-- One row per person. Real people use their login id; the 12 sample hosts have fixed ids and no login.
create table if not exists profiles (
  id          uuid primary key,
  is_sample   boolean not null default false,
  email       text,                                         -- private, never sent to other people
  name        text not null check (char_length(name) between 1 and 40),
  dob         date not null check (dob <= current_date - interval '18 years'),
  gender      text not null check (gender in ('Woman','Man','Non-binary')),
  hood        text not null check (char_length(hood) between 1 and 80),  -- home area, e.g. "Koramangala, Bengaluru"
  lat         double precision,                             -- its centre (rounded to about 1 km); null only on old rows
  lng         double precision,
  job         text not null default '' check (char_length(job) <= 40),
  bio         text not null default '' check (char_length(bio) <= 300),
  ints        text[] not null default '{}' check (ints <@ array['Movies','Cafe / Food','Concerts']),
  avail       text[] not null default '{}' check (avail <@ array['Weekday evenings','Weekend days','Weekend evenings','Late nights']),
  emo         text not null default '' check (char_length(emo) <= 16),
  face        boolean not null default false,               -- face check passed; only set by the server (see verifications)
  kyc         boolean not null default false,               -- ID check passed; only set by the server
  onboarded   boolean not null default false,
  trust_met   int not null default 0,                       -- meetups before the app (sample people only)
  trust_shows int not null default 0,
  hist        jsonb not null default '[]',                  -- past plans before the app (sample people only)
  state       jsonb not null default '{}' check (pg_column_size(state) <= 60000),  -- private settings: alerts, follows, trusted contact...
  consent_version text,                                     -- which consent text they agreed to, and when
  consent_at  timestamptz,
  created_at  timestamptz not null default now()
);

create table if not exists activities (
  id            uuid primary key default gen_random_uuid(),
  host          uuid not null references profiles(id) on delete cascade,
  cat           text not null check (cat in ('movies','cafe','concerts')),
  description   text not null check (char_length(description) between 1 and 160),
  cap           int  not null check (cap between 1 and 10),  -- people who can join, not counting the host
  starts_at     timestamptz not null,
  audience      text[] check (audience is null or (cardinality(audience) between 1 and 3 and audience <@ array['Woman','Man','Non-binary'])),  -- null = everyone
  venue         text not null check (char_length(venue) between 1 and 120),
  cost          text not null check (cost in ('split','own','host')),
  total         int check (total between 0 and 1000000),
  hood          text not null check (char_length(hood) between 1 and 80),  -- the host's home area when posted
  lat           double precision,                            -- where the venue is; null only on plans from before
  lng           double precision,
  repeat        text check (repeat in ('weekly','biweekly','monthly')),
  status        text not null default 'open' check (status in ('open','full')),
  next_id       uuid,                                        -- the next occurrence, once posted
  sample_period interval,                                    -- sample plans move forward by this once they pass
  created_at    timestamptz not null default now()
);
create index if not exists activities_starts_idx on activities (starts_at);
create index if not exists activities_host_idx on activities (host);

-- Join requests. Accepted requests are the members of an activity.
create table if not exists requests (
  id         uuid primary key default gen_random_uuid(),
  act        uuid not null references activities(id) on delete cascade,
  user_id    uuid not null references profiles(id) on delete cascade,
  note       text not null default '' check (char_length(note) <= 100),
  status     text not null check (status in ('pending','accepted','rejected','waitlist','left','removed')),
  created_at timestamptz not null default now(),
  unique (act, user_id)
);
create index if not exists requests_user_idx on requests (user_id);
-- 'monthly' repeats came later: widen the check on databases made before it.
alter table activities drop constraint if exists activities_repeat_check;
alter table activities add constraint activities_repeat_check check (repeat in ('weekly','biweekly','monthly'));
-- 'removed' (taken out of the group by the host) came later: widen the check on databases made before it.
alter table requests drop constraint if exists requests_status_check;
alter table requests add constraint requests_status_check check (status in ('pending','accepted','rejected','waitlist','left','removed'));
-- All of India came later (the beta started in three Chandigarh sectors): any home area, and coordinates for
-- homes and venues. Widen the checks and add the columns on databases made before it.
alter table profiles drop constraint if exists profiles_hood_check;
alter table profiles add constraint profiles_hood_check check (char_length(hood) between 1 and 80);
alter table activities drop constraint if exists activities_hood_check;
alter table activities add constraint activities_hood_check check (char_length(hood) between 1 and 80);
alter table profiles add column if not exists lat double precision, add column if not exists lng double precision;
alter table activities add column if not exists lat double precision, add column if not exists lng double precision;
alter table profiles drop constraint if exists profiles_ll_check;
alter table profiles add constraint profiles_ll_check check ((lat is null) = (lng is null) and (lat is null or (lat between 6 and 37.5 and lng between 68 and 97.5)));
alter table activities drop constraint if exists activities_ll_check;
alter table activities add constraint activities_ll_check check ((lat is null) = (lng is null) and (lat is null or (lat between 6 and 37.5 and lng between 68 and 97.5)));
update profiles set hood = hood || ', Chandigarh',
  lat = case hood when 'Sector 22' then 30.73 else 30.74 end,
  lng = case hood when 'Sector 7' then 76.80 when 'Sector 22' then 76.77 else 76.78 end
where hood in ('Sector 17','Sector 7','Sector 22') and lat is null;
update activities set hood = hood || ', Chandigarh' where hood in ('Sector 17','Sector 7','Sector 22');
-- A home area named with its city twice ("Sector 17, Chandigarh, Chandigarh"): keep it once.
update profiles set hood = regexp_replace(hood, ', ([^,]+), \1$', ', \1') where hood ~ ', ([^,]+), \1$';

create table if not exists messages (
  id         bigint generated always as identity primary key,
  act        uuid not null references activities(id) on delete cascade,
  sender     uuid references profiles(id) on delete set null,
  sys        boolean not null default false,                 -- "Chat created", "Priya joined the chat"...
  body       text not null check (char_length(body) between 1 and 500),
  poll       jsonb,                                          -- {"q": "...", "opts": ["...", "..."]}
  created_at timestamptz not null default now()
);
create index if not exists messages_act_idx on messages (act);

create table if not exists poll_votes (
  msg     bigint not null references messages(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  opt     int not null check (opt between 0 and 3),
  primary key (msg, user_id)
);

create table if not exists notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  kind       text not null check (kind in ('req','update','remind')),
  title      text not null check (char_length(title) <= 80),
  tag        text not null default '' check (char_length(tag) <= 30),
  tone       text not null default '' check (char_length(tone) <= 10),
  act        uuid,                                           -- no foreign key: the activity may be cancelled later
  body       text not null check (char_length(body) <= 400),
  flags      text[] not null default '{}',                   -- 'check', 'safe', 'chat'
  read       boolean not null default false,
  key        text check (char_length(key) <= 80),            -- stops the same reminder being sent twice
  created_at timestamptz not null default now(),
  unique (user_id, key)
);
create index if not exists notifications_user_idx on notifications (user_id, created_at desc);

-- After a meetup: did it go OK, how much you enjoyed it, and who showed up.
create table if not exists ratings (
  act        uuid not null references activities(id) on delete cascade,
  rater      uuid not null references profiles(id) on delete cascade,
  ok         text not null check (ok in ('yes','no')),
  stars      int  not null check (stars between 1 and 5),
  people     jsonb not null default '{}',                    -- {"<person id>": "show" | "noshow"}
  created_at timestamptz not null default now(),
  primary key (act, rater)
);

create table if not exists reports (
  id         uuid primary key default gen_random_uuid(),
  reporter   uuid references profiles(id) on delete set null,
  target     uuid,
  act        uuid,
  msg        bigint,
  msg_text   text,
  reason     text not null check (char_length(reason) <= 80),
  note       text not null default '' check (char_length(note) <= 500),
  created_at timestamptz not null default now()
);

create table if not exists blocks (
  blocker uuid not null references profiles(id) on delete cascade,
  blocked uuid not null references profiles(id) on delete cascade,
  primary key (blocker, blocked)
);

-- Demo accounts (Kajal, Arjun, Neha): when someone signs in with one of these emails, the profile is made from here.
create table if not exists profile_presets (
  email text primary key,
  data  jsonb not null
);

-- A tiny table the app listens to (Supabase Realtime). A row changes when something changed for that
-- person, and the app reloads. The all-zero id is for everyone, e.g. when a new plan is posted.
create table if not exists pings (
  user_id uuid primary key,
  at      timestamptz not null default now()
);

create table if not exists app_meta (
  k text primary key,
  v timestamptz not null
);

-- Settings you change by hand in the SQL editor (see the comments on each).
create table if not exists app_config (
  k text primary key,
  v text not null
);
insert into app_config (k, v) values
  -- 'simulated': the check is pretend (anyone passes). 'live': only the Edge Functions in
  -- supabase/functions, talking to a real provider, can mark it as passed. See face-scan.md.
  ('face_check', 'simulated'),
  ('id_check', 'simulated'),
  -- 'on' only once Authentication -> Sign In / Providers -> Email has "Confirm email" switched on
  -- (with your own SMTP). Then someone who signed up with the old beta form and makes an account with
  -- the same email gets their details filled in. Google sign-ins always get it, because Google has
  -- confirmed the email. Left 'off', nobody can claim someone else's email to see their details.
  ('prefill_email_signups', 'off')
on conflict (k) do nothing;

-- Every face / ID check attempt. Never images or ID numbers, only the outcome.
create table if not exists verifications (
  id         uuid primary key default gen_random_uuid(),
  seq        bigint generated always as identity,          -- order of attempts
  user_id    uuid not null references profiles(id) on delete cascade,
  kind       text not null check (kind in ('face','kyc')),
  status     text not null check (status in ('started','passed','failed','review','approved','rejected')),
  provider   text not null check (char_length(provider) <= 30),
  session_id text check (char_length(session_id) <= 200),
  score      numeric,
  detail     jsonb not null default '{}' check (pg_column_size(detail) <= 4000),
  created_at timestamptz not null default now()
);
create index if not exists verifications_user_idx on verifications (user_id, kind, created_at desc);

-- Sign-ups from the old beta form are linked to the account made with the same email.
alter table participants add column if not exists user_id uuid;
-- Usage statistics are opt-in: nothing is logged unless the person ticks "Share usage statistics" (onboarding or Profile).
alter table profiles add column if not exists usage_ok boolean not null default false;

alter table profiles        enable row level security;
alter table activities      enable row level security;
alter table requests        enable row level security;
alter table messages        enable row level security;
alter table poll_votes      enable row level security;
alter table notifications   enable row level security;
alter table ratings         enable row level security;
alter table reports         enable row level security;
alter table blocks          enable row level security;
alter table profile_presets enable row level security;
alter table pings           enable row level security;
alter table app_meta        enable row level security;
alter table app_config      enable row level security;
alter table verifications   enable row level security;

-- Belt and braces: the browser roles get no table rights at all (reading pings is the one exception,
-- for Realtime). Without this, Supabase's default grants would rely on row level security alone.
revoke all on table profiles, activities, requests, messages, poll_votes, notifications, ratings, reports, blocks,
  profile_presets, pings, app_meta, app_config, verifications from anon, authenticated;
grant select on table pings to authenticated;

drop policy if exists "see your own pings" on pings;
create policy "see your own pings" on pings for select to authenticated
  using (user_id = auth.uid() or user_id = '00000000-0000-0000-0000-000000000000');
do $$ begin alter publication supabase_realtime add table pings; exception when others then null; end $$;

-- The old beta tables accept no direct writes from the browser any more: the sign-up form is gone, and usage
-- events and feedback go through log_event() and send_feedback() below, which set who sent them and limit how many.
drop policy if exists "anyone can sign up" on participants;
drop policy if exists "anyone can send feedback" on feedback;
drop policy if exists "anyone can log events" on events;
drop policy if exists "signed-in people can log events" on events;
revoke insert, update, delete on table participants, feedback, events from anon, authenticated;
create index if not exists events_session_idx on events (session_id, created_at);
create index if not exists events_participant_idx on events (participant_id, created_at);

-- Dashboard password: stored as a bcrypt hash (a plain one set with insert/update is hashed on save), and after
-- 20 wrong tries in 15 minutes the dashboard refuses every password until the 15 minutes pass.
create extension if not exists pgcrypto with schema extensions;
create table if not exists admin_fails (at timestamptz not null default now());
alter table admin_fails enable row level security;
revoke all on table admin_fails from anon, authenticated;
create or replace function _admin_hash() returns trigger language plpgsql as $$
begin
  if new.pass !~ '^\$2[abxy]\$[0-9]{2}\$' then
    if char_length(new.pass) < 10 then raise exception 'Use a dashboard password of 10 or more characters'; end if;
    new.pass := extensions.crypt(new.pass, extensions.gen_salt('bf', 10));
  end if;
  return new;
end $$;
drop trigger if exists admin_secret_hash on admin_secret;
create trigger admin_secret_hash before insert or update on admin_secret for each row execute function _admin_hash();
update admin_secret set pass = pass where pass !~ '^\$2[abxy]\$[0-9]{2}\$';   -- hashes a password saved before this

-- ---------- internal helpers (not callable from the browser) ----------

create or replace function _uid() returns uuid language plpgsql stable as $$
declare u uuid := auth.uid();
begin
  if u is null then raise exception 'Please sign in again'; end if;
  return u;
end $$;

create or replace function _name(p uuid) returns text language sql stable as $$
  select coalesce((select name from profiles where id = p), 'Someone') $$;

create or replace function _is_sample(p uuid) returns boolean language sql stable as $$
  select coalesce((select is_sample from profiles where id = p), false) $$;

create or replace function _short(t text) returns text language sql immutable as $$
  select case when char_length(t) > 40 then left(t, 40) || '…' else t end $$;

create or replace function _when(t timestamptz) returns text language sql stable as $$
  select to_char(t at time zone 'Asia/Kolkata', 'Dy DD Mon, FMHH12:MI AM') $$;

create or replace function _ms(t timestamptz) returns bigint language sql immutable as $$
  select (extract(epoch from t) * 1000)::bigint $$;

create or replace function _ping(us uuid[]) returns void language sql as $$
  insert into pings (user_id, at)
  select distinct x, clock_timestamp() from unnest(us) x where x is not null
  on conflict (user_id) do update set at = excluded.at $$;

create or replace function _members(p_act uuid) returns uuid[] language sql stable as $$
  select coalesce(array_agg(user_id order by created_at), '{}') from requests where act = p_act and status = 'accepted' $$;

create or replace function _spots(p_act uuid) returns int language sql stable as $$
  select a.cap - (select count(*)::int from requests r where r.act = a.id and r.status = 'accepted')
  from activities a where a.id = p_act $$;

create or replace function _blocked(x uuid, y uuid) returns boolean language sql stable as $$
  select exists (select 1 from blocks where (blocker = x and blocked = y) or (blocker = y and blocked = x)) $$;

-- Is this activity open to this person? Audience (gender) and blocks in either direction.
-- Plans limited to some genders (e.g. women-only) are shown only to people whose face check has passed.
-- The ID check is switched off for now, so the gender is what the person typed in; the host still approves every request.
create or replace function _eligible(a activities, viewer uuid) returns boolean language sql stable as $$
  select (a.audience is null or exists (select 1 from profiles p where p.id = viewer and p.face and p.gender = any (a.audience)))
     and not _blocked(viewer, a.host) $$;

-- A notification for one person. Sample people never get any. With a key, the same one is not sent twice.
create or replace function _note(p_user uuid, p_kind text, p_title text, p_tag text, p_tone text, p_act uuid,
                                 p_body text, p_flags text[] default '{}', p_key text default null)
returns void language plpgsql as $$
begin
  if p_user is null or _is_sample(p_user) then return; end if;
  insert into notifications (user_id, kind, title, tag, tone, act, body, flags, key)
  values (p_user, p_kind, left(p_title, 80), left(p_tag, 30), left(p_tone, 10), p_act, left(p_body, 400), p_flags, p_key)
  on conflict (user_id, key) do nothing;
  perform _ping(array[p_user]);
end $$;

create or replace function _sys(p_act uuid, p_body text) returns void language sql as $$
  insert into messages (act, sys, body) values (p_act, true, left(p_body, 500)) $$;

create or replace function _fill_up(p_act uuid) returns void language plpgsql as $$
declare a activities; r record;
begin
  select * into a from activities where id = p_act;
  update activities set status = 'full' where id = p_act;
  for r in select * from requests where act = p_act and status = 'pending' loop
    update requests set status = 'waitlist' where id = r.id;
    perform _note(r.user_id, 'req', 'Moved to waitlist', 'Waitlist', 'info', p_act,
      format('"%s" filled up before your request was accepted. You''re on the waitlist and move up if a spot opens.', _short(a.description)));
  end loop;
  perform _note(a.host, 'update', 'Activity full', 'Full', 'acc', p_act, format('Your activity "%s" is now full.', _short(a.description)));
end $$;

create or replace function _accept(p_req uuid) returns void language plpgsql as $$
declare r requests; a activities;
begin
  select * into r from requests where id = p_req for update;
  if not found or r.status <> 'pending' then return; end if;
  select * into a from activities where id = r.act for update;
  if _spots(a.id) <= 0 then return; end if;
  update requests set status = 'accepted' where id = p_req;
  if not exists (select 1 from messages where act = a.id) then perform _sys(a.id, 'Chat created'); end if;
  perform _sys(a.id, _name(r.user_id) || ' joined the chat');
  perform _note(r.user_id, 'req', 'Request Accepted 🎉', 'Accepted', 'ok', a.id,
    format('%s accepted your join request for "%s".', _name(a.host), _short(a.description)));
  if _spots(a.id) <= 0 and a.status = 'open' then perform _fill_up(a.id); end if;
  perform _ping(array[a.host] || _members(a.id));
end $$;

-- A spot freed up: reopen the activity and move waitlisted people up, oldest first.
create or replace function _spot_opened(p_act uuid) returns void language plpgsql as $$
declare a activities; free int; r record;
begin
  select * into a from activities where id = p_act;
  if a.status = 'full' and _spots(p_act) > 0 then
    update activities set status = 'open' where id = p_act;
    a.status := 'open';
  end if;
  if a.status <> 'open' or a.starts_at <= now() then return; end if;
  free := greatest(0, _spots(p_act) - (select count(*)::int from requests where act = p_act and status = 'pending'));
  for r in select * from requests where act = p_act and status = 'waitlist' order by created_at limit free loop
    update requests set status = 'pending' where id = r.id;
    perform _note(r.user_id, 'req', 'Off the waitlist', 'Pending', 'warn', p_act,
      format('A spot opened up in "%s". Your request is off the waitlist and now with %s.', _short(a.description), _name(a.host)));
    perform _note(a.host, 'req', 'New join request', 'Pending', 'warn', p_act,
      format('%s moved up from the waitlist for "%s".', _name(r.user_id), _short(a.description)));
    if _is_sample(a.host) then perform _accept(r.id); end if;
  end loop;
end $$;

-- One chat notification per chat per person: it is updated (and marked unread) instead of piling up.
create or replace function _chat_note(p_act uuid, p_from uuid, p_text text) returns void language plpgsql as $$
declare a activities; p uuid;
begin
  select * into a from activities where id = p_act;
  foreach p in array (array[a.host] || _members(p_act)) loop
    continue when p = p_from or _is_sample(p);
    continue when coalesce((select state -> 'muted' ->> p_act::text from profiles where id = p), '') = 'true';
    insert into notifications (user_id, kind, title, tag, tone, act, body, flags, key)
    values (p, 'update', left(format('New message in "%s"', _short(a.description)), 80), 'Chat', 'info', p_act,
            left(_name(p_from) || ': ' || p_text, 400), '{chat}', 'chat:' || p_act)
    on conflict (user_id, key) do update set body = excluded.body, title = excluded.title, read = false, created_at = now();
  end loop;
end $$;

-- Clock helpers for the sample plans (Chandigarh time).
create or replace function _t_next(hr int, mi int default 0) returns timestamptz language sql stable as $$
  select case when t < now() + interval '1 hour' then t + interval '1 day' else t end
  from (select (((now() at time zone 'Asia/Kolkata')::date + make_time(hr, mi, 0)) at time zone 'Asia/Kolkata') t) x $$;

create or replace function _t_at(d int, hr int, mi int default 0) returns timestamptz language sql stable as $$
  select ((((now() at time zone 'Asia/Kolkata')::date + d) + make_time(hr, mi, 0)) at time zone 'Asia/Kolkata') $$;

-- Runs at most every 2 minutes, from app_state():
--  * repeating plans get their next occurrence once they pass
--  * sample plans move forward so the app never runs empty; if real people joined one, it stays in
--    their history and a fresh copy is posted instead
create or replace function _housekeeping() returns void language plpgsql as $$
declare a activities; nid uuid; nxt timestamptz; step interval; n_step int;
begin
  if not pg_try_advisory_xact_lock(4242) then return; end if;
  if exists (select 1 from app_meta where k = 'housekeeping' and v > now() - interval '2 minutes') then return; end if;
  insert into app_meta (k, v) values ('housekeeping', now()) on conflict (k) do update set v = excluded.v;

  for a in select * from activities where repeat is not null and next_id is null and sample_period is null and starts_at <= now() loop
    step := case a.repeat when 'monthly' then interval '1 month' when 'biweekly' then interval '14 days' else interval '7 days' end;
    -- months differ in length, so step from the first date (the 31st stays the 31st or the month's last day)
    n_step := greatest(1, floor(extract(epoch from now() - a.starts_at) / extract(epoch from step))::int - 1);
    loop nxt := a.starts_at + step * n_step; exit when nxt > now(); n_step := n_step + 1; end loop;
    insert into activities (host, cat, description, cap, starts_at, audience, venue, cost, total, hood, lat, lng, repeat)
    values (a.host, a.cat, a.description, a.cap, nxt, a.audience, a.venue, a.cost, a.total, a.hood, a.lat, a.lng, a.repeat)
    returning id into nid;
    update activities set next_id = nid where id = a.id;
    perform _note(a.host, 'update', 'Repeat posted', case a.repeat when 'monthly' then 'Every month' when 'biweekly' then 'Every 2 weeks' else 'Every week' end, 'info', nid,
      format('The next "%s" is posted for %s.', _short(a.description), _when(nxt)));
  end loop;

  for a in select * from activities where sample_period is not null and starts_at <= now() loop
    nxt := a.starts_at + a.sample_period * (floor(extract(epoch from now() - a.starts_at) / extract(epoch from a.sample_period)) + 1);
    if exists (select 1 from requests r join profiles p on p.id = r.user_id where r.act = a.id and not p.is_sample) then
      insert into activities (host, cat, description, cap, starts_at, audience, venue, cost, total, hood, lat, lng, repeat, sample_period)
      values (a.host, a.cat, a.description, a.cap, nxt, a.audience, a.venue, a.cost, a.total, a.hood, a.lat, a.lng, a.repeat, a.sample_period)
      returning id into nid;
      insert into requests (act, user_id, status, created_at)
      select nid, r.user_id, 'accepted', r.created_at from requests r join profiles p on p.id = r.user_id
      where r.act = a.id and p.is_sample and r.status = 'accepted';
      if exists (select 1 from requests where act = nid) then perform _seed_chat(nid); end if;
      update activities set status = case when _spots(nid) <= 0 then 'full' else 'open' end where id = nid;
      update activities set sample_period = null, repeat = null where id = a.id;
    else
      update activities set starts_at = nxt where id = a.id;
    end if;
  end loop;

  -- Logins that never finished sign-up (no profile after 7 days, for example someone under 18 who stopped at the
  -- date of birth) are deleted, so nothing from the attempt is kept. Demo accounts (profile_presets) are kept.
  delete from auth.users x where x.created_at < now() - interval '7 days'
    and not exists (select 1 from profiles p where p.id = x.id)
    and not exists (select 1 from profile_presets pp where pp.email = lower(coalesce(x.email, '')));
end $$;

create or replace function _seed_chat(p_act uuid) returns void language plpgsql as $$
declare a activities; other uuid;
begin
  select * into a from activities where id = p_act;
  other := coalesce((_members(p_act))[1], a.host);
  insert into messages (act, sender, sys, body, created_at) values
    (p_act, null,    true,  'Chat created',                                now() - interval '2 hours'),
    (p_act, null,    true,  'Sample plan: these messages are examples, and nobody will actually be there.', now() - interval '2 hours'),
    (p_act, a.host,  false, 'Hi! This is how a group chat looks.',         now() - interval '1 hour'),
    (p_act, other,   false, 'You can make polls and share plans here.',    now() - interval '50 minutes');
end $$;

-- ---------- verification (face scan and ID check) ----------

create or replace function _simulated(p_kind text) returns boolean language sql stable as $$
  select coalesce((select v from app_config where k = case p_kind when 'face' then 'face_check' else 'id_check' end), 'simulated') = 'simulated' $$;

create or replace function _modes() returns jsonb language sql stable as $$
  select jsonb_build_object('face', case when _simulated('face') then 'simulated' else 'live' end,
                            'kyc',  case when _simulated('kyc')  then 'simulated' else 'live' end) $$;

-- May this sign-in see details from the old beta sign-up form with the same email? Only when the email is proven.
create or replace function _may_prefill() returns boolean language sql stable as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'provider', '') = 'google'
      or (coalesce((select v from app_config where k = 'prefill_email_signups'), 'off') = 'on'
          and exists (select 1 from auth.users where id = auth.uid() and email_confirmed_at is not null)) $$;

-- Tries allowed per check before a person on the team has to review it. Every try counts: a live check counts when
-- it starts (so cancelled, abandoned or broken scans count too), a simulated one when it fails.
create or replace function _verify_max() returns int language sql immutable as $$ select 5 $$;

-- Per check, since the last pass / reviewer decision: failed attempts, all attempts, and whether it waits for review.
create or replace function _verify_state(p_user uuid) returns jsonb language sql volatile as $$
  select jsonb_object_agg(k, jsonb_build_object(
    'fails', (select count(*) from verifications v where v.user_id = p_user and v.kind = k and v.status = 'failed'
              and v.seq > coalesce((select max(w.seq) from verifications w
                                    where w.user_id = p_user and w.kind = k and w.status in ('passed','approved','rejected')), 0)),
    'attempts', (select count(*) from verifications v where v.user_id = p_user and v.kind = k
                 and (v.status = 'started' or (v.status = 'failed' and v.provider = 'simulated'))
                 and v.seq > coalesce((select max(w.seq) from verifications w
                                       where w.user_id = p_user and w.kind = k and w.status in ('passed','approved','rejected')), 0)),
    'max', _verify_max(),
    'review', coalesce((select v.status = 'review' from verifications v where v.user_id = p_user and v.kind = k and v.status <> 'started'
                        order by v.seq desc limit 1), false)))
  from unnest(array['face','kyc']) k $$;

-- Block further tries and put the person in the /addmin review queue (once), telling them what happens next.
create or replace function _verify_to_review(p_user uuid, p_kind text, p_provider text) returns void language plpgsql as $$
begin
  if (_verify_state(p_user) -> p_kind ->> 'review')::boolean then return; end if;
  insert into verifications (user_id, kind, status, provider) values (p_user, p_kind, 'review', left(p_provider, 30));
  perform _note(p_user, 'update', 'Sent for review', case when p_kind = 'face' then 'Face check' else 'ID check' end, 'warn', null,
    format('That was %s tries, so a person on our team will now check it by hand. We will send you a notification when it is done.', _verify_max()));
  perform _ping(array[p_user]);
end $$;

-- Record one attempt. A pass sets the profile flag; a failure on the last allowed try sends it to human review.
create or replace function _verify_record(p_user uuid, p_kind text, p_passed boolean, p_provider text, p_session text,
                                          p_score numeric, p_detail jsonb) returns text language plpgsql as $$
declare st text;
begin
  if (_verify_state(p_user) -> p_kind ->> 'review')::boolean then return 'review'; end if;
  st := case when p_passed then 'passed' else 'failed' end;
  insert into verifications (user_id, kind, status, provider, session_id, score, detail)
  values (p_user, p_kind, st, p_provider, p_session, p_score, coalesce(p_detail, '{}'));
  if p_passed then
    if p_kind = 'face' then update profiles set face = true where id = p_user;
    else update profiles set kyc = true where id = p_user; end if;
  elsif (_verify_state(p_user) -> p_kind ->> 'attempts')::int >= _verify_max() then
    perform _verify_to_review(p_user, p_kind, p_provider);
    st := 'review';
  end if;
  perform _ping(array[p_user]);
  return st;
end $$;

-- ---------- functions the app calls ----------

-- Simulated checks, only while app_config face_check / id_check = 'simulated'. p_pass = false lets you test failures.
drop function if exists verify_simulated(text, boolean);
create or replace function verify_simulated(p_kind text, p_pass boolean default true, p_consent boolean default false) returns jsonb
language plpgsql security definer set search_path = public as $$
declare u uuid := _uid(); st text;
begin
  if p_kind not in ('face', 'kyc') then raise exception 'Unknown check'; end if;
  if not _simulated(p_kind) then raise exception 'This check is live now. Please use the real check.'; end if;
  if not coalesce(p_consent, false) then raise exception 'Please tick the box to agree first'; end if;
  if not exists (select 1 from profiles where id = u) then raise exception 'Finish your profile first'; end if;
  if (select count(*) from verifications where user_id = u and created_at > now() - interval '1 hour') >= 30 then
    raise exception 'Too many attempts. Please try again in an hour.';
  end if;
  st := _verify_record(u, p_kind, coalesce(p_pass, true), 'simulated', null, null, jsonb_build_object('consent', true));
  return jsonb_build_object('status', st, 'verify', _verify_state(u));
end $$;

-- Called only by the Edge Functions (service role), never by the browser. See supabase/functions.
-- verify_precheck_service runs before anything is asked of the provider, so refused attempts cost nothing.
-- Returns {status: 'ok'} to go ahead, or {status: 'review', verify} once the tries are used up: the person is then
-- blocked and put in the review queue (recorded here, so it is not an error that would undo it).
drop function if exists verify_precheck_service(uuid, text);
create or replace function verify_precheck_service(p_user uuid, p_kind text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare vs jsonb;
begin
  if p_kind not in ('face', 'kyc') then raise exception 'Unknown check'; end if;
  if _simulated(p_kind) then raise exception 'This check is set to simulated in app_config'; end if;
  if not exists (select 1 from profiles where id = p_user) then raise exception 'Finish your profile first'; end if;
  vs := _verify_state(p_user);
  if not (vs -> p_kind ->> 'review')::boolean and (vs -> p_kind ->> 'attempts')::int >= _verify_max() then
    perform _verify_to_review(p_user, p_kind, 'limit');
    vs := _verify_state(p_user);
  end if;
  if (vs -> p_kind ->> 'review')::boolean then return jsonb_build_object('status', 'review', 'verify', vs); end if;
  if (select count(*) from verifications where user_id = p_user and status = 'started' and created_at > now() - interval '1 hour') >= 10 then
    raise exception 'Too many attempts. Please try again in an hour.';
  end if;
  return jsonb_build_object('status', 'ok');
end $$;

create or replace function verify_start_service(p_user uuid, p_kind text, p_provider text, p_session text) returns void
language plpgsql security definer set search_path = public as $$
begin
  -- one start at a time per person, so two tabs can't both take the last try
  perform pg_advisory_xact_lock(hashtext('verify:' || p_user::text));
  if (verify_precheck_service(p_user, p_kind) ->> 'status') <> 'ok'
     or (_verify_state(p_user) -> p_kind ->> 'attempts')::int >= _verify_max() then
    raise exception 'Waiting for review';
  end if;
  insert into verifications (user_id, kind, status, provider, session_id, detail)
  values (p_user, p_kind, 'started', left(p_provider, 30), left(p_session, 200), jsonb_build_object('consent', true));
end $$;

create or replace function verify_finish_service(p_user uuid, p_kind text, p_session text, p_passed boolean, p_score numeric, p_detail jsonb)
returns text language plpgsql security definer set search_path = public as $$
begin
  -- the session must be one this person started in the last 30 minutes, and not already used
  if not exists (select 1 from verifications where user_id = p_user and kind = p_kind and session_id = p_session
                 and status = 'started' and created_at > now() - interval '30 minutes') then
    raise exception 'Unknown or expired check';
  end if;
  if exists (select 1 from verifications where session_id = p_session and status <> 'started') then
    raise exception 'This check was already used';
  end if;
  return _verify_record(p_user, p_kind, p_passed, (select provider from verifications where session_id = p_session and status = 'started' limit 1),
                        p_session, p_score, p_detail);
end $$;

-- Distance in km between two points (haversine).
create or replace function _km(lat1 float8, lng1 float8, lat2 float8, lng2 float8) returns float8 language sql immutable as $$
  select 12742 * asin(least(1, sqrt(power(sin(radians(lat2 - lat1) / 2), 2)
                                    + cos(radians(lat1)) * cos(radians(lat2)) * power(sin(radians(lng2 - lng1) / 2), 2)))) $$;

-- Is plan a within 50 km of home? People and plans from before coordinates were all in Chandigarh.
create or replace function _near(a activities, h_lat float8, h_lng float8) returns boolean language sql immutable as $$
  select _km(coalesce(h_lat, 30.74), coalesce(h_lng, 76.78), coalesce(a.lat, 30.74), coalesce(a.lng, 76.78)) <= 50 $$;

-- The cities with sample plans. Someone whose home area is more than 50 km from all of them also sees the nearest
-- city's plans, and anyone can pick a city to browse (saved in profiles.state as 'city': a key below, or 'home').
create or replace function _cities() returns table (k text, name text, lat float8, lng float8) language sql immutable as $$
  values ('chd', 'Chandigarh', 30.7333::float8, 76.7794::float8), ('del', 'Delhi NCR', 28.6139, 77.2090),
         ('mum', 'Mumbai', 19.0760, 72.8777), ('pun', 'Pune', 18.5204, 73.8567), ('blr', 'Bengaluru', 12.9716, 77.5946),
         ('hyd', 'Hyderabad', 17.3850, 78.4867), ('chn', 'Chennai', 13.0827, 80.2707), ('amd', 'Ahmedabad', 23.0225, 72.5714) $$;

-- Everything the signed-in person may see, in one go. p_act: a plan opened from an invite link, included even when far away.
drop function if exists app_state();
drop function if exists app_state(uuid);
create or replace function app_state(p_act uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  u uuid := _uid();
  em text := lower(coalesce(auth.jwt() ->> 'email', ''));
  prof profiles; pre jsonb; draft jsonb;
  act_ids uuid[]; chat_ids uuid[]; pids uuid[];
  j_acts jsonb; j_people jsonb; j_reqs jsonb; j_msgs jsonb; j_notes jsonb; j_rat jsonb; j_rep jsonb; j_blk jsonb; n_locked int;
  pick text; v_city text; v_auto boolean := false; v_lat float8; v_lng float8;
begin
  perform _housekeeping();

  select * into prof from profiles where id = u;
  if not found then
    select data into pre from profile_presets where email = em;
    if pre is not null then
      -- Demo accounts start verified only while checks are simulated; in live mode they verify like anyone else.
      insert into profiles (id, email, name, dob, gender, hood, lat, lng, job, bio, ints, avail, emo, face, kyc, onboarded, trust_met, trust_shows, hist)
      values (u, em, pre->>'name', (pre->>'dob')::date, pre->>'gender', pre->>'hood', (pre->>'lat')::float8, (pre->>'lng')::float8,
              coalesce(pre->>'job', ''), coalesce(pre->>'bio', ''),
              array(select jsonb_array_elements_text(coalesce(pre->'ints', '[]'))), array(select jsonb_array_elements_text(coalesce(pre->'avail', '[]'))),
              coalesce(pre->>'emo', ''), _simulated('face'), _simulated('kyc') and coalesce((pre->>'kyc')::boolean, true), _simulated('face'),
              coalesce((pre->>'met')::int, 0), coalesce((pre->>'shows')::int, 0), coalesce(pre->'hist', '[]'))
      returning * into prof;
    else
      if _may_prefill() then
        select jsonb_build_object('name', name, 'dob', dob, 'gender', gender,
                 'hood', case neighborhood when 'Central Market' then 'Sector 17, Chandigarh' when 'Lakeside' then 'Sector 7, Chandigarh'
                                           when 'Old Quarter' then 'Sector 22, Chandigarh' else neighborhood end,
                 'ints', interests, 'avail', availability)
        into draft from participants where lower(email) = em order by created_at desc limit 1;
      end if;
      return jsonb_build_object('me', u, 'email', em, 'profile', null, 'draft', draft, 'now', _ms(now()),
                                'verify', _verify_state(u), 'mode', _modes());
    end if;
  end if;

  -- Anyone can browse; posting and asking to join need the face check (post_activity, request_join).

  -- Plans near home are always included. Besides those: the city picked to browse, or, when no city is within 50 km
  -- of home and nothing was picked, the nearest city (v_auto).
  pick := prof.state ->> 'city';
  select c.k, c.lat, c.lng into v_city, v_lat, v_lng from _cities() c where c.k = pick;
  if v_city is null and pick is distinct from 'home'
     and not exists (select 1 from _cities() c where _km(coalesce(prof.lat, 30.74), coalesce(prof.lng, 76.78), c.lat, c.lng) <= 50) then
    select c.k, c.lat, c.lng into v_city, v_lat, v_lng from _cities() c
    order by _km(coalesce(prof.lat, 30.74), coalesce(prof.lng, 76.78), c.lat, c.lng) limit 1;
    v_auto := true;
  end if;

  -- Upcoming plans near this person and open to them, plus anything they host or asked to join (up to 90 days back).
  select coalesce(array_agg(a.id), '{}') into act_ids from activities a
  where (a.starts_at > now() and a.host <> u and _eligible(a, u)
         and (_near(a, prof.lat, prof.lng) or (v_city is not null and _near(a, v_lat, v_lng)) or a.id = p_act))
     or ((a.host = u or exists (select 1 from requests r where r.act = a.id and r.user_id = u)) and a.starts_at > now() - interval '90 days');

  -- Plans whose members and chat this person may see: hosting, or accepted.
  select coalesce(array_agg(a.id), '{}') into chat_ids from activities a
  where a.id = any (act_ids)
    and (a.host = u or exists (select 1 from requests r where r.act = a.id and r.user_id = u and r.status = 'accepted'));

  select coalesce(jsonb_agg(jsonb_build_object(
      'id', a.id, 'host', a.host, 'cat', a.cat, 'desc', a.description, 'cap', a.cap, 'when', _ms(a.starts_at),
      'aud', a.audience, 'venue', a.venue, 'cost', a.cost, 'total', a.total, 'hood', a.hood, 'lat', a.lat, 'lng', a.lng, 'repeat', a.repeat,
      'status', a.status, 'created', _ms(a.created_at), 'mcount', cardinality(m.ms),
      'members', case when a.id = any (chat_ids) then to_jsonb(m.ms) else '[]'::jsonb end,
      'wl', (select count(*) from requests r where r.act = a.id and r.status = 'waitlist'),
      'mypos', (select w.pos from (select r.user_id, row_number() over (order by r.created_at) pos
                                    from requests r where r.act = a.id and r.status = 'waitlist') w where w.user_id = u))
    ), '[]')
  into j_acts from activities a cross join lateral (select _members(a.id) ms) m where a.id = any (act_ids);

  select coalesce(jsonb_agg(jsonb_build_object('id', r.id, 'act', r.act, 'user', r.user_id, 'note', r.note, 'status', r.status, 'at', _ms(r.created_at))), '[]')
  into j_reqs from requests r join activities a on a.id = r.act
  where a.id = any (act_ids) and (r.user_id = u or a.host = u);

  select coalesce(jsonb_agg(jsonb_build_object('id', m.id, 'act', m.act, 'from', m.sender, 'sys', m.sys, 'text', m.body, 'at', _ms(m.created_at), 'poll', m.poll,
      'votes', case when m.poll is null then null else
        (select coalesce(jsonb_agg(jsonb_build_object('u', v.user_id, 'o', v.opt)), '[]') from poll_votes v where v.msg = m.id) end)
    order by m.id), '[]')
  into j_msgs from messages m where m.act = any (chat_ids);

  select array(select distinct x from (
      select a.host x from activities a where a.id = any (act_ids)
      union all select unnest(_members(a.id)) from activities a where a.id = any (chat_ids)
      union all select r.user_id from requests r join activities a on a.id = r.act where a.host = u and a.id = any (act_ids)
      union all select m.sender from messages m where m.act = any (chat_ids)
      union all select blocked from blocks where blocker = u
      union all select (f.v)::uuid from jsonb_array_elements_text(coalesce(prof.state -> 'following', '[]')) f(v)
        where f.v ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
          -- only people who host a plan this person could see, so a made-up follow can't reveal someone's profile
          and exists (select 1 from activities a where a.host = (f.v)::uuid and _eligible(a, u)
                      and (_near(a, prof.lat, prof.lng) or (v_city is not null and _near(a, v_lat, v_lng))))
      union all select u) s where x is not null)
  into pids;

  select coalesce(jsonb_agg(jsonb_build_object(
      'id', p.id, 'name', p.name, 'gender', p.gender, 'age', date_part('year', age(p.dob))::int, 'job', p.job, 'bio', p.bio,
      'emo', p.emo, 'kyc', p.kyc, 'face', p.face, 'sample', p.is_sample, 'ints', p.ints, 'avail', p.avail, 'hist', p.hist,
      'met', p.trust_met + coalesce(t.met, 0), 'shows', p.trust_shows + coalesce(t.shows, 0))), '[]')
  into j_people from profiles p
  left join lateral (
    -- show-ups from ratings: per meetup, the majority of the people who rated decides
    select count(*)::int met, count(*) filter (where s >= n)::int shows
    from (select r.act, count(*) filter (where e.value = 'show') s, count(*) filter (where e.value = 'noshow') n
          from ratings r cross join lateral jsonb_each_text(r.people) e
          where e.key = p.id::text group by r.act) x) t on true
  where p.id = any (pids) and (p.id = u or not exists (select 1 from blocks b where b.blocker = p.id and b.blocked = u));

  select coalesce(jsonb_agg(jsonb_build_object('id', n.id, 'kind', n.kind, 'title', n.title, 'tag', n.tag, 'tone', n.tone, 'act', n.act,
      'text', n.body, 'flags', n.flags, 'read', n.read, 'key', n.key, 'at', _ms(n.created_at)) order by n.created_at desc), '[]')
  into j_notes from (select * from notifications where user_id = u order by created_at desc limit 100) n;

  select coalesce(jsonb_agg(jsonb_build_object('act', act, 'ok', ok, 'stars', stars, 'people', people, 'at', _ms(created_at))), '[]')
  into j_rat from ratings where rater = u;
  -- how many audience-limited plans unlock after the face check (the app says so, without showing them)
  select count(*) into n_locked from activities a
  where not prof.face and a.audience is not null and prof.gender = any (a.audience) and a.starts_at > now()
    and not _blocked(u, a.host) and (_near(a, prof.lat, prof.lng) or (v_city is not null and _near(a, v_lat, v_lng)));
  select coalesce(jsonb_agg(msg), '[]') into j_rep from reports where reporter = u and msg is not null;
  select coalesce(jsonb_agg(blocked), '[]') into j_blk from blocks where blocker = u;

  return jsonb_build_object('me', u, 'email', em, 'now', _ms(now()),
    'verify', _verify_state(u), 'mode', _modes(),
    'profile', to_jsonb(prof) - 'email' - 'trust_met' - 'trust_shows' - 'hist',
    'people', j_people, 'acts', j_acts, 'reqs', j_reqs, 'msgs', j_msgs, 'notes', j_notes,
    'ratings', j_rat, 'reported', j_rep, 'blocked', j_blk, 'locked', n_locked,
    'cities', (select jsonb_agg(jsonb_build_array(c.k, c.name, c.lat, c.lng)) from _cities() c), 'city', v_city, 'city_auto', v_auto,
    'terms_v', 'app-v2');   -- the Terms version the app asks people to agree to (see accept_terms)
end $$;

-- Why a plan from an invite link isn't in someone's app_state, so the app can say so instead of "no longer available":
-- 'gone' (cancelled, or the host blocked them), 'past', 'audience' (limited to other groups), 'verify' (limited to their
-- group, which they see after the face check), or 'ok'.
create or replace function invite_info(p_act uuid) returns text language plpgsql security definer set search_path = public as $$
declare u uuid := _uid(); a activities; me profiles;
begin
  select * into a from activities where id = p_act;
  if not found or _blocked(u, a.host) then return 'gone'; end if;
  if a.starts_at <= now() then return 'past'; end if;
  select * into me from profiles where id = u;
  if a.audience is not null and not coalesce(me.gender = any (a.audience), false) then return 'audience'; end if;
  if a.audience is not null and not coalesce(me.face, false) then return 'verify'; end if;
  return 'ok';
end $$;

-- Create or update your own profile. Only the fields sent are changed. Returns null when saved.
-- Age: Overhere is 18+. A first profile with a date of birth under 18 is refused, and the login made a moment
-- earlier (phone or email) is deleted, so nothing from the attempt is kept. Returns {"error":"under18"}.
drop function if exists save_profile(jsonb);
create or replace function save_profile(p jsonb) returns jsonb language plpgsql security definer set search_path = public as $$
declare u uuid := _uid(); em text := lower(coalesce(auth.jwt() ->> 'email', '')); cur profiles; b date;
begin
  if p ? 'dob' then
    begin b := (p->>'dob')::date; exception when others then raise exception 'Enter a valid date of birth'; end;
  end if;
  select * into cur from profiles where id = u;
  if not found and b is not null and b > current_date - interval '18 years' then
    delete from auth.users where id = u;    -- no profile exists yet, so this removes everything from the attempt
    return jsonb_build_object('error', 'under18');
  end if;
  if found then
    if b is not null and b > current_date - interval '18 years' then raise exception 'You must be 18 or over to use Overhere'; end if;
    -- After the ID check, gender and date of birth come from the ID: changing them goes through a person.
    if cur.kyc and ((p ? 'gender' and p->>'gender' is distinct from cur.gender) or (p ? 'dob' and (p->>'dob')::date is distinct from cur.dob)) then
      raise exception 'Your gender and date of birth are confirmed by your ID. To change them, please email us.';
    end if;
    update profiles set
      name   = coalesce(p->>'name', name),
      dob    = coalesce((p->>'dob')::date, dob),
      gender = coalesce(p->>'gender', gender),
      hood   = coalesce(p->>'hood', hood),
      lat    = case when p ? 'lat' then round((p->>'lat')::numeric, 2)::float8 else lat end,
      lng    = case when p ? 'lng' then round((p->>'lng')::numeric, 2)::float8 else lng end,
      job    = coalesce(p->>'job', job),
      bio    = coalesce(p->>'bio', bio),
      ints   = case when p ? 'ints'  then array(select jsonb_array_elements_text(p->'ints'))  else ints end,
      avail  = case when p ? 'avail' then array(select jsonb_array_elements_text(p->'avail')) else avail end,
      emo    = coalesce(p->>'emo', emo),
      usage_ok = coalesce((p->>'usage_ok')::boolean, usage_ok),
      -- the face check is optional at sign-up; face and kyc themselves are never set here
      onboarded = onboarded or coalesce((p->>'onboarded')::boolean, false)
    where id = u;
    -- turning usage statistics off also deletes the ones already collected
    if p->>'usage_ok' = 'false' then delete from events where participant_id = u; end if;
  else
    if coalesce(p->>'consent', '') <> 'true' then raise exception 'Please tick the consent box to continue'; end if;
    if p->>'lat' is null or p->>'lng' is null then raise exception 'Pick your area from the list, or use your current location'; end if;
    insert into profiles (id, email, name, dob, gender, hood, lat, lng, job, bio, ints, avail, emo, usage_ok, consent_version, consent_at)
    values (u, em, p->>'name', b, p->>'gender', p->>'hood', round((p->>'lat')::numeric, 2)::float8, round((p->>'lng')::numeric, 2)::float8,
            coalesce(p->>'job', ''), coalesce(p->>'bio', ''),
            array(select jsonb_array_elements_text(coalesce(p->'ints', '[]'))), array(select jsonb_array_elements_text(coalesce(p->'avail', '[]'))),
            coalesce(p->>'emo', ''), coalesce((p->>'usage_ok')::boolean, false), 'app-v2', now());   -- app-v2: data consent + Terms and community guidelines
    if _may_prefill() then
      update participants set user_id = u where lower(email) = em and user_id is null and em <> '';
    end if;
  end if;
  return null;
end $$;

-- Accounts made before the Terms existed agree to them once (the app asks). Bump the version with any change to terms.html.
create or replace function accept_terms() returns void language plpgsql security definer set search_path = public as $$
begin
  update profiles set consent_version = 'app-v2', consent_at = now() where id = _uid();
end $$;

-- Private settings: alerts, who you follow, muted chats, trusted contact, dismissed cards...
create or replace function save_state(s jsonb) returns void language plpgsql security definer set search_path = public as $$
begin
  if jsonb_typeof(s) <> 'object' then raise exception 'Bad settings'; end if;
  update profiles set state = s where id = _uid();
end $$;

create or replace function post_activity(p jsonb) returns uuid language plpgsql security definer set search_path = public as $$
declare u uuid := _uid(); me profiles; st timestamptz; nid uuid;
begin
  select * into me from profiles where id = u;
  if not found then raise exception 'Finish your profile first'; end if;
  if not me.face then raise exception 'Do the face check before posting'; end if;
  if (select count(*) from activities where host = u and created_at > now() - interval '1 day') >= 10 then
    raise exception 'You can post up to 10 plans a day';
  end if;
  st := to_timestamp((p->>'when')::double precision / 1000);
  if st <= now() then raise exception 'Pick a future date and time'; end if;
  if st > now() + interval '1 year' then raise exception 'Pick a date within the next year'; end if;
  insert into activities (host, cat, description, cap, starts_at, audience, venue, cost, total, hood, lat, lng, repeat)
  values (u, p->>'cat', trim(p->>'desc'), (p->>'cap')::int, st,
          case when jsonb_typeof(p->'aud') = 'array' then array(select jsonb_array_elements_text(p->'aud')) end,
          -- no venue spot (an app still open from before venues had one): pin it at the host's home area
          trim(p->>'venue'), p->>'cost', nullif((p->>'total')::int, 0), me.hood,
          case when p->>'lat' is null or p->>'lng' is null then me.lat else (p->>'lat')::float8 end,
          case when p->>'lat' is null or p->>'lng' is null then me.lng else (p->>'lng')::float8 end,
          nullif(p->>'repeat', ''))
  returning id into nid;
  perform _ping(array['00000000-0000-0000-0000-000000000000'::uuid]);
  return nid;
end $$;

create or replace function edit_activity(p_act uuid, p jsonb) returns void language plpgsql security definer set search_path = public as $$
declare u uuid := _uid(); a activities; st timestamptz; moved boolean; ms uuid[]; m uuid;
begin
  select * into a from activities where id = p_act for update;
  if not found or a.host <> u then raise exception 'Only the host can edit this activity'; end if;
  if a.starts_at <= now() then raise exception 'This activity has already started'; end if;
  st := to_timestamp((p->>'when')::double precision / 1000);
  if st <= now() then raise exception 'Pick a future date and time'; end if;
  if st > now() + interval '1 year' then raise exception 'Pick a date within the next year'; end if;
  ms := _members(p_act);
  if (p->>'cap')::int < cardinality(ms) then raise exception 'Capacity can''t be less than the people already going'; end if;
  moved := st <> a.starts_at or trim(p->>'venue') <> a.venue;
  update activities set cat = p->>'cat', description = trim(p->>'desc'), cap = (p->>'cap')::int, starts_at = st,
    audience = case when jsonb_typeof(p->'aud') = 'array' then array(select jsonb_array_elements_text(p->'aud')) end,
    venue = trim(p->>'venue'), cost = p->>'cost', total = nullif((p->>'total')::int, 0), repeat = nullif(p->>'repeat', ''),
    lat = coalesce((p->>'lat')::float8, lat), lng = coalesce((p->>'lng')::float8, lng)
  where id = p_act;
  if cardinality(ms) > 0 then
    perform _sys(p_act, 'The host updated the details' || case when moved then ': now ' || _when(st) || ' at ' || trim(p->>'venue') else '' end);
    foreach m in array ms loop
      perform _note(m, 'update', 'Activity updated', 'Details changed', 'info', p_act,
        format('%s updated "%s"%s.', _name(u), _short(trim(p->>'desc')), case when moved then ': now ' || _when(st) || ' at ' || trim(p->>'venue') else '' end));
    end loop;
  end if;
  if _spots(p_act) <= 0 then
    if a.status = 'open' then perform _fill_up(p_act); end if;
  else
    perform _spot_opened(p_act);
  end if;
  perform _ping(array['00000000-0000-0000-0000-000000000000'::uuid]);
end $$;

create or replace function cancel_activity(p_act uuid) returns void language plpgsql security definer set search_path = public as $$
declare u uuid := _uid(); a activities; ms uuid[]; m uuid; others uuid[];
begin
  select * into a from activities where id = p_act for update;
  if not found or a.host <> u then raise exception 'Only the host can cancel this activity'; end if;
  ms := _members(p_act);
  select coalesce(array_agg(user_id), '{}') into others from requests where act = p_act;
  foreach m in array ms loop
    perform _note(m, 'update', 'Activity cancelled', 'Cancelled', 'bad', null, format('%s cancelled "%s".', _name(u), _short(a.description)));
  end loop;
  perform _note(u, 'update', 'Activity cancelled', 'Cancelled', 'bad', null,
    case when cardinality(ms) > 0 then cardinality(ms) || ' accepted member(s) notified.' else 'Removed from your list.' end);
  delete from activities where id = p_act;
  perform _ping(others || '00000000-0000-0000-0000-000000000000'::uuid);
end $$;

-- Ask to join. Returns 'pending', 'waitlist', or 'accepted' (sample hosts say yes straight away).
create or replace function request_join(p_act uuid, p_note text) returns text language plpgsql security definer set search_path = public as $$
declare u uuid := _uid(); me profiles; a activities; st text; rid uuid;
begin
  select * into me from profiles where id = u;
  if not found then raise exception 'Finish your profile first'; end if;
  if not me.face then raise exception 'Do the face check before asking to join'; end if;
  if (select count(*) from requests where user_id = u and created_at > now() - interval '1 day') >= 50 then
    raise exception 'You have sent a lot of requests today. Please try again tomorrow.';
  end if;
  select * into a from activities where id = p_act for update;
  if not found or a.starts_at <= now() then raise exception 'That activity is no longer available'; end if;
  if a.host = u then raise exception 'This is your own activity'; end if;
  if not _eligible(a, u) then raise exception 'This activity isn''t open to you'; end if;
  if exists (select 1 from requests where act = p_act and user_id = u) then raise exception 'You already asked to join this one'; end if;
  st := case when a.status = 'full' or _spots(p_act) <= 0 then 'waitlist' else 'pending' end;
  insert into requests (act, user_id, note, status) values (p_act, u, left(coalesce(p_note, ''), 100), st) returning id into rid;
  if st = 'pending' then
    perform _note(a.host, 'req', 'New join request', 'Pending', 'warn', p_act, format('%s wants to join "%s".', me.name, _short(a.description)));
    if _is_sample(a.host) then perform _accept(rid); end if;
  end if;
  perform _ping(array[u, a.host]);
  return (select status from requests where id = rid);
end $$;

create or replace function withdraw_request(p_act uuid) returns void language plpgsql security definer set search_path = public as $$
declare u uuid := _uid(); h uuid;
begin
  delete from requests where act = p_act and user_id = u and status in ('pending', 'waitlist');
  select host into h from activities where id = p_act;
  perform _ping(array[u, h]);
end $$;

create or replace function decide_request(p_req uuid, p_accept boolean) returns void language plpgsql security definer set search_path = public as $$
declare u uuid := _uid(); r requests; a activities;
begin
  select * into r from requests where id = p_req;
  if not found then raise exception 'That request is gone'; end if;
  select * into a from activities where id = r.act;
  if a.host <> u then raise exception 'Only the host can decide'; end if;
  if a.starts_at <= now() then raise exception 'This activity has already started'; end if;
  if r.status <> 'pending' then return; end if;
  if p_accept then
    if _spots(a.id) <= 0 then raise exception 'This activity is full'; end if;
    perform _accept(p_req);
  else
    update requests set status = 'rejected' where id = p_req;
    perform _note(r.user_id, 'req', 'Request Declined', 'Declined', 'bad', a.id,
      format('%s declined your join request for "%s". You can browse similar activities.', _name(u), _short(a.description)));
  end if;
  perform _ping(array[u, r.user_id]);
end $$;

create or replace function leave_activity(p_act uuid) returns void language plpgsql security definer set search_path = public as $$
declare u uuid := _uid(); a activities;
begin
  select * into a from activities where id = p_act for update;
  update requests set status = 'left' where act = p_act and user_id = u and status = 'accepted';
  if not found then raise exception 'You are not in this activity'; end if;
  perform _sys(p_act, _name(u) || ' left the chat');
  perform _note(a.host, 'update', 'Someone left', 'Left', 'info', p_act, format('%s left "%s". A spot is open again.', _name(u), _short(a.description)));
  perform _spot_opened(p_act);
  perform _ping(array[u, a.host] || _members(p_act));
end $$;

-- The host takes someone out of the group. Like leaving, their spot opens up and they can't request this one again.
create or replace function remove_member(p_act uuid, p_user uuid) returns void language plpgsql security definer set search_path = public as $$
declare u uuid := _uid(); a activities;
begin
  select * into a from activities where id = p_act for update;
  if not found or a.host <> u then raise exception 'Only the host can remove people'; end if;
  update requests set status = 'removed' where act = p_act and user_id = p_user and status = 'accepted';
  if not found then raise exception 'They are not in this activity'; end if;
  perform _sys(p_act, _name(p_user) || ' was removed from the chat');
  perform _note(p_user, 'update', 'Removed from activity', 'Removed', 'bad', p_act,
    format('%s removed you from "%s" and its group chat.', _name(u), _short(a.description)));
  perform _spot_opened(p_act);
  perform _ping(array[u, p_user] || _members(p_act));
end $$;

create or replace function send_message(p_act uuid, p_body text, p_poll jsonb default null) returns void language plpgsql security definer set search_path = public as $$
declare u uuid := _uid(); a activities; body text := trim(coalesce(p_body, '')); poll jsonb;
begin
  select * into a from activities where id = p_act;
  if not found or not (a.host = u or u = any (_members(p_act))) then raise exception 'Only members can message this group'; end if;
  if p_poll is not null then
    if jsonb_typeof(p_poll -> 'opts') <> 'array' or jsonb_array_length(p_poll -> 'opts') not between 2 and 4
       or char_length(coalesce(p_poll ->> 'q', '')) not between 1 and 80 then raise exception 'Add a question and 2 to 4 options'; end if;
    poll := jsonb_build_object('q', p_poll ->> 'q', 'opts', (select jsonb_agg(left(x, 40)) from jsonb_array_elements_text(p_poll -> 'opts') x));
    body := 'Poll: ' || (p_poll ->> 'q');
  end if;
  if body = '' then raise exception 'Type a message'; end if;
  if (select count(*) from messages where sender = u and created_at > now() - interval '1 minute') >= 20 then
    raise exception 'Slow down a little: too many messages in a minute';
  end if;
  insert into messages (act, sender, body, poll) values (p_act, u, left(body, 500), poll);
  perform _chat_note(p_act, u, left(body, 200));
  perform _ping(array[a.host] || _members(p_act));
end $$;

create or replace function vote(p_msg bigint, p_opt int) returns void language plpgsql security definer set search_path = public as $$
declare u uuid := _uid(); m messages; a activities;
begin
  select * into m from messages where id = p_msg;
  if not found or m.poll is null then raise exception 'That poll is gone'; end if;
  select * into a from activities where id = m.act;
  if not (a.host = u or u = any (_members(a.id))) then raise exception 'Only members can vote'; end if;
  if p_opt < 0 or p_opt >= jsonb_array_length(m.poll -> 'opts') then raise exception 'Pick an option'; end if;
  if exists (select 1 from poll_votes where msg = p_msg and user_id = u and opt = p_opt) then
    delete from poll_votes where msg = p_msg and user_id = u;
  else
    insert into poll_votes (msg, user_id, opt) values (p_msg, u, p_opt) on conflict (msg, user_id) do update set opt = excluded.opt;
  end if;
  perform _ping(array[a.host] || _members(a.id));
end $$;

create or replace function rate_activity(p_act uuid, p_ok text, p_stars int, p_people jsonb) returns void language plpgsql security definer set search_path = public as $$
declare u uuid := _uid(); a activities; ppl jsonb;
begin
  select * into a from activities where id = p_act;
  if not found or not (a.host = u or u = any (_members(p_act))) then raise exception 'Only people who went can rate this'; end if;
  if a.starts_at > now() then raise exception 'You can rate it once it has happened'; end if;
  -- only keep marks for people who were actually in it
  select coalesce(jsonb_object_agg(e.key, e.value), '{}') into ppl
  from jsonb_each_text(coalesce(p_people, '{}')) e
  where e.value in ('show', 'noshow') and e.key ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' and e.key::uuid <> u
    and (e.key::uuid = a.host or e.key::uuid = any (_members(p_act)));
  insert into ratings (act, rater, ok, stars, people) values (p_act, u, p_ok, p_stars, ppl)
  on conflict (act, rater) do update set ok = excluded.ok, stars = excluded.stars, people = excluded.people, created_at = now();
  if p_ok = 'no' then insert into reports (reporter, act, reason) values (u, p_act, 'Check-in: something went wrong'); end if;
end $$;

create or replace function report(p_target uuid, p_act uuid, p_msg bigint, p_reason text, p_note text) returns void language plpgsql security definer set search_path = public as $$
declare u uuid := _uid(); ma uuid;
begin
  if (select count(*) from reports where reporter = u and created_at > now() - interval '1 day') >= 20 then
    raise exception 'You have sent a lot of reports today. Please email us instead.';
  end if;
  if p_msg is not null then
    -- you can only report a message from a chat you are in
    select act into ma from messages where id = p_msg;
    if ma is null or not exists (select 1 from activities a where a.id = ma and (a.host = u or u = any (_members(a.id)))) then
      raise exception 'That message is gone';
    end if;
  end if;
  insert into reports (reporter, target, act, msg, msg_text, reason, note)
  values (u, p_target, p_act, p_msg, (select body from messages where id = p_msg), left(p_reason, 80), left(coalesce(p_note, ''), 500));
end $$;

create or replace function block_user(p_user uuid) returns void language plpgsql security definer set search_path = public as $$
declare u uuid := _uid();
begin
  if p_user = u then raise exception 'You can''t block yourself'; end if;
  insert into blocks (blocker, blocked) values (u, p_user) on conflict do nothing;
  -- their open requests on my activities are quietly declined
  update requests set status = 'rejected'
  where user_id = p_user and status in ('pending', 'waitlist') and act in (select id from activities where host = u);
  perform _ping(array[u, p_user]);
end $$;

create or replace function unblock_user(p_user uuid) returns void language plpgsql security definer set search_path = public as $$
begin
  delete from blocks where blocker = _uid() and blocked = p_user;
  perform _ping(array[_uid(), p_user]);
end $$;

-- Reminders the app makes for you (e.g. "Activity in 2 hours"). The key stops duplicates.
create or replace function add_notification(p_kind text, p_title text, p_tag text, p_tone text, p_act uuid, p_body text, p_flags text[], p_key text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from notifications where user_id = _uid() and created_at > now() - interval '1 day') >= 200 then return; end if;
  perform _note(_uid(), p_kind, p_title, p_tag, p_tone, p_act, p_body,
                array(select f from unnest(coalesce(p_flags, '{}')) f where f in ('check', 'safe', 'chat')), left(p_key, 80));
end $$;

-- Mark some (or, with null, all) of your notifications as read.
create or replace function read_notifications(p_ids uuid[]) returns void language plpgsql security definer set search_path = public as $$
begin
  update notifications set read = true where user_id = _uid() and not read and (p_ids is null or id = any (p_ids));
end $$;

-- Human review, from the /addmin page. The dashboard password (schema.sql, admin_secret) is checked by the database.
-- Returns null when the password is right, otherwise what to tell the dashboard. It doesn't raise an error,
-- because that would also undo the record of the wrong try.
drop function if exists _admin_ok(text);
create or replace function _admin_err(p_pass text) returns text language plpgsql as $$
begin
  if (select count(*) from admin_fails where at > now() - interval '15 minutes') >= 20 then
    return 'Too many wrong passwords. The dashboard is locked for 15 minutes.';
  end if;
  if p_pass is not null and exists (select 1 from admin_secret s where s.pass = extensions.crypt(p_pass, s.pass)) then return null; end if;
  insert into admin_fails default values;
  delete from admin_fails where at < now() - interval '1 day';
  perform pg_sleep(0.5);                     -- slows down password guessing
  return 'wrong password';
end $$;

-- The dashboard's totals (first made in schema.sql). Totals only, never names or emails; feedback text only where
-- the person agreed to be quoted. Sign-ups are app accounts (profiles, without the sample people), not the old
-- beta waitlist (participants), which nothing adds to any more. Usage events count only for those accounts, which
-- leaves out the events from the old sample app.
create or replace function admin_stats(pass text) returns jsonb language plpgsql security definer set search_path = public as $$
declare e text := _admin_err(pass);
begin
  if e is not null then return jsonb_build_object('error', e); end if;
  return jsonb_build_object(
    'participants',   (select count(*) from profiles where not is_sample),
    'by_gender',      (select coalesce(jsonb_object_agg(gender, n), '{}') from (select gender, count(*) n from profiles where not is_sample group by gender) x),
    -- the city part of the home area ("Koramangala, Bengaluru" -> "Bengaluru")
    'by_city',        (select coalesce(jsonb_object_agg(c, n), '{}') from (select trim(regexp_replace(hood, '^.*,', '')) c, count(*) n from profiles where not is_sample group by 1) x),
    'by_interest',    (select coalesce(jsonb_object_agg(i, n), '{}') from (select unnest(ints) i, count(*) n from profiles where not is_sample group by 1) x),
    'signups_by_day', (select coalesce(jsonb_object_agg(d, n), '{}') from (select to_char(created_at at time zone 'Asia/Kolkata', 'YYYY-MM-DD') d, count(*) n from profiles where not is_sample and created_at > now() - interval '30 days' group by 1) x),
    'feedback',       (select count(*) from feedback),
    'avg_rating',     (select round(avg(rating)::numeric, 2) from feedback),
    'rating_dist',    (select coalesce(jsonb_object_agg(rating, n), '{}') from (select rating, count(*) n from feedback group by rating) x),
    'would_use',      (select coalesce(jsonb_object_agg(coalesce(would_use, 'No answer'), n), '{}') from (select would_use, count(*) n from feedback group by would_use) x),
    'quotes',         (select coalesce(jsonb_agg(jsonb_build_object('rating', rating, 'liked', liked, 'improve', improve, 'at', created_at) order by created_at desc), '[]')
                         from (select * from feedback where consent_quote and (liked is not null or improve is not null) order by created_at desc limit 30) x),
    'events',         (select coalesce(jsonb_object_agg(name, n), '{}') from (select name, count(*) n from events v
                         where v.participant_id in (select id from profiles where not is_sample) group by name) x),
    'micro',          (select coalesce(jsonb_object_agg(m, jsonb_build_object('avg', a, 'n', n)), '{}')
                         from (select props->>'moment' m, round(avg((props->>'score')::int), 2) a, count(*) n from events v
                               where v.participant_id in (select id from profiles where not is_sample)
                                 and name = 'micro_feedback' and props->>'score' ~ '^[1-4]$' and props->>'moment' ~ '^[a-z_]{1,20}$' group by 1) x),
    -- signing up now happens inside the app, so "tried it" means posted a plan or asked to join one
    'tried',          (select count(*) from profiles p where not p.is_sample
                         and (exists (select 1 from activities a where a.host = p.id) or exists (select 1 from requests r where r.user_id = p.id))),
    'sessions_30d',   (select count(distinct session_id) from events v
                         where v.participant_id in (select id from profiles where not is_sample) and created_at > now() - interval '30 days')
  );
end $$;

-- Everyone waiting for a person to look at their face or ID check.
create or replace function admin_reviews(pass text) returns jsonb language plpgsql security definer set search_path = public as $$
declare e text := _admin_err(pass);
begin
  if e is not null then return jsonb_build_object('error', e); end if;
  -- tries, failures and the best provider score (0-100) since the last decision, to help judge "real person, bad light"
  return (select coalesce(jsonb_agg(jsonb_build_object('user', p.id, 'name', p.name, 'kind', k.kind, 'since', _ms(v.created_at),
                                      'attempts', (s -> k.kind ->> 'attempts')::int, 'fails', (s -> k.kind ->> 'fails')::int,
                                      'best', (select max(w.score) from verifications w where w.user_id = p.id and w.kind = k.kind
                                               and w.score is not null and w.seq > coalesce((select max(x.seq) from verifications x
                                                 where x.user_id = p.id and x.kind = k.kind and x.status in ('passed','approved','rejected')), 0)))
                                    order by v.created_at), '[]')
          from profiles p cross join unnest(array['face','kyc']) k(kind)
          cross join lateral (select _verify_state(p.id) s) st
          join lateral (select created_at from verifications w where w.user_id = p.id and w.kind = k.kind and w.status = 'review'
                        order by w.seq desc limit 1) v on true
          where not p.is_sample and (s -> k.kind ->> 'review')::boolean);
end $$;

drop function if exists admin_decide_review(text, uuid, text, boolean);
create or replace function admin_decide_review(pass text, p_user uuid, p_kind text, p_approve boolean) returns jsonb
language plpgsql security definer set search_path = public as $$
declare e text := _admin_err(pass);
begin
  if e is not null then return jsonb_build_object('error', e); end if;
  if p_kind not in ('face', 'kyc') or not coalesce((_verify_state(p_user) -> p_kind ->> 'review')::boolean, false) then
    raise exception 'Nothing to review';
  end if;
  insert into verifications (user_id, kind, status, provider)
  values (p_user, p_kind, case when p_approve then 'approved' else 'rejected' end, 'reviewer');
  if p_approve then
    if p_kind = 'face' then update profiles set face = true where id = p_user;
    else update profiles set kyc = true where id = p_user; end if;
  end if;
  perform _note(p_user, 'update', case when p_approve then 'Verification approved' else 'Please try the check again' end,
    case when p_kind = 'face' then 'Face check' else 'ID check' end, case when p_approve then 'ok' else 'warn' end, null,
    case when p_approve then 'A person on our team reviewed your check and approved it.'
         else 'A person on our team reviewed your check. Please try it again, in good light.' end);
  return jsonb_build_object('ok', true);
end $$;

-- Usage events (button taps, never content). Who sent it comes from the login, not the browser, and one session,
-- one person, and signed-out visitors together can only send so many, so nobody can flood the table.
create or replace function log_event(p_session uuid, p_name text, p_props jsonb default '{}') returns void
language plpgsql security definer set search_path = public as $$
declare u uuid := auth.uid();
begin
  if p_session is null or coalesce(p_name, '') !~ '^[a-z_]{2,40}$' or pg_column_size(coalesce(p_props, '{}')) > 2000 then return; end if;
  -- opt-in only: nothing before sign-in, and nothing unless "Share usage statistics" is on
  if u is null or not exists (select 1 from profiles where id = u and usage_ok) then return; end if;
  if (select count(*) from events where session_id = p_session and created_at > now() - interval '10 minutes') >= 120 then return; end if;
  if u is null and (select count(*) from events where participant_id is null and created_at > now() - interval '1 hour') >= 1000 then return; end if;
  if u is not null and (select count(*) from events where participant_id = u and created_at > now() - interval '1 hour') >= 600 then return; end if;
  insert into events (id, participant_id, session_id, name, props) values (gen_random_uuid(), u, p_session, p_name, coalesce(p_props, '{}'));
end $$;

-- Feedback from the landing page's form. Linked to the login when there is one; at most 60 an hour from everyone.
create or replace function send_feedback(p jsonb) returns void language plpgsql security definer set search_path = public as $$
begin
  if not coalesce((p->>'consent_store')::boolean, false) then raise exception 'Please tick the required consent box to send feedback.'; end if;
  if (select count(*) from feedback where created_at > now() - interval '1 hour') >= 60 then
    raise exception 'A lot of feedback is arriving right now. Please try again in an hour.';
  end if;
  insert into feedback (id, participant_id, rating, liked, improve, would_use, consent_store, consent_quote, consent_contact, consent_version)
  values (gen_random_uuid(), auth.uid(), (p->>'rating')::int, nullif(left(trim(p->>'liked'), 1000), ''), nullif(left(trim(p->>'improve'), 1000), ''),
          p->>'would_use', true, coalesce((p->>'consent_quote')::boolean, false), coalesce((p->>'consent_contact')::boolean, false),
          left(coalesce(p->>'consent_version', 'v1'), 20));
end $$;

-- "Delete my account" in the app. Plans this person hosts are cancelled (members are told), they leave the groups
-- they're in (hosts are told, spots reopen), then the login is deleted, which removes the rest (see the trigger below).
create or replace function delete_my_account() returns void language plpgsql security definer set search_path = public as $$
declare u uuid := _uid(); a record;
begin
  if _is_sample(u) then raise exception 'Sample accounts can''t be deleted here'; end if;
  for a in select id from activities where host = u and starts_at > now() loop perform cancel_activity(a.id); end loop;
  for a in select r.act from requests r join activities x on x.id = r.act where r.user_id = u and r.status = 'accepted' and x.starts_at > now() loop
    perform leave_activity(a.act);
  end loop;
  -- usage records go too, and feedback is kept without the link to this account
  delete from events where participant_id = u;
  update feedback set participant_id = null where participant_id = u;
  delete from auth.users where id = u;
end $$;

-- Sign-up age gate, run by Supabase Auth before it creates a login (Authentication -> Hooks -> Before User Created ->
-- Postgres -> public._before_user_created). Email and phone sign-ups must carry "I'm 18 or older" from the sign-up
-- screen (user_metadata.age_18), or no login is made. Google sign-ups can't carry it: those are checked at the date of
-- birth step (save_profile) instead.
create or replace function _before_user_created(event jsonb) returns jsonb language plpgsql as $$
begin
  if coalesce(event->'user'->'app_metadata'->>'provider', '') in ('email', 'phone')
     and coalesce(event->'user'->'user_metadata'->>'age_18', '') <> 'true' then
    return jsonb_build_object('error', jsonb_build_object('http_code', 403,
      'message', 'Overhere is for people aged 18 and over. Please confirm your age to create an account.'));
  end if;
  return '{}'::jsonb;
end $$;

-- Who may call what. Supabase gives new functions to everyone by default, so this takes that away first.
do $$ declare f record; begin
  for f in select p.oid::regprocedure sig, p.proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
           where n.nspname = 'public' and (p.proname like '\_%' or p.proname in ('app_state','save_profile','save_state','post_activity',
             'edit_activity','cancel_activity','request_join','withdraw_request','decide_request','leave_activity','remove_member','send_message','vote',
             'rate_activity','report','block_user','unblock_user','add_notification','read_notifications','verify_simulated',
             'verify_precheck_service','verify_start_service','verify_finish_service','admin_reviews','admin_decide_review',
             'admin_stats','log_event','send_feedback','delete_my_account','accept_terms','invite_info'))
  loop
    execute format('revoke all on function %s from public, anon, authenticated', f.sig);
    execute format('alter function %s set search_path = public', f.sig);
    if f.proname in ('verify_precheck_service', 'verify_start_service', 'verify_finish_service') then
      execute format('grant execute on function %s to service_role', f.sig);       -- Edge Functions only
    elsif f.proname in ('admin_reviews', 'admin_decide_review', 'admin_stats') then
      execute format('grant execute on function %s to anon, authenticated', f.sig); -- password checked inside
    elsif f.proname in ('log_event', 'send_feedback') then
      execute format('grant execute on function %s to anon, authenticated', f.sig); -- limited inside
    elsif f.proname not like '\_%' then
      execute format('grant execute on function %s to authenticated', f.sig);       -- signed-in people
    end if;
  end loop;
  grant usage on schema public to supabase_auth_admin;
  grant execute on function _before_user_created(jsonb) to supabase_auth_admin;   -- Supabase Auth only
end $$;

-- Deleting someone in Authentication -> Users also deletes their profile, plans, requests, notifications,
-- ratings, checks and usage records (their chat messages stay, shown without a name), and unlinks their old beta
-- sign-up and their feedback.
create or replace function _on_auth_user_deleted() returns trigger language plpgsql security definer set search_path = public as $$
begin
  delete from profiles where id = old.id and not is_sample;
  update participants set user_id = null where user_id = old.id;
  delete from events where participant_id = old.id;
  update feedback set participant_id = null where participant_id = old.id;
  return old;
end $$;
revoke all on function _on_auth_user_deleted() from public, anon, authenticated;
drop trigger if exists overhere_user_deleted on auth.users;
create trigger overhere_user_deleted after delete on auth.users for each row execute function _on_auth_user_deleted();

-- ---------- sample people and plans (added once) ----------

insert into profile_presets (email, data) values
  ('kajal@overhere.test', '{"name":"Kajal","gender":"Woman","dob":"1998-02-02","hood":"Sector 17, Chandigarh","lat":30.74,"lng":76.78,"job":"UX Researcher","bio":"Weekend brunches, indie gigs and the occasional horror movie. Always on time.","ints":["Movies","Cafe / Food","Concerts"],"avail":["Weekday evenings","Late nights"],"emo":"👩🏽‍🔬","kyc":true,"met":18,"shows":18,"hist":[["Sunday brunch club","cafe",5,"Hosted",4.9,6],["Indie night in Sector 26","concerts",16,"Joined",4.7,1],["Horror double bill","movies",31,"Hosted",4.8,4]]}'),
  ('arjun@overhere.test', '{"name":"Arjun","gender":"Man","dob":"1995-09-18","hood":"Sector 17, Chandigarh","lat":30.74,"lng":76.78,"job":"Software Engineer","bio":"Weekend cricket, Friday night movies, always up for street food.","ints":["Movies","Cafe / Food"],"avail":["Weekend days","Weekend evenings"],"emo":"👨🏾‍💻","kyc":true,"met":9,"shows":9,"hist":[["Friday night thriller","movies",8,"Hosted",4.7,4],["Sector 35 food crawl","cafe",22,"Joined",4.5,1]]}'),
  ('neha@overhere.test',  '{"name":"Neha","gender":"Woman","dob":"2001-06-14","hood":"Sector 17, Chandigarh","lat":30.74,"lng":76.78,"job":"","bio":"","ints":["Cafe / Food"],"avail":["Weekend days"],"emo":"👩🏻","kyc":false}')
on conflict (email) do nothing;

create or replace function _sid(n int) returns uuid language sql immutable as $$
  select ('a0000000-0000-4000-8000-' || lpad(n::text, 12, '0'))::uuid $$;

drop function if exists _seed_act(int, text, text, int, timestamptz, text[], text, text, text, int[], interval, int, text, text);
create or replace function _seed_act(p_host int, p_cat text, p_desc text, p_cap int, p_when timestamptz, p_aud text[], p_venue text,
                                     p_cost text, p_hood text, p_members int[], p_period interval, p_total int default null,
                                     p_repeat text default null, p_status text default 'open', p_lat float8 default null, p_lng float8 default null)
returns void language plpgsql as $$
declare nid uuid; m int; i int := 0;
begin
  insert into activities (host, cat, description, cap, starts_at, audience, venue, cost, total, hood, lat, lng, repeat, status, sample_period, created_at)
  values (_sid(p_host), p_cat, p_desc, p_cap, p_when, p_aud, p_venue, p_cost, p_total, p_hood, p_lat, p_lng, p_repeat, p_status, p_period, now() - interval '1 day')
  returning id into nid;
  foreach m in array coalesce(p_members, '{}') loop
    i := i + 1;
    insert into requests (act, user_id, status, created_at) values (nid, _sid(m), 'accepted', now() - interval '3 hours' + i * interval '1 minute');
  end loop;
  if cardinality(coalesce(p_members, '{}')) > 0 then perform _seed_chat(nid); end if;
end $$;
revoke all on function _sid(int) from public, anon, authenticated;
revoke all on function _seed_act(int, text, text, int, timestamptz, text[], text, text, text, int[], interval, int, text, text, float8, float8) from public, anon, authenticated;

do $$
declare D interval := interval '1 day'; W interval := interval '14 days'; S17 text := 'Sector 17, Chandigarh'; wo text[] := array['Woman']; mn text[] := array['Man','Non-binary'];
begin
  if exists (select 1 from profiles where is_sample) then return; end if;

  insert into profiles (id, is_sample, name, dob, gender, hood, lat, lng, job, bio, ints, avail, emo, face, kyc, onboarded, trust_met, trust_shows, hist)
  select _sid(n), true, name, current_date - (age * interval '1 year') - interval '100 days', gender, 'Sector 17, Chandigarh', 30.74, 76.78, job, bio, ints, avail, emo, true, kyc, true, met, shows, hist::jsonb
  from (values
    (1,'Aarav','Man',27,'Designer','Will watch anything with good sound design.','{Movies}'::text[],'{"Weekend evenings","Late nights"}'::text[],'👨🏽‍🎨',true,12,12,'[["Nolan retrospective: Interstellar on IMAX","movies",9,"Hosted",4.9,5],["Filter coffee tasting","cafe",23,"Joined",4.6,4],["Anime night at Elante","movies",41,"Hosted",4.8,6]]'),
    (2,'Meera','Woman',29,'Architect','Coffee snob, jazz fan, always early.','{"Cafe / Food",Concerts}','{"Weekend days"}','👩🏾‍💼',true,21,21,'[["Jazz brunch in Sector 7","cafe",6,"Hosted",5.0,4],["Le Corbusier architecture walk and chai","cafe",19,"Hosted",4.9,7],["Sunday sitar recital","concerts",33,"Joined",4.7,5]]'),
    (3,'Rohan','Man',31,'Developer','Live gigs > streaming. Ask me about my vinyl.','{Concerts}','{"Weekday evenings","Late nights"}','👨🏽‍💻',true,8,7,'[["Vinyl listening session","concerts",12,"Hosted",4.6,5],["Indie night in Sector 26","concerts",27,"Joined",4.3,6],["Late-night dosa run","cafe",52,"Joined",4.5,3]]'),
    (4,'Sara','Woman',25,'Journalist','New in town, collecting good brunch spots.','{"Cafe / Food"}','{"Weekend days"}','👩🏻‍🦱',true,3,3,'[["Brunch spot hunt #3","cafe",8,"Hosted",4.8,3],["Open-mic poetry","concerts",30,"Joined",4.6,5]]'),
    (5,'Kabir','Man',28,'Chef','Cooks all day, so I eat out on my days off.','{Movies,"Cafe / Food"}','{"Late nights"}','👨🏾‍🍳',false,6,5,'[["Street food crawl","cafe",15,"Hosted",4.2,4],["Midnight action double bill","movies",38,"Hosted",3.9,5]]'),
    (6,'Ananya','Woman',26,'Teacher','Board games evangelist.','{"Cafe / Food",Movies}','{"Weekday evenings","Weekend days"}','👩🏽‍🏫',true,17,17,'[["Board game Friday","cafe",4,"Hosted",5.0,8],["Catan tournament","cafe",18,"Hosted",4.9,6],["Documentary and discussion","movies",32,"Hosted",4.8,5]]'),
    (7,'Alex','Non-binary',30,'Musician','Open mics, always.','{Concerts}','{"Weekday evenings","Weekend evenings"}','🧑🏽‍🎤',true,25,24,'[["Open-mic night","concerts",5,"Hosted",4.9,9],["Karaoke, no talent required","concerts",20,"Hosted",4.8,7],["Songwriting circle","concerts",44,"Hosted",4.7,6]]'),
    (8,'Ishaan','Man',24,'Student','Ramen is a personality.','{"Cafe / Food",Movies}','{"Late nights"}','👨🏻‍🎓',true,4,4,'[["Ramen ranking night","cafe",10,"Hosted",4.7,3],["Marvel marathon","movies",36,"Joined",4.4,5]]'),
    (9,'Priya','Woman',27,'Product Manager','Jazz, sunsets and very strong coffee.','{Concerts,"Cafe / Food"}','{"Weekend evenings"}','👩🏽‍💻',true,14,14,'[["Sunset acoustic set","concerts",7,"Hosted",4.9,6],["Jazz on the lawn","concerts",21,"Hosted",5.0,4],["Third-wave coffee crawl","cafe",40,"Joined",4.8,5]]'),
    (10,'Dev','Man',32,'Photographer','Will find the best late-night food in any city.','{"Cafe / Food",Concerts}','{"Late nights"}','🧔🏾',false,9,7,'[["Late-night parantha run","cafe",11,"Hosted",4.1,5],["Night photo walk","cafe",29,"Hosted",3.8,4]]'),
    (11,'Zoya','Woman',24,'Film student','Runs a tiny film club. Subtitles always on.','{Movies}','{"Weekend days","Weekday evenings"}','👩🏻‍🎓',true,11,11,'[["Women''s film club: Qala","movies",7,"Hosted",4.9,5],["Subtitled classics night","movies",28,"Hosted",4.8,4],["Short film festival","movies",47,"Joined",4.7,3]]'),
    (12,'Sam','Non-binary',29,'Copywriter','Crosswords, filter coffee, early mornings.','{"Cafe / Food"}','{"Weekend days"}','🧑🏼',true,2,2,'[["Crossword and coffee","cafe",14,"Hosted",4.8,2]]')
  ) v(n, name, gender, age, job, bio, ints, avail, emo, kyc, met, shows, hist);

  -- Happening soon (within about a day): these move forward a day at a time.
  perform _seed_act(9,'concerts','Sunset acoustic set by Sukhna Lake',4,_t_next(18,30),null,'Sukhna Lake, near the boat club','host',S17,null,D,4000);
  perform _seed_act(2,'movies','Catching the 8pm show of the new sci-fi release, chai after',3,_t_next(20),null,'PVR, Elante Mall','split',S17,'{1}',D,1600);
  perform _seed_act(5,'movies','Late-night horror double feature',4,_t_next(22,30),mn,'Elante Mall multiplex','split',S17,null,D,2000);
  perform _seed_act(10,'cafe','Late-night parantha run',3,_t_next(23,45),null,'Sector 35 market','split',S17,'{8}',D,1800);
  perform _seed_act(12,'cafe','Morning filter coffee and the Sunday crossword',2,_t_next(8),null,'Indian Coffee House, Sector 17','own',S17,null,D,null,'weekly');
  perform _seed_act(4,'cafe','Slow brunch. Bring a book or a laptop',4,_t_next(11),wo,'Café in Sector 7 inner market','own',S17,null,D);
  perform _seed_act(11,'movies','Women''s film club: Punjabi short films and discussion',4,_t_next(16),wo,'Punjab Kala Bhawan, Sector 16','own',S17,'{9}',D);
  perform _seed_act(6,'cafe','Board games and coffee, beginners welcome',5,_t_next(15),null,'Board game café, Sector 8','own',S17,'{2,7,1}',D);
  perform _seed_act(3,'concerts','Indie band live set, got spare spots',2,_t_next(21),null,'Live music bar, Sector 26','own',S17,null,D);
  perform _seed_act(7,'concerts','Karaoke night, no talent required',6,_t_next(21,30),null,'Karaoke bar, Sector 26','split',S17,'{1,4,6,8,3}',D,2400);
  perform _seed_act(1,'movies','Re-release of a 90s classic, popcorn on me',4,_t_next(19),null,'Piccadily Square, Sector 34','own',S17,null,D,1200);
  perform _seed_act(8,'cafe','Momos crawl through the Sector 15 market',4,_t_next(18),null,'Sector 15 market','split',S17,'{5}',D,1000);
  perform _seed_act(2,'concerts','Sufi night on the Kala Bhawan lawns',3,_t_next(19,30),null,'Punjab Kala Bhawan, Sector 16','own',S17,null,D);
  perform _seed_act(12,'cafe','Morning chai and a walk in Leisure Valley',3,_t_next(7,30),null,'Leisure Valley, Sector 10','own',S17,null,D);
  perform _seed_act(4,'cafe','Book swap over cold coffee',5,_t_next(17),null,'Café, Sector 9 market','own',S17,'{6}',D);
  perform _seed_act(10,'cafe','Midnight Maggi and chai at the dhaba',4,_t_next(0,30),null,'Dhaba, Sector 22','split',S17,'{8}',D,600);

  -- Plan ahead (3 to 13 days out): these move forward two weeks once they pass.
  perform _seed_act(5,'concerts','Rock night, local bands',4,_t_at(7,19),null,'Music café, Sector 7','own','Sector 7',null,W);
  perform _seed_act(6,'cafe','Tea tasting flight',3,_t_at(6,17),null,'Tea room, Sector 22 market','split','Sector 22',null,W,900);
  perform _seed_act(11,'movies','Anime movie night, subtitles on',5,_t_at(7,18,30),null,'Government Museum auditorium, Sector 10','own',S17,null,W);
  perform _seed_act(3,'concerts','Vinyl listening evening, bring a record',4,_t_at(8,20,30),null,'Record store café, Sector 26','own',S17,'{1}',W);
  perform _seed_act(7,'concerts','Retro Bollywood karaoke',6,_t_at(7,21),null,'Karaoke bar, Sector 26','split',S17,'{9,2}',W,3000);
  perform _seed_act(6,'cafe','Pictionary and pizza, beginners welcome',6,_t_at(8,14),null,'Board game café, Sector 8','split',S17,'{12}',W,1800);
  perform _seed_act(12,'cafe','Sunrise walk around Sukhna Lake, then breakfast',4,_t_at(3,6,30),null,'Sukhna Lake, main gate','own',S17,'{6}',W);
  perform _seed_act(8,'cafe','Trying the new ramen place',3,_t_at(3,13),null,'Ramen bar, Sector 9','split',S17,'{5,3}',W,2400);
  perform _seed_act(7,'concerts','Open-mic night, come cheer for friends',6,_t_at(3,20),null,'Open-mic café, Sector 15','own',S17,null,W);
  perform _seed_act(1,'movies','Classic film re-run matinee',4,_t_at(4,11),null,'Government Museum auditorium, Sector 10','split',S17,null,W,1000);
  perform _seed_act(9,'concerts','Jazz night on the lawn, table for 4',4,_t_at(4,21),wo,'Leisure Valley lawns','host',S17,'{2}',W,3200);
  perform _seed_act(3,'cafe','Sketching at the Rock Garden, coffee after',3,_t_at(5,16),null,'Rock Garden, Sector 1','own',S17,null,W);
  perform _seed_act(11,'movies','Punjabi film screening, post-film chai',5,_t_at(5,19,30),null,'Tagore Theatre, Sector 18','own',S17,'{4}',W);
  perform _seed_act(10,'concerts','Techno night, leaving early is allowed',3,_t_at(6,22,30),null,'Club in Sector 26','own',S17,null,W);
  perform _seed_act(4,'cafe','Pancake brunch, then a walk in the Rose Garden',4,_t_at(7,10),null,'Rose Garden, Sector 16','split',S17,null,W,2000);
  perform _seed_act(6,'movies','Documentary night and discussion',3,_t_at(8,18),null,'Panjab University, Sector 14','own',S17,null,W);
  perform _seed_act(5,'movies','Midnight show of the big release',4,_t_at(9,23,45),mn,'Elante Mall multiplex','split',S17,null,W,1600);
  perform _seed_act(2,'cafe','Dessert crawl: three places, one evening',3,_t_at(10,19),null,'Starts at Sector 17 Plaza','split',S17,'{6,9,4}',W,1500,null,'full');
  perform _seed_act(9,'concerts','Carnatic classical evening',4,_t_at(3,18,30),null,'Tagore Theatre, Sector 18','own',S17,null,W);
  perform _seed_act(5,'cafe','Cook-along: butter chicken from scratch',4,_t_at(4,17),null,'Community kitchen, Sector 22','split',S17,'{8}',W,2000);
  perform _seed_act(1,'movies','Outdoor movie on the lawns, bring a blanket',6,_t_at(5,20),null,'Leisure Valley lawns','own',S17,'{6,11}',W);
  perform _seed_act(2,'cafe','Sector 17 architecture walk, coffee after',5,_t_at(6,9,30),null,'Sector 17 Plaza fountain','own',S17,null,W);
  perform _seed_act(7,'concerts','Songwriting circle, bring a half-finished song',5,_t_at(6,16),null,'Open-mic café, Sector 15','own',S17,'{3}',W);
  perform _seed_act(11,'movies','Satyajit Ray double bill',4,_t_at(7,15),null,'Panjab University, Sector 14','own',S17,null,W);
  perform _seed_act(4,'cafe','Rose Garden picnic, everyone brings one dish',6,_t_at(8,12),null,'Rose Garden, Sector 16','own',S17,'{12}',W);
  perform _seed_act(3,'concerts','Punjabi folk night with live dhol',4,_t_at(9,20,30),null,'Music café, Sector 26','split',S17,null,W,1600);
  perform _seed_act(8,'cafe','Chole bhature taste test, four stops',3,_t_at(11,11),null,'Sector 22 market','split',S17,null,W,900);
  perform _seed_act(10,'movies','Horror marathon, lights off',4,_t_at(12,22),null,'Elante Mall multiplex','split',S17,null,W,1600);
  perform _seed_act(8,'movies','Sunday matinee at Elante',4,_t_at(4,14),null,'PVR, Elante Mall','split','Sector 7',null,W,1200);
  perform _seed_act(9,'cafe','Picnic at Sukhna Lake, bring one snack',6,_t_at(5,12),null,'Sukhna Lake lawns','own','Sector 7','{2}',W);
  perform _seed_act(3,'concerts','Le Corbusier heritage walk and a sitar recital',4,_t_at(6,17),null,'Capitol Complex, Sector 1','own','Sector 22',null,W);
end $$;
-- Only the popcorn is on the host, so everyone pays for their own ticket (fixes databases seeded before).
update activities set cost = 'own' where host = _sid(1) and description = 'Re-release of a 90s classic, popcorn on me' and cost = 'host';
-- Sample plans: no false urgency, and no scripted meeting point in their chats (fixes databases seeded before).
update activities set description = 'Trying the new ramen place' where description = 'Trying the new ramen place (only 1 spot left)';
update messages set body = 'Sample plan: these messages are examples, and nobody will actually be there.', sender = null, sys = true
where body = 'Let us meet 15 min before at the entrance.' and act in (select a.id from activities a join profiles p on p.id = a.host where p.is_sample);
-- A few sample plans moved from "happening soon" to about a week out, so Discover has more (fixes databases seeded before).
update activities set starts_at = _t_at(7,19,0), sample_period = interval '14 days' where host = _sid(5) and description = 'Rock night, local bands' and sample_period = interval '1 day';
update activities set starts_at = _t_at(6,17,0), sample_period = interval '14 days' where host = _sid(6) and description = 'Tea tasting flight' and sample_period = interval '1 day';
update activities set starts_at = _t_at(7,18,30), sample_period = interval '14 days' where host = _sid(11) and description = 'Anime movie night, subtitles on' and sample_period = interval '1 day';
update activities set starts_at = _t_at(8,20,30), sample_period = interval '14 days' where host = _sid(3) and description = 'Vinyl listening evening, bring a record' and sample_period = interval '1 day';
update activities set starts_at = _t_at(7,21,0), sample_period = interval '14 days' where host = _sid(7) and description = 'Retro Bollywood karaoke' and sample_period = interval '1 day';
update activities set starts_at = _t_at(8,14,0), sample_period = interval '14 days' where host = _sid(6) and description = 'Pictionary and pizza, beginners welcome' and sample_period = interval '1 day';

-- ---------- sample people and plans in the other cities (added once per city) ----------
-- Six sample hosts per city (ids from _sid(101) for Delhi NCR, _sid(201) for Mumbai, and so on) and 16 plans:
-- nine happening soon (they move forward a day at a time) and seven planned ahead (they move forward two weeks).
-- The venues are real places, pinned where they are.

create or replace function _seed_host(n int, p_hood text, p_lat float8, p_lng float8, p_name text, p_gender text, p_age int,
                                      p_job text, p_bio text, p_ints text[], p_avail text[], p_emo text, p_met int, p_hist text)
returns void language sql as $$
  insert into profiles (id, is_sample, name, dob, gender, hood, lat, lng, job, bio, ints, avail, emo, face, kyc, onboarded, trust_met, trust_shows, hist)
  values (_sid(n), true, p_name, current_date - (p_age * interval '1 year') - interval '100 days', p_gender, p_hood, p_lat, p_lng,
          p_job, p_bio, p_ints, p_avail, p_emo, true, true, true, p_met, p_met, p_hist::jsonb)
  on conflict (id) do nothing $$;
revoke all on function _seed_host(int, text, float8, float8, text, text, int, text, text, text[], text[], text, int, text) from public, anon, authenticated;

do $$
declare D interval := interval '1 day'; W interval := interval '14 days'; wo text[] := array['Woman']; mn text[] := array['Man','Non-binary']; H text;
  F text[] := '{"Cafe / Food"}'; M text[] := '{Movies}'; C text[] := '{Concerts}'; FM text[] := '{"Cafe / Food",Movies}'; FC text[] := '{"Cafe / Food",Concerts}';
  WD text[] := '{"Weekend days"}'; WE text[] := '{"Weekday evenings","Weekend evenings"}'; LN text[] := '{"Late nights"}';
begin
  if not exists (select 1 from profiles where id = _sid(101)) then
    H := 'Delhi NCR';
    perform _seed_host(101,H,28.61,77.21,'Aditi','Woman',28,'Content strategist','Old Delhi food, weekend baithaks and too many bookshops.',F,WD,'👩🏽‍💼',14,'[["Chandni Chowk food walk","cafe",9,"Hosted",4.9,5]]');
    perform _seed_host(102,H,28.47,77.07,'Karan','Man',31,'Consultant','Gurugram on weekdays, Hauz Khas on weekends.',FM,WE,'👨🏽‍💼',9,'[["Cyber Hub dinner","cafe",12,"Hosted",4.6,4]]');
    perform _seed_host(103,H,28.57,77.20,'Nikhil','Man',29,'Sound engineer','Gigs, vinyl and the occasional ghazal night.',C,LN,'🧔🏽',11,'[["Qawwali at Nizamuddin","concerts",15,"Hosted",4.8,4]]');
    perform _seed_host(104,H,28.59,77.22,'Tanya','Woman',33,'Doctor','Early walks in Lodhi Garden and long brunches after.',F,WD,'👩🏻‍⚕️',16,'[["Lodhi Garden walk","cafe",6,"Hosted",5.0,4]]');
    perform _seed_host(105,H,28.53,77.21,'Rhea','Woman',26,'Film critic','Subtitles on, phones off.',M,WE,'👩🏾',7,'[["Film club at IHC","movies",20,"Hosted",4.7,5]]');
    perform _seed_host(106,H,28.57,77.32,'Jay','Non-binary',27,'Illustrator','Board games, sketchbooks and Noida street food.',FM,WE,'🧑🏽‍🎨',8,'[["Board game night","cafe",10,"Hosted",4.8,6]]');
    perform _seed_act(101,'cafe','Paranthe Wali Gali breakfast, then a Chandni Chowk walk',4,_t_next(9),null,'Paranthe Wali Gali, Chandni Chowk','own',H,'{102}',D,p_lat=>28.6562,p_lng=>77.2303);
    perform _seed_act(104,'cafe','Morning walk in Lodhi Garden, chai after',4,_t_next(7),null,'Lodhi Garden, main gate','own',H,null,D,p_lat=>28.5931,p_lng=>77.2197);
    perform _seed_act(102,'cafe','Sunset at Hauz Khas lake, then a rooftop café',4,_t_next(18),null,'Hauz Khas Village','split',H,'{103}',D,2000,p_lat=>28.5535,p_lng=>77.1940);
    perform _seed_act(105,'movies','Evening show of the new thriller',3,_t_next(20,30),null,'PVR, Select Citywalk, Saket','split',H,null,D,1500,p_lat=>28.5286,p_lng=>77.2190);
    perform _seed_act(103,'concerts','Jazz at The Piano Man, table for four',4,_t_next(21),null,'The Piano Man, Safdarjung Enclave','own',H,null,D,p_lat=>28.5655,p_lng=>77.1960);
    perform _seed_act(106,'cafe','Board game night, beginners welcome',5,_t_next(19),null,'Board game café, Sector 18, Noida','own',H,'{101,105}',D,p_lat=>28.5700,p_lng=>77.3240);
    perform _seed_act(102,'cafe','After-work dinner at Cyber Hub',4,_t_next(20),null,'Cyber Hub, DLF Cyber City, Gurugram','split',H,'{104}',D,3200,p_lat=>28.4950,p_lng=>77.0890);
    perform _seed_act(106,'cafe','Momos and chai in the Sector 18 market',3,_t_next(17,30),null,'Sector 18 market, Noida','split',H,null,D,600,p_lat=>28.5705,p_lng=>77.3218);
    perform _seed_act(104,'concerts','Open-mic night in Gurugram, come cheer',6,_t_next(20,30),null,'Open-mic café, Sector 29, Gurugram','own',H,null,D,p_lat=>28.4695,p_lng=>77.0630);
    perform _seed_act(105,'movies','Film club at India Habitat Centre, discussion after',5,_t_at(4,18,30),null,'India Habitat Centre, Lodhi Road','own',H,'{103}',W,p_lat=>28.5895,p_lng=>77.2250);
    perform _seed_act(103,'concerts','Hindustani classical evening',4,_t_at(6,19),null,'India International Centre, Lodhi Estate','own',H,null,W,p_lat=>28.5925,p_lng=>77.2230);
    perform _seed_act(101,'cafe','Bookshop crawl in Khan Market, coffee after',4,_t_at(3,16),null,'Khan Market','own',H,null,W,p_lat=>28.6003,p_lng=>77.2270);
    perform _seed_act(104,'cafe','Picnic at Sunder Nursery, everyone brings one dish',6,_t_at(5,12),wo,'Sunder Nursery, Nizamuddin','own',H,'{101}',W,p_lat=>28.5935,p_lng=>77.2440);
    perform _seed_act(102,'movies','Weekend blockbuster at Mall of India',4,_t_at(7,15),null,'PVR, DLF Mall of India, Noida','split',H,null,W,1600,p_lat=>28.5672,p_lng=>77.3210);
    perform _seed_act(106,'cafe','Mehrauli heritage walk, then brunch',5,_t_at(8,8,30),null,'Mehrauli Archaeological Park','own',H,null,W,p_lat=>28.5245,p_lng=>77.1855);
    perform _seed_act(103,'concerts','Qawwali evening at Nizamuddin',4,_t_at(9,18,30),null,'Hazrat Nizamuddin Dargah','own',H,null,W,p_lat=>28.5913,p_lng=>77.2425);
  end if;

  if not exists (select 1 from profiles where id = _sid(201)) then
    H := 'Mumbai';
    perform _seed_host(201,H,19.06,72.83,'Anika','Woman',29,'Ad film producer','Sea-facing chai, late shows, long walks on Carter Road.',FM,WE,'👩🏽',13,'[["Carter Road sunset walk","cafe",8,"Hosted",4.9,4]]');
    perform _seed_host(202,H,19.02,72.84,'Vikram','Man',32,'Banker','Weekday grind, weekend vada pav hunts.',F,WD,'👨🏽‍💼',10,'[["Dadar vada pav crawl","cafe",14,"Hosted",4.7,3]]');
    perform _seed_host(203,H,18.93,72.83,'Farah','Woman',30,'Architect','Kala Ghoda walks and Irani cafés.',F,WD,'👩🏾‍🎨',18,'[["Irani café breakfast","cafe",11,"Hosted",4.9,4]]');
    perform _seed_host(204,H,19.07,72.84,'Siddharth','Man',28,'Musician','Plays in two bands and hosts one open mic.',C,LN,'👨🏻‍🎤',21,'[["Open-mic night","concerts",7,"Hosted",4.8,7]]');
    perform _seed_host(205,H,19.13,72.83,'Neel','Non-binary',26,'Game designer','Board games and bad puns.',FM,WE,'🧑🏻‍💻',6,'[["Board games in Andheri","cafe",9,"Hosted",4.8,5]]');
    perform _seed_host(206,H,18.93,72.82,'Pooja','Woman',27,'Journalist','Films at NCPA, jazz after.',FC,WE,'👩🏻‍💼',12,'[["Jazz evening at NCPA","concerts",16,"Hosted",4.9,4]]');
    perform _seed_act(201,'cafe','Sunset walk on Carter Road, cutting chai after',4,_t_next(18),null,'Carter Road promenade, Bandra','own',H,'{206}',D,p_lat=>19.0650,p_lng=>72.8225);
    perform _seed_act(202,'cafe','Vada pav crawl through Dadar',3,_t_next(17),null,'Dadar West, near the station','split',H,null,D,300,p_lat=>19.0190,p_lng=>72.8430);
    perform _seed_act(203,'cafe','Irani café breakfast and a Kala Ghoda walk',4,_t_next(9),null,'Kala Ghoda, Fort','own',H,'{201}',D,p_lat=>18.9290,p_lng=>72.8315);
    perform _seed_act(206,'movies','Evening show at Phoenix Palladium',4,_t_next(20,30),null,'PVR, Phoenix Palladium, Lower Parel','split',H,null,D,1800,p_lat=>18.9947,p_lng=>72.8255);
    perform _seed_act(204,'concerts','Open-mic night at The Habitat, Khar',6,_t_next(21),null,'The Habitat, Khar West','own',H,'{205}',D,p_lat=>19.0700,p_lng=>72.8370);
    perform _seed_act(205,'cafe','Board games in Andheri, beginners welcome',5,_t_next(19),null,'Board game café, Andheri West','own',H,'{202,206}',D,p_lat=>19.1360,p_lng=>72.8290);
    perform _seed_act(202,'cafe','Marine Drive stroll and late-night ice cream',4,_t_next(21,30),null,'Marine Drive, near NCPA','own',H,null,D,p_lat=>18.9440,p_lng=>72.8230);
    perform _seed_act(204,'concerts','Indie gig at antiSOCIAL, got spare spots',3,_t_next(22),null,'antiSOCIAL, Khar West','own',H,null,D,p_lat=>19.0710,p_lng=>72.8360);
    perform _seed_act(201,'cafe','Coffee at Prithvi Café before the evening play',4,_t_next(18,30),wo,'Prithvi Theatre, Juhu','own',H,'{203}',D,p_lat=>19.1060,p_lng=>72.8260);
    perform _seed_act(206,'concerts','Jazz evening at NCPA',4,_t_at(4,19),null,'NCPA, Nariman Point','own',H,null,W,p_lat=>18.9255,p_lng=>72.8200);
    perform _seed_act(202,'cafe','Street food walk on Mohammed Ali Road',4,_t_at(5,20),mn,'Mohammed Ali Road, near Minara Masjid','split',H,null,W,800,p_lat=>18.9570,p_lng=>72.8330);
    perform _seed_act(203,'cafe','Sunday brunch at Leopold Café, Colaba',4,_t_at(6,11),null,'Leopold Café, Colaba Causeway','split',H,'{205}',W,2400,p_lat=>18.9227,p_lng=>72.8317);
    perform _seed_act(205,'movies','Late-night movie at Infiniti Mall',3,_t_at(3,22,30),null,'PVR Icon, Infiniti Mall, Andheri West','split',H,null,W,1400,p_lat=>19.1415,p_lng=>72.8317);
    perform _seed_act(201,'cafe','Sunrise walk around Powai Lake, then breakfast',4,_t_at(7,6,30),null,'Powai Lake promenade','own',H,null,W,p_lat=>19.1270,p_lng=>72.9050);
    perform _seed_act(206,'movies','Short film club in Versova, discussion after',5,_t_at(8,19),null,'Café in Versova, Andheri West','own',H,'{203}',W,p_lat=>19.1320,p_lng=>72.8150);
    perform _seed_act(204,'concerts','Retro Bollywood karaoke night',6,_t_at(9,21),null,'Karaoke bar, Lower Parel','split',H,'{202,201}',W,3000,p_lat=>19.0000,p_lng=>72.8270);
  end if;

  if not exists (select 1 from profiles where id = _sid(301)) then
    H := 'Pune';
    perform _seed_host(301,H,18.51,73.85,'Gauri','Woman',27,'Data analyst','Misal, monsoon treks and Marathi theatre.',F,WD,'👩🏽‍💻',11,'[["Misal pav breakfast","cafe",8,"Hosted",4.8,3]]');
    perform _seed_host(302,H,18.56,73.79,'Aditya','Man',30,'Mechanical engineer','Sinhagad at sunrise, board games at sunset.',F,WD,'👨🏽‍🔧',15,'[["Sinhagad sunrise trek","cafe",13,"Hosted",4.9,5]]');
    perform _seed_host(303,H,18.52,73.83,'Mira','Woman',23,'Student','Film archive regular.',M,WE,'👩🏻‍🎓',5,'[["Classic film night","movies",10,"Hosted",4.7,4]]');
    perform _seed_host(304,H,18.54,73.90,'Rahul','Man',29,'Drummer','Koregaon Park gigs every Friday.',C,LN,'👨🏾‍🎤',19,'[["Live band night","concerts",6,"Hosted",4.8,4]]');
    perform _seed_host(305,H,18.55,73.90,'Sneha','Woman',31,'HR manager','Brunch planner in chief.',F,WD,'👩🏽‍💼',12,'[["Kalyani Nagar brunch","cafe",9,"Hosted",4.9,4]]');
    perform _seed_host(306,H,18.53,73.78,'Kiran','Non-binary',28,'UX writer','Birdwatching, filter coffee and quiet cafés.',F,WD,'🧑🏽',7,'[["Pashan Lake birdwatch","cafe",17,"Hosted",4.8,3]]');
    perform _seed_act(301,'cafe','Misal pav breakfast at Bedekar',3,_t_next(9),null,'Bedekar Misal, Narayan Peth','own',H,null,D,p_lat=>18.5140,p_lng=>73.8490);
    perform _seed_act(306,'cafe','Filter coffee and a chat at Vaishali',4,_t_next(17),null,'Vaishali, FC Road','own',H,'{303}',D,p_lat=>18.5200,p_lng=>73.8410);
    perform _seed_act(302,'cafe','Morning walk up Vetal Tekdi, chai at the top',4,_t_next(6,30),null,'Vetal Tekdi, Law College Road entry','own',H,null,D,p_lat=>18.5260,p_lng=>73.8210);
    perform _seed_act(304,'concerts','Live band at High Spirits, Koregaon Park',4,_t_next(21),null,'High Spirits Café, Koregaon Park','own',H,'{305}',D,p_lat=>18.5387,p_lng=>73.8990);
    perform _seed_act(303,'movies','Evening show at Phoenix Marketcity',3,_t_next(20),null,'PVR, Phoenix Marketcity, Viman Nagar','split',H,null,D,1200,p_lat=>18.5620,p_lng=>73.9167);
    perform _seed_act(302,'cafe','Board games in Baner, beginners welcome',5,_t_next(19),null,'Board game café, Baner','own',H,'{306,301}',D,p_lat=>18.5590,p_lng=>73.7868);
    perform _seed_act(305,'cafe','Café hop in Koregaon Park',4,_t_next(16),wo,'Lane 7, Koregaon Park','split',H,null,D,1500,p_lat=>18.5362,p_lng=>73.8940);
    perform _seed_act(304,'concerts','Open-mic night in Kothrud',6,_t_next(20,30),null,'Open-mic café, Kothrud','own',H,null,D,p_lat=>18.5074,p_lng=>73.8077);
    perform _seed_act(301,'cafe','Street food on Laxmi Road',4,_t_next(18,30),null,'Laxmi Road, near Tulshibaug','split',H,'{302}',D,500,p_lat=>18.5160,p_lng=>73.8560);
    perform _seed_act(302,'cafe','Sunrise trek up Sinhagad, kanda bhaji at the top',5,_t_at(5,5,30),null,'Sinhagad Fort, base village','split',H,'{304}',W,600,p_lat=>18.3664,p_lng=>73.7556);
    perform _seed_act(303,'movies','Classic film at the National Film Archive',4,_t_at(4,18),null,'National Film Archive of India, Law College Road','own',H,null,W,p_lat=>18.5170,p_lng=>73.8290);
    perform _seed_act(306,'cafe','Birdwatching at Pashan Lake, coffee after',4,_t_at(6,7),null,'Pashan Lake','own',H,null,W,p_lat=>18.5360,p_lng=>73.7790);
    perform _seed_act(305,'cafe','Sunday brunch in Kalyani Nagar',4,_t_at(7,11),null,'Café in Kalyani Nagar','split',H,'{303}',W,2000,p_lat=>18.5480,p_lng=>73.9010);
    perform _seed_act(304,'concerts','Jazz night in Viman Nagar',4,_t_at(3,21),null,'Live music bar, Viman Nagar','own',H,null,W,p_lat=>18.5679,p_lng=>73.9143);
    perform _seed_act(301,'cafe','Walk around Aga Khan Palace, chai after',4,_t_at(8,10),null,'Aga Khan Palace, Kalyani Nagar','own',H,null,W,p_lat=>18.5523,p_lng=>73.9015);
    perform _seed_act(303,'movies','Marathi film night, discussion over chai',4,_t_at(9,19),null,'INOX, Bund Garden Road','split',H,null,W,1000,p_lat=>18.5340,p_lng=>73.8800);
  end if;

  if not exists (select 1 from profiles where id = _sid(401)) then
    H := 'Bengaluru';
    perform _seed_host(401,H,12.97,77.64,'Divya','Woman',28,'Software engineer','Filter coffee purist and weekend gig-goer.',FC,WE,'👩🏽‍💻',14,'[["Church Street book browse","cafe",9,"Hosted",4.8,4]]');
    perform _seed_host(402,H,12.98,77.60,'Varun','Man',30,'Product designer','Brewery hopper, Cubbon Park runner.',FM,WE,'👨🏻‍🎨',12,'[["Cubbon Park run","cafe",7,"Hosted",4.9,5]]');
    perform _seed_host(403,H,13.00,77.57,'Lakshmi','Woman',32,'Researcher','Carnatic concerts and Kannada cinema.',FC,WE,'👩🏾‍🔬',17,'[["Carnatic evening","concerts",14,"Hosted",5.0,4]]');
    perform _seed_host(404,H,12.91,77.65,'Nitin','Man',33,'Startup founder','Always up for a board game night.',F,WE,'👨🏽‍💻',8,'[["Board game night","cafe",11,"Hosted",4.7,6]]');
    perform _seed_host(405,H,12.95,77.58,'Shreya','Woman',26,'Teacher','Lalbagh walks and dosa breakfasts.',F,WD,'👩🏻‍🏫',10,'[["Lalbagh morning walk","cafe",12,"Hosted",4.9,4]]');
    perform _seed_host(406,H,12.93,77.62,'Robin','Non-binary',27,'Bassist','Indie gigs, open mics, late-night dosas.',C,LN,'🧑🏾‍🎤',20,'[["Open-mic night","concerts",5,"Hosted",4.8,7]]');
    perform _seed_act(405,'cafe','Filter coffee at Brahmin''s Coffee Bar',3,_t_next(8),null,'Brahmin''s Coffee Bar, Basavanagudi','own',H,null,D,p_lat=>12.9540,p_lng=>77.5690);
    perform _seed_act(402,'cafe','Morning run in Cubbon Park, breakfast after',4,_t_next(6,30),null,'Cubbon Park, Queen''s statue gate','own',H,'{404}',D,p_lat=>12.9763,p_lng=>77.5929);
    perform _seed_act(402,'cafe','Craft beer and pizza at Toit',4,_t_next(20),null,'Toit, 100 Feet Road, Indiranagar','split',H,'{401}',D,3200,p_lat=>12.9790,p_lng=>77.6408);
    perform _seed_act(406,'concerts','Open-mic night in Koramangala',6,_t_next(20,30),null,'Open-mic café, Koramangala 5th Block','own',H,null,D,p_lat=>12.9340,p_lng=>77.6230);
    perform _seed_act(401,'movies','Evening show at Forum Mall',3,_t_next(21),null,'PVR, Forum Mall, Koramangala','split',H,null,D,1200,p_lat=>12.9345,p_lng=>77.6112);
    perform _seed_act(404,'cafe','Board games in HSR Layout, beginners welcome',5,_t_next(19),null,'Board game café, HSR Layout','own',H,'{405,406}',D,p_lat=>12.9116,p_lng=>77.6474);
    perform _seed_act(405,'cafe','Dosas and snacks on VV Puram food street',4,_t_next(19,30),null,'VV Puram food street','split',H,null,D,500,p_lat=>12.9480,p_lng=>77.5740);
    perform _seed_act(406,'concerts','Indie band live at Hard Rock Café',4,_t_next(21,30),null,'Hard Rock Café, St Marks Road','own',H,null,D,p_lat=>12.9740,p_lng=>77.6010);
    perform _seed_act(401,'cafe','Book browsing on Church Street, coffee after',4,_t_next(17),wo,'Blossom Book House, Church Street','own',H,'{403}',D,p_lat=>12.9750,p_lng=>77.6050);
    perform _seed_act(403,'concerts','Carnatic classical evening in Malleshwaram',4,_t_at(4,18,30),null,'Concert hall, Malleshwaram','own',H,null,W,p_lat=>13.0035,p_lng=>77.5700);
    perform _seed_act(405,'cafe','Lalbagh morning walk, then breakfast',5,_t_at(5,7),null,'Lalbagh Botanical Garden, main gate','own',H,'{402}',W,p_lat=>12.9507,p_lng=>77.5848);
    perform _seed_act(403,'movies','Kannada film club, discussion over coffee',4,_t_at(6,18),null,'Café in Jayanagar 4th Block','own',H,null,W,p_lat=>12.9250,p_lng=>77.5830);
    perform _seed_act(404,'cafe','Sunset walk around Ulsoor Lake',4,_t_at(3,17,30),null,'Ulsoor Lake, boat club side','own',H,null,W,p_lat=>12.9830,p_lng=>77.6200);
    perform _seed_act(402,'movies','Weekend blockbuster at Orion Mall',4,_t_at(7,15),null,'PVR, Orion Mall, Rajajinagar','split',H,null,W,1400,p_lat=>13.0110,p_lng=>77.5550);
    perform _seed_act(406,'concerts','Jazz evening in Indiranagar',4,_t_at(8,21),null,'Live music bar, Indiranagar','own',H,'{401}',W,p_lat=>12.9719,p_lng=>77.6412);
    perform _seed_act(401,'cafe','Sunday brunch in Whitefield',4,_t_at(9,11),null,'Phoenix Marketcity, Whitefield','split',H,null,W,2000,p_lat=>12.9975,p_lng=>77.6960);
  end if;

  if not exists (select 1 from profiles where id = _sid(501)) then
    H := 'Hyderabad';
    perform _seed_host(501,H,17.36,78.47,'Sana','Woman',28,'Pharmacist','Irani chai at Nimrah and endless biryani debates.',F,WE,'👩🏽',13,'[["Irani chai by the Charminar","cafe",8,"Hosted",4.9,4]]');
    perform _seed_host(502,H,17.44,78.36,'Rohit','Man',30,'Cloud engineer','Gachibowli weekdays, Old City weekends.',FM,LN,'👨🏽‍💻',9,'[["Biryani night","cafe",12,"Hosted",4.7,4]]');
    perform _seed_host(503,H,17.42,78.44,'Harika','Woman',26,'Dancer','Lamakaan regular.',C,WE,'👩🏾‍🎤',16,'[["Open mic at Lamakaan","concerts",6,"Hosted",4.8,6]]');
    perform _seed_host(504,H,17.39,78.47,'Imran','Man',34,'Photographer','Heritage walks and golden hour.',F,WD,'👨🏾',18,'[["Old City photo walk","cafe",15,"Hosted",4.9,5]]');
    perform _seed_host(505,H,17.43,78.40,'Deepa','Woman',29,'Analyst','Board games and brunch.',F,WD,'👩🏻‍💼',8,'[["Board games in Gachibowli","cafe",10,"Hosted",4.8,5]]');
    perform _seed_host(506,H,17.41,78.45,'Ash','Non-binary',24,'Film student','Telugu cinema, first day first show.',M,LN,'🧑🏻‍🎓',6,'[["First day first show","movies",9,"Hosted",4.7,4]]');
    perform _seed_act(501,'cafe','Irani chai and Osmania biscuits by the Charminar',4,_t_next(17),null,'Nimrah Café, Charminar','own',H,'{504}',D,p_lat=>17.3616,p_lng=>78.4747);
    perform _seed_act(502,'cafe','Biryani night at Paradise',4,_t_next(20),null,'Paradise, MG Road, Secunderabad','split',H,null,D,1600,p_lat=>17.4431,p_lng=>78.4867);
    perform _seed_act(504,'cafe','Sunset walk on Necklace Road',4,_t_next(18),null,'Necklace Road, near Sanjeevaiah Park','own',H,null,D,p_lat=>17.4239,p_lng=>78.4738);
    perform _seed_act(506,'movies','First day first show at Prasads',4,_t_next(21),null,'Prasads Multiplex, Necklace Road','split',H,'{502}',D,1200,p_lat=>17.4129,p_lng=>78.4666);
    perform _seed_act(503,'concerts','Open-mic night at Lamakaan',6,_t_next(19,30),null,'Lamakaan, Banjara Hills','own',H,'{505}',D,p_lat=>17.4210,p_lng=>78.4390);
    perform _seed_act(505,'cafe','Board games in Gachibowli, beginners welcome',5,_t_next(19),null,'Board game café, Gachibowli','own',H,'{506,502}',D,p_lat=>17.4430,p_lng=>78.3570);
    perform _seed_act(502,'movies','Late show at AMB Cinemas',3,_t_next(22),null,'AMB Cinemas, Gachibowli','split',H,null,D,1000,p_lat=>17.4400,p_lng=>78.3480);
    perform _seed_act(505,'cafe','South Indian breakfast at Chutneys',3,_t_next(8,30),wo,'Chutneys, Banjara Hills','own',H,null,D,p_lat=>17.4180,p_lng=>78.4440);
    perform _seed_act(503,'concerts','Live band at a Gachibowli brewery',4,_t_next(21),null,'Brewery, Gachibowli','own',H,null,D,p_lat=>17.4380,p_lng=>78.3620);
    perform _seed_act(504,'cafe','Old City heritage walk, then breakfast',5,_t_at(4,7),null,'Charminar, east side','own',H,'{501}',W,p_lat=>17.3610,p_lng=>78.4760);
    perform _seed_act(504,'concerts','Sound and light show at Golconda Fort',4,_t_at(5,18,30),null,'Golconda Fort','own',H,null,W,p_lat=>17.3833,p_lng=>78.4011);
    perform _seed_act(501,'cafe','Morning walk in KBR Park',4,_t_at(3,6,30),null,'KBR National Park, main gate','own',H,null,W,p_lat=>17.4239,p_lng=>78.4219);
    perform _seed_act(506,'movies','Telugu film club, discussion over chai',4,_t_at(6,18),null,'Café in Banjara Hills','own',H,'{503}',W,p_lat=>17.4150,p_lng=>78.4480);
    perform _seed_act(505,'cafe','Crafts and snacks at Shilparamam',4,_t_at(7,16),null,'Shilparamam, Madhapur','split',H,null,W,600,p_lat=>17.4526,p_lng=>78.3810);
    perform _seed_act(502,'cafe','Sunset at Durgam Cheruvu, dinner after',4,_t_at(8,17,30),null,'Durgam Cheruvu cable bridge','split',H,null,W,1600,p_lat=>17.4300,p_lng=>78.3890);
    perform _seed_act(503,'concerts','Qawwali night in the Old City',4,_t_at(9,20),null,'Heritage hall, Old City','own',H,null,W,p_lat=>17.3650,p_lng=>78.4750);
  end if;

  if not exists (select 1 from profiles where id = _sid(601)) then
    H := 'Chennai';
    perform _seed_host(601,H,13.04,80.26,'Keerthana','Woman',31,'Doctor','Kutcheri season is my favourite season.',FC,WE,'👩🏾‍⚕️',15,'[["Music Academy concert","concerts",13,"Hosted",4.9,4]]');
    perform _seed_host(602,H,13.06,80.26,'Prakash','Man',29,'Engineer','Sathyam regular, beach at sunrise.',FM,WD,'👨🏾‍💻',11,'[["Marina sunrise walk","cafe",7,"Hosted",4.8,4]]');
    perform _seed_host(603,H,13.03,80.27,'Janani','Woman',27,'Dance teacher','Mylapore mornings, filter coffee always.',F,WD,'👩🏽‍🏫',12,'[["Mylapore tiffin","cafe",10,"Hosted",4.9,3]]');
    perform _seed_host(604,H,13.00,80.27,'Arvind','Man',33,'Chef','Seafood on ECR, any day.',F,WE,'👨🏽‍🍳',9,'[["Seafood lunch on ECR","cafe",16,"Hosted",4.7,4]]');
    perform _seed_host(605,H,13.06,80.24,'Nila','Non-binary',26,'Writer','Bookshops and open mics.',FC,WE,'🧑🏾',7,'[["Open-mic night","concerts",8,"Hosted",4.8,6]]');
    perform _seed_host(606,H,13.08,80.21,'Meenakshi','Woman',30,'Architect','Heritage walks and board games.',FM,WD,'👩🏻‍💼',10,'[["Mylapore heritage walk","cafe",12,"Hosted",4.9,5]]');
    perform _seed_act(602,'cafe','Sunrise walk on Marina Beach, sundal after',4,_t_next(6),null,'Marina Beach, near the lighthouse','own',H,null,D,p_lat=>13.0500,p_lng=>80.2824);
    perform _seed_act(603,'cafe','Filter coffee and tiffin in Mylapore',4,_t_next(8),null,'Saravana Bhavan, Mylapore','own',H,'{601}',D,p_lat=>13.0339,p_lng=>80.2677);
    perform _seed_act(604,'cafe','Evening at Elliot''s Beach, snacks from the carts',4,_t_next(18),null,'Elliot''s Beach, Besant Nagar','split',H,null,D,400,p_lat=>13.0003,p_lng=>80.2717);
    perform _seed_act(602,'movies','Evening show at Sathyam',4,_t_next(20,30),null,'Sathyam Cinemas, Royapettah','split',H,'{605}',D,1200,p_lat=>13.0555,p_lng=>80.2580);
    perform _seed_act(605,'concerts','Open-mic night in Nungambakkam',6,_t_next(20),null,'Open-mic café, Nungambakkam','own',H,null,D,p_lat=>13.0600,p_lng=>80.2420);
    perform _seed_act(606,'cafe','Board games in Anna Nagar, beginners welcome',5,_t_next(19),null,'Board game café, Anna Nagar','own',H,'{602,605}',D,p_lat=>13.0850,p_lng=>80.2101);
    perform _seed_act(601,'cafe','Shopping and snacks on Pondy Bazaar',4,_t_next(17),wo,'Pondy Bazaar, T Nagar','own',H,null,D,p_lat=>13.0410,p_lng=>80.2340);
    perform _seed_act(604,'concerts','Indie gig at a Besant Nagar café',4,_t_next(21),null,'Café in Besant Nagar','own',H,null,D,p_lat=>13.0010,p_lng=>80.2660);
    perform _seed_act(602,'movies','Late show at Phoenix Marketcity',3,_t_next(22),null,'PVR, Phoenix Marketcity, Velachery','split',H,null,D,1000,p_lat=>12.9918,p_lng=>80.2170);
    perform _seed_act(601,'concerts','Carnatic concert at the Music Academy',4,_t_at(4,18),null,'Music Academy, TTK Road','own',H,'{603}',W,p_lat=>13.0440,p_lng=>80.2590);
    perform _seed_act(604,'cafe','Seafood lunch on ECR',4,_t_at(5,13),null,'Seafood restaurant, ECR, Injambakkam','split',H,null,W,2400,p_lat=>12.9150,p_lng=>80.2500);
    perform _seed_act(606,'cafe','Craft village visit at DakshinaChitra',5,_t_at(6,10),null,'DakshinaChitra, Muttukadu','split',H,null,W,800,p_lat=>12.8230,p_lng=>80.2420);
    perform _seed_act(605,'cafe','Book browsing at Higginbothams, coffee after',4,_t_at(3,16),null,'Higginbothams, Anna Salai','own',H,null,W,p_lat=>13.0640,p_lng=>80.2740);
    perform _seed_act(603,'cafe','Morning walk in the Theosophical Society gardens',4,_t_at(7,7),null,'Theosophical Society, Adyar','own',H,null,W,p_lat=>13.0120,p_lng=>80.2580);
    perform _seed_act(605,'movies','French film night at Alliance Française',4,_t_at(8,18,30),null,'Alliance Française, Nungambakkam','own',H,'{606}',W,p_lat=>13.0670,p_lng=>80.2460);
    perform _seed_act(606,'cafe','Mylapore heritage walk around the temple tank',5,_t_at(9,7),null,'Kapaleeshwarar temple tank, Mylapore','own',H,null,W,p_lat=>13.0335,p_lng=>80.2698);
  end if;

  if not exists (select 1 from profiles where id = _sid(701)) then
    H := 'Ahmedabad';
    perform _seed_host(701,H,23.03,72.56,'Hetal','Woman',30,'Chartered accountant','Manek Chowk after midnight.',F,LN,'👩🏽‍💼',12,'[["Manek Chowk late-night food","cafe",8,"Hosted",4.8,4]]');
    perform _seed_host(702,H,23.03,72.59,'Parth','Man',32,'Textile designer','Heritage walks through the pols.',F,WD,'👨🏽‍🎨',17,'[["Pol heritage walk","cafe",14,"Hosted",4.9,5]]');
    perform _seed_host(703,H,23.04,72.55,'Riya','Woman',23,'Architecture student','Film club and chai.',M,WE,'👩🏻‍🎓',5,'[["Film club screening","movies",10,"Hosted",4.7,5]]');
    perform _seed_host(704,H,23.04,72.51,'Jignesh','Man',29,'Engineer','Board games and thali lunches.',F,WD,'👨🏻‍💻',9,'[["Board game night","cafe",11,"Hosted",4.8,5]]');
    perform _seed_host(705,H,23.03,72.53,'Krupa','Woman',27,'Singer','Sufi and folk nights.',C,WE,'👩🏾‍🎤',15,'[["Sufi night","concerts",6,"Hosted",4.9,4]]');
    perform _seed_host(706,H,23.02,72.57,'Neil','Non-binary',28,'Photographer','Riverfront sunsets.',F,WE,'🧑🏽',8,'[["Riverfront sunset walk","cafe",9,"Hosted",4.8,4]]');
    perform _seed_act(706,'cafe','Sunset walk on the Sabarmati Riverfront',4,_t_next(18),null,'Sabarmati Riverfront, near Ellis Bridge','own',H,null,D,p_lat=>23.0250,p_lng=>72.5710);
    perform _seed_act(701,'cafe','Late-night food at Manek Chowk',4,_t_next(22),null,'Manek Chowk','split',H,'{704}',D,600,p_lat=>23.0240,p_lng=>72.5880);
    perform _seed_act(704,'cafe','Gujarati thali lunch at Agashiye',4,_t_next(13),null,'Agashiye, Lal Darwaja','split',H,null,D,2800,p_lat=>23.0250,p_lng=>72.5830);
    perform _seed_act(703,'movies','Evening show at Ahmedabad One',3,_t_next(20,30),null,'PVR, Ahmedabad One mall, Vastrapur','split',H,null,D,900,p_lat=>23.0395,p_lng=>72.5310);
    perform _seed_act(705,'concerts','Open-mic night in Navrangpura',6,_t_next(20),null,'Open-mic café, Navrangpura','own',H,'{703}',D,p_lat=>23.0370,p_lng=>72.5600);
    perform _seed_act(704,'cafe','Board games in Bodakdev, beginners welcome',5,_t_next(19),null,'Board game café, Bodakdev','own',H,'{702,706}',D,p_lat=>23.0395,p_lng=>72.5140);
    perform _seed_act(701,'cafe','Snacks and shopping at the Law Garden night market',4,_t_next(19,30),wo,'Law Garden night market','own',H,null,D,p_lat=>23.0270,p_lng=>72.5560);
    perform _seed_act(706,'cafe','Evening at Kankaria Lake',4,_t_next(18,30),null,'Kankaria Lake, main gate','own',H,null,D,p_lat=>23.0060,p_lng=>72.6020);
    perform _seed_act(705,'concerts','Live acoustic set on SG Highway',4,_t_next(21),null,'Café on SG Highway','own',H,null,D,p_lat=>23.0300,p_lng=>72.5070);
    perform _seed_act(702,'cafe','Old city heritage walk through the pols',5,_t_at(4,8),null,'Swaminarayan Temple, Kalupur','own',H,'{701}',W,p_lat=>23.0270,p_lng=>72.5920);
    perform _seed_act(706,'cafe','Morning at Sabarmati Ashram, chai after',4,_t_at(5,9),null,'Sabarmati Ashram','own',H,null,W,p_lat=>23.0607,p_lng=>72.5807);
    perform _seed_act(705,'concerts','Sufi and folk night',4,_t_at(6,20),null,'Music café, Satellite','own',H,'{702}',W,p_lat=>23.0280,p_lng=>72.5250);
    perform _seed_act(703,'movies','Film club screening, chai after',5,_t_at(3,18,30),null,'Café near CEPT University, Navrangpura','own',H,null,W,p_lat=>23.0390,p_lng=>72.5480);
    perform _seed_act(702,'cafe','Trip to Adalaj stepwell, breakfast on the way',4,_t_at(7,7,30),null,'Adalaj Stepwell','split',H,null,W,800,p_lat=>23.1668,p_lng=>72.5807);
    perform _seed_act(704,'movies','Weekend blockbuster at Himalaya Mall',4,_t_at(8,15),null,'INOX, Himalaya Mall, Drive-in Road','split',H,null,W,1000,p_lat=>23.0490,p_lng=>72.5310);
    perform _seed_act(701,'cafe','Morning walk around Vastrapur Lake',4,_t_at(9,7),null,'Vastrapur Lake','own',H,null,W,p_lat=>23.0370,p_lng=>72.5270);
  end if;
end $$;
