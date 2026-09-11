import { getDashboardStats } from "@/lib/db/admin-operations";
import type { ApiResponse } from "@/types";

export async function GET(): Promise<Response> {
  try {
    const stats = await getDashboardStats();
    const response: ApiResponse<typeof stats> = {
      success: true,
      data: stats,
    };
    return Response.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch stats",
    };
    return Response.json(response, { status: 500 });
  }
}
