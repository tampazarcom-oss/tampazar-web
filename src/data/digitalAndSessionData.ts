/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ==========================================================
// TAMDİJİTAL & TAMSEANS MODELLERİ VE KALICI DEPOLAMA MOTORU
// ==========================================================

export interface DigitalPurchaseRecord {
  id: string;
  orderId: string;
  productId: string;
  productTitle: string;
  productImage: string;
  storeName: string;
  downloadUrl: string;
  fileName: string;
  fileSize: string;
  formatTags: string[];
  licenseType: 'personal' | 'commercial';
  purchasedAt: string;
  downloadCount: number;
  customerEmail: string;
  checksum?: string;
  version?: string;
}

export interface OnlineAppointmentRecord {
  id: string;
  orderId: string;
  productId: string;
  serviceTitle: string;
  serviceImage: string;
  merchantId: string;
  storeName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string; // '24 Eylül 2026' or YYYY-MM-DD
  timeSlot: string; // '14:00 - 14:45'
  durationMin: number;
  channel: 'google_meet' | 'zoom' | 'whatsapp_phone';
  meetingLink: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  expertTitle?: string;
}

// -----------------------------------------------------------
// BAŞLANGIÇ MOCK VERİLERİ (İLK ÇALIŞMADA YÜKLENİR)
// -----------------------------------------------------------

export const initialDigitalPurchases: DigitalPurchaseRecord[] = [
  {
    id: 'dig-rec-1',
    orderId: 'TPZ-DIG-2026-9041',
    productId: 'dig-prod-101',
    productTitle: 'Geleneksel Maraş İşi Çiçekli Nakış Deseni Paketi',
    productImage: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=600&auto=format&fit=crop&q=80',
    storeName: 'Atölye Zanaat',
    downloadUrl: '#download-maras-nakis-v2',
    fileName: 'Maras_Isi_Nakis_Paketi_v2.1.zip',
    fileSize: '14.8 MB',
    formatTags: ['DST', 'PES', 'JEF', 'EXP', 'PDF Kılavuz'],
    licenseType: 'commercial',
    purchasedAt: '24 Eylül 2026 10:15',
    downloadCount: 3,
    customerEmail: 'musteri@tampazar.com',
    checksum: 'SHA256: 8a4f...3c99',
    version: 'v2.1'
  },
  {
    id: 'dig-rec-2',
    orderId: 'TPZ-DIG-2026-9042',
    productId: 'dig-prod-102',
    productTitle: 'CNC & Lazer Kesim Geometrik Ahşap Duvar Tablosu',
    productImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
    storeName: 'Atölye Zanaat',
    downloadUrl: '#download-cnc-wallart',
    fileName: 'Geometrik_Duvar_Paneli_Vektorel.zip',
    fileSize: '8.4 MB',
    formatTags: ['DXF', 'SVG', 'CDR', 'AI', 'PDF'],
    licenseType: 'commercial',
    purchasedAt: '23 Eylül 2026 16:40',
    downloadCount: 1,
    customerEmail: 'musteri@tampazar.com',
    checksum: 'SHA256: d1e7...481b',
    version: 'v1.4'
  },
  {
    id: 'dig-rec-3',
    orderId: 'TPZ-DIG-2026-9043',
    productId: 'dig-prod-103',
    productTitle: '3D Yazıcı Baskıya Hazır Mitolojik Heykel STL Modeli',
    productImage: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
    storeName: 'Mega Endüstriyel',
    downloadUrl: '#download-stl-statue',
    fileName: 'Zeus_Bust_HighPoly_PreSupported.stl',
    fileSize: '42.6 MB',
    formatTags: ['STL', 'OBJ', '3MF', 'Destekli Çıktı'],
    licenseType: 'personal',
    purchasedAt: '22 Eylül 2026 11:20',
    downloadCount: 2,
    customerEmail: 'musteri@tampazar.com',
    checksum: 'SHA256: e80b...99ca',
    version: 'v1.0'
  }
];

