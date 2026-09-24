import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, ChevronRight, Zap, Shirt, Home, Wrench, FileCode, Layers, 
  Truck, ArrowRight, Sparkles, Utensils, Tag, Package, Building,
  CheckCircle2, Clock, MapPin, Bike, ShieldCheck, X
} from 'lucide-react';

export interface MegaSubCategory {
  title: string;
  items: { name: string; slug?: string; badge?: string }[];
}

export interface MegaCategory {
  id: string;
  name: string;
  badge?: string;
  badgeColor?: string;
  icon: React.ElementType;
  description: string;
  route?: string;
  subCategories: MegaSubCategory[];
  featuredCard?: {
    title: string;
    description: string;
    buttonText: string;
    route: string;
    badge: string;
    bgGradient: string;
  };
}

export const MEGA_MENU_DATA: MegaCategory[] = [
  {
    id: 'tamhizli',
    name: 'Mahalle & Hızlı Tüketim (TamHızlı)',
    badge: '30 Dk Teslimat',
    badgeColor: 'bg-rose-500 text-white',
    icon: Utensils,
    description: 'Mahallenizin kasabı, manavı, fırını ve su bayisinden komisyonsuz sıcak ve taze teslimat.',
    subCategories: [
      {
        title: 'Kasap & Şarküteri',
        items: [
          { name: 'Dana Kıyma & Kuşbaşı', badge: 'Taze' },
          { name: 'Antrikot & Biftek' },
          { name: 'Kasap Sucuk & Pastırma' },
          { name: 'Organik Köy Tavuğu' },
          { name: 'Yöresel Peynir & Şarküteri' }
        ]
      },
      {
        title: 'Taze Meyve & Sebze',
        items: [
          { name: 'Günlük Mevsim Meyveleri' },
          { name: 'Çıtır Taze Salata & Yeşillik' },
          { name: 'Organik Tarla Sebzeleri', badge: 'Yerel' },
          { name: 'Amasya & Niğde Elması' },
          { name: 'Kurutulmuş Meyve & Ceviz' }
        ]
      },
      {
        title: 'Fırın & Unlu Mamuller',
        items: [
          { name: 'Odun Ateşi Taş Fırın Ekmek' },
          { name: 'Kıymalı & Kaşarlı Sıcak Pide' },
          { name: 'Geleneksel Çıtır Simit' },
          { name: 'Su Böreği & Çörek' },
          { name: 'Butik Yaş & Kuru Pasta' }
        ]
      },
      {
        title: 'Su & İçecek',
        items: [
          { name: '19L Damacana Doğal Kaynak Suyu' },
          { name: 'Taze Sıkılmış Portakal Suyu' },
          { name: 'Adana Şalgamı & Boza' },
          { name: 'Maden Suyu & Soda' },
          { name: 'Yerel Harman Çay & Kahve' }
        ]
      }
    ],
    featuredCard: {
      title: '30 Dakikada Kapında!',
      description: 'Aracı şirket komisyonu ödemeden mahallenizin fırın ve kasabından doğrudan sipariş verin.',
      buttonText: 'TamHızlı Esnafları Gör',
      route: '/sehir-avm',
      badge: 'Sıfır Komisyon',
      bgGradient: 'from-rose-900 via-rose-950 to-slate-950'
    }
  },
  {
    id: 'moda',
    name: 'Moda & Giyim & Zanaat',
    badge: 'Butik Esnaf',
    badgeColor: 'bg-teal-600 text-white',
    icon: Shirt,
    description: 'Türkiye’nin zanaatkarlarından el emeği giyim, deri ayakkabı ve butik moda koleksiyonları.',
    subCategories: [
      {
        title: 'Kadın Giyim',
        items: [
          { name: 'Elbise & Abiye Modelleri' },
          { name: 'Butik Bluz & Gömlek' },
          { name: 'Oversize Ceket & Kaban' },
          { name: 'Triko & Hırka' },
          { name: 'Rahat Ev Giyimi & Pijama' }
        ]
      },
      {
        title: 'Erkek Giyim',
        items: [
          { name: 'Zanaatkar Takım Elbise' },
          { name: 'Pamuklu Gömlek & T-shirt' },
          { name: 'Hakiki Deri Mont & Ceket' },
          { name: 'Kumaş & Kot Pantolon' },
          { name: 'Spor & Sweatshirt' }
        ]
      },
      {
        title: 'El Emeği & Atölye',
        items: [
          { name: 'El Yapımı Seramik Fincan', badge: 'Atölye' },
          { name: 'Ahşap Oyma Dekorasyon' },
          { name: 'Geleneksel Örgü & Nakış' },
          { name: 'Tasarım Takı & Aksesuar' },
          { name: 'Özel Yapım Deri Cüzdan' }
        ]
      },
      {
        title: 'Ayakkabı & Çanta',
        items: [
          { name: 'Hakiki Deri Oxford Ayakkabı' },
          { name: 'Erkek & Kadın Sneaker' },
          { name: 'Handmade Deri Omuz Çantası' },
          { name: 'Kışlık Deri Bot & Çizme' },
          { name: 'Seyahat & Evrak Çantası' }
        ]
      }
    ],
    featuredCard: {
      title: 'Zanaatkâr Butikleri Keşfet',
      description: 'El emeği deri, seramik ve özgün tekstil ürünlerini doğrudan üreticinin raf fiyatıyla satın alın.',
      buttonText: 'Atölye Vitrinine Geç',
      route: '/dukkan/atolye-zanaat',
      badge: 'Geleneksel Zanaat',
      bgGradient: 'from-teal-900 via-slate-900 to-slate-950'
    }
  },
  {
    id: 'ev-yasam',
    name: 'Ev, Yaşam & Yapı Market',
    badge: 'Usta Rafı',
    badgeColor: 'bg-amber-600 text-[#0B132B]',
    icon: Home,
    description: 'Eviniz ve dükkanınız için dayanıklı mutfak eşyaları, hırdavat, boya ve bahçe ürünleri.',
    subCategories: [
      {
        title: 'Mutfak & Sofra',
        items: [
          { name: 'Döküm Tencere & Tava Seti' },
          { name: 'Porselen Yemek Takımı' },
          { name: 'Sürmene Şef Bıçak Takımı', badge: 'Zanaat' },
          { name: 'Cam Saklama & Baharatlık' },
          { name: 'Çay Demlik & Kahve Makinesi' }
        ]
      },
      {
        title: 'Ev Tekstili',
        items: [
          { name: '%100 Pamuk Nevresim Takımı' },
          { name: 'Denizli Dokuma Havlu & Bornoz' },
          { name: 'Etnik Dokuma Halı & Kilim' },
          { name: 'Özel Ölçü Perde & Fon' },
          { name: 'Ortopedik Yatak & Yastık' }
        ]
      },
      {
        title: 'Hırdavat & Nalburiye',
        items: [
          { name: 'Şarjlı Matkap & El Aletleri' },
          { name: 'Silinebilir İç Cephe Boyası' },
          { name: 'Akıllı Kilit & Kapı Kolları' },
          { name: 'LED Aydınlatma & Avize' },
          { name: 'Tesisat & Musluk Armatür' }
        ]
      },
      {
        title: 'Bahçe & Çiçek',
        items: [
          { name: 'Canlı Saksı Bitkileri' },
          { name: 'Balkon & Bahçe Mobilyası' },
          { name: 'Çim Biçme & Budama Makinesi' },
          { name: 'Organik Sebze Fidesi & Tohum' },
          { name: 'Otomatik Sulama Sistemleri' }
        ]
      }
    ],
    featuredCard: {
      title: 'Nalburiye ve Yapı Market',
      description: 'Evinizin ihtiyacı olan usta aletlerini ve yapı malzemelerini mahalle nalburunuzdan temin edin.',
      buttonText: 'Hırdavat Vitrini',
      route: '/?scope=retail',
      badge: '%0 Komisyon',
      bgGradient: 'from-amber-900 via-[#0B132B] to-slate-950'
    }
  },
  {
    id: 'tamusta',
    name: 'Hizmet & Ustalık & Bakım (TamUsta & TamTeklif)',
    badge: 'TamTeklif',
    badgeColor: 'bg-indigo-600 text-white',
    icon: Wrench,
    description: 'Su tesisatçısı, elektrikçi, klima servisi ve boyacı ustalarından ücretsiz kapalı zarf fiyat teklifi alın.',
    subCategories: [
      {
        title: 'Ev Tadilat & Tesisat',
        items: [
          { name: '7/24 Nöbetçi Su Tesisatçısı', badge: 'Acil' },
          { name: 'Elektrik Arıza & Panosu' },
          { name: 'Boya Badana & Mutfak Tadilatı' },
          { name: '7/24 Çilingir & Kapatma' },
          { name: 'Parke & Seramik Döşeme' }
        ]
      },
      {
        title: 'Beyaz Eşya / Klima',
        items: [
          { name: 'Klima Montaj & Gaz Dolumu' },
          { name: 'Kombi Bakımı & Petek Temizliği' },
          { name: 'Çamaşır & Bulaşık Makinesi Arıza' },
          { name: 'Buzdolabı Motor Değişimi' },
          { name: 'Televizyon LED Değişimi' }
        ]
      },
      {
        title: 'Temizlik / İlaçlama',
        items: [
          { name: 'Gündelik Ev & Ofis Temizliği' },
          { name: 'Koltuk & Halı Yıkama Servisi' },
          { name: 'Böcek & Haşere İlaçlama' },
          { name: 'İnşaat Sonrası Detaylı Temizlik' },
          { name: 'Dış Cephe Cam Temizliği' }
        ]
      },
      {
        title: 'Medya / Prodüksiyon',
        items: [
          { name: 'Düğün & Dış Çekim Fotoğrafçısı' },
          { name: 'Kurumsal Tanıtım Filmi' },
          { name: 'E-Ticaret Ürün Çekimi' },
          { name: 'Etkinlik Ses & Işık Sistemleri' },
          { name: 'Drone Hava Çekimi' }
        ]
      }
    ],
    featuredCard: {
      title: 'TamTeklif ile Ücretsiz Fiyat Al',
      description: 'İhtiyacınızı yazın, fotoğraf yükleyin, şehrinizdeki kayıtlı ustalar size kapalı zarf teklifi sunsun.',
      buttonText: 'Hemen Teklif İste',
      route: '/?openTamTeklif=true',
      badge: 'Şeffaf Teklif',
      bgGradient: 'from-indigo-950 via-slate-900 to-[#0B132B]'
    }
  },
  {
    id: 'tamdijital',
    name: 'Dijital Varlıklar (TamDijital)',
    badge: 'Anında İndir',
    badgeColor: 'bg-cyan-600 text-white',
    icon: FileCode,
    description: 'Lazer kesim DXF, Maraş nakış PES/DST, 3D STL modeller ve rehberleri komisyonsuz indirin.',
    subCategories: [
      {
        title: 'Grafik & Tasarım Şablonları',
        items: [
          { name: 'Lazer Kesim CNC Ahşap DXF/SVG', badge: 'Popüler' },
          { name: 'Maraş İşi Nakış Desenleri (PES/DST)' },
          { name: '3D Yazıcı STL Heykel Modelleri' },
          { name: 'Sosyal Medya Canva & PSD Kit' },
          { name: 'Vektör Logo & Ambalaj Çizimleri' }
        ]
      },
      {
        title: 'E-Kitap & Rehberler',
        items: [
          { name: 'Esnaf İçin E-Ticaret Başlangıç Kılavuzu' },
          { name: 'Kendi Sanal POS Entegrasyon Rehberi' },
          { name: 'Organik Tarım & Ahşap İşçiliği Kitabı' },
          { name: 'Sosyal Medya Satış Stratejileri' },
          { name: 'GİB e-Fatura & Muhasebe Kılavuzu' }
        ]
      },
      {
        title: 'Yazılım & Eklentiler',
        items: [
          { name: 'Vite & React E-Ticaret UI Kit' },
          { name: 'WordPress Woocommerce Entegrasyonu' },
          { name: 'Excel Ön Muhasebe & Stok Şablonu' },
          { name: 'Otomatik Barkod Etiket Yazılımı' },
          { name: 'Kasa & Terazi API Sürücüleri' }
        ]
      }
    ],
    featuredCard: {
      title: 'Anında Güvenli İndirme',
      description: 'Satın aldığınız an üreticinin lisanslı dijital dosyasını kargo beklemeden saniyesinde indirin.',
      buttonText: 'Dijital Ürünleri Gez',
      route: '/blog/tamdijital-tasarimcilar-ve-ureticiler-icin-dijital-varlik-pazari',
      badge: 'Sıfır Kargo',
      bgGradient: 'from-cyan-950 via-slate-900 to-[#0B132B]'
    }
  },
  {
    id: 'toptan',
    name: 'B2B Toptan (/toptan)',
    badge: '%0 Komisyon',
    badgeColor: 'bg-[#F59E0B] text-[#0B132B]',
    icon: Layers,
    description: 'Restoran, market ve üreticiler için koli/palet bazlı indirimli fabrika tedariki.',
    route: '/toptan',
    subCategories: [
      {
        title: 'Koli & Ambalaj',
        items: [
          { name: 'Oluklu Mukavva Taşıma Kolisi', badge: 'Fabrika' },
          { name: 'Kraft Pencereli Kese Kağıdı' },
          { name: 'Palet Streç Film & Koli Bandı' },
          { name: 'Özel Logolu Baskılı Kutu' },
          { name: 'Köpük Koruma & Baloncuklu Naylon' }
        ]
      },
      {
        title: 'Toptan Gıda',
        items: [
          { name: '50kg Çuval Osmancık Pirinç' },
          { name: '18L Teneke Sızma Zeytinyağı' },
          { name: 'Dökme Kavrulmuş İç Fındık' },
          { name: 'Toptan Şarküteri & Blok Peynir' },
          { name: 'Un & Şeker Çuvalları' }
        ]
      },
      {
        title: 'Horeca & Restoran Tedarik',
        items: [
          { name: 'Baskılı Restoran Peçete & Islak Mendil' },
          { name: 'Kullan-At Sızdırmaz Çorba Kabı' },
          { name: 'Endüstriyel Bulaşık Deterjanı' },
          { name: 'Restoran Ambalaj & Alüminyum Sütlaç Kabı' },
          { name: 'Kurye Termo Çantaları' }
        ]
      }
    ],
    featuredCard: {
      title: 'B2B Kapalı Devre Toptan',
      description: 'Üreticiden doğrudan palet bazlı indirimli satın alın. GİB e-irsaliye güvencesiyle sevk edin.',
      buttonText: 'Toptan Pazar Yeri',
      route: '/toptan',
      badge: 'GİB e-İrsaliye',
      bgGradient: 'from-[#0B132B] via-[#0F4C3A] to-slate-950'
    }
  },
  {
    id: 'tamkurye',
    name: 'TamKurye',
    badge: 'Bağımsız Ağı',
    badgeColor: 'bg-amber-500 text-slate-950',
    icon: Truck,
    description: 'Esnafın tek tıkla yakındaki serbest kuryeleri çağırdığı şeffaf teslimat ağı.',
    route: '/kuryeler',
    subCategories: [
      {
        title: 'Müsait Kuryeler',
        items: [
          { name: 'Şehir İçi Moto-Kurye (30 Dk)', badge: 'Anlık' },
          { name: 'Bisikletli & E-Bike Dağıtım' },
          { name: 'Yaya & Kampüs Teslimatçısı' },
          { name: 'Hafif Ticari Doblo Paket Taşıma' },
          { name: 'Nöbetçi Gece Kuryeleri' }
        ]
      },
      {
        title: 'Saatlik Tahsis & Filo',
        items: [
          { name: 'Tam Gün Kurye Tahsisi (8 Saat)' },
          { name: 'Yoğun Saat Mutfak Ekip Desteği' },
          { name: 'Etkinlik & Toplu Evrak Dağıtımı' },
          { name: 'E-Ticaret Aynı Gün Depo Çıkışı' },
          { name: 'Haftalık Sözleşmeli Kurye Hizmeti' }
        ]
      },
      {
        title: 'Ekspres & Özel Taşıma',
        items: [
          { name: '30 Dakikada VIP Özel Teslimat' },
          { name: 'Soğuk Zincir İlaç & Medikal Paket' },
          { name: 'Hassas Cam & Tablo Taşıma' },
          { name: 'Değerli Evrak & Çek Teslimatı' },
          { name: 'Gümrük & Havaalanı Ekspres Evrak' }
        ]
      }
    ],
    featuredCard: {
      title: 'TamKurye Bağımsız Lojistik',
      description: 'Dükkanınıza en yakın kuryeyi haritada görün, aracı komisyonu olmadan direkt çağırın.',
      buttonText: 'Kurye Dizinine Git',
      route: '/kuryeler',
      badge: 'Şeffaf Tarifeler',
      bgGradient: 'from-amber-950 via-slate-900 to-[#0B132B]'
    }
  }
];

