import { getAllProducts } from "@/lib/db";

export async function getDashboardStats(): Promise<{
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  revenue: number;
}> {
  const result = await getAllProducts({
    query: "",
    category: "",
    minPrice: 0,
    maxPrice: Infinity,
    sortBy: "newest",
    page: 1,
    limit: 1000,
  });
  return {
    totalProducts: result.total,
    totalOrders: 0,
    totalUsers: 0,
    revenue: 0,
  };
}
