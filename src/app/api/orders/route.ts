import { type NextRequest } from "next/server";
import { createNotification } from "@/lib/db/notification-operations";
import { supabase } from "@/lib/db/supabase";
import { randomUUID } from "crypto";
import type { ApiResponse, Order, OrderItem, CartItem } from "@/types";

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

export async function GET(
  request: NextRequest
): Promise<Response> {
  try {
    const { searchParams } = request.nextUrl;
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ success: true, data: [] }, { status: 200 });
    }

    const { data, error } = await (supabase as any)
      .from("orders")
      .select("*")
      .eq("userid", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase orders fetch error:", error);
      return Response.json({ success: true, data: [] }, { status: 200 });
    }

    const orders = (data || []).map(mapOrder);

    return Response.json({ success: true, data: orders }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch orders",
    };
    return Response.json(response, { status: 500 });
  }
}

export async function POST(
  request: NextRequest
): Promise<Response> {
  try {
    const body = await request.json();
    const { items, shippingAddress, paymentMethod, userId } = body;

    if (!userId) {
      const response: ApiResponse<null> = {
        success: false,
        error: "User ID is required",
      };
      return Response.json(response, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      const response: ApiResponse<null> = {
        success: false,
        error: "At least one item is required",
      };
      return Response.json(response, { status: 400 });
    }

    if (!shippingAddress) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Shipping address is required",
      };
      return Response.json(response, { status: 400 });
    }

    if (!paymentMethod) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Payment method is required",
      };
      return Response.json(response, { status: 400 });
    }

    const orderItems: OrderItem[] = items.map((item: CartItem) => ({
      id: randomUUID(),
      productId: item.productId,
      product: item.product,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = Math.round((subtotal + shipping + tax) * 100) / 100;

    const order: Order = {
      id: randomUUID(),
      userId,
      items: orderItems,
      subtotal,
      shipping,
      tax,
      total,
      status: "pending",
      shippingAddress,
      paymentMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { data: inserted, error: insertError } = await (supabase as any)
      .from("orders")
      .insert({
        id: order.id,
        userid: order.userId,
        items: order.items,
        subtotal: order.subtotal,
        shipping: order.shipping,
        tax: order.tax,
        total: order.total,
        status: order.status,
        shipping_address: order.shippingAddress,
        payment_method: order.paymentMethod,
        created_at: order.createdAt,
        updated_at: order.updatedAt,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Supabase order insert error:", JSON.stringify(insertError));
      return Response.json({ success: false, error: `Failed to create order: ${insertError.message || insertError.code || "unknown"}`, details: insertError }, { status: 500 });
    }

    const created = mapOrder(inserted);

    try {
      await createNotification({
        userId,
        type: 'order',
        title: 'Order Placed',
        message: `Your order #${created.id.slice(0, 8).toUpperCase()} has been placed. Processing payment...`,
      });
    } catch (notifErr) {
      console.error("Notification after order create failed:", notifErr);
    }

    const response: ApiResponse<Order> = {
      success: true,
      data: created,
      message: "Order placed successfully",
    };

    return Response.json(response, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create order",
    };
    return Response.json(response, { status: 500 });
  }
}
