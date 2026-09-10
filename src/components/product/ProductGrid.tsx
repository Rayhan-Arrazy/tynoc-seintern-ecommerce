import { Product } from '@/types';
import ProductCard from '@/components/ui/ProductCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  emptyMessage?: string;
}

export default function ProductGrid({ products, loading, emptyMessage }: ProductGridProps) {
  if (loading) {
    return <LoadingSpinner className="py-20" />;
  }

  if (!products || products.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
