-- Halı Yıkama Otomasyonu — çekirdek şema (Faz 1-3)
-- Çoklu firma izolasyonu: her tablo company_id taşır, RLS ile kullanıcı sadece
-- kendi company_id'sine ait satırları görür/değiştirir.

create extension if not exists "uuid-ossp";

create type user_role as enum ('admin', 'operator', 'accountant');
create type item_type as enum ('hali', 'kilim', 'koltuk', 'perde', 'diger');
create type order_status as enum (
  'talep_alindi', 'alim_planlandi', 'alindi', 'yikaniyor',
  'kurutuluyor', 'teslime_hazir', 'teslimat_planlandi',
  'teslim_edildi', 'iptal_edildi'
);
create type payment_status as enum ('bekliyor', 'kismi_odendi', 'tahsil_edildi');
create type payment_method as enum ('nakit', 'kart', 'havale', 'veresiye');

create table companies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text,
  created_at timestamptz not null default now()
);

-- auth.users.id ile 1-1 eşleşen profil tablosu
create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid not null references companies(id) on delete cascade,
  name text not null,
  phone text,
  role user_role not null default 'operator',
  created_at timestamptz not null default now()
);

create table customers (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references companies(id) on delete cascade,
  name text not null,
  phone text not null,
  secondary_phone text,
  notes text,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table customer_addresses (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references customers(id) on delete cascade,
  label text not null default 'Ev',
  address_text text not null,
  lat double precision,
  lng double precision
);

create table price_list (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references companies(id) on delete cascade,
  item_type item_type not null,
  unit text not null check (unit in ('m2', 'adet')),
  unit_price numeric(10, 2) not null
);

create table orders (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references companies(id) on delete cascade,
  customer_id uuid not null references customers(id),
  address_id uuid references customer_addresses(id),
  status order_status not null default 'talep_alindi',
  payment_status payment_status not null default 'bekliyor',
  pickup_date timestamptz,
  delivery_date timestamptz,
  assigned_user_id uuid references users(id),
  total_amount numeric(10, 2) not null default 0,
  paid_amount numeric(10, 2) not null default 0,
  notes text,
  created_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  item_type item_type not null,
  description text,
  width_m numeric(6, 2),
  height_m numeric(6, 2),
  area_m2 numeric(8, 2),
  quantity integer not null default 1,
  unit_price numeric(10, 2) not null default 0,
  stain_notes text,
  photo_urls text[] not null default '{}'
);

create table order_status_history (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  status order_status not null,
  changed_by uuid references users(id),
  changed_at timestamptz not null default now()
);

create table payments (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  amount numeric(10, 2) not null,
  method payment_method not null,
  paid_at timestamptz not null default now(),
  note text
);

create table notifications_log (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  customer_id uuid references customers(id),
  channel text not null check (channel in ('sms', 'whatsapp', 'push')),
  message text not null,
  sent_at timestamptz not null default now(),
  status text not null default 'gonderildi'
);

-- Row Level Security: kullanıcı yalnızca kendi company_id'sine ait veriyi görür.
alter table companies enable row level security;
alter table users enable row level security;
alter table customers enable row level security;
alter table customer_addresses enable row level security;
alter table price_list enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_status_history enable row level security;
alter table payments enable row level security;
alter table notifications_log enable row level security;

create or replace function current_company_id()
returns uuid
language sql
security definer
stable
as $$
  select company_id from users where id = auth.uid();
$$;

create policy "users_own_company" on users
  for select using (company_id = current_company_id());

create policy "customers_company_isolation" on customers
  for all using (company_id = current_company_id())
  with check (company_id = current_company_id());

create policy "customer_addresses_via_customer" on customer_addresses
  for all using (
    customer_id in (select id from customers where company_id = current_company_id())
  )
  with check (
    customer_id in (select id from customers where company_id = current_company_id())
  );

create policy "price_list_company_isolation" on price_list
  for all using (company_id = current_company_id())
  with check (company_id = current_company_id());

create policy "orders_company_isolation" on orders
  for all using (company_id = current_company_id())
  with check (company_id = current_company_id());

create policy "order_items_via_order" on order_items
  for all using (
    order_id in (select id from orders where company_id = current_company_id())
  )
  with check (
    order_id in (select id from orders where company_id = current_company_id())
  );

create policy "order_status_history_via_order" on order_status_history
  for all using (
    order_id in (select id from orders where company_id = current_company_id())
  )
  with check (
    order_id in (select id from orders where company_id = current_company_id())
  );

create policy "payments_via_order" on payments
  for all using (
    order_id in (select id from orders where company_id = current_company_id())
  )
  with check (
    order_id in (select id from orders where company_id = current_company_id())
  );

create policy "notifications_log_via_order" on notifications_log
  for all using (
    order_id in (select id from orders where company_id = current_company_id())
  )
  with check (
    order_id in (select id from orders where company_id = current_company_id())
  );
