/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, CreditCard, CheckCircle2, AlertCircle, 
  TrendingUp, Users, ShieldCheck, Sparkles, Filter, 
  Search, ExternalLink, ToggleLeft, ToggleRight, Check, 
  RefreshCw, FileSpreadsheet, Lock, Eye, ArrowUpRight, Activity, Zap
} from 'lucide-react';
import { Tenant } from '../../data/mockData';
import SystemHealthDashboard from './SystemHealthDashboard';

interface AdminLiveLaunchDashboardProps {
  tenants: Tenant[];
  onToggleStoreStatus?: (tenantId: string) => void;
  defaultView?: 'mrr' | 'health';
}

export default function AdminLiveLaunchDashboard({
  tenants,
  onToggleStoreStatus,
  defaultView = 'mrr'
}: AdminLiveLaunchDashboardProps) {
  const [adminViewMode, setAdminViewMode] = useState<'mrr' | 'health'>(defaultView);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'live' | 'demo' | 'pending'>('all');
  const [localTenants, setLocalTenants] = useState<Tenant[]>(tenants);

  // Compute live MRR & subscription metrics
  const activeSubscribedTenants = localTenants.filter(t => t.subscriptionStatus === 'active' && !t.isDemoStore);
  const pendingTenants = localTenants.filter(t => t.subscriptionStatus === 'pending' || t.subscriptionStatus === 'trial');
  const demoStores = localTenants.filter(t => t.isDemoStore);

  // Calculate MRR from active merchants
  const totalMrr = activeSubscribedTenants.reduce((sum, t) => sum + (t.monthlyRecurringRevenue || 599), 0);
  const totalArr = totalMrr * 12;

  // Fully integrated stores
  const fullyIntegratedCount = localTenants.filter(t => t.posConfigured && t.cargoConfigured && t.eInvoiceConfigured).length;

  const handleToggleStatus = (id: string) => {
    const updated = localTenants.map(t => {
      if (t.id === id) {
        const nextStatus = t.subscriptionStatus === 'active' ? 'pending' : 'active';
        return {
          ...t,
          subscriptionStatus: nextStatus as any,
          isVerifiedMerchant: nextStatus === 'active'
        };
      }
      return t;
    });
    setLocalTenants(updated);
    if (onToggleStoreStatus) onToggleStoreStatus(id);
  };

  const filteredTenants = localTenants.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (t.category && t.category.toLowerCase().includes(searchTerm.toLowerCase()));
    if (!matchesSearch) return false;
    if (filterType === 'live') return t.subscriptionStatus === 'active' && !t.isDemoStore;
    if (filterType === 'demo') return t.isDemoStore;
    if (filterType === 'pending') return t.subscriptionStatus === 'pending' || t.subscriptionStatus === 'trial';
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      
      {/* VIEW MODE TOGGLE */}
      <div className="flex items-center justify-between bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 font-bold">
          <button
            onClick={() => setAdminViewMode('mrr')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
              adminViewMode === 'mrr'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Mağaza Vitrinleri & MRR Gelir Konsolu</span>
          </button>

          <button
            onClick={() => setAdminViewMode('health')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
              adminViewMode === 'health'
                ? 'bg-[#0B132B] text-white shadow-xs border border-emerald-500/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Sistem Sağlığı & Performans Paneli (API, DB, Hata Logları)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>

        <span className="hidden md:inline text-[11px] font-mono text-slate-400 pr-2">
          {adminViewMode === 'health' ? 'Canlı Telemetri: Aktif' : `Toplam ${tenants.length} Mağaza Kayıtlı`}
        </span>
      </div>

      {adminViewMode === 'health' ? (
        <SystemHealthDashboard />
      ) : (
        <>
          {/* TOP HEADER */}
          <div className="bg-gradient-to-r from-slate-950 via-[#0F4C3A] to-slate-950 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-emerald-900/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400 text-slate-950 rounded-full text-xs font-black uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Süper Admin & Canlıya Geçiş Gösterge Paneli
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            TamPazar SaaS Abonelik & MRR Gelir Motoru
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            Canlı vitrin izolasyonu, PayTR tekrarlayan abonelik gelirleri ve esnaf BYO (POS/Kargo/E-Fatura) entegrasyon durumlarının merkezi denetim konsolu.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-emerald-500/30 p-4 rounded-2xl text-right shrink-0">
          <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 block font-bold">
            PayTR Düzenli Gelir (MRR)
          </span>
          <div className="text-2xl font-black text-white font-mono mt-0.5">
            ₺{totalMrr.toLocaleString('tr-TR')} <span className="text-xs text-slate-400 font-normal">/ ay</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono block mt-1">
            Yıllık Koşu Hızı (ARR): ₺{totalArr.toLocaleString('tr-TR')}
          </span>
        </div>
      </div>

      {/* STATS METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Aktif Abone Esnaf */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-bold text-[11px] uppercase tracking-wider">Aktif Abone Esnaf</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{activeSubscribedTenants.length} Mağaza</div>
          <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>%0 Komisyonlu Canlı Vitrinde</span>
          </div>
        </div>

        {/* 2. Onay / Ödeme Bekleyen */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-bold text-[11px] uppercase tracking-wider">Bekleyen / Deneme</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{pendingTenants.length} Dükkan</div>
          <div className="text-[10px] text-amber-600 font-bold">
            Abonelik veya evrak onayı bekleniyor
          </div>
        </div>

        {/* 3. BYO Tamamlanma Oranı */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-bold text-[11px] uppercase tracking-wider">Tam Entegre Dükkanlar</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{fullyIntegratedCount} / {localTenants.length}</div>
          <div className="text-[10px] text-indigo-600 font-bold">
            POS + Kargo + E-Fatura aktif
          </div>
        </div>

        {/* 4. Test Mağazası İzolasyonu */}
        <div className="bg-amber-50/60 p-5 rounded-3xl border border-amber-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-amber-900">
            <span className="font-black text-[11px] uppercase tracking-wider">🧪 Demo İzolasyonu</span>
            <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-black rounded text-[9px]">
              Korumalı
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">{demoStores.length} Demo Market</div>
          <div className="text-[10px] text-slate-600">
            Geliştirme ürünleri canlı vitrinden izole
          </div>
        </div>

      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Mağaza adı, kategori veya vergi no ile filtrele..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-600"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Tüm Mağazalar' },
            { id: 'live', label: '✅ Yalnızca Canlı & Abone' },
            { id: 'pending', label: '⏳ Bekleyenler' },
            { id: 'demo', label: '🧪 Demo Market' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition cursor-pointer ${
                filterType === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* STORE INTEGRATION LIST TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-sm text-slate-900">
            Dükkan Entegrasyon Matrisi & Canlı Vitrin Yetkileri
          </h3>
          <span className="text-[11px] font-mono text-slate-500">
            Toplam: {filteredTenants.length} Mağaza
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Mağaza & Ünvan</th>
                <th className="py-3 px-4">Abonelik Paketi</th>
                <th className="py-3 px-4">Abonelik Durumu</th>
                <th className="py-3 px-4">Sanal POS</th>
                <th className="py-3 px-4">Kargo (BYO)</th>
                <th className="py-3 px-4">E-Fatura</th>
                <th className="py-3 px-4">Vitrin Statüsü</th>
                <th className="py-3 px-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredTenants.map((tenant) => {
                const isLive = tenant.subscriptionStatus === 'active' && !tenant.isDemoStore;
                const isDemo = tenant.isDemoStore;

                return (
                  <tr key={tenant.id} className="hover:bg-slate-50/80 transition">
                    
                    {/* Store info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl shrink-0">{tenant.logo}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <strong className="font-black text-slate-900">{tenant.name}</strong>
                            {isDemo && (
                              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 text-[9px] font-black rounded">
                                🧪 Test
                              </span>
                            )}
                            {tenant.isVerifiedMerchant && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {tenant.legalTitle || tenant.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded-lg text-[10px]">
                        {tenant.plan} (₺{tenant.monthlyRecurringRevenue || 0}/ay)
                      </span>
                    </td>

                    {/* Sub Status */}
                    <td className="py-3.5 px-4">
                      {tenant.subscriptionStatus === 'active' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-black">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Aktif (Ödendi)
                        </span>
                      ) : tenant.subscriptionStatus === 'trial' ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-black">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Deneme Sürümü
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full text-[10px] font-black">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Beklemede / Ödeme Yok
                        </span>
                      )}
                    </td>

                    {/* POS */}
                    <td className="py-3.5 px-4 font-mono">
                      {tenant.posConfigured ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                          <Check className="w-3.5 h-3.5" /> {tenant.activePos?.toUpperCase() || 'PAYTR'}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">- Tanımsız</span>
                      )}
                    </td>

                    {/* Cargo */}
                    <td className="py-3.5 px-4 font-mono">
                      {tenant.cargoConfigured ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                          <Check className="w-3.5 h-3.5" /> Yurtiçi Kargo
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">- Tanımsız</span>
                      )}
                    </td>

                    {/* E-Invoice */}
                    <td className="py-3.5 px-4 font-mono">
                      {tenant.eInvoiceConfigured ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                          <Check className="w-3.5 h-3.5" /> GİB UBL-TR
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">- Tanımsız</span>
                      )}
                    </td>

                    {/* Vitrin Statüsü */}
                    <td className="py-3.5 px-4">
                      {isLive ? (
                        <span className="px-2.5 py-1 bg-emerald-600 text-white font-black rounded-lg text-[10px] uppercase tracking-wider shadow-xs">
                          Canlı Vitrinde
                        </span>
                      ) : isDemo ? (
                        <span className="px-2.5 py-1 bg-amber-400 text-slate-950 font-black rounded-lg text-[10px] uppercase tracking-wider">
                          Demo Sandbox
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-slate-200 text-slate-700 font-bold rounded-lg text-[10px]">
                          Askıda / Kapalı
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {!isDemo && (
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(tenant.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition cursor-pointer ${
                            isLive
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                          }`}
                        >
                          {isLive ? 'Askıya Al' : 'Canlıya Al'}
                        </button>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}

    </div>
  );
}
