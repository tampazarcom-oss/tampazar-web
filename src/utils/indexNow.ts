/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Yeni ürün veya mağaza güncellendiğinde arama motorlarına 
 * saniyesinde ping atan IndexNow ve Arama Motoru Entegratörü
 */
export async function notifySearchEnginesOnContentChange(urls: string[]) {
  const host = 'tampazar.com';
  const apiKey = (import.meta as any).env?.VITE_INDEXNOW_API_KEY || 'tpz-secret-index-key';
  const keyLocation = `https://${host}/${apiKey}.txt`;

  // 1. Bing / Yandex / Seznam (IndexNow Konsorsiyumu)
  try {
    // In browser preview environments, CORS may apply to indexnow.org, so we wrap in try/catch safely
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      mode: 'no-cors',
      body: JSON.stringify({
        host,
        key: apiKey,
        keyLocation,
        urlList: urls,
      }),
    });
    console.log(`[SEO] ${urls.length} adet URL IndexNow servisine başarıyla bildirildi.`);
  } catch (error) {
    console.error('[SEO] IndexNow bildirimi başarısız:', error);
  }

  // 2. Google Sitemap Ping (Yeni sitemap güncellemesi)
  try {
    const sitemapUrl = encodeURIComponent(`https://${host}/sitemap.xml`);
    await fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`, { mode: 'no-cors' });
    console.log('[SEO] Google Sitemap Ping iletildi.');
  } catch (error) {
    console.error('[SEO] Google ping hatası:', error);
  }
}