export const initialOnlineAppointments: OnlineAppointmentRecord[] = [
  {
    id: 'apt-rec-1',
    orderId: 'TPZ-SNS-2026-4011',
    productId: 'sns-prod-201',
    serviceTitle: 'Bireysel Kariyer & E-Ticaret İşletme Danışmanlığı',
    serviceImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    merchantId: 's3',
    storeName: 'FotoSentez Stüdyo & Danışmanlık',
    customerName: 'Alperen Yılmaz',
    customerEmail: 'alperen@gmail.com',
    customerPhone: '0532 999 88 77',
    date: 'Bugün (24 Eylül 2026)',
    timeSlot: '15:00 - 15:45',
    durationMin: 45,
    channel: 'google_meet',
    meetingLink: 'https://meet.google.com/tpz-danisman-alperen',
    status: 'confirmed',
    notes: 'Yeni açılacak e-ticaret markasının ürün fotoğrafçılığı ve TamPazar entegrasyonu hakkında stratejik planlama.',
    createdAt: '24 Eylül 2026 09:30',
    expertTitle: 'Kıdemli E-Ticaret Danışmanı'
  },
  {
    id: 'apt-rec-2',
    orderId: 'TPZ-SNS-2026-4012',
    productId: 'sns-prod-202',
    serviceTitle: 'Klinik Diyetisyen Online Beslenme & Yaşam Seansı',
    serviceImage: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80',
    merchantId: 'tenant-3',
    storeName: 'Bursa Spa & Sağlık',
    customerName: 'Zeynep Kaya',
    customerEmail: 'zeynep.kaya@gmail.com',
    customerPhone: '0533 444 33 22',
    date: 'Yarın (25 Eylül 2026)',
    timeSlot: '11:00 - 11:45',
    durationMin: 45,
    channel: 'google_meet',
    meetingLink: 'https://meet.google.com/tpz-diyet-zeynep',
    status: 'confirmed',
    notes: 'Kişiye özel haftalık metabolik beslenme listesi hazırlanması.',
    createdAt: '23 Eylül 2026 14:10',
    expertTitle: 'Uzman Diyetisyen & Beslenme Koçu'
  },
  {
    id: 'apt-rec-3',
    orderId: 'TPZ-SNS-2026-4013',
    productId: 'sns-prod-203',
    serviceTitle: 'Almanca Birebir Canlı Konuşma & Sınav Hazırlık Dersi',
    serviceImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80',
    merchantId: 's1',
    storeName: 'Atölye Zanaat & Eğitim',
    customerName: 'Mehmet Demir',
    customerEmail: 'mehmet.demir@gmail.com',
    customerPhone: '0544 222 11 00',
    date: '26 Eylül 2026 Cumartesi',
    timeSlot: '16:00 - 17:00',
    durationMin: 60,
    channel: 'google_meet',
    meetingLink: 'https://meet.google.com/tpz-almanca-mehmet',
    status: 'confirmed',
    notes: 'Goethe B2 sınavına hazırlık konuşma modülü alıştırmaları.',
    createdAt: '22 Eylül 2026 18:00',
    expertTitle: 'Yeminli Tercüman & Dil Eğitmeni'
  }
];

// -----------------------------------------------------------
// YEREL DEPOLAMA (LOCAL STORAGE) ERİŞİM FONKSİYONLARI
// -----------------------------------------------------------

export const getStoredDigitalPurchases = (): DigitalPurchaseRecord[] => {
  try {
    const saved = localStorage.getItem('tampazar_digital_purchases');
    if (!saved) {
      localStorage.setItem('tampazar_digital_purchases', JSON.stringify(initialDigitalPurchases));
      return initialDigitalPurchases;
    }
    return JSON.parse(saved);
  } catch {
    return initialDigitalPurchases;
  }
};

export const saveDigitalPurchases = (list: DigitalPurchaseRecord[]) => {
  try {
    localStorage.setItem('tampazar_digital_purchases', JSON.stringify(list));
    window.dispatchEvent(new Event('tampazar_digital_updated'));
  } catch (e) {
    console.error('saveDigitalPurchases error:', e);
  }
};

export const addDigitalPurchase = (purchase: Omit<DigitalPurchaseRecord, 'id' | 'purchasedAt' | 'downloadCount'>): DigitalPurchaseRecord => {
  const current = getStoredDigitalPurchases();
  const newRecord: DigitalPurchaseRecord = {
    ...purchase,
    id: 'dig-rec-' + Date.now(),
    purchasedAt: new Date().toLocaleString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    downloadCount: 0
  };
  const updated = [newRecord, ...current];
  saveDigitalPurchases(updated);
  return newRecord;
};

