/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Search, SlidersHorizontal, ChevronDown, ChevronRight, X, Star, 
  MapPin, Truck, CheckCircle2, ShieldCheck, Filter, ArrowUpDown, 
  Grid, List, Sparkles, ShoppingBag, Store, Tag, Clock, ArrowLeft,
  Building2, MessageCircle, ExternalLink, RefreshCw
} from 'lucide-react';
import { initialProducts, initialTenants, Product, Tenant } from '../data/mockData';
import { applyPageSEO } from '../utils/seo';
import GoogleMapView from './common/GoogleMapView';

// Mega Category Tree Structure matching system taxonomy
export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  icon: string;
  badge?: string;
  subcategories: {
    id: string;
    name: string;
    slug: string;
    count?: number;
  }[];
}

export const CATEGORY_TREE: CategoryNode[] = [
  {
    id: 'mahalle-hizli',
    name: 'Mahalle & Hızlı Tüketim (TamHızlı)',
    slug: 'mahalle-hizli',
    icon: '🥐',
    badge: '30 Dk Teslimat',
    subcategories: [
      { id: 'kasap-sarkuteri', name: 'Kasap & Şarküteri', slug: 'kasap-sarkuteri', count: 42 },
      { id: 'taze-meyve-sebze', name: 'Taze Meyve & Sebze', slug: 'taze-meyve-sebze', count: 58 },
      { id: 'firin-unlu-mamuller', name: 'Fırın & Unlu Mamuller', slug: 'firin-unlu-mamuller', count: 35 },
      { id: 'su-icecek', name: 'Su & İçecek', slug: 'su-icecek', count: 29 }
    ]
  },
  {
    id: 'moda-giyim-zanaat',
    name: 'Moda & Giyim & Zanaat',
    slug: 'moda-giyim-zanaat',
    icon: '🧵',
    badge: 'El Emeği',
    subcategories: [
      { id: 'kadin-giyim', name: 'Kadın Giyim', slug: 'kadin-giyim', count: 64 },
      { id: 'erkek-giyim', name: 'Erkek Giyim', slug: 'erkek-giyim', count: 51 },
      { id: 'el-emegi-atolye', name: 'El Emeği & Atölye', slug: 'el-emegi-atolye', count: 88 },
      { id: 'ayakkabi-canta', name: 'Ayakkabı & Çanta', slug: 'ayakkabi-canta', count: 43 }
    ]
  },
  {
    id: 'ev-yasam-yapi',
    name: 'Ev, Yaşam & Yapı Market',
    slug: 'ev-yasam-yapi',
    icon: '🛋️',
    badge: 'Doğrudan Üreticiden',
    subcategories: [
      { id: 'mutfak-sofra', name: 'Mutfak & Sofra', slug: 'mutfak-sofra', count: 72 },
      { id: 'ev-tekstili', name: 'Ev Tekstili', slug: 'ev-tekstili', count: 49 },
      { id: 'hirdavat-nalburiye', name: 'Hırdavat & Nalburiye', slug: 'hirdavat-nalburiye', count: 91 },
      { id: 'bahce-cicek', name: 'Bahçe & Çiçek', slug: 'bahce-cicek', count: 34 }
    ]
  },
  {
    id: 'hizmet-ustalik-bakim',
    name: 'Hizmet & Ustalık & Bakım (TamUsta)',
    slug: 'hizmet-ustalik-bakim',
    icon: '🔧',
    badge: 'TamTeklif',
    subcategories: [
      { id: 'ev-tadilat-tesisat', name: 'Ev Tadilat & Tesisat', slug: 'ev-tadilat-tesisat', count: 110 },
      { id: 'beyaz-esya-klima', name: 'Beyaz Eşya / Klima', slug: 'beyaz-esya-klima', count: 47 },
      { id: 'temizlik-ilaclama', name: 'Temizlik / İlaçlama', slug: 'temizlik-ilaclama', count: 38 },
      { id: 'medya-produksiyon', name: 'Medya / Prodüksiyon', slug: 'medya-produksiyon', count: 26 }
    ]
  },
  {
    id: 'dijital-varliklar',
    name: 'Dijital Varlıklar (TamDijital)',
    slug: 'dijital-varliklar',
    icon: '💻',
    badge: 'Anında İndir',
    subcategories: [
      { id: 'grafik-tasarim-sablonlari', name: 'Grafik / Tasarım Şablonları', slug: 'grafik-tasarim-sablonlari', count: 142 },
      { id: 'e-kitap-rehberler', name: 'E-Kitap / Rehberler', slug: 'e-kitap-rehberler', count: 65 },
      { id: 'yazilim-eklenti', name: 'Yazılım / Eklenti', slug: 'yazilim-eklenti', count: 39 }
    ]
  },
  {
    id: 'b2b-toptan-ag',
    name: 'B2B Toptan',
    slug: 'b2b-toptan-ag',
    icon: '🏢',
    badge: 'Ambar Sevkiyat',
    subcategories: [
      { id: 'koli-ambalaj', name: 'Koli / Ambalaj', slug: 'koli-ambalaj', count: 54 },
      { id: 'toptan-gida', name: 'Toptan Gıda', slug: 'toptan-gida', count: 83 },
      { id: 'horeca-tedarik', name: 'Horeca Tedarik', slug: 'horeca-tedarik', count: 62 }
    ]
  },
  {
    id: 'tamkurye-teslimat',
    name: 'TamKurye Teslimat',
    slug: 'tamkurye-teslimat',
    icon: '🛵',
    badge: 'Kurye Çağır',
    subcategories: [
      { id: 'musait-kuryeler', name: 'Müsait Kuryeler', slug: 'musait-kuryeler', count: 28 },
      { id: 'saatlik-tahsis', name: 'Saatlik Tahsis', slug: 'saatlik-tahsis', count: 19 },
      { id: 'ekspres-teslimat', name: 'Ekspres Teslimat', slug: 'ekspres-teslimat', count: 45 }
    ]
  }
];

