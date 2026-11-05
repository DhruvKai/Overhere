import { Share } from 'react-native';
import { whenStr, type Plan } from './model';
import { SITE } from './supabase';

/* The invite link for a plan, the same one the website's "Share" sheet makes (#act=<id> opens it). */
export const sharePlan = (a: Plan) => Share.share({ message: `${a.desc}, ${whenStr(a.when)} at ${a.venue}. Join me on Overhere: ${SITE}/app.html#act=${a.id}` });
