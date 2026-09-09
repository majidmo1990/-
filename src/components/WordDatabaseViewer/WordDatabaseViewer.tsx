import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Database, 
  Filter, 
  Check, 
  Sparkles, 
  Hash, 
  Volume2,
  Tag,
  Trophy
} from 'lucide-react';
import { WORDS_DATABASE, CATEGORY_LABELS } from '../../data/wordsDatabase';
import { WordCategory, WordItem } from '../../types';
import { sounds } from '../../services/soundEffects';

export const WordDatabaseViewer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedLength, setSelectedLength] = useState<number | 'all'>('all');

  // Filtered dataset
  const filteredWords = useMemo(() => {
    return WORDS_DATABASE.filter((item) => {
      const matchesSearch = 
        item.word.includes(searchQuery) || 
        item.clue.includes(searchQuery);

      const matchesCat = 
        selectedCategory === 'all' || item.category === selectedCategory;

      const matchesDiff = 
        selectedDifficulty === 'all' || item.difficulty === selectedDifficulty;

      const matchesLen = 
        selectedLength === 'all' || item.word.length === selectedLength;

      return matchesSearch && matchesCat && matchesDiff && matchesLen;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedLength]);

  const categories = Object.keys(CATEGORY_LABELS) as WordCategory[];

  const handleWordClick = (word: WordItem) => {
    sounds.playKick();
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
      {/* Header Banner & Stats */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 border border-emerald-500/30 rounded-3xl p-6 shadow-xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Database className="w-3.5 h-3.5" />
              <span>دیتابیس استاندارد واژگان فوتبال</span>
            </span>
            <span className="text-xs text-slate-400">فیلترشده بر اساس ۳ تا ۸ حرف بدون کاراکتر اضافه</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mb-1">
            بانک اطلاعاتی جامع ۱۰۰۰+ کلمه فوتبالی
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            مجموعه غنی از اساطیر فوتبال ایران و جهان، باشگاه‌ها، مربیان، تکتیک‌ها و اصطلاحات گزارشگری طبقه‌بندی‌شده برای موتور تولید مرحله بازی.
          </p>
        </div>

        {/* Mini stats counters */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="bg-slate-800/90 border border-slate-700/80 px-4 py-2 rounded-2xl text-center shadow">
            <span className="text-[11px] text-slate-400 block mb-0.5">کل کلمات ثبت‌شده</span>
            <span className="text-base sm:text-lg font-black text-emerald-400">
              {WORDS_DATABASE.length.toLocaleString('fa-IR')}
            </span>
          </div>
          <div className="bg-slate-800/90 border border-slate-700/80 px-4 py-2 rounded-2xl text-center shadow">
            <span className="text-[11px] text-slate-400 block mb-0.5">نتایج فیلتر جاری</span>
            <span className="text-base sm:text-lg font-black text-amber-400">
              {filteredWords.length.toLocaleString('fa-IR')}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg mb-6 space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute right-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی کلمه، بازیکن، مربی یا توضیحات (مثلاً: دایی، اینتر، سانتر)..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-10 pl-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            همه دسته‌ها ({WORDS_DATABASE.length.toLocaleString('fa-IR')})
          </button>
          {categories.map((catKey) => {
            const count = WORDS_DATABASE.filter((w) => w.category === catKey).length;
            const isSelected = selectedCategory === catKey;
            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <span>{CATEGORY_LABELS[catKey]?.icon} </span>
                <span>{CATEGORY_LABELS[catKey]?.label || catKey}</span>
                <span className="opacity-75"> ({count.toLocaleString('fa-IR')})</span>
              </button>
            );
          })}
        </div>

        {/* Secondary filters: Difficulty & Word Length */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          {/* Difficulty */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">درجه سختی:</span>
            {['all', 'آسان', 'متوسط', 'سخت'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {diff === 'all' ? 'همه' : diff}
              </button>
            ))}
          </div>

          {/* Letter length */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium">تعداد حروف:</span>
            <button
              onClick={() => setSelectedLength('all')}
              className={`px-2 py-1 rounded-lg text-xs font-bold ${
                selectedLength === 'all'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              همه
            </button>
            {[3, 4, 5, 6, 7, 8].map((len) => (
              <button
                key={len}
                onClick={() => setSelectedLength(len)}
                className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                  selectedLength === len
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {len.toLocaleString('fa-IR')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Words Grid Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredWords.map((item, index) => (
          <div
            key={index}
            onClick={() => handleWordClick(item)}
            className="group bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-3.5 transition-all shadow-md cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
                  {item.word}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/20">
                  {item.word.length} حرف
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {item.clue}
              </p>
            </div>

            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/80">
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Tag className="w-3 h-3 text-slate-600" />
                <span>{CATEGORY_LABELS[item.category]?.icon} {CATEGORY_LABELS[item.category]?.label || item.category}</span>
              </span>

              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                item.difficulty === 'آسان'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/20'
                  : item.difficulty === 'متوسط'
                  ? 'bg-amber-950 text-amber-300 border border-amber-500/20'
                  : 'bg-rose-950 text-rose-300 border border-rose-500/20'
              }`}>
                {item.difficulty}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredWords.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center my-6">
          <Database className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">
            کلمه‌ای مطابق با فیلترهای انتخابی یافت نشد!
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            لطفاً عبارت جستجو یا دسته‌بندی را تغییر دهید.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedDifficulty('all');
              setSelectedLength('all');
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
          >
            پاک کردن تمام فیلترها
          </button>
        </div>
      )}
    </div>
  );
};
