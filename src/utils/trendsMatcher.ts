/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';
import { fetchLiveGoogleTrends } from './googleTrends';

interface ProductInput {
  title: string;
  category: string;
  description: string;
  city: string;
}

export interface OptimizedSeoTags {
  matchedTrends: string[];       // Güncel Google Trendlerinden yakalananlar
  highVolumeKeywords: string[]; // Google'da en çok aranan niş kelimeler
  localSeoTags: string[];        // Şehir/İlçe bazlı esnaf etiketleri
  seoSlugSuffix: string;         // URL için arama motoru dostu ek
}

/**
 * Esnaf ürün yüklediğinde veya trendler yenilendiğinde
 * Google trendlerini ve arama niyetini ürüne enjekte eden robot.
 */
export async function matchTrendsToProduct(product: ProductInput): Promise<OptimizedSeoTags> {
  // 1. Google Türkiye'nin güncel arama trendlerini çek
  const liveTrends = await fetchLiveGoogleTrends();
  const trendKeywords = liveTrends.map(t => t.title).slice(0, 30);

  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof window !== 'undefined' ? (window as any).GEMINI_API_KEY : '');

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
Sen "tampazar.com" platformunun Otonom SEO & Google Trend Robotusun.
Aşağıda esnafın eklediği bir ürün/hizmet ve Google Türkiye'de şu anda en çok aranan trend konular verilmiştir.

ESNAF ÜRÜN/HİZMET BİLGİSİ:
- Başlık: ${product.title}
- Sektör/Kategori: ${product.category}
- Açıklama: ${product.description}
- Bölge: ${product.city}

GÜNCEL GOOGLE TÜRKİYE TRENDLERİ:
${trendKeywords.join(', ')}

GÖREVİN:
1. Google Türkiye trendleri veya son dönem mevsimsel tüketici arama eğilimleriyle bu ürün arasında ALAKALI ve MANTIKLI bağlantı kur (Alakasız trendleri kesinlikle ele, spam yapma).
2. İnsanların Google'da bu ürünü bulmak için yazabileceği yüksek hacimli arama kelimelerini üret.
3. Bölgesel (Local SEO) esnaf terimlerini dahil et.

Aşağıdaki JSON formatında yanıt ver:
{
  "matchedTrends": ["ilgili_trend1", "ilgili_trend2"],
  "highVolumeKeywords": ["google_arama_kelimesi_1", "kelime_2", "kelime_3"],
  "localSeoTags": ["${product.city} en iyi usta", "${product.city} ${product.category}"],
  "seoSlugSuffix": "arama-motoru-icin-optimize-ek"
}
Sadece JSON döndür.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const raw = response.text || '{}';
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]) as OptimizedSeoTags;
      }
    } catch (err) {
      console.error('[Trend Robotu] Parse hatası:', err);
    }
  }

  // Yedek Varsayılan Etiketler
  return {
    matchedTrends: trendKeywords.slice(0, 2),
    highVolumeKeywords: [product.title, product.category, 'komisyonsuz doğrudan esnaftan', 'en iyi fiyat'],
    localSeoTags: [`${product.city} ${product.category}`, `${product.city} güvenilir esnaf`],
    seoSlugSuffix: 'uygun-fiyat-dogrudan-satis'
  };
}