// Aliases for compatibility
export const saveDigitalPurchaseRecord = (purchase: Partial<DigitalPurchaseRecord>): DigitalPurchaseRecord => {
  return addDigitalPurchase({
    orderId: purchase.orderId || `TPZ-DIG-${Date.now().toString().slice(-6)}`,
    productId: purchase.productId || 'dig-prod-101',
    productTitle: purchase.productTitle || 'Dijital Dosya Paketi',
    productImage: purchase.productImage || 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=600',
    storeName: purchase.storeName || 'Atölye Zanaat',
    downloadUrl: purchase.downloadUrl || '#download',
    fileName: purchase.fileName || 'dosya_paketi.zip',
    fileSize: purchase.fileSize || '14.8 MB',
    formatTags: purchase.formatTags || ['ZIP', 'PDF'],
    licenseType: purchase.licenseType || 'commercial',
    customerEmail: purchase.customerEmail || 'musteri@tampazar.com',
    checksum: purchase.checksum,
    version: purchase.version || 'v1.0'
  });
};

export const saveOnlineAppointmentRecord = (apt: Partial<OnlineAppointmentRecord>): OnlineAppointmentRecord => {
  return addOnlineAppointment({
    orderId: apt.orderId || `TPZ-APT-${Date.now().toString().slice(-6)}`,
    productId: apt.productId || 'sns-prod-201',
    serviceTitle: apt.serviceTitle || 'Online Danışmanlık Seansı',
    serviceImage: apt.serviceImage || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600',
    merchantId: apt.merchantId || 'tenant-1',
    storeName: apt.storeName || 'Uzman Danışmanlık',
    customerName: apt.customerName || 'Müşteri',
    customerEmail: apt.customerEmail || 'musteri@tampazar.com',
    customerPhone: apt.customerPhone || '0532 000 00 00',
    date: apt.date || 'Bugün',
    timeSlot: apt.timeSlot || '14:00 - 14:45',
    durationMin: apt.durationMin || 45,
    channel: apt.channel || 'google_meet',
    meetingLink: apt.meetingLink || 'https://meet.google.com/tpz-live-seans',
    notes: apt.notes || 'TamPazar üzerinden online randevu'
  });
};

export const incrementDigitalDownload = (recordId: string): boolean => {
  const current = getStoredDigitalPurchases();
  const index = current.findIndex(c => c.id === recordId);
  if (index !== -1) {
    current[index].downloadCount += 1;
    saveDigitalPurchases([...current]);
    return true;
  }
  return false;
};

export const getStoredOnlineAppointments = (): OnlineAppointmentRecord[] => {
  try {
    const saved = localStorage.getItem('tampazar_online_appointments');
    if (!saved) {
      localStorage.setItem('tampazar_online_appointments', JSON.stringify(initialOnlineAppointments));
      return initialOnlineAppointments;
    }
    return JSON.parse(saved);
  } catch {
    return initialOnlineAppointments;
  }
};

export const saveOnlineAppointments = (list: OnlineAppointmentRecord[]) => {
  try {
    localStorage.setItem('tampazar_online_appointments', JSON.stringify(list));
    window.dispatchEvent(new Event('tampazar_appointments_updated'));
  } catch (e) {
    console.error('saveOnlineAppointments error:', e);
  }
};

export const addOnlineAppointment = (apt: Omit<OnlineAppointmentRecord, 'id' | 'createdAt' | 'status'>): OnlineAppointmentRecord => {
  const current = getStoredOnlineAppointments();
  const newRecord: OnlineAppointmentRecord = {
    ...apt,
    id: 'apt-rec-' + Date.now(),
    createdAt: new Date().toLocaleString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    status: 'confirmed'
  };
  const updated = [newRecord, ...current];
  saveOnlineAppointments(updated);
  return newRecord;
};

export const updateAppointmentStatus = (id: string, status: 'confirmed' | 'completed' | 'cancelled') => {
  const current = getStoredOnlineAppointments();
  const updated = current.map(item => item.id === id ? { ...item, status } : item);
  saveOnlineAppointments(updated);
};

// Gerçek tarayıcı indirme tetikleme yardımcısı
export const triggerBrowserDownload = (fileName: string, contentNote: string = 'TamPazar Dijital Ürün Lisanslı Dosya İçeriği') => {
  const dummyBlob = new Blob([
    `TAMPAZAR DIJITAL TESLIMAT SERTIFIKASI & LISANS KODU\n`,
    `Dosya Adı: ${fileName}\n`,
    `Tarih: ${new Date().toISOString()}\n`,
    `Lisans: TamPazar Doğrudan Esnaf Tescilli Lisans\n`,
    `Durum: Doğrulandı ve Güvenle İndirildi.\n\n`,
    `İçerik Açıklaması: ${contentNote}\n\n`,
    `Bu dosya TamPazar %0 Komisyonlu E-Ticaret Altyapısı üzerinden yasal faturasıyla teslim edilmiştir.`
  ], { type: 'text/plain;charset=utf-8' });

  const url = URL.createObjectURL(dummyBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
