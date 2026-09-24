/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CourierVehicleType = 'MOTORCYCLE' | 'BICYCLE_SCOOTER' | 'VAN' | 'ON_FOOT';

export interface CourierPricingTariff {
  basePackagePrice: number;       // Açılış / Minimum Paket Ücreti (₺)
  perKmRate: number;              // KM Başına Ek Ücret (₺/km)
  rainHeavyTrafficMultiplier: number; // Yağmurlu / Yoğun Saat Çarpanı (örn: 1.25 veya 1.5)
  dailyDedicatedFee: number;      // Saatlik/Günlük Tahsisli Çalışma Ücreti (₺/gün)
  hourlyDedicatedFee?: number;    // Saatlik Tahsisli Ücret (₺/saat)
}

export interface CourierProfile {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  whatsapp: string;
  city: string;
  district: string;
  neighborhoods: string[];
  vehicleType: CourierVehicleType;
  vehiclePlateOrModel: string;
  status: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  isLicenseAndSrcVerified: boolean;
  isCriminalRecordClean: boolean;
  rating: number;
  reviewCount: number;
  completedDeliveries: number;
  distanceMeters?: number;        // Esnafa tahmini kuş uçuşu/yol mesafesi
  etaMinutes?: number;            // Esnafın kapısına varış süresi
  iban?: string;
  bankName?: string;
  tariff: CourierPricingTariff;
  bio?: string;
  registeredAt: string;
}

export interface CourierBidOffer {
  id: string;
  courierId: string;
  courierName: string;
  courierVehicle: CourierVehicleType;
  courierRating: number;
  courierPhone: string;
  offeredPrice: number;
  estimatedArrivalMin: number;
  note?: string;
  createdAt: string;
}

export interface CourierPoolRequest {
  id: string;
  orderId?: string;
  orderNumber?: string;
  storeName: string;
  storePhone: string;
  pickupAddress: string;
  pickupDistrict: string;
  deliveryAddress: string;
  deliveryDistrict: string;
  packageType: 'FOOD' | 'RETAIL' | 'HEAVY_PARCEL' | 'DOCUMENTS' | 'URGENT';
  distanceKm: number;
  targetBudget: number;
  note?: string;
  status: 'OPEN_FOR_BIDS' | 'ASSIGNED' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED';
  offers: CourierBidOffer[];
  selectedCourierId?: string;
  selectedCourierName?: string;
  finalAgreedPrice?: number;
  paymentMethod: 'CASH' | 'IBAN' | 'COURIER_POS';
  createdAt: string;
}

