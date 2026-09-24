/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, ShieldCheck, CreditCard, Lock, CheckCircle2, 
  AlertCircle, RefreshCw, Calendar, Sparkles, Building2, Check
} from 'lucide-react';
import { SubscriptionTier, SUBSCRIPTION_TIERS, MerchantSubscription } from '../../data/hybridCommerceData';

interface PaytrSubscriptionCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTier: SubscriptionTier;
  billingCycle: 'monthly' | 'annual';
  onSuccess: (updatedSub: MerchantSubscription) => void;
  currentStoreName: string;
}

export default function PaytrSubscriptionCheckoutModal({
  isOpen,
  onClose,
  selectedTier,
  billingCycle,
  onSuccess,
  currentStoreName
}: PaytrSubscriptionCheckoutModalProps) {
  const [cardNumber, setCardNumber] = useState('4028 9201 8491 4028');
  const [cardHolder, setCardHolder] = useState('FATİH ÇELİK');
  const [expiry, setExpiry] = useState('11/29');
  const [cvv, setCvv] = useState('492');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'checkout' | '3d_secure' | 'completed'>('checkout');
  const [smsOtp, setSmsOtp] = useState('');

  if (!isOpen) return null;

  const totalAmount = billingCycle === 'annual' ? selectedTier.annualPrice : selectedTier.monthlyPrice;

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('3d_secure');
    }, 1000);
  };

  const handleVerifyOtp = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('completed');
      
      const newSub: MerchantSubscription = {
        currentTierId: selectedTier.id,
        billingCycle: billingCycle,
        status: 'active',
        startedAt: new Date().toISOString().split('T')[0],
        renewalDate: new Date(Date.now() + (billingCycle === 'annual' ? 365 : 30) * 86400000).toISOString().split('T')[0],
        invoicesUsedThisMonth: 0,
        invoicesLimit: selectedTier.invoiceQuota,
        paymentMethodMask: `Mastercard ···· ${cardNumber.slice(-4)} (PayTR Token)`,
        lastPaymentAmount: totalAmount,
        paytrSubscriptionId: `PTR-SUB-${Math.floor(100000 + Math.random() * 900000)}`,
        autoRenew: true
      };

      try {
        localStorage.setItem('tampazar_merchant_subscription', JSON.stringify(newSub));
      } catch (err) {
        console.error(err);
      }

      setTimeout(() => {
        onSuccess(newSub);
        onClose();
      }, 1800);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                  PayTR Abonelik Geçidi
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  256-Bit SSL
                </span>
              </div>
              <h3 className="text-base font-black text-white">
                TamPazar Esnaf SaaS Aktivasyonu
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5 text-xs">
          
          {step === 'checkout' && (
            <form onSubmit={handleStartPayment} className="space-y-4">
              
              {/* Plan Summary Pill */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-black text-indigo-700 uppercase">Seçilen Paket:</span>
                  <div className="text-sm font-black text-slate-900">{selectedTier.name}</div>
                  <span className="text-[10px] text-slate-500">
                    {billingCycle === 'annual' ? 'Yıllık Peşin / 2 Ay Avantajlı' : 'Aylık Otomatik Tekrarlayan'}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-slate-900">₺{totalAmount.toLocaleString('tr-TR')}</div>
                  <span className="text-[10px] text-emerald-600 font-bold block">+ KDV Dahil</span>
                </div>
              </div>

              {/* PayTR Card Form */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Kart Üzerindeki İsim
                  </label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                    placeholder="AD SOYAD VEYA ŞİRKET ÜNVANI"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Kredi / Banka Kartı Numarası
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                      placeholder="4000 0000 0000 0000"
                    />
                    <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Son Kullanma (AA/YY)
                    </label>
                    <input
                      type="text"
                      required
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none text-center"
                      placeholder="12/28"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      Güvenlik Kodu (CVV)
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        maxLength={4}
                        required
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none text-center"
                        placeholder="•••"
                      />
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                    </div>
                  </div>
                </div>
              </div>

              {/* PayTR Recurring Consent */}
              <label className="flex items-start gap-2 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-indigo-600 cursor-pointer"
                />
                <span className="text-[11px] text-slate-600 leading-snug">
                  PayTR Altyapısıyla kartımın güvenle saklanmasını ve seçilen dönemde otomatik aidat tahsilatını onaylıyorum. İstediğim zaman yönetim panelinden tek tıkla iptal edebilirim.
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!agreeTerms || isProcessing}
                className="w-full py-3.5 bg-indigo-900 hover:bg-indigo-800 disabled:bg-slate-300 text-white font-black text-xs rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>PayTR Güvenli Bağlantı Kuruluyor...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>₺{totalAmount.toLocaleString('tr-TR')} Güvenli 3D Ödeme ile Başlat</span>
                  </>
                )}
              </button>
            </form>
          )}

          {step === '3d_secure' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-black">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                  <span>BKM & PayTR 3D Secure Doğrulaması</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  <strong>{cardHolder}</strong> adına kayıtlı banka kartınıza 6 haneli tek kullanımlık SMS onay şifresi gönderilmiştir.
                </p>
                <div className="text-[10px] text-slate-500 font-mono">
                  İşlem Tutarı: ₺{totalAmount.toLocaleString('tr-TR')} • İşyeri: TamPazar Bilişim A.Ş.
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  SMS Onay Şifresi (Test Kodu: 123456)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={smsOtp}
                  onChange={(e) => setSmsOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center tracking-[0.5em] font-mono text-lg py-3 bg-slate-50 border-2 border-indigo-200 rounded-xl font-black text-slate-900 focus:border-indigo-600 outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('checkout')}
                  className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Geri
                </button>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isProcessing}
                  className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-md flex items-center justify-center gap-2"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>3D Onayla ve Mağazayı Aç</span>
                </button>
              </div>
            </div>
          )}

          {step === 'completed' && (
            <div className="text-center py-6 space-y-3 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Aboneliğiniz Başarıyla Aktif Edildi!
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                <strong>"{currentStoreName}"</strong> mağazanız TamPazar canlı pazar vitrininde listelenmeye hazır. E-Arşiv faturanız e-posta adresinize iletilmiştir.
              </p>
              <div className="text-[11px] font-mono text-emerald-700 font-bold">
                Abonelik Durumu: AKTİF (%0 Komisyon)
              </div>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
          <span>PayTR Ödeme Kuruluşu A.Ş. Lisanslıdır</span>
          <span>TCMB Kayıtlı Altyapı</span>
        </div>

      </div>
    </div>
  );
}
