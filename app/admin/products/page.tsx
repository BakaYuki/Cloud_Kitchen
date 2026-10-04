import { Metadata } from 'next';
import { getAllProducts, getAllCategories } from '@/lib/supabase/data';
import { ProductManagementClient } from '@/components/admin/ProductManagementClient';

export const metadata: Metadata = {
  title: 'Menu Products | Kitchen Admin',
};

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);

  return (
    <ProductManagementClient
      initialProducts={products}
      categories={categories}
    />
  );
}
