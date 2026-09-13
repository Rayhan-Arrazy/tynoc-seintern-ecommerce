import { type NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { createUser } from "@/lib/db";
import type { ApiResponse, User, UserWithPassword } from "@/types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(
  request: NextRequest
): Promise<Response> {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Name is required",
      };
      return Response.json(response, { status: 400 });
    }

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email)) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Valid email is required",
      };
      return Response.json(response, { status: 400 });
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Password must be at least 6 characters",
      };
      return Response.json(response, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user: UserWithPassword = {
      id: uuidv4(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      avatar: `https://picsum.photos/seed/${uuidv4().slice(0, 8)}/100/100`,
      createdAt: new Date().toISOString(),
      password: hashedPassword,
    };

    const created = await createUser(user);

    const response: ApiResponse<User> = {
      success: true,
      data: created,
      message: "Account created successfully",
    };

    return Response.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create account",
    };
    return Response.json(response, { status: 500 });
  }
}
