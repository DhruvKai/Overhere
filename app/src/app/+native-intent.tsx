import { gotInvite, inviteFrom } from '@/lib/invite';

/* Links from outside the app arrive here before routing. An invite link (overhere.social/app.html#act=<id>) opens
   that plan, or waits until sign-in and the profile are done (lib/invite.ts). Anything else on overhere.social
   (an email-confirmation link, the home page) just opens the app. App links like overhere://plan/<id> route as usual. */
export function redirectSystemPath({ path }: { path: string; initial: boolean }) {
  try {
    const id = inviteFrom(path);
    if (id) return gotInvite(id) ? `/plan/${id}` : '/';
    if (/^https?:\/\/(www\.)?overhere\.social\b/i.test(path)) return '/';
    return path;
  } catch {
    return '/';
  }
}
