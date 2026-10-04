import { Metadata } from 'next';
import { getAllOrders } from '@/lib/supabase/data';
import { OrdersTableClient } from '@/components/admin/OrdersTableClient';

export const metadata: Metadata = {
  title: 'Order Management | Kitchen Admin',
};

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Customer Orders
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Monitor tickets, verify customer payments, and advance kitchen dispatch status
        </p>
      </div>

      <OrdersTableClient orders={orders} />
    </div>
  );
}
