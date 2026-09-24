/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Utensils, Wrench, Truck, ShoppingBag, 
  MapPin, Phone, MessageCircle, Clock, ShieldCheck, Search, Zap,
  Star, CheckCircle2, ArrowRight, X, AlertCircle, Sparkles, Navigation, ChevronRight, Calendar, Layers,
  LocateFixed, ArrowUpDown, RefreshCw, Send, Check, Download, Video, FileCode
} from 'lucide-react';
import UniversalProductCard, { UniversalCardData } from './UniversalProductCard';
import BrandLogo from './BrandLogo';
import GlobalUserNav from './GlobalUserNav';
import { 
  calculateDistance, 
  formatDistance, 
  DEFAULT_USER_LOCATION, 
  PRESET_LOCATIONS, 
  UserLocation 
} from '../utils/geolocation';
import { applyPageSEO } from '../utils/seo';

export const SAMPLE_PRODUCTS: UniversalCardData[] = [
  // 1. Tesisat / Hizmet Kartı
  {
    id: 'p1',
    slug: 'termal-su-kacagi-tespiti',
    sector: 'SERVICE',
    title: 'Termal Cihazla Kırmadan Su Kaçağı Tespiti + Resmi Rapor',
    category: 'Sıhhi Tesisat',
    image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800',
    price: 1200,
    vatRate: 20,
    serviceDuration: '45-60 Dk',
    lat: 40.9740,
    lng: 37.8920,
    store: {
      name: 'Kuzey Teknik Tesisat',
      slug: 'kuzey-teknik',
      district: 'Altınordu',
      city: 'Ordu',
      phone: '+904522220000',
      whatsapp: '905320000000',
      rating: 4.9,
      reviewCount: 48,
      paymentProvider: 'Doğrudan PayTR',
      isPhysicalVerified: true,
    }
  },
  // 2. Acil Oto Çekici Kartı
  {
    id: 'p2',
    slug: '7-24-acil-oto-kurtarma',
    sector: 'EMERGENCY',
    title: '7/24 Şehir İçi ve Şehirler Arası Acil Oto Kurtarma & Çekici',
    category: 'Yol Yardım',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800',
    price: 1500,
    vatRate: 20,
    etaMinutes: '15 Dk Varış',
    isEmergency247: true,
    lat: 40.9780,
    lng: 37.8890,
    store: {
      name: 'Özdemir Oto Kurtarma',
      slug: 'ozdemir-cekici',
      district: 'Merkez',
      city: 'Ordu',
      phone: '+905321112233',
      whatsapp: '905321112233',
      rating: 5.0,
      reviewCount: 112,
      paymentProvider: 'Kendi Sanal POS',
      isPhysicalVerified: true,
    }
  },
  // 3. Toptan (B2B) Hırdavat / Malzeme Kartı
  {
    id: 'p3',
    slug: 'pirinc-kuresel-vana-toptan',
    sector: 'WHOLESALE',
    title: 'Pirinç Küresel Su Vanası 1/2 PN25 (Koli İçi 50 Adet)',
    category: 'Toptan Malzeme',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
    price: 140,
    vatRate: 20,
    minOrderQty: 10,
    wholesaleTiers: [
      { minQty: 50, unitPrice: 115 },
      { minQty: 200, unitPrice: 95 }
    ],
    lat: 40.9680,
    lng: 37.9020,
    store: {
      name: 'Mega Endüstriyel Toptan',
      slug: 'mega-endustriyel',
      district: 'Sanayi',
      city: 'Ordu',
      phone: '+904523334455',
      whatsapp: '905334445566',
      rating: 4.8,
      reviewCount: 35,
      paymentProvider: 'Doğrudan iyzico',
      isPhysicalVerified: true,
    }
  },
  // 4. Sıcak Döner / Yemek Kartı
  {
    id: 'p4',
    slug: 'odun-atesinde-et-doner-menu',
    sector: 'FOOD',
    title: 'Odun Ateşinde Yaprak Et Döner Dürüm Menü (Patates + Ayran)',
    category: 'Yeme & İçme',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800',
    price: 240,
    vatRate: 10,
    etaMinutes: '20-30 Dk',
    lat: 40.9865,
    lng: 37.8795,
    store: {
      name: 'Tarihi Karadeniz Dönercisi',
      slug: 'tarihi-karadeniz-doner',
      district: 'Altınordu',
      city: 'Ordu',
      phone: '+904525556677',
      whatsapp: '905356667788',
      rating: 4.7,
      reviewCount: 280,
      paymentProvider: 'Kendi Sanal POS',
      isPhysicalVerified: true,
    }
  },
  // 5. Acil Nöbetçi Çilingir & Anahtarcı
  {
    id: 'p5',
    slug: '7-24-acil-nobetci-cilingir',
    sector: 'EMERGENCY',
    title: '7/24 Nöbetçi Çilingir, Çelik Kapı & Oto Kapısı Açma',
    category: 'Acil Kilit & Kapı',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800',
    price: 600,
    vatRate: 20,
    etaMinutes: '10 Dk Varış',
    isEmergency247: true,
    lat: 40.9850,
    lng: 37.8755,
    store: {
      name: 'Karadeniz Çilingir & Anahtar',
      slug: 'karadeniz-cilingir',
      district: 'Cumhuriyet Meydanı',
      city: 'Ordu',
      phone: '+905329998877',
      whatsapp: '905329998877',
      rating: 4.9,
      reviewCount: 89,
      paymentProvider: 'Kendi Mobil POS',
      isPhysicalVerified: true,
    }
  },
  // 6. Nöbetçi Elektrik Arıza & Keşif
  {
    id: 'p6',
    slug: 'acil-elektrik-ariza-sigorta-degisimi',
    sector: 'SERVICE',
    title: 'Acil Elektrik Arıza, Kısa Devre & Kaçak Akım Rölesi Değişimi',
    category: 'Elektrik & Tesisat',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800',
    price: 750,
    vatRate: 20,
    serviceDuration: '30-45 Dk',
    lat: 40.9835,
    lng: 37.8780,
    store: {
      name: 'Güven Elektrik & Otomasyon',
      slug: 'guven-elektrik',
      district: 'Altınordu',
      city: 'Ordu',
      phone: '+905441234567',
      whatsapp: '905441234567',
      rating: 4.8,
      reviewCount: 64,
      paymentProvider: 'Doğrudan PayTR',
      isPhysicalVerified: true,
    }
  },
  // 7. TamDijital - Nakış Deseni & Tasarım Dosyası (TamDijital Anında Dosya İndirme)
  {
    id: 'dig-prod-101',
    slug: 'maras-isi-cicekli-nakis-deseni-paketi',
    sector: 'DIGITAL',
    title: 'Geleneksel Maraş İşi Çiçekli Nakış Deseni Paketi (DST, PES, JEF)',
    category: 'Dijital Tasarım & Nakış',
    image: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=800',
    price: 380,
    vatRate: 20,
    deliveryType: 'digital_download',
    digitalFormats: ['DST', 'PES', 'JEF', 'EXP', 'PDF'],
    store: {
      name: 'Atölye Zanaat',
      slug: 'atolye-zanaat',
      district: 'Tasarım Atölyesi',
      city: 'İstanbul',
      phone: '+905330001122',
      whatsapp: '905330001122',
      rating: 4.9,
      reviewCount: 420,
      paymentProvider: 'Doğrudan iyzico POS',
      isPhysicalVerified: true,
    }
  },
  // 8. TamSeans - Canlı Danışmanlık (Superpeer/Calendly Modeli)
  {
    id: 'sns-prod-201',
    slug: 'bireysel-kariyer-eticaret-danismanligi',
    sector: 'CONSULTATION',
    title: 'Bireysel Kariyer & E-Ticaret İşletme Danışmanlığı (45 Dk)',
    category: 'Online Danışmanlık',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800',
    price: 1250,
    vatRate: 20,
    deliveryType: 'online_session',
    sessionDurationMin: 45,
    store: {
      name: 'FotoSentez Danışmanlık',
      slug: 'fotosentez-studyo',
      district: 'Uzaktan Görüşme',
      city: 'Google Meet HD',
      phone: '+905321112233',
      whatsapp: '905321112233',
      rating: 5.0,
      reviewCount: 64,
      paymentProvider: 'Doğrudan PayTR POS',
      isPhysicalVerified: true,
    }
  }
];

