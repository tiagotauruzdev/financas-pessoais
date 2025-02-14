import { LayoutDashboard, Receipt, Trophy, Settings, Wallet2, BanknoteIcon, TrendingUp, Calculator, Menu, X, Sun, Moon, LogOut } from 'lucide-react';
import NotificationBell from './Notifications/NotificationBell';
import { ThemeSwitcher } from './ThemeSwitcher';
import LevelBadge from './Achievements/LevelBadge';
import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onCalculatorClick: () => void;
}

export default function Header({ onCalculatorClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile, loading } = useUser();
  const { signOut } = useAuth();

  const userProgress = {
    level: userProfile?.level || 1,
    currentXP: userProfile?.xp || 0,
    nextLevelXP: ((userProfile?.level || 1) + 1) * 1000,
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <header className="sticky top-0 z-30 w-full border-b border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900">
        <div className="flex items-center justify-center h-16">
          <div className="animate-pulse flex space-x-4">
            <div className="h-6 w-32 bg-gray-200 dark:bg-navy-800 rounded"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Gestão Financeira
          </h1>
          <LevelBadge userProgress={userProgress} />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onCalculatorClick}
            className="p-2 hover:bg-gray-100 dark:hover:bg-navy-800 rounded-lg transition-colors"
            title="Calculadora"
          >
            <Calculator className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>
          
          <ThemeSwitcher />
          <NotificationBell />

          <div className="flex items-center gap-3 pl-2 border-l border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {userProfile?.name || 'Usuário'}
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {getCurrentDate()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <img
                  src={userProfile?.avatar_url || 'https://via.placeholder.com/40'}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full ring-2 ring-gray-200 dark:ring-navy-600"
                />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white dark:ring-navy-900"></div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-800 rounded-lg transition-colors"
                title="Sair da conta"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex flex-col">
          {/* Primeira linha: Menu e Título */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-800"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-base font-bold text-gray-900 dark:text-white">
              Gestão Financeira
            </h1>
          </div>

          {/* Segunda linha: Data e Perfil */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-navy-800/80">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {userProfile?.name || 'Usuário'}
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {getCurrentDate()}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <NotificationBell />
              <div className="flex items-center gap-2">
                <div className="relative">
                  <img
                    src={userProfile?.avatar_url || 'https://via.placeholder.com/40'}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full ring-2 ring-gray-200 dark:ring-navy-600"
                  />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white dark:ring-navy-900"></div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-800 rounded-lg transition-colors"
                  title="Sair da conta"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="sr-only md:not-sr-only">Sair</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}