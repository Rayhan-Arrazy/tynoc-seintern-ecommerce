'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Percent, ArrowRight } from 'lucide-react';
import type { Product } from '@/types';
import { getImageUrl, formatPrice, calculateDiscount } from '@/lib/utils';

interface DiscountedProductsProps {
  products: Product[];
}

export default function DiscountedProducts({ products }: DiscountedProductsProps) {
  const discounted = products.filter((p) => p.originalPrice > p.price);

  if (discounted.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <Percent className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Great Deals</h2>
        </div>
        <Link
          href="/products"
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {discounted.map((product) => {
          const discount = calculateDiscount(product.originalPrice, product.price);
          return (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              <div className="relative aspect-square bg-gray-50 overflow-hidden">
                <Image
                  src={getImageUrl(product.images[0])}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                  -{discount}% OFF
                </span>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">{formatPrice(product.price)}</span>
                  <span className="text-gray-400 text-sm line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
