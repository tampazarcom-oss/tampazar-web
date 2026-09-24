/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Tenant {
  id: string;
  name: string;
  legalTitle?: string;
  taxOffice?: string;
  taxId?: string;
  slug: string;
  logo: string;
  category?: string;
  rating?: number;
  reviews?: number;
  avatar?: string;
  banner?: string;
  typeBadge?: string;
  plan: 'Starter' | 'Pro' | 'Enterprise';
  quotaUsed: number;
  quotaLimit: number;
  byoPosConnected: boolean;
  activePos: string | null;
  isDemoStore?: boolean;
  subscriptionStatus?: 'active' | 'pending' | 'expired' | 'trial';
  isVerifiedMerchant?: boolean;
  posConfigured?: boolean;
  cargoConfigured?: boolean;
  eInvoiceConfigured?: boolean;
  monthlyRecurringRevenue?: number;
}

export interface Product {
  id: string;
  tenantId: string;
  storeName?: string;
  type: 'retail' | 'wholesale' | 'service' | 'digital' | 'consultation';
  title: string;
  slug: string;
  category: string;
  categorySlug: string;
  description: string;
  price: number; // Base price or retail price
  sku: string;
  vatRate: number; // e.g. 20, 10, 1
  image: string;
  rating?: number;
  salesCount?: number;
  badge?: string;
  tierPriceNote?: string;
  isDemoProduct?: boolean;
  
  // Enterprise ERP & TamPazar Kurumsal Nitelikleri
  brand?: string;
  modelNo?: string;
  costPrice?: number;
  listPrice?: number;
  withholdingCode?: string;
  images?: string[];
  stockCount?: number;
  criticalStockThreshold?: number;
  variantMatrix?: {
    id: string;
    size?: string;
    color?: string;
    material?: string;
    sku: string;
    barcode: string;
    stock: number;
    priceDiff: number;
  }[];
  deliveryOptions?: {
    type: 'physical_cargo' | 'local_express' | 'field_service' | 'digital_download' | 'online_session';
    desi?: number;
    carrierCompany?: string;
    isFreeShipping?: boolean;
    localDeliveryTime?: string;
    minBasketAmount?: number;
    isTakeawayAllowed?: boolean;
    fixedServiceFee?: number;
    serviceRadiusKm?: number;
    isOnSiteService?: boolean;
    // TamDijital Alanları
    digitalFileUrl?: string;
    digitalFileName?: string;
    digitalFileSize?: string;
    digitalFormats?: string[];
    licenseType?: 'personal' | 'commercial';
    // TamSeans Alanları
    sessionDurationMin?: 30 | 45 | 50 | 60 | number;
    availableDays?: string[];
    availableHours?: string[];
    sessionChannel?: 'google_meet' | 'zoom' | 'whatsapp_phone';
    meetingLink?: string;
    expertTitle?: string;
  };

  // Retail specific
  variants?: {
    sizes?: string[];
    colors?: string[];
  };

  // B2B Wholesale specific
  moq?: number; // Minimum Order Quantity
  tieredPrices?: {
    minQty: number;
    maxQty: number | null; // null for "+"
    pricePerUnit: number;
  }[];

  // B2B & Toptan Satış & Dropshipping (Faire & Spocket Modeli)
  isB2BOnly?: boolean;
  b2bMinQty?: number;
  b2bUnitType?: 'adet' | 'seri' | 'koli' | 'cuval' | 'paket';
  b2bWholesalePrice?: number;
  b2bTieredPricing?: {
    minQty: number;
    maxQty?: number | null;
    price: number;
  }[];
  allowDropshipping?: boolean;
  suggestedRetailPrice?: number;
  dropshipOriginalStoreId?: string;
  dropshipOriginalStoreName?: string;
  dropshipOriginalProductId?: string;
  isDropshippedCopy?: boolean;

  // Service specific
  durationMin?: number;
  bookingSlots?: string[];
  serviceAreaRadiusKm?: number;

  // Fulfillment and Pillar Integration
  fulfillment?: {
    pillar?: 'tamkargo' | 'tamhizli' | 'tamusta' | 'tamdijital' | 'tamseans';
    fileName?: string;
    fileSize?: string;
    digitalFormats?: string[];
    licenseType?: 'personal' | 'commercial';
    sessionDurationMin?: number;
    meetingLink?: string;
    [key: string]: any;
  };

  // Dinamik Ölçü Birimi, Özelleştirme & Müşteri Formu Motoru
  customizationOptions?: ProductCustomizationOptions;
}

// 1. Ölçü Birimi Konfigürasyonu
export interface MeasurementConfig {
  unit: 'adet' | 'kg' | 'gram' | 'litre' | 'metre' | 'm2' | 'porsiyon' | 'paket';
  minQuantity?: number; // Örn: 0.5 kg
  stepQuantity?: number; // Örn: 0.5 kg veya 250 g
  unitLabel?: string; // Örn: 'Kg', 'Porsiyon', 'Metre'
  pricePerUnitMultiplier?: number;
}

// 2. Yemek & Restoran Malzeme Seçici (Yemeksepeti / Döner Modeli)
export interface FoodRemovableIngredient {
  id: string;
  name: string;
  defaultIncluded: boolean;
}

export interface FoodExtraIngredient {
  id: string;
  name: string;
  price: number;
}

export interface FoodMandatoryGroup {
  id: string;
  title: string;
  required: boolean;
  options: {
    id: string;
    name: string;
    priceDiff?: number;
  }[];
}

export interface FoodCustomizationConfig {
  enabled: boolean;
  removableIngredients?: FoodRemovableIngredient[];
  extraIngredients?: FoodExtraIngredient[];
  mandatoryGroups?: FoodMandatoryGroup[];
}

// 3. Fotoğraf Baskı & Dijital Dosya Yükleme Alanı
export interface FileUploadConfig {
  enabled: boolean;
  title?: string;
  description?: string;
  allowedFormats: string[]; // e.g. ['JPG', 'PNG', 'PDF', 'TIFF', 'RAW', 'ZIP']
  minFiles?: number;
  maxFiles?: number;
  maxSizeMB?: number;
  required?: boolean;
}

// 4. Matbaa, Davetiye, Lazer & Kişiye Özel Form Alanları
export interface CustomFieldConfig {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'select' | 'number';
  placeholder?: string;
  required: boolean;
  options?: string[]; // select için
}

export interface CustomFormConfig {
  enabled: boolean;
  title?: string;
  description?: string;
  fields: CustomFieldConfig[];
}

export interface ProductCustomizationOptions {
  measurement?: MeasurementConfig;
  foodCustomization?: FoodCustomizationConfig;
  fileUpload?: FileUploadConfig;
  customForm?: CustomFormConfig;
}

export interface PosConfig {
  id: string;
  tenantId: string;
  provider: 'paytr' | 'iyzico' | 'sipay' | 'stripe';
  merchantId: string;
  apiKey: string;
  apiSecretEncrypted: string; // Simulated AES-256 ciphertext
  apiSecretDecryptedHint: string; // Shows decrypted state visually
  isActive: boolean;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e-Invoice format GIB2026000000XXX
  orderId: string;
  tenantId: string;
  customerName: string;
  customerTaxOffice: string;
  customerTaxId: string;
  customerEmail: string;
  date: string;
  amount: number;
  vatAmount: number;
  withholdingTaxType: string; // e.g. "None", "2/10", "9/10"
  withholdingAmount: number;
  totalPayable: number;
  status: 'draft' | 'queued' | 'issued' | 'failed';
  xmlUrl?: string;
  integrator: 'gib' | 'uyumsoft' | 'edm' | 'foriba';
}

export interface LedgerAccount {
  id: string;
  tenantId: string;
  name: string;
  code: string; // e.g., 120.01.001
  type: 'buyer' | 'supplier' | 'both';
  balance: number; // positive is receivable, negative is payable
  email: string;
  taxId: string;
  taxOffice?: string;
  phone?: string;
  whatsapp?: string;
  city?: string;
  district?: string;
  address?: string;
  isCompany?: boolean;
  legalTitle?: string;
  dueDays?: number;
  discountRate?: number;
  openingBalance?: number;
}

export interface LedgerTransaction {
  id: string;
  tenantId: string;
  accountId: string;
  date: string;
  description: string;
  debit: number; // Borç (receivable increase)
  credit: number; // Alacak (payable increase / payment received)
  balanceAfter: number;
}

