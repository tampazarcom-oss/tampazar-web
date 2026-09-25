/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, ShoppingBag, ShieldCheck, Zap, 
  Store, Briefcase, ChevronRight, Star, SlidersHorizontal, 
  X, Check, ArrowRight, Layers, Calendar, Clock, MapPin, Sparkles, Filter, Heart, ChevronLeft, Tag, Percent,
  Truck, Bike, Wrench, Utensils, Download, Video, GraduationCap, Building, FileCode, Phone, MessageCircle, ArrowUpRight
} from 'lucide-react';
import { Tenant, Product, initialTenants, initialProducts } from '../data/mockData';
import { HybridOrder, playOrderAlertChime } from '../data/hybridCommerceData';
import { useAuth } from '../context/AuthContext';
import BrandLogo from './BrandLogo';
import GlobalUserNav from './GlobalUserNav';
import TamTeklifWizardModal from './TamTeklifWizardModal';
import MegaMenu from './MegaMenu';
import QuickCategoryBar from './QuickCategoryBar';
import { applyPageSEO } from '../utils/seo';

interface MarketplaceHomeProps {
  onNavigateToStore?: (storeId: string) => void;
  onOpenSellerDashboard?: (tab?: string) => void;
  onNavigateToSuperMall?: () => void;
  onNavigateToProduct?: (slug: string) => void;
}

