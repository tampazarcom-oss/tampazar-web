import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  BookOpen, Clock, Calendar, ArrowRight, ArrowLeft, Tag, 
  Sparkles, Store, ShoppingBag, CheckCircle2, Share2, 
  Search, Bookmark, ExternalLink, HelpCircle, ShieldCheck,
  Calculator, Apple, Fish, TrendingUp, DollarSign, Award,
  Users, Check, ChevronRight, ThumbsUp, Eye, Flame,
  MapPin, ChevronDown, ChevronUp, Compass, FileCode2, SlidersHorizontal
} from 'lucide-react';
import { 
  blogPosts, staticBlogPosts, BlogPost, SUB_CATEGORIES_LIST, POPULAR_TAGS, 
  BlogAudience, BlogSubCategory, SEASONAL_CALENDAR_DATA,
  getOrGenerateBlogPost, SECTORS, CITIES_DATA, PROGRAMMATIC_TOPICS,
  ALL_81_CITIES, buildProgrammaticSlug, getPopularProgrammaticCombinations,
  SectorItem, LocationCity, BLOG_CATEGORIES, BLOG_POSTS
} from '../data/blogData';
import { applyPageSEO, injectStructuredData } from '../utils/seo';

import { EsnafProfitCalculator } from '../components/blog/EsnafProfitCalculator';
import { SeasonalCalendar } from '../components/blog/SeasonalCalendar';
import { DigitalReadinessQuiz } from '../components/blog/DigitalReadinessQuiz';
import { SavedArticlesDrawer } from '../components/blog/SavedArticlesDrawer';

interface BlogPageProps {
  onBackToMarketplace?: () => void;
}

