import { v4 as uuidv4 } from "uuid";
import type { Notification } from "@/types";

const useSupabase = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

let notifications: Notification[] = [
  {
    id: uuidv4(),
    userId: "user-1",
    type: "system",
    title: "Welcome to Tynoc!",
    message: "Thanks for joining Tynoc. Explore our latest products and exclusive deals.",
    read: false,
    createdAt: "2026-09-10T08:00:00.000Z",
  },
  {
    id: uuidv4(),
    userId: "user-1",
    type: "order",
    title: "Order Shipped",
    message: "Your order #ORD-8A3F has been shipped via FedEx. Track: FX123456789",
    read: false,
    createdAt: "2026-09-11T14:30:00.000Z",
  },
  {
    id: uuidv4(),
    userId: "user-1",
    type: "promotion",
    title: "Flash Sale: Up to 50% Off",
    message: "Don't miss our biggest sale of the season. Ends Sunday!",
    read: true,
    createdAt: "2026-09-08T10:00:00.000Z",
  },
];

async function getSupabase() {
  if (!useSupabase) return null;
  try {
    const { supabase } = await import("./supabase");
    return supabase;
  } catch {
    return null;
  }
}

function mapNotification(row: any): Notification {
  return {
    id: row.id,
    userId: row.userid,
    title: row.title,
    message: row.message,
    type: row.type,
    read: row.is_read,
    createdAt: row.created_at,
  };
}

export async function getNotifications(userId: string): Promise<Notification[]> {
  const supabase = await getSupabase();
  if (supabase) {
    try {
      const { data, error } = await (supabase.from("notifications") as any)
        .select("*")
        .eq("userid", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(mapNotification);
    } catch (error) {
      console.error("Error fetching notifications from Supabase:", error);
    }
  }
  return notifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createNotification(
  notification: Omit<Notification, "id" | "createdAt" | "read">
): Promise<Notification> {
  const supabase = await getSupabase();
  if (supabase) {
    try {
      const { data, error } = await (supabase.from("notifications") as any)
        .insert({
          userid: notification.userId,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          is_read: false,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      return mapNotification(data);
    } catch (error) {
      console.error("Error creating notification in Supabase:", error);
    }
  }
  const newNotification: Notification = {
    ...notification,
    id: uuidv4(),
    read: false,
    createdAt: new Date().toISOString(),
  };
  notifications.push(newNotification);
  return newNotification;
}

export async function markAsRead(id: string): Promise<void> {
  const supabase = await getSupabase();
  if (supabase) {
    try {
      await (supabase.from("notifications") as any)
        .update({ is_read: true })
        .eq("id", id);
      return;
    } catch (error) {
      console.error("Error marking notification as read in Supabase:", error);
    }
  }
  const notification = notifications.find((n) => n.id === id);
  if (notification) {
    notification.read = true;
  }
}

export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = await getSupabase();
  if (supabase) {
    try {
      const { count, error } = await (supabase.from("notifications") as any)
        .select("*", { count: "exact", head: true })
        .eq("userid", userId)
        .eq("is_read", false);
      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error("Error getting unread count from Supabase:", error);
    }
  }
  return notifications.filter((n) => n.userId === userId && !n.read).length;
}
