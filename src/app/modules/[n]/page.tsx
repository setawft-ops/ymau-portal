import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/supabase/server';
import { MODULES } from '@/lib/curriculum';
export default async function ModulePage({ params }: { params: { n: string } }) {
  const n = Number(params.n); const m = MODULES.find(x => x.n === n); if (!m) notFound();
  const { sb, user } = await getSession();
  const { data: res } = await sb.from('resources').select('id,title,category,file_name').eq('module', n).order('created_at', { ascending: false });
  const { data: p } = await sb.from('progress').select('module').eq('user_id', user!.id).eq('module', n).maybeSingle();
  async function toggle() {
    'use server';
    const s = await getSession(); if (!s.user) redirect('/login');
    if (p) await s.sb.from('progress').delete().eq('user_id', s.user.id).eq('module', n);
    else await s.sb.from('progress').insert({ user_id: s.user.id, module: n });
    revalidatePath(`/modules/${n}`); revalidatePath('/dashboard');
  }
  return (<>
    <h1 className="font-serif text-3xl font-bold">Module {m.n}: {m.title}</h1>
    <p className="mt-2 max-w-2xl">{m.blurb}</p>
    <form action={toggle} className="mt-4"><button className={`btn ${p ? '' : 'btn-gold'}`}>{p ? 'Mark as not complete' : 'Mark module complete'}</button></form>
    <h2 className="mt-8 font-semibold">Module resources</h2>
    {!res?.length ? <p className="mt-2 text-sm text-navy/70">No files yet. Trainers can add them in the Library.</p> :
      <ul className="mt-2 space-y-2">{res.map(r => (<li key={r.id} className="card flex items-center justify-between">
        <span>{r.title} <span className="text-xs text-navy/60">({r.category})</span></span>
        <a className="btn" href={`/api/download?id=${r.id}`}>Download</a></li>))}</ul>}
  </>);
}
