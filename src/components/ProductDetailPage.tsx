/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Heart, Share2, Star, ShieldCheck, Truck, RotateCcw, 
  Store, MessageCircle, Phone, MapPin, Check, Plus, 
  ThumbsUp, UserCheck, ChevronRight, AlertCircle, ShoppingBag, Clock, Navigation, Zap
} from 'lucide-react';
import { initialProducts, initialTenants, Product } from '../data/mockData';
import { SAMPLE_PRODUCTS } from './SuperMallHome';

export default function ProductDetailPage({ slug, onBackToMarketplace }: { slug?: string; onBackToMarketplace?: () => void }) {
  // 1. Search in initialProducts
  const foundProduct = initialProducts.find(p => p.slug === slug || p.id === slug);
  
  // 2. If not found, search in SAMPLE_PRODUCTS (services, emergency, wholesale, food)
  const foundSampleService = !foundProduct ? SAMPLE_PRODUCTS.find(s => s.slug === slug || s.id === slug) : null;

  if (!foundProduct && !foundSampleService) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center font-sans">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full space-y-4">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto font-bold text-2xl border border-rose-100">
            !
          </div>
          <h2 className="text-xl font-black text-slate-900">Ürün veya Hizmet Bulunamadı</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Aradığınız ürün, acil çağrı veya esnaf hizmeti ({slug}) sistemimizde kayıtlı değil veya yayından kaldırılmış olabilir.
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

  // If foundSampleService is present (Service / Emergency / Wholesale / Food)
  if (foundSampleService) {
    const [callRequested, setCallRequested] = useState(false);
    const [whatsappRequested, setWhatsappRequested] = useState(false);

    return (
      <div className="min-h-screen bg-[#f8f9fa] text-slate-800 pb-20 font-sans">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span onClick={onBackToMarketplace} className="hover:text-indigo-900 font-semibold cursor-pointer">Ana Sayfa</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-amber-600 font-bold">{foundSampleService.category}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-800 font-bold truncate max-w-[220px]">{foundSampleService.title}</span>
            </div>
            <button
              onClick={onBackToMarketplace}
              className="px-3 py-1.5 bg-slate-900 hover:bg-indigo-950 text-white font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              ← Vitrine Geri Dön
            </button>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Image & Service Badge */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative h-80 md:h-[420px] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                <img 
                  src={foundSampleService.image} 
                  alt={foundSampleService.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-amber-500 text-slate-950 px-3 py-1.5 rounded-xl font-black text-xs shadow-lg flex items-center gap-1.5">
                  <Zap className="w-4 h-4 fill-slate-950" />
                  {foundSampleService.sector === 'EMERGENCY' ? '7/24 Acil Müdahale' : 'Doğrulanmış Esnaf Hizmeti'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-indigo-600 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Ortalama Varış / Süre</span>
                    <span className="text-slate-800">{foundSampleService.etaMinutes || foundSampleService.serviceDuration || 'Anında / 30 Dk'}</span>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-2.5">
                  <MapPin className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Hizmet Bölgesi</span>
                    <span className="text-slate-800">{foundSampleService.store.district} / {foundSampleService.store.city}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Service Action & Details Panel */}
            <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-50 text-indigo-900 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100">
                    {foundSampleService.category}
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Esnaf Güvence Garantisi
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                  {foundSampleService.title}
                </h1>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="text-slate-800">{foundSampleService.store.rating}</span>
                    <span className="text-slate-400 font-normal">({foundSampleService.store.reviewCount} Değerlendirme)</span>
                  </div>
                  <span>•</span>
                  <span className="text-indigo-600 font-semibold">{foundSampleService.store.name}</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 font-bold block">Taban Hizmet / Servis Bedeli</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-slate-900">₺{foundSampleService.price.toLocaleString('tr-TR')}</span>
                    <span className="text-xs text-slate-500 font-medium">+ KDV (%{foundSampleService.vatRate}) · Malzeme ve İşçilik Dahil</span>
                  </div>
                  <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                    Bu hizmet doğrudan esnafın kendi kasasına aktarılır. Komisyon kesintisi yoktur. Yerinde keşif ve acil çağrı için hemen iletişime geçebilirsiniz.
                  </p>
                </div>
              </div>

              {/* Action Buttons for Service / Emergency */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={`tel:${foundSampleService.store.phone}`}
                    onClick={() => setCallRequested(true)}
                    className="py-3.5 px-4 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-amber-400" />
                    Doğrudan Ara ({foundSampleService.store.phone})
                  </a>

                  <a
                    href={`https://wa.me/${foundSampleService.store.whatsapp}?text=Merhaba%2C+${encodeURIComponent(foundSampleService.title)}+hizmeti+için+bilgi+almak+istiyorum.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setWhatsappRequested(true)}
                    className="py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp İle Hızlı Çağrı
                  </a>
                </div>

                {callRequested && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold animate-fade-in flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    Arama bağlantısı başlatıldı. Esnaf ekibi anında çağrınıza yanıt verecektir.
                  </div>
                )}

                {whatsappRequested && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold animate-fade-in flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    WhatsApp sohbeti açıldı. Konumunuzu ve talebinizi iletebilirsiniz.
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Standard Product View if foundProduct is present
  const tenant = initialTenants.find(t => t.id === foundProduct?.tenantId) || initialTenants[0];

  const product = {
    id: foundProduct!.id,
    slug: foundProduct!.slug,
    title: foundProduct!.title,
    tag: foundProduct!.badge || 'TamPazar Ürünü',
    description: foundProduct!.description,
    price: foundProduct!.price,
    originalPrice: Math.round(foundProduct!.price * 1.2),
    vatRate: foundProduct!.vatRate,
    rating: foundProduct!.rating || 4.8,
    reviewCount: foundProduct!.salesCount ? Math.max(12, Math.floor(foundProduct!.salesCount / 3)) : 24,
    favoriteCount: 340,
    images: [
      foundProduct!.image,
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=900&auto=format&fit=crop&q=80',
    ],
    sizes: foundProduct!.variants?.sizes || ['Standart', 'Özel Ölçü'],
    colors: foundProduct!.variants?.colors?.map(c => ({ name: c, hex: '#333333' })) || [{ name: 'Standart', hex: '#333333' }],
    store: {
      name: foundProduct!.storeName || tenant.name,
      slug: tenant.slug,
      rating: tenant.rating || 4.9,
      followerCount: tenant.reviews ? tenant.reviews * 10 : 1250,
      address: 'Ordu / Altınordu (Fiziksel Doğrulanmış Esnaf Mağazası)',
      phone: '+90 (452) 222 33 44',
      whatsapp: '905321112233',
      paymentProvider: tenant.byoPosConnected ? `Doğrudan ${tenant.activePos?.toUpperCase() || 'Sanal'} POS` : 'TamPazar Güvencesi',
      isPhysicalVerified: true,
    },
    reviews: [
      {
        id: 'rev-1',
        author: 'Emre K.',
        rating: 5,
        date: '18 Eylül 2026',
        sizeBought: 'Seçilen Varyant',
        colorBought: 'Standart',
        comment: 'Ürün kalitesi muazzam. Doğrudan esnaf kasasından faturalı ve hızlı bir şekilde kargolandı.',
        likes: 14,
      }
    ]
  };

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(product.favoriteCount);
  const [isFollowingStore, setIsFollowingStore] = useState(false);
  const [followerCount, setFollowerCount] = useState(product.store.followerCount);
  const [addedToCart, setAddedToCart] = useState(false);

  const toggleFavorite = () => {
    if (isFavorite) {
      setIsFavorite(false);
      setFavoriteCount(prev => prev - 1);
    } else {
      setIsFavorite(true);
      setFavoriteCount(prev => prev + 1);
    }
  };

  const toggleFollowStore = () => {
    if (isFollowingStore) {
      setIsFollowingStore(false);
      setFollowerCount(prev => prev - 1);
    } else {
      setIsFollowingStore(true);
      setFollowerCount(prev => prev + 1);
    }
  };

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-800 pb-20">
      
      {/* 1. ÜST KATEGORİ YOLU (Breadcrumb) & GERİ DÖN */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span onClick={onBackToMarketplace} className="hover:text-indigo-900 font-semibold cursor-pointer">Ana Sayfa</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="hover:text-indigo-900 font-semibold cursor-pointer">{foundProduct!.category}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-bold truncate max-w-[200px]">{foundProduct!.title}</span>
          </div>

          <button
            onClick={onBackToMarketplace}
            className="px-3 py-1.5 bg-slate-900 hover:bg-indigo-950 text-white font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            ← Vitrine / Alışverişe Geri Dön
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        {/* ========================================================= */}
        {/* 2. ANA ÜRÜN BLOĞU (Görseller + Satın Alma Paneli) */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* SOL: GÖRSEL GALERİSİ (5 Kolon) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Büyük Ana Görsel */}
            <div className="relative h-96 md:h-[480px] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group">
              <img 
                src={product.images[selectedImage]} 
                alt={product.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <button 
                onClick={toggleFavorite}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md hover:bg-white transition cursor-pointer text-slate-700"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'text-rose-600 fill-rose-600' : 'text-slate-600'}`} />
              </button>
              <div className="absolute top-4 left-4 bg-amber-500 text-slate-950 px-3 py-1 rounded-xl font-black text-xs shadow">
                {product.tag}
              </div>
            </div>

            {/* Küçük Thumbnail Listesi */}
            <div className="grid grid-cols-3 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative h-24 rounded-xl overflow-hidden border-2 transition cursor-pointer ${selectedImage === idx ? 'border-indigo-900 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* SAĞ: ÜRÜN BİLGİLERİ VE SATIN ALMA (7 Kolon) */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Kategori ve Değerlendirme */}
              <div className="flex items-center justify-between text-xs">
                <span className="bg-indigo-50 text-indigo-900 px-3 py-1 rounded-full font-bold border border-indigo-100">
                  {foundProduct!.category}
                </span>
                <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="text-slate-900">{product.rating}</span>
                  <span className="text-slate-400 font-normal">({product.reviewCount} Değerlendirme)</span>
                </div>
              </div>

              {/* Ürün Başlığı */}
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {product.title}
              </h1>

              {/* Fiyat ve KDV Bandı */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 font-bold block">Esnaf Doğrudan Fiyatı</span>
                  <div className="flex items-baseline gap-3 mt-0.5">
                    <span className="text-3xl md:text-4xl font-black text-slate-900">₺{product.price.toLocaleString('tr-TR')}</span>
                    <span className="text-xs text-slate-400 line-through">₺{product.originalPrice.toLocaleString('tr-TR')}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg text-xs font-bold inline-block">
                    %0 Komisyonlu Fiyat
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1">KDV (%{product.vatRate}) Dahil</span>
                </div>
              </div>

              {/* Varyantlar (Beden / Ölçü / Renk) */}
              <div className="space-y-4 pt-2">
                {/* Ölçü / Beden */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">Ölçü / Beden Seçimi:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${selectedSize === size ? 'bg-indigo-900 text-white border-indigo-900 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Renk Seçenekleri */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">Renk / Doku Seçimi:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((col) => (
                      <button
                        key={col.name}
                        onClick={() => setSelectedColor(col.name)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer border flex items-center gap-2 ${selectedColor === col.name ? 'bg-indigo-900 text-white border-indigo-900 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'}`}
                      >
                        <span className="w-3 h-3 rounded-full border border-slate-300 shadow-inner" style={{ backgroundColor: col.hex }}></span>
                        {col.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ürün Açıklaması */}
              <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                {product.description}
              </p>
            </div>

            {/* Alt Sepete Ekleme ve Satın Alma Eylemi */}
            <div className="space-y-4 pt-6 border-t border-slate-200">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-2xl transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {addedToCart ? 'Sepete Eklendi ✓' : 'Hemen Sepete Ekle & Al'}
                </button>

                <button
                  onClick={toggleFavorite}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-center ${isFavorite ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-600' : ''}`} />
                </button>
              </div>

              {addedToCart && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold animate-fade-in flex items-center justify-between">
                  <span>Ürün sepetinize başarıyla eklendi! Doğrudan esnaf kasasından faturalandırılacaktır.</span>
                  <span className="font-bold underline cursor-pointer" onClick={onBackToMarketplace}>Sepete Git →</span>
                </div>
              )}

              {/* Güven Rozetleri */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] text-slate-500">
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-700">Doğrudan POS</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-indigo-600" />
                  <span className="font-bold text-slate-700">Hızlı Kargo</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-amber-600" />
                  <span className="font-bold text-slate-700">14 Gün İade</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. ESNAF / MAĞAZA PROFİL KARTI */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-900 text-amber-400 font-black text-2xl flex items-center justify-center shadow-md border border-indigo-800">
                {product.store.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900">{product.store.name}</h3>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Fiziksel Doğrulanmış Esnaf
                  </span>
                </div>
                <p className="text-xs text-slate-500">{product.store.address} · {product.store.paymentProvider}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleFollowStore}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer border ${isFollowingStore ? 'bg-indigo-900 text-white border-indigo-900' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'}`}
              >
                {isFollowingStore ? 'Mağazayı Takip Ediyorsun ✓' : '+ Mağazayı Takip Et'}
              </button>

              <a
                href={`tel:${product.store.phone}`}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition cursor-pointer border border-slate-200"
                title="Esnafı Ara"
              >
                <Phone className="w-4 h-4" />
              </a>

              <a
                href={`https://wa.me/${product.store.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition cursor-pointer border border-emerald-200"
                title="WhatsApp Destek"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-slate-600">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Mağaza Puanı</span>
              <span className="text-slate-900 font-bold text-sm flex items-center gap-1 mt-0.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" /> {product.store.rating} / 5.0
              </span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Takipçi & Müşteri</span>
              <span className="text-slate-900 font-bold text-sm mt-0.5 block">{followerCount.toLocaleString('tr-TR')} Kişi</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Ödeme Altyapısı</span>
              <span className="text-slate-900 font-bold text-sm mt-0.5 block">{product.store.paymentProvider}</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Kargo & Fatura</span>
              <span className="text-slate-900 font-bold text-sm mt-0.5 block">GİB e-Fatura Entegre</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
