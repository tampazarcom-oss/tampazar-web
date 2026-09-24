import React, { useState } from 'react';
import { 
  X, Check, AlertCircle, Users, Building, 
  Phone, Mail, MapPin, DollarSign, Calendar, Percent, 
  MessageSquare, ShieldCheck, FileText
} from 'lucide-react';
import { LedgerAccount } from '../../data/mockData';

interface AdvancedLedgerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAccount: (account: LedgerAccount) => void;
  tenantId?: string;
}

export default function AdvancedLedgerAccountModal({
  isOpen,
  onClose,
  onSaveAccount,
  tenantId = 's3'
}: AdvancedLedgerAccountModalProps) {
  // Cari Tipi
  const [accountType, setAccountType] = useState<'buyer' | 'supplier' | 'both'>('buyer');
  
  // Şahıs / Şirket
  const [isCompany, setIsCompany] = useState<boolean>(true);
  
  // Kimlik Bilgileri
  const [name, setName] = useState('');
  const [legalTitle, setLegalTitle] = useState('');
  const [taxId, setTaxId] = useState('');
  const [taxOffice, setTaxOffice] = useState('');
  
  // İletişim & Lokasyon
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [city, setCity] = useState('İstanbul');
  const [district, setDistrict] = useState('Kadıköy');
  const [address, setAddress] = useState('');

  // Finansal Ayarlar
  const [openingBalanceType, setOpeningBalanceType] = useState<'receivable' | 'payable' | 'zero'>('zero');
  const [openingBalanceAmount, setOpeningBalanceAmount] = useState<number>(0);
  const [dueDays, setDueDays] = useState<number>(30);
  const [discountRate, setDiscountRate] = useState<number>(0);

  // Validation
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Zorunlu alan doğrulamaları
    if (!name.trim()) {
      setError('Lütfen Cari Kart Adı / Şahıs Adını giriniz.');
      return;
    }

    if (!taxId.trim()) {
      setError(isCompany ? 'Lütfen 10 haneli Vergi Kimlik Numarasını giriniz.' : 'Lütfen 11 haneli TC Kimlik Numarasını giriniz.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('GİB e-Fatura ve e-Arşiv gönderimi için geçerli bir e-posta adresi zorunludur.');
      return;
    }

    // Kod üretici (120: Alıcılar, 320: Satıcılar)
    const prefix = accountType === 'buyer' ? '120.01.' : accountType === 'supplier' ? '320.01.' : '120.02.';
    const randomSuffix = Math.floor(100 + Math.random() * 899).toString();
    const code = prefix + randomSuffix;

    let balance = 0;
    if (openingBalanceType === 'receivable') {
      balance = Math.abs(openingBalanceAmount);
    } else if (openingBalanceType === 'payable') {
      balance = -Math.abs(openingBalanceAmount);
    }

    const newAccount: LedgerAccount = {
      id: 'acc-' + Date.now(),
      tenantId,
      name: name.trim(),
      code,
      type: accountType,
      balance,
      email: email.trim(),
      taxId: taxId.trim(),
      taxOffice: taxOffice.trim() || undefined,
      phone: phone.trim() || undefined,
      whatsapp: whatsapp.trim() || phone.trim() || undefined,
      city,
      district,
      address: address.trim() || undefined,
      isCompany,
      legalTitle: isCompany ? (legalTitle.trim() || name.trim()) : undefined,
      dueDays: Number(dueDays),
      discountRate: Number(discountRate),
      openingBalance: balance
    };

    onSaveAccount(newAccount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* MODAL HEADER */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-full">
                  Ön Muhasebe & ERP
                </span>
                <span className="text-[10px] font-bold text-slate-400">BizimHesap & Paraşüt Standardı</span>
              </div>
              <h2 className="text-base font-black text-slate-900 mt-0.5">
                Yeni Cari Hesap Kartı Tanımla
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-200/70 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ERROR BANNER */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-rose-800 text-xs font-bold animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* FORM BODY */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {/* CARİ TİPİ SEÇİMİ */}
          <div className="space-y-1.5">
            <label className="font-black text-slate-900 block">Cari Kart Rolü & Tipi <span className="text-rose-600 font-black">*</span></label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAccountType('buyer')}
                className={`py-2.5 px-3 rounded-xl border text-center font-bold transition cursor-pointer ${
                  accountType === 'buyer' 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/20 shadow-xs' 
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                👤 Müşteri (Alıcı)
              </button>
              <button
                type="button"
                onClick={() => setAccountType('supplier')}
                className={`py-2.5 px-3 rounded-xl border text-center font-bold transition cursor-pointer ${
                  accountType === 'supplier' 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/20 shadow-xs' 
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                🏭 Tedarikçi / Toptancı
              </button>
              <button
                type="button"
                onClick={() => setAccountType('both')}
                className={`py-2.5 px-3 rounded-xl border text-center font-bold transition cursor-pointer ${
                  accountType === 'both' 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/20 shadow-xs' 
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                🔄 Hem Müşteri / Tedarikçi
              </button>
            </div>
          </div>

          {/* ŞİRKET / ŞAHIS AYRIMI */}
          <div className="flex items-center gap-6 p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="font-bold text-slate-800">Vergi Mükellefiyeti:</span>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
              <input
                type="radio"
                name="isCompany"
                checked={isCompany}
                onChange={() => setIsCompany(true)}
                className="text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span>Kurumsal / Şirket (VKN)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
              <input
                type="radio"
                name="isCompany"
                checked={!isCompany}
                onChange={() => setIsCompany(false)}
                className="text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span>Bireysel / Şahıs (TCKN)</span>
            </label>
          </div>

          {/* KİMLİK & TİCARİ BİLGİLER */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Cari / Şahıs Adı */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                {isCompany ? 'Firma Kısa Adı / Cari Tanımı' : 'Ad Soyad'} <span className="text-rose-600 font-black">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isCompany ? 'Örn: Karadeniz Toptan Ltd.' : 'Örn: Ahmet Yılmaz'}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:border-indigo-600 focus:bg-white transition"
              />
            </div>

            {/* TC veya Vergi No */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                {isCompany ? 'Vergi Kimlik No (VKN - 10 Hane)' : 'T.C. Kimlik No (11 Hane)'} <span className="text-rose-600 font-black">*</span>
              </label>
              <input
                type="text"
                maxLength={isCompany ? 10 : 11}
                value={taxId}
                onChange={(e) => setTaxId(e.target.value.replace(/\D/g, ''))}
                placeholder={isCompany ? '1234567890' : '11111111110'}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 outline-none focus:border-indigo-600 focus:bg-white transition"
              />
            </div>

            {/* Resmi Ticari Unvan (Sadece Şirket) */}
            {isCompany && (
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-800 block mb-1">
                  Resmi Ticari Unvan (GİB e-Fatura İçin Tam Ünvan)
                </label>
                <input
                  type="text"
                  value={legalTitle}
                  onChange={(e) => setLegalTitle(e.target.value)}
                  placeholder="Örn: Karadeniz Toptan ve Perakende Gıda Dağıtım San. Tic. Ltd. Şti."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:border-indigo-600 focus:bg-white transition"
                />
              </div>
            )}

            {/* Vergi Dairesi */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">Vergi Dairesi</label>
              <input
                type="text"
                value={taxOffice}
                onChange={(e) => setTaxOffice(e.target.value)}
                placeholder="Örn: Altınordu VD veya Kadıköy VD"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:border-indigo-600"
              />
            </div>

            {/* E-Posta (Zorunlu) */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                E-Posta Adresi (e-Fatura Sevk) <span className="text-rose-600 font-black">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="muhasebe@firma.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:border-indigo-600"
              />
            </div>

            {/* Telefon & WhatsApp */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">Telefon Numarası</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0532 123 45 67"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">WhatsApp Numarası (Hesap Özeti İçin)</label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="0532 123 45 67"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:border-indigo-600"
              />
            </div>

            {/* İl & İlçe */}
            <div>
              <label className="font-bold text-slate-800 block mb-1">Şehir / İl</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="İstanbul, Ordu, Ankara..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">İlçe</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Kadıköy, Altınordu, Çankaya..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:border-indigo-600"
              />
            </div>

            {/* Açık Adres */}
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-800 block mb-1">Açık Sevk / Fatura Adresi</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Mahalle, cadde, sokak, bina ve kapı numarası..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:border-indigo-600"
              />
            </div>

          </div>

          {/* FİNANSAL AYARLAR BÖLÜMÜ */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <span className="font-black text-slate-900 block">Finansal Parametreler & Vade Koşulları</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Açılış Bakiyesi */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Açılış Bakiye Durumu</label>
                <select
                  value={openingBalanceType}
                  onChange={(e) => setOpeningBalanceType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 outline-none"
                >
                  <option value="zero">Bakiye Yok (0,00 ₺)</option>
                  <option value="receivable">Alacaklıyız (Müşteri Borçlu)</option>
                  <option value="payable">Borçluyuz (Tedarikçi Alacaklı)</option>
                </select>
              </div>

              {openingBalanceType !== 'zero' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Açılış Tutarı (₺)</label>
                  <input
                    type="number"
                    min={0}
                    value={openingBalanceAmount}
                    onChange={(e) => setOpeningBalanceAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold font-mono text-slate-900 outline-none"
                  />
                </div>
              )}

              {/* Vade Günü */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Standart Vade (Gün)</label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={dueDays}
                    onChange={(e) => setDueDays(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold font-mono text-slate-900 outline-none"
                  />
                  <span className="absolute right-3 top-2 text-slate-400 font-bold">Gün</span>
                </div>
              </div>

              {/* Tanımlı İskonto */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Özel İskonto Oranı (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={discountRate}
                    onChange={(e) => setDiscountRate(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold font-mono text-slate-900 outline-none"
                  />
                  <span className="absolute right-3 top-2 text-slate-400 font-bold">%</span>
                </div>
              </div>

            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer text-xs"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-sm transition cursor-pointer text-xs flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Cari Kartı Kaydet
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
