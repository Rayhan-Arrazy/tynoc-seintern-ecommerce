import { supabase } from "@/lib/db/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await (supabase as any)
    .from("cart")
    .select("*")
    .order("added_at", { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, data: data || [] });
}
