/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShoppingBag, Calendar, Phone, MessageCircle, 
  MapPin, Clock, ShieldCheck, Layers, AlertCircle, 
  Check, Star, ArrowUpRight, Zap, Download, Video, Sparkles
} from 'lucide-react';
import { getProductSocialProof, getStoreSocialProof } from '../utils/socialProof';

export type SectorType = 'RETAIL' | 'WHOLESALE' | 'SERVICE' | 'FOOD' | 'EMERGENCY' | 'DIGITAL' | 'CONSULTATION';

export interface TierPrice {
  minQty: number;
  unitPrice: number;
}

export interface UniversalCardData {
  id: string;
  slug: string;
  sector: SectorType;
  title: string;
  category: string;
  image: string;
  price: number;
  vatRate: number; // KDV %
  currency?: string;
  salesCount?: number;
  deliveryType?: 'national_cargo' | 'instant_courier' | 'service_call' | 'digital_download' | 'online_session';
  digitalFormats?: string[];
  sessionDurationMin?: number;
  
  // Mağaza / Esnaf Bilgileri
  store: {
    name: string;
    slug: string;
    district: string;
    city: string;
    phone: string;
    whatsapp: string;
    rating: number;
    reviewCount: number;
    paymentProvider: string; // "Doğrudan PayTR", "Kendi iyzico POS'u"
    isPhysicalVerified: boolean;
    totalOrders?: number;
  };

  // Sektöre Özel Opsiyonel Alanlar
  lat?: number;
  lng?: number;
  distanceKm?: number;
  wholesaleTiers?: TierPrice[];     // B2B Toptan kademeleri
  minOrderQty?: number;             // Minimum sipariş adedi
  etaMinutes?: string;              // Yeme-içme hazırlık veya çekici varış süresi (örn: "15-20 dk")
  serviceDuration?: string;         // Hizmet süresi (örn: "45 dk")
  isEmergency247?: boolean;         // 7/24 Acil nöbetçi rozeti
  inStock?: boolean;
}

