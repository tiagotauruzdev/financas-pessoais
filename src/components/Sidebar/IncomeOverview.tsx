import { DollarSign } from 'lucide-react';

const incomes = [
  { source: 'Salário', amount: 2500 },
  { source: 'Freelance', amount: 900 },
  { source: 'Investimentos', amount: 350 }
];

export default function IncomeOverview() {
  const total = incomes.reduce((sum, income) => sum + income.amount, 0);

  return (
    <div className="bg-gray-200 dark:bg-navy-800 rounded-xl p-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Rendas Mensais</h3>
      
      <div className="space-y-3">
        {incomes.map((income, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-300/50 dark:bg-navy-700 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <DollarSign size={16} className="text-white" />
              </div>
              <span className="text-gray-900 dark:text-white">{income.source}</span>
            </div>
            <span className="text-green-600 dark:text-green-400">
              R$ {income.amount.toLocaleString('pt-BR')}
            </span>
          </div>
        ))}
        
        <div className="pt-3 border-t border-gray-300 dark:border-navy-700">
          <div className="flex justify-between text-gray-900 dark:text-white">
            <span>Total:</span>
            <span className="font-medium">
              R$ {total.toLocaleString('pt-BR')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}