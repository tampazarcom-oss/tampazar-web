/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, CheckCircle2, ShieldCheck, Clock, MapPin, 
  ArrowRight, ArrowLeft, Upload, Sparkles, AlertCircle, 
  Building2, Phone, User, Check, Eye, HelpCircle,
  Truck, Wrench, Hammer, Camera, Package, Key, Layers, ShoppingCart, Image as ImageIcon
} from 'lucide-react';
import { 
  QUOTATION_CATEGORIES, 
  QuotationCategory, 
  createQuotationRequest, 
  QuotationRequest 
} from '../data/quotationRequestData';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface TamTeklifWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategoryId?: string;
  onSuccessNavigate?: (requestId: string) => void;
}

export default function TamTeklifWizardModal({
  isOpen,
  onClose,
  defaultCategoryId,
  onSuccessNavigate
}: TamTeklifWizardModalProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [selectedCategory, setSelectedCategory] = useState<QuotationCategory>(() => {
    return QUOTATION_CATEGORIES.find(c => c.id === defaultCategoryId) || QUOTATION_CATEGORIES[0];
  });
  const [subService, setSubService] = useState<string>(selectedCategory.popularSubServices[0] || '');

  // Step 2: Need details
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantityOrScope, setQuantityOrScope] = useState('');
  const [attachments, setAttachments] = useState<string[]>([
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600'
  ]);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');

  // Step 3: Location
  const [city, setCity] = useState(user?.city || 'Ordu');
  const [district, setDistrict] = useState(user?.district || 'Altınordu');
  const [neighborhood, setNeighborhood] = useState('Akyazı Mah.');
  const [fullAddress, setFullAddress] = useState('Sahil Cad. No: 14 Daire: 3');

  // Step 4: Timing & Contact
  const [timing, setTiming] = useState<'urgent' | 'within_24h' | 'this_week' | 'flexible'>('urgent');
  const [contactName, setContactName] = useState(user?.name || 'Emre Çakır');
  const [contactPhone, setContactPhone] = useState(user?.phone || '0532 555 12 34');
  const [contactEmail, setContactEmail] = useState(user?.email || 'emre.cakir@example.com');

  // Submission State
  const [createdRequest, setCreatedRequest] = useState<QuotationRequest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSelectCategory = (cat: QuotationCategory) => {
    setSelectedCategory(cat);
    setSubService(cat.popularSubServices[0] || '');
  };

  const handleAddSamplePhoto = (url: string) => {
    if (!attachments.includes(url)) {
      setAttachments([...attachments, url]);
    }
  };

  const handleRemovePhoto = (url: string) => {
    setAttachments(attachments.filter(a => a !== url));
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Truck': return <Truck className="w-5 h-5 text-indigo-600" />;
      case 'Wrench': return <Wrench className="w-5 h-5 text-emerald-600" />;
      case 'Hammer': return <Hammer className="w-5 h-5 text-amber-600" />;
      case 'Camera': return <Camera className="w-5 h-5 text-purple-600" />;
      case 'Package': return <Package className="w-5 h-5 text-blue-600" />;
      case 'Key': return <Key className="w-5 h-5 text-rose-600" />;
      case 'Layers': return <Layers className="w-5 h-5 text-amber-700" />;
      case 'ShoppingCart': return <ShoppingCart className="w-5 h-5 text-indigo-700" />;
      default: return <Sparkles className="w-5 h-5 text-indigo-600" />;
    }
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const timingMap = {
      urgent: 'Acil (En Kısa Sürede)',
      within_24h: '24 Saat İçinde',
      this_week: 'Bu Hafta İçinde',
      flexible: 'Esnek (1-2 Hafta)'
    };

    // Calculate masked phone
    const cleanPhone = contactPhone.replace(/\s+/g, '');
    const maskedPhone = cleanPhone.length >= 10 
      ? cleanPhone.slice(0, 4) + ' *** ** ' + cleanPhone.slice(-2)
      : '0532 *** ** 34';

    const maskedAddr = `${neighborhood} ${district} (Açık adres teklif kabulünde açılır)`;

    setTimeout(() => {
      const newReq = createQuotationRequest({
        category: selectedCategory.id,
        categoryTitle: selectedCategory.name,
        subService: subService || selectedCategory.popularSubServices[0],
        title: title || `${selectedCategory.name} - ${subService}`,
        description: description || 'İşin eksiksiz ve kaliteli şekilde tamamlanması için fiyat teklifleri bekleniyor.',
        quantityOrScope: quantityOrScope || '1 İş / Belirtilen Kapsam',
        attachments: attachments.length > 0 ? attachments : ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600'],
        location: {
          city,
          district,
          neighborhood,
          fullAddressMasked: maskedAddr,
          fullAddressReal: `${neighborhood} ${fullAddress}, ${district} / ${city}`,
          distanceKm: 2.4
        },
        timing,
        timingLabel: timingMap[timing],
        customer: {
          id: user?.id || 'cust-1',
          name: contactName,
          maskedPhone,
          realPhone: contactPhone,
          email: contactEmail
        },
        expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString().slice(0, 16).replace('T', ' ')
      });

      setCreatedRequest(newReq);
      setIsSubmitting(false);
      setStep(5); // Success step
    }, 600);
  };

  const handleFinishAndNavigate = () => {
    onClose();
    if (onSuccessNavigate && createdRequest) {
      onSuccessNavigate(createdRequest.id);
    } else {
      navigate('/hesabim?tab=quotes');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* MODAL HEADER */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black shadow-xs">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded">
                  TamTeklif
                </span>
                <span className="text-[10px] font-bold text-slate-300">Kapalı Devre Fiyat Toplama (%0 Komisyon)</span>
              </div>
              <h2 className="text-base font-black text-white mt-0.5">
                {step === 5 ? 'Talebiniz Başarıyla Yayınlandı!' : 'Ücretsiz Fiyat Teklifi Al'}
              </h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP PROGRESS BAR (Steps 1 to 4) */}
        {step < 5 && (
          <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-500 shrink-0">
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                step >= 1 ? 'bg-indigo-900 text-white' : 'bg-slate-200 text-slate-500'
              }`}>1</span>
              <span className={step === 1 ? 'text-indigo-950 font-black' : ''}>Kategori</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-200" />
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                step >= 2 ? 'bg-indigo-900 text-white' : 'bg-slate-200 text-slate-500'
              }`}>2</span>
              <span className={step === 2 ? 'text-indigo-950 font-black' : ''}>Detay</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-200" />
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                step >= 3 ? 'bg-indigo-900 text-white' : 'bg-slate-200 text-slate-500'
              }`}>3</span>
              <span className={step === 3 ? 'text-indigo-950 font-black' : ''}>Lokasyon</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-200" />
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                step >= 4 ? 'bg-indigo-900 text-white' : 'bg-slate-200 text-slate-500'
              }`}>4</span>
              <span className={step === 4 ? 'text-indigo-950 font-black' : ''}>Zaman & Onay</span>
            </div>
          </div>
        )}

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-5">

          {/* STEP 1: KATEGORİ VE HİZMET TÜRÜ SEÇİMİ */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-900">Hangi konuda fiyat teklifi almak istiyorsunuz?</h3>
                <p className="text-slate-500 text-[11px]">
                  İhtiyacınıza uygun sektörü seçin; talebiniz yalnızca o alanda tescilli yerel esnaflara düşer.
                </p>
              </div>

              {/* Kategori Kartları */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {QUOTATION_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory.id === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectCategory(cat)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-600' 
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0">
                        {getCategoryIcon(cat.iconName)}
                      </div>
                      <div className="space-y-1">
                        <span className="font-bold text-slate-900 block leading-tight text-xs">
                          {cat.name}
                        </span>
                        <p className="text-[10px] text-slate-500 leading-snug line-clamp-2">
                          {cat.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Alt Hizmet Seçimi / Popüler Etiketler */}
              <div className="pt-2 space-y-2">
                <label className="font-bold text-slate-800 block text-[11px]">
                  Popüler Hizmet Türleri ({selectedCategory.name}):
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedCategory.popularSubServices.map((sub, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSubService(sub)}
                      className={`px-3 py-1.5 rounded-xl border text-[11px] font-medium transition cursor-pointer ${
                        subService === sub 
                          ? 'bg-indigo-900 text-white border-indigo-900 font-bold' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: İŞİN / İHTİYACIN DETAYLARI */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-900">İşin veya Ürünün Detaylarını Belirtin</h3>
                <p className="text-slate-500 text-[11px]">
                  Esnafların net ve kesin fiyat verebilmesi için detayları, ölçüleri veya arıza durumunu yazın.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Talep Başlığı *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={`Örn: ${subService || 'Kırmadan noktasal kaçak tespiti ve tamir'}`}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-900 focus:bg-white focus:border-indigo-600 transition"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">İşin / İhtiyacın Detaylı Açıklaması *</label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mevcut arızanın veya ihtiyacın detayını yazın. Örn: Alt komşunun banyosuna su sızıyor. Fayansları kırmadan termal cihazla noktasal tespit ve onarım istiyoruz..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 focus:bg-white focus:border-indigo-600 transition resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Miktar / Kapsam (Opsiyonel)</label>
                  <input
                    type="text"
                    value={quantityOrScope}
                    onChange={(e) => setQuantityOrScope(e.target.value)}
                    placeholder="Örn: 1 Banyo (6 m²), 1 Araç (Binek), 50 Adet Ürün, vb."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>

                {/* Fotoğraf Ekleme Alanı */}
                <div className="space-y-2 pt-1">
                  <label className="font-bold text-slate-700 block">
                    Fotoğraf / Ek Dosyalar (Esnafın işi görmesi için):
                  </label>
                  
                  <div className="flex flex-wrap gap-2 items-center">
                    {attachments.map((imgUrl, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-xl border border-slate-200 overflow-hidden group">
                        <img src={imgUrl} alt="Ek Görsel" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(imgUrl)}
                          className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {/* Hızlı hazır örnekler ekleme */}
                    <button
                      type="button"
                      onClick={() => handleAddSamplePhoto('https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600')}
                      className="px-3 py-2 border border-dashed border-indigo-300 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-xl flex items-center gap-1.5 font-bold transition cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4 text-indigo-600" />
                      <span>+ Örnek Görsel Ekle</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: LOKASYON BİLGİLERİ */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-900">Hizmetin / Teslimatın Yapılacağı Konum</h3>
                <p className="text-slate-500 text-[11px]">
                  Yalnızca size yakın olan esnaflar teklif verecektir.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Şehir *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">İlçe *</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mahalle / Semt *</label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Örn: Akyazı Mah., Çarşı Mah., Düz Mah."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Açık Adres (Cadde, Bina, Daire)</label>
                <input
                  type="text"
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="Sahil Cad. Çınar Apt. No: 14 D: 3"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              {/* Gizlilik Güvenlik Rozeti */}
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-emerald-900 block text-xs">Adres Gizliliği Koruması</span>
                  <p className="text-[11px] text-emerald-800 leading-snug">
                    Açık kapı numaranız ve daireniz esnaflara <strong>gösterilmez</strong>. Esnaf panellerinde yalnızca semt ve yaklaşık mesafe (Örn: "Akyazı Mah. / 2.3 km") görünür. Tam adres yalnızca sizin teklifini kabul ettiğiniz esnafa açılır.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ZAMANLAMA VE İLETİŞİM ONAYI */}
          {step === 4 && (
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-900">Zamanlama ve İletişim Bilgileri</h3>
                <p className="text-slate-500 text-[11px]">
                  İşin aciliyetini seçin ve teklifler geldiğinde size ulaşabilmemiz için bilgilerinizi onaylayın.
                </p>
              </div>

              {/* Zamanlama Seçenekleri */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Bu iş ne zaman yapılmalı?</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'urgent', label: '⚡ Acil (Hemen / 1-2 Saat)', sub: 'Nöbetçi ve yakın ustalar' },
                    { id: 'within_24h', label: '⏱️ 24 Saat İçinde', sub: 'Gün içi planlı randevu' },
                    { id: 'this_week', label: '📅 Bu Hafta İçinde', sub: 'Hafta içi veya sonu' },
                    { id: 'flexible', label: '🗓️ Esnek (1-2 Hafta)', sub: 'En uygun fiyatı arıyorum' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTiming(t.id as any)}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                        timing === t.id 
                          ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-950 ring-1 ring-indigo-600' 
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="block text-xs font-bold">{t.label}</span>
                      <span className="block text-[10px] text-slate-400 font-normal">{t.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* İletişim Bilgileri */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Adınız Soyadınız *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cep Telefonunuz *</label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-900 font-mono"
                  />
                </div>
              </div>

              {/* GİZLİ TEKLİF & ARMUT MODELİ GÜVENCESİ */}
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-amber-900 block text-xs">🔒 Kapalı Devre Teklif Güvencesi</span>
                  <p className="text-[11px] text-amber-800 leading-snug">
                    Telefon numaranız esnaflarla <strong>asla paylaşılmaz</strong>. Esnaflar tekliflerini kapalı zarf usulü birbirini görmeden iletir. Teklifleri yalnızca siz kendi panelinizde kıyaslar ve onayladığınız esnafla tek tıkla görüşebilirsiniz.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-900 to-slate-900 hover:from-indigo-800 hover:to-slate-800 text-white font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Esnaflara İletiliyor...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Talebi Yayınla & Ücretsiz Teklif Topla</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 5: BAŞARI VE TEKLİF BEKLEME EKRANI */}
          {step === 5 && createdRequest && (
            <div className="text-center py-6 space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                  Talep Kodu: {createdRequest.requestNumber}
                </span>
                <h3 className="text-xl font-black text-slate-900 pt-2">
                  Talebiniz Çevredeki Onaylı Esnaflara İletildi!
                </h3>
                <p className="text-slate-500 text-xs max-w-md mx-auto leading-relaxed">
                  <strong>{createdRequest.location.district} / {createdRequest.location.city}</strong> bölgesindeki <strong>{createdRequest.categoryTitle}</strong> esnafları bildirimi aldı. Kapalı teklifler kısa süre içinde müşteri panelinize düşecektir.
                </p>
              </div>

              {/* Canlı Teklif Süreci Kartı */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 max-w-md mx-auto text-left space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Teklif Durumu:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Canlı Teklifler Bekleniyor
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Ortalama Yanıt Süresi:</span>
                  <span className="font-mono font-bold text-slate-900">15 - 30 Dakika</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Platform Komisyonu:</span>
                  <span className="font-black text-emerald-600 bg-emerald-100/70 px-2 py-0.5 rounded">%0 Komisyon</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 max-w-md mx-auto">
                <button
                  onClick={handleFinishAndNavigate}
                  className="flex-1 py-3 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Taleplerimi & Teklifleri Gör</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Tamam, Kapat
                </button>
              </div>
            </div>
          )}

        </div>

        {/* FOOTER NAVIGATION (Back / Next for Steps 1-3) */}
        {step >= 1 && step <= 3 && (
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Geri
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={() => {
                if (step === 2 && !title.trim()) {
                  setTitle(`${selectedCategory.name} - ${subService}`);
                }
                setStep((step + 1) as any);
              }}
              className="px-6 py-2.5 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Sonraki Adım</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
