/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Store, CreditCard, Package, QrCode, CheckCircle2, 
  X, ArrowRight, ArrowLeft, Upload, Printer, Download, Sparkles,
  Building, MapPin, Clock, Phone, Mail, Check, ShieldCheck, Wallet, DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SellerOnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialShopData?: {
    shopName?: string;
    ownerName?: string;
    city?: string;
    district?: string;
    category?: string;
  };
  onComplete?: (shopData: any) => void;
}

export default function SellerOnboardingWizardModal({
  isOpen,
  onClose,
  initialShopData,
  onComplete
}: SellerOnboardingWizardModalProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Shop Info
  const [shopName, setShopName] = useState(initialShopData?.shopName || 'Moda Zanaat Fırını');
  const [ownerName, setOwnerName] = useState(initialShopData?.ownerName || 'Ahmet Usta');
  const [category, setCategory] = useState(initialShopData?.category || 'restaurant');
  const [city, setCity] = useState(initialShopData?.city || 'İstanbul');
  const [district, setDistrict] = useState(initialShopData?.district || 'Kadıköy');
  const [neighborhood, setNeighborhood] = useState('Caferağa Mahallesi');
  const [address, setAddress] = useState('Moda Cad. No:44');
  const [phone, setPhone] = useState('0216 333 44 55');
  const [workingHours, setWorkingHours] = useState('08:00 - 20:00');
  const [logoPreview, setLogoPreview] = useState('🥖');

  // Step 2: Payment Method (BYO Model)
  const [paymentModel, setPaymentModel] = useState<'paytr' | 'iban' | 'cash'>('paytr');
  const [paytrApiKey, setPaytrApiKey] = useState('ptr_live_884920491029481');
  const [paytrSecretKey, setPaytrSecretKey] = useState('ptr_sec_9938102938109');
  const [paytrMerchantId, setPaytrMerchantId] = useState('294810');
  const [bankName, setBankName] = useState('Garanti BBVA');
  const [iban, setIban] = useState('TR62 0006 2000 0000 0012 3456 78');
  const [accountHolder, setAccountHolder] = useState('Moda Zanaat Fırını Ahmet Yılmaz');

  // Step 3: First Product
  const [productTitle, setProductTitle] = useState('Ekşi Mayalı Odun Ateşi Taş Fırın Ekmek');
  const [productPrice, setProductPrice] = useState('45.00');
  const [productOldPrice, setProductOldPrice] = useState('55.00');
  const [productStock, setProductStock] = useState('100');
  const [productImage, setProductImage] = useState('https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400');

  // Step 4: Poster Printed status
  const [isPosterDownloaded, setIsPosterDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    } else {
      const fullShopData = {
        shopName,
        ownerName,
        category,
        city,
        district,
        address: `${address}, ${neighborhood}, ${district}/${city}`,
        phone,
        workingHours,
        paymentModel,
        paytrApiKey,
        iban,
        firstProduct: {
          title: productTitle,
          price: productPrice,
          stock: productStock
        }
      };
      if (onComplete) onComplete(fullShopData);
      onClose();
      navigate('/yonetim');
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handlePrintPoster = () => {
    setIsPosterDownloaded(true);
    window.print();
  };

  const steps = [
    { id: 1, title: 'Dükkan Bilgileri', icon: Store },
    { id: 2, title: 'Öleme Yöntemi (BYO)', icon: CreditCard },
    { id: 3, title: 'İlk Ürün / Hizmet', icon: Package },
    { id: 4, title: 'QR Vitrin Afişi', icon: QrCode },
    { id: 5, title: 'Canlıya Alındı!', icon: CheckCircle2 }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B132B]/80 backdrop-blur-md p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-4xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="bg-[#0B132B] text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F59E0B] text-[#0B132B] flex items-center justify-center font-black text-xl shadow-md">
              🛠️
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                Esnaf Kurulum Sihirbazı
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Adım Adım Başarı Yolu
                </span>
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                Mağazanızı 2 dakikada yayına alın, %0 komisyonla doğrudan satmaya başlayın.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 p-3 sm:p-4 overflow-x-auto scrollbar-none">
          <div className="flex items-center justify-between min-w-[600px] max-w-3xl mx-auto px-2">
            {steps.map((step) => {
              const StepIcon = step.icon;
              const isActive = step.id === currentStep;
              const isPassed = step.id < currentStep;

              return (
                <div key={step.id} className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-[#0F4C3A] text-white font-extrabold shadow-sm ring-2 ring-[#0F4C3A]/30' 
                      : isPassed 
                        ? 'bg-emerald-100 text-[#0F4C3A] font-bold' 
                        : 'bg-slate-200/70 text-slate-500 font-semibold'
                  }`}>
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                      isActive ? 'bg-[#F59E0B] text-[#0B132B]' : isPassed ? 'bg-[#0F4C3A] text-white' : 'bg-slate-300 text-slate-700'
                    }`}>
                      {isPassed ? <Check className="w-3.5 h-3.5" /> : step.id}
                    </div>
                    <span className="text-xs whitespace-nowrap">{step.title}</span>
                  </div>

                  {step.id < 5 && (
                    <div className={`w-6 sm:w-10 h-0.5 rounded ${isPassed ? 'bg-[#0F4C3A]' : 'bg-slate-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Wizard Step Body */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6">
          
          {/* STEP 1: SHOP INFO */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-lg font-black text-[#0B132B] flex items-center gap-2">
                  <Store className="w-5 h-5 text-[#0F4C3A]" />
                  Adım 1: Dükkan Bilgileri & Kimlik
                </h4>
                <p className="text-xs text-slate-500">
                  Müşterilerinizin haritada ve aramalarda göreceği temel işletme bilgilerini tamamlayın.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Dükkan / İşletme Adı *
                  </label>
                  <input 
                    type="text" 
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="Örn: Moda Zanaat Fırını"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Yetkili Adı Soyadı *
                  </label>
                  <input 
                    type="text" 
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Örn: Ahmet Yılmaz"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sektör / İşletme Tipi
                  </label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:border-[#0F4C3A] bg-white"
                  >
                    <option value="restaurant">Restoran, Fırın & Kafe (TamHızlı)</option>
                    <option value="butik">Moda, Giyim & Zanaat</option>
                    <option value="yapi">Ev, Yaşam & Yapı Market</option>
                    <option value="usta">Hizmet & Ustalık & Bakım (TamUsta)</option>
                    <option value="dijital">Dijital Varlık & Tasarımcı (TamDijital)</option>
                    <option value="toptan">B2B Toptan Tedarikçi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Telefon Numarası
                  </label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:border-[#0F4C3A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    İl & İlçe
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="İl"
                      className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                    />
                    <input 
                      type="text" 
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="İlçe"
                      className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Çalışma Saatleri
                  </label>
                  <input 
                    type="text" 
                    value={workingHours}
                    onChange={(e) => setWorkingHours(e.target.value)}
                    placeholder="Örn: 08:00 - 20:00"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:border-[#0F4C3A]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fiziksel Açık Adres (Harita Konumu İçin)
                  </label>
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Örn: Moda Cad. No:44 Caferağa Mah. Kadıköy / İstanbul"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 outline-none focus:border-[#0F4C3A]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PAYMENT MODEL (BYO) */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-lg font-black text-[#0B132B] flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#0F4C3A]" />
                  Adım 2: Ödeme Yöntemini Seç (BYO Modeli)
                </h4>
                <p className="text-xs text-slate-500">
                  TamPazar aracı komisyonu kesmez. Paranız doğrudan kendi banka hesabınıza veya Sanal POS'unuza yatar.
                </p>
              </div>

              {/* Payment Model Selector Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentModel('paytr')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                    paymentModel === 'paytr'
                      ? 'border-[#0F4C3A] bg-emerald-50/50 ring-2 ring-[#0F4C3A]/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <span className="text-2xl mb-2 block">💳</span>
                    <h5 className="font-extrabold text-xs text-[#0B132B]">Kendi PayTR Sanal POS'um</h5>
                    <p className="text-[11px] text-slate-500 mt-1">
                      PayTR / iyzico API anahtarlarınızı girin, ertesi gün hesabınıza yatsın.
                    </p>
                  </div>
                  <span className="mt-3 text-[10px] font-black uppercase text-[#0F4C3A] bg-emerald-100 px-2 py-0.5 rounded w-fit">
                    Sanal POS (BYO)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentModel('iban')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                    paymentModel === 'iban'
                      ? 'border-[#0F4C3A] bg-emerald-50/50 ring-2 ring-[#0F4C3A]/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <span className="text-2xl mb-2 block">🏦</span>
                    <h5 className="font-extrabold text-xs text-[#0B132B]">Doğrudan IBAN Havale / EFT</h5>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Müşteri sipariş tutarını doğrudan sizin IBAN'ınıza gönderir.
                    </p>
                  </div>
                  <span className="mt-3 text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded w-fit">
                    %0 Komisyon
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentModel('cash')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                    paymentModel === 'cash'
                      ? 'border-[#0F4C3A] bg-emerald-50/50 ring-2 ring-[#0F4C3A]/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <span className="text-2xl mb-2 block">💵</span>
                    <h5 className="font-extrabold text-xs text-[#0B132B]">Kapıda Nakit / POS</h5>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Sipariş teslimatında kuryeniz veya ustanız kapıda tahsil eder.
                    </p>
                  </div>
                  <span className="mt-3 text-[10px] font-black uppercase text-sky-800 bg-sky-100 px-2 py-0.5 rounded w-fit">
                    Anında Nakit
                  </span>
                </button>
              </div>

              {/* Dynamic Form based on model */}
              {paymentModel === 'paytr' && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                  <h6 className="text-xs font-bold text-[#0B132B] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#0F4C3A]" />
                    PayTR Sanal POS Anahtarlarınız
                  </h6>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Merchant ID</label>
                      <input 
                        type="text" 
                        value={paytrMerchantId}
                        onChange={(e) => setPaytrMerchantId(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">API Key</label>
                      <input 
                        type="text" 
                        value={paytrApiKey}
                        onChange={(e) => setPaytrApiKey(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Secret Key</label>
                      <input 
                        type="password" 
                        value={paytrSecretKey}
                        onChange={(e) => setPaytrSecretKey(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentModel === 'iban' && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                  <h6 className="text-xs font-bold text-[#0B132B] flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-[#0F4C3A]" />
                    Esnaf Banka IBAN Bilgileri
                  </h6>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Banka Adı</label>
                      <input 
                        type="text" 
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Hesap Sahibi</label>
                      <input 
                        type="text" 
                        value={accountHolder}
                        onChange={(e) => setAccountHolder(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">IBAN Numarası</label>
                      <input 
                        type="text" 
                        value={iban}
                        onChange={(e) => setIban(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold text-[#0F4C3A]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: FIRST PRODUCT */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-lg font-black text-[#0B132B] flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#0F4C3A]" />
                  Adım 3: İlk Ürün / Hizmetini Ekle
                </h4>
                <p className="text-xs text-slate-500">
                  Mağazanızın vitrininde sergilenecek ilk taze ürününüzü veya hizmet paketinizi ekleyin.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {/* Product Image Preview */}
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl text-center">
                  <img 
                    src={productImage} 
                    alt="Ürün Görseli" 
                    className="w-32 h-32 object-cover rounded-xl shadow-md mb-3"
                  />
                  <span className="text-[11px] font-bold text-slate-600">Örnek Ürün Görseli</span>
                  <button 
                    type="button"
                    onClick={() => setProductImage('https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=400')}
                    className="mt-2 text-[10px] text-[#0F4C3A] font-extrabold hover:underline cursor-pointer"
                  >
                    Görseli Değiştir 🔄
                  </button>
                </div>

                {/* Form fields */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Ürün / Hizmet Adı *
                    </label>
                    <input 
                      type="text" 
                      value={productTitle}
                      onChange={(e) => setProductTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold outline-none focus:border-[#0F4C3A]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Satış Fiyatı (₺)</label>
                      <input 
                        type="text" 
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-[#0F4C3A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Eski Fiyat (₺)</label>
                      <input 
                        type="text" 
                        value={productOldPrice}
                        onChange={(e) => setProductOldPrice(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-400 line-through"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Stok Adedi</label>
                      <input 
                        type="text" 
                        value={productStock}
                        onChange={(e) => setProductStock(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: QR POSTER */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-black text-[#0B132B] flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-[#0F4C3A]" />
                    Adım 4: QR Vitrin Afişinizi İndirin
                  </h4>
                  <p className="text-xs text-slate-500">
                    Dükkanınızın camına asın, mahalleliniz karekodu okutup aracı komisyonu olmadan sipariş versin!
                  </p>
                </div>

                <button 
                  onClick={handlePrintPoster}
                  className="bg-[#0F4C3A] hover:bg-[#0B382B] text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>A4 Afişi Yazdır / PDF</span>
                </button>
              </div>

              {/* A4 Poster Preview Box */}
              <div className="max-w-md mx-auto bg-white border-4 border-[#0B132B] rounded-3xl p-6 shadow-2xl text-center space-y-4 relative overflow-hidden">
                <div className="bg-[#0B132B] text-white py-2 px-4 rounded-xl -mx-2">
                  <h3 className="text-base font-black tracking-wider uppercase text-amber-400">{shopName}</h3>
                  <span className="text-[10px] text-slate-300 font-bold block">Mahallenizin Komisyonsuz Dijital Dükkanı</span>
                </div>

                <div className="py-2 flex flex-col items-center">
                  <div className="bg-white p-3 rounded-2xl border-2 border-slate-900 shadow-inner inline-block">
                    {/* Simulated High Density QR Code */}
                    <div className="w-36 h-36 bg-slate-900 rounded-lg p-2 flex flex-col justify-between text-white font-mono text-[8px] leading-none">
                      <div className="flex justify-between">
                        <div className="w-8 h-8 bg-white rounded border-2 border-slate-900"></div>
                        <div className="w-8 h-8 bg-white rounded border-2 border-slate-900"></div>
                      </div>
                      <div className="text-center font-bold text-amber-300 py-1">TAMPARA QR</div>
                      <div className="flex justify-between">
                        <div className="w-8 h-8 bg-white rounded border-2 border-slate-900"></div>
                        <div className="w-6 h-6 bg-amber-400 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-600 mt-2 block">
                    tampazar.com/dukkan/moda-zanaat
                  </span>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-[#0F4C3A]">
                  <p className="text-xs font-extrabold">📱 Telefon Kameranızla Okutun</p>
                  <p className="text-[10px] font-medium mt-0.5">Sıfır Komisyonla Doğrudan Sipariş Verin & Kapıda / Çevrimiçi Ödeyin!</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: SUCCESS & LIVE */}
          {currentStep === 5 && (
            <div className="text-center space-y-6 py-4 animate-fade-in">
              <div className="w-20 h-20 bg-emerald-100 text-[#0F4C3A] rounded-full flex items-center justify-center mx-auto shadow-lg ring-8 ring-emerald-50">
                <Sparkles className="w-10 h-10 animate-bounce" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-[#0B132B]">
                  🎉 Tebrikler! {shopName} TamPazar'da Yayında!
                </h3>
                <p className="text-sm text-slate-600 font-medium max-w-lg mx-auto mt-2">
                  Dükkanınız kuruldu. Mahalleliniz ve tüm müşterileriniz artık sizden %0 komisyonla doğrudan sipariş verebilir.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-2">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-left">
                  <span className="text-xs font-extrabold text-[#0B132B] block">🏪 Canlı Vitrin</span>
                  <span className="text-[11px] text-slate-500 mt-1 block">Açık AVM ve Haritada Görünürsünüz</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-left">
                  <span className="text-xs font-extrabold text-[#0B132B] block">💳 Doğrudan Tahsilat</span>
                  <span className="text-[11px] text-slate-500 mt-1 block">Paranız Doğrudan Sizin Hesabınızda</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-left">
                  <span className="text-xs font-extrabold text-[#0B132B] block">🧾 Otomatik e-Fatura</span>
                  <span className="text-[11px] text-slate-500 mt-1 block">GİB Onaylı Faturanız Hazır</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              currentStep === 1 
                ? 'opacity-30 cursor-not-allowed text-slate-400' 
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Geri</span>
          </button>

          <button
            type="button"
            onClick={handleNextStep}
            className="bg-[#0F4C3A] hover:bg-[#0B382B] text-white px-6 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
          >
            <span>
              {currentStep === 5 ? 'Yönetim Paneline Geç' : 'Devam Et'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
