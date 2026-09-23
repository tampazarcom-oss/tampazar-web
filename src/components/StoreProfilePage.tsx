/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  MapPin, Phone, Globe, Instagram, MessageCircle, 
  CreditCard, ShieldCheck, Mail, Clock, FileText, CheckCircle2,
  ArrowLeft, Star, ShoppingBag, SlidersHorizontal, ChevronRight, Share2, Eye, PlusCircle, X
} from 'lucide-react';
import { Tenant, Product, initialProducts, initialTenants } from '../data/mockData';
import QuickAddProductForm from './QuickAddProductForm';
import BookingAndStoreEngine, { DEFAULT_SERVICES, ServiceItem } from './BookingAndStoreEngine';

export interface ProductItem {
  id: string;
  title: string;
  category: string;
  description?: string;
  price: number;
  vatRate: number;
  isWholesaleAvailable?: boolean;
  wholesaleMinQty?: number;
  wholesalePrice?: number;
  type: 'PHYSICAL' | 'SERVICE' | 'INSTANT_FOOD';
  image: string;
}

export interface StoreData {
  slug: string;
  id: string;
  name: string;
  legalTitle: string;
  taxOffice: string;
  taxNumber: string;
  slogan: string;
  about: string;
  avatarUrl: string;
  bannerUrl: string;
  phone: string;
  whatsapp: string;
  websiteUrl: string;
  instagramHandle: string;
  fullAddress: string;
  city: string;
  district: string;
  googleMapsUrl: string;
  workingHours: string;
  paymentGatewayNotice: string;
  products: ProductItem[];
  isVerified?: boolean;
}

