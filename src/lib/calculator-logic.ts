const sanitizeForFunction = (expression: string, mode: 'deg' | 'rad'): string => {
  let sanitized = expression
    .replace(/\s/g, '')
    .replace(/π/g, 'Math.PI')
    // Lookbehind to avoid replacing 'e' in words like 'The' or 'value'
    .replace(/(?<![a-zA-Z])e(?![a-zA-Z])/g, 'Math.E')
    .replace(/\^/g, '**');

  // Trigonometry with degree/radian conversion
  const trigRegex = /(sin|cos|tan)\(([^)]+)\)/g;
  sanitized = sanitized.replace(trigRegex, (match, func, value) => {
    // This sub-expression needs to be evaluated first if it contains math
    const subEvaluator = new Function(`return ${value}`);
    const numericValue = subEvaluator();
    
    if (mode === 'deg') {
      return `Math.${func}(${numericValue} * Math.PI / 180)`;
    }
    return `Math.${func}(${numericValue})`;
  });

  // Other functions that might have nested expressions
  const otherFuncRegex = /(√|log|ln)\(([^)]+)\)/g;
  sanitized = sanitized.replace(otherFuncRegex, (match, funcName, value) => {
      const funcMap: Record<string, string> = { '√': 'sqrt', 'log': 'log10', 'ln': 'log' };
      const jsFunc = funcMap[funcName];
      const subEvaluator = new Function(`return ${value}`);
      const numericValue = subEvaluator();
      return `Math.${jsFunc}(${numericValue})`;
  });

  return sanitized;
};

export const evaluateExpression = (expression: string, mode: 'deg' | 'rad'): string => {
  if (!expression) return '0';
  try {
    // Basic validation to prevent obvious malicious code.
    // Allows numbers, operators, parens, and known function names/symbols.
    const safePattern = /^[0-9+\-*/().,^eπ\s*csinoltavgqrt]+$/;
    if (!safePattern.test(expression)) {
      return 'Invalid Chars';
    }

    const sanitized = sanitizeForFunction(expression, mode);
    
    // Using the Function constructor is safer than eval() as it doesn't access local scope.
    const result = new Function('return ' + sanitized)();

    if (typeof result !== 'number' || !isFinite(result)) {
        return 'Error';
    }

    // Format output for readability
    if (Math.abs(result) > 1e15 || (Math.abs(result) < 1e-10 && result !== 0)) {
        return result.toExponential(5);
    }
    
    return String(parseFloat(result.toFixed(10)));
  } catch (error) {
    console.error("Calculation Error:", error);
    return 'Error';
  }
};
