/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Video, Calendar as CalendarIcon, Clock, Users, 
  ExternalLink, CheckCircle2, Phone, MessageSquare, 
  Plus, Check, X, AlertCircle, RefreshCw, Sparkles, 
  ChevronRight, CalendarDays, Filter, UserCheck, ShieldCheck, MapPin
} from 'lucide-react';
import { 
  getStoredOnlineAppointments, 
  saveOnlineAppointments, 
  updateAppointmentStatus, 
  OnlineAppointmentRecord 
} from '../../data/digitalAndSessionData';
import { Product } from '../../data/mockData';

interface TamSessionModuleProps {
  products: Product[];
  onOpenNewProductModal?: () => void;
}

export default function TamSessionModule({ products, onOpenNewProductModal }: TamSessionModuleProps) {
  const [appointments, setAppointments] = useState<OnlineAppointmentRecord[]>(() => getStoredOnlineAppointments());
  const [viewMode, setViewMode] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<OnlineAppointmentRecord | null>(null);
  const [actionSuccessToast, setActionSuccessToast] = useState('');

  // Manuel seans ekleme modalı
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [newServiceTitle, setNewServiceTitle] = useState('Bireysel Kariyer & E-Ticaret Danışmanlığı');
  const [newDate, setNewDate] = useState('Bugün (24 Eylül 2026)');
  const [newTimeSlot, setNewTimeSlot] = useState('16:00 - 16:45');
  const [newDuration, setNewDuration] = useState(45);
  const [newMeetLink, setNewMeetLink] = useState('https://meet.google.com/tpz-seans-canli');

  useEffect(() => {
    const handleUpdate = () => {
      setAppointments(getStoredOnlineAppointments());
    };
    window.addEventListener('tampazar_appointments_updated', handleUpdate);
    return () => window.removeEventListener('tampazar_appointments_updated', handleUpdate);
  }, []);

  // Filtered consultations
  const consultationProducts = products.filter(
    p => p.deliveryOptions?.type === 'online_session' || p.type === 'consultation'
  );

  const totalAppointmentsCount = appointments.length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;

  const filteredAppointments = appointments.filter(item => {
    if (viewMode === 'today') return item.date.toLowerCase().includes('bugün');
    if (viewMode === 'upcoming') return item.status === 'confirmed';
    if (viewMode === 'completed') return item.status === 'completed';
    return true;
  });

  const handleCompleteSession = (id: string) => {
    updateAppointmentStatus(id, 'completed');
    setActionSuccessToast('Seans başarıyla tamamlandı olarak kaydedildi.');
    setTimeout(() => setActionSuccessToast(''), 4000);
  };

  const handleCreateManualAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName || !newCustomerPhone) return;

    const newRec: OnlineAppointmentRecord = {
      id: 'apt-manual-' + Date.now(),
      orderId: 'TPZ-SNS-' + Math.floor(1000 + Math.random() * 9000),
      productId: 'sns-manual',
      serviceTitle: newServiceTitle,
      serviceImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600',
      merchantId: 'merchant-current',
      storeName: 'Uzman Danışmanlık',
      customerName: newCustomerName,
      customerEmail: newCustomerEmail || `${newCustomerName.toLowerCase().replace(/\s+/g, '')}@musteri.com`,
      customerPhone: newCustomerPhone,
      date: newDate,
      timeSlot: newTimeSlot,
      durationMin: newDuration,
      channel: 'google_meet',
      meetingLink: newMeetLink,
      status: 'confirmed',
      notes: 'Yönetim panelinden manuel randevu kaydı.',
      createdAt: 'Şimdi'
    };

    saveOnlineAppointments([newRec, ...appointments]);
    setShowAddModal(false);
    setActionSuccessToast(`Randevu ${newCustomerName} için başarıyla takvime eklendi.`);
    setTimeout(() => setActionSuccessToast(''), 4000);

    // Reset
    setNewCustomerName('');
    setNewCustomerPhone('');
    setNewCustomerEmail('');
  };

  return (
    <div className="space-y-6">
      
      {/* SUCCESS TOAST */}
      {actionSuccessToast && (
        <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-lg flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold text-sm">{actionSuccessToast}</span>
          </div>
          <button 
            onClick={() => setActionSuccessToast('')}
            className="text-white/80 hover:text-white text-xs font-bold px-2 py-1"
          >
            Kapat
          </button>
        </div>
      )}

      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-cyan-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 text-cyan-200 rounded-full text-xs font-bold border border-cyan-400/30">
              <Video className="w-3.5 h-3.5 text-cyan-300" />
              <span>TamSeans • Canlı Randevu & Seans Takvimi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Canlı Seans & Online Danışmanlık Ajandası
            </h2>
            <p className="text-cyan-100/90 text-sm leading-relaxed">
              Google Meet ve Zoom video entegrasyonuyla birebir uzman görüşmelerinizi, özel derslerinizi ve diyetisyen seanslarınızı yönetin. Müşterileriniz takviminizden müsait saati seçip ödesin.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-3 bg-white hover:bg-slate-100 text-slate-900 font-black text-xs rounded-2xl shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-cyan-700" />
              <span>Manuel Seans Ekle</span>
            </button>
            {onOpenNewProductModal && (
              <button
                type="button"
                onClick={onOpenNewProductModal}
                className="px-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs rounded-2xl shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>Yeni Seans Hizmeti Tanımla</span>
              </button>
            )}
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-cyan-800/60">
          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-cyan-200 font-medium block">Toplam Randevu</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black">{totalAppointmentsCount}</span>
              <span className="text-xs text-cyan-300">seans</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-cyan-200 font-medium block">Onaylı & Yaklaşan</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-emerald-300">{confirmedCount}</span>
              <span className="text-xs text-emerald-200">hazır</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-cyan-200 font-medium block">Tamamlanan Seanslar</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black">{completedCount}</span>
              <span className="text-xs text-cyan-300">başarılı</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-cyan-200 font-medium block">Müşteri Memnuniyeti</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-amber-300">5.0 / 5.0</span>
              <span className="text-xs text-cyan-300">★ süper uzman</span>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER TABS & AGENDA */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-cyan-600" />
              <span>Canlı Seans Ajandası</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Yaklaşan toplantı linkleri, danışan iletişim bilgileri ve seans süreleri.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
            {[
              { id: 'all', label: 'Tüm Seanslar' },
              { id: 'today', label: 'Bugün' },
              { id: 'upcoming', label: 'Yaklaşanlar' },
              { id: 'completed', label: 'Tamamlananlar' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setViewMode(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  viewMode === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-cyan-200 rounded-3xl bg-cyan-50/20">
            <Video className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
            <h4 className="font-black text-slate-900 text-base">Bu Filtrede Seans Bulunmuyor</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Danışanlarınız online seans satın aldığında randevu detayları ve Google Meet linki anında buraya düşer.
            </p>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              + Hızlı Seans Oluştur
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAppointments.map(apt => {
              const isToday = apt.date.toLowerCase().includes('bugün');
              const isDone = apt.status === 'completed';

              return (
                <div
                  key={apt.id}
                  className={`p-5 rounded-3xl border transition flex flex-col justify-between space-y-4 ${
                    isDone 
                      ? 'bg-slate-50/80 border-slate-200 opacity-75'
                      : isToday
                      ? 'bg-gradient-to-br from-cyan-50/60 to-white border-cyan-300 ring-2 ring-cyan-400/20 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-cyan-200 hover:shadow-xs'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header Row: Date badge + Status */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1.5 ${
                          isToday 
                            ? 'bg-cyan-600 text-white' 
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          <Clock className="w-3.5 h-3.5" />
                          <span>{apt.timeSlot}</span>
                        </span>
                        <span className="text-xs font-bold text-slate-600">{apt.date}</span>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                        isDone 
                          ? 'bg-slate-200 text-slate-700' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isDone ? 'Tamamlandı' : 'Onaylı Seans'}
                      </span>
                    </div>

                    {/* Service Title */}
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug">
                        {apt.serviceTitle}
                      </h4>
                      <p className="text-[11px] text-cyan-800 font-medium mt-0.5">
                        Süre: {apt.durationMin} Dakika • Kanal: {apt.channel === 'google_meet' ? 'Google Meet (HD Video)' : apt.channel === 'zoom' ? 'Zoom Toplantısı' : 'WhatsApp / Telefon'}
                      </p>
                    </div>

                    {/* Customer Info Box */}
                    <div className="p-3 bg-white rounded-2xl border border-slate-200/80 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-cyan-600" />
                          {apt.customerName}
                        </span>
                        <span className="font-mono text-[11px] text-slate-500">{apt.orderId}</span>
                      </div>
                      <div className="text-slate-500 text-[11px] flex flex-wrap items-center gap-3">
                        <span>📞 {apt.customerPhone}</span>
                        <span>✉️ {apt.customerEmail}</span>
                      </div>
                      {apt.notes && (
                        <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg mt-1 italic border border-slate-100">
                          "{apt.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {/* Google Meet Link Button */}
                      <a
                        href={apt.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Video className="w-4 h-4" />
                        <span>Meet'e Katıl</span>
                        <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                      </a>

                      {/* WhatsApp İletişim */}
                      <a
                        href={`https://wa.me/${apt.customerPhone.replace(/[^0-9]/g, '')}?text=Merhaba%20${encodeURIComponent(apt.customerName)},%20TamPazar%20üzerinden%20planlanan%20online%20seansımız%20hakkında%20bilgilendirmek%20istiyorum.`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                    {!isDone && (
                      <button
                        type="button"
                        onClick={() => handleCompleteSession(apt.id)}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
                        title="Seansı tamamlandı olarak işaretle"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Tamamla</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MANUEL SEANS EKLEME MODALI */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-cyan-600" />
                <h3 className="font-black text-slate-900 text-base">Ajandaya Manuel Seans Ekle</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualAppointment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Danışan / Müşteri Adı Soyadı</label>
                <input
                  type="text"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  placeholder="Örn: Selim Çakır"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Telefon Numarası</label>
                  <input
                    type="tel"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    placeholder="0532 ..."
                    required
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">E-Posta Adresi</label>
                  <input
                    type="email"
                    value={newCustomerEmail}
                    onChange={(e) => setNewCustomerEmail(e.target.value)}
                    placeholder="ornek@gmail.com"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Seans / Hizmet Konusu</label>
                <input
                  type="text"
                  value={newServiceTitle}
                  onChange={(e) => setNewServiceTitle(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Tarih</label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="Bugün (24 Eylül 2026)"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Saat Dilimi</label>
                  <input
                    type="text"
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    placeholder="15:00 - 15:45"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Google Meet Toplantı Linki</label>
                <input
                  type="text"
                  value={newMeetLink}
                  onChange={(e) => setNewMeetLink(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Takvime Kaydet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