export const initialTenants: Tenant[] = [
  {
    id: 's1',
    name: 'Atölye Zanaat',
    legalTitle: 'Atölye Zanaat El Sanatları ve Tasarım Ltd. Şti.',
    taxOffice: 'Beyoğlu V.D.',
    taxId: '1280948192',
    slug: 'atolye-zanaat',
    logo: '🪵',
    category: 'El Yapımı & Tasarım',
    rating: 4.9,
    reviews: 128,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=80',
    typeBadge: 'Bağımsız Tasarım Atölyesi',
    plan: 'Pro',
    quotaUsed: 128,
    quotaLimit: 1000,
    byoPosConnected: true,
    activePos: 'iyzico',
    isDemoStore: false,
    subscriptionStatus: 'active',
    isVerifiedMerchant: true,
    posConfigured: true,
    cargoConfigured: true,
    eInvoiceConfigured: true,
    monthlyRecurringRevenue: 599
  },
  {
    id: 's2',
    name: 'Mega Endüstriyel',
    legalTitle: 'Mega Endüstriyel Hırdavat ve Yapı Malzemeleri A.Ş.',
    taxOffice: 'İkitelli V.D.',
    taxId: '6190284711',
    slug: 'mega-endustriyel',
    logo: '🏭',
    category: 'Toptan & Hırdavat',
    rating: 4.8,
    reviews: 540,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop&q=80',
    typeBadge: 'Kurumsal B2B Tedarikçisi',
    plan: 'Enterprise',
    quotaUsed: 1250,
    quotaLimit: 10000,
    byoPosConnected: true,
    activePos: 'paytr',
    isDemoStore: false,
    subscriptionStatus: 'active',
    isVerifiedMerchant: true,
    posConfigured: true,
    cargoConfigured: true,
    eInvoiceConfigured: true,
    monthlyRecurringRevenue: 1490
  },
  {
    id: 's3',
    name: 'FotoSentez Stüdyo',
    legalTitle: 'FotoSentez Görsel Sanatlar ve Tasarım Tic. Ltd. Şti.',
    taxOffice: 'Altınordu V.D.',
    taxId: '3880491029',
    slug: 'fotosentez-studyo',
    logo: '📸',
    category: 'Fotoğraf & Medya Hizmetleri',
    rating: 5.0,
    reviews: 88,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=500&auto=format&fit=crop&q=80',
    typeBadge: 'Yerinde Hizmet & Prodüksiyon',
    plan: 'Starter',
    quotaUsed: 88,
    quotaLimit: 500,
    byoPosConnected: true,
    activePos: 'paytr',
    isDemoStore: false,
    subscriptionStatus: 'active',
    isVerifiedMerchant: true,
    posConfigured: true,
    cargoConfigured: true,
    eInvoiceConfigured: true,
    monthlyRecurringRevenue: 499
  },
  {
    id: 'tenant-1',
    name: 'Mert Kundura Ltd.',
    legalTitle: 'Mert Kundura Deri ve Ayakkabı San. Tic. Ltd. Şti.',
    taxOffice: 'Gedikpaşa V.D.',
    taxId: '6182901844',
    slug: 'mert-kundura',
    logo: '👞',
    category: 'Ayakkabı & Çanta',
    rating: 4.8,
    reviews: 215,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&auto=format&fit=crop&q=80',
    typeBadge: 'Ayakkabı İmalatçısı',
    plan: 'Pro',
    quotaUsed: 342,
    quotaLimit: 1000,
    byoPosConnected: true,
    activePos: 'paytr',
    isDemoStore: false,
    subscriptionStatus: 'active',
    isVerifiedMerchant: true,
    posConfigured: true,
    cargoConfigured: true,
    eInvoiceConfigured: true,
    monthlyRecurringRevenue: 599
  },
  {
    id: 'tenant-2',
    name: 'Yıldız Toptan Gıda A.Ş.',
    legalTitle: 'Yıldız Toptan Hububat Bakliyat ve Gıda Maddeleri A.Ş.',
    taxOffice: 'Rami V.D.',
    taxId: '9840192847',
    slug: 'yildiz-toptan',
    logo: '🌾',
    category: 'Gıda & Tarım Toptancılığı',
    rating: 4.9,
    reviews: 890,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80',
    typeBadge: 'Toptan Bakliyat & Sıvı Yağ',
    plan: 'Enterprise',
    quotaUsed: 4890,
    quotaLimit: 10000,
    byoPosConnected: true,
    activePos: 'iyzico',
    isDemoStore: false,
    subscriptionStatus: 'active',
    isVerifiedMerchant: true,
    posConfigured: true,
    cargoConfigured: true,
    eInvoiceConfigured: true,
    monthlyRecurringRevenue: 1490
  },
  {
    id: 'tenant-3',
    name: 'Bursa Spa & Sağlık',
    legalTitle: 'Bursa Termal Spa Sağlık ve Masaj Hizmetleri Ltd. Şti.',
    taxOffice: 'Osmangazi V.D.',
    taxId: '1892019482',
    slug: 'bursa-spa',
    logo: '🌿',
    category: 'Sağlık & Masaj',
    rating: 4.7,
    reviews: 42,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=500&auto=format&fit=crop&q=80',
    typeBadge: 'Masaj & Güzellik Merkezi',
    plan: 'Starter',
    quotaUsed: 42,
    quotaLimit: 100,
    byoPosConnected: true,
    activePos: 'sipay',
    isDemoStore: false,
    subscriptionStatus: 'pending',
    isVerifiedMerchant: false,
    posConfigured: true,
    cargoConfigured: false,
    eInvoiceConfigured: false,
    monthlyRecurringRevenue: 0
  },
  {
    id: 'demo-market',
    name: 'TamPazar Demo Market',
    legalTitle: 'TamPazar Test & Geliştirme İzolasyon Mağazası',
    taxOffice: 'Test V.D.',
    taxId: '0000000000',
    slug: 'tampazar-demo-market',
    logo: '🧪',
    category: 'Test & Örnek Ürünler',
    rating: 5.0,
    reviews: 99,
    avatar: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=100&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=80',
    typeBadge: '🧪 Test / Demo Mağazası',
    plan: 'Starter',
    quotaUsed: 10,
    quotaLimit: 100,
    byoPosConnected: true,
    activePos: 'paytr',
    isDemoStore: true,
    subscriptionStatus: 'trial',
    isVerifiedMerchant: false,
    posConfigured: true,
    cargoConfigured: false,
    eInvoiceConfigured: false,
    monthlyRecurringRevenue: 0
  }
];

export const initialPosConfigs: PosConfig[] = [
  {
    id: 'pos-1',
    tenantId: 'tenant-1',
    provider: 'paytr',
    merchantId: '384910',
    apiKey: 'p_tr_key_84ndh29s0alw',
    apiSecretEncrypted: 'U2FsdGVkX1+z1L28p3sBf5Wj9sY19Zk0X/G9m1X=',
    apiSecretDecryptedHint: 'paytr_sec_93h7s8a9dfj0k1l2',
    isActive: true,
  },
  {
    id: 'pos-2',
    tenantId: 'tenant-2',
    provider: 'iyzico',
    merchantId: '992019',
    apiKey: 'iyzi_api_cl_981ha928sjqw',
    apiSecretEncrypted: 'U2FsdGVkX18m9L38q2wCd4Jm0p7X2Kl9M/R8v2N=',
    apiSecretDecryptedHint: 'iyzi_sec_87ha19sh82js91la',
    isActive: true,
  }
];

