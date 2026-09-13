import { type NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import {
  getCartItems,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "@/lib/db";
import type { ApiResponse, CartItem } from "@/types";

const DEFAULT_USER_ID = "user-1";

export async function GET(
  request: NextRequest
): Promise<Response> {
  try {
    const { searchParams } = request.nextUrl;
    const userId = searchParams.get("userId") || DEFAULT_USER_ID;

    const items = await getCartItems(userId);

    const response: ApiResponse<CartItem[]> = {
      success: true,
      data: items,
    };

    return Response.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch cart items",
    };
    return Response.json(response, { status: 500 });
  }
}

export async function POST(
  request: NextRequest
): Promise<Response> {
  try {
    const body = await request.json();

    if (!body.productId || !body.product) {
      const response: ApiResponse<null> = {
        success: false,
        error: "productId and product are required",
      };
      return Response.json(response, { status: 400 });
    }

    if (!body.quantity || typeof body.quantity !== "number" || body.quantity < 1) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Quantity must be a positive number",
      };
      return Response.json(response, { status: 400 });
    }

    const cartItem: CartItem = {
      id: uuidv4(),
      productId: body.productId,
      product: body.product,
      quantity: body.quantity,
      userId: DEFAULT_USER_ID,
      addedAt: new Date().toISOString(),
    };

    const added = await addToCart(cartItem);

    const response: ApiResponse<CartItem> = {
      success: true,
      data: added,
      message: "Item added to cart successfully",
    };

    return Response.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add item to cart",
    };
    return Response.json(response, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest
): Promise<Response> {
  try {
    const body = await request.json();

    if (!body.productId) {
      const response: ApiResponse<null> = {
        success: false,
        error: "productId is required",
      };
      return Response.json(response, { status: 400 });
    }

    if (!body.quantity || typeof body.quantity !== "number" || body.quantity < 1) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Quantity must be a positive number",
      };
      return Response.json(response, { status: 400 });
    }

    const updated = await updateCartItem(DEFAULT_USER_ID, body.productId, body.quantity);

    const response: ApiResponse<CartItem> = {
      success: true,
      data: updated,
      message: "Cart item updated successfully",
    };

    return Response.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update cart item",
    };
    return Response.json(response, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest
): Promise<Response> {
  return PUT(request);
}

export async function DELETE(
  request: NextRequest
): Promise<Response> {
  try {
    const { searchParams } = request.nextUrl;
    const productId = searchParams.get("productId");

    if (productId) {
      await removeFromCart(DEFAULT_USER_ID, productId);
      return Response.json({ success: true, message: "Item removed from cart successfully" }, { status: 200 });
    }

    await clearCart(DEFAULT_USER_ID);
    return Response.json({ success: true, message: "Cart cleared successfully" }, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete cart items",
    };
    return Response.json(response, { status: 500 });
  }
}
