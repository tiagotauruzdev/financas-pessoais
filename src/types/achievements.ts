export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  xpReward: number;
  category: 'economia' | 'investimento' | 'pagamentos' | 'metas';
}

export interface UserProgress {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  achievements: Achievement[];
}

export const calculateLevel = (xp: number): { level: number; nextLevelXP: number } => {
  const baseXP = 1000;
  const level = Math.floor(Math.log(xp / baseXP + 1) / Math.log(1.5)) + 1;
  const nextLevelXP = baseXP * (Math.pow(1.5, level) - 1);
  return { level, nextLevelXP };
};
