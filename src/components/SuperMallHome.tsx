/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Utensils, Wrench, Truck, ShoppingBag, 
  MapPin, Phone, MessageCircle, Clock, ShieldCheck, Search, Zap,
  Star, CheckCircle2, ArrowRight, X, AlertCircle, Sparkles, Navigation, ChevronRight, Calendar, Layers
} from 'lucide-react';
import UniversalProductCard, { UniversalCardData } from './UniversalProductCard';

export const SAMPLE_PRODUCTS: UniversalCardData[] = [
  // 1. Tesisat / Hizmet Kartı
  {
    id: 'p1',
    slug: 'termal-su-kacagi-tespiti',
    sector: 'SERVICE',
    title: 'Termal Cihazla Kırmadan Su Kaçağı Tespiti + Resmi Rapor',
    category: 'Sıhhi Tesisat',
    image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800',
    price: 1200,
    vatRate: 20,
    serviceDuration: '45-60 Dk',
    store: {
      name: 'Kuzey Teknik Tesisat',
      slug: 'kuzey-teknik',
      district: 'Altınordu',
      city: 'Ordu',
      phone: '+904522220000',
      whatsapp: '905320000000',
      rating: 4.9,
      reviewCount: 48,
      paymentProvider: 'Doğrudan PayTR',
      isPhysicalVerified: true,
    }
  },
  // 2. Acil Oto Çekici Kartı
  {
    id: 'p2',
    slug: '7-24-acil-oto-kurtarma',
    sector: 'EMERGENCY',
    title: '7/24 Şehir İçi ve Şehirler Arası Acil Oto Kurtarma & Çekici',
    category: 'Yol Yardım',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800',
    price: 1500,
    vatRate: 20,
    etaMinutes: '15 Dk Varış',
    isEmergency247: true,
    store: {
      name: 'Özdemir Oto Kurtarma',
      slug: 'ozdemir-cekici',
      district: 'Merkez',
      city: 'Ordu',
      phone: '+905321112233',
      whatsapp: '905321112233',
      rating: 5.0,
      reviewCount: 112,
      paymentProvider: 'Kendi Sanal POS',
      isPhysicalVerified: true,
    }
  },
  // 3. Toptan (B2B) Hırdavat / Malzeme Kartı
  {
    id: 'p3',
    slug: 'pirinc-kuresel-vana-toptan',
    sector: 'WHOLESALE',
    title: 'Pirinç Küresel Su Vanası 1/2 PN25 (Koli İçi 50 Adet)',
    category: 'Toptan Malzeme',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
    price: 140,
    vatRate: 20,
    minOrderQty: 10,
    wholesaleTiers: [
      { minQty: 50, unitPrice: 115 },
      { minQty: 200, unitPrice: 95 }
    ],
    store: {
      name: 'Mega Endüstriyel Toptan',
      slug: 'mega-endustriyel',
      district: 'Sanayi',
      city: 'Ordu',
      phone: '+904523334455',
      whatsapp: '905334445566',
      rating: 4.8,
      reviewCount: 35,
      paymentProvider: 'Doğrudan iyzico',
      isPhysicalVerified: true,
    }
  },
  // 4. Sıcak Döner / Yemek Kartı
  {
    id: 'p4',
    slug: 'odun-atesinde-et-doner-menu',
    sector: 'FOOD',
    title: 'Odun Ateşinde Yaprak Et Döner Dürüm Menü (Patates + Ayran)',
    category: 'Yeme & İçme',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800',
    price: 240,
    vatRate: 10,
    etaMinutes: '20-30 Dk',
    store: {
      name: 'Tarihi Karadeniz Dönercisi',
      slug: 'tarihi-karadeniz-doner',
      district: 'Altınordu',
      city: 'Ordu',
      phone: '+904525556677',
      whatsapp: '905356667788',
      rating: 4.7,
      reviewCount: 280,
      paymentProvider: 'Kendi Sanal POS',
      isPhysicalVerified: true,
    }
  }
];

interface SuperMallHomeProps {
  onNavigateToStore?: (storeId: string) => void;
  onNavigateToProduct?: (slug: string) => void;
  onOpenSaaSConsole?: (tab?: string) => void;
  onBackToMarketplace?: () => void;
}

