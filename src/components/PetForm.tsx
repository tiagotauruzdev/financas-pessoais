import React, { useState } from 'react';
import { X, Dog, Cat, Calendar, DollarSign, Syringe, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

export interface PetFormData {
  name: string;
  type: 'dog' | 'cat';
  breed: string;
  age: number;
  nextVaccine?: string;
  vaccineType?: string;
  vaccineNotes?: string;
  nextGrooming?: string;
  groomingType?: 'basic' | 'complete' | 'spa';
  groomingNotes?: string;
  expenses?: {
    type: 'food' | 'vet' | 'medicine' | 'grooming' | 'other';
    description: string;
    amount: number;
    date: string;
  }[];
}

interface PetFormProps {
  onSubmit: (data: PetFormData) => void;
  onClose: () => void;
  initialData?: PetFormData;
}

const PetForm: React.FC<PetFormProps> = ({ onSubmit, onClose, initialData }) => {
  const [formData, setFormData] = useState<PetFormData>(initialData || {
    name: '',
    type: 'dog',
    breed: '',
    age: 0,
    nextVaccine: '',
    vaccineType: '',
    vaccineNotes: '',
    nextGrooming: '',
    groomingType: 'basic',
    groomingNotes: '',
    expenses: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.breed) {
      toast.error('Nome e raça são obrigatórios');
      return;
    }
    onSubmit(formData);
  };

  // Raças de cachorro populares
  const dogBreeds = [
    'Vira-lata',
    'Golden Retriever',
    'Labrador',
    'Pastor Alemão',
    'Bulldog',
    'Poodle',
    'Rottweiler',
    'Husky Siberiano',
    'Pitbull',
    'Yorkshire',
    'Shih Tzu',
    'Pinscher',
    'Outro'
  ];

  // Raças de gato populares
  const catBreeds = [
    'Vira-lata',
    'Siamês',
    'Persa',
    'Maine Coon',
    'Angorá',
    'Bengal',
    'British Shorthair',
    'Sphynx',
    'Ragdoll',
    'Outro'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-navy-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              {formData.type === 'dog' ? (
                <Dog className="w-6 h-6 text-pink-500" />
              ) : (
                <Cat className="w-6 h-6 text-pink-500" />
              )}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {initialData ? 'Editar Pet' : 'Novo Pet'}
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
            {/* Informações Básicas */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-pink-500" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Informações Básicas
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ex: Luna"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400
                             bg-white dark:bg-navy-900 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tipo *
                  </label>
                  <div className="flex gap-4">
                    <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                      formData.type === 'dog'
                        ? 'bg-pink-500/20 text-pink-600 dark:text-pink-500'
                        : 'bg-gray-300/70 dark:bg-navy-700 text-gray-700 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-navy-600'
                    }`}>
                      <input
                        type="radio"
                        name="type"
                        value="dog"
                        checked={formData.type === 'dog'}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <Dog className={`w-5 h-5 ${
                        formData.type === 'dog'
                          ? 'text-pink-600 dark:text-pink-500'
                          : 'text-gray-700 dark:text-gray-400'
                      }`} />
                      <span className={`${
                        formData.type === 'dog'
                          ? 'text-pink-600 dark:text-pink-500'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>Cachorro</span>
                    </label>
                    <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                      formData.type === 'cat'
                        ? 'bg-pink-500/20 text-pink-600 dark:text-pink-500'
                        : 'bg-gray-300/70 dark:bg-navy-700 text-gray-700 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-navy-600'
                    }`}>
                      <input
                        type="radio"
                        name="type"
                        value="cat"
                        checked={formData.type === 'cat'}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <Cat className={`w-5 h-5 ${
                        formData.type === 'cat'
                          ? 'text-pink-600 dark:text-pink-500'
                          : 'text-gray-700 dark:text-gray-400'
                      }`} />
                      <span className={`${
                        formData.type === 'cat'
                          ? 'text-pink-600 dark:text-pink-500'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>Gato</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Raça *
                  </label>
                  <select
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400
                             bg-white dark:bg-navy-900 text-gray-900 dark:text-white"
                  >
                    <option value="">Selecione a raça</option>
                    {(formData.type === 'dog' ? dogBreeds : catBreeds).map(breed => (
                      <option key={breed} value={breed}>{breed}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Idade (anos) *
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="0"
                    max="30"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400
                             bg-white dark:bg-navy-900 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Próximos Eventos */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-pink-500" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Próximos Eventos
                </h3>
              </div>

              {/* Vacinas */}
              <div className="bg-gray-100 dark:bg-navy-900/50 rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Syringe className="w-5 h-5 text-yellow-500" />
                  <h4 className="text-base font-medium text-gray-900 dark:text-white">
                    Vacina
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Data da Próxima Vacina
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="nextVaccine"
                        value={formData.nextVaccine}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400
                                 bg-white dark:bg-navy-900 text-gray-900 dark:text-white"
                      />
                      <Calendar className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tipo de Vacina
                    </label>
                    <select
                      name="vaccineType"
                      value={formData.vaccineType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400
                               bg-white dark:bg-navy-900 text-gray-900 dark:text-white"
                    >
                      <option value="">Selecione o tipo</option>
                      <option value="v8">V8/V10</option>
                      <option value="antirrabica">Antirrábica</option>
                      <option value="giardia">Giardia</option>
                      <option value="gripe">Gripe</option>
                      <option value="leucemia">Leucemia Felina</option>
                      <option value="outra">Outra</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Observações da Vacina
                    </label>
                    <textarea
                      name="vaccineNotes"
                      value={formData.vaccineNotes}
                      onChange={handleChange}
                      placeholder="Ex: Reforço anual, reações anteriores, etc."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400
                               bg-white dark:bg-navy-900 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Banho */}
              <div className="bg-gray-100 dark:bg-navy-900/50 rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <svg 
                    className="w-5 h-5 text-blue-500"
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M7 21h10a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3Z" />
                    <path d="M12 11c2.76 0 5-2.24 5-5h-2a3 3 0 1 0-6 0H7c0 2.76 2.24 5 5 5Z" />
                    <path d="M17.47 15.5c-.84-1.46-2.44-2.5-4.47-2.5s-3.63 1.04-4.47 2.5" />
                  </svg>
                  <h4 className="text-base font-medium text-gray-900 dark:text-white">
                    Banho e Tosa
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Data do Próximo Banho
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="nextGrooming"
                        value={formData.nextGrooming}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400
                                 bg-white dark:bg-navy-900 text-gray-900 dark:text-white"
                      />
                      <Calendar className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tipo de Banho
                    </label>
                    <select
                      name="groomingType"
                      value={formData.groomingType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400
                               bg-white dark:bg-navy-900 text-gray-900 dark:text-white"
                    >
                      <option value="basic">Banho Básico</option>
                      <option value="complete">Banho e Tosa</option>
                      <option value="spa">Banho Spa</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Observações do Banho
                    </label>
                    <textarea
                      name="groomingNotes"
                      value={formData.groomingNotes}
                      onChange={handleChange}
                      placeholder="Ex: Tosa na máquina 2, alergia a shampoo, etc."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400
                               bg-white dark:bg-navy-900 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
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
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 
                         transition-colors flex items-center gap-2"
              >
                {formData.type === 'dog' ? (
                  <Dog className="w-4 h-4" />
                ) : (
                  <Cat className="w-4 h-4" />
                )}
                {initialData ? 'Atualizar' : 'Adicionar'} Pet
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PetForm;
