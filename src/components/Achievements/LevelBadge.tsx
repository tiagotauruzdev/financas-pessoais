import React from 'react';
import { Trophy } from 'lucide-react';
import { UserProgress } from '../../types/achievements';

interface LevelBadgeProps {
  userProgress: UserProgress;
}

export default function LevelBadge({ userProgress }: LevelBadgeProps) {
  const progressPercentage = (userProgress.currentXP / userProgress.nextLevelXP) * 100;

  return (
    <div className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-amber-100/80 to-amber-50/80 dark:from-yellow-900/40 dark:to-amber-900/40 px-2 sm:px-3 py-1.5 rounded-full border border-amber-200/50 dark:border-yellow-500/30 shadow-lg shadow-amber-500/5 dark:shadow-yellow-500/5">
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="p-1 bg-amber-200 dark:bg-gradient-to-r dark:from-yellow-500 dark:to-amber-500 rounded-full shadow-lg shadow-amber-200/20 dark:shadow-yellow-500/20">
          <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-yellow-100" />
        </div>
        <span className="font-semibold text-sm sm:text-base text-amber-700 dark:text-yellow-300">
          Nível {userProgress.level}
        </span>
      </div>
      
      <div className="hidden sm:flex items-center gap-2">
        <div className="w-20 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 dark:bg-gradient-to-r dark:from-yellow-500 dark:to-amber-500 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <span className="text-xs font-medium text-gray-600 dark:text-yellow-200/90">
          {Math.floor(userProgress.currentXP)}/{Math.floor(userProgress.nextLevelXP)} XP
        </span>
      </div>

      {/* Versão mobile do XP */}
      <div className="flex sm:hidden items-center">
        <span className="text-xs font-medium text-gray-600 dark:text-yellow-200/90">
          {Math.floor(userProgress.currentXP)} XP
        </span>
      </div>
    </div>
  );
}
