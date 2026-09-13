import { type NextRequest } from "next/server";
import { getOrderById } from "@/lib/db";
import { updateOrderStatus } from "@/lib/db/order-operations";
import { createNotification } from "@/lib/db/notification-operations";
import type { ApiResponse, Order, OrderStatus } from "@/types";

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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Status is required",
      };
      return Response.json(response, { status: 400 });
    }

    const validStatuses: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      const response: ApiResponse<null> = {
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      };
      return Response.json(response, { status: 400 });
    }

    const existingOrder = await getOrderById(id);
    if (!existingOrder) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Order not found",
      };
      return Response.json(response, { status: 404 });
    }

    const updatedOrder = await updateOrderStatus(id, status);

    if (status === "confirmed") {
      await createNotification({
        userId: existingOrder.userId,
        type: "order",
        title: "Payment Confirmed",
        message: `Payment for order #${id.slice(0, 8).toUpperCase()} has been confirmed. Your order is now being processed.`,
      });
    } else if (status === "shipped") {
      await createNotification({
        userId: existingOrder.userId,
        type: "order",
        title: "Order Shipped",
        message: `Your order #${id.slice(0, 8).toUpperCase()} has been shipped.`,
      });
    } else if (status === "delivered") {
      await createNotification({
        userId: existingOrder.userId,
        type: "order",
        title: "Order Delivered",
        message: `Your order #${id.slice(0, 8).toUpperCase()} has been delivered.`,
      });
    }

    const response: ApiResponse<Order> = {
      success: true,
      data: updatedOrder!,
      message: `Order status updated to ${status}`,
    };

    return Response.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update order status",
    };
    return Response.json(response, { status: 500 });
  }
}
