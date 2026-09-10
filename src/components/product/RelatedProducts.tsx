import { Product } from '@/types';
import ProductCard from '@/components/ui/ProductCard';

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const visible = products.slice(0, 4);

  if (visible.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
      <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible md:pb-0">
        {visible.map((product) => (
          <div key={product.id} className="min-w-[260px] sm:min-w-[280px] snap-start md:min-w-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
