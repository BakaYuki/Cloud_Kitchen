import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrderByNumber, getSiteSettings } from '@/lib/supabase/data';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatNPR, formatDate, getStatusBadgeVariant, getStatusLabel } from '@/lib/utils';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  Receipt,
  Utensils,
  Truck,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface OrderPageProps {
  params: Promise<{
    orderNumber: string;
  }>;
}

export async function generateMetadata({ params }: OrderPageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Order #${orderNumber} | Himalayan Cloud Kitchen`,
    description: `Tracking and confirmation for order #${orderNumber}.`,
  };
}

export default async function OrderConfirmationPage({ params }: OrderPageProps) {
  const { orderNumber } = await params;
  const [order, settings] = await Promise.all([
    getOrderByNumber(orderNumber),
    getSiteSettings(),
  ]);

  if (!order) {
    notFound();
  }

  // Steps in order lifecycle
  const steps = [
    { key: 'pending', label: 'Order Placed', desc: 'Received by kitchen' },
    { key: 'confirmed', label: 'Confirmed', desc: 'Payment/Details verified' },
    { key: 'preparing', label: 'Preparing', desc: 'Fresh in the wok & steamer' },
    { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Rider on the road' },
    { key: 'delivered', label: 'Delivered', desc: 'Enjoy your meal!' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === order.status);

  return (
    <div className="min-h-screen bg-stone-50/60 py-8 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Success Header Banner */}
        <div className="text-center space-y-3 bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xs">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center animate-in zoom-in-50">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
          <div className="space-y-1">
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-600">
              Order Confirmed &amp; In Queue
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
              Thank You for Your Order!
            </h1>
            <p className="text-sm sm:text-base text-stone-500">
              Order Reference:{' '}
              <strong className="text-stone-900 font-mono tracking-wider font-extrabold bg-stone-100 px-2.5 py-1 rounded-lg">
                {order.order_number}
              </strong>
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 font-bold border border-orange-200">
              <Clock className="w-4 h-4" />
              Estimated delivery: 30 - 45 mins
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusBadgeVariant(
                order.status
              )}`}
            >
              Order Status: {getStatusLabel(order.status)}
            </span>
          </div>
        </div>

        {/* Live Order Tracker Timeline */}
        <Card className="rounded-3xl border-stone-200 p-6 sm:p-8">
          <h2 className="text-base font-extrabold text-stone-900 mb-6 flex items-center gap-2">
            <Truck className="w-5 h-5 text-orange-600" />
            <span>Order Progress</span>
          </h2>

          <div className="relative">
            {/* Timeline Progress Bar for desktop */}
            <div className="hidden sm:block absolute top-4 left-6 right-6 h-1 bg-stone-200 -z-0">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{
                  width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* Steps grid */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
              {steps.map((step, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div
                    key={step.key}
                    className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2"
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs shrink-0 ${
                        isCurrent
                          ? 'bg-orange-600 text-white ring-4 ring-orange-100 scale-110'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-100 text-stone-400 border border-stone-200'
                      }`}
                    >
                      {isPassed && !isCurrent ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <div className="sm:mt-1">
                      <p
                        className={`text-xs sm:text-sm font-bold ${
                          isCurrent
                            ? 'text-orange-600'
                            : isPassed
                            ? 'text-stone-900'
                            : 'text-stone-400'
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-[11px] text-stone-400 leading-tight hidden sm:block">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Order Details & Customer Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer & Delivery Card */}
          <Card className="rounded-3xl border-stone-200 p-6 space-y-4">
            <h3 className="text-base font-extrabold text-stone-900 pb-3 border-b border-stone-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span>Delivery Details</span>
            </h3>

            <div className="space-y-3 text-sm text-stone-700">
              <div>
                <span className="text-xs text-stone-400 block uppercase font-bold">
                  Customer
                </span>
                <span className="font-bold text-stone-900 text-base">
                  {order.customer_name}
                </span>
              </div>

              <div>
                <span className="text-xs text-stone-400 block uppercase font-bold">
                  Contact Phone
                </span>
                <a
                  href={`tel:${order.phone}`}
                  className="font-medium text-orange-600 hover:underline flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {order.phone}
                </a>
              </div>

              <div>
                <span className="text-xs text-stone-400 block uppercase font-bold">
                  Email
                </span>
                <span className="font-medium text-stone-800">{order.email}</span>
              </div>

              <div>
                <span className="text-xs text-stone-400 block uppercase font-bold">
                  Delivery Address
                </span>
                <p className="font-medium text-stone-800 mt-0.5">
                  {order.delivery_address}
                </p>
              </div>

              {order.delivery_instructions && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-xs">
                  <span className="font-bold text-stone-700 block">
                    Special Instructions:
                  </span>
                  <p className="text-stone-600 mt-0.5">{order.delivery_instructions}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Payment & Status Card */}
          <Card className="rounded-3xl border-stone-200 p-6 space-y-4">
            <h3 className="text-base font-extrabold text-stone-900 pb-3 border-b border-stone-100 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-orange-600" />
              <span>Payment Information</span>
            </h3>

            <div className="space-y-3 text-sm text-stone-700">
              <div className="flex justify-between items-center">
                <span className="text-xs text-stone-400 uppercase font-bold">Method</span>
                <span className="font-bold text-stone-900 capitalize">
                  {order.payment_method === 'cod'
                    ? 'Cash on Delivery (COD)'
                    : order.payment_method.toUpperCase()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-stone-400 uppercase font-bold">
                  Payment Status
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadgeVariant(
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
                  <span className="font-mono text-xs font-bold text-stone-800">
                    {order.payment_reference}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-xs text-stone-400 uppercase font-bold">Ordered At</span>
                <span className="text-xs text-stone-600">{formatDate(order.created_at)}</span>
              </div>

              <div className="pt-3 border-t border-stone-100">
                <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-800 space-y-1">
                  <p className="font-bold">Need assistance with this order?</p>
                  <p>
                    Call kitchen manager at{' '}
                    <a
                      href={`tel:${settings.phone}`}
                      className="underline font-bold text-amber-900"
                    >
                      {settings.phone}
                    </a>{' '}
                    and mention order #{order.order_number}.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Ordered Food Items Receipt Card */}
        <Card className="rounded-3xl border-stone-200 p-6 sm:p-8 space-y-5">
          <h3 className="text-base font-extrabold text-stone-900 pb-3 border-b border-stone-100 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-orange-600" />
            <span>Ordered Dishes</span>
          </h3>

          <div className="divide-y divide-stone-100">
            {order.order_items?.map((item) => (
              <div
                key={item.id || item.product_name}
                className="py-3.5 flex items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <span className="font-bold text-stone-900 text-sm block">
                    {item.product_name}
                  </span>
                  <span className="text-xs text-stone-400">
                    {formatNPR(item.unit_price)} × {item.quantity}
                  </span>
                </div>
                <span className="font-extrabold text-stone-900 text-sm">
                  {formatNPR(item.subtotal)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="pt-4 border-t border-stone-200 space-y-2 text-sm">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span className="font-semibold text-stone-900">{formatNPR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Delivery Fee</span>
              <span className="font-semibold text-stone-900">
                {order.delivery_fee === 0 ? (
                  <span className="text-emerald-600 font-bold">FREE</span>
                ) : (
                  formatNPR(order.delivery_fee)
                )}
              </span>
            </div>
            <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
              <span className="text-base font-black text-stone-900">Total Amount</span>
              <span className="text-2xl font-black text-orange-600">
                {formatNPR(order.total)}
              </span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <Link href="/menu" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto rounded-xl font-bold">
              ← Order More Food
            </Button>
          </Link>
          <a href={`tel:${settings.phone}`} className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto rounded-xl font-bold gap-2">
              <Phone className="w-4 h-4" />
              <span>Call Kitchen ({settings.phone})</span>
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
