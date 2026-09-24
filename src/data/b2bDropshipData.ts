/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface B2BTieredPrice {
  minQty: number;
  maxQty?: number | null;
  price: number;
}

export interface B2BWholesaleOrder {
  id: string;
  orderNo: string;
  buyerTenantId: string;
  buyerStoreName: string;
  buyerTaxNo?: string;
  buyerContact: string;
  buyerCity: string;
  sellerTenantId: string;
  sellerStoreName: string;
  productId: string;
  productTitle: string;
  productImage: string;
  unitType: 'adet' | 'seri' | 'koli' | 'cuval' | 'paket';
  quantity: number; // örn: 5 koli
  totalUnitsCount: number; // örn: 40 çift
  unitPrice: number;
  totalAmount: number;
  paymentTerms: 'CARI_HESAP_30_GUN' | 'PESIN_HAVALE' | 'KREDI_KARTI_POS';
  status: 'TEKLIF_BEKLIYOR' | 'ONAYLANDI' | 'SEVKIYATTA' | 'TESLIM_EDILDI';
  orderDate: string;
  despatchNo?: string;
  carrierCompany?: string;
  trackingNo?: string;
}

export interface DropshipOrder {
  id: string;
  orderNo: string;
  consumerName: string;
  consumerAddress: string;
  consumerCity: string;
  consumerPhone: string;
  retailerTenantId: string;
  retailerStoreName: string; // Perakendeci mağaza adı (Paket üstüne kargo etiketi olarak basılacak)
  retailerBrandLogo?: string;
  wholesalerTenantId: string;
  wholesalerStoreName: string; // Gerçekte kargoyu çıkaran üretici/toptancı
  productId: string;
  productTitle: string;
  productImage: string;
  quantity: number;
  wholesalePrice: number; // Toptancının tahsil ettiği tutar (örn: 280 TL)
  retailPrice: number;    // Perakendecinin müşteriye sattığı tutar (örn: 650 TL)
  retailerProfit: number; // Perakendecinin cebine kalan net kâr (örn: 370 TL)
  status: 'YENI_SIPARIS' | 'HAZIRLANIYOR' | 'KARGODA' | 'TESLIM_EDILDI';
  carrier: string;
  trackingNumber: string;
  orderDate: string;
  whiteLabelCode: string; // WL-78902-TR
}

export interface DropshippedProductMapping {
  id: string;
  originalProductId: string;
  originalWholesalerId: string;
  originalWholesalerName: string;
  retailerTenantId: string;
  retailerStoreName: string;
  productTitle: string;
  productImage: string;
  wholesaleCost: number;
  myRetailPrice: number;
  myProfitMarginTL: number;
  myProfitMarginPercent: number;
  status: 'AKTIF' | 'DURDURULDU';
  salesCount: number;
  addedAt: string;
}

