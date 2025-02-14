import React, { useState } from 'react';
import {
  TrendingUp,
  PiggyBank,
  Building2,
  Wallet,
  LineChart,
  BarChart3,
  Building,
  GanttChartSquare,
  DollarSign,
  Plus,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  BarChart2,
  Settings,
  ArrowUpRight
} from 'lucide-react';

interface InvestmentCategory {
  name: string;
  icon: React.ReactNode;
  items: {
    name: string;
    description: string;
  }[];
}

export default function InvestmentMenu() {
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const investments: InvestmentCategory[] = [
    {
      name: "Renda Fixa",
      icon: <PiggyBank className="w-5 h-5" />,
      items: [
        { name: "Poupança", description: "Investimento simples e seguro com baixo rendimento" },
        { name: "Tesouro Direto", description: "Títulos públicos com baixo risco (Selic, IPCA+, Prefixado)" },
        { name: "CDB", description: "Certificados bancários com rentabilidade fixa ou CDI" },
        { name: "LCI/LCA", description: "Letras de crédito isentas de IR" },
        { name: "Debêntures", description: "Títulos de dívida corporativa com maior rendimento e risco" }
      ]
    },
    {
      name: "Renda Variável",
      icon: <TrendingUp className="w-5 h-5" />,
      items: [
        { name: "Ações", description: "Investimento em empresas listadas na Bolsa" },
        { name: "Fundos Imobiliários", description: "FIIs para renda passiva mensal" },
        { name: "ETFs", description: "Fundos que replicam índices de mercado" },
        { name: "Criptomoedas", description: "Bitcoin, Ethereum e outras moedas digitais" }
      ]
    },
    {
      name: "Fundos",
      icon: <GanttChartSquare className="w-5 h-5" />,
      items: [
        { name: "Multimercados", description: "Mix de renda fixa e variável" },
        { name: "Fundos de Ações", description: "Focados em papéis da Bolsa" },
        { name: "Fundos Imobiliários", description: "Investimento indireto em imóveis" }
      ]
    },
    {
      name: "Previdência",
      icon: <LineChart className="w-5 h-5" />,
      items: [
        { name: "PGBL", description: "Plano com dedução no IR" },
        { name: "VGBL", description: "Plano sem dedução no IR" }
      ]
    },
    {
      name: "Imóveis",
      icon: <Building className="w-5 h-5" />,
      items: [
        { name: "Aluguel", description: "Imóveis para renda mensal" },
        { name: "Revenda", description: "Compra e venda com valorização" }
      ]
    },
    {
      name: "Moedas",
      icon: <DollarSign className="w-5 h-5" />,
      items: [
        { name: "Dólar", description: "Proteção cambial em USD" },
        { name: "Euro", description: "Proteção cambial em EUR" },
        { name: "Outras Moedas", description: "Diversificação em outras moedas" }
      ]
    }
  ];

  const toggleCategory = (categoryName: string) => {
    setOpenCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <div className="bg-gray-200 dark:bg-navy-800 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Investimentos</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Ações rápidas</p>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Adicionar Investimento */}
        <button className="flex flex-col items-center justify-center gap-3 p-4 bg-gray-300/50 dark:bg-navy-700/50 rounded-lg hover:bg-gray-300 dark:hover:bg-navy-600 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
            <Plus className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Adicionar</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Novo investimento</p>
          </div>
        </button>

        {/* Rebalancear */}
        <button className="flex flex-col items-center justify-center gap-3 p-4 bg-gray-300/50 dark:bg-navy-700/50 rounded-lg hover:bg-gray-300 dark:hover:bg-navy-600 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Rebalancear</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Ajustar carteira</p>
          </div>
        </button>

        {/* Relatórios */}
        <button className="flex flex-col items-center justify-center gap-3 p-4 bg-gray-300/50 dark:bg-navy-700/50 rounded-lg hover:bg-gray-300 dark:hover:bg-navy-600 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Relatórios</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Ver análises</p>
          </div>
        </button>

        {/* Configurações */}
        <button className="flex flex-col items-center justify-center gap-3 p-4 bg-gray-300/50 dark:bg-navy-700/50 rounded-lg hover:bg-gray-300 dark:hover:bg-navy-600 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Settings className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Configurações</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Personalizar</p>
          </div>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 pt-6 border-t border-gray-300 dark:border-navy-700">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Atividade Recente</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Compra PETR4</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Hoje, 14:30</p>
              </div>
            </div>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">+R$ 1.500</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Rebalanceamento</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Ontem, 16:45</p>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate ml-2">Concluído</span>
          </div>
        </div>
      </div>

      {/* Investment Categories */}
      <div className="mt-6 pt-6 border-t border-gray-300 dark:border-navy-700">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Categorias de Investimento</h4>
        <div className="space-y-1">
          {investments.map((category) => (
            <div key={category.name} className="text-gray-300">
              <button
                onClick={() => toggleCategory(category.name)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-navy-800 transition-colors rounded-lg"
              >
                {category.icon}
                <span className="flex-1 text-left">{category.name}</span>
                {openCategories.includes(category.name) ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {openCategories.includes(category.name) && (
                <div className="mt-1 ml-4 pl-4 border-l border-navy-700">
                  {category.items.map((item) => (
                    <button
                      key={item.name}
                      className="w-full flex items-center px-3 py-2 text-sm hover:bg-navy-800 transition-colors rounded-lg group"
                    >
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                          {item.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
