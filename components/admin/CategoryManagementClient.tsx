'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Category } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { adminSaveCategoryAction } from '@/app/actions/admin';
import { Plus, Edit2, Layers, CheckCircle2, Eye, EyeOff } from 'lucide-react';

interface CategoryManagementClientProps {
  initialCategories: Category[];
}

export function CategoryManagementClient({
  initialCategories,
}: CategoryManagementClientProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');
  const [isActive, setIsActive] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImageUrl('');
    setDisplayOrder(String(categories.length + 1));
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setImageUrl(cat.image_url || '');
    setDisplayOrder(String(cat.display_order));
    setIsActive(cat.is_active);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      const saved = await adminSaveCategoryAction({
        id: editingCategory?.id,
        name: name.trim(),
        description: description.trim() || null,
        image_url: imageUrl.trim() || null,
        display_order: parseInt(displayOrder) || 0,
        is_active: isActive,
      });

      if (editingCategory) {
        setCategories((prev) =>
          prev.map((c) => (c.id === saved.id ? { ...c, ...saved } : c))
        );
        showToast(`Category "${saved.name}" updated!`);
      } else {
        setCategories((prev) => [...prev, saved]);
        showToast(`Category "${saved.name}" created!`);
      }

      setIsModalOpen(false);
      router.refresh();
    } catch (err) {
      console.error('Save category error:', err);
      alert('Failed to save category.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (cat: Category) => {
    try {
      const updated = await adminSaveCategoryAction({
        ...cat,
        is_active: !cat.is_active,
      });
      setCategories((prev) =>
        prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c))
      );
      showToast(
        `"${cat.name}" is now ${updated.is_active ? 'ACTIVE' : 'HIDDEN'}`
      );
      router.refresh();
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
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
            Menu Categories
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Organize food offerings (Momos, Chowmein, Thukpa, Sekuwa, Drinks)
          </p>
        </div>

        <Button onClick={openCreateModal} className="font-bold gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Card key={cat.id} className="rounded-3xl border-stone-200 overflow-hidden shadow-xs">
            <div className="relative w-full h-40 bg-stone-100">
              {cat.image_url ? (
                <Image
                  src={cat.image_url}
                  alt={cat.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400">
                  <Layers className="w-10 h-10" />
                </div>
              )}
              <div className="absolute top-3 right-3">
                <button
                  type="button"
                  onClick={() => handleToggleActive(cat)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-colors shadow-xs ${
                    cat.is_active
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : 'bg-stone-900/80 text-white border-stone-700'
                  }`}
                >
                  {cat.is_active ? 'Active' : 'Hidden'}
                </button>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-lg text-stone-900">
                    {cat.name}
                  </h3>
                  <span className="text-xs text-stone-400 font-mono">
                    Display Order: #{cat.display_order}
                  </span>
                </div>
              </div>

              {cat.description && (
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              )}

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditModal(cat)}
                  className="h-8 px-3 text-xs font-bold gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Category</span>
                </Button>
                <button
                  type="button"
                  onClick={() => handleToggleActive(cat)}
                  className="text-xs font-semibold text-stone-500 hover:text-stone-900 cursor-pointer"
                >
                  {cat.is_active ? 'Hide from Menu' : 'Show on Menu'}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit / Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create Food Category'}
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 uppercase">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Snacks & Sekuwa"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 uppercase">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description for customer menu cards..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 uppercase">
              Cover Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
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
                id="isActiveCheckbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
              />
              <label htmlFor="isActiveCheckbox" className="text-xs font-bold text-stone-800">
                Active on Menu
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
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
