import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { UtensilsCrossed } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-stone-50/50">
      <div className="max-w-md w-full text-center bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-sm space-y-5">
        <div className="w-20 h-20 mx-auto rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
          <UtensilsCrossed className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-stone-900">404 - Page Not Found</h1>
          <p className="text-sm text-stone-500 leading-relaxed">
            Oops! The dish or page you are looking for does not exist on our menu.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/menu">
            <Button className="w-full h-12 font-bold shadow-md shadow-orange-600/20">
              Browse Our Menu
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
