/* What app_state() in web/schema-app.sql returns. Times are milliseconds since 1970. */
export type Gender = 'Woman' | 'Man' | 'Non-binary';
/* the 13 categories of the 7 Nov 2026 spec (activities_cat_check in web/schema-app.sql) */
export type Cat = 'fitness' | 'movies' | 'theatre' | 'comedy' | 'concerts' | 'hangout' | 'cafe' | 'adventure' | 'outdoor' | 'errands'
  | 'work' | 'selfcare' | 'nightlife';
export type Cost = 'split' | 'own' | 'host';
/* 'closed' is the app's own: your rejected requests and old waitlist ones (a rejection is silent) */
export type ReqStatus = 'pending' | 'accepted' | 'rejected' | 'waitlist' | 'left' | 'removed' | 'closed';

export type RawProfile = {
  id: string; name: string; dob: string; gender: Gender; hood: string; lat: number | null; lng: number | null;
  job: string; bio: string; ints: string[]; avail: string[]; emo: string; photo: string | null; photo2: string | null; face: boolean; kyc: boolean;
  onboarded: boolean; usage_ok: boolean; consent_version: string | null; state: Record<string, unknown>;
};

export type RawPerson = {
  id: string; name: string; gender: Gender; age: number; job: string; bio: string; emo: string; photo: string | null; photo2: string | null;
  kyc: boolean; face: boolean; sample: boolean; ints: string[]; avail: string[]; hist: unknown[]; met: number; shows: number; noshows?: number;
};

export type RawAct = {
  id: string; host: string; cat: Cat; desc: string; cap: number; when: number; aud: Gender[] | null;
  venue: string; cost: Cost; total: number | null; hood: string; lat: number | null; lng: number | null;
  repeat: 'weekly' | 'biweekly' | 'monthly' | null; status: 'open' | 'full'; created: number;
  mcount: number; members: string[]; wl: number; mypos: number | null;
  /* hours (1-24); open "relist the spot?" questions (host); attendance recorded (host); how the host marked you */
  dur?: number; relist?: number; att_done?: boolean; my_att?: 'show' | 'noshow' | null; my_reply?: boolean;
};

export type RawReq = { id: string; act: string; user: string; note: string; status: ReqStatus; at: number };

export type RawMsg = {
  id: number; act: string; from: string | null; sys: boolean; text: string; at: number;
  poll: { q: string; opts: string[] } | null; votes: { u: string; o: number }[] | null;
};

export type RawNote = {
  id: string; kind: 'req' | 'update' | 'remind'; title: string; tag: string; tone: string; act: string | null;
  text: string; flags: string[]; read: boolean; key: string | null; at: number;
};

/* review: paused right now after the last allowed try, until `until` (ms); pending: in the team's review queue.
   until/pending are missing on a database from before the 24-hour pause. */
export type VerifyKind = { fails: number; attempts: number; max: number; review: boolean; until?: number | null; pending?: boolean };

export type AppStateResponse = {
  me: string; email: string; now: number;
  verify: { face: VerifyKind; kyc: VerifyKind };
  mode: { face: 'simulated' | 'live'; kyc: 'simulated' | 'live' };
  profile: RawProfile | null;
  draft?: unknown;
  people?: RawPerson[]; acts?: RawAct[]; reqs?: RawReq[]; msgs?: RawMsg[]; notes?: RawNote[];
  ratings?: { act: string; ok: 'yes' | 'no'; stars: number; host_stars?: number | null; people: Record<string, string>; at: number }[];
  /* your hosted plans that ended and still need attendance; overdue after three unanswered reminders */
  due?: { act: string; overdue: boolean }[];
  reported?: number[]; blocked?: string[]; locked?: number;
  cities?: [string, string, number, number][]; city?: string | null; city_auto?: boolean; terms_v?: string;
};
