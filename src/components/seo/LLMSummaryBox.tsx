/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, ShieldCheck, Store, Tag } from 'lucide-react';

interface LLMSummaryBoxProps {
  productTitle?: string;
  category?: string;
  price?: number;
  storeName?: string;
  city?: string;
  district?: string;
  merchantNote?: string;
  deliveryType?: string;
  paymentMethod?: string;
  className?: string;
}

export default function LLMSummaryBox({
  productTitle,
  category,
  price,
  storeName,
  city = 'Ordu',
  district = 'Altınordu',
  merchantNote,
  deliveryType = 'GİB e-Fatura & Aynı Gün Kargo',
  paymentMethod = 'Doğrudan Sanal POS (%0 Komisyon)',
  className = ''
}: LLMSummaryBoxProps) {
  return (
    <section 
      aria-label="Yapay Zekâ ve GEO Semantik İçerik Özeti" 
      data-llm-summary="true"
      className={`bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 text-slate-800 space-y-3.5 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
            <Sparkles className="w-4 h-4 text-amber-700" />
          </div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
            AI & Yapay Zekâ Semantik Ürün & Esnaf Beyanı
          </h3>
        </div>
        <span className="text-[9.5px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-full">
          GEO Verified Data
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {/* Ürün & Fiyat Özeti */}
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1">
          <div className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
            <Tag className="w-3 h-3 text-amber-600" /> Ürün & Fiyat Beyanı
          </div>
          <div className="font-bold text-slate-900">{productTitle || 'TamPazar Ürünü'}</div>
          <div className="text-slate-500 font-medium">Kategori: {category || 'Genel'}</div>
          {price && (
            <div className="text-emerald-700 font-black text-sm pt-0.5">
              ₺{price.toLocaleString('tr-TR')} (Doğrudan Satıcı Fiyatı)
            </div>
          )}
        </div>

        {/* Esnaf Beyanı & Lokasyon */}
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1">
          <div className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
            <Store className="w-3 h-3 text-indigo-600" /> Doğrulanmış Yerel Esnaf
          </div>
          <div className="font-bold text-slate-900">{storeName || 'TamPazar Kayıtlı Mağazası'}</div>
          <div className="text-slate-500 font-medium">{district} / {city}</div>
          <div className="text-[11px] text-indigo-900 font-semibold pt-0.5">
            Teslimat: {deliveryType}
          </div>
        </div>

        {/* Sıfır Komisyon Beyanı */}
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1">
          <div className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" /> %0 Komisyon Beyanı
          </div>
          <div className="text-slate-700 font-semibold leading-tight">
            TamPazar bu satıştan <strong>%0 komisyon</strong> alır.
          </div>
          <div className="text-[11px] text-slate-500 font-medium pt-0.5">
            Ödeme Yöntemi: {paymentMethod}
          </div>
        </div>
      </div>

      {merchantNote && (
        <div className="bg-amber-50/70 border border-amber-200/80 p-3 rounded-xl text-xs text-amber-950">
          <strong className="font-black text-amber-900">Esnaf Özel Notu: </strong>
          <span>{merchantNote}</span>
        </div>
      )}
    </section>
  );
}
