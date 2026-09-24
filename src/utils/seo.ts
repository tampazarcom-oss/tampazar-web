/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * TamPazar Kurumsal SEO & GEO (Generative Engine Optimization) Motoru
 * 
 * Google, Yandex, Bing arama motorları ile ChatGPT, Gemini, Perplexity, Claude
 * gibi Yapay Zekâ modelleri için Schema.org (JSON-LD), OpenGraph, Twitter Cards,
 * Canonical URL ve anlamsal üstveri üretim fabrikası.
 */

export type CommercialPillar = 'tamkargo' | 'tamhizli' | 'tamusta' | 'tamdijital' | 'tamseans';

export interface SeoBreadcrumbItem {
  name: string;
  url: string;
}

export interface SeoProductData {
  title: string;
  slug: string;
  description?: string;
  price: number;
  originalPrice?: number;
  sku?: string;
  category: string;
  categorySlug?: string;
  images: string[];
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  pillar?: CommercialPillar;
  sector?: 'RETAIL' | 'WHOLESALE' | 'SERVICE' | 'FOOD' | 'EMERGENCY' | 'DIGITAL' | 'CONSULTATION';
  store: {
    name: string;
    slug: string;
    city?: string;
    district?: string;
    phone?: string;
    whatsapp?: string;
    address?: string;
    rating?: number;
    reviewCount?: number;
  };
  // TamDijital Alanları
  digitalFormats?: string[];
  digitalFileName?: string;
  digitalFileSize?: string;
  licenseType?: 'personal' | 'commercial';
  // TamSeans Alanları
  sessionDurationMin?: number;
  sessionChannel?: string;
  expertTitle?: string;
  meetingLink?: string;
  // TamUsta & Yerel Servis Alanları
  lat?: number;
  lng?: number;
  isEmergency247?: boolean;
  workingHours?: string;
  etaMinutes?: string;
  serviceDuration?: string;
}

export interface SeoStoreData {
  name: string;
  slug: string;
  legalTitle?: string;
  slogan?: string;
  about?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  phone?: string;
  whatsapp?: string;
  websiteUrl?: string;
  city?: string;
  district?: string;
  fullAddress?: string;
  googleMapsUrl?: string;
  workingHours?: string;
  rating?: number;
  reviewCount?: number;
  taxOffice?: string;
  taxNumber?: string;
  paymentProvider?: string;
}

export interface SeoCategoryItem {
  name: string;
  url: string;
  image?: string;
  price?: number;
}

export interface SeoOptions {
  pathname: string;
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'product' | 'profile' | 'article';
  robots?: string;
  product?: SeoProductData;
  store?: SeoStoreData;
  breadcrumbs?: SeoBreadcrumbItem[];
  collectionItems?: SeoCategoryItem[];
}

const BASE_URL = 'https://tampazar.com';
const BRAND_NAME = 'TamPazar';
const DEFAULT_OG_IMAGE = 'https://tampazar.com/tampazar-mark-transparent-1024.png';

// =========================================================================
// 1. DİNAMİK SCHEMA.ORG (JSON-LD) ŞEMA FABRİKASI
// =========================================================================

/**
 * 1. BreadcrumbList (Navigasyon Hiyerarşisi)
 */
export function buildBreadcrumbSchema(breadcrumbs: SeoBreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      'position': idx + 1,
      'name': crumb.name,
      'item': crumb.url.startsWith('http') ? crumb.url : `${BASE_URL}${crumb.url}`
    }))
  };
}

/**
 * 2. Fiziksel Ürünler (TamKargo / TamHızlı)
 */
