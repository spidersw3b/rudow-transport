-- Run in Supabase SQL Editor.
-- Quote form variant for /quote page (public read + admin write via app API).

CREATE TABLE IF NOT EXISTS ste_site_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO ste_site_settings (key, value)
VALUES ('quote_form_variant', 'simple')
ON CONFLICT (key) DO NOTHING;

ALTER TABLE ste_site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read settings" ON ste_site_settings;
CREATE POLICY "public read settings"
  ON ste_site_settings FOR SELECT TO anon
  USING (true);

DROP POLICY IF EXISTS "admin all settings" ON ste_site_settings;
CREATE POLICY "admin all settings"
  ON ste_site_settings FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Optional: public quote photo bucket (app currently uses "uploads" via /api/upload).
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('quote-photos', 'quote-photos', true)
-- ON CONFLICT (id) DO NOTHING;
