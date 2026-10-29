import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/supabase/server';
export default async function Admin() {
  const { sb, role } = await getSession(); if (role !== 'admin') redirect('/dashboard');
  const { data: people } = await sb.from('profiles').select('id,full_name,role,created_at').order('created_at');
  const { data: prog } = await sb.from('progress').select('user_id');
  const counts: Record<string, number> = {}; prog?.forEach(p => { counts[p.user_id] = (counts[p.user_id] ?? 0) + 1; });
  async function setRole(f: FormData) {
    'use server';
    const s = await getSession(); if (s.role !== 'admin') return;
    await s.sb.from('profiles').update({ role: f.get('role') }).eq('id', f.get('id') as string); revalidatePath('/admin');
  }
  return (<>
    <h1 className="font-serif text-3xl font-bold">Manage members</h1>
    <ul className="mt-4 space-y-2">{people?.map(p => (<li key={p.id} className="card flex flex-wrap items-center justify-between gap-2">
      <span>{p.full_name || 'Unnamed'} <span className="text-xs text-navy/60">{counts[p.id] ?? 0}/13 modules</span></span>
      <form action={setRole} className="flex gap-2"><input type="hidden" name="id" value={p.id} />
        <select name="role" defaultValue={p.role} className="field w-auto"><option>student</option><option>trainer</option><option>admin</option></select>
        <button className="btn">Save role</button></form></li>))}</ul></>);
}
