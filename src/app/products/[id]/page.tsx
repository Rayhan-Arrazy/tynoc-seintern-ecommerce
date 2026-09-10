import { notFound } from 'next/navigation';
import ProductDetails from '@/components/product/ProductDetails';
import RelatedProducts from '@/components/product/RelatedProducts';
import { getProductById, getProductsByCategory } from '@/lib/db/store';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getProductsByCategory(product.categoryId);
  const filteredRelated = relatedProducts.filter((p) => p.id !== product.id);

  return (
    <div>
      <ProductDetails product={product} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <RelatedProducts products={filteredRelated} />
      </div>
    </div>
  );
}
