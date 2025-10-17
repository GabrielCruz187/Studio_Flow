-- Create transactions table
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  type text not null check (type in ('income', 'expense')),
  category text not null,
  description text not null,
  amount decimal(10,2) not null,
  payment_method text,
  date timestamptz not null default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.transactions enable row level security;

-- Policies
create policy "Users can view their own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own transactions"
  on public.transactions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own transactions"
  on public.transactions for delete
  using (auth.uid() = user_id);

-- Create indexes
create index if not exists transactions_user_id_idx on public.transactions(user_id);
create index if not exists transactions_client_id_idx on public.transactions(client_id);
create index if not exists transactions_date_idx on public.transactions(date);
create index if not exists transactions_type_idx on public.transactions(type);
