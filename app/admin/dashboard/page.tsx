import { Metadata } from 'next';
import Link from 'next/link';
import { getAllOrders } from '@/lib/supabase/data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatNPR, formatDate, getStatusBadgeVariant, getStatusLabel } from '@/lib/utils';
import {
  ShoppingBag,
  Clock,
  Flame,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Eye,
  ExternalLink,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard | Kitchen Admin',
};

export default async function AdminDashboardPage() {
  const orders = await getAllOrders();

  // Metrics calculation
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const preparingOrders = orders.filter((o) => o.status === 'preparing').length;
  const completedOrders = orders.filter((o) => o.status === 'delivered').length;

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled' && o.payment_status !== 'rejected')
    .reduce((sum, o) => sum + Number(o.total), 0);

  const recentOrders = orders.slice(0, 8);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Kitchen Overview
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Real-time orders, delivery tracking, and revenue overview
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/orders">
            <Button size="sm" className="font-bold gap-1.5 shadow-sm">
              <ShoppingBag className="w-4 h-4" />
              <span>Manage All Orders</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Orders */}
        <Card className="rounded-2xl p-5 border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-stone-900">
              {totalOrders}
            </span>
            <span className="text-[11px] text-stone-400 block mt-0.5">All-time tickets</span>
          </div>
        </Card>

        {/* Pending Orders */}
        <Card className="rounded-2xl p-5 border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Pending
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-amber-600">
              {pendingOrders}
            </span>
            <span className="text-[11px] text-stone-400 block mt-0.5">Needs attention</span>
          </div>
        </Card>

        {/* Preparing */}
        <Card className="rounded-2xl p-5 border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
              Preparing
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-purple-600">
              {preparingOrders}
            </span>
            <span className="text-[11px] text-stone-400 block mt-0.5">In the kitchen</span>
          </div>
        </Card>

        {/* Completed */}
        <Card className="rounded-2xl p-5 border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Delivered
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">
              {completedOrders}
            </span>
            <span className="text-[11px] text-stone-400 block mt-0.5">Successfully dispatched</span>
          </div>
        </Card>

        {/* Total Revenue */}
        <Card className="col-span-2 lg:col-span-1 rounded-2xl p-5 border-stone-200 shadow-xs bg-gradient-to-br from-stone-900 to-stone-800 text-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-300 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {formatNPR(totalRevenue)}
            </span>
            <span className="text-[11px] text-stone-400 block mt-0.5">Settled &amp; Pending</span>
          </div>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card className="rounded-3xl border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Recent Customer Orders</h2>
            <p className="text-xs text-stone-500">Live order stream</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-600 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Order Number</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Phone</th>
                <th className="px-5 py-3.5">Total</th>
                <th className="px-5 py-3.5">Payment</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-stone-900">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-orange-600 hover:underline"
                    >
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="px-5 py-4 font-semibold text-stone-900">
                    {order.customer_name}
                  </td>
                  <td className="px-5 py-4 text-stone-600">{order.phone}</td>
                  <td className="px-5 py-4 font-bold text-stone-900">
                    {formatNPR(order.total)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold uppercase text-[11px] text-stone-700">
                        {order.payment_method}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full inline-block mt-0.5 border ${getStatusBadgeVariant(
                          order.payment_status
                        )}`}
                      >
                        {getStatusLabel(order.payment_status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border inline-block ${getStatusBadgeVariant(
                        order.status
                      )}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-stone-500 text-xs">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button size="sm" variant="outline" className="h-8 px-2.5 text-xs font-bold gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
