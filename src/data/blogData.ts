export type BlogAudience = 'all' | 'esnaf' | 'tuketici' | 'tools';

export type BlogSubCategory = 
  | 'all'
  | 'esnaf'
  | 'tuketici'
  | 'finans'
  | 'mevsimsel'
  | 'seo'
  | 'dayanisma';

export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface ComparisonTable {
  title: string;
  headers: [string, string, string];
  rows: Array<[string, string, string]>;
}

export interface CalloutBox {
  title: string;
  badge?: string;
  items: string[];
}

export interface CustomCTA {
  title: string;
  description: string;
  badge?: string;
  primaryButtonText: string;
  primaryButtonAction: string;
  secondaryButtonText?: string;
  secondaryButtonAction?: string;
}

export interface StepGuideItem {
  stepNumber: number;
  title: string;
  description: string;
}

export interface BlogPostSection {
  heading: string;
  subheading?: string;
  paragraphs: string[];
  highlightBox?: {
    title: string;
    text: string;
    badge?: string;
  };
  bulletPoints?: string[];
  stepGuide?: StepGuideItem[];
  inlineImage?: {
    url: string;
    caption: string;
  };
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  audience: 'esnaf' | 'tuketici';
  subCategory: BlogSubCategory;
  categoryLabel: string;
  readTime: string;
  date: string;
  readCount: string;
  likePercentage: number;
  featured?: boolean;
  city?: string;
  district?: string;
  sectorName?: string;
  sectorIcon?: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  coverImage: string;
  tags: string[];
  ctaType: 'merchant' | 'consumer';
  checklist?: string[];
  calloutBox?: CalloutBox;
  comparisonTable?: ComparisonTable;
  customCta?: CustomCTA;
  faqs?: BlogFAQ[];
  content: {
    lead: string;
    sections: BlogPostSection[];
    conclusion: string;
  };
}

export const SUB_CATEGORIES_LIST = [
  { id: 'all', label: 'Tümü' },
  { id: 'esnaf', label: 'Esnaf Rehberi' },
  { id: 'tuketici', label: 'Tüketici Rehberi' },
  { id: 'finans', label: 'Finans & Maliyet' },
  { id: 'mevsimsel', label: 'Mevsimsel & Sağlık' },
  { id: 'seo', label: 'Yerel Pazarlama & SEO' },
  { id: 'dayanisma', label: 'Yerel Ekonomi & Dayanışma' }
];

export const POPULAR_TAGS = [
  '#komisyonsuz',
  '#mevsiminde',
  '#yerelesnaf',
  '#gıdaisrafı',
  '#fiyatlandırma',
  '#e-fatura',
  '#byopos',
  '#mahalledayanışması',
  '#yerelusta',
  '#tamteklif'
];

// =========================================================================
// PROGRAMATİK SEO MATRİS VERİLERİ (İller, İlçeler, Sektörler, Konular)
// =========================================================================

export interface SectorItem {
  id: string;
  name: string;
  icon: string;
  type: 'product' | 'service';
  keywords: string[];
  tipsForMerchant: string;
  tipsForConsumer: string;
  avgTicket: number;
}

export const SECTORS: SectorItem[] = [
  { 
    id: 'kasap', 
    name: 'Kasap', 
    icon: '🥩', 
    type: 'product',
    keywords: ['et', 'kıyma', 'sucuk', 'antrikot', 'kuzu pirzola'],
    tipsForMerchant: 'Kıyma ve parça etlerde gramajlı tartı seçeneği sunarak müşteriye net fiyat verin; vakumlu paketleme ile aynı gün moto-kurye teslimatı yapın.',
    tipsForConsumer: 'Yerel kasaptan alınan etler taze kesimdir. Sipariş verirken yağ oranını ve çekim sıklığını özel not olarak iletebilirsiniz.',
    avgTicket: 650
  },
  { 
    id: 'manav', 
    name: 'Manav', 
    icon: '🥦', 
    type: 'product',
    keywords: ['sebze', 'meyve', 'taze yeşillik', 'organik domates', 'mevsim meyvesi'],
    tipsForMerchant: 'Sabah halden gelen taze ürünlerin fotoğraflarını çekip dükkanınıza ekleyin. Akşam 18:00 sonrası hızlı teslimat talebi 3 katına çıkar.',
    tipsForConsumer: 'Zincir marketlerdeki paketli ürünler yerine gramajlı seçim yaparak gıda israfını ve plastik ambalaj atığını önleyin.',
    avgTicket: 350
  },
  { 
    id: 'firin', 
    name: 'Fırın & Unlu Mamul', 
    icon: '🥖', 
    type: 'product',
    keywords: ['ekşi maya ekmek', 'simit', 'pasta', 'börek', 'poğaça'],
    tipsForMerchant: 'Fırından yeni çıkan sıcak ürünlerin saatlerini bildirin. Mahalle sakinleri sıcak ekmek ve kahvaltı için anlık sipariş verir.',
    tipsForConsumer: 'Sabah kahvaltısı veya akşam çayı için fırından sıcak teslimat isteyebilir, bayatlamayan doğal mayalı ekmekleri tercih edebilirsiniz.',
    avgTicket: 200
  },
  { 
    id: 'tesisatci', 
    name: 'Sıhhi Tesisatçı', 
    icon: '🔧', 
    type: 'service',
    keywords: ['su kaçağı tespiti', 'musluk tamiri', 'klozet montajı', 'petek temizleme', 'acil tesisat'],
    tipsForMerchant: 'TamUsta modülü ile acil 7/24 durumunuzu açık tutun. Termal kamera ile kırmadan kaçak tespiti yaptığınızı profilde belirtin.',
    tipsForConsumer: 'Kapalı zarf TamTeklif açarak birden fazla yerel ustadan malzeme dahil ve hariç net fiyat teklifi alın, sürpriz maliyetlerden kurtulun.',
    avgTicket: 1200
  },
  { 
    id: 'elektrikci', 
    name: 'Elektrikçi & Aydınlatma', 
    icon: '⚡', 
    type: 'service',
    keywords: ['sigorta arızası', 'avize montajı', 'kablo çekimi', 'led aydınlatma', 'acil elektrikçi'],
    tipsForMerchant: 'Belgeli usta rozetinizi profilinize yükleyin. Arıza tespitinde şeffaf malzeme listesi sunarak güven kazanın.',
    tipsForConsumer: 'Elektrik işlerinde ehliyetli ve oda kayıtlı ustaları tercih edin. Önceden arıza videosu veya fotoğrafı göndererek net fiyat alın.',
    avgTicket: 950
  },
  { 
    id: 'fotografci', 
    name: 'Fotoğrafçı & Stüdyo', 
    icon: '📸', 
    type: 'service',
    keywords: ['biyometrik vesikalık', 'düğün dış çekim', 'ürün çekimi', 'kanvas baskı', 'çerçeve'],
    tipsForMerchant: 'Müşterilerin evden fotoğraf yüklemesine izin veren dinamik dosya yükleme alanını aktif edin. Vesikalık ve kanvas baskıları aynı gün kargolayın.',
    tipsForConsumer: 'Stüdyoya gitmeden telefonunuzdan çektiğiniz biyometrik fotoğrafları yükleyip pasaport/vize onaylı baskı olarak teslim alabilirsiniz.',
    avgTicket: 500
  },
  { 
    id: 'kuafor', 
    name: 'Kuaför & Berber', 
    icon: '✂️', 
    type: 'service',
    keywords: ['saç kesimi', 'fön', 'saç boyası', 'keratin bakım', 'damat tıraşı'],
    tipsForMerchant: 'TamSeans modülü ile müşterilerinizin dükkanda sıra beklemeden online randevu almasını sağlayın, randevu doluluğunuzu artırın.',
    tipsForConsumer: 'Hafta sonu yoğunluğunda dükkanda saatlerce sıra beklemek yerine müsait koltuk saatine doğrudan randevu oluşturun.',
    avgTicket: 400
  },
  { 
    id: 'sarkuteri', 
    name: 'Şarküteri & Yöresel Ürün', 
    icon: '🧀', 
    type: 'product',
    keywords: ['ezine peyniri', 'organik zeytin', 'karakovan balı', 'tereyağı', 'pastırma'],
    tipsForMerchant: 'Vakumlu ambalajlama ve soğuk zincir strafor kutu desteğiyle yalnızca mahallenize değil tüm Türkiye\'ye TamKargo ile satış yapın.',
    tipsForConsumer: 'Doğrudan üretici ve yerel şarküterilerden gerçek köy tereyağı ve katkısız peynirleri aracı komisyonsuz esnaf fiyatıyla alın.',
    avgTicket: 850
  },
  { 
    id: 'cicekci', 
    name: 'Çiçekçi & Tasarım', 
    icon: '💐', 
    type: 'product',
    keywords: ['canlı çiçek buketi', 'orkide', 'aranjman', 'açılış çelengi', 'saksı çiçeği'],
    tipsForMerchant: 'Özel günlerde (Sevgililer Günü, Öğretmenler Günü, Anneler Günü) saatli teslimat seçeneğiyle mahalle içi hızlı motorlu teslimat yapın.',
    tipsForConsumer: 'İnternet aracı sitelerinin %40 komisyon eklediği solgun çiçekler yerine doğrudan mahallenin çiçekçisinden taze ve diri aranjman seçin.',
    avgTicket: 600
  },
  { 
    id: 'butik', 
    name: 'Butik & Moda', 
    icon: '👗', 
    type: 'product',
    keywords: ['kadın butik giyim', 'keten gömlek', 'triko', 'abiye', 'yerel tekstil'],
    tipsForMerchant: 'TamPazar B2B toptan ağı üzerinden Merter, Laleli ve Denizli üreticilerinden doğrudan dropshipping veya toptan mal çekerek vitrininizi zenginleştirin.',
    tipsForConsumer: 'Özgün tasarım parçaları ve yerel butiklerin sıcak ilgisini doğrudan WhatsApp ve yerinde deneme imkanıyla keşfedin.',
    avgTicket: 750
  },
  { 
    id: 'oto-tamir', 
    name: 'Oto Tamir & Servis', 
    icon: '🚗', 
    type: 'service',
    keywords: ['periyodik oto bakım', 'fren balatası değişimi', 'motor ekspertiz', 'oto elektrik', 'lastik tamiri'],
    tipsForMerchant: 'Sanayi sitesindeki atölyeniz için TamTeklif sistemini kullanın. Parça ve işçilik garantisi vererek dijital servis kaydı oluşturun.',
    tipsForConsumer: 'Aracınızın markası ve arıza detayını yazıp tek taleple sanayideki 5 farklı ustadan kapalı zarf fiyat teklifi toplayın.',
    avgTicket: 2500
  },
  { 
    id: 'terzi', 
    name: 'Terzi & Kuru Temizleme', 
    icon: '🪡', 
    type: 'service',
    keywords: ['paça boyu', 'fermuar tamiri', 'elbise daraltma', 'kuru temizleme', 'ütü'],
    tipsForMerchant: 'Müşterilerden kurye ile kıyafet alıp tamirat veya kuru temizleme sonrası teslim edebileceğiniz kapıdan kapıya servis hizmeti tanımlayın.',
    tipsForConsumer: 'Özel dikim veya tadilat gerektiren kıyafetleriniz için ustanızla birebir konuşun, kumaşa zarar vermeden profesyonel işçilik alın.',
    avgTicket: 300
  }
];

