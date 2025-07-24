const factorial = (n: number): number => {
  if (n < 0 || n % 1 !== 0) return NaN; // Factorial is only for non-negative integers
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};

const nPr = (n: number, r: number): number => {
    if (n < r || n < 0 || r < 0) return NaN;
    return factorial(n) / factorial(n - r);
};

const nCr = (n: number, r: number): number => {
    if (n < r || n < 0 || r < 0) return NaN;
    return factorial(n) / (factorial(r) * factorial(n - r));
};

const sanitizeForFunction = (expression: string, mode: 'deg' | 'rad'): string => {
  let sanitized = expression
    .replace(/\s/g, '')
    .replace(/π/g, 'Math.PI')
    .replace(/(?<![a-zA-Z])e(?![a-zA-Z])/g, 'Math.E')
    .replace(/\^/g, '**');

  // Handle factorial: find numbers followed by '!'
  sanitized = sanitized.replace(/(\d+(\.\d+)?)!/g, (match, num) => `factorial(${num})`);

  // Recursively handle nested functions
  const evaluateNested = (expr: string): string => {
      // This regex handles nested parentheses and multiple arguments for ncr/npr
      const funcRegex = /(sin|cos|tan|√|log|ln|exp|ncr|npr)\(((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*)\)/;

      while (funcRegex.test(expr)) {
          expr = expr.replace(funcRegex, (match, funcName, value) => {
              const evaluatedValue = evaluateNested(value);
              if (['sin', 'cos', 'tan'].includes(funcName) && mode === 'deg') {
                  return `Math.${funcName}(${evaluatedValue} * Math.PI / 180)`;
              }
              const funcMap: Record<string, string> = { 
                  '√': 'sqrt', 'log': 'log10', 'ln': 'log', 'exp': 'exp',
                  'sin': 'sin', 'cos': 'cos', 'tan': 'tan',
                  'ncr': 'nCr', 'npr': 'nPr'
              };
              const jsFunc = funcMap[funcName as keyof typeof funcMap];
              
              if (jsFunc === 'nCr' || jsFunc === 'nPr') {
                  return `${jsFunc}(${evaluatedValue})`;
              }
              return `Math.${jsFunc}(${evaluatedValue})`;
          });
      }
      return expr;
  };
  
  sanitized = evaluateNested(sanitized);

  return sanitized;
};

export const evaluateExpression = (expression: string, mode: 'deg' | 'rad'): string => {
  if (!expression) return '0';
  try {
    const safePattern = /^[0-9+\-*/().,^eπ\s!csinoltavgqrtpncr]+$/;
    if (!safePattern.test(expression)) {
      return 'Invalid Chars';
    }

    const sanitized = sanitizeForFunction(expression, mode);
    
    const calculatorFunction = new Function('factorial', 'nCr', 'nPr', 'return ' + sanitized);
    const result = calculatorFunction(factorial, nCr, nPr);

    if (typeof result !== 'number' || !isFinite(result)) {
        return 'Error';
    }

    if (Math.abs(result) > 1e15 || (Math.abs(result) < 1e-10 && result !== 0)) {
        return result.toExponential(5);
    }
    
    return String(parseFloat(result.toFixed(10)));
  } catch (error) {
    console.error("Calculation Error:", error);
    return 'Error';
  }
};
