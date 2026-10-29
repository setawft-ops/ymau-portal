'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';
export default function Login() {
  const [mode, setMode] = useState<'in' | 'up'>('in'); const [msg, setMsg] = useState(''); const router = useRouter();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget); const sb = supabaseBrowser();
    const email = f.get('email') as string, password = f.get('password') as string;
    const { error } = mode === 'in' ? await sb.auth.signInWithPassword({ email, password })
      : await sb.auth.signUp({ email, password, options: { data: { full_name: f.get('name') } } });
    if (error) return setMsg(error.message);
    if (mode === 'up') return setMsg('Account created. Check your email to confirm, then sign in.');
    router.push('/dashboard'); router.refresh();
  }
  return (<form onSubmit={submit} className="card mx-auto max-w-sm space-y-3">
    <h1 className="font-serif text-2xl font-bold">{mode === 'in' ? 'Sign in' : 'Create account'}</h1>
    {mode === 'up' && <input name="name" required placeholder="Full name" className="field" />}
    <input name="email" type="email" required placeholder="Email" className="field" />
    <input name="password" type="password" required minLength={8} placeholder="Password (8+ characters)" className="field" />
    {msg && <p role="alert" className="text-sm text-flagred">{msg}</p>}
    <button className="btn w-full">{mode === 'in' ? 'Sign in' : 'Create account'}</button>
    <button type="button" onClick={() => setMode(mode === 'in' ? 'up' : 'in')} className="text-sm underline">
      {mode === 'in' ? 'New student? Create an account' : 'Have an account? Sign in'}</button>
  </form>);
}
