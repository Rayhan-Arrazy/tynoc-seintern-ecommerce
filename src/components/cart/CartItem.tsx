'use client';

import Link from 'next/link';
import Image from 'next/image';
import { X, Minus, Plus } from 'lucide-react';
import { CartItem as CartItemType } from '@/types';
import { formatPrice, getImageUrl } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity, productId } = item;
  const lineTotal = product.price * quantity;

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border border-gray-200">
      {/* Product Image */}
      <Link href={`/products/${product.id}`} className="shrink-0">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={getImageUrl(product.images[0] || product.id)}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 96px, 128px"
          />
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${product.id}`}
          className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
        >
          {product.name}
        </Link>
        <p className="text-sm text-gray-500 mt-1">
          {product.category?.name}
        </p>
        <p className="text-blue-600 font-medium mt-1">
          {formatPrice(product.price)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(productId, quantity - 1)}
          disabled={quantity <= 1}
          className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-10 text-center text-sm font-medium text-gray-900">
          {quantity}
        </span>
        <button
          onClick={() => updateQuantity(productId, quantity + 1)}
          disabled={quantity >= product.stock}
          className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Line Total & Remove */}
      <div className="flex sm:flex-col items-end sm:items-end justify-between sm:justify-end gap-2">
        <p className="text-lg font-semibold text-gray-900">
          {formatPrice(lineTotal)}
        </p>
        <button
          onClick={() => removeItem(productId)}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
          aria-label={`Remove ${product.name} from cart`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
