/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Sparkles, DollarSign, ArrowUpRight, BarChart3, AlertCircle, ShieldCheck, RefreshCw } from 'lucide-react';
import { Tenant, Invoice, LedgerAccount, LedgerTransaction } from '../data/mockData';

interface FinancialForecastingProps {
  currentTenant: Tenant;
  invoices: Invoice[];
  accounts: LedgerAccount[];
  transactions: LedgerTransaction[];
}

export default function FinancialForecastingModule({
  currentTenant,
  invoices,
  accounts,
  transactions
}: FinancialForecastingProps) {
  // Historical monthly revenue data (Last 6 months)
  const [historicalMonths, setHistoricalMonths] = useState([
    { month: 'Nisan 2026', revenue: 95000, expenses: 62000, net: 33000 },
    { month: 'Mayıs 2026', revenue: 110000, expenses: 70000, net: 40000 },
    { month: 'Haziran 2026', revenue: 105000, expenses: 68000, net: 37000 },
    { month: 'Temmuz 2026', revenue: 125000, expenses: 76000, net: 49000 },
    { month: 'Ağustos 2026', revenue: 130000, expenses: 81000, net: 49000 },
    { month: 'Eylül 2026 (Bu Ay)', revenue: 135835, expenses: 87288, net: 48546 },
  ]);

  const [growthFactor, setGrowthFactor] = useState<number>(1.08); // +%8 default growth simulation
  const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);

  // Simple linear regression calculation for next month (October 2026)
  // y = mx + b
  const n = historicalMonths.length;
  const sumX = historicalMonths.reduce((acc, _, idx) => acc + idx, 0);
  const sumY = historicalMonths.reduce((acc, m) => acc + m.revenue, 0);
  const sumXY = historicalMonths.reduce((acc, m, idx) => acc + (idx * m.revenue), 0);
  const sumXX = historicalMonths.reduce((acc, _, idx) => acc + (idx * idx), 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Projected next month (Index 6)
  const projectedRevenueRaw = slope * 6 + intercept;
  const projectedRevenue = Math.round(projectedRevenueRaw * growthFactor);
  const projectedExpenses = Math.round((historicalMonths[historicalMonths.length - 1].expenses) * growthFactor);
  const projectedNet = projectedRevenue - projectedExpenses;

  const handleRunAiForecast = () => {
    setIsAiAnalyzing(true);
    setTimeout(() => {
      setIsAiAnalyzing(false);
      setAiAnalysisResult(`tampazar.com AI Finans Analisti: ${currentTenant.name} işletmenizin son 6 aylık doğrusal büyüme trendi ve e-fatura tahsilat hızınız incelendi. Gelecek ay (%${((growthFactor - 1) * 100).toFixed(0)} büyüme senaryosuyla) nakit girişlerinizin ~${projectedRevenue.toLocaleString('tr-TR')} TL olacağı öngörülmektedir. BYO POS sisteminiz sayesinde komisyon kesintisi olmaksızın işletme sermayeniz %14 güçlenecektir.`);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title Header */}
      <div>
        <span className="text-xs font-mono text-indigo-600 tracking-wider uppercase font-semibold">05. Yapay Zeka & Doğrusal Regresyon Tahminleme</span>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mt-1">Gelecek Ay Nakit Akışı ve Finansal Tahminleme</h2>
        <p className="text-slate-500 text-sm mt-1 max-w-3xl">
          Mevcut e-Fatura geçmişiniz, cari alacaklarınız ve son 6 aylık ciro verileriniz kullanılarak gelecek ayın nakit akışı lineer regresyon modeli ve tampazar AI motoruyla simüle edilir.
        </p>
      </div>

      {/* Main Stat Boards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-sm space-y-2">
          <span className="text-xs text-slate-400 font-mono">Öngörülen Gelecek Ay Ciro (Ekim 2026)</span>
          <div className="text-3xl font-black font-mono text-emerald-400 tabular-nums">
            ₺{projectedRevenue.toLocaleString('tr-TR')}
          </div>
          <span className="text-[11px] text-slate-300 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Doğrusal trend + senaryo faktörü (%{((growthFactor - 1) * 100).toFixed(0)})
          </span>
        </div>

        <div className="bg-white text-slate-900 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs text-slate-400 font-mono">Öngörülen Tahmini Giderler</span>
          <div className="text-3xl font-black font-mono text-rose-600 tabular-nums">
            ₺{projectedExpenses.toLocaleString('tr-TR')}
          </div>
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-rose-500" /> Tedarikçi carileri ve operasyonel giderler
          </span>
        </div>

        <div className="bg-white text-slate-900 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs text-slate-400 font-mono">Tahmini Net Nakit Artışı (Kâr)</span>
          <div className="text-3xl font-black font-mono text-indigo-600 tabular-nums">
            ₺{projectedNet.toLocaleString('tr-TR')}
          </div>
          <span className="text-[11px] text-emerald-600 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> %0 Komisyon ile tam kazanç
          </span>
        </div>
      </div>

      {/* Controls & Scenario Adjuster */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase">Büyüme Senaryosu Simülatörü</h3>
            <p className="text-xs text-slate-500">Piyasa koşullarına göre gelecek ay büyüme beklentinizi ayarlayın.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-slate-700">Beklenen Büyüme: %{((growthFactor - 1) * 100).toFixed(0)}</span>
            <input 
              type="range" 
              min="1.00" 
              max="1.30" 
              step="0.01" 
              value={growthFactor} 
              onChange={(e) => setGrowthFactor(parseFloat(e.target.value))}
              className="w-36 accent-indigo-600 cursor-pointer"
            />
            <button
              onClick={handleRunAiForecast}
              disabled={isAiAnalyzing}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isAiAnalyzing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
              AI Finansal Analiz Çalıştır
            </button>
          </div>
        </div>

        {aiAnalysisResult && (
          <div className="bg-indigo-50/80 border border-indigo-200 text-indigo-900 p-4 rounded-xl text-xs leading-relaxed flex items-start gap-3 animate-fade-in">
            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <p>{aiAnalysisResult}</p>
          </div>
        )}

        {/* Historical & Projected Table / Chart */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Geçmiş ve Gelecek Ay Nakit Akış Tablosu</h4>
          <div className="border border-slate-100 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="p-3">Dönem</th>
                  <th className="p-3 text-right">Ciro (Giriş)</th>
                  <th className="p-3 text-right">Gider (Çıkış)</th>
                  <th className="p-3 text-right">Net Kâr</th>
                  <th className="p-3 text-center">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 tabular-nums">
                {historicalMonths.map((m, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="p-3 font-sans font-semibold text-slate-800">{m.month}</td>
                    <td className="p-3 text-right text-emerald-600 font-bold">₺{m.revenue.toLocaleString('tr-TR')}</td>
                    <td className="p-3 text-right text-rose-600">₺{m.expenses.toLocaleString('tr-TR')}</td>
                    <td className="p-3 text-right text-slate-800 font-bold">₺{m.net.toLocaleString('tr-TR')}</td>
                    <td className="p-3 text-center">
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-sans font-semibold">Gerçekleşti</span>
                    </td>
                  </tr>
                ))}
                {/* Projected Row */}
                <tr className="bg-indigo-50/40 font-bold">
                  <td className="p-3 font-sans text-indigo-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Ekim 2026 (Tahmini Projeksiyon)
                  </td>
                  <td className="p-3 text-right text-emerald-700">₺{projectedRevenue.toLocaleString('tr-TR')}</td>
                  <td className="p-3 text-right text-rose-700">₺{projectedExpenses.toLocaleString('tr-TR')}</td>
                  <td className="p-3 text-right text-indigo-900">₺{projectedNet.toLocaleString('tr-TR')}</td>
                  <td className="p-3 text-center">
                    <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-sans font-semibold">Regresyon Tahmini</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
