/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, ShoppingCart, ArrowDownLeft, FileText, Truck,
  Users, Building2, Package, Wallet, BarChart3, Calculator,
  Store, Settings, Search, Calendar, Bot, Bell,
  TrendingUp, TrendingDown, ArrowUpRight, DollarSign, Euro,
  ChevronDown, PlusCircle, CheckCircle2, ShieldCheck, Download,
  Layers, ArrowLeft, ExternalLink, Sparkles, MessageCircle,
  Printer, Eye, AlertCircle, RefreshCw, Check, Edit2, Trash2, X, Plus, Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  Invoice, LedgerAccount, LedgerTransaction, Product,
  initialInvoices, initialLedgerAccounts, initialLedgerTransactions, initialProducts 
} from '../data/mockData';
import {
  HybridOrder, WalletAccount, CashflowTransaction, MerchantSubscription,
  initialHybridOrders, initialWalletAccounts, initialCashflowTransactions, initialMerchantSubscription,
  playOrderAlertChime
} from '../data/hybridCommerceData';
import CargoOrdersModule from './merchant/CargoOrdersModule';
import LocalOrdersModule from './merchant/LocalOrdersModule';
import ServiceOrdersModule from './merchant/ServiceOrdersModule';
import CashflowModule from './merchant/CashflowModule';
import SubscriptionTierModal from './merchant/SubscriptionTierModal';
import AdvancedProductModal from './merchant/AdvancedProductModal';
import AdvancedLedgerAccountModal from './merchant/AdvancedLedgerAccountModal';
import StoreSettingsModule from './merchant/StoreSettingsModule';
import TamTeklifOpportunitiesModule from './merchant/TamTeklifOpportunitiesModule';
import { getStoredQuotationRequests } from '../data/quotationRequestData';

interface TampazarSellerDashboardProps {
  onNavigate?: (tab: string, subParam?: any) => void;
  activeStoreName?: string;
}

export type DashboardTab = 
  | 'dashboard' 
  | 'efatura' 
  | 'cariler' 
  | 'kasa' 
  | 'stok' 
  | 'orders_cargo' 
  | 'orders_local' 
  | 'orders_service' 
  | 'tamteklif'
  | 'pos' 
  | 'subscription'
  | 'settings';

