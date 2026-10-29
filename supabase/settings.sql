create table if not exists public.site_settings (key text primary key, value text);
alter table public.site_settings enable row level security;
create policy "anyone reads settings" on public.site_settings for select to anon, authenticated using (true);
create policy "admin adds settings" on public.site_settings for insert to authenticated with check (public.is_admin());
create policy "admin edits settings" on public.site_settings for update to authenticated using (public.is_admin());
