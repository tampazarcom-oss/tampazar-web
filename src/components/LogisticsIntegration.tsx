/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Truck, Package, Barcode, CheckCircle2, ShieldCheck, 
  ExternalLink, Printer, Plus, Settings2, RefreshCw, AlertCircle, Copy
} from 'lucide-react';
import { Tenant } from '../data/mockData';

interface LogisticsIntegrationProps {
  currentTenant: Tenant;
}

export interface CarrierConfig {
  id: string;
  tenantId: string;
  carrier: 'yurtici' | 'aras' | 'mng' | 'surat' | 'ptt' | 'hepsijet';
  customerCode: string; // Kendi anlaşma cari kodu
  apiUsername: string;
  apiSecretKey: string;
  contractPricePerDesi: number;
  isActive: boolean;
}

export interface ShipmentOrder {
  id: string;
  orderNumber: string;
  recipientName: string;
  recipientPhone: string;
  destinationCity: string;
  itemsSummary: string;
  desi: number;
  carrier: 'yurtici' | 'aras' | 'mng' | 'surat' | 'ptt';
  trackingNumber: string;
  barcode: string;
  status: 'ready' | 'in_transit' | 'delivered';
  date: string;
}

export const INITIAL_CARRIERS: CarrierConfig[] = [
  {
    id: 'car-1',
    tenantId: 'tenant-1',
    carrier: 'yurtici',
    customerCode: 'YK-84920194',
    apiUsername: 'mert_kundura_api',
    apiSecretKey: 'yk_sec_89410294821',
    contractPricePerDesi: 38.5,
    isActive: true,
  },
  {
    id: 'car-2',
    tenantId: 'tenant-1',
    carrier: 'aras',
    customerCode: 'ARAS-102948',
    apiUsername: 'mertkundura_aras',
    apiSecretKey: 'aras_sec_192849102',
    contractPricePerDesi: 36.0,
    isActive: false,
  }
];

export const INITIAL_SHIPMENTS: ShipmentOrder[] = [
  {
    id: 'shp-101',
    orderNumber: 'ORD-2026-9041',
    recipientName: 'Ahmet Çelik',
    recipientPhone: '+90 532 999 8877',
    destinationCity: 'Ankara / Çankaya',
    itemsSummary: '1x Minimalist Deri Oxford Ayakkabı (No: 42)',
    desi: 2.5,
    carrier: 'yurtici',
    trackingNumber: 'YK20268492011',
    barcode: '8680001928491',
    status: 'in_transit',
    date: '2026-09-22',
  },
  {
    id: 'shp-102',
    orderNumber: 'ORD-2026-9042',
    recipientName: 'Burak Karadeniz',
    recipientPhone: '+90 544 111 2233',
    destinationCity: 'İzmir / Karşıyaka',
    itemsSummary: '1x Süet Chelsea Bot (No: 43 - Taba)',
    desi: 3.0,
    carrier: 'yurtici',
    trackingNumber: 'YK20268492012',
    barcode: '8680001928492',
    status: 'ready',
    date: '2026-09-23',
  },
  {
    id: 'shp-103',
    orderNumber: 'ORD-2026-9040',
    recipientName: 'Selin Yıldız',
    recipientPhone: '+90 530 444 5566',
    destinationCity: 'Bursa / Nilüfer',
    itemsSummary: '2x Hakiki Deri Kemer + Bakım Spreyi',
    desi: 1.2,
    carrier: 'aras',
    trackingNumber: 'AR20265819201',
    barcode: '8680001928490',
    status: 'delivered',
    date: '2026-09-20',
  }
];

