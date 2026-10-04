import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cart/cart-context';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileCartBar } from '@/components/layout/MobileCartBar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: '#ea580c',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: 'Himalayan Cloud Kitchen | Bhaktapur Night Food Delivery',
    template: '%s | Himalayan Cloud Kitchen',
  },
  description:
    'Bhaktapur cloud kitchen for hot night orders, fresh momos, chowmein, thukpa, sekuwa, and reliable office meals. Order online without an account.',
  keywords: [
    'Momo delivery Bhaktapur',
    'Food delivery Nepal',
    'Cloud kitchen Bhaktapur',
    'Steamed chicken momo',
    'Chilli momo',
    'Jhol momo',
    'Sekuwa delivery',
    'Thukpa Nepal',
    'eSewa food order',
    'Khalti food payment',
  ],
  authors: [{ name: 'Himalayan Cloud Kitchen' }],
  creator: 'Himalayan Cloud Kitchen',
  publisher: 'Himalayan Cloud Kitchen Pvt. Ltd.',
  metadataBase: new URL('https://himalayanfood.com.np'),
  openGraph: {
    title:     'Himalayan Cloud Kitchen | Fresh Food Delivery in Bhaktapur',
    description:
      'Late-night momos, chowmein, and office meals delivered fresh across Bhaktapur. Cash on Delivery, eSewa, and Khalti accepted.',
    url: 'https://himalayanfood.com.np',
    siteName: 'Himalayan Cloud Kitchen',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Steamed Momos with Spicy Sesame Chutney',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Himalayan Cloud Kitchen | Bhaktapur Food Delivery',
    description:
      'Order handcrafted momos, chowmein, and snacks online for Bhaktapur night delivery and office meals.',
    images: [
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-stone-900 font-sans selection:bg-orange-500 selection:text-white">
        <CartProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <MobileCartBar />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
