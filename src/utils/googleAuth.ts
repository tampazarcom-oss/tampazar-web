/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Google OAuth 2.0 Web Client ID değerini güvenli şekilde çözer.
 * 1. import.meta.env.VITE_GOOGLE_CLIENT_ID (Çevre Değişkeni)
 * 2. localStorage ('tpz_google_client_id') (Arayüzden hızlı tanımlama)
 * 3. Proje varsayılan fallback Client ID
 */
export const getGoogleClientId = (): string => {
  // 1. Vite Ortam Değişkeni
  const envId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();
  if (envId && !envId.includes('BURAYA_') && !envId.includes('CLIENT_IDYI') && envId !== 'placeholder') {
    return envId;
  }

  // 2. Tarayıcı Depolaması (kullanıcı UI üzerinden girdiğinde anında çalışması için)
  try {
    const localId = localStorage.getItem('tpz_google_client_id');
    if (localId && localId.trim() && localId.includes('.apps.googleusercontent.com')) {
      return localId.trim();
    }
  } catch {}

  // 3. Fallback (Derleme sırasında asla boş kalmayacak şekilde)
  return '329969897207-usdb3sbbn8j6c3m61qflv2i7i9j18bco.apps.googleusercontent.com';
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
 * SPA router çakışmalarını ve boş sayfa kalma sorununu engeller.
 */
export const handleGoogleLogin = (role: 'buyer' | 'seller' = 'buyer') => {
  const clientId = getGoogleClientId();
  const redirectUri = encodeURIComponent(`${window.location.origin}/auth/google/callback`);
  const scope = encodeURIComponent('openid email profile');
  const state = encodeURIComponent(JSON.stringify({ role }));
  
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}&prompt=select_account`;
};
