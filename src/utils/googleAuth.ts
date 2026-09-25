/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Google Cloud projesinde tanımlanan doğrulanmış Web Client ID
export const VERIFIED_GOOGLE_CLIENT_ID = '329969897207-usdbp11an516r0qtjo6k0tr26kq288n1.apps.googleusercontent.com';

/**
 * Google OAuth 2.0 Web Client ID değerini dinamik ve güvenli şekilde çözer.
 * 1. Tarayıcı Hafızasındaki Override (kullanıcı/admin tarafından girilen kimlik)
 * 2. import.meta.env.VITE_GOOGLE_CLIENT_ID (.env yapılandırması)
 * 3. Doğrulanmış Google Web Client ID sabiti ('329969897207-usdbp11an516r0qtjo6k0tr26kq288n1.apps.googleusercontent.com')
 */
export const getGoogleClientId = (): string => {
  // 1. Tarayıcı Depolaması
  try {
    const localId = localStorage.getItem('tpz_google_client_id');
    if (localId && localId.trim() && localId.includes('.apps.googleusercontent.com')) {
      return localId.trim();
    }
  } catch {}

  // 2. Vite Ortam Değişkeni (.env / VITE_GOOGLE_CLIENT_ID) veya Doğrulanmış Client ID
  const envId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();
  if (envId && envId.includes('.apps.googleusercontent.com')) {
    return envId;
  }

  // 3. Kesin Sabit Doğrulanmış Client ID
  return import.meta.env.VITE_GOOGLE_CLIENT_ID || VERIFIED_GOOGLE_CLIENT_ID;
};

/**
 * Google Client ID'yi tarayıcı hafızasına kaydeder.
 */
export const setCustomGoogleClientId = (clientId: string): boolean => {
  const cleanId = (clientId || '').trim();
  if (!cleanId || !cleanId.includes('.apps.googleusercontent.com')) {
    return false;
  }
  try {
    localStorage.setItem('tpz_google_client_id', cleanId);
    return true;
  } catch {
    return false;
  }
};

/**
 * Tarayıcı seviyesinde doğrudan Google OAuth 2.0 yetkilendirme ekranına yönlendirir.
 * Doğrulanmış Google Cloud Client ID ve yetkilendirilmiş yönlendirme URI'si ile çağrı başlatır.
 */
export const handleGoogleLogin = (role: 'buyer' | 'seller' = 'buyer') => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || getGoogleClientId() || VERIFIED_GOOGLE_CLIENT_ID;

  // Hata koruması
  if (!clientId || !clientId.includes('.apps.googleusercontent.com')) {
    const targetUrl = `/auth/google/callback?error=invalid_client_unconfigured&role=${encodeURIComponent(role)}`;
    if (window.location.pathname !== '/auth/google/callback') {
      window.location.href = targetUrl;
    }
    return;
  }

  const redirectUri = encodeURIComponent(`${window.location.origin}/auth/google/callback`);
  const scope = encodeURIComponent('openid email profile');
  const state = encodeURIComponent(JSON.stringify({ role }));
  
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}&prompt=select_account`;
};