export interface MegaMenuProps {
  onSelectCategory?: (categoryName: string) => void;
  onOpenTamTeklif?: () => void;
}

export default function MegaMenu({ onSelectCategory, onOpenTamTeklif }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTabId, setActiveTabId] = useState<string>(MEGA_MENU_DATA[0].id);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const activeCategory = MEGA_MENU_DATA.find(c => c.id === activeTabId) || MEGA_MENU_DATA[0];

  // Close menu on click outside or ESC
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleItemClick = (categoryName: string, route?: string) => {
    setIsOpen(false);
    if (route) {
      navigate(route);
    } else if (onSelectCategory) {
      onSelectCategory(categoryName);
    } else {
      navigate(`/?search=${encodeURIComponent(categoryName)}`);
    }
  };

  return (
    <div 
      className="relative z-50 inline-block" 
      ref={menuRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* TRIGGER BUTTON (Header Bar Element) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Kategoriler ve Mega Menü"
        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-black transition-all shadow-xs cursor-pointer border ${
          isOpen 
            ? 'bg-[#0F4C3A] text-white border-[#0F4C3A] ring-2 ring-[#0F4C3A]/30' 
            : 'bg-[#0F4C3A]/10 hover:bg-[#0F4C3A] text-[#0F4C3A] hover:text-white border-[#0F4C3A]/20'
        }`}
      >
        <Menu className="w-4 h-4 shrink-0" />
        <span className="hidden sm:inline tracking-tight">Kategoriler & Tüm AVM</span>
        <span className="sm:hidden">Kategoriler</span>
        <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {/* MEGA MENU PANEL (TRENDYOL STYLE DROPDOWN) */}
      {isOpen && (
        <div 
          className="absolute left-0 top-full mt-1.5 w-[92vw] sm:w-[820px] md:w-[960px] lg:w-[1040px] bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden z-50 animate-fade-in flex flex-col md:flex-row max-h-[82vh] md:max-h-[580px]"
          style={{ maxWidth: 'calc(100vw - 2rem)' }}
        >
          
          {/* LEFT SIDEBAR TABS (Categories) */}
          <div className="w-full md:w-72 bg-slate-50 border-r border-slate-200 p-2 overflow-y-auto shrink-0 space-y-1 scrollbar-thin">
            <div className="px-3 py-2 border-b border-slate-200/80 mb-1 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Pazaryeri Kategorileri
              </span>
              <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                %0 Komisyon
              </span>
            </div>

            {MEGA_MENU_DATA.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeTabId === cat.id;

              return (
                <button
                  key={cat.id}
                  onMouseEnter={() => setActiveTabId(cat.id)}
                  onClick={() => {
                    setActiveTabId(cat.id);
                    if (cat.route) handleItemClick(cat.name, cat.route);
                  }}
                  className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between group cursor-pointer ${
                    isActive 
                      ? 'bg-white text-[#0F4C3A] font-extrabold shadow-sm border border-slate-200/90' 
                      : 'text-slate-700 hover:bg-slate-100/80 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-2 rounded-xl transition-colors ${
                      isActive ? 'bg-[#0F4C3A] text-white' : 'bg-slate-200/80 text-slate-600 group-hover:bg-[#0F4C3A] group-hover:text-white'
                    }`}>
                      <Icon className="w-4 h-4 shrink-0" />
                    </div>
                    <div className="truncate text-xs leading-snug">
                      <div className="truncate">{cat.name}</div>
                      {cat.badge && (
                        <span className={`inline-block text-[9px] px-1.5 py-0.2 rounded font-black tracking-wide mt-0.5 ${cat.badgeColor || 'bg-slate-200 text-slate-800'}`}>
                          {cat.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                    isActive ? 'text-[#0F4C3A] translate-x-1' : 'text-slate-300 group-hover:text-slate-500'
                  }`} />
                </button>
              );
            })}
          </div>

          {/* RIGHT MAIN CONTENT AREA (Multi-column Subcategories + Featured Card) */}
          <div className="flex-1 bg-white p-5 md:p-6 overflow-y-auto flex flex-col justify-between space-y-6 scrollbar-thin">
            
            {/* Header Description of Active Category */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm md:text-base font-black text-slate-900">
                    {activeCategory.name}
                  </h3>
                  {activeCategory.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wide ${activeCategory.badgeColor}`}>
                      {activeCategory.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {activeCategory.description}
                </p>
              </div>

              {activeCategory.route && (
                <Link
                  to={activeCategory.route}
                  onClick={() => setIsOpen(false)}
                  className="shrink-0 text-xs font-black text-emerald-800 hover:text-emerald-950 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 hover:bg-emerald-100 transition"
                >
                  <span>Sayfasına Git</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {/* MULTI-COLUMN SUB-CATEGORIES GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCategory.subCategories.map((sub, sIdx) => (
                <div key={sIdx} className="space-y-2">
                  <h4 className="text-xs font-black text-[#0B132B] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
                    <span>{sub.title}</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {sub.items.map((item, iIdx) => (
                      <li key={iIdx}>
                        <button
                          onClick={() => handleItemClick(item.name, item.slug ? `/?search=${encodeURIComponent(item.name)}` : undefined)}
                          className="w-full text-left text-xs font-semibold text-slate-600 hover:text-[#0F4C3A] hover:translate-x-1 transition-all flex items-center justify-between group cursor-pointer"
                        >
                          <span className="truncate group-hover:font-bold">{item.name}</span>
                          {item.badge && (
                            <span className="text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded shrink-0 ml-1">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* FEATURED BANNER CARD AT THE BOTTOM */}
            {activeCategory.featuredCard && (
              <div className={`mt-4 p-4 md:p-5 rounded-2xl bg-gradient-to-r ${activeCategory.featuredCard.bgGradient} text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800`}>
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                      {activeCategory.featuredCard.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-white">
                    {activeCategory.featuredCard.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                    {activeCategory.featuredCard.description}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    if (activeCategory.featuredCard?.route === '/?openTamTeklif=true') {
                      if (onOpenTamTeklif) onOpenTamTeklif();
                    } else if (activeCategory.featuredCard?.route) {
                      navigate(activeCategory.featuredCard.route);
                    }
                  }}
                  className="shrink-0 px-4 py-2.5 bg-[#F59E0B] hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{activeCategory.featuredCard.buttonText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

          </div>

        </div>
      )}
    </div>
  );
}
