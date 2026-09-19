'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalUsers: number;
  totalCartItems: number;
  totalWishlistItems: number;
  revenue: number;
  recentOrders: Array<{ id: string; userId: string; total: number; status: string; createdAt: string }>;
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((j) => { if (j.success) setStats(j.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-sm text-gray-500">Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className="p-8 text-center text-sm text-red-500">Failed to load dashboard stats.</div>;
  }

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, icon: '📦', href: '/admin/products', color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Categories', value: stats.totalCategories, icon: '🏷️', href: '/admin/categories', color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Orders', value: stats.totalOrders, icon: '🛒', href: '/admin/orders', color: 'bg-green-50 text-green-600' },
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', href: '/admin/users', color: 'bg-amber-50 text-amber-600' },
    { label: 'Cart Items', value: stats.totalCartItems, icon: '🛍️', href: '/admin/cart', color: 'bg-pink-50 text-pink-600' },
    { label: 'Wishlist Items', value: stats.totalWishlistItems, icon: '💝', href: '/admin/cart', color: 'bg-rose-50 text-rose-600' },
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <span className={`text-2xl p-2 rounded-lg ${card.color}`}>{card.icon}</span>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue</h3>
            <span className="text-3xl font-bold text-green-600">${stats.revenue.toFixed(2)}</span>
          </div>
          <p className="text-sm text-gray-500">Total revenue from all orders</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.recentOrders.length === 0 ? (
              <p className="px-5 py-8 text-sm text-gray-500 text-center">No orders yet.</p>
            ) : (
              stats.recentOrders.map((order) => (
                <div key={order.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-mono text-gray-700">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">${order.total.toFixed(2)}</p>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-700'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
