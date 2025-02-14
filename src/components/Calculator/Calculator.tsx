import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { Calculator as CalculatorIcon, Binary } from 'lucide-react';

interface CalculationHistory {
  equation: string;
  result: string;
}

export function Calculator({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [memory, setMemory] = useState<number | null>(null);
  const [isNewCalculation, setIsNewCalculation] = useState(true);
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isScientific, setIsScientific] = useState(false);
  const [angleUnit, setAngleUnit] = useState<'DEG' | 'RAD'>('DEG');

  const handleNumber = (num: string) => {
    if (isNewCalculation) {
      setDisplay(num);
      setIsNewCalculation(false);
    } else {
      setDisplay(prev => prev === '0' ? num : prev + num);
    }
  };

  const handleOperator = (op: string) => {
    setEquation(prev => prev + display + op);
    setDisplay('0');
    setIsNewCalculation(false);
  };

  const handleSpecialOperation = (operation: string) => {
    const currentNumber = parseFloat(display);
    let result: number;
    let historyEquation = '';

    switch (operation) {
      case '%':
        if (equation) {
          const baseNumber = parseFloat(equation.slice(0, -1));
          result = (baseNumber * currentNumber) / 100;
          historyEquation = `${baseNumber} × ${currentNumber}% = `;
        } else {
          result = currentNumber / 100;
          historyEquation = `${currentNumber}% = `;
        }
        break;
      case '√':
        result = Math.sqrt(currentNumber);
        historyEquation = `√(${currentNumber}) = `;
        break;
      case 'x²':
        result = Math.pow(currentNumber, 2);
        historyEquation = `${currentNumber}² = `;
        break;
      case '1/x':
        result = 1 / currentNumber;
        historyEquation = `1/${currentNumber} = `;
        break;
      default:
        return;
    }

    setDisplay(result.toString());
    setIsNewCalculation(true);
    if (equation && operation === '%') {
      setEquation('');
    }
    
    // Adicionar ao histórico
    addToHistory(historyEquation, result.toString());
  };

  const handleMemory = (operation: string) => {
    const currentNumber = parseFloat(display);

    switch (operation) {
      case 'MC':
        setMemory(null);
        break;
      case 'MR':
        if (memory !== null) {
          setDisplay(memory.toString());
          setIsNewCalculation(true);
        }
        break;
      case 'M+':
        setMemory(prev => (prev || 0) + currentNumber);
        setIsNewCalculation(true);
        break;
      case 'M-':
        setMemory(prev => (prev || 0) - currentNumber);
        setIsNewCalculation(true);
        break;
    }
  };

  const handleScientificOperation = (operation: string) => {
    const currentNumber = parseFloat(display);
    let result: number;
    let historyEquation = '';

    const toRadians = (degrees: number) => degrees * (Math.PI / 180);
    const toDegrees = (radians: number) => radians * (180 / Math.PI);

    try {
      switch (operation) {
        case 'sin':
          result = angleUnit === 'DEG' 
            ? Math.sin(toRadians(currentNumber))
            : Math.sin(currentNumber);
          historyEquation = `sin(${currentNumber}${angleUnit}) = `;
          break;
        case 'cos':
          result = angleUnit === 'DEG'
            ? Math.cos(toRadians(currentNumber))
            : Math.cos(currentNumber);
          historyEquation = `cos(${currentNumber}${angleUnit}) = `;
          break;
        case 'tan':
          result = angleUnit === 'DEG'
            ? Math.tan(toRadians(currentNumber))
            : Math.tan(currentNumber);
          historyEquation = `tan(${currentNumber}${angleUnit}) = `;
          break;
        case 'ln':
          result = Math.log(currentNumber);
          historyEquation = `ln(${currentNumber}) = `;
          break;
        case 'log':
          result = Math.log10(currentNumber);
          historyEquation = `log(${currentNumber}) = `;
          break;
        case 'exp':
          result = Math.exp(currentNumber);
          historyEquation = `e^${currentNumber} = `;
          break;
        case 'x^y':
          setEquation(prev => prev + display + '**');
          setDisplay('0');
          return;
        case 'π':
          result = Math.PI;
          historyEquation = 'π = ';
          break;
        case 'e':
          result = Math.E;
          historyEquation = 'e = ';
          break;
        case '|x|':
          result = Math.abs(currentNumber);
          historyEquation = `|${currentNumber}| = `;
          break;
        case 'x!':
          if (currentNumber < 0 || !Number.isInteger(currentNumber)) throw new Error('Invalid input');
          result = factorial(currentNumber);
          historyEquation = `${currentNumber}! = `;
          break;
        default:
          return;
      }

      setDisplay(result.toString());
      setIsNewCalculation(true);
      addToHistory(historyEquation, result.toString());
    } catch (error) {
      setDisplay('Error');
      setIsNewCalculation(true);
    }
  };

  const factorial = (n: number): number => {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
  };

  const addToHistory = (eq: string, res: string) => {
    setHistory(prev => {
      const newHistory = [...prev, { equation: eq, result: res }];
      if (newHistory.length > 3) newHistory.shift(); // Manter apenas as últimas 3 operações
      return newHistory;
    });
  };

  const calculate = () => {
    try {
      const fullEquation = equation + display;
      const result = eval(fullEquation);
      setDisplay(result.toString());
      addToHistory(fullEquation + ' = ', result.toString());
      setEquation('');
      setIsNewCalculation(true);
    } catch (error) {
      setDisplay('Error');
      setIsNewCalculation(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
    setIsNewCalculation(true);
    setHistory([]);
  };

  const clearEntry = () => {
    setDisplay('0');
    setIsNewCalculation(true);
  };

  const toggleSign = () => {
    setDisplay(prev => (parseFloat(prev) * -1).toString());
  };

  const standardButtons = [
    { text: 'MC', action: () => handleMemory('MC'), className: 'text-cyan-400', title: 'Limpar memória' },
    { text: 'MR', action: () => handleMemory('MR'), className: 'text-cyan-400', title: 'Recuperar da memória' },
    { text: 'M+', action: () => handleMemory('M+'), className: 'text-cyan-400', title: 'Adicionar à memória' },
    { text: 'M-', action: () => handleMemory('M-'), className: 'text-cyan-400', title: 'Subtrair da memória' },
    { text: '√', action: () => handleSpecialOperation('√'), className: 'text-emerald-400', title: 'Raiz quadrada' },
    { text: 'x²', action: () => handleSpecialOperation('x²'), className: 'text-emerald-400', title: 'Elevar ao quadrado' },
    { text: '1/x', action: () => handleSpecialOperation('1/x'), className: 'text-emerald-400', title: 'Inverso' },
    { text: '%', action: () => handleSpecialOperation('%'), className: 'text-emerald-400', title: 'Porcentagem' },
    { text: 'CE', action: clearEntry, className: 'text-red-400', title: 'Limpar entrada atual' },
    { text: 'C', action: clear, className: 'text-red-400', title: 'Limpar tudo' },
    { text: '⌫', action: () => setDisplay(prev => prev.slice(0, -1) || '0'), className: 'text-red-400', title: 'Apagar' },
    { text: '÷', action: () => handleOperator('/'), className: 'text-yellow-400', title: 'Dividir' },
    { text: '7', action: () => handleNumber('7') },
    { text: '8', action: () => handleNumber('8') },
    { text: '9', action: () => handleNumber('9') },
    { text: '×', action: () => handleOperator('*'), className: 'text-yellow-400', title: 'Multiplicar' },
    { text: '4', action: () => handleNumber('4') },
    { text: '5', action: () => handleNumber('5') },
    { text: '6', action: () => handleNumber('6') },
    { text: '-', action: () => handleOperator('-'), className: 'text-yellow-400', title: 'Subtrair' },
    { text: '1', action: () => handleNumber('1') },
    { text: '2', action: () => handleNumber('2') },
    { text: '3', action: () => handleNumber('3') },
    { text: '+', action: () => handleOperator('+'), className: 'text-yellow-400', title: 'Adicionar' },
    { text: '±', action: toggleSign, title: 'Inverter sinal' },
    { text: '0', action: () => handleNumber('0') },
    { text: '.', action: () => handleNumber('.'), title: 'Ponto decimal' },
    { text: '=', action: calculate, className: 'bg-blue-500 hover:bg-blue-600', title: 'Calcular' }
  ];

  const scientificButtons = [
    { text: 'sin', action: () => handleScientificOperation('sin'), className: 'text-purple-400', title: 'Seno' },
    { text: 'cos', action: () => handleScientificOperation('cos'), className: 'text-purple-400', title: 'Cosseno' },
    { text: 'tan', action: () => handleScientificOperation('tan'), className: 'text-purple-400', title: 'Tangente' },
    { text: angleUnit, action: () => setAngleUnit(prev => prev === 'DEG' ? 'RAD' : 'DEG'), className: 'text-purple-400', title: 'Alternar entre graus e radianos' },
    { text: 'ln', action: () => handleScientificOperation('ln'), className: 'text-purple-400', title: 'Logaritmo natural' },
    { text: 'log', action: () => handleScientificOperation('log'), className: 'text-purple-400', title: 'Logaritmo base 10' },
    { text: 'exp', action: () => handleScientificOperation('exp'), className: 'text-purple-400', title: 'e elevado a x' },
    { text: 'x^y', action: () => handleScientificOperation('x^y'), className: 'text-purple-400', title: 'x elevado a y' },
    { text: 'π', action: () => handleScientificOperation('π'), className: 'text-purple-400', title: 'Pi' },
    { text: 'e', action: () => handleScientificOperation('e'), className: 'text-purple-400', title: 'Número de Euler' },
    { text: '|x|', action: () => handleScientificOperation('|x|'), className: 'text-purple-400', title: 'Valor absoluto' },
    { text: 'x!', action: () => handleScientificOperation('x!'), className: 'text-purple-400', title: 'Fatorial' }
  ];

  const buttons = isScientific 
    ? [...scientificButtons, ...standardButtons]
    : standardButtons;

  if (!isOpen) return null;

  return (
    <Draggable
      handle=".drag-handle"
      defaultPosition={{ x: window.innerWidth / 2 - 160, y: window.innerHeight / 2 - 200 }}
      position={null}
      onStop={(e, data) => {
        setPosition({ x: data.x, y: data.y });
      }}
    >
      <div className="fixed z-50">
        <div className={`
          bg-gray-100 dark:bg-navy-800 p-4 rounded-lg shadow-xl 
          ${isScientific 
            ? 'w-[95vw] md:w-96 max-w-[400px]' 
            : 'w-[90vw] md:w-80 max-w-[320px]'
          } 
          border border-gray-300 dark:border-navy-600
        `}>
          {/* Header with drag handle and mode toggle */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1 drag-handle cursor-move">
              <h3 className="text-gray-900 dark:text-white text-lg font-semibold select-none">
                {isScientific ? 'Calculadora Científica' : 'Calculadora'}
              </h3>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 select-none">
                {isScientific ? `${angleUnit} | Científica` : 'Padrão'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsScientific(prev => !prev)}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-navy-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
                title={isScientific ? 'Modo padrão' : 'Modo científico'}
              >
                {isScientific ? <CalculatorIcon size={18} /> : <Binary size={18} />}
              </button>
              <button 
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-navy-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
                style={{ minWidth: '40px', minHeight: '40px', touchAction: 'manipulation' }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          {/* Display */}
          <div className="bg-white dark:bg-navy-900 p-4 rounded-lg mb-4 text-right">
            {/* History */}
            <div className="h-12 overflow-y-auto text-xs text-gray-500 dark:text-gray-400 mb-2">
              {history.map((item, index) => (
                <div key={index}>
                  {item.equation}{item.result}
                </div>
              ))}
            </div>
            {/* Current calculation */}
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">{equation}</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{display}</div>
          </div>

          {/* Buttons Grid */}
          <div className={`
            grid gap-2
            ${isScientific 
              ? 'grid-cols-4 md:grid-cols-8' 
              : 'grid-cols-4'
            }
          `}>
            {buttons.map((button, index) => (
              <button
                key={index}
                onClick={button.action}
                className={`
                  p-2 rounded-lg font-medium text-sm md:text-base
                  ${button.className || 'text-gray-900 dark:text-white'}
                  ${button.text === '=' ? 'col-span-1' : ''}
                  hover:bg-gray-200 dark:hover:bg-navy-700
                  transition-colors
                  ${isScientific && index < scientificButtons.length 
                    ? 'col-span-1 md:col-span-2' 
                    : ''
                  }
                `}
                title={button.title}
                style={{ touchAction: 'manipulation' }}
              >
                {button.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Draggable>
  );
}
