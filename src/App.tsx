/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams, Link } from 'react-router-dom';
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

function StoreProfileRouteWrapper() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const storeId = slug || 'atolye-zanaat';
  return (
    <StoreProfilePage 
      storeId={storeId}
      onBackToMarketplace={() => navigate('/')}
      onOpenSaaSConsole={(tab = 'byopos') => navigate(`/saas-konsol/${tab}`)}
    />
  );
}

function ProductDetailRouteWrapper() {
  const { slug } = useParams();
  const navigate = useNavigate();
  return (
    <ProductDetailPage 
      slug={slug || 'minimalist-deri-oxford-ayakkabi'}
      onBackToMarketplace={() => navigate('/')}
    />
  );
}

function SaaSConsoleRouteWrapper({ activeTenant, handleUpdateTenantPos }: any) {
  const { subTab } = useParams();
  const currentTab = subTab || 'byopos';

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
      {/* SaaS Nav Sub-tabs */}
      <nav className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-slate-500 overflow-x-auto pb-4 border-b border-slate-200">
        <Link to="/saas-konsol/architecture" className={`transition-colors whitespace-nowrap ${currentTab === 'architecture' ? 'text-indigo-900 border-b-2 border-indigo-900 pb-1 font-bold' : 'hover:text-slate-900'}`}>Mimarî</Link>
        <Link to="/saas-konsol/byopos" className={`transition-colors whitespace-nowrap ${currentTab === 'byopos' ? 'text-indigo-900 border-b-2 border-indigo-900 pb-1 font-bold' : 'hover:text-slate-900'}`}>Sanal POS (BYO)</Link>
        <Link to="/saas-konsol/logistics" className={`transition-colors whitespace-nowrap ${currentTab === 'logistics' ? 'text-indigo-900 border-b-2 border-indigo-900 pb-1 font-bold' : 'hover:text-slate-900'}`}>📦 Kargo (BYO)</Link>
        <Link to="/saas-konsol/qrmenu" className={`transition-colors whitespace-nowrap ${currentTab === 'qrmenu' ? 'text-indigo-900 border-b-2 border-indigo-900 pb-1 font-bold' : 'hover:text-slate-900'}`}>📱 QR Masa</Link>
        <Link to="/saas-konsol/b2bquotes" className={`transition-colors whitespace-nowrap ${currentTab === 'b2bquotes' ? 'text-indigo-900 border-b-2 border-indigo-900 pb-1 font-bold' : 'hover:text-slate-900'}`}>📑 B2B Teklif</Link>
        <Link to="/saas-konsol/gibdespatch" className={`transition-colors whitespace-nowrap ${currentTab === 'gibdespatch' ? 'text-indigo-900 border-b-2 border-indigo-900 pb-1 font-bold' : 'hover:text-slate-900'}`}>🚚 e-İrsaliye</Link>
        <Link to="/saas-konsol/catalog" className={`transition-colors whitespace-nowrap ${currentTab === 'catalog' ? 'text-indigo-900 border-b-2 border-indigo-900 pb-1 font-bold' : 'hover:text-slate-900'}`}>Ürün & SEO</Link>
        <Link to="/saas-konsol/accounting" className={`transition-colors whitespace-nowrap ${currentTab === 'accounting' ? 'text-indigo-900 border-b-2 border-indigo-900 pb-1 font-bold' : 'hover:text-slate-900'}`}>Ön Muhasebe</Link>
        <Link to="/saas-konsol/codebase" className={`transition-colors whitespace-nowrap ${currentTab === 'codebase' ? 'text-indigo-900 border-b-2 border-indigo-900 pb-1 font-bold' : 'hover:text-slate-900'}`}>API Kodları</Link>
      </nav>

      <div className="transition-all duration-300">
        {currentTab === 'architecture' && <SystemArchitecture />}
        {currentTab === 'byopos' && <ByoPosConfigurator currentTenant={activeTenant} onUpdateTenantPos={handleUpdateTenantPos} />}
        {currentTab === 'logistics' && <LogisticsIntegration currentTenant={activeTenant} />}
        {currentTab === 'qrmenu' && <QrMenuHospitality currentTenant={activeTenant} />}
        {currentTab === 'b2bquotes' && <B2BQuotationModule currentTenant={activeTenant} />}
        {currentTab === 'gibdespatch' && <GibDespatchProducerModule currentTenant={activeTenant} />}
        {currentTab === 'catalog' && <ProductStorefront currentTenant={activeTenant} />}
        {currentTab === 'accounting' && <AccountingModule currentTenant={activeTenant} />}
        {currentTab === 'codebase' && <NestjsCodebase />}
      </div>
    </main>
  );
}

