'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { getImageUrl } from '@/lib/utils';
import Rating from './Rating';
import PriceTag from './PriceTag';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem: addToCart } = useCart();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();

  const inWishlist = isInWishlist(product.id);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addToCart(product);
  }

  function handleToggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={getImageUrl(product.images[0])}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.isOnSale && (
              <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                Sale
              </span>
            )}
            {product.isNew && (
              <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                New
              </span>
            )}
          </div>

          <button
            onClick={handleToggleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
              inWishlist
                ? 'bg-red-500 text-white'
                : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-red-500'
            }`}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="p-4">
          <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">
            {product.category.name}
          </span>

          <h3 className="text-gray-900 font-medium mt-1 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          <div className="mb-3">
            <Rating rating={product.rating} reviewCount={product.reviewCount} />
          </div>

          <PriceTag
            price={product.price}
            originalPrice={product.originalPrice}
            isOnSale={product.isOnSale}
          />

          <button
            onClick={handleAddToCart}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
