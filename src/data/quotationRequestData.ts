/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface QuotationCategory {
  id: string;
  name: string;
  iconName: string;
  popularSubServices: string[];
  description: string;
}

export interface QuotationRequest {
  id: string;
  requestNumber: string;
  category: string;
  categoryTitle: string;
  subService: string;
  title: string;
  description: string;
  quantityOrScope: string;
  attachments: string[];
  location: {
    city: string;
    district: string;
    neighborhood: string;
    fullAddressMasked: string;
    fullAddressReal?: string;
    distanceKm?: number;
  };
  timing: 'urgent' | 'within_24h' | 'this_week' | 'flexible';
  timingLabel: string;
  estimatedBudget?: string;
  scopeDetails?: {
    roomCount?: string;
    areaM2?: number;
    vehicleType?: string;
    urgencyLevel?: string;
    requiresInspection?: boolean;
    materialProvidedBy?: 'customer' | 'craftsman' | 'included';
  };
  customer: {
    id: string;
    name: string;
    maskedPhone: string;
    realPhone: string;
    email: string;
  };
  createdAt: string;
  expiresAt: string;
  status: 'open' | 'awarded' | 'cancelled';
  awardedQuoteId?: string;
  quotesCount: number;
}

export interface MerchantQuote {
  id: string;
  requestId: string;
  merchantId: string;
  merchantName: string;
  merchantAvatar: string;
  merchantRating: number;
  merchantReviewCount: number;
  merchantBadges: string[];
  certificationBadge?: string; // e.g. "Mesleki Yeterlilik (MYK Seviye 4) Onaylı"
  onTimeRate?: number; // e.g. 99 (99% on-time completion)
  portfolioPhotos?: { title: string; url: string }[]; // Before/after or portfolio works
  distanceKm: number;
  price: number;
  vatIncluded: boolean;
  duration: string;
  note: string;
  phone: string;
  whatsapp: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export const QUOTATION_CATEGORIES: QuotationCategory[] = [
  {
    id: 'oto-kurtarma',
    name: 'Oto Kurtarma, Çekici & Yol Yardım',
    iconName: 'Truck',
    popularSubServices: ['Binek Araç Şehir İçi Çekici', 'Akü Takviye & Lastik Yardım', 'Ağır Vasıta Kurtarma', 'Şehirlerarası Araç Transfer'],
    description: 'En yakın oto çekici ve yol yardım ustalarından anlık net fiyat alın.'
  },
  {
    id: 'tesisat',
    name: 'Su, Doğalgaz & Elektrik Tesisatı',
    iconName: 'Wrench',
    popularSubServices: ['Kırmadan Termal Su Kaçağı Tespiti', 'Kombi & Petek Temizliği', 'Elektrik Arıza & Pano Yenileme', 'Sıhhi Tesisat Montajı'],
    description: 'Kameralı ve sertifikalı tesisatçılardan sabit fiyat garantili teklifler.'
  },
  {
    id: 'tadilat-dekorasyon',
    name: 'Ev & İşyeri Tadilat, Boya, Alçı',
    iconName: 'Hammer',
    popularSubServices: ['Daire Komple Boya Badana', 'Mutfak & Banyo Yenileme', 'Alçıpan & Asma Tavan', 'Laminat Parke & Seramik'],
    description: 'Usta ve mimarlardan keşifli/keşifsiz malzeme dahil işçilik teklifleri.'
  },
  {
    id: 'fotograf-produksiyon',
    name: 'Fotoğraf, Video & Düğün/Katalog Çekimi',
    iconName: 'Camera',
    popularSubServices: ['E-Ticaret & Katalog Ürün Çekimi', 'Düğün / Nişan Dış Çekim', '4K Drone & Tanıtım Filmi', 'Etkinlik & Lansman Çekimi'],
    description: 'Profesyonel stüdyo ve serbest fotoğrafçılardan portföylü teklif toplayın.'
  },
  {
    id: 'nakliyat',
    name: 'Evden Eve Nakliyat & Eşya Taşıma',
    iconName: 'Package',
    popularSubServices: ['Şehir İçi Asansörlü Ev Taşıma', 'Parça Eşya / Kamyonet Taşıma', 'Ofis & Mağaza Nakliyesi', 'Şehirlerarası Sigortalı Sevk'],
    description: 'Asansörlü ve marangozlu yerel nakliyecilerden sigortalı fiyat teklifi.'
  },
  {
    id: 'cilingir-anahtar',
    name: '7/24 Çilingir & Kilit Değişimi',
    iconName: 'Key',
    popularSubServices: ['Çelik Kapı Kilit Açma (Hasarsız)', 'Oto Kapı Açma & İmmobilizer', 'Yüksek Güvenlikli Barel Değişimi', 'Kasa & Çelik Kilit'],
    description: '15-20 dakika içinde kapınıza gelecek ruhsatlı çilingirler.'
  },
  {
    id: 'ozel-mobilya',
    name: 'Özel Mobilya & Ahşap İmalatı',
    iconName: 'Layers',
    popularSubServices: ['Masif Kütük Masa / Sandalye', 'Özel Ölçü Giyinme Odası / Dolap', 'Mutfak Dolabı & Tezgah', 'Mağaza & Ofis Dekoru'],
    description: 'Atölye sahibi yerel marangoz ve mobilyacılardan direkt imalatçı fiyatı.'
  },
  {
    id: 'toplu-urun',
    name: 'Toptan / Kurumsal Özel Sipariş',
    iconName: 'ShoppingCart',
    popularSubServices: ['Logo Baskılı Promosyon Ürünleri', 'Restoran / Kafe Toptan Tedarik', 'Kurumsal Hediye Kutuları', 'Toplu Tekstil / İş Kıyafeti'],
    description: 'Yerel üretici esnaflardan toptan fiyat teklifi ve numune talebi.'
  }
];

export const INITIAL_QUOTATION_REQUESTS: QuotationRequest[] = [
  {
    id: 'req-101',
    requestNumber: 'TTK-2026-0812',
    category: 'tesisat',
    categoryTitle: 'Su, Doğalgaz & Elektrik Tesisatı',
    subService: 'Termal Cihazla Kırmadan Su Kaçağı Tespiti',
    title: 'Alt kata su sızıyor, banyoda kırmadan noktasal kaçak tespiti ve tamir',
    description: 'Alt komşunun tavanında sararma ve damlama başladı. Banyo fayanslarını kırmadan akustik dinleme veya termal kamera ile kaçağın tam noktasının bulunmasını ve onarılmasını istiyoruz.',
    quantityOrScope: '1 Banyo / Yaklaşık 6 m²',
    attachments: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600'
    ],
    location: {
      city: 'Ordu',
      district: 'Altınordu',
      neighborhood: 'Akyazı Mah.',
      fullAddressMasked: 'Akyazı Mah. Sahil Cad. No: ** Daire: *',
      fullAddressReal: 'Akyazı Mah. Sahil Cad. No: 14 Daire: 3, Altınordu / Ordu',
      distanceKm: 2.3
    },
    timing: 'urgent',
    timingLabel: 'Acil (En Kısa Sürede)',
    customer: {
      id: 'cust-1',
      name: 'Emre Çakır',
      maskedPhone: '0532 *** ** 34',
      realPhone: '0532 555 12 34',
      email: 'emre.cakir@example.com'
    },
    createdAt: '2026-09-23 15:40',
    expiresAt: '2026-09-25 15:40',
    status: 'open',
    quotesCount: 3
  },
  {
    id: 'req-102',
    requestNumber: 'TTK-2026-0815',
    category: 'oto-kurtarma',
    categoryTitle: 'Oto Kurtarma, Çekici & Yol Yardım',
    subService: 'Binek Araç Şehir İçi Çekici',
    title: 'Şanzıman arızası yapan binek aracın sanayiye çekilmesi',
    description: '2019 model Volkswagen Passat aracım hareket etmiyor. Sahil dolgu otoparkından alınarak Ordu Yeni Sanayi Sitesi 4. Bloktaki özel servise götürülecektir.',
    quantityOrScope: '1 Binek Otomobil (1500 kg)',
    attachments: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600'
    ],
    location: {
      city: 'Ordu',
      district: 'Altınordu',
      neighborhood: 'Düz Mahalle (Sahil Otoparkı)',
      fullAddressMasked: 'Düz Mah. Sahil Otoparkı Çıkışı No: **',
      fullAddressReal: 'Düz Mah. Atatürk Bulvarı Sahil Otoparkı No: 12, Altınordu / Ordu',
      distanceKm: 1.8
    },
    timing: 'within_24h',
    timingLabel: '24 Saat İçinde',
    customer: {
      id: 'cust-2',
      name: 'Selin Yılmaz',
      maskedPhone: '0544 *** ** 82',
      realPhone: '0544 321 44 82',
      email: 'selin.yilmaz@example.com'
    },
    createdAt: '2026-09-24 08:10',
    expiresAt: '2026-09-26 08:10',
    status: 'open',
    quotesCount: 2
  },
  {
    id: 'req-103',
    requestNumber: 'TTK-2026-0790',
    category: 'fotograf-produksiyon',
    categoryTitle: 'Fotoğraf, Video & Düğün/Katalog Çekimi',
    subService: 'E-Ticaret & Katalog Ürün Çekimi',
    title: 'Yeni sezon ayakkabı ve çanta koleksiyonu beyaz fon katalog çekimi',
    description: '35 farklı model deri ayakkabı ve 15 model kadın çantası için beyaz fon (dekupeye hazır) 5 açıdan profesyonel stüdyo fotoğraf çekimi ve renk rötuşları istenmektedir.',
    quantityOrScope: '50 Model x 5 Açı (250 Kare Fotoğraf)',
    attachments: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600',
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600'
    ],
    location: {
      city: 'Ordu',
      district: 'Altınordu',
      neighborhood: 'Şarkiye Mah.',
      fullAddressMasked: 'Şarkiye Mah. Kazım Karabekir Cad. No: **',
      fullAddressReal: 'Şarkiye Mah. Kazım Karabekir Cad. No: 28, Altınordu / Ordu',
      distanceKm: 0.9
    },
    timing: 'this_week',
    timingLabel: 'Bu Hafta İçinde',
    customer: {
      id: 'cust-3',
      name: 'Mert Kundura Ltd.',
      maskedPhone: '0533 *** ** 19',
      realPhone: '0533 881 22 19',
      email: 'info@mertkundura.com'
    },
    createdAt: '2026-09-23 11:00',
    expiresAt: '2026-09-27 11:00',
    status: 'open',
    quotesCount: 2
  },
  {
    id: 'req-104',
    requestNumber: 'TTK-2026-0755',
    category: 'tadilat-dekorasyon',
    categoryTitle: 'Ev & İşyeri Tadilat, Boya, Alçı',
    subService: 'Daire Komple Boya Badana',
    title: '3+1 Boş Daire Tavan ve Duvar Boyası (Jotun/Dyo Silikonlu)',
    description: 'Kiracı çıktıktan sonra yeni taşınma öncesi 115 m² net dairenin tüm duvar ve tavanlarının boyanması. Ufak alçı çatlak tamirleri yapılacaktır. Malzeme esnaf tarafından temin edilecek.',
    quantityOrScope: '115 m² Net Daire (Tavan + Duvar)',
    attachments: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600'
    ],
    location: {
      city: 'Ordu',
      district: 'Fatsa',
      neighborhood: 'Dolunay Mah.',
      fullAddressMasked: 'Dolunay Mah. Sahil Evleri Sitesi No: **',
      fullAddressReal: 'Dolunay Mah. Sahil Evleri Sitesi A Blok No: 6, Fatsa / Ordu',
      distanceKm: 28.5
    },
    timing: 'flexible',
    timingLabel: 'Esnek (1-2 Hafta)',
    customer: {
      id: 'cust-4',
      name: 'Bülent Karaca',
      maskedPhone: '0555 *** ** 90',
      realPhone: '0555 901 88 90',
      email: 'bulent.karaca@example.com'
    },
    createdAt: '2026-09-22 17:30',
    expiresAt: '2026-09-29 17:30',
    status: 'open',
    quotesCount: 3
  }
];

