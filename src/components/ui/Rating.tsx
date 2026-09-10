import { Star, StarHalf } from 'lucide-react';

interface RatingProps {
  rating: number;
  reviewCount: number;
}

export default function Rating({ rating, reviewCount }: RatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
      </div>
      <span className="text-sm text-gray-500 ml-1">
        ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
      </span>
    </div>
  );
}
