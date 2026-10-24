"""Puts the email templates in supabase/templates/ into the live Supabase project (Confirm signup and Reset password).

Run it from the web folder:
    python tools/push-email-templates.py           # shows what would change, changes nothing
    python tools/push-email-templates.py --apply   # saves a backup of the current templates, then updates them

It needs a Supabase personal access token in SUPABASE_ACCESS_TOKEN, either set in the shell or in web/.env (which
.gitignore keeps out of the public repository). The token only needs Auth config read and write on this project.
It changes the two subjects and two email bodies and nothing else in the auth settings. The old ones are saved to
supabase/.temp/ (also ignored by git) before anything is changed, so they can be put back.
"""
import json, os, re, sys, time, urllib.error, urllib.request

WEB = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEMPLATES = os.path.join(WEB, 'supabase', 'templates')
UA = 'OverhereBeta/1.0 (email templates)'

# Supabase setting -> (subject, template file)
FIELDS = {
    'confirmation': ('Confirm your Overhere account', 'confirm-signup.html'),
    'recovery': ('Reset your Overhere password', 'reset-password.html'),
}


def token():
    t = os.environ.get('SUPABASE_ACCESS_TOKEN', '').strip()
    env = os.path.join(WEB, '.env')
    if not t and os.path.exists(env):
        for line in open(env, encoding='utf-8'):
            k, _, v = line.partition('=')
            if k.strip() == 'SUPABASE_ACCESS_TOKEN':
                t = v.strip().strip('"\'')
    if not t:
        sys.exit('No token. Paste it after SUPABASE_ACCESS_TOKEN= in web/.env')
    return t


def project_ref():
    m = re.search(r'https://([a-z0-9]+)\.supabase\.co', open(os.path.join(WEB, 'config.js'), encoding='utf-8').read())
    if not m:
        sys.exit('Could not find the Supabase project in config.js')
    return m.group(1)


def api(method, ref, tok, body=None):
    req = urllib.request.Request(f'https://api.supabase.com/v1/projects/{ref}/config/auth', method=method,
                                 data=json.dumps(body).encode() if body is not None else None,
                                 headers={'Authorization': 'Bearer ' + tok, 'Content-Type': 'application/json',
                                          'User-Agent': UA})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        hint = {401: 'the token is wrong or expired', 403: 'the token lacks Auth config read/write on this project'}
        sys.exit(f'Supabase said {e.code} on {method}: {hint.get(e.code, "")}\n  {e.read().decode(errors="replace")[:300]}')


def wanted():
    out = {}
    for k, (subject, f) in FIELDS.items():
        out[f'mailer_subjects_{k}'] = subject
        out[f'mailer_templates_{k}_content'] = open(os.path.join(TEMPLATES, f), encoding='utf-8').read()
    return out


def main():
    apply = '--apply' in sys.argv
    ref, tok = project_ref(), token()
    new = wanted()
    cur = api('GET', ref, tok)
    old = {k: cur.get(k) for k in new}
    changed = [k for k in new if old[k] != new[k]]
    for k in new:
        state = 'will change' if k in changed else 'already up to date'
        shown = new[k] if 'subjects' in k else f'{len(old[k] or "")} -> {len(new[k])} characters'
        print(f'  {k}: {state} ({shown})')
    if not changed:
        return print('Nothing to do.')
    if not apply:
        return print('\nNothing changed. Run again with --apply to update the templates.')

    backup = os.path.join(WEB, 'supabase', '.temp', time.strftime('email-templates-backup-%Y%m%d-%H%M%S.json'))
    os.makedirs(os.path.dirname(backup), exist_ok=True)
    json.dump(old, open(backup, 'w', encoding='utf-8'), indent=2)
    print(f'\nSaved the current templates to {backup}')

    api('PATCH', ref, tok, {k: new[k] for k in changed})
    after = api('GET', ref, tok)
    bad = [k for k in changed if after.get(k) != new[k]]
    if bad:
        sys.exit('Supabase did not keep: ' + ', '.join(bad))
    print('Updated. Send yourself a sign-up and a password reset to check them.')


main()
