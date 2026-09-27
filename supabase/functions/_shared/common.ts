// Shared by the face-check Edge Functions: CORS, the signed-in user, the service-role client, AWS clients.
import { createClient, type SupabaseClient, type User } from 'npm:@supabase/supabase-js@2.117.2';
import { RekognitionClient } from 'npm:@aws-sdk/client-rekognition@3';

const env = (k: string, fallback?: string) => {
  const v = Deno.env.get(k) ?? fallback;
  if (v === undefined || v === '') throw new Error(`Missing secret ${k}`);
  return v;
};
export { env };

// Only your own site may call these functions from a browser. ALLOWED_ORIGINS is a comma-separated list,
// e.g. "https://dhruvkai.github.io,http://localhost:8000". Nothing else is allowed.
const allowed = () => (Deno.env.get('ALLOWED_ORIGINS') ?? '').split(',').map((s) => s.trim()).filter(Boolean);

export function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') ?? '';
  return {
    'Access-Control-Allow-Origin': allowed().includes(origin) ? origin : 'null',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '600',
    Vary: 'Origin',
  };
}

export function json(body: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

/** Handles CORS preflight and method/origin checks. Returns a Response to send, or null to carry on. */
export function guard(req: Request): Response | null {
  const h = corsHeaders(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: h });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405, h);
  const origin = req.headers.get('origin');
  if (origin && !allowed().includes(origin)) return json({ error: 'Not allowed from this site' }, 403, h);
  return null;
}

/** The person calling, from their login token; null if the token is missing or not valid. */
export async function caller(req: Request): Promise<User | null> {
  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const sb = createClient(env('SUPABASE_URL'), env('SUPABASE_ANON_KEY'), { auth: { persistSession: false } });
  const { data, error } = await sb.auth.getUser(token);
  return error ? null : data.user;
}

/** Server-side database client. The service-role key never leaves the Edge Function. */
export function admin(): SupabaseClient {
  return createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false } });
}

export function awsCreds() {
  return { accessKeyId: env('AWS_ACCESS_KEY_ID'), secretAccessKey: env('AWS_SECRET_ACCESS_KEY') };
}

export function rekognition() {
  return new RekognitionClient({ region: env('AWS_REGION'), credentials: awsCreds() });
}

/** Read a small JSON body (at most 4 KB). */
export async function smallJson(req: Request): Promise<Record<string, unknown>> {
  const text = await req.text();
  if (text.length > 4096) throw new Error('Request too large');
  if (!text) return {};
  const v = JSON.parse(text);
  if (typeof v !== 'object' || v === null || Array.isArray(v)) throw new Error('Bad request');
  return v as Record<string, unknown>;
}
