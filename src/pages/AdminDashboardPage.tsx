/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import DashboardLayout, { SidebarNavItem } from '../components/layouts/DashboardLayout';
import { 
  BarChart3, Store, Bike, Layers, MapPin, ShieldCheck, CheckCircle2, 
  XCircle, RefreshCw, CreditCard, Users, TrendingUp, Search, Filter, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('metrikler');
  const [searchTerm, setSearchTerm] = useState('');

  const navItems: SidebarNavItem[] = [
    { id: 'metrikler', label: 'Genel Platform Metrikleri', icon: BarChart3 },
    { id: 'abonelikler', label: 'PayTR Recurring Abonelikleri', icon: CreditCard, badge: '128 Aktif' },
    { id: 'onay-bekleyenler', label: 'Onay Bekleyen Dükkan & Kurye', icon: ShieldCheck, badge: '5 Bekliyor', badgeColor: 'bg-rose-500 text-white' },
    { id: 'kategori-yonetimi', label: 'Kategori & Etiket Yapılandırma', icon: Layers },
    { id: 'il-ilce-istatistik', label: '81 İl / İlçe Harita İstatistikleri', icon: MapPin }
  ];

  const pendingApprovals = [
    {
      id: 'APP-901',
      type: 'dükkan',
      name: 'Yıldız Fırın & Unlu Mamuller',
      owner: 'Kadir Yıldız',
      city: 'Ordu / Altınordu',
      taxId: '8201928301',
      date: 'Bugün 11:20',
      posPreference: 'PayTR (Doğrudan POS)'
    },
    {
      id: 'APP-902',
      type: 'kurye',
      name: 'Burak Keskin (Moto Kurye)',
      owner: 'Burak Keskin',
      city: 'Giresun / Merkez',
      taxId: '2910392810',
      date: 'Bugün 09:45',
      posPreference: 'Yaya / Motosiklet'
    },
    {
      id: 'APP-903',
      type: 'dükkan',
      name: 'Karadeniz Çay & Şarküteri',
      owner: 'Mustafa Çakır',
      city: 'Rize / Merkez',
      taxId: '5820192831',
      date: 'Dün 18:30',
      posPreference: 'iyzico (Kendi Sanal POS)'
    }
  ];

  const provinceStats = [
    { city: 'Ordu', activeShops: 342, activeCouriers: 48, totalVolume: '1,420,000 TL', growth: '+18%' },
    { city: 'Giresun', activeShops: 215, activeCouriers: 32, totalVolume: '980,000 TL', growth: '+12%' },
    { city: 'Trabzon', activeShops: 490, activeCouriers: 85, totalVolume: '2,850,000 TL', growth: '+24%' },
    { city: 'Samsun', activeShops: 610, activeCouriers: 110, totalVolume: '3,900,000 TL', growth: '+29%' },
    { city: 'Rize', activeShops: 180, activeCouriers: 28, totalVolume: '820,000 TL', growth: '+15%' }
  ];

  return (
    <DashboardLayout
      role="admin"
      title="Süper Admin Konsolu"
      subtitle="Platform Genel Yönetim ve PayTR Recurring Altyapısı"
      navItems={navItems}
      activeItemId={activeTab}
      onSelectNavItem={setActiveTab}
    >
      <div className="space-y-6">

        {/* Top Metric Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#F59E0B] font-bold">
                🛡️ Platform Genel Durumu
              </span>
              <h1 className="text-2xl font-black text-white mt-0.5">
                TamPazar Sistem Yönetimi
              </h1>
              <p className="text-xs text-slate-400">
                81 İl Geneli: <strong className="text-white">1,837 Aktif Dükkan</strong> · <strong className="text-emerald-400">303 Bağımsız Kurye</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
                ● PayTR Recurring Entegrasyonu Aktif
              </span>
            </div>
          </div>
        </div>

        {/* TAB 1: GENEL METRİKLER */}
        {activeTab === 'metrikler' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-md">
                <div className="text-xs font-bold text-slate-400">Toplam Kayıtlı Esnaf</div>
                <div className="text-3xl font-black text-[#F59E0B] mt-1">1,837</div>
                <div className="text-[11px] text-emerald-400 font-bold mt-1">▲ Bu Ay +142 Yeni Mağaza</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-md">
                <div className="text-xs font-bold text-slate-400">Aylık Platform Hasılatı (GMV)</div>
                <div className="text-3xl font-black text-emerald-400 mt-1">9.97 M TL</div>
                <div className="text-[11px] text-slate-400 mt-1">%0 Komisyon — Doğrudan Esnaf POS'u</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-md">
                <div className="text-xs font-bold text-slate-400">Aktif TamKurye Sürücüleri</div>
                <div className="text-3xl font-black text-cyan-400 mt-1">303</div>
                <div className="text-[11px] text-slate-400 mt-1">Harita Konumlu Canlı Saha</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-md">
                <div className="text-xs font-bold text-slate-400">Tüketicilere Kazandırılan Komisyon</div>
                <div className="text-3xl font-black text-amber-300 mt-1">1.49 M TL</div>
                <div className="text-[11px] text-amber-400/90 font-bold mt-1">Esnafın Cebinde Kalan Aracı Payı</div>
              </div>
            </div>

            {/* Recent Platform Log */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#F59E0B]" />
                Son Platform Hareketleri & Sistem Günlükleri
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center text-slate-300">
                  <span>[PAYTR RECURRING] FotoSentez Stüdyo 500 TL Sabit Aidat Yenilemesi Başarılı</span>
                  <span className="text-emerald-400 font-bold">Tamamlandı</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center text-slate-300">
                  <span>[GİB E-FATURA UBL-TR 2.1] 14 Yeni Esnaf e-Fatura Belge Motorunu Aktifleştirdi</span>
                  <span className="text-cyan-400 font-bold">Otomatik</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PAYTR RECURRING ABONELİKLERİ */}
        {activeTab === 'abonelikler' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#F59E0B]" />
                  PayTR Recurring Sabit Aidat Abonelik Yönetimi
                </h2>
                <p className="text-xs text-slate-400">
                  Esnafların aylık sabit platform kullanım ücretleri (%0 komisyon karşılığı 500 TL/ay).
                </p>
              </div>
              <span className="text-xs font-bold bg-amber-400/20 text-[#F59E0B] px-3 py-1 rounded-full border border-amber-400/30">
                Aylık Düzenli Gelir (MRR): 918,500 TL
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Mağaza Adı</th>
                    <th className="p-3">Sektör</th>
                    <th className="p-3">Abonelik Planı</th>
                    <th className="p-3">PayTR Token</th>
                    <th className="p-3">Sonraki Çekim</th>
                    <th className="p-3">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium">
                  <tr>
                    <td className="p-3 font-bold text-white">FotoSentez Stüdyo</td>
                    <td className="p-3 text-slate-400">Medya & Fotoğraf</td>
                    <td className="p-3 text-amber-400 font-bold">Starter (500 TL/Ay)</td>
                    <td className="p-3 font-mono text-[10px]">paytr_tok_819203912</td>
                    <td className="p-3">14 Ekim 2026</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">Aktif</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">Karadeniz Butik</td>
                    <td className="p-3 text-slate-400">Giyim & Deri</td>
                    <td className="p-3 text-amber-400 font-bold">Starter (500 TL/Ay)</td>
                    <td className="p-3 font-mono text-[10px]">paytr_tok_928102931</td>
                    <td className="p-3">18 Ekim 2026</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">Aktif</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ONAY BEKLEYENLER */}
        {activeTab === 'onay-bekleyenler' && (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              Onay Bekleyen Mağaza ve TamKurye Başvuruları
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pendingApprovals.map((app) => (
                <div key={app.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded">
                      {app.id}
                    </span>
                    <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300">
                      {app.type}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-sm">{app.name}</h3>
                    <div className="text-xs text-slate-400 mt-0.5">{app.owner} · {app.city}</div>
                    <div className="text-[11px] font-mono text-slate-500 mt-1">Vergi/TC No: {app.taxId}</div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex gap-2">
                    <button 
                      onClick={() => alert(`${app.name} onaylandı.`)}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Onayla
                    </button>
                    <button 
                      onClick={() => alert(`${app.name} reddedildi.`)}
                      className="py-2 px-3 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: KATEGORİ YÖNETİMİ */}
        {activeTab === 'kategori-yonetimi' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              Pazaryeri Ana ve Alt Kategori Hiyerarşisi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <strong className="text-amber-400 block font-bold">1. Mahalle & Hızlı Tüketim</strong>
                <span className="text-slate-400 text-[11px]">Kasap, Manav, Fırın, Su, Mandıra</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <strong className="text-amber-400 block font-bold">2. Hizmet & Ustalık & Bakım</strong>
                <span className="text-slate-400 text-[11px]">Sıhhi Tesisat, Kombi, Elektrikçi, Temizlik</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: 81 İL İSTATİSTİKLERİ */}
        {activeTab === 'il-ilce-istatistik' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-400" />
              81 İl / İlçe Bölgesel Performans Verileri
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {provinceStats.map((st, i) => (
                <div key={i} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <strong className="text-white font-black text-sm">{st.city}</strong>
                    <span className="text-xs font-bold text-emerald-400">{st.growth}</span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-0.5">
                    <div>Aktif Esnaf: <strong className="text-white">{st.activeShops} Dükkan</strong></div>
                    <div>Aktif Kurye: <strong className="text-white">{st.activeCouriers} Sürücü</strong></div>
                    <div>Aylık Hasılat: <strong className="text-amber-400">{st.totalVolume}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
