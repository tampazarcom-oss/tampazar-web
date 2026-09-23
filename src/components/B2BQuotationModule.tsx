/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, Briefcase, CheckCircle2, ShieldCheck, Printer, 
  Plus, DollarSign, Download, Eye, Send, ArrowRight, X, Clock, FileCheck
} from 'lucide-react';
import { Tenant } from '../data/mockData';

interface B2BQuotationModuleProps {
  currentTenant: Tenant;
}

export interface B2BQuote {
  id: string;
  quoteNumber: string;
  customerCompany: string;
  customerTaxOffice: string;
  customerTaxId: string;
  contactPerson: string;
  contactEmail: string;
  date: string;
  validUntil: string;
  paymentTerms: 'Peşin / Sanal POS' | '30 Gün Vadeli' | '60 Gün Vadeli' | 'DBS Banka Garantili';
  items: {
    name: string;
    moq: number;
    unitPrice: number;
    discountPercent: number;
    total: number;
  }[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  withholdingCode: string; // Tevkifat Kodu (örn: 601 - 5/10)
  withholdingAmount: number;
  grandTotal: number;
  status: 'draft' | 'sent' | 'approved' | 'invoiced';
}

export const INITIAL_B2B_QUOTES: B2BQuote[] = [
  {
    id: 'q-2026-01',
    quoteNumber: 'PRF-2026-0089',
    customerCompany: 'Yıldız Otelcilik & Turizm A.Ş.',
    customerTaxOffice: 'Beşiktaş VD',
    customerTaxId: '9840291048',
    contactPerson: 'Serdar Yıldız (Satınalma Müdürü)',
    contactEmail: 'satinalma@yildizotel.com',
    date: '2026-09-21',
    validUntil: '2026-10-05',
    paymentTerms: 'DBS Banka Garantili',
    items: [
      {
        name: 'Masif Meşe Restoran Masası (180x90cm Özel Üretim)',
        moq: 20,
        unitPrice: 12500,
        discountPercent: 15,
        total: 212500
      },
      {
        name: 'Döşemeli Masif Sandalye (Su İtici Kumaş)',
        moq: 80,
        unitPrice: 2200,
        discountPercent: 12,
        total: 154880
      }
    ],
    subtotal: 367380,
    vatRate: 20,
    vatAmount: 73476,
    withholdingCode: '601 - Ağaç ve Orman Ürünleri (5/10)',
    withholdingAmount: 36738,
    grandTotal: 404118,
    status: 'approved'
  },
  {
    id: 'q-2026-02',
    quoteNumber: 'PRF-2026-0090',
    customerCompany: 'Marmara Perakende & Mağazacılık Ltd.',
    customerTaxOffice: 'Kadıköy VD',
    customerTaxId: '6102948102',
    contactPerson: 'Ebru Kaya',
    contactEmail: 'ebru@marmaraperakende.com',
    date: '2026-09-23',
    validUntil: '2026-10-15',
    paymentTerms: '30 Gün Vadeli',
    items: [
      {
        name: 'Hakiki Deri Oxford Ayakkabı (Koli İçi 12 Çift Asorti)',
        moq: 10,
        unitPrice: 14400,
        discountPercent: 20,
        total: 115200
      }
    ],
    subtotal: 115200,
    vatRate: 10,
    vatAmount: 11520,
    withholdingCode: 'Tevkifatsız',
    withholdingAmount: 0,
    grandTotal: 126720,
    status: 'sent'
  }
];

export default function B2BQuotationModule({ currentTenant }: B2BQuotationModuleProps) {
  const [quotes, setQuotes] = useState<B2BQuote[]>(() => {
    const saved = localStorage.getItem('tampazar_b2b_quotes_' + currentTenant.id);
    return saved ? JSON.parse(saved) : INITIAL_B2B_QUOTES;
  });

  const [activeQuoteModal, setActiveQuoteModal] = useState<B2BQuote | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // New Quote Form State
  const [companyName, setCompanyName] = useState('');
  const [taxOffice, setTaxOffice] = useState('');
  const [taxId, setTaxId] = useState('');
  const [person, setPerson] = useState('');
  const [terms, setTerms] = useState<B2BQuote['paymentTerms']>('Peşin / Sanal POS');
  const [itemName, setItemName] = useState('Toptan Koli / Palet Sevkiyatı');
  const [itemQty, setItemQty] = useState(25);
  const [itemPrice, setItemPrice] = useState(1500);
  const [discount, setDiscount] = useState(10);
  const [withholdingType, setWithholdingType] = useState('None');

  const handleCreateNewQuote = (e: React.FormEvent) => {
    e.preventDefault();
    const rawTotal = itemQty * itemPrice;
    const discountedTotal = rawTotal * (1 - discount / 100);
    const vat = discountedTotal * 0.20;
    const withholding = withholdingType === '5/10' ? vat * 0.5 : 0;
    const grand = discountedTotal + vat - withholding;

    const newQuote: B2BQuote = {
      id: 'q-' + Date.now(),
      quoteNumber: 'PRF-2026-00' + Math.floor(100 + Math.random() * 899),
      customerCompany: companyName || 'Örnek Kurumsal Tedarikçi A.Ş.',
      customerTaxOffice: taxOffice || 'Büyük Mükellefler VD',
      customerTaxId: taxId || '8940192840',
      contactPerson: person || 'Satınalma Yetkilisi',
      contactEmail: 'teklif@musteri.com',
      date: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      paymentTerms: terms,
      items: [
        {
          name: itemName,
          moq: itemQty,
          unitPrice: itemPrice,
          discountPercent: discount,
          total: discountedTotal
        }
      ],
      subtotal: discountedTotal,
      vatRate: 20,
      vatAmount: vat,
      withholdingCode: withholdingType === '5/10' ? '601 - Ağaç ve Metal Ürünleri (5/10)' : 'Tevkifatsız',
      withholdingAmount: withholding,
      grandTotal: grand,
      status: 'sent'
    };

    const updated = [newQuote, ...quotes];
    setQuotes(updated);
    localStorage.setItem('tampazar_b2b_quotes_' + currentTenant.id, JSON.stringify(updated));
    setShowCreateForm(false);
  };

  const handleApproveAndInvoice = (quote: B2BQuote) => {
    // Generate official GIB e-invoice from this quotation
    const savedInvoices = localStorage.getItem('tampazar_invoices');
    const invoices = savedInvoices ? JSON.parse(savedInvoices) : [];

    const newInv = {
      id: 'inv-b2b-' + Date.now(),
      invoiceNumber: 'GIB2026000000' + Math.floor(100 + Math.random() * 899),
      orderId: quote.quoteNumber,
      tenantId: currentTenant.id,
      customerName: quote.customerCompany,
      customerTaxOffice: quote.customerTaxOffice,
      customerTaxId: quote.customerTaxId,
      customerEmail: quote.contactEmail,
      date: new Date().toISOString().split('T')[0],
      amount: quote.subtotal,
      vatAmount: quote.vatAmount,
      withholdingTaxType: quote.withholdingAmount > 0 ? '5/10 Ağaç/Metal' : 'None',
      withholdingAmount: quote.withholdingAmount,
      totalPayable: quote.grandTotal,
      status: 'queued',
      integrator: 'gib'
    };

    invoices.push(newInv);
    localStorage.setItem('tampazar_invoices', JSON.stringify(invoices));
    window.dispatchEvent(new Event('tampazar_accounting_updated'));

    // Update quote status
    const updated = quotes.map(q => q.id === quote.id ? { ...q, status: 'invoiced' as const } : q);
    setQuotes(updated);
    localStorage.setItem('tampazar_b2b_quotes_' + currentTenant.id, JSON.stringify(updated));
    if (activeQuoteModal) setActiveQuoteModal({ ...activeQuoteModal, status: 'invoiced' });
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Header */}
      <div>
        <span className="text-xs font-mono text-sky-700 tracking-wider uppercase font-bold bg-sky-50 px-2.5 py-1 rounded border border-sky-200">
          B2B Toptan & Kurumsal İmalat Modülü
        </span>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 mt-2">
          B2B Teklif, Sözleşme & Proforma Fatura Motoru
        </h2>
        <p className="text-slate-500 text-sm mt-1 max-w-3xl leading-relaxed">
          Toptancı ve imalatçı dükkânlar için kurumsal teklif (RFQ) ve satış sözleşmesi motoru. Kademeli toptan iskonto, vade şartları, tevkifatlı KDV hesaplaması ve onaylanan teklifi tek tıkla doğrudan GİB e-Faturaya dönüştürme.
        </p>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-sky-900/40">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-base">Kurumsal Şirketlere Özel Proforma & Tevkifat Desteği</h3>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Müşterilerinize resmi antetli PDF proforma teklif iletin. Teklif onaylandığında tekrar veri girmeden otomatik GİB UBL-TR 2.1 e-Faturaya aktarın.
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-5 py-2.5 bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs rounded-xl transition-colors shrink-0 flex items-center gap-2 cursor-pointer shadow"
        >
          <Plus className="w-4 h-4" /> Yeni B2B Teklif Hazırla
        </button>
      </div>

      {/* New Quote Form */}
      {showCreateForm && (
        <div className="bg-white border-2 border-sky-100 rounded-3xl p-6 shadow-xl space-y-4 animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-sky-600" /> Yeni Proforma Teklif & Satış Sözleşmesi Oluştur
            </h3>
            <button onClick={() => setShowCreateForm(false)} className="text-xs text-slate-400 hover:text-slate-600">İptal</button>
          </div>

          <form onSubmit={handleCreateNewQuote} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Müşteri Firma Ünvanı</label>
              <input 
                type="text" 
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Örn: Anadolu Mobilya San. A.Ş."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Vergi Dairesi & VKN / TCKN</label>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  value={taxOffice}
                  onChange={(e) => setTaxOffice(e.target.value)}
                  placeholder="Vergi Dairesi"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none"
                />
                <input 
                  type="text" 
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder="VKN (10 Hane)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Ödeme & Vade Şartı</label>
              <select 
                value={terms}
                onChange={(e) => setTerms(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none"
              >
                <option value="Peşin / Sanal POS">Peşin / Doğrudan Sanal POS</option>
                <option value="30 Gün Vadeli">30 Gün Vadeli Çek / Senet</option>
                <option value="60 Gün Vadeli">60 Gün Vadeli</option>
                <option value="DBS Banka Garantili">DBS (Doğrudan Borçlandırma Sistemi)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Toptan Ürün / Proje Tanımı</label>
              <input 
                type="text" 
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Örn: Masif Meşe Özel Sipariş Toplu Üretim (Koli İçi 12 Adet)"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">KDV Tevkifat Durumu</label>
              <select 
                value={withholdingType}
                onChange={(e) => setWithholdingType(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none"
              >
                <option value="None">Tevkifatsız Standart KDV (%20)</option>
                <option value="5/10">5/10 Tevkifat (Ağaç / Metal / İmalat)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Miktar / Koli Adedi</label>
              <input 
                type="number" 
                value={itemQty}
                onChange={(e) => setItemQty(parseInt(e.target.value) || 1)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Birim Liste Fiyatı (₺)</label>
              <input 
                type="number" 
                value={itemPrice}
                onChange={(e) => setItemPrice(parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Toptan İskonto (%)</label>
              <input 
                type="number" 
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono outline-none"
              />
            </div>

            <div className="md:col-span-3 pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-sky-900 hover:bg-sky-800 text-white font-bold text-xs rounded-xl transition-colors shadow"
              >
                Proforma Teklifi Oluştur & Müşteriye İlet
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Quotations List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-sky-900" /> B2B Teklif & Sözleşme Arşivi
            </h3>
            <p className="text-xs text-slate-500">Müşteri onayındaki ve faturalandırılmış kurumsal siparişleriniz.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
              <tr>
                <th className="p-4">Proforma No & Tarih</th>
                <th className="p-4">Müşteri Şirket & VKN</th>
                <th className="p-4">Ödeme Vadesi</th>
                <th className="p-4">Tutar (KDV Dahil)</th>
                <th className="p-4">Durum</th>
                <th className="p-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {quotes.map((q) => (
                <tr key={q.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-slate-900 block">{q.quoteNumber}</span>
                    <span className="text-[10px] text-slate-400">Son Geçerlilik: {q.validUntil}</span>
                  </td>
                  <td className="p-4 font-sans">
                    <span className="font-bold text-slate-800 block">{q.customerCompany}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{q.customerTaxOffice} / {q.customerTaxId}</span>
                  </td>
                  <td className="p-4 font-sans">
                    <span className="font-bold text-slate-700 block">{q.paymentTerms}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-black text-indigo-950 text-sm block">
                      {q.grandTotal.toLocaleString('tr-TR')} ₺
                    </span>
                    {q.withholdingAmount > 0 && (
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-medium block w-max">
                        {q.withholdingCode}
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-sans">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      q.status === 'invoiced' ? 'bg-purple-100 text-purple-800' :
                      q.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                      q.status === 'sent' ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {q.status === 'invoiced' ? '✓ GİB e-Faturaya Aktarıldı' :
                       q.status === 'approved' ? '✓ Müşteri Onayladı' :
                       q.status === 'sent' ? '⏳ Onay Bekliyor' : 'Taslak'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setActiveQuoteModal(q)}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 ml-auto transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-sky-600" /> İncele & PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proforma View & Digital Approval Modal */}
      {activeQuoteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-300 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 px-6 flex justify-between items-center text-xs">
              <span className="font-bold flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" /> B2B Proforma Teklif & Satış Sözleşmesi ({activeQuoteModal.quoteNumber})
              </span>
              <button onClick={() => setActiveQuoteModal(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {/* Document Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs font-sans">
              {/* Top Meta */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <h4 className="font-black text-base text-slate-900">{currentTenant.name}</h4>
                  <p className="text-slate-500 font-mono text-[11px]">{currentTenant.taxOffice || 'Altınordu VD'} · {currentTenant.taxId || '5284019284'}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold font-mono text-slate-900">{activeQuoteModal.quoteNumber}</div>
                  <div className="text-slate-400 text-[10px]">Tarih: {activeQuoteModal.date}</div>
                  <div className="text-slate-400 text-[10px]">Geçerlilik: {activeQuoteModal.validUntil}</div>
                </div>
              </div>

              {/* Customer Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">ALICI FİRMA BİLGİLERİ:</span>
                <strong className="text-sm text-slate-900 block">{activeQuoteModal.customerCompany}</strong>
                <div className="text-slate-600 font-mono">{activeQuoteModal.customerTaxOffice} / {activeQuoteModal.customerTaxId}</div>
                <div className="text-slate-600">İlgili: {activeQuoteModal.contactPerson} ({activeQuoteModal.contactEmail})</div>
                <div className="text-slate-800 font-semibold pt-1">Ödeme Vadesi: {activeQuoteModal.paymentTerms}</div>
              </div>

              {/* Items Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 font-bold text-slate-700 text-[11px]">
                    <tr>
                      <th className="p-3">Ürün / Hizmet</th>
                      <th className="p-3 text-center">Adet/Koli</th>
                      <th className="p-3 text-right">Birim Fiyat</th>
                      <th className="p-3 text-right">İskonto</th>
                      <th className="p-3 text-right">Toplam</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {activeQuoteModal.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-sans font-medium text-slate-900">{it.name}</td>
                        <td className="p-3 text-center">{it.moq}</td>
                        <td className="p-3 text-right">{it.unitPrice.toLocaleString('tr-TR')} ₺</td>
                        <td className="p-3 text-right">%{it.discountPercent}</td>
                        <td className="p-3 text-right font-bold text-slate-900">{it.total.toLocaleString('tr-TR')} ₺</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 font-mono ml-auto max-w-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Ara Toplam:</span>
                  <span className="font-bold">{activeQuoteModal.subtotal.toLocaleString('tr-TR')} ₺</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Hesaplanan KDV (%{activeQuoteModal.vatRate}):</span>
                  <span>{activeQuoteModal.vatAmount.toLocaleString('tr-TR')} ₺</span>
                </div>
                {activeQuoteModal.withholdingAmount > 0 && (
                  <div className="flex justify-between text-amber-700 font-bold">
                    <span className="font-sans">Tevkifat Tutarı:</span>
                    <span>-{activeQuoteModal.withholdingAmount.toLocaleString('tr-TR')} ₺</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
                  <span className="font-sans">Ödenecek Toplam:</span>
                  <span className="text-indigo-950">{activeQuoteModal.grandTotal.toLocaleString('tr-TR')} ₺</span>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="bg-slate-100 p-4 px-6 border-t border-slate-200 flex justify-between items-center">
              <button
                onClick={() => alert(`Proforma PDF çıktısı oluşturuldu: ${activeQuoteModal.quoteNumber}`)}
                className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4" /> PDF İndir / Yazdır
              </button>

              {activeQuoteModal.status !== 'invoiced' ? (
                <button
                  onClick={() => handleApproveAndInvoice(activeQuoteModal)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" /> Teklifi Onayla & GİB e-Faturaya Aktar
                </button>
              ) : (
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> GİB e-Faturaya Başarıyla Aktarıldı
                </span>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
