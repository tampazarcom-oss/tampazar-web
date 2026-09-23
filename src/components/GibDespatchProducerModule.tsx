/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileSpreadsheet, Truck, Wheat, ShieldCheck, Printer, 
  Plus, CheckCircle2, Code2, Eye, Calendar, UserCheck, AlertCircle
} from 'lucide-react';
import { Tenant } from '../data/mockData';

interface GibDespatchProducerModuleProps {
  currentTenant: Tenant;
}

export interface DespatchNote {
  id: string;
  despatchNumber: string;
  receiverTitle: string;
  receiverTaxId: string;
  receiverAddress: string;
  driverName: string;
  driverTckn: string;
  vehiclePlate: string;
  carrierTaxId: string;
  dispatchDate: string;
  dispatchTime: string;
  items: { name: string; qty: number; unit: string }[];
  status: 'sent_to_gib' | 'delivered' | 'draft';
}

export interface ProducerReceipt {
  id: string;
  receiptNumber: string;
  farmerName: string;
  farmerTckn: string;
  farmerVillage: string;
  cropType: string;
  grossAmount: number;
  incomeTaxRate: number; // Stopaj %1 veya %2
  incomeTaxAmount: number;
  sgkCutRate: number; // SGK Tevkifat %2
  sgkCutAmount: number;
  netPayableToFarmer: number;
  date: string;
  status: 'gib_approved' | 'draft';
}

export const INITIAL_DESPATCHES: DespatchNote[] = [
  {
    id: 'dsp-01',
    despatchNumber: 'IRS2026000000412',
    receiverTitle: 'Mega Endüstriyel Tesisler A.Ş.',
    receiverTaxId: '7840192849',
    receiverAddress: 'İkitelli OSB Metal-İş San. Sit. No: 12 Başakşehir / İstanbul',
    driverName: 'Kemal Yılmaz',
    driverTckn: '28491029482',
    vehiclePlate: '52 K 4819 / 52 TR 902',
    carrierTaxId: '5290184910',
    dispatchDate: '2026-09-23',
    dispatchTime: '08:30',
    items: [
      { name: 'Masif Meşe Kütük Tabla (240x100cm)', qty: 15, unit: 'Adet' },
      { name: 'Endüstriyel Metal Bağlantı Ayakları', qty: 30, unit: 'Takım' }
    ],
    status: 'sent_to_gib'
  },
  {
    id: 'dsp-02',
    despatchNumber: 'IRS2026000000413',
    receiverTitle: 'Ankara Lojistik Dağıtım Ltd.',
    receiverTaxId: '1092849102',
    receiverAddress: 'Saray Mah. Gıdacılar Cad. No: 4 Kazan / Ankara',
    driverName: 'Murat Arslan',
    driverTckn: '39481029481',
    vehiclePlate: '06 DB 1928',
    carrierTaxId: '0691029481',
    dispatchDate: '2026-09-23',
    dispatchTime: '11:15',
    items: [
      { name: 'Koli İçi Asorti Hakiki Deri Ayakkabı', qty: 250, unit: 'Çift' }
    ],
    status: 'sent_to_gib'
  }
];

export const INITIAL_RECEIPTS: ProducerReceipt[] = [
  {
    id: 'rec-01',
    receiptNumber: 'MSM2026000000189',
    farmerName: 'Mehmet Ali Gürbüz (Üretici Çiftçi)',
    farmerTckn: '38192049182',
    farmerVillage: 'Gölköy / Karadeniz',
    cropType: 'Kabuklu Yağlı Tombul Fındık (Randıman: 52)',
    grossAmount: 185000,
    incomeTaxRate: 2,
    incomeTaxAmount: 3700,
    sgkCutRate: 2,
    sgkCutAmount: 3700,
    netPayableToFarmer: 177600,
    date: '2026-09-22',
    status: 'gib_approved'
  }
];

