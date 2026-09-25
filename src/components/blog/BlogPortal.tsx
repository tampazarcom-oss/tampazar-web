import React, { useState, useEffect } from 'react';
import { BlogPost, TargetAudience } from '../../types';
import { BLOG_POSTS, BLOG_CATEGORIES } from '../../data/blogData';
import { BlogHero } from './BlogHero';
import { BlogCard } from './BlogCard';
import { BlogDetail } from './BlogDetail';
import { EsnafProfitCalculator } from './EsnafProfitCalculator';
import { SeasonalCalendar } from './SeasonalCalendar';
import { DigitalReadinessQuiz } from './DigitalReadinessQuiz';
import { SavedArticlesDrawer } from './SavedArticlesDrawer';
import { Calculator, Calendar, Store, ShoppingBag, Sparkles, HelpCircle, Bookmark } from 'lucide-react';

export const BlogPortal: React.FC = () => {
  const [selectedAudience, setSelectedAudience] = useState<TargetAudience>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
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

  const filteredPosts = BLOG_POSTS.filter(post => {
    // Standardize audiences for check
    const matchesAudience =
      selectedAudience === 'all' ||
      selectedAudience === 'tools' ||
      post.audience === selectedAudience ||
      (selectedAudience === 'consumer' && post.audience === 'tuketici') ||
      (selectedAudience === 'esnaf' && post.audience === 'esnaf');

    const matchesCategory =
      selectedCategory === 'all' || 
      post.category === selectedCategory ||
      post.subCategory === selectedCategory;

    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.summary && post.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesAudience && matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header Bar */}
      <div className="bg-emerald-900 text-white py-3 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-emerald-950 font-bold px-2 py-0.5 rounded text-xs uppercase">
              TamPazar Rehber
            </span>
            <span>Esnaf & Tüketici Bilgi ve Dayanışma Portalı</span>
          </div>
          <button
            onClick={() => setIsSavedDrawerOpen(true)}
            className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-700 px-3 py-1.5 rounded-xl transition cursor-pointer"
          >
            <Bookmark className="w-4 h-4 text-emerald-300 fill-emerald-300" />
            <span>Kaydedilenler ({savedPostIds.length})</span>
          </button>
        </div>
      </div>

      <BlogHero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex bg-slate-200/80 p-1 rounded-xl gap-1">
            <button
              onClick={() => setSelectedAudience('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition cursor-pointer ${
                selectedAudience === 'all'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Tüm İçerikler
            </button>
            <button
              onClick={() => setSelectedAudience('esnaf')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition cursor-pointer ${
                selectedAudience === 'esnaf'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Store className="w-4 h-4" />
              Esnaf Rehberi
            </button>
            <button
              onClick={() => setSelectedAudience('consumer')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition cursor-pointer ${
                selectedAudience === 'consumer'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Tüketici Rehberi
            </button>
            <button
              onClick={() => setSelectedAudience('tools')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition cursor-pointer ${
                selectedAudience === 'tools'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calculator className="w-4 h-4" />
              İnteraktif Araçlar
            </button>
          </div>
        </div>

        {/* Content View */}
        {selectedAudience === 'tools' ? (
          <div className="mt-8 space-y-8">
            <div className="flex gap-2 border-b border-slate-200 pb-3">
              <button
                onClick={() => setActiveTool('calculator')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 cursor-pointer ${
                  activeTool === 'calculator'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Calculator className="w-4 h-4" /> Kârlılık Hesaplayıcı
              </button>
              <button
                onClick={() => setActiveTool('calendar')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 cursor-pointer ${
                  activeTool === 'calendar'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Calendar className="w-4 h-4" /> Mevsim Takvimi
              </button>
              <button
                onClick={() => setActiveTool('quiz')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 cursor-pointer ${
                  activeTool === 'quiz'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <HelpCircle className="w-4 h-4" /> Dijitalleşme Testi
              </button>
            </div>

            {activeTool === 'calculator' && <EsnafProfitCalculator />}
            {activeTool === 'calendar' && <SeasonalCalendar />}
            {activeTool === 'quiz' && <DigitalReadinessQuiz />}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => (
              <BlogCard
                key={post.id}
                post={post}
                onSelectPost={setSelectedPost}
                isSaved={savedPostIds.includes(post.id)}
                onToggleSave={toggleSavePost}
              />
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedPost && (
        <BlogDetail
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          isSaved={savedPostIds.includes(selectedPost.id)}
          onToggleSave={toggleSavePost}
        />
      )}

      {/* Saved Articles Drawer */}
      <SavedArticlesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedPosts={BLOG_POSTS.filter(p => savedPostIds.includes(p.id))}
        onSelectPost={post => {
          setSelectedPost(post);
          setIsSavedDrawerOpen(false);
        }}
        onRemoveSave={toggleSavePost}
      />
    </div>
  );
};
