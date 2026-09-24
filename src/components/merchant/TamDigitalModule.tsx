/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Download, FileCode, CheckCircle2, ShieldCheck, 
  Upload, Sparkles, ExternalLink, RefreshCw, Eye, 
  Search, Filter, Plus, ArrowUpRight, Check, AlertCircle, 
  FileCheck, Clock, HardDrive, Award, Lock
} from 'lucide-react';
import { 
  getStoredDigitalPurchases, 
  saveDigitalPurchases, 
  DigitalPurchaseRecord, 
  triggerBrowserDownload 
} from '../../data/digitalAndSessionData';
import { Product } from '../../data/mockData';

interface TamDigitalModuleProps {
  products: Product[];
  onOpenNewProductModal?: () => void;
}

export default function TamDigitalModule({ products, onOpenNewProductModal }: TamDigitalModuleProps) {
  const [purchases, setPurchases] = useState<DigitalPurchaseRecord[]>(() => getStoredDigitalPurchases());
  const [filterType, setFilterType] = useState<'all' | 'commercial' | 'personal'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // File update modal state
  const [selectedProductForUpdate, setSelectedProductForUpdate] = useState<Product | null>(null);
  const [updateVersion, setUpdateVersion] = useState('v2.2');
  const [updateNotes, setUpdateNotes] = useState('');
  const [updateFileName, setUpdateFileName] = useState('');
  const [updateFileSize, setUpdateFileSize] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccessToast, setUpdateSuccessToast] = useState('');

  // Lisans modal state
  const [viewingLicense, setViewingLicense] = useState<DigitalPurchaseRecord | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setPurchases(getStoredDigitalPurchases());
    };
    window.addEventListener('tampazar_digital_updated', handleUpdate);
    return () => window.removeEventListener('tampazar_digital_updated', handleUpdate);
  }, []);

  // Filter digital products from merchant products
  const digitalProducts = products.filter(
    p => p.deliveryOptions?.type === 'digital_download' || p.type === 'digital'
  );

  // Stats
  const totalPurchasesCount = purchases.length;
  const totalDownloadsCount = purchases.reduce((sum, p) => sum + (p.downloadCount || 0), 0);
  const commercialLicenses = purchases.filter(p => p.licenseType === 'commercial').length;
  const personalLicenses = purchases.filter(p => p.licenseType === 'personal').length;
  const totalRevenue = digitalProducts.reduce((sum, p) => sum + (p.price * (p.salesCount || 1)), 0);

  // Filtered purchases
  const filteredPurchases = purchases.filter(item => {
    const matchesSearch = 
      item.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || item.licenseType === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleUpdateFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForUpdate) return;
    setIsUpdating(true);

    setTimeout(() => {
      setIsUpdating(false);
      setUpdateSuccessToast(`"${selectedProductForUpdate.title}" için ${updateVersion} sürümü başarıyla yayınlandı!`);
      setSelectedProductForUpdate(null);
      setTimeout(() => setUpdateSuccessToast(''), 4500);
    }, 800);
  };

  return (
    <div className="space-y-6">
      
      {/* SUCCESS TOAST */}
      {updateSuccessToast && (
        <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-lg flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold text-sm">{updateSuccessToast}</span>
          </div>
          <button 
            onClick={() => setUpdateSuccessToast('')}
            className="text-white/80 hover:text-white text-xs font-bold px-2 py-1"
          >
            Kapat
          </button>
        </div>
      )}

      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-xs font-bold border border-purple-400/30">
              <Download className="w-3.5 h-3.5 text-purple-300" />
              <span>TamDijital • Dijital Dosya & Tasarım Dağıtımı</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Dijital Dosya Satışları & İndirme Yönetimi
            </h2>
            <p className="text-purple-200/90 text-sm leading-relaxed">
              Nakış desenleri (DST, PES), CNC lazer kesim (DXF, SVG), 3D STL modelleri ve e-kitaplarınızı kargo maliyeti olmadan sıfır komisyonla satın. Müşterileriniz ödemeyi yaptığı anda güvenle indirsin.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onOpenNewProductModal && (
              <button
                type="button"
                onClick={onOpenNewProductModal}
                className="px-5 py-3 bg-purple-500 hover:bg-purple-400 text-white font-black text-xs rounded-2xl shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Dijital Ürün Ekle</span>
              </button>
            )}
          </div>
        </div>

        {/* STATS METRIC CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-purple-800/60">
          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-purple-200 font-medium block">Aktif Dijital Ürünler</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black">{digitalProducts.length}</span>
              <span className="text-xs text-purple-300">katalogda</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-purple-200 font-medium block">Toplam İndirme Sayısı</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black">{totalDownloadsCount}</span>
              <span className="text-xs text-emerald-300">başarılı teslim</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-purple-200 font-medium block">Ticari Lisans Oranı</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black">
                %{totalPurchasesCount > 0 ? Math.round((commercialLicenses / totalPurchasesCount) * 100) : 100}
              </span>
              <span className="text-xs text-purple-300">seri üretime uygun</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
            <span className="text-xs text-purple-200 font-medium block">Tahmini Dijital Ciro</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black font-mono">₺{totalRevenue.toLocaleString('tr-TR')}</span>
              <span className="text-xs text-emerald-300 font-bold">%0 Komisyon</span>
            </div>
          </div>
        </div>
      </div>

      {/* DİJİTAL ÜRÜN DOSYA YÖNETİMİ TABLOSU */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-purple-600" />
              <span>Satıştaki Dijital Dosyalar & Sürüm Yönetimi</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Dosyalarınız güncellendiğinde daha önce satın alan tüm müşteriler otomatik olarak en son sürümü indirebilir.
            </p>
          </div>
        </div>

        {digitalProducts.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-purple-200 rounded-3xl bg-purple-50/30">
            <FileCode className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <h4 className="font-black text-slate-900 text-base">Henüz Dijital Ürün Eklenmedi</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
              Nakış desenleri, lazer kesim şablonları veya 3D modellerinizi ekleyerek anında indirilebilir satışa başlayın.
            </p>
            {onOpenNewProductModal && (
              <button
                type="button"
                onClick={onOpenNewProductModal}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                + İlk Dijital Ürünü Yükle
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {digitalProducts.map(prod => {
              const formats = prod.deliveryOptions?.digitalFormats || ['ZIP', 'PDF'];
              const fileName = prod.deliveryOptions?.digitalFileName || `${prod.slug}.zip`;
              const fileSize = prod.deliveryOptions?.digitalFileSize || '12.4 MB';
              const license = prod.deliveryOptions?.licenseType || 'commercial';

              return (
                <div 
                  key={prod.id} 
                  className="p-4 rounded-2xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition bg-white flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <img 
                        src={prod.image} 
                        alt={prod.title} 
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0" 
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded uppercase font-mono">
                          {prod.sku}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-2 mt-1 leading-snug">
                          {prod.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-black text-slate-900 font-mono">
                            ₺{prod.price.toLocaleString('tr-TR')}
                          </span>
                          <span className="text-[11px] text-slate-400">•</span>
                          <span className="text-[11px] text-emerald-600 font-bold">
                            {prod.salesCount || 1} Satış
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Dosya ve Format Detayı */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700 truncate font-mono text-[11px]">
                          {fileName}
                        </span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold shrink-0">
                          {fileSize}
                        </span>
                      </div>

                      {/* Format Etiketleri */}
                      <div className="flex flex-wrap gap-1">
                        {formats.map(fmt => (
                          <span 
                            key={fmt} 
                            className="px-1.5 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold font-mono rounded"
                          >
                            {fmt}
                          </span>
                        ))}
                      </div>

                      {/* Lisans Bilgisi */}
                      <div className="flex items-center gap-1.5 pt-1 text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                        <span className="font-bold text-slate-800">
                          {license === 'commercial' ? 'Ticari Üretime Uygun' : 'Kişisel Kullanım'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Aksiyon Butonları */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        triggerBrowserDownload(fileName, `${prod.title} (Esnaf Test İndirmesi)`);
                      }}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Test İndir</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProductForUpdate(prod);
                        setUpdateFileName(fileName);
                        setUpdateFileSize(fileSize);
                      }}
                      className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs rounded-xl border border-purple-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Güncelle</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MÜŞTERİ İNDİRME GÜNLÜKLERİ & LİSANS DENETİMİ */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-indigo-600" />
              <span>Son Dijital Siparişler & İndirme Günlüğü</span>
            </h3>
            <p className="text-xs text-slate-500">
              Alıcıların indirme sayaçları, lisans doğrulama kodları ve teslimat kayıtları.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Müşteri veya dosya ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 w-44 sm:w-60"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none"
            >
              <option value="all">Tüm Lisanslar</option>
              <option value="commercial">Ticari Üretim</option>
              <option value="personal">Kişisel Kullanım</option>
            </select>
          </div>
        </div>

        {filteredPurchases.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            Kayıtlı dijital indirme işlemi bulunamadı.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Sipariş / Müşteri</th>
                  <th className="py-3 px-4">Satın Alınan Dosya</th>
                  <th className="py-3 px-4">Formatlar</th>
                  <th className="py-3 px-4">Lisans Tipi</th>
                  <th className="py-3 px-4 text-center">İndirme Sayacı</th>
                  <th className="py-3 px-4">Tarih</th>
                  <th className="py-3 px-4 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPurchases.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 font-mono">{rec.orderId}</div>
                      <div className="text-[11px] text-slate-500">{rec.customerEmail}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 line-clamp-1 max-w-xs">{rec.productTitle}</div>
                      <div className="text-[11px] font-mono text-purple-700">{rec.fileName} ({rec.fileSize})</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {rec.formatTags.map(f => (
                          <span key={f} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-mono text-[10px] rounded font-bold">
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        rec.licenseType === 'commercial' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        <ShieldCheck className="w-3 h-3" />
                        {rec.licenseType === 'commercial' ? 'Ticari Üretim' : 'Kişisel'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-black font-mono rounded-lg border border-emerald-200">
                        {rec.downloadCount} kez
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {rec.purchasedAt}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setViewingLicense(rec)}
                        className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition cursor-pointer"
                      >
                        Sertifika
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DOSYA GÜNCELLEME MODALI */}
      {selectedProductForUpdate && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-purple-600" />
                <h3 className="font-black text-slate-900 text-base">Dosya Sürümü Güncelle</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProductForUpdate(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-purple-50 rounded-2xl text-purple-900 text-xs">
              <strong>{selectedProductForUpdate.title}</strong> ürünü için yeni bir revizyon paketi yüklüyorsunuz. Bu işlem sonrasında geçmişteki tüm alıcılar yeni sürümü ücretsiz indirebilir.
            </div>

            <form onSubmit={handleUpdateFileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Yeni Sürüm Numarası
                </label>
                <input
                  type="text"
                  value={updateVersion}
                  onChange={(e) => setUpdateVersion(e.target.value)}
                  placeholder="Örn: v2.2 (Hata düzeltmeleri & yeni formatlar)"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Dosya Adı</label>
                  <input
                    type="text"
                    value={updateFileName}
                    onChange={(e) => setUpdateFileName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Yeni Boyut</label>
                  <input
                    type="text"
                    value={updateFileSize}
                    onChange={(e) => setUpdateFileSize(e.target.value)}
                    placeholder="Örn: 16.2 MB"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Sürüm Değişiklik Notları (Alıcılara Bildirilir)
                </label>
                <textarea
                  rows={3}
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                  placeholder="DST formatındaki atlama dikişleri optimize edildi, PES versiyonu eklendi..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedProductForUpdate(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Yükleniyor...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Sürümü Yayınla</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LİSANS SERTİFİKASI GÖRÜNTÜLEME MODALI */}
      {viewingLicense && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto text-purple-700">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-900 text-base">TamPazar Dijital Lisans Sertifikası</h3>
              <p className="text-xs text-slate-500">Doğrulanmış Esnaf Dijital Ürün Tescili</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Sipariş No:</span>
                <span className="font-bold font-mono text-slate-900">{viewingLicense.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Alıcı:</span>
                <span className="font-bold text-slate-900">{viewingLicense.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Lisans Tipi:</span>
                <span className="font-bold text-purple-700">
                  {viewingLicense.licenseType === 'commercial' ? 'Ticari Seri Üretime Uygun' : 'Kişisel Kullanım'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Doğrulama Hash:</span>
                <span className="font-mono text-[10px] text-slate-600">{viewingLicense.checksum || 'SHA256: 9e88...a21'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Toplam İndirme:</span>
                <span className="font-bold text-emerald-600">{viewingLicense.downloadCount} Kez</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 text-center leading-relaxed">
              Bu sertifika, alıcının söz konusu dijital varlığı sözleşmeye uygun şekilde kullanım hakkına sahip olduğunu yasal olarak belgeler.
            </div>

            <button
              type="button"
              onClick={() => setViewingLicense(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
