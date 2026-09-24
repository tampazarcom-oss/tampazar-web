import React, { useState } from 'react';
import { 
  X, Check, AlertCircle, Sparkles, Plus, Trash2, 
  Upload, Image as ImageIcon, DollarSign, Package, 
  Truck, ShieldCheck, Tag, Info, Layers, RefreshCw, Star,
  Download, Video, FileCode, Clock, Globe, Calendar as CalendarIcon, CheckCircle2,
  Scale, Utensils, Sliders, FileText
} from 'lucide-react';
import { Product } from '../../data/mockData';

interface AdvancedProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProduct: (product: Product) => void;
  tenantId?: string;
  storeName?: string;
}

type TabKey = 'basic' | 'pricing' | 'variants' | 'logistics' | 'b2b' | 'customization';

interface VariantRow {
  id: string;
  size?: string;
  color?: string;
  material?: string;
  sku: string;
  barcode: string;
  stock: number;
  priceDiff: number;
}

export default function AdvancedProductModal({
  isOpen,
  onClose,
  onSaveProduct,
  tenantId = 's3',
  storeName = 'FotoSentez Stüdyo'
}: AdvancedProductModalProps) {
  // Wizard Active Tab
  const [activeTab, setActiveTab] = useState<TabKey>('basic');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Tab 1: Temel Bilgiler
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Giyim & Ayakkabı');
  const [subCategory, setSubCategory] = useState('Spor & Günlük');
  const [brand, setBrand] = useState('');
  const [modelNo, setModelNo] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'
  ]);
  const [coverImageIndex, setCoverImageIndex] = useState(0);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Tab 2: Fiyat & Muhasebe
  const [costPrice, setCostPrice] = useState<number>(350);
  const [salePrice, setSalePrice] = useState<number>(750);
  const [listPrice, setListPrice] = useState<number>(950);
  const [vatRate, setVatRate] = useState<number>(20);
  const [withholdingCode, setWithholdingCode] = useState('Yok');
  const [sku, setSku] = useState('PRD-' + Math.floor(100000 + Math.random() * 900000));
  const [stockCount, setStockCount] = useState<number>(50);
  const [criticalStockThreshold, setCriticalStockThreshold] = useState<number>(5);

  // Tab 3: Varyantlar
  const [hasVariants, setHasVariants] = useState(false);
  const [sizeOptions, setSizeOptions] = useState<string[]>(['40', '41', '42', '43']);
  const [colorOptions, setColorOptions] = useState<string[]>(['Siyah', 'Beyaz']);
  const [newSizeTag, setNewSizeTag] = useState('');
  const [newColorTag, setNewColorTag] = useState('');
  const [variantMatrix, setVariantMatrix] = useState<VariantRow[]>([
    { id: 'v1', size: '41', color: 'Siyah', sku: 'PRD-41-SYH', barcode: '868000100411', stock: 15, priceDiff: 0 },
    { id: 'v2', size: '42', color: 'Siyah', sku: 'PRD-42-SYH', barcode: '868000100421', stock: 20, priceDiff: 0 },
    { id: 'v3', size: '41', color: 'Beyaz', sku: 'PRD-41-BYZ', barcode: '868000100412', stock: 10, priceDiff: 0 },
    { id: 'v4', size: '42', color: 'Beyaz', sku: 'PRD-42-BYZ', barcode: '868000100422', stock: 5, priceDiff: 25 },
  ]);

  // Tab 4: Teslimat & Lojistik (5 Temel Ticaret Bacağı)
  const [productType, setProductType] = useState<'physical_cargo' | 'local_express' | 'field_service' | 'digital_download' | 'online_session'>('physical_cargo');
  const [desi, setDesi] = useState<number>(2);
  const [carrierCompany, setCarrierCompany] = useState('Yurtiçi Kargo');
  const [isFreeShipping, setIsFreeShipping] = useState(false);
  
  // Local Express
  const [localDeliveryTime, setLocalDeliveryTime] = useState('30-45 Dk');
  const [minBasketAmount, setMinBasketAmount] = useState<number>(150);
  const [isTakeawayAllowed, setIsTakeawayAllowed] = useState(true);

  // Field Service
  const [fixedServiceFee, setFixedServiceFee] = useState<number>(450);
  const [serviceRadiusKm, setServiceRadiusKm] = useState<number>(25);
  const [isOnSiteService, setIsOnSiteService] = useState(true);

  // TamDijital (Etsy & Gumroad Modeli)
  const [digitalFileName, setDigitalFileName] = useState('Nakis_Deseni_Tasarim_v1.zip');
  const [digitalFileSize, setDigitalFileSize] = useState('14.8 MB');
  const [digitalFileUrl, setDigitalFileUrl] = useState('https://storage.tampazar.com/dijital/nakis-deseni-v1.zip');
  const [digitalFormats, setDigitalFormats] = useState<string[]>(['DST', 'PES', 'JEF', 'PDF']);
  const [newFormatInput, setNewFormatInput] = useState('');
  const [licenseType, setLicenseType] = useState<'personal' | 'commercial'>('commercial');

  // TamSeans (Superpeer & Calendly Modeli)
  const [sessionDurationMin, setSessionDurationMin] = useState<30 | 45 | 60>(45);
  const [availableDays, setAvailableDays] = useState<string[]>(['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma']);
  const [availableHours, setAvailableHours] = useState<string[]>(['10:00', '11:30', '14:00', '15:30', '17:00']);
  const [sessionChannel, setSessionChannel] = useState<'google_meet' | 'zoom' | 'whatsapp_phone'>('google_meet');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/tpz-danisman-oda');
  const [expertTitle, setExpertTitle] = useState('Kıdemli Uzman Danışman');

  // Tab 5: B2B & Toptan Satış & Dropshipping
  const [isB2BAvailable, setIsB2BAvailable] = useState<boolean>(false);
  const [isB2BOnly, setIsB2BOnly] = useState<boolean>(false);
  const [b2bMinQty, setB2bMinQty] = useState<number>(10);
  const [b2bUnitType, setB2bUnitType] = useState<'adet' | 'seri' | 'koli' | 'cuval' | 'paket'>('adet');
  const [b2bWholesalePrice, setB2bWholesalePrice] = useState<number>(350);
  const [b2bTieredPricing, setB2bTieredPricing] = useState<{ minQty: number; maxQty?: number | null; price: number }[]>([
    { minQty: 10, maxQty: 49, price: 350 },
    { minQty: 50, maxQty: null, price: 300 }
  ]);
  const [allowDropshipping, setAllowDropshipping] = useState<boolean>(true);
  const [suggestedRetailPrice, setSuggestedRetailPrice] = useState<number>(590);

  // Tab 6: Ölçü Birimi & Dinamik Müşteri Sipariş Seçenekleri
  const [measurementUnit, setMeasurementUnit] = useState<'adet' | 'kg' | 'gram' | 'litre' | 'metre' | 'm2' | 'porsiyon' | 'paket'>('adet');
  const [measurementMin, setMeasurementMin] = useState<number>(1);
  const [measurementStep, setMeasurementStep] = useState<number>(1);
  const [measurementUnitLabel, setMeasurementUnitLabel] = useState<string>('Adet');
  const [priceMultiplier, setPriceMultiplier] = useState<number>(1);

  // Yemek & Restoran Malzeme Seçici
  const [foodCustomizationEnabled, setFoodCustomizationEnabled] = useState<boolean>(false);
  const [removableIngredients, setRemovableIngredients] = useState<{ id: string; name: string; defaultIncluded: boolean }[]>([
    { id: 'rem-1', name: 'Soğan', defaultIncluded: true },
    { id: 'rem-2', name: 'Kornişon Turşu', defaultIncluded: true },
    { id: 'rem-3', name: 'Sarımsaklı Mayonez', defaultIncluded: true }
  ]);
  const [newRemovableName, setNewRemovableName] = useState<string>('');

  const [extraIngredients, setExtraIngredients] = useState<{ id: string; name: string; price: number }[]>([
    { id: 'ext-1', name: 'Ekstra Kaşar Peyniri', price: 30 },
    { id: 'ext-2', name: 'Çift Lavaş', price: 15 },
    { id: 'ext-3', name: 'Trüf Aromalı Mayonez', price: 20 }
  ]);
  const [newExtraName, setNewExtraName] = useState<string>('');
  const [newExtraPrice, setNewExtraPrice] = useState<number>(20);

  const [mandatoryGroups, setMandatoryGroups] = useState<{ id: string; title: string; required: boolean; options: { id: string; name: string; priceDiff?: number }[] }[]>([
    {
      id: 'grp-1',
      title: 'Acı Durumu',
      required: true,
      options: [
        { id: 'opt-1', name: 'Acısız' },
        { id: 'opt-2', name: 'Az Acılı' },
        { id: 'opt-3', name: 'Orta Acılı' },
        { id: 'opt-4', name: 'Çok Acılı' }
      ]
    }
  ]);
  const [newGroupTitle, setNewGroupTitle] = useState<string>('');

  // Fotoğraf Baskı & Dosya Yükleme
  const [fileUploadEnabled, setFileUploadEnabled] = useState<boolean>(false);
  const [fileUploadTitle, setFileUploadTitle] = useState<string>('Baskı Fotoğraflarınızı Yükleyin');
  const [fileUploadDesc, setFileUploadDesc] = useState<string>('Lütfen basılmasını istediğiniz fotoğrafları JPG, PNG veya ZIP formatında yükleyin.');
  const [fileUploadFormats, setFileUploadFormats] = useState<string[]>(['JPG', 'PNG', 'PDF', 'TIFF', 'RAW', 'ZIP']);
  const [fileUploadMin, setFileUploadMin] = useState<number>(1);
  const [fileUploadMax, setFileUploadMax] = useState<number>(100);
  const [fileUploadMaxSize, setFileUploadMaxSize] = useState<number>(100);
  const [fileUploadRequired, setFileUploadRequired] = useState<boolean>(true);

  // Dinamik Kişiye Özel Form Sihirbazı (Matbaa / Davetiye / Lazer)
  const [customFormEnabled, setCustomFormEnabled] = useState<boolean>(false);
  const [customFormTitle, setCustomFormTitle] = useState<string>('Kişiye Özel Baskı / Davetiye Bilgi Formu');
  const [customFormDesc, setCustomFormDesc] = useState<string>('Davetiyenizin üzerine basılacak bilgileri eksiksiz doldurunuz.');
  const [customFormFields, setCustomFormFields] = useState<{ id: string; label: string; type: 'text' | 'textarea' | 'date' | 'select' | 'number'; placeholder?: string; required: boolean }[]>([
    { id: 'fld-1', label: 'Gelin & Damat Adı', type: 'text', placeholder: 'Örn: Leyla & Mecnun', required: true },
    { id: 'fld-2', label: 'Düğün / Kına Tarihi ve Saati', type: 'text', placeholder: 'Örn: 24 Ağustos 2026 - 19:30', required: true },
    { id: 'fld-3', label: 'Düğün Salonu Adı ve Açık Adres', type: 'textarea', placeholder: 'Örn: Grand Bosphorus Balo Salonu, Beşiktaş / İstanbul', required: true },
    { id: 'fld-4', label: 'Varsa Özel Davetiye Sözü / Notu', type: 'textarea', placeholder: 'Örn: Bir ömür boyu sürecek mutluluğumuza tanık olmanız dileğiyle...', required: false }
  ]);
  const [newFieldLabel, setNewFieldLabel] = useState<string>('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'textarea' | 'date' | 'number'>('text');
  const [newFieldRequired, setNewFieldRequired] = useState<boolean>(true);

  if (!isOpen) return null;

  // Real-time Profit Calculation
  const calculatedVatAmount = salePrice * (vatRate / 100);
  const netEarningsBeforeTax = salePrice - calculatedVatAmount;
  const netProfitTL = netEarningsBeforeTax - costPrice;
  const profitMarginPercent = salePrice > 0 ? ((netProfitTL / salePrice) * 100) : 0;

  // Add Tag Handlers
  const handleAddSizeTag = () => {
    if (newSizeTag.trim() && !sizeOptions.includes(newSizeTag.trim())) {
      const updated = [...sizeOptions, newSizeTag.trim()];
      setSizeOptions(updated);
      setNewSizeTag('');
      regenerateMatrix(updated, colorOptions);
    }
  };

  const handleAddColorTag = () => {
    if (newColorTag.trim() && !colorOptions.includes(newColorTag.trim())) {
      const updated = [...colorOptions, newColorTag.trim()];
      setColorOptions(updated);
      setNewColorTag('');
      regenerateMatrix(sizeOptions, updated);
    }
  };

  const handleRemoveSizeTag = (tag: string) => {
    const updated = sizeOptions.filter(s => s !== tag);
    setSizeOptions(updated);
    regenerateMatrix(updated, colorOptions);
  };

  const handleRemoveColorTag = (tag: string) => {
    const updated = colorOptions.filter(c => c !== tag);
    setColorOptions(updated);
    regenerateMatrix(sizeOptions, updated);
  };

  const regenerateMatrix = (sizes: string[], colors: string[]) => {
    const newRows: VariantRow[] = [];
    let count = 1;
    const targetSizes = sizes.length > 0 ? sizes : ['Standart'];
    const targetColors = colors.length > 0 ? colors : ['Standart'];

    for (const s of targetSizes) {
      for (const c of targetColors) {
        newRows.push({
          id: 'v-' + count,
          size: s,
          color: c,
          sku: `${sku}-${s.slice(0, 3).toUpperCase()}-${c.slice(0, 3).toUpperCase()}`,
          barcode: '868000' + Math.floor(100000 + Math.random() * 900000),
          stock: 10,
          priceDiff: 0
        });
        count++;
      }
    }
    setVariantMatrix(newRows);
  };

  const handleUpdateMatrixRow = (id: string, field: keyof VariantRow, value: any) => {
    setVariantMatrix(prev => prev.map(row => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    }));
  };

  const handleAddImage = () => {
    if (newImageUrl.trim() && !images.includes(newImageUrl.trim())) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    if (images.length <= 1) return;
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    if (coverImageIndex >= updated.length) {
      setCoverImageIndex(0);
    }
  };

  // Validation & Save
  const handleSave = () => {
    setValidationError(null);

    if (!title.trim()) {
      setActiveTab('basic');
      setValidationError('Lütfen ürün veya hizmet adını eksiksiz girin.');
      return;
    }

    if (salePrice <= 0) {
      setActiveTab('pricing');
      setValidationError('Satış fiyatı 0 TL veya negatif olamaz.');
      return;
    }

    if (costPrice < 0) {
      setActiveTab('pricing');
      setValidationError('Alış fiyatı negatif olamaz.');
      return;
    }

    const selectedImage = images[coverImageIndex] || images[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600';

    const mappedType = 
      productType === 'field_service' ? 'service' :
      productType === 'digital_download' ? 'digital' :
      productType === 'online_session' ? 'consultation' : 'retail';

    const mappedBadge = 
      productType === 'digital_download' ? 'Anında Dijital İndirme' :
      productType === 'online_session' ? 'Uzaktan Canlı Seans' :
      productType === 'field_service' ? 'Yerinde Saha Servisi' :
      productType === 'local_express' ? '30-45 Dk Anlık Teslimat' :
      isFreeShipping ? 'Ücretsiz Kargo' : 'Doğrudan Esnaf';

    const newProduct: Product = {
      id: 'prd-' + Date.now(),
      tenantId,
      storeName,
      type: mappedType,
      title: title.trim(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      categorySlug: category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description.trim() || 'TamPazar kurumsal standartlarında tescilli esnaf ürünü.',
      price: Number(salePrice),
      sku: sku.trim() || 'SKU-' + Date.now().toString().slice(-6),
      vatRate,
      image: selectedImage,
      rating: 5.0,
      salesCount: 0,
      badge: mappedBadge,
      brand: brand.trim() || undefined,
      modelNo: modelNo.trim() || undefined,
      costPrice: Number(costPrice),
      listPrice: Number(listPrice),
      withholdingCode,
      images,
      stockCount: hasVariants ? variantMatrix.reduce((acc, r) => acc + r.stock, 0) : Number(stockCount),
      criticalStockThreshold: Number(criticalStockThreshold),
      variants: hasVariants ? {
        sizes: sizeOptions,
        colors: colorOptions
      } : undefined,
      variantMatrix: hasVariants ? variantMatrix : undefined,
      deliveryOptions: {
        type: productType,
        desi: productType === 'physical_cargo' ? desi : undefined,
        carrierCompany: productType === 'physical_cargo' ? carrierCompany : undefined,
        isFreeShipping: productType === 'physical_cargo' ? isFreeShipping : undefined,
        localDeliveryTime: productType === 'local_express' ? localDeliveryTime : undefined,
        minBasketAmount: productType === 'local_express' ? minBasketAmount : undefined,
        isTakeawayAllowed: productType === 'local_express' ? isTakeawayAllowed : undefined,
        fixedServiceFee: productType === 'field_service' ? fixedServiceFee : undefined,
        serviceRadiusKm: productType === 'field_service' ? serviceRadiusKm : undefined,
        isOnSiteService: productType === 'field_service' ? isOnSiteService : undefined,
        // TamDijital Alanları
        digitalFileName: productType === 'digital_download' ? digitalFileName : undefined,
        digitalFileSize: productType === 'digital_download' ? digitalFileSize : undefined,
        digitalFileUrl: productType === 'digital_download' ? digitalFileUrl : undefined,
        digitalFormats: productType === 'digital_download' ? digitalFormats : undefined,
        licenseType: productType === 'digital_download' ? licenseType : undefined,
        // TamSeans Alanları
        sessionDurationMin: productType === 'online_session' ? sessionDurationMin : undefined,
        availableDays: productType === 'online_session' ? availableDays : undefined,
        availableHours: productType === 'online_session' ? availableHours : undefined,
        sessionChannel: productType === 'online_session' ? sessionChannel : undefined,
        meetingLink: productType === 'online_session' ? meetingLink : undefined,
        expertTitle: productType === 'online_session' ? expertTitle : undefined
      },
      // B2B & Dropshipping
      isB2BOnly: isB2BAvailable ? isB2BOnly : false,
      b2bMinQty: isB2BAvailable ? Number(b2bMinQty) : undefined,
      b2bUnitType: isB2BAvailable ? b2bUnitType : undefined,
      b2bWholesalePrice: isB2BAvailable ? Number(b2bWholesalePrice) : undefined,
      b2bTieredPricing: isB2BAvailable ? b2bTieredPricing : undefined,
      allowDropshipping: isB2BAvailable ? allowDropshipping : undefined,
      suggestedRetailPrice: isB2BAvailable && allowDropshipping ? Number(suggestedRetailPrice) : undefined,
      // Dinamik Ölçü Birimi & Özelleştirme Seçenekleri
      customizationOptions: (
        measurementUnit !== 'adet' || 
        foodCustomizationEnabled || 
        fileUploadEnabled || 
        customFormEnabled
      ) ? {
        measurement: {
          unit: measurementUnit,
          minQuantity: measurementMin,
          stepQuantity: measurementStep,
          unitLabel: measurementUnitLabel || (measurementUnit === 'kg' ? 'Kg' : measurementUnit),
          pricePerUnitMultiplier: priceMultiplier
        },
        foodCustomization: foodCustomizationEnabled ? {
          enabled: true,
          removableIngredients,
          extraIngredients,
          mandatoryGroups
        } : undefined,
        fileUpload: fileUploadEnabled ? {
          enabled: true,
          title: fileUploadTitle,
          description: fileUploadDesc,
          allowedFormats: fileUploadFormats,
          minFiles: fileUploadMin,
          maxFiles: fileUploadMax,
          maxSizeMB: fileUploadMaxSize,
          required: fileUploadRequired
        } : undefined,
        customForm: customFormEnabled ? {
          enabled: true,
          title: customFormTitle,
          description: customFormDesc,
          fields: customFormFields
        } : undefined
      } : undefined
    };

    onSaveProduct(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* MODAL HEADER */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-full">
                  Pazaryeri & ERP Sihirbazı
                </span>
                <span className="text-[10px] font-bold text-slate-400">TamPazar Kurumsal Standart</span>
              </div>
              <h2 className="text-base font-black text-slate-900 mt-0.5">
                Yeni Ürün veya Hizmet Tanımla
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-200/70 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* WIZARD TABS NAVIGATION */}
        <div className="flex border-b border-slate-200 bg-white px-6 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('basic')}
            className={`py-3 px-4 text-xs font-black border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'basic' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full text-[11px] flex items-center justify-center bg-slate-100 text-slate-700 font-mono">1</span>
            Temel Bilgiler
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`py-3 px-4 text-xs font-black border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'pricing' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full text-[11px] flex items-center justify-center bg-slate-100 text-slate-700 font-mono">2</span>
            Fiyat, KDV & Muhasebe
          </button>

          <button
            onClick={() => setActiveTab('variants')}
            className={`py-3 px-4 text-xs font-black border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'variants' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full text-[11px] flex items-center justify-center bg-slate-100 text-slate-700 font-mono">3</span>
            Varyantlar & Barkodlar
          </button>

          <button
            onClick={() => setActiveTab('logistics')}
            className={`py-3 px-4 text-xs font-black border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'logistics' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full text-[11px] flex items-center justify-center bg-slate-100 text-slate-700 font-mono">4</span>
            Teslimat & Lojistik Modeli
          </button>

          <button
            onClick={() => setActiveTab('b2b')}
            className={`py-3 px-4 text-xs font-black border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'b2b' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full text-[11px] flex items-center justify-center bg-amber-100 text-amber-900 font-mono">5</span>
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              B2B & Dropshipping
            </span>
          </button>

          <button
            onClick={() => setActiveTab('customization')}
            className={`py-3 px-4 text-xs font-black border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'customization' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full text-[11px] flex items-center justify-center bg-indigo-100 text-indigo-900 font-mono">6</span>
            <span className="flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-indigo-600" />
              Ölçü Birimi & Müşteri Seçenekleri
            </span>
          </button>
        </div>

        {/* VALIDATION BANNER */}
        {validationError && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-bold animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* ================= TAB 1: TEMEL BİLGİLER ================= */}
          {activeTab === 'basic' && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Ürün Adı */}
                <div className="md:col-span-2">
                  <label className="font-bold text-slate-800 block mb-1">
                    Ürün / Hizmet Başlığı <span className="text-rose-600 font-black">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Örn: El Yapımı Hakiki Deri Erkek Botu - Karadeniz Serisi"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:border-indigo-600 focus:bg-white transition"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Arama sonuçlarında ve Google SEO motorunda öne çıkacak ana başlık.
                  </span>
                </div>

                {/* Kategori */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Ana Kategori <span className="text-rose-600 font-black">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-indigo-600 cursor-pointer"
                  >
                    <option value="Giyim & Ayakkabı">Giyim & Ayakkabı</option>
                    <option value="Elektronik & Aksesuar">Elektronik & Aksesuar</option>
                    <option value="Yiyecek & Yöresel Lezzetler">Yiyecek & Yöresel Lezzetler</option>
                    <option value="Ev, Yaşam & Kırtasiye">Ev, Yaşam & Kırtasiye</option>
                    <option value="Zanaat & El Yapımı">Zanaat & El Yapımı</option>
                    <option value="Teknik Hizmet & Usta">Teknik Hizmet & Usta</option>
                    <option value="B2B Toptan Tedarik">B2B Toptan Tedarik</option>
                  </select>
                </div>

                {/* Alt Kategori */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Alt Kategori
                  </label>
                  <input
                    type="text"
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    placeholder="Örn: Günlük Ayakkabı / Doğa Yürüyüşü"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:border-indigo-600"
                  />
                </div>

                {/* Marka & Model No */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Marka / Üretici</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Örn: Zanaatkâr Usta veya Markanız"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Model / Seri No</label>
                  <input
                    type="text"
                    value={modelNo}
                    onChange={(e) => setModelNo(e.target.value)}
                    placeholder="Örn: MD-2026-X"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:border-indigo-600"
                  />
                </div>

                {/* Zengin Açıklama */}
                <div className="md:col-span-2">
                  <label className="font-bold text-slate-800 block mb-1">
                    Detaylı Ürün Açıklaması & Özellikleri
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ürünün kumaşı, materyali, kullanım talimatları ve öne çıkan zanaatkârlık detayları..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none focus:border-indigo-600 focus:bg-white transition"
                  />
                </div>

                {/* Çoklu Görsel Yükleme & Galeri */}
                <div className="md:col-span-2 bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-black text-slate-900 block">Ürün Görsel Galerisi (Çoklu Fotoğraf)</span>
                      <span className="text-[11px] text-slate-500">Yıldızlı görsel ana vitrin kapak fotoğrafı olarak kullanılır.</span>
                    </div>
                  </div>

                  {/* URL Ekleme */}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Görsel URL bağlantısı yapıştırın (https://...)..."
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Ekle
                    </button>
                  </div>

                  {/* Galeri Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {images.map((img, idx) => (
                      <div 
                        key={idx} 
                        className={`relative rounded-xl overflow-hidden border-2 transition group bg-white ${
                          coverImageIndex === idx ? 'border-amber-500 shadow-md ring-2 ring-amber-400/20' : 'border-slate-200'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-24 object-cover" />
                        
                        {/* Kapak Görseli Rozeti */}
                        {coverImageIndex === idx && (
                          <div className="absolute top-1.5 left-1.5 bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded text-[9px] font-black flex items-center gap-1 shadow">
                            <Star className="w-2.5 h-2.5 fill-slate-950" /> KAPAK
                          </div>
                        )}

                        {/* Aksiyonlar */}
                        <div className="absolute bottom-1 right-1 flex items-center gap-1">
                          {coverImageIndex !== idx && (
                            <button
                              type="button"
                              onClick={() => setCoverImageIndex(idx)}
                              className="p-1 bg-white/90 hover:bg-white text-slate-700 rounded shadow cursor-pointer"
                              title="Kapak Yap"
                            >
                              <Star className="w-3 h-3 text-amber-500" />
                            </button>
                          )}
                          {images.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="p-1 bg-white/90 hover:bg-white text-rose-600 rounded shadow cursor-pointer"
                              title="Sil"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ================= TAB 2: FİYAT, KDV & MUHASEBE ================= */}
          {activeTab === 'pricing' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Alış Fiyatı */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Alış Fiyatı (Maliyet ₺) <span className="text-rose-600 font-black">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={costPrice}
                      onChange={(e) => setCostPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full pl-7 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono text-slate-900 outline-none focus:border-indigo-600"
                    />
                    <span className="absolute left-3 top-2.5 font-bold text-slate-400">₺</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Toptancı veya hammadde birim maliyeti.</span>
                </div>

                {/* Satış Fiyatı */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Satış Fiyatı (Nihai Fiyat ₺) <span className="text-rose-600 font-black">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      value={salePrice}
                      onChange={(e) => setSalePrice(Math.max(1, parseFloat(e.target.value) || 0))}
                      className="w-full pl-7 pr-3 py-2.5 bg-slate-50 border border-indigo-300 rounded-xl font-black font-mono text-indigo-900 outline-none focus:border-indigo-600 text-sm"
                    />
                    <span className="absolute left-3 top-2.5 font-bold text-indigo-500">₺</span>
                  </div>
                  <span className="text-[10px] text-indigo-600 font-semibold mt-1 block">Müşterinin sepette ödeyeceği tutar.</span>
                </div>

                {/* Liste Fiyatı (Çizili) */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Piyasa / Çizili Liste Fiyatı
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={listPrice}
                      onChange={(e) => setListPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full pl-7 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium font-mono text-slate-500 outline-none focus:border-indigo-600"
                    />
                    <span className="absolute left-3 top-2.5 font-bold text-slate-400">₺</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">İndirim algısı için üstü çizilecek fiyat.</span>
                </div>

                {/* KDV Oranı */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    KDV Oranı <span className="text-rose-600 font-black">*</span>
                  </label>
                  <select
                    value={vatRate}
                    onChange={(e) => setVatRate(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none cursor-pointer"
                  >
                    <option value={1}>%1 (Temel Gıda / Tarım Ürünleri)</option>
                    <option value={10}>%10 (Gıda, İlaç, Hizmet)</option>
                    <option value={20}>%20 (Genel Standart KDV Oranı)</option>
                  </select>
                </div>

                {/* Stopaj / Tevkifat Kodu */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Tevkifat / Stopaj Kodu
                  </label>
                  <select
                    value={withholdingCode}
                    onChange={(e) => setWithholdingCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 outline-none cursor-pointer"
                  >
                    <option value="Yok">Tevkifat Uygulanmaz (Standart)</option>
                    <option value="2/10">2/10 Tevkifat (Temizlik, Bahçe Bakımı)</option>
                    <option value="5/10">5/10 Tevkifat (Özel Güvenlik, Danışmanlık)</option>
                    <option value="7/10">7/10 Tevkifat (Yapı Denetim vb.)</option>
                    <option value="9/10">9/10 Tevkifat (İşgücü Temin Hizmetleri)</option>
                  </select>
                </div>

                {/* Ana Stok Kodu (SKU) */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Stok Kodu (SKU) <span className="text-rose-600 font-black">*</span>
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 outline-none"
                  />
                </div>

                {/* Stok Adedi ve Kritik Alarm */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Mevcut Stok Adedi</label>
                  <input
                    type="number"
                    min={0}
                    value={stockCount}
                    onChange={(e) => setStockCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Kritik Stok Eşiği (Alarm)</label>
                  <input
                    type="number"
                    min={1}
                    value={criticalStockThreshold}
                    onChange={(e) => setCriticalStockThreshold(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono text-slate-900 outline-none"
                  />
                </div>

              </div>

              {/* CANLI KÂR MARJI HESAPLAMA KARTI */}
              <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h4 className="font-black text-sm text-white">Anlık Kâr Marjı & Finansal Matris</h4>
                      <p className="text-[11px] text-slate-400">GİB e-Fatura ve muhasebe net dökümü</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${
                    netProfitTL > 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {profitMarginPercent.toFixed(1)}% Kâr Marjı
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="bg-slate-800/60 p-3 rounded-2xl">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Birim Maliyet</span>
                    <span className="text-base font-black text-slate-200 font-mono mt-0.5 block">{costPrice.toLocaleString('tr-TR')} ₺</span>
                  </div>

                  <div className="bg-slate-800/60 p-3 rounded-2xl">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">KDV ({vatRate}%)</span>
                    <span className="text-base font-black text-amber-400 font-mono mt-0.5 block">{calculatedVatAmount.toFixed(2)} ₺</span>
                  </div>

                  <div className="bg-slate-800/60 p-3 rounded-2xl">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">TamPazar Komisyonu</span>
                    <span className="text-base font-black text-emerald-400 font-mono mt-0.5 block">0,00 ₺ (%0)</span>
                  </div>

                  <div className="bg-slate-800/90 p-3 rounded-2xl border border-emerald-500/30">
                    <span className="text-[10px] text-emerald-400 font-black block uppercase">NET KÂR</span>
                    <span className="text-base font-black text-emerald-400 font-mono mt-0.5 block">{netProfitTL.toFixed(2)} ₺</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= TAB 3: VARYANTLAR & BARKODLAR ================= */}
          {activeTab === 'variants' && (
            <div className="space-y-6 animate-fade-in">
              {/* Varyant Aç / Kapa */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="font-black text-slate-900 block">Bu ürünün beden, renk veya ölçü varyantları var mı?</span>
                  <span className="text-[11px] text-slate-500">TamPazar çoklu seçenek mimarisi ve her varyant için ayrı barkod/stok takibi.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setHasVariants(!hasVariants)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    hasVariants ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      hasVariants ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {hasVariants && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Beden / Numara Özellik Tanımı */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                    <label className="font-bold text-slate-800 block">Beden / Ölçü Seçenekleri:</label>
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {sizeOptions.map(size => (
                        <span key={size} className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-800 font-bold rounded-lg flex items-center gap-1.5 text-xs">
                          {size}
                          <button type="button" onClick={() => handleRemoveSizeTag(size)} className="hover:text-rose-600 cursor-pointer">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={newSizeTag}
                          onChange={(e) => setNewSizeTag(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSizeTag())}
                          placeholder="Örn: 44, M, XL..."
                          className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs w-28 outline-none"
                        />
                        <button type="button" onClick={handleAddSizeTag} className="px-2 py-1 bg-slate-800 text-white rounded-lg font-bold text-xs cursor-pointer">
                          + Ekle
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Renk Özellik Tanımı */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                    <label className="font-bold text-slate-800 block">Renk Seçenekleri:</label>
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {colorOptions.map(col => (
                        <span key={col} className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 font-bold rounded-lg flex items-center gap-1.5 text-xs">
                          {col}
                          <button type="button" onClick={() => handleRemoveColorTag(col)} className="hover:text-rose-600 cursor-pointer">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={newColorTag}
                          onChange={(e) => setNewColorTag(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColorTag())}
                          placeholder="Örn: Haki, Lacivert..."
                          className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs w-32 outline-none"
                        />
                        <button type="button" onClick={handleAddColorTag} className="px-2 py-1 bg-slate-800 text-white rounded-lg font-bold text-xs cursor-pointer">
                          + Ekle
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* DİNAMİK VARYANT KOMBİNASYON MATRİSİ */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                    <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                      <span className="font-black text-slate-900 text-xs">
                        Varyant Kombinasyon & Barkod Matrisi ({variantMatrix.length} Varyant)
                      </span>
                      <button
                        type="button"
                        onClick={() => regenerateMatrix(sizeOptions, colorOptions)}
                        className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" /> Matrisi Yeniden Üret
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100/75 text-slate-600 font-bold border-b border-slate-200">
                          <tr>
                            <th className="py-2.5 px-3">Varyant (Beden/Renk)</th>
                            <th className="py-2.5 px-3">Varyant SKU</th>
                            <th className="py-2.5 px-3">Barkod (EAN-13)</th>
                            <th className="py-2.5 px-3">Stok</th>
                            <th className="py-2.5 px-3">Fiyat Farkı (₺)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {variantMatrix.map(row => (
                            <tr key={row.id} className="hover:bg-slate-50/80 transition">
                              <td className="py-2.5 px-3 font-bold text-slate-900">
                                {row.size} / {row.color}
                              </td>
                              <td className="py-2.5 px-3">
                                <input
                                  type="text"
                                  value={row.sku}
                                  onChange={(e) => handleUpdateMatrixRow(row.id, 'sku', e.target.value)}
                                  className="w-28 px-2 py-1 bg-white border border-slate-200 rounded font-mono text-xs outline-none"
                                />
                              </td>
                              <td className="py-2.5 px-3">
                                <input
                                  type="text"
                                  value={row.barcode}
                                  onChange={(e) => handleUpdateMatrixRow(row.id, 'barcode', e.target.value)}
                                  className="w-32 px-2 py-1 bg-white border border-slate-200 rounded font-mono text-xs outline-none"
                                />
                              </td>
                              <td className="py-2.5 px-3">
                                <input
                                  type="number"
                                  min={0}
                                  value={row.stock}
                                  onChange={(e) => handleUpdateMatrixRow(row.id, 'stock', parseInt(e.target.value) || 0)}
                                  className="w-16 px-2 py-1 bg-white border border-slate-200 rounded font-bold font-mono text-xs outline-none"
                                />
                              </td>
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    value={row.priceDiff}
                                    onChange={(e) => handleUpdateMatrixRow(row.id, 'priceDiff', parseFloat(e.target.value) || 0)}
                                    className="w-20 px-2 py-1 bg-white border border-slate-200 rounded font-bold font-mono text-xs outline-none"
                                  />
                                  <span className="text-[10px] text-slate-400">₺</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {!hasVariants && (
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 text-center space-y-2">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-xs flex items-center justify-center mx-auto text-slate-400 border border-slate-200">
                    <Tag className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800">Tekil / Standart Ürün</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Bu ürün için varyant tanımlanmadı. Ana stok ({stockCount} adet) ve ana SKU geçerlidir.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 4: TESLİMAT, LOJİSTİK & KARGO ================= */}
          {activeTab === 'logistics' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Ürün Tipi Seçimi (5 Temel Ticaret Bacağı) */}
              <div>
                <label className="font-black text-slate-900 block mb-2">
                  Teslimat & Hizmet Modeli Seçimi:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  
                  {/* 1. Fiziksel Kargo */}
                  <div
                    onClick={() => setProductType('physical_cargo')}
                    className={`p-3.5 rounded-2xl border-2 transition cursor-pointer space-y-1.5 ${
                      productType === 'physical_cargo' 
                        ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/10' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Truck className={`w-5 h-5 ${productType === 'physical_cargo' ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded">
                        TamKargo
                      </span>
                    </div>
                    <strong className="text-xs font-black text-slate-900 block">TamKargo (Ulusal Gönderi)</strong>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Yurtiçi, Aras, MNG veya PTT kargo anlaşması ile tüm Türkiye'ye sevk edilir.
                    </p>
                  </div>

                  {/* 2. Yerel Yemek / Market */}
                  <div
                    onClick={() => setProductType('local_express')}
                    className={`p-3.5 rounded-2xl border-2 transition cursor-pointer space-y-1.5 ${
                      productType === 'local_express' 
                        ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-400/10' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Package className={`w-5 h-5 ${productType === 'local_express' ? 'text-amber-600' : 'text-slate-400'}`} />
                      <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                        TamHızlı (Zil)
                      </span>
                    </div>
                    <strong className="text-xs font-black text-slate-900 block">TamHızlı (Ekspres & Zil)</strong>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      30-45 dk anlık kurye teslimatı veya işletmeden Gel-Al (Takeaway) modeli.
                    </p>
                  </div>

                  {/* 3. Saha Hizmeti */}
                  <div
                    onClick={() => setProductType('field_service')}
                    className={`p-3.5 rounded-2xl border-2 transition cursor-pointer space-y-1.5 ${
                      productType === 'field_service' 
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/10' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <ShieldCheck className={`w-5 h-5 ${productType === 'field_service' ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                        TamUsta
                      </span>
                    </div>
                    <strong className="text-xs font-black text-slate-900 block">TamUsta (Yerinde Servis)</strong>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Tesisat, montaj, çekici, çilingir gibi konuma usta yönlendirme servisi.
                    </p>
                  </div>

                  {/* 4. DİJİTAL DOSYA İNDİRME (Etsy & Gumroad Modeli) */}
                  <div
                    onClick={() => setProductType('digital_download')}
                    className={`p-3.5 rounded-2xl border-2 transition cursor-pointer space-y-1.5 ${
                      productType === 'digital_download' 
                        ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-500/15' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Download className={`w-5 h-5 ${productType === 'digital_download' ? 'text-purple-600' : 'text-slate-400'}`} />
                      <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                        TamDijital
                      </span>
                    </div>
                    <strong className="text-xs font-black text-slate-900 block">TamDijital (İndirilebilir Dosya)</strong>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Nakış (DST/PES), CNC Lazer (DXF/SVG), 3D STL, e-Kitap ve tasarım şablonları.
                    </p>
                  </div>

                  {/* 5. UZAKTAN CANLI SEANS (Superpeer Modeli) */}
                  <div
                    onClick={() => setProductType('online_session')}
                    className={`p-3.5 rounded-2xl border-2 transition cursor-pointer space-y-1.5 ${
                      productType === 'online_session' 
                        ? 'border-cyan-600 bg-cyan-50/70 ring-2 ring-cyan-500/15' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Video className={`w-5 h-5 ${productType === 'online_session' ? 'text-cyan-600' : 'text-slate-400'}`} />
                      <span className="text-[10px] font-black uppercase text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded">
                        TamSeans
                      </span>
                    </div>
                    <strong className="text-xs font-black text-slate-900 block">TamSeans (Canlı Görüşme)</strong>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Online psikolog, özel ders, diyetisyen ve uzman danışmanlık randevuları.
                    </p>
                  </div>

                </div>
              </div>

              {/* Fiziksel Kargo Detayları */}
              {productType === 'physical_cargo' && (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 animate-fade-in">
                  <h4 className="font-black text-slate-900">Kargo & Desi Yapılandırması</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Paket Desisi</label>
                      <input
                        type="number"
                        min={0.5}
                        step={0.5}
                        value={desi}
                        onChange={(e) => setDesi(parseFloat(e.target.value) || 1)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900 outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Anlaşmalı Kargo Firması</label>
                      <select
                        value={carrierCompany}
                        onChange={(e) => setCarrierCompany(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 outline-none cursor-pointer"
                      >
                        <option value="Yurtiçi Kargo">Yurtiçi Kargo (TamPazar Anlaşmalı)</option>
                        <option value="Aras Kargo">Aras Kargo (İndirimli Sevk)</option>
                        <option value="MNG Kargo">MNG Kargo Entegrasyonu</option>
                        <option value="PTT Kargo">PTT Kargo Resmi Hat</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3 pt-5">
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                        <input
                          type="checkbox"
                          checked={isFreeShipping}
                          onChange={(e) => setIsFreeShipping(e.target.checked)}
                          className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                        />
                        <span>Ücretsiz Kargo (Satıcı Öder)</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Yerel Express Detayları */}
              {productType === 'local_express' && (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 animate-fade-in">
                  <h4 className="font-black text-slate-900">Yerel Kurye & Gel-Al Ayarları</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Ortalama Teslimat Süresi</label>
                      <input
                        type="text"
                        value={localDeliveryTime}
                        onChange={(e) => setLocalDeliveryTime(e.target.value)}
                        placeholder="Örn: 30-45 Dk"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Minimum Paket Tutarı (₺)</label>
                      <input
                        type="number"
                        min={0}
                        value={minBasketAmount}
                        onChange={(e) => setMinBasketAmount(parseFloat(e.target.value) || 0)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold font-mono text-slate-900 outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-5">
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                        <input
                          type="checkbox"
                          checked={isTakeawayAllowed}
                          onChange={(e) => setIsTakeawayAllowed(e.target.checked)}
                          className="w-4 h-4 text-amber-600 rounded cursor-pointer"
                        />
                        <span>Gel-Al (Takeaway) Aktif</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Saha Hizmeti Detayları */}
              {productType === 'field_service' && (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 animate-fade-in">
                  <h4 className="font-black text-slate-900">Saha Hizmeti & Konum Servis Parametreleri</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Sabit Servis / Çağrı Ücreti (₺)</label>
                      <input
                        type="number"
                        min={0}
                        value={fixedServiceFee}
                        onChange={(e) => setFixedServiceFee(parseFloat(e.target.value) || 0)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold font-mono text-slate-900 outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Hizmet Yarıçapı (KM)</label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={serviceRadiusKm}
                        onChange={(e) => setServiceRadiusKm(parseInt(e.target.value) || 15)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold font-mono text-slate-900 outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-5">
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                        <input
                          type="checkbox"
                          checked={isOnSiteService}
                          onChange={(e) => setIsOnSiteService(e.target.checked)}
                          className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                        />
                        <span>Müşteri Adresine Git (Mobil Usta)</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* TamDijital (Etsy & Gumroad Modeli) Detayları */}
              {productType === 'digital_download' && (
                <div className="bg-purple-50/50 p-5 rounded-2xl border border-purple-200 space-y-5 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-purple-100">
                    <div className="flex items-center gap-2">
                      <Download className="w-5 h-5 text-purple-600" />
                      <h4 className="font-black text-purple-950">TamDijital Dosya ve Lisans Yapılandırması</h4>
                    </div>
                    <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2.5 py-1 rounded-full">
                      Kargo Adresi İstenmez • Anında Teslim
                    </span>
                  </div>

                  {/* Dosya Bilgileri */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-800 block mb-1 text-xs">
                        Dijital Dosya Adı / Arşiv Başlığı
                      </label>
                      <input
                        type="text"
                        value={digitalFileName}
                        onChange={(e) => setDigitalFileName(e.target.value)}
                        placeholder="Örn: Maras_Nakis_Paketi_v2.zip"
                        className="w-full px-3.5 py-2.5 bg-white border border-purple-200 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-purple-400 outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1 text-xs">
                        Dosya Boyutu (MB veya GB)
                      </label>
                      <input
                        type="text"
                        value={digitalFileSize}
                        onChange={(e) => setDigitalFileSize(e.target.value)}
                        placeholder="Örn: 14.8 MB"
                        className="w-full px-3.5 py-2.5 bg-white border border-purple-200 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-purple-400 outline-none"
                      />
                    </div>
                  </div>

                  {/* Güvenli Dosya URL'i veya Yükleme */}
                  <div>
                    <label className="font-bold text-slate-800 block mb-1 text-xs">
                      Güvenli Dosya İndirme Bağlantısı / Sunucu Depolama URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={digitalFileUrl}
                        onChange={(e) => setDigitalFileUrl(e.target.value)}
                        placeholder="https://storage.tampazar.com/dijital/dosya.zip veya Google Drive / Dropbox linki"
                        className="flex-1 px-3.5 py-2.5 bg-white border border-purple-200 rounded-xl text-xs font-mono text-slate-900 focus:ring-2 focus:ring-purple-400 outline-none"
                      />
                      <label className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shrink-0 shadow-xs">
                        <Upload className="w-4 h-4" />
                        <span>Dosya Seç</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setDigitalFileName(file.name);
                              setDigitalFileSize((file.size / (1024 * 1024)).toFixed(1) + ' MB');
                              setDigitalFileUrl('https://storage.tampazar.com/uploads/' + encodeURIComponent(file.name));
                            }
                          }}
                        />
                      </label>
                    </div>
                    <p className="text-[11px] text-purple-700/80 mt-1">
                      Desteklenen formatlar: ZIP, PDF, DST, PES, JEF, DXF, SVG, STL, OBJ, CDR, PSD, AI.
                    </p>
                  </div>

                  {/* Dosya Formatı Etiketleri */}
                  <div>
                    <label className="font-bold text-slate-800 block mb-1 text-xs">
                      Paket İçi Format Etiketleri (Örn: DST, PES, SVG, STL, PDF)
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {digitalFormats.map((fmt, idx) => (
                        <span 
                          key={idx} 
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-800 font-bold text-xs rounded-lg border border-purple-200"
                        >
                          {fmt}
                          <button 
                            type="button" 
                            onClick={() => setDigitalFormats(digitalFormats.filter((_, i) => i !== idx))}
                            className="hover:text-red-600 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newFormatInput}
                        onChange={(e) => setNewFormatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newFormatInput.trim() && !digitalFormats.includes(newFormatInput.trim().toUpperCase())) {
                              setDigitalFormats([...digitalFormats, newFormatInput.trim().toUpperCase()]);
                              setNewFormatInput('');
                            }
                          }
                        }}
                        placeholder="Yeni format ekle (örn: STL, DXF, PDF) ve Enter'a bas"
                        className="flex-1 px-3.5 py-2 bg-white border border-purple-200 rounded-xl text-xs font-bold text-slate-900 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newFormatInput.trim() && !digitalFormats.includes(newFormatInput.trim().toUpperCase())) {
                            setDigitalFormats([...digitalFormats, newFormatInput.trim().toUpperCase()]);
                            setNewFormatInput('');
                          }
                        }}
                        className="px-3.5 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs rounded-xl cursor-pointer transition"
                      >
                        + Ekle
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[11px] text-slate-500">Hızlı Ekle:</span>
                      {['DST', 'PES', 'DXF', 'SVG', 'STL', 'PDF', 'ZIP'].map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            if (!digitalFormats.includes(tag)) setDigitalFormats([...digitalFormats, tag]);
                          }}
                          className="text-[10px] bg-white border border-purple-200 hover:border-purple-400 text-purple-700 px-2 py-0.5 rounded cursor-pointer transition font-mono"
                        >
                          +{tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Lisans Tipi */}
                  <div>
                    <label className="font-bold text-slate-800 block mb-2 text-xs">
                      Lisans & Kullanım Hakları:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div
                        onClick={() => setLicenseType('personal')}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition ${
                          licenseType === 'personal'
                            ? 'border-purple-600 bg-white ring-2 ring-purple-500/20'
                            : 'border-purple-100 bg-white/60 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <strong className="text-xs font-black text-slate-900">Kişisel Kullanım Lisansı</strong>
                          {licenseType === 'personal' && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          Alıcı yalnızca kendi şahsi hobisi/projeleri için kullanabilir. Seri üretim ve yeniden satış yasaktır.
                        </p>
                      </div>

                      <div
                        onClick={() => setLicenseType('commercial')}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition ${
                          licenseType === 'commercial'
                            ? 'border-purple-600 bg-white ring-2 ring-purple-500/20'
                            : 'border-purple-100 bg-white/60 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <strong className="text-xs font-black text-slate-900">Ticari Üretime Uygun Lisans</strong>
                          {licenseType === 'commercial' && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          Atölye ve imalathanelerde fiziksel son ürün (nakışlı kıyafet, kesilmiş ahşap, 3D baskı vb.) üretip satmaya tam izinlidir.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-100/60 rounded-xl text-purple-900 text-xs flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>
                      Bu ürün satın alındığında alıcıya fiziksel kargo sorulmaz; ödeme onaylandığı an <strong>Dosyayı Hemen İndir</strong> butonu açılır.
                    </span>
                  </div>
                </div>
              )}

              {/* TamSeans (Superpeer & Calendly Modeli) Detayları */}
              {productType === 'online_session' && (
                <div className="bg-cyan-50/50 p-5 rounded-2xl border border-cyan-200 space-y-5 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-cyan-100">
                    <div className="flex items-center gap-2">
                      <Video className="w-5 h-5 text-cyan-600" />
                      <h4 className="font-black text-cyan-950">TamSeans Randevu ve Canlı Görüşme Ayarları</h4>
                    </div>
                    <span className="text-xs bg-cyan-100 text-cyan-800 font-bold px-2.5 py-1 rounded-full">
                      Canlı Video & Takvim Entegrasyonu
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Seans Süresi */}
                    <div>
                      <label className="font-bold text-slate-800 block mb-1 text-xs">
                        Görüşme / Seans Süresi:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[30, 45, 60].map((dur) => (
                          <button
                            key={dur}
                            type="button"
                            onClick={() => setSessionDurationMin(dur as 30 | 45 | 60)}
                            className={`py-2 px-3 rounded-xl font-black text-xs transition cursor-pointer border ${
                              sessionDurationMin === dur
                                ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                                : 'bg-white text-slate-700 border-cyan-200 hover:bg-cyan-50'
                            }`}
                          >
                            {dur} Dakika
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Uzman Unvanı */}
                    <div>
                      <label className="font-bold text-slate-800 block mb-1 text-xs">
                        Görüşmeyi Yürütecek Uzman / Eğitmen Unvanı
                      </label>
                      <input
                        type="text"
                        value={expertTitle}
                        onChange={(e) => setExpertTitle(e.target.value)}
                        placeholder="Örn: Uzman Psikolog, E-Ticaret Danışmanı"
                        className="w-full px-3.5 py-2.5 bg-white border border-cyan-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                    </div>
                  </div>

                  {/* Görüşme Kanalı */}
                  <div>
                    <label className="font-bold text-slate-800 block mb-2 text-xs">
                      Tercih Edilen Canlı Görüşme Kanalı:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: 'google_meet', label: 'Google Meet', desc: 'Otomatik toplantı odası oluşturur', icon: Globe },
                        { id: 'zoom', label: 'Zoom Video', desc: 'Sabit Zoom oda linkiniz', icon: Video },
                        { id: 'whatsapp_phone', label: 'Telefon / WhatsApp', desc: 'Sesli veya görüntülü direkt arama', icon: Clock }
                      ].map(chan => {
                        const Icon = chan.icon;
                        return (
                          <div
                            key={chan.id}
                            onClick={() => setSessionChannel(chan.id as any)}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition ${
                              sessionChannel === chan.id
                                ? 'border-cyan-600 bg-white ring-2 ring-cyan-500/20'
                                : 'border-cyan-100 bg-white/60 hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 mb-1">
                              <Icon className="w-4 h-4 text-cyan-600" />
                              <strong className="text-xs font-bold text-slate-900">{chan.label}</strong>
                            </div>
                            <p className="text-[10px] text-slate-500">{chan.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Görüşme Linki */}
                  <div>
                    <label className="font-bold text-slate-800 block mb-1 text-xs">
                      Sabit Toplantı Bağlantısı (Google Meet / Zoom URL):
                    </label>
                    <input
                      type="text"
                      value={meetingLink}
                      onChange={(e) => setMeetingLink(e.target.value)}
                      placeholder="https://meet.google.com/xyz-abcd-efg"
                      className="w-full px-3.5 py-2 bg-white border border-cyan-200 rounded-xl text-xs font-mono text-slate-900 outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  {/* Haftalık Müsait Günler */}
                  <div>
                    <label className="font-bold text-slate-800 block mb-1 text-xs">
                      Haftalık Müsait Günler:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'].map(day => {
                        const isSelected = availableDays.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setAvailableDays(availableDays.filter(d => d !== day));
                              } else {
                                setAvailableDays([...availableDays, day]);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition border ${
                              isSelected
                                ? 'bg-cyan-600 text-white border-cyan-600'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-cyan-300'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Günlük Saat Dilimleri */}
                  <div>
                    <label className="font-bold text-slate-800 block mb-1 text-xs">
                      Müsait Seans Saat Aralıkları:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {['09:00', '10:00', '11:30', '13:00', '14:00', '15:30', '17:00', '18:30', '20:00'].map(slot => {
                        const isSelected = availableHours.includes(slot);
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setAvailableHours(availableHours.filter(s => s !== slot));
                              } else {
                                setAvailableHours([...availableHours, slot]);
                              }
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition border ${
                              isSelected
                                ? 'bg-cyan-100 text-cyan-800 border-cyan-300'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-cyan-300'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-3 bg-cyan-100/60 rounded-xl text-cyan-900 text-xs flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-cyan-600 shrink-0" />
                    <span>
                      Müşteri ürün sayfasında "Sepete Ekle" yerine doğrudan <strong>Tarih ve Saat</strong> seçerek randevusunu onaylar.
                    </span>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 5: B2B TOPTAN SATIŞ & DROPSHIPPING (FAIRE & SPOCKET MODELİ) */}
          {activeTab === 'b2b' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0 shadow-sm">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    B2B Toptan Ticaret & Esnaftan Esnafa Dropshipping Ağı
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Ürününüzü toptan paket, koli veya seri olarak diğer perakendeci esnafa satın; dilerseniz diğer mağazaların bu ürünü kendi vitrinlerinde satmalarına (Dropshipping) izin vererek satış ağınızı katlayın.
                  </p>
                </div>
              </div>

              {/* 1. Toptan Satışa Aç Toggle */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Package className="w-4 h-4 text-indigo-600" />
                      Toptan Satışa Aç (B2B Modülü)
                    </label>
                    <p className="text-xs text-slate-500">
                      Bu ürün toptan seri, koli veya minimum adet bazında satışa sunulsun.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isB2BAvailable}
                      onChange={(e) => setIsB2BAvailable(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                {isB2BAvailable && (
                  <div className="pt-4 border-t border-slate-100 space-y-4 animate-fade-in">
                    {/* Yalnızca Mağazalar Görsün (Kapalı Devre) Checkbox */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-900 block">
                          🔒 Yalnızca Onaylı Mağazalar Görsün (Kapalı Devre Toptan)
                        </span>
                        <p className="text-[11px] text-slate-500">
                          Halk perakende fiyatını ve ürünü görmez; yalnızca 'seller' rolündeki doğrulanmış esnaf toptan fiyatıyla satın alabilir.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={isB2BOnly}
                        onChange={(e) => setIsB2BOnly(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                      />
                    </div>

                    {/* Minimum Toptan Alım Adedi & Birim Tipi */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1.5">
                          Minimum Toptan Alım Miktarı:
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={b2bMinQty}
                          onChange={(e) => setB2bMinQty(Math.max(1, Number(e.target.value)))}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500"
                          placeholder="Örn: 10"
                        />
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          Alıcı tek seferde en az bu miktarı sepete ekleyebilir.
                        </span>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-800 block mb-1.5">
                          Toptan Paketleme / Birim Tipi:
                        </label>
                        <select
                          value={b2bUnitType}
                          onChange={(e) => setB2bUnitType(e.target.value as any)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="adet">Adet (Birim Başına)</option>
                          <option value="seri">Seri (Örn: 6'lı Asorti Paket)</option>
                          <option value="koli">Koli (Örn: 8-12 Çift Kutu)</option>
                          <option value="cuval">Çuval (Örn: 50 KG Torba)</option>
                          <option value="paket">Paket (Özel Ambalaj)</option>
                        </select>
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          Sipariş faturası ve sevk irsaliyesine bu birim basılır.
                        </span>
                      </div>
                    </div>

                    {/* Toptan Birim Fiyatı */}
                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1.5">
                        Toptan Taban Birim Fiyatı (TL):
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">₺</span>
                        <input
                          type="number"
                          min={1}
                          value={b2bWholesalePrice}
                          onChange={(e) => setB2bWholesalePrice(Math.max(1, Number(e.target.value)))}
                          className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Kademeli Fiyat Matrisi */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800">
                          Kademeli Toptan Fiyat Matrisi (Toplu Alım İndirimi):
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const lastTier = b2bTieredPricing[b2bTieredPricing.length - 1];
                            const nextMin = lastTier ? (lastTier.maxQty ? lastTier.maxQty + 1 : lastTier.minQty + 50) : 50;
                            setB2bTieredPricing([
                              ...b2bTieredPricing,
                              { minQty: nextMin, maxQty: null, price: Math.max(1, b2bWholesalePrice - 50) }
                            ]);
                          }}
                          className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Kademe Ekle
                        </button>
                      </div>

                      <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                        {b2bTieredPricing.map((tier, idx) => (
                          <div key={idx} className="p-2.5 bg-slate-50 flex items-center gap-3 text-xs">
                            <span className="font-mono text-slate-500 text-[11px] w-6">#{idx + 1}</span>
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                type="number"
                                min={1}
                                value={tier.minQty}
                                onChange={(e) => {
                                  const updated = [...b2bTieredPricing];
                                  updated[idx].minQty = Number(e.target.value);
                                  setB2bTieredPricing(updated);
                                }}
                                className="w-16 px-2 py-1 bg-white border border-slate-200 rounded text-center font-bold"
                              />
                              <span className="text-slate-400">-</span>
                              <input
                                type="number"
                                placeholder="Sınırsız"
                                value={tier.maxQty || ''}
                                onChange={(e) => {
                                  const updated = [...b2bTieredPricing];
                                  updated[idx].maxQty = e.target.value ? Number(e.target.value) : null;
                                  setB2bTieredPricing(updated);
                                }}
                                className="w-20 px-2 py-1 bg-white border border-slate-200 rounded text-center font-bold"
                              />
                              <span className="text-slate-500 font-semibold">{b2bUnitType} arası</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-400">Birim:</span>
                              <input
                                type="number"
                                value={tier.price}
                                onChange={(e) => {
                                  const updated = [...b2bTieredPricing];
                                  updated[idx].price = Number(e.target.value);
                                  setB2bTieredPricing(updated);
                                }}
                                className="w-24 px-2 py-1 bg-white border border-slate-200 rounded font-bold text-emerald-600 text-right"
                              />
                              <span className="font-bold text-slate-600">₺</span>
                            </div>
                            {b2bTieredPricing.length > 1 && (
                              <button
                                type="button"
                                onClick={() => setB2bTieredPricing(b2bTieredPricing.filter((_, i) => i !== idx))}
                                className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Dropshipping'e İzin Ver Toggle (Faire & Spocket Modeli) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      Esnaftan Esnafa Dropshipping'e İzin Ver
                    </label>
                    <p className="text-xs text-slate-500">
                      Diğer TamPazar mağazaları bu ürünü tek tıkla kendi vitrinlerine ekleyip kâr koyarak satabilsin.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowDropshipping}
                      onChange={(e) => setAllowDropshipping(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                {allowDropshipping && (
                  <div className="pt-4 border-t border-slate-100 space-y-4 animate-fade-in">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-xs text-emerald-900">
                      <span className="font-black flex items-center gap-1.5 text-emerald-800">
                        <Check className="w-4 h-4 text-emerald-600" />
                        Beyaz Etiket (White-Label Blind Shipping) Güvencesi
                      </span>
                      <p className="text-[11px] text-emerald-700 leading-relaxed">
                        Sipariş geldiğinde paketleme ve sevk sizin tarafınızdan yapılır; ancak kargo etiketine ve kutu üzerine satışı yapan perakendeci esnafın logosu ve dükkan adı basılır. Toptancı kimliği gizli kalır.
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-800 block mb-1.5">
                        Önerilen Perakende Satış Fiyatı (TL):
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">₺</span>
                        <input
                          type="number"
                          min={1}
                          value={suggestedRetailPrice}
                          onChange={(e) => setSuggestedRetailPrice(Math.max(1, Number(e.target.value)))}
                          className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        Perakendeci mağaza ürünü vitrinine çekerken bu fiyatı varsayılan olarak görür ve dilediği kâr marjını uygulayabilir.
                      </span>
                    </div>

                    {/* Kâr Marjı Hesaplayıcı */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Toptan Fiyatınız:</span>
                        <span className="font-bold text-slate-800">₺{b2bWholesalePrice.toLocaleString('tr-TR')}</span>
                      </div>
                      <div className="text-slate-300">→</div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Önerilen Perakende:</span>
                        <span className="font-bold text-slate-800">₺{suggestedRetailPrice.toLocaleString('tr-TR')}</span>
                      </div>
                      <div className="text-slate-300">=</div>
                      <div className="text-right">
                        <span className="text-slate-500 block text-[11px]">Perakendecinin Kârı:</span>
                        <span className="font-black text-emerald-600">
                          ₺{(suggestedRetailPrice - b2bWholesalePrice).toLocaleString('tr-TR')} (%{Math.round(((suggestedRetailPrice - b2bWholesalePrice) / b2bWholesalePrice) * 100)})
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 6: ÖLÇÜ BİRİMİ & DİNAMİK ÖZELLEŞTİRME ================= */}
          {activeTab === 'customization' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Bilgilendirme Kutusu */}
              <div className="bg-indigo-50/70 border border-indigo-200 p-4 rounded-2xl flex items-start gap-3">
                <Scale className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-black text-indigo-950 text-xs">
                    Sektörel Dinamik Sipariş Seçenekleri & Ölçü Motoru
                  </h3>
                  <p className="text-[11px] text-indigo-900 leading-relaxed">
                    Manavdan restoran siparişine, fotoğraf baskısından davetiye matbaasına kadar her esnafın ürününü müşteriye göre tam uyumlu hale getirmesini sağlar.
                  </p>
                </div>
              </div>

              {/* 1. ÖLÇÜ BİRİMİ TANIMLAMA */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Scale className="w-4 h-4 text-amber-600" />
                  <h4 className="text-sm font-black text-slate-900">a) Ölçü Birimi Tanımlama</h4>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">Temel Satış Ölçü Birimi:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { id: 'adet', label: 'Adet', desc: 'Standart perakende' },
                      { id: 'kg', label: 'Kilogram / Gram', desc: 'Manav, şarküteri, kuruyemiş' },
                      { id: 'litre', label: 'Litre', desc: 'Süt, zeytinyağı, içecek' },
                      { id: 'metre', label: 'Metre / m²', desc: 'Kumaş, halı, zemin' },
                      { id: 'porsiyon', label: 'Porsiyon / Paket', desc: 'Restoran & kafe menüsü' }
                    ].map((unit) => (
                      <button
                        key={unit.id}
                        type="button"
                        onClick={() => {
                          setMeasurementUnit(unit.id as any);
                          if (unit.id === 'kg') {
                            setMeasurementMin(0.5);
                            setMeasurementStep(0.5);
                            setMeasurementUnitLabel('Kg');
                          } else if (unit.id === 'adet') {
                            setMeasurementMin(1);
                            setMeasurementStep(1);
                            setMeasurementUnitLabel('Adet');
                          } else if (unit.id === 'porsiyon') {
                            setMeasurementMin(1);
                            setMeasurementStep(1);
                            setMeasurementUnitLabel('Porsiyon');
                          }
                        }}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          measurementUnit === unit.id 
                            ? 'bg-amber-50 border-amber-500 text-amber-950 shadow-2xs' 
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="font-bold text-xs block">{unit.label}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{unit.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tartılı / Kademeli Parametreler */}
                {measurementUnit !== 'adet' && (
                  <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Minimum Miktar:</label>
                      <input
                        type="number"
                        step={0.1}
                        min={0.1}
                        value={measurementMin}
                        onChange={(e) => setMeasurementMin(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-amber-200 rounded-lg text-xs font-bold text-slate-800"
                        placeholder="Örn: 0.5"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">Örn: 0.5 kg veya 1 porsiyon</span>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Artış Adımı (+/-):</label>
                      <input
                        type="number"
                        step={0.1}
                        min={0.1}
                        value={measurementStep}
                        onChange={(e) => setMeasurementStep(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-amber-200 rounded-lg text-xs font-bold text-slate-800"
                        placeholder="Örn: 0.5"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">Müşteri butonla bu adımda artırır</span>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Görünecek Etiket:</label>
                      <input
                        type="text"
                        value={measurementUnitLabel}
                        onChange={(e) => setMeasurementUnitLabel(e.target.value)}
                        className="w-full p-2 bg-white border border-amber-200 rounded-lg text-xs font-bold text-slate-800"
                        placeholder="Örn: Kg, Paket, Porsiyon"
                      />
                      <span className="text-[10px] text-slate-400 mt-0.5 block">Sepette ve fişte basılır</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. YEMEK & RESTORAN İÇİN MALZEME SEÇİCİ */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-rose-600" />
                      b) Yemek & Restoran İçin Malzeme Seçici (Yemeksepeti / Döner Modeli)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Müşterinin "Soğansız", "Turşusuz" seçimi yapmasını ve "+Ekstra Kaşar", "+Çift Lavaş" eklemesini sağlar.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={foodCustomizationEnabled}
                      onChange={(e) => setFoodCustomizationEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                  </label>
                </div>

                {foodCustomizationEnabled && (
                  <div className="pt-4 border-t border-slate-100 space-y-5 animate-fade-in">
                    
                    {/* Çıkarılacak Malzemeler */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-800 block">
                        İstemediğiniz Malzemeler Grubu (Çıkarılabilir / Ücretsiz):
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {removableIngredients.map((item) => (
                          <div key={item.id} className="bg-rose-50 border border-rose-200 text-rose-800 px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5">
                            <span>🚫 {item.name}</span>
                            <button
                              type="button"
                              onClick={() => setRemovableIngredients(removableIngredients.filter(i => i.id !== item.id))}
                              className="text-rose-400 hover:text-rose-700 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newRemovableName}
                          onChange={(e) => setNewRemovableName(e.target.value)}
                          placeholder="Yeni çıkarılabilir malzeme (Örn: Mayonez, Domates)..."
                          className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newRemovableName.trim()) {
                              setRemovableIngredients([...removableIngredients, { id: `rem-${Date.now()}`, name: newRemovableName.trim(), defaultIncluded: true }]);
                              setNewRemovableName('');
                            }
                          }}
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs cursor-pointer"
                        >
                          Ekle
                        </button>
                      </div>
                    </div>

                    {/* Ekstra Malzemeler & Soslar (+Ücret) */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <label className="text-xs font-bold text-slate-800 block">
                        Ekstra Malzemeler & Soslar (Fiyata Dinamik Eklenir):
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                        {extraIngredients.map((extra) => (
                          <div key={extra.id} className="bg-emerald-50 border border-emerald-200 p-2 rounded-xl flex items-center justify-between text-xs font-bold">
                            <span className="text-emerald-900">+ {extra.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-700 font-black">+{extra.price} ₺</span>
                              <button
                                type="button"
                                onClick={() => setExtraIngredients(extraIngredients.filter(e => e.id !== extra.id))}
                                className="text-emerald-400 hover:text-emerald-700 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newExtraName}
                          onChange={(e) => setNewExtraName(e.target.value)}
                          placeholder="Ekstra malzeme adı (Örn: Ekstra Kaşar)..."
                          className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                        />
                        <div className="relative w-28">
                          <span className="absolute left-2.5 top-2 text-xs font-bold text-slate-400">+₺</span>
                          <input
                            type="number"
                            min={1}
                            value={newExtraPrice}
                            onChange={(e) => setNewExtraPrice(Number(e.target.value))}
                            className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (newExtraName.trim()) {
                              setExtraIngredients([...extraIngredients, { id: `ext-${Date.now()}`, name: newExtraName.trim(), price: newExtraPrice }]);
                              setNewExtraName('');
                            }
                          }}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs cursor-pointer"
                        >
                          Ekstra Ekle
                        </button>
                      </div>
                    </div>

                    {/* Zorunlu Tercih Grupları */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <label className="text-xs font-bold text-slate-800 block">
                        Zorunlu Seçim Grupları (Acı Tercihi, İçecek vb.):
                      </label>
                      <div className="space-y-2">
                        {mandatoryGroups.map((grp) => (
                          <div key={grp.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-slate-800 text-xs">{grp.title}</span>
                              <span className="text-[10px] text-slate-500 block">
                                Seçenekler: {grp.options.map(o => o.name).join(', ')}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setMandatoryGroups(mandatoryGroups.filter(g => g.id !== grp.id))}
                              className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. FOTOĞRAF BASKI & DOSYA YÜKLEME */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-indigo-600" />
                      c) Fotoğraf Baskı & Dijital İşler İçin Dosya/Fotoğraf Yükleme Alanı
                    </h4>
                    <p className="text-xs text-slate-500">
                      Müşterilerin sipariş vermeden önce baskı fotoğraflarını tarayıcıdan sürükleyip yüklemesini sağlar.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fileUploadEnabled}
                      onChange={(e) => setFileUploadEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {fileUploadEnabled && (
                  <div className="pt-4 border-t border-slate-100 space-y-4 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Müşteriye Gösterilecek Başlık:</label>
                        <input
                          type="text"
                          value={fileUploadTitle}
                          onChange={(e) => setFileUploadTitle(e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">İzin Verilen Formatlar:</label>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {['JPG', 'PNG', 'PDF', 'TIFF', 'RAW', 'ZIP'].map((fmt) => (
                            <span key={fmt} className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-800 text-[10px] font-bold">
                              .{fmt}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Min. Dosya Sayısı:</label>
                        <input
                          type="number"
                          min={1}
                          value={fileUploadMin}
                          onChange={(e) => setFileUploadMin(Number(e.target.value))}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Maks. Dosya Sayısı:</label>
                        <input
                          type="number"
                          min={1}
                          value={fileUploadMax}
                          onChange={(e) => setFileUploadMax(Number(e.target.value))}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Maks. Boyut (MB):</label>
                        <input
                          type="number"
                          min={10}
                          value={fileUploadMaxSize}
                          onChange={(e) => setFileUploadMaxSize(Number(e.target.value))}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. MATBAA, DAVETİYE, LAZER DİNAMİK FORM SİHİRBAZI */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-600" />
                      d) Matbaa, Davetiye, Lazer & Kişiye Özel Ürün Form Sihirbazı
                    </h4>
                    <p className="text-xs text-slate-500">
                      Gelin-Damat isimleri, düğün tarihi, ahşap yazı metni gibi müşteri bilgilerini toplar.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={customFormEnabled}
                      onChange={(e) => setCustomFormEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                {customFormEnabled && (
                  <div className="pt-4 border-t border-slate-100 space-y-4 animate-fade-in">
                    
                    {/* Hızlı Şablon Butonları */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-600">Hazır Şablon Yükle:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setCustomFormTitle('Düğün & Nişan Davetiyesi Bilgi Formu');
                          setCustomFormFields([
                            { id: 'fld-1', label: 'Gelin & Damat Adı', type: 'text', placeholder: 'Örn: Selin & Ahmet', required: true },
                            { id: 'fld-2', label: 'Düğün / Kına Tarihi & Saati', type: 'text', placeholder: 'Örn: 15 Ekim 2026 - 19:30', required: true },
                            { id: 'fld-3', label: 'Düğün Salonu Adı ve Açık Adres', type: 'textarea', placeholder: 'Örn: Beylerbeyi Sarayı Yanı, Üsküdar', required: true },
                            { id: 'fld-4', label: 'Varsa Özel Davetiye Sözü / Şiir', type: 'textarea', placeholder: 'Örn: Mutluluğumuzu paylaşmaya davetlisiniz...', required: false }
                          ]);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold cursor-pointer"
                      >
                        💍 Düğün Davetiyesi Şablonu
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCustomFormTitle('Ahşap / Lazer Plaka Kazıma Formu');
                          setCustomFormFields([
                            { id: 'fld-l1', label: 'Üzerine Yazılacak İsim / Plaka No', type: 'text', placeholder: 'Örn: Mehmet Yılmaz - 34 TPZ 1923', required: true },
                            { id: 'fld-l2', label: 'Yazı Fontu veya Özel Talimat', type: 'text', placeholder: 'Örn: El yazısı / Kaligrafik', required: false }
                          ]);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-[10px] font-bold cursor-pointer"
                      >
                        🪵 Ahşap / Lazer Plaka Şablonu
                      </button>
                    </div>

                    {/* Alan Listesi */}
                    <div className="space-y-2">
                      {customFormFields.map((fld) => (
                        <div key={fld.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{fld.label}</span>
                            <span className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 font-mono uppercase">
                              {fld.type}
                            </span>
                            {fld.required && (
                              <span className="text-[9px] bg-rose-50 text-rose-700 px-1 py-0.2 rounded font-bold">Zorunlu</span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => setCustomFormFields(customFormFields.filter(f => f.id !== fld.id))}
                            className="text-rose-400 hover:text-rose-700 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Yeni Alan Ekleme Satırı */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                      <input
                        type="text"
                        value={newFieldLabel}
                        onChange={(e) => setNewFieldLabel(e.target.value)}
                        placeholder="Alan Başlığı (Örn: Şirket Ünvanı)..."
                        className="p-2 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                      <select
                        value={newFieldType}
                        onChange={(e) => setNewFieldType(e.target.value as any)}
                        className="p-2 bg-white border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="text">Kısa Metin</option>
                        <option value="textarea">Uzun Açıklama (Adres)</option>
                        <option value="date">Tarih Seçici</option>
                        <option value="number">Sayısal Veri</option>
                      </select>
                      <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newFieldRequired}
                          onChange={(e) => setNewFieldRequired(e.target.checked)}
                          className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                        />
                        <span>Zorunlu Alan</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          if (newFieldLabel.trim()) {
                            setCustomFormFields([
                              ...customFormFields,
                              {
                                id: `fld-${Date.now()}`,
                                label: newFieldLabel.trim(),
                                type: newFieldType,
                                required: newFieldRequired
                              }
                            ]);
                            setNewFieldLabel('');
                          }
                        }}
                        className="py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs cursor-pointer text-center"
                      >
                        Alanı Ekle
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 transition cursor-pointer text-xs"
          >
            İptal
          </button>

          <div className="flex items-center gap-3">
            {activeTab !== 'basic' && (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'pricing') setActiveTab('basic');
                  if (activeTab === 'variants') setActiveTab('pricing');
                  if (activeTab === 'logistics') setActiveTab('variants');
                  if (activeTab === 'b2b') setActiveTab('logistics');
                  if (activeTab === 'customization') setActiveTab('b2b');
                }}
                className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 transition cursor-pointer text-xs"
              >
                ← Önceki Adım
              </button>
            )}

            {activeTab !== 'customization' ? (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'basic') {
                    if (!title.trim()) {
                      setValidationError('Lütfen devam etmeden önce ürün adını girin.');
                      return;
                    }
                    setValidationError(null);
                    setActiveTab('pricing');
                  } else if (activeTab === 'pricing') {
                    if (salePrice <= 0) {
                      setValidationError('Lütfen geçerli bir satış fiyatı belirleyin.');
                      return;
                    }
                    setValidationError(null);
                    setActiveTab('variants');
                  } else if (activeTab === 'variants') {
                    setActiveTab('logistics');
                  } else if (activeTab === 'logistics') {
                    setActiveTab('b2b');
                  } else if (activeTab === 'b2b') {
                    setActiveTab('customization');
                  }
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-xs transition cursor-pointer text-xs flex items-center gap-1.5"
              >
                Sonraki Adım →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-sm transition cursor-pointer text-xs flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Ürünü Kaydet & Vitrine Çıkar
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
