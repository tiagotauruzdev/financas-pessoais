import { useEffect, useState } from 'react';
import { debtsService } from '../services/debtsService';
import type { Debt } from '../types/debt';

export default function DebtScore() {
  const [totalValue, setTotalValue] = useState(0);
  const [paidValue, setPaidValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const targetPercentage = totalValue > 0 ? (paidValue / totalValue) * 100 : 0;
  const [currentPercentage, setCurrentPercentage] = useState(0);
  const [currentAngle, setCurrentAngle] = useState(0);

  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = async () => {
    try {
      const debts = await debtsService.getAllDebts();
      const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);
      const paidDebt = debts.reduce((sum, debt) => sum + (debt.amount - debt.remaining_amount), 0);
      
      setTotalValue(totalDebt);
      setPaidValue(paidDebt);
    } catch (error) {
      console.error('Error loading debts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Animação do preenchimento
    const duration = 1500; // duração em ms
    const steps = 60; // número de passos da animação
    const stepDuration = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Easing cúbico
      
      const newPercentage = targetPercentage * easeProgress;
      const newAngle = (newPercentage / 100) * 180;
      
      setCurrentPercentage(newPercentage);
      setCurrentAngle(newAngle);

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [targetPercentage]);

  // Formata o valor em reais
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-200 dark:bg-navy-800/80 rounded-xl p-6 text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Carregando pontuação...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 dark:bg-navy-800/80 rounded-xl p-6 text-gray-900 dark:text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Pontuação de Dívidas</h3>
        <div className="flex items-center gap-1 bg-gray-300/80 dark:bg-navy-700 rounded-full px-3 py-1">
          <span className="text-cyan-600 dark:text-cyan-400 font-medium">{currentPercentage.toFixed(0)}%</span>
          <span className="text-gray-700 dark:text-gray-300 text-sm">pago</span>
        </div>
      </div>
      
      <div className="relative w-72 h-48 mx-auto mb-8">
        <svg className="w-full h-full" viewBox="0 0 240 160">
          {/* Arco de fundo */}
          <path
            d="M30 120 A 90 90 0 0 1 210 120"
            fill="none"
            stroke="currentColor"
            className="text-gray-300 dark:text-navy-600"
            strokeWidth="20"
            strokeLinecap="round"
          />

          {/* Sombra do medidor */}
          <path
            d="M30 120 A 90 90 0 0 1 210 120"
            fill="none"
            stroke="rgba(0,0,0,0.1) dark:rgba(255,255,255,0.05)"
            strokeWidth="20"
            strokeLinecap="round"
            transform="translate(0, 4)"
          />

          {/* Gradiente para o medidor */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>

          {/* Arco de progresso com transição suave */}
          <path
            d={`M30 120 A 90 90 0 0 1 ${
              120 + 90 * Math.cos(((-180 + currentAngle) * Math.PI) / 180)
            } ${120 + 90 * Math.sin(((-180 + currentAngle) * Math.PI) / 180)}`}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="20"
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
          />

          {/* Marcadores de escala e números */}
          {Array.from({ length: 6 }).map((_, i) => {
            const markerAngle = -180 + (i * 180) / 5;
            const markerValue = (i * totalValue) / 5;
            const x1 = 120 + 80 * Math.cos((markerAngle * Math.PI) / 180);
            const y1 = 120 + 80 * Math.sin((markerAngle * Math.PI) / 180);
            const x2 = 120 + 65 * Math.cos((markerAngle * Math.PI) / 180);
            const y2 = 120 + 65 * Math.sin((markerAngle * Math.PI) / 180);
            
            return (
              <g key={i}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  className="text-gray-600 dark:text-gray-400"
                  stroke="currentColor"
                  strokeWidth="2.5"
                />
                <text
                  x={120 + 95 * Math.cos((markerAngle * Math.PI) / 180)}
                  y={120 + 95 * Math.sin((markerAngle * Math.PI) / 180)}
                  className="text-gray-900 dark:text-white font-medium"
                  fill="currentColor"
                  fontSize="12"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ zIndex: 10 }}
                >
                  {formatCurrency(markerValue)}
                </text>
              </g>
            );
          })}

          {/* Ponteiro */}
          <g transform={`rotate(${currentAngle - 180}, 120, 120)`}>
            <line
              x1="120"
              y1="120"
              x2="200"
              y2="120"
              stroke="#f97316"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="120" cy="120" r="8" fill="#f97316" />
          </g>

          {/* Valor central */}
          <text
            x="120"
            y="85"
            fill="#22d3ee"
            fontSize="28"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {formatCurrency(paidValue)}
          </text>
        </svg>
      </div>

      <div className="flex justify-between items-center bg-gray-300 dark:bg-navy-700/30 rounded-lg p-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Valor Total</p>
          <p className="text-lg font-medium text-orange-500">{formatCurrency(totalValue)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">Valor Quitado</p>
          <p className="text-lg font-medium text-cyan-400">{formatCurrency(paidValue)}</p>
        </div>
      </div>
    </div>
  );
}