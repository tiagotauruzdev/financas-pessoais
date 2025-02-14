import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Award, Briefcase, Code, Coins, Home, ShoppingBag, Car, Utensils, Heart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card';

interface FinancialItem {
  source: string;
  amount: number;
  frequency: string;
  icon: JSX.Element;
  trend: number;
  category?: string;
  dueDate?: string;
}

export default function EssentialExpenses() {
  const [activeTab, setActiveTab] = useState<'income' | 'expenses'>('income');
  const [progressAnimation, setProgressAnimation] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setProgressAnimation(progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [activeTab]);

  const incomes: FinancialItem[] = [
    {
      source: 'Salário Principal',
      amount: 8500,
      frequency: 'Mensal',
      icon: <Briefcase className="w-5 h-5 text-emerald-500" />,
      trend: 3.5,
      category: 'Fixo',
      dueDate: '05/01/2024'
    },
    {
      source: 'Freelancer',
      amount: 3200,
      frequency: 'Mensal',
      icon: <Code className="w-5 h-5 text-violet-500" />,
      trend: 12.8,
      category: 'Variável',
      dueDate: '10/01/2024'
    },
    {
      source: 'Investimentos',
      amount: 1800,
      frequency: 'Mensal',
      icon: <Coins className="w-5 h-5 text-amber-500" />,
      trend: 5.2,
      category: 'Passivo',
      dueDate: '15/01/2024'
    }
  ].sort((a, b) => b.amount - a.amount);

  const expenses: FinancialItem[] = [
    {
      source: 'Moradia',
      amount: 2500,
      frequency: 'Mensal',
      icon: <Home className="w-5 h-5 text-blue-600" />,
      trend: 0,
      category: 'Essencial',
      dueDate: '10/01/2024'
    },
    {
      source: 'Alimentação',
      amount: 1200,
      frequency: 'Mensal',
      icon: <Utensils className="w-5 h-5 text-orange-600" />,
      trend: 2.5,
      category: 'Essencial',
      dueDate: '15/01/2024'
    },
    {
      source: 'Transporte',
      amount: 800,
      frequency: 'Mensal',
      icon: <Car className="w-5 h-5 text-cyan-600" />,
      trend: 1.8,
      category: 'Essencial',
      dueDate: '05/01/2024'
    },
    {
      source: 'Lazer',
      amount: 600,
      frequency: 'Mensal',
      icon: <Heart className="w-5 h-5 text-pink-600" />,
      trend: 5.0,
      category: 'Variável',
      dueDate: '20/01/2024'
    }
  ].sort((a, b) => b.amount - a.amount);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calculatePercentage = (amount: number, total: number) => {
    return ((amount / total) * 100).toFixed(1);
  };

  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

  const renderItems = (items: FinancialItem[], total: number) => (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div 
          key={index} 
          className={`
            rounded-xl p-4 transform transition-all duration-300 hover:scale-[1.01]
            ${activeTab === 'income' 
              ? 'bg-emerald-500/10 hover:bg-emerald-500/20 dark:bg-emerald-500/5 dark:hover:bg-emerald-500/10' 
              : 'bg-rose-500/10 hover:bg-rose-500/20 dark:bg-rose-500/5 dark:hover:bg-rose-500/10'
            }
            backdrop-blur-lg border
            ${activeTab === 'income'
              ? 'border-emerald-500/20 dark:border-emerald-500/10'
              : 'border-rose-500/20 dark:border-rose-500/10'
            }
          `}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                {index === 0 && (
                  <Award className="w-5 h-5 text-amber-500 dark:text-amber-400 absolute -top-2 -right-2" />
                )}
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center
                  ${activeTab === 'income' 
                    ? 'bg-emerald-500/30 dark:bg-emerald-500/20' 
                    : 'bg-rose-500/30 dark:bg-rose-500/20'
                  }
                `}>
                  {item.icon}
                </div>
              </div>
              <div>
                <h4 className="text-gray-900 dark:text-white font-medium">{item.source}</h4>
                <div className="flex items-center gap-2">
                  <span className={`
                    text-xs font-medium px-2 py-1 rounded-full
                    ${activeTab === 'income'
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/10'
                      : 'bg-rose-500/20 text-rose-600 dark:text-rose-400 dark:bg-rose-500/10'
                    }
                  `}>
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Vence em {item.dueDate}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className={`
                text-lg font-bold
                ${activeTab === 'income' 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-rose-600 dark:text-rose-400'
                }
              `}>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(item.amount)}
              </p>
              <div className="flex items-center gap-1 justify-end">
                <TrendingUp className={`
                  w-3 h-3
                  ${activeTab === 'income' 
                    ? 'text-emerald-500 dark:text-emerald-400' 
                    : 'text-rose-500 dark:text-rose-400'
                  }
                `} />
                <span className={`
                  text-xs font-medium
                  ${activeTab === 'income' 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : 'text-rose-600 dark:text-rose-400'
                  }
                `}>
                  +{item.trend}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="w-full h-2 bg-gray-100 dark:bg-navy-600/50 rounded-full overflow-hidden">
              <div
                className={`
                  h-full rounded-full transition-all duration-500 ease-out
                  ${activeTab === 'income' 
                    ? 'bg-emerald-500 dark:bg-emerald-400/90' 
                    : 'bg-rose-500 dark:bg-rose-400/90'
                  }
                `}
                style={{ 
                  width: `${calculatePercentage(item.amount, total) * progressAnimation}%`,
                  transition: 'width 1s ease-out'
                }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
              {(calculatePercentage(item.amount, total) * progressAnimation).toFixed(1)}% do total
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white dark:bg-navy-800/95 rounded-xl shadow-lg dark:shadow-navy-900/50 border border-gray-100 dark:border-navy-700">
      {/* Cabeçalho com navegação */}
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Fluxo Financeiro
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('income')}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300
                ${activeTab === 'income'
                  ? 'bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 dark:bg-emerald-500/10'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-700'
                }
              `}
            >
              Receitas
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300
                ${activeTab === 'expenses'
                  ? 'bg-rose-500/20 text-rose-500 dark:text-rose-400 dark:bg-rose-500/10'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-700'
                }
              `}
            >
              Despesas
            </button>
          </div>
        </div>

        {/* Totais */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50/80 dark:bg-navy-700/50 rounded-xl p-4 border border-gray-100/50 dark:border-navy-600/50">
            <span className="text-sm text-gray-600 dark:text-gray-300">Total de Receitas</span>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalIncome)}
            </div>
          </div>
          <div className="bg-gray-50/80 dark:bg-navy-700/50 rounded-xl p-4 border border-gray-100/50 dark:border-navy-600/50">
            <span className="text-sm text-gray-600 dark:text-gray-300">Total de Despesas</span>
            <div className="text-lg font-bold text-rose-600 dark:text-rose-400">
              {formatCurrency(totalExpenses)}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de itens com transição suave */}
      <div className="p-6 pt-0">
        <div className="relative overflow-hidden">
          <div
            className="transition-all duration-300 transform"
            style={{
              transform: `translateX(${activeTab === 'income' ? '0%' : '-100%'})`,
              opacity: activeTab === 'income' ? 1 : 0,
              position: activeTab === 'income' ? 'relative' : 'absolute',
              width: '100%'
            }}
          >
            {renderItems(incomes, totalIncome)}
          </div>
          <div
            className="transition-all duration-300 transform"
            style={{
              transform: `translateX(${activeTab === 'expenses' ? '0%' : '100%'})`,
              opacity: activeTab === 'expenses' ? 1 : 0,
              position: activeTab === 'expenses' ? 'relative' : 'absolute',
              width: '100%'
            }}
          >
            {renderItems(expenses, totalExpenses)}
          </div>
        </div>
      </div>
    </div>
  );
}