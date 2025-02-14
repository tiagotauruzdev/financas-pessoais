import React, { useState, useEffect } from 'react';
import { Umbrella, AlertCircle } from 'lucide-react';

interface EmergencyFundData {
  currentAmount: number;
  monthlyExpenses: number;
  targetMonths: number;
}

export default function EmergencyFundCard() {
  const [progressAnimation, setProgressAnimation] = useState(0);

  const emergencyData: EmergencyFundData = {
    currentAmount: 15000,
    monthlyExpenses: 5000,
    targetMonths: 6
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calculateProgress = () => {
    const targetAmount = emergencyData.monthlyExpenses * emergencyData.targetMonths;
    return (emergencyData.currentAmount / targetAmount) * 100;
  };

  const progress = calculateProgress();
  const targetAmount = emergencyData.monthlyExpenses * emergencyData.targetMonths;
  const remaining = targetAmount - emergencyData.currentAmount;

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

  return (
    <div className="bg-gray-200 dark:bg-navy-800 rounded-xl p-6 transform hover:scale-102 transition-all duration-300 hover:shadow-lg animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
            <Umbrella className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Reserva de Emergência</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Meta: {emergencyData.targetMonths} meses</p>
          </div>
        </div>
      </div>

      {/* Progresso */}
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Progresso</span>
          <span className="text-sm text-yellow-600 dark:text-yellow-400">{(progress * progressAnimation).toFixed(1)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-300 dark:bg-navy-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-yellow-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress * progressAnimation, 100)}%` }}
          />
        </div>
      </div>

      {/* Valores */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-300/50 dark:bg-navy-700/50 rounded-lg p-3 transform hover:scale-105 transition-all duration-300">
          <span className="text-sm text-gray-600 dark:text-gray-400">Atual</span>
          <p className="text-base font-bold text-gray-900 dark:text-white">{formatCurrency(emergencyData.currentAmount)}</p>
        </div>
        <div className="bg-gray-300/50 dark:bg-navy-700/50 rounded-lg p-3 transform hover:scale-105 transition-all duration-300">
          <span className="text-sm text-gray-600 dark:text-gray-400">Meta</span>
          <p className="text-base font-bold text-gray-900 dark:text-white">{formatCurrency(targetAmount)}</p>
        </div>
      </div>

      {/* Alerta se estiver abaixo da meta */}
      {remaining > 0 && (
        <div className="mt-4 flex items-center gap-2 bg-red-500/10 rounded-lg p-3 animate-pulse">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Faltam {formatCurrency(remaining)}
          </p>
        </div>
      )}
    </div>
  );
}
