'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/product/ProductGrid';
import { Product } from '@/types';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      return;
    }

    let cancelled = false;

    async function fetchResults() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?query=${encodeURIComponent(query)}`);
        const json = await res.json();
        if (!cancelled) {
          setProducts(json.data?.data ?? []);
        }
      } catch {
        if (!cancelled) {
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchResults();
    return () => { cancelled = true; };
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {query ? (
            <>Search results for &ldquo;{query}&rdquo;</>
          ) : (
            'Search'
          )}
        </h1>
        {!loading && query && (
          <p className="text-gray-500">
            {products.length} {products.length === 1 ? 'result' : 'results'} found
          </p>
        )}
      </div>

      {!query && !loading ? (
        <div className="text-center py-20">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-1">Enter a search term</p>
          <p className="text-sm text-gray-400">Use the search bar above to find products</p>
        </div>
      ) : (
        <ProductGrid
          products={products}
          loading={loading}
          emptyMessage={`No results found for "${query}". Try different keywords.`}
        />
      )}
    </div>
  );
}
