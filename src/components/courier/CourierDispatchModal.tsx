/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Bike, Phone, MessageSquare, ShieldCheck, MapPin, 
  CheckCircle2, Star, Clock, AlertCircle, X, Navigation, 
  Send, ExternalLink, Zap, DollarSign, Check, ChevronRight,
  Truck, HelpCircle, Layers, ArrowRight, Sparkles
} from 'lucide-react';
import { 
  CourierProfile, 
  CourierPoolRequest,
  getStoredCouriers, 
  getStoredCourierRequests, 
  saveStoredCourierRequests,
  generateCourierWhatsAppUrl,
  getVehicleTypeLabel,
  getVehicleTypeIconEmoji
} from '../../data/courierData';

interface CourierDispatchModalProps {
  order?: {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    storeName: string;
    storePhone?: string;
    totalAmount?: number;
    itemsSummary?: string;
  };
  onClose: () => void;
  onCourierAssigned?: (courierName: string, courierPhone: string, agreedPrice: number) => void;
}

export default function CourierDispatchModal({
  order,
  onClose,
  onCourierAssigned
}: CourierDispatchModalProps) {
  const [couriers] = useState<CourierProfile[]>(() => getStoredCouriers());
  const [activeTab, setActiveTab] = useState<'RADAR' | 'POOL_BID'>('RADAR');
  const [selectedCourier, setSelectedCourier] = useState<CourierProfile | null>(null);
  const [targetBudget, setTargetBudget] = useState(70);
  const [packageType, setPackageType] = useState<'FOOD' | 'RETAIL' | 'HEAVY_PARCEL' | 'DOCUMENTS' | 'URGENT'>('FOOD');
  const [poolNote, setPoolNote] = useState('');
  const [poolCreatedSuccess, setPoolCreatedSuccess] = useState(false);
  const [dispatchedSuccess, setDispatchedSuccess] = useState<{
    courier: CourierProfile;
    price: number;
    paymentMethod: string;
    whatsappUrl: string;
  } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'IBAN' | 'COURIER_POS'>('CASH');

  const storeAddress = 'Altınordu Çarşı / Süleyman Felek Cad. No: 12';
  const deliveryAddress = order?.customerAddress || 'Bahçelievler Mah. Atatürk Bulvarı No: 28';
  const orderNumber = order?.orderNumber || 'TPZ-EXP-889';
  const storeName = order?.storeName || 'Kuzey Fırın & Unlu Mamuller';

  // Calculate estimated price based on courier tariff
  const calculateCourierFee = (courier: CourierProfile, distanceKm = 2.5) => {
    const fee = courier.tariff.basePackagePrice + (courier.tariff.perKmRate * Math.max(0, distanceKm - 1));
    return Math.round(fee);
  };

  const handleDirectDispatch = (courier: CourierProfile) => {
    const calculatedPrice = calculateCourierFee(courier);
    const waUrl = generateCourierWhatsAppUrl(courier.phone, {
      orderNumber: orderNumber,
      storeName: storeName,
      storePhone: order?.storePhone || '+90 532 999 11 22',
      pickupAddress: storeAddress,
      deliveryAddress: deliveryAddress,
      customerName: order?.customerName,
      customerPhone: order?.customerPhone,
      packageType: packageType === 'FOOD' ? 'Sıcak Yemek / Gıda' : 'Perakende Paket',
      agreedPrice: calculatedPrice,
      paymentMethod: paymentMethod === 'CASH' ? 'Nakit Ödeme' : paymentMethod === 'IBAN' ? 'Banka Havalesi / IBAN' : 'Kurye Kendi POS Cihazı',
      notes: poolNote || 'Kapıda teslim edilmeli.'
    });

    setDispatchedSuccess({
      courier,
      price: calculatedPrice,
      paymentMethod,
      whatsappUrl: waUrl
    });

    if (onCourierAssigned) {
      onCourierAssigned(courier.name, courier.phone, calculatedPrice);
    }
  };

  const handleCreatePoolBid = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = getStoredCourierRequests();
    const newRequest: CourierPoolRequest = {
      id: `req-${Date.now()}`,
      orderId: order?.id,
      orderNumber: orderNumber,
      storeName: storeName,
      storePhone: order?.storePhone || '+90 532 999 11 22',
      pickupAddress: storeAddress,
      pickupDistrict: 'Altınordu',
      deliveryAddress: deliveryAddress,
      deliveryDistrict: 'Altınordu',
      packageType: packageType,
      distanceKm: 2.5,
      targetBudget: Number(targetBudget),
      note: poolNote || 'Hızlı mahalle teslimatı',
      status: 'OPEN_FOR_BIDS',
      offers: [],
      paymentMethod: paymentMethod,
      createdAt: 'Az önce'
    };

    saveStoredCourierRequests([newRequest, ...existing]);
    setPoolCreatedSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-fade-in">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0F4C3A] to-[#0B132B] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F59E0B] text-slate-950 flex items-center justify-center font-black text-xl shadow-md">
              🛵
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base md:text-lg">TamKurye: Açık Kurye Radarı & Çağrı</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  %0 Komisyon
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Sipariş #{orderNumber} · {order?.customerName || 'Mahalle Sakini'}
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sipariş Özeti Şeridi */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-medium text-slate-500">Teslimat Adresi:</span>
            <strong className="text-slate-900 truncate max-w-md">{deliveryAddress}</strong>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-500">Tahmini Mesafe: <strong>~2.5 km</strong></span>
          </div>
        </div>

        {/* Başarılı Çağrı Ekranı */}
        {dispatchedSuccess ? (
          <div className="p-6 md:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-black text-slate-900">
                Kurye Çağrısı Başarıyla Oluşturuldu!
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                <strong>{dispatchedSuccess.courier.name}</strong> ({dispatchedSuccess.courier.phone}) ile doğrudan görev mutabakatı sağlandı. Komisyonsuz net kurye ücreti: <strong>₺{dispatchedSuccess.price}</strong>.
              </p>
            </div>

            {/* Görev Fişi & WhatsApp Aksiyonları */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 max-w-lg mx-auto text-left text-xs space-y-3">
              <div className="flex items-center justify-between font-bold text-emerald-950 pb-2 border-b border-emerald-200/80">
                <span>🛵 WhatsApp Görev Fişi Hazırlandı</span>
                <span className="font-mono">₺{dispatchedSuccess.price} (Doğrudan Kuryeye)</span>
              </div>
              
              <div className="space-y-1 text-slate-700 text-[11px]">
                <div>• <strong>Kurye:</strong> {dispatchedSuccess.courier.name} ({getVehicleTypeLabel(dispatchedSuccess.courier.vehicleType)})</div>
                <div>• <strong>Varış Süresi:</strong> ~{dispatchedSuccess.courier.etaMinutes || 5} Dakika</div>
                <div>• <strong>Ödeme Yolu:</strong> {dispatchedSuccess.paymentMethod === 'CASH' ? 'Nakit Ödeme' : dispatchedSuccess.paymentMethod === 'IBAN' ? 'IBAN / Havale' : 'Kurye POS'}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <a
                  href={dispatchedSuccess.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp Fişini Gönder
                </a>
                <a
                  href={`tel:${dispatchedSuccess.courier.phone.replace(/[^0-9+]/g, '')}`}
                  className="py-2.5 px-4 bg-[#0B132B] hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-xs"
                >
                  <Phone className="w-4 h-4" />
                  Kuryeyi Hemen Ara
                </a>
              </div>
            </div>

            <button
              onClick={onClose}
              className="py-2.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition"
            >
              Pencereyi Kapat ve Siparişe Dön
            </button>
          </div>
        ) : poolCreatedSuccess ? (
          <div className="p-6 md:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
              <Sparkles className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-black text-slate-900">
                Teslimat Talebiniz Kurye Havuzuna Yayınlandı!
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Altınordu bölgesindeki aktif kuryelere anında bildirim gönderildi. Kuryeler teklif verdikçe yönetim panelinizde bildirim alacaksınız.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 max-w-md mx-auto text-xs text-slate-700 text-left space-y-1.5">
              <div className="font-bold text-amber-950">📦 İhale Özeti:</div>
              <div>• Sipariş: #{orderNumber}</div>
              <div>• Hedef Kurye Bütçesi: <strong>₺{targetBudget}</strong></div>
              <div>• Teslimat: {deliveryAddress}</div>
            </div>

            <button
              onClick={onClose}
              className="py-2.5 px-6 bg-[#0F4C3A] hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition shadow-md"
            >
              Tamam, Panele Dön
            </button>
          </div>
        ) : (
          <div className="p-5 md:p-6 space-y-5">
            
            {/* Tab Seçimi: Radar vs İhale */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <button
                type="button"
                onClick={() => setActiveTab('RADAR')}
                className={`py-2 px-4 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'RADAR'
                    ? 'bg-[#0F4C3A] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Zap className="w-4 h-4 text-[#F59E0B]" />
                <span>Yakındaki Müsait Kuryeler ({couriers.filter(c => c.status === 'AVAILABLE').length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('POOL_BID')}
                className={`py-2 px-4 rounded-xl text-xs font-black transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'POOL_BID'
                    ? 'bg-[#0F4C3A] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Layers className="w-4 h-4 text-[#F59E0B]" />
                <span>Havuza İhale Aç / Teklif Topla</span>
              </button>
            </div>

            {/* TAB 1: RADAR - MÜSAİT KURYELER LİSTESİ */}
            {activeTab === 'RADAR' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Mahallenizde anında göreve hazır doğrulanmış kuryeler:</span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    🟢 Canlı Konum Sıralı
                  </span>
                </div>

                <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                  {couriers.map((courier) => {
                    const estFee = calculateCourierFee(courier);
                    const isAvailable = courier.status === 'AVAILABLE';

                    return (
                      <div
                        key={courier.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                          isAvailable
                            ? 'bg-white hover:border-[#0F4C3A] hover:shadow-md border-slate-200'
                            : 'bg-slate-50 border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="relative">
                            <img
                              src={courier.avatar}
                              alt={courier.name}
                              className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-200"
                            />
                            <span 
                              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                                isAvailable ? 'bg-emerald-500' : 'bg-rose-500'
                              }`} 
                              title={isAvailable ? 'Müsait' : 'Meşgul'}
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <strong className="text-sm font-black text-slate-900">{courier.name}</strong>
                              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <span>{getVehicleTypeIconEmoji(courier.vehicleType)}</span>
                                <span>{getVehicleTypeLabel(courier.vehicleType)}</span>
                              </span>
                              {courier.isLicenseAndSrcVerified && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5">
                                  <ShieldCheck className="w-3 h-3" /> SRC Onaylı
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                              <span className="flex items-center gap-1 text-amber-500 font-bold">
                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                <span>{courier.rating}</span>
                                <span className="text-slate-400 font-normal">({courier.completedDeliveries} teslimat)</span>
                              </span>
                              <span>•</span>
                              <span className="text-slate-700 font-medium">
                                📍 <strong>{courier.distanceMeters || 800}m</strong> uzakta (~{courier.etaMinutes || 5} dk)
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Fiyat & Çağrı Butonu */}
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Tarife Bedeli</span>
                            <span className="text-lg font-black text-slate-900 font-mono">₺{estFee}</span>
                          </div>

                          <button
                            type="button"
                            disabled={!isAvailable}
                            onClick={() => handleDirectDispatch(courier)}
                            className={`py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                              isAvailable
                                ? 'bg-[#0F4C3A] hover:bg-emerald-800 text-white'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            <span>Hemen Çağır</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#F59E0B]" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: HAVUZA İHALE AÇ / TEKLİF TOPLA */}
            {activeTab === 'POOL_BID' && (
              <form onSubmit={handleCreatePoolBid} className="space-y-4">
                <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-950 space-y-1">
                  <span className="font-bold flex items-center gap-1.5 text-amber-900">
                    <Sparkles className="w-4 h-4 text-amber-600" /> Havuz İhalesi Nasıl Çalışır?
                  </span>
                  <p className="text-[11px] text-amber-900/90 leading-relaxed">
                    Sipariş teslimatını mahalledeki tüm aktif kuryelere açık bir teklif havuzuna bırakırsınız. Kuryeler kendi uygunluklarına göre teklif verir, en uygun veya en hızlı kuryeyi seçersiniz.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Paket Türü & Nitelik</label>
                    <select
                      value={packageType}
                      onChange={(e) => setPackageType(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-semibold text-slate-800 outline-none"
                    >
                      <option value="FOOD">🍔 Sıcak Yemek / Unlu Mamul</option>
                      <option value="RETAIL">📦 Perakende Paket / Ayakkabı / Butik</option>
                      <option value="HEAVY_PARCEL">🚐 Hacimli Koli / Ağır Yük (Panelvan)</option>
                      <option value="DOCUMENTS">📄 Resmi Evrak / Kaşe</option>
                      <option value="URGENT">⚡ 15 Dk İçi Ultra Acil Teslimat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Hedef / Taban Kurye Ücreti (₺)</label>
                    <input
                      type="number"
                      min="30"
                      max="500"
                      value={targetBudget}
                      onChange={(e) => setTargetBudget(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-900 outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-xs">Kuryeye Not (Opsiyonel)</label>
                  <input
                    type="text"
                    placeholder="Örn: Kapıda zile basılmasın, dükkândan fırın poşetiyle alınacak."
                    value={poolNote}
                    onChange={(e) => setPoolNote(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1 text-xs">Ödeme Şekli (Kurye ile Mutabakat)</label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { id: 'CASH', label: '💵 Nakit' },
                      { id: 'IBAN', label: '🏦 IBAN / Havale' },
                      { id: 'COURIER_POS', label: '💳 Kurye POS' }
                    ].map(pm => (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id as any)}
                        className={`py-2 px-3 rounded-xl font-bold transition border ${
                          paymentMethod === pm.id
                            ? 'bg-[#0F4C3A] text-white border-[#0F4C3A]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {pm.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl text-xs font-black bg-[#F59E0B] hover:bg-amber-400 text-slate-950 transition shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Havuza İhale Yayınla</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
