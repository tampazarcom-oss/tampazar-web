/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, ShieldCheck, Clock, MapPin, Phone, 
  MessageCircle, Send, CheckCircle2, AlertCircle, 
  Filter, Search, ArrowRight, Eye, Check, X,
  Truck, Wrench, Hammer, Camera, Package, Key, Layers, ShoppingCart, DollarSign
} from 'lucide-react';
import { 
  QuotationRequest, 
  MerchantQuote, 
  getStoredQuotationRequests, 
  getStoredMerchantQuotes, 
  submitMerchantQuote,
  QUOTATION_CATEGORIES
} from '../../data/quotationRequestData';

interface TamTeklifOpportunitiesModuleProps {
  currentMerchantId?: string;
  currentStoreName?: string;
}

export default function TamTeklifOpportunitiesModule({
  currentMerchantId = 'store-kuzey-teknik',
  currentStoreName = 'Kuzey Teknik Tesisat & Mühendislik'
}: TamTeklifOpportunitiesModuleProps) {

  const [requests, setRequests] = useState<QuotationRequest[]>([]);
  const [quotes, setQuotes] = useState<MerchantQuote[]>([]);
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [timingFilter, setTimingFilter] = useState<string>('all');
  const [bidStatusFilter, setBidStatusFilter] = useState<'all' | 'not_bid' | 'my_bids'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Bid Modal State
  const [activeRequestForBid, setActiveRequestForBid] = useState<QuotationRequest | null>(null);
  const [bidPrice, setBidPrice] = useState<number>(1200);
  const [bidDuration, setBidDuration] = useState('2 Saat içinde adrese varış & onarım');
  const [bidNote, setBidNote] = useState('');
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Enlarged photo modal
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const loadData = () => {
    setRequests(getStoredQuotationRequests());
    setQuotes(getStoredMerchantQuotes());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenBidModal = (req: QuotationRequest) => {
    setActiveRequestForBid(req);
    // Pre-fill realistic values based on category
    if (req.category === 'oto-kurtarma') {
      setBidPrice(1250);
      setBidDuration('25 Dakika içinde yükleme');
      setBidNote('Tam kaskolu kayar kasa çekicimiz hemen konuma yönlendirilecektir. GİB e-Arşiv faturası kesilir.');
    } else if (req.category === 'tesisat') {
      setBidPrice(1350);
      setBidDuration('Bugün 17:00 da adreste');
      setBidNote('Termal kamera ile kırmadan noktasal tespit ve arızalı boru parça değişimi dahildir. 1 Yıl yazılı servis garantisi veriyoruz.');
    } else if (req.category === 'fotograf-produksiyon') {
      setBidPrice(6500);
      setBidDuration('2 İş Gününde WeTransfer ile teslim');
      setBidNote('4K profesyonel stüdyo çekimi, beyaz fon dekupe ve web için optimize teslimat dahildir.');
    } else {
      setBidPrice(2000);
      setBidDuration('Aynı gün teslimat / uygulama');
      setBidNote('Tüm işçilik ve sarf malzemeleri firmamız garantisi altındadır.');
    }
  };

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRequestForBid) return;
    setIsSubmittingBid(true);

    setTimeout(() => {
      submitMerchantQuote({
        requestId: activeRequestForBid.id,
        merchantId: currentMerchantId,
        merchantName: currentStoreName,
        merchantAvatar: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=120',
        merchantRating: 4.9,
        merchantReviewCount: 142,
        merchantBadges: ['Onaylı Usta', 'Sabit Fiyat Garantisi', 'GİB e-Faturalı'],
        distanceKm: activeRequestForBid.location.distanceKm || 2.4,
        price: Number(bidPrice),
        vatIncluded: true,
        duration: bidDuration,
        note: bidNote,
        phone: '0544 222 00 00',
        whatsapp: '905442220000'
      });

      setIsSubmittingBid(false);
      setActiveRequestForBid(null);
      loadData();
      showToast(`Fiyat teklifiniz (${Number(bidPrice).toLocaleString('tr-TR')} ₺) kapalı zarf usulü müşteriye iletildi!`);
    }, 500);
  };

  // Find if this merchant already gave a bid to a request
  const getMyBidForRequest = (requestId: string): MerchantQuote | undefined => {
    return quotes.find(q => q.requestId === requestId && q.merchantId === currentMerchantId);
  };

  // Filter requests
  const filteredRequests = requests.filter(req => {
    if (categoryFilter !== 'all' && req.category !== categoryFilter) return false;
    if (timingFilter !== 'all' && req.timing !== timingFilter) return false;
    
    const myBid = getMyBidForRequest(req.id);
    if (bidStatusFilter === 'my_bids' && !myBid) return false;
    if (bidStatusFilter === 'not_bid' && myBid) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = req.title.toLowerCase().includes(q);
      const matchDesc = req.description.toLowerCase().includes(q);
      const matchLoc = (req.location.district + ' ' + req.location.neighborhood).toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchLoc) return false;
    }

    return true;
  });

  const myBidsCount = requests.filter(r => getMyBidForRequest(r.id)).length;
  const myWonBidsCount = quotes.filter(q => q.merchantId === currentMerchantId && q.status === 'accepted').length;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-700 flex items-center gap-3 animate-fade-in text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. ÜST BAŞLIK VE KAPALI DEVRE GÜVENCE KARTI */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black shadow-xs">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  TamTeklif İhale & İş Fırsatları
                </span>
                <span className="text-[10px] font-bold text-slate-400">%0 Komisyon Doğrudan Kazanç</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">
                Bölgenizdeki Açık Talepler & İş Fırsatları
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl pt-1">
            Çevrenizdeki müşterilerin açtığı hizmet ve toplu ürün talepleri bu ekrana düşer. Teklifinizi kapalı zarf usulü iletin; diğer esnaflar teklifinizi göremez.
          </p>
        </div>

        {/* Sayaçlar */}
        <div className="flex items-center gap-4 text-center divide-x divide-slate-100 bg-slate-50 p-3 rounded-2xl border border-slate-100 shrink-0">
          <div className="px-3">
            <span className="text-lg font-black text-slate-900 font-mono block">{requests.length}</span>
            <span className="text-[10px] font-bold text-slate-400">Açık Fırsat</span>
          </div>
          <div className="px-3">
            <span className="text-lg font-black text-indigo-900 font-mono block">{myBidsCount}</span>
            <span className="text-[10px] font-bold text-slate-400">Verdiğim Teklif</span>
          </div>
          <div className="px-3">
            <span className="text-lg font-black text-emerald-600 font-mono block">{myWonBidsCount}</span>
            <span className="text-[10px] font-bold text-slate-400">Kabul Edilen</span>
          </div>
        </div>
      </div>

      {/* 2. KAPALI DEVRE (ARMUT MODELİ) GÜVENLİK BİLGİLENDİRMESİ */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 shadow-sm border border-indigo-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs">
            <span className="font-black text-amber-300 block text-sm">
              Gizli & Şeffaf Fiyat Mimarisi (Esnaflar Birbirini Göremez)
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Hiçbir rakip esnaf sizin verdiğiniz fiyatı veya teklif metnini göremez. Fiyat kırma yarışı yerine doğrudan kaliteli hizmet ve dürüst fiyat kazanır. Müşteri teklifinizi onayladığı an doğrudan telefon ve WhatsApp bağlantısı açılır.
            </p>
          </div>
        </div>
      </div>

      {/* 3. ARAMA VE FİLTRELEME ÇUBUĞU */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        
        {/* Sol Filtreler */}
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Arama Input */}
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="İş, arıza veya mahalle ara..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800"
            />
          </div>

          {/* Kategori Seçici */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none cursor-pointer"
          >
            <option value="all">Tüm Sektörler ({requests.length})</option>
            {QUOTATION_CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Aciliyet */}
          <select
            value={timingFilter}
            onChange={(e) => setTimingFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none cursor-pointer"
          >
            <option value="all">Tüm Zamanlamalar</option>
            <option value="urgent">⚡ Yalnızca Acil Talepler</option>
            <option value="within_24h">⏱️ 24 Saat İçinde</option>
            <option value="this_week">📅 Bu Hafta</option>
          </select>
        </div>

        {/* Sağ: Teklif Durumu Butonları */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setBidStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              bidStatusFilter === 'all' ? 'bg-white text-indigo-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tümü ({requests.length})
          </button>
          <button
            onClick={() => setBidStatusFilter('not_bid')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              bidStatusFilter === 'not_bid' ? 'bg-white text-indigo-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Teklif Vermediklerim
          </button>
          <button
            onClick={() => setBidStatusFilter('my_bids')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              bidStatusFilter === 'my_bids' ? 'bg-white text-indigo-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Teklif Verdiklerim ({myBidsCount})
          </button>
        </div>

      </div>

      {/* 4. AÇIK TALEP KARTLARI LİSTESİ */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900">Seçili kriterlerde açık talep bulunamadı</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Filtreleri sıfırlayarak tüm sektör ve aciliyetteki açık iş fırsatlarını görebilirsiniz.
            </p>
            <button
              onClick={() => { setCategoryFilter('all'); setTimingFilter('all'); setBidStatusFilter('all'); setSearchQuery(''); }}
              className="px-4 py-2 bg-indigo-900 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              Filtreleri Temizle
            </button>
          </div>
        ) : (
          filteredRequests.map((req) => {
            const myBid = getMyBidForRequest(req.id);
            const isWon = myBid?.status === 'accepted';
            const isRejected = myBid?.status === 'rejected';

            return (
              <div 
                key={req.id} 
                className={`bg-white rounded-3xl border p-6 shadow-xs space-y-5 transition-all ${
                  isWon 
                    ? 'border-emerald-300 ring-2 ring-emerald-500/20 bg-emerald-50/10' 
                    : myBid 
                    ? 'border-indigo-200 bg-indigo-50/10' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Üst Satır: No, Kategori, Aciliyet, Zaman */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {req.requestNumber}
                    </span>
                    <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                      {req.categoryTitle}
                    </span>
                    <span className="bg-indigo-50 text-indigo-800 font-bold px-2 py-0.5 rounded text-[10px]">
                      {req.subService}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-[11px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 ${
                      req.timing === 'urgent' ? 'bg-rose-100 text-rose-800 animate-pulse' :
                      req.timing === 'within_24h' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{req.timingLabel}</span>
                    </span>

                    <span className="text-xs text-slate-400 font-medium">
                      {req.createdAt}
                    </span>
                  </div>
                </div>

                {/* Ana İçerik: Başlık, Açıklama, Kapsam ve Konum */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Sol 2 Kolon: Açıklama ve Görseller */}
                  <div className="lg:col-span-2 space-y-3">
                    <h3 className="text-base font-black text-slate-900 leading-snug">
                      {req.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {req.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                      <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 font-bold text-slate-700">
                        📦 Kapsam: <span className="text-slate-900">{req.quantityOrScope}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{req.location.neighborhood}, {req.location.district}</span>
                        <strong className="text-indigo-900 font-bold">({req.location.distanceKm} km uzaklıkta)</strong>
                      </div>
                    </div>

                    {/* Fotoğraf Önizlemeleri */}
                    {req.attachments && req.attachments.length > 0 && (
                      <div className="pt-2 flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 block">Ek Görseller:</span>
                        <div className="flex gap-2">
                          {req.attachments.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt="Ek"
                              onClick={() => setPreviewPhoto(img)}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 cursor-pointer hover:opacity-80 transition"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sağ Kolon: Esnaf Aksiyonu / Verilen Teklif Durumu */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between space-y-3">
                    
                    {/* Durum Göstergesi */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-2">
                        <span>Piyasa Durumu:</span>
                        <span className="text-indigo-950 font-black">
                          {req.quotesCount} Esnaf Teklif Verdi
                        </span>
                      </div>

                      {/* Eğer bu esnaf teklif vermişse */}
                      {myBid ? (
                        <div className="space-y-2 pt-1">
                          <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                            isWon 
                              ? 'bg-emerald-100/60 border-emerald-300 text-emerald-950' 
                              : isRejected 
                              ? 'bg-rose-50 border-rose-200 text-rose-800' 
                              : 'bg-white border-indigo-200 text-indigo-950'
                          }`}>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase font-bold text-slate-400">Verdiğiniz Teklif:</span>
                              <span className="font-black text-sm font-mono text-slate-900">
                                {myBid.price.toLocaleString('tr-TR')} ₺
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 line-clamp-1 italic">
                              "{myBid.note}"
                            </p>
                            
                            <div className="pt-1 flex items-center justify-between border-t border-slate-100">
                              <span className="text-[10px] text-slate-400 font-mono">Süre: {myBid.duration}</span>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                isWon ? 'bg-emerald-600 text-white' :
                                isRejected ? 'bg-rose-600 text-white' :
                                'bg-indigo-100 text-indigo-800'
                              }`}>
                                {isWon ? 'Kabul Edildi 🎉' : isRejected ? 'Başka Teklif Seçildi' : 'Müşteri Değerlendiriyor'}
                              </span>
                            </div>
                          </div>

                          {/* KAZANILAN İŞ İÇİN MÜŞTERİ BİLGİLERİ */}
                          {isWon && (
                            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-2">
                              <span className="font-black text-emerald-900 block text-[11px]">
                                Müşteri İletişim Bilgileri Açıldı:
                              </span>
                              <p className="text-slate-800 font-bold">
                                {req.customer.name} • <span className="font-mono">{req.customer.realPhone}</span>
                              </p>
                              <p className="text-[11px] text-slate-600">
                                {req.location.fullAddressReal}
                              </p>

                              <div className="flex gap-2 pt-1">
                                <a
                                  href={`tel:${req.customer.realPhone}`}
                                  className="flex-1 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs flex items-center justify-center gap-1 transition"
                                >
                                  <Phone className="w-3.5 h-3.5 text-emerald-600" /> Ara
                                </a>
                                <a
                                  href={`https://wa.me/9${req.customer.realPhone.replace(/[^0-9]/g, '')}?text=Merhaba%20${encodeURIComponent(req.customer.name)},%20TamPazar%20üzerinden%20kabul%20ettiğiniz%20${encodeURIComponent(req.title)}%20işi%20için%20yazıyorum.`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-[11px] text-slate-500">
                            Müşterinin özel telefon ve açık kapı numarası teklif kabul edilene kadar gizlidir.
                          </p>
                          <button
                            onClick={() => handleOpenBidModal(req)}
                            className="w-full py-3 bg-indigo-900 hover:bg-indigo-800 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5 text-amber-400" />
                            <span>Kapalı Fiyat Teklifi Ver</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                      <span>🔒 Diğer teklifler gizlidir</span>
                      <span>%0 Platform Komisyonu</span>
                    </div>

                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* 5. MODAL: KAPALI FİYAT TEKLİFİ VERME SİHİRBAZI */}
      {activeRequestForBid && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fade-in text-xs">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {activeRequestForBid.requestNumber}
                </span>
                <h3 className="font-black text-slate-900 text-sm mt-1">
                  Müşteriye Kapalı Fiyat Teklifi İlet
                </h3>
              </div>
              <button 
                onClick={() => setActiveRequestForBid(null)} 
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* İş Özeti */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
              <span className="font-black text-slate-900 block text-xs">
                {activeRequestForBid.title}
              </span>
              <p className="text-[11px] text-slate-500 line-clamp-2">
                {activeRequestForBid.description}
              </p>
              <div className="pt-1 flex items-center gap-3 text-[10px] font-bold text-slate-400">
                <span>📍 {activeRequestForBid.location.neighborhood} ({activeRequestForBid.location.distanceKm} km)</span>
                <span>⏱️ {activeRequestForBid.timingLabel}</span>
              </div>
            </div>

            <form onSubmit={handleSubmitBid} className="space-y-3.5">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Net Fiyat Teklifiniz (₺) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={100}
                      step={50}
                      value={bidPrice}
                      onChange={(e) => setBidPrice(Number(e.target.value))}
                      className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-black text-slate-900 text-sm font-mono"
                    />
                    <span className="absolute right-3 top-2.5 text-slate-400 font-bold">₺</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                    KDV Dahil / Esnaf Net Fiyatı
                  </span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Tahmini Varış / Bitiş Süresi *
                  </label>
                  <input
                    type="text"
                    required
                    value={bidDuration}
                    onChange={(e) => setBidDuration(e.target.value)}
                    placeholder="Örn: 30 Dk içinde adreste"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Esnaf Teklif Açıklaması & Garanti Koşullarınız *
                </label>
                <textarea
                  rows={4}
                  required
                  value={bidNote}
                  onChange={(e) => setBidNote(e.target.value)}
                  placeholder="İşi nasıl yapacağınızı, kullanacağınız malzemeyi, cihazları veya garanti sürenizi yazın..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 resize-none leading-relaxed"
                />
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-2.5 text-[11px] text-indigo-950">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  Teklifiniz müşterinin <strong>/hesabim</strong> ekranındaki kapalı karşılaştırma listesine düşer. Müşteri kabul edene kadar müşterinin telefonu maskelidir.
                </span>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setActiveRequestForBid(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingBid}
                  className="flex-1 py-3 bg-indigo-900 hover:bg-indigo-800 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingBid ? (
                    <span>İletiliyor...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-amber-400" />
                      <span>Teklifi Müşteriye İlet</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 6. BÜYÜTÜLMÜŞ FOTOĞRAF MODALI */}
      {previewPhoto && (
        <div 
          onClick={() => setPreviewPhoto(null)} 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="max-w-2xl w-full bg-white rounded-3xl overflow-hidden p-2 shadow-2xl">
            <img src={previewPhoto} alt="Önizleme" className="w-full h-auto max-h-[80vh] object-contain rounded-2xl" />
          </div>
        </div>
      )}

    </div>
  );
}
