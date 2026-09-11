'use client';

import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface CartSummaryProps {
  subtotal: number;
}

export default function CartSummary({ subtotal }: CartSummaryProps) {
  const shipping = subtotal > 50 ? 0 : 9.99;
  const taxEstimate = subtotal * 0.08;
  const total = subtotal + shipping + taxEstimate;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

      <div className="space-y-3 text-sm">
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
          <span>Tax (est.)</span>
          <span className="font-medium text-gray-900">{formatPrice(taxEstimate)}</span>
        </div>

        {shipping > 0 && (
          <p className="text-xs text-green-600 bg-green-50 rounded-md px-3 py-2">
            Add {formatPrice(50 - subtotal)} more for free shipping
          </p>
        )}

        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between">
            <span className="text-base font-semibold text-gray-900">Total</span>
            <span className="text-base font-semibold text-gray-900">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <Link
        href="/checkout"
        className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        <ShoppingBag className="w-5 h-5" />
        Checkout
      </Link>

      <Link
        href="/products"
        className="w-full mt-3 flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 py-3 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors"
      >
        Continue Shopping
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
