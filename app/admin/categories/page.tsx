import { Metadata } from 'next';
import { getAllCategories } from '@/lib/supabase/data';
import { CategoryManagementClient } from '@/components/admin/CategoryManagementClient';

export const metadata: Metadata = {
  title: 'Categories | Kitchen Admin',
};

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  return <CategoryManagementClient initialCategories={categories} />;
}
