import { CreditCard } from 'lucide-react';
import { Debt } from '../services/debtsService';

interface CreditCardsListProps {
  debts: Debt[];
}

const getBrandIcon = (brand: string) => {
  // Aqui você pode adicionar os SVGs das bandeiras dos cartões
  // Por enquanto vamos usar um ícone genérico
  return <CreditCard className="w-8 h-8" />;
};

const getCardBackground = (color: string) => {
  const colors = {
    '#000000': 'bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]',  // Preto
    '#C0C0C0': 'bg-gradient-to-br from-[#E8E8E8] to-[#C0C0C0]',  // Prata
    '#FFD700': 'bg-gradient-to-br from-[#FFD700] to-[#FFA500]',  // Dourado
    '#0047AB': 'bg-gradient-to-br from-[#0047AB] to-[#00308F]',  // Azul
    '#8B0000': 'bg-gradient-to-br from-[#8B0000] to-[#800000]',  // Vermelho
    '#006400': 'bg-gradient-to-br from-[#006400] to-[#004B00]',  // Verde
    '#4B0082': 'bg-gradient-to-br from-[#4B0082] to-[#2E0854]',  // Roxo
    '#2F4F4F': 'bg-gradient-to-br from-[#2F4F4F] to-[#1F3333]'   // Cinza escuro (fallback)
  };

  return colors[color] || colors['#2F4F4F'];
};

export default function CreditCardsList({ debts }: CreditCardsListProps) {
  const creditCards = debts.filter(debt => debt.type === 'cartao');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {creditCards.map((card) => (
        <div
          key={card.id}
          className={`
            ${getCardBackground(card.card_color || '#2F4F4F')}
            rounded-xl p-6 text-white shadow-lg
            transform transition-transform duration-300 hover:scale-105
            relative overflow-hidden
          `}
        >
          {/* Efeito de brilho */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-30" />

          {/* Chip do cartão */}
          <div className="w-12 h-8 bg-yellow-400/90 rounded-md mb-4" />

          {/* Número do cartão */}
          <div className="flex items-center justify-between mb-6">
            <div className="space-x-2">
              <span>****</span>
              <span>****</span>
              <span>****</span>
              <span className="font-mono">{card.card_last_digits || '****'}</span>
            </div>
            {getBrandIcon(card.card_brand || '')}
          </div>

          {/* Nome e valor */}
          <div className="space-y-2">
            <h3 className="font-medium text-lg">{card.name}</h3>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-80">Fatura Atual</p>
                <p className="text-xl font-bold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(card.remaining_amount)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-80">Limite Total</p>
                <p className="text-xl font-bold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(card.total_amount)}
                </p>
              </div>
            </div>
          </div>

          {/* Barra de progresso do limite */}
          <div className="mt-4">
            <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/90 rounded-full transition-all duration-500"
                style={{
                  width: `${(card.remaining_amount / card.total_amount) * 100}%`
                }}
              />
            </div>
            <p className="text-xs mt-1 text-right text-white/80">
              {((card.remaining_amount / card.total_amount) * 100).toFixed(1)}% utilizado
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
