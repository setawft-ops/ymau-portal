import './globals.css';
import Link from 'next/link';
import { getSession } from '@/lib/supabase/server';
import { getSettings, themeCss } from '@/lib/settings';
export const metadata = { title: 'YMAU Côte d’Ivoire Ambassador Training', description: 'YALE Model African Union training academy' };
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { user, role } = await getSession(); const s = await getSettings();
  return (<html lang="en"><head><style dangerouslySetInnerHTML={{ __html: themeCss(s) }} /></head><body>
    <header className="bg-navy text-white border-b-4 border-gold"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
      <Link href="/" className="font-serif text-lg font-bold">{s.site_name} <span className="text-gold">· {s.site_tag}</span></Link>
      <nav className="flex flex-wrap items-center gap-4 text-sm">
        {user ? (<>
          <Link href="/dashboard">Dashboard</Link><Link href="/library">Library</Link>
          {role === 'admin' && <><Link href="/admin">Members</Link><Link href="/admin/settings">Edit site</Link></>}
          <form action="/api/signout" method="post"><button className="text-gold underline">Sign out</button></form>
        </>) : <Link href="/login" className="btn btn-gold">Sign in</Link>}
      </nav></div></header>
    <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    <footer className="py-6 text-center text-xs text-navy/60">{s.footer_text}</footer>
  </body></html>);
}
