'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Order, OrderStatus, PaymentStatus } from '@/types';
import { Button } from '@/components/ui/Button';
import { formatNPR, formatDate, getStatusBadgeVariant, getStatusLabel } from '@/lib/utils';
import { Search, Eye, Filter, Phone } from 'lucide-react';

interface OrdersTableClientProps {
  orders: Order[];
}

export function OrdersTableClient({ orders }: OrdersTableClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        searchTerm === '' ||
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone.includes(searchTerm);

      const matchesStatus =
        statusFilter === 'all' || order.status === statusFilter;

      const matchesPayment =
        paymentFilter === 'all' || order.payment_status === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  const statusOptions: { label: string; value: string }[] = [
    { label: 'All Orders', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Preparing', value: 'preparing' },
    { label: 'Out for Delivery', value: 'out_for_delivery' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order #, name, phone..."
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by order status"
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Status: {opt.label}
              </option>
            ))}
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            aria-label="Filter by payment status"
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">Payment: All</option>
            <option value="pending">Payment: Pending</option>
            <option value="verified">Payment: Verified</option>
            <option value="rejected">Payment: Rejected</option>
            <option value="cod_pending">Payment: COD</option>
          </select>

          {(searchTerm || statusFilter !== 'all' || paymentFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPaymentFilter('all');
              }}
              className="text-xs font-bold text-orange-600 hover:underline px-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-600 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Order Number</th>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Phone</th>
                <th className="px-5 py-3.5">Items</th>
                <th className="px-5 py-3.5">Total</th>
                <th className="px-5 py-3.5">Payment</th>
                <th className="px-5 py-3.5">Order Status</th>
                <th className="px-5 py-3.5">Time</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
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
                    <td className="px-5 py-4 text-stone-600">
                      <a
                        href={`tel:${order.phone}`}
                        className="hover:text-orange-600 inline-flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-stone-400" />
                        <span>{order.phone}</span>
                      </a>
                    </td>
                    <td className="px-5 py-4 text-stone-600">
                      {order.order_items?.length || 0} dishes
                    </td>
                    <td className="px-5 py-4 font-extrabold text-stone-900">
                      {formatNPR(order.total)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold uppercase text-[11px] text-stone-800">
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
                          <span>View</span>
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-stone-500">
                    No orders matching your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