export const SUPER_MALL_SECTORS = [
  { id: 'all', name: 'Tüm Sektörler', icon: Sparkles, desc: 'Şehrin tüm esnaf ve işletmeleri', count: '2.095 İşletme' },
  { id: 'retail', name: 'Alışveriş & Mağazalar', icon: ShoppingBag, desc: 'Ayakkabı, Giyim, Mobilya, Tasarım', count: '1.420 Dükkân' },
  { id: 'food', name: 'Yeme & İçme (Sıcak Paket)', icon: Utensils, desc: 'Döner, Kebap, Fırın, Kafe & Tatlı', count: '380 İşletme' },
  { id: 'service', name: 'Usta & Tesisat Hizmeti', icon: Wrench, desc: 'Su Tesisatı, Boya, Elektrik, Keşif', count: '210 Esnaf' },
  { id: 'emergency', name: 'Acil Çekici & Yol Yardım', icon: Truck, desc: '7/24 Konuma En Yakın Nöbetçi Çekici', count: '85 Araç' },
];

export const LIVE_BUSINESSES = [
  // 1. Dönerci (Sıcak Satış)
  {
    id: 'b1',
    storeId: 'st-102',
    name: 'Tarihi Karadeniz Dönercisi',
    legalTitle: 'Karadeniz Lezzetleri Gıda Ltd. Şti.',
    sector: 'food',
    badge: 'Gel-Al & Hızlı Paket',
    rating: 4.8,
    reviews: 412,
    eta: '25-35 dk',
    phone: '+904522220000',
    whatsapp: '905322220000',
    address: 'Atatürk Bulvarı No:14, Altınordu',
    city: 'Ordu',
    popularItem: 'Et Döner Dürüm Menü (Ayran + Patates)',
    price: 240,
    actionText: 'Sipariş Ver (BYO POS)',
    actionColor: 'bg-amber-600 hover:bg-amber-700',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
    posProvider: 'PayTR Hızlı Ödeme'
  },
  // 2. Acil Oto Çekici (Lokasyon & Çağrı)
  {
    id: 'b2',
    storeId: 'st-103',
    name: 'Özdemir 7/24 Oto Kurtarma & Çekici',
    legalTitle: 'Özdemir Vinç ve Yol Yardım San. Tic.',
    sector: 'emergency',
    badge: '15 Dk İçinde Olay Yerinde',
    rating: 5.0,
    reviews: 189,
    eta: '7/24 Nöbetçi Çekici',
    phone: '+905321110000',
    whatsapp: '905321110000',
    address: 'Çevre Yolu Bağlantısı Sanayi Çıkışı',
    city: 'Ordu & Karadeniz Bölgesi',
    popularItem: 'Şehir İçi Sabit Çekici Ücreti',
    price: 1500,
    actionText: 'Hemen Konuma Çağır',
    actionColor: 'bg-red-600 hover:bg-red-700',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80',
    posProvider: 'iyzico Mobil POS'
  },
  // 3. Sıhhi Tesisatçı (Hizmet & Randevu)
  {
    id: 'b3',
    storeId: 'st-104',
    name: 'Usta Teknik Sıhhi Tesisat',
    legalTitle: 'Usta Teknik Mühendislik ve Tesisat',
    sector: 'service',
    badge: 'Termal Cihazla Su Kaçağı Tespiti',
    rating: 4.9,
    reviews: 96,
    eta: 'Bugün Randevu Uygun',
    phone: '+905442220000',
    whatsapp: '905442220000',
    address: 'Sanayi Sitesi C Blok No: 18',
    city: 'Ordu',
    popularItem: 'Noktasal Kaçak Tespiti + Resmi Rapor',
    price: 950,
    actionText: 'Usta Çağır / Randevu',
    actionColor: 'bg-blue-600 hover:bg-blue-700',
    image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600&auto=format&fit=crop&q=80',
    posProvider: 'Sipay Gateway'
  },
  // 4. Ayakkabıcı (Fiziki Perakende & Kargo)
  {
    id: 'b4',
    storeId: 'tenant-1',
    name: 'Kundura Dünyası (Mert Kundura)',
    legalTitle: 'Mert Kundura San. ve Ayakkabıcılık',
    sector: 'retail',
    badge: 'Aynı Gün Ücretsiz Kargo',
    rating: 4.7,
    reviews: 215,
    eta: 'Tüm Türkiye Kargo / Gel-Al',
    phone: '+904523330000',
    whatsapp: '905321110099',
    address: 'Çarşı Cad. No:8, Altınordu',
    city: 'Ordu & Online',
    popularItem: 'Hakiki Deri Erkek Klasik Ayakkabı',
    price: 1850,
    actionText: 'Satın Al / İncele',
    actionColor: 'bg-slate-900 hover:bg-indigo-950',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80',
    posProvider: 'PayTR Doğrudan POS'
  },
  // 5. Kuzey Ahşap (Masif Mobilya)
  {
    id: 'b5',
    storeId: 'st-101',
    name: 'Kuzey Ahşap & Mobilya Tasarım',
    legalTitle: 'Kuzey Ahşap Sanayi ve Ticaret Ltd. Şti.',
    sector: 'retail',
    badge: 'El İşçiliği Masif Meşe',
    rating: 4.9,
    reviews: 128,
    eta: 'Atölye Ziyareti Açık',
    phone: '+904522230000',
    whatsapp: '905320000000',
    address: 'Sanayi Mah. Marangozlar Sitesi No: 42',
    city: 'Ordu',
    popularItem: 'Doğal Kenar Meşe Kütük Yemek Masası',
    price: 14850,
    actionText: 'Atölyeyi Gör / Satın Al',
    actionColor: 'bg-emerald-700 hover:bg-emerald-800',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&auto=format&fit=crop&q=80',
    posProvider: 'PayTR Kurumsal POS'
  },
  // 6. FotoSentez Stüdyo (Prodüksiyon)
  {
    id: 'b6',
    storeId: 's3',
    name: 'FotoSentez Stüdyo',
    legalTitle: 'FotoSentez Prodüksiyon ve Medya Hizmetleri Ltd.',
    sector: 'service',
    badge: '4K E-Ticaret Ürün Çekimi',
    rating: 5.0,
    reviews: 88,
    eta: 'Aynı Gün Teslimat Seansı',
    phone: '+902163304050',
    whatsapp: '905307778899',
    address: 'Caferağa Mah. Moda Cad. No: 88',
    city: 'İstanbul & Yerinde Çekim',
    popularItem: 'Kurumsal Ürün ve Katalog Fotoğraf Çekimi',
    price: 4500,
    actionText: 'Stüdyo Randevusu Al',
    actionColor: 'bg-sky-600 hover:bg-sky-700',
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&auto=format&fit=crop&q=80',
    posProvider: 'Sipay Gateway'
  }
];

