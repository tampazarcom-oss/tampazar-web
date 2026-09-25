/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/BrandLogo';

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const { setAuthUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasExecutedRef = useRef(false);

  useEffect(() => {
    if (hasExecutedRef.current) return;

    // URL parametrelerini (window.location.search) ayrıştır: "code" ve "state"
    const urlParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code') || urlParams.get('code');
    const state = searchParams.get('state') || urlParams.get('state');
    const oauthError = searchParams.get('error') || urlParams.get('error');

    if (oauthError) {
      hasExecutedRef.current = true;
      setLoading(false);
      setError(`Google yetkilendirme hatası: ${oauthError}`);
      return;
    }

    if (!code) {
      hasExecutedRef.current = true;
      setLoading(false);
      setError('Yetkilendirme kodu bulunamadı. Lütfen tekrar giriş yapmayı deneyin.');
      return;
    }

    hasExecutedRef.current = true;

    // State içindeki role değerini kontrol et ('buyer' veya 'seller')
    let role = 'buyer';
    if (state) {
      try {
        const decoded = decodeURIComponent(state);
        const parsed = JSON.parse(decoded);
        if (parsed.role) role = parsed.role;
      } catch {
        try {
          const parsed = JSON.parse(state);
          if (parsed.role) role = parsed.role;
        } catch {
          if (state.includes('seller') || state.includes('merchant')) {
            role = 'seller';
          }
        }
      }
    }

    const redirectUri = `${window.location.origin}/auth/google/callback`;

    // POST /api/auth/google/verify-code isteği
    fetch('/api/auth/google/verify-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        code,
        redirectUri,
        role
      })
    })
      .then(async (response) => {
        const contentType = response.headers.get('content-type') || '';
        let data: any = null;

        if (contentType.includes('application/json')) {
          data = await response.json();
        } else {
          const text = await response.text();
          console.error('Backend sunucusundan JSON yerine metin/HTML döndü:', text.slice(0, 300));
          throw new Error('Sunucudan beklenen JSON yanıtı alınamadı. Lütfen tekrar deneyin.');
        }

        if (!response.ok || !data.success) {
          throw new Error(data.error || data.message || 'Giriş işlemi tamamlanamadı.');
        }

        // Dönen token ve kullanıcı bilgisini localStorage'a kaydet
        if (data.token) {
          try {
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('token', data.token);
            localStorage.setItem('tampazar_token', data.token);
            document.cookie = `tampazar_token=${encodeURIComponent(data.token)}; path=/; max-age=604800; SameSite=Lax`;
          } catch (storageErr) {
            console.warn('Token storage error:', storageErr);
          }
        }

        if (data.user) {
          try {
            localStorage.setItem('tampazar_auth_user', JSON.stringify(data.user));
            document.cookie = `tampazar_session=${encodeURIComponent(JSON.stringify(data.user))}; path=/; max-age=604800; SameSite=Lax`;
          } catch (storageErr) {
            console.warn('User storage error:', storageErr);
          }
          setAuthUser(data.user);
        }

        // role === 'seller' ise '/satici-paneli', değilse '/' (ana sayfa) adresine yönlendir
        const targetRole = data.user?.role || role;
        const isSeller = targetRole === 'seller' || targetRole === 'merchant' || role === 'seller';
        const targetUrl = isSeller ? '/satici-paneli' : '/';

        setTimeout(() => {
          window.location.href = targetUrl;
        }, 300);
      })
      .catch((err: any) => {
        console.error('Google verify-code error:', err);
        setLoading(false);
        setError(err.message || 'Giriş işlemi tamamlanamadı.');
      });
  }, [searchParams, setAuthUser]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-[#0B132B] to-[#0B132B] text-white flex flex-col justify-center items-center p-4">
      {/* Şık ve Modern Kart */}
      <div className="max-w-md w-full bg-white text-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-100 text-center space-y-6 animate-fade-in">
        <div className="flex justify-center">
          <BrandLogo size="md" />
        </div>

        {loading && (
          <div className="space-y-5 py-6">
            <div className="relative inline-flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-[#0F4C3A] animate-spin" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                TamPazar Girişi Doğrulanıyor...
              </h2>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Lütfen bekleyin.
              </p>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="space-y-5 py-4 animate-fade-in">
            <div className="inline-flex p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
              <AlertCircle className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-black text-slate-900">
                Giriş işlemi tamamlanamadı.
              </h2>
              <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200 text-left font-medium leading-relaxed">
                {error}
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => { window.location.href = '/giris'; }}
                className="w-full py-3.5 px-4 bg-[#0B132B] hover:bg-[#111B38] text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Giriş Sayfasına Dön</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
