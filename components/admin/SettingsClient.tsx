'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { SiteSettings } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { adminSaveSettingsAction } from '@/app/actions/admin';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  QrCode,
  DollarSign,
  CheckCircle2,
  Truck,
  Upload,
} from 'lucide-react';

interface SettingsClientProps {
  initialSettings: SiteSettings;
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const router = useRouter();
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);

  const [businessName, setBusinessName] = useState(settings.business_name);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [address, setAddress] = useState(settings.address);

  const [deliveryFee, setDeliveryFee] = useState(String(settings.delivery_fee));
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(
    String(settings.free_delivery_threshold || 1500)
  );
  const [minimumOrderAmount, setMinimumOrderAmount] = useState(
    String(settings.minimum_order_amount || 200)
  );

  const [esewaQrUrl, setEsewaQrUrl] = useState(settings.esewa_qr_url || '');
  const [khaltiQrUrl, setKhaltiQrUrl] = useState(settings.khalti_qr_url || '');
  const [bankQrUrl, setBankQrUrl] = useState(settings.bank_qr_url || '');

  const [bankName, setBankName] = useState(settings.bank_name || '');
  const [bankAccountName, setBankAccountName] = useState(
    settings.bank_account_name || ''
  );
  const [bankAccountNumber, setBankAccountNumber] = useState(
    settings.bank_account_number || ''
  );

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);

    try {
      const updated = await adminSaveSettingsAction({
        business_name: businessName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        delivery_fee: parseFloat(deliveryFee) || 0,
        free_delivery_threshold: parseFloat(freeDeliveryThreshold) || null,
        minimum_order_amount: parseFloat(minimumOrderAmount) || null,
        esewa_qr_url: esewaQrUrl.trim() || null,
        khalti_qr_url: khaltiQrUrl.trim() || null,
        bank_qr_url: bankQrUrl.trim() || null,
        bank_name: bankName.trim() || null,
        bank_account_name: bankAccountName.trim() || null,
        bank_account_number: bankAccountNumber.trim() || null,
      });

      setSettings(updated);
      setSuccessMessage('Site and payment settings saved successfully!');
      router.refresh();
    } catch (err) {
      console.error('Settings save error:', err);
      alert('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Business &amp; Payment Settings
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Configure contact info, delivery pricing, and dynamic QR payment codes
        </p>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. General Business Profile */}
        <Card className="rounded-3xl border-stone-200 p-6 space-y-4">
          <h2 className="text-base font-extrabold text-stone-900 pb-3 border-b border-stone-100 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-orange-600" />
            <span>Kitchen Business Profile</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 uppercase">
                Brand / Business Name
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 uppercase">
                Contact Phone
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 uppercase">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 uppercase">
                Physical / Kitchen Address
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </Card>

        {/* 2. Delivery Pricing & Thresholds */}
        <Card className="rounded-3xl border-stone-200 p-6 space-y-4">
          <h2 className="text-base font-extrabold text-stone-900 pb-3 border-b border-stone-100 flex items-center gap-2">
            <Truck className="w-4 h-4 text-orange-600" />
            <span>Delivery &amp; Order Rules</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 uppercase">
                Standard Delivery Fee (NPR)
              </label>
              <input
                type="number"
                min="0"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 uppercase">
                Free Delivery Above (NPR)
              </label>
              <input
                type="number"
                min="0"
                value={freeDeliveryThreshold}
                onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 uppercase">
                Minimum Order Amount (NPR)
              </label>
              <input
                type="number"
                min="0"
                value={minimumOrderAmount}
                onChange={(e) => setMinimumOrderAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </Card>

        {/* 3. Payment Methods & Dynamic QR Codes */}
        <Card className="rounded-3xl border-stone-200 p-6 space-y-6">
          <h2 className="text-base font-extrabold text-stone-900 pb-3 border-b border-stone-100 flex items-center gap-2">
            <QrCode className="w-4 h-4 text-orange-600" />
            <span>Digital Payment &amp; QR Codes</span>
          </h2>
          <p className="text-xs text-stone-500">
            Customers will see these exact QR codes during checkout when selecting eSewa, Khalti, or Bank Transfer.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* eSewa QR */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <span className="font-extrabold text-emerald-800 text-sm block">
                eSewa Merchant QR
              </span>
              <div className="relative w-36 h-36 mx-auto bg-white p-2 rounded-xl border border-stone-200 flex items-center justify-center">
                {esewaQrUrl ? (
                  <Image
                    src={esewaQrUrl}
                    alt="eSewa QR"
                    fill
                    className="object-contain p-1"
                  />
                ) : (
                  <QrCode className="w-10 h-10 text-stone-300" />
                )}
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-600 uppercase">
                  QR Image URL
                </label>
                <input
                  type="url"
                  value={esewaQrUrl}
                  onChange={(e) => setEsewaQrUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
                />
              </div>
            </div>

            {/* Khalti QR */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <span className="font-extrabold text-purple-800 text-sm block">
                Khalti Merchant QR
              </span>
              <div className="relative w-36 h-36 mx-auto bg-white p-2 rounded-xl border border-stone-200 flex items-center justify-center">
                {khaltiQrUrl ? (
                  <Image
                    src={khaltiQrUrl}
                    alt="Khalti QR"
                    fill
                    className="object-contain p-1"
                  />
                ) : (
                  <QrCode className="w-10 h-10 text-stone-300" />
                )}
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-600 uppercase">
                  QR Image URL
                </label>
                <input
                  type="url"
                  value={khaltiQrUrl}
                  onChange={(e) => setKhaltiQrUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
                />
              </div>
            </div>

            {/* Bank QR & Details */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <span className="font-extrabold text-blue-800 text-sm block">
                Direct Bank Transfer QR
              </span>
              <div className="relative w-36 h-36 mx-auto bg-white p-2 rounded-xl border border-stone-200 flex items-center justify-center">
                {bankQrUrl ? (
                  <Image
                    src={bankQrUrl}
                    alt="Bank QR"
                    fill
                    className="object-contain p-1"
                  />
                ) : (
                  <QrCode className="w-10 h-10 text-stone-300" />
                )}
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-600 uppercase">
                  QR Image URL
                </label>
                <input
                  type="url"
                  value={bankQrUrl}
                  onChange={(e) => setBankQrUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Bank Account Details */}
          <div className="pt-4 border-t border-stone-200 space-y-3">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wide block">
              Official Bank Account Details
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-600">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. Nabil Bank Ltd."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-600">Account Name</label>
                <input
                  type="text"
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  placeholder="e.g. Himalayan Cloud Kitchen Pvt Ltd"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-600">Account Number</label>
                <input
                  type="text"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  placeholder="e.g. 01201017500123"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 bg-white font-mono"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSaving}
            isLoading={isSaving}
            size="lg"
            className="font-bold px-8 shadow-md shadow-orange-600/20"
          >
            Save All Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
