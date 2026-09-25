/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  User, Store, LogOut, ChevronDown, Sparkles, ShoppingBag, 
  ShieldCheck, Heart, MapPin, Calculator, Bike, BarChart3, Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function GlobalUserNav() {
  const { user, isAuthenticated, logout, openAuthModal, switchRole, getNormalizedRole } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 1. UNAUTHENTICATED STATE
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/saticipaneli"
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-black text-[#0B132B] bg-[#F59E0B] hover:bg-amber-400 rounded-xl transition cursor-pointer shadow-xs border border-amber-500/30"
        >
          <Store className="w-3.5 h-3.5 text-[#0B132B]" />
          <span>Satıcı Ol / Dükkan Aç</span>
        </Link>

        <Link
          to="/giris"
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-black text-white bg-indigo-900 hover:bg-indigo-800 rounded-xl shadow-xs transition cursor-pointer"
        >
          <User className="w-3.5 h-3.5" />
          <span>Giriş Yap / Üye Ol</span>
        </Link>
      </div>
    );
  }

  // 2. AUTHENTICATED STATE
  const currentRole = getNormalizedRole();

  const roleConfigs = {
    merchant: {
      label: 'Esnaf Satıcı',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      tagColor: 'text-amber-600',
      avatarFallback: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
    },
    customer: {
      label: 'Müşteri / Tüketici',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      tagColor: 'text-indigo-600',
      avatarFallback: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
    },
    courier: {
      label: 'TamKurye Sürücü',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      tagColor: 'text-emerald-600',
      avatarFallback: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100'
    },
    admin: {
      label: 'Süper Admin',
      badgeColor: 'bg-slate-900 text-amber-400 border-amber-400',
      tagColor: 'text-amber-500',
      avatarFallback: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
    }
  };

  const config = roleConfigs[currentRole] || roleConfigs.customer;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition cursor-pointer shadow-xs"
      >
        <img 
          src={user.avatar || config.avatarFallback} 
          alt={user.name} 
          className="w-8 h-8 rounded-xl object-cover border border-slate-200"
        />
        <div className="text-left hidden sm:block">
          <div className="text-xs font-black text-slate-900 leading-tight truncate max-w-[120px]">
            {user.name.split(' ')[0]}
          </div>
          <span className={`text-[9px] font-extrabold uppercase tracking-wider block ${config.tagColor}`}>
            {config.label}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-fade-in divide-y divide-slate-100 text-xs">
          
          {/* User Info Header */}
          <div className="px-4 py-3">
            <span className="font-bold text-slate-900 block truncate">{user.name}</span>
            <span className="text-[11px] text-slate-400 block truncate">{user.email}</span>
            <div className="mt-2 flex items-center justify-between">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${config.badgeColor}`}>
                {user.storeName || config.label}
              </span>
              <span className="text-[10px] font-mono text-emerald-600 font-bold">Oturum Aktif</span>
            </div>
          </div>

          {/* Role Specific Dropdown Links */}
          <div className="py-1">
            {/* A) MERCHANT / ESNAF */}
            {currentRole === 'merchant' && (
              <>
                <Link
                  to={`/dukkan/${user.storeId || 'atolye-zanaat'}`}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 font-bold"
                >
                  <Store className="w-4 h-4 text-amber-600" />
                  <span>Mağazamı Gör</span>
                </Link>
                <Link
                  to="/yonetim"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-900 bg-amber-50 hover:bg-amber-100 font-black"
                >
                  <ShieldCheck className="w-4 h-4 text-[#0F4C3A]" />
                  <span>Yönetim Paneli</span>
                </Link>
                <Link
                  to="/saticipaneli"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  <Calculator className="w-4 h-4 text-indigo-600" />
                  <span>Abonelik Durumu (%0 Komisyon)</span>
                </Link>
              </>
            )}

            {/* B) CUSTOMER / MÜŞTERİ */}
            {currentRole === 'customer' && (
              <>
                <Link
                  to="/hesabim"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 font-bold"
                >
                  <ShoppingBag className="w-4 h-4 text-indigo-600" />
                  <span>Siparişlerim & Faturalarım</span>
                </Link>
                <Link
                  to="/hesabim/sadakat"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-900 bg-amber-50 hover:bg-amber-100 font-black"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Mahalle Sadakat Kartım</span>
                </Link>
                <Link
                  to="/hesabim"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  <User className="w-4 h-4 text-slate-600" />
                  <span>Hesap Ayarları & Adresler</span>
                </Link>
              </>
            )}

            {/* C) COURIER / KURYE */}
            {currentRole === 'courier' && (
              <>
                <Link
                  to="/kurye/panel"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-[#0B132B] bg-emerald-50 hover:bg-emerald-100 font-black"
                >
                  <Bike className="w-4 h-4 text-[#10B981]" />
                  <span>Aktif Görevler & Radar</span>
                </Link>
                <Link
                  to="/kurye/panel"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Kazançlarım & Günlük Hasılat</span>
                </Link>
              </>
            )}

            {/* D) ADMIN / SÜPER ADMİN */}
            {currentRole === 'admin' && (
              <>
                <Link
                  to="/sistem-admin"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-amber-900 bg-amber-100 hover:bg-amber-200 font-black"
                >
                  <Lock className="w-4 h-4 text-slate-950" />
                  <span>Süper Konsol Yönetimi</span>
                </Link>
                <Link
                  to="/sistem-admin"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  <span>Platform Raporları & PayTR</span>
                </Link>
              </>
            )}
          </div>

          {/* 3 FARKLI YÖNETİM PANELİ GEÇİŞ KÖPRÜSÜ */}
          <div className="py-2 px-3 bg-slate-50 space-y-1.5 border-t border-slate-100">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block px-1">
              Yönetim Panelleri (3 Ayrı Portal):
            </span>
            <div className="grid grid-cols-3 gap-1 text-[10px]">
              <Link
                to="/sistem-admin"
                onClick={() => { switchRole('admin'); setDropdownOpen(false); }}
                className={`p-1.5 rounded-lg text-center font-bold transition flex flex-col items-center gap-0.5 ${
                  currentRole === 'admin' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
                title="Sistem Admin Paneli"
              >
                <span>🛡️</span>
                <span className="truncate w-full font-black">1. Admin</span>
              </Link>
              <Link
                to="/saticipaneli"
                onClick={() => { switchRole('merchant'); setDropdownOpen(false); }}
                className={`p-1.5 rounded-lg text-center font-bold transition flex flex-col items-center gap-0.5 ${
                  currentRole === 'merchant' ? 'bg-[#0F4C3A] text-white font-black' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
                title="Satıcı / Esnaf Paneli"
              >
                <span>🏪</span>
                <span className="truncate w-full font-black">2. Satıcı</span>
              </Link>
              <Link
                to="/musteri-paneli"
                onClick={() => { switchRole('customer'); setDropdownOpen(false); }}
                className={`p-1.5 rounded-lg text-center font-bold transition flex flex-col items-center gap-0.5 ${
                  currentRole === 'customer' ? 'bg-indigo-600 text-white font-black' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
                title="Müşteri / Kullanıcı Paneli"
              >
                <span>👤</span>
                <span className="truncate w-full font-black">3. Müşteri</span>
              </Link>
            </div>
          </div>

          {/* Logout */}
          <div className="py-1">
            <button
              onClick={() => {
                logout();
                setDropdownOpen(false);
                navigate('/');
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50 font-bold text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Güvenli Çıkış Yap</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
