/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  MapPin, Phone, MessageCircle, Globe, Instagram, 
  CreditCard, ShieldCheck, Clock, Share2, Building2, 
  ShoppingBag, CheckCircle, ExternalLink, Navigation
} from 'lucide-react';

// Tip Tanımları
export interface ProductItem {
  id: string;
  title: string;
  category: string;
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
}

// Örnek Esnaf Verisi (Tesisatçı, Ayakkabıcı, Dönerci veya İmalatçı)
export const STORE_MOCK: StoreData = {
  slug: 'kuzey-usta-tesisat',
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
  products: [
    {
      id: 'p1',
      title: 'Termal Cihazla Kırmadan Su Kaçağı Tespiti + Resmi Rapor',
      category: 'Yerinde Servis',
      price: 1200,
      vatRate: 20,
      type: 'SERVICE',
      image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'p2',
      title: 'Pirinç Küresel Vana 1/2 (Ağır Tip - Tam Geçişli)',
      category: 'Sıhhi Malzeme',
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
      price: 1800,
      vatRate: 20,
      type: 'SERVICE',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=80',
    }
  ]
};

export default function StoreFrontPage({ store = STORE_MOCK }: { store?: StoreData }) {
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

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Dükkân bağlantısı panoya kopyalandı!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      {/* Schema.org Entegrasyonu */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />

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
            onClick={handleShare}
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
                    <CheckCircle className="w-3.5 h-3.5" /> Doğrulanmış Esnaf
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-600 mt-1">{store.slogan}</p>
                
                {/* Resmi Fatura / Vergi Şeffaflığı */}
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-2 flex-wrap font-sans">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-semibold text-slate-600">{store.legalTitle}</span>
                  <span>•</span>
                  <span>{store.taxOffice} ({store.taxNumber})</span>
                </div>
              </div>
            </div>

            {/* MÜŞTERİYE AÇIK DOĞRUDAN İLETİŞİM BUTONLARI */}
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
                <Navigation className="w-3 h-3" /> Haritada Yol Tarifi Al ↗
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
                  Resmi Web Sitesi <ExternalLink className="w-3 h-3" />
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900">Dükkânın Ürün & Hizmetleri</h2>
              <p className="text-xs text-slate-500">
                İster yerinde randevu isteyin, ister doğrudan dükkânın kendi POS'uyla sipariş verin.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
              Toplam {store.products.length} İlan / Ürün
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {store.products.map((item) => (
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
                    <a
                      href={`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(
                        `Merhaba, "${item.title}" hizmetiniz için randevu ve bilgi almak istiyorum.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-900 hover:bg-indigo-800 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4" /> Hizmet & Randevu Talep Et
                    </a>
                  ) : (
                    <button 
                      onClick={() => alert(`"${item.title}" için ${store.name} doğrudan ödeme sayfası açılıyor.`)}
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
