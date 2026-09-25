/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, Star, Filter, ArrowRight, Store, ChevronRight, 
  Tag, SlidersHorizontal, Check, RefreshCw, X, Heart, ShieldCheck, 
  Truck, Zap, Sparkles, MapPin, Grid, ListFilter
} from 'lucide-react';
import { HEADER_CATEGORIES, HeaderCategory } from '../components/ModernHeader';
import { initialProducts, Product } from '../data/mockData';
import ModernHeader from '../components/ModernHeader';
import { applyPageSEO } from '../utils/seo';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const currentSlug = slug || 'all';

  // Find category meta from HEADER_CATEGORIES
  const matchedCategory = HEADER_CATEGORIES.find(
    c => c.slug === currentSlug || c.id === currentSlug
  );

  const categoryTitle = matchedCategory 
    ? matchedCategory.name 
    : (currentSlug === 'all' ? 'Tüm Vitrin' : currentSlug.toUpperCase());

  // SEO
  useEffect(() => {
    const pageTitle = `${categoryTitle} Modelleri ve Esnaf Fiyatları | TamPazar`;
    document.title = pageTitle;
    applyPageSEO({
      pathname: `/kategori/${currentSlug}`,
      title: pageTitle,
      description: `${categoryTitle} kategorisindeki komisyonsuz esnaf fiyatlarını inceleyin, doğrudan dükkandan sipariş verin.`
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentSlug, categoryTitle]);

  // Products state
  const [products] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('tampazar_products');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return initialProducts;
  });

  // Filter States
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSub = searchParams.get('sub') || 'all';

  const [selectedSubCategory, setSelectedSubCategory] = useState<string>(initialSub);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sub = params.get('sub');
    if (sub) {
      setSelectedSubCategory(sub);
    } else {
      setSelectedSubCategory('all');
    }
  }, [location.search, currentSlug]);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [selectedDelivery, setSelectedDelivery] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'price_desc' | 'newest' | 'rating'>('recommended');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Cart state for header
  const [cartCount, setCartCount] = useState(0);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  // Filter logic
  const filteredProducts = products.filter(item => {
    // 1. Category Filter
    let matchesCategory = false;
    if (currentSlug === 'all') {
      matchesCategory = true;
    } else {
      const catSlugLower = currentSlug.toLowerCase();
      const itemCatLower = (item.categorySlug || item.category || '').toLowerCase();
      matchesCategory = itemCatLower.includes(catSlugLower) ||
        (catSlugLower === 'mahalle-hizli' && (item.category.includes('Gıda') || item.category.includes('Hızlı') || item.category.includes('Yemek') || item.category.includes('Kasap') || item.category.includes('Fırın') || item.category.includes('Manav'))) ||
        (catSlugLower === 'moda-giyim-zanaat' && (item.category.includes('Moda') || item.category.includes('Giyim') || item.category.includes('Ayakkabı') || item.category.includes('Zanaat') || item.category.includes('Tekstil'))) ||
        (catSlugLower === 'ev-yasam-yapi-market' && (item.category.includes('Ev') || item.category.includes('Mutfak') || item.category.includes('Yapı') || item.category.includes('Hırdavat'))) ||
        (catSlugLower === 'hizmet-ustalik-bakim' && (item.type === 'service' || item.category.includes('Hizmet') || item.category.includes('Usta') || item.category.includes('Çilingir'))) ||
        (catSlugLower === 'tamdijital' && (item.category.includes('Dijital') || item.category.includes('Yazılım') || item.category.includes('Tasarım')));
    }

    // 2. Subcategory Filter
    let matchesSub = true;
    if (selectedSubCategory !== 'all') {
      matchesSub = item.title.toLowerCase().includes(selectedSubCategory.toLowerCase()) ||
        item.category.toLowerCase().includes(selectedSubCategory.toLowerCase());
    }

    // 3. Price Filter
    let matchesPrice = true;
    const itemPrice = item.price;
    if (minPrice && !isNaN(Number(minPrice))) {
      matchesPrice = matchesPrice && itemPrice >= Number(minPrice);
    }
    if (maxPrice && !isNaN(Number(maxPrice))) {
      matchesPrice = matchesPrice && itemPrice <= Number(maxPrice);
    }

    // 4. Delivery Filter
    let matchesDelivery = true;
    if (selectedDelivery !== 'all') {
      if (selectedDelivery === 'cargo') {
        matchesDelivery = item.deliveryOptions?.type === 'physical_cargo' || !item.deliveryOptions;
      } else if (selectedDelivery === 'local') {
        matchesDelivery = item.deliveryOptions?.type === 'local_express' || item.category.includes('Gıda') || item.category.includes('Hızlı');
      } else if (selectedDelivery === 'service') {
        matchesDelivery = item.type === 'service' || item.deliveryOptions?.type === 'field_service';
      } else if (selectedDelivery === 'digital') {
        matchesDelivery = item.type === 'digital' || item.deliveryOptions?.type === 'digital_download';
      }
    }

    // 5. Location Filter
    let matchesLocation = true;
    if (selectedLocation !== 'all' && item.storeName) {
      matchesLocation = item.storeName.toLowerCase().includes(selectedLocation.toLowerCase());
    }

    return matchesCategory && matchesSub && matchesPrice && matchesDelivery && matchesLocation;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'newest') return b.id.localeCompare(a.id);
    return 0; // recommended
  });

  const resetFilters = () => {
    setSelectedSubCategory('all');
    setMinPrice('');
    setMaxPrice('');
    setSelectedDelivery('all');
    setSelectedLocation('all');
    setSortBy('recommended');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-950">
      
      {/* Modern Header */}
      <ModernHeader
        selectedCategory={currentSlug}
        cartCount={cartCount}
        onOpenCart={() => navigate('/')}
        onOpenSellerModal={() => navigate('/saticipaneli')}
      />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6 flex-1 w-full">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500 overflow-x-auto py-1">
          <Link to="/" className="hover:text-[#0F4C3A] transition flex items-center gap-1">
            <span>Ana Sayfa</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link to="/kategori/all" className="hover:text-[#0F4C3A] transition">
            Kategoriler
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-[#0F4C3A] font-extrabold truncate">{categoryTitle}</span>
        </nav>

        {/* Category Header Hero Card */}
        <div className="bg-gradient-to-r from-[#0B132B] via-[#0F4C3A] to-[#0B132B] text-white rounded-3xl p-6 md:p-8 shadow-xl border border-emerald-900/60 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-3 z-10 max-w-2xl text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#F59E0B] text-[#0B132B] uppercase tracking-wider shadow-sm">
                <Zap className="w-3.5 h-3.5 fill-[#0B132B]" /> Komisyonsuz Esnaf Fiyatı
              </span>
              {matchedCategory?.badge && (
                <span className="bg-emerald-500/20 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                  {matchedCategory.badge}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white flex items-center justify-center md:justify-start gap-3">
              <span className="text-3xl">{matchedCategory?.icon || '🛍️'}</span>
              <span>{categoryTitle}</span>
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium">
              TamPazar komisyonsuz pazaryeri garantisiyle doğrudan esnaftan, üreticiden ve ustadan alışveriş yapın. Cironun %100’ü esnafta kalır!
            </p>

            {/* Quick Tags */}
            {matchedCategory?.quickTags && matchedCategory.quickTags.length > 0 && (
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-2">
                {matchedCategory.quickTags.map((tag, tIdx) => (
                  <span key={tIdx} className="text-[11px] font-bold bg-white/10 hover:bg-white/20 text-slate-200 px-2.5 py-1 rounded-xl transition border border-white/10">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="shrink-0 z-10 text-center">
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 space-y-1 shadow-xl">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#F59E0B] block font-black">Listelenen Reyon Ürünü</span>
              <span className="text-3xl sm:text-4xl font-black text-white">{filteredProducts.length} Çeşit</span>
              <span className="text-xs text-emerald-200 block font-medium">%0 Aracı Komisyonu</span>
            </div>
          </div>
        </div>

        {/* Main Grid with Sidebar + Product Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Mobil Filtre Aç Butonu */}
          <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-black text-slate-800 flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#0F4C3A]" />
              <span>Filtrele & Sırala ({filteredProducts.length} Ürün)</span>
            </span>
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="px-3 py-1.5 bg-[#0F4C3A] text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              {isMobileFilterOpen ? 'Kapat' : 'Filtreleri Göster'}
            </button>
          </div>

          {/* SOL FİLTRELEME PANELİ (Sidebar) */}
          <aside className={`lg:col-span-3 space-y-6 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#0F4C3A]" />
                <span>Detaylı Filtreler</span>
              </h3>
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-slate-500 hover:text-rose-600 font-bold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Sıfırla
              </button>
            </div>

            {/* Alt Kategoriler Listesi */}
            {matchedCategory?.subCategories && matchedCategory.subCategories.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-500" />
                  <span>Alt Kategoriler</span>
                </h4>

                <div className="space-y-1 max-h-56 overflow-y-auto scrollbar-none pr-1">
                  <button
                    type="button"
                    onClick={() => setSelectedSubCategory('all')}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                      selectedSubCategory === 'all' 
                        ? 'bg-emerald-50 text-[#0F4C3A] font-extrabold' 
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>Tüm Alt Kategoriler</span>
                    {selectedSubCategory === 'all' && <Check className="w-3.5 h-3.5 text-[#0F4C3A]" />}
                  </button>

                  {matchedCategory.subCategories.flatMap(group => group.items).map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedSubCategory(item.name)}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center justify-between cursor-pointer ${
                        selectedSubCategory === item.name 
                          ? 'bg-emerald-50 text-[#0F4C3A] font-extrabold' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{item.name}</span>
                      {item.badge && (
                        <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Fiyat Aralığı Filtresi */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Fiyat Aralığı (₺)
              </h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="En Az"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0F4C3A]"
                />
                <span className="text-slate-400 font-bold">-</span>
                <input
                  type="number"
                  placeholder="En Çok"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0F4C3A]"
                />
              </div>
            </div>

            {/* Teslimat Tipi Filtresi */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Teslimat Modu</span>
              </h4>
              <div className="space-y-1.5 text-xs font-medium">
                {[
                  { id: 'all', label: 'Tüm Teslimat Türleri' },
                  { id: 'cargo', label: '📦 Anlaşmalı Kargo' },
                  { id: 'local', label: '⚡ 30 Dk TamHızlı Mahalle' },
                  { id: 'service', label: '👨‍🔧 Saha Servisi / Usta' },
                  { id: 'digital', label: '💻 Anında Dijital İndirme' }
                ].map(del => (
                  <label key={del.id} className="flex items-center gap-2 cursor-pointer hover:text-[#0F4C3A] py-1">
                    <input
                      type="radio"
                      name="deliveryType"
                      checked={selectedDelivery === del.id}
                      onChange={() => setSelectedDelivery(del.id)}
                      className="accent-[#0F4C3A]"
                    />
                    <span>{del.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Mahalle / Esnaf Konum Filtresi */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>Esnaf Konumu</span>
              </h4>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0F4C3A] cursor-pointer"
              >
                <option value="all">Tüm Şehirler / İlçeler</option>
                <option value="kadıköy">İstanbul / Kadıköy</option>
                <option value="beşiktaş">İstanbul / Beşiktaş</option>
                <option value="üsküdar">İstanbul / Üsküdar</option>
                <option value="çankaya">Ankara / Çankaya</option>
                <option value="karşıyaka">İzmir / Karşıyaka</option>
              </select>
            </div>

            {/* Güvenlik Rozeti */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1 text-center">
              <ShieldCheck className="w-5 h-5 text-[#0F4C3A] mx-auto" />
              <span className="text-[11px] font-black text-[#0F4C3A] block">GİB e-Fatura Garantili</span>
              <p className="text-[10px] text-slate-600 leading-snug">
                Siparişiniz tamamlandığı an esnafın kendi sisteminden kurumsal e-Faturanız kesilir.
              </p>
            </div>

          </aside>

          {/* SAĞ İÇERİK BÖLÜMÜ (Product Grid & Sorting) */}
          <section className="lg:col-span-9 space-y-6">
            
            {/* Üst Sıralama ve Sayaç Barı */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs font-bold text-slate-700">
                <span className="text-[#0F4C3A] font-black">{sortedProducts.length}</span> Ürün Listeleniyor
                {selectedSubCategory !== 'all' && (
                  <span className="ml-2 font-normal text-slate-500">({selectedSubCategory} filtresi aktif)</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Sırala:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0F4C3A] cursor-pointer"
                >
                  <option value="recommended">Önerilen Sıralama</option>
                  <option value="price_asc">Fiyata Göre Artan (En Ucuz)</option>
                  <option value="price_desc">Fiyata Göre Azalan (En Pahalı)</option>
                  <option value="rating">Müşteri Puanına Göre</option>
                  <option value="newest">En Yeni Ürünler</option>
                </select>
              </div>
            </div>

            {/* ÜRÜN GRID VEYA BOŞ DURUM (Empty State) */}
            {sortedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center space-y-5 border border-slate-200 shadow-xs max-w-2xl mx-auto my-8">
                <div className="w-20 h-20 mx-auto bg-amber-50 rounded-3xl flex items-center justify-center text-4xl shadow-inner border border-amber-200">
                  🏬
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900">
                    Bu kategoride henüz vitrin ürünü bulunmuyor.
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    Aradığınız kritere uygun ürün bulunamadı. İlk mağazayı açarak %0 komisyon avantajıyla ürünlerinizi hemen Türkiye'ye ve mahallenize satın!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                  <Link
                    to="/saticipaneli"
                    className="w-full sm:w-auto px-6 py-3 bg-[#0F4C3A] hover:bg-[#0B382B] text-white rounded-2xl text-xs font-black shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Store className="w-4 h-4 text-amber-400" />
                    <span>Hemen Mağaza Aç (%0 Komisyon)</span>
                  </Link>

                  <button
                    type="button"
                    onClick={resetFilters}
                    className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-bold transition cursor-pointer"
                  >
                    Filtreleri Temizle
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {sortedProducts.map((product) => {
                  const oldPrice = Math.round(product.price * 1.25);
                  const isFav = favorites.includes(product.id);

                  return (
                    <div
                      key={product.id}
                      onClick={() => navigate(`/urun/${product.slug}`)}
                      className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group overflow-hidden"
                    >
                      {/* Ürün Görseli & Rozetler */}
                      <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={`${product.title} - TamPazar`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
                          }}
                        />

                        {product.badge && (
                          <div className="absolute top-3 left-3 bg-[#F59E0B] text-slate-950 px-2.5 py-1 rounded-xl font-black text-[10px] shadow-sm">
                            {product.badge}
                          </div>
                        )}

                        <button 
                          type="button"
                          onClick={(e) => toggleFavorite(product.id, e)}
                          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow hover:bg-white transition cursor-pointer"
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'text-rose-600 fill-rose-600' : 'text-slate-600'}`} />
                        </button>

                        <div className="absolute bottom-2 left-2 bg-[#0F4C3A] text-white px-2 py-0.5 rounded-lg font-bold text-[10px]">
                          %0 Komisyonlu
                        </div>
                      </div>

                      {/* Ürün Detay Bilgisi */}
                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider block truncate">
                            {product.storeName || 'TamPazar Esnafı'}
                          </span>
                          <h3 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-[#0F4C3A] transition">
                            {product.title}
                          </h3>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <div className="flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1 text-amber-500 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              <span className="text-slate-800">{product.rating || 4.8}</span>
                              <span className="text-slate-400 font-normal">({product.salesCount || 18})</span>
                            </div>

                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                              {product.category}
                            </span>
                          </div>

                          <div className="flex items-baseline justify-between pt-1">
                            <div>
                              <span className="text-[10px] text-slate-400 line-through block">₺{oldPrice.toLocaleString('tr-TR')}</span>
                              <span className="text-lg font-black text-slate-900">₺{product.price.toLocaleString('tr-TR')}</span>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/urun/${product.slug}`);
                              }}
                              className="px-3.5 py-2 bg-[#0F4C3A] hover:bg-[#0B382B] text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-xs flex items-center gap-1"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" /> İncele
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </section>

        </div>

      </main>

    </div>
  );
}
