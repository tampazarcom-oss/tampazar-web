/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function updatePageSEO(pathname: string, params?: { storeName?: string; productTitle?: string; productPrice?: number }) {
  let title = 'TamPazar | Komisyonsuz Hibrit Pazaryeri & Açık Dijital AVM';
  let description = 'tampazar.com hibrit pazaryeri ve SaaS ekosistemi: Doğrudan POS tahsilatı, GİB e-Fatura muhasebe entegrasyonu ve sıfır komisyon.';
  let robots = 'index, follow';
  let canonical = `https://tampazar.com${pathname}`;

  if (pathname === '/sehir-avm') {
    title = "Şehrin Açık Dijital AVM'si | Yerel Esnaf Keşfi | TamPazar";
    description = "Fiziksel çarşıların, semt esnafının ve yerel dükkânların dijital buluşma noktası. QR menü, termal tesisat, zanaatkâr ve toptan tedarikçiler.";
  } else if (pathname.startsWith('/dukkan/')) {
    const sName = params?.storeName || 'Esnaf Mağazası';
    title = `${sName} | Doğrudan İletişim & POS | TamPazar`;
    description = `${sName} resmi dijital dükkânı. Ürünleri inceleyin, doğrudan esnafın Sanal POS'u ile güvenle alışveriş yapın veya konum bilgisine ulaşın.`;
  } else if (pathname.startsWith('/urun/')) {
    const pTitle = params?.productTitle || 'Özel Ürün';
    const pPrice = params?.productPrice ? `${params.productPrice} TL` : '';
    title = `${pTitle} ${pPrice ? `- ${pPrice}` : ''} | TamPazar`;
    description = `${pTitle} avantajlı fiyatı ve doğrudan esnaf güvencesiyle tampazar.com'da. Aynı gün kargo ve GİB e-Fatura uyumlu.`;
  } else if (pathname.startsWith('/yonetim') || pathname.startsWith('/saas-konsol')) {
    title = "TamPazar İşletim Sistemi & SaaS Konsol";
    description = "Esnaf ve işletmeler için özel olarak tasarlanmış modüler e-ticaret ve ön muhasebe yönetim paneli.";
    robots = 'noindex, nofollow';
  } else if (['/mesafeli-satis', '/gizlilik', '/kvkk', '/cerez-politikasi', '/iade-ve-degisim'].includes(pathname)) {
    title = `Yasal Mevzuat & Sözleşmeler | TamPazar`;
    description = `6502 sayılı tüketici kanunu ve GİB mevzuatına uygun yasal bilgilendirme ve sözleşmeler.`;
  }

  document.title = title;

  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', description);

  let metaRobots = document.querySelector('meta[name="robots"]');
  if (!metaRobots) {
    metaRobots = document.createElement('meta');
    metaRobots.setAttribute('name', 'robots');
    document.head.appendChild(metaRobots);
  }
  metaRobots.setAttribute('content', robots);

  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonical);
}