export default function MarketplaceHome({ onNavigateToStore, onOpenSellerDashboard, onNavigateToSuperMall, onNavigateToProduct }: MarketplaceHomeProps) {
  const navigate = useNavigate();
  const [tenants] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem('tampazar_tenants');
    return saved ? JSON.parse(saved) : initialTenants;
  });

  const [products] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('tampazar_products');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        const missing = initialProducts.filter(ip => !parsed.some(p => p.id === ip.id || p.slug === ip.slug));
        if (missing.length > 0) {
          const merged = [...parsed, ...missing];
          localStorage.setItem('tampazar_products', JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }
    } catch {
      // fallback to initialProducts
    }
    return initialProducts;
  });

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScope, setSelectedScope] = useState<'all' | 'retail' | 'wholesale' | 'service' | 'stores'>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'all' | 'retail' | 'wholesale' | 'service'>('all');
  const [activeStoryFilter, setActiveStoryFilter] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // 5 Hibrit Ticaret Vitrini Tab Filtresi
  const [activeCommerceModelTab, setActiveCommerceModelTab] = useState<'all' | 'cargo' | 'local_food' | 'emergency' | 'venue' | 'digital' | 'session'>('all');

  // Sektörünü Seç Satıcı Kazanım CTA State
  const [selectedSectorCTA, setSelectedSectorCTA] = useState<string>('restaurant');

  // TamTeklif Wizard State
  const [isTamTeklifModalOpen, setIsTamTeklifModalOpen] = useState(false);
  const [tamTeklifCategory, setTamTeklifCategory] = useState<string | undefined>(undefined);

  // Cart State
  const [cart, setCart] = useState<{ product: Product; qty: number; variant?: string; slot?: string }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // Active Product Modal (Detail & Quick Action)
  const { user } = useAuth();
  const [selectedDeliveryType, setSelectedDeliveryType] = useState<'CARGO' | 'LOCAL_EXPRESS' | 'FIELD_SERVICE'>('CARGO');
  const [deliveryAddress, setDeliveryAddress] = useState('Moda Cad. No:44 Kadıköy / İstanbul');
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [modalQty, setModalQty] = useState(1);
  const [modalSize, setModalSize] = useState('');
  const [modalColor, setModalColor] = useState('');
  const [modalSlot, setModalSlot] = useState('');

  // Carousel ref for "Sana Özel Önerilen Ürünler"
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const toggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  // SEO & Schema.org Enjeksiyonu
  useEffect(() => {
    applyPageSEO({
      pathname: '/',
      title: 'TamPazar | Komisyonsuz Hibrit Pazaryeri, Açık Dijital AVM & Ön Muhasebe',
      description: 'Aracı komisyonu yok, doğrudan esnaf fiyatı var! Perakende, toptan B2B, TamDijital dosya indirme, TamSeans canlı randevu ve yerel esnaf tek platformda.'
    });
  }, []);

  // Body scroll lock when cart drawer or product modal is open
  useEffect(() => {
    if (isCartOpen || activeModalProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen, activeModalProduct]);

  // Filter products based on search, scope, type filter, and story filter
  const filteredProducts = products.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.storeName && item.storeName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesScope = 
      selectedScope === 'all' ||
      (selectedScope === 'retail' && item.type === 'retail') ||
      (selectedScope === 'wholesale' && item.type === 'wholesale') ||
      (selectedScope === 'service' && item.type === 'service');

    const matchesTypeFilter = 
      selectedTypeFilter === 'all' ||
      item.type === selectedTypeFilter;

    let matchesStory = true;
    if (activeStoryFilter === 'fiyati-dusenler') {
      matchesStory = item.price < 2000;
    } else if (activeStoryFilter === 'yemek-lezzetler') {
      matchesStory = item.category.includes('Gıda') || item.category.includes('Yemek');
    } else if (activeStoryFilter === 'esnaf-butik') {
      matchesStory = item.type === 'retail' || Boolean(item.badge?.includes('Zanaat'));
    } else if (activeStoryFilter === 'kargo-bedava') {
      matchesStory = Boolean(item.badge?.includes('Kargo')) || item.price > 1000;
    }

    return matchesSearch && matchesScope && matchesTypeFilter && matchesStory;
  });

  const handleOpenProductModal = (product: Product) => {
    setActiveModalProduct(product);
    setModalQty(product.moq || 1);
    setModalSize(product.variants?.sizes?.[0] || '');
    setModalColor(product.variants?.colors?.[0] || '');
    setModalSlot(product.bookingSlots?.[0] || '');
  };

  const getEffectiveUnitPrice = (prod: Product, qty: number): number => {
    if (prod.type !== 'wholesale' || !prod.tieredPrices) return prod.price;
    const tier = prod.tieredPrices.find(t => qty >= t.minQty && (t.maxQty === null || qty <= t.maxQty));
    return tier ? tier.pricePerUnit : prod.price;
  };

  const handleAddToCartFromModal = () => {
    if (!activeModalProduct) return;
    const item = {
      product: activeModalProduct,
      qty: modalQty,
      variant: [modalSize, modalColor].filter(Boolean).join(' - ') || undefined,
      slot: modalSlot || undefined
    };
    setCart([...cart, item]);
    setActiveModalProduct(null);
    setIsCartOpen(true);
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.type === 'wholesale' || product.type === 'service' || (product.variants && product.variants.sizes?.length)) {
      handleOpenProductModal(product);
    } else {
      setCart([...cart, { product, qty: 1 }]);
      setIsCartOpen(true);
    }
  };

  const handleRemoveFromCart = (index: number) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };

  const calculateCartTotal = () => {
    return cart.reduce((total, item) => {
      const unit = getEffectiveUnitPrice(item.product, item.qty);
      return total + (unit * item.qty);
    }, 0);
  };

  const handleExecuteCheckout = async () => {
    if (cart.length === 0) return;

    try {
      setIsCalculating(true);

      // Yalnızca ID ve adet gönderiliyor; fiyatlar asla istemciden gitmiyor
      const payload = {
        items: cart.map(item => ({
          productId: item.product.id,
          qty: item.qty,
          variant: item.variant
        })),
        deliveryType: selectedDeliveryType || 'CARGO'
      };

      const res = await fetch('/api/orders/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!data.success) {
        alert(data.message || 'Sipariş hesaplanırken hata oluştu.');
        return;
      }

      // Sunucudan dönen mühürlü toplam tutar ve kalemler
      const verifiedSummary = data.summary;
      const orderNumber = 'ORD-2026-' + Math.floor(100000 + Math.random() * 900000);
      const totalOrderAmount = verifiedSummary.totalPayable;

      // 1. GİB e-Fatura Kayıtları
      const savedInvoices = localStorage.getItem('tampazar_invoices');
      const invoices = savedInvoices ? JSON.parse(savedInvoices) : [];

      verifiedSummary.items.forEach((item: any) => {
        const lineTotal = item.total;
        const vatRate = item.vatRate || 20;
        const vat = parseFloat(((lineTotal * vatRate) / (100 + vatRate)).toFixed(2));
        const clean = parseFloat((lineTotal - vat).toFixed(2));

        const originalProduct = cart.find(c => c.product.id === item.productId)?.product;

        const newInv = {
          id: 'inv-' + Math.floor(Math.random() * 1000000),
          invoiceNumber: 'GIB2026000000' + Math.floor(100 + Math.random() * 899),
          orderId: orderNumber,
          tenantId: originalProduct?.tenantId || 's3',
          customerName: user?.name || 'Pazaryeri Müşterisi',
          customerTaxOffice: 'Kadıköy VD',
          customerTaxId: user?.taxId || '1049204910',
          customerEmail: user?.email || 'musteri@tampazar.com',
          date: new Date().toISOString().split('T')[0],
          amount: clean,
          vatAmount: vat,
          withholdingTaxType: 'None',
          withholdingAmount: 0.00,
          totalPayable: lineTotal,
          status: 'queued',
          integrator: 'gib'
        };
        invoices.push(newInv);
      });

      // 2. Üçlü Hibrit Sipariş Kaydı
      const newHybridOrder: HybridOrder = {
        id: 'hyb-' + Date.now(),
        orderNumber,
        tenantId: cart[0]?.product.tenantId || 's3',
        storeName: cart[0]?.product.storeName || 'TamPazar Esnafı',
        customerName: user?.name || 'Müşteri (Web)',
        customerPhone: user?.phone || '0532 555 44 33',
        customerAddress: deliveryAddress,
        city: 'İstanbul',
        district: 'Kadıköy',
        deliveryType: selectedDeliveryType,
        status: selectedDeliveryType === 'LOCAL_EXPRESS' ? 'RINGING' : selectedDeliveryType === 'FIELD_SERVICE' ? 'NEW' : 'DISPATCH_WAITING',
        items: verifiedSummary.items.map((vItem: any) => ({
          productId: vItem.productId,
          title: vItem.title,
          qty: vItem.qty,
          price: vItem.price,
          sku: cart.find(c => c.product.id === vItem.productId)?.product.sku || 'SKU-GENERIC'
        })),
        totalAmount: totalOrderAmount,
        paymentMethod: 'PAYTR_POS',
        paymentStatus: 'PAID',
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        cargoDetails: selectedDeliveryType === 'CARGO' ? {
          carrier: 'Yurtiçi Kargo',
          trackingNumber: '',
          barcode: 'YK-' + Math.floor(100000000 + Math.random() * 900000000),
          despatchNumber: 'IRS-2026-' + Math.floor(10000 + Math.random() * 90000)
        } : undefined,
        localDeliveryDetails: selectedDeliveryType === 'LOCAL_EXPRESS' ? {
          deliverySubtype: 'COURIER_30MIN',
          etaMinutes: 30,
          courierName: 'Kurye Caner (TamPazar Express)',
          courierPhone: '0533 111 22 33',
          preparationStartedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
        } : undefined,
        serviceDetails: selectedDeliveryType === 'FIELD_SERVICE' ? {
          serviceCategory: 'Saha Servisi',
          scheduledTime: 'Bugün 14:00 - 16:00',
          technicianName: 'Saha Ustası Hasan Usta',
          technicianPhone: '0535 777 88 99',
          isEmergency: true,
          issueDescription: 'Web üzerinden konum servis talebi oluşturuldu.'
        } : undefined
      };

      try {
        const savedHybrid = localStorage.getItem('tampazar_hybrid_orders');
        const hybridList: HybridOrder[] = savedHybrid ? JSON.parse(savedHybrid) : [];
        hybridList.unshift(newHybridOrder);
        localStorage.setItem('tampazar_hybrid_orders', JSON.stringify(hybridList));
      } catch (e) {}

      // Yerel sipariş ise esnaf sesli zilini anında çal
      if (selectedDeliveryType === 'LOCAL_EXPRESS') {
        playOrderAlertChime();
      }

      localStorage.setItem('tampazar_invoices', JSON.stringify(invoices));
      window.dispatchEvent(new Event('tampazar_accounting_updated'));
      window.dispatchEvent(new Event('tampazar_invoice_added'));

      setCheckoutSuccess(true);
      setTimeout(() => {
        setCart([]);
        setCheckoutSuccess(false);
        setIsCartOpen(false);
      }, 2500);

    } catch (err) {
      console.error('Checkout hatası:', err);
      alert('İşlem başlatılamadı. Lütfen tekrar deneyin.');
    } finally {
      setIsCalculating(false);
    }
  };

  // 5 Hibrit Ticaret Modeli Ürün Çözümleyicisi
  const getProductBySlug = (slug: string): Product | undefined => {
    return products.find(p => p.slug === slug || p.id === slug) || initialProducts.find(p => p.slug === slug || p.id === slug);
  };

  const HYBRID_COMMERCE_MODELS = [
    {
      id: 'cargo',
      title: 'Ulusal Kargo & Pazaryeri Vitrini',
      subtitle: 'Tüm Türkiye’ye %0 komisyonla doğrudan üretici ve butik esnafından kargolu ürünler.',
      badgeText: 'TamKargo · Ulusal Dağıtım',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: Truck,
      cardBadgeColor: 'bg-amber-500 text-slate-950',
      actionText: 'Sepete Ekle',
      actionIcon: ShoppingBag,
      actionBtnClass: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold',
      slugs: [
        'hakiki-deri-el-yapimi-oxford-ayakkabi',
        'giresun-ordu-dogal-cifte-kavrulmus-findik-1kg',
        'oversize-premium-pamuklu-kapsonlu-sweatshirt',
        'el-yapimi-seramik-kahve-fincan-takimi'
      ]
    },
    {
      id: 'local_food',
      title: 'Sıcak Yerel Sipariş & Mahalle Lezzetleri',
      subtitle: '30-45 dakikada kapınızda! Komisyonsuz doğrudan mahalle fırını, pidecisi ve manavından.',
      badgeText: 'TamHızlı · 30-45 Dk Ekspres',
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
      icon: Utensils,
      cardBadgeColor: 'bg-rose-600 text-white animate-pulse',
      actionText: 'Sipariş Ver (Kapında)',
      actionIcon: Bike,
      actionBtnClass: 'bg-rose-600 hover:bg-rose-500 text-white font-bold',
      slugs: [
        'odun-atesinde-kiymali-kasarli-pide-menu',
        'gunluk-taze-meyve-sarkuteri-paketi',
        'odun-atesinde-et-doner-menu'
      ]
    },
    {
      id: 'emergency',
      title: 'Acil Nöbetçi Hizmetler & Yerel Ustalar',
      subtitle: 'En yakın ustayı haritada görün, 15 dakikada kapınıza çağırın veya doğrudan telefonla arayın.',
      badgeText: 'TamUsta · En Yakın Nöbetçi Usta',
      badgeColor: 'bg-red-100 text-red-900 border-red-300',
      icon: Wrench,
      cardBadgeColor: 'bg-red-600 text-white',
      actionText: 'Konuma Çağır / Hemen Ara',
      actionIcon: Phone,
      actionBtnClass: 'bg-red-600 hover:bg-red-500 text-white font-bold',
      slugs: [
        '7-24-acil-cilingir-kapi-acma',
        '7-24-sehir-ici-oto-cekici-kurtarma',
        'termal-su-kacagi-tespiti'
      ]
    },
    {
      id: 'venue',
      title: 'Mekan & Etkinlik Rezervasyonları',
      subtitle: 'Kır düğünü, davet salonları ve oto ekspertiz merkezleri için tarih sorgulayın ve randevu alın.',
      badgeText: 'Rezervasyon & Tarih Bazlı Satış Modeli',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
      icon: Building,
      cardBadgeColor: 'bg-purple-700 text-white',
      actionText: 'Tarih Seç / Randevu Al',
      actionIcon: Calendar,
      actionBtnClass: 'bg-purple-700 hover:bg-purple-600 text-white font-bold',
      slugs: [
        'panoramik-deniz-manzarali-kir-dugun-salonu',
        'garantili-bilgisayarli-oto-ekspertiz-paketi',
        'acik-hava-dugun-ve-nisan-klip-cekimi'
      ]
    },
    {
      id: 'digital',
      title: 'Anında Dijital İndirme',
      subtitle: 'Kargo beklemeden satın alın, lisanslı ZIP, DST, PES, DXF ve STL dosyalarını anında indirin.',
      badgeText: 'TamDijital · Sıfır Kargo Anında İndirme',
      badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-300',
      icon: FileCode,
      cardBadgeColor: 'bg-cyan-700 text-white',
      actionText: 'Hemen İndir',
      actionIcon: Download,
      actionBtnClass: 'bg-cyan-700 hover:bg-cyan-600 text-white font-bold',
      slugs: [
        'maras-isi-cicek-nakis-deseni-paketi',
        'lazer-kesim-cnc-ahsap-dekoratif-saat-cizimi',
        '3d-yazici-mitolojik-heykel-stl-modeli'
      ]
    },
    {
      id: 'session',
      title: 'Uzaktan Canlı Seans & Özel Ders',
      subtitle: 'Google Meet HD üzerinden birebir online psikolojik terapi, yabancı dil eğitimi ve danışmanlık.',
      badgeText: 'TamSeans · Canlı Online Görüşme',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      icon: Video,
      cardBadgeColor: 'bg-blue-600 text-white',
      actionText: 'Seans Saati Seç',
      actionIcon: Clock,
      actionBtnClass: 'bg-blue-600 hover:bg-blue-500 text-white font-bold',
      slugs: [
        'yetiskin-bireysel-online-psikolojik-danismanlik',
        'birebir-konusma-ileri-seviye-ingilizce-dersi',
        'bireysel-kariyer-eticaret-danismanligi'
      ]
    }
  ];

  const SECTORS_CTA_LIST = [
    {
      id: 'restaurant',
      name: 'Restoran & Kafe',
      icon: Utensils,
      modelBadge: 'TamHızlı Restoran · %0 Komisyon',
      title: 'Kendi Kuryenizle %0 Komisyonla Sıcak Sipariş Alın',
      desc: 'Masaüstü ve tabletler için sesli sipariş uyarı ziliyle siparişleri kaçırmayın. Aracı teslimat şirketlerine cironuzun %35\'ini kaptırmayın.',
      painOld: 'Her 100 ₺ siparişte %35 komisyon + teslimat kesintisi + 30 gün bloke',
      gainTamPazar: '%0 komisyon. 100 ₺ siparişin 100 ₺\'si ertesi gün kendi banka hesabınızda.',
      features: [
        'Masaüstü sesli sipariş zili (anlık mutfak uyarısı)',
        'Kendi moto-kuryenizle dağıtım veya Gel-Al sipariş modu',
        'GİB onaylı e-Adisyon ve e-Arşiv faturası otomatik kesilir',
        'PayTR / iyzico ile ertesi gün hesabınıza doğrudan geçiş'
      ],
      savings: 'Aylık Ortalama ~₺32.000 Komisyon Tasarrufu',
      ctaText: 'Restoran Mağazanızı 2 Dakikada Açın'
    },
    {
      id: 'craftsman',
      name: 'Yerel Usta & Servis',
      icon: Wrench,
      modelBadge: 'TamUsta Saha Servisi · %0 Komisyon',
      title: 'Şehrin Haritasında Canlı Konum Bildirin, Komisyonsuz Teklif Toplayın',
      desc: 'Çilingir, oto kurtarıcı, elektrik ve sıhhi tesisat ustaları harita üzerinde 1.2 km yakındaki müşterilere doğrudan telefon ve WhatsApp ile ulaşır.',
      painOld: 'Teklif vermek için peşin para ödemek, aracıya her işten pay vermek',
      gainTamPazar: 'Müşteri haritadan doğrudan arar veya WhatsApp ile konum atar. Sıfır aracı payı.',
      features: [
        'Haritada 7/24 nöbetçi canlı konum ve rota paylaşımı',
        'Müşteriden doğrudan telefonla arama ve WhatsApp konum desteği',
        'Sabit taban servis bedeli veya kapalı devre TamTeklif teklifi',
        'Cep telefonundan anında GİB e-Fatura / e-SMM düzenleme'
      ],
      savings: 'Teklif Başına Kredi Yakmaya Son · %100 Doğrudan Müşteri',
      ctaText: 'Usta Mağazanızı 2 Dakikada Açın'
    },
    {
      id: 'retail',
      name: 'Butik & Üretici',
      icon: ShoppingBag,
      modelBadge: 'TamKargo Pazaryeri · %0 Komisyon',
      title: 'Tüm Türkiye’ye Kendi Markanız ve Kendi Sanal POS’unuzla Satış',
      desc: 'Ayakkabı, tekstil, mobilya ve yöresel gıda üreticileri için anlaşmalı indirimli kargo, varyant stok yönetimi ve ertesi gün nakit akışı.',
      painOld: '%25 pazaryeri komisyonu, 45 günlük vadeler ve keyfi iade cezaları',
      gainTamPazar: '%0 komisyon. Kendi Sanal POS\'unuz ile ertesi iş günü kasada.',
      features: [
        'Yurtiçi, Aras, MNG indirimli kargo entegrasyonu ve otomatik barkod',
        'Sipariş tesliminde otomatik GİB e-Fatura / e-Arşiv üretimi',
        'Perakende ve toptan (B2B) kademeli iskonto tek dükkânda',
        'Gelişmiş numara, beden ve renk varyant matrisi'
      ],
      savings: '45 Gün Vade Beklemeden Ertesi Gün Nakit Kasa',
      ctaText: 'Üretici Mağazanızı 2 Dakikada Açın'
    },
    {
      id: 'education',
      name: 'Eğitim & Uzman',
      icon: GraduationCap,
      modelBadge: 'TamSeans Canlı Takvim · Doğrudan Tahsilat',
      title: 'Google Meet HD Canlı Seansları ile Peşin Tahsilatlı Danışmanlık',
      desc: 'Klinik psikologlar, uzman diyetisyenler, dil eğitmenleri ve danışmanlar için takvim yönetimli, peşin ödemeli birebir görüntülü görüşme.',
      painOld: 'Yabancı platformlara yüksek döviz komisyonları ve karmaşık takvimler',
      gainTamPazar: 'Danışan seans saatini seçer, peşin öder; Meet linki iki tarafa anında gider.',
      features: [
        'Otomatik Google Meet HD video konferans linki üretimi',
        'Kişiselleştirilebilir haftalık seans takvimi ve saat aralıkları',
        'Seans öncesi %100 peşin güvenli tahsilat garantisi',
        'Otomatik SMS ve e-posta randevu hatırlatıcıları'
      ],
      savings: 'Peşin Tahsilatlı Canlı Görüşme & Sıfır Takvim Karmaşası',
      ctaText: 'Uzman Danışman Profilinizi Açın'
    },
    {
      id: 'venue',
      name: 'Düğün & Mekan',
      icon: Building,
      modelBadge: 'Tarih & Randevu Bazlı Satış',
      title: 'Düğün Salonları, Özel Mekanlar ve Oto Ekspertiz Merkezleri',
      desc: 'Gelin ve damat adaylarından tarih ve kişi sayısı bazlı online teklif toplayın, oto ekspertiz randevularını online kapora ile kesinleştirin.',
      painOld: 'Telefonla randevu takibi ve yüksek yıllık mekan rehberi aidatları',
      gainTamPazar: 'Müşteriler tarihi sorgular, menü paketini seçer ve kapora ile randevusunu alır.',
      features: [
        'Canlı tarih müsaitlik kontrolü ve online takvim ajandası',
        'Tarih bazlı fiyatlandırma ve online kapora tahsilatı',
        'Fotoğraf galerisi, paket menü ve sözleşme onayı',
        'TSE onaylı resmi oto ekspertiz raporu entegrasyonu'
      ],
      savings: 'Kapora Garantili Dijital Rezervasyon Ajandası',
      ctaText: 'Mekan Sayfanızı 2 Dakikada Açın'
    },
    {
      id: 'digital',
      name: 'Dijital Tasarımcı',
      icon: FileCode,
      modelBadge: 'TamDijital Dosya Dağıtımı · Anında Teslim',
      title: 'Nakış Deseni, CNC Çizimi ve 3D STL Dosyalarınızı Komisyonsuz Satın',
      desc: 'Kargo maliyeti yok, paketleme yok! Satın alındığı anda müşteriye güvenli lisanslı indirme bağlantısı teslim edilir.',
      painOld: 'Klasik pazaryerlerinin yüksek komisyonları, yabancı ödeme zorunlulukları ve gecikmeli hak edişler',
      gainTamPazar: 'Tüm dünyaya kendi Sanal POS\'unuzla ZIP/DST/DXF satın, paranız hemen yatsın.',
      features: [
        'DST, PES, DXF, SVG, STL, PDF ve ZIP güvenli dosya teslimatı',
        'Ödeme tamamlandığı an tetiklenen güvenli tek kullanımlık lisans',
        'Kişisel veya Ticari kullanım lisans sözleşmesi',
        'Sıfır kargo ve paketleme maliyetiyle %100 net kâr'
      ],
      savings: '%100 Net Kâr Marjı · Sıfır Kargo ve Paketleme',
      ctaText: 'Dijital Dükkânınızı 2 Dakikada Açın'
    }
  ];

  const currentSectorData = SECTORS_CTA_LIST.find(s => s.id === selectedSectorCTA) || SECTORS_CTA_LIST[0];

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-950">
      
      {/* 0. TOP BAR (Üst Bilgi Şeridi) - Sadece Zorunlu Vurgular & Navigasyon */}
      <div className="bg-[#0B132B] text-slate-300 text-xs py-2 px-4 border-b border-slate-800/90 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Sol Güvenlik & Komisyonsuzluk Vurgusu */}
          <div className="flex items-center gap-2 font-medium text-[11px] sm:text-xs">
            <span className="text-amber-400 font-bold">🛡️ %0 Komisyon Doğrudan Esnaf Kasası</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-emerald-400 font-semibold hidden sm:inline">GİB e-Fatura Garantisi</span>
          </div>

          {/* Sağ Sadeleştirilmiş Navigasyon Linkleri */}
          <div className="flex items-center gap-4 text-[11px] font-semibold">
            <button 
              onClick={() => onNavigateToSuperMall?.()}
              className="hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer text-slate-200"
            >
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span>Şehrin Açık AVM'si</span>
            </button>
            <Link to="/kuryeler" className="hover:text-amber-300 transition-colors flex items-center gap-1 text-slate-200">
              <Bike className="w-3.5 h-3.5 text-sky-400" />
              <span>TamKurye</span>
            </Link>
            <Link to="/blog" className="hover:text-amber-300 transition-colors text-slate-200">
              Rehber & Blog
            </Link>
            <button 
              onClick={() => onOpenSellerDashboard?.('overview')}
              className="text-amber-400 hover:text-amber-300 transition-colors font-bold cursor-pointer flex items-center gap-1 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20"
            >
              <Briefcase className="w-3 h-3" />
              <span>Esnaf Paneli</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. ÜST HEADER: Amazon Arama Genişliği + Airbnb Tipografisi */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-3 sm:gap-4">
          
          <div className="flex items-center shrink-0">
            <BrandLogo 
              size="lg" 
              onClick={() => { 
                setSelectedScope('all'); 
                setSelectedTypeFilter('all'); 
                setActiveStoryFilter(null);
                setSearchQuery(''); 
                setActiveModalProduct(null); 
                setIsCartOpen(false); 
              }} 
            />
          </div>

          {/* Amazon Kalitesinde Genişletilmiş Akıllı Hibrit Arama Çubuğu */}
          <div className="flex-1 max-w-2xl mx-2 sm:mx-4 relative">
            <div className="flex items-center rounded-xl border-2 border-slate-200/90 focus-within:border-[#F59E0B] focus-within:ring-3 focus-within:ring-[#F59E0B]/20 overflow-hidden bg-white shadow-xs transition-all duration-200">
              {/* Sol: Açılır Kategori Filtresi */}
              <select 
                value={selectedScope}
                onChange={(e) => setSelectedScope(e.target.value as any)}
                className="bg-slate-100/80 hover:bg-slate-200/80 px-2.5 sm:px-3 text-xs font-bold text-slate-700 border-r border-slate-200 outline-none cursor-pointer transition-colors h-11 shrink-0"
              >
                <option value="all">Tüm Pazar ▾</option>
                <option value="retail">Perakende</option>
                <option value="wholesale">Toptan (B2B)</option>
                <option value="service">Hizmet & Rezervasyon</option>
                <option value="stores">Doğrudan Mağazalar</option>
              </select>

              {/* Orta: Geniş ve Okunaklı Arama Inputu */}
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Mahallenizdeki esnafı, ürünü veya hizmeti arayın..."
                className="w-full min-w-0 px-3.5 py-2 text-xs sm:text-sm font-medium outline-none bg-transparent text-slate-900 placeholder:text-slate-400 h-11"
              />

              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="px-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Sağ: Zümrüt Yeşili Arama Butonu */}
              <button 
                className="bg-[#0F4C3A] hover:bg-[#0B382B] text-white w-12 h-11 flex items-center justify-center shrink-0 transition-colors cursor-pointer font-bold shadow-xs active:scale-95"
                title="Arama Yap"
              >
                <Search className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Sağ Eylemler: Nefes Payı Açılmış Butonlar */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <Link 
              to="/saticipaneli"
              className="hidden xl:flex items-center gap-1.5 bg-[#0F4C3A] hover:bg-[#0B382B] text-white px-3 py-2 rounded-xl font-bold text-[11px] transition-all cursor-pointer shadow-xs border border-emerald-600/40"
            >
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span>Satıcı Ol / Dükkan Aç</span>
              <span className="bg-[#F59E0B] text-[#0B132B] text-[8.5px] font-black px-1 py-0.2 rounded uppercase">14 Gün Ücretsiz</span>
            </Link>

            <Link 
              to="/toptan"
              className="hidden lg:flex items-center gap-1.5 bg-[#0B132B] hover:bg-[#111B38] text-amber-300 px-3 py-2 rounded-xl font-extrabold text-[11px] transition-all cursor-pointer shadow-xs border border-slate-700/80"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>B2B Toptan</span>
              <span className="bg-[#F59E0B] text-[#0B132B] text-[8.5px] font-black px-1 py-0.2 rounded uppercase">Toptan</span>
            </Link>

            <button 
              onClick={() => {
                setTamTeklifCategory(undefined);
                setIsTamTeklifModalOpen(true);
              }}
              className="hidden md:flex items-center gap-1.5 bg-[#F59E0B] hover:bg-[#D97706] text-[#0B132B] px-3 py-2 rounded-xl font-extrabold text-[11px] transition-all transform hover:scale-102 cursor-pointer shadow-xs border border-amber-400/40"
            >
              <Sparkles className="w-3.5 h-3.5 fill-[#0B132B]" />
              <span>Ücretsiz Teklif Al</span>
              <span className="bg-[#0B132B] text-amber-300 text-[8.5px] font-mono px-1 rounded uppercase">TamTeklif</span>
            </button>

            <GlobalUserNav />

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-colors cursor-pointer text-[#0B132B]"
            >
              <ShoppingBag className="w-4 h-4 text-[#0F4C3A]" />
              <span className="hidden sm:inline">Sepet</span>
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#F59E0B] text-[#0B132B] font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 2. ÜST HIZLI YATAY KATEGORİ İKON ÇUBUĞU (QUICK CATEGORY BAR) */}
      <QuickCategoryBar 
        onOpenTamTeklif={() => {
          setTamTeklifCategory(undefined);
          setIsTamTeklifModalOpen(true);
        }}
      />

      {/* KATEGORİ BARI ALTI ESNAF KAZANIM MİNİ DÖNÜŞÜM ŞERİDİ */}
      <div className="bg-[#0F4C3A] text-white py-2 px-4 text-xs font-bold shadow-2xs border-b border-emerald-800 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-center">
        <span className="bg-[#F59E0B] text-[#0B132B] text-[9.5px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
          Esnaf mısınız?
        </span>
        <span className="text-emerald-100">Kendi Dijital Dükkanınızı & Reyonunuzu 2 Dakikada Açın (%0 Komisyon · Doğrudan Esnaf POS'u)</span>
        <Link 
          to="/saticipaneli" 
          className="bg-white text-[#0F4C3A] hover:bg-[#F59E0B] hover:text-[#0B132B] text-[11px] font-extrabold px-3 py-1 rounded-xl transition-all shadow-xs"
        >
          Hemen Mağaza Aç →
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-4 pt-6 pb-12 space-y-10 flex-1 w-full">
        
        {/* 3. BUGÜNÜN FIRSAT KAMPANYALARI BANNERI (Stripe Kart Derinliği & Airbnb Tipografisi) */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0B132B] via-[#0F4C3A]/90 to-[#0B132B] text-white p-6 sm:p-8 md:p-11 shadow-2xl border border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-[#F59E0B] text-[#0B132B] uppercase tracking-widest shadow-md">
              <Zap className="w-3.5 h-3.5 fill-[#0B132B]" /> Esnaf Fırsat Haftası
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-[2.6rem] font-black tracking-tight leading-tight text-white">
              Aracı Komisyonu Yok, Doğrudan Esnaf Fiyatı Var!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium max-w-lg">
              Milyonlarca ürünü ve yerel esnaf hizmetini %0 komisyonla doğrudan üreticiden veya ustadan sepetinize ekleyin. GİB e-Fatura garantisiyle hemen alışverişe başlayın.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button 
                onClick={() => { setSelectedTypeFilter('retail'); }}
                className="px-5 py-3 bg-[#F59E0B] hover:bg-[#D97706] text-[#0B132B] font-black text-xs rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                Perakende Ürünleri İncele →
              </button>
              <button 
                onClick={() => {
                  setTamTeklifCategory(undefined);
                  setIsTamTeklifModalOpen(true);
                }}
                className="px-5 py-3 bg-white text-[#0F4C3A] hover:bg-emerald-50 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2 border border-white/40 transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Ücretsiz Fiyat Teklifi Al (TamTeklif)</span>
              </button>
              <button 
                onClick={() => onNavigateToSuperMall?.()}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all cursor-pointer"
              >
                Şehrin Açık AVM'sini Gez
              </button>
            </div>
          </div>
          <div className="w-full md:w-auto shrink-0 text-center">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 space-y-2 shadow-2xl">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#F59E0B] block font-black">Anlık Aktif Esnaf</span>
              <span className="text-4xl sm:text-5xl font-black text-white">2.095 Dükkân</span>
              <span className="text-xs text-emerald-200 block font-medium">7/24 Doğrudan İletişim & POS</span>
            </div>
          </div>
        </div>

        {/* HERO BANNER ALTI STRATEJİK SATICI DÖNÜŞÜM BANTI */}
        <div className="bg-gradient-to-r from-[#0B132B] via-[#0F4C3A] to-[#0B132B] rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/80 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-2xl">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="bg-[#F59E0B] text-[#0B132B] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                🛡️ %0 Komisyon Garantisi
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Doğrudan Esnaf IBAN / POS
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              Aracı Komisyonu Ödemeyin, Mahallenizin Dijital Dükkanı Olun!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              %0 komisyon, doğrudan esnaf IBAN'ı/POS'u ve 81 ilde anında görünürlük. Satışlarınızdan 1 ₺ bile komisyon kesilmez.
            </p>
          </div>

          <Link 
            to="/saticipaneli"
            className="bg-[#F59E0B] hover:bg-[#D97706] text-[#0B132B] font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-xl transition-all whitespace-nowrap cursor-pointer transform hover:-translate-y-0.5 shrink-0 flex items-center gap-2"
          >
            <Store className="w-4 h-4" />
            <span>Hemen Mağaza Aç (İlk 14 Gün Ücretsiz)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4. İNDİRİM ORANLARINA GÖRE KEŞFET KUTULARI */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Percent className="w-5 h-5 text-rose-600" /> İndirim Oranlarına Göre Keşfet
            </h2>
            <span className="text-xs text-slate-500">Sınırlı Süreli Fırsatlar</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { discount: '%10 İndirim', label: 'Seçili Ayakkabı & Giyim', code: 'TAMPZ10', color: 'from-amber-500 to-amber-600' },
              { discount: '%20 İndirim', label: 'Zanaatkâr Mobilya & Dekor', code: 'TAMPZ20', color: 'from-indigo-600 to-indigo-800' },
              { discount: '%35 İndirim', label: 'Toptan Koli & Ambalaj', code: 'TAMPZ35', color: 'from-emerald-600 to-teal-700' },
              { discount: '%50 ve Üzeri', label: 'Büyük Esnaf Tasfiye Sezonu', code: 'TAMPZ50', color: 'from-rose-600 to-pink-700' },
            ].map((box, idx) => (
              <div 
                key={idx}
                onClick={() => alert(`İndirim Kuponu Kopyalandı: ${box.code} (${box.label} için geçerlidir)`)}
                className={`bg-gradient-to-br ${box.color} text-white p-5 rounded-2xl shadow-md cursor-pointer hover:scale-[1.02] transition-transform flex flex-col justify-between h-36`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black tracking-tight">{box.discount}</span>
                  <Tag className="w-5 h-5 opacity-80" />
                </div>
                <div>
                  <span className="text-xs font-bold block leading-snug">{box.label}</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md mt-2 inline-block font-mono">Kupon: {box.code}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. HİBRİT TİCARET TÜRÜ DİNAMİK VİTRİN BÖLÜMÜ */}
        <section className="space-y-8 bg-slate-50/80 -mx-4 px-4 py-8 rounded-3xl border border-slate-200/60">
          <div className="space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#0F4C3A] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#0F4C3A]" />
                  5+1 Hibrit Ticaret Ekosistemi
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-[#0B132B] tracking-tight mt-1.5">
                  5 Hibrit Ticaret Modeliyle TamPazar Vitrini
                </h2>
                <p className="text-xs md:text-sm text-slate-500 max-w-3xl">
                  Türkiye’nin ilk ve tek komisyonsuz hibrit pazaryeri: Fiziksel Kargo, Sıcak Mahalle Lezzeti, Acil Nöbetçi Usta, Mekan Rezervasyonu, Anında Dijital İndirme ve Canlı Uzman Seansları tek çatı altında.
                </p>
              </div>

              {/* Model Filtre Butonları */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                <button
                  onClick={() => setActiveCommerceModelTab('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    activeCommerceModelTab === 'all'
                      ? 'bg-[#0F4C3A] text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  ✨ Tüm Modeller
                </button>
                {HYBRID_COMMERCE_MODELS.map(m => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setActiveCommerceModelTab(m.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                        activeCommerceModelTab === m.id
                          ? 'bg-[#0F4C3A] text-white shadow-xs font-black'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{m.title.split('&')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Modellerin Dinamik Listesi */}
          <div className="space-y-10">
            {HYBRID_COMMERCE_MODELS
              .filter(model => activeCommerceModelTab === 'all' || activeCommerceModelTab === model.id)
              .map(model => {
                const ModelIcon = model.icon;
                const ActionIcon = model.actionIcon;

                return (
                  <div key={model.id} className="space-y-4 bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                    {/* Model Alt Başlığı & Rozeti */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="p-2.5 bg-emerald-50 text-[#0F4C3A] rounded-xl">
                          <ModelIcon className="w-5 h-5 text-[#0F4C3A]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base sm:text-lg font-black text-slate-900">
                              {model.title}
                            </h3>
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${model.badgeColor}`}>
                              {model.badgeText}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {model.subtitle}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (model.id === 'cargo') setSelectedTypeFilter('retail');
                          else if (model.id === 'emergency' || model.id === 'venue' || model.id === 'session') setSelectedTypeFilter('service');
                          else setSelectedScope('all');
                        }}
                        className="text-xs font-bold text-[#0F4C3A] hover:text-[#0B382B] flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                      >
                        Tümünü İncele <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Model Ürün Kartları Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {model.slugs.map(slug => {
                        const product = getProductBySlug(slug);
                        if (!product) return null;

                        const isFav = favorites.includes(product.id);
                        const oldPrice = Math.round(product.price * 1.2);

                        return (
                          <div
                            key={product.id}
                            onClick={() => {
                              if (onNavigateToProduct) onNavigateToProduct(product.slug);
                              else setActiveModalProduct(product);
                            }}
                            className="bg-white rounded-2xl border border-slate-200 hover:border-[#0F4C3A]/50 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer group overflow-hidden"
                          >
                            <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                              <img
                                src={product.image}
                                alt={`${product.title} - TamPazar`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
                                }}
                              />
                              <div className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg font-black text-[10px] shadow-sm ${model.cardBadgeColor}`}>
                                {product.badge || model.badgeText}
                              </div>

                              <button
                                onClick={(e) => toggleFavorite(product.id, e)}
                                className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xs hover:bg-white transition cursor-pointer"
                              >
                                <Heart className={`w-4 h-4 ${isFav ? 'text-rose-600 fill-rose-600' : 'text-slate-600'}`} />
                              </button>
                            </div>

                            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-[#0F4C3A] uppercase tracking-wide block truncate">
                                  {product.storeName || 'TamPazar Esnafı'}
                                </span>
                                <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-relaxed group-hover:text-[#0F4C3A]">
                                  {product.title}
                                </h4>
                              </div>

                              <div className="space-y-2 pt-2 border-t border-slate-100">
                                <div className="flex items-center justify-between text-[11px]">
                                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                                    <span className="text-slate-800">{product.rating || 4.9}</span>
                                    <span className="text-slate-400 font-normal">({product.salesCount || 120})</span>
                                  </div>
                                  <span className="text-[10px] text-[#0F4C3A] font-bold bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30">
                                    %0 Komisyon
                                  </span>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                  <div>
                                    <span className="text-[10px] text-slate-400 line-through block leading-none">
                                      ₺{oldPrice.toLocaleString('tr-TR')}
                                    </span>
                                    <span className="text-base font-black text-slate-950">
                                      ₺{product.price.toLocaleString('tr-TR')}
                                    </span>
                                  </div>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (model.id === 'cargo') {
                                        handleQuickAdd(product, e);
                                      } else {
                                        if (onNavigateToProduct) onNavigateToProduct(product.slug);
                                        else setActiveModalProduct(product);
                                      }
                                    }}
                                    className={`px-3 py-2 rounded-xl text-xs transition cursor-pointer shadow-xs flex items-center gap-1.5 shrink-0 ${model.actionBtnClass}`}
                                  >
                                    <ActionIcon className="w-3.5 h-3.5" />
                                    <span>{model.actionText}</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </section>

        {/* 6. SANA ÖZEL ÖNERİLEN ÜRÜNLER (CAROUSEL) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Sana Özel Önerilen Ürünler & Hizmetler
            </h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => scrollCarousel('left')} 
                className="w-9 h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-100 transition cursor-pointer shadow-xs"
              >
                <ChevronLeft className="w-5 h-5 text-slate-700" />
              </button>
              <button 
                onClick={() => scrollCarousel('right')} 
                className="w-9 h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-100 transition cursor-pointer shadow-xs"
              >
                <ChevronRight className="w-5 h-5 text-slate-700" />
              </button>
            </div>
          </div>

          <div 
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto scrollbar-none pb-4 pt-1 snap-x scroll-smooth"
          >
            {products.slice(0, 6).map((product) => {
              const oldPrice = Math.round(product.price * 1.25);
              const discountPercent = 20;
              const isFav = favorites.includes(product.id);

              return (
                <div
                  key={product.id}
                  onClick={() => onNavigateToProduct?.(product.slug)}
                  className="min-w-[260px] max-w-[260px] bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer snap-start group overflow-hidden"
                >
                  <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={`${product.title} - TamPazar`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 px-2.5 py-1 rounded-lg font-black text-[10px] shadow">
                      {product.badge || 'Kargo Bedava'}
                    </div>

                    <button 
                      onClick={(e) => toggleFavorite(product.id, e)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow hover:bg-white transition cursor-pointer"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'text-rose-600 fill-rose-600' : 'text-slate-600'}`} />
                    </button>

                    <div className="absolute bottom-2 left-2 bg-rose-600 text-white px-2 py-0.5 rounded-md font-bold text-[10px]">
                      %{discountPercent} İndirim
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide block">
                        {product.storeName || 'TamPazar Esnafı'}
                      </span>
                      <h3 className="text-xs font-bold text-slate-800 line-clamp-2 leading-relaxed group-hover:text-indigo-900">
                        {product.title}
                      </h3>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="text-slate-800">{product.rating || 4.8}</span>
                        <span className="text-slate-400 font-normal">({product.salesCount || 42})</span>
                      </div>

                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 line-through block">₺{oldPrice.toLocaleString('tr-TR')}</span>
                          <span className="text-lg font-black text-slate-900">₺{product.price.toLocaleString('tr-TR')}</span>
                        </div>
                        <button
                          onClick={(e) => handleQuickAdd(product, e)}
                          className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer shadow-xs flex items-center gap-1"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> Ekle
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 7. İNTERAKTİF "SEKTÖRÜNÜ SEÇ, %0 KOMİSYONLA HEMEN BAŞLA" (SATICI KAZANIM CTA) */}
        <section className="bg-gradient-to-br from-[#0B132B] via-[#0F4C3A] to-[#0B132B] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/30 relative overflow-hidden space-y-6">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Başlık ve Açıklama */}
          <div className="relative z-10 space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#F59E0B] bg-[#F59E0B]/15 border border-[#F59E0B]/30 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-[#F59E0B]" />
              Komisyonsuz Esnaf & İşletme Kazanım Merkezi
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Sektörünü Seç, %0 Komisyonla Hemen Başla
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl">
              Aracı şirketlerin %35'e varan komisyon ve 45 günlük bloke vadelerine son verin. Sektörünüzü seçin, kendi Sanal POS'unuzla hemen satışa başlayın.
            </p>
          </div>

          {/* Sektör Seçici Butonlar */}
          <div className="relative z-10 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {SECTORS_CTA_LIST.map((sector) => {
              const SectorIcon = sector.icon;
              const isSelected = selectedSectorCTA === sector.id;

              return (
                <button
                  key={sector.id}
                  onClick={() => setSelectedSectorCTA(sector.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#F59E0B] text-[#0B132B] font-black shadow-lg scale-105'
                      : 'bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10'
                  }`}
                >
                  <SectorIcon className={`w-4 h-4 ${isSelected ? 'text-[#0B132B]' : 'text-amber-300'}`} />
                  <span>{sector.name}</span>
                </button>
              );
            })}
          </div>

          {/* Seçilen Sektöre Göre Dinamik Avantaj & Başvuru Paneli */}
          <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Sol Taraf: Özellikler ve Kıyaslama */}
            <div className="md:col-span-7 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded border border-amber-400/30">
                  {currentSectorData.modelBadge}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                  {currentSectorData.title}
                </h3>
                <p className="text-xs text-emerald-100/90 leading-relaxed">
                  {currentSectorData.desc}
                </p>
              </div>

              {/* Eski Model vs TamPazar Farkı Kıyaslama Kutusu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-rose-950/40 border border-rose-800/40 p-3 rounded-xl space-y-1">
                  <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider block">
                    ❌ Geleneksel Aracı Pazaryerleri
                  </span>
                  <p className="text-[11px] text-rose-200/90 leading-snug">
                    {currentSectorData.painOld}
                  </p>
                </div>
                <div className="bg-emerald-950/40 border border-emerald-800/40 p-3 rounded-xl space-y-1">
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider block">
                    ✅ TamPazar BYOPOS Modeli
                  </span>
                  <p className="text-[11px] text-emerald-200/90 leading-snug">
                    {currentSectorData.gainTamPazar}
                  </p>
                </div>
              </div>

              {/* 4 Madde Özellikler Listesi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {currentSectorData.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-200">
                    <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sağ Taraf: Kazanç / Tasarruf ve Hızlı Başvuru Kartı */}
            <div className="md:col-span-5 bg-gradient-to-br from-[#0B132B]/80 to-[#111B38] border border-emerald-500/30 rounded-2xl p-6 text-center space-y-4 shadow-inner">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                  Sektörel Kazanç & Tasarruf
                </span>
                <div className="text-xl font-black text-white">
                  {currentSectorData.savings}
                </div>
                <p className="text-[11px] text-slate-300">
                  PayTR / iyzico entegrasyonuyla cironuz doğrudan sizin banka hesabınıza akar.
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 space-y-3">
                <button
                  onClick={() => onOpenSellerDashboard ? onOpenSellerDashboard('byopos') : undefined}
                  className="w-full py-3.5 bg-[#F59E0B] hover:bg-[#D97706] text-[#0B132B] font-black text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Store className="w-4 h-4" />
                  <span>{currentSectorData.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-slate-400">
                  Kredi kartı gerekmez · 2 dakikada kurulum · Kurumsal e-Fatura hazır
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. TÜM ÜRÜNLER / SONSUZ LİSTE (TRENDYOL ÜRÜN GRID) */}
        <div className="space-y-6 pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Tüm Ürünler & Esnaf Vitrini</h2>
              <p className="text-xs text-slate-500">Toplam {filteredProducts.length} ürün ve hizmet listeleniyor</p>
            </div>

            {/* Hızlı Filtre Butonları */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              {[
                { key: 'all', label: 'Tümü' },
                { key: 'retail', label: '🛍️ Perakende' },
                { key: 'wholesale', label: '📦 Toptan' },
                { key: 'service', label: '💆 Hizmet' }
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setSelectedTypeFilter(f.key as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedTypeFilter === f.key
                      ? 'bg-[#0F4C3A] text-white shadow-xs font-black'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* KAPALI DEVRE FİYAT TEKLİFİ TOPLAMA BANNERI (TAMTEKLİF) */}
          <div className="bg-gradient-to-r from-[#0B132B] via-[#0F4C3A]/95 to-[#0B132B] text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-start gap-4 relative z-10">
              <div className="p-3.5 bg-[#F59E0B] text-[#0B132B] rounded-2xl shrink-0 font-black shadow-md">
                <Sparkles className="w-6 h-6 fill-[#0B132B]" />
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-[#F59E0B]/20 text-amber-300 px-2 py-0.5 rounded border border-[#F59E0B]/30">
                    Kapalı Teklif Sistemi · TamTeklif
                  </span>
                  <span className="text-[10px] text-emerald-200 font-bold">%0 Komisyon · Esnaflar Birbirini Göremez</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  Özel Hizmet, Oto Kurtarma, Usta ya da Toptan Ürün Teklifi mi Lazım?
                </h3>
                <p className="text-xs text-emerald-100/90 max-w-2xl leading-relaxed">
                  İhtiyacınızı ve konumunuzu 1 dakikada belirtin. Bölgenizdeki onaylı esnaflar gizli tekliflerini iletsin, fiyatları karşılaştırıp en uygun olanı tek tıkla seçin.
                </p>
              </div>
            </div>

            <div className="relative z-10 shrink-0 flex flex-col sm:flex-row md:flex-col gap-2">
              <button
                onClick={() => {
                  setTamTeklifCategory(undefined);
                  setIsTamTeklifModalOpen(true);
                }}
                className="px-6 py-3.5 bg-[#F59E0B] hover:bg-[#D97706] text-[#0B132B] font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer transform hover:scale-102"
              >
                <Sparkles className="w-4 h-4 fill-[#0B132B]" />
                <span>Ücretsiz Fiyat Teklifi Al →</span>
              </button>
              <span className="text-[10px] text-slate-300 text-center font-medium">Ortalama 15 dk içinde ilk teklifler gelir</span>
            </div>
          </div>

          {/* Ürün Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
                !
              </div>
              <h3 className="text-base font-black text-slate-900">Aradığınız kriterde ürün veya hizmet bulunamadı</h3>
              <p className="text-xs text-slate-500">Lütfen arama teriminizi değiştirin veya filtreleri sıfırlayın.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedTypeFilter('all'); setSelectedScope('all'); setActiveStoryFilter(null); }}
                className="px-4 py-2 bg-indigo-900 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Filtreleri Temizle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const oldPrice = Math.round(product.price * 1.25);
                const isFav = favorites.includes(product.id);

                return (
                  <div
                    key={product.id}
                    onClick={() => onNavigateToProduct?.(product.slug)}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group overflow-hidden"
                  >
                    <div className="relative h-60 w-full bg-slate-100 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={`${product.title} - TamPazar`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 px-2.5 py-1 rounded-lg font-black text-[10px] shadow">
                        {product.badge || 'Doğrudan Esnaf'}
                      </div>

                      <button 
                        onClick={(e) => toggleFavorite(product.id, e)}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow hover:bg-white transition cursor-pointer"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'text-rose-600 fill-rose-600' : 'text-slate-600'}`} />
                      </button>

                      <div className="absolute bottom-2 left-2 bg-emerald-600 text-white px-2 py-0.5 rounded-md font-bold text-[10px]">
                        Sepette İndirimli
                      </div>
                    </div>

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide block">
                          {product.storeName || 'TamPazar Mağazası'}
                        </span>
                        <h3 className="text-xs font-bold text-slate-800 line-clamp-2 leading-relaxed group-hover:text-indigo-900">
                          {product.title}
                        </h3>
                      </div>

                      <div className="space-y-2.5 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span className="text-slate-800">{product.rating || 4.8}</span>
                          <span className="text-slate-400 font-normal">({product.salesCount || 42} Değerlendirme)</span>
                        </div>

                        <div className="flex items-baseline justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 line-through block">₺{oldPrice.toLocaleString('tr-TR')}</span>
                            <span className="text-lg font-black text-slate-900">₺{product.price.toLocaleString('tr-TR')}</span>
                          </div>
                          <button
                            onClick={(e) => handleQuickAdd(product, e)}
                            className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer shadow-xs flex items-center gap-1"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" /> Ekle
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* FOOTER ÖNCESİ ESNAF KATILIM BLOĞU (3'LÜ BAŞVURU KARTLARI) */}
          <div className="space-y-5 pt-4">
            <div className="text-center max-w-2xl mx-auto space-y-1">
              <span className="text-[11px] font-black text-[#0F4C3A] uppercase tracking-wider bg-emerald-100 px-3 py-0.5 rounded-full inline-block">
                TamPazar Ailesine Katılın
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0B132B]">
                Dükkan Sahipleri, Kuryeler ve Ustalar İçin Dijital İşletim Sistemi
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Dükkan Sahipleri */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left space-y-4">
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#0F4C3A] flex items-center justify-center text-xl font-black">
                    🏪
                  </div>
                  <h3 className="text-base font-black text-[#0B132B]">Dükkan Sahipleri & Perakende</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Restoran, Fırın, Kasap, Manav, Butik ve Yapı Marketler için %0 komisyonla doğrudan online sipariş alın.
                  </p>
                </div>
                <Link 
                  to="/saticipaneli"
                  className="w-full py-3 bg-[#0F4C3A] hover:bg-[#0B382B] text-white font-extrabold text-xs rounded-xl text-center block transition cursor-pointer shadow-xs"
                >
                  Dükkanını 2 Dakikada Aç →
                </Link>
              </div>

              {/* Card 2: Bağımsız Kuryeler */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left space-y-4">
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-900 flex items-center justify-center text-xl font-black">
                    🛵
                  </div>
                  <h3 className="text-base font-black text-[#0B132B]">Bağımsız Kuryeler (TamKurye)</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Kendi motorunuz veya aracınızla esnafların siparişlerini taşıyın, teslimat başına net kazanç sağlayın.
                  </p>
                </div>
                <Link 
                  to="/kurye-ol"
                  className="w-full py-3 bg-[#0B132B] hover:bg-[#111B38] text-amber-300 font-extrabold text-xs rounded-xl text-center block transition cursor-pointer shadow-xs"
                >
                  Kurye Olarak Katıl →
                </Link>
              </div>

              {/* Card 3: Yerel Ustalar & Servisler */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left space-y-4">
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center text-xl font-black">
                    🛠️
                  </div>
                  <h3 className="text-base font-black text-[#0B132B]">Yerel Ustalar & Saha Servisi</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Tesisatçı, Elektrikçi, Kombici ve Boyacılar için haritada konum bildirin, komisyonsuz doğrudan teklif toplayın.
                  </p>
                </div>
                <Link 
                  to="/saticipaneli"
                  className="w-full py-3 bg-[#F59E0B] hover:bg-[#D97706] text-[#0B132B] font-extrabold text-xs rounded-xl text-center block transition cursor-pointer shadow-xs"
                >
                  Usta Profili Oluştur →
                </Link>
              </div>
            </div>
          </div>

          {/* BLOG & REHBER MERKEZİ BANNER ALANI */}
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>TAMPAZAR REHBER & BİLGİ MERKEZİ</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Esnafın Gücü, Tüketicinin Bilinçli Rehberi
                </h3>
                <p className="text-xs text-slate-300">
                  Komisyonsuz ticaret sistemi, GİB e-fatura avantajları ve akıllı tüketici ipuçları.
                </p>
              </div>

              <button
                onClick={() => navigate('/blog')}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition whitespace-nowrap cursor-pointer"
              >
                Tüm Rehberleri Oku →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                onClick={() => navigate('/blog/yuzde-25-komisyon-vermek-zorunda-degilsiniz-esnaf-isletim-sistemi-tampazar')}
                className="p-4 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 rounded-2xl transition cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                    👨‍💼 Esnaf Rehberi
                  </span>
                  <span className="text-[10px] text-slate-400">5 dk okuma</span>
                </div>
                <h4 className="text-sm font-black text-white group-hover:text-amber-300 transition">
                  Yüzde 25 Komisyon Vermek Zorunda Değilsiniz: Esnaf İşletim Sistemi TamPazar
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2">
                  Geleneksel pazaryerlerinin %20-30 komisyon kesintilerine son. Kendi Sanal POS'unuz, ücretsiz GİB e-fatura entegrasyonu ve sabit aidat modeli.
                </p>
              </div>

              <div 
                onClick={() => navigate('/blog/mahallenin-sicakligi-turkiyenin-cesitliligi-tuketici-neden-tampazari-tercih-ediyor')}
                className="p-4 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 rounded-2xl transition cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2.5 py-0.5 rounded-full border border-emerald-400/20">
                    🛒 Tüketici İpuçları
                  </span>
                  <span className="text-[10px] text-slate-400">4 dk okuma</span>
                </div>
                <h4 className="text-sm font-black text-white group-hover:text-emerald-300 transition">
                  Mahallenin Sıcaklığı, Türkiye'nin Çeşitliliği: Tüketici Neden TamPazar'ı Tercih Ediyor?
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2">
                  Aracı tekel komisyonları olmadan doğrudan üreticiden ve mahalle esnafından alışveriş yapın. Kapalı zarf TamTeklif, gramajlı tartı ve şeffaf esnaf garantisi.
                </p>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* SEPET / ÇIKIŞ ÇEKMECE (DRAWER) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end animate-fade-in">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-900" />
                <h3 className="text-base font-black text-slate-900">Alışveriş Sepeti ({cart.length})</h3>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-20 space-y-3">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">Sepetiniz henüz boş</p>
                  <p className="text-xs text-slate-400">Esnaf vitrininden ürün veya hizmet ekleyin.</p>
                </div>
              ) : (
                cart.map((item, idx) => {
                  const unitPrice = getEffectiveUnitPrice(item.product, item.qty);
                  return (
                    <div key={idx} className="flex gap-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl items-center">
                      <img src={item.product.image} alt={item.product.title} className="w-16 h-16 object-cover rounded-xl shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 truncate">{item.product.title}</h4>
                        <span className="text-[10px] text-slate-500 block">{item.product.storeName}</span>
                        {item.variant && <span className="text-[10px] font-mono text-indigo-600 block">Varyant: {item.variant}</span>}
                        <span className="text-xs font-black text-slate-900 mt-1 block">₺{unitPrice.toLocaleString('tr-TR')} x {item.qty}</span>
                      </div>
                      <button 
                        onClick={() => handleRemoveFromCart(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-slate-200 space-y-4">
                
                {/* TESLİMAT MODELİ SEÇİMİ (3'lü Hibrit Mimari) */}
                <div className="space-y-2">
                  <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider block">
                    Teslimat & Servis Yöntemi Seçin:
                  </span>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {/* 1. Kargo */}
                    <button
                      type="button"
                      onClick={() => setSelectedDeliveryType('CARGO')}
                      className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition cursor-pointer ${
                        selectedDeliveryType === 'CARGO' 
                          ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20' 
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                      }`}
                    >
                      <Truck className={`w-4 h-4 mt-0.5 shrink-0 ${selectedDeliveryType === 'CARGO' ? 'text-indigo-600' : 'text-slate-500'}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-xs font-bold text-slate-900">Kargo ile Adrese Teslim</strong>
                          <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.2 rounded">Tüm Türkiye</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">Yurtiçi / Aras / MNG anlaşmalı kargo ile 1-2 iş gününde teslim.</p>
                      </div>
                    </button>

                    {/* 2. Yerel Express */}
                    <button
                      type="button"
                      onClick={() => setSelectedDeliveryType('LOCAL_EXPRESS')}
                      className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition cursor-pointer ${
                        selectedDeliveryType === 'LOCAL_EXPRESS' 
                          ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-400/20' 
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                      }`}
                    >
                      <Bike className={`w-4 h-4 mt-0.5 shrink-0 ${selectedDeliveryType === 'LOCAL_EXPRESS' ? 'text-amber-600' : 'text-slate-500'}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-xs font-bold text-slate-900">Mahallemden Hemen Getir</strong>
                          <span className="text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded animate-pulse">30-45 Dk</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">Esnaf masaüstü zili çalar; moto-kurye anında kapınıza getirir.</p>
                      </div>
                    </button>

                    {/* 3. Saha Servisi */}
                    <button
                      type="button"
                      onClick={() => setSelectedDeliveryType('FIELD_SERVICE')}
                      className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition cursor-pointer ${
                        selectedDeliveryType === 'FIELD_SERVICE' 
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20' 
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                      }`}
                    >
                      <Wrench className={`w-4 h-4 mt-0.5 shrink-0 ${selectedDeliveryType === 'FIELD_SERVICE' ? 'text-emerald-600' : 'text-slate-500'}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-xs font-bold text-slate-900">Hizmeti Konuma Çağır</strong>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">TamUsta</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">Usta harita konumuza yönlendirilir, randevulu veya acil servis verilir.</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Teslimat Adresi */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">Teslimat / Servis Adresi:</label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none font-medium text-slate-800"
                    placeholder="Açık adresinizi giriniz..."
                  />
                </div>

                <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-100">
                  <span className="text-slate-500 font-medium">Toplam Tutar:</span>
                  <span className="text-xl font-black text-slate-900">₺{calculateCartTotal().toLocaleString('tr-TR')}</span>
                </div>

                {checkoutSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    Sipariş başarıyla alındı! GİB e-Fatura oluşturuldu ve esnaf kasasına aktarıldı.
                  </div>
                )}

                <button
                  onClick={handleExecuteCheckout}
                  disabled={checkoutSuccess}
                  className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Doğrudan Esnaf POS ile Öde & Siparişi Tamamla
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* QUICK ADD MODAL (Varyant / Beden / Toptan Miktar) */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-6 relative">
            <button 
              onClick={() => setActiveModalProduct(null)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex gap-4 items-center">
              <img src={activeModalProduct.image} alt={activeModalProduct.title} className="w-20 h-20 object-cover rounded-2xl border" />
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{activeModalProduct.storeName}</span>
                <h3 className="text-base font-black text-slate-900 leading-snug">{activeModalProduct.title}</h3>
                <span className="text-lg font-black text-slate-900 block">₺{activeModalProduct.price.toLocaleString('tr-TR')}</span>
              </div>
            </div>

            {/* Beden / Varyant */}
            {activeModalProduct.variants?.sizes && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Seçenek / Beden:</span>
                <div className="flex flex-wrap gap-2">
                  {activeModalProduct.variants.sizes.map(s => (
                    <button
                      key={s}
                      onClick={() => setModalSize(s)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${modalSize === s ? 'bg-indigo-900 text-white border-indigo-900' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Miktar (Toptan MOQ) */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Sipariş Miktarı (Adet / Koli):</span>
              <div className="flex items-center gap-4">
                <input 
                  type="number"
                  min={activeModalProduct.moq || 1}
                  value={modalQty}
                  onChange={(e) => setModalQty(Math.max(activeModalProduct.moq || 1, parseInt(e.target.value) || 1))}
                  className="w-24 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-sm outline-none"
                />
                <span className="text-xs text-slate-500">
                  Birim Fiyat: <strong className="text-slate-900">₺{getEffectiveUnitPrice(activeModalProduct, modalQty).toLocaleString('tr-TR')}</strong>
                </span>
              </div>
            </div>

            <button
              onClick={handleAddToCartFromModal}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Sepete Ekle (₺{(getEffectiveUnitPrice(activeModalProduct, modalQty) * modalQty).toLocaleString('tr-TR')})
            </button>
          </div>
        </div>
      )}

      {/* 8. TAMTEKLİF SİHİRBAZI MODAL */}
      <TamTeklifWizardModal
        isOpen={isTamTeklifModalOpen}
        onClose={() => setIsTamTeklifModalOpen(false)}
        defaultCategoryId={tamTeklifCategory}
      />

    </div>
  );
}
