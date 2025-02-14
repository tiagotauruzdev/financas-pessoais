import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Calendar() {
  const [currentDate] = useState(new Date());
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="bg-gray-200 dark:bg-navy-800 rounded-xl p-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
      </h3>
      
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, index) => (
          <div key={index} className="text-gray-500 dark:text-gray-400 text-sm">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <button
            key={index}
            className="aspect-square flex items-center justify-center text-sm rounded-lg
                     hover:bg-gray-300 dark:hover:bg-navy-700 transition-colors
                     text-gray-900 dark:text-white"
          >
            {format(day, 'd')}
          </button>
        ))}
      </div>
    </div>
  );
}