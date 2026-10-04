'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Flame, Lock, Mail, AlertCircle, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      if (supabase) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInError) {
          // If Supabase is connected but credentials failed
          setError(signInError.message);
          setIsLoading(false);
          return;
        }
      }

      // Set cookie session flag for middleware and client
      document.cookie = 'admin_demo_session=active; Path=/; Max-Age=86400; SameSite=Lax';

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: unknown) {
      console.error('Login error:', err);
      setError('Failed to authenticate. Please check your credentials.');
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = () => {
    setEmail('admin@himalayanfood.com.np');
    setPassword('admin123456');
    document.cookie = 'admin_demo_session=active; Path=/; Max-Age=86400; SameSite=Lax';
    router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-3xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-xl shadow-orange-600/30">
            <Flame className="w-8 h-8 fill-current" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Kitchen Staff &amp; Admin Login
          </h1>
          <p className="text-xs text-stone-400">
            Authorized management portal for Himalayan Cloud Kitchen
          </p>
        </div>

        <Card className="rounded-3xl border-stone-800 bg-stone-950 p-6 sm:p-8 space-y-6 shadow-2xl text-stone-200">
          {error && (
            <div className="p-3.5 bg-rose-950/60 border border-rose-800 rounded-2xl flex items-center gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300 uppercase tracking-wide">
                Staff Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@himalayanfood.com.np"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-800 bg-stone-900 text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-800 bg-stone-900 text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              isLoading={isLoading}
              className="w-full h-11 text-sm font-bold shadow-md shadow-orange-600/30"
            >
              Sign In to Portal
            </Button>
          </form>

          {/* Quick Demo Access banner for seamless developer testing */}
          <div className="pt-4 border-t border-stone-800 space-y-3">
            <div className="p-3 bg-stone-900/80 rounded-2xl border border-stone-800 text-[11px] text-stone-400 space-y-1">
              <span className="font-bold text-stone-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                Demo / Reviewer Access
              </span>
              <p>
                Click below to instantly sign in with test credentials:
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleQuickDemoLogin}
              className="w-full h-9 text-xs font-bold border-stone-700 bg-stone-900 text-stone-300 hover:bg-stone-800 hover:text-white"
            >
              Instant Demo Login (Staff Access)
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
