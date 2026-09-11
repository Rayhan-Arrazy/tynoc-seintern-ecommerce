import { getDashboardStats } from '@/lib/db/admin-operations';
import { getAllProducts } from '@/lib/db';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const [stats, productsResult] = await Promise.all([
    getDashboardStats(),
    getAllProducts({ query: '', category: '', minPrice: 0, maxPrice: Infinity, sortBy: 'newest', page: 1, limit: 5 }),
  ]);

  const recentProducts = productsResult.data;

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: '📦' },
    { label: 'Total Orders', value: stats.totalOrders, icon: '🛒' },
    { label: 'Total Users', value: stats.totalUsers, icon: '👥' },
    { label: 'Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: '💰' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{card.icon}</span>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Recent Products</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {recentProducts.length === 0 && (
            <p className="px-5 py-8 text-sm text-gray-500 text-center">
              No products yet.
            </p>
          )}
          {recentProducts.map((product) => (
            <div key={product.id} className="px-5 py-3 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                {product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No img
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {product.name}
                </p>
                <p className="text-xs text-gray-500">
                  {product.category.name || 'Uncategorized'}
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                ${product.price.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
