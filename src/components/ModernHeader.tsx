/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, ShoppingBag, MapPin, Store, Sparkles, Layers, 
  ChevronDown, ChevronRight, X, LayoutGrid, Building2, 
  Bike, Check, ArrowRight, Tag, Zap, ChevronUp
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import GlobalUserNav from './GlobalUserNav';

export interface HeaderCategory {
  id: string;
  slug: string;
  name: string;
  icon: string;
  badge?: string;
  badgeBg?: string;
  subCategories: {
    title: string;
    items: { name: string; slug: string; badge?: string }[];
  }[];
  quickTags: string[];
  banner?: {
    title: string;
    description: string;
    btnText: string;
    actionSlug: string;
  };
}

export const HEADER_CATEGORIES: HeaderCategory[] = [
  {
    id: 'tum-vitrin',
    slug: 'all',
    name: '🔥 Tüm Vitrin',
    icon: '🔥',
    quickTags: ['%0 Komisyon', '⚡ 30 Dk Teslimat', '🏛️ Şehir Açık AVM', '👨‍🔧 TamTeklif Al', '💻 Anında İndir'],
    subCategories: [
      {
        title: 'HIZLI MAHALLE',
        items: [
          { name: 'Kasap & Şarküteri', slug: 'mahalle-hizli', badge: '30 Dk' },
          { name: 'Taze Meyve & Sebze', slug: 'mahalle-hizli' },
          { name: 'Odun Ateşi Taş Fırın Ekmek', slug: 'mahalle-hizli', badge: 'Sıcak' },
          { name: 'Damacana Su & İçecek', slug: 'mahalle-hizli' }
        ]
      },
      {
        title: 'BUTİK & ZANAAT',
        items: [
          { name: 'Kadın Butik Giyim', slug: 'moda-giyim-zanaat', badge: 'Butik' },
          { name: 'Erkek Giyim & Ceket', slug: 'moda-giyim-zanaat' },
          { name: 'El Emeği & Atölye', slug: 'moda-giyim-zanaat', badge: 'Zanaat' },
          { name: 'Hakiki Deri & Ayakkabı', slug: 'moda-giyim-zanaat' }
        ]
      },
      {
        title: 'EV & YAPI MARKET',
        items: [
          { name: 'Mutfak & Züccaciye', slug: 'ev-yasam-yapi-market' },
          { name: 'Pamuk Nevresim & Tekstil', slug: 'ev-yasam-yapi-market' },
          { name: 'Hırdavat & Nalburiye', slug: 'ev-yasam-yapi-market', badge: 'Usta' },
          { name: 'Bahçe & Saksı Çiçeği', slug: 'ev-yasam-yapi-market' }
        ]
      },
      {
        title: 'HİZMET & USTA',
        items: [
          { name: '7/24 Nöbetçi Su Tesisatçısı', slug: 'hizmet-ustalik-bakim', badge: 'Acil' },
          { name: 'Kombi & Klima Bakımı', slug: 'hizmet-ustalik-bakim' },
          { name: 'Gündelik Ev Temizliği', slug: 'hizmet-ustalik-bakim' },
          { name: 'Düğün & Ürün Çekimi', slug: 'hizmet-ustalik-bakim' }
        ]
      }
    ],
    banner: {
      title: '🏛️ TamPazar Şehir Açık AVM',
      description: 'Aracı komisyonu olmadan esnaf raf fiyatıyla doğrudan sipariş verin.',
      btnText: 'Tüm Reyonları İncele',
      actionSlug: 'all'
    }
  },
  {
    id: 'mahalle-hizli',
    slug: 'mahalle-hizli',
    name: 'Mahalle & Hızlı Tüketim',
    icon: '🥖',
    badge: '30 Dk Teslimat',
    badgeBg: 'bg-emerald-600 text-white',
    quickTags: ['⚡ 30 Dk Teslimat', '🥖 Sıcak Fırın Ekmek', '🥩 Taze Kasap Kıyma', '🍊 Taze Meyve', '💧 Damacana Su', '%0 Komisyon'],
    subCategories: [
      {
        title: 'KASAP & ŞARKÜTERİ',
        items: [
          { name: 'Dana Kıyma & Kuşbaşı', slug: 'mahalle-hizli', badge: 'Taze' },
          { name: 'Antrikot & Biftek', slug: 'mahalle-hizli' },
          { name: 'Kasap Sucuk & Pastırma', slug: 'mahalle-hizli' },
          { name: 'Organik Köy Tavuğu', slug: 'mahalle-hizli' }
        ]
      },
      {
        title: 'TAZE MEYVE & SEBZE',
        items: [
          { name: 'Günlük Mevsim Meyveleri', slug: 'mahalle-hizli' },
          { name: 'Çıtır Yeşillik & Salata', slug: 'mahalle-hizli', badge: 'Yerel' },
          { name: 'Organik Tarla Sebzeleri', slug: 'mahalle-hizli' },
          { name: 'Amasya & Niğde Elması', slug: 'mahalle-hizli' }
        ]
      },
      {
        title: 'FIRIN & UNLU MAMULLER',
        items: [
          { name: 'Odun Ateşi Taş Fırın Ekmek', slug: 'mahalle-hizli', badge: 'Sıcak' },
          { name: 'Kıymalı & Kaşarlı Pide', slug: 'mahalle-hizli' },
          { name: 'Geleneksel Çıtır Simit', slug: 'mahalle-hizli' },
          { name: 'Su Böreği & Çörek', slug: 'mahalle-hizli' }
        ]
      },
      {
        title: 'DAMACANA SU & İÇECEK',
        items: [
          { name: '19L Damacana Kaynak Suyu', slug: 'mahalle-hizli', badge: 'Hızlı' },
          { name: 'Taze Portakal Suyu', slug: 'mahalle-hizli' },
          { name: 'Maden Suyu & Soda', slug: 'mahalle-hizli' },
          { name: 'Yerel Harman Çay & Kahve', slug: 'mahalle-hizli' }
        ]
      }
    ],
    banner: {
      title: '⚡ 30 Dakikada Kapında! (TamHızlı)',
      description: 'Mahallenizin fırın, kasap ve manavından sıcak teslimat.',
      btnText: 'Esnafları Gör',
      actionSlug: 'mahalle-hizli'
    }
  },
  {
    id: 'moda-giyim-zanaat',
    slug: 'moda-giyim-zanaat',
    name: 'Moda & Giyim & Zanaat',
    icon: '👗',
    badge: 'Butik Esnaf',
    badgeBg: 'bg-rose-600 text-white',
    quickTags: ['✨ Butik Esnaf', '👗 Kadın Elbise', '👞 Hakiki Deri', '🎨 El Emeği Zanaat', '👔 Takım Elbise'],
    subCategories: [
      {
        title: 'KADIN BUTİK GİYİM',
        items: [
          { name: 'Elbise & Abiye Modelleri', slug: 'moda-giyim-zanaat' },
          { name: 'Butik Bluz & Gömlek', slug: 'moda-giyim-zanaat' },
          { name: 'Oversize Ceket & Kaban', slug: 'moda-giyim-zanaat' },
          { name: 'Triko & Hırka', slug: 'moda-giyim-zanaat' }
        ]
      },
      {
        title: 'ERKEK GİYİM',
        items: [
          { name: 'Zanaatkar Takım Elbise', slug: 'moda-giyim-zanaat' },
          { name: 'Pamuklu Gömlek & T-shirt', slug: 'moda-giyim-zanaat' },
          { name: 'Hakiki Deri Mont & Ceket', slug: 'moda-giyim-zanaat', badge: 'Deri' },
          { name: 'Kumaş & Kot Pantolon', slug: 'moda-giyim-zanaat' }
        ]
      },
      {
        title: 'ATÖLYE & ZANAAT',
        items: [
          { name: 'El Yapımı Seramik Fincan', slug: 'moda-giyim-zanaat', badge: 'Atölye' },
          { name: 'Ahşap Oyma Dekorasyon', slug: 'moda-giyim-zanaat' },
          { name: 'Geleneksel Örgü & Nakış', slug: 'moda-giyim-zanaat' },
          { name: 'Tasarım Takı & Aksesuar', slug: 'moda-giyim-zanaat' }
        ]
      },
      {
        title: 'HAKİKİ DERİ & AYAKKABI',
        items: [
          { name: 'Oxford Deri Ayakkabı', slug: 'moda-giyim-zanaat' },
          { name: 'Erkek & Kadın Sneaker', slug: 'moda-giyim-zanaat' },
          { name: 'Handmade Deri Çanta', slug: 'moda-giyim-zanaat' },
          { name: 'Kışlık Deri Bot & Çizme', slug: 'moda-giyim-zanaat' }
        ]
      }
    ],
    banner: {
      title: '✨ Zanaatkâr Butikleri Keşfet',
      description: 'El emeği deri ve seramik tasarımlarını doğrudan üreticiden alın.',
      btnText: 'Atölye Vitrinine Geç',
      actionSlug: 'moda-giyim-zanaat'
    }
  },
  {
    id: 'ev-yasam-yapi-market',
    slug: 'ev-yasam-yapi-market',
    name: 'Ev, Yaşam & Yapı Market',
    icon: '🏡',
    badge: 'Usta Rafı',
    badgeBg: 'bg-amber-600 text-white',
    quickTags: ['🛠️ Nalbur & Hırdavat', '🍳 Döküm Mutfak', '🛏️ Denizli Dokuma', '🪴 Canlı Saksı Çiçeği', '💡 LED Avize'],
    subCategories: [
      {
        title: 'MUTFAK & ZÜCCACİYE',
        items: [
          { name: 'Döküm Tencere & Tava Seti', slug: 'ev-yasam-yapi-market' },
          { name: 'Porselen Yemek Takımı', slug: 'ev-yasam-yapi-market' },
          { name: 'Sürmene Bıçak Takımı', slug: 'ev-yasam-yapi-market', badge: 'Zanaat' },
          { name: 'Cam Saklama & Baharatlık', slug: 'ev-yasam-yapi-market' }
        ]
      },
      {
        title: 'EV TEKSTİLİ',
        items: [
          { name: 'Pamuk Nevresim Takımı', slug: 'ev-yasam-yapi-market' },
          { name: 'Denizli Dokuma Havlu', slug: 'ev-yasam-yapi-market' },
          { name: 'Etnik Dokuma Kilim', slug: 'ev-yasam-yapi-market' },
          { name: 'Özel Ölçü Perde & Tül', slug: 'ev-yasam-yapi-market' }
        ]
      },
      {
        title: 'HIRDAVAT & NALBURİYE',
        items: [
          { name: 'Şarjlı Matkap & El Aletleri', slug: 'ev-yasam-yapi-market', badge: 'Usta' },
          { name: 'İç Cephe Silinebilir Boya', slug: 'ev-yasam-yapi-market' },
          { name: 'Akıllı Kilit & Kapı Kolları', slug: 'ev-yasam-yapi-market' },
          { name: 'LED Aydınlatma & Avize', slug: 'ev-yasam-yapi-market' }
        ]
      },
      {
        title: 'BAHÇE & ÇİÇEK',
        items: [
          { name: 'Canlı Saksı Bitkileri', slug: 'ev-yasam-yapi-market' },
          { name: 'Balkon & Bahçe Mobilyası', slug: 'ev-yasam-yapi-market' },
          { name: 'Çim Biçme Makinesi', slug: 'ev-yasam-yapi-market' },
          { name: 'Organik Sebze Fidesi', slug: 'ev-yasam-yapi-market' }
        ]
      }
    ],
    banner: {
      title: '🛠️ Nalburiye ve Yapı Market',
      description: 'Evinizin usta aletlerini mahalle nalburunuzdan temin edin.',
      btnText: 'Yapı Market Vitrinine Geç',
      actionSlug: 'ev-yasam-yapi-market'
    }
  },
  {
    id: 'hizmet-ustalik-bakim',
    slug: 'hizmet-ustalik-bakim',
    name: 'Hizmet & Ustalık',
    icon: '🔧',
    badge: 'TamTeklif',
    badgeBg: 'bg-indigo-600 text-white',
    quickTags: ['👨‍🔧 TamTeklif Al', '🚨 7/24 Acil Tesisat', '❄️ Klima Gazı & Bakım', '🧹 Koltuk Yıkama', '🔑 Nöbetçi Çilingir'],
    subCategories: [
      {
        title: 'EV TADİLAT & TESİSAT',
        items: [
          { name: '7/24 Su Tesisatçısı', slug: 'hizmet-ustalik-bakim', badge: 'Acil' },
          { name: 'Elektrik Arıza & Panosu', slug: 'hizmet-ustalik-bakim' },
          { name: 'Boya Badana & Tadilat', slug: 'hizmet-ustalik-bakim' },
          { name: '7/24 Çilingir Servisi', slug: 'hizmet-ustalik-bakim' }
        ]
      },
      {
        title: 'BEYAZ EŞYA & İKLİMLENDİRME',
        items: [
          { name: 'Klima Montaj & Gaz Dolumu', slug: 'hizmet-ustalik-bakim' },
          { name: 'Kombi Bakımı & Petek Temizliği', slug: 'hizmet-ustalik-bakim' },
          { name: 'Çamaşır Makinesi Arıza', slug: 'hizmet-ustalik-bakim' },
          { name: 'Buzdolabı Tamiri', slug: 'hizmet-ustalik-bakim' }
        ]
      },
      {
        title: 'TEMİZLİK & BAKIM',
        items: [
          { name: 'Gündelik Ev Temizliği', slug: 'hizmet-ustalik-bakim' },
          { name: 'Koltuk & Halı Yıkama', slug: 'hizmet-ustalik-bakim' },
          { name: 'Böcek & Haşere İlaçlama', slug: 'hizmet-ustalik-bakim' },
          { name: 'İnşaat Sonrası Temizlik', slug: 'hizmet-ustalik-bakim' }
        ]
      },
      {
        title: 'MEDYA & DİJİTAL',
        items: [
          { name: 'Düğün Fotoğrafçısı', slug: 'hizmet-ustalik-bakim' },
          { name: 'Kurumsal Tanıtım Filmi', slug: 'hizmet-ustalik-bakim' },
          { name: 'E-Ticaret Ürün Çekimi', slug: 'hizmet-ustalik-bakim' },
          { name: 'Drone Hava Çekimi', slug: 'hizmet-ustalik-bakim' }
        ]
      }
    ],
    banner: {
      title: '👨‍🔧 TamTeklif ile Anında Fiyat Al',
      description: 'Fotoğraf yükleyin, kayıtlı ustalar size teklif versin.',
      btnText: 'TamTeklif İste',
      actionSlug: 'hizmet-ustalik-bakim'
    }
  },
  {
    id: 'tamdijital',
    slug: 'tamdijital',
    name: 'Dijital Varlıklar',
    icon: '💻',
    badge: 'Anında İndir',
    badgeBg: 'bg-cyan-600 text-white',
    quickTags: ['💻 Anında İndir', '📐 DXF Lazer Çizim', '🧵 Maraş Nakış DST', '📚 E-Kılavuz', '⚡ Sanal POS Kit'],
    subCategories: [
      {
        title: 'GRAFİK & LAZER KESİM',
        items: [
          { name: 'Lazer Kesim DXF/SVG', slug: 'tamdijital', badge: 'DXF' },
          { name: '3D Yazıcı STL Modelleri', slug: 'tamdijital' },
          { name: 'Maraş Nakış Desenleri (PES/DST)', slug: 'tamdijital' },
          { name: 'Sosyal Medya Canva & PSD Kit', slug: 'tamdijital' }
        ]
      },
      {
        title: 'E-KİTAP & REHBERLER',
        items: [
          { name: 'Esnaf E-Ticaret Kılavuzu', slug: 'tamdijital' },
          { name: 'Sanal POS Entegrasyon Rehberi', slug: 'tamdijital' },
          { name: 'Organik Tarım Kitabı', slug: 'tamdijital' },
          { name: 'g-Fatura & Muhasebe Rehberi', slug: 'tamdijital' }
        ]
      },
      {
        title: 'YAZILIM & ŞABLONLAR',
        items: [
          { name: 'Vite & React UI Kit', slug: 'tamdijital' },
          { name: 'Woocommerce Entegrasyonu', slug: 'tamdijital' },
          { name: 'Excel Ön Muhasebe Şablonu', slug: 'tamdijital' },
          { name: 'Barkod Etiket Yazılımı', slug: 'tamdijital' }
        ]
      }
    ],
    banner: {
      title: '💻 Anında Güvenli İndirme (TamDijital)',
      description: 'Satın aldığınız an üreticinin lisanslı dosyasını indirin.',
      btnText: 'Dijital Reyonu Gör',
      actionSlug: 'tamdijital'
    }
  }
];