export default function LogisticsIntegration({ currentTenant }: LogisticsIntegrationProps) {
  const [carriers, setCarriers] = useState<CarrierConfig[]>(() => {
    const saved = localStorage.getItem('tampazar_carriers_' + currentTenant.id);
    return saved ? JSON.parse(saved) : INITIAL_CARRIERS;
  });

  const [shipments, setShipments] = useState<ShipmentOrder[]>(() => {
    const saved = localStorage.getItem('tampazar_shipments_' + currentTenant.id);
    return saved ? JSON.parse(saved) : INITIAL_SHIPMENTS;
  });

  const [activeCarrierForm, setActiveCarrierForm] = useState(false);
  const [newCarrier, setNewCarrier] = useState<'yurtici' | 'aras' | 'mng' | 'surat' | 'ptt' | 'hepsijet'>('yurtici');
  const [customerCode, setCustomerCode] = useState('');
  const [apiUsername, setApiUsername] = useState('');
  const [apiSecretKey, setApiSecretKey] = useState('');
  const [desiPrice, setDesiPrice] = useState('38.5');

  // Selected Label for Printing
  const [selectedLabel, setSelectedLabel] = useState<ShipmentOrder | null>(null);

  const handleSaveCarrier = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CarrierConfig[] = [
      ...carriers.filter(c => c.carrier !== newCarrier),
      {
        id: 'car-' + Date.now(),
        tenantId: currentTenant.id,
        carrier: newCarrier,
        customerCode,
        apiUsername,
        apiSecretKey,
        contractPricePerDesi: parseFloat(desiPrice) || 35.0,
        isActive: true,
      }
    ];
    setCarriers(updated);
    localStorage.setItem('tampazar_carriers_' + currentTenant.id, JSON.stringify(updated));
    setActiveCarrierForm(false);
    setCustomerCode('');
    setApiUsername('');
    setApiSecretKey('');
  };

  const handleToggleCarrier = (id: string) => {
    const updated = carriers.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c);
    setCarriers(updated);
    localStorage.setItem('tampazar_carriers_' + currentTenant.id, JSON.stringify(updated));
  };

  const handleCreateShipment = () => {
    const newShp: ShipmentOrder = {
      id: 'shp-' + Date.now(),
      orderNumber: 'ORD-2026-' + Math.floor(1000 + Math.random() * 9000),
      recipientName: 'Yeni Alıcı (Pazaryeri Siparişi)',
      recipientPhone: '+90 532 ' + Math.floor(100 + Math.random() * 899) + ' ' + Math.floor(10 + Math.random() * 89) + Math.floor(10 + Math.random() * 89),
      destinationCity: 'İstanbul / Kadıköy',
      itemsSummary: '1x Mağaza Ürünü Standart Paket',
      desi: 2.0,
      carrier: carriers.find(c => c.isActive)?.carrier as any || 'yurtici',
      trackingNumber: 'TR2026' + Math.floor(10000000 + Math.random() * 90000000),
      barcode: '868000' + Math.floor(1000000 + Math.random() * 9000000),
      status: 'ready',
      date: new Date().toISOString().split('T')[0],
    };
    const updated = [newShp, ...shipments];
    setShipments(updated);
    localStorage.setItem('tampazar_shipments_' + currentTenant.id, JSON.stringify(updated));
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Header */}
      <div>
        <span className="text-xs font-mono text-indigo-600 tracking-wider uppercase font-bold bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200">
          Kendi Kargo Anlaşmanı Bağla (BYO Logistics)
        </span>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 mt-2">
          Kargo & Lojistik Entegrasyonu ve Otomatik Barkod Motoru
        </h2>
        <p className="text-slate-500 text-sm mt-1 max-w-3xl leading-relaxed">
          tampazar.com kargo komisyonu kesmez veya aracı kargo dayatmaz. İşletmeniz kendi kargo cari anlaşma kodunu girer; sipariş oluştuğu an kendi kargo hesabınız üzerinden otomatik takip kodu ve ZPL / PDF barkod etiketi üretilir.
        </p>
      </div>

      {/* Info Callout */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">%0 Kargo Komisyonu & Doğrudan Kendi Fiyatınız</h3>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Kargo firmasıyla yaptığınız özel desi ve fiyat anlaşmaları tamamen sizde kalır. tampazar.com kargo bedelinden 1 kuruş bile kesinti yapmaz.
          </p>
        </div>
        <button
          onClick={() => setActiveCarrierForm(true)}
          className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-colors shrink-0 flex items-center gap-2 cursor-pointer shadow"
        >
          <Plus className="w-4 h-4" /> Kargo Anlaşması Tanımla
        </button>
      </div>

      {/* Carrier Configuration Modal / Section */}
      {activeCarrierForm && (
        <div className="bg-white border-2 border-indigo-100 rounded-2xl p-6 shadow-lg space-y-4 animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-indigo-600" /> Yeni Kargo Anlaşması Bağla
            </h3>
            <button onClick={() => setActiveCarrierForm(false)} className="text-xs text-slate-400 hover:text-slate-600">İptal</button>
          </div>

          <form onSubmit={handleSaveCarrier} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Kargo Firması</label>
              <select 
                value={newCarrier}
                onChange={(e) => setNewCarrier(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none"
              >
                <option value="yurtici">Yurtiçi Kargo (Self-Service API)</option>
                <option value="aras">Aras Kargo (Entegrasyon Servisi)</option>
                <option value="mng">MNG Kargo (Barkodlu Gönderi)</option>
                <option value="surat">Sürat Kargo (Web Servis)</option>
                <option value="ptt">PTT Kargo (Kamu Anlaşması)</option>
                <option value="hepsijet">HepsiJet (Hızlı Teslimat)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Anlaşma Müşteri / Cari Kodu</label>
              <input 
                type="text" 
                required
                value={customerCode}
                onChange={(e) => setCustomerCode(e.target.value)}
                placeholder="Örn: YK-84920194"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Kargo API Kullanıcı Adı</label>
              <input 
                type="text" 
                required
                value={apiUsername}
                onChange={(e) => setApiUsername(e.target.value)}
                placeholder="Örn: firma_kargo_user"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Kargo API Şifresi / Secret Key</label>
              <input 
                type="password" 
                required
                value={apiSecretKey}
                onChange={(e) => setApiSecretKey(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Anlaşmalı Ortalama Desi Fiyatınız (₺)</label>
              <input 
                type="number" 
                step="0.5"
                value={desiPrice}
                onChange={(e) => setDesiPrice(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono outline-none"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl transition-colors shadow"
              >
                Kargo Anlaşmasını Kaydet ve Aktif Et
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Connected Carriers Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {carriers.map((car) => (
          <div key={car.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-indigo-600" />
                  {car.carrier.toUpperCase()} Kargo
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${car.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
                  {car.isActive ? 'Aktif Kargo' : 'Pasif'}
                </span>
              </div>
              <div className="text-xs space-y-1 text-slate-600 font-mono">
                <div>Cari Kod: <strong className="text-slate-900">{car.customerCode}</strong></div>
                <div>Desi Bedeli: <strong>{car.contractPricePerDesi} ₺ / desi</strong></div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center text-xs">
              <button 
                onClick={() => handleToggleCarrier(car.id)}
                className="font-semibold text-indigo-600 hover:underline cursor-pointer"
              >
                {car.isActive ? 'Devre Dışı Bırak' : 'Aktif Kargo Yap'}
              </button>
              <span className="text-[10px] text-slate-400 font-mono">Doğrudan API</span>
            </div>
          </div>
        ))}
      </div>

      {/* Active Shipments & Barcode Printing Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Barcode className="w-5 h-5 text-indigo-900" /> Sevk Edilecek Kargo Paketleri & Barkodlar
            </h3>
            <p className="text-xs text-slate-500">Müşteri siparişleriniz için tek tıkla kargo fişi ve ZPL/PDF barkod çıktısı alın.</p>
          </div>
          <button
            onClick={handleCreateShipment}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Test Sevk Emri Oluştur
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="p-4">Sipariş No & Tarih</th>
                <th className="p-4">Alıcı & Şehir</th>
                <th className="p-4">İçerik & Desi</th>
                <th className="p-4">Kargo & Takip No</th>
                <th className="p-4">Durum</th>
                <th className="p-4 text-right">Kargo Barkodu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {shipments.map((shp) => (
                <tr key={shp.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-slate-900 block">{shp.orderNumber}</span>
                    <span className="text-[10px] text-slate-400">{shp.date}</span>
                  </td>
                  <td className="p-4 font-sans">
                    <span className="font-bold text-slate-800 block">{shp.recipientName}</span>
                    <span className="text-[11px] text-slate-500">{shp.destinationCity}</span>
                  </td>
                  <td className="p-4 font-sans">
                    <span className="text-slate-800 block">{shp.itemsSummary}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{shp.desi} Desi</span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-indigo-900 uppercase block">{shp.carrier}</span>
                    <span className="text-[11px] text-slate-600 select-all">{shp.trackingNumber}</span>
                  </td>
                  <td className="p-4 font-sans">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      shp.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                      shp.status === 'in_transit' ? 'bg-sky-50 text-sky-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {shp.status === 'delivered' ? '✓ Teslim Edildi' :
                       shp.status === 'in_transit' ? '🚚 Yolda / Şubede' : '📦 Hazırlanıyor'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedLabel(shp)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs flex items-center gap-1.5 ml-auto transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-indigo-600" /> Barkod Bas (PDF)
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Printable Barcode Label Modal */}
      {selectedLabel && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-300">
            
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center text-xs">
              <span className="font-bold flex items-center gap-1.5">
                <Barcode className="w-4 h-4 text-amber-400" /> Kargo Sevk Barkodu (ZPL / PDF)
              </span>
              <button onClick={() => setSelectedLabel(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {/* Label Visual Canvas */}
            <div className="p-6 space-y-4 bg-white">
              <div className="border-2 border-black p-4 space-y-3 font-mono text-xs">
                
                <div className="flex justify-between border-b border-black pb-2 items-center">
                  <div>
                    <span className="text-[10px] text-slate-500 block">GÖNDERİCİ:</span>
                    <strong className="text-sm font-sans">{currentTenant.name}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black uppercase text-black">{selectedLabel.carrier}</span>
                  </div>
                </div>

                <div className="border-b border-black pb-2">
                  <span className="text-[10px] text-slate-500 block">ALICI:</span>
                  <div className="font-bold text-sm font-sans">{selectedLabel.recipientName}</div>
                  <div className="text-xs font-sans text-slate-700">{selectedLabel.recipientPhone}</div>
                  <div className="text-xs font-sans text-slate-700">{selectedLabel.destinationCity}</div>
                </div>

                <div className="flex justify-between text-[11px] border-b border-black pb-2">
                  <span>Sipariş: <strong>{selectedLabel.orderNumber}</strong></span>
                  <span>Desi: <strong>{selectedLabel.desi}</strong></span>
                  <span>Tarih: <strong>{selectedLabel.date}</strong></span>
                </div>

                {/* Visual Simulated Barcode */}
                <div className="text-center pt-2 space-y-1">
                  <div className="h-14 w-full bg-[repeating-linear-gradient(90deg,#000,#000_2px,#fff_2px,#fff_4px,#000_4px,#000_7px,#fff_7px,#fff_9px)]" />
                  <div className="text-sm font-bold tracking-widest">{selectedLabel.barcode}</div>
                  <div className="text-[10px] text-slate-500">Takip No: {selectedLabel.trackingNumber}</div>
                </div>

              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => alert(`Barkod Yazıcıya Gönderildi (ZPL/PDF): ${selectedLabel.barcode}`)}
                  className="flex-1 py-3 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow"
                >
                  <Printer className="w-4 h-4" /> Yazıcıya Gönder (ZPL / Termal)
                </button>
                <button
                  onClick={() => setSelectedLabel(null)}
                  className="px-4 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Kapat
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
