import React, { useState, useEffect } from 'react';

export default function AnnualAnalysis() {
  // Dados de exemplo para o ano
  const monthlyData = [
    { month: 'Jan', income: 5200, expenses: 4100 },
    { month: 'Fev', income: 5400, expenses: 4300 },
    { month: 'Mar', income: 5800, expenses: 4200 },
    { month: 'Abr', income: 5300, expenses: 4600 },
    { month: 'Mai', income: 6000, expenses: 4400 },
    { month: 'Jun', income: 5900, expenses: 4800 },
    { month: 'Jul', income: 5600, expenses: 4500 },
    { month: 'Ago', income: 5700, expenses: 4300 },
    { month: 'Set', income: 6100, expenses: 4700 },
    { month: 'Out', income: 5800, expenses: 4400 },
    { month: 'Nov', income: 6200, expenses: 4900 },
    { month: 'Dez', income: 7000, expenses: 5200 }
  ];

  // Encontrar valores máximos para escala
  const maxValue = Math.max(
    ...monthlyData.map(d => Math.max(d.income, d.expenses))
  );
  const gridMax = Math.ceil(maxValue / 1000) * 1000;

  // Função para formatar valores em reais
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Dimensões do gráfico
  const width = 600;
  const height = 300;
  const padding = 40;
  const graphWidth = width - (padding * 2);
  const graphHeight = height - (padding * 2);

  // Função para converter valores em coordenadas Y
  const getYCoordinate = (value: number) => {
    return height - padding - (value / gridMax * graphHeight);
  };

  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const duration = 1500; // 1.5 segundos
    const startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setAnimationProgress(progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  // Função para gerar o path da linha com animação
  const generateAnimatedLinePath = (data: { month: string; income: number; expenses: number; }[], key: 'income' | 'expenses') => {
    const totalPoints = Math.ceil(data.length * animationProgress);
    if (totalPoints === 0) return '';

    return data.slice(0, totalPoints).map((d, i) => {
      const x = padding + (i * (graphWidth / (data.length - 1)));
      const y = getYCoordinate(d[key]);

      // Para o último ponto durante a animação, interpolar a posição
      if (i === totalPoints - 1 && totalPoints < data.length) {
        const progress = (data.length * animationProgress) % 1;
        const nextX = padding + ((i + 1) * (graphWidth / (data.length - 1)));
        const nextY = i + 1 < data.length ? getYCoordinate(data[i + 1][key]) : y;
        
        const currentX = x + (nextX - x) * progress;
        const currentY = y + (nextY - y) * progress;
        
        return `${i === 0 ? 'M' : 'L'} ${currentX} ${currentY}`;
      }

      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  return (
    <div className="bg-gray-200 dark:bg-navy-800 rounded-xl p-6 text-gray-900 dark:text-gray-200">
      <h3 className="text-lg font-medium mb-6 text-gray-900 dark:text-white">Análise Anual</h3>

      <div className="relative w-full overflow-x-auto">
        <svg className="w-full h-[300px] min-w-[600px]" viewBox={`0 0 ${width} ${height}`}>
          {/* Grid Lines and Labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((factor) => {
            const y = getYCoordinate(gridMax * factor);
            return (
              <g key={factor}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  className="stroke-gray-400 dark:stroke-gray-600"
                  strokeWidth="1"
                  strokeDasharray={factor === 0 ? "" : "4,4"}
                />
                <text
                  x={padding - 5}
                  y={y}
                  className="fill-gray-700 dark:fill-gray-400"
                  fontSize="12"
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontFamily="Inter, sans-serif"
                >
                  {formatCurrency(gridMax * factor)}
                </text>
              </g>
            );
          })}

          {/* Month Labels */}
          {monthlyData.map((d, i) => {
            const x = padding + (i * (graphWidth / (monthlyData.length - 1)));
            return (
              <text
                key={d.month}
                x={x}
                y={height - padding + 15}
                className="fill-gray-700 dark:fill-gray-400"
                fontSize="12"
                textAnchor="middle"
                fontFamily="Inter, sans-serif"
              >
                {d.month}
              </text>
            );
          })}

          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Area under the lines */}
          <path
            d={`${generateAnimatedLinePath(monthlyData, 'income')} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`}
            fill="url(#incomeGradient)"
            className="transition-all duration-300"
          />
          <path
            d={`${generateAnimatedLinePath(monthlyData, 'expenses')} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`}
            fill="url(#expensesGradient)"
            className="transition-all duration-300"
          />

          {/* Income Line */}
          <path
            d={generateAnimatedLinePath(monthlyData, 'income')}
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            filter="url(#glow)"
          />

          {/* Expenses Line */}
          <path
            d={generateAnimatedLinePath(monthlyData, 'expenses')}
            fill="none"
            stroke="#F43F5E"
            strokeWidth="2"
            filter="url(#glow)"
          />

          {/* Data Points - Income */}
          {monthlyData.map((d, i) => {
            const pointProgress = (monthlyData.length * animationProgress) - i;
            if (pointProgress <= 0) return null;

            const x = padding + (i * (graphWidth / (monthlyData.length - 1)));
            const y = getYCoordinate(d.income);
            const opacity = Math.min(pointProgress, 1);

            return (
              <circle
                key={`income-${i}`}
                cx={x}
                cy={y}
                r="4"
                className="fill-green-500"
                style={{ opacity }}
              />
            );
          })}

          {/* Data Points - Expenses */}
          {monthlyData.map((d, i) => {
            const pointProgress = (monthlyData.length * animationProgress) - i;
            if (pointProgress <= 0) return null;

            const x = padding + (i * (graphWidth / (monthlyData.length - 1)));
            const y = getYCoordinate(d.expenses);
            const opacity = Math.min(pointProgress, 1);

            return (
              <circle
                key={`expenses-${i}`}
                cx={x}
                cy={y}
                r="4"
                className="fill-red-500"
                style={{ opacity }}
              />
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-6">
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-300/50 dark:bg-gray-300/30 hover:bg-gray-300/70 dark:hover:bg-gray-300/40 transition-all cursor-pointer">
          <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Entradas</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-300/50 dark:bg-gray-300/30 hover:bg-gray-300/70 dark:hover:bg-gray-300/40 transition-all cursor-pointer">
          <div className="w-3 h-3 rounded-full bg-rose-500 shadow-lg shadow-rose-500/50" />
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Saídas</span>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-gray-300/50 dark:bg-gray-300/30 hover:bg-gray-300/70 dark:hover:bg-gray-300/40 transition-all rounded-lg p-4 cursor-pointer">
          <p className="text-sm text-gray-700 dark:text-gray-400 mb-2">Total Entradas</p>
          <p className="text-xl font-medium text-emerald-600 dark:text-emerald-400">
            {formatCurrency(monthlyData.reduce((sum, d) => sum + d.income, 0))}
          </p>
        </div>
        <div className="bg-gray-300/50 dark:bg-gray-300/30 hover:bg-gray-300/70 dark:hover:bg-gray-300/40 transition-all rounded-lg p-4 cursor-pointer">
          <p className="text-sm text-gray-700 dark:text-gray-400 mb-2">Total Saídas</p>
          <p className="text-xl font-medium text-rose-600 dark:text-rose-400">
            {formatCurrency(monthlyData.reduce((sum, d) => sum + d.expenses, 0))}
          </p>
        </div>
      </div>
    </div>
  );
}
