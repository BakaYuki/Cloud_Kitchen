import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getOrderById } from '@/lib/supabase/data';
import { OrderDetailClient } from '@/components/admin/OrderDetailClient';

interface AdminOrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: AdminOrderDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order Details | Kitchen Admin`,
  };
}

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return <OrderDetailClient order={order} />;
}
