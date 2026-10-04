-- Supabase Schema Migration: Himalayan Food Cloud
-- Mobile-First Food Ordering System for Nepal

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. CATEGORIES TABLE
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  image_url text,
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 2. PRODUCTS TABLE
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  description text not null,
  price numeric(10, 2) not null check (price >= 0),
  image_url text,
  is_available boolean default true,
  is_featured boolean default false,
  display_order integer default 0,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 3. ORDERS TABLE
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_name text not null,
  phone text not null,
  email text not null,
  delivery_address text not null,
  delivery_instructions text,
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  delivery_fee numeric(10, 2) not null default 0 check (delivery_fee >= 0),
  total numeric(10, 2) not null check (total >= 0),
  payment_method text not null check (payment_method in ('cod', 'esewa', 'khalti', 'bank_transfer')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'verified', 'rejected', 'cod_pending')),
  payment_reference text,
  payment_proof_url text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')),
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 4. ORDER_ITEMS TABLE
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 5. SITE_SETTINGS TABLE
create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  business_name text not null default 'Himalayan Cloud Kitchen',
  phone text not null default '+977 9801234567',
  email text not null default 'order@himalayanfood.com.np',
  address text not null default 'Jhamsikhel, Lalitpur, Nepal',
  delivery_fee numeric(10, 2) not null default 100,
  free_delivery_threshold numeric(10, 2) default 1500,
  minimum_order_amount numeric(10, 2) default 200,
  opening_hours jsonb not null default '[
    {"day": "Sunday", "open": "10:00 AM", "close": "10:00 PM", "is_closed": false},
    {"day": "Monday", "open": "10:00 AM", "close": "10:00 PM", "is_closed": false},
    {"day": "Tuesday", "open": "10:00 AM", "close": "10:00 PM", "is_closed": false},
    {"day": "Wednesday", "open": "10:00 AM", "close": "10:00 PM", "is_closed": false},
    {"day": "Thursday", "open": "10:00 AM", "close": "10:00 PM", "is_closed": false},
    {"day": "Friday", "open": "10:00 AM", "close": "10:30 PM", "is_closed": false},
    {"day": "Saturday", "open": "10:00 AM", "close": "10:30 PM", "is_closed": false}
  ]'::jsonb,
  esewa_qr_url text,
  khalti_qr_url text,
  bank_qr_url text,
  bank_name text default 'Nabil Bank Ltd.',
  bank_account_name text default 'Himalayan Cloud Kitchen Pvt Ltd',
  bank_account_number text default '01201017500123',
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Indexes for performance
create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_available on products(is_available);
create index if not exists idx_products_featured on products(is_featured);
create index if not exists idx_orders_order_number on orders(order_number);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_payment_status on orders(payment_status);
create index if not exists idx_orders_created_at on orders(created_at desc);
create index if not exists idx_order_items_order_id on order_items(order_id);

-- Enable Row Level Security (RLS)
alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table site_settings enable row level security;

-- CATEGORIES RLS:
-- Anyone can view active categories
create policy "Anyone can view active categories"
  on categories for select
  using (is_active = true or auth.role() = 'authenticated');

-- Authenticated admins can insert/update/delete categories
create policy "Admins can manage categories"
  on categories for all
  using (auth.role() = 'authenticated');

-- PRODUCTS RLS:
-- Anyone can view active/available products
create policy "Anyone can view products"
  on products for select
  using (true);

-- Authenticated admins can manage products
create policy "Admins can manage products"
  on products for all
  using (auth.role() = 'authenticated');

-- SITE SETTINGS RLS:
-- Anyone can view site settings
create policy "Anyone can view site settings"
  on site_settings for select
  using (true);

-- Only authenticated admins can modify site settings
create policy "Admins can manage site settings"
  on site_settings for all
  using (auth.role() = 'authenticated');

-- ORDERS RLS:
-- Authenticated admins have full access to orders
create policy "Admins can view and manage all orders"
  on orders for all
  using (auth.role() = 'authenticated');

-- ORDER ITEMS RLS:
create policy "Admins can view and manage all order items"
  on order_items for all
  using (auth.role() = 'authenticated');

-- Storage buckets setup script (run in Supabase SQL editor)
insert into storage.buckets (id, name, public) 
values 
  ('payment-proofs', 'payment-proofs', false),
  ('payment-qr', 'payment-qr', true),
  ('product-images', 'product-images', true),
  ('category-images', 'category-images', true)
on conflict (id) do update set public = excluded.public;

-- Storage policies
create policy "Public can read qr codes"
  on storage.objects for select
  using (bucket_id in ('payment-qr', 'product-images', 'category-images'));

create policy "Admins can manage storage objects"
  on storage.objects for all
  using (auth.role() = 'authenticated');
