import React, { useState } from 'react';
import { Dog, Cat, Plus, Calendar, DollarSign, Syringe, Heart } from 'lucide-react';
import PetForm, { PetFormData } from './PetForm';
import toast from 'react-hot-toast';

interface PetExpense {
  id: string;
  type: 'food' | 'vet' | 'medicine' | 'grooming' | 'other';
  description: string;
  amount: number;
  date: string;
}

interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat';
  breed: string;
  age: number;
  nextVaccine?: string;
  nextGrooming?: string;
  expenses: PetExpense[];
}

interface PetFormData {
  // TODO: Definir a estrutura do formulário de novo pet
}

export default function PetCard() {
  const [pets, setPets] = useState<Pet[]>([
    {
      id: '1',
      name: 'Luna',
      type: 'dog',
      breed: 'Golden Retriever',
      age: 2,
      nextVaccine: '2024-02-15',
      nextGrooming: '2024-01-20',
      expenses: [
        {
          id: '1',
          type: 'food',
          description: 'Ração Premium',
          amount: 120.50,
          date: '2024-01-05'
        },
        {
          id: '2',
          type: 'vet',
          description: 'Consulta de Rotina',
          amount: 150.00,
          date: '2023-12-28'
        }
      ]
    },
    {
      id: '2',
      name: 'Felix',
      type: 'cat',
      breed: 'Siamês',
      age: 3,
      nextVaccine: '2024-03-10',
      expenses: [
        {
          id: '3',
          type: 'medicine',
          description: 'Vermífugo',
          amount: 45.90,
          date: '2024-01-02'
        }
      ]
    }
  ]);

  const [selectedPet, setSelectedPet] = useState<string>(pets[0].id);
  const [showNewPetForm, setShowNewPetForm] = useState(false);

  const handleAddPet = (data: PetFormData) => {
    try {
      // TODO: Implementar a chamada ao serviço para salvar o pet
      console.log('Novo pet:', data);
      // toast.success('Pet adicionado com sucesso!');
      setShowNewPetForm(false);
    } catch (error) {
      console.error('Erro ao adicionar pet:', error);
      // toast.error('Erro ao adicionar pet');
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

  const calculateTotalExpenses = (petId: string) => {
    const pet = pets.find(p => p.id === petId);
    if (!pet) return 0;
    return pet.expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getNextEvent = (pet: Pet) => {
    const events = [];
    if (pet.nextVaccine) {
      events.push({
        type: 'vaccine',
        date: new Date(pet.nextVaccine),
        description: 'Próxima Vacina'
      });
    }
    if (pet.nextGrooming) {
      events.push({
        type: 'grooming',
        date: new Date(pet.nextGrooming),
        description: 'Próximo Banho'
      });
    }
    
    if (events.length === 0) return null;
    
    return events.sort((a, b) => a.date.getTime() - b.date.getTime())[0];
  };

  const currentPet = pets.find(p => p.id === selectedPet)!;
  const nextEvent = getNextEvent(currentPet);

  return (
    <div className="bg-gray-200 dark:bg-navy-800 rounded-xl p-6 h-full">
      {/* Form Modal */}
      {showNewPetForm && (
        <PetForm
          onClose={() => setShowNewPetForm(false)}
          onSubmit={handleAddPet}
        />
      )}

      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center">
            {currentPet.type === 'dog' ? (
              <Dog className="w-6 h-6 text-pink-500" />
            ) : (
              <Cat className="w-6 h-6 text-pink-500" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Meus Pets</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Controle de Gastos e Cuidados</p>
          </div>
        </div>
        <button 
          onClick={() => setShowNewPetForm(true)}
          className="p-2 hover:bg-navy-700 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Seleção de Pet */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {pets.map(pet => (
          <button
            key={pet.id}
            onClick={() => setSelectedPet(pet.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              pet.id === selectedPet
                ? 'bg-pink-500/20 text-pink-600 dark:text-pink-500'
                : 'bg-gray-300/70 dark:bg-navy-700 text-gray-700 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-navy-600'
            }`}
          >
            {pet.type === 'dog' ? (
              <Dog className="w-4 h-4" />
            ) : (
              <Cat className="w-4 h-4" />
            )}
            <span className={`${
              pet.id === selectedPet 
                ? 'text-pink-600 dark:text-pink-500' 
                : 'text-gray-700 dark:text-gray-300'
            }`}>{pet.name}</span>
          </button>
        ))}
      </div>

      {/* Informações do Pet */}
      <div className="bg-gray-300/30 dark:bg-navy-700/50 rounded-xl p-4 mb-4 hover:bg-gray-300/50 dark:hover:bg-navy-700/70 transition-colors">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-gray-600 dark:text-gray-400 text-sm">Raça</span>
            <p className="text-gray-900 dark:text-white font-medium">{currentPet.breed}</p>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400 text-sm">Idade</span>
            <p className="text-gray-900 dark:text-white font-medium">{currentPet.age} anos</p>
          </div>
        </div>
      </div>

      {/* Próximo Evento */}
      {nextEvent && (
        <div className="bg-gray-300/30 dark:bg-navy-700/50 rounded-xl p-4 mb-4 hover:bg-gray-300/50 dark:hover:bg-navy-700/70 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              {nextEvent.type === 'vaccine' ? (
                <Syringe className="w-5 h-5 text-yellow-500" />
              ) : (
                <Calendar className="w-5 h-5 text-yellow-500" />
              )}
            </div>
            <div>
              <h4 className="text-gray-900 dark:text-white font-medium">{nextEvent.description}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(nextEvent.date.toISOString())}</p>
            </div>
          </div>
        </div>
      )}

      {/* Últimas Despesas */}
      <div className="space-y-3">
        <h4 className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-500" />
          Últimas Despesas
        </h4>
        <div className="space-y-2">
          {currentPet.expenses.slice(0, 3).map(expense => (
            <div
              key={expense.id}
              className="bg-gray-300/30 dark:bg-navy-700/50 rounded-lg p-3 flex items-center justify-between hover:bg-gray-300/50 dark:hover:bg-navy-700/70 transition-colors"
            >
              <div>
                <p className="text-gray-900 dark:text-white text-sm">{expense.description}</p>
                <span className="text-xs text-gray-600 dark:text-gray-400">{formatDate(expense.date)}</span>
              </div>
              <span className="text-green-500 font-medium">
                {formatCurrency(expense.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Total de Gastos */}
      <div className="mt-6 pt-4 border-t border-gray-300 dark:border-navy-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-500" />
            <span className="text-gray-600 dark:text-gray-400">Total Investido</span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(calculateTotalExpenses(selectedPet))}
          </span>
        </div>
      </div>
    </div>
  );
}
