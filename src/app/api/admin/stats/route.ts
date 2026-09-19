import { getDashboardStats } from "@/lib/db/admin-operations";
import type { ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  try {
    const stats = await getDashboardStats();
    return Response.json({ success: true, data: stats }, { status: 200 });
  } catch (error) {
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch stats",
    }, { status: 500 });
  }
}