export function buildPhysicalProductSchema(product: SeoProductData) {
  const fullUrl = `${BASE_URL}/urun/${product.slug}`;
  const images = product.images.length > 0 ? product.images : [DEFAULT_OG_IMAGE];

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${fullUrl}#product`,
    'name': product.title,
    'description': product.description || `${product.title} en avantajlı üretici fiyatıyla TamPazar'da.`,
    'image': images,
    'sku': product.sku || `TPZ-${product.slug.slice(0, 10).toUpperCase()}`,
    'category': product.category,
    'brand': {
      '@type': 'Brand',
      'name': product.store.name || BRAND_NAME
    },
    'offers': {
      '@type': 'Offer',
      'url': fullUrl,
      'priceCurrency': 'TRY',
      'price': product.price,
      'priceValidUntil': '2027-12-31',
      'itemCondition': 'https://schema.org/NewCondition',
      'availability': product.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      'seller': {
        '@type': 'LocalBusiness',
        'name': product.store.name,
        'telephone': product.store.phone || '+908500000000',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': product.store.district || 'Merkez',
          'addressRegion': product.store.city || 'İstanbul',
          'addressCountry': 'TR'
        }
      }
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': (product.rating || 4.9).toString(),
      'reviewCount': (product.reviewCount || 120).toString(),
      'bestRating': '5',
      'worstRating': '1'
    }
  };
}

/**
 * 3. Yerel Hizmetler, Ustalar & Acil Çağrı (TamUsta)
 */
export function buildUstaServiceSchema(service: SeoProductData) {
  const fullUrl = `${BASE_URL}/urun/${service.slug}`;
  const phone = service.store.phone || '+908500000000';
  const city = service.store.city || 'Ordu';
  const district = service.store.district || 'Merkez';

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': `${fullUrl}#localbusiness`,
        'name': service.store.name,
        'image': service.images[0] || DEFAULT_OG_IMAGE,
        'telephone': phone,
        'priceRange': service.price ? `₺${service.price}` : '₺₺',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': service.store.address || `${district} Esnaf Çarşısı`,
          'addressLocality': district,
          'addressRegion': city,
          'addressCountry': 'TR'
        },
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': service.lat || 40.9835,
          'longitude': service.lng || 37.8780
        },
        'openingHoursSpecification': [
          {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            'opens': service.isEmergency247 ? '00:00' : '08:30',
            'closes': service.isEmergency247 ? '23:59' : '20:00'
          }
        ],
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': (service.rating || service.store.rating || 4.9).toString(),
          'reviewCount': (service.reviewCount || service.store.reviewCount || 45).toString()
        }
      },
      {
        '@type': 'Service',
        '@id': `${fullUrl}#service`,
        'name': service.title,
        'serviceType': service.category,
        'provider': {
          '@id': `${fullUrl}#localbusiness`
        },
        'areaServed': {
          '@type': 'AdministrativeArea',
          'name': `${district}, ${city}`
        },
        'offers': {
          '@type': 'Offer',
          'price': service.price,
          'priceCurrency': 'TRY',
          'availability': 'https://schema.org/InStock',
          'url': fullUrl
        }
      }
    ]
  };
}

/**
 * 4. Dijital Varlıklar (TamDijital - Desen, Kod, Vektör, 3D Dosya)
 */
export function buildDigitalDocumentSchema(digital: SeoProductData) {
  const fullUrl = `${BASE_URL}/urun/${digital.slug}`;
  const formats = digital.digitalFormats || ['ZIP', 'PDF'];
  const primaryFormat = formats[0] || 'ZIP';

  return {
    '@context': 'https://schema.org',
    '@type': ['Product', 'DigitalDocument'],
    '@id': `${fullUrl}#digital`,
    'name': digital.title,
    'description': digital.description || `${digital.title} anında indirilebilir lisanslı dijital dosya paketi.`,
    'image': digital.images[0] || DEFAULT_OG_IMAGE,
    'fileFormat': formats.map(fmt => `application/${fmt.toLowerCase()}`).join(', '),
    'encodingFormat': primaryFormat,
    'hasPart': formats.map(fmt => ({
      '@type': 'DigitalDocument',
      'name': `${digital.title} (.${fmt})`,
      'encodingFormat': fmt
    })),
    'license': digital.licenseType === 'commercial' 
      ? 'https://creativecommons.org/licenses/by/4.0/ (Ticari Üretim Lisansı)' 
      : 'https://creativecommons.org/licenses/by-nc/4.0/ (Bireysel Kullanım Lisansı)',
    'brand': {
      '@type': 'Brand',
      'name': digital.store.name
    },
    'offers': {
      '@type': 'Offer',
      'url': fullUrl,
      'price': digital.price,
      'priceCurrency': 'TRY',
      'category': 'DigitalDownload',
      'availability': 'https://schema.org/InStock',
      'seller': {
        '@type': 'Organization',
        'name': digital.store.name
      }
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': (digital.rating || 5.0).toString(),
      'reviewCount': (digital.reviewCount || 95).toString()
    }
  };
}

