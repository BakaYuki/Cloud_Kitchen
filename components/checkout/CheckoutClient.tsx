'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart/cart-context';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { formatNPR } from '@/lib/utils';
import { createOrderAction } from '@/app/actions/order';
import { SiteSettings, PaymentMethod } from '@/types';
import {
  Banknote,
  Smartphone,
  CreditCard,
  Building2,
  Upload,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowLeft,
  X,
  Lock,
} from 'lucide-react';

interface CheckoutClientProps {
  siteSettings: SiteSettings;
}

export function CheckoutClient({ siteSettings }: CheckoutClientProps) {
  const router = useRouter();
  const { items, subtotal, deliveryFee, total, clearCart, isLoaded } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [paymentReference, setPaymentReference] = useState('');

  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // If user accesses checkout with empty cart
  if (isLoaded && items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-4">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold text-stone-900">Your cart is empty</h2>
          <p className="text-sm text-stone-500">
            Please select items from our menu before proceeding to checkout.
          </p>
          <Link href="/menu" className="block pt-2">
            <Button className="w-full">Return to Menu</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Payment screenshot must be smaller than 5MB.');
        return;
      }
      setProofFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setProofFile(null);
    setProofPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Basic Client validation
    if (!customerName.trim() || customerName.trim().length < 2) {
      setFormError('Please enter your full name (at least 2 characters).');
      return;
    }

    const cleanPhone = phone.replace(/[\s-]/g, '');
    const nepalPhoneRegex = /^(?:\+?977)?(?:98|97)\d{8}$/;
    if (!nepalPhoneRegex.test(cleanPhone)) {
      setFormError(
        'Please enter a valid Nepal mobile number starting with 98 or 97 (e.g. 9801234567).'
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setFormError('Please enter a valid email address for receiving your receipt.');
      return;
    }

    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 5) {
      setFormError('Please provide a specific delivery address with street or landmark.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('customer_name', customerName.trim());
      formData.append('phone', cleanPhone);
      formData.append('email', email.trim().toLowerCase());
      formData.append('delivery_address', deliveryAddress.trim());
      formData.append('delivery_instructions', deliveryInstructions.trim());
      formData.append('payment_method', paymentMethod);
      formData.append('payment_reference', paymentReference.trim());

      // Prepare items for server calculation
      const orderItemsInput = items.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
      }));
      formData.append('items', JSON.stringify(orderItemsInput));

      if (proofFile && paymentMethod !== 'cod') {
        formData.append('payment_proof', proofFile);
      }

      const response = await createOrderAction(formData);

      if (!response.success || !response.orderNumber) {
        setFormError(response.error || 'Failed to place order. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Order created successfully!
      clearCart();
      router.push(`/order/${response.orderNumber}`);
    } catch (err) {
      console.error('Submit error:', err);
      setFormError('An unexpected network error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50/60 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/cart"
            className="text-xs sm:text-sm font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cart</span>
          </Link>
          <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
            <Lock className="w-3 h-3" /> Secure Checkout
          </span>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form (Left 8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Error Banner */}
            {formError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-sm animate-in fade-in">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
                <div className="flex-1 font-medium">{formError}</div>
              </div>
            )}

            {/* Step 1: Customer Details */}
            <Card className="rounded-3xl border-stone-200 p-6 space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                <div className="w-7 h-7 rounded-full bg-orange-600 text-white font-black text-xs flex items-center justify-center">
                  1
                </div>
                <h2 className="text-lg font-black text-stone-900">
                  Customer & Delivery Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wide">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Nepal Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wide">
                    Nepal Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98XXXXXXXX / 97XXXXXXXX"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                  <p className="text-[11px] text-stone-500">
                    Our rider will call this number for order updates.
                  </p>
                </div>

                {/* Email */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wide">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                  <p className="text-[11px] text-stone-500">
                    Order confirmation and receipt will be sent here.
                  </p>
                </div>

                {/* Delivery Address */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wide">
                    Delivery Address <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Area, Ward, Street Name, House No., or nearby Landmark (e.g. Jhamsikhel, opposite St. Mary's School)"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Delivery Instructions */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wide flex items-center justify-between">
                    <span>Delivery Instructions</span>
                    <span className="text-stone-400 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    placeholder="e.g. Ring the bell twice, leave with security, extra spicy achar..."
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </Card>

            {/* Step 2: Payment Method */}
            <Card className="rounded-3xl border-stone-200 p-6 space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                <div className="w-7 h-7 rounded-full bg-orange-600 text-white font-black text-xs flex items-center justify-center">
                  2
                </div>
                <h2 className="text-lg font-black text-stone-900">
                  Select Payment Method
                </h2>
              </div>

              {/* Payment selector tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* COD */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-orange-600 bg-orange-50/60 ring-2 ring-orange-500/20 shadow-xs'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <Banknote
                    className={`w-6 h-6 ${
                      paymentMethod === 'cod' ? 'text-orange-600' : 'text-stone-500'
                    }`}
                  />
                  <div>
                    <span className="font-extrabold text-sm text-stone-900 block leading-tight">
                      Cash on Delivery
                    </span>
                    <span className="text-[11px] text-stone-500">Pay when food arrives</span>
                  </div>
                </button>

                {/* eSewa */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('esewa')}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer ${
                    paymentMethod === 'esewa'
                      ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <Smartphone
                    className={`w-6 h-6 ${
                      paymentMethod === 'esewa' ? 'text-emerald-600' : 'text-stone-500'
                    }`}
                  />
                  <div>
                    <span className="font-extrabold text-sm text-stone-900 block leading-tight">
                      eSewa
                    </span>
                    <span className="text-[11px] text-stone-500">Scan QR &amp; Pay</span>
                  </div>
                </button>

                {/* Khalti */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('khalti')}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer ${
                    paymentMethod === 'khalti'
                      ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-500/20 shadow-xs'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <CreditCard
                    className={`w-6 h-6 ${
                      paymentMethod === 'khalti' ? 'text-purple-600' : 'text-stone-500'
                    }`}
                  />
                  <div>
                    <span className="font-extrabold text-sm text-stone-900 block leading-tight">
                      Khalti
                    </span>
                    <span className="text-[11px] text-stone-500">Scan QR &amp; Pay</span>
                  </div>
                </button>

                {/* Bank Transfer */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <Building2
                    className={`w-6 h-6 ${
                      paymentMethod === 'bank_transfer' ? 'text-blue-600' : 'text-stone-500'
                    }`}
                  />
                  <div>
                    <span className="font-extrabold text-sm text-stone-900 block leading-tight">
                      Bank Transfer
                    </span>
                    <span className="text-[11px] text-stone-500">Direct account deposit</span>
                  </div>
                </button>
              </div>

              {/* Online Payment Dynamic Instructions & QR Code Display */}
              {paymentMethod !== 'cod' && (
                <div className="bg-stone-50 rounded-2xl p-5 sm:p-6 border border-stone-200 space-y-5 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* QR Code Container */}
                    <div className="relative w-44 h-44 sm:w-48 sm:h-48 bg-white p-3 rounded-2xl border-2 border-dashed border-stone-300 shadow-sm shrink-0 flex items-center justify-center">
                      {paymentMethod === 'esewa' && siteSettings.esewa_qr_url && (
                        <Image
                          src={siteSettings.esewa_qr_url}
                          alt="eSewa QR Code"
                          fill
                          className="object-contain p-2"
                        />
                      )}
                      {paymentMethod === 'khalti' && siteSettings.khalti_qr_url && (
                        <Image
                          src={siteSettings.khalti_qr_url}
                          alt="Khalti QR Code"
                          fill
                          className="object-contain p-2"
                        />
                      )}
                      {paymentMethod === 'bank_transfer' && siteSettings.bank_qr_url && (
                        <Image
                          src={siteSettings.bank_qr_url}
                          alt="Bank Transfer QR Code"
                          fill
                          className="object-contain p-2"
                        />
                      )}
                    </div>

                    {/* Payment Instructions & Details */}
                    <div className="space-y-3 flex-1 text-sm text-stone-700">
                      <div className="font-bold text-base text-stone-900">
                        {paymentMethod === 'esewa' && 'Scan eSewa QR Code'}
                        {paymentMethod === 'khalti' && 'Scan Khalti QR Code'}
                        {paymentMethod === 'bank_transfer' && 'Bank Account Details'}
                      </div>

                      {paymentMethod === 'bank_transfer' && (
                        <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-1.5 text-xs sm:text-sm">
                          <div>
                            <span className="text-stone-600 block">Bank Name:</span>
                            <span className="font-bold text-stone-900">
                              {siteSettings.bank_name || 'Nabil Bank Limited'}
                            </span>
                          </div>
                          <div>
                            <span className="text-stone-600 block">Account Name:</span>
                            <span className="font-bold text-stone-900">
                              {siteSettings.bank_account_name || 'Himalayan Cloud Kitchen Pvt Ltd'}
                            </span>
                          </div>
                          <div>
                            <span className="text-stone-600 block">Account Number:</span>
                            <span className="font-mono font-bold text-stone-900 text-sm">
                              {siteSettings.bank_account_number || '01201017500123'}
                            </span>
                          </div>
                        </div>
                      )}

                      <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm text-stone-600">
                        <li>Scan the QR code with your {paymentMethod === 'esewa' ? 'eSewa' : paymentMethod === 'khalti' ? 'Khalti' : 'mobile banking'} app.</li>
                        <li>Transfer exact total: <strong className="text-stone-900 font-extrabold">{formatNPR(total)}</strong>.</li>
                        <li>Enter the transaction ID below and upload the payment screenshot for instant verification.</li>
                      </ol>
                    </div>
                  </div>

                  {/* Transaction ID & Screenshot Upload */}
                  <div className="pt-4 border-t border-stone-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Transaction / Reference ID */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 uppercase tracking-wide">
                        Transaction / Reference ID
                      </label>
                      <input
                        type="text"
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        placeholder="e.g. 8923019842"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    {/* Screenshot Upload */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700 uppercase tracking-wide">
                        Upload Payment Screenshot
                      </label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      {!proofPreview ? (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full h-11 border border-dashed border-stone-300 rounded-xl bg-white hover:bg-stone-50 flex items-center justify-center gap-2 text-xs font-bold text-stone-700 transition-colors cursor-pointer"
                        >
                          <Upload className="w-4 h-4 text-orange-600" />
                          <span>Attach Receipt Screenshot</span>
                        </button>
                      ) : (
                        <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-emerald-300">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border">
                              <Image
                                src={proofPreview}
                                alt="Proof Preview"
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="text-xs font-medium text-stone-700 truncate">
                              {proofFile?.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={removeFile}
                            className="p-1 text-stone-400 hover:text-rose-600 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Checkout Summary (Right 4 cols) */}
          <div className="lg:col-span-4">
            <Card className="rounded-3xl border-stone-200 shadow-md p-6 space-y-6 sticky top-24">
              <h2 className="text-lg font-black text-stone-900 pb-3 border-b border-stone-100">
                Order Items ({items.length})
              </h2>

              {/* Items summary list */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex justify-between text-xs sm:text-sm">
                    <div className="flex-1 pr-2">
                      <span className="font-bold text-stone-800">{product.name}</span>
                      <span className="text-stone-500 block">Qty: {quantity}</span>
                    </div>
                    <span className="font-bold text-stone-900">
                      {formatNPR(product.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2.5 pt-3 border-t border-stone-100 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">{formatNPR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-stone-900">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      formatNPR(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="pt-3 border-t border-stone-100 flex justify-between items-baseline">
                  <span className="text-base font-black text-stone-900">Total Due</span>
                  <span className="text-2xl font-black text-orange-600">
                    {formatNPR(total)}
                  </span>
                </div>
              </div>

              {/* Place Order CTA */}
              <Button
                type="submit"
                disabled={isSubmitting}
                isLoading={isSubmitting}
                className="w-full h-13 text-base font-bold shadow-lg shadow-orange-600/25"
              >
                {isSubmitting ? 'Verifying & Placing Order...' : `Place Order • ${formatNPR(total)}`}
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-xs text-stone-400 text-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant dispatch after order verification</span>
              </div>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
