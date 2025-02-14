import React, { useState } from 'react';
import { X, Baby, School, HeartPulse, GraduationCap, CalendarDays } from 'lucide-react';
import toast from 'react-hot-toast';

export interface DependentFormData {
  name: string;
  birthDate: string;
  schoolName: string;
  schoolGrade: string;
  healthInsurance: string;
  bloodType: string;
  allergies: string;
  medications: string;
  monthlyCost: number;
}

interface DependentFormProps {
  onSubmit: (data: DependentFormData) => void;
  onClose: () => void;
  initialData?: DependentFormData;
}

const DependentForm: React.FC<DependentFormProps> = ({ onSubmit, onClose, initialData }) => {
  const [formData, setFormData] = useState<DependentFormData>(initialData || {
    name: '',
    birthDate: '',
    schoolName: '',
    schoolGrade: '',
    healthInsurance: '',
    bloodType: '',
    allergies: '',
    medications: '',
    monthlyCost: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.birthDate) {
      toast.error('Nome e data de nascimento são obrigatórios');
      return;
    }
    onSubmit(formData);
  };

  // Exemplos de nomes
  const nameExample = 'Ex: João da Silva';

  // Séries escolares predefinidas
  const schoolGrades = [
    'Berçário',
    'Maternal',
    'Jardim I',
    'Jardim II',
    '1º Ano',
    '2º Ano',
    '3º Ano',
    '4º Ano',
    '5º Ano',
    '6º Ano',
    '7º Ano',
    '8º Ano',
    '9º Ano',
    '1º Ano EM',
    '2º Ano EM',
    '3º Ano EM'
  ];

  // Tipos sanguíneos
  const bloodTypes = [
    'A+', 'A-',
    'B+', 'B-',
    'AB+', 'AB-',
    'O+', 'O-'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-navy-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Baby className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {initialData ? 'Editar Dependente' : 'Novo Dependente'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-navy-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Pessoais */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Baby className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Informações Pessoais
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={nameExample}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                             bg-white dark:bg-navy-900 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Data de Nascimento *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                               bg-white dark:bg-navy-900 text-gray-900 dark:text-white"
                    />
                    <CalendarDays className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Informações Escolares */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <School className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Informações Escolares
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome da Escola
                  </label>
                  <input
                    type="text"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleChange}
                    placeholder="Ex: Escola Municipal João Paulo"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                             bg-white dark:bg-navy-900 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Série/Ano
                  </label>
                  <select
                    name="schoolGrade"
                    value={formData.schoolGrade}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                             bg-white dark:bg-navy-900 text-gray-900 dark:text-white"
                  >
                    <option value="">Selecione a série</option>
                    {schoolGrades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Informações de Saúde */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <HeartPulse className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Informações de Saúde
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Plano de Saúde
                  </label>
                  <input
                    type="text"
                    name="healthInsurance"
                    value={formData.healthInsurance}
                    onChange={handleChange}
                    placeholder="Ex: Unimed"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                             bg-white dark:bg-navy-900 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tipo Sanguíneo
                  </label>
                  <select
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                             bg-white dark:bg-navy-900 text-gray-900 dark:text-white"
                  >
                    <option value="">Selecione o tipo</option>
                    {bloodTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Alergias
                  </label>
                  <textarea
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    placeholder="Ex: Amendoim, Camarão, Penicilina"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                             bg-white dark:bg-navy-900 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Medicamentos
                  </label>
                  <textarea
                    name="medications"
                    value={formData.medications}
                    onChange={handleChange}
                    placeholder="Ex: Ritalina 10mg - 1x ao dia"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                             bg-white dark:bg-navy-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Informações Financeiras */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Informações Financeiras
                </h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Custo Mensal Estimado (R$)
                </label>
                <input
                  type="number"
                  name="monthlyCost"
                  value={formData.monthlyCost}
                  onChange={handleChange}
                  placeholder="Ex: 500"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                           bg-white dark:bg-navy-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-navy-600">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-700 
                         rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                         transition-colors flex items-center gap-2"
              >
                <Baby className="w-4 h-4" />
                {initialData ? 'Atualizar' : 'Adicionar'} Dependente
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DependentForm;
