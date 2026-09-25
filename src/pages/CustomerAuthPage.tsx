/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  User, Mail, Lock, Phone, MapPin, ArrowRight, Sparkles, ShieldCheck, Heart, ShoppingBag, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/BrandLogo';

export default function CustomerAuthPage() {
  const { loginAsCustomer, registerBuyer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isRegisterMode = location.pathname === '/kayit';
  const searchParams = new URLSearchParams(location.search);
  const authError = searchParams.get('authError') || searchParams.get('error');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Ordu');
  const [district, setDistrict] = useState('Altınordu');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegisterMode) {
      registerBuyer({
        name: name || 'Ahmet Yılmaz',
        email: email || 'ahmet.yilmaz@tampazar.com',
        phone: phone || '+90 532 555 12 34',
        city,
        district,
        password
      });
    } else {
      loginAsCustomer(email || 'ahmet.yilmaz@tampazar.com');
    }
    navigate('/hesabim');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-[#0B132B] to-[#0B132B] text-white flex flex-col justify-between p-4 sm:p-6 selection:bg-amber-400 selection:text-slate-950">
      
      {/* Top Header */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between py-2">
        <Link to="/" className="flex items-center gap-2">
          <BrandLogo size="md" />
        </Link>
        <Link
          to="/"
          className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Pazaryerine Dön</span>
        </Link>
      </div>

      {/* Form Container */}
      <div className="max-w-md w-full mx-auto my-8 bg-white text-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
        
        {/* Switch Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <Link
            to="/giris"
            className={`flex-1 py-2.5 text-center text-xs font-black rounded-xl transition ${
              !isRegisterMode ? 'bg-indigo-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Müşteri Girişi
          </Link>
          <Link
            to="/kayit"
            className={`flex-1 py-2.5 text-center text-xs font-black rounded-xl transition ${
              isRegisterMode ? 'bg-indigo-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Yeni Hesap Oluştur
          </Link>
        </div>

        {/* Auth Error Banner */}
        {authError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-800 flex items-start gap-2.5">
            <span className="text-base shrink-0">⚠️</span>
            <div className="space-y-0.5">
              <p className="font-black text-rose-900">Kimlik Doğrulama Uyarısı</p>
              <p className="text-[11px] text-rose-700 font-medium">{authError}</p>
            </div>
          </div>
        )}

        <div>
          <h1 className="text-xl font-black text-slate-900">
            {isRegisterMode ? 'Tüketici Hesabı Oluştur' : 'Mahalle Hesabına Giriş Yap'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Siparişlerinizi takip edin, ustalardan fiyat teklifi alın, Mahalle Sadakat Kartınız ile ikram kazanın.
          </p>
        </div>

        {/* Google ile Devam Et / Giriş Yap */}
        <a
          href="/api/auth/google?role=buyer"
          className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs rounded-xl border border-slate-300 shadow-sm transition flex items-center justify-center gap-3 cursor-pointer hover:border-slate-400 group"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Google Hesabı ile {isRegisterMode ? 'Hızlı Kaydol' : 'Giriş Yap'}</span>
        </a>

        <div className="flex items-center gap-3 my-2">
          <div className="h-px bg-slate-200 flex-1" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">veya e-posta ile</span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Adınız Soyadınız</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ahmet Yılmaz" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-600 font-medium"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">E-Posta Adresiniz</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ahmet.yilmaz@tampazar.com" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-600 font-medium"
              />
            </div>
          </div>

          {isRegisterMode && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Telefon Numarası</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+90 532 555 12 34" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Şehir</label>
                  <input 
                    type="text" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">İlçe</label>
                  <input 
                    type="text" 
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Şifre</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                defaultValue="123456"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 outline-none focus:border-indigo-600 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-indigo-900 hover:bg-indigo-800 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{isRegisterMode ? 'Hesabımı Oluştur ve Giriş Yap' : 'Müşteri Paneline Giriş Yap'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <button
            type="button"
            onClick={() => {
              loginAsCustomer();
              navigate('/hesabim');
            }}
            className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-extrabold text-xs rounded-xl border border-amber-200 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Tek Tıkla Hızlı Müşteri Demosu Olarak Başla</span>
          </button>

          <div className="text-center pt-2">
            <Link to="/saticipaneli" className="text-xs font-bold text-emerald-700 hover:underline">
              Esnaf mısınız? Kendi Mağazanıza Giriş Yapın →
            </Link>
          </div>
        </div>

      </div>

      <div className="max-w-md mx-auto text-center text-xs text-slate-400">
        TamPazar %0 Komisyonlu Açık Dijital AVM & Tüketici Ağı
      </div>

    </div>
  );
}
