'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { ProductCard } from '@/components/menu/ProductCard';
import { ProductDetailModal } from '@/components/menu/ProductDetailModal';

interface HomeFeaturedProps {
  products: Product[];
}

export function HomeFeatured({ products }: HomeFeaturedProps) {
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onOpenDetails={(p) => setActiveProduct(p)}
          />
        ))}
      </div>

      <ProductDetailModal
        product={activeProduct}
        isOpen={!!activeProduct}
        onClose={() => setActiveProduct(null)}
      />
    </div>
  );
}
