/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Heart, Share2, Star, ShieldCheck, Truck, RotateCcw, 
  Store, MessageCircle, Phone, MapPin, Check, Plus, 
  ThumbsUp, UserCheck, ChevronRight, AlertCircle, ShoppingBag
} from 'lucide-react';
import { initialProducts, initialTenants, Product } from '../data/mockData';

export default function ProductDetailPage({ slug, onBackToMarketplace }: { slug?: string; onBackToMarketplace?: () => void }) {
  // Find product by slug or id
  const foundProduct = initialProducts.find(p => p.slug === slug || p.id === slug);

  if (!foundProduct) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center font-sans">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full space-y-4">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto font-bold text-2xl border border-rose-100">
            !
          </div>
          <h2 className="text-xl font-black text-slate-900">Ürün Bulunamadı</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Aradığınız ürün veya ilan ({slug}) sistemimizde kayıtlı değil veya yayından kaldırılmış olabilir.
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
  
  // Find store/tenant data if available
  const tenant = initialTenants.find(t => t.id === foundProduct.tenantId) || initialTenants[0];

  const product = {
    id: foundProduct.id,
    slug: foundProduct.slug,
    title: foundProduct.title,
    tag: foundProduct.badge || 'TamPazar Ürünü',
    description: foundProduct.description,
    price: foundProduct.price,
    originalPrice: Math.round(foundProduct.price * 1.2),
    vatRate: foundProduct.vatRate,
    rating: foundProduct.rating || 4.8,
    reviewCount: foundProduct.salesCount ? Math.max(12, Math.floor(foundProduct.salesCount / 3)) : 24,
    favoriteCount: 340,
    images: [
      foundProduct.image,
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=900&auto=format&fit=crop&q=80',
    ],
    sizes: foundProduct.variants?.sizes || ['Standart', 'Özel Ölçü'],
    colors: foundProduct.variants?.colors?.map(c => ({ name: c, hex: '#333333' })) || [{ name: 'Standart', hex: '#333333' }],
    store: {
      name: foundProduct.storeName || tenant.name,
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

  // Durum Yönetimleri
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(product.favoriteCount);
  const [isFollowingStore, setIsFollowingStore] = useState(false);
  const [followerCount, setFollowerCount] = useState(product.store.followerCount);
  const [addedToCart, setAddedToCart] = useState(false);

  // Favoriye Ekleme Fonksiyonu
  const toggleFavorite = () => {
    if (isFavorite) {
      setIsFavorite(false);
      setFavoriteCount(prev => prev - 1);
    } else {
      setIsFavorite(true);
      setFavoriteCount(prev => prev + 1);
    }
  };

  // Mağazayı Takip Et Fonksiyonu
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
            <span className="hover:text-indigo-900 font-semibold cursor-pointer">{foundProduct.category}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-bold truncate max-w-[200px]">{foundProduct.title}</span>
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
              <span className="absolute top-4 left-4 text-xs font-black bg-emerald-600 text-white px-3 py-1 rounded-full shadow-md">
                {product.tag}
              </span>

              {/* Favori Butonu (Görselin Üstünde) */}
              <button 
                onClick={toggleFavorite}
                className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/95 backdrop-blur-sm shadow-md flex items-center justify-center transition hover:scale-110 cursor-pointer"
                title="Favorilere Ekle"
              >
                <Heart className={`w-5 h-5 transition ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`} />
              </button>
            </div>

            {/* Küçük Thumbnail Listesi */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                    selectedImage === idx ? 'border-indigo-600 shadow-md ring-2 ring-indigo-100' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Görsel ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* SAĞ: ÜRÜN BİLGİSİ, VARYANTLAR VE MAĞAZA (7 Kolon) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              {/* Mağaza & Takip Et Bandı */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 font-black flex items-center justify-center text-sm shadow-xs">
                    {tenant.logo || 'M'}
                  </div>
                  <div>
                    <span className="font-extrabold text-sm text-slate-900 hover:text-indigo-900 flex items-center gap-1.5 cursor-pointer">
                      {product.store.name}
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </span>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="font-bold text-amber-600 flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {product.store.rating} Mağaza Puanı
                      </span>
                      <span>•</span>
                      <span>{followerCount.toLocaleString('tr-TR')} Takipçi</span>
                    </div>
                  </div>
                </div>

                {/* Mağazayı Takip Et Butonu */}
                <button
                  onClick={toggleFollowStore}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                    isFollowingStore
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
                  }`}
                >
                  {isFollowingStore ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Takip Ediliyor
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" /> Mağazayı Takip Et
                    </>
                  )}
                </button>
              </div>

              {/* Başlık ve Değerlendirme */}
              <div className="mt-4 space-y-2">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                  {product.title}
                </h1>
                
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="font-bold text-amber-900 ml-1">{product.rating}</span>
                  </div>
                  <a href="#yorumlar" className="text-indigo-600 hover:underline font-semibold">
                    {product.reviewCount} Değerlendirme
                  </a>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> {favoriteCount} Favori
                  </span>
                </div>
              </div>

              {/* Fiyat Alanı */}
              <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-baseline justify-between">
                <div>
                  <div className="text-[11px] font-mono text-slate-400 line-through">
                    {product.originalPrice.toLocaleString('tr-TR')} ₺
                  </div>
                  <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                    {product.price.toLocaleString('tr-TR')} <span className="text-sm font-sans font-bold text-indigo-600">₺</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full">
                    KDV (%{product.vatRate}) Dahil
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1">Stokta Var · Aynı Gün Kargo</div>
                </div>
              </div>

              {/* Varyant Seçimleri (Beden / Ölçü) */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">Ölçü / Seçenek:</label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                          selectedSize === size
                            ? 'bg-indigo-900 text-white border-indigo-900 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Renk Seçenekleri */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">Renk / Konsept:</label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-2 cursor-pointer ${
                          selectedColor === c.name
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full border border-white shadow-xs" style={{ backgroundColor: c.hex }}></span>
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sepete Ekle ve Satın Al */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-indigo-900 hover:bg-indigo-800 text-white py-3.5 px-6 rounded-2xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {addedToCart ? 'Sepete Eklendi! ✓' : 'Sepete Ekle'}
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-6 rounded-2xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  Hemen Satın Al (BYO POS)
                </button>
              </div>

              <div className="flex items-center justify-center gap-6 text-[11px] text-slate-500 pt-2">
                <span className="flex items-center gap-1 font-medium"><ShieldCheck className="w-4 h-4 text-emerald-600" /> %100 Güvenli Esnaf Ödemesi</span>
                <span className="flex items-center gap-1 font-medium"><Truck className="w-4 h-4 text-indigo-600" /> Aynı Gün Kargo</span>
                <span className="flex items-center gap-1 font-medium"><RotateCcw className="w-4 h-4 text-amber-600" /> 14 Gün İade</span>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. AÇIKLAMA VE ÜRÜN ÖZELLİKLERİ */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3">Ürün Açıklaması</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            {product.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Doğrudan Fatura & Garanti</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Ürününüz doğrudan üretici esnaf tarafından GİB e-Fatura mevzuatına uygun olarak adınıza faturalandırılır.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
              <Store className="w-5 h-5 text-indigo-900 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Esnaf Doğrulanmış Konum</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{product.store.address} adresindeki fiziksel işletmeden doğrudan gönderilir veya teslim alınabilir.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. ESNAF YORUMLARI */}
        {/* ========================================================= */}
        <div id="yorumlar" className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-xl font-black text-slate-900">Müşteri Yorumları ({product.reviews.length})</h2>
            <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
              <Star className="w-4 h-4 fill-amber-400" /> {product.rating} / 5.0
            </div>
          </div>

          <div className="space-y-4">
            {product.reviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{rev.author}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({rev.sizeBought} / {rev.colorBought})</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{rev.date}</span>
                </div>
                <div className="flex text-amber-400 text-xs">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-400">
                  <button className="flex items-center gap-1 hover:text-indigo-900 cursor-pointer">
                    <ThumbsUp className="w-3 h-3" /> Faydalı ({rev.likes})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
