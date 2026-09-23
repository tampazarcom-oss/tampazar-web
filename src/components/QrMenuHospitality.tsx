/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  QrCode, Utensils, Smartphone, CheckCircle2, ShieldCheck, 
  Printer, Plus, Users, Bell, DollarSign, ChefHat, Sparkles, ArrowRight, X
} from 'lucide-react';
import { Tenant } from '../data/mockData';

interface QrMenuHospitalityProps {
  currentTenant: Tenant;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'ana_yemek' | 'durum' | 'tatli' | 'icecek';
  price: number;
  description: string;
  image: string;
  available: boolean;
}

export interface TableOrder {
  id: string;
  tableNumber: number;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: 'ordered' | 'preparing' | 'served' | 'paid';
  time: string;
  paymentMethod: 'BYO Sanal POS (Masa QR)' | 'Nakit / Kasada';
}

export const INITIAL_MENU: MenuItem[] = [
  {
    id: 'm1',
    name: 'Tarihi Yaprak Et Döner Porsiyon',
    category: 'ana_yemek',
    price: 280,
    description: 'Özel marine edilmiş Karadeniz yayla eti, tırnak pide, ızgara biber ve domates ile',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'm2',
    name: 'Tombik Ekmek Döner Menü',
    category: 'durum',
    price: 210,
    description: 'Taş fırın tombik ekmek, patates kızartması ve yayık ayranı ile',
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'm3',
    name: 'Fırın Sütlaç (Hamsiköy Usulü)',
    category: 'tatli',
    price: 95,
    description: 'Doğal fındıklı, fırınlanmış geleneksel sütlaç',
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400&auto=format&fit=crop&q=80',
    available: true,
  },
  {
    id: 'm4',
    name: 'Köy Yayık Ayranı (Köpüklü)',
    category: 'icecek',
    price: 40,
    description: 'Doğal yoğurttan taze çırpılmış yayık ayranı',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&auto=format&fit=crop&q=80',
    available: true,
  }
];

export const INITIAL_TABLE_ORDERS: TableOrder[] = [
  {
    id: 'ord-t4',
    tableNumber: 4,
    items: [
      { name: 'Tarihi Yaprak Et Döner Porsiyon', qty: 2, price: 280 },
      { name: 'Köy Yayık Ayranı (Köpüklü)', qty: 2, price: 40 }
    ],
    total: 640,
    status: 'preparing',
    time: '12:42',
    paymentMethod: 'BYO Sanal POS (Masa QR)'
  },
  {
    id: 'ord-t7',
    tableNumber: 7,
    items: [
      { name: 'Tombik Ekmek Döner Menü', qty: 1, price: 210 },
      { name: 'Fırın Sütlaç (Hamsiköy Usulü)', qty: 1, price: 95 }
    ],
    total: 305,
    status: 'ordered',
    time: '12:51',
    paymentMethod: 'BYO Sanal POS (Masa QR)'
  }
];