export const initialProducts: Product[] = [
  // 1. YEMEK & RESTORAN (Yemeksepeti / Döner Modeli - Malzeme Çıkarma & Ekstra Ekleme)
  {
    id: 'p-doner-hatay',
    tenantId: 's3',
    storeName: 'Tarihi Taşfırın & Döner Ustası',
    type: 'retail',
    title: 'Hatay Usulü Soslu Tavuk Döner Dürüm',
    slug: 'hatay-usulu-soslu-tavuk-doner-durum',
    category: 'Yemek & Döner',
    categorySlug: 'yemek-doner',
    description: 'Özel marineli çıtır tavuk eti, taşfırın tırnak lavaşı, el yapımı Hatay salçalı tereyağlı sos, kornişon turşu ve fırın patates ile sıcak servis.',
    price: 185,
    sku: 'DNR-HATAY-01',
    vatRate: 10,
    rating: 4.95,
    salesCount: 1420,
    badge: 'Usta İşi / Sıcak Kurye',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&q=80&w=800',
    deliveryOptions: {
      type: 'local_express',
      localDeliveryTime: '25-35 Dk',
      minBasketAmount: 120,
      isTakeawayAllowed: true
    },
    fulfillment: {
      pillar: 'tamhizli'
    },
    customizationOptions: {
      measurement: {
        unit: 'porsiyon',
        minQuantity: 1,
        stepQuantity: 1,
        unitLabel: 'Porsiyon / Dürüm'
      },
      foodCustomization: {
        enabled: true,
        removableIngredients: [
          { id: 'rem-sogan', name: 'Soğan', defaultIncluded: true },
          { id: 'rem-tursu', name: 'Kornişon Turşu', defaultIncluded: true },
          { id: 'rem-mayonez', name: 'Sarımsaklı Mayonez', defaultIncluded: true },
          { id: 'rem-patates', name: 'Kızarmış Patates', defaultIncluded: true }
        ],
        extraIngredients: [
          { id: 'ext-kasar', name: 'Ekstra Kaşar Peyniri', price: 30 },
          { id: 'ext-lavas', name: 'Çift Lavaş', price: 15 },
          { id: 'ext-truf', name: 'Trüf Aromalı Mayonez', price: 20 },
          { id: 'ext-sos', name: 'Duble Hatay Özel Sos', price: 15 }
        ],
        mandatoryGroups: [
          {
            id: 'grp-aci',
            title: 'Acı Tercihi',
            required: true,
            options: [
              { id: 'opt-acisiz', name: 'Acısız' },
              { id: 'opt-az', name: 'Az Acılı' },
              { id: 'opt-orta', name: 'Orta Acılı (Klasik)' },
              { id: 'opt-cok', name: 'Çok Acılı (Hatay Biberi)' }
            ]
          },
          {
            id: 'grp-icecek',
            title: 'İçecek Seçimi (İsteğe Bağlı)',
            required: false,
            options: [
              { id: 'opt-none', name: 'İçecek İstemiyorum' },
              { id: 'opt-ayran', name: 'Köy Yayık Ayranı (330ml)', priceDiff: 28 },
              { id: 'opt-kola', name: 'Kutu Kola (330ml)', priceDiff: 40 },
              { id: 'opt-salgam', name: 'Özel Adana Şalgamı', priceDiff: 30 }
            ]
          }
        ]
      }
    }
  },

  // 2. MANAV / ŞARKÜTERİ (Kilogram / Gram / Tartılı Ürün Modeli)
  {
    id: 'p-manav-elma',
    tenantId: 's3',
    storeName: 'Manav & Şarküteri Pazarı',
    type: 'retail',
    title: 'Bahçe Taze Amasya Elması',
    slug: 'bahce-taze-amasya-elmasi',
    category: 'Manav & Meyve',
    categorySlug: 'manav-meyve',
    description: 'Doğal sulak vadilerden günlük toplanan sulu, sert ve aromatik tescilli Amasya elması. 0.5 kg artış adımlarıyla tam istediğiniz miktarda tartılarak özenle paketlenir.',
    price: 45, // 1 kg fiyatı
    sku: 'MNV-ELM-01',
    vatRate: 1,
    rating: 4.88,
    salesCount: 890,
    badge: 'Günlük Taze Tartı',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=800',
    deliveryOptions: {
      type: 'local_express',
      localDeliveryTime: '30 Dk',
      minBasketAmount: 80,
      isTakeawayAllowed: true
    },
    fulfillment: {
      pillar: 'tamhizli'
    },
    customizationOptions: {
      measurement: {
        unit: 'kg',
        minQuantity: 0.5,
        stepQuantity: 0.5,
        unitLabel: 'Kg',
        pricePerUnitMultiplier: 1
      }
    }
  },

  // 3. FOTOĞRAF BASKI & DOSYA YÜKLEME (Fotoğraf Stüdyosu Modeli)
  {
    id: 'p-foto-baski-100',
    tenantId: 's3',
    storeName: 'FotoSentez Stüdyo',
    type: 'retail',
    title: '10x15 Parlak Fotoğraf Baskı (100 Adet)',
    slug: '10x15-parlak-fotograf-baski-100-adet',
    category: 'Fotoğraf Baskı',
    categorySlug: 'fotograf-baski',
    description: 'Fujifilm Crystal Archive gümüş halojenür fotoğraf kağıdına solmaz garantili gerçek fotoğraf baskısı. Cep telefonunuzdan veya bilgisayarınızdan doğrudan yükleyin, stüdyomuzda basıp ücretsiz kargolayalım.',
    price: 340,
    sku: 'FTS-BSK-100',
    vatRate: 20,
    rating: 4.96,
    salesCount: 650,
    badge: 'Fujifilm Orijinal Kağıt',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
    deliveryOptions: {
      type: 'physical_cargo',
      carrierCompany: 'Yurtiçi Kargo',
      desi: 1,
      isFreeShipping: true
    },
    fulfillment: {
      pillar: 'tamkargo'
    },
    customizationOptions: {
      measurement: {
        unit: 'paket',
        minQuantity: 1,
        stepQuantity: 1,
        unitLabel: 'Paket (100 Fotoğraf)'
      },
      fileUpload: {
        enabled: true,
        title: 'Baskı Fotoğraflarınızı Yükleyin',
        description: 'Lütfen basılmasını istediğiniz fotoğrafları JPG, PNG, TIFF veya ZIP formatında yükleyin. Yüklenen fotoğraflar stüdyo renk kalibrasyonundan geçirilerek basılır.',
        allowedFormats: ['JPG', 'JPEG', 'PNG', 'TIFF', 'RAW', 'ZIP'],
        minFiles: 1,
        maxFiles: 100,
        maxSizeMB: 150,
        required: true
      }
    }
  },

  // 4. MATBAA, DAVETİYE & KİŞİYE ÖZEL FORM SİHİRBAZI
  {
    id: 'p-davetiye-geometrik',
    tenantId: 's1',
    storeName: 'Atölye Zanaat & Matbaa',
    type: 'retail',
    title: 'Özel Tasarım Geometrik Düğün Davetiyesi (100 Adet)',
    slug: 'ozel-tasarim-geometrik-dugun-davetiyesi-100-adet',
    category: 'Matbaa & Davetiye',
    categorySlug: 'matbaa-davetiye',
    description: '350 gr özel dokulu Japon pamuk kağıt, altın yaldız geometrik gofre baskı ve el yapımı mühürlü zarf seçeneği. Bilgilerinizi aşağıdaki formdan girin, grafikerimiz WhatsApp ile prova göndersin.',
    price: 1850,
    sku: 'DVT-GEO-100',
    vatRate: 20,
    rating: 5.0,
    salesCount: 310,
    badge: 'Altın Varak & Özel Kağıt',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    deliveryOptions: {
      type: 'physical_cargo',
      carrierCompany: 'Aras Kargo',
      desi: 2,
      isFreeShipping: true
    },
    fulfillment: {
      pillar: 'tamkargo'
    },
    customizationOptions: {
      measurement: {
        unit: 'paket',
        minQuantity: 1,
        stepQuantity: 1,
        unitLabel: 'Kutu (100 Davetiye)'
      },
      customForm: {
        enabled: true,
        title: 'Düğün Davetiyesi Baskı Bilgi Formu',
        description: 'Lütfen davetiye üzerine basılacak metinleri dikkatle doldurunuz. Baskı öncesi WhatsApp üzerinden grafik prova onayı alınacaktır.',
        fields: [
          {
            id: 'fld-gelin-damat',
            label: 'Gelin & Damat Adı',
            type: 'text',
            placeholder: 'Örn: Zeynep Kaya & Ali Can Demir',
            required: true
          },
          {
            id: 'fld-tarih-saat',
            label: 'Düğün / Nikah Tarihi & Saati',
            type: 'text',
            placeholder: 'Örn: 18 Temmuz 2027 Cumartesi, Saat: 19:30',
            required: true
          },
          {
            id: 'fld-salon-adres',
            label: 'Düğün Salonu Adı ve Açık Adres',
            type: 'textarea',
            placeholder: 'Örn: Boğaziçi Sahil Davet Salonu, Sahil Cad. No: 48 Sarıyer / İstanbul',
            required: true
          },
          {
            id: 'fld-davetiye-sozu',
            label: 'Davetiye Sözü / Özel Mesaj',
            type: 'textarea',
            placeholder: 'Örn: Bu en mutlu günümüzde siz değerli dostlarımızı aramızda görmekten onur duyarız.',
            required: false
          },
          {
            id: 'fld-whatsapp-onay',
            label: 'Tasarım Prova Onayı İçin WhatsApp Numarası',
            type: 'text',
            placeholder: '0532 123 45 67',
            required: true
          }
        ]
      }
    }
  },
  // Atölye Zanaat (s1) - Retail (Perakende / Zanaatkâr)
  {
    id: 'p1',
    tenantId: 's1',
    storeName: 'Atölye Zanaat',
    type: 'retail',
    title: 'Özel Tasarım Masif Meşe Çalışma Masası',
    slug: 'ozel-tasarim-masif-mese-calisma-masasi',
    category: 'Mobilya & Tasarım',
    categorySlug: 'mobilya-tasarim',
    description: 'Doğal fırınlanmış meşe ağacından üretilmiş, suya ve ısıya dayanıklı mat cilalı zanaatkâr çalışma masası. Ergonomik kablo kanalı ve gizli çekmeceli.',
    price: 8450,
    sku: 'ATZ-OAK-01',
    vatRate: 20,
    rating: 4.9,
    salesCount: 42,
    badge: 'Zanaatkâr Ürünü',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=600',
    variants: {
      sizes: ['140x70 cm', '160x80 cm', '180x90 cm'],
      colors: ['Doğal Meşe', 'Ceviz Tonu', 'Ham Mat']
    }
  },

  // Mega Endüstriyel (s2) - Wholesale (B2B Toptan Koli)
  {
    id: 'p2',
    tenantId: 's2',
    storeName: 'Mega Endüstriyel',
    type: 'wholesale',
    title: 'Endüstriyel Koli Bandı 45x100 (Koli İçi 48 Adet)',
    slug: 'endustriyel-koli-bandi-45x100-48-adet',
    category: 'Ambalaj & Hırdavat',
    categorySlug: 'ambalaj-hirdavat',
    description: 'Yüksek yapışma mukavemetine sahip 40 mikron akrilik bazlı koli bandı. E-ticaret depoları ve lojistik merkezleri için koli içi toptan ambalaj.',
    price: 1650,
    tierPriceNote: '10 Koli ve üzeri: 1.400 ₺/koli',
    sku: 'MGA-BND-48',
    vatRate: 20,
    rating: 4.7,
    salesCount: 1250,
    badge: 'B2B Toptan Fiyat',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=600',
    moq: 2,
    tieredPrices: [
      { minQty: 2, maxQty: 9, pricePerUnit: 1650 },
      { minQty: 10, maxQty: 49, pricePerUnit: 1400 },
      { minQty: 50, maxQty: null, pricePerUnit: 1250 }
    ]
  },

  // FotoSentez Stüdyo (s3) - Service (Hizmet & Randevulu Prodüksiyon)
  {
    id: 'p3',
    tenantId: 's3',
    storeName: 'FotoSentez Stüdyo',
    type: 'service',
    title: 'Kurumsal Ürün ve Katalog Fotoğraf Çekimi',
    slug: 'kurumsal-urun-katalog-fotograf-cekimi',
    category: 'Medya & Fotoğraf',
    categorySlug: 'medya-fotograf',
    description: 'E-ticaret ürünleriniz için 4K beyaz fon ve konsept stüdyo çekimi, renk kalibrasyonu, dekupe ve web hazır format teslimi. Gün boyu profesyonel seans.',
    price: 4500,
    sku: 'FTS-STD-01',
    vatRate: 20,
    rating: 5.0,
    salesCount: 88,
    badge: 'Yerinde Hizmet / Randevulu',
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=600',
    durationMin: 180,
    serviceAreaRadiusKm: 50,
    bookingSlots: ['09:00 - 12:00', '13:30 - 16:30', '17:00 - 20:00']
  },

  // Mert Kundura (tenant-1) - Retail (Perakende)
  {
    id: 'prod-101',
    tenantId: 'tenant-1',
    storeName: 'Mert Kundura Ltd.',
    type: 'retail',
    title: 'Minimalist Deri Oxford Ayakkabı',
    slug: 'minimalist-deri-oxford-ayakkabi',
    category: 'Ayakkabı',
    categorySlug: 'ayakkabi',
    description: 'Hakiki dana derisinden el işçiliğiyle üretilmiş, kösele tabanlı şık Oxford ayakkabı. Klasik silueti modern İtalyan kalıbıyla birleştirir.',
    price: 3450,
    sku: 'MKT-OXF-01',
    vatRate: 20,
    rating: 4.8,
    salesCount: 310,
    badge: 'El Yapımı Deri',
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=600',
    variants: {
      sizes: ['41', '42', '43', '44'],
      colors: ['Taba', 'Siyah', 'Koyu Kahve']
    }
  },
  {
    id: 'prod-102',
    tenantId: 'tenant-1',
    storeName: 'Mert Kundura Ltd.',
    type: 'retail',
    title: 'Süet Chelsea Bot',
    slug: 'suet-chelsea-bot',
    category: 'Bot',
    categorySlug: 'bot',
    description: 'Su geçirmez süet dış yüzey, elastik yan bantlar ve uzun ömürlü kauçuk taban. Sonbahar-Kış gardırobunun vazgeçilmezi.',
    price: 4200,
    sku: 'MKT-CHS-02',
    vatRate: 20,
    rating: 4.9,
    salesCount: 195,
    badge: 'Kış Koleksiyonu',
    image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=600',
    variants: {
      sizes: ['40', '41', '42', '43'],
      colors: ['Kum Rengi', 'Vizon']
    }
  },

  // Yıldız Toptan Gıda (tenant-2) - Wholesale (B2B Toptan)
  {
    id: 'prod-201',
    tenantId: 'tenant-2',
    storeName: 'Yıldız Toptan Gıda A.Ş.',
    type: 'wholesale',
    title: 'Organik Sızma Zeytinyağı (5L Teneke)',
    slug: 'organik-sizma-zeytinyagi-5l',
    category: 'Sıvı Yağlar',
    categorySlug: 'sivi-yaglar',
    description: 'Ege Bölgesi soğuk sıkım zeytinlerden üretilmiş, asit oranı 0.8% altı toptan teneke sızma zeytinyağı. Restoran ve oteller için idealdir.',
    price: 1850, // Base retail / 1 unit price
    tierPriceNote: '50 Teneke ve üzeri: 1.480 ₺/adet',
    sku: 'YTG-ZTN-5L',
    vatRate: 1, // Zeytinyağında toptan/perakende KDV 1%
    rating: 4.9,
    salesCount: 840,
    badge: 'Soğuk Sıkım B2B',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=600',
    moq: 10,
    tieredPrices: [
      { minQty: 10, maxQty: 49, pricePerUnit: 1650 },
      { minQty: 50, maxQty: 199, pricePerUnit: 1480 },
      { minQty: 200, maxQty: null, pricePerUnit: 1320 }
    ]
  },
  {
    id: 'prod-202',
    tenantId: 'tenant-2',
    storeName: 'Yıldız Toptan Gıda A.Ş.',
    type: 'wholesale',
    title: 'Baldo Pirinç (Gönen 25kg Çuval)',
    slug: 'baldo-pirinc-gonen-25kg',
    category: 'Bakliyat',
    categorySlug: 'bakliyat',
    description: 'Gönen yöresi, iri taneli, yüksek su çekme oranına sahip birinci sınıf Baldo Pirinç çuvalı. B2B restoran ve market tedarikleri için.',
    price: 1400,
    tierPriceNote: '20 Çuval ve üzeri: 1.120 ₺/çuval',
    sku: 'YTG-PRN-25K',
    vatRate: 1,
    rating: 4.8,
    salesCount: 620,
    badge: 'Gönen Hasadı',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600',
    moq: 5,
    tieredPrices: [
      { minQty: 5, maxQty: 19, pricePerUnit: 1250 },
      { minQty: 20, maxQty: 99, pricePerUnit: 1120 },
      { minQty: 100, maxQty: null, pricePerUnit: 980 }
    ]
  },

  // Bursa Spa & Sağlık (tenant-3) - Service (Hizmet)
  {
    id: 'prod-301',
    tenantId: 'tenant-3',
    storeName: 'Bursa Spa & Sağlık',
    type: 'service',
    title: 'Geleneksel Bali Masajı (60 Dk)',
    slug: 'geleneksel-bali-masaji-60',
    category: 'Vücut Terapileri',
    categorySlug: 'vucut-terapileri',
    description: 'Bitkisel aromatik yağlarla derinlemesine kas gevşetici, kan dolaşımını hızlandırıcı profesyonel Bali masajı seansı.',
    price: 1200,
    sku: 'BSS-BLI-60',
    vatRate: 10, // Hizmetlerde KDV 10%
    rating: 4.9,
    salesCount: 145,
    badge: 'Aromaterapi Seansı',
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=600',
    durationMin: 60,
    serviceAreaRadiusKm: 15,
    bookingSlots: ['10:00', '11:30', '13:00', '14:30', '16:00', '17:30', '19:00', '20:30']
  },
  {
    id: 'prod-401',
    tenantId: 'tenant-1',
    storeName: 'Mert Kundura Ltd.',
    type: 'retail',
    title: 'Oversize Premium Pamuklu Kapşonlu Sweatshirt',
    slug: 'oversize-premium-pamuklu-kapsonlu-sweatshirt',
    category: 'Giyim',
    categorySlug: 'giyim',
    description: '3 iplik şardonlu %100 organik pamuk kumaş, içi yumuşak polar dokulu, unisex oversize kesim kapşonlu sweatshirt.',
    price: 1150,
    sku: 'MKT-SWT-01',
    vatRate: 20,
    rating: 4.8,
    salesCount: 520,
    badge: 'Kargo Bedava',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=600',
    variants: {
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Antrasit', 'Siyah', 'Melanj Gri']
    }
  },
  {
    id: 'prod-402',
    tenantId: 's1',
    storeName: 'Atölye Zanaat',
    type: 'retail',
    title: 'El Yapımı Seramik Kahve Fincan Takımı (4lü)',
    slug: 'el-yapimi-seramik-kahve-fincan-takimi',
    category: 'Ev & Yaşam',
    categorySlug: 'ev-yasam',
    description: 'Yüksek derecede fırınlanmış özel sır kaplamalı, el yapımı seramik Türk kahvesi fincanı ve tabak seti.',
    price: 890,
    sku: 'ATZ-SRM-04',
    vatRate: 20,
    rating: 4.9,
    salesCount: 230,
    badge: 'Zanaatkâr Ürünü',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    variants: {
      sizes: ['Standart (4lü Set)'],
      colors: ['Toprak', 'Karamel', 'Zeytin Yeşili']
    }
  },
  {
    id: 'prod-403',
    tenantId: 's2',
    storeName: 'Mega Endüstriyel',
    type: 'wholesale',
    title: 'Kablosuz Ergonomik Dikey Mouse ve Klavye Seti',
    slug: 'kablosuz-ergonomik-dikey-mouse-klavye-seti',
    category: 'Elektronik',
    categorySlug: 'elektronik',
    description: 'Bilek ağrılarını önleyen dikey açılı ergonomik mouse ve sessiz tuş dizilimli kablosuz ofis klavye seti.',
    price: 1950,
    sku: 'MGA-ERG-99',
    vatRate: 20,
    rating: 4.7,
    salesCount: 310,
    badge: 'Hızlı Teslimat',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600',
    variants: {
      sizes: ['Standart'],
      colors: ['Mat Siyah', 'Uzay Grisi']
    }
  },
  {
    id: 'prod-404',
    tenantId: 'tenant-3',
    storeName: 'Bursa Spa & Sağlık',
    type: 'retail',
    title: 'Doğal Keçi Sütü ve Esansiyel Yağlı Sabun Seti',
    slug: 'dogal-keci-sutu-esansiyel-yagli-sabun-seti',
    category: 'Kozmetik',
    categorySlug: 'kozmetik',
    description: 'Soğuk sıkım zeytinyağı ve taze keçi sütünden üretilmiş, hassas ciltler için nemlendirici doğal sabun koleksiyonu (3lü).',
    price: 450,
    sku: 'BSS-SBN-03',
    vatRate: 20,
    rating: 4.9,
    salesCount: 780,
    badge: 'Doğal & Organik',
    image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&q=80&w=600',
    variants: {
      sizes: ['3lü Hediye Kutusu'],
      colors: ['Doğal Beyaz', 'Lavanta', 'Defne']
    }
  },
  {
    id: 'prod-405',
    tenantId: 's3',
    storeName: 'FotoSentez Stüdyo',
    type: 'service',
    title: 'Açık Hava Düğün ve Nişan Klip Çekimi',
    slug: 'acik-hava-dugun-ve-nisan-klip-cekimi',
    category: 'Medya & Fotoğraf',
    categorySlug: 'medya-fotograf',
    description: '4K sinematik drone çekimleri, profesyonel gimbal ve renk düzenlemeli (Color Grading) 3 dakikalık özet klip.',
    price: 9500,
    sku: 'FTS-CIN-02',
    vatRate: 20,
    rating: 5.0,
    salesCount: 45,
    badge: 'Özel Rezervasyon',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600',
    durationMin: 360,
    serviceAreaRadiusKm: 100,
    bookingSlots: ['10:00 - 16:00', '14:00 - 20:00']
  },

  // ==========================================================
  // TAMDİJİTAL (ETSY & GUMROAD MODELİ DİJİTAL İNDİRİLEBİLİR ÜRÜNLER)
  // ==========================================================
  {
    id: 'dig-prod-101',
    tenantId: 's1',
    storeName: 'Atölye Zanaat',
    type: 'digital',
    title: 'Geleneksel Maraş İşi Çiçekli Nakış Deseni Paketi',
    slug: 'maras-isi-cicekli-nakis-deseni-paketi',
    category: 'Dijital Tasarım & Nakış',
    categorySlug: 'dijital-tasarim',
    description: 'Ev tekstili, çeyiz ve giyim için yüksek çözünürlüklü endüstriyel nakış makinesi deseni. Tüm popüler nakış formatlarını ve renk yerleşim tablosunu içerir.',
    price: 380,
    sku: 'DIG-NKS-01',
    vatRate: 20,
    rating: 4.9,
    salesCount: 420,
    badge: 'Anında Dijital İndirme',
    image: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=600&auto=format&fit=crop&q=80',
    deliveryOptions: {
      type: 'digital_download',
      digitalFileName: 'Maras_Isi_Nakis_Paketi_v2.1.zip',
      digitalFileSize: '14.8 MB',
      digitalFormats: ['DST', 'PES', 'JEF', 'EXP', 'PDF Kılavuz'],
      licenseType: 'commercial',
      digitalFileUrl: '#download-maras-nakis-v2'
    }
  },
  {
    id: 'dig-prod-102',
    tenantId: 's1',
    storeName: 'Atölye Zanaat',
    type: 'digital',
    title: 'CNC & Lazer Kesim Geometrik Ahşap Duvar Tablosu (Vektörel)',
    slug: 'cnc-lazer-kesim-geometrik-ahsap-duvar-tablosu',
    category: 'Lazer & Vektör Çizim',
    categorySlug: 'dijital-tasarim',
    description: '3mm ve 6mm MDF/Kontrplak lazer kesim makineleri için sıfır toleransla çizilmiş parametrik vektör şablonu.',
    price: 260,
    sku: 'DIG-CNC-02',
    vatRate: 20,
    rating: 5.0,
    salesCount: 290,
    badge: 'Anında Dijital İndirme',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
    deliveryOptions: {
      type: 'digital_download',
      digitalFileName: 'Geometrik_Duvar_Paneli_Vektorel.zip',
      digitalFileSize: '8.4 MB',
      digitalFormats: ['DXF', 'SVG', 'CDR', 'AI', 'PDF'],
      licenseType: 'commercial',
      digitalFileUrl: '#download-cnc-wallart'
    }
  },
  {
    id: 'dig-prod-103',
    tenantId: 's2',
    storeName: 'Mega Endüstriyel',
    type: 'digital',
    title: '3D Yazıcı Baskıya Hazır Mitolojik Heykel STL Modeli',
    slug: '3d-yazici-mitolojik-heykel-stl-modeli',
    category: '3D STL & Modelleme',
    categorySlug: 'dijital-tasarim',
    description: 'Reçine (SLA) ve filament (FDM) yazıcılar için önceden destekleri (pre-supported) eklenmiş kusursuz detaylı büst STL dosyası.',
    price: 490,
    sku: 'DIG-STL-03',
    vatRate: 20,
    rating: 4.8,
    salesCount: 155,
    badge: 'Anında Dijital İndirme',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
    deliveryOptions: {
      type: 'digital_download',
      digitalFileName: 'Zeus_Bust_HighPoly_PreSupported.stl',
      digitalFileSize: '42.6 MB',
      digitalFormats: ['STL', 'OBJ', '3MF'],
      licenseType: 'personal',
      digitalFileUrl: '#download-stl-statue'
    }
  },

  // ==========================================================
  // TAMSEANS (SUPERPEER & CALENDLY MODELİ UZAKTAN CANLI GÖRÜŞMELER)
  // ==========================================================
  {
    id: 'sns-prod-201',
    tenantId: 's3',
    storeName: 'FotoSentez Stüdyo & Danışmanlık',
    type: 'consultation',
    title: 'Bireysel Kariyer & E-Ticaret İşletme Danışmanlığı (45 Dk)',
    slug: 'bireysel-kariyer-eticaret-danismanligi',
    category: 'Online Danışmanlık',
    categorySlug: 'online-seans',
    description: 'Google Meet üzerinden birebir canlı video seansı. Marka konumlandırma, ürün fiyatlandırma ve online satış stratejinizi birlikte çiziyoruz.',
    price: 1250,
    sku: 'SNS-DAN-01',
    vatRate: 20,
    rating: 5.0,
    salesCount: 64,
    badge: 'Uzaktan Canlı Seans',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    deliveryOptions: {
      type: 'online_session',
      sessionDurationMin: 45,
      availableDays: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'],
      availableHours: ['10:00', '11:30', '14:00', '15:30', '17:00'],
      sessionChannel: 'google_meet',
      meetingLink: 'https://meet.google.com/tpz-danisman-alperen',
      expertTitle: 'Kıdemli E-Ticaret Danışmanı'
    }
  },
  {
    id: 'sns-prod-202',
    tenantId: 'tenant-3',
    storeName: 'Bursa Spa & Sağlık',
    type: 'consultation',
    title: 'Klinik Diyetisyen Online Beslenme & Yaşam Seansı (45 Dk)',
    slug: 'klinik-diyetisyen-online-beslenme-seansi',
    category: 'Beslenme & Sağlık',
    categorySlug: 'online-seans',
    description: 'Kan tahlilleri ve yaşam tarzınıza göre hazırlanan haftalık beslenme programı ve birebir online motivasyon takibi.',
    price: 950,
    sku: 'SNS-DYT-02',
    vatRate: 10,
    rating: 4.9,
    salesCount: 110,
    badge: 'Uzaktan Canlı Seans',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80',
    deliveryOptions: {
      type: 'online_session',
      sessionDurationMin: 45,
      availableDays: ['Pazartesi', 'Çarşamba', 'Cuma', 'Cumartesi'],
      availableHours: ['09:30', '11:00', '14:00', '16:00'],
      sessionChannel: 'google_meet',
      meetingLink: 'https://meet.google.com/tpz-diyet-zeynep',
      expertTitle: 'Uzman Klinik Diyetisyen'
    }
  },

  // ==========================================================
  // 5 HİBRİT TİCARET TÜRÜ ZENGİN ÜRÜN & HİZMET VERİ SETİ
  // ==========================================================
  // a) Ulusal Kargo & Pazaryeri Vitrini (Trendyol/Amazon Modeli)
  {
    id: 'prod-hyb-01',
    tenantId: 'tenant-1',
    storeName: 'Mert Kundura Ltd.',
    type: 'retail',
    title: 'Hakiki Deri El Yapımı Oxford Ayakkabı',
    slug: 'hakiki-deri-el-yapimi-oxford-ayakkabi',
    category: 'Ayakkabı & Giyim',
    categorySlug: 'ayakkabi',
    description: 'Usta ellerde şekillendirilmiş %100 dana derisi, nefes alan astar ve dayanıklı kösele tabanlı klasik Oxford ayakkabı.',
    price: 1450,
    sku: 'MKT-OXF-1450',
    vatRate: 20,
    rating: 4.9,
    salesCount: 380,
    badge: 'Kargo Bedava',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800',
    variants: {
      sizes: ['40', '41', '42', '43', '44'],
      colors: ['Klasik Siyah', 'Koyu Taba']
    },
    deliveryOptions: {
      type: 'physical_cargo',
      carrierCompany: 'Yurtiçi Kargo',
      isFreeShipping: true,
      desi: 2
    }
  },
  {
    id: 'prod-hyb-02',
    tenantId: 'tenant-2',
    storeName: 'Yıldız Doğal Ürünler',
    type: 'retail',
    title: 'Giresun/Ordu Taş Kırma Doğal Çifte Kavrulmuş Fındık 1 KG',
    slug: 'giresun-ordu-dogal-cifte-kavrulmus-findik-1kg',
    category: 'Yöresel Gıda',
    categorySlug: 'yoresel-gida',
    description: 'Karadeniz dağlarından taze hasat, taş kırma yöntemiyle ayıklanmış ve odun ateşinde çifte kavrulmuş yağlı Giresun kalite fındık.',
    price: 380,
    sku: 'YDG-FND-1KG',
    vatRate: 1,
    rating: 4.9,
    salesCount: 890,
    badge: 'Sepette %10 İndirim',
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=800',
    deliveryOptions: {
      type: 'physical_cargo',
      carrierCompany: 'Aras Kargo',
      isFreeShipping: true,
      desi: 1
    }
  },

  // b) Sıcak Yerel Sipariş & Mahalle Lezzetleri (Yemeksepeti Modeli)
  {
    id: 'prod-hyb-03',
    tenantId: 's1',
    storeName: 'Tarihi Karadeniz Pide Salonu',
    type: 'retail',
    title: 'Odun Ateşinde Kıymalı Kaşarlı Pide Menü',
    slug: 'odun-atesinde-kiymali-kasarli-pide-menu',
    category: 'Sıcak Yemek & Pide',
    categorySlug: 'sicak-lezzet',
    description: 'Geleneksel taş fırında odun ateşinde pişen çıtır kıymalı kaşarlı kapalı pide, yanında yayık ayranı ve közlenmiş biber salatası ile.',
    price: 220,
    sku: 'KRD-PDE-01',
    vatRate: 10,
    rating: 4.9,
    salesCount: 540,
    badge: '30-45 Dk Kapında',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    deliveryOptions: {
      type: 'local_express',
      localDeliveryTime: '30-45 Dk',
      minBasketAmount: 150,
      isTakeawayAllowed: true
    }
  },
  {
    id: 'prod-hyb-04',
    tenantId: 'tenant-2',
    storeName: 'Mahalle Çarşı Manavı',
    type: 'retail',
    title: 'Günlük Taze Meyve & Şarküteri Paketi',
    slug: 'gunluk-taze-meyve-sarkuteri-paketi',
    category: 'Taze Market & Şarküteri',
    categorySlug: 'taze-market',
    description: 'Amasya elması, yerli muz, köy tereyağı, sepet peyniri ve taze mevsim yeşilliklerinden oluşan günlük vitamin & kahvaltı sepeti.',
    price: 290,
    sku: 'MHL-MNV-01',
    vatRate: 1,
    rating: 4.8,
    salesCount: 310,
    badge: 'Sıcak Teslimat',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800',
    deliveryOptions: {
      type: 'local_express',
      localDeliveryTime: '25-35 Dk',
      minBasketAmount: 100
    }
  },

  // c) Acil Nöbetçi Hizmetler & Yerel Ustalar (Armut/Acil Servis Modeli)
  {
    id: 'prod-hyb-05',
    tenantId: 's1',
    storeName: 'Kale Nöbetçi Çilingir & Kilit',
    type: 'service',
    title: '7/24 Acil Çilingir & Kapı Açma',
    slug: '7-24-acil-cilingir-kapi-acma',
    category: 'Acil Servis & Çilingir',
    categorySlug: 'acil-servis',
    description: 'Çelik kapı, oto kapısı ve kasa kilitleri için 15 dakika içinde adrese ulaşım, rozetli bilyalı kilit değişimi ve hasarsız açma garantisi.',
    price: 500,
    sku: 'CLN-724-01',
    vatRate: 20,
    rating: 5.0,
    salesCount: 420,
    badge: 'En Yakın Usta (1.2 km)',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800',
    durationMin: 20,
    serviceAreaRadiusKm: 25,
    deliveryOptions: {
      type: 'field_service',
      fixedServiceFee: 500,
      serviceRadiusKm: 25,
      isOnSiteService: true
    }
  },
  {
    id: 'prod-hyb-06',
    tenantId: 's2',
    storeName: 'Özdemir 7/24 Yol Yardım',
    type: 'service',
    title: '7/24 Şehir İçi Oto Çekici & Kurtarma',
    slug: '7-24-sehir-ici-oto-cekici-kurtarma',
    category: 'Oto Kurtarma & Çekici',
    categorySlug: 'oto-kurtarma',
    description: 'Kaza, arıza veya akü takviyesi durumunda anında GPS konumuna yönlendirilen kayar platformlu modern çekici araç filosu.',
    price: 1200,
    sku: 'CKC-724-02',
    vatRate: 20,
    rating: 4.9,
    salesCount: 650,
    badge: 'Nöbetçi Çekici (15 Dk)',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=800',
    durationMin: 30,
    serviceAreaRadiusKm: 80,
    deliveryOptions: {
      type: 'field_service',
      fixedServiceFee: 1200,
      serviceRadiusKm: 80,
      isOnSiteService: true
    }
  },

  // d) Mekan & Etkinlik Rezervasyonları
  {
    id: 'prod-hyb-07',
    tenantId: 's3',
    storeName: 'Yalı Garden Davet & Balo',
    type: 'service',
    title: 'Panoramik Deniz Manzaralı Kır Düğün & Davet Salonu',
    slug: 'panoramik-deniz-manzarali-kir-dugun-salonu',
    category: 'Mekan & Rezervasyon',
    categorySlug: 'mekan-davet',
    description: '750 kişilik çim alan, ses-ışık orkestra sistemi, gelin odası, profesyonel yemek servisi ve fotoğraf/video çekim dahil lüks kır düğünü paketi.',
    price: 45000,
    sku: 'DAV-KIR-01',
    vatRate: 20,
    rating: 5.0,
    salesCount: 78,
    badge: 'Tarih Seç / Randevulu',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800',
    durationMin: 300,
    serviceAreaRadiusKm: 150,
    deliveryOptions: {
      type: 'field_service',
      isOnSiteService: true
    }
  },
  {
    id: 'prod-hyb-08',
    tenantId: 's2',
    storeName: 'TSE Onaylı Lider Oto Ekspertiz',
    type: 'service',
    title: 'Garantili Bilgisayarlı Oto Ekspertiz Paketi',
    slug: 'garantili-bilgisayarli-oto-ekspertiz-paketi',
    category: 'Oto Servis & Ekspertiz',
    categorySlug: 'oto-ekspertiz',
    description: 'Dyno motor testi, kaporta-boya mikron ölçümü, OBD beyin arıza taraması, süspansiyon testi ve 1 yıl garantili noter geçerli resmi rapor.',
    price: 1250,
    sku: 'EXP-FUL-01',
    vatRate: 20,
    rating: 4.9,
    salesCount: 510,
    badge: 'Tarih Seç / Randevulu',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=800',
    durationMin: 45,
    serviceAreaRadiusKm: 30,
    deliveryOptions: {
      type: 'field_service',
      isOnSiteService: true
    }
  },

  // e) Anında Dijital İndirme (TamDijital)
  {
    id: 'prod-hyb-09',
    tenantId: 's1',
    storeName: 'Atölye Zanaat Nakış',
    type: 'digital',
    title: 'Geleneksel Maraş İşi & Çiçek Nakış Deseni Paketi (DST, PES, JEF)',
    slug: 'maras-isi-cicek-nakis-deseni-paketi',
    category: 'Dijital Tasarım & Nakış',
    categorySlug: 'dijital-tasarim',
    description: 'Tüm endüstriyel ve ev tipi nakış makineleri için sıfır kayma garantili simetri çiçek bordür deseni. Anında ZIP indirilebilir.',
    price: 140,
    sku: 'DIG-MRS-140',
    vatRate: 20,
    rating: 4.9,
    salesCount: 380,
    badge: 'Anında Dijital İndir (ZIP/DST/PES)',
    image: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=600&auto=format&fit=crop&q=80',
    deliveryOptions: {
      type: 'digital_download',
      digitalFileName: 'Maras_Isi_Cicek_Nakis_Paketi.zip',
      digitalFileSize: '12.4 MB',
      digitalFormats: ['DST', 'PES', 'JEF', 'EXP', 'PDF Renk Kartı'],
      licenseType: 'commercial',
      digitalFileUrl: '#download-maras-cicek'
    }
  },
  {
    id: 'prod-hyb-10',
    tenantId: 's1',
    storeName: 'Atölye Zanaat Vektör',
    type: 'digital',
    title: 'Lazer Kesim & CNC Ahşap Dekoratif Saat Çizimi (DXF, SVG)',
    slug: 'lazer-kesim-cnc-ahsap-dekoratif-saat-cizimi',
    category: 'Lazer & Vektör Çizim',
    categorySlug: 'dijital-tasarim',
    description: '3mm ve 4mm ahşap, pleksi veya mdf kesimler için test edilmiş katmanlı Roma rakamlı duvar saati şablonu.',
    price: 95,
    sku: 'DIG-SAT-95',
    vatRate: 20,
    rating: 5.0,
    salesCount: 460,
    badge: 'Anında Dijital İndir (DXF/SVG)',
    image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=600&auto=format&fit=crop&q=80',
    deliveryOptions: {
      type: 'digital_download',
      digitalFileName: 'Dekoratif_Ahsap_Saat_DXF_SVG.zip',
      digitalFileSize: '6.2 MB',
      digitalFormats: ['DXF', 'SVG', 'CDR', 'AI', 'PDF'],
      licenseType: 'commercial',
      digitalFileUrl: '#download-cnc-clock'
    }
  },

  // f) Uzaktan Canlı Seans & Özel Ders (TamSeans)
  {
    id: 'prod-hyb-11',
    tenantId: 's3',
    storeName: 'Uzman Klinik Psikoloji',
    type: 'consultation',
    title: 'Yetişkin Bireysel Online Psikolojik Danışmanlık (50 Dk)',
    slug: 'yetiskin-bireysel-online-psikolojik-danismanlik',
    category: 'Online Seans & Terapi',
    categorySlug: 'online-seans',
    description: 'Google Meet HD üzerinden uçtan uca şifreli, gizlilik ilkelerine tam bağlı bireysel psikoterapi ve bilişsel davranışçı seans.',
    price: 850,
    sku: 'SNS-PSK-850',
    vatRate: 10,
    rating: 5.0,
    salesCount: 190,
    badge: 'Online Seans (Google Meet)',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    deliveryOptions: {
      type: 'online_session',
      sessionDurationMin: 50,
      availableDays: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'],
      availableHours: ['10:00', '13:00', '15:30', '17:00', '19:00'],
      sessionChannel: 'google_meet',
      meetingLink: 'https://meet.google.com/tpz-psikolog-seans',
      expertTitle: 'Uzman Klinik Psikolog'
    }
  },
  {
    id: 'prod-hyb-12',
    tenantId: 's3',
    storeName: 'Global Language Academy',
    type: 'consultation',
    title: 'Birebir Konuşma Odaklı İleri Seviye İngilizce Dersi (45 Dk)',
    slug: 'birebir-konusma-ileri-seviye-ingilizce-dersi',
    category: 'Online Eğitim & Dil',
    categorySlug: 'online-seans',
    description: 'İş İngilizcesi mülakatları, sunum hazırlıkları ve akıcı konuşma (Fluency) odaklı anadili İngilizce olan eğitmenle birebir seans.',
    price: 450,
    sku: 'SNS-ENG-450',
    vatRate: 10,
    rating: 4.9,
    salesCount: 280,
    badge: 'Online Seans (Google Meet)',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80',
    deliveryOptions: {
      type: 'online_session',
      sessionDurationMin: 45,
      availableDays: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cumartesi'],
      availableHours: ['11:00', '14:00', '16:00', '18:30', '20:00'],
      sessionChannel: 'google_meet',
      meetingLink: 'https://meet.google.com/tpz-english-live',
      expertTitle: 'Kıdemli IELTS/TOEFL Eğitmeni'
    }
  },
  {
    id: 'prod-hyb-13',
    tenantId: 's1',
    storeName: 'Tarihi Karadeniz Dönercisi',
    type: 'retail',
    title: 'Odun Ateşinde Yaprak Et Döner Dürüm Menü',
    slug: 'odun-atesinde-et-doner-menu',
    category: 'Sıcak Yemek & Döner',
    categorySlug: 'sicak-lezzet',
    description: 'Özel terbiye edilmiş dana yaprak et döner, tırnak pide veya lavaş arası, yanında çıtır patates ve bol köpüklü ayran ile.',
    price: 240,
    sku: 'DNR-MEN-01',
    vatRate: 10,
    rating: 4.8,
    salesCount: 680,
    badge: '20-30 Dk Kapında',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80&w=800',
    deliveryOptions: {
      type: 'local_express',
      localDeliveryTime: '20-30 Dk',
      minBasketAmount: 120,
      isTakeawayAllowed: true
    }
  },
  {
    id: 'prod-hyb-14',
    tenantId: 's1',
    storeName: 'Kuzey Teknik Tesisat',
    type: 'service',
    title: 'Termal Cihazla Kırmadan Su Kaçağı Tespiti + Resmi Rapor',
    slug: 'termal-su-kacagi-tespiti',
    category: 'Sıhhi Tesisat & Keşif',
    categorySlug: 'sihhi-tesisat',
    description: 'Akustik dinleme ve termal kamera ile noktasal su kaçağı tespiti, sigorta ve belediye geçerli resmi teknik raporlama.',
    price: 1200,
    sku: 'TSS-TRM-01',
    vatRate: 20,
    rating: 4.9,
    salesCount: 310,
    badge: 'Yerinde Keşif (1.5 km)',
    image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=800',
    durationMin: 60,
    serviceAreaRadiusKm: 30,
    deliveryOptions: {
      type: 'field_service',
      fixedServiceFee: 1200,
      serviceRadiusKm: 30,
      isOnSiteService: true
    }
  },
  // B2B & TOPTAN TİCARET & DROPSHIPPING (FAIRE & SPOCKET MODELİ)
  {
    id: 'prod-b2b-01',
    tenantId: 's2',
    storeName: 'Merter Toptan Tekstil & Konfeksiyon San.',
    type: 'wholesale',
    title: 'Toptan 1 Seri (6 Adet) Oversize 3 İplik Şardonlu Sweatshirt Paketi (S-M-L-XL Asorti)',
    slug: 'toptan-seri-oversize-sardonlu-sweatshirt-paketi',
    category: 'Toptan Tekstil & Giyim',
    categorySlug: 'toptan-tekstil',
    description: 'İstanbul Merter/Güngören üretim merkezinden birinci sınıf %100 pamuklu 3 iplik şardonlu kışlık oversize sweatshirt serisi. 1 pakette 6 adet (1S, 2M, 2L, 1XL) asorti yer alır. İçi polar tüylü, çekmezlik garantili.',
    price: 1680, // Seri fiyatı (280 TL x 6 adet)
    sku: 'MRT-SWT-SR6',
    vatRate: 10,
    rating: 4.9,
    salesCount: 1420,
    badge: 'Toptan Seri (6 Adet Paket)',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
    stockCount: 850,
    brand: 'Merter Fabrika',
    isB2BOnly: true,
    b2bMinQty: 5,
    b2bUnitType: 'seri',
    b2bWholesalePrice: 1680,
    b2bTieredPricing: [
      { minQty: 5, maxQty: 19, price: 1680 },
      { minQty: 20, maxQty: 49, price: 1500 },
      { minQty: 50, maxQty: null, price: 1320 }
    ],
    allowDropshipping: true,
    suggestedRetailPrice: 650, // Adet başına önerilen perakende satış fiyatı
    deliveryOptions: {
      type: 'physical_cargo',
      carrierCompany: 'Yurtiçi Kargo Palet & Koli',
      isFreeShipping: true,
      desi: 6
    }
  },
  {
    id: 'prod-b2b-02',
    tenantId: 's1',
    storeName: 'Gedikpaşa Zanaat Ayakkabı Toptan İmalat',
    type: 'wholesale',
    title: 'Toptan 1 Koli (8 Çift) Hakiki Dana Derisi El İşçiliği Oxford Erkek Ayakkabı (40-44 Asorti)',
    slug: 'toptan-koli-hakiki-deri-oxford-ayakkabi-serisi',
    category: 'Toptan Ayakkabı & Kundura',
    categorySlug: 'toptan-ayakkabi',
    description: 'İstanbul Gedikpaşa ve İzmir Işıkkent usta atölyelerinde kösele taban ve hakiki vidala dana derisinden üretilmiş kurumsal toptan seri. 1 kolide 8 çift (1x40, 2x41, 3x42, 1x43, 1x44) asorti kutulu ayakkabı bulunmaktadır.',
    price: 6000, // Koli fiyatı (750 TL x 8 çift)
    sku: 'GDK-KOL-8CK',
    vatRate: 10,
    rating: 5.0,
    salesCount: 890,
    badge: 'Toptan Koli (8 Çift Asorti)',
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=800',
    stockCount: 340,
    brand: 'Gedikpaşa Zanaat',
    isB2BOnly: true,
    b2bMinQty: 2,
    b2bUnitType: 'koli',
    b2bWholesalePrice: 6000,
    b2bTieredPricing: [
      { minQty: 2, maxQty: 9, price: 6000 },
      { minQty: 10, maxQty: 24, price: 5440 },
      { minQty: 25, maxQty: null, price: 4960 }
    ],
    allowDropshipping: true,
    suggestedRetailPrice: 1650, // Çift başına önerilen perakende satış fiyatı
    deliveryOptions: {
      type: 'physical_cargo',
      carrierCompany: 'Aras Kargo Koli Sevk',
      isFreeShipping: true,
      desi: 14
    }
  },
  {
    id: 'prod-b2b-03',
    tenantId: 's3',
    storeName: 'Ordu/Giresun Fındık Çiftliği Kooperatifi',
    type: 'wholesale',
    title: 'Toptan 1 Çuval (50 KG) Vakumlu Çifte Kavrulmuş Giresun Kalite Fındık İçi',
    slug: 'toptan-cuval-50kg-vakumlu-cifte-kavrulmus-findik',
    category: 'Toptan Yöresel Gıda & Tarım',
    categorySlug: 'toptan-gida',
    description: 'Doğu Karadeniz çiftçilerimizden toplanan, taş kırma yöntemiyle ayıklanıp odun fırınında çifte kavrulan 1. kalite yağlı fındık içi. 50 KG jüt çuval içerisinde 5\'er kiloluk 10 adet koruyucu vakumlu pakette sevk edilir.',
    price: 16000, // Çuval fiyatı (320 TL/KG x 50 KG)
    sku: 'FND-CVL-50KG',
    vatRate: 1,
    rating: 4.9,
    salesCount: 620,
    badge: 'Toptan 50 KG Çuval',
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=800',
    stockCount: 180,
    brand: 'Giresun Çiftçi Kooperatifi',
    isB2BOnly: true,
    b2bMinQty: 1,
    b2bUnitType: 'cuval',
    b2bWholesalePrice: 16000,
    b2bTieredPricing: [
      { minQty: 1, maxQty: 4, price: 16000 },
      { minQty: 5, maxQty: 19, price: 14500 },
      { minQty: 20, maxQty: null, price: 13000 }
    ],
    allowDropshipping: true,
    suggestedRetailPrice: 480, // KG başına önerilen perakende satış fiyatı
    deliveryOptions: {
      type: 'physical_cargo',
      carrierCompany: 'MNG Kargo Ambar Sevk',
      isFreeShipping: true,
      desi: 50
    }
  }
];