export default function Blog({ onBackToMarketplace }: BlogPageProps) {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();

  // Filter States
  const [selectedAudience, setSelectedAudience] = useState<BlogAudience>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<BlogSubCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Saved Blog States
  const [savedPostIds, setSavedPostIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('tampazar_saved_blogs');
    return saved ? JSON.parse(saved) : [];
  });
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState<boolean>(false);
  const [activeTool, setActiveTool] = useState<'calculator' | 'calendar' | 'quiz'>('calculator');

  useEffect(() => {
    localStorage.setItem('tampazar_saved_blogs', JSON.stringify(savedPostIds));
  }, [savedPostIds]);

  const toggleSavePost = (id: string) => {
    setSavedPostIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Accordion FAQ State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Smart Guide Finder States (Akıllı Rehber Bulucu)
  const [finderCity, setFinderCity] = useState<string>('Ordu');
  const [finderDistrict, setFinderDistrict] = useState<string>('Altınordu');
  const [finderSector, setFinderSector] = useState<string>('kasap');
  const [finderAudience, setFinderAudience] = useState<'esnaf' | 'tuketici'>('esnaf');
  const [finderTopic, setFinderTopic] = useState<string>('komisyonsuz-siparis');

  // Internal Linking Active City Filter
  const [directoryCity, setDirectoryCity] = useState<string>('Ordu');

  // Interactive Tools State
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(150000);
  const [selectedCalendarMonth, setSelectedCalendarMonth] = useState<string>('Eylül');

  // Find or generate post if slug exists
  const currentPost = useMemo(() => {
    if (!slug) return null;
    return getOrGenerateBlogPost(slug);
  }, [slug]);

  // Featured Hero Post
  const featuredPost = useMemo(() => {
    return staticBlogPosts.find(p => p.featured) || staticBlogPosts[0];
  }, []);

  // Filtered Posts for Grid
  const filteredPosts = useMemo(() => {
    return staticBlogPosts.filter(post => {
      // Audience Filter
      let matchesAudience = true;
      if (selectedAudience === 'esnaf') matchesAudience = post.audience === 'esnaf';
      if (selectedAudience === 'consumer' || selectedAudience === 'tuketici') matchesAudience = post.audience === 'consumer' || post.audience === 'tuketici';
      
      // Sub-category Filter
      const matchesSubCategory = selectedSubCategory === 'all' || post.subCategory === selectedSubCategory || post.category === selectedSubCategory;

      // Tag Filter
      const matchesTag = !selectedTag || post.tags.includes(selectedTag);

      // Search Query
      const q = searchQuery.toLowerCase().trim();
      const excerptText = post.excerpt || post.summary || '';
      const matchesSearch = !q || 
        post.title.toLowerCase().includes(q) ||
        excerptText.toLowerCase().includes(q) ||
        post.tags.some(t => t.toLowerCase().includes(q));

      return matchesAudience && matchesSubCategory && matchesTag && matchesSearch;
    });
  }, [selectedAudience, selectedSubCategory, selectedTag, searchQuery]);

  // Available districts for chosen finder city
  const availableDistricts = useMemo(() => {
    const cityObj = CITIES_DATA.find(c => c.city === finderCity);
    return cityObj ? cityObj.districts : [{ name: 'Merkez', slug: 'merkez' }];
  }, [finderCity]);

  // Sync finder district when city changes
  useEffect(() => {
    if (availableDistricts.length > 0) {
      setFinderDistrict(availableDistricts[0].name);
    }
  }, [finderCity, availableDistricts]);

  // Filtered topics based on finder audience
  const availableFinderTopics = useMemo(() => {
    return PROGRAMMATIC_TOPICS.filter(t => t.audience === finderAudience);
  }, [finderAudience]);

  // Sync finder topic when audience changes
  useEffect(() => {
    if (availableFinderTopics.length > 0) {
      setFinderTopic(availableFinderTopics[0].id);
    }
  }, [finderAudience, availableFinderTopics]);

  // Handle Smart Finder Navigation
  const handleGenerateSmartGuide = () => {
    const generatedSlug = buildProgrammaticSlug(finderCity, finderDistrict, finderSector, finderTopic);
    navigate(`/blog/${generatedSlug}`);
  };

  // Commission Savings Calculations
  const traditionalCommissionRate = 0.22; // 22%
  const traditionalCommissionAmount = monthlyRevenue * traditionalCommissionRate;
  const tampazarMonthlyFee = 500; // Flat monthly fee
  const monthlySavings = traditionalCommissionAmount - tampazarMonthlyFee;
  const yearlySavings = monthlySavings * 12;

  // Selected Month Calendar Info
  const activeMonthData = useMemo(() => {
    return SEASONAL_CALENDAR_DATA.find(m => m.month === selectedCalendarMonth) || SEASONAL_CALENDAR_DATA[8];
  }, [selectedCalendarMonth]);

  // Handle Share link copy
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // SEO & Structured Data Injection (Article + FAQ + Breadcrumbs)
  useEffect(() => {
    window.scrollTo(0, 0);

    if (slug && currentPost) {
      const cityText = currentPost.city ? ` (${currentPost.district ? currentPost.district + '/' : ''}${currentPost.city})` : '';
      const catLabel = currentPost.categoryLabel || currentPost.category || 'Rehber';
      const fullTitle = `${currentPost.title}${cityText} | TamPazar Rehber`;
      const excerpt = currentPost.excerpt || currentPost.summary || '';
      const cover = currentPost.coverImage || currentPost.imageUrl || 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80';
      const postDate = currentPost.publishedAt || currentPost.date || '2026-09-24';

      applyPageSEO({
        pathname: `/blog/${currentPost.slug}`,
        title: fullTitle,
        description: excerpt,
        ogType: 'article',
        ogImage: cover,
        keywords: currentPost.tags.map(t => t.replace('#', '')),
        article: {
          title: currentPost.title,
          slug: currentPost.slug,
          excerpt: excerpt,
          category: catLabel,
          coverImage: cover,
          datePublished: postDate,
          dateModified: '2026-09-24T03:30:00+03:00',
          authorName: currentPost.author.name,
          authorRole: currentPost.author.role,
          authorAvatar: currentPost.author.avatar,
          city: currentPost.city,
          district: currentPost.district,
          sectorName: currentPost.sectorName,
          audience: currentPost.audience === 'consumer' ? 'tuketici' : currentPost.audience,
          tags: currentPost.tags,
          faqs: currentPost.faqs,
          checklist: currentPost.checklist,
          wordCount: 1450
        },
        breadcrumbs: [
          { name: 'Ana Sayfa', url: '/' },
          { name: 'Rehber & Blog', url: '/blog' },
          { name: catLabel, url: '/blog' },
          { name: currentPost.title, url: `/blog/${currentPost.slug}` }
        ]
      });
    } else {
      applyPageSEO({
        pathname: '/blog',
        title: 'TamPazar Bilgi & Dayanışma Merkezi | Esnaf & Tüketici Rehberleri',
        description: 'Yerel ticaretin sürdürülebilir kârlılığı, %0 komisyon avantajları, GİB e-fatura kılavuzları, mevsiminde tüketim ve usta bulma rehberi.',
        keywords: ['esnaf rehberi', 'komisyonsuz pazar', 'tuketici rehberi', 'tamteklif', 'yerel ticaret', 'gib e-fatura']
      });
    }
  }, [slug, currentPost]);

  // =========================================================================
  // 1. DİNAMİK DETAY SAYFASI GÖRÜNÜMÜ (/blog/:slug)
  // =========================================================================
  if (slug && currentPost) {
    return (
      <main className="min-h-screen bg-slate-50/60 pb-24 font-sans selection:bg-amber-100 selection:text-amber-950">
        
        {/* Sticky Breadcrumb Bar */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-30 backdrop-blur-md bg-white/95 shadow-2xs">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 overflow-hidden">
              <Link to="/blog" className="hover:text-indigo-950 transition flex items-center gap-1 shrink-0 font-bold">
                <ArrowLeft className="w-3.5 h-3.5" />
                Rehber & Blog
              </Link>
              <span>/</span>
              <span className="shrink-0 text-slate-600 font-bold">{currentPost.categoryLabel}</span>
              {currentPost.city && (
                <>
                  <span>/</span>
                  <span className="shrink-0 text-amber-700 font-bold flex items-center gap-0.5">
                    <MapPin className="w-3 h-3" />
                    {currentPost.city}
                  </span>
                </>
              )}
              <span>/</span>
              <span className="text-slate-900 font-bold truncate">
                {currentPost.title}
              </span>
            </nav>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleShare}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 bg-white shadow-2xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>{copiedLink ? 'Kopyalandı ✓' : 'Paylaş'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Article Body Container */}
        <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
          
          {/* JSON-LD Schema for Google & AI Engine (LLM) Discovery */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@graph': [
                  {
                    '@type': 'Article',
                    '@id': `https://tampazar.com/blog/${currentPost.slug}#article`,
                    'mainEntityOfPage': {
                      '@type': 'WebPage',
                      '@id': `https://tampazar.com/blog/${currentPost.slug}`
                    },
                    'headline': currentPost.title,
                    'name': currentPost.title,
                    'description': currentPost.excerpt,
                    'image': [currentPost.coverImage],
                    'datePublished': currentPost.date ? `${currentPost.date}T08:00:00+03:00` : '2026-09-24T08:00:00+03:00',
                    'dateModified': '2026-09-24T03:30:00+03:00',
                    'author': {
                      '@type': 'Person',
                      'name': currentPost.author.name,
                      'jobTitle': currentPost.author.role,
                      'url': 'https://tampazar.com/blog'
                    },
                    'publisher': {
                      '@type': 'Organization',
                      'name': 'TamPazar',
                      'url': 'https://tampazar.com',
                      'logo': {
                        '@type': 'ImageObject',
                        'url': 'https://tampazar.com/tampazar-mark-transparent-1024.png',
                        'width': 512,
                        'height': 512
                      }
                    },
                    'articleSection': currentPost.categoryLabel,
                    'keywords': currentPost.tags.join(', '),
                    'inLanguage': 'tr-TR',
                    'wordCount': 1450,
                    ...(currentPost.city ? {
                      'contentLocation': {
                        '@type': 'AdministrativeArea',
                        'name': `${currentPost.district ? currentPost.district + ', ' : ''}${currentPost.city}`,
                        'addressCountry': 'TR'
                      }
                    } : {}),
                    ...(currentPost.sectorName ? {
                      'about': {
                        '@type': 'Thing',
                        'name': `${currentPost.sectorName} Esnafı ve Yerel Ticaret Modeli`
                      }
                    } : {}),
                    'speakable': {
                      '@type': 'SpeakableSpecification',
                      'cssSelector': ['h1', 'article p']
                    }
                  },
                  ...(currentPost.faqs && currentPost.faqs.length > 0 ? [{
                    '@type': 'FAQPage',
                    '@id': `https://tampazar.com/blog/${currentPost.slug}#faq`,
                    'mainEntity': currentPost.faqs.map(faq => ({
                      '@type': 'Question',
                      'name': faq.question,
                      'acceptedAnswer': {
                        '@type': 'Answer',
                        'text': faq.answer
                      }
                    }))
                  }] : []),
                  {
                    '@type': 'BreadcrumbList',
                    'itemListElement': [
                      { '@type': 'ListItem', 'position': 1, 'name': 'Ana Sayfa', 'item': 'https://tampazar.com/' },
                      { '@type': 'ListItem', 'position': 2, 'name': 'Rehber & Blog', 'item': 'https://tampazar.com/blog' },
                      { '@type': 'ListItem', 'position': 3, 'name': currentPost.categoryLabel, 'item': 'https://tampazar.com/blog' },
                      { '@type': 'ListItem', 'position': 4, 'name': currentPost.title, 'item': `https://tampazar.com/blog/${currentPost.slug}` }
                    ]
                  }
                ]
              })
            }}
          />

          {/* Header Metadata */}
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                currentPost.audience === 'esnaf' 
                  ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}>
                {currentPost.categoryLabel || currentPost.category || 'Rehber'}
              </span>

              {currentPost.city && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-600" />
                  {currentPost.city} / {currentPost.district}
                </span>
              )}

              {currentPost.sectorName && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-900 border border-indigo-200 flex items-center gap-1">
                  <span>{currentPost.sectorIcon}</span>
                  <span>{currentPost.sectorName}</span>
                </span>
              )}

              <span className="text-slate-400 text-xs flex items-center gap-1 font-semibold">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {currentPost.readTime}
              </span>
              <span className="text-slate-400 text-xs flex items-center gap-1 font-semibold">
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                {currentPost.readCount || '1.2k'} Okunma
              </span>
              <span className="text-slate-400 text-xs flex items-center gap-1 font-semibold">
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                %{currentPost.likePercentage || 98} Faydalı
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {currentPost.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
              {currentPost.excerpt || currentPost.summary}
            </p>

            {/* Author Profile Card */}
            <div className="flex items-center gap-3 pt-3 pb-4 border-b border-slate-200">
              {currentPost.author.avatar.startsWith('http') ? (
                <img src={currentPost.author.avatar} alt={currentPost.author.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs" />
              ) : (
                <span className="text-2xl p-2 bg-slate-100 rounded-2xl border border-slate-200">{currentPost.author.avatar}</span>
              )}
              <div>
                <p className="text-xs font-black text-slate-900">{currentPost.author.name}</p>
                <p className="text-[11px] text-slate-500">{currentPost.author.role} · {currentPost.publishedAt || currentPost.date}</p>
              </div>
            </div>
          </header>

          {/* Featured Cover Image */}
          <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 max-h-[420px] relative">
            <img 
              src={currentPost.coverImage || currentPost.imageUrl} 
              alt={currentPost.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80';
              }}
            />
            {currentPost.featured && (
              <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1.5 rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>⭐ Öne Çıkan Başvuru Rehberi</span>
              </div>
            )}
          </div>

          {/* CALLOUT BOX (Öne Çıkan Hap Bilgiler Kutusu) */}
          {currentPost.calloutBox && (
            <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-emerald-500/10 border-2 border-amber-300/80 p-5 sm:p-6 rounded-3xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 fill-amber-400" />
                  <span>{currentPost.calloutBox.title}</span>
                </h3>
                {currentPost.calloutBox.badge && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
                    {currentPost.calloutBox.badge}
                  </span>
                )}
              </div>
              <ul className="space-y-2 pt-1">
                {currentPost.calloutBox.items.map((item, cIdx) => (
                  <li key={cIdx} className="flex items-start gap-2 text-xs font-bold text-slate-800">
                    <span className="text-amber-600 font-extrabold text-sm leading-none mt-0.5">⚡</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Checklist Box (Bu rehberde ne öğreneceksiniz?) */}
          {currentPost.checklist && currentPost.checklist.length > 0 && (
            <div className="bg-emerald-50/80 border-2 border-emerald-200 p-5 sm:p-6 rounded-3xl space-y-3">
              <h3 className="text-sm font-black text-emerald-950 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Bu Rehberde Neler Öğreneceksiniz?</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {currentPost.checklist.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs font-bold text-emerald-900">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Article Content */}
          <div className="space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs">
            {typeof currentPost.content === 'string' ? (
              <div className="prose prose-slate max-w-none space-y-4">
                {currentPost.content.split('\n\n').map((paragraph, pIdx) => {
                  const trimmed = paragraph.trim();
                  if (!trimmed) return null;
                  if (trimmed.startsWith('###')) {
                    return (
                      <h3 key={pIdx} className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight pt-4 border-t border-slate-100 first:border-0 first:pt-0">
                        {trimmed.replace(/^###\s*/, '')}
                      </h3>
                    );
                  }
                  return (
                    <p key={pIdx} className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                      {trimmed}
                    </p>
                  );
                })}
              </div>
            ) : (
              <>
                {/* Lead */}
                {currentPost.content.lead && (
                  <p className="text-base sm:text-lg text-slate-800 font-semibold leading-relaxed border-l-4 border-amber-500 pl-4 py-2 bg-amber-50/50 rounded-r-2xl">
                    {currentPost.content.lead}
                  </p>
                )}

                {/* Sections */}
                {currentPost.content.sections?.map((section, idx) => (
                  <section key={idx} className="space-y-4 pt-6 border-t border-slate-100 first:border-0 first:pt-0">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {section.heading}
                    </h2>

                    {section.subheading && (
                      <h3 className="text-sm sm:text-base font-bold text-slate-700 font-sans tracking-wide">
                        {section.subheading}
                      </h3>
                    )}

                    {section.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                        {p}
                      </p>
                    ))}

                    {/* Inline Detail Image with Caption */}
                    {section.inlineImage && (
                      <figure className="my-6 rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                        <img 
                          src={section.inlineImage.url} 
                          alt={section.inlineImage.caption} 
                          className="w-full h-64 sm:h-80 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80';
                          }}
                        />
                        <figcaption className="p-3.5 text-center text-xs font-semibold text-slate-600 italic bg-slate-100/90 border-t border-slate-200 flex items-center justify-center gap-1.5">
                          <span>📸</span>
                          <span>{section.inlineImage.caption}</span>
                        </figcaption>
                      </figure>
                    )}

                    {/* Step Guide Items */}
                    {section.stepGuide && section.stepGuide.length > 0 && (
                      <div className="space-y-3 pt-2">
                        <h4 className="text-xs font-black uppercase text-indigo-900 tracking-wider">Adım Adım Uygulama Kılavuzu:</h4>
                        <div className="grid grid-cols-1 gap-3">
                          {section.stepGuide.map((step, sIdx) => (
                            <div key={sIdx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3 shadow-2xs">
                              <span className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                                {step.stepNumber}
                              </span>
                              <div className="space-y-1">
                                <h5 className="text-xs font-black text-slate-900">{step.title}</h5>
                                <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Highlight Box */}
                    {section.highlightBox && (
                      <div className="bg-indigo-50/80 border border-indigo-200 p-4 sm:p-5 rounded-2xl space-y-1.5 mt-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                            {section.highlightBox.title}
                          </h4>
                          {section.highlightBox.badge && (
                            <span className="text-[10px] bg-indigo-200 text-indigo-900 font-black px-2 py-0.5 rounded-md">
                              {section.highlightBox.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-indigo-900/90 leading-relaxed font-medium">
                          {section.highlightBox.text}
                        </p>
                      </div>
                    )}

                    {/* Bullet Points */}
                    {section.bulletPoints && section.bulletPoints.length > 0 && (
                      <ul className="space-y-2 pt-2">
                        {section.bulletPoints.map((item, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2.5 text-xs font-bold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}

                {/* Conclusion */}
                {currentPost.content.conclusion && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 text-sm font-semibold leading-relaxed">
                    {currentPost.content.conclusion}
                  </div>
                )}
              </>
            )}

            {/* COMPARISON TABLE (Karşılaştırma Tablosu) */}
            {currentPost.comparisonTable && (
              <div className="pt-6 border-t border-slate-200 space-y-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-amber-600" />
                  <span>{currentPost.comparisonTable.title}</span>
                </h3>
                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-white font-black text-[11px] uppercase tracking-wider">
                      <tr>
                        {currentPost.comparisonTable.headers.map((head, hIdx) => (
                          <th key={hIdx} className={`p-3.5 ${hIdx === 2 ? 'bg-amber-600 text-slate-950' : ''}`}>
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentPost.comparisonTable.rows.map((row, rIdx) => (
                        <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-slate-50/60' : 'bg-white'}>
                          <td className="p-3.5 font-bold text-slate-900 w-1/3 border-r border-slate-100">
                            {row[0]}
                          </td>
                          <td className="p-3.5 text-slate-600 w-1/3 border-r border-slate-100">
                            {row[1]}
                          </td>
                          <td className="p-3.5 font-extrabold text-emerald-900 bg-emerald-50/60 w-1/3">
                            {row[2]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SIKÇA SORULAN SORULAR (Accordion FAQ Section) */}
            {currentPost.faqs && currentPost.faqs.length > 0 && (
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-base font-black text-slate-900">
                    Sıkça Sorulan Sorular ({currentPost.faqs.length})
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {currentPost.faqs.map((faq, fIdx) => {
                    const isOpen = openFaqIndex === fIdx;
                    return (
                      <div
                        key={fIdx}
                        className={`rounded-2xl border transition-all ${
                          isOpen ? 'bg-indigo-50/40 border-indigo-200 shadow-2xs' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                          className="w-full text-left p-4 flex items-center justify-between gap-3 cursor-pointer"
                        >
                          <span className="text-xs font-black text-slate-900">
                            {faq.question}
                          </span>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-indigo-600 shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 pt-1 text-xs text-slate-700 leading-relaxed font-normal border-t border-indigo-100/60">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SOSYAL MEDYA PAYLAŞIM BUTONLARI (Social Share Bar) */}
            <div className="pt-6 border-t border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                Bu Rehberi Sosyal Medyada Paylaşın:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${currentPost.title} - ${window.location.href}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-2xs transition flex items-center gap-1.5"
                >
                  <span>💬 WhatsApp'ta Gönder</span>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(currentPost.title)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-2xs transition flex items-center gap-1.5"
                >
                  <span>𝕏 X'te Paylaş</span>
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-2xs transition flex items-center gap-1.5"
                >
                  <span>💼 LinkedIn</span>
                </a>
                <button
                  onClick={handleShare}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>🔗 {copiedLink ? 'Bağlantı Kopyalandı ✓' : 'Bağlantıyı Kopyala'}</span>
                </button>
              </div>
            </div>

            {/* Conclusion */}
            {typeof currentPost.content === 'object' && currentPost.content.conclusion && (
              <div className="pt-6 border-t border-slate-200 space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Sonuç & Değerlendirme</h3>
                <p className="text-sm text-slate-800 leading-relaxed font-medium italic bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  "{currentPost.content.conclusion}"
                </p>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
                <Tag className="w-3 h-3" /> Etiketler:
              </span>
              {currentPost.tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    navigate('/blog');
                  }}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* TAILORED CUSTOM CTA CARD (Dönüşüm Çağrı Kartı) */}
          {currentPost.customCta ? (
            <div className="bg-gradient-to-br from-[#0B132B] via-[#0F4C3A] to-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-emerald-800/60 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-[#F59E0B] font-bold text-xs">
                <Store className="w-4 h-4" />
                <span>{currentPost.customCta.badge || 'TAMPAYAR ÖZEL HİZMETİ'}</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {currentPost.customCta.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {currentPost.customCta.description}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => navigate(currentPost.customCta?.primaryButtonAction || '/yonetim')}
                  className="px-6 py-3 bg-[#F59E0B] hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
                >
                  <Store className="w-4 h-4" />
                  <span>{currentPost.customCta.primaryButtonText}</span>
                </button>
                {currentPost.customCta.secondaryButtonText && (
                  <button
                    onClick={() => navigate(currentPost.customCta?.secondaryButtonAction || '/')}
                    className="px-5 py-3 bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition cursor-pointer"
                  >
                    {currentPost.customCta.secondaryButtonText}
                  </button>
                )}
              </div>
            </div>
          ) : currentPost.ctaType === 'merchant' ? (
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Store className="w-4 h-4" />
                <span>{currentPost.city ? `${currentPost.city} ESNAF VE ÜRETİCİLERİ İÇİN ÇAĞRI` : 'ESNAF VE ÜRETİCİLER İÇİN ÇAĞRI'}</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Siz de Komisyonsuz Dükkanınızı Açın, Kazancınızı Koruyun
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  GİB UBL-TR 2.1 e-Fatura, BYO POS, TamKargo anlaşmaları ve kapalı devre B2B toptan ağı ile dükkanınızı hemen dijitalleştirin.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => navigate('/yonetim')}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
                >
                  <Store className="w-4 h-4" />
                  <span>Esnaf Yönetim Paneline Geçiş Yap</span>
                </button>
                <Link
                  to="/"
                  className="px-5 py-3 bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition"
                >
                  Vitrinleri İncele
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-emerald-900/50 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <ShoppingBag className="w-4 h-4" />
                <span>{currentPost.city ? `${currentPost.city} DOĞRUDAN ESNAF FİYATLARI` : 'DOĞRUDAN ESNAF FİYATLARIYLA ALIŞVERİŞ'}</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Çevrenizdeki Esnafları ve Türkiye'nin Zanaatkarlarını Keşfedin
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Aracı komisyonları olmadan, doğrudan esnafın raf fiyatıyla güvenle alışveriş yapın veya TamTeklif ile ustalardan teklif toplayın.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Pazaryeri Vitrinine Git</span>
                </button>
                <button
                  onClick={() => navigate('/sehir-avm')}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition cursor-pointer"
                >
                  Şehir Açık AVM'sini Gez
                </button>
              </div>
            </div>
          )}

          {/* İLGİLİ DİĞER REHBERLER (Recommended Related Guides) */}
          <div className="pt-8 border-t border-slate-200 space-y-4">
            <h3 className="text-base sm:text-lg font-black text-slate-900">İlgili Diğer Başvuru Rehberleri</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {staticBlogPosts.filter(p => p.id !== currentPost.id).slice(0, 3).map(other => (
                <Link
                  key={other.id}
                  to={`/blog/${other.slug}`}
                  className="p-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition space-y-3 block group shadow-2xs hover:shadow-md"
                >
                  <div className="h-32 rounded-xl overflow-hidden bg-slate-100">
                    <img 
                      src={other.coverImage} 
                      alt={other.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80';
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200">
                        {other.categoryLabel}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {other.readTime}
                      </span>
                    </div>
                    <h4 className="text-xs font-black text-slate-900 group-hover:text-amber-800 transition line-clamp-2 leading-snug">
                      {other.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {other.excerpt}
                    </p>
                    <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1 pt-1">
                      Rehberi Oku <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </article>
      </main>
    );
  }

  // =========================================================================
  // 2. ANA REHBER & BİLGİ MERKEZİ SAYFASI (/blog)
  // =========================================================================
  return (
    <main className="min-h-screen bg-[#FDFDFD] text-slate-800 pb-28 font-sans selection:bg-amber-100 selection:text-amber-950">
      
      {/* Header Bar */}
      <div className="bg-[#0B132B] text-white py-3 px-4 shadow-sm border-b border-[#111B38]">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-emerald-950 font-black px-2 py-0.5 rounded text-[10px] uppercase">
              TamPazar Rehber
            </span>
            <span className="font-medium text-slate-300">Esnaf & Tüketici Bilgi ve Dayanışma Portalı</span>
          </div>
          <button
            onClick={() => setIsSavedDrawerOpen(true)}
            className="flex items-center gap-1.5 bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 font-bold px-3 py-1.5 rounded-xl transition cursor-pointer shadow-2xs"
          >
            <Bookmark className="w-3.5 h-3.5 text-emerald-300 fill-emerald-300" />
            <span>Kaydedilenler ({savedPostIds.length})</span>
          </button>
        </div>
      </div>

      {/* 1. SAYFA TEPESİ & HERO BAŞLIK ALANI */}
      <section className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-4 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black tracking-wide shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>TamPazar Bilgi & Dayanışma Merkezi</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Esnaf & Tüketici Rehberleri
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
            Yerel ticaretin sürdürülebilir kârlılığı, mevsiminde bilinçli tüketim, sıfır gıda israfı ve dijitalleşme adımları.
          </p>

          {/* AKILLI REHBER BULUCU (Programmatic Smart Guide Generator Widget) */}
          <div className="max-w-4xl mx-auto pt-4">
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl text-left space-y-4">
              
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-amber-400 font-black text-xs tracking-wider uppercase">
                  <Compass className="w-4 h-4" />
                  <span>⚡ Akıllı Rehber Bulucu (81 İl & 12 Sektör Dinamik Motoru)</span>
                </div>
                <Link to="/sitemap-blog.xml" className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 font-mono transition">
                  <FileCode2 className="w-3.5 h-3.5" />
                  sitemap-blog.xml
                </Link>
              </div>

              {/* Form Alanları */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                
                {/* 1. Ben Kimim? */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 block">Profilim:</label>
                  <select
                    value={finderAudience}
                    onChange={(e) => setFinderAudience(e.target.value as 'esnaf' | 'tuketici')}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-bold focus:border-amber-400 focus:outline-hidden"
                  >
                    <option value="esnaf">👨‍💼 Esnafım / İşletme</option>
                    <option value="tuketici">🛒 Tüketiciyim / Müşteri</option>
                  </select>
                </div>

                {/* 2. İl Seçin */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 block">Şehir (İl):</label>
                  <select
                    value={finderCity}
                    onChange={(e) => setFinderCity(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-bold focus:border-amber-400 focus:outline-hidden"
                  >
                    {CITIES_DATA.map(c => (
                      <option key={c.city} value={c.city}>{c.city}</option>
                    ))}
                    {ALL_81_CITIES.filter(c => !CITIES_DATA.some(cd => cd.city === c)).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* 3. İlçe Seçin */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 block">İlçe / Bölge:</label>
                  <select
                    value={finderDistrict}
                    onChange={(e) => setFinderDistrict(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-bold focus:border-amber-400 focus:outline-hidden"
                  >
                    {availableDistricts.map(d => (
                      <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                {/* 4. Sektör Seçin */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 block">Sektör:</label>
                  <select
                    value={finderSector}
                    onChange={(e) => setFinderSector(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-bold focus:border-amber-400 focus:outline-hidden"
                  >
                    {SECTORS.map(s => (
                      <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
                    ))}
                  </select>
                </div>

                {/* 5. Aksiyon Butonu */}
                <div className="space-y-1 flex flex-col justify-end">
                  <button
                    onClick={handleGenerateSmartGuide}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2.5 px-3 rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Rehberi Aç</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* Arama Çubuğu & Hızlı Etiketler */}
          <div className="max-w-2xl mx-auto pt-2 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rehberlerde, ipuçlarında veya yasal konularda ara (örn: komisyon, mevsim, saklama)..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-600 focus:outline-hidden text-xs font-semibold shadow-inner transition"
              />
            </div>

            {/* Hızlı Etiketler */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                <Tag className="w-3 h-3" /> Hızlı Etiketler:
              </span>
              {POPULAR_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTag(selectedTag === tag ? null : tag);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    selectedTag === tag 
                      ? 'bg-indigo-900 text-white shadow-2xs' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(null)}
                  className="text-[11px] text-rose-600 font-bold underline ml-1 cursor-pointer"
                >
                  Etiketi Temizle (✕)
                </button>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 2. ÜST FİLTRELEME & SEKMELER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        
        {/* 4 Ana Sekme */}
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
            {[
              { id: 'all', label: `Tüm İçerikler (${staticBlogPosts.length})`, icon: BookOpen },
              { id: 'esnaf', label: '🏪 Esnaf Rehberi', icon: Store },
              { id: 'tuketici', label: '🛒 Tüketici Rehberi', icon: ShoppingBag },
              { id: 'tools', label: '⚡ İnteraktif Araçlar', icon: Calculator }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = selectedAudience === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedAudience(tab.id as BlogAudience)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    isActive 
                      ? 'bg-slate-900 text-white shadow-md' 
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <span className="text-xs text-slate-500 font-bold hidden md:inline">
            Açık Kaynak Esnaf & Tüketici Kütüphanesi
          </span>
        </div>

        {/* Alt Kategori Kartları (Yatay Pill Menü) */}
        {selectedAudience !== 'tools' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {SUB_CATEGORIES_LIST.map(cat => {
              const isCustomCat = BLOG_CATEGORIES.some(bc => bc.id === cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedSubCategory(cat.id as BlogSubCategory)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    selectedSubCategory === cat.id
                      ? 'bg-amber-500 text-slate-950 font-black shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {isCustomCat && <span className="text-amber-700">★</span>}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. İNTERAKTİF ARAÇLAR SEKMESİ (SEÇİLİ İSE) */}
        {/* ========================================================================= */}
        {selectedAudience === 'tools' ? (
          <div className="space-y-8 animate-fade-in">
            {/* Tool Selection Tabs */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-2 w-fit border border-slate-200">
              <button
                onClick={() => setActiveTool('calculator')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
                  activeTool === 'calculator'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/55'
                }`}
              >
                <Calculator className="w-4 h-4" />
                <span>Kârlılık Hesaplayıcı</span>
              </button>
              <button
                onClick={() => setActiveTool('calendar')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
                  activeTool === 'calendar'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/55'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Mevsim Takvimi</span>
              </button>
              <button
                onClick={() => setActiveTool('quiz')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer ${
                  activeTool === 'quiz'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/55'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Dijitalleşme Testi</span>
              </button>
            </div>

            {activeTool === 'calculator' && <EsnafProfitCalculator />}
            {activeTool === 'calendar' && <SeasonalCalendar />}
            {activeTool === 'quiz' && <DigitalReadinessQuiz />}
          </div>
        ) : (
          <>
            {/* ========================================================================= */}
            {/* 3. ÖNE ÇIKAN BÜYÜK VİTRİN KARTI (Featured Hero Card) */}
            {/* ========================================================================= */}
            {(!selectedTag && !searchQuery && selectedSubCategory === 'all') && (
              <div 
                onClick={() => navigate(`/blog/${featuredPost.slug}`)}
                className="bg-gradient-to-br from-[#0B132B] via-[#0F4C3A] to-[#0B132B] text-white rounded-3xl p-6 sm:p-10 border border-emerald-500/30 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center cursor-pointer group hover:border-[#10B981]/60 transition-all duration-300"
              >
                {/* Sol Taraf: Bilgiler & Kontrol Listesi */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-[#10B981] text-[#0B132B] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                      <Award className="w-3.5 h-3.5" />
                      <span>⭐ Öne Çıkan Başvuru Rehberi</span>
                    </span>
                    <span className="bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40 px-3 py-1 rounded-full text-xs font-black">
                      {featuredPost.categoryLabel || featuredPost.category || 'Rehber'}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white group-hover:text-amber-300 transition-colors leading-tight">
                    {featuredPost.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
                    {featuredPost.excerpt || featuredPost.summary}
                  </p>

                  {/* Kontrol Listesi */}
                  {featuredPost.checklist && (
                    <div className="bg-black/20 border border-white/10 p-4 rounded-2xl space-y-2 backdrop-blur-sm">
                      <span className="text-[11px] font-black text-emerald-300 uppercase tracking-wider block">
                        Bu Rehberde Ne Öğreneceksiniz?
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200 font-medium">
                        {featuredPost.checklist.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                            <span className="truncate">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Yazar, Tarih & Yeşil Aksiyon Butonu */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-3">
                      {featuredPost.author.avatar.startsWith('http') ? (
                        <img src={featuredPost.author.avatar} alt={featuredPost.author.name} className="w-10 h-10 rounded-full object-cover border border-white/20" />
                      ) : (
                        <span className="text-2xl p-1.5 bg-white/10 rounded-xl">{featuredPost.author.avatar}</span>
                      )}
                      <div>
                        <p className="text-xs font-bold text-white">{featuredPost.author.name}</p>
                        <p className="text-[10px] text-emerald-200">{featuredPost.readTime} · {featuredPost.readCount || '15.4k'} Okunma</p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/blog/${featuredPost.slug}`);
                      }}
                      className="px-6 py-3 bg-[#F59E0B] hover:bg-[#D97706] text-[#0B132B] font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer group-hover:translate-x-1"
                    >
                      <span>Rehberi Oku</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sağ Taraf: Süpermarket / Mahalle Reyonu Görseli & Rozetler */}
                <div className="lg:col-span-5 relative">
                  <div className="rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl h-64 sm:h-80 bg-slate-900">
                    <img 
                      src={featuredPost.coverImage || featuredPost.imageUrl} 
                      alt={featuredPost.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  {/* Floating Stat Badges */}
                  <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-md">
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>{featuredPost.readCount || '15.4k'} Okunma</span>
                  </div>

                  <div className="absolute bottom-4 left-4 bg-emerald-950/90 backdrop-blur-md text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-700 text-xs font-bold flex items-center gap-1.5 shadow-md">
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>%{featuredPost.likePercentage || 99} Faydalı Bulundu</span>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 4. REHBER VE MAKALE KARTLARI IZGARASI (Grid - 6 Temel Makale) */}
            {/* ========================================================================= */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900">
                  Temel Başvuru Rehberleri ({filteredPosts.length})
                </h3>
              </div>

              {filteredPosts.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                  <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-800">Aramanıza Uygun Rehber Bulunamadı</h3>
                  <p className="text-xs text-slate-500">Lütfen arama teriminizi değiştirin veya etiket filtresini sıfırlayın.</p>
                  <button
                    onClick={() => { setSelectedSubCategory('all'); setSelectedAudience('all'); setSelectedTag(null); setSearchQuery(''); }}
                    className="px-4 py-2 bg-indigo-900 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Filtreleri Sıfırla
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((post) => (
                    <article
                      key={post.id}
                      onClick={() => navigate(`/blog/${post.slug}`)}
                      className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xl hover:border-indigo-300 transition-all duration-300 group flex flex-col cursor-pointer"
                    >
                      {/* Görsel & Kategori Rozeti */}
                      <div className="h-48 overflow-hidden bg-slate-100 relative">
                        <img
                          src={post.coverImage || post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                        <div className="absolute top-3 left-3">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-2xs ${
                            post.audience === 'esnaf'
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-emerald-600 text-white'
                          }`}>
                            {post.categoryLabel || post.category || 'Rehber'}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSavePost(post.id);
                            }}
                            className={`p-1.5 rounded-lg backdrop-blur-xs border transition cursor-pointer ${
                              savedPostIds.includes(post.id)
                                ? 'bg-amber-500 border-amber-600 text-slate-950'
                                : 'bg-slate-950/60 border-white/10 text-white hover:bg-slate-950/80'
                            }`}
                            title={savedPostIds.includes(post.id) ? "Kaydedilenlerden Çıkar" : "Kaydet"}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${savedPostIds.includes(post.id) ? 'fill-slate-950' : ''}`} />
                          </button>
                          <div className="bg-slate-950/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1.5 rounded-lg flex items-center gap-1">
                            <Eye className="w-3 h-3 text-amber-400" />
                            <span>{post.readCount || '1.2k'}</span>
                          </div>
                        </div>
                      </div>

                      {/* İçerik */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {post.readTime}
                            </span>
                            <span>·</span>
                            <span className="text-emerald-700 font-bold">%{post.likePercentage || 98} Faydalı</span>
                          </div>

                          <h2 className="text-sm font-black text-slate-900 group-hover:text-indigo-900 transition leading-snug line-clamp-2">
                            {post.title}
                          </h2>

                          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-normal">
                            {post.excerpt || post.summary}
                          </p>
                        </div>

                        {/* Yazar & Oku Butonu */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {post.author.avatar.startsWith('http') ? (
                              <img src={post.author.avatar} alt={post.author.name} className="w-6 h-6 rounded-full object-cover" />
                            ) : (
                              <span className="text-base">{post.author.avatar}</span>
                            )}
                            <span className="text-[11px] font-bold text-slate-700 truncate max-w-[120px]">{post.author.name}</span>
                          </div>

                          <span className="text-xs font-black text-emerald-700 flex items-center gap-1 group-hover:translate-x-1 transition">
                            Rehberi Oku <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* 5. 81 İL & SEKTÖR DİZİNİ (İç Linkleme Ağı - Internal SEO Matrix) */}
            {/* ========================================================================= */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-2xs">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-black text-slate-900">
                    81 İl ve İlçelere Özel Esnaf & Tüketici Rehber Dizini
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 font-bold">
                  Programatik İç Linkleme Ağı
                </span>
              </div>

              {/* Şehir Seçici Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                {CITIES_DATA.map(c => (
                  <button
                    key={c.city}
                    onClick={() => setDirectoryCity(c.city)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      directoryCity === c.city
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    📍 {c.city}
                  </button>
                ))}
              </div>

              {/* Seçili İlin Sektör Bazlı Programatik Bağlantıları */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
                {SECTORS.map(sec => {
                  const targetDistrict = CITIES_DATA.find(c => c.city === directoryCity)?.districts[0]?.name || 'Merkez';
                  const slug = buildProgrammaticSlug(directoryCity, targetDistrict, sec.id, 'komisyonsuz-siparis');
                  return (
                    <Link
                      key={sec.id}
                      to={`/blog/${slug}`}
                      className="p-3 bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 rounded-2xl transition space-y-1 block group"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 group-hover:text-amber-900">
                        <span>{sec.icon}</span>
                        <span className="truncate">{directoryCity} {sec.name} Rehberi</span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">
                        {targetDistrict} komisyonsuz sipariş ve e-fatura
                      </p>
                    </Link>
                  );
                })}
              </div>

            </div>

          </>
        )}

      </section>

      {/* ========================================================================= */}
      {/* 6. ALT DÖNÜŞÜM ÇUBUĞU (Sticky / Bottom CTA Banner) */}
      {/* ========================================================================= */}
      <aside aria-label="Esnaf Destek ve Başvuru Çubuğu" className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B132B]/95 backdrop-blur-md border-t border-[#111B38] text-white py-3.5 px-4 sm:px-6 shadow-2xl">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Sol Taraf: Açıklama */}
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-9 h-9 rounded-xl bg-[#F59E0B] text-[#0B132B] flex items-center justify-center font-black shrink-0 hidden sm:flex">
              <Zap className="w-5 h-5 fill-[#0B132B]" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/30">
                  ⚡ DAHİLİ ESNAF DESTEK ARAÇLARI
                </span>
                <span className="text-xs font-bold text-slate-200 hidden md:inline">
                  Kendi Verilerinizle Kârınızı ve Mevsim Takvimini Test Edin
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80 hidden sm:block">
                %0 komisyonlu sabit aidat modeliyle yılda ortalama 100.000 TL+ komisyon tasarrufu sağlayın.
              </p>
            </div>
          </div>

          {/* Sağ Taraf: İki Buton */}
          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                setSelectedAudience('tools');
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-[#F59E0B] hover:bg-[#D97706] text-[#0B132B] font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>İnteraktif Araçları Aç</span>
            </button>

            <button
              onClick={() => navigate('/yonetim')}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-[#111B38] hover:bg-[#0F4C3A] text-white font-bold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span>Esnaf Başvurusu Yap</span>
            </button>
          </div>

        </div>
      </aside>

      {/* Saved Articles Drawer */}
      <SavedArticlesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedPosts={staticBlogPosts.filter(p => savedPostIds.includes(p.id))}
        onSelectPost={post => {
          navigate(`/blog/${post.slug}`);
          setIsSavedDrawerOpen(false);
        }}
        onRemoveSave={toggleSavePost}
      />

    </main>
  );
}

function Zap(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      width="1em" 
      height="1em" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
