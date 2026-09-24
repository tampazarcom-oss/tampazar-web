/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, ShoppingBag, ShieldCheck, Zap, 
  Store, Briefcase, ChevronRight, Star, SlidersHorizontal, 
  X, Check, ArrowRight, Layers, Calendar, Clock, MapPin, Sparkles, Filter, Heart, ChevronLeft, Tag, Percent,
  Truck, Bike, Wrench
} from 'lucide-react';
import { Tenant, Product, initialTenants, initialProducts } from '../data/mockData';
import { HybridOrder, playOrderAlertChime } from '../data/hybridCommerceData';
import { useAuth } from '../context/AuthContext';
import BrandLogo from './BrandLogo';
import GlobalUserNav from './GlobalUserNav';
import TamTeklifWizardModal from './TamTeklifWizardModal';

interface MarketplaceHomeProps {
  onNavigateToStore?: (storeId: string) => void;
  onOpenSellerDashboard?: (tab?: string) => void;
  onNavigateToSuperMall?: () => void;
  onNavigateToProduct?: (slug: string) => void;
}

export default function MarketplaceHome({ onNavigateToStore, onOpenSellerDashboard, onNavigateToSuperMall, onNavigateToProduct }: MarketplaceHomeProps) {
  const [tenants] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem('tampazar_tenants');
    return saved ? JSON.parse(saved) : initialTenants;
  });

  const [products] = useState<Product[]>(() => {
    const saved = localStorage.getItem('tampazar_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScope, setSelectedScope] = useState<'all' | 'retail' | 'wholesale' | 'service' | 'stores'>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'all' | 'retail' | 'wholesale' | 'service'>('all');
  const [activeStoryFilter, setActiveStoryFilter] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // TamTeklif Wizard State
  const [isTamTeklifModalOpen, setIsTamTeklifModalOpen] = useState(false);
  const [tamTeklifCategory, setTamTeklifCategory] = useState<string | undefined>(undefined);

  // Cart State
  const [cart, setCart] = useState<{ product: Product; qty: number; variant?: string; slot?: string }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Active Product Modal (Detail & Quick Action)
  const { user } = useAuth();
  const [selectedDeliveryType, setSelectedDeliveryType] = useState<'CARGO' | 'LOCAL_EXPRESS' | 'FIELD_SERVICE'>('CARGO');
  const [deliveryAddress, setDeliveryAddress] = useState('Moda Cad. No:44 Kadıköy / İstanbul');
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [modalQty, setModalQty] = useState(1);
  const [modalSize, setModalSize] = useState('');
  const [modalColor, setModalColor] = useState('');
  const [modalSlot, setModalSlot] = useState('');

  // Carousel ref for "Sana Özel Önerilen Ürünler"
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const toggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  // Body scroll lock when cart drawer or product modal is open
  useEffect(() => {
    if (isCartOpen || activeModalProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen, activeModalProduct]);

  // Filter products based on search, scope, type filter, and story filter
  const filteredProducts = products.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.storeName && item.storeName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesScope = 
      selectedScope === 'all' ||
      (selectedScope === 'retail' && item.type === 'retail') ||
      (selectedScope === 'wholesale' && item.type === 'wholesale') ||
      (selectedScope === 'service' && item.type === 'service');

    const matchesTypeFilter = 
      selectedTypeFilter === 'all' ||
      item.type === selectedTypeFilter;

    let matchesStory = true;
    if (activeStoryFilter === 'fiyati-dusenler') {
      matchesStory = item.price < 2000;
    } else if (activeStoryFilter === 'yemek-lezzetler') {
      matchesStory = item.category.includes('Gıda') || item.category.includes('Yemek');
    } else if (activeStoryFilter === 'esnaf-butik') {
      matchesStory = item.type === 'retail' || Boolean(item.badge?.includes('Zanaat'));
    } else if (activeStoryFilter === 'kargo-bedava') {
      matchesStory = Boolean(item.badge?.includes('Kargo')) || item.price > 1000;
    }

    return matchesSearch && matchesScope && matchesTypeFilter && matchesStory;
  });

  const handleOpenProductModal = (product: Product) => {
    setActiveModalProduct(product);
    setModalQty(product.moq || 1);
    setModalSize(product.variants?.sizes?.[0] || '');
    setModalColor(product.variants?.colors?.[0] || '');
    setModalSlot(product.bookingSlots?.[0] || '');
  };

  const getEffectiveUnitPrice = (prod: Product, qty: number): number => {
    if (prod.type !== 'wholesale' || !prod.tieredPrices) return prod.price;
    const tier = prod.tieredPrices.find(t => qty >= t.minQty && (t.maxQty === null || qty <= t.maxQty));
    return tier ? tier.pricePerUnit : prod.price;
  };

  const handleAddToCartFromModal = () => {
    if (!activeModalProduct) return;
    const item = {
      product: activeModalProduct,
      qty: modalQty,
      variant: [modalSize, modalColor].filter(Boolean).join(' - ') || undefined,
      slot: modalSlot || undefined
    };
    setCart([...cart, item]);
    setActiveModalProduct(null);
    setIsCartOpen(true);
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.type === 'wholesale' || product.type === 'service' || (product.variants && product.variants.sizes?.length)) {
      handleOpenProductModal(product);
    } else {
      setCart([...cart, { product, qty: 1 }]);
      setIsCartOpen(true);
    }
  };

  const handleRemoveFromCart = (index: number) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const calculateCartTotal = () => {
    return cart.reduce((total, item) => {
      const unit = getEffectiveUnitPrice(item.product, item.qty);
      return total + (unit * item.qty);
    }, 0);
  };

  const handleExecuteCheckout = () => {
    if (cart.length === 0) return;

    const orderNumber = 'ORD-2026-' + Math.floor(100000 + Math.random() * 900000);
    const totalOrderAmount = calculateCartTotal();

    // 1. GİB e-Fatura Kayıtları
    const savedInvoices = localStorage.getItem('tampazar_invoices');
    const invoices = savedInvoices ? JSON.parse(savedInvoices) : [];

    cart.forEach(item => {
      const unit = getEffectiveUnitPrice(item.product, item.qty);
      const lineTotal = unit * item.qty;
      const vat = parseFloat(((lineTotal * (item.product.vatRate / 100))).toFixed(2));
      const clean = parseFloat((lineTotal - vat).toFixed(2));

      const newInv = {
        id: 'inv-' + Math.floor(Math.random() * 1000000),
        invoiceNumber: 'GIB2026000000' + Math.floor(100 + Math.random() * 899),
        orderId: orderNumber,
        tenantId: item.product.tenantId,
        customerName: user?.name || 'Pazaryeri Müşterisi',
        customerTaxOffice: 'Kadıköy VD',
        customerTaxId: user?.taxId || '1049204910',
        customerEmail: user?.email || 'musteri@tampazar.com',
        date: new Date().toISOString().split('T')[0],
        amount: clean,
        vatAmount: vat,
        withholdingTaxType: 'None',
        withholdingAmount: 0.00,
        totalPayable: lineTotal,
        status: 'queued',
        integrator: 'gib'
      };
      invoices.push(newInv);
    });

    // 2. Üçlü Hibrit Sipariş Kaydı (Ulusal Kargo, Yerel Express veya Saha Servisi)
    const newHybridOrder: HybridOrder = {
      id: 'hyb-' + Date.now(),
      orderNumber,
      tenantId: cart[0]?.product.tenantId || 's3',
      storeName: cart[0]?.product.storeName || 'TamPazar Esnafı',
      customerName: user?.name || 'Müşteri (Web)',
      customerPhone: user?.phone || '0532 555 44 33',
      customerAddress: deliveryAddress,
      city: 'İstanbul',
      district: 'Kadıköy',
      deliveryType: selectedDeliveryType,
      status: selectedDeliveryType === 'LOCAL_EXPRESS' ? 'RINGING' : selectedDeliveryType === 'FIELD_SERVICE' ? 'NEW' : 'DISPATCH_WAITING',
      items: cart.map(c => ({
        productId: c.product.id,
        title: c.product.title,
        qty: c.qty,
        price: getEffectiveUnitPrice(c.product, c.qty),
        sku: c.product.sku,
        variant: c.variant
      })),
      totalAmount: totalOrderAmount,
      paymentMethod: 'PAYTR_POS',
      paymentStatus: 'PAID',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      cargoDetails: selectedDeliveryType === 'CARGO' ? {
        carrier: 'Yurtiçi Kargo',
        trackingNumber: '',
        barcode: 'YK-' + Math.floor(100000000 + Math.random() * 900000000),
        despatchNumber: 'IRS-2026-' + Math.floor(10000 + Math.random() * 90000)
      } : undefined,
      localDeliveryDetails: selectedDeliveryType === 'LOCAL_EXPRESS' ? {
        deliverySubtype: 'COURIER_30MIN',
        etaMinutes: 30,
        courierName: 'Kurye Caner (TamPazar Express)',
        courierPhone: '0533 111 22 33',
        preparationStartedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
      } : undefined,
      serviceDetails: selectedDeliveryType === 'FIELD_SERVICE' ? {
        serviceCategory: 'Saha Servisi',
        scheduledTime: 'Bugün 14:00 - 16:00',
        technicianName: 'Saha Ustası Hasan Usta',
        technicianPhone: '0535 777 88 99',
        isEmergency: true,
        issueDescription: 'Web üzerinden konum servis talebi oluşturuldu.'
      } : undefined
    };

    try {
      const savedHybrid = localStorage.getItem('tampazar_hybrid_orders');
      const hybridList: HybridOrder[] = savedHybrid ? JSON.parse(savedHybrid) : [];
      hybridList.unshift(newHybridOrder);
      localStorage.setItem('tampazar_hybrid_orders', JSON.stringify(hybridList));
    } catch (e) {}

    // Yerel sipariş ise esnaf sesli zilini anında çal
    if (selectedDeliveryType === 'LOCAL_EXPRESS') {
      playOrderAlertChime();
    }

    localStorage.setItem('tampazar_invoices', JSON.stringify(invoices));
    window.dispatchEvent(new Event('tampazar_accounting_updated'));
    window.dispatchEvent(new Event('tampazar_invoice_added'));

    setCheckoutSuccess(true);
    setTimeout(() => {
      setCart([]);
      setCheckoutSuccess(false);
      setIsCartOpen(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-950">
      
      {/* 1. ÜST HEADER: Hızlı Arama & TamPazar Akıcılığı */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-6">
          
          <BrandLogo 
            size="lg" 
            onClick={() => { 
              setSelectedScope('all'); 
              setSelectedTypeFilter('all'); 
              setActiveStoryFilter(null);
              setSearchQuery(''); 
              setActiveModalProduct(null); 
              setIsCartOpen(false); 
            }} 
          />

          {/* Akıllı Hibrit Arama Çubuğu */}
          <div className="flex-1 max-w-2xl relative">
            <div className="flex rounded-xl border-2 border-indigo-900/15 focus-within:border-indigo-600 overflow-hidden bg-white shadow-inner transition-colors">
              <select 
                value={selectedScope}
                onChange={(e) => setSelectedScope(e.target.value as any)}
                className="bg-slate-50 px-3 text-xs font-semibold text-slate-600 border-r border-slate-200 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <option value="all">Tüm Pazar</option>
                <option value="retail">Perakende</option>
                <option value="wholesale">Toptan (B2B)</option>
                <option value="service">Hizmet & Rezervasyon</option>
                <option value="stores">Doğrudan Mağazalar</option>
              </select>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Aradığınız ürün, zanaatkâr esnaf veya hizmeti yazın..."
                className="w-full px-4 py-2.5 text-sm outline-none bg-transparent placeholder:text-slate-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="px-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button className="bg-indigo-900 hover:bg-indigo-800 text-white px-6 flex items-center justify-center transition-colors cursor-pointer">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sağ Eylemler */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setTamTeklifCategory(undefined);
                setIsTamTeklifModalOpen(true);
              }}
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 px-3.5 py-2.5 rounded-xl font-black text-xs transition-all transform hover:scale-102 cursor-pointer shadow-xs border border-amber-300"
            >
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              <span>Ücretsiz Fiyat Teklifi Al</span>
              <span className="bg-slate-950 text-amber-300 text-[9px] font-mono px-1 rounded uppercase">TamTeklif</span>
            </button>

            <GlobalUserNav />

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-indigo-900" />
              <span className="hidden sm:inline">Sepet</span>
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-indigo-950 font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 2. ÜST HIZLI KAMPANYA VE KATEGORİ HİKAYELERİ (STORY BAR) */}
      <div className="bg-white border-b border-slate-200 shadow-xs py-3.5">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 overflow-x-auto scrollbar-none">
          {[
            { id: null, label: 'Ürünleri Keşfet', icon: Sparkles, color: 'bg-indigo-50 text-indigo-900 border-indigo-200' },
            { id: 'fiyati-dusenler', label: 'Fiyatı Düşenler', icon: Percent, color: 'bg-rose-50 text-rose-700 border-rose-200' },
            { id: 'yemek-lezzetler', label: 'Yemek & Yerel Lezzetler', icon: Zap, color: 'bg-amber-50 text-amber-800 border-amber-200' },
            { id: 'esnaf-butik', label: 'Esnaf Sanat & Butik', icon: Store, color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
            { id: 'kargo-bedava', label: 'Kargo Bedava', icon: ShieldCheck, color: 'bg-sky-50 text-sky-800 border-sky-200' },
            { id: 'kuponlar', label: 'İndirim Kuponları', icon: Tag, color: 'bg-purple-50 text-purple-800 border-purple-200' },
          ].map(story => {
            const Icon = story.icon;
            const isActive = activeStoryFilter === story.id;
            return (
              <button
                key={story.id || 'all'}
                onClick={() => {
                  if (story.id === 'kuponlar') {
                    alert('TamPazar 250 TL Esnaf İndirim Kuponu Hesabınıza Tanımlandı: TAMPZ250');
                  } else {
                    setActiveStoryFilter(story.id);
                  }
                }}
                className={`flex flex-col items-center gap-1.5 min-w-[88px] group cursor-pointer transition-transform hover:scale-105`}
              >
                <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center shadow-xs transition-all ${
                  isActive ? 'border-indigo-900 bg-indigo-900 text-white shadow-md' : `${story.color} group-hover:border-indigo-400`
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-[11px] font-bold text-center whitespace-nowrap ${isActive ? 'text-indigo-900' : 'text-slate-700'}`}>
                  {story.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12 flex-1 w-full">
        
        {/* 3. BUGÜNÜN FIRSAT KAMPANYALARI BANNERI */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 text-white p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 uppercase tracking-widest shadow">
              <Zap className="w-3.5 h-3.5 fill-slate-950" /> Esnaf Fırsat Haftası
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              Aracı Komisyonu Yok, Doğrudan Esnaf Fiyatı Var!
            </h1>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Milyonlarca ürünü ve yerel esnaf hizmetini %0 komisyonla doğrudan üreticiden veya ustadan sepetinize ekleyin. GİB e-Fatura garantisiyle hemen alışverişe başlayın.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button 
                onClick={() => { setSelectedTypeFilter('retail'); }}
                className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition cursor-pointer"
              >
                Perakende Ürünleri İncele →
              </button>
              <button 
                onClick={() => {
                  setTamTeklifCategory(undefined);
                  setIsTamTeklifModalOpen(true);
                }}
                className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-lg transition cursor-pointer flex items-center gap-2 border border-emerald-400/30"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Ücretsiz Fiyat Teklifi Al (TamTeklif)</span>
              </button>
              <button 
                onClick={() => onNavigateToSuperMall?.()}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition cursor-pointer"
              >
                Şehrin Açık AVM'sini Gez
              </button>
            </div>
          </div>
          <div className="w-full md:w-auto shrink-0 text-center">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 block font-bold">Anlık Aktif Esnaf</span>
              <span className="text-4xl font-black">2.095 Dükkân</span>
              <span className="text-xs text-slate-300 block">7/24 Doğrudan İletişim & POS</span>
            </div>
          </div>
        </div>

        {/* 4. İNDİRİM ORANLARINA GÖRE KEŞFET KUTULARI */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Percent className="w-5 h-5 text-rose-600" /> İndirim Oranlarına Göre Keşfet
            </h2>
            <span className="text-xs text-slate-500">Sınırlı Süreli Fırsatlar</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { discount: '%10 İndirim', label: 'Seçili Ayakkabı & Giyim', code: 'TAMPZ10', color: 'from-amber-500 to-amber-600' },
              { discount: '%20 İndirim', label: 'Zanaatkâr Mobilya & Dekor', code: 'TAMPZ20', color: 'from-indigo-600 to-indigo-800' },
              { discount: '%35 İndirim', label: 'Toptan Koli & Ambalaj', code: 'TAMPZ35', color: 'from-emerald-600 to-teal-700' },
              { discount: '%50 ve Üzeri', label: 'Büyük Esnaf Tasfiye Sezonu', code: 'TAMPZ50', color: 'from-rose-600 to-pink-700' },
            ].map((box, idx) => (
              <div 
                key={idx}
                onClick={() => alert(`İndirim Kuponu Kopyalandı: ${box.code} (${box.label} için geçerlidir)`)}
                className={`bg-gradient-to-br ${box.color} text-white p-5 rounded-2xl shadow-md cursor-pointer hover:scale-[1.02] transition-transform flex flex-col justify-between h-36`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black tracking-tight">{box.discount}</span>
                  <Tag className="w-5 h-5 opacity-80" />
                </div>
                <div>
                  <span className="text-xs font-bold block leading-snug">{box.label}</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md mt-2 inline-block font-mono">Kupon: {box.code}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. SANA ÖZEL ÖNERİLEN ÜRÜNLER (CAROUSEL) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Sana Özel Önerilen Ürünler & Hizmetler
            </h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => scrollCarousel('left')} 
                className="w-9 h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-100 transition cursor-pointer shadow-xs"
              >
                <ChevronLeft className="w-5 h-5 text-slate-700" />
              </button>
              <button 
                onClick={() => scrollCarousel('right')} 
                className="w-9 h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-100 transition cursor-pointer shadow-xs"
              >
                <ChevronRight className="w-5 h-5 text-slate-700" />
              </button>
            </div>
          </div>

          <div 
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto scrollbar-none pb-4 pt-1 snap-x scroll-smooth"
          >
            {products.slice(0, 6).map((product) => {
              const oldPrice = Math.round(product.price * 1.25);
              const discountPercent = 20;
              const isFav = favorites.includes(product.id);

              return (
                <div
                  key={product.id}
                  onClick={() => onNavigateToProduct?.(product.slug)}
                  className="min-w-[260px] max-w-[260px] bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer snap-start group overflow-hidden"
                >
                  <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 px-2.5 py-1 rounded-lg font-black text-[10px] shadow">
                      {product.badge || 'Kargo Bedava'}
                    </div>

                    <button 
                      onClick={(e) => toggleFavorite(product.id, e)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow hover:bg-white transition cursor-pointer"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'text-rose-600 fill-rose-600' : 'text-slate-600'}`} />
                    </button>

                    <div className="absolute bottom-2 left-2 bg-rose-600 text-white px-2 py-0.5 rounded-md font-bold text-[10px]">
                      %{discountPercent} İndirim
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide block">
                        {product.storeName || 'TamPazar Esnafı'}
                      </span>
                      <h3 className="text-xs font-bold text-slate-800 line-clamp-2 leading-relaxed group-hover:text-indigo-900">
                        {product.title}
                      </h3>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="text-slate-800">{product.rating || 4.8}</span>
                        <span className="text-slate-400 font-normal">({product.salesCount || 42})</span>
                      </div>

                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 line-through block">₺{oldPrice.toLocaleString('tr-TR')}</span>
                          <span className="text-lg font-black text-slate-900">₺{product.price.toLocaleString('tr-TR')}</span>
                        </div>
                        <button
                          onClick={(e) => handleQuickAdd(product, e)}
                          className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer shadow-xs flex items-center gap-1"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> Ekle
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. TÜM ÜRÜNLER / SONSUZ LİSTE (TRENDYOL ÜRÜN GRID) */}
        <div className="space-y-6 pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Tüm Ürünler & Esnaf Vitrini</h2>
              <p className="text-xs text-slate-500">Toplam {filteredProducts.length} ürün ve hizmet listeleniyor</p>
            </div>

            {/* Hızlı Filtre Butonları */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              {[
                { key: 'all', label: 'Tümü' },
                { key: 'retail', label: '🛍️ Perakende' },
                { key: 'wholesale', label: '📦 Toptan' },
                { key: 'service', label: '💆 Hizmet' }
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setSelectedTypeFilter(f.key as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedTypeFilter === f.key
                      ? 'bg-indigo-900 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* KAPALI DEVRE FİYAT TEKLİFİ TOPLAMA BANNERI (TAMTEKLİF) */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-start gap-4 relative z-10">
              <div className="p-3.5 bg-amber-400 text-slate-950 rounded-2xl shrink-0 font-black shadow-md">
                <Sparkles className="w-6 h-6 fill-slate-950" />
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                    Kapalı Teklif Sistemi · TamTeklif
                  </span>
                  <span className="text-[10px] text-slate-300 font-bold">%0 Komisyon · Esnaflar Birbirini Göremez</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  Özel Hizmet, Oto Kurtarma, Usta ya da Toptan Ürün Teklifi mi Lazım?
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  İhtiyacınızı ve konumunuzu 1 dakikada belirtin. Bölgenizdeki onaylı esnaflar gizli tekliflerini iletsin, fiyatları karşılaştırıp en uygun olanı tek tıkla seçin.
                </p>
              </div>
            </div>

            <div className="relative z-10 shrink-0 flex flex-col sm:flex-row md:flex-col gap-2">
              <button
                onClick={() => {
                  setTamTeklifCategory(undefined);
                  setIsTamTeklifModalOpen(true);
                }}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer transform hover:scale-102"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>Ücretsiz Fiyat Teklifi Al →</span>
              </button>
              <span className="text-[10px] text-slate-400 text-center font-medium">Ortalama 15 dk içinde ilk teklifler gelir</span>
            </div>
          </div>

          {/* Ürün Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
                !
              </div>
              <h3 className="text-base font-black text-slate-900">Aradığınız kriterde ürün veya hizmet bulunamadı</h3>
              <p className="text-xs text-slate-500">Lütfen arama teriminizi değiştirin veya filtreleri sıfırlayın.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedTypeFilter('all'); setSelectedScope('all'); setActiveStoryFilter(null); }}
                className="px-4 py-2 bg-indigo-900 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Filtreleri Temizle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const oldPrice = Math.round(product.price * 1.25);
                const isFav = favorites.includes(product.id);

                return (
                  <div
                    key={product.id}
                    onClick={() => onNavigateToProduct?.(product.slug)}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group overflow-hidden"
                  >
                    <div className="relative h-60 w-full bg-slate-100 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 px-2.5 py-1 rounded-lg font-black text-[10px] shadow">
                        {product.badge || 'Doğrudan Esnaf'}
                      </div>

                      <button 
                        onClick={(e) => toggleFavorite(product.id, e)}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow hover:bg-white transition cursor-pointer"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'text-rose-600 fill-rose-600' : 'text-slate-600'}`} />
                      </button>

                      <div className="absolute bottom-2 left-2 bg-emerald-600 text-white px-2 py-0.5 rounded-md font-bold text-[10px]">
                        Sepette İndirimli
                      </div>
                    </div>

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide block">
                          {product.storeName || 'TamPazar Mağazası'}
                        </span>
                        <h3 className="text-xs font-bold text-slate-800 line-clamp-2 leading-relaxed group-hover:text-indigo-900">
                          {product.title}
                        </h3>
                      </div>

                      <div className="space-y-2.5 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span className="text-slate-800">{product.rating || 4.8}</span>
                          <span className="text-slate-400 font-normal">({product.salesCount || 42} Değerlendirme)</span>
                        </div>

                        <div className="flex items-baseline justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 line-through block">₺{oldPrice.toLocaleString('tr-TR')}</span>
                            <span className="text-lg font-black text-slate-900">₺{product.price.toLocaleString('tr-TR')}</span>
                          </div>
                          <button
                            onClick={(e) => handleQuickAdd(product, e)}
                            className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer shadow-xs flex items-center gap-1"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" /> Ekle
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>

      {/* SEPET / ÇIKIŞ ÇEKMECE (DRAWER) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end animate-fade-in">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-900" />
                <h3 className="text-base font-black text-slate-900">Alışveriş Sepeti ({cart.length})</h3>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-20 space-y-3">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">Sepetiniz henüz boş</p>
                  <p className="text-xs text-slate-400">Esnaf vitrininden ürün veya hizmet ekleyin.</p>
                </div>
              ) : (
                cart.map((item, idx) => {
                  const unitPrice = getEffectiveUnitPrice(item.product, item.qty);
                  return (
                    <div key={idx} className="flex gap-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl items-center">
                      <img src={item.product.image} alt={item.product.title} className="w-16 h-16 object-cover rounded-xl shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 truncate">{item.product.title}</h4>
                        <span className="text-[10px] text-slate-500 block">{item.product.storeName}</span>
                        {item.variant && <span className="text-[10px] font-mono text-indigo-600 block">Varyant: {item.variant}</span>}
                        <span className="text-xs font-black text-slate-900 mt-1 block">₺{unitPrice.toLocaleString('tr-TR')} x {item.qty}</span>
                      </div>
                      <button 
                        onClick={() => handleRemoveFromCart(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-slate-200 space-y-4">
                
                {/* TESLİMAT MODELİ SEÇİMİ (3'lü Hibrit Mimari) */}
                <div className="space-y-2">
                  <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider block">
                    Teslimat & Servis Yöntemi Seçin:
                  </span>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {/* 1. Kargo */}
                    <button
                      type="button"
                      onClick={() => setSelectedDeliveryType('CARGO')}
                      className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition cursor-pointer ${
                        selectedDeliveryType === 'CARGO' 
                          ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20' 
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                      }`}
                    >
                      <Truck className={`w-4 h-4 mt-0.5 shrink-0 ${selectedDeliveryType === 'CARGO' ? 'text-indigo-600' : 'text-slate-500'}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-xs font-bold text-slate-900">Kargo ile Adrese Teslim</strong>
                          <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.2 rounded">Tüm Türkiye</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">Yurtiçi / Aras / MNG anlaşmalı kargo ile 1-2 iş gününde teslim.</p>
                      </div>
                    </button>

                    {/* 2. Yerel Express */}
                    <button
                      type="button"
                      onClick={() => setSelectedDeliveryType('LOCAL_EXPRESS')}
                      className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition cursor-pointer ${
                        selectedDeliveryType === 'LOCAL_EXPRESS' 
                          ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-400/20' 
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                      }`}
                    >
                      <Bike className={`w-4 h-4 mt-0.5 shrink-0 ${selectedDeliveryType === 'LOCAL_EXPRESS' ? 'text-amber-600' : 'text-slate-500'}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-xs font-bold text-slate-900">Mahallemden Hemen Getir</strong>
                          <span className="text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded animate-pulse">30-45 Dk</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">Esnaf masaüstü zili çalar; moto-kurye anında kapınıza getirir.</p>
                      </div>
                    </button>

                    {/* 3. Saha Servisi */}
                    <button
                      type="button"
                      onClick={() => setSelectedDeliveryType('FIELD_SERVICE')}
                      className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition cursor-pointer ${
                        selectedDeliveryType === 'FIELD_SERVICE' 
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20' 
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                      }`}
                    >
                      <Wrench className={`w-4 h-4 mt-0.5 shrink-0 ${selectedDeliveryType === 'FIELD_SERVICE' ? 'text-emerald-600' : 'text-slate-500'}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-xs font-bold text-slate-900">Hizmeti Konuma Çağır</strong>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">TamUsta</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">Usta harita konumuza yönlendirilir, randevulu veya acil servis verilir.</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Teslimat Adresi */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">Teslimat / Servis Adresi:</label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none font-medium text-slate-800"
                    placeholder="Açık adresinizi giriniz..."
                  />
                </div>

                <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-100">
                  <span className="text-slate-500 font-medium">Toplam Tutar:</span>
                  <span className="text-xl font-black text-slate-900">₺{calculateCartTotal().toLocaleString('tr-TR')}</span>
                </div>

                {checkoutSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    Sipariş başarıyla alındı! GİB e-Fatura oluşturuldu ve esnaf kasasına aktarıldı.
                  </div>
                )}

                <button
                  onClick={handleExecuteCheckout}
                  disabled={checkoutSuccess}
                  className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Doğrudan Esnaf POS ile Öde & Siparişi Tamamla
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* QUICK ADD MODAL (Varyant / Beden / Toptan Miktar) */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-6 relative">
            <button 
              onClick={() => setActiveModalProduct(null)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex gap-4 items-center">
              <img src={activeModalProduct.image} alt={activeModalProduct.title} className="w-20 h-20 object-cover rounded-2xl border" />
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{activeModalProduct.storeName}</span>
                <h3 className="text-base font-black text-slate-900 leading-snug">{activeModalProduct.title}</h3>
                <span className="text-lg font-black text-slate-900 block">₺{activeModalProduct.price.toLocaleString('tr-TR')}</span>
              </div>
            </div>

            {/* Beden / Varyant */}
            {activeModalProduct.variants?.sizes && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Seçenek / Beden:</span>
                <div className="flex flex-wrap gap-2">
                  {activeModalProduct.variants.sizes.map(s => (
                    <button
                      key={s}
                      onClick={() => setModalSize(s)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${modalSize === s ? 'bg-indigo-900 text-white border-indigo-900' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Miktar (Toptan MOQ) */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Sipariş Miktarı (Adet / Koli):</span>
              <div className="flex items-center gap-4">
                <input 
                  type="number"
                  min={activeModalProduct.moq || 1}
                  value={modalQty}
                  onChange={(e) => setModalQty(Math.max(activeModalProduct.moq || 1, parseInt(e.target.value) || 1))}
                  className="w-24 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-sm outline-none"
                />
                <span className="text-xs text-slate-500">
                  Birim Fiyat: <strong className="text-slate-900">₺{getEffectiveUnitPrice(activeModalProduct, modalQty).toLocaleString('tr-TR')}</strong>
                </span>
              </div>
            </div>

            <button
              onClick={handleAddToCartFromModal}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Sepete Ekle (₺{(getEffectiveUnitPrice(activeModalProduct, modalQty) * modalQty).toLocaleString('tr-TR')})
            </button>
          </div>
        </div>
      )}

      {/* 8. TAMTEKLİF SİHİRBAZI MODAL */}
      <TamTeklifWizardModal
        isOpen={isTamTeklifModalOpen}
        onClose={() => setIsTamTeklifModalOpen(false)}
        defaultCategoryId={tamTeklifCategory}
      />

    </div>
  );
}
