import { type NextRequest } from "next/server";
import { getUserById } from "@/lib/db";
import type { ApiResponse, User } from "@/types";

export async function GET(
  request: NextRequest
): Promise<Response> {
  try {
    const { searchParams } = request.nextUrl;
    const userId = searchParams.get("userId");

    if (!userId) {
      const response: ApiResponse<null> = {
        success: false,
        error: "userId query parameter is required",
      };
      return Response.json(response, { status: 400 });
    }

    const user = await getUserById(userId);

    if (!user) {
      const response: ApiResponse<null> = {
        success: false,
        error: "User not found",
      };
      return Response.json(response, { status: 404 });
    }

    const response: ApiResponse<User> = {
      success: true,
      data: user,
    };

    return Response.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch user",
    };
    return Response.json(response, { status: 500 });
  }
}
