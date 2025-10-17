-- Create whatsapp_messages table
create table if not exists public.whatsapp_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  phone text not null,
  message text not null,
  direction text not null check (direction in ('incoming', 'outgoing')),
  status text not null default 'sent',
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.whatsapp_messages enable row level security;

-- Policies
create policy "Users can view their own messages"
  on public.whatsapp_messages for select
  using (auth.uid() = user_id);

create policy "Users can insert their own messages"
  on public.whatsapp_messages for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own messages"
  on public.whatsapp_messages for update
  using (auth.uid() = user_id);

create policy "Users can delete their own messages"
  on public.whatsapp_messages for delete
  using (auth.uid() = user_id);

-- Create indexes
create index if not exists whatsapp_messages_user_id_idx on public.whatsapp_messages(user_id);
create index if not exists whatsapp_messages_phone_idx on public.whatsapp_messages(phone);
create index if not exists whatsapp_messages_created_at_idx on public.whatsapp_messages(created_at);
