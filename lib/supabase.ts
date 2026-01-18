import { createClient } from '@supabase/supabase-js';

// Project ID-gaaga
const supabaseUrl = 'https://bzjgtbdpynwjrvfdcgdr.supabase.co';

// API Key-ga aad soo dirtay
const supabaseKey = 'sb_publishable_5bEP0b7c84NrooTO0vLd2Q_OD9d6Bg1'; 

export const supabase = createClient(supabaseUrl, supabaseKey);

/*
=========================================
TILMAAMAHA DATABASE-KA (SQL COMMANDS)
=========================================
Fadlan tag Supabase Dashboard -> SQL Editor, samee "New Query", 
ku dheji koodkan hoose, kadibna riix "RUN".

-- 1. Create Users Table
create table if not exists users (
  id text primary key,
  email text unique,
  password text,
  name text,
  role text,
  avatar text
);

-- 2. Create Products Table
create table if not exists products (
  id text primary key,
  name text,
  price numeric,
  stock integer,
  image text,
  category text
);

-- 3. Create Patients Table
create table if not exists patients (
  id text primary key,
  name text,
  age integer,
  phone text,
  "lastVisit" text,
  condition text
);

-- 4. Create Appointments Table
create table if not exists appointments (
  id text primary key,
  "patientName" text,
  "doctorName" text,
  date text,
  time text,
  status text,
  type text
);

-- 5. Create Transactions Table
create table if not exists transactions (
  id text primary key,
  date text,
  total numeric,
  items integer,
  method text
);

-- 6. Create Employees Table
create table if not exists employees (
  id text primary key,
  name text,
  role text,
  salary text,
  date text,
  initials text,
  status text
);

-- 7. NEW: Create Expenses Table (Kharashaadka)
create table if not exists expenses (
  id text primary key,
  title text,
  amount numeric,
  category text,
  date text,
  description text
);

-- 8. NEW: Create Patient History Table (Diiwaanka)
create table if not exists patient_history (
  id text primary key,
  "patientId" text,
  date text,
  diagnosis text,
  treatment text,
  notes text,
  "doctorName" text
);

-- 9. NEW: Create Prescriptions Table (Daawooyinka)
create table if not exists prescriptions (
  id text primary key,
  "patientId" text,
  "doctorName" text,
  date text,
  medicines jsonb 
);

-- 10. Disable RLS (Row Level Security) - MUHIIM
alter table users disable row level security;
alter table products disable row level security;
alter table patients disable row level security;
alter table appointments disable row level security;
alter table transactions disable row level security;
alter table employees disable row level security;
alter table expenses disable row level security;
alter table patient_history disable row level security;
alter table prescriptions disable row level security;

-- 11. Create Default Admin
insert into users (id, email, password, name, role, avatar)
values ('1', 'admin@dhool.com', 'admin123', 'Maamule Sare', 'Admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin')
on conflict (id) do nothing;

*/