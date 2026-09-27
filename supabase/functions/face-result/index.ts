// Finishes a face check: asks AWS for the liveness result and records pass or fail in the database.
// The browser only sends the session id; the decision is made here, from AWS's answer.
import { GetFaceLivenessSessionResultsCommand } from 'npm:@aws-sdk/client-rekognition@3';
import { admin, caller, corsHeaders, guard, json, rekognition, smallJson } from '../_shared/common.ts';

// Confidence (0-100) that it was a live person. AWS suggests starting around 80; raise it to be stricter.
const MIN_CONFIDENCE = Number(Deno.env.get('FACE_MIN_CONFIDENCE') ?? '80');

Deno.serve(async (req) => {
  const early = guard(req);
  if (early) return early;
  const h = corsHeaders(req);
  try {
    const user = await caller(req);
    if (!user) return json({ error: 'Please sign in again' }, 401, h);

    const body = await smallJson(req);
    const sessionId = typeof body.sessionId === 'string' ? body.sessionId : '';
    if (!/^[0-9a-f-]{36}$/i.test(sessionId)) return json({ error: 'Bad request' }, 400, h);

    const res = await rekognition().send(new GetFaceLivenessSessionResultsCommand({ SessionId: sessionId }));
    if (res.Status === 'CREATED' || res.Status === 'IN_PROGRESS') {
      return json({ error: 'Still checking. Please try again in a moment.' }, 409, h);
    }
    const score = typeof res.Confidence === 'number' ? res.Confidence : 0;
    const passed = res.Status === 'SUCCEEDED' && score >= MIN_CONFIDENCE;

    // Checks the session belongs to this person, was started in the last 30 minutes and wasn't used before.
    // Only the outcome is stored: no images (the reference image AWS returns is dropped here).
    const { data: status, error } = await admin().rpc('verify_finish_service', {
      p_user: user.id, p_kind: 'face', p_session: sessionId, p_passed: passed,
      p_score: Math.round(score * 100) / 100, p_detail: { aws_status: res.Status },
    });
    if (error) return json({ error: error.message }, 400, h);
    return json({ status }, 200, h);
  } catch (e) {
    console.error('face-result', e);
    return json({ error: 'The face check could not finish. Please try again.' }, 500, h);
  }
});
