/**
 * Upsert an admin user (bcrypt password). Loads Supabase keys from .env.local.
 *
 * Usage:
 *   ADMIN_PASSWORD='your-secret' npm run seed:admin
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='your-secret' node scripts/upsert-admin-user.cjs
 *
 * If ADMIN_EMAIL is omitted, defaults to brett@rudowautomotive.com.
 */
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { createClient } = require("@supabase/supabase-js");

function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error("Missing .env.local (need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)");
    process.exit(1);
  }
  const text = fs.readFileSync(envPath, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

async function main() {
  const email = (process.env.ADMIN_EMAIL || "brett@rudowautomotive.com").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    console.error("Set ADMIN_PASSWORD (optional: ADMIN_EMAIL, defaults to brett@rudowautomotive.com)");
    process.exit(1);
  }

  loadEnvLocal();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be in .env.local");
    process.exit(1);
  }

  const passwordHash = bcrypt.hashSync(password, 12);
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        email,
        name: "Brett",
        role: "admin",
        password_hash: passwordHash,
      },
      { onConflict: "email" }
    )
    .select("id, email, role")
    .single();

  if (error) {
    console.error("Supabase error:", error.message);
    process.exit(1);
  }
  console.log("Admin user ready:", data);
}

main();
