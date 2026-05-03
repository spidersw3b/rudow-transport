-- Rudow Transportation — PostgreSQL schema for Supabase

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  company TEXT,
  phone TEXT,
  role TEXT DEFAULT 'customer',
  password_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transport_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  phone TEXT,
  company TEXT,
  service_type TEXT NOT NULL,
  vehicle_description TEXT,
  origin_location TEXT,
  destination TEXT,
  special_instructions TEXT,
  photo_url TEXT,
  status TEXT DEFAULT 'Pending',
  priority TEXT DEFAULT 'Medium',
  tracking_number TEXT,
  driver_assigned TEXT,
  estimated_completion DATE,
  customer_notes TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fleet_vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_number TEXT,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  vin TEXT UNIQUE,
  vehicle_type TEXT,
  status TEXT DEFAULT 'Available',
  current_location TEXT,
  driver_assigned TEXT,
  mileage INTEGER,
  last_maintenance DATE,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  license_number TEXT,
  license_expiry DATE,
  status TEXT DEFAULT 'Available',
  current_assignment UUID REFERENCES transport_requests(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: add a trigger in Supabase to auto-touch updated_at on row changes.
