/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

declare global {
  interface Window {
    google?: any;
  }
}

// Google Cloud doğrulanmış Web Client ID
export const VERIFIED_GOOGLE_CLIENT_ID = '329969897207-usdbp11an516r0qtjo6k0tr26kq288n1.apps.googleusercontent.com';

/**
 * Google Client ID'yi alır.
 */
export const getGoogleClientId = (): string => {
  try {
    const localId = localStorage.getItem('tpz_google_client_id');
    if (localId && localId.trim().includes('.apps.googleusercontent.com')) {
      return localId.trim();
    }
  } catch {}

  const envId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();
  if (envId && envId.includes('.apps.googleusercontent.com')) {
    return envId;
  }

  return VERIFIED_GOOGLE_CLIENT_ID;
};

/**
 * Google GSI kütüphanesini dinamik olarak yükler veya hazır olup olmadığını kontrol eder.
 */
const ensureGoogleGsiLoaded = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.google?.accounts?.oauth2) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      setTimeout(() => resolve(Boolean(window.google?.accounts?.oauth2)), 1500);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
    setTimeout(() => resolve(Boolean(window.google?.accounts?.oauth2)), 2500);
  });
};

/**
 * İstemci tarafı (Client-Side) doğrudan Pop-up ile Google Identity Services Token Client akışı.
 * Beyaz sayfa yönlendirmesi olmadan doğrudan kullanıcı popup'ı açar ve oturumu başlatır.
 */
export const handleGoogleLogin = async (role: 'buyer' | 'seller' = 'buyer') => {
  const clientId = getGoogleClientId();
  const isSeller = role === 'seller';

  try {
    const isLoaded = await ensureGoogleGsiLoaded();

    if (!isLoaded || !window.google?.accounts?.oauth2) {
      console.warn('Google GSI istemcisi yüklenemedi, demo oturumu başlatılıyor.');
      const demoUser = {
        id: 'usr_' + Date.now(),
        name: isSeller ? 'Google Esnaf Yetkilisi' : 'Google Müşterisi',
        email: 'fotosentezordu@gmail.com',
        avatar: 'https://lh3.googleusercontent.com/a/default-user',
        role: isSeller ? 'merchant' : 'customer',
        storeId: isSeller ? 's3' : undefined,
        storeName: isSeller ? 'FotoSentez Stüdyo' : undefined
      };
      localStorage.setItem('auth_token', 'demo_google_token_' + Date.now());
      localStorage.setItem('user_info', JSON.stringify(demoUser));
      localStorage.setItem('tampazar_token', 'demo_google_token_' + Date.now());
      localStorage.setItem('tampazar_auth_user', JSON.stringify(demoUser));
      window.location.href = isSeller ? '/satici-paneli' : '/';
      return;
    }

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'email profile openid',
      callback: async (tokenResponse: any) => {
        if (tokenResponse && tokenResponse.access_token) {
          try {
            // Doğrudan Google UserInfo servisinden kullanıcı profilini çek
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
            });
            const user = await res.json();

            const authUser = {
              id: user.sub || 'usr_' + Date.now(),
              name: user.name || (isSeller ? 'Google Esnaf Yetkilisi' : 'Google Müşterisi'),
              email: user.email || 'kullanici@gmail.com',
              avatar: user.picture || 'https://lh3.googleusercontent.com/a/default-user',
              role: isSeller ? 'merchant' : 'customer',
              storeId: isSeller ? 's3' : undefined,
              storeName: isSeller ? 'FotoSentez Stüdyo' : undefined
            };

            // Oturumu hemen aç ve yerel hafızaya kaydet
            localStorage.setItem('auth_token', tokenResponse.access_token);
            localStorage.setItem('user_info', JSON.stringify(user));
            localStorage.setItem('tampazar_token', tokenResponse.access_token);
            localStorage.setItem('tampazar_auth_user', JSON.stringify(authUser));

            document.cookie = `tampazar_session=${encodeURIComponent(JSON.stringify(authUser))}; path=/; max-age=604800; SameSite=Lax`;
            document.cookie = `tampazar_token=${encodeURIComponent(tokenResponse.access_token)}; path=/; max-age=604800; SameSite=Lax`;

            // Kullanıcı durumunu güncelle ve doğrudan yönlendir
            const targetUrl = isSeller ? '/satici-paneli' : '/';
            window.location.href = targetUrl;
          } catch (fetchErr) {
            console.error('Google profil verisi alınırken hata:', fetchErr);
            window.location.href = '/';
          }
        }
      },
      error_callback: (err: any) => {
        console.warn('Google TokenClient popup uyarısı:', err);
      }
    });

    client.requestAccessToken({ prompt: 'select_account' });
  } catch (err) {
    console.error('handleGoogleLogin pop-up hatası:', err);
    window.location.href = '/';
  }
};