function MainLayout() {
  const [tenants, setTenants] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem('tampazar_tenants');
    return saved ? JSON.parse(saved) : initialTenants;
  });

  const [activeTenant, setActiveTenant] = useState<Tenant>(tenants[0]);
  const [showTenantDropdown, setShowTenantDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

    const nextActive = updated.find(t => t.id === tenantId);
    if (nextActive) setActiveTenant(nextActive);
  };

  const handleNavigateToStoreFromHome = (storeId: string) => {
    navigate(`/dukkan/${storeId}`);
  };

  const handleNavigateToProduct = (slug: string) => {
    navigate(`/urun/${slug}`);
  };

  const handleOpenSellerDashboard = (tab: string = 'byopos') => {
    navigate(`/saas-konsol/${tab}`);
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
          <Link
            to="/"
            className={`px-2.5 py-1 rounded transition-colors ${
              location.pathname === '/' 
                ? 'bg-amber-400 text-slate-950 font-bold shadow-xs' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            🏪 Pazaryeri Vitrini
          </Link>
          <Link
            to="/sehir-avm"
            className={`px-2.5 py-1 rounded transition-colors ${
              location.pathname === '/sehir-avm' 
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            🏬 Şehrin Açık Dijital AVM'si
          </Link>
          <Link
            to={`/dukkan/${activeTenant.slug}`}
            className={`px-2.5 py-1 rounded transition-colors ${
              location.pathname.startsWith('/dukkan') 
                ? 'bg-indigo-600 text-white font-bold shadow-xs' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            🏷️ Dükkân Kimliği
          </Link>
          <Link
            to="/yonetim"
            className={`px-2.5 py-1 rounded transition-colors ${
              location.pathname === '/yonetim' 
                ? 'bg-emerald-500 text-slate-950 font-black shadow-xs' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            📊 Esnaf Yönetim Paneli
          </Link>
          <span className="text-slate-700">|</span>
          <Link
            to="/saas-konsol/byopos"
            className={`px-2.5 py-1 rounded transition-colors ${
              location.pathname.startsWith('/saas-konsol')
                ? 'bg-slate-800 text-amber-300 font-semibold border border-slate-700' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚙️ SaaS Satıcı & Mimari Konsol
          </Link>
        </div>
      </div>

      {/* Header bar for non-home pages */}
      {location.pathname !== '/' && location.pathname !== '/sehir-avm' && (
        <header className="sticky top-0 z-40 bg-[#FDFDFD]/90 backdrop-blur-md border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3 shrink-0">
            <Link 
              to="/"
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 font-semibold"
            >
              ← Vitrine Dön
            </Link>
            <span className="text-slate-300">|</span>
            <a href="https://tampazar.com/" className="flex items-center cursor-pointer" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
              <img 
                src="/logo.png" 
                alt="TamPazar" 
                className="h-10 w-auto object-contain block" 
              />
            </a>
          </div>

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

      {/* Routes */}
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route 
            path="/" 
            element={
              <MarketplaceHome 
                onNavigateToStore={handleNavigateToStoreFromHome}
                onOpenSellerDashboard={handleOpenSellerDashboard}
                onNavigateToSuperMall={() => navigate('/sehir-avm')}
                onNavigateToProduct={handleNavigateToProduct}
              />
            } 
          />
          <Route 
            path="/sehir-avm" 
            element={
              <SuperMallHome 
                onNavigateToStore={handleNavigateToStoreFromHome}
                onNavigateToProduct={handleNavigateToProduct}
                onOpenSaaSConsole={handleOpenSellerDashboard}
                onBackToMarketplace={() => navigate('/')}
              />
            } 
          />
          <Route 
            path="/dukkan/:slug" 
            element={<StoreProfileRouteWrapper />} 
          />
          <Route 
            path="/urun/:slug" 
            element={<ProductDetailRouteWrapper />} 
          />
          <Route 
            path="/yonetim" 
            element={
              <TampazarSellerDashboard 
                onNavigate={(tab) => navigate(`/saas-konsol/${tab}`)} 
                activeStoreName={activeTenant.name} 
              />
            } 
          />
          <Route 
            path="/saas-konsol/:subTab" 
            element={
              <SaaSConsoleRouteWrapper 
                activeTenant={activeTenant} 
                handleUpdateTenantPos={handleUpdateTenantPos} 
              />
            } 
          />
          <Route 
            path="/saas-konsol" 
            element={
              <SaaSConsoleRouteWrapper 
                activeTenant={activeTenant} 
                handleUpdateTenantPos={handleUpdateTenantPos} 
              />
            } 
          />
        </Routes>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-6 bg-white text-center text-xs text-slate-400 space-y-2 mt-auto">
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

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}