export default function GibDespatchProducerModule({ currentTenant }: GibDespatchProducerModuleProps) {
  const [activeSubTab, setActiveSubTab] = useState<'despatch' | 'producer'>('despatch');

  const [despatches, setDespatches] = useState<DespatchNote[]>(() => {
    const saved = localStorage.getItem('tampazar_despatches_' + currentTenant.id);
    return saved ? JSON.parse(saved) : INITIAL_DESPATCHES;
  });

  const [receipts, setReceipts] = useState<ProducerReceipt[]>(() => {
    const saved = localStorage.getItem('tampazar_receipts_' + currentTenant.id);
    return saved ? JSON.parse(saved) : INITIAL_RECEIPTS;
  });

  const [selectedXmlView, setSelectedXmlView] = useState<string | null>(null);

  // New Despatch Modal
  const [showNewDespatchModal, setShowNewDespatchModal] = useState(false);
  const [receiverTitle, setReceiverTitle] = useState('');
  const [receiverTaxId, setReceiverTaxId] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverTckn, setDriverTckn] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemQty, setItemQty] = useState(10);

  // New Producer Receipt Modal
  const [showNewReceiptModal, setShowNewReceiptModal] = useState(false);
  const [farmerName, setFarmerName] = useState('');
  const [farmerTckn, setFarmerTckn] = useState('');
  const [cropType, setCropType] = useState('Kabuklu Tombul Fındık (50+ Randıman)');
  const [grossAmount, setGrossAmount] = useState(120000);

  const handleCreateDespatch = (e: React.FormEvent) => {
    e.preventDefault();
    const newDsp: DespatchNote = {
      id: 'dsp-' + Date.now(),
      despatchNumber: 'IRS2026000000' + Math.floor(100 + Math.random() * 899),
      receiverTitle: receiverTitle || 'Örnek Alıcı Ticaret A.Ş.',
      receiverTaxId: receiverTaxId || '1940192840',
      receiverAddress: 'Sanayi Cad. No: 15 / Türkiye',
      driverName: driverName || 'Ali Öz',
      driverTckn: driverTckn || '19284910294',
      vehiclePlate: vehiclePlate || '52 AB 123',
      carrierTaxId: currentTenant.taxId || '5290184910',
      dispatchDate: new Date().toISOString().split('T')[0],
      dispatchTime: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      items: [{ name: itemName || 'Sevk Edilen Malzeme', qty: itemQty, unit: 'Adet' }],
      status: 'sent_to_gib'
    };

    const updated = [newDsp, ...despatches];
    setDespatches(updated);
    localStorage.setItem('tampazar_despatches_' + currentTenant.id, JSON.stringify(updated));
    setShowNewDespatchModal(false);
  };

  const handleCreateProducerReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    const tax = grossAmount * 0.02; // %2 Stopaj
    const sgk = grossAmount * 0.02; // %2 SGK
    const net = grossAmount - tax - sgk;

    const newRec: ProducerReceipt = {
      id: 'rec-' + Date.now(),
      receiptNumber: 'MSM2026000000' + Math.floor(100 + Math.random() * 899),
      farmerName: farmerName || 'Mustafa Demir (Müstahsil)',
      farmerTckn: farmerTckn || '10294819204',
      farmerVillage: 'Akkuş / Karadeniz',
      cropType: cropType,
      grossAmount: grossAmount,
      incomeTaxRate: 2,
      incomeTaxAmount: tax,
      sgkCutRate: 2,
      sgkCutAmount: sgk,
      netPayableToFarmer: net,
      date: new Date().toISOString().split('T')[0],
      status: 'gib_approved'
    };

    const updated = [newRec, ...receipts];
    setReceipts(updated);
    localStorage.setItem('tampazar_receipts_' + currentTenant.id, JSON.stringify(updated));
    setShowNewReceiptModal(false);
  };

  const generateDespatchXml = (d: DespatchNote) => `<?xml version="1.0" encoding="UTF-8"?>
<DespatchAdvice xmlns="urn:oasis:names:specification:ubl:schema:xsd:DespatchAdvice-2"
                xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
                xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:UBLVersionID>2.1</cbc:UBLVersionID>
  <cbc:CustomizationID>TR1.2</cbc:CustomizationID>
  <cbc:ProfileID>TEMELIRSALIYE</cbc:ProfileID>
  <cbc:ID>${d.despatchNumber}</cbc:ID>
  <cbc:CopyIndicator>false</cbc:CopyIndicator>
  <cbc:UUID>550e8400-e29b-41d4-a716-446655440000</cbc:UUID>
  <cbc:IssueDate>${d.dispatchDate}</cbc:IssueDate>
  <cbc:IssueTime>${d.dispatchTime}:00</cbc:IssueTime>
  <cac:DespatchSupplierParty>
    <cac:Party>
      <cac:PartyIdentification><cbc:ID schemeID="VKN">${currentTenant.taxId || '5284019284'}</cbc:ID></cac:PartyIdentification>
      <cac:PartyName><cbc:Name>${currentTenant.name}</cbc:Name></cac:PartyName>
    </cac:Party>
  </cac:DespatchSupplierParty>
  <cac:DeliveryCustomerParty>
    <cac:Party>
      <cac:PartyIdentification><cbc:ID schemeID="VKN">${d.receiverTaxId}</cbc:ID></cac:PartyIdentification>
      <cac:PartyName><cbc:Name>${d.receiverTitle}</cbc:Name></cac:PartyName>
    </cac:Party>
  </cac:DeliveryCustomerParty>
  <cac:Shipment>
    <cbc:ID>1</cbc:ID>
    <cac:TransportHandlingUnit>
      <cac:TransportEquipment>
        <cbc:ID>${d.vehiclePlate}</cbc:ID>
      </cac:TransportEquipment>
    </cac:TransportHandlingUnit>
    <cac:DriverPerson>
      <cbc:FirstName>${d.driverName}</cbc:FirstName>
      <cbc:ID schemeID="TCKN">${d.driverTckn}</cbc:ID>
    </cac:DriverPerson>
  </cac:Shipment>
</DespatchAdvice>`;

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Header */}
      <div>
        <span className="text-xs font-mono text-emerald-700 tracking-wider uppercase font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
          GİB UBL-TR 2.1 E-Belge Motoru
        </span>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 mt-2">
          GİB e-İrsaliye ve e-Müstahsil Makbuzu (e-MM) Modülü
        </h2>
        <p className="text-slate-500 text-sm mt-1 max-w-3xl leading-relaxed">
          Toptan sevk yapan işletmeler, tarım ve hal tüccarları için yerel mevzuata tam uyumlu e-İrsaliye (şoför TCKN, plaka, sevk saati) ve çiftçiden doğrudan ürün alımında Gelir Vergisi stopajı hesaplayan e-Müstahsil Makbuzu.
        </p>
      </div>

      {/* Sub Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSubTab('despatch')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'despatch'
              ? 'bg-slate-900 text-white shadow'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Truck className="w-4 h-4 text-amber-400" />
          <span>🚚 GİB e-İrsaliye (Sevk Yönetimi)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('producer')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'producer'
              ? 'bg-emerald-900 text-white shadow'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Wheat className="w-4 h-4 text-emerald-400" />
          <span>🌾 GİB e-Müstahsil Makbuzu (Çiftçi / Hal)</span>
        </button>
      </div>

      {/* DESPATCH SECTION */}
      {activeSubTab === 'despatch' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">Fiili Sevk Öncesi Yasal GİB e-İrsaliye Kaydı</h3>
              </div>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Kamyon / tır yola çıkmadan önce araç plakası ve şoför kimlik bilgileriyle resmi e-İrsaliye XML'i oluşturulur ve GİB portalına iletilir.
              </p>
            </div>
            <button
              onClick={() => setShowNewDespatchModal(true)}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-colors shrink-0 flex items-center gap-2 cursor-pointer shadow"
            >
              <Plus className="w-4 h-4" /> Yeni e-İrsaliye Düzenle
            </button>
          </div>

          {/* New Despatch Form */}
          {showNewDespatchModal && (
            <div className="bg-white border-2 border-indigo-100 rounded-3xl p-6 shadow-xl space-y-4 animate-fade-in">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Truck className="w-4 h-4 text-indigo-600" /> Yeni Sevk İrsaliyesi Oluştur
                </h3>
                <button onClick={() => setShowNewDespatchModal(false)} className="text-xs text-slate-400 hover:text-slate-600">İptal</button>
              </div>

              <form onSubmit={handleCreateDespatch} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Alıcı Firma Ünvanı</label>
                  <input 
                    type="text" 
                    required
                    value={receiverTitle}
                    onChange={(e) => setReceiverTitle(e.target.value)}
                    placeholder="Örn: Toroslar İnşaat Malzemeleri Ltd."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Alıcı VKN / TCKN</label>
                  <input 
                    type="text" 
                    required
                    value={receiverTaxId}
                    onChange={(e) => setReceiverTaxId(e.target.value)}
                    placeholder="10 Haneli VKN"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Araç Çekici & Dorse Plakası</label>
                  <input 
                    type="text" 
                    required
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value)}
                    placeholder="Örn: 52 K 9921 / 52 TR 04"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono outline-none uppercase"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Şoför Adı Soyadı</label>
                  <input 
                    type="text" 
                    required
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="Örn: Hasan Yılmaz"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Şoför TCKN (11 Hane)</label>
                  <input 
                    type="text" 
                    required
                    value={driverTckn}
                    onChange={(e) => setDriverTckn(e.target.value)}
                    placeholder="11 Haneli TCKN"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sevk Edilen Mal & Miktar</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      placeholder="Malzeme Tanımı"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none"
                    />
                    <input 
                      type="number" 
                      value={itemQty}
                      onChange={(e) => setItemQty(parseInt(e.target.value) || 1)}
                      placeholder="Miktar"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono outline-none"
                    />
                  </div>
                </div>

                <div className="md:col-span-3 pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shadow"
                  >
                    e-İrsaliyeyi İmzala ve GİB Portalına Gönder
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Despatches Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-900" /> Kayıtlı GİB e-İrsaliyeler
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                  <tr>
                    <th className="p-4">İrsaliye No & Tarih</th>
                    <th className="p-4">Alıcı Firma</th>
                    <th className="p-4">Şoför & Plaka</th>
                    <th className="p-4">Sevk İçeriği</th>
                    <th className="p-4">GİB Durumu</th>
                    <th className="p-4 text-right">XML / Belge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {despatches.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4">
                        <span className="font-bold text-slate-900 block">{d.despatchNumber}</span>
                        <span className="text-[10px] text-slate-400">{d.dispatchDate} {d.dispatchTime}</span>
                      </td>
                      <td className="p-4 font-sans">
                        <span className="font-bold text-slate-800 block">{d.receiverTitle}</span>
                        <span className="text-[11px] text-slate-500 font-mono">{d.receiverTaxId}</span>
                      </td>
                      <td className="p-4 font-sans">
                        <span className="font-bold text-slate-900 block font-mono uppercase">{d.vehiclePlate}</span>
                        <span className="text-[11px] text-slate-500">{d.driverName} ({d.driverTckn})</span>
                      </td>
                      <td className="p-4 font-sans">
                        {d.items.map((it, idx) => (
                          <span key={idx} className="block text-slate-800">
                            {it.qty} {it.unit} {it.name}
                          </span>
                        ))}
                      </td>
                      <td className="p-4 font-sans">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-max">
                          <CheckCircle2 className="w-3 h-3" /> GİB 1300 Başarılı
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedXmlView(generateDespatchXml(d))}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 ml-auto transition-colors cursor-pointer"
                        >
                          <Code2 className="w-3.5 h-3.5 text-indigo-600" /> UBL-TR XML
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCER SECTION (e-Müstahsil Makbuzu) */}
      {activeSubTab === 'producer' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Wheat className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">Çiftçiden / Müstahsilden Ürün Alımı (e-MM)</h3>
              </div>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Vergi mükellefi olmayan çiftçilerden fındık, buğday, sebze/meyve veya canlı hayvan alımında otomatik Gelir Vergisi stopajı ve SGK kesintisiyle e-Müstahsil Makbuzu düzenleyin.
              </p>
            </div>
            <button
              onClick={() => setShowNewReceiptModal(true)}
              className="px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs rounded-xl transition-colors shrink-0 flex items-center gap-2 cursor-pointer shadow"
            >
              <Plus className="w-4 h-4" /> Yeni e-Müstahsil Makbuzu Kes
            </button>
          </div>

          {/* New Producer Receipt Form */}
          {showNewReceiptModal && (
            <div className="bg-white border-2 border-emerald-100 rounded-3xl p-6 shadow-xl space-y-4 animate-fade-in">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Wheat className="w-4 h-4 text-emerald-600" /> Yeni Müstahsil Makbuzu Düzenle
                </h3>
                <button onClick={() => setShowNewReceiptModal(false)} className="text-xs text-slate-400 hover:text-slate-600">İptal</button>
              </div>

              <form onSubmit={handleCreateProducerReceipt} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Müstahsil / Çiftçi Adı Soyadı</label>
                  <input 
                    type="text" 
                    required
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    placeholder="Örn: Hasan Yılmaz"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Çiftçi TCKN (11 Hane)</label>
                  <input 
                    type="text" 
                    required
                    value={farmerTckn}
                    onChange={(e) => setFarmerTckn(e.target.value)}
                    placeholder="11 Haneli TCKN"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Alınan Tarım Ürünü / Cinsi</label>
                  <input 
                    type="text" 
                    required
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    placeholder="Örn: 2026 Mahsulü Kabuklu Yağlı Fındık"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Brüt Alım Tutarı (₺)</label>
                  <input 
                    type="number" 
                    required
                    value={grossAmount}
                    onChange={(e) => setGrossAmount(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono outline-none"
                  />
                </div>

                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span>Gelir Vergisi Stopajı (%2):</span>
                    <strong className="font-mono">{(grossAmount * 0.02).toLocaleString('tr-TR')} ₺</strong>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>SGK Tevkifat Kesintisi (%2):</span>
                    <strong className="font-mono">{(grossAmount * 0.02).toLocaleString('tr-TR')} ₺</strong>
                  </div>
                </div>

                <div className="bg-slate-900 text-white p-3 rounded-xl flex flex-col justify-center">
                  <span className="text-[10px] text-slate-400">ÇİFTÇİYE ÖDENECEK NET TUTAR:</span>
                  <span className="text-base font-black text-emerald-400 font-mono">
                    {(grossAmount * 0.96).toLocaleString('tr-TR')} ₺
                  </span>
                </div>

                <div className="md:col-span-3 pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors shadow"
                  >
                    e-Müstahsil Makbuzunu İmzala ve GİB'e İlet
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Receipts Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Wheat className="w-5 h-5 text-emerald-800" /> Düzenlenen e-Müstahsil Makbuzları
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                  <tr>
                    <th className="p-4">Makbuz No & Tarih</th>
                    <th className="p-4">Müstahsil / Çiftçi</th>
                    <th className="p-4">Ürün Cinsi</th>
                    <th className="p-4">Brüt Tutar</th>
                    <th className="p-4">Stopaj + SGK (%4)</th>
                    <th className="p-4">Çiftçiye Ödenen Net</th>
                    <th className="p-4 text-right">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {receipts.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4">
                        <span className="font-bold text-slate-900 block">{r.receiptNumber}</span>
                        <span className="text-[10px] text-slate-400">{r.date}</span>
                      </td>
                      <td className="p-4 font-sans">
                        <span className="font-bold text-slate-800 block">{r.farmerName}</span>
                        <span className="text-[11px] text-slate-500 font-mono">{r.farmerTckn} ({r.farmerVillage})</span>
                      </td>
                      <td className="p-4 font-sans">
                        <span className="text-slate-800 block">{r.cropType}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-slate-700">{r.grossAmount.toLocaleString('tr-TR')} ₺</span>
                      </td>
                      <td className="p-4 text-amber-700 font-bold">
                        -{(r.incomeTaxAmount + r.sgkCutAmount).toLocaleString('tr-TR')} ₺
                      </td>
                      <td className="p-4 font-black text-emerald-700 text-sm">
                        {r.netPayableToFarmer.toLocaleString('tr-TR')} ₺
                      </td>
                      <td className="p-4 text-right font-sans">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> GİB Onaylandı
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* XML Code Inspection Modal */}
      {selectedXmlView && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-950 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-700 flex flex-col max-h-[85vh]">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center text-xs">
              <span className="font-bold flex items-center gap-2">
                <Code2 className="w-4 h-4 text-amber-400" /> UBL-TR 2.1 e-İrsaliye Standard XML
              </span>
              <button onClick={() => setSelectedXmlView(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <pre className="p-6 text-[11px] font-mono text-emerald-400 overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {selectedXmlView}
            </pre>
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedXmlView(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