interface SuperMallHomeProps {
  onNavigateToStore?: (storeId: string) => void;
  onNavigateToProduct?: (slug: string) => void;
  onOpenSaaSConsole?: (tab?: string) => void;
  onBackToMarketplace?: () => void;
}

export const SUPER_MALL_SECTORS = [
  { id: 'all', name: 'Tüm Sektörler', icon: Sparkles, desc: 'Şehrin tüm esnaf ve işletmeleri', count: '2.095 İşletme' },
  { id: 'retail', name: 'Alışveriş & Mağazalar', icon: ShoppingBag, desc: 'Ayakkabı, Giyim, Mobilya, Tasarım', count: '1.420 Dükkân' },
  { id: 'digital', name: 'TamDijital (Dosya İndir)', icon: Download, desc: 'Nakış DST, Lazer DXF, 3D STL, E-Kitap', count: '540 Dosya' },
  { id: 'session', name: 'TamSeans (Canlı Seans)', icon: Video, desc: 'Online Psikolog, Seans & Özel Ders', count: '180 Uzman' },
  { id: 'food', name: 'Yeme & İçme (Sıcak Paket)', icon: Utensils, desc: 'Döner, Kebap, Fırın, Kafe & Tatlı', count: '380 İşletme' },
  { id: 'service', name: 'Usta & Tesisat Hizmeti', icon: Wrench, desc: 'Su Tesisatı, Boya, Elektrik, Keşif', count: '210 Esnaf' },
  { id: 'emergency', name: 'Acil Çekici & Yol Yardım', icon: Truck, desc: '7/24 Konuma En Yakın Nöbetçi Çekici', count: '85 Araç' },
];

