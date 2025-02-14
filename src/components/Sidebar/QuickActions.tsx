import { Plus, FileText, PieChart, TrendingUp } from 'lucide-react';

const actions = [
  { icon: Plus, label: 'Nova Transação' },
  { icon: FileText, label: 'Relatórios' },
  { icon: PieChart, label: 'Orçamentos' },
  { icon: TrendingUp, label: 'Investimentos' }
];

export default function QuickActions() {
  return (
    <div className="bg-gray-200 dark:bg-navy-800 rounded-xl p-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Ações Rápidas</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              className="flex flex-col items-center gap-2 p-3
                       bg-gray-300/50 dark:bg-navy-700 rounded-lg 
                       hover:bg-gray-300 dark:hover:bg-navy-600
                       transition-colors"
            >
              <Icon size={20} className="text-cyan-600 dark:text-cyan-400" />
              <span className="text-gray-900 dark:text-white text-sm">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}