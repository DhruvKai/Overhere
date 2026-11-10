/* Invite links: https://overhere.social/app.html#act=<plan id>, made by Share on the website and in the app
   (lib/share.ts). On Android they open the app (app.json intentFilters + web/.well-known/assetlinks.json), and
   app/+native-intent.tsx hands them here. Like INVITE / openInvite in web/app.js: a link that arrives before someone
   is signed in and set up waits, and opens once they are (the root layout calls takeInvite). */
const ID = /[#?&/]act=([0-9a-f-]{36})(?![0-9a-f-])/i;

export const inviteFrom = (url: string): string | null => url.match(ID)?.[1]?.toLowerCase() ?? null;

let pending: string | null = null;
let ready = false;   // signed in, with a finished profile: a plan can open straight away

/* The root layout says when plans can open. */
export const setInviteReady = (on: boolean) => { ready = on; };

/* A link came in. Returns true when it can open now; otherwise it's kept for takeInvite. */
export function gotInvite(id: string): boolean {
  if (ready) return true;
  pending = id;
  return false;
}

export function takeInvite(): string | null {
  const id = pending;
  pending = null;
  return id;
}

/* What to say when an invited plan isn't in your list: the same messages as INVITE_MISS in web/app.js. */
export const INVITE_MISS: Record<string, string> = {
  past: 'That plan has already happened.',
  audience: "That plan is for a different group, so it isn't open to you.",
  verify: 'That plan is for a limited group. Do the face check (Profile) to see it.',
};
