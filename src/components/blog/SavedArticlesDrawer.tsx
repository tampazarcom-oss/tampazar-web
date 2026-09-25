import React from 'react';
import { BlogPost } from '../../data/blogData';
import { X, Bookmark, BookOpen, Trash2, ArrowRight } from 'lucide-react';

interface SavedArticlesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedPosts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
  onRemoveSave: (id: string) => void;
}

export const SavedArticlesDrawer: React.FC<SavedArticlesDrawerProps> = ({
  isOpen,
  onClose,
  savedPosts,
  onSelectPost,
  onRemoveSave
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs">
      {/* Background overlay click */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="bg-white w-full max-w-md h-full relative z-10 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h2 className="text-base font-black text-slate-900">Kaydedilen Rehberler</h2>
            <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-black">
              {savedPosts.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {savedPosts.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800">Henüz Kaydedilen Rehber Yok</p>
                <p className="text-xs text-slate-400 max-w-[240px] mx-auto leading-relaxed">
                  Beğendiğiniz esnaf veya tüketici rehberlerini kaydederek buraya ekleyebilirsiniz.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {savedPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/60 rounded-2xl transition flex items-start gap-3 relative group"
                >
                  {/* Miniature Cover */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                    <img
                      src={post.coverImage || post.imageUrl || 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=150&q=80'}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0 pr-6">
                    <span className="text-[9px] font-black uppercase text-slate-400">
                      {post.categoryLabel || post.category || 'Rehber'}
                    </span>
                    <h3 
                      onClick={() => onSelectPost(post)}
                      className="text-xs font-black text-slate-900 leading-snug line-clamp-2 hover:text-emerald-800 cursor-pointer transition pr-1"
                    >
                      {post.title}
                    </h3>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 font-bold">
                      <span>{post.readTime} okuma</span>
                    </p>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => onRemoveSave(post.id)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-red-600 transition cursor-pointer p-1 rounded-lg hover:bg-red-50"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info banner */}
        <div className="p-5 bg-slate-50 border-t border-slate-100">
          <div className="bg-emerald-800/10 border border-emerald-800/20 p-4 rounded-xl text-emerald-950 text-xs font-medium leading-relaxed flex items-start gap-2">
            <span className="text-base leading-none">💡</span>
            <span>
              Kaydettiğiniz tüm rehberler tarayıcınızın hafızasında tutulur. Böylece internetiniz olmasa bile bunlara kolayca ulaşabilirsiniz!
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
