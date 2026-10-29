import { useColorScheme } from 'react-native';

/* The web app's colour tokens (app.html :root and [data-theme="dark"]). */
const light = {
  bg: '#F5F0E6', card: '#FFFDF8', ink: '#1A1A1A', ink2: '#3F3F3F', mute: '#6B6B6B', line: '#E7DFCF', field: '#EFE8DA',
  acc: '#3F7D4E', acch: '#336842', acc2: '#E7F0E1', accink: '#2E6139', onAcc: '#FFFFFF',
  ok: '#15803D', okbg: '#DCFCE7', bad: '#B91C1C', badbg: '#FEE2E2', warn: '#A16207', warnbg: '#FEF3C7', info: '#1D4ED8', infobg: '#DBEAFE',
  chip: '#FFFFFF', ph: '#A8A08E', newbg: '#F4F8F0', dark: false,
};
const dark: typeof light = {
  bg: '#15130F', card: '#201D18', ink: '#F2EDE4', ink2: '#CFC8BB', mute: '#A39C8E', line: '#34302A', field: '#2A2620',
  acc: '#4A8F5B', acch: '#5AA06B', acc2: '#1F3325', accink: '#9FD3AA', onAcc: '#FFFFFF',
  ok: '#4ADE80', okbg: '#14301F', bad: '#F87171', badbg: '#3A1717', warn: '#FBBF24', warnbg: '#3A2E10', info: '#93C5FD', infobg: '#172A45',
  chip: '#26221C', ph: '#6F685C', newbg: '#1C2A1F', dark: true,
};
export type Theme = typeof light;
export const useTheme = (): Theme => (useColorScheme() === 'dark' ? dark : light);
export const R = 20;   // card corner radius, --r on the web
