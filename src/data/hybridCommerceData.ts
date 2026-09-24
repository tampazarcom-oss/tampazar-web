/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ==========================================
// 1. ESNAF ABONELİK & TİCARİ MODEL MİMARİSİ
// ==========================================

export interface SubscriptionTier {
  id: 'starter' | 'pro' | 'enterprise';
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number; // 2 ay indirimli
  invoiceQuota: number; // -1 = sınırsız
  features: string[];
  recommended?: boolean;
  color: string;
  badge: string;
}

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'starter',
    name: 'Esnaf Başlangıç (Yerel Paket)',
    tagline: 'Mahalle esnafı, kafe, butik ve tekil zanaatkarlar için ideal.',
    monthlyPrice: 490,
    annualPrice: 4900,
    invoiceQuota: 50,
    color: 'border-slate-300 text-slate-700',
    badge: 'Yerel Esnaf',
    features: [
      '%0 TamPazar Komisyonu (Sabit Aidat)',
      'Ayda 50 GİB e-Fatura / e-Arşiv Kotası',
      'Mahalle İçi Anlık Teslimat & Gel-Al',
      'QR Menü & Masa Sipariş Modülü',
      'Kendi Mobil/Sanal POS\'unu Bağlama',
      'Temel Kasa & Gelir-Gider Takibi',
      'Standart Tüketici Vitrini Listelemesi'
    ]
  },
  {
    id: 'pro',
    name: 'Esnaf Pro (Tam Hibrit & Ulusal)',
    tagline: 'Ulusal pazara açılan, kargo ve anlık servisi birleştiren profesyonel işletmeler.',
    monthlyPrice: 990,
    annualPrice: 9900,
    invoiceQuota: -1, // Sınırsız
    recommended: true,
    color: 'border-amber-400 ring-2 ring-amber-400 bg-amber-50/20 text-slate-900',
    badge: 'En Çok Tercih Edilen',
    features: [
      '%0 Komisyon Güvencesi (Doğrudan Esnaf Kasası)',
      'Sınırsız GİB UBL-TR 2.1 e-Fatura & e-Arşiv',
      'Tüm Ulusal Kargo Entegrasyonları (Yurtiçi, Aras, MNG)',
      'Tam Ön Muhasebe & ERP (BizimHesap/Paraşüt Kalitesi)',
      'Cari Hesap Defteri & WhatsApp ile Otomatik Ekstre',
      'Masaüstü Canlı Sipariş Zili (Yemek & Kurye)',
      'Saha Hizmetleri & Harita Konumlu Çağrı Takvimi',
      'Varyantlı Çoklu Depo & Kritik Stok Alarmları',
      'Arama Sonuçlarında Öne Çıkarılan Vitrin Rozeti'
    ]
  },
  {
    id: 'enterprise',
    name: 'Kurumsal AVM & Zincir Mağaza',
    tagline: 'Çok şubeli toptancılar, büyük üreticiler ve kurumsal AVM bayileri.',
    monthlyPrice: 1890,
    annualPrice: 18900,
    invoiceQuota: -1,
    color: 'border-indigo-600 text-slate-900',
    badge: 'Çok Şubeli ERP',
    features: [
      'Tüm Pro Özellikleri Dahil',
      'Sınırsız Şube, Kasa ve Personel Yetkilendirme',
      'B2B Toptan Fiyat Teklifi & Kademe İndirimleri',
      'GİB e-İrsaliye ve e-Müstahsil Entegrasyonu',
      'Gelişmiş Sanal POS Tahsilat & Taksit Matrisi',
      'Özel Muhasebeci / Mali Müşavir Erişim Portali',
      'Öncelikli 7/24 Telefon & WhatsApp Destek Hattı'
    ]
  }
];

export interface MerchantSubscription {
  currentTierId: 'starter' | 'pro' | 'enterprise';
  billingCycle: 'monthly' | 'annual';
  status: 'active' | 'trial' | 'past_due';
  startedAt: string;
  renewalDate: string;
  invoicesUsedThisMonth: number;
  invoicesLimit: number;
  paymentMethodMask: string;
  lastPaymentAmount: number;
}

export const initialMerchantSubscription: MerchantSubscription = {
  currentTierId: 'pro',
  billingCycle: 'monthly',
  status: 'active',
  startedAt: '2026-01-15',
  renewalDate: '2026-10-15',
  invoicesUsedThisMonth: 34,
  invoicesLimit: -1, // Sınırsız
  paymentMethodMask: 'Mastercard ···· 4028 (Otomatik Ödeme)',
  lastPaymentAmount: 990
};

// ==========================================
// 2. FİNANS & KASA (MULTI-WALLET & CASHFLOW)
// ==========================================

export interface WalletAccount {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'pos' | 'receivable_pool';
  balance: number;
  currency: string;
  bankName?: string;
  accountNumber?: string;
  iban?: string;
  badge: string;
  color: string;
}

export interface CashflowTransaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: 'Satış Tahsilatı' | 'Personel / Maaş' | 'Dükkan Kirası' | 'Elektrik / Su / Doğalgaz' | 'Toptancı Tedarik' | 'Vergi / Harç / SGK' | 'Kargo & Lojistik' | 'Diğer';
  amount: number;
  accountId: string;
  accountName: string;
  description: string;
  receiptNumber?: string;
}

