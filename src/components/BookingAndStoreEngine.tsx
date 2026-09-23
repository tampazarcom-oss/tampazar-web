/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle2, MessageCircle, MapPin, Phone, ShieldCheck, User, Sparkles } from 'lucide-react';

export interface ServiceItem {
  id: string;
  name: string;
  duration: string;
  price: number;
}

export const DEFAULT_SERVICES: ServiceItem[] = [
  { id: 's1', name: 'Yerinde Arıza Tespiti & Ekspertiz', duration: '45 Dk', price: 750 },
  { id: 's2', name: 'Komple Tesisat & Cihaz Bakımı', duration: '90 Dk', price: 1800 },
  { id: 's3', name: 'Özel Ölçü Keşif ve Fiyatlandırma', duration: '30 Dk', price: 0 },
];

interface BookingAndStoreEngineProps {
  storeName: string;
  phone: string;
  whatsapp: string;
  services?: ServiceItem[];
  onBookingComplete?: (booking: {
    serviceName: string;
    date: string;
    time: string;
    customerName: string;
    customerPhone: string;
    price: number;
  }) => void;
}

export default function BookingAndStoreEngine({ 
  storeName, 
  phone, 
  whatsapp,
  services = DEFAULT_SERVICES,
  onBookingComplete
}: BookingAndStoreEngineProps) {
  const [selectedService, setSelectedService] = useState<ServiceItem>(services[0] || DEFAULT_SERVICES[0]);
  const [date, setDate] = useState('2026-09-24');
  const [time, setTime] = useState('11:00');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    // WhatsApp onay mesajını otomatik hazırla
    const messageText = `Merhaba ${storeName}, tampazar.com üzerinden "${selectedService.name}" hizmeti için ${date} saat ${time} randevusu oluşturdum. Müşteri: ${customerName}, Tel: ${customerPhone}. Uygunluk durumunuzu teyit rica ederim.`;
    const targetUrl = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(messageText)}`;
    
    setWhatsappUrl(targetUrl);
    setIsSuccess(true);

    // Save booking to localStorage for merchant ledger & calendar view
    try {
      const savedBookings = JSON.parse(localStorage.getItem('tampazar_bookings') || '[]');
      const newBooking = {
        id: 'bk-' + Date.now(),
        storeName,
        serviceName: selectedService.name,
        price: selectedService.price,
        date,
        time,
        customerName,
        customerPhone,
        status: 'CONFIRMED',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('tampazar_bookings', JSON.stringify([newBooking, ...savedBookings]));
      window.dispatchEvent(new Event('tampazar_booking_created'));
    } catch (e) {
      console.error(e);
    }

    if (onBookingComplete) {
      onBookingComplete({
        serviceName: selectedService.name,
        date,
        time,
        customerName,
        customerPhone,
        price: selectedService.price
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm max-w-2xl mx-auto">
      <div className="border-b border-slate-100 pb-4 mb-6">
        <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full uppercase tracking-wider border border-amber-200 inline-flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" /> Doğrudan Esnaftan Randevu Al
        </span>
        <h2 className="text-xl font-black text-slate-900 mt-2">Hizmet Seçin & Saatinizi Belirleyin</h2>
        <p className="text-xs text-slate-500">Aracı komisyonu olmadan, doğrudan işletmenin takvimine randevu işlenir.</p>
      </div>

      {isSuccess ? (
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-fade-in">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <div>
            <h3 className="text-base font-black text-emerald-950">Randevu Talebiniz Başarıyla İletildi!</h3>
            <p className="text-xs text-emerald-800 mt-1 max-w-md mx-auto">
              <strong>{storeName}</strong> işletmesi randevu detaylarınızı aldı. Bilgiler eşzamanlı olarak esnafın yönetim paneline işlendi.
            </p>
          </div>

          <div className="bg-white/80 rounded-xl p-3 border border-emerald-200 text-xs text-slate-700 max-w-sm mx-auto space-y-1 text-left font-medium">
            <div><span className="text-slate-400">Hizmet:</span> <strong>{selectedService.name}</strong></div>
            <div><span className="text-slate-400">Tarih & Saat:</span> <strong>{date} · {time}</strong></div>
            <div><span className="text-slate-400">Müşteri:</span> <strong>{customerName}</strong> ({customerPhone})</div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp'tan Randevuyu Aç
              </a>
            )}
            <button
              type="button"
              onClick={() => setIsSuccess(false)}
              className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              Yeni Randevu Talebi
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleBooking} className="space-y-5">
          {/* Hizmet Seçimi */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Talep Edilen Hizmet</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {services.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedService(s)}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition flex flex-col justify-between ${
                    selectedService.id === s.id
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-500'
                      : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold text-xs text-slate-900 block leading-tight">{s.name}</span>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100">
                    <span className="text-slate-400 font-medium">{s.duration}</span>
                    <span className="font-black text-slate-900">{s.price === 0 ? 'Ücretsiz Keşif' : `${s.price.toLocaleString('tr-TR')} ₺`}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tarih & Saat Seçimi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Randevu Günü</label>
              <div className="flex items-center border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus-within:border-indigo-600">
                <CalendarIcon className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-transparent text-xs text-slate-800 font-semibold outline-none w-full cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Uygun Saat Aralığı</label>
              <div className="flex items-center border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus-within:border-indigo-600">
                <Clock className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-transparent text-xs text-slate-800 font-semibold outline-none w-full cursor-pointer"
                >
                  <option value="09:00">09:00 - 10:00 (Sabah İlk Seans)</option>
                  <option value="11:00">11:00 - 12:00 (Öğle Öncesi)</option>
                  <option value="14:00">14:00 - 15:00 (Öğleden Sonra)</option>
                  <option value="16:30">16:30 - 17:30 (Akşam Üstü)</option>
                </select>
              </div>
            </div>
          </div>

          {/* İletişim Bilgileri */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Adınız Soyadınız</label>
              <input
                type="text"
                required
                placeholder="Örn: Ahmet Yılmaz"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600 bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Telefon Numaranız</label>
              <input
                type="tel"
                required
                placeholder="05XX XXX XX XX"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600 bg-white font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-indigo-900 hover:bg-indigo-800 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            Randevuyu Onayla ve WhatsApp'tan Bildir
          </button>
        </form>
      )}
    </div>
  );
}
