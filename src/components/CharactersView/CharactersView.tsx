import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  MessageSquare, 
  Volume2, 
  Shield, 
  Award, 
  Flame,
  Check
} from 'lucide-react';
import { GAME_CHARACTERS, GUEST_MANAGERS } from '../../data/charactersData';
import { Character } from '../../types';
import { sounds } from '../../services/soundEffects';

export const CharactersView: React.FC = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(GAME_CHARACTERS[0]);
  const [activeDialogueKey, setActiveDialogueKey] = useState<'intro' | 'midway' | 'victory' | 'defeat'>('intro');

  const handlePlayDialogue = (key: 'intro' | 'midway' | 'victory' | 'defeat') => {
    setActiveDialogueKey(key);
    if (key === 'victory') {
      sounds.playGoalRoar();
    } else if (key === 'defeat') {
      sounds.playError();
    } else {
      sounds.playKick();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 border border-emerald-500/30 rounded-3xl p-6 shadow-xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>دنیای داستانی و کاراکترها</span>
            </span>
            <span className="text-xs text-slate-400">۵ شخصیت اصلی با صدا، بیوگرافی و اثر مکانیکی</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mb-1">
            شخصیت‌های ماندگار مستطیل سبز «فوتبال‌واژه»
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            از نیمکت مربیگری آریا و شوخی‌های آقا بهروز تا جنگ روانی سهراب خان، سوت‌های داوود کارت‌به‌دست و طبل‌های نوید پرشور.
          </p>
        </div>
      </div>

      {/* Main Interactive Character Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Character Picker (4 cols on lg) */}
        <div className="lg:col-span-4 flex flex-col gap-2.5">
          <span className="text-xs font-bold text-slate-400 px-1">انتخاب شخصیت:</span>
          {GAME_CHARACTERS.map((char) => {
            const isSelected = char.id === selectedCharacter.id;
            return (
              <button
                key={char.id}
                onClick={() => {
                  sounds.playKick();
                  setSelectedCharacter(char);
                  setActiveDialogueKey('intro');
                }}
                className={`p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-slate-850 border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500'
                    : 'bg-slate-900/90 border-slate-800 hover:bg-slate-800/80 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shadow-inner">
                    {char.avatarEmoji}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">{char.name}</h4>
                    <p className="text-xs text-slate-400">{char.role}</p>
                  </div>
                </div>

                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: char.color }}
                  title="رنگ شناسه"
                />
              </button>
            );
          })}
        </div>

        {/* Character Detail Showcase & Interactive Voice Bubbles (8 cols on lg) */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            {/* Top Profile Header */}
            <div className="flex items-start justify-between gap-4 pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-emerald-400/60 flex items-center justify-center text-3xl shadow-lg">
                  {selectedCharacter.avatarEmoji}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white mb-1">
                    {selectedCharacter.name}
                  </h3>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    {selectedCharacter.role}
                  </span>
                </div>
              </div>

              {/* Special Skill in-game */}
              <div className="bg-slate-800/90 border border-amber-500/30 rounded-2xl p-3 max-w-xs text-right shadow">
                <span className="text-[10px] font-bold text-amber-400 block mb-0.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>قابلیت ویژه در بازی (Passives):</span>
                </span>
                <span className="text-xs text-slate-200 font-medium">
                  {selectedCharacter.specialSkill}
                </span>
              </div>
            </div>

            {/* Personality Bio */}
            <div className="mb-6 bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs font-bold text-slate-400 block mb-1">شخصیت و تیپ روانی:</span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedCharacter.personality}
              </p>
            </div>

            {/* Interactive Dialogue Selector Buttons */}
            <div className="mb-4">
              <span className="text-xs font-bold text-slate-400 block mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>شبیه‌ساز دیالوگ‌های فصلی:</span>
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'intro', label: 'آغاز مسابقه' },
                  { key: 'midway', label: 'حین بازی' },
                  { key: 'victory', label: 'گل و پیروزی' },
                  { key: 'defeat', label: 'سوت شکست' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handlePlayDialogue(item.key as any)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      activeDialogueKey === item.key
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-300'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Speech Bubble Showcase */}
            <div className="relative bg-gradient-to-r from-emerald-950/50 via-slate-900 to-slate-900 border-2 border-emerald-500/40 rounded-2xl p-5 shadow-inner">
              <span className="text-xs font-black text-emerald-400 block mb-1">
                نقل‌قول {selectedCharacter.name}:
              </span>
              <p className="text-sm sm:text-base font-bold text-white leading-relaxed italic">
                «{selectedCharacter.dialogue[activeDialogueKey]}»
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Managers / Cameo Legends */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-lg">
        <h3 className="text-base font-black text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>مربیان مهمان و ایستراگ‌های بین‌المللی (Guest Legends)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {GUEST_MANAGERS.map((coach, idx) => (
            <div 
              key={idx}
              className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-black text-white">{coach.name}</h4>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/30">
                    {coach.trait}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  {coach.quote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