export const initialB2BWholesaleOrders: B2BWholesaleOrder[] = [
  {
    id: 'b2b-ord-101',
    orderNo: 'B2B-2026-8841',
    buyerTenantId: 'tenant-1',
    buyerStoreName: 'Mert Kundura & Deri Butik',
    buyerTaxNo: '3489102911',
    buyerContact: 'Mert Yılmaz (0532 411 22 33)',
    buyerCity: 'İzmir / Alsancak',
    sellerTenantId: 's1',
    sellerStoreName: 'Gedikpaşa Zanaat Ayakkabı Toptan İmalat',
    productId: 'prod-b2b-02',
    productTitle: 'Toptan 1 Koli (8 Çift) Hakiki Dana Derisi El İşçiliği Oxford Erkek Ayakkabı (40-44 Asorti)',
    productImage: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=800',
    unitType: 'koli',
    quantity: 4,
    totalUnitsCount: 32,
    unitPrice: 6000,
    totalAmount: 24000,
    paymentTerms: 'CARI_HESAP_30_GUN',
    status: 'SEVKIYATTA',
    orderDate: '2026-03-22 14:30',
    despatchNo: 'IRS-2026-90214',
    carrierCompany: 'Yurtiçi Kargo Palet Taşıma',
    trackingNo: 'YK-PLT-883910'
  },
  {
    id: 'b2b-ord-102',
    orderNo: 'B2B-2026-8850',
    buyerTenantId: 'tenant-3',
    buyerStoreName: 'Moda Pera Butik & Giyim',
    buyerTaxNo: '8821039912',
    buyerContact: 'Zeynep Kaya (0542 999 88 77)',
    buyerCity: 'İstanbul / Beyoğlu',
    sellerTenantId: 's2',
    sellerStoreName: 'Merter Toptan Tekstil & Konfeksiyon San.',
    productId: 'prod-b2b-01',
    productTitle: 'Toptan 1 Seri (6 Adet) Oversize 3 İplik Şardonlu Sweatshirt Paketi (S-M-L-XL Asorti)',
    productImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
    unitType: 'seri',
    quantity: 10,
    totalUnitsCount: 60,
    unitPrice: 1680,
    totalAmount: 16800,
    paymentTerms: 'PESIN_HAVALE',
    status: 'ONAYLANDI',
    orderDate: '2026-03-23 09:15',
    despatchNo: 'IRS-2026-90288'
  },
  {
    id: 'b2b-ord-103',
    orderNo: 'B2B-2026-8859',
    buyerTenantId: 'tenant-2',
    buyerStoreName: 'Mahalle Çarşı Gurme Manav',
    buyerTaxNo: '4991028301',
    buyerContact: 'Ali Usta (0555 123 45 67)',
    buyerCity: 'Ankara / Çankaya',
    sellerTenantId: 's3',
    sellerStoreName: 'Ordu/Giresun Fındık Çiftliği Kooperatifi',
    productId: 'prod-b2b-03',
    productTitle: 'Toptan 1 Çuval (50 KG) Vakumlu Çifte Kavrulmuş Giresun Kalite Fındık İçi',
    productImage: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=800',
    unitType: 'cuval',
    quantity: 2,
    totalUnitsCount: 100,
    unitPrice: 16000,
    totalAmount: 32000,
    paymentTerms: 'CARI_HESAP_30_GUN',
    status: 'TEKLIF_BEKLIYOR',
    orderDate: '2026-03-24 11:20'
  }
];

export const initialDropshipOrders: DropshipOrder[] = [
  {
    id: 'ds-ord-201',
    orderNo: 'DSP-2026-5501',
    consumerName: 'Emre Karaca',
    consumerAddress: 'Fenerbahçe Mah. Lale Sok. No:18 D:4',
    consumerCity: 'İstanbul / Kadıköy',
    consumerPhone: '0535 888 12 34',
    retailerTenantId: 'tenant-1',
    retailerStoreName: 'Mert Kundura & Deri Butik', // Gönderici etiketinde görünecek mağaza
    wholesalerTenantId: 's1',
    wholesalerStoreName: 'Gedikpaşa Zanaat Ayakkabı Toptan İmalat',
    productId: 'prod-b2b-02',
    productTitle: 'Hakiki Dana Derisi El İşçiliği Oxford Erkek Ayakkabı (No: 42)',
    productImage: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=800',
    quantity: 1,
    wholesalePrice: 750,
    retailPrice: 1650,
    retailerProfit: 900,
    status: 'HAZIRLANIYOR',
    carrier: 'Aras Kargo (Beyaz Etiket Dropshipping)',
    trackingNumber: 'ARK-DSP-7740192',
    orderDate: '2026-03-24 09:40',
    whiteLabelCode: 'WL-MERT-042'
  },
  {
    id: 'ds-ord-202',
    orderNo: 'DSP-2026-5502',
    consumerName: 'Ayşe Nur Çelik',
    consumerAddress: 'Çayyolu Mah. Park Cad. No:12 Villa 2',
    consumerCity: 'Ankara / Çankaya',
    consumerPhone: '0544 333 99 11',
    retailerTenantId: 'tenant-3',
    retailerStoreName: 'Moda Pera Butik',
    wholesalerTenantId: 's2',
    wholesalerStoreName: 'Merter Toptan Tekstil & Konfeksiyon San.',
    productId: 'prod-b2b-01',
    productTitle: 'Oversize 3 İplik Şardonlu Sweatshirt (Beden: L, Antrasit)',
    productImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
    quantity: 2,
    wholesalePrice: 560,
    retailPrice: 1300,
    retailerProfit: 740,
    status: 'KARGODA',
    carrier: 'MNG Kargo (Dropship Paketi)',
    trackingNumber: 'MNG-DSP-991204',
    orderDate: '2026-03-23 16:15',
    whiteLabelCode: 'WL-PERA-099'
  }
];

