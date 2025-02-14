import React from 'react';
import { PiggyBank, TrendingUp, Building2, RefreshCw, DollarSign, BarChart3 } from 'lucide-react';

const Investments = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Investimentos
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gerencie seus investimentos e acompanhe seu desempenho
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Total Investido
            </h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            R$ 150.000,00
          </p>
          <p className="text-sm text-green-500 mt-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            +12.5% este mês
          </p>
        </div>

        <div className="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Rendimento
            </h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            R$ 15.750,00
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Últimos 12 meses
          </p>
        </div>

        <div className="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Building2 className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Ativos
            </h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            15
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Em 5 categorias
          </p>
        </div>

        <div className="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <RefreshCw className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Próx. Rebalanceamento
            </h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            15 dias
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            02/03/2024
          </p>
        </div>
      </div>

      {/* Investment Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Distribuição por Categoria
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Renda Fixa</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">45%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Ações</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">30%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">FIIs</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">15%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Criptomoedas</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">10%</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Últimas Transações
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Compra de PETR4</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Hoje, 14:30</p>
                </div>
              </div>
              <span className="text-sm font-medium text-green-500">+ R$ 1.000,00</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Venda de HGLG11</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Ontem, 11:20</p>
                </div>
              </div>
              <span className="text-sm font-medium text-red-500">- R$ 2.500,00</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Rebalanceamento</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">15/02/2024</p>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Concluído</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Nova Transação
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Registre uma nova compra ou venda de ativos
          </p>
        </button>

        <button className="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <PiggyBank className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Novo Ativo
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Adicione um novo ativo ao seu portfólio
          </p>
        </button>

        <button className="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <RefreshCw className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Rebalancear
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ajuste a distribuição do seu portfólio
          </p>
        </button>
      </div>
    </div>
  );
};

export default Investments;
