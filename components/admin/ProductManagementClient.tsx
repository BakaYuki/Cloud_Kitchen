'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product, Category } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { formatNPR } from '@/lib/utils';
import { adminSaveProductAction, adminDeleteProductAction } from '@/app/actions/admin';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  Star,
  Utensils,
  Eye,
  EyeOff,
} from 'lucide-react';

interface ProductManagementClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export function ProductManagementClient({
  initialProducts,
  categories,
}: ProductManagementClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState('0');

  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setCategoryId(categories[0]?.id || '');
    setDescription('');
    setPrice('');
    setImageUrl('');
    setIsAvailable(true);
    setIsFeatured(false);
    setDisplayOrder('0');
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setCategoryId(product.category_id);
    setDescription(product.description);
    setPrice(String(product.price));
    setImageUrl(product.image_url || '');
    setIsAvailable(product.is_available);
    setIsFeatured(product.is_featured);
    setDisplayOrder(String(product.display_order));
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !categoryId || !description.trim() || !price) {
      alert('Please fill all required fields');
      return;
    }

    setIsSaving(true);
    try {
      const saved = await adminSaveProductAction({
        id: editingProduct?.id,
        name: name.trim(),
        category_id: categoryId,
        description: description.trim(),
        price: parseFloat(price),
        image_url: imageUrl.trim() || null,
        is_available: isAvailable,
        is_featured: isFeatured,
        display_order: parseInt(displayOrder) || 0,
      });

      if (editingProduct) {
        setProducts((prev) =>
          prev.map((p) => (p.id === saved.id ? { ...p, ...saved } : p))
        );
        showToast(`Updated "${saved.name}" successfully!`);
      } else {
        setProducts((prev) => [saved, ...prev]);
        showToast(`Created new dish "${saved.name}"!`);
      }

      setIsModalOpen(false);
      router.refresh();
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save product.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleAvailability = async (product: Product) => {
    try {
      const updated = await adminSaveProductAction({
        ...product,
        is_available: !product.is_available,
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
      );
      showToast(
        `"${product.name}" is now ${
          updated.is_available ? 'AVAILABLE' : 'UNAVAILABLE'
        }`
      );
      router.refresh();
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    try {
      const updated = await adminSaveProductAction({
        ...product,
        is_featured: !product.is_featured,
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
      );
      showToast(
        `"${product.name}" ${
          updated.is_featured ? 'marked as featured' : 'removed from featured'
        }`
      );
      router.refresh();
    } catch (err) {
      console.error('Featured toggle error:', err);
    }
  };

  const handleDeactivate = async (product: Product) => {
    if (confirm(`Deactivate "${product.name}" from the active menu?`)) {
      await adminDeleteProductAction(product.id);
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_available: false } : p))
      );
      showToast(`Deactivated "${product.name}".`);
      router.refresh();
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchTerm === '' ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      categoryFilter === 'all' || p.category_id === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-stone-900 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Menu Catalog &amp; Dishes
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Manage food dishes, prices, availability, and featured badges
          </p>
        </div>

        <Button onClick={openCreateModal} className="font-bold gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          <span>Add New Dish</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by dish name, spice..."
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter products by category"
            className="px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product List */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-600 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Dish</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Price</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Featured</th>
                <th className="px-5 py-3.5">Order</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((product) => {
                const cat = categories.find((c) => c.id === product.category_id);
                return (
                  <tr key={product.id} className="hover:bg-stone-50/60 transition-colors">
                    {/* Dish name & thumb */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                          {product.image_url ? (
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-400">
                              <Utensils className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-extrabold text-stone-900 block leading-tight">
                            {product.name}
                          </span>
                          <span className="text-[11px] text-stone-400 line-clamp-1">
                            {product.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-stone-600 font-medium">
                      {cat?.name || 'Unassigned'}
                    </td>

                    <td className="px-5 py-3.5 font-extrabold text-stone-900">
                      {formatNPR(product.price)}
                    </td>

                    {/* Availability toggle */}
                    <td className="px-5 py-3.5">
                      <button
                        type="button"
                        onClick={() => handleToggleAvailability(product)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                          product.is_available
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        {product.is_available ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Available</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Unavailable</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Featured toggle */}
                    <td className="px-5 py-3.5">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(product)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          product.is_featured
                            ? 'bg-amber-50 text-amber-600 border-amber-300'
                            : 'bg-stone-50 text-stone-400 border-stone-200 hover:text-stone-600'
                        }`}
                        title="Toggle Featured"
                      >
                        <Star className={`w-4 h-4 ${product.is_featured ? 'fill-current' : ''}`} />
                      </button>
                    </td>

                    <td className="px-5 py-3.5 text-stone-500 font-mono text-xs">
                      {product.display_order}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditModal(product)}
                          className="h-8 px-2.5 text-xs font-bold gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Button>
                        <button
                          type="button"
                          onClick={() => handleDeactivate(product)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Deactivate"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Create / Edit Product */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Dish Details' : 'Add New Food Dish'}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 uppercase">
              Dish Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Buff Jhol Momo"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 uppercase">
                Category *
              </label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:ring-2 focus:ring-orange-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 uppercase">
                Price (NPR) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="5"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 220"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 uppercase">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe ingredients, cooking style, portion size, and accompanied chutneys..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 uppercase">
              Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 uppercase">
                Display Order
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isAvailableCheckbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
              />
              <label htmlFor="isAvailableCheckbox" className="text-xs font-bold text-stone-800">
                In Stock / Available
              </label>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isFeaturedCheckbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
              />
              <label htmlFor="isFeaturedCheckbox" className="text-xs font-bold text-stone-800">
                Chef&apos;s Featured
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} isLoading={isSaving}>
              {editingProduct ? 'Save Changes' : 'Create Dish'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
