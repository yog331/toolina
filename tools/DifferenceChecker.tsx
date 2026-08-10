import React, { useState, useEffect, useRef } from 'react';
import { 
  GitCompare, 
  Copy, 
  Check, 
  Trash2, 
  ArrowLeftRight, 
  Download, 
  Settings, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Sliders, 
  Sparkles, 
  Eye, 
  Share2, 
  RefreshCw,
  Plus,
  Minus,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  Code,
  BookOpen,
  Scale
} from 'lucide-react';
import AccompanyingText from '../components/AccompanyingText';
import ShareWidget from '../components/ShareWidget';
import SEO from '../components/SEO';
import StarRatingWidget from '../components/StarRatingWidget';

// --- TYPE DEFINITIONS ---
interface DiffItem {
  type: 'added' | 'removed' | 'unchanged';
  value: string;
}

interface LineDiffItem {
  type: 'added' | 'removed' | 'unchanged' | 'modified';
  originalValue?: string;
  modifiedValue?: string;
  originalLineNum?: number;
  modifiedLineNum?: number;
  wordDiffs?: {
    original: DiffItem[];
    modified: DiffItem[];
  };
}

const SAMPLE_TEXTS = {
  code: {
    name: 'TypeScript Code Revision',
    original: `function calculateTotal(price: number, taxRate: number, discount: number = 0): number {
  // Calculate raw subtotal
  const subtotal = price - discount;
  
  // Apply tax rate
  const tax = subtotal * taxRate;
  
  // Return sum of subtotal and tax
  return subtotal + tax;
}`,
    modified: `function calculateTotal(price: number, taxRate: number, discount: number = 0, isPremiumMember: boolean = false): number {
  // Calculate raw subtotal with safety check
  if (price < 0) throw new Error("Price cannot be negative");
  const subtotal = price - discount;
  
  // Apply premium membership extra 5% discount
  const finalSubtotal = isPremiumMember ? subtotal * 0.95 : subtotal;
  
  // Apply tax rate
  const tax = finalSubtotal * taxRate;
  
  // Return final calculated sum
  return Number((finalSubtotal + tax).toFixed(2));
}`
  },
  legal: {
    name: 'NDA Clause Amendment',
    original: `The Receiving Party agrees to maintain the Confidential Information in strict confidence and shall not disclose it to any third party without the prior written consent of the Disclosing Party. This restriction shall survive for a period of two (2) years from the date of disclosure.`,
    modified: `The Receiving Party hereby agrees to maintain all Confidential Information in absolute confidence and shall not disclose, publish, or disseminate it to any unauthorized third party without the express prior written consent of the Disclosing Party. This non-disclosure restriction shall survive in perpetuity from the date of initial disclosure.`
  },
  content: {
    name: 'SEO Essay Draft Comparison',
    original: `To write a great blog post, you must first do detailed keyword research. Focus on user intent. Choose a catch header that grabs attention. Then write clear, simple sentences. Finally, add high quality photos to keep users engaged and decrease bounce rates.`,
    modified: `To publish a highly optimized, high-ranking blog post, you should first perform detailed keyword search intent research. Always design around what the user is looking for. Craft a magnetic, high-CTR headline that grabs instant attention. Then write highly readable, punchy sentences. Finally, embed responsive, compressed images to maximize user engagement and reduce dwell bounce rates.`
  }
};

// --- OPTIMIZED LCS DIFF ALGORITHM ---
function lcs<T>(xs: T[], ys: T[], equals: (a: T, b: T) => boolean): { type: 'added' | 'removed' | 'unchanged', item: T }[] {
  const n = xs.length;
  const m = ys.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (equals(xs[i - 1], ys[j - 1])) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result: { type: 'added' | 'removed' | 'unchanged', item: T }[] = [];
  let i = n, j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && equals(xs[i - 1], ys[j - 1])) {
      result.unshift({ type: 'unchanged', item: xs[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'added', item: ys[j - 1] });
      j--;
    } else {
      result.unshift({ type: 'removed', item: xs[i - 1] });
      i--;
    }
  }
  return result;
}

// LCS diff wrapper with common prefix & suffix optimization
function diffArrays<T>(xs: T[], ys: T[], equals: (a: T, b: T) => boolean): { type: 'added' | 'removed' | 'unchanged', item: T }[] {
  let prefixCount = 0;
  while (prefixCount < xs.length && prefixCount < ys.length && equals(xs[prefixCount], ys[prefixCount])) {
    prefixCount++;
  }

  let suffixCount = 0;
  while (
    suffixCount < xs.length - prefixCount &&
    suffixCount < ys.length - prefixCount &&
    equals(xs[xs.length - 1 - suffixCount], ys[ys.length - 1 - suffixCount])
  ) {
    suffixCount++;
  }

  const midXs = xs.slice(prefixCount, xs.length - suffixCount);
  const midYs = ys.slice(prefixCount, ys.length - suffixCount);

  let midDiff: { type: 'added' | 'removed' | 'unchanged', item: T }[] = [];
  if (midXs.length > 0 || midYs.length > 0) {
    if (midXs.length > 1200 || midYs.length > 1200) {
      const limit = Math.max(midXs.length, midYs.length);
      for (let i = 0; i < limit; i++) {
        if (i < midXs.length) midDiff.push({ type: 'removed', item: midXs[i] });
        if (i < midYs.length) midDiff.push({ type: 'added', item: midYs[i] });
      }
    } else {
      midDiff = lcs(midXs, midYs, equals);
    }
  }

  const prefixDiff = xs.slice(0, prefixCount).map(item => ({ type: 'unchanged' as const, item }));
  const suffixDiff = xs.slice(xs.length - suffixCount).map(item => ({ type: 'unchanged' as const, item }));

  return [...prefixDiff, ...midDiff, ...suffixDiff];
}

// Word-level tokenizer
function tokenizeWords(text: string): string[] {
  const regex = /(\s+|[a-zA-Z0-9_]+|[^\s\w]+)/g;
  return text.match(regex) || [];
}

