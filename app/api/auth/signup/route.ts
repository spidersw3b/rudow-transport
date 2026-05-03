import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { isSupabaseServiceConfigured, SUPABASE_UNAVAILABLE_MESSAGE } from "@/lib/server-config";

const signupSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { name, phone, email, password } = parsed.data;

    if (!isSupabaseServiceConfigured()) {
      return NextResponse.json(
        { error: SUPABASE_UNAVAILABLE_MESSAGE, code: "SUPABASE_ENV_MISSING" },
        { status: 503 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const { data: user, error } = await supabase
      .from("users")
      .insert({
        email: email.toLowerCase(),
        name,
        phone: phone || null,
        role: "customer",
        password_hash,
      })
      .select("id, email, name, role")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ user });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
