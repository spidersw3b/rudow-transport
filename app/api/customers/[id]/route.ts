import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin" && session?.user?.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = params;
    const supabase = getSupabaseAdmin();

    const { data: customer, error: cErr } = await supabase
      .from("users")
      .select("id, email, name, company, phone, role, created_at")
      .eq("id", id)
      .maybeSingle();

    if (cErr || !customer) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { data: requests } = await supabase
      .from("requests")
      .select("*")
      .eq("user_id", id)
      .order("created_at", { ascending: false });

    return NextResponse.json({ customer, requests: requests ?? [] });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
