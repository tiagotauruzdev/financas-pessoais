import { ScrollArea } from '../ui/ScrollArea';

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril',
  'Maio', 'Junho', 'Julho', 'Agosto',
  'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export default function MonthSelector() {
  return (
    <ScrollArea className="h-48 bg-gray-200 dark:bg-navy-800 rounded-xl p-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Meses</h3>
      <div className="space-y-2">
        {months.map((month, index) => (
          <button
            key={index}
            className="w-full text-left px-3 py-2 rounded-lg text-gray-900 dark:text-white
                     hover:bg-gray-300 dark:hover:bg-navy-700 transition-colors"
          >
            {month}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}