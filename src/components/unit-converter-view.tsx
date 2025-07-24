'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { units, convertUnit } from '@/lib/unit-conversions';
import type { UnitCategory, Unit } from '@/lib/unit-conversions';
import { ArrowRightLeft } from 'lucide-react';
import { Button } from './ui/button';


export function UnitConverterView() {
  const [category, setCategory] = useState<UnitCategory>('Length');
  const [fromUnit, setFromUnit] = useState<string>(units.Length[0].symbol);
  const [toUnit, setToUnit] = useState<string>(units.Length[6].symbol);
  const [fromValue, setFromValue] = useState<string>('1');
  const [toValue, setToValue] = useState<string>('');

  const availableUnits = useMemo(() => units[category], [category]);

  useEffect(() => {
    setFromUnit(availableUnits[0].symbol);
    setToUnit(availableUnits.length > 1 ? availableUnits[1].symbol : availableUnits[0].symbol);
    setFromValue('1');
  }, [category, availableUnits]);

  useEffect(() => {
    const fromValNum = parseFloat(fromValue);
    if (!isNaN(fromValNum)) {
      try {
        const result = convertUnit(fromValNum, fromUnit, toUnit, category);
        setToValue(Number(result.toPrecision(6)).toString());
      } catch (error) {
        setToValue('Error');
      }
    } else {
      setToValue('');
    }
  }, [fromValue, fromUnit, toUnit, category]);

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromValue(e.target.value);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const toValNum = parseFloat(e.target.value);
    setToValue(e.target.value);
    if (!isNaN(toValNum)) {
      try {
        const result = convertUnit(toValNum, toUnit, fromUnit, category);
        setFromValue(Number(result.toPrecision(6)).toString());
      } catch (error) {
        setFromValue('Error');
      }
    } else {
      setFromValue('');
    }
  };

  const swapUnits = () => {
    const tempUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    setFromValue(toValue);
  };

  return (
    <Card className="p-4 w-full max-w-4xl mx-auto">
      <CardContent className="p-2 sm:p-6">
        <div className="grid gap-4 md:gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select value={category} onValueChange={(v) => setCategory(v as UnitCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(units).map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid md:grid-cols-[1fr_auto_1fr] items-end gap-4">
            <div className="space-y-2">
              <label htmlFor="from-unit" className="text-sm font-medium">From</label>
              <div className="flex gap-2">
                <Input id="from-value" type="number" value={fromValue} onChange={handleFromChange} className="w-2/3"/>
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger className="w-1/3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUnits.map(unit => <SelectItem key={unit.symbol} value={unit.symbol}>{unit.symbol}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button variant="ghost" size="icon" onClick={swapUnits} className="my-2 md:mb-2 mx-auto">
              <ArrowRightLeft className="w-5 h-5" />
            </Button>

            <div className="space-y-2">
              <label htmlFor="to-unit" className="text-sm font-medium">To</label>
              <div className="flex gap-2">
                <Input id="to-value" type="number" value={toValue} onChange={handleToChange} className="w-2/3"/>
                <Select value={toUnit} onValueChange={setToUnit}>
                  <SelectTrigger className="w-1/3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUnits.map(unit => <SelectItem key={unit.symbol} value={unit.symbol}>{unit.symbol}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
