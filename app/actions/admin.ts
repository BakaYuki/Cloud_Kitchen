'use server';

import { revalidatePath } from 'next/cache';
import { Product, Category, SiteSettings, OrderStatus, PaymentStatus } from '@/types';
import {
  saveProduct,
  deleteProduct,
  saveCategory,
  saveSiteSettings,
  updateOrderStatus,
  updatePaymentStatus,
} from '@/lib/supabase/data';

export async function adminSaveProductAction(
  productData: Partial<Product> & {
    name: string;
    category_id: string;
    price: number;
    description: string;
  }
) {
  const result = await saveProduct(productData);
  revalidatePath('/menu');
  revalidatePath('/admin/products');
  revalidatePath('/');
  return result;
}

export async function adminDeleteProductAction(id: string) {
  const result = await deleteProduct(id);
  revalidatePath('/menu');
  revalidatePath('/admin/products');
  return result;
}

export async function adminSaveCategoryAction(
  categoryData: Partial<Category> & { name: string }
) {
  const result = await saveCategory(categoryData);
  revalidatePath('/menu');
  revalidatePath('/admin/categories');
  revalidatePath('/');
  return result;
}

export async function adminSaveSettingsAction(settings: Partial<SiteSettings>) {
  const result = await saveSiteSettings(settings);
  revalidatePath('/admin/settings');
  revalidatePath('/checkout');
  revalidatePath('/');
  return result;
}

export async function adminUpdateOrderStatusAction(
  orderId: string,
  status: OrderStatus,
  paymentStatus?: PaymentStatus
) {
  const result = await updateOrderStatus(orderId, status, paymentStatus);
  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath('/admin/dashboard');
  return result;
}

export async function adminUpdatePaymentStatusAction(
  orderId: string,
  paymentStatus: PaymentStatus
) {
  const result = await updatePaymentStatus(orderId, paymentStatus);
  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath('/admin/dashboard');
  return result;
}
