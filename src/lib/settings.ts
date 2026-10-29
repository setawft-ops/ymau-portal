import { supabaseServer } from './supabase/server';
export const DEFAULTS: Record<string, string> = {
  site_name: 'YMAU', site_tag: 'Côte d’Ivoire',
  hero_title: 'Train to represent your country at the African Union.',
  hero_text: 'The YMAU Côte d’Ivoire Ambassador Training Program: thirteen modules from protocol to a full crisis simulation, with shared templates and trainer feedback.',
  hero_button: 'Join the academy',
  footer_text: 'YALE – Young African Leaders of Excellence · Model African Union',
  color_navy: '#0B2545', color_gold: '#C9A227', color_red: '#B22234' };
export async function getSettings() {
  const s = { ...DEFAULTS };
  try { const { data } = await supabaseServer().from('site_settings').select('key,value');
    data?.forEach(r => { if (r.value) s[r.key] = r.value; }); } catch {}
  return s;
}
const ok = (h: string, d: string) => (/^#[0-9a-f]{6}$/i.test(h) ? h : d);
const rgb = (h: string) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const mix = (a: number[], t: number) => a.map(v => Math.round(v * (1 - t) + 255 * t));
export function themeCss(s: Record<string, string>) {
  const navy = rgb(ok(s.color_navy, DEFAULTS.color_navy)), gold = rgb(ok(s.color_gold, DEFAULTS.color_gold)), red = rgb(ok(s.color_red, DEFAULTS.color_red));
  return `:root{--navy:${navy.join(' ')};--navy-800:${mix(navy, 0.12).join(' ')};--navy-50:${mix(navy, 0.94).join(' ')};--gold:${gold.join(' ')};--red:${red.join(' ')}}`;
}
