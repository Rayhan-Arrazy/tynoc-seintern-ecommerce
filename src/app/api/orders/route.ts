import { type NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import {
  getOrders,
  createOrder,
} from "@/lib/db";
import { createNotification } from "@/lib/db/notification-operations";
import type { ApiResponse, Order, OrderItem, CartItem } from "@/types";

export async function GET(
  request: NextRequest
): Promise<Response> {
  try {
    const { searchParams } = request.nextUrl;
    const userId = searchParams.get("userId");

    if (!userId) {
      const response: ApiResponse<Order[]> = {
        success: true,
        data: [],
      };
      return Response.json(response, { status: 200 });
    }

    const orders = await getOrders(userId);

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
      id: uuidv4(),
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
      id: uuidv4(),
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

    const created = await createOrder(order);

    await createNotification({
      userId,
      type: 'order',
      title: 'Order Placed',
      message: `Your order #${created.id.slice(0, 8).toUpperCase()} has been placed. Processing payment...`,
    });

    const response: ApiResponse<Order> = {
      success: true,
      data: created,
      message: "Order placed successfully",
    };

    return Response.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create order",
    };
    return Response.json(response, { status: 500 });
  }
}
