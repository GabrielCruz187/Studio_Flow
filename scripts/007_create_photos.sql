-- Create photos table
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid not null references public.galleries(id) on delete cascade,
  url text not null,
  thumbnail_url text,
  filename text not null,
  size integer,
  is_favorite boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.photos enable row level security;

-- Policies - photos inherit permissions from galleries
create policy "Users can view photos from their galleries"
  on public.photos for select
  using (
    exists (
      select 1 from public.galleries
      where galleries.id = photos.gallery_id
      and galleries.user_id = auth.uid()
    )
  );

create policy "Users can insert photos to their galleries"
  on public.photos for insert
  with check (
    exists (
      select 1 from public.galleries
      where galleries.id = photos.gallery_id
      and galleries.user_id = auth.uid()
    )
  );

create policy "Users can update photos in their galleries"
  on public.photos for update
  using (
    exists (
      select 1 from public.galleries
      where galleries.id = photos.gallery_id
      and galleries.user_id = auth.uid()
    )
  );

create policy "Users can delete photos from their galleries"
  on public.photos for delete
  using (
    exists (
      select 1 from public.galleries
      where galleries.id = photos.gallery_id
      and galleries.user_id = auth.uid()
    )
  );

-- Policy for public access
create policy "Anyone can view photos from public galleries"
  on public.photos for select
  using (
    exists (
      select 1 from public.galleries
      where galleries.id = photos.gallery_id
      and galleries.is_public = true
    )
  );

-- Create indexes
create index if not exists photos_gallery_id_idx on public.photos(gallery_id);
