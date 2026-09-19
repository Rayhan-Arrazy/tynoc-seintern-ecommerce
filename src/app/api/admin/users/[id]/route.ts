import { supabase } from "@/lib/db/supabase";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const { name, email, avatar } = body;

  if (!name || !email) {
    return NextResponse.json({ success: false, error: "Name and email are required" }, { status: 400 });
  }

  const { data, error } = await (supabase as any)
    .from("users")
    .update({ name, email, avatar })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, data });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await (supabase as any).from("cart").delete().eq("userid", id);
  await (supabase as any).from("wishlist").delete().eq("userid", id);
  await (supabase as any).from("notifications").delete().eq("userid", id);

  const { error } = await (supabase as any)
    .from("users")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
