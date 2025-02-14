export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  description: string;
}

export interface FinancialMetrics {
  balance: number;
  income: number;
  expenses: number;
  investments: {
    target: number;
    current: number;
  };
}

export interface BankAccount {
  bank: string;
  balance: number;
}