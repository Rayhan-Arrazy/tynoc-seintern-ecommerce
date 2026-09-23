'use client';

import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import type { Product } from '@/types';
import { getImageUrl, formatPrice } from '@/lib/utils';
import Rating from '@/components/ui/Rating';
import SafeImage from '@/components/ui/SafeImage';

interface NewArrivalsProps {
  products: Product[];
}

export default function NewArrivals({ products }: NewArrivalsProps) {
  if (products.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
        </div>
        <Link
          href="/products?sortBy=newest"
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
          >
            <div className="relative aspect-square bg-gray-50 overflow-hidden">
              <SafeImage
                src={getImageUrl(product.images?.[0] || product.id)}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 left-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">
                NEW
              </span>
            </div>
            <div className="p-3">
              <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">
                {product.category.name}
              </span>
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mt-1 mb-2">
                {product.name}
              </h3>
              <Rating rating={product.rating} reviewCount={product.reviewCount} />
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-gray-900">{formatPrice(product.price)}</span>
                {product.originalPrice > product.price && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
