import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import Draggable from 'react-draggable';
import toast from 'react-hot-toast'; // Import the toast library

export interface DebtFormData {
  name: string;
  totalAmount: number;
  remainingAmount: number;
  interestRate: number;
  nextPayment: string;
  type: 'credit_card' | 'loan' | 'financing' | 'other';
  status?: 'active' | 'paid' | 'defaulted';
  priority?: 'low' | 'medium' | 'high';
  cardLastDigits?: string;
  cardColor?: string;
  cardBrand?: string;
}

interface DebtFormProps {
  onSubmit: (data: DebtFormData) => void;
  onClose: () => void;
  initialData?: DebtFormData;
}

const DebtForm: React.FC<DebtFormProps> = ({ onSubmit, onClose, initialData }) => {
  const [formData, setFormData] = useState<DebtFormData>({
    name: '',
    totalAmount: 0,
    remainingAmount: 0,
    interestRate: 0,
    nextPayment: new Date().toISOString().split('T')[0],
    type: 'credit_card',
    status: 'active',
    priority: 'medium',
    cardLastDigits: '',
    cardColor: '#1a1a1a',
    cardBrand: ''
  });

  const [showColorPicker, setShowColorPicker] = useState(false);

  // Exemplos de nomes para cada tipo de dívida
  const nameExamples = {
    credit_card: 'Ex: Cartão Nubank - Fatura Janeiro/2024',
    loan: 'Ex: Empréstimo Pessoal - Banco Itaú',
    financing: 'Ex: Financiamento Apartamento - Caixa',
    other: 'Ex: Empréstimo com Amigo - João'
  };

  const cardBrands = [
    { value: 'visa', label: 'Visa' },
    { value: 'mastercard', label: 'Mastercard' },
    { value: 'american_express', label: 'American Express' },
    { value: 'elo', label: 'Elo' },
    { value: 'hipercard', label: 'Hipercard' },
    { value: 'other', label: 'Outra' }
  ];

  const cardColors = [
    { value: '#1a1a1a', label: 'Preto' },
    { value: '#C0C0C0', label: 'Prata' },
    { value: '#FFD700', label: 'Dourado' },
    { value: '#0047AB', label: 'Azul' },
    { value: '#8B0000', label: 'Vermelho' },
    { value: '#006400', label: 'Verde' },
    { value: '#4B0082', label: 'Roxo' }
  ];

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'type') {
      // Limpa o campo nome quando muda o tipo, para mostrar o novo exemplo
      setFormData(prev => ({
        ...prev,
        [name]: value,
        name: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name.includes('Amount') || name === 'interestRate' 
          ? parseFloat(value) || 0 
          : value
      }));
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos obrigatórios
    if (!formData.name || !formData.totalAmount || !formData.remainingAmount || !formData.nextPayment) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Garantir que o valor restante não é maior que o valor total
    if (formData.remainingAmount > formData.totalAmount) {
      toast.error('O valor restante não pode ser maior que o valor total');
      return;
    }

    // Se for cartão de crédito, validar campos específicos
    if (formData.type === 'credit_card') {
      if (!formData.cardLastDigits || formData.cardLastDigits.length !== 4) {
        toast.error('Por favor, insira os últimos 4 dígitos do cartão');
        return;
      }
      if (!formData.cardBrand) {
        toast.error('Por favor, selecione a bandeira do cartão');
        return;
      }
    }

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-navy-800 rounded-xl shadow-xl w-full max-w-md">
        <form onSubmit={handleSubmit}>
          {/* Cabeçalho */}
          <div className="p-4 border-b dark:border-navy-600 bg-gradient-to-r from-blue-500 to-cyan-500">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">
                {initialData ? 'Editar Dívida' : 'Nova Dívida'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="text-white hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-4">
            {/* Tipo de Dívida */}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Tipo de Dívida
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg dark:bg-navy-900 dark:border-navy-700 dark:text-white"
              >
                <option value="credit_card">Cartão de Crédito</option>
                <option value="loan">Empréstimo</option>
                <option value="financing">Financiamento</option>
                <option value="other">Outro</option>
              </select>
            </div>

            {/* Status da Dívida */}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg dark:bg-navy-900 dark:border-navy-700 dark:text-white"
              >
                <option value="active">Ativa</option>
                <option value="paid">Paga</option>
                <option value="defaulted">Em Atraso</option>
              </select>
            </div>

            {/* Prioridade */}
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Prioridade
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg dark:bg-navy-900 dark:border-navy-700 dark:text-white"
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>

            {/* Informações Básicas */}
            <div className="p-4 space-y-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Informações Básicas
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={nameExamples[formData.type as keyof typeof nameExamples]}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-navy-700 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Valor Total
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">R$</span>
                    <input
                      type="number"
                      name="totalAmount"
                      value={formData.totalAmount}
                      onChange={handleChange}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-navy-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Valor Restante
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">R$</span>
                    <input
                      type="number"
                      name="remainingAmount"
                      value={formData.remainingAmount}
                      onChange={handleChange}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-navy-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Taxa de Juros (%)
                  </label>
                  <input
                    type="number"
                    name="interestRate"
                    value={formData.interestRate}
                    onChange={handleChange}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-navy-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Próximo Pagamento
                  </label>
                  <input
                    type="date"
                    name="nextPayment"
                    value={formData.nextPayment}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-navy-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Detalhes do Cartão */}
            {formData.type === 'credit_card' && (
              <div className="p-4 space-y-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Detalhes do Cartão
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Últimos 4 Dígitos
                    </label>
                    <input
                      type="text"
                      name="cardLastDigits"
                      value={formData.cardLastDigits}
                      onChange={handleChange}
                      maxLength={4}
                      placeholder="0000"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-navy-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Bandeira
                    </label>
                    <select
                      name="cardBrand"
                      value={formData.cardBrand}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-navy-700 dark:text-white"
                    >
                      <option value="">Selecione</option>
                      {cardBrands.map(brand => (
                        <option key={brand.value} value={brand.value}>
                          {brand.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Cor do Cartão */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cor do Cartão
                  </label>
                  
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {cardColors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => handleInputChange('cardColor', color.value)}
                        className={`
                          w-8 h-8 rounded-full transition-all duration-200
                          ${formData.cardColor === color.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
                          hover:scale-110 focus:outline-none
                        `}
                        style={{ backgroundColor: color.value }}
                        title={color.label}
                      >
                        {formData.cardColor === color.value && (
                          <span className="flex items-center justify-center h-full">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        )}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      className={`
                        w-8 h-8 rounded-full transition-all duration-200
                        bg-gradient-to-br from-purple-500 to-pink-500
                        hover:scale-110 focus:outline-none
                        flex items-center justify-center
                      `}
                      title="Escolher cor personalizada"
                    >
                      <span className="text-white font-bold text-lg">+</span>
                    </button>
                  </div>

                  {showColorPicker && (
                    <>
                      <div className="fixed inset-0 z-50" onClick={() => setShowColorPicker(false)} />
                      <Draggable
                        handle=".color-picker-handle"
                        defaultPosition={{x: 0, y: 0}}
                        positionOffset={{x: 0, y: 0}}
                      >
                        <div className="fixed z-50 bg-white dark:bg-navy-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-navy-600" style={{ width: '280px' }}>
                          <div className="flex justify-between items-center mb-3 color-picker-handle cursor-move select-none">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Cor Personalizada
                            </span>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-6 h-6 rounded-full border border-gray-300"
                                style={{ backgroundColor: formData.cardColor }}
                              />
                              <span className="text-sm text-gray-600 dark:text-gray-400 select-none">
                                {formData.cardColor}
                              </span>
                              <button
                                type="button"
                                onClick={() => setShowColorPicker(false)}
                                className="text-gray-400 hover:text-gray-500"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <HexColorPicker
                            color={formData.cardColor}
                            onChange={(color) => handleInputChange('cardColor', color)}
                            style={{ width: '100%', height: '160px' }}
                          />
                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                handleInputChange('cardColor', '#1a1a1a');
                                setShowColorPicker(false);
                              }}
                              className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-navy-700 rounded-md hover:bg-gray-200 dark:hover:bg-navy-600"
                            >
                              Resetar
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowColorPicker(false)}
                              className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                            >
                              Confirmar
                            </button>
                          </div>
                        </div>
                      </Draggable>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Barra de Ações */}
          <div className="p-4 border-t dark:border-navy-600 bg-gray-50 dark:bg-navy-900">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-navy-700 border border-gray-300 dark:border-navy-600 rounded-lg hover:bg-gray-50 dark:hover:bg-navy-600"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {initialData ? 'Salvar Alterações' : 'Adicionar Dívida'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DebtForm;
