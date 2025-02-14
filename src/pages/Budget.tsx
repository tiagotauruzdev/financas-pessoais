import React, { useState, useEffect } from 'react';
import { PieChart, DollarSign, TrendingUp, AlertCircle, Plus } from 'lucide-react';
import { budgetService } from '@/services/budget.service';
import toast from 'react-hot-toast';
import BudgetForm, { BudgetFormData } from '@/components/BudgetForm';

interface BudgetCategory {
  id: string;
  name: string;
  planned: number;
  actual: number;
  color: string;
}

const Budget = () => {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBudget, setEditingBudget] = useState<BudgetCategory | null>(null);

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      const data = await budgetService.getBudgets();
      setCategories(data);
      setError(null);
    } catch (error) {
      console.error('Error loading budgets:', error);
      setError('Erro ao carregar orçamentos');
      toast.error('Erro ao carregar orçamentos');
    } finally {
      setLoading(false);
    }
  };

  const totalPlanned = categories.reduce((sum, cat) => sum + cat.planned, 0);
  const totalActual = categories.reduce((sum, cat) => sum + cat.actual, 0);
  const remainingBudget = totalPlanned - totalActual;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const calculateProgress = (actual: number, planned: number) => {
    if (planned === 0) return 0;
    return (actual / planned) * 100;
  };

  const handleSubmit = async (data: BudgetFormData) => {
    try {
      if (editingBudget) {
        await budgetService.updateBudget(editingBudget.id, data);
        toast.success('Orçamento atualizado com sucesso!');
      } else {
        await budgetService.createBudget(data);
        toast.success('Orçamento criado com sucesso!');
      }
      setIsFormOpen(false);
      setEditingBudget(null);
      loadBudgets();
    } catch (err) {
      console.error('Error handling budget:', err);
      toast.error(editingBudget ? 'Erro ao atualizar orçamento' : 'Erro ao criar orçamento');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <AlertCircle className="h-5 w-5 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Orçamento Mensal
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Acompanhe e gerencie seus gastos mensais
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-navy-900 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Orçamento Total
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {formatCurrency(totalPlanned)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Planejado para este mês
          </div>
        </div>

        <div className="bg-white dark:bg-navy-900 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Gastos Atuais
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {formatCurrency(totalActual)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total gasto até agora
          </div>
        </div>

        <div className="bg-white dark:bg-navy-900 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
              <PieChart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Saldo Restante
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {formatCurrency(remainingBudget)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Disponível para gastar
          </div>
        </div>
      </div>

      {/* Lista de Categorias */}
      <div className="bg-white dark:bg-navy-900 rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Categorias de Gastos
            </h2>
            <button
              onClick={() => {
                setEditingBudget(null);
                setIsFormOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white 
                       bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 
                       rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              Nova Categoria
            </button>
          </div>

          <div className="space-y-4">
            {categories.map((category) => {
              const progress = calculateProgress(category.actual, category.planned);
              const isOverBudget = category.actual > category.planned;

              return (
                <div key={category.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {category.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatCurrency(category.actual)}
                      </span>
                      <span className="text-sm text-gray-400 dark:text-gray-500">
                        / {formatCurrency(category.planned)}
                      </span>
                      {isOverBudget && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                      <button
                        onClick={() => {
                          setEditingBudget(category);
                          setIsFormOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 
                                 dark:hover:text-blue-300 text-sm"
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                      <div
                        style={{ width: `${Math.min(progress, 100)}%` }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                          isOverBudget ? 'bg-red-500' : category.color
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isFormOpen && (
        <BudgetForm
          onSubmit={handleSubmit}
          onClose={() => {
            setIsFormOpen(false);
            setEditingBudget(null);
          }}
          initialData={editingBudget || undefined}
        />
      )}
    </div>
  );
};

export default Budget;
