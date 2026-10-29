import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/supabase/server';
import { CATEGORIES, MODULES } from '@/lib/curriculum';
export default async function Library({ searchParams }: { searchParams: { cat?: string; err?: string } }) {
  const { sb, user, role } = await getSession(); const staff = role === 'admin' || role === 'trainer';
  let q = sb.from('resources').select('*').order('created_at', { ascending: false });
  if (searchParams.cat) q = q.eq('category', searchParams.cat);
  const { data: files } = await q;
  async function upload(f: FormData) {
    'use server';
    const s = await getSession(); const file = f.get('file') as File;
    if (!s.user || !file?.size) return;
    const path = `${s.user.id}/${Date.now()}-${file.name.replace(/[^\w.\-]/g, '_')}`;
    const up = await s.sb.storage.from('resources').upload(path, file, { contentType: file.type });
    if (up.error) return;
    const mod = Number(f.get('module'));
    await s.sb.from('resources').insert({ title: f.get('title'), description: f.get('description'), module: mod || null,
      category: f.get('category'), path, file_name: file.name, size: file.size, uploaded_by: s.user.id });
    revalidatePath('/library');
  }
  async function remove(f: FormData) {
    'use server';
    const s = await getSession(); const path = f.get('path') as string;
    await s.sb.storage.from('resources').remove([path]);
    await s.sb.from('resources').delete().eq('id', f.get('id') as string); revalidatePath('/library');
  }
  return (<>
    <h1 className="font-serif text-3xl font-bold">Resource library</h1>
    <div className="mt-3 flex flex-wrap gap-2 text-sm">
      <a className="underline" href="/library">All</a>{CATEGORIES.map(c => <a key={c} className="underline" href={`/library?cat=${encodeURIComponent(c)}`}>{c}</a>)}</div>
    {staff && <form action={upload} className="card mt-5 grid gap-3 sm:grid-cols-2">
      <h2 className="font-semibold sm:col-span-2">Upload a file</h2>
      <input name="title" required placeholder="Title" className="field" />
      <select name="category" className="field">{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
      <select name="module" className="field"><option value="">All modules</option>{MODULES.map(m => <option key={m.n} value={m.n}>Module {m.n}</option>)}</select>
      <input name="description" placeholder="Short description" className="field" />
      <input name="file" type="file" required className="field sm:col-span-2" />
      <button className="btn btn-gold sm:col-span-2">Upload file</button></form>}
    {!files?.length ? <p className="mt-6 text-sm">No resources yet.{staff ? ' Upload the first file above.' : ' Trainers will add materials soon.'}</p> :
    <ul className="mt-6 space-y-2">{files.map(r => (<li key={r.id} className="card flex flex-wrap items-center justify-between gap-2">
      <div><p className="font-semibold">{r.title}</p><p className="text-xs text-navy/60">{r.category}{r.module ? `, Module ${r.module}` : ''}{r.size ? `, ${(r.size / 1048576).toFixed(1)} MB` : ''}</p>
        {r.description && <p className="text-sm">{r.description}</p>}</div>
      <div className="flex gap-2"><a className="btn" href={`/api/download?id=${r.id}`}>Download</a>
        {staff && <form action={remove}><input type="hidden" name="id" value={r.id} /><input type="hidden" name="path" value={r.path} />
          <button className="btn bg-flagred">Delete</button></form>}</div></li>))}</ul>}
  </>);
}
