import React, { useState } from 'react';
import { Baby, Plus, School, Gift, HeartPulse, GraduationCap, DollarSign } from 'lucide-react';
import FamilyCard from '../components/FamilyCard';
import DependentForm, { DependentFormData } from '../components/DependentForm';
import PetCard from '../components/PetCard';
import { toast } from 'react-hot-toast';

export default function Family() {
  const [showNewDependentForm, setShowNewDependentForm] = useState(false);

  const handleAddDependent = async (data: DependentFormData) => {
    try {
      // TODO: Implementar a chamada ao serviço para salvar o dependente
      console.log('Novo dependente:', data);
      toast.success('Dependente adicionado com sucesso!');
      setShowNewDependentForm(false);
    } catch (error) {
      console.error('Erro ao adicionar dependente:', error);
      toast.error('Erro ao adicionar dependente');
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Família
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie seus dependentes e acompanhe suas despesas
          </p>
        </div>
        <button 
          onClick={() => setShowNewDependentForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Dependente
        </button>
      </div>

      {/* Form Modal */}
      {showNewDependentForm && (
        <DependentForm
          onClose={() => setShowNewDependentForm(false)}
          onSubmit={handleAddDependent}
        />
      )}

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Principal - Esquerda/Centro */}
        <div className="lg:col-span-2 space-y-8">
          {/* Cartão Família */}
          <FamilyCard />

          {/* Resumo de Despesas */}
          <div className="bg-gray-200 dark:bg-navy-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Resumo de Despesas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-300/50 dark:bg-navy-700/50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <School className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">Educação</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">R$ 1.250,00</p>
              </div>

              <div className="bg-gray-300/50 dark:bg-navy-700/50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <HeartPulse className="w-5 h-5 text-red-500" />
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">Saúde</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">R$ 850,00</p>
              </div>

              <div className="bg-gray-300/50 dark:bg-navy-700/50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-purple-500" />
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">Total</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">R$ 2.100,00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Lateral - Direita */}
        <div className="space-y-8">
          {/* Pets */}
          <PetCard />

          {/* Próximos Eventos */}
          <div className="bg-gray-200 dark:bg-navy-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Próximos Eventos
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-300/50 dark:bg-navy-700/50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                    <Gift className="w-5 h-5 text-pink-500" />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">Aniversário Lucas</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">20/08/2024</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-300/50 dark:bg-navy-700/50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <HeartPulse className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">Consulta Sofia</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">10/02/2024</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-300/50 dark:bg-navy-700/50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">Matrícula Escolar</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">15/01/2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
