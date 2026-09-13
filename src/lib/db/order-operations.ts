import { v4 as uuidv4 } from "uuid";
import type { Order, OrderStatus } from "@/types";

const useSupabase = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

let orders: Order[] = [];

async function getSupabase() {
  if (!useSupabase) return null;
  try {
    const { supabase } = await import("./supabase");
    return supabase;
  } catch {
    return null;
  }
}

function mapOrder(row: any): Order {
  return {
    id: row.id,
    userId: row.userid,
    items: row.items,
    subtotal: Number(row.subtotal),
    shipping: Number(row.shipping),
    tax: Number(row.tax),
    total: Number(row.total),
    status: row.status,
    shippingAddress: row.shipping_address,
    paymentMethod: row.payment_method,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getAllOrders(): Promise<Order[]> {
  const supabase = await getSupabase();
  if (supabase) {
    try {
      const { data, error } = await (supabase.from("orders") as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(mapOrder);
    } catch (error) {
      console.error("Error fetching all orders from Supabase:", error);
    }
  }
  return [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getOrders(userId: string): Promise<Order[]> {
  const supabase = await getSupabase();
  if (supabase) {
    try {
      const { data, error } = await (supabase.from("orders") as any)
        .select("*")
        .eq("userid", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(mapOrder);
    } catch (error) {
      console.error("Error fetching orders from Supabase:", error);
    }
  }
  return orders
    .filter((o) => o.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = await getSupabase();
  if (supabase) {
    try {
      const { data, error } = await (supabase.from("orders") as any)
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return mapOrder(data);
    } catch (error) {
      console.error("Error fetching order from Supabase:", error);
    }
  }
  return orders.find((o) => o.id === id) || null;
}

export async function createOrder(
  order: Order
): Promise<Order> {
  const supabase = await getSupabase();
  if (supabase) {
    try {
      const { data, error } = await (supabase.from("orders") as any)
        .insert({
          id: order.id,
          userid: order.userId,
          items: order.items,
          subtotal: order.subtotal,
          shipping: order.shipping,
          tax: order.tax,
          total: order.total,
          status: order.status,
          shipping_address: order.shippingAddress,
          payment_method: order.paymentMethod,
          created_at: order.createdAt,
          updated_at: order.updatedAt,
        })
        .select()
        .single();
      if (error) throw error;
      return mapOrder(data);
    } catch (error) {
      console.error("Error creating order in Supabase:", error);
    }
  }
  const newOrder: Order = {
    ...order,
    id: order.id || uuidv4(),
    status: order.status || ('pending' as OrderStatus),
    createdAt: order.createdAt || new Date().toISOString(),
    updatedAt: order.updatedAt || new Date().toISOString(),
  };
  orders.push(newOrder);
  return newOrder;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order | null> {
  const supabase = await getSupabase();
  if (supabase) {
    try {
      const { data, error } = await (supabase.from("orders") as any)
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return mapOrder(data);
    } catch (error) {
      console.error("Error updating order in Supabase:", error);
    }
  }
  const order = orders.find((o) => o.id === id);
  if (!order) return null;
  order.status = status;
  order.updatedAt = new Date().toISOString();
  return order;
}
