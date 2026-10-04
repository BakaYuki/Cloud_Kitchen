import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getFeaturedProducts, getCategories, getSiteSettings } from '@/lib/supabase/data';
import { HomeFeatured } from '@/components/home/HomeFeatured';
import { Button } from '@/components/ui/Button';
import {
  Flame,
  ArrowRight,
  Clock,
  Sparkles,
  ShieldCheck,
  Truck,
  HeartHandshake,
  Utensils,
  MapPin,
  Phone,
  MoonStar,
  BriefcaseBusiness,
  CalendarClock,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Himalayan Cloud Kitchen | Bhaktapur Night Food Delivery',
  description:
    'Bhaktapur cloud kitchen for hot night orders, fresh momos, chowmein, thukpa, sekuwa, and reliable office meals. Order online with COD, eSewa, or Khalti.',
};

export default async function HomePage() {
  const [featuredProducts, categories, settings] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getSiteSettings(),
  ]);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/70 via-stone-50/50 to-white pt-8 pb-16 sm:py-20 lg:py-24 border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold border border-orange-200 shadow-2xs">
                <Flame className="w-4 h-4 text-orange-600 fill-current" />
                <MoonStar className="w-4 h-4 text-orange-600 fill-current" />
                <span>Bhaktapur&apos;s late-night kitchen</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.1]">
                Your night cravings,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
                  sorted hot.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Handcrafted momos, wok-tossed chowmein, comforting thukpa, and sekuwa made fresh in Bhaktapur. We bring dinner, midnight bites, and dependable office meals to your door.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Link href="/menu" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto font-extrabold shadow-xl shadow-orange-600/25">
                    <span>Order Now</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/menu" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto font-bold border-stone-300">
                    Explore Food Menu
                  </Button>
                </Link>
              </div>

              {/* Quick Perks */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 border-t border-stone-200/80 text-stone-600 text-left">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-100/70 text-orange-700 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-stone-900 block leading-tight">Open late</span>
                    <span className="text-stone-600">Night delivery</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-stone-900 block leading-tight">Made to order</span>
                    <span className="text-stone-600">Always fresh</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-stone-900 block leading-tight">Office ready</span>
                    <span className="text-stone-600">Daily meal options</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative blob */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-orange-400 to-amber-200 rounded-3xl blur-2xl opacity-40 -z-10 transform rotate-3" />
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3 sm:aspect-square">
                  <Image
                    src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1000&q=85"
                    alt="Authentic Steamed Momos with Spicy Sesame Chutney"
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 500px"
                  />
                  {/* Floating Price Pill */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-stone-200 shadow-lg flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold text-orange-600 uppercase tracking-wider block">
                        Late-night favourite
                      </span>
                      <span className="font-black text-sm text-stone-900">
                        Steamed Chicken Momo (10 pcs)
                      </span>
                    </div>
                    <span className="font-black text-base text-orange-600 bg-orange-50 px-2.5 py-1 rounded-xl">
                      NPR 180
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Night and office ordering */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="rounded-3xl bg-stone-900 text-white p-7 sm:p-9 relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-orange-600/20 blur-2xl" />
            <MoonStar className="w-8 h-8 text-orange-400 mb-6" />
            <p className="text-xs uppercase font-extrabold tracking-wider text-orange-400">For the after-hours</p>
            <h2 className="text-2xl sm:text-3xl font-black mt-2">Dinner that keeps up with Bhaktapur nights.</h2>
            <p className="text-stone-300 text-sm leading-relaxed mt-3 max-w-md">
              From a quick plate after work to a full late-night spread, order straight from our kitchen while it&apos;s hot.
            </p>
            <Link href="/menu" className="inline-flex items-center gap-2 mt-6 text-sm font-bold text-orange-300 hover:text-white transition-colors">
              Browse night menu <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="rounded-3xl bg-orange-50 border border-orange-100 p-7 sm:p-9">
            <BriefcaseBusiness className="w-8 h-8 text-orange-600 mb-6" />
            <p className="text-xs uppercase font-extrabold tracking-wider text-orange-600">For every workday</p>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-2">Office meals without the group-chat chaos.</h2>
            <p className="text-stone-600 text-sm leading-relaxed mt-3 max-w-md">
              Easy daily options for teams, meetings, and solo desk lunches. Fresh portions, clear ordering, and delivery to your office.
            </p>
            <a href={`tel:${settings.phone}`} className="inline-flex items-center gap-2 mt-6 text-sm font-bold text-orange-700 hover:text-orange-900 transition-colors">
              <CalendarClock className="w-4 h-4" /> Call for office orders
            </a>
          </div>
        </div>
      </section>

      {/* 3. Food Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-orange-600 block">
              Curated Flavors
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Explore by Category
            </h2>
          </div>
          <Link
            href="/menu"
            className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>View full menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/menu`}
              className="group relative rounded-3xl overflow-hidden aspect-4/5 bg-stone-100 border border-stone-200/80 shadow-xs hover:shadow-lg transition-all duration-300"
            >
              {cat.image_url ? (
                <Image
                  src={cat.image_url}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, 20vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400">
                  <Utensils className="w-8 h-8" />
                </div>
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent flex flex-col justify-end p-4">
                <span className="font-extrabold text-white text-base sm:text-lg group-hover:text-orange-400 transition-colors leading-tight">
                  {cat.name}
                </span>
                <span className="text-[11px] text-stone-300 line-clamp-1 mt-0.5">
                  {cat.description || 'Delicious varieties'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-orange-600 block">
              Most Loved Dishes
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Chef&apos;s Recommended Specials
            </h2>
          </div>
          <Link
            href="/menu"
            className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>See all {featuredProducts.length}+ dishes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <HomeFeatured products={featuredProducts.slice(0, 8)} />
      </section>

      {/* 5. Why Choose Us Section */}
      <section className="bg-stone-900 text-white py-16 sm:py-20 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-12" id="why-us">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-14">
          <span className="text-xs uppercase font-extrabold tracking-wider text-orange-400 block">
            The Bhaktapur kitchen standard
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Good food, made for real routines
          </h2>
          <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
            A focused cloud kitchen for busy workdays and hungry nights, with the care of a neighbourhood kitchen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 1 */}
          <div className="bg-stone-800/80 p-6 rounded-2xl border border-stone-700/60 space-y-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center mx-auto sm:mx-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">Freshly Prepared</h3>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
              Nothing sits in warmers. We steam momos and toss noodles in sizzling woks only when your ticket arrives.
            </p>
          </div>

          {/* 2 */}
          <div className="bg-stone-800/80 p-6 rounded-2xl border border-stone-700/60 space-y-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mx-auto sm:mx-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">Quality Ingredients</h3>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
              Fresh produce, quality proteins, and the bold spices that make every momo, noodle, and broth taste like home.
            </p>
          </div>

          {/* 3 */}
          <div className="bg-stone-800/80 p-6 rounded-2xl border border-stone-700/60 space-y-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto sm:mx-0">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">Fast Cloud Delivery</h3>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
              Packed for the ride across Bhaktapur so your soup stays hot and your momos stay soft and tender.
            </p>
          </div>

          {/* 4 */}
          <div className="bg-stone-800/80 p-6 rounded-2xl border border-stone-700/60 space-y-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mx-auto sm:mx-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">No-Fuss Ordering</h3>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
              No account or app download required! Order in seconds and pay conveniently with COD, eSewa, or Khalti.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Contact & Location Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl text-white p-8 sm:p-12 shadow-xl shadow-orange-600/15">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs uppercase font-extrabold tracking-wider text-orange-200">
                Direct Kitchen Contact
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                Bhaktapur, your dinner is on its way.
              </h2>
              <p className="text-orange-100 text-sm sm:text-base leading-relaxed">
                Planning an office lunch, family dinner, or late-night feast? Order online or call our kitchen dispatch team.
              </p>
              <div className="flex flex-wrap items-center gap-6 pt-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-200 shrink-0" />
                  <span>{settings.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-orange-200 shrink-0" />
                  <a href={`tel:${settings.phone}`} className="underline font-bold">
                    {settings.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-4">
              <Link href="/menu" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-stone-900 text-white hover:bg-stone-800 font-extrabold shadow-lg"
                >
                  <span>Start Ordering Now</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
