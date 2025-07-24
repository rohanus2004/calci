'use client';

import { useState, useEffect } from 'react';
import type { HistoryItem } from '@/lib/types';
import { evaluateExpression } from '@/lib/calculator-logic';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Minus, X, Divide, Equal, CornerDownLeft } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';

interface CalculatorViewProps {
  addToHistory: (item: HistoryItem) => void;
  recalledHistory: HistoryItem | null;
  clearRecalledHistory: () => void;
}

const PlusMinus = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="M12 5v14" />
        <path d="M5 19h14" />
    </svg>
);


export function CalculatorView({ addToHistory, recalledHistory, clearRecalledHistory }: CalculatorViewProps) {
  const [currentValue, setCurrentValue] = useState('0');
  const [formula, setFormula] = useState('');
  const [isResult, setIsResult] = useState(false);
  const [mode, setMode] = useState<'deg' | 'rad'>('deg');
  const [hasError, setHasError] = useState(false);
  const [showScientific, setShowScientific] = useState(false);

  useEffect(() => {
    if (recalledHistory) {
      setFormula(recalledHistory.formula);
      setCurrentValue(recalledHistory.result);
      setIsResult(true);
      clearRecalledHistory();
    }
  }, [recalledHistory, clearRecalledHistory]);

  const handleInput = (input: string) => {
    if (hasError) {
      handleClear();
      return;
    }
    if (isResult) {
      if (['+', '-', '*', '/'].includes(input)) {
        setFormula(currentValue + input);
        setCurrentValue('0');
        setIsResult(false);
      } else {
        setFormula(input);
        setCurrentValue(input);
        setIsResult(false);
      }
    } else {
        if (currentValue === '0' && input !== '.') {
            setCurrentValue(input);
        } else if (input === ',' || input ==='(') {
            // don't change current value for comma or open paren
        }
         else {
            setCurrentValue(prev => prev + input);
        }
        setFormula(prev => prev + input);
    }
  };

  const handleOperator = (op: string) => {
    if (hasError) return;
    if (isResult) {
        setIsResult(false);
    }
    setFormula(prev => prev + op);
    setCurrentValue('0');
  };

  const handleFunction = (func: string) => {
    if (hasError) return;
    setFormula(prev => prev + func + '(');
    setCurrentValue('0');
    setIsResult(false);
  };
  
  const handleFactorial = () => {
    if (hasError) return;
    setFormula(prev => prev + '!');
    setIsResult(false);
  }

  const handleEquals = () => {
    if (hasError || !formula) return;
    const result = evaluateExpression(formula, mode);
    if (result === 'Error' || result === 'Invalid Chars') {
      setCurrentValue(result);
      setHasError(true);
    } else {
      addToHistory({ formula, result });
      setCurrentValue(result);
      setFormula(result);
      setIsResult(true);
    }
  };
  
  const handleClear = () => {
    setCurrentValue('0');
    setFormula('');
    setIsResult(false);
    setHasError(false);
  };
  
  const handleBackspace = () => {
    if (hasError) {
        handleClear();
        return;
    }
    if (isResult) {
        handleClear();
        return;
    };
    
    setFormula(prev => prev.slice(0, -1));
    setCurrentValue(prev => {
        const lastChar = formula.charAt(formula.length - 1);
        const operators = ['+', '-', '*', '/'];
        if (operators.includes(lastChar)) {
            // Find the last number in the formula string
            const formulaParts = formula.split(/([+\-*/])/);
            return formulaParts[formulaParts.length - 2] || '0';
        }
        
        const newValue = prev.slice(0, -1);
        return newValue === '' ? '0' : newValue;
    });
  };

  const handlePlusMinus = () => {
    if (currentValue !== '0' && !hasError) {
        const newValue = (parseFloat(currentValue) * -1).toString();
        const formulaEndsWithCurrent = formula.endsWith(currentValue);
        
        if (formulaEndsWithCurrent) {
            setFormula(prev => prev.substring(0, prev.length - currentValue.length) + `(${newValue})`);
        } else {
            setFormula(prev => prev + `(${newValue})`);
        }
        setCurrentValue(newValue);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.key >= '0' && e.key <= '9') {
        handleInput(e.key);
      } else if (['+', '-', '*', '/'].includes(e.key)) {
        handleOperator(e.key);
      } else if (e.key === '.') {
        handleInput('.');
      } else if (e.key === ',') {
        handleInput(',');
      } else if (e.key === 'Enter' || e.key === '=') {
        handleEquals();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      } else if (e.key === '(' || e.key === ')') {
        handleInput(e.key);
      } else if (e.key === '!') {
        handleFactorial();
      } else if (e.key.toLowerCase() === 'p') {
        handleFunction('npr');
      } else if (e.key.toLowerCase() === 'c') {
        handleFunction('ncr');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentValue, formula]);

  const buttonBaseStyle = "text-xl h-14 sm:h-16 transition-transform duration-100 active:scale-95 shadow-md border-b-4";
  const numberButtonStyle = "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-foreground border-gray-300 dark:border-gray-600";
  const operatorButtonStyle = "bg-primary/20 hover:bg-primary/30 text-primary border-primary/40";
  const specialButtonStyle = "bg-secondary hover:bg-secondary/80 text-secondary-foreground border-gray-300 dark:border-gray-500";
  const clearButtonStyle = "bg-blue-200 hover:bg-blue-300 text-blue-800 border-blue-400";
  
  const scientificButtons = [
    { label: 'sin', action: () => handleFunction('sin'), style: specialButtonStyle },
    { label: 'cos', action: () => handleFunction('cos'), style: specialButtonStyle },
    { label: 'tan', action: () => handleFunction('tan'), style: specialButtonStyle },
    { label: 'log', action: () => handleFunction('log'), style: specialButtonStyle },
    
    { label: 'ln', action: () => handleFunction('ln'), style: specialButtonStyle },
    { label: '(', action: () => handleInput('('), style: specialButtonStyle },
    { label: ')', action: () => handleInput(')'), style: specialButtonStyle },
    { label: ',', action: () => handleInput(','), style: specialButtonStyle },

    { label: 'x²', action: () => handleOperator('^2'), style: specialButtonStyle },
    { label: 'xʸ', action: () => handleOperator('^'), style: specialButtonStyle },
    { label: '√', action: () => handleFunction('√'), style: specialButtonStyle },
    { label: 'n!', action: handleFactorial, style: specialButtonStyle },
    
    { label: 'π', action: () => handleInput('π'), style: specialButtonStyle },
    { label: 'nPr', action: () => handleFunction('npr'), style: specialButtonStyle },
    { label: 'nCr', action: () => handleFunction('ncr'), style: specialButtonStyle },
    { label: mode === 'deg' ? 'Rad' : 'Deg', action: () => setMode(m => m === 'deg' ? 'rad' : 'deg'), style: specialButtonStyle },
  ];

  const mainButtons = [
    { label: 'AC', action: handleClear, style: clearButtonStyle },
    { label: <PlusMinus />, action: handlePlusMinus, style: specialButtonStyle },
    { label: <CornerDownLeft />, action: handleBackspace, style: specialButtonStyle },
    { label: '7', action: () => handleInput('7'), style: numberButtonStyle },
    { label: '8', action: () => handleInput('8'), style: numberButtonStyle },
    { label: '9', action: () => handleInput('9'), style: numberButtonStyle },
    { label: '4', action: () => handleInput('4'), style: numberButtonStyle },
    { label: '5', action: () => handleInput('5'), style: numberButtonStyle },
    { label: '6', action: () => handleInput('6'), style: numberButtonStyle },
    { label: '1', action: () => handleInput('1'), style: numberButtonStyle },
    { label: '2', action: () => handleInput('2'), style: numberButtonStyle },
    { label: '3', action: () => handleInput('3'), style: numberButtonStyle },
    { label: '0', action: () => handleInput('0'), style: numberButtonStyle, className: 'col-span-2' },
    { label: '.', action: () => handleInput('.'), style: numberButtonStyle },
  ];
  
  const basicOperators = [
      { label: <Divide />, action: () => handleOperator('/'), style: operatorButtonStyle },
      { label: <X />, action: () => handleOperator('*'), style: operatorButtonStyle },
      { label: <Minus />, action: () => handleOperator('-'), style: operatorButtonStyle },
      { label: <Plus />, action: () => handleOperator('+'), style: operatorButtonStyle },
      { label: <Equal />, action: handleEquals, style: operatorButtonStyle },
  ];

  return (
    <Card className="p-2 sm:p-4 w-full max-w-md mx-auto overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="bg-muted/50 rounded-md p-4 mb-4 text-right break-words">
          <ScrollArea className="h-10">
            <p className="text-muted-foreground text-lg sm:text-xl font-mono h-full flex items-center justify-end">{formula || ' '}</p>
          </ScrollArea>
          <p className="text-4xl sm:text-5xl font-semibold font-mono tracking-tight" data-testid="display">{currentValue}</p>
        </div>

        <div className="flex items-center space-x-2 mb-4 px-1">
          <Label htmlFor="scientific-mode">More</Label>
          <Switch id="scientific-mode" checked={showScientific} onCheckedChange={setShowScientific} />
        </div>
        
        <div className="flex-grow grid grid-cols-[3fr_1fr] gap-2">
            <div className='flex flex-col gap-2'>
                {showScientific && (
                    <div className="grid grid-cols-4 gap-1 sm:gap-2 mb-2">
                        {scientificButtons.map((btn, i) => (
                        <Button
                            key={`sci-${i}`}
                            variant="ghost"
                            className={cn(buttonBaseStyle, btn.style, "h-12 sm:h-14 text-lg")}
                            onClick={btn.action}
                        >
                            {btn.label}
                        </Button>
                        ))}
                    </div>
                )}
                <div className="grid grid-cols-3 gap-1 sm:gap-2 flex-grow">
                    {mainButtons.map((btn, i) => (
                    <Button
                        key={`main-${i}`}
                        variant="ghost"
                        className={cn(buttonBaseStyle, btn.style, btn.className)}
                        onClick={btn.action}
                    >
                        {btn.label}
                    </Button>
                    ))}
                </div>
            </div>

            <div className="grid grid-rows-5 gap-1 sm:gap-2">
                {basicOperators.map((btn, i) => (
                    <Button
                        key={`op-${i}`}
                        variant="ghost"
                        className={cn(buttonBaseStyle, btn.style, 'h-full')}
                        onClick={btn.action}
                    >
                        {btn.label}
                    </Button>
                ))}
            </div>
        </div>
      </div>
    </Card>
  );
}

    