export const INITIAL_MERCHANT_QUOTES: MerchantQuote[] = [
  // req-101 Quotes (Su kaçağı tespiti)
  {
    id: 'bid-101-1',
    requestId: 'req-101',
    merchantId: 'store-kuzey-teknik',
    merchantName: 'Kuzey Teknik Tesisat & Mühendislik',
    merchantAvatar: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=120',
    merchantRating: 4.9,
    merchantReviewCount: 142,
    merchantBadges: ['Onaylı Usta', 'Termal Kamera Sertifikalı', 'GİB e-Faturalı'],
    certificationBadge: 'MYK Seviye 4 Sıhhi Tesisat Belgesi Onaylı',
    onTimeRate: 99,
    portfolioPhotos: [
      { title: 'Termal Kaçak Tespiti & Noktasal Açma', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600' },
      { title: 'Test Sonrası Kusursuz Fayans Kapatma', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600' }
    ],
    distanceKm: 2.1,
    price: 1350,
    vatIncluded: true,
    duration: '1.5 Saat (Bugün 17:00 da adreste)',
    note: 'Termal kamera ve akustik dinleme cihazımızla kırmadan noktasal tespit garantilidir. Kaçak yeri tespit edilip tek fayans kırılarak boru tamiri yapılır, test edilir. 1 Yıl yazılı servis garantisi veriyoruz.',
    phone: '0544 222 00 00',
    whatsapp: '905442220000',
    createdAt: '2026-09-23 16:15',
    status: 'pending'
  },
  {
    id: 'bid-101-2',
    requestId: 'req-101',
    merchantId: 'store-lider-tesisat',
    merchantName: 'Lider Sıhhi Tesisat & Yapı',
    merchantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
    merchantRating: 4.7,
    merchantReviewCount: 88,
    merchantBadges: ['Onaylı Esnaf', 'Hızlı Servis'],
    certificationBadge: 'Ustalık ve Esnaf Odası Kayıtlı',
    onTimeRate: 96,
    portfolioPhotos: [
      { title: 'Banyo Tesisat Yenileme', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600' }
    ],
    distanceKm: 3.5,
    price: 1200,
    vatIncluded: true,
    duration: '2 Saat içinde servis',
    note: 'Noktasal tespit ücreti 1.200 TL dir. Arıza giderimi için boru kaynak malzemeleri tarafımızdan karşılanacaktır. Fatura kesilir.',
    phone: '0533 111 22 33',
    whatsapp: '905331112233',
    createdAt: '2026-09-23 16:45',
    status: 'pending'
  },
  {
    id: 'bid-101-3',
    requestId: 'req-101',
    merchantId: 'store-guven-tesisat',
    merchantName: 'Güven Tesisat & Gaz Sistemleri',
    merchantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
    merchantRating: 4.8,
    merchantReviewCount: 64,
    merchantBadges: ['Onaylı Esnaf', 'Kredi Kartı / POS'],
    certificationBadge: 'Doğalgaz & Tesisat Yetkili Firma',
    onTimeRate: 98,
    portfolioPhotos: [
      { title: 'Kombi ve Hat Montajı', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600' }
    ],
    distanceKm: 4.0,
    price: 1500,
    vatIncluded: true,
    duration: 'Aynı gün randevu',
    note: 'Alman Testo termal kamerası ile kaçak tespiti ve basınç testi dahil komple paket. Seyyar POS cihazımız mevcuttur.',
    phone: '0532 999 44 55',
    whatsapp: '905329994455',
    createdAt: '2026-09-23 17:10',
    status: 'pending'
  },

  // req-102 Quotes (Oto kurtarma)
  {
    id: 'bid-102-1',
    requestId: 'req-102',
    merchantId: 'store-ozdemir-kurtarma',
    merchantName: 'Özdemir 7/24 Oto Kurtarma & Çekici',
    merchantAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120',
    merchantRating: 5.0,
    merchantReviewCount: 210,
    merchantBadges: ['Kaskolu Çekici', '7/24 Nöbetçi', '20 Dk Varış'],
    certificationBadge: 'K1 & K3 Karayolu Taşıma Yetki Belgeli',
    onTimeRate: 100,
    portfolioPhotos: [
      { title: 'Kayar Kasa Güvenli Binek Araç Transferi', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600' }
    ],
    distanceKm: 1.5,
    price: 1250,
    vatIncluded: true,
    duration: '20-25 Dakika içinde yükleme',
    note: 'Kaskolu ve hidrolik kayar kasa çekicimiz hazır beklemektedir. Aracınız tamponuna veya şanzımanına sıfır zarar riskiyle taşınır. Sanayiye kadar refakat edilir.',
    phone: '0542 777 88 99',
    whatsapp: '905427778899',
    createdAt: '2026-09-24 08:25',
    status: 'pending'
  },
  {
    id: 'bid-102-2',
    requestId: 'req-102',
    merchantId: 'store-yildiz-cekici',
    merchantName: 'Yıldız Yol Yardım & Vinç',
    merchantAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120',
    merchantRating: 4.6,
    merchantReviewCount: 53,
    merchantBadges: ['Onaylı Esnaf'],
    distanceKm: 3.1,
    price: 1250,
    vatIncluded: true,
    duration: '35 Dakika',
    note: 'Otomatik vites araçlara özel aparatlı kayar kasa çekici. Sanayi içi teslimat dahildir.',
    phone: '0542 555 66 77',
    whatsapp: '905425556677',
    createdAt: '2026-09-24 08:45',
    status: 'pending'
  },

  // req-103 Quotes (Fotoğraf çekimi)
  {
    id: 'bid-103-1',
    requestId: 'req-103',
    merchantId: 'store-fotosentez',
    merchantName: 'FotoSentez Medya & Dijital Stüdyo',
    merchantAvatar: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=120',
    merchantRating: 5.0,
    merchantReviewCount: 175,
    merchantBadges: ['Kurumsal Çözüm Ortağı', '4K Sony Cine Lens', 'GİB e-Arşiv'],
    distanceKm: 0.8,
    price: 7500,
    vatIncluded: true,
    duration: '2 İş Gününde Teslim',
    note: '50 model için stüdyo ışık kurulumu, beyaz sonsuz fon, 5 farklı açı (üst, yan, taban, arka, detay) ve e-ticarete uygun renk kalibrasyonu dahildir. Web ve baskı boyutlarında WeTransfer ile teslim edilir.',
    phone: '0532 777 88 99',
    whatsapp: '905327778899',
    createdAt: '2026-09-23 12:30',
    status: 'pending'
  },
  {
    id: 'bid-103-2',
    requestId: 'req-103',
    merchantId: 'store-art-vizyon',
    merchantName: 'Art Vizyon Görsel Sanatlar',
    merchantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
    merchantRating: 4.7,
    merchantReviewCount: 42,
    merchantBadges: ['Onaylı Stüdyo'],
    distanceKm: 1.4,
    price: 8500,
    vatIncluded: true,
    duration: '3 İş Günü',
    note: 'Dekupe + gölge efekti ve TamPazar dijital vitrin standartlarına uygun 1200x1800 px teslimat.',
    phone: '0535 333 44 11',
    whatsapp: '905353334411',
    createdAt: '2026-09-23 13:10',
    status: 'pending'
  }
];

// LocalStorage helpers
export function getStoredQuotationRequests(): QuotationRequest[] {
  try {
    const saved = localStorage.getItem('tampazar_quotation_requests');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load quotation requests from localStorage', e);
  }
  return INITIAL_QUOTATION_REQUESTS;
}

export function saveQuotationRequests(requests: QuotationRequest[]): void {
  try {
    localStorage.setItem('tampazar_quotation_requests', JSON.stringify(requests));
  } catch (e) {
    console.error('Failed to save quotation requests to localStorage', e);
  }
}

export function getStoredMerchantQuotes(): MerchantQuote[] {
  try {
    const saved = localStorage.getItem('tampazar_merchant_quotes');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load merchant quotes from localStorage', e);
  }
  return INITIAL_MERCHANT_QUOTES;
}

export function saveMerchantQuotes(quotes: MerchantQuote[]): void {
  try {
    localStorage.setItem('tampazar_merchant_quotes', JSON.stringify(quotes));
  } catch (e) {
    console.error('Failed to save merchant quotes to localStorage', e);
  }
}

export function createQuotationRequest(newReq: Omit<QuotationRequest, 'id' | 'requestNumber' | 'createdAt' | 'status' | 'quotesCount'>): QuotationRequest {
  const allReqs = getStoredQuotationRequests();
  const id = 'req-' + Date.now().toString().slice(-6);
  const requestNumber = 'TTK-2026-' + Math.floor(1000 + Math.random() * 9000);
  const now = new Date();
  const createdAt = now.toISOString().slice(0, 16).replace('T', ' ');
  
  const created: QuotationRequest = {
    ...newReq,
    id,
    requestNumber,
    createdAt,
    status: 'open',
    quotesCount: 0
  };

  const updated = [created, ...allReqs];
  saveQuotationRequests(updated);
  return created;
}

export function submitMerchantQuote(quoteData: Omit<MerchantQuote, 'id' | 'createdAt' | 'status'>): MerchantQuote {
  const allQuotes = getStoredMerchantQuotes();
  const quoteId = 'bid-' + Date.now().toString().slice(-6);
  const now = new Date();
  const createdAt = now.toISOString().slice(0, 16).replace('T', ' ');

  const newQuote: MerchantQuote = {
    ...quoteData,
    id: quoteId,
    createdAt,
    status: 'pending'
  };

  const updatedQuotes = [newQuote, ...allQuotes];
  saveMerchantQuotes(updatedQuotes);

  // Update quotesCount on request
  const allReqs = getStoredQuotationRequests();
  const updatedReqs = allReqs.map(r => {
    if (r.id === quoteData.requestId) {
      return {
        ...r,
        quotesCount: (r.quotesCount || 0) + 1
      };
    }
    return r;
  });
  saveQuotationRequests(updatedReqs);

  return newQuote;
}

export function acceptMerchantQuote(quoteId: string): { success: boolean; quote?: MerchantQuote; request?: QuotationRequest } {
  const allQuotes = getStoredMerchantQuotes();
  const allReqs = getStoredQuotationRequests();

  const targetQuote = allQuotes.find(q => q.id === quoteId);
  if (!targetQuote) return { success: false };

  // Set target quote to accepted, others for same request to rejected
  const updatedQuotes = allQuotes.map(q => {
    if (q.requestId === targetQuote.requestId) {
      if (q.id === quoteId) return { ...q, status: 'accepted' as const };
      return { ...q, status: 'rejected' as const };
    }
    return q;
  });
  saveMerchantQuotes(updatedQuotes);

  // Set request status to awarded
  const updatedReqs = allReqs.map(r => {
    if (r.id === targetQuote.requestId) {
      return {
        ...r,
        status: 'awarded' as const,
        awardedQuoteId: quoteId
      };
    }
    return r;
  });
  saveQuotationRequests(updatedReqs);

  const updatedQuote = updatedQuotes.find(q => q.id === quoteId);
  const updatedReq = updatedReqs.find(r => r.id === targetQuote.requestId);

  return { success: true, quote: updatedQuote, request: updatedReq };
}

export function rejectMerchantQuote(quoteId: string): boolean {
  const allQuotes = getStoredMerchantQuotes();
  const updatedQuotes = allQuotes.map(q => {
    if (q.id === quoteId) return { ...q, status: 'rejected' as const };
    return q;
  });
  saveMerchantQuotes(updatedQuotes);
  return true;
}