export const MOCK_STORES_DATA: Record<string, StoreData> = {
  'kuzey-usta-tesisat': {
    slug: 'kuzey-usta-tesisat',
    id: 'kuzey-usta-tesisat',
    name: 'Kuzey Teknik Tesisat & Mühendislik',
    legalTitle: 'Kuzey Teknik Mühendislik San. ve Tic. Ltd. Şti.',
    taxOffice: 'Altınordu V.D.',
    taxNumber: '4810394812',
    slogan: 'Termal kamera ile noktasal su kaçak tespiti, kombi bakımı ve sıhhi tesisat malzeme satışı.',
    about: '18 yıldır aynı dükkânda hizmet veriyoruz. Dükkânımıza gelip malzeme alabilir, acil arıza durumunda doğrudan cepten veya WhatsApp üzerinden konum gönderip usta çağırabilirsiniz. Ödemelerinizi kendi kurumsal Sanal POS altyapımızla güvenle yapabilirsiniz.',
    avatarUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1400&auto=format&fit=crop&q=80',
    phone: '+90 (452) 223 44 55',
    whatsapp: '905324567890',
    websiteUrl: 'https://kuzeyteknik.com.tr',
    instagramHandle: 'kuzeyteknikordu',
    fullAddress: 'Yeni Mahalle, Marangozlar Çarşısı No: 18/A',
    city: 'Ordu',
    district: 'Altınordu',
    googleMapsUrl: 'https://maps.google.com/?q=Ordu+Yeni+Mahalle',
    workingHours: 'Hafta İçi & Cmt: 08:00 - 19:30 (Acil Arıza 7/24)',
    paymentGatewayNotice: 'Ödemeler doğrudan işletmemizin banka Sanal POS hesabına aktarılır; aracı komisyonu kesilmez.',
    isVerified: true,
    products: [
      {
        id: 'p1',
        title: 'Termal Cihazla Kırmadan Su Kaçağı Tespiti + Resmi Rapor',
        category: 'Yerinde Servis',
        description: 'Termal kamera ve akustik dinleme cihazları ile noktasal kaçak tespiti, sigorta onaylı resmi raporlama.',
        price: 1200,
        vatRate: 20,
        type: 'SERVICE',
        image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=500&auto=format&fit=crop&q=80',
      },
      {
        id: 'p2',
        title: 'Pirinç Küresel Vana 1/2 (Ağır Tip - Tam Geçişli)',
        category: 'Sıhhi Malzeme',
        description: 'TSE belgeli pirinç döküm gövde, PN25 basınç dayanımlı tam geçişli küresel tesisat vanası.',
        price: 145,
        vatRate: 20,
        type: 'PHYSICAL',
        isWholesaleAvailable: true,
        wholesaleMinQty: 50,
        wholesalePrice: 110,
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=80',
      },
      {
        id: 'p3',
        title: 'Kombi ve Radyatör Kimyasal İlaçlı Tesisat Temizliği',
        category: 'Bakım Hizmeti',
        description: 'Çift yönlü yıkama makinesi ve koruyucu inhibitör kimyasal ile petek ve kombi ana eşanjör temizliği.',
        price: 1800,
        vatRate: 20,
        type: 'SERVICE',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=80',
      }
    ]
  },
  'st-101': {
    slug: 'kuzey-ahsap',
    id: 'st-101',
    name: 'Kuzey Ahşap & Mobilya Tasarım',
    legalTitle: 'Kuzey Ahşap Sanayi ve Ticaret Ltd. Şti.',
    taxOffice: 'Ordu V.D.',
    taxNumber: '6040891234',
    slogan: 'Karadeniz meşesinden el işçiliği masif mobilyalar ve kurumsal ofis çözümleri.',
    about: 'Atölyemizde perakende ve toptan projeler üretiyoruz. Atölyemizi doğrudan ziyaret edebilir, özel ölçü siparişleriniz için WhatsApp üzerinden iletişime geçebilirsiniz. Tüm ödemeler kendi PayTR kurumsal sanal POS altyapımız ile doğrudan şirket hesabımıza yapılmaktadır.',
    avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1400&auto=format&fit=crop&q=80',
    phone: '+90 (452) 223 00 00',
    whatsapp: '905320000000',
    websiteUrl: 'https://kuzeyahsap.com.tr',
    instagramHandle: 'kuzeyahsapordu',
    fullAddress: 'Sanayi Mahallesi, Marangozlar Sitesi No: 42',
    city: 'Ordu',
    district: 'Altınordu',
    googleMapsUrl: 'https://maps.google.com/?q=Ordu+Sanayi+Sitesi',
    workingHours: 'Pazartesi - Cumartesi: 08:30 - 18:30',
    paymentGatewayNotice: 'Ödemeler doğrudan şirketimizin PayTR Kurumsal POS hesabına gider, platform komisyonu kesilmez.',
    isVerified: true,
    products: [
      {
        id: 'kuzey-p1',
        title: 'Doğal Kenar Meşe Kütük Yemek Masası (200x90cm)',
        category: 'Masif Mobilya',
        description: '1. Sınıf fırınlanmış Karadeniz meşesi, epoksi dolgulu budaklar ve elektrostatik fırın boyalı döküm U-metal ayaklar.',
        price: 14850,
        vatRate: 20,
        type: 'PHYSICAL',
        image: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 'kuzey-p2',
        title: 'Cafe & Restoran Masif Ahşap Sandalye (Koli İçi 10 Adet)',
        category: 'Ticari Mobilya',
        description: 'Restoran, kafe ve otel projeleri için güçlendirilmiş geçme iskeletli, leke tutmaz nubuk kumaş kaplamalı toptan sandalye serisi.',
        price: 18500,
        vatRate: 20,
        isWholesaleAvailable: true,
        wholesaleMinQty: 5,
        wholesalePrice: 15500,
        type: 'PHYSICAL',
        image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 'kuzey-p3',
        title: 'Mekana Özel Mimari Röleve & 3D Mobilya Tasarım Hizmeti',
        category: 'Mimari Hizmet',
        description: 'İç mimarlarımız tarafından ev veya ofisinizde yerinde lazer ölçüm, 3D fotogerçekçi render modelleme ve keşif raporu.',
        price: 3500,
        vatRate: 20,
        type: 'SERVICE',
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80',
      }
    ]
  },
  's1': {
    slug: 'atolye-zanaat',
    id: 's1',
    name: 'Atölye Zanaat',
    legalTitle: 'Zanaat Tasarım ve Ahşap San. Tic. Ltd.',
    taxOffice: 'Nilüfer V.D.',
    taxNumber: '3849102948',
    slogan: 'Zanaatkâr eliyle üretilmiş butik ahşap masa ve dekoratif mobilyalar.',
    about: 'Doğal fırınlanmış meşe ve ceviz ağaçlarını modern minimalist tasarımlarla harmanlıyoruz. Komisyonsuz fiyatlarımızla doğrudan atölye çıkışlı garantili teslimat.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1400&auto=format&fit=crop&q=80',
    phone: '+90 (224) 441 20 20',
    whatsapp: '905331112233',
    websiteUrl: 'https://atolyezanaat.com',
    instagramHandle: 'atolyezanaat',
    fullAddress: 'Ataevler Mah. Barış Cad. No: 18',
    city: 'Bursa',
    district: 'Nilüfer',
    googleMapsUrl: 'https://maps.google.com/?q=Bursa+Nilufer+Ataevler',
    workingHours: 'Pazartesi - Cuma: 09:00 - 19:00',
    paymentGatewayNotice: 'Ödemeler doğrudan işletmenin iyzico Kurumsal POS hesabına gider.',
    isVerified: true,
    products: [
      {
        id: 'az-1',
        title: 'El Yapımı Masif Meşe Çalışma Masası',
        category: 'Ofis Mobilyası',
        description: 'Kablo geçiş kanallı, doğal yağ ile cilalanmış ergonomik ahşap çalışma masası.',
        price: 8900,
        vatRate: 20,
        type: 'PHYSICAL',
        image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&auto=format&fit=crop&q=80',
      }
    ]
  },
  's2': {
    slug: 'mega-endustriyel',
    id: 's2',
    name: 'Mega Endüstriyel Ambalaj A.Ş.',
    legalTitle: 'Mega Endüstriyel Ambalaj ve Hırdavat A.Ş.',
    taxOffice: 'İkitelli V.D.',
    taxNumber: '7810294819',
    slogan: 'B2B toptan ambalaj malzemeleri, koli bandı ve endüstriyel sarf malzemeleri.',
    about: 'E-ticaret depoları, lojistik merkezleri ve fabrikalar için toptan koli bazlı sevkiyatlar yapıyoruz. Kademeli toptan fiyatlarımızla anında e-fatura ve tevkifatlı fatura düzenliyoruz.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1400&auto=format&fit=crop&q=80',
    phone: '+90 (212) 671 00 00',
    whatsapp: '905354445566',
    websiteUrl: 'https://megaendustriyel.com.tr',
    instagramHandle: 'megaendustriyel',
    fullAddress: 'İOSB Triko Dokumacılar San. Sit. M Blok No: 12',
    city: 'İstanbul',
    district: 'Başakşehir',
    googleMapsUrl: 'https://maps.google.com/?q=Ikitelli+OSB',
    workingHours: 'Hafta içi: 08:00 - 18:00',
    paymentGatewayNotice: 'Ödemeler doğrudan firmanın PayTR B2B Sanal POS hesabına geçer.',
    isVerified: true,
    products: [
      {
        id: 'mg-1',
        title: 'Akrilik Şeffaf Koli Bandı 45x100m (Koli İçi 48 Adet)',
        category: 'Ambalaj & Koli',
        description: 'Güçlü yapışkanlı, sıcak ve soğuğa dayanıklı profesyonel koli kapama bandı.',
        price: 1450,
        vatRate: 20,
        isWholesaleAvailable: true,
        wholesaleMinQty: 10,
        wholesalePrice: 1150,
        type: 'PHYSICAL',
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=80',
      }
    ]
  }
};

