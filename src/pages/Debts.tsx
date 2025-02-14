import React, { useState, useEffect } from 'react';
import { CreditCard, TrendingDown, DollarSign, Calendar, Plus, Edit2, Trash2, CreditCardIcon, HomeIcon, Car, Briefcase, AlertCircle } from 'lucide-react';
import DebtForm, { DebtFormData } from '../components/DebtForm';
import { debtsService, Debt } from '../services/debtsService';
import { toast } from 'react-hot-toast';
import CreditCardsList from '../components/CreditCardsList';

const Debts = () => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = async () => {
    try {
      setIsLoading(true);
      const debtsData = await debtsService.getAllDebts();
      setDebts(debtsData);
    } catch (error) {
      console.error('Error loading debts:', error);
      toast.error('Erro ao carregar as dívidas');
    } finally {
      setIsLoading(false);
    }
  };

  const totalDebt = debts.reduce((sum, debt) => sum + debt.remaining_amount, 0);
  const averageInterestRate = debts.length > 0
    ? debts.reduce((sum, debt) => sum + debt.interest_rate, 0) / debts.length
    : 0;
  const nextPaymentDate = debts.length > 0
    ? new Date(Math.min(...debts.map(debt => new Date(debt.due_date).getTime())))
    : new Date();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getProgressColor = (progress: number) => {
    if (progress <= 30) return 'bg-green-500';
    if (progress <= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const calculateProgress = (remaining: number, total: number) => {
    return (remaining / total) * 100;
  };

  const handleAddDebt = async (formData: DebtFormData) => {
    try {
      const newDebt = await debtsService.createDebt({
        name: formData.name,
        category: formData.type,
        amount: formData.totalAmount,
        remaining_amount: formData.remainingAmount,
        interest_rate: formData.interestRate,
        due_date: formData.nextPayment,
        payment_day: new Date(formData.nextPayment).getDate(),
        status: formData.status || 'active',
        priority: formData.priority || 'medium',
        card_last_digits: formData.type === 'credit_card' ? formData.cardLastDigits : undefined,
        card_color: formData.type === 'credit_card' ? formData.cardColor : undefined,
        card_brand: formData.type === 'credit_card' ? formData.cardBrand : undefined
      });
      setDebts([newDebt, ...debts]);
      setShowForm(false);
      toast.success('Dívida adicionada com sucesso!');
    } catch (error) {
      console.error('Error adding debt:', error);
      toast.error('Erro ao adicionar dívida');
    }
  };

  const handleEditDebt = async (formData: DebtFormData) => {
    if (!editingDebt) return;

    try {
      const updatedDebt = await debtsService.updateDebt(editingDebt.id, {
        name: formData.name,
        amount: formData.totalAmount,
        remaining_amount: formData.remainingAmount,
        interest_rate: formData.interestRate,
        due_date: formData.nextPayment,
        payment_day: new Date(formData.nextPayment).getDate(),
        category: formData.type,
        status: formData.status || editingDebt.status,
        priority: formData.priority || editingDebt.priority,
        card_last_digits: formData.type === 'credit_card' ? formData.cardLastDigits : undefined,
        card_color: formData.type === 'credit_card' ? formData.cardColor : undefined,
        card_brand: formData.type === 'credit_card' ? formData.cardBrand : undefined
      });

      setDebts(debts.map(debt => 
        debt.id === editingDebt.id ? updatedDebt : debt
      ));
      setEditingDebt(null);
      toast.success('Dívida atualizada com sucesso!');
    } catch (error) {
      console.error('Error updating debt:', error);
      toast.error('Erro ao atualizar dívida');
    }
  };

  const handleDeleteDebt = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta dívida?')) return;

    try {
      await debtsService.deleteDebt(id);
      setDebts(debts.filter(debt => debt.id !== id));
      toast.success('Dívida excluída com sucesso!');
    } catch (error) {
      console.error('Error deleting debt:', error);
      toast.error('Erro ao excluir dívida');
    }
  };

  const handleUpdateStatus = async (id: string, status: Debt['status']) => {
    try {
      const updatedDebt = await debtsService.updateDebtStatus(id, status);
      setDebts(debts.map(debt => 
        debt.id === id ? updatedDebt : debt
      ));
      toast.success('Status atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating debt status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const getDebtTypeIcon = (category: string) => {
    switch (category) {
      case 'credit_card':
        return <CreditCardIcon className="h-6 w-6" />;
      case 'financing':
        return <Car className="h-6 w-6" />;
      case 'loan':
        return <Briefcase className="h-6 w-6" />;
      default:
        return <DollarSign className="h-6 w-6" />;
    }
  };

  const filteredDebts = selectedType === 'all' 
    ? debts 
    : debts.filter(debt => debt.category === selectedType);

  const debtTypes = [
    { id: 'all', name: 'Todas', icon: <DollarSign className="h-5 w-5" /> },
    { id: 'credit_card', name: 'Cartões', icon: <CreditCardIcon className="h-5 w-5" /> },
    { id: 'financing', name: 'Financiamentos', icon: <Car className="h-5 w-5" /> },
    { id: 'loan', name: 'Empréstimos', icon: <Briefcase className="h-5 w-5" /> },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestão de Dívidas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Acompanhe e gerencie suas dívidas e cartões de crédito
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Adicionar Dívida
        </button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Dívida Total
            </h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalDebt)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Valor total a pagar
          </p>
        </div>

        <div className="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <TrendingDown className="w-6 h-6 text-yellow-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Taxa Média de Juros
            </h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {averageInterestRate.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Média entre todas as dívidas
          </p>
        </div>

        <div className="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Próximo Pagamento
            </h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatDate(nextPaymentDate.toISOString())}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Data do próximo vencimento
          </p>
        </div>
      </div>

      {/* Lista de Cartões de Crédito */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Cartões de Crédito
        </h2>
        <CreditCardsList debts={debts} />
      </div>

      {/* Filtros de Tipo */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {debtTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                selectedType === type.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-navy-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-700'
              }`}
            >
              {type.icon}
              <span className="ml-2">{type.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Dívidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDebts.map((debt) => {
          const progress = calculateProgress(debt.remaining_amount, debt.amount);
          const progressColor = getProgressColor(progress);

          return (
            <div
              key={debt.id}
              className="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-sm"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${
                    debt.category === 'credit_card' ? 'bg-purple-500/10' :
                    debt.category === 'financing' ? 'bg-green-500/10' :
                    debt.category === 'loan' ? 'bg-blue-500/10' :
                    'bg-gray-500/10'
                  }`}>
                    <div className={
                      debt.category === 'credit_card' ? 'text-purple-500' :
                      debt.category === 'financing' ? 'text-green-500' :
                      debt.category === 'loan' ? 'text-blue-500' :
                      'text-gray-500'
                    }>
                      {getDebtTypeIcon(debt.category)}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {debt.name}
                      </h3>
                      {debt.priority === 'high' && (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                          Alta Prioridade
                        </span>
                      )}
                    </div>
                    <div className="mt-1 space-y-1">
                      {debt.category === 'credit_card' && debt.card_last_digits && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          Final {debt.card_last_digits} • {debt.card_brand}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Vencimento: {formatDate(debt.due_date)}
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          debt.status === 'active' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                          debt.status === 'paid' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                          'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {debt.status === 'active' ? 'Ativa' :
                           debt.status === 'paid' ? 'Paga' : 'Em Atraso'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          debt.priority === 'low' ? 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400' :
                          debt.priority === 'medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          Prioridade {
                            debt.priority === 'low' ? 'Baixa' :
                            debt.priority === 'medium' ? 'Média' : 'Alta'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingDebt(debt)}
                    className="p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteDebt(debt.id)}
                    className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-500 transition-colors duration-200"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Valor Restante</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(debt.remaining_amount)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Valor Total</p>
                    <p className="text-lg text-gray-700 dark:text-gray-300">
                      {formatCurrency(debt.amount)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Taxa de Juros: {debt.interest_rate}%
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {progress.toFixed(1)}% restante
                    </span>
                  </div>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200 dark:bg-navy-700">
                      <div
                        style={{ width: `${progress}%` }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${progressColor}`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Formulário */}
      {(showForm || editingDebt) && (
        <DebtForm
          onSubmit={editingDebt ? handleEditDebt : handleAddDebt}
          onClose={() => {
            setShowForm(false);
            setEditingDebt(null);
          }}
          initialData={editingDebt ? {
            name: editingDebt.name,
            totalAmount: editingDebt.amount,
            remainingAmount: editingDebt.remaining_amount,
            interestRate: editingDebt.interest_rate,
            nextPayment: editingDebt.due_date,
            type: editingDebt.category,
            status: editingDebt.status,
            priority: editingDebt.priority,
            cardLastDigits: editingDebt.card_last_digits,
            cardColor: editingDebt.card_color,
            cardBrand: editingDebt.card_brand
          } : undefined}
        />
      )}
    </div>
  );
};

export default Debts;
