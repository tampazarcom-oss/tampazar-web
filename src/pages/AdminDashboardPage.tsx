/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import DashboardLayout, { SidebarNavItem } from '../components/layouts/DashboardLayout';
import { 
  BarChart3, Store, Bike, Layers, MapPin, ShieldCheck, CheckCircle2, 
  XCircle, RefreshCw, CreditCard, Users, TrendingUp, Search, Filter, AlertTriangle,
  Lock, Key, Zap, Package, ShoppingBag, Eye, Trash2, Power, Edit3, Settings,
  ShieldAlert, FileText, Check, DollarSign, Database, Server, UserCheck, UserX,
  Globe, Radio, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { initialTenants, initialProducts, Tenant, Product } from '../data/mockData';

export default function AdminDashboardPage() {
  const { user, switchRole } = useAuth();
  const [activeTab, setActiveTab] = useState('metrikler');
  const [searchTerm, setSearchTerm] = useState('');

  // Local state for full system control simulation
  const [tenantsList, setTenantsList] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem('tampazar_tenants');
    return saved ? JSON.parse(saved) : initialTenants;
  });

  const [productsList, setProductsList] = useState<Product[]>(() => {
    const saved = localStorage.getItem('tampazar_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [systemMaintenance, setSystemMaintenance] = useState(false);
  const [globalBanner, setGlobalBanner] = useState('🔥 TamPazar Komisyonsuz Açık Dijital AVM: %0 komisyonla doğrudan esnaf fiyatı!');

  // Mock System Users Table
  const [usersList, setUsersList] = useState([
    { id: 'USR-101', name: 'Ahmet Yılmaz', email: 'ahmet@gmail.com', role: 'customer', status: 'active', city: 'İstanbul / Kadıköy', orders: 12 },
    { id: 'USR-102', name: 'Mustafa Usta', email: 'mustafa@firin.com', role: 'merchant', status: 'active', city: 'Ordu / Altınordu', orders: 142 },
    { id: 'USR-103', name: 'Burak Keskin', email: 'burak@kurye.com', role: 'courier', status: 'active', city: 'Giresun / Merkez', orders: 89 },
    { id: 'USR-104', name: 'Sistem Yöneticisi', email: 'admin@tampazar.com', role: 'admin', status: 'active', city: 'Ankara / Çankaya', orders: 0 },
    { id: 'USR-105', name: 'Zeynep Kaya', email: 'zeynep@butik.com', role: 'merchant', status: 'pending', city: 'Trabzon / Ortahisar', orders: 3 },
    { id: 'USR-106', name: 'Mehmet Şahin', email: 'mehmet@gmail.com', role: 'customer', status: 'banned', city: 'İzmir / Karşıyaka', orders: 1 },
  ]);

  const navItems: SidebarNavItem[] = [
    { id: 'metrikler', label: '1. Sistem Genel Denetimi', icon: BarChart3 },
    { id: 'esnaflar', label: '2. Tüm Dükkan & Mağazalar', icon: Store, badge: `${tenantsList.length} Aktif` },
    { id: 'urunler', label: '3. Tüm Ürün & İlan Kataloğu', icon: Package, badge: `${productsList.length} İlan` },
    { id: 'kullanicilar', label: '4. Kullanıcı & Rol Yönetimi', icon: Users, badge: `${usersList.length} Kayıtlı` },
    { id: 'finans-pos', label: '5. PayTR, BYOPOS & e-Fatura Log', icon: CreditCard, badge: '918K TL MRR' },
    { id: 'kurye-lojistik', label: '6. Kurye & Şehir Radarı', icon: Bike, badge: '81 İl' },
    { id: 'onay-bekleyenler', label: '7. Onay Bekleyen Başvurular', icon: ShieldCheck, badge: '3 Bekliyor', badgeColor: 'bg-rose-500 text-white' },
    { id: 'sistem-ayarlari', label: '8. Sistem Ayarları & Güvenlik', icon: Settings }
  ];

  // Helper actions
  const toggleTenantStatus = (id: string) => {
    setTenantsList(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, isVerifiedMerchant: !t.isVerifiedMerchant };
      }
      return t;
    }));
  };

  const deleteProduct = (id: string) => {
    if (confirm('Bu ürünü platform genelinden silmek istediğinize emin misiniz?')) {
      setProductsList(prev => prev.filter(p => p.id !== id));
    }
  };

  const changeUserRole = (userId: string, newRole: string) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const toggleUserStatus = (userId: string) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, status: u.status === 'banned' ? 'active' : 'banned' } : u));
  };

  return (
    <DashboardLayout
      role="admin"
      title="Sistem Admin Komuta Merkezi"
      subtitle="Full-Stack Platform Yönetimi, Sanal POS Denetimi ve Tüm Ekosistem Kontrolü"
      navItems={navItems}
      activeItemId={activeTab}
      onSelectNavItem={setActiveTab}
    >
      <div className="space-y-6">

        {/* Top Header Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#F59E0B] font-black bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
                  🛡️ Izole Master Admin Konsolu
                </span>
                {systemMaintenance && (
                  <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded animate-pulse">
                    MÜŞTERİYE KAPALI (BAKIM MODU)
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-black text-white mt-1">
                TamPazar Sistem Geneli Yönetim Paneli
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                81 İl Geneli: <strong className="text-white">{tenantsList.length} Aktif Mağaza</strong> · <strong className="text-emerald-400">{productsList.length} Ürün</strong> · <strong className="text-cyan-400">303 Kurye Sürücüsü</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSystemMaintenance(!systemMaintenance)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                  systemMaintenance ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{systemMaintenance ? 'Bakım Modunu Kapat' : 'Bakım Modunu Aç'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: SİSTEM GENEL DENETİMİ */}
        {activeTab === 'metrikler' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-md">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                  <span>Toplam Kayıtlı Dükkân</span>
                  <Store className="w-4 h-4 text-[#F59E0B]" />
                </div>
                <div className="text-3xl font-black text-[#F59E0B] mt-1">{tenantsList.length}</div>
                <div className="text-[11px] text-emerald-400 font-bold mt-1">▲ Bu Ay +142 Yeni Mağaza</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-md">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                  <span>Platform Hasılatı (GMV)</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-emerald-400 mt-1">9.97 M TL</div>
                <div className="text-[11px] text-slate-400 mt-1">%0 Komisyon — Doğrudan Esnaf Kasası</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-md">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                  <span>TamKurye Sürücü Filosu</span>
                  <Bike className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-3xl font-black text-cyan-400 mt-1">303</div>
                <div className="text-[11px] text-slate-400 mt-1">Canlı Harita Konumlu Saha</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-md">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                  <span>Tasarruf Edilen Komisyon</span>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div className="text-3xl font-black text-amber-300 mt-1">1.49 M TL</div>
                <div className="text-[11px] text-amber-400/90 font-bold mt-1">Esnafın Cebinde Kalan Aracı Payı</div>
              </div>
            </div>

            {/* Sunucu Sağlığı & Canlı Sistem Log Akışı */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#F59E0B]" />
                  Canlı Sistem Günlükleri & İşlem Akışı
                </h3>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center text-slate-300">
                    <span>[PAYTR RECURRING] FotoSentez Stüdyo 500 TL Sabit Aidat Çekimi Başarılı</span>
                    <span className="text-emerald-400 font-bold">Tamamlandı</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center text-slate-300">
                    <span>[GİB E-FATURA UBL-TR 2.1] 14 Yeni Esnaf e-Fatura Belge Motoru Aktifleşti</span>
                    <span className="text-cyan-400 font-bold">Otomatik</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center text-slate-300">
                    <span>[TAMKURYE RADAR] Kadıköy Bölgesinde 8 Yeni Teslimat Çağrısı Alındı</span>
                    <span className="text-amber-400 font-bold">Dağıtımda</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-400" />
                  Sunucu & Veritabanı Sağlığı
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>API Yanıt Süresi</span>
                      <strong className="text-emerald-400">18 ms</strong>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full w-[15%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Veritabanı Doluluk Rate</span>
                      <strong className="text-cyan-400">%24</strong>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2">
                      <div className="bg-cyan-500 h-2 rounded-full w-[24%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>PayTR & iyzico Webhook</span>
                      <strong className="text-amber-400">%100 Başarılı</strong>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2">
                      <div className="bg-amber-400 h-2 rounded-full w-[100%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TÜM DÜKKANLAR & MAĞAZALAR */}
        {activeTab === 'esnaflar' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Store className="w-5 h-5 text-[#F59E0B]" />
                  Tüm Kayıtlı Dükkanlar & Mağaza Denetimi
                </h2>
                <p className="text-xs text-slate-400">
                  Platformdaki tüm işletmelerin Sanal POS durumlarını, onay durumlarını ve mağaza ayarlarını buradan yönetin.
                </p>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Mağaza ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Mağaza Adı</th>
                    <th className="p-3">Şehir / İlçe</th>
                    <th className="p-3">Sektör</th>
                    <th className="p-3">BYOPOS / POS Durumu</th>
                    <th className="p-3">Doğrulama</th>
                    <th className="p-3 text-right">Eylemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium">
                  {tenantsList
                    .filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) || (t.category && t.category.toLowerCase().includes(searchTerm.toLowerCase())))
                    .map(tenant => (
                      <tr key={tenant.id} className="hover:bg-slate-800/50 transition">
                        <td className="p-3 font-bold text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>{tenant.name}</span>
                        </td>
                        <td className="p-3 text-slate-400">{tenant.plan} Plan</td>
                        <td className="p-3 text-slate-300">{tenant.category || tenant.typeBadge || 'Perakende'}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-[10px]">
                            {tenant.byoPosConnected ? (tenant.activePos ? tenant.activePos.toUpperCase() : 'PayTR BYOPOS') : 'Sanal POS Bağlı'}
                          </span>
                        </td>
                        <td className="p-3">
                          {tenant.isVerifiedMerchant ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">Onaylı Esnaf</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">Onay Bekliyor</span>
                          )}
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => toggleTenantStatus(tenant.id)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg cursor-pointer transition"
                          >
                            {tenant.isVerifiedMerchant ? 'Dondur' : 'Onayla'}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: TÜM ÜRÜNLER & İLAN KATALOĞU */}
        {activeTab === 'urunler' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-400" />
                  Sistem Geneli Ürün & Hizmet Kataloğu
                </h2>
                <p className="text-xs text-slate-400">Platformdaki tüm ilanları denetleyin, onaylayın veya silin.</p>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
                {productsList.length} Toplam İlan
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Görsel & Başlık</th>
                    <th className="p-3">Mağaza</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Fiyat</th>
                    <th className="p-3 text-right">Eylem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium">
                  {productsList.slice(0, 10).map((product) => (
                    <tr key={product.id} className="hover:bg-slate-800/50">
                      <td className="p-3 flex items-center gap-2.5">
                        <img src={product.image} alt={product.title} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="font-bold text-white truncate max-w-[200px]">{product.title}</span>
                      </td>
                      <td className="p-3 text-slate-400">{product.storeName || 'TamPazar Esnafı'}</td>
                      <td className="p-3 text-slate-300">{product.category}</td>
                      <td className="p-3 font-bold text-emerald-400">₺{product.price.toLocaleString('tr-TR')}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-lg cursor-pointer transition"
                          title="İlanı Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: KULLANICI & ROL YÖNETİMİ */}
        {activeTab === 'kullanicilar' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              Sistem Kullanıcıları ve Yetki / Rol Atama
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Kullanıcı Adı</th>
                    <th className="p-3">E-Posta</th>
                    <th className="p-3">Mevcut Rol</th>
                    <th className="p-3">Konum</th>
                    <th className="p-3">Durum</th>
                    <th className="p-3 text-right">Rol Değiştir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-white">{u.name}</td>
                      <td className="p-3 text-slate-400">{u.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-black text-[10px] uppercase ${
                          u.role === 'admin' ? 'bg-amber-400 text-slate-950' :
                          u.role === 'merchant' ? 'bg-[#0F4C3A] text-white' :
                          u.role === 'courier' ? 'bg-cyan-500 text-slate-950' : 'bg-indigo-600 text-white'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{u.city}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${u.status === 'banned' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1">
                        <select
                          value={u.role}
                          onChange={(e) => changeUserRole(u.id, e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white outline-none focus:border-amber-400 cursor-pointer"
                        >
                          <option value="customer">Müşteri</option>
                          <option value="merchant">Satıcı (Esnaf)</option>
                          <option value="courier">Kurye</option>
                          <option value="admin">Süper Admin</option>
                        </select>
                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold cursor-pointer"
                        >
                          {u.status === 'banned' ? 'Engeli Kaldır' : 'Engelle'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: FINANS, BYOPOS & E-FATURA LOGLARI */}
        {activeTab === 'finans-pos' && (
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

        {/* TAB 6: KURYE & ŞEHİR RADARI */}
        {activeTab === 'kurye-lojistik' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-4">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Bike className="w-5 h-5 text-cyan-400" />
              81 İl Kurye ve Saha Lojistik Radarı
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] block font-mono">SAHA MOTOR FİLOSU</span>
                <span className="text-2xl font-black text-cyan-400">214 Sürücü</span>
                <span className="text-slate-500 block text-[10px]">Ort. Teslimat Süresi: 22 Dakika</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] block font-mono">YAYA / BİSİKLET KURYELER</span>
                <span className="text-2xl font-black text-amber-400">89 Sürücü</span>
                <span className="text-slate-500 block text-[10px]">Çarşı İçi Hızlı Dağıtım</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] block font-mono">TABAN KURYERE ÜCRETİ</span>
                <span className="text-2xl font-black text-emerald-400">₺35.00 / Teslimat</span>
                <span className="text-slate-500 block text-[10px]">KM Başına +₺6.00</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: ONAY BEKLEYENLER */}
        {activeTab === 'onay-bekleyenler' && (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              Onay Bekleyen Mağaza ve TamKurye Başvuruları
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'APP-901', name: 'Yıldız Fırın & Unlu Mamuller', owner: 'Kadir Yıldız', city: 'Ordu / Altınordu', taxId: '8201928301' },
                { id: 'APP-902', name: 'Burak Keskin (Moto Kurye)', owner: 'Burak Keskin', city: 'Giresun / Merkez', taxId: '2910392810' },
                { id: 'APP-903', name: 'Karadeniz Çay & Şarküteri', owner: 'Mustafa Çakır', city: 'Rize / Merkez', taxId: '5820192831' }
              ].map((app) => (
                <div key={app.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded">
                      {app.id}
                    </span>
                    <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300">
                      Başvuru
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-sm">{app.name}</h3>
                    <div className="text-xs text-slate-400 mt-0.5">{app.owner} · {app.city}</div>
                    <div className="text-[11px] font-mono text-slate-500 mt-1">Vergi No: {app.taxId}</div>
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

        {/* TAB 8: SİSTEM AYARLARI & GÜVENLİK */}
        {activeTab === 'sistem-ayarlari' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-6">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-amber-400" />
              Platform Genel Ayarları & Duyuru Panosu
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Pazaryeri Üst Duyuru Bannerı</label>
                <input
                  type="text"
                  value={globalBanner}
                  onChange={(e) => setGlobalBanner(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <strong className="text-amber-400 block font-bold">GİB e-Fatura Entegrasyon API Durumu</strong>
                <p className="text-slate-400">GİB UBL-TR 2.1 e-Fatura / e-Arşiv resmi entegratör canlı servisi çalışıyor.</p>
                <div className="flex items-center gap-2 pt-1 text-[#10B981] font-bold">
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span>Resmi GİB Servis Bağlantısı Aktif</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
