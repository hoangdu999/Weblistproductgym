-- ====== MIGRATION SUPABASE CHO GYMSHOP V1 ======
-- Chạy toàn bộ file này trong Supabase SQL Editor (một lần duy nhất khi tạo project).
-- Sau khi chạy xong, tạo tài khoản admin trong Supabase Dashboard -> Authentication -> Users.
-- Kích hoạt provider "Email" (mặc định đã bật).

-- 1) Bật extension nếu cần
create extension if not exists "uuid-ossp";

-- 2) Bảng categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3) Bảng products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict on update cascade,
  name text not null,
  description text,
  price bigint not null default 0 check (price >= 0),
  image_url text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_active_idx on public.products(is_active);

-- 4) Trigger auto updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_categories_updated_at on public.categories;
create trigger trg_categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

-- 5) Bật RLS
alter table public.categories enable row level security;
alter table public.products enable row level security;

-- 6) Policy: khách (anon) được đọc categories công khai
drop policy if exists "Categories are viewable by public" on public.categories;
create policy "Categories are viewable by public"
  on public.categories for select
  using (true);

-- 7) Policy: khách (anon) được đọc các sản phẩm active
drop policy if exists "Public can view active products" on public.products;
create policy "Public can view active products"
  on public.products for select
  using (is_active = true);

-- 8) Policy: authenticated (admin) được CRUD categories & products
drop policy if exists "Admins can manage categories" on public.categories;
create policy "Admins can manage categories"
  on public.categories
  for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products"
  on public.products
  for all
  to authenticated
  using (true)
  with check (true);

-- ====== 9) Storage bucket "products" (ảnh sản phẩm) ======
-- Lưu ý: tạo bucket bằng Dashboard -> Storage -> Create bucket
--   Tên bucket: products
--   Public: Bật (Make public)
-- Sau đó chạy các policy dưới đây trong SQL Editor:

insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

-- Khách được đọc mọi file trong bucket products
drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
  on storage.objects for select
  using (bucket_id = 'products');

-- Admin authenticated được upload/update/delete trong bucket products
drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'products');

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'products');

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'products');
