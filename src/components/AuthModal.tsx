/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, User, Store, ShieldCheck, CheckCircle2, ArrowRight, 
  CreditCard, Sparkles, Building2, MapPin, Phone, Mail, Lock,
  ShoppingBag, Zap, HelpCircle
} from 'lucide-react';
import { useAuth, SellerRegisterData, BuyerRegisterData } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AuthModal() {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalInitialTab,
    loginAsBuyer,
    loginAsSeller,
    registerBuyer,
    registerSeller
  } = useAuth();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'buyer' | 'seller' | 'courier' | 'admin'>(authModalInitialTab);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Buyer Form State
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerCity, setBuyerCity] = useState('Ordu');
  const [buyerDistrict, setBuyerDistrict] = useState('Altınordu');

  // Seller Form State
  const [sellerStoreName, setSellerStoreName] = useState('');
  const [sellerLegalTitle, setSellerLegalTitle] = useState('');
  const [sellerTaxId, setSellerTaxId] = useState('');
  const [sellerTaxOffice, setSellerTaxOffice] = useState('Altınordu VD');
  const [sellerCity, setSellerCity] = useState('Ordu');
  const [sellerDistrict, setSellerDistrict] = useState('Altınordu');
  const [sellerSector, setSellerSector] = useState('Perakende & Mağaza');
  const [sellerPosPreference, setSellerPosPreference] = useState('PayTR (Doğrudan Esnaf Kasası)');
  const [sellerEmail, setSellerEmail] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');

  if (!isAuthModalOpen) return null;

  const handleBuyerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'login') {
      loginAsBuyer(buyerEmail || 'ahmet.yilmaz@tampazar.com');
    } else {
      registerBuyer({
        name: buyerName || 'Ahmet Yılmaz',
        email: buyerEmail || 'ahmet.yilmaz@tampazar.com',
        phone: buyerPhone || '+90 532 555 12 34',
        city: buyerCity,
        district: buyerDistrict
      });
    }
    navigate('/hesabim');
  };

  const handleSellerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'login') {
      loginAsSeller(sellerEmail || 'serkan@fotosentez.com', sellerStoreName || 'FotoSentez Stüdyo');
    } else {
      registerSeller({
        storeName: sellerStoreName || 'Karadeniz Butik',
        legalTitle: sellerLegalTitle || `${sellerStoreName || 'Karadeniz Butik'} Ticaret Ltd. Şti.`,
        taxId: sellerTaxId || '2910394821',
        taxOffice: sellerTaxOffice,
        city: sellerCity,
        district: sellerDistrict,
        sector: sellerSector,
        posPreference: sellerPosPreference,
        email: sellerEmail || 'esnaf@tampazar.com',
        phone: sellerPhone || '+90 542 000 11 22'
      });
    }
    navigate('/yonetim');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8">
        
        {/* Üst Başlık & Sekmeler */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button 
            onClick={closeAuthModal}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[10px] font-extrabold uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3" />
            tampazar.com Güvenli Kimlik Doğrulama
          </div>

          <h2 className="text-xl font-black text-white">
            {activeTab === 'buyer' ? 'Müşteri Hesabı' : 'Esnaf / Satıcı Portali'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {activeTab === 'buyer' 
              ? 'Siparişlerinizi takip edin, ustalardan randevu alın, favorilerinizi saklayın.'
              : '%0 Komisyonlu bağımsız mağazanızı açın, kendi Sanal POS\'unuzla doğrudan tahsilat yapın.'}
          </p>

          {/* İki Net Rol Seçeneği */}
          <div className="grid grid-cols-2 gap-2 mt-5 p-1 bg-slate-800 rounded-2xl">
            <button
              onClick={() => { setActiveTab('buyer'); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'buyer'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <User className="w-4 h-4 text-indigo-600" />
              <span>Müşteri Girişi / Kaydı</span>
            </button>
            <button
              onClick={() => { setActiveTab('seller'); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'seller'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Store className="w-4 h-4 text-slate-900" />
              <span>Esnaf / Mağaza Aç</span>
            </button>
          </div>
        </div>

        {/* Form Alanı */}
        <div className="p-6 space-y-5">

          {/* Giriş / Kayıt Ol Modu Değiştirici */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`text-xs font-bold pb-1 transition cursor-pointer ${
                  authMode === 'login'
                    ? 'text-indigo-900 border-b-2 border-indigo-900'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Giriş Yap
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`text-xs font-bold pb-1 transition cursor-pointer ${
                  authMode === 'register'
                    ? 'text-indigo-900 border-b-2 border-indigo-900'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {activeTab === 'buyer' ? 'Yeni Hesap Oluştur' : 'Yeni Mağaza Aç'}
              </button>
            </div>

            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL Korumalı
            </span>
          </div>

          {/* A) TÜKETİCİ / MÜŞTERİ FORMU */}
          {activeTab === 'buyer' && (
            <form onSubmit={handleBuyerSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Adınız Soyadınız</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input 
                      type="text" 
                      required
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Ahmet Yılmaz" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-600 font-medium"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">E-Posta Adresiniz</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type="email" 
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="ahmet.yilmaz@tampazar.com" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>

              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Telefon Numarası</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input 
                        type="tel" 
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        placeholder="+90 532 555 12 34" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-600 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Şehir</label>
                      <input 
                        type="text" 
                        value={buyerCity}
                        onChange={(e) => setBuyerCity(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-600 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">İlçe</label>
                      <input 
                        type="text" 
                        value={buyerDistrict}
                        onChange={(e) => setBuyerDistrict(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-600 font-medium"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Şifre</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••" 
                    defaultValue="123456"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-900 hover:bg-indigo-800 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{authMode === 'login' ? 'Müşteri Girişi Yap' : 'Hesabımı Oluştur'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Hızlı Demo Butonu */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    loginAsBuyer();
                    navigate('/hesabim');
                  }}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Tek Tıkla Demo Müşteri Olarak Giriş Yap</span>
                </button>
              </div>
            </form>
          )}

          {/* B) ESNAF / SATICI MAĞAZA AÇILIŞ VE GİRİŞ FORMU */}
          {activeTab === 'seller' && (
            <form onSubmit={handleSellerSubmit} className="space-y-3.5">
              
              {authMode === 'register' ? (
                <>
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-[11px] text-amber-900 space-y-1">
                    <div className="font-black flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-amber-700" />
                      Komisyonsuz Esnaf Modeli
                    </div>
                    <p className="text-amber-800/90 leading-tight">
                      tampazar.com satışlarınızdan %0 komisyon alır. Müşteri ödemeleri doğrudan kendi sanal POS'unuza yatar.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">İşletme / Mağaza Adı *</label>
                    <div className="relative">
                      <Store className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input 
                        type="text" 
                        required
                        value={sellerStoreName}
                        onChange={(e) => setSellerStoreName(e.target.value)}
                        placeholder="Örn: Kuzey Ahşap Tasarım" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-600 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Vergi No / TC *</label>
                      <input 
                        type="text" 
                        required
                        value={sellerTaxId}
                        onChange={(e) => setSellerTaxId(e.target.value)}
                        placeholder="11 veya 10 haneli" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-600 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Vergi Dairesi</label>
                      <input 
                        type="text" 
                        value={sellerTaxOffice}
                        onChange={(e) => setSellerTaxOffice(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-600 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Şehir</label>
                      <input 
                        type="text" 
                        value={sellerCity}
                        onChange={(e) => setSellerCity(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-600 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">İlçe</label>
                      <input 
                        type="text" 
                        value={sellerDistrict}
                        onChange={(e) => setSellerDistrict(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-600 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Faaliyet Sektörü</label>
                    <select
                      value={sellerSector}
                      onChange={(e) => setSellerSector(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-600 font-medium cursor-pointer"
                    >
                      <option value="Perakende & Mağaza">Alışveriş & Mağazalar (Ayakkabı, Giyim, Zanaat)</option>
                      <option value="Yeme & İçme">Yeme & İçme (Sıcak Paket & Döner)</option>
                      <option value="Hizmet & Tesisat">Usta & Tesisat Hizmeti (Su, Elektrik, Keşif)</option>
                      <option value="Acil Çekici & Yol Yardım">Acil Çekici & Yol Yardım (7/24 Nöbetçi)</option>
                      <option value="Toptan & Malzeme">Toptan & B2B Sanayi Malzemeleri</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sanal POS Sağlayıcı Tercihi (BYO POS)</label>
                    <select
                      value={sellerPosPreference}
                      onChange={(e) => setSellerPosPreference(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-600 font-medium cursor-pointer"
                    >
                      <option value="PayTR (Doğrudan Esnaf Kasası)">PayTR (Doğrudan Esnaf Hesabı)</option>
                      <option value="iyzico (Kendi Sanal POS)">iyzico (Kendi Sanal POS)</option>
                      <option value="Sipay Gateway">Sipay Gateway (Tüm Kartlar)</option>
                      <option value="Banka Sanal POS (Ziraat/İş/Garanti)">Banka Sanal POS (Ziraat / Garanti / İş)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Yetkili Telefon</label>
                      <input 
                        type="tel" 
                        value={sellerPhone}
                        onChange={(e) => setSellerPhone(e.target.value)}
                        placeholder="+90 5XX XXX XX XX"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-600 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">E-Posta</label>
                      <input 
                        type="email" 
                        value={sellerEmail}
                        onChange={(e) => setSellerEmail(e.target.value)}
                        placeholder="magaza@firma.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-600 font-medium"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kayıtlı Mağaza E-Postası</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input 
                        type="email" 
                        required
                        value={sellerEmail}
                        onChange={(e) => setSellerEmail(e.target.value)}
                        placeholder="serkan@fotosentez.com" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-600 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Yönetici Şifresi</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input 
                        type="password" 
                        required
                        placeholder="••••••••" 
                        defaultValue="123456"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-600 font-medium"
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{authMode === 'login' ? 'Yönetim Paneline Giriş Yap' : 'Mağazayı Aç & Yönetime Geç'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Hızlı Demo Esnaf Girişi */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    loginAsSeller('serkan@fotosentez.com', 'FotoSentez Stüdyo');
                    navigate('/yonetim');
                  }}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tek Tıkla Demo Esnaf Olarak Yönetime Geç (/yonetim)</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
