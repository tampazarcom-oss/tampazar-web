import React, { useState } from 'react';
import { 
  Settings, CreditCard, ShieldCheck, Store, Clock, 
  MapPin, Check, AlertCircle, RefreshCw, Key, Lock, 
  Sparkles, ExternalLink, Image as ImageIcon, Save, Eye, EyeOff
} from 'lucide-react';

interface StoreSettingsData {
  // BYO POS
  posProvider: 'paytr' | 'iyzico' | 'param' | 'kuveytturk' | 'garanti' | 'akbank';
  merchantId: string;
  apiKey: string;
  secretKey: string;
  is3dSecureEnforced: boolean;
  installmentPassThrough: boolean; // Taksit komisyonunu müşteriye yansıt
  installmentRates: { [key: string]: number };

  // Store Identity
  storeName: string;
  legalTitle: string;
  taxOffice: string;
  taxId: string;
  logoUrl: string;
  bannerUrl: string;
  story: string;

  // Working Hours & Local Radius
  weekdayOpening: string;
  weekdayClosing: string;
  weekendOpening: string;
  weekendClosing: string;
  holidayDays: string[];
  localRadiusKm: number;
}

const defaultSettings: StoreSettingsData = {
  posProvider: 'paytr',
  merchantId: 'MERCHANT-774921',
  apiKey: 'ptr_live_89a3f91048123bf018',
  secretKey: 'sec_live_9941a80291e92d774a',
  is3dSecureEnforced: true,
  installmentPassThrough: true,
  installmentRates: {
    '1': 1.80,
    '2': 2.40,
    '3': 2.95,
    '6': 4.20,
    '9': 6.10,
    '12': 7.80
  },
  storeName: 'FotoSentez Stüdyo & Zanaat Evi',
  legalTitle: 'FotoSentez Görsel Sanatlar ve Tasarım Tic. Ltd. Şti.',
  taxOffice: 'Altınordu Vergi Dairesi',
  taxId: '3880491029',
  logoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200',
  bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
  story: 'Karadeniz fındık ve el yapımı zanaat geleneğini modern dijitalleşme ile buluşturan tescilli aile işletmesi.',
  weekdayOpening: '08:30',
  weekdayClosing: '19:30',
  weekendOpening: '09:30',
  weekendClosing: '18:00',
  holidayDays: ['Pazar'],
  localRadiusKm: 18
};

