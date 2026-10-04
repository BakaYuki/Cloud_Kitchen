import { Metadata } from 'next';
import { getSiteSettings } from '@/lib/supabase/data';
import { SettingsClient } from '@/components/admin/SettingsClient';

export const metadata: Metadata = {
  title: 'Settings & QR Codes | Kitchen Admin',
};

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return <SettingsClient initialSettings={settings} />;
}
