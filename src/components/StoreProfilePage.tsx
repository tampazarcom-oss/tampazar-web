/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, Phone, Globe, Instagram, MessageCircle, 
  CreditCard, ShieldCheck, Mail, Clock, FileText, CheckCircle2,
  ArrowLeft, Star, ShoppingBag, SlidersHorizontal, ChevronRight, Share2, Eye, PlusCircle, X,
  UserPlus, UserCheck, HelpCircle, Search, ThumbsUp, Send, Store, Award, Truck, Sparkles, Filter
} from 'lucide-react';
import { Tenant, Product, initialProducts, initialTenants } from '../data/mockData';
import QuickAddProductForm from './QuickAddProductForm';
import BookingAndStoreEngine, { DEFAULT_SERVICES, ServiceItem } from './BookingAndStoreEngine';
import { applyPageSEO } from '../utils/seo';
import { getStoreSocialProof } from '../utils/socialProof';

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
    about: '18 yıldır Ordu merkezde aynı dükkânda hizmet veriyoruz. Dükkânımıza gelip malzeme alabilir, acil arıza durumunda doğrudan cepten veya WhatsApp üzerinden konum gönderip usta çağırabilirsiniz. Ödemelerinizi kendi kurumsal Sanal POS altyapımızla (%0 komisyon) güvenle yapabilirsiniz.',
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

  // Requirements 2 specific states
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(1420);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [questionSubject, setQuestionSubject] = useState('Ürün ve Hizmet Bilgisi');
  const [questionText, setQuestionText] = useState('');
  const [questionSent, setQuestionSent] = useState(false);

  // Tab & In-Store Search State
  const [activeTab, setActiveTab] = useState<'products' | 'story' | 'reviews' | 'contact'>('products');
  const [inStoreSearch, setInStoreSearch] = useState('');
  const [selectedStoreCategory, setSelectedStoreCategory] = useState<string | null>(null);

  useEffect(() => {
    if (storeId) {
      setActiveStoreId(storeId);
    }
  }, [storeId]);

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
            className="w-full py-3 bg-[#0F4C3A] hover:bg-[#0B132B] text-white font-bold text-xs rounded-xl transition cursor-pointer shadow"
          >
            ← Ana Vitrine Geri Dön
          </button>
        </div>
      </div>
    );
  }

  const allStoreProducts = [...(customProducts[activeStoreId] || []), ...store.products];

  // Store categories list
  const storeCategories = useMemo(() => {
    const cats = Array.from(new Set(allStoreProducts.map(p => p.category)));
    return cats;
  }, [allStoreProducts]);

  // Filtered store products for in-store search
  const filteredStoreProducts = useMemo(() => {
    return allStoreProducts.filter(p => {
      if (inStoreSearch.trim()) {
        const q = inStoreSearch.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchDesc = p.description?.toLowerCase().includes(q) || false;
        const matchCat = p.category.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchCat) return false;
      }
      if (selectedStoreCategory) {
        if (p.category !== selectedStoreCategory) return false;
      }
      return true;
    });
  }, [allStoreProducts, inStoreSearch, selectedStoreCategory]);

  const storeServices: ServiceItem[] = allStoreProducts
    .filter(p => p.type === 'SERVICE')
    .map(p => ({
      id: p.id,
      name: p.title,
      duration: '45-60 Dk',
      price: p.price
    }));
  const effectiveServices = storeServices.length > 0 ? storeServices : DEFAULT_SERVICES;

  useEffect(() => {
    if (store) {
      applyPageSEO({
        pathname: `/dukkan/${store.slug}`,
        store: {
          name: store.name,
          slug: store.slug,
          legalTitle: store.legalTitle,
          slogan: store.slogan,
          about: store.about,
          avatarUrl: store.avatarUrl,
          bannerUrl: store.bannerUrl,
          phone: store.phone,
          whatsapp: store.whatsapp,
          websiteUrl: store.websiteUrl,
          city: store.city,
          district: store.district,
          fullAddress: store.fullAddress,
          googleMapsUrl: store.googleMapsUrl,
          workingHours: store.workingHours,
          rating: 4.9,
          reviewCount: 145,
          taxOffice: store.taxOffice,
          taxNumber: store.taxNumber
        }
      });
    }
  }, [store]);

  const handleCopyStoreLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleToggleFollow = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowersCount(prev => prev - 1);
    } else {
      setIsFollowing(true);
      setFollowersCount(prev => prev + 1);
    }
  };

  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    setQuestionSent(true);
    setTimeout(() => {
      setQuestionSent(false);
      setShowQuestionModal(false);
      setQuestionText('');
    }, 2500);
  };

  const storeSocialProof = getStoreSocialProof(store.slug || store.id);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">

      {/* Top Floating Bar */}
      <div className="bg-[#0B132B] text-white backdrop-blur-md px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between sticky top-0 z-40 border-b border-[#111B38] text-xs gap-3">
        <button 
          onClick={onBackToMarketplace}
          className="flex items-center gap-1.5 text-slate-300 hover:text-white font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> tampazar.com Ana Vitrine Dön
        </button>

        {/* Quick Merchant Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-slate-400 hidden md:inline text-[11px]">Şeffaf Dükkân Kimliği:</span>
          <select
            value={activeStoreId}
            onChange={(e) => setActiveStoreId(e.target.value)}
            className="bg-[#111B38] border border-slate-700 text-amber-300 rounded-lg px-2.5 py-1 text-xs font-semibold outline-none cursor-pointer"
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
          alt={`${store.name} - TamPazar`}
          className="w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <button 
            onClick={handleCopyStoreLink}
            className="bg-white/90 backdrop-blur-md hover:bg-white text-slate-800 text-xs font-bold px-3 py-2 rounded-xl shadow-md flex items-center gap-1.5 transition cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-[#0F4C3A]" /> Dükkânı Paylaş
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10 space-y-8">
        
        {/* 2. MAĞAZA ÜST BAŞLIK KARTI (Requirement 2: Logosu, Puanı, Rozetleri, Takip ve Soru Butonları) */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200 space-y-6">
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center pb-6 border-b border-slate-100">
            
            {/* Logo + Identity */}
            <div className="flex items-center gap-5">
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-white shrink-0">
                <img
                  src={store.avatarUrl}
                  alt={`${store.name} - TamPazar`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900">{store.name}</h1>
                  
                  {/* Puan Rozeti */}
                  <span className="flex items-center gap-1 text-[11px] font-extrabold bg-amber-50 text-amber-900 px-3 py-1 rounded-full border border-amber-200 shadow-2xs">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{storeSocialProof.ratingScore} / 5.0</span>
                    <span className="text-amber-700 font-normal">({storeSocialProof.reviewCount} Yorum)</span>
                  </span>

                  {/* Doğrulanmış Esnaf Rozeti */}
                  <span className="flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Doğrulanmış Esnaf
                  </span>

                  {/* Doğrudan POS Rozeti */}
                  <span className="flex items-center gap-1 text-[11px] font-bold bg-indigo-50 text-indigo-900 px-3 py-1 rounded-full border border-indigo-200">
                    <CreditCard className="w-3.5 h-3.5 text-indigo-600" /> Doğrudan Sanal POS (%0 Komisyon)
                  </span>

                  {/* TamKurye Hızlı Teslimat Rozeti */}
                  <span className="flex items-center gap-1 text-[11px] font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300">
                    <Truck className="w-3.5 h-3.5 text-amber-700" /> TamKurye (30 Dk)
                  </span>
                </div>

                <p className="text-sm font-medium text-slate-600">{store.slogan}</p>
                
                {/* Legal tax detail line */}
                <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap font-sans">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-semibold text-slate-600">{store.legalTitle}</span>
                  <span>•</span>
                  <span>{store.taxOffice} ({store.taxNumber})</span>
                  <span>•</span>
                  <span className="font-mono text-slate-500">{followersCount} Takipçi</span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS: TAKİP ET & SORU SOR & İLETİŞİM */}
            <div className="flex flex-wrap gap-2.5 w-full lg:w-auto shrink-0">
              
              {/* Takip Et / Takip Ediliyor Button */}
              <button
                onClick={handleToggleFollow}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 font-bold text-xs px-5 py-3 rounded-xl shadow-xs transition cursor-pointer ${
                  isFollowing 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100' 
                    : 'bg-[#0F4C3A] text-white hover:bg-[#0B132B]'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-4 h-4 text-emerald-600" /> Takip Ediliyor
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 text-amber-300" /> Dükkânı Takip Et
                  </>
                )}
              </button>

              {/* Mağazaya Soru Sor Button */}
              <button
                onClick={() => setShowQuestionModal(true)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs px-5 py-3 rounded-xl shadow-xs transition cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" /> Mağazaya Soru Sor
              </button>

              {/* Direct WhatsApp button */}
              <a
                href={`https://wa.me/${store.whatsapp}?text=Merhaba%20tampazar.com%20üzerinden%20dükkânınıza%20ulaştım.`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-xs transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>

            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                <MapPin className="w-4 h-4 text-rose-600" /> Fiziki Dükkân Adresi
              </span>
              <p className="text-slate-600 leading-relaxed truncate">
                {store.fullAddress}, {store.district} / {store.city}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                <Clock className="w-4 h-4 text-amber-600" /> Çalışma Saatleri
              </span>
              <p className="text-slate-600 leading-relaxed truncate">{store.workingHours}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                <Globe className="w-4 h-4 text-sky-600" /> Doğrudan İletişim
              </span>
              <p className="text-slate-600 font-semibold">{store.phone}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-700" /> Komisyonsuz Ödeme
              </span>
              <p className="text-emerald-800 text-[11px] leading-tight">
                256-Bit SSL Doğrudan Esnaf POS Tahsilatı
              </p>
            </div>
          </div>

        </div>

        {/* 3. MAĞAZA İÇİ SEKMELER VE ARAMA BAR (Requirement 2) */}
        <div className="space-y-6">
          
          {/* Navigation Tabs Header */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  activeTab === 'products' 
                    ? 'bg-[#0F4C3A] text-white shadow-xs' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Ürünler & Hizmetler ({allStoreProducts.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('story')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  activeTab === 'story' 
                    ? 'bg-[#0F4C3A] text-white shadow-xs' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Dükkân Hikâyesi & Hakkında</span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  activeTab === 'reviews' 
                    ? 'bg-[#0F4C3A] text-white shadow-xs' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Star className="w-4 h-4 text-amber-400" />
                <span>Müşteri Yorumları ({storeSocialProof.reviewCount})</span>
              </button>

              <button
                onClick={() => setActiveTab('contact')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  activeTab === 'contact' 
                    ? 'bg-[#0F4C3A] text-white shadow-xs' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>Fiziki Konum & İletişim</span>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setShowBookingEngine(!showBookingEngine)}
                className="text-xs font-bold bg-indigo-900 hover:bg-indigo-800 text-white px-3.5 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span>Randevu Al</span>
              </button>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="text-xs font-bold bg-amber-400 hover:bg-amber-500 text-slate-950 px-3.5 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Hızlı İlan Ekle</span>
              </button>
            </div>

          </div>

          {/* TAB 1: PRODUCTS & SERVICES WITH IN-STORE SEARCH */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              {/* In-Store Search Bar & Category Filter Pills */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={inStoreSearch}
                      onChange={(e) => setInStoreSearch(e.target.value)}
                      placeholder={`${store.name} mağazasında ara...`}
                      className="w-full pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 focus:border-[#0F4C3A] focus:bg-white rounded-xl text-xs font-semibold outline-none transition"
                    />
                    {inStoreSearch && (
                      <button 
                        onClick={() => setInStoreSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold overflow-x-auto w-full sm:w-auto">
                    <span className="shrink-0 text-slate-400">Kategori:</span>
                    <button
                      onClick={() => setSelectedStoreCategory(null)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                        selectedStoreCategory === null 
                          ? 'bg-[#0F4C3A] text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Tümü ({allStoreProducts.length})
                    </button>
                    {storeCategories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedStoreCategory(cat)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                          selectedStoreCategory === cat 
                            ? 'bg-[#0F4C3A] text-white' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Collapsible Booking Engine */}
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

              {/* Product Grid */}
              {filteredStoreProducts.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3">
                  <p className="text-sm font-bold text-slate-700">Aramanıza uygun ürün veya hizmet bulunamadı.</p>
                  <button
                    onClick={() => { setInStoreSearch(''); setSelectedStoreCategory(null); }}
                    className="text-xs text-[#0F4C3A] font-bold underline cursor-pointer"
                  >
                    Aramayı Sıfırla
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStoreProducts.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
                    >
                      <div>
                        <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={`${item.title} - TamPazar`} 
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
                            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#0F4C3A] hover:bg-[#0B132B] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <ShoppingBag className="w-4 h-4" /> Doğrudan Satın Al
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB 2: STORE STORY & ABOUT */}
          {activeTab === 'story' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Store className="w-5 h-5 text-[#0F4C3A]" /> Dükkân Hikâyesi & Zanaatkâr Biyografisi
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  TamPazar Açık Dijital AVM şeffaf esnaf kayıtları.
                </p>
              </div>

              <div className="prose prose-slate text-sm leading-relaxed text-slate-700 space-y-4">
                <p>{store.about}</p>
                <p>
                  TamPazar platformu üzerinden yapacağınız siparişlerde ödemeniz hiçbir aracı komisyon kesintisi olmadan doğrudan işletmemizin banka Sanal POS hesabına aktarılır.
                </p>
              </div>

              {/* Legal verification detail */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">GİB & Resmi Sicil Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div><strong className="text-slate-500">Unvan:</strong> {store.legalTitle}</div>
                  <div><strong className="text-slate-500">Vergi Dairesi / No:</strong> {store.taxOffice} ({store.taxNumber})</div>
                  <div><strong className="text-slate-500">Adres:</strong> {store.fullAddress}, {store.district} / {store.city}</div>
                  <div><strong className="text-slate-500">E-Fatura Mükellefi:</strong> Evet (GİB UBL-TR 2.1 Entegre)</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMER REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Müşteri Değerlendirmeleri
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Sadece gerçek alıcılardan alınan doğrulanmış yorumlar.</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900">{storeSocialProof.ratingScore}</span>
                  <span className="text-xs text-slate-400 block">/ 5.0 Değerlendirme</span>
                </div>
              </div>

              {/* Sample Verified Reviews List */}
              <div className="space-y-4 text-xs divide-y divide-slate-100">
                {[
                  { name: 'Ahmet Y.', date: '3 gün önce', comment: 'Ordu merkezde acil su sızıntısı vardı, yarım saatte termal cihazla geldiler. Noktasal bulup hemen tamir ettiler. Çok teşekkürler.', rating: 5 },
                  { name: 'Selin K.', date: '1 hafta önce', comment: 'Kendi Sanal POS’ları üzerinden ödeme yaptım. Faturam e-posta adresime anında düştü, güvenilir esnaf.', rating: 5 },
                  { name: 'Mustafa T.', date: '2 hafta önce', comment: 'Ürün kalitesi mükemmel, kargo paketlemesi özenli yapılmış.', rating: 5 }
                ].map((r, idx) => (
                  <div key={idx} className="pt-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-slate-800">
                        <span>{r.name}</span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">Doğrulanmış Alıcı</span>
                      </div>
                      <span className="text-slate-400 text-[11px]">{r.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-slate-600 leading-relaxed">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CONTACT & LOCATION */}
          {activeTab === 'contact' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-rose-600" /> Fiziki Dükkân Konumu & İletişim
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                <div className="space-y-4">
                  <div>
                    <strong className="block text-slate-900 font-extrabold text-sm mb-1">Açık Adres</strong>
                    <p className="text-slate-600 leading-relaxed">{store.fullAddress}, {store.district} / {store.city}</p>
                  </div>

                  <div>
                    <strong className="block text-slate-900 font-extrabold text-sm mb-1">Çalışma Saatleri</strong>
                    <p className="text-slate-600">{store.workingHours}</p>
                  </div>

                  <div>
                    <strong className="block text-slate-900 font-extrabold text-sm mb-1">Telefon & WhatsApp</strong>
                    <p className="text-slate-600 font-semibold">{store.phone} · WhatsApp: +{store.whatsapp}</p>
                  </div>

                  <a
                    href={store.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-[#0F4C3A] text-white font-bold rounded-xl shadow-xs hover:bg-[#0B132B] transition cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 text-amber-300" /> Google Maps'te Yol Tarifi Al ↗
                  </a>
                </div>

                <div className="h-64 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden relative flex items-center justify-center text-slate-400">
                  <div className="text-center space-y-2 p-6">
                    <MapPin className="w-8 h-8 text-rose-600 mx-auto" />
                    <p className="font-bold text-slate-700">{store.fullAddress}</p>
                    <p className="text-[11px] text-slate-500">{store.district} / {store.city}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* MAĞAZAYA SORU SOR MODAL DRAWER */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 relative">
            
            <button
              onClick={() => setShowQuestionModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">{store.name} Mağazasına Soru Sor</h3>
                <p className="text-xs text-slate-500">Doğrudan dükkân sahibine veya yetkili ustaya iletilir.</p>
              </div>
            </div>

            {questionSent ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-6 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-extrabold text-sm">Sorunuz Başarıyla İletildi!</h4>
                <p className="text-xs text-emerald-800">
                  Mağaza yetkilisi sorunuzu inceleyip en kısa sürede bildirimleriniz üzerinden yanıtlayacaktır.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendQuestion} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Soru Konusu</label>
                  <select
                    value={questionSubject}
                    onChange={(e) => setQuestionSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Ürün ve Hizmet Bilgisi">Ürün ve Hizmet Bilgisi</option>
                    <option value="Özel Ölçü ve Fiyat Teklifi">Özel Ölçü ve Fiyat Teklifi</option>
                    <option value="Stok ve Teslimat Süresi">Stok ve Teslimat Süresi</option>
                    <option value="Yerinde Usta / Keşif Randevusu">Yerinde Usta / Keşif Randevusu</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sorunuz / Mesajınız</label>
                  <textarea
                    rows={4}
                    required
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Merak ettiğiniz tüm detayları buraya yazabilirsiniz..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium outline-none focus:border-[#0F4C3A]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#0F4C3A] hover:bg-[#0B132B] text-white font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 text-amber-300" /> Soruyu İlet
                  </button>
                  <a
                    href={`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(`Merhaba, ${questionSubject} hakkında bilgi almak istiyorum.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
