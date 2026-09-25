import React from 'react';
import { Search, Sparkles, ShieldCheck, Store, ShoppingBag } from 'lucide-react';

interface BlogHeroProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const BlogHero: React.FC<BlogHeroProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white py-12 px-4 relative overflow-hidden border-b border-emerald-700/50">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-300">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Sıfır Komisyon & Yerel Ticaret Dayanışması</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          TamPazar <span className="text-amber-400">Esnaf & Tüketici</span> Rehberi
        </h1>

        <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-normal">
          Esnafa komisyonsuz satış rehberleri, yerel üreticiden doğrudan tedarik ipuçları ve tüketiciye mevsimsel tasarruf rehberleri tek platformda.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Makale, konu veya etiket ara (Örn: Komisyonsuz Satış, Mevsimsel Gıda...)"
              className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-900 placeholder-slate-400 rounded-2xl shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-1 rounded-md"
              >
                Temizle
              </button>
            )}
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-emerald-200/90 pt-2">
          <span className="flex items-center gap-1.5 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-700/40">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Doğrulanmış Esnaf Bilgileri
          </span>
          <span className="flex items-center gap-1.5 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-700/40">
            <Store className="w-3.5 h-3.5 text-amber-400" /> %0 Komisyon Stratejileri
          </span>
          <span className="flex items-center gap-1.5 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-700/40">
            <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" /> Akıllı Tüketici Rehberleri
          </span>
        </div>
      </div>
    </div>
  );
};
