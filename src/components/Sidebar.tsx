import React, { useState, useEffect } from 'react';
import { Home, Wallet, Receipt, Settings, ChevronRight, Calendar, DollarSign, ChevronDown, TrendingUp, TrendingDown, Bitcoin, Menu, X, Trophy, LayoutDashboard, Wallet2, BanknoteIcon, Baby } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import InvestmentMenu from './InvestmentMenu';
import NewsFeed from './NewsFeed/NewsFeed';

interface SidebarProps {
  currentView: 'dashboard' | 'investments' | 'achievements' | 'transactions' | 'settings';
  onViewChange: (view: 'dashboard' | 'investments' | 'achievements' | 'transactions' | 'settings') => void;
}

interface Income {
  source: string;
  amount: number;
  date: string;
  recurrent: boolean;
}

interface ExchangeRate {
  code: string;
  name: string;
  rate: number;
  change: number;
  icon?: React.ReactNode;
}

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [showIncomes, setShowIncomes] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([
    { 
      code: 'BTC', 
      name: 'Bitcoin', 
      rate: 251832.42, 
      change: 2.35,
      icon: <Bitcoin className="w-4 h-4 text-orange-500" />
    },
    { 
      code: 'USD', 
      name: 'Dólar', 
      rate: 4.92, 
      change: 0.15,
      icon: <DollarSign className="w-4 h-4 text-green-500" />
    },
    { 
      code: 'EUR', 
      name: 'Euro', 
      rate: 5.38, 
      change: -0.22,
      icon: <span className="text-blue-500 font-bold text-sm">€</span>
    },
  ]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Buscar cotações
  useEffect(() => {
    const fetchRates = async () => {
      try {
        // Bitcoin da Binance
        const btcResponse = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCBRL');
        const btcData = await btcResponse.json();
        
        // Dólar e Euro da Awesomeapi
        const fiatResponse = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL');
        const fiatData = await fiatResponse.json();

        setExchangeRates(prev => prev.map(rate => {
          if (rate.code === 'BTC') {
            return {
              ...rate,
              rate: parseFloat(btcData.lastPrice),
              change: parseFloat(btcData.priceChangePercent)
            };
          }
          if (rate.code === 'USD') {
            return {
              ...rate,
              rate: parseFloat(fiatData.USDBRL.bid),
              change: parseFloat(fiatData.USDBRL.pctChange)
            };
          }
          if (rate.code === 'EUR') {
            return {
              ...rate,
              rate: parseFloat(fiatData.EURBRL.bid),
              change: parseFloat(fiatData.EURBRL.pctChange)
            };
          }
          return rate;
        }));
      } catch (error) {
        console.error('Erro ao buscar cotações:', error);
      }
    };

    // Buscar cotações iniciais
    fetchRates();

    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchRates, 30000);

    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/'
    },
    {
      icon: Receipt,
      label: 'Lançamentos',
      path: '/lancamentos'
    },
    {
      icon: TrendingUp,
      label: 'Investimentos',
      path: '/investimentos'
    },
    {
      icon: Wallet2,
      label: 'Orçamento',
      path: '/orcamento'
    },
    {
      icon: Baby,
      label: 'Família',
      path: '/familia'
    },
    {
      icon: BanknoteIcon,
      label: 'Dívidas',
      path: '/dividas'
    },
    {
      icon: Trophy,
      label: 'Conquistas',
      path: '/conquistas'
    },
    {
      icon: Settings,
      label: 'Configurações',
      path: '/configuracoes'
    }
  ];

  const formatCurrency = (value: number, isBTC: boolean = false) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: isBTC ? 2 : 2,
      maximumFractionDigits: isBTC ? 2 : 2,
    }).format(value);
  };

  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-navy-800 text-white hover:bg-navy-700 transition-colors"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-screen z-40
        lg:sticky lg:block lg:h-screen
        ${isMobileMenuOpen ? 'block' : 'hidden'}
        w-64 bg-white dark:bg-navy-900 border-r border-gray-200 dark:border-navy-700
        flex flex-col overflow-hidden
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex-1 h-full overflow-y-auto custom-scrollbar">
          {/* Menu Principal */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={`
                    flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg
                    ${isActive
                      ? 'bg-cyan-50 text-cyan-600 dark:bg-navy-800 dark:text-cyan-400'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-navy-800'
                    }
                    transition-colors duration-150 ease-in-out
                  `}
                >
                  <Icon size={20} className="mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Logo */}
          <div className="px-6 py-4 border-t border-b border-gray-200 dark:border-navy-700">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Finanças</h1>
          </div>

          {/* Cotações */}
          <div className="px-4 mb-4">
            <div className="bg-gray-100 dark:bg-navy-800 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Cotações</span>
              </div>
              <div className="space-y-2">
                {exchangeRates.map((currency) => (
                  <div
                    key={currency.code}
                    className="flex items-center justify-between bg-white/50 dark:bg-navy-700/50 rounded-lg p-2"
                  >
                    <div className="flex items-center gap-2">
                      {currency.icon}
                      <div>
                        <div className="text-sm text-gray-900 dark:text-white">{currency.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{currency.code}/BRL</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(currency.rate, currency.code === 'BTC')}
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        {currency.change >= 0 ? (
                          <>
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="text-green-500">
                              +{currency.change.toFixed(2)}%
                            </span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-3 h-3 text-red-500" />
                            <span className="text-red-500">
                              {currency.change.toFixed(2)}%
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filtro de Data */}
          <div className="px-4 mb-4">
            <div className="bg-gray-100 dark:bg-navy-800 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Filtrar por Data</span>
              </div>
              <input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="w-full bg-white dark:bg-navy-700 text-gray-900 dark:text-white text-sm rounded-md px-2 py-1 border border-gray-300 dark:border-navy-600 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Minhas Rendas */}
          <div className="px-4 mb-4">
            <button
              onClick={() => setShowIncomes(!showIncomes)}
              className="w-full bg-gray-100 dark:bg-navy-800 rounded-lg p-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-cyan-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Minhas Rendas</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
                    showIncomes ? 'transform rotate-180' : ''
                  }`}
                />
              </div>
            </button>
            
            {showIncomes && (
              <div className="mt-2 space-y-2 pl-2">
                {/* Dados de exemplo de rendas */}
                <div
                  className="bg-gray-100/50 dark:bg-navy-800/50 rounded-lg p-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-900 dark:text-white">Salário</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        2024-01-05
                        <span className="ml-1 text-cyan-500 dark:text-cyan-400">• Recorrente</span>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
                      {formatCurrency(5000)}
                    </div>
                  </div>
                </div>
                <div
                  className="bg-gray-100/50 dark:bg-navy-800/50 rounded-lg p-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-900 dark:text-white">Freelance</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        2024-01-15
                      </div>
                    </div>
                    <div className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
                      {formatCurrency(2000)}
                    </div>
                  </div>
                </div>
                <div
                  className="bg-gray-100/50 dark:bg-navy-800/50 rounded-lg p-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-900 dark:text-white">Aluguel</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        2024-01-10
                        <span className="ml-1 text-cyan-500 dark:text-cyan-400">• Recorrente</span>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
                      {formatCurrency(1500)}
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-navy-700 mt-2 pt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Total:</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {formatCurrency(8500)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notícias */}
          <div className="mt-8 mb-16">
            <NewsFeed />
          </div>

          {/* Footer com versão */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>v1.0.0</span>
              <span>Beta</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
