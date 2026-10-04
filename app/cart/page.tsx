'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart/cart-context';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { formatNPR } from '@/lib/utils';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck,
} from 'lucide-react';

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    deliveryFee,
    total,
    remainingForFreeDelivery,
    freeDeliveryThreshold,
    isLoaded,
  } = useCart();

  if (!isLoaded) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-stone-50/50">
        <div className="max-w-md w-full text-center bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-sm space-y-5">
          <div className="w-20 h-20 mx-auto rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-stone-900">Your cart is empty</h2>
            <p className="text-sm text-stone-500 leading-relaxed">
              Looks like you haven&apos;t added any delicious food yet. Check out our steaming hot momos, wok noodles, and snacks!
            </p>
          </div>
          <Link href="/menu" className="block pt-2">
            <Button className="w-full h-12 text-base font-bold shadow-md shadow-orange-600/20">
              Browse Menu
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50/60 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Review Your Cart
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              {items.length} {items.length === 1 ? 'item' : 'items'} in your basket
            </p>
          </div>

          <button
            onClick={clearCart}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items List (Left Column) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Delivery Banner */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-200/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div className="flex-1 text-xs sm:text-sm">
                {remainingForFreeDelivery > 0 ? (
                  <p className="text-stone-800">
                    Add <span className="font-bold text-orange-700">{formatNPR(remainingForFreeDelivery)}</span> more to qualify for <span className="font-bold text-emerald-700">FREE delivery</span>! (Min {formatNPR(freeDeliveryThreshold)})
                  </p>
                ) : (
                  <p className="text-emerald-800 font-bold flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Congratulations! You unlocked FREE Delivery across Kathmandu Valley!
                  </p>
                )}
              </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-3xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-xs">
              {items.map(({ product, quantity }) => {
                const itemTotal = product.price * quantity;
                return (
                  <div
                    key={product.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-stone-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-stone-100 shrink-0">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-300">
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-tight">
                          {product.name}
                        </h3>
                        <p className="text-xs text-stone-500 font-medium">
                          {formatNPR(product.price)} each
                        </p>
                      </div>
                    </div>

                    {/* Quantity controls and price */}
                    <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-stone-100">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white hover:text-stone-900 transition-all cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-bold text-stone-900 text-xs sm:text-sm">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white hover:text-stone-900 transition-all cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total */}
                      <div className="text-right min-w-[80px]">
                        <span className="text-sm sm:text-base font-extrabold text-stone-900 block">
                          {formatNPR(itemTotal)}
                        </span>
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-2">
              <Link
                href="/menu"
                className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1.5"
              >
                ← Add more dishes from menu
              </Link>
            </div>
          </div>

          {/* Order Summary Card (Right Column) */}
          <div className="lg:col-span-4">
            <Card className="rounded-3xl border-stone-200 shadow-md p-6 space-y-6 sticky top-24">
              <h2 className="text-lg font-black text-stone-900 pb-3 border-b border-stone-100">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">{formatNPR(subtotal)}</span>
                </div>

                <div className="flex justify-between text-stone-600 items-center">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-stone-900">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      formatNPR(deliveryFee)
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-stone-100 flex justify-between items-baseline">
                  <div>
                    <span className="text-base font-black text-stone-900 block">Grand Total</span>
                    <span className="text-[11px] text-stone-400">Inclusive of all local taxes</span>
                  </div>
                  <span className="text-2xl font-black text-orange-600">
                    {formatNPR(total)}
                  </span>
                </div>
              </div>

              <Link href="/checkout" className="block pt-2">
                <Button className="w-full h-13 text-base font-bold shadow-lg shadow-orange-600/25 flex items-center justify-center gap-2">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>

              <div className="flex items-center justify-center gap-2 text-xs text-stone-400 pt-2 border-t border-stone-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>No account required • Fast checkout</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
