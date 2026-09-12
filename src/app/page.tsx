import Link from 'next/link';
import HeroSection from '@/components/product/HeroSection';
import ProductGrid from '@/components/product/ProductGrid';
import FlashSale from '@/components/product/FlashSale';
import BestSellers from '@/components/product/BestSellers';
import DiscountedProducts from '@/components/product/DiscountedProducts';
import NewArrivals from '@/components/product/NewArrivals';
import { getAllCategories, getFeaturedProducts, getNewProducts, getSaleProducts, getAllProducts } from '@/lib/db';
import { ArrowRight } from 'lucide-react';

export default async function Home() {
  const [featured, newArrivals, saleProducts, categories, allProductsData] = await Promise.all([
    getFeaturedProducts(),
    getNewProducts(),
    getSaleProducts(),
    getAllCategories(),
    getAllProducts({ query: '', category: '', minPrice: 0, maxPrice: 999999, sortBy: 'newest', page: 1, limit: 50 }),
  ]);

  const allProducts = allProductsData.data;

  return (
    <div>
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {saleProducts.length > 0 && (
          <FlashSale products={saleProducts} />
        )}

        {featured.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
              <Link
                href="/products"
                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <ProductGrid products={featured} />
          </section>
        )}

        <BestSellers products={allProducts} />

        <NewArrivals products={newArrivals} />

        <DiscountedProducts products={allProducts} />

        {categories.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
              <Link
                href="/categories"
                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                    <span className="text-4xl font-bold text-blue-200 group-hover:text-blue-300 transition-colors">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{category.description}</p>
                    <span className="text-xs font-medium text-blue-600">
                      {category.productCount} products
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
