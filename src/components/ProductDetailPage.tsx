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

// Örnek Ürün ve Yorum Verisi
const PRODUCT_DATA = {
  id: 'prod-oxford-01',
  slug: 'minimalist-deri-oxford-ayakkabi',
  title: 'Minimalist Deri Oxford Ayakkabı (Çift Tokalı Monkstrap)',
  tag: 'El Yapımı Deri',
  description: 'Hakiki dana derisinden el işçiliğiyle üretilmiş, kösele tabanlı şık Oxford ayakkabı. Klasik silueti modern İtalyan kalıbıyla birleştirir. %100 yerli üretim olup atölyemizde özenle dikilmiştir.',
  price: 3450,
  originalPrice: 4200,
  vatRate: 20,
  rating: 4.8,
  reviewCount: 142,
  favoriteCount: 1289,
  images: [
    'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=900&auto=format&fit=crop&q=80',
  ],
  sizes: ['40', '41', '42', '43', '44', '45'],
  colors: [
    { name: 'Taba', hex: '#8B4513' },
    { name: 'Siyah', hex: '#1A1A1A' },
    { name: 'Koyu Kahve', hex: '#3E2723' },
  ],
  store: {
    name: 'Mert Kundura Ltd.',
    slug: 'mert-kundura',
    rating: 4.9,
    followerCount: 3820,
    address: 'Çarşı Cad. Kunduracılar Sitesi No: 12, Altınordu / Ordu',
    phone: '+90 (452) 222 33 44',
    whatsapp: '905321112233',
    paymentProvider: 'Doğrudan PayTR Sanal POS',
    isPhysicalVerified: true,
  },
  reviews: [
    {
      id: 'rev-1',
      author: 'Emre K.',
      rating: 5,
      date: '18 Eylül 2026',
      sizeBought: '42 numara',
      colorBought: 'Taba',
      comment: 'Deri kalitesi gerçekten muazzam. Kalıbı tam oturuyor, köselesi çok rahat. Faturası doğrudan işletmeden düzenlenmiş olarak geldi. Satıcıya ilgisinden ötürü teşekkürler.',
      likes: 14,
    },
    {
      id: 'rev-2',
      author: 'Selim B.',
      rating: 5,
      date: '12 Eylül 2026',
      sizeBought: '43 numara',
      colorBought: 'Siyah',
      comment: 'Aracı komisyonu olmadığı için bu fiyata alınabilecek en kaliteli ayakkabı. WhatsApp üzerinden numara konusunda teyit aldım, hemen ilgilendiler.',
      likes: 8,
    }
  ]
};

