/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, Check, Sparkles, Zap, ArrowRight, 
  Calendar, CreditCard, Award, CheckCircle2, AlertCircle, 
  X, Lock, RefreshCw
} from 'lucide-react';
import { SUBSCRIPTION_TIERS, MerchantSubscription, SubscriptionTier } from '../../data/hybridCommerceData';
import PaytrSubscriptionCheckoutModal from './PaytrSubscriptionCheckoutModal';

interface SubscriptionTierModalProps {
  subscription: MerchantSubscription;
  onUpdateTier: (newTierId: 'starter' | 'pro' | 'enterprise') => void;
  currentStoreName?: string;
  onSubscriptionSuccess?: (updatedSub: MerchantSubscription) => void;
}

export default function SubscriptionTierModal({ 
  subscription, 
  onUpdateTier,
  currentStoreName = 'FotoSentez Stüdyo & Zanaat Evi',
  onSubscriptionSuccess
}: SubscriptionTierModalProps) {
  const [selectedCycle, setSelectedCycle] = useState<'monthly' | 'annual'>(subscription.billingCycle);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // PayTR Modal state
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [targetTierForPayment, setTargetTierForPayment] = useState<SubscriptionTier | null>(null);

  const activeTier = SUBSCRIPTION_TIERS.find(t => t.id === subscription.currentTierId) || SUBSCRIPTION_TIERS[1];
  const isSubActive = subscription.status === 'active';

  const handleOpenPaytrCheckout = (tier: SubscriptionTier) => {
    setTargetTierForPayment(tier);
    setCheckoutModalOpen(true);
  };

  const handlePaymentSuccess = (newSub: MerchantSubscription) => {
    onUpdateTier(newSub.currentTierId);
    if (onSubscriptionSuccess) onSubscriptionSuccess(newSub);
    setSuccessMessage(`Tebrikler! "${newSub.paytrSubscriptionId}" referansıyla PayTR aboneliğiniz aktif edildi ve mağazanız canlı vitrine alındı.`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      
      {/* Aktif Abonelik Durum Kartı */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-full uppercase tracking-wider shadow-xs">
                %0 Komisyon Güvencesi
              </span>
              
              {isSubActive ? (
                <span className="text-emerald-300 text-xs font-black flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Abonelik Durumu: AKTİF (Canlı Vitrinde)
                </span>
              ) : (
                <span className="text-amber-300 text-xs font-black flex items-center gap-1.5 bg-amber-950/80 border border-amber-500/40 px-3 py-1 rounded-full">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  Abonelik Durumu: BEKLEMEDE / ÖDEME GEREKLİ
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white">{activeTier.name}</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              TamPazar esnafından hiçbir komisyon veya gizli aracı bedeli kesmez. Aylık veya yıllık sabit aidatınız PayTR tekrarlayan ödeme sistemiyle tahsil edilir; satış bedelleriniz ise anında kendi banka/POS hesabınıza akar.
            </p>
          </div>

          <div className="bg-slate-800/90 border border-slate-700/80 p-5 rounded-3xl text-xs space-y-2 w-full md:w-72 shrink-0 shadow-lg">
            <div className="flex justify-between text-slate-400">
              <span>Paket Aidatı:</span>
              <strong className="text-white font-black text-sm">
                ₺{subscription.billingCycle === 'annual' ? activeTier.annualPrice : activeTier.monthlyPrice} / {subscription.billingCycle === 'annual' ? 'yıl' : 'ay'}
              </strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Vitrin Statüsü:</span>
              <strong className={isSubActive ? "text-emerald-400 font-black" : "text-amber-400 font-bold"}>
                {isSubActive ? "Canlı & Listeleniyor" : "Askıda (Ödeme Bekliyor)"}
              </strong>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Yenileme Tarihi:</span>
              <strong className="text-white font-mono">{subscription.renewalDate}</strong>
            </div>
            <div className="pt-2 border-t border-slate-700/80 text-[11px] text-slate-300 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono">{subscription.paymentMethodMask}</span>
              </div>
            </div>

            {!isSubActive && (
              <button
                onClick={() => handleOpenPaytrCheckout(activeTier)}
                className="w-full mt-2 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>PayTR ile Şimdi Aktif Et</span>
              </button>
            )}
          </div>
        </div>

        {successMessage && (
          <div className="mt-4 bg-emerald-500/20 border border-emerald-400 text-emerald-200 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in shadow-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
      </div>

      {/* Dönem Seçici (Aylık / Yıllık) */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={() => setSelectedCycle('monthly')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
            selectedCycle === 'monthly' ? 'bg-indigo-950 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Aylık Ödeme (₺499/ay)
        </button>
        <button
          onClick={() => setSelectedCycle('annual')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            selectedCycle === 'annual' ? 'bg-indigo-950 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <span>Yıllık Ödeme (₺4.990/yıl)</span>
          <span className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black shadow-xs">
            2 Ay İndirimli
          </span>
        </button>
      </div>

      {/* Paket Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {SUBSCRIPTION_TIERS.map((tier) => {
          const isCurrent = tier.id === subscription.currentTierId && isSubActive;
          const displayPrice = selectedCycle === 'monthly' ? tier.monthlyPrice : Math.round(tier.annualPrice / 12);

          return (
            <div
              key={tier.id}
              className={`bg-white rounded-3xl p-6 sm:p-7 border shadow-xs flex flex-col justify-between transition-all relative ${
                isCurrent 
                  ? 'border-indigo-600 ring-2 ring-indigo-600/30 shadow-md' 
                  : tier.recommended 
                  ? 'border-amber-400 shadow-xl ring-1 ring-amber-400/50' 
                  : 'border-slate-200'
              }`}
            >
              {tier.recommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 font-black text-[10px] px-3.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                  EN ÇOK TERCİH EDİLEN
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-black text-indigo-700 uppercase tracking-wider">{tier.badge}</span>
                  <h3 className="text-xl font-black text-slate-900">{tier.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed min-h-[36px]">{tier.tagline}</p>
                </div>

                <div className="pt-2 pb-3 border-y border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">
                      ₺{selectedCycle === 'monthly' ? tier.monthlyPrice : tier.annualPrice}
                    </span>
                    <span className="text-xs text-slate-500 font-bold">
                      / {selectedCycle === 'monthly' ? 'ay' : 'yıl'}
                    </span>
                  </div>
                  {selectedCycle === 'annual' && (
                    <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                      Aylık eşdeğeri yaklaşık ₺{displayPrice} (Yıllık ₺{tier.annualPrice})
                    </span>
                  )}
                </div>

                <div className="space-y-2.5">
                  <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider block">Dahil Özellikler:</span>
                  {tier.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-3.5 bg-slate-100 text-slate-500 font-bold text-xs rounded-2xl cursor-default flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4 text-emerald-600" />
                    Şu Anki Aktif Paketiniz
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenPaytrCheckout(tier)}
                    className="w-full py-3.5 bg-indigo-900 hover:bg-indigo-800 text-white font-black text-xs rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>PayTR ile Seç ve Başlat</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* PayTR Checkout Modal */}
      {targetTierForPayment && (
        <PaytrSubscriptionCheckoutModal
          isOpen={checkoutModalOpen}
          onClose={() => setCheckoutModalOpen(false)}
          selectedTier={targetTierForPayment}
          billingCycle={selectedCycle}
          onSuccess={handlePaymentSuccess}
          currentStoreName={currentStoreName}
        />
      )}

    </div>
  );
}
