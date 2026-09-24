/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, 
  Building2, PlusCircle, Search, Filter, Calendar, FileText, Check, X, Sparkles
} from 'lucide-react';
import { WalletAccount, CashflowTransaction } from '../../data/hybridCommerceData';

interface CashflowModuleProps {
  accounts: WalletAccount[];
  transactions: CashflowTransaction[];
  onAddTransaction: (tx: Omit<CashflowTransaction, 'id'>) => void;
}

export default function CashflowModule({ accounts, transactions, onAddTransaction }: CashflowModuleProps) {
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Transaction Form State
  const [txType, setTxType] = useState<'income' | 'expense'>('expense');
  const [txCategory, setTxCategory] = useState<CashflowTransaction['category']>('Dükkan Kirası');
  const [txAmount, setTxAmount] = useState<number>(1500);
  const [txAccountId, setTxAccountId] = useState<string>(accounts[0]?.id || 'w-bank-garanti');
  const [txDesc, setTxDesc] = useState('');
  const [txReceipt, setTxReceipt] = useState('');

  // Calculations
  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpense;

  const filteredTransactions = transactions.filter(t => {
    const matchesFilter = filterType === 'all' ? true : t.type === filterType;
    const matchesSearch = 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.accountName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSubmitNewTx = (e: React.FormEvent) => {
    e.preventDefault();
    const account = accounts.find(a => a.id === txAccountId);
    onAddTransaction({
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      type: txType,
      category: txCategory,
      amount: Number(txAmount),
      accountId: txAccountId,
      accountName: account?.name || 'Kasa',
      description: txDesc || (txType === 'income' ? 'Satış Geliri' : 'İşletme Gideri'),
      receiptNumber: txReceipt || 'FIS-' + Math.floor(1000 + Math.random() * 9000)
    });
    setShowAddModal(false);
    setTxDesc('');
    setTxReceipt('');
  };

  return (
    <div className="space-y-6">
      {/* Üst Kasa & Kâr/Zarar Özeti */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Toplam Likidite & Kasa</span>
            <Wallet className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            ₺{totalBalance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-400 block font-medium">Banka, Nakit ve Sanal POS toplamı</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Toplam Tahsilat (Gelir)</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            ₺{totalIncome.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold block">Satış ve hizmet tahsilatları</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Toplam Giderler</span>
            <ArrowUpRight className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600">
            ₺{totalExpense.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-400 block">Kira, personel, kargo ve tedarik</span>
        </div>

        <div className={`p-5 rounded-3xl border shadow-xs space-y-1 ${
          netProfit >= 0 ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
        }`}>
          <div className="flex items-center justify-between text-slate-700 text-xs font-bold">
            <span>Net İşletme Kârı</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className={`text-2xl font-black ${netProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
            ₺{netProfit.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-500 block font-medium">Esnaf anlık kâr hesabı</span>
        </div>
      </div>

      {/* Cüzdan & Hesap Kartları */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900">Hesaplar ve Kasa Bakiyeleri</h3>
          <button
            onClick={() => {
              setTxType('expense');
              setShowAddModal(true);
            }}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Gelir / Gider Fişi Ekle</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {accounts.map((acc) => (
            <div key={acc.id} className={`p-4 rounded-2xl border ${acc.color} shadow-xs space-y-2`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">{acc.name}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/70 shadow-xs">
                  {acc.badge}
                </span>
              </div>
              <div className="text-lg font-black text-slate-900">
                ₺{acc.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </div>
              {acc.iban && (
                <span className="text-[10px] font-mono text-slate-500 block truncate">{acc.iban}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Nakit Akışı ve Fişler Tablosu */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input 
              type="text" 
              placeholder="Açıklama, Kategori, Hesap..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterType === 'all' ? 'bg-indigo-900 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Tüm Hareketler
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterType === 'income' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Yalnız Gelirler
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterType === 'expense' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Yalnız Giderler
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <th className="p-3">Tarih</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Açıklama & Fiş No</th>
                <th className="p-3">Kasa / Hesap</th>
                <th className="p-3 text-right">Tutar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 text-slate-500 font-mono text-[11px]">{tx.date}</td>
                    <td className="p-3">
                      <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {tx.category}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-slate-900 block">{tx.description}</span>
                      {tx.receiptNumber && (
                        <span className="text-[10px] font-mono text-slate-400">Fiş/Dekont: {tx.receiptNumber}</span>
                      )}
                    </td>
                    <td className="p-3 text-slate-600 font-medium">{tx.accountName}</td>
                    <td className={`p-3 text-right font-black text-sm ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isIncome ? '+' : '-'}₺{tx.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* GELİR / GİDER EKLEME MODALI */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative animate-fade-in text-slate-900 border border-slate-200">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-black text-slate-900">Yeni Gelir / Gider Fişi İşle</h3>

            <form onSubmit={handleSubmitNewTx} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTxType('expense')}
                  className={`py-2 rounded-xl font-bold border transition cursor-pointer ${
                    txType === 'expense' ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  Gider Çıkışı
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('income')}
                  className={`py-2 rounded-xl font-bold border transition cursor-pointer ${
                    txType === 'income' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  Gelir / Tahsilat
                </button>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Kategori:</label>
                <select
                  value={txCategory}
                  onChange={(e) => setTxCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold"
                >
                  <option value="Satış Tahsilatı">Satış Tahsilatı</option>
                  <option value="Dükkan Kirası">Dükkan Kirası</option>
                  <option value="Personel / Maaş">Personel / Maaş</option>
                  <option value="Elektrik / Su / Doğalgaz">Elektrik / Su / Doğalgaz</option>
                  <option value="Toptancı Tedarik">Toptancı Tedarik</option>
                  <option value="Kargo & Lojistik">Kargo & Lojistik</option>
                  <option value="Vergi / Harç / SGK">Vergi / Harç / SGK</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Tutar (TL):</label>
                <input
                  type="number"
                  value={txAmount}
                  onChange={(e) => setTxAmount(Number(e.target.value))}
                  min={1}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-black text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Kasa / Hesap:</label>
                <select
                  value={txAccountId}
                  onChange={(e) => setTxAccountId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold"
                >
                  {accounts.map(a => (
                    <option key={a.id} value={a.id}>{a.name} (₺{a.balance.toLocaleString('tr-TR')})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Açıklama:</label>
                <input
                  type="text"
                  placeholder="Örn: Eylül Ayı Dükkan Elektrik Faturası"
                  value={txDesc}
                  onChange={(e) => setTxDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Fiş / Dekont No (İsteğe bağlı):</label>
                <input
                  type="text"
                  placeholder="Örn: DEK-99120"
                  value={txReceipt}
                  onChange={(e) => setTxReceipt(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition cursor-pointer"
              >
                Kaydet ve Kasaya İşle
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
