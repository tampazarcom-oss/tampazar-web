/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Printer, Download, Sparkles, CheckCircle2, Store, Phone, 
  MapPin, ShieldCheck, Zap, Heart, Gift, Share2, Copy, Check,
  Palette, FileText, Smartphone, ExternalLink, RefreshCw, Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ShopWindowPosterModuleProps {
  currentStoreName?: string;
  storeSlug?: string;
  storeAddress?: string;
}

type PosterSize = 'A4_POSTER' | 'A5_COUNTER' | 'MINI_TENT';
type PosterTheme = 'EMERALD_GOLD' | 'NAVY_SKY' | 'WARM_AMBER' | 'MINIMAL_DARK';

export default function ShopWindowPosterModule({ 
  currentStoreName, 
  storeSlug: initialStoreSlug, 
  storeAddress: initialStoreAddress 
}: ShopWindowPosterModuleProps) {
  const { user } = useAuth();
  const printRef = useRef<HTMLDivElement>(null);

  // Store profile data
  const storeName = currentStoreName || user?.storeName || 'FotoSentez Stüdyo & Mahalle Esnafı';
  const storeSlug = initialStoreSlug || (storeName || 'magaza').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  const storeUrl = `https://tampazar.com/magaza/${storeSlug}`;
  
  // Customization state
  const [posterSize, setPosterSize] = useState<PosterSize>('A4_POSTER');
  const [posterTheme, setPosterTheme] = useState<PosterTheme>('EMERALD_GOLD');
  const [slogan, setSlogan] = useState('Telefonunuzun kamerasını okutun, mahalle dükkanımıza doğrudan bağlanın!');
  const [headline, setHeadline] = useState('Mahallemizin Dijital Vitrini');
  const [subHeadline, setSubHeadline] = useState('Aracısız, komisyonsuz ve taze sipariş bir tıkla kapınızda.');
  const [storeAddress, setStoreAddress] = useState(initialStoreAddress || 'Bahçelievler Mah. Atatürk Bulvarı No: 42, Altınordu / Ordu');
  const [storePhone, setStorePhone] = useState(user?.phone || '+90 532 555 12 34');
  
  // Badges to show
  const [showDeliveryBadge, setShowDeliveryBadge] = useState(true);
  const [showPaymentBadge, setShowPaymentBadge] = useState(true);
  const [showZeroCommissionBadge, setShowZeroCommissionBadge] = useState(true);
  const [showLoyaltyBadge, setShowLoyaltyBadge] = useState(true);
  const [loyaltyOfferText, setLoyaltyOfferText] = useState('5. Siparişte Sıcak Mahalle İkramı!');

  const [copiedLink, setCopiedLink] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(storeUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Theme styles
  const getThemeStyles = () => {
    switch (posterTheme) {
      case 'EMERALD_GOLD':
        return {
          primaryBg: 'bg-[#0F4C3A]',
          secondaryBg: 'bg-[#0B3A2C]',
          accentText: 'text-[#F59E0B]',
          accentBg: 'bg-[#F59E0B]',
          borderCol: 'border-[#F59E0B]/30',
          gradient: 'from-[#0F4C3A] via-[#0B3A2C] to-[#08281E]',
          qrFg: '#0F4C3A',
          headerText: 'text-white'
        };
      case 'NAVY_SKY':
        return {
          primaryBg: 'bg-[#0B132B]',
          secondaryBg: 'bg-[#1C2541]',
          accentText: 'text-sky-400',
          accentBg: 'bg-sky-400',
          borderCol: 'border-sky-400/30',
          gradient: 'from-[#0B132B] via-[#1C2541] to-[#3A506B]',
          qrFg: '#0B132B',
          headerText: 'text-white'
        };
      case 'WARM_AMBER':
        return {
          primaryBg: 'bg-[#78350F]',
          secondaryBg: 'bg-[#92400E]',
          accentText: 'text-amber-300',
          accentBg: 'bg-amber-400',
          borderCol: 'border-amber-400/30',
          gradient: 'from-[#78350F] via-[#92400E] to-[#B45309]',
          qrFg: '#78350F',
          headerText: 'text-white'
        };
      case 'MINIMAL_DARK':
      default:
        return {
          primaryBg: 'bg-slate-900',
          secondaryBg: 'bg-slate-800',
          accentText: 'text-emerald-400',
          accentBg: 'bg-emerald-500',
          borderCol: 'border-emerald-500/30',
          gradient: 'from-slate-950 via-slate-900 to-slate-800',
          qrFg: '#0F172A',
          headerText: 'text-white'
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <div className="space-y-6">
      
      {/* 1. ÜST BAŞLIK & REHBER */}
      <div className="no-print bg-gradient-to-r from-[#0F4C3A] to-[#0B132B] rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Fiziksel Mağaza ➔ Dijital Vitrin Dönüşümü</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Dükkan Camı & Kasa Önü QR Afiş Üretici</h2>
          <p className="text-xs text-slate-300 font-medium max-w-2xl">
            Dükkanınızın camına, masalarına veya kasasına asabileceğiniz yüksek çözünürlüklü QR afişler üretin.
            Mahallelinin telefon kamerasıyla anında dükkanınıza ulaşıp %0 komisyonla sipariş vermesini sağlayın.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleCopyLink}
            className="py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
            <span>{copiedLink ? 'Link Kopyalandı!' : 'Mağaza Linki'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="py-2.5 px-5 bg-[#F59E0B] hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xl transition flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-950" />
            <span>Afişi Yazdır / PDF İndir</span>
          </button>
        </div>
      </div>

      {/* 2. DÜZENLEME & ÖNİZLEME ALANI (2 SÜTUN) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* SOL SÜTUN: ÖZELLEŞTİRME FORMU (no-print) */}
        <div className="no-print lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#0F4C3A]" />
              Afiş Şablonu & Bilgi Ayarları
            </h3>
            <span className="text-[10px] font-bold text-slate-500">Canlı Önizleme</span>
          </div>

          {/* Afiş Boyutu / Formatı */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Afiş Boyutu & Kullanım Alanı</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPosterSize('A4_POSTER')}
                className={`p-2.5 rounded-xl border text-center font-bold transition cursor-pointer flex flex-col items-center gap-1 ${
                  posterSize === 'A4_POSTER'
                    ? 'border-[#0F4C3A] bg-emerald-50 text-[#0F4C3A]'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="text-[11px]">A4 Dikey Cam</span>
              </button>

              <button
                type="button"
                onClick={() => setPosterSize('A5_COUNTER')}
                className={`p-2.5 rounded-xl border text-center font-bold transition cursor-pointer flex flex-col items-center gap-1 ${
                  posterSize === 'A5_COUNTER'
                    ? 'border-[#0F4C3A] bg-emerald-50 text-[#0F4C3A]'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span className="text-[11px]">A5 Kasa Kartı</span>
              </button>

              <button
                type="button"
                onClick={() => setPosterSize('MINI_TENT')}
                className={`p-2.5 rounded-xl border text-center font-bold transition cursor-pointer flex flex-col items-center gap-1 ${
                  posterSize === 'MINI_TENT'
                    ? 'border-[#0F4C3A] bg-emerald-50 text-[#0F4C3A]'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span className="text-[11px]">Masaüstü QR</span>
              </button>
            </div>
          </div>

          {/* Renk Teması */}
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Renk Teması</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPosterTheme('EMERALD_GOLD')}
                className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition font-bold ${
                  posterTheme === 'EMERALD_GOLD' ? 'border-[#0F4C3A] bg-emerald-50/70 text-[#0F4C3A]' : 'border-slate-200 text-slate-600'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-[#0F4C3A] border border-amber-400" />
                <span className="text-[11px]">Zümrüt & Kehribar</span>
              </button>

              <button
                type="button"
                onClick={() => setPosterTheme('NAVY_SKY')}
                className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition font-bold ${
                  posterTheme === 'NAVY_SKY' ? 'border-sky-600 bg-sky-50 text-slate-900' : 'border-slate-200 text-slate-600'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-[#0B132B] border border-sky-400" />
                <span className="text-[11px]">Gece Laciverti</span>
              </button>

              <button
                type="button"
                onClick={() => setPosterTheme('WARM_AMBER')}
                className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition font-bold ${
                  posterTheme === 'WARM_AMBER' ? 'border-amber-600 bg-amber-50 text-amber-950' : 'border-slate-200 text-slate-600'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-[#78350F] border border-amber-300" />
                <span className="text-[11px]">Fırın / Cafe Kehribar</span>
              </button>

              <button
                type="button"
                onClick={() => setPosterTheme('MINIMAL_DARK')}
                className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition font-bold ${
                  posterTheme === 'MINIMAL_DARK' ? 'border-slate-800 bg-slate-100 text-slate-900' : 'border-slate-200 text-slate-600'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-slate-900 border border-emerald-400" />
                <span className="text-[11px]">Mat Siyah & Neon</span>
              </button>
            </div>
          </div>

          {/* Başlık ve Slogan */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Afiş Üst Başlığı</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Alt Açıklama</label>
              <input
                type="text"
                value={subHeadline}
                onChange={(e) => setSubHeadline(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">QR Altı Çağrı Metni</label>
              <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Dükkan Adresi</label>
              <input
                type="text"
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-700"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">İletişim / Sipariş Hattı</label>
              <input
                type="text"
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-700"
              />
            </div>
          </div>

          {/* Rozet Seçimleri */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="font-bold text-slate-700 block">Afişte Gösterilecek Rozetler</label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={showDeliveryBadge} 
                onChange={(e) => setShowDeliveryBadge(e.target.checked)}
                className="rounded text-[#0F4C3A]" 
              />
              <span className="font-medium text-slate-700">⚡ 30-45 Dk Kapıda / Hızlı Teslimat</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={showPaymentBadge} 
                onChange={(e) => setShowPaymentBadge(e.target.checked)}
                className="rounded text-[#0F4C3A]" 
              />
              <span className="font-medium text-slate-700">💳 Kapıda Nakit, POS veya Kartsız Ödeme</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={showZeroCommissionBadge} 
                onChange={(e) => setShowZeroCommissionBadge(e.target.checked)}
                className="rounded text-[#0F4C3A]" 
              />
              <span className="font-medium text-slate-700">🛡️ %0 Komisyon, Doğrudan Esnaf Fiyatı</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={showLoyaltyBadge} 
                onChange={(e) => setShowLoyaltyBadge(e.target.checked)}
                className="rounded text-[#0F4C3A]" 
              />
              <span className="font-medium text-slate-700">🎁 Mahalle Sadakat İkramı</span>
            </label>

            {showLoyaltyBadge && (
              <div className="pl-6 pt-1">
                <input
                  type="text"
                  value={loyaltyOfferText}
                  onChange={(e) => setLoyaltyOfferText(e.target.value)}
                  placeholder="Örn: 5. Siparişte Sıcak Fırın Ekmeği Hediyesi"
                  className="w-full px-2.5 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-950 font-bold"
                />
              </div>
            )}
          </div>
        </div>

        {/* SAĞ SÜTUN: BASKI & AFİŞ GÖRSEL ÖNİZLEMESİ (Baskıya gidecek alan) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          
          <div className="no-print w-full flex items-center justify-between mb-3 text-xs text-slate-500 font-bold px-2">
            <span>📄 {posterSize === 'A4_POSTER' ? 'A4 Dikey Afiş (210 x 297 mm)' : posterSize === 'A5_COUNTER' ? 'A5 Kasa Kartı (148 x 210 mm)' : 'Masaüstü QR Ayaklık'}</span>
            <span className="text-emerald-700">✓ Vektörel Baskı Kalitesi</span>
          </div>

          {/* BASKI SAYFASI SARMALAYICISI (PRINT CONTAINER) */}
          <div 
            id="print-poster-card"
            ref={printRef}
            className={`w-full max-w-[540px] bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-slate-900 transition-all duration-300 print:shadow-none print:border-none print:w-full print:max-w-none print:m-0 print:p-0`}
            style={{
              aspectRatio: posterSize === 'MINI_TENT' ? '4/5' : '1/1.414' // A4/A5 oranı
            }}
          >
            {/* AFİŞ İÇERİĞİ */}
            <div className={`h-full flex flex-col justify-between bg-gradient-to-b ${theme.gradient} text-white p-6 sm:p-8 relative overflow-hidden`}>
              
              {/* Arka Plan Vektörel Desenler */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

              {/* 1. AFİŞ HEADER: TAMPAZAR KURUMSAL & ESNAF MAĞAZA ADI */}
              <div className="relative z-10 text-center space-y-2 border-b border-white/15 pb-4">
                <div className="inline-flex items-center gap-2 bg-black/25 px-3 py-1 rounded-full border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                    TamPazar.com · Mahalle Ticaret Ağı
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-sm">
                  {headline}
                </h1>
                
                <p className="text-xs sm:text-sm text-slate-200 font-medium max-w-sm mx-auto">
                  {subHeadline}
                </p>
              </div>

              {/* 2. DÜKKAN ADI VE DİNAMİK QR KOD BÖLGESİ */}
              <div className="relative z-10 my-auto py-4 flex flex-col items-center text-center space-y-3">
                
                <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-white/25">
                  <span className="text-base sm:text-lg font-black text-[#F59E0B] tracking-wide">
                    🏪 {storeName}
                  </span>
                </div>

                {/* QR KUTUSU */}
                <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-2xl border-4 border-white/80 relative flex flex-col items-center group">
                  <QRCodeSVG
                    value={storeUrl}
                    size={posterSize === 'MINI_TENT' ? 140 : 180}
                    level="H"
                    includeMargin={false}
                    fgColor={theme.qrFg}
                    bgColor="#FFFFFF"
                    imageSettings={{
                      src: '/favicon.svg',
                      x: undefined,
                      y: undefined,
                      height: 36,
                      width: 36,
                      excavate: true,
                    }}
                  />

                  {/* QR Altı Küçük Rozet */}
                  <div className="mt-2 text-[10px] font-black text-slate-900 uppercase tracking-wider bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-300">
                    Kameranızı Okutun 📲
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-bold text-amber-200 max-w-xs leading-snug">
                  {slogan}
                </p>
                <span className="text-[11px] font-mono text-slate-300 bg-black/30 px-3 py-1 rounded-full border border-white/10">
                  {storeUrl}
                </span>
              </div>

              {/* 3. ROZETLER & JEST İKRAM ŞERİDİ */}
              <div className="relative z-10 space-y-3 border-t border-white/15 pt-4">
                
                {/* İkram Şeridi */}
                {showLoyaltyBadge && (
                  <div className="bg-[#F59E0B] text-slate-950 px-3 py-1.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-md">
                    <Gift className="w-4 h-4 shrink-0 text-slate-950" />
                    <span>{loyaltyOfferText}</span>
                  </div>
                )}

                {/* Alt Rozetler Izgarası */}
                <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-[11px] font-bold">
                  {showDeliveryBadge && (
                    <div className="bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>30-45 Dk Kapıda Teslimat</span>
                    </div>
                  )}

                  {showPaymentBadge && (
                    <div className="bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Kapıda Nakit / POS</span>
                    </div>
                  )}

                  {showZeroCommissionBadge && (
                    <div className="bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5 col-span-2 justify-center">
                      <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>%0 Komisyonlu Mahalle Esnafı & Doğrudan Güvenli Alışveriş</span>
                    </div>
                  )}
                </div>

                {/* Alt Adres ve İletişim Satırı */}
                <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-slate-300 pt-1">
                  <div className="flex items-center gap-1 truncate max-w-[65%]">
                    <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">{storeAddress}</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono font-bold shrink-0">
                    <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{storePhone}</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Alt Hızlı İpuçları */}
          <div className="no-print mt-4 p-4 bg-slate-100 rounded-2xl text-xs text-slate-600 max-w-[540px] w-full flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p>
              <strong>Baskı İpucu:</strong> Afişi renkli A4 parlak kuşe kağıda bastırarak dükkanınızın camına veya kasanızın yanına asabilirsiniz. Müşteriler dükkanınız kapalıyken bile vitrinden sipariş verebilir.
            </p>
          </div>

        </div>

      </div>

      {/* PRINT CSS OVERRIDE STYLES */}
      <style>{`
        @media print {
          /* Hide all UI elements except the poster */
          body * {
            visibility: hidden !important;
          }
          #print-poster-card, #print-poster-card * {
            visibility: visible !important;
          }
          #print-poster-card {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-width: none !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

    </div>
  );
}
