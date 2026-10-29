-- Run in Supabase SQL Editor (once).
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text, role text not null default 'student' check (role in ('admin','trainer','student')),
  created_at timestamptz default now());
create table resources (
  id uuid primary key default gen_random_uuid(), title text not null, description text,
  module int check (module between 1 and 13), category text not null default 'Reading',
  path text not null, file_name text, size bigint, uploaded_by uuid references profiles(id),
  created_at timestamptz default now());
create table progress (
  user_id uuid references profiles(id) on delete cascade, module int check (module between 1 and 13),
  completed_at timestamptz default now(), primary key (user_id, module));

create function is_staff() returns boolean language sql security definer stable as
$$ select exists(select 1 from profiles where id = auth.uid() and role in ('admin','trainer')) $$;
create function is_admin() returns boolean language sql security definer stable as
$$ select exists(select 1 from profiles where id = auth.uid() and role = 'admin') $$;

create function handle_new_user() returns trigger language plpgsql security definer as $$
begin insert into profiles(id, full_name) values (new.id, new.raw_user_meta_data->>'full_name'); return new; end $$;
create trigger on_signup after insert on auth.users for each row execute function handle_new_user();

alter table profiles enable row level security;
alter table resources enable row level security;
alter table progress enable row level security;
create policy "read own or staff" on profiles for select using (id = auth.uid() or is_staff());
create policy "admin manages profiles" on profiles for update using (is_admin());
create policy "members read resources" on resources for select to authenticated using (true);
create policy "staff add resources" on resources for insert with check (is_staff());
create policy "staff edit resources" on resources for update using (is_staff());
create policy "staff delete resources" on resources for delete using (is_staff());
create policy "own progress" on progress for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "staff view progress" on progress for select using (is_staff());

insert into storage.buckets (id, name, public) values ('resources','resources',false);
create policy "members download" on storage.objects for select to authenticated using (bucket_id='resources');
create policy "staff upload" on storage.objects for insert to authenticated with check (bucket_id='resources' and is_staff());
create policy "staff remove" on storage.objects for delete to authenticated using (bucket_id='resources' and is_staff());
