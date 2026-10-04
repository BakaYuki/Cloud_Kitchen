import { Metadata } from 'next';
import { getSiteSettings } from '@/lib/supabase/data';
import { CheckoutClient } from '@/components/checkout/CheckoutClient';

export const metadata: Metadata = {
  title: 'Secure Checkout | Himalayan Cloud Kitchen',
  description:
    'Complete your food order with Cash on Delivery, eSewa, Khalti, or Bank Transfer. Fast and contact-free delivery in Nepal.',
};

export default async function CheckoutPage() {
  const siteSettings = await getSiteSettings();

  return <CheckoutClient siteSettings={siteSettings} />;
}
