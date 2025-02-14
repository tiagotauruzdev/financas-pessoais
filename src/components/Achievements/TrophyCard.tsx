import React from 'react';
import { Trophy, Medal, Star, Award } from 'lucide-react';
import { Achievement } from '../../types/achievements';

interface TrophyCardProps {
  achievement: Achievement;
  showDetails: boolean;
  onShowDetails: () => void;
}

const iconMap = {
  'economia': Medal,
  'investimento': Trophy,
  'pagamentos': Star,
  'metas': Award,
};

export default function TrophyCard({ achievement, showDetails, onShowDetails }: TrophyCardProps) {
  const Icon = iconMap[achievement.category];
  const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;

  return (
    <div 
      onClick={onShowDetails}
      className={`relative group cursor-pointer transition-all duration-300 ${
        achievement.isCompleted ? 'scale-100 hover:scale-105' : 'opacity-70 hover:opacity-90'
      }`}
    >
      {/* Card Principal */}
      <div className={`
        relative p-6 rounded-xl shadow-lg overflow-hidden
        ${achievement.isCompleted 
          ? 'bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-800/20' 
          : 'bg-gray-100 dark:bg-gray-800/50'}
      `}>
        {/* Efeito de Brilho */}
        {achievement.isCompleted && (
          <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-transparent via-white to-transparent group-hover:translate-x-full duration-1000 transform -skew-x-12" />
        )}

        {/* Ícone */}
        <div className="flex justify-center mb-4">
          <div className={`
            p-4 rounded-full 
            ${achievement.isCompleted 
              ? 'bg-amber-200 dark:bg-amber-700' 
              : 'bg-gray-200 dark:bg-gray-700'}
          `}>
            <Icon className={`
              w-12 h-12
              ${achievement.isCompleted 
                ? 'text-amber-600 dark:text-amber-300' 
                : 'text-gray-500 dark:text-gray-400'}
            `} />
          </div>
        </div>

        {/* Título e XP */}
        <div className="text-center mb-3">
          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
            {achievement.title}
          </h3>
          <span className={`
            text-sm font-medium
            ${achievement.isCompleted 
              ? 'text-amber-600 dark:text-amber-400' 
              : 'text-gray-600 dark:text-gray-400'}
          `}>
            {achievement.xpReward} XP
          </span>
        </div>

        {/* Barra de Progresso */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              achievement.isCompleted ? 'bg-amber-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Progresso Numérico */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          {achievement.progress} / {achievement.maxProgress}
        </div>
      </div>

      {/* Detalhes em Hover */}
      {showDetails && (
        <div className="absolute inset-0 bg-black/80 rounded-xl p-4 flex items-center justify-center">
          <div className="text-center text-white">
            <p className="text-sm">{achievement.description}</p>
            {achievement.isCompleted && (
              <p className="mt-2 text-amber-400 font-medium">Conquista Desbloqueada!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
