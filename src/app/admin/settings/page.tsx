import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/supabase/server';
import { getSettings } from '@/lib/settings';
const TEXT: [string, string][] = [['site_name', 'Site name'], ['site_tag', 'Text after the name'], ['hero_title', 'Homepage headline'],
  ['hero_text', 'Homepage paragraph'], ['hero_button', 'Homepage button'], ['footer_text', 'Footer text']];
const COLORS: [string, string][] = [['color_navy', 'Main colour (navy)'], ['color_gold', 'Accent colour (gold)'], ['color_red', 'Stripe colour (red)']];
export default async function Settings({ searchParams }: { searchParams: { saved?: string } }) {
  const { role } = await getSession(); if (role !== 'admin') redirect('/dashboard');
  const s = await getSettings();
  async function save(f: FormData) {
    'use server';
    const a = await getSession(); if (a.role !== 'admin') return;
    const rows = [...TEXT, ...COLORS].map(([key]) => ({ key, value: String(f.get(key) ?? '').trim() }))
      .filter(r => r.value && (!r.key.startsWith('color_') || /^#[0-9a-f]{6}$/i.test(r.value)));
    await a.sb.from('site_settings').upsert(rows);
    revalidatePath('/', 'layout'); redirect('/admin/settings?saved=1');
  }
  return (<>
    <h1 className="font-serif text-3xl font-bold">Edit site</h1>
    {searchParams.saved && <p role="status" className="mt-2 text-sm text-green-700">Saved. Your changes are live.</p>}
    <form action={save} className="card mt-4 grid max-w-2xl gap-4">
      {TEXT.map(([k, label]) => (<label key={k} className="text-sm font-semibold">{label}
        {k === 'hero_text' ? <textarea name={k} defaultValue={s[k]} rows={4} className="field mt-1 font-normal" />
          : <input name={k} defaultValue={s[k]} className="field mt-1 font-normal" />}</label>))}
      <div className="flex flex-wrap gap-6">{COLORS.map(([k, label]) => (<label key={k} className="text-sm font-semibold">{label}
        <input type="color" name={k} defaultValue={s[k]} className="mt-1 block h-10 w-24 cursor-pointer" /></label>))}</div>
      <button className="btn btn-gold">Save changes</button>
    </form></>);
}
