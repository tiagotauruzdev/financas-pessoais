import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, Award } from 'lucide-react';
import TrophyCard from '../components/Achievements/TrophyCard';
import { initialAchievements } from '../data/achievements';
import { UserProgress } from '../types/achievements';

export default function AchievementsPage() {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 1,
    currentXP: 750,
    nextLevelXP: 1000,
    achievements: initialAchievements
  });

  const [selectedAchievement, setSelectedAchievement] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'Todas' },
    { id: 'economia', name: 'Economia', icon: Medal },
    { id: 'investimento', name: 'Investimentos', icon: Trophy },
    { id: 'pagamentos', name: 'Pagamentos', icon: Star },
    { id: 'metas', name: 'Metas', icon: Award },
  ];

  const [activeCategory, setActiveCategory] = useState('all');

  const filteredAchievements = userProgress.achievements.filter(achievement => 
    activeCategory === 'all' || achievement.category === activeCategory
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Suas Conquistas
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Desbloqueie troféus e medalhas completando desafios financeiros
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Nível
          </h3>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
            {userProgress.level}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            XP Total
          </h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {Math.floor(userProgress.currentXP)}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Troféus
          </h3>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {userProgress.achievements.filter(a => a.isCompleted && a.category === 'investimento').length}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Medalhas
          </h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {userProgress.achievements.filter(a => a.isCompleted && a.category === 'economia').length}
          </p>
        </div>
      </div>

      {/* Filtros de Categoria */}
      <div className="flex flex-wrap gap-4 mb-8">
        {categories.map(category => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full transition-all
                ${activeCategory === category.id
                  ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}
              `}
            >
              {Icon && <Icon className="w-4 h-4" />}
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Grade de Troféus e Medalhas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAchievements.map((achievement) => (
          <TrophyCard
            key={achievement.id}
            achievement={achievement}
            showDetails={selectedAchievement === achievement.id}
            onShowDetails={() => setSelectedAchievement(
              selectedAchievement === achievement.id ? null : achievement.id
            )}
          />
        ))}
      </div>
    </div>
  );
}
