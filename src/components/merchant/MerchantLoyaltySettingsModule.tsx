/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Gift, Sparkles, Check, Save, Info, Award, Heart, 
  Store, AlertCircle, RefreshCw, CheckCircle2
} from 'lucide-react';
import { 
  MerchantLoyaltyRule, 
  getStoredLoyaltyRules, 
  saveStoredLoyaltyRules 
} from '../../data/loyaltyData';
import { useAuth } from '../../context/AuthContext';

interface MerchantLoyaltySettingsModuleProps {
  currentStoreName?: string;
}

export default function MerchantLoyaltySettingsModule({ currentStoreName }: MerchantLoyaltySettingsModuleProps) {
  const { user } = useAuth();
  const storeId = user?.storeId || 'store-karadeniz-doner';
  const storeName = currentStoreName || user?.storeName || 'FotoSentez Stüdyo & Mahalle Esnafı';

  const [rules, setRules] = useState<Record<string, MerchantLoyaltyRule>>(() => getStoredLoyaltyRules());
  const [currentRule, setCurrentRule] = useState<MerchantLoyaltyRule>(() => {
    const all = getStoredLoyaltyRules();
    return all[storeId] || {
      storeId,
      storeName,
      rewardTitle: '5. Siparişte Sıcak Fırın Ekmeği & Tatlı İkramı',
      rewardCategory: 'FOOD',
      requiredStamps: 5,
      isActive: true,
      rewardDescription: 'Her 5 tamamlanan siparişinizde işletmemizden özel ikram hediyesi.',
      iconEmoji: '🎁',
      minOrderAmount: 100
    };
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedRules = {
      ...rules,
      [storeId]: {
        ...currentRule,
        storeId,
        storeName
      }
    };
    saveStoredLoyaltyRules(updatedRules);
    setRules(updatedRules);
    setToastMessage('🎁 Mahalle İkram kuralınız başarıyla kaydedildi ve dükkan vitrininize yansıtıldı.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const presetRewards = [
    { title: 'Taş Fırından 1 Adet Sıcak Ekmek', emoji: '🍞', req: 5, cat: 'FOOD' },
    { title: 'Taze Köy Yeşilliği & Nane Demeti', emoji: '🥗', req: 3, cat: 'GROCERY' },
    { title: 'Geleneksel Fırın Sütlaç & Çay İkramı', emoji: '🍮', req: 4, cat: 'FOOD' },
    { title: 'Özel Deri Bakım & Cila Süngeri Hediyesi', emoji: '👞', req: 3, cat: 'SERVICE' },
    { title: 'Türk Kahvesi & Lokum İkram Paketi', emoji: '☕', req: 3, cat: 'BEVERAGE' },
    { title: '1 Adet Hediye Vesikalık Fotoğraf Baskısı', emoji: '📸', req: 2, cat: 'GENERAL' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Toast */}
      {toastMessage && (
        <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center justify-between text-xs font-bold animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white px-2 py-1">
            Kapat
          </button>
        </div>
      )}

      {/* 1. ÜST BİLGİLENDİRME */}
      <div className="bg-gradient-to-r from-[#0F4C3A] to-[#0B132B] rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-amber-400/30">
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span>Mahalle Sadakat & Jest Motoru</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Esnaf İkram Kuralı & Jest Ayarları</h2>
          <p className="text-xs text-slate-300 font-medium max-w-xl">
            Müşterilerinize doğrudan sıcak mahalle ikramları sunun. Finansal komisyon yok, para puan kesintisi yok; tamamen esnafın kendi jesti.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className={`px-4 py-2 rounded-2xl border font-bold text-xs flex items-center gap-2 ${
            currentRule.isActive ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${currentRule.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span>{currentRule.isActive ? 'İkram Sistemi Aktif' : 'Devre Dışı'}</span>
          </div>
        </div>
      </div>

      {/* 2. DÜZENLEME FORMU VE ÖNİZLEME */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* SOL FORM */}
        <form onSubmit={handleSave} className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#0F4C3A]" />
              İkram ve Sadakat Kuralı Belirle
            </h3>
            
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={currentRule.isActive}
                onChange={(e) => setCurrentRule({ ...currentRule, isActive: e.target.checked })}
                className="rounded text-[#0F4C3A]"
              />
              <span>Sistemi Aktif Et</span>
            </label>
          </div>

          {/* Hızlı Hazır İkram Şablonları */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Popüler Mahalle İkram Şablonları</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {presetRewards.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentRule({
                    ...currentRule,
                    rewardTitle: preset.title,
                    iconEmoji: preset.emoji,
                    requiredStamps: preset.req,
                    rewardCategory: preset.cat as any
                  })}
                  className="p-2.5 rounded-2xl border border-slate-200 hover:border-[#0F4C3A] hover:bg-emerald-50 text-left transition flex flex-col justify-between space-y-1 cursor-pointer"
                >
                  <span className="text-lg">{preset.emoji}</span>
                  <span className="font-bold text-slate-900 text-[11px] leading-tight line-clamp-2">{preset.title}</span>
                  <span className="text-[10px] text-slate-500 font-medium">{preset.req} Siparişte 1</span>
                </button>
              ))}
            </div>
          </div>

          {/* İkram Adı & Emoji */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
            <div className="sm:col-span-3">
              <label className="font-bold text-slate-700 block mb-1">Hediye / İkram Ürününün Adı *</label>
              <input
                type="text"
                required
                value={currentRule.rewardTitle}
                onChange={(e) => setCurrentRule({ ...currentRule, rewardTitle: e.target.value })}
                placeholder="Örn: 5. Siparişte 1 Adet Sıcak Ekmek"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">İkon / Emoji</label>
              <input
                type="text"
                value={currentRule.iconEmoji}
                onChange={(e) => setCurrentRule({ ...currentRule, iconEmoji: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-center text-lg"
              />
            </div>
          </div>

          {/* Kaç Siparişte Bir İkram? */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Gereken Sipariş Damgası (X)</label>
              <select
                value={currentRule.requiredStamps}
                onChange={(e) => setCurrentRule({ ...currentRule, requiredStamps: Number(e.target.value) })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-900 cursor-pointer"
              >
                <option value={2}>2. Siparişte 1 İkram</option>
                <option value={3}>3. Siparişte 1 İkram</option>
                <option value={4}>4. Siparişte 1 İkram</option>
                <option value={5}>5. Siparişte 1 İkram</option>
                <option value={8}>8. Siparişte 1 İkram</option>
                <option value={10}>10. Siparişte 1 İkram</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Minimum Sipariş Tutarı (₺)</label>
              <input
                type="number"
                value={currentRule.minOrderAmount || 0}
                onChange={(e) => setCurrentRule({ ...currentRule, minOrderAmount: Number(e.target.value) })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Açıklama */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Müşteriye Gösterilecek İkram Notu</label>
            <textarea
              rows={2}
              value={currentRule.rewardDescription}
              onChange={(e) => setCurrentRule({ ...currentRule, rewardDescription: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-700"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
            <button
              type="submit"
              className="py-2.5 px-6 bg-[#0F4C3A] hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#F59E0B]" />
              <span>İkram Kuralını Kaydet & Yayınla</span>
            </button>
          </div>
        </form>

        {/* SAĞ KART ÖNİZLEMESİ */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-slate-900">Müşteri Sadakat Kartı Önizlemesi</h4>
            <span className="text-[10px] text-slate-500 font-bold">Canlı Görünüm</span>
          </div>

          <div className="bg-white rounded-3xl p-5 border-2 border-amber-400/80 shadow-lg space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">{currentRule.iconEmoji}</span>
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">{storeName}</h5>
                  <span className="text-[11px] text-slate-500 block">Mahalle Sadakat Kartı</span>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-amber-400 text-slate-950 text-[10px] font-black uppercase rounded-full">
                {currentRule.requiredStamps}. Siparişe Özel
              </span>
            </div>

            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs">
              <span className="text-[10px] font-black uppercase text-amber-800 block">Kazanılacak İkram:</span>
              <p className="font-bold text-slate-900 mt-0.5">{currentRule.rewardTitle}</p>
              <p className="text-[11px] text-slate-600 mt-1">{currentRule.rewardDescription}</p>
            </div>

            {/* Damga Simülasyonu */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                <span>Örnek Damga Kutuları</span>
                <span className="text-emerald-700">{currentRule.requiredStamps} Adım</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {Array.from({ length: currentRule.requiredStamps }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-10 rounded-xl flex items-center justify-center border font-bold text-xs ${
                      idx === currentRule.requiredStamps - 1
                        ? 'bg-amber-100 text-amber-900 border-amber-300 font-black'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {idx === currentRule.requiredStamps - 1 ? '🎁' : `✓ ${idx + 1}`}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Sipariş tamamlandığında müşterinin hesabına otomatik damga işlenir.</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
