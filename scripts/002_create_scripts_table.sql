-- Create scripts table
create table if not exists public.scripts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  rating numeric not null default 0,
  downloads text not null default '0',
  link text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.scripts enable row level security;

-- Allow everyone to read scripts
create policy "scripts_select_all"
  on public.scripts for select
  using (true);

-- Allow anyone to insert/update/delete (since we're using session-based admin auth)
-- In production, you'd want to add proper admin role checks
create policy "scripts_insert_all"
  on public.scripts for insert
  with check (true);

create policy "scripts_update_all"
  on public.scripts for update
  using (true);

create policy "scripts_delete_all"
  on public.scripts for delete
  using (true);

-- Insert initial data
insert into public.scripts (name, description, rating, downloads, link)
values
  (
    'Infinite Yield',
    'The most popular admin script with tons of commands.',
    4.9,
    '1M+',
    'https://example.com/iy'
  ),
  (
    'Dark Dex',
    'Advanced explorer for viewing and editing game instances.',
    4.7,
    '500K+',
    'https://example.com/darkdex'
  ),
  (
    'Owl Hub',
    'Universal script hub with games support.',
    4.6,
    '750K+',
    'https://example.com/owlhub'
  );
