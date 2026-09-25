/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { Store, Navigation, MapPin, Truck, Phone, Star, ShieldCheck } from 'lucide-react';

export interface MapStoreMarker {
  id: string;
  name: string;
  category: string;
  rating?: number;
  lat: number;
  lng: number;
  address: string;
  phone?: string;
}

export interface MapCourierMarker {
  id: string;
  name: string;
  plate: string;
  lat: number;
  lng: number;
  status: 'AVAILABLE' | 'DELIVERING' | 'BUSY';
  phone?: string;
}

interface GoogleMapViewProps {
  apiKey?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  stores?: MapStoreMarker[];
  couriers?: MapCourierMarker[];
  height?: string;
  title?: string;
}

// Ordu / Altınordu Merkez Varsayılan Koordinatları
const DEFAULT_CENTER = { lat: 40.9833, lng: 37.8781 };

export default function GoogleMapView({
  apiKey,
  center = DEFAULT_CENTER,
  zoom = 13,
  stores = [],
  couriers = [],
  height = '420px',
  title = 'TamPazar Canlı Yerel Esnaf ve Kurye Haritası'
}: GoogleMapViewProps) {
  const mapsApiKey = apiKey 
    || (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) 
    || (typeof window !== 'undefined' ? (window as any).VITE_GOOGLE_MAPS_API_KEY : '')
    || '';

  const [selectedStore, setSelectedStore] = useState<MapStoreMarker | null>(null);
  const [selectedCourier, setSelectedCourier] = useState<MapCourierMarker | null>(null);

  // Demoda görsel zenginlik için varsayılan Esnaf Lokasyonları
  const defaultStores: MapStoreMarker[] = stores.length > 0 ? stores : [
    { id: 'st-1', name: 'Atölye Zanaat', category: 'Ahşap & Sanat', rating: 4.9, lat: 40.9850, lng: 37.8760, address: 'Bahçelievler Mah. Atatürk Bulvarı No: 42, Altınordu', phone: '+90 452 222 11 00' },
    { id: 'st-2', name: 'FotoSentez Stüdyo', category: 'Fotoğraf & Dijital Baskı', rating: 5.0, lat: 40.9820, lng: 37.8810, address: 'Düz Mahalle Süleyman Felek Cad. No: 18, Altınordu', phone: '+90 452 223 44 55' },
    { id: 'st-3', name: 'Fındık Diyarı Gurme', category: 'Yöresel & Şarküteri', rating: 4.8, lat: 40.9870, lng: 37.8730, address: 'Şahincili Mah. Zübeyde Hanım Cad. No: 94, Altınordu', phone: '+90 452 214 00 99' },
    { id: 'st-4', name: 'Karadeniz Butik', category: 'Giyim & Deri', rating: 4.7, lat: 40.9810, lng: 37.8790, address: 'Bucak Mah. İsmet Paşa Cad. No: 55, Altınordu', phone: '+90 532 100 20 30' }
  ];

  const defaultCouriers: MapCourierMarker[] = couriers.length > 0 ? couriers : [
    { id: 'cur-1', name: 'Mert Aksoy (Motokurye)', plate: '52 ABC 341', lat: 40.9840, lng: 37.8780, status: 'AVAILABLE', phone: '+90 532 211 44 55' },
    { id: 'cur-2', name: 'Gökhan Kaya (Elektrikli Bisiklet)', plate: '52 E-BIKE 12', lat: 40.9865, lng: 37.8720, status: 'DELIVERING', phone: '+90 542 900 88 11' }
  ];

  if (!mapsApiKey) {
    // API anahtarı yüklenene kadar veya harita önizlemesi olarak şık fallback kartı
    return (
      <div className="w-full bg-slate-900 rounded-3xl p-6 border border-slate-800 text-white shadow-xl relative overflow-hidden" style={{ minHeight: height }}>
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm">{title}</h3>
              <p className="text-xs text-slate-400">Canlı GPS Konum Takibi & Esnaf Lokasyonları</p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Akıllı Harita Entegre
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5" /> Bölgenizdeki Aktif Esnaflar ({defaultStores.length})
            </h4>
            <div className="space-y-2">
              {defaultStores.map((st) => (
                <div key={st.id} className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60 hover:border-indigo-500/50 transition">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-xs text-white">{st.name}</span>
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-amber-300" /> {st.rating}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" /> {st.address}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" /> Canlı Saha Kuryeleri ({defaultCouriers.length})
            </h4>
            <div className="space-y-2">
              {defaultCouriers.map((cr) => (
                <div key={cr.id} className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/60 hover:border-emerald-500/50 transition">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-white">{cr.name}</span>
                    <span className="text-[10px] bg-emerald-400/20 text-emerald-300 font-extrabold px-2 py-0.5 rounded-full">
                      {cr.plate}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-emerald-400 shrink-0" /> Durum: {cr.status === 'AVAILABLE' ? 'Göreve Hazır / Serbest' : 'Teslimatta'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-3xl overflow-hidden border border-slate-200 shadow-xl relative" style={{ height }}>
      <APIProvider apiKey={mapsApiKey}>
        <Map
          defaultCenter={center}
          defaultZoom={zoom}
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
          className="w-full h-full"
        >
          {/* Esnaf Pinleri */}
          {defaultStores.map((store) => (
            <AdvancedMarker
              key={store.id}
              position={{ lat: store.lat, lng: store.lng }}
              onClick={() => setSelectedStore(store)}
            >
              <Pin background="#4F46E5" borderColor="#312E81" glyphColor="#FFFFFF" />
            </AdvancedMarker>
          ))}

          {/* Kurye Pinleri */}
          {defaultCouriers.map((courier) => (
            <AdvancedMarker
              key={courier.id}
              position={{ lat: courier.lat, lng: courier.lng }}
              onClick={() => setSelectedCourier(courier)}
            >
              <Pin background="#10B981" borderColor="#064E3B" glyphColor="#FFFFFF" />
            </AdvancedMarker>
          ))}

          {/* Esnaf Bilgi Balonu */}
          {selectedStore && (
            <InfoWindow
              position={{ lat: selectedStore.lat, lng: selectedStore.lng }}
              onCloseClick={() => setSelectedStore(null)}
            >
              <div className="p-2 text-slate-900 max-w-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs text-indigo-900">{selectedStore.name}</span>
                  {selectedStore.rating && (
                    <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                      ★ {selectedStore.rating}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 mt-1">{selectedStore.address}</p>
                {selectedStore.phone && (
                  <a href={`tel:${selectedStore.phone}`} className="inline-flex items-center gap-1 text-[11px] text-indigo-600 font-bold mt-1.5 hover:underline">
                    <Phone className="w-3 h-3" /> {selectedStore.phone}
                  </a>
                )}
              </div>
            </InfoWindow>
          )}

          {/* Kurye Bilgi Balonu */}
          {selectedCourier && (
            <InfoWindow
              position={{ lat: selectedCourier.lat, lng: selectedCourier.lng }}
              onCloseClick={() => setSelectedCourier(null)}
            >
              <div className="p-2 text-slate-900 max-w-xs">
                <span className="font-bold text-xs text-emerald-900">{selectedCourier.name}</span>
                <p className="text-[11px] text-slate-600 mt-0.5">Plaka: {selectedCourier.plate}</p>
                <span className="inline-block text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-1">
                  {selectedCourier.status === 'AVAILABLE' ? 'Göreve Hazır' : 'Teslimatta'}
                </span>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
}
