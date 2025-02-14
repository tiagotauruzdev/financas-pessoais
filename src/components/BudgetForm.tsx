import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

export interface BudgetFormData {
  name: string;
  planned: number;
  actual: number;
  color: string;
}

interface BudgetFormProps {
  onSubmit: (data: BudgetFormData) => void;
  onClose: () => void;
  initialData?: BudgetFormData;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ onSubmit, onClose, initialData }) => {
  const [formData, setFormData] = useState<BudgetFormData>(initialData || {
    name: '',
    planned: 0,
    actual: 0,
    color: 'bg-blue-500'
  });

  useEffect(() => {
    console.log('Initial Data:', initialData);
    console.log('Form Data:', formData);
  }, [initialData, formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedValue = name === 'planned' || name === 'actual' ? parseFloat(value) || 0 : value;
    
    console.log('Handling change:', { name, value, updatedValue });
    
    setFormData(prev => ({
      ...prev,
      [name]: updatedValue
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submitting form:', formData);
    
    if (!formData.name || formData.planned <= 0) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    onSubmit(formData);
  };

  const categories = [
    { value: 'Moradia', label: 'Moradia', example: 'Ex: Aluguel, Condomínio, Água, Luz' },
    { value: 'Alimentação', label: 'Alimentação', example: 'Ex: Supermercado, Restaurantes' },
    { value: 'Transporte', label: 'Transporte', example: 'Ex: Combustível, Transporte Público' },
    { value: 'Lazer', label: 'Lazer', example: 'Ex: Cinema, Viagens, Hobbies' },
    { value: 'Saúde', label: 'Saúde', example: 'Ex: Plano de Saúde, Medicamentos' },
    { value: 'Educação', label: 'Educação', example: 'Ex: Cursos, Material Escolar' },
    { value: 'Outros', label: 'Outros', example: 'Ex: Despesas Diversas' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-navy-800 rounded-xl w-full max-w-md relative">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {initialData ? 'Editar Orçamento' : 'Novo Orçamento'}
            </h2>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 
                       dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Categoria *
              </label>
              <select
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                         bg-white dark:bg-navy-900 text-gray-900 dark:text-white"
                required
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {formData.name && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {categories.find(cat => cat.value === formData.name)?.example}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Valor Planejado *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  R$
                </span>
                <input
                  type="number"
                  name="planned"
                  value={formData.planned || ''}
                  onChange={handleChange}
                  placeholder="0,00"
                  min="0"
                  step="0.01"
                  required
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                           bg-white dark:bg-navy-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                         hover:bg-gray-100 dark:hover:bg-navy-700 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 
                         hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 
                         rounded-lg transition-colors"
              >
                {initialData ? 'Atualizar' : 'Criar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BudgetForm;