export default function QrMenuHospitality({ currentTenant }: QrMenuHospitalityProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('tampazar_qr_menu_' + currentTenant.id);
    return saved ? JSON.parse(saved) : INITIAL_MENU;
  });

  const [tableOrders, setTableOrders] = useState<TableOrder[]>(() => {
    const saved = localStorage.getItem('tampazar_qr_orders_' + currentTenant.id);
    return saved ? JSON.parse(saved) : INITIAL_TABLE_ORDERS;
  });

  const [selectedTableForQr, setSelectedTableForQr] = useState<number | null>(null);
  const [showSimulatedPhoneView, setShowSimulatedPhoneView] = useState(false);
  const [activeCustomerTable, setActiveCustomerTable] = useState(5);
  const [customerCart, setCustomerCart] = useState<{ [id: string]: number }>({});
  const [customerOrderPlaced, setCustomerOrderPlaced] = useState(false);

  // Table status advance
  const handleUpdateOrderStatus = (orderId: string, nextStatus: TableOrder['status']) => {
    const updated = tableOrders.map(o => o.id === orderId ? { ...o, status: nextStatus } : o);
    setTableOrders(updated);
    localStorage.setItem('tampazar_qr_orders_' + currentTenant.id, JSON.stringify(updated));

    // If paid, push to e-invoice queue automatically
    if (nextStatus === 'paid') {
      const order = tableOrders.find(o => o.id === orderId);
      if (order) {
        const savedInvoices = localStorage.getItem('tampazar_invoices');
        const invoices = savedInvoices ? JSON.parse(savedInvoices) : [];
        const vat = parseFloat((order.total * 0.10).toFixed(2));
        const clean = parseFloat((order.total - vat).toFixed(2));

        invoices.push({
          id: 'inv-qr-' + Date.now(),
          invoiceNumber: 'GIB2026000000' + Math.floor(100 + Math.random() * 899),
          orderId: `Masa-${order.tableNumber}-Adisyon`,
          tenantId: currentTenant.id,
          customerName: `Masa ${order.tableNumber} Misafiri`,
          customerTaxOffice: 'Altınordu VD',
          customerTaxId: '11111111111',
          customerEmail: 'masasiparis@tampazar.com',
          date: new Date().toISOString().split('T')[0],
          amount: clean,
          vatAmount: vat,
          withholdingTaxType: 'None',
          withholdingAmount: 0.00,
          totalPayable: order.total,
          status: 'queued',
          integrator: 'gib'
        });
        localStorage.setItem('tampazar_invoices', JSON.stringify(invoices));
        window.dispatchEvent(new Event('tampazar_accounting_updated'));
      }
    }
  };

  // Customer Phone simulation actions
  const handleAddToCart = (itemId: string) => {
    setCustomerCart(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCustomerCart(prev => {
      const copy = { ...prev };
      if (copy[itemId] > 1) copy[itemId] -= 1;
      else delete copy[itemId];
      return copy;
    });
  };

  const customerTotal = Object.entries(customerCart).reduce((sum, [id, qty]) => {
    const item = menuItems.find(m => m.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const handleCustomerPlaceOrderAndPay = () => {
    if (customerTotal === 0) return;

    const items = Object.entries(customerCart).map(([id, qty]) => {
      const item = menuItems.find(m => m.id === id)!;
      return { name: item.name, qty, price: item.price };
    });

    const newOrder: TableOrder = {
      id: 'ord-t' + activeCustomerTable + '-' + Date.now(),
      tableNumber: activeCustomerTable,
      items,
      total: customerTotal,
      status: 'ordered',
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      paymentMethod: 'BYO Sanal POS (Masa QR)'
    };

    const updated = [newOrder, ...tableOrders];
    setTableOrders(updated);
    localStorage.setItem('tampazar_qr_orders_' + currentTenant.id, JSON.stringify(updated));

    setCustomerOrderPlaced(true);
    setTimeout(() => {
      setCustomerCart({});
      setCustomerOrderPlaced(false);
      setShowSimulatedPhoneView(false);
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Header */}
      <div>
        <span className="text-xs font-mono text-amber-600 tracking-wider uppercase font-bold bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
          Restoran, Kafe & Gel-Al Garson Modülü
        </span>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 mt-2">
          QR Masa Menü, Masadan Kendi POS'uyla Ödeme & Anlık Adisyon
        </h2>
        <p className="text-slate-500 text-sm mt-1 max-w-3xl leading-relaxed">
          Yeme-içme işletmeleri her masaya özel dinamik QR kod basar. Müşteri masadan menüyü inceler, doğrudan sipariş verir ve esnafın kendi Sanal POS'u ile %0 komisyonla öder. Adisyon kapanınca otomatik e-Arşiv fatura fişi düzenlenir.
        </p>
      </div>

      {/* Action Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-amber-900/30">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">Garson Beklemeden Masadan Ödeme & Sipariş</h3>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Müşteri telefon kamerasıyla masadaki QR'ı okuttuğunda uygulama yüklemeden doğrudan dükkânınızın menüsü açılır.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setSelectedTableForQr(1)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors shrink-0 flex items-center gap-2 border border-slate-700 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-400" /> Masa QR Kodları Bas
          </button>
          <button
            onClick={() => setShowSimulatedPhoneView(true)}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-colors shrink-0 flex items-center gap-2 cursor-pointer shadow"
          >
            <Smartphone className="w-4 h-4" /> Müşteri QR Ekranını Simüle Et
          </button>
        </div>
      </div>

      {/* Active Table Live Orders (Kitchen & POS View) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Utensils className="w-5 h-5 text-amber-600" /> Canlı Mutfak & Masa Adisyon Ekranı
          </h3>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {tableOrders.filter(o => o.status !== 'paid').length} Aktif Masa Açık
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tableOrders.map((ord) => (
            <div 
              key={ord.id} 
              className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                ord.status === 'paid' ? 'border-slate-200 opacity-70' :
                ord.status === 'preparing' ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-indigo-400 ring-2 ring-indigo-400/20'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center">
                      M{ord.tableNumber}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Masa {ord.tableNumber}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">Sipariş Saati: {ord.time}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    ord.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                    ord.status === 'served' ? 'bg-sky-100 text-sky-800' :
                    ord.status === 'preparing' ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {ord.status === 'paid' ? '✓ Ödendi & Kapandı' :
                     ord.status === 'served' ? '🍽️ Servis Edildi' :
                     ord.status === 'preparing' ? '🔥 Mutfakta Hazırlanıyor' : '🛎️ Yeni Sipariş'}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 divide-y divide-slate-100 text-xs">
                  {ord.items.map((it, idx) => (
                    <div key={idx} className="py-1.5 flex justify-between">
                      <span className="font-medium text-slate-800">
                        {it.qty}x {it.name}
                      </span>
                      <span className="font-bold text-slate-900">
                        {(it.price * it.qty).toLocaleString('tr-TR')} ₺
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 flex justify-between font-black text-slate-900 text-sm">
                    <span>Toplam Adisyon:</span>
                    <span className="text-indigo-900">{ord.total.toLocaleString('tr-TR')} ₺</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between font-mono">
                  <span>Ödeme: <strong>{ord.paymentMethod}</strong></span>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex gap-2">
                {ord.status === 'ordered' && (
                  <button
                    onClick={() => handleUpdateOrderStatus(ord.id, 'preparing')}
                    className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Mutfağa İlet
                  </button>
                )}
                {ord.status === 'preparing' && (
                  <button
                    onClick={() => handleUpdateOrderStatus(ord.id, 'served')}
                    className="flex-1 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Masaya Servis Et
                  </button>
                )}
                {ord.status === 'served' && (
                  <button
                    onClick={() => handleUpdateOrderStatus(ord.id, 'paid')}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Adisyonu Kapat & Fatura Kes
                  </button>
                )}
                {ord.status === 'paid' && (
                  <div className="w-full text-center text-[11px] font-mono text-emerald-700 bg-emerald-50 py-1.5 rounded-lg border border-emerald-200">
                    GİB e-Arşiv Fişi Düzenlendi
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QR Code Printable Modal */}
      {selectedTableForQr && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-300 p-6 space-y-4 text-center">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Masa QR Kartviziti</h3>
              <button onClick={() => setSelectedTableForQr(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="border-4 border-slate-900 rounded-2xl p-6 bg-amber-50/50 space-y-3">
              <div className="font-bold text-sm text-slate-900 uppercase tracking-wider">{currentTenant.name}</div>
              <div className="text-xs text-slate-500">Masa Siparişi & Temassız Ödeme</div>
              
              {/* Visual simulated QR */}
              <div className="w-40 h-40 mx-auto bg-white p-3 border-2 border-slate-900 rounded-xl flex items-center justify-center shadow-inner">
                <QrCode className="w-32 h-32 text-slate-900" />
              </div>

              <div className="text-lg font-black text-slate-950">MASA {selectedTableForQr}</div>
              <p className="text-[10px] text-slate-600 font-mono">
                https://tampazar.com/m/{currentTenant.id}?t={selectedTableForQr}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => alert(`Masa ${selectedTableForQr} QR etiketi yazıcıya gönderildi.`)}
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow"
              >
                <Printer className="w-4 h-4" /> Masaya Yazdır
              </button>
              <button
                onClick={() => setSelectedTableForQr(null)}
                className="px-4 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Mobile Phone Simulator Modal */}
      {showSimulatedPhoneView && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 rounded-[40px] p-4 shadow-2xl border-4 border-slate-700 max-w-sm w-full">
            {/* Phone Screen Canvas */}
            <div className="bg-white rounded-[32px] overflow-hidden text-slate-900 flex flex-col h-[600px]">
              
              {/* Phone Status Bar */}
              <div className="bg-slate-950 text-white p-3 pt-4 text-[11px] flex justify-between items-center">
                <span>12:45</span>
                <span className="font-bold">Masa {activeCustomerTable} · {currentTenant.name}</span>
                <button onClick={() => setShowSimulatedPhoneView(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              {/* Menu Listing Header */}
              <div className="p-4 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-sm text-slate-900">Dijital QR Masa Menüsü</h4>
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Doğrudan Kendi Sanal POS'uyla Ödeme
                  </span>
                </div>
                <div className="text-xs font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                  Masa {activeCustomerTable}
                </div>
              </div>

              {/* Menu List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {customerOrderPlaced ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-bounce" />
                    <h5 className="font-black text-base text-emerald-950">Siparişiniz Alındı!</h5>
                    <p className="text-xs text-emerald-800">
                      Mutfak ekranına iletildi. Kendi POS'unuzdan {customerTotal} ₺ tahsilat onaylandı ve e-Arşiv faturanız hazırlandı.
                    </p>
                  </div>
                ) : (
                  menuItems.map((item) => (
                    <div key={item.id} className="border border-slate-200 rounded-xl p-3 flex gap-3 items-center">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-xs text-slate-900 truncate">{item.name}</h5>
                        <p className="text-[10px] text-slate-500 line-clamp-1">{item.description}</p>
                        <span className="text-xs font-black text-amber-600 block mt-1">{item.price} ₺</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {customerCart[item.id] ? (
                          <>
                            <button onClick={() => handleRemoveFromCart(item.id)} className="w-6 h-6 rounded-full bg-slate-100 font-bold text-xs">-</button>
                            <span className="text-xs font-bold">{customerCart[item.id]}</span>
                            <button onClick={() => handleAddToCart(item.id)} className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold text-xs">+</button>
                          </>
                        ) : (
                          <button 
                            onClick={() => handleAddToCart(item.id)}
                            className="px-2.5 py-1 bg-slate-900 text-white font-bold text-[10px] rounded-lg"
                          >
                            + Ekle
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Checkout Bar in Phone */}
              {!customerOrderPlaced && (
                <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs font-black">
                    <span>Masa Toplamı:</span>
                    <span className="text-indigo-950 text-sm">{customerTotal.toLocaleString('tr-TR')} ₺</span>
                  </div>
                  <button
                    disabled={customerTotal === 0}
                    onClick={handleCustomerPlaceOrderAndPay}
                    className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow ${
                      customerTotal > 0 ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 cursor-pointer' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span>Masadan Hemen Öde & Siparişi Gönder</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