export interface LocationCity {
  city: string;
  slug: string;
  districts: { name: string; slug: string }[];
  region: string;
}

export const CITIES_DATA: LocationCity[] = [
  {
    city: 'Ordu',
    slug: 'ordu',
    region: 'Karadeniz',
    districts: [
      { name: 'Altınordu', slug: 'altinordu' },
      { name: 'Fatsa', slug: 'fatsa' },
      { name: 'Ünye', slug: 'unye' },
      { name: 'Perşembe', slug: 'persembe' },
      { name: 'Gülyalı', slug: 'gulyali' }
    ]
  },
  {
    city: 'İstanbul',
    slug: 'istanbul',
    region: 'Marmara',
    districts: [
      { name: 'Kadıköy', slug: 'kadikoy' },
      { name: 'Beşiktaş', slug: 'besiktas' },
      { name: 'Üsküdar', slug: 'uskudar' },
      { name: 'Şişli', slug: 'sisli' },
      { name: 'Bakırköy', slug: 'bakirkoy' },
      { name: 'Fatih', slug: 'fatih' },
      { name: 'Maltepe', slug: 'maltepe' },
      { name: 'Ataşehir', slug: 'atasehir' }
    ]
  },
  {
    city: 'Ankara',
    slug: 'ankara',
    region: 'İç Anadolu',
    districts: [
      { name: 'Çankaya', slug: 'cankaya' },
      { name: 'Keçiören', slug: 'kecioren' },
      { name: 'Yenimahalle', slug: 'yenimahalle' },
      { name: 'Mamak', slug: 'mamak' },
      { name: 'Etimesgut', slug: 'etimesgut' }
    ]
  },
  {
    city: 'İzmir',
    slug: 'izmir',
    region: 'Ege',
    districts: [
      { name: 'Konak', slug: 'konak' },
      { name: 'Karşıyaka', slug: 'karsiyaka' },
      { name: 'Bornova', slug: 'bornova' },
      { name: 'Alsancak', slug: 'alsancak' },
      { name: 'Buca', slug: 'buca' }
    ]
  },
  {
    city: 'Bursa',
    slug: 'bursa',
    region: 'Marmara',
    districts: [
      { name: 'Nilüfer', slug: 'nilufer' },
      { name: 'Osmangazi', slug: 'osmangazi' },
      { name: 'Yıldırım', slug: 'yildirim' },
      { name: 'İnegöl', slug: 'inegol' }
    ]
  },
  {
    city: 'Antalya',
    slug: 'antalya',
    region: 'Akdeniz',
    districts: [
      { name: 'Muratpaşa', slug: 'muratpasa' },
      { name: 'Konyaaltı', slug: 'konyaalti' },
      { name: 'Kepez', slug: 'kepez' },
      { name: 'Alanya', slug: 'alanya' }
    ]
  },
  {
    city: 'Trabzon',
    slug: 'trabzon',
    region: 'Karadeniz',
    districts: [
      { name: 'Ortahisar', slug: 'ortahisar' },
      { name: 'Akçaabat', slug: 'akcaabat' },
      { name: 'Yomra', slug: 'yomra' }
    ]
  },
  {
    city: 'Samsun',
    slug: 'samsun',
    region: 'Karadeniz',
    districts: [
      { name: 'İlkadım', slug: 'ilkadim' },
      { name: 'Atakum', slug: 'atakum' },
      { name: 'Canik', slug: 'canik' }
    ]
  },
  {
    city: 'Gaziantep',
    slug: 'gaziantep',
    region: 'Güneydoğu Anadolu',
    districts: [
      { name: 'Şahinbey', slug: 'sahinbey' },
      { name: 'Şehitkamil', slug: 'sehitkamil' }
    ]
  },
  {
    city: 'Konya',
    slug: 'konya',
    region: 'İç Anadolu',
    districts: [
      { name: 'Selçuklu', slug: 'selcuklu' },
      { name: 'Meram', slug: 'meram' },
      { name: 'Karatay', slug: 'karatay' }
    ]
  },
  {
    city: 'Adana',
    slug: 'adana',
    region: 'Akdeniz',
    districts: [
      { name: 'Seyhan', slug: 'seyhan' },
      { name: 'Çukurova', slug: 'cukurova' },
      { name: 'Yüreğir', slug: 'yuregir' }
    ]
  }
];

export const ALL_81_CITIES = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin', 'Aydın', 'Balıkesir',
  'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli',
  'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari',
  'Hatay', 'Isparta', 'Mersin', 'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir',
  'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş', 'Nevşehir',
  'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 'Tokat',
  'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman',
  'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
];

export interface ProgrammaticTopic {
  id: string;
  audience: 'esnaf' | 'tuketici';
  titlePattern: string; // e.g. "{city} {district} {sector} Esnafı İçin Komisyonsuz Sipariş Rehberi"
  slugSuffix: string; // e.g. "komisyonsuz-siparis-rehberi"
  categoryLabel: string;
  leadPattern: string;
}

export const PROGRAMMATIC_TOPICS: ProgrammaticTopic[] = [
  // ESNAF KONULARI
  {
    id: 'komisyonsuz-siparis',
    audience: 'esnaf',
    titlePattern: '{city} {district} {sector} Esnafı İçin Komisyonsuz Online Sipariş ve Dükkan Rehberi',
    slugSuffix: 'komisyonsuz-siparis-rehberi',
    categoryLabel: 'Esnaf Rehberi',
    leadPattern: '{city} {district} bölgesinde faaliyet gösteren bir {sector} olarak, aracı pazaryerlerine %20-25 komisyon vermeden kendi dijital sipariş ağınızı kurmanın ve müşterilerinize doğrudan ulaşmanın yolları.'
  },
  {
    id: 'e-fatura-ve-muhasebe',
    audience: 'esnaf',
    titlePattern: '{city} {district} {sector} İşletmeleri İçin Ücretsiz GİB E-Fatura ve Ön Muhasebe Kılavuzu',
    slugSuffix: 'ucretsiz-e-fatura-ve-on-muhasebe-kilavuzu',
    categoryLabel: 'Finans & Maliyet',
    leadPattern: '{city} genelindeki {sector} esnafı için Gelir İdaresi Başkanlığı UBL-TR 2.1 e-Arşiv/e-Fatura entegrasyonu ile pahalı muhasebe yazılımlarına gerek kalmadan resmi faturalandırma rehberi.'
  },
  {
    id: 'yerel-seo-harita',
    audience: 'esnaf',
    titlePattern: '{city} {district} {sector} Esnafının Google Haritalar ve Yerel Aramalarda Zirveye Çıkma Stratejisi',
    slugSuffix: 'google-harita-ve-yerel-seo-rehberi',
    categoryLabel: 'Yerel Pazarlama & SEO',
    leadPattern: '{district} ve çevre mahallelerde "en yakın {sector}" araması yapan müşterilerin ilk karşısına çıkmak için Google İşletme Profili ve TamPazar dijital dükkan entegrasyonu taktikleri.'
  },
  {
    id: 'byo-pos-tahsilat',
    audience: 'esnaf',
    titlePattern: '{city} {district} {sector} Esnafı İçin Kendi Sanal POS\'u ile Anında Tahsilat ve Nakit Akışı',
    slugSuffix: 'sanal-pos-ile-aninda-tahsilat-rehberi',
    categoryLabel: 'Finans & Maliyet',
    leadPattern: '{city} {district} bölgesinde {sector} işletmenize ait banka POS anlaşmalarınızı (İyzico, PayTR, Garanti vb.) TamPazar\'a bağlayarak vade farksız ertesi gün tahsilat modeli.'
  },

  // TÜKETİCİ KONULARI
  {
    id: 'taze-dogrudan-alisveris',
    audience: 'tuketici',
    titlePattern: '{city} {district} Bölgesinde En Taze {sector} Alışverişi Nasıl Yapılır? Tüketici Rehberi',
    slugSuffix: 'en-taze-alisveris-ve-fiyat-rehberi',
    categoryLabel: 'Tüketici Rehberi',
    leadPattern: '{city} {district} mahallenizdeki en iyi {sector} esnaflarından komisyonsuz, doğrudan raf fiyatıyla ve kapıya teslim taze alışveriş yapmanın püf noktaları.'
  },
  {
    id: 'tamteklif-fiyat-alma',
    audience: 'tuketici',
    titlePattern: '{city} {district} En İyi {sector} Hizmeti ve Kapalı Zarf Fiyat Teklifi Alma Kılavuzu',
    slugSuffix: 'fiyat-teklifi-ve-usta-bulma-rehberi',
    categoryLabel: 'Tüketici Rehberi',
    leadPattern: '{district} sınırları içerisinde güvenilir ve ehliyetli bir {sector} arıyorsanız, TamTeklif ile 1 dakikada talep açıp yerel ustalardan kapalı zarf fiyat teklifi toplayın.'
  },
  {
    id: 'israfsiz-gramajli-siparis',
    audience: 'tuketici',
    titlePattern: '{city} {district} {sector} İhtiyaçlarında Gramajlı ve İsrafsız Tüketim Yöntemleri',
    slugSuffix: 'gramajli-israfsiz-tuketim-rehberi',
    categoryLabel: 'Mevsimsel & Sağlık',
    leadPattern: '{city} sofralarında sıfır gıda israfı: {district} yerel {sector} esnafından paket yerine tam ihtiyacınız olan gramajda sipariş vererek bütçenizi %35 koruyun.'
  }
];

