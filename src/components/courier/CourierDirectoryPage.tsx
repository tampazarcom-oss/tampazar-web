/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bike, ShieldCheck, Star, MapPin, Phone, MessageSquare, 
  DollarSign, Clock, Search, Filter, CheckCircle2, 
  ArrowRight, ExternalLink, Sparkles, AlertCircle, Plus,
  ChevronRight, ArrowLeft, Navigation, Award, Zap, Truck
} from 'lucide-react';
import { 
  CourierProfile, 
  getStoredCouriers, 
  getVehicleTypeLabel, 
  getVehicleTypeIconEmoji,
  generateCourierWhatsAppUrl 
} from '../../data/courierData';
import CourierDispatchModal from './CourierDispatchModal';
import { applyPageSEO } from '../../utils/seo';

export default function CourierDirectoryPage({
  onBackToMarketplace
}: {
  onBackToMarketplace?: () => void;
}) {
  const navigate = useNavigate();
  const [couriers, setCouriers] = useState<CourierProfile[]>(() => getStoredCouriers());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('ALL');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [selectedCourierForModal, setSelectedCourierForModal] = useState<CourierProfile | null>(null);

  useEffect(() => {
    applyPageSEO({
      title: 'TamKurye: Mahalle Kuryeleri & Açık Kurye Pazaryeri | TamPazar',
      description: 'Ordu ve Karadeniz bölgesindeki bağımsız motokuryeler, e-scooter ve panelvan kuryeler. %0 komisyon, şeffaf fiyat tarifesi ve doğrudan esnaf-kurye mutabakatı.',
      pathname: '/kuryeler'
    });
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const filteredCouriers = couriers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.neighborhoods.some(n => n.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.vehiclePlateOrModel.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVehicle = selectedVehicle === 'ALL' || c.vehicleType === selectedVehicle;
    const matchesAvailability = !onlyAvailable || c.status === 'AVAILABLE';

    return matchesSearch && matchesVehicle && matchesAvailability;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      
      {/* 1. HERO & BANNER */}
      <section className="bg-gradient-to-br from-[#0F4C3A] via-[#0B132B] to-slate-950 text-white py-12 px-4 sm:px-6 relative overflow-hidden border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={onBackToMarketplace || (() => navigate('/'))}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> tampazar.com Ana Vitrine Dön
            </button>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold bg-[#F59E0B]/20 text-[#F59E0B] px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping" />
                Açık Kurye Ağı & %0 Komisyon
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-2">
            <div className="space-y-3 max-w-2xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                TamKurye: <span className="text-[#F59E0B]">Bağımsız Kurye Pazaryeri</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
                Yerel esnaf ile mahalle kuryelerini aracısız buluşturan açık teslimat ağı. Kuryeler kendi fiyat tarifesini belirler, esnaf doğrudan kurye ile mutabakat sağlar.
              </p>
            </div>

            {/* Kurye Ol CTA Kartı */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 text-right space-y-3 w-full sm:w-auto shrink-0 shadow-xl">
              <span className="text-[11px] text-slate-300 uppercase font-black tracking-wider block text-left sm:text-right">
                Kurye Misiniz?
              </span>
              <p className="text-xs text-slate-200 max-w-xs text-left sm:text-right">
                Kendi fiyat tarifeni belirle, Altınordu bölgesindeki yüzlerce esnaftan doğrudan teslimat çağrısı al.
              </p>
              <Link
                to="/kurye-ol"
                className="w-full py-3 px-5 bg-[#F59E0B] hover:bg-amber-400 text-slate-950 font-black rounded-2xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg"
              >
                <Bike className="w-4 h-4" />
                Kendi Kurye Profilini Aç / Yönet
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 2. SEARCH & FILTERS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Arama Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Kurye adı, mahalle, plaka veya araç tipi ara..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-[#0F4C3A] focus:outline-hidden"
            />
          </div>

          {/* Taşıt Tipi Filtreleri */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {[
              { id: 'ALL', label: 'Tümü' },
              { id: 'MOTORCYCLE', label: '🛵 Motosiklet' },
              { id: 'BICYCLE_SCOOTER', label: '🛴 Bisiklet / E-Scooter' },
              { id: 'VAN', label: '🚐 Panelvan / Yük' },
              { id: 'ON_FOOT', label: '🚶 Yaya / Çarşı' }
            ].map(v => (
              <button
                key={v.id}
                onClick={() => setSelectedVehicle(v.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedVehicle === v.id
                    ? 'bg-[#0F4C3A] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {v.label}
              </button>
            ))}

            <button
              onClick={() => setOnlyAvailable(!onlyAvailable)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 border ${
                onlyAvailable
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Sadece Müsait Olanlar
            </button>
          </div>
        </div>

        {/* 3. COURIER DIRECTORY GRID */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Kayıtlı Mahalle Kuryeleri & Şeffaf Tarifeler
              </h2>
              <p className="text-xs text-slate-500">
                Toplam {filteredCouriers.length} bağımsız kurye listeleniyor · SRC ve ehliyet doğrulamasından geçmiş esnaf kuryeler
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCouriers.map((courier) => {
              const isAvailable = courier.status === 'AVAILABLE';

              return (
                <div
                  key={courier.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between group hover:border-[#0F4C3A]/50"
                >
                  {/* Kart Üst Bilgisi */}
                  <div className="p-5 space-y-4">
                    
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="relative">
                          <img
                            src={courier.avatar}
                            alt={courier.name}
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-xs"
                          />
                          <span 
                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                              isAvailable ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                            title={isAvailable ? 'Müsait / Göreve Hazır' : 'Meşgul / Teslimatta'}
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="font-extrabold text-base text-slate-900">{courier.name}</h3>
                            {courier.isLicenseAndSrcVerified && (
                              <span title="Sürücü Belgesi & SRC Onaylı">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="font-bold text-slate-700 flex items-center gap-1">
                              {getVehicleTypeIconEmoji(courier.vehicleType)} {getVehicleTypeLabel(courier.vehicleType)}
                            </span>
                            <span>•</span>
                            <span className="truncate">{courier.vehiclePlateOrModel}</span>
                          </div>
                        </div>
                      </div>

                      {/* Durum Rozeti */}
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 border ${
                        isAvailable 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {isAvailable ? '🟢 Müsait' : '🔴 Meşgul'}
                      </span>
                    </div>

                    {/* Puan ve Tamamlanan Teslimat */}
                    <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span className="text-slate-900 font-black">{courier.rating}</span>
                        <span className="text-slate-400 font-normal">({courier.reviewCount} Yorum)</span>
                      </div>

                      <span className="text-slate-600 font-bold">
                        🏆 {courier.completedDeliveries}+ Başarılı Teslimat
                      </span>
                    </div>

                    {/* Hizmet Verdiği Mahalleler */}
                    <div className="space-y-1 text-xs">
                      <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block">
                        📍 Çalışma Alanı ({courier.district}):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {courier.neighborhoods.map((n, i) => (
                          <span key={i} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[11px] font-medium">
                            {n}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* ŞEFFAF FİYAT TARİFESİ BLOĞU */}
                    <div className="bg-amber-50/60 border border-amber-200/70 rounded-2xl p-3 text-xs space-y-2">
                      <span className="font-black text-amber-950 block text-[11px]">
                        💰 Kuryenin Fiyat Tarifesi:
                      </span>
                      <div className="grid grid-cols-2 gap-2 text-slate-800 text-[11px]">
                        <div className="bg-white p-2 rounded-xl border border-amber-200/50">
                          <span className="text-slate-500 text-[10px] block">Açılış / Min Paket:</span>
                          <strong className="text-slate-950 text-xs font-mono font-black">₺{courier.tariff.basePackagePrice}</strong>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-amber-200/50">
                          <span className="text-slate-500 text-[10px] block">KM Başına Ek:</span>
                          <strong className="text-slate-950 text-xs font-mono font-black">₺{courier.tariff.perKmRate} / km</strong>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-amber-200/50">
                          <span className="text-slate-500 text-[10px] block">Yağmur Katsayısı:</span>
                          <strong className="text-slate-950 text-xs font-mono font-black">{courier.tariff.rainHeavyTrafficMultiplier}x</strong>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-amber-200/50">
                          <span className="text-slate-500 text-[10px] block">Günlük Tahsis:</span>
                          <strong className="text-slate-950 text-xs font-mono font-black">₺{courier.tariff.dailyDedicatedFee}</strong>
                        </div>
                      </div>
                    </div>

                    {courier.bio && (
                      <p className="text-xs text-slate-600 leading-relaxed italic line-clamp-2">
                        "{courier.bio}"
                      </p>
                    )}

                  </div>

                  {/* Kart Alt Aksiyonları (WhatsApp, Arama, Kurye Çağır) */}
                  <div className="p-5 pt-0 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`https://wa.me/${courier.whatsapp}?text=Merhaba%20${courier.name},%20TamPazar%20üzerinden%20ulaştım.`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-2xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>

                      <a
                        href={`tel:${courier.phone.replace(/[^0-9+]/g, '')}`}
                        className="py-2.5 px-3 bg-[#0B132B] hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-2xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Hemen Ara</span>
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedCourierForModal(courier)}
                      className="w-full py-2.5 px-4 bg-[#0F4C3A] hover:bg-emerald-800 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>Paket Teslimatı İçin Kuryeyi Çağır</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* Dispatch Modal Popup if triggered */}
      {selectedCourierForModal && (
        <CourierDispatchModal
          order={{
            id: 'ord-dir-custom',
            orderNumber: 'TPZ-DIR-' + Date.now().toString().slice(-4),
            customerName: 'Dükkân Müşterisi',
            customerPhone: '+90 532 000 00 00',
            customerAddress: 'Altınordu Mahalle Teslimatı',
            storeName: 'TamPazar Esnafı'
          }}
          onClose={() => setSelectedCourierForModal(null)}
        />
      )}

    </div>
  );
}
