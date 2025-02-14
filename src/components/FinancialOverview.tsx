import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, Filter, MoreVertical } from 'lucide-react';

export default function FinancialOverview() {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [balance, setBalance] = useState(0);

  // Valores finais
  const targetIncome = 14600;
  const targetExpenses = 13265;
  const targetBalance = targetIncome - targetExpenses;

  useEffect(() => {
    const duration = 1000; // 1 segundo
    const steps = 60; // 60 frames
    const interval = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      // Função de easing para suavizar a animação
      const easeOutQuad = (t: number) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);

      setIncome(Math.round(easedProgress * targetIncome));
      setExpenses(Math.round(easedProgress * targetExpenses));
      setBalance(Math.round(easedProgress * targetBalance));

      if (currentStep >= steps) {
        clearInterval(timer);
        // Garante que os valores finais sejam exatos
        setIncome(targetIncome);
        setExpenses(targetExpenses);
        setBalance(targetBalance);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="bg-white dark:bg-navy-800 rounded-xl shadow-lg dark:shadow-navy-900/50 border border-gray-100 dark:border-navy-700/50 hover:border-gray-200 dark:hover:border-navy-600 transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Fluxo Financeiro
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Resumo do mês atual
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Receitas */}
          <div className="bg-gray-50 dark:bg-navy-700/50 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-navy-700/70 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-500/10 rounded-lg">
                <ArrowUpRight className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Receitas</span>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(income)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Média Mensal: {formatCurrency(income / 12)}
              </div>
            </div>
          </div>

          {/* Despesas */}
          <div className="bg-gray-50 dark:bg-navy-700/50 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-navy-700/70 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-500/10 rounded-lg">
                <ArrowDownRight className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Despesas</span>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(expenses)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Média Mensal: {formatCurrency(expenses / 12)}
              </div>
            </div>
          </div>

          {/* Saldo */}
          <div className="bg-gray-50 dark:bg-navy-700/50 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-navy-700/70 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-500/10 rounded-lg">
                <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Saldo</span>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(balance)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Média Mensal: {formatCurrency(balance / 12)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};