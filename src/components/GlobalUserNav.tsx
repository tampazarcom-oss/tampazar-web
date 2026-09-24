/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  User, Store, LogOut, ChevronDown, Sparkles, ShoppingBag, 
  FileText, ShieldCheck, Heart, MapPin, Calculator, PlusCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function GlobalUserNav() {
  const { user, isAuthenticated, logout, openAuthModal, switchRole } = useAuth();
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

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => openAuthModal('seller')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition cursor-pointer"
        >
          <Store className="w-3.5 h-3.5 text-amber-600" />
          <span>Esnaf Mağazası Aç</span>
        </button>

        <button
          onClick={() => openAuthModal('buyer')}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-black text-white bg-indigo-900 hover:bg-indigo-800 rounded-xl shadow-xs transition cursor-pointer"
        >
          <User className="w-3.5 h-3.5" />
          <span>Giriş Yap / Kayıt Ol</span>
        </button>
      </div>
    );
  }

  const isSeller = user.role === 'seller';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition cursor-pointer shadow-xs"
      >
        <img 
          src={user.avatar || (isSeller 
            ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" 
            : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100")} 
          alt={user.name} 
          className="w-8 h-8 rounded-xl object-cover border border-slate-200"
        />
        <div className="text-left hidden sm:block">
          <div className="text-xs font-black text-slate-900 leading-tight truncate max-w-[120px]">
            {user.name.split(' ')[0]}
          </div>
          <span className={`text-[9px] font-extrabold uppercase tracking-wider block ${
            isSeller ? 'text-amber-600' : 'text-indigo-600'
          }`}>
            {isSeller ? 'Esnaf Satıcı' : 'Tüketici'}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-fade-in divide-y divide-slate-100 text-xs">
          
          {/* Kullanıcı Bilgisi */}
          <div className="px-4 py-3">
            <span className="font-bold text-slate-900 block truncate">{user.name}</span>
            <span className="text-[11px] text-slate-400 block truncate">{user.email}</span>
            <div className="mt-2 flex items-center justify-between">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                isSeller ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
              }`}>
                {isSeller ? `🏪 ${user.storeName || 'Mağaza Sahibi'}` : '👤 Tüketici'}
              </span>
              <button
                onClick={() => {
                  switchRole(isSeller ? 'buyer' : 'seller');
                  setDropdownOpen(false);
                }}
                className="text-[10px] text-indigo-700 hover:underline font-bold"
              >
                {isSeller ? 'Müşteriye Geç' : 'Esnafa Geç'}
              </button>
            </div>
          </div>

          {/* Menü Linkleri */}
          <div className="py-1">
            {isSeller ? (
              <>
                <Link
                  to="/yonetim"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 font-bold"
                >
                  <Store className="w-4 h-4 text-indigo-600" />
                  <span>SaaS Esnaf Yönetim Paneli</span>
                </Link>
                <Link
                  to="/yonetim"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>TamTeklif (İş Fırsatları)</span>
                </Link>
                <Link
                  to="/saas-konsol/byopos"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Sanal POS (BYO) Ayarları</span>
                </Link>
                <Link
                  to="/saas-konsol/accounting"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  <Calculator className="w-4 h-4 text-amber-600" />
                  <span>GİB e-Fatura & Muhasebe</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/hesabim/taleplerim"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-900 bg-amber-50/60 hover:bg-amber-100/60 font-black"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Fiyat Taleplerim & Teklifler</span>
                </Link>
                <Link
                  to="/hesabim"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 font-bold"
                >
                  <ShoppingBag className="w-4 h-4 text-indigo-600" />
                  <span>Siparişlerim & Faturalarım</span>
                </Link>
                <Link
                  to="/hesabim"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Randevularım & Usta Çağrılarım</span>
                </Link>
                <Link
                  to="/hesabim"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Favorilerim</span>
                </Link>
              </>
            )}
          </div>

          {/* Çıkış Yap */}
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
