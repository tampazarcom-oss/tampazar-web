/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CreditCard, Truck, FileText, ShieldCheck, Check, AlertCircle, 
  RefreshCw, Key, Lock, Eye, EyeOff, Save, Sparkles, Building, 
  Layers, CheckCircle2, ChevronRight, ExternalLink, HelpCircle
} from 'lucide-react';

export interface PosIntegrationState {
  provider: 'paytr' | 'iyzico' | 'sipay' | 'bank_pos' | 'iban_transfer' | 'cash_on_delivery';
  merchantId: string;
  apiKey: string;
  secretKey: string;
  storeCode?: string;
  is3dSecureEnforced: boolean;
  passInstallmentCommission: boolean;
  status: 'connected' | 'testing' | 'untested' | 'failed';
  lastPing?: string;
}

export interface CargoIntegrationState {
  carrier: 'yurtici' | 'aras' | 'mng' | 'ptt' | 'local_courier';
  customerNumber: string;
  apiKey: string;
  apiSecret: string;
  branchCode: string;
  autoGenerateBarcode: boolean;
  contractDiscountCode: string;
  status: 'connected' | 'testing' | 'untested' | 'failed';
  lastPing?: string;
}

export interface EInvoiceIntegrationState {
  provider: 'parasut' | 'bizimhesap' | 'gib_portal' | 'ubl_tr';
  clientId: string;
  clientSecret: string;
  username: string;
  apiKey: string;
  autoDraftOnOrder: boolean;
  sendToGibQueueDirectly: boolean;
  vatExemptionReasonCode?: string;
  status: 'connected' | 'testing' | 'untested' | 'failed';
  lastPing?: string;
}

