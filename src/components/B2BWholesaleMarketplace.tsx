/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  Layers, Package, Truck, ShieldCheck, Store, Lock, Unlock,
  Search, Filter, CheckCircle2, ArrowRight, Plus, Minus,
  Building2, DollarSign, Sparkles, AlertCircle, ShoppingBag,
  ExternalLink, ChevronDown, Check, Tag, Eye, Info, X,
  FileText, Box, BarChart3, Scale, Clock, Award, Phone,
  MessageSquare, Share2, Copy, CheckCheck, MapPin, BadgePercent,
  CheckCircle, HelpCircle, Layers2, FileCheck2, Boxes, Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Product, initialProducts } from '../data/mockData';
import { 
  B2BWholesaleOrder, DropshippedProductMapping,
  getStoredB2BOrders, saveStoredB2BOrders,
  getStoredDropshippedProducts, saveStoredDropshippedProducts
} from '../data/b2bDropshipData';
import { applyPageSEO } from '../utils/seo';
import { getProductSocialProof } from '../utils/socialProof';

// B2B Zengin Teknik ve Lojistik Özellik Veri Arayüzü
export interface B2BSpecs {
  rawMaterial: string;
  usageAreas: string[];
  storageConditions: string;
  origin: string;
  standards: string[];
  netWeight: string;
  grossWeight: string;
  boxContents: string;
  boxDimensions: string;
  desi: number;
  palletCapacity: string;
  tieredBreakdown: {
    tier1: { label: string; range: string; price: number; discount: string; tag: string };
    tier2: { label: string; range: string; price: number; discount: string; tag: string };
    tier3: { label: string; range: string; price: number; discount: string; tag: string };
  };
  logistics: {
    eInvoice: string;
    carriers: string[];
    dispatchTime: string;
    warranty: string;
    withholdingVat: string;
  };
}

