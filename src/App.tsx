/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { initialTenants, Tenant } from './data/mockData';
import BrandLogo from './components/BrandLogo';
import MegaMenu from './components/MegaMenu';
import { applyPageSEO } from './utils/seo';
import { Store, ChevronDown, Check, Globe, Layers, CreditCard, Tags, FileText, Code, ShoppingCart, Sparkles, Truck, QrCode, Briefcase, FileSpreadsheet, LayoutDashboard, User, ShoppingBag } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import AuthModal from './components/AuthModal';
import GlobalUserNav from './components/GlobalUserNav';
import NeighborhoodMultiCartModal from './components/NeighborhoodMultiCartModal';
import PWAInstallBanner from './components/pwa/PWAInstallBanner';

const MarketplaceHome = lazy(() => import('./components/MarketplaceHome'));
const SuperMallHome = lazy(() => import('./components/SuperMallHome'));
const StoreProfilePage = lazy(() => import('./components/StoreProfilePage'));
const ProductDetailPage = lazy(() => import('./components/ProductDetailPage'));
const LegalPages = lazy(() => import('./components/LegalPages'));
const TampazarSellerDashboard = lazy(() => import('./components/TampazarSellerDashboard'));
const CustomerAccountPage = lazy(() => import('./components/CustomerAccountPage'));
const B2BWholesaleMarketplace = lazy(() => import('./components/B2BWholesaleMarketplace'));
const CourierDirectoryPage = lazy(() => import('./components/courier/CourierDirectoryPage'));
const CourierOnboardingAndDashboard = lazy(() => import('./components/courier/CourierOnboardingAndDashboard'));
const BlogPage = lazy(() => import('./pages/Blog'));
const BlogSitemap = lazy(() => import('./pages/BlogSitemap'));
const PazaryeriDiscoveryPage = lazy(() => import('./components/PazaryeriDiscoveryPage'));
const SellerPortalPage = lazy(() => import('./components/SellerPortalPage'));

const SystemArchitecture = lazy(() => import('./components/SystemArchitecture'));
const ByoPosConfigurator = lazy(() => import('./components/ByoPosConfigurator'));
const LogisticsIntegration = lazy(() => import('./components/LogisticsIntegration'));
const QrMenuHospitality = lazy(() => import('./components/QrMenuHospitality'));
const B2BQuotationModule = lazy(() => import('./components/B2BQuotationModule'));
const GibDespatchProducerModule = lazy(() => import('./components/GibDespatchProducerModule'));
const ProductStorefront = lazy(() => import('./components/ProductStorefront'));
const AccountingModule = lazy(() => import('./components/AccountingModule'));
const NestjsCodebase = lazy(() => import('./components/NestjsCodebase'));

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

function LegalRouteWrapper({ type }: { type: 'mesafeli-satis' | 'gizlilik' | 'kvkk' | 'cerez-politikasi' | 'iade-ve-degisim' }) {
  const navigate = useNavigate();
  return <LegalPages type={type} onBack={() => navigate('/')} />;
}