/**
 * 5. Online Seanslar & Danışmanlık (TamSeans)
 */
export function buildOnlineSessionSchema(session: SeoProductData) {
  const fullUrl = `${BASE_URL}/urun/${session.slug}`;
  const durationMin = session.sessionDurationMin || 45;

  return {
    '@context': 'https://schema.org',
    '@type': ['Service', 'ProfessionalService'],
    '@id': `${fullUrl}#session`,
    'name': session.title,
    'serviceType': session.category,
    'description': session.description || `${session.title} - ${durationMin} dakikalık interaktif Google Meet canlı video seansı.`,
    'image': session.images[0] || DEFAULT_OG_IMAGE,
    'provider': {
      '@type': 'Person',
      'name': session.store.name,
      'jobTitle': session.expertTitle || 'Uzman Danışman'
    },
    'offers': {
      '@type': 'Offer',
      'price': session.price,
      'priceCurrency': 'TRY',
      'availability': 'https://schema.org/InStock',
      'url': fullUrl,
      'validThrough': '2027-12-31'
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': (session.rating || 5.0).toString(),
      'reviewCount': (session.reviewCount || 64).toString()
    }
  };
}

/**
 * 6. Esnaf & Mağaza Sayfası (schema.org/LocalBusiness)
 */
export function buildStoreProfileSchema(store: SeoStoreData) {
  const fullUrl = `${BASE_URL}/dukkan/${store.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${fullUrl}#store`,
    'name': store.name,
    'legalName': store.legalTitle || store.name,
    'description': store.slogan || store.about || `${store.name} resmi dijital mağazası. %0 komisyon doğrudan POS.`,
    'image': store.avatarUrl || store.bannerUrl || DEFAULT_OG_IMAGE,
    'url': fullUrl,
    'telephone': store.phone || '+908500000000',
    'priceRange': '₺₺',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': store.fullAddress || 'Sanayi & Çarşı Bölgesi',
      'addressLocality': store.district || 'Merkez',
      'addressRegion': store.city || 'İstanbul',
      'addressCountry': 'TR'
    },
    'hasMap': store.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(store.name)}`,
    'openingHours': store.workingHours || 'Mo-Sa 08:30-19:00',
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': (store.rating || 4.9).toString(),
      'reviewCount': (store.reviewCount || 120).toString(),
      'bestRating': '5',
      'worstRating': '1'
    }
  };
}

/**
 * 7. Kategori ve Arama Listeleri (CollectionPage & ItemList)
 */
export function buildCollectionPageSchema(title: string, description: string, pathname: string, items: SeoCategoryItem[]) {
  const fullUrl = `${BASE_URL}${pathname}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${fullUrl}#collection`,
    'name': title,
    'description': description,
    'url': fullUrl,
    'mainEntity': {
      '@type': 'ItemList',
      'numberOfItems': items.length,
      'itemListElement': items.map((item, idx) => ({
        '@type': 'ListItem',
        'position': idx + 1,
        'name': item.name,
        'url': item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
        'image': item.image
      }))
    }
  };
}

/**
 * 8. Ana Sayfa (WebSite & Global Arama Eylemi)
 */
export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    'name': BRAND_NAME,
    'alternateName': 'TamPazar Açık Dijital AVM & SaaS Ekosistemi',
    'url': `${BASE_URL}/`,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${BASE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

/**
 * 9. Kurumsal Organizasyon
 */
export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    'name': BRAND_NAME,
    'url': BASE_URL,
    'logo': `${BASE_URL}/tampazar-mark-transparent-1024.png`,
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+90-850-242-8797',
      'contactType': 'customer service',
      'areaServed': 'TR',
      'availableLanguage': ['Turkish', 'English']
    },
    'sameAs': [
      'https://twitter.com/tampazar',
      'https://instagram.com/tampazar'
    ]
  };
}

