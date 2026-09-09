import React from 'react';
import { 
  Trophy, 
  BookOpen, 
  Gamepad2, 
  Database, 
  MapPin, 
  Users, 
  ShoppingBag, 
  Volume2, 
  VolumeX, 
  Sparkles,
  Coins
} from 'lucide-react';
import { sounds } from '../services/soundEffects';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  coins: number;
  gold: number;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  openPromptModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  coins,
  gold,
  soundEnabled,
  setSoundEnabled,
  openPromptModal,
}) => {
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setEnabled(next);
    if (next) sounds.playKick();
  };

  const navItems = [
    { id: 'game', label: 'بازی تعاملی', icon: Gamepad2, badge: 'پلی‌بل' },
    { id: 'gdd', label: 'مستند جامع GDD', icon: BookOpen, badge: '۱۲ بخش' },
    { id: 'database', label: 'دیتابیس ۱۰۰۰+ کلمه', icon: Database, badge: 'کامل' },
    { id: 'seasons', label: 'نقشه ۲۰ فصل', icon: MapPin, badge: '۱۰۰۰ مرحله' },
    { id: 'characters', label: 'شخصیت‌ها و لور', icon: Users, badge: '۵ کاراکتر' },
    { id: 'shop', label: 'فروشگاه و جوایز', icon: ShoppingBag, badge: 'سکه و VAR' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-emerald-900/40 shadow-xl">
      {/* Upper Status Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div 
          onClick={() => setActiveTab('game')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform border border-emerald-400/40">
            <span className="text-xl">⚽</span>
            <span className="absolute -bottom-1 -right-1 text-xs bg-amber-500 text-slate-950 font-black px-1 rounded-full shadow">
              فا
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-1.5">
                <span>فوتبال‌واژه</span>
                <span className="text-emerald-400 font-normal text-xs bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  طرح رسمی بازی
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              ترکیب جادویی آمیرزا با هیجان استادیوم و پاسکاری واژه‌ها
            </p>
          </div>
        </div>

        {/* Currency HUD & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Soft Currency: Coins */}
          <div 
            onClick={() => setActiveTab('shop')}
            className="flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-750 px-2.5 py-1 rounded-lg border border-amber-500/30 shadow-inner cursor-pointer transition-colors"
            title="سکه‌های چرمی"
          >
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-xs sm:text-sm font-bold text-amber-300">
              {coins.toLocaleString('fa-IR')}
            </span>
          </div>

          {/* Hard Currency: Gold */}
          <div 
            onClick={() => setActiveTab('shop')}
            className="flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-750 px-2.5 py-1 rounded-lg border border-yellow-500/30 shadow-inner cursor-pointer transition-colors"
            title="شمش‌های طلای قهرمانی"
          >
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-xs sm:text-sm font-bold text-yellow-300">
              {gold.toLocaleString('fa-IR')}
            </span>
          </div>

          {/* Upgraded Prompt Button */}
          <button
            onClick={openPromptModal}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
            title="مشاهده و کپی پرامپت ارتقایافته صنعتی"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span className="hidden md:inline">پرامپت ارتقایافته</span>
            <span className="md:hidden">پرامپت</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-1.5 rounded-lg border transition-colors ${
              soundEnabled
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/60'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
            }`}
            title={soundEnabled ? 'صدا روشن' : 'صدا خاموش'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Lower Navigation Tabs */}
      <nav className="border-t border-slate-800/80 bg-slate-950/40 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 flex items-center gap-1 py-1 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sounds.playKick();
                  setActiveTab(item.id);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-emerald-800 text-emerald-100'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
