import React, { useState } from 'react';

interface Notification {
  id: number;
  title: string;
  amount: number;
  dueDate: string;
  daysLeft: number;
  type: 'warning' | 'danger' | 'info';
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);

  // Dados de exemplo para notificações
  const notifications: Notification[] = [
    {
      id: 1,
      title: "Conta de Luz",
      amount: 250,
      dueDate: "2024-01-15",
      daysLeft: 2,
      type: "danger"
    },
    {
      id: 2,
      title: "Internet",
      amount: 120,
      dueDate: "2024-01-18",
      daysLeft: 5,
      type: "warning"
    },
    {
      id: 3,
      title: "Cartão de Crédito",
      amount: 1500,
      dueDate: "2024-01-20",
      daysLeft: 7,
      type: "info"
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

  // Retorna a cor baseada no tipo de notificação
  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'danger':
        return 'text-red-600 dark:text-red-500';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-500';
      case 'info':
        return 'text-blue-600 dark:text-blue-500';
      default:
        return 'text-gray-600 dark:text-gray-500';
    }
  };

  return (
    <div className="relative">
      {/* Sino com contador */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Dropdown de notificações */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-navy-800 rounded-lg shadow-lg py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-navy-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notificações</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-navy-700/50 transition-colors border-b border-gray-200 dark:border-navy-700/50 last:border-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-gray-900 dark:text-white font-medium">{notification.title}</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Vencimento: {new Date(notification.dueDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(notification.amount)}
                  </span>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className={`text-sm ${getTypeColor(notification.type)}`}>
                    {notification.daysLeft} {notification.daysLeft === 1 ? 'dia' : 'dias'} restante{notification.daysLeft === 1 ? '' : 's'}
                  </span>
                  <button className="text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors">
                    Marcar como pago
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 py-2 border-t border-gray-200 dark:border-navy-700">
            <button className="w-full text-center text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors">
              Ver todas as notificações
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