export const initialLedgerAccounts: LedgerAccount[] = [
  // Mert Kundura Customers
  {
    id: 'acc-101',
    tenantId: 'tenant-1',
    name: 'Ayhan Yılmaz (Perakende Alıcı)',
    code: '120.01.001',
    type: 'buyer',
    balance: 3450,
    email: 'ayhan.yilmaz@gmail.com',
    taxId: '1284910291'
  },
  {
    id: 'acc-102',
    tenantId: 'tenant-1',
    name: 'Derimod San. Tic. A.Ş. (Toptan Bayi)',
    code: '120.02.001',
    type: 'buyer',
    balance: 45000,
    email: 'muhasebe@derimod.com.tr',
    taxId: '2910491029'
  },
  // Yıldız Toptan Gıda Customers / Suppliers
  {
    id: 'acc-201',
    tenantId: 'tenant-2',
    name: 'Gurme Restoran Zinciri A.Ş.',
    code: '120.01.001',
    type: 'buyer',
    balance: 148500,
    email: 'finance@gurmerestoran.com',
    taxId: '9840291039'
  },
  {
    id: 'acc-202',
    tenantId: 'tenant-2',
    name: 'Akdeniz Tarım Kooperatifi',
    code: '320.01.001',
    type: 'supplier',
    balance: -85000, // Payable balance
    email: 'alimalat@akdeniztarim.org',
    taxId: '5849102918'
  }
];

