'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatNPR } from '@/lib/utils';
import { useCart } from '@/lib/cart/cart-context';
import { Plus, Check, Utensils } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export function ProductCard({ product, onOpenDetails }: ProductCardProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.is_available) return;

    addItem(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1000);
  };

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="group relative flex flex-col bg-white rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md hover:border-orange-200 transition-all duration-200 overflow-hidden cursor-pointer h-full"
    >
      {/* Product Image */}
      <div className="relative w-full aspect-4/3 bg-stone-100 overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
              !product.is_available ? 'grayscale opacity-75' : ''
            }`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300">
            <Utensils className="w-10 h-10" />
          </div>
        )}

        {/* Unavailable overlay badge */}
        {!product.is_available && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center p-3 text-center">
            <span className="px-3 py-1.5 bg-rose-600/95 text-white font-bold rounded-xl text-xs shadow-md">
              Currently unavailable
            </span>
          </div>
        )}

        {/* Featured Tag */}
        {product.is_featured && product.is_available && (
          <div className="absolute top-3 left-3">
            <Badge variant="warning" className="shadow-md font-bold text-[11px]">
              Popular
            </Badge>
          </div>
        )}

        {/* Category Pill */}
        {product.category && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/90 backdrop-blur-xs text-stone-800 shadow-xs">
              {product.category.name}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <div className="flex-1">
          <h3 className="font-extrabold text-base sm:text-lg text-stone-900 group-hover:text-orange-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 line-clamp-2 mt-1.5 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Bottom row: Price & Action */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">
          <div>
            <span className="text-xs text-stone-600 block">Price</span>
            <span className="text-base sm:text-lg font-black text-stone-900">
              {formatNPR(product.price)}
            </span>
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            {product.is_available ? (
              <Button
                size="sm"
                variant={justAdded ? 'success' : 'primary'}
                onClick={handleQuickAdd}
                className="rounded-xl px-3.5 h-9 font-bold shadow-xs active:scale-95"
                aria-label={`Add ${product.name} to cart`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </>
                )}
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                disabled
                className="rounded-xl px-3 h-9 text-xs opacity-60 cursor-not-allowed"
              >
                Unavailable
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
