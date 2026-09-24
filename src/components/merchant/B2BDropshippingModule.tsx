/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Layers, Package, Truck, ShieldCheck, Store, Building2,
  DollarSign, CheckCircle2, Clock, Printer, ExternalLink,
  Plus, Edit2, Trash2, ArrowUpRight, Search, Filter, AlertCircle,
  FileText, Sparkles, ChevronRight, Check
} from 'lucide-react';
import { 
  B2BWholesaleOrder, DropshipOrder, DropshippedProductMapping,
  getStoredB2BOrders, saveStoredB2BOrders,
  getStoredDropshipOrders, saveStoredDropshipOrders,
  getStoredDropshippedProducts, saveStoredDropshippedProducts
} from '../../data/b2bDropshipData';
import { Product } from '../../data/mockData';

interface B2BDropshippingModuleProps {
  currentStoreName: string;
  storeId?: string;
  onOpenNewProductModal?: () => void;
}

type SubTab = 'gelen_toptan' | 'dropship_siparisler' | 'vitrinime_cektiklerim' | 'b2b_katalog';

export default function B2BDropshippingModule({
  currentStoreName,
  storeId = 's3',
  onOpenNewProductModal
}: B2BDropshippingModuleProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('gelen_toptan');

  // Orders State
  const [b2bOrders, setB2bOrders] = useState<B2BWholesaleOrder[]>(getStoredB2BOrders);
  const [dropshipOrders, setDropshipOrders] = useState<DropshipOrder[]>(getStoredDropshipOrders);
  const [dropshippedProducts, setDropshippedProducts] = useState<DropshippedProductMapping[]>(getStoredDropshippedProducts);

  // Selected Order for Modal / Print
  const [selectedB2BOrder, setSelectedB2BOrder] = useState<B2BWholesaleOrder | null>(null);
  const [selectedDropshipLabel, setSelectedDropshipLabel] = useState<DropshipOrder | null>(null);

  // Toast notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Update B2B Order Status
  const handleUpdateB2BStatus = (orderId: string, newStatus: B2BWholesaleOrder['status']) => {
    const updated = b2bOrders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: newStatus,
          despatchNo: o.despatchNo || 'IRS-2026-' + Math.floor(10000 + Math.random() * 90000),
          trackingNo: o.trackingNo || 'YK-PLT-' + Math.floor(100000 + Math.random() * 900000)
        };
      }
      return o;
    });
    setB2bOrders(updated);
    saveStoredB2BOrders(updated);
    showToast(`B2B Sipariş durumu "${newStatus}" olarak güncellendi!`);
  };

  // Update Dropship Order Status
  const handleUpdateDropshipStatus = (orderId: string, newStatus: DropshipOrder['status']) => {
    const updated = dropshipOrders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: newStatus,
          trackingNumber: o.trackingNumber || 'DSP-MNG-' + Math.floor(100000 + Math.random() * 900000)
        };
      }
      return o;
    });
    setDropshipOrders(updated);
    saveStoredDropshipOrders(updated);
    showToast(`Dropship sipariş durumu "${newStatus}" olarak güncellendi!`);
  };

  // Simulate incoming test dropship order
  const handleSimulateDropshipOrder = () => {
    const newDS: DropshipOrder = {
      id: 'ds-' + Date.now(),
      orderNo: 'DSP-2026-' + Math.floor(1000 + Math.random() * 9000),
      consumerName: 'Burak Sergen',
      consumerAddress: 'Bağdat Cad. No:242 Kat:3 Daire:8',
      consumerCity: 'İstanbul / Kadıköy',
      consumerPhone: '0533 111 22 44',
      retailerTenantId: storeId,
      retailerStoreName: currentStoreName,
      wholesalerTenantId: 's2',
      wholesalerStoreName: 'Merter Toptan Tekstil & Konfeksiyon San.',
      productId: 'prod-b2b-01',
      productTitle: 'Oversize 3 İplik Şardonlu Sweatshirt (Güngören İmalatı)',
      productImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
      quantity: 1,
      wholesalePrice: 280,
      retailPrice: 650,
      retailerProfit: 370,
      status: 'YENI_SIPARIS',
      carrier: 'Yurtiçi Kargo (Beyaz Etiket)',
      trackingNumber: 'YK-DSP-' + Math.floor(100000 + Math.random() * 900000),
      orderDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      whiteLabelCode: 'WL-' + storeId.toUpperCase() + '-' + Math.floor(100 + Math.random() * 899)
    };

    const updated = [newDS, ...dropshipOrders];
    setDropshipOrders(updated);
    saveStoredDropshipOrders(updated);
    showToast(`🎉 Müşteri siparişi simüle edildi! Üretici paneline dropshipping sevkiyat emri düştü.`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* TOAST */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 text-xs font-bold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* HEADER BANNER */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-indigo-900/50 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-black uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            Faire & Spocket Modeli
          </div>
          <h2 className="text-2xl font-black text-white">
            B2B Toptan Ticaret & Esnaftan Esnafa Dropshipping Merkezi
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Diğer esnaflardan gelen toptan koli/seri siparişlerini yönetin, müşterilerinize sıfır stokla dropshipping yaptığınız ürünleri takip edin.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 relative z-10 shrink-0">
          <button
            onClick={handleSimulateDropshipOrder}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-400/30 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            Örnek Dropship Siparişi Simüle Et
          </button>

          <a
            href="/toptan"
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <Store className="w-4 h-4" />
            B2B Toptan Vitrini Gör
          </a>
        </div>
      </div>

      {/* SUB-TABS NAVIGATION */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl px-4 overflow-x-auto gap-2 shadow-xs">
        <button
          onClick={() => setActiveSubTab('gelen_toptan')}
          className={`py-3.5 px-4 text-xs font-black border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'gelen_toptan'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Gelen Toptan Siparişler</span>
          <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded-full">
            {b2bOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('dropship_siparisler')}
          className={`py-3.5 px-4 text-xs font-black border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'dropship_siparisler'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Truck className="w-4 h-4 text-emerald-600" />
          <span>Toptancımdan Gelenler (Dropshipping)</span>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded-full">
            {dropshipOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('vitrinime_cektiklerim')}
          className={`py-3.5 px-4 text-xs font-black border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'vitrinime_cektiklerim'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4 text-amber-500" />
          <span>Vitrinime Çektiklerim (İthal Ürünlerim)</span>
          <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded-full">
            {dropshippedProducts.length}
          </span>
        </button>
      </div>

      {/* 1. SUB-TAB: GELEN TOPTAN SİPARİŞLER */}
      {activeSubTab === 'gelen_toptan' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5 sm:p-6 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Gelen B2B Toptan Siparişler & Cari Sevk Talepleri
              </h3>
              <p className="text-xs text-slate-500">
                Diğer mağazaların sizden seri, koli veya çuval bazında satın aldığı toptan siparişler
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              GİB e-İrsaliye Entegre
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-black text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Sipariş No & Tarih</th>
                  <th className="py-3 px-4">Alıcı Esnaf & Şehir</th>
                  <th className="py-3 px-4">Toptan Ürün</th>
                  <th className="py-3 px-4">Paket & Adet</th>
                  <th className="py-3 px-4">Toplam Tutar</th>
                  <th className="py-3 px-4">Ödeme Vadesi</th>
                  <th className="py-3 px-4">Durum</th>
                  <th className="py-3 px-4 text-right">Aksiyon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {b2bOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-900 block">{ord.orderNo}</span>
                      <span className="text-[10px] text-slate-400">{ord.orderDate}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 block">{ord.buyerStoreName}</span>
                        <span className="text-[10px] text-slate-500 block">{ord.buyerCity}</span>
                        <span className="text-[10px] text-slate-400 font-mono">VKN: {ord.buyerTaxNo}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={ord.productImage}
                          alt={ord.productTitle}
                          className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200"
                        />
                        <span className="font-bold text-slate-800 line-clamp-2">{ord.productTitle}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-black text-slate-900 block">
                        {ord.quantity} {ord.unitType.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        ({ord.totalUnitsCount} birim asorti)
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-black text-indigo-700 text-sm block">
                        ₺{ord.totalAmount.toLocaleString('tr-TR')}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Birim: ₺{ord.unitPrice.toLocaleString('tr-TR')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {ord.paymentTerms === 'CARI_HESAP_30_GUN' ? '30 Gün Cari' : ord.paymentTerms === 'PESIN_HAVALE' ? 'Peşin Havale' : 'Sanal POS'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                        ord.status === 'TEKLIF_BEKLIYOR' ? 'bg-amber-100 text-amber-800' :
                        ord.status === 'ONAYLANDI' ? 'bg-blue-100 text-blue-800' :
                        ord.status === 'SEVKIYATTA' ? 'bg-purple-100 text-purple-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {ord.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {ord.status === 'TEKLIF_BEKLIYOR' && (
                          <button
                            onClick={() => handleUpdateB2BStatus(ord.id, 'ONAYLANDI')}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs"
                          >
                            Onayla
                          </button>
                        )}
                        {ord.status === 'ONAYLANDI' && (
                          <button
                            onClick={() => handleUpdateB2BStatus(ord.id, 'SEVKIYATTA')}
                            className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs flex items-center gap-1"
                          >
                            <Truck className="w-3 h-3" /> Sevk Et
                          </button>
                        )}
                        {ord.status === 'SEVKIYATTA' && (
                          <button
                            onClick={() => handleUpdateB2BStatus(ord.id, 'TESLIM_EDILDI')}
                            className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs"
                          >
                            Teslim Edildi
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedB2BOrder(ord)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg cursor-pointer"
                          title="İrsaliye & Detay"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. SUB-TAB: DROPSHIPPING SİPARİŞLERİ */}
      {activeSubTab === 'dropship_siparisler' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5 sm:p-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-600" />
                Dropshipping Siparişleri (Toptancı İmalatçı Paneli)
              </h3>
              <p className="text-xs text-slate-500">
                Perakendeci mağazaların son tüketiciye sattığı ve sizin "Beyaz Etiket" ile göndereceğiniz paketler
              </p>
            </div>
            <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Beyaz Etiket: Toptancı adınız gizli kalır</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-black text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Sipariş No</th>
                  <th className="py-3 px-4">Satıcı (Etikete Basılacak)</th>
                  <th className="py-3 px-4">Teslim Alacak Müşteri</th>
                  <th className="py-3 px-4">Ürün</th>
                  <th className="py-3 px-4">Toptan Hakediş</th>
                  <th className="py-3 px-4">Kargo & Takip</th>
                  <th className="py-3 px-4">Durum</th>
                  <th className="py-3 px-4 text-right">Etiket / Aksiyon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {dropshipOrders.map((ds) => (
                  <tr key={ds.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-900 block">{ds.orderNo}</span>
                      <span className="text-[10px] text-slate-400">{ds.orderDate}</span>
                      <span className="text-[10px] font-mono text-emerald-600 font-bold">{ds.whiteLabelCode}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="font-black text-indigo-700 block">{ds.retailerStoreName}</span>
                        <span className="text-[10px] text-slate-400 block">Gönderici Etiketi</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 block">{ds.consumerName}</span>
                        <span className="text-[10px] text-slate-500 block truncate max-w-[140px]">{ds.consumerCity}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{ds.consumerPhone}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={ds.productImage}
                          alt={ds.productTitle}
                          className="w-9 h-9 rounded-xl object-cover shrink-0 border border-slate-200"
                        />
                        <div className="truncate">
                          <span className="font-bold text-slate-800 truncate block">{ds.productTitle}</span>
                          <span className="text-[10px] text-slate-500">{ds.quantity} Adet</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-black text-emerald-700 text-sm block">
                        ₺{ds.wholesalePrice.toLocaleString('tr-TR')}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        (Müşteri Satış: ₺{ds.retailPrice.toLocaleString('tr-TR')})
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block text-[11px]">{ds.carrier}</span>
                      <span className="text-[10px] font-mono text-slate-400">{ds.trackingNumber}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        ds.status === 'YENI_SIPARIS' ? 'bg-amber-100 text-amber-800' :
                        ds.status === 'HAZIRLANIYOR' ? 'bg-blue-100 text-blue-800' :
                        ds.status === 'KARGODA' ? 'bg-purple-100 text-purple-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {ds.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {ds.status === 'YENI_SIPARIS' && (
                          <button
                            onClick={() => handleUpdateDropshipStatus(ds.id, 'HAZIRLANIYOR')}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs"
                          >
                            Paketle
                          </button>
                        )}
                        {ds.status === 'HAZIRLANIYOR' && (
                          <button
                            onClick={() => handleUpdateDropshipStatus(ds.id, 'KARGODA')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs flex items-center gap-1"
                          >
                            <Truck className="w-3 h-3" /> Kargola
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedDropshipLabel(ds)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs cursor-pointer flex items-center gap-1"
                          title="Beyaz Etiket Yazdır"
                        >
                          <Printer className="w-3 h-3 text-slate-600" />
                          <span>Etiket</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. SUB-TAB: VİTRİNİME ÇEKTİKLERİM (DROPSHIPPING İTHALATLARIM) */}
      {activeSubTab === 'vitrinime_cektiklerim' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5 sm:p-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Store className="w-5 h-5 text-amber-500" />
                Vitrinime Çektiklerim (Esnaftan Esnafa Dropshipping Ürünlerim)
              </h3>
              <p className="text-xs text-slate-500">
                Diğer toptancılardan tek tıkla kendi mağazanıza eklediğiniz, sıfır stok maliyetiyle sattığınız ürünler
              </p>
            </div>
            <a
              href="/toptan"
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 w-fit"
            >
              <Plus className="w-3.5 h-3.5" />
              Toptan Kataloğundan Yeni Ürün Ekle
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dropshippedProducts.map((p) => (
              <div
                key={p.id}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={p.productImage}
                    alt={p.productTitle}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      Tedarikçi: {p.originalWholesalerName}
                    </span>
                    <h4 className="text-xs font-black text-slate-900 line-clamp-1">{p.productTitle}</h4>
                    <span className="text-[10px] text-slate-400 block font-mono">Eklenme: {p.addedAt}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Toptan Maliyet:</span>
                    <span className="font-bold text-slate-700">₺{p.wholesaleCost.toLocaleString('tr-TR')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Vitrin Fiyatınız:</span>
                    <span className="font-black text-slate-900">₺{p.myRetailPrice.toLocaleString('tr-TR')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Net Kârınız:</span>
                    <span className="font-black text-emerald-600">+₺{p.myProfitMarginTL.toLocaleString('tr-TR')} (%{p.myProfitMarginPercent})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-bold text-slate-600">
                    Toplam Satış: <strong>{p.salesCount} adet</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {p.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: BEYAZ ETİKET KARGO ETİKETİ ÖNİZLEME (WHITE LABEL BLIND SHIPPING) */}
      {selectedDropshipLabel && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Beyaz Etiket Dropshipping Kargo Barkodu
                </span>
                <h3 className="text-sm font-black text-slate-900 mt-1">
                  {selectedDropshipLabel.orderNo}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDropshipLabel(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* FİZİKSEL ETİKET ŞABLONU */}
            <div className="border-2 border-dashed border-slate-300 p-4 rounded-2xl bg-slate-50 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-black text-slate-900">{selectedDropshipLabel.carrier}</span>
                <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded font-bold">KOLİ SEVK</span>
              </div>

              {/* GÖNDERİCİ: PERAKENDECİ ESNAF ADI */}
              <div className="space-y-0.5 bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-[9px] uppercase font-black text-indigo-700 block">GÖNDERİCİ (MAĞAZA):</span>
                <p className="font-black text-slate-900">{selectedDropshipLabel.retailerStoreName}</p>
                <p className="text-[10px] text-slate-500">TamPazar Tescilli Perakendeci Esnafı</p>
                <p className="text-[9px] text-slate-400">Beyaz Etiket Kodu: {selectedDropshipLabel.whiteLabelCode}</p>
              </div>

              {/* ALICI: SON TÜKETİCİ */}
              <div className="space-y-0.5 bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-[9px] uppercase font-black text-emerald-700 block">ALICI (MÜŞTERİ):</span>
                <p className="font-black text-slate-900">{selectedDropshipLabel.consumerName}</p>
                <p className="text-[10px] text-slate-700">{selectedDropshipLabel.consumerAddress}</p>
                <p className="text-[10px] font-bold text-slate-900">{selectedDropshipLabel.consumerCity}</p>
                <p className="text-[10px] text-slate-500">Tel: {selectedDropshipLabel.consumerPhone}</p>
              </div>

              {/* BARKOD ÇİZGİLERİ */}
              <div className="pt-2 text-center space-y-1">
                <div className="h-10 bg-slate-900 rounded flex items-center justify-center text-white text-[10px] font-mono tracking-widest font-black">
                  ||||| | |||| |||||| | ||||| |||| |
                </div>
                <span className="text-[10px] text-slate-500 block font-mono font-bold">
                  {selectedDropshipLabel.trackingNumber}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSelectedDropshipLabel(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Kapat
              </button>
              <button
                onClick={() => {
                  showToast('Kargo etiketi termal yazıcıya gönderildi!');
                  setSelectedDropshipLabel(null);
                }}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl cursor-pointer shadow-md flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Yazdır (Termal)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: B2B TOPTAN İRSALİYE DETAYI */}
      {selectedB2BOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                  GİB e-İrsaliye & Sevk Belgesi
                </span>
                <h3 className="text-sm font-black text-slate-900 mt-1">
                  {selectedB2BOrder.orderNo}
                </h3>
              </div>
              <button
                onClick={() => setSelectedB2BOrder(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">İrsaliye No:</span>
                <span className="font-mono font-bold text-slate-900">{selectedB2BOrder.despatchNo || 'IRS-2026-99014'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Alıcı Mağaza:</span>
                <span className="font-bold text-slate-900">{selectedB2BOrder.buyerStoreName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Alıcı Şehir & VKN:</span>
                <span className="font-bold text-slate-700">{selectedB2BOrder.buyerCity} (VKN: {selectedB2BOrder.buyerTaxNo})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Miktar & Paket:</span>
                <span className="font-black text-indigo-700">{selectedB2BOrder.quantity} {selectedB2BOrder.unitType.toUpperCase()} ({selectedB2BOrder.totalUnitsCount} Adet)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Ödeme Koşulu:</span>
                <span className="font-bold text-slate-800">{selectedB2BOrder.paymentTerms}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm">
                <span className="font-black text-slate-900">Toplam Fatura Tutarı:</span>
                <span className="font-black text-emerald-600 text-base">₺{selectedB2BOrder.totalAmount.toLocaleString('tr-TR')}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSelectedB2BOrder(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Kapat
              </button>
              <button
                onClick={() => {
                  showToast('e-İrsaliye PDF formatında hazırlandı!');
                  setSelectedB2BOrder(null);
                }}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl cursor-pointer shadow-md flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                İrsaliye Yazdır (GİB)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
