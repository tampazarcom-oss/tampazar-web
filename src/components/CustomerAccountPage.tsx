/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Calendar, Heart, MapPin, Package, Clock, 
  CheckCircle2, Truck, FileText, Phone, MessageCircle, 
  Trash2, Plus, ArrowRight, User, AlertCircle, Sparkles, ExternalLink, ChevronRight, X,
  Download, Video, HardDrive, FileCode, ShieldCheck, Award, Copy, Check, MessageSquare, Gift
} from 'lucide-react';
import CustomerLoyaltyCardsTab from './loyalty/CustomerLoyaltyCardsTab';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import CustomerQuotationsTab from './CustomerQuotationsTab';
import { getStoredQuotationRequests } from '../data/quotationRequestData';
import { 
  getStoredDigitalPurchases, 
  incrementDigitalDownload, 
  triggerBrowserDownload, 
  DigitalPurchaseRecord,
  getStoredOnlineAppointments,
  OnlineAppointmentRecord 
} from '../data/digitalAndSessionData';

interface CustomerOrder {
  id: string;
  orderNumber: string;
  date: string;
  storeName: string;
  items: { title: string; qty: number; price: number; image: string }[];
  totalAmount: number;
  status: 'Hazırlanıyor' | 'Kargoda' | 'Teslim Edildi';
  trackingNo?: string;
  invoiceNo?: string;
}

interface ServiceBooking {
  id: string;
  serviceTitle: string;
  storeName: string;
  date: string;
  timeSlot: string;
  address: string;
  price: number;
  status: 'Usta Yola Çıktı' | 'Randevu Onaylandı' | 'Tamamlandı';
  phone: string;
  whatsapp: string;
  eta?: string;
}

interface AddressItem {
  id: string;
  title: string;
  fullAddress: string;
  district: string;
  city: string;
  phone: string;
  isDefault: boolean;
}

