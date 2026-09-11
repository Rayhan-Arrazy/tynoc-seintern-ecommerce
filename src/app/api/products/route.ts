import { type NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getAllProducts, createProduct } from "@/lib/db";
import { validateProduct } from "@/lib/utils/validation";
import type { ApiResponse, PaginatedResponse, Product, SearchFilters } from "@/types";

export async function GET(
  request: NextRequest
): Promise<Response> {
  try {
    const { searchParams } = request.nextUrl;

    const filters: SearchFilters = {
      query: searchParams.get("query") || "",
      category: searchParams.get("category") || "",
      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : 0,
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : Infinity,
      sortBy: (searchParams.get("sortBy") as SearchFilters["sortBy"]) || "newest",
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
    };

    const result = await getAllProducts(filters);

    const response: ApiResponse<PaginatedResponse<Product>> = {
      success: true,
      data: result,
    };

    return Response.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch products",
    };
    return Response.json(response, { status: 500 });
  }
}

export async function POST(
  request: NextRequest
): Promise<Response> {
  try {
    const body = await request.json();

    const validation = validateProduct(body);
    if (!validation.valid) {
      const response: ApiResponse<null> = {
        success: false,
        error: validation.errors.join(", "),
      };
      return Response.json(response, { status: 400 });
    }

    const now = new Date().toISOString();
    const product: Product = {
      id: uuidv4(),
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, "-"),
      description: body.description || "",
      price: body.price,
      originalPrice: body.originalPrice || body.price,
      images: body.images || [],
      categoryId: body.categoryId || "",
      category: body.category || { id: "", name: "", slug: "", description: "", image: "", productCount: 0 },
      stock: body.stock || 0,
      rating: body.rating || 0,
      reviewCount: body.reviewCount || 0,
      features: body.features || [],
      specifications: body.specifications || {},
      tags: body.tags || [],
      isFeatured: body.isFeatured || false,
      isNew: body.isNew || false,
      isOnSale: body.isOnSale || false,
      createdAt: now,
      updatedAt: now,
    };

    const created = await createProduct(product);

    const response: ApiResponse<Product> = {
      success: true,
      data: created,
      message: "Product created successfully",
    };

    return Response.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create product",
    };
    return Response.json(response, { status: 500 });
  }
}
