/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bike, ShieldCheck, Star, MapPin, Phone, MessageSquare, 
  DollarSign, Clock, Plus, ExternalLink, Zap, CheckCircle2,
  Layers, Send, Check, AlertCircle, Sparkles, Navigation
} from 'lucide-react';
import { 
  CourierProfile, 
  CourierPoolRequest,
  MergedRouteOpportunity,
  findMergedRouteOpportunities,
  getStoredCouriers, 
  getStoredCourierRequests, 
  saveStoredCourierRequests,
  getVehicleTypeLabel, 
  getVehicleTypeIconEmoji,
  generateCourierWhatsAppUrl 
} from '../../data/courierData';
import CourierDispatchModal from '../courier/CourierDispatchModal';

export default function CourierOrdersManagementModule() {
  const [couriers, setCouriers] = useState<CourierProfile[]>(() => getStoredCouriers());
  const [requests, setRequests] = useState<CourierPoolRequest[]>(() => getStoredCourierRequests());
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [selectedRequestForOffer, setSelectedRequestForOffer] = useState<CourierPoolRequest | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const reloadData = () => {
    setCouriers(getStoredCouriers());
    setRequests(getStoredCourierRequests());
  };

  useEffect(() => {
    window.addEventListener('tampazar_couriers_updated', reloadData);
    window.addEventListener('tampazar_courier_requests_updated', reloadData);
    return () => {
      window.removeEventListener('tampazar_couriers_updated', reloadData);
      window.removeEventListener('tampazar_courier_requests_updated', reloadData);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAcceptCourierOffer = (request: CourierPoolRequest, offer: any) => {
    const allReqs = getStoredCourierRequests();
    const idx = allReqs.findIndex(r => r.id === request.id);
    if (idx >= 0) {
      allReqs[idx].status = 'ASSIGNED';
      allReqs[idx].selectedCourierId = offer.courierId;
      allReqs[idx].selectedCourierName = offer.courierName;
      allReqs[idx].finalAgreedPrice = offer.offeredPrice;
      saveStoredCourierRequests(allReqs);
      setRequests([...allReqs]);
      
      showToast(`🛵 Kurye ${offer.courierName} ile ₺${offer.offeredPrice} üzerinden mutabakat sağlandı!`);
    }
  };

  const handleAcceptMergedRoute = (opp: MergedRouteOpportunity) => {
    const allReqs = getStoredCourierRequests();
    const idxA = allReqs.findIndex(r => r.id === opp.requestA.id);
    const idxB = allReqs.findIndex(r => r.id === opp.requestB.id);

    if (idxA >= 0 && idxB >= 0) {
      allReqs[idxA].status = 'ASSIGNED';
      allReqs[idxA].selectedCourierName = 'Mert Aksoy (Birleşik Rota)';
      allReqs[idxA].finalAgreedPrice = opp.merchantDiscountedCostPerOrder;

      allReqs[idxB].status = 'ASSIGNED';
      allReqs[idxB].selectedCourierName = 'Mert Aksoy (Birleşik Rota)';
      allReqs[idxB].finalAgreedPrice = opp.merchantDiscountedCostPerOrder;

      saveStoredCourierRequests(allReqs);
      setRequests([...allReqs]);
      showToast(`⚡ Birleşik Rota Başlatıldı! 2 sipariş tek seferde kuryeye atandı (Esnaf başı ₺${opp.savedMerchantAmount / 2} tasarruf).`);
    }
  };

  const mergedOpportunities = findMergedRouteOpportunities(requests);
  const availableCouriers = couriers.filter(c => c.status === 'AVAILABLE');

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#0B132B] text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-bold animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. ÜST BİLGİLENDİRME & KONTROL KARTI */}
      <div className="bg-gradient-to-r from-[#0F4C3A] to-[#0B132B] rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>TamKurye: Açık Kurye Pazaryeri & Radar</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Kurye Çağrı ve İhale Motoru</h2>
          <p className="text-xs text-slate-300 font-medium">
            %0 Komisyon · Şeffaf kurye tarifeleri · Doğrudan esnaf ve kurye mutabakatı.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <Link
            to="/kuryeler"
            className="py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>Kurye Rehberini İncele</span>
          </Link>

          <button
            type="button"
            onClick={() => setShowDispatchModal(true)}
            className="py-2.5 px-5 bg-[#F59E0B] hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-slate-950" />
            <span>+ Tek Tıkla Kurye Çağır / İhale Aç</span>
          </button>
        </div>
      </div>

      {/* 2. İKİ SÜTUNLU YAPI: SOLDA AÇIK İHALELER, SAĞDA RADARDAKİ KURYELER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SOL 2 SÜTUN: ESNAFIN AÇTIĞI VE GELEN TEKLİFLER */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* AKILLI ROTA VE GÜZERGAH BİRLEŞTİRİCİ KARTI */}
          {mergedOpportunities.length > 0 && (
            <div className="bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-indigo-500/15 rounded-3xl p-5 border-2 border-amber-400/80 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-amber-400 text-slate-950 rounded-xl font-black text-xs">
                    ⚡ ROTA EŞLEŞTİ
                  </span>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">Akıllı Güzergah ve Rota Birleştirici</h4>
                    <p className="text-[11px] text-slate-600 font-medium">
                      Aynı cadde ve varış hattındaki 2 aktif paket tespit edildi.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  ₺{mergedOpportunities[0].savedMerchantAmount} Toplam Tasarruf
                </span>
              </div>

              {mergedOpportunities.map((opp) => (
                <div key={opp.id} className="bg-white rounded-2xl p-4 border border-amber-200 shadow-xs space-y-3">
                  <div className="flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">
                        📍 {opp.matchedZone}
                      </span>
                      <p className="text-xs font-bold text-slate-900">
                        "{opp.requestA.storeName}" + "{opp.requestB.storeName}"
                      </p>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span>🛣️ Toplam Mesafe: ~{opp.totalDistanceKm} km</span>
                        <span>•</span>
                        <span>📦 2 Ayrı Teslimat Tek Seferde</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 line-through block">Ayrı: ₺{opp.individualTotalCost}</span>
                      <span className="text-base font-black text-emerald-700 font-mono">₺{opp.merchantDiscountedCostPerOrder} / paket</span>
                      <span className="text-[10px] text-emerald-600 font-bold block">Kurye: ₺{opp.mergedCourierEarning}</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 truncate">
                      <Navigation className="w-3.5 h-3.5 text-[#0F4C3A] shrink-0" />
                      <span className="truncate"><strong>Adımlar:</strong> {opp.pickupSteps[0].storeName} ➔ {opp.pickupSteps[1].storeName} ➔ Teslimatlar</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAcceptMergedRoute(opp)}
                      className="shrink-0 ml-2 py-1.5 px-3 bg-[#0F4C3A] hover:bg-emerald-800 text-white font-bold rounded-lg text-xs transition cursor-pointer flex items-center gap-1"
                    >
                      <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>Birleşik Rota Olarak Başlat</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0F4C3A]" />
              Aktif Kurye İhaleleri ve Gelen Teklifler ({requests.length})
            </h3>
            <span className="text-[11px] font-bold text-slate-500">
              Altınordu Bölgesi
            </span>
          </div>

          <div className="space-y-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className={`bg-white rounded-3xl p-5 border shadow-xs space-y-4 hover:border-[#0F4C3A]/40 transition ${
                  req.isMergedRouteCandidate ? 'border-amber-300 ring-1 ring-amber-300/40' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs text-slate-900">#{req.orderNumber}</span>
                      
                      {req.isMergedRouteCandidate && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 flex items-center gap-1 shadow-xs">
                          <Zap className="w-3 h-3" />
                          <span>Rota Eşleşti! (Çift Paket)</span>
                        </span>
                      )}

                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                        {req.packageType === 'FOOD' ? '🍔 Sıcak Gıda' : '📦 Perakende Paket'}
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        req.status === 'ASSIGNED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-indigo-50 text-indigo-700'
                      }`}>
                        {req.status === 'ASSIGNED' ? '✓ Kurye Atandı' : '⚡ Teklif Bekleniyor'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{req.pickupAddress} ➔ <strong>{req.deliveryAddress}</strong></span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Hedef Bütçe</span>
                    <span className="text-lg font-black text-slate-900 font-mono">₺{req.targetBudget}</span>
                  </div>
                </div>

                {/* Gelen Kurye Teklifleri Listesi */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 block">
                    Gelen Kurye Teklifleri ({req.offers?.length || 0}):
                  </span>

                  {req.offers && req.offers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {req.offers.map((offer) => (
                        <div
                          key={offer.id}
                          className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <strong className="text-slate-900 font-bold">{offer.courierName}</strong>
                            <span className="font-mono font-black text-emerald-700 text-sm">₺{offer.offeredPrice}</span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span>⏱️ ~{offer.estimatedArrivalMin} Dk Varış</span>
                            <span className="text-amber-500 font-bold">⭐ {offer.courierRating}</span>
                          </div>

                          {req.status !== 'ASSIGNED' && (
                            <button
                              type="button"
                              onClick={() => handleAcceptCourierOffer(req, offer)}
                              className="w-full py-1.5 bg-[#0F4C3A] hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5 text-[#F59E0B]" />
                              <span>Teklifi Kabul Et & Görevi Ver</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-50 rounded-2xl text-center text-xs text-slate-400 border border-dashed border-slate-200">
                      Henüz kurye teklifi gelmedi. Mahalle kuryelerinin radarına yayınlandı.
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* SAĞ 1 SÜTUN: RADARDAKİ MÜSAİT KURYELER */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#F59E0B]" />
              Müsait Kuryeler ({availableCouriers.length})
            </h3>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              🟢 Canlı Radar
            </span>
          </div>

          <div className="space-y-3">
            {availableCouriers.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 hover:border-emerald-500 transition"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <strong className="text-xs font-black text-slate-900">{c.name}</strong>
                        {c.isLicenseAndSrcVerified && (
                          <span title="SRC Onaylı">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        {getVehicleTypeIconEmoji(c.vehicleType)} {getVehicleTypeLabel(c.vehicleType)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-bold">Açılış</span>
                    <span className="text-sm font-black text-slate-900 font-mono">₺{c.tariff.basePackagePrice}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                  <span>📍 ~{c.distanceMeters || 800}m uzakta</span>
                  <span className="text-amber-500 font-bold">⭐ {c.rating} ({c.completedDeliveries} teslimat)</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={`https://wa.me/${c.whatsapp}?text=Merhaba%20${c.name},%20dükkândan%20paket%20teslimatı%20için%20yazıyorum.`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-center text-xs transition"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`tel:${c.phone.replace(/[^0-9+]/g, '')}`}
                    className="py-1.5 px-2.5 bg-[#0B132B] hover:bg-slate-800 text-white font-bold rounded-lg text-center text-xs transition"
                  >
                    Ara
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Dispatch Modal Popup */}
      {showDispatchModal && (
        <CourierDispatchModal
          order={{
            id: 'ord-fast-dispatch',
            orderNumber: 'TPZ-EXP-' + Date.now().toString().slice(-4),
            customerName: 'Mahalle Müşterisi',
            customerPhone: '+90 532 111 22 33',
            customerAddress: 'Altınordu Bahçelievler Mah.',
            storeName: 'FotoSentez Stüdyo & Esnaf'
          }}
          onClose={() => setShowDispatchModal(false)}
        />
      )}

    </div>
  );
}
