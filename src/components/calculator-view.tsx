'use client';

import { useState, useEffect } from 'react';
import type { HistoryItem } from '@/lib/types';
import { evaluateExpression } from '@/lib/calculator-logic';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Minus, X, Divide, Percent, Equal, CornerDownLeft } from 'lucide-react';
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
    }
    if (isResult) {
      setFormula(input);
      setCurrentValue(input);
      setIsResult(false);
    } else {
      if (currentValue === '0' && input !== '.') {
        setCurrentValue(input);
        setFormula(prev => prev + input);
      } else {
        setCurrentValue(prev => prev + input);
        setFormula(prev => prev + input);
      }
    }
  };

  const handleOperator = (op: string) => {
    if (hasError) return;
    setFormula(prev => prev + op);
    setCurrentValue('0');
    setIsResult(false);
  };

  const handleFunction = (func: string) => {
    if (hasError) return;
    setFormula(prev => prev + func + '(');
    setCurrentValue('0');
    setIsResult(false);
  };
  
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
    if (isResult) return;
    
    setFormula(prev => prev.slice(0, -1));
    setCurrentValue(prev => {
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

  const buttonBaseStyle = "text-xl h-16 transition-transform duration-100 active:scale-95 shadow-md border-b-4 border-gray-300 dark:border-gray-600";
  const numberButtonStyle = "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-foreground";
  const operatorButtonStyle = "bg-primary/20 hover:bg-primary/30 text-primary";
  const specialButtonStyle = "bg-secondary hover:bg-secondary/80 text-secondary-foreground";

  const buttons = [
    { label: mode === 'deg' ? 'Rad' : 'Deg', action: () => setMode(m => m === 'deg' ? 'rad' : 'deg'), style: specialButtonStyle },
    { label: 'xʸ', action: () => handleOperator('^'), style: specialButtonStyle },
    { label: '(', action: () => setFormula(f => f + '('), style: specialButtonStyle },
    { label: ')', action: () => setFormula(f => f + ')'), style: specialButtonStyle },
    { label: 'AC', action: handleClear, style: "bg-blue-200 hover:bg-blue-300 text-blue-800" },
    { label: 'sin', action: () => handleFunction('sin'), style: specialButtonStyle },
    { label: 'ln', action: () => handleFunction('ln'), style: specialButtonStyle },
    { label: '7', action: () => handleInput('7'), style: numberButtonStyle },
    { label: '8', action: () => handleInput('8'), style: numberButtonStyle },
    { label: '9', action: () => handleInput('9'), style: numberButtonStyle },
    { label: 'cos', action: () => handleFunction('cos'), style: specialButtonStyle },
    { label: 'log', action: () => handleFunction('log'), style: specialButtonStyle },
    { label: '4', action: () => handleInput('4'), style: numberButtonStyle },
    { label: '5', action: () => handleInput('5'), style: numberButtonStyle },
    { label: '6', action: () => handleInput('6'), style: numberButtonStyle },
    { label: 'tan', action: () => handleFunction('tan'), style: specialButtonStyle },
    { label: '√', action: () => handleFunction('√'), style: specialButtonStyle },
    { label: '1', action: () => handleInput('1'), style: numberButtonStyle },
    { label: '2', action: () => handleInput('2'), style: numberButtonStyle },
    { label: '3', action: () => handleInput('3'), style: numberButtonStyle },
    { label: 'e', action: () => handleInput('e'), style: specialButtonStyle },
    { label: 'π', action: () => handleInput('π'), style: specialButtonStyle },
    { label: '0', action: () => handleInput('0'), className: 'col-span-2', style: numberButtonStyle },
    { label: '.', action: () => handleInput('.'), style: numberButtonStyle },
  ];

  const operatorButtons = [
      { label: <Divide />, action: () => handleOperator('/') },
      { label: <X />, action: () => handleOperator('*') },
      { label: <Minus />, action: () => handleOperator('-') },
      { label: <Plus />, action: () => handleOperator('+') },
      { label: <Equal />, action: handleEquals, className: 'row-span-2' },
  ];

  return (
    <Card className="p-4 w-full max-w-[800px] mx-auto overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Display */}
        <div className="bg-muted/50 rounded-md p-4 mb-4 text-right break-words">
          <ScrollArea className="h-10">
            <p className="text-muted-foreground text-xl font-mono h-full flex items-center justify-end">{formula || ' '}</p>
          </ScrollArea>
          <p className="text-4xl md:text-5xl font-semibold font-mono tracking-tight" data-testid="display">{currentValue}</p>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 flex-grow">
          <div className="grid grid-cols-5 gap-2">
            {buttons.map((btn, i) => (
              <Button
                key={i}
                variant="ghost"
                className={cn(buttonBaseStyle, btn.style, btn.className)}
                onClick={btn.action}
              >
                {btn.label}
              </Button>
            ))}
             <Button variant="ghost" className={cn(buttonBaseStyle, specialButtonStyle)} onClick={handlePlusMinus}><PlusMinus /></Button>
             <Button variant="ghost" className={cn(buttonBaseStyle, specialButtonStyle)} onClick={handleBackspace}><CornerDownLeft /></Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
            {operatorButtons.map((btn, i) => (
                <Button
                    key={i}
                    variant="ghost"
                    className={cn(buttonBaseStyle, operatorButtonStyle, btn.className, 'h-full')}
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
