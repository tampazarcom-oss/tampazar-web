import React, { useState } from 'react';
import { Calculator, Check, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';

export const EsnafProfitCalculator: React.FC = () => {
  const [revenue, setRevenue] = useState<number>(120000);
  const [commissionRate, setCommissionRate] = useState<number>(20);
  const [cargoCost, setCargoCost] = useState<number>(15);
  const [monthlyOrders, setMonthlyOrders] = useState<number>(400);

  // Calculations
  const traditionalCommission = (revenue * commissionRate) / 100;
  const traditionalCargo = monthlyOrders * cargoCost;
  const traditionalTotalCost = traditionalCommission + traditionalCargo;
  const traditionalNetProfit = revenue - traditionalTotalCost;

  // TamPazar zero commission + local/TamKargo savings
  const tampazarCommission = 0;
  const tampazarCargo = monthlyOrders * (cargoCost * 0.85); // 15% cheaper
  const tampazarTotalCost = tampazarCargo;
  const tampazarNetProfit = revenue - tampazarTotalCost;

  const totalMonthlySavings = tampazarNetProfit - traditionalNetProfit;
  const marginImprovement = ((tampazarNetProfit - traditionalNetProfit) / revenue) * 100;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-800">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">TamPazar Esnaf Kârlılık Hesaplayıcı</h2>
            <p className="text-xs text-slate-500">Sıfır komisyon modelinde ne kadar kâr edeceğinizi anında görün.</p>
          </div>
        </div>
        <span className="text-xs font-black bg-amber-100 text-amber-900 px-3 py-1 rounded-full flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" /> %100 Ücretsiz
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
              Aylık Brüt Ciro (TL)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₺</span>
              <input
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
            <input
              type="range"
              min="10000"
              max="1000000"
              step="10000"
              value={revenue}
              onChange={(e) => setRevenue(parseInt(e.target.value))}
              className="w-full mt-2 accent-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                Komisyon Oranı (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">%</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                Aylık Sipariş Adedi
              </label>
              <input
                type="number"
                value={monthlyOrders}
                onChange={(e) => setMonthlyOrders(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
              Sipariş Başı Ortalama Kargo Maliyeti (TL)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₺</span>
              <input
                type="number"
                value={cargoCost}
                onChange={(e) => setCargoCost(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Right: Results Comparison */}
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">Aylık Kârlılık Karşılaştırması</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-black text-red-600 uppercase tracking-wider">Geleneksel Pazaryeri</span>
                <p className="text-xl font-black text-slate-900 mt-1">₺{traditionalNetProfit.toLocaleString('tr-TR')}</p>
                <p className="text-[10px] text-slate-500">Net Kazanç (Komisyon sonrası)</p>
              </div>

              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">TamPazar Dayanışma</span>
                <p className="text-xl font-black text-emerald-950 mt-1">₺{tampazarNetProfit.toLocaleString('tr-TR')}</p>
                <p className="text-[10px] text-emerald-600 font-medium">Net Kazanç (%0 Komisyon)</p>
              </div>
            </div>
          </div>

          {/* Savings Callout */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 rounded-2xl border border-emerald-700/50 relative overflow-hidden shadow-md">
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
              <TrendingUp className="w-36 h-36" />
            </div>

            <div className="relative z-10 space-y-1.5">
              <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-amber-400" /> TAMPAZAR KAZANCI
              </span>
              <p className="text-2xl sm:text-3xl font-black text-white">₺{totalMonthlySavings.toLocaleString('tr-TR')}</p>
              <p className="text-xs text-emerald-100/90 font-medium leading-relaxed">
                Her ay cebinizde kalan net tasarruf miktarı! Kâr marjınız ortalama <span className="text-amber-300 font-bold">%{marginImprovement.toFixed(1)}</span> oranında artmaktadır.
              </p>
            </div>
          </div>

          {/* Info Badge */}
          <div className="flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed bg-amber-50 border border-amber-200/50 p-3 rounded-xl">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              TamPazar modelinde hiçbir işlemden komisyon, hizmet bedeli ya da gizli ücret kesilmez. Kazancınızın tamamı doğrudan esnafa aktarılır.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
