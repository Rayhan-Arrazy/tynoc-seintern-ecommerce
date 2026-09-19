import { supabase } from "@/lib/db/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await (supabase as any)
    .from("users")
    .select("id, name, email, avatar, createdat, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  const users = (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    avatar: row.avatar || "",
    createdat: row.createdat || row.created_at,
  }));

  return NextResponse.json({ success: true, data: users });
}
