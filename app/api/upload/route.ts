import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const purpose = searchParams.get("purpose");
    const session = await getServerSession(authOptions);

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file || !file.size) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json({ error: "File must be 2 MB or less" }, { status: 400 });
    }

    let prefix: string;
    if (session?.user?.id) {
      prefix = `quotes/${session.user.id}`;
    } else if (purpose === "quote") {
      prefix = `public-quotes/${randomUUID()}`;
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const path = `${prefix}/${Date.now()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase.storage.from("uploads").upload(path, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: true,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("uploads").getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrl, path: data.path });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