export const initialDropshippedProducts: DropshippedProductMapping[] = [
  {
    id: 'dsp-map-01',
    originalProductId: 'prod-b2b-01',
    originalWholesalerId: 's2',
    originalWholesalerName: 'Merter Toptan Tekstil & Konfeksiyon San.',
    retailerTenantId: 's3',
    retailerStoreName: 'FotoSentez Butik',
    productTitle: 'Oversize 3 İplik Şardonlu Sweatshirt (Güngören İmalatı)',
    productImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
    wholesaleCost: 280,
    myRetailPrice: 650,
    myProfitMarginTL: 370,
    myProfitMarginPercent: 132,
    status: 'AKTIF',
    salesCount: 14,
    addedAt: '2026-03-20'
  },
  {
    id: 'dsp-map-02',
    originalProductId: 'prod-b2b-02',
    originalWholesalerId: 's1',
    originalWholesalerName: 'Gedikpaşa Zanaat Ayakkabı Toptan İmalat',
    retailerTenantId: 's3',
    retailerStoreName: 'FotoSentez Butik',
    productTitle: 'Hakiki Dana Derisi El İşçiliği Oxford Erkek Ayakkabı',
    productImage: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=800',
    wholesaleCost: 750,
    myRetailPrice: 1650,
    myProfitMarginTL: 900,
    myProfitMarginPercent: 120,
    status: 'AKTIF',
    salesCount: 8,
    addedAt: '2026-03-21'
  }
];

// LocalStorage Helpers
export function getStoredB2BOrders(): B2BWholesaleOrder[] {
  try {
    const saved = localStorage.getItem('tampazar_b2b_wholesale_orders');
    return saved ? JSON.parse(saved) : initialB2BWholesaleOrders;
  } catch {
    return initialB2BWholesaleOrders;
  }
}

export function saveStoredB2BOrders(orders: B2BWholesaleOrder[]): void {
  try {
    localStorage.setItem('tampazar_b2b_wholesale_orders', JSON.stringify(orders));
  } catch (e) {}
}

export function getStoredDropshipOrders(): DropshipOrder[] {
  try {
    const saved = localStorage.getItem('tampazar_dropship_orders');
    return saved ? JSON.parse(saved) : initialDropshipOrders;
  } catch {
    return initialDropshipOrders;
  }
}

export function saveStoredDropshipOrders(orders: DropshipOrder[]): void {
  try {
    localStorage.setItem('tampazar_dropship_orders', JSON.stringify(orders));
  } catch (e) {}
}

export function getStoredDropshippedProducts(): DropshippedProductMapping[] {
  try {
    const saved = localStorage.getItem('tampazar_dropshipped_products');
    return saved ? JSON.parse(saved) : initialDropshippedProducts;
  } catch {
    return initialDropshippedProducts;
  }
}

export function saveStoredDropshippedProducts(mappings: DropshippedProductMapping[]): void {
  try {
    localStorage.setItem('tampazar_dropshipped_products', JSON.stringify(mappings));
  } catch (e) {}
}
