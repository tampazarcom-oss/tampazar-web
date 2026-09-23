/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai';

export interface ImageSeoMetadata {
  altText: string;
  caption: string;
  keywords: string[];
  suggestedTags: string[];
  structuredDescription: string;
}

/**
 * Esnaf fotoğraf yüklediğinde Google ve AI indeksleyicileri için
 * kusursuz semantik görsel açıklaması ve anahtar kelimeler türetir.
 */
export async function generateImageSeoMetadata(
  imageBase64: string,
  businessContext: { storeName: string; city: string; category: string }
): Promise<ImageSeoMetadata> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof window !== 'undefined' ? (window as any).GEMINI_API_KEY : '');

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
Sen dünyanın en gelişmiş e-ticaret ve yerel arama (Local SEO) uzmanısın.
Aşağıda verilen ürün/hizmet görselini ve bağlamı analiz et.
Bağlam:
- İşletme Adı: ${businessContext.storeName}
- Şehir/Bölge: ${businessContext.city}
- Sektör: ${businessContext.category}

Google Görseller, Google Lens ve Yapay Zeka motorlarının (Perplexity, ChatGPT, Gemini)
bu görseli tam olarak anlayabilmesi için aşağıdaki JSON formatında çıktı ver:

{
  "altText": "Ekran okuyucular ve Google botları için 100-120 karakterlik, arama hacmi yüksek, anahtar kelime zengin net görsel açıklaması",
  "caption": "Görselin ne içerdiğini açıklayan net altyazı",
  "keywords": ["anahtar1", "anahtar2", "lokasyon anahtar", "sektör terimi"],
  "suggestedTags": ["etiket1", "etiket2"],
  "structuredDescription": "Yapay zekaların ürün/hizmet hakkında çıkarım yapabileceği detaylı 2-3 cümlelik semantik açıklama"
}
Sadece geçerli JSON döndür.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: imageBase64,
                },
              },
            ],
          },
        ],
      });

      const rawText = response.text || '{}';
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as ImageSeoMetadata;
      }
    } catch (err) {
      console.error('AI SEO Görsel Çıkarım Hatası:', err);
    }
  }

  // Graceful fallback for browser environment without explicit API key
  return {
    altText: `${businessContext.storeName} - ${businessContext.category} kaliteli ürün ve profesyonel hizmet çözümleri`,
    caption: `${businessContext.city} bölgesinde ${businessContext.category} alanında güvenilir esnaf çözümü`,
    keywords: [businessContext.city, businessContext.category, businessContext.storeName, 'yerel esnaf', 'kaliteli ürün'],
    suggestedTags: [businessContext.category, 'Popüler Ürün'],
    structuredDescription: `${businessContext.storeName} güvencesiyle ${businessContext.city} şehrinde sunulan birinci sınıf ${businessContext.category} ürünü/hizmeti. Müşteri memnuniyeti ve orijinal malzeme garantisiyle.`
  };
}
