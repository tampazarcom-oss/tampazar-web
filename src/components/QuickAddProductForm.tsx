/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState } from 'react';
import { Camera, PlusCircle, Layers, Wrench, Package, Check, AlertCircle, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react';
import { Product, initialProducts } from '../data/mockData';
import { generateImageSeoMetadata, ImageSeoMetadata } from '../utils/imageSeo';

interface QuickAddProductFormProps {
  storeId: string;
  storeName?: string;
  onProductAdded?: (newProduct: Product) => void;
}

export default function QuickAddProductForm({ storeId, storeName, onProductAdded }: QuickAddProductFormProps) {
  const [productType, setProductType] = useState<'RETAIL' | 'WHOLESALE' | 'SERVICE'>('RETAIL');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [vatRate, setVatRate] = useState('20');
  const [stock, setStock] = useState('10');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=500&auto=format&fit=crop&q=80');
  
  // AI SEO State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [seoMetadata, setSeoMetadata] = useState<ImageSeoMetadata | null>(null);

  const handleRunAiSeo = async () => {
    setIsAiLoading(true);
    try {
      // Simulate or convert image to base64 for Gemini 2.5 flash
      // We provide a representative base64 or fetch
      const sampleBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
      const result = await generateImageSeoMetadata(sampleBase64, {
        storeName: storeName || 'Doğrulanmış Esnaf',
        city: 'Ordu',
        category: category || 'Genel Ticaret'
      });
      setSeoMetadata(result);
      if (result.altText && !title) {
        setTitle(result.altText.slice(0, 50));
      }
      if (result.suggestedTags?.[0] && !category) {
        setCategory(result.suggestedTags[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Toptan Özel Alanları
  const [minWholesaleQty, setMinWholesaleQty] = useState('10');
  const [wholesalePrice, setWholesalePrice] = useState('');

  // Durum
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const priceNum = parseFloat(price);
    const vatNum = parseInt(vatRate, 10);
    const typeMapping: 'retail' | 'wholesale' | 'service' = 
      productType === 'RETAIL' ? 'retail' : productType === 'WHOLESALE' ? 'wholesale' : 'service';

    const newProduct: Product = {
      id: 'p-' + Date.now(),
      tenantId: storeId,
      storeName: storeName || 'Doğrulanmış Dükkân',
      type: typeMapping,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: category || (productType === 'SERVICE' ? 'Hizmet & İşçilik' : 'Genel Ticari Ürün'),
      categorySlug: (category || 'genel').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: `${title} - %0 komisyonlu doğrudan dükkân satışı. Garantili faturalı teslimat.`,
      price: priceNum,
      sku: 'TMP-' + Math.floor(1000 + Math.random() * 9000),
      vatRate: vatNum,
      rating: 5.0,
      salesCount: 0,
      badge: productType === 'WHOLESALE' ? 'B2B Toptan' : productType === 'SERVICE' ? 'Yerinde Hizmet' : 'Doğrudan Satış',
      image: imageUrl,
      moq: productType === 'WHOLESALE' ? parseInt(minWholesaleQty, 10) || 10 : 1,
      tierPriceNote: productType === 'WHOLESALE' && wholesalePrice ? `${minWholesaleQty}+ Adet: ${wholesalePrice} ₺` : undefined,
      tieredPrices: productType === 'WHOLESALE' && wholesalePrice ? [
        { minQty: parseInt(minWholesaleQty, 10) || 10, maxQty: null, pricePerUnit: parseFloat(wholesalePrice) || priceNum }
      ] : undefined
    };

    try {
      // Save to localStorage
      const saved = localStorage.getItem('tampazar_products');
      const currentList: Product[] = saved ? JSON.parse(saved) : initialProducts;
      const updatedList = [newProduct, ...currentList];
      localStorage.setItem('tampazar_products', JSON.stringify(updatedList));

      // Trigger global event
      window.dispatchEvent(new Event('tampazar_products_updated'));

      if (onProductAdded) {
        onProductAdded(newProduct);
      }

      await new Promise((r) => setTimeout(r, 600));
      setMessage({ type: 'success', text: `"${title}" anında mağaza vitrininizde yayına alındı!` });
      setTitle('');
      setCategory('');
      setPrice('');
      setWholesalePrice('');
    } catch {
      setMessage({ type: 'error', text: 'Kayıt sırasında bir hata oluştu.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 md:p-8 border border-slate-200 shadow-sm max-w-xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
        <div>
          <h2 className="text-lg font-black text-slate-900">Hızlı İlan / Ürün Ekle</h2>
          <p className="text-xs text-slate-500">Müşterileriniz doğrudan dükkânınızdan sipariş versin</p>
        </div>
        <span className="text-[11px] font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-200">
          %0 Komisyonlu Satış
        </span>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl mb-5 text-xs font-semibold flex items-center gap-2 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {message.type === 'success' ? <Check className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 1. SEKTÖR / SATIŞ TİPİ SEÇİCİ */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-2">Satış Tipi Ne Olacak?</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setProductType('RETAIL')}
              className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition cursor-pointer ${
                productType === 'RETAIL'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Package className="w-4 h-4" /> Perakende
            </button>

            <button
              type="button"
              onClick={() => setProductType('WHOLESALE')}
              className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition cursor-pointer ${
                productType === 'WHOLESALE'
                  ? 'border-amber-600 bg-amber-50 text-amber-900'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4" /> B2B / Toptan
            </button>

            <button
              type="button"
              onClick={() => setProductType('SERVICE')}
              className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition cursor-pointer ${
                productType === 'SERVICE'
                  ? 'border-sky-600 bg-sky-50 text-sky-900'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Wrench className="w-4 h-4" /> Usta & Hizmet
            </button>
          </div>
        </div>

        {/* 2. GÖRSEL YÜKLEME ALANI */}
        <div className="space-y-2">
          <div 
            onClick={() => {
              const promptUrl = prompt('Görsel URL adresi girin (veya varsayılanı kullanın):', imageUrl);
              if (promptUrl) setImageUrl(promptUrl);
            }}
            className="border-2 border-dashed border-slate-200 rounded-2xl p-5 text-center bg-slate-50 cursor-pointer hover:bg-slate-100/70 transition"
          >
            {imageUrl ? (
              <div className="flex items-center justify-center gap-3">
                <img src={imageUrl} alt="Önizleme" className="w-12 h-12 object-cover rounded-xl border border-slate-200" />
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-700 block">Fotoğraf Seçildi</span>
                  <span className="text-[10px] text-slate-400">Değiştirmek için tıklayın</span>
                </div>
              </div>
            ) : (
              <>
                <Camera className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                <span className="text-xs font-bold text-slate-700 block">Kameradan Çek veya Fotoğraf Seç</span>
                <span className="text-[10px] text-slate-400">Ürün veya atölye görseli (Tek dokunuşla yüklenir)</span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={handleRunAiSeo}
            disabled={isAiLoading}
            className="w-full py-2.5 px-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin text-indigo-600" /> : <Sparkles className="w-4 h-4 text-amber-500" />}
            {isAiLoading ? 'Gemini Görseli Analiz Ediyor...' : '✨ Gemini 2.5 Flash ile Akıllı Görsel SEO & Başlık Üret'}
          </button>

          {seoMetadata && (
            <div className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] space-y-1.5 animate-fade-in font-mono">
              <div className="text-amber-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Üretilen Semantik SEO Verisi:
              </div>
              <div><span className="text-slate-400">AltText:</span> {seoMetadata.altText}</div>
              <div><span className="text-slate-400">Anahtar Kelimeler:</span> {seoMetadata.keywords.join(', ')}</div>
            </div>
          )}
        </div>

        {/* 3. BAŞLIK VE KATEGORİ */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Başlık</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={productType === 'SERVICE' ? 'Örn: Termal Kameralı Kaçak Tespiti' : 'Örn: Hakiki Deri Klasik Ayakkabı'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Kategori / Sektör</label>
            <input
              type="text"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Örn: Tesisat, Ayakkabı, Sıcak Döner, Çekici..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 bg-white"
            />
          </div>
        </div>

        {/* 4. FİYAT VE KDV ORANI */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {productType === 'SERVICE' ? 'Hizmet Bedeli (₺)' : 'Birim Fiyat (₺)'}
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">KDV Oranı (%)</label>
            <select
              value={vatRate}
              onChange={(e) => setVatRate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none cursor-pointer"
            >
              <option value="20">%20 (Genel Mal ve Hizmetler)</option>
              <option value="10">%10 (Yeme-İçme & Konaklama)</option>
              <option value="1">%1 (Temel Gıda / Bazı Toptan)</option>
              <option value="0">%0 (KDV Muaf)</option>
            </select>
          </div>
        </div>

        {/* Toptan B2B İse Ek Alanlar */}
        {productType === 'WHOLESALE' && (
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
            <span className="text-xs font-extrabold text-amber-900 block">Kademeli Toptan Fiyat Kurgusu</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-amber-900 block mb-1">Minimum Koli/Adet</label>
                <input
                  type="number"
                  value={minWholesaleQty}
                  onChange={(e) => setMinWholesaleQty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 text-xs bg-white text-slate-900 font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-amber-900 block mb-1">Toptan Birim Fiyat (₺)</label>
                <input
                  type="number"
                  value={wholesalePrice}
                  onChange={(e) => setWholesalePrice(e.target.value)}
                  placeholder="İndirimli Toptan Fiyat"
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 text-xs font-bold bg-white text-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {productType !== 'SERVICE' && (
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Stok Miktarı</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-indigo-950 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <PlusCircle className="w-4 h-4 text-amber-400" />
          {isSubmitting ? 'Kaydediliyor...' : 'Vitrinde Anında Satışa Aç'}
        </button>
      </form>
    </div>
  );
}
