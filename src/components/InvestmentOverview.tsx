import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Filter,
  PieChart,
  Building,
  Globe,
  Bitcoin,
  Wallet,
  Target
} from 'lucide-react';

interface Investment {
  id: number;
  name: string;
  category: string;
  value: number;
  profitLoss: number;
  profitLossPercentage: number;
  lastUpdate: string;
}

export default function InvestmentOverview() {
  // Dados de exemplo
  const investments: Investment[] = [
    {
      id: 1,
      name: "Tesouro IPCA+ 2026",
      category: "Renda Fixa",
      value: 15000,
      profitLoss: 1200,
      profitLossPercentage: 8.7,
      lastUpdate: "2024-01-10"
    },
    {
      id: 2,
      name: "PETR4",
      category: "Ações",
      value: 8500,
      profitLoss: -450,
      profitLossPercentage: -5.2,
      lastUpdate: "2024-01-10"
    },
    {
      id: 3,
      name: "KNRI11",
      category: "Fundos Imobiliários",
      value: 12000,
      profitLoss: 800,
      profitLossPercentage: 7.1,
      lastUpdate: "2024-01-10"
    },
    {
      id: 4,
      name: "Bitcoin",
      category: "Criptomoedas",
      value: 5000,
      profitLoss: 1500,
      profitLossPercentage: 42.8,
      lastUpdate: "2024-01-10"
    }
  ];

  // Calcula o total investido
  const totalInvested = investments.reduce((sum, inv) => sum + inv.value, 0);
  const totalProfitLoss = investments.reduce((sum, inv) => sum + inv.profitLoss, 0);
  const totalProfitLossPercentage = (totalProfitLoss / (totalInvested - totalProfitLoss)) * 100;

  // Formata valor em reais
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-gray-200 dark:bg-navy-800 rounded-xl p-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Meus Investimentos</h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-navy-800 dark:bg-gray-300 text-gray-300 dark:text-gray-900 rounded-lg hover:bg-navy-700 dark:hover:bg-gray-400 transition-colors">
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 dark:bg-orange-500 text-white rounded-lg hover:bg-cyan-600 dark:hover:bg-orange-600 transition-colors">
            <Plus className="w-4 h-4" />
            Novo Investimento
          </button>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-300/50 dark:bg-navy-700/50 rounded-xl p-6">
          <h3 className="text-gray-400 dark:text-gray-600 text-sm mb-2">Total Investido</h3>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalInvested)}</div>
        </div>

        <div className="bg-gray-300/50 dark:bg-navy-700/50 rounded-xl p-6">
          <h3 className="text-gray-400 dark:text-gray-600 text-sm mb-2">Retorno Total</h3>
          <div className={`text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatCurrency(totalProfitLoss)}
          </div>
        </div>

        <div className="bg-gray-300/50 dark:bg-navy-700/50 rounded-xl p-6">
          <h3 className="text-gray-400 dark:text-gray-600 text-sm mb-2">Retorno %</h3>
          <div className={`text-2xl font-bold ${totalProfitLossPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {totalProfitLossPercentage.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Lista de investimentos */}
      <div className="bg-gray-300/50 dark:bg-navy-700/50 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-300 dark:border-navy-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Carteira Detalhada</h3>
        </div>

        <div className="divide-y divide-gray-300 dark:divide-navy-700">
          {investments.map((investment) => (
            <div
              key={investment.id}
              className="px-6 py-4 hover:bg-gray-200 dark:hover:bg-navy-800/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-gray-900 dark:text-white font-medium">{investment.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{investment.category}</p>
                </div>
                <div className="text-right">
                  <div className="text-gray-900 dark:text-white font-medium">{formatCurrency(investment.value)}</div>
                  <div className="flex items-center gap-1 text-sm">
                    {investment.profitLossPercentage >= 0 ? (
                      <>
                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                        <span className="text-green-500">
                          {investment.profitLossPercentage.toFixed(1)}%
                        </span>
                      </>
                    ) : (
                      <>
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                        <span className="text-red-500">
                          {Math.abs(investment.profitLossPercentage).toFixed(1)}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Última atualização: {new Date(investment.lastUpdate).toLocaleDateString('pt-BR')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
