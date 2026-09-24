/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bike, ShieldCheck, MapPin, Phone, MessageSquare, 
  DollarSign, CheckCircle2, Clock, Sparkles, Send, 
  ArrowLeft, Plus, Check, Star, Navigation, AlertCircle,
  Truck, ArrowRight, Wallet, UserCheck, Layers, FileText
} from 'lucide-react';
import { 
  CourierProfile, 
  CourierVehicleType, 
  CourierPricingTariff,
  CourierPoolRequest,
  getStoredCouriers,
  getStoredCourierRequests,
  saveStoredCourierRequests,
  getMyCourierProfile,
  saveMyCourierProfile,
  getVehicleTypeLabel,
  getVehicleTypeIconEmoji
} from '../../data/courierData';
import { applyPageSEO } from '../../utils/seo';

export default function CourierOnboardingAndDashboard({
  onBackToMarketplace
}: {
  onBackToMarketplace?: () => void;
}) {
  const navigate = useNavigate();

  // Load existing profile or default template
  const [profile, setProfile] = useState<CourierProfile>(() => {
    const saved = getMyCourierProfile();
    if (saved) return saved;
    return {
      id: `kurye-${Date.now()}`,
      name: 'Mert Aksoy',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      phone: '+90 532 211 44 55',
      whatsapp: '905322114455',
      city: 'Ordu',
      district: 'Altınordu',
      neighborhoods: ['Bahçelievler', 'Akyazı', 'Bucak', 'Şahincili', 'Düz Mahalle'],
      vehicleType: 'MOTORCYCLE',
      vehiclePlateOrModel: '52 ABC 341 (Motosiklet)',
      status: 'AVAILABLE',
      isLicenseAndSrcVerified: true,
      isCriminalRecordClean: true,
      rating: 4.9,
      reviewCount: 142,
      completedDeliveries: 420,
      iban: 'TR33 0006 2000 0001 2999 8888 01',
      bankName: 'Garanti BBVA',
      tariff: {
        basePackagePrice: 65,
        perKmRate: 12,
        rainHeavyTrafficMultiplier: 1.3,
        dailyDedicatedFee: 1400,
        hourlyDedicatedFee: 180
      },
      bio: 'Altınordu sahil ve çarşı hattında 4 yıldır aktif motokuryeyim. Termal çanta ve çift askılı sıcak teslimat ekipmanım mevcut.',
      registeredAt: '2024-03-12'
    };
  });

  const [poolRequests, setPoolRequests] = useState<CourierPoolRequest[]>(() => getStoredCourierRequests());
  const [activeTab, setActiveTab] = useState<'PROFILE_TARIFF' | 'OPPORTUNITY_POOL'>('PROFILE_TARIFF');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [bidInputs, setBidInputs] = useState<Record<string, { price: number; etaMin: number; note: string }>>({});
  const [bidPlacedSuccess, setBidPlacedSuccess] = useState<string | null>(null);

  useEffect(() => {
    applyPageSEO({
      title: 'TamKurye: Kurye Paneli ve Dinamik Tarife Ayarları | TamPazar',
      description: 'Bağımsız kuryeler için serbest fiyat tarifesi belirleme, mahalle teslimat havuzu ve esnaf siparişlerine anında teklif verme paneli.',
      pathname: '/kurye-ol'
    });
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveMyCourierProfile(profile);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleToggleStatus = () => {
    const nextStatus = profile.status === 'AVAILABLE' ? 'BUSY' : 'AVAILABLE';
    const updated = { ...profile, status: nextStatus as any };
    setProfile(updated);
    saveMyCourierProfile(updated);
  };

  const handlePlaceBid = (requestId: string) => {
    const input = bidInputs[requestId] || { price: 65, etaMin: 10, note: 'Hemen gelip alabilirim.' };
    const allReqs = getStoredCourierRequests();
    const reqIndex = allReqs.findIndex(r => r.id === requestId);

    if (reqIndex >= 0) {
      const targetReq = allReqs[reqIndex];
      const newOffer = {
        id: `off-${Date.now()}`,
        courierId: profile.id,
        courierName: profile.name,
        courierVehicle: profile.vehicleType,
        courierRating: profile.rating,
        courierPhone: profile.phone,
        offeredPrice: Number(input.price),
        estimatedArrivalMin: Number(input.etaMin),
        note: input.note || 'Termal çantamla 10 dakikada teslim alırım.',
        createdAt: 'Az önce'
      };

      targetReq.offers = [newOffer, ...(targetReq.offers || [])];
      allReqs[reqIndex] = targetReq;
      saveStoredCourierRequests(allReqs);
      setPoolRequests([...allReqs]);
      setBidPlacedSuccess(requestId);
      setTimeout(() => setBidPlacedSuccess(null), 4000);
    }
  };

  const allNeighborhoods = [
    'Bahçelievler', 'Akyazı', 'Bucak', 'Şahincili', 'Düz Mahalle',
    'Subaşı', 'Selimiye', 'Taşbaşı', 'Saray', 'Kirazlimanı',
    'Organize Sanayi', 'Karapınar', 'Turnasuyu', 'Fidangör Caddesi'
  ];

  const toggleNeighborhood = (nName: string) => {
    if (profile.neighborhoods.includes(nName)) {
      setProfile({
        ...profile,
        neighborhoods: profile.neighborhoods.filter(n => n !== nName)
      });
    } else {
      setProfile({
        ...profile,
        neighborhoods: [...profile.neighborhoods, nName]
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      
      {/* Top Header */}
      <div className="bg-[#0B132B] text-white py-8 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={onBackToMarketplace || (() => navigate('/kuryeler'))}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Kurye Rehberine Dön
            </button>

            {/* Durum Rozeti & Hızlı Toggle */}
            <button
              onClick={handleToggleStatus}
              className={`px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 transition cursor-pointer shadow-md border ${
                profile.status === 'AVAILABLE'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500'
                  : 'bg-rose-600 hover:bg-rose-700 text-white border-rose-500'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
              <span>{profile.status === 'AVAILABLE' ? '🟢 Müsait / Göreve Hazır' : '🔴 Meşgul / Teslimatta'}</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
            <div className="flex items-center gap-4">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#F59E0B] shadow-md shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-black text-white">{profile.name}</h1>
                  <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Doğrulanmış Esnaf Kurye
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {getVehicleTypeIconEmoji(profile.vehicleType)} {getVehicleTypeLabel(profile.vehicleType)} · {profile.vehiclePlateOrModel}
                </p>
              </div>
            </div>

            {/* Gelir ve İstatistik Özeti */}
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Tamamlanan Görev</span>
                <span className="text-base font-black text-[#F59E0B]">{profile.completedDeliveries} Teslimat</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Kurye Puanı</span>
                <span className="text-base font-black text-emerald-400">⭐ {profile.rating} / 5.0</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* TAB BUTONLARI */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('PROFILE_TARIFF')}
            className={`py-2.5 px-5 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'PROFILE_TARIFF'
                ? 'bg-[#0F4C3A] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4 text-[#F59E0B]" />
            <span>Fiyat Tarifesi & Profil Ayarları</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('OPPORTUNITY_POOL')}
            className={`py-2.5 px-5 rounded-2xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'OPPORTUNITY_POOL'
                ? 'bg-[#0F4C3A] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
            <span>Esnaf Teslimat Havuzu & İhaleler ({poolRequests.filter(r => r.status === 'OPEN_FOR_BIDS').length})</span>
          </button>
        </div>

        {/* TAB 1: PROFİL VE SERBEST FİYAT TARİFESİ MODÜLÜ */}
        {activeTab === 'PROFILE_TARIFF' && (
          <form onSubmit={handleSaveProfile} className="space-y-8">
            
            {saveSuccess && (
              <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>Kurye profiliniz ve şeffaf fiyat tarifeniz başarıyla güncellendi! Esnaflar yeni tarifenizi görecek.</span>
              </div>
            )}

            {/* 1. TAŞIT VE TEMEL BİLGİLER */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Bike className="w-4 h-4 text-[#0F4C3A]" />
                  Taşıt Tipi ve Hizmet Kimliği
                </h3>
                <p className="text-xs text-slate-500">
                  Taşıt türünüzü ve plaka bilgilerinizi seçin.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { id: 'MOTORCYCLE', label: '🛵 Motosiklet', desc: 'Hızlı ve pratik yemek & paket teslimi' },
                  { id: 'BICYCLE_SCOOTER', label: '🛴 Bisiklet / E-Scooter', desc: 'Kısa mesafe çevreci teslimat' },
                  { id: 'VAN', label: '🚐 Panelvan / Hafif Ticari', desc: 'Koli, toptan çuval ve mobilya' },
                  { id: 'ON_FOOT', label: '🚶 Yaya / Çarşı İçi', desc: 'Fidangör ve kapalı çarşı evrak/paket' }
                ].map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setProfile({ ...profile, vehicleType: v.id as any })}
                    className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      profile.vehicleType === v.id
                        ? 'border-[#0F4C3A] bg-emerald-50/50 ring-2 ring-[#0F4C3A]/20'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-extrabold text-xs text-slate-900">{v.label}</span>
                    <span className="text-[11px] text-slate-500 mt-1">{v.desc}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ad Soyad</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telefon Numarası</label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Araç Modeli / Plaka</label>
                  <input
                    type="text"
                    value={profile.vehiclePlateOrModel}
                    onChange={(e) => setProfile({ ...profile, vehiclePlateOrModel: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. ŞEFFAF VE DİNAMİK FİYAT TARİFESİ MODÜLÜ */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#F59E0B]" />
                    Dinamik Fiyat Tarifesi (Kendi Fiyatını Belirle)
                  </h3>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    %0 Komisyon
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Esnaflara sunacağınız açık teslimat tarifesini belirleyin. Kazancınız doğrudan sizin hesabınıza geçer.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                
                {/* 1. Açılış / Min Paket */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <label className="block font-bold text-slate-800">
                    Açılış / Min Paket Ücreti (₺)
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="500"
                    value={profile.tariff.basePackagePrice}
                    onChange={(e) => setProfile({
                      ...profile,
                      tariff: { ...profile.tariff, basePackagePrice: Number(e.target.value) }
                    })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-lg font-black text-slate-900 font-mono outline-none"
                  />
                  <span className="text-[10px] text-slate-500 block">İlk 1 km ve taban çağrı bedeli</span>
                </div>

                {/* 2. KM Başına Ek Ücret */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <label className="block font-bold text-slate-800">
                    KM Başına Ek Ücret (₺/km)
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="100"
                    value={profile.tariff.perKmRate}
                    onChange={(e) => setProfile({
                      ...profile,
                      tariff: { ...profile.tariff, perKmRate: Number(e.target.value) }
                    })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-lg font-black text-slate-900 font-mono outline-none"
                  />
                  <span className="text-[10px] text-slate-500 block">1 km sonrasındaki her km için</span>
                </div>

                {/* 3. Yağmurlu / Yoğun Saat Katsayısı */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <label className="block font-bold text-slate-800">
                    Yağmur & Yoğun Saat Katsayısı
                  </label>
                  <select
                    value={profile.tariff.rainHeavyTrafficMultiplier}
                    onChange={(e) => setProfile({
                      ...profile,
                      tariff: { ...profile.tariff, rainHeavyTrafficMultiplier: Number(e.target.value) }
                    })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-black text-slate-900 outline-none"
                  >
                    <option value="1.0">1.0x (Normal)</option>
                    <option value="1.2">1.2x (%20 Ek Ücret)</option>
                    <option value="1.3">1.3x (%30 Ek Ücret)</option>
                    <option value="1.5">1.5x (%50 Ek Ücret - Yoğun Yağış)</option>
                  </select>
                  <span className="text-[10px] text-slate-500 block">Hava muhalefeti durumunda geçerli</span>
                </div>

                {/* 4. Günlük Tahsisli Çalışma */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <label className="block font-bold text-slate-800">
                    Günlük Tahsis Bedeli (₺/gün)
                  </label>
                  <input
                    type="number"
                    min="400"
                    max="5000"
                    value={profile.tariff.dailyDedicatedFee}
                    onChange={(e) => setProfile({
                      ...profile,
                      tariff: { ...profile.tariff, dailyDedicatedFee: Number(e.target.value) }
                    })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-lg font-black text-slate-900 font-mono outline-none"
                  />
                  <span className="text-[10px] text-slate-500 block">Esnafa 8 saat özel tahsis</span>
                </div>

              </div>
            </div>

            {/* 3. ÇALIŞMA ALANI & MAHALLELER */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  Çalışma Alanı & Hizmet Verilen Mahalleler
                </h3>
                <p className="text-xs text-slate-500">
                  Teslimat kabul etmek istediğiniz mahalleleri işaretleyin.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {allNeighborhoods.map((n) => {
                  const isChecked = profile.neighborhoods.includes(n);
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => toggleNeighborhood(n)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                        isChecked
                          ? 'bg-[#0F4C3A] text-white border-[#0F4C3A] shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 text-[#F59E0B]" />}
                      <span>{n}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. DOĞRULANMIŞ ESNAF IBAN & MUTABAKAT */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-emerald-600" />
                  Doğrudan Ödeme & IBAN Bilgisi
                </h3>
                <p className="text-xs text-slate-500">
                  Esnafların teslimat sonrası havale yapabileceği banka hesabınız.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Banka Adı</label>
                  <input
                    type="text"
                    value={profile.bankName || ''}
                    onChange={(e) => setProfile({ ...profile, bankName: e.target.value })}
                    placeholder="Örn: Garanti BBVA"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">IBAN Numarası</label>
                  <input
                    type="text"
                    value={profile.iban || ''}
                    onChange={(e) => setProfile({ ...profile, iban: e.target.value })}
                    placeholder="TR33 0006 ..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Kaydet Butonu */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="py-3.5 px-8 bg-[#0F4C3A] hover:bg-emerald-800 text-white font-black rounded-2xl text-xs flex items-center gap-2 transition cursor-pointer shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4 text-[#F59E0B]" />
                <span>Kurye Profilini & Tarifeyi Kaydet</span>
              </button>
            </div>

          </form>
        )}

        {/* TAB 2: ESNAF TESLİMAT HAVUZU VE İHALELER */}
        {activeTab === 'OPPORTUNITY_POOL' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Altınordu Mahalle Teslimat Havuzu
                </h3>
                <p className="text-xs text-slate-500">
                  Esnafların açtığı anlık teslimat ihaleleri. Teklif vererek doğrudan görevi üstlenebilirsiniz.
                </p>
              </div>

              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                ⚡ Canlı Açık Talepler
              </span>
            </div>

            <div className="space-y-4">
              {poolRequests.map((req) => {
                const currentBid = bidInputs[req.id] || { price: req.targetBudget, etaMin: 8, note: '' };
                const isBidSent = bidPlacedSuccess === req.id;

                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-[#0F4C3A]/50 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-slate-900">#{req.orderNumber}</span>
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                            {req.packageType === 'FOOD' ? '🍔 Sıcak Gıda' : '📦 Perakende Paket'}
                          </span>
                          <span className="text-xs text-slate-400">· {req.createdAt}</span>
                        </div>
                        <h4 className="text-base font-extrabold text-slate-900 mt-1">{req.storeName}</h4>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Esnaf Bütçesi</span>
                        <span className="text-xl font-black text-emerald-700 font-mono">₺{req.targetBudget}</span>
                      </div>
                    </div>

                    {/* Güzergâh */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">📍 Alış Noktası (Dükkân)</span>
                        <strong className="text-slate-900">{req.pickupAddress}</strong>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">🏠 Teslimat Noktası (Müşteri)</span>
                        <strong className="text-slate-900">{req.deliveryAddress}</strong>
                      </div>
                    </div>

                    {req.note && (
                      <p className="text-xs text-slate-600 italic">
                        📝 Not: "{req.note}"
                      </p>
                    )}

                    {/* Teklif Verme Alanı */}
                    <div className="pt-2 flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4 border-t border-slate-100">
                      <div className="flex items-center gap-3 w-full sm:w-auto text-xs">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Teklifiniz (₺):</label>
                          <input
                            type="number"
                            value={currentBid.price}
                            onChange={(e) => setBidInputs({
                              ...bidInputs,
                              [req.id]: { ...currentBid, price: Number(e.target.value) }
                            })}
                            className="w-24 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-mono font-bold text-slate-900 outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Varış Süresi (Dk):</label>
                          <input
                            type="number"
                            value={currentBid.etaMin}
                            onChange={(e) => setBidInputs({
                              ...bidInputs,
                              [req.id]: { ...currentBid, etaMin: Number(e.target.value) }
                            })}
                            className="w-20 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-900 outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        {isBidSent ? (
                          <span className="py-2.5 px-4 bg-emerald-100 text-emerald-900 font-bold rounded-xl text-xs flex items-center gap-1.5 animate-fade-in">
                            <Check className="w-4 h-4 text-emerald-700" /> Teklifiniz Esnafa İletildi!
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handlePlaceBid(req.id)}
                            className="w-full sm:w-auto py-2.5 px-6 bg-[#0F4C3A] hover:bg-emerald-800 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
                          >
                            <Send className="w-3.5 h-3.5 text-[#F59E0B]" />
                            <span>İhaleye Teklif Ver</span>
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
