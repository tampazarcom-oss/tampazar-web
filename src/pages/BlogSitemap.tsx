import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { staticBlogPosts, getPopularProgrammaticCombinations, ALL_81_CITIES, SECTORS, PROGRAMMATIC_TOPICS, buildProgrammaticSlug } from '../data/blogData';
import { FileCode2, ArrowLeft, Globe, ExternalLink, Copy, Check } from 'lucide-react';

export default function BlogSitemap() {
  const [copied, setCopied] = React.useState(false);

  const programmaticLinks = useMemo(() => {
    return getPopularProgrammaticCombinations(100);
  }, []);

  const allUrls = useMemo(() => {
    const staticUrls = staticBlogPosts.map(p => ({
      loc: `https://tampazar.com/blog/${p.slug}`,
      lastmod: p.date,
      changefreq: 'weekly',
      priority: p.featured ? '1.0' : '0.8',
      title: p.title
    }));

    const dynamicUrls = programmaticLinks.map(p => ({
      loc: `https://tampazar.com/blog/${p.slug}`,
      lastmod: '2026-09-24',
      changefreq: 'weekly',
      priority: '0.7',
      title: p.title
    }));

    return [
      { loc: 'https://tampazar.com/blog', lastmod: '2026-09-24', changefreq: 'daily', priority: '1.0', title: 'TamPazar Esnaf & Tüketici Rehberleri Ana Sayfası' },
      ...staticUrls,
      ...dynamicUrls
    ];
  }, [programmaticLinks]);

  const xmlContent = useMemo(() => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  }, [allUrls]);

  const handleCopyXml = () => {
    navigator.clipboard.writeText(xmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 sm:p-10 font-mono text-xs">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Link to="/blog" className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold">
              <ArrowLeft className="w-4 h-4" />
              Blog'a Dön
            </Link>
            <span className="text-slate-600">/</span>
            <div className="flex items-center gap-2 text-white font-bold">
              <FileCode2 className="w-4 h-4 text-emerald-400" />
              <span>sitemap-blog.xml (Google & LLM Bot Haritası)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyXml}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 font-sans text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'XML Kopyalandı' : 'XML Kopyala'}</span>
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2 font-sans">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <Globe className="w-4 h-4" />
            <span>Programatik SEO İndeksleme Haritası</span>
          </div>
          <p className="text-xs text-slate-400">
            Toplam <strong>{allUrls.length}</strong> adet dinamik ve statik rehber URL'i Google Search Console ve LLM arama ajanları (ChatGPT, Perplexity, Gemini) için yapılandırılmıştır.
          </p>
        </div>

        {/* XML Preview */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 overflow-x-auto max-h-[500px] scrollbar-thin">
          <pre className="text-emerald-400 text-[11px] leading-relaxed">
            {xmlContent}
          </pre>
        </div>

        {/* Human Readable Links List */}
        <div className="space-y-3 pt-4 border-t border-slate-800 font-sans">
          <h3 className="text-sm font-bold text-white">İndekslenen Örnek Programatik URL'ler:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {allUrls.slice(0, 20).map((u, i) => (
              <a
                key={i}
                href={u.loc.replace('https://tampazar.com', '')}
                className="p-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 rounded-lg text-slate-300 hover:text-amber-300 transition flex items-center justify-between group"
              >
                <span className="truncate pr-2">{u.title}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 shrink-0" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