export const LIVE_BUSINESSES = [
  // 1. Kundura Dünyası (Çok Yakın - Çarşı)
  {
    id: 'b4',
    storeId: 'tenant-1',
    name: 'Kundura Dünyası (Mert Kundura)',
    legalTitle: 'Mert Kundura San. ve Ayakkabıcılık',
    sector: 'retail',
    badge: 'Aynı Gün Ücretsiz Kargo',
    rating: 4.7,
    reviews: 215,
    eta: 'Tüm Türkiye Kargo / Gel-Al',
    phone: '+904523330000',
    whatsapp: '905321110099',
    address: 'Çarşı Cad. No:8, Altınordu',
    city: 'Ordu',
    popularItem: 'Hakiki Deri Erkek Klasik Ayakkabı',
    price: 1850,
    actionText: 'Satın Al / İncele',
    actionColor: 'bg-slate-900 hover:bg-indigo-950',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80',
    posProvider: 'PayTR Doğrudan POS',
    lat: 40.9845,
    lng: 37.8775,
    dispatchAvailable: false
  },
  // 2. Acil Nöbetçi Çilingir
  {
    id: 'b7',
    storeId: 'st-107',
    name: 'Karadeniz Çilingir & Acil Anahtar',
    legalTitle: 'Karadeniz Kilit Güvenlik Sistemleri',
    sector: 'emergency',
    badge: '10 Dk İçinde Kapınızda',
    rating: 4.9,
    reviews: 89,
    eta: '7/24 Nöbetçi Çilingir',
    phone: '+905329998877',
    whatsapp: '905329998877',
    address: 'Cumhuriyet Meydanı No:3, Altınordu',
    city: 'Ordu',
    popularItem: 'Hasarsız Çelik Kapı & Kilit Açma',
    price: 600,
    actionText: 'Hemen Konuma Çağır',
    actionColor: 'bg-rose-600 hover:bg-rose-700',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80',
    posProvider: 'Kendi Mobil POS',
    lat: 40.9850,
    lng: 37.8755,
    dispatchAvailable: true
  },
  // 3. Dönerci (Sıcak Satış)
  {
    id: 'b1',
    storeId: 'st-102',
    name: 'Tarihi Karadeniz Dönercisi',
    legalTitle: 'Karadeniz Lezzetleri Gıda Ltd. Şti.',
    sector: 'food',
    badge: 'Gel-Al & Hızlı Paket',
    rating: 4.8,
    reviews: 412,
    eta: '25-35 dk',
    phone: '+904522220000',
    whatsapp: '905322220000',
    address: 'Atatürk Bulvarı No:14, Altınordu',
    city: 'Ordu',
    popularItem: 'Et Döner Dürüm Menü (Ayran + Patates)',
    price: 240,
    actionText: 'Sipariş Ver (BYO POS)',
    actionColor: 'bg-amber-600 hover:bg-amber-700',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
    posProvider: 'PayTR Hızlı Ödeme',
    lat: 40.9865,
    lng: 37.8795,
    dispatchAvailable: true
  },
  // 4. FotoSentez Stüdyo (Prodüksiyon)
  {
    id: 'b6',
    storeId: 's3',
    name: 'FotoSentez Stüdyo',
    legalTitle: 'FotoSentez Prodüksiyon ve Medya Hizmetleri Ltd.',
    sector: 'service',
    badge: '4K E-Ticaret Ürün Çekimi',
    rating: 5.0,
    reviews: 88,
    eta: 'Aynı Gün Teslimat Seansı',
    phone: '+904528889900',
    whatsapp: '905307778899',
    address: 'Sahil Kordon Sanat Sokağı No: 88, Altınordu',
    city: 'Ordu',
    popularItem: 'Kurumsal Ürün ve Katalog Fotoğraf Çekimi',
    price: 4500,
    actionText: 'Stüdyo Randevusu Al',
    actionColor: 'bg-sky-600 hover:bg-sky-700',
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&auto=format&fit=crop&q=80',
    posProvider: 'Sipay Gateway',
    lat: 40.9910,
    lng: 37.8730,
    dispatchAvailable: false
  },
  // 5. Acil Oto Çekici (Lokasyon & Çağrı)
  {
    id: 'b2',
    storeId: 'st-103',
    name: 'Özdemir 7/24 Oto Kurtarma & Çekici',
    legalTitle: 'Özdemir Vinç ve Yol Yardım San. Tic.',
    sector: 'emergency',
    badge: '15 Dk İçinde Olay Yerinde',
    rating: 5.0,
    reviews: 189,
    eta: '7/24 Nöbetçi Çekici',
    phone: '+905321110000',
    whatsapp: '905321110000',
    address: 'Çevre Yolu Bağlantısı Sanayi Çıkışı',
    city: 'Ordu',
    popularItem: 'Şehir İçi Sabit Çekici Ücreti',
    price: 1500,
    actionText: 'Hemen Konuma Çağır',
    actionColor: 'bg-rose-600 hover:bg-rose-700',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80',
    posProvider: 'iyzico Mobil POS',
    lat: 40.9780,
    lng: 37.8890,
    dispatchAvailable: true
  },
  // 6. Sıhhi Tesisatçı (Hizmet & Randevu)
  {
    id: 'b3',
    storeId: 'st-104',
    name: 'Usta Teknik Sıhhi Tesisat',
    legalTitle: 'Usta Teknik Mühendislik ve Tesisat',
    sector: 'service',
    badge: 'Termal Cihazla Su Kaçağı Tespiti',
    rating: 4.9,
    reviews: 96,
    eta: 'Bugün Randevu Uygun',
    phone: '+905442220000',
    whatsapp: '905442220000',
    address: 'Sanayi Sitesi C Blok No: 18',
    city: 'Ordu',
    popularItem: 'Noktasal Kaçak Tespiti + Resmi Rapor',
    price: 950,
    actionText: 'Konuma Çağır / Randevu',
    actionColor: 'bg-blue-600 hover:bg-blue-700',
    image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80',
    posProvider: 'Sipay Gateway',
    lat: 40.9740,
    lng: 37.8920,
    dispatchAvailable: true
  },
  // 7. Kuzey Ahşap (Masif Mobilya)
  {
    id: 'b5',
    storeId: 'st-101',
    name: 'Kuzey Ahşap & Mobilya Tasarım',
    legalTitle: 'Kuzey Ahşap Sanayi ve Ticaret Ltd. Şti.',
    sector: 'retail',
    badge: 'El İşçiliği Masif Meşe',
    rating: 4.9,
    reviews: 128,
    eta: 'Atölye Ziyareti Açık',
    phone: '+904522230000',
    whatsapp: '905320000000',
    address: 'Sanayi Mah. Marangozlar Sitesi No: 42',
    city: 'Ordu',
    popularItem: 'Doğal Kenar Meşe Kütük Yemek Masası',
    price: 14850,
    actionText: 'Atölyeyi Gör / Satın Al',
    actionColor: 'bg-emerald-700 hover:bg-emerald-800',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&auto=format&fit=crop&q=80',
    posProvider: 'PayTR Kurumsal POS',
    lat: 40.9710,
    lng: 37.8960,
    dispatchAvailable: false
  }
];

