import { useState, useEffect } from 'react';
import { Baby, Plus, School, Gift, HeartPulse, GraduationCap, DollarSign } from 'lucide-react';
import DependentForm from './DependentForm';
import { toast } from 'react-hot-toast';
import { dependentService, type Dependent, type DependentFormData } from '../services/dependent.service';

export default function FamilyCard() {
  const [showNewDependentForm, setShowNewDependentForm] = useState(false);
  const [children, setChildren] = useState<Dependent[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDependents();
  }, []);

  const loadDependents = async () => {
    try {
      const data = await dependentService.getDependents();
      setChildren(data);
      if (data.length > 0) {
        setSelectedChild(data[0].id);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading dependents:', error);
      toast.error('Erro ao carregar dependentes');
      setLoading(false);
    }
  };

  const handleAddDependent = async (data: DependentFormData) => {
    try {
      await dependentService.createDependent(data);
      await loadDependents();
      toast.success('Dependente adicionado com sucesso!');
      setShowNewDependentForm(false);
    } catch (error) {
      console.error('Erro ao adicionar dependente:', error);
      toast.error('Erro ao adicionar dependente');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading) {
    return (
      <div className="bg-gray-200 dark:bg-navy-800 rounded-xl p-6 h-full flex items-center justify-center">
        <span className="text-gray-600 dark:text-gray-400">Carregando...</span>
      </div>
    );
  }

  const currentChild = children.find(c => c.id === selectedChild);

  return (
    <div className="bg-gray-200 dark:bg-navy-800 rounded-xl p-6 h-full">
      {/* Form Modal */}
      {showNewDependentForm && (
        <DependentForm
          onClose={() => setShowNewDependentForm(false)}
          onSubmit={handleAddDependent}
        />
      )}

      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Baby className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Família</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Gestão de Dependentes</p>
          </div>
        </div>
        <button 
          onClick={() => setShowNewDependentForm(true)}
          className="p-2 hover:bg-navy-700 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Seleção de Filho */}
      {children.length > 0 ? (
        <>
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {children.map(child => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(child.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  child.id === selectedChild
                    ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                    : 'bg-gray-300/70 dark:bg-navy-700 text-gray-700 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-navy-600'
                }`}
              >
                <Baby className="w-4 h-4" />
                <span>{child.name}</span>
              </button>
            ))}
          </div>

          {/* Informações do Filho */}
          {currentChild && (
            <div className="space-y-4">
              {/* Dados Básicos */}
              <div className="bg-gray-300/30 dark:bg-navy-700/50 rounded-xl p-4 hover:bg-gray-300/50 dark:hover:bg-navy-700/70 transition-colors">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Idade</span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {calculateAge(currentChild.birthDate)} anos
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Aniversário</span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {formatDate(currentChild.birthDate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Escola */}
              {currentChild.schoolName && (
                <div className="bg-gray-300/30 dark:bg-navy-700/50 rounded-xl p-4 hover:bg-gray-300/50 dark:hover:bg-navy-700/70 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <School className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-900 dark:text-white font-medium">Escola</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{currentChild.schoolName}</p>
                  {currentChild.schoolGrade && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      {currentChild.schoolGrade}
                    </p>
                  )}
                </div>
              )}

              {/* Próximo Evento */}
              {currentChild.nextEvent && (
                <div className="bg-gray-300/30 dark:bg-navy-700/50 rounded-xl p-4 hover:bg-gray-300/50 dark:hover:bg-navy-700/70 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {currentChild.nextEvent.type === 'medical' && <HeartPulse className="w-5 h-5 text-red-500" />}
                      {currentChild.nextEvent.type === 'school' && <School className="w-5 h-5 text-blue-500" />}
                      {currentChild.nextEvent.type === 'birthday' && <Gift className="w-5 h-5 text-pink-500" />}
                      {currentChild.nextEvent.type === 'other' && <GraduationCap className="w-5 h-5 text-purple-500" />}
                      <span className="text-gray-900 dark:text-white font-medium">
                        Próximo Evento
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(currentChild.nextEvent.date)}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {currentChild.nextEvent.description}
                  </p>
                </div>
              )}

              {/* Despesas */}
              {currentChild.expenses.length > 0 && (
                <div className="bg-gray-300/30 dark:bg-navy-700/50 rounded-xl p-4 hover:bg-gray-300/50 dark:hover:bg-navy-700/70 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-500" />
                      <span className="text-gray-900 dark:text-white font-medium">Despesas Mensais</span>
                    </div>
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      {formatCurrency(
                        currentChild.expenses
                          .filter(expense => expense.recurrent)
                          .reduce((total, expense) => total + expense.amount, 0)
                      )}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {currentChild.expenses
                      .filter(expense => expense.recurrent)
                      .map(expense => (
                        <div key={expense.id} className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300">{expense.description}</span>
                          <span className="text-gray-900 dark:text-white">
                            {formatCurrency(expense.amount)}
                          </span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            Nenhum dependente cadastrado. Clique no botão + para adicionar.
          </p>
        </div>
      )}
    </div>
  );
}
