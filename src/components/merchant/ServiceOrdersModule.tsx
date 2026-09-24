/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Wrench, MapPin, Navigation, Phone, MessageCircle, 
  Calendar, Clock, CheckCircle2, AlertCircle, ExternalLink, Send, Check, ShieldAlert
} from 'lucide-react';
import { HybridOrder } from '../../data/hybridCommerceData';

interface ServiceOrdersModuleProps {
  orders: HybridOrder[];
  onUpdateOrderStatus: (orderId: string, newStatus: HybridOrder['status']) => void;
}

export default function ServiceOrdersModule({ orders, onUpdateOrderStatus }: ServiceOrdersModuleProps) {
  const [selectedOrderForQuote, setSelectedOrderForQuote] = useState<HybridOrder | null>(null);
  const [quoteInput, setQuoteInput] = useState<number>(1000);
  const [quoteNote, setQuoteNote] = useState('İşçilik ve malzeme dahil net teklif.');

  const serviceOrders = orders.filter(o => o.deliveryType === 'FIELD_SERVICE');

  const handleOpenGoogleMapsRoute = (order: HybridOrder) => {
    if (order.coordinates) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${order.coordinates.lat},${order.coordinates.lng}`,
        '_blank'
      );
    } else {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.customerAddress + ' ' + order.city)}`,
        '_blank'
      );
    }
  };

  const handleSendWhatsApp = (order: HybridOrder) => {
    const text = `Merhaba Sayın ${order.customerName}, ${order.storeName} servis ekibi olarak ${order.orderNumber} nolu çağrınızı aldık. Usta ekibimiz yola çıkmıştır. Tahmini varış 30 dakikadır.`;
    window.open(`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Üst Bilgi Kartı */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-900 font-bold">
              <Wrench className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-slate-900">TamUsta (Yerinde Servis & Randevu)</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            TamPazar Saha Servisi altyapısıyla harita üzerinden müşterinin tam konumunu görün, tek tıkla navigasyon rotası açın.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-center">
            <span className="text-[10px] text-slate-500 font-bold block">Acil Çağrı</span>
            <span className="text-base font-black text-rose-600">
              {serviceOrders.filter(o => o.serviceDetails?.isEmergency).length}
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-center">
            <span className="text-[10px] text-slate-500 font-bold block">Yoldaki Ekipler</span>
            <span className="text-base font-black text-indigo-600">
              {serviceOrders.filter(o => o.status === 'EN_ROUTE').length}
            </span>
          </div>
        </div>
      </div>

      {/* Çağrı Kartları Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {serviceOrders.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-black text-slate-800">Aktif servis talebi bulunmuyor</h3>
            <p className="text-xs text-slate-400 mt-1">Müşteriler hizmet talep ettiğinde buraya düşer.</p>
          </div>
        ) : (
          serviceOrders.map((order) => {
            const isEnRoute = order.status === 'EN_ROUTE';
            const isCompleted = order.status === 'COMPLETED';

            return (
              <div 
                key={order.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 hover:shadow-md transition"
              >
                {/* Başlık ve Rozet */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-500">{order.orderNumber}</span>
                      {order.serviceDetails?.isEmergency && (
                        <span className="bg-rose-100 text-rose-800 font-black text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> ACİL ÇAĞRI
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-black text-slate-900 mt-1">
                      {order.items[0]?.title || 'Saha Servisi'}
                    </h3>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isCompleted 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : isEnRoute 
                      ? 'bg-indigo-100 text-indigo-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isCompleted ? 'Tamamlandı' : isEnRoute ? 'Usta Yolda' : 'Bekliyor'}
                  </span>
                </div>

                {/* Arıza Açıklaması */}
                {order.serviceDetails?.issueDescription && (
                  <div className="bg-slate-50 p-3 rounded-2xl text-xs text-slate-700 border border-slate-100">
                    <strong className="text-slate-900 block font-bold mb-0.5">Müşteri Açıklaması:</strong>
                    {order.serviceDetails.issueDescription}
                  </div>
                )}

                {/* Müşteri ve Konum */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400 text-[10px] font-bold block uppercase">Müşteri & İletişim</span>
                    <strong className="text-slate-900 block">{order.customerName}</strong>
                    <span className="text-slate-600 block">{order.customerPhone}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 text-[10px] font-bold block uppercase">Servis Adresi</span>
                    <span className="text-slate-800 font-medium block">{order.customerAddress}</span>
                    <span className="text-indigo-600 font-bold block">{order.district} / {order.city}</span>
                  </div>
                </div>

                {/* Usta ve Araç Bilgisi */}
                {order.serviceDetails && (
                  <div className="flex items-center justify-between text-xs bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Atanan Teknisyen</span>
                      <strong className="text-indigo-950 font-bold">{order.serviceDetails.technicianName}</strong>
                    </div>
                    {order.serviceDetails.vehiclePlate && (
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-bold">Servis Plakası</span>
                        <strong className="text-slate-800 font-mono font-black">{order.serviceDetails.vehiclePlate}</strong>
                      </div>
                    )}
                  </div>
                )}

                {/* Butonlar */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleOpenGoogleMapsRoute(order)}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition"
                  >
                    <Navigation className="w-4 h-4" />
                    Haritada Rota Aç
                  </button>

                  <button
                    onClick={() => handleSendWhatsApp(order)}
                    className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
                    title="WhatsApp ile Usta Bilgisi Gönder"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>

                  <a
                    href={`tel:${order.customerPhone}`}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition"
                    title="Müşteriyi Ara"
                  >
                    <Phone className="w-4 h-4" />
                  </a>

                  {!isCompleted && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'COMPLETED')}
                      className="px-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer transition"
                    >
                      Tamamla
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
