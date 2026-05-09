export type AchievementId =
  | 'kombat'
  | 'scout'
  | 'analyst'
  | 'ghost'
  | 'witness'
  | 'franchise';

export interface Achievement {
  id: AchievementId;
  icon: string;
  title: string;
  desc: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'kombat', icon: '⌨️', title: 'Kombat Ready', desc: 'entered Konami code' },
  { id: 'scout', icon: '🗺️', title: 'Scout', desc: 'clicked every map pin' },
  { id: 'analyst', icon: '📊', title: 'Analyst', desc: 'hovered every stat card' },
  { id: 'ghost', icon: '👻', title: 'Ghost in the Shell', desc: 'found whobuiltthis panel' },
  { id: 'witness', icon: '⚡', title: 'Witness', desc: 'hit 100% on GOAT meter' },
  { id: 'franchise', icon: '🏆', title: 'The Franchise', desc: 'unlocked all achievements' },
];

const KEY = 'lj8_achievements';

export function getUnlocked(): Set<AchievementId> {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as AchievementId[]);
  } catch {
    return new Set();
  }
}

export function unlockAchievement(id: AchievementId): Achievement | null {
  const unlocked = getUnlocked();
  if (unlocked.has(id)) return null;
  unlocked.add(id);
  localStorage.setItem(KEY, JSON.stringify([...unlocked]));

  const achievement = ACHIEVEMENTS.find(a => a.id === id)!;

  const nonFranchise = ACHIEVEMENTS.filter(a => a.id !== 'franchise');
  const allUnlocked = nonFranchise.every(a => unlocked.has(a.id));
  if (allUnlocked && !unlocked.has('franchise')) {
    setTimeout(() => unlockAchievement('franchise'), 500);
  }

  return achievement;
}
