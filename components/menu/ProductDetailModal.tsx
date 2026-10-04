'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatNPR } from '@/lib/utils';
import { useCart } from '@/lib/cart/cart-context';
import { Plus, Minus, Check, Clock, Utensils } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailModal({
  product,
  isOpen,
  onClose,
}: ProductDetailModalProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setAdded(false);
    }
  }, [isOpen, product]);

  if (!product) return null;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 800);
  };

  const totalPrice = product.price * quantity;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="lg">
      <div className="space-y-6">
        {/* Product Image */}
        <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-stone-100 shadow-inner">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 500px"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-400">
              <Utensils className="w-12 h-12" />
            </div>
          )}

          {/* Availability pill */}
          {!product.is_available && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
              <span className="px-4 py-2 bg-rose-600 text-white font-bold rounded-xl text-sm shadow-lg">
                Currently Unavailable
              </span>
            </div>
          )}

          {product.is_featured && product.is_available && (
            <div className="absolute top-3 left-3">
              <Badge variant="warning" className="shadow-md font-bold">
                Chef&apos;s Recommendation
              </Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-extrabold text-stone-900 leading-tight">
                {product.name}
              </h3>
              {product.category && (
                <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider block mt-1">
                  {product.category.name}
                </span>
              )}
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-orange-600 block">
                {formatNPR(product.price)}
              </span>
              <span className="text-xs text-stone-600">per portion</span>
            </div>
          </div>

          <p className="text-stone-600 text-sm leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-stone-600 pt-2 border-t border-stone-100">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>Prep time: 15-20 mins</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-orange-500" />
              <span>Freshly made to order</span>
            </div>
          </div>
        </div>

        {/* Quantity and Add to Cart Section */}
        {product.is_available ? (
          <div className="pt-4 border-t border-stone-100 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-stone-800">Select Quantity</span>
              <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white hover:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-stone-900 text-sm">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white hover:text-stone-900 transition-all"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleAddToCart}
              className="w-full h-12 text-base font-bold shadow-lg shadow-orange-600/20"
              variant={added ? 'success' : 'primary'}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5 mr-1" />
                  Added to Cart!
                </>
              ) : (
                <>Add to Cart • {formatNPR(totalPrice)}</>
              )}
            </Button>
          </div>
        ) : (
          <div className="pt-4 border-t border-stone-100">
            <Button disabled className="w-full h-12 text-sm font-bold" variant="outline">
              Currently Unavailable
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