export default function ProductDetailPage({ slug, onBackToMarketplace }: { slug?: string; onBackToMarketplace?: () => void }) {
  const product = PRODUCT_DATA;

  // Durum Yönetimleri
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('41');
  const [selectedColor, setSelectedColor] = useState('Taba');
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
            <span className="hover:text-indigo-900 font-semibold cursor-pointer">Ayakkabı & Çanta</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="hover:text-indigo-900 font-semibold cursor-pointer">Klasik Ayakkabı</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-bold truncate max-w-[200px]">{product.title}</span>
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
                    M
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
              <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-slate-950">
                      {product.price.toLocaleString('tr-TR')} ₺
                    </span>
                    <span className="text-sm font-semibold text-slate-400 line-through">
                      {product.originalPrice.toLocaleString('tr-TR')} ₺
                    </span>
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                      %18 İndirim
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    +%{product.vatRate} KDV Dahil · Aracı komisyonsuz doğrudan üretici fiyatı
                  </span>
                </div>

                <div className="text-right">
                  <span className="inline-block text-[11px] font-bold text-emerald-800 bg-emerald-100/70 border border-emerald-300 px-3 py-1 rounded-xl">
                    ✓ {product.store.paymentProvider}
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-1">Havuzda beklemez, doğrudan hesaba</span>
                </div>
              </div>

              {/* Varyant: Renk Seçimi */}
              <div className="mt-6 space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Renk: <span className="font-normal text-slate-500">{selectedColor}</span>
                </label>
                <div className="flex gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-2 cursor-pointer ${
                        selectedColor === c.name
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: c.hex }} />
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Varyant: Beden Seçimi */}
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-700">Beden / Ölçü Seçimi</label>
                  <span className="text-indigo-600 hover:underline font-semibold text-[11px] cursor-pointer">Beden Tablosu</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-12 h-12 rounded-xl text-xs font-black border transition flex items-center justify-center cursor-pointer ${
                        selectedSize === s
                          ? 'border-indigo-900 bg-indigo-900 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SATIN ALMA & FAVORİ BUTONLARI */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 px-6 rounded-2xl bg-indigo-900 hover:bg-indigo-800 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {addedToCart ? <Check className="w-5 h-5 text-emerald-400" /> : <ShoppingBag className="w-5 h-5 text-amber-400" />}
                  {addedToCart ? 'Sepete Eklendi!' : 'Sepete Ekle'}
                </button>

                <button
                  onClick={toggleFavorite}
                  className={`p-4 rounded-2xl border transition flex items-center justify-center cursor-pointer ${
                    isFavorite
                      ? 'border-rose-300 bg-rose-50 text-rose-600'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                  title="Favorilere Ekle"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
                </button>

                <a
                  href={`https://wa.me/${product.store.whatsapp}?text=${encodeURIComponent(`Merhaba, "${product.title}" için beden sormak istiyorum.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition flex items-center justify-center"
                  title="Satıcıya WhatsApp'tan Danış"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>

              {/* Güvenlik & Kargo Rozetleri */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-500 font-semibold text-center">
                <span className="flex items-center justify-center gap-1 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <Truck className="w-3.5 h-3.5 text-indigo-600" /> 24 Saatte Kargo
                </span>
                <span className="flex items-center justify-center gap-1 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" /> 14 Gün İade Hakkı
                </span>
                <span className="flex items-center justify-center gap-1 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Resmi E-Fatura
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. AÇIK ESNAF ŞEFFAFLIK KARTI (Dükkânın Açık Adresi & İletişimi) */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Doğrudan Üretici Esnaf Bilgisi
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">{product.store.name}</h2>
              <p className="text-xs text-slate-500">tampazar.com açık ticaret güvencesiyle iletişim bilgileri şeffaftır.</p>
            </div>
            
            <div className="flex gap-2">
              <a 
                href={`tel:${product.store.phone}`} 
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition"
              >
                <Phone className="w-4 h-4 text-slate-500" /> Dükkânı Ara
              </a>
              <span className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-950 text-xs font-bold text-white flex items-center gap-1.5 transition cursor-pointer">
                <Store className="w-4 h-4 text-amber-400" /> Mağazayı Ziyaret Et →
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 text-xs">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-700 block">Fiziki Atölye / Showroom</span>
                <p className="text-slate-500 mt-0.5 leading-relaxed">{product.store.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-700 block">Tahsilat Güvencesi</span>
                <p className="text-slate-500 mt-0.5 leading-relaxed">
                  Ödemeniz tampazar havuzunda bloke edilmez; doğrudan işletmenin <strong>{product.store.paymentProvider}</strong> hesabına geçer.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <UserCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-700 block">Doğrudan Destek</span>
                <p className="text-slate-500 mt-0.5 leading-relaxed">
                  Kalıp, beden veya özel imalat sorularınız için doğrudan usta ile WhatsApp üzerinden görüşebilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. DEĞERLENDİRMELER VE MÜŞTERİ YORUMLARI BÖLÜMÜ */}
        {/* ========================================================= */}
        <section id="yorumlar" className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-900">Müşteri Değerlendirmeleri</h2>
              <p className="text-xs text-slate-500">Ürünü satın almış gerçek müşterilerin doğrulanmış yorumları</p>
            </div>

            {/* Puan Özeti Kutusu */}
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/80 p-4 rounded-2xl">
              <div className="text-center pr-4 border-r border-slate-200">
                <span className="text-3xl font-black text-slate-900 block">{product.rating}</span>
                <div className="flex text-amber-500 justify-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>
              <div className="text-xs text-slate-600 font-medium">
                <span className="font-bold text-slate-900 block">{product.reviewCount} Değerlendirme</span>
                <span>%98 oranında tavsiye ediliyor</span>
              </div>
            </div>
          </div>

          {/* Yorum Kartları */}
          <div className="space-y-6">
            {product.reviews.map((rev) => (
              <div key={rev.id} className="p-5 rounded-2xl bg-slate-50/60 border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{rev.author}</span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      ✓ Doğrulanmış Alıcı
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">{rev.date}</span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <div className="flex text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                  <span>•</span>
                  <span>Beden: <strong>{rev.sizeBought}</strong></span>
                  <span>•</span>
                  <span>Renk: <strong>{rev.colorBought}</strong></span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {rev.comment}
                </p>

                <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-500">
                  <button className="flex items-center gap-1 hover:text-indigo-600 transition cursor-pointer">
                    <ThumbsUp className="w-3.5 h-3.5" /> Faydalı ({rev.likes})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
