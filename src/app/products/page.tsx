'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchFilters from '@/components/product/SearchFilters';
import ProductGrid from '@/components/product/ProductGrid';
import { Product, PaginatedResponse } from '@/types';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const currentPage = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        searchParams.forEach((value, key) => {
          params.set(key, value);
        });

        const res = await fetch(`/api/products?${params.toString()}`);
        const json = await res.json();
        const result: PaginatedResponse<Product> = json.data ?? { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
        setProducts(result.data);
        setTotalPages(result.totalPages);
        setTotal(result.total);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [searchParams]);

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
        <p className="text-gray-500">
          {loading ? 'Loading...' : `${total} products found`}
        </p>
      </div>

      <SearchFilters />

      <ProductGrid products={products} loading={loading} emptyMessage="No products match your filters." />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
