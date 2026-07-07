import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  FileText, 
  Trash2, 
  Copy, 
  Download, 
  Upload, 
  BookOpen, 
  TrendingUp, 
  Percent, 
  HelpCircle, 
  CheckCircle2, 
  Check, 
  RotateCcw,
  Sparkles,
  Award,
  Clock,
  Mic,
  Bookmark,
  ChevronDown,
  Search
} from 'lucide-react';
import StarRatingWidget from '../components/StarRatingWidget';
import SEO from '../components/SEO';

// English standard stop words for SEO Keyword Density Filter
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 
  'by', 'of', 'in', 'is', 'it', 'that', 'this', 'with', 'as', 'are', 'was', 
  'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'some', 
  'any', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 
  'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 
  'she', 'her', 'hers', 'herself', 'its', 'themselves', 'what', 'which', 'who', 
  'whom', 'these', 'those', 'am', 'being', 'they', 'them', 'their', 'theirs', 
  'how', 'why', 'where', 'when', 'all', 'any', 'both', 'each', 'few', 'more', 
  'most', 'other', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 
  'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'
]);

const PRESETS = [
  {
    name: 'SEO Blog Draft',
    description: 'Optimize a standard marketing blog outline.',
    text: `As search engine optimization (SEO) continues to evolve, high-quality, long-form content remains the absolute standard for generating organic traffic. Creating content that ranks involves careful targeting of relevant keywords, understanding user search intent, and structuring your page for premium readibility.\n\nOptimizing your blog posts helps search crawlers identify your central topic while giving your target audience an informative, delightful reading experience. Keep key parameters in mind: meta titles should stay within 60 characters, descriptions must not exceed 160 characters, and target posts should exceed 1,000 words to establish high topical authority in 2026. Avoid harmful spam tactics like keyword stuffing, which search engines easily penalize.`
  },
  {
    name: 'Academic Abstract',
    description: 'Check academic publication format tolerances.',
    text: `This paper presents an empirical analysis of microservice-based web application architectures deployed across containerized cloud execution environments. We explore resource isolation, latency distributions under varied concurrent request configurations, and cold-start characteristics of serverless endpoints. Our experiments indicate a 24% overhead in inter-service routing latency when tracing protocols are active, though custom load-balancing policies mitigate these performance regressions under high stress workloads.`
  },
  {
    name: 'Google Ad Copy',
    description: 'Short headline & description compliance test.',
    text: `Headline: Premium SEO Tools & Builders\nDescription: Unlock organic rankings in minutes. Deploy secure, browser-native developer utilities instantly with zero setup or limits.`
  }
];

const TARGETS = [
  { id: 'none', label: 'No Target Limit', type: 'none', min: 0, max: Infinity },
  { id: 'meta-title', label: 'Meta Title (max 60 chars)', type: 'chars', min: 30, max: 60 },
  { id: 'meta-desc', label: 'Meta Description (max 160 chars)', type: 'chars', min: 110, max: 160 },
  { id: 'tweet', label: 'X / Twitter Tweet (max 280 chars)', type: 'chars', min: 1, max: 280 },
  { id: 'short-blog', label: 'Short Blog Post (500+ words)', type: 'words', min: 500, max: 800 },
  { id: 'long-blog', label: 'SEO Pillar Article (2000+ words)', type: 'words', min: 2000, max: 3500 },
];

