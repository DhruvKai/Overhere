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
  hood        text not null check (hood in ('Sector 17','Sector 7','Sector 22')),
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
  hood          text not null check (hood in ('Sector 17','Sector 7','Sector 22')),
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

-- Signed-in people can also log usage events (the anon policy in schema.sql covers signed-out visitors).
do $$ begin
  create policy "signed-in people can log events" on events for insert to authenticated with check (true);
exception when others then null; end $$;

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
declare a activities; nid uuid; nxt timestamptz; step interval; k int;
begin
  if not pg_try_advisory_xact_lock(4242) then return; end if;
  if exists (select 1 from app_meta where k = 'housekeeping' and v > now() - interval '2 minutes') then return; end if;
  insert into app_meta (k, v) values ('housekeeping', now()) on conflict (k) do update set v = excluded.v;

  for a in select * from activities where repeat is not null and next_id is null and sample_period is null and starts_at <= now() loop
    step := case a.repeat when 'monthly' then interval '1 month' when 'biweekly' then interval '14 days' else interval '7 days' end;
    -- months differ in length, so step from the first date (the 31st stays the 31st or the month's last day)
    k := greatest(1, floor(extract(epoch from now() - a.starts_at) / extract(epoch from step))::int - 1);
    loop nxt := a.starts_at + step * k; exit when nxt > now(); k := k + 1; end loop;
    insert into activities (host, cat, description, cap, starts_at, audience, venue, cost, total, hood, repeat)
    values (a.host, a.cat, a.description, a.cap, nxt, a.audience, a.venue, a.cost, a.total, a.hood, a.repeat)
    returning id into nid;
    update activities set next_id = nid where id = a.id;
    perform _note(a.host, 'update', 'Repeat posted', case a.repeat when 'monthly' then 'Every month' when 'biweekly' then 'Every 2 weeks' else 'Every week' end, 'info', nid,
      format('The next "%s" is posted for %s.', _short(a.description), _when(nxt)));
  end loop;

  for a in select * from activities where sample_period is not null and starts_at <= now() loop
    nxt := a.starts_at + a.sample_period * (floor(extract(epoch from now() - a.starts_at) / extract(epoch from a.sample_period)) + 1);
    if exists (select 1 from requests r join profiles p on p.id = r.user_id where r.act = a.id and not p.is_sample) then
      insert into activities (host, cat, description, cap, starts_at, audience, venue, cost, total, hood, repeat, sample_period)
      values (a.host, a.cat, a.description, a.cap, nxt, a.audience, a.venue, a.cost, a.total, a.hood, a.repeat, a.sample_period)
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
end $$;

create or replace function _seed_chat(p_act uuid) returns void language plpgsql as $$
declare a activities; other uuid;
begin
  select * into a from activities where id = p_act;
  other := coalesce((_members(p_act))[1], a.host);
  insert into messages (act, sender, sys, body, created_at) values
    (p_act, null,    true,  'Chat created',                                now() - interval '2 hours'),
    (p_act, a.host,  false, 'Hey all! Excited for this one.',              now() - interval '1 hour'),
    (p_act, other,   false, 'Me too, what time should we meet?',           now() - interval '50 minutes'),
    (p_act, a.host,  false, 'Let us meet 15 min before at the entrance.',  now() - interval '40 minutes');
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

-- Everything the signed-in person may see, in one go.
create or replace function app_state() returns jsonb language plpgsql security definer set search_path = public as $$
declare
  u uuid := _uid();
  em text := lower(coalesce(auth.jwt() ->> 'email', ''));
  prof profiles; pre jsonb; draft jsonb;
  act_ids uuid[]; chat_ids uuid[]; pids uuid[];
  j_acts jsonb; j_people jsonb; j_reqs jsonb; j_msgs jsonb; j_notes jsonb; j_rat jsonb; j_rep jsonb; j_blk jsonb; n_locked int;
begin
  perform _housekeeping();

  select * into prof from profiles where id = u;
  if not found then
    select data into pre from profile_presets where email = em;
    if pre is not null then
      -- Demo accounts start verified only while checks are simulated; in live mode they verify like anyone else.
      insert into profiles (id, email, name, dob, gender, hood, job, bio, ints, avail, emo, face, kyc, onboarded, trust_met, trust_shows, hist)
      values (u, em, pre->>'name', (pre->>'dob')::date, pre->>'gender', pre->>'hood', coalesce(pre->>'job', ''), coalesce(pre->>'bio', ''),
              array(select jsonb_array_elements_text(coalesce(pre->'ints', '[]'))), array(select jsonb_array_elements_text(coalesce(pre->'avail', '[]'))),
              coalesce(pre->>'emo', ''), _simulated('face'), _simulated('kyc') and coalesce((pre->>'kyc')::boolean, true), _simulated('face'),
              coalesce((pre->>'met')::int, 0), coalesce((pre->>'shows')::int, 0), coalesce(pre->'hist', '[]'))
      returning * into prof;
    else
      if _may_prefill() then
        select jsonb_build_object('name', name, 'dob', dob, 'gender', gender,
                 'hood', case neighborhood when 'Central Market' then 'Sector 17' when 'Lakeside' then 'Sector 7' when 'Old Quarter' then 'Sector 22' else neighborhood end,
                 'ints', interests, 'avail', availability)
        into draft from participants where lower(email) = em order by created_at desc limit 1;
      end if;
      return jsonb_build_object('me', u, 'email', em, 'profile', null, 'draft', draft, 'now', _ms(now()),
                                'verify', _verify_state(u), 'mode', _modes());
    end if;
  end if;

  -- Anyone can browse; posting and asking to join need the face check (post_activity, request_join).

  -- Upcoming plans open to this person, plus anything they host or asked to join (up to 90 days back).
  select coalesce(array_agg(a.id), '{}') into act_ids from activities a
  where (a.starts_at > now() and a.host <> u and _eligible(a, u))
     or ((a.host = u or exists (select 1 from requests r where r.act = a.id and r.user_id = u)) and a.starts_at > now() - interval '90 days');

  -- Plans whose members and chat this person may see: hosting, or accepted.
  select coalesce(array_agg(a.id), '{}') into chat_ids from activities a
  where a.id = any (act_ids)
    and (a.host = u or exists (select 1 from requests r where r.act = a.id and r.user_id = u and r.status = 'accepted'));

  select coalesce(jsonb_agg(jsonb_build_object(
      'id', a.id, 'host', a.host, 'cat', a.cat, 'desc', a.description, 'cap', a.cap, 'when', _ms(a.starts_at),
      'aud', a.audience, 'venue', a.venue, 'cost', a.cost, 'total', a.total, 'hood', a.hood, 'repeat', a.repeat,
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
    and a.hood = prof.hood and not _blocked(u, a.host);
  select coalesce(jsonb_agg(msg), '[]') into j_rep from reports where reporter = u and msg is not null;
  select coalesce(jsonb_agg(blocked), '[]') into j_blk from blocks where blocker = u;

  return jsonb_build_object('me', u, 'email', em, 'now', _ms(now()),
    'verify', _verify_state(u), 'mode', _modes(),
    'profile', to_jsonb(prof) - 'email' - 'trust_met' - 'trust_shows' - 'hist',
    'people', j_people, 'acts', j_acts, 'reqs', j_reqs, 'msgs', j_msgs, 'notes', j_notes,
    'ratings', j_rat, 'reported', j_rep, 'blocked', j_blk, 'locked', n_locked);
end $$;

-- Create or update your own profile. Only the fields sent are changed.
create or replace function save_profile(p jsonb) returns void language plpgsql security definer set search_path = public as $$
declare u uuid := _uid(); em text := lower(coalesce(auth.jwt() ->> 'email', '')); cur profiles;
begin
  select * into cur from profiles where id = u;
  if found then
    -- After the ID check, gender and date of birth come from the ID: changing them goes through a person.
    if cur.kyc and ((p ? 'gender' and p->>'gender' is distinct from cur.gender) or (p ? 'dob' and (p->>'dob')::date is distinct from cur.dob)) then
      raise exception 'Your gender and date of birth are confirmed by your ID. To change them, please email us.';
    end if;
    update profiles set
      name   = coalesce(p->>'name', name),
      dob    = coalesce((p->>'dob')::date, dob),
      gender = coalesce(p->>'gender', gender),
      hood   = coalesce(p->>'hood', hood),
      job    = coalesce(p->>'job', job),
      bio    = coalesce(p->>'bio', bio),
      ints   = case when p ? 'ints'  then array(select jsonb_array_elements_text(p->'ints'))  else ints end,
      avail  = case when p ? 'avail' then array(select jsonb_array_elements_text(p->'avail')) else avail end,
      emo    = coalesce(p->>'emo', emo),
      -- the face check is optional at sign-up; face and kyc themselves are never set here
      onboarded = onboarded or coalesce((p->>'onboarded')::boolean, false)
    where id = u;
  else
    if coalesce(p->>'consent', '') <> 'true' then raise exception 'Please tick the consent box to continue'; end if;
    insert into profiles (id, email, name, dob, gender, hood, job, bio, ints, avail, emo, consent_version, consent_at)
    values (u, em, p->>'name', (p->>'dob')::date, p->>'gender', p->>'hood', coalesce(p->>'job', ''), coalesce(p->>'bio', ''),
            array(select jsonb_array_elements_text(coalesce(p->'ints', '[]'))), array(select jsonb_array_elements_text(coalesce(p->'avail', '[]'))),
            coalesce(p->>'emo', ''), 'app-v1', now());
    if _may_prefill() then
      update participants set user_id = u where lower(email) = em and user_id is null and em <> '';
    end if;
  end if;
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
  insert into activities (host, cat, description, cap, starts_at, audience, venue, cost, total, hood, repeat)
  values (u, p->>'cat', trim(p->>'desc'), (p->>'cap')::int, st,
          case when jsonb_typeof(p->'aud') = 'array' then array(select jsonb_array_elements_text(p->'aud')) end,
          trim(p->>'venue'), p->>'cost', nullif((p->>'total')::int, 0), me.hood, nullif(p->>'repeat', ''))
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
    venue = trim(p->>'venue'), cost = p->>'cost', total = nullif((p->>'total')::int, 0), repeat = nullif(p->>'repeat', '')
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
create or replace function _admin_ok(p_pass text) returns void language plpgsql as $$
begin
  if p_pass is null or not exists (select 1 from admin_secret s where s.pass = p_pass) then
    perform pg_sleep(1);                     -- slows down password guessing
    raise exception 'wrong password';
  end if;
end $$;

-- Everyone waiting for a person to look at their face or ID check.
create or replace function admin_reviews(pass text) returns jsonb language plpgsql security definer set search_path = public as $$
begin
  perform _admin_ok(pass);
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

create or replace function admin_decide_review(pass text, p_user uuid, p_kind text, p_approve boolean) returns void
language plpgsql security definer set search_path = public as $$
begin
  perform _admin_ok(pass);
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
end $$;

-- Who may call what. Supabase gives new functions to everyone by default, so this takes that away first.
do $$ declare f record; begin
  for f in select p.oid::regprocedure sig, p.proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
           where n.nspname = 'public' and (p.proname like '\_%' or p.proname in ('app_state','save_profile','save_state','post_activity',
             'edit_activity','cancel_activity','request_join','withdraw_request','decide_request','leave_activity','remove_member','send_message','vote',
             'rate_activity','report','block_user','unblock_user','add_notification','read_notifications','verify_simulated',
             'verify_precheck_service','verify_start_service','verify_finish_service','admin_reviews','admin_decide_review'))
  loop
    execute format('revoke all on function %s from public, anon, authenticated', f.sig);
    execute format('alter function %s set search_path = public', f.sig);
    if f.proname in ('verify_precheck_service', 'verify_start_service', 'verify_finish_service') then
      execute format('grant execute on function %s to service_role', f.sig);       -- Edge Functions only
    elsif f.proname in ('admin_reviews', 'admin_decide_review') then
      execute format('grant execute on function %s to anon, authenticated', f.sig); -- password checked inside
    elsif f.proname not like '\_%' then
      execute format('grant execute on function %s to authenticated', f.sig);       -- signed-in people
    end if;
  end loop;
end $$;

-- Deleting someone in Authentication -> Users also deletes their profile, plans, requests, notifications,
-- ratings and checks (their chat messages stay, shown without a name), and unlinks their old beta sign-up.
create or replace function _on_auth_user_deleted() returns trigger language plpgsql security definer set search_path = public as $$
begin
  delete from profiles where id = old.id and not is_sample;
  update participants set user_id = null where user_id = old.id;
  return old;
end $$;
revoke all on function _on_auth_user_deleted() from public, anon, authenticated;
drop trigger if exists overhere_user_deleted on auth.users;
create trigger overhere_user_deleted after delete on auth.users for each row execute function _on_auth_user_deleted();

-- ---------- sample people and plans (added once) ----------

insert into profile_presets (email, data) values
  ('kajal@overhere.test', '{"name":"Kajal","gender":"Woman","dob":"1998-02-02","hood":"Sector 17","job":"UX Researcher","bio":"Weekend brunches, indie gigs and the occasional horror movie. Always on time.","ints":["Movies","Cafe / Food","Concerts"],"avail":["Weekday evenings","Late nights"],"emo":"👩🏽‍🔬","kyc":true,"met":18,"shows":18,"hist":[["Sunday brunch club","cafe",5,"Hosted",4.9,6],["Indie night in Sector 26","concerts",16,"Joined",4.7,1],["Horror double bill","movies",31,"Hosted",4.8,4]]}'),
  ('arjun@overhere.test', '{"name":"Arjun","gender":"Man","dob":"1995-09-18","hood":"Sector 17","job":"Software Engineer","bio":"Weekend cricket, Friday night movies, always up for street food.","ints":["Movies","Cafe / Food"],"avail":["Weekend days","Weekend evenings"],"emo":"👨🏾‍💻","kyc":true,"met":9,"shows":9,"hist":[["Friday night thriller","movies",8,"Hosted",4.7,4],["Sector 35 food crawl","cafe",22,"Joined",4.5,1]]}'),
  ('neha@overhere.test',  '{"name":"Neha","gender":"Woman","dob":"2001-06-14","hood":"Sector 17","job":"","bio":"","ints":["Cafe / Food"],"avail":["Weekend days"],"emo":"👩🏻","kyc":false}')
on conflict (email) do nothing;

create or replace function _sid(n int) returns uuid language sql immutable as $$
  select ('a0000000-0000-4000-8000-' || lpad(n::text, 12, '0'))::uuid $$;

create or replace function _seed_act(p_host int, p_cat text, p_desc text, p_cap int, p_when timestamptz, p_aud text[], p_venue text,
                                     p_cost text, p_hood text, p_members int[], p_period interval, p_total int default null,
                                     p_repeat text default null, p_status text default 'open')
returns void language plpgsql as $$
declare nid uuid; m int; i int := 0;
begin
  insert into activities (host, cat, description, cap, starts_at, audience, venue, cost, total, hood, repeat, status, sample_period, created_at)
  values (_sid(p_host), p_cat, p_desc, p_cap, p_when, p_aud, p_venue, p_cost, p_total, p_hood, p_repeat, p_status, p_period, now() - interval '1 day')
  returning id into nid;
  foreach m in array coalesce(p_members, '{}') loop
    i := i + 1;
    insert into requests (act, user_id, status, created_at) values (nid, _sid(m), 'accepted', now() - interval '3 hours' + i * interval '1 minute');
  end loop;
  if cardinality(coalesce(p_members, '{}')) > 0 then perform _seed_chat(nid); end if;
end $$;
revoke all on function _sid(int) from public, anon, authenticated;
revoke all on function _seed_act(int, text, text, int, timestamptz, text[], text, text, text, int[], interval, int, text, text) from public, anon, authenticated;

do $$
declare D interval := interval '1 day'; W interval := interval '14 days'; S17 text := 'Sector 17'; wo text[] := array['Woman']; mn text[] := array['Man','Non-binary'];
begin
  if exists (select 1 from profiles where is_sample) then return; end if;

  insert into profiles (id, is_sample, name, dob, gender, hood, job, bio, ints, avail, emo, face, kyc, onboarded, trust_met, trust_shows, hist)
  select _sid(n), true, name, current_date - (age * interval '1 year') - interval '100 days', gender, 'Sector 17', job, bio, ints, avail, emo, true, kyc, true, met, shows, hist::jsonb
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
  perform _seed_act(8,'cafe','Trying the new ramen place (only 1 spot left)',3,_t_at(3,13),null,'Ramen bar, Sector 9','split',S17,'{5,3}',W,2400);
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
-- A few sample plans moved from "happening soon" to about a week out, so Discover has more (fixes databases seeded before).
update activities set starts_at = _t_at(7,19,0), sample_period = interval '14 days' where host = _sid(5) and description = 'Rock night, local bands' and sample_period = interval '1 day';
update activities set starts_at = _t_at(6,17,0), sample_period = interval '14 days' where host = _sid(6) and description = 'Tea tasting flight' and sample_period = interval '1 day';
update activities set starts_at = _t_at(7,18,30), sample_period = interval '14 days' where host = _sid(11) and description = 'Anime movie night, subtitles on' and sample_period = interval '1 day';
update activities set starts_at = _t_at(8,20,30), sample_period = interval '14 days' where host = _sid(3) and description = 'Vinyl listening evening, bring a record' and sample_period = interval '1 day';
update activities set starts_at = _t_at(7,21,0), sample_period = interval '14 days' where host = _sid(7) and description = 'Retro Bollywood karaoke' and sample_period = interval '1 day';
update activities set starts_at = _t_at(8,14,0), sample_period = interval '14 days' where host = _sid(6) and description = 'Pictionary and pizza, beginners welcome' and sample_period = interval '1 day';
