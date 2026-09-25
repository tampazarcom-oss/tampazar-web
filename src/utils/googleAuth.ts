/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Google Cloud projesinde tanımlanan doğrulanmış Web Client ID
export const VERIFIED_GOOGLE_CLIENT_ID = 'GERCEK_CLIENT_ID_BURAYA_YAPISTIRIN';

/**
 * Google OAuth 2.0 Web Client ID değerini dinamik ve güvenli şekilde çözer.
 * 1. Tarayıcı Hafızasındaki Override (kullanıcı/admin tarafından anında girilen kimlik)
 * 2. import.meta.env.VITE_GOOGLE_CLIENT_ID (.env yapılandırması)
 * 3. VERIFIED_GOOGLE_CLIENT_ID doğrulanmış kimlik sabiti
 */
export const getGoogleClientId = (): string => {
  // 1. Tarayıcı Depolaması (Arayüzden tanımlanmış güncel kimlik)
  try {
    const localId = localStorage.getItem('tpz_google_client_id');
    if (localId && localId.trim() && localId.includes('.apps.googleusercontent.com')) {
      return localId.trim();
    }
  } catch {}

  // 2. Vite Ortam Değişkeni (.env / VITE_GOOGLE_CLIENT_ID)
  const envId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();
  if (envId && !envId.includes('BURAYA_') && !envId.includes('CLIENT_IDYI') && envId !== 'placeholder') {
    return envId;
  }

  // 3. Doğrulanmış Proje Web Client ID Değeri
  return VERIFIED_GOOGLE_CLIENT_ID;
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
 * Eğer henüz Google Cloud Console'dan geçerli bir Web Client ID atanmamışsa
 * kullanıcıyı Google'ın 401 invalid_client hata sayfasına göndermek yerine
 * bilgilendirici arayüz yapılandırma ekranına yönlendirir.
 */
export const handleGoogleLogin = (role: 'buyer' | 'seller' = 'buyer') => {
  const clientId = getGoogleClientId();

  // Şablon metni veya eksik client id kontrolü (401 invalid_client hatasını önler)
  if (!clientId || clientId.includes('BURAYA_') || clientId === 'placeholder' || !clientId.includes('.apps.googleusercontent.com')) {
    const targetUrl = `/auth/google/callback?error=invalid_client_unconfigured&role=${encodeURIComponent(role)}`;
    if (window.location.pathname !== '/auth/google/callback') {
      window.location.href = targetUrl;
    }
    return;
  }

  const redirectUri = encodeURIComponent(`${window.location.origin}/auth/google/callback`);
  const scope = encodeURIComponent('openid email profile');
  const state = encodeURIComponent(JSON.stringify({ role }));
  
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}&prompt=select_account`;
};
