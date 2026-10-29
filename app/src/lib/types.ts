/* What app_state() in web/schema-app.sql returns. Times are milliseconds since 1970. */
export type Gender = 'Woman' | 'Man' | 'Non-binary';
export type Cat = 'movies' | 'cafe' | 'concerts';
export type Cost = 'split' | 'own' | 'host';
export type ReqStatus = 'pending' | 'accepted' | 'rejected' | 'waitlist' | 'left' | 'removed';

export type RawProfile = {
  id: string; name: string; dob: string; gender: Gender; hood: string; lat: number | null; lng: number | null;
  job: string; bio: string; ints: string[]; avail: string[]; emo: string; face: boolean; kyc: boolean;
  onboarded: boolean; usage_ok: boolean; consent_version: string | null; state: Record<string, unknown>;
};

export type RawPerson = {
  id: string; name: string; gender: Gender; age: number; job: string; bio: string; emo: string;
  kyc: boolean; face: boolean; sample: boolean; ints: string[]; avail: string[]; hist: unknown[]; met: number; shows: number;
};

export type RawAct = {
  id: string; host: string; cat: Cat; desc: string; cap: number; when: number; aud: Gender[] | null;
  venue: string; cost: Cost; total: number | null; hood: string; lat: number | null; lng: number | null;
  repeat: 'weekly' | 'biweekly' | 'monthly' | null; status: 'open' | 'full'; created: number;
  mcount: number; members: string[]; wl: number; mypos: number | null;
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

export type VerifyKind = { fails: number; attempts: number; max: number; review: boolean };

export type AppStateResponse = {
  me: string; email: string; now: number;
  verify: { face: VerifyKind; kyc: VerifyKind };
  mode: { face: 'simulated' | 'live'; kyc: 'simulated' | 'live' };
  profile: RawProfile | null;
  draft?: unknown;
  people?: RawPerson[]; acts?: RawAct[]; reqs?: RawReq[]; msgs?: RawMsg[]; notes?: RawNote[];
  ratings?: { act: string; ok: 'yes' | 'no'; stars: number; people: Record<string, string>; at: number }[];
  reported?: number[]; blocked?: string[]; locked?: number;
  cities?: [string, string, number, number][]; city?: string | null; city_auto?: boolean; terms_v?: string;
};