export const initialLedgerTransactions: LedgerTransaction[] = [
  // Mert Kundura
  {
    id: 'tx-101',
    tenantId: 'tenant-1',
    accountId: 'acc-101',
    date: '2026-09-20',
    description: 'Fatura Satış Kaydı - GIB2026000000101',
    debit: 3450,
    credit: 0,
    balanceAfter: 3450
  },
  {
    id: 'tx-102',
    tenantId: 'tenant-1',
    accountId: 'acc-102',
    date: '2026-09-15',
    description: 'Toplu Chelsea Bot Satışı - GIB2026000000102',
    debit: 45000,
    credit: 0,
    balanceAfter: 45000
  },
  // Yıldız Toptan Gıda
  {
    id: 'tx-201',
    tenantId: 'tenant-2',
    accountId: 'acc-201',
    date: '2026-09-18',
    description: 'Zeytinyağı Toptan Satışı (90 Adet) - GIB2026000000201',
    debit: 148500,
    credit: 0,
    balanceAfter: 148500
  },
  {
    id: 'tx-202',
    tenantId: 'tenant-2',
    accountId: 'acc-202',
    date: '2026-09-10',
    description: 'Ham Zeytin Alımı Depo Teslim',
    debit: 0,
    credit: 85000,
    balanceAfter: -85000
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'inv-101',
    invoiceNumber: 'GIB2026000000101',
    orderId: 'ord-840291',
    tenantId: 'tenant-1',
    customerName: 'Ayhan Yılmaz',
    customerTaxOffice: 'Beşiktaş VD',
    customerTaxId: '1284910291',
    customerEmail: 'ayhan.yilmaz@gmail.com',
    date: '2026-09-20',
    amount: 2875.00, // Before VAT
    vatAmount: 575.00, // 20%
    withholdingTaxType: 'None',
    withholdingAmount: 0.00,
    totalPayable: 3450.00,
    status: 'issued',
    integrator: 'gib'
  },
  {
    id: 'inv-201',
    invoiceNumber: 'GIB2026000000201',
    orderId: 'ord-993019',
    tenantId: 'tenant-2',
    customerName: 'Gurme Restoran Zinciri A.Ş.',
    customerTaxOffice: 'Zincirlikuyu VD',
    customerTaxId: '9840291039',
    customerEmail: 'finance@gurmerestoran.com',
    date: '2026-09-18',
    amount: 147029.70,
    vatAmount: 1470.30, // 1%
    withholdingTaxType: 'None',
    withholdingAmount: 0.00,
    totalPayable: 148500.00,
    status: 'issued',
    integrator: 'uyumsoft'
  }
];