// Ürüne özel detaylı teknik & lojistik bilgisi üreten yardımcı
function getB2BProductSpecs(product: Product): B2BSpecs {
  const unitType = product.b2bUnitType || 'seri';
  const basePrice = product.b2bWholesalePrice || product.price;
  const isTekstil = product.categorySlug === 'toptan-tekstil' || product.category.toLowerCase().includes('tekstil') || product.category.toLowerCase().includes('giyim');
  const isAyakkabi = product.categorySlug === 'toptan-ayakkabi' || product.category.toLowerCase().includes('ayakkab') || product.category.toLowerCase().includes('kundura');
  const isGida = product.categorySlug === 'toptan-gida' || product.category.toLowerCase().includes('gıda') || product.category.toLowerCase().includes('tarım') || product.category.toLowerCase().includes('fındık');

  // Tiered Pricing Calculations
  const t1Price = basePrice;
  const t2Price = Math.round(basePrice * 0.9); // %10 İndirim
  const t3Price = Math.round(basePrice * 0.79); // %21 Özel İskonto

  if (isTekstil) {
    return {
      rawMaterial: '%100 Ege Pamuğu 3 İplik Kompakt Penye (320 gr/m²), içi ekstra yumuşak şardonlu polar. Yıkama sonrası tüylenme yapmaz, sanforize çekmezlik işlemlidir.',
      usageAreas: [
        'Butik ve Perakende Giyim Mağazaları',
        'Pazaryeri & E-Ticaret Satıcıları (Dropshipping)',
        'Kurumsal Personel Kıyafetleri & Promosyon',
        'Baskı, Serigrafi ve Nakış Atölyeleri'
      ],
      storageConditions: 'Kuru, havadar ve nemsiz ortamda, kapalı şeffaf polietilen ambalajında muhafaza ediniz. Direkt güneş ışığından koruyunuz.',
      origin: 'İstanbul / Merter - Güngören Tekstil İhtisas Sanayi Bölgesi',
      standards: [
        'OEKO-TEX® Standard 100 Eko-Tekstil Sertifikası',
        'ISO 9001:2015 Kalite Yönetim Standardı',
        '%100 Yerli Üretim Lisansı',
        'Sanforize Çekmezlik & Renk Haslığı Test Onaylı'
      ],
      netWeight: '3.60 kg / Seri',
      grossWeight: '3.95 kg (Korumalı İhracat Kolisi)',
      boxContents: '1 Seride 6 Adet Asorti (1x S, 2x M, 2x L, 1x XL) - Her ürün ayrı jelatinli ve barkodlu',
      boxDimensions: '45 x 35 x 25 cm',
      desi: 13,
      palletCapacity: '1 Euro Palet (80x120 cm) = 36 Koli / 216 Seri (Toplam 1.296 Adet Ürün)',
      tieredBreakdown: {
        tier1: { label: '1 - 4 Seri', range: '1 - 4 Seri', price: t1Price, discount: 'Liste Fiyatı', tag: 'Başlangıç' },
        tier2: { label: '5 - 19 Seri', range: '5 - 19 Seri', price: t2Price, discount: '%10 İndirim', tag: 'Popüler Alım' },
        tier3: { label: '20+ Palet/Seri', range: '20+ Seri (Palet)', price: t3Price, discount: '%21 Toptan İskonto', tag: 'Maksimum Kâr' }
      },
      logistics: {
        eInvoice: 'Gelir İdaresi Başkanlığı (GİB) UBL-TR 2.1 mevzuatına uygun karekodlu e-İrsaliye ile sevk.',
        carriers: ['Yurtiçi Kargo Palet & Koli', 'MNG Ambar Sevk', 'Zeytinburnu & İkitelli Toptancılar Ambarı', 'Borusan Lojistik'],
        dispatchTime: 'Aynı Gün (15:00\'e kadar) veya En Geç 24 Saat İçinde Sevk',
        warranty: '%100 İmalatçı Garantisi · Hatalı Koli & Defolu Üründe Anında Birebir Telafi',
        withholdingVat: 'Kurumsal mükellefler için 5/10 veya 9/10 KDV Tevkifatı uygulanabilir.'
      }
    };
  }

  if (isAyakkabi) {
    return {
      rawMaterial: '%100 Hakiki Vidala Dana Derisi, meşin deri iç astar, termo & kösele kompozit taban, ortopedik lateks iç tabanlık.',
      usageAreas: [
        'Ayakkabı & Kundura Perakende Mağazaları',
        'Klasik & Damatlık Giyim Butikleri',
        'Kurumsal Şirket Filoları & Yönetici Tedariği',
        'E-Ticaret & Pazaryeri Dükkanları'
      ],
      storageConditions: 'Kendi özel havalandırmalı ayakkabı kutusunda, rutubetsiz ve oda sıcaklığında saklayınız.',
      origin: 'İstanbul / Gedikpaşa Tarihi Kundura İmalathaneleri & İzmir Işıkkent',
      standards: [
        'TSE Hakiki Deri Standart Onayı (TS EN ISO 20344)',
        'Geleneksel El Zanaatkarı İmalat Sertifikası',
        'Azo Boyar Madde İçermez (Akredite Laboratuvar Onaylı)',
        '%100 Yerli Usta İmalatı'
      ],
      netWeight: '7.40 kg / Koli',
      grossWeight: '8.80 kg (Çift Oluklu Master Koli)',
      boxContents: '1 Kolide 8 Çift Asorti (1x 40, 2x 41, 3x 42, 1x 43, 1x 44 Numara) - Bireysel kutulu ve toz torbalı',
      boxDimensions: '65 x 45 x 35 cm',
      desi: 34,
      palletCapacity: '1 Euro Palet (80x120 cm) = 18 Master Koli (Toplam 144 Çift Ayakkabı)',
      tieredBreakdown: {
        tier1: { label: '1 - 4 Koli', range: '1 - 4 Koli', price: t1Price, discount: 'Liste Fiyatı', tag: 'Başlangıç' },
        tier2: { label: '5 - 19 Koli', range: '5 - 19 Koli', price: t2Price, discount: '%10 İndirim', tag: 'Esnaf Tercihi' },
        tier3: { label: '20+ Palet/Koli', range: '20+ Koli (Palet)', price: t3Price, discount: '%21 Özel İskonto', tag: 'Büyük İmalat Fiyatı' }
      },
      logistics: {
        eInvoice: 'GİB UBL-TR 2.1 e-İrsaliye ve e-Fatura entegrasyonu ile resmi sevk.',
        carriers: ['Aras Kargo Koli Sevk', 'Yurtiçi Kargo Palet', 'Gedikpaşa & İkitelli Şehirlerarası Ambar Ağı'],
        dispatchTime: '24-48 Saat İçinde Master Koli Sevk',
        warranty: 'Hakiki Deri ve Dikiş İmalat Hatalarına Karşı 1 Yıl Garanti',
        withholdingVat: 'Kurumsal alımlarda Tevkifatlı Fatura seçeneği mevcuttur.'
      }
    };
  }

  if (isGida) {
    return {
      rawMaterial: '1. Sınıf Doğu Karadeniz Tombul Fındık İçi (13-15 mm kalibre), odun ateşinde çifte kavrulmuş, max %1.5 nem.',
      usageAreas: [
        'Pastane, Fırın ve Unlu Mamul İmalathaneleri',
        'Çikolata, Dondurma ve Tatlı Üreticileri',
        'Kuruyemiş & Yöresel Şarküteri Perakendecileri',
        'HORECA (Otel, Restoran, Kafe Zincirleri)'
      ],
      storageConditions: 'Serin, kuru ve kokusuz depolarda (10-15°C) muhafaza ediniz. Açılmamış vakumlu ambalajında 18 ay tazelik garantisi.',
      origin: 'Ordu & Giresun / Doğu Karadeniz Çiftçi Kooperatifi Tesisleri',
      standards: [
        'ISO 22000 Gıda Güvenliği Yönetim Sistemi',
        'HACCP Hijyen & Üretim Belgesi',
        'Helal Gıda Akreditasyonu',
        'T.C. Tarım ve Orman Bakanlığı Üretim İzni'
      ],
      netWeight: '50.00 kg Net',
      grossWeight: '50.60 kg (Gıda Uyumlu Koruyucu Jüt Çuval)',
      boxContents: '1 Çuval içerisinde 10 adet 5 KG\'lık bariyerli koruyucu vakumlu alüminyum paket',
      boxDimensions: '90 x 60 x 30 cm',
      desi: 54,
      palletCapacity: '1 Standart Ahşap Palet (100x120 cm) = 15 Çuval (Toplam 750 KG Net Fındık İçi)',
      tieredBreakdown: {
        tier1: { label: '1 - 4 Çuval', range: '1 - 4 Çuval', price: t1Price, discount: 'Liste Fiyatı', tag: 'Perakendeci' },
        tier2: { label: '5 - 19 Çuval', range: '5 - 19 Çuval', price: t2Price, discount: '%10 İndirim', tag: 'Orta Ölçek' },
        tier3: { label: '20+ Palet/Çuval', range: '20+ Çuval (Palet)', price: t3Price, discount: '%21 Toptan İskonto', tag: 'Fabrika & İmalat' }
      },
      logistics: {
        eInvoice: 'GİB UBL-TR 2.1 e-İrsaliye ile gıda sevkiyat izni.',
        carriers: ['MNG Kargo Ambar Sevk', 'Borusan Lojistik Palet', 'Karadeniz Ambarlar Kooperatifi'],
        dispatchTime: 'Siparişten İtibaren 24 Saat İçinde Taze Kavrum & Sevk',
        warranty: 'Tazelik, Kalibre ve Vakum Koruma Garantisi',
        withholdingVat: 'Gıdada %1 KDV ve Kurumsal Tevkifat Mevzuatına Uygunluk'
      }
    };
  }

  // Genel B2B Standart
  return {
    rawMaterial: 'Sanayi ve toptan satış standardında 1. sınıf hammadde ve yerel imalat. TSE & CE uygunluk sertifikalı ambalaj.',
    usageAreas: [
      'Perakende Esnaf Dükkanları',
      'Pazaryeri & E-Ticaret Mağazaları',
      'Toptan Satış & Dağıtım Ağları'
    ],
    storageConditions: 'Kuru, kapalı depolama alanlarında orijinal ambalajında muhafaza ediniz.',
    origin: product.storeName || 'Türkiye / Yerel Üretim Merkezi',
    standards: [
      'TSE Standart Uygunluk Belgesi',
      'ISO 9001 Kalite Standardı',
      '%100 Yerli Üretim Onayı'
    ],
    netWeight: `${(product.deliveryOptions?.desi || 5) * 0.7} kg / ${unitType}`,
    grossWeight: `${product.deliveryOptions?.desi || 6} kg`,
    boxContents: `1 ${unitType.toUpperCase()} içerisinde tam korumalı orijinal paket`,
    boxDimensions: '50 x 40 x 30 cm',
    desi: product.deliveryOptions?.desi || 10,
    palletCapacity: `1 Euro Palet = 30-40 ${unitType.toUpperCase()} Streç Korumalı Sevkiyat`,
    tieredBreakdown: {
      tier1: { label: `1 - 4 ${unitType}`, range: `1 - 4 ${unitType}`, price: t1Price, discount: 'Liste Fiyatı', tag: 'Başlangıç' },
      tier2: { label: `5 - 19 ${unitType}`, range: `5 - 19 ${unitType}`, price: t2Price, discount: '%10 İndirim', tag: 'Toptan' },
      tier3: { label: `20+ ${unitType}`, range: `20+ ${unitType} (Palet)`, price: t3Price, discount: '%21 Özel İskonto', tag: 'Paletli Sevk' }
    },
    logistics: {
      eInvoice: 'GİB UBL-TR 2.1 e-İrsaliye uyumlu resmi sevk.',
      carriers: [product.deliveryOptions?.carrierCompany || 'Yurtiçi Kargo Palet', 'Şehirlerarası Ambarlar'],
      dispatchTime: '24-48 Saat İçinde Sevk',
      warranty: 'Orijinal Ürün & Taşıma Hasarı Birebir Telafi Garantisi',
      withholdingVat: 'KDV Tevkifatı Seçeneği Mevcuttur.'
    }
  };
}