interface StoreProfilePageProps {
  storeId?: string;
  onBackToMarketplace?: () => void;
  onOpenSaaSConsole?: (tab?: string) => void;
}

export default function StoreProfilePage({ 
  storeId = 'kuzey-usta-tesisat', 
  onBackToMarketplace, 
  onOpenSaaSConsole 
}: StoreProfilePageProps) {
  const [activeStoreId, setActiveStoreId] = useState<string>(storeId);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBookingEngine, setShowBookingEngine] = useState(false);
  const [customProducts, setCustomProducts] = useState<Record<string, ProductItem[]>>({});

  React.useEffect(() => {
    if (storeId) {
      setActiveStoreId(storeId);
    }
  }, [storeId]);

  // Find store by key, slug or id
  const findStoreData = (idOrSlug: string) => {
    if (MOCK_STORES_DATA[idOrSlug]) return MOCK_STORES_DATA[idOrSlug];
    const foundKey = Object.keys(MOCK_STORES_DATA).find(
      k => MOCK_STORES_DATA[k].slug === idOrSlug || MOCK_STORES_DATA[k].id === idOrSlug
    );
    if (foundKey) return MOCK_STORES_DATA[foundKey];
    return null;
  };

  const store = findStoreData(activeStoreId);

  if (!store) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center font-sans">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full space-y-4">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto font-bold text-2xl border border-rose-100">
            !
          </div>
          <h2 className="text-xl font-black text-slate-900">Dükkân Bulunamadı</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Aradığınız dükkân veya esnaf profili ({activeStoreId}) sistemimizde kayıtlı değil veya kaldırılmış olabilir.
          </p>
          <button
            onClick={onBackToMarketplace}
            className="w-full py-3 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow"
          >
            ← Ana Vitrine Geri Dön
          </button>
        </div>
      </div>
    );
  }

  const allStoreProducts = [...(customProducts[activeStoreId] || []), ...store.products];

  // Prepare service items for Booking Engine
  const storeServices: ServiceItem[] = allStoreProducts
    .filter(p => p.type === 'SERVICE')
    .map(p => ({
      id: p.id,
      name: p.title,
      duration: '45-60 Dk',
      price: p.price
    }));
  const effectiveServices = storeServices.length > 0 ? storeServices : DEFAULT_SERVICES;

  // Schema.org LocalBusiness JSON-LD (Sansürsüz Dükkân Verisi)
  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: store.name,
    legalName: store.legalTitle,
    telephone: store.phone,
    url: store.websiteUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: store.fullAddress,
      addressLocality: store.district,
      addressRegion: store.city,
      addressCountry: 'TR',
    },
    openingHours: store.workingHours,
    priceRange: '₺₺',
  };

  const handleCopyStoreLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      
      {/* Schema.org JSON-LD Entegrasyonu */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />

      {/* Top Floating Back & Switcher Bar */}
      <div className="bg-slate-950/95 text-white backdrop-blur-md px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between sticky top-0 z-50 border-b border-slate-800 text-xs gap-3">
        <button 
          onClick={onBackToMarketplace}
          className="flex items-center gap-1.5 text-slate-300 hover:text-white font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> tampazar.com Ana Vitrine Dön
        </button>

        {/* Quick Merchant Profile Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-slate-400 hidden md:inline text-[11px]">Şeffaf Dükkân Kimliği:</span>
          <select
            value={activeStoreId}
            onChange={(e) => setActiveStoreId(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-amber-300 rounded-lg px-2.5 py-1 text-xs font-semibold outline-none cursor-pointer"
          >
            <option value="kuzey-usta-tesisat">Kuzey Teknik Tesisat & Mühendislik (Ordu)</option>
            <option value="st-101">Kuzey Ahşap & Mobilya Tasarım (Ordu)</option>
            <option value="s1">Atölye Zanaat (Bursa)</option>
            <option value="s2">Mega Endüstriyel Ambalaj A.Ş. (İstanbul)</option>
          </select>
          <button
            onClick={handleCopyStoreLink}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer text-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Kopyalandı!' : 'Paylaş'}</span>
          </button>
        </div>
      </div>

      {/* 1. DÜKKÂN VİTRİN BANNERI */}
      <div className="relative h-64 md:h-80 w-full bg-slate-900 overflow-hidden">
        <img
          src={store.bannerUrl}
          alt={store.name}
          className="w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={handleCopyStoreLink}
            className="bg-white/90 backdrop-blur-md hover:bg-white text-slate-800 text-xs font-bold px-3 py-2 rounded-xl shadow-md flex items-center gap-1.5 transition cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-indigo-900" /> Dükkânı Paylaş
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10 space-y-8">
        
        {/* 2. DİJİTAL DÜKKÂN TABELASI & SANSÜRSÜZ İLETİŞİM KARTI */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200">
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center pb-6 border-b border-slate-100">
            <div className="flex items-center gap-5">
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-white shrink-0">
                <img
                  src={store.avatarUrl}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900">{store.name}</h1>
                  <span className="flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Doğrulanmış Esnaf
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-600 mt-1">{store.slogan}</p>
                
                {/* Resmi Fatura / Vergi Şeffaflığı */}
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-2 flex-wrap font-sans">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-semibold text-slate-600">{store.legalTitle}</span>
                  <span>•</span>
                  <span>{store.taxOffice} ({store.taxNumber})</span>
                </div>
              </div>
            </div>

            {/* MÜŞTERİYE AÇIK DOĞRUDAN İLETİŞİM BUTONLARI (SANSÜRSÜZ ESNAF İLETİŞİMİ) */}
            <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
              <a
                href={`https://wa.me/${store.whatsapp}?text=Merhaba%20tampazar.com%20üzerinden%20dükkânınıza%20ulaştım.`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-xs transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Hattı
              </a>
              <a
                href={`tel:${store.phone.replace(/[^0-9+]/g, '')}`}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 hover:bg-indigo-900 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-xs transition cursor-pointer"
              >
                <Phone className="w-4 h-4" /> Hemen Ara
              </a>
            </div>
          </div>

          {/* 3. AÇIK ADRES, FİZİKİ DÜKKÂN VE ÖZEL KANALLAR (SANSÜRSÜZ İZİN VERİLEN ALAN) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 text-xs">
            {/* Açık Fiziksel Konum */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div>
                <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                  <MapPin className="w-4 h-4 text-rose-600" /> Fiziki Dükkân Adresi
                </span>
                <p className="text-slate-600 leading-relaxed">
                  {store.fullAddress}, {store.district} / {store.city}
                </p>
              </div>
              <a
                href={store.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 text-indigo-600 hover:underline font-bold flex items-center gap-1 text-[11px]"
              >
                <ChevronRight className="w-3 h-3" /> Haritada Yol Tarifi Al ↗
              </a>
            </div>

            {/* Çalışma Saatleri */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                <Clock className="w-4 h-4 text-amber-600" /> Çalışma Saatleri
              </span>
              <p className="text-slate-600 leading-relaxed mt-1">{store.workingHours}</p>
              <span className="inline-block mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                Şu Anda Açık & Hizmet Veriyor
              </span>
            </div>

            {/* Resmi Web Sitesi ve Sosyal Ağlar */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                <Globe className="w-4 h-4 text-sky-600" /> Bağımsız İletişim Ağları
              </span>
              <div className="space-y-1.5 mt-2">
                <a
                  href={store.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 hover:underline font-semibold flex items-center gap-1 truncate"
                >
                  Resmi Web Sitesi ↗
                </a>
                <a
                  href={`https://instagram.com/${store.instagramHandle}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-pink-600 hover:underline font-semibold flex items-center gap-1"
                >
                  <Instagram className="w-3.5 h-3.5" /> @{store.instagramHandle}
                </a>
              </div>
            </div>

            {/* Güvenli ve Doğrudan Ödeme Bilgisi */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5 mb-1">
                <CreditCard className="w-4 h-4 text-emerald-700" /> Kendi POS'u ile Güvenli Ödeme
              </span>
              <p className="text-emerald-800 leading-relaxed text-[11px] mt-1">
                {store.paymentGatewayNotice}
              </p>
              <div className="flex items-center gap-1 mt-2 text-[10px] font-semibold text-emerald-900">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 256-Bit SSL Doğrudan Banka Tahsilatı
              </div>
            </div>
          </div>

          {/* Dükkân Hikâyesi / Biyografi */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Dükkân Hakkında</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{store.about}</p>
          </div>
        </div>

        {/* 4. ESNAFIN ÜRÜN VE HİZMET REYONU */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900">Dükkânın Ürün & Hizmetleri</h2>
              <p className="text-xs text-slate-500">
                İster yerinde randevu isteyin, ister doğrudan dükkânın kendi POS'uyla sipariş verin.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                Toplam {allStoreProducts.length} İlan / Ürün
              </span>
              <button
                onClick={() => setShowBookingEngine(!showBookingEngine)}
                className="text-xs font-bold bg-indigo-900 hover:bg-indigo-800 text-white px-3.5 py-1.5 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                {showBookingEngine ? 'Randevu Panelini Kapat' : '📅 Online Randevu Al'}
              </button>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="text-xs font-bold bg-amber-400 hover:bg-amber-500 text-slate-950 px-3.5 py-1.5 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                {showAddForm ? <X className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
                {showAddForm ? 'Formu Kapat' : '⚡ Dükkâna Hızlı İlan Ekle'}
              </button>
            </div>
          </div>

          {/* Collapsible Booking & Store Engine */}
          {showBookingEngine && (
            <div className="py-2 animate-fade-in">
              <BookingAndStoreEngine
                storeName={store.name}
                phone={store.phone}
                whatsapp={store.whatsapp}
                services={effectiveServices}
                onBookingComplete={() => {
                  setTimeout(() => {
                    setShowBookingEngine(false);
                  }, 4000);
                }}
              />
            </div>
          )}

          {/* Collapsible Quick Add Product Form */}
          {showAddForm && (
            <div className="py-2 animate-fade-in">
              <QuickAddProductForm
                storeId={store.id}
                storeName={store.name}
                onProductAdded={(newP) => {
                  const convertedItem: ProductItem = {
                    id: newP.id,
                    title: newP.title,
                    category: newP.category,
                    description: newP.description,
                    price: newP.price,
                    vatRate: newP.vatRate,
                    isWholesaleAvailable: newP.type === 'wholesale',
                    wholesaleMinQty: newP.moq,
                    wholesalePrice: newP.tieredPrices?.[0]?.pricePerUnit,
                    type: newP.type === 'wholesale' ? 'PHYSICAL' : newP.type === 'service' ? 'SERVICE' : 'PHYSICAL',
                    image: newP.image
                  };
                  setCustomProducts(prev => ({
                    ...prev,
                    [activeStoreId]: [convertedItem, ...(prev[activeStoreId] || [])]
                  }));
                  setShowAddForm(false);
                }}
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allStoreProducts.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <span className="absolute top-3 left-3 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-950/80 text-white backdrop-blur-xs">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    {/* Toptan Kademeli İskonto Rozeti */}
                    {item.isWholesaleAvailable && (
                      <div className="p-2 rounded-xl bg-amber-50 border border-amber-100 text-[11px] text-amber-900 font-medium">
                        <strong>Toptan Alım:</strong> {item.wholesaleMinQty}+ adet alımlarda{' '}
                        <span className="font-bold text-amber-700">{item.wholesalePrice} ₺</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0 space-y-3">
                  <div className="flex items-baseline justify-between border-t border-slate-100 pt-3">
                    <span className="text-xs text-slate-400 font-medium">+%{item.vatRate} KDV Dahil</span>
                    <span className="text-lg font-black text-slate-900">
                      {item.price.toLocaleString('tr-TR')} ₺
                    </span>
                  </div>

                  {/* Sektöre Göre Dinamik Eylem Butonu */}
                  {item.type === 'SERVICE' ? (
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setShowBookingEngine(true);
                          window.scrollTo({ top: 400, behavior: 'smooth' });
                        }}
                        className="py-2.5 px-2 rounded-xl text-xs font-bold text-white bg-indigo-900 hover:bg-indigo-800 transition flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Clock className="w-3.5 h-3.5 text-amber-300" /> Randevu Al
                      </button>
                      <a
                        href={`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(
                          `Merhaba, "${item.title}" hizmetiniz için randevu ve bilgi almak istiyorum.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2.5 px-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp
                      </a>
                    </div>
                  ) : (
                    <button 
                      onClick={() => alert(`"${item.title}" için ${store.name} işletmesinin doğrudan kendi POS tahsilat akışı tetiklendi.`)}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <ShoppingBag className="w-4 h-4" /> Doğrudan Satın Al
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
