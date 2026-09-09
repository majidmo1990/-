import React from 'react';
import { 
  Trophy, 
  MapPin, 
  Shield, 
  Flame, 
  Sparkles, 
  ChevronRight, 
  Play, 
  CheckCircle2,
  Lock
} from 'lucide-react';
import { SEASONS_DATA } from '../../data/seasonsData';
import { PLAYABLE_LEVELS } from '../../data/levelsData';
import { Season } from '../../types';
import { sounds } from '../../services/soundEffects';

interface SeasonsViewProps {
  currentLevelId: number;
  completedLevels: number[];
  onSelectLevel: (levelId: number) => void;
  setActiveTab: (tab: string) => void;
}

export const SeasonsView: React.FC<SeasonsViewProps> = ({
  currentLevelId,
  completedLevels,
  onSelectLevel,
  setActiveTab,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 border border-emerald-500/30 rounded-3xl p-6 shadow-xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>نقشه راه ۱۰۰۰ مرحله در ۲۰ فصل</span>
            </span>
            <span className="text-xs text-slate-400">باس‌فایت ویژه در هر ۱۰ مرحله</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mb-1">
            از زمین‌های خاکی محلات تا فینال جام جهانی
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            مسیر پلکانی صعود با استادیوم‌های اختصاصی، جام‌های قهرمانی فصلی، و مسابقات نفس‌گیر حذفی با حریفان سرسخت.
          </p>
        </div>

        <div className="bg-slate-800/90 border border-slate-700/80 px-4 py-3 rounded-2xl text-center shadow">
          <span className="text-xs text-slate-400 block mb-0.5">مراحل تکمیل‌شده</span>
          <span className="text-lg font-black text-emerald-400">
            {completedLevels.length.toLocaleString('fa-IR')} از ۱۰۰۰ مرحله
          </span>
        </div>
      </div>

      {/* Seasons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SEASONS_DATA.map((season) => {
          // Check which playable levels belong to this season
          const seasonPlayableLevels = PLAYABLE_LEVELS.filter((l) => l.seasonId === season.id);
          const hasCurrentLevel = seasonPlayableLevels.some((l) => l.id === currentLevelId);
          const isUnlocked = season.id <= 2; // For demo, first 2 seasons are unlocked

          return (
            <div
              key={season.id}
              className={`rounded-3xl p-5 border transition-all duration-200 flex flex-col justify-between ${
                hasCurrentLevel
                  ? 'bg-gradient-to-b from-slate-900 to-emerald-950 border-emerald-500 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/30'
                  : isUnlocked
                  ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/60 border-slate-900 opacity-65'
              }`}
            >
              <div>
                {/* Season Number & Trophy */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-500/30 text-emerald-300">
                    فصل {season.id.toLocaleString('fa-IR')}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>مراحل {season.startLevel.toLocaleString('fa-IR')} تا {season.endLevel.toLocaleString('fa-IR')}</span>
                  </div>
                </div>

                <h3 className="text-base font-black text-white mb-1">
                  {season.name}
                </h3>
                <p className="text-xs text-slate-400 mb-3 line-clamp-1">
                  ورزشگاه: {season.stadiumName}
                </p>

                {/* Info tags */}
                <div className="space-y-1.5 mb-4 text-xs">
                  <div className="flex items-center justify-between text-slate-300 bg-slate-800/60 px-2.5 py-1 rounded-lg">
                    <span className="text-slate-400">درجه سختی:</span>
                    <span className="font-bold">{season.difficulty}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 bg-slate-800/60 px-2.5 py-1 rounded-lg">
                    <span className="text-slate-400">جام فصلی:</span>
                    <span className="font-bold text-amber-300 line-clamp-1">{season.trophyName}</span>
                  </div>
                </div>

                {/* Playable Levels in this season */}
                {seasonPlayableLevels.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 mb-3">
                    <span className="text-[11px] font-bold text-slate-400 block mb-2">
                      مراحل آماده بازی در این فصل:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {seasonPlayableLevels.map((lvl) => {
                        const isCompleted = completedLevels.includes(lvl.id);
                        const isCurrent = lvl.id === currentLevelId;

                        return (
                          <button
                            key={lvl.id}
                            onClick={() => {
                              sounds.playKick();
                              onSelectLevel(lvl.id);
                              setActiveTab('game');
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                              isCurrent
                                ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300'
                                : isCompleted
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            <span>مرحله {lvl.levelNumber.toLocaleString('fa-IR')}</span>
                            {lvl.isBoss && <Flame className="w-3 h-3 text-rose-400 fill-rose-400" />}
                            {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              {isUnlocked ? (
                <button
                  onClick={() => {
                    sounds.playKick();
                    if (seasonPlayableLevels.length > 0) {
                      onSelectLevel(seasonPlayableLevels[0].id);
                    }
                    setActiveTab('game');
                  }}
                  className="w-full py-2 bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>ورود به مسابقات این فصل</span>
                </button>
              ) : (
                <div className="w-full py-2 bg-slate-900 border border-slate-800 text-slate-500 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed">
                  <Lock className="w-3.5 h-3.5" />
                  <span>نیازمند اتمام فصل قبل</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
