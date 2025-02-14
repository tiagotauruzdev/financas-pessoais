import React, { useState, useEffect, useCallback } from 'react';
import { CreditCard, Plus, Settings, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { debtsService } from '../services/debtsService';
import type { Debt } from '../types/debt';

interface Card {
  id: string;
  name: string;
  amount: number;
  color: string;
  dueDate: string;
  lastDigits: string;
  flag: string;
}

export default function OpenCards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const SLIDE_DURATION = 5000; // 5 segundos por cartão

  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCreditCards();
  }, []);

  const loadCreditCards = async () => {
    try {
      const debts = await debtsService.getAllDebts();
      const creditCards = debts
        .filter(debt => debt.category === 'credit_card' && debt.status === 'active')
        .map(debt => ({
          id: debt.id,
          name: debt.name,
          amount: debt.remaining_amount,
          color: debt.card_color || '#1a1a1a',
          dueDate: debt.due_date,
          lastDigits: debt.card_last_digits || '****',
          flag: debt.card_brand || 'other'
        }));
      setCards(creditCards);
    } catch (error) {
      console.error('Error loading credit cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalAmount = cards.reduce((sum, card) => sum + card.amount, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDueDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const nextCard = useCallback(() => {
    if (cards.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }
  }, [cards.length]);

  const prevCard = () => {
    if (cards.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }
  };

  // Temporizador para troca automática
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (!isPaused && cards.length > 0) {
      timer = setInterval(() => {
        nextCard();
      }, SLIDE_DURATION);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isPaused, nextCard, cards.length]);

  // Pausa o carrossel quando o mouse está sobre o cartão
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-200 dark:bg-navy-800 rounded-xl p-6 h-full flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Carregando cartões...</div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="bg-gray-200 dark:bg-navy-800 rounded-xl p-6 h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-rose-500/10 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Faturas dos Cartões</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Nenhum cartão cadastrado</p>
            </div>
          </div>
          <button className="p-2 hover:bg-navy-700 rounded-lg transition-colors">
            <Plus className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 dark:bg-navy-800 rounded-xl p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-rose-500/10 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Faturas dos Cartões</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Controle de Faturas</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 hover:bg-navy-700 rounded-lg transition-colors"
          >
            {isPaused ? (
              <Play className="w-5 h-5 text-gray-400" />
            ) : (
              <Pause className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <button className="p-2 hover:bg-navy-700 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-gray-400" />
          </button>
          <button className="p-2 hover:bg-navy-700 rounded-lg transition-colors">
            <Plus className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Carrossel de Cartões */}
      <div 
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center justify-between">
          <button 
            onClick={prevCard}
            className="absolute left-0 z-10 p-2 bg-navy-700/80 rounded-full hover:bg-navy-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          <div className="w-full px-12">
            <div className="relative h-56 sm:h-64 transition-transform duration-500">
              {cards.map((card, index) => (
                <div
                  key={card.id}
                  className={`absolute w-full transition-all duration-500 ease-in-out transform ${
                    index === currentIndex 
                      ? 'opacity-100 translate-x-0 scale-100 rotate-0' 
                      : index < currentIndex
                        ? 'opacity-0 -translate-x-full scale-95 -rotate-6'
                        : 'opacity-0 translate-x-full scale-95 rotate-6'
                  }`}
                  style={{ display: index === currentIndex ? 'block' : 'none' }}
                >
                  {/* Cartão */}
                  <div
                    className="w-full h-48 sm:h-56 rounded-2xl p-4 sm:p-6 relative overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                    style={{ backgroundColor: card.color }}
                  >
                    {/* Padrão de fundo */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute inset-0 pattern-grid-white/5" />
                    </div>

                    {/* Layout para Mobile e Desktop */}
                    <div className="relative h-full flex flex-col justify-between">
                      {/* Cabeçalho do Cartão */}
                      <div className="flex justify-between items-start">
                        {/* Chip e Número do Cartão */}
                        <div>
                          <div className="w-10 sm:w-12 h-7 sm:h-9 bg-yellow-300/90 rounded-md mb-2 sm:mb-4 relative overflow-hidden shadow-lg">
                            <div className="absolute inset-0 pattern-grid-black/10" />
                            <div className="absolute inset-0 grid grid-cols-2 gap-1 p-1">
                              <div className="bg-yellow-400/50 rounded-sm" />
                              <div className="bg-yellow-400/50 rounded-sm" />
                            </div>
                          </div>
                          <div className="text-white font-mono mb-2 sm:mb-4 text-base sm:text-lg drop-shadow-lg">
                            •••• {card.lastDigits}
                          </div>
                        </div>

                        {/* Valor da Fatura */}
                        <div className="text-white text-lg sm:text-xl font-bold bg-black/20 backdrop-blur-sm rounded-lg px-3 py-1">
                          {formatCurrency(card.amount)}
                        </div>
                      </div>

                      {/* Rodapé do Cartão */}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="bg-black/20 backdrop-blur-sm rounded-lg p-2">
                          <div className="text-white text-sm font-medium">
                            {card.name}
                          </div>
                          <div className="text-white text-xs">
                            Vence em {formatDueDate(card.dueDate)}
                          </div>
                        </div>
                        <div className="text-white drop-shadow-lg">
                          {card.flag === 'visa' ? (
                            <span className="font-bold italic text-base sm:text-lg bg-white/10 px-2 py-1 rounded">VISA</span>
                          ) : card.flag === 'mastercard' ? (
                            <span className="font-bold text-base sm:text-lg bg-white/10 px-2 py-1 rounded">MC</span>
                          ) : card.flag === 'american_express' ? (
                            <span className="font-bold text-base sm:text-lg bg-white/10 px-2 py-1 rounded">AMEX</span>
                          ) : card.flag === 'elo' ? (
                            <span className="font-bold text-base sm:text-lg bg-white/10 px-2 py-1 rounded">ELO</span>
                          ) : (
                            <span className="font-bold text-base sm:text-lg bg-white/10 px-2 py-1 rounded">CARD</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={nextCard}
            className="absolute right-0 z-10 p-2 bg-navy-700/80 rounded-full hover:bg-navy-600 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Indicadores e Progresso */}
        <div className="flex flex-col items-center gap-2 mt-4">
          {/* Indicadores de cartão */}
          <div className="flex justify-center gap-2">
            {cards.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsPaused(true);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-navy-600'
                }`}
              />
            ))}
          </div>
          
          {/* Barra de progresso */}
          <div className="w-full bg-navy-700 rounded-full h-1 mt-2">
            <div
              className="bg-white h-1 rounded-full transition-all duration-200"
              style={{
                width: `${((currentIndex + 1) / cards.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="mt-6 pt-4 border-t border-gray-300 dark:border-navy-700">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Total em Aberto</span>
          <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
