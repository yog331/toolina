import React, { useState, useEffect } from 'react';
import { 
  Braces, 
  Copy, 
  Check, 
  Trash2, 
  Download, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  FileCode, 
  Settings, 
  Code, 
  Sparkles, 
  Search, 
  Sliders,
  ChevronDown,
  ChevronRight,
  Eye
} from 'lucide-react';
import AccompanyingText from '../components/AccompanyingText';
import ShareWidget from '../components/ShareWidget';
import SEO from '../components/SEO';
import StarRatingWidget from '../components/StarRatingWidget';

// Collapsible JSON Tree Node Component
const JsonTreeNode: React.FC<{
  name?: string | number;
  value: any;
  isLast?: boolean;
  depth?: number;
  allExpanded?: boolean;
}> = ({ name, value, isLast = true, depth = 0, allExpanded = true }) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setIsOpen(allExpanded);
  }, [allExpanded]);

  const type = typeof value;

  if (value === null) {
    return (
      <div className="pl-5 font-mono text-[11px] leading-relaxed py-0.5">
        {name !== undefined && <span className="text-teal-600 font-semibold">"{name}": </span>}
        <span className="text-slate-400 font-bold select-all">null</span>
        {!isLast && <span className="text-slate-400">,</span>}
      </div>
    );
  }

  if (Array.isArray(value)) {
    const isEmpty = value.length === 0;
    return (
      <div className="pl-5 font-mono text-[11px] leading-relaxed py-0.5">
        <div className="flex items-center gap-1 select-none">
          {!isEmpty && (
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-0.5 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 transition-colors"
              id={`tree-toggle-arr-${name}-${depth}`}
            >
              {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          )}
          {name !== undefined && <span className="text-teal-600 font-semibold">"{name}": </span>}
          <span className="text-slate-500 font-bold">[</span>
          {!isOpen && <span className="text-slate-400 text-[10px] bg-slate-100 px-1 rounded.5 mx-1 font-bold">Array({value.length})</span>}
          {!isOpen && <span className="text-slate-500 font-bold">]</span>}
          {!isOpen && !isLast && <span className="text-slate-400">,</span>}
        </div>
        
        {isOpen && !isEmpty && (
          <div className="border-l border-slate-200 ml-2.5">
            {value.map((item, idx) => (
              <JsonTreeNode 
                key={idx} 
                name={idx} 
                value={item} 
                isLast={idx === value.length - 1} 
                depth={depth + 1}
                allExpanded={allExpanded}
              />
            ))}
          </div>
        )}
        
        {isOpen && (
          <div className="pl-4">
            <span className="text-slate-500 font-bold">]</span>
            {!isLast && <span className="text-slate-400">,</span>}
          </div>
        )}
      </div>
    );
  }

  if (type === 'object') {
    const keys = Object.keys(value);
    const isEmpty = keys.length === 0;
    return (
      <div className="pl-5 font-mono text-[11px] leading-relaxed py-0.5">
        <div className="flex items-center gap-1 select-none">
          {!isEmpty && (
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-0.5 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 transition-colors"
              id={`tree-toggle-obj-${name}-${depth}`}
            >
              {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          )}
          {name !== undefined && <span className="text-teal-600 font-semibold">"{name}": </span>}
          <span className="text-slate-500 font-bold">{"{"}</span>
          {!isOpen && <span className="text-slate-400 text-[10px] bg-slate-100 px-1 rounded.5 mx-1 font-bold">Object({keys.length})</span>}
          {!isOpen && <span className="text-slate-500 font-bold">{"}"}</span>}
          {!isOpen && !isLast && <span className="text-slate-400">,</span>}
        </div>
        
        {isOpen && !isEmpty && (
          <div className="border-l border-slate-200 ml-2.5">
            {keys.map((key, idx) => (
              <JsonTreeNode 
                key={key} 
                name={key} 
                value={value[key]} 
                isLast={idx === keys.length - 1} 
                depth={depth + 1}
                allExpanded={allExpanded}
              />
            ))}
          </div>
        )}
        
        {isOpen && (
          <div className="pl-4">
            <span className="text-slate-500 font-bold">{"}"}</span>
            {!isLast && <span className="text-slate-400">,</span>}
          </div>
        )}
      </div>
    );
  }

  let valColor = "text-amber-600 font-medium"; // number
  if (type === 'string') valColor = "text-emerald-600 font-semibold";
  else if (type === 'boolean') valColor = "text-violet-600 font-bold";

  const renderValue = () => {
    if (type === 'string') {
      return `"${value}"`;
    }
    return String(value);
  };

  return (
    <div className="pl-5 font-mono text-[11px] leading-relaxed py-0.5 flex flex-wrap items-center">
      {name !== undefined && <span className="text-teal-600 font-semibold">"{name}": </span>}
      <span className={`${valColor} break-all select-all`}>{renderValue()}</span>
      {!isLast && <span className="text-slate-400">,</span>}
    </div>
  );
};

