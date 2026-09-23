/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, ShoppingBag, ShieldCheck, Zap, 
  Store, Briefcase, ChevronRight, Star, SlidersHorizontal, 
  X, Check, ArrowRight, Layers, Calendar, Clock, MapPin, Sparkles, Filter
} from 'lucide-react';
import { Tenant, Product, initialTenants, initialProducts } from '../data/mockData';

interface MarketplaceHomeProps {
  onNavigateToStore?: (storeId: string) => void;
  onOpenSellerDashboard?: (tab?: string) => void;
  onNavigateToSuperMall?: () => void;
}

export default function MarketplaceHome({ onNavigateToStore, onOpenSellerDashboard, onNavigateToSuperMall }: MarketplaceHomeProps) {
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
  
  // Cart State
  const [cart, setCart] = useState<{ product: Product; qty: number; variant?: string; slot?: string }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Active Product Modal (Detail & Quick Action)
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [modalQty, setModalQty] = useState(1);
  const [modalSize, setModalSize] = useState('');
  const [modalColor, setModalColor] = useState('');
  const [modalSlot, setModalSlot] = useState('');

  // Featured Stores for the Etsy-Style section
  const featuredStores = tenants.slice(0, 3);

  // Filter products based on search and type
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

    return matchesSearch && matchesScope && matchesTypeFilter;
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

    // Simulate instant BYO POS charge & e-Invoice generation
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
        orderId: 'ord-' + Math.floor(Math.random() * 1000000),
        tenantId: item.product.tenantId,
        customerName: 'Pazaryeri Müşterisi (Web Siparişi)',
        customerTaxOffice: 'Kadıköy VD',
        customerTaxId: '1049204910',
        customerEmail: 'musteri@tampazar.com',
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-950">
      
      {/* 1. ÜST HEADER: Amazon Arama Gücü + Trendyol Akıcılığı */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <a href="/" className="flex items-center gap-2 py-1 select-none" onClick={(e) => { e.preventDefault(); setSelectedScope('all'); setSelectedTypeFilter('all'); setSearchQuery(''); }}>
            <div className="flex items-center gap-2">
              {/* Turuncu TP İkonu */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-[#FF6A00] tracking-tighter leading-none">TP</span>
                <div className="w-8 h-1.5 bg-[#FF6A00] rounded-full -mt-0.5" style={{ borderRadius: '0 0 10px 10px' }}></div>
              </div>
              {/* TamPazar Tipografisi */}
              <div className="flex items-center text-3xl font-extrabold tracking-tight">
                <span className="text-[#0B132B]">Tam</span>
                <span className="text-[#FF6A00]">Pazar</span>
              </div>
            </div>
          </a>

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
                placeholder="Milyonlarca ürün, toptan hammadde veya kurumsal hizmet ara..."
                className="w-full px-4 py-2.5 text-sm outline-none bg-transparent placeholder:text-slate-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="px-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button className="bg-indigo-900 hover:bg-indigo-800 text-white px-6 flex items-center justify-center transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sağ Eylemler */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onOpenSellerDashboard?.('byopos')}
              className="hidden lg:flex flex-col text-right text-xs group cursor-pointer"
            >
              <span className="font-bold text-amber-600 group-hover:text-amber-700 transition-colors">%0 Komisyonla Satış Yap</span>
              <span className="text-slate-500">Mağazanı Aç & POS'unu Bağla</span>
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-indigo-900" />
              <span>Sepet</span>
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-indigo-950 font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 2. TRENDYOL TARZI HIZLI KAMPANYA VE KATEGORİ BANTLARI */}
      <section className="bg-indigo-950 text-white py-3 border-b border-indigo-900">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-medium overflow-x-auto gap-6 scrollbar-none">
          <span className="flex items-center gap-1.5 text-amber-400 whitespace-nowrap">
            <Zap className="w-4 h-4 fill-amber-400" /> Komisyonsuz Doğrudan Satıcı Fiyatları
          </span>
          <span className="flex items-center gap-1.5 whitespace-nowrap text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Mağaza Onaylı Doğrudan POS Tahsilatı
          </span>
          <span className="flex items-center gap-1.5 whitespace-nowrap text-slate-300">
            <Briefcase className="w-4 h-4 text-sky-400" /> Kurumsal Şirketlere Anında E-Fatura & Tevkifat
          </span>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12 flex-1 w-full">
        
        {/* Quick Type Filter Pill Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5" /> Hızlı Filtre:
          </span>
          {[
            { key: 'all', label: 'Tüm Vitrin' },
            { key: 'retail', label: '🛍️ Perakende Ürünler' },
            { key: 'wholesale', label: '📦 Toptan / B2B Koli' },
            { key: 'service', label: '💆 Hizmet & Randevu' }
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setSelectedTypeFilter(f.key as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedTypeFilter === f.key
                  ? 'bg-indigo-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* SÜPER AVM TANITIM BANDI (Dönerciden Çekiciye, Ayakkabıdan Tesisatçıya) */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 inline-block">
              Şehrin Komisyonsuz Açık Dijital AVM'si
            </span>
            <h3 className="text-xl md:text-2xl font-black text-white">
              Dönerciden Çekiciye, Ayakkabıdan Tesisatçıya Doğrudan Esnaf Çağrısı
            </h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Aracı komisyonu olmadan esnafı doğrudan telefonla arayın, WhatsApp'tan yazın ya da kendi Sanal POS'u ile anında ödeyin.
            </p>
          </div>
          <button
            onClick={onNavigateToSuperMall}
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-colors shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <span>Açık Dijital AVM'ye Gir</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3. ETSY TARZI ÖNE ÇIKAN MAĞAZA VE ATÖLYELER */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Öne Çıkan Bağımsız Mağazalar</h2>
              <p className="text-sm text-slate-500">Aracı komisyonu olmadan doğrudan üreticiden alışveriş yapın</p>
            </div>
            <button 
              onClick={() => onOpenSellerDashboard?.('catalog')}
              className="text-sm font-semibold text-indigo-700 flex items-center hover:underline cursor-pointer"
            >
              Tüm Mağazaları Keşfet <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredStores.map((store) => (
              <div 
                key={store.id} 
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="relative w-full h-36 bg-slate-100 overflow-hidden">
                  <img 
                    src={store.banner || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=80'} 
                    alt={store.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50/95 backdrop-blur-xs px-2 py-0.5 rounded shadow-xs">
                    {store.typeBadge || 'Doğrudan Üretici'}
                  </span>
                  <div className="absolute -bottom-4 right-4 w-10 h-10 rounded-full border-2 border-white shadow overflow-hidden bg-white flex items-center justify-center text-lg">
                    {store.logo}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between pt-5">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{store.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{store.category}</p>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      Kendi Sanal POS'u ile %0 komisyonsuz doğrudan faturalı satış yapmaktadır.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {store.rating || 4.9} ({store.reviews || 128} Değerlendirme)
                    </span>
                    <button 
                      onClick={() => onNavigateToStore ? onNavigateToStore(store.id) : onOpenSellerDashboard?.('catalog')}
                      className="font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                    >
                      Mağazayı İncele →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. HİBRİT ÜRÜN VİTRİNİ (Perakende + Toptan + Hizmet) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Günün Vitrin Ürünleri & Hizmetleri</h2>
              <p className="text-sm text-slate-500">Perakende sepet, toptan koli siparişi veya doğrudan hizmet randevusu</p>
            </div>
            <div className="flex gap-2">
              <span className="text-xs font-medium text-slate-500 self-center">
                {filteredProducts.length} adet listeleniyor
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((item) => (
              <div 
                key={item.id} 
                onClick={() => handleOpenProductModal(item)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col group cursor-pointer"
              >
                {/* Ürün Görseli & Rozet */}
                <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm text-white ${
                    item.type === 'wholesale' ? 'bg-indigo-600' :
                    item.type === 'service' ? 'bg-sky-600' : 'bg-emerald-600'
                  }`}>
                    {item.badge || (item.type === 'wholesale' ? 'B2B Toptan' : item.type === 'service' ? 'Hizmet & Randevu' : 'Perakende')}
                  </span>
                  <span className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
                    KDV %{item.vatRate}
                  </span>
                </div>

                {/* Ürün Detayları */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-xs text-slate-400 font-medium block mb-1">
                      {item.storeName || 'Yetkili Satıcı'}
                    </span>
                    <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Fiyat Alanı: Amazon Usulü Kademeli veya Standart */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="text-xl font-black text-slate-900">
                      {item.price.toLocaleString('tr-TR')} ₺
                    </div>
                    {item.tierPriceNote ? (
                      <p className="text-xs font-semibold text-indigo-600 mt-0.5">
                        {item.tierPriceNote}
                      </p>
                    ) : item.tieredPrices && item.tieredPrices.length > 0 ? (
                      <p className="text-xs font-semibold text-indigo-600 mt-0.5">
                        {item.tieredPrices[0].minQty}+ Adet: {item.tieredPrices[0].pricePerUnit.toLocaleString('tr-TR')} ₺/adet
                      </p>
                    ) : null}
                  </div>

                  {/* Aksiyon Butonu */}
                  <button 
                    onClick={(e) => handleQuickAdd(item, e)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-indigo-900 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    {item.type === 'service' ? 'Randevu / Teklif İste' : 
                     item.type === 'wholesale' ? 'Toptan Sipariş Ver' : 'Sepete Ekle'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 space-y-2">
              <Search className="w-8 h-8 mx-auto opacity-30 text-slate-600" />
              <p className="text-sm font-semibold text-slate-600">Aradığınız kriterlere uygun ürün veya hizmet bulunamadı.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedScope('all'); setSelectedTypeFilter('all'); }}
                className="text-xs text-indigo-600 font-bold underline"
              >
                Filtreleri Sıfırla
              </button>
            </div>
          )}
        </section>

      </main>

      {/* Product Interactive Modal (Quick View & Customized Purchase) */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Modal Image */}
            <div className="md:w-1/2 relative bg-slate-100 min-h-[220px]">
              <img 
                src={activeModalProduct.image} 
                alt={activeModalProduct.title} 
                className="w-full h-full object-cover"
              />
              <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full shadow text-white ${
                activeModalProduct.type === 'wholesale' ? 'bg-indigo-600' :
                activeModalProduct.type === 'service' ? 'bg-sky-600' : 'bg-emerald-600'
              }`}>
                {activeModalProduct.badge || activeModalProduct.type.toUpperCase()}
              </span>
            </div>

            {/* Modal Content */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs text-slate-400 font-mono">{activeModalProduct.storeName}</span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">{activeModalProduct.title}</h3>
                </div>
                <button 
                  onClick={() => setActiveModalProduct(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                {activeModalProduct.description}
              </p>

              {/* Retail Variants Selection */}
              {activeModalProduct.type === 'retail' && activeModalProduct.variants && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  {activeModalProduct.variants.sizes && (
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Beden / Ölçü Seçimi</span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeModalProduct.variants.sizes.map(s => (
                          <button
                            key={s}
                            onClick={() => setModalSize(s)}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                              modalSize === s ? 'bg-indigo-900 text-white border-indigo-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeModalProduct.variants.colors && (
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Renk</span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeModalProduct.variants.colors.map(c => (
                          <button
                            key={c}
                            onClick={() => setModalColor(c)}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                              modalColor === c ? 'bg-indigo-900 text-white border-indigo-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Wholesale Tiered Quantity */}
              {activeModalProduct.type === 'wholesale' && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-100 space-y-1 text-xs">
                    <span className="font-bold text-indigo-900 block">Kademeli B2B Fiyatlandırma</span>
                    {activeModalProduct.tieredPrices?.map((t, idx) => (
                      <div key={idx} className="flex justify-between text-slate-600 font-mono text-[11px]">
                        <span>{t.minQty}{t.maxQty ? `-${t.maxQty}` : '+'} Adet:</span>
                        <span className="font-bold text-indigo-700">{t.pricePerUnit.toLocaleString('tr-TR')} ₺/adet</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Sipariş Miktarı:</span>
                      <span className="text-indigo-900 font-bold">{modalQty} Adet</span>
                    </div>
                    <input 
                      type="range" 
                      min={activeModalProduct.moq || 1} 
                      max={150} 
                      value={modalQty}
                      onChange={(e) => setModalQty(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Min: {activeModalProduct.moq}</span>
                      <span>Mevcut Birim Fiyat: {getEffectiveUnitPrice(activeModalProduct, modalQty)} ₺</span>
                      <span>Max: 150</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Service Slot Booking */}
              {activeModalProduct.type === 'service' && activeModalProduct.bookingSlots && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-sky-600" /> {activeModalProduct.durationMin} Dk
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-sky-600" /> {activeModalProduct.serviceAreaRadiusKm} KM Hizmet Alanı
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Uygun Randevu Saatleri</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {activeModalProduct.bookingSlots.map(s => (
                        <button
                          key={s}
                          onClick={() => setModalSlot(s)}
                          className={`py-1.5 px-2 text-center text-xs font-mono rounded-lg border transition-colors ${
                            modalSlot === s ? 'bg-sky-600 text-white border-sky-600 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Price & Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Toplam Fiyat</span>
                  <span className="text-xl font-black text-slate-900 font-mono">
                    {(getEffectiveUnitPrice(activeModalProduct, modalQty) * modalQty).toLocaleString('tr-TR')} ₺
                  </span>
                </div>

                <button
                  onClick={handleAddToCartFromModal}
                  className="flex-1 py-3 px-4 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Sepete Ekle
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Shopping Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex justify-end animate-fade-in">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between p-6">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-900" />
                <h3 className="font-bold text-slate-900 text-base">Alışveriş Sepeti</h3>
                <span className="bg-indigo-50 text-indigo-900 text-xs px-2 py-0.5 rounded-full font-bold">
                  {cart.length} Ürün
                </span>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cart.map((item, idx) => {
                const unit = getEffectiveUnitPrice(item.product, item.qty);
                return (
                  <div key={idx} className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 items-center">
                    <img 
                      src={item.product.image} 
                      alt={item.product.title} 
                      className="w-14 h-14 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{item.product.title}</h4>
                      <p className="text-[10px] text-slate-400">{item.product.storeName}</p>
                      {item.variant && (
                        <p className="text-[10px] text-indigo-600 font-medium">{item.variant}</p>
                      )}
                      {item.slot && (
                        <p className="text-[10px] text-sky-600 font-mono">Randevu: {item.slot}</p>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-mono font-bold text-slate-900">
                          {item.qty} x {unit.toLocaleString('tr-TR')} ₺
                        </span>
                        <span className="text-xs font-mono font-bold text-indigo-950">
                          {(unit * item.qty).toLocaleString('tr-TR')} ₺
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemoveFromCart(idx)}
                      className="text-slate-400 hover:text-red-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}

              {cart.length === 0 && (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <ShoppingBag className="w-12 h-12 mx-auto opacity-30 text-slate-400" />
                  <p className="text-sm">Sepetiniz şu anda boş.</p>
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="border-t border-slate-100 pt-4 space-y-3">
                {checkoutSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-center space-y-1">
                    <div className="font-bold text-sm">✓ Sipariş ve Tahsilat Tamamlandı!</div>
                    <p className="text-xs">
                      Satıcının Kendi Sanal POS'u üzerinden çekim yapıldı. GİB e-Fatura oluşturuldu.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-slate-500">
                        <span>Platform Komisyonu:</span>
                        <span className="text-emerald-600 font-bold">%0 (Sıfır Komisyon)</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Doğrudan POS Tahsilatı:</span>
                        <span className="font-bold text-slate-700">Satıcı Hesabına Doğrudan</span>
                      </div>
                      <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-100">
                        <span>Toplam Tutar:</span>
                        <span className="font-mono">{calculateCartTotal().toLocaleString('tr-TR')} ₺</span>
                      </div>
                    </div>

                    <button
                      onClick={handleExecuteCheckout}
                      className="w-full py-3.5 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      <span>Güvenli Ödeme Yap (BYO POS)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
