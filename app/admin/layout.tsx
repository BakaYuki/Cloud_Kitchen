'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AdminNav } from '@/components/admin/AdminNav';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // If on login page, render clean container without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-stone-100/70 flex flex-col md:flex-row">
      <AdminNav />
      <main className="flex-1 min-w-0 overflow-y-auto max-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
