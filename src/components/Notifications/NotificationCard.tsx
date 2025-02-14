import React from 'react';

interface Bill {
  id: number;
  title: string;
  amount: number;
  dueDate: string;
  daysLeft: number;
  category: string;
  status: 'pending' | 'overdue' | 'upcoming';
}

export default function NotificationCard() {
  // Dados de exemplo
  const upcomingBills: Bill[] = [
    {
      id: 1,
      title: "Conta de Luz",
      amount: 250,
      dueDate: "2024-01-15",
      daysLeft: 2,
      category: "Utilidades",
      status: "upcoming"
    },
    {
      id: 2,
      title: "Internet",
      amount: 120,
      dueDate: "2024-01-18",
      daysLeft: 5,
      category: "Serviços",
      status: "upcoming"
    },
    {
      id: 3,
      title: "Cartão de Crédito",
      amount: 1500,
      dueDate: "2024-01-20",
      daysLeft: 7,
      category: "Financeiro",
      status: "upcoming"
    },
    {
      id: 4,
      title: "Aluguel",
      amount: 2000,
      dueDate: "2024-01-10",
      daysLeft: 0,
      category: "Moradia",
      status: "overdue"
    }
  ];

  // Formata valor em reais
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Retorna a cor baseada no status
  const getStatusColor = (daysLeft: number) => {
    if (daysLeft <= 0) return 'bg-red-500/10 text-red-500';
    if (daysLeft <= 3) return 'bg-yellow-500/10 text-yellow-500';
    return 'bg-blue-500/10 text-blue-500';
  };

  // Calcula o total das contas
  const totalAmount = upcomingBills.reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="bg-gray-200 dark:bg-navy-800 rounded-xl p-6 text-gray-900 dark:text-white transform hover:scale-102 transition-all duration-300 hover:shadow-lg animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Contas a Vencer</h3>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Total: <span className="text-gray-900 dark:text-white font-medium">{formatCurrency(totalAmount)}</span>
        </span>
      </div>

      <div className="space-y-4">
        {upcomingBills.map((bill, index) => (
          <div
            key={bill.id}
            className="bg-gray-300/50 dark:bg-navy-700/50 rounded-lg p-4 hover:bg-gray-400/20 dark:hover:bg-navy-600/50 transition-all duration-300 transform hover:scale-102 hover:shadow-md"
            style={{
              animationDelay: `${index * 150}ms`,
              animation: 'fade-in-up 0.5s ease-out forwards'
            }}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">{bill.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{bill.category}</p>
              </div>
              <span className="font-medium">{formatCurrency(bill.amount)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(bill.dueDate).toLocaleDateString('pt-BR')}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(bill.daysLeft)}`}>
                  {bill.daysLeft <= 0
                    ? 'Vencida'
                    : `${bill.daysLeft} ${bill.daysLeft === 1 ? 'dia' : 'dias'}`}
                </span>
              </div>
              <button className="text-sm text-cyan-400 dark:text-cyan-300 hover:text-cyan-300 dark:hover:text-cyan-400 transition-colors">
                Pagar
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-sm text-center text-cyan-400 dark:text-cyan-300 hover:text-cyan-300 dark:hover:text-cyan-400 transition-all duration-300 border border-gray-400 dark:border-navy-700 rounded-lg hover:bg-gray-400/20 dark:hover:bg-navy-600/50 transform hover:scale-102">
        Ver todas as contas
      </button>
    </div>
  );
}