export const initialWalletAccounts: WalletAccount[] = [
  {
    id: 'w-cash',
    name: 'Nakit Kasa (Dükkan Kasası)',
    type: 'cash',
    balance: 14650.00,
    currency: 'TRY',
    badge: 'Fiziksel Kasa',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    id: 'w-bank-garanti',
    name: 'Garanti BBVA Ticari Hesap',
    type: 'bank',
    balance: 82400.50,
    currency: 'TRY',
    bankName: 'Garanti BBVA',
    iban: 'TR44 0006 2000 1234 5678 9012 34',
    badge: 'Ana Ticari Hesap',
    color: 'bg-teal-50 text-teal-700 border-teal-200'
  },
  {
    id: 'w-pos-paytr',
    name: 'PayTR Sanal POS Kasası (Doğrudan Hesaba)',
    type: 'pos',
    balance: 38920.00,
    currency: 'TRY',
    bankName: 'PayTR Ödeme Kuruluşu',
    badge: '%0 TamPazar Komisyonu',
    color: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  {
    id: 'w-receivables',
    name: 'Vadeli Müşteri Alacakları (Açık Hesap)',
    type: 'receivable_pool',
    balance: 27500.00,
    currency: 'TRY',
    badge: 'Vadeli Alacak',
    color: 'bg-amber-50 text-amber-700 border-amber-200'
  }
];

export const initialCashflowTransactions: CashflowTransaction[] = [
  {
    id: 'cf-1',
    date: '2026-09-23 14:30',
    type: 'income',
    category: 'Satış Tahsilatı',
    amount: 1850.00,
    accountId: 'w-pos-paytr',
    accountName: 'PayTR Sanal POS',
    description: 'Minimalist Deri Oxford Ayakkabı satışı (Kemal Sunal)',
    receiptNumber: 'TPZ-2026-9921'
  },
  {
    id: 'cf-2',
    date: '2026-09-23 11:15',
    type: 'expense',
    category: 'Kargo & Lojistik',
    amount: 340.00,
    accountId: 'w-bank-garanti',
    accountName: 'Garanti BBVA Ticari Hesap',
    description: 'Yurtiçi Kargo toplu gönderi avansı',
    receiptNumber: 'YK-66291'
  },
  {
    id: 'cf-3',
    date: '2026-09-22 17:00',
    type: 'income',
    category: 'Satış Tahsilatı',
    amount: 750.00,
    accountId: 'w-cash',
    accountName: 'Nakit Kasa',
    description: 'Acil Elektrik Arıza yerinde servis bedeli nakit tahsilatı',
    receiptNumber: 'SRV-8821'
  },
  {
    id: 'cf-4',
    date: '2026-09-21 10:00',
    type: 'expense',
    category: 'Dükkan Kirası',
    amount: 12000.00,
    accountId: 'w-bank-garanti',
    accountName: 'Garanti BBVA Ticari Hesap',
    description: 'Eylül 2026 Dükkan Kirası Ödemesi (Mülk Sahibi)',
    receiptNumber: 'KIRA-2026-09'
  },
  {
    id: 'cf-5',
    date: '2026-09-20 16:20',
    type: 'expense',
    category: 'Toptancı Tedarik',
    amount: 8500.00,
    accountId: 'w-bank-garanti',
    accountName: 'Garanti BBVA Ticari Hesap',
    description: 'Deri Hammadde Alımı (Karadeniz Dericilik A.Ş.)',
    receiptNumber: 'FAT-99201'
  }
];

// ==========================================
// ==========================================
// 3. BEŞLİ HİBRİT TİCARET SİPARİŞ MODELİ
// ==========================================

export type HybridDeliveryType = 
  | 'CARGO'             // 1. TamKargo (Ulusal E-Ticaret & Kargo Gönderimi)
  | 'LOCAL_EXPRESS'     // 2. TamHızlı (30-45 Dk Anlık Yerel Teslimat & Masaüstü Zil)
  | 'FIELD_SERVICE'     // 3. TamUsta (Yerel Hizmet & Saha Servisi)
  | 'DIGITAL_DOWNLOAD'  // 4. TamDijital (Etsy & Gumroad Modeli Anında Dosya İndirme)
  | 'ONLINE_SESSION';   // 5. TamSeans (Superpeer & Calendly Modeli Canlı Randevu)

export type DirectPaymentMethod = 
  | 'CASH_ON_DELIVERY'        // Kapıda Nakit Ödeme (Doğrudan esnafa/kuryeye)
  | 'DOOR_CARD_POS'           // Kapıda Kredi Kartı / Esnafın Mobil POS'u
  | 'DIRECT_IBAN_TRANSFER'    // Esnafın Şahsi/Şirket IBAN Hesabına Doğrudan Havale
  | 'DIRECT_MERCHANT_GATEWAY' // Esnafın Kendi Sanal POS'u (BYO POS - PayTR/iyzico)
  | 'PAYTR_POS' 
  | 'IYZICO_POS' 
  | 'PAY_AT_DOOR';

export interface OrderItemCustomization {
  selectedWeightOrQty?: number;
  unitLabel?: string;
  removedIngredients?: string[];
  addedIngredients?: { name: string; price: number }[];
  selectedMandatoryOptions?: { groupTitle: string; optionName: string; priceDiff?: number }[];
  uploadedFiles?: { name: string; size: string; previewUrl?: string }[];
  customFormValues?: { fieldLabel: string; value: string }[];
}

export interface MultiStoreBreakdownItem {
  storeId: string;
  storeName: string;
  category: string;
  phone: string;
  amount: number;
  items: string[];
}

export interface SuspendedItemRecord {
  id: string;
  storeId: string;
  storeName: string;
  type: 'BREAD' | 'SOUP' | 'PIDE' | 'MEAL' | 'CUSTOM';
  typeName: string;
  unitPrice: number;
  count: number;
  deliveredCount: number;
  donorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface DigitalServiceProtocol {
  id: string;
  protocolNumber: string;
  quoteId: string;
  requestId: string;
  serviceTitle: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  merchantName: string;
  merchantPhone: string;
  merchantIban?: string;
  agreedPrice: number;
  agreedDuration: string;
  jobScopeDescription: string;
  directPaymentMethod: 'NAKIT' | 'IBAN' | 'KREDI_KARTI_POS';
  status: 'PENDING_WORK' | 'COMPLETED_VERIFIED';
  verifiedAt?: string;
  ratingGiven?: number;
  reputationPointsAwarded: number;
  tamPazarCertifiedBadge: boolean;
  createdAt: string;
}

export interface HybridOrder {
  id: string;
  orderNumber: string;
  deliveryType: HybridDeliveryType;
  tenantId: string;
  storeName: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  city: string;
  district: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  items: {
    productId: string;
    title: string;
    price: number;
    qty: number;
    sku?: string;
    variant?: string;
    customization?: OrderItemCustomization;
  }[];
  totalAmount: number;
  paymentMethod: DirectPaymentMethod;
  paymentStatus: 'PAID' | 'PENDING' | 'AT_DOOR';
  
  // Askıda Mahalle & Dayanışma Katkısı
  suspendedContribution?: {
    type: 'BREAD' | 'SOUP' | 'PIDE' | 'MEAL' | 'CUSTOM';
    typeName: string;
    count: number;
    unitPrice: number;
    totalAmount: number;
  };

  // Çoklu Mahalle Sepeti (TamKurye)
  isMultiStoreOrder?: boolean;
  multiStoreBreakdown?: MultiStoreBreakdownItem[];
  sharedCourierFee?: number;
  
  // Status by type
  status: 
    // Cargo:
    | 'NEW' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
    // Local Express:
    | 'RINGING' | 'ACCEPTED' | 'KITCHEN_PREPARING' | 'COURIER_ON_WAY'
    // Field Service:
    | 'DISPATCH_WAITING' | 'EN_ROUTE' | 'ON_SITE' | 'COMPLETED'
    // Digital Download:
    | 'DOWNLOAD_READY'
    // Online Session:
    | 'SCHEDULED' | 'IN_PROGRESS';

  // CARGO specifics
  cargoDetails?: {
    carrier: 'Yurtiçi Kargo' | 'Aras Kargo' | 'MNG Kargo';
    trackingNumber: string;
    barcode: string;
    despatchNumber?: string;
    shippedAt?: string;
  };

  // LOCAL EXPRESS specifics
  localDeliveryDetails?: {
    courierName: string;
    courierPhone: string;
    etaMinutes: number;
    deliverySubtype: 'COURIER_30MIN' | 'TAKEAWAY';
    preparationStartedAt?: string;
  };

  // FIELD SERVICE specifics
  serviceDetails?: {
    serviceCategory: string;
    scheduledTime: string;
    issueDescription: string;
    technicianName: string;
    technicianPhone: string;
    quotationAmount?: number;
    isEmergency: boolean;
    vehiclePlate?: string;
  };

  // DIGITAL DOWNLOAD specifics
  digitalDetails?: {
    fileUrl: string;
    fileName: string;
    fileSize: string;
    formatTags: string[];
    licenseType: 'personal' | 'commercial';
    downloadCount: number;
  };

  // ONLINE SESSION specifics
  sessionDetails?: {
    scheduledDate: string;
    timeSlot: string;
    durationMin: number;
    channel: 'google_meet' | 'zoom' | 'whatsapp_phone';
    meetingLink: string;
    expertTitle?: string;
    notes?: string;
  };

  invoiceNumber?: string;
  createdAt: string;
}

export const initialHybridOrders: HybridOrder[] = [
  // 1. ÖZELLEŞTİRİLMİŞ YEMEK SİPARİŞİ (Yemeksepeti / Döner Modeli: Malzeme Çıkarma & Ekstra)
  {
    id: 'ord-food-custom-1',
    orderNumber: 'TPZ-YEMEK-2026-0711',
    deliveryType: 'LOCAL_EXPRESS',
    tenantId: 's3',
    storeName: 'Tarihi Taşfırın & Döner Ustası',
    customerName: 'Burak Serengil',
    customerPhone: '+90 534 888 77 66',
    customerAddress: 'Bahçelievler Mah. 100. Yıl Bulvarı No: 15 D: 4, Altınordu',
    city: 'Ordu',
    district: 'Altınordu',
    coordinates: {
      lat: 40.9810,
      lng: 37.8830
    },
    items: [
      {
        productId: 'p-doner-hatay',
        title: 'Hatay Usulü Soslu Tavuk Döner Dürüm',
        price: 230, // 185 base + 30 kasar + 15 lavas
        qty: 2,
        sku: 'DNR-HATAY-01',
        customization: {
          removedIngredients: ['Soğan', 'Kornişon Turşu'],
          addedIngredients: [
            { name: 'Ekstra Kaşar Peyniri', price: 30 },
            { name: 'Çift Lavaş', price: 15 }
          ],
          selectedMandatoryOptions: [
            { groupTitle: 'Acı Tercihi', optionName: 'Orta Acılı (Klasik)' },
            { groupTitle: 'İçecek', optionName: 'Köy Yayık Ayranı (330ml)', priceDiff: 28 }
          ]
        }
      }
    ],
    totalAmount: 516, // (230 + 28) * 2 = 516
    paymentMethod: 'PAYTR_POS',
    paymentStatus: 'PAID',
    status: 'KITCHEN_PREPARING',
    localDeliveryDetails: {
      courierName: 'Kurye Serdar (Motosiklet)',
      courierPhone: '+90 541 333 44 55',
      etaMinutes: 22,
      deliverySubtype: 'COURIER_30MIN',
      preparationStartedAt: '2026-09-24 10:45'
    },
    invoiceNumber: 'GIB2026000000945',
    createdAt: '2026-09-24 10:42'
  },

  // 2. MANAV TARTILI SİPARİŞ (Kilogram / Gram Hassas Tartı)
  {
    id: 'ord-manav-weight-1',
    orderNumber: 'TPZ-MANAV-2026-0312',
    deliveryType: 'LOCAL_EXPRESS',
    tenantId: 's3',
    storeName: 'Manav & Şarküteri Pazarı',
    customerName: 'Fatma Gültekin',
    customerPhone: '+90 533 222 99 11',
    customerAddress: 'Akyazı Mah. Sahil Cad. Mavi Blok No: 8 D: 12, Altınordu',
    city: 'Ordu',
    district: 'Altınordu',
    coordinates: {
      lat: 40.9780,
      lng: 37.8920
    },
    items: [
      {
        productId: 'p-manav-elma',
        title: 'Bahçe Taze Amasya Elması',
        price: 45,
        qty: 2.5,
        sku: 'MNV-ELM-01',
        customization: {
          selectedWeightOrQty: 2.5,
          unitLabel: 'Kg'
        }
      }
    ],
    totalAmount: 112.5,
    paymentMethod: 'PAY_AT_DOOR',
    paymentStatus: 'PENDING',
    status: 'RINGING',
    localDeliveryDetails: {
      courierName: 'Hızlı Manav Çırağı (Elektrikli Bisiklet)',
      courierPhone: '+90 533 111 44 55',
      etaMinutes: 18,
      deliverySubtype: 'COURIER_30MIN',
      preparationStartedAt: '2026-09-24 10:50'
    },
    invoiceNumber: 'GIB2026000000946',
    createdAt: '2026-09-24 10:51'
  },

  // 3. FOTOĞRAF BASKI SİPARİŞİ (Müşteri Dosya / Fotoğraf Yüklemeli - ZIP İndirme)
  {
    id: 'ord-foto-upload-1',
    orderNumber: 'TPZ-FTS-2026-1189',
    deliveryType: 'CARGO',
    tenantId: 's3',
    storeName: 'FotoSentez Stüdyo',
    customerName: 'Mert Aksoy',
    customerPhone: '+90 544 777 33 22',
    customerEmail: 'mert.aksoy@gmail.com',
    customerAddress: 'Moda Cad. Ferah Çıkmazı No: 12 D: 6, Kadıköy',
    city: 'İstanbul',
    district: 'Kadıköy',
    items: [
      {
        productId: 'p-foto-baski-100',
        title: '10x15 Parlak Fotoğraf Baskı (100 Adet)',
        price: 340,
        qty: 1,
        sku: 'FTS-BSK-100',
        customization: {
          uploadedFiles: [
            { name: 'aile_tatil_fotograflari_01.jpg', size: '4.8 MB', previewUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=300' },
            { name: 'mezuniyet_toreni_portre.png', size: '6.2 MB', previewUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300' },
            { name: 'bebek_ilk_yas_albumu.zip', size: '48.5 MB' }
          ]
        }
      }
    ],
    totalAmount: 340,
    paymentMethod: 'PAYTR_POS',
    paymentStatus: 'PAID',
    status: 'PREPARING',
    cargoDetails: {
      carrier: 'Yurtiçi Kargo',
      trackingNumber: 'YK-89102839101',
      barcode: '9810283910129',
      despatchNumber: 'IRS2026000000450'
    },
    invoiceNumber: 'GIB2026000000947',
    createdAt: '2026-09-24 09:15'
  },

  // 4. DAVETİYE & KİŞİYE ÖZEL BASKI FORMU (Metin Kopyalama & Tablo Görünümü)
  {
    id: 'ord-davetiye-form-1',
    orderNumber: 'TPZ-MAT-2026-0490',
    deliveryType: 'CARGO',
    tenantId: 's1',
    storeName: 'Atölye Zanaat & Matbaa',
    customerName: 'Zeynep Kaya',
    customerPhone: '+90 532 999 44 22',
    customerEmail: 'zeynep.kaya@gmail.com',
    customerAddress: 'Levent Mah. Menekşe Sok. No: 9 D: 2, Beşiktaş',
    city: 'İstanbul',
    district: 'Beşiktaş',
    items: [
      {
        productId: 'p-davetiye-geometrik',
        title: 'Özel Tasarım Geometrik Düğün Davetiyesi (100 Adet)',
        price: 1850,
        qty: 1,
        sku: 'DVT-GEO-100',
        customization: {
          customFormValues: [
            { fieldLabel: 'Gelin & Damat Adı', value: 'Zeynep Kaya & Ali Can Demir' },
            { fieldLabel: 'Düğün / Nikah Tarihi & Saati', value: '18 Temmuz 2027 Cumartesi, Saat: 19:30' },
            { fieldLabel: 'Düğün Salonu & Açık Adres', value: 'Boğaziçi Sahil Davet Salonu, Sahil Cad. No: 48 Sarıyer / İstanbul' },
            { fieldLabel: 'Davetiye Sözü / Özel Mesaj', value: 'Birlikte çıkacağımız bu sonsuz yolculuğun ilk gününde sizleri de aramızda görmekten mutluluk duyarız.' },
            { fieldLabel: 'Tasarım Prova Onayı İçin WhatsApp', value: '0532 999 44 22' }
          ]
        }
      }
    ],
    totalAmount: 1850,
    paymentMethod: 'PAYTR_POS',
    paymentStatus: 'PAID',
    status: 'PREPARING',
    cargoDetails: {
      carrier: 'Aras Kargo',
      trackingNumber: 'ARAS-5519201948',
      barcode: '8819201948112',
      despatchNumber: 'IRS2026000000451'
    },
    invoiceNumber: 'GIB2026000000948',
    createdAt: '2026-09-24 08:30'
  },

  // 1. ULUSAL KARGO SİPARİŞİ (TamKargo)
  {
    id: 'ord-cargo-101',
    orderNumber: 'TPZ-TR-2026-8812',
    deliveryType: 'CARGO',
    tenantId: 's1',
    storeName: 'Atölye Zanaat',
    customerName: 'Zeynep Aktaş',
    customerPhone: '+90 532 111 22 33',
    customerEmail: 'zeynep.aktas@gmail.com',
    customerAddress: 'Tunalı Hilmi Cad. No: 42 D: 8, Çankaya',
    city: 'Ankara',
    district: 'Çankaya',
    items: [
      {
        productId: 'p1',
        title: 'Minimalist Deri Oxford Ayakkabı',
        price: 1850,
        qty: 1,
        sku: 'MNT-DER-42',
        variant: '42 Numara / Kahverengi'
      }
    ],
    totalAmount: 1850,
    paymentMethod: 'PAYTR_POS',
    paymentStatus: 'PAID',
    status: 'PREPARING',
    cargoDetails: {
      carrier: 'Yurtiçi Kargo',
      trackingNumber: 'YK-40918290192',
      barcode: '90029182901921',
      despatchNumber: 'IRS2026000000412'
    },
    invoiceNumber: 'GIB2026000000881',
    createdAt: '2026-09-23 13:10'
  },
  {
    id: 'ord-cargo-102',
    orderNumber: 'TPZ-TR-2026-8790',
    deliveryType: 'CARGO',
    tenantId: 's1',
    storeName: 'Atölye Zanaat',
    customerName: 'Mustafa Demir',
    customerPhone: '+90 535 444 88 99',
    customerEmail: 'mdemir@sirket.com',
    customerAddress: 'Alsancak Mah. Atatürk Cad. No: 120, Konak',
    city: 'İzmir',
    district: 'Konak',
    items: [
      {
        productId: 'p2',
        title: 'El Yapımı Masif Meşe Masa',
        price: 4500,
        qty: 1,
        sku: 'MSS-MESE-160',
        variant: '160x80 cm / Doğal Meşe'
      }
    ],
    totalAmount: 4500,
    paymentMethod: 'IYZICO_POS',
    paymentStatus: 'PAID',
    status: 'SHIPPED',
    cargoDetails: {
      carrier: 'Aras Kargo',
      trackingNumber: 'ARAS-7718291029',
      barcode: '8810291029188',
      despatchNumber: 'IRS2026000000410',
      shippedAt: '2026-09-22 16:45'
    },
    invoiceNumber: 'GIB2026000000870',
    createdAt: '2026-09-22 11:20'
  },

  // 2. ANLIK YEREL SİPARİŞ (TamHızlı)
  {
    id: 'ord-local-201',
    orderNumber: 'TPZ-YEREL-2026-0044',
    deliveryType: 'LOCAL_EXPRESS',
    tenantId: 's3',
    storeName: 'Tarihi Taşfırın Pide & Lahmacun',
    customerName: 'Emre Çelik',
    customerPhone: '+90 542 666 77 88',
    customerAddress: 'Düz Mahalle, Süleyman Felek Cad. No: 18 Kat: 3',
    city: 'Ordu',
    district: 'Altınordu',
    coordinates: {
      lat: 40.9850,
      lng: 37.8765
    },
    items: [
      {
        productId: 'p-lahmacun',
        title: 'Çıtır Taşfırın Lahmacun (Yeşillik & Limon)',
        price: 90,
        qty: 3,
        sku: 'LHM-TAS'
      },
      {
        productId: 'p-ayran',
        title: 'Köy Yayık Ayranı (330ml)',
        price: 30,
        qty: 2,
        sku: 'AYR-YAYIK'
      }
    ],
    totalAmount: 330,
    paymentMethod: 'PAYTR_POS',
    paymentStatus: 'PAID',
    status: 'RINGING', // Canlı sipariş zili çalıyor!
    localDeliveryDetails: {
      courierName: 'Kurye Serdar (Motosiklet)',
      courierPhone: '+90 541 333 44 55',
      etaMinutes: 28,
      deliverySubtype: 'COURIER_30MIN',
      preparationStartedAt: '2026-09-23 14:40'
    },
    invoiceNumber: 'GIB2026000000902',
    createdAt: '2026-09-23 14:42'
  },
  {
    id: 'ord-local-202',
    orderNumber: 'TPZ-YEREL-2026-0042',
    deliveryType: 'LOCAL_EXPRESS',
    tenantId: 's3',
    storeName: 'Manav & Şarküteri Pazarı',
    customerName: 'Fatma Hanım',
    customerPhone: '+90 533 888 12 12',
    customerAddress: 'Akyazı Mah. Sahil Cad. Mavi Blok No: 4',
    city: 'Ordu',
    district: 'Altınordu',
    coordinates: {
      lat: 40.9780,
      lng: 37.8920
    },
    items: [
      {
        productId: 'p-peynir',
        title: 'Erzincan Tulum Peyniri (500g)',
        price: 240,
        qty: 1,
        sku: 'TLM-500'
      },
      {
        productId: 'p-zeytin',
        title: 'Gemlik Siyah Sele Zeytin (1kg)',
        price: 210,
        qty: 1,
        sku: 'ZYT-1KG'
      }
    ],
    totalAmount: 450,
    paymentMethod: 'PAY_AT_DOOR',
    paymentStatus: 'PENDING',
    status: 'COURIER_ON_WAY',
    localDeliveryDetails: {
      courierName: 'Kurye Burak (Elektrikli Bisiklet)',
      courierPhone: '+90 545 999 11 22',
      etaMinutes: 12,
      deliverySubtype: 'COURIER_30MIN'
    },
    invoiceNumber: 'GIB2026000000899',
    createdAt: '2026-09-23 14:15'
  },

  // 3. YEREL HİZMET & SAHA SERVİSİ (TamUsta)
  {
    id: 'ord-srv-301',
    orderNumber: 'TPZ-SERVIS-2026-018',
    deliveryType: 'FIELD_SERVICE',
    tenantId: 's3',
    storeName: 'FotoSentez Stüdyo & Teknik Servis',
    customerName: 'Hakan Yılmaz',
    customerPhone: '+90 530 555 66 77',
    customerAddress: 'Bahçelievler Mah. Atatürk Bulvarı No: 88, Altınordu',
    city: 'Ordu',
    district: 'Altınordu',
    coordinates: {
      lat: 40.9835,
      lng: 37.8780
    },
    items: [
      {
        productId: 'p-kacak',
        title: 'Termal Cihazla Kırmadan Su Kaçağı Tespiti + Rapor',
        price: 850,
        qty: 1,
        sku: 'SRV-TERMAL'
      }
    ],
    totalAmount: 850,
    paymentMethod: 'PAYTR_POS',
    paymentStatus: 'PAID',
    status: 'EN_ROUTE', // Usta sahada, yolda!
    serviceDetails: {
      serviceCategory: 'Sıhhi Tesisat & Termal Tespit',
      scheduledTime: 'Hemen Acil Çağrı (30 Dk)',
      issueDescription: 'Banyo tavanından alt kata sarı su damlıyor, acil tespit ve rapor gerekiyor.',
      technicianName: 'Usta Murat & Ekibi',
      technicianPhone: '+90 544 222 33 44',
      quotationAmount: 850,
      isEmergency: true,
      vehiclePlate: '52 AT 910'
    },
    invoiceNumber: 'GIB2026000000905',
    createdAt: '2026-09-23 14:25'
  },
  {
    id: 'ord-srv-302',
    orderNumber: 'TPZ-SERVIS-2026-015',
    deliveryType: 'FIELD_SERVICE',
    tenantId: 's3',
    storeName: 'Karadeniz 7/24 Oto Kurtarma & Çekici',
    customerName: 'Canberk Öz',
    customerPhone: '+90 538 999 44 33',
    customerAddress: 'Ordu-Giresun Sahil Yolu, Turnasuyu Köprüsü Yanı',
    city: 'Ordu',
    district: 'Gülyalı',
    coordinates: {
      lat: 40.9620,
      lng: 37.9540
    },
    items: [
      {
        productId: 'p-cekici',
        title: 'Acil Kayan Kasa Oto Çekici Hizmeti (0-15 Km)',
        price: 1200,
        qty: 1,
        sku: 'SRV-CEKICI'
      }
    ],
    totalAmount: 1200,
    paymentMethod: 'CASH_ON_DELIVERY',
    paymentStatus: 'PENDING',
    status: 'COMPLETED',
    serviceDetails: {
      serviceCategory: 'Oto Kurtarma & Çekici',
      scheduledTime: 'Tamamlandı (22 Eylül)',
      issueDescription: 'Aracın aküsü bitti ve şanzıman kilitlendi, sanayiye çekildi.',
      technicianName: 'Kaptan Şaban',
      technicianPhone: '+90 532 777 88 99',
      quotationAmount: 1200,
      isEmergency: true,
      vehiclePlate: '52 AB 520'
    },
    invoiceNumber: 'GIB2026000000889',
    createdAt: '2026-09-22 18:30'
  },

  // 4. DİJİTAL DOSYA İNDİRME SİPARİŞİ (TamDijital)
  {
    id: 'ord-dig-401',
    orderNumber: 'TPZ-DIG-2026-9041',
    deliveryType: 'DIGITAL_DOWNLOAD',
    tenantId: 's1',
    storeName: 'Atölye Zanaat',
    customerName: 'Gülşen Tekstil',
    customerPhone: '+90 532 999 11 22',
    customerEmail: 'gulsen@tekstil.com',
    customerAddress: 'Dijital Teslimat (E-Posta & Anında İndirme)',
    city: 'Bursa',
    district: 'Yıldırım',
    items: [
      {
        productId: 'dig-prod-101',
        title: 'Geleneksel Maraş İşi Çiçekli Nakış Deseni Paketi',
        price: 380,
        qty: 1,
        sku: 'DIG-NKS-01'
      }
    ],
    totalAmount: 380,
    paymentMethod: 'PAYTR_POS',
    paymentStatus: 'PAID',
    status: 'DOWNLOAD_READY',
    digitalDetails: {
      fileUrl: '#download-maras-nakis-v2',
      fileName: 'Maras_Isi_Nakis_Paketi_v2.1.zip',
      fileSize: '14.8 MB',
      formatTags: ['DST', 'PES', 'JEF', 'EXP', 'PDF Kılavuz'],
      licenseType: 'commercial',
      downloadCount: 3
    },
    invoiceNumber: 'GIB2026000000910',
    createdAt: '2026-09-24 10:15'
  },

  // 5. UZAKTAN CANLI SEANS SİPARİŞİ (TamSeans)
  {
    id: 'ord-sns-501',
    orderNumber: 'TPZ-SNS-2026-4011',
    deliveryType: 'ONLINE_SESSION',
    tenantId: 's3',
    storeName: 'FotoSentez Stüdyo & Danışmanlık',
    customerName: 'Alperen Yılmaz',
    customerPhone: '+90 532 999 88 77',
    customerEmail: 'alperen@gmail.com',
    customerAddress: 'Online Video Görüşmesi (Google Meet)',
    city: 'İstanbul',
    district: 'Kadıköy',
    items: [
      {
        productId: 'sns-prod-201',
        title: 'Bireysel Kariyer & E-Ticaret İşletme Danışmanlığı (45 Dk)',
        price: 1250,
        qty: 1,
        sku: 'SNS-DAN-01'
      }
    ],
    totalAmount: 1250,
    paymentMethod: 'PAYTR_POS',
    paymentStatus: 'PAID',
    status: 'SCHEDULED',
    sessionDetails: {
      scheduledDate: 'Bugün (24 Eylül 2026)',
      timeSlot: '15:00 - 15:45',
      durationMin: 45,
      channel: 'google_meet',
      meetingLink: 'https://meet.google.com/tpz-danisman-alperen',
      expertTitle: 'Kıdemli E-Ticaret Danışmanı',
      notes: 'Yeni e-ticaret markası ürün lansmanı ve TamPazar mağaza kurulumu stratejisi.'
    },
    invoiceNumber: 'GIB2026000000911',
    createdAt: '2026-09-24 09:30'
  }
];

// ==========================================
// 4. MASAÜSTÜ CANLI SİPARİŞ ZİLİ (AUDIO SYNTHESIZER)
// ==========================================

export function playOrderAlertChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    // First Tone (High Bell)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    osc1.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.15);
    gain1.gain.setValueAtTime(0.3, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.5);

    // Second Tone (Melodic Chime)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1320, ctx.currentTime + 0.15); // E6 note
    gain2.gain.setValueAtTime(0.35, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.7);

    // Third Tone (Deep Confirmation Chime)
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.35); // C6 note
    gain3.gain.setValueAtTime(0.4, ctx.currentTime + 0.35);
    gain3.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.95);
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.start(ctx.currentTime + 0.35);
    osc3.stop(ctx.currentTime + 0.95);

  } catch (err) {
    console.warn('Web Audio chime not supported or blocked by user gesture policy:', err);
  }
}

// ==========================================
// 5. WHATSAPP SİPARİŞ FİŞİ SİMÜLATÖRÜ & DOĞRUDAN İLETİŞİM
// ==========================================

export function formatPaymentMethodText(method: DirectPaymentMethod): string {
  switch (method) {
    case 'CASH_ON_DELIVERY':
      return '💵 Kapıda Nakit Ödeme (Doğrudan Esnafa/Kuryeye)';
    case 'DOOR_CARD_POS':
      return '💳 Kapıda Kredi Kartı (Esnafın Mobil POS Cihazı)';
    case 'DIRECT_IBAN_TRANSFER':
      return '🏦 Esnaf Hesabına Doğrudan IBAN / FAST ile Havale';
    case 'DIRECT_MERCHANT_GATEWAY':
    case 'PAYTR_POS':
    case 'IYZICO_POS':
      return '⚡ Esnafın Kendi Sanal POS\'u (Komisyonsuz Doğrudan Tahsilat)';
    default:
      return '💵 Kapıda Doğrudan Esnafa Ödeme';
  }
}

export function generateWhatsAppReceiptText(order: HybridOrder): string {
  const itemsText = order.items.map(it => {
    let detail = `- ${it.qty}x ${it.title} (₺${(it.price * it.qty).toLocaleString('tr-TR')})`;
    if (it.variant) detail += ` [Varyant: ${it.variant}]`;
    if (it.customization?.removedIngredients?.length) {
      detail += ` (Çıkarılan: ${it.customization.removedIngredients.join(', ')})`;
    }
    if (it.customization?.addedIngredients?.length) {
      detail += ` (+Ekstralar: ${it.customization.addedIngredients.map(a => a.name).join(', ')})`;
    }
    return detail;
  }).join('\n');

  let breakdownText = '';
  if (order.isMultiStoreOrder && order.multiStoreBreakdown) {
    breakdownText = `\n\n🏪 *Dükkan Dağılımı (Çoklu Mahalle Sepeti):*\n` +
      order.multiStoreBreakdown.map(b => `• ${b.storeName} (${b.category}): ₺${b.amount} [${b.items.join(', ')}]`).join('\n') +
      (order.sharedCourierFee ? `\n🛵 Ortak Mahalle Kuryesi: ₺${order.sharedCourierFee}` : '');
  }

  let askidaText = '';
  if (order.suspendedContribution) {
    askidaText = `\n🥖 *Askıda Dayanışma:* ${order.suspendedContribution.count}x ${order.suspendedContribution.typeName} (+₺${order.suspendedContribution.totalAmount})`;
  }

  const receipt = `🧾 *TAMPAZAR SİPARİŞ BİLGİ & DOĞRUDAN MUTABAKAT FİŞİ*
━━━━━━━━━━━━━━━━━━━━
📌 *Sipariş No:* #${order.orderNumber}
📅 *Tarih:* ${order.createdAt}
🏪 *Esnaf / Mağaza:* ${order.storeName}

👤 *Müşteri Bilgileri:*
• *Ad Soyad:* ${order.customerName}
• *Telefon:* ${order.customerPhone}
• *Teslimat Adresi:* ${order.customerAddress}, ${order.district}/${order.city}

🛒 *Sipariş Kalemleri:*
${itemsText}${askidaText}${breakdownText}

━━━━━━━━━━━━━━━━━━━━
💰 *Doğrudan Tahsil Edilecek Tutar:* ₺${order.totalAmount.toLocaleString('tr-TR')}
💳 *Ödeme Yöntemi:* ${formatPaymentMethodText(order.paymentMethod)}
🛡️ *TamPazar Komisyonu:* %0,00 (Tüm tutar doğrudan esnafın kasasına gider)`;

  return receipt;
}

