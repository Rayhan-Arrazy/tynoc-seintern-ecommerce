import { notFound } from 'next/navigation';
import ProductGrid from '@/components/product/ProductGrid';
import { getCategoryBySlug, getProductsByCategory } from '@/lib/db';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(category.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center mb-6">
          <span className="text-6xl font-bold text-blue-200">
            {category.name.charAt(0)}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{category.name}</h1>
        <p className="text-gray-500 max-w-2xl">{category.description}</p>
        <p className="text-sm text-gray-400 mt-2">{products.length} products</p>
      </div>

      <ProductGrid products={products} emptyMessage="No products in this category." />
    </div>
  );
}
