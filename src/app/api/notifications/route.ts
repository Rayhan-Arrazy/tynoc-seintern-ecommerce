import { type NextRequest } from 'next/server';
import {
  getNotifications,
  createNotification,
  markAsRead,
  getUnreadCount,
} from '@/lib/db/notification-operations';
import type { ApiResponse, Notification } from '@/types';

const DEFAULT_USER_ID = 'user-1';

export async function GET(
  request: NextRequest
): Promise<Response> {
  try {
    const { searchParams } = request.nextUrl;
    const userId = searchParams.get('userId') || DEFAULT_USER_ID;
    const action = searchParams.get('action');

    if (action === 'unread-count') {
      const count = await getUnreadCount(userId);
      const response: ApiResponse<{ count: number }> = {
        success: true,
        data: { count },
      };
      return Response.json(response, { status: 200 });
    }

    const items = await getNotifications(userId);

    const response: ApiResponse<Notification[]> = {
      success: true,
      data: items,
    };

    return Response.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch notifications',
    };
    return Response.json(response, { status: 500 });
  }
}

export async function POST(
  request: NextRequest
): Promise<Response> {
  try {
    const body = await request.json();

    if (!body.type || !body.title || !body.message) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'type, title, and message are required',
      };
      return Response.json(response, { status: 400 });
    }

    const notification = await createNotification({
      userId: body.userId || DEFAULT_USER_ID,
      type: body.type,
      title: body.title,
      message: body.message,
    });

    const response: ApiResponse<Notification> = {
      success: true,
      data: notification,
      message: 'Notification created successfully',
    };

    return Response.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create notification',
    };
    return Response.json(response, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest
): Promise<Response> {
  try {
    const body = await request.json();

    if (!body.id) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'id is required',
      };
      return Response.json(response, { status: 400 });
    }

    await markAsRead(body.id);

    const response: ApiResponse<null> = {
      success: true,
      message: 'Notification marked as read',
    };

    return Response.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update notification',
    };
    return Response.json(response, { status: 500 });
  }
}
