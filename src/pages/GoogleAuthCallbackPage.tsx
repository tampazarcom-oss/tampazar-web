/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

export default function GoogleAuthCallbackPage() {
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('tampazar_auth_user');
      let isSeller = false;
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.role === 'merchant' || parsedUser.role === 'seller') isSeller = true;
        } catch {}
      }
      const target = isSeller ? '/satici-paneli' : '/';
      if (window.history.replaceState) {
        window.history.replaceState(null, '', target);
      }
      window.location.href = target;
    } catch {
      window.location.href = '/';
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white text-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-100 text-center space-y-6">
        <div className="flex justify-center">
          <BrandLogo size="md" />
        </div>
        <div className="space-y-4 py-6">
          <div className="relative inline-flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-[#0F4C3A] animate-spin" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-black text-slate-900">
              Yönlendiriliyorsunuz...
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Lütfen bekleyin, aktarılıyorsunuz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
