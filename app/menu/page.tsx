import { Metadata } from 'next';
import { getCategories, getProducts } from '@/lib/supabase/data';
import { MenuClient } from '@/components/menu/MenuClient';

export const metadata: Metadata = {
  title: 'Food Menu | Himalayan Cloud Kitchen Kathmandu',
  description:
    'Explore our mouthwatering menu of steamed chicken momos, buff jhol momo, wok chowmein, spicy thukpa, and charcoal sekuwa. Fast online delivery across Kathmandu & Lalitpur.',
};

export default async function MenuPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <div className="min-h-screen bg-stone-100/50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-wider text-orange-600 block">
            Cloud Kitchen Menu
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Order Fresh Himalayan Delights
          </h1>
          <p className="text-stone-600 text-sm sm:text-base max-w-2xl">
            All our food is prepared freshly upon order using authentic Himalayan spices, high-grade meats, and garden veggies.
          </p>
        </div>

        {/* Menu Interactive Component */}
        <MenuClient initialProducts={products} categories={categories} />
      </div>
    </div>
  );
}