export const INITIAL_COURIERS: CourierProfile[] = [
  {
    id: 'kurye-01',
    name: 'Mert Aksoy',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    phone: '+90 532 211 44 55',
    whatsapp: '905322114455',
    city: 'Ordu',
    district: 'Altınordu',
    neighborhoods: ['Bahçelievler', 'Akyazı', 'Bucak', 'Şahincili', 'Düz Mahalle'],
    vehicleType: 'MOTORCYCLE',
    vehiclePlateOrModel: '52 ABC 341 (Honda Forza 250)',
    status: 'AVAILABLE',
    isLicenseAndSrcVerified: true,
    isCriminalRecordClean: true,
    rating: 4.9,
    reviewCount: 142,
    completedDeliveries: 420,
    distanceMeters: 650,
    etaMinutes: 4,
    iban: 'TR33 0006 2000 0001 2999 8888 01',
    bankName: 'Garanti BBVA',
    tariff: {
      basePackagePrice: 65,
      perKmRate: 12,
      rainHeavyTrafficMultiplier: 1.3,
      dailyDedicatedFee: 1400,
      hourlyDedicatedFee: 180
    },
    bio: 'Altınordu sahil ve çarşı hattında 4 yıldır aktif motokuryeyim. Termal çanta ve çift askılı sıcak teslimat ekipmanım mevcut.',
    registeredAt: '2024-03-12'
  },
  {
    id: 'kurye-02',
    name: 'Barış Karadağ',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    phone: '+90 541 333 77 88',
    whatsapp: '905413337788',
    city: 'Ordu',
    district: 'Altınordu',
    neighborhoods: ['Subaşı', 'Selimiye', 'Taşbaşı', 'Saray', 'Kirazlimanı'],
    vehicleType: 'MOTORCYCLE',
    vehiclePlateOrModel: '52 TP 890 (Yamaha NMAX 155)',
    status: 'AVAILABLE',
    isLicenseAndSrcVerified: true,
    isCriminalRecordClean: true,
    rating: 4.8,
    reviewCount: 98,
    completedDeliveries: 310,
    distanceMeters: 1100,
    etaMinutes: 7,
    iban: 'TR64 0001 5001 5800 7301 2233 44',
    bankName: 'VakıfBank',
    tariff: {
      basePackagePrice: 60,
      perKmRate: 11,
      rainHeavyTrafficMultiplier: 1.25,
      dailyDedicatedFee: 1300,
      hourlyDedicatedFee: 165
    },
    bio: 'Seri ve güvenli mahalle teslimatı. POS cihazım yanımda, temassız kredi kartı ödemesi alabilirim.',
    registeredAt: '2024-06-18'
  },
  {
    id: 'kurye-03',
    name: 'Kemal Yıldırım',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    phone: '+90 530 456 12 34',
    whatsapp: '905304561234',
    city: 'Ordu',
    district: 'Altınordu',
    neighborhoods: ['Organize Sanayi', 'Karapınar', 'Turnasuyu', 'Gülyalı'],
    vehicleType: 'VAN',
    vehiclePlateOrModel: '52 BD 105 (Ford Transit Custom)',
    status: 'AVAILABLE',
    isLicenseAndSrcVerified: true,
    isCriminalRecordClean: true,
    rating: 5.0,
    reviewCount: 64,
    completedDeliveries: 185,
    distanceMeters: 2400,
    etaMinutes: 12,
    iban: 'TR12 0001 0002 0003 0004 0005 06',
    bankName: 'Ziraat Bankası',
    tariff: {
      basePackagePrice: 180,
      perKmRate: 22,
      rainHeavyTrafficMultiplier: 1.15,
      dailyDedicatedFee: 2400,
      hourlyDedicatedFee: 320
    },
    bio: 'Koli, toptan çuval, mobilya ve hacimli eşyalar için hafif ticari panelvan araç ile kapıdan kapıya teslimat. SRC-4 & Psikoteknik tam.',
    registeredAt: '2024-01-10'
  },
  {
    id: 'kurye-04',
    name: 'Deniz Sönmez',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    phone: '+90 535 987 65 43',
    whatsapp: '905359876543',
    city: 'Ordu',
    district: 'Altınordu',
    neighborhoods: ['Akyazı Sahil', 'Bahçelievler', 'Çarşı'],
    vehicleType: 'BICYCLE_SCOOTER',
    vehiclePlateOrModel: 'Kugoo G-Booster E-Scooter',
    status: 'AVAILABLE',
    isLicenseAndSrcVerified: true,
    isCriminalRecordClean: true,
    rating: 4.9,
    reviewCount: 51,
    completedDeliveries: 140,
    distanceMeters: 800,
    etaMinutes: 6,
    iban: 'TR88 0006 4000 0011 2233 4455 66',
    bankName: 'İş Bankası',
    tariff: {
      basePackagePrice: 45,
      perKmRate: 8,
      rainHeavyTrafficMultiplier: 1.4,
      dailyDedicatedFee: 950,
      hourlyDedicatedFee: 120
    },
    bio: 'Çevre dostu elektrikli e-scooter ve kargo çantası. Sahil bandında trafik derdi olmadan 10 dakikada ekspres butik/yemek teslimi.',
    registeredAt: '2024-08-01'
  },
  {
    id: 'kurye-05',
    name: 'Serkan Öztürk',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
    phone: '+90 533 112 33 44',
    whatsapp: '905331123344',
    city: 'Ordu',
    district: 'Altınordu',
    neighborhoods: ['Fidangör Caddesi', 'Sırrıpaşa', 'Köprübaşı'],
    vehicleType: 'ON_FOOT',
    vehiclePlateOrModel: 'Yaya / Çarşı İçi Hızlı Evrak & Paket',
    status: 'BUSY',
    isLicenseAndSrcVerified: true,
    isCriminalRecordClean: true,
    rating: 4.7,
    reviewCount: 38,
    completedDeliveries: 95,
    distanceMeters: 400,
    etaMinutes: 5,
    tariff: {
      basePackagePrice: 40,
      perKmRate: 6,
      rainHeavyTrafficMultiplier: 1.2,
      dailyDedicatedFee: 800,
      hourlyDedicatedFee: 100
    },
    bio: 'Yayalaştırılmış Fidangör ve Sırrıpaşa caddelerinde dükkânlar arası anlık evrak, yedek parça ve hafif paket teslimatı.',
    registeredAt: '2024-09-05'
  }
];

export const INITIAL_COURIER_REQUESTS: CourierPoolRequest[] = [
  {
    id: 'pool-req-101',
    orderNumber: 'TPZ-EX-8821',
    storeName: 'Kuzey Fırın & Unlu Mamuller',
    storePhone: '+90 532 999 11 22',
    pickupAddress: 'Bucak Mah. Çarşı Cad. No: 14',
    pickupDistrict: 'Altınordu',
    deliveryAddress: 'Bahçelievler Mah. 102. Sokak No: 8 D: 4',
    deliveryDistrict: 'Altınordu',
    packageType: 'FOOD',
    distanceKm: 2.8,
    targetBudget: 75,
    note: 'Sıcak ekmek ve poğaça kolisi. Dikkatli taşınmalı.',
    status: 'OPEN_FOR_BIDS',
    offers: [
      {
        id: 'off-1',
        courierId: 'kurye-01',
        courierName: 'Mert Aksoy',
        courierVehicle: 'MOTORCYCLE',
        courierRating: 4.9,
        courierPhone: '+90 532 211 44 55',
        offeredPrice: 70,
        estimatedArrivalMin: 6,
        note: 'Dükkânın hemen yanındayım, 5 dakikada alırım.',
        createdAt: '5 dk önce'
      }
    ],
    paymentMethod: 'CASH',
    createdAt: '12 dk önce'
  },
  {
    id: 'pool-req-102',
    orderNumber: 'TPZ-RET-9044',
    storeName: 'Atölye Zanaat Kundura',
    storePhone: '+90 544 555 66 77',
    pickupAddress: 'Düz Mah. Süleyman Felek Cad. No: 42',
    pickupDistrict: 'Altınordu',
    deliveryAddress: 'Akyazı Mah. Sahil Evleri B Blok D: 12',
    deliveryDistrict: 'Altınordu',
    packageType: 'RETAIL',
    distanceKm: 4.2,
    targetBudget: 90,
    note: '2 Kutu özel dikim deri ayakkabı paketi.',
    status: 'OPEN_FOR_BIDS',
    offers: [],
    paymentMethod: 'IBAN',
    createdAt: '25 dk önce'
  }
];