// Helper: Turkish character sanitizer
function slugify(text: string): string {
  const trMap: Record<string, string> = {
    'ç': 'c', 'Ç': 'c', 'ğ': 'g', 'Ğ': 'g', 'ı': 'i', 'I': 'i', 'İ': 'i',
    'ö': 'o', 'Ö': 'o', 'ş': 's', 'Ş': 's', 'ü': 'u', 'Ü': 'u'
  };
  return text
    .split('')
    .map(char => trMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/**
 * Programatik Slug Üretici (Sitemap & İç Linkleme için)
 */
export function buildProgrammaticSlug(city: string, district: string, sectorId: string, topicId: string): string {
  const topic = PROGRAMMATIC_TOPICS.find(t => t.id === topicId) || PROGRAMMATIC_TOPICS[0];
  const citySlug = slugify(city);
  const districtSlug = slugify(district);
  const sectorSlug = slugify(sectorId);
  return `${citySlug}-${districtSlug}-${sectorSlug}-${topic.slugSuffix}`;
}

/**
 * Manuel Temel Rehber Makaleleri (Görsel Zenginlik, Detaylı İçerik ve SEO Uyumlu Yapı)
 */
export const staticBlogPosts: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'sifir-komisyon-ile-e-ticaret-devrimi-tampazar-nasil-calisir',
    title: 'Sıfır Komisyon ile E-Ticaret Devrimi: TamPazar Nasıl Çalışır?',
    excerpt: 'Geleneksel pazaryerlerinin %20-%30 komisyon kesintilerine son! Kendi PayTR sanal POS\'unuz ve IBAN\'ınızla paranın doğrudan size geçmesini sağlayan TamPazar modelini keşfedin.',
    audience: 'esnaf',
    subCategory: 'esnaf',
    categoryLabel: 'E-Ticaret Rehberi',
    readTime: '6 dk okuma',
    date: '2026-09-24',
    readCount: '15.4k',
    likePercentage: 99,
    featured: true,
    author: {
      name: 'Selim Usta & TamPazar Yerel Ticaret Editörü',
      role: 'KOBİ & Esnaf Büyüme Uzmanı',
      avatar: '👨‍💼'
    },
    coverImage: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80',
    tags: ['#komisyonsuz', '#byopos', '#yerelesnaf', '#e-fatura'],
    ctaType: 'merchant',
    checklist: [
      '%0 Komisyon ile cironuzun tamamını kasada tutma formülü',
      'Esnafın kendi PayTR / İyzico / banka POS hesabını bağlaması',
      'GİB UBL-TR 2.1 onaylı ücretsiz e-fatura ve e-arşiv altyapısı',
      'Hemen Mağaza Aç butonuyla 2 dakikada dijital dükkan kurulumu'
    ],
    calloutBox: {
      title: 'Öne Çıkan Hap Bilgiler: %0 Komisyon Mimarisi',
      badge: 'KRİTİK AVANTAJ',
      items: [
        'TamPazar, aracı bir finansal havuz kullanmaz; ciro doğrudan esnafın banka hesabına yatar.',
        'Geleneksel pazaryerlerindeki 30 günlük vade blokesi yoktur; tahsilat ertesi gün hesabınızdadır.',
        'GİB onaylı e-Arşiv ve e-Fatura entegrasyonu ek hiçbir muhasebe yazılımı ücreti gerektirmez.'
      ]
    },
    comparisonTable: {
      title: 'TamPazar %0 Komisyon vs Geleneksel Pazar Yerleri Karşılaştırması',
      headers: ['Mali & Operasyonel Metrik', 'Geleneksel Pazaryerleri', 'TamPazar Açık AVM Modeli'],
      rows: [
        ['Satış Komisyon Oranı', '%18 - %30 arasında yüksek kesinti', '%0 Sabit Komisyon (Tamamen Ücretsiz)'],
        ['Ödeme & Nakit Akış Vadesi', '14 - 30 gün boyunca para blokesi', 'Ertesi gün doğrudan esnaf banka hesabında'],
        ['Müşteri Mülkiyeti & Verisi', 'Müşteri platforma aittir, esnafla paylaşılmaz', 'Müşteri doğrudan esnafın dijital müdavimidir'],
        ['E-Fatura & Muhasebe', 'Ek maliyetli karmaşık entegrasyonlar', 'Ücretsiz GİB UBL-TR 2.1 otomatik e-Fatura'],
        ['Aylık Sabit Maliyet', 'Değişken komisyonlar nedeniyle belirsiz', 'Şeffaf ve sembolik sabit dükkan aidatı']
      ]
    },
    customCta: {
      title: 'Dükkanınızı Bugün Dijitalleştirin, %0 Komisyonla Kazanın',
      description: 'Binlerce esnaf gibi siz de kendi Sanal POS\'unuzu bağlayın, komisyonsuz dijital ticaretin tadını çıkarın.',
      badge: '2 Dakikada Kurulum',
      primaryButtonText: 'Hemen Mağaza Aç',
      primaryButtonAction: '/yonetim',
      secondaryButtonText: 'Vitrinleri İncele',
      secondaryButtonAction: '/'
    },
    faqs: [
      {
        question: 'TamPazar\'da satışlardan komisyon kesiliyor mu?',
        answer: 'Kesinlikle hayır! TamPazar %0 komisyon politikasıyla çalışır. Satış tutarının tamamı doğrudan kendi Sanal POS hesabınıza aktarılır.'
      },
      {
        question: 'Ödemelerim banka hesabıma ne zaman yatar?',
        answer: 'Kendi PayTR veya banka POS\'unuzu bağladığınız için ödemeler aracı havuzunda beklemeden doğrudan sizin hesabınıza anında yatar.'
      },
      {
        question: 'E-Fatura entegrasyonu için ek bir ücret ödemem gerekir mi?',
        answer: 'Hayır, TamPazar GİB UBL-TR 2.1 e-Arşiv ve e-Fatura altyapısını sistem dahilinde tamamen ücretsiz sunmaktadır.'
      }
    ],
    content: {
      lead: 'Geleneksel e-ticaret platformları mahalle esnafının cirosundan %18 ile %30 arasında fahiş komisyonlar kesip parayı haftalarca bloke ederken, TamPazar fiziksel çarşının özgürlüğünü dijitale taşıyor. İşte komisyonsuz e-ticaret devriminin tüm detayları.',
      sections: [
        {
          heading: '1. %0 Komisyon Mantığı ve Esnafın Kendi Kasası (BYO POS)',
          subheading: 'Aracı Havuzları Ortadan Kaldıran Doğrudan POS Mimarisi',
          paragraphs: [
            'E-ticarette büyümenin önündeki en büyük engel, yüksek pazaryeri komisyonları ve uzun bloke süreleridir. Aylık 100.000 TL ciro yapan bir işletme, geleneksel platformlara yılda ortalama 250.000 TL ila 300.000 TL arasında komisyon öder.',
            'TamPazar bu adaletsizliği kökten çözer: BYO POS (Bring Your Own POS) yani "Kendi POS\'unu Getir" modeli sayesinde PayTR, İyzico veya dilediğiniz banka hesabınızı sisteme tek tıkla bağlarsınız. Müşteri ödeme yaptığında finansal akış doğrudan sizin banka hesabınıza akar.'
          ],
          highlightBox: {
            title: 'Sıfır Komisyon, %100 Kazanç Güvencesi',
            text: 'TamPazar altyapısında dükkan açtığınızda satış adediniz veya cironuz ne kadar artarsa artsın komisyon ödemezsiniz.',
            badge: '%0 Kesinti'
          },
          inlineImage: {
            url: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&w=1200&q=80',
            caption: 'Esnafın kendi PayTR ve banka POS cihazıyla doğrudan tahsilat yapması ve aracı komisyonunu sıfırlaması.'
          }
        },
        {
          heading: '2. 3 Adımda Kolay Dijital Mağaza Kurulum Rehberi',
          subheading: 'Karmaşık Yazılımlar Olmadan 2 Dakikada Satışa Başlayın',
          paragraphs: [
            'Dükkanınızı dijitalleştirmek için yazılımcı kiralamanıza veya haftalarca beklemenize gerek yok. TamPazar esnaf paneli sezgisel arayüzü ile herkesin kolayca kullanabileceği şekilde tasarlandı.'
          ],
          stepGuide: [
            {
              stepNumber: 1,
              title: 'Vergi / Sicil Bilginizle Kaydolun',
              description: 'Vergi numaranız veya esnaf sicil bilginizle 1 dakikada güvenli tüccar hesabınızı oluşturun.'
            },
            {
              stepNumber: 2,
              title: 'Sanal POS ve IBAN Adresinizi Tanımlayın',
              description: 'Anlaşmalı ödeme kuruluşunuzun API anahtarlarını veya IBAN bilginizi girerek kasayı doğrudan dükkanınıza bağlayın.'
            },
            {
              stepNumber: 3,
              title: 'Ürünlerinizi Yükleyin ve Sipariş Almaya Başlayın',
              description: 'Fotoğraf, fiyat ve stok bilgilerinizi girerek mahallenize ve tüm Türkiye\'ye anında satışa başlayın.'
            }
          ]
        },
        {
          heading: '3. GİB UBL-TR 2.1 E-Fatura Entegrasyonu ve Otomasyon',
          subheading: 'Muhasebe Masraflarını Sıfırlayan Akıllı Altyapı',
          paragraphs: [
            'Geleneksel faturalandırma süreçleri saatlerinizi alabilir. TamPazar, Gelir İdaresi Başkanlığı onaylı GİB UBL-TR 2.1 e-Arşiv ve e-Fatura altyapısını dahili olarak çalıştırır.',
            'Müşteriniz sipariş verdiğinde sistem otomatik olarak e-faturayı keser, kargo barkodunu hazırlar ve müşterinize SMS/E-posta ile bildirir.'
          ],
          bulletPoints: [
            'Otomatik GİB e-Fatura & e-Arşiv basımı',
            'Sektöre özel dinamik tartı, malzeme seçici ve randevu takvimi',
            'TamKargo entegrasyonu ile tek tıkla barkodlu kargo çıktısı'
          ]
        }
      ],
      conclusion: 'Alın terinizi komisyonculara ve aracı platformlara kaptırmayın. TamPazar ile dijital dükkanınızı bugün açın, kendi işinizin gerçek patronu olun.'
    }
  },
  {
    id: 'post-2',
    slug: 'tamkurye-ile-tanisin-mahallenizin-bagimsiz-kurye-agi',
    title: 'TamKurye ile Tanışın: Mahallenizin Bağımsız Kurye Ağı',
    excerpt: 'Esnafın tek tıkla yakındaki serbest kuryeleri çağırması, şeffaf km/paket tarifeleri ve kuryelerin kendi çalışma şartlarını belirlemesi.',
    audience: 'esnaf',
    subCategory: 'esnaf',
    categoryLabel: 'Lojistik & Teslimat',
    readTime: '5 dk okuma',
    date: '2026-09-23',
    readCount: '12.8k',
    likePercentage: 98,
    author: {
      name: 'Koray Demir & TamPazar Lojistik Ekibi',
      role: 'TamKurye Operasyon Direktörü',
      avatar: '🛵'
    },
    coverImage: 'https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?auto=format&fit=crop&w=1200&q=80',
    tags: ['#tamkurye', '#hızlıteslimat', '#yerelesnaf', '#komisyonsuz'],
    ctaType: 'merchant',
    checklist: [
      'Esnafın tek tıkla en yakın serbest moto-kuryeyi dükkanına çağırması',
      'Şeffaf km ve paket başına sabit teslimat tarifesi ile sürprizsiz maliyet',
      'Kuryelerin kendi çalışma saatlerini ve bölgelerini serbestçe seçmesi',
      '30-45 dakikada mahalle içi sıcak ve taze teslimat güvencesi'
    ],
    calloutBox: {
      title: 'Öne Çıkan Hap Bilgiler: Bağımsız Kurye Modeli',
      badge: 'HIZLI LOJİSTİK',
      items: [
        'TamKurye, kuryelerin kazancından fahiş komisyon kesmez; kurye emeğinin karşılığını tam alır.',
        'Esnaf kendi dükkan kuryesini kullanabileceği gibi, yoğun anlarda tek tıkla serbest kurye çağırabilir.',
        'Müşteri, siparişinin harita üzerinde canlı olarak yaklaşmasını anlık takip edebilir.'
      ]
    },
    comparisonTable: {
      title: 'TamKurye vs Standart Kargo & Tekel Kurye Firmaları',
      headers: ['Karşılaştırma Kriteri', 'Standart Kargo & Tekel Kuryeler', 'TamKurye Bağımsız Ağı'],
      rows: [
        ['Teslimat Süresi', '24 - 48 Saat (Şehir içi dahil)', '30 - 45 Dakika (Ekspres Mahalle Teslimatı)'],
        ['Kurye Komisyon Kesintisi', '%30-%40 varan yüksek şirket kesintileri', '%0 Komisyon (Mesafe bazlı doğrudan kurye kazancı)'],
        ['Esneklik & Çalışma Saatleri', 'Vardiyalı ve zorunlu çalışma saatleri', 'Kurye dilediği saatte sisteme girip teslimat alır'],
        ['Ürün Hassasiyeti', 'Standart kargo aktarma merkezleri', 'Sıcak ekmek, taze et ve hassas ürün taşıma uygunluğu'],
        ['Canlı Harita Takibi', 'Sadece genel durum güncellemesi', 'Anlık GPS koordinatlı harita takibi']
      ]
    },
    customCta: {
      title: 'TamKurye Ağına Katılın veya Dükkanınız İçin Kurye Çağırın',
      description: 'Motosiklet veya bisikletinizle serbest kurye olarak yüksek kazanç elde edin ya da dükkanınızın siparişlerini ışık hızında teslim ettirin.',
      badge: 'Şeffaf & Adil Lojistik',
      primaryButtonText: 'Kurye Olarak Başvur',
      primaryButtonAction: '/yonetim',
      secondaryButtonText: 'Teslimat Ağını İncele',
      secondaryButtonAction: '/sehir-avm'
    },
    faqs: [
      {
        question: 'TamKurye nasıl çalışır?',
        answer: 'Esnaf sipariş hazırladığında "Kurye Çağır" butonuna basar. Sistem, dükkana en yakın müsait serbest motorlu kuryeye bildirimi ileterek anında teslimat başlatır.'
      },
      {
        question: 'Kurye ücretini kim öder?',
        answer: 'Mesafe bazlı teslimat ücreti sipariş sırasında şeffaf şekilde hesaplanır ve dilediğiniz takdirde müşteriye yansıtılır veya esnaf tarafından karşılanır.'
      }
    ],
    content: {
      lead: 'Yerel ticarette hız ve tazelik müşteri memnuniyetinin anahtarıdır. Fırından çıkan sıcak ekmek, kasaptan alınan taze et veya manavdan sipariş edilen sebzelerin dakikalar içinde adrese ulaşması gerekir. TamKurye bu ihtiyacı bağımsız ve adil bir ağla çözüyor.',
      sections: [
        {
          heading: '1. Tek Tıkla Yakındaki Serbest Kuryeyi Çağırma',
          subheading: 'Sabit Kurye Maliyetinden Kurtulun, İhtiyaç Anında Çağırın',
          paragraphs: [
            'Küçük bir dükkan için tam zamanlı bir kurye istihdam etmek maş, sigorta ve motosiklet bakımı nedeniyle büyük bir finansal yüktür. TamKurye modeli ile sadece sipariş geldiğinde kurye çağırırsınız.',
            'Dükkanınızın bulunduğu mahalledeki bağımsız motorlu ve bisikletli kuryeler sistemde anında görüntülenir. Siparişi hazırlayıp buton bastığınızda en yakın kurye kapınıza gelir.'
          ],
          highlightBox: {
            title: '30 Dakikada Sıcak ve Taze Kapıda',
            text: 'Aktarma merkezleri olmadan, dükkandan doğrudan müşteri adresine kesintisiz ve hızlı teslimat.',
            badge: 'Sıfır Gecikme'
          },
          inlineImage: {
            url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
            caption: 'Mahalle içi 30-45 dakikada ekspres motorlu teslimat ağıyla taze ve sıcak sipariş gönderimi.'
          }
        },
        {
          heading: '2. Kuryeler İçin Bağımsızlık ve Hak Ettiği Kazanç',
          subheading: 'Aracı Şirket Baskısı Olmadan Kendi İşinin Patronu Olma İmkanı',
          paragraphs: [
            'TamKurye sadece esnafı değil, zor şartlarda çalışan kuryeleri de korur. Kuryeler diledikleri saatte uygulamayı açıp çalışabilir, kabul etmek istedikleri teslimatları kendileri seçer.',
            'Mesafe bazlı şeffaf ücretlendirmenin tamamı kuryenin hesabına aktarılır; şirket komisyonu adı altında kurye emeği sömürülmez.'
          ],
          stepGuide: [
            {
              stepNumber: 1,
              title: 'TamKurye Kaydınızı Tamamlayın',
              description: 'Ehliyet, ruhsat ve araç bilgilerinizi yükleyerek bağımsız kurye profilinizi aktif edin.'
            },
            {
              stepNumber: 2,
              title: 'Haritada Çevrimiçi Olun',
              description: 'Çalışmak istediğiniz saatlerde uygulamayı açarak çevrenizdeki esnaf siparişlerini görün.'
            },
            {
              stepNumber: 3,
              title: 'Teslimatı Yapın, Kazancınızı Anında Alın',
              description: 'Siparişi adrese ulaştırın, teslimat ücretini herhangi bir kesinti olmadan hesabınızda görün.'
            }
          ]
        }
      ],
      conclusion: 'Mahallenizin bağımsız kurye ağıyla hem esnaf kazansın hem kurye kazansın hem de müşteriler taze siparişe hızla ulaşsın.'
    }
  },
  {
    id: 'post-3',
    slug: 'fiziksel-dukkandan-dijital-vitrine-qr-afis-ile-satislari-katlayin',
    title: 'Fiziksel Dükkandan Dijital Vitrine: QR Afiş ile Satışları Katlayın',
    excerpt: 'Dükkan camına asılan TamPazar QR kodunun yoldan geçen müşterileri dijital müdavime dönüştürmesi ve mahalle sadakat kartı ikramları.',
    audience: 'esnaf',
    subCategory: 'seo',
    categoryLabel: 'Esnaf Rehberi',
    readTime: '5 dk okuma',
    date: '2026-09-21',
    readCount: '9.6k',
    likePercentage: 97,
    author: {
      name: 'Aylin Çelik & TamPazar Tasarım Ekibi',
      role: 'Perakende Deneyimi ve QR Tasarım Uzmanı',
      avatar: '📱'
    },
    coverImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
    tags: ['#qrafiş', '#dijitalvitrin', '#yerelesnaf', '#komisyonsuz'],
    ctaType: 'merchant',
    checklist: [
      'Dükkan kapalıyken bile vitrinden 7/24 kesintisiz sipariş alma',
      'Yoldan geçen potansiyel müşterileri QR taramasıyla dijital müdavim yapma',
      'Mahalle sadakat kartı ve özel QR indirim kuponları tanımlama',
      'Hemen mağaza açarak otomatik yüksek çözünürlüklü QR afiş üretme'
    ],
    calloutBox: {
      title: 'Öne Çıkan Hap Bilgiler: Akıllı QR Vitrin Teknolojisi',
      badge: '7/24 AKTİF',
      items: [
        'Dükkanınız kepenk indirse dahi camınızdaki QR afiş 24 saat satış yapmaya devam eder.',
        'Müşteri uygulama indirmeden telefon kamerasıyla dükkan menünüzü ve ürünlerinizi inceler.',
        'Siparişler doğrudan masaüstü esnaf zilinizde sesli uyarı ile görüntülenir.'
      ]
    },
    comparisonTable: {
      title: 'Geleneksel Dükkan Vitrini vs TamPazar QR Afişli Dijital Vitrin',
      headers: ['Vitrin Özelliği', 'Klasik Fiziksel Vitrin', 'TamPazar Akıllı QR Vitrin'],
      rows: [
        ['Çalışma Saatleri', 'Sadece kapı açıkken (09:00 - 19:00)', '7/24 Gece ve gündüz kesintisiz sipariş'],
        ['Ürün Çeşitliliği Gösterimi', 'Fiziksel alanla sınırlı kısıtlı sergileme', 'Tüm ürün kataloğu, varyantlar ve stok durumu'],
        ['Müşteri Etkileşimi', 'Yoldan bakıp geçen pasif ziyaretçi', 'Anında taranabilir, sepete eklenebilir aktif etkileşim'],
        ['Sadakat & Kampanya', 'Kağıt kartvizit veya sözlü bilgilendirme', 'Otomatik dijital sadakat puanı ve QR kuponlar'],
        ['Kurulum Maliyeti', 'Pahalı dekorasyon ve dijital ekranlar', 'Ücretsiz basılabilir akıllı QR afiş']
      ]
    },
    customCta: {
      title: 'Dükkanınız İçin Akıllı QR Afişinizi Oluşturun',
      description: 'TamPazar esnaf panelinden tek tıkla dükkanınıza özel QR kodunuzu indirin, camınıza asın ve gece bile sipariş alın.',
      badge: 'Ücretsiz QR Oluşturucu',
      primaryButtonText: 'QR Afişini Şimdi Üret',
      primaryButtonAction: '/yonetim',
      secondaryButtonText: 'Örnek Vitrini Gör',
      secondaryButtonAction: '/'
    },
    faqs: [
      {
        question: 'QR afişler dükkanımıza nasıl ulaşır?',
        answer: 'TamPazar yönetim panelinizden dükkanınıza özel yüksek çözünürlüklü vektör QR dosyasını indirip matbaanızdan bastırabilir veya kargo ile basılı afiş talep edebilirsiniz.'
      },
      {
        question: 'Müşterinin uygulama indirmesi gerekir mi?',
        answer: 'Hayır! TamPazar QR kodları web tabanlı çalışır; müşteri telefon kamerasını tuttuğu an dükkanınızın web sayfası anında açılır.'
      }
    ],
    content: {
      lead: 'Fiziksel dükkanınızın konumu harika olabilir ancak hava karardığında veya kepenk kapandığında satışlarınız duruyor mu? TamPazar QR Afiş teknolojisi ile fiziksel dükkanınızı 7/24 sipariş alan akıllı bir dijital vitrine dönüştürün.',
      sections: [
        {
          heading: '1. Kepenk Kapalıyken Bile Yoldan Geçen Müşteriyi Yakalayın',
          subheading: 'Gece Yürüyüşündeki Komşuyu Dijital Müdavime Dönüştürme',
          paragraphs: [
            'Akşam işten dönen veya hafta sonu caddede yürüyen bir komşunuz, dükkanınız kapalı olsa dahi camdaki QR afişi taratarak yarın sabah için taze ekmek siparişi verebilir veya kasap reyonundan et rezerve edebilir.',
            'Bu sayede fiziksel mülkünüzün kira maliyetini 24 saat kesintisiz gelire dönüştürürsünüz.'
          ],
          highlightBox: {
            title: 'Sıfır Yazılım Maliyetiyle Akıllı Vitrin',
            text: 'Pahalı dijital panolar veya reklam ekranları yerine yüksek kaliteli TamPazar QR afişi yeterlidir.',
            badge: 'Tam Verimlilik'
          },
          inlineImage: {
            url: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1200&q=80',
            caption: 'Dükkan camına asılan QR afiş ile gece kepenk kapalıyken bile yoldan geçen müşterilerden sipariş alma.'
          }
        },
        {
          heading: '2. Mahalle Sadakat Kartı ve QR İkram Kampanyaları',
          subheading: 'Müşteriyi Sürekli Dükkanınıza Çeken Kampanya Kurguları',
          paragraphs: [
            'QR afişinizi taratan müşterilere "İlk QR Siparişinizde Çay İkramı" veya "5. Alışverişte %10 İndirim" gibi mahalle samimiyetine uygun dijital sadakat kartları sunabilirsiniz.'
          ],
          stepGuide: [
            {
              stepNumber: 1,
              title: 'Paneldan QR Kodunuzu İndirin',
              description: 'Esnaf panelinizin "QR Afiş" sekmesinden dükkan logonuzun yer aldığı tasarımı seçin.'
            },
            {
              stepNumber: 2,
              title: 'Camınıza veya Kasaya Görünür Şekilde Asın',
              description: 'Afişi dükkan camının dışarıdan rahat okunabilecek göz hizası noktasına yapıştırın.'
            },
            {
              stepNumber: 3,
              title: 'Gelen Müşterilere QR İkramını Anlatın',
              description: 'Kasada duran müşterilerinize QR kodu taratarak dijital veresiye ve indirimlerden faydalanabileceklerini hatırlatın.'
            }
          ]
        }
      ],
      conclusion: 'Dükkanınızın kapısını kapatsanız da dijital vitrininiz hep açık kalsın. Hemen mağazanızı açın ve QR afişinizi indirin.'
    }
  },
  {
    id: 'post-4',
    slug: 'b2b-kapali-devre-toptan-fabrikadan-ve-ureticiden-dogrudan-tedarik',
    title: 'B2B Kapalı Devre Toptan: Fabrikadan ve Üreticiden Doğrudan Tedarik',
    excerpt: 'Restoran, market ve atölyeler için koli/palet bazlı indirimli tedarik, GİB e-irsaliye güvencesi ve ambar sevkiyatları.',
    audience: 'esnaf',
    subCategory: 'finans',
    categoryLabel: 'Toptan Ticaret',
    readTime: '6 dk okuma',
    date: '2026-09-19',
    readCount: '11.2k',
    likePercentage: 98,
    author: {
      name: 'Hakan Öztürk & B2B Tedarik Kurulu',
      role: 'B2B Tedarik Zinciri Müdürü',
      avatar: '🏭'
    },
    coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    tags: ['#toptanticaret', '#b2b', '#efatura', '#komisyonsuz'],
    ctaType: 'merchant',
    checklist: [
      'Restoran, market ve atölyeler için koli ve palet bazlı doğrudan fabrika fiyatları',
      'Fabrikadan ve ana üreticiden aracı toptancı olmadan satın alım imkanı',
      'GİB e-irsaliye ve resmi ticari fatura entegrasyonu ile tam yasal güvence',
      'Ambar ve kamyonet sevkiyatlarında şeffaf navlun takibi'
    ],
    calloutBox: {
      title: 'Öne Çıkan Hap Bilgiler: B2B Toptan Ağı',
      badge: 'TOPTAN TASARRUF',
      items: [
        'TamPazar B2B ağı sadece onaylı vergi mükellefi işletmelere açıktır (Kapalı Devre).',
        'Kademeli sipariş miktarına göre (MOQ) palet ve koli alımlarında %25-30 maliyet avantajı sağlanır.',
        'E-İrsaliye ve e-Fatura süreçleri doğrudan Gelir İdaresi Başkanlığı sistemleriyle entegredir.'
      ]
    },
    comparisonTable: {
      title: 'Aracılı Toptancı Satışı vs TamPazar B2B Toptan Modeli',
      headers: ['Tedarik Kriteri', 'Geleneksel Toptancı & Distribütör', 'TamPazar B2B Kapalı Devre'],
      rows: [
        ['Fiyatlandırma', 'Çok katmanlı aracı kâr marjları eklenmiş', 'Doğrudan fabrika ve ana üretici çıkış fiyatı'],
        ['Minimum Sipariş (MOQ)', 'Sert ve yüksek kotayla kısıtlı', 'Esnek koli ve palet bazlı kademeli fiyatlama'],
        ['Belgelendirme & İrsaliye', 'Kağıt irsaliye ve gecikmeli faturalar', 'Anında GİB e-İrsaliye ve dijital fatura kaydı'],
        ['Sevkiyat Seçenekleri', 'Sadece bölge distribütörünün rotası', 'Anlaşmalı ambar, kargo ve yerel nakliye ağı'],
        ['Komisyon Oranı', 'Distribütör payı %15-%25 arası', '%0 Komisyon (İşletmeler arası doğrudan ticaret)']
      ]
    },
    customCta: {
      title: 'İşletmenizin Tedarik Maliyetlerini %25 Düşürün',
      description: 'Vergi levhanızla B2B kapalı devre toptan ağına katılın, fabrikadan koli ve palet bazlı tedariğe hemen başlayın.',
      badge: 'Kurumsal Tedarik',
      primaryButtonText: 'B2B Toptan Panelini Aç',
      primaryButtonAction: '/yonetim',
      secondaryButtonText: 'Tedarikçileri İncele',
      secondaryButtonAction: '/'
    },
    faqs: [
      {
        question: 'B2B toptan pazaryerine kimler katılabilir?',
        answer: 'Vergi mükellefi olan tüm restoranlar, kafeler, bakkallar, marketler, atölyeler ve fabrika üreticileri B2B modülünden toptan alım veya satım yapabilir.'
      },
      {
        question: 'Ambar ve nakliye süreçleri nasıl işler?',
        answer: 'Sipariş oluşturulurken palet ve koli hacmine göre anlaşmalı ambar tarifeleri görüntülenir. Sevkiyat e-İrsaliye ile güvenle yola çıkar.'
      }
    ],
    content: {
      lead: 'Restoranınız için un, zeytinyağı veya et; bakkalınız için gıda kolileri; atölyeniz için hammadde... Geleneksel distribütör ve aracı zincirleri hammadde maliyetlerini yükselterek kârlılığınızı eritir. TamPazar B2B Kapalı Devre Toptan Ağı üretici ile işletmeyi doğrudan buluşturuyor.',
      sections: [
        {
          heading: '1. Fabrikadan ve Üreticiden Doğrudan Koli/Palet Alımı',
          subheading: 'Aracıları Aradan Çıkararak Hammadde Maliyetini Düşürme',
          paragraphs: [
            'B2B Kapalı Devre sisteminde üreticiler doğrudan fabrikanın çıkış fiyatlarını tanımlar. İşletmeniz 5 koli alımda farklı, 2 palet alımda farklı kademeli indirimlerden (MOQ) faydalanır.',
            'Sistem sadece doğrulanmış vergi mükelleflerine açık olduğu için nihai tüketici fiyatları zedelenmez ve ticari gizlilik korunur.'
          ],
          highlightBox: {
            title: 'Brüt Kâr Marjınızı %25 Artırın',
            text: 'Girdi maliyetlerinizi düşürerek rekabette öne geçin ve işletmenizin nakit akışını güçlendirin.',
            badge: 'Doğrudan Üretici'
          },
          inlineImage: {
            url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
            caption: 'Koli ve palet bazlı doğrudan üretici tedariki ile restoran ve bakkallara ambar teslimat güvencesi.'
          }
        },
        {
          heading: '2. GİB e-İrsaliye ve Ambar Sevkiyat Yönetimi',
          subheading: 'Yasal Uyum ve Güvenli Şehirlerarası Lojistik',
          paragraphs: [
            'Toptan ticarette belge takibi kritik önem taşır. TamPazar B2B modülü Gelir İdaresi Başkanlığı e-İrsaliye standartlarıyla tam entegre çalışır. Faturanız sipariş anında otomatik kesilir.'
          ],
          stepGuide: [
            {
              stepNumber: 1,
              title: 'Vergi Levhanızla B2B Doğrulaması Yapın',
              description: 'Esnaf panelinizden vergi levhanızı yükleyerek B2B Kapalı Devre yetkisi alın.'
            },
            {
              stepNumber: 2,
              title: 'Üretici Kataloğundan Palet/Koli Seçin',
              description: 'İhtiyacınız olan ürün miktarına göre kademeli toptan indirim oranlarını inceleyin.'
            },
            {
              stepNumber: 3,
              title: 'e-İrsaliye ile Ambar Teslimatını Takip Edin',
              description: 'Ödemenizi yapın, GİB onaylı e-İrsaliyenizle ambar ve kargo takip kodunuzu alın.'
            }
          ]
        }
      ],
      conclusion: 'Toptan alım ve satımda aracıları ortadan kaldırın. B2B Kapalı Devre Toptan ağına hemen katılın.'
    }
  },
  {
    id: 'post-5',
    slug: 'hizmet-ve-ustalikta-komisyonsuz-teklif-cagi-tamusta-tamteklif',
    title: 'Hizmet ve Ustalıkta Komisyonsuz Teklif Çağı: TamUsta & TamTeklif',
    excerpt: 'Tesisatçı, boyacı, tamirci ve fotoğrafçıların müşteriyle doğrudan WhatsApp/telefon üzerinden aracısız buluşması.',
    audience: 'tuketici',
    subCategory: 'tuketici',
    categoryLabel: 'Yerel Hizmetler',
    readTime: '5 dk okuma',
    date: '2026-09-17',
    readCount: '13.5k',
    likePercentage: 99,
    author: {
      name: 'Meryem Aydın & Yerel Zanaat Heyeti',
      role: 'Yerel Hizmetler Deneyim Uzmanı',
      avatar: '🔧'
    },
    coverImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    tags: ['#tamteklif', '#tamusta', '#yerelusta', '#komisyonsuz'],
    ctaType: 'consumer',
    checklist: [
      'Tesisatçı, boyacı, tamirci ve fotoğrafçılardan kapalı zarf usulü şeffaf teklif toplama',
      'WhatsApp veya telefon üzerinden aracı komisyonu olmadan doğrudan usta ile görüşme',
      'Gerçek müşteri puanları, onaylı oda kayıtları ve belgeli usta rozetleri',
      '1 dakikada fotoğraf ve açıklama ekleyerek ücretsiz teklif talebi oluşturma'
    ],
    calloutBox: {
      title: 'Öne Çıkan Hap Bilgiler: TamTeklif Modeli',
      badge: 'ARACISIZ HİZMET',
      items: [
        'TamTeklif sisteminde ustalar birbirlerinin teklif fiyatlarını göremez (Kapalı Zarf).',
        'Müşteriden veya ustadan teklif başı komisyon alınmaz; pazarlık doğrudan yapılır.',
        'İş bitiminde ödeme aracı siteye değil doğrudan ustanın kendisine teslim edilir.'
      ]
    },
    comparisonTable: {
      title: 'TamTeklif vs Komisyonlu Usta Bulma Siteleri',
      headers: ['Hizmet Özelliği', 'Klasik Komisyonlu Usta Siteleri', 'TamPazar TamTeklif Modeli'],
      rows: [
        ['Usta ve Müşteriden Komisyon', 'Teklif verme ve iş alma başına %15-%25 kesinti', '%0 Komisyon (Tamamen ücretsiz iletişim)'],
        ['İletişim Kanalı', 'Site içi kısıtlı mesajlaşma, numara gizleme', 'Doğrudan WhatsApp ve Telefon ile anında görüşme'],
        ['Teklif Usulü', 'Açık eksiltme ile fiyat kırma savaşı', 'Kapalı zarf usulüyle kaliteli ve adil teklif verme'],
        ['Ustalık Doğrulaması', 'Yalnızca e-posta doğrulaması', 'Oda kaydı, ustalık belgesi ve mahalle referansı'],
        ['Ödeme Güvencesi', 'Site havuzunda komisyon kesintili', 'İş tesliminde doğrudan ustaya ödeme']
      ]
    },
    customCta: {
      title: 'Aradığınız Ustaya 1 Dakikada Aracısız Ulaşın',
      description: 'Tesisat, boya, tamir veya fotoğrafçılık... İhtiyacınızı yazın, mahallenizin güvenilir ustalarından kapalı zarf teklifleri toplayın.',
      badge: '%0 Komisyonlu Teklif',
      primaryButtonText: 'TamTeklif Ver / Usta Bul',
      primaryButtonAction: '/sehir-avm',
      secondaryButtonText: 'Usta Profillerini İncele',
      secondaryButtonAction: '/'
    },
    faqs: [
      {
        question: 'TamTeklif üzerinden nasıl usta bulabilirim?',
        answer: 'TamTeklif sekmesinden aradığınız hizmeti (örn: su kaçağı tespiti veya ev boyama) seçip fotoğraf/açıklama ekleyerek talebinizi oluşturursunuz. Bölgenizdeki ustalar size kapalı zarf teklif gönderir.'
      },
      {
        question: 'Ustalara teklif için ücret öder miyim?',
        answer: 'Hayır, TamTeklif sistemi hem müşteriler hem de ustalar için tamamen ücretsizdir.'
      }
    ],
    content: {
      lead: 'Evimizde bir su tesisatı patladığında veya boya badana yaptıracağımızda en büyük endişemiz güvenilir bir usta bulmak ve fahiş komisyon alan aracı sitelere para kaptırmamaktır. TamTeklif, mahallemizin belgeli ustaları ile sizi doğrudan ve komisyonsuz buluşturuyor.',
      sections: [
        {
          heading: '1. Kapalı Zarf Usulü Şeffaf ve Adil Fiyatlandırma',
          subheading: 'Ustaların Kaliteden Ödün Vermeden En İyi Fiyatı Sunması',
          paragraphs: [
            'Klasik hizmet sitelerinde ustalar sürekli fiyat kırarak kaliteden ödün vermek zorunda kalır. TamTeklif sisteminde ise ustalar birbirinin fiyatını görmez.',
            'Usta, işin gerektirdiği malzeme ve işçilik kalitesine göre en gerçekçi teklifini hazırlar. Siz de gelen teklifleri, ustanın puanlarını ve geçmiş iş fotoğraflarını inceleyerek karar verirsiniz.'
          ],
          highlightBox: {
            title: 'Doğrudan WhatsApp ve Telefon İletişimi',
            text: 'Teklifi beğendiğiniz an ustanın WhatsApp butonuna basarak fotoğrafları paylaşabilir ve anında keşif saati belirleyebilirsiniz.',
            badge: 'Anında Bağlantı'
          },
          inlineImage: {
            url: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=1200&q=80',
            caption: 'Tesisat, tamir ve zanaat ustalarının müşterilerle doğrudan WhatsApp/telefon üzerinden aracısız buluşması.'
          }
        },
        {
          heading: '2. Belgelendirilmiş ve Mahalle Referanslı Zanaatkarlar',
          subheading: 'Sadece Ehliyetli ve Güvenilir Ustalarla Çalışma Huzuru',
          paragraphs: [
            'TamUsta modülüne kayıt olan ustaların Esnaf ve Sanatkarlar Odası kayıtları ve Ustalık/Kalfalık belgeleri doğrulanır.',
            'Mahallenizdeki komşularınızın değerlendirmeleri sayesinde işini temiz yapan zanaat sahipleri öne çıkar.'
          ],
          stepGuide: [
            {
              stepNumber: 1,
              title: 'İhtiyacınızı ve Arızanın Fotoğrafını Yükleyin',
              description: '1 dakikada adresinizi ve yapılacak işin detayını TamTeklif formuna yazın.'
            },
            {
              stepNumber: 2,
              title: 'Gelen Kapalı Zarf Teklifleri Karşılaştırın',
              description: 'Bölgenizdeki ustalardan gelen fiyat, malzeme kalitesi ve usta puanlarını inceleyin.'
            },
            {
              stepNumber: 3,
              title: 'Ustayı Doğrudan Arayıp İşi Başlatın',
              description: 'Tek tıkla ustanızla görüşün, iş bitiminde ödemenizi komisyonsuz doğrudan teslim edin.'
            }
          ]
        }
      ],
      conclusion: 'Evinizdeki ve iş yerinizdeki tüm tamirat ve hizmet işleri için komisyonculara değil, mahallenizin usta ellerine güvenin.'
    }
  },
  {
    id: 'post-6',
    slug: 'askida-mahalle-ve-yerel-dayanisma-firinlar-manavlar-ve-komsu-sofralari',
    title: 'Askıda Mahalle ve Yerel Dayanışma: Fırınlar, Manavlar ve Komşu Sofraları',
    excerpt: 'Mahalle fırınları ve manavlarında askıda ekmek/sebze ikramı ile komşuluk dayanışmasını dijitalleştiren TamPazar Sosyal Modeli.',
    audience: 'tuketici',
    subCategory: 'dayanisma',
    categoryLabel: 'Yerel Ekonomi & Dayanışma',
    readTime: '4 dk okuma',
    date: '2026-09-18',
    readCount: '11.8k',
    likePercentage: 99,
    author: {
      name: 'Dr. Zeynep Kaya & Mahalle Dayanışma Ağı',
      role: 'Sosyal Dayanışma ve Yerel Kalkınma Uzmanı',
      avatar: '🍞'
    },
    coverImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    tags: ['#mahalledayanışması', '#askıdaekmek', '#yerelesnaf', '#komşuluk'],
    ctaType: 'consumer',
    checklist: [
      'Sıcak fırın ekmeği, taze meyve ve çorba için dijital askıya ikram bırakma',
      'Aracı vakıf veya komisyon olmadan doğrudan mahalle fırınına iletim',
      'İhtiyaç sahiplerinin rencide olmadan askıdan faydalanabilmesi',
      'Şeffaf dijital sayaç ile askıdaki toplam ürün sayısını anlık izleme'
    ],
    calloutBox: {
      title: 'Öne Çıkan Hap Bilgiler: Askıda Mahalle Kültürü',
      badge: 'GÖNÜL KÖPRÜSÜ',
      items: [
        'Geleneksel "Askıda Ekmek" kültürünü dijital çağın şeffaflığıyla buluşturur.',
        'Bırakılan her ikram doğrudan seçtiğiniz mahalle fırınının veya manavının panosuna düşer.',
        'Sıfır komisyon ilkesiyle bıraktığınız her kuruş %100 oranında somut gıdaya dönüşür.'
      ]
    },
    comparisonTable: {
      title: 'Anonim Bağış Toplama vs TamPazar Askıda Mahalle Modeli',
      headers: ['Dayanışma Kriteri', 'Klasik Anonim Fonlar & Siteler', 'TamPazar Askıda Mahalle'],
      rows: [
        ['Paranın Ulaştığı Yer', 'Merkezi havuz ve bürokrasi giderleri', 'Doğrudan seçtiğiniz mahalle fırını/manavı'],
        ['Şeffaflık & İzleme', 'Genel yıllık raporlar', 'Anlık dijital askı panosu ve canlı adet sayacı'],
        ['Yerel Esnafa Katkı', 'Yerel esnafa dokunmaz', 'Mahalle fırıncısının ve manavının çarkını döndürür'],
        ['İhtiyaç Sahibine Ulaşım', 'Karmaşık başvuru süreçleri', 'Mahallelinin samimi ve rencide etmeyen komşu takibi'],
        ['Kesinti Oranı', '%10-%20 yönetim gideri kesintisi', '%0 Kesinti (Paranın tamamı ekmeğe dönüşür)']
      ]
    },
    customCta: {
      title: 'Mahallenizdeki Fırına ve Manava Bir İkram da Siz Bırakın',
      description: 'Sıcak bir ekmek veya bir çorba ikramıyla komşularınızın sofrasına bereket katın, yerel esnafınızı destekleyin.',
      badge: '%100 Doğrudan İkram',
      primaryButtonText: 'Askıya İkram Bırak',
      primaryButtonAction: '/sehir-avm',
      secondaryButtonText: 'Mahalle Fırınlarını Gör',
      secondaryButtonAction: '/'
    },
    faqs: [
      {
        question: 'Askıda Ekmek sistemi nasıl işler?',
        answer: 'TamPazar üzerinden alışveriş yaparken veya doğrudan Askıda Mahalle sekmesinden dilediğiniz mahalle fırınını seçip 1, 5 veya 10 ekmek ikramı eklersiniz. Fırıncı bu ikramı anında askı panosuna işler.'
      }
    ],
    content: {
      lead: 'Anadolu kültürünün en zarif geleneklerinden biri olan Askıda Ekmek, komşusu açken tok yatmayan samimi mahalle dayanışmasının simgesidir. TamPazar bu asil kültürü dijital çağın şeffaflığıyla mahallelerinize taşıyor.',
      sections: [
        {
          heading: '1. Dijital Çağda Komşuluk ve Şeffaf İkram Panosu',
          subheading: 'Hangi Fırında Kaç Askıda Ekmek Olduğunu Anlık Görme',
          paragraphs: [
            'Büyük şehirlerde komşularımızla iletişimimiz azalsa da dayanışma ruhumuz dipdiri. TamPazar Askıda Mahalle modülü ile yaşadığınız veya doğduğunuz mahalledeki fırına cep telefonunuzdan ekmek bırakabilirsiniz.',
            'Fırın ekranında "Askıda 12 Sıcak Ekmek Var" yazısı belirir ve ihtiyacı olan komşularımız rencide olmadan fırından ekmeğini alabilir.'
          ],
          highlightBox: {
            title: '%100 İkram, %0 Bürokrasi',
            text: 'TamPazar bu hayır köprüsünden hiçbir işletim ücreti kesmez; bıraktığınız her ikram eksiksiz olarak fırıncıya ve komşunuza ulaşır.',
            badge: 'Gönül Rahatlığı'
          },
          inlineImage: {
            url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1200&q=80',
            caption: 'Mahalle fırınları ve manavlarında askıda ekmek/sebze ikramı ile komşuluk dayanışmasını dijitalleştiren model.'
          }
        }
      ],
      conclusion: 'Mahalle fırınlarımızı yaşatmak ve komşu sofralarına bereket olmak için siz de bir ikram bırakın.'
    }
  },
  {
    id: 'post-7',
    slug: 'tamdijital-tasarimcilar-ve-ureticiler-icin-dijital-varlik-pazari',
    title: 'TamDijital: Tasarımcılar ve Üreticiler İçin Dijital Varlık Pazarı',
    excerpt: 'Vektör çizimler, lazer/CNC kesim şablonları, sosyal medya kitleri ve e-kitapların anında indirme modeliyle satışı.',
    audience: 'tuketici',
    subCategory: 'tuketici',
    categoryLabel: 'Dijital Ürünler',
    readTime: '4 dk okuma',
    date: '2026-09-15',
    readCount: '10.1k',
    likePercentage: 98,
    author: {
      name: 'Canberk Erdem & TamDijital Ekibi',
      role: 'Dijital Ürünler Küratörü',
      avatar: '💻'
    },
    coverImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
    tags: ['#tamdijital', '#dijitalürünler', '#vektörçizim', '#komisyonsuz'],
    ctaType: 'consumer',
    checklist: [
      'Vektör çizimler, 3D modeller ve lazer/CNC kesim şablonları satışı',
      'Sosyal medya kitleri, grafik tasarım şablonları ve e-kitaplar',
      'Ödeme onaylandığı an otomatik ve güvenli dosya indirme bağlantısı (Instant Download)',
      'Tasarımcılar ve dijital içerik üreticileri için %0 komisyonla gelir elde etme'
    ],
    calloutBox: {
      title: 'Öne Çıkan Hap Bilgiler: TamDijital Üretici Pazarı',
      badge: 'ANINDA İNDİRME',
      items: [
        'Dijital dosyalar güvenli sunucularda barındırılır ve ödeme sonrası saniyesinde indirilir.',
        'Yabancı stok sitelerindeki %50-%70 varan komisyon kesintilerine son verir.',
        'Lazer kesim ve CNC atölyeleri doğrudan Türk tasarımcıların şablonlarını satın alır.'
      ]
    },
    comparisonTable: {
      title: 'Uluslararası Stok Siteleri vs TamDijital %0 Komisyon Modeli',
      headers: ['Pazaryeri Metriği', 'Yabancı Stok Platformları (Etsy, Envato)', 'TamPazar TamDijital'],
      rows: [
        ['Tasarımcı Komisyon Kesintisi', '%30 - %70 arasında devasa kesintiler', '%0 Komisyon (Kazancın %100\'ü tasarımcının)'],
        ['Dosya Teslimat Süresi', 'Manuel onay süreçleri ve gecikmeler', 'Ödeme anında otomatik güvenli indirme bağlantısı'],
        ['Para Çekme & Kur Kaybı', 'Yüksek swift ücretleri ve kur kaybı', 'Ertesi gün doğrudan Türk Lirası banka hesabına'],
        ['Fatura & Yasal Uyum', 'Karmaşık yurt dışı vergilendirme', 'Otomatik GİB e-Arşiv/e-Fatura entegrasyonu'],
        ['Atölye ve Üretici Uyumu', 'Genel ve Türkçe desteği olmayan içerik', 'Lazer, CNC ve mobilya üreticilerine özel şablonlar']
      ]
    },
    customCta: {
      title: 'Tasarımlarınızı Yükleyin, %0 Komisyonla Dijital Varlık Satın',
      description: 'Lazer kesim vektörleri, grafik şablonları veya e-kitaplar... Eserlerinizi Türkiye\'deki üreticilere ve ajanslara anında ulaştırın.',
      badge: 'Anında Dosya Satışı',
      primaryButtonText: 'Dijital Varlık Sat',
      primaryButtonAction: '/yonetim',
      secondaryButtonText: 'Şablon Kütüphanesini Gez',
      secondaryButtonAction: '/'
    },
    faqs: [
      {
        question: 'Dijital ürünler nasıl teslim edilir?',
        answer: 'Ödeme tamamlandığı anda sistem müşteriye anında güvenli ve tek kullanımlık bir indirme bağlantısı (secure download link) üretir.'
      },
      {
        question: 'Hangi dosya formatlarını yükleyebilirim?',
        answer: 'AI, DXF, SVG, CDR (lazer/CNC kesim için), PDF, ZIP, PSD ve EPUB dahil tüm popüler dijital varlık formatları desteklenmektedir.'
      }
    ],
    content: {
      lead: 'Fiziksel ürünlerin yanı sıra dijital varlık üreten tasarımcılar, çizerler, mimarlar ve yazarlar için TamDijital pazaryeri açıldı. Yabancı platformların yüksek komisyonlarına son verin.',
      sections: [
        {
          heading: '1. Anında İndirme (Instant Download) ve Yüksek Güvenlik',
          subheading: 'Tasarımcı Emeğini Koruyan Otomatik Lisanslama',
          paragraphs: [
            'Lazer kesim ahşap şablonları, CNC vektör çizimleri, sosyal medya tasarım kitleri veya e-kitaplar... Müşteriniz satın alma işlemini tamamladığı an sistem dosyayı saniyesinde sunar.',
            'Aracı komisyon kesintisi olmadığı için tasarımcılar emeklerinin karşılığını tam olarak banka hesaplarında görür.'
          ],
          highlightBox: {
            title: 'Tasarımcılara %100 Kazanç',
            text: 'Dijital dosyalarınızı bir kez yükleyin, binlerce üreticiye ve işletmeye sürekli satış yaparak pasif gelir elde edin.',
            badge: '%100 Telif'
          },
          inlineImage: {
            url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
            caption: 'Lazer/CNC kesim vektörleri, grafik kitleri ve e-kitapların anında indirme (instant download) modeliyle satışı.'
          }
        },
        {
          heading: '2. Lazer ve CNC Atölyeleri İçin Yerli Şablon Kütüphanesi',
          subheading: 'Atölyelerin Çizim Zamanından Tasarruf Etmesi',
          paragraphs: [
            'Lazer kesim ahşap, pleksi veya metal işleyen üretici atölyeler, sıfırdan çizim yapmak yerine TamDijital kütüphanesindeki onaylı vektörleri indirerek saniyeler içinde kesime başlayabilir.'
          ],
          stepGuide: [
            {
              stepNumber: 1,
              title: 'Dijital Dosyanızı Yükleyin',
              description: 'DXF, SVG, AI veya PDF formatındaki tasarım dosyanızı paneldan sisteme yükleyin.'
            },
            {
              stepNumber: 2,
              title: 'Lisans Koşulunu ve Fiyatı Belirleyin',
              description: 'Kişisel veya ticari kullanım lisans fiyatınızı tanımlayın.'
            },
            {
              stepNumber: 3,
              title: 'Satış Yapın ve Anında Tahsil Edin',
              description: 'İndirme gerçekleştikçe tutar doğrudan Sanal POS hesabınıza yansısın.'
            }
          ]
        }
      ],
      conclusion: 'Dijital varlıklarınızı satmak veya en iyi yerli şablonları keşfetmek için TamDijital kütüphanesini bugün keşfedin.'
    }
  }
];

