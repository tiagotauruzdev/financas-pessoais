import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, ArrowUpRight, Wallet, PiggyBank } from 'lucide-react';

interface Investment {
  type: string;
  amount: number;
  goal: number;
  monthlyContribution: number;
  returnRate: number;
  icon: JSX.Element;
}

export default function InvestmentProgress() {
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
  }, []);

  const investments: Investment[] = [
    {
      type: 'Renda Fixa',
      amount: 25000,
      goal: 50000,
      monthlyContribution: 1000,
      returnRate: 12.5,
      icon: <PiggyBank className="w-4 h-4 text-amber-600" />
    },
    {
      type: 'Cripto',
      amount: 15000,
      goal: 30000,
      monthlyContribution: 500,
      returnRate: 8.2,
      icon: <Wallet className="w-4 h-4 text-violet-500" />
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calculateProgress = (current: number, target: number) => {
    return (current / target) * 100;
  };

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalGoal = investments.reduce((sum, inv) => sum + inv.goal, 0);
  const totalProgress = calculateProgress(totalInvested, totalGoal);

  return (
    <div className="bg-gray-200 dark:bg-navy-800 rounded-xl p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center">
            <Target className="w-6 h-6 text-cyan-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Meta Investimentos</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Progresso por categoria</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gray-300/50 dark:bg-navy-700/50 rounded-lg px-3 py-1">
          <TrendingUp className="w-4 h-4 text-cyan-500" />
          <span className="text-sm text-gray-900 dark:text-white">{(totalProgress * progressAnimation).toFixed(1)}%</span>
        </div>
      </div>

      {/* Total Progress Bar */}
      <div className="mb-6">
        <div className="w-full h-2 bg-gray-300 dark:bg-navy-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(totalProgress * progressAnimation, 100)}%` }}
          />
        </div>
      </div>

      {/* Investment Categories */}
      <div className="space-y-4">
        {investments.map((investment, index) => {
          const progress = calculateProgress(investment.amount, investment.goal);
          return (
            <div 
              key={index} 
              className="bg-gray-300/50 dark:bg-navy-700/50 rounded-lg p-4 transform hover:scale-102 transition-all duration-300 hover:shadow-lg"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fade-in-up 0.5s ease-out forwards'
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {investment.icon}
                  <span className="text-gray-900 dark:text-white font-medium">{investment.type}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ArrowUpRight className={`w-4 h-4`} 
                    style={{ 
                      color: investment.type === 'Renda Fixa' ? '#D97706' : '#A78BFA'
                    }} 
                  />
                  <span className="text-sm font-medium"
                    style={{ 
                      color: investment.type === 'Renda Fixa' ? '#D97706' : '#A78BFA'
                    }}
                  >{investment.returnRate}%</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Investido</p>
                  <p className="text-gray-900 dark:text-white font-medium">{formatCurrency(investment.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Meta</p>
                  <p className="text-gray-900 dark:text-white font-medium">{formatCurrency(investment.goal)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="w-full h-1.5 bg-gray-300 dark:bg-navy-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress * progressAnimation, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Aporte Mensal: {formatCurrency(investment.monthlyContribution)}
                  </span>
                  <span className="text-xs text-gray-900 dark:text-white">{(progress * progressAnimation).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-300 dark:border-navy-700">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Investido</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(totalInvested)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Meta Total</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(totalGoal)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}