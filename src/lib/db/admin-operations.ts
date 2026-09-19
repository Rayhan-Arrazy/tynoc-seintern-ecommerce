import { supabase } from "@/lib/db/supabase";

export async function getDashboardStats(): Promise<{
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalUsers: number;
  totalCartItems: number;
  totalWishlistItems: number;
  revenue: number;
  recentOrders: Array<{ id: string; userId: string; total: number; status: string; createdAt: string }>;
}> {
  const [products, categories, orders, users, cart, wishlist] = await Promise.all([
    (supabase as any).from("products").select("id", { count: "exact", head: true }),
    (supabase as any).from("categories").select("id", { count: "exact", head: true }),
    (supabase as any).from("orders").select("*").order("created_at", { ascending: false }),
    (supabase as any).from("users").select("id", { count: "exact", head: true }),
    (supabase as any).from("cart").select("id", { count: "exact", head: true }),
    (supabase as any).from("wishlist").select("id", { count: "exact", head: true }),
  ]);

  const allOrders = orders.data || [];
  const revenue = allOrders.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0);

  const recentOrders = allOrders.slice(0, 5).map((o: any) => ({
    id: o.id,
    userId: o.userid,
    total: Number(o.total),
    status: o.status,
    createdAt: o.created_at,
  }));

  return {
    totalProducts: products.count ?? (products.data?.length ?? 0),
    totalCategories: categories.count ?? (categories.data?.length ?? 0),
    totalOrders: orders.data?.length ?? 0,
    totalUsers: users.count ?? (users.data?.length ?? 0),
    totalCartItems: cart.count ?? (cart.data?.length ?? 0),
    totalWishlistItems: wishlist.count ?? (wishlist.data?.length ?? 0),
    revenue: Math.round(revenue * 100) / 100,
    recentOrders,
  };
}