export default function TampazarSellerDashboard({
  onNavigate,
  activeStoreName
}: TampazarSellerDashboardProps) {
  const { user, isAuthenticated, loginAsSeller, openAuthModal, logout } = useAuth();

  // Tab State
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');
  const [activePeriod, setActivePeriod] = useState<'BU_AY' | 'SON_30' | 'GECEN_AY' | 'BU_YIL'>('BU_AY');
  const [currentStore, setCurrentStore] = useState<string>(user?.storeName || activeStoreName || 'FotoSentez Stüdyo');
  const [quickSearchTerm, setQuickSearchTerm] = useState('');
  const [quotationRequestsCount, setQuotationRequestsCount] = useState(() => getStoredQuotationRequests().length);

  // 1. Invoices & e-Fatura State
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem('tampazar_invoices');
      return saved ? JSON.parse(saved) : initialInvoices;
    } catch {
      return initialInvoices;
    }
  });

  // 2. Ledger Accounts (Cariler) State
  const [accounts, setAccounts] = useState<LedgerAccount[]>(() => {
    try {
      const saved = localStorage.getItem('tampazar_ledger_accounts');
      return saved ? JSON.parse(saved) : initialLedgerAccounts;
    } catch {
      return initialLedgerAccounts;
    }
  });

  // 3. Products / Stock State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('tampazar_products');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  // 4. Hybrid Orders (Cargo, Local Express, Field Service)
  const [hybridOrders, setHybridOrders] = useState<HybridOrder[]>(() => {
    try {
      const saved = localStorage.getItem('tampazar_hybrid_orders');
      return saved ? JSON.parse(saved) : initialHybridOrders;
    } catch {
      return initialHybridOrders;
    }
  });

  // 5. Multi-Wallet & Cashflow Accounts
  const [walletAccounts, setWalletAccounts] = useState<WalletAccount[]>(() => {
    try {
      const saved = localStorage.getItem('tampazar_wallet_accounts');
      return saved ? JSON.parse(saved) : initialWalletAccounts;
    } catch {
      return initialWalletAccounts;
    }
  });

  // 6. Cashflow Transactions (Gelir/Gider)
  const [cashflowTransactions, setCashflowTransactions] = useState<CashflowTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('tampazar_cashflow_txs');
      return saved ? JSON.parse(saved) : initialCashflowTransactions;
    } catch {
      return initialCashflowTransactions;
    }
  });

  // 7. Merchant Subscription Tier
  const [merchantSubscription, setMerchantSubscription] = useState<MerchantSubscription>(() => {
    try {
      const saved = localStorage.getItem('tampazar_subscription');
      return saved ? JSON.parse(saved) : initialMerchantSubscription;
    } catch {
      return initialMerchantSubscription;
    }
  });

  // POS Transactions (Direct PayTR / iyzico stream)
  const [posTransactions] = useState([
    {
      id: 'tx-901',
      date: '23 Eylül 2026 14:45',
      customer: 'Kemal Sunal (Bireysel)',
      orderId: 'TPZ-2026-9921',
      provider: 'PayTR Sanal POS',
      grossAmount: 1850.00,
      tampazarFee: 0.00, // %0 Komisyon
      bankCommission: 33.30, // %1.8 Banka Komisyonu
      netPayout: 1816.70,
      payoutDate: 'Yarın (24 Eylül)',
      status: 'Hesaba Aktarım Bekliyor',
      cardMask: '**** 4028'
    },
    {
      id: 'tx-902',
      date: '23 Eylül 2026 11:20',
      customer: 'Karadeniz Toptan Ltd.',
      orderId: 'TPZ-2026-9918',
      provider: 'iyzico Doğrudan POS',
      grossAmount: 4500.00,
      tampazarFee: 0.00,
      bankCommission: 72.00,
      netPayout: 4428.00,
      payoutDate: 'Yarın (24 Eylül)',
      status: 'Tamamlandı',
      cardMask: '**** 9122'
    },
    {
      id: 'tx-903',
      date: '22 Eylül 2026 17:05',
      customer: 'Ayşe Kaya',
      orderId: 'TPZ-2026-9890',
      provider: 'Sipay Gateway',
      grossAmount: 600.00,
      tampazarFee: 0.00,
      bankCommission: 10.80,
      netPayout: 589.20,
      payoutDate: 'Aktarıldı (Hesapta)',
      status: 'Tamamlandı',
      cardMask: '**** 5510'
    }
  ]);

  // Modal States
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddLedgerAccountModal, setShowAddLedgerAccountModal] = useState(false);
  const [selectedInvoiceForPreview, setSelectedInvoiceForPreview] = useState<Invoice | null>(null);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // New Invoice Form
  const [newInvCustomer, setNewInvCustomer] = useState('');
  const [newInvTaxId, setNewInvTaxId] = useState('');
  const [newInvTaxOffice, setNewInvTaxOffice] = useState('Altınordu VD');
  const [newInvAmount, setNewInvAmount] = useState<number>(1000);
  const [newInvVatRate, setNewInvVatRate] = useState<number>(20);
  const [newInvTevkifat, setNewInvTevkifat] = useState<'None' | '2/10' | '5/10' | '9/10'>('None');

  // New Product Form
  const [newProdTitle, setNewProdTitle] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Perakende');
  const [newProdPrice, setNewProdPrice] = useState<number>(500);
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdVat, setNewProdVat] = useState<number>(20);

  // Sync state with storage
  useEffect(() => {
    try {
      localStorage.setItem('tampazar_invoices', JSON.stringify(invoices));
    } catch (e) {}
  }, [invoices]);

  useEffect(() => {
    try {
      localStorage.setItem('tampazar_products', JSON.stringify(products));
    } catch (e) {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('tampazar_hybrid_orders', JSON.stringify(hybridOrders));
    } catch (e) {}
  }, [hybridOrders]);

  useEffect(() => {
    try {
      localStorage.setItem('tampazar_wallet_accounts', JSON.stringify(walletAccounts));
    } catch (e) {}
  }, [walletAccounts]);

  useEffect(() => {
    try {
      localStorage.setItem('tampazar_cashflow_txs', JSON.stringify(cashflowTransactions));
    } catch (e) {}
  }, [cashflowTransactions]);

  useEffect(() => {
    try {
      localStorage.setItem('tampazar_subscription', JSON.stringify(merchantSubscription));
    } catch (e) {}
  }, [merchantSubscription]);

  // Actions
  const handleUpdateOrderStatus = (orderId: string, newStatus: HybridOrder['status'], trackingNo?: string) => {
    setHybridOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updated = { ...order, status: newStatus };
        if (trackingNo && updated.cargoDetails) {
          updated.cargoDetails = { 
            ...updated.cargoDetails, 
            trackingNumber: trackingNo, 
            shippedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) 
          };
        }
        return updated;
      }
      return order;
    }));
  };

  const handleAddCashflowTx = (tx: Omit<CashflowTransaction, 'id'>) => {
    const newTx: CashflowTransaction = {
      ...tx,
      id: 'cf-' + Date.now()
    };
    setCashflowTransactions(prev => [newTx, ...prev]);
    setWalletAccounts(prev => prev.map(acc => {
      if (acc.id === tx.accountId) {
        const delta = tx.type === 'income' ? tx.amount : -tx.amount;
        return { ...acc, balance: acc.balance + delta };
      }
      return acc;
    }));
  };

  const handleUpdateTier = (newTierId: 'starter' | 'pro' | 'enterprise') => {
    setMerchantSubscription(prev => ({
      ...prev,
      currentTierId: newTierId,
      invoicesLimit: newTierId === 'starter' ? 50 : -1
    }));
  };

  // ROUTE GUARD: If not authenticated or buyer, show merchant login gateway
  if (!isAuthenticated || user?.role !== 'seller') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-3xl bg-amber-400/20 text-amber-600 flex items-center justify-center mx-auto border border-amber-300">
            <Store className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
              tampazar.com Esnaf & SaaS Yönetim Merkezi
            </span>
            <h2 className="text-2xl font-black text-slate-900">Satıcı / Esnaf Girişi Gerekli</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ön muhasebe, GİB e-Fatura kesme, müşteri cari defteri ve Sanal POS hareketlerinizi yönetmek için mağaza yöneticisi olarak giriş yapmalısınız.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left text-xs space-y-1.5 text-slate-600">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>%0 Komisyon (Doğrudan Kendi Sanal POS'unuz)</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>GİB UBL-TR 2.1 e-Fatura & e-Arşiv Motoru</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Cari Hesap Defteri & WhatsApp ile Ekstre Gönderimi</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => {
                loginAsSeller('serkan@fotosentez.com', 'FotoSentez Stüdyo');
              }}
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-2xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Tek Tıkla Demo Esnaf Olarak Yönetime Geç</span>
            </button>

            <button
              onClick={() => openAuthModal('seller')}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl transition cursor-pointer"
            >
              Kendi Mağazanla Giriş Yap / Mağaza Aç
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Financial Calculations
  const calculateTotalTurnover = () => invoices.reduce((sum, inv) => sum + inv.totalPayable, 0);
  const totalReceivable = accounts.filter(a => a.type === 'buyer').reduce((sum, a) => sum + Math.max(0, a.balance), 0);
  const totalPayable = accounts.filter(a => a.type === 'supplier').reduce((sum, a) => sum + Math.abs(Math.min(0, a.balance)), 0);

  // Issue New Invoice Action
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const subtotal = Number(newInvAmount);
    const vat = parseFloat(((subtotal * newInvVatRate) / 100).toFixed(2));
    
    // Withholding calculation
    let withholdingAmt = 0;
    if (newInvTevkifat !== 'None') {
      const [num, den] = newInvTevkifat.split('/').map(Number);
      withholdingAmt = parseFloat(((vat * num) / den).toFixed(2));
    }

    const total = parseFloat((subtotal + vat - withholdingAmt).toFixed(2));

    const newInv: Invoice = {
      id: 'inv-' + Date.now(),
      invoiceNumber: 'GIB2026000000' + Math.floor(100 + Math.random() * 899),
      orderId: 'TPZ-' + Math.floor(1000 + Math.random() * 9000),
      tenantId: user?.storeId || 's3',
      customerName: newInvCustomer || 'Örnek Müşteri Ltd.',
      customerTaxOffice: newInvTaxOffice,
      customerTaxId: newInvTaxId || '1234567890',
      customerEmail: 'muhasebe@firma.com',
      date: new Date().toISOString().split('T')[0],
      amount: subtotal,
      vatAmount: vat,
      withholdingTaxType: newInvTevkifat,
      withholdingAmount: withholdingAmt,
      totalPayable: total,
      status: 'issued',
      integrator: 'gib'
    };

    setInvoices([newInv, ...invoices]);
    setShowCreateInvoiceModal(false);
    setSelectedInvoiceForPreview(newInv);
    
    // Dispatch events
    window.dispatchEvent(new Event('tampazar_accounting_updated'));
    window.dispatchEvent(new Event('tampazar_invoice_added'));
  };

  // Add Product Action
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProd: Product = {
      id: 'prod-' + Date.now(),
      tenantId: user?.storeId || 's3',
      storeName: currentStore,
      type: 'retail',
      title: newProdTitle,
      slug: newProdTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: newProdCategory,
      categorySlug: newProdCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: 'Yüksek kaliteli yerel esnaf ürünü.',
      price: Number(newProdPrice),
      sku: newProdSku || 'SKU-' + Math.floor(1000 + Math.random() * 9000),
      vatRate: newInvVatRate,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
      rating: 5.0,
      salesCount: 0
    };

    setProducts([newProd, ...products]);
    setShowAddProductModal(false);
    setNewProdTitle('');
  };

  const handleUpdatePrice = (prodId: string, delta: number) => {
    setProducts(products.map(p => {
      if (p.id === prodId) {
        return { ...p, price: Math.max(10, p.price + delta) };
      }
      return p;
    }));
  };

  const handleSaveAdvancedProduct = (newProduct: Product) => {
    setProducts(prev => {
      const updated = [newProduct, ...prev];
      try {
        localStorage.setItem('tampazar_products', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setToastNotification(`"${newProduct.title}" ürünü başarıyla eklendi ve vitrinde yayına alındı!`);
    setTimeout(() => setToastNotification(null), 3500);
  };

  const handleSaveAdvancedLedgerAccount = (newAccount: LedgerAccount) => {
    setAccounts(prev => {
      const updated = [newAccount, ...prev];
      try {
        localStorage.setItem('tampazar_ledger_accounts', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setToastNotification(`"${newAccount.name}" cari kartı başarıyla tanımlandı!`);
    setTimeout(() => setToastNotification(null), 3500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row font-sans">
      
      {/* 1. SOL KURUMSAL MENÜ (SaaS Sidebar) */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen select-none border-r border-slate-800">
        
        {/* Logo Alanı */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center font-black text-slate-950 text-sm shadow-sm">
              T
            </div>
            <div>
              <span className="font-black text-base tracking-tight text-white">
                tam<span className="text-amber-400">pazar</span>
              </span>
              <span className="text-[9px] font-bold text-slate-400 block -mt-1 uppercase tracking-wider">
                Ön Muhasebe & SaaS
              </span>
            </div>
          </div>
        </div>

        {/* Mağaza Seçici */}
        <div className="p-4 border-b border-slate-800/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Aktif İşletme / Şube:
          </span>
          <div className="bg-slate-800 rounded-xl p-2 flex items-center justify-between text-xs font-bold text-white">
            <span className="truncate">{currentStore}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Aktif" />
          </div>
        </div>

        {/* Menü Hiyerarşisi */}
        <nav className="flex-1 px-3 py-4 space-y-1 text-xs font-semibold overflow-y-auto">
          
          <div className="pb-1 px-3 text-[9px] font-black text-slate-400 uppercase tracking-wider">
            Ön Muhasebe & Finans (ERP)
          </div>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition text-left cursor-pointer ${
              activeTab === 'dashboard' 
                ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Genel Bakış (Dashboard)
          </button>

          <button
            onClick={() => setActiveTab('kasa')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition text-left cursor-pointer ${
              activeTab === 'kasa' 
                ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Wallet className="w-4 h-4 text-emerald-400" /> Kasa & Nakit Akışı
          </button>

          <button
            onClick={() => setActiveTab('efatura')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition text-left cursor-pointer ${
              activeTab === 'efatura' 
                ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Calculator className="w-4 h-4" /> GİB e-Fatura & e-Arşiv
          </button>

          <button
            onClick={() => setActiveTab('cariler')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition text-left cursor-pointer ${
              activeTab === 'cariler' 
                ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-4 h-4" /> Cari Hesap & Defter
          </button>

          <button
            onClick={() => setActiveTab('stok')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition text-left cursor-pointer ${
              activeTab === 'stok' 
                ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Package className="w-4 h-4" /> Stok, Depo & Varyant
          </button>

          <button
            onClick={() => setActiveTab('pos')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition text-left cursor-pointer ${
              activeTab === 'pos' 
                ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <DollarSign className="w-4 h-4 text-amber-400" /> POS & Doğrudan Tahsilat
          </button>

          {/* ÜÇLÜ HİBRİT TİCARET & SİPARİŞLER */}
          <div className="pt-4 pb-1 px-3 text-[9px] font-black text-amber-400 uppercase tracking-wider flex items-center justify-between">
            <span>Hibrit Sipariş Dağıtımı</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <button
            onClick={() => setActiveTab('orders_cargo')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition text-left cursor-pointer ${
              activeTab === 'orders_cargo' 
                ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-indigo-400" />
              <span>TamKargo (Ulusal Gönderi)</span>
            </div>
            <span className="text-[10px] bg-indigo-950/80 text-indigo-300 font-bold px-1.5 py-0.5 rounded">
              {hybridOrders.filter(o => o.deliveryType === 'CARGO').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders_local')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition text-left cursor-pointer ${
              activeTab === 'orders_local' 
                ? 'bg-amber-500 text-slate-950 font-black shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>TamHızlı (Ekspres Sipariş & Zil)</span>
            </div>
            <span className="text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.5 rounded">
              {hybridOrders.filter(o => o.deliveryType === 'LOCAL_EXPRESS').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders_service')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition text-left cursor-pointer ${
              activeTab === 'orders_service' 
                ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>TamUsta (Yerinde Servis & Randevu)</span>
            </div>
            <span className="text-[10px] bg-amber-950/80 text-amber-300 font-bold px-1.5 py-0.5 rounded">
              {hybridOrders.filter(o => o.deliveryType === 'FIELD_SERVICE').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tamteklif')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition text-left cursor-pointer ${
              activeTab === 'tamteklif' 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black shadow-md' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>TamTeklif (İş Fırsatları)</span>
            </div>
            <span className="text-[10px] bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded-full">
              {quotationRequestsCount} Fırsat
            </span>
          </button>

          {/* İŞLETME & ABONELİK */}
          <div className="pt-4 pb-1 px-3 text-[9px] font-black text-slate-400 uppercase tracking-wider">
            İşletme & SaaS Modeli
          </div>

          <button
            onClick={() => setActiveTab('subscription')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition text-left cursor-pointer ${
              activeTab === 'subscription' 
                ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Abonelik (%0 Komisyon)</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition text-left cursor-pointer ${
              activeTab === 'settings' 
                ? 'bg-indigo-600 text-white font-bold shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Settings className="w-4 h-4 text-indigo-400" />
            <span>Mağaza & Entegrasyon Ayarları</span>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('store-profile')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-amber-400 hover:bg-slate-800/60 transition text-left cursor-pointer font-bold"
          >
            <Store className="w-4 h-4" /> Açık Vitrinimi Gör ↗
          </button>
        </nav>

        {/* Profil Alanı & Çıkış */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black flex items-center justify-center text-xs shrink-0">
              {user?.name?.slice(0, 2).toUpperCase() || 'ES'}
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-white block truncate">{user?.name}</span>
              <span className="text-[10px] text-amber-400 block truncate font-semibold">{user?.taxId || 'Vergi No: Aktif'}</span>
            </div>
          </div>
          <button 
            onClick={logout}
            className="text-[11px] text-slate-400 hover:text-rose-400 font-bold px-2 py-1 rounded transition cursor-pointer"
            title="Güvenli Çıkış Yap"
          >
            Çıkış
          </button>
        </div>
      </aside>

      {/* 2. ÇALIŞMA ALANI & HEADER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Üst Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-black text-slate-900">
              {activeTab === 'dashboard' && 'Finansal Genel Bakış (Dashboard)'}
              {activeTab === 'kasa' && 'Finans & Kasa Yönetimi (Multi-Wallet / Cashflow)'}
              {activeTab === 'efatura' && 'GİB e-Fatura & e-Arşiv Fatura Portali'}
              {activeTab === 'cariler' && 'Cari Hesap & Müşteri Borç/Alacak Defteri'}
              {activeTab === 'stok' && 'Gelişmiş Stok, Depo & Varyant Yönetimi'}
              {activeTab === 'orders_cargo' && 'TamKargo: Ulusal Kargo & Sevk İrsaliyesi Yönetimi'}
              {activeTab === 'orders_local' && 'TamHızlı: Anlık Mahalle Siparişleri & Canlı Sipariş Zili (30 Dk)'}
              {activeTab === 'orders_service' && 'TamUsta: Saha Hizmetleri, Acil Çağrı & Usta Takvimi'}
              {activeTab === 'pos' && 'Sanal POS & Doğrudan Tahsilat Akışı'}
              {activeTab === 'subscription' && 'Esnaf Abonelik & Ticari Model Mimarisi (%0 Komisyon)'}
              {activeTab === 'settings' && 'Mağaza Profili, Kurumsal Kimlik & Kendi Sanal POS (BYO POS) Ayarları'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowCreateInvoiceModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-3.5 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
              <span>+ Fatura Düzenle</span>
            </button>

            <button 
              onClick={() => onNavigate && onNavigate('home')}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Alışveriş Vitrini
            </button>
          </div>
        </header>

        {/* TOAST BİLDİRİMİ */}
        {toastNotification && (
          <div className="mx-6 mt-4 p-3.5 bg-emerald-600 text-white rounded-2xl shadow-lg flex items-center justify-between animate-fade-in text-xs font-bold">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
              <span>{toastNotification}</span>
            </div>
            <button 
              onClick={() => setToastNotification(null)}
              className="text-white/80 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ANA İÇERİK BÖLÜMÜ */}
        <main className="p-6 space-y-6 max-w-[1600px] w-full mx-auto">
          
          {/* TAB 1: DASHBOARD (FİNANSAL ÖZET) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Canlı Kasa ve Finans Özet Kartı */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
                      GÜNCEL İŞLETME KASASI
                    </span>
                    <h2 className="text-2xl font-black text-white mt-1">
                      {calculateTotalTurnover().toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Toplam ciro (Kendi Sanal POS'unuza gecikmesiz yansıyan net tutar)
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-3 py-1.5 rounded-xl border border-emerald-500/30 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> %0 TamPazar Komisyonu
                    </span>
                  </div>
                </div>

                {/* Kasa Durumu Detayları (Nakit, POS, Havale) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700">
                    <span className="text-[11px] text-slate-400 font-bold block uppercase">💳 SANAL POS / BANKA KASASI</span>
                    <div className="text-xl font-black text-emerald-400 font-mono mt-1">
                      {(calculateTotalTurnover() * 0.78).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                    </div>
                    <span className="text-[10px] text-slate-400 mt-2 block">PayTR / iyzico Doğrudan Tahsilat</span>
                  </div>

                  <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700">
                    <span className="text-[11px] text-slate-400 font-bold block uppercase">💵 NAKİT KASA (ELDEN / GEL-AL)</span>
                    <div className="text-xl font-black text-amber-400 font-mono mt-1">
                      {(calculateTotalTurnover() * 0.14).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                    </div>
                    <span className="text-[10px] text-slate-400 mt-2 block">Dükkân içi elden tahsilat</span>
                  </div>

                  <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700">
                    <span className="text-[11px] text-slate-400 font-bold block uppercase">🏦 HAVALE / EFT HESABI</span>
                    <div className="text-xl font-black text-sky-400 font-mono mt-1">
                      {(calculateTotalTurnover() * 0.08).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                    </div>
                    <span className="text-[10px] text-slate-400 mt-2 block">IBAN üzerinden doğrudan cari aktarımı</span>
                  </div>
                </div>

                {/* Alacaklar ve Borçlar Çubuğu */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 font-bold block">Vadesi Gelen Müşteri Alacakları:</span>
                      <span className="text-lg font-black text-white font-mono mt-0.5 block">
                        {totalReceivable.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveTab('cariler')}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Alacak Defteri →
                    </button>
                  </div>

                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 font-bold block">Ödenecek Tedarikçi Borçları:</span>
                      <span className="text-lg font-black text-rose-400 font-mono mt-0.5 block">
                        {totalPayable.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveTab('cariler')}
                      className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Tedarikçileri Gör →
                    </button>
                  </div>
                </div>

              </div>

              {/* ÜÇLÜ HİBRİT TİCARET & SİPARİŞ KANALLARI ÖZETİ */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <span>Üçlü Hibrit Ticaret Dağıtım Kanalları</span>
                    <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
                      Canlı Akış
                    </span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('subscription')}
                    className="text-xs font-bold text-indigo-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Paket: {merchantSubscription.currentTierId.toUpperCase()} (%0 Komisyon)</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 1. Ulusal Kargo */}
                  <div 
                    onClick={() => setActiveTab('orders_cargo')}
                    className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:border-indigo-400 transition cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition">
                        <Truck className="w-5 h-5" />
                      </span>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                        TamKargo
                      </span>
                    </div>
                    <div className="text-xl font-black text-slate-900">
                      {hybridOrders.filter(o => o.deliveryType === 'CARGO').length} Sipariş
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Tüm Türkiye kargo barkodları, Yurtiçi/Aras/MNG sevk irsaliyesi ve takip yönetimi.
                    </p>
                  </div>

                  {/* 2. Anlık Yerel Sipariş */}
                  <div 
                    onClick={() => setActiveTab('orders_local')}
                    className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:border-amber-400 transition cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="p-2 rounded-xl bg-amber-50 text-amber-700 group-hover:bg-amber-500 group-hover:text-slate-950 transition">
                        <Bell className="w-5 h-5" />
                      </span>
                      <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" /> TamHızlı (Zil)
                      </span>
                    </div>
                    <div className="text-xl font-black text-slate-900">
                      {hybridOrders.filter(o => o.deliveryType === 'LOCAL_EXPRESS').length} Anlık Sipariş
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      30-45 Dk mahalle kuryesi ve gel-al siparişleri; sesli masaüstü zili ve kurye takibi.
                    </p>
                  </div>

                  {/* 3. Saha Servis Talebi */}
                  <div 
                    onClick={() => setActiveTab('orders_service')}
                    className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:border-emerald-400 transition cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition">
                        <Building2 className="w-5 h-5" />
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                        TamUsta
                      </span>
                    </div>
                    <div className="text-xl font-black text-slate-900">
                      {hybridOrders.filter(o => o.deliveryType === 'FIELD_SERVICE').length} Servis Çağrısı
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Tesisat, çekici, çilingir randevuları; haritada müşterinin konumu ve Google Maps rotası.
                    </p>
                  </div>
                </div>
              </div>

              {/* Hızlı Eylemler & Son Faturalar */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Sol: Son Kesilen GİB Faturaları */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <h3 className="font-black text-sm text-slate-900">Son Kesilen e-Fatura & e-Arşivler</h3>
                    </div>
                    <button 
                      onClick={() => setActiveTab('efatura')} 
                      className="text-xs font-bold text-indigo-700 hover:underline cursor-pointer"
                    >
                      Tümünü Gör ({invoices.length}) →
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {invoices.slice(0, 4).map((inv) => (
                      <div key={inv.id} className="py-3 flex items-center justify-between gap-4">
                        <div>
                          <span className="font-mono text-xs font-bold text-indigo-900 block">{inv.invoiceNumber}</span>
                          <span className="text-xs text-slate-700 font-medium">{inv.customerName}</span>
                          <span className="text-[11px] text-slate-400 block">{inv.date}</span>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-black text-slate-900 font-mono block">
                            {inv.totalPayable.toLocaleString('tr-TR')} ₺
                          </span>
                          <button
                            onClick={() => setSelectedInvoiceForPreview(inv)}
                            className="text-[11px] text-indigo-600 hover:underline font-bold flex items-center gap-1 justify-end mt-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" /> UBL-TR Önizle
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sağ: Kritik Stok & Sistem Durumu */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      Kritik Stok & Uyarılar
                    </h3>
                    
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs space-y-2">
                      <span className="font-bold text-amber-900 block">Kritik Stok Seviyesi</span>
                      <p className="text-amber-800 leading-tight">
                        Deponuzda 2 ürünün stok adedi 5'in altına düştü.
                      </p>
                      <button
                        onClick={() => setActiveTab('stok')}
                        className="text-amber-900 font-black underline text-xs cursor-pointer block pt-1"
                      >
                        Stokları Güncelle →
                      </button>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-1">
                      <span className="font-bold text-slate-800 block">GİB Entegratör Durumu</span>
                      <span className="text-emerald-700 font-bold block">● UBL-TR 2.1 Doğrudan Bağlı</span>
                      <span className="text-slate-400 text-[11px] block">Kalan Kontör: 8.420 Adet</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowCreateInvoiceModal(true)}
                    className="w-full py-3 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Yeni Fatura Düzenle
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: GİB E-FATURA & E-ARŞİV MODÜLÜ */}
          {activeTab === 'efatura' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-indigo-600" />
                    GİB e-Fatura & e-Arşiv Yönetim Portali
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Resmi Gelir İdaresi Başkanlığı UBL-TR 2.1 şemasına uygun faturalarınız ve XML dökümleri.
                  </p>
                </div>

                <button
                  onClick={() => setShowCreateInvoiceModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <PlusCircle className="w-4 h-4 text-amber-300" />
                  <span>Tek Tıkla Yeni Fatura Kes</span>
                </button>
              </div>

              {/* Fatura Listesi Tablosu */}
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4 font-bold">Fatura No</th>
                        <th className="py-3.5 px-4 font-bold">Müşteri / Cari</th>
                        <th className="py-3.5 px-4 font-bold">Tarih</th>
                        <th className="py-3.5 px-4 font-bold">Matrah</th>
                        <th className="py-3.5 px-4 font-bold">KDV</th>
                        <th className="py-3.5 px-4 font-bold">Tevkifat</th>
                        <th className="py-3.5 px-4 font-bold">Toplam</th>
                        <th className="py-3.5 px-4 font-bold">Durum</th>
                        <th className="py-3.5 px-4 font-bold text-right">Eylem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-indigo-900">{inv.invoiceNumber}</td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-900 block">{inv.customerName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">VKN: {inv.customerTaxId}</span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500">{inv.date}</td>
                          <td className="py-3.5 px-4 font-mono">{inv.amount.toLocaleString('tr-TR')} ₺</td>
                          <td className="py-3.5 px-4 font-mono text-slate-600">+{inv.vatAmount.toLocaleString('tr-TR')} ₺</td>
                          <td className="py-3.5 px-4">
                            {inv.withholdingAmount > 0 ? (
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                {inv.withholdingTaxType} (-{inv.withholdingAmount} ₺)
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-black font-mono text-slate-900 text-sm">
                            {inv.totalPayable.toLocaleString('tr-TR')} ₺
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                              ✓ GİB Onaylı
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedInvoiceForPreview(inv)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition cursor-pointer inline-flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" /> UBL-TR Önizle
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

          {/* TAB 3: CARİ HESAP & MÜŞTERİ DEFTERİ */}
          {activeTab === 'cariler' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    Cari Hesap & Müşteri / Tedarikçi Defteri
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Müşteri borçları, tedarikçi bakiyeleri ve WhatsApp ile tek tıkla hesap ekstresi gönderimi.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1.5 rounded-xl border border-emerald-200">
                    Toplam Alacak: {totalReceivable.toLocaleString('tr-TR')} ₺
                  </span>
                  <button
                    onClick={() => setShowAddLedgerAccountModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Yeni Cari Kart Tanımla</span>
                  </button>
                </div>
              </div>

              {/* Cari Kartları */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {accounts.map((acc) => {
                  const isReceivable = acc.balance > 0;
                  const waMessage = encodeURIComponent(
                    `Sayın ${acc.name}, ${currentStore} nezdindeki güncel cari bakiye durumunuz: ${Math.abs(acc.balance).toLocaleString('tr-TR')} TL ${isReceivable ? 'Borç' : 'Alacak'}. Bilgilerinize sunar, hayırlı işler dileriz.`
                  );

                  return (
                    <div key={acc.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                            acc.type === 'buyer' 
                              ? 'bg-indigo-50 text-indigo-700' 
                              : acc.type === 'supplier'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {acc.type === 'buyer' ? 'Müşteri (Alıcı)' : acc.type === 'supplier' ? 'Tedarikçi (Toptancı)' : 'Hem Müşteri / Tedarikçi'}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{acc.code}</span>
                        </div>

                        <h4 className="font-black text-slate-900 text-sm leading-snug">{acc.name}</h4>
                        <p className="text-[11px] text-slate-400 font-mono">VKN/TC: {acc.taxId} • {acc.email}</p>
                        
                        {(acc.city || acc.dueDays !== undefined) && (
                          <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px]">
                            {acc.city && (
                              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                                📍 {acc.city} {acc.district ? `/ ${acc.district}` : ''}
                              </span>
                            )}
                            {acc.dueDays !== undefined && (
                              <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">
                                ⏱ {acc.dueDays} Gün Vade
                              </span>
                            )}
                            {acc.discountRate !== undefined && acc.discountRate > 0 && (
                              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">
                                %{acc.discountRate} İskonto
                              </span>
                            )}
                          </div>
                        )}

                        <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                          <span className="text-xs text-slate-500 font-medium">Bakiye Durumu:</span>
                          <span className={`text-base font-black font-mono ${
                            isReceivable ? 'text-indigo-900' : 'text-rose-600'
                          }`}>
                            {Math.abs(acc.balance).toLocaleString('tr-TR')} ₺
                            <span className="text-[10px] font-sans font-bold ml-1 text-slate-500">
                              {isReceivable ? '(Alacağımız)' : '(Borcumuz)'}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* WhatsApp Ekstre Butonu */}
                      <div className="pt-2">
                        <a
                          href={`https://wa.me/?text=${waMessage}`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>WhatsApp ile Ekstre Gönder</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: STOK, HİZMET & VARYANT YÖNETİMİ */}
          {activeTab === 'stok' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-indigo-600" />
                    Stok, Hizmet ve Varyant Envanteri
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Hızlı fiyat güncelleme, barkod/SKU takibi ve anlık stok alarmları.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Yeni Ürün / Hizmet Ekle</span>
                </button>
              </div>

              {/* Ürün Tablosu */}
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4 font-bold">Ürün / Hizmet</th>
                        <th className="py-3.5 px-4 font-bold">Kategori & Varyant</th>
                        <th className="py-3.5 px-4 font-bold">SKU / Barkod</th>
                        <th className="py-3.5 px-4 font-bold">KDV</th>
                        <th className="py-3.5 px-4 font-bold">Fiyat & Kâr Marjı</th>
                        <th className="py-3.5 px-4 font-bold">Stok Durumu</th>
                        <th className="py-3.5 px-4 font-bold text-right">Hızlı Fiyat Ayarı</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {products.map((prod) => {
                        const calculatedCost = prod.costPrice || (prod.price * 0.55);
                        const calculatedVat = prod.price * (prod.vatRate / 100);
                        const netEarnings = prod.price - calculatedVat;
                        const netProfit = netEarnings - calculatedCost;
                        const marginPercent = prod.price > 0 ? ((netProfit / prod.price) * 100) : 0;
                        const hasVariants = prod.variantMatrix && prod.variantMatrix.length > 0;
                        const totalStock = prod.stockCount !== undefined ? prod.stockCount : (hasVariants ? prod.variantMatrix!.reduce((acc, v) => acc + v.stock, 0) : 45);
                        const isCritical = totalStock <= (prod.criticalStockThreshold || 5);

                        return (
                          <tr key={prod.id} className="hover:bg-slate-50/80 transition">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <img src={prod.image} alt={prod.title} className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0" />
                                <div>
                                  <span className="font-bold text-slate-900 block line-clamp-1">{prod.title}</span>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    {prod.brand && (
                                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                                        {prod.brand}
                                      </span>
                                    )}
                                    <span className="text-[10px] text-slate-400 font-mono">{prod.type.toUpperCase()}</span>
                                    {prod.deliveryOptions?.type === 'local_express' && (
                                      <span className="text-[9px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded">TamHızlı/30Dk</span>
                                    )}
                                    {prod.deliveryOptions?.type === 'field_service' && (
                                      <span className="text-[9px] bg-emerald-100 text-emerald-900 font-bold px-1.5 py-0.2 rounded">TamUsta/Saha</span>
                                    )}
                                    {prod.deliveryOptions?.type === 'physical_cargo' && (
                                      <span className="text-[9px] bg-indigo-100 text-indigo-900 font-bold px-1.5 py-0.2 rounded">TamKargo</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="text-slate-700 font-medium block">{prod.category}</span>
                              {hasVariants && (
                                <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.2 rounded mt-0.5 inline-block">
                                  {prod.variantMatrix!.length} Varyant Seçeneği
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px]">{prod.sku}</td>
                            <td className="py-3.5 px-4 font-mono font-bold">%{prod.vatRate}</td>
                            <td className="py-3.5 px-4">
                              <span className="font-black font-mono text-slate-900 text-sm block">
                                {prod.price.toLocaleString('tr-TR')} ₺
                              </span>
                              <div className="flex items-center gap-1 text-[10px] font-mono mt-0.5">
                                <span className="text-slate-400">Maliyet: {calculatedCost.toFixed(0)} ₺</span>
                                <span className={`font-bold px-1 rounded ${marginPercent >= 20 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                  %{marginPercent.toFixed(0)} Kâr
                                </span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5">
                                <span className={`font-mono font-bold text-xs ${isCritical ? 'text-rose-600 font-black' : 'text-slate-800'}`}>
                                  {totalStock} Adet
                                </span>
                                {isCritical && (
                                  <span className="text-[9px] bg-rose-100 text-rose-700 font-black px-1.5 py-0.2 rounded animate-pulse">
                                    Kritik!
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => handleUpdatePrice(prod.id, -50)}
                                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs cursor-pointer"
                                  title="50 TL Düşür"
                                >
                                  -50 ₺
                                </button>
                                <button
                                  onClick={() => handleUpdatePrice(prod.id, 50)}
                                  className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-xs cursor-pointer"
                                  title="50 TL Artır"
                                >
                                  +50 ₺
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: POS & DOĞRUDAN TAHSİLAT */}
          {activeTab === 'pos' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-emerald-600" />
                    Doğrudan Sanal POS & Kasa Tahsilat Akışı
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    PayTR, iyzico ve Banka Sanal POS'unuzdan gelen işlemler doğrudan hesap numaranıza aktarılır.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    TamPazar Komisyonu: %0,00
                  </span>
                </div>
              </div>

              {/* POS İşlem Tablosu */}
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4 font-bold">İşlem & Tarih</th>
                        <th className="py-3.5 px-4 font-bold">Müşteri / Sipariş</th>
                        <th className="py-3.5 px-4 font-bold">Sağlayıcı (BYO POS)</th>
                        <th className="py-3.5 px-4 font-bold">Brüt Tutar</th>
                        <th className="py-3.5 px-4 font-bold">TamPazar Ücreti</th>
                        <th className="py-3.5 px-4 font-bold">Net Aktarılacak</th>
                        <th className="py-3.5 px-4 font-bold">Hesaba Geçiş</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {posTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-900 block font-mono">{tx.id}</span>
                            <span className="text-[10px] text-slate-400">{tx.date}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-900 block">{tx.customer}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{tx.orderId} • {tx.cardMask}</span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-indigo-900">{tx.provider}</td>
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                            {tx.grossAmount.toLocaleString('tr-TR')} ₺
                          </td>
                          <td className="py-3.5 px-4 font-mono text-emerald-600 font-black">
                            0,00 ₺ (%0)
                          </td>
                          <td className="py-3.5 px-4 font-mono font-black text-emerald-700 text-sm">
                            {tx.netPayout.toLocaleString('tr-TR')} ₺
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-[10px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                              {tx.payoutDate}
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

          {/* TAB: KASA & NAKİT AKIŞI (MULTI-WALLET & CASHFLOW) */}
          {activeTab === 'kasa' && (
            <div className="animate-fade-in">
              <CashflowModule
                accounts={walletAccounts}
                transactions={cashflowTransactions}
                onAddTransaction={handleAddCashflowTx}
              />
            </div>
          )}

          {/* TAB: ULUSAL KARGO VE E-TİCARET SİPARİŞLERİ (TRENDYOL MODELİ) */}
          {activeTab === 'orders_cargo' && (
            <div className="animate-fade-in">
              <CargoOrdersModule
                orders={hybridOrders}
                onUpdateOrderStatus={handleUpdateOrderStatus}
              />
            </div>
          )}

          {/* TAB: ANLIK YEREL SİPARİŞLER (YEMEKSEPETİ/GETİR - CANLI ZİL) */}
          {activeTab === 'orders_local' && (
            <div className="animate-fade-in">
              <LocalOrdersModule
                orders={hybridOrders}
                onUpdateOrderStatus={handleUpdateOrderStatus}
              />
            </div>
          )}

          {/* TAB: SAHA SERVİS TALEPLERİ (ARMUT - HARİTA ROTA) */}
          {activeTab === 'orders_service' && (
            <div className="animate-fade-in">
              <ServiceOrdersModule
                orders={hybridOrders}
                onUpdateOrderStatus={handleUpdateOrderStatus}
              />
            </div>
          )}

          {/* TAB: TAMTEKLİF (İŞ FIRSATLARI & KAPALI DEVRE TEKLİF TOPLAMA) */}
          {activeTab === 'tamteklif' && (
            <div className="animate-fade-in">
              <TamTeklifOpportunitiesModule
                currentMerchantId={user?.id || 'store-kuzey-teknik'}
                currentStoreName={activeStoreName || user?.storeName || 'Kuzey Teknik Tesisat & Mühendislik'}
              />
            </div>
          )}

          {/* TAB: ESNAF ABONELİK & TİCARİ MODEL (%0 KOMİSYON) */}
          {activeTab === 'subscription' && (
            <div className="animate-fade-in">
              <SubscriptionTierModal
                subscription={merchantSubscription}
                onUpdateTier={handleUpdateTier}
              />
            </div>
          )}

          {/* TAB: MAĞAZA VE KENDİ SANAL POS AYARLARI (BYO POS) */}
          {activeTab === 'settings' && (
            <div className="animate-fade-in">
              <StoreSettingsModule />
            </div>
          )}

        </main>
      </div>

      {/* 3. MODAL: YENİ E-FATURA / E-ARŞİV DÜZENLE */}
      {showCreateInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider block">GİB UBL-TR 2.1</span>
                <h3 className="font-black text-slate-900 text-base">Yeni e-Fatura / e-Arşiv Düzenle</h3>
              </div>
              <button 
                onClick={() => setShowCreateInvoiceModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Müşteri / Firma Adı *</label>
                <input 
                  type="text" 
                  required
                  value={newInvCustomer}
                  onChange={(e) => setNewInvCustomer(e.target.value)}
                  placeholder="Örn: Anadolu Ticaret A.Ş. veya Ahmet Yılmaz" 
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Vergi No / TC *</label>
                  <input 
                    type="text" 
                    required
                    value={newInvTaxId}
                    onChange={(e) => setNewInvTaxId(e.target.value)}
                    placeholder="10 veya 11 Haneli" 
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Vergi Dairesi</label>
                  <input 
                    type="text" 
                    value={newInvTaxOffice}
                    onChange={(e) => setNewInvTaxOffice(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Matrah (KDV Hariç Tutar) ₺ *</label>
                  <input 
                    type="number" 
                    required
                    min={1}
                    value={newInvAmount}
                    onChange={(e) => setNewInvAmount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">KDV Oranı</label>
                  <select
                    value={newInvVatRate}
                    onChange={(e) => setNewInvVatRate(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold cursor-pointer"
                  >
                    <option value={20}>%20 (Standart KDV)</option>
                    <option value={10}>%10 (Yeme-İçme & Hizmet)</option>
                    <option value={1}>%1 (Temel Tarım & Toptan)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">KDV Tevkifatı (İsteğe Bağlı)</label>
                <select
                  value={newInvTevkifat}
                  onChange={(e) => setNewInvTevkifat(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium cursor-pointer"
                >
                  <option value="None">Tevkifat Yok (Normal Fatura)</option>
                  <option value="2/10">2/10 Tevkifat (Özel Güvenlik / Temizlik)</option>
                  <option value="5/10">5/10 Tevkifat (Yapım İşleri / Onarım)</option>
                  <option value="9/10">9/10 Tevkifat (Danışmanlık / Denetim)</option>
                </select>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1 font-mono text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Matrah:</span>
                  <span>{newInvAmount.toLocaleString('tr-TR')} ₺</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Hesaplanan KDV (%{newInvVatRate}):</span>
                  <span>+{(newInvAmount * newInvVatRate / 100).toFixed(2)} ₺</span>
                </div>
                <div className="flex justify-between font-black text-slate-900 text-sm pt-1 border-t border-slate-200">
                  <span>Ödenecek Net Tutar:</span>
                  <span>
                    {(newInvAmount + (newInvAmount * newInvVatRate / 100)).toFixed(2)} ₺
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-900 hover:bg-indigo-800 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>GİB e-Faturayı İmzala & Gönder</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. MODAL: UBL-TR GİB RESMİ FATURA ÖNİZLEMESİ (PDF / YAZDIR) */}
      {selectedInvoiceForPreview && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-slate-300 space-y-6 my-8 animate-fade-in text-slate-800">
            
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-red-700 text-white text-[10px] font-black px-2 py-0.5 rounded">GİB</span>
                  <span className="text-xs font-bold text-slate-500 font-mono">UBL-TR 2.1 E-ARŞİV FATURA</span>
                </div>
                <h3 className="font-mono font-black text-xl text-slate-900">{selectedInvoiceForPreview.invoiceNumber}</h3>
                <p className="text-xs text-slate-400 font-mono">ETTN: c9c4e1d3-70dc-495d-b37d-51eb8d674d5c</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Yazdır
                </button>
                <button
                  onClick={() => alert('GİB e-Arşiv PDF belgesi başarıyla cihazınıza indirildi.')}
                  className="px-3 py-1.5 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> PDF İndir
                </button>
                <button
                  onClick={() => setSelectedInvoiceForPreview(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Fatura Tarafları */}
            <div className="grid grid-cols-2 gap-6 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="font-bold text-slate-400 block uppercase text-[10px]">DÜZENLEYEN (SATICI ESNAF)</span>
                <strong className="text-slate-900 block mt-1">{currentStore}</strong>
                <p className="text-slate-600 font-mono text-[11px] mt-0.5">VKN: {user?.taxId || '3810294821'}</p>
                <p className="text-slate-600">{user?.district || 'Altınordu'} VD - {user?.city || 'Ordu'}</p>
              </div>

              <div>
                <span className="font-bold text-slate-400 block uppercase text-[10px]">ALICI (MÜŞTERİ)</span>
                <strong className="text-slate-900 block mt-1">{selectedInvoiceForPreview.customerName}</strong>
                <p className="text-slate-600 font-mono text-[11px] mt-0.5">VKN/TC: {selectedInvoiceForPreview.customerTaxId}</p>
                <p className="text-slate-600">{selectedInvoiceForPreview.customerTaxOffice}</p>
              </div>
            </div>

            {/* Fatura Kalemleri */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left font-mono">
                <thead className="bg-slate-100 text-slate-500 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Mal / Hizmet</th>
                    <th className="p-3">Miktar</th>
                    <th className="p-3">Birim Fiyat</th>
                    <th className="p-3">KDV</th>
                    <th className="p-3 text-right">Tutar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-bold text-slate-900 font-sans">Kurumsal Sipariş & Hizmet Bedeli</td>
                    <td className="p-3">1 Adet</td>
                    <td className="p-3">{selectedInvoiceForPreview.amount.toLocaleString('tr-TR')} ₺</td>
                    <td className="p-3">%{Math.round((selectedInvoiceForPreview.vatAmount / selectedInvoiceForPreview.amount) * 100) || 20}</td>
                    <td className="p-3 text-right font-black">{selectedInvoiceForPreview.amount.toLocaleString('tr-TR')} ₺</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Fatura Toplamları */}
            <div className="flex justify-end font-mono text-xs">
              <div className="w-64 space-y-1.5 border-t border-slate-200 pt-2">
                <div className="flex justify-between text-slate-600">
                  <span>Mal Hizmet Toplamı:</span>
                  <span>{selectedInvoiceForPreview.amount.toLocaleString('tr-TR')} ₺</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Hesaplanan KDV:</span>
                  <span>+{selectedInvoiceForPreview.vatAmount.toLocaleString('tr-TR')} ₺</span>
                </div>
                {selectedInvoiceForPreview.withholdingAmount > 0 && (
                  <div className="flex justify-between text-amber-700 font-bold">
                    <span>Tevkifat ({selectedInvoiceForPreview.withholdingTaxType}):</span>
                    <span>-{selectedInvoiceForPreview.withholdingAmount.toLocaleString('tr-TR')} ₺</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-300 pt-2">
                  <span>Ödenecek Tutar:</span>
                  <span>{selectedInvoiceForPreview.totalPayable.toLocaleString('tr-TR')} ₺</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 text-emerald-800 text-[11px] p-3 rounded-2xl flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Bu fatura 509 Sıra No'lu VUK Genel Tebliği gereğince elektronik ortamda imzalanmış ve GİB sistemine kaydedilmiştir.</span>
            </div>

          </div>
        </div>
      )}

      {/* 5. MODAL: GELİŞMİŞ TRENDYOL & AMAZON DÜZEYİ ÜRÜN / HİZMET SİHİRBAZI */}
      <AdvancedProductModal
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        onSaveProduct={handleSaveAdvancedProduct}
        tenantId={user?.storeId || 's3'}
        storeName={currentStore}
      />

      {/* 6. MODAL: DETAYLI BİZİMHESAP & PARAŞÜT DÜZEYİ CARİ HESAP KARTI */}
      <AdvancedLedgerAccountModal
        isOpen={showAddLedgerAccountModal}
        onClose={() => setShowAddLedgerAccountModal(false)}
        onSaveAccount={handleSaveAdvancedLedgerAccount}
        tenantId={user?.storeId || 's3'}
      />

    </div>
  );
}
