import Link from 'next/link';
import { MODULES } from '@/lib/curriculum';
import { getSettings } from '@/lib/settings';
export default async function Home() {
  const s = await getSettings();
  return (<>
    <section className="rounded bg-navy p-8 text-white md:p-14">
      <div className="mb-6 flex h-1.5 w-40"><i className="flex-1 bg-flagred" /><i className="flex-1 bg-white" /><i className="flex-1 bg-gold" /></div>
      <h1 className="max-w-3xl font-serif text-4xl font-bold leading-tight md:text-5xl">{s.hero_title}</h1>
      <p className="mt-4 max-w-2xl text-white/80">{s.hero_text}</p>
      <Link href="/login" className="btn btn-gold mt-6">{s.hero_button}</Link>
    </section>
    <h2 className="mt-10 font-serif text-2xl font-bold">The curriculum</h2>
    <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {MODULES.map(m => (<li key={m.n} className="card"><p className="font-semibold">Module {m.n}: {m.title}</p><p className="mt-1 text-sm text-navy/70">{m.blurb}</p></li>))}
    </ol></>);
}
