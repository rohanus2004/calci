'use client';

import { useState } from 'react';
import type { HistoryItem } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Calculator, Dna, Ruler, History, BrainCircuit } from 'lucide-react';
import { CalculatorView } from './calculator-view';
import { UnitConverterView } from './unit-converter-view';
import { AiFormulaToolView } from './ai-formula-tool-view';

export function EngineersToolkit() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [recalledHistory, setRecalledHistory] = useState<HistoryItem | null>(null);

  const addToHistory = (item: HistoryItem) => {
    setHistory(prev => [item, ...prev].slice(0, 50)); // Keep last 50 calculations
  };

  const handleHistoryClick = (item: HistoryItem) => {
    setRecalledHistory(item);
  };
  
  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-4">
      <div className="flex-grow">
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="calculator"><Calculator className="w-4 h-4 mr-2" />Calculator</TabsTrigger>
            <TabsTrigger value="unit-converter"><Ruler className="w-4 h-4 mr-2" />Unit Converter</TabsTrigger>
            <TabsTrigger value="ai-suggester"><BrainCircuit className="w-4 h-4 mr-2" />AI Suggester</TabsTrigger>
          </TabsList>
          <TabsContent value="calculator">
            <CalculatorView
              addToHistory={addToHistory}
              recalledHistory={recalledHistory}
              clearRecalledHistory={() => setRecalledHistory(null)}
            />
          </TabsContent>
          <TabsContent value="unit-converter">
            <UnitConverterView />
          </TabsContent>
          <TabsContent value="ai-suggester">
            <AiFormulaToolView />
          </TabsContent>
        </Tabs>
      </div>

      <Card className="lg:w-[340px] w-full shrink-0 h-fit lg:max-h-[720px]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium flex items-center"><History className="mr-2" /> History</CardTitle>
          <Button variant="ghost" size="sm" onClick={clearHistory} disabled={history.length === 0}>Clear</Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] lg:h-[600px] pr-3">
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center pt-8">Your calculations will appear here.</p>
            ) : (
              <div className="space-y-4">
                {history.map((item, index) => (
                  <div key={index} className="text-sm cursor-pointer group" onClick={() => handleHistoryClick(item)}>
                    <p className="text-muted-foreground truncate group-hover:text-foreground transition-colors">{item.formula}</p>
                    <p className="text-right text-lg font-semibold group-hover:text-accent transition-colors">{item.result}</p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
