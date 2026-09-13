import { type NextRequest } from "next/server";
import { supabase } from "@/lib/db/supabase";
import { createNotification } from "@/lib/db/notification-operations";
import type { ApiResponse, Order, OrderStatus } from "@/types";

function mapOrder(row: any): Order {
  return {
    id: row.id,
    userId: row.userid,
    items: row.items,
    subtotal: Number(row.subtotal),
    shipping: Number(row.shipping),
    tax: Number(row.tax),
    total: Number(row.total),
    status: row.status,
    shippingAddress: row.shipping_address,
    paymentMethod: row.payment_method,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function getOrder(id: string): Promise<Order | null> {
  const { data, error } = await (supabase as any)
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapOrder(data);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params;
    const order = await getOrder(id);

    if (!order) {
      return Response.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return Response.json({ success: true, data: order }, { status: 200 });
  } catch (error) {
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch order",
    }, { status: 500 });
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
      return Response.json({ success: false, error: "Status is required" }, { status: 400 });
    }

    const validStatuses: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return Response.json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      }, { status: 400 });
    }

    const existingOrder = await getOrder(id);
    if (!existingOrder) {
      return Response.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const now = new Date().toISOString();
    const { error: updateError } = await (supabase as any)
      .from("orders")
      .update({ status, updated_at: now })
      .eq("id", id);

    if (updateError) {
      console.error("Supabase order update error:", updateError);
      return Response.json({ success: false, error: "Failed to update order" }, { status: 500 });
    }

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

    const updatedOrder: Order = { ...existingOrder, status, updatedAt: now };

    return Response.json({
      success: true,
      data: updatedOrder,
      message: `Order status updated to ${status}`,
    }, { status: 200 });
  } catch (error) {
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to update order status",
    }, { status: 500 });
  }
}
