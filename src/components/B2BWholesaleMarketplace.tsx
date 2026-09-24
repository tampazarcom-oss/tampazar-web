/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Layers, Package, Truck, ShieldCheck, Store, Lock, Unlock,
  Search, Filter, CheckCircle2, ArrowRight, Plus, Minus,
  Building2, DollarSign, Sparkles, AlertCircle, ShoppingBag,
  ExternalLink, ChevronDown, Check, Tag, Eye, Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Product, initialProducts } from '../data/mockData';
import { 
  B2BWholesaleOrder, DropshipOrder, DropshippedProductMapping,
  getStoredB2BOrders, saveStoredB2BOrders,
  getStoredDropshipOrders, saveStoredDropshipOrders,
  getStoredDropshippedProducts, saveStoredDropshippedProducts
} from '../data/b2bDropshipData';
import { applyPageSEO } from '../utils/seo';

export default function B2BWholesaleMarketplace() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loginAsSeller, openAuthModal } = useAuth();
  const isSeller = isAuthenticated && user?.role === 'seller';

  // Products State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('tampazar_products');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        // Merge with initial products to make sure B2B mock items exist
        const ids = new Set(parsed.map(p => p.id));
        const missing = initialProducts.filter(p => !ids.has(p.id));
        return [...missing, ...parsed];
      }
      return initialProducts;
    } catch {
      return initialProducts;
    }
  });

  // Filter & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyDropshipEligible, setOnlyDropshipEligible] = useState<boolean>(false);

  // Wholesale Purchase Modal State
  const [purchaseModalProduct, setPurchaseModalProduct] = useState<Product | null>(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState<number>(5);
  const [paymentTerms, setPaymentTerms] = useState<'CARI_HESAP_30_GUN' | 'PESIN_HAVALE' | 'KREDI_KARTI_POS'>('CARI_HESAP_30_GUN');

  // Dropship Import Modal State
  const [dropshipModalProduct, setDropshipModalProduct] = useState<Product | null>(null);
  const [customRetailPrice, setCustomRetailPrice] = useState<number>(0);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // SEO configuration
  useEffect(() => {
    applyPageSEO({
      pathname: '/toptan',
      title: 'B2B Toptan Ticaret & Esnaftan Esnafa Dropshipping | TamPazar Tedarik Ağı',
      description: 'Kapalı devre B2B toptan pazaryeri. Merter tekstil serileri, Gedikpaşa ayakkabı kolileri, Karadeniz fındık çuvalları. %0 komisyonla doğrudan üreticiden toptan alın veya tek tıkla dropshipping yapın.',
      canonicalUrl: 'https://tampazar.com/toptan',
      ogType: 'website',
      keywords: ['toptan b2b', 'esnaf dropshipping', 'toptan tekstil merter', 'toptan ayakkabı gedikpaşa', 'faire türkiye', 'spocket b2b'],
      breadcrumbs: [
        { name: 'Ana Sayfa', url: 'https://tampazar.com/' },
        { name: 'B2B Toptan & Esnaf Ağı', url: 'https://tampazar.com/toptan' }
      ]
    });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filter B2B products
  const b2bProducts = products.filter(p => {
    // Include if type is wholesale or marked as B2B
    const isB2B = p.type === 'wholesale' || p.isB2BOnly || p.b2bWholesalePrice || p.allowDropshipping;
    if (!isB2B) return false;

    if (onlyDropshipEligible && !p.allowDropshipping) return false;

    if (selectedCategory !== 'all') {
      if (p.categorySlug !== selectedCategory && !p.category.toLowerCase().includes(selectedCategory)) {
        return false;
      }
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchStore = (p.storeName || '').toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      if (!matchTitle && !matchStore && !matchCat) return false;
    }

    return true;
  });

  // Handle open wholesale purchase modal
  const handleOpenPurchaseModal = (product: Product) => {
    if (!isSeller) {
      openAuthModal ? openAuthModal('seller') : loginAsSeller();
      return;
    }
    setPurchaseModalProduct(product);
    setPurchaseQuantity(product.b2bMinQty || 5);
  };

  // Execute Wholesale Order
  const handleExecuteWholesaleOrder = () => {
    if (!purchaseModalProduct) return;

    const unitPrice = getTierPrice(purchaseModalProduct, purchaseQuantity);
    const totalAmount = unitPrice * purchaseQuantity;
    const orderNo = 'B2B-2026-' + Math.floor(1000 + Math.random() * 9000);

    const newOrder: B2BWholesaleOrder = {
      id: 'b2b-' + Date.now(),
      orderNo,
      buyerTenantId: user?.storeId || 'tenant-buyer',
      buyerStoreName: user?.storeName || 'FotoSentez Butik Mağazası',
      buyerTaxNo: '3489102911',
      buyerContact: `${user?.name || 'Yetkili'} (0532 555 44 33)`,
      buyerCity: 'İstanbul / Kadıköy',
      sellerTenantId: purchaseModalProduct.tenantId,
      sellerStoreName: purchaseModalProduct.storeName || 'Toptancı İmalatçı',
      productId: purchaseModalProduct.id,
      productTitle: purchaseModalProduct.title,
      productImage: purchaseModalProduct.image,
      unitType: purchaseModalProduct.b2bUnitType || 'seri',
      quantity: purchaseQuantity,
      totalUnitsCount: purchaseQuantity * (purchaseModalProduct.b2bUnitType === 'seri' ? 6 : purchaseModalProduct.b2bUnitType === 'koli' ? 8 : 1),
      unitPrice,
      totalAmount,
      paymentTerms,
      status: 'TEKLIF_BEKLIYOR',
      orderDate: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    const existingOrders = getStoredB2BOrders();
    const updatedOrders = [newOrder, ...existingOrders];
    saveStoredB2BOrders(updatedOrders);

    setPurchaseModalProduct(null);
    showToast(`🎉 ${orderNo} numaralı toptan sipariş talebiniz "${purchaseModalProduct.storeName}" üreticisine iletildi!`);
  };

  // Handle open dropship import modal
  const handleOpenDropshipModal = (product: Product) => {
    if (!isSeller) {
      openAuthModal ? openAuthModal('seller') : loginAsSeller();
      return;
    }
    setDropshipModalProduct(product);
    setCustomRetailPrice(product.suggestedRetailPrice || Math.round((product.b2bWholesalePrice || product.price) * 1.5));
  };

  // Execute Dropship Import (TamPazar B2B Modeli)
  const handleExecuteDropshipImport = () => {
    if (!dropshipModalProduct) return;

    const wholesaleCost = dropshipModalProduct.b2bWholesalePrice || dropshipModalProduct.price;
    const profitTL = customRetailPrice - wholesaleCost;
    const profitMarginPercent = Math.round((profitTL / wholesaleCost) * 100);

    // 1. Save to dropshipped products mapping
    const newMapping: DropshippedProductMapping = {
      id: 'dsp-map-' + Date.now(),
      originalProductId: dropshipModalProduct.id,
      originalWholesalerId: dropshipModalProduct.tenantId,
      originalWholesalerName: dropshipModalProduct.storeName || 'Toptancı İmalatçı',
      retailerTenantId: user?.storeId || 's3',
      retailerStoreName: user?.storeName || 'FotoSentez Butik',
      productTitle: dropshipModalProduct.title,
      productImage: dropshipModalProduct.image,
      wholesaleCost,
      myRetailPrice: customRetailPrice,
      myProfitMarginTL: profitTL,
      myProfitMarginPercent: profitMarginPercent,
      status: 'AKTIF',
      salesCount: 0,
      addedAt: new Date().toISOString().split('T')[0]
    };

    const existingMappings = getStoredDropshippedProducts();
    saveStoredDropshippedProducts([newMapping, ...existingMappings]);

    // 2. Clone into retailer's products catalog so it shows in retailer storefront
    const clonedProduct: Product = {
      ...dropshipModalProduct,
      id: 'prod-dsp-' + Date.now(),
      tenantId: user?.storeId || 's3',
      storeName: user?.storeName || 'FotoSentez Butik',
      price: customRetailPrice,
      listPrice: Math.round(customRetailPrice * 1.25),
      sku: 'DSP-' + dropshipModalProduct.sku,
      badge: 'Dropshipping (Hızlı Sevk)',
      isB2BOnly: false,
      isDropshippedCopy: true,
      dropshipOriginalProductId: dropshipModalProduct.id,
      dropshipOriginalStoreId: dropshipModalProduct.tenantId,
      dropshipOriginalStoreName: dropshipModalProduct.storeName
    };

    const updatedCatalog = [clonedProduct, ...products];
    setProducts(updatedCatalog);
    try {
      localStorage.setItem('tampazar_products', JSON.stringify(updatedCatalog));
    } catch (e) {}

    setDropshipModalProduct(null);
    showToast(`✅ "${dropshipModalProduct.title}" başarıyla mağazanıza eklendi! Satış fiyatınız: ₺${customRetailPrice.toLocaleString('tr-TR')} (Kârınız: ₺${profitTL.toLocaleString('tr-TR')})`);
  };

  // Helper to get tiered price based on quantity
  const getTierPrice = (product: Product, qty: number): number => {
    if (!product.b2bTieredPricing || product.b2bTieredPricing.length === 0) {
      return product.b2bWholesalePrice || product.price;
    }
    // Find matching tier
    for (const tier of product.b2bTieredPricing) {
      if (qty >= tier.minQty && (tier.maxQty === null || tier.maxQty === undefined || qty <= tier.maxQty)) {
        return tier.price;
      }
    }
    return product.b2bWholesalePrice || product.price;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-fade-in max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-bold leading-snug">{toastMessage}</p>
        </div>
      )}

      {/* 1. HERO & BREADCRUMB HEADER */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-12 px-4 sm:px-6 relative overflow-hidden border-b border-indigo-900/50">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          {/* Breadcrumb */}
          <nav aria-label="Navigasyon" className="flex items-center gap-2 text-xs text-slate-400">
            <Link to="/" className="hover:text-white transition">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-amber-400 font-bold">B2B Toptan & Esnaf Ağı</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-black uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                Kapalı Devre B2B Toptan Pazaryeri & Dropshipping Ağı
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                Doğrudan Üreticiden Toptan Al,<br />
                <span className="text-amber-400">%0 Komisyonla</span> Vitrinine Çek
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                İstanbul Merter tekstil serileri, Gedikpaşa ayakkabı kolileri, Karadeniz fındık çuvalları... Aracı komisyonu olmadan doğrudan üreticiden koli bazlı toptan satın alın veya tek tıkla kendi mağazanıza dropshipping ile ekleyin.
              </p>
            </div>

            {/* Auth status card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 sm:p-6 lg:w-80 shrink-0 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-slate-300 tracking-wider">Erişim Durumu</span>
                {isSeller ? (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Unlock className="w-3 h-3" /> Yetkili Mağaza
                  </span>
                ) : (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Fiyatlar Gizli
                  </span>
                )}
              </div>

              {isSeller ? (
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-slate-400 block">Giriş Yapılan Mağaza:</span>
                    <span className="text-sm font-black text-white">{user?.storeName || 'FotoSentez Butik'}</span>
                    <span className="text-[11px] text-emerald-400 block font-mono">Toptan Fiyatlar & Dropshipping Açık</span>
                  </div>
                  <Link
                    to="/yonetim"
                    className="w-full py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Store className="w-4 h-4" />
                    B2B & Dropshipping Panelim
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-slate-300">
                    Toptan koli/seri birim fiyatlarını ve dropshipping kâr marjlarını görmek için esnaf mağazanızla oturum açın.
                  </p>
                  <button
                    onClick={() => loginAsSeller ? loginAsSeller() : openAuthModal && openAuthModal('seller')}
                    className="w-full py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg"
                  >
                    <Unlock className="w-4 h-4" />
                    Esnafa Özel Fiyatları Gör (Mağaza Girişi Yap)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* ARAMA VE FİLTRELEME ÇUBUĞU */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Arama Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Toptan ürün, seri, koli veya imalatçı ara..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* Kategori Filtre Butonları */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'Tüm Toptan Ürünler' },
              { id: 'toptan-tekstil', label: '👕 Toptan Tekstil' },
              { id: 'toptan-ayakkabi', label: '👞 Toptan Ayakkabı' },
              { id: 'toptan-gida', label: '🌾 Yöresel Gıda & Tarım' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}

            <button
              onClick={() => setOnlyDropshipEligible(!onlyDropshipEligible)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 border ${
                onlyDropshipEligible
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              Yalnızca Dropshipping'e Açık Olanlar
            </button>
          </div>
        </div>

        {/* B2B PRODUCT GRID */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Kapalı Devre Toptan & Dropshipping Kataloğu
              </h2>
              <p className="text-xs text-slate-500">
                Toplam {b2bProducts.length} toptan imalat ürünü listeleniyor
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>GİB e-İrsaliye & Ambar Sevk Garantisi</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {b2bProducts.map((product) => {
              const unitType = product.b2bUnitType || 'seri';
              const minQty = product.b2bMinQty || 1;
              const wholesalePrice = product.b2bWholesalePrice || product.price;
              const suggestedRetail = product.suggestedRetailPrice || Math.round(wholesalePrice * 1.5);
              const estProfit = suggestedRetail - wholesalePrice;
              const profitPercent = Math.round((estProfit / wholesalePrice) * 100);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  {/* Card Image & Badges */}
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                    <img
                      src={product.image}
                      alt={`${product.title} - TamPazar`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950/80 text-amber-400 px-2.5 py-1 rounded-full backdrop-blur-xs">
                        {product.badge || `Toptan ${unitType.toUpperCase()}`}
                      </span>
                      {product.allowDropshipping && (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600/90 text-white px-2.5 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
                          <Truck className="w-3 h-3" /> Dropshipping Hazır
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-[11px] font-bold text-slate-800 shadow-xs">
                      Stok: {product.stockCount || 500} {unitType}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-indigo-700 font-bold">
                        <Building2 className="w-3.5 h-3.5" />
                        <span className="truncate">{product.storeName}</span>
                      </div>

                      <h3 className="text-sm font-black text-slate-900 leading-snug line-clamp-2">
                        {product.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    {/* Minimum Alım ve Paket Detayı */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Min. Sipariş Miktarı:</span>
                        <span className="font-black text-slate-800">
                          {minQty} {unitType.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Kargo & Ambar:</span>
                        <span className="font-semibold text-emerald-600">
                          {product.deliveryOptions?.carrierCompany || 'Yurtiçi Palet'}
                        </span>
                      </div>
                    </div>

                    {/* Fiyat Bölümü (Gizli / Açık Kontrolü) */}
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      {!isSeller ? (
                        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 text-center space-y-2">
                          <div className="flex items-center justify-center gap-1.5 text-amber-900 text-xs font-bold">
                            <Lock className="w-4 h-4 text-amber-600" />
                            <span>Toptan Fiyatı Görmek İçin Giriş Yapın</span>
                          </div>
                          <button
                            onClick={() => loginAsSeller ? loginAsSeller() : openAuthModal && openAuthModal('seller')}
                            className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer shadow-xs"
                          >
                            Esnafa Özel Fiyatları Gör
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* Fiyat Bilgisi */}
                          <div className="flex items-end justify-between">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                                Toptan Birim Fiyatı ({unitType}):
                              </span>
                              <div className="text-xl font-black text-slate-950">
                                ₺{wholesalePrice.toLocaleString('tr-TR')}
                              </div>
                            </div>

                            {product.b2bTieredPricing && product.b2bTieredPricing.length > 1 && (
                              <div className="text-right">
                                <span className="text-[10px] text-emerald-600 font-bold block">
                                  Toplu Alımda:
                                </span>
                                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  ₺{product.b2bTieredPricing[product.b2bTieredPricing.length - 1].price.toLocaleString('tr-TR')}'ye kadar
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Dropshipping Kâr Göstergesi */}
                          {product.allowDropshipping && (
                            <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-emerald-800 font-semibold">Önerilen Perakende:</span>
                                <span className="font-bold text-slate-800">₺{suggestedRetail.toLocaleString('tr-TR')}</span>
                              </div>
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-emerald-800 font-semibold">Vitrin Kâr Marjınız:</span>
                                <span className="font-black text-emerald-700">
                                  +₺{estProfit.toLocaleString('tr-TR')} (%{profitPercent})
                                </span>
                              </div>
                            </div>
                          )}

                          {/* İki Aksiyon Butonu & Numune Butonu */}
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              onClick={() => handleOpenPurchaseModal(product)}
                              className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Toplu Satın Al</span>
                            </button>

                            {product.allowDropshipping ? (
                              <button
                                onClick={() => handleOpenDropshipModal(product)}
                                className="py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                              >
                                <Truck className="w-3.5 h-3.5" />
                                <span>Mağazama Ekle</span>
                              </button>
                            ) : (
                              <button
                                disabled
                                className="py-2.5 px-3 bg-slate-100 text-slate-400 font-bold text-xs rounded-xl cursor-not-allowed flex items-center justify-center"
                              >
                                Yalnızca Toptan
                              </button>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              showToast(`"${product.title}" için 1 adet numune talebiniz üreticiye iletildi.`);
                            }}
                            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-xl border border-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>🧪 1 Adet Test Numunesi Talep Et</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. B2B MODÜL BİLGİLENDİRME BANNERI (FAIRE & SPOCKET MANTIĞI) */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-4 shadow-xl border border-indigo-800/40">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Türkiye'nin İlk Açık & Kapalı Hibrit Esnaf Modeli</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            Kendi Ürünlerinizi B2B'ye Açın, Binlerce Esnaf Sizin İçin Satsın
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            TamPazar yönetim panelinden ürünlerinizi eklerken "Toptan Satış" ve "Dropshipping" seçeneklerini işaretleyin. Diğer perakendeciler ürünlerinizi kendi vitrinlerine koysun; satış oldukça siparişler otomatik sizin panelinize düşsün. Siz sadece kargolayın, paranız ertesi gün hesabınıza geçsin.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/yonetim"
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer shadow-md inline-flex items-center gap-2"
            >
              <Store className="w-4 h-4" />
              Ürünlerimi B2B & Dropshipping'e Aç
            </Link>
            <span className="text-xs text-slate-400">
              ✓ %0 Platform Komisyonu ✓ Otomatik e-İrsaliye ve Despatch Sevk
            </span>
          </div>
        </div>
      </main>

      {/* MODAL 1: HIZLI TOPTAN SATIN ALMA / TEKLİF MODALI */}
      {purchaseModalProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  B2B Toptan Sipariş Formu
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  {purchaseModalProduct.title}
                </h3>
              </div>
              <button
                onClick={() => setPurchaseModalProduct(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Miktar Seçici */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Sipariş Miktarı ({purchaseModalProduct.b2bUnitType || 'seri'}):</span>
                <span className="text-slate-500 font-normal">
                  Min. {purchaseModalProduct.b2bMinQty || 1} {purchaseModalProduct.b2bUnitType}
                </span>
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPurchaseQuantity(Math.max(purchaseModalProduct.b2bMinQty || 1, purchaseQuantity - 1))}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black flex items-center justify-center cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min={purchaseModalProduct.b2bMinQty || 1}
                  value={purchaseQuantity}
                  onChange={(e) => setPurchaseQuantity(Math.max(purchaseModalProduct.b2bMinQty || 1, Number(e.target.value)))}
                  className="flex-1 py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-black text-sm"
                />
                <button
                  type="button"
                  onClick={() => setPurchaseQuantity(purchaseQuantity + 1)}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black flex items-center justify-center cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Ödeme Koşulu */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                Ödeme & Vade Tercihi:
              </label>
              <select
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                <option value="CARI_HESAP_30_GUN">📑 Cari Hesaba Ekle (30 Gün Açık Hesap)</option>
                <option value="PESIN_HAVALE">🏦 Peşin Banka Havalesi / EFT</option>
                <option value="KREDI_KARTI_POS">💳 Sanal POS / Kredi Kartı ile Doğrudan</option>
              </select>
            </div>

            {/* Fiyat Özeti */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Birim Fiyat ({purchaseModalProduct.b2bUnitType}):</span>
                <span className="font-bold text-slate-800">
                  ₺{getTierPrice(purchaseModalProduct, purchaseQuantity).toLocaleString('tr-TR')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Adet / Koli Çarpanı:</span>
                <span className="font-bold text-slate-800">
                  {purchaseQuantity} {purchaseModalProduct.b2bUnitType} (Toplam {purchaseQuantity * 6} birim)
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm">
                <span className="font-black text-slate-900">Toplam Sipariş Tutarı:</span>
                <span className="font-black text-emerald-600 text-base">
                  ₺{(getTierPrice(purchaseModalProduct, purchaseQuantity) * purchaseQuantity).toLocaleString('tr-TR')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPurchaseModalProduct(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleExecuteWholesaleOrder}
                className="flex-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl transition cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Toptan Siparişi Onayla & Sevk Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ESNAFTAN ESNAFA DROPSHIPPING VİTRİNE ÇEKME MODALI (FAIRE & SPOCKET) */}
      {dropshipModalProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                  <Truck className="w-3 h-3 text-emerald-600" />
                  Esnaftan Esnafa Dropshipping Sihirbazı
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  {dropshipModalProduct.title}
                </h3>
              </div>
              <button
                onClick={() => setDropshipModalProduct(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 space-y-1">
              <span className="font-black block">📦 Sıfır Stok Maliyeti ile Satışa Başlayın</span>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                Bu ürünü mağazanıza eklediğinizde kendi vitrininizde satışa açılır. Müşteriniz sipariş verdiğinde, kargolama üretici <strong>{dropshipModalProduct.storeName}</strong> tarafından doğrudan müşterinize sizin dükkan adınızla gönderilir.
              </p>
            </div>

            {/* Perakende Fiyat Belirleme */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                Mağazanızdaki Perakende Satış Fiyatınız (TL):
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">₺</span>
                <input
                  type="number"
                  min={(dropshipModalProduct.b2bWholesalePrice || dropshipModalProduct.price) + 1}
                  value={customRetailPrice}
                  onChange={(e) => setCustomRetailPrice(Number(e.target.value))}
                  className="w-full pl-7 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <span className="text-[10px] text-slate-500 block">
                Önerilen Fiyat: ₺{(dropshipModalProduct.suggestedRetailPrice || customRetailPrice).toLocaleString('tr-TR')}
              </span>
            </div>

            {/* Kâr Hesaplama Özeti */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Toptancıya Ödenecek Maliyet:</span>
                <span className="font-bold text-slate-800">
                  ₺{(dropshipModalProduct.b2bWholesalePrice || dropshipModalProduct.price).toLocaleString('tr-TR')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Müşteriden Tahsil Edilecek Tutar:</span>
                <span className="font-bold text-slate-800">
                  ₺{customRetailPrice.toLocaleString('tr-TR')}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm">
                <span className="font-black text-slate-900">Sipariş Başına Net Kârınız:</span>
                <span className="font-black text-emerald-600 text-base">
                  +₺{(customRetailPrice - (dropshipModalProduct.b2bWholesalePrice || dropshipModalProduct.price)).toLocaleString('tr-TR')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDropshipModalProduct(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleExecuteDropshipImport}
                className="flex-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl transition cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Mağazamın Vitrinine Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
