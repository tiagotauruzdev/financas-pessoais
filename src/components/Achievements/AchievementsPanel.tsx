import React from 'react';
import { Trophy } from 'lucide-react';
import { Achievement, UserProgress, calculateLevel } from '../../types/achievements';
import AchievementCard from './AchievementCard';

interface AchievementsPanelProps {
  userProgress: UserProgress;
}

export default function AchievementsPanel({ userProgress }: AchievementsPanelProps) {
  const progressPercentage = (userProgress.currentXP / userProgress.nextLevelXP) * 100;
  const completedAchievements = userProgress.achievements.filter(a => a.isCompleted).length;

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      {/* Cabeçalho com Nível e XP */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full">
            <Trophy className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Nível {userProgress.level}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {completedAchievements} conquistas completadas
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {Math.floor(userProgress.currentXP)} / {Math.floor(userProgress.nextLevelXP)} XP
          </p>
          <div className="w-32 h-2 mt-2 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div
              className="h-full bg-amber-500 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grade de Conquistas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userProgress.achievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
          />
        ))}
      </div>
    </div>
  );
}
