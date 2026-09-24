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
  faqs?: BlogFAQ[];
  content: {
    lead: string;
    sections: {
      heading: string;
      paragraphs: string[];
      highlightBox?: {
        title: string;
        text: string;
        badge?: string;
      };
      bulletPoints?: string[];
    }[];
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
 * 6 Temel Manuel Rehber Makalesi (Sabit Başvuru Rehberleri)
 */
export const staticBlogPosts: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'mahalle-esnafi-icin-dijital-pazara-adim-adim-gecis-rehberi',
    title: 'Mahalle Esnafı İçin Dijital Pazara Adım Adım Geçiş Rehberi',
    excerpt: 'Tek kuruş yüksek komisyon ödemeden ve kendi mahallenizde dijital sipariş ağı kurmanın 4 temel kuralı.',
    audience: 'esnaf',
    subCategory: 'esnaf',
    categoryLabel: 'Esnaf Rehberi',
    readTime: '6 dk okuma',
    date: '2026-09-24',
    readCount: '14.2k',
    likePercentage: 98,
    featured: true,
    author: {
      name: 'Selim Usta & Zanaatkar Heyeti',
      role: 'TamPazar Esnaf Topluluğu Sözcüsü',
      avatar: '👨‍💼'
    },
    coverImage: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80',
    tags: ['#komisyonsuz', '#yerelesnaf', '#byopos', '#e-fatura'],
    ctaType: 'merchant',
    checklist: [
      '%0 komisyon & esnafın kendi Sanal POS\'u ile anında tahsilat',
      'GİB e-Fatura ve otomatik kargo barkodu entegrasyonu',
      'Mahalle içi 30-45 dk hızlı teslimat & masaüstü esnaf zili',
      'Doğrudan müşteri sadakati ve dijital veresiye defteri'
    ],
    faqs: [
      {
        question: 'TamPazar\'da ürün satarken satış başı komisyon öder miyim?',
        answer: 'Hayır, TamPazar %0 komisyon mantığıyla çalışır. Esnaf yalnızca dilediği sabit aylık küçük aidatı öder ve satışlardan asla kesinti yapılmaz.'
      },
      {
        question: 'Ödemeler banka hesabıma ne zaman geçer?',
        answer: 'Kendi Sanal POS\'unuz (BYO POS) tanımlı olduğu için müşteri ödeme yaptığı an tahsilat doğrudan sizin banka hesabınıza geçer. Platformda bloke süresi yoktur.'
      },
      {
        question: 'E-Fatura entegrasyonu için ek ücret ödemem gerekir mi?',
        answer: 'Hayır, TamPazar GİB UBL-TR 2.1 onaylı e-Arşiv ve e-Fatura altyapısını işletim sisteminin dahili bir parçası olarak ücretsiz sunar.'
      }
    ],
    content: {
      lead: 'Geleneksel e-ticaret tekelleri, mahalle esnafının cirosundan %18 ile %30 arasında komisyon kesip parayı 30 gün bloke ederken, müşteriyi de dükkandan koparıyor. TamPazar ile fiziksel dükkanınızın bağımsız dijital şubesini nasıl kuracağınızı adım adım açıklıyoruz.',
      sections: [
        {
          heading: '1. Adım: Kendi Sanal POS\'unuzu Bağlayarak Komisyondan Kurtulun',
          paragraphs: [
            'TamPazar\'da satılan ürünlerden aracı komisyonu alınmaz. Müşteri kredi kartıyla ödeme yaptığı anda tahsilat esnafın kendi banka veya ödeme kuruluşu hesabına (PayTR, İyzico, Garanti BBVA vb.) anında yansır.',
            'Böylece ertesi gün nakit akışına kavuşur ve kâr marjınızı aracı platformlara kaptırmazsınız.'
          ],
          highlightBox: {
            title: 'BYO POS (Kendi POS\'unu Getir) Avantajı',
            text: 'Müşteriler dükkanınızdan güvenle çeker, hesap ekstresinde sizin mağazanızın adı yazar.',
            badge: '%0 Komisyon'
          }
        },
        {
          heading: '2. Adım: GİB UBL-TR 2.1 E-Fatura ve Barkodlu Kargo Çıkışı',
          paragraphs: [
            'Karmaşık ve pahalı muhasebe programlarına ihtiyacınız yok. Sipariş geldiğinde sistem otomatik olarak Gelir İdaresi Başkanlığı onaylı e-Arşiv veya ticari faturayı oluşturur.',
            'Anlaşmalı TamKargo entegrasyonu ile tek tıkla barkodlu sevk fişi basılır.'
          ],
          bulletPoints: [
            'Ücretsiz resmi GİB e-fatura/e-arşiv çıktısı',
            'Sektöre göre dinamik tartı, malzeme seçici veya dosya yükleme desteği',
            'Stok ve cari hesapların anlık senkronizasyonu'
          ]
        },
        {
          heading: '3. Adım: Mahalle İçi 30 Dakikada Sıcak Teslimat Zili',
          paragraphs: [
            'Fırın, manav, kasap veya restoranlar için sipariş düştüğünde sesli uyarı çalar. Sipariş hazırlanıp yerel moto-kurye ile dakikalar içinde müşteriye teslim edilir.'
          ]
        }
      ],
      conclusion: 'Kendi dükkanınızın patronu olarak dijital pazarda bağımsızca büyümek artık çok kolay.'
    }
  },
  {
    id: 'post-2',
    slug: 'mevsiminde-tuketim-takvimi-hangi-ayda-hangi-sebze-meyve-ve-balik-alinir',
    title: 'Mevsiminde Tüketim Takvimi: Hangi Ayda Hangi Sebze, Meyve ve Balık Alınır?',
    excerpt: 'Daha lezzetli, besleyici ve ekonomik alışverişin anahtarı. 12 aylık interaktif mevsim takvimi ve yerel manav rehberi.',
    audience: 'tuketici',
    subCategory: 'mevsimsel',
    categoryLabel: 'Mevsimsel & Sağlık',
    readTime: '5 dk okuma',
    date: '2026-09-22',
    readCount: '9.8k',
    likePercentage: 99,
    author: {
      name: 'Dr. Zeynep Kaya & Mahalle Manavları',
      role: 'Beslenme Uzmanı & Yerel Tarım Gönüllüsü',
      avatar: '👩‍🌾'
    },
    coverImage: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1200&q=80',
    tags: ['#mevsiminde', '#gıdaisrafı', '#yerelesnaf'],
    ctaType: 'consumer',
    checklist: [
      'Ay ay sebze, meyve ve deniz ürünleri takvimi',
      'Serada değil doğal güneş ışığında yetişen ürünlerin besin değeri',
      'Mevsiminde alarak %40 daha tasarruflu mutfak bütçesi',
      'Yerel manav ve balıkçılardan taze seçme tüyoları'
    ],
    faqs: [
      {
        question: 'Mevsiminde sebze ve meyve tüketmek bütçeye ne kadar katkı sağlar?',
        answer: 'Turfanda seralarda yetiştirilen ürünlere göre mevsiminde toplanan sebze ve meyveler ortalama %40-50 daha ucuzdur ve besin değerleri 3 kat daha yüksektir.'
      },
      {
        question: 'TamPazar\'da manav alışverişi yaparken gramaj seçebilir miyim?',
        answer: 'Evet! TamPazar Dinamik Ölçü Seçicisi sayesinde sabit paketler yerine tam olarak 250g, 500g veya 1.5 kg gibi istediğiniz hassas gramajda sipariş verebilirsiniz.'
      }
    ],
    content: {
      lead: 'Doğru mevsimde tüketilen meyve ve sebzeler hem 3 kat daha fazla vitamin içerir hem de turfanda ürünlere göre %40-50 daha ekonomiktir.',
      sections: [
        {
          heading: 'Sonbahar ve Kış Döneminde Ne Tüketilmeli?',
          paragraphs: [
            'Eylül, Ekim ve Kasım aylarında pırasa, karnabahar, brokoli, nar, mandalina, hamsi ve palamut en lezzetli ve taze dönemindedir.',
            'Yerel üreticiden ve manavdan doğrudan gramajlı tartı ile alışveriş yaparak ambalaj atığını ve gereksiz maliyetleri önleyebilirsiniz.'
          ],
          highlightBox: {
            title: 'Mevsiminde Almanın Bütçeye Etkisi',
            text: 'Domatesi kışın seradan fahiş fiyata almak yerine sonbaharda doğal konserve yapmak mutfak bütçesinde yıllık ortalama 8.000 TL tasarruf sağlar.',
            badge: '%40 Tasarruf'
          }
        },
        {
          heading: 'Balık Takvimi ve Taze Seçim İpuçları',
          paragraphs: [
            'Balığın gözlerinin parlak, solungaçlarının canlı kırmızı ve etinin sert olması tazeliğin temel göstergeleridir. Yerel balıkçı esnafınızdan temizlenmiş ve porsiyonlanmış olarak sipariş verebilirsiniz.'
          ],
          bulletPoints: [
            'Eylül-Ekim: Palamut, Lüfer, Sardalya',
            'Kasım-Aralık: Hamsi, Çipura, Levrek, Tekir',
            'Ocak-Şubat: Kalkan, Mezgit, Uskumru'
          ]
        }
      ],
      conclusion: 'Sağlığınızı korumak ve sofranıza gerçek lezzet getirmek için mevsiminde yerel esnaftan alışveriş yapın.'
    }
  },
  {
    id: 'post-3',
    slug: 'maliyet-komisyon-ve-karlilik-kucuk-isletmeler-icin-fiyatlandirma-matematigi',
    title: 'Maliyet, Komisyon ve Kârlılık: Küçük İşletmeler İçin Fiyatlandırma Matematiği',
    excerpt: 'Geleneksel pazaryerlerinin gizli maliyetlerini hesaplayın; sabit aidat ve %0 komisyonla net kârınızı 2 katına çıkarın.',
    audience: 'esnaf',
    subCategory: 'finans',
    categoryLabel: 'Finans & Maliyet',
    readTime: '7 dk okuma',
    date: '2026-09-20',
    readCount: '11.4k',
    likePercentage: 97,
    author: {
      name: 'Mali Müşavir Burak Yalçın',
      role: 'KOBİ Finans Danışmanı',
      avatar: '📊'
    },
    coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80',
    tags: ['#fiyatlandırma', '#komisyonsuz', '#e-fatura', '#byopos'],
    ctaType: 'merchant',
    checklist: [
      'Geleneksel pazaryeri komisyon + kargo + iade maliyet simülasyonu',
      'Doğrudan POS ile vade farksız anında nakit akışı',
      'Birim maliyet ve brüt kâr marjı formülasyonu',
      'TamPazar ile yıllık 100.000 TL+ komisyon tasarrufu hesabı'
    ],
    faqs: [
      {
        question: 'Pazaryeri komisyonu kârlılığı nasıl etkiler?',
        answer: 'Brüt kâr marjı %30 olan bir işletmede %22 komisyon kesildiğinde, cironun neredeyse tüm kârı platforma gider. Sıfır komisyon modelinde ise kârın %100\'ü işletmede kalır.'
      }
    ],
    content: {
      lead: 'E-ticarette 1.000 TL\'lik bir satış yaptığınızda elinize gerçekten ne kadar kalıyor? Komisyon, hizmet bedeli, erken ödeme kesintisi ve kargo farkları toplandığında cironun %30\'u eriyip gidiyor.',
      sections: [
        {
          heading: 'Komisyon Tuzağı: 100.000 TL Ciroda 25.000 TL Kayıp',
          paragraphs: [
            'Geleneksel platformlar %20-25 komisyon keser. 100.000 TL ciro yapan bir esnaf yılda 300.000 TL\'den fazla parayı komisyon olarak aracıya kaptırır.',
            'TamPazar\'ın sabit aidat modelinde ise cironuz ne kadar artarsa artsın komisyon ödemezsiniz.'
          ],
          highlightBox: {
            title: 'Sabit Aidat vs Komisyonlu Model',
            text: 'TamPazar\'da 500 TL sabit aylık aidatla dükkan işletirsiniz; geriye kalan tüm kazanç banka hesabınızda kalır.',
            badge: 'Net Kazanç'
          }
        },
        {
          heading: 'Fiyatlandırma Formülü: Doğru Marj Nasıl Hesaplanır?',
          paragraphs: [
            'Ürün Maliyeti + İşçilik/Operasyon + Kargo + Hedef Kâr = Satış Fiyatı. Araya aracı komisyonu girmediğinde hem fiyatınız piyasaya göre %15 daha ucuz olur hem de kârınız yükselir.'
          ]
        }
      ],
      conclusion: 'Alın terinizi komisyonculara değil, işletmenizin büyümesine ve müşterilerinize yatırın.'
    }
  },
  {
    id: 'post-4',
    slug: 'yerel-arama-ve-haritalarda-zirveye-cikma-esnafin-google-tampazar-rehberi',
    title: 'Yerel Arama ve Haritalarda Zirveye Çıkma: Esnafın Google & TamPazar Rehberi',
    excerpt: 'Yakınımdaki müşterilerin sizi Google Haritalar\'da ve TamPazar Şehir AVM\'sinde ilk sırada bulmasını sağlayacak SEO taktikleri.',
    audience: 'esnaf',
    subCategory: 'seo',
    categoryLabel: 'Yerel Pazarlama & SEO',
    readTime: '5 dk okuma',
    date: '2026-09-18',
    readCount: '8.3k',
    likePercentage: 96,
    author: {
      name: 'Kemal Arslan',
      role: 'Yerel SEO ve Dijital Büyüme Uzmanı',
      avatar: '🎯'
    },
    coverImage: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
    tags: ['#yerelesnaf', '#komisyonsuz', '#mahalledayanışması'],
    ctaType: 'merchant',
    checklist: [
      'Google İşletme Profili & TamPazar dükkan eşleşmesi',
      'Mahalle ve ilçe bazlı yerel anahtar kelime optimizasyonu',
      'Müşteri yorumları ve yıldız puanlarının sıralamaya etkisi',
      'Şehir Açık AVM vitrininde öne çıkma teknikleri'
    ],
    content: {
      lead: 'Müşteriler artık "en yakın terzi", "taze manav kadıköy", "oto ekspertiz ordu" gibi aramalarla alışveriş yapıyor. Yerel aramalarda ilk 3\'te yer almak cironuzu anında katlar.',
      sections: [
        {
          heading: 'Yerel Arama Varlığını Güçlendirme',
          paragraphs: [
            'TamPazar üzerindeki dükkan profiliniz, otomatik Schema.org LocalBusiness yapılandırılmış verisiyle Google tarafından anında indekslenir.',
            'Adres, telefon, çalışma saatleri ve fotoğraflarınız arama motorlarına eksiksiz iletilir.'
          ]
        }
      ],
      conclusion: 'Yerel görünürlüğünüzü artırarak mahallenizdeki her yeni müşterinin ilk tercihi olun.'
    }
  },
  {
    id: 'post-5',
    slug: 'gida-israfini-onleme-dogru-saklama-kosullari-yesillikler-peynirler-ve-ekmek',
    title: 'Gıda İsrafını Önleme & Doğru Saklama Koşulları: Yeşillikler, Peynirler ve Ekmek',
    excerpt: 'Alınan gıdaların çöpe gitmesini engelleyen profesyonel saklama tüyoları. Sıfır israfla aile bütçenizi koruyun.',
    audience: 'tuketici',
    subCategory: 'mevsimsel',
    categoryLabel: 'Mevsimsel & Sağlık',
    readTime: '4 dk okuma',
    date: '2026-09-15',
    readCount: '12.1k',
    likePercentage: 99,
    author: {
      name: 'Mutfak Şefi Emel Hanım',
      role: 'Sıfır Atık Mutfak Danışmanı',
      avatar: '🥗'
    },
    coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    tags: ['#gıdaisrafı', '#mevsiminde', '#yerelesnaf'],
    ctaType: 'consumer',
    checklist: [
      'Yeşillikleri 2 hafta taze tutan kağıt havlu ve cam kavanoz yöntemi',
      'Peynirlerin küflenmesini önleyen balmumu ve salamura teknikleri',
      'Bayat ekmekleri değerlendirme ve dondurucu kılavuzu',
      'Gramajlı tartı ile sadece ihtiyacın kadar satın alma avantajı'
    ],
    content: {
      lead: 'Türkiye\'de her yıl üretilen gıdanın yaklaşık %30\'u uygun saklanmadığı için çöpe gidiyor. Doğru saklama teknikleriyle hem doğayı koruyabilir hem de mutfak giderlerinizi azaltabilirsiniz.',
      sections: [
        {
          heading: 'Yeşillik ve Sebzeleri Taze Saklamanın Püf Noktaları',
          paragraphs: [
            'Maydanoz, dereotu ve naneyi yıkamadan, nemini alacak şekilde kağıt havluya sarıp hava almayan cam kapta buzdolabında sakladığınızda 15 güne kadar ilk günkü tazeliğini korur.',
            'TamPazar manavlarından demet yerine tam ihtiyacınız olan gramajda sipariş vermek ilk adımdır.'
          ]
        }
      ],
      conclusion: 'Bilinçli tüketim ve sıfır atık mutfak kültürü ile sürdürülebilir bir geleceğe adım atın.'
    }
  },
  {
    id: 'post-6',
    slug: 'yerel-esnaftan-alisveris-yapmanin-mahalle-ekonomisine-7-gorunmez-katkisi',
    title: 'Yerel Esnaftan Alışveriş Yapmanın Mahalle Ekonomisine 7 Görünmez Katkısı',
    excerpt: 'Harcadığınız her 100 TL mahallede kaldığında ne oluyor? Sosyal dayanışma, istihdam ve canlı sokakların formülü.',
    audience: 'tuketici',
    subCategory: 'dayanisma',
    categoryLabel: 'Yerel Ekonomi & Dayanışma',
    readTime: '5 dk okuma',
    date: '2026-09-12',
    readCount: '10.5k',
    likePercentage: 98,
    author: {
      name: 'Prof. Dr. Ahmet Yılmaz',
      role: 'Yerel Kalkınma ve Sosyoloji Araştırmacısı',
      avatar: '🏛️'
    },
    coverImage: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80',
    tags: ['#mahalledayanışması', '#yerelesnaf', '#komisyonsuz'],
    ctaType: 'consumer',
    checklist: [
      'Paranın mahalle içinde 3 ila 5 kat daha fazla dönmesi (Çarpan Etkisi)',
      'Yerel istihdamın ve genç çırak/usta yetişmesinin desteklenmesi',
      'Sokakların aydınlık, canlı ve güvenli kalması',
      'Aracı komisyonları olmadan samimi esnaf-komşu ilişkisi'
    ],
    content: {
      lead: 'Büyük uluslararası zincirlerden veya tekel platformlardan alışveriş yaptığınızda paranız şehir dışına ve vergi cennetlerine uçar. Mahalle esnafından alışveriş yaptığınızda ise para sokakta kalır, okul servisine, yerel fırına ve komşunuza can suyu olur.',
      sections: [
        {
          heading: 'Yerel Ekonomik Çarpan Etkisi Nedir?',
          paragraphs: [
            'Yerel bir dükkanda harcanan 100 TL\'nin 68 TL\'si o mahallede dönmeye devam ederken, zincir mağazalarda bu oran 14 TL\'ye kadar düşmektedir.',
            'TamPazar, esnafın dükkanını koruyarak bu dayanışmayı dijital çağın hız ve konforuyla buluşturur.'
          ]
        }
      ],
      conclusion: 'Mahallenizi, komşunuzu ve zanaatkarınızı yaşatmak için TamPazar açık AVM\'sinde yerel esnafı tercih edin.'
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
  { month: 'Şubat', season: 'Kış', vegetables: ['Brokoli', 'Karnabahar', 'Brüksel Lahanası', 'Pazı'], fruits: ['Portakal', 'Elma', 'Armut'], fish: ['Kalkan', 'Tekir', 'Hamsi', 'Mezgit'] },
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
