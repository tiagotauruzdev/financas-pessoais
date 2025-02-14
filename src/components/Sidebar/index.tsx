import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List, DollarSign, Plus } from 'lucide-react';
import Calendar from './Calendar';
import MonthSelector from './MonthSelector';
import IncomeOverview from './IncomeOverview';
import QuickActions from './QuickActions';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div 
      className={`relative h-screen bg-gray-100 dark:bg-navy-900 transition-all duration-500 ease-in-out border-r border-gray-200 dark:border-navy-800 ${
        isCollapsed ? 'w-20' : 'w-80'
      }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-gray-200 dark:bg-navy-800 rounded-full p-1.5 text-gray-600 dark:text-cyan-400 
                   hover:bg-gray-300 dark:hover:bg-navy-700 hover:text-gray-800 dark:hover:text-cyan-300 
                   shadow-lg shadow-gray-200/50 dark:shadow-navy-950/50
                   transition-all duration-300 ease-in-out
                   transform hover:scale-105
                   focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50
                   z-50"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <div className="bg-white dark:bg-navy-900 rounded-full p-1">
          {isCollapsed ? (
            <ChevronRight size={16} className="transform transition-transform duration-300" />
          ) : (
            <ChevronLeft size={16} className="transform transition-transform duration-300" />
          )}
        </div>
      </button>

      <div 
        className={`h-full overflow-hidden transition-all duration-500 ease-in-out ${
          isCollapsed ? 'w-0 opacity-0' : 'w-full opacity-100'
        }`}
      >
        <div className="h-full overflow-auto p-4 space-y-4 custom-scrollbar">
          <Calendar />
          <MonthSelector />
          <IncomeOverview />
          <QuickActions />
        </div>
      </div>

      <div 
        className={`absolute inset-x-0 top-0 transition-all duration-500 ease-in-out ${
          isCollapsed ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
        }`}
      >
        <div className="p-4 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <button 
              className="p-3 rounded-lg bg-gray-200 dark:bg-navy-800 text-gray-600 dark:text-cyan-400 
                         hover:bg-gray-300 dark:hover:bg-navy-700 hover:text-gray-800 dark:hover:text-cyan-300 
                         transform hover:scale-105
                         transition-all duration-300 ease-in-out
                         focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
              aria-label="Calendar"
            >
              <CalendarIcon size={20} />
            </button>
            <button 
              className="p-3 rounded-lg bg-gray-200 dark:bg-navy-800 text-gray-600 dark:text-cyan-400 
                         hover:bg-gray-300 dark:hover:bg-navy-700 hover:text-gray-800 dark:hover:text-cyan-300 
                         transform hover:scale-105
                         transition-all duration-300 ease-in-out
                         focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
              aria-label="Transactions"
            >
              <List size={20} />
            </button>
            <button 
              className="p-3 rounded-lg bg-gray-200 dark:bg-navy-800 text-gray-600 dark:text-cyan-400 
                         hover:bg-gray-300 dark:hover:bg-navy-700 hover:text-gray-800 dark:hover:text-cyan-300 
                         transform hover:scale-105
                         transition-all duration-300 ease-in-out
                         focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
              aria-label="Income"
            >
              <DollarSign size={20} />
            </button>
            <button 
              className="p-3 rounded-lg bg-gray-200 dark:bg-navy-800 text-gray-600 dark:text-cyan-400 
                         hover:bg-gray-300 dark:hover:bg-navy-700 hover:text-gray-800 dark:hover:text-cyan-300 
                         transform hover:scale-105
                         transition-all duration-300 ease-in-out
                         focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
              aria-label="Add new"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}