const OnlineJsonFormatter: React.FC = () => {
  const [ratingInfo, setRatingInfo] = useState({ rating: 4.9, count: 245 });
  const [activeTab, setActiveTab] = useState<'beautify' | 'escape'>('beautify');
  
  // Input/Output states
  const [rawInput, setRawInput] = useState('');
  const [formattedOutput, setFormattedOutput] = useState('');
  const [parsedObject, setParsedObject] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorLine, setErrorLine] = useState<number | null>(null);
  
  // Formatting Settings
  const [indentSize, setIndentSize] = useState<'2' | '4' | 'tab'>('2');
  const [sortKeys, setSortKeys] = useState(false);
  const [queryPath, setQueryPath] = useState('');
  
  // UI states
  const [copied, setCopied] = useState(false);
  const [allExpanded, setAllExpanded] = useState(true);
  const [viewMode, setViewMode] = useState<'tree' | 'text'>('tree');
  const [validationStatus, setValidationStatus] = useState<'empty' | 'valid' | 'invalid'>('empty');

  // Sample JSON Loading
  const sampleJson = {
    appName: "Toolina Dev Labs Suite",
    version: "2.4.0",
    status: "Active",
    features: {
      clientSideParsing: true,
      supportedFormates: ["CSV", "JSON", "XML", "YAML"],
      limits: null,
      maxPayloadKb: 51200
    },
    systemLogs: [
      { id: 101, event: "Initialization Complete", timestamp: "2026-07-20T03:30:00Z" },
      { id: 102, event: "Database Connection Bypassed", timestamp: "2026-07-20T03:34:00Z" }
    ],
    metadata: {
      tags: ["Developer", "Utility", "JSON Formatter"],
      license: "MIT",
      author: {
        name: "Yogi Devs",
        website: "https://toolina.in"
      }
    }
  };

  const loadSample = () => {
    const sampleStr = JSON.stringify(sampleJson, null, 2);
    setRawInput(sampleStr);
  };

  // Safe Key Sorter (recursive)
  const sortObjectKeys = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map(sortObjectKeys);
    }
    const sortedKeys = Object.keys(obj).sort();
    const sortedObj: any = {};
    sortedKeys.forEach(key => {
      sortedObj[key] = sortObjectKeys(obj[key]);
    });
    return sortedObj;
  };

  // Safe Query Path Extractor (e.g. data.users.0.name)
  const queryJsonByPath = (obj: any, path: string): any => {
    if (!path.trim()) return obj;
    const parts = path.split('.').filter(p => p.trim());
    let current = obj;
    for (const part of parts) {
      if (current === null || current === undefined) return undefined;
      // Handle array bracket indexes
      if (part.includes('[') && part.includes(']')) {
        const arrayName = part.split('[')[0];
        const indexStr = part.split('[')[1].replace(']', '');
        const index = parseInt(indexStr, 10);
        if (arrayName) {
          current = current[arrayName];
        }
        if (Array.isArray(current)) {
          current = current[index];
        } else {
          return undefined;
        }
      } else {
        current = current[part];
      }
    }
    return current;
  };

  // Real-time compilation & validation
  useEffect(() => {
    if (!rawInput.trim()) {
      setFormattedOutput('');
      setParsedObject(null);
      setErrorMessage('');
      setErrorLine(null);
      setValidationStatus('empty');
      return;
    }

    try {
      // Clean string input slightly before parsing if it contains trailing comments or whitespace
      const cleaned = rawInput.trim();
      const parsed = JSON.parse(cleaned);
      
      setValidationStatus('valid');
      setErrorMessage('');
      setErrorLine(null);
      
      // Apply filters and sorting
      let processed = sortKeys ? sortObjectKeys(parsed) : parsed;
      if (queryPath.trim()) {
        const extracted = queryJsonByPath(processed, queryPath);
        if (extracted === undefined) {
          setErrorMessage(`Path "${queryPath}" did not match any fields.`);
          setValidationStatus('invalid');
          setFormattedOutput('');
          setParsedObject(null);
          return;
        }
        processed = extracted;
      }

      setParsedObject(processed);

      // Stringify with chosen formatting
      const space = indentSize === 'tab' ? '\t' : parseInt(indentSize, 10);
      const output = JSON.stringify(processed, null, space);
      setFormattedOutput(output);

    } catch (err: any) {
      setValidationStatus('invalid');
      setParsedObject(null);
      setFormattedOutput('');
      
      // Extract line number if available in error message
      const msg = err.message || '';
      setErrorMessage(msg);

      // Parsing lines (e.g., "Expected ... at line 5 column 12")
      const lineMatch = msg.match(/line\s+(\d+)/i) || msg.match(/position\s+(\d+)/i);
      if (lineMatch) {
        if (msg.includes('position')) {
          // Calculate approx line number from global character position
          const pos = parseInt(lineMatch[1], 10);
          const beforeErr = rawInput.substring(0, pos);
          const lineCount = beforeErr.split('\n').length;
          setErrorLine(lineCount);
        } else {
          setErrorLine(parseInt(lineMatch[1], 10));
        }
      } else {
        setErrorLine(null);
      }
    }
  }, [rawInput, indentSize, sortKeys, queryPath]);

  // JSON Quick Fixer (Best effort resolution for common JSON formatting mistakes)
  const handleAutoFix = () => {
    if (!rawInput.trim()) return;
    try {
      let temp = rawInput.trim();
      // Remove trailing commas in objects and arrays
      temp = temp.replace(/,\s*([\]}])/g, '$1');
      // Add double quotes to unquoted property keys
      temp = temp.replace(/([{,]\s*)([a-zA-Z0-9_$]+)\s*:/g, '$1"$2":');
      // Replace single quotes surrounding strings with double quotes
      temp = temp.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, '"$1"');
      
      // Test if fixed string parses successfully
      JSON.parse(temp);
      setRawInput(temp);
    } catch (e: any) {
      // Best effort failed, try basic replace
      let temp = rawInput.trim();
      temp = temp.replace(/'/g, '"');
      setRawInput(temp);
    }
  };

  // Compact / Minify
  const handleMinify = () => {
    if (!rawInput.trim()) return;
    try {
      const parsed = JSON.parse(rawInput);
      const minified = JSON.stringify(parsed);
      setRawInput(minified);
      setIndentSize('2');
    } catch (e: any) {
      setErrorMessage('Cannot minify invalid JSON. Please fix errors first.');
    }
  };

  // Escape JSON to JS/C-style string
  const handleEscapeString = () => {
    if (!rawInput.trim()) return;
    const escaped = JSON.stringify(rawInput);
    // Strip external wrapper quotes from stringify if user just wants string characters escaped
    setFormattedOutput(escaped.slice(1, -1));
  };

  // Unescape string to raw JSON
  const handleUnescapeString = () => {
    if (!rawInput.trim()) return;
    try {
      // Wrap in double quotes if missing to let JSON parse it as an escaped string
      let inputStr = rawInput.trim();
      if (!inputStr.startsWith('"')) inputStr = `"${inputStr}`;
      if (!inputStr.endsWith('"')) inputStr = `${inputStr}"`;
      const unescaped = JSON.parse(inputStr);
      setRawInput(unescaped);
    } catch (e) {
      // Basic manual regex replacement
      const unescaped = rawInput
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\\\/g, '\\');
      setRawInput(unescaped);
    }
  };

  // Copy output to clipboard
  const handleCopy = () => {
    const textToCopy = formattedOutput || rawInput;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download output as file
  const handleDownload = () => {
    const content = formattedOutput || rawInput;
    if (!content) return;
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `toolina-formatted-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Calculate stats
  const getStats = () => {
    if (!rawInput) return { chars: 0, lines: 0, sizeKb: '0.00' };
    const chars = rawInput.length;
    const lines = rawInput.split('\n').length;
    const sizeKb = (chars / 1024).toFixed(2);
    return { chars, lines, sizeKb };
  };

  const stats = getStats();

  // Structured Data (JSON-LD) for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Yogi Online JSON Formatter",
    "description": "Secure, fast online JSON Formatter, Validator, Beautifier, and Minifier. Format raw JSON, fix syntax errors, collapsible interactive tree views client-side.",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <article className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500">
      <SEO 
        title="Best Online JSON Formatter - Format, Validate & Beautify JSON" 
        description="Free online JSON Formatter, Validator & Beautifier. Parse, clean, query and minify your JSON data instantly with interactive tree views. 100% private and client-side."
        keywords="json formatter, online json formatter, json validator, beautify json, minify json, format json string, json tree view, developer tool, private json utility, json format kaise kare, json file clean karne wala, online json thik kare, code beautifier hindi, best JSON formatter, JSON format tool free, correct JSON errors, code sundar banane wala tool, JSON validate online"
        structuredData={structuredData}
      />

      {/* Tool Header */}
      <header className="relative z-10 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-black uppercase tracking-wider">
              <Braces className="w-3.5 h-3.5" />
              Developer Tools
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-slate-800 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 font-mono text-2xl font-bold border border-teal-100 shadow-sm shrink-0">
                {'{ }'}
              </span>
              <span>
                Online <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">JSON Formatter</span>
              </span>
            </h1>
            <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
              Format, validate, query, and beautify your raw JSON code instantly. Create rich tree models, minify outputs, and unescape JSON strings in absolute privacy.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <button 
              onClick={loadSample}
              id="btn-load-sample"
              className="flex-1 lg:flex-none bg-slate-100 text-slate-700 px-5 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 transition-all border border-slate-200 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Load Sample Data
            </button>
            <button 
              onClick={() => { setRawInput(''); setQueryPath(''); }}
              id="btn-clear-raw"
              className="flex-1 lg:flex-none bg-slate-100 text-slate-600 px-5 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all border border-slate-200 flex items-center justify-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset All
            </button>
          </div>
        </div>

        {/* Feature Tab Switches */}
        <div className="flex items-center border-b border-slate-200 gap-6 pt-4">
          <button 
            onClick={() => setActiveTab('beautify')}
            className={`pb-3 font-bold text-sm transition-all relative ${activeTab === 'beautify' ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'}`}
            id="tab-beautify"
          >
            Format & Validate
            {activeTab === 'beautify' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 rounded-full"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('escape')}
            className={`pb-3 font-bold text-sm transition-all relative ${activeTab === 'escape' ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'}`}
            id="tab-escape"
          >
            Escape & Unescape String
            {activeTab === 'escape' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 rounded-full"></div>}
          </button>
        </div>

        {/* Validation Error / Success Banners */}
        {validationStatus === 'invalid' && errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-xs font-medium tracking-wide flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <div>
                <span className="font-bold uppercase tracking-wider block text-[10px] text-rose-600 mb-0.5">Invalid JSON Code</span>
                <span className="font-mono">{errorMessage}</span>
                {errorLine !== null && <span className="ml-2 font-bold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded text-[10px]">Line: {errorLine}</span>}
              </div>
            </div>
            <button 
              onClick={handleAutoFix}
              id="btn-auto-fix"
              className="bg-rose-600 text-white hover:bg-rose-700 transition-colors px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-md shrink-0"
            >
              🔧 Auto-Fix Common Errors
            </button>
          </div>
        )}

        {validationStatus === 'valid' && (
          <div className="p-4 bg-teal-50 border border-teal-100 rounded-2xl text-teal-800 text-xs font-medium flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-teal-600" />
            <div>
              <span className="font-bold uppercase tracking-wider text-[10px] text-teal-600 block">Syntactically Valid JSON</span>
              The document is structured and parsed perfectly.
            </div>
          </div>
        )}

        {/* Formatter Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10 pt-2">
          {/* Input Panel (Left) */}
          <div className="flex flex-col h-[550px] md:h-[650px] bg-slate-50 rounded-[2.5rem] border border-slate-100 p-6 shadow-inner">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span> Raw JSON Input
              </h2>
              <div className="flex gap-4 items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase font-mono">
                  {stats.lines} Lines | {stats.sizeKb} KB
                </span>
              </div>
            </div>
            
            <textarea 
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder='Paste your JSON object here...&#10;&#10;e.g.&#10;{&#10;  "id": 1,&#10;  "name": "Dev User",&#10;  "isAdmin": false&#10;}'
              className="flex-1 w-full bg-white border border-slate-200 rounded-[2rem] p-6 text-xs font-mono outline-none focus:ring-4 ring-teal-50 transition-all resize-none shadow-sm placeholder:text-slate-300"
              id="raw-json-textarea"
            />
          </div>

          {/* Output Panel (Right) */}
          <div className="flex flex-col h-[550px] md:h-[650px] bg-slate-900 rounded-[2.5rem] p-6 shadow-2xl relative group">
            {/* Output Panel Header controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Result Workspace
                </h2>
              </div>
              
              <div className="flex flex-wrap gap-2.5 items-center">
                {activeTab === 'beautify' && (
                  <>
                    {/* Indentation configuration selector */}
                    <div className="flex bg-slate-800 rounded-xl p-0.5 border border-slate-700">
                      {(['2', '4', 'tab'] as const).map(opt => (
                        <button
                          key={opt}
                          onClick={() => setIndentSize(opt)}
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors ${indentSize === opt ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
                          title={`Set indent space to ${opt}`}
                          id={`indent-btn-${opt}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {/* Minify Button */}
                    <button
                      onClick={handleMinify}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-all text-[9px] font-black uppercase tracking-widest"
                      title="Minify JSON"
                      id="btn-minify"
                    >
                      Minify
                    </button>

                    {/* Sort Keys switch */}
                    <button
                      onClick={() => setSortKeys(!sortKeys)}
                      className={`px-2.5 py-1.5 rounded-xl border transition-all text-[9px] font-black uppercase tracking-widest ${sortKeys ? 'bg-teal-500/15 border-teal-500/30 text-teal-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
                      title="Sort object keys alphabetically"
                      id="btn-sort-keys"
                    >
                      Sort
                    </button>
                  </>
                )}

                {activeTab === 'escape' && (
                  <>
                    <button
                      onClick={handleEscapeString}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest"
                      title="Escape JSON string characters"
                      id="btn-escape-string"
                    >
                      Escape
                    </button>
                    <button
                      onClick={handleUnescapeString}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest"
                      title="Unescape escaped string to raw text"
                      id="btn-unescape-string"
                    >
                      Unescape
                    </button>
                  </>
                )}
                
                {(formattedOutput || rawInput) && (
                  <div className="flex gap-1 border-l border-slate-800 pl-2">
                    <button 
                      onClick={handleCopy}
                      className={`p-1.5 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-teal-400 hover:bg-slate-700 hover:text-teal-300'}`}
                      title="Copy to clipboard"
                      id="btn-copy-output"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button 
                      onClick={handleDownload}
                      className="p-1.5 rounded-xl bg-slate-800 text-teal-400 hover:bg-slate-700 hover:text-teal-300 transition-all"
                      title="Download JSON File"
                      id="btn-download-output"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Filter Query Bar */}
            {activeTab === 'beautify' && validationStatus === 'valid' && (
              <div className="mb-4 flex items-center bg-slate-950/40 border border-slate-800 rounded-xl px-3 py-1.5 gap-2">
                <Search className="w-3.5 h-3.5 text-slate-500" />
                <input 
                  type="text"
                  value={queryPath}
                  onChange={(e) => setQueryPath(e.target.value)}
                  placeholder="Query JSON Path (e.g. appName or metadata.author.name or features.supportedFormates[0])"
                  className="bg-transparent border-none text-teal-300 placeholder:text-slate-600 text-[11px] font-mono outline-none flex-1"
                  id="query-path-input"
                />
                {queryPath && (
                  <button 
                    onClick={() => setQueryPath('')}
                    className="text-[9px] text-slate-500 hover:text-slate-300 font-bold uppercase"
                    id="btn-clear-query"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}

            {/* Output Area */}
            <div className="flex-1 w-full bg-slate-950/40 rounded-[2rem] border border-slate-850 overflow-hidden flex flex-col">
              {activeTab === 'beautify' && parsedObject && (
                <div className="flex border-b border-slate-800/80 bg-slate-950/20 px-4 py-2 justify-between items-center select-none">
                  <span className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-1.5">
                    <Sliders className="w-3 h-3 text-teal-500" /> Output Views
                  </span>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex bg-slate-800 rounded-xl p-0.5 border border-slate-700">
                      <button
                        onClick={() => setViewMode('tree')}
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors ${viewMode === 'tree' ? 'bg-teal-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'}`}
                        id="view-mode-tree"
                      >
                        Tree View
                      </button>
                      <button
                        onClick={() => setViewMode('text')}
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors ${viewMode === 'text' ? 'bg-teal-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'}`}
                        id="view-mode-text"
                      >
                        Text View
                      </button>
                    </div>
                    {viewMode === 'tree' && (
                      <button 
                        onClick={() => setAllExpanded(!allExpanded)}
                        className="text-[9px] font-black text-slate-400 hover:text-teal-400 uppercase tracking-widest transition-colors bg-slate-800/40 px-2.5 py-1 rounded-lg"
                        id="btn-toggle-expand-all"
                      >
                        {allExpanded ? 'Collapse All' : 'Expand All'}
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-auto p-6 scrollbar-hide select-text">
                {activeTab === 'beautify' && parsedObject ? (
                  viewMode === 'tree' ? (
                    /* Render dynamic JSON collapsible tree structure */
                    <div className="text-white select-text">
                      <JsonTreeNode value={parsedObject} allExpanded={allExpanded} />
                    </div>
                  ) : (
                    /* Render structured string syntax output */
                    <pre className="text-[11px] font-mono text-teal-400 whitespace-pre leading-relaxed select-text">
                      {formattedOutput}
                    </pre>
                  )
                ) : formattedOutput ? (
                  /* Render structured string syntax output for escape/unescape */
                  <pre className="text-[11px] font-mono text-teal-400 whitespace-pre leading-relaxed select-text">
                    {formattedOutput}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-600 font-mono text-xs select-none">
                    <Braces className="w-10 h-10 mb-4 text-slate-800 animate-pulse" />
                    <span>{"{ awaiting_input: true }"}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Structured Developer Guides & FAQs Section */}
      <footer className="bg-slate-900 rounded-[3.5rem] p-8 md:p-16 text-white space-y-16 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.05),transparent)] pointer-events-none"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-tight">
              A Complete <span className="text-teal-500">JSON Suite</span> - JSON Format and Beautify Kaise Kare?
            </h2>
            <p className="text-slate-400 leading-relaxed text-base">
              Say goodbye to messy JSON data. Agar aapko online JSON format karne me pareshani hoti hai, toh hamara tool sabse aasan aur secure tarika pradan karta hai. The Yogi JSON Formatter offers a comprehensive array of formatting presets, validation rules, minifiers, and escape parameters to speed up debugging log outputs, nested API payloads, and config assets securely.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                <h3 className="text-teal-500 font-bold text-sm mb-2 uppercase tracking-widest">Client-Side Secure</h3>
                <p className="text-[11px] text-slate-450 leading-relaxed">Formatting, validating, and editing happens 100% locally in your browser. Apka data bilkul safe hai kyunki zero bytes are uploaded to remote servers.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                <h3 className="text-teal-500 font-bold text-sm mb-2 uppercase tracking-widest">Intelligent Query</h3>
                <p className="text-[11px] text-slate-450 leading-relaxed">Extract and filter nested objects directly using a dot-notation query path, allowing rapid parsing of huge JSON objects seamlessly.</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-300 mb-6 flex items-center gap-3">
                <span className="text-xl">💡</span> JSON Pro Tips & Hinglish Guide
              </h3>
              <ul className="space-y-6">
                {[
                  { q: "JSON formatting me error kyu aata hai (Unexpected token error)?", a: "JSON document me strict rules hote hain. Hamesha keys aur string values ko double quotes (\") me rakhein. Single quotes ('') ya trailing comma (akhir me faltu comma) lagane se parse error aata hai." },
                  { q: "How does the 'Auto-Fix' feature help you save time?", a: "Hamara smart auto-fix button automatically missing quotes add karta hai, single quotes ko double quotes me convert karta hai, aur trailing commas ko nikal deta hai, jisse aapka raw code instantly valid ban jata hai." },
                  { q: "Kya main nested items ko search ya query kar sakta hu?", a: "Haan! Query Path filter bar me dot notation (jaise: metadata.author.name) ya index selection (jaise: users[0].email) karke bade se bade objects ko instantly filter kar sakte hain." },
                  { q: "Is my private data secure with this tool?", a: "Absolutely! Formatting aur validation complete hone me zero server interaction hota hai. Sab kuch local browser tab me hi execute hota hai, isliye data leak hone ka koi sawal hi nahi hai." }
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
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Formulated for Performance by Yogi Developer Labs</p>
        </div>
      </footer>

      {/* Rich SEO-optimized Educational & Technical Content Block */}
      <section className="bg-white border border-slate-100 rounded-[3rem] p-8 md:p-12 space-y-10 shadow-sm text-slate-700 leading-relaxed relative z-10">
        <header className="border-b border-slate-100 pb-6">
          <h2 className="text-2xl md:text-3xl font-display font-black text-slate-800 tracking-tight">
            Complete Educational Guide: JSON Syntax, Formatting, and Validation
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Learn the core principles of JavaScript Object Notation, common syntax pitfalls, and how to use our formatter like a pro.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-teal-500 rounded-full inline-block"></span>
              What is JSON & Why Do We Format It? (JSON Kya Hai?)
            </h3>
            <p className="text-xs text-slate-600">
              <strong>JSON (JavaScript Object Notation)</strong> ek lightweight data-interchange format hai jo humans ke liye padhne aur likhne me aasan hai, aur machines ke liye parse aur generate karne me behad saral hai. It is based on a subset of the JavaScript Programming Language. Aajkal modern web development me server aur client ke beech data transfer karne ke liye JSON sabse zyada use hone wala format ban chuka hai.
            </p>
            <p className="text-xs text-slate-600">
              However, APIs and backend databases often return JSON in a minified, single-line format to save bandwidth. This compact format is practically impossible to read or debug. Our <strong>Online JSON Formatter</strong> restores structural indentation, color codes different data types, and lets developers understand complex nested structures effortlessly.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-teal-500 rounded-full inline-block"></span>
              Strict JSON Syntax Rules (Strict JSON ke Mahatvapurna Niyam)
            </h3>
            <p className="text-xs text-slate-600">
              Many beginners face errors because JavaScript object syntax is more relaxed than standard JSON. To ensure your JSON code is valid, keep these strict guidelines in mind:
            </p>
            <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1.5">
              <li><strong>Double Quotes Only:</strong> All keys and string values must be enclosed in double quotes (<code>"key": "value"</code>). Single quotes (<code>'</code>) are strictly invalid.</li>
              <li><strong>No Trailing Commas:</strong> There must be no comma after the last key-value pair in an object or the last item in an array (e.g., <code>{"{"}"a": 1,{"}"}</code> is invalid).</li>
              <li><strong>Valid Data Types:</strong> JSON only supports Strings, Numbers, Objects, Arrays, Booleans (<code>true</code> / <code>false</code>), and <code>null</code>. Functions, undefined, and symbols are not allowed.</li>
              <li><strong>Plain Numbers:</strong> Avoid leading zeros in numbers (e.g., <code>05</code> is invalid, use <code>5</code> instead).</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-teal-500 rounded-full inline-block"></span>
              Step-by-Step: How to Use the Yogi JSON Formatter
            </h3>
            <p className="text-xs text-slate-600">
              Humare free utility toolkit ko use karna behad aasan hai. In steps ko follow karke aap apna JSON document behtareen tareeqe se format aur validate kar sakte hain:
            </p>
            <ol className="list-decimal pl-5 text-xs text-slate-600 space-y-1.5">
              <li><strong>Paste your Code:</strong> Paste your raw, minified, or unformatted text in the left input textarea.</li>
              <li><strong>Instant Syntax Check:</strong> Real-time parser check karega ki code valid hai ya nahi. Agar koi mistake hogi toh exact line number highight hokar screen par aa jayega.</li>
              <li><strong>Use Auto-Fix:</strong> If there are common errors like single quotes or trailing commas, click the <em>Auto-Fix Common Errors</em> button to resolve them with one click.</li>
              <li><strong>Explore Views:</strong> Switch between the interactive <strong>Tree View</strong> to collapse/expand nested objects, or <strong>Text View</strong> to read static code.</li>
              <li><strong>Filter with JSON Path:</strong> Use the query bar to search or extract nested data paths directly (e.g., <code>features.supportedFormates[0]</code>).</li>
              <li><strong>Copy or Download:</strong> Once formatted, click the copy button or download the clean <code>.json</code> file to save it.</li>
            </ol>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-teal-500 rounded-full inline-block"></span>
              JSON Error Troubleshooting Guide (Errors Kaise Thik Kare?)
            </h3>
            <p className="text-xs text-slate-600">
              Understanding common parser exceptions is key to efficient debugging. Here are the most typical messages and their fixes:
            </p>
            <div className="space-y-2 font-mono text-[11px] bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <strong className="text-rose-600">1. "Unexpected token ' in JSON at position..."</strong>
                <p className="text-[10px] text-slate-500 pl-4 mt-0.5">Fix: Single quotes ko double quotes se badlein. JSON does not allow single quotes.</p>
              </div>
              <div className="border-t border-slate-100 pt-2 mt-2">
                <strong className="text-rose-600">2. "Unexpected token {"}"} in JSON at position..."</strong>
                <p className="text-[10px] text-slate-500 pl-4 mt-0.5">Fix: Check karein ki kahi aakhiri item ke baad trailing comma toh nahi laga hai. Use hata dein.</p>
              </div>
              <div className="border-t border-slate-100 pt-2 mt-2">
                <strong className="text-rose-600">3. "Expected double-quoted property name..."</strong>
                <p className="text-[10px] text-slate-500 pl-4 mt-0.5">Fix: Keys ke aaspas double quotes zaroor lagayein (e.g., change <code>name: "John"</code> to <code>"name": "John"</code>).</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-teal-500 rounded-full inline-block"></span>
            JSON vs XML vs YAML - A Quick Comparison
          </h3>
          <p className="text-xs text-slate-600">
            For decades, developers have debated the best configuration and serialization formats. Here's how JSON matches up against its main alternatives:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="py-2.5 px-4 font-bold text-slate-800">Feature</th>
                  <th className="py-2.5 px-4 font-bold text-slate-800">JSON (Javascript Object)</th>
                  <th className="py-2.5 px-4 font-bold text-slate-800">YAML (YAML Ain't Markup)</th>
                  <th className="py-2.5 px-4 font-bold text-slate-800">XML (eXtensible Markup)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-800">Readability</td>
                  <td className="py-2.5 px-4 text-slate-600">Moderate/High (Bracket based)</td>
                  <td className="py-2.5 px-4 text-slate-600">High (Indentation based)</td>
                  <td className="py-2.5 px-4 text-slate-600">Low (Verbose tags)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-800">Payload Size</td>
                  <td className="py-2.5 px-4 text-slate-600">Small / Compact</td>
                  <td className="py-2.5 px-4 text-slate-600">Smallest</td>
                  <td className="py-2.5 px-4 text-slate-600">Large (Tag redundancy)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-800">Parsing Speed</td>
                  <td className="py-2.5 px-4 text-slate-600">Extremely Fast (Native to JS)</td>
                  <td className="py-2.5 px-4 text-slate-600">Moderate</td>
                  <td className="py-2.5 px-4 text-slate-600">Slow (Requires XML DOM Parser)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold text-slate-800">Supported Structures</td>
                  <td className="py-2.5 px-4 text-slate-600">Objects, Arrays, Primitives</td>
                  <td className="py-2.5 px-4 text-slate-600">Objects, Lists, Anchors/References</td>
                  <td className="py-2.5 px-4 text-slate-600">Hierarchical Trees, Attributes</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            JSON remains the undisputed industry standard for web services and APIs due to its lightweight properties and seamless native support in every major language environment.
          </p>
        </div>
      </section>
    
      <AccompanyingText 
        toolName="Online JSON Formatter & Validator"
        howItWorks="Our formatter uses highly advanced secure Javascript parsers right inside your browser window. Raw input strings ko analyze karke JSON syntax check kiya jata hai, aur unhe beautiful structured formats (Text or interactive Collapsible Tree model) me output kiya jata hai."
        whyItsUseful="This professional toolkit is designed for programmers, database engineers, and digital content authors who want to check, format, and correct JSON structures on the fly. Agar JSON check karne me problem aa rahi hai toh hamara validation panel exact error line coordinate point highight karega taaki aap use fatafat correct kar sakein."
        faqs={[
          { q: "JSON file format karne ke kya steps hain?", a: "Sabse pehle apna raw JSON input box me paste karein. Agar usme koi error hoga toh error details show ho jayengi jise aap 'Auto-Fix' se thik kar sakte hain. Iske baad aap 'Tree View' ya 'Text View' me result dekh kar copy ya file download kar sakte hain." },
          { q: "Does it support custom spacing configurations?", a: "Yes, you can easily toggle between 2 spaces, 4 spaces, and tab indents in the Result Workspace toolbar to match your team's code style." },
          { q: "Can I minify or escape stringified logs?", a: "Yes! Use the Minify button for compact compression, or go to the Escape tab to prepare JSON parameters for inclusion in APIs and databases without manual character changes." }
        ]}
      />
  
      <div className="max-w-3xl mx-auto my-8">
        <StarRatingWidget 
          toolId="online-json-formatter" 
          defaultRating={4.9} 
          defaultCount={245} 
          onRatingChange={(rating, count) => setRatingInfo({ rating, count })} 
        />
      </div>
      <ShareWidget title="Online JSON Formatter" />
    </article>
  );
};

export default OnlineJsonFormatter;
