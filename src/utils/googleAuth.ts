/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Tarayıcı seviyesinde doğrudan Google OAuth 2.0 yetkilendirme ekranına yönlendirir.
 * SPA router çakışmalarını ve boş sayfa kalma sorununu engeller.
 */
export const handleGoogleLogin = (role: 'buyer' | 'seller' = 'buyer') => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '329969897207-usdb3sbbn8j6c3m61qflv2i7i9j18bco.apps.googleusercontent.com';
  const redirectUri = encodeURIComponent(`${window.location.origin}/auth/google/callback`);
  const scope = encodeURIComponent('openid email profile');
  const state = encodeURIComponent(JSON.stringify({ role }));
  
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}&prompt=select_account`;
};
