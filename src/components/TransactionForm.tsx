import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, CreditCard, Wallet, Tag } from 'lucide-react';

export interface TransactionFormData {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  payment_method: string;
  notes?: string;
}

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => void;
  onClose: () => void;
  initialData?: TransactionFormData;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, onClose, initialData }) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    description: '',
    amount: 0,
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
    payment_method: 'pix',
    notes: ''
  });

  // Exemplos de descrições para cada tipo
  const descriptionExamples = {
    income: 'Ex: Salário Janeiro/2024 - Empresa XYZ',
    expense: 'Ex: Compras Supermercado - Mês Janeiro'
  };

  // Categorias predefinidas
  const categories = {
    income: [
      'Salário',
      'Freelancer',
      'Investimentos',
      'Vendas',
      'Outros'
    ],
    expense: [
      'Alimentação',
      'Moradia',
      'Transporte',
      'Saúde',
      'Educação',
      'Lazer',
      'Vestuário',
      'Outros'
    ]
  };

  const paymentMethods = [
    { value: 'pix', label: 'PIX' },
    { value: 'credit_card', label: 'Cartão de Crédito' },
    { value: 'debit_card', label: 'Cartão de Débito' },
    { value: 'bank_transfer', label: 'Transferência Bancária' },
    { value: 'money', label: 'Dinheiro' },
    { value: 'other', label: 'Outro' }
  ];

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-navy-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Cabeçalho */}
        <div className="p-4 border-b dark:border-navy-600 bg-gradient-to-r from-blue-500 to-cyan-500">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-white">
                {initialData ? 'Editar Transação' : 'Nova Transação'}
              </h2>
              <p className="text-sm text-blue-100">
                {initialData ? 'Atualize as informações da transação' : 'Preencha as informações da nova transação'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <form onSubmit={handleSubmit} className="divide-y dark:divide-navy-600">
            {/* Tipo de Transação */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Tipo de Transação
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    formData.type === 'income'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 dark:bg-navy-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-600'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  Receita
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    formData.type === 'expense'
                      ? 'bg-rose-500 text-white'
                      : 'bg-gray-100 dark:bg-navy-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-600'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  Despesa
                </button>
              </div>
            </div>

            {/* Informações Básicas */}
            <div className="p-4 space-y-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Informações Básicas
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={descriptionExamples[formData.type]}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-navy-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valor
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">R$</span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    step="0.01"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-navy-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Data
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-navy-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Categoria
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-navy-700 dark:text-white appearance-none"
                    >
                      <option value="">Selecione...</option>
                      {categories[formData.type].map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Forma de Pagamento
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                    <select
                      name="payment_method"
                      value={formData.payment_method}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-navy-700 dark:text-white appearance-none"
                    >
                      {paymentMethods.map(method => (
                        <option key={method.value} value={method.value}>{method.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-navy-700 dark:text-white appearance-none"
                    >
                      <option value="pending">Pendente</option>
                      <option value="completed">Concluída</option>
                      <option value="cancelled">Cancelada</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Observações (opcional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Adicione notas ou observações sobre a transação..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-navy-700 dark:text-white resize-none"
                />
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="p-4 bg-gray-50 dark:bg-navy-900">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                >
                  {initialData ? 'Atualizar' : 'Adicionar'} Transação
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
