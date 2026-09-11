import Link from 'next/link';
import { getAllCategories } from '@/lib/db';

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories</h1>
        <p className="text-gray-500">Browse our collection by category</p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500">No categories available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-56 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <span className="text-6xl font-bold text-blue-200 group-hover:text-blue-300 transition-colors">
                  {category.name.charAt(0)}
                </span>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                  {category.name}
                </h2>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{category.description}</p>
                <span className="text-sm font-medium text-blue-600">
                  {category.productCount} products
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
