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
}

export interface Product {
  id: string;
  tenantId: string;
  storeName?: string;
  type: 'retail' | 'wholesale' | 'service';
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

  // Service specific
  durationMin?: number;
  bookingSlots?: string[];
  serviceAreaRadiusKm?: number;
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
  type: 'buyer' | 'supplier';
  balance: number; // positive is receivable, negative is payable
  email: string;
  taxId: string;
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
  },
  {
    id: 's2',
    name: 'Mega Endüstriyel',
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
  },
  {
    id: 's3',
    name: 'FotoSentez Stüdyo',
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
    activePos: 'sipay',
  },
  {
    id: 'tenant-1',
    name: 'Mert Kundura Ltd.',
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
  },
  {
    id: 'tenant-2',
    name: 'Yıldız Toptan Gıda A.Ş.',
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
  },
  {
    id: 'tenant-3',
    name: 'Bursa Spa & Sağlık',
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
    byoPosConnected: false,
    activePos: null,
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
