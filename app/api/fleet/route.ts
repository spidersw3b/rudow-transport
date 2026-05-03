import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const createSchema = z.object({
  unit_number: z.string().optional().nullable(),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().optional().nullable(),
  vin: z.string().optional().nullable(),
  vehicle_type: z.string().optional().nullable(),
  status: z.string().optional(),
  current_location: z.string().optional().nullable(),
  driver_assigned: z.string().optional().nullable(),
  mileage: z.number().optional().nullable(),
  last_maintenance: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  image_url: z.string().url().optional().nullable(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("fleet_vehicles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ vehicles: data ?? [] });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("fleet_vehicles")
      .insert({
        ...parsed.data,
        status: parsed.data.status || "Available",
      })
      .select("*")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ vehicle: data });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
