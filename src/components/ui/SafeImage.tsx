'use client';

import Image from 'next/image';
import { ImageOff } from 'lucide-react';

interface SafeImageProps {
  src?: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
}

export default function SafeImage({ src, alt, fill, sizes, className, priority }: SafeImageProps) {
  if (!src) {
    if (fill) {
      return (
        <div className={`absolute inset-0 flex items-center justify-center bg-gray-100 ${className ?? ''}`} aria-label={alt}>
          <ImageOff className="w-8 h-8 text-gray-300" />
        </div>
      );
    }
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className ?? ''}`} aria-label={alt}>
        <ImageOff className="w-8 h-8 text-gray-300" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={className}
      priority={priority}
    />
  );
}
