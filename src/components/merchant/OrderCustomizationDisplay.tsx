/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Copy, Check, Download, Image as ImageIcon, FileText, 
  Utensils, Scale, AlertCircle, Sparkles, CheckCircle2, ExternalLink
} from 'lucide-react';
import { OrderItemCustomization } from '../../data/hybridCommerceData';

interface OrderCustomizationDisplayProps {
  customization?: OrderItemCustomization;
  itemTitle?: string;
}

export default function OrderCustomizationDisplay({ 
  customization, 
  itemTitle 
}: OrderCustomizationDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [zipDownloaded, setZipDownloaded] = useState(false);

  if (!customization) return null;

  const hasWeight = customization.selectedWeightOrQty !== undefined && customization.unitLabel && customization.unitLabel.toLowerCase() !== 'adet';
  const hasRemoved = customization.removedIngredients && customization.removedIngredients.length > 0;
  const hasAdded = customization.addedIngredients && customization.addedIngredients.length > 0;
  const hasMandatory = customization.selectedMandatoryOptions && customization.selectedMandatoryOptions.length > 0;
  const hasFiles = customization.uploadedFiles && customization.uploadedFiles.length > 0;
  const hasForm = customization.customFormValues && customization.customFormValues.length > 0;

  if (!hasWeight && !hasRemoved && !hasAdded && !hasMandatory && !hasFiles && !hasForm) {
    return null;
  }

  // Copy custom form text to clipboard
  const handleCopyFormText = () => {
    if (!customization.customFormValues) return;
    const formatted = customization.customFormValues
      .map(f => `${f.fieldLabel}: ${f.value}`)
      .join('\n');
    
    navigator.clipboard.writeText(`--- ${itemTitle || 'Sipariş'} Özel Form Bilgileri ---\n${formatted}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulate ZIP download for customer uploaded photos
  const handleDownloadZip = () => {
    setDownloadingZip(true);
    setTimeout(() => {
      setDownloadingZip(false);
      setZipDownloaded(true);
      // Trigger dummy anchor download
      const element = document.createElement('a');
      const file = new Blob([`TamPazar Musteri Dosyalari - ${itemTitle || 'Baski'}\nDosyalar:\n${(customization.uploadedFiles || []).map(f => f.name).join('\n')}`], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${(itemTitle || 'musteri_dosyalari').toLowerCase().replace(/[^a-z0-9]+/g, '_')}_baski_arsivi.zip`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      setTimeout(() => setZipDownloaded(false), 3000);
    }, 900);
  };

  return (
    <div className="mt-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
      
      {/* 1. TARTILI ÖLÇÜ / GRAMAJ GÖSTERİMİ */}
      {hasWeight && (
        <div className="flex items-center gap-1.5 text-slate-800 font-bold bg-amber-50 text-amber-900 px-2.5 py-1 rounded-xl border border-amber-200 w-fit">
          <Scale className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Tartı / Miktar: <strong className="text-amber-950 font-black">{customization.selectedWeightOrQty} {customization.unitLabel}</strong></span>
        </div>
      )}

      {/* 2. YEMEK MUTFAK FİŞİ (ÇIKARILANLAR & EKLENENLER) */}
      {(hasRemoved || hasAdded || hasMandatory) && (
        <div className="space-y-1.5 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-slate-500">
            <Utensils className="w-3 h-3 text-indigo-600" />
            <span>Mutfak Hazırlık Fişi</span>
          </div>

          {/* Çıkarılan Malzemeler (Kırmızı Rozetler) */}
          {hasRemoved && (
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[11px] font-bold text-rose-700">İstenmeyen (Çıkarılacak):</span>
              {customization.removedIngredients!.map((ing, i) => (
                <span 
                  key={i} 
                  className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-lg text-[10px] font-bold line-through"
                >
                  {ing}
                </span>
              ))}
            </div>
          )}

          {/* Eklenen Ekstralar (Yeşil Rozetler) */}
          {hasAdded && (
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[11px] font-bold text-emerald-700">Ekstra Malzemeler:</span>
              {customization.addedIngredients!.map((ext, i) => (
                <span 
                  key={i} 
                  className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1"
                >
                  <span>+{ext.name}</span>
                  <span className="text-emerald-600 text-[9px]">(+{ext.price} ₺)</span>
                </span>
              ))}
            </div>
          )}

          {/* Zorunlu Tercihler (Acı / İçecek) */}
          {hasMandatory && (
            <div className="flex flex-wrap items-center gap-1 pt-0.5">
              {customization.selectedMandatoryOptions!.map((opt, i) => (
                <span 
                  key={i} 
                  className="bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded-lg text-[10px] font-medium"
                >
                  <strong>{opt.groupTitle}:</strong> {opt.optionName} {opt.priceDiff ? `(+${opt.priceDiff} ₺)` : ''}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. FOTOĞRAF BASKI / DOSYA YÜKLEME ALANI */}
      {hasFiles && (
        <div className="bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-xs">
              <ImageIcon className="w-4 h-4 text-indigo-600" />
              <span>Müşterinin Yüklediği Fotoğraflar ({customization.uploadedFiles!.length} Dosya)</span>
            </div>

            <button
              type="button"
              onClick={handleDownloadZip}
              disabled={downloadingZip}
              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
            >
              {downloadingZip ? (
                <span>Hazırlanıyor...</span>
              ) : zipDownloaded ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>İndirildi ✓</span>
                </>
              ) : (
                <>
                  <Download className="w-3 h-3" />
                  <span>ZIP Olarak İndir</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {customization.uploadedFiles!.map((file, idx) => (
              <div 
                key={idx} 
                className="bg-white p-1.5 rounded-lg border border-indigo-100 flex items-center gap-2 overflow-hidden shadow-2xs"
              >
                {file.previewUrl ? (
                  <img 
                    src={file.previewUrl} 
                    alt={file.name} 
                    className="w-8 h-8 rounded object-cover shrink-0 border border-slate-200" 
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center font-mono font-bold text-[9px] shrink-0">
                    ZIP
                  </div>
                )}
                <div className="truncate min-w-0">
                  <p className="text-[10px] font-bold text-slate-800 truncate" title={file.name}>{file.name}</p>
                  <p className="text-[9px] text-slate-400">{file.size}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. MATBAA, DAVETİYE & KİŞİYE ÖZEL FORM ALANLARI */}
      {hasForm && (
        <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-amber-950 font-bold text-xs">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>Kişiye Özel Baskı / Davetiye Bilgileri</span>
            </div>

            <button
              type="button"
              onClick={handleCopyFormText}
              className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
              title="Grafik tasarım veya matbaa için tüm bilgileri panoya kopyala"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700">Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-amber-700" />
                  <span>Metinleri Kopyala</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-white rounded-lg border border-amber-200/80 overflow-hidden">
            <table className="w-full text-left text-[11px]">
              <tbody className="divide-y divide-amber-100">
                {customization.customFormValues!.map((fld, idx) => (
                  <tr key={idx} className="hover:bg-amber-50/40">
                    <td className="py-1.5 px-2.5 font-bold text-slate-500 bg-slate-50/50 w-1/3 border-r border-amber-100">
                      {fld.fieldLabel}
                    </td>
                    <td className="py-1.5 px-2.5 font-semibold text-slate-900 select-all">
                      {fld.value || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
