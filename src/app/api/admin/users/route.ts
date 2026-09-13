import { getUsers } from "@/lib/db";
import type { ApiResponse, User } from "@/types";

export async function GET(): Promise<Response> {
  try {
    const users = await getUsers();

    const response: ApiResponse<User[]> = {
      success: true,
      data: users,
    };

    return Response.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch users",
    };
    return Response.json(response, { status: 500 });
  }
}
