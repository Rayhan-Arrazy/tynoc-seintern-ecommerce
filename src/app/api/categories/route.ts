import { type NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getAllCategories, createCategory } from "@/lib/db/store";
import type { ApiResponse, Category } from "@/types";

export async function GET(): Promise<Response> {
  try {
    const categories = await getAllCategories();

    const response: ApiResponse<Category[]> = {
      success: true,
      data: categories,
    };

    return Response.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch categories",
    };
    return Response.json(response, { status: 500 });
  }
}

export async function POST(
  request: NextRequest
): Promise<Response> {
  try {
    const body = await request.json();

    if (!body.name || typeof body.name !== "string" || body.name.trim().length === 0) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Category name is required",
      };
      return Response.json(response, { status: 400 });
    }

    const category: Category = {
      id: uuidv4(),
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, "-"),
      description: body.description || "",
      image: body.image || "",
      productCount: body.productCount || 0,
    };

    const created = await createCategory(category);

    const response: ApiResponse<Category> = {
      success: true,
      data: created,
      message: "Category created successfully",
    };

    return Response.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create category",
    };
    return Response.json(response, { status: 500 });
  }
}
