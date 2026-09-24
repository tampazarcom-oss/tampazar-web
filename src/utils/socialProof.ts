/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Basit string hash fonksiyonu (kararlı ve deterministik sayı üretimi için)
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // 32bit integer
  }
  return Math.abs(hash);
}

export interface ProductSocialProofData {
  salesCount: number;
  hasHighSales: boolean; // >= 5
  badgeText: string;
  badgeType: 'new' | 'fresh' | 'high_demand' | 'b2b_volume';
  activeViewers: number;
  todayViews: number;
  recentSoldDays: number;
  wholesaleShipments: number;
  wholesaleBadgeText: string;
}

export interface StoreSocialProofData {
  totalOrders: number;
  hasHighVolume: boolean; // >= 10
  experienceBadge: string;
  volumeBadge: string;
  ratingScore: number;
  reviewCount: number;
  ratingFormatted: string; // e.g. "⭐ 4.9 / 5.0 (68 Değerlendirme)"
}

/**
 * Ürün için eşik kontrollü sosyal kanıt ve canlı ilgi verisi üretir
 */
export function getProductSocialProof(
  idOrSlug: string,
  explicitSalesCount?: number,
  options?: { isB2B?: boolean; isService?: boolean }
): ProductSocialProofData {
  const seed = hashString(idOrSlug || 'tampazar-product-default');
  
  // Eğer açıkça salesCount verilmemişse deterministik bir sayı belirle
  const computedSales = explicitSalesCount !== undefined 
    ? explicitSalesCount 
    : (seed % 42); // 0-41 arası gerçekçi dağılım

  const hasHighSales = computedSales >= 5;
  const isFresh = (seed % 2) === 0;

  let badgeText = '';
  let badgeType: 'new' | 'fresh' | 'high_demand' | 'b2b_volume' = 'new';

  if (!hasHighSales) {
    badgeType = isFresh ? 'fresh' : 'new';
    badgeText = isFresh ? '⭐ Taze Reyonda' : '🌱 Yeni Mahalle Ürünü';
  } else {
    badgeType = 'high_demand';
    if ((seed % 3) === 0) {
      badgeText = `🔥 Son 3 günde ${computedSales} adet satıldı`;
    } else {
      badgeText = `🔥 Bu ay ${computedSales}+ mahalleli sipariş etti`;
    }
  }

  // Canlı izleyici ve günlük görüntülenme (3-12 canlı inceleyen, 38-160 günlük)
  const activeViewers = 3 + (seed % 10);
  const todayViews = 38 + (seed % 125);
  const recentSoldDays = 1 + (seed % 3);

  // B2B Toptan koli/seri sevk hacmi (18-96 koli/seri)
  const wholesaleShipments = 18 + (seed % 79);
  const wholesaleBadgeText = `📦 Son 1 ayda ${wholesaleShipments} koli/seri sevk edildi`;

  return {
    salesCount: computedSales,
    hasHighSales,
    badgeText,
    badgeType,
    activeViewers,
    todayViews,
    recentSoldDays,
    wholesaleShipments,
    wholesaleBadgeText
  };
}

/**
 * Mağaza için eşik kontrollü güven, sipariş ve puan verisi üretir
 */
export function getStoreSocialProof(
  storeIdOrSlug: string,
  explicitRating?: number,
  explicitReviews?: number,
  explicitOrdersCount?: number
): StoreSocialProofData {
  const seed = hashString(storeIdOrSlug || 'tampazar-store-default');

  const computedOrders = explicitOrdersCount !== undefined
    ? explicitOrdersCount
    : (seed % 150); // 0-149 arası dağılım

  const hasHighVolume = computedOrders >= 10;

  // Tecrübe Rozeti alternatifleri
  const expBadges = [
    '🛡️ Fiziksel Doğrulanmış Mahalle Esnafı',
    '🎖️ 20+ Yıllık Yerel Tecrübe',
    '🌿 Zanaatkâr Mahalle Dükkânı',
    '⭐ Mahallenin Güvenilir Esnafı'
  ];
  const experienceBadge = expBadges[seed % expBadges.length];
  const volumeBadge = `✅ ${computedOrders}+ Başarılı Mahalle Teslimatı`;

  const ratingScore = explicitRating !== undefined ? explicitRating : (4.7 + ((seed % 4) * 0.1));
  const reviewCount = explicitReviews !== undefined ? explicitReviews : (18 + (seed % 82));
  const roundedRating = Number(ratingScore.toFixed(1));

  const ratingFormatted = `⭐ ${roundedRating} / 5.0 (${reviewCount} Değerlendirme)`;

  return {
    totalOrders: computedOrders,
    hasHighVolume,
    experienceBadge,
    volumeBadge,
    ratingScore: roundedRating,
    reviewCount,
    ratingFormatted
  };
}
