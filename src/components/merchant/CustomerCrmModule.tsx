/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Users, Search, Plus, Filter, Phone, MessageSquare, MapPin,
  Calendar, Star, Tag, Edit3, Trash2, CheckCircle2, Clock,
  Heart, ShoppingBag, ArrowRight, ShieldCheck, ChevronRight,
  FileText, Sparkles, AlertCircle, X, DollarSign, ExternalLink
} from 'lucide-react';

export interface CrmInteraction {
  id: string;
  type: 'WHATSAPP' | 'CALL' | 'VISIT' | 'ORDER' | 'NOTE';
  date: string;
  summary: string;
  staffName?: string;
}

export interface CrmCustomer {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email?: string;
  address: string;
  neighborhood: string;
  city: string;
  segment: 'VIP' | 'REGULAR' | 'NEW' | 'VERESIYE' | 'SOLIDARITY_DONOR';
  tags: string[];
  preferences: string[]; // Müşteri özel tercihleri (örn: "Kıymayı çift çektirir", "Zil çalmayın")
  notes: string;
  totalOrdersCount: number;
  totalSpendAmount: number;
  creditDebtBalance?: number; // Veresiye borç bakiyesi
  lastOrderDate: string;
  interactions: CrmInteraction[];
  createdAt: string;
}

