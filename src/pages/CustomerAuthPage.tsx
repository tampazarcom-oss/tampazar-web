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

        <div>
          <h1 className="text-xl font-black text-slate-900">
            {isRegisterMode ? 'Tüketici Hesabı Oluştur' : 'Mahalle Hesabına Giriş Yap'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Siparişlerinizi takip edin, ustalardan fiyat teklifi alın, Mahalle Sadakat Kartınız ile ikram kazanın.
          </p>
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
