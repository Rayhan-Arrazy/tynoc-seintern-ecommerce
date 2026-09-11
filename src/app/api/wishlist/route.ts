import { type NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import {
  getWishlistItems,
  addToWishlist,
  removeFromWishlist,
} from "@/lib/db";
import type { ApiResponse, WishlistItem } from "@/types";

const DEFAULT_USER_ID = "user-1";

export async function GET(
  request: NextRequest
): Promise<Response> {
  try {
    const { searchParams } = request.nextUrl;
    const userId = searchParams.get("userId") || DEFAULT_USER_ID;

    const items = await getWishlistItems(userId);

    const response: ApiResponse<WishlistItem[]> = {
      success: true,
      data: items,
    };

    return Response.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch wishlist items",
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

    const wishlistItem: WishlistItem = {
      id: uuidv4(),
      productId: body.productId,
      product: body.product,
      userId: DEFAULT_USER_ID,
      addedAt: new Date().toISOString(),
    };

    const added = await addToWishlist(wishlistItem);

    const response: ApiResponse<WishlistItem> = {
      success: true,
      data: added,
      message: "Item added to wishlist successfully",
    };

    return Response.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add item to wishlist",
    };
    return Response.json(response, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest
): Promise<Response> {
  try {
    const { searchParams } = request.nextUrl;
    const productId = searchParams.get("productId");

    if (!productId) {
      const response: ApiResponse<null> = {
        success: false,
        error: "productId query parameter is required",
      };
      return Response.json(response, { status: 400 });
    }

    await removeFromWishlist(DEFAULT_USER_ID, productId);

    const response: ApiResponse<null> = {
      success: true,
      message: "Item removed from wishlist successfully",
    };

    return Response.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to remove item from wishlist",
    };
    return Response.json(response, { status: 500 });
  }
}
