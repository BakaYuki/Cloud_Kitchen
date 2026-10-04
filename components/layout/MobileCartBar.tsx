'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart/cart-context';
import { formatNPR } from '@/lib/utils';

export function MobileCartBar() {
  const pathname = usePathname();
  const { items, itemCount, subtotal } = useCart();

  // Hide on pages where cart is already central or admin
  if (
    pathname.startsWith('/admin') ||
    pathname === '/cart' ||
    pathname === '/checkout' ||
    pathname.startsWith('/order/')
  ) {
    return null;
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 md:hidden pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <Link
          href="/cart"
          className="flex items-center justify-between px-5 py-3.5 bg-orange-600 hover:bg-orange-700 active:scale-[0.98] text-white rounded-2xl shadow-xl shadow-orange-600/30 transition-all font-bold group"
        >
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
              <ShoppingBag className="w-4 h-4 text-white" />
              <span className="absolute -top-1 -right-1 bg-stone-900 text-[10px] text-white px-1.5 py-0.2 rounded-full font-bold">
                {itemCount}
              </span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs text-orange-100 font-medium">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
              <span className="text-sm font-extrabold">{formatNPR(subtotal)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-sm font-bold bg-white/20 px-3 py-1.5 rounded-xl group-hover:bg-white/30 transition-colors">
            <span>View Cart</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
}
