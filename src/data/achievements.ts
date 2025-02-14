import { Achievement } from '../types/achievements';
import { Coins, PiggyBank, Target, Wallet } from 'lucide-react';

export const initialAchievements: Achievement[] = [
  {
    id: 'primeiro_investimento',
    title: 'Primeiro Investimento',
    description: 'Faça seu primeiro investimento',
    icon: 'PiggyBank',
    progress: 0,
    maxProgress: 1,
    isCompleted: false,
    xpReward: 500,
    category: 'investimento'
  },
  {
    id: 'economizador_iniciante',
    title: 'Economizador Iniciante',
    description: 'Economize 10% do seu salário por 3 meses consecutivos',
    icon: 'Wallet',
    progress: 0,
    maxProgress: 3,
    isCompleted: false,
    xpReward: 1000,
    category: 'economia'
  },
  {
    id: 'pagador_pontual',
    title: 'Pagador Pontual',
    description: 'Pague 5 contas antes do vencimento',
    icon: 'Coins',
    progress: 0,
    maxProgress: 5,
    isCompleted: false,
    xpReward: 300,
    category: 'pagamentos'
  },
  {
    id: 'meta_alcancada',
    title: 'Primeira Meta Alcançada',
    description: 'Alcance sua primeira meta financeira',
    icon: 'Target',
    progress: 0,
    maxProgress: 1,
    isCompleted: false,
    xpReward: 800,
    category: 'metas'
  },
  {
    id: 'investidor_diversificado',
    title: 'Investidor Diversificado',
    description: 'Tenha investimentos em 3 categorias diferentes',
    icon: 'PiggyBank',
    progress: 0,
    maxProgress: 3,
    isCompleted: false,
    xpReward: 1200,
    category: 'investimento'
  }
];