export function generateWhatsAppOrderUrl(phone: string, order: HybridOrder): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('90') ? cleanPhone : `90${cleanPhone.replace(/^0/, '')}`;
  const receipt = generateWhatsAppReceiptText(order);
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(receipt)}`;
}

// ==========================================
// 6. ASKIDA MAHALLE & DAYANIŞMA SİSTEMİ VERİ DEPOSU
// ==========================================

const INITIAL_SUSPENDED_ITEMS: SuspendedItemRecord[] = [
  {
    id: 'susp-1',
    storeId: 'firin-karadeniz',
    storeName: 'Tarihi Karadeniz Taş Ekmek Fırını',
    type: 'BREAD',
    typeName: 'Askıda Sıcak Köy Ekmeği',
    unitPrice: 15,
    count: 14,
    deliveredCount: 42,
    donorName: 'Mahalle Sakinleri',
    createdAt: '2026-09-20',
    updatedAt: '2026-09-24'
  },
  {
    id: 'susp-2',
    storeId: 'lokanta-lezzet',
    storeName: 'Yöresel Lezzet Sofrası',
    type: 'SOUP',
    typeName: 'Askıda Sıcak Çorba Menüsü',
    unitPrice: 60,
    count: 8,
    deliveredCount: 26,
    donorName: 'Mahalle Sakinleri',
    createdAt: '2026-09-21',
    updatedAt: '2026-09-24'
  },
  {
    id: 'susp-3',
    storeId: 'pide-salon',
    storeName: 'Kıymalı & Kaşarlı Pide Fırını',
    type: 'PIDE',
    typeName: 'Askıda Açık Kıymalı Pide',
    unitPrice: 45,
    count: 6,
    deliveredCount: 19,
    donorName: 'Cömert Mahalleli',
    createdAt: '2026-09-22',
    updatedAt: '2026-09-24'
  }
];

export function getStoredSuspendedItems(): SuspendedItemRecord[] {
  try {
    const saved = localStorage.getItem('tampazar_suspended_items');
    if (saved) return JSON.parse(saved);
  } catch {}
  return INITIAL_SUSPENDED_ITEMS;
}

export function saveSuspendedItems(items: SuspendedItemRecord[]) {
  localStorage.setItem('tampazar_suspended_items', JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('tampazar_suspended_updated'));
}

export function deliverSuspendedItem(id: string): boolean {
  const current = getStoredSuspendedItems();
  const index = current.findIndex(i => i.id === id);
  if (index !== -1 && current[index].count > 0) {
    current[index].count -= 1;
    current[index].deliveredCount += 1;
    current[index].updatedAt = new Date().toISOString().slice(0, 10);
    saveSuspendedItems(current);
    return true;
  }
  return false;
}

export function addSuspendedItemDonation(record: Omit<SuspendedItemRecord, 'id' | 'deliveredCount' | 'createdAt' | 'updatedAt'>) {
  const current = getStoredSuspendedItems();
  const existingIndex = current.findIndex(i => i.storeId === record.storeId && i.type === record.type);
  if (existingIndex !== -1) {
    current[existingIndex].count += record.count;
    current[existingIndex].updatedAt = new Date().toISOString().slice(0, 10);
  } else {
    current.push({
      ...record,
      id: `susp-${Date.now()}`,
      deliveredCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10)
    });
  }
  saveSuspendedItems(current);
}

// ==========================================
// 7. TAMUSTA DİJİTAL İŞ PROTOKOLÜ & DOĞRULAMA MOTORU
// ==========================================

const INITIAL_DIGITAL_PROTOCOLS: DigitalServiceProtocol[] = [
  {
    id: 'proto-101',
    protocolNumber: 'PRT-2026-8801',
    quoteId: 'quote-101',
    requestId: 'req-1',
    serviceTitle: 'Banyo Zemin Kırmadan Termal Kameralı Kaçak Tespiti & Tamir',
    customerName: 'Cemre Demir',
    customerPhone: '0532 444 55 66',
    customerAddress: 'Bahçelievler Mah. 102. Sok. No: 12 D: 4, Altınordu / Ordu',
    merchantName: 'Kuzey Teknik Su Tesisatı (Mehmet Usta)',
    merchantPhone: '0532 111 22 33',
    merchantIban: 'TR44 0006 2000 1234 5678 9012 34',
    agreedPrice: 1200,
    agreedDuration: '45-60 Dakika',
    jobScopeDescription: 'Kırmadan termal cihaz ile kaçak noktasının tespiti, 1 noktada boru lehim onarımı ve sızdırmazlık test raporu teslimi.',
    directPaymentMethod: 'NAKIT',
    status: 'COMPLETED_VERIFIED',
    verifiedAt: '24 Eylül 2026 11:45',
    ratingGiven: 5,
    reputationPointsAwarded: 10,
    tamPazarCertifiedBadge: true,
    createdAt: '2026-09-24 10:00'
  }
];

export function getStoredDigitalProtocols(): DigitalServiceProtocol[] {
  try {
    const saved = localStorage.getItem('tampazar_digital_protocols');
    if (saved) return JSON.parse(saved);
  } catch {}
  return INITIAL_DIGITAL_PROTOCOLS;
}

export function saveDigitalProtocol(protocol: DigitalServiceProtocol) {
  const current = getStoredDigitalProtocols();
  const existingIdx = current.findIndex(p => p.id === protocol.id);
  if (existingIdx !== -1) {
    current[existingIdx] = protocol;
  } else {
    current.unshift(protocol);
  }
  localStorage.setItem('tampazar_digital_protocols', JSON.stringify(current));
  window.dispatchEvent(new CustomEvent('tampazar_protocols_updated'));
}

export function confirmServiceProtocolCompletion(protocolId: string, rating: number = 5): DigitalServiceProtocol | null {
  const current = getStoredDigitalProtocols();
  const target = current.find(p => p.id === protocolId);
  if (target) {
    target.status = 'COMPLETED_VERIFIED';
    target.verifiedAt = new Date().toLocaleString('tr-TR');
    target.ratingGiven = rating;
    target.reputationPointsAwarded = 10;
    target.tamPazarCertifiedBadge = true;
    localStorage.setItem('tampazar_digital_protocols', JSON.stringify(current));
    window.dispatchEvent(new CustomEvent('tampazar_protocols_updated'));
    return target;
  }
  return null;
}

