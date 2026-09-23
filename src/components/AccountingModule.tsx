/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FileText, Plus, ArrowUpRight, ArrowDownLeft, FileCode, Check, Eye, EyeOff, Printer, ShieldAlert, BarChart3, AlertCircle, TrendingUp } from 'lucide-react';
import { Tenant, Invoice, LedgerAccount, LedgerTransaction, initialInvoices, initialLedgerAccounts, initialLedgerTransactions } from '../data/mockData';
import FinancialForecastingModule from './FinancialForecastingModule';

interface AccountingModuleProps {
  currentTenant: Tenant;
}

export default function AccountingModule({ currentTenant }: AccountingModuleProps) {
  // Load local storage states
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('tampazar_invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [accounts, setAccounts] = useState<LedgerAccount[]>(() => {
    const saved = localStorage.getItem('tampazar_ledger_accounts');
    return saved ? JSON.parse(saved) : initialLedgerAccounts;
  });

  const [transactions, setTransactions] = useState<LedgerTransaction[]>(() => {
    const saved = localStorage.getItem('tampazar_ledger_transactions');
    return saved ? JSON.parse(saved) : initialLedgerTransactions;
  });

  // Active interaction states
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [viewingXml, setViewingXml] = useState(false);
  const [viewingGibPdf, setViewingGibPdf] = useState(false);
  
  // Custom Invoice generation state
  const [activeTab, setActiveTab] = useState<'invoices' | 'ledgers' | 'cashflow' | 'forecast'>('invoices');
  const [selectedCari, setSelectedCari] = useState<LedgerAccount | null>(null);
  
  // Tevkifat & KDV states for new e-Invoice drafting
  const [draftingInvoice, setDraftingInvoice] = useState<Invoice | null>(null);
  const [tevkifatType, setTevkifatType] = useState<'None' | '2/10' | '5/10' | '9/10'>('None');
  const [activeIntegrator, setActiveIntegrator] = useState<'gib' | 'uyumsoft' | 'edm' | 'foriba'>('gib');

  // Load from local storage dynamically when custom checkout event triggers
  const loadDataFromStorage = () => {
    const savedInv = localStorage.getItem('tampazar_invoices');
    const savedAcc = localStorage.getItem('tampazar_ledger_accounts');
    const savedTx = localStorage.getItem('tampazar_ledger_transactions');
    if (savedInv) setInvoices(JSON.parse(savedInv));
    if (savedAcc) setAccounts(JSON.parse(savedAcc));
    if (savedTx) setTransactions(JSON.parse(savedTx));
  };

  useEffect(() => {
    loadDataFromStorage();
    // Watch custom events
    window.addEventListener('tampazar_accounting_updated', loadDataFromStorage);
    window.addEventListener('tampazar_invoice_added', loadDataFromStorage);
    return () => {
      window.removeEventListener('tampazar_accounting_updated', loadDataFromStorage);
      window.removeEventListener('tampazar_invoice_added', loadDataFromStorage);
    };
  }, []);

  // Filter lists by current Tenant
  const tenantInvoices = invoices.filter(i => i.tenantId === currentTenant.id);
  const tenantAccounts = accounts.filter(a => a.tenantId === currentTenant.id);
  const tenantTransactions = transactions.filter(t => t.tenantId === currentTenant.id);

  // Financial calculations
  const totalReceivable = tenantAccounts.filter(a => a.type === 'buyer').reduce((sum, a) => sum + a.balance, 0);
  const totalPayable = Math.abs(tenantAccounts.filter(a => a.type === 'supplier').reduce((sum, a) => sum + a.balance, 0));

  // Simulated Tevkifat deduction math
  // Formula: KDV Tutarı * (Seçilen Oran) düşülerek tevkifat tutarı hesaplanır, faturadan indirilir.
  const calculateWithholdingAmount = (vatAmt: number, type: typeof tevkifatType): number => {
    if (type === 'None') return 0;
    const [num, den] = type.split('/').map(Number);
    return parseFloat(((vatAmt * num) / den).toFixed(2));
  };

  const handleOpenDrafting = (invoice: Invoice) => {
    setDraftingInvoice(invoice);
    setTevkifatType('None');
    setViewingGibPdf(false);
    setViewingXml(false);
  };

  const handleIssueInvoice = () => {
    if (!draftingInvoice) return;

    // Calculate details
    const vatAmt = draftingInvoice.vatAmount;
    const withholdingAmt = calculateWithholdingAmount(vatAmt, tevkifatType);
    const payableTotal = parseFloat((draftingInvoice.amount + vatAmt - withholdingAmt).toFixed(2));

    const updatedInvoices = invoices.map(inv => {
      if (inv.id === draftingInvoice.id) {
        return {
          ...inv,
          withholdingTaxType: tevkifatType,
          withholdingAmount: withholdingAmt,
          totalPayable: payableTotal,
          status: 'issued' as const,
          integrator: activeIntegrator
        };
      }
      return inv;
    });

    setInvoices(updatedInvoices);
    localStorage.setItem('tampazar_invoices', JSON.stringify(updatedInvoices));
    
    const finalized = updatedInvoices.find(inv => inv.id === draftingInvoice.id) || null;
    setSelectedInvoice(finalized);
    setDraftingInvoice(null);
    setViewingGibPdf(true); // Open PDF preview instantly!
  };

  // UBL-TR 2.1 e-Invoice XML generation code builder
  const getUblXml = (invoice: Invoice | null): string => {
    if (!invoice) return '';
    
    const tevkifatCode = tevkifatType !== 'None' ? '601' : '';
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
         UUID="${invoice.orderId}-49d3-82a1-a71c8291039a"
         UBLVersionID="2.1"
         CustomizationID="TR1.2">
  <cbc:CopyIndicator>false</cbc:CopyIndicator>
  <cbc:ID>${invoice.invoiceNumber}</cbc:ID>
  <cbc:IssueDate>${invoice.date}</cbc:IssueDate>
  <cbc:InvoiceTypeCode>SATIS</cbc:InvoiceTypeCode>
  <cbc:DocumentCurrencyCode>TRY</cbc:DocumentCurrencyCode>

  <!-- SATICI BİLGİLERİ (SAAS TENANT) -->
  <cac:AccountingSupplierParty>
    <cac:Party>
      <cac:PartyName>
        <cbc:Name>${currentTenant.name}</cbc:Name>
      </cac:PartyName>
      <cac:PostalAddress>
        <cbc:CitySubdivisionName>Nilüfer</cbc:CitySubdivisionName>
        <cbc:CityName>Bursa</cbc:CityName>
        <cbc:CountryName>Türkiye</cbc:CountryName>
      </cac:PostalAddress>
      <cac:PartyTaxScheme>
        <cac:TaxScheme>
          <cbc:Name>Bursa Vergi Dairesi</cbc:Name>
        </cac:TaxScheme>
      </cac:PartyTaxScheme>
    </cac:Party>
  </cac:AccountingSupplierParty>

  <!-- ALICI BİLGİLERİ (MÜŞTERİ CARİ) -->
  <cac:AccountingCustomerParty>
    <cac:Party>
      <cac:PartyName>
        <cbc:Name>${invoice.customerName}</cbc:Name>
      </cac:PartyName>
      <cac:PostalAddress>
        <cbc:CitySubdivisionName>${invoice.customerTaxOffice}</cbc:CitySubdivisionName>
        <cbc:CityName>İstanbul</cbc:CityName>
        <cbc:CountryName>Türkiye</cbc:CountryName>
      </cac:PostalAddress>
      <cac:PartyTaxScheme>
        <cac:TaxScheme>
          <cbc:Name>${invoice.customerTaxOffice}</cbc:Name>
        </cac:TaxScheme>
      </cac:PartyTaxScheme>
    </cac:Party>
  </cac:AccountingCustomerParty>

  <!-- KDV & TEVKİFAT VERGİ TOPLAMLARI -->
  <cac:TaxTotal>
    <cbc:TaxAmount currencyID="TRY">${invoice.vatAmount}</cbc:TaxAmount>
    <cac:TaxSubtotal>
      <cbc:TaxableAmount currencyID="TRY">${invoice.amount}</cbc:TaxableAmount>
      <cbc:TaxAmount currencyID="TRY">${invoice.vatAmount}</cbc:TaxAmount>
      <cac:TaxCategory>
        <cac:TaxScheme>
          <cbc:Name>Katma Değer Vergisi</cbc:Name>
          <cbc:TaxTypeCode>0015</cbc:TaxTypeCode>
        </cac:TaxScheme>
      </cac:TaxCategory>
    </cac:TaxSubtotal>
    ${invoice.withholdingAmount > 0 ? `
    <cac:WithholdingTaxTotal>
      <cbc:TaxAmount currencyID="TRY">${invoice.withholdingAmount}</cbc:TaxAmount>
      <cac:TaxSubtotal>
        <cbc:TaxAmount currencyID="TRY">${invoice.withholdingAmount}</cbc:TaxAmount>
        <cac:TaxCategory>
          <cbc:TaxCategoryCode>${tevkifatCode}</cbc:TaxCategoryCode>
          <cac:TaxScheme>
            <cbc:Name>KDV Tevkifatı (${invoice.withholdingTaxType})</cbc:Name>
          </cac:TaxScheme>
        </cac:TaxCategory>
      </cac:TaxSubtotal>
    </cac:WithholdingTaxTotal>` : ''}
  </cac:TaxTotal>

  <!-- FATURA DETAY TOPLAMI -->
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="TRY">${invoice.amount}</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="TRY">${invoice.amount}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="TRY">${invoice.amount + invoice.vatAmount}</cbc:TaxInclusiveAmount>
    <cbc:AllowanceTotalAmount currencyID="TRY">0.00</cbc:AllowanceTotalAmount>
    <cbc:PayableAmount currencyID="TRY">${invoice.totalPayable}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>
</Invoice>`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Editorial Title */}
      <div>
        <span className="text-xs font-mono text-emerald-600 tracking-wider uppercase font-semibold">04. Yerleşik Ön Muhasebe & E-Fatura</span>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mt-1">Cari Hesap Defteri & GİB Entegratör Modülü</h2>
        <p className="text-slate-500 text-sm mt-1 max-w-3xl">
          Satış yapıldığında sistem anında cari hareket kaydı açar. Faturalar, e-Fatura / e-Arşiv XML formatlarında (UBL-TR 2.1) KDV ve Tevkifat hesaplarıyla otomatik mühürlenir ve seçili entegratör API kuyruğuna iletilir.
        </p>
      </div>

      {/* Financial scoreboards - Unboxed stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 border-b border-slate-100 pb-6">
        <div className="space-y-1">
          <span className="text-xs text-slate-400 font-mono">Toplam Borçlular (Receivables)</span>
          <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
            {totalReceivable.toLocaleString('tr-TR')} TL
          </div>
          <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" /> Cari Varlık artış hızı dengeli
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-slate-400 font-mono">Toplam Alacaklılar (Payables)</span>
          <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
            {totalPayable.toLocaleString('tr-TR')} TL
          </div>
          <span className="text-[10px] text-indigo-500 flex items-center gap-0.5">
            <ArrowDownLeft className="w-3.5 h-3.5" /> Tedarikçi bakiyeleri güncel
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-slate-400 font-mono">Sırada Bekleyen Faturalar</span>
          <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
            {tenantInvoices.filter(i => i.status === 'queued').length} adet
          </div>
          <span className="text-[10px] text-amber-600 flex items-center gap-0.5">
            <AlertCircle className="w-3.5 h-3.5" /> Resmileştirilmesi bekliyor
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-slate-400 font-mono">Resmileşen e-Faturalar</span>
          <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
            {tenantInvoices.filter(i => i.status === 'issued').length} adet
          </div>
          <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
            ✓ GİB Portal / e-Fatura entegre edildi
          </span>
        </div>
      </div>

      {/* Segmented controls for Accounting Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-lg w-max flex-wrap gap-1">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'invoices' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          e-Fatura Havuzu & GİB Entegrasyonu
        </button>
        <button
          onClick={() => setActiveTab('ledgers')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'ledgers' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Cari Hesap Kartları
        </button>
        <button
          onClick={() => setActiveTab('cashflow')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'cashflow' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Finansal Analiz & Yaşlandırma
        </button>
        <button
          onClick={() => setActiveTab('forecast')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
            activeTab === 'forecast' ? 'bg-indigo-600 text-white shadow-sm' : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" /> Finansal Tahminleme
        </button>
      </div>

      {activeTab === 'forecast' ? (
        <FinancialForecastingModule
          currentTenant={currentTenant}
          invoices={invoices}
          accounts={accounts}
          transactions={transactions}
        />
      ) : (
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Dynamic Data Display based on active tab */}
        <div className="xl:col-span-8 bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4 h-[550px] overflow-y-auto">
          
          {activeTab === 'invoices' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Fatura Sırası & Resmileştirilmeyi Bekleyenler</h3>
              </div>
              
              <div className="border border-slate-100 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                    <tr>
                      <th className="p-3">Fatura No</th>
                      <th className="p-3">Müşteri</th>
                      <th className="p-3">Tarih</th>
                      <th className="p-3 text-right">Tutar</th>
                      <th className="p-3">Durum</th>
                      <th className="p-3 text-center">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px] tabular-nums">
                    {tenantInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-semibold text-slate-800">{inv.invoiceNumber}</td>
                        <td className="p-3 font-sans font-medium text-slate-600">{inv.customerName}</td>
                        <td className="p-3 text-slate-400">{inv.date}</td>
                        <td className="p-3 text-right font-bold text-slate-800">{inv.totalPayable.toLocaleString('tr-TR')} TL</td>
                        <td className="p-3 font-sans">
                          {inv.status === 'queued' ? (
                            <span className="text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded text-[10px] font-semibold">Sırada Bekliyor</span>
                          ) : (
                            <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded text-[10px] font-semibold">✓ Resmileşti</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {inv.status === 'queued' ? (
                            <button
                              onClick={() => handleOpenDrafting(inv)}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-semibold rounded text-[10px] transition-colors"
                            >
                              Faturayı Kes
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedInvoice(inv);
                                setViewingGibPdf(true);
                                setViewingXml(false);
                              }}
                              className="text-slate-500 hover:text-slate-900 p-1 flex items-center justify-center gap-1 mx-auto"
                            >
                              <Printer className="w-3.5 h-3.5" /> <span className="font-sans font-semibold text-[10px]">Yazdır</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {tenantInvoices.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 font-sans italic">
                          Mağazanızda bekleyen veya resmileşen bir satış faturası bulunmuyor. Lütfen "Müşteri Vitrini" alanından bir sipariş simüle edin.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'ledgers' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Cari Defter Kartları ({currentTenant.name})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tenantAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => setSelectedCari(acc)}
                    className={`p-4 border rounded-xl cursor-pointer transition-colors ${
                      selectedCari?.id === acc.id 
                        ? 'border-indigo-500 bg-indigo-50/20 shadow-sm' 
                        : 'border-slate-200 bg-slate-50/30 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400">{acc.code}</span>
                        <h4 className="text-xs font-semibold text-slate-800 mt-0.5">{acc.name}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">{acc.email} · VKN: {acc.taxId}</p>
                      </div>
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                        acc.type === 'buyer' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {acc.type === 'buyer' ? 'Müşteri / Alıcı' : 'Tedarikçi'}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400">Güncel Cari Bakiye:</span>
                      <span className={`font-mono text-xs font-bold ${acc.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {acc.balance.toLocaleString('tr-TR')} TL
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ledger logs detail panel */}
              {selectedCari && (
                <div className="mt-4 border border-slate-100 rounded-lg p-3 bg-slate-50/50 space-y-2 animate-fade-in">
                  <h4 className="text-[11px] font-bold font-mono text-slate-400 uppercase tracking-wider">Hesap Ekstresi & Son Hareketler</h4>
                  <div className="space-y-1.5">
                    {tenantTransactions.filter(t => t.accountId === selectedCari.id).map(tx => (
                      <div key={tx.id} className="flex justify-between text-[11px] font-mono bg-white p-2 rounded border border-slate-100">
                        <div>
                          <span className="text-slate-400 mr-2">{tx.date}</span>
                          <span className="text-slate-700 font-sans font-medium">{tx.description}</span>
                        </div>
                        <div className="flex gap-4">
                          {tx.debit > 0 && <span className="text-emerald-600 font-bold">+{tx.debit} TL (Borç)</span>}
                          {tx.credit > 0 && <span className="text-red-600 font-bold">-{tx.credit} TL (Alacak)</span>}
                          <span className="text-slate-400">Bakiye: {tx.balanceAfter} TL</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'cashflow' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider mb-2">Gelir-Gider Nakit Akış Grafiği (Son 6 Ay)</h3>
                {/* Simulated Chart Bars */}
                <div className="space-y-3 pt-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span>Nakit Girişleri (Online Satışlar)</span>
                      <span className="text-emerald-600 font-bold">{(totalReceivable + 185000).toLocaleString()} TL</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span>Nakit Çıkışları (Tedarikçiler / Masraflar)</span>
                      <span className="text-red-500 font-bold">{totalPayable.toLocaleString()} TL</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div className="bg-red-500 h-3 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accounts aging widgets */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Borç Yaşlandırma Analizi (Aging Report)</h3>
                <p className="text-[11px] text-slate-500">Müşterilerden gelen vadeli ödemelerin gün gruplarına göre gecikme analizleri.</p>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="border border-slate-100 bg-slate-50 p-3 rounded-lg text-center space-y-1">
                    <span className="text-[10px] text-slate-400 font-mono">0-30 Gün Vade</span>
                    <div className="text-sm font-bold font-mono text-slate-800">45,000 TL</div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>

                  <div className="border border-slate-100 bg-slate-50 p-3 rounded-lg text-center space-y-1">
                    <span className="text-[10px] text-slate-400 font-mono">31-60 Gün Vade</span>
                    <div className="text-sm font-bold font-mono text-slate-800">12,500 TL</div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>

                  <div className="border border-slate-100 bg-slate-50 p-3 rounded-lg text-center space-y-1">
                    <span className="text-[10px] text-slate-400 font-mono">60+ Gün Gecikme</span>
                    <div className="text-sm font-bold font-mono text-red-600">0 TL</div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Resmileştirme (Issue invoice) Draft & XML / PDF previewer (Right 4 cols) */}
        <div className="xl:col-span-4 bg-slate-900 text-slate-100 border border-slate-800 rounded-xl p-5 shadow-md h-[550px] overflow-y-auto flex flex-col justify-between">
          
          {draftingInvoice ? (
            /* Inside form for Drafting Invoice */
            <div className="space-y-4 animate-fade-in">
              <div className="border-b border-slate-800 pb-2">
                <span className="text-[9px] font-mono text-indigo-400 block uppercase tracking-wider">e-Fatura Resmileştirme Paneli</span>
                <h3 className="text-sm font-semibold text-slate-100">Fatura Matrah & Tevkifat Hesapları</h3>
              </div>

              <div className="space-y-3 font-sans text-xs">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">e-Fatura Entegratörü</label>
                  <select
                    value={activeIntegrator}
                    onChange={(e) => setActiveIntegrator(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-100"
                  >
                    <option value="gib">GİB Portal Doğrudan Entegrasyon</option>
                    <option value="uyumsoft">Uyumsoft e-Fatura API</option>
                    <option value="edm">EDM Bilişim Entegratör</option>
                    <option value="foriba">Foriba / Sovos API</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">KDV Tevkifat Türü (KDV Kesintisi)</label>
                  <select
                    value={tevkifatType}
                    onChange={(e) => setTevkifatType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-100"
                  >
                    <option value="None">Tevkifat Uygulama (Normal Satış)</option>
                    <option value="2/10">2/10 Tevkifat (Temizlik, Bahçe Bakım Hizmetleri)</option>
                    <option value="5/10">5/10 Tevkifat (Özel Güvenlik, İşgücü Temini)</option>
                    <option value="9/10">9/10 Tevkifat (Fason Tekstil, Yapım İşleri)</option>
                  </select>
                </div>

                {/* Sub-totals display card */}
                <div className="bg-slate-950/80 p-3 rounded border border-slate-800 font-mono text-[11px] space-y-1.5 text-slate-300">
                  <div className="flex justify-between">
                    <span>Brüt Tutar (KDV Hariç Matrah):</span>
                    <span>{draftingInvoice.amount.toLocaleString()} TL</span>
                  </div>
                  <div className="flex justify-between text-indigo-400">
                    <span>Hesaplanan KDV (%{draftingInvoice.vatAmount ? ((draftingInvoice.vatAmount / draftingInvoice.amount) * 100).toFixed(0) : '0'}):</span>
                    <span>{draftingInvoice.vatAmount.toLocaleString()} TL</span>
                  </div>
                  {tevkifatType !== 'None' && (
                    <div className="flex justify-between text-rose-400">
                      <span>Kesilen Tevkifat ({tevkifatType}):</span>
                      <span>-{calculateWithholdingAmount(draftingInvoice.vatAmount, tevkifatType).toLocaleString()} TL</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-emerald-400 text-xs border-t border-slate-800 pt-1.5">
                    <span>Ödenecek Net Fatura Tutarı:</span>
                    <span>{(draftingInvoice.amount + draftingInvoice.vatAmount - calculateWithholdingAmount(draftingInvoice.vatAmount, tevkifatType)).toLocaleString()} TL</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleIssueInvoice}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" /> Faturayı İmzala & GİB'e Gönder
                  </button>
                </div>
              </div>
            </div>
          ) : selectedInvoice ? (
            /* XML and PDF Viewer for selected authorized Invoice */
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-[10px] font-mono text-emerald-400 tracking-wider">✓ GİB ONAYLI FATURA</span>
                <div className="flex bg-slate-800 p-0.5 rounded">
                  <button
                    onClick={() => { setViewingXml(false); setViewingGibPdf(true); }}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${viewingGibPdf ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                  >
                    PDF Fatura
                  </button>
                  <button
                    onClick={() => { setViewingXml(true); setViewingGibPdf(false); }}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${viewingXml ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                  >
                    UBL-XML
                  </button>
                </div>
              </div>

              {/* View UBL-TR XML code */}
              {viewingXml && (
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-wider block">GİB Standartlarında UBL-TR 2.1 XML</span>
                  <pre className="font-mono text-[9px] text-slate-300 bg-slate-950 p-3 rounded border border-slate-800 overflow-x-auto max-h-[350px]">
                    <code>{getUblXml(selectedInvoice)}</code>
                  </pre>
                </div>
              )}

              {/* Visual GİB e-Arşiv Fatura PDF rendering template */}
              {viewingGibPdf && (
                <div className="bg-white text-slate-900 p-4 rounded-lg text-[9px] font-sans border border-slate-300 space-y-3 leading-tight max-h-[350px] overflow-y-auto">
                  {/* Gib Logo & Header */}
                  <div className="flex justify-between items-center border-b-2 border-red-500 pb-2">
                    <div className="flex items-center gap-1">
                      {/* Simulated red e-Archive emblem */}
                      <div className="w-8 h-8 rounded-full border-2 border-red-500 flex items-center justify-center text-red-500 text-[10px] font-bold font-serif">
                        GİB
                      </div>
                      <div>
                        <h4 className="font-bold text-red-600">e-ARŞİV FATURA</h4>
                        <p className="text-[7px] text-slate-400 uppercase">Gelir İdaresi Başkanlığı</p>
                      </div>
                    </div>
                    <div className="text-right text-[7px] font-mono">
                      <div>Fatura UUID: {selectedInvoice.orderId}-49d3-82a1-a71c8291039a</div>
                      <div>Fatura Tarihi: {selectedInvoice.date}</div>
                      <div>Fatura No: <span className="font-bold text-slate-800">{selectedInvoice.invoiceNumber}</span></div>
                    </div>
                  </div>

                  {/* Supplier & Customer detail fields */}
                  <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-2">
                    <div>
                      <h5 className="font-bold border-b border-slate-200 pb-0.5 text-slate-500">GÖNDERİCİ (SATICI):</h5>
                      <p className="font-bold">{currentTenant.name}</p>
                      <p>Nilüfer / Bursa, Türkiye</p>
                      <p className="font-mono">VKN/TCKN: 1049204910</p>
                    </div>
                    <div>
                      <h5 className="font-bold border-b border-slate-200 pb-0.5 text-slate-500 font-sans">MÜŞTERİ (ALICI):</h5>
                      <p className="font-bold">{selectedInvoice.customerName}</p>
                      <p>{selectedInvoice.customerTaxOffice} / İstanbul, Türkiye</p>
                      <p className="font-mono">VKN/TCKN: {selectedInvoice.customerTaxId}</p>
                    </div>
                  </div>

                  {/* Line Items Table */}
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300 font-bold">
                        <th className="p-1 text-left">Hizmet / Açıklama</th>
                        <th className="p-1 text-right">KDV</th>
                        <th className="p-1 text-right">Matrah (Matrah)</th>
                        <th className="p-1 text-right">Toplam</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      <tr>
                        <td className="p-1 text-left font-sans">{currentTenant.name} Sipariş Teslimatı</td>
                        <td className="p-1 text-right">%{(selectedInvoice.vatAmount ? ((selectedInvoice.vatAmount / selectedInvoice.amount) * 100).toFixed(0) : '0')}</td>
                        <td className="p-1 text-right">{selectedInvoice.amount.toLocaleString()} TL</td>
                        <td className="p-1 text-right">{(selectedInvoice.amount + selectedInvoice.vatAmount).toLocaleString()} TL</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* PDF Mathematical totals */}
                  <div className="flex justify-end pt-2 border-t border-slate-200">
                    <div className="w-1/2 space-y-1 font-mono text-[8px] text-right">
                      <div className="flex justify-between">
                        <span>Ara Toplam (Matrah):</span>
                        <span>{selectedInvoice.amount.toLocaleString()} TL</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hesaplanan KDV:</span>
                        <span>{selectedInvoice.vatAmount.toLocaleString()} TL</span>
                      </div>
                      {selectedInvoice.withholdingAmount > 0 && (
                        <div className="flex justify-between text-red-600 font-bold">
                          <span>KDV Tevkifatı (-{selectedInvoice.withholdingTaxType}):</span>
                          <span>-{selectedInvoice.withholdingAmount.toLocaleString()} TL</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-slate-300 pt-1 text-xs font-bold text-slate-900">
                        <span>Ödenecek Net Tutar:</span>
                        <span>{selectedInvoice.totalPayable.toLocaleString()} TL</span>
                      </div>
                    </div>
                  </div>

                  {/* Official seal & QR */}
                  <div className="flex justify-between items-end pt-3 text-[7px] text-slate-400">
                    <div className="text-left font-mono">
                      <span>Bu fatura elektronik ortamda düzenlenmiştir.</span>
                      <br />
                      <span>Sistem Entegratörü: {selectedInvoice.integrator.toUpperCase()} Bilişim A.Ş.</span>
                    </div>
                    {/* Mock QR Code */}
                    <div className="w-10 h-10 border border-slate-300 p-0.5 flex items-center justify-center font-mono font-bold text-[6px] text-slate-400 text-center uppercase shrink-0">
                      tampazar QR
                    </div>
                  </div>

                </div>
              )}
            </div>
          ) : (
            <div className="m-auto text-center text-slate-500 space-y-2">
              <Eye className="w-8 h-8 mx-auto opacity-45" />
              <p className="text-xs">Sıradaki faturalardan birini seçip "Faturayı Kes" dediğinizde mali mühürlü UBL XML ve GİB PDF önizlemesi burada oluşur.</p>
            </div>
          )}

          <div className="border-t border-slate-800 pt-4 mt-4 text-[10px] text-slate-500 flex items-center justify-between font-mono">
            <span>UBL-TR 2.1 Schema Compliance</span>
            <span className="text-emerald-500">Mühürlendi (Signed)</span>
          </div>

        </div>

      </div>
      )}
    </div>
  );
}
