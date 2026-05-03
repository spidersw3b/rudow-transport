-- Run once in Supabase → SQL Editor (password matches bcrypt cost 12).
-- Or locally: ADMIN_EMAIL=brett@rudowautomotive.com ADMIN_PASSWORD='…' node scripts/upsert-admin-user.cjs

INSERT INTO users (email, name, role, password_hash)
VALUES (
  'brett@rudowautomotive.com',
  'Brett',
  'admin',
  '$2a$12$1s90tTJ7/vy9p0.qdKL5u.c5Jwg2IPR6Ph2mQBWdkY9n.DmnwoQO2'
)
ON CONFLICT (email) DO UPDATE
SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  password_hash = EXCLUDED.password_hash;
