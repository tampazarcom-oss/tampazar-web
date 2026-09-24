/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import DashboardLayout, { SidebarNavItem } from '../components/layouts/DashboardLayout';
import { 
  Bike, Navigation, DollarSign, Radio, CheckCircle, Clock, MapPin, 
  Store, User, ShieldCheck, AlertCircle, Phone, ArrowUpRight, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CourierDashboardPage() {
  const { user, updateCourierStatus } = useAuth();
  const [activeTab, setActiveTab] = useState('gorev-havuzu');
  const [isAvailable, setIsAvailable] = useState(user?.courierStatus === 'available');

  const navItems: SidebarNavItem[] = [
    { id: 'gorev-havuzu', label: 'Canlı Görev Havuzu', icon: Bike, badge: '4 Aktif' },
    { id: 'rota-radar', label: 'Rota Birleştirici Radar', icon: Navigation, badge: 'Canlı' },
    { id: 'kazanc-takibi', label: 'Kazanç Takibi & Hasılat', icon: DollarSign },
    { id: 'ayarlar', label: 'Motosiklet & Fiyat Listem', icon: ShieldCheck }
  ];

  const mockTasks = [
    {
      id: 'TASK-101',
      merchantName: 'FotoSentez Stüdyo & Baskı',
      merchantAddress: 'Akyazı Mah. Atatürk Bulvarı No:42',
      customerName: 'Zeynep Aksoy',
      customerAddress: 'Bahçelievler Mah. 102. Sok No:8 D:4',
      itemsCount: '1 Paket (Fotoğraf Albümü + Tablo)',
      deliveryFee: '120 TL',
      distance: '2.4 km',
      estimatedTime: '18 Dk',
      urgency: 'Acil'
    },
    {
      id: 'TASK-102',
      merchantName: 'Akyazı Şarküteri & Kasap',
      merchantAddress: 'Subaşı Mah. Çarşı İçi No:15',
      customerName: 'Mehmet Demir',
      customerAddress: 'Yeni Mah. Lale Sokak No:19',
      itemsCount: '2 Poşet (Taze Et & Mandıra)',
      deliveryFee: '95 TL',
      distance: '1.8 km',
      estimatedTime: '12 Dk',
      urgency: 'Sıcak Teslimat'
    },
    {
      id: 'TASK-103',
      merchantName: 'Karadeniz Butik & Zanaat',
      merchantAddress: 'Düz Mah. Süleyman Felek Cad. No:88',
      customerName: 'Canan Kaya',
      customerAddress: 'Güzelyalı Mah. Sahil Cad. No:4',
      itemsCount: '1 Kutu (Hakiki Deri Çanta)',
      deliveryFee: '150 TL',
      distance: '4.1 km',
      estimatedTime: '25 Dk',
      urgency: 'Standart'
    }
  ];

  const handleStatusToggle = () => {
    const nextStatus = isAvailable ? 'busy' : 'available';
    setIsAvailable(!isAvailable);
    updateCourierStatus(nextStatus);
  };

  return (
    <DashboardLayout
      role="courier"
      title="TamKurye Sürücü Paneli"
      subtitle={`${user?.name || 'Murat Yıldız'} (${user?.courierVehicle || 'Motosiklet'})`}
      navItems={navItems}
      activeItemId={activeTab}
      onSelectNavItem={setActiveTab}
      headerActions={
        <button
          onClick={handleStatusToggle}
          className={`px-3.5 py-1.5 rounded-full text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-sm ${
            isAvailable 
              ? 'bg-[#10B981] text-[#0B132B] hover:bg-emerald-400' 
              : 'bg-rose-500 text-white hover:bg-rose-600'
          }`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${isAvailable ? 'bg-[#0B132B] animate-pulse' : 'bg-white'}`} />
          <span>{isAvailable ? '🟢 DURUM: MÜSAİT' : '🔴 DURUM: MEŞGUL'}</span>
        </button>
      }
    >
      <div className="space-y-6">

        {/* Status Summary Banner */}
        <div className="bg-[#0B132B] border-2 border-[#10B981] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/20 text-[#10B981] text-[10px] font-black uppercase tracking-wider border border-[#10B981]/40">
                <Bike className="w-3.5 h-3.5" /> %0 Komisyon Kurye Ağı
              </div>
              <h1 className="text-2xl font-black text-white">
                Saha Teslimat Komut Merkezi
              </h1>
              <p className="text-xs text-slate-300">
                Bugün toplam <strong className="text-amber-400">8 Teslimat</strong> tamamlandı · Günlük Hasılat: <strong className="text-[#10B981]">940 TL</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-[#111B38] border border-slate-700/60 p-3 rounded-2xl text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Sürücü Puanı</div>
                <div className="text-lg font-black text-amber-400">⭐ {user?.courierRating || '4.9'} / 5.0</div>
              </div>
              <div className="bg-[#111B38] border border-slate-700/60 p-3 rounded-2xl text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Aktif Taşıt</div>
                <div className="text-xs font-black text-[#10B981]">{user?.courierVehicle || 'Motosiklet (125cc)'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* TAB 1: CANLI GÖREV HAVUZU */}
        {activeTab === 'gorev-havuzu' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-[#0B132B] flex items-center gap-2">
                  <Radio className="w-5 h-5 text-[#10B981] animate-pulse" />
                  Yakındaki Canlı Görev Havuzu
                </h2>
                <p className="text-xs text-slate-500">
                  Esnafların açtığı bağımsız kurye talepleri. Kabul edip doğrudan adrese hareket edin.
                </p>
              </div>
              <span className="text-xs font-bold bg-emerald-100 text-[#0B132B] px-3 py-1 rounded-full">
                3 Yakın Talep
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockTasks.map((task) => (
                <div 
                  key={task.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md hover:border-[#10B981] transition space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {task.id}
                      </span>
                      <span className="text-xs font-black px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
                        {task.urgency}
                      </span>
                    </div>

                    {/* Merchant Drop */}
                    <div className="bg-slate-50 p-3 rounded-2xl space-y-1">
                      <div className="text-[10px] uppercase font-bold text-emerald-700 flex items-center gap-1">
                        <Store className="w-3.5 h-3.5" /> Dükkandan Alınacak:
                      </div>
                      <div className="text-xs font-black text-slate-900">{task.merchantName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0 text-slate-400" /> {task.merchantAddress}
                      </div>
                    </div>

                    {/* Customer Drop */}
                    <div className="bg-emerald-50/60 p-3 rounded-2xl space-y-1 border border-emerald-100">
                      <div className="text-[10px] uppercase font-bold text-slate-700 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-indigo-600" /> Teslim Edilecek Müşteri:
                      </div>
                      <div className="text-xs font-black text-slate-900">{task.customerName}</div>
                      <div className="text-[11px] text-slate-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0 text-slate-400" /> {task.customerAddress}
                      </div>
                    </div>

                    <div className="text-xs font-semibold text-slate-700 bg-slate-100/80 p-2.5 rounded-xl">
                      📦 {task.itemsCount}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Kazanç + Mesafe</div>
                      <div className="text-base font-black text-[#0B132B]">
                        {task.deliveryFee} <span className="text-xs text-slate-500 font-medium">({task.distance})</span>
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`${task.id} görevi kabul edildi. Rota başlatılıyor.`)}
                      className="px-4 py-2.5 bg-[#10B981] hover:bg-emerald-400 text-[#0B132B] font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Görevi Üstlen</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ROTA BİRLEŞTİRİCİ RADAR */}
        {activeTab === 'rota-radar' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-[#0B132B] flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-indigo-600" />
                  Çoklu Teslimat Rota Birleştirici Radar
                </h2>
                <p className="text-xs text-slate-500">
                  Aynı mahallede yer alan dükkanların paketlerini tek seferde toplayıp benzin ve zaman tasarrufu sağlayın.
                </p>
              </div>
              <span className="text-xs font-black bg-indigo-100 text-indigo-900 px-3 py-1 rounded-full">
                Radar Aktif (Yarıçap: 3.5 km)
              </span>
            </div>

            <div className="bg-[#0B132B] text-white p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono text-amber-400 font-bold">📍 Altınordu Çarşı İçi Optimal Rota Önerisi</span>
                <span className="text-xs font-bold text-emerald-400">%35 Yakıt & Zaman İskontosu</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-[#0B132B] font-black flex items-center justify-center shrink-0">1</div>
                  <div>
                    <strong className="text-white block">Akyazı Şarküteri (Subaşı)</strong>
                    <span className="text-slate-400 text-[11px]">Paket #102 alınıyor</span>
                  </div>
                </div>
                <div className="ml-3 border-l-2 border-dashed border-slate-700 h-4" />
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-[#0B132B] font-black flex items-center justify-center shrink-0">2</div>
                  <div>
                    <strong className="text-white block">FotoSentez Stüdyo (Atatürk Bulvarı)</strong>
                    <span className="text-slate-400 text-[11px]">Paket #101 alınıyor</span>
                  </div>
                </div>
                <div className="ml-3 border-l-2 border-dashed border-slate-700 h-4" />
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-amber-400 text-[#0B132B] font-black flex items-center justify-center shrink-0">3</div>
                  <div>
                    <strong className="text-white block">Sırayla Müşteri Teslimatları (2 Adres)</strong>
                    <span className="text-slate-400 text-[11px]">Toplam Hasılat: 215 TL · Süre: ~28 Dk</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => alert('Optimal çoklu rota navigasyonu başlatıldı.')}
                className="w-full py-3 bg-[#10B981] hover:bg-emerald-400 text-[#0B132B] font-black text-xs rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Optimize Birleşik Rotayı Başlat</span>
                <Navigation className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: KAZANÇ TAKİBİ */}
        {activeTab === 'kazanc-takibi' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-500">Bugünkü Net Kazanç</div>
                <div className="text-2xl font-black text-[#0B132B] mt-1">940 TL</div>
                <div className="text-[11px] text-emerald-600 font-bold mt-1">8 Görev · Komisyonsuz</div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-500">Bu Haftalık Toplam</div>
                <div className="text-2xl font-black text-emerald-600 mt-1">5,820 TL</div>
                <div className="text-[11px] text-slate-500 mt-1">42 Tamamlanan Görev</div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
                <div className="text-xs font-bold text-slate-500">TamKurye Aylık Tahmin</div>
                <div className="text-2xl font-black text-amber-600 mt-1">24,500 TL</div>
                <div className="text-[11px] text-slate-500 mt-1">Ortalama 110 TL / Görev</div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900">Tamamlanan Son Teslimatlar</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <strong className="text-slate-900 block">Kuzey Ahşap → Serkan Bey</strong>
                    <span className="text-slate-400 text-[10px]">Bugün 14:20 · Nakit Tahsilat</span>
                  </div>
                  <span className="font-black text-emerald-700 text-sm">+110 TL</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <strong className="text-slate-900 block">Karadeniz Butik → Ayşe Hanım</strong>
                    <span className="text-slate-400 text-[10px]">Bugün 12:45 · POS Tahsilat</span>
                  </div>
                  <span className="font-black text-emerald-700 text-sm">+135 TL</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AYARLAR */}
        {activeTab === 'ayarlar' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-black text-slate-900">Motosiklet & Saha Ayarlarım</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Motosiklet Plaka / Model</label>
                <input 
                  type="text" 
                  defaultValue="52 AAE 102 — Honda PCX 125" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Minimum Görev Ücreti (TL)</label>
                <input 
                  type="text" 
                  defaultValue="85 TL" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
