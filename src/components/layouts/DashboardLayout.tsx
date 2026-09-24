/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, X, Bell, LogOut, ShieldCheck, ChevronRight, User, 
  Store, Bike, LayoutDashboard, Settings, ArrowLeft, Radio
} from 'lucide-react';
import { useAuth, UserRole } from '../../context/AuthContext';
import BrandLogo from '../BrandLogo';

export interface SidebarNavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
  badge?: string;
  badgeColor?: string;
}

interface DashboardLayoutProps {
  role: 'merchant' | 'admin' | 'courier' | 'customer';
  title: string;
  subtitle?: string;
  navItems: SidebarNavItem[];
  activeItemId: string;
  onSelectNavItem?: (id: string) => void;
  headerActions?: ReactNode;
  children: ReactNode;
}

export default function DashboardLayout({
  role,
  title,
  subtitle,
  navItems,
  activeItemId,
  onSelectNavItem,
  headerActions,
  children
}: DashboardLayoutProps) {
  const { user, logout, updateCourierStatus } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Style configurations by role
  const themeStyles = {
    merchant: {
      sidebarBg: 'bg-[#0B132B] border-r border-[#111B38]',
      sidebarHeaderBg: 'bg-[#0F4C3A]',
      activeNavBg: 'bg-[#0F4C3A] text-white font-extrabold shadow-md border-l-4 border-[#F59E0B]',
      inactiveNavText: 'text-slate-300 hover:bg-[#111B38] hover:text-white',
      headerBg: 'bg-white/95 border-b border-slate-200',
      badgeBg: 'bg-[#0F4C3A] text-white',
      accentColor: '#0F4C3A',
      roleBadge: '🏪 ESNAF SANAL POS VE DÜKKAN YÖNETİMİ'
    },
    admin: {
      sidebarBg: 'bg-[#0F172A] border-r border-slate-800',
      sidebarHeaderBg: 'bg-slate-900 border-b border-slate-800',
      activeNavBg: 'bg-[#F59E0B] text-slate-950 font-black shadow-lg border-l-4 border-amber-300',
      inactiveNavText: 'text-slate-400 hover:bg-slate-800 hover:text-white',
      headerBg: 'bg-slate-900/95 border-b border-slate-800 text-white',
      badgeBg: 'bg-[#F59E0B] text-slate-950 font-black',
      accentColor: '#F59E0B',
      roleBadge: '🛡️ SÜPER ADMİN PLATFORM YÖNETİMİ'
    },
    courier: {
      sidebarBg: 'bg-[#0B132B] border-r border-[#111B38]',
      sidebarHeaderBg: 'bg-[#0F4C3A]',
      activeNavBg: 'bg-[#10B981] text-[#0B132B] font-black shadow-lg border-l-4 border-amber-400',
      inactiveNavText: 'text-emerald-100 hover:bg-[#111B38] hover:text-white',
      headerBg: 'bg-white/95 border-b border-emerald-100',
      badgeBg: 'bg-[#10B981] text-[#0B132B] font-extrabold',
      accentColor: '#10B981',
      roleBadge: '🛵 TAMKURYE BAĞIMSIZ SAHA SİSTEMİ'
    },
    customer: {
      sidebarBg: 'bg-white border-r border-slate-200',
      sidebarHeaderBg: 'bg-indigo-900 text-white',
      activeNavBg: 'bg-indigo-900 text-white font-extrabold shadow-md border-l-4 border-amber-400',
      inactiveNavText: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
      headerBg: 'bg-white/95 border-b border-slate-200',
      badgeBg: 'bg-indigo-900 text-white',
      accentColor: '#312E81',
      roleBadge: '👤 TÜKETİCİ HESAP PANELİ'
    }
  };

  const currentTheme = themeStyles[role] || themeStyles.merchant;

  const handleNavClick = (item: SidebarNavItem) => {
    if (onSelectNavItem) {
      onSelectNavItem(item.id);
    }
    if (item.path) {
      navigate(item.path);
    }
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-amber-100 selection:text-amber-950">
      
      {/* Top Header */}
      <header className={`sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between backdrop-blur-md ${currentTheme.headerBg}`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-xl border border-slate-300/40 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Menüyü Aç"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2">
            <BrandLogo size="sm" />
          </Link>

          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-300/40">
            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider ${currentTheme.badgeBg}`}>
              {currentTheme.roleBadge}
            </span>
          </div>
        </div>

        {/* Right Action Items */}
        <div className="flex items-center gap-3">
          {/* Courier Live Status Toggle */}
          {role === 'courier' && user && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${user.courierStatus === 'available' ? 'bg-emerald-400' : 'bg-rose-400'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${user.courierStatus === 'available' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
              </span>
              <span>
                {user.courierStatus === 'available' ? 'Müsait (Görev Bekliyor)' : 'Meşgul / Görevde'}
              </span>
              <button
                onClick={() => updateCourierStatus(user.courierStatus === 'available' ? 'busy' : 'available')}
                className="ml-1 text-[10px] bg-white border border-emerald-300 px-2 py-0.5 rounded-md hover:bg-emerald-100 text-slate-800 transition cursor-pointer"
              >
                Değiştir
              </button>
            </div>
          )}

          {headerActions}

          {/* Quick Home Link */}
          <Link
            to="/"
            className="p-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pazaryerine Dön</span>
          </Link>

          {/* Notifications */}
          <button 
            aria-label="Bildirimler"
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 relative transition cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
          </button>

          {/* User Profile Summary */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <img
                src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                alt={user.name}
                className="w-8 h-8 rounded-xl object-cover border border-slate-200"
              />
              <div className="text-left hidden md:block">
                <div className="text-xs font-extrabold text-slate-900 truncate max-w-[120px]">
                  {user.name.split(' ')[0]}
                </div>
                <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                  {user.storeName || user.email}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex relative">
        
        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)} 
            className="fixed inset-0 bg-slate-950/60 z-40 md:hidden backdrop-blur-xs"
          />
        )}

        {/* Sidebar Navigation */}
        <aside className={`fixed md:sticky top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-64 ${currentTheme.sidebarBg} transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } flex flex-col shrink-0 overflow-y-auto`}>
          
          {/* User / Store Header inside Sidebar */}
          <div className={`p-4 ${currentTheme.sidebarHeaderBg} text-white`}>
            <div className="text-[10px] font-mono uppercase tracking-widest text-slate-300 font-bold mb-1">
              TamPazar Panel
            </div>
            <div className="text-sm font-black truncate">
              {user?.storeName || user?.name || title}
            </div>
            {subtitle && (
              <div className="text-xs text-slate-300/90 truncate mt-0.5 font-medium">
                {subtitle}
              </div>
            )}
          </div>

          {/* Nav Items List */}
          <nav aria-label="Sol Panel Gezintisi" className="p-3 space-y-1.5 flex-1">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeItemId === item.id || (item.path && location.pathname === item.path);

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition cursor-pointer text-left ${
                    isActive
                      ? currentTheme.activeNavBg
                      : currentTheme.inactiveNavText
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <IconComp className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[9.5px] font-black px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-amber-400 text-slate-950'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer Logout */}
          <div className="p-3 border-t border-slate-700/40">
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Güvenli Oturumu Kapat</span>
            </button>
          </div>

        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden max-w-7xl mx-auto w-full">
          {children}
        </main>

      </div>
    </div>
  );
}
