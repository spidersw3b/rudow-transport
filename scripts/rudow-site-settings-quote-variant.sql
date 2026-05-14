-- Rudow Automotive — site settings (Supabase SQL Editor)
-- Stores public-readable keys such as quote_form_variant for rudowtransportation.net

-- One-time: if an older STE-named table exists, rename it (keeps rows and policies on the relation).
DO $$
BEGIN
  IF to_regclass('public.ste_site_settings') IS NOT NULL
     AND to_regclass('public.rudow_site_settings') IS NULL THEN
    ALTER TABLE public.ste_site_settings RENAME TO rudow_site_settings;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS rudow_site_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO rudow_site_settings (key, value)
VALUES ('quote_form_variant', 'simple')
ON CONFLICT (key) DO NOTHING;

ALTER TABLE rudow_site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read settings" ON rudow_site_settings;
CREATE POLICY "public read settings"
  ON rudow_site_settings FOR SELECT TO anon
  USING (true);

DROP POLICY IF EXISTS "admin all settings" ON rudow_site_settings;
CREATE POLICY "admin all settings"
  ON rudow_site_settings FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
