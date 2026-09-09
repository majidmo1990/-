/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PlayableGame } from './components/PlayableGame/PlayableGame';
import { GDDViewer } from './components/GDDViewer/GDDViewer';
import { WordDatabaseViewer } from './components/WordDatabaseViewer/WordDatabaseViewer';
import { SeasonsView } from './components/SeasonsView/SeasonsView';
import { CharactersView } from './components/CharactersView/CharactersView';
import { ShopModal } from './components/ShopModal/ShopModal';
import { AdvancedPromptModal } from './components/AdvancedPromptModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('game');
  const [coins, setCoins] = useState<number>(() => {
    const saved = localStorage.getItem('fb_coins');
    return saved ? parseInt(saved, 10) : 150;
  });
  const [gold, setGold] = useState<number>(() => {
    const saved = localStorage.getItem('fb_gold');
    return saved ? parseInt(saved, 10) : 5;
  });
  const [currentLevelId, setCurrentLevelId] = useState<number>(() => {
    const saved = localStorage.getItem('fb_currentLevel');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [completedLevels, setCompletedLevels] = useState<number[]>(() => {
    const saved = localStorage.getItem('fb_completedLevels');
    return saved ? JSON.parse(saved) : [];
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('fb_coins', coins.toString());
  }, [coins]);

  useEffect(() => {
    localStorage.setItem('fb_gold', gold.toString());
  }, [gold]);

  useEffect(() => {
    localStorage.setItem('fb_currentLevel', currentLevelId.toString());
  }, [currentLevelId]);

  useEffect(() => {
    localStorage.setItem('fb_completedLevels', JSON.stringify(completedLevels));
  }, [completedLevels]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Vazirmatn',sans-serif] flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Header & Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        coins={coins}
        gold={gold}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        openPromptModal={() => setIsPromptModalOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1 w-full pb-16">
        {activeTab === 'game' && (
          <PlayableGame
            coins={coins}
            setCoins={setCoins}
            gold={gold}
            setGold={setGold}
            currentLevelId={currentLevelId}
            setCurrentLevelId={setCurrentLevelId}
            completedLevels={completedLevels}
            setCompletedLevels={setCompletedLevels}
          />
        )}

        {activeTab === 'gdd' && (
          <GDDViewer openPromptModal={() => setIsPromptModalOpen(true)} />
        )}

        {activeTab === 'database' && <WordDatabaseViewer />}

        {activeTab === 'seasons' && (
          <SeasonsView
            currentLevelId={currentLevelId}
            completedLevels={completedLevels}
            onSelectLevel={(id) => setCurrentLevelId(id)}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'characters' && <CharactersView />}

        {activeTab === 'shop' && (
          <ShopModal
            coins={coins}
            setCoins={setCoins}
            gold={gold}
            setGold={setGold}
          />
        )}
      </main>

      {/* Bottom Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            بازی موبایل «فوتبال‌واژه» (طراحی کامل به سبک آمیرزا با تم فوتبالی)
          </span>
          <button
            onClick={() => setIsPromptModalOpen(true)}
            className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
          >
            مشاهده و دریافت پرامپت ارتقایافته صنعتی (Master Prompt)
          </button>
        </div>
      </footer>

      {/* Advanced Prompt Modal */}
      <AdvancedPromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
      />
    </div>
  );
}

