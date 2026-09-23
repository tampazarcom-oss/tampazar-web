/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { initialTenants, Tenant } from './data/mockData';
import MarketplaceHome from './components/MarketplaceHome';
import SuperMallHome from './components/SuperMallHome';
import StoreProfilePage from './components/StoreProfilePage';
import SystemArchitecture from './components/SystemArchitecture';
import ByoPosConfigurator from './components/ByoPosConfigurator';
import LogisticsIntegration from './components/LogisticsIntegration';
import QrMenuHospitality from './components/QrMenuHospitality';
import B2BQuotationModule from './components/B2BQuotationModule';
import GibDespatchProducerModule from './components/GibDespatchProducerModule';
import ProductStorefront from './components/ProductStorefront';
import AccountingModule from './components/AccountingModule';
import NestjsCodebase from './components/NestjsCodebase';
import TampazarSellerDashboard from './components/TampazarSellerDashboard';
import ProductDetailPage from './components/ProductDetailPage';
import { Store, ChevronDown, Check, Globe, Layers, CreditCard, Tags, FileText, Code, ShoppingCart, Sparkles, Truck, QrCode, Briefcase, FileSpreadsheet, LayoutDashboard } from 'lucide-react';

export default function App() {
  const [tenants, setTenants] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem('tampazar_tenants');
    return saved ? JSON.parse(saved) : initialTenants;
  });

  const [activeTenant, setActiveTenant] = useState<Tenant>(tenants[0]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('st-101');
  const [selectedProductSlug, setSelectedProductSlug] = useState<string>('minimalist-deri-oxford-ayakkabi');
  const [activeTab, setActiveTab] = useState<'home' | 'supermall' | 'store-profile' | 'product-detail' | 'seller-dashboard' | 'architecture' | 'byopos' | 'logistics' | 'qrmenu' | 'b2bquotes' | 'gibdespatch' | 'catalog' | 'accounting' | 'codebase'>('home');
  const [showTenantDropdown, setShowTenantDropdown] = useState(false);

  // Callback to update tenant connection state when user links Sanal POS
  const handleUpdateTenantPos = (tenantId: string, connected: boolean, posProvider: string | null) => {
    const updated = tenants.map(t => {
      if (t.id === tenantId) {
        return {
          ...t,
          byoPosConnected: connected,
          activePos: posProvider
        };
      }
      return t;
    });
    setTenants(updated);
    localStorage.setItem('tampazar_tenants', JSON.stringify(updated));

    // Update active context immediately
    const nextActive = updated.find(t => t.id === tenantId);
    if (nextActive) setActiveTenant(nextActive);
  };

  const handleNavigateToStoreFromHome = (storeId: string) => {
    setSelectedStoreId(storeId);
    setActiveTab('store-profile');
  };

  const handleNavigateToProduct = (slug: string) => {
    setSelectedProductSlug(slug);
    setActiveTab('product-detail');
  };

  const handleOpenSellerDashboard = (tab: string = 'byopos') => {
    setActiveTab(tab as any);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-800 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-950">
      


      {/* Top Global Ecosystem Switcher Bar */}
      <div className="bg-slate-950 text-white text-[11px] font-medium px-6 py-2 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider">
            Açık Dijital AVM
          </span>
          <span className="hidden sm:inline text-slate-400">
            tampazar.com — Açık Dijital AVM ve Entegre Ticaret İşletim Sistemi (%0 Komisyon · Doğrudan Esnaf Kasası · GİB e-Fatura)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === 'home' 
                ? 'bg-amber-400 text-slate-950 font-bold shadow-xs' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            🏪 Pazaryeri Vitrini
          </button>
          <button
            onClick={() => setActiveTab('supermall')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === 'supermall' 
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            🏬 Şehrin Açık Dijital AVM'si
          </button>
          <button
            onClick={() => { setSelectedStoreId('st-101'); setActiveTab('store-profile'); }}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === 'store-profile' 
                ? 'bg-indigo-600 text-white font-bold shadow-xs' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            🏷️ Dükkân Kimliği
          </button>
          <button
            onClick={() => setActiveTab('seller-dashboard')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === 'seller-dashboard' 
                ? 'bg-emerald-500 text-slate-950 font-black shadow-xs' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            📊 Esnaf Yönetim Paneli
          </button>
          <span className="text-slate-700">|</span>
          <button
            onClick={() => setActiveTab('byopos')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab !== 'home' && activeTab !== 'supermall' && activeTab !== 'store-profile' && activeTab !== 'seller-dashboard'
                ? 'bg-slate-800 text-amber-300 font-semibold border border-slate-700' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚙️ SaaS Satıcı & Mimari Konsol
          </button>
        </div>
      </div>

      {/* When in SaaS Mode: show the 3-Zone Top Bar & Workspace */}
      {activeTab !== 'home' && activeTab !== 'supermall' && activeTab !== 'store-profile' && (
        <header className="sticky top-0 z-40 bg-[#FDFDFD]/90 backdrop-blur-md border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-xs">
          {/* Zone 1: Brand title, single line wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 font-semibold"
            >
              ← Vitrine Dön
            </button>
            <span className="text-slate-300">|</span>
            <a href="/" className="flex items-center" onClick={(e) => { e.preventDefault(); setActiveTab('home'); }}>
              <img 
                src="/logo.png" 
                alt="TamPazar" 
                className="h-10 w-auto object-contain block" 
              />
            </a>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-slate-500 overflow-x-auto">
            <button
              onClick={() => setActiveTab('seller-dashboard')}
              className={`transition-colors whitespace-nowrap ${activeTab === 'seller-dashboard' ? 'text-indigo-900 border-b-2 border-indigo-900 pb-1 font-bold' : 'hover:text-slate-900'}`}
            >
              📊 Esnaf Paneli
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`transition-colors whitespace-nowrap ${activeTab === 'architecture' ? 'text-indigo-900 border-b-2 border-indigo-900 pb-1' : 'hover:text-slate-900'}`}
            >
              Mimarî
            </button>
            <button
              onClick={() => setActiveTab('byopos')}
              className={`transition-colors whitespace-nowrap ${activeTab === 'byopos' ? 'text-indigo-900 border-b-2 border-indigo-900 pb-1' : 'hover:text-slate-900'}`}
            >
              Sanal POS (BYO)
            </button>
            <button
              onClick={() => setActiveTab('logistics')}
              className={`transition-colors whitespace-nowrap ${activeTab === 'logistics' ? 'text-indigo-900 border-b-2 border-indigo-900 pb-1' : 'hover:text-slate-900'}`}
            >
              📦 Kargo (BYO)
            </button>
            <button
              onClick={() => setActiveTab('qrmenu')}
              className={`transition-colors whitespace-nowrap ${activeTab === 'qrmenu' ? 'text-indigo-900 border-b-2 border-indigo-900 pb-1' : 'hover:text-slate-900'}`}
            >
              📱 QR Masa
            </button>
            <button
              onClick={() => setActiveTab('b2bquotes')}
              className={`transition-colors whitespace-nowrap ${activeTab === 'b2bquotes' ? 'text-indigo-900 border-b-2 border-indigo-900 pb-1' : 'hover:text-slate-900'}`}
            >
              📑 B2B Teklif
            </button>
            <button
              onClick={() => setActiveTab('gibdespatch')}
              className={`transition-colors whitespace-nowrap ${activeTab === 'gibdespatch' ? 'text-indigo-900 border-b-2 border-indigo-900 pb-1' : 'hover:text-slate-900'}`}
            >
              🚚 e-İrsaliye / e-MM
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`transition-colors whitespace-nowrap ${activeTab === 'catalog' ? 'text-indigo-900 border-b-2 border-indigo-900 pb-1' : 'hover:text-slate-900'}`}
            >
              Ürün & SEO
            </button>
            <button
              onClick={() => setActiveTab('accounting')}
              className={`transition-colors whitespace-nowrap ${activeTab === 'accounting' ? 'text-indigo-900 border-b-2 border-indigo-900 pb-1' : 'hover:text-slate-900'}`}
            >
              Ön Muhasebe
            </button>
            <button
              onClick={() => setActiveTab('codebase')}
              className={`transition-colors whitespace-nowrap ${activeTab === 'codebase' ? 'text-indigo-900 border-b-2 border-indigo-900 pb-1' : 'hover:text-slate-900'}`}
            >
              API Kodları
            </button>
          </nav>

          {/* Zone 3: Primary Action - Dynamic Multi-Tenant Context Switcher */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowTenantDropdown(!showTenantDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-700 bg-white shadow-xs transition-colors cursor-pointer"
            >
              <span className="text-sm">{activeTenant.logo}</span>
              <span className="truncate max-w-[120px]">{activeTenant.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showTenantDropdown && (
              <div className="absolute right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 animate-fade-in divide-y divide-slate-100">
                <div className="px-3 py-1.5">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block font-semibold">Kiracı Değiştir (PostgreSQL RLS)</span>
                </div>
                <div className="py-1 max-h-56 overflow-y-auto">
                  {tenants.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setActiveTenant(t);
                        setShowTenantDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${activeTenant.id === t.id ? 'bg-slate-50 font-bold' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{t.logo}</span>
                        <div>
                          <div className="text-slate-800 font-medium">{t.name}</div>
                          <div className="text-[9px] text-slate-400 font-mono">Plan: {t.plan}</div>
                        </div>
                      </div>
                      {activeTenant.id === t.id && (
                        <Check className="w-4 h-4 text-emerald-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>
      )}

      {/* Main Viewport Routing */}
      {activeTab === 'home' ? (
        <MarketplaceHome 
          onNavigateToStore={handleNavigateToStoreFromHome}
          onOpenSellerDashboard={handleOpenSellerDashboard}
          onNavigateToSuperMall={() => setActiveTab('supermall')}
        />
      ) : activeTab === 'supermall' ? (
        <SuperMallHome 
          onNavigateToStore={handleNavigateToStoreFromHome}
          onNavigateToProduct={handleNavigateToProduct}
          onOpenSaaSConsole={handleOpenSellerDashboard}
          onBackToMarketplace={() => setActiveTab('home')}
        />
      ) : activeTab === 'store-profile' ? (
        <StoreProfilePage 
          storeId={selectedStoreId}
          onBackToMarketplace={() => setActiveTab('home')}
          onOpenSaaSConsole={handleOpenSellerDashboard}
        />
      ) : activeTab === 'product-detail' ? (
        <ProductDetailPage 
          slug={selectedProductSlug}
          onBackToMarketplace={() => setActiveTab('home')}
        />
      ) : activeTab === 'seller-dashboard' ? (
        <TampazarSellerDashboard 
          onNavigate={(tab) => setActiveTab(tab as any)} 
          activeStoreName={activeTenant.name} 
        />
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
          <div className="transition-all duration-300">
            {activeTab === 'architecture' && <SystemArchitecture />}
            {activeTab === 'byopos' && (
              <ByoPosConfigurator
                currentTenant={activeTenant}
                onUpdateTenantPos={handleUpdateTenantPos}
              />
            )}
            {activeTab === 'logistics' && <LogisticsIntegration currentTenant={activeTenant} />}
            {activeTab === 'qrmenu' && <QrMenuHospitality currentTenant={activeTenant} />}
            {activeTab === 'b2bquotes' && <B2BQuotationModule currentTenant={activeTenant} />}
            {activeTab === 'gibdespatch' && <GibDespatchProducerModule currentTenant={activeTenant} />}
            {activeTab === 'catalog' && <ProductStorefront currentTenant={activeTenant} />}
            {activeTab === 'accounting' && <AccountingModule currentTenant={activeTenant} />}
            {activeTab === 'codebase' && <NestjsCodebase />}
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-6 bg-white text-center text-xs text-slate-400 space-y-2">
        <p className="font-semibold text-slate-600">tampazar.com · Açık Dijital AVM ve Entegre Ticaret İşletim Sistemi</p>
        <p className="max-w-2xl mx-auto text-[11px] text-slate-400 leading-relaxed">
          Fiziksel bir çarşı ve AVM'nin dijital dünyadaki bağımsız karşılığı. Sabit aidat modeli, %0 komisyon, esnafın doğrudan kendi Sanal POS'u ile tahsilat ve GİB UBL-TR 2.1 yerleşik ön muhasebe altyapısı.
        </p>
        <div className="flex justify-center gap-4 pt-2 font-mono text-[10px] text-slate-400">
          <span>NestJS Modüler Mimari</span>
          <span>·</span>
          <span>PostgreSQL RLS Multi-Tenant</span>
          <span>·</span>
          <span>GİB UBL-TR 2.1 E-Belge Motoru</span>
          <span>·</span>
          <span>AES-256 BYO POS</span>
        </div>
      </footer>

    </div>
  );
}
