interface PriceTagProps {
  price: number;
  originalPrice?: number;
  isOnSale?: boolean;
}

export default function PriceTag({ price, originalPrice, isOnSale }: PriceTagProps) {
  const discountPercentage = originalPrice && isOnSale
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="flex items-center gap-2">
      <span className="text-lg font-bold text-gray-900">${price.toFixed(2)}</span>
      {isOnSale && originalPrice && (
        <>
          <span className="text-sm text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
          <span className="text-xs font-semibold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
            -{discountPercentage}%
          </span>
        </>
      )}
    </div>
  );
}
