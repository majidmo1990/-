export type WordCategory =
  | 'iranian_player'
  | 'foreign_player'
  | 'club_team'
  | 'coach'
  | 'technique_term'
  | 'position'
  | 'tournament'
  | 'stadium'
  | 'general_concept';

export type WordDifficulty = 'آسان' | 'متوسط' | 'سخت';

export interface WordItem {
  id: string;
  word: string;
  category: WordCategory;
  difficulty: WordDifficulty;
  length: number;
  clue?: string;
  latin?: string;
}

export interface GameLevel {
  id: number;
  seasonId: number;
  levelNumber: number;
  title: string;
  subTitle: string;
  letters: string[];
  requiredWords: string[]; // کلمات اجباری (گل‌ها)
  bonusWords: string[];    // کلمات اختیاری (پاس‌های طلایی)
  difficulty: WordDifficulty;
  isBoss: boolean;
  bossCharacterId?: string;
  timeLimit?: number;      // ثانیه (برای مراحل باس)
}

export interface Season {
  id: number;
  name: string;
  startLevel: number;
  endLevel: number;
  stagesCount: number;
  difficulty: string;
  theme: string;
  trophyName: string;
  stadiumName: string;
  iconName: string;
}

export interface CharacterDialogue {
  intro: string;
  midway: string;
  victory: string;
  defeat: string;
}

export interface Character {
  id: string;
  name: string;
  role: string;
  avatarEmoji: string;
  personality: string;
  dialogue: CharacterDialogue;
  color: string;
  specialSkill: string;
}

export interface ShopItem {
  id: string;
  name: string;
  category: 'hints' | 'balls' | 'currency' | 'cards';
  costCoins?: number;
  costGold?: number;
  costToman?: number;
  desc: string;
  icon: string;
  popular?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  rewardCoins: number;
  rewardGold?: number;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
}

export interface UserStats {
  coins: number;
  gold: number;
  currentLevel: number;
  completedLevels: number[];
  foundBonusWordsCount: number;
  goldenPassCoinsEarned: number;
  goalsScored: number;
  hatTricks: number;
  soundEnabled: boolean;
  equippedBall: string;
}
