import { type NextRequest } from "next/server";
import { getOrderById } from "@/lib/db";
import type { ApiResponse, Order } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Order not found",
      };
      return Response.json(response, { status: 404 });
    }

    const response: ApiResponse<Order> = {
      success: true,
      data: order,
    };

    return Response.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch order",
    };
    return Response.json(response, { status: 500 });
  }
}
