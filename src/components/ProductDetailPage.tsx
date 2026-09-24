/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Share2, Star, ShieldCheck, Truck, RotateCcw, 
  Store, MessageCircle, Phone, MapPin, Check, Plus, Minus,
  ThumbsUp, UserCheck, ChevronRight, AlertCircle, ShoppingBag, Clock, Navigation, Zap,
  Download, Video, Calendar, FileCode, CheckCircle2, Copy, ExternalLink, X, Sparkles, CreditCard, Lock,
  Upload, Trash2, Scale, FileText, Utensils, Image as ImageIcon,
  Layers, Award, MessageSquare, Send
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { initialProducts, initialTenants, Product } from '../data/mockData';
import { SAMPLE_PRODUCTS } from './SuperMallHome';
import { 
  saveDigitalPurchaseRecord, 
  triggerBrowserDownload, 
  saveOnlineAppointmentRecord,
  OnlineAppointmentRecord 
} from '../data/digitalAndSessionData';
import { HybridOrder, initialHybridOrders } from '../data/hybridCommerceData';
import { applyPageSEO } from '../utils/seo';

export default function ProductDetailPage({ slug, onBackToMarketplace }: { slug?: string; onBackToMarketplace?: () => void }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  // 1. Search in localStorage or fallback to initialProducts
  const [allProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('tampazar_products');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        const missing = initialProducts.filter(ip => !parsed.some(p => p.id === ip.id || p.slug === ip.slug));
        return [...parsed, ...missing];
      }
    } catch {}
    return initialProducts;
  });

  const foundProduct = allProducts.find(p => p.slug === slug || p.id === slug) || initialProducts.find(p => p.slug === slug || p.id === slug);
  
  // 2. If not found, search in SAMPLE_PRODUCTS (services, emergency, wholesale, food)
  const foundSampleService = !foundProduct ? SAMPLE_PRODUCTS.find(s => s.slug === slug || s.id === slug) : null;

  // Dinamik Kurumsal SEO, GEO & Schema.org Enjeksiyonu
  useEffect(() => {
    if (foundSampleService) {
      applyPageSEO({
        pathname: `/urun/${foundSampleService.slug}`,
        product: {
          title: foundSampleService.title,
          slug: foundSampleService.slug,
          price: foundSampleService.price,
          category: foundSampleService.category,
          images: [foundSampleService.image],
          rating: foundSampleService.store.rating,
          reviewCount: foundSampleService.store.reviewCount,
          sector: foundSampleService.sector,
          pillar: (foundSampleService.sector === 'EMERGENCY' || foundSampleService.sector === 'SERVICE') ? 'tamusta' : 'tamhizli',
          store: {
            name: foundSampleService.store.name,
            slug: foundSampleService.store.slug,
            city: foundSampleService.store.city,
            district: foundSampleService.store.district,
            phone: foundSampleService.store.phone,
            whatsapp: foundSampleService.store.whatsapp,
            rating: foundSampleService.store.rating,
            reviewCount: foundSampleService.store.reviewCount,
          },
          lat: foundSampleService.lat,
          lng: foundSampleService.lng,
          isEmergency247: foundSampleService.isEmergency247,
          etaMinutes: foundSampleService.etaMinutes,
          serviceDuration: foundSampleService.serviceDuration
        }
      });
    } else if (foundProduct) {
      const isDigitalProd = foundProduct.type === 'digital' || foundProduct.deliveryOptions?.type === 'digital_download' || foundProduct.fulfillment?.pillar === 'tamdijital';
      const isSessionProd = foundProduct.type === 'consultation' || foundProduct.deliveryOptions?.type === 'online_session' || foundProduct.fulfillment?.pillar === 'tamseans';

      applyPageSEO({
        pathname: `/urun/${foundProduct.slug}`,
        product: {
          title: foundProduct.title,
          slug: foundProduct.slug,
          description: foundProduct.description,
          price: foundProduct.price,
          category: foundProduct.category,
          categorySlug: foundProduct.categorySlug,
          sku: foundProduct.sku,
          images: [foundProduct.image],
          rating: foundProduct.rating,
          reviewCount: foundProduct.salesCount,
          pillar: isDigitalProd ? 'tamdijital' : isSessionProd ? 'tamseans' : 'tamkargo',
          store: {
            name: foundProduct.storeName || 'TamPazar Doğrulanmış Mağaza',
            slug: foundProduct.tenantId,
            city: 'Ordu',
            district: 'Altınordu'
          },
          digitalFormats: foundProduct.deliveryOptions?.digitalFormats || foundProduct.fulfillment?.digitalFormats,
          digitalFileName: foundProduct.deliveryOptions?.digitalFileName || foundProduct.fulfillment?.fileName,
          digitalFileSize: foundProduct.deliveryOptions?.digitalFileSize || foundProduct.fulfillment?.fileSize,
          licenseType: foundProduct.deliveryOptions?.licenseType || foundProduct.fulfillment?.licenseType,
          sessionDurationMin: foundProduct.deliveryOptions?.sessionDurationMin || foundProduct.fulfillment?.sessionDurationMin,
          expertTitle: foundProduct.deliveryOptions?.expertTitle,
          meetingLink: foundProduct.deliveryOptions?.meetingLink
        }
      });
    }
  }, [foundSampleService, foundProduct]);

  const [callRequested, setCallRequested] = useState(false);
  const [whatsappRequested, setWhatsappRequested] = useState(false);

  if (!foundProduct && !foundSampleService) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center font-sans">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full space-y-4">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto font-bold text-2xl border border-rose-100">
            !
          </div>
          <h2 className="text-xl font-black text-slate-900">Ürün veya Hizmet Bulunamadı</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Aradığınız ürün, acil çağrı veya esnaf hizmeti ({slug}) sistemimizde kayıtlı değil veya yayından kaldırılmış olabilir.
          </p>
          <button
            onClick={onBackToMarketplace}
            className="w-full py-3 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow"
          >
            ← Ana Vitrine Geri Dön
          </button>
        </div>
      </div>
    );
  }

  // If foundSampleService is present (Service / Emergency / Wholesale / Food)
  if (foundSampleService) {

    return (
      <div className="min-h-screen bg-[#f8f9fa] text-slate-800 pb-20 font-sans">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span onClick={onBackToMarketplace} className="hover:text-indigo-900 font-semibold cursor-pointer">Ana Sayfa</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-amber-600 font-bold">{foundSampleService.category}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-800 font-bold truncate max-w-[220px]">{foundSampleService.title}</span>
            </div>
            <button
              onClick={onBackToMarketplace}
              className="px-3 py-1.5 bg-slate-900 hover:bg-indigo-950 text-white font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              ← Vitrine Geri Dön
            </button>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Image & Service Badge */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative h-80 md:h-[420px] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                <img 
                  src={foundSampleService.image} 
                  alt={`${foundSampleService.title} - TamPazar`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-amber-500 text-slate-950 px-3 py-1.5 rounded-xl font-black text-xs shadow-lg flex items-center gap-1.5">
                  <Zap className="w-4 h-4 fill-slate-950" />
                  {foundSampleService.sector === 'EMERGENCY' ? '7/24 Acil Müdahale' : 'Doğrulanmış Esnaf Hizmeti'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-indigo-600 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Ortalama Varış / Süre</span>
                    <span className="text-slate-800">{foundSampleService.etaMinutes || foundSampleService.serviceDuration || 'Anında / 30 Dk'}</span>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-2.5">
                  <MapPin className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Hizmet Bölgesi</span>
                    <span className="text-slate-800">{foundSampleService.store.district} / {foundSampleService.store.city}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Service Action & Details Panel */}
            <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-50 text-indigo-900 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100">
                    {foundSampleService.category}
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Esnaf Güvence Garantisi
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                  {foundSampleService.title}
                </h1>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="text-slate-800">{foundSampleService.store.rating}</span>
                    <span className="text-slate-400 font-normal">({foundSampleService.store.reviewCount} Değerlendirme)</span>
                  </div>
                  <span>•</span>
                  <span className="text-indigo-600 font-semibold">{foundSampleService.store.name}</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 font-bold block">Taban Hizmet / Servis Bedeli</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-slate-900">₺{foundSampleService.price.toLocaleString('tr-TR')}</span>
                    <span className="text-xs text-slate-500 font-medium">+ KDV (%{foundSampleService.vatRate}) · Malzeme ve İşçilik Dahil</span>
                  </div>
                  <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                    Bu hizmet doğrudan esnafın kendi kasasına aktarılır. Komisyon kesintisi yoktur. Yerinde keşif ve acil çağrı için hemen iletişime geçebilirsiniz.
                  </p>
                </div>
              </div>

              {/* Action Buttons for Service / Emergency */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={`tel:${foundSampleService.store.phone}`}
                    onClick={() => setCallRequested(true)}
                    className="py-3.5 px-4 bg-indigo-900 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-amber-400" />
                    Doğrudan Ara ({foundSampleService.store.phone})
                  </a>

                  <a
                    href={`https://wa.me/${foundSampleService.store.whatsapp}?text=Merhaba%2C+${encodeURIComponent(foundSampleService.title)}+hizmeti+için+bilgi+almak+istiyorum.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setWhatsappRequested(true)}
                    className="py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp İle Hızlı Çağrı
                  </a>
                </div>

                {callRequested && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold animate-fade-in flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    Arama bağlantısı başlatıldı. Esnaf ekibi anında çağrınıza yanıt verecektir.
                  </div>
                )}

                {whatsappRequested && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold animate-fade-in flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    WhatsApp sohbeti açıldı. Konumunuzu ve talebinizi iletebilirsiniz.
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Standard Product View if foundProduct is present
  const tenant = initialTenants.find(t => t.id === foundProduct?.tenantId) || initialTenants[0];

  const product = {
    id: foundProduct!.id,
    slug: foundProduct!.slug,
    title: foundProduct!.title,
    tag: foundProduct!.badge || 'TamPazar Ürünü',
    description: foundProduct!.description,
    price: foundProduct!.price,
    originalPrice: Math.round(foundProduct!.price * 1.2),
    vatRate: foundProduct!.vatRate,
    rating: foundProduct!.rating || 4.8,
    reviewCount: foundProduct!.salesCount ? Math.max(12, Math.floor(foundProduct!.salesCount / 3)) : 24,
    favoriteCount: 340,
    images: [
      foundProduct!.image,
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=900&auto=format&fit=crop&q=80',
    ],
    sizes: foundProduct!.variants?.sizes || ['Standart', 'Özel Ölçü'],
    colors: foundProduct!.variants?.colors?.map(c => ({ name: c, hex: '#333333' })) || [{ name: 'Standart', hex: '#333333' }],
    store: {
      name: foundProduct!.storeName || tenant.name,
      slug: tenant.slug,
      rating: tenant.rating || 4.9,
      followerCount: tenant.reviews ? tenant.reviews * 10 : 1250,
      address: 'Ordu / Altınordu (Fiziksel Doğrulanmış Esnaf Mağazası)',
      phone: '+90 (452) 222 33 44',
      whatsapp: '905321112233',
      paymentProvider: tenant.byoPosConnected ? `Doğrudan ${tenant.activePos?.toUpperCase() || 'Sanal'} POS` : 'TamPazar Güvencesi',
      isPhysicalVerified: true,
    },
    reviews: [
      {
        id: 'rev-1',
        author: 'Emre K.',
        rating: 5,
        date: '18 Eylül 2026',
        sizeBought: 'Seçilen Varyant',
        colorBought: 'Standart',
        comment: 'Ürün kalitesi muazzam. Doğrudan esnaf kasasından faturalı ve hızlı bir şekilde kargolandı.',
        likes: 14,
      }
    ]
  };

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(product.favoriteCount);
  const [isFollowingStore, setIsFollowingStore] = useState(false);
  const [followerCount, setFollowerCount] = useState(product.store.followerCount);
  const [addedToCart, setAddedToCart] = useState(false);

  // --- DİNAMİK ÖLÇÜ BİRİMİ & ÖZELLEŞTİRME MOTORU STATE'LERİ ---
  const customization = foundProduct?.customizationOptions;
  const measurement = customization?.measurement;
  const foodConfig = customization?.foodCustomization;
  const fileUploadConfig = customization?.fileUpload;
  const customFormConfig = customization?.customForm;

  // 1. Ölçü Birimi / Gramaj / Adet State
  const [selectedWeightOrQty, setSelectedWeightOrQty] = useState<number>(() => {
    return measurement?.minQuantity || 1;
  });

  // 2. Yemek Malzeme Seçimi State
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [extraIngredients, setExtraIngredients] = useState<string[]>([]);
  const [selectedMandatoryOptions, setSelectedMandatoryOptions] = useState<{ [groupId: string]: string }>(() => {
    const defaults: { [groupId: string]: string } = {};
    foodConfig?.mandatoryGroups?.forEach(grp => {
      if (grp.options.length > 0) {
        defaults[grp.id] = grp.options[0].id;
      }
    });
    return defaults;
  });

  // 3. Fotoğraf / Dosya Yükleme State
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string; previewUrl?: string }[]>([]);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 4. Dinamik Form Alanları State
  const [customFormValues, setCustomFormValues] = useState<{ [fieldId: string]: string }>({});
  const [showFormErrors, setShowFormErrors] = useState(false);
  const [orderSuccessDetails, setOrderSuccessDetails] = useState<string | null>(null);

  // 5. TRENDYOL & GETİR MODELİ: Teslimat Saati & Kasap/Şarküteri Kesim Stili
  const [deliverySlot, setDeliverySlot] = useState<string>('⚡ Hemen Teslimat (30-45 Dk)');
  const [butcherCutStyle, setButcherCutStyle] = useState<string>('Kuşbaşı Doğranmış');

  // 6. ETSY MODELİ: Canlı Kişiselleştirme & Atölyeye Soru Sor
  const [liveCustomText, setLiveCustomText] = useState<string>('');
  const [liveGiftNote, setLiveGiftNote] = useState<string>('');
  const [showArtisanQuestionModal, setShowArtisanQuestionModal] = useState(false);
  const [artisanQuestionText, setArtisanQuestionText] = useState('');
  const [artisanQuestionSent, setArtisanQuestionSent] = useState(false);

  // 7. AMAZON MODELİ: Çapraz Satış ("Mahallede Birlikte İyi Gider")
  const [bundleItemsSelected, setBundleItemsSelected] = useState<{ [key: string]: boolean }>({
    main: true,
    item1: true,
    item2: true
  });
  const [bundleAddedSuccess, setBundleAddedSuccess] = useState(false);

  // 8. ALIBABA MODELİ: Numune Talep Et Modalı
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [sampleName, setSampleName] = useState(user?.name || 'Cemre Demir');
  const [samplePhone, setSamplePhone] = useState(user?.phone || '0532 444 55 66');
  const [sampleAddress, setSampleAddress] = useState('Akyazı Mah. Sahil Cad. No: 14 D: 3, Altınordu / Ordu');
  const [sampleRequestedSuccess, setSampleRequestedSuccess] = useState(false);

  // File Upload Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setFileUploadError(null);

    const maxCount = fileUploadConfig?.maxFiles || 100;
    if (uploadedFiles.length + files.length > maxCount) {
      setFileUploadError(`En fazla ${maxCount} adet dosya yükleyebilirsiniz.`);
      return;
    }

    const newUploaded = files.map(file => {
      const isImg = file.type.startsWith('image/');
      return {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        previewUrl: isImg ? URL.createObjectURL(file) : undefined
      };
    });

    setUploadedFiles(prev => [...prev, ...newUploaded]);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Dinamik Fiyat Hesaplaması
  const extraIngredientsCost = (foodConfig?.extraIngredients || [])
    .filter(ext => extraIngredients.includes(ext.id))
    .reduce((sum, ext) => sum + ext.price, 0);

  const mandatoryOptionsCost = (foodConfig?.mandatoryGroups || []).reduce((sum, grp) => {
    const selectedOptId = selectedMandatoryOptions[grp.id];
    const opt = grp.options.find(o => o.id === selectedOptId);
    return sum + (opt?.priceDiff || 0);
  }, 0);

  const baseCalculatedUnitPrice = (foundProduct?.price || product.price) + extraIngredientsCost + mandatoryOptionsCost;

  const dynamicTotalPrice = measurement?.unit === 'kg' || measurement?.unit === 'gram'
    ? Math.round(baseCalculatedUnitPrice * selectedWeightOrQty * 100) / 100
    : Math.round(baseCalculatedUnitPrice * selectedWeightOrQty);

  const isDigital = foundProduct?.type === 'digital' || foundProduct?.deliveryOptions?.type === 'digital_download' || foundProduct?.fulfillment?.pillar === 'tamdijital';
  const isSession = foundProduct?.type === 'consultation' || foundProduct?.deliveryOptions?.type === 'online_session' || foundProduct?.fulfillment?.pillar === 'tamseans';

  // Digital checkout state
  const [showDigitalModal, setShowDigitalModal] = useState(false);
  const [digitalBuyerName, setDigitalBuyerName] = useState(user?.name || 'Cemre Demir');
  const [digitalBuyerEmail, setDigitalBuyerEmail] = useState(user?.email || 'cemre.demir@example.com');
  const [digitalBuyerPhone, setDigitalBuyerPhone] = useState(user?.phone || '0532 444 55 66');
  const [digitalPurchaseComplete, setDigitalPurchaseComplete] = useState(false);
  const [digitalPurchasedFileName, setDigitalPurchasedFileName] = useState('');

  // Session booking state
  const sessionDays = ['Bugün (24 Eylül)', 'Yarın (25 Eylül)', '26 Eylül Cuma', '29 Eylül Pazartesi', '30 Eylül Salı'];
  const sessionSlots = foundProduct?.bookingSlots || foundProduct?.deliveryOptions?.availableHours?.map(h => `${h} - ${parseInt(h.split(':')[0]) + 1}:00`) || ['10:00 - 10:45', '11:30 - 12:15', '14:00 - 14:45', '15:30 - 16:15', '17:00 - 17:45'];
  const [selectedSessionDay, setSelectedSessionDay] = useState(sessionDays[0]);
  const [selectedSessionSlot, setSelectedSessionSlot] = useState(sessionSlots[0]);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionBuyerName, setSessionBuyerName] = useState(user?.name || 'Cemre Demir');
  const [sessionBuyerPhone, setSessionBuyerPhone] = useState(user?.phone || '0532 444 55 66');
  const [sessionBuyerEmail, setSessionBuyerEmail] = useState(user?.email || 'cemre.demir@example.com');
  const [sessionBuyerNotes, setSessionBuyerNotes] = useState('');
  const [sessionBookedSuccess, setSessionBookedSuccess] = useState<OnlineAppointmentRecord | null>(null);

  const handleCompleteDigitalPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const fileName = foundProduct?.deliveryOptions?.digitalFileName || foundProduct?.fulfillment?.fileName || `${product.slug}_dosya.zip`;
    const formatTags = foundProduct?.deliveryOptions?.digitalFormats || foundProduct?.fulfillment?.digitalFormats || ['ZIP', 'PDF'];
    const fileSize = foundProduct?.deliveryOptions?.digitalFileSize || foundProduct?.fulfillment?.fileSize || '18.4 MB';
    const licenseType = foundProduct?.deliveryOptions?.licenseType || foundProduct?.fulfillment?.licenseType || 'commercial';

    saveDigitalPurchaseRecord({
      productId: product.id,
      productTitle: product.title,
      productImage: product.images[0],
      storeName: product.store.name,
      orderId: `TPZ-DIG-${Date.now().toString().slice(-6)}`,
      purchasedAt: 'Bugün (' + new Date().toLocaleDateString('tr-TR') + ')',
      fileName: fileName,
      fileSize: fileSize,
      formatTags: formatTags,
      downloadCount: 1,
      licenseType: licenseType,
      checksum: 'SHA256: 8f9b1c2d3e4f5a6b7c8d9e0f1a2b3c4d'
    });

    setDigitalPurchasedFileName(fileName);
    triggerBrowserDownload(fileName, product.title);
    setDigitalPurchaseComplete(true);
  };

  const handleCompleteSessionBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const meetingLink = foundProduct?.deliveryOptions?.meetingLink || foundProduct?.fulfillment?.meetingLink || 'https://meet.google.com/tpz-live-seans';
    const duration = foundProduct?.deliveryOptions?.sessionDurationMin || foundProduct?.fulfillment?.sessionDurationMin || 45;

    const newAppt = saveOnlineAppointmentRecord({
      productId: product.id,
      serviceTitle: product.title,
      serviceImage: product.images[0],
      storeName: product.store.name,
      customerName: sessionBuyerName,
      customerPhone: sessionBuyerPhone,
      customerEmail: sessionBuyerEmail,
      date: selectedSessionDay,
      timeSlot: selectedSessionSlot,
      durationMin: duration,
      channel: 'google_meet',
      meetingLink: meetingLink,
      status: 'confirmed',
      notes: sessionBuyerNotes || 'TamPazar üzerinden online randevu talebi.'
    });

    setSessionBookedSuccess(newAppt);
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      setIsFavorite(false);
      setFavoriteCount(prev => prev - 1);
    } else {
      setIsFavorite(true);
      setFavoriteCount(prev => prev + 1);
    }
  };

  const toggleFollowStore = () => {
    if (isFollowingStore) {
      setIsFollowingStore(false);
      setFollowerCount(prev => prev - 1);
    } else {
      setIsFollowingStore(true);
      setFollowerCount(prev => prev + 1);
    }
  };

  const hasMissingRequiredForm = Boolean(
    customFormConfig?.enabled && customFormConfig.fields.some(
      fld => fld.required && (!customFormValues[fld.id] || customFormValues[fld.id].trim() === '')
    )
  );

  const hasMissingFiles = Boolean(
    fileUploadConfig?.enabled && fileUploadConfig.required && uploadedFiles.length < (fileUploadConfig.minFiles || 1)
  );

  const handleAddToCart = () => {
    if (hasMissingRequiredForm) {
      setShowFormErrors(true);
      return;
    }
    if (hasMissingFiles) {
      setFileUploadError(`Lütfen sipariş için en az ${fileUploadConfig?.minFiles || 1} adet dosya veya fotoğraf yükleyin.`);
      return;
    }

    try {
      const existingRaw = localStorage.getItem('tampazar_hybrid_orders');
      const ordersList: HybridOrder[] = existingRaw ? JSON.parse(existingRaw) : initialHybridOrders;

      const orderSummaryText = [
        measurement?.unit === 'kg' ? `${selectedWeightOrQty} Kg` : `${selectedWeightOrQty} Adet`,
        removedIngredients.length > 0 ? `(${removedIngredients.length} Malzeme Çıkarıldı)` : '',
        extraIngredients.length > 0 ? `(+${extraIngredients.length} Ekstra Eklendi)` : '',
        uploadedFiles.length > 0 ? `(${uploadedFiles.length} Fotoğraf Yüklendi)` : '',
        customFormConfig?.enabled ? `(Kişisel Form Dolduruldu)` : ''
      ].filter(Boolean).join(' ');

      const newOrder: HybridOrder = {
        id: `ord-user-${Date.now()}`,
        orderNumber: `TPZ-${Date.now().toString().slice(-6)}`,
        deliveryType: foundProduct?.deliveryOptions?.type === 'local_express' ? 'LOCAL_EXPRESS' : 'CARGO',
        tenantId: foundProduct?.tenantId || tenant.id,
        storeName: foundProduct?.storeName || product.store.name,
        customerName: user?.name || 'Cemre Demir',
        customerPhone: user?.phone || '+90 532 444 55 66',
        customerEmail: user?.email || 'cemre.demir@example.com',
        customerAddress: 'Bahçelievler Mah. Atatürk Bulvarı No: 28 D: 5',
        city: 'Ordu',
        district: 'Altınordu',
        items: [
          {
            productId: foundProduct?.id || product.id,
            title: foundProduct?.title || product.title,
            price: baseCalculatedUnitPrice,
            qty: selectedWeightOrQty,
            sku: foundProduct?.sku,
            variant: selectedSize ? `${selectedSize} / ${selectedColor}` : undefined,
            customization: {
              selectedWeightOrQty,
              unitLabel: measurement?.unitLabel || (measurement?.unit === 'kg' ? 'Kg' : 'Adet'),
              removedIngredients: (foodConfig?.removableIngredients || [])
                .filter(rem => removedIngredients.includes(rem.id))
                .map(rem => rem.name),
              addedIngredients: (foodConfig?.extraIngredients || [])
                .filter(ext => extraIngredients.includes(ext.id))
                .map(ext => ({ name: ext.name, price: ext.price })),
              selectedMandatoryOptions: (foodConfig?.mandatoryGroups || []).map(grp => {
                const opt = grp.options.find(o => o.id === selectedMandatoryOptions[grp.id]);
                return {
                  groupTitle: grp.title,
                  optionName: opt?.name || '',
                  priceDiff: opt?.priceDiff
                };
              }),
              uploadedFiles: uploadedFiles.map(f => ({ name: f.name, size: f.size, previewUrl: f.previewUrl })),
              customFormValues: (customFormConfig?.fields || []).map(fld => ({
                fieldLabel: fld.label,
                value: customFormValues[fld.id] || ''
              }))
            }
          }
        ],
        totalAmount: dynamicTotalPrice,
        paymentMethod: 'PAYTR_POS',
        paymentStatus: 'PAID',
        status: foundProduct?.deliveryOptions?.type === 'local_express' ? 'RINGING' : 'PREPARING',
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
      };

      localStorage.setItem('tampazar_hybrid_orders', JSON.stringify([newOrder, ...ordersList]));
      setOrderSuccessDetails(orderSummaryText);
    } catch (e) {
      console.error(e);
    }

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3500);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-800 pb-20">
      
      {/* 1. ÜST KATEGORİ YOLU (Breadcrumb) & GERİ DÖN */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span onClick={onBackToMarketplace} className="hover:text-indigo-900 font-semibold cursor-pointer">Ana Sayfa</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="hover:text-indigo-900 font-semibold cursor-pointer">{foundProduct!.category}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-bold truncate max-w-[200px]">{foundProduct!.title}</span>
          </div>

          <button
            onClick={onBackToMarketplace}
            className="px-3 py-1.5 bg-slate-900 hover:bg-indigo-950 text-white font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            ← Vitrine / Alışverişe Geri Dön
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        {/* ========================================================= */}
        {/* 2. ANA ÜRÜN BLOĞU (Görseller + Satın Alma Paneli) */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* SOL: GÖRSEL GALERİSİ (5 Kolon) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Büyük Ana Görsel */}
            <div className="relative h-96 md:h-[480px] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group">
              <img 
                src={product.images[selectedImage]} 
                alt={`${product.title} - TamPazar`} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <button 
                onClick={toggleFavorite}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md hover:bg-white transition cursor-pointer text-slate-700"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'text-rose-600 fill-rose-600' : 'text-slate-600'}`} />
              </button>
              <div className="absolute top-4 left-4 bg-amber-500 text-slate-950 px-3 py-1 rounded-xl font-black text-xs shadow">
                {product.tag}
              </div>
            </div>

            {/* Küçük Thumbnail Listesi */}
            <div className="grid grid-cols-3 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative h-24 rounded-xl overflow-hidden border-2 transition cursor-pointer ${selectedImage === idx ? 'border-indigo-900 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <img src={img} alt={`${product.title} Görsel ${idx + 1} - TamPazar`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* SAĞ: ÜRÜN BİLGİLERİ VE SATIN ALMA (7 Kolon) */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Kategori ve Değerlendirme & Özel Rozet */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-50 text-indigo-900 px-3 py-1 rounded-full font-bold border border-indigo-100">
                    {foundProduct!.category}
                  </span>
                  {isDigital && (
                    <span className="bg-purple-700 text-white px-3 py-1 rounded-full font-black flex items-center gap-1 shadow-xs">
                      <Download className="w-3 h-3" /> Anında Dijital İndirme
                    </span>
                  )}
                  {isSession && (
                    <span className="bg-cyan-600 text-white px-3 py-1 rounded-full font-black flex items-center gap-1 shadow-xs">
                      <Video className="w-3 h-3" /> Uzaktan Canlı Seans
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="text-slate-900">{product.rating}</span>
                  <span className="text-slate-400 font-normal">({product.reviewCount} Değerlendirme)</span>
                </div>
              </div>

              {/* Ürün Başlığı */}
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {product.title}
              </h1>

              {/* Fiyat ve KDV Bandı */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-wider uppercase text-slate-400 font-bold block">
                    {isDigital ? 'Dijital Dosya Lisans Bedeli' : isSession ? 'Seans & Danışmanlık Ücreti' : 'Esnaf Doğrudan Fiyatı'}
                  </span>
                  <div className="flex items-baseline gap-3 mt-0.5">
                    <span className="text-3xl md:text-4xl font-black text-slate-900">₺{product.price.toLocaleString('tr-TR')}</span>
                    <span className="text-xs text-slate-400 line-through">₺{product.originalPrice.toLocaleString('tr-TR')}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg text-xs font-bold inline-block">
                    %0 Komisyonlu Fiyat
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1">KDV (%{product.vatRate}) Dahil</span>
                </div>
              </div>

              {/* 1. DİJİTAL ÜRÜN ÖZELLİKLERİ (TAMDİJİTAL) */}
              {isDigital && (
                <div className="bg-purple-50/70 border border-purple-200 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-purple-900 font-black text-xs">
                      <FileCode className="w-4 h-4 text-purple-600" />
                      <span>İçerik & Dosya Formatları:</span>
                    </div>
                    <span className="text-[10px] bg-purple-200 text-purple-900 px-2 py-0.5 rounded-md font-bold">
                      {foundProduct?.deliveryOptions?.licenseType === 'commercial' ? 'Ticari Üretime Uygun' : 'Kişisel Kullanım Lisansı'}
                    </span>
                  </div>

                  {/* Format Etiketleri */}
                  <div className="flex flex-wrap gap-1.5">
                    {(foundProduct?.deliveryOptions?.digitalFormats || ['DST', 'PES', 'JEF', 'DXF', 'SVG', 'PDF']).map((fmt, i) => (
                      <span key={i} className="px-2.5 py-1 bg-white border border-purple-200 text-purple-800 rounded-lg text-[11px] font-mono font-bold shadow-2xs">
                        .{fmt}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-purple-800 pt-1 border-t border-purple-100">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                      Dosya Adı: {foundProduct?.deliveryOptions?.digitalFileName || 'Tasarim_Arsivi.zip'}
                    </span>
                    <span className="font-bold">Boyut: {foundProduct?.deliveryOptions?.digitalFileSize || '18.4 MB'}</span>
                  </div>

                  <div className="text-[11px] text-purple-700 bg-white/80 p-2.5 rounded-xl border border-purple-100 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Sıfır Kargo Bekleme:</strong> Fiziki kargo adresi isteme zorunluluğu yoktur. Ödeme tamamlandığında dosya doğrudan ekranda açılır ve hesabınızdaki <em>/hesabim/dijital-arsivim</em> alanına süresiz kaydedilir.
                    </span>
                  </div>
                </div>
              )}

              {/* 2. CANLI SEANS & RANDEVU TAKVİMİ (TAMSEANS) */}
              {isSession && (
                <div className="bg-cyan-50/60 border border-cyan-200 p-4 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-cyan-950 font-black text-xs">
                      <Calendar className="w-4 h-4 text-cyan-600" />
                      <span>İnteraktif Seans & Ajanda Seçimi:</span>
                    </div>
                    <span className="text-[10px] bg-cyan-200 text-cyan-900 px-2 py-0.5 rounded-md font-bold">
                      {foundProduct?.deliveryOptions?.sessionDurationMin || 45} Dakika · Google Meet HD
                    </span>
                  </div>

                  {/* Gün Seçimi */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1.5">Görüşme Günü Seçin:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {sessionDays.slice(0, 3).map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => setSelectedSessionDay(day)}
                          className={`py-2 px-2.5 text-xs font-bold rounded-xl border transition cursor-pointer text-center ${
                            selectedSessionDay === day
                              ? 'bg-cyan-700 text-white border-cyan-700 shadow-sm'
                              : 'bg-white text-slate-700 border-cyan-100 hover:border-cyan-300'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Saat Seçimi */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1.5">Müsait Saat Dilimi:</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {sessionSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSessionSlot(slot)}
                          className={`py-1.5 px-2 text-[11px] font-bold rounded-lg border transition cursor-pointer text-center ${
                            selectedSessionSlot === slot
                              ? 'bg-cyan-700 text-white border-cyan-700 shadow-sm'
                              : 'bg-white text-slate-700 border-cyan-100 hover:border-cyan-300'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Seans Notu */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Ön Görüşme Notunuz (İsteğe Bağlı):</label>
                    <input
                      type="text"
                      value={sessionBuyerNotes}
                      onChange={(e) => setSessionBuyerNotes(e.target.value)}
                      placeholder="Görüşmek istediğiniz ana konu veya sorular..."
                      className="w-full text-xs p-2.5 rounded-xl border border-cyan-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              )}

              {/* 3. DİNAMİK ÖLÇÜ BİRİMİ, YEMEK MALZEMELERİ, DOSYA YÜKLEME VE KİŞİYE ÖZEL FORM MOTORU */}
              {customization && (
                <div className="space-y-4 pt-2 border-t border-slate-200">
                  
                  {/* A) ÖLÇÜ BİRİMİ / TARTILI ÜRÜN STEPPER */}
                  {measurement && (
                    <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-2xl space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-amber-950 text-xs">
                          <Scale className="w-4 h-4 text-amber-600" />
                          <span>Miktar & Tartı Seçimi:</span>
                          <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-black">
                            Birim: {measurement.unitLabel || measurement.unit.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-xs font-black text-amber-900">
                          ₺{(foundProduct?.price || product.price)} / {measurement.unitLabel || measurement.unit}
                        </div>
                      </div>

                      {/* Tartılı Stepper (+/-) */}
                      <div className="flex items-center justify-between gap-3 bg-white p-2 rounded-xl border border-amber-200">
                        <span className="text-xs text-slate-600 font-semibold pl-1">Seçilen Ağırlık / Adet:</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const step = measurement.stepQuantity || (measurement.unit === 'kg' ? 0.5 : 1);
                              const min = measurement.minQuantity || step;
                              setSelectedWeightOrQty(prev => Math.max(min, Math.round((prev - step) * 100) / 100));
                            }}
                            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-black flex items-center justify-center transition cursor-pointer"
                            title="Azalt"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm font-black text-slate-900 min-w-16 text-center">
                            {selectedWeightOrQty} {measurement.unitLabel || measurement.unit}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const step = measurement.stepQuantity || (measurement.unit === 'kg' ? 0.5 : 1);
                              setSelectedWeightOrQty(prev => Math.round((prev + step) * 100) / 100);
                            }}
                            className="w-8 h-8 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center justify-center transition cursor-pointer"
                            title="Artır"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Hızlı Tartı Önayarları */}
                      {measurement.unit === 'kg' && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-amber-800 font-bold">Hızlı Seçim:</span>
                          {[0.5, 1, 1.5, 2, 3, 5].map((w) => (
                            <button
                              key={w}
                              type="button"
                              onClick={() => setSelectedWeightOrQty(w)}
                              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                                selectedWeightOrQty === w 
                                  ? 'bg-amber-800 text-white border-amber-800 shadow-2xs' 
                                  : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100'
                              }`}
                            >
                              {w} Kg
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* B) YEMEK & RESTORAN MALZEME SEÇİCİ (YEMEKSEPETİ / DÖNER MODELİ) */}
                  {foodConfig?.enabled && (
                    <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-4 shadow-2xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs border-b border-slate-100 pb-2">
                        <Utensils className="w-4 h-4 text-rose-600" />
                        <span>Döner / Restoran Malzeme Tercihleri</span>
                      </div>

                      {/* 1. İstemediğiniz Malzemeler (Çıkarma) */}
                      {foodConfig.removableIngredients && foodConfig.removableIngredients.length > 0 && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700 block">
                            İstemediğiniz Malzemeleri Çıkarın (Ücretsiz):
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {foodConfig.removableIngredients.map((ing) => {
                              const isRemoved = removedIngredients.includes(ing.id);
                              return (
                                <button
                                  key={ing.id}
                                  type="button"
                                  onClick={() => {
                                    setRemovedIngredients(prev => 
                                      isRemoved ? prev.filter(id => id !== ing.id) : [...prev, ing.id]
                                    );
                                  }}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                                    isRemoved
                                      ? 'bg-rose-50 text-rose-700 border-rose-300 line-through'
                                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                                  }`}
                                >
                                  {isRemoved ? '🚫' : '✓'} {isRemoved ? `${ing.name}suz` : ing.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 2. Ekstra Malzemeler & Soslar (+Ücretli) */}
                      {foodConfig.extraIngredients && foodConfig.extraIngredients.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <label className="text-xs font-bold text-slate-700 block">
                            Ekstra Lezzetler & Soslar:
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {foodConfig.extraIngredients.map((ext) => {
                              const isSelected = extraIngredients.includes(ext.id);
                              return (
                                <button
                                  key={ext.id}
                                  type="button"
                                  onClick={() => {
                                    setExtraIngredients(prev =>
                                      isSelected ? prev.filter(id => id !== ext.id) : [...prev, ext.id]
                                    );
                                  }}
                                  className={`p-2.5 rounded-xl text-xs font-bold text-left transition flex items-center justify-between border cursor-pointer ${
                                    isSelected
                                      ? 'bg-emerald-50 text-emerald-900 border-emerald-500 shadow-2xs'
                                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${isSelected ? 'bg-emerald-600 text-white' : 'border border-slate-300'}`}>
                                      {isSelected ? '✓' : '+'}
                                    </span>
                                    <span>{ext.name}</span>
                                  </div>
                                  <span className="text-emerald-700 font-black">+{ext.price} ₺</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 3. Zorunlu Seçim Grupları (Acı, İçecek vb.) */}
                      {foodConfig.mandatoryGroups && foodConfig.mandatoryGroups.map((grp) => (
                        <div key={grp.id} className="space-y-1.5 pt-1 border-t border-slate-100">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-700">
                              {grp.title} {grp.required && <span className="text-rose-500">*</span>}
                            </label>
                            {grp.required && (
                              <span className="text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.2 rounded font-semibold">Zorunlu</span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {grp.options.map((opt) => {
                              const isSelected = selectedMandatoryOptions[grp.id] === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedMandatoryOptions(prev => ({ ...prev, [grp.id]: opt.id }));
                                  }}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                                    isSelected
                                      ? 'bg-indigo-900 text-white border-indigo-900 shadow-2xs'
                                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                                  }`}
                                >
                                  {opt.name} {opt.priceDiff ? `(+${opt.priceDiff} ₺)` : ''}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* C) FOTOĞRAF BASKI & DOSYA YÜKLEME ALANI */}
                  {fileUploadConfig?.enabled && (
                    <div className="bg-indigo-50/70 border border-indigo-200 p-4 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-indigo-950 text-xs">
                          <ImageIcon className="w-4 h-4 text-indigo-600" />
                          <span>{fileUploadConfig.title || 'Baskı Fotoğraflarınızı Yükleyin'}</span>
                        </div>
                        {fileUploadConfig.required && (
                          <span className="text-[10px] bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded font-bold">
                            Zorunlu (Min. {fileUploadConfig.minFiles || 1} Dosya)
                          </span>
                        )}
                      </div>

                      {fileUploadConfig.description && (
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {fileUploadConfig.description}
                        </p>
                      )}

                      {/* Gizli File Input & Sürükle-Bırak Tetikleyici */}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        multiple 
                        accept={fileUploadConfig.allowedFormats.map(f => `.${f.toLowerCase()}`).join(',')}
                        className="hidden" 
                      />

                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-indigo-300 hover:border-indigo-500 rounded-xl p-4 bg-white text-center cursor-pointer transition group"
                      >
                        <Upload className="w-6 h-6 text-indigo-500 mx-auto mb-1 group-hover:scale-110 transition" />
                        <span className="text-xs font-bold text-indigo-900 block">
                          Fotoğraf / Dosyaları Seçin veya Sürükleyin
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Formatlar: {fileUploadConfig.allowedFormats.join(', ')} · Maks: {fileUploadConfig.maxSizeMB || 100} MB
                        </span>
                      </div>

                      {fileUploadError && (
                        <div className="text-[11px] text-rose-600 font-semibold bg-rose-50 p-2 rounded-lg border border-rose-200 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {fileUploadError}
                        </div>
                      )}

                      {/* Yüklenen Dosyalar Önizleme Listesi */}
                      {uploadedFiles.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[11px] font-bold text-indigo-900 block">
                            Yüklenen Fotoğraflar ({uploadedFiles.length} Adet):
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {uploadedFiles.map((file, idx) => (
                              <div key={idx} className="bg-white p-2 rounded-xl border border-indigo-100 flex items-center justify-between shadow-2xs gap-2">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  {file.previewUrl ? (
                                    <img src={file.previewUrl} alt={file.name} className="w-8 h-8 rounded object-cover shrink-0" />
                                  ) : (
                                    <div className="w-8 h-8 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                                      ZIP
                                    </div>
                                  )}
                                  <div className="truncate text-left">
                                    <p className="text-[10px] font-bold text-slate-800 truncate" title={file.name}>{file.name}</p>
                                    <p className="text-[9px] text-slate-400">{file.size}</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveFile(idx);
                                  }}
                                  className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                                  title="Kaldır"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* D) MATBAA, DAVETİYE, LAZER & KİŞİYE ÖZEL FORM SİHİRBAZI */}
                  {customFormConfig?.enabled && (
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                          <FileText className="w-4 h-4 text-amber-600" />
                          <span>{customFormConfig.title || 'Kişiye Özel Baskı / Davetiye Formu'}</span>
                        </div>
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                          Ön Prova Onaylı
                        </span>
                      </div>

                      {customFormConfig.description && (
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {customFormConfig.description}
                        </p>
                      )}

                      {/* Dinamik Form Alanları */}
                      <div className="space-y-2.5 pt-1">
                        {customFormConfig.fields.map((fld) => {
                          const val = customFormValues[fld.id] || '';
                          const isInvalid = showFormErrors && fld.required && !val.trim();

                          return (
                            <div key={fld.id} className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                                <span>{fld.label} {fld.required && <span className="text-rose-500">*</span>}</span>
                                {fld.required && <span className="text-[9px] text-slate-400">Zorunlu</span>}
                              </label>

                              {fld.type === 'textarea' ? (
                                <textarea
                                  rows={2}
                                  value={val}
                                  onChange={(e) => setCustomFormValues(prev => ({ ...prev, [fld.id]: e.target.value }))}
                                  placeholder={fld.placeholder || ''}
                                  className={`w-full text-xs p-2 rounded-xl border bg-white outline-none transition ${
                                    isInvalid ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-200 focus:border-indigo-600'
                                  }`}
                                />
                              ) : (
                                <input
                                  type={fld.type === 'number' ? 'number' : fld.type === 'date' ? 'date' : 'text'}
                                  value={val}
                                  onChange={(e) => setCustomFormValues(prev => ({ ...prev, [fld.id]: e.target.value }))}
                                  placeholder={fld.placeholder || ''}
                                  className={`w-full text-xs p-2 rounded-xl border bg-white outline-none transition ${
                                    isInvalid ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' : 'border-slate-200 focus:border-indigo-600'
                                  }`}
                                />
                              )}

                              {isInvalid && (
                                <p className="text-[10px] text-rose-600 font-semibold">Lütfen bu alanı doldurunuz.</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* E) CANLI KİŞİSELLEŞTİRME & LAZER BASKI KUTUSU */}
                  <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-amber-950 text-xs">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span>Canlı Kişiselleştirme & Zanaatkar Notu</span>
                      </div>
                      <span className="text-[10px] bg-amber-200 text-amber-950 px-2 py-0.5 rounded font-black">
                        Lazer / El İşçiliği
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between mb-1">
                          <span>Üzerine Yazılacak İsim / Özel Metin:</span>
                          <span className="text-[10px] text-slate-400 font-mono">{liveCustomText.length}/40</span>
                        </label>
                        <input
                          type="text"
                          maxLength={40}
                          value={liveCustomText}
                          onChange={(e) => setLiveCustomText(e.target.value)}
                          placeholder="Örn: Ahmet & Zeynep 2026 / Canım Anneme..."
                          className="w-full text-xs p-2.5 rounded-xl border border-amber-300 bg-white outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-800"
                        />
                      </div>

                      {liveCustomText && (
                        <div className="p-2 bg-amber-100/70 border border-amber-300 rounded-xl flex items-center justify-between text-xs">
                          <span className="text-[11px] text-amber-900 font-semibold">Canlı Ürün Önizlemesi:</span>
                          <span className="font-serif italic font-black text-amber-950 bg-white px-2.5 py-1 rounded-lg border border-amber-300 shadow-2xs">
                            "{liveCustomText}"
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* F) TRENDYOL & GETİR MODELİ: KASAP / ŞARKÜTERİ KESİM STİLİ */}
                  {(foundProduct?.categorySlug === 'toptan-gida' || foundProduct?.category.toLowerCase().includes('kasap') || foundProduct?.category.toLowerCase().includes('et') || foundProduct?.title.toLowerCase().includes('et') || foundProduct?.title.toLowerCase().includes('döner')) && (
                    <div className="bg-rose-50/60 border border-rose-200 p-4 rounded-2xl space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-rose-950 text-xs">
                          <Utensils className="w-4 h-4 text-rose-600" />
                          <span>Kasap Hazırlama & Kesim Tercihi</span>
                        </div>
                        <span className="text-[10px] bg-rose-200 text-rose-900 px-2 py-0.5 rounded font-black">
                          Ücretsiz Usta İşçiliği
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['Kuşbaşı Doğranmış', 'Tek Çekim Kıyma', 'Çift Çekim Kıyma', 'Bütün / Blok', 'İnce Dilimli (Antrikot/Biftek)', 'Özel Marine Soslu'].map((cut) => (
                          <button
                            key={cut}
                            type="button"
                            onClick={() => setButcherCutStyle(cut)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                              butcherCutStyle === cut
                                ? 'bg-rose-700 text-white border-rose-700 shadow-2xs'
                                : 'bg-white text-slate-700 border-rose-200 hover:border-rose-300'
                            }`}
                          >
                            {cut}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* G) KADEMELİ FİYAT SKALASI & MOQ */}
              {!isDigital && !isSession && (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      <span>Kademeli Toplu Alım İndirimi (TamPazar B2B)</span>
                    </div>
                    <span className="text-[10px] bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded font-black">
                      %0 Komisyonlu Toptan
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className={`p-2 rounded-xl border transition ${
                      selectedWeightOrQty < 10 
                        ? 'bg-amber-50 border-amber-400 font-bold shadow-2xs' 
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}>
                      <span className="text-[10px] text-slate-400 block font-semibold">1 - 9 Adet / Kg</span>
                      <span className="text-sm font-black text-slate-900 font-mono">₺{Math.round(foundProduct?.price || product.price)}</span>
                      <span className="text-[9px] text-slate-500 block">Standart Perakende</span>
                    </div>

                    <div className={`p-2 rounded-xl border transition ${
                      selectedWeightOrQty >= 10 && selectedWeightOrQty < 50 
                        ? 'bg-amber-50 border-amber-400 font-bold shadow-2xs' 
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}>
                      <span className="text-[10px] text-emerald-600 block font-bold">%20 İndirim</span>
                      <span className="text-sm font-black text-emerald-700 font-mono">₺{Math.round((foundProduct?.price || product.price) * 0.8)}</span>
                      <span className="text-[9px] text-slate-500 block">10 - 49 Adet</span>
                    </div>

                    <div className={`p-2 rounded-xl border transition ${
                      selectedWeightOrQty >= 50 
                        ? 'bg-amber-50 border-amber-400 font-bold shadow-2xs' 
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}>
                      <span className="text-[10px] text-indigo-600 block font-bold">%35 Büyük Toptan</span>
                      <span className="text-sm font-black text-indigo-950 font-mono">₺{Math.round((foundProduct?.price || product.price) * 0.65)}</span>
                      <span className="text-[9px] text-slate-500 block">50+ Adet / Koli</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-slate-500 text-[11px]">
                      MOQ: <strong>{foundProduct?.b2bMinQty || 1} Birim</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowSampleModal(true)}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>🧪 Numune Talep Et (1 Adet Test)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* H) TRENDYOL & GETİR MODELİ: TESLİMAT SAATİ SEÇİCİ */}
              {!isDigital && !isSession && (
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold text-slate-700 block">
                    Teslimat Zamanı Tercihiniz (TamHızlı Mahalle Kuryesi):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: '⚡ Hemen (30-45 Dk)', label: '⚡ Hemen (30-45 Dk)', desc: 'Sıcak & Taze Kurye' },
                      { id: 'Bugün 18:00 - 20:00', label: 'Bugün 18:00 - 20:00', desc: 'Akşam Servisi' },
                      { id: 'Yarın 10:00 - 12:00', label: 'Yarın 10:00 - 12:00', desc: 'Sabah Teslimatı' }
                    ].map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setDeliverySlot(slot.id)}
                        className={`p-2.5 rounded-xl text-left border transition cursor-pointer ${
                          deliverySlot === slot.id
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-2xs font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-xs block font-bold">{slot.label}</span>
                        <span className="text-[10px] text-slate-400 block">{slot.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. STANDART PERAKENDE / TOPTAN VARYANTLARI */}
              {!isDigital && !isSession && !customization?.measurement && !customization?.foodCustomization && (
                <div className="space-y-4 pt-2">
                  {/* Ölçü / Beden */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">Ölçü / Beden Seçimi:</span>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${selectedSize === size ? 'bg-indigo-900 text-white border-indigo-900 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Renk Seçenekleri */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">Renk / Doku Seçimi:</span>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((col) => (
                        <button
                          key={col.name}
                          onClick={() => setSelectedColor(col.name)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer border flex items-center gap-2 ${selectedColor === col.name ? 'bg-indigo-900 text-white border-indigo-900 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'}`}
                        >
                          <span className="w-3 h-3 rounded-full border border-slate-300 shadow-inner" style={{ backgroundColor: col.hex }}></span>
                          {col.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Ürün Açıklaması */}
              <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                {product.description}
              </p>
            </div>

            {/* Alt Eylem Butonları */}
            <div className="space-y-4 pt-6 border-t border-slate-200">
              <div className="flex items-center gap-4">
                {isDigital ? (
                  <button
                    onClick={() => {
                      setDigitalPurchaseComplete(false);
                      setShowDigitalModal(true);
                    }}
                    className="flex-1 py-4 bg-purple-700 hover:bg-purple-800 text-white font-black text-sm rounded-2xl transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Download className="w-5 h-5 text-purple-200" />
                    <span>Hemen Satın Al & Anında İndir (₺{product.price.toLocaleString('tr-TR')})</span>
                  </button>
                ) : isSession ? (
                  <button
                    onClick={() => {
                      setSessionBookedSuccess(null);
                      setShowSessionModal(true);
                    }}
                    className="flex-1 py-4 bg-cyan-700 hover:bg-cyan-800 text-white font-black text-sm rounded-2xl transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Video className="w-5 h-5 text-cyan-200" />
                    <span>Seansı Rezerve Et & Onayla (₺{product.price.toLocaleString('tr-TR')})</span>
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-2xl transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {addedToCart ? (
                      <span>Sepete Eklendi & Esnafa İletildi ✓</span>
                    ) : (
                      <span>
                        {customization?.foodCustomization?.enabled 
                          ? `Siparişi Ver & Sepete Ekle (₺${dynamicTotalPrice.toLocaleString('tr-TR')})`
                          : customization?.measurement?.unit === 'kg'
                          ? `Sepete Ekle (${selectedWeightOrQty} Kg - ₺${dynamicTotalPrice.toLocaleString('tr-TR')})`
                          : customization?.customForm?.enabled || customization?.fileUpload?.enabled
                          ? `Kişiselleştirmeyi Tamamla & Al (₺${dynamicTotalPrice.toLocaleString('tr-TR')})`
                          : `Hemen Sepete Ekle (₺${dynamicTotalPrice.toLocaleString('tr-TR')})`}
                      </span>
                    )}
                  </button>
                )}

                <button
                  onClick={toggleFavorite}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-center ${isFavorite ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-600' : ''}`} />
                </button>
              </div>

              {addedToCart && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 p-4 rounded-2xl text-xs space-y-1.5 shadow-sm animate-fade-in">
                  <div className="flex items-center gap-2 font-black text-emerald-900 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Sipariş Başarıyla Alındı & Esnaf Paneline Aktarıldı!</span>
                  </div>
                  {orderSuccessDetails && (
                    <p className="text-emerald-800 font-semibold pl-7">
                      Seçimleriniz: <span className="font-bold underline">{orderSuccessDetails}</span> · Tutar: ₺{dynamicTotalPrice.toLocaleString('tr-TR')}
                    </p>
                  )}
                  <div className="pl-7 pt-1 flex items-center gap-3 text-[11px]">
                    <button
                      onClick={() => navigate('/yonetim')}
                      className="font-bold text-emerald-900 underline hover:text-emerald-950 cursor-pointer flex items-center gap-1"
                    >
                      <span>Esnaf Yönetim Panelinde Canlı Gör (/yonetim)</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* Güven Rozetleri */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] text-slate-500">
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-700">Doğrudan POS</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex flex-col items-center gap-1">
                  {isDigital ? (
                    <>
                      <Download className="w-4 h-4 text-purple-600" />
                      <span className="font-bold text-slate-700">Anında Teslim</span>
                    </>
                  ) : isSession ? (
                    <>
                      <Video className="w-4 h-4 text-cyan-600" />
                      <span className="font-bold text-slate-700">Google Meet HD</span>
                    </>
                  ) : (
                    <>
                      <Truck className="w-4 h-4 text-indigo-600" />
                      <span className="font-bold text-slate-700">Hızlı Kargo</span>
                    </>
                  )}
                </div>
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-amber-600" />
                  <span className="font-bold text-slate-700">TamPazar Güvencesi</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* ÇAPRAZ SATIŞ ("Mahallede Birlikte İyi Gider") */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-400 text-slate-950 font-black">
                  <ShoppingBag className="w-4 h-4" />
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Mahallede Birlikte İyi Gider
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Aynı mahalledeki komşu esnaflardan bu ürünle en sık tercih edilen tamamlayıcı ürünler.
              </p>
            </div>

            <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full self-start sm:self-auto flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Paket Alımında %10 Mahalle İndirimi
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Üç Ürün Kartı */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Ürün 1: Ana Ürün */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 relative">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bundleItemsSelected.main}
                    onChange={(e) => setBundleItemsSelected(prev => ({ ...prev, main: e.target.checked }))}
                    className="mt-1 rounded text-indigo-900 focus:ring-indigo-900"
                  />
                  <div className="space-y-1 min-w-0">
                    <img src={product.images[0]} alt={product.title} className="w-full h-24 rounded-xl object-cover border border-slate-200" />
                    <span className="text-[10px] text-indigo-700 font-bold block">Bu Ürün</span>
                    <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{product.title}</h5>
                    <span className="text-xs font-black text-slate-900 font-mono">₺{product.price}</span>
                  </div>
                </label>
              </div>

              {/* Ürün 2: Tamamlayıcı Ürün 1 */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 relative">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bundleItemsSelected.item1}
                    onChange={(e) => setBundleItemsSelected(prev => ({ ...prev, item1: e.target.checked }))}
                    className="mt-1 rounded text-indigo-900 focus:ring-indigo-900"
                  />
                  <div className="space-y-1 min-w-0">
                    <img src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400" alt="Hakiki Ezine Peyniri" className="w-full h-24 rounded-xl object-cover border border-slate-200" />
                    <span className="text-[10px] text-amber-700 font-bold block">Tarihi Ezine Şarküteri</span>
                    <h5 className="text-xs font-bold text-slate-900 line-clamp-1">Tam Yağlı Hakiki Ezine Peyniri (500g)</h5>
                    <span className="text-xs font-black text-slate-900 font-mono">₺195</span>
                  </div>
                </label>
              </div>

              {/* Ürün 3: Tamamlayıcı Ürün 2 */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 relative">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bundleItemsSelected.item2}
                    onChange={(e) => setBundleItemsSelected(prev => ({ ...prev, item2: e.target.checked }))}
                    className="mt-1 rounded text-indigo-900 focus:ring-indigo-900"
                  />
                  <div className="space-y-1 min-w-0">
                    <img src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400" alt="Organik Doğu Karadeniz Çayı" className="w-full h-24 rounded-xl object-cover border border-slate-200" />
                    <span className="text-[10px] text-emerald-700 font-bold block">Karadeniz Doğal Çiftlik</span>
                    <h5 className="text-xs font-bold text-slate-900 line-clamp-1">Mayıs Hasadı Organik Rize Çayı (1 Kg)</h5>
                    <span className="text-xs font-black text-slate-900 font-mono">₺280</span>
                  </div>
                </label>
              </div>

            </div>

            {/* Sağ Paket Fiyatı ve Tek Tıkla Sepete Ekle */}
            <div className="lg:col-span-4 bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-4">
              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-bold block">Seçilen 3'lü Mahalle Paketi:</span>
                {(() => {
                  let rawTotal = 0;
                  if (bundleItemsSelected.main) rawTotal += product.price;
                  if (bundleItemsSelected.item1) rawTotal += 195;
                  if (bundleItemsSelected.item2) rawTotal += 280;
                  const discountedTotal = Math.round(rawTotal * 0.9);

                  return (
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-900 font-mono">
                          ₺{discountedTotal.toLocaleString('tr-TR')}
                        </span>
                        {rawTotal > 0 && (
                          <span className="text-xs text-slate-400 line-through font-mono">
                            ₺{rawTotal.toLocaleString('tr-TR')}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-emerald-700 font-bold">
                        Tek tıkla sepete ekle, tek kuryeyle gelsin.
                      </span>
                    </div>
                  );
                })()}
              </div>

              <button
                type="button"
                onClick={() => {
                  setBundleAddedSuccess(true);
                  setTimeout(() => setBundleAddedSuccess(false), 3500);
                }}
                className="w-full py-3.5 bg-indigo-900 hover:bg-indigo-800 text-white font-black text-xs rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>{bundleAddedSuccess ? 'Tüm Paket Sepete Eklendi ✓' : 'Tümünü Birlikte Sepete Ekle (%10 İndirimle)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* ETSY MODELİ: BU ÜRÜNÜ ÜRETEN ATÖLYE & ESNAF HİKAYESİ */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-900 text-amber-400 font-black text-xl flex items-center justify-center shadow-md">
                {product.store.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900">{product.store.name}</h3>
                  <span className="bg-emerald-100 text-emerald-900 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Award className="w-3 h-3 text-emerald-700" /> Usta Zanaatkar Belgesi
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">24 Yıldır Mahallenizde Hizmet Veriyor · {product.store.address}</p>
              </div>
            </div>

            <button
              onClick={() => setShowArtisanQuestionModal(true)}
              className="px-4 py-2.5 bg-slate-900 hover:bg-indigo-950 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
            >
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Esnafa Soru Sor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3 text-xs text-slate-600 leading-relaxed">
              <h4 className="font-bold text-slate-900 text-sm">Zanaatkarın ve Atölyenin Hikayesi:</h4>
              <p>
                "Atölyemizde her bir ürün, fabrikasyon seri üretim yerine geleneksel el aletleri ve ustalık tecrübesiyle tek tek üretilir. Kullanılan tüm hammaddeler yerli üreticilerden doğrudan temin edilmekte olup, gıda ürünlerimizde hiçbir koruyucu katkı maddesi kullanılmaz."
              </p>
              <p>
                "TamPazar altyapısı sayesinde komisyonsuz doğrudan mahalle sakinlerimize ve tüm Türkiye'ye aracısız en yüksek kalitede ürünlerimizi ulaştırmanın mutluluğunu yaşıyoruz."
              </p>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-900 block text-xs">Atölye Güvenceleri:</span>
              <ul className="space-y-2 text-slate-700 text-[11px]">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> %100 El Yapımı / Hakiki Malzeme
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Kişiye Özel Lazer & İsim Yazımı
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Faturası ve Garanti Belgesiyle Sevk
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. ESNAF / MAĞAZA PROFİL KARTI */}
        {/* ========================================================= */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-900 text-amber-400 font-black text-2xl flex items-center justify-center shadow-md border border-indigo-800">
                {product.store.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900">{product.store.name}</h3>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Fiziksel Doğrulanmış Esnaf
                  </span>
                </div>
                <p className="text-xs text-slate-500">{product.store.address} · {product.store.paymentProvider}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleFollowStore}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer border ${isFollowingStore ? 'bg-indigo-900 text-white border-indigo-900' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'}`}
              >
                {isFollowingStore ? 'Mağazayı Takip Ediyorsun ✓' : '+ Mağazayı Takip Et'}
              </button>

              <a
                href={`tel:${product.store.phone}`}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition cursor-pointer border border-slate-200"
                title="Esnafı Ara"
              >
                <Phone className="w-4 h-4" />
              </a>

              <a
                href={`https://wa.me/${product.store.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition cursor-pointer border border-emerald-200"
                title="WhatsApp Destek"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-slate-600">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Mağaza Puanı</span>
              <span className="text-slate-900 font-bold text-sm flex items-center gap-1 mt-0.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" /> {product.store.rating} / 5.0
              </span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Takipçi & Müşteri</span>
              <span className="text-slate-900 font-bold text-sm mt-0.5 block">{followerCount.toLocaleString('tr-TR')} Kişi</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Ödeme Altyapısı</span>
              <span className="text-slate-900 font-bold text-sm mt-0.5 block">{product.store.paymentProvider}</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Kargo & Fatura</span>
              <span className="text-slate-900 font-bold text-sm mt-0.5 block">GİB e-Fatura Entegre</span>
            </div>
          </div>
        </div>

      </main>

      {/* ========================================================= */}
      {/* 4. TAMDİJİTAL ANINDA SATIN ALMA & İNDİRME MODALI */}
      {/* ========================================================= */}
      {showDigitalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-purple-100 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowDigitalModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!digitalPurchaseComplete ? (
              <form onSubmit={handleCompleteDigitalPurchase} className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center font-black">
                    <Download className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-purple-700 font-black block">TamDijital Anında Teslim</span>
                    <h3 className="text-lg font-black text-slate-900">Dosya Satın Alımı</h3>
                  </div>
                </div>

                {/* Ürün & Fiyat Özeti */}
                <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl flex items-center gap-3">
                  <img src={product.images[0]} alt={product.title} className="w-14 h-14 rounded-xl object-cover border border-purple-200" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{product.title}</h4>
                    <p className="text-[11px] text-purple-800 mt-0.5">
                      {foundProduct?.deliveryOptions?.digitalFileName || 'Tasarim_Dosyalari.zip'} · {foundProduct?.deliveryOptions?.digitalFileSize || '18.4 MB'}
                    </p>
                    <span className="text-xs font-black text-slate-900 block mt-1">₺{product.price.toLocaleString('tr-TR')} (KDV Dahil)</span>
                  </div>
                </div>

                {/* Sıfır Adres Bilgilendirme */}
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Fiziksel Kargo Yok:</strong> Dijital ürün olduğu için kargo adresi istenmez. Ödeme sonrası anında indirme butonunuz açılır ve dosya lisanslı olarak adınıza tahsis edilir.
                  </span>
                </div>

                {/* Alıcı Bilgileri */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Ad Soyad</label>
                    <input
                      type="text"
                      required
                      value={digitalBuyerName}
                      onChange={(e) => setDigitalBuyerName(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">E-Posta (Dosya & Fatura İletimi)</label>
                    <input
                      type="email"
                      required
                      value={digitalBuyerEmail}
                      onChange={(e) => setDigitalBuyerEmail(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Telefon Numarası</label>
                    <input
                      type="tel"
                      required
                      value={digitalBuyerPhone}
                      onChange={(e) => setDigitalBuyerPhone(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* BYO POS Güven Rozeti */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    256-bit SSL Korumalı Güvenli Ödeme
                  </span>
                  <span className="font-bold text-slate-800">%0 Komisyon Doğrudan POS</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-purple-700 hover:bg-purple-800 text-white font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Ödemeyi Tamamla ve Dosyayı İndir (₺{product.price.toLocaleString('tr-TR')})</span>
                </button>
              </form>
            ) : (
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900">Sipariş Başarılı! Dosyanız Hazır</h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Ödemeniz esnaf kasasında doğrulandı ve faturalandırıldı. Dosya otomatik olarak indirilmeye başlandı.
                  </p>
                </div>

                {/* BÜYÜK YEŞİL İNDİR BUTONU */}
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3 text-left">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 truncate">{digitalPurchasedFileName || 'Dosya_Arsivi.zip'}</span>
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">Lisanslı</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => triggerBrowserDownload(digitalPurchasedFileName, product.title)}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl transition flex items-center justify-center gap-2 shadow-lg cursor-pointer animate-pulse"
                  >
                    <Download className="w-5 h-5" />
                    <span>Dosyayı Hemen İndir (ZIP/PDF)</span>
                  </button>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDigitalModal(false);
                      navigate('/hesabim/dijital-arsivim');
                    }}
                    className="w-full py-3 bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs rounded-xl border border-purple-200 transition cursor-pointer"
                  >
                    Dijital Arşivime Git (/hesabim/dijital-arsivim) →
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDigitalModal(false)}
                    className="text-xs text-slate-500 hover:text-slate-800 transition py-1"
                  >
                    Pencereyi Kapat
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. TAMSEANS RANDEVU REZERVASYON MODALI */}
      {/* ========================================================= */}
      {showSessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-cyan-100 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowSessionModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!sessionBookedSuccess ? (
              <form onSubmit={handleCompleteSessionBooking} className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-cyan-100 text-cyan-800 rounded-2xl flex items-center justify-center font-black">
                    <Video className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-800 font-black block">TamSeans Canlı Görüşme</span>
                    <h3 className="text-lg font-black text-slate-900">Randevu Onayı & Ödeme</h3>
                  </div>
                </div>

                {/* Seans Özeti */}
                <div className="p-4 bg-cyan-50/70 border border-cyan-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{product.title}</span>
                    <span className="text-xs font-black text-cyan-900">₺{product.price.toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-cyan-950 pt-2 border-t border-cyan-200/60">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-700" />
                      <span>{selectedSessionDay}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-700" />
                      <span>{selectedSessionSlot}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-600 flex items-center gap-1.5 pt-1">
                    <Video className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Kanal: Google Meet (HD Şifreli Görüşme)</span>
                  </div>
                </div>

                {/* İletişim Formu */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Ad Soyad</label>
                    <input
                      type="text"
                      required
                      value={sessionBuyerName}
                      onChange={(e) => setSessionBuyerName(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Telefon Numarası (SMS Bildirimi)</label>
                    <input
                      type="tel"
                      required
                      value={sessionBuyerPhone}
                      onChange={(e) => setSessionBuyerPhone(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">E-Posta (Takvim Daveti)</label>
                    <input
                      type="email"
                      required
                      value={sessionBuyerEmail}
                      onChange={(e) => setSessionBuyerEmail(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-cyan-700 hover:bg-cyan-800 text-white font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Video className="w-5 h-5" />
                  <span>Randevuyu Kesinleştir & Öde (₺{product.price.toLocaleString('tr-TR')})</span>
                </button>
              </form>
            ) : (
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900">Randevunuz Onaylandı!</h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Online seans kaydınız oluşturuldu ve esnaf takvimine işlendi. Google Meet bağlantınız aşağıda hazırdır.
                  </p>
                </div>

                {/* Google Meet Kartı */}
                <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-2xl space-y-3 text-left">
                  <div className="text-xs font-bold text-slate-800">
                    {sessionBookedSuccess.date} · {sessionBookedSuccess.timeSlot}
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-cyan-200 flex items-center justify-between text-xs">
                    <span className="font-mono text-cyan-900 truncate max-w-[240px]">{sessionBookedSuccess.meetingLink}</span>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(sessionBookedSuccess.meetingLink)}
                      className="text-cyan-700 font-bold hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" /> Kopyala
                    </button>
                  </div>
                  <a
                    href={sessionBookedSuccess.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Video className="w-4 h-4" />
                    <span>Google Meet Toplantısına Katıl</span>
                  </a>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSessionModal(false);
                      navigate('/hesabim/randevularim');
                    }}
                    className="w-full py-3 bg-cyan-50 hover:bg-cyan-100 text-cyan-900 font-bold text-xs rounded-xl border border-cyan-200 transition cursor-pointer"
                  >
                    Online Seanslarıma Git (/hesabim/randevularim) →
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSessionModal(false)}
                    className="text-xs text-slate-500 hover:text-slate-800 transition py-1"
                  >
                    Pencereyi Kapat
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* ========================================================= */}
      {/* 5. ALIBABA MODELİ: NUMUNE TALEP ET MODALI */}
      {/* ========================================================= */}
      {showSampleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-indigo-100 space-y-4 relative">
            <button
              onClick={() => setShowSampleModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="p-2.5 rounded-2xl bg-indigo-100 text-indigo-900 font-bold">
                🧪
              </span>
              <div>
                <h4 className="font-black text-slate-900 text-sm">Toplu Alım Öncesi Numune Talep Et</h4>
                <p className="text-[11px] text-slate-500">Esnaftan 1 adet test numunesi isteyin</p>
              </div>
            </div>

            {sampleRequestedSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h5 className="font-black text-slate-900 text-sm">Numune Talebiniz Alındı!</h5>
                <p className="text-xs text-slate-500">
                  {product.store.name} işletmesine numune talebiniz ve adresiniz iletildi. Numune kargo takip no SMS ile gelecektir.
                </p>
                <button
                  onClick={() => {
                    setShowSampleModal(false);
                    setSampleRequestedSuccess(false);
                  }}
                  className="w-full py-2.5 bg-indigo-900 text-white rounded-xl font-bold text-xs"
                >
                  Tamam
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSampleRequestedSuccess(true);
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ad Soyad / Şirket Unvanı</label>
                  <input
                    type="text"
                    required
                    value={sampleName}
                    onChange={(e) => setSampleName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Telefon Numarası</label>
                  <input
                    type="text"
                    required
                    value={samplePhone}
                    onChange={(e) => setSamplePhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Numunenin Gönderileceği Adres</label>
                  <textarea
                    rows={2}
                    required
                    value={sampleAddress}
                    onChange={(e) => setSampleAddress(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-900 hover:bg-indigo-800 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition"
                >
                  Numune Talebini Gönder (TamPazar B2B)
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. ETSY MODELİ: ESNAFA SORU SOR MODALI */}
      {/* ========================================================= */}
      {showArtisanQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 relative">
            <button
              onClick={() => setShowArtisanQuestionModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="p-2.5 rounded-2xl bg-amber-100 text-amber-900 font-bold">
                <MessageSquare className="w-4 h-4 text-amber-700" />
              </span>
              <div>
                <h4 className="font-black text-slate-900 text-sm">{product.store.name} Atölyesine Soru Sor</h4>
                <p className="text-[11px] text-slate-500">Zanaatkar esnafa doğrudan mesaj iletin</p>
              </div>
            </div>

            {artisanQuestionSent ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h5 className="font-black text-slate-900 text-sm">Sorunuz Esnafa İletildi!</h5>
                <p className="text-xs text-slate-500">
                  Esnaf cevabı SMS ve bildirim ile hesabınıza aktarılacaktır.
                </p>
                <button
                  onClick={() => {
                    setShowArtisanQuestionModal(false);
                    setArtisanQuestionSent(false);
                    setArtisanQuestionText('');
                  }}
                  className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs"
                >
                  Tamam
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setArtisanQuestionSent(true);
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sorunuz veya Özel Üretim Talebiniz *</label>
                  <textarea
                    rows={4}
                    required
                    value={artisanQuestionText}
                    onChange={(e) => setArtisanQuestionText(e.target.value)}
                    placeholder="Örn: Bu ürünün özel boyutu yapılabilir mi? Hediye paketine özel not eklenebilir mi?..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none leading-relaxed"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-900 hover:bg-indigo-800 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>Soruyu Gönder</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
