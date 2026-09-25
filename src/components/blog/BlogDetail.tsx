import React, { useState } from 'react';
import { BlogPost } from '../../data/blogData';
import { X, Clock, Eye, ThumbsUp, Calendar, Bookmark, Share2, Sparkles, CheckCircle2 } from 'lucide-react';

interface BlogDetailProps {
  post: BlogPost;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

export const BlogDetail: React.FC<BlogDetailProps> = ({ post, onClose, isSaved, onToggleSave }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + `/blog/${post.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col relative animate-in fade-in zoom-in duration-200">
        
        {/* Header toolbar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
              post.audience === 'esnaf' ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white'
            }`}>
              {post.categoryLabel || post.category || 'Rehber'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(post.id)}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                isSaved ? 'bg-amber-500 border-amber-600 text-slate-950' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-slate-950' : ''}`} />
            </button>
            
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 transition cursor-pointer text-xs font-bold flex items-center gap-1"
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? "Kopyalandı!" : "Paylaş"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-8 space-y-6">
          <header className="space-y-4">
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-slate-500" /> {post.readTime} okuma
              </span>
              <span className="flex items-center gap-1 text-emerald-700">
                <ThumbsUp className="w-4 h-4 text-emerald-600" /> %{post.likePercentage || 98} Faydalı
              </span>
              <span>·</span>
              <span>{post.publishedAt || post.date || 'Eylül 2026'}</span>
            </div>

            {/* Author Profile */}
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              {post.author.avatar.startsWith('http') ? (
                <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs" />
              ) : (
                <span className="text-2xl p-1.5 bg-white rounded-xl border border-slate-200">{post.author.avatar}</span>
              )}
              <div>
                <p className="text-xs font-black text-slate-900">{post.author.name}</p>
                <p className="text-[10px] text-slate-500">{post.author.role}</p>
              </div>
            </div>
          </header>

          {/* Cover image */}
          <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xs max-h-80 bg-slate-100">
            <img 
              src={post.coverImage || post.imageUrl || 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80'} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Text Rendering */}
          <div className="prose prose-slate max-w-none space-y-4">
            {typeof post.content === 'string' ? (
              post.content.split('\n\n').map((paragraph, pIdx) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;
                if (trimmed.startsWith('###')) {
                  return (
                    <h3 key={pIdx} className="text-lg sm:text-xl font-black text-slate-900 tracking-tight pt-4 border-t border-slate-100 first:border-0 first:pt-0">
                      {trimmed.replace(/^###\s*/, '')}
                    </h3>
                  );
                }
                return (
                  <p key={pIdx} className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                    {trimmed}
                  </p>
                );
              })
            ) : (
              <>
                {/* Complex lead/sections if object */}
                {post.content.lead && (
                  <p className="text-sm sm:text-base text-slate-800 font-semibold leading-relaxed border-l-4 border-emerald-500 pl-4 py-2 bg-emerald-50/50 rounded-r-2xl">
                    {post.content.lead}
                  </p>
                )}

                {post.content.sections?.map((section, idx) => (
                  <section key={idx} className="space-y-3 pt-4 border-t border-slate-100 first:border-0 first:pt-0">
                    <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      {section.heading}
                    </h4>
                    {section.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                        {p}
                      </p>
                    ))}
                  </section>
                ))}
              </>
            )}
          </div>

          {/* Checklist Support */}
          {post.checklist && post.checklist.length > 0 && (
            <div className="bg-emerald-50/50 border border-emerald-200/60 p-5 rounded-2xl space-y-3">
              <h4 className="text-xs font-black uppercase text-emerald-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Kontrol Listesi & Önemli Adımlar
              </h4>
              <ul className="grid grid-cols-1 gap-2">
                {post.checklist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs font-bold text-slate-800 bg-white p-2.5 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-4 border-t border-slate-100">
            {post.tags.map((tag, idx) => (
              <span key={idx} className="text-[10px] font-black text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        </div>

        {/* Action Bottom */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center rounded-b-3xl">
          <p className="text-xs text-slate-500 mb-3 font-semibold">Bu rehberi faydalı buldunuz mu?</p>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => {
                alert("Geri bildiriminiz için teşekkür ederiz!");
              }}
              className="px-4 py-2 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-xs font-black text-slate-700 hover:text-emerald-900 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              👍 Faydalı Buldum
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-black transition cursor-pointer shadow-2xs"
            >
              Kapat
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
