/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, ShieldCheck, Clock, MapPin, Phone, 
  MessageCircle, CheckCircle2, AlertCircle, Plus, 
  ChevronDown, ChevronUp, Star, Check, X, HelpCircle,
  Truck, Wrench, Hammer, Camera, Package, Key, Layers, ShoppingCart, Send
} from 'lucide-react';
import { 
  QuotationRequest, 
  MerchantQuote, 
  getStoredQuotationRequests, 
  getStoredMerchantQuotes, 
  acceptMerchantQuote, 
  rejectMerchantQuote 
} from '../data/quotationRequestData';
import TamTeklifWizardModal from './TamTeklifWizardModal';

interface CustomerQuotationsTabProps {
  initialRequestId?: string;
}

export default function CustomerQuotationsTab({ initialRequestId }: CustomerQuotationsTabProps) {
  const [requests, setRequests] = useState<QuotationRequest[]>([]);
  const [quotes, setQuotes] = useState<MerchantQuote[]>([]);
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(initialRequestId || null);
  const [showWizardModal, setShowWizardModal] = useState(false);
  
  // Question Modal
  const [questionModalQuote, setQuestionModalQuote] = useState<MerchantQuote | null>(null);
  const [questionText, setQuestionText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = () => {
    const allReqs = getStoredQuotationRequests();
    const allQuotes = getStoredMerchantQuotes();
    setRequests(allReqs);
    setQuotes(allQuotes);

    // If initialRequestId is provided and exists, expand it, otherwise expand first
    if (initialRequestId && allReqs.some(r => r.id === initialRequestId)) {
      setExpandedRequestId(initialRequestId);
    } else if (!expandedRequestId && allReqs.length > 0) {
      setExpandedRequestId(allReqs[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, [initialRequestId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAcceptQuote = (quote: MerchantQuote, req: QuotationRequest) => {
    const res = acceptMerchantQuote(quote.id);
    if (res.success) {
      loadData();
      showToast(`🎉 Tebrikler! ${quote.merchantName} teklifini kabul ettiniz. İletişim bilgileri açıldı.`);
    }
  };

  const handleRejectQuote = (quoteId: string) => {
    rejectMerchantQuote(quoteId);
    loadData();
    showToast('Teklif reddedildi.');
  };

  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionModalQuote || !questionText.trim()) return;

    showToast(`Sorunuz ${questionModalQuote.merchantName} işletmesine iletildi. Esnaf SMS/bildirim ile bilgilendirildi.`);
    setQuestionModalQuote(null);
    setQuestionText('');
  };

  const totalQuotesCount = quotes.length;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-fade-in text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. ÜST BİLGİ VE YENİ TALEP AÇ BUTONU */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black shadow-xs">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-base font-black text-slate-900">
              TamTeklif: Fiyat Taleplerim & Gelen Teklifler
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Esnaflar birbirinin fiyatını göremez (Armut Modeli). Gelen tüm teklifleri aşağıda karşılaştırabilir, en uygun esnafı seçip doğrudan görüşebilirsiniz.
          </p>
        </div>

        <button
          onClick={() => setShowWizardModal(true)}
          className="px-5 py-3 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Yeni Fiyat Teklifi İste</span>
        </button>
      </div>

      {/* 2. TALEP LİSTESİ */}
      {requests.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-900 rounded-2xl flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-slate-900">Henüz bir fiyat teklifi talebiniz yok</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Oto kurtarma, tesisat, ev tadilatı, düğün fotoğrafçılığı veya toplu ürün siparişleriniz için ücretsiz talep oluşturun.
          </p>
          <button
            onClick={() => setShowWizardModal(true)}
            className="px-6 py-2.5 bg-indigo-900 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
          >
            Hemen Ücretsiz Teklif İste
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const reqQuotes = quotes.filter(q => q.requestId === req.id);
            const isExpanded = expandedRequestId === req.id;
            const acceptedQuote = reqQuotes.find(q => q.status === 'accepted');

            return (
              <div 
                key={req.id} 
                className={`bg-white rounded-3xl border transition-all shadow-xs overflow-hidden ${
                  req.status === 'awarded' 
                    ? 'border-emerald-300 ring-1 ring-emerald-500/20' 
                    : 'border-slate-200'
                }`}
              >
                {/* TALEP BAŞLIĞI / AKORDİYON BAŞLIĞI */}
                <div 
                  onClick={() => setExpandedRequestId(isExpanded ? null : req.id)}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        {req.requestNumber}
                      </span>
                      <span className="bg-indigo-50 text-indigo-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        {req.categoryTitle}
                      </span>
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                        req.timing === 'urgent' ? 'bg-rose-100 text-rose-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {req.timingLabel}
                      </span>

                      {req.status === 'awarded' && (
                        <span className="bg-emerald-100 text-emerald-800 font-black px-2.5 py-0.5 rounded-full text-[10px] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Teklif Kabul Edildi (İş Bağlandı)
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-black text-slate-900">
                      {req.title}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        {req.location.neighborhood}, {req.location.district}
                      </span>
                      <span>•</span>
                      <span>Kapsam: <strong>{req.quantityOrScope}</strong></span>
                      <span>•</span>
                      <span>{req.createdAt}</span>
                    </div>
                  </div>

                  {/* Sağ Taraf: Gelen Teklif Sayısı Rozeti & Ok */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                      reqQuotes.length > 0 
                        ? 'bg-amber-50 border-amber-200 text-amber-950' 
                        : 'bg-slate-100 border-slate-200 text-slate-600'
                    }`}>
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                      <span>{reqQuotes.length} Fiyat Teklifi</span>
                    </div>

                    <button className="p-1 text-slate-400 hover:text-slate-600">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* DETAY VE TEKLİFLER BÖLÜMÜ (AÇIKSA) */}
                {isExpanded && (
                  <div className="p-6 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-6 animate-fade-in">
                    
                    {/* Talep Açıklaması ve Ek Fotoğraflar */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                      <span className="font-bold text-slate-400 block text-[10px] uppercase">
                        Talebinizin Açıklaması:
                      </span>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {req.description}
                      </p>

                      {req.attachments && req.attachments.length > 0 && (
                        <div className="pt-2 flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400">Yüklediğiniz Fotoğraflar:</span>
                          <div className="flex gap-2">
                            {req.attachments.map((img, idx) => (
                              <img 
                                key={idx} 
                                src={img} 
                                alt="Fotoğraf" 
                                className="w-12 h-12 rounded-xl object-cover border border-slate-200" 
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ARMUT MODELİ KAPALI TEKLİF LİSTESİ */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-slate-900 text-xs flex items-center gap-2">
                          <span>Gelen Fiyat Teklifleri Karşılaştırması</span>
                          <span className="bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-full text-[10px]">
                            {reqQuotes.length} Esnaf
                          </span>
                        </h4>

                        <span className="text-[10px] text-slate-400 font-bold">
                          🔒 Esnaflar birbirinin fiyatını göremez
                        </span>
                      </div>

                      {reqQuotes.length === 0 ? (
                        <div className="p-6 bg-white rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-500 space-y-1">
                          <Clock className="w-5 h-5 text-amber-500 mx-auto" />
                          <p className="font-bold text-slate-800">Teklifler Hazırlanıyor</p>
                          <p className="text-[11px] text-slate-400">
                            Bölgenizdeki onaylı esnaflar talebinizi inceliyor. İlk teklifler ortalama 15-30 dakika içinde buraya düşer.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {reqQuotes.map((q) => {
                            const isThisAccepted = q.status === 'accepted';
                            const isThisRejected = q.status === 'rejected';

                            return (
                              <div 
                                key={q.id}
                                className={`bg-white rounded-3xl p-5 border transition-all text-xs space-y-4 ${
                                  isThisAccepted 
                                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md bg-emerald-50/10' 
                                    : isThisRejected 
                                    ? 'border-slate-200 opacity-60 bg-slate-50' 
                                    : 'border-slate-200 shadow-xs hover:border-slate-300'
                                }`}
                              >
                                {/* Kart Başlığı: Esnaf Profili ve Fiyat */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-3">
                                  <div className="flex items-center gap-3">
                                    <img 
                                      src={q.merchantAvatar} 
                                      alt={q.merchantName} 
                                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0" 
                                    />
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <h5 className="font-black text-slate-900 text-sm">
                                          {q.merchantName}
                                        </h5>
                                        {isThisAccepted && (
                                          <span className="bg-emerald-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full">
                                            Seçilen Esnaf
                                          </span>
                                        )}
                                      </div>

                                      <div className="flex items-center gap-2 mt-0.5">
                                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                                          <span className="text-slate-900">{q.merchantRating}</span>
                                          <span className="text-slate-400 text-[10px]">({q.merchantReviewCount})</span>
                                        </div>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-indigo-900 font-bold flex items-center gap-1">
                                          <MapPin className="w-3 h-3 text-indigo-600" />
                                          {q.distanceKm} km yakınınızda
                                        </span>
                                      </div>

                                      {/* Rozetler */}
                                      <div className="flex flex-wrap gap-1 mt-1.5">
                                        {q.merchantBadges.map((badge, bIdx) => (
                                          <span key={bIdx} className="bg-slate-100 text-slate-700 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                            {badge}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Fiyat Kutusu */}
                                  <div className="text-right sm:border-l sm:border-slate-100 sm:pl-4">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                      Net Fiyat Teklifi:
                                    </span>
                                    <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                                      {q.price.toLocaleString('tr-TR')} ₺
                                    </div>
                                    <span className="text-[10px] text-emerald-700 font-semibold block">
                                      {q.vatIncluded ? 'KDV Dahil / Komisyonsuz' : '+ KDV'}
                                    </span>
                                  </div>
                                </div>

                                {/* Esnafın Notu ve Süre Bilgisi */}
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-950">
                                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                                    <span>Tahmini Süre: {q.duration}</span>
                                  </div>
                                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    "{q.note}"
                                  </p>
                                </div>

                                {/* KABUL EDİLMİŞ DURUMDA İLETİŞİM KARTI */}
                                {isThisAccepted && (
                                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 space-y-3">
                                    <div className="flex items-center justify-between">
                                      <span className="font-black text-emerald-950 flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        Esnaf ile Anlaşma Sağlandı! Doğrudan İletişime Geçin:
                                      </span>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 pt-1">
                                      <a
                                        href={`tel:${q.phone}`}
                                        className="flex-1 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-2xs"
                                      >
                                        <Phone className="w-4 h-4 text-emerald-600" />
                                        <span>Telefonla Ara ({q.phone})</span>
                                      </a>
                                      <a
                                        href={`https://wa.me/${q.whatsapp}?text=Merhaba%20${encodeURIComponent(q.merchantName)},%20TamPazar%20üzerinden%20verdiğiniz%20${encodeURIComponent(req.title)}%20için%20${q.price}%20TL%20teklifinizi%20kabul%20ettim.`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-2xs"
                                      >
                                        <MessageCircle className="w-4 h-4" />
                                        <span>WhatsApp İle Konuş</span>
                                      </a>
                                    </div>
                                  </div>
                                )}

                                {/* HENÜZ KABUL EDİLMEMİŞSE AKSİYON BUTONLARI */}
                                {!acceptedQuote && !isThisRejected && (
                                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => setQuestionModalQuote(q)}
                                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                                      >
                                        <HelpCircle className="w-3.5 h-3.5 text-indigo-700" />
                                        <span>Esnafa Soru Sor</span>
                                      </button>
                                      
                                      <button
                                        onClick={() => handleRejectQuote(q.id)}
                                        className="px-3 py-2 text-rose-600 hover:bg-rose-50 font-bold rounded-xl transition cursor-pointer"
                                      >
                                        Reddet
                                      </button>
                                    </div>

                                    <button
                                      onClick={() => handleAcceptQuote(q, req)}
                                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                                    >
                                      <Check className="w-4 h-4" />
                                      <span>Teklifi Kabul Et ({q.price.toLocaleString('tr-TR')} ₺)</span>
                                    </button>
                                  </div>
                                )}

                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 3. MODAL: YENİ TALEP OLUŞTURMA SİHİRBAZI */}
      <TamTeklifWizardModal
        isOpen={showWizardModal}
        onClose={() => setShowWizardModal(false)}
        onSuccessNavigate={(newId) => {
          loadData();
          setExpandedRequestId(newId);
        }}
      />

      {/* 4. MODAL: ESNAFA SORU SOR */}
      {questionModalQuote && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fade-in text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-black text-slate-900 text-sm">
                  {questionModalQuote.merchantName} İşletmesine Soru Sor
                </h4>
                <p className="text-[11px] text-slate-500">
                  Telefon numaranız paylaşılmadan sistem üzerinden sorunuz iletilir.
                </p>
              </div>
              <button 
                onClick={() => setQuestionModalQuote(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendQuestion} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Sorunuz *</label>
                <textarea
                  rows={4}
                  required
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Örn: Malzeme ücreti teklife dahil mi? Yarın sabah 10:00 gibi gelebilir misiniz?..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 resize-none leading-relaxed"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuestionModalQuote(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-900 hover:bg-indigo-800 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>Soruyu Gönder</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
