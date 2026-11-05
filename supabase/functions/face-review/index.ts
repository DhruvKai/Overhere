// The /addmin review queue's face check part. The dashboard password is checked by the database (admin_reviews /
// admin_decide_review, which also count wrong passwords and lock after too many), never here.
//   {pass, action: 'frames'}                          signed links (1 hour) to the frames from each waiting person's
//                                                     failed scans, and a sweep that deletes frames nobody needs
//   {pass, action: 'decide', user, kind, approve}     records the decision, then deletes that person's frames
import { admin, corsHeaders, guard, json, smallJson } from '../_shared/common.ts';
import { deleteFrames, frameLinks, sweepFrames } from '../_shared/frames.ts';

Deno.serve(async (req) => {
  const early = guard(req);
  if (early) return early;
  const h = corsHeaders(req);
  try {
    const body = await smallJson(req);
    const pass = typeof body.pass === 'string' ? body.pass : '';
    const db = admin();

    if (body.action === 'frames') {
      const { data: rv, error } = await db.rpc('admin_reviews', { pass });
      if (error) return json({ error: error.message }, 400, h);
      if (rv?.error) return json({ error: rv.error }, 403, h);
      await sweepFrames(db);
      const frames: Record<string, { url: string; at: number }[]> = {};
      for (const x of rv as { user: string; kind: string }[]) {
        if (x.kind === 'face' && !frames[x.user]) frames[x.user] = await frameLinks(db, x.user);
      }
      return json({ frames }, 200, h);
    }

    if (body.action === 'decide') {
      const user = typeof body.user === 'string' && /^[0-9a-f-]{36}$/i.test(body.user) ? body.user : '';
      const kind = body.kind === 'face' || body.kind === 'kyc' ? body.kind : '';
      if (!user || !kind || typeof body.approve !== 'boolean') return json({ error: 'Bad request' }, 400, h);
      const { data, error } = await db.rpc('admin_decide_review', { pass, p_user: user, p_kind: kind, p_approve: body.approve });
      if (error) return json({ error: error.message }, 400, h);
      if (data?.error) return json({ error: data.error }, 403, h);
      if (kind === 'face') await deleteFrames(db, user);
      return json({ ok: true }, 200, h);
    }

    return json({ error: 'Bad request' }, 400, h);
  } catch (e) {
    console.error('face-review', e);
    return json({ error: 'Something went wrong. Please try again.' }, 500, h);
  }
});
