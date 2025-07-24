export type UnitCategory = 'Length' | 'Temperature' | 'Mass' | 'Area' | 'Volume' | 'Time';

export type Unit = {
  name: string;
  symbol: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
};

export const units: Record<UnitCategory, Unit[]> = {
  Length: [
    { name: 'Meter', symbol: 'm', toBase: v => v, fromBase: v => v },
    { name: 'Kilometer', symbol: 'km', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { name: 'Centimeter', symbol: 'cm', toBase: v => v / 100, fromBase: v => v * 100 },
    { name: 'Millimeter', symbol: 'mm', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { name: 'Mile', symbol: 'mi', toBase: v => v * 1609.34, fromBase: v => v / 1609.34 },
    { name: 'Yard', symbol: 'yd', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
    { name: 'Foot', symbol: 'ft', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
    { name: 'Inch', symbol: 'in', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
  ],
  Temperature: [
    { name: 'Celsius', symbol: '°C', toBase: v => v, fromBase: v => v },
    { name: 'Fahrenheit', symbol: '°F', toBase: v => (v - 32) * 5/9, fromBase: v => v * 9/5 + 32 },
    { name: 'Kelvin', symbol: 'K', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
  ],
  Mass: [
      { name: 'Kilogram', symbol: 'kg', toBase: v => v, fromBase: v => v },
      { name: 'Gram', symbol: 'g', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { name: 'Milligram', symbol: 'mg', toBase: v => v / 1e+6, fromBase: v => v * 1e+6 },
      { name: 'Pound', symbol: 'lb', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
      { name: 'Ounce', symbol: 'oz', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
  ],
  Area: [
    { name: 'Square Meter', symbol: 'm²', toBase: v => v, fromBase: v => v },
    { name: 'Square Kilometer', symbol: 'km²', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
    { name: 'Square Foot', symbol: 'ft²', toBase: v => v * 0.092903, fromBase: v => v / 0.092903 },
    { name: 'Acre', symbol: 'ac', toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
  ],
  Volume: [
    { name: 'Liter', symbol: 'L', toBase: v => v, fromBase: v => v },
    { name: 'Milliliter', symbol: 'mL', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { name: 'Cubic Meter', symbol: 'm³', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { name: 'Gallon (US)', symbol: 'gal', toBase: v => v * 3.78541, fromBase: v => v / 3.78541 },
  ],
  Time: [
    { name: 'Second', symbol: 's', toBase: v => v, fromBase: v => v },
    { name: 'Minute', symbol: 'min', toBase: v => v * 60, fromBase: v => v / 60 },
    { name: 'Hour', symbol: 'hr', toBase: v => v * 3600, fromBase: v => v / 3600 },
    { name: 'Day', symbol: 'd', toBase: v => v * 86400, fromBase: v => v / 86400 },
  ],
};

export const convertUnit = (value: number, fromUnitSymbol: string, toUnitSymbol: string, category: UnitCategory): number => {
    const categoryUnits = units[category];
    const fromUnit = categoryUnits.find(u => u.symbol === fromUnitSymbol);
    const toUnit = categoryUnits.find(u => u.symbol === toUnitSymbol);

    if (!fromUnit || !toUnit) {
        throw new Error('Invalid unit specified.');
    }
    
    if(fromUnit.symbol === toUnit.symbol) {
        return value;
    }

    const baseValue = fromUnit.toBase(value);
    const convertedValue = toUnit.fromBase(baseValue);
    
    return convertedValue;
}
