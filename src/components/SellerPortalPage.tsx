/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Store, ShieldCheck, CreditCard, FileText, Truck, 
  Sparkles, CheckCircle2, ArrowRight, Lock, Mail, Phone,
  Building, MapPin, Zap, Users, ArrowUpRight, HelpCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import SellerOnboardingWizardModal from './SellerOnboardingWizardModal';

interface SellerPortalPageProps {
  onBackToMarketplace?: () => void;
}

export default function SellerPortalPage({ onBackToMarketplace }: SellerPortalPageProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('register');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State
  const [regShopName, setRegShopName] = useState('');
  const [regOwnerName, setRegOwnerName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCity, setRegCity] = useState('İstanbul');
  const [regDistrict, setRegDistrict] = useState('Kadıköy');
  const [regCategory, setRegCategory] = useState('restaurant');

  // Wizard Modal state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [registeredShopData, setRegisteredShopData] = useState<any>(null);

  // FAQ open toggles
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate seller login -> navigate to seller dashboard
    navigate('/yonetim');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const shopData = {
      shopName: regShopName || 'Yeni Esnaf Mağazası',
      ownerName: regOwnerName || 'Esnaf Yetkilisi',
      city: regCity,
      district: regDistrict,
      category: regCategory
    };
    setRegisteredShopData(shopData);
    setIsWizardOpen(true);
  };

  const faqs = [
    {
      q: 'TamPazar gerçekten %0 komisyon mu alıyor?',
      a: 'Evet! TamPazar kapalı devre komisyonsuz esnaf altyapısıdır. Satışlarınızdan %0 pazaryeri komisyonu kesilir. Paranız doğrudan kendi banka hesabınıza veya Sanal POS yetkinize geçer.'
    },
    {
      q: 'Kendi Sanal POS (PayTR/iyzico) API anahtarlarımı bağlayabilir miyim?',
      a: 'Tamamen özgürsünüz! BYO (Bring Your Own POS) modelimiz sayesinde kendi PayTR veya iyzico oranlarınızı sisteme bağlayabilir, ertesi iş günü tahsilatınızı bankanızdan doğrudan çekebilirsiniz.'
    },
    {
      q: 'Kargo ve Mahalle İçi Teslimat Süreçleri Nasıl Çalışır?',
      a: 'İsterseniz mahallenizde kendi kuryenizle 30 dakikada teslimat yapabilir, isterseniz sistem üzerinden anlaşmalı Yurtiçi Kargo barkodunu tek tıkla yazdırıp Türkiye geneline gönderebilirsiniz.'
    },
    {
      q: 'GİB e-Fatura / e-Arşiv Entegrasyonu Ücretli mi?',
      a: 'Hayır, tüm paketlerimizde GİB e-Fatura ve e-Arşiv üretici modülü dahildir. Sipariş teslim edildiği anda resmi faturanız otomatik kesilir.'
    }
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      
      {/* HERO & FORM SECTION */}
      <section className="bg-gradient-to-b from-[#0B132B] via-[#0F224A] to-[#0B132B] text-white pt-8 pb-16 px-4 relative overflow-hidden">
        {/* Background Decorative Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0F4C3A]/30 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#F59E0B]/20 rounded-full filter blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          
          {/* Left Column: SaaS Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-[#F59E0B]/10 border border-[#F59E0B]/30 px-3.5 py-1.5 rounded-full text-amber-300 font-extrabold text-xs">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>TamPazar Esnaf & Satıcı Portalı — %0 Komisyon Mimarisi</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Aracı Komisyonu Ödemeyin, <br />
              <span className="text-[#F59E0B]">Mahallenizin Dijital Dükkanı Olun!</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed max-w-2xl">
              Restoranlar, butikler, zanaatkarlar, ustalar ve B2B üreticiler için tasarlanmış kapalı devre ticaret platformu. Kendi POS'unuzla, %0 komisyonla ve ertelemesiz nakit akışıyla doğrudan müşterinize ulaşın.
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 text-xs font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>%0 Pazaryeri Komisyonu</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 text-xs font-bold text-white">
                <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Kendi Sanal POS'un (BYO)</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 text-xs font-bold text-white">
                <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                <span>GİB e-Fatura Entegre</span>
              </div>
            </div>
          </div>

          {/* Right Column: Unified Login & Registration Form Card */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-6 sm:p-8 text-slate-800 relative">
              
              {/* Form Tabs Switcher */}
              <div className="flex rounded-2xl bg-slate-100 p-1 mb-6 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                    activeTab === 'register' 
                      ? 'bg-[#0F4C3A] text-white shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ✨ Mağaza Aç (14 Gün Ücretsiz)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                    activeTab === 'login' 
                      ? 'bg-[#0B132B] text-white shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🔑 Esnaf Girişi
                </button>
              </div>

              {/* REGISTER TAB FORM */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left">
                  <div className="text-center mb-2">
                    <h3 className="text-lg font-black text-[#0B132B]">Hemen Mağaza Başvurusu Yapın</h3>
                    <p className="text-xs text-slate-500">2 dakikada hesabınızı açın, kurulum sihirbazıyla canlıya geçin.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Dükkan / İşletme Adı *</label>
                    <input 
                      type="text" 
                      required
                      value={regShopName}
                      onChange={(e) => setRegShopName(e.target.value)}
                      placeholder="Örn: Caferağa Odun Fırını"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Yetkili Adı *</label>
                      <input 
                        type="text" 
                        required
                        value={regOwnerName}
                        onChange={(e) => setRegOwnerName(e.target.value)}
                        placeholder="Ad Soyad"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Telefon *</label>
                      <input 
                        type="tel" 
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="05XX XXX XX XX"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">E-posta Adresi *</label>
                    <input 
                      type="email" 
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="esnaf@tampazar.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">İl & İlçe</label>
                      <input 
                        type="text" 
                        value={`${regDistrict} / ${regCity}`}
                        onChange={(e) => setRegDistrict(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Sektör Tipi</label>
                      <select 
                        value={regCategory}
                        onChange={(e) => setRegCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                      >
                        <option value="restaurant">Restoran & Kafe</option>
                        <option value="butik">Moda & Butik</option>
                        <option value="yapi">Ev & Yapı Market</option>
                        <option value="usta">Usta & Saha Servisi</option>
                        <option value="dijital">Dijital Tasarımcı</option>
                        <option value="toptan">B2B Toptancı</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0F4C3A] hover:bg-[#0B382B] text-white py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all active:scale-95"
                  >
                    <span>14 Gün Ücretsiz Başlat →</span>
                  </button>

                  <p className="text-[10px] text-center text-slate-400 font-medium">
                    Kredi kartı gerekmez. Başvurudan hemen sonra kurulum sihirbazına geçilir.
                  </p>
                </form>
              )}

              {/* LOGIN TAB FORM */}
              {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                  <div className="text-center mb-2">
                    <h3 className="text-lg font-black text-[#0B132B]">Esnaf Yönetim Paneline Giriş</h3>
                    <p className="text-xs text-slate-500">Kayıtlı mağaza e-postanız ve şifrenizle giriş yapın.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">E-posta Adresi veya Telefon</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input 
                        type="text" 
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="esnaf@tampazar.com"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 outline-none focus:border-[#0B132B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Şifre</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input 
                        type="password" 
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 outline-none focus:border-[#0B132B]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-1.5 text-slate-600 font-semibold cursor-pointer">
                      <input type="checkbox" className="rounded text-[#0F4C3A]" defaultChecked />
                      <span>Beni Hatırla</span>
                    </label>
                    <button type="button" className="text-[#0F4C3A] font-bold hover:underline">
                      Şifremi Unuttum?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#0B132B] hover:bg-[#111B38] text-white py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all active:scale-95"
                  >
                    <span>Yönetim Paneline Giriş Yap</span>
                    <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
                  </button>

                  <div className="pt-2 text-center border-t border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">Henüz dükkanınız yok mu? </span>
                    <button 
                      type="button" 
                      onClick={() => setActiveTab('register')}
                      className="text-[#0F4C3A] font-extrabold text-xs hover:underline cursor-pointer"
                    >
                      Hemen Başvurun
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* VALUE PROPOSITION CARDS */}
      <section className="py-16 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="bg-emerald-100 text-[#0F4C3A] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            Neden TamPazar Satıcı Ağı?
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0B132B] mt-3">
            Geleneksel Pazaryeri Komisyonlarına Son Verin
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm font-medium mt-2">
            %35'e varan komisyon ve 45 günlük vade süreleri yerine, %0 komisyon ve ertesi gün doğrudan hesabınıza yatan peşin para akışı.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all text-left space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#0F4C3A] flex items-center justify-center font-black text-xl">
              🛡️
            </div>
            <h3 className="text-base font-extrabold text-[#0B132B]">Garanti %0 Komisyon</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Satış cironuzun %100'ü doğrudan esnaf kasasında kalır. Komisyon faturası veya aracı komisyon kesintisi yoktur.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all text-left space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#0B132B] flex items-center justify-center font-black text-xl">
              💳
            </div>
            <h3 className="text-base font-extrabold text-[#0B132B]">Kendi Sanal POS'un (BYO)</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Kendi PayTR / iyzico anlaşmanızı bağlayın. Müşterinin ödediği para aracı hesaba girmeden ertesi gün bankanıza düşsün.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all text-left space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-900 flex items-center justify-center font-black text-xl">
              🧾
            </div>
            <h3 className="text-base font-extrabold text-[#0B132B]">Otomatik GİB e-Fatura</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Her sipariş için GİB onaylı e-Fatura ve e-Arşiv faturanız entegre altyapı ile saniyeler içinde düzenlenir.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all text-left space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center font-black text-xl">
              🚚
            </div>
            <h3 className="text-base font-extrabold text-[#0B132B]">Çift Teslimat Modeli</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Kendi kuryenizle 30 dakikada yerel teslimat yapın ya da anlaşmalı Yurtiçi Kargo barkodunu tek tıkla basın.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-12 px-4 max-w-4xl mx-auto w-full">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-black text-[#0B132B]">Sıkça Sorulan Sorular</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">Esnaf ve satıcılarımızdan gelen en yaygın sorular</p>
        </div>

        <div className="space-y-3 text-left">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-5 py-4 flex items-center justify-between text-left font-extrabold text-xs sm:text-sm text-[#0B132B] hover:text-[#0F4C3A] cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 text-[#0F4C3A]" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ONBOARDING WIZARD MODAL */}
      <SellerOnboardingWizardModal 
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        initialShopData={registeredShopData}
      />

    </main>
  );
}
