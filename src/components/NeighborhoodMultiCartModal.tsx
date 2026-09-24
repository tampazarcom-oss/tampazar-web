/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, X, Plus, Minus, Trash2, Store, Truck, 
  ShieldCheck, CheckCircle2, MessageSquare, Phone, 
  CreditCard, Wallet, Heart, ArrowRight, Sparkles, Building2, MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  DirectPaymentMethod, 
  HybridOrder, 
  formatPaymentMethodText, 
  generateWhatsAppOrderUrl, 
  addSuspendedItemDonation,
  playOrderAlertChime 
} from '../data/hybridCommerceData';

export interface CartStoreItem {
  id: string;
  storeId: string;
  storeName: string;
  storeCategory: 'Kasap' | 'Manav' | 'Fırın' | 'Şarküteri' | 'Restoran' | 'Butik' | 'Diğer';
  storePhone: string;
  storeAddress: string;
  productId: string;
  title: string;
  image: string;
  price: number;
  qty: number;
  unitLabel: string;
  variant?: string;
}

interface NeighborhoodMultiCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderPlaced?: (order: HybridOrder) => void;
}

// Initial Sample Multi-Store Neighborhood Basket (Kasap + Manav + Fırın)
const INITIAL_CART_ITEMS: CartStoreItem[] = [
  {
    id: 'c-1',
    storeId: 'kasap-mehmet',
    storeName: 'Öz Kardeşler Kasabı',
    storeCategory: 'Kasap',
    storePhone: '905321112233',
    storeAddress: 'Bahçelievler Mah. Atatürk Cad. No: 14',
    productId: 'p-kasap-1',
    title: 'Taze Dana Kıyma (Az Yağlı - Çift Çekim)',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=300',
    price: 340,
    qty: 1,
    unitLabel: 'Kg'
  },
  {
    id: 'c-2',
    storeId: 'manav-ahmet',
    storeName: 'Taze Bahçe Manavı',
    storeCategory: 'Manav',
    storePhone: '905332223344',
    storeAddress: 'Bahçelievler Mah. Atatürk Cad. No: 18',
    productId: 'p-manav-1',
    title: 'Köy Domatesi & Çengelköy Salatalık Paketi',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300',
    price: 120,
    qty: 1,
    unitLabel: 'Paket'
  },
  {
    id: 'c-3',
    storeId: 'firin-karadeniz',
    storeName: 'Tarihi Karadeniz Taş Fırını',
    storeCategory: 'Fırın',
    storePhone: '905353334455',
    storeAddress: 'Bahçelievler Mah. 102. Sok. No: 3',
    productId: 'p-firin-1',
    title: 'Taş Fırın Sıcak Trabzon Ekmeği',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300',
    price: 45,
    qty: 2,
    unitLabel: 'Adet'
  }
];

