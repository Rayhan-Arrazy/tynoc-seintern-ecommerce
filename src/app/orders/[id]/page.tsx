'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Loader2,
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Clock,
  CreditCardIcon,
  CheckCircle2,
} from 'lucide-react';
import type { Order, OrderStatus } from '@/types';
import { formatPrice, formatDate, getImageUrl } from '@/lib/utils';

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  useEffect(() => {
    if (order && order.status === 'pending' && !processingPayment && !paymentComplete) {
      setProcessingPayment(true);
      timerRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/orders/${order.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'confirmed' }),
          });
          if (res.ok) {
            setPaymentComplete(true);
            setOrder((prev) => prev ? { ...prev, status: 'confirmed' } : prev);
          }
        } catch {
          // silent fail - will show pending
        } finally {
          setProcessingPayment(false);
        }
      }, 5000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [order?.id, order?.status, processingPayment, paymentComplete]);

  async function fetchOrder() {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders/${params.id}`);
      if (!res.ok) {
        if (res.status === 404) {
          setOrder(null);
          return;
        }
        throw new Error('Failed to fetch order');
      }
      const data = await res.json();
      setOrder(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="mt-3 text-gray-500">Loading order details...</p>
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
            onClick={fetchOrder}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Order not found</h2>
          <p className="mt-2 text-gray-500">
            The order you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/orders"
            className="mt-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const maskedCard = `**** **** **** ${order.paymentMethod.cardNumber.slice(-4)}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/orders"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      {/* Order Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Placed on {formatDate(order.createdAt)}</span>
            </div>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColors[order.status]}`}
          >
            {order.status}
          </span>
        </div>
      </div>

      {/* Payment Processing Banner */}
      {processingPayment && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <CreditCardIcon className="w-6 h-6 text-blue-600" />
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin absolute inset-0" />
            </div>
            <div>
              <p className="font-medium text-blue-900">Processing payment...</p>
              <p className="text-sm text-blue-700">This may take a few seconds. Please do not close this page.</p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Complete Banner */}
      {paymentComplete && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Payment confirmed!</p>
              <p className="text-sm text-green-700">Your order is now being processed.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <Image
                      src={getImageUrl(item.product.images[0] || item.product.id)}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{item.product.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-sm text-gray-500">
                      {formatPrice(item.price)} each
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-medium text-gray-900">
                  {order.shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    formatPrice(order.shipping)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span className="font-medium text-gray-900">{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <span className="text-base font-semibold text-gray-900">Total</span>
                <span className="text-base font-semibold text-gray-900">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Shipping Address</h3>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p className="pt-1">{order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Payment Method</h3>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">{order.paymentMethod.cardholderName}</p>
              <p>{maskedCard}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
