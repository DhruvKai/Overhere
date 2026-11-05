// Finishes a face check: asks AWS for the liveness result, compares the live face with both of the person's photos,
// and records pass or fail in the database. The browser only sends the session id; the decision is made here.
import { CompareFacesCommand, GetFaceLivenessSessionResultsCommand } from 'npm:@aws-sdk/client-rekognition@3';
import { admin, caller, corsHeaders, guard, json, rekognition, smallJson } from '../_shared/common.ts';
import { deleteFrames, faceAlert, saveFrame } from '../_shared/frames.ts';

// Confidence (0-100) that it was a live person. AWS suggests starting around 80; raise it to be stricter.
const MIN_CONFIDENCE = Number(Deno.env.get('FACE_MIN_CONFIDENCE') ?? '80');
// Similarity (0-100) between the live face and each photo for it to count as the same person.
const MIN_MATCH = Number(Deno.env.get('FACE_MIN_MATCH') ?? '90');

/** How similar the live face is to a photo (0-100), or null when either image has no usable face. */
async function matchScore(live: Uint8Array, photo: Uint8Array): Promise<number | null> {
  try {
    const r = await rekognition().send(new CompareFacesCommand({
      SourceImage: { Bytes: live }, TargetImage: { Bytes: photo }, SimilarityThreshold: 0, QualityFilter: 'AUTO',
    }));
    return Math.max(0, ...(r.FaceMatches ?? []).map((m) => m.Similarity ?? 0));   // 0: faces found, not the same
  } catch (e) {
    // InvalidParameterException: no face found in one of the images
    console.warn('face-result compare', (e as Error).name);
    return null;
  }
}

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
    const live = res.Status === 'SUCCEEDED' && score >= MIN_CONFIDENCE;

    // Same person as both photos? The reference image is the frame AWS picked from the video. A passing frame is
    // never stored; a failing one is kept for the reviewers only if the person agreed to that (keepFrame, below).
    // Both photos have to match, so neither can be of someone else. `which` says which photo failed (1 or 2).
    const match: (number | null)[] = [];
    let reason = live ? '' : 'not_live', which = 0;
    if (live) {
      const db = admin();
      const { data: prof } = await db.from('profiles').select('photo, photo2').eq('id', user.id).maybeSingle();
      const ref = res.ReferenceImage?.Bytes;
      if (!prof?.photo || !prof?.photo2) reason = 'no_photo';
      else if (!ref) reason = 'no_reference';
      else {
        for (const [i, path] of [prof.photo, prof.photo2].entries()) {
          const file = await db.storage.from('avatars').download(path);
          if (file.error || !file.data) { reason = 'photo_missing'; which = i + 1; break; }
          const m = await matchScore(ref, new Uint8Array(await file.data.arrayBuffer()));
          match.push(m === null ? null : Math.round(m * 10) / 10);
          if (m === null || m < MIN_MATCH) { reason = m === null ? 'no_face' : 'no_match'; which = i + 1; break; }
        }
      }
    }
    const passed = live && reason === '';

    // Did the person agree, when starting this scan, that a frame from a failed scan is kept for review? (face-start)
    const db = admin();
    const { data: started } = await db.from('verifications').select('detail')
      .eq('user_id', user.id).eq('session_id', sessionId).eq('status', 'started').maybeSingle();
    const keepFrame = started?.detail?.frames === true;

    // Checks the session belongs to this person, was started in the last 30 minutes and wasn't used before.
    const { data: status, error } = await db.rpc('verify_finish_service', {
      p_user: user.id, p_kind: 'face', p_session: sessionId, p_passed: passed,
      p_score: Math.round(score * 100) / 100,
      p_detail: { aws_status: res.Status, match, photo: which || null, reason: reason || null, frame: !passed && keepFrame && !!res.ReferenceImage?.Bytes },
    });
    if (error) return json({ error: error.message }, 400, h);

    if (passed) await deleteFrames(db, user.id);   // verified: nothing left to review
    else {
      const ref = res.ReferenceImage?.Bytes;
      if (keepFrame && ref) await saveFrame(db, user.id, ref);
      if (status === 'review') await faceAlert(db, user.id);   // that was the last try: paused, tell the team
    }
    // Tell the person why, so a retry can fix it (better light, or a clearer photo), naming the photo at fault.
    const nth = which === 2 ? 'second photo' : 'first photo';
    const why = { not_live: "We couldn't confirm it was a live person. Try again in good light, facing the camera.",
      no_photo: 'Add two photos of your face first.', photo_missing: `Upload your ${nth} again, then retry.`,
      no_reference: 'The check could not finish. Please try again.',
      no_face: `We couldn't see a face clearly in your ${nth}. Replace it with a clear, front-facing photo.`,
      no_match: `Your face didn't match your ${nth}. Replace it with a recent, clear photo of yourself.` }[reason];
    return json({ status, reason: reason || null, message: passed ? null : why }, 200, h);
  } catch (e) {
    console.error('face-result', e);
    return json({ error: 'The face check could not finish. Please try again.' }, 500, h);
  }
});
