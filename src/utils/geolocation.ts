/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface UserLocation {
  lat: number;
  lng: number;
  city: string;
  district: string;
  label: string;
  source: 'gps' | 'preset' | 'default';
  accuracy?: number;
}

// Varsayılan Merkez: Ordu / Altınordu (Karadeniz Esnaf Merkezi)
export const DEFAULT_USER_LOCATION: UserLocation = {
  lat: 40.9839,
  lng: 37.8764,
  city: 'Ordu',
  district: 'Altınordu',
  label: 'Ordu, Altınordu (Merkez)',
  source: 'default'
};

// Popüler İlçe / Bölge Ön Tanımları
export const PRESET_LOCATIONS: UserLocation[] = [
  { lat: 40.9839, lng: 37.8764, city: 'Ordu', district: 'Altınordu', label: 'Ordu / Altınordu', source: 'preset' },
  { lat: 41.0263, lng: 37.4988, city: 'Ordu', district: 'Fatsa', label: 'Ordu / Fatsa', source: 'preset' },
  { lat: 41.1306, lng: 37.2842, city: 'Ordu', district: 'Ünye', label: 'Ordu / Ünye', source: 'preset' },
  { lat: 40.9128, lng: 38.3895, city: 'Giresun', district: 'Merkez', label: 'Giresun / Merkez', source: 'preset' },
  { lat: 40.9912, lng: 29.0270, city: 'İstanbul', district: 'Kadıköy', label: 'İstanbul / Kadıköy', source: 'preset' }
];

/**
 * Haversine Formülü ile iki koordinat arası kuş uçuşu mesafeyi (KM) hesaplar
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  if (lat1 === lat2 && lon1 === lon2) return 0;
  
  const R = 6371; // Dünya yarıçapı (km)
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return parseFloat(distance.toFixed(1));
}

/**
 * Mesafeyi insan dostu etiket formatına dönüştürür
 */
export function formatDistance(km: number): { text: string; badge: string; isNearby: boolean } {
  if (km <= 0.5) {
    return {
      text: `${Math.round(km * 1000)} m`,
      badge: 'Mahallende (Çok Yakın)',
      isNearby: true
    };
  }
  if (km <= 2.5) {
    return {
      text: `${km} km`,
      badge: `${km} km yakınında`,
      isNearby: true
    };
  }
  if (km <= 10) {
    return {
      text: `${km} km`,
      badge: `${km} km · Aynı Şehir`,
      isNearby: false
    };
  }
  return {
    text: `${km} km`,
    badge: `${km} km mesafede`,
    isNearby: false
  };
}
