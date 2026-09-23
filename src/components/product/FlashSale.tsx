'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Zap } from 'lucide-react';
import type { Product } from '@/types';
import { getImageUrl, formatPrice, calculateDiscount } from '@/lib/utils';

interface FlashSaleProps {
  products: Product[];
}

function getTimeLeft(endTime: Date) {
  const diff = endTime.getTime() - Date.now();
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
  return {
    hours: Math.floor(diff / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export default function FlashSale({ products }: FlashSaleProps) {
  const [endTime] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 24);
    return d;
  });

  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(endTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(endTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  if (products.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Flash Sale</h2>
              <p className="text-white/80 text-sm">Limited time offers</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/80 text-sm mr-2">Ends in</span>
            <span className="bg-white/20 text-white font-mono font-bold text-lg px-3 py-1 rounded-lg">
              {pad(timeLeft.hours)}
            </span>
            <span className="text-white font-bold">:</span>
            <span className="bg-white/20 text-white font-mono font-bold text-lg px-3 py-1 rounded-lg">
              {pad(timeLeft.minutes)}
            </span>
            <span className="text-white font-bold">:</span>
            <span className="bg-white/20 text-white font-mono font-bold text-lg px-3 py-1 rounded-lg">
              {pad(timeLeft.seconds)}
            </span>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {products.map((product) => {
            const discount = calculateDiscount(product.originalPrice, product.price);
            return (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="flex-shrink-0 w-56 bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <Image
                    src={getImageUrl(product.images?.[0] || product.id)}
                    alt={product.name}
                    fill
                    sizes="224px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    -{discount}%
                  </span>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 font-bold">{formatPrice(product.price)}</span>
                    <span className="text-gray-400 text-sm line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