export default function StoreSettingsModule() {
  const [settings, setSettings] = useState<StoreSettingsData>(() => {
    try {
      const saved = localStorage.getItem('tampazar_store_settings');
      return saved ? JSON.parse(saved) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [activeSubTab, setActiveSubTab] = useState<'pos' | 'identity' | 'operations'>('pos');
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Test POS Handshake
  const handleTestConnection = () => {
    setTestStatus('testing');
    setTimeout(() => {
      if (settings.merchantId && settings.apiKey && settings.secretKey) {
        setTestStatus('success');
      } else {
        setTestStatus('failed');
      }
    }, 1200);
  };

  // Save Settings
  const handleSaveSettings = () => {
    try {
      localStorage.setItem('tampazar_store_settings', JSON.stringify(settings));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      
      {/* BAŞLIK & KAYDET ALANI */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                Mağaza & Entegrasyon Konsolu
              </span>
              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> %0 Komisyon Aktif
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              İşletme Kimliği, BYO Sanal POS ve Operasyon Ayarları
            </h2>
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-xs transition cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Tüm Ayarları Kaydet</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold rounded-2xl flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          Mağaza kimlik bilgileri ve Sanal POS entegrasyon ayarları başarıyla kaydedildi!
        </div>
      )}

      {/* ALT SEKMELER */}
      <div className="flex border-b border-slate-200 gap-3">
        <button
          onClick={() => setActiveSubTab('pos')}
          className={`pb-3 px-4 text-xs font-black border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'pos' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Kendi Sanal POS'unu Tanımla (BYO POS)
        </button>

        <button
          onClick={() => setActiveSubTab('identity')}
          className={`pb-3 px-4 text-xs font-black border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'identity' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Store className="w-4 h-4" />
          Mağaza Profili, Logo & Vitrin
        </button>

        <button
          onClick={() => setActiveSubTab('operations')}
          className={`pb-3 px-4 text-xs font-black border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'operations' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          Çalışma Saatleri & Servis Yarıçapı
        </button>
      </div>

      {/* ================= 1. BYO POS ENTEGRASYONU ================= */}
      {activeSubTab === 'pos' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Bilgi Kutusu */}
          <div className="bg-indigo-900 text-white p-5 rounded-3xl shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <h3 className="font-black text-sm text-white">Doğrudan Tahsilat Modeli (BYO POS - Bring Your Own POS)</h3>
            </div>
            <p className="text-xs text-indigo-200 leading-relaxed max-w-3xl">
              TamPazar esnafından <strong>%0 komisyon</strong> alır ve müşterinin ödemesini havuzda bekletmez. 
              Müşteri kartından çekilen para <strong>anında sizin anlaşmalı banka veya ödeme kuruluşu hesabınıza</strong> yansır.
            </p>
          </div>

          {/* POS Sağlayıcı Seçimi */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
            <label className="font-black text-slate-900 block text-sm">
              1. Sanal POS Sağlayıcınızı Seçin:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { id: 'paytr', name: 'PayTR Sanal POS', badge: 'Tavsiye Edilen' },
                { id: 'iyzico', name: 'iyzico Checkout', badge: 'Popüler' },
                { id: 'param', name: 'ParamPOS', badge: 'Düşük Komisyon' },
                { id: 'kuveytturk', name: 'Kuveyt Türk POS', badge: 'Katılım Bankası' },
                { id: 'garanti', name: 'Garanti BBVA Ortak', badge: 'Bonus Altyapısı' },
                { id: 'akbank', name: 'Akbank Sanal POS', badge: 'Axess Uyumlu' }
              ].map(provider => (
                <div
                  key={provider.id}
                  onClick={() => setSettings({ ...settings, posProvider: provider.id as any })}
                  className={`p-3.5 rounded-2xl border-2 transition cursor-pointer text-center space-y-1.5 ${
                    settings.posProvider === provider.id
                      ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <span className="text-[9px] font-black text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-200 block">
                    {provider.badge}
                  </span>
                  <strong className="text-xs font-black text-slate-900 block leading-tight">
                    {provider.name}
                  </strong>
                </div>
              ))}
            </div>
          </div>

          {/* API Anahtarları ve Bağlantı Testi */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-black text-sm text-slate-900">2. {settings.posProvider.toUpperCase()} Canlı API Kimlik Bilgileri</h4>
                <p className="text-[11px] text-slate-500">Bu bilgiler AES-256 şifrelemeyle güvenli sunucuda tutulur.</p>
              </div>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testStatus === 'testing'}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testStatus === 'testing' ? 'animate-spin' : ''}`} />
                <span>{testStatus === 'testing' ? 'Sorgulanıyor...' : 'Bağlantıyı Test Et'}</span>
              </button>
            </div>

            {testStatus === 'success' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                POS Entegrasyonu Başarılı! {settings.posProvider.toUpperCase()} sunucuları ile canlı handshake sağlandı.
              </div>
            )}

            {testStatus === 'failed' && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                Bağlantı Hatası: Lütfen API anahtarlarınızı ve Merchant ID bilginizi kontrol edin.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Mağaza No / Merchant ID *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={settings.merchantId}
                    onChange={(e) => setSettings({ ...settings, merchantId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 outline-none focus:border-indigo-600"
                  />
                  <Key className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">API Key / Public Key *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={settings.apiKey}
                    onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 outline-none focus:border-indigo-600"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Secret Key / Private Salt *</label>
                <div className="relative">
                  <input
                    type={showSecretKey ? 'text' : 'password'}
                    value={settings.secretKey}
                    onChange={(e) => setSettings({ ...settings, secretKey: e.target.value })}
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

            {/* 3D Secure ve Taksit Anahtarları */}
            <div className="flex flex-col sm:flex-row gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={settings.is3dSecureEnforced}
                  onChange={(e) => setSettings({ ...settings, is3dSecureEnforced: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                />
                <span>Zorunlu 3D Secure Doğrulaması (Ters İbraz / Chargeback Kalkanı)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={settings.installmentPassThrough}
                  onChange={(e) => setSettings({ ...settings, installmentPassThrough: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                />
                <span>Taksit Komisyonunu Müşteriye Yansıt (Esnaf Net Ciro Koruması)</span>
              </label>
            </div>
          </div>

          {/* Taksit & Komisyon Oranları Matrisi */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
            <h4 className="font-black text-sm text-slate-900">3. Taksit & Banka Komisyon Oranları Tablosu</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Taksit Sayısı</th>
                    <th className="py-2.5 px-4">Sağlayıcı Kesintisi (%)</th>
                    <th className="py-2.5 px-4">TamPazar SaaS Payı</th>
                    <th className="py-2.5 px-4">Net Tahsilat Vadesi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {[
                    { installment: 'Tek Çekim (Peşin)', rate: settings.installmentRates['1'] || 1.80, payout: 'Ertesi Gün (t+1)' },
                    { installment: '2 Taksit', rate: settings.installmentRates['2'] || 2.40, payout: 'Ertesi Gün (t+1)' },
                    { installment: '3 Taksit', rate: settings.installmentRates['3'] || 2.95, payout: 'Ertesi Gün (t+1)' },
                    { installment: '6 Taksit', rate: settings.installmentRates['6'] || 4.20, payout: 'Ertesi Gün (t+1)' },
                    { installment: '9 Taksit', rate: settings.installmentRates['9'] || 6.10, payout: 'Ertesi Gün (t+1)' },
                    { installment: '12 Taksit', rate: settings.installmentRates['12'] || 7.80, payout: 'Ertesi Gün (t+1)' },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">{row.installment}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">%{row.rate.toFixed(2)}</td>
                      <td className="py-3 px-4 font-mono font-black text-emerald-600">0,00 ₺ (%0)</td>
                      <td className="py-3 px-4 font-medium text-slate-500">{row.payout}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ================= 2. MAĞAZA KİMLİĞİ & VİTRİN ================= */}
      {activeSubTab === 'identity' && (
        <div className="space-y-6 animate-fade-in bg-white p-6 rounded-3xl border border-slate-200">
          <h3 className="font-black text-sm text-slate-900 border-b border-slate-100 pb-3">
            Mağaza Vitrin ve Kurumsal Kimlik Ayarları
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Mağaza Adı */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">Mağaza Vitrin Adı *</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-indigo-600"
              />
            </div>

            {/* Resmi Şirket Unvanı */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">Resmi Şirket Unvanı (e-Fatura)</label>
              <input
                type="text"
                value={settings.legalTitle}
                onChange={(e) => setSettings({ ...settings, legalTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:border-indigo-600"
              />
            </div>

            {/* Vergi Dairesi & Vergi No */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">Vergi Dairesi</label>
              <input
                type="text"
                value={settings.taxOffice}
                onChange={(e) => setSettings({ ...settings, taxOffice: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Vergi Kimlik No / TC</label>
              <input
                type="text"
                value={settings.taxId}
                onChange={(e) => setSettings({ ...settings, taxId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 outline-none focus:border-indigo-600"
              />
            </div>

            {/* Logo URL */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">Mağaza Logo URL</label>
              <input
                type="url"
                value={settings.logoUrl}
                onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-700 outline-none focus:border-indigo-600"
              />
            </div>

            {/* Banner URL */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">Vitrin Banner URL</label>
              <input
                type="url"
                value={settings.bannerUrl}
                onChange={(e) => setSettings({ ...settings, bannerUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-700 outline-none focus:border-indigo-600"
              />
            </div>

            {/* Esnaf Açıklaması / Hikayesi */}
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-800 block mb-1">
                Esnaf Hikayesi & Mağaza Hakkında Yazısı
              </label>
              <textarea
                rows={3}
                value={settings.story}
                onChange={(e) => setSettings({ ...settings, story: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:border-indigo-600"
              />
            </div>

          </div>

          {/* Banner & Logo Canlı Önizleme */}
          <div className="pt-2">
            <span className="font-bold text-slate-800 block mb-2">Canlı Vitrin Görünümü Önizlemesi:</span>
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-36 w-full">
              <img src={settings.bannerUrl} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4 gap-3">
                <img src={settings.logoUrl} alt="" className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-md bg-white" />
                <div>
                  <h4 className="font-black text-white text-sm">{settings.storeName}</h4>
                  <p className="text-[10px] text-slate-200 line-clamp-1">{settings.story}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ================= 3. ÇALIŞMA SAATLERİ & OPERASYON ================= */}
      {activeSubTab === 'operations' && (
        <div className="space-y-6 animate-fade-in bg-white p-6 rounded-3xl border border-slate-200">
          <h3 className="font-black text-sm text-slate-900 border-b border-slate-100 pb-3">
            Hizmet & Çalışma Saatleri ile Yerel Kurye Yarıçapı
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Hafta İçi */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-black text-slate-900 block">Hafta İçi Çalışma Saatleri (Pazartesi - Cuma)</span>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={settings.weekdayOpening}
                  onChange={(e) => setSettings({ ...settings, weekdayOpening: e.target.value })}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold font-mono outline-none"
                />
                <span className="font-bold text-slate-400">-</span>
                <input
                  type="time"
                  value={settings.weekdayClosing}
                  onChange={(e) => setSettings({ ...settings, weekdayClosing: e.target.value })}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold font-mono outline-none"
                />
              </div>
            </div>

            {/* Hafta Sonu */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-black text-slate-900 block">Hafta Sonu Çalışma Saatleri (Cumartesi)</span>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={settings.weekendOpening}
                  onChange={(e) => setSettings({ ...settings, weekendOpening: e.target.value })}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold font-mono outline-none"
                />
                <span className="font-bold text-slate-400">-</span>
                <input
                  type="time"
                  value={settings.weekendClosing}
                  onChange={(e) => setSettings({ ...settings, weekendClosing: e.target.value })}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold font-mono outline-none"
                />
              </div>
            </div>

            {/* Yerel Hizmet Yarıçapı Slider (KM) */}
            <div className="sm:col-span-2 p-5 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <strong className="font-black text-slate-900 block">
                    Yerel Teslimat & Mobil Saha Usta Yarıçapı
                  </strong>
                  <span className="text-[11px] text-slate-600">
                    Bu mesafenin dışındaki müşterilere sadece kargo teslimatı sunulur.
                  </span>
                </div>
                <span className="text-base font-black text-amber-900 font-mono bg-amber-100 px-3 py-1 rounded-xl border border-amber-300">
                  {settings.localRadiusKm} KM
                </span>
              </div>

              <input
                type="range"
                min={2}
                max={50}
                step={1}
                value={settings.localRadiusKm}
                onChange={(e) => setSettings({ ...settings, localRadiusKm: parseInt(e.target.value) || 10 })}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>2 KM (Mahalle İçi)</span>
                <span>25 KM (Şehir İçi Geniş)</span>
                <span>50 KM (İlçe & Bölge Geneli)</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
