import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Coins, 
  Trophy, 
  Tv, 
  Sparkles, 
  Gift, 
  Check, 
  X, 
  Play, 
  Flame,
  ShieldCheck
} from 'lucide-react';
import { sounds } from '../../services/soundEffects';

interface ShopModalProps {
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  gold: number;
  setGold: React.Dispatch<React.SetStateAction<number>>;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  coins,
  setCoins,
  gold,
  setGold,
}) => {
  // 7-day login streak claim state
  const [claimedDay, setClaimedDay] = useState<number>(1);
  const [hasClaimedToday, setHasClaimedToday] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const streakRewards = [
    { day: 1, coins: 20, gold: 0, label: 'روز ۱: آغاز اردو' },
    { day: 2, coins: 35, gold: 0, label: 'روز ۲: بسته تاکتیک' },
    { day: 3, coins: 50, gold: 0, label: 'روز ۳: بازبینی VAR' },
    { day: 4, coins: 75, gold: 0, label: 'روز ۴: تقویت روحیه' },
    { day: 5, coins: 100, gold: 1, label: 'روز ۵: شمش برنزی' },
    { day: 6, coins: 150, gold: 1, label: 'روز ۶: تمرین فینال' },
    { day: 7, coins: 500, gold: 5, label: 'روز ۷: جام طلایی اسطوره دایی' },
  ];

  const handleClaimDaily = (dayItem: typeof streakRewards[0]) => {
    if (hasClaimedToday) {
      sounds.playError();
      setNotification('پاداش امروز را قبلاً دریافت کرده‌اید! فردا دوباره سر بزنید.');
      setTimeout(() => setNotification(null), 2500);
      return;
    }

    sounds.playGoalRoar();
    sounds.playCoin();
    setCoins((c) => c + dayItem.coins);
    if (dayItem.gold > 0) setGold((g) => g + dayItem.gold);
    setHasClaimedToday(true);
    setNotification(`🎉 تبریک! ${dayItem.coins} سکه ${dayItem.gold ? `و ${dayItem.gold} شمش طلا` : ''} به حسابتان اضافه شد!`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleWatchAd = () => {
    sounds.playCoin();
    setCoins((c) => c + 25);
    setNotification('📺 تبلیغ ورزشی مشاهده شد! ۲۵ سکه جایزه گرفتی!');
    setTimeout(() => setNotification(null), 2500);
  };

  const handleBuyItem = (name: string, costCoins: number, rewardDescription: string) => {
    if (coins < costCoins) {
      sounds.playError();
      setNotification('موجودی سکه کافی نیست!');
      setTimeout(() => setNotification(null), 2000);
      return;
    }
    sounds.playCoin();
    setCoins((c) => c - costCoins);
    setNotification(`✅ خرید «${name}» با موفقیت انجام شد! ${rewardDescription}`);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 border border-amber-500/30 rounded-3xl p-6 shadow-xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>فروشگاه رسمی و مرکز جوایز</span>
            </span>
            <span className="text-xs text-slate-400">بسته‌های VAR، پوسته‌های توپ و پاداش وفاداری روزانه</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mb-1">
            تجهیز رختکن مربیگری با امکانات VIP
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            با جمع‌آوری سکه‌های پاس‌های طلایی و پیروزی در مسابقات، کمک‌داور ویدیویی بخرید و قفل توپ‌های افسانه‌ای را باز کنید.
          </p>
        </div>

        {/* Dynamic Alert Banner */}
        {notification && (
          <div className="w-full md:w-auto bg-emerald-600 border border-emerald-300 text-white px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-lg animate-bounce text-center">
            {notification}
          </div>
        )}
      </div>

      {/* 7-Day Daily Login Streak Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl mb-8">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-black text-white">
              چرخه پاداش وفاداری ۷ روزه (Daily Login Streak)
            </h3>
          </div>
          <span className="text-xs text-slate-400">هر روز سر بزنید تا جوایز بزرگ‌تر شوند!</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {streakRewards.map((item) => {
            const isToday = item.day === claimedDay;
            const isPast = item.day < claimedDay;

            return (
              <div
                key={item.day}
                onClick={() => isToday && handleClaimDaily(item)}
                className={`rounded-2xl p-3 border text-center transition-all flex flex-col justify-between ${
                  isToday
                    ? 'bg-gradient-to-b from-amber-950/90 to-slate-900 border-amber-500 shadow-lg shadow-amber-500/20 scale-105 cursor-pointer ring-2 ring-amber-400/40'
                    : isPast
                    ? 'bg-slate-900/40 border-slate-800 opacity-60'
                    : 'bg-slate-850/80 border-slate-800'
                }`}
              >
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">
                    روز {item.day.toLocaleString('fa-IR')}
                  </span>
                  <div className="text-2xl my-1">
                    {item.day === 7 ? '👑' : item.gold > 0 ? '🏆' : '🪙'}
                  </div>
                  <span className="text-xs font-black text-amber-300 block">
                    {item.coins.toLocaleString('fa-IR')} سکه
                  </span>
                  {item.gold > 0 && (
                    <span className="text-[10px] font-bold text-yellow-300 block">
                      +{item.gold.toLocaleString('fa-IR')} طلا
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  {isToday ? (
                    <button
                      disabled={hasClaimedToday}
                      className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black rounded-lg text-[10px] shadow"
                    >
                      {hasClaimedToday ? 'دریافت شد ✓' : 'دریافت جایزه!'}
                    </button>
                  ) : isPast ? (
                    <span className="text-[10px] text-emerald-400 font-bold">تکمیل شد</span>
                  ) : (
                    <span className="text-[10px] text-slate-500">قفل</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Free Ad Reward Box & Shop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AdMob / Tapsell Video Simulation */}
        <div className="bg-gradient-to-b from-slate-900 to-emerald-950 border border-emerald-500/40 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-4">
              <Play className="w-6 h-6 text-emerald-400 fill-emerald-400" />
            </div>
            <h4 className="text-base font-black text-white mb-1">
              تماشای ویدیوی تبلیغاتی رایگان
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              با مشاهده یک ویدیوی کوتاه حامی مالی ورزشی، ۲۵ سکه چرمی رایگان برای استفاده در VAR دریافت کنید.
            </p>
          </div>

          <button
            onClick={handleWatchAd}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
          >
            <span>مشاهده تبلیغ و دریافت ۲۵ سکه</span>
            <span>🪙</span>
          </button>
        </div>

        {/* VAR Hint Packs */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-4">
              <Tv className="w-6 h-6 text-amber-400" />
            </div>
            <h4 className="text-base font-black text-white mb-1">
              پک ۳ تایی کمک‌داور ویدیویی (VAR)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              آشکارسازی فوری ۳ حرف مجهول در مسابقات حساس و باس‌فایت‌های نفس‌گیر با ۲۰٪ تخفیف سکه‌ای.
            </p>
          </div>

          <button
            onClick={() => handleBuyItem('پک ۳ تایی VAR', 120, '۳ سهمیه VAR به حسابتان افزوده شد.')}
            className="w-full py-2.5 bg-slate-800 hover:bg-amber-600 text-slate-200 hover:text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <span>خرید با ۱۲۰ سکه</span>
            <span className="line-through text-slate-500 text-[10px]">۱۵۰</span>
          </button>
        </div>

        {/* Legendary Ball Skin */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center mb-4 text-2xl">
              ⚽
            </div>
            <h4 className="text-base font-black text-white mb-1">
              توپ طلایی پله (Pelé Golden Ball)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              پوسته لوکس چرمی با درزهای طلایی ناب؛ کسب ۵۰٪ سکه بیشتر در تمام پاس‌های طلایی داخل دروازه!
            </p>
          </div>

          <button
            onClick={() => handleBuyItem('توپ طلایی پله', 200, 'پوسته توپ طلایی فعال شد.')}
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
          >
            <span>فعال‌سازی با ۲۰۰ سکه</span>
          </button>
        </div>
      </div>
    </div>
  );
};
