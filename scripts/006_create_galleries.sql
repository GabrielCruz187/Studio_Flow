-- Create galleries table
create table if not exists public.galleries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  title text not null,
  description text,
  password text,
  event_date timestamptz,
  is_public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.galleries enable row level security;

-- Policies for gallery owners
create policy "Users can view their own galleries"
  on public.galleries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own galleries"
  on public.galleries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own galleries"
  on public.galleries for update
  using (auth.uid() = user_id);

create policy "Users can delete their own galleries"
  on public.galleries for delete
  using (auth.uid() = user_id);

-- Policy for public access (no auth required)
create policy "Anyone can view public galleries"
  on public.galleries for select
  using (is_public = true);

-- Create indexes
create index if not exists galleries_user_id_idx on public.galleries(user_id);
create index if not exists galleries_client_id_idx on public.galleries(client_id);
