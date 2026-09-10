'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, ArrowRight, Loader2, X } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { formatPrice, getImageUrl } from '@/lib/utils';

export default function WishlistPage() {
  const { state, removeItem } = useWishlist();
  const { addItem } = useCart();
  const { items, loading, error } = state;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="mt-3 text-gray-500">Loading wishlist...</p>
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
          <Heart className="w-16 h-16 text-gray-300 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Your wishlist is empty</h2>
          <p className="mt-2 text-gray-500">
            Save items you love to your wishlist and come back to them anytime.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Browse Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-8 h-8 text-gray-900" />
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        <span className="text-sm text-gray-500 mt-1">
          ({items.length} {items.length === 1 ? 'item' : 'items'})
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => {
          const { product } = item;
          return (
            <div
              key={item.id}
              className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Product Image */}
              <Link href={`/products/${product.id}`} className="block relative aspect-square bg-gray-100">
                <Image
                  src={getImageUrl(product.images[0] || product.id)}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {product.isOnSale && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                    Sale
                  </span>
                )}
              </Link>

              {/* Product Info */}
              <div className="p-4">
                <Link
                  href={`/products/${product.id}`}
                  className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                >
                  {product.name}
                </Link>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-blue-600 font-semibold">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => addItem(product)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label={`Remove ${product.name} from wishlist`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
