// Starts a face check (AWS Rekognition Face Liveness) for the signed-in person.
// 1. creates a liveness session at AWS
// 2. records in the database that this person started it (verify_start_service)
// 3. returns short-lived AWS credentials that can do exactly one thing: stream the video for a liveness session.
//    They expire after 15 minutes. The video goes from the browser straight to AWS, never through Overhere.
import { CreateFaceLivenessSessionCommand } from 'npm:@aws-sdk/client-rekognition@3';
import { AssumeRoleCommand, STSClient } from 'npm:@aws-sdk/client-sts@3';
import { admin, awsCreds, caller, corsHeaders, env, guard, json, rekognition, smallJson } from '../_shared/common.ts';

Deno.serve(async (req) => {
  const early = guard(req);
  if (early) return early;
  const h = corsHeaders(req);
  try {
    const user = await caller(req);
    if (!user) return json({ error: 'Please sign in again' }, 401, h);
    const body = await smallJson(req);
    if (body.consent !== true) return json({ error: 'Please tick the box to agree first' }, 400, h);

    // Limits and review status are checked before AWS is asked for anything, so refused attempts cost nothing.
    const pre = await admin().rpc('verify_precheck_service', { p_user: user.id, p_kind: 'face' });
    if (pre.error) return json({ error: pre.error.message }, 400, h);

    const region = env('AWS_REGION');
    const created = await rekognition().send(new CreateFaceLivenessSessionCommand({
      ClientRequestToken: crypto.randomUUID(),
      Settings: { AuditImagesLimit: 0 }, // don't keep extra frames
    }));
    const sessionId = created.SessionId;
    if (!sessionId) throw new Error('No session from AWS');

    // Records that this person started this session (checks the limits again, in the same step).
    const { error } = await admin().rpc('verify_start_service', {
      p_user: user.id, p_kind: 'face', p_provider: 'aws', p_session: sessionId,
    });
    if (error) return json({ error: error.message }, 400, h);

    const sts = new STSClient({ region, credentials: awsCreds() });
    const role = await sts.send(new AssumeRoleCommand({
      RoleArn: env('AWS_LIVENESS_ROLE_ARN'),
      RoleSessionName: 'liveness-' + user.id.slice(0, 8),
      DurationSeconds: 900,
      // narrower than the role itself: streaming video to a liveness session, nothing else
      Policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [{ Effect: 'Allow', Action: 'rekognition:StartFaceLivenessSession', Resource: '*' }],
      }),
    }));
    const c = role.Credentials;
    if (!c) throw new Error('No credentials from AWS');

    return json({
      sessionId,
      region,
      credentials: {
        accessKeyId: c.AccessKeyId, secretAccessKey: c.SecretAccessKey, sessionToken: c.SessionToken,
        expiration: c.Expiration?.toISOString(),
      },
    }, 200, h);
  } catch (e) {
    console.error('face-start', e);
    return json({ error: 'The face check could not start. Please try again.' }, 500, h);
  }
});