// Helper to load and persist couriers
export function getStoredCouriers(): CourierProfile[] {
  try {
    const raw = localStorage.getItem('tampazar_couriers');
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_COURIERS;
}

export function saveStoredCouriers(couriers: CourierProfile[]) {
  try {
    localStorage.setItem('tampazar_couriers', JSON.stringify(couriers));
    window.dispatchEvent(new CustomEvent('tampazar_couriers_updated'));
  } catch {}
}

// Helper to load and persist pool requests
export function getStoredCourierRequests(): CourierPoolRequest[] {
  try {
    const raw = localStorage.getItem('tampazar_courier_requests');
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_COURIER_REQUESTS;
}

export function saveStoredCourierRequests(requests: CourierPoolRequest[]) {
  try {
    localStorage.setItem('tampazar_courier_requests', JSON.stringify(requests));
    window.dispatchEvent(new CustomEvent('tampazar_courier_requests_updated'));
  } catch {}
}

// Helper to get active user's courier profile
export function getMyCourierProfile(): CourierProfile | null {
  try {
    const raw = localStorage.getItem('tampazar_my_courier_profile');
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function saveMyCourierProfile(profile: CourierProfile) {
  try {
    localStorage.setItem('tampazar_my_courier_profile', JSON.stringify(profile));
    
    // Also sync to global couriers list
    const couriers = getStoredCouriers();
    const idx = couriers.findIndex(c => c.id === profile.id);
    if (idx >= 0) {
      couriers[idx] = profile;
    } else {
      couriers.unshift(profile);
    }
    saveStoredCouriers(couriers);
    window.dispatchEvent(new CustomEvent('tampazar_couriers_updated'));
  } catch {}
}

/**
 * WhatsApp Görev Fişi Oluşturucu
 * Sistem komisyonsuz doğrudan mutabakat sağlar
 */
export function generateCourierWhatsAppUrl(
  courierPhone: string,
  data: {
    orderNumber?: string;
    storeName: string;
    storePhone?: string;
    pickupAddress: string;
    deliveryAddress: string;
    customerName?: string;
    customerPhone?: string;
    packageType?: string;
    agreedPrice: number;
    paymentMethod: string;
    notes?: string;
  }
): string {
  const cleanPhone = courierPhone.replace(/[^0-9]/g, '');
  const msg = `🛵 *TamKurye Görev & Teslimat Fişi* (%0 Komisyon)

📋 *Sipariş No:* #${data.orderNumber || 'HIZLI-TESLİMAT'}
🏪 *Esnaf/Mağaza:* ${data.storeName} (${data.storePhone || ''})
📍 *Paket Alış Noktası:* ${data.pickupAddress}

🏠 *Müşteri Teslim Noktası:* ${data.deliveryAddress}
👤 *Alıcı:* ${data.customerName || 'Mahalle Sakini'} (${data.customerPhone || 'Bilgi esnafta'})
📦 *Paket Türü:* ${data.packageType || 'Genel Paket'}

💰 *Kurye Hizmet Ücreti:* ₺${data.agreedPrice}
💳 *Ödeme Mutabakatı:* ${data.paymentMethod} (Doğrudan Esnaf <-> Kurye)
${data.notes ? `📝 *Not:* ${data.notes}\n` : ''}
⚡ *TamPazar Açık Kurye Ağı:* Komisyonsuz doğrudan mahalle dayanışması.`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
}

export function getVehicleTypeLabel(type: CourierVehicleType): string {
  switch (type) {
    case 'MOTORCYCLE': return 'Motosiklet';
    case 'BICYCLE_SCOOTER': return 'Bisiklet / E-Scooter';
    case 'VAN': return 'Hafif Ticari / Panelvan';
    case 'ON_FOOT': return 'Yaya / Çarşı İçi';
    default: return 'Kurye';
  }
}

export function getVehicleTypeIconEmoji(type: CourierVehicleType): string {
  switch (type) {
    case 'MOTORCYCLE': return '🛵';
    case 'BICYCLE_SCOOTER': return '🛴';
    case 'VAN': return '🚐';
    case 'ON_FOOT': return '🚶';
    default: return '📦';
  }
}
