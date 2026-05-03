-- =============================================================================
-- Rudow Transportation — full schema + trigger + admin seed for Supabase
-- Paste the entire file into: Supabase → SQL Editor → Run
-- Safe to re-run: uses IF NOT EXISTS / OR REPLACE / ON CONFLICT where needed.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  company TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer',
  password_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transport_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users (id) ON DELETE SET NULL,
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
  status TEXT NOT NULL DEFAULT 'Pending',
  priority TEXT NOT NULL DEFAULT 'Medium',
  tracking_number TEXT,
  driver_assigned TEXT,
  estimated_completion DATE,
  customer_notes TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fleet_vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_number TEXT,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  vin TEXT UNIQUE,
  vehicle_type TEXT,
  status TEXT NOT NULL DEFAULT 'Available',
  current_location TEXT,
  driver_assigned TEXT,
  mileage INTEGER,
  last_maintenance DATE,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  license_number TEXT,
  license_expiry DATE,
  status TEXT NOT NULL DEFAULT 'Available',
  current_assignment UUID REFERENCES transport_requests (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Helpful indexes (safe if already exist)
CREATE INDEX IF NOT EXISTS idx_transport_requests_user_id ON transport_requests (user_id);
CREATE INDEX IF NOT EXISTS idx_transport_requests_status ON transport_requests (status);
CREATE INDEX IF NOT EXISTS idx_transport_requests_created_at ON transport_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
CREATE INDEX IF NOT EXISTS idx_fleet_vehicles_status ON fleet_vehicles (status);

-- -----------------------------------------------------------------------------
-- Auto-update transport_requests.updated_at
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION transport_requests_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS transport_requests_updated_at ON transport_requests;

CREATE TRIGGER transport_requests_updated_at
  BEFORE UPDATE ON transport_requests
  FOR EACH ROW
  EXECUTE FUNCTION transport_requests_set_updated_at();

-- If the line above errors on your Postgres version, comment it out and use:
-- CREATE TRIGGER transport_requests_updated_at
--   BEFORE UPDATE ON transport_requests
--   FOR EACH ROW
--   EXECUTE PROCEDURE transport_requests_set_updated_at();

-- -----------------------------------------------------------------------------
-- Seed admin (password: kingbret1t123) — bcrypt cost 12
-- Re-run updates name, role, and password if email already exists.
-- -----------------------------------------------------------------------------

INSERT INTO users (email, name, role, password_hash)
VALUES (
  'kingbrett@rudowtransportation.net',
  'King Brett',
  'admin',
  '$2a$12$LjcUzTa.TDx55GWcl8PIjOT1LopepzEj973M4YLxOGxAQCzCRkQcW'
)
ON CONFLICT (email) DO UPDATE
SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  password_hash = EXCLUDED.password_hash;
