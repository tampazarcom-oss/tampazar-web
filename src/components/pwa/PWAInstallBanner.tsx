/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Download, Smartphone, X, Sparkles, CheckCircle2, 
  Share, PlusSquare, ArrowRight, Zap, Store
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export default function PWAInstallBanner() {
  const { isInstallable, isInstalled, isIOS, isMobile, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    const isDismissedInSession = sessionStorage.getItem('tampazar_pwa_dismissed');
    if (isDismissedInSession === 'true') {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('tampazar_pwa_dismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
    } else if (isInstallable) {
      await install();
    } else {
      // Fallback instruction
      setShowIOSModal(true);
    }
  };

  // If already installed or dismissed, do not show banner
  if (isInstalled || dismissed) {
    return null;
  }

  return (
    <>
      {/* 1. MOBİL / DESKTOP ALT SABİT YÜKLEME ÇUBUĞU */}
      <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-slide-up">
        <div className="bg-[#0B132B] text-white p-4 rounded-3xl shadow-2xl border border-slate-700/80 backdrop-blur-md flex flex-col gap-3 relative overflow-hidden ring-1 ring-amber-400/30">
          
          {/* Arka Plan Efekti */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F59E0B] to-amber-600 p-2 flex items-center justify-center shadow-md shrink-0">
                <img 
                  src="/favicon.svg" 
                  alt="TamPazar" 
                  className="w-7 h-7 object-contain"
                  onError={(e) => {
                    // Fallback to store icon if SVG fails
                    (e.target as HTMLElement).style.display = 'none';
                  }} 
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Mobil Uygulama
                  </span>
                  <span className="text-[10px] text-amber-300 font-bold">Hızlı Erişim</span>
                </div>
                <h4 className="font-black text-sm text-white mt-0.5">TamPazar'ı Ana Ekrana Ekleyin</h4>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
              title="Kapat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-300 font-medium relative z-10 leading-snug">
            Dükkanınızı, canlı kurye radarını ve siparişlerinizi uygulama hızında kesintisiz takip edin.
          </p>

          <div className="flex items-center gap-2 pt-1 relative z-10">
            <button
              type="button"
              onClick={handleInstallClick}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-400 to-[#F59E0B] hover:brightness-105 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>{isIOS ? 'iPhone\'a Ekle' : 'Şimdi Yükle / Ekle'}</span>
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Daha Sonra
            </button>
          </div>

        </div>
      </div>

      {/* 2. IOS SAFARI REHBERLİ YÜKLEME MODALI */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0B132B] text-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-700 space-y-4 animate-fade-in relative">
            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg font-black text-xl">
                TP
              </div>
              <h3 className="font-black text-lg text-white">iPhone / iPad'e Nasıl Eklenir?</h3>
              <p className="text-xs text-slate-300">
                TamPazar'ı App Store olmadan 2 basit adımda ana ekranınıza sabitleyebilirsiniz:
              </p>
            </div>

            <div className="space-y-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-xs">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <p className="text-slate-200">
                  Safari tarayıcısının altındaki <strong className="text-white">"Paylaş" (Share <Share className="w-3.5 h-3.5 inline mx-0.5 text-sky-400" />)</strong> butonuna dokunun.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <p className="text-slate-200">
                  Aşağı kaydırıp <strong className="text-white">"Ana Ekrana Ekle" (Add to Home Screen <PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-emerald-400" />)</strong> seçeneğini seçin.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition hover:bg-amber-300 cursor-pointer"
            >
              Anladım, Kapat
            </button>
          </div>
        </div>
      )}
    </>
  );
}
