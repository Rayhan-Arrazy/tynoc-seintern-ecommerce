'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Product, Category, PaginatedResponse } from '@/types';

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updatingStock, setUpdatingStock] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PER_PAGE = 15;

  useEffect(() => {
    fetchProducts();
    fetch('/api/categories')
      .then((r) => r.json())
      .then((j) => { if (j.success) setCategories(j.data); })
      .catch(() => {});
  }, []);

  async function fetchProducts(query = '', category = '', pg = 1) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('query', query);
      if (category) params.set('category', category);
      params.set('limit', '200');
      params.set('page', String(pg));
      const res = await fetch(`/api/products?${params.toString()}`);
      const json = await res.json();
      const result: PaginatedResponse<Product> = json.data ?? {
        data: [], total: 0, page: 1, limit: 10, totalPages: 0,
      };
      setProducts(result.data);
      setTotalPages(result.totalPages || 1);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchProducts(searchQuery, categoryFilter, 1);
  }

  function handleCategoryFilter(catId: string) {
    setCategoryFilter(catId);
    setPage(1);
    fetchProducts(searchQuery, catId, 1);
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setDeleting(id);
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert('Failed to delete product');
    } finally {
      setDeleting(null);
    }
  }

  async function handleStockUpdate(id: string, newStock: number) {
    setUpdatingStock(id);
    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock }),
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p))
      );
    } catch {
      alert('Failed to update stock');
    } finally {
      setUpdatingStock(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Product
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={categoryFilter}
          onChange={(e) => handleCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
        <button type="submit" className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
          Search
        </button>
      </form>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">Loading...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Product</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Category</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Price</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Stock</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Badges</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          {product.images[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                          )}
                        </div>
                        <span className="font-medium text-gray-900 truncate max-w-[200px]">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{product.category?.name || '—'}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">${product.price.toFixed(2)}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {updatingStock === product.id ? (
                        <span className="text-xs text-gray-500">Saving...</span>
                      ) : (
                        <input
                          type="number"
                          min={0}
                          value={product.stock}
                          onChange={(e) => handleStockUpdate(product.id, Number(e.target.value))}
                          className={`w-20 px-2 py-1 border rounded text-sm font-medium ${
                            product.stock > 10
                              ? 'border-green-200 bg-green-50 text-green-700'
                              : product.stock > 0
                              ? 'border-yellow-200 bg-yellow-50 text-yellow-700'
                              : 'border-red-200 bg-red-50 text-red-700'
                          }`}
                        />
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {product.isFeatured && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">Featured</span>}
                        {product.isNew && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">New</span>}
                        {product.isOnSale && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">Sale</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => router.push(`/admin/products/edit/${product.id}`)} className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(product.id)} disabled={deleting === product.id} className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                          {deleting === product.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => { setPage((p) => Math.max(1, p - 1)); fetchProducts(searchQuery, categoryFilter, Math.max(1, page - 1)); }}
            disabled={page <= 1}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
          <button
            onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); fetchProducts(searchQuery, categoryFilter, Math.min(totalPages, page + 1)); }}
            disabled={page >= totalPages}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
