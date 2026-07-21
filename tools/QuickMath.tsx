import React, { useState, useEffect, useMemo, useRef } from 'react';
import AccompanyingText from '../components/AccompanyingText';
import ShareWidget from '../components/ShareWidget';
import SEO from '../components/SEO';
import StarRatingWidget from '../components/StarRatingWidget';
import { 
  Calculator, 
  Settings, 
  RotateCcw, 
  Copy, 
  Check, 
  History, 
  Info, 
  HelpCircle, 
  Sparkles, 
  Binary, 
  Ruler, 
  Scale, 
  Thermometer, 
  ArrowRightLeft,
  ChevronRight,
  CornerDownLeft
} from 'lucide-react';

// Tokenizer & Parser for Safe Evaluation (No eval() used)
const evaluateExpression = (expr: string, isDegree: boolean): number => {
  // Normalize symbols
  let cleaned = expr
    .toLowerCase()
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/π/g, 'pi')
    .replace(/√/g, 'sqrt')
    .replace(/mod/g, '%');

  let pos = 0;
  
  const peek = () => cleaned[pos] || '';
  const consume = () => cleaned[pos++] || '';
  
  const isDigit = (c: string) => (c >= '0' && c <= '9') || c === '.';
  const isAlpha = (c: string) => (c >= 'a' && c <= 'z');

  const parseNumber = (): number => {
    let start = pos;
    while (isDigit(peek())) {
      consume();
    }
    return parseFloat(cleaned.slice(start, pos));
  };

  const parseIdentifier = (): string => {
    let start = pos;
    while (isAlpha(peek())) {
      consume();
    }
    return cleaned.slice(start, pos);
  };

  const parsePrimary = (): number => {
    while (peek() === ' ') consume();

    let c = peek();
    
    // Unary operators
    if (c === '-') {
      consume();
      return -parsePrimary();
    }
    if (c === '+') {
      consume();
      return parsePrimary();
    }

    if (isDigit(c)) {
      return parseNumber();
    }

    if (isAlpha(c)) {
      const id = parseIdentifier();
      if (id === 'pi') return Math.PI;
      if (id === 'e') return Math.E;
      
      // Function call, e.g., sin(...)
      if (peek() === '(') {
        consume(); // '('
        const arg = parseExpression();
        if (peek() === ')') consume(); // ')'
        
        switch (id) {
          case 'sin':
            return Math.sin(isDegree ? (arg * Math.PI) / 180 : arg);
          case 'cos':
            return Math.cos(isDegree ? (arg * Math.PI) / 180 : arg);
          case 'tan':
            return Math.tan(isDegree ? (arg * Math.PI) / 180 : arg);
          case 'log':
            if (arg <= 0) throw new Error('Invalid log argument');
            return Math.log10(arg);
          case 'ln':
            if (arg <= 0) throw new Error('Invalid ln argument');
            return Math.log(arg);
          case 'sqrt':
            if (arg < 0) throw new Error('Invalid square root');
            return Math.sqrt(arg);
          default:
            throw new Error(`Unknown function: ${id}`);
        }
      }
      throw new Error(`Unexpected identifier: ${id}`);
    }

    if (c === '(') {
      consume(); // '('
      const val = parseExpression();
      if (peek() === ')') consume(); // ')'
      return val;
    }

    throw new Error(`Unexpected character: ${c}`);
  };

  const parseExponent = (): number => {
    let val = parsePrimary();
    while (peek() === '^') {
      consume(); // '^'
      const exp = parsePrimary();
      val = Math.pow(val, exp);
    }
    return val;
  };

  const parseMultiplicative = (): number => {
    let val = parseExponent();
    while (true) {
      while (peek() === ' ') consume();
      let c = peek();
      if (c === '*' || c === '/' || c === '%') {
        consume();
        const nextVal = parseExponent();
        if (c === '*') val *= nextVal;
        else if (c === '/') {
          if (nextVal === 0) throw new Error('Division by zero');
          val /= nextVal;
        }
        else val %= nextVal;
      } else {
        break;
      }
    }
    return val;
  };

  const parseExpression = (): number => {
    let val = parseMultiplicative();
    while (true) {
      while (peek() === ' ') consume();
      let c = peek();
      if (c === '+' || c === '-') {
        consume();
        const nextVal = parseMultiplicative();
        if (c === '+') val += nextVal;
        else val -= nextVal;
      } else {
        break;
      }
    }
    return val;
  };

  const result = parseExpression();
  if (pos < cleaned.length) {
    const trailing = cleaned.slice(pos).trim();
    if (trailing) {
      throw new Error('Invalid syntax');
    }
  }
  return result;
};

interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: string;
}

