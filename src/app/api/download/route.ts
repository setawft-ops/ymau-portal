import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id'); const sb = supabaseServer();
  const { data: r } = await sb.from('resources').select('path,file_name').eq('id', id ?? '').single();
  if (!r) return new NextResponse('Not found', { status: 404 });
  const { data } = await sb.storage.from('resources').createSignedUrl(r.path, 60, { download: r.file_name ?? true });
  return data ? NextResponse.redirect(data.signedUrl) : new NextResponse('Unavailable', { status: 500 });
}
