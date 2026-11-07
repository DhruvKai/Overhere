/* Rules for a new password, the same hard rules as pwProblem in web/app.js: at least 8 characters, a letter and a
   number, no part of your email, and not a common password. (The website also scores strength and asks for a
   stronger one when it's weak; the app keeps to these rules.) Returns what's wrong, or '' when it's fine. */
const COMMON = new Set(['password', 'password1', 'password12', 'password123', 'passw0rd', '12345678', '123456789', '1234567890', '87654321',
  '11111111', '00000000', 'qwerty12', 'qwerty123', 'qwertyuiop', 'asdfghjkl', '1q2w3e4r', 'zaq12wsx', 'abc12345', 'abcd1234', 'iloveyou',
  'letmein1', 'welcome1', 'welcome123', 'admin123', 'sunshine', 'princess', 'football', 'baseball', 'superman', 'monkey123', 'india123',
  'india@123', 'overhere', 'overhere1']);
const LEET: Record<string, string> = { '@': 'a', '4': 'a', '0': 'o', '1': 'i', '!': 'i', '|': 'l', '3': 'e', '5': 's', '$': 's', '7': 't' };

export function pwProblem(p: string, email = ''): string {
  if (p.length < 8) return 'Use at least 8 characters';
  if (!/[a-z]/i.test(p) || !/\d/.test(p)) return 'Use at least one letter and one number';
  const lo = p.toLowerCase(), n = [...lo].map(c => LEET[c] || c).join('');
  const mail = email.trim().toLowerCase(), user = (mail.split('@')[0] || '').replace(/[^a-z0-9]/g, '');
  if (mail && (lo.includes(mail) || (user.length >= 3 && (lo.replace(/[^a-z0-9]/g, '').includes(user) || n.includes(user)))))
    return 'Leave your email out of your password';
  if (COMMON.has(lo) || COMMON.has(n) || /^(.)\1+$/.test(p)) return 'This is one of the first passwords attackers try. Pick something less common';
  return '';
}

export const PW_HINT = 'At least 8 characters, with a letter and a number';
