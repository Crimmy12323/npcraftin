-- Create executors table
create table if not exists public.executors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  rating numeric not null default 0,
  unc numeric not null default 0,
  sunc numeric not null default 0,
  features jsonb not null default '[]'::jsonb,
  link text not null,
  video_url text,
  image_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.executors enable row level security;

-- Allow everyone to read executors
create policy "executors_select_all"
  on public.executors for select
  using (true);

-- Allow anyone to insert/update/delete (since we're using session-based admin auth)
-- In production, you'd want to add proper admin role checks
create policy "executors_insert_all"
  on public.executors for insert
  with check (true);

create policy "executors_update_all"
  on public.executors for update
  using (true);

create policy "executors_delete_all"
  on public.executors for delete
  using (true);

-- Insert initial data
insert into public.executors (name, description, rating, unc, sunc, features, link, video_url, image_url)
values
  (
    'Synapse X',
    'One of the most powerful and reliable Roblox executors with advanced features.',
    4.8,
    98,
    95,
    '["Level 8 execution", "Custom UI", "Script hub"]'::jsonb,
    'https://example.com/synapse',
    '',
    ''
  ),
  (
    'Script-Ware',
    'Fast and efficient executor with excellent script compatibility.',
    4.7,
    95,
    92,
    '["Level 7 execution", "Fast injection", "Regular updates"]'::jsonb,
    'https://example.com/scriptware',
    '',
    ''
  ),
  (
    'KRNL',
    'Free executor with impressive capabilities and regular updates.',
    4.5,
    90,
    88,
    '["Level 6 execution", "Free to use", "Active community"]'::jsonb,
    'https://example.com/krnl',
    '',
    ''
  );
