import { getAllProducts, getOrders } from "@/lib/db";

export async function getDashboardStats(): Promise<{
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  revenue: number;
}> {
  const [productsResult, orders] = await Promise.all([
    getAllProducts({ query: "", category: "", minPrice: 0, maxPrice: Infinity, sortBy: "newest", page: 1, limit: 1000 }),
    getOrders("user-1"),
  ]);

  const revenue = orders.reduce((sum, order) => sum + order.total, 0);

  return {
    totalProducts: productsResult.total,
    totalOrders: orders.length,
    totalUsers: 1,
    revenue: Math.round(revenue * 100) / 100,
  };
}
