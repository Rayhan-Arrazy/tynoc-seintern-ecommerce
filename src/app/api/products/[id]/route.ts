import { type NextRequest } from "next/server";
import { getProductById, updateProduct, deleteProduct } from "@/lib/db";
import type { ApiResponse, Product } from "@/types";

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/products/[id]">
): Promise<Response> {
  try {
    const { id } = await ctx.params;

    const product = await getProductById(id);

    if (!product) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Product not found",
      };
      return Response.json(response, { status: 404 });
    }

    const response: ApiResponse<Product> = {
      success: true,
      data: product,
    };

    return Response.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch product",
    };
    return Response.json(response, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  ctx: RouteContext<"/api/products/[id]">
): Promise<Response> {
  try {
    const { id } = await ctx.params;
    const body = await request.json();

    const existing = await getProductById(id);
    if (!existing) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Product not found",
      };
      return Response.json(response, { status: 404 });
    }

    const updated = await updateProduct(id, { ...body, id });

    const response: ApiResponse<Product> = {
      success: true,
      data: updated,
      message: "Product updated successfully",
    };

    return Response.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update product",
    };
    return Response.json(response, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/products/[id]">
): Promise<Response> {
  try {
    const { id } = await ctx.params;

    const existing = await getProductById(id);
    if (!existing) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Product not found",
      };
      return Response.json(response, { status: 404 });
    }

    await deleteProduct(id);

    const response: ApiResponse<null> = {
      success: true,
      message: "Product deleted successfully",
    };

    return Response.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete product",
    };
    return Response.json(response, { status: 500 });
  }
}