export default function SuperMallHome({ 
  onNavigateToStore, 
  onNavigateToProduct,
  onOpenSaaSConsole, 
  onBackToMarketplace 
}: SuperMallHomeProps) {
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Interactive modal state for quick order/dispatch
  const [activeModalBusiness, setActiveModalBusiness] = useState<typeof LIVE_BUSINESSES[0] | null>(null);
  const [modalConfirmed, setModalConfirmed] = useState(false);

  const filteredBusinesses = LIVE_BUSINESSES.filter(b => {
    const matchesSector = selectedSector === 'all' || b.sector === selectedSector;
    const matchesQuery = searchQuery === '' || 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.popularItem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesQuery;
  });

  const handleActionClick = (business: typeof LIVE_BUSINESSES[0]) => {
    setActiveModalBusiness(business);
    setModalConfirmed(false);
  };

  const handleExecuteDirectTransaction = () => {
    if (!activeModalBusiness) return;
    
    // Save simulated e-invoice
    const saved = localStorage.getItem('tampazar_invoices');
    const invoices = saved ? JSON.parse(saved) : [];
    
    const vat = parseFloat((activeModalBusiness.price * 0.10).toFixed(2));
    const clean = parseFloat((activeModalBusiness.price - vat).toFixed(2));

    invoices.push({
      id: 'inv-' + Math.floor(Math.random() * 1000000),
      invoiceNumber: 'GIB2026000000' + Math.floor(100 + Math.random() * 899),
      orderId: 'supermall-' + Math.floor(Math.random() * 100000),
      tenantId: activeModalBusiness.storeId,
      customerName: 'Açık AVM Müşterisi (Hızlı Çağrı / Sipariş)',
      customerTaxOffice: 'Altınordu VD',
      customerTaxId: '1192019482',
      customerEmail: 'musteri@tampazar.com',
      date: new Date().toISOString().split('T')[0],
      amount: clean,
      vatAmount: vat,
      withholdingTaxType: 'None',
      withholdingAmount: 0.00,
      totalPayable: activeModalBusiness.price,
      status: 'queued',
      integrator: 'gib'
    });

    localStorage.setItem('tampazar_invoices', JSON.stringify(invoices));
    window.dispatchEvent(new Event('tampazar_accounting_updated'));
    window.dispatchEvent(new Event('tampazar_invoice_added'));

    setModalConfirmed(true);
    setTimeout(() => {
      setActiveModalBusiness(null);
      setModalConfirmed(false);
    }, 2800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      
      {/* ÜST BİLGİ & SEKTÖR SEÇİCİ */}
      <section className="bg-slate-900 text-white pt-10 pb-16 px-4 relative overflow-hidden">
        {/* Background Subtle Grid */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400 bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/20">
              Şehrin Komisyonsuz Açık Dijital AVM'si
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Dönerciden Çekiciye, Ayakkabıdan Tesisatçıya.<br />
            <span className="text-amber-400">Aracısız, Komisyonsuz, Doğrudan Esnaftan.</span>
          </h1>

          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            <strong>tampazar.com</strong> komisyon almaz. Esnaf kendi POS'uyla doğrudan tahsilat yapar, faturasını anında keser; dükkân bilgilerini, WhatsApp hattını ve telefonunu müşteriye özgürce açar.
          </p>

          {/* Hızlı Arama */}
          <div className="max-w-2xl mx-auto pt-4">
            <div className="flex bg-white rounded-2xl p-1.5 shadow-2xl items-center border border-slate-700/50">
              <MapPin className="w-5 h-5 text-indigo-600 ml-3 shrink-0" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ne arıyorsunuz? (Örn: Çekici, 42 numara bot, su tesisatı, yarım ekmek döner...)" 
                className="w-full px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-slate-600 mr-1">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors shrink-0 shadow-xs cursor-pointer">
                Bul & Getir
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SÜPER AVM KORİDORLARI (SEKTÖR KARTLARI) */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          {SUPER_MALL_SECTORS.map((s) => {
            const Icon = s.icon;
            const isSelected = selectedSector === s.id;
            return (
              <div 
                key={s.id} 
                onClick={() => setSelectedSector(s.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-white border-indigo-600 ring-2 ring-indigo-600/20 shadow-md transform -translate-y-1' 
                    : 'bg-white/95 backdrop-blur-xs border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
                }`}
              >
                <div>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-xs text-slate-900">{s.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{s.desc}</p>
                </div>
                <span className={`text-[10px] font-bold block mt-2.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {s.count}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Evrensel Ürün Kartları Vitrini (UniversalProductCard) */}
      <section className="max-w-7xl mx-auto px-4 pt-12 pb-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">Evrensel Sektörel Esnaf Vitrini</h2>
            <p className="text-xs text-slate-500 mt-0.5">Tesisat, Acil Çekici, Toptan B2B ve Sıcak Gıda için özelleştirilmiş evrensel kart yapıları</p>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            %0 Komisyon · Doğrudan Tahsilat
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SAMPLE_PRODUCTS.map((prod) => (
            <UniversalProductCard key={prod.id} data={prod} onNavigateToProduct={onNavigateToProduct} />
          ))}
        </div>
      </section>

      {/* CANLI DÜKKÂNLAR VE AKSİYON VİTRİNİ */}
      <main className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              {selectedSector === 'all' ? 'Şu An Hizmet Veren Tüm Dükkânlar' : `${SUPER_MALL_SECTORS.find(s => s.id === selectedSector)?.name} Vitrini`}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Doğrudan arayabilir, WhatsApp'tan yazabilir veya satıcının kendi POS'u ile %0 komisyonla ödeyebilirsiniz.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 self-start sm:self-auto bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Canlı & Açık Mağazalar ({filteredBusinesses.length})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBusinesses.map((b) => (
            <div 
              key={b.id} 
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between group hover:shadow-lg transition-all"
            >
              <div>
                {/* Visual Banner */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img 
                    src={b.image} 
                    alt={b.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-950/80 text-white backdrop-blur-xs">
                    {b.badge}
                  </span>
                  <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{b.rating} ({b.reviews})</span>
                  </div>
                </div>

                <div className="p-4 space-y-2.5">
                  <div>
                    <h3 
                      onClick={() => onNavigateToStore?.(b.storeId)}
                      className="font-bold text-slate-900 text-sm leading-tight hover:text-indigo-600 transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span>{b.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{b.legalTitle}</p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{b.eta}</span>
                    <span>•</span>
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{b.address}</span>
                  </div>

                  {/* Örnek Hizmet / Ürün */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">Öne Çıkan Ürün / Hizmet:</span>
                    <span className="text-xs font-bold text-slate-800 block truncate mt-0.5">{b.popularItem}</span>
                    <div className="flex items-baseline justify-between mt-1.5">
                      <span className="text-sm font-black text-indigo-950">
                        {b.price.toLocaleString('tr-TR')} ₺
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium border border-emerald-200">
                        {b.posProvider}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dükkân Doğrudan İletişim & Aksiyon Barı */}
              <div className="p-4 pt-0 space-y-2">
                <div className="flex gap-2">
                  <a 
                    href={`tel:${b.phone}`} 
                    className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" /> Ara
                  </a>
                  <a 
                    href={`https://wa.me/${b.whatsapp}?text=Merhaba, tampazar.com üzerinden ${b.popularItem} hakkında bilgi almak istiyorum.`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                </div>

                <button 
                  onClick={() => handleActionClick(b)}
                  className={`w-full py-2.5 rounded-xl text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${b.actionColor}`}
                >
                  <span>{b.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredBusinesses.length === 0 && (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <Search className="w-10 h-10 mx-auto text-slate-300" />
            <h3 className="font-bold text-slate-700 text-base">Aramanıza uygun esnaf veya hizmet bulunamadı</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Farklı bir anahtar kelime deneyebilir veya sektör filtrelerini temizleyebilirsiniz.
            </p>
            <button 
              onClick={() => { setSelectedSector('all'); setSearchQuery(''); }}
              className="px-4 py-2 bg-indigo-900 text-white text-xs font-bold rounded-xl"
            >
              Tüm Esnafları Göster
            </button>
          </div>
        )}
      </main>

      {/* Direct Order & Dispatch Modal */}
      {activeModalBusiness && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold">
                    {activeModalBusiness.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{activeModalBusiness.name}</h3>
                    <p className="text-xs text-slate-400">{activeModalBusiness.badge}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveModalBusiness(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {modalConfirmed ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-2 text-emerald-900">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto animate-bounce" />
                  <h4 className="font-black text-base">İşlem Başarıyla Başlatıldı!</h4>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    {activeModalBusiness.sector === 'emergency' 
                      ? 'Nöbetçi çekiciye anlık GPS konumunuz iletildi. 15 dakika içinde olay yerinde olacaktır.' 
                      : activeModalBusiness.sector === 'food'
                      ? 'Döner siparişiniz mutfağa iletildi. Kendi Sanal POS ile doğrudan tahsilat gerçekleşti.'
                      : 'Tesisatçı usta çağrınız alındı. Fatura UBL-TR 2.1 e-Arşiv kuyruğuna yazıldı.'}
                  </p>
                  <div className="text-[11px] font-mono text-emerald-800 bg-emerald-100/60 py-1 px-2 rounded mt-2">
                    Tahsilat: {activeModalBusiness.posProvider} · %0 Komisyon
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Seçilen İşlem:</span>
                      <span className="font-bold text-slate-900">{activeModalBusiness.popularItem}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Adres / Lokasyon:</span>
                      <span className="font-semibold text-slate-700">{activeModalBusiness.address}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Varış / Teslimat Süresi:</span>
                      <span className="font-bold text-amber-600">{activeModalBusiness.eta}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                      <span>Ödenecek Tutar:</span>
                      <span className="text-indigo-900">{activeModalBusiness.price.toLocaleString('tr-TR')} ₺</span>
                    </div>
                  </div>

                  <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 text-[11px] text-indigo-900 space-y-1">
                    <span className="font-bold block flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-700" /> Doğrudan Esnaf Tahsilatı (BYO POS)
                    </span>
                    <p className="text-indigo-700 leading-tight">
                      Ödemeniz tampazar.com havuzuna değil, doğrudan <strong>{activeModalBusiness.name}</strong> firmasının <strong>{activeModalBusiness.posProvider}</strong> hesabına geçer.
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <a
                      href={`tel:${activeModalBusiness.phone}`}
                      className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-4 h-4" /> Telefon Aç
                    </a>
                    <button
                      onClick={handleExecuteDirectTransaction}
                      className={`flex-1 py-3 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer ${activeModalBusiness.actionColor}`}
                    >
                      <Navigation className="w-4 h-4" />
                      <span>{activeModalBusiness.actionText}</span>
                    </button>
                  </div>
                </>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