export const blogPosts: BlogPost[] = [...staticBlogPosts];

// =========================================================================
// OTOMATİK İÇERİK ŞABLON MOTORU (Dynamic Programmatic Article Generator)
// =========================================================================

/**
 * Verilen bir slug'ı çözer veya programatik olarak zengin içerikli makale üretir.
 */
export function getOrGenerateBlogPost(slug: string): BlogPost | null {
  if (!slug) return null;

  // 1. Önce sabit yazılarda ara
  const staticFound = staticBlogPosts.find(p => p.slug === slug);
  if (staticFound) return staticFound;

  // 2. Slug ayrıştırma (Programatik URL Çözücü)
  // Örn: ordu-altinordu-kasap-komisyonsuz-siparis-rehberi
  // veya kadikoy-tesisatci-fiyat-teklifi-ve-usta-bulma-rehberi
  const cleanSlug = slug.toLowerCase();

  // İl ve İlçe tespiti
  let matchedCity = 'Ordu';
  let matchedDistrict = 'Altınordu';
  let matchedCityObj = CITIES_DATA[0];

  for (const c of CITIES_DATA) {
    const cSlug = slugify(c.city);
    if (cleanSlug.includes(cSlug)) {
      matchedCity = c.city;
      matchedCityObj = c;
      for (const d of c.districts) {
        if (cleanSlug.includes(slugify(d.name))) {
          matchedDistrict = d.name;
          break;
        }
      }
      break;
    }
  }

  // Sektör tespiti
  let matchedSector = SECTORS[0];
  for (const s of SECTORS) {
    if (cleanSlug.includes(s.id) || cleanSlug.includes(slugify(s.name))) {
      matchedSector = s;
      break;
    }
  }

  // Konu tespiti
  let matchedTopic = PROGRAMMATIC_TOPICS[0];
  for (const t of PROGRAMMATIC_TOPICS) {
    if (cleanSlug.includes(t.slugSuffix) || cleanSlug.includes(t.id)) {
      matchedTopic = t;
      break;
    }
  }

  // Eğer tüketici terimleri geçiyorsa konuyu tüketiciye çek
  if (cleanSlug.includes('tuketici') || cleanSlug.includes('fiyat-teklifi') || cleanSlug.includes('en-taze') || cleanSlug.includes('israfsiz')) {
    matchedTopic = PROGRAMMATIC_TOPICS.find(t => t.audience === 'tuketici') || matchedTopic;
  }

  // Dinamik Metin Üretimi
  const title = matchedTopic.titlePattern
    .replace('{city}', matchedCity)
    .replace('{district}', matchedDistrict)
    .replace('{sector}', matchedSector.name);

  const lead = matchedTopic.leadPattern
    .replace('{city}', matchedCity)
    .replace('{district}', matchedDistrict)
    .replace('{sector}', matchedSector.name);

  const isMerchant = matchedTopic.audience === 'esnaf';

  // Sektöre özel kapak görseli
  const sectorImages: Record<string, string> = {
    kasap: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1200&q=80',
    manav: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1200&q=80',
    firin: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    tesisatci: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=1200&q=80',
    elektrikci: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
    fotografci: 'https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=1200&q=80',
    kuafor: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
    sarkuteri: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=80',
    cicekci: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=1200&q=80',
    butik: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    'oto-tamir': 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80',
    terzi: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=80'
  };

  const coverImage = sectorImages[matchedSector.id] || 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80';

  // Dinamik SSS (FAQ)
  const faqs: BlogFAQ[] = isMerchant ? [
    {
      question: `${matchedCity} ${matchedDistrict} bölgesinde ${matchedSector.name} olarak TamPazar'a nasıl katılırım?`,
      answer: `TamPazar /yonetim paneli üzerinden vergi numaranız veya esnaf sicil bilginizle 2 dakikada dijital dükkanınızı açabilir, anında ürün/hizmet yüklemeye başlayabilirsiniz.`
    },
    {
      question: `${matchedDistrict} içindeki müşterilerime siparişleri nasıl teslim edebilirim?`,
      answer: `İster kendi dükkan personeliniz veya yerel moto-kurye ile 30-45 dakikada hızlı teslimat yapın, isterseniz TamKargo anlaşmalı barkodlarıyla aynı gün kargo çıkışı sağlayın.`
    },
    {
      question: `${matchedSector.name} için aracı komisyonu kesilir mi?`,
      answer: `Kesinlikle hayır! TamPazar %0 komisyon politikası uygular. Satış bedelinin tamamı kendi Sanal POS'unuz üzerinden bankanıza yatar.`
    }
  ] : [
    {
      question: `${matchedCity} ${matchedDistrict} bölgesinde en güvenilir ${matchedSector.name} nasıl bulunur?`,
      answer: `TamPazar Şehir Açık AVM'sinde ${matchedDistrict} konumunu seçerek doğrulanmış yerel ${matchedSector.name} esnaflarını, gerçek müşteri puanlarını ve ürün vitrinlerini inceleyebilirsiniz.`
    },
    {
      question: `TamTeklif ile ${matchedDistrict} esnafından nasıl fiyat teklifi alırım?`,
      answer: `TamTeklif sekmesinden ihtiyacınızı yazıp fotoğraf eklediğinizde, ${matchedCity} bölgesindeki kayıtlı ustalar size kapalı zarf usulü şeffaf teklifler sunar. En uygun olanı tek tıkla onaylayabilirsiniz.`
    },
    {
      question: `${matchedSector.name} alışverişlerimde kargo ve teslimat süresi nedir?`,
      answer: `Mahalle içi siparişlerde ortalama 30-45 dakikada yerel teslimat sağlanır. Türkiye geneli gönderilerde anlaşmalı TamKargo ile 24-48 saatte kapınıza ulaşır.`
    }
  ];

  const generatedPost: BlogPost = {
    id: `prog-${slug}`,
    slug: slug,
    title: title,
    excerpt: `${matchedCity} ili ${matchedDistrict} ilçesindeki ${matchedSector.name} sektörü için güncel dijitalleşme, %0 komisyon, doğrudan esnaf fiyatları ve yerel sipariş kılavuzu.`,
    audience: matchedTopic.audience,
    subCategory: matchedTopic.categoryLabel === 'Finans & Maliyet' ? 'finans' : (matchedTopic.categoryLabel === 'Yerel Pazarlama & SEO' ? 'seo' : (matchedTopic.audience === 'esnaf' ? 'esnaf' : 'tuketici')),
    categoryLabel: matchedTopic.categoryLabel,
    readTime: '5 dk okuma',
    date: '2026-09-24',
    readCount: '6.4k',
    likePercentage: 98,
    city: matchedCity,
    district: matchedDistrict,
    sectorName: matchedSector.name,
    sectorIcon: matchedSector.icon,
    author: {
      name: `${matchedCity} Esnaf & Tüketici Heyeti`,
      role: `TamPazar ${matchedCity} Bölge Koordinatörlüğü`,
      avatar: matchedSector.icon
    },
    coverImage: coverImage,
    tags: [
      `#${slugify(matchedCity)}`,
      `#${slugify(matchedDistrict)}`,
      `#${slugify(matchedSector.name)}`,
      isMerchant ? '#komisyonsuz' : '#yerelesnaf',
      isMerchant ? '#byopos' : '#tamteklif'
    ],
    ctaType: isMerchant ? 'merchant' : 'consumer',
    checklist: isMerchant ? [
      `${matchedDistrict} bölgesinde %0 komisyonla kendi Sanal POS'unu kullanma`,
      'GİB UBL-TR 2.1 onaylı ücretsiz e-Arşiv ve e-Fatura kesme',
      'Mahalle içi anlık masaüstü sipariş zili ve 30 dk hızlı teslimat',
      'TamTeklif müşteri taleplerine doğrudan teklif verme imkanı'
    ] : [
      `${matchedCity} ${matchedDistrict} esnafından doğrudan raf fiyatıyla alışveriş`,
      'Aracı sitelerin %25 komisyon farkını ödemeden tasarruf etme',
      'TamTeklif ile 1 dakikada kapalı zarf usta fiyatı toplama',
      'Taze, yerel ve ambalajsız gramajlı sipariş güvencesi'
    ],
    faqs: faqs,
    content: {
      lead: lead,
      sections: [
        {
          heading: `1. ${matchedCity} ${matchedDistrict} Bölgesinde ${matchedSector.name} Sektörünün Dijital Dinamikleri`,
          paragraphs: [
            `${matchedCity} ili genelinde ${matchedDistrict} ilçesi, yerel ticaretin ve mahalle kültürünün en canlı hissedildiği merkezlerden biridir. Günümüzde tüketiciler ${matchedSector.name} arayışlarını internet üzerinden, haritalardan ve TamPazar Şehir Açık AVM'sinden gerçekleştirmektedir.`,
            isMerchant 
              ? `Geleneksel pazaryerleri ${matchedSector.name} esnafının kâr marjını yüksek komisyonlarla eritirken, TamPazar sabit aidatlı yapısıyla alın terinizi korur.`
              : `${matchedDistrict} sakinleri olarak zincir marketlerin fabrika çıkışlı ürünleri yerine doğrudan mahallenin zanaatkarı olan ${matchedSector.name} esnafını tercih ederek hem taze ürün alır hem de semt ekonomisini canlı tutarsınız.`
          ],
          highlightBox: {
            title: isMerchant ? `${matchedSector.name} Esnafı İçin Özel İpucu` : `Bilinçli Tüketici Tavsiyesi`,
            text: isMerchant ? matchedSector.tipsForMerchant : matchedSector.tipsForConsumer,
            badge: `${matchedSector.name} Uzmanlığı`
          }
        },
        {
          heading: `2. ${isMerchant ? 'Kendi Müşteri Portföyünüzü ve Dijital Veresiyenizi Büyütün' : 'TamTeklif ile Doğrudan En İyi Fiyata Ulaşın'}`,
          paragraphs: [
            isMerchant
              ? `Müşterileriniz ${matchedDistrict} sınırları içindeyken tek tıkla sipariş versin. Sipariş düştüğünde dükkandaki zilin çalmasıyla hazırlığınızı yapıp 30 dakikada teslim edin.`
              : `Acil bir ${matchedSector.name} ihtiyacınız olduğunda dükkan dükkan gezmek veya telefonla fiyat pazarlığı yapmak yerine TamPazar'da tek bir talep açarak ${matchedDistrict} esnaflarından gelen teklifleri karşılaştırabilirsiniz.`
          ],
          bulletPoints: isMerchant ? [
            'Banka anlaşmanızı kendiniz seçin, ödemeyi ertesi gün hesabınıza aktarın',
            'Sektöre özel dinamik tartı, randevu takvimi veya dosya yükleme desteği',
            'GİB onaylı e-fatura ile muhasebe masraflarını sıfırlayın'
          ] : [
            'Kapalı zarf usulüyle esnaflar birbirinin fiyatını görmez, en rekabetçi teklifi verir',
            'Gramajlı tartı ile israfı önleyin, tam ihtiyacınız kadar satın alın',
            'Doğrudan esnafın kendi Sanal POS\'u güvencesiyle ödeme yapın'
          ]
        },
        {
          heading: `3. Yerel Dayanışma ve Mahalle Çarpan Etkisi`,
          paragraphs: [
            `${matchedCity} genelinde harcanan her 100 TL mahalle içinde kaldığında ${matchedDistrict} sokakları daha aydınlık, güvenli ve ekonomik olarak güçlü kalır.`,
            `TamPazar, esnafın dükkanını koruyarak dijital çağın hız ve konforunu yerel samimiyetle buluşturur.`
          ]
        }
      ],
      conclusion: isMerchant
        ? `${matchedCity} ${matchedDistrict} bölgesindeki dükkanınızı bugün TamPazar'a taşıyın, komisyonsuz dijital ticaretin avantajını yaşayın.`
        : `${matchedCity} ${matchedDistrict} esnafından güvenle alışveriş yapın, komşunuza ve sofranıza gerçek kaliteyi getirin.`
    }
  };

  return generatedPost;
}