const INITIAL_CRM_CUSTOMERS: CrmCustomer[] = [
  {
    id: 'crm-1',
    name: 'Mehmet Yılmaz',
    phone: '0532 111 22 33',
    whatsapp: '905321112233',
    email: 'mehmet.yilmaz@gmail.com',
    address: 'Bahçelievler Mah. Atatürk Cad. No: 42 D: 6',
    neighborhood: 'Bahçelievler',
    city: 'Ordu',
    segment: 'VIP',
    tags: ['Kasap Müdavimi', 'Haftalık Sipariş', 'Nakit'],
    preferences: [
      'Dana kıymayı her zaman 2 kez çektirir (az yağlı)',
      'Kuşbaşı etleri orta boy doğranmış sever',
      'Cumartesi sabahları 10:00 da teslimat ister'
    ],
    notes: 'Mahallenin eski sakinlerinden. Babası esnaf dostudur, her zaman taze köy tereyağı sorar.',
    totalOrdersCount: 28,
    totalSpendAmount: 8450,
    creditDebtBalance: 0,
    lastOrderDate: '2026-09-22 11:30',
    createdAt: '2025-11-10',
    interactions: [
      {
        id: 'int-1',
        type: 'ORDER',
        date: '2026-09-22 11:30',
        summary: '2 Kg Dana Kıyma ve 1 Kg Kuşbaşı teslim edildi.',
        staffName: 'Ahmet Usta'
      },
      {
        id: 'int-2',
        type: 'WHATSAPP',
        date: '2026-09-20 16:45',
        summary: 'Taze köy tereyağı geldiğinde haber vermemiz istendi.',
        staffName: 'Kasa'
      },
      {
        id: 'int-3',
        type: 'CALL',
        date: '2026-09-15 09:15',
        summary: 'Haftalık sipariş teyidi alındı.',
        staffName: 'Ahmet Usta'
      }
    ]
  },
  {
    id: 'crm-2',
    name: 'Ayşe Demir',
    phone: '0533 222 33 44',
    whatsapp: '905332223344',
    email: 'ayse.demir@gmail.com',
    address: 'Akyazı Mah. Barış Sok. Gül Apt. No: 12 D: 3',
    neighborhood: 'Akyazı',
    city: 'Ordu',
    segment: 'REGULAR',
    tags: ['Organik Manav', 'Çocuklu Aile', 'Kapıda POS'],
    preferences: [
      'Domates ve salatalıkları her zaman sert ve taze seçer',
      'Evde küçük bebek var; teslimatta zili çalmayıp telefonla arayın',
      'Plastik poşet istemez, kese kağıdı tercih eder'
    ],
    notes: 'Düzenli manav müşterisi. Hafta içi sebze-meyve paketi siparişi verir.',
    totalOrdersCount: 16,
    totalSpendAmount: 4120,
    creditDebtBalance: 0,
    lastOrderDate: '2026-09-23 17:15',
    createdAt: '2026-01-14',
    interactions: [
      {
        id: 'int-4',
        type: 'ORDER',
        date: '2026-09-23 17:15',
        summary: 'Haftalık Manav Paketi kapıda POS ile teslim edildi.',
        staffName: 'Kurye Can'
      },
      {
        id: 'int-5',
        type: 'NOTE',
        date: '2026-09-18 14:20',
        summary: 'Organik Amasya elması geldiğinde bilgi verilecek.',
        staffName: 'Kasa'
      }
    ]
  },
  {
    id: 'crm-3',
    name: 'Kemal Kara (Özlem Bakkaliye)',
    phone: '0542 333 44 55',
    whatsapp: '905423334455',
    address: 'Karşıyaka Mah. Fatih Cad. No: 18',
    neighborhood: 'Karşıyaka',
    city: 'Ordu',
    segment: 'VERESIYE',
    tags: ['Veresiyeli', 'Esnaf Komşu', 'Toptan'],
    preferences: [
      'Ay sonu maaş gününde (1-5 arası) toplu hesap kapatır',
      'Ekmeği her gün 17:30 da sıcak fırından alır'
    ],
    notes: 'Komşu esnaf. Veresiye defterinde kayıtlı, güvenilir.',
    totalOrdersCount: 42,
    totalSpendAmount: 11200,
    creditDebtBalance: 1450,
    lastOrderDate: '2026-09-24 08:30',
    createdAt: '2025-08-20',
    interactions: [
      {
        id: 'int-6',
        type: 'VISIT',
        date: '2026-09-24 08:30',
        summary: 'Dükkandan 4 adet Trabzon ekmeği aldı, veresiye defterine yazıldı.',
        staffName: 'Mehmet Usta'
      },
      {
        id: 'int-7',
        type: 'WHATSAPP',
        date: '2026-09-01 10:00',
        summary: 'Ağustos ayı veresiye ekstresi WhatsApp ile paylaşıldı ve kapatıldı.',
        staffName: 'Muhasebe'
      }
    ]
  },
  {
    id: 'crm-4',
    name: 'Selin Aksoy',
    phone: '0535 444 55 66',
    whatsapp: '905354445566',
    email: 'selin.aksoy@hotmail.com',
    address: 'Cumhuriyet Mah. Sahil Cad. No: 88 D: 14',
    neighborhood: 'Cumhuriyet',
    city: 'Ordu',
    segment: 'SOLIDARITY_DONOR',
    tags: ['Askıda Katkıcısı', 'Dayanışma Dostu', 'Hızlı Sipariş'],
    preferences: [
      'Her siparişinde mutlaka 2 askıda ekmek veya 1 askıda çorba ekler',
      'Faturayı e-posta ile ister'
    ],
    notes: 'Mahalle dayanışmasına çok önem veren yardımsever müşteri.',
    totalOrdersCount: 19,
    totalSpendAmount: 5800,
    creditDebtBalance: 0,
    lastOrderDate: '2026-09-21 19:40',
    createdAt: '2026-02-10',
    interactions: [
      {
        id: 'int-8',
        type: 'ORDER',
        date: '2026-09-21 19:40',
        summary: 'Siparişine 2 adet Askıda Trabzon Ekmeği bağışı ekledi.',
        staffName: 'Kurye Can'
      }
    ]
  },
  {
    id: 'crm-5',
    name: 'Ahmet Karadeniz (Tekniker)',
    phone: '0530 555 66 77',
    whatsapp: '905305556677',
    address: 'Şirinevler Mah. 204. Sok. No: 5',
    neighborhood: 'Şirinevler',
    city: 'Ordu',
    segment: 'NEW',
    tags: ['Yeni Müşteri', 'Usta Hizmeti', 'Tesisat'],
    preferences: [
      'Ödemeleri her zaman FAST / IBAN ile doğrudan yapar'
    ],
    notes: 'TamTeklif üzerinden tesisat talebi vermişti, memnun kaldı.',
    totalOrdersCount: 2,
    totalSpendAmount: 1850,
    creditDebtBalance: 0,
    lastOrderDate: '2026-09-23 15:00',
    createdAt: '2026-09-20',
    interactions: [
      {
        id: 'int-9',
        type: 'CALL',
        date: '2026-09-23 15:00',
        summary: 'Tesisat onarımı sonrası memnuniyet araması yapıldı, 5 yıldız verdi.',
        staffName: 'Usta Danışmanı'
      }
    ]
  }
];

