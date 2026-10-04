'use client';

import React, { useState, useMemo } from 'react';
import { Product, Category } from '@/types';
import { ProductCard } from '@/components/menu/ProductCard';
import { ProductDetailModal } from '@/components/menu/ProductDetailModal';
import { CategoryFilter } from '@/components/menu/CategoryFilter';
import { SearchBar } from '@/components/menu/SearchBar';
import { UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MenuClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export function MenuClient({ initialProducts, categories }: MenuClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category_id === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.category?.name &&
          product.category.name.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [initialProducts, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search and Category Filter Controls */}
      <div className="bg-stone-50/80 p-4 sm:p-6 rounded-3xl border border-stone-200/80 space-y-4">
        <div className="max-w-md">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-semibold text-stone-600">
          Showing {filteredProducts.length}{' '}
          {filteredProducts.length === 1 ? 'delicious item' : 'delicious items'}
        </span>
        {(selectedCategory !== 'all' || searchQuery !== '') && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 underline cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetails={(p) => setActiveProduct(p)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 mx-auto rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
            <UtensilsCrossed className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-stone-900">No food items found</h3>
          <p className="text-sm text-stone-500">
            We couldn&apos;t find anything matching your search. Try another keyword or browse our full menu!
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="rounded-xl font-bold"
          >
            View All Dishes
          </Button>
        </div>
      )}

      {/* Modal for detail view */}
      <ProductDetailModal
        product={activeProduct}
        isOpen={!!activeProduct}
        onClose={() => setActiveProduct(null)}
      />
    </div>
  );
}