export default function B2BWholesaleMarketplace() {
  const navigate = useNavigate();
  const { id: routeProductId } = useParams<{ id?: string }>();
  const { user, isAuthenticated, loginAsSeller, openAuthModal } = useAuth();
  const isSeller = isAuthenticated && user?.role === 'seller';

  // Products State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('tampazar_products');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        const ids = new Set(parsed.map(p => p.id));
        const missing = initialProducts.filter(p => !ids.has(p.id));
        return [...missing, ...parsed];
      }
      return initialProducts;
    } catch {
      return initialProducts;
    }
  });

  // Filter & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyDropshipEligible, setOnlyDropshipEligible] = useState<boolean>(false);

  // Quick View / Wholesale Detail Modal State
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);
  const [detailActiveTab, setDetailActiveTab] = useState<'aciklama' | 'koli_palet' | 'kademeli_fiyat' | 'lojistik'>('aciklama');
  const [detailQuantity, setDetailQuantity] = useState<number>(5);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Wholesale Purchase Modal State
  const [purchaseModalProduct, setPurchaseModalProduct] = useState<Product | null>(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState<number>(5);
  const [paymentTerms, setPaymentTerms] = useState<'CARI_HESAP_30_GUN' | 'PESIN_HAVALE' | 'KREDI_KARTI_POS'>('CARI_HESAP_30_GUN');

  // Dropship Import Modal State
  const [dropshipModalProduct, setDropshipModalProduct] = useState<Product | null>(null);
  const [customRetailPrice, setCustomRetailPrice] = useState<number>(0);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check URL params for direct /toptan/:id navigation
  useEffect(() => {
    if (routeProductId) {
      const match = products.find(p => p.id === routeProductId || p.slug === routeProductId);
      if (match) {
        setSelectedDetailProduct(match);
        setDetailQuantity(match.b2bMinQty || 5);
      }
    }
  }, [routeProductId, products]);

  // SEO configuration
  useEffect(() => {
    applyPageSEO({
      pathname: '/toptan',
      title: 'B2B Toptan Ticaret & Esnaftan Esnafa Dropshipping | TamPazar Tedarik Ağı',
      description: 'Kapalı devre B2B toptan pazaryeri. Merter tekstil serileri, Gedikpaşa ayakkabı kolileri, Karadeniz fındık çuvalları. %0 komisyonla doğrudan üreticiden toptan alın veya tek tıkla dropshipping yapın.',
      canonicalUrl: 'https://tampazar.com/toptan',
      ogType: 'website',
      keywords: ['toptan b2b', 'esnaf dropshipping', 'toptan tekstil merter', 'toptan ayakkabı gedikpaşa', 'faire türkiye', 'spocket b2b'],
      breadcrumbs: [
        { name: 'Ana Sayfa', url: 'https://tampazar.com/' },
        { name: 'B2B Toptan & Esnaf Ağı', url: 'https://tampazar.com/toptan' }
      ]
    });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filter B2B products
  const b2bProducts = products.filter(p => {
    const isB2B = p.type === 'wholesale' || p.isB2BOnly || p.b2bWholesalePrice || p.allowDropshipping;
    if (!isB2B) return false;

    if (onlyDropshipEligible && !p.allowDropshipping) return false;

    if (selectedCategory !== 'all') {
      if (p.categorySlug !== selectedCategory && !p.category.toLowerCase().includes(selectedCategory)) {
        return false;
      }
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchStore = (p.storeName || '').toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      if (!matchTitle && !matchStore && !matchCat) return false;
    }

    return true;
  });

  // Helper to calculate tiered price based on quantity
  const getTierPrice = (product: Product, qty: number): number => {
    const basePrice = product.b2bWholesalePrice || product.price;
    if (qty >= 20) {
      return Math.round(basePrice * 0.79); // %21 Özel İskonto
    }
    if (qty >= 5) {
      return Math.round(basePrice * 0.9); // %10 İndirim
    }
    return basePrice;
  };

  // Open Quick View Modal
  const handleOpenDetailModal = (product: Product) => {
    setSelectedDetailProduct(product);
    setDetailQuantity(product.b2bMinQty || 5);
    setDetailActiveTab('aciklama');
  };

  // Close Quick View Modal
  const handleCloseDetailModal = () => {
    setSelectedDetailProduct(null);
    if (routeProductId) {
      navigate('/toptan', { replace: true });
    }
  };

  // Copy share link
  const handleCopyProductLink = (product: Product) => {
    const url = `${window.location.origin}/toptan/${product.slug || product.id}`;
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  // Handle open wholesale purchase modal
  const handleOpenPurchaseModal = (product: Product) => {
    if (!isSeller) {
      openAuthModal ? openAuthModal('seller') : loginAsSeller();
      return;
    }
    setPurchaseModalProduct(product);
    setPurchaseQuantity(product.b2bMinQty || 5);
  };

  // Execute Wholesale Order
  const handleExecuteWholesaleOrder = () => {
    if (!purchaseModalProduct) return;

    const unitPrice = getTierPrice(purchaseModalProduct, purchaseQuantity);
    const totalAmount = unitPrice * purchaseQuantity;
    const orderNo = 'B2B-2026-' + Math.floor(1000 + Math.random() * 9000);

    const newOrder: B2BWholesaleOrder = {
      id: 'b2b-' + Date.now(),
      orderNo,
      buyerTenantId: user?.storeId || 'tenant-buyer',
      buyerStoreName: user?.storeName || 'FotoSentez Butik Mağazası',
      buyerTaxNo: '3489102911',
      buyerContact: `${user?.name || 'Yetkili'} (0532 555 44 33)`,
      buyerCity: 'İstanbul / Kadıköy',
      sellerTenantId: purchaseModalProduct.tenantId,
      sellerStoreName: purchaseModalProduct.storeName || 'Toptancı İmalatçı',
      productId: purchaseModalProduct.id,
      productTitle: purchaseModalProduct.title,
      productImage: purchaseModalProduct.image,
      unitType: purchaseModalProduct.b2bUnitType || 'seri',
      quantity: purchaseQuantity,
      totalUnitsCount: purchaseQuantity * (purchaseModalProduct.b2bUnitType === 'seri' ? 6 : purchaseModalProduct.b2bUnitType === 'koli' ? 8 : 1),
      unitPrice,
      totalAmount,
      paymentTerms,
      status: 'TEKLIF_BEKLIYOR',
      orderDate: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    const existingOrders = getStoredB2BOrders();
    const updatedOrders = [newOrder, ...existingOrders];
    saveStoredB2BOrders(updatedOrders);

    setPurchaseModalProduct(null);
    if (selectedDetailProduct) {
      setSelectedDetailProduct(null);
    }
    showToast(`🎉 ${orderNo} numaralı toptan sipariş talebiniz "${purchaseModalProduct.storeName}" üreticisine iletildi!`);
  };

  // Handle open dropship import modal
  const handleOpenDropshipModal = (product: Product) => {
    if (!isSeller) {
      openAuthModal ? openAuthModal('seller') : loginAsSeller();
      return;
    }
    setDropshipModalProduct(product);
    setCustomRetailPrice(product.suggestedRetailPrice || Math.round((product.b2bWholesalePrice || product.price) * 1.5));
  };

  // Execute Dropship Import (TamPazar B2B Modeli)
  const handleExecuteDropshipImport = () => {
    if (!dropshipModalProduct) return;

    const wholesaleCost = dropshipModalProduct.b2bWholesalePrice || dropshipModalProduct.price;
    const profitTL = customRetailPrice - wholesaleCost;
    const profitMarginPercent = Math.round((profitTL / wholesaleCost) * 100);

    const newMapping: DropshippedProductMapping = {
      id: 'dsp-map-' + Date.now(),
      originalProductId: dropshipModalProduct.id,
      originalWholesalerId: dropshipModalProduct.tenantId,
      originalWholesalerName: dropshipModalProduct.storeName || 'Toptancı İmalatçı',
      retailerTenantId: user?.storeId || 's3',
      retailerStoreName: user?.storeName || 'FotoSentez Butik',
      productTitle: dropshipModalProduct.title,
      productImage: dropshipModalProduct.image,
      wholesaleCost,
      myRetailPrice: customRetailPrice,
      myProfitMarginTL: profitTL,
      myProfitMarginPercent: profitMarginPercent,
      status: 'AKTIF',
      salesCount: 0,
      addedAt: new Date().toISOString().split('T')[0]
    };

    const existingMappings = getStoredDropshippedProducts();
    saveStoredDropshippedProducts([newMapping, ...existingMappings]);

    const clonedProduct: Product = {
      ...dropshipModalProduct,
      id: 'prod-dsp-' + Date.now(),
      tenantId: user?.storeId || 's3',
      storeName: user?.storeName || 'FotoSentez Butik',
      price: customRetailPrice,
      listPrice: Math.round(customRetailPrice * 1.25),
      sku: 'DSP-' + dropshipModalProduct.sku,
      badge: 'Dropshipping (Hızlı Sevk)',
      isB2BOnly: false,
      isDropshippedCopy: true,
      dropshipOriginalProductId: dropshipModalProduct.id,
      dropshipOriginalStoreId: dropshipModalProduct.tenantId,
      dropshipOriginalStoreName: dropshipModalProduct.storeName
    };

    const updatedCatalog = [clonedProduct, ...products];
    setProducts(updatedCatalog);
    try {
      localStorage.setItem('tampazar_products', JSON.stringify(updatedCatalog));
    } catch (e) {}

    setDropshipModalProduct(null);
    if (selectedDetailProduct) {
      setSelectedDetailProduct(null);
    }
    showToast(`✅ "${dropshipModalProduct.title}" başarıyla mağazanıza eklendi! Satış fiyatınız: ₺${customRetailPrice.toLocaleString('tr-TR')} (Kârınız: ₺${profitTL.toLocaleString('tr-TR')})`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F4C3A] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/40 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#F59E0B]" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 1. HERO & B2B TANITIM BANNERI */}
      <section className="bg-gradient-to-br from-[#0B132B] via-[#0F4C3A] to-[#0B132B] text-white pt-10 pb-14 px-4 sm:px-6 relative overflow-hidden border-b border-slate-800 shadow-lg">
        {/* Dekoratif Işıklandırma */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-[#F59E0B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/40 text-[#F59E0B] text-xs font-black tracking-wider uppercase backdrop-blur-xs">
                <Layers className="w-3.5 h-3.5" />
                <span>Kapalı Devre B2B Toptan & Tedarik Ağı</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                İmalatçıdan Doğrudan <span className="text-[#F59E0B]">Seri & Koli Bazlı Toptan</span> Alım
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                İstanbul Merter tekstil serileri, Gedikpaşa ayakkabı kolileri, Karadeniz fındık çuvalları... Aracı komisyonu olmadan doğrudan üreticiden koli bazlı toptan satın alın veya tek tıkla kendi mağazanıza dropshipping ile ekleyin.
              </p>
            </div>

            {/* B2B Giriş Durumu Rozeti */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 text-right space-y-2 w-full sm:w-auto">
              <span className="text-[10px] text-slate-300 uppercase font-black tracking-wider block">
                B2B Esnaf Durumu
              </span>
              {isSeller ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-end gap-2 text-emerald-400 text-xs font-black">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Onaylı Esnaf Hesabı ({user?.storeName || 'Aktif'})</span>
                  </div>
                  <Link
                    to="/yonetim"
                    className="w-full py-2.5 px-4 bg-[#F59E0B] hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                  >
                    <Store className="w-4 h-4" />
                    B2B & Dropshipping Panelim
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-slate-300">
                    Toptan koli/seri birim fiyatlarını ve dropshipping kâr marjlarını görmek için esnaf mağazanızla oturum açın.
                  </p>
                  <button
                    onClick={() => loginAsSeller ? loginAsSeller() : openAuthModal && openAuthModal('seller')}
                    className="w-full py-2.5 px-4 bg-[#F59E0B] hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg"
                  >
                    <Unlock className="w-4 h-4" />
                    Esnafa Özel Fiyatları Gör (Mağaza Girişi Yap)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* ARAMA VE FİLTRELEME ÇUBUĞU */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Arama Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Toptan ürün, seri, koli veya imalatçı ara..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-[#0F4C3A] focus:outline-hidden"
            />
          </div>

          {/* Kategori Filtre Butonları */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'Tüm Toptan Ürünler' },
              { id: 'toptan-tekstil', label: '👕 Toptan Tekstil' },
              { id: 'toptan-ayakkabi', label: '👞 Toptan Ayakkabı' },
              { id: 'toptan-gida', label: '🌾 Yöresel Gıda & Tarım' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#0F4C3A] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}

            <button
              onClick={() => setOnlyDropshipEligible(!onlyDropshipEligible)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 border ${
                onlyDropshipEligible
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              Yalnızca Dropshipping'e Açık Olanlar
            </button>
          </div>
        </div>

        {/* B2B PRODUCT GRID */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Kapalı Devre Toptan & Dropshipping Kataloğu
              </h2>
              <p className="text-xs text-slate-500">
                Toplam {b2bProducts.length} toptan imalat ürünü listeleniyor · Tıklayarak detaylı teknik özellikleri inceleyin
              </p>
            </div>
            
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>GİB e-İrsaliye & Ambar Sevk Garantisi</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {b2bProducts.map((product) => {
              const unitType = product.b2bUnitType || 'seri';
              const minQty = product.b2bMinQty || 1;
              const wholesalePrice = product.b2bWholesalePrice || product.price;
              const suggestedRetail = product.suggestedRetailPrice || Math.round(wholesalePrice * 1.5);
              const estProfit = suggestedRetail - wholesalePrice;
              const profitPercent = Math.round((estProfit / wholesalePrice) * 100);
              const b2bProof = getProductSocialProof(product.id || product.slug, product.salesCount, { isB2B: true });

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between group hover:border-[#0F4C3A]/50"
                >
                  {/* Card Image & Badges (Clickable) */}
                  <div 
                    onClick={() => handleOpenDetailModal(product)}
                    className="relative aspect-4/3 overflow-hidden bg-slate-100 cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={`${product.title} - TamPazar`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Hover Overlay Button */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                      <span className="bg-[#0F4C3A] text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-[#F59E0B]" />
                        Hızlı İncele & Toptan Şartlar
                      </span>
                    </div>

                    <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950/85 text-[#F59E0B] px-2.5 py-1 rounded-full backdrop-blur-xs border border-amber-500/30 shadow-xs">
                        {product.badge || `Toptan ${unitType.toUpperCase()}`}
                      </span>
                      {product.allowDropshipping && (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600/95 text-white px-2.5 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1 shadow-xs">
                          <Truck className="w-3 h-3" /> Dropshipping Hazır
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl text-[11px] font-black text-slate-800 shadow-xs border border-slate-100">
                      Stok: {product.stockCount || 500} {unitType}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-1.5 text-xs">
                        <div className="flex items-center gap-1.5 text-[#0F4C3A] font-bold truncate">
                          <Building2 className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{product.storeName}</span>
                        </div>
                      </div>

                      {/* Başlık (Clickable) */}
                      <h3 
                        onClick={() => handleOpenDetailModal(product)}
                        className="text-sm font-black text-slate-900 leading-snug hover:text-[#0F4C3A] transition cursor-pointer"
                      >
                        {product.title}
                      </h3>

                      {/* Toptan Sevk Hacmi Rozeti */}
                      <div className="pt-0.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-950 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md shadow-2xs">
                          {b2bProof.wholesaleBadgeText}
                        </span>
                      </div>

                      {/* Açıklama Metni - Kesilme Düzeltilmiş ve Tıklanabilir Detay Linki */}
                      <div className="space-y-1">
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                          {product.description}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleOpenDetailModal(product)}
                          className="text-[11px] font-bold text-[#0F4C3A] hover:text-emerald-700 flex items-center gap-1 transition cursor-pointer pt-0.5"
                        >
                          <span>Toptan Şartları & Detaylar</span>
                          <ArrowRight className="w-3 h-3 text-[#F59E0B]" />
                        </button>
                      </div>
                    </div>

                    {/* Minimum Alım ve Paket Detayı */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Min. Sipariş Miktarı:</span>
                        <span className="font-black text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          {minQty} {unitType.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Kargo & Ambar:</span>
                        <span className="font-bold text-emerald-700">
                          {product.deliveryOptions?.carrierCompany || 'Yurtiçi Palet'}
                        </span>
                      </div>
                    </div>

                    {/* Fiyat Bölümü (Gizli / Açık Kontrolü) */}
                    <div className="pt-2 border-t border-slate-100 space-y-3">
                      {!isSeller ? (
                        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 text-center space-y-2">
                          <div className="flex items-center justify-center gap-1.5 text-amber-900 text-xs font-bold">
                            <Lock className="w-4 h-4 text-amber-600" />
                            <span>Toptan Fiyatı Görmek İçin Giriş Yapın</span>
                          </div>
                          <button
                            onClick={() => loginAsSeller ? loginAsSeller() : openAuthModal && openAuthModal('seller')}
                            className="w-full py-2 bg-[#F59E0B] hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer shadow-xs"
                          >
                            Esnafa Özel Fiyatları Gör
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* Fiyat Bilgisi */}
                          <div className="flex items-end justify-between">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                Toptan Birim Fiyatı ({unitType}):
                              </span>
                              <div className="text-xl font-black text-slate-950">
                                ₺{wholesalePrice.toLocaleString('tr-TR')}
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-[10px] text-emerald-600 font-bold block">
                                20+ Alımda:
                              </span>
                              <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                ₺{Math.round(wholesalePrice * 0.79).toLocaleString('tr-TR')}'ye kadar
                              </span>
                            </div>
                          </div>

                          {/* Dropshipping Kâr Göstergesi */}
                          {product.allowDropshipping && (
                            <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-emerald-800 font-semibold">Önerilen Perakende:</span>
                                <span className="font-bold text-slate-800">₺{suggestedRetail.toLocaleString('tr-TR')}</span>
                              </div>
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-emerald-800 font-semibold">Vitrin Kâr Marjınız:</span>
                                <span className="font-black text-emerald-700">
                                  +₺{estProfit.toLocaleString('tr-TR')} (%{profitPercent})
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Ana İnceleme & Detay Butonu */}
                          <button
                            type="button"
                            onClick={() => handleOpenDetailModal(product)}
                            className="w-full py-2.5 px-3 bg-[#0F4C3A] hover:bg-[#0B3A2C] text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#F59E0B]" />
                            <span>Ürünü İncele & Toptan Detay</span>
                          </button>

                          {/* Hızlı Aksiyon Butonları */}
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => handleOpenPurchaseModal(product)}
                              className="py-2 px-2.5 bg-[#0B132B] hover:bg-slate-800 text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                            >
                              <ShoppingBag className="w-3 h-3 text-[#F59E0B]" />
                              <span>Toplu Satın Al</span>
                            </button>

                            {product.allowDropshipping ? (
                              <button
                                onClick={() => handleOpenDropshipModal(product)}
                                className="py-2 px-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                              >
                                <Truck className="w-3 h-3" />
                                <span>Mağazama Ekle</span>
                              </button>
                            ) : (
                              <button
                                disabled
                                className="py-2 px-2.5 bg-slate-100 text-slate-400 font-bold text-xs rounded-xl cursor-not-allowed flex items-center justify-center"
                              >
                                Yalnızca Toptan
                              </button>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              showToast(`"${product.title}" için 1 adet numune talebiniz üreticiye iletildi.`);
                            }}
                            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-xl border border-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>🧪 1 Adet Test Numunesi Talep Et</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. B2B MODÜL BİLGİLENDİRME BANNERI */}
        <div className="bg-gradient-to-r from-[#0B132B] via-[#0F4C3A] to-[#0B132B] rounded-3xl p-6 sm:p-8 text-white space-y-4 shadow-xl border border-emerald-800/40">
          <div className="flex items-center gap-2 text-[#F59E0B] text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Türkiye'nin İlk Açık & Kapalı Hibrit Esnaf Modeli</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            Kendi Ürünlerinizi B2B'ye Açın, Binlerce Esnaf Sizin İçin Satsın
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 max-w-3xl leading-relaxed">
            TamPazar yönetim panelinden ürünlerinizi eklerken "Toptan Satış" ve "Dropshipping" seçeneklerini işaretleyin. Diğer perakendeciler ürünlerinizi kendi vitrinlerine koysun; satış oldukça siparişler otomatik sizin panelinize düşsün. Siz sadece kargolayın, paranız ertesi gün hesabınıza geçsin.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/yonetim"
              className="px-5 py-2.5 bg-[#F59E0B] hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              <Store className="w-4 h-4" />
              Ürünlerimi B2B & Dropshipping'e Aç
            </Link>
            <span className="text-xs text-slate-300">
              ✓ %0 Platform Komisyonu ✓ Otomatik e-İrsaliye ve Despatch Sevk
            </span>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* MODAL: KAPSAMLI HIZLI İNCELEME & TOPTAN DETAY MODALI (QUICK VIEW MODAL)   */}
      {/* ========================================================================= */}
      {selectedDetailProduct && (() => {
        const specs = getB2BProductSpecs(selectedDetailProduct);
        const unitType = selectedDetailProduct.b2bUnitType || 'seri';
        const basePrice = selectedDetailProduct.b2bWholesalePrice || selectedDetailProduct.price;
        const currentTierPrice = getTierPrice(selectedDetailProduct, detailQuantity);
        const totalAmount = currentTierPrice * detailQuantity;
        const totalUnits = detailQuantity * (unitType === 'seri' ? 6 : unitType === 'koli' ? 8 : 1);
        const suggestedRetail = selectedDetailProduct.suggestedRetailPrice || Math.round(basePrice * 1.5);
        const totalSuggestedRevenue = suggestedRetail * totalUnits;
        const totalEstProfit = totalSuggestedRevenue - totalAmount;

        return (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
            <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
              
              {/* MODAL HEADER */}
              <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-[#0F4C3A] text-[#F59E0B] font-black text-base flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase text-[#F59E0B] bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                        B2B Toptan Ürün Detayı
                      </span>
                      <span className="text-xs text-slate-300 font-bold truncate">
                        {selectedDetailProduct.storeName}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-white truncate mt-0.5">
                      {selectedDetailProduct.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopyProductLink(selectedDetailProduct)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition cursor-pointer text-xs flex items-center gap-1.5"
                    title="Bağlantıyı Kopyala"
                  >
                    {copySuccess ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                    <span className="hidden sm:inline">{copySuccess ? 'Kopyalandı!' : 'Paylaş'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseDetailModal}
                    className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* MODAL BODY (SCROLLABLE) */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
                
                {/* Üst Kısım: Görsel ve Hızlı Fiyat Özeti */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pb-6 border-b border-slate-100">
                  {/* Sol: Ürün Görseli */}
                  <div className="md:col-span-5 relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                    <img
                      src={selectedDetailProduct.image}
                      alt={selectedDetailProduct.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-slate-950/80 text-[#F59E0B] text-[10px] font-black px-2.5 py-1 rounded-lg backdrop-blur-xs border border-amber-500/30">
                      {selectedDetailProduct.badge || `1 ${unitType.toUpperCase()}`}
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 bg-white/95 text-slate-900 text-[11px] font-extrabold px-2.5 py-1 rounded-lg shadow-sm border border-slate-200">
                      Stok: {selectedDetailProduct.stockCount || 500} {unitType}
                    </div>
                  </div>

                  {/* Sağ: Başlık, Üretici ve Fiyat Özeti */}
                  <div className="md:col-span-7 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="bg-[#0F4C3A]/10 text-[#0F4C3A] font-bold px-2 py-0.5 rounded-md border border-[#0F4C3A]/20">
                          {selectedDetailProduct.category}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500 font-mono text-[11px]">SKU: {selectedDetailProduct.sku}</span>
                      </div>

                      <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                        {selectedDetailProduct.title}
                      </h2>

                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span className="font-bold text-slate-800">{specs.origin}</span>
                      </div>

                      {/* B2B Toptan Hacim & Sevk Rozeti */}
                      <div className="pt-1">
                        <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-950 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl shadow-2xs">
                          {getProductSocialProof(selectedDetailProduct.id || selectedDetailProduct.slug, selectedDetailProduct.salesCount, { isB2B: true }).wholesaleBadgeText}
                        </span>
                      </div>
                    </div>

                    {/* Fiyat Bandı */}
                    <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/90 space-y-2">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            Toptan Liste Birim Fiyatı ({unitType}):
                          </span>
                          <div className="text-2xl font-black text-slate-900">
                            ₺{basePrice.toLocaleString('tr-TR')}
                            <span className="text-xs text-slate-500 font-normal ml-1.5">
                              + KDV (%{selectedDetailProduct.vatRate || 10})
                            </span>
                          </div>
                        </div>

                        {selectedDetailProduct.allowDropshipping && (
                          <div className="text-right">
                            <span className="text-[10px] text-emerald-700 font-bold block">
                              Önerilen Perakende:
                            </span>
                            <span className="text-sm font-black text-slate-800">
                              ₺{suggestedRetail.toLocaleString('tr-TR')}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                        <span className="text-slate-600 font-medium">Min. Sipariş Kuralı:</span>
                        <span className="font-black text-[#0F4C3A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {selectedDetailProduct.b2bMinQty || 1} {unitType.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TAB BUTONLARI (4 ZENGİN SEKME) */}
                <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { id: 'aciklama', label: 'Ürün Açıklaması', icon: FileText },
                    { id: 'koli_palet', label: 'Koli & Palet Bilgileri', icon: Box },
                    { id: 'kademeli_fiyat', label: 'Kademeli B2B Fiyat Tablosu', icon: BarChart3 },
                    { id: 'lojistik', label: 'Lojistik & Ambar', icon: Truck }
                  ].map(tab => {
                    const Icon = tab.icon;
                    const isActive = detailActiveTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setDetailActiveTab(tab.id as any)}
                        className={`py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                          isActive
                            ? 'bg-[#0F4C3A] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#F59E0B]' : 'text-slate-500'}`} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* TAB İÇERİKLERİ */}
                <div className="space-y-4">
                  {/* TAB 1: ÜRÜN AÇIKLAMASI */}
                  {detailActiveTab === 'aciklama' && (
                    <div className="space-y-4 animate-fade-in text-xs leading-relaxed">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                        <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#0F4C3A]" />
                          Genel Ürün Tanımı & İmalat Standardı
                        </h4>
                        <p className="text-slate-700 leading-relaxed text-xs">
                          {selectedDetailProduct.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                          <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider block">
                            🧵 Hammadde & Materyal Kalitesi
                          </span>
                          <p className="text-slate-800 font-semibold leading-relaxed">
                            {specs.rawMaterial}
                          </p>
                        </div>

                        <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                          <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider block">
                            🌡️ Depolama & Saklama Koşulları
                          </span>
                          <p className="text-slate-800 font-semibold leading-relaxed">
                            {specs.storageConditions}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                        <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block">
                          🎯 Hedef Kullanım Alanları & Sektörler
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {specs.usageAreas.map((area, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-slate-700 font-medium">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{area}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2">
                        <span className="text-[10px] font-black uppercase text-emerald-900 tracking-wider block">
                          📜 Kalite Standartları & Uygunluk Sertifikaları
                        </span>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {specs.standards.map((std, idx) => (
                            <span key={idx} className="bg-white text-emerald-900 px-3 py-1 rounded-lg border border-emerald-300 font-bold text-[11px] shadow-2xs flex items-center gap-1.5">
                              <Award className="w-3.5 h-3.5 text-emerald-600" />
                              {std}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: KOLİ & PALET BİLGİLERİ */}
                  {detailActiveTab === 'koli_palet' && (
                    <div className="space-y-4 animate-fade-in text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Net Ağırlık</span>
                          <span className="text-base font-black text-slate-900">{specs.netWeight}</span>
                        </div>
                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Brüt Ağırlık</span>
                          <span className="text-base font-black text-slate-900">{specs.grossWeight}</span>
                        </div>
                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Koli Boyutları</span>
                          <span className="text-sm font-black text-slate-900">{specs.boxDimensions}</span>
                        </div>
                        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Kargo Desi</span>
                          <span className="text-base font-black text-[#0F4C3A]">{specs.desi} Desi</span>
                        </div>
                      </div>

                      <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                        <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                          <Boxes className="w-4 h-4 text-[#0F4C3A]" />
                          Paket İçi & Asorti Dağılım Standardı
                        </h4>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-semibold leading-relaxed">
                          {specs.boxContents}
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-amber-50/60 to-white rounded-2xl border border-amber-200 space-y-2">
                        <h4 className="font-black text-amber-950 text-sm flex items-center gap-2">
                          <Package className="w-4 h-4 text-amber-600" />
                          Euro Palet Dizilim & Konteyner Sevkiyat Kapasitesi
                        </h4>
                        <p className="text-slate-800 font-medium leading-relaxed">
                          {specs.palletCapacity}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-amber-900 pt-1">
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          <span>Tüm paletler su geçirmez kalın shrink film ve çemberleme ile ambalajlanır.</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: KADEMELİ B2B FİYAT TABLOSU */}
                  {detailActiveTab === 'kademeli_fiyat' && (
                    <div className="space-y-4 animate-fade-in text-xs">
                      <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl text-indigo-900 space-y-1">
                        <span className="font-black text-xs block">📊 Toplu Alım Kademeli İskonto Sistemi</span>
                        <p className="text-[11px] text-indigo-700 leading-relaxed">
                          Sipariş miktarınız arttıkça birim koli/seri maliyetiniz otomatik olarak düşer. 20+ alımlarda palet bazlı doğrudan imalatçı fabrika iskontosu uygulanır.
                        </p>
                      </div>

                      {/* Kademeler Tablosu */}
                      <div className="overflow-hidden border border-slate-200 rounded-2xl shadow-2xs">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-100 text-slate-700 font-black text-[11px] uppercase tracking-wider">
                              <th className="p-3">Sipariş Kademesi</th>
                              <th className="p-3">Birim Fiyat ({unitType})</th>
                              <th className="p-3">İskonto Oranı</th>
                              <th className="p-3 text-right">Durum</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                            {[specs.tieredBreakdown.tier1, specs.tieredBreakdown.tier2, specs.tieredBreakdown.tier3].map((tier, idx) => {
                              const isCurrentActive = 
                                (idx === 0 && detailQuantity < 5) ||
                                (idx === 1 && detailQuantity >= 5 && detailQuantity < 20) ||
                                (idx === 2 && detailQuantity >= 20);

                              return (
                                <tr key={idx} className={isCurrentActive ? 'bg-emerald-50/80 font-bold text-emerald-950' : 'bg-white hover:bg-slate-50'}>
                                  <td className="p-3 flex items-center gap-2">
                                    {isCurrentActive && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                                    <span>{tier.range}</span>
                                  </td>
                                  <td className="p-3 font-black text-slate-900">₺{tier.price.toLocaleString('tr-TR')}</td>
                                  <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${idx === 2 ? 'bg-emerald-600 text-white' : idx === 1 ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'}`}>
                                      {tier.discount}
                                    </span>
                                  </td>
                                  <td className="p-3 text-right">
                                    <span className="text-[10px] uppercase font-bold text-slate-500">{tier.tag}</span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Canlı Simülasyon Kutusu */}
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="font-black text-slate-900">Miktar Simülasyonu ({unitType}):</label>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setDetailQuantity(Math.max(selectedDetailProduct.b2bMinQty || 1, detailQuantity - 1))}
                              className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 font-black flex items-center justify-center cursor-pointer"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min={selectedDetailProduct.b2bMinQty || 1}
                              value={detailQuantity}
                              onChange={(e) => setDetailQuantity(Math.max(selectedDetailProduct.b2bMinQty || 1, Number(e.target.value)))}
                              className="w-16 py-1 text-center bg-white border border-slate-300 rounded-lg font-black text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => setDetailQuantity(detailQuantity + 1)}
                              className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 font-black flex items-center justify-center cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200 text-center">
                          <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                            <span className="text-[10px] text-slate-400 block font-bold">Uygulanan Birim Fiyat</span>
                            <span className="text-sm font-black text-slate-900">₺{currentTierPrice.toLocaleString('tr-TR')}</span>
                          </div>
                          <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                            <span className="text-[10px] text-slate-400 block font-bold">Toplam Ürün Adedi</span>
                            <span className="text-sm font-black text-slate-900">{totalUnits} Adet</span>
                          </div>
                          <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                            <span className="text-[10px] text-slate-400 block font-bold">Toplam Sipariş Tutarı</span>
                            <span className="text-sm font-black text-[#0F4C3A]">₺{totalAmount.toLocaleString('tr-TR')}</span>
                          </div>
                          <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                            <span className="text-[10px] text-emerald-800 block font-bold">Tahmini Vitrin Kârınız</span>
                            <span className="text-sm font-black text-emerald-700">+₺{totalEstProfit.toLocaleString('tr-TR')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: LOJİSTİK & AMBAR */}
                  {detailActiveTab === 'lojistik' && (
                    <div className="space-y-4 animate-fade-in text-xs">
                      <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                        <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                          <FileCheck2 className="w-4 h-4 text-[#0F4C3A]" />
                          GİB Resmi e-İrsaliye & Tevkifat Uyumluluğu
                        </h4>
                        <p className="text-slate-700 leading-relaxed">
                          {specs.logistics.eInvoice}
                        </p>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-bold">
                          💼 {specs.logistics.withholdingVat}
                        </div>
                      </div>

                      <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                        <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                          <Truck className="w-4 h-4 text-emerald-600" />
                          Ambar ve Paletli Kargo Teslim Süreleri
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <span className="text-[10px] text-slate-500 font-bold block">Marmara & Ege</span>
                            <span className="text-xs font-black text-slate-900">24 Saat</span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <span className="text-[10px] text-slate-500 font-bold block">İç Anadolu & Akdeniz</span>
                            <span className="text-xs font-black text-slate-900">24 - 48 Saat</span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <span className="text-[10px] text-slate-500 font-bold block">Doğu & Güneydoğu</span>
                            <span className="text-xs font-black text-slate-900">48 - 72 Saat</span>
                          </div>
                        </div>

                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">Anlaşmalı Taşıyıcı ve Ambarlar:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {specs.logistics.carriers.map((c, idx) => (
                              <span key={idx} className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md text-[11px] font-bold">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1.5 text-emerald-950">
                        <span className="font-black text-xs block flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          Hasarsız Teslimat & İmalatçı Birebir Değişim Garantisi
                        </span>
                        <p className="text-[11px] text-emerald-800 leading-relaxed">
                          {specs.logistics.warranty}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* MODAL FOOTER (FIXED ACTIONS) */}
              <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">
                      {detailQuantity} {unitType} İçin Tutar:
                    </span>
                    <span className="text-xl font-black text-slate-900">
                      ₺{totalAmount.toLocaleString('tr-TR')}
                    </span>
                  </div>
                  
                  <div className="text-right sm:text-left sm:ml-4">
                    <span className="text-[10px] text-emerald-700 uppercase font-bold block">
                      Birim Fiyat:
                    </span>
                    <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      ₺{currentTierPrice.toLocaleString('tr-TR')} / {unitType}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {selectedDetailProduct.allowDropshipping && (
                    <button
                      type="button"
                      onClick={() => handleOpenDropshipModal(selectedDetailProduct)}
                      className="flex-1 sm:flex-none py-2.5 px-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl transition cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Mağazama Ekle</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleOpenPurchaseModal(selectedDetailProduct)}
                    className="flex-1 sm:flex-none py-2.5 px-5 bg-[#0F4C3A] hover:bg-[#0B3A2C] text-white font-black text-xs rounded-xl transition cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#F59E0B]" />
                    <span>Toplu Sipariş Ver</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* MODAL 1: HIZLI TOPTAN SATIN ALMA / TEKLİF MODALI */}
      {purchaseModalProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  B2B Toptan Sipariş Formu
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  {purchaseModalProduct.title}
                </h3>
              </div>
              <button
                onClick={() => setPurchaseModalProduct(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            {/* Miktar Seçici */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Sipariş Miktarı ({purchaseModalProduct.b2bUnitType || 'seri'}):</span>
                <span className="text-slate-500 font-normal">
                  Min. {purchaseModalProduct.b2bMinQty || 1} {purchaseModalProduct.b2bUnitType}
                </span>
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPurchaseQuantity(Math.max(purchaseModalProduct.b2bMinQty || 1, purchaseQuantity - 1))}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black flex items-center justify-center cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min={purchaseModalProduct.b2bMinQty || 1}
                  value={purchaseQuantity}
                  onChange={(e) => setPurchaseQuantity(Math.max(purchaseModalProduct.b2bMinQty || 1, Number(e.target.value)))}
                  className="flex-1 py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-black text-sm"
                />
                <button
                  type="button"
                  onClick={() => setPurchaseQuantity(purchaseQuantity + 1)}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black flex items-center justify-center cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Ödeme Koşulu */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                Ödeme & Vade Tercihi:
              </label>
              <select
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                <option value="CARI_HESAP_30_GUN">📑 Cari Hesaba Ekle (30 Gün Açık Hesap)</option>
                <option value="PESIN_HAVALE">🏦 Peşin Banka Havalesi / EFT</option>
                <option value="KREDI_KARTI_POS">💳 Sanal POS / Kredi Kartı ile Doğrudan</option>
              </select>
            </div>

            {/* Fiyat Özeti */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Birim Fiyat ({purchaseModalProduct.b2bUnitType}):</span>
                <span className="font-bold text-slate-800">
                  ₺{getTierPrice(purchaseModalProduct, purchaseQuantity).toLocaleString('tr-TR')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Adet / Koli Çarpanı:</span>
                <span className="font-bold text-slate-800">
                  {purchaseQuantity} {purchaseModalProduct.b2bUnitType} (Toplam {purchaseQuantity * 6} birim)
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm">
                <span className="font-black text-slate-900">Toplam Sipariş Tutarı:</span>
                <span className="font-black text-emerald-600 text-base">
                  ₺{(getTierPrice(purchaseModalProduct, purchaseQuantity) * purchaseQuantity).toLocaleString('tr-TR')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPurchaseModalProduct(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleExecuteWholesaleOrder}
                className="flex-2 py-3 bg-[#0F4C3A] hover:bg-[#0B3A2C] text-white font-black text-xs rounded-xl transition cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 text-[#F59E0B]" />
                Toptan Siparişi Onayla & Sevk Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ESNAFTAN ESNAFA DROPSHIPPING VİTRİNE ÇEKME MODALI */}
      {dropshipModalProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                  <Truck className="w-3 h-3 text-emerald-600" />
                  Esnaftan Esnafa Dropshipping Sihirbazı
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  {dropshipModalProduct.title}
                </h3>
              </div>
              <button
                onClick={() => setDropshipModalProduct(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 space-y-1">
              <span className="font-black block">📦 Sıfır Stok Maliyeti ile Satışa Başlayın</span>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                Bu ürünü mağazanıza eklediğinizde kendi vitrininizde satışa açılır. Müşteriniz sipariş verdiğinde, kargolama üretici <strong>{dropshipModalProduct.storeName}</strong> tarafından doğrudan müşterinize sizin dükkan adınızla gönderilir.
              </p>
            </div>

            {/* Perakende Fiyat Belirleme */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                Mağazanızdaki Perakende Satış Fiyatınız (TL):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">₺</span>
                <input
                  type="number"
                  min={(dropshipModalProduct.b2bWholesalePrice || dropshipModalProduct.price) + 1}
                  value={customRetailPrice}
                  onChange={(e) => setCustomRetailPrice(Number(e.target.value))}
                  className="w-full pl-7 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <span className="text-[10px] text-slate-500 block">
                Önerilen Fiyat: ₺{(dropshipModalProduct.suggestedRetailPrice || customRetailPrice).toLocaleString('tr-TR')}
              </span>
            </div>

            {/* Kâr Hesaplama Özeti */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Toptancıya Ödenecek Maliyet:</span>
                <span className="font-bold text-slate-800">
                  ₺{(dropshipModalProduct.b2bWholesalePrice || dropshipModalProduct.price).toLocaleString('tr-TR')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Müşteriden Tahsil Edilecek Tutar:</span>
                <span className="font-bold text-slate-800">
                  ₺{customRetailPrice.toLocaleString('tr-TR')}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm">
                <span className="font-black text-slate-900">Sipariş Başına Net Kârınız:</span>
                <span className="font-black text-emerald-600 text-base">
                  +₺{(customRetailPrice - (dropshipModalProduct.b2bWholesalePrice || dropshipModalProduct.price)).toLocaleString('tr-TR')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDropshipModalProduct(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleExecuteDropshipImport}
                className="flex-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl transition cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Mağazamın Vitrinine Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