export default function CustomerCrmModule() {
  const [customers, setCustomers] = useState<CrmCustomer[]>(() => {
    try {
      const saved = localStorage.getItem('tampazar_crm_customers');
      return saved ? JSON.parse(saved) : INITIAL_CRM_CUSTOMERS;
    } catch {
      return INITIAL_CRM_CUSTOMERS;
    }
  });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string>('ALL');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('ALL');

  // Active Customer Detail Modal / Drawer
  const [selectedCustomer, setSelectedCustomer] = useState<CrmCustomer | null>(null);

  // New Customer Modal
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustNeighborhood, setNewCustNeighborhood] = useState('Bahçelievler');
  const [newCustSegment, setNewCustSegment] = useState<CrmCustomer['segment']>('REGULAR');
  const [newCustNotes, setNewCustNotes] = useState('');
  const [newCustPreferences, setNewCustPreferences] = useState('');
  const [newCustTags, setNewCustTags] = useState('');

  // Add Interaction / Note Form
  const [newInteractionType, setNewInteractionType] = useState<CrmInteraction['type']>('NOTE');
  const [newInteractionSummary, setNewInteractionSummary] = useState('');

  // New Preference Input inside detail
  const [newPrefText, setNewPrefText] = useState('');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('tampazar_crm_customers', JSON.stringify(customers));
  }, [customers]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered list
  const filteredCustomers = customers.filter(c => {
    if (selectedSegment !== 'ALL' && c.segment !== selectedSegment) return false;
    if (selectedNeighborhood !== 'ALL' && c.neighborhood !== selectedNeighborhood) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchPhone = c.phone.includes(q);
      const matchNotes = c.notes?.toLowerCase().includes(q);
      const matchPrefs = c.preferences.some(p => p.toLowerCase().includes(q));
      const matchTags = c.tags.some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchPhone && !matchNotes && !matchPrefs && !matchTags) return false;
    }

    return true;
  });

  // Neighborhood list
  const neighborhoods = Array.from(new Set(customers.map(c => c.neighborhood)));

  // Add New Customer
  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim() || !newCustPhone.trim()) return;

    const newCustomer: CrmCustomer = {
      id: `crm-${Date.now()}`,
      name: newCustName.trim(),
      phone: newCustPhone.trim(),
      whatsapp: newCustPhone.replace(/\D/g, ''),
      address: newCustAddress.trim() || 'Adres belirtilmedi',
      neighborhood: newCustNeighborhood,
      city: 'Ordu',
      segment: newCustSegment,
      tags: newCustTags ? newCustTags.split(',').map(t => t.trim()).filter(Boolean) : ['Mahalle Sakini'],
      preferences: newCustPreferences ? newCustPreferences.split('\n').map(p => p.trim()).filter(Boolean) : [],
      notes: newCustNotes.trim(),
      totalOrdersCount: 0,
      totalSpendAmount: 0,
      creditDebtBalance: 0,
      lastOrderDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      createdAt: new Date().toISOString().slice(0, 10),
      interactions: [
        {
          id: `int-${Date.now()}`,
          type: 'NOTE',
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
          summary: 'Müşteri profili CRM sistemine kaydedildi.',
          staffName: 'Esnaf'
        }
      ]
    };

    setCustomers([newCustomer, ...customers]);
    setShowAddCustomerModal(false);
    // Reset form
    setNewCustName('');
    setNewCustPhone('');
    setNewCustAddress('');
    setNewCustNotes('');
    setNewCustPreferences('');
    setNewCustTags('');
    showToast(`✓ "${newCustomer.name}" CRM müşteri defterine kaydedildi.`);
  };

  // Add interaction to selected customer
  const handleAddInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !newInteractionSummary.trim()) return;

    const newInt: CrmInteraction = {
      id: `int-${Date.now()}`,
      type: newInteractionType,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      summary: newInteractionSummary.trim(),
      staffName: 'Esnaf'
    };

    const updated = customers.map(c => {
      if (c.id === selectedCustomer.id) {
        return {
          ...c,
          interactions: [newInt, ...c.interactions]
        };
      }
      return c;
    });

    setCustomers(updated);
    setSelectedCustomer(prev => prev ? { ...prev, interactions: [newInt, ...prev.interactions] } : null);
    setNewInteractionSummary('');
    showToast('✓ Görüşme & İletişim kaydı eklendi.');
  };

  // Add preference to selected customer
  const handleAddPreference = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !newPrefText.trim()) return;

    const updatedPrefs = [...selectedCustomer.preferences, newPrefText.trim()];
    const updated = customers.map(c => {
      if (c.id === selectedCustomer.id) {
        return {
          ...c,
          preferences: updatedPrefs
        };
      }
      return c;
    });

    setCustomers(updated);
    setSelectedCustomer(prev => prev ? { ...prev, preferences: updatedPrefs } : null);
    setNewPrefText('');
    showToast('✓ Müşteri tercihi güncellendi.');
  };

  // Remove preference
  const handleRemovePreference = (index: number) => {
    if (!selectedCustomer) return;
    const updatedPrefs = selectedCustomer.preferences.filter((_, i) => i !== index);
    const updated = customers.map(c => {
      if (c.id === selectedCustomer.id) {
        return {
          ...c,
          preferences: updatedPrefs
        };
      }
      return c;
    });

    setCustomers(updated);
    setSelectedCustomer(prev => prev ? { ...prev, preferences: updatedPrefs } : null);
  };

  // Quick segment colors & labels
  const getSegmentBadge = (seg: CrmCustomer['segment']) => {
    switch (seg) {
      case 'VIP':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">⭐ VIP Müşteri</span>;
      case 'REGULAR':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">🏡 Düzenli Mahalleli</span>;
      case 'VERESIYE':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">📖 Veresiye Hesabı Var</span>;
      case 'SOLIDARITY_DONOR':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">🥖 Askıda Katkıcısı</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">🌱 Yeni Müşteri</span>;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#0B132B] text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-fade-in text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. ÜST BAŞLIK VE METRİKLER */}
      <div className="bg-gradient-to-r from-[#0B132B] via-[#0F4C3A] to-[#0B132B] rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-[#F59E0B] text-slate-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Mahalle Esnafı CRM & Müşteri Hafızası</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Müşteri İlişkileri (CRM) & Özel Tercih Defteri</h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Mahallenizin müşterilerinin özel sipariş alışkanlıklarını, kıyma/ekmek tercihlerini, iletişim geçmişini ve veresiye bağlarını tek ekranda yönetin.
          </p>
        </div>

        <button
          onClick={() => setShowAddCustomerModal(true)}
          className="px-5 py-3 bg-[#F59E0B] hover:bg-[#D97706] text-[#0B132B] font-black text-xs rounded-2xl shadow-lg transition flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Müşteri Kaydet</span>
        </button>
      </div>

      {/* 2. KPI KARTLARI */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Toplam Kayıtlı Müşteri</span>
          <span className="text-2xl font-black text-slate-900 font-mono">{customers.length}</span>
          <span className="text-[10px] text-emerald-700 font-bold block">Mahalle Portföyü</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">VIP & Müdavim</span>
          <span className="text-2xl font-black text-amber-600 font-mono">
            {customers.filter(c => c.segment === 'VIP' || c.segment === 'REGULAR').length}
          </span>
          <span className="text-[10px] text-amber-700 font-bold block">Yüksek Sadakat</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Veresiye Kayıtlı</span>
          <span className="text-2xl font-black text-indigo-700 font-mono">
            ₺{customers.reduce((sum, c) => sum + (c.creditDebtBalance || 0), 0).toLocaleString('tr-TR')}
          </span>
          <span className="text-[10px] text-indigo-700 font-bold block">
            {customers.filter(c => (c.creditDebtBalance || 0) > 0).length} Müşteri Bakiyesi
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Özel Tercih Kayıtları</span>
          <span className="text-2xl font-black text-[#0F4C3A] font-mono">
            {customers.reduce((sum, c) => sum + c.preferences.length, 0)}
          </span>
          <span className="text-[10px] text-emerald-700 font-bold block">Kişiye Özel Not</span>
        </div>
      </div>

      {/* 3. ARAMA VE FİLTRE BARI */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Arama Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="İsim, telefon, mahalle veya 'dana kıyma' ara..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0F4C3A] text-slate-800"
          />
        </div>

        {/* Segment & Mahalle Filtreleri */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {[
              { id: 'ALL', label: 'Tümü' },
              { id: 'VIP', label: '⭐ VIP' },
              { id: 'REGULAR', label: '🏡 Müdavim' },
              { id: 'VERESIYE', label: '📖 Veresiyeli' },
              { id: 'SOLIDARITY_DONOR', label: '🥖 Askıda' }
            ].map(seg => (
              <button
                key={seg.id}
                onClick={() => setSelectedSegment(seg.id)}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer text-xs ${
                  selectedSegment === seg.id
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {seg.label}
              </button>
            ))}
          </div>

          <select
            value={selectedNeighborhood}
            onChange={(e) => setSelectedNeighborhood(e.target.value)}
            aria-label="Mahalle Filtresi"
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-700 font-bold"
          >
            <option value="ALL">Tüm Mahalleler</option>
            {neighborhoods.map(n => (
              <option key={n} value={n}>{n} Mah.</option>
            ))}
          </select>
        </div>

      </div>

      {/* 4. MÜŞTERİ LİSTESİ TABLOSU & KARTLARI */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Müşteri & İletişim</th>
                <th className="py-3.5 px-4">Segment & Etiketler</th>
                <th className="py-3.5 px-4">Özel Sipariş Tercihleri (Hafıza)</th>
                <th className="py-3.5 px-4">Sipariş / Harcama</th>
                <th className="py-3.5 px-4">Veresiye Durumu</th>
                <th className="py-3.5 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold">Aramanıza uygun müşteri kaydı bulunamadı.</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr 
                    key={cust.id} 
                    className="hover:bg-slate-50/80 transition group cursor-pointer"
                    onClick={() => setSelectedCustomer(cust)}
                  >
                    {/* 1. Müşteri & İletişim */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <strong className="text-sm font-black text-slate-900 block group-hover:text-[#0F4C3A] transition">
                          {cust.name}
                        </strong>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                          <span>{cust.phone}</span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5 text-slate-700 font-sans font-bold">
                            <MapPin className="w-3 h-3 text-rose-500" />
                            {cust.neighborhood}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 2. Segment & Etiketler */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1.5">
                        <div>{getSegmentBadge(cust.segment)}</div>
                        <div className="flex flex-wrap gap-1">
                          {cust.tags.slice(0, 2).map((t, idx) => (
                            <span key={idx} className="bg-slate-100 text-slate-600 px-2 py-0.2 rounded text-[10px] font-medium">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* 3. Özel Sipariş Tercihleri */}
                    <td className="py-3.5 px-4 max-w-xs">
                      {cust.preferences.length > 0 ? (
                        <div className="space-y-1">
                          <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 text-[11px] leading-snug line-clamp-2">
                            💡 {cust.preferences[0]}
                          </div>
                          {cust.preferences.length > 1 && (
                            <span className="text-[10px] text-amber-700 font-bold block">
                              +{cust.preferences.length - 1} ek özel tercih kayıtlı
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Özel tercih notu yok</span>
                      )}
                    </td>

                    {/* 4. Sipariş / Harcama */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="space-y-0.5">
                        <strong className="text-slate-900 font-bold block text-xs">
                          ₺{cust.totalSpendAmount.toLocaleString('tr-TR')}
                        </strong>
                        <span className="text-[10px] text-slate-500 font-sans block">
                          {cust.totalOrdersCount} Sipariş
                        </span>
                      </div>
                    </td>

                    {/* 5. Veresiye Durumu */}
                    <td className="py-3.5 px-4">
                      {(cust.creditDebtBalance || 0) > 0 ? (
                        <span className="font-mono font-black text-rose-600 bg-rose-50 px-2 py-1 rounded-lg border border-rose-200 text-xs inline-block">
                          ₺{(cust.creditDebtBalance || 0).toLocaleString('tr-TR')} Borç
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Hesap Temiz
                        </span>
                      )}
                    </td>

                    {/* 6. İşlemler */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`https://wa.me/${cust.whatsapp}?text=Merhaba%20${encodeURIComponent(cust.name)},%20TamPazar%20üzerinden%20size%20ulaşıyorum.`}
                          target="_blank"
                          rel="noreferrer"
                          title="WhatsApp Gönder"
                          className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>

                        <a
                          href={`tel:${cust.phone}`}
                          title="Telefonla Ara"
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                        >
                          <Phone className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => setSelectedCustomer(cust)}
                          className="p-2 rounded-xl bg-[#0F4C3A]/10 hover:bg-[#0F4C3A]/20 text-[#0F4C3A] font-bold transition cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. MODAL: MÜŞTERİ DETAYI & İLİŞKİ YÖNETİMİ PROFİLİ */}
      {/* ========================================================================= */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-[#0B132B]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-xs animate-fade-in">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-[#0B132B] via-[#0F4C3A] to-[#0B132B] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F59E0B] text-slate-950 font-black text-lg flex items-center justify-center shadow-md">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base text-white">{selectedCustomer.name}</h3>
                    {getSegmentBadge(selectedCustomer.segment)}
                  </div>
                  <p className="text-xs text-slate-300 flex items-center gap-2">
                    <span>{selectedCustomer.phone}</span>
                    <span>·</span>
                    <span>{selectedCustomer.neighborhood} Mah., {selectedCustomer.city}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1">
              
              {/* Hızlı Aksiyon Barı */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <a
                  href={`https://wa.me/${selectedCustomer.whatsapp}?text=Merhaba%20Sayın%20${encodeURIComponent(selectedCustomer.name)},%20taze%20ürünlerimiz%20dükkanımızda%20hazırlandı.`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-center flex items-center justify-center gap-1.5 transition shadow-2xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Yaz</span>
                </a>

                <a
                  href={`tel:${selectedCustomer.phone}`}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-center flex items-center justify-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-indigo-700" />
                  <span>Telefonla Ara</span>
                </a>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center font-mono">
                  <span className="text-[10px] text-slate-400 block">Toplam Harcama</span>
                  <strong className="text-slate-900 font-bold">₺{selectedCustomer.totalSpendAmount.toLocaleString('tr-TR')}</strong>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center font-mono">
                  <span className="text-[10px] text-slate-400 block">Veresiye Borcu</span>
                  <strong className={selectedCustomer.creditDebtBalance ? 'text-rose-600 font-black' : 'text-emerald-700 font-bold'}>
                    ₺{(selectedCustomer.creditDebtBalance || 0).toLocaleString('tr-TR')}
                  </strong>
                </div>
              </div>

              {/* 1. MÜŞTERİ ÖZEL TERCİH HAFIZASI */}
              <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-amber-950 flex items-center gap-1.5 text-xs">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Müşteri Özel Tercihleri & Alışkanlıkları (Hafıza)
                  </span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full">
                    {selectedCustomer.preferences.length} Tercih Kayıtlı
                  </span>
                </div>

                <p className="text-[11px] text-amber-900/80 leading-relaxed">
                  Kasap, manav ve usta hazırlıklarında bu notlar sipariş fişine otomatik yansır (örn: çift çekim kıyma, zili çalmama).
                </p>

                <div className="space-y-1.5">
                  {selectedCustomer.preferences.map((pref, idx) => (
                    <div key={idx} className="bg-white p-2.5 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
                      <span className="text-slate-800 font-medium">✓ {pref}</span>
                      <button
                        onClick={() => handleRemovePreference(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition"
                        title="Tercihi Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Yeni Tercih Ekle */}
                <form onSubmit={handleAddPreference} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newPrefText}
                    onChange={(e) => setNewPrefText(e.target.value)}
                    placeholder="Örn: Ekmekleri kızarmış sever, zili çalmayın bebek var..."
                    className="flex-1 p-2 bg-white border border-amber-300 rounded-xl outline-none text-slate-800 text-xs"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl transition cursor-pointer text-xs shrink-0"
                  >
                    Ekle
                  </button>
                </form>
              </div>

              {/* 2. ADRES VE GENEL ESNAF NOTU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-700 block text-xs">Teslimat Adresi:</span>
                  <p className="text-slate-800 text-xs leading-relaxed">{selectedCustomer.address}</p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-700 block text-xs">Esnaf Özel Notu:</span>
                  <p className="text-slate-800 text-xs leading-relaxed italic">
                    "{selectedCustomer.notes || 'Herhangi bir esnaf notu girilmemiş.'}"
                  </p>
                </div>
              </div>

              {/* 3. İLETİŞİM & GÖRÜŞME GEÇMİŞİ */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-700" />
                    <span>Görüşme ve İletişim Geçmişi ({selectedCustomer.interactions.length})</span>
                  </h4>
                </div>

                {/* Yeni İletişim Kaydı Ekle Formu */}
                <form onSubmit={handleAddInteraction} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <select
                      value={newInteractionType}
                      onChange={(e) => setNewInteractionType(e.target.value as any)}
                      aria-label="İletişim Türü"
                      className="p-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 text-xs outline-none"
                    >
                      <option value="NOTE">📝 Not / Durum</option>
                      <option value="WHATSAPP">💬 WhatsApp Konuşması</option>
                      <option value="CALL">📞 Telefon Araması</option>
                      <option value="VISIT">🏪 Dükkan Ziyareti</option>
                    </select>
                    <input
                      type="text"
                      required
                      value={newInteractionSummary}
                      onChange={(e) => setNewInteractionSummary(e.target.value)}
                      placeholder="Görüşme özeti (Örn: Haftalık peynir siparişi teyit edildi)..."
                      className="flex-1 p-1.5 bg-white border border-slate-200 rounded-lg outline-none text-slate-800 text-xs"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-indigo-900 hover:bg-indigo-800 text-white font-bold rounded-lg text-xs transition cursor-pointer shrink-0"
                    >
                      Kaydet
                    </button>
                  </div>
                </form>

                {/* Timeline */}
                <div className="space-y-2">
                  {selectedCustomer.interactions.map((int) => (
                    <div key={int.id} className="p-3 bg-white rounded-xl border border-slate-100 flex items-start justify-between gap-3 shadow-2xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">
                            {int.type === 'WHATSAPP' && '💬 WhatsApp'}
                            {int.type === 'CALL' && '📞 Telefon Araması'}
                            {int.type === 'VISIT' && '🏪 Dükkan Ziyareti'}
                            {int.type === 'ORDER' && '📦 Sipariş Teslimatı'}
                            {int.type === 'NOTE' && '📝 Esnaf Notu'}
                          </span>
                          {int.staffName && (
                            <span className="text-[10px] text-slate-400">({int.staffName})</span>
                          )}
                        </div>
                        <p className="text-slate-700 text-xs">{int.summary}</p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">{int.date}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-400">
                Kayıt Tarihi: {selectedCustomer.createdAt}
              </span>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition cursor-pointer"
              >
                Kapat
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: YENİ MÜŞTERİ OLUŞTUR */}
      {/* ========================================================================= */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 bg-[#0B132B]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fade-in text-xs">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-100 text-slate-950 font-black">
                  <Users className="w-5 h-5 text-amber-600" />
                </span>
                <div>
                  <h4 className="font-black text-slate-900 text-sm">Yeni Müşteri & Hafıza Kaydı</h4>
                  <span className="text-[10px] text-slate-400">Mahalle müşterinizi CRM defterine ekleyin</span>
                </div>
              </div>
              <button 
                onClick={() => setShowAddCustomerModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ad Soyad *</label>
                  <input
                    type="text"
                    required
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    placeholder="Örn: Fatma Kaya"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Telefon Numarası *</label>
                  <input
                    type="tel"
                    required
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    placeholder="0532 000 00 00"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mahalle</label>
                  <input
                    type="text"
                    value={newCustNeighborhood}
                    onChange={(e) => setNewCustNeighborhood(e.target.value)}
                    placeholder="Bahçelievler"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Müşteri Segmenti</label>
                  <select
                    value={newCustSegment}
                    onChange={(e) => setNewCustSegment(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800"
                  >
                    <option value="REGULAR">🏡 Düzenli Mahalleli</option>
                    <option value="VIP">⭐ VIP Müşteri</option>
                    <option value="VERESIYE">📖 Veresiyeli Müşteri</option>
                    <option value="SOLIDARITY_DONOR">🥖 Askıda Katkıcısı</option>
                    <option value="NEW">🌱 Yeni Müşteri</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Açık Adres</label>
                <input
                  type="text"
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  placeholder="Sokak, Apartman No, Kat/Daire..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Özel Sipariş Tercihleri (Her satıra bir tercih)</label>
                <textarea
                  rows={2}
                  value={newCustPreferences}
                  onChange={(e) => setNewCustPreferences(e.target.value)}
                  placeholder="Örn: Dana kıymayı çift çektirir&#10;Zil çalmayın bebek uyuyor"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Esnafın Özel Notu</label>
                <input
                  type="text"
                  value={newCustNotes}
                  onChange={(e) => setNewCustNotes(e.target.value)}
                  placeholder="Örn: Komşu berberin teyzesi, her cuma alışveriş yapar."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 bg-[#0F4C3A] hover:bg-[#0B3A2C] text-white font-black rounded-xl shadow-md transition cursor-pointer"
                >
                  Müşteriyi Kaydet
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
