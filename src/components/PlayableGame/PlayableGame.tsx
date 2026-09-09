import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  RotateCcw, 
  Tv, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Flame,
  Shield,
  HelpCircle,
  Timer
} from 'lucide-react';
import { GameLevel } from '../../types';
import { PLAYABLE_LEVELS } from '../../data/levelsData';
import { SEASONS_DATA } from '../../data/seasonsData';
import { GAME_CHARACTERS } from '../../data/charactersData';
import { sounds } from '../../services/soundEffects';

interface PlayableGameProps {
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  gold: number;
  setGold: React.Dispatch<React.SetStateAction<number>>;
  currentLevelId: number;
  setCurrentLevelId: (id: number) => void;
  completedLevels: number[];
  setCompletedLevels: React.Dispatch<React.SetStateAction<number[]>>;
}

export const PlayableGame: React.FC<PlayableGameProps> = ({
  coins,
  setCoins,
  setGold,
  currentLevelId,
  setCurrentLevelId,
  completedLevels,
  setCompletedLevels,
}) => {
  // Current active level data
  const currentLevel: GameLevel = 
    PLAYABLE_LEVELS.find((lvl) => lvl.id === currentLevelId) || PLAYABLE_LEVELS[0];

  const season = SEASONS_DATA.find((s) => s.id === currentLevel.seasonId) || SEASONS_DATA[0];

  // Letter arrangement state (can be shuffled)
  const [displayLetters, setDisplayLetters] = useState<string[]>([]);
  // Found mandatory words
  const [foundRequiredWords, setFoundRequiredWords] = useState<string[]>([]);
  // Found bonus words
  const [foundBonusWords, setFoundBonusWords] = useState<string[]>([]);
  // Currently selected sequence of letters
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  // Is dragging active
  const [isDragging, setIsDragging] = useState(false);
  // Feedback alert (yellow card, goal, duplicate)
  const [feedback, setFeedback] = useState<{ type: 'goal' | 'bonus' | 'error' | 'duplicate'; message: string } | null>(null);
  // Level completion state
  const [isLevelCompleted, setIsLevelCompleted] = useState(false);
  // Revealed hint letters by VAR: map of word -> set of revealed indices
  const [revealedHints, setRevealedHints] = useState<Record<string, number[]>>({});
  // Boss timer
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  // Ball positions in the wheel
  const wheelRef = useRef<HTMLDivElement>(null);
  const [ballCoordinates, setBallCoordinates] = useState<{ x: number; y: number }[]>([]);

  // Initialize level
  useEffect(() => {
    setDisplayLetters([...currentLevel.letters]);
    setFoundRequiredWords([]);
    setFoundBonusWords([]);
    setSelectedIndices([]);
    setIsLevelCompleted(false);
    setRevealedHints({});
    setFeedback(null);

    // If boss level, start countdown
    if (currentLevel.isBoss && currentLevel.timeLimit) {
      setTimeLeft(currentLevel.timeLimit);
    } else {
      setTimeLeft(null);
    }

    sounds.playWhistle(true);
  }, [currentLevel]);

  // Boss countdown timer tick
  useEffect(() => {
    if (timeLeft === null || isLevelCompleted) return;
    if (timeLeft <= 0) {
      sounds.playError();
      setFeedback({ type: 'error', message: 'وقت مسابقه تمام شد! داور سوت پایان را زد.' });
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isLevelCompleted]);

  // Update ball coordinates for connecting lines
  const updateCoordinates = useCallback(() => {
    if (!wheelRef.current) return;
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY) * 0.68;

    const count = displayLetters.length;
    const coords = displayLetters.map((_, i) => {
      // Offset so the first ball is at top (-90 deg)
      const angle = (i * 2 * Math.PI) / count - Math.PI / 2;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
    setBallCoordinates(coords);
  }, [displayLetters]);

  useEffect(() => {
    updateCoordinates();
    window.addEventListener('resize', updateCoordinates);
    return () => window.removeEventListener('resize', updateCoordinates);
  }, [updateCoordinates]);

  // Check if word is valid upon submit
  const submitWord = useCallback(() => {
    if (selectedIndices.length < 2) {
      setSelectedIndices([]);
      return;
    }

    const formedWord = selectedIndices.map((idx) => displayLetters[idx]).join('');
    setSelectedIndices([]);

    // Check if already found in required words
    if (foundRequiredWords.includes(formedWord)) {
      sounds.playError();
      setFeedback({ type: 'duplicate', message: `کلمه «${formedWord}» قبلاً به عنوان گل ثبت شده است!` });
      setTimeout(() => setFeedback(null), 2000);
      return;
    }

    // Check if already found in bonus words
    if (foundBonusWords.includes(formedWord)) {
      sounds.playError();
      setFeedback({ type: 'duplicate', message: `پاس طلایی «${formedWord}» قبلاً دریافت شده بود!` });
      setTimeout(() => setFeedback(null), 2000);
      return;
    }

    // Is it a required goal word?
    if (currentLevel.requiredWords.includes(formedWord)) {
      sounds.playKick();
      sounds.playGoalRoar();
      const updatedRequired = [...foundRequiredWords, formedWord];
      setFoundRequiredWords(updatedRequired);
      setFeedback({ type: 'goal', message: `⚽ گُوووول تماشایی! کلمه «${formedWord}» ثبت شد!` });

      // Check if all required words found
      if (updatedRequired.length === currentLevel.requiredWords.length) {
        setIsLevelCompleted(true);
        sounds.playWhistle(false);
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10B981', '#F59E0B', '#3B82F6', '#FFFFFF'],
        });

        // Award coins
        const reward = currentLevel.isBoss ? 25 : 10;
        setCoins((c) => c + reward);
        if (currentLevel.isBoss) {
          setGold((g) => g + 1);
        }

        if (!completedLevels.includes(currentLevel.id)) {
          setCompletedLevels((prev) => [...prev, currentLevel.id]);
        }
      }

      setTimeout(() => setFeedback(null), 2500);
      return;
    }

    // Is it an optional bonus word (Golden Pass)?
    if (currentLevel.bonusWords.includes(formedWord)) {
      sounds.playKick();
      sounds.playCoin();
      const nextBonus = [...foundBonusWords, formedWord];
      setFoundBonusWords(nextBonus);

      // Every 5 bonus words yields 1 coin
      const newTotal = nextBonus.length;
      if (newTotal % 5 === 0) {
        setCoins((c) => c + 1);
        setFeedback({ 
          type: 'bonus', 
          message: `🎯 پاس طلایی «${formedWord}»! پنج پاس تکمیل شد و ۱ سکه پاداش گرفتی!` 
        });
      } else {
        setFeedback({ 
          type: 'bonus', 
          message: `🎯 پاس طلایی «${formedWord}» وارد دروازه شد! (${newTotal % 5}/۵ تا سکه بعدی)` 
        });
      }

      setTimeout(() => setFeedback(null), 2500);
      return;
    }

    // Invalid word -> Yellow card error
    sounds.playError();
    setFeedback({ type: 'error', message: `خطای آفساید! کلمه «${formedWord}» در این مسابقه وجود ندارد.` });
    setTimeout(() => setFeedback(null), 2000);
  }, [selectedIndices, displayLetters, foundRequiredWords, foundBonusWords, currentLevel, completedLevels, setCoins, setGold, setCompletedLevels]);

  // Touch / Pointer interactions on the letter wheel
  const handlePointerDown = (index: number) => {
    setIsDragging(true);
    setSelectedIndices([index]);
    sounds.playKick();
  };

  const handlePointerEnter = (index: number) => {
    if (!isDragging) return;
    if (selectedIndices.includes(index)) {
      // If going back to penultimate, backtrack
      if (selectedIndices.length > 1 && selectedIndices[selectedIndices.length - 2] === index) {
        setSelectedIndices(selectedIndices.slice(0, -1));
        sounds.playKick();
      }
      return;
    }
    setSelectedIndices([...selectedIndices, index]);
    sounds.playKick();
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    submitWord();
  };

  // Click-to-type alternative for accessibility
  const handleBallClick = (index: number) => {
    if (isDragging) return;
    if (selectedIndices.includes(index)) {
      // Remove last if clicked again
      if (selectedIndices[selectedIndices.length - 1] === index) {
        setSelectedIndices(selectedIndices.slice(0, -1));
        sounds.playKick();
      }
    } else {
      setSelectedIndices([...selectedIndices, index]);
      sounds.playKick();
    }
  };

  // Shuffle letters (free)
  const handleShuffle = () => {
    sounds.playShuffle();
    const shuffled = [...displayLetters].sort(() => Math.random() - 0.5);
    setDisplayLetters(shuffled);
    setSelectedIndices([]);
  };

  // VAR Hint (50 coins)
  const handleVARHint = () => {
    if (coins < 50) {
      sounds.playError();
      setFeedback({ type: 'error', message: 'موجودی سکه کافی نیست! حداقل ۵۰ سکه برای کمک‌داور ویدیویی (VAR) لازم است.' });
      setTimeout(() => setFeedback(null), 2500);
      return;
    }

    // Find unrevealed word
    const unsolvedWords = currentLevel.requiredWords.filter((w) => !foundRequiredWords.includes(w));
    if (unsolvedWords.length === 0) return;

    // Pick first unsolved word
    const targetWord = unsolvedWords[0];
    const currentRevealed = revealedHints[targetWord] || [];

    // Find next unrevealed letter index
    let nextIdx = -1;
    for (let i = 0; i < targetWord.length; i++) {
      if (!currentRevealed.includes(i)) {
        nextIdx = i;
        break;
      }
    }

    if (nextIdx !== -1) {
      sounds.playVAR();
      setCoins((c) => c - 50);
      setRevealedHints((prev) => ({
        ...prev,
        [targetWord]: [...(prev[targetWord] || []), nextIdx],
      }));
      setFeedback({ 
        type: 'bonus', 
        message: `🔍 بررسی VAR انجام شد! یک حرف از کلمه «${targetWord.length}» حرفی آشکار شد.` 
      });
      setTimeout(() => setFeedback(null), 2500);
    }
  };

  // Navigate levels
  const handlePrevLevel = () => {
    const currentIndex = PLAYABLE_LEVELS.findIndex((l) => l.id === currentLevel.id);
    if (currentIndex > 0) {
      setCurrentLevelId(PLAYABLE_LEVELS[currentIndex - 1].id);
    }
  };

  const handleNextLevel = () => {
    const currentIndex = PLAYABLE_LEVELS.findIndex((l) => l.id === currentLevel.id);
    if (currentIndex < PLAYABLE_LEVELS.length - 1) {
      setCurrentLevelId(PLAYABLE_LEVELS[currentIndex + 1].id);
    }
  };

  // Current word preview
  const currentWordPreview = selectedIndices.map((idx) => displayLetters[idx]).join('');

  return (
    <div 
      className="max-w-4xl mx-auto px-3 sm:px-6 py-4 flex flex-col items-center select-none"
      onPointerUp={handlePointerUp}
    >
      {/* Top Match Bar / Level Selector */}
      <div className="w-full bg-slate-800/80 backdrop-blur rounded-2xl p-4 border border-slate-700/80 shadow-xl mb-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Level Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevLevel}
              disabled={currentLevel.id === 1}
              className="p-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-600 disabled:opacity-30 disabled:pointer-events-none text-white transition-colors"
              title="مرحله قبل"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold px-2.5 py-1 rounded-lg">
                مرحله {currentLevel.levelNumber.toLocaleString('fa-IR')}
              </span>
              {currentLevel.isBoss && (
                <span className="flex items-center gap-1 text-xs bg-rose-950/90 border border-rose-500/50 text-rose-300 font-bold px-2.5 py-1 rounded-lg animate-pulse">
                  <Flame className="w-3 h-3 fill-rose-400" />
                  <span>مسابقه ویژه (باس)</span>
                </span>
              )}
            </div>
            <button
              onClick={handleNextLevel}
              disabled={currentLevel.id === PLAYABLE_LEVELS[PLAYABLE_LEVELS.length - 1].id}
              className="p-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-600 disabled:opacity-30 disabled:pointer-events-none text-white transition-colors"
              title="مرحله بعد"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Season & Stadium Title */}
          <div className="text-center sm:text-right">
            <h2 className="text-sm sm:text-base font-black text-white flex items-center justify-center sm:justify-start gap-1.5">
              <span>{currentLevel.title}</span>
            </h2>
            <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>فصل {season.id.toLocaleString('fa-IR')}: {season.name}</span>
              <span className="text-slate-600">•</span>
              <span>{season.stadiumName}</span>
            </p>
          </div>

          {/* Boss Timer or Progress */}
          <div>
            {currentLevel.isBoss && timeLeft !== null ? (
              <div className="flex items-center gap-1.5 bg-rose-900/60 border border-rose-500/40 px-3 py-1 rounded-lg">
                <Timer className="w-4 h-4 text-rose-300 animate-spin" />
                <span className="text-xs font-bold text-rose-200">
                  {timeLeft.toLocaleString('fa-IR')} ثانیه
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-slate-700/60 px-3 py-1 rounded-lg border border-slate-600/60">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-bold text-slate-200">
                  گل‌ها: {foundRequiredWords.length.toLocaleString('fa-IR')} از {currentLevel.requiredWords.length.toLocaleString('fa-IR')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Target Mandatory Words (گل‌ها) & Goal Net for Golden Passes */}
      <div className="w-full bg-slate-950/70 border border-emerald-900/40 rounded-2xl p-4 shadow-inner mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <span>⚽</span>
            <span>گل‌های مسابقه (کلمات اجباری برای صعود):</span>
          </span>

          {/* Golden Passes Goal Net Box */}
          <div 
            className="flex items-center gap-2 bg-gradient-to-r from-amber-950/80 to-amber-900/60 border border-amber-500/40 px-3 py-1.5 rounded-xl shadow cursor-pointer hover:border-amber-400 transition-colors"
            title="پاس‌های طلایی به داخل دروازه هدایت می‌شوند. هر ۵ کلمه = ۱ سکه"
          >
            <span className="text-base">🥅</span>
            <div className="text-right">
              <span className="text-[10px] text-amber-300 block font-medium">پاس‌های طلایی</span>
              <span className="text-xs font-bold text-amber-200">
                {foundBonusWords.length.toLocaleString('fa-IR')} کلمه
                <span className="text-[10px] text-amber-400/80 mr-1">
                  ({(foundBonusWords.length % 5).toLocaleString('fa-IR')}/۵ به سکه)
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Word Boxes Grid */}
        <div className="flex flex-wrap items-center justify-center gap-3 py-2">
          {currentLevel.requiredWords.map((word) => {
            const isFound = foundRequiredWords.includes(word);
            const revealedLetters = revealedHints[word] || [];

            return (
              <div
                key={word}
                className={`flex items-center gap-1.5 p-2 rounded-xl border transition-all duration-300 shadow-md ${
                  isFound
                    ? 'bg-emerald-900/70 border-emerald-500 text-white scale-105 shadow-emerald-900/40'
                    : 'bg-slate-900/90 border-slate-700/80 text-slate-300'
                }`}
              >
                {word.split('').map((char, charIdx) => {
                  const isCharRevealed = isFound || revealedLetters.includes(charIdx);

                  return (
                    <div
                      key={charIdx}
                      className={`w-8 h-9 sm:w-9 sm:h-10 rounded-lg flex items-center justify-center font-black text-sm sm:text-base border transition-colors ${
                        isFound
                          ? 'bg-emerald-600 border-emerald-400 text-white shadow-inner'
                          : isCharRevealed
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 animate-bounce'
                          : 'bg-slate-800 border-slate-600/70 text-slate-500'
                      }`}
                    >
                      {isCharRevealed ? char : '?'}
                    </div>
                  );
                })}

                {isFound && (
                  <span className="text-emerald-400 text-xs mr-1 animate-pulse" title="گل شد!">
                    ⚽
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Stadium Football Pitch & Interactive Carousel */}
      <div className="relative w-full max-w-lg aspect-square bg-gradient-to-b from-emerald-800 via-emerald-700 to-emerald-900 rounded-3xl border-4 border-emerald-500/50 shadow-2xl overflow-hidden flex flex-col items-center justify-between p-4">
        {/* Pitch Lines (Tactical field graphic) */}
        <div className="absolute inset-0 pointer-events-none opacity-30 flex flex-col justify-between p-4">
          <div className="w-full h-1/4 border-2 border-white rounded-b-2xl border-t-0" />
          <div className="w-full border-t-2 border-white relative flex items-center justify-center">
            <div className="w-28 h-28 border-2 border-white rounded-full absolute -top-14" />
          </div>
          <div className="w-full h-1/4 border-2 border-white rounded-t-2xl border-b-0" />
        </div>

        {/* Selected Letters Forming Box (HUD Center) */}
        <div className="relative z-10 w-full flex flex-col items-center pt-2">
          <div className="h-12 min-w-44 px-4 rounded-xl bg-slate-950/85 backdrop-blur-md border-2 border-emerald-400/50 flex items-center justify-center shadow-lg">
            {currentWordPreview ? (
              <span className="text-xl sm:text-2xl font-black text-emerald-300 tracking-widest animate-pulse">
                {currentWordPreview}
              </span>
            ) : (
              <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>حروف روی توپ‌ها را با کشیدن یا ضربه متصل کن</span>
              </span>
            )}
          </div>

          {/* Dynamic Feedback Banner (Goal, Yellow Card, etc.) */}
          {feedback && (
            <div
              className={`mt-2 px-3 py-1.5 rounded-lg text-xs font-bold border shadow-lg transition-all animate-bounce ${
                feedback.type === 'goal'
                  ? 'bg-emerald-600 text-white border-emerald-300'
                  : feedback.type === 'bonus'
                  ? 'bg-amber-600 text-white border-amber-300'
                  : 'bg-rose-600 text-white border-rose-300'
              }`}
            >
              {feedback.message}
            </div>
          )}
        </div>

        {/* The Football Balls Carousel (Circular Area) */}
        <div 
          ref={wheelRef} 
          className="relative z-10 w-64 h-64 sm:w-72 sm:h-72 my-auto flex items-center justify-center touch-none"
        >
          {/* Connecting SVG lines between selected balls */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {selectedIndices.map((ballIdx, i) => {
              if (i === 0) return null;
              const prevIdx = selectedIndices[i - 1];
              const p1 = ballCoordinates[prevIdx];
              const p2 = ballCoordinates[ballIdx];
              if (!p1 || !p2) return null;

              return (
                <line
                  key={i}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="#FCD34D"
                  strokeWidth="6"
                  strokeLinecap="round"
                  className="animate-pulse drop-shadow-md"
                />
              );
            })}
          </svg>

          {/* Center Football Stadium Crest */}
          <div className="absolute w-16 h-16 rounded-full bg-emerald-950/70 border-2 border-emerald-400/40 flex items-center justify-center shadow-inner pointer-events-none">
            <span className="text-2xl opacity-60">⚽</span>
          </div>

          {/* Letter Balls */}
          {displayLetters.map((char, index) => {
            const isSelected = selectedIndices.includes(index);
            const coord = ballCoordinates[index];
            if (!coord) return null;

            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: `${coord.x}px`,
                  top: `${coord.y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                onPointerDown={(e) => {
                  e.preventDefault();
                  handlePointerDown(index);
                }}
                onPointerEnter={() => handlePointerEnter(index)}
                onClick={() => handleBallClick(index)}
                className={`w-13 h-13 sm:w-15 sm:h-15 rounded-full flex items-center justify-center font-black text-xl sm:text-2xl cursor-pointer transition-transform duration-150 select-none shadow-xl border-2 ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-white scale-115 ring-4 ring-amber-400/50 z-20'
                    : 'bg-gradient-to-b from-slate-100 to-slate-300 text-slate-900 border-slate-400 hover:scale-105 active:scale-95'
                }`}
              >
                {/* Soccer ball pattern styling */}
                <span className="relative z-10 drop-shadow-sm">{char}</span>
                <span className="absolute bottom-1 text-[8px] text-slate-400 opacity-70">⚽</span>
              </div>
            );
          })}
        </div>

        {/* Bottom Control Bar: Shuffle, Submit, VAR Hint */}
        <div className="relative z-10 w-full flex items-center justify-between gap-3 pt-2">
          {/* Shuffle (سوت تعویض) - رایگان */}
          <button
            onClick={handleShuffle}
            className="flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-600/70 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
            title="جابه‌جایی رایگان حروف روی چمن"
          >
            <RotateCcw className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">تعویض جای حروف</span>
            <span className="sm:hidden">بر زدن</span>
          </button>

          {/* Submit Word (شوت به دروازه) */}
          {selectedIndices.length >= 2 && (
            <button
              onClick={submitWord}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-emerald-500/40 transition-all hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>شوت نهایی!</span>
            </button>
          )}

          {/* VAR System Hint (۵۰ سکه) */}
          <button
            onClick={handleVARHint}
            className="flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 text-amber-300 border border-amber-500/40 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
            title="اتاق داور ویدیویی (VAR): نمایش یک حرف کلمه مجهول در ازای ۵۰ سکه"
          >
            <Tv className="w-4 h-4 text-amber-400" />
            <span>کمک VAR</span>
            <span className="bg-amber-950 text-amber-400 px-1.5 py-0.5 rounded text-[10px] border border-amber-500/30">
              ۵۰ سکه
            </span>
          </button>
        </div>
      </div>

      {/* Victory Celebration Modal */}
      {isLevelCompleted && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950 border-2 border-emerald-500 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center animate-in fade-in zoom-in duration-300">
            {/* Trophy Icon */}
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30 animate-bounce">
              <Trophy className="w-10 h-10 text-amber-400" />
            </div>

            <h3 className="text-2xl font-black text-white mb-1">
              پیروزی مقتدرانه در مسابقه!
            </h3>
            <p className="text-sm text-emerald-400 font-medium mb-4">
              سوت پایان دمیده شد و تیم به دور بعدی صعود کرد!
            </p>

            {/* Rewards Summary */}
            <div className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl p-4 mb-6 flex items-center justify-around">
              <div className="text-center">
                <span className="text-xs text-slate-400 block mb-1">سکه پاداش</span>
                <span className="text-lg font-black text-amber-400 flex items-center justify-center gap-1">
                  <span>+{currentLevel.isBoss ? '۲۵' : '۱۰'}</span>
                  <span>🪙</span>
                </span>
              </div>
              {currentLevel.isBoss && (
                <div className="text-center">
                  <span className="text-xs text-slate-400 block mb-1">شمش طلا</span>
                  <span className="text-lg font-black text-yellow-400 flex items-center justify-center gap-1">
                    <span>+۱</span>
                    <span>🏆</span>
                  </span>
                </div>
              )}
              <div className="text-center">
                <span className="text-xs text-slate-400 block mb-1">پاس‌های طلایی</span>
                <span className="text-lg font-black text-emerald-400">
                  {foundBonusWords.length.toLocaleString('fa-IR')}
                </span>
              </div>
            </div>

            {/* Coach Voice & Next Button */}
            <div className="w-full flex flex-col gap-3">
              <button
                onClick={() => {
                  handleNextLevel();
                  setIsLevelCompleted(false);
                }}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black rounded-xl shadow-lg shadow-emerald-500/30 transition-all hover:scale-102 active:scale-98"
              >
                مسابقه بعدی ({currentLevel.levelNumber + 1})
              </button>

              <button
                onClick={() => setIsLevelCompleted(false)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-xs"
              >
                مشاهده دوباره زمین بازی
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
