import React, { useState, useEffect } from 'react';

export default function PaymentDistribution() {
  const [progressAnimation, setProgressAnimation] = useState(0);

  // Dados de exemplo para os pagamentos
  const payments = {
    cash: 2500,
    credit: 1800
  };

  const total = payments.cash + payments.credit;
  const cashPercentage = (payments.cash / total) * 100;
  const creditPercentage = (payments.credit / total) * 100;

  useEffect(() => {
    const duration = 1500; // 1.5 segundos
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

  // Função para formatar valores em reais
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calcula os ângulos para o gráfico de pizza com animação
  const cashAngle = (cashPercentage / 100) * 360 * progressAnimation;
  const creditAngle = 360 * progressAnimation;

  // Função para converter ângulo em coordenadas do SVG
  const getCoordinates = (angle: number, radius: number) => {
    const radians = (angle - 90) * Math.PI / 180;
    return {
      x: 100 + radius * Math.cos(radians),
      y: 100 + radius * Math.sin(radians)
    };
  };

  // Gera o path para cada fatia da pizza
  const generatePieSlice = (startAngle: number, endAngle: number) => {
    const start = getCoordinates(startAngle, 80);
    const end = getCoordinates(endAngle, 80);
    const largeArc = endAngle - startAngle <= 180 ? 0 : 1;

    return `M 100 100 L ${start.x} ${start.y} A 80 80 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
  };

  return (
    <div className="bg-gray-200 dark:bg-navy-800 rounded-xl p-6 text-gray-900 dark:text-white">
      <h3 className="text-lg font-medium mb-6 text-gray-900 dark:text-white">Pagamentos</h3>

      <div className="relative w-64 h-64 mx-auto mb-6">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          {/* Gradientes */}
          <defs>
            <linearGradient id="cashGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
            <linearGradient id="creditGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>

          {/* Fatia À Vista */}
          <path
            d={generatePieSlice(0, cashAngle)}
            fill="url(#cashGradient)"
            className="hover:opacity-90 transition-opacity cursor-pointer"
          />

          {/* Fatia Crédito */}
          <path
            d={generatePieSlice(cashAngle, creditAngle)}
            fill="url(#creditGradient)"
            className="hover:opacity-90 transition-opacity cursor-pointer"
          />

          {/* Círculo central para efeito 3D */}
          <circle
            cx="100"
            cy="100"
            r="40"
            className="fill-gray-800 dark:fill-navy-900 drop-shadow-lg"
          />

          {/* Valor total no centro */}
          <text
            x="100"
            y="95"
            className="fill-white"
            fontSize="20"
            fontWeight="bold"
            textAnchor="middle"
          >
            {formatCurrency(total)}
          </text>
          <text
            x="100"
            y="115"
            className="fill-gray-300"
            fontSize="12"
            textAnchor="middle"
          >
            Total
          </text>
        </svg>
      </div>

      {/* Legenda */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-300/30 dark:bg-navy-700/50 rounded-lg p-3 hover:bg-gray-300/50 dark:hover:bg-navy-700/70 transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-500 to-green-600" />
            <span className="text-sm text-gray-700 dark:text-gray-400 font-medium">À Vista</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-green-600 dark:text-green-500 font-medium">{formatCurrency(payments.cash)}</span>
            <span className="text-sm text-gray-600 dark:text-gray-500">{(cashPercentage * progressAnimation).toFixed(0)}%</span>
          </div>
        </div>

        <div className="bg-gray-300/30 dark:bg-navy-700/50 rounded-lg p-3 hover:bg-gray-300/50 dark:hover:bg-navy-700/70 transition-colors">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-600" />
            <span className="text-sm text-gray-700 dark:text-gray-400 font-medium">Crédito</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-blue-600 dark:text-blue-500 font-medium">{formatCurrency(payments.credit)}</span>
            <span className="text-sm text-gray-600 dark:text-gray-500">{(creditPercentage * progressAnimation).toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
