'use client';

import { Loader2, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, getImageUrl } from '@/lib/utils';
import SafeImage from '@/components/ui/SafeImage';

interface OrderSummaryProps {
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function OrderSummary({ onSubmit, isSubmitting }: OrderSummaryProps) {
  const { state, getSubtotal } = useCart();
  const { items } = state;

  const subtotal = getSubtotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

      <div className="max-h-64 overflow-y-auto space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
              <SafeImage
                src={getImageUrl(item.product.images[0] || item.product.id)}
                alt={item.product.name}
                fill
                className="object-cover"
                sizes="56px"
              />
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.product.name}</p>
              <p className="text-sm text-gray-500">{formatPrice(item.product.price * item.quantity)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span className="font-medium text-gray-900">
            {shipping === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Tax (8%)</span>
          <span className="font-medium text-gray-900">{formatPrice(tax)}</span>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between">
            <span className="text-base font-semibold text-gray-900">Total</span>
            <span className="text-base font-semibold text-gray-900">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <ShieldCheck className="w-5 h-5" />
            Place Order
          </>
        )}
      </button>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Secure checkout powered by Tynoc</span>
      </div>
    </div>
  );
}
