'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp } from 'lucide-react';
import type { Product } from '@/types';
import { getImageUrl, formatPrice } from '@/lib/utils';
import Rating from '@/components/ui/Rating';

interface BestSellersProps {
  products: Product[];
}

export default function BestSellers({ products }: BestSellersProps) {
  const categoriesMap = new Map<string, { name: string; products: Product[] }>();

  for (const product of products) {
    const catId = product.categoryId;
    if (!categoriesMap.has(catId)) {
      categoriesMap.set(catId, { name: product.category.name, products: [] });
    }
    categoriesMap.get(catId)!.products.push(product);
  }

  const categories = Array.from(categoriesMap.entries()).map(([id, data]) => ({
    id,
    name: data.name,
    products: data.products
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 10),
  }));

  const [activeTab, setActiveTab] = useState(categories[0]?.id ?? '');

  const activeCategory = categories.find((c) => c.id === activeTab);

  if (categories.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Best Sellers by Category</h2>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === cat.id
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {activeCategory && (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {activeCategory.products.map((product, index) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="flex-shrink-0 w-48 bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              <div className="relative aspect-square bg-gray-50 overflow-hidden">
                <Image
                  src={getImageUrl(product.images[0])}
                  alt={product.name}
                  fill
                  sizes="192px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  {index + 1}
                </span>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                  {product.name}
                </h3>
                <Rating rating={product.rating} reviewCount={product.reviewCount} />
                <p className="text-sm font-bold text-gray-900 mt-1">{formatPrice(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