export default function DifferenceChecker() {
  // Input states
  const [originalText, setOriginalText] = useState(SAMPLE_TEXTS.code.original);
  const [modifiedText, setModifiedText] = useState(SAMPLE_TEXTS.code.modified);
  
  // Settings
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [diffLevel, setDiffLevel] = useState<'line' | 'word' | 'char'>('line');
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const [resultTheme, setResultTheme] = useState<'light' | 'dark'>('light');
  
  // Diff Calculation Results state (computed on demand/button click)
  const [hasCompared, setHasCompared] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [lineDiffs, setLineDiffs] = useState<LineDiffItem[]>([]);
  const [wordDiffs, setWordDiffs] = useState<DiffItem[]>([]);
  const [charDiffs, setCharDiffs] = useState<DiffItem[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const [stats, setStats] = useState({
    additions: 0,
    deletions: 0,
    unmodified: 0,
    similarity: 100,
    originalWords: 0,
    modifiedWords: 0,
    originalChars: 0,
    modifiedChars: 0
  });

  const resultsRef = useRef<HTMLDivElement>(null);

  // Core diff calculator triggered manually or via settings update after initial check
  const calculateDifferences = () => {
    setIsComparing(true);
    
    // Simulate slight calculation buffer for amazing UX feel
    setTimeout(() => {
      const origWords = originalText.trim() === '' ? 0 : originalText.trim().split(/\s+/).length;
      const modWords = modifiedText.trim() === '' ? 0 : modifiedText.trim().split(/\s+/).length;
      const origChars = originalText.length;
      const modChars = modifiedText.length;

      const normalize = (val: string) => {
        let result = val;
        if (ignoreCase) result = result.toLowerCase();
        if (ignoreWhitespace) result = result.trim().replace(/\s+/g, ' ');
        return result;
      };

      const equals = (a: string, b: string) => normalize(a) === normalize(b);

      // Line Level Diffing
      const originalLines = originalText.split(/\r?\n/);
      const modifiedLines = modifiedText.split(/\r?\n/);
      const lineDiffRaw = diffArrays(originalLines, modifiedLines, equals);
      
      const structuredLineDiffs: LineDiffItem[] = [];
      let origNum = 1;
      let modNum = 1;
      
      for (let idx = 0; idx < lineDiffRaw.length; idx++) {
        const current = lineDiffRaw[idx];
        
        if (current.type === 'unchanged') {
          structuredLineDiffs.push({
            type: 'unchanged',
            originalValue: current.item,
            modifiedValue: current.item,
            originalLineNum: origNum++,
            modifiedLineNum: modNum++
          });
        } else if (current.type === 'removed') {
          const next = lineDiffRaw[idx + 1];
          if (next && next.type === 'added') {
            const origLineWords = tokenizeWords(current.item);
            const modLineWords = tokenizeWords(next.item);
            const wordDiffResults = diffArrays(origLineWords, modLineWords, equals).map(d => ({
              type: d.type,
              value: d.item
            }));

            structuredLineDiffs.push({
              type: 'modified',
              originalValue: current.item,
              modifiedValue: next.item,
              originalLineNum: origNum++,
              modifiedLineNum: modNum++,
              wordDiffs: {
                original: wordDiffResults.filter(w => w.type !== 'added'),
                modified: wordDiffResults.filter(w => w.type !== 'removed')
              }
            });
            idx++; 
          } else {
            structuredLineDiffs.push({
              type: 'removed',
              originalValue: current.item,
              originalLineNum: origNum++
            });
          }
        } else if (current.type === 'added') {
          structuredLineDiffs.push({
            type: 'added',
            modifiedValue: current.item,
            modifiedLineNum: modNum++
          });
        }
      }

      // Word Level Diffing
      const origWordsList = tokenizeWords(originalText);
      const modWordsList = tokenizeWords(modifiedText);
      const wordDiffRaw = diffArrays(origWordsList, modWordsList, equals);
      const formattedWordDiffs = wordDiffRaw.map(d => ({ type: d.type, value: d.item }));

      // Character Level Diffing
      const origCharsList = originalText.split('');
      const modCharsList = modifiedText.split('');
      let charDiffRaw: { type: 'added' | 'removed' | 'unchanged', item: string }[] = [];
      if (origCharsList.length < 1500 && modCharsList.length < 1500) {
        charDiffRaw = diffArrays(origCharsList, modCharsList, (a, b) => {
          let x = a;
          let y = b;
          if (ignoreCase) { x = x.toLowerCase(); y = y.toLowerCase(); }
          return x === y;
        });
      } else {
        charDiffRaw = origCharsList.map(item => ({ type: 'unchanged' as const, item }));
      }
      const formattedCharDiffs = charDiffRaw.map(d => ({ type: d.type, value: d.item }));

      // Update Lists
      setLineDiffs(structuredLineDiffs);
      setWordDiffs(formattedWordDiffs);
      setCharDiffs(formattedCharDiffs);

      // Stats calculation
      let totalAdded = 0;
      let totalRemoved = 0;
      let totalUnchanged = 0;

      if (diffLevel === 'line') {
        structuredLineDiffs.forEach(line => {
          if (line.type === 'added') totalAdded++;
          else if (line.type === 'removed') totalRemoved++;
          else if (line.type === 'modified') {
            totalAdded++;
            totalRemoved++;
          } else totalUnchanged++;
        });
      } else if (diffLevel === 'word') {
        formattedWordDiffs.forEach(w => {
          if (w.type === 'added') totalAdded++;
          else if (w.type === 'removed') totalRemoved++;
          else totalUnchanged++;
        });
      } else {
        formattedCharDiffs.forEach(c => {
          if (c.type === 'added') totalAdded++;
          else if (c.type === 'removed') totalRemoved++;
          else totalUnchanged++;
        });
      }

      const commonCharLength = formattedCharDiffs
        .filter(item => item.type === 'unchanged')
        .reduce((acc, curr) => acc + curr.value.length, 0);
      const totalInputLength = Math.max(origChars, modChars);
      const similarity = totalInputLength === 0 ? 100 : Math.round((commonCharLength / totalInputLength) * 100);

      setStats({
        additions: totalAdded,
        deletions: totalRemoved,
        unmodified: totalUnchanged,
        similarity: isNaN(similarity) ? 0 : similarity,
        originalWords: origWords,
        modifiedWords: modWords,
        originalChars: origChars,
        modifiedChars: modChars
      });

      setHasCompared(true);
      setIsComparing(false);

      // Smooth scroll to results block
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 350);
  };

  // Re-run computation automatically if parameters change *after* the first click
  useEffect(() => {
    if (hasCompared) {
      calculateDifferences();
    }
  }, [ignoreCase, ignoreWhitespace, diffLevel]);

  // Load sample data helper
  const loadSample = (type: 'code' | 'legal' | 'content') => {
    setOriginalText(SAMPLE_TEXTS[type].original);
    setModifiedText(SAMPLE_TEXTS[type].modified);
    setHasCompared(false); // Reset comparison to let user click the Compare button
  };

  // Swap texts helper
  const handleSwap = () => {
    const temp = originalText;
    setOriginalText(modifiedText);
    setModifiedText(temp);
    setHasCompared(false);
  };

  // Clear texts helper
  const handleClear = () => {
    setOriginalText('');
    setModifiedText('');
    setHasCompared(false);
  };

  // Copy full diff report to clipboard
  const copyReport = () => {
    let report = `=== TEXT DIFFERENCE CHECKER REPORT ===\n`;
    report += `Timestamp: ${new Date().toLocaleString()}\n`;
    report += `Similarity Score: ${stats.similarity}%\n`;
    report += `Additions: ${stats.additions} | Deletions: ${stats.deletions}\n`;
    report += `Original Text: ${stats.originalWords} words, ${stats.originalChars} chars\n`;
    report += `Modified Text: ${stats.modifiedWords} words, ${stats.modifiedChars} chars\n\n`;
    report += `=== DETAILED DIFF ===\n`;

    if (diffLevel === 'line') {
      lineDiffs.forEach(item => {
        if (item.type === 'unchanged') {
          report += `  ${item.originalValue}\n`;
        } else if (item.type === 'removed') {
          report += `- ${item.originalValue}\n`;
        } else if (item.type === 'added') {
          report += `+ ${item.modifiedValue}\n`;
        } else if (item.type === 'modified') {
          report += `- ${item.originalValue}\n`;
          report += `+ ${item.modifiedValue}\n`;
        }
      });
    } else {
      const items = diffLevel === 'word' ? wordDiffs : charDiffs;
      items.forEach(item => {
        if (item.type === 'unchanged') report += item.value;
        else if (item.type === 'added') report += `[+${item.value}]`;
        else if (item.type === 'removed') report += `[-${item.value}]`;
      });
    }

    navigator.clipboard.writeText(report).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  // Download raw HTML/CSS Difference Report
  const downloadReport = () => {
    const el = document.createElement('a');
    const content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Text Diff Checker Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 2rem; background: #f8fafc; color: #1e293b; }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    .meta { color: #64748b; font-size: 0.875rem; margin-bottom: 1.5rem; }
    .badge { padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-weight: bold; font-size: 0.75rem; }
    .badge-sim { background: #ccfbf1; color: #0f766e; }
    .badge-add { background: #dcfce7; color: #166534; }
    .badge-del { background: #fee2e2; color: #991b1b; }
    .container { background: white; border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    pre { font-family: monospace; white-space: pre-wrap; font-size: 0.875rem; line-height: 1.5; margin: 0; }
    .added { background-color: #dcfce7; color: #14532d; text-decoration: none; font-weight: bold; }
    .removed { background-color: #fee2e2; color: #7f1d1d; text-decoration: line-through; }
  </style>
</head>
<body>
  <h1>Text Difference Comparison Report</h1>
  <div class="meta">
    Generated on: ${new Date().toLocaleString()} &bull; 
    <span class="badge badge-sim">Similarity: ${stats.similarity}%</span>
    <span class="badge badge-add">+ ${stats.additions} Additions</span>
    <span class="badge badge-del">- ${stats.deletions} Deletions</span>
  </div>
  <div class="container">
    <pre>${
      diffLevel === 'line' 
        ? lineDiffs.map(line => {
            if (line.type === 'added') return `<span class="added">+ ${line.modifiedValue}</span>`;
            if (line.type === 'removed') return `<span class="removed">- ${line.originalValue}</span>`;
            if (line.type === 'modified') return `<span class="removed">- ${line.originalValue}</span>\n<span class="added">+ ${line.modifiedValue}</span>`;
            return `  ${line.originalValue}`;
          }).join('\n')
        : (diffLevel === 'word' ? wordDiffs : charDiffs).map(item => {
            if (item.type === 'added') return `<span class="added">${item.value}</span>`;
            if (item.type === 'removed') return `<span class="removed">${item.value}</span>`;
            return item.value;
          }).join('')
    }</pre>
  </div>
</body>
</html>`;
    const file = new Blob([content], { type: 'text/html' });
    el.href = URL.createObjectURL(file);
    el.download = `diff-checker-report-${Date.now()}.html`;
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Dynamic SEO Tags */}
      <SEO 
        title="Online Difference Checker | Professional Text, PDF & Code Compare Tool"
        description="Compare two text drafts, legal documents, articles, or program files side-by-side. Free client-side, secure text difference highlight tool with similarity scores."
        keywords="text diff checker, online difference finder, compare text drafts, side-by-side text compare, inline git diff tool, code difference checker, document validator, free word diff, PDF comparison online, secure text comparison"
      />

      {/* JSON-LD Structured Data Schema for rich search results */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Online Difference Checker",
          "alternateName": "Text Diff Tool",
          "description": "High-precision web tool to compare documents, code scripts, or articles side-by-side or inline using the Longest Common Subsequence (LCS) algorithm.",
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "All",
          "browserRequirements": "Requires JavaScript. Requires HTML5.",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": [
            "Side-by-side split visual comparison",
            "Unified inline comparison",
            "Word and character level difference highlight",
            "100% Secure offline client-side calculation",
            "Automatic text similarity metric"
          ]
        })}
      </script>

      {/* Hero Header Section */}
      <header className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.18),transparent)] pointer-events-none rounded-full" />
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-teal-400 font-black text-[10px] tracking-widest uppercase rounded-full border border-white/5">
            <GitCompare className="w-3.5 h-3.5" /> High-Accuracy Comparison Utility
          </div>
          <h1 className="text-3xl md:text-6xl font-display font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-teal-200">
            Difference Checker
          </h1>
          <p className="text-xs md:text-base text-slate-300 max-w-2xl font-medium">
            Paste your original and modified drafts to find deletions, modifications, and additions instantly. Secure, browser-based, high-precision analyzer.
          </p>
          
          {/* Preset templates selector right at the top */}
          <div className="pt-4 flex flex-wrap gap-2.5 items-center">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Try Sample Templates:
            </span>
            <button
              onClick={() => loadSample('code')}
              className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-[11px] font-bold text-teal-400 rounded-xl transition-all border border-white/10 flex items-center gap-1.5"
            >
              <Code className="w-3.5 h-3.5" /> Code Snippet
            </button>
            <button
              onClick={() => loadSample('legal')}
              className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-[11px] font-bold text-teal-400 rounded-xl transition-all border border-white/10 flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5" /> Legal Clause
            </button>
            <button
              onClick={() => loadSample('content')}
              className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-[11px] font-bold text-teal-400 rounded-xl transition-all border border-white/10 flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" /> Article Draft
            </button>
          </div>
        </div>
      </header>

      {/* Redesigned Step 1: Multi-column Large Input Section */}
      <main className="space-y-8">
        <section className="bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">1</span>
                Input Comparison Drafts
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Paste the original file contents on the left, and your modified text on the right.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleSwap}
                className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all"
                title="Swap original and modified text inputs"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-teal-600" /> Swap
              </button>
              <button
                onClick={handleClear}
                className="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-1.5 transition-all"
                title="Clear both inputs"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Original Draft Input Card */}
            <div className="space-y-2 flex flex-col">
              <div className="flex justify-between items-center px-1">
                <label htmlFor="original-draft-input" className="text-xs font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400" /> Draft A (Original Draft)
                </label>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {originalText.length} Chars &bull; {originalText.trim() === '' ? 0 : originalText.trim().split(/\s+/).length} Words
                </span>
              </div>
              <textarea
                id="original-draft-input"
                value={originalText}
                onChange={(e) => {
                  setOriginalText(e.target.value);
                  setHasCompared(false); // input modified, user needs to click button again
                }}
                placeholder="Paste original text, source code, document draft, or initial list here..."
                className="w-full h-[400px] md:h-[480px] bg-slate-50/50 border border-slate-200 rounded-2xl p-5 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none resize-none leading-relaxed transition-all"
              />
            </div>

            {/* Modified Draft Input Card */}
            <div className="space-y-2 flex flex-col">
              <div className="flex justify-between items-center px-1">
                <label htmlFor="modified-draft-input" className="text-xs font-extrabold uppercase tracking-widest text-teal-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500" /> Draft B (Modified Draft)
                </label>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {modifiedText.length} Chars &bull; {modifiedText.trim() === '' ? 0 : modifiedText.trim().split(/\s+/).length} Words
                </span>
              </div>
              <textarea
                id="modified-draft-input"
                value={modifiedText}
                onChange={(e) => {
                  setModifiedText(e.target.value);
                  setHasCompared(false); // input modified, user needs to click button again
                }}
                placeholder="Paste updated text, modified code, amended legal clauses, or revised list here..."
                className="w-full h-[400px] md:h-[480px] bg-slate-50/50 border border-slate-200 rounded-2xl p-5 text-sm font-mono focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none resize-none leading-relaxed transition-all"
              />
            </div>

          </div>

          {/* Quick Settings Bar positioned between the big inputs and the Compare button */}
          <div className="bg-slate-50 border border-slate-150 p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-teal-600" /> Advanced Comparison Options
            </h3>

            <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
              {/* Diff Granularity */}
              <div className="space-y-1.5 flex-1 max-w-sm">
                <span className="text-xs font-bold text-slate-600 block">Diff Granularity Level</span>
                <div className="grid grid-cols-3 gap-1 bg-slate-250 p-1 rounded-xl border border-slate-200">
                  {(['line', 'word', 'char'] as const).map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setDiffLevel(level)}
                      className={`py-1.5 px-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all text-center ${
                        diffLevel === level 
                          ? 'bg-teal-600 text-white shadow-xs' 
                          : 'text-slate-600 hover:text-slate-800 bg-transparent'
                      }`}
                    >
                      {level === 'line' ? 'Lines' : level === 'word' ? 'Words' : 'Characters'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Strictness Toggles */}
              <div className="flex flex-wrap gap-4 items-center">
                <label className="flex items-center gap-2.5 text-xs font-bold text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ignoreCase}
                    onChange={(e) => setIgnoreCase(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500/50 w-4.5 h-4.5 border-slate-300"
                  />
                  <span>Ignore Case (A vs a)</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs font-bold text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ignoreWhitespace}
                    onChange={(e) => setIgnoreWhitespace(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500/50 w-4.5 h-4.5 border-slate-300"
                  />
                  <span>Ignore Whitespaces</span>
                </label>
              </div>
            </div>
          </div>

          {/* Primary tacticle check differences button */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={calculateDifferences}
              disabled={isComparing}
              className="px-8 py-4.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:from-teal-400 disabled:to-emerald-400 text-white rounded-2xl text-sm md:text-base font-black uppercase tracking-wider shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
            >
              {isComparing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Analyzing Differences...
                </>
              ) : (
                <>
                  <GitCompare className="w-5 h-5" />
                  Check Differences Now
                </>
              )}
            </button>
          </div>
        </section>

        {/* Results Block - Becomes fully interactive or scrolls here once calculated */}
        <section 
          ref={resultsRef} 
          className={`transition-all duration-500 ${
            hasCompared ? 'opacity-100 scale-100' : 'opacity-40 pointer-events-none select-none blur-xs'
          }`}
        >
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 md:p-8 shadow-sm space-y-6">
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">2</span>
                  Comparison Results & Visualizer
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Analyze differences with interactive highlighters, download reports, or review match rates.
                </p>
              </div>

              {/* Action utilities bar */}
              {hasCompared && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={copyReport}
                    className="p-2 px-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition-all text-xs font-bold flex items-center gap-1.5"
                    title="Copy full diff comparison text report"
                  >
                    {copySuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-teal-600" />}
                    <span>{copySuccess ? 'Copied Report' : 'Copy Text Report'}</span>
                  </button>
                  <button
                    onClick={downloadReport}
                    className="p-2 px-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 transition-all text-xs font-bold flex items-center gap-1.5"
                    title="Download standalone HTML difference report"
                  >
                    <Download className="w-4 h-4 text-teal-600" />
                    <span>Download HTML Report</span>
                  </button>
                </div>
              )}
            </div>

            {/* Metrics cards and actual diff viewer */}
            <div className="space-y-6">
              
              {/* Results Header Metrics: Similarity meter & stats displayed full-width above */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Similarity score meter */}
                <div className="bg-slate-50 border border-slate-200 rounded-[1.8rem] p-5 relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-teal-500" /> Match Metrics
                    </h3>

                    <div className="flex items-center gap-4">
                      {/* SVG progress circle */}
                      <div className="w-20 h-20 rounded-full bg-slate-100 flex flex-col items-center justify-center relative shrink-0">
                        <span className="text-xl font-black text-slate-800 leading-none z-10">{stats.similarity}%</span>
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1 z-10">Match</span>
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
                          <circle
                            cx="40"
                            cy="40"
                            r="34"
                            className="stroke-slate-200 fill-none"
                            strokeWidth="5"
                          />
                          <circle 
                            cx="40" 
                            cy="40" 
                            r="34" 
                            className="stroke-teal-600 fill-none"
                            strokeWidth="5"
                            strokeDasharray="213.6"
                            strokeDashoffset={213.6 - (213.6 * stats.similarity) / 100}
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-black text-slate-700">Text Match Rate</p>
                        <p className="text-[11px] text-slate-400 font-medium">
                          Similarity index computed using LCS algorithm.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-200/60 grid grid-cols-3 gap-1 text-center">
                    <div>
                      <span className="block text-xs font-black text-emerald-600">+{stats.additions}</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Additions</span>
                    </div>
                    <div className="border-l border-slate-200">
                      <span className="block text-xs font-black text-rose-500">-{stats.deletions}</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Deletions</span>
                    </div>
                    <div className="border-l border-slate-200">
                      <span className="block text-xs font-black text-slate-600">={stats.unmodified}</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Unchanged</span>
                    </div>
                  </div>
                </div>

                {/* Audit overview card */}
                <div className="bg-slate-50 border border-slate-200 rounded-[1.8rem] p-5 space-y-3 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Content Audit Profile</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-500">Original Chars / Words:</span>
                        <span className="font-mono font-black text-slate-700">{stats.originalChars} / {stats.originalWords}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-500">Modified Chars / Words:</span>
                        <span className="font-mono font-black text-slate-700">{stats.modifiedChars} / {stats.modifiedWords}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200/60 pt-3 flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-500">Net Deviation:</span>
                    <span className="font-mono font-black text-slate-700">
                      {stats.modifiedChars - stats.originalChars >= 0 ? '+' : ''}
                      {stats.modifiedChars - stats.originalChars} chars
                    </span>
                  </div>
                </div>

              </div>

              {/* Results Main Area: The actual visualizer, now full-width */}
              <div className="space-y-4">
                
                {/* Visualizer tab switcher (Unified vs Split view) */}
                <div className="bg-slate-100 p-3 rounded-2xl flex flex-col lg:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    {diffLevel === 'line' ? (
                      <div className="flex gap-1 bg-slate-200 p-0.5 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setViewMode('split')}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                            viewMode === 'split' 
                              ? 'bg-white text-slate-800 shadow-xs' 
                              : 'text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          Side-By-Side Split
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewMode('unified')}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                            viewMode === 'unified' 
                              ? 'bg-white text-slate-800 shadow-xs' 
                              : 'text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          Inline Unified
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pl-2">
                        Sequential Diff Stream
                      </span>
                    )}

                    {/* Terminal Theme Selector */}
                    <div className="flex items-center gap-1 bg-slate-200 p-0.5 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setResultTheme('light')}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                          resultTheme === 'light' 
                            ? 'bg-white text-slate-800 shadow-xs' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-white border border-slate-300 block" />
                        <span>Light</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setResultTheme('dark')}
                        className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                          resultTheme === 'dark' 
                            ? 'bg-white text-slate-800 shadow-xs' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700 block" />
                        <span>Dark</span>
                      </button>
                    </div>
                  </div>

                  {/* Highlights Legend */}
                  <div className="flex flex-wrap items-center gap-3 text-[9px] font-extrabold uppercase tracking-wider shrink-0 lg:pr-1">
                    <span className="flex items-center gap-1 text-emerald-600">
                      <span className="w-2.5 h-2.5 rounded-xs bg-emerald-100 border border-emerald-300 inline-block" />
                      Added (+)
                    </span>
                    <span className="flex items-center gap-1 text-rose-600">
                      <span className="w-2.5 h-2.5 rounded-xs bg-rose-100 border border-rose-300 inline-block" />
                      Deleted (-)
                    </span>
                    <span className="flex items-center gap-1 text-amber-600">
                      <span className="w-2.5 h-2.5 rounded-xs bg-amber-100 border border-amber-300 inline-block" />
                      Modified
                    </span>
                  </div>
                </div>

                {/* Diff Render Terminal (Enlarged to match input area size) */}
                <div className={`rounded-3xl p-5 md:p-6 shadow-xl overflow-x-auto h-[400px] md:h-[480px] overflow-y-auto min-h-[400px] md:min-h-[480px] transition-colors duration-200 ${
                  resultTheme === 'light' 
                    ? 'bg-white text-slate-800 border border-slate-200/80 shadow-slate-100' 
                    : 'bg-slate-950 text-slate-100 border border-white/5'
                }`}>
                  
                  {diffLevel === 'line' ? (
                    viewMode === 'split' ? (
                      // Side-by-Side Split View
                      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 divide-y md:divide-y-0 md:divide-x font-mono text-[11px] md:text-xs leading-relaxed ${
                        resultTheme === 'light' ? 'divide-slate-200' : 'divide-white/10'
                      }`}>
                        
                        {/* Original - Left Column */}
                        <div className="space-y-1">
                          <div className={`text-[10px] font-black uppercase tracking-widest pb-2 border-b mb-2 flex justify-between items-center ${
                            resultTheme === 'light' ? 'text-slate-500 border-slate-200' : 'text-slate-400 border-white/5'
                          }`}>
                            <span>Draft A (Original)</span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                              resultTheme === 'light' ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-300'
                            }`}>LCS ORIGINAL</span>
                          </div>
                          {lineDiffs.map((line, idx) => {
                            if (line.type === 'added') {
                              return (
                                <div key={idx} className={`italic select-none py-0.5 pl-2 transition-opacity duration-150 ${
                                  resultTheme === 'light' ? 'bg-slate-50 text-slate-400 opacity-60' : 'bg-slate-800/20 text-slate-600 opacity-20'
                                }`}>
                                  &bull; No corresponding text here
                                </div>
                              );
                            }
                            const bg = line.type === 'removed' 
                              ? (resultTheme === 'light' ? 'bg-rose-100/50 text-rose-900 border-l-2 border-rose-500 pl-1.5' : 'bg-rose-950/40 text-rose-200 border-l-2 border-rose-500 pl-1.5')
                              : line.type === 'modified' 
                              ? (resultTheme === 'light' ? 'bg-amber-100/50 text-amber-900 border-l-2 border-amber-500 pl-1.5' : 'bg-amber-950/25 text-amber-200 border-l-2 border-amber-500 pl-1.5')
                              : (resultTheme === 'light' ? 'text-slate-700 pl-2' : 'text-slate-300 pl-2');
                            const prefix = line.type === 'removed' ? '-' : line.type === 'modified' ? '✎' : ' ';
                            
                            return (
                              <div key={idx} className={`flex items-start gap-1.5 py-0.5 rounded-sm ${bg}`}>
                                <span className={`w-6 text-right shrink-0 select-none font-bold ${
                                  resultTheme === 'light' ? 'text-slate-400' : 'text-slate-500'
                                }`}>{line.originalLineNum}</span>
                                <span className={`w-2.5 text-center font-bold select-none ${
                                  resultTheme === 'light' ? 'text-slate-400' : 'text-slate-400'
                                }`}>{prefix}</span>
                                <span className="whitespace-pre-wrap select-all flex-1">
                                  {line.type === 'modified' && line.wordDiffs ? (
                                    line.wordDiffs.original.map((chunk, cIdx) => (
                                      <span key={cIdx} className={
                                        chunk.type === 'removed' 
                                          ? (resultTheme === 'light' ? 'bg-rose-200 text-rose-950 px-0.5 rounded font-medium' : 'bg-rose-800/60 px-0.5 rounded text-white') 
                                          : ''
                                      }>
                                        {chunk.value}
                                      </span>
                                    ))
                                  ) : (
                                    line.originalValue
                                  )}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Modified - Right Column */}
                        <div className="space-y-1 md:pl-4">
                          <div className={`text-[10px] font-black uppercase tracking-widest pb-2 border-b mb-2 flex justify-between items-center ${
                            resultTheme === 'light' ? 'text-teal-600 border-slate-200' : 'text-teal-400 border-white/5'
                          }`}>
                            <span>Draft B (Modified)</span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                              resultTheme === 'light' ? 'bg-teal-50 text-teal-700' : 'bg-teal-950/40 text-teal-300'
                            }`}>LCS REVISED</span>
                          </div>
                          {lineDiffs.map((line, idx) => {
                            if (line.type === 'removed') {
                              return (
                                <div key={idx} className={`italic select-none py-0.5 pl-2 transition-opacity duration-150 ${
                                  resultTheme === 'light' ? 'bg-slate-50 text-slate-400 opacity-60' : 'bg-slate-800/20 text-slate-600 opacity-20'
                                }`}>
                                  &bull; No corresponding text here
                                </div>
                              );
                            }
                            const bg = line.type === 'added' 
                              ? (resultTheme === 'light' ? 'bg-emerald-100/50 text-emerald-900 border-l-2 border-emerald-500 pl-1.5' : 'bg-emerald-950/40 text-emerald-200 border-l-2 border-emerald-500 pl-1.5')
                              : line.type === 'modified' 
                              ? (resultTheme === 'light' ? 'bg-amber-100/50 text-emerald-900 border-l-2 border-amber-500 pl-1.5' : 'bg-amber-950/25 text-emerald-200 border-l-2 border-amber-500 pl-1.5')
                              : (resultTheme === 'light' ? 'text-slate-700 pl-2' : 'text-slate-300 pl-2');
                            const prefix = line.type === 'added' ? '+' : line.type === 'modified' ? '✎' : ' ';
                            
                            return (
                              <div key={idx} className={`flex items-start gap-1.5 py-0.5 rounded-sm ${bg}`}>
                                <span className={`w-6 text-right shrink-0 select-none font-bold ${
                                  resultTheme === 'light' ? 'text-slate-400' : 'text-slate-500'
                                }`}>{line.modifiedLineNum}</span>
                                <span className={`w-2.5 text-center font-bold select-none ${
                                  resultTheme === 'light' ? 'text-slate-400' : 'text-slate-400'
                                }`}>{prefix}</span>
                                <span className="whitespace-pre-wrap select-all flex-1">
                                  {line.type === 'modified' && line.wordDiffs ? (
                                    line.wordDiffs.modified.map((chunk, cIdx) => (
                                      <span key={cIdx} className={
                                        chunk.type === 'added' 
                                          ? (resultTheme === 'light' ? 'bg-emerald-200 text-emerald-950 px-0.5 rounded font-medium' : 'bg-emerald-800/60 px-0.5 rounded text-white') 
                                          : ''
                                      }>
                                        {chunk.value}
                                      </span>
                                    ))
                                  ) : (
                                    line.modifiedValue
                                  )}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                      </div>
                    ) : (
                      // Inline Unified View
                      <div className="space-y-1.5 font-mono text-[11px] md:text-xs leading-relaxed">
                        {lineDiffs.map((line, idx) => {
                          if (line.type === 'removed') {
                            return (
                              <div key={idx} className={`border-l-4 p-1 rounded-r flex items-start gap-2 ${
                                resultTheme === 'light' 
                                  ? 'bg-rose-100/40 text-rose-900 border-rose-500' 
                                  : 'bg-rose-950/40 text-rose-200 border-rose-500'
                              }`}>
                                <span className={`w-8 text-right select-none shrink-0 ${
                                  resultTheme === 'light' ? 'text-rose-400' : 'text-rose-400/50'
                                }`}>{line.originalLineNum}</span>
                                <span className="w-8 text-center select-none">-</span>
                                <span className="whitespace-pre-wrap flex-1 select-all">{line.originalValue}</span>
                              </div>
                            );
                          }
                          if (line.type === 'added') {
                            return (
                              <div key={idx} className={`border-l-4 p-1 rounded-r flex items-start gap-2 ${
                                resultTheme === 'light' 
                                  ? 'bg-emerald-100/40 text-emerald-900 border-emerald-500' 
                                  : 'bg-emerald-950/40 text-emerald-200 border-emerald-500'
                              }`}>
                                <span className="w-8 text-right select-none" />
                                <span className={`w-8 text-right select-none shrink-0 ${
                                  resultTheme === 'light' ? 'text-emerald-400' : 'text-emerald-400/50'
                                }`}>{line.modifiedLineNum}</span>
                                <span className="w-8 text-center select-none">+</span>
                                <span className="whitespace-pre-wrap flex-1 select-all">{line.modifiedValue}</span>
                              </div>
                            );
                          }
                          if (line.type === 'modified') {
                            return (
                              <div key={idx} className={`space-y-1 rounded overflow-hidden ${
                                resultTheme === 'light' ? 'bg-amber-50 border border-amber-100' : 'bg-amber-950/10'
                              }`}>
                                <div className={`border-l-4 p-1.5 flex items-start gap-2 ${
                                  resultTheme === 'light' 
                                    ? 'bg-rose-100/20 text-rose-900 border-rose-500' 
                                    : 'bg-rose-950/20 text-rose-200/90 border-rose-500'
                                }`}>
                                  <span className={`w-8 text-right select-none shrink-0 ${
                                    resultTheme === 'light' ? 'text-rose-400' : 'text-rose-400/40'
                                  }`}>{line.originalLineNum}</span>
                                  <span className="w-8 select-none" />
                                  <span className="w-8 text-center select-none">-</span>
                                  <span className="whitespace-pre-wrap flex-1 select-all">
                                    {line.wordDiffs ? (
                                      line.wordDiffs.original.map((chunk, cIdx) => (
                                        <span key={cIdx} className={
                                          chunk.type === 'removed' 
                                            ? (resultTheme === 'light' ? 'bg-rose-200 text-rose-950 px-0.5 rounded font-medium' : 'bg-rose-800/50 px-0.5 rounded text-white') 
                                            : ''
                                        }>
                                          {chunk.value}
                                        </span>
                                      ))
                                    ) : (
                                      line.originalValue
                                    )}
                                  </span>
                                </div>
                                <div className={`border-l-4 p-1.5 flex items-start gap-2 ${
                                  resultTheme === 'light' 
                                    ? 'bg-emerald-100/20 text-emerald-900 border-emerald-500' 
                                    : 'bg-emerald-950/20 text-emerald-200/90 border-emerald-500'
                                }`}>
                                  <span className="w-8 select-none" />
                                  <span className={`w-8 text-right select-none shrink-0 ${
                                    resultTheme === 'light' ? 'text-emerald-400' : 'text-emerald-400/40'
                                  }`}>{line.modifiedLineNum}</span>
                                  <span className="w-8 text-center select-none">+</span>
                                  <span className="whitespace-pre-wrap flex-1 select-all">
                                    {line.wordDiffs ? (
                                      line.wordDiffs.modified.map((chunk, cIdx) => (
                                        <span key={cIdx} className={
                                          chunk.type === 'added' 
                                            ? (resultTheme === 'light' ? 'bg-emerald-200 text-emerald-950 px-0.5 rounded font-medium' : 'bg-emerald-800/50 px-0.5 rounded text-white') 
                                            : ''
                                        }>
                                          {chunk.value}
                                        </span>
                                      ))
                                    ) : (
                                      line.modifiedValue
                                    )}
                                  </span>
                                </div>
                              </div>
                            );
                          }
                          return (
                            <div key={idx} className={`p-1 flex items-start gap-2 transition-colors ${
                              resultTheme === 'light' 
                                ? 'text-slate-700 hover:bg-slate-100/50' 
                                : 'text-slate-300 hover:bg-white/5'
                            }`}>
                              <span className={`w-8 text-right select-none shrink-0 ${
                                resultTheme === 'light' ? 'text-slate-400' : 'text-slate-500'
                              }`}>{line.originalLineNum}</span>
                              <span className={`w-8 text-right select-none shrink-0 ${
                                resultTheme === 'light' ? 'text-slate-400' : 'text-slate-500'
                              }`}>{line.modifiedLineNum}</span>
                              <span className={`w-8 text-center select-none ${
                                resultTheme === 'light' ? 'text-slate-400' : 'text-slate-500'
                              }`}> </span>
                              <span className="whitespace-pre-wrap flex-1 select-all">{line.originalValue}</span>
                            </div>
                          );
                        })}
                      </div>
                    )
                  ) : diffLevel === 'word' ? (
                    // Word-Level Stream View
                    <div className="font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto p-2 select-all">
                      {wordDiffs.map((chunk, idx) => {
                        if (chunk.type === 'added') {
                          return (
                            <span key={idx} className={`px-1 py-0.5 mx-0.5 rounded border font-bold ${
                              resultTheme === 'light'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300/60'
                                : 'bg-emerald-900/60 text-emerald-200 border-emerald-500/30'
                            }`} title="Added word">
                              {chunk.value}
                            </span>
                          );
                        }
                        if (chunk.type === 'removed') {
                          return (
                            <span key={idx} className={`px-1 py-0.5 mx-0.5 rounded border line-through ${
                              resultTheme === 'light'
                                ? 'bg-rose-100 text-rose-800 border-rose-300/60'
                                : 'bg-rose-950/60 text-rose-300 border-rose-500/30'
                            }`} title="Removed word">
                              {chunk.value}
                            </span>
                          );
                        }
                        return <span key={idx} className={resultTheme === 'light' ? 'text-slate-700' : 'text-slate-300'}>{chunk.value}</span>;
                      })}
                    </div>
                  ) : (
                    // Character-Level Stream View
                    <div className="font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto p-2 select-all">
                      {charDiffs.map((chunk, idx) => {
                        if (chunk.type === 'added') {
                          return (
                            <span key={idx} className={`font-bold px-0.5 rounded-sm ${
                              resultTheme === 'light'
                                ? 'bg-emerald-200 text-emerald-900'
                                : 'bg-emerald-900/80 text-emerald-100'
                            }`} title="Added character">
                              {chunk.value}
                            </span>
                          );
                        }
                        if (chunk.type === 'removed') {
                          return (
                            <span key={idx} className={`line-through px-0.5 rounded-sm ${
                              resultTheme === 'light'
                                ? 'bg-rose-200 text-rose-900'
                                : 'bg-rose-950 text-rose-300'
                            }`} title="Removed character">
                              {chunk.value}
                            </span>
                          );
                        }
                        return <span key={idx} className={resultTheme === 'light' ? 'text-slate-700' : 'text-slate-300'}>{chunk.value}</span>;
                      })}
                    </div>
                  )}

                </div>
              </div>

            </div>

          </div>
        </section>
      </main>

      {/* Share and Rating Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 pt-4">
        <ShareWidget 
          toolName="Online Text Difference Checker" 
          shareUrl={window.location.href} 
          noMargin
        />
        <StarRatingWidget toolId="diff-checker-tool" />
      </div>

      {/* Extreme SEO Optimization Segment: In-Depth Guide & FAQs */}
      <section className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 md:p-10 space-y-10">
        
        {/* Visual divider layout with content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              Comprehensive Guide to Text & Code Difference Verification
            </h2>
            
            <p className="text-sm text-slate-600 leading-relaxed">
              When drafting documents, comparing code, or amending contracts, manual checking is prone to human error and consumes substantial time. An <strong>online diff checker</strong> provides an automated, programmatic, and mathematically rigorous solution to contrast two pieces of data.
            </p>

            <h3 className="text-lg font-bold text-slate-800">
              The LCS Algorithm: The Mathematics Behind Finding Text Deviations
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              This comparison tool leverages the <strong>Longest Common Subsequence (LCS) algorithm</strong>. Unlike direct comparisons, LCS maps common subsets of elements chronologically, regardless of insertions or deletions that disrupt normal indexes. This ensures that if a paragraph is injected into Draft B, the algorithm does not break, but rather flags that specific paragraph as an <span className="text-emerald-600 font-semibold">Addition</span> and aligns the remaining text perfectly.
            </p>

            <h3 className="text-lg font-bold text-slate-800">
              Split vs. Unified: Which Diff Mode is Best for You?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="font-bold text-sm text-slate-800 block mb-1">Side-by-Side Split View</span>
                <span className="text-xs text-slate-500 leading-relaxed block">
                  Best for comparing complex blocks, books, or lengthy legal agreements. It displays Draft A and Draft B horizontally, highlighting precise, micro-level adjustments side-by-side with row locking.
                </span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="font-bold text-sm text-slate-800 block mb-1">Inline Unified View</span>
                <span className="text-xs text-slate-500 leading-relaxed block">
                  Best for programmers and engineers accustomed to GitHub PRs or git diff commands. It layers both documents into a single fluid stream, using strike-throughs for removed lines and green backgrounds for newly injected lines.
                </span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-800">
              Key Use Cases of Modern Text Difference Checkers
            </h3>
            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
              <li><strong>Software Developers:</strong> Review changes in scripts, configuration files, and JSON schemas before staging code commit states.</li>
              <li><strong>Legal Professionals:</strong> Auditing contracts, NDAs, or agreements to detect unauthorized clause insertions or subtle modifications.</li>
              <li><strong>Writers &amp; Copyeditors:</strong> Compare book drafts, blog articles, and SEO content revisions to track developmental changes over time.</li>
              <li><strong>Academic Researchers:</strong> Compare quotes, verify literature summaries, or isolate citation additions.</li>
            </ul>
          </div>

          <div className="lg:col-span-4 space-y-6 lg:border-l lg:border-slate-200 lg:pl-8">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">
              Privacy & Security Shield
            </h3>
            <div className="bg-teal-50 border border-teal-100 p-4.5 rounded-2xl space-y-2.5">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
                ✓
              </div>
              <h4 className="text-xs font-black uppercase tracking-widest text-teal-800">100% Secure & Local</h4>
              <p className="text-[11px] text-teal-700 leading-relaxed">
                We believe in absolute data secrecy. The entire calculation logic executes inside your local browser via JavaScript. No characters, sentences, code files, or NDAs are ever sent to an external server or cloud service.
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-500">
              <p className="font-bold text-slate-700">Supported Devices:</p>
              <p>Fully responsive on mobile phones, tablets, MacBooks, and desktop screens.</p>
              <p className="font-bold text-slate-700 pt-2">Offline Capability:</p>
              <p>As a progressive utility, you can run diffs offline once the web application loads completely in your session.</p>
            </div>
          </div>

        </div>

      </section>

      {/* Standard structured SEO FAQs wrapper */}
      <AccompanyingText 
        toolName="Online Text Difference Checker"
        howItWorks="Our Online Text Difference Checker uses a highly optimized Longest Common Subsequence (LCS) search engine algorithm. It scans your original input text (Draft A) and modified text (Draft B), identifies common substrings or prefixes, and highlights the remaining divergent segments. You can toggle between line-by-line matching, word-by-word tokenized alignment, and character-level pinpoint validation to check exact character alterations."
        whyItsUseful="This professional utility is extremely useful for software developers verifying code iterations, legal experts assessing contract amendments, writers/journalists proofreading text drafts, and SEO analysts identifying keyword edits in blog posts. Because all computing occurs fully client-side inside your modern web browser, your sensitive data is 100% private, secure, and never transmitted to external cloud servers."
        faqs={[
          {
            q: "Is my text data safe and secure on this platform?",
            a: "Absolutely! The entire comparison logic runs 100% client-side inside your local browser. No data or drafts are uploaded to any server or shared with anyone, making it compliant with confidential corporate and legal data security rules."
          },
          {
            q: "What is the difference between split and unified view?",
            a: "Split view places the original text on the left and the modified text on the right side-by-side with synchronized rows. Unified view blends them into a single chronological stream, using green highlights for additions (+) and red highlights for deletions (-), identical to standard GitHub commits."
          },
          {
            q: "How does the 'Ignore Case' setting work?",
            a: "When 'Ignore Case' is checked, the difference checker converts letters to lowercase before running the comparison. This allows you to find semantic additions or omissions without getting distracted by capitalized or lowercase letter modifications."
          },
          {
            q: "Can I compare code snippets using this tool?",
            a: "Yes! Our engine has a built-in 'TypeScript Code Revision' sample template. It properly preserves programming indentation, brackets, brackets closures, and quotes, making it ideal for review of JavaScript, HTML, CSS, JSON, or python code."
          },
          {
            q: "Can this tool calculate text similarity scores?",
            a: "Yes! The tool features an interactive Match Metrics panel. It computes the exact similarity percentage based on common substrings relative to the total length, providing a quick assessment of how much the text has changed."
          }
        ]}
      />

    </div>
  );
}