export default function CustomerAccountPage() {
  const { user, isAuthenticated, loginAsBuyer, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const searchParams = new URLSearchParams(location.search);
  const initialTabFromQuery = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState<'orders' | 'services' | 'quotes' | 'digital' | 'appointments' | 'favorites' | 'addresses' | 'loyalty'>(() => {
    if (initialTabFromQuery === 'quotes' || location.pathname.includes('/taleplerim')) return 'quotes';
    if (initialTabFromQuery === 'digital' || location.pathname.includes('/dijital-arsivim')) return 'digital';
    if (initialTabFromQuery === 'appointments' || location.pathname.includes('/randevularim')) return 'appointments';
    if (initialTabFromQuery === 'loyalty' || location.pathname.includes('/sadakat') || location.pathname.includes('/ikramlar')) return 'loyalty';
    return 'orders';
  });

  const [quotationRequests, setQuotationRequests] = useState(() => getStoredQuotationRequests());
  const [digitalPurchases, setDigitalPurchases] = useState<DigitalPurchaseRecord[]>(() => getStoredDigitalPurchases());
  const [onlineAppointments, setOnlineAppointments] = useState<OnlineAppointmentRecord[]>(() => getStoredOnlineAppointments());
  const [downloadSuccessToast, setDownloadSuccessToast] = useState('');

  useEffect(() => {
    if (initialTabFromQuery === 'quotes' || location.pathname.includes('/taleplerim')) {
      setActiveTab('quotes');
    } else if (initialTabFromQuery === 'digital' || location.pathname.includes('/dijital-arsivim')) {
      setActiveTab('digital');
    } else if (initialTabFromQuery === 'appointments' || location.pathname.includes('/randevularim')) {
      setActiveTab('appointments');
    }
  }, [initialTabFromQuery, location.pathname]);

  useEffect(() => {
    const handleDigital = () => setDigitalPurchases(getStoredDigitalPurchases());
    const handleAppointments = () => setOnlineAppointments(getStoredOnlineAppointments());
    window.addEventListener('tampazar_digital_updated', handleDigital);
    window.addEventListener('tampazar_appointments_updated', handleAppointments);
    return () => {
      window.removeEventListener('tampazar_digital_updated', handleDigital);
      window.removeEventListener('tampazar_appointments_updated', handleAppointments);
    };
  }, []);

  const handleDownloadFile = (item: DigitalPurchaseRecord) => {
    incrementDigitalDownload(item.id);
    triggerBrowserDownload(item.fileName, item.productTitle);
    setDownloadSuccessToast(`"${item.productTitle}" dosyası başarıyla indirildi. Lisansınız onaylandı.`);
    setTimeout(() => setDownloadSuccessToast(''), 4500);
  };

  // Load orders from local storage or mock
  const [orders, setOrders] = useState<CustomerOrder[]>([
    {
      id: 'ord-101',
      orderNumber: 'TPZ-2026-8819',
      date: '23 Eylül 2026',
      storeName: 'Mert Kundura Ltd.',
      items: [
        {
          title: 'Hakiki Deri Klasik Oxford Ayakkabı (Beden: 42)',
          qty: 1,
          price: 1850,
          image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400'
        }
      ],
      totalAmount: 1850,
      status: 'Kargoda',
      trackingNo: 'YRT-8849201948',
      invoiceNo: 'GIB2026000000104'
    },
    {
      id: 'ord-102',
      orderNumber: 'TPZ-2026-7241',
      date: '18 Eylül 2026',
      storeName: 'Tarihi Karadeniz Dönercisi',
      items: [
        {
          title: 'Odun Ateşinde Yaprak Et Döner Dürüm Menü',
          qty: 2,
          price: 240,
          image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400'
        }
      ],
      totalAmount: 480,
      status: 'Teslim Edildi',
      invoiceNo: 'GIB2026000000098'
    }
  ]);

  // Load Service Call Bookings
  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>([
    {
      id: 'srv-1',
      serviceTitle: 'Termal Cihazla Kırmadan Su Kaçağı Tespiti',
      storeName: 'Kuzey Teknik Tesisat',
      date: 'Bugün (23 Eylül)',
      timeSlot: '14:30 - 15:30',
      address: 'Akyazı Mah. Sahil Cad. No: 14 D: 3, Altınordu / Ordu',
      price: 1200,
      status: 'Usta Yola Çıktı',
      phone: '+905442220000',
      whatsapp: '905442220000',
      eta: '15 Dk İçinde Kapınızda'
    },
    {
      id: 'srv-2',
      serviceTitle: '7/24 Acil Oto Kurtarma & Çekici',
      storeName: 'Özdemir Oto Kurtarma',
      date: '12 Eylül 2026',
      timeSlot: '21:15',
      address: 'Çevre Yolu Girişi, Altınordu / Ordu',
      price: 1500,
      status: 'Tamamlandı',
      phone: '+905321110000',
      whatsapp: '905321110000'
    }
  ]);

  // Favorite Items
  const [favorites, setFavorites] = useState([
    {
      id: 'f1',
      title: 'Doğal Kenar Meşe Kütük Yemek Masası (Masif El Yapımı)',
      storeName: 'Kuzey Ahşap Tasarım',
      price: 14850,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=400',
      slug: 'dogal-kenar-mese-kutuk-yemek-masasi'
    },
    {
      id: 'f2',
      title: 'Kurumsal Ürün ve Katalog Fotoğraf Çekimi (4K)',
      storeName: 'FotoSentez Stüdyo',
      price: 4500,
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400',
      slug: 'kurumsal-urun-katalog-fotograf-cekimi'
    }
  ]);

  // Saved Addresses
  const [addresses, setAddresses] = useState<AddressItem[]>([
    {
      id: 'addr-1',
      title: 'Ev Adresim',
      fullAddress: 'Akyazı Mah. Sahil Cad. No: 14 Daire: 3',
      district: 'Altınordu',
      city: 'Ordu',
      phone: '+90 532 555 12 34',
      isDefault: true
    },
    {
      id: 'addr-2',
      title: 'İşyeri / Ofis',
      fullAddress: 'Sırrıpasa Cad. Çarşı İş Hanı Kat: 2 No: 18',
      district: 'Altınordu',
      city: 'Ordu',
      phone: '+90 532 555 12 34',
      isDefault: false
    }
  ]);

  const [showNewAddressModal, setShowNewAddressModal] = useState(false);
  const [newAddrTitle, setNewAddrTitle] = useState('');
  const [newAddrFull, setNewAddrFull] = useState('');
  const [newAddrDistrict, setNewAddrDistrict] = useState('Altınordu');
  const [newAddrCity, setNewAddrCity] = useState('Ordu');

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrTitle || !newAddrFull) return;
    const newAddr: AddressItem = {
      id: 'addr-' + Date.now(),
      title: newAddrTitle,
      fullAddress: newAddrFull,
      district: newAddrDistrict,
      city: newAddrCity,
      phone: user?.phone || '+90 532 555 12 34',
      isDefault: false
    };
    setAddresses([...addresses, newAddr]);
    setShowNewAddressModal(false);
    setNewAddrTitle('');
    setNewAddrFull('');
  };

  const handleRemoveAddress = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites(favorites.filter(f => f.id !== id));
  };

  // If not authenticated, show friendly login guard
  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-5 animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-900 flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Müşteri Hesabınıza Giriş Yapın</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Siparişlerinizi takip etmek, konumunuza usta çağırmak ve kayıtlı adreslerinizi yönetmek için lütfen giriş yapın.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => openAuthModal('buyer')}
            className="px-6 py-3 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
          >
            Müşteri Girişi / Kaydı
          </button>
          <button
            onClick={() => loginAsBuyer()}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Tek Tıkla Demo Giriş
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 font-sans">
      
      {/* 1. ÜST PROFİL VE KULLANICI KARTI */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img 
            src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"} 
            alt={user?.name} 
            className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-100 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900">{user?.name}</h1>
              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                Tüketici Hesabı
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email} • {user?.phone || '+90 532 555 12 34'}</p>
            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-emerald-600" />
              <span>{user?.district || 'Altınordu'}, {user?.city || 'Ordu'}</span>
            </p>
          </div>
        </div>

        {/* Hızlı İstatistikler */}
        <div className="flex items-center gap-3 sm:gap-4 text-center divide-x divide-slate-100 bg-slate-50 p-3 rounded-2xl border border-slate-100 overflow-x-auto">
          <div className="px-2.5">
            <span className="text-lg font-black text-slate-900 font-mono block">{orders.length}</span>
            <span className="text-[10px] font-bold text-slate-400">Sipariş</span>
          </div>
          <div className="px-2.5">
            <span className="text-lg font-black text-purple-700 font-mono block">{digitalPurchases.length}</span>
            <span className="text-[10px] font-bold text-purple-600">Dijital Dosya</span>
          </div>
          <div className="px-2.5">
            <span className="text-lg font-black text-cyan-700 font-mono block">{onlineAppointments.length}</span>
            <span className="text-[10px] font-bold text-cyan-600">Canlı Seans</span>
          </div>
          <div className="px-2.5">
            <span className="text-lg font-black text-amber-600 font-mono block">{quotationRequests.length}</span>
            <span className="text-[10px] font-bold text-slate-400">TamTeklif</span>
          </div>
          <div className="px-2.5">
            <span className="text-lg font-black text-indigo-900 font-mono block">{serviceBookings.length}</span>
            <span className="text-[10px] font-bold text-slate-400">Usta Çağrı</span>
          </div>
        </div>
      </div>

      {/* SUCCESS TOAST */}
      {downloadSuccessToast && (
        <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold text-sm">{downloadSuccessToast}</span>
          </div>
          <button 
            onClick={() => setDownloadSuccessToast('')}
            className="text-white/80 hover:text-white text-xs font-bold px-2 py-1"
          >
            Kapat
          </button>
        </div>
      )}

      {/* 2. SEKME MENÜSÜ */}
      <div className="flex bg-white p-1 rounded-2xl border border-slate-200 gap-1 text-xs font-bold text-slate-600 shadow-xs overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab('orders');
            navigate('/hesabim');
          }}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === 'orders' ? 'bg-indigo-900 text-white shadow-xs' : 'hover:bg-slate-50'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Siparişlerim ({orders.length})</span>
        </button>

        {/* DİJİTAL ARŞİVİM SEKME BUTONU */}
        <button
          onClick={() => {
            setActiveTab('digital');
            navigate('/hesabim/dijital-arsivim');
          }}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === 'digital' 
              ? 'bg-purple-700 text-white shadow-xs font-black' 
              : 'hover:bg-purple-50 text-purple-900'
          }`}
        >
          <Download className="w-4 h-4 text-purple-400" />
          <span>Dijital Arşivim ({digitalPurchases.length})</span>
          <span className="bg-purple-100 text-purple-800 font-bold text-[9px] px-1.5 py-0.5 rounded-full">
            TamDijital
          </span>
        </button>

        {/* CANLI RANDEVULARIM SEKME BUTONU */}
        <button
          onClick={() => {
            setActiveTab('appointments');
            navigate('/hesabim/randevularim');
          }}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === 'appointments' 
              ? 'bg-cyan-700 text-white shadow-xs font-black' 
              : 'hover:bg-cyan-50 text-cyan-900'
          }`}
        >
          <Video className="w-4 h-4 text-cyan-400" />
          <span>Online Seanslarım ({onlineAppointments.length})</span>
          <span className="bg-cyan-100 text-cyan-800 font-bold text-[9px] px-1.5 py-0.5 rounded-full">
            TamSeans
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('quotes');
            navigate('/hesabim/taleplerim');
          }}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === 'quotes' ? 'bg-indigo-900 text-white shadow-xs' : 'hover:bg-slate-50 text-slate-700'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Fiyat Taleplerim & Teklifler ({quotationRequests.length})</span>
          <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded-full">
            TamTeklif
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('services');
            navigate('/hesabim?tab=services');
          }}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === 'services' ? 'bg-indigo-900 text-white shadow-xs' : 'hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Saha Randevularım ({serviceBookings.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('loyalty');
            navigate('/hesabim?tab=loyalty');
          }}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === 'loyalty' ? 'bg-[#0F4C3A] text-white shadow-xs' : 'hover:bg-slate-50'
          }`}
        >
          <Gift className="w-4 h-4 text-amber-400" />
          <span>Mahalle Sadakat Kartlarım & İkramlar</span>
          <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded-full">
            İkram
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('favorites');
            navigate('/hesabim?tab=favorites');
          }}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === 'favorites' ? 'bg-indigo-900 text-white shadow-xs' : 'hover:bg-slate-50'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Favorilerim ({favorites.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('addresses');
            navigate('/hesabim?tab=addresses');
          }}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeTab === 'addresses' ? 'bg-indigo-900 text-white shadow-xs' : 'hover:bg-slate-50'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Kayıtlı Adreslerim ({addresses.length})</span>
        </button>
      </div>

      {/* 3. SEKME İÇERİKLERİ */}

      {/* TAB A: SİPARİŞLERİM */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div key={ord.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
                <div>
                  <span className="text-xs font-mono font-bold text-slate-400">Sipariş No: {ord.orderNumber}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm font-black text-slate-900">{ord.storeName}</span>
                    <span className="text-xs text-slate-400">• {ord.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 ${
                    ord.status === 'Kargoda' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                    ord.status === 'Teslim Edildi' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {ord.status === 'Kargoda' && <Truck className="w-3.5 h-3.5" />}
                    {ord.status === 'Teslim Edildi' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>{ord.status}</span>
                  </span>

                  {ord.invoiceNo && (
                    <button
                      onClick={() => alert(`GİB UBL-TR e-Arşiv Faturası İndirildi: ${ord.invoiceNo}`)}
                      className="text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-xl transition flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" /> e-Arşiv Faturası
                    </button>
                  )}
                </div>
              </div>

              {/* Ürün Listesi */}
              <div className="divide-y divide-slate-100">
                {ord.items.map((it, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img src={it.image} alt={it.title} className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{it.title}</h4>
                        <span className="text-[11px] text-slate-500">Adet: {it.qty}</span>
                      </div>
                    </div>
                    <span className="text-sm font-black text-slate-900 font-mono">
                      {it.price.toLocaleString('tr-TR')} ₺
                    </span>
                  </div>
                ))}
              </div>

              {/* Alt Bilgi */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-slate-100 text-xs">
                {ord.trackingNo ? (
                  <span className="text-slate-500 flex items-center gap-1 font-mono">
                    <Truck className="w-4 h-4 text-indigo-600" /> Kargo Takip: <strong>{ord.trackingNo}</strong> (Yurtiçi Kargo)
                  </span>
                ) : (
                  <span className="text-slate-400">Esnaf tarafından bizzat teslimat</span>
                )}
                <div className="flex flex-wrap items-center gap-3 mt-2 sm:mt-0">
                  <button
                    onClick={() => {
                      setDownloadSuccessToast(`"${ord.storeName}" siparişinizdeki ${ord.items.length} ürün tek tıkla sepete eklendi!`);
                      setTimeout(() => setDownloadSuccessToast(''), 4500);
                    }}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Tek Tıkla Sepeti Tekrarla</span>
                  </button>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Toplam Tutar:</span>
                    <span className="text-base font-black text-indigo-950 font-mono">
                      {ord.totalAmount.toLocaleString('tr-TR')} ₺
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB B: HİZMET TALEPLERİ VE ÇAĞRILAR */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          {serviceBookings.map((srv) => (
            <div key={srv.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    Yerel Hizmet / Konum Çağrısı
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-1">{srv.serviceTitle}</h3>
                  <p className="text-xs text-slate-500 font-semibold">{srv.storeName} • {srv.date} ({srv.timeSlot})</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 ${
                    srv.status === 'Usta Yola Çıktı' ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse' :
                    srv.status === 'Randevu Onaylandı' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{srv.status}</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Hizmet Adresi</span>
                  <p className="text-slate-800 font-medium flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{srv.address}</span>
                  </p>
                  {srv.eta && (
                    <span className="text-emerald-700 font-bold text-xs block pt-1">
                      ⚡ Tahmini Varış: {srv.eta}
                    </span>
                  )}
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold text-[10px] uppercase">Sabit Servis Bedeli:</span>
                    <span className="text-base font-black text-slate-900 font-mono">{srv.price.toLocaleString('tr-TR')} ₺</span>
                  </div>
                  
                  <div className="flex gap-2 pt-3">
                    <a
                      href={`tel:${srv.phone}`}
                      className="flex-1 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Phone className="w-3.5 h-3.5" /> Ustayı Ara
                    </a>
                    <a
                      href={`https://wa.me/${srv.whatsapp}?text=Merhaba,%20tampazar%20üzerinden%20oluşturduğum%20${encodeURIComponent(srv.serviceTitle)}%20talebi%20hakkında%20yazıyorum.`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Mesaj
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: DİJİTAL ARŞİVİM (TAM-DİJİTAL ETSY/GUMROAD DOSYA İNDİRME) */}
      {activeTab === 'digital' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-3xl p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200 text-xs font-bold border border-purple-400/30">
                <Download className="w-3.5 h-3.5" />
                <span>TamDijital • Lisanslı Dosya Kütüphanesi</span>
              </div>
              <h3 className="text-xl font-black">Satın Alınan İndirilebilir Dosyalarım</h3>
              <p className="text-xs text-purple-200/90 max-w-xl">
                Nakış desenleri, CNC lazer kesim şablonları, 3D baskı modelleri ve kılavuzlarınız hesabınızda ömür boyu saklanır. İstediğiniz an sınırsızca indirebilirsiniz.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-2xl font-black font-mono">{digitalPurchases.length}</span>
              <span className="text-xs text-purple-200 block">Kayıtlı Dijital Paket</span>
            </div>
          </div>

          {digitalPurchases.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-xs">
              <FileCode className="w-12 h-12 text-purple-400 mx-auto" />
              <h4 className="text-base font-black text-slate-900">Henüz Dijital Dosya Satın Almadınız</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Pazaryerimizdeki nakış, lazer kesim ve 3D tasarımcılarından anında indirilebilir ürünleri inceleyin.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                <span>Dijital Tasarımları Keşfet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {digitalPurchases.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:border-purple-300 hover:shadow-md transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start gap-4">
                      <img 
                        src={item.productImage} 
                        alt={item.productTitle} 
                        className="w-20 h-20 rounded-2xl object-cover border border-slate-100 shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded uppercase">
                            {item.storeName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {item.orderId}
                          </span>
                        </div>
                        <h4 className="font-black text-slate-900 text-sm mt-1 line-clamp-2 leading-snug">
                          {item.productTitle}
                        </h4>
                        <div className="text-[11px] text-slate-400 mt-1">
                          Satın Alma: {item.purchasedAt}
                        </div>
                      </div>
                    </div>

                    {/* Dosya ve Lisans Ayrıntıları */}
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 font-mono truncate text-[11px]">
                          📁 {item.fileName}
                        </span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded shrink-0">
                          {item.fileSize}
                        </span>
                      </div>

                      {/* Format Etiketleri */}
                      <div className="flex flex-wrap gap-1">
                        {item.formatTags.map((tag) => (
                          <span key={tag} className="px-1.5 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold font-mono rounded">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Lisans Türü & Sayaç */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                        <span className="flex items-center gap-1 font-bold text-purple-900">
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                          {item.licenseType === 'commercial' ? 'Ticari Üretime Uygun' : 'Kişisel Kullanım'}
                        </span>
                        <span className="text-emerald-700 font-black font-mono">
                          {item.downloadCount} kez indirildi
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* PROMINENT GREEN DOWNLOAD BUTTON */}
                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleDownloadFile(item)}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <Download className="w-4 h-4" />
                      <span>Dosyayı Hemen İndir ({item.formatTags[0] || 'ZIP'})</span>
                    </button>
                    
                    <p className="text-[10px] text-center text-slate-400">
                      Sınırsız yeniden indirme garantisi • Hash: {item.checksum?.slice(0, 16) || 'SHA256: 9e88...'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: ONLINE SEANSLARIM (TAM-SEANS SUPERPEER CANLI GÖRÜŞME) */}
      {activeTab === 'appointments' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-cyan-900 via-teal-900 to-slate-900 rounded-3xl p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/30 text-cyan-200 text-xs font-bold border border-cyan-400/30">
                <Video className="w-3.5 h-3.5" />
                <span>TamSeans • Canlı Uzman Görüşmeleri</span>
              </div>
              <h3 className="text-xl font-black">Online Seanslarım & Randevularım</h3>
              <p className="text-xs text-cyan-200/90 max-w-xl">
                Psikolog, eğitmen ve danışman randevularınızın bağlantıları burada yer alır. Randevu saatinizde yeşil butona basarak doğrudan Google Meet odasına katılabilirsiniz.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-2xl font-black font-mono">{onlineAppointments.length}</span>
              <span className="text-xs text-cyan-200 block">Kayıtlı Seans</span>
            </div>
          </div>

          {onlineAppointments.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-xs">
              <Video className="w-12 h-12 text-cyan-400 mx-auto" />
              <h4 className="text-base font-black text-slate-900">Henüz Online Seans Randevunuz Yok</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Birebir uzman danışmanlığı, kariyer koçluğu ve özel ders seanslarını inceleyerek dilediğiniz saati rezerve edin.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                <span>Uzmanları Keşfet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {onlineAppointments.map((apt) => {
                const isCompleted = apt.status === 'completed';

                return (
                  <div 
                    key={apt.id} 
                    className={`bg-white rounded-3xl border p-5 shadow-xs transition flex flex-col justify-between space-y-4 ${
                      isCompleted 
                        ? 'border-slate-200 opacity-80' 
                        : 'border-cyan-200 ring-2 ring-cyan-500/10 hover:shadow-md'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Üst Satır */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-cyan-600 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-xs">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{apt.timeSlot}</span>
                          </span>
                          <span className="text-xs font-bold text-slate-700">{apt.date}</span>
                        </div>

                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          isCompleted ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isCompleted ? 'Tamamlandı' : 'Görüşme Hazır'}
                        </span>
                      </div>

                      {/* Başlık ve Mağaza */}
                      <div className="flex items-start gap-3">
                        <img 
                          src={apt.serviceImage} 
                          alt={apt.serviceTitle} 
                          className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded">
                            {apt.storeName}
                          </span>
                          <h4 className="font-black text-slate-900 text-sm mt-1 line-clamp-2 leading-snug">
                            {apt.serviceTitle}
                          </h4>
                          <div className="text-[11px] text-slate-500 mt-1">
                            Süre: {apt.durationMin} Dakika • Kanal: {apt.channel === 'google_meet' ? 'Google Meet (HD)' : apt.channel === 'zoom' ? 'Zoom' : 'Telefon'}
                          </div>
                        </div>
                      </div>

                      {/* Bilgilendirme Notu */}
                      {apt.notes && (
                        <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 border border-slate-100 italic">
                          "{apt.notes}"
                        </div>
                      )}
                    </div>

                    {/* ACTIONS */}
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                      {/* PROMINENT GOOGLE MEET BUTTON */}
                      <a
                        href={apt.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Video className="w-4 h-4" />
                        <span>Google Meet'e Katıl (Canlı Görüşme)</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                      </a>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(apt.meetingLink);
                            setDownloadSuccessToast('Toplantı bağlantısı panoya kopyalandı.');
                            setTimeout(() => setDownloadSuccessToast(''), 3000);
                          }}
                          className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Linki Kopyala</span>
                        </button>

                        <a
                          href={`https://wa.me/${apt.customerPhone.replace(/[^0-9]/g, '')}?text=Merhaba,%20${encodeURIComponent(apt.serviceTitle)}%20seansımız%20hakkında%20yazıyorum.`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Uzmana Yaz</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB E: MAHALLE SADAKAT KARTLARI VE İKRAM MOTORU */}
      {activeTab === 'loyalty' && (
        <CustomerLoyaltyCardsTab />
      )}

      {/* TAB C: FAVORİLERİM */}
      {activeTab === 'favorites' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <div key={fav.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
              <div>
                <div className="relative h-44 w-full bg-slate-100">
                  <img src={fav.image} alt={fav.title} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => handleRemoveFavorite(fav.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-xs rounded-full text-rose-500 hover:bg-rose-50 transition cursor-pointer shadow-xs"
                    title="Favorilerden Çıkar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-bold text-indigo-700 block">{fav.storeName}</span>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">{fav.title}</h4>
                  <div className="text-base font-black text-slate-900 font-mono">
                    {fav.price.toLocaleString('tr-TR')} ₺
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Link
                  to={`/urun/${fav.slug}`}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <span>Ürünü İncele & Satın Al</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB D: KAYITLI ADRESLERİM */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-slate-900 text-sm">Teslimat & Fatura Adreslerim</h3>
            <button
              onClick={() => setShowNewAddressModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Yeni Adres Ekle
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div key={addr.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-indigo-600" />
                      {addr.title}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Varsayılan
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{addr.fullAddress}</p>
                  <p className="text-xs text-slate-400 font-bold">{addr.district} / {addr.city}</p>
                  <p className="text-xs text-slate-500 font-mono">{addr.phone}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => handleRemoveAddress(addr.id)}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Adresi Sil
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Yeni Adres Modalı */}
          {showNewAddressModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-black text-slate-900 text-sm">Yeni Adres Ekle</h4>
                  <button onClick={() => setShowNewAddressModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleAddNewAddress} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Adres Başlığı (Örn: Evim, Atölye)</label>
                    <input 
                      type="text" 
                      required
                      value={newAddrTitle}
                      onChange={(e) => setNewAddrTitle(e.target.value)}
                      placeholder="Evim" 
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Açık Adres (Cadde, Sokak, No, Daire)</label>
                    <textarea 
                      rows={3}
                      required
                      value={newAddrFull}
                      onChange={(e) => setNewAddrFull(e.target.value)}
                      placeholder="Akyazı Mah. Atatürk Bulvarı No: 12 D: 4" 
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Şehir</label>
                      <input 
                        type="text" 
                        value={newAddrCity}
                        onChange={(e) => setNewAddrCity(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">İlçe</label>
                      <input 
                        type="text" 
                        value={newAddrDistrict}
                        onChange={(e) => setNewAddrDistrict(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-900 hover:bg-indigo-800 text-white font-bold rounded-xl mt-3 transition cursor-pointer"
                  >
                    Adresi Kaydet
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB E: FİYAT TALEPLERİM & TEKLİFLER (TAMTEKLİF) */}
      {activeTab === 'quotes' && (
        <CustomerQuotationsTab initialRequestId={params.id} />
      )}

    </div>
  );
}
