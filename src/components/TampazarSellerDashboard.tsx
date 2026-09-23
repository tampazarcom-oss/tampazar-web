/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard, ShoppingCart, ArrowDownLeft, FileText, Truck,
  Users, Building2, Package, Wallet, BarChart3, Calculator,
  Store, Settings, Search, Calendar, Bot, Bell,
  TrendingUp, TrendingDown, ArrowUpRight, DollarSign, Euro,
  ChevronDown, PlusCircle, CheckCircle2, ShieldCheck, Download,
  Layers, ArrowLeft, ExternalLink, Sparkles
} from 'lucide-react';

interface TampazarSellerDashboardProps {
  onNavigate?: (tab: string, subParam?: any) => void;
  activeStoreName?: string;
}

export default function TampazarSellerDashboard({
  onNavigate,
  activeStoreName = 'Foto Sentez'
}: TampazarSellerDashboardProps) {
  const [activePeriod, setActivePeriod] = useState<'BU_AY' | 'SON_30' | 'GECEN_AY' | 'BU_YIL'>('BU_AY');
  const [currentStore, setCurrentStore] = useState<string>(activeStoreName);
  const [activeSidebarItem, setActiveSidebarItem] = useState<string>('dashboard');
  const [quickSearchTerm, setQuickSearchTerm] = useState('');

  const handleSidebarClick = (itemKey: string, targetTab?: string) => {
    setActiveSidebarItem(itemKey);
    if (targetTab && onNavigate) {
      onNavigate(targetTab);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row font-sans">
      
      {/* ========================================================= */}
      {/* 1. SOL KURUMSAL MENÜ (tampazar.com İndigo & Slate Mimarisi) */}
      {/* ========================================================= */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen select-none border-r border-slate-800">
        
        {/* Logo Alanı */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white text-base shadow-sm">
            T
          </div>
          <div>
            <span className="font-black text-lg tracking-tight text-white">
              tam<span className="text-amber-400">pazar</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-400 block -mt-1">
              Esnaf & Yönetim Sistemi
            </span>
          </div>
        </div>

        {/* Hızlı Arama */}
        <div className="p-4">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              value={quickSearchTerm}
              onChange={(e) => setQuickSearchTerm(e.target.value)}
              placeholder="Modül, cari veya fatura ara..." 
              className="w-full bg-slate-800/80 text-xs text-white rounded-xl pl-8 pr-3 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Menü Hiyerarşisi */}
        <nav className="flex-1 px-3 space-y-1 text-xs font-semibold overflow-y-auto">
          <button
            onClick={() => handleSidebarClick('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-left cursor-pointer ${
              activeSidebarItem === 'dashboard' 
                ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Ana Sayfa
          </button>

          <button
            onClick={() => handleSidebarClick('satislar', 'accounting')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-left cursor-pointer ${
              activeSidebarItem === 'satislar' 
                ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShoppingCart className="w-4 h-4" /> Satışlar & Siparişler
          </button>

          <button
            onClick={() => handleSidebarClick('alislar', 'accounting')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-left cursor-pointer ${
              activeSidebarItem === 'alislar' 
                ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" /> Alışlar & Faturalar
          </button>

          <button
            onClick={() => handleSidebarClick('teklifler', 'b2bquotes')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-left cursor-pointer ${
              activeSidebarItem === 'teklifler' 
                ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-4 h-4" /> Teklifler & B2B Formlar
          </button>

          <button
            onClick={() => handleSidebarClick('irsaliyeler', 'gibdespatch')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-left cursor-pointer ${
              activeSidebarItem === 'irsaliyeler' 
                ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Truck className="w-4 h-4" /> İrsaliyeler & Sevkiyat
          </button>

          <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Cari & Stok
          </div>

          <button
            onClick={() => handleSidebarClick('musteriler', 'accounting')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-left cursor-pointer ${
              activeSidebarItem === 'musteriler' 
                ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4" /> Müşteriler (Cariler)
          </button>

          <button
            onClick={() => handleSidebarClick('tedarikciler', 'accounting')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-left cursor-pointer ${
              activeSidebarItem === 'tedarikciler' 
                ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-4 h-4" /> Tedarikçiler
          </button>

          <button
            onClick={() => handleSidebarClick('urunler', 'catalog')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-left cursor-pointer ${
              activeSidebarItem === 'urunler' 
                ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Package className="w-4 h-4" /> Ürün & Hizmet Listesi
          </button>

          <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Finans & POS
          </div>

          <button
            onClick={() => handleSidebarClick('nakit', 'byopos')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-left cursor-pointer ${
              activeSidebarItem === 'nakit' 
                ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Wallet className="w-4 h-4" /> Kasa & Banka (POS)
          </button>

          <button
            onClick={() => handleSidebarClick('raporlar', 'accounting')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-left cursor-pointer ${
              activeSidebarItem === 'raporlar' 
                ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Finansal Raporlar
          </button>

          <button
            onClick={() => handleSidebarClick('efatura', 'accounting')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-left cursor-pointer ${
              activeSidebarItem === 'efatura' 
                ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Calculator className="w-4 h-4" /> GİB e-Fatura / e-Arşiv
          </button>

          <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Dükkân & Sistem
          </div>

          <button
            onClick={() => onNavigate && onNavigate('store-profile')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-amber-400 hover:bg-slate-800/60 transition text-left cursor-pointer font-bold"
          >
            <Store className="w-4 h-4" /> Açık Vitrinimi Gör ↗
          </button>

          <button
            onClick={() => handleSidebarClick('ayarlar', 'byopos')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-left cursor-pointer ${
              activeSidebarItem === 'ayarlar' 
                ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Settings className="w-4 h-4" /> POS & Mağaza Ayarları
          </button>
        </nav>

        {/* Profil Alanı */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/50">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black flex items-center justify-center text-xs">
              SK
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-white block truncate">Serkan Koç</span>
              <span className="text-[10px] text-emerald-400 block truncate font-semibold">● Aktif İşletme ({currentStore})</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. ÇALIŞMA ALANI & ÜST HEADER */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Üst Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={currentStore}
                onChange={(e) => setCurrentStore(e.target.value)}
                className="appearance-none flex items-center gap-2 border border-slate-200 rounded-xl px-3 pr-8 py-1.5 bg-slate-50 cursor-pointer hover:bg-slate-100 transition text-xs font-black text-slate-900 outline-none"
              >
                <option value="Foto Sentez">Foto Sentez (Merkez Şube)</option>
                <option value="Kuzey Teknik Tesisat">Kuzey Teknik Tesisat (Ordu)</option>
                <option value="Kuzey Ahşap Tasarım">Kuzey Ahşap Tasarım (Ordu)</option>
                <option value="Atölye Zanaat">Atölye Zanaat (Bursa)</option>
                <option value="Mega Endüstriyel">Mega Endüstriyel A.Ş. (İstanbul)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            <div className="text-xs font-semibold text-slate-500 hidden lg:block">
              23 Eylül 2026 Çarşamba
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onNavigate && (
              <button 
                onClick={() => onNavigate('home')}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Ana Vitrine Dön
              </button>
            )}
            <button 
              onClick={() => onNavigate && onNavigate('accounting')}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 border border-slate-200 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Takvim
            </button>
            <button 
              onClick={() => alert('tampazar AI Danışman: Bu ayki brüt kâr marjınız %35,7 seviyesinde. BYO POS tahsilatlarınız gecikmesiz hesabınıza geçmektedir.')}
              className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 border border-indigo-200 bg-indigo-50/70 px-3 py-2 rounded-xl hover:bg-indigo-100 transition cursor-pointer"
            >
              <Bot className="w-4 h-4 text-indigo-600" /> AI Danışman
            </button>
            <button className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 relative cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1.5 right-1.5" />
            </button>
          </div>
        </header>

        {/* ANA İÇERİK */}
        <main className="p-6 space-y-6 max-w-[1600px] w-full mx-auto">
          
          {/* HOŞ GELDİNİZ VE CANLI DÖVİZ BANDI */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800 shadow-sm">
            <div>
              <span className="text-xs font-semibold text-slate-400">23 Eylül 2026 Çarşamba</span>
              <h1 className="text-2xl font-black mt-0.5">Hoş geldiniz, Serkan 👋</h1>
              <div className="flex items-center gap-4 mt-3 text-xs flex-wrap">
                <span className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 font-semibold text-slate-300 font-mono">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> 48.7827 / 48.8904
                </span>
                <span className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 font-semibold text-slate-300 font-mono">
                  <Euro className="w-3.5 h-3.5 text-amber-400" /> 55.8062 / 55.9780
                </span>
                <span className="text-slate-400 font-medium">
                  {currentStore} Merkez Şube
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button 
                onClick={() => onNavigate && onNavigate('accounting')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-amber-300" /> Hızlı E-Fatura Düzenle
              </button>
              <button 
                onClick={() => onNavigate && onNavigate('accounting')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
              >
                Günün Raporu →
              </button>
            </div>
          </div>

          {/* DÖNEM SEÇİCİ VE EVRENSEL ARAMA */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200 gap-1 text-xs font-bold text-slate-600 shadow-xs">
              {(['BU_AY', 'SON_30', 'GECEN_AY', 'BU_YIL'] as const).map((period) => (
                <button 
                  key={period}
                  onClick={() => setActivePeriod(period)} 
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                    activePeriod === period ? 'bg-indigo-900 text-white' : 'hover:bg-slate-50'
                  }`}
                >
                  {period === 'BU_AY' ? 'Bu Ay' : period === 'SON_30' ? 'Son 30 Gün' : period === 'GECEN_AY' ? 'Geçen Ay' : 'Bu Yıl'}
                </button>
              ))}
            </div>

            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input 
                  type="text" 
                  placeholder="Cari, fatura, ürün veya işlem ara..." 
                  className="w-full bg-white text-xs font-medium text-slate-900 rounded-2xl pl-10 pr-4 py-2.5 border border-slate-200 focus:outline-none focus:border-indigo-600 shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 3. GÜNLÜK İŞLEM KARTLARI (Uyumlu ve Sakin Renk Paleti) */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Bugün Satış (İndigo Vurgulu) */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>BUGÜN SATIŞ</span>
                <ShoppingCart className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900 font-mono">₺230,00</span>
                <span className="text-[10px] font-bold text-emerald-600 block mt-1">↑ %100 düne göre</span>
              </div>
            </div>

            {/* Bugün Alış (Sakin Slate) */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>BUGÜN ALIŞ</span>
                <ArrowDownLeft className="w-4 h-4 text-slate-500" />
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900 font-mono">₺0,00</span>
                <span className="text-[10px] font-semibold text-slate-400 block mt-1">- düne göre</span>
              </div>
            </div>

            {/* Bugün Kasa Girişi (Doğrudan POS Tahsilatı) */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>BUGÜN KASA GİRİŞİ (POS)</span>
                <Wallet className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900 font-mono">₺230,00</span>
                <span className="text-[10px] font-bold text-emerald-600 block mt-1">↑ %100 düne göre (%0 Komisyon)</span>
              </div>
            </div>

            {/* Bugün Kasa Çıkışı */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>BUGÜN KASA ÇIKIŞI</span>
                <TrendingDown className="w-4 h-4 text-rose-500" />
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900 font-mono">₺0,00</span>
                <span className="text-[10px] font-semibold text-slate-400 block mt-1">- %100 düne göre</span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 4. GENİŞ FİNANSAL ÖZET BÖLÜMÜ (Kurumsal Koyu İndigo Kart) */}
          {/* ========================================================= */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-black tracking-wide uppercase text-white">FİNANSAL ÖZET</h2>
              </div>
              <span className="text-xs font-bold text-slate-300 bg-slate-800 px-3 py-1 rounded-xl border border-slate-700">
                Bu Ay · Son 30 Gün'e göre →
              </span>
            </div>

            {/* 3 Büyük Metrik Kartı: Uyumlu Koyu İndigo Tonları */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Bu Ay Cirosu */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 text-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-indigo-300 text-xs font-bold">
                    <span className="text-xl font-black text-white font-mono">₺135.835,00</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-xs font-semibold text-slate-300 block mt-1">Bu Ay Cirosu</span>
                  <p className="text-[11px] text-slate-400 mt-2">242 satış · Ort: ₺561,30</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 mt-4 block">Son 30 Gün'e göre ↑</span>
              </div>

              {/* Bu Ay Gideri */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 text-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-rose-300 text-xs font-bold">
                    <span className="text-xl font-black text-white font-mono">₺87.288,75</span>
                    <FileText className="w-4 h-4 text-slate-400" />
                  </div>
                  <span className="text-xs font-semibold text-slate-300 block mt-1">Bu Ay Gideri</span>
                  <p className="text-[11px] text-slate-400 mt-2">Alış: ₺78.354,50 · Masraf: ₺8.934,25</p>
                </div>
                <span className="text-[10px] font-bold text-slate-400 mt-4 block">Son 30 Gün'e göre ↓</span>
              </div>

              {/* Stok Değeri */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 text-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-amber-300 text-xs font-bold">
                    <span className="text-xl font-black text-white font-mono">₺174.842,00</span>
                    <Package className="w-4 h-4 text-amber-400" />
                  </div>
                  <span className="text-xs font-semibold text-slate-300 block mt-1">Stok Değeri · 23 Ürün</span>
                  <p className="text-[11px] text-slate-400 mt-2">Giderleri ve carileri gör →</p>
                </div>
                <span className="text-[10px] font-bold text-slate-400 mt-4 block">Depo Mevcudu Eksiksiz</span>
              </div>
            </div>

            {/* Alt 4 Detay Kartı (Net Kâr, Tahsilat, Alacaklar, Borçlar) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-slate-800">
              
              {/* Bu Ay Net Kâr */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">↑ %37</span>
                </div>
                <div className="text-xl font-black text-slate-900 font-mono">48.546 ₺</div>
                <span className="text-[11px] font-bold text-slate-500 block mt-0.5">Bu Ay Net Kâr</span>
                <span className="text-[10px] text-slate-400 mt-2 block">Son 30 güne göre →</span>
              </div>

              {/* Bu Ay Tahsilat */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Doğrudan POS</span>
                </div>
                <div className="text-xl font-black text-slate-900 font-mono">144.285 ₺</div>
                <span className="text-[11px] font-bold text-slate-500 block mt-0.5">Bu Ay Tahsilat (Banka)</span>
                <span className="text-[10px] text-slate-400 mt-2 block">Son 30 güne göre →</span>
              </div>

              {/* Alacaklar */}
              <div 
                onClick={() => onNavigate && onNavigate('accounting')}
                className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 cursor-pointer hover:border-indigo-300 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl font-black text-slate-900 font-mono">76.357 ₺</div>
                <span className="text-[11px] font-bold text-slate-500 block mt-0.5">Müşteri Alacakları (Cariler)</span>
                <span className="text-[10px] text-indigo-600 hover:underline mt-2 block font-semibold">Alacak defteri →</span>
              </div>

              {/* Borçlar */}
              <div 
                onClick={() => onNavigate && onNavigate('accounting')}
                className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 cursor-pointer hover:border-indigo-300 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl font-black text-slate-900 font-mono">555 ₺</div>
                <span className="text-[11px] font-bold text-slate-500 block mt-0.5">Tedarikçi Borçları</span>
                <span className="text-[10px] text-indigo-600 hover:underline mt-2 block font-semibold">Cari raporu →</span>
              </div>

            </div>
          </div>

          {/* ========================================================= */}
          {/* 5. ALT STOK VE GİB ENTEGRASYON BİLGİSİ */}
          {/* ========================================================= */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-600" />
                <h3 className="font-black text-sm text-slate-900 uppercase">Stok & Entegrasyon Durumu</h3>
              </div>
              <button 
                onClick={() => alert('GİB uyumlu e-Fatura / e-Arşiv XML ve UBL-TR paketi hazırlandı ve indirildi.')}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Muhasebeciye XML Dökümü İndir
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div 
                onClick={() => onNavigate && onNavigate('catalog')}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100/80 transition"
              >
                <div>
                  <span className="font-bold text-slate-700 block">Kritik Stok Uyarısı</span>
                  <span className="text-slate-400 text-[11px]">2 ürün tükenmek üzere</span>
                </div>
                <span className="text-xs font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-xl">2 Ürün</span>
              </div>

              <div 
                onClick={() => onNavigate && onNavigate('byopos')}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100/80 transition"
              >
                <div>
                  <span className="font-bold text-slate-700 block">Kendi POS Durumu</span>
                  <span className="text-slate-400 text-[11px]">Doğrudan Banka Hesabınıza Bağlı</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Aktif (%0 Komisyon)
                </span>
              </div>

              <div 
                onClick={() => onNavigate && onNavigate('gibdespatch')}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100/80 transition"
              >
                <div>
                  <span className="font-bold text-slate-700 block">GİB E-Fatura / E-Arşiv / e-İrsaliye</span>
                  <span className="text-slate-400 text-[11px]">Kalan Kontör: 8.420 Adet</span>
                </div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl">Bağlı & Hazır</span>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
