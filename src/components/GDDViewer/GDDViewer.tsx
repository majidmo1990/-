import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  FileText, 
  Layers, 
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { GDD_SECTIONS, GDDSection } from '../../data/gddSections';
import { sounds } from '../../services/soundEffects';

interface GDDViewerProps {
  openPromptModal: () => void;
}

export const GDDViewer: React.FC<GDDViewerProps> = ({ openPromptModal }) => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>('sec-1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const activeSection: GDDSection = 
    GDD_SECTIONS.find((s) => s.id === selectedSectionId) || GDD_SECTIONS[0];

  const filteredSections = GDD_SECTIONS.filter((sec) => 
    sec.title.includes(searchQuery) || 
    sec.summary.includes(searchQuery) ||
    sec.badge.includes(searchQuery)
  );

  const handleCopySection = () => {
    sounds.playCoin();
    navigator.clipboard.writeText(
      `# بخش ${activeSection.number}: ${activeSection.title}\n\n${activeSection.contentMarkdown}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFullGDD = () => {
    sounds.playCoin();
    const fullText = `# مستند جامع طراحی بازی «فوتبال‌واژه» (Game Design Document - GDD)\n\n` +
      `تهیه شده به صورت سند اجرایی و پروداکشن بازی‌های موبایلی سبک کلمه‌سازی\n\n` +
      GDD_SECTIONS.map((sec) => 
        `## بخش ${sec.number}: ${sec.title}\n` +
        `**دسته‌بندی:** ${sec.badge}\n` +
        `**خلاصه:** ${sec.summary}\n\n` +
        `${sec.contentMarkdown}\n\n---\n\n`
      ).join('');

    const blob = new Blob([fullText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'FootballVazheh_Full_GDD.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 border border-emerald-500/30 rounded-3xl p-6 shadow-xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              سند رسمی طراحی بازی (GDD)
            </span>
            <span className="text-xs text-slate-400">۱۲ فصل کامل با فرمول‌ها و استانداردهای صنعتی</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mb-1">
            مستند جامع فنی و اجرایی «فوتبال‌واژه»
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            کامل‌ترین مرجع طراحی بازی کلمه‌سازی فوتبالی بر پایه مکانیک‌های اثبات‌شده آمیرزا، سیستم‌های مانیتایزیشن، بالانس ریاضی مراحل و دیتابیس ۱۰۰۰ واژه.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            onClick={openPromptModal}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>پرامپت ارتقایافته</span>
          </button>

          <button
            onClick={handleDownloadFullGDD}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow hover:border-slate-500"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>دانلود کامل (Markdown)</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Explorer: Left side Sections, Right side Markdown reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar (4 cols on lg) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در فصول ۱۲ گانه مستند..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pr-9 pl-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Sections List */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2 max-h-[650px] overflow-y-auto space-y-1.5">
            {filteredSections.map((sec) => {
              const isSelected = sec.id === activeSection.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    sounds.playKick();
                    setSelectedSectionId(sec.id);
                  }}
                  className={`w-full text-right p-3 rounded-xl transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-emerald-600/90 text-white shadow-md border border-emerald-400/40'
                      : 'bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-transparent'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-black px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-emerald-800 text-white' : 'bg-slate-700 text-emerald-400'
                      }`}>
                        فصل {sec.number}
                      </span>
                      <span className="text-xs font-bold line-clamp-1">{sec.title}</span>
                    </div>
                    <p className={`text-[11px] line-clamp-1 ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                      {sec.summary}
                    </p>
                  </div>
                  <ChevronLeft className={`w-4 h-4 shrink-0 mt-1 transition-transform ${isSelected ? 'rotate-90 text-white' : 'text-slate-500'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Detail Content (8 cols on lg) */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col min-h-[600px]">
          {/* Section Header */}
          <div className="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  {activeSection.badge}
                </span>
                <span className="text-xs text-slate-400">بخش شماره {activeSection.number}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                {activeSection.title}
              </h3>
            </div>

            <button
              onClick={handleCopySection}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              title="کپی متن این بخش"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'کپی شد' : 'کپی بخش'}</span>
            </button>
          </div>

          {/* Section Body */}
          <div className="prose prose-invert prose-emerald max-w-none text-slate-200 text-sm leading-relaxed space-y-4">
            <div className="whitespace-pre-wrap font-['Vazirmatn',sans-serif]">
              {activeSection.contentMarkdown}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