// Generate popular programmatic links for internal linking matrix & sitemap
export function getPopularProgrammaticCombinations(limit: number = 30): { title: string; slug: string; city: string; district: string; sector: string }[] {
  const list: { title: string; slug: string; city: string; district: string; sector: string }[] = [];

  for (const c of CITIES_DATA) {
    for (const d of c.districts.slice(0, 2)) {
      for (const s of SECTORS.slice(0, 3)) {
        for (const t of PROGRAMMATIC_TOPICS.slice(0, 2)) {
          const slug = buildProgrammaticSlug(c.city, d.name, s.id, t.id);
          const title = t.titlePattern
            .replace('{city}', c.city)
            .replace('{district}', d.name)
            .replace('{sector}', s.name);
          list.push({
            title,
            slug,
            city: c.city,
            district: d.name,
            sector: s.name
          });
          if (list.length >= limit) return list;
        }
      }
    }
  }

  return list;
}

// Interactive Season Calendar Data for interactive tools tab
export const SEASONAL_CALENDAR_DATA = [
  { month: 'Ocak', season: 'Kış', vegetables: ['Pırasa', 'Ispanak', 'Kereviz', 'Lahana', 'Havuç'], fruits: ['Portakal', 'Mandalina', 'Greyfurt', 'Elma', 'Nar'], fish: ['Hamsi', 'Mezgit', 'Kalkan', 'Lüfer'] },
  { month: 'Şubat', season: 'Kış', vegetables: ['Brokoli', 'Karnabahar', 'Brüksel Lahanası', 'Pazı'], fruits: ['Portakal', 'Elma', 'Ayva'], fish: ['Kalkan', 'Tekir', 'Hamsi', 'Mezgit'] },
  { month: 'Mart', season: 'İlkbahar', vegetables: ['Enginar', 'Bakla', 'Ispanak', 'Kuşkonmaz'], fruits: ['Limon', 'Elma', 'Muz'], fish: ['Kefal', 'Levrek', 'Mezgit'] },
  { month: 'Nisan', season: 'İlkbahar', vegetables: ['Enginar', 'Bezelye', 'Taze Sarımsak', 'Semizotu'], fruits: ['Çağla', 'Çilek', 'Can Erik'], fish: ['Kalkan', 'Mercan', 'Levrek'] },
  { month: 'Mayıs', season: 'İlkbahar', vegetables: ['Enginar', 'Bakla', 'Domates', 'Salatalık', 'Taze Fasulye'], fruits: ['Çilek', 'Erik', 'Dut', 'Kiraz'], fish: ['Barbun', 'İstavrit', 'Levrek'] },
  { month: 'Haziran', season: 'Yaz', vegetables: ['Biber', 'Patlıcan', 'Kabak', 'Taze Fasulye', 'Bamya'], fruits: ['Kiraz', 'Kayısı', 'Şeftali', 'Karpuz', 'Kavun'], fish: ['Sardalya', 'Orkinos', 'İstavrit'] },
  { month: 'Temmuz', season: 'Yaz', vegetables: ['Domates', 'Biber', 'Patlıcan', 'Mısır', 'Semizotu'], fruits: ['Karpuz', 'Kavun', 'Şeftali', 'Vişne', 'İncir'], fish: ['Sardalya', 'Çinekop'] },
  { month: 'Ağustos', season: 'Yaz', vegetables: ['Kırmızı Biber', 'Patlıcan', 'Domates', 'Bamya'], fruits: ['İncir', 'Üzüm', 'Karpuz', 'Mürdüm Eriği'], fish: ['Çingene Palamudu', 'Sardalya'] },
  { month: 'Eylül', season: 'Sonbahar', vegetables: ['Mantar', 'Taze Fasulye', 'Kabak', 'Barbunya'], fruits: ['Nar', 'Üzüm', 'İncir', 'Kavun'], fish: ['Palamut', 'Lüfer', 'Sardalya', 'Barbun'] },
  { month: 'Ekim', season: 'Sonbahar', vegetables: ['Pırasa', 'Karnabahar', 'Ispanak', 'Mantar'], fruits: ['Mandalina', 'Nar', 'Ayva', 'Hurma'], fish: ['Palamut', 'Lüfer', 'Tekir', 'İstavrit'] },
  { month: 'Kasım', season: 'Sonbahar', vegetables: ['Kereviz', 'Lahana', 'Brokoli', 'Pancar'], fruits: ['Portakal', 'Mandalina', 'Kivi', 'Nar'], fish: ['Hamsi', 'Uskumru', 'Torik', 'Lüfer'] },
  { month: 'Aralık', season: 'Kış', vegetables: ['Ispanak', 'Pırasa', 'Karnabahar', 'Kereviz'], fruits: ['Portakal', 'Mandalina', 'Greyfurt', 'Elma'], fish: ['Hamsi', 'Tekir', 'Palamut'] },
];