export default function SuperMallHome({ 
  onNavigateToStore, 
  onNavigateToProduct,
  onOpenSaaSConsole, 
  onBackToMarketplace 
}: SuperMallHomeProps) {
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'reviews' | 'price_asc'>('distance');
  
  // Geolocation State
  const [userLocation, setUserLocation] = useState<UserLocation>(() => {
    try {
      const saved = localStorage.getItem('tampazar_user_coords');
      return saved ? JSON.parse(saved) : DEFAULT_USER_LOCATION;
    } catch {
      return DEFAULT_USER_LOCATION;
    }
  });
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'granted' | 'denied' | 'unsupported'>('idle');
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Dispatch / Location Call Modal State
  const [dispatchModalItem, setDispatchModalItem] = useState<{
    title: string;
    storeName: string;
    phone: string;
    whatsapp: string;
    price: number;
    badge: string;
    distanceKm: number;
    eta: string;
    sector: string;
  } | null>(null);

  const [dispatchAddressInput, setDispatchAddressInput] = useState('');
  const [dispatchNoteInput, setDispatchNoteInput] = useState('');
  const [dispatchPhoneInput, setDispatchPhoneInput] = useState('');
  const [dispatchConfirmed, setDispatchConfirmed] = useState(false);

  // Geolocation detector on mount & SEO enjeksiyonu
  useEffect(() => {
    requestBrowserLocation();
    applyPageSEO({
      pathname: '/sehir-avm',
      title: "Şehrin Açık Dijital AVM'si - Konuma En Yakın Esnaf, Usta & Dönerci | TamPazar",
      description: "Fiziksel çarşıların ve mahalle esnafının dijital buluşma noktası. Konumuna en yakın tesisatçı, nöbetçi çekici, çilingir, dönerci ve zanaatkârlar bir arada.",
      collectionItems: SAMPLE_PRODUCTS.map(p => ({
        name: p.title,
        url: `/urun/${p.slug}`,
        image: p.image,
        price: p.price
      }))
    });
  }, []);

  const requestBrowserLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('unsupported');
      return;
    }

    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const detectedLocation: UserLocation = {
          lat: latitude,
          lng: longitude,
          city: 'Ordu',
          district: 'Mevcut Konumunuz',
          label: `GPS Konumunuz (±${Math.round(accuracy)}m)`,
          source: 'gps',
          accuracy
        };
        setUserLocation(detectedLocation);
        setLocationStatus('granted');
        try {
          localStorage.setItem('tampazar_user_coords', JSON.stringify(detectedLocation));
        } catch (e) {}
      },
      (error) => {
        console.warn('Geolocation permission error:', error.message);
        setLocationStatus('denied');
        // Fallback without locking
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  };

  const handleSelectPresetLocation = (preset: UserLocation) => {
    setUserLocation(preset);
    setLocationStatus('granted');
    setShowLocationPicker(false);
    try {
      localStorage.setItem('tampazar_user_coords', JSON.stringify(preset));
    } catch (e) {}
  };

  // Calculate distances and sort businesses
  const businessesWithDistance = LIVE_BUSINESSES.map(b => {
    const dist = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
    return {
      ...b,
      distanceKm: dist,
      distanceFormatted: formatDistance(dist)
    };
  });

  const filteredBusinesses = businessesWithDistance
    .filter(b => {
      const matchesSector = selectedSector === 'all' || b.sector === selectedSector;
      const matchesQuery = searchQuery === '' || 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.popularItem.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.badge.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSector && matchesQuery;
    })
    .sort((a, b) => {
      if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviews - a.reviews;
      if (sortBy === 'price_asc') return a.price - b.price;
      return 0;
    });

  // Calculate distances for SAMPLE_PRODUCTS & filter by sector
  const productsWithDistance = SAMPLE_PRODUCTS
    .filter(p => {
      if (selectedSector === 'all') return true;
      if (selectedSector === 'digital') return p.sector === 'DIGITAL' || p.deliveryType === 'digital_download';
      if (selectedSector === 'session') return p.sector === 'CONSULTATION' || p.deliveryType === 'online_session';
      if (selectedSector === 'retail') return p.sector === 'RETAIL' || p.sector === 'WHOLESALE';
      if (selectedSector === 'food') return p.sector === 'FOOD';
      if (selectedSector === 'service') return p.sector === 'SERVICE';
      if (selectedSector === 'emergency') return p.sector === 'EMERGENCY';
      return true;
    })
    .map(p => {
      const dist = calculateDistance(userLocation.lat, userLocation.lng, p.lat || DEFAULT_USER_LOCATION.lat, p.lng || DEFAULT_USER_LOCATION.lng);
      return {
        ...p,
        distanceKm: dist
      };
    }).sort((a, b) => {
      if (sortBy === 'distance') return (a.distanceKm || 0) - (b.distanceKm || 0);
      return 0;
    });

  // Open Dispatch Modal
  const openDispatchModal = (item: {
    title: string;
    storeName: string;
    phone: string;
    whatsapp: string;
    price: number;
    badge: string;
    distanceKm: number;
    eta?: string;
    sector: string;
  }) => {
    const calculatedEta = item.eta || `${Math.max(10, Math.round(item.distanceKm * 6))}-${Math.max(15, Math.round(item.distanceKm * 10))} Dk Varış`;
    setDispatchModalItem({
      ...item,
      eta: calculatedEta
    });
    setDispatchAddressInput(`${userLocation.label} yakını, Açık Adres / Cadde Sokak`);
    setDispatchPhoneInput('+90 ');
    setDispatchNoteInput('');
    setDispatchConfirmed(false);
  };

  const handleExecuteDispatch = () => {
    if (!dispatchModalItem) return;

    // Simulate instant dispatch & GİB invoice creation
    const saved = localStorage.getItem('tampazar_invoices');
    const invoices = saved ? JSON.parse(saved) : [];
    
    const vat = parseFloat((dispatchModalItem.price * 0.20).toFixed(2));
    const clean = parseFloat((dispatchModalItem.price - vat).toFixed(2));

    invoices.push({
      id: 'inv-' + Math.floor(Math.random() * 1000000),
      invoiceNumber: 'GIB2026000000' + Math.floor(100 + Math.random() * 899),
      orderId: 'cagri-' + Math.floor(Math.random() * 100000),
      tenantId: 'tenant-1',
      customerName: 'Konuma Çağrı Müşterisi (' + userLocation.label + ')',
      customerTaxOffice: 'Altınordu VD',
      customerTaxId: '1192019482',
      customerEmail: 'musteri@tampazar.com',
      date: new Date().toISOString().split('T')[0],
      amount: clean,
      vatAmount: vat,
      withholdingTaxType: 'None',
      withholdingAmount: 0.00,
      totalPayable: dispatchModalItem.price,
      status: 'queued',
      integrator: 'gib'
    });

    localStorage.setItem('tampazar_invoices', JSON.stringify(invoices));
    window.dispatchEvent(new Event('tampazar_accounting_updated'));
    window.dispatchEvent(new Event('tampazar_invoice_added'));

    setDispatchConfirmed(true);
    setTimeout(() => {
      setDispatchModalItem(null);
      setDispatchConfirmed(false);
    }, 3200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      
      {/* 0. ÜST HEADER */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <BrandLogo size="md" onClick={onBackToMarketplace} />
            <button
              onClick={onBackToMarketplace}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition flex items-center gap-1 cursor-pointer"
            >
              ← Vitrine Dön
            </button>
          </div>
          <div className="flex items-center gap-3">
            <GlobalUserNav />
          </div>
        </div>
      </header>
      
      {/* 1. ÜST AKILLI KONUM VE MESAFE ÇUBUĞU (GEOLOCATION BAR) */}
      <div className="bg-slate-950 text-white border-b border-slate-800 py-2.5 px-4 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative" />
            </div>

            <div className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-slate-400">Konumunuz:</span>
              <strong className="text-white bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
                {locationStatus === 'loading' ? 'Konumunuz Alınıyor...' : userLocation.label}
              </strong>
              {userLocation.source === 'gps' && (
                <span className="bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded text-[10px] border border-emerald-500/30">
                  GPS Aktif
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={requestBrowserLocation}
              disabled={locationStatus === 'loading'}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition cursor-pointer shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${locationStatus === 'loading' ? 'animate-spin' : ''}`} />
              <span>Yeniden Konum Belirle</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowLocationPicker(!showLocationPicker)}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 transition cursor-pointer"
              >
                <LocateFixed className="w-3 h-3 text-amber-400" />
                <span>Bölge Seç</span>
              </button>

              {showLocationPicker && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-fade-in space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 block">
                    Ön Tanımlı Esnaf Bölgeleri:
                  </span>
                  {PRESET_LOCATIONS.map((loc, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectPresetLocation(loc)}
                      className="w-full text-left px-3 py-2 text-xs font-bold rounded-xl hover:bg-slate-100 flex items-center justify-between transition cursor-pointer"
                    >
                      <span>{loc.label}</span>
                      {userLocation.label === loc.label && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 2. ÜST BİLGİ & SEKTÖR SEÇİCİ */}
      <section className="bg-slate-900 text-white pt-10 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400 bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/20">
              Şehrin Komisyonsuz Açık Dijital AVM'si
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Dönerciden Çekiciye, Ayakkabıdan Tesisatçıya.<br />
            <span className="text-amber-400">Konumuna En Yakın Esnaftan, Aracısız & Komisyonsuz.</span>
          </h1>

          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Bulunduğunuz konuma göre en yakın usta, nöbetçi oto çekici ve yerel esnaflar otomatik olarak en yakından uzağa sıralanır. Doğrudan arayabilir veya tek tıkla konumunuza çağırabilirsiniz.
          </p>

          {/* Hızlı Arama */}
          <div className="max-w-2xl mx-auto pt-4">
            <div className="flex bg-white rounded-2xl p-1.5 shadow-2xl items-center border border-slate-700/50">
              <MapPin className="w-5 h-5 text-indigo-600 ml-3 shrink-0" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ne arıyorsunuz? (Örn: Çekici, 42 numara bot, su tesisatı, yarım ekmek döner...)" 
                className="w-full px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-slate-600 mr-1 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors shrink-0 shadow-xs cursor-pointer">
                Bul & Getir
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SÜPER AVM KORİDORLARI (SEKTÖR KARTLARI) */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          {SUPER_MALL_SECTORS.map((s) => {
            const Icon = s.icon;
            const isSelected = selectedSector === s.id;
            return (
              <div 
                key={s.id} 
                onClick={() => setSelectedSector(s.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-white border-indigo-600 ring-2 ring-indigo-600/20 shadow-md transform -translate-y-1' 
                    : 'bg-white/95 backdrop-blur-xs border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
                }`}
              >
                <div>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-xs text-slate-900">{s.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{s.desc}</p>
                </div>
                <span className={`text-[10px] font-bold block mt-2.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {s.count}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. EVRENSEL ÜRÜN & HİZMET KARTLARI (AKILLI MESAFE ROZETLİ) */}
      <section className="max-w-7xl mx-auto px-4 pt-12 pb-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Konuma Göre Önerilen Yerel Hizmet & Ürünler
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Bulunduğunuz noktaya ({userLocation.label}) kuş uçuşu mesafeye göre sıralanmıştır
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-200 flex items-center gap-1.5 self-start sm:self-auto">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Akıllı Haversine Mesafe Motoru Aktif
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productsWithDistance.map((prod) => (
            <UniversalProductCard 
              key={prod.id} 
              data={prod} 
              onNavigateToProduct={onNavigateToProduct}
              userLocationLabel={userLocation.label}
              onCallLocationDispatch={(cardData) => {
                openDispatchModal({
                  title: cardData.title,
                  storeName: cardData.store.name,
                  phone: cardData.store.phone,
                  whatsapp: cardData.store.whatsapp,
                  price: cardData.price,
                  badge: cardData.store.paymentProvider,
                  distanceKm: cardData.distanceKm || 1.2,
                  eta: cardData.etaMinutes,
                  sector: cardData.sector
                });
              }}
            />
          ))}
        </div>
      </section>

      {/* 5. CANLI DÜKKÂNLAR VE KONUM TABANLI AKSİYON VİTRİNİ */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* Kontrol & Sıralama Barı */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              {selectedSector === 'all' ? 'Canlı Esnaf & Hizmet Vitrini' : `${SUPER_MALL_SECTORS.find(s => s.id === selectedSector)?.name}`}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Toplam {filteredBusinesses.length} dükkân listeleniyor.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sıralama:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl outline-none cursor-pointer hover:bg-slate-100 transition"
            >
              <option value="distance">📍 En Yakın Esnaf (Önce Yakındakiler)</option>
              <option value="rating">⭐ En Yüksek Puan</option>
              <option value="reviews">💬 En Çok Değerlendirilen</option>
              <option value="price_asc">💰 Fiyata Göre (En Düşük)</option>
            </select>
          </div>
        </div>

        {/* Dükkân Kartları Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBusinesses.map((b) => {
            const waLocationMessage = encodeURIComponent(
              `Merhaba ${b.name}, tampazar.com üzerinden ${b.popularItem} için acil çağrı oluşturmak istiyorum. Konumum: ${userLocation.label} (Koordinat: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}). Lütfen en kısa sürede dönüş yapın.`
            );

            return (
              <div 
                key={b.id} 
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between group hover:shadow-xl transition-all duration-300"
              >
                <div>
                  {/* Görsel ve Rozetler */}
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img 
                      src={b.image} 
                      alt={`${b.name} - TamPazar`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    
                    {/* Mesafe Rozeti (Yeşil) */}
                    <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 backdrop-blur-xs">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{b.distanceFormatted.badge}</span>
                    </div>

                    <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-950/80 text-white backdrop-blur-xs">
                      {b.badge}
                    </span>

                    <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-xs text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-xs flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{b.rating} ({b.reviews})</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h3 
                        onClick={() => onNavigateToStore?.(b.storeId)}
                        className="font-bold text-slate-900 text-sm leading-tight hover:text-indigo-600 transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <span>{b.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </h3>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{b.legalTitle}</p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{b.eta}</span>
                      <span>•</span>
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{b.address}</span>
                    </div>

                    {/* Öne Çıkan Ürün / Hizmet */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Sabit Servis / Ürün:</span>
                      <span className="text-xs font-bold text-slate-800 block truncate">{b.popularItem}</span>
                      <div className="flex items-baseline justify-between pt-1">
                        <span className="text-base font-black text-indigo-950">
                          {b.price.toLocaleString('tr-TR')} ₺
                        </span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold border border-emerald-200">
                          {b.posProvider}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* HIZLI AKSİYONLAR (ARMUT / ACİL SERVİS MOTORU) */}
                <div className="p-4 pt-0 space-y-2">
                  <div className="flex gap-2">
                    <a 
                      href={`tel:${b.phone}`} 
                      className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" /> Hemen Ara
                    </a>
                    <a 
                      href={`https://wa.me/${b.whatsapp}?text=${waLocationMessage}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-200 transition cursor-pointer"
                      title="WhatsApp ile Konum Bilgini Gönder"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Konum At
                    </a>
                  </div>

                  <button 
                    onClick={() => {
                      openDispatchModal({
                        title: b.popularItem,
                        storeName: b.name,
                        phone: b.phone,
                        whatsapp: b.whatsapp,
                        price: b.price,
                        badge: b.badge,
                        distanceKm: b.distanceKm,
                        eta: b.eta,
                        sector: b.sector
                      });
                    }}
                    className={`w-full py-3 rounded-xl text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${b.actionColor}`}
                  >
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    <span>Konuma Çağır ({b.distanceFormatted.text})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredBusinesses.length === 0 && (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <Search className="w-10 h-10 mx-auto text-slate-300" />
            <h3 className="font-bold text-slate-700 text-base">Aramanıza uygun esnaf veya hizmet bulunamadı</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Farklı bir anahtar kelime deneyebilir veya sektör filtrelerini temizleyebilirsiniz.
            </p>
            <button 
              onClick={() => { setSelectedSector('all'); setSearchQuery(''); }}
              className="px-4 py-2 bg-indigo-900 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Tüm Esnafları Göster
            </button>
          </div>
        )}
      </main>

      {/* 6. İNTERAKTİF KONUMA ÇAĞIR / DISPATCH MODALI */}
      {dispatchModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 p-6 space-y-5">
            
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider">
                  📍 Konuma Doğrudan Çağrı
                </span>
                <h3 className="font-black text-slate-900 text-base mt-1">{dispatchModalItem.storeName}</h3>
                <p className="text-xs text-slate-500">{dispatchModalItem.title}</p>
              </div>
              <button 
                onClick={() => setDispatchModalItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tahmini Varış ve Mesafe Bilgisi */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">KUŞ UÇUŞU MESAFE</span>
                <span className="text-sm font-black text-emerald-700 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {dispatchModalItem.distanceKm} km yakınında
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold block">TAHMİNİ VARIŞ SÜRESİ</span>
                <span className="text-sm font-black text-indigo-950 flex items-center gap-1 justify-end">
                  <Clock className="w-3.5 h-3.5 text-amber-500" /> {dispatchModalItem.eta}
                </span>
              </div>
            </div>

            {/* Konum ve Form Alanları */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Çağrı Konumunuz:</label>
                <input 
                  type="text" 
                  value={dispatchAddressInput}
                  onChange={(e) => setDispatchAddressInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Telefon Numaranız (Ustanın Araması İçin):</label>
                <input 
                  type="tel" 
                  value={dispatchPhoneInput}
                  onChange={(e) => setDispatchPhoneInput(e.target.value)}
                  placeholder="+90 5XX XXX XX XX"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Durum / Arıza Notu (İsteğe Bağlı):</label>
                <textarea 
                  rows={2}
                  value={dispatchNoteInput}
                  onChange={(e) => setDispatchNoteInput(e.target.value)}
                  placeholder="Örn: Su sayacının altından sızıntı var, acil yardım gerekiyor..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium resize-none"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Sabit Servis Ücreti:</span>
              <span className="text-xl font-black text-slate-900">{dispatchModalItem.price.toLocaleString('tr-TR')} ₺</span>
            </div>

            {dispatchConfirmed ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-2xl text-xs font-bold flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                Çağrı başarıyla iletildi! Usta konumunuza yönlendirildi ve GİB faturası oluşturuldu.
              </div>
            ) : (
              <button
                onClick={handleExecuteDispatch}
                className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-white" />
                Çağrıyı Başlat & Usta Yola Çıksın
              </button>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
