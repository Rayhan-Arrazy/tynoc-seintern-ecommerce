import { supabase } from "@/lib/db/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await (supabase as any)
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, data: data || [] });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, slug, description, image } = body;

  if (!name || !slug) {
    return NextResponse.json({ success: false, error: "Name and slug are required" }, { status: 400 });
  }

  const { data, error } = await (supabase as any)
    .from("categories")
    .insert({ name, slug, description: description || "", image: image || "", productcount: 0 })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, data }, { status: 201 });
}
