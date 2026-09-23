/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Tags, Calendar, MapPin, Sparkles, Check, Globe, HelpCircle, Code, Plus, Trash, Zap } from 'lucide-react';
import { Tenant, Product, initialProducts } from '../data/mockData';
import QuickAddProductForm from './QuickAddProductForm';

interface ProductStorefrontProps {
  currentTenant: Tenant;
}

export default function ProductStorefront({ currentTenant }: ProductStorefrontProps) {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('tampazar_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [formMode, setFormMode] = useState<'quick' | 'advanced'>('quick');

  // New Product Form States
  const [productType, setProductType] = useState<'retail' | 'wholesale' | 'service'>('retail');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState(150);
  const [sku, setSku] = useState('');
  const [vatRate, setVatRate] = useState(20);
  
  // Type specific states
  const [variantsSize, setVariantsSize] = useState('40,41,42,43');
  const [variantsColor, setVariantsColor] = useState('Siyah,Taba,Kahverengi');
  const [moq, setMoq] = useState(10);
  const [tier1Min, setTier1Min] = useState(10);
  const [tier1Max, setTier1Max] = useState(49);
  const [tier1Price, setTier1Price] = useState(130);
  const [tier2Min, setTier2Min] = useState(50);
  const [tier2Price, setTier2Price] = useState(110);
  const [durationMin, setDurationMin] = useState(60);
  const [serviceRadius, setServiceRadius] = useState(15);

  // Storefront Simulator states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantSize, setSelectedVariantSize] = useState('');
  const [selectedVariantColor, setSelectedVariantColor] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  
  // Filter products by current tenant
  const tenantProducts = products.filter(p => p.tenantId === currentTenant.id);

  useEffect(() => {
    if (tenantProducts.length > 0) {
      setSelectedProduct(tenantProducts[0]);
      setQuantity(tenantProducts[0].moq || 1);
    } else {
      setSelectedProduct(null);
    }
    setPurchaseSuccess(false);
    setSelectedSlot('');
  }, [currentTenant.id, products]);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !basePrice) return;

    const slug = title.toLowerCase().trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newProduct: Product = {
      id: 'prod-' + Math.floor(Math.random() * 1000000),
      tenantId: currentTenant.id,
      type: productType,
      title,
      slug,
      category,
      categorySlug: category.toLowerCase().trim().replace(/\s+/g, '-'),
      description,
      price: basePrice,
      sku: sku || 'SKU-' + Math.floor(Math.random() * 1000),
      vatRate,
      image: productType === 'retail' 
        ? 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400' 
        : productType === 'wholesale'
        ? 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400'
        : 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=400',
    };

    if (productType === 'retail') {
      newProduct.variants = {
        sizes: variantsSize.split(',').map(s => s.trim()),
        colors: variantsColor.split(',').map(c => c.trim())
      };
    } else if (productType === 'wholesale') {
      newProduct.moq = moq;
      newProduct.tieredPrices = [
        { minQty: tier1Min, maxQty: tier1Max, pricePerUnit: tier1Price },
        { minQty: tier2Min, maxQty: null, pricePerUnit: tier2Price }
      ];
    } else if (productType === 'service') {
      newProduct.durationMin = durationMin;
      newProduct.serviceAreaRadiusKm = serviceRadius;
      newProduct.bookingSlots = ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00'];
    }

    const updated = [...products, newProduct];
    setProducts(updated);
    localStorage.setItem('tampazar_products', JSON.stringify(updated));

    // Reset Form
    setTitle('');
    setCategory('');
    setDescription('');
    setBasePrice(150);
    setSku('');
    setSelectedProduct(newProduct);
  };

  const handleDeleteProduct = (productId: string) => {
    const updated = products.filter(p => p.id !== productId);
    setProducts(updated);
    localStorage.setItem('tampazar_products', JSON.stringify(updated));
  };

  // Calculations for tier prices
  const getUnitPrice = (product: Product, qty: number): number => {
    if (product.type !== 'wholesale' || !product.tieredPrices) return product.price;
    const tier = product.tieredPrices.find(t => qty >= t.minQty && (t.maxQty === null || qty <= t.maxQty));
    return tier ? tier.pricePerUnit : product.price;
  };

  const calculateTotal = (product: Product, qty: number): number => {
    const unitPrice = getUnitPrice(product, qty);
    return unitPrice * qty;
  };

  const activeUnitPrice = selectedProduct ? getUnitPrice(selectedProduct, quantity) : 0;
  const activeTotal = selectedProduct ? calculateTotal(selectedProduct, quantity) : 0;

  // Simulate order creation on storefront checkout
  const handleCheckoutSimulate = () => {
    if (!selectedProduct) return;
    
    // Create pre-accounting cari transaction & e-invoice instantly!
    const savedInvoices = localStorage.getItem('tampazar_invoices');
    const invoices = savedInvoices ? JSON.parse(savedInvoices) : [];
    
    const vatAmt = parseFloat(((activeTotal * (selectedProduct.vatRate / 100))).toFixed(2));
    const cleanAmt = parseFloat((activeTotal - vatAmt).toFixed(2));
    
    const newInvoice = {
      id: 'inv-' + Math.floor(Math.random() * 1000000),
      invoiceNumber: 'GIB2026000000' + Math.floor(100 + Math.random() * 899),
      orderId: 'ord-' + Math.floor(Math.random() * 1000000),
      tenantId: currentTenant.id,
      customerName: 'Sarp Kaya (Simülasyon Alıcısı)',
      customerTaxOffice: 'Kadıköy VD',
      customerTaxId: '2938491039',
      customerEmail: 'sarp.kaya@gmail.com',
      date: new Date().toISOString().split('T')[0],
      amount: cleanAmt,
      vatAmount: vatAmt,
      withholdingTaxType: 'None',
      withholdingAmount: 0.00,
      totalPayable: activeTotal,
      status: 'queued', // goes into the queue
      integrator: 'gib'
    };

    localStorage.setItem('tampazar_invoices', JSON.stringify([...invoices, newInvoice]));

    // cari account balance update
    const savedAccounts = localStorage.getItem('tampazar_ledger_accounts');
    const accounts = savedAccounts ? JSON.parse(savedAccounts) : [];
    let buyerAccount = accounts.find((a: any) => a.tenantId === currentTenant.id && a.type === 'buyer');
    
    if (buyerAccount) {
      buyerAccount.balance += activeTotal;
      localStorage.setItem('tampazar_ledger_accounts', JSON.stringify(accounts));

      const savedTx = localStorage.getItem('tampazar_ledger_transactions');
      const transactions = savedTx ? JSON.parse(savedTx) : [];
      const newTx = {
        id: 'tx-' + Math.floor(Math.random() * 1000000),
        tenantId: currentTenant.id,
        accountId: buyerAccount.id,
        date: new Date().toISOString().split('T')[0],
        description: `${selectedProduct.title} Sipariş Satış Cari Kaydı`,
        debit: activeTotal,
        credit: 0,
        balanceAfter: buyerAccount.balance
      };
      localStorage.setItem('tampazar_ledger_transactions', JSON.stringify([...transactions, newTx]));
    }

    setPurchaseSuccess(true);
    window.dispatchEvent(new Event('tampazar_accounting_updated'));
    window.dispatchEvent(new Event('tampazar_invoice_added'));
  };

  // JSON-LD Structured Data generator based on selected product
  const getJsonLd = (product: Product | null): string => {
    if (!product) return '';
    
    const storeUrl = `https://tampazar.com/magaza/${currentTenant.slug}`;
    const productUrl = `https://tampazar.com/urun/${product.categorySlug}/${product.slug}`;

    const storeSchema = {
      "@context": "https://schema.org",
      "@type": "Store",
      "name": currentTenant.name,
      "url": storeUrl,
      "logo": "https://tampazar.com/assets/logo.png"
    };

    if (product.type === 'retail') {
      const retailSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.title,
        "image": product.image,
        "description": product.description,
        "sku": product.sku,
        "category": product.category,
        "offers": {
          "@type": "Offer",
          "url": productUrl,
          "priceCurrency": "TRY",
          "price": product.price,
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "priceType": "https://schema.org/Retail",
            "price": product.price,
            "valueAddedTaxIncluded": true
          },
          "seller": storeSchema
        }
      };
      return JSON.stringify(retailSchema, null, 2);
    } 
    
    if (product.type === 'wholesale') {
      const tiers = product.tieredPrices || [];
      const wholesaleSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.title,
        "image": product.image,
        "description": product.description,
        "sku": product.sku,
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "TRY",
          "lowPrice": tiers.length > 0 ? tiers[tiers.length - 1].pricePerUnit : product.price,
          "highPrice": product.price,
          "offerCount": tiers.length,
          "priceSpecification": tiers.map(t => ({
            "@type": "UnitPriceSpecification",
            "minQuantity": t.minQty,
            "maxQuantity": t.maxQty || undefined,
            "price": t.pricePerUnit,
            "priceCurrency": "TRY"
          })),
          "seller": storeSchema
        }
      };
      return JSON.stringify(wholesaleSchema, null, 2);
    }

    if (product.type === 'service') {
      const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": product.title,
        "serviceType": product.category,
        "description": product.description,
        "provider": {
          "@type": "LocalBusiness",
          "name": currentTenant.name,
          "address": "Bursa, Türkiye",
          "areaServed": {
            "@type": "GeoCircle",
            "geoMidpoint": {
              "@type": "GeoCoordinates",
              "latitude": 40.1885,
              "longitude": 29.0610
            },
            "geoRadius": product.serviceAreaRadiusKm ? product.serviceAreaRadiusKm * 1000 : 15000
          }
        },
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": "TRY",
          "url": productUrl
        }
      };
      return JSON.stringify(serviceSchema, null, 2);
    }

    return '';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Editorial Title */}
      <div>
        <span className="text-xs font-mono text-emerald-600 tracking-wider uppercase font-semibold">03. Çok Yönlü Katalog & SEO Motoru</span>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mt-1">Akıllı Ürün Girişi & Yapılandırılmış Veri Simulatorü</h2>
        <p className="text-slate-500 text-sm mt-1 max-w-3xl">
          SaaS panelinden Perakende (varyantlı), Toptan B2B (kademeli fiyat şemalı) veya Hizmet (rezervasyonlu) satışı ekleyin. Altyapımız, SEO standartlarına göre dinamik JSON-LD meta verilerini otomatik üretir.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Onboarding Catalog Form (Left 5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Tags className="w-4 h-4 text-emerald-600" />
              Mağazaya İlan & Ürün Ekle
            </h3>
            
            {/* Form Mode Toggle */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setFormMode('quick')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
                  formMode === 'quick' ? 'bg-indigo-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Zap className="w-3 h-3 text-amber-400" /> Hızlı Form
              </button>
              <button
                type="button"
                onClick={() => setFormMode('advanced')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                  formMode === 'advanced' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Detaylı Giriş
              </button>
            </div>
          </div>

          {formMode === 'quick' ? (
            <QuickAddProductForm 
              storeId={currentTenant.id} 
              storeName={currentTenant.name}
              onProductAdded={(newProd) => {
                setProducts(prev => [newProd, ...prev]);
                setSelectedProduct(newProd);
              }}
            />
          ) : (
            <form onSubmit={handleCreateProduct} className="space-y-4">
              {/* Interactive Segmented Control */}
              <div className="flex bg-slate-100 p-1 rounded-lg">
                {(['retail', 'wholesale', 'service'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setProductType(type)}
                    className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap capitalize cursor-pointer ${
                      productType === type ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {type === 'retail' ? 'Perakende' : type === 'wholesale' ? 'B2B Toptan' : 'Hizmet'}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-0.5">Ürün/Hizmet Adı</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={productType === 'retail' ? 'örn: Klasik Deri Ayakkabı' : productType === 'wholesale' ? 'örn: Sızma Zeytinyağı 5L' : 'örn: Bali Masajı'}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-0.5">Kategori</label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="örn: Gıda, Ayakkabı"
                      className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-0.5">Taban Fiyat (KDV Dahil)</label>
                    <input
                      type="number"
                      value={basePrice}
                      onChange={(e) => setBasePrice(Number(e.target.value))}
                      className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-0.5">KDV Oranı (%)</label>
                  <select
                    value={vatRate}
                    onChange={(e) => setVatRate(Number(e.target.value))}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value={20}>%20 Standard Perakende KDV</option>
                    <option value={10}>%10 Hizmet / Sağlık KDV</option>
                    <option value={1}>%1 Temel Gıda / Toptan KDV</option>
                    <option value={0}>%0 KDV Muaf</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-0.5">Açıklama (SEO Açıklaması)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detaylı arama motoru optimizasyonlu ürün açıklaması..."
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-800 focus:outline-none focus:border-emerald-500 h-16 resize-none"
                    required
                  />
                </div>

                {/* Dynamic Sub-forms based on active segmented control */}
                {productType === 'retail' && (
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 space-y-2 animate-fade-in">
                    <span className="text-[10px] font-semibold text-slate-500 block uppercase tracking-wider">Perakende Varyant Ayarları</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-500">Beden / Ölçü (Virgüllü)</label>
                        <input
                          type="text"
                          value={variantsSize}
                          onChange={(e) => setVariantsSize(e.target.value)}
                          className="w-full text-[11px] border border-slate-200 rounded p-1.5 bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500">Renkler (Virgüllü)</label>
                        <input
                          type="text"
                          value={variantsColor}
                          onChange={(e) => setVariantsColor(e.target.value)}
                          className="w-full text-[11px] border border-slate-200 rounded p-1.5 bg-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {productType === 'wholesale' && (
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 space-y-2 animate-fade-in">
                    <span className="text-[10px] font-semibold text-slate-500 block uppercase tracking-wider">B2B Kademeli Toptan Fiyatlama</span>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[9px] text-slate-500">MOQ (Min Sipariş)</label>
                        <input
                          type="number"
                          value={moq}
                          onChange={(e) => setMoq(Number(e.target.value))}
                          className="w-full text-[11px] border border-slate-200 rounded p-1 bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-slate-500">Tier 1 Fiyat (10-49 adet)</label>
                        <input
                          type="number"
                          value={tier1Price}
                          onChange={(e) => setTier1Price(Number(e.target.value))}
                          className="w-full text-[11px] border border-slate-200 rounded p-1 bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-slate-500">Tier 2 Fiyat (50+ adet)</label>
                        <input
                          type="number"
                          value={tier2Price}
                          onChange={(e) => setTier2Price(Number(e.target.value))}
                          className="w-full text-[11px] border border-slate-200 rounded p-1 bg-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {productType === 'service' && (
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 space-y-2 animate-fade-in">
                    <span className="text-[10px] font-semibold text-slate-500 block uppercase tracking-wider">Hizmet Seansı & Rezervasyon Alanı</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-500">Seans Süresi (Dk)</label>
                        <input
                          type="number"
                          value={durationMin}
                          onChange={(e) => setDurationMin(Number(e.target.value))}
                          className="w-full text-[11px] border border-slate-200 rounded p-1.5 bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500">Hizmet Yarıçapı (KM)</label>
                        <input
                          type="number"
                          value={serviceRadius}
                          onChange={(e) => setServiceRadius(Number(e.target.value))}
                          className="w-full text-[11px] border border-slate-200 rounded p-1.5 bg-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Kataloğa Kaydet & SEO Tetikle
              </button>
            </form>
          )}

          {/* List of active products */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-2">Mevcut Mağaza Kataloğu</span>
            {tenantProducts.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Kataloğunuz boş. İlk ürünü yukarıdan ekleyin.</p>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {tenantProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors border ${
                      selectedProduct?.id === p.id 
                        ? 'bg-slate-100 border-slate-300' 
                        : 'bg-slate-50 border-transparent hover:bg-slate-100/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs">
                        {p.type === 'retail' ? '🛍️' : p.type === 'wholesale' ? '🌾' : '💆'}
                      </span>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-800 truncate max-w-[140px]">{p.title}</h4>
                        <span className="text-[9px] text-slate-400 font-mono capitalize">{p.type} · {p.sku}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-slate-800">{p.price} TL</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProduct(p.id);
                        }}
                        className="text-red-500 hover:text-red-700 p-0.5"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Client Storefront Sandbox (Middle 4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between h-[640px]">
          {selectedProduct ? (
            <>
              {/* Product Card Image */}
              <div className="relative h-44 bg-slate-100 overflow-hidden shrink-0">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[9px] font-mono tracking-wider font-semibold py-1 px-2 rounded-full uppercase">
                  {selectedProduct.type === 'retail' ? 'Perakende' : selectedProduct.type === 'wholesale' ? 'B2B Toptan' : 'Hizmet Satışı'}
                </span>
                <span className="absolute bottom-3 right-3 bg-emerald-600/90 text-white text-[11px] font-mono font-semibold py-1 px-2.5 rounded-lg">
                  KDV Oranı: %{selectedProduct.vatRate}
                </span>
              </div>

              {/* Product Storefront Details */}
              <div className="p-5 flex-1 overflow-y-auto space-y-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono tracking-wide">{currentTenant.name} / {selectedProduct.category}</span>
                  <h3 className="text-base font-semibold text-slate-900 mt-0.5">{selectedProduct.title}</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-1">{selectedProduct.description}</p>
                </div>

                {/* Sub-form fields according to type */}
                {selectedProduct.type === 'retail' && selectedProduct.variants && (
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Beden / Numara Seçin</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProduct.variants.sizes?.map(size => (
                          <button
                            key={size}
                            onClick={() => setSelectedVariantSize(size)}
                            className={`px-3 py-1 text-[11px] font-mono font-semibold border rounded transition-colors ${
                              selectedVariantSize === size 
                                ? 'bg-slate-900 text-white border-slate-900' 
                                : 'border-slate-200 text-slate-600 hover:border-slate-400'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Renk Seçin</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProduct.variants.colors?.map(color => (
                          <button
                            key={color}
                            onClick={() => setSelectedVariantColor(color)}
                            className={`px-3 py-1 text-[11px] border rounded transition-colors ${
                              selectedVariantColor === color 
                                ? 'bg-slate-900 text-white border-slate-900' 
                                : 'border-slate-200 text-slate-600 hover:border-slate-400'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedProduct.type === 'wholesale' && selectedProduct.tieredPrices && (
                  <div className="space-y-3">
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Kademeli Toptan Tarifesi</span>
                      <div className="space-y-1 font-mono text-[10px]">
                        <div className="flex justify-between text-slate-400">
                          <span>Varsayılan Perakende Tekil Fiyat:</span>
                          <span>{selectedProduct.price} TL</span>
                        </div>
                        {selectedProduct.tieredPrices.map((tier, i) => (
                          <div key={i} className="flex justify-between font-semibold text-slate-700">
                            <span>{tier.minQty}{tier.maxQty ? `-${tier.maxQty}` : '+'} Adet Alım:</span>
                            <span className="text-emerald-600">{tier.pricePerUnit} TL / adet</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-medium text-slate-500">
                        <span>Alım Miktarı (MOQ: {selectedProduct.moq})</span>
                        <span className="font-mono text-emerald-600 font-semibold">Birim Fiyat: {activeUnitPrice} TL</span>
                      </div>
                      <input
                        type="range"
                        min={selectedProduct.moq || 1}
                        max={300}
                        step={5}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full accent-emerald-600"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>Min {selectedProduct.moq}</span>
                        <span className="text-slate-800 font-bold">{quantity} Adet Alım</span>
                        <span>Max 300</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedProduct.type === 'service' && selectedProduct.bookingSlots && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Süre: {selectedProduct.durationMin} dakika seans</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Hizmet Alanı: Merkezden {selectedProduct.serviceAreaRadiusKm} KM yarıçap</span>
                    </div>

                    <div className="pt-1">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Müsait Rezervasyon Seansları</span>
                      <div className="grid grid-cols-4 gap-1">
                        {selectedProduct.bookingSlots.map(slot => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-1 rounded text-center text-[10px] font-mono border transition-colors ${
                              selectedSlot === slot 
                                ? 'bg-slate-900 text-white border-slate-900' 
                                : 'border-slate-100 text-slate-600 bg-slate-50 hover:bg-slate-100'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Purchase checkout simulation bottom zone */}
              <div className="p-5 border-t border-slate-100 bg-slate-50 shrink-0">
                {purchaseSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-xs space-y-1 animate-fade-in text-center">
                    <div className="font-bold">✓ Satış Başarıyla Simüle Edildi!</div>
                    <div>Cari hesap borçlandırıldı. Sipariş faturası kesilmek üzere sıraya (Queue) eklendi!</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-xs text-slate-400">Sepet Toplamı (KDV Dahil):</span>
                      <span className="text-base font-bold text-slate-900">{activeTotal.toLocaleString('tr-TR')} TL</span>
                    </div>
                    
                    {selectedProduct.type === 'wholesale' ? (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={handleCheckoutSimulate}
                          className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          Hemen Sipariş Ver
                        </button>
                        <button
                          type="button"
                          onClick={() => alert(`Gurme Restoran Zinciri A.Ş adına özel toptan teklif e-postası tetiklendi!\nÜrün: ${selectedProduct.title}\nMiktar: ${quantity} Adet\nTalep Edilen Hedef Fiyat: ${(activeUnitPrice * 0.9).toFixed(0)} TL`)}
                          className="py-2.5 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 text-xs font-semibold rounded-lg transition-colors"
                        >
                          Özel Fiyat Teklifi Al
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleCheckoutSimulate}
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Güvenli Satın Al (BYO POS)
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-slate-400 m-auto">
              <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-300" />
              <p className="text-xs">Mağazaya ait seçili ürün yok veya kataloğunuz boş.</p>
            </div>
          )}
        </div>

        {/* SEO Dynamic Metadata & JSON-LD (Right 3 cols) */}
        <div className="lg:col-span-3 bg-slate-900 text-slate-100 border border-slate-800 rounded-xl p-5 shadow-md flex flex-col justify-between h-[640px]">
          <div className="space-y-4 overflow-y-auto pr-1">
            <h3 className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Code className="w-3.5 h-3.5" />
              SEO & Structured Data
            </h3>

            {/* Simulated HTML meta tags */}
            {selectedProduct && (
              <div className="space-y-2">
                <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-wider block">Generated Meta Tags (Dinamik Meta)</span>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1 font-mono text-[9px] text-slate-400">
                  <div>&lt;<span className="text-emerald-500">title</span>&gt;{selectedProduct.title} - {currentTenant.name}&lt;/title&gt;</div>
                  <div>&lt;<span className="text-emerald-500">meta</span> name="description" content="{selectedProduct.description.substring(0, 50)}..."&gt;</div>
                  <div>&lt;<span className="text-emerald-500">meta</span> property="og:type" content="product"&gt;</div>
                  <div>&lt;<span className="text-emerald-500">link</span> rel="canonical" href="tampazar.com/urun/{selectedProduct.categorySlug}/{selectedProduct.slug}"&gt;</div>
                </div>
              </div>
            )}

            {/* Generated JSON-LD Code viewer */}
            <div className="space-y-2">
              <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider block">JSON-LD Structured Data (schema.org)</span>
              <pre className="font-mono text-[10px] text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 overflow-x-auto max-h-[300px]">
                <code>{getJsonLd(selectedProduct)}</code>
              </pre>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 leading-relaxed font-mono">
            İlgili JSON-LD şemaları, Google Search Console tarafından otomatik algılanarak sitenizin Google'da rich snippets (yıldızlı derecelendirme, kademeli fiyat aralığı, yerel işletme rezervasyon) kazanmasını sağlar.
          </div>
        </div>

      </div>
    </div>
  );
}
