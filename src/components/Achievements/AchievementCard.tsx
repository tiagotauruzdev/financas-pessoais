import React from 'react';
import { Achievement } from '../../types/achievements';
import { Coins, PiggyBank, Target, Wallet } from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement;
}

const iconMap = {
  PiggyBank,
  Wallet,
  Coins,
  Target,
};

export default function AchievementCard({ achievement }: AchievementCardProps) {
  const Icon = iconMap[achievement.icon as keyof typeof iconMap];
  const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;

  return (
    <div className={`p-4 rounded-lg ${
      achievement.isCompleted 
        ? 'bg-emerald-100 dark:bg-emerald-900/20' 
        : 'bg-gray-100 dark:bg-gray-800/50'
    } transition-all hover:scale-105`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${
          achievement.isCompleted 
            ? 'bg-emerald-200 dark:bg-emerald-800' 
            : 'bg-gray-200 dark:bg-gray-700'
        }`}>
          <Icon className={`w-6 h-6 ${
            achievement.isCompleted 
              ? 'text-emerald-700 dark:text-emerald-300' 
              : 'text-gray-700 dark:text-gray-300'
          }`} />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {achievement.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {achievement.description}
          </p>
          
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600 dark:text-gray-400">
                Progresso: {achievement.progress}/{achievement.maxProgress}
              </span>
              <span className={`font-medium ${
                achievement.isCompleted 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-blue-600 dark:text-blue-400'
              }`}>
                {achievement.xpReward} XP
              </span>
            </div>
            
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div 
                className={`h-full rounded-full transition-all ${
                  achievement.isCompleted 
                    ? 'bg-emerald-500' 
                    : 'bg-blue-500'
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
