import Link from 'next/link';
import { getSession } from '@/lib/supabase/server';
import { MODULES } from '@/lib/curriculum';
export default async function Dashboard() {
  const { sb, user, name, role } = await getSession();
  const { data } = await sb.from('progress').select('module').eq('user_id', user!.id);
  const done = new Set((data ?? []).map(r => r.module)); const pct = Math.round(done.size / 13 * 100);
  return (<>
    <h1 className="font-serif text-3xl font-bold">Welcome{name ? `, ${name}` : ''}</h1>
    <p className="text-sm text-navy/70">Role: {role}</p>
    <div className="card mt-4"><p className="font-semibold">{done.size} of 13 modules complete ({pct}%)</p>
      <div className="mt-2 h-3 rounded bg-navy/10"><div className="h-3 rounded bg-gold" style={{ width: `${pct}%` }} /></div></div>
    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
      {MODULES.map(m => (<li key={m.n}><Link href={`/modules/${m.n}`} className="card block hover:border-gold">
        <span className="font-semibold">{m.n}. {m.title}</span>
        <span className={`mt-1 block text-xs ${done.has(m.n) ? 'text-green-700' : 'text-navy/60'}`}>{done.has(m.n) ? 'Completed' : 'Not completed'}</span></Link></li>))}
    </ul></>);
}
