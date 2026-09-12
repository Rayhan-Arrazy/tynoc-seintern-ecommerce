'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Loader2, ArrowRight, ShoppingBag } from 'lucide-react';
import type { Order, OrderStatus } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  const router = useRouter();
  const { state: authState } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authState.loading) return;

    if (!authState.user) {
      router.push('/auth/login');
      return;
    }

    let cancelled = false;

    async function loadOrders() {
      try {
        setLoading(true);
        const res = await fetch(`/api/orders?userId=${authState.user!.id}`);
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        if (!cancelled) setOrders(data.data ?? []);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadOrders();

    return () => { cancelled = true; };
  }, [authState.user, authState.loading, router]);

  if (loading || authState.loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="mt-3 text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">No orders yet</h2>
          <p className="mt-2 text-gray-500">
            When you place an order, it will appear here.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Start Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Package className="w-8 h-8 text-gray-900" />
        <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="block bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6">
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>

                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[order.status]}`}
                >
                  {order.status}
                </span>

                <p className="text-lg font-semibold text-gray-900">
                  {formatPrice(order.total)}
                </p>

                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