export default function WordCounter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTarget, setActiveTarget] = useState('none');
  const [showStopWords, setShowStopWords] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stats calculation
  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return {
        words: 0,
        charsWithSpaces: 0,
        charsWithoutSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        avgWordLength: 0,
        readingTime: 0,
        speakingTime: 0
      };
    }

    // Characters
    const charsWithSpaces = text.length;
    const charsWithoutSpaces = text.replace(/\s/g, '').length;

    // Words - split by spaces & filter punctuation
    const wordsArray = trimmed.split(/\s+/).filter(w => w.length > 0);
    const words = wordsArray.length;

    // Sentences - split by . ! ?
    const sentenceMatches = text.match(/[^.!?]+[.!?]+/g) || [];
    const sentences = sentenceMatches.length || (trimmed ? 1 : 0);

    // Paragraphs - split by double or single newlines containing content
    const paragraphsArray = text.split(/\n+/).filter(p => p.trim().length > 0);
    const paragraphs = paragraphsArray.length;

    // Average word length
    const totalWordLength = wordsArray.reduce((acc, word) => acc + word.replace(/[^a-zA-Z]/g, '').length, 0);
    const avgWordLength = words > 0 ? parseFloat((totalWordLength / words).toFixed(1)) : 0;

    // Speeds: reading time ~225 WPM, speaking time ~150 WPM
    const readingTime = Math.ceil(words / 225);
    const speakingTime = Math.ceil(words / 150);

    return {
      words,
      charsWithSpaces,
      charsWithoutSpaces,
      sentences,
      paragraphs,
      avgWordLength,
      readingTime,
      speakingTime
    };
  }, [text]);

  // Readability indexes
  const readability = useMemo(() => {
    const { words, sentences, charsWithSpaces } = stats;
    if (words < 5 || sentences === 0) {
      return {
        fleschEase: 100,
        fleschDescription: 'Very Easy (4th grade/children)',
        fleschColor: 'text-emerald-500 bg-emerald-50',
        ari: 1,
        ariGrade: 'Kindegarten / Standard 1',
        ariColor: 'text-emerald-500 bg-emerald-50'
      };
    }

    // Helper: count syllables
    const countSyllablesInWord = (word: string): number => {
      word = word.toLowerCase().replace(/[^a-z]/g, '');
      if (word.length <= 3) return 1;
      word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
      word = word.replace(/^y/, '');
      const vowels = word.match(/[aeiouy]{1,2}/g);
      return vowels ? vowels.length : 1;
    };

    // Calculate syllables
    const cleanWords = text.trim().split(/\s+/).map(w => w.replace(/[^a-zA-Z]/g, '')).filter(w => w.length > 0);
    const totalSyllables = cleanWords.reduce((acc, w) => acc + countSyllablesInWord(w), 0);

    // Flesch Reading Ease
    let fleschEase = 206.835 - 1.015 * (words / sentences) - 84.6 * (totalSyllables / words);
    fleschEase = parseFloat(Math.max(0, Math.min(100, fleschEase)).toFixed(1));

    let fleschDescription = 'Extremely Difficult (Graduate level)';
    let fleschColor = 'text-rose-600 bg-rose-50 border-rose-100';

    if (fleschEase >= 90) {
      fleschDescription = 'Very Easy (5th Grade level)';
      fleschColor = 'text-emerald-600 bg-emerald-50 border-emerald-100';
    } else if (fleschEase >= 80) {
      fleschDescription = 'Easy (6th Grade level)';
      fleschColor = 'text-teal-600 bg-teal-50 border-teal-100';
    } else if (fleschEase >= 70) {
      fleschDescription = 'Fairly Easy (7th Grade conversion)';
      fleschColor = 'text-cyan-600 bg-cyan-50 border-cyan-100';
    } else if (fleschEase >= 60) {
      fleschDescription = 'Standard/Plain English (8th-9th Grade)';
      fleschColor = 'text-sky-600 bg-sky-50 border-sky-100';
    } else if (fleschEase >= 50) {
      fleschDescription = 'Fairly Difficult (High School level)';
      fleschColor = 'text-indigo-600 bg-indigo-50 border-indigo-100';
    } else if (fleschEase >= 30) {
      fleschDescription = 'Difficult (College level)';
      fleschColor = 'text-orange-600 bg-orange-50 border-orange-100';
    }

    // Automated Readability Index (ARI)
    let ari = 4.71 * (charsWithSpaces / words) + 0.5 * (words / sentences) - 21.43;
    ari = parseFloat(Math.max(1, ari).toFixed(1));

    let ariGrade = 'Professional / Scientific Journals';
    let ariColor = 'text-rose-600 bg-rose-50 border-rose-100';

    const roundedAri = Math.min(14, Math.round(ari));
    const grades = [
      '',
      'Kindergarten (Age 5-6)',
      'First Grade (Age 6-7)',
      'Second Grade (Age 7-8)',
      'Third Grade (Age 8-9)',
      'Fourth Grade (Age 9-10)',
      'Fifth Grade (Age 10-11)',
      'Sixth Grade (Age 11-12)',
      'Seventh Grade (Age 12-13)',
      'Eighth Grade (Age 13-14)',
      'Ninth Grade (Age 14-15)',
      'Tenth Grade (Age 15-16)',
      'Eleventh Grade (Age 16-17)',
      'Twelfth Grade (Age 17-18)',
      'College / Post-graduate (Age 18+)'
    ];
    if (roundedAri < grades.length) {
      ariGrade = grades[roundedAri];
      if (roundedAri <= 5) ariColor = 'text-emerald-600 bg-emerald-50 border-emerald-100';
      else if (roundedAri <= 9) ariColor = 'text-cyan-600 bg-cyan-50 border-cyan-100';
      else ariColor = 'text-orange-600 bg-orange-50 border-orange-100';
    }

    return {
      fleschEase,
      fleschDescription,
      fleschColor,
      ari,
      ariGrade,
      ariColor
    };
  }, [text, stats]);

  // Keyword Density Reports (Unigrams and Bigrams)
  const keywordDensity = useMemo(() => {
    const cleanText = text.toLowerCase()
      .replace(/[^\w\s']/g, ' ') // replace punctuation with spaces
      .replace(/\s+/g, ' ')      // compress whitespace
      .trim();

    if (!cleanText) return [];

    const rawWords = cleanText.split(' ').filter(w => w.length > 1);
    const totalValidWords = rawWords.length;

    if (totalValidWords === 0) return [];

    // Filter list
    const filteredWords = showStopWords ? rawWords : rawWords.filter(w => !STOP_WORDS.has(w));

    // Calculate unigram counts
    const counts: Record<string, number> = {};
    filteredWords.forEach(word => {
      counts[word] = (counts[word] || 0) + 1;
    });

    // Calculate bigram counts (sequential pairs)
    const bigramCounts: Record<string, number> = {};
    for (let i = 0; i < rawWords.length - 1; i++) {
      const w1 = rawWords[i];
      const w2 = rawWords[i + 1];
      // Skip if either contains a stop word (when stop words are toggled off)
      if (!showStopWords && (STOP_WORDS.has(w1) || STOP_WORDS.has(w2))) continue;
      const bigram = `${w1} ${w2}`;
      bigramCounts[bigram] = (bigramCounts[bigram] || 0) + 1;
    };

    // Construct unigram objects
    const list = Object.entries(counts).map(([word, freq]) => ({
      keyword: word,
      count: freq,
      type: 'Single Word',
      density: parseFloat(((freq / totalValidWords) * 100).toFixed(1))
    }));

    // Add bigram objects limit threshold >= 2 occurrences to keep it relevant
    const bigramList = Object.entries(bigramCounts)
      .filter(([_, freq]) => freq >= 2)
      .map(([phrase, freq]) => ({
        keyword: phrase,
        count: freq,
        type: 'Two Words Phrase',
        density: parseFloat(((freq / totalValidWords) * 100).toFixed(1))
      }));

    // Combine & Sort descending
    const merged = [...list, ...bigramList].sort((a, b) => b.count - a.count);

    // Apply Search Filter
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      return merged.filter(item => item.keyword.includes(lowerSearch));
    }

    return merged.slice(0, 30); // show top 30 density leaders
  }, [text, showStopWords, searchTerm]);

  // Target limit calculation info
  const targetInfo = useMemo(() => {
    const selected = TARGETS.find(t => t.id === activeTarget);
    if (!selected || selected.id === 'none') return null;

    const currentCount = selected.type === 'chars' ? stats.charsWithSpaces : stats.words;
    const progress = Math.min(100, Math.floor((currentCount / selected.max) * 100)) || 0;
    const isExceeded = currentCount > selected.max;
    const isUnderMin = currentCount < selected.min;

    let statusText = 'Optimal Length Range';
    let labelBg = 'bg-emerald-50 text-emerald-800 border-emerald-100';

    if (isExceeded) {
      statusText = `Exceeded Target Limit (by ${currentCount - selected.max} ${selected.type})`;
      labelBg = 'bg-rose-50 text-rose-800 border-rose-105';
    } else if (isUnderMin) {
      statusText = `Building Content (Needs ${selected.min - currentCount} more ${selected.type} to hit minimum guidelines)`;
      labelBg = 'bg-amber-50 text-amber-800 border-amber-105';
    }

    return {
      label: selected.label,
      current: currentCount,
      min: selected.min,
      max: selected.max,
      progress,
      statusText,
      labelBg,
      isExceeded,
      isUnderMin
    };
  }, [activeTarget, stats]);

  // Copy Content to clipboard
  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Preset loading
  const loadPreset = (presetText: string) => {
    setText(presetText);
  };

  // Open and Read physical file (txt, md, rtf, html, csv)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContents = event.target?.result;
      if (typeof fileContents === 'string') {
        setText(fileContents);
      }
    };
    reader.readAsText(file);
  };

  // Download analyzed text as a clean .txt file
  const handleDownload = () => {
    if (!text) return;
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = "toolina-wordcounter-output.txt";
    document.body.appendChild(element);
    element.click();
    this?.window?.URL?.revokeObjectURL(element.href);
  };

  // Cases and formatting handlers
  const handleCaseTransform = (type: 'upper' | 'lower' | 'title' | 'sentence' | 'clean' | 'slug') => {
    if (!text) return;
    let transformed = text;

    if (type === 'upper') {
      transformed = text.toUpperCase();
    } else if (type === 'lower') {
      transformed = text.toLowerCase();
    } else if (type === 'title') {
      transformed = text.replace(/\b\w/g, c => c.toUpperCase());
    } else if (type === 'sentence') {
      transformed = text.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, m => m.toUpperCase());
    } else if (type === 'clean') {
      // Remove double spaces, correct loose punctuation spacing
      transformed = text.replace(/\s+/g, ' ').replace(/\s+([.,!?;:])/g, '$1').trim();
    } else if (type === 'slug') {
      transformed = text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }

    setText(transformed);
  };

  return (
    <article className="space-y-12 max-w-7xl mx-auto px-1">
      {/* Dynamic SEO Injector */}
      <SEO 
        title="Word Counter - Real-Time Word & Character Analyzer Tool"
        description="Comprehensive offline-ready Word & Character Counter. Compute writing density indices, analyze advanced SEO keywords, and audit Flesch Readability grades easily."
        keywords="word counter, character counter, readability index, SEO keyword density, writing tools, text optimization, sentence tracker"
      />

      {/* Primary Header Hero Grid */}
      <header className="relative bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-14 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[90px] pointer-events-none"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <span className="bg-teal-500/20 text-teal-400 text-[10px] font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full border border-teal-500/30">
                SEO optimized Suite
              </span>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-3 py-1.5 rounded-full">
                ⚡ 100% Client-Side
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-tight">
              Professional Real-Time <br />
              <span className="text-teal-400">Word &amp; Character</span> Counter
            </h1>
            
            <p className="text-slate-350 text-sm md:text-base max-w-xl leading-relaxed font-sans">
              Auditing long blogs or meta boundaries? Input your drafts below to automatically track reading intervals, calculate exact syllable scores, verify search guidelines compliance, and filter keyword stuffing penalties dynamically.
            </p>

            {/* Quick Presets Selection */}
            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-bold text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-teal-400 animate-pulse" />
                Want to test out our engine? Select a pre-formatted blueprint:
              </h4>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => loadPreset(preset.text)}
                    className="cursor-pointer text-xs bg-white/10 hover:bg-white/15 border border-white/10 px-4 py-2 rounded-xl transition-all font-semibold hover:translate-y-[-1px] text-slate-205 flex flex-col items-start gap-0.5"
                  >
                    <span>{preset.name}</span>
                    <span className="text-[10px] text-slate-405 font-medium">{preset.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-between">
              <span className="text-slate-400 text-xs font-bold">Total Words</span>
              <span className="text-4xl md:text-5xl font-black text-teal-400 tracking-tight font-mono my-2">{stats.words}</span>
              <span className="text-[10px] text-slate-500">Perfect for targeted blogs &amp; essays</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-between">
              <span className="text-slate-400 text-xs font-bold">Characters</span>
              <span className="text-4xl md:text-5xl font-black text-emerald-400 tracking-tight font-mono my-2">{stats.charsWithSpaces}</span>
              <span className="text-[10px] text-slate-500">Includes white spaces and symbols</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Interactive Studio Screen */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Hand: Input Console & Case formatting */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-xl overflow-hidden">
            {/* Action Bar Header */}
            <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-teal-600" />
                <span className="text-xs font-black uppercase text-slate-700 tracking-wider">Live Compilation Console</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                {/* File Upload Selector */}
                <input
                  type="file"
                  id="text-file-import"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".txt,.md,.rtf,.html,.csv,.json"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-350 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                  title="Upload plain text or markdown"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload Text File
                </button>

                {/* Clear Button */}
                <button
                  type="button"
                  onClick={() => setText('')}
                  className="cursor-pointer bg-rose-50 text-rose-700 hover:bg-rose-100 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-rose-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Reset Canvas
                </button>
              </div>
            </div>

            {/* Input Text Area Element */}
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Start typing or paste your content draft here... (Your files are handled completely offline inside your browser for 100% absolute privacy)"
                className="w-full h-96 p-6 font-sans text-sm md:text-base text-slate-800 leading-relaxed focus:outline-none focus:ring-0 placeholder:text-slate-400 border-0 resize-none"
                id="word_counter_editor"
              />
              
              {/* Target guidelines indicator overlay */}
              {targetInfo && (
                <div className={`m-4 p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${targetInfo.labelBg}`}>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider block">Target: {targetInfo.label}</span>
                    <span className="text-xs font-bold leading-none">{targetInfo.statusText}</span>
                  </div>
                  <div className="w-full md:w-36 space-y-1">
                    <div className="h-2 w-full bg-slate-200/50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-350 ${
                          targetInfo.isExceeded ? 'bg-rose-500' : targetInfo.isUnderMin ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${targetInfo.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] opacity-75 font-mono">
                      <span>{targetInfo.current} units</span>
                      <span>{targetInfo.max} max</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Controls panel: Cases transformers & Quick triggers */}
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quick Text Transformations:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'upper', label: 'UPPERCASE' },
                  { id: 'lower', label: 'lowercase' },
                  { id: 'title', label: 'Title Case' },
                  { id: 'sentence', label: 'Sentence case' },
                  { id: 'slug', label: 'SEO-Slugify-String' },
                  { id: 'clean', label: 'Remove Extras/Spaces' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleCaseTransform(item.id as any)}
                    className="cursor-pointer bg-white text-slate-700 hover:text-teal-600 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Footer Actions */}
            <div className="bg-slate-100 border-t border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                Draft automatically optimized in memory. Safe from indexing.
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!text}
                  className={`cursor-pointer px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    !text 
                      ? 'bg-slate-200 text-slate-400' 
                      : copied 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-900 hover:bg-slate-805 text-white shadow-md'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied to Clipboard!' : 'Copy Entire Text'}
                </button>

                <button
                  onClick={handleDownload}
                  disabled={!text}
                  className={`cursor-pointer px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                    !text 
                      ? 'bg-slate-100 text-slate-300 border-slate-200' 
                      : 'bg-white text-slate-700 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  Save as .txt
                </button>
              </div>
            </div>
          </div>

          {/* Preset Targets Grid */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 md:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Bookmark className="w-5 h-5 text-teal-600" />
              <div>
                <h3 className="text-base font-black text-slate-900 text-left">Compliance Target Goal Setting</h3>
                <p className="text-xs text-slate-500">Lock onto standard SEO and social limits to ensure visual progress feedback as you type.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {TARGETS.map((target) => (
                <button
                  key={target.id}
                  onClick={() => setActiveTarget(target.id)}
                  className={`cursor-pointer p-3.5 rounded-2xl border text-left transition-all ${
                    activeTarget === target.id
                      ? 'bg-teal-50 border-teal-300 text-teal-900 font-bold scale-102 shadow-sm'
                      : 'bg-slate-50/50 hover:bg-slate-50 border-slate-200 text-slate-650'
                  }`}
                >
                  <span className="text-xs font-black block mb-1">{target.label}</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {target.id === 'none' ? 'No restrictions' : `Limit: ${target.min}-${target.max}`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Hand: Advanced Statistics, SEO reports, Readability metrics */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Detailed statistics side widget */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 md:p-8 space-y-6 shadow-md">
            <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
              <Award className="w-4.5 h-4.5 text-teal-600" />
              Extended Text Metrics
            </h3>
            
            <div className="divide-y divide-slate-100">
              <div className="py-3 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Chars (without space):</span>
                <span className="font-mono font-bold text-slate-800">{stats.charsWithoutSpaces}</span>
              </div>
              <div className="py-3 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Character spacing:</span>
                <span className="font-mono font-bold text-slate-800">{stats.charsWithSpaces - stats.charsWithoutSpaces}</span>
              </div>
              <div className="py-3 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Total Sentences:</span>
                <span className="font-mono font-bold text-slate-800">{stats.sentences}</span>
              </div>
              <div className="py-3 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Total Paragraphs:</span>
                <span className="font-mono font-bold text-slate-800">{stats.paragraphs}</span>
              </div>
              <div className="py-3 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Average Word Length:</span>
                <span className="font-mono font-bold text-slate-800">{stats.avgWordLength} chars/word</span>
              </div>
              <div className="py-3 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Est. Silent Reading Time:
                </span>
                <span className="font-bold text-teal-600">{stats.readingTime} {stats.readingTime === 1 ? 'min' : 'mins'}</span>
              </div>
              <div className="py-3 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-slate-400" />
                  Est. Audio Speaking Time:
                </span>
                <span className="font-bold text-emerald-600">{stats.speakingTime} {stats.speakingTime === 1 ? 'min' : 'mins'}</span>
              </div>
            </div>
          </div>

          {/* Readability grades */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 md:p-8 space-y-6 shadow-md">
            <div>
              <h3 className="text-sm font-black uppercase text-slate-405 tracking-wider mb-1 flex items-center gap-2">
                <BookOpen className="w-4.5 h-4.5 text-teal-600" />
                Readability Indices
              </h3>
              <p className="text-[10px] text-slate-404">Matches international education assessment standards.</p>
            </div>

            <div className="space-y-4">
              {/* Flesch Reading Ease */}
              <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-slate-700">Flesch Reading Ease</span>
                  <span className="text-xs font-mono font-black text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    {readability.fleschEase} / 100
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-500 rounded-full" 
                    style={{ width: `${readability.fleschEase}%` }}
                  ></div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md inline-block ${readability.fleschColor}`}>
                  {readability.fleschDescription}
                </span>
              </div>

              {/* Automated Readability Index */}
              <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-slate-700">Automated Index (ARI)</span>
                  <span className="text-xs font-mono font-black text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    Grade {Math.min(14, Math.round(readability.ari))}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${Math.min(100, (readability.ari / 14) * 100)}%` }}
                  ></div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md inline-block ${readability.ariColor}`}>
                  Target Audience: {readability.ariGrade}
                </span>
              </div>
            </div>
          </div>

          {/* SEO Keyword Density reporting and statistics */}
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 md:p-8 space-y-6 shadow-md">
            <div className="space-y-1">
              <h3 className="text-sm font-black uppercase text-slate-405 tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4.5 h-4.5 text-teal-600" />
                SEO SEO Keyword Density
              </h3>
              <p className="text-[10px] text-slate-404">Audit frequency prominence rates to prevent stuffed penalties.</p>
            </div>

            {/* Stop Words toggler and layout search */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-slate-505 font-medium">Filter Short Stop Words:</span>
                <button
                  type="button"
                  onClick={() => setShowStopWords(!showStopWords)}
                  className={`cursor-pointer px-3 py-1.5 rounded-xl text-2xs font-black uppercase tracking-wider transition-all border ${
                    !showStopWords 
                      ? 'bg-teal-50 border-teal-200 text-teal-800' 
                      : 'bg-slate-50 border-slate-200 text-slate-550'
                  }`}
                >
                  {!showStopWords ? 'ON (Hide Stopwords)' : 'OFF (Show AlI)'}
                </button>
              </div>

              {/* Keyword density search field */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter keywords table..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Density List Box */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {keywordDensity.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-slate-200 rounded-2xl text-xs text-slate-400 select-none">
                  Paste or write text above to calculate dynamic keyword densities instantly.
                </div>
              ) : (
                keywordDensity.map((item, idx) => (
                  <div key={idx} className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 flex flex-col gap-1 hover:bg-slate-50 transition-all">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-slate-805 select-all truncate max-w-[140px]" title={item.keyword}>
                        {item.keyword}
                      </span>
                      <div className="flex items-center gap-1.5 text-2xs">
                        <span className="bg-white border border-slate-150 text-slate-705 px-1.5 py-0.5 rounded-md font-mono">
                          x{item.count}
                        </span>
                        <span className="bg-teal-50 text-teal-800 font-bold px-1.5 py-0.5 rounded-md font-mono">
                          {item.density}%
                        </span>
                      </div>
                    </div>
                    {/* Linear mini progress indicator */}
                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-teal-500/85 rounded-full" 
                        style={{ width: `${Math.min(100, item.density * 10)}%` }}
                      ></div>
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono tracking-wide">{item.type}</span>
                  </div>
                ))
              )}
            </div>

            <div className="text-[10px] text-slate-400 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start gap-1.5">
              <Percent className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>Recommended density for target keywords is <strong>1.2% to 2.5%</strong>. Higher values may trigger search engine keyword indexing penalties.</span>
            </div>
          </div>

        </div>
      </section>

      {/* Structured SEO Academic FAQs Accordion Cards */}
      <section className="bg-white p-8 md:p-14 rounded-[2.5rem] border border-slate-200 shadow-xl space-y-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-slate-50 rounded-br-[8rem] opacity-75 pointer-events-none"></div>
        
        <div className="relative z-10 space-y-4">
          <span className="text-[10px] font-black uppercase text-teal-600 tracking-[0.3em] bg-teal-50 px-3 py-1.5 rounded-full inline-block">
            Writing Science &amp; Search Optimization Academy
          </span>
          <h2 className="text-2xl md:text-4xl font-display font-black text-slate-900 tracking-tight">
            SEO Content Guidelines <span className="text-slate-400">&amp;</span> Word Length Standards
          </h2>
          <p className="text-slate-500 text-sm md:text-base max-w-4xl leading-relaxed">
            Writing high-ranking content requires understanding metadata limitations and standard formatting rules. Expand the sections below to master search parameters.
          </p>
        </div>

        {/* FAQs list accordion */}
        <div className="relative z-10 divide-y divide-slate-100 max-w-5xl">
          {[
            {
              q: "What is the optimal word count for Google SEO rankings in 2026?",
              a: "While Google does not declare a strict minimum word length, statistical analysis demonstrates that top-ranking positions average between 1,200 and 1,800 words. Comprehensive content provides higher 'topical depth' and answers complex user search intent in a single visit, enhancing engagement metrics."
            },
            {
              q: "Why should my page title be kept under 60 characters?",
              a: "Google Search Console and search results limit title display width to 600 pixels (roughly 55-60 characters depending on letter spacing). Staying within this limit ensures searchers see your complete title without truncation markers (...), maximizing your click-through rates (CTR)."
            },
            {
              q: "How does the Flesch Reading Ease score impact ranking variables?",
              a: "Readability scores measure how easily a typical visitor can parse your message content. An optimal range is 60 to 70 (8th to 9th-grade language level). When copy is conversational, user dwell times increase, bounce rates plunge, and search algorithms recognize the page as an excellent, user-first resource."
            },
            {
              q: "What is 'Keyword Stuffing' and how can my team avoid it?",
              a: "Keyword stuffing is the practice of loading a page with excessive keyword phrases to manipulate search index targets. To maintain healthy levels, limit primary target density to 1.5% to 2.5% of total text. Use synonyms, descriptive headers, and semantic LSI keywords to satisfy modern natural language processing models."
            },
            {
              q: "Are the draft texts sent to external telemetry servers?",
              a: "Absolutely not. Our Word Counter operates entirely within your web browser using HTML5 Local Memory APIs. Your proprietary documents, drafts, customer reviews, and analytical figures are processed locally and never transmitted across external hosting APIs, keeping your data strictly confidential."
            }
          ].map((faq, idx) => (
            <div key={idx} className="py-4">
              <button
                onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                className="w-full text-left py-3 font-black text-slate-850 hover:text-teal-600 transition-colors flex justify-between items-center group cursor-pointer focus:outline-none"
              >
                <span className="text-sm md:text-base flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full group-hover:scale-130 transition-all"></span>
                  {faq.q}
                </span>
                <ChevronDown className={`w-4 h-4 shrink-0 text-slate-400 group-hover:text-teal-600 transition-transform duration-200 ${faqOpen === idx ? 'rotate-180' : ''}`} />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  faqOpen === idx ? 'max-h-60 opacity-100 mt-2 pb-2' : 'max-h-0 opacity-0 pointer-events-none'
                }`}
              >
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed pl-4 border-l border-teal-150">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand SEO Footer Wrap */}
      <footer className="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-white space-y-16 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.1),transparent)] pointer-events-none"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-2xl md:text-4xl font-display font-black tracking-tight leading-tight">
              Privacy-First <span className="text-teal-400">Offline-Ready</span> Content Optimization Suite
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              Toolina brings you browser-native analytical toolboxes built for publishers, content strategists, software developers, and copywriters globally. Save progress locally, check character count parameters offline, and analyze readability layouts without monthly paywalls or trackers.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                <span className="text-2xl">🔒</span>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-200">100% Sandbox Execution</h4>
                  <p className="text-[10px] text-slate-500">Your texts remain strictly compiled in browser window frames.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                <span className="text-2xl">⚡</span>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-200">Performance Scaled</h4>
                  <p className="text-[10px] text-slate-400">Processes heavy copy texts exceeding 100,000 words instantly.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-300 mb-6 flex items-center gap-2">
                <span className="text-xl">💡</span> Publishing Guidelines
              </h3>
              <ul className="space-y-4">
                {[
                  { text: "Optimal Blog Post", span: "1,200 to 1,800 Words" },
                  { text: "Title Character Limit", span: "Max 55-60 Characters" },
                  { text: "Meta Description Margin", span: "Max 150-160 Characters" },
                  { text: "Recommended Density Rate", span: "1.5% to 2.5% Density" },
                ].map((item, id) => (
                  <li key={id} className="flex justify-between items-center text-xs text-slate-400">
                    <span>{item.text}</span>
                    <span className="font-mono bg-white/10 px-2 py-0.5 rounded-md text-teal-400 font-bold">{item.span}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Dynamic Star Widget & Badge */}
        <div className="pt-12 border-t border-white/10 relative z-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-5">Optimized by Toolina Digital Labs</p>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-slate-400 font-bold font-sans">Help improve our layout:</span>
            <StarRatingWidget toolId="word-counter" defaultRating={4.9} defaultCount={312} />
          </div>
        </div>
      </footer>

    </article>
  );
}
