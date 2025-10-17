-- Create events table
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  title text not null,
  description text,
  service_type text not null,
  start_date timestamptz not null,
  end_date timestamptz not null,
  location text,
  status text not null default 'scheduled',
  price decimal(10,2),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.events enable row level security;

-- Policies
create policy "Users can view their own events"
  on public.events for select
  using (auth.uid() = user_id);

create policy "Users can insert their own events"
  on public.events for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own events"
  on public.events for update
  using (auth.uid() = user_id);

create policy "Users can delete their own events"
  on public.events for delete
  using (auth.uid() = user_id);

-- Create indexes
create index if not exists events_user_id_idx on public.events(user_id);
create index if not exists events_client_id_idx on public.events(client_id);
create index if not exists events_start_date_idx on public.events(start_date);
