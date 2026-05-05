CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  company TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'super_admin')),
  password_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  phone TEXT,
  company TEXT,
  service_type TEXT NOT NULL,
  vehicle_description TEXT,
  origin_location TEXT,
  destination TEXT,
  special_instructions TEXT,
  request_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  priority TEXT NOT NULL DEFAULT 'Standard',
  tracking_number TEXT,
  driver_assigned TEXT,
  estimated_completion DATE,
  customer_notes TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES requests(id) ON DELETE SET NULL,
  vin TEXT,
  make TEXT,
  model TEXT,
  model_year INT,
  vehicle_type TEXT,
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
  availability_status TEXT NOT NULL DEFAULT 'Available',
  current_assignment UUID REFERENCES requests(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transport_shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  pickup_scheduled_at TIMESTAMPTZ,
  delivery_scheduled_at TIMESTAMPTZ,
  pickup_location TEXT NOT NULL,
  delivery_location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Planned',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS driver_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  request_id UUID REFERENCES requests(id) ON DELETE SET NULL,
  transport_shipment_id UUID REFERENCES transport_shipments(id) ON DELETE SET NULL,
  pickup_eta TIMESTAMPTZ,
  delivery_eta TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'Assigned',
  notes TEXT,
  proof_document_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS report_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_month TEXT NOT NULL,
  summary TEXT NOT NULL,
  generated_by TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS document_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  submitted_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  role_scope TEXT NOT NULL DEFAULT 'customer',
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_requests_user_id ON requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_transport_shipments_status ON transport_shipments(status);
CREATE INDEX IF NOT EXISTS idx_document_submissions_request_id ON document_submissions(request_id);

CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS requests_touch_updated_at ON requests;
CREATE TRIGGER requests_touch_updated_at BEFORE UPDATE ON requests FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

DROP TRIGGER IF EXISTS shipments_touch_updated_at ON transport_shipments;
CREATE TRIGGER shipments_touch_updated_at BEFORE UPDATE ON transport_shipments FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
