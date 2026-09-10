'use client';

import Link from 'next/link';
import { ShoppingCart, ArrowRight, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

export default function CartPage() {
  const { state, getSubtotal, getItemCount } = useCart();
  const { items, loading, error } = state;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="mt-3 text-gray-500">Loading cart...</p>
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

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Your cart is empty</h2>
          <p className="mt-2 text-gray-500">
            Looks like you haven&apos;t added any items to your cart yet.
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

  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart className="w-8 h-8 text-gray-900" />
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <span className="text-sm text-gray-500 mt-1">
          ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <CartSummary subtotal={subtotal} />
        </div>
      </div>
    </div>
  );
}