export default function UniversalProductCard({ 
  data, 
  onNavigateToProduct,
  userLocationLabel,
  onCallLocationDispatch
}: { 
  data: UniversalCardData; 
  onNavigateToProduct?: (slug: string) => void;
  userLocationLabel?: string;
  onCallLocationDispatch?: (data: UniversalCardData) => void;
}) {
  const [selectedQty, setSelectedQty] = useState(data.minOrderQty || 1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Akıllı Sosyal Kanıt ve Eşik Kontrolleri
  const productSocialProof = getProductSocialProof(
    data.id || data.slug,
    data.salesCount,
    { isB2B: data.sector === 'WHOLESALE', isService: data.sector === 'SERVICE' }
  );

  const storeSocialProof = getStoreSocialProof(
    data.store.slug || data.store.name,
    data.store.rating,
    data.store.reviewCount,
    data.store.totalOrders
  );

  // Dinamik Toptan Fiyat Hesaplayıcı
  const getActivePrice = () => {
    if (data.sector === 'WHOLESALE' && data.wholesaleTiers?.length) {
      const matchedTier = [...data.wholesaleTiers]
        .reverse()
        .find(t => selectedQty >= t.minQty);
      return matchedTier ? matchedTier.unitPrice : data.price;
    }
    return data.price;
  };

  const currentPrice = getActivePrice();

  // WhatsApp Hızlı İletişim Metni (Kullanıcı Konumu Ekli)
  const getWhatsAppMessage = () => {
    const locText = userLocationLabel ? ` (Mevcut Konumum: ${userLocationLabel})` : '';
    switch (data.sector) {
      case 'SERVICE':
        return `Merhaba ${data.store.name}, tampazar.com üzerinden "${data.title}" hizmetiniz için randevu ve keşif almak istiyorum.${locText} En yakın zamanda gelebilir misiniz?`;
      case 'EMERGENCY':
        return `ACİL YOL YARDIM / ÇEKİCİ: tampazar.com üzerinden ulaşıyorum.${locText} Lütfen acil araç yönlendirin!`;
      case 'WHOLESALE':
        return `Merhaba, "${data.title}" ürününüzden ${selectedQty} adet toptan alım için teklif görüşmek istiyorum.${locText}`;
      default:
        return `Merhaba, "${data.title}" hakkında bilgi almak istiyorum.${locText}`;
    }
  };

  return (
    <article className="group bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      
      {/* 1. ÜST GÖRSEL & SEKTÖREL ROZETLER */}
      <div onClick={() => onNavigateToProduct?.(data.slug)} className="cursor-pointer block">
        <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
          <img
            src={data.image}
            alt={`${data.title} - TamPazar`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

          {/* Sektöre Özel Sol Üst Rozet */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {(data.sector === 'DIGITAL' || data.deliveryType === 'digital_download') && (
              <span className="bg-purple-700 text-white font-black text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                <Download className="w-3 h-3" /> Anında Dijital İndirme
              </span>
            )}
            {(data.sector === 'CONSULTATION' || data.deliveryType === 'online_session') && (
              <span className="bg-cyan-600 text-white font-black text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                <Video className="w-3 h-3" /> Uzaktan Canlı Seans
              </span>
            )}
            {data.sector === 'WHOLESALE' && (
              <span className="bg-amber-500 text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                <Layers className="w-3 h-3" /> Toptan (B2B)
              </span>
            )}
            {data.sector === 'SERVICE' && (
              <span className="bg-sky-600 text-white font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Yerinde Hizmet
              </span>
            )}
            {data.sector === 'EMERGENCY' && (
              <span className="bg-rose-600 text-white font-black text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md animate-pulse flex items-center gap-1">
                <Zap className="w-3 h-3" /> 7/24 Acil Çağrı
              </span>
            )}
            {data.sector === 'FOOD' && (
              <span className="bg-emerald-600 text-white font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                <Clock className="w-3 h-3" /> Sıcak & Taze
              </span>
            )}
            {data.sector === 'RETAIL' && (
              <span className="bg-slate-900/90 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md">
                Doğrudan Satıcı
              </span>
            )}
          </div>

          {/* Sağ Üst: Şehir & Mesafe Rozeti */}
          <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1">
            {data.distanceKm !== undefined && (
              <span className="bg-emerald-600 text-white shadow-md text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-fade-in">
                <MapPin className="w-3 h-3" />
                {data.distanceKm <= 0.5 ? 'Mahallende' : `${data.distanceKm} km yakınında`}
              </span>
            )}
            <div className="flex items-center gap-1 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-bold text-slate-800 shadow-xs">
              {data.etaMinutes ? (
                <>
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>{data.etaMinutes}</span>
                </>
              ) : (
                <>
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>{data.store.district}, {data.store.city}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 2. DÜKKÂN KİMLİĞİ VE PUAN */}
        <div className="p-5 pb-0 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-indigo-900 flex items-center gap-1 truncate max-w-[190px]">
              {data.store.name}
              {data.store.isPhysicalVerified && (
                <span title="Doğrulanmış Fiziki Dükkân">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                </span>
              )}
            </span>

            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>{data.store.rating}</span>
              <span className="text-slate-400 font-normal">({data.store.reviewCount})</span>
            </div>
          </div>

          {/* Ürün / İlan Başlığı */}
          <div className="block group-hover:text-indigo-900 transition-colors">
            <h3 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2 min-h-[40px]">
              {data.title}
            </h3>
          </div>

          {/* Akıllı Sosyal Kanıt ve Eşik Kontrollü Satış / Mahalle Rozeti */}
          <div className="pt-0.5">
            {data.sector === 'WHOLESALE' ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md shadow-2xs">
                {productSocialProof.wholesaleBadgeText}
              </span>
            ) : productSocialProof.hasHighSales ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md shadow-2xs">
                {productSocialProof.badgeText}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 bg-slate-100/90 border border-slate-200 px-2 py-0.5 rounded-md shadow-2xs">
                {productSocialProof.badgeText}
              </span>
            )}
          </div>

          {/* Sektörel Detay Bloğu */}
          {data.sector === 'WHOLESALE' && data.wholesaleTiers && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-2.5 text-[11px] space-y-1">
              <span className="font-bold text-amber-950 block">Kademeli Fiyat Kurgusu:</span>
              <div className="flex justify-between text-amber-900 font-semibold">
                <span>{data.minOrderQty}+ Adet: {data.price} ₺</span>
                {data.wholesaleTiers.map((t, idx) => (
                  <span key={idx} className={selectedQty >= t.minQty ? 'font-black text-amber-950 underline' : ''}>
                    {t.minQty}+ Adet: {t.unitPrice} ₺
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.sector === 'SERVICE' && (
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2.5 text-xs text-slate-600 flex items-center justify-between">
              <span className="font-medium">Tahmini Süre: <strong>{data.serviceDuration || 'Keşif Sonrası'}</strong></span>
              <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded">Resmi Fatura Verilir</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. FİYAT, KENDİ POS ROZETİ VE AKSİYON BUTONLARI */}
      <div className="p-5 pt-4 space-y-3">
        {/* Fiyat Satırı */}
        <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-950">
                {currentPrice.toLocaleString('tr-TR')}
              </span>
              <span className="text-xs font-black text-slate-600">
                {data.currency || '₺'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block font-medium">
              +%{data.vatRate} KDV Dahil · %0 Komisyon
            </span>
          </div>

          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {data.store.paymentProvider}
          </span>
        </div>

        {/* B2B Toptan için Adet Seçici */}
        {data.sector === 'WHOLESALE' && (
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold">
            <span className="text-slate-500">Sipariş Adedi:</span>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedQty(Math.max((data.minOrderQty || 1), selectedQty - 10))}
                className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
              >
                -
              </button>
              <span className="text-slate-900 font-black">{selectedQty}</span>
              <button 
                onClick={() => setSelectedQty(selectedQty + 10)}
                className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* SEKTORE GÖRE DİNAMİK BUTON GRUBU */}
        <div className="space-y-2">
          {/* A. Acil Çekici / Yol Yardım Butonu */}
          {data.sector === 'EMERGENCY' && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (onCallLocationDispatch) {
                    onCallLocationDispatch(data);
                  } else {
                    window.location.href = `tel:${data.store.phone}`;
                  }
                }}
                className="flex-1 py-3 px-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" /> Konuma Çağır
              </button>
              <a
                href={`tel:${data.store.phone}`}
                className="py-3 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center"
                title="Hemen Ara"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${data.store.whatsapp}?text=${encodeURIComponent(getWhatsAppMessage())}`}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center"
                title="WhatsApp ile Konum At"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* B. Usta / Hizmet / Randevu Butonu */}
          {data.sector === 'SERVICE' && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (onCallLocationDispatch) {
                    onCallLocationDispatch(data);
                  } else {
                    alert(`${data.store.name} işletmesinden "${data.title}" için randevu talebiniz iletildi. Esnaf en kısa sürede dönüş yapacaktır.`);
                  }
                }}
                className="flex-1 py-3 px-3 rounded-2xl bg-indigo-900 hover:bg-indigo-800 text-white font-extrabold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-amber-400" /> Konuma Çağır / Randevu
              </button>
              <a
                href={`tel:${data.store.phone}`}
                className="py-3 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center justify-center"
                title="Hemen Ara"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${data.store.whatsapp}?text=${encodeURIComponent(getWhatsAppMessage())}`}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition flex items-center justify-center"
                title="WhatsApp ile Konum At"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* C. Yeme-İçme / Döner / Sıcak Sipariş Butonu */}
          {data.sector === 'FOOD' && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setAddedAnimation(true);
                  setTimeout(() => setAddedAnimation(false), 1200);
                }}
                className="flex-1 py-3 px-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {addedAnimation ? <Check className="w-4 h-4 text-emerald-950" /> : <ShoppingBag className="w-4 h-4" />}
                {addedAnimation ? 'Siparişe Eklendi' : 'Sıcak Sipariş Ver'}
              </button>
              <a
                href={`tel:${data.store.phone}`}
                className="py-3 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center"
                title="Dükkânı Ara"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* D. Dijital İndirilebilir Dosya Satışı (TamDijital) */}
          {(data.sector === 'DIGITAL' || data.deliveryType === 'digital_download') && (
            <div className="flex gap-2">
              <button
                onClick={() => onNavigateToProduct?.(data.slug)}
                className="flex-1 py-3 px-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-purple-200" />
                <span>Anında İndir & Al</span>
              </button>
              <a
                href={`https://wa.me/${data.store.whatsapp}?text=${encodeURIComponent(getWhatsAppMessage())}`}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold transition flex items-center justify-center"
                title="Formatlar Hakkında Sor"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* E. Uzaktan Canlı Seans (TamSeans) */}
          {(data.sector === 'CONSULTATION' || data.deliveryType === 'online_session') && (
            <div className="flex gap-2">
              <button
                onClick={() => onNavigateToProduct?.(data.slug)}
                className="flex-1 py-3 px-3 rounded-2xl bg-cyan-700 hover:bg-cyan-800 text-white font-extrabold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Video className="w-4 h-4 text-cyan-200" />
                <span>Tarih & Saat Seç</span>
              </button>
              <a
                href={`https://wa.me/${data.store.whatsapp}?text=${encodeURIComponent(getWhatsAppMessage())}`}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-3 rounded-2xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 text-xs font-bold transition flex items-center justify-center"
                title="Uzmana Soru Sor"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* F. Perakende & Toptan Klasik Satış */}
          {(data.sector === 'RETAIL' || data.sector === 'WHOLESALE') && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setAddedAnimation(true);
                  setTimeout(() => setAddedAnimation(false), 1200);
                }}
                className="flex-1 py-3 px-3 rounded-2xl bg-slate-900 hover:bg-indigo-950 text-white font-extrabold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {addedAnimation ? <Check className="w-4 h-4 text-emerald-400" /> : <ShoppingBag className="w-4 h-4 text-amber-400" />}
                {addedAnimation ? 'Sepete Eklendi' : (data.sector === 'WHOLESALE' ? 'Toptan Sepete Ekle' : 'Hemen Satın Al')}
              </button>
              <a
                href={`https://wa.me/${data.store.whatsapp}?text=${encodeURIComponent(getWhatsAppMessage())}`}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-3 rounded-2xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 text-xs font-bold transition flex items-center justify-center"
                title="Satıcıya WhatsApp'tan Sor"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
