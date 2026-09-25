import React, { useState, useMemo } from 'react';
import { SEASONAL_CALENDAR_DATA } from '../../data/blogData';
import { Calendar, Apple, Fish, Carrot, Sparkles, TrendingDown } from 'lucide-react';

export const SeasonalCalendar: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('Eylül');

  const activeMonthData = useMemo(() => {
    return SEASONAL_CALENDAR_DATA.find(m => m.month === selectedMonth) || SEASONAL_CALENDAR_DATA[8];
  }, [selectedMonth]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-800">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">Mevsiminde Taze Gıda Takvimi</h2>
            <p className="text-xs text-slate-500">Mevsiminde tüketim ile hem bütçenizi hem sağlığınızı koruyun.</p>
          </div>
        </div>
        <span className="text-xs font-black bg-cyan-100 text-cyan-900 px-3 py-1 rounded-full flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-600 fill-cyan-500" /> Akıllı Tüketici
        </span>
      </div>

      {/* Month selection tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {SEASONAL_CALENDAR_DATA.map((item) => (
          <button
            key={item.month}
            onClick={() => setSelectedMonth(item.month)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              selectedMonth === item.month
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {item.month}
          </button>
        ))}
      </div>

      {/* Selected Month Details */}
      <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <span>📅 {activeMonthData.month} Ayı ({activeMonthData.season})</span>
          </h3>
          <span className="text-xs text-emerald-800 font-bold bg-emerald-100/80 px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-700" /> Mevsiminde %35-40 Daha Ucuz
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Vegetables */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/60 space-y-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg w-fit">
              <Carrot className="w-4 h-4 text-amber-600" /> Sebzeler
            </div>
            <ul className="space-y-1.5">
              {activeMonthData.vegetables.map((item, idx) => (
                <li key={idx} className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="text-emerald-500">•</span> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Fruits */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/60 space-y-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-red-900 bg-red-50 px-2.5 py-1 rounded-lg w-fit">
              <Apple className="w-4 h-4 text-red-600" /> Meyveler
            </div>
            <ul className="space-y-1.5">
              {activeMonthData.fruits.map((item, idx) => (
                <li key={idx} className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="text-emerald-500">•</span> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Seafood */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/60 space-y-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg w-fit">
              <Fish className="w-4 h-4 text-blue-600" /> Balıklar & Deniz Ürünleri
            </div>
            <ul className="space-y-1.5">
              {activeMonthData.fish.map((item, idx) => (
                <li key={idx} className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="text-emerald-500">•</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
