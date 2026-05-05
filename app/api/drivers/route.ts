import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { apiError, apiOk } from "@/lib/api-response";
import { mapSupabaseError } from "@/lib/db-guard";

const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  license_number: z.string().optional().nullable(),
  license_expiry: z.string().optional().nullable(),
  status: z.string().optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin" && session?.user?.role !== "super_admin") {
      return apiError(403, "FORBIDDEN", "Only admins can view drivers.");
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("drivers")
      .select("*")
      .order("created_at", { ascending: false });

    const mapped = mapSupabaseError(error);
    if (mapped) return mapped;
    return apiOk({ drivers: data ?? [] });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error";
    return apiError(500, "DRIVERS_GET_FAILED", message);
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin" && session?.user?.role !== "super_admin") {
      return apiError(403, "FORBIDDEN", "Only admins can create drivers.");
    }

    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(400, "VALIDATION_ERROR", "Invalid request body.", parsed.error.flatten());
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("drivers")
      .insert({
        ...parsed.data,
        status: parsed.data.status || "Available",
      })
      .select("*")
      .single();

    const mapped = mapSupabaseError(error);
    if (mapped) return mapped;
    return apiOk({ driver: data }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error";
    return apiError(500, "DRIVER_CREATE_FAILED", message);
  }
}
