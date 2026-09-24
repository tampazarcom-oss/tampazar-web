/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Shirt, Home, Wrench, 
  FileCode, Package, Bike, Utensils,
  LayoutGrid, ChevronRight, ArrowRight, Sparkles
} from 'lucide-react';

export interface SubCategoryItem {
  title: string;
  route: string;
  badge?: string;
}

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
  subCategories?: SubCategoryItem[];
  flyoutTitle?: string;
  flyoutDescription?: string;
}

export const QUICK_CATEGORIES: QuickCategoryItem[] = [
  {
    id: 'tum-kategoriler',
    name: 'Tüm Kategoriler',
    icon: LayoutGrid,
    bgColor: '#0B132B',
    iconColor: '#FFFFFF',
    badge: "A'DAN Z'YE",
    badgeBg: 'bg-[#F59E0B]',
    badgeTextColor: 'text-[#0B132B]',
    route: '/pazaryeri',
    flyoutTitle: 'Keşfet & Hızlı Erişim',
    flyoutDescription: 'Tüm pazaryeri kategorileri, toptan ve bağımsız kurye ağı.',
    subCategories: [
      { title: 'Mahalle & Hızlı Tüketim', route: '/pazaryeri?kategori=mahalle-hizli-tuketim', badge: '30 Dk' },
      { title: 'Moda & Giyim & Zanaat', route: '/pazaryeri?kategori=moda-giyim-zanaat', badge: 'Butik' },
      { title: 'Ev, Yaşam & Yapı Market', route: '/pazaryeri?kategori=ev-yasam-yapi-market', badge: 'Usta' },
      { title: 'Hizmet & Ustalık & Bakım', route: '/pazaryeri?kategori=hizmet-ustalik-bakim', badge: 'Teklif' },
      { title: 'Dijital Varlıklar & Şablonlar', route: '/pazaryeri?kategori=tamdijital', badge: 'İndir' },
      { title: 'B2B Kapalı Devre Toptan', route: '/toptan', badge: '%0 Kom' },
      { title: 'TamKurye: Bağımsız Kuryeler', route: '/kuryeler', badge: 'Canlı' }
    ]
  },
  {
    id: 'mahalle-hizli',
    name: 'Mahalle & Hızlı Tüketim',
    icon: Utensils,
    bgColor: '#E8F5E9',
    iconColor: '#0F4C3A',
    badge: '30 Dk Teslimat',
    badgeBg: 'bg-[#0F4C3A]',
    badgeTextColor: 'text-white',
    route: '/pazaryeri?kategori=mahalle-hizli-tuketim',
    flyoutTitle: 'Hızlı Mahalle Esnafı',
    flyoutDescription: 'Mahallenizin kasabı, manavı, fırını ve şarküterisinden kapınıza.',
    subCategories: [
      { title: 'Kasap & Şarküteri', route: '/pazaryeri?kategori=mahalle-hizli-tuketim&sub=kasap' },
      { title: 'Manav & Taze Yeşillik', route: '/pazaryeri?kategori=mahalle-hizli-tuketim&sub=manav' },
      { title: 'Sıcak Fırın & Ekmek', route: '/pazaryeri?kategori=mahalle-hizli-tuketim&sub=firin' },
      { title: 'Su & İçecek', route: '/pazaryeri?kategori=mahalle-hizli-tuketim&sub=su' },
      { title: 'Mandıra', route: '/pazaryeri?kategori=mahalle-hizli-tuketim&sub=mandira' }
    ]
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
    route: '/pazaryeri?kategori=moda-giyim-zanaat',
    flyoutTitle: 'Butik & Zanaat Tasarımları',
    flyoutDescription: 'Yerel üreticilerden özgün giyim, hakiki deri ve zanaat ürünleri.',
    subCategories: [
      { title: 'Kadın Butik', route: '/pazaryeri?kategori=moda-giyim-zanaat&sub=kadin' },
      { title: 'Erkek Giyim', route: '/pazaryeri?kategori=moda-giyim-zanaat&sub=erkek' },
      { title: 'El Emeği Zanaat', route: '/pazaryeri?kategori=moda-giyim-zanaat&sub=zanaat' },
      { title: 'Hakiki Deri & Ayakkabı', route: '/pazaryeri?kategori=moda-giyim-zanaat&sub=ayakkabi' },
      { title: 'Aksesuar', route: '/pazaryeri?kategori=moda-giyim-zanaat&sub=aksesuar' }
    ]
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
    route: '/pazaryeri?kategori=ev-yasam-yapi-market',
    flyoutTitle: 'Ev & Yapı Gereçleri',
    flyoutDescription: 'Mutfak eşyalarından hırdavat ve bahçe gereçlerine kadar.',
    subCategories: [
      { title: 'Mutfak & Züccaciye', route: '/pazaryeri?kategori=ev-yasam-yapi-market&sub=mutfak' },
      { title: 'Hırdavat & El Aletleri', route: '/pazaryeri?kategori=ev-yasam-yapi-market&sub=hirdavat' },
      { title: 'Ev Tekstili', route: '/pazaryeri?kategori=ev-yasam-yapi-market&sub=tekstil' },
      { title: 'Bahçe & Çiçek', route: '/pazaryeri?kategori=ev-yasam-yapi-market&sub=bahce' }
    ]
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
    isTamTeklifTrigger: true,
    flyoutTitle: 'Saha Ustaları & Servis',
    flyoutDescription: 'Harita konumlu acil ustalar ve kapalı devre fiyat teklifleri.',
    subCategories: [
      { title: 'Acil Su Tesisatçısı', route: '/pazaryeri?kategori=hizmet-ustalik-bakim&sub=tesisat' },
      { title: 'Elektrik & Aydınlatma', route: '/pazaryeri?kategori=hizmet-ustalik-bakim&sub=elektrik' },
      { title: 'Kombi & Klima Bakımı', route: '/pazaryeri?kategori=hizmet-ustalik-bakim&sub=klima' },
      { title: 'Ev Boyama', route: '/pazaryeri?kategori=hizmet-ustalik-bakim&sub=boyama' },
      { title: 'Fotoğrafçı', route: '/pazaryeri?kategori=hizmet-ustalik-bakim&sub=fotograf' }
    ]
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
    route: '/pazaryeri?kategori=tamdijital',
    flyoutTitle: 'Dijital Dosya Marketi',
    flyoutDescription: 'Anında lisanslı indirme: ZIP, DST, DXF, STL ve sosyal şablonlar.',
    subCategories: [
      { title: 'CNC / Lazer Kesim Dosyaları', route: '/pazaryeri?kategori=tamdijital&sub=cnc' },
      { title: 'Sosyal Medya Şablonları', route: '/pazaryeri?kategori=tamdijital&sub=sosyal' },
      { title: 'Vektör Çizimler', route: '/pazaryeri?kategori=tamdijital&sub=vektor' },
      { title: 'E-Kitap', route: '/pazaryeri?kategori=tamdijital&sub=ekitap' }
    ]
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
    route: '/toptan',
    flyoutTitle: 'B2B Toptan Depo',
    flyoutDescription: 'Kademeli iskonto, çuvallı gıda, ambalaj ve koli satışı.',
    subCategories: [
      { title: 'Koli Bandı & Ambalaj', route: '/toptan?sub=ambalaj' },
      { title: 'Çuvallı Bakliyat', route: '/toptan?sub=bakliyat' },
      { title: 'Horeca Temizlik & Hijyen', route: '/toptan?sub=temizlik' },
      { title: 'Seri Tekstil', route: '/toptan?sub=tekstil' }
    ]
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
    route: '/kuryeler',
    flyoutTitle: 'Bağımsız Kurye Ağı',
    flyoutDescription: 'Mahallenizde anında moto kurye çağırın veya kurye başvurusu yapın.',
    subCategories: [
      { title: 'Müsait Kuryeleri Çağır', route: '/kuryeler?action=cagir' },
      { title: 'Saatlik Tahsis Fiyatları', route: '/kuryeler?action=fiyat' },
      { title: 'Kurye Olarak Başvur', route: '/kuryeler?action=basvur' }
    ]
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

  const handleSubClick = (e: React.MouseEvent, route: string) => {
    e.stopPropagation();
    navigate(route);
  };

  return (
    <nav 
      aria-label="Hızlı Ticaret ve Keşif Kategorileri"
      className="bg-white border-b border-slate-200/80 py-3 shadow-2xs relative z-30"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-start justify-start md:justify-center gap-3 sm:gap-5 overflow-x-auto scrollbar-none pb-2 pt-1">
          {QUICK_CATEGORIES.map((cat, idx) => {
            const IconComponent = cat.icon;
            const isFirst = idx === 0;

            // Positioning class for flyout
            let flyoutPositionClass = 'left-0';
            if (idx >= 2 && idx <= 4) {
              flyoutPositionClass = 'left-1/2 -translate-x-1/2';
            } else if (idx >= 5) {
              flyoutPositionClass = 'right-0';
            }

            return (
              <div 
                key={cat.id} 
                className="relative group shrink-0"
              >
                {/* Main Icon Button */}
                <button
                  onClick={() => handleItemClick(cat)}
                  className="flex flex-col items-center gap-2 cursor-pointer transition-all duration-300 w-[95px] sm:w-[110px]"
                >
                  {/* Rounded Icon Box */}
                  <div 
                    className={`w-15 h-15 sm:w-17 sm:h-17 rounded-2xl flex items-center justify-center relative shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300 border ${
                      isFirst ? 'border-amber-400/40 ring-2 ring-amber-400/20' : 'border-black/5'
                    }`}
                    style={{ backgroundColor: cat.bgColor }}
                  >
                    <IconComponent 
                      className={`w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-110 ${
                        isFirst ? 'text-amber-400' : ''
                      }`} 
                      style={{ color: isFirst ? '#F59E0B' : cat.iconColor }}
                    />

                    {/* Badge Label Pill */}
                    <span 
                      className={`absolute -bottom-2 text-[9px] font-black uppercase tracking-tight px-2 py-0.5 rounded-full shadow-2xs whitespace-nowrap border border-white ${cat.badgeBg || 'bg-[#0B132B]'} ${cat.badgeTextColor || 'text-white'}`}
                    >
                      {cat.badge}
                    </span>
                  </div>

                  {/* Category Title */}
                  <span className={`text-[11px] sm:text-xs font-bold text-center leading-tight line-clamp-2 mt-1 group-hover:text-[#0F4C3A] transition-colors ${
                    isFirst ? 'text-[#0B132B] font-extrabold' : 'text-slate-800'
                  }`}>
                    {cat.name}
                  </span>
                </button>

                {/* HOVER FLYOUT SUB-CATEGORY PANEL */}
                <div 
                  className={`absolute top-full mt-2.5 ${flyoutPositionClass} w-[260px] sm:w-[290px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 text-left opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 ease-out transform translate-y-2 group-hover:translate-y-0 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-4`}
                >
                  {/* Flyout Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
                    <div>
                      <h4 className="text-xs font-black text-[#0B132B] tracking-tight flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#F59E0B] inline-block"></span>
                        {cat.flyoutTitle || cat.name}
                      </h4>
                      {cat.flyoutDescription && (
                        <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                          {cat.flyoutDescription}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subcategories List */}
                  {cat.subCategories && cat.subCategories.length > 0 && (
                    <div className="space-y-1 mb-3">
                      {cat.subCategories.map((sub, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={(e) => handleSubClick(e, sub.route)}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold text-slate-700 hover:text-[#0F4C3A] hover:bg-emerald-50/80 rounded-xl transition-all group/sub cursor-pointer"
                        >
                          <span className="flex items-center gap-2 truncate">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover/sub:bg-[#0F4C3A] transition-colors"></span>
                            <span className="truncate">{sub.title}</span>
                          </span>

                          <div className="flex items-center gap-1 shrink-0">
                            {sub.badge && (
                              <span className="text-[8.5px] font-black uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 group-hover/sub:bg-emerald-100 group-hover/sub:text-[#0F4C3A] transition-colors">
                                {sub.badge}
                              </span>
                            )}
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover/sub:text-[#0F4C3A] group-hover/sub:translate-x-0.5 transition-transform" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Bottom Footer Action */}
                  <button
                    onClick={() => handleItemClick(cat)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-[#0B132B] text-slate-800 hover:text-white rounded-xl text-[11px] font-extrabold transition-all cursor-pointer border border-slate-100 group/footer"
                  >
                    <span>
                      {isFirst ? "A'dan Z'ye Pazaryerine Git" : `${cat.name.split('&')[0]} Tümünü Gör`}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#F59E0B] group-hover/footer:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