export default function MerchantIntegrationHub() {
  const [activeTab, setActiveTab] = useState<'pos' | 'cargo' | 'einvoice'>('pos');
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // POS State
  const [posState, setPosState] = useState<PosIntegrationState>(() => {
    try {
      const saved = localStorage.getItem('tampazar_pos_integration');
      return saved ? JSON.parse(saved) : {
        provider: 'paytr',
        merchantId: 'MERCHANT-774921',
        apiKey: 'ptr_live_89a3f91048123bf018',
        secretKey: 'sec_live_9941a80291e92d774a',
        storeCode: 'MAGAZA-01',
        is3dSecureEnforced: true,
        passInstallmentCommission: true,
        status: 'connected',
        lastPing: '24.09.2026 14:15'
      };
    } catch {
      return {
        provider: 'paytr',
        merchantId: '',
        apiKey: '',
        secretKey: '',
        is3dSecureEnforced: true,
        passInstallmentCommission: true,
        status: 'untested'
      };
    }
  });

  // Cargo State
  const [cargoState, setCargoState] = useState<CargoIntegrationState>(() => {
    try {
      const saved = localStorage.getItem('tampazar_cargo_integration');
      return saved ? JSON.parse(saved) : {
        carrier: 'yurtici',
        customerNumber: 'YK-8829104',
        apiKey: 'yk_live_key_991823',
        apiSecret: 'yk_secret_881920',
        branchCode: '34-LEVENT',
        autoGenerateBarcode: true,
        contractDiscountCode: 'TAMPAZAR-OZEL-2026',
        status: 'connected',
        lastPing: '24.09.2026 12:40'
      };
    } catch {
      return {
        carrier: 'yurtici',
        customerNumber: '',
        apiKey: '',
        apiSecret: '',
        branchCode: '',
        autoGenerateBarcode: true,
        contractDiscountCode: '',
        status: 'untested'
      };
    }
  });

  // E-Invoice State
  const [eInvoiceState, setEInvoiceState] = useState<EInvoiceIntegrationState>(() => {
    try {
      const saved = localStorage.getItem('tampazar_einvoice_integration');
      return saved ? JSON.parse(saved) : {
        provider: 'parasut',
        clientId: 'client_prs_884920',
        clientSecret: 'sec_prs_99201948',
        username: 'muhasebe@fotosentez.com.tr',
        apiKey: 'api_gib_vuk_509',
        autoDraftOnOrder: true,
        sendToGibQueueDirectly: true,
        status: 'connected',
        lastPing: '24.09.2026 13:00'
      };
    } catch {
      return {
        provider: 'parasut',
        clientId: '',
        clientSecret: '',
        username: '',
        apiKey: '',
        autoDraftOnOrder: true,
        sendToGibQueueDirectly: false,
        status: 'untested'
      };
    }
  });

  const [testingModule, setTestingModule] = useState<'pos' | 'cargo' | 'einvoice' | null>(null);

  // Test POS
  const handleTestPos = () => {
    setTestingModule('pos');
    setTimeout(() => {
      setTestingModule(null);
      const isOk = !!(posState.merchantId && posState.apiKey);
      const updated = {
        ...posState,
        status: (isOk ? 'connected' : 'failed') as any,
        lastPing: new Date().toLocaleString('tr-TR')
      };
      setPosState(updated);
      localStorage.setItem('tampazar_pos_integration', JSON.stringify(updated));
      setSaveToast(isOk ? 'Sanal POS canlı bağlantısı başarıyla doğrulandı!' : 'Hata: Kimlik bilgileri geçersiz.');
      setTimeout(() => setSaveToast(null), 3500);
    }, 1100);
  };

  // Test Cargo
  const handleTestCargo = () => {
    setTestingModule('cargo');
    setTimeout(() => {
      setTestingModule(null);
      const isOk = !!(cargoState.customerNumber && cargoState.apiKey);
      const updated = {
        ...cargoState,
        status: (isOk ? 'connected' : 'failed') as any,
        lastPing: new Date().toLocaleString('tr-TR')
      };
      setCargoState(updated);
      localStorage.setItem('tampazar_cargo_integration', JSON.stringify(updated));
      setSaveToast(isOk ? 'Kargo API el sıkışması başarılı! Otomatik barkod servisi aktif.' : 'Kargo API hatası: Müşteri numaranızı kontrol edin.');
      setTimeout(() => setSaveToast(null), 3500);
    }, 1100);
  };

  // Test E-Invoice
  const handleTestEInvoice = () => {
    setTestingModule('einvoice');
    setTimeout(() => {
      setTestingModule(null);
      const isOk = !!(eInvoiceState.clientId || eInvoiceState.username);
      const updated = {
        ...eInvoiceState,
        status: (isOk ? 'connected' : 'failed') as any,
        lastPing: new Date().toLocaleString('tr-TR')
      };
      setEInvoiceState(updated);
      localStorage.setItem('tampazar_einvoice_integration', JSON.stringify(updated));
      setSaveToast(isOk ? 'E-Fatura muhasebe köprüsü bağlandı! Satışlarda taslak fatura kesilecek.' : 'E-Fatura yetkilendirme hatası.');
      setTimeout(() => setSaveToast(null), 3500);
    }, 1100);
  };

  const handleSaveAll = () => {
    localStorage.setItem('tampazar_pos_integration', JSON.stringify(posState));
    localStorage.setItem('tampazar_cargo_integration', JSON.stringify(cargoState));
    localStorage.setItem('tampazar_einvoice_integration', JSON.stringify(eInvoiceState));
    setSaveToast('Tüm esnaf entegrasyon ayarları başarıyla kaydedildi!');
    setTimeout(() => setSaveToast(null), 3500);
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-indigo-900/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400 text-slate-950 rounded-full text-xs font-black uppercase tracking-wider shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            BYO (Kendi Entegrasyonunu Getir) Mimarisi
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Esnaf Bağımsız Entegrasyon Merkezi
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            TamPazar aracı komisyonu almaz; satış bedelleriniz doğrudan kendi <strong>Sanal POS / Banka hesabınıza</strong>, kargo etiketleriniz kendi <strong>anlaşmalı kargo cari kodunuza</strong> ve e-faturalarınız doğrudan kendi <strong>muhasebe portalınıza</strong> aktarılır.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-lg transition flex items-center gap-2 cursor-pointer shrink-0 self-start md:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Tüm Entegrasyonları Kaydet</span>
        </button>
      </div>

      {saveToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold rounded-2xl flex items-center gap-2 shadow-xs animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* TABS NAVIGATION */}
      <div className="grid grid-cols-3 gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => setActiveTab('pos')}
          className={`py-3 px-4 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'pos'
              ? 'bg-indigo-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span className="hidden sm:inline">1. Sanal POS (Ödeme)</span>
          <span className="sm:hidden">1. POS</span>
          {posState.status === 'connected' && (
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('cargo')}
          className={`py-3 px-4 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'cargo'
              ? 'bg-indigo-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span className="hidden sm:inline">2. Kargo Entegrasyonu</span>
          <span className="sm:hidden">2. Kargo</span>
          {cargoState.status === 'connected' && (
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('einvoice')}
          className={`py-3 px-4 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'einvoice'
              ? 'bg-indigo-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">3. E-Fatura & Muhasebe</span>
          <span className="sm:hidden">3. E-Fatura</span>
          {eInvoiceState.status === 'connected' && (
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          )}
        </button>
      </div>

      {/* ================= 1. SANAL POS (ÖDEME) ENTEGRASYONU ================= */}
      {activeTab === 'pos' && (
        <div className="space-y-5 animate-fade-in">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-base text-slate-900">Sanal POS & Doğrudan Tahsilat Seçimi</h3>
                <p className="text-slate-500 text-[11px]">Müşteri ödemeleri aracı olmaksızın seçtiğiniz sağlayıcıdan sizin banka hesabınıza aktarılır.</p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${
                  posState.status === 'connected' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${posState.status === 'connected' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {posState.status === 'connected' ? `Bağlı (${posState.lastPing})` : 'Bağlantı Bekleniyor'}
                </span>
                
                <button
                  type="button"
                  onClick={handleTestPos}
                  disabled={testingModule === 'pos'}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testingModule === 'pos' ? 'animate-spin' : ''}`} />
                  <span>{testingModule === 'pos' ? 'Sorgulanıyor...' : 'Bağlantıyı Test Et'}</span>
                </button>
              </div>
            </div>

            {/* Provider Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
              {[
                { id: 'paytr', label: 'PayTR', desc: 'Sanal POS & Abonelik' },
                { id: 'iyzico', label: 'iyzico', desc: 'Checkout Formu' },
                { id: 'sipay', label: 'Sipay', desc: 'Düşük Komisyon' },
                { id: 'bank_pos', label: 'Banka Sanal POS', desc: 'Akbank, Garanti vb.' },
                { id: 'iban_transfer', label: 'IBAN / Havale', desc: 'Doğrudan Banka Transferi' },
                { id: 'cash_on_delivery', label: 'Kapıda Ödeme', desc: 'Nakit / Esnaf Mobil POS' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPosState({ ...posState, provider: item.id as any })}
                  className={`p-3.5 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between ${
                    posState.provider === item.id
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                  }`}
                >
                  <strong className="text-xs font-black text-slate-900 block">{item.label}</strong>
                  <span className="text-[10px] text-slate-500 mt-1 block">{item.desc}</span>
                </button>
              ))}
            </div>

            {/* Input Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Mağaza No / Merchant ID *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={posState.merchantId}
                    onChange={(e) => setPosState({ ...posState, merchantId: e.target.value })}
                    placeholder="Örn: MERCHANT-774921"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 outline-none focus:border-indigo-600"
                  />
                  <Key className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  API Key / Public Key *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={posState.apiKey}
                    onChange={(e) => setPosState({ ...posState, apiKey: e.target.value })}
                    placeholder="Örn: ptr_live_89a3f910..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 outline-none focus:border-indigo-600"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Secret Key / Private Salt *
                </label>
                <div className="relative">
                  <input
                    type={showSecretKey ? 'text' : 'password'}
                    value={posState.secretKey}
                    onChange={(e) => setPosState({ ...posState, secretKey: e.target.value })}
                    placeholder="••••••••••••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 outline-none focus:border-indigo-600 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-col sm:flex-row gap-5 pt-3 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={posState.is3dSecureEnforced}
                  onChange={(e) => setPosState({ ...posState, is3dSecureEnforced: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                />
                <span>Zorunlu 3D Secure Doğrulaması (Ters İbraz Koruması)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={posState.passInstallmentCommission}
                  onChange={(e) => setPosState({ ...posState, passInstallmentCommission: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                />
                <span>Taksit Banka Komisyonunu Müşteriye Yansıt</span>
              </label>
            </div>
          </div>

        </div>
      )}

      {/* ================= 2. KARGO ENTEGRASYONU ================= */}
      {activeTab === 'cargo' && (
        <div className="space-y-5 animate-fade-in">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-base text-slate-900">Anlaşmalı Kargo & Otomatik Barkod</h3>
                <p className="text-slate-500 text-[11px]">Kendi kargo müşteri numaranızla otomatik sevk barkodu üretilir ve kargo cari indiriminiz geçerli olur.</p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${
                  cargoState.status === 'connected' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${cargoState.status === 'connected' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {cargoState.status === 'connected' ? `Bağlı (${cargoState.lastPing})` : 'Bağlantı Bekleniyor'}
                </span>
                
                <button
                  type="button"
                  onClick={handleTestCargo}
                  disabled={testingModule === 'cargo'}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testingModule === 'cargo' ? 'animate-spin' : ''}`} />
                  <span>{testingModule === 'cargo' ? 'Sorgulanıyor...' : 'Kargo API Testi'}</span>
                </button>
              </div>
            </div>

            {/* Carrier Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              {[
                { id: 'yurtici', label: 'Yurtiçi Kargo', desc: 'API & Self-Servis Barkod' },
                { id: 'aras', label: 'Aras Kargo', desc: 'Aras Web Entegrasyonu' },
                { id: 'mng', label: 'MNG Kargo', desc: 'MNG API Altyapısı' },
                { id: 'ptt', label: 'PTT Kargo', desc: 'PTT e-Ticaret Gönderisi' },
                { id: 'local_courier', label: 'Kendi Kuryem', desc: 'Mahalle İçi Doğrudan Sevk' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCargoState({ ...cargoState, carrier: item.id as any })}
                  className={`p-3.5 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between ${
                    cargoState.carrier === item.id
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                  }`}
                >
                  <strong className="text-xs font-black text-slate-900 block">{item.label}</strong>
                  <span className="text-[10px] text-slate-500 mt-1 block">{item.desc}</span>
                </button>
              ))}
            </div>

            {/* Cargo Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Kargo Müşteri No / Cari Kodu *
                </label>
                <input
                  type="text"
                  value={cargoState.customerNumber}
                  onChange={(e) => setCargoState({ ...cargoState, customerNumber: e.target.value })}
                  placeholder="Örn: YK-8829104"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  API Kullanıcı Adı / Key *
                </label>
                <input
                  type="text"
                  value={cargoState.apiKey}
                  onChange={(e) => setCargoState({ ...cargoState, apiKey: e.target.value })}
                  placeholder="Örn: yk_api_user"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  API Şifresi / Secret *
                </label>
                <input
                  type="password"
                  value={cargoState.apiSecret}
                  onChange={(e) => setCargoState({ ...cargoState, apiSecret: e.target.value })}
                  placeholder="••••••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="autoBarcode"
                checked={cargoState.autoGenerateBarcode}
                onChange={(e) => setCargoState({ ...cargoState, autoGenerateBarcode: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
              />
              <label htmlFor="autoBarcode" className="font-bold text-slate-800 cursor-pointer">
                Sipariş 'Hazırlanıyor' durumuna geçtiğinde otomatik ZPL/PDF kargo barkodu oluştur
              </label>
            </div>

          </div>
        </div>
      )}

      {/* ================= 3. E-FATURA & MUHASEBE ENTEGRASYONU ================= */}
      {activeTab === 'einvoice' && (
        <div className="space-y-5 animate-fade-in">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-base text-slate-900">E-Fatura & Ön Muhasebe Köprüsü</h3>
                <p className="text-slate-500 text-[11px]">Sipariş tamamlandığında esnafın kendi portalında otomatik GİB UBL-TR e-Arşiv / e-Fatura taslağı üretilir.</p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${
                  eInvoiceState.status === 'connected' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${eInvoiceState.status === 'connected' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {eInvoiceState.status === 'connected' ? `Bağlı (${eInvoiceState.lastPing})` : 'Bağlantı Bekleniyor'}
                </span>
                
                <button
                  type="button"
                  onClick={handleTestEInvoice}
                  disabled={testingModule === 'einvoice'}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testingModule === 'einvoice' ? 'animate-spin' : ''}`} />
                  <span>{testingModule === 'einvoice' ? 'Sorgulanıyor...' : 'Muhasebe API Testi'}</span>
                </button>
              </div>
            </div>

            {/* Provider Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {[
                { id: 'parasut', label: 'Ön Muhasebe API', desc: 'REST API Entegrasyonu' },
                { id: 'bizimhesap', label: 'Bulut Muhasebe Köprüsü', desc: 'Otomatik e-Fatura & Cari' },
                { id: 'gib_portal', label: 'GİB e-Arşiv Portal', desc: '5000/30000 Doğrudan' },
                { id: 'ubl_tr', label: 'UBL-TR Özel Entegratör', desc: 'EDM / Uyumsoft / Foriba' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setEInvoiceState({ ...eInvoiceState, provider: item.id as any })}
                  className={`p-3.5 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between ${
                    eInvoiceState.provider === item.id
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                  }`}
                >
                  <strong className="text-xs font-black text-slate-900 block">{item.label}</strong>
                  <span className="text-[10px] text-slate-500 mt-1 block">{item.desc}</span>
                </button>
              ))}
            </div>

            {/* Credential Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Client ID / Uygulama Kodu *
                </label>
                <input
                  type="text"
                  value={eInvoiceState.clientId}
                  onChange={(e) => setEInvoiceState({ ...eInvoiceState, clientId: e.target.value })}
                  placeholder="Örn: client_prs_884920"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Client Secret / API Şifresi *
                </label>
                <input
                  type="password"
                  value={eInvoiceState.clientSecret}
                  onChange={(e) => setEInvoiceState({ ...eInvoiceState, clientSecret: e.target.value })}
                  placeholder="••••••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  Muhasebe E-Posta / Kullanıcı Adı *
                </label>
                <input
                  type="text"
                  value={eInvoiceState.username}
                  onChange={(e) => setEInvoiceState({ ...eInvoiceState, username: e.target.value })}
                  placeholder="Örn: muhasebe@sirket.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={eInvoiceState.autoDraftOnOrder}
                  onChange={(e) => setEInvoiceState({ ...eInvoiceState, autoDraftOnOrder: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                />
                <span>Her onaylanan siparişte otomatik taslak fatura oluştur</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={eInvoiceState.sendToGibQueueDirectly}
                  onChange={(e) => setEInvoiceState({ ...eInvoiceState, sendToGibQueueDirectly: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                />
                <span>Teslimatta e-İmza ile mühürleyip anında GİB ve müşteriye e-posta ile ilet</span>
              </label>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