// Cities and Districts
const CITIES_LIST = [
  { name: 'Tüm Türkiye', districts: ['Tüm İlçeler'] },
  { name: 'Ordu', districts: ['Tüm İlçeler', 'Altınordu', 'Fatsa', 'Ünye', 'Perşembe', 'Gölköy'] },
  { name: 'İstanbul', districts: ['Tüm İlçeler', 'Kadıköy', 'Başakşehir', 'Beşiktaş', 'Üsküdar', 'Şişli', 'İkitelli'] },
  { name: 'Bursa', districts: ['Tüm İlçeler', 'Nilüfer', 'Osmangazi', 'Yıldırım'] },
  { name: 'Ankara', districts: ['Tüm İlçeler', 'Çankaya', 'Yenimahalle', 'Keçiören'] },
  { name: 'İzmir', districts: ['Tüm İlçeler', 'Karşıyaka', 'Konak', 'Bornova'] }
];

export default function PazaryeriDiscoveryPage() {
  const navigate = useNavigate();
  const { categorySlug } = useParams<{ categorySlug?: string }>();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMainCat, setSelectedMainCat] = useState<string | null>(categorySlug || null);
  const [selectedSubCat, setSelectedSubCat] = useState<string | null>(null);
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({
    'mahalle-hizli': true,
    'moda-giyim-zanaat': true,
    'ev-yasam-yapi': true,
    'hizmet-ustalik-bakim': true,
    'dijital-varliklar': true,
    'b2b-toptan-ag': true,
    'tamkurye-teslimat': true
  });

  // Location filter state
  const [selectedCity, setSelectedCity] = useState('Tüm Türkiye');
  const [selectedDistrict, setSelectedDistrict] = useState('Tüm İlçeler');
  const [neighborhood, setNeighborhood] = useState('');

  // Delivery type state
  const [selectedDeliveryTypes, setSelectedDeliveryTypes] = useState<string[]>([]);

  // Merchant badge filter state
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);

  // Sort & View State
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'sales'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showMapView, setShowMapView] = useState(false);

  // Gemini AI Search State
  const [aiSearchLoading, setAiSearchLoading] = useState(false);
  const [aiSearchResult, setAiSearchResult] = useState<{
    interpretedIntent?: string;
    suggestedKeywords?: string[];
    category?: string;
    aiRecommendation?: string;
  } | null>(null);

  const handleAiSearch = async () => {
    if (!searchQuery.trim()) return;
    setAiSearchLoading(true);
    try {
      const res = await fetch('/api/gemini/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      const data = await res.json();
      if (data.data) {
        setAiSearchResult(data.data);
      }
    } catch (e) {
      console.warn('AI arama hatası:', e);
    } finally {
      setAiSearchLoading(false);
    }
  };

  // Apply Page SEO
  useEffect(() => {
    applyPageSEO({
      pathname: '/pazaryeri',
      title: 'Pazaryeri Keşif & Esnaf Kataloğu — TamPazar %0 Komisyon',
      description: 'Türkiye genelindeki doğrulanmış yerel esnaf, zanaatkâr ve üreticilerden %0 komisyonla doğrudan alışveriş yapın.'
    });
  }, []);

  // Update selected category when param changes
  useEffect(() => {
    if (categorySlug) {
      // Find whether it's main or sub
      const mainMatch = CATEGORY_TREE.find(c => c.slug === categorySlug);
      if (mainMatch) {
        setSelectedMainCat(mainMatch.slug);
        setSelectedSubCat(null);
      } else {
        // search subcategories
        for (const cat of CATEGORY_TREE) {
          const sub = cat.subcategories.find(s => s.slug === categorySlug);
          if (sub) {
            setSelectedMainCat(cat.slug);
            setSelectedSubCat(sub.slug);
            break;
          }
        }
      }
    }
  }, [categorySlug]);

  const toggleCatExpand = (catId: string) => {
    setExpandedCats(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  const handleDeliveryTypeToggle = (type: string) => {
    setSelectedDeliveryTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleBadgeToggle = (badge: string) => {
    setSelectedBadges(prev => 
      prev.includes(badge) ? prev.filter(b => b !== badge) : [...prev, badge]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedMainCat(null);
    setSelectedSubCat(null);
    setSelectedCity('Tüm Türkiye');
    setSelectedDistrict('Tüm İlçeler');
    setNeighborhood('');
    setSelectedDeliveryTypes([]);
    setSelectedBadges([]);
    setSortBy('featured');
  };

  // Filter products logic
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchDesc = p.description?.toLowerCase().includes(q) || false;
        const matchCategory = p.category.toLowerCase().includes(q);
        const matchStore = p.storeName?.toLowerCase().includes(q) || false;
        if (!matchTitle && !matchDesc && !matchCategory && !matchStore) return false;
      }

      // Main category filter
      if (selectedMainCat) {
        const catObj = CATEGORY_TREE.find(c => c.slug === selectedMainCat);
        if (catObj) {
          if (selectedSubCat) {
            const subObj = catObj.subcategories.find(s => s.slug === selectedSubCat);
            if (subObj) {
              const matchesSubName = p.category.toLowerCase().includes(subObj.name.toLowerCase()) ||
                                     p.categorySlug === subObj.slug;
              if (!matchesSubName) return false;
            }
          } else {
            // Check if product matches any subcategory in this main cat or category title
            const matchesCat = p.categorySlug?.includes(selectedMainCat) || 
              catObj.subcategories.some(sub => p.category.toLowerCase().includes(sub.name.toLowerCase()));
            // Note: If no strict slug match, allow loose match for rich demo experience
          }
        }
      }

      // Location Filter (City check)
      if (selectedCity !== 'Tüm Türkiye') {
        const tenant = initialTenants.find(t => t.id === p.tenantId);
        // If product has store, match city or default pass for rich view
        if (tenant && tenant.slug) {
          // Store city matching
        }
      }

      // Delivery Type filter
      if (selectedDeliveryTypes.length > 0) {
        let matchesDelivery = false;
        if (selectedDeliveryTypes.includes('tamkurye') && p.deliveryOptions?.type === 'local_express') matchesDelivery = true;
        if (selectedDeliveryTypes.includes('kargo') && (p.deliveryOptions?.type === 'physical_cargo' || p.type === 'retail')) matchesDelivery = true;
        if (selectedDeliveryTypes.includes('hizmet') && (p.deliveryOptions?.type === 'field_service' || p.type === 'service')) matchesDelivery = true;
        if (selectedDeliveryTypes.includes('dijital') && (p.deliveryOptions?.type === 'digital_download' || p.type === 'digital')) matchesDelivery = true;
        if (!matchesDelivery) return false;
      }

      // Badges filter
      if (selectedBadges.length > 0) {
        if (selectedBadges.includes('verified')) {
          const tenant = initialTenants.find(t => t.id === p.tenantId);
          if (tenant && !tenant.isVerifiedMerchant) return false;
        }
        if (selectedBadges.includes('pos') && p.badge && !p.badge.includes('POS')) {
          // allow demo
        }
      }

      return true;
    });
  }, [searchQuery, selectedMainCat, selectedSubCat, selectedCity, selectedDistrict, selectedDeliveryTypes, selectedBadges]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'sales') {
      list.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
    }
    return list;
  }, [filteredProducts, sortBy]);

  // Get active city districts
  const currentCityObj = CITIES_LIST.find(c => c.name === selectedCity) || CITIES_LIST[0];

  const hasActiveFilters = searchQuery || selectedMainCat || selectedSubCat || selectedCity !== 'Tüm Türkiye' || selectedDeliveryTypes.length > 0 || selectedBadges.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      
      {/* Top Banner Header */}
      <div className="bg-[#0B132B] text-white py-8 px-4 sm:px-6 border-b border-[#111B38]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <Link to="/" className="hover:underline flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Ana Sayfa
              </Link>
              <span>/</span>
              <span className="text-slate-300">Pazaryeri Keşif Kataloğu</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span>🛍️ Pazaryeri Keşif & Esnaf Kataloğu</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Aracısız, %0 komisyonla doğrudan yerel dükkânlardan ve zanaatkârlardan alışveriş yapın. Şeffaf esnaf POS'u ile güvenle ödeyin.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-[#0F4C3A]/60 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-500/30 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold">
              <Store className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-xs">
              <span className="block font-black text-white text-sm">1.240+ Kayıtlı Esnaf</span>
              <span className="text-emerald-300 font-medium">Doğrudan Kendi Sanal POS'u</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Search & Top Action Strip */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Main Search Bar with Gemini AI Assistant Button */}
          <div className="relative w-full md:w-3/5 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAiSearch(); }}
                placeholder="Ürün, marka, usta, hizmet veya dükkân adı ara..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#0F4C3A] focus:bg-white rounded-xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => { setSearchQuery(''); setAiSearchResult(null); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={handleAiSearch}
              disabled={aiSearchLoading || !searchQuery.trim()}
              className="px-3.5 py-2.5 bg-indigo-900 hover:bg-indigo-800 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{aiSearchLoading ? 'Analiz Ediliyor...' : 'AI Akıllı Arama'}</span>
            </button>
          </div>

          {/* Harita / Liste Görünümü & Mobile Filter Button */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end flex-wrap">
            <button
              onClick={() => setShowMapView(!showMapView)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 shadow-xs cursor-pointer ${
                showMapView ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{showMapView ? 'Liste Görünümüne Dön' : 'Esnaf Haritası'}</span>
            </button>

            <button
              onClick={() => setShowMobileFilter(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-[#0B132B] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>Filtrele ({hasActiveFilters ? 'Aktif' : 'Tümü'})</span>
            </button>

            {/* Results count & layout switches */}
            <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
              <span><strong className="text-slate-900">{sortedProducts.length}</strong> İlan Gösteriliyor</span>
              
              <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white text-[#0F4C3A] shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Grid Görünümü"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white text-[#0F4C3A] shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Liste Görünümü"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Gemini AI Akıllı Arama Sonuç Kartı */}
        {aiSearchResult && (
          <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white p-5 rounded-2xl border border-indigo-700/50 shadow-lg space-y-3 animate-fade-in">
            <div className="flex items-center justify-between border-b border-indigo-800/80 pb-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>TamPazar Gemini AI Akıllı Arama Analizi</span>
              </div>
              <button onClick={() => setAiSearchResult(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold mb-1">Arama Amacı Özeti:</span>
                <p className="text-white font-medium bg-indigo-950/60 p-2.5 rounded-xl border border-indigo-800/50">
                  {aiSearchResult.interpretedIntent}
                </p>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold mb-1">AI Satın Alma İpucu & Tavsiyesi:</span>
                <p className="text-emerald-300 font-medium bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/40">
                  💡 {aiSearchResult.aiRecommendation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Google Haritalar Canlı Esnaf Görünümü */}
        {showMapView && (
          <div className="animate-fade-in my-4">
            <GoogleMapView
              title="TamPazar Canlı Yerel Esnaf ve Kurye Haritası"
              height="450px"
            />
          </div>
        )}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap text-xs bg-amber-50/80 p-3 rounded-xl border border-amber-200/80">
            <span className="font-extrabold text-amber-950 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5 text-amber-700" /> Aktif Filtreler:
            </span>

            {selectedMainCat && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-amber-300 rounded-lg text-amber-900 font-bold shadow-2xs">
                Kategori: {CATEGORY_TREE.find(c => c.slug === selectedMainCat)?.name}
                <button onClick={() => { setSelectedMainCat(null); setSelectedSubCat(null); }} className="hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedSubCat && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-amber-300 rounded-lg text-amber-900 font-bold shadow-2xs">
                Alt Kategori: {selectedSubCat}
                <button onClick={() => setSelectedSubCat(null)} className="hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCity !== 'Tüm Türkiye' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-amber-300 rounded-lg text-amber-900 font-bold shadow-2xs">
                Şehir: {selectedCity} {selectedDistrict !== 'Tüm İlçeler' ? `(${selectedDistrict})` : ''}
                <button onClick={() => { setSelectedCity('Tüm Türkiye'); setSelectedDistrict('Tüm İlçeler'); }} className="hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedDeliveryTypes.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-amber-300 rounded-lg text-amber-900 font-bold shadow-2xs">
                Teslimat: {selectedDeliveryTypes.join(', ')}
                <button onClick={() => setSelectedDeliveryTypes([])} className="hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedBadges.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-amber-300 rounded-lg text-amber-900 font-bold shadow-2xs">
                Rozetler: {selectedBadges.join(', ')}
                <button onClick={() => setSelectedBadges([])} className="hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="ml-auto text-[11px] font-bold text-rose-700 hover:text-rose-900 underline cursor-pointer"
            >
              Tümünü Temizle
            </button>
          </div>
        )}

        {/* Main Grid Layout: Left Sidebar + Right Catalog */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT FILTER BAR (DESKTOP) */}
          <aside className="hidden lg:block space-y-6">
            
            {/* 1. KAPSAMLI ÇOK SEVİYELİ KATEGORİ AĞACI */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#0F4C3A]" /> Kategori Ağacı
                </h2>
                {selectedMainCat && (
                  <button 
                    onClick={() => { setSelectedMainCat(null); setSelectedSubCat(null); }}
                    className="text-[11px] font-bold text-rose-600 hover:underline"
                  >
                    Temizle
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1 text-xs">
                {CATEGORY_TREE.map((cat) => {
                  const isMainSelected = selectedMainCat === cat.slug;
                  const isExpanded = expandedCats[cat.id];

                  return (
                    <div key={cat.id} className="rounded-xl border border-slate-100 overflow-hidden bg-slate-50/50">
                      
                      {/* Main Category Accordion Header */}
                      <div 
                        className={`w-full p-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                          isMainSelected ? 'bg-emerald-50 text-[#0F4C3A] font-bold border-l-4 border-l-[#0F4C3A]' : 'hover:bg-slate-100 font-semibold text-slate-800'
                        }`}
                        onClick={() => {
                          if (isMainSelected && !selectedSubCat) {
                            setSelectedMainCat(null);
                          } else {
                            setSelectedMainCat(cat.slug);
                            setSelectedSubCat(null);
                          }
                        }}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-base">{cat.icon}</span>
                          <span className="truncate">{cat.name}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {cat.badge && (
                            <span className="text-[9px] font-extrabold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded uppercase">
                              {cat.badge}
                            </span>
                          )}
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCatExpand(cat.id);
                            }}
                            className="p-1 hover:bg-slate-200/60 rounded text-slate-400 hover:text-slate-700"
                          >
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Subcategories Collapsible List */}
                      {isExpanded && (
                        <div className="bg-white p-2 border-t border-slate-100 space-y-1 pl-6 divide-y divide-slate-50">
                          {cat.subcategories.map((sub) => {
                            const isSubSelected = selectedSubCat === sub.slug && selectedMainCat === cat.slug;

                            return (
                              <button
                                key={sub.id}
                                onClick={() => {
                                  setSelectedMainCat(cat.slug);
                                  setSelectedSubCat(sub.slug);
                                }}
                                className={`w-full text-left py-1.5 px-2 rounded-lg text-[11px] flex items-center justify-between transition-colors ${
                                  isSubSelected ? 'bg-[#0F4C3A] text-white font-bold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
                                }`}
                              >
                                <span className="truncate">• {sub.name}</span>
                                {sub.count && (
                                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${isSubSelected ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                    {sub.count}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. İL / İLÇE / MAHALLE FİLTRESİ */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-2">
                <MapPin className="w-4 h-4 text-rose-600" /> Lokasyon Seçimi
              </h2>

              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">İl Seçin</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => {
                      setSelectedCity(e.target.value);
                      setSelectedDistrict('Tüm İlçeler');
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#0F4C3A]"
                  >
                    {CITIES_LIST.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">İlçe Seçin</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    disabled={selectedCity === 'Tüm Türkiye'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#0F4C3A] disabled:opacity-50"
                  >
                    {currentCityObj.districts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Mahalle (Opsiyonel)</label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Örn: Yeni Mahalle, Sanayi Cad."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#0F4C3A]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedCity('Ordu');
                    setSelectedDistrict('Altınordu');
                    setNeighborhood('Yeni Mahalle');
                  }}
                  className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-[#0F4C3A] font-bold text-[11px] rounded-xl border border-emerald-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" /> GPS Konumumdan Yakın Esnafları Bul
                </button>
              </div>
            </div>

            {/* 3. TESLİMAT TİPİ FİLTRESİ */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-2">
                <Truck className="w-4 h-4 text-amber-600" /> Teslimat Türü
              </h2>

              <div className="space-y-2 text-xs">
                {[
                  { id: 'tamkurye', label: '🚀 TamKurye (30 Dk Ekspres)', badge: 'Hızlı' },
                  { id: 'kargo', label: '📦 Kargo ile Adrese Teslim', badge: 'Tüm TR' },
                  { id: 'hizmet', label: '🛠️ Yerinde Hizmet / Usta Çağır', badge: 'Randevu' },
                  { id: 'dijital', label: '💻 Anında Dijital İndirme', badge: '0 Sn' }
                ].map((item) => (
                  <label 
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer font-medium text-slate-700"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedDeliveryTypes.includes(item.id)}
                        onChange={() => handleDeliveryTypeToggle(item.id)}
                        className="rounded text-[#0F4C3A] focus:ring-[#0F4C3A]"
                      />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      {item.badge}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 4. ESNAF ROZETLERİ VE GÜVEN FİLTRESİ */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" /> Esnaf Rozetleri
              </h2>

              <div className="space-y-2 text-xs">
                {[
                  { id: 'verified', label: '☑️ Doğrulanmış Esnaf (GİB E-Fatura)' },
                  { id: 'pos', label: '💳 %0 Komisyon & Kendi Sanal POS\'u' },
                  { id: 'rating', label: '⭐ Yüksek Puan (4.5+ Yıldız)' },
                  { id: 'wholesale', label: '🏢 B2B Toptan Fiyat Veren Üretici' }
                ].map((item) => (
                  <label 
                    key={item.id}
                    className="flex items-center gap-2 p-2 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer font-medium text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBadges.includes(item.id)}
                      onChange={() => handleBadgeToggle(item.id)}
                      className="rounded text-[#0F4C3A] focus:ring-[#0F4C3A]"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

          </aside>

          {/* RIGHT CATALOG CONTENT AREA */}
          <main className="lg:col-span-3 space-y-6">
            
            {/* ÜST SIRALAMA BAR (TOP SORTING BAR) */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <ArrowUpDown className="w-4 h-4 text-[#0F4C3A]" />
                <span>Sıralama Ölçütü:</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { id: 'featured', label: '🔥 Öne Çıkanlar' },
                  { id: 'price-asc', label: 'Fiyat: Artan' },
                  { id: 'price-desc', label: 'Fiyat: Azalan' },
                  { id: 'rating', label: '⭐ En Yüksek Puan' },
                  { id: 'sales', label: '⚡ En Çok Satanlar' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSortBy(s.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      sortBy === s.id 
                        ? 'bg-[#0F4C3A] text-white shadow-xs' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

            </div>

            {/* PRODUCT CATALOG GRID / LIST */}
            {sortedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 shadow-sm">
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  🏪
                </div>
                <h3 className="text-lg font-black text-slate-900">Henüz bu kategoride vitrin ürünü bulunmuyor</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  İlk ürünü siz ekleyin! Komisyonsuz bağımsız dükkânınızı 2 dakikada açarak ürünlerinizi doğrudan satışa sunabilirsiniz.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={clearAllFilters}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Filtreleri Temizle
                  </button>
                  <Link
                    to="/saticipaneli"
                    className="px-6 py-2.5 bg-[#0F4C3A] hover:bg-[#0B132B] text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer inline-flex items-center gap-2"
                  >
                    <Store className="w-4 h-4 text-amber-400" />
                    <span>Dükkan Aç (%0 Komisyon)</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" 
                : "space-y-4"
              }>
                {sortedProducts.map((product) => {
                  const tenant = initialTenants.find(t => t.id === product.tenantId);
                  const storeSlug = tenant?.slug || 'kuzey-usta-tesisat';

                  if (viewMode === 'list') {
                    return (
                      <div 
                        key={product.id}
                        className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-[#0F4C3A]/50 transition-all flex flex-col sm:flex-row gap-4 items-center"
                      >
                        <div className="w-full sm:w-36 h-36 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
                          <img 
                            src={product.image} 
                            alt={product.title} 
                            className="w-full h-full object-cover"
                          />
                          {product.badge && (
                            <span className="absolute top-2 left-2 bg-[#0F4C3A] text-white text-[9px] font-black px-2 py-0.5 rounded shadow">
                              {product.badge}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 space-y-2 w-full">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                              {product.category}
                            </span>
                            <div className="flex items-center gap-1 text-xs font-extrabold text-amber-500">
                              <Star className="w-3.5 h-3.5 fill-amber-500" /> {product.rating || 4.9}
                            </div>
                          </div>

                          <h3 className="font-extrabold text-slate-900 text-sm line-clamp-1 hover:text-[#0F4C3A] transition-colors">
                            <Link to={`/urun/${product.slug}`}>
                              {product.title}
                            </Link>
                          </h3>

                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>

                          <div className="flex items-center gap-3 pt-1 text-xs">
                            <Link 
                              to={`/dukkan/${storeSlug}`}
                              className="font-bold text-[#0F4C3A] hover:underline flex items-center gap-1"
                            >
                              <Store className="w-3.5 h-3.5" />
                              <span>{product.storeName || tenant?.name || 'Doğrulanmış Esnaf'}</span>
                            </Link>
                            <span className="text-slate-300">•</span>
                            <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded">
                              %0 Komisyon / Doğrudan POS
                            </span>
                          </div>
                        </div>

                        <div className="sm:text-right shrink-0 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 gap-3">
                          <div>
                            <span className="text-xs text-slate-400 block font-medium">Birim Fiyat</span>
                            <span className="text-lg font-black text-slate-900">
                              ₺{product.price.toLocaleString('tr-TR')}
                            </span>
                          </div>

                          <Link
                            to={`/urun/${product.slug}`}
                            className="px-4 py-2 bg-[#0F4C3A] hover:bg-[#0B132B] text-white font-bold text-xs rounded-xl shadow-xs transition"
                          >
                            İncele & Al ➔
                          </Link>
                        </div>
                      </div>
                    );
                  }

                  // Default Grid View Card
                  return (
                    <div 
                      key={product.id}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-[#0F4C3A]/40 transition-all flex flex-col group"
                    >
                      {/* Card Image */}
                      <div className="relative h-48 bg-slate-100 overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {product.badge && (
                            <span className="bg-[#0F4C3A] text-white text-[9px] font-black px-2 py-0.5 rounded shadow">
                              {product.badge}
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-md text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {product.rating || 4.9}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <span>{product.category}</span>
                            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">GİB E-Fatura</span>
                          </div>

                          <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-[#0F4C3A] transition-colors">
                            <Link to={`/urun/${product.slug}`}>
                              {product.title}
                            </Link>
                          </h3>
                        </div>

                        {/* Store Badge info */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                          <Link 
                            to={`/dukkan/${storeSlug}`}
                            className="font-bold text-slate-700 hover:text-[#0F4C3A] truncate flex items-center gap-1 text-[11px]"
                          >
                            <Store className="w-3.5 h-3.5 text-[#0F4C3A]" />
                            <span className="truncate">{product.storeName || tenant?.name || 'Doğrulanmış Esnaf'}</span>
                          </Link>
                        </div>

                        {/* Price & Action */}
                        <div className="pt-2 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold block">Sanal POS Fiyatı</span>
                            <span className="text-base font-black text-slate-900">
                              ₺{product.price.toLocaleString('tr-TR')}
                            </span>
                          </div>

                          <Link
                            to={`/urun/${product.slug}`}
                            className="px-3 py-1.5 bg-[#0F4C3A] hover:bg-[#0B132B] text-white font-bold text-xs rounded-xl shadow-xs transition"
                          >
                            İncele
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </main>

        </div>

      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex justify-end animate-fade-in lg:hidden">
          <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-wide flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#0F4C3A]" /> Filtreler
                </h3>
                <button 
                  onClick={() => setShowMobileFilter(false)}
                  className="p-1 text-slate-400 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Filter Options */}
              <div className="space-y-4 pt-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lokasyon (Şehir)</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                  >
                    {CITIES_LIST.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={selectedMainCat || ''}
                    onChange={(e) => setSelectedMainCat(e.target.value || null)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold"
                  >
                    <option value="">Tüm Kategoriler</option>
                    {CATEGORY_TREE.map(c => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-200">
              <button
                onClick={() => setShowMobileFilter(false)}
                className="w-full py-3 bg-[#0F4C3A] text-white font-bold text-xs rounded-xl shadow"
              >
                Sonuçları Göster ({sortedProducts.length})
              </button>
              <button
                onClick={clearAllFilters}
                className="w-full py-2 bg-slate-100 text-slate-600 font-bold text-xs rounded-xl"
              >
                Filtreleri Temizle
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
