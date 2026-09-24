/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Shield, FileText, Lock, Cookie, RefreshCw, ArrowLeft } from 'lucide-react';
import { applyPageSEO } from '../utils/seo';

interface LegalPageProps {
  type: 'mesafeli-satis' | 'gizlilik' | 'kvkk' | 'cerez-politikasi' | 'iade-ve-degisim';
  onBack: () => void;
}

export default function LegalPages({ type, onBack }: LegalPageProps) {
  const titles = {
    'mesafeli-satis': 'Mesafeli Satış Sözleşmesi',
    'gizlilik': 'Gizlilik ve Güvenlik Politikası',
    'kvkk': 'KVKK Aydınlatma Metni',
    'cerez-politikasi': 'Çerez (Cookie) Politikası',
    'iade-ve-degisim': 'İade ve Değişim Koşulları'
  };

  useEffect(() => {
    applyPageSEO({
      pathname: `/${type}`,
      title: `${titles[type]} | TamPazar Yasal Mevzuat`,
      description: `TamPazar ${titles[type]}. 6502 sayılı Tüketicinin Korunması Kanunu ve UBL-TR e-Fatura mevzuatına uygun kurumsal şartlar.`
    });
  }, [type]);

  const icons = {
    'mesafeli-satis': FileText,
    'gizlilik': Shield,
    'kvkk': Lock,
    'cerez-politikasi': Cookie,
    'iade-ve-degisim': RefreshCw
  };

  const IconComponent = icons[type] || FileText;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-indigo-900 bg-slate-100 px-3.5 py-2 rounded-xl transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Ana Sayfaya Dön
          </button>
          <span className="text-xs font-mono text-slate-400">tampazar.com Yasal Mevzuat</span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 md:p-12 space-y-8">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-900 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-100">
              <IconComponent className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900">{titles[type]}</h1>
              <p className="text-xs text-slate-500 mt-1">Son Güncelleme Tarihi: 23 Eylül 2026 · 6502 Sayılı Tüketicinin Korunması Hakkında Kanun ve UBL-TR Mevzuatına Uygundur.</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-xs md:text-sm text-slate-600 space-y-6 leading-relaxed">
            {type === 'mesafeli-satis' && (
              <>
                <h3 className="text-base font-bold text-slate-900">MADDE 1 - TARAFLAR</h3>
                <p>İşbu Sözleşme, 6502 Sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümsüzlüklerine uygun olarak, satıcı esnaf ile alıcı tüketici arasında dijital ortamda kurulmuştur.</p>
                <h3 className="text-base font-bold text-slate-900">MADDE 2 - KONU</h3>
                <p>İşbu sözleşmenin konusu, Alıcı'nın Satıcı'ya ait tampazar.com üzerinden elektronik ortamda siparişini yaptığı mal/hizmetin satışı ve teslimi ile ilgili olarak tarafların hak ve yükümlülüklerinin belirlenmesidir.</p>
                <h3 className="text-base font-bold text-slate-900">MADDE 3 - ÖDEME VE TESLİMAT</h3>
                <p>Ödemeler doğrudan ilgili esnafın kendi Sanal POS altyapısı (BYO POS) veya TamPazar güvenli ödeme havuzu üzerinden gerçekleştirilir. Fatura, GİB e-Fatura mevzuatına uygun olarak Alıcı'nın e-posta adresine iletilir.</p>
              </>
            )}

            {type === 'gizlilik' && (
              <>
                <h3 className="text-base font-bold text-slate-900">1. Veri Güvenliği Prensibi</h3>
                <p>tampazar.com, alıcıların ve esnaf satıcıların gizliliğini korumayı taahhüt eder. Tüm finansal işlemler 256-bit SSL şifreleme ve PCI-DSS uyumlu güvenli ağlarda saklanır.</p>
                <h3 className="text-base font-bold text-slate-900">2. Bilgi Toplama ve Kullanımı</h3>
                <p>Sipariş ve faturalandırma süreçleri için gerekli olan ad, soyad, vergi dairesi/no, adres ve iletişim bilgileri yalnızca ilgili yasal zorunluluklar ve lojistik teslimat amacıyla işlenir.</p>
              </>
            )}

            {type === 'kvkk' && (
              <>
                <h3 className="text-base font-bold text-slate-900">Kişisel Verilerin Korunması Kanunu Aydınlatma Metni</h3>
                <p>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, tampazar.com veri sorumlusu sıfatıyla, kişisel verilerinizi e-ticaret faaliyetlerinin yürütülmesi, GİB e-fatura düzenlenmesi ve müşteri memnuniyeti amaçlarıyla işlemektedir.</p>
                <p>Haklarınız: KVKK madde 11 uyarınca şirketimize başvurarak verilerinizin silinmesini, düzeltilmesini veya işlenme amacını öğrenme hakkına sahipsiniz.</p>
              </>
            )}

            {type === 'cerez-politikasi' && (
              <>
                <h3 className="text-base font-bold text-slate-900">Çerez (Cookie) Politikası</h3>
                <p>tampazar.com platformunda alışveriş sepetinizin hatırlanması, oturum güvenliğinizin sağlanması ve performans analizlerinin yapılması için çerezler kullanılmaktadır.</p>
              </>
            )}

            {type === 'iade-ve-degisim' && (
              <>
                <h3 className="text-base font-bold text-slate-900">1. Cayma Hakkı</h3>
                <p>Alıcı, mal satışına ilişkin mesafeli sözleşmelerde, ürünü teslim aldığı tarihten itibaren 14 (on dört) gün içinde hiçbir gerekçe göstermeksizin ve cezai şart ödemeksizin cayma hakkını kullanabilir.</p>
                <h3 className="text-base font-bold text-slate-900">2. İade Şartları</h3>
                <p>İade edilecek ürünlerin kutusu, ambalajı ve varsa standart aksesuarları ile birlikte eksiksiz ve hasarsız olarak ilgili esnafın işletme adresine gönderilmesi gerekmektedir.</p>
              </>
            )}
          </div>

          <div className="pt-8 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>TamPazar Hukuk ve Uyum Birimi</span>
            <span>destek@tampazar.com</span>
          </div>
        </div>
      </main>
    </div>
  );
}