// =========================================================================
// 2. DOM ENJEKTÖRÜ (CANONICAL, META, OPENGRAPH, TWITTER, JSON-LD)
// =========================================================================

function setMetaTag(nameOrProperty: string, content: string, isProperty = false) {
  const selector = isProperty ? `meta[property="${nameOrProperty}"]` : `meta[name="${nameOrProperty}"]`;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(isProperty ? 'property' : 'name', nameOrProperty);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setCanonicalLink(url: string) {
  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', url);
}

export function injectStructuredData(schemaObj: object | object[]) {
  let script = document.getElementById('tampazar-jsonld');
  if (!script) {
    script = document.createElement('script');
    script.id = 'tampazar-jsonld';
    script.setAttribute('type', 'application/ld+json');
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schemaObj, null, 2);
}

// =========================================================================
// 3. EVRENSEL ORKESTRATÖR (applyPageSEO)
// =========================================================================

export function applyPageSEO(options: SeoOptions) {
  if (typeof window === 'undefined') return;

  const currentOrigin = window.location.origin || BASE_URL;
  const canonicalUrl = options.canonicalUrl || `${currentOrigin}${options.pathname}`;

  // 1. Dinamik Başlık ve Açıklama Çözümü
  let pageTitle = options.title;
  let pageDesc = options.description;
  let pageKeywords = options.keywords || ['tampazar', 'komisyonsuz pazaryeri', 'byo pos', 'esnaf e-ticaret', 'gib e-fatura'];
  let ogImage = options.ogImage || DEFAULT_OG_IMAGE;
  let ogType = options.ogType || 'website';
  let robots = options.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  const schemasToInject: object[] = [];

  // A. ÜRÜN VEYA HİZMET SAYFASI (/urun/...)
  if (options.product) {
    const p = options.product;
    const citySuffix = p.store.city ? ` ${p.store.city}` : '';
    const priceText = p.price ? `₺${p.price.toLocaleString('tr-TR')}` : '';

    if (!pageTitle) {
      pageTitle = `${p.title} - ${priceText} En Uygun Fiyat & %0 Komisyon | TamPazar${citySuffix}`;
    }

    if (!pageDesc) {
      if (p.pillar === 'tamdijital' || p.sector === 'DIGITAL') {
        pageDesc = `${p.title} lisanslı dijital dosya paketi (${p.digitalFormats?.join(', ') || 'DST, PES, DXF'}). Sıfır kargo bekleme süresiyle anında indir. %0 komisyon doğrudan esnaf fiyatı.`;
      } else if (p.pillar === 'tamseans' || p.sector === 'CONSULTATION') {
        pageDesc = `${p.title} - ${p.sessionDurationMin || 45} dakikalık interaktif Google Meet canlı video seansı. Uzmanından randevunu hemen oluştur.`;
      } else if (p.pillar === 'tamusta' || p.sector === 'SERVICE' || p.sector === 'EMERGENCY') {
        pageDesc = `${p.title} - ${p.store.district}/${p.store.city} bölgesinde doğrulanmış esnaf hizmeti. Anında konumuna çağır veya doğrudan ara.`;
      } else {
        pageDesc = `${p.title} avantajlı üretici fiyatı (${priceText}) ve doğrudan esnaf kasası güvencesiyle TamPazar'da. Aynı gün hızlı kargo ve GİB e-Fatura garantisi.`;
      }
    }

    ogType = 'product';
    if (p.images && p.images[0]) ogImage = p.images[0];

    pageKeywords = [
      p.title,
      p.category,
      p.store.name,
      p.store.city || 'Türkiye',
      p.pillar || 'pazaryeri',
      'esnaf fiyatı',
      'komisyonsuz alışveriş'
    ];

    // Şema Üretimi (Ticaret Bacağına Göre)
    if (p.pillar === 'tamdijital' || p.sector === 'DIGITAL') {
      schemasToInject.push(buildDigitalDocumentSchema(p));
    } else if (p.pillar === 'tamseans' || p.sector === 'CONSULTATION') {
      schemasToInject.push(buildOnlineSessionSchema(p));
    } else if (p.pillar === 'tamusta' || p.sector === 'SERVICE' || p.sector === 'EMERGENCY') {
      schemasToInject.push(buildUstaServiceSchema(p));
    } else {
      schemasToInject.push(buildPhysicalProductSchema(p));
    }

    // Otomatik Navigasyon Hiyerarşisi (Breadcrumbs)
    const breadcrumbs: SeoBreadcrumbItem[] = options.breadcrumbs || [
      { name: 'Ana Sayfa', url: '/' },
      { name: p.category, url: `/sehir-avm` },
      { name: `${p.store.city || 'Yerel'} Esnafı`, url: `/dukkan/${p.store.slug}` },
      { name: p.title, url: `/urun/${p.slug}` }
    ];
    schemasToInject.push(buildBreadcrumbSchema(breadcrumbs));
  }

  // B. ESNAF / MAĞAZA SAYFASI (/dukkan/...)
  else if (options.store) {
    const s = options.store;
    if (!pageTitle) {
      pageTitle = `${s.name} - Resmi Dijital Dükkânı & Doğrudan POS | TamPazar ${s.city || ''}`;
    }
    if (!pageDesc) {
      pageDesc = `${s.name} (${s.district || 'Merkez'} / ${s.city || 'Türkiye'}) doğrudan iletişim ve ürün vitrini. Telefon: ${s.phone || 'Şeffaf'}, WhatsApp hattı ve %0 komisyonlu esnaf Sanal POS'u.`;
    }
    ogType = 'profile';
    if (s.avatarUrl || s.bannerUrl) ogImage = s.avatarUrl || s.bannerUrl || ogImage;

    schemasToInject.push(buildStoreProfileSchema(s));

    const breadcrumbs: SeoBreadcrumbItem[] = options.breadcrumbs || [
      { name: 'Ana Sayfa', url: '/' },
      { name: 'Açık Dijital AVM', url: '/sehir-avm' },
      { name: s.name, url: `/dukkan/${s.slug}` }
    ];
    schemasToInject.push(buildBreadcrumbSchema(breadcrumbs));
  }

  // C. ŞEHİR AÇIK DİJİTAL AVM SAYFASI (/sehir-avm)
  else if (options.pathname === '/sehir-avm') {
    if (!pageTitle) {
      pageTitle = "Şehrin Açık Dijital AVM'si - Konuma En Yakın Esnaf, Usta & Dönerci | TamPazar";
    }
    if (!pageDesc) {
      pageDesc = "Fiziksel çarşıların ve mahalle esnafının dijital buluşma noktası. Konumuna en yakın tesisatçı, nöbetçi çekici, çilingir, dönerci ve zanaatkârlar bir arada.";
    }
    pageKeywords = ['açık dijital avm', 'yerel esnaf', 'en yakın usta', 'nöbetçi çekici', 'konum bazlı sipariş', 'komisyonsuz alışveriş'];

    schemasToInject.push({
      '@context': 'https://schema.org',
      '@type': 'ShoppingCenter',
      '@id': `${BASE_URL}/sehir-avm#mall`,
      'name': "TamPazar Şehrin Açık Dijital AVM'si",
      'description': pageDesc,
      'url': `${BASE_URL}/sehir-avm`,
      'openingHours': 'Mo-Su 00:00-24:00'
    });

    if (options.collectionItems && options.collectionItems.length > 0) {
      schemasToInject.push(buildCollectionPageSchema(
        "Şehrin En Çok Tercih Edilen Esnaf ve Hizmetleri",
        pageDesc,
        '/sehir-avm',
        options.collectionItems
      ));
    }
  }

  // D. ANA SAYFA (/)
  else if (options.pathname === '/') {
    if (!pageTitle) {
      pageTitle = "TamPazar | Komisyonsuz Hibrit Pazaryeri, Açık Dijital AVM & Ön Muhasebe";
    }
    if (!pageDesc) {
      pageDesc = "Aracı komisyonu yok, doğrudan esnaf fiyatı var! Perakende, toptan B2B, TamDijital dosya indirme, TamSeans canlı randevu ve yerel esnaf tek platformda.";
    }
    schemasToInject.push(buildWebSiteSchema());
    schemasToInject.push(buildOrganizationSchema());
  }

  // E. YÖNETİM & SAAS KONSOL SAYFALARI (/yonetim, /saas-konsol)
  else if (options.pathname.startsWith('/yonetim') || options.pathname.startsWith('/saas-konsol')) {
    pageTitle = "TamPazar İşletim Sistemi & SaaS Konsolu";
    pageDesc = "Esnaf ve işletmeler için modüler e-ticaret, BYO POS yapılandırması ve GİB e-Fatura ön muhasebe yönetim paneli.";
    robots = 'noindex, nofollow';
  }

  // F. TÜKETİCİ HESABIM (/hesabim/*)
  else if (options.pathname.startsWith('/hesabim')) {
    pageTitle = "Hesabım & Dijital Arşivim | TamPazar";
    pageDesc = "TamPazar tüketici sipariş geçmişi, TamDijital lisanslı dosya indirme kütüphanesi ve TamSeans randevu ajandası.";
    robots = 'noindex, nofollow';
  }

  // G. YASAL SÖZLEŞMELER
  else if (['/mesafeli-satis', '/gizlilik', '/kvkk', '/cerez-politikasi', '/iade-ve-degisim'].includes(options.pathname)) {
    if (!pageTitle) pageTitle = "Yasal Mevzuat, Tüketici Sözleşmeleri & KVKK | TamPazar";
    if (!pageDesc) pageDesc = "6502 sayılı Tüketicinin Korunması Hakkında Kanun, ETBİS ve GİB UBL-TR mevzuatına uygun standart sözleşmeler.";
  }

  // Fallback defaults
  if (!pageTitle) pageTitle = "TamPazar | Komisyonsuz Hibrit Pazaryeri & Açık Dijital AVM";
  if (!pageDesc) pageDesc = "tampazar.com hibrit pazaryeri: Doğrudan POS tahsilatı, GİB e-Fatura entegrasyonu ve sıfır komisyon.";

  // DOM Güncellemeleri
  document.title = pageTitle;

  setMetaTag('description', pageDesc);
  setMetaTag('keywords', pageKeywords.join(', '));
  setMetaTag('robots', robots);
  setCanonicalLink(canonicalUrl);

  // Open Graph Etiketleri
  setMetaTag('og:title', pageTitle, true);
  setMetaTag('og:description', pageDesc, true);
  setMetaTag('og:image', ogImage, true);
  setMetaTag('og:url', canonicalUrl, true);
  setMetaTag('og:type', ogType, true);
  setMetaTag('og:site_name', BRAND_NAME, true);
  setMetaTag('og:locale', 'tr_TR', true);

  // Twitter / X Etiketleri
  setMetaTag('twitter:card', 'summary_large_image');
  setMetaTag('twitter:title', pageTitle);
  setMetaTag('twitter:description', pageDesc);
  setMetaTag('twitter:image', ogImage);
  setMetaTag('twitter:site', '@tampazar');

  // JSON-LD Enjeksiyonu
  if (schemasToInject.length > 0) {
    if (schemasToInject.length === 1) {
      injectStructuredData(schemasToInject[0]);
    } else {
      injectStructuredData({
        '@context': 'https://schema.org',
        '@graph': schemasToInject
      });
    }
  }
}

/**
 * Geriye dönük uyumluluk için alias
 */
export function updatePageSEO(pathname: string, params?: { storeName?: string; productTitle?: string; productPrice?: number }) {
  applyPageSEO({
    pathname,
    title: params?.productTitle ? `${params.productTitle} - En Uygun Fiyat | TamPazar` : undefined,
    store: params?.storeName ? { name: params.storeName, slug: pathname.replace('/dukkan/', '') } : undefined
  });
}
