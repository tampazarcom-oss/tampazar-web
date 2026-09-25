import React from 'react';
import { BlogPost } from '../../data/blogData';
import { BookOpen, Clock, ThumbsUp, Eye, Bookmark, Share2, ArrowRight } from 'lucide-react';

interface BlogCardProps {
  post: BlogPost;
  onSelectPost: (post: BlogPost) => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, onSelectPost, isSaved, onToggleSave }) => {
  return (
    <article
      onClick={() => onSelectPost(post)}
      className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 group flex flex-col cursor-pointer"
    >
      {/* Cover Image & Category badge */}
      <div className="h-48 overflow-hidden bg-slate-100 relative">
        <img
          src={post.coverImage || post.imageUrl || 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80'}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80';
          }}
        />
        
        {/* Save button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(post.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md border transition cursor-pointer ${
            isSaved
              ? 'bg-amber-500 border-amber-600 text-slate-950'
              : 'bg-slate-950/40 border-white/20 text-white hover:bg-slate-950/60'
          }`}
          title={isSaved ? "Kaydedilenlerden Çıkar" : "Kaydet"}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-slate-950' : ''}`} />
        </button>

        {/* Audience / Category Badge */}
        <div className="absolute bottom-3 left-3">
          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-2xs ${
            post.audience === 'esnaf'
              ? 'bg-amber-500 text-slate-950'
              : 'bg-emerald-600 text-white'
          }`}>
            {post.categoryLabel || post.category || 'Rehber'}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {post.readTime}
            </span>
            <span>·</span>
            <span className="text-emerald-700 font-bold">%{post.likePercentage || 98} Faydalı</span>
          </div>

          <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-emerald-800 transition leading-snug line-clamp-2">
            {post.title}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-normal">
            {post.excerpt || post.summary}
          </p>
        </div>

        {/* Author Footer & Read more button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {post.author.avatar.startsWith('http') ? (
              <img src={post.author.avatar} alt={post.author.name} className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <span className="text-base">{post.author.avatar}</span>
            )}
            <span className="text-[11px] font-bold text-slate-700 truncate max-w-[120px]">{post.author.name}</span>
          </div>

          <span className="text-xs font-black text-emerald-800 flex items-center gap-1 group-hover:translate-x-1 transition">
            Rehberi Oku <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
};
