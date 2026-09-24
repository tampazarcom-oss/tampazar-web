/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Shirt, Home, Wrench, 
  FileCode, Package, Bike, Sparkles, Utensils
} from 'lucide-react';

export interface QuickCategoryItem {
  id: string;
  name: string;
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
  badge: string;
  badgeBg?: string;
  badgeTextColor?: string;
  route: string;
  isTamTeklifTrigger?: boolean;
}

export const QUICK_CATEGORIES: QuickCategoryItem[] = [
  {
    id: 'mahalle-hizli',
    name: 'Mahalle & Hızlı Tüketim',
    icon: Utensils,
    bgColor: '#E8F5E9',
    iconColor: '#0F4C3A',
    badge: '30 Dk Teslimat',
    badgeBg: 'bg-[#0F4C3A]',
    badgeTextColor: 'text-white',
    route: '/pazaryeri?kategori=mahalle-hizli-tuketim'
  },
  {
    id: 'moda-giyim-zanaat',
    name: 'Moda & Giyim & Zanaat',
    icon: Shirt,
    bgColor: '#FCE4EC',
    iconColor: '#C2185B',
    badge: 'Butik Esnaf',
    badgeBg: 'bg-[#C2185B]',
    badgeTextColor: 'text-white',
    route: '/pazaryeri?kategori=moda-giyim-zanaat'
  },
  {
    id: 'ev-yasam-yapi',
    name: 'Ev, Yaşam & Yapı Market',
    icon: Home,
    bgColor: '#E0F2F1',
    iconColor: '#00796B',
    badge: 'Usta Rafı',
    badgeBg: 'bg-[#00796B]',
    badgeTextColor: 'text-white',
    route: '/pazaryeri?kategori=ev-yasam-yapi-market'
  },
  {
    id: 'hizmet-ustalik-bakim',
    name: 'Hizmet & Ustalık & Bakım',
    icon: Wrench,
    bgColor: '#EDE7F6',
    iconColor: '#512DA8',
    badge: 'TamTeklif',
    badgeBg: 'bg-[#512DA8]',
    badgeTextColor: 'text-white',
    route: '/pazaryeri?kategori=hizmet-ustalik-bakim',
    isTamTeklifTrigger: true
  },
  {
    id: 'dijital-varliklar',
    name: 'Dijital Varlıklar & Şablonlar',
    icon: FileCode,
    bgColor: '#E3F2FD',
    iconColor: '#1976D2',
    badge: 'Anında İndir',
    badgeBg: 'bg-[#1976D2]',
    badgeTextColor: 'text-white',
    route: '/pazaryeri?kategori=tamdijital'
  },
  {
    id: 'b2b-toptan',
    name: 'B2B Kapalı Devre Toptan',
    icon: Package,
    bgColor: '#FFF8E1',
    iconColor: '#F59E0B',
    badge: '%0 Komisyon',
    badgeBg: 'bg-[#0B132B]',
    badgeTextColor: 'text-amber-300',
    route: '/toptan'
  },
  {
    id: 'tamkurye',
    name: 'TamKurye: Bağımsız Kuryeler',
    icon: Bike,
    bgColor: '#E0F7FA',
    iconColor: '#00838F',
    badge: 'Mahalle Ağı',
    badgeBg: 'bg-[#00838F]',
    badgeTextColor: 'text-white',
    route: '/kuryeler'
  }
];

interface QuickCategoryBarProps {
  onOpenTamTeklif?: () => void;
}

export default function QuickCategoryBar({ onOpenTamTeklif }: QuickCategoryBarProps) {
  const navigate = useNavigate();

  const handleItemClick = (item: QuickCategoryItem) => {
    if (item.isTamTeklifTrigger && onOpenTamTeklif) {
      onOpenTamTeklif();
    } else {
      navigate(item.route);
    }
  };

  return (
    <nav 
      aria-label="Hızlı Ticaret Kategorileri"
      className="bg-white border-b border-slate-200/80 py-3 shadow-2xs"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-start justify-start md:justify-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none pb-1.5 pt-1">
          {QUICK_CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;

            return (
              <button
                key={cat.id}
                onClick={() => handleItemClick(cat)}
                className="flex flex-col items-center gap-2 group cursor-pointer transition-all duration-300 shrink-0 w-[100px] sm:w-[115px]"
              >
                {/* Rounded Icon Box with Stripe-like depth & hover translate effect */}
                <div 
                  className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center relative shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300 border border-black/5"
                  style={{ backgroundColor: cat.bgColor }}
                >
                  <IconComponent 
                    className="w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-110" 
                    style={{ color: cat.iconColor }}
                  />

                  {/* Badge Label Pill */}
                  <span 
                    className={`absolute -bottom-2 text-[9px] font-black uppercase tracking-tight px-2 py-0.5 rounded-full shadow-2xs whitespace-nowrap border border-white ${cat.badgeBg || 'bg-[#0B132B]'} ${cat.badgeTextColor || 'text-white'}`}
                  >
                    {cat.badge}
                  </span>
                </div>

                {/* Category Title */}
                <span className="text-[11px] sm:text-xs font-bold text-slate-800 text-center leading-tight line-clamp-2 mt-1 group-hover:text-[#0F4C3A] transition-colors">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
