/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Lock, Mail, ArrowRight, ShieldAlert, Sparkles, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/BrandLogo';

export default function AdminLoginPage() {
  const { loginAsAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@tampazar.com');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsAdmin(email);
    navigate('/sistem-admin');
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col justify-between p-4 sm:p-6 selection:bg-amber-400 selection:text-slate-950">
      
      {/* Top Header */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between py-2">
        <Link to="/" className="flex items-center gap-2">
          <BrandLogo size="md" />
        </Link>
        <Link
          to="/"
          className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Pazaryerine Dön</span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="max-w-md w-full mx-auto my-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[10px] font-black uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          TamPazar Süper Admin Konsolu (Izole Port)
        </div>

        <div>
          <h1 className="text-xl font-black text-white">
            Sistem Yöneticisi Girişi
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Genel platform metrikleri, PayTR Recurring abonelik durumları, onay bekleyen dükkanlar ve 81 il istatistikleri.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Admin E-Posta Adresi</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tampazar.com" 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white outline-none focus:border-amber-400 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Süper Admin Güvenlik Şifresi</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                defaultValue="123456"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white outline-none focus:border-amber-400 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#F59E0B] hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Süper Konsola Giriş Yap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <button
            type="button"
            onClick={() => {
              loginAsAdmin();
              navigate('/sistem-admin');
            }}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-extrabold text-xs rounded-xl border border-slate-700 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Tek Tıkla Demo Süper Admin Olarak Giriş Yap (/sistem-admin)</span>
          </button>
        </div>

      </div>

      <div className="max-w-md mx-auto text-center text-xs text-slate-500">
        TamPazar Izole Sistem Yönetim Altyapısı
      </div>

    </div>
  );
}