export default function NeighborhoodMultiCartModal({
  isOpen,
  onClose,
  onOrderPlaced
}: NeighborhoodMultiCartModalProps) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartStoreItem[]>(() => {
    try {
      const saved = localStorage.getItem('tampazar_multi_cart');
      return saved ? JSON.parse(saved) : INITIAL_CART_ITEMS;
    } catch {
      return INITIAL_CART_ITEMS;
    }
  });

  // Selected Direct Payment Method
  const [paymentMethod, setPaymentMethod] = useState<DirectPaymentMethod>('CASH_ON_DELIVERY');

  // Askıda Mahalle & Dayanışma Seçimi
  const [askidaType, setAskidaType] = useState<'NONE' | 'BREAD' | 'SOUP' | 'PIDE'>('BREAD');
  const [askidaCount, setAskidaCount] = useState<number>(1);

  // Müşteri İletişim Bilgileri
  const [customerName, setCustomerName] = useState(user?.name || 'Cemre Demir');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '0532 444 55 66');
  const [customerAddress, setCustomerAddress] = useState('Bahçelievler Mah. Atatürk Cad. No: 28 D: 5, Altınordu / Ordu');
  const [orderNotes, setOrderNotes] = useState('Zil çalınabilir, kapıda teslim.');

  // Order Placement Success State
  const [placedOrder, setPlacedOrder] = useState<HybridOrder | null>(null);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('tampazar_multi_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  if (!isOpen) return null;

  // Askıda Ürün Fiyatları
  const askidaPrices: { [key: string]: { name: string; price: number } } = {
    BREAD: { name: 'Askıda Taş Fırın Ekmeği', price: 15 },
    SOUP: { name: 'Askıda Sıcak Çorba', price: 60 },
    PIDE: { name: 'Askıda Mahalle Pidesi', price: 45 },
    NONE: { name: 'Seçilmedi', price: 0 }
  };

  const askidaSubtotal = askidaType !== 'NONE' ? askidaPrices[askidaType].price * askidaCount : 0;

  // Items Subtotal
  const itemsSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Unique stores count
  const uniqueStores = Array.from(new Set(cartItems.map(i => i.storeId))).map(storeId => {
    const items = cartItems.filter(i => i.storeId === storeId);
    const store = items[0];
    const storeSum = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    return {
      storeId,
      storeName: store.storeName,
      storeCategory: store.storeCategory,
      category: store.storeCategory,
      phone: store.storePhone,
      items: items.map(i => `${i.qty}x ${i.title}`),
      amount: storeSum
    };
  });

  // Shared neighborhood courier fee
  const sharedCourierFee = cartItems.length > 0 ? 35 : 0;
  const grandTotal = itemsSubtotal + askidaSubtotal + sharedCourierFee;

  const handleUpdateQty = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartStoreItem[]);
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const handlePlaceDirectOrder = () => {
    if (cartItems.length === 0) return;

    const newOrderNumber = `TPZ-MHL-${Date.now().toString().slice(-6)}`;
    const newOrder: HybridOrder = {
      id: `ord-multi-${Date.now()}`,
      orderNumber: newOrderNumber,
      deliveryType: 'LOCAL_EXPRESS',
      tenantId: 'multi-store-tenant',
      storeName: uniqueStores.map(s => s.storeName).join(' + '),
      customerName,
      customerPhone,
      customerAddress,
      city: 'Ordu',
      district: 'Altınordu',
      items: cartItems.map(i => ({
        productId: i.productId,
        title: i.title,
        price: i.price,
        qty: i.qty,
        variant: i.variant,
        customization: {
          selectedWeightOrQty: i.qty,
          unitLabel: i.unitLabel
        }
      })),
      totalAmount: grandTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'CASH_ON_DELIVERY' || paymentMethod === 'DOOR_CARD_POS' ? 'AT_DOOR' : 'PENDING',
      isMultiStoreOrder: true,
      multiStoreBreakdown: uniqueStores,
      sharedCourierFee,
      status: 'RINGING',
      suspendedContribution: askidaType !== 'NONE' ? {
        type: askidaType as any,
        typeName: askidaPrices[askidaType].name,
        count: askidaCount,
        unitPrice: askidaPrices[askidaType].price,
        totalAmount: askidaSubtotal
      } : undefined,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    // If askıda contributed, add to suspended ledger
    if (askidaType !== 'NONE') {
      addSuspendedItemDonation({
        storeId: uniqueStores[0]?.storeId || 'firin-karadeniz',
        storeName: uniqueStores[0]?.storeName || 'Tarihi Karadeniz Taş Fırını',
        type: askidaType as any,
        typeName: askidaPrices[askidaType].name,
        unitPrice: askidaPrices[askidaType].price,
        count: askidaCount,
        donorName: customerName
      });
    }

    // Save to orders
    try {
      const existing = localStorage.getItem('tampazar_hybrid_orders');
      const list = existing ? JSON.parse(existing) : [];
      localStorage.setItem('tampazar_hybrid_orders', JSON.stringify([newOrder, ...list]));
    } catch {}

    playOrderAlertChime();
    setPlacedOrder(newOrder);
    if (onOrderPlaced) onOrderPlaced(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0B132B]/75 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* ÜST BAŞLIK */}
        <div className="p-5 bg-gradient-to-r from-[#0B132B] via-[#0F4C3A] to-[#0B132B] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F59E0B] text-slate-950 flex items-center justify-center font-black shadow-md">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-white">TamKurye: Mahalle Çoklu Dükkan Sepeti</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                  %0 Komisyon
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Kasap + Manav + Fırın tek sepette, tek kurye ile doğrudan kapınızda.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* İÇERİK (SCROLL) */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {placedOrder ? (
            /* ========================================================= */
            /* SİPARİŞ ONAYLANDI & WHATSAPP DOĞRUDAN FİŞ EKRANI */
            /* ========================================================= */
            <div className="text-center py-6 space-y-5 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1 max-w-md mx-auto">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Sipariş No: #{placedOrder.orderNumber}
                </span>
                <h4 className="text-xl font-black text-slate-900 pt-1">
                  Mahalle Siparişiniz Alındı!
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Ödemeniz herhangi bir aracı havuza girmeden, <strong>doğrudan esnafa ve kuryeye</strong> yapılacaktır.
                </p>
              </div>

              {/* Dükkan ve Tutar Özeti */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-3 max-w-md mx-auto">
                <span className="font-bold text-slate-900 block text-xs">Doğrudan Tahsilat Dağılımı:</span>
                <div className="space-y-1.5 divide-y divide-slate-100">
                  {placedOrder.multiStoreBreakdown?.map((store, sIdx) => (
                    <div key={sIdx} className="pt-1.5 flex items-center justify-between text-xs">
                      <span className="text-slate-700 font-medium">🏪 {store.storeName} ({store.category}):</span>
                      <span className="font-black text-slate-900 font-mono">₺{store.amount.toLocaleString('tr-TR')}</span>
                    </div>
                  ))}
                  {placedOrder.suspendedContribution && (
                    <div className="pt-1.5 flex items-center justify-between text-xs text-amber-900 font-bold bg-amber-50 p-2 rounded-xl">
                      <span>🥖 {placedOrder.suspendedContribution.typeName}:</span>
                      <span className="font-mono font-black">+₺{placedOrder.suspendedContribution.totalAmount}</span>
                    </div>
                  )}
                  <div className="pt-2 flex items-center justify-between text-xs text-emerald-800 font-bold">
                    <span>🛵 Ortak Mahalle Kuryesi:</span>
                    <span className="font-mono">₺{placedOrder.sharedCourierFee || 35}</span>
                  </div>
                  <div className="pt-2 flex items-center justify-between text-sm font-black text-slate-900 border-t-2 border-slate-200">
                    <span>Toplam Tahsil Edilecek:</span>
                    <span className="font-mono text-base text-[#0F4C3A]">₺{placedOrder.totalAmount.toLocaleString('tr-TR')}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 font-medium">
                  {formatPaymentMethodText(placedOrder.paymentMethod)}
                </div>
              </div>

              {/* WHATSAPP SİPARİŞ FİŞİ AKSİYONU */}
              <div className="space-y-2 max-w-md mx-auto">
                <a
                  href={generateWhatsAppOrderUrl(uniqueStores[0]?.phone || '905321112233', placedOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-100" />
                  <span>Sipariş Fişini WhatsApp ile Esnafa Gönder</span>
                </a>

                <button
                  onClick={() => {
                    setCartItems([]);
                    onClose();
                  }}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Pencereyi Kapat & Alışverişe Devam Et
                </button>
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* SEPET VE SİPARİŞ DÜZENLEME FORMU */
            /* ========================================================= */
            <>
              {/* ŞEFFAFLIK ROZETİ (Sıfır Komisyon) */}
              <div className="p-3.5 bg-[#0F4C3A]/10 border border-[#0F4C3A]/30 rounded-2xl flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#0F4C3A] shrink-0" />
                <div className="text-[11px] text-slate-800 leading-snug">
                  <strong>TamPazar Güvencesi:</strong> Platformumuz ödemelerinizden hiçbir komisyon veya aracı ücreti kesmez; tüm tutar doğrudan mahallenizdeki esnafa ve kuryeye teslim edilir.
                </div>
              </div>

              {/* 1. SEPETTEKİ DÜKKANLAR VE ÜRÜNLER */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-[#0F4C3A]" />
                    <span>Mahalle Sepetindeki Ürünler ({cartItems.length})</span>
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {uniqueStores.length} Farklı Mahalle Dükkanı
                  </span>
                </div>

                {cartItems.length === 0 ? (
                  <div className="text-center py-8 space-y-2 text-slate-400">
                    <ShoppingBag className="w-10 h-10 mx-auto text-slate-300" />
                    <p>Sepetinizde ürün bulunmuyor.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {uniqueStores.map((store) => {
                      const storeProducts = cartItems.filter(i => i.storeId === store.storeId);
                      return (
                        <div key={store.storeId} className="bg-slate-50/80 rounded-2xl border border-slate-200 p-3.5 space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-md bg-[#0F4C3A] text-white font-bold text-[10px]">
                                {store.storeCategory}
                              </span>
                              <span className="font-black text-slate-900 text-xs">{store.storeName}</span>
                            </div>
                            <span className="font-mono font-bold text-slate-700 text-xs">
                              Ara Toplam: ₺{store.amount.toLocaleString('tr-TR')}
                            </span>
                          </div>

                          <div className="divide-y divide-slate-100">
                            {storeProducts.map((item) => (
                              <div key={item.id} className="py-2 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                  <img src={item.image} alt={item.title} className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" />
                                  <div>
                                    <h5 className="font-bold text-slate-900 text-xs line-clamp-1">{item.title}</h5>
                                    <span className="text-[10px] text-slate-500 font-mono">
                                      {item.price} ₺ / {item.unitLabel}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden shadow-xs">
                                    <button
                                      onClick={() => handleUpdateQty(item.id, -1)}
                                      className="p-1 px-2 hover:bg-slate-100 text-slate-600 transition"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="px-2 font-black font-mono text-xs">{item.qty}</span>
                                    <button
                                      onClick={() => handleUpdateQty(item.id, 1)}
                                      className="p-1 px-2 hover:bg-slate-100 text-slate-600 transition"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="p-1 text-slate-400 hover:text-rose-600 transition"
                                    title="Ürünü Sil"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 2. ASKIDA MAHALLE & DAYANIŞMA KUTUSU */}
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-900 font-black text-xs">
                    <Heart className="w-4 h-4 text-amber-600 fill-amber-500" />
                    <span>Askıda Mahalle & Dayanışma Katkısı</span>
                  </div>
                  <span className="text-[10px] bg-amber-200/80 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                    Gönüllü İyilik
                  </span>
                </div>

                <p className="text-[11px] text-amber-900/80 leading-relaxed">
                  İhtiyaç sahibi mahalle sakinleri için dükkana askıda ekmek veya çorba bırakabilirsiniz. Tutar esnafa doğrudan ödenir ve esnafın askı panosuna işlenir.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {[
                    { id: 'NONE', label: 'Katkı Yok', price: 0 },
                    { id: 'BREAD', label: '🥖 Askıda Ekmek', price: 15 },
                    { id: 'SOUP', label: '🍲 Askıda Çorba', price: 60 },
                    { id: 'PIDE', label: '🥧 Askıda Pide', price: 45 },
                  ].map(ask => (
                    <button
                      key={ask.id}
                      type="button"
                      onClick={() => setAskidaType(ask.id as any)}
                      className={`p-2 rounded-xl text-center border transition cursor-pointer text-xs ${
                        askidaType === ask.id
                          ? 'bg-amber-500 text-slate-950 font-black border-amber-600 shadow-xs'
                          : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100/50'
                      }`}
                    >
                      <span className="block">{ask.label}</span>
                      {ask.price > 0 && (
                        <span className="text-[10px] font-mono block opacity-90">+₺{ask.price}</span>
                      )}
                    </button>
                  ))}
                </div>

                {askidaType !== 'NONE' && (
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-amber-900 font-bold">Askı Adedi:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAskidaCount(prev => Math.max(1, prev - 1))}
                        className="w-6 h-6 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="font-black font-mono text-amber-950 px-1">{askidaCount} Adet</span>
                      <button
                        type="button"
                        onClick={() => setAskidaCount(prev => prev + 1)}
                        className="w-6 h-6 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold flex items-center justify-center"
                      >
                        +
                      </button>
                      <span className="text-amber-950 font-black font-mono ml-2">(+₺{askidaSubtotal})</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. DOĞRUDAN ÖDEME YÖNTEMİ SEÇİCİ */}
              <div className="space-y-3">
                <h4 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-[#0F4C3A]" />
                  <span>Doğrudan Tahsilat & Ödeme Yöntemi</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* a) Kapıda Nakit */}
                  <label
                    onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                    className={`p-3 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between space-y-1.5 ${
                      paymentMethod === 'CASH_ON_DELIVERY'
                        ? 'border-[#0F4C3A] bg-[#0F4C3A]/5 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-900 text-xs">💵 Kapıda Nakit</span>
                      <input
                        type="radio"
                        name="payMethod"
                        checked={paymentMethod === 'CASH_ON_DELIVERY'}
                        onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                        className="accent-[#0F4C3A]"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Kuryeye veya esnafa elden teslimatta nakit ödeme.
                    </p>
                  </label>

                  {/* b) Kapıda Kredi Kartı / Esnaf POS'u */}
                  <label
                    onClick={() => setPaymentMethod('DOOR_CARD_POS')}
                    className={`p-3 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between space-y-1.5 ${
                      paymentMethod === 'DOOR_CARD_POS'
                        ? 'border-[#0F4C3A] bg-[#0F4C3A]/5 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-900 text-xs">💳 Kapıda Esnaf POS</span>
                      <input
                        type="radio"
                        name="payMethod"
                        checked={paymentMethod === 'DOOR_CARD_POS'}
                        onChange={() => setPaymentMethod('DOOR_CARD_POS')}
                        className="accent-[#0F4C3A]"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Esnafın kendi mobil POS cihazından kartla çekim.
                    </p>
                  </label>

                  {/* c) IBAN / Havale */}
                  <label
                    onClick={() => setPaymentMethod('DIRECT_IBAN_TRANSFER')}
                    className={`p-3 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between space-y-1.5 ${
                      paymentMethod === 'DIRECT_IBAN_TRANSFER'
                        ? 'border-[#0F4C3A] bg-[#0F4C3A]/5 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-900 text-xs">🏦 Doğrudan IBAN / FAST</span>
                      <input
                        type="radio"
                        name="payMethod"
                        checked={paymentMethod === 'DIRECT_IBAN_TRANSFER'}
                        onChange={() => setPaymentMethod('DIRECT_IBAN_TRANSFER')}
                        className="accent-[#0F4C3A]"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Doğrudan esnafın banka hesabına FAST ile transfer.
                    </p>
                  </label>
                </div>
              </div>

              {/* 4. MÜŞTERİ ADRES & NOT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-xs">Ad Soyad & Telefon</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ad Soyad"
                      className="w-1/2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Telefon"
                      className="w-1/2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-xs">Mahalle Teslimat Adresi</label>
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Sokak, Apartman No, Daire..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>
            </>
          )}

        </div>

        {/* ALT AKSİYON BARI (FOOTER) */}
        {!placedOrder && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Toplam Tutar:</span>
                <span className="text-xl font-black text-[#0F4C3A] font-mono">
                  ₺{grandTotal.toLocaleString('tr-TR')}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block">
                {uniqueStores.length} Dükkan · ₺35 Ortak Kurye Dahil · %0 Komisyon
              </span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 sm:w-auto px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-2xl transition cursor-pointer"
              >
                Kapat
              </button>

              <button
                type="button"
                disabled={cartItems.length === 0}
                onClick={handlePlaceDirectOrder}
                className="w-2/3 sm:w-auto px-6 py-3.5 bg-[#F59E0B] hover:bg-[#D97706] text-[#0B132B] font-black text-xs rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Doğrudan Mahalle Siparişini Ver (₺{grandTotal})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
