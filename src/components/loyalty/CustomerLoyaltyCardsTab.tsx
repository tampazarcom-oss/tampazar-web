/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Gift, Award, CheckCircle2, Sparkles, Store, Clock, 
  ArrowRight, Heart, ShieldCheck, ChevronRight, Info, Plus
} from 'lucide-react';
import { 
  CustomerLoyaltyCard, 
  getStoredCustomerLoyaltyCards, 
  redeemCustomerReward 
} from '../../data/loyaltyData';
import { Link } from 'react-router-dom';

export default function CustomerLoyaltyCardsTab() {
  const [cards, setCards] = useState<CustomerLoyaltyCard[]>(() => getStoredCustomerLoyaltyCards());
  const [redeemedToast, setRedeemedToast] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => setCards(getStoredCustomerLoyaltyCards());
    window.addEventListener('tampazar_customer_loyalty_updated', handleUpdate);
    return () => window.removeEventListener('tampazar_customer_loyalty_updated', handleUpdate);
  }, []);

  const handleRedeem = (storeId: string, storeName: string, rewardTitle: string) => {
    const success = redeemCustomerReward(storeId);
    if (success) {
      setCards(getStoredCustomerLoyaltyCards());
      setRedeemedToast(`🎉 Tebrikler! "${storeName}" dükkanındaki "${rewardTitle}" ikramınız aktif edildi.`);
      setTimeout(() => setRedeemedToast(null), 4000);
    }
  };

  const totalRewardsAvailable = cards.filter(c => c.isRewardReady).length;
  const totalStampsCollected = cards.reduce((acc, c) => acc + c.currentStamps, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Toast */}
      {redeemedToast && (
        <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center justify-between text-xs font-bold animate-fade-in">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-300 shrink-0" />
            <span>{redeemedToast}</span>
          </div>
          <button
            onClick={() => setRedeemedToast(null)}
            className="text-white/80 hover:text-white px-2 py-1"
          >
            Tamam
          </button>
        </div>
      )}

      {/* 1. ÜST BİLGİ & MOTİVASYON BANNERI */}
      <div className="bg-gradient-to-r from-[#0F4C3A] to-[#0B132B] rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-amber-400/30">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Mahalle Sadakat Kartı & Esnaf İkramları</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Mahalle Damgalarım & İkramlarım</h2>
          <p className="text-xs text-slate-300 font-medium max-w-xl">
            Her alışverişinizde dükkanınızdan 1 Mahalle Damgası kazanın. Belirlenen hedefe ulaştığınızda esnafımızın sıcak jest ikramları doğrudan kapınıza gelsin!
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/15 shrink-0">
          <div className="text-center px-2">
            <span className="text-xl font-black text-[#F59E0B] font-mono block">{totalRewardsAvailable}</span>
            <span className="text-[10px] text-slate-300 font-bold uppercase">Hazır İkram</span>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div className="text-center px-2">
            <span className="text-xl font-black text-emerald-400 font-mono block">{totalStampsCollected}</span>
            <span className="text-[10px] text-slate-300 font-bold uppercase">Toplam Damga</span>
          </div>
        </div>
      </div>

      {/* 2. DÜKKAN DAMGA KARTLARI LİSTESİ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card) => {
          const progressPercent = Math.min(100, Math.round((card.currentStamps / card.requiredStamps) * 100));

          return (
            <div
              key={card.storeId}
              className={`bg-white rounded-3xl p-5 border shadow-xs space-y-4 flex flex-col justify-between transition-all duration-200 ${
                card.isRewardReady
                  ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-lg'
                  : 'border-slate-200 hover:border-[#0F4C3A]/40'
              }`}
            >
              {/* Kart Üst Bilgisi */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{card.iconEmoji}</span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{card.storeName}</h4>
                      <span className="text-[11px] text-slate-500 block">Son Damga: {card.lastStampDate}</span>
                    </div>
                  </div>

                  {card.isRewardReady ? (
                    <span className="px-2.5 py-1 bg-amber-400 text-slate-950 text-[10px] font-black uppercase rounded-full animate-bounce">
                      🎁 İkram Hazır!
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-full">
                      {card.currentStamps}/{card.requiredStamps} Damga
                    </span>
                  )}
                </div>

                {/* Hediye Açıklaması */}
                <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200/60 text-xs">
                  <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider block">
                    Hak Edilecek İkram:
                  </span>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {card.rewardTitle}
                  </p>
                </div>
              </div>

              {/* Damga Yuvaları (Stamp Boxes) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span>Damga İlerlemesi</span>
                  <span className="text-[#0F4C3A] font-black">{progressPercent}%</span>
                </div>

                <div className="grid grid-cols-5 gap-1.5">
                  {Array.from({ length: card.requiredStamps }).map((_, idx) => {
                    const isFilled = idx < card.currentStamps;
                    const isLastReward = idx === card.requiredStamps - 1;

                    return (
                      <div
                        key={idx}
                        className={`h-11 rounded-xl flex items-center justify-center border text-base transition-all ${
                          isFilled
                            ? 'bg-[#0F4C3A] text-white border-[#0F4C3A] shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-300'
                        }`}
                        title={isFilled ? `${idx + 1}. Sipariş Damgası Alındı` : `${idx + 1}. Sipariş`}
                      >
                        {isFilled ? (
                          isLastReward ? '🎁' : '✓'
                        ) : (
                          isLastReward ? '🎁' : idx + 1
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Buton ve Aksiyon */}
              <div className="pt-2 border-t border-slate-100">
                {card.isRewardReady ? (
                  <button
                    type="button"
                    onClick={() => handleRedeem(card.storeId, card.storeName, card.rewardTitle)}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-[#F59E0B] hover:brightness-105 text-slate-950 font-black rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Gift className="w-4 h-4 text-slate-950" />
                    <span>İkramı Sepetime / Kapıma Ekle</span>
                  </button>
                ) : (
                  <Link
                    to="/"
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1 text-center"
                  >
                    <span>Dükkandan Sipariş Ver</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* 3. BİLGİLENDİRME KUTUSU */}
      <div className="p-5 bg-slate-100 rounded-3xl text-xs text-slate-700 flex items-start gap-3 border border-slate-200">
        <Info className="w-5 h-5 text-[#0F4C3A] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-slate-900 text-sm">Mahalle İkramı Nasıl Çalışır?</strong>
          <p className="text-slate-600 leading-relaxed">
            TamPazar sadakat sistemi puan satışı veya finansal komisyon içermez. Esnafımız kendi müşterisine sıcak jestler (fırından taze ekmek, lokantadan tatlı veya manavdan yeşillik gibi) sunarak mahalle bağlarını güçlendirir. Siparişleriniz teslim edildikçe damganız otomatik işlenir.
          </p>
        </div>
      </div>

    </div>
  );
}
