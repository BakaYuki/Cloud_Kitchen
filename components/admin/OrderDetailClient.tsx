'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Order, OrderStatus, PaymentStatus } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatNPR, formatDate, getStatusBadgeVariant, getStatusLabel } from '@/lib/utils';
import {
  adminUpdateOrderStatusAction,
  adminUpdatePaymentStatusAction,
} from '@/app/actions/admin';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  Receipt,
  Utensils,
  ExternalLink,
  ZoomIn,
  AlertTriangle,
} from 'lucide-react';

interface OrderDetailClientProps {
  order: Order;
}

export function OrderDetailClient({ order: initialOrder }: OrderDetailClientProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order>(initialOrder);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isScreenshotModalOpen, setIsScreenshotModalOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setIsUpdatingStatus(true);
    setActionMessage(null);
    try {
      const ok = await adminUpdateOrderStatusAction(order.id, newStatus);
      if (ok) {
        setOrder((prev) => ({ ...prev, status: newStatus }));
        setActionMessage(`Order status updated to "${getStatusLabel(newStatus)}"`);
        router.refresh();
      }
    } catch (err) {
      console.error('Update status error:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handlePaymentVerify = async (paymentStatus: PaymentStatus) => {
    setIsUpdatingStatus(true);
    setActionMessage(null);
    try {
      const ok = await adminUpdatePaymentStatusAction(order.id, paymentStatus);
      if (ok) {
        setOrder((prev) => ({ ...prev, payment_status: paymentStatus }));
        setActionMessage(
          paymentStatus === 'verified'
            ? 'Payment verified successfully!'
            : 'Payment rejected.'
        );
        router.refresh();
      }
    } catch (err) {
      console.error('Update payment status error:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top back button & Order Reference Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-stone-500 hover:text-stone-900 flex items-center gap-1.5 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Orders</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 font-mono">
              {order.order_number}
            </h1>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusBadgeVariant(
                order.status
              )}`}
            >
              {getStatusLabel(order.status)}
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Placed on {formatDate(order.created_at)}
          </p>
        </div>

        {/* Quick Order Status dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="order-status-select" className="text-xs font-bold text-stone-500">Status:</label>
          <select
            id="order-status-select"
            value={order.status}
            disabled={isUpdatingStatus}
            onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
            aria-label="Change order status"
            className="px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-xs sm:text-sm font-bold text-stone-900 focus:ring-2 focus:ring-orange-500 cursor-pointer"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Customer info & Items) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Ordered Food Items */}
          <Card className="rounded-3xl border-stone-200 overflow-hidden shadow-xs">
            <CardHeader className="bg-stone-50/60 p-5 border-b border-stone-100 flex items-center justify-between">
              <CardTitle className="text-base font-extrabold flex items-center gap-2">
                <Utensils className="w-4 h-4 text-orange-600" />
                <span>Ordered Food Items ({order.order_items?.length || 0})</span>
              </CardTitle>
            </CardHeader>
            <div className="p-5 divide-y divide-stone-100">
              {order.order_items?.map((item) => (
                <div
                  key={item.id || item.product_name}
                  className="py-3.5 flex items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <span className="font-extrabold text-stone-900 text-sm block">
                      {item.product_name}
                    </span>
                    <span className="text-xs text-stone-500">
                      {formatNPR(item.unit_price)} per portion × {item.quantity} qty
                    </span>
                  </div>
                  <span className="font-bold text-stone-900 text-sm">
                    {formatNPR(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial summary */}
            <div className="p-5 bg-stone-50/70 border-t border-stone-200 space-y-2 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">{formatNPR(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery Fee</span>
                <span className="font-semibold text-stone-900">
                  {order.delivery_fee === 0 ? 'FREE' : formatNPR(order.delivery_fee)}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline font-black">
                <span className="text-stone-900">Grand Total</span>
                <span className="text-xl text-orange-600">{formatNPR(order.total)}</span>
              </div>
            </div>
          </Card>

          {/* Delivery & Customer Info */}
          <Card className="rounded-3xl border-stone-200 p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-extrabold text-stone-900 pb-3 border-b border-stone-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span>Customer &amp; Delivery Destination</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-stone-400 uppercase font-bold block">
                  Customer Name
                </span>
                <span className="font-bold text-stone-900 text-base">
                  {order.customer_name}
                </span>
              </div>

              <div>
                <span className="text-xs text-stone-400 uppercase font-bold block">
                  Phone Number
                </span>
                <a
                  href={`tel:${order.phone}`}
                  className="font-bold text-orange-600 hover:underline flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{order.phone}</span>
                </a>
              </div>

              <div>
                <span className="text-xs text-stone-400 uppercase font-bold block">
                  Email
                </span>
                <span className="font-medium text-stone-800">{order.email}</span>
              </div>

              <div>
                <span className="text-xs text-stone-400 uppercase font-bold block">
                  Delivery Address
                </span>
                <p className="font-medium text-stone-900">{order.delivery_address}</p>
              </div>

              {order.delivery_instructions && (
                <div className="sm:col-span-2 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700">
                  <span className="font-bold block">Customer Note:</span>
                  <p className="mt-0.5">{order.delivery_instructions}</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column (Payment Verification & Proof) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-3xl border-stone-200 p-6 space-y-5 shadow-xs">
            <h3 className="text-base font-extrabold text-stone-900 pb-3 border-b border-stone-100 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-orange-600" />
              <span>Payment Verification</span>
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-xs text-stone-400 uppercase font-bold">Method</span>
                <span className="font-extrabold text-stone-900 uppercase">
                  {order.payment_method}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-stone-400 uppercase font-bold">Status</span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadgeVariant(
                    order.payment_status
                  )}`}
                >
                  {getStatusLabel(order.payment_status)}
                </span>
              </div>

              {order.payment_reference && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-stone-400 uppercase font-bold">
                    Reference ID
                  </span>
                  <span className="font-mono font-bold text-xs bg-stone-100 px-2 py-0.5 rounded">
                    {order.payment_reference}
                  </span>
                </div>
              )}
            </div>

            {/* Payment Proof Screenshot Display */}
            {order.payment_proof_url ? (
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wide block">
                  Payment Proof Screenshot
                </span>
                <div
                  onClick={() => setIsScreenshotModalOpen(true)}
                  className="relative w-full h-48 rounded-2xl bg-stone-100 overflow-hidden border border-stone-200 cursor-pointer group shadow-inner"
                >
                  <Image
                    src={order.payment_proof_url}
                    alt="Payment Proof"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1.5">
                    <ZoomIn className="w-4 h-4" />
                    <span>Click to Zoom</span>
                  </div>
                </div>
              </div>
            ) : (
              order.payment_method !== 'cod' && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-500 text-center">
                  No payment screenshot uploaded by customer.
                </div>
              )
            )}

            {/* Payment Action Buttons */}
            {order.payment_method !== 'cod' && (
              <div className="pt-3 border-t border-stone-100 space-y-2">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wide block">
                  Verify Transaction
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="success"
                    disabled={isUpdatingStatus || order.payment_status === 'verified'}
                    onClick={() => handlePaymentVerify('verified')}
                    className="font-bold text-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Verify
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    disabled={isUpdatingStatus || order.payment_status === 'rejected'}
                    onClick={() => handlePaymentVerify('rejected')}
                    className="font-bold text-xs"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Quick Dispatch Buttons */}
          <Card className="rounded-3xl border-stone-200 p-6 space-y-3 shadow-xs">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wide block">
              Quick Kitchen Actions
            </span>
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={() => handleStatusChange('preparing')}
                disabled={isUpdatingStatus || order.status === 'preparing'}
                className="w-full justify-start text-xs font-bold h-10 border-stone-200 hover:bg-stone-50"
              >
                Mark as Preparing (In Wok)
              </Button>
              <Button
                variant="outline"
                onClick={() => handleStatusChange('out_for_delivery')}
                disabled={isUpdatingStatus || order.status === 'out_for_delivery'}
                className="w-full justify-start text-xs font-bold h-10 border-stone-200 hover:bg-stone-50"
              >
                Mark as Out for Delivery (Rider)
              </Button>
              <Button
                variant="outline"
                onClick={() => handleStatusChange('delivered')}
                disabled={isUpdatingStatus || order.status === 'delivered'}
                className="w-full justify-start text-xs font-bold h-10 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
              >
                Mark as Delivered &amp; Completed
              </Button>
              <Button
                variant="outline"
                onClick={() => handleStatusChange('cancelled')}
                disabled={isUpdatingStatus || order.status === 'cancelled'}
                className="w-full justify-start text-xs font-bold h-10 text-rose-700 border-rose-200 hover:bg-rose-50"
              >
                Cancel Order
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Full-size screenshot inspection modal */}
      {order.payment_proof_url && (
        <Modal
          isOpen={isScreenshotModalOpen}
          onClose={() => setIsScreenshotModalOpen(false)}
          title="Payment Screenshot Inspection"
          maxWidth="2xl"
        >
          <div className="relative w-full h-[70vh] bg-stone-900 rounded-2xl overflow-hidden flex items-center justify-center">
            <Image
              src={order.payment_proof_url}
              alt="Payment Proof Full"
              fill
              className="object-contain"
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