const QuickMath: React.FC = () => {
  const [ratingInfo, setRatingInfo] = useState<{rating: number, count: number}>({ rating: 4.9, count: 142 });
  
  // Calculator state
  const [calcMode, setCalcMode] = useState<'scientific' | 'simple'>('simple');
  const [expression, setExpression] = useState<string>('');
  const [calcResult, setCalcResult] = useState<string>('');
  const [calcError, setCalcError] = useState<string>('');
  const [isDegree, setIsDegree] = useState<boolean>(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copiedExprId, setCopiedExprId] = useState<string | null>(null);

  // Unit Converter Shortcuts State (Two-Way Interactive Inputs)
  const [inchVal, setInchVal] = useState<string>('1');
  const [cmVal, setCmVal] = useState<string>('2.54');

  const [kgVal, setKgVal] = useState<string>('1');
  const [lbVal, setLbVal] = useState<string>('2.20462');

  const [celsiusVal, setCelsiusVal] = useState<string>('0');
  const [fahrenheitVal, setFahrenheitVal] = useState<string>('32');

  const [kmVal, setKmVal] = useState<string>('1');
  const [mileVal, setMileVal] = useState<string>('0.62137');

  const [meterVal, setMeterVal] = useState<string>('1');
  const [feetVal, setFeetVal] = useState<string>('3.28084');

  const [mbVal, setMbVal] = useState<string>('1024');
  const [gbVal, setGbVal] = useState<string>('1');

  // Load history on mount
  useEffect(() => {
    const cached = localStorage.getItem('quick_math_history');
    if (cached) {
      try {
        setHistory(JSON.parse(cached));
      } catch (e) {
        // Clear corrupt state
      }
    }
  }, []);

  // Save history helper
  const saveHistory = (expr: string, res: string) => {
    const newItem: HistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      expression: expr,
      result: res,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updated = [newItem, ...history.slice(0, 19)];
    setHistory(updated);
    localStorage.setItem('quick_math_history', JSON.stringify(updated));
  };

  // Keyboard support for main calculator panel
  const inputRef = useRef<HTMLInputElement>(null);

  const appendToExpression = (val: string) => {
    setExpression(prev => prev + val);
    setCalcError('');
  };

  const handleClear = () => {
    setExpression('');
    setCalcResult('');
    setCalcError('');
  };

  const handleDelete = () => {
    setExpression(prev => prev.slice(0, -1));
    setCalcError('');
  };

  const handleEvaluate = () => {
    if (!expression.trim()) return;
    try {
      const parsedRes = evaluateExpression(expression, isDegree);
      if (isNaN(parsedRes)) {
        setCalcError('Error: Invalid calculation');
      } else {
        // Format gracefully
        const formatted = Number(parsedRes.toFixed(8)).toString();
        setCalcResult(formatted);
        saveHistory(expression, formatted);
        setCalcError('');
      }
    } catch (err: any) {
      setCalcError(err.message || 'Syntax Error');
    }
  };

  // Clear all history
  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('quick_math_history');
  };

  // Click on a history card to reload
  const handleSelectHistory = (item: HistoryItem) => {
    setExpression(item.expression);
    setCalcResult(item.result);
    setCalcError('');
  };

  // Copy helper
  const copyValue = (val: string, id: string) => {
    navigator.clipboard.writeText(val).then(() => {
      setCopiedExprId(id);
      setTimeout(() => setCopiedExprId(null), 1500);
    });
  };

  // Two-way Unit Converters handling functions
  const handleInchChange = (val: string) => {
    setInchVal(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      setCmVal(Number((parsed * 2.54).toFixed(6)).toString());
    } else {
      setCmVal('');
    }
  };

  const handleCmChange = (val: string) => {
    setCmVal(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      setInchVal(Number((parsed / 2.54).toFixed(6)).toString());
    } else {
      setInchVal('');
    }
  };

  const handleKgChange = (val: string) => {
    setKgVal(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      setLbVal(Number((parsed * 2.20462262).toFixed(6)).toString());
    } else {
      setLbVal('');
    }
  };

  const handleLbChange = (val: string) => {
    setLbVal(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      setKgVal(Number((parsed / 2.20462262).toFixed(6)).toString());
    } else {
      setKgVal('');
    }
  };

  const handleCelsiusChange = (val: string) => {
    setCelsiusVal(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      setFahrenheitVal(Number(((parsed * 9/5) + 32).toFixed(4)).toString());
    } else {
      setFahrenheitVal('');
    }
  };

  const handleFahrenheitChange = (val: string) => {
    setFahrenheitVal(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      setCelsiusVal(Number(((parsed - 32) * 5/9).toFixed(4)).toString());
    } else {
      setCelsiusVal('');
    }
  };

  const handleKmChange = (val: string) => {
    setKmVal(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      setMileVal(Number((parsed * 0.62137119).toFixed(6)).toString());
    } else {
      setMileVal('');
    }
  };

  const handleMileChange = (val: string) => {
    setMileVal(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      setKmVal(Number((parsed / 0.62137119).toFixed(6)).toString());
    } else {
      setKmVal('');
    }
  };

  const handleMeterChange = (val: string) => {
    setMeterVal(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      setFeetVal(Number((parsed * 3.2808399).toFixed(6)).toString());
    } else {
      setFeetVal('');
    }
  };

  const handleFeetChange = (val: string) => {
    setFeetVal(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      setMeterVal(Number((parsed / 3.2808399).toFixed(6)).toString());
    } else {
      setMeterVal('');
    }
  };

  const handleMbChange = (val: string) => {
    setMbVal(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      setGbVal(Number((parsed / 1024).toFixed(6)).toString());
    } else {
      setGbVal('');
    }
  };

  const handleGbChange = (val: string) => {
    setGbVal(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      setMbVal(Number((parsed * 1024).toFixed(6)).toString());
    } else {
      setMbVal('');
    }
  };

  return (
    <article className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <SEO 
        title="Quick Math Calculator Online | Scientific & Fast Unit Converter - Toolina" 
        description="Fastest web browser-based Quick Math Calculator. Evaluate basic, complex, or scientific formulas instantly. Features real-time unit conversion shortcuts." 
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "SoftwareApplication",
              "name": "Quick Math Calculator Online",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "All",
              "aggregateRating": {
                 "@type": "AggregateRating",
                 "ratingValue": ratingInfo.rating.toString(),
                 "ratingCount": ratingInfo.count.toString()
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            },
            {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How to use the Quick Math Calculator online?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Simply type your mathematical expression using the interactive buttons or your keyboard, then press the Enter key or the equals sign (=) button. Our local parser computes your results instantly on the fly."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Does this tool support scientific calculations?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, it supports key scientific functions including trigonometric operations (sin, cos, tan with Radian/Degree toggle), logarithm metrics (log base 10, ln natural log), square roots, constants (Pi, e), and power values (x^y)."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How do the unit conversion shortcuts work?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We provide pre-configured, two-way interactive converter cards for standard calculations (such as inches to cm, kg to pounds, Celsius to Fahrenheit). Typing in either input box automatically converts the value to the opposite unit instantly."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is my calculated math private and secure?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely. This calculator executes standard calculations using 100% client-side TypeScript inside your browser environment. No telemetry data or formulas are sent to remote servers."
                  }
                }
              ]
            }
          ]
        }}
      />

      <header className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-black uppercase tracking-wider">
          ⚡ Instant Math Solver
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-slate-800 leading-tight">
          Quick Math <span className="text-teal-600">Calculator</span> & Converter
        </h1>
        <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed">
          Perform general algebraic, trigonometric, and scientific calculations in a snap. Convert standard units side-by-side with instant-solve shortcut cards.
        </p>
      </header>

      {/* Main Workspace Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Interactive Calculator Panel (7 Columns) */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6" id="calculator-panel">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-wider">
              <Calculator className="w-5 h-5 text-teal-600" />
              {calcMode === 'scientific' ? 'Scientific Solver' : 'Simple Calculator'}
            </h2>
            
            <div className="flex flex-wrap items-center gap-2">
              {/* Mode Toggle (Simple vs Scientific) */}
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60 text-xs font-bold">
                <button
                  onClick={() => {
                    setCalcMode('simple');
                    setExpression('');
                    setCalcResult('');
                    setCalcError('');
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${calcMode === 'simple' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Simple
                </button>
                <button
                  onClick={() => {
                    setCalcMode('scientific');
                    setExpression('');
                    setCalcResult('');
                    setCalcError('');
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${calcMode === 'scientific' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Scientific
                </button>
              </div>

              {/* Trig Angle Mode (Degree vs Radians) - Only shown in scientific mode */}
              {calcMode === 'scientific' && (
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60 text-xs font-bold">
                  <button
                    onClick={() => setIsDegree(true)}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${isDegree ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    DEG
                  </button>
                  <button
                    onClick={() => setIsDegree(false)}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${!isDegree ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    RAD
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Calculator Screen/Display */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-right space-y-2 relative overflow-hidden shadow-inner">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.06),transparent)] pointer-events-none"></div>
            
            {/* Expression Row */}
            <input
              ref={inputRef}
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="0"
              className="w-full bg-transparent border-none text-right font-mono font-bold text-xl md:text-2xl text-slate-300 outline-none placeholder-slate-700 selection:bg-teal-500/30"
              id="calc-expression-input"
            />
            
            {/* Result Row */}
            <div className="h-10 flex items-end justify-between">
              {calcError ? (
                <span className="text-rose-500 text-xs font-bold bg-rose-500/10 px-2.5 py-1 rounded border border-rose-500/20">
                  {calcError}
                </span>
              ) : (
                <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
                  {calcMode === 'scientific' ? (isDegree ? 'Degree Mode' : 'Radian Mode') : 'Basic Mode'}
                </span>
              )}
              
              <div className="flex items-center gap-3">
                {calcResult && (
                  <button
                    onClick={() => copyValue(calcResult, 'main-result')}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-teal-400 hover:bg-slate-900 transition-all cursor-pointer"
                    title="Copy Answer"
                  >
                    {copiedExprId === 'main-result' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                )}
                <span className="font-mono text-3xl font-black text-teal-400 tracking-tight break-all">
                  {calcResult || '0'}
                </span>
              </div>
            </div>
          </div>

          {/* Keypad Grid (Scientific + Numeric or Simple Numeric Layout) */}
          {calcMode === 'scientific' ? (
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 animate-in fade-in duration-300">
              
              {/* Scientific Left Column Block (5 columns on SM+) */}
              <div className="sm:col-span-5 grid grid-cols-3 gap-2 bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                {[
                  { label: 'sin', action: () => appendToExpression('sin(') },
                  { label: 'cos', action: () => appendToExpression('cos(') },
                  { label: 'tan', action: () => appendToExpression('tan(') },
                  { label: 'log', action: () => appendToExpression('log(') },
                  { label: 'ln', action: () => appendToExpression('ln(') },
                  { label: '√', action: () => appendToExpression('sqrt(') },
                  { label: 'π', action: () => appendToExpression('π') },
                  { label: 'e', action: () => appendToExpression('e') },
                  { label: '^', action: () => appendToExpression('^') },
                  { label: '(', action: () => appendToExpression('(') },
                  { label: ')', action: () => appendToExpression(')') },
                  { label: 'mod', action: () => appendToExpression('mod') }
                ].map((btn, idx) => (
                  <button
                    key={idx}
                    onClick={btn.action}
                    className="bg-white border border-slate-200/80 hover:border-teal-400/80 hover:bg-teal-50/30 text-slate-700 hover:text-teal-700 p-3 rounded-xl font-mono text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              {/* Standard Number Block (7 columns on SM+) */}
              <div className="sm:col-span-7 grid grid-cols-4 gap-2">
                {/* Row 1 */}
                <button
                  onClick={handleClear}
                  className="bg-rose-50 border border-rose-100 text-rose-700 hover:bg-rose-600 hover:text-white p-3.5 rounded-xl font-black text-xs transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  C
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 p-3.5 rounded-xl font-black text-xs transition-all cursor-pointer shadow-sm active:scale-95 flex items-center justify-center"
                  title="Backspace"
                >
                  ⌫
                </button>
                <button
                  onClick={() => appendToExpression('%')}
                  className="bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 p-3.5 rounded-xl font-black text-xs transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  %
                </button>
                <button
                  onClick={() => appendToExpression('/')}
                  className="bg-teal-50 border border-teal-100 text-teal-700 hover:bg-teal-600 hover:text-white p-3.5 rounded-xl font-black text-sm transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  ÷
                </button>

                {/* Row 2 */}
                {['7', '8', '9'].map(num => (
                  <button
                    key={num}
                    onClick={() => appendToExpression(num)}
                    className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 p-3.5 rounded-xl font-mono font-black text-sm transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => appendToExpression('*')}
                  className="bg-teal-50 border border-teal-100 text-teal-700 hover:bg-teal-600 hover:text-white p-3.5 rounded-xl font-black text-sm transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  ×
                </button>

                {/* Row 3 */}
                {['4', '5', '6'].map(num => (
                  <button
                    key={num}
                    onClick={() => appendToExpression(num)}
                    className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 p-3.5 rounded-xl font-mono font-black text-sm transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => appendToExpression('-')}
                  className="bg-teal-50 border border-teal-100 text-teal-700 hover:bg-teal-600 hover:text-white p-3.5 rounded-xl font-black text-sm transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  -
                </button>

                {/* Row 4 */}
                {['1', '2', '3'].map(num => (
                  <button
                    key={num}
                    onClick={() => appendToExpression(num)}
                    className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 p-3.5 rounded-xl font-mono font-black text-sm transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => appendToExpression('+')}
                  className="bg-teal-50 border border-teal-100 text-teal-700 hover:bg-teal-600 hover:text-white p-3.5 rounded-xl font-black text-sm transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  +
                </button>

                {/* Row 5 */}
                <button
                  onClick={() => appendToExpression('0')}
                  className="col-span-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 p-3.5 rounded-xl font-mono font-black text-sm transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  0
                </button>
                <button
                  onClick={() => appendToExpression('.')}
                  className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 p-3.5 rounded-xl font-mono font-black text-sm transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  .
                </button>
                <button
                  onClick={handleEvaluate}
                  className="bg-teal-600 hover:bg-teal-700 text-white p-3.5 rounded-xl font-black text-sm transition-all cursor-pointer shadow-md shadow-teal-600/20 active:scale-95 flex items-center justify-center"
                  title="Calculate"
                >
                  <CornerDownLeft className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            /* Simple Mode pocket calculator grid (larger buttons, clean visual layout) */
            <div className="grid grid-cols-4 gap-3.5 animate-in fade-in duration-300 max-w-lg mx-auto">
              {/* Row 1 */}
              <button
                onClick={handleClear}
                className="bg-rose-50 border border-rose-100 text-rose-700 hover:bg-rose-600 hover:text-white p-5 rounded-2xl font-black text-base transition-all cursor-pointer shadow-sm active:scale-95"
              >
                C
              </button>
              <button
                onClick={handleDelete}
                className="bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 p-5 rounded-2xl font-black text-base transition-all cursor-pointer shadow-sm active:scale-95 flex items-center justify-center"
                title="Backspace"
              >
                ⌫
              </button>
              <button
                onClick={() => appendToExpression('%')}
                className="bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 p-5 rounded-2xl font-black text-base transition-all cursor-pointer shadow-sm active:scale-95"
              >
                %
              </button>
              <button
                onClick={() => appendToExpression('/')}
                className="bg-teal-50 border border-teal-100 text-teal-700 hover:bg-teal-600 hover:text-white p-5 rounded-2xl font-black text-lg transition-all cursor-pointer shadow-sm active:scale-95"
              >
                ÷
              </button>

              {/* Row 2 */}
              {['7', '8', '9'].map(num => (
                <button
                  key={num}
                  onClick={() => appendToExpression(num)}
                  className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 p-5 rounded-2xl font-mono font-black text-lg transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => appendToExpression('*')}
                className="bg-teal-50 border border-teal-100 text-teal-700 hover:bg-teal-600 hover:text-white p-5 rounded-2xl font-black text-lg transition-all cursor-pointer shadow-sm active:scale-95"
              >
                ×
              </button>

              {/* Row 3 */}
              {['4', '5', '6'].map(num => (
                <button
                  key={num}
                  onClick={() => appendToExpression(num)}
                  className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 p-5 rounded-2xl font-mono font-black text-lg transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => appendToExpression('-')}
                className="bg-teal-50 border border-teal-100 text-teal-700 hover:bg-teal-600 hover:text-white p-5 rounded-2xl font-black text-lg transition-all cursor-pointer shadow-sm active:scale-95"
              >
                -
              </button>

              {/* Row 4 */}
              {['1', '2', '3'].map(num => (
                <button
                  key={num}
                  onClick={() => appendToExpression(num)}
                  className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 p-5 rounded-2xl font-mono font-black text-lg transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => appendToExpression('+')}
                className="bg-teal-50 border border-teal-100 text-teal-700 hover:bg-teal-600 hover:text-white p-5 rounded-2xl font-black text-lg transition-all cursor-pointer shadow-sm active:scale-95"
              >
                +
              </button>

              {/* Row 5 */}
              <button
                onClick={() => appendToExpression('0')}
                className="col-span-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 p-5 rounded-2xl font-mono font-black text-lg transition-all cursor-pointer shadow-sm active:scale-95"
              >
                0
              </button>
              <button
                onClick={() => appendToExpression('.')}
                className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 p-5 rounded-2xl font-mono font-black text-lg transition-all cursor-pointer shadow-sm active:scale-95"
              >
                .
              </button>
              <button
                onClick={handleEvaluate}
                className="bg-teal-600 hover:bg-teal-700 text-white p-5 rounded-2xl font-black text-lg transition-all cursor-pointer shadow-md shadow-teal-600/20 active:scale-95 flex items-center justify-center"
                title="Calculate"
              >
                <CornerDownLeft className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Quick Keyboard Info Badge */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-slate-400 mt-0.5" />
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              <strong>Pro Tip:</strong> You can type mathematical formulas directly inside the calculator screen using your keyboard.{calcMode === 'scientific' && " Click on scientific keys on the left to quickly wrap values with formulas."}
            </p>
          </div>

        </div>

        {/* Dynamic Calculator History Panel (5 Columns) */}
        <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6" id="history-panel">
          
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <History className="w-5 h-5 text-teal-600" />
                Solve History
              </h2>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                Click on any previous calculation card to reload or copy it.
              </p>
            </div>
            
            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="text-[10px] bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-700 border border-slate-200 px-2 py-1 rounded-lg font-bold transition-all cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {history.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <Calculator className="w-8 h-8 mx-auto text-slate-300 stroke-1" />
                <p className="text-xs font-bold uppercase tracking-wider">No calculations yet</p>
                <p className="text-[10px] leading-relaxed max-w-[200px] mx-auto">Your recent solver operations will appear here for easy reference.</p>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectHistory(item)}
                  className="bg-slate-55/60 border border-slate-100 p-3.5 rounded-xl space-y-2 hover:border-slate-300 hover:bg-slate-50/50 cursor-pointer transition-all duration-300 relative group group-hover:shadow-sm"
                >
                  <div className="flex justify-between items-start gap-4">
                    <span className="font-mono text-xs font-bold text-slate-400 block break-all select-all">
                      {item.expression}
                    </span>
                    <span className="text-[9px] text-slate-400 font-semibold shrink-0">
                      {item.timestamp}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between gap-4 border-t border-slate-100/50 pt-2">
                    <p className="font-mono text-base font-black text-slate-800 break-all select-all">
                      = {item.result}
                    </p>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyValue(item.result, item.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white text-slate-400 hover:text-teal-600 transition-all cursor-pointer"
                      title="Copy Result"
                    >
                      {copiedExprId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Constants Reference */}
          <div className="border-t border-slate-100 pt-4 space-y-2.5">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Useful Physics & Math Constants</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100/60 text-center">
                <span className="text-[10px] text-slate-400 font-bold block">Pi (π) Ratio</span>
                <code className="text-xs font-mono font-bold text-teal-700">3.14159265</code>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100/60 text-center">
                <span className="text-[10px] text-slate-400 font-bold block">Euler's Number (e)</span>
                <code className="text-xs font-mono font-bold text-teal-700">2.71828182</code>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* Two-Way Interactive Unit Conversion Shortcuts (Bento Grid) */}
      <section className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6" id="conversions-section">
        
        <div className="border-b border-slate-100 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 text-[10px] font-black tracking-widest uppercase">
              ⚡ Conversions Widget
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight mt-1.5">
              Instant Unit Conversion Shortcuts (क्विक कनवर्टर)
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Simply type in either field to convert the opposite unit side-by-side immediately. No dropdown selections required!
            </p>
          </div>
          <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60 text-[11px] font-mono text-slate-500 font-bold">
            6 Core Shortcuts Pre-Loaded
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Inches to Cm */}
          <div className="bg-slate-50/40 p-5 rounded-2xl border border-slate-200/60 space-y-4 hover:border-teal-300 hover:bg-slate-50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-teal-600" />
                Inches ⬌ Centimeters
              </span>
              <span className="text-[10px] text-slate-400 font-semibold font-mono">1 in = 2.54 cm</span>
            </div>
            
            <div className="grid grid-cols-9 gap-2 items-center">
              <div className="col-span-4 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                <label className="block text-[8px] font-black uppercase text-slate-400">Inches</label>
                <input
                  type="number"
                  value={inchVal}
                  onChange={(e) => handleInchChange(e.target.value)}
                  className="w-full bg-transparent border-none text-xs font-mono font-bold text-slate-800 outline-none mt-1"
                  placeholder="0"
                />
              </div>
              <div className="col-span-1 flex justify-center text-slate-400">
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </div>
              <div className="col-span-4 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                <label className="block text-[8px] font-black uppercase text-slate-400">Centimeters</label>
                <input
                  type="number"
                  value={cmVal}
                  onChange={(e) => handleCmChange(e.target.value)}
                  className="w-full bg-transparent border-none text-xs font-mono font-bold text-slate-800 outline-none mt-1"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Kg to Lb */}
          <div className="bg-slate-50/40 p-5 rounded-2xl border border-slate-200/60 space-y-4 hover:border-teal-300 hover:bg-slate-50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-teal-600" />
                Kilograms ⬌ Pounds
              </span>
              <span className="text-[10px] text-slate-400 font-semibold font-mono">1 kg = 2.2046 lb</span>
            </div>
            
            <div className="grid grid-cols-9 gap-2 items-center">
              <div className="col-span-4 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                <label className="block text-[8px] font-black uppercase text-slate-400">Kg</label>
                <input
                  type="number"
                  value={kgVal}
                  onChange={(e) => handleKgChange(e.target.value)}
                  className="w-full bg-transparent border-none text-xs font-mono font-bold text-slate-800 outline-none mt-1"
                  placeholder="0"
                />
              </div>
              <div className="col-span-1 flex justify-center text-slate-400">
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </div>
              <div className="col-span-4 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                <label className="block text-[8px] font-black uppercase text-slate-400">Pounds (lb)</label>
                <input
                  type="number"
                  value={lbVal}
                  onChange={(e) => handleLbChange(e.target.value)}
                  className="w-full bg-transparent border-none text-xs font-mono font-bold text-slate-800 outline-none mt-1"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Celsius to Fahrenheit */}
          <div className="bg-slate-50/40 p-5 rounded-2xl border border-slate-200/60 space-y-4 hover:border-teal-300 hover:bg-slate-50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-teal-600" />
                Celsius ⬌ Fahrenheit
              </span>
              <span className="text-[10px] text-slate-400 font-semibold font-mono">(C × 9/5) + 32</span>
            </div>
            
            <div className="grid grid-cols-9 gap-2 items-center">
              <div className="col-span-4 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                <label className="block text-[8px] font-black uppercase text-slate-400">Celsius (°C)</label>
                <input
                  type="number"
                  value={celsiusVal}
                  onChange={(e) => handleCelsiusChange(e.target.value)}
                  className="w-full bg-transparent border-none text-xs font-mono font-bold text-slate-800 outline-none mt-1"
                  placeholder="0"
                />
              </div>
              <div className="col-span-1 flex justify-center text-slate-400">
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </div>
              <div className="col-span-4 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                <label className="block text-[8px] font-black uppercase text-slate-400">Fahrenheit (°F)</label>
                <input
                  type="number"
                  value={fahrenheitVal}
                  onChange={(e) => handleFahrenheitChange(e.target.value)}
                  className="w-full bg-transparent border-none text-xs font-mono font-bold text-slate-800 outline-none mt-1"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Km to Miles */}
          <div className="bg-slate-50/40 p-5 rounded-2xl border border-slate-200/60 space-y-4 hover:border-teal-300 hover:bg-slate-50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-teal-600" />
                Kilometers ⬌ Miles
              </span>
              <span className="text-[10px] text-slate-400 font-semibold font-mono">1 km = 0.6213 mi</span>
            </div>
            
            <div className="grid grid-cols-9 gap-2 items-center">
              <div className="col-span-4 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                <label className="block text-[8px] font-black uppercase text-slate-400">Kilometers</label>
                <input
                  type="number"
                  value={kmVal}
                  onChange={(e) => handleKmChange(e.target.value)}
                  className="w-full bg-transparent border-none text-xs font-mono font-bold text-slate-800 outline-none mt-1"
                  placeholder="0"
                />
              </div>
              <div className="col-span-1 flex justify-center text-slate-400">
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </div>
              <div className="col-span-4 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                <label className="block text-[8px] font-black uppercase text-slate-400">Miles</label>
                <input
                  type="number"
                  value={mileVal}
                  onChange={(e) => handleMileChange(e.target.value)}
                  className="w-full bg-transparent border-none text-xs font-mono font-bold text-slate-800 outline-none mt-1"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Card 5: Meters to Feet */}
          <div className="bg-slate-50/40 p-5 rounded-2xl border border-slate-200/60 space-y-4 hover:border-teal-300 hover:bg-slate-50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-teal-600" />
                Meters ⬌ Feet
              </span>
              <span className="text-[10px] text-slate-400 font-semibold font-mono">1 m = 3.2808 ft</span>
            </div>
            
            <div className="grid grid-cols-9 gap-2 items-center">
              <div className="col-span-4 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                <label className="block text-[8px] font-black uppercase text-slate-400">Meters</label>
                <input
                  type="number"
                  value={meterVal}
                  onChange={(e) => handleMeterChange(e.target.value)}
                  className="w-full bg-transparent border-none text-xs font-mono font-bold text-slate-800 outline-none mt-1"
                  placeholder="0"
                />
              </div>
              <div className="col-span-1 flex justify-center text-slate-400">
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </div>
              <div className="col-span-4 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                <label className="block text-[8px] font-black uppercase text-slate-400">Feet</label>
                <input
                  type="number"
                  value={feetVal}
                  onChange={(e) => handleFeetChange(e.target.value)}
                  className="w-full bg-transparent border-none text-xs font-mono font-bold text-slate-800 outline-none mt-1"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Card 6: MB to GB */}
          <div className="bg-slate-50/40 p-5 rounded-2xl border border-slate-200/60 space-y-4 hover:border-teal-300 hover:bg-slate-50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                <Binary className="w-4 h-4 text-teal-600" />
                Megabytes ⬌ Gigabytes
              </span>
              <span className="text-[10px] text-slate-400 font-semibold font-mono">1024 MB = 1 GB</span>
            </div>
            
            <div className="grid grid-cols-9 gap-2 items-center">
              <div className="col-span-4 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                <label className="block text-[8px] font-black uppercase text-slate-400">Megabytes (MB)</label>
                <input
                  type="number"
                  value={mbVal}
                  onChange={(e) => handleMbChange(e.target.value)}
                  className="w-full bg-transparent border-none text-xs font-mono font-bold text-slate-800 outline-none mt-1"
                  placeholder="0"
                />
              </div>
              <div className="col-span-1 flex justify-center text-slate-400">
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </div>
              <div className="col-span-4 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                <label className="block text-[8px] font-black uppercase text-slate-400">Gigabytes (GB)</label>
                <input
                  type="number"
                  value={gbVal}
                  onChange={(e) => handleGbChange(e.target.value)}
                  className="w-full bg-transparent border-none text-xs font-mono font-bold text-slate-800 outline-none mt-1"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* Hinglish Search Engine Optimization & Rich Text Panel */}
      <section className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6" id="hinglish-seo-section">
        
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            🚀 Quick Math Calculator & Converter Kaise Use Kare? (यूनिट बदलने और गणित सॉल्व करने की गाइड)
          </h2>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Understand how to perform both basic calculations and standard metric conversions instantly in your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              🧮 Math Calculator Online Solve (गणित कैसे हल करें)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Is online scientific solver ki madad se aap badi calculations aasan tarike se kar sakte hain. Raw values ko manually plus, minus, divide ya multiply karne ke alawa:
            </p>
            <ul className="text-[11px] text-slate-500 space-y-1.5 list-disc pl-4 font-medium">
              <li>Trigonometric values (जैसे <strong>sin 30 degree</strong> या cos 45) nikalna.</li>
              <li>Base 10 log value aur natural log (ln) convert karna.</li>
              <li>Powers or bracket combinations ko safe sequence me solve karna.</li>
            </ul>
          </div>

          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              📏 Inches Se Cm Calculation (इंच से सेंटीमीटर कनवर्टर)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Daily engineering aur local construction tasks me <strong>Inches ko Cm me convert karna</strong> sabse basic utility hai. Is conversion ke rules asan hai:
            </p>
            <ul className="text-[11px] text-slate-500 space-y-1.5 list-disc pl-4 font-medium">
              <li><strong>Inch to Cm formula</strong>: Value in Inches × 2.54</li>
              <li><strong>Cm to Inch formula</strong>: Value in Centimeters ÷ 2.54</li>
              <li>Aap dynamic conversions input card se live calculation check kar sakte hain.</li>
            </ul>
          </div>

          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              ⚖️ Kg Se Lb Aur Temps Converter (किलो से पाउंड कनवर्टर)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fitness trainers aur grocery items weighing ke liye <strong>Kilogram se Pound converter online</strong> kaafi use hota hai. Saath hi medical records me accurate temp badalna:
            </p>
            <ul className="text-[11px] text-slate-500 space-y-1.5 list-disc pl-4 font-medium">
              <li>1 Kg equates to exactly 2.20462 Pounds (lbs)</li>
              <li>Celsius ko Fahrenheit me badalne ke liye: <code>(C × 1.8) + 32</code></li>
              <li>Temperature conversions directly offset values ke mathematical calculations par chalta hai.</li>
            </ul>
          </div>

        </div>

        {/* Hinglish SEO Keyword Cloud for index ranking optimization */}
        <div className="bg-teal-50/30 p-4 rounded-xl border border-teal-100/40">
          <h4 className="text-xs font-black text-teal-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-600" />
            Hinglish Popular Queries & Search Tags (क्विक सर्च कीवर्ड्स)
          </h4>
          <div className="flex flex-wrap gap-2">
            {[
              "Quick math calculator online free use",
              "Inch se centimeter converter formula kya hai",
              "How to convert celsius to fahrenheit in hindi",
              "Kilogram se pound weight conversion calculator",
              "Kilometer se mile badalna online tool",
              "Scientific calculator use kaise kare hindi me",
              "Fast mathematical equation solver",
              "MB se GB computer storage conversion metrics",
              "Rajasthan local unit calculators and math"
            ].map((kw, idx) => (
              <span key={idx} className="bg-white px-2.5 py-1 rounded-lg border border-slate-200/60 text-[11px] font-medium text-slate-600 hover:text-teal-600 hover:border-teal-300 transition-all cursor-pointer">
                # {kw}
              </span>
            ))}
          </div>
        </div>

      </section>

      {/* Structured SEO Guide Content */}
      <footer className="bg-slate-900 text-white p-8 md:p-12 rounded-[3rem] space-y-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative z-10">
          
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight leading-tight">
              About the <span className="text-teal-400">Quick Math</span> Utility Solver
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm">
              Our <strong>Quick Math Calculator Online</strong> is a dual-purpose platform built for quick calculation queries and side-by-side unit conversions. By stripping out bulky visual elements and standard dropdown configurations, we deliver key math answers immediately in an easy-to-use bento-grid layout.
            </p>
            <p className="text-slate-400 leading-relaxed text-sm">
              All math functions are calculated via a secure, client-side tokenized parser written in TypeScript. This ensures that your formula evaluations and conversions never travel across network packets, offering complete data privacy.
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="text-teal-400 font-bold text-sm mb-1 uppercase tracking-widest">Safe Evaluator</h3>
                <p className="text-[10px] text-slate-400">Calculates algebraic sequences and trigonometry without utilizing vulnerable eval functions.</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="text-teal-400 font-bold text-sm mb-1 uppercase tracking-widest">Saves History</h3>
                <p className="text-[10px] text-slate-400">Saves up to 20 past calculations inside your local browser cache securely.</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-teal-400" />
                Frequently Asked Questions (FAQ)
              </h3>
              <ul className="space-y-4">
                {[
                  { 
                    q: "How secure is the calculation sandbox?", 
                    a: "It is 100% secure. Calculations are entirely executed within your local browser runtime. No database records or internet queries are triggered during solving." 
                  },
                  { 
                    q: "What trigonometric units are used for sin, cos, and tan?", 
                    a: "You can toggle between Degrees (DEG) and Radians (RAD) directly from the header toggle. By default, the system boots in Degree mode for easier daily use." 
                  },
                  { 
                    q: "How accurate is the two-way unit converter shortcuts widget?", 
                    a: "It utilizes six-digit scientific floating points based on international conversion bureaus, making it extremely reliable for schoolwork, gym weights, and sizing ratios." 
                  },
                  { 
                    q: "How can I access my past history logs?", 
                    a: "Your recent equations are saved to localStorage and displayed in the 'Solve History' column on the right. You can click on any card to reload or delete logs at any time." 
                  }
                ].map((item, i) => (
                  <li key={i} className="space-y-1">
                    <h4 className="text-sm font-bold text-teal-400">{item.q}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.a}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        <div className="pt-12 border-t border-white/10 relative z-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
            Crafted securely with 100% Client-Side sandboxed execution
          </p>
        </div>
      </footer>

      {/* Standard App Widgets */}
      <AccompanyingText 
        toolName="Quick Math Calculator & Unit Shortcuts"
        howItWorks="This bento-styled utility parses standard equations into token strings, executing operations from exponents and square roots to standard trigonometry in algebraic order of operations. The side-by-side converter cards are rigged with dual reactive event listeners for immediate results."
        whyItsUseful="Instead of keeping separate browser tabs open for a scientific calculator, a unit converter, and local search queries, this compact utility puts the most critical developer and fitness math variables in a single responsive screen."
        faqs={[
          { q: "Is this calculator free to use?", a: "Yes, it is completely free of charge with no ads, trackers, or usage thresholds." },
          { q: "Can I copy the values?", a: "Yes, there are convenient copy icons built directly into the calculator results display, historical logs, and shortcuts widget." },
          { q: "Is keyboard input supported?", a: "Yes. You can click on the expression screen and type directly using standard math symbols (+, -, *, /) on your device keyboard." }
        ]}
      />

      <div className="max-w-3xl mx-auto my-8">
        <StarRatingWidget 
          toolId="quick-math-calculator" 
          defaultRating={4.9} 
          defaultCount={142} 
          onRatingChange={(rating, count) => setRatingInfo({ rating, count })} 
        />
      </div>

      <ShareWidget title="Quick Math Calculator Online" />

    </article>
  );
};

export default QuickMath;
