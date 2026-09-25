/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Loader2, AlertCircle, ArrowLeft, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/BrandLogo';
import { handleGoogleLogin } from '../utils/googleAuth';

export default function GoogleAuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, setAuthUser } = useAuth();

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'idle'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    // Çift çağrıları önlemek için ref koruması
    if (hasProcessedRef.current) return;

    const searchParams = new URLSearchParams(window.location.search || location.search);
    const code = searchParams.get('code');
    const stateStr = searchParams.get('state');
    const oauthError = searchParams.get('error');

    // Google tarafından dönen yetkilendirme hatası kontrolü
    if (oauthError) {
      hasProcessedRef.current = true;
      const errorText = `Google yetkilendirmesi başarısız oldu: ${oauthError}`;
      setStatus('error');
      setErrorMessage(errorText);
      setTimeout(() => {
        navigate(`/giris?authError=${encodeURIComponent(errorText)}`, { replace: true });
      }, 2000);
      return;
    }

    // Kod yoksa ve kullanıcı zaten oturum açmışsa doğrudan yönlendir
    if (!code) {
      if (isAuthenticated && user) {
        const isSeller = user.role === 'merchant' || user.role === 'seller';
        navigate(isSeller ? '/satici-paneli' : '/hesabim', { replace: true });
        return;
      }
      setStatus('idle');
      return;
    }

    hasProcessedRef.current = true;

    // State içerisinden role bilgisini çözümle
    let targetRole = 'buyer';
    if (stateStr) {
      try {
        const parsed = JSON.parse(decodeURIComponent(stateStr));
        if (parsed.role) targetRole = parsed.role;
      } catch {
        try {
          const parsed = JSON.parse(stateStr);
          if (parsed.role) targetRole = parsed.role;
        } catch {
          if (stateStr.includes('seller') || stateStr.includes('merchant')) {
            targetRole = 'seller';
          }
        }
      }
    }

    const redirectUri = `${window.location.origin}/auth/google/callback`;

    // POST /api/auth/google/verify-code uç noktasına doğrulama isteği
    fetch('/api/auth/google/verify-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        code,
        redirectUri,
        role: targetRole
      })
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Google oturumu doğrulanamadı.');
        }

        // Token ve kullanıcı verilerini localStorage ve çerez içerisine kaydet
        if (data.token) {
          try {
            localStorage.setItem('tampazar_token', data.token);
            document.cookie = `tampazar_token=${encodeURIComponent(data.token)}; path=/; max-age=604800; SameSite=Lax`;
          } catch (e) {
            console.warn('Storage write error:', e);
          }
        }

        if (data.user) {
          try {
            localStorage.setItem('tampazar_auth_user', JSON.stringify(data.user));
            document.cookie = `tampazar_session=${encodeURIComponent(JSON.stringify(data.user))}; path=/; max-age=604800; SameSite=Lax`;
          } catch (e) {
            console.warn('Storage write error:', e);
          }
          setAuthUser(data.user);
        }

        setStatus('success');

        // State içindeki role bilgisine göre doğrudan yönlendir
        const isSeller = targetRole === 'seller' || data.user?.role === 'merchant' || data.user?.role === 'seller';
        const targetPath = isSeller ? '/satici-paneli' : '/hesabim';

        setTimeout(() => {
          navigate(targetPath, { replace: true });
        }, 500);
      })
      .catch((err: any) => {
        console.error('Google callback error:', err);
        const errText = err.message || 'Google ile giriş sırasında bir hata oluştu.';
        setStatus('error');
        setErrorMessage(errText);

        // Hata durumunda kullanıcıyı hata parametresiyle giriş sayfasına yönlendir
        setTimeout(() => {
          navigate(`/giris?authError=${encodeURIComponent(errText)}`, { replace: true });
        }, 2200);
      });
  }, [location.search, navigate, setAuthUser, isAuthenticated, user]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white text-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-200 text-center space-y-6">
        <div className="flex justify-center">
          <BrandLogo size="md" />
        </div>

        {/* 1. Yükleme Göstergesi */}
        {status === 'loading' && (
          <div className="space-y-4 py-6">
            <div className="relative inline-flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            </div>
            <h2 className="text-lg font-black text-slate-900">Giriş yapılıyor, lütfen bekleyin...</h2>
            <p className="text-xs text-slate-500 font-medium">
              Google hesabınız güvenle doğrulanıyor ve oturumunuz hazırlanıyor...
            </p>
          </div>
        )}

        {/* 2. Başarılı Oturum */}
        {status === 'success' && (
          <div className="space-y-4 py-6 animate-fade-in">
            <div className="inline-flex p-3 rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-lg font-black text-slate-900">Giriş Başarılı!</h2>
            <p className="text-xs text-slate-500 font-medium">
              Hesabınıza güvenle aktarılıyorsunuz...
            </p>
          </div>
        )}

        {/* 3. Kodsuz Boş Giriş Ekranı */}
        {status === 'idle' && (
          <div className="space-y-4 py-4 animate-fade-in">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Google ile Hızlı Giriş</h2>
              <p className="text-xs text-slate-500 mt-1">
                TamPazar hesabınıza tek tıkla güvenle giriş yapabilir veya yeni profil oluşturabilirsiniz.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => handleGoogleLogin('buyer')}
                className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs rounded-xl border border-slate-300 shadow-sm transition flex items-center justify-center gap-3 cursor-pointer hover:border-slate-400"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google ile Şimdi Giriş Yap</span>
              </button>

              <button
                type="button"
                onClick={() => handleGoogleLogin('seller')}
                className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold text-xs rounded-xl border border-slate-700 shadow-md transition flex items-center justify-center gap-3 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Google ile Esnaf Girişi Yap</span>
              </button>

              <div className="pt-2">
                <Link
                  to="/giris"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Normal Giriş Ekranına Dön</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 4. Hata Durumu */}
        {status === 'error' && (
          <div className="space-y-5 py-4 animate-fade-in">
            <div className="inline-flex p-3 rounded-full bg-rose-100 text-rose-600">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h2 className="text-lg font-black text-slate-900">Giriş Yapılamadı</h2>
            <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200 text-left font-medium leading-relaxed">
              {errorMessage}
            </p>
            <p className="text-[11px] text-slate-500">
              Giriş ekranına yönlendiriliyorsunuz...
            </p>
            <div className="space-y-2 pt-2">
              <Link
                to="/giris"
                className="w-full py-3 bg-indigo-900 hover:bg-indigo-800 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Giriş Ekranına Hemen Dön</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
