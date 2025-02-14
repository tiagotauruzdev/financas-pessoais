import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  Plus, 
  Filter, 
  Download,
  TrendingUp,
  TrendingDown,
  Search,
  ChevronDown,
  Calendar,
  Tag,
  ArrowUpRight,
  ArrowDownRight,
  Edit2,
  Trash2,
  X
} from 'lucide-react';
import { transactionService, Transaction } from '../services/transaction.service';
import { toast } from 'react-toastify';
import TransactionForm, { TransactionFormData } from '../components/TransactionForm';

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    description: '',
    amount: 0,
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
    payment_method: 'pix'
  });
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      const data = await transactionService.getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      toast.error('Erro ao carregar transações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowEditModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta transação?')) return;

    try {
      await transactionService.deleteTransaction(id);
      toast.success('Transação excluída com sucesso');
      loadTransactions();
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      toast.error('Erro ao excluir transação');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTransaction) return;

    try {
      await transactionService.updateTransaction(editingTransaction.id, editingTransaction);
      toast.success('Transação atualizada com sucesso');
      setShowEditModal(false);
      loadTransactions();
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      toast.error('Erro ao atualizar transação');
    }
  };

  const handleAddTransaction = async (formData: TransactionFormData) => {
    try {
      await transactionService.createTransaction(formData);
      setShowNewModal(false);
      toast.success('Transação adicionada com sucesso');
      loadTransactions();
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      toast.error('Erro ao adicionar transação');
    }
  };

  const categories = [...new Set(transactions.map(t => t.category))];

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || transaction.category === selectedCategory;
    const matchesType = selectedType === 'all' || transaction.type === selectedType;
    
    if (selectedPeriod === 'all') return matchesSearch && matchesCategory && matchesType;
    
    const transactionDate = new Date(transaction.date);
    const today = new Date();
    
    switch (selectedPeriod) {
      case 'today':
        return (
          transactionDate.toDateString() === today.toDateString() &&
          matchesSearch &&
          matchesCategory &&
          matchesType
        );
      case 'week':
        const weekAgo = new Date(today.setDate(today.getDate() - 7));
        return (
          transactionDate >= weekAgo &&
          matchesSearch &&
          matchesCategory &&
          matchesType
        );
      case 'month':
        return (
          transactionDate.getMonth() === today.getMonth() &&
          transactionDate.getFullYear() === today.getFullYear() &&
          matchesSearch &&
          matchesCategory &&
          matchesType
        );
      default:
        return matchesSearch && matchesCategory && matchesType;
    }
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Transações
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gerencie suas receitas e despesas
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Receitas
            </h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalIncome)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Total de entradas
          </p>
        </div>

        <div className="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Despesas
            </h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalExpenses)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Total de saídas
          </p>
        </div>

        <div className="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Receipt className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Saldo
            </h3>
          </div>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatCurrency(balance)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Balanço do período
          </p>
        </div>
      </div>

      {/* Actions and Filters */}
      <div className="bg-white dark:bg-navy-800 rounded-lg shadow-sm mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-navy-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar transações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-navy-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => setShowNewModal(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Nova Transação
              </button>
              
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as 'all' | 'income' | 'expense')}
                className="px-4 py-2 bg-gray-100 dark:bg-navy-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                <option value="all">Todos os tipos</option>
                <option value="income">Receitas</option>
                <option value="expense">Despesas</option>
              </select>

              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 bg-gray-100 dark:bg-navy-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                <option value="all">Todo período</option>
                <option value="today">Hoje</option>
                <option value="week">Última semana</option>
                <option value="month">Este mês</option>
              </select>

              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="px-4 py-2 bg-gray-100 dark:bg-navy-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
                <option value="">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-navy-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-navy-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-navy-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-navy-700 text-gray-800 dark:text-gray-200">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {transaction.status === 'completed' ? 'Concluído' :
                       transaction.status === 'pending' ? 'Pendente' : 'Agendado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Edição */}
      {showEditModal && editingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-navy-800 rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Editar Transação
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Descrição
                </label>
                <input
                  type="text"
                  value={editingTransaction.description}
                  onChange={(e) => setEditingTransaction({
                    ...editingTransaction,
                    description: e.target.value
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-navy-900 dark:text-white sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Valor
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editingTransaction.amount}
                  onChange={(e) => setEditingTransaction({
                    ...editingTransaction,
                    amount: parseFloat(e.target.value)
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-navy-900 dark:text-white sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data
                </label>
                <input
                  type="date"
                  value={editingTransaction.date}
                  onChange={(e) => setEditingTransaction({
                    ...editingTransaction,
                    date: e.target.value
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-navy-900 dark:text-white sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Categoria
                </label>
                <div className="flex gap-2">
                  <select
                    value={editingTransaction.category}
                    onChange={(e) => setEditingTransaction({
                      ...editingTransaction,
                      category: e.target.value
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-navy-900 dark:text-white sm:text-sm"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.sort().map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <select
                  value={editingTransaction.status}
                  onChange={(e) => setEditingTransaction({
                    ...editingTransaction,
                    status: e.target.value as any
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-navy-900 dark:text-white sm:text-sm"
                >
                  <option value="completed">Concluído</option>
                  <option value="pending">Pendente</option>
                  <option value="scheduled">Agendado</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-navy-900 hover:bg-gray-50 dark:hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Nova Transação */}
      {showNewModal && (
        <TransactionForm
          onSubmit={handleAddTransaction}
          onClose={() => setShowNewModal(false)}
        />
      )}
    </div>
  );
}
