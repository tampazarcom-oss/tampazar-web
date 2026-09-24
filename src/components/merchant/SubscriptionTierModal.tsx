/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, Check, Sparkles, Zap, ArrowRight, 
  Calendar, CreditCard, Award, CheckCircle2, X 
} from 'lucide-react';
import { SUBSCRIPTION_TIERS, MerchantSubscription, SubscriptionTier } from '../../data/hybridCommerceData';

interface SubscriptionTierModalProps {
  subscription: MerchantSubscription;
  onUpdateTier: (newTierId: 'starter' | 'pro' | 'enterprise') => void;
}

export default function SubscriptionTierModal({ subscription, onUpdateTier }: SubscriptionTierModalProps) {
  const [selectedCycle, setSelectedCycle] = useState<'monthly' | 'annual'>(subscription.billingCycle);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const activeTier = SUBSCRIPTION_TIERS.find(t => t.id === subscription.currentTierId) || SUBSCRIPTION_TIERS[1];

  const handleSelectTier = (tier: SubscriptionTier) => {
    onUpdateTier(tier.id);
    setSuccessMessage(`Paketiniz başarıyla "${tier.name}" olarak güncellendi.`);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Aktif Abonelik Durum Kartı */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-full uppercase tracking-wider">
                %0 Komisyon Güvencesi
              </span>
              <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Abonelik Aktif
              </span>
            </div>
            <h2 className="text-2xl font-black">{activeTier.name}</h2>
            <p className="text-xs text-slate-300 max-w-xl">
              TamPazar'da satışlarınızdan hiçbir komisyon kesilmez. Tüm tahsilatlar doğrudan kendi Sanal POS'unuz üzerinden banka hesabınıza yatar.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-2xl text-xs space-y-1.5 w-full md:w-64 shrink-0">
            <div className="flex justify-between text-slate-400">
              <span>Aylık Sabit Aidat:</span>
              <strong className="text-white font-black">₺{activeTier.monthlyPrice} / ay</strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Kalan Fatura Kotası:</span>
              <strong className="text-emerald-400 font-bold">
                {activeTier.invoiceQuota === -1 ? 'Sınırsız Kotasız' : `${activeTier.invoiceQuota - subscription.invoicesUsedThisMonth} Adet`}
              </strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Yenileme Tarihi:</span>
              <strong className="text-white">{subscription.renewalDate}</strong>
            </div>
            <div className="pt-2 border-t border-slate-700 text-[10px] text-slate-400 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              <span>{subscription.paymentMethodMask}</span>
            </div>
          </div>
        </div>

        {successMessage && (
          <div className="mt-4 bg-emerald-500/20 border border-emerald-400 text-emerald-200 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            {successMessage}
          </div>
        )}
      </div>

      {/* Dönem Seçici (Aylık / Yıllık) */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={() => setSelectedCycle('monthly')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            selectedCycle === 'monthly' ? 'bg-indigo-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
          }`}
        >
          Aylık Ödeme
        </button>
        <button
          onClick={() => setSelectedCycle('annual')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            selectedCycle === 'annual' ? 'bg-indigo-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
          }`}
        >
          <span>Yıllık Ödeme</span>
          <span className="bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded text-[10px] font-black">2 Ay Bedava</span>
        </button>
      </div>

      {/* Paket Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {SUBSCRIPTION_TIERS.map((tier) => {
          const isCurrent = tier.id === subscription.currentTierId;
          const displayPrice = selectedCycle === 'monthly' ? tier.monthlyPrice : Math.round(tier.annualPrice / 12);

          return (
            <div
              key={tier.id}
              className={`bg-white rounded-3xl p-6 border shadow-xs flex flex-col justify-between transition-all relative ${
                isCurrent 
                  ? 'border-indigo-600 ring-2 ring-indigo-600/30' 
                  : tier.recommended 
                  ? 'border-amber-400 shadow-lg' 
                  : 'border-slate-200'
              }`}
            >
              {tier.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 font-black text-[10px] px-3 py-1 rounded-full shadow">
                  EN ÇOK TERCİH EDİLEN
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{tier.badge}</span>
                  <h3 className="text-lg font-black text-slate-900">{tier.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{tier.tagline}</p>
                </div>

                <div className="pt-2 pb-3 border-y border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">₺{displayPrice}</span>
                    <span className="text-xs text-slate-500 font-bold">/ ay</span>
                  </div>
                  {selectedCycle === 'annual' && (
                    <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
                      Yıllık faturalandırılır (₺{tier.annualPrice})
                    </span>
                  )}
                </div>

                <div className="space-y-2.5">
                  <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider block">Dahil Özellikler:</span>
                  {tier.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-3 bg-slate-100 text-slate-500 font-bold text-xs rounded-xl cursor-default flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4 text-emerald-600" />
                    Şu Anki Aktif Paketiniz
                  </button>
                ) : (
                  <button
                    onClick={() => handleSelectTier(tier)}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Bu Pakete Geç</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
