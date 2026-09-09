import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  X, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  FileCode2
} from 'lucide-react';
import { MASTER_ENGINEERING_PROMPT } from '../data/advancedPrompt';
import { sounds } from '../services/soundEffects';

interface AdvancedPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdvancedPromptModal: React.FC<AdvancedPromptModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    sounds.playCoin();
    navigator.clipboard.writeText(MASTER_ENGINEERING_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    sounds.playCoin();
    const blob = new Blob([MASTER_ENGINEERING_PROMPT], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'FootballVazheh_Master_Prompt.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  const improvements = [
    {
      title: 'رفع ابهام در لوپ اصلی بازی (Core Loop)',
      desc: 'تفکیک دقیق کلمات اجباری (گل‌ها در جدول بالا) از کلمات اختیاری (پاس‌های طلایی در چهارچوب دروازه) با فرمول اقتصادی مشخص.',
    },
    {
      title: 'استانداردسازی دیتابیس کلمات (۳ تا ۸ حرف)',
      desc: 'حذف کاراکترهای اضافه و نیم‌فاصله‌های نامتعارف و سازمان‌دهی در ۹ دسته تاکتیکی بدون خطای اتصال لمسی.',
    },
    {
      title: 'بالانس فرمول‌های ریاضی و اقتصاد درون‌برنامه‌ای',
      desc: 'تعریف دقیق فرمول امتیازدهی با ضرایب سرعت، طول کلمه و سختی، همراه با قیمت‌گذاری متعادل سیستم کمک‌داور ویدئویی (VAR).',
    },
    {
      title: 'معماری فنی زیر ۱۰۰ مگابایت و امنیت بازی',
      desc: 'مشخص کردن فشرده‌سازی بافت‌های چمن (ASTC)، ضدتقلب ساعت دستگاه با NTP و ذخیره‌سازی آفلاین SQLite با انکریپشن.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500 text-slate-950 flex items-center gap-1 shadow">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                <span>پرامپت ارتقایافته صنعتی (Master Prompt)</span>
              </span>
              <span className="text-xs text-slate-400">مناسب ورودی مستقیم به LLMها یا تیم فنی استودیو</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-white">
              نسخه اصلاح‌شده و استاندارد مهندسی پرامپت بازی «فوتبال‌واژه»
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Improvements Checklist Overview */}
        <div className="bg-slate-950/70 border border-emerald-500/30 rounded-2xl p-4 mb-6">
          <span className="text-xs font-black text-emerald-400 block mb-2">
            اصلاحات کلیدی و ارتقای فنی انجام‌شده در این پرامپت:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {improvements.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">{item.title}:</span>
                  <span className="text-slate-400 leading-relaxed">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Code / Prompt Body */}
        <div className="relative flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-y-auto mb-6 text-xs sm:text-sm font-mono text-amber-200/90 leading-relaxed dir-ltr text-left">
          <pre className="whitespace-pre-wrap font-sans">
            {MASTER_ENGINEERING_PROMPT}
          </pre>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'متن پرامپت کپی شد!' : 'کپی پرامپت ارتقایافته'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-700 transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>دانلود فایل (.md)</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-medium rounded-xl text-xs sm:text-sm"
          >
            بستن پنجره
          </button>
        </div>
      </div>
    </div>
  );
};
