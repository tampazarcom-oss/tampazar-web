/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Truck, Package, Search, Printer, CheckCircle2, 
  Clock, ExternalLink, MessageCircle, AlertCircle, X, Check, Eye
} from 'lucide-react';
import { HybridOrder } from '../../data/hybridCommerceData';

interface CargoOrdersModuleProps {
  orders: HybridOrder[];
  onUpdateOrderStatus: (orderId: string, newStatus: HybridOrder['status'], trackingNo?: string) => void;
}

export default function CargoOrdersModule({ orders, onUpdateOrderStatus }: CargoOrdersModuleProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLabelOrder, setSelectedLabelOrder] = useState<HybridOrder | null>(null);
  const [editingTrackingId, setEditingTrackingId] = useState<string | null>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const cargoOrders = orders.filter(o => o.deliveryType === 'CARGO');

  const filteredOrders = cargoOrders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.cargoDetails?.trackingNumber && order.cargoDetails.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && order.status === statusFilter;
  });

  const handleSaveTracking = (orderId: string) => {
    if (!trackingInput.trim()) return;
    onUpdateOrderStatus(orderId, 'SHIPPED', trackingInput.trim());
    setEditingTrackingId(null);
    setTrackingInput('');
  };

  const handleCopySMS = (order: HybridOrder) => {
    const text = `Sayın ${order.customerName}, ${order.storeName} üzerinden verdiğiniz ${order.orderNumber} nolu siparişiniz ${order.cargoDetails?.carrier || 'Yurtiçi Kargo'} firmasına teslim edilmiştir. Takip No: ${order.cargoDetails?.trackingNumber || 'YK-40918290192'}. Güle güle kullanın!`;
    navigator.clipboard?.writeText(text);
    setCopiedOrderId(order.id);
    setTimeout(() => setCopiedOrderId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Üst Başlık ve İstatistikler */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700 font-bold">
              <Truck className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-slate-900">Ulusal Kargo ve E-Ticaret Siparişleri</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Trendyol & Amazon standartlarında tüm Türkiye kargo gönderileri, otomatik e-İrsaliye barkodu ve entegrasyonu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-center">
            <span className="text-[10px] text-slate-500 font-bold block">Bekleyen Paket</span>
            <span className="text-base font-black text-amber-600">
              {cargoOrders.filter(o => o.status === 'PREPARING' || o.status === 'NEW').length}
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-center">
            <span className="text-[10px] text-slate-500 font-bold block">Kargoda Olan</span>
            <span className="text-base font-black text-indigo-600">
              {cargoOrders.filter(o => o.status === 'SHIPPED').length}
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-center">
            <span className="text-[10px] text-slate-500 font-bold block">Teslim Edilen</span>
            <span className="text-base font-black text-emerald-600">
              {cargoOrders.filter(o => o.status === 'DELIVERED').length}
            </span>
          </div>
        </div>
      </div>

      {/* Arama ve Filtre Çubuğu */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input 
            type="text" 
            placeholder="Sipariş No, Müşteri, Şehir, Takip No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['all', 'PREPARING', 'SHIPPED', 'DELIVERED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                statusFilter === st ? 'bg-indigo-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all' && 'Tüm Kargo Siparişleri'}
              {st === 'PREPARING' && 'Hazırlanıyor / Paketleniyor'}
              {st === 'SHIPPED' && 'Kargoya Verildi'}
              {st === 'DELIVERED' && 'Teslim Edildi'}
            </button>
          ))}
        </div>
      </div>

      {/* Sipariş Tablosu */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Sipariş / Tarih</th>
                <th className="p-4">Müşteri & Teslimat İli</th>
                <th className="p-4">Ürünler & Tutar</th>
                <th className="p-4">Kargo Şirketi & Takip No</th>
                <th className="p-4">Durum</th>
                <th className="p-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Arama kriterine uygun ulusal kargo siparişi bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isPreparing = order.status === 'PREPARING' || order.status === 'NEW';
                  const isShipped = order.status === 'SHIPPED';
                  const isDelivered = order.status === 'DELIVERED';

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4">
                        <span className="font-mono font-bold text-slate-900 block">{order.orderNumber}</span>
                        <span className="text-[11px] text-slate-400 block">{order.createdAt}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-1.5 py-0.5 rounded inline-block mt-1">
                          {order.paymentMethod === 'PAYTR_POS' ? 'PayTR ile Ödendi' : 'Sanal POS ile Ödendi'}
                        </span>
                      </td>

                      <td className="p-4">
                        <strong className="text-slate-900 block">{order.customerName}</strong>
                        <span className="text-slate-500 text-[11px] block">{order.customerPhone}</span>
                        <span className="text-slate-600 font-semibold text-[11px] block">{order.city} / {order.district}</span>
                      </td>

                      <td className="p-4">
                        <div className="space-y-0.5">
                          {order.items.map((item, i) => (
                            <div key={i} className="text-slate-800">
                              <span className="font-bold">{item.qty}x</span> {item.title}
                              {item.variant && <span className="text-slate-400 block text-[10px]">{item.variant}</span>}
                            </div>
                          ))}
                          <strong className="text-slate-900 block pt-1 text-sm font-black">
                            ₺{order.totalAmount.toLocaleString('tr-TR')}
                          </strong>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-slate-800 block">
                          {order.cargoDetails?.carrier || 'Yurtiçi Kargo'}
                        </span>
                        {editingTrackingId === order.id ? (
                          <div className="flex items-center gap-1.5 mt-1">
                            <input 
                              type="text"
                              value={trackingInput}
                              onChange={(e) => setTrackingInput(e.target.value)}
                              placeholder="Takip No Girin"
                              className="px-2 py-1 bg-white border border-indigo-600 rounded text-xs w-36 outline-none"
                            />
                            <button
                              onClick={() => handleSaveTracking(order.id)}
                              className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 cursor-pointer"
                              title="Kaydet ve Kargola"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingTrackingId(null)}
                              className="p-1 bg-slate-200 text-slate-600 rounded hover:bg-slate-300 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="mt-1">
                            {order.cargoDetails?.trackingNumber ? (
                              <div className="flex items-center gap-1.5 font-mono text-indigo-700 font-semibold">
                                <span>{order.cargoDetails.trackingNumber}</span>
                                <button
                                  onClick={() => handleCopySMS(order)}
                                  className="text-[10px] text-slate-400 hover:text-indigo-600 cursor-pointer"
                                  title="SMS / WhatsApp Metnini Kopyala"
                                >
                                  {copiedOrderId === order.id ? 'Kopyalandı!' : '📋'}
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingTrackingId(order.id);
                                  setTrackingInput('YK-' + Math.floor(1000000000 + Math.random() * 9000000000));
                                }}
                                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer underline"
                              >
                                + Takip No Ekle
                              </button>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        {isPreparing && (
                          <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Hazırlanıyor
                          </span>
                        )}
                        {isShipped && (
                          <span className="bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                            <Truck className="w-3 h-3" /> Kargoya Verildi
                          </span>
                        )}
                        {isDelivered && (
                          <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Teslim Edildi
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Barkod Etiketi Yazdır */}
                          <button
                            onClick={() => setSelectedLabelOrder(order)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] transition flex items-center gap-1 cursor-pointer"
                            title="Resmi Kargo Barkod Etiketi Yazdır"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Kargo Etiketi</span>
                          </button>

                          {/* Durum Değiştirme */}
                          {isPreparing && (
                            <button
                              onClick={() => {
                                const dummyTracking = 'YK-' + Math.floor(1000000000 + Math.random() * 9000000000);
                                onUpdateOrderStatus(order.id, 'SHIPPED', dummyTracking);
                              }}
                              className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition cursor-pointer"
                            >
                              Kargoya Ver
                            </button>
                          )}
                          {isShipped && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'DELIVERED')}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition cursor-pointer"
                            >
                              Teslim Edildi İşaretle
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* KARGO BARKOD ETİKETİ ÖNİZLEME MODALI */}
      {selectedLabelOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative animate-fade-in text-slate-900 border border-slate-200">
            <button
              onClick={() => setSelectedLabelOrder(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-indigo-600 block">
                  Standart E-Ticaret Kargo Sevk İrsaliyesi
                </span>
                <h3 className="text-base font-black text-slate-900">
                  {selectedLabelOrder.cargoDetails?.carrier || 'Yurtiçi Kargo'} Gönderi Etiketi
                </h3>
              </div>
            </div>

            {/* Fiziksel Kargo Etiketi Simülasyonu */}
            <div className="border-2 border-black p-4 rounded-xl bg-white space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b-2 border-black pb-2 items-center">
                <div>
                  <span className="font-black text-sm">{selectedLabelOrder.cargoDetails?.carrier || 'Yurtiçi Kargo'}</span>
                  <span className="text-[10px] block font-sans">TamPazar Anlaşmalı Gönderi</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] block font-bold">DESİ / KG: 1.5</span>
                  <span className="text-[10px] block">Ödeme: Gönderici Peşin</span>
                </div>
              </div>

              {/* Barkod Alanı */}
              <div className="text-center py-2 bg-slate-50 border border-dashed border-slate-400 rounded">
                <div className="text-2xl tracking-widest font-bold select-none font-mono">
                  |||||| ||||| |||||||| |||| ||||||
                </div>
                <span className="text-[11px] font-bold tracking-wider">
                  {selectedLabelOrder.cargoDetails?.barcode || '90029182901921'}
                </span>
                <span className="text-[9px] block text-slate-500 font-sans">
                  Takip No: {selectedLabelOrder.cargoDetails?.trackingNumber || 'YK-40918290192'}
                </span>
              </div>

              {/* Alıcı ve Gönderici */}
              <div className="grid grid-cols-2 gap-2 text-[11px] border-t border-black pt-2">
                <div>
                  <strong className="block text-slate-500 text-[9px] uppercase font-sans">GÖNDERİCİ:</strong>
                  <span className="font-bold">{selectedLabelOrder.storeName}</span>
                  <span className="block text-[10px]">TamPazar Onaylı Satıcı</span>
                </div>
                <div>
                  <strong className="block text-slate-500 text-[9px] uppercase font-sans">ALICI:</strong>
                  <span className="font-bold">{selectedLabelOrder.customerName}</span>
                  <span className="block text-[10px]">{selectedLabelOrder.customerAddress}</span>
                  <span className="block font-bold text-slate-900">{selectedLabelOrder.district} / {selectedLabelOrder.city}</span>
                  <span className="block text-[10px]">{selectedLabelOrder.customerPhone}</span>
                </div>
              </div>

              <div className="border-t border-black pt-2 flex justify-between text-[10px]">
                <span>Sipariş No: {selectedLabelOrder.orderNumber}</span>
                <span>Fatura No: {selectedLabelOrder.invoiceNumber || 'GİB2026000000881'}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Termal / A4 Yazıcıya Gönder
              </button>
              <button
                onClick={() => handleCopySMS(selectedLabelOrder)}
                className="px-4 py-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs rounded-xl cursor-pointer"
              >
                {copiedOrderId === selectedLabelOrder.id ? 'SMS Kopyalandı!' : 'SMS Metni'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
