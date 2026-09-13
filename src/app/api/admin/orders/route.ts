import { getAllOrders } from "@/lib/db";
import type { ApiResponse, Order } from "@/types";

export async function GET(): Promise<Response> {
  try {
    const orders = await getAllOrders();

    const response: ApiResponse<Order[]> = {
      success: true,
      data: orders,
    };

    return Response.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch orders",
    };
    return Response.json(response, { status: 500 });
  }
}
