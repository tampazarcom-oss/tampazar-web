/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Bell, Volume2, Clock, CheckCircle2, Bike, Utensils, 
  MapPin, Phone, Printer, AlertCircle, Sparkles, Check, ArrowRight 
} from 'lucide-react';
import { HybridOrder, playOrderAlertChime } from '../../data/hybridCommerceData';
import OrderCustomizationDisplay from './OrderCustomizationDisplay';

interface LocalOrdersModuleProps {
  orders: HybridOrder[];
  onUpdateOrderStatus: (orderId: string, newStatus: HybridOrder['status']) => void;
}

export default function LocalOrdersModule({ orders, onUpdateOrderStatus }: LocalOrdersModuleProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [testSoundPlayed, setTestSoundPlayed] = useState(false);

  const localOrders = orders.filter(o => o.deliveryType === 'LOCAL_EXPRESS');

  const handleTestChime = () => {
    playOrderAlertChime();
    setTestSoundPlayed(true);
    setTimeout(() => setTestSoundPlayed(false), 2000);
  };

  const handleAcceptOrder = (orderId: string) => {
    playOrderAlertChime();
    onUpdateOrderStatus(orderId, 'KITCHEN_PREPARING');
  };

  const handleDispatchCourier = (orderId: string) => {
    onUpdateOrderStatus(orderId, 'COURIER_ON_WAY');
  };

  const handleDeliverOrder = (orderId: string) => {
    onUpdateOrderStatus(orderId, 'DELIVERED');
  };

  return (
    <div className="space-y-6">
      {/* Üst Canlı Zil ve Kontrol Barı */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 rounded-3xl p-6 text-slate-950 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-slate-950 text-amber-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>TamHızlı Canlı Esnaf Ekranı</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">TamHızlı (Ekspres Sipariş & Zil)</h2>
          <p className="text-xs text-slate-900 font-medium">
            30-45 dakikalık mahalle siparişleri doğrudan bu ekrana düşer ve sesli zil çalar.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTestChime}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-950 text-white rounded-2xl text-xs font-black hover:bg-slate-900 shadow-md transition cursor-pointer"
          >
            <Volume2 className={`w-4 h-4 text-amber-400 ${testSoundPlayed ? 'animate-bounce' : ''}`} />
            <span>{testSoundPlayed ? 'Zil Çaldı! 🔔' : 'Sipariş Zilini Test Et'}</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-2.5 rounded-2xl text-xs font-bold transition border ${
              soundEnabled 
                ? 'bg-emerald-600 text-white border-emerald-700' 
                : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            {soundEnabled ? '🔔 Ses Açık' : '🔕 Sessiz'}
          </button>
        </div>
      </div>

      {/* Sipariş Akış Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {localOrders.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-black text-slate-800">Şu an aktif yerel sipariş bulunmuyor</h3>
            <p className="text-xs text-slate-400 mt-1">Yeni bir sipariş geldiğinde ekran otomatik güncellenir ve zil çalar.</p>
          </div>
        ) : (
          localOrders.map((order) => {
            const isRinging = order.status === 'RINGING';
            const isPreparing = order.status === 'KITCHEN_PREPARING' || order.status === 'ACCEPTED';
            const isCourierOnWay = order.status === 'COURIER_ON_WAY';
            const isDelivered = order.status === 'DELIVERED';

            return (
              <div 
                key={order.id}
                className={`bg-white rounded-3xl p-5 border shadow-sm transition-all flex flex-col justify-between relative overflow-hidden ${
                  isRinging 
                    ? 'border-amber-400 ring-4 ring-amber-400/30 animate-pulse' 
                    : isCourierOnWay 
                    ? 'border-indigo-200 bg-indigo-50/10' 
                    : 'border-slate-200'
                }`}
              >
                {/* Durum Rozeti */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono font-bold text-xs text-slate-900">{order.orderNumber}</span>
                  {isRinging && (
                    <span className="bg-rose-500 text-white font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      YENİ SİPARİŞ ZİLİ
                    </span>
                  )}
                  {isPreparing && (
                    <span className="bg-amber-100 text-amber-900 font-bold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Utensils className="w-3 h-3" /> Hazırlanıyor
                    </span>
                  )}
                  {isCourierOnWay && (
                    <span className="bg-indigo-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Bike className="w-3 h-3" /> Kuryede (Yolda)
                    </span>
                  )}
                  {isDelivered && (
                    <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Teslim Edildi
                    </span>
                  )}
                </div>

                {/* Müşteri ve Adres */}
                <div className="space-y-1.5 pb-3 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <strong className="text-sm font-black text-slate-900">{order.customerName}</strong>
                    <a 
                      href={`tel:${order.customerPhone}`}
                      className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-bold"
                    >
                      <Phone className="w-3 h-3" /> Ara
                    </a>
                  </div>
                  <div className="text-xs text-slate-600 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{order.customerAddress}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Tahmini Varış: <strong className="text-slate-900">{order.localDeliveryDetails?.etaMinutes || 30} Dk</strong>
                  </div>
                </div>

                {/* Ürün Listesi */}
                <div className="py-3 space-y-2.5 flex-1">
                  {order.items.map((item, i) => (
                    <div key={i} className="border-b border-slate-100 last:border-0 pb-2 last:pb-0">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-800">
                          <strong className="text-indigo-900 font-black">{item.qty}x</strong> {item.title}
                          {item.customization?.unitLabel && item.customization.unitLabel.toLowerCase() !== 'adet' && (
                            <span className="ml-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                              {item.qty} {item.customization.unitLabel}
                            </span>
                          )}
                        </span>
                        <span className="font-bold text-slate-900">₺{(item.price * item.qty).toLocaleString('tr-TR')}</span>
                      </div>

                      {/* Dinamik Müşteri Seçenekleri & Mutfak Fişi */}
                      <OrderCustomizationDisplay 
                        customization={item.customization} 
                        itemTitle={item.title} 
                      />
                    </div>
                  ))}
                </div>

                {/* Fiyat & Ödeme Tipi */}
                <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between mb-4">
                  <span className="text-xs text-slate-500 font-bold">
                    {order.paymentMethod === 'PAYTR_POS' ? 'Online Ödendi (PayTR)' : 'Kapıda Nakit / POS'}
                  </span>
                  <span className="text-lg font-black text-slate-900">₺{order.totalAmount.toLocaleString('tr-TR')}</span>
                </div>

                {/* Kurye Bilgisi */}
                {order.localDeliveryDetails && (
                  <div className="bg-slate-50 rounded-2xl p-2.5 mb-4 text-xs space-y-1 border border-slate-100">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="font-bold">{order.localDeliveryDetails.courierName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{order.localDeliveryDetails.courierPhone}</span>
                    </div>
                  </div>
                )}

                {/* Aksiyon Butonları */}
                <div className="space-y-2">
                  {isRinging && (
                    <button
                      onClick={() => handleAcceptOrder(order.id)}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      Siparişi Onayla & Hazırla
                    </button>
                  )}

                  {isPreparing && (
                    <button
                      onClick={() => handleDispatchCourier(order.id)}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Bike className="w-4 h-4" />
                      Kuryeye Teslim Et & Yola Çıkar
                    </button>
                  )}

                  {isCourierOnWay && (
                    <button
                      onClick={() => handleDeliverOrder(order.id)}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Teslim Edildi Olarak Tamamla
                    </button>
                  )}

                  <button
                    onClick={() => window.print()}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" /> Adisyon Fişi Yazdır
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