function SaaSConsoleRouteWrapper({ activeTenant, handleUpdateTenantPos }: any) {
  const { subTab } = useParams();
  const currentTab = subTab || 'byopos';

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
      {/* SaaS Nav Sub-tabs */}
      <nav aria-label="SaaS Konsol Menüsü" className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-slate-500 overflow-x-auto pb-4 border-b border-slate-200">
        <Link to="/saas-konsol/architecture" className={`transition-colors whitespace-nowrap ${currentTab === 'architecture' ? 'text-[#0F4C3A] border-b-2 border-[#0F4C3A] pb-1 font-black' : 'hover:text-[#0B132B]'}`}>Mimarî</Link>
        <Link to="/saas-konsol/byopos" className={`transition-colors whitespace-nowrap ${currentTab === 'byopos' ? 'text-[#0F4C3A] border-b-2 border-[#0F4C3A] pb-1 font-black' : 'hover:text-[#0B132B]'}`}>Sanal POS (BYO)</Link>
        <Link to="/saas-konsol/logistics" className={`transition-colors whitespace-nowrap ${currentTab === 'logistics' ? 'text-[#0F4C3A] border-b-2 border-[#0F4C3A] pb-1 font-black' : 'hover:text-[#0B132B]'}`}>📦 Kargo (BYO)</Link>
        <Link to="/saas-konsol/qrmenu" className={`transition-colors whitespace-nowrap ${currentTab === 'qrmenu' ? 'text-[#0F4C3A] border-b-2 border-[#0F4C3A] pb-1 font-black' : 'hover:text-[#0B132B]'}`}>📱 QR Masa</Link>
        <Link to="/saas-konsol/b2bquotes" className={`transition-colors whitespace-nowrap ${currentTab === 'b2bquotes' ? 'text-[#0F4C3A] border-b-2 border-[#0F4C3A] pb-1 font-black' : 'hover:text-[#0B132B]'}`}>📑 B2B Teklif</Link>
        <Link to="/saas-konsol/gibdespatch" className={`transition-colors whitespace-nowrap ${currentTab === 'gibdespatch' ? 'text-[#0F4C3A] border-b-2 border-[#0F4C3A] pb-1 font-black' : 'hover:text-[#0B132B]'}`}>🚚 e-İrsaliye</Link>
        <Link to="/saas-konsol/catalog" className={`transition-colors whitespace-nowrap ${currentTab === 'catalog' ? 'text-[#0F4C3A] border-b-2 border-[#0F4C3A] pb-1 font-black' : 'hover:text-[#0B132B]'}`}>Ürün & SEO</Link>
        <Link to="/saas-konsol/accounting" className={`transition-colors whitespace-nowrap ${currentTab === 'accounting' ? 'text-[#0F4C3A] border-b-2 border-[#0F4C3A] pb-1 font-black' : 'hover:text-[#0B132B]'}`}>Ön Muhasebe</Link>
        <Link to="/saas-konsol/codebase" className={`transition-colors whitespace-nowrap ${currentTab === 'codebase' ? 'text-[#0F4C3A] border-b-2 border-[#0F4C3A] pb-1 font-black' : 'hover:text-[#0B132B]'}`}>API Kodları</Link>
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
  const [showMultiCartModal, setShowMultiCartModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Dynamic SEO & Schema.org JSON-LD injection on location change
  useEffect(() => {
    // Only apply fallback SEO if not handled by dedicated detail views
    if (!location.pathname.startsWith('/urun/') && !location.pathname.startsWith('/dukkan/')) {
      applyPageSEO({ pathname: location.pathname });
    }
  }, [location.pathname]);

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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-950">
      
      {/* Top Global Ecosystem Switcher Bar */}
      <div className="bg-[#0B132B] text-white text-[11px] font-medium px-6 py-2 flex items-center justify-between border-b border-[#111B38]">
        <div className="flex items-center gap-2">
          <span className="bg-[#F59E0B] text-[#0B132B] px-2 py-0.5 rounded font-black text-[9px] uppercase tracking-wider shadow-2xs">
            Açık Dijital AVM
          </span>
          <span className="hidden sm:inline text-slate-300">
            tampazar.com — Açık Dijital AVM ve Entegre Ticaret İşletim Sistemi (%0 Komisyon · Doğrudan Esnaf Kasası · GİB e-Fatura)
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/"
            className={`px-2.5 py-1 rounded transition-colors ${
              location.pathname === '/' 
                ? 'bg-[#F59E0B] text-[#0B132B] font-black shadow-xs' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            🏪 Pazaryeri Vitrini
          </Link>
          <Link
            to="/sehir-avm"
            className={`px-2.5 py-1 rounded transition-colors ${
              location.pathname === '/sehir-avm' 
                ? 'bg-[#F59E0B] text-[#0B132B] font-black shadow-xs' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            🏛️ Şehrin Açık AVM'si
          </Link>
          <Link
            to="/pazaryeri"
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 font-semibold ${
              location.pathname.startsWith('/pazaryeri') 
                ? 'bg-[#F59E0B] text-[#0B132B] font-black shadow-xs' 
                : 'text-amber-200 hover:text-white'
            }`}
          >
            🔍 Keşif & Katalog
          </Link>
          <Link
            to="/hesabim"
            className={`px-2.5 py-1 rounded transition-colors ${
              location.pathname === '/hesabim' 
                ? 'bg-[#F59E0B] text-[#0B132B] font-black shadow-xs' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            👤 Tüketici Hesabım
          </Link>
          <Link
            to="/toptan"
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 font-semibold ${
              location.pathname === '/toptan' 
                ? 'bg-[#F59E0B] text-[#0B132B] font-black shadow-xs' 
                : 'text-amber-300 hover:text-white'
            }`}
          >
            🏢 B2B Toptan & Esnaf Ağı
          </Link>
          <Link
            to="/kuryeler"
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 font-semibold ${
              location.pathname.startsWith('/kurye') 
                ? 'bg-[#F59E0B] text-[#0B132B] font-black shadow-xs' 
                : 'text-amber-200 hover:text-white'
            }`}
          >
            🛵 TamKurye
          </Link>
          <Link
            to="/blog"
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 font-semibold ${
              location.pathname.startsWith('/blog')
                ? 'bg-[#F59E0B] text-[#0B132B] font-black shadow-xs' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            📚 Rehber & Blog
          </Link>
          <Link
            to="/saticipaneli"
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 font-extrabold ${
              location.pathname.startsWith('/saticipaneli') 
                ? 'bg-[#F59E0B] text-[#0B132B] shadow-xs' 
                : 'bg-[#0F4C3A] text-amber-300 hover:bg-[#0B382B]'
            }`}
          >
            🏪 Satıcı Ol / Giriş
          </Link>
          <Link
            to="/saas-konsol/byopos"
            className={`px-2.5 py-1 rounded transition-colors ${
              location.pathname.startsWith('/saas-konsol')
                ? 'bg-[#111B38] text-amber-300 font-semibold border border-slate-700' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚙️ Mimari Konsol
          </Link>
        </div>
      </div>

      {/* Header bar for non-home pages */}
      {location.pathname !== '/' && location.pathname !== '/sehir-avm' && (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3 shrink-0">
            <Link 
              to="/"
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#0F4C3A] font-bold"
            >
              ← Vitrine Dön
            </Link>
            <span className="text-slate-300">|</span>
            <BrandLogo size="md" />
            <MegaMenu />
          </div>

          <div className="flex items-center gap-3">
            <GlobalUserNav />

            <div className="relative shrink-0">
              <button
                aria-label="Kiracı / Esnaf Seçim Menüsü"
                onClick={() => setShowTenantDropdown(!showTenantDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 hover:border-[#0F4C3A]/40 rounded-lg text-xs font-semibold text-[#0B132B] bg-white shadow-xs transition-colors cursor-pointer"
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
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${activeTenant.id === t.id ? 'bg-emerald-50 text-[#0F4C3A] font-bold' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{t.logo}</span>
                        <div>
                          <div className="text-slate-800 font-medium">{t.name}</div>
                          <div className="text-[9px] text-slate-400 font-mono">Plan: {t.plan}</div>
                        </div>
                      </div>
                      {activeTenant.id === t.id && (
                        <Check className="w-4 h-4 text-[#10B981]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            </div>
          </div>
        </header>
      )}

      {/* Routes with Suspense */}
      <div className="flex-1 flex flex-col">
        <Suspense fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#0F4C3A] border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
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
              path="/pazaryeri" 
              element={<PazaryeriDiscoveryPage />} 
            />
            <Route 
              path="/pazaryeri/:categorySlug" 
              element={<PazaryeriDiscoveryPage />} 
            />
            <Route 
              path="/saticipaneli" 
              element={<SellerPortalPage onBackToMarketplace={() => navigate('/')} />} 
            />
            <Route 
              path="/saticipaneli/*" 
              element={<SellerPortalPage onBackToMarketplace={() => navigate('/')} />} 
            />
            <Route 
              path="/dukkan/:slug" 
              element={<StoreProfileRouteWrapper />} 
            />
            <Route 
              path="/magaza/:slug" 
              element={<StoreProfileRouteWrapper />} 
            />
            <Route 
              path="/urun/:slug" 
              element={<ProductDetailRouteWrapper />} 
            />
            <Route 
              path="/hizmet/:slug" 
              element={<ProductDetailRouteWrapper />} 
            />
            <Route 
              path="/toptan" 
              element={<B2BWholesaleMarketplace />} 
            />
            <Route 
              path="/toptan/:id" 
              element={<B2BWholesaleMarketplace />} 
            />
            <Route 
              path="/kuryeler" 
              element={<CourierDirectoryPage onBackToMarketplace={() => navigate('/')} />} 
            />
            <Route 
              path="/kurye-ol" 
              element={<CourierOnboardingAndDashboard onBackToMarketplace={() => navigate('/kuryeler')} />} 
            />
            <Route 
              path="/yonetim/kurye" 
              element={<CourierOnboardingAndDashboard onBackToMarketplace={() => navigate('/yonetim')} />} 
            />
            <Route 
              path="/blog" 
              element={<BlogPage onBackToMarketplace={() => navigate('/')} />} 
            />
            <Route 
              path="/blog/:slug" 
              element={<BlogPage onBackToMarketplace={() => navigate('/')} />} 
            />
            <Route 
              path="/sitemap-blog.xml" 
              element={<BlogSitemap />} 
            />
            <Route 
              path="/sitemap.xml" 
              element={<BlogSitemap />} 
            />
            <Route 
              path="/hesabim" 
              element={<CustomerAccountPage />} 
            />
            <Route 
              path="/hesabim/taleplerim" 
              element={<CustomerAccountPage />} 
            />
            <Route 
              path="/hesabim/taleplerim/:id" 
              element={<CustomerAccountPage />} 
            />
            <Route 
              path="/hesabim/dijital-arsivim" 
              element={<CustomerAccountPage />} 
            />
            <Route 
              path="/hesabim/randevularim" 
              element={<CustomerAccountPage />} 
            />
            <Route 
              path="/hesabim/sadakat" 
              element={<CustomerAccountPage />} 
            />
            <Route 
              path="/hesabim/ikramlar" 
              element={<CustomerAccountPage />} 
            />
            <Route 
              path="/yonetim" 
              element={
                <TampazarSellerDashboard 
                  onNavigate={(tab) => {
                    if (tab === 'home') navigate('/');
                    else if (tab === 'store-profile') navigate(`/dukkan/${activeTenant.slug}`);
                    else navigate(`/saas-konsol/${tab}`);
                  }} 
                  activeStoreName={activeTenant.name} 
                />
              } 
            />
            <Route 
              path="/yonetim/afis" 
              element={
                <TampazarSellerDashboard 
                  onNavigate={(tab) => {
                    if (tab === 'home') navigate('/');
                    else if (tab === 'store-profile') navigate(`/dukkan/${activeTenant.slug}`);
                    else navigate(`/saas-konsol/${tab}`);
                  }} 
                  activeStoreName={activeTenant.name} 
                />
              } 
            />
            <Route 
              path="/yonetim/sadakat" 
              element={
                <TampazarSellerDashboard 
                  onNavigate={(tab) => {
                    if (tab === 'home') navigate('/');
                    else if (tab === 'store-profile') navigate(`/dukkan/${activeTenant.slug}`);
                    else navigate(`/saas-konsol/${tab}`);
                  }} 
                  activeStoreName={activeTenant.name} 
                />
              } 
            />
            <Route 
              path="/yonetim/:subTab" 
              element={
                <TampazarSellerDashboard 
                  onNavigate={(tab) => {
                    if (tab === 'home') navigate('/');
                    else if (tab === 'store-profile') navigate(`/dukkan/${activeTenant.slug}`);
                    else navigate(`/saas-konsol/${tab}`);
                  }} 
                  activeStoreName={activeTenant.name} 
                />
              } 
            />
            <Route 
              path="/yonetim/ayarlar/:subTab" 
              element={
                <TampazarSellerDashboard 
                  onNavigate={(tab) => {
                    if (tab === 'home') navigate('/');
                    else if (tab === 'store-profile') navigate(`/dukkan/${activeTenant.slug}`);
                    else navigate(`/saas-konsol/${tab}`);
                  }} 
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
            {/* Legal Routes */}
            <Route path="/mesafeli-satis" element={<LegalRouteWrapper type="mesafeli-satis" />} />
            <Route path="/gizlilik" element={<LegalRouteWrapper type="gizlilik" />} />
            <Route path="/kvkk" element={<LegalRouteWrapper type="kvkk" />} />
            <Route path="/cerez-politikasi" element={<LegalRouteWrapper type="cerez-politikasi" />} />
            <Route path="/iade-ve-degisim" element={<LegalRouteWrapper type="iade-ve-degisim" />} />
          </Routes>
        </Suspense>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-6 bg-white text-center text-xs text-slate-400 space-y-3 mt-auto">
        <p className="sr-only font-bold">TamPazar Açık Dijital AVM ve Hibrit Pazaryeri</p>
        <p className="font-semibold text-slate-600">tampazar.com · Açık Dijital AVM ve Entegre Ticaret İşletim Sistemi</p>
        <p className="max-w-2xl mx-auto text-[11px] text-slate-400 leading-relaxed">
          Fiziksel bir çarşı ve AVM'nin dijital dünyadaki bağımsız karşılığı. Sabit aidat modeli, %0 komisyon, esnafın doğrudan kendi Sanal POS'u ile tahsilat ve GİB UBL-TR 2.1 yerleşik ön muhasebe altyapısı.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2 text-[11px] font-medium text-slate-500">
          <Link to="/blog" className="text-amber-600 hover:text-amber-700 font-bold transition-colors">📚 Rehber & Blog</Link>
          <span>·</span>
          <Link to="/sitemap-blog.xml" className="text-emerald-700 hover:text-emerald-800 font-bold transition-colors">🗺️ Blog Sitemap (SEO)</Link>
          <span>·</span>
          <Link to="/mesafeli-satis" className="hover:text-indigo-900 transition-colors">Mesafeli Satış</Link>
          <span>·</span>
          <Link to="/gizlilik" className="hover:text-indigo-900 transition-colors">Gizlilik Politikası</Link>
          <span>·</span>
          <Link to="/kvkk" className="hover:text-indigo-900 transition-colors">KVKK</Link>
          <span>·</span>
          <Link to="/cerez-politikasi" className="hover:text-indigo-900 transition-colors">Çerez Politikası</Link>
          <span>·</span>
          <Link to="/iade-ve-degisim" className="hover:text-indigo-900 transition-colors">İade ve Değişim</Link>
        </div>
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

      {/* Global Role-Based Authentication & Registration Modal */}
      <AuthModal />

      {/* TamKurye: Mahalle Çoklu Dükkan Sepeti Modal */}
      <NeighborhoodMultiCartModal
        isOpen={showMultiCartModal}
        onClose={() => setShowMultiCartModal(false)}
      />

      {/* PWA: Mobil Ana Ekrana Ekleme Çubuğu & Bannerı */}
      <PWAInstallBanner />

      {/* Floating Mahalle Sepeti Butonu */}
      <button
        onClick={() => setShowMultiCartModal(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#0F4C3A] via-[#0B132B] to-[#0F4C3A] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl border-2 border-amber-400/80 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer group"
        aria-label="Mahalle Çoklu Sepeti"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
            3
          </span>
        </div>
        <div className="text-left hidden sm:block">
          <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-wider block leading-none">
            %0 Komisyon · Doğrudan Esnafa
          </span>
          <span className="text-xs font-black text-white block">
            TamKurye Mahalle Sepeti
          </span>
        </div>
      </button>

    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}
