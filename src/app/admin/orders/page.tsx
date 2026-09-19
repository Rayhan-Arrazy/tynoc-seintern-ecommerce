'use client';

import React, { useState, useEffect } from 'react';
import type { Order, OrderStatus } from '@/types';

const STATUS_OPTIONS: OrderStatus[] = [
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
];

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const json = await res.json();
      if (json.success && json.data) {
        setOrders(json.data);
      }
    } catch { /* empty */ }
    setLoading(false);
  }

  async function handleStatusChange(orderId: string, newStatus: string) {
    setUpdatingStatus(orderId);
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as OrderStatus } : o))
      );
    } catch { /* empty */ }
    setUpdatingStatus(null);
  }

  const filtered = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchName = o.shippingAddress?.fullName?.toLowerCase().includes(q);
      if (!matchId && !matchName) return false;
    }
    return true;
  });

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  const statusCounts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
        <span className="text-sm text-gray-500">{orders.length} total orders</span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${statusFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          All ({orders.length})
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${statusFilter === s ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)} ({statusCounts[s] || 0})
          </button>
        ))}
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by order ID or customer name..."
        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Order ID</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Customer</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Date</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-600">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleExpand(order.id)}>
                      <td className="px-5 py-3 font-mono text-xs text-gray-700">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-5 py-3 text-gray-900">
                        {order.shippingAddress?.fullName || '—'}
                      </td>
                      <td className="px-5 py-3 text-gray-600 text-xs">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                        {updatingStatus === order.id ? (
                          <span className="text-xs text-gray-500">Updating...</span>
                        ) : (
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-700'}`}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-gray-900">
                        ${order.total.toFixed(2)}
                      </td>
                    </tr>
                    {expandedId === order.id && (
                      <tr>
                        <td colSpan={5} className="px-5 py-4 bg-gray-50">
                          <div className="space-y-3">
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Phone: {order.shippingAddress?.phone || '—'}</span>
                              <span>Payment: {order.paymentMethod?.cardholderName ? `Card ending ${order.paymentMethod.cardNumber.slice(-4)}` : '—'}</span>
                            </div>
                            {order.shippingAddress && (
                              <p className="text-xs text-gray-500">
                                Address: {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                              </p>
                            )}
                            <p className="text-xs font-medium text-gray-500 uppercase">Order Items</p>
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center justify-between text-sm">
                                <span className="text-gray-700">{item.product.name} × {item.quantity}</span>
                                <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                            <div className="border-t border-gray-200 pt-2 mt-2 text-sm">
                              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
                              <div className="flex justify-between text-gray-600"><span>Shipping</span><span>${order.shipping.toFixed(2)}</span></div>
                              <div className="flex justify-between text-gray-600"><span>Tax</span><span>${order.tax.toFixed(2)}</span></div>
                              <div className="flex justify-between font-semibold text-gray-900 mt-1"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

