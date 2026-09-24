/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Bike, Mail, Lock, Phone, MapPin, ArrowRight, Sparkles, ShieldCheck, ArrowLeft, Truck, DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/BrandLogo';

export default function CourierAuthPage() {
  const { loginAsCourier, registerCourier } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isApplyMode = location.pathname === '/kurye/basvuru';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Ordu');
  const [district, setDistrict] = useState('Altınordu');
  const [vehicleType, setVehicleType] = useState('Motosiklet (125cc)');
  const [tcNo, setTcNo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isApplyMode) {
      registerCourier({
        name: name || 'Murat Yıldız',
        email: email || 'kurye.murat@tampazar.com',
        phone: phone || '+90 541 222 33 44',
        city,
        district,
        vehicleType,
        tcNo
      });
    } else {
      loginAsCourier(email || 'kurye.murat@tampazar.com');
    }
    navigate('/kurye/panel');
  };

  return (
    <div className="min-h-screen bg-[#0B132B] text-white flex flex-col justify-between p-4 sm:p-6 selection:bg-emerald-400 selection:text-slate-950">
      
      {/* Top Bar */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between py-2">
        <Link to="/" className="flex items-center gap-2">
          <BrandLogo size="md" />
        </Link>
        <Link
          to="/kuryeler"
          className="text-xs font-bold text-emerald-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>TamKurye Rehberine Dön</span>
        </Link>
      </div>

      {/* Main Container */}
      <div className="max-w-md w-full mx-auto my-8 bg-[#111B38] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-500/30 space-y-6">
        
        {/* Toggle Tabs */}
        <div className="flex bg-[#0B132B] p-1 rounded-2xl border border-slate-800">
          <Link
            to="/kurye/giris"
            className={`flex-1 py-2.5 text-center text-xs font-black rounded-xl transition ${
              !isApplyMode ? 'bg-[#10B981] text-[#0B132B] shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            Kurye Girişi
          </Link>
          <Link
            to="/kurye/basvuru"
            className={`flex-1 py-2.5 text-center text-xs font-black rounded-xl transition ${
              isApplyMode ? 'bg-[#10B981] text-[#0B132B] shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            Kurye Olarak Başvur
          </Link>
        </div>

        {/* Info Pill */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3.5 text-xs text-emerald-300 space-y-1">
          <div className="font-black flex items-center gap-1.5 text-emerald-400">
            <Bike className="w-4 h-4" />
            %0 Komisyonlu Bağımsız Kurye Ağı
          </div>
          <p className="text-[11px] text-emerald-200/80 leading-relaxed">
            Mahallenizdeki esnafların teslimatlarını üstlenin, kendi fiyat listenizle komisyonsuz doğrudan nakit/POS kazancı elde edin.
          </p>
        </div>

        <div>
          <h1 className="text-xl font-black text-white">
            {isApplyMode ? 'TamKurye Sürücü Başvurusu' : 'TamKurye Sürücü Girişi'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Müsait görevleri görün, teslimat radarı ile sipariş birleştirin ve günlük kazancınızı takip edin.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isApplyMode && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Adınız Soyadınız *</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Murat Yıldız" 
                  className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">TC Kimlik No / Ehliyet No</label>
                <input 
                  type="text" 
                  value={tcNo}
                  onChange={(e) => setTcNo(e.target.value)}
                  placeholder="11 Haneli TC Kimlik No" 
                  className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-emerald-500 font-medium"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">E-Posta Adresiniz *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kurye.murat@tampazar.com" 
                className="w-full bg-[#0B132B] border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>

          {isApplyMode && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Telefon (WhatsApp) *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input 
                    type="tel" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+90 541 222 33 44" 
                    className="w-full bg-[#0B132B] border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white outline-none focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Şehir</label>
                  <input 
                    type="text" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-emerald-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">İlçe</label>
                  <input 
                    type="text" 
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Taşıt Tipi</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-emerald-500 font-medium cursor-pointer"
                >
                  <option value="Motosiklet (125cc)">Motosiklet (125cc Scooter)</option>
                  <option value="Motosiklet (250cc+)">Motosiklet (250cc Touring)</option>
                  <option value="Elektrikli Scooter / Bisiklet">Elektrikli Scooter / E-Bike</option>
                  <option value="Hafif Ticari Araç (Doblo/Fiorino)">Hafif Ticari Araç (Doblo / Fiorino)</option>
                  <option value="Yaya Kurye">Yaya Kurye (Çarşı İçi)</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Sürücü Şifresi</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="password" 
                required
                placeholder="••••••••" 
                defaultValue="123456"
                className="w-full bg-[#0B132B] border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white outline-none focus:border-emerald-500 font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#10B981] hover:bg-emerald-400 text-[#0B132B] font-black text-xs rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{isApplyMode ? 'Kurye Başvurusunu Tamamla & Panele Geç' : 'Kurye Paneline Giriş Yap'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <button
            type="button"
            onClick={() => {
              loginAsCourier();
              navigate('/kurye/panel');
            }}
            className="w-full py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-black text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Tek Tıkla Demo Kurye Olarak Panele Geç (/kurye/panel)</span>
          </button>
        </div>

      </div>

      <div className="max-w-md mx-auto text-center text-xs text-slate-500">
        TamKurye Bağımsız Moto Kurye ve Saha Teslimat Ağı
      </div>

    </div>
  );
}
