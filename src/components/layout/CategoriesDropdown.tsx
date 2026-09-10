'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

interface CategoriesDropdownProps {
  onClose: () => void;
}

export default function CategoriesDropdown({ onClose }: CategoriesDropdownProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div className="absolute top-full left-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No categories found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                onClick={onClose}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </span>
                  {category.description && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{category.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 p-3">
        <Link
          href="/categories"
          onClick={onClose}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View all categories →
        </Link>
      </div>
    </div>
  );
}