interface ModernHeaderProps {
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  selectedScope?: 'all' | 'retail' | 'wholesale' | 'service' | 'stores';
  onScopeChange?: (scope: any) => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  onOpenCart?: () => void;
  cartCount?: number;
  onOpenTamTeklif?: () => void;
  onOpenSellerModal?: () => void;
  products?: any[];
  tenants?: any[];
}

const POPULAR_CITIES = [
  { city: 'Ordu', district: 'Altınordu' },
  { city: 'İstanbul', district: 'Kadıköy' },
  { city: 'Ankara', district: 'Çankaya' },
  { city: 'İzmir', district: 'Karşıyaka' },
  { city: 'Bursa', district: 'Nilüfer' },
  { city: 'Antalya', district: 'Muratpaşa' },
  { city: 'Trabzon', district: 'Ortahisar' },
  { city: 'Samsun', district: 'Atakum' }
];

export default function ModernHeader({
  searchQuery = '',
  onSearchChange,
  selectedScope = 'all',
  onScopeChange,
  selectedCategory = 'all',
  onSelectCategory,
  onOpenCart,
  cartCount = 0,
  onOpenTamTeklif,
  onOpenSellerModal,
  products = [],
  tenants = []
}: ModernHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Location selector state
  const [currentLocation, setCurrentLocation] = useState<{ city: string; district: string }>(() => {
    try {
      const saved = localStorage.getItem('tampazar_user_location');
      return saved ? JSON.parse(saved) : { city: 'Ordu', district: 'Altınordu' };
    } catch {
      return { city: 'Ordu', district: 'Altınordu' };
    }
  });
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);

  // B2B & Teklif Dropdown
  const [isB2BDropdownOpen, setIsB2BDropdownOpen] = useState(false);
  const b2bRef = useRef<HTMLDivElement>(null);

  // Kategori Durum Yönetimi (State & Dropdown Panel)
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>(selectedCategory || 'all');
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);

  const megaMenuContainerRef = useRef<HTMLDivElement>(null);
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Search Input & Live Debounced Search Dropdown
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (selectedCategory) {
      setSelectedFilter(selectedCategory);
    }
  }, [selectedCategory]);

  // Click outside and ESC key listeners
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setIsLocationOpen(false);
      }
      if (b2bRef.current && !b2bRef.current.contains(e.target as Node)) {
        setIsB2BDropdownOpen(false);
      }
      if (megaMenuContainerRef.current && !megaMenuContainerRef.current.contains(e.target as Node)) {
        setOpenCategory(null);
        setActiveCategory(null);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenCategory(null);
        setActiveCategory(null);
        setIsLocationOpen(false);
        setIsB2BDropdownOpen(false);
        setIsSearchFocused(false);
        setMobileExpandedCat(null);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelectLocation = (loc: { city: string; district: string }) => {
    setCurrentLocation(loc);
    localStorage.setItem('tampazar_user_location', JSON.stringify(loc));
    setIsLocationOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchFocused(false);
    if (onSearchChange) {
      onSearchChange(localSearch);
    }
    if (location.pathname !== '/' && location.pathname !== '/pazaryeri') {
      navigate(`/pazaryeri?q=${encodeURIComponent(localSearch)}`);
    }
  };

  const handleCategorySelect = (slug: string, closeMenu = true) => {
    setSelectedFilter(slug);
    if (closeMenu) {
      setOpenCategory(null);
      setActiveCategory(null);
      setMobileExpandedCat(null);
    }
    if (onSelectCategory) {
      onSelectCategory(slug);
    }
    if (location.pathname !== '/' && location.pathname !== '/pazaryeri') {
      navigate(`/pazaryeri?kategori=${encodeURIComponent(slug)}`);
    } else {
      const prodEl = document.getElementById('all-products-section');
      if (prodEl && closeMenu) {
        prodEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleCategoryToggle = (catId: string, catSlug: string) => {
    if (openCategory === catId) {
      setOpenCategory(null);
      setActiveCategory(null);
    } else {
      setOpenCategory(catId);
      setActiveCategory(catId);
      handleCategorySelect(catSlug, false);
    }
    setMobileExpandedCat(mobileExpandedCat === catId ? null : catId);
  };

  const handleMouseEnterCategory = (catId: string) => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
    }
    setActiveCategory(catId);
  };

  const handleMouseLeaveCategory = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      // If user hasn't explicitly locked it open via click, close hover
      if (!openCategory) {
        setActiveCategory(null);
      }
    }, 250);
  };

  const handleMouseEnterMenu = () => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
    }
  };

  const handleMouseLeaveMenu = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      if (!openCategory) {
        setActiveCategory(null);
      }
    }, 250);
  };

  // Search results filtering
  const searchTrimmed = localSearch.trim().toLowerCase();
  const matchingProducts = searchTrimmed.length >= 2 
    ? products.filter(p => p.title.toLowerCase().includes(searchTrimmed) || p.category.toLowerCase().includes(searchTrimmed)).slice(0, 5)
    : [];

  const currentActiveId = openCategory || activeCategory;
  const activeCategoryObject = HEADER_CATEGORIES.find(c => c.id === currentActiveId);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-slate-200">
      
      {/* 1. KATMAN (ANA BEYAZ HEADER - Trendyol / Hepsiburada Standardı) */}
      <div className="border-b border-slate-100 px-4 lg:px-8 py-3 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 md:gap-6">
          
          {/* Sol: Logo + Şehir / Konum Seçici */}
          <div className="flex items-center gap-3 lg:gap-5 shrink-0">
            <Link to="/" className="flex items-center" title="TamPazar Ana Sayfa">
              <BrandLogo size="md" />
            </Link>

            {/* Konum Seçici Popover */}
            <div className="relative" ref={locationRef}>
              <button
                type="button"
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-600 bg-slate-50 hover:bg-white text-xs font-semibold text-slate-700 transition cursor-pointer"
                title="Konum ve İlçe Değiştir"
              >
                <MapPin className="w-3.5 h-3.5 text-[#0F4C3A]" />
                <span className="font-bold text-slate-900">{currentLocation.city}</span>
                <span className="text-slate-400">/ {currentLocation.district}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLocationOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 animate-fade-in divide-y divide-slate-100 text-xs">
                  <div className="pb-2">
                    <span className="font-bold text-slate-900 block">Mahalle & Şehir Seçimi</span>
                    <span className="text-[11px] text-slate-500">Size en yakın esnafları listeleyin</span>
                  </div>
                  <div className="pt-2 space-y-1 max-h-56 overflow-y-auto">
                    {POPULAR_CITIES.map((loc, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectLocation(loc)}
                        className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition cursor-pointer ${
                          currentLocation.city === loc.city ? 'bg-emerald-50 text-[#0F4C3A] font-black' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span>{loc.city}, {loc.district}</span>
                        {currentLocation.city === loc.city && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Orta: Geniş Akıllı Arama Çubuğu + Anlık Canlı Sonuç Dropdown */}
          <div className="flex-1 max-w-2xl mx-1 sm:mx-2 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-center rounded-2xl border-2 border-slate-200 focus-within:border-[#0F4C3A] focus-within:ring-2 focus-within:ring-emerald-600/10 overflow-hidden bg-slate-50/50 hover:bg-white focus-within:bg-white shadow-2xs transition-all">
                
                {/* Kategori Açılır Filtresi */}
                <select
                  value={selectedScope}
                  onChange={(e) => onScopeChange && onScopeChange(e.target.value)}
                  className="bg-transparent hover:bg-slate-100 px-3 text-xs font-bold text-slate-700 border-r border-slate-200 outline-none cursor-pointer h-10 shrink-0 hidden md:block"
                >
                  <option value="all">Tüm Pazar ▾</option>
                  <option value="retail">Perakende</option>
                  <option value="wholesale">B2B Toptan</option>
                  <option value="service">Usta & Hizmet</option>
                  <option value="stores">Mağazalar</option>
                </select>

                {/* Arama Input */}
                <input
                  type="text"
                  value={localSearch}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => {
                    setLocalSearch(e.target.value);
                    if (onSearchChange) onSearchChange(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  placeholder="Esnaf, taze fırın ekmeği, usta veya ürün arayın..."
                  className="w-full min-w-0 px-3.5 py-2 text-xs sm:text-sm font-medium outline-none bg-transparent text-slate-900 placeholder:text-slate-400 h-10"
                />

                {localSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setLocalSearch('');
                      if (onSearchChange) onSearchChange('');
                    }}
                    className="px-2 text-slate-400 hover:text-slate-600 transition cursor-pointer shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Zümrüt Yeşili Arama Butonu */}
                <button
                  type="submit"
                  className="bg-[#0F4C3A] hover:bg-[#0B382B] text-white px-4 h-10 flex items-center justify-center shrink-0 transition-colors cursor-pointer font-bold shadow-2xs"
                  title="Arama Yap"
                >
                  <Search className="w-4 h-4 text-white" />
                </button>
              </div>
            </form>

            {/* Anlık Debounced Canlı Sonuç Açılır Menüsü */}
            {isSearchFocused && searchTrimmed.length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-fade-in text-xs max-h-80 overflow-y-auto">
                <div className="px-2 pb-2 border-b border-slate-100 flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase">
                  <span>Arama Sonuçları</span>
                  <span>{matchingProducts.length} Ürün Bulundu</span>
                </div>

                {matchingProducts.length > 0 ? (
                  <div className="pt-2 divide-y divide-slate-100">
                    {matchingProducts.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setIsSearchFocused(false);
                          navigate(`/urun/${p.slug}`);
                        }}
                        className="w-full text-left py-2 px-2 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition cursor-pointer"
                      >
                        <img 
                          src={p.image} 
                          alt={p.title} 
                          className="w-9 h-9 object-cover rounded-lg border border-slate-200 shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-slate-900 truncate">{p.title}</div>
                          <div className="text-[10px] text-slate-500 truncate">{p.storeName || p.category}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-extrabold text-[#0F4C3A]">₺{p.price}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-slate-500 font-medium">
                    "{localSearch}" ile eşleşen sonuç bulunamadı.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sağ: Sadeleştirilmiş 4 Aksiyon Butonu */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* 1. Dükkan Aç / Satıcı Kaydı */}
            <button
              type="button"
              onClick={() => {
                if (onOpenSellerModal) {
                  onOpenSellerModal();
                } else {
                  navigate('/saticipaneli');
                }
              }}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 transition shadow-2xs cursor-pointer"
            >
              <Store className="w-3.5 h-3.5 text-[#0F4C3A]" />
              <span>Dükkan Aç</span>
            </button>

            {/* 2. B2B Ağ / Teklif Al (Açılır Menü) */}
            <div className="relative" ref={b2bRef}>
              <button
                type="button"
                onClick={() => setIsB2BDropdownOpen(!isB2BDropdownOpen)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>B2B & Teklif</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isB2BDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 animate-fade-in text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setIsB2BDropdownOpen(false);
                      if (onOpenTamTeklif) onOpenTamTeklif();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-slate-800 hover:bg-emerald-50 hover:text-[#0F4C3A] font-bold text-left cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <div className="font-black">TamTeklif Al</div>
                      <div className="text-[10px] text-slate-400 font-normal">Kapalı zarf usta fiyatı al</div>
                    </div>
                  </button>

                  <Link
                    to="/toptan"
                    onClick={() => setIsB2BDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-slate-800 hover:bg-slate-50 font-bold"
                  >
                    <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <div className="font-black">B2B Toptan Depo</div>
                      <div className="text-[10px] text-slate-400 font-normal">Palet & koli bazlı alım</div>
                    </div>
                  </Link>

                  <Link
                    to="/kuryeler"
                    onClick={() => setIsB2BDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-slate-800 hover:bg-slate-50 font-bold"
                  >
                    <Bike className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-black">TamKurye Çağır</div>
                      <div className="text-[10px] text-slate-400 font-normal">30 dk moto kurye</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 3. Kullanıcı Profili / Hesabım */}
            <GlobalUserNav />

            {/* 4. Sepetim */}
            <button
              type="button"
              onClick={() => onOpenCart && onOpenCart()}
              className="relative flex items-center gap-1.5 bg-[#0F4C3A] hover:bg-[#0B382B] text-white px-3 sm:px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs"
              title="Sepeti Aç"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">Sepet</span>
              {cartCount > 0 && (
                <span className="bg-[#F59E0B] text-[#0B132B] font-black text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </button>

          </div>

        </div>
      </div>

      {/* 2. KATMAN (BEYAZ / MİNİMALİST KATEGORİ BAR & MEGA MENÜ FLYOUT) */}
      <div 
        className="bg-white px-4 lg:px-8 border-b border-slate-200/90 relative z-40 pointer-events-auto"
        ref={megaMenuContainerRef}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-xs font-semibold overflow-x-auto scrollbar-none py-1.5">
          
          {/* Direct Category Link Buttons with Hover & Click Subcategory Flyout */}
          <div className="flex items-center gap-1 md:gap-2 shrink-0 overflow-x-auto scrollbar-none py-1">
            {HEADER_CATEGORIES.map((cat) => {
              const isActive = location.pathname === `/kategori/${cat.slug}` || selectedCategory === cat.slug;
              const isOpen = (openCategory === cat.id) || (activeCategory === cat.id);

              return (
                <div
                  key={cat.id}
                  className="relative shrink-0 select-none group"
                  onMouseEnter={() => handleMouseEnterCategory(cat.id)}
                  onMouseLeave={handleMouseLeaveCategory}
                >
                  <div
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs transition cursor-pointer whitespace-nowrap border-b-2 ${
                      isOpen || isActive
                        ? 'border-[#0F4C3A] text-[#0F4C3A] bg-emerald-50 font-black shadow-xs'
                        : 'border-transparent text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 font-bold'
                    }`}
                  >
                    <Link
                      to={`/kategori/${cat.slug}`}
                      className="flex items-center gap-1.5 cursor-pointer"
                      onClick={() => {
                        setActiveCategory(null);
                        setOpenCategory(null);
                      }}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </Link>

                    {cat.badge && (
                      <span className={`hidden lg:inline-block text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase ${cat.badgeBg || 'bg-slate-200 text-slate-800'}`}>
                        {cat.badge}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryToggle(cat.id, cat.slug);
                      }}
                      className="p-0.5 hover:bg-emerald-100/60 rounded-md transition text-slate-400 hover:text-[#0F4C3A]"
                      title={`${cat.name} Alt Kategorilerini Aç`}
                    >
                      <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180 text-[#0F4C3A]' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Dış Bağlantılar */}
            <Link
              to="/toptan"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-amber-800 hover:text-amber-950 hover:bg-amber-50/80 transition whitespace-nowrap font-bold text-xs shrink-0 cursor-pointer select-none"
            >
              <span>🏢</span>
              <span>B2B Toptan</span>
            </Link>

            <Link
              to="/kuryeler"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50/80 transition whitespace-nowrap font-bold text-xs shrink-0 cursor-pointer select-none"
            >
              <span>🛵</span>
              <span>TamKurye (30 Dk)</span>
            </Link>
          </div>

        </div>

        {/* ALT KATEGORİLER MEGA MENÜ FLYOUT (Hover / Click ile Açılan Panel) */}
        {activeCategoryObject && (
          <div 
            className="block absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-2xl z-50 animate-fade-in pointer-events-auto max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={handleMouseEnterMenu}
            onMouseLeave={handleMouseLeaveMenu}
          >
            {(!activeCategoryObject.subCategories || activeCategoryObject.subCategories.length === 0) ? (
              <div className="max-w-xl mx-auto py-10 px-6 text-center space-y-4">
                <div className="w-14 h-14 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl shadow-xs border border-emerald-100 text-emerald-800">
                  {activeCategoryObject.icon || '🛍️'}
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-black text-slate-900">
                    {activeCategoryObject.name} Vitrini
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    Tüm ürün ve esnafları görmek için kategori sayfasına gidin veya dükkanınızı açarak ilk satıcı olun.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Link
                    to={`/kategori/${activeCategoryObject.slug}`}
                    onClick={() => { setActiveCategory(null); setOpenCategory(null); }}
                    className="px-5 py-2.5 bg-[#0F4C3A] hover:bg-[#0B382B] text-white rounded-xl text-xs font-black shadow-xs transition flex items-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{activeCategoryObject.name} Sayfasına Git</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 text-left">
                
                {/* Alt Kategoriler Matrisi */}
                <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:border-r md:border-slate-100 md:pr-6">
                  {activeCategoryObject.subCategories.map((group, groupIdx) => (
                    <div key={groupIdx} className="space-y-2.5">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        <span className="truncate">{group.title}</span>
                      </h4>
                      <ul className="space-y-1.5">
                        {group.items.map((item, itemIdx) => (
                          <li key={itemIdx}>
                            <Link
                              to={`/kategori/${activeCategoryObject.slug}?sub=${encodeURIComponent(item.name)}`}
                              onClick={() => {
                                setActiveCategory(null);
                                setOpenCategory(null);
                              }}
                              className="w-full text-left text-xs font-semibold text-slate-600 hover:text-[#0F4C3A] hover:font-bold hover:translate-x-0.5 transition-all flex items-center justify-between group cursor-pointer py-1"
                            >
                              <span className="truncate">{item.name}</span>
                              {item.badge && (
                                <span className="text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded-full shrink-0 ml-1">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Öne Çıkan Etiketler & Kampanya Kartı */}
                <div className="md:col-span-4 space-y-4 flex flex-col justify-between md:pl-2 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 uppercase tracking-wide">
                      <Tag className="w-3.5 h-3.5 text-amber-500" />
                      <span>Hızlı Filtre Etiketleri</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {activeCategoryObject.quickTags.map((tag, tagIdx) => (
                        <Link
                          key={tagIdx}
                          to={`/kategori/${activeCategoryObject.slug}`}
                          onClick={() => { setActiveCategory(null); setOpenCategory(null); }}
                          className="text-[11px] font-bold bg-slate-100 hover:bg-emerald-100 hover:text-[#0F4C3A] text-slate-700 px-2.5 py-1 rounded-xl transition cursor-pointer border border-slate-200/70"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {activeCategoryObject.banner && (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 via-[#0F4C3A] to-slate-900 text-white shadow-md space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                          {activeCategoryObject.badge || 'Komisyonsuz Reyon'}
                        </span>
                        <Zap className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white">{activeCategoryObject.banner.title}</h4>
                        <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{activeCategoryObject.banner.description}</p>
                      </div>
                      <Link
                        to={`/kategori/${activeCategoryObject.banner.actionSlug}`}
                        onClick={() => { setActiveCategory(null); setOpenCategory(null); }}
                        className="w-full py-1.5 bg-[#F59E0B] hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1 mt-1"
                      >
                        <span>{activeCategoryObject.banner.btnText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        )}

      </div>

    </header>
  );
}
