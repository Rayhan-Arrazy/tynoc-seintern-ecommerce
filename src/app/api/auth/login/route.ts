import { type NextRequest } from "next/server";
import { getUserByEmail } from "@/lib/db";
import type { ApiResponse, User } from "@/types";

export async function POST(
  request: NextRequest
): Promise<Response> {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || typeof email !== "string") {
      const response: ApiResponse<null> = {
        success: false,
        error: "Email is required",
      };
      return Response.json(response, { status: 400 });
    }

    if (!password || typeof password !== "string") {
      const response: ApiResponse<null> = {
        success: false,
        error: "Password is required",
      };
      return Response.json(response, { status: 400 });
    }

    const userWithPassword = await getUserByEmail(email.toLowerCase().trim());

    if (!userWithPassword) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Invalid email or password",
      };
      return Response.json(response, { status: 401 });
    }

    if (userWithPassword.password !== password) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Invalid email or password",
      };
      return Response.json(response, { status: 401 });
    }

    const { password: _, ...user } = userWithPassword;

    const response: ApiResponse<User> = {
      success: true,
      data: user,
      message: "Login successful",
    };

    return Response.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to login",
    };
    return Response.json(response, { status: 500 });
  }
}
