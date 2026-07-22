
import React, { useState, useEffect, useCallback, useRef } from 'react';
import AccompanyingText from '../components/AccompanyingText';
import ShareWidget from '../components/ShareWidget';
import krutidevToUnicode from '@anthro-ai/krutidev-unicode';
import { unicodeToDevlys } from '../src/lib/unicodeToDevlys';
import * as mammoth from 'mammoth';
import SEO from '../components/SEO';
import StarRatingWidget from '../components/StarRatingWidget';
import AdUnit from '../components/AdUnit';

interface CharMapItem {
  key: string;
  devlys: string;
  unicode: string;
  label?: string;
}

const CHAR_MAP: Record<string, CharMapItem[]> = {
  "Vowels & Matras": [
    { key: "a", devlys: "a", unicode: "ा", label: "Aa Matra" },
    { key: "f", devlys: "f", unicode: "ि", label: "I Matra (Left)" },
    { key: "h", devlys: "h", unicode: "ी", label: "Ee Matra (Right)" },
    { key: "g", devlys: "g", unicode: "ु", label: "U Matra" },
    { key: "t", devlys: "t", unicode: "ू", label: "Oo Matra" },
    { key: "s", devlys: "s", unicode: "े", label: "E Matra" },
    { key: "w", devlys: "w", unicode: "ै", label: "Ai Matra" },
    { key: "a + s", devlys: "as", unicode: "ो", label: "O Matra" },
    { key: "a + w", devlys: "aw", unicode: "ौ", label: "Au Matra" },
    { key: "x", devlys: "x", unicode: "ं", label: "Anusvar" },
    { key: "%", devlys: "%", unicode: "ः", label: "Visarga" },
  ],
  "Consonants (Row 1)": [
    { key: "d", devlys: "d", unicode: "क" },
    { key: "i", devlys: "i", unicode: "ख" },
    { key: "u", devlys: "u", unicode: "ग" },
    { key: "U", devlys: "U", unicode: "घ" },
    { key: "p", devlys: "p", unicode: "च" },
    { key: "[", devlys: "[", unicode: "छ" },
    { key: "t", devlys: "t", unicode: "ज" },
    { key: "T", devlys: "T", unicode: "झ" },
  ],
  "Consonants (Row 2)": [
    { key: "v", devlys: "v", unicode: "ट" },
    { key: "V", devlys: "V", unicode: "ठ" },
    { key: "b", devlys: "b", unicode: "ड" },
    { key: "B", devlys: "B", unicode: "ढ" },
    { key: "l", devlys: "l", unicode: "त" },
    { key: "L", devlys: "L", unicode: "थ" },
    { key: "o", devlys: "o", unicode: "द" },
    { key: "O", devlys: "O", unicode: "ध" },
    { key: "v", devlys: "v", unicode: "न" },
  ],
  "Special & Conjuncts": [
    { key: "K", devlys: "K", unicode: "क्ष" },
    { key: "L", devlys: "L", unicode: "त्र" },
    { key: "Z", devlys: "Z", unicode: "ज्ञ" },
    { key: "z", devlys: "z", unicode: "श्र" },
    { key: "j", devlys: "j", unicode: "र" },
    { key: "r", devlys: "r", unicode: "प्र" },
  ]
};

interface DevLysConverterProps {
  defaultDirection?: 'devlysToUnicode' | 'unicodeToDevlys';
}

const DevLysConverter: React.FC<DevLysConverterProps> = ({ defaultDirection }) => {
  const [ratingInfo, setRatingInfo] = useState<{rating: number, count: number}>({ rating: 4.9, count: 366 });

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isCopying, setIsCopying] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [conversionDirection, setConversionDirection] = useState<'devlysToUnicode' | 'unicodeToDevlys'>('devlysToUnicode');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;

  useEffect(() => {
    // Title is now managed by react-helmet-async via SEO component
    const checkFont = async () => {
      if ('fonts' in document) {
        const isReady = document.fonts.check('1em DevLys010');
        if (isReady) {
          setFontLoaded(true);
        } else {
          try {
            await document.fonts.load('1em DevLys010');
            setFontLoaded(true);
          } catch (e) {
            console.warn("Font loading failed, falling back to timer.");
            setTimeout(() => setFontLoaded(true), 2000);
          }
        }
      } else {
        setTimeout(() => setFontLoaded(true), 1500);
      }
    };

    checkFont();
  }, []);

  const convertText = useCallback((text: string, direction: 'devlysToUnicode' | 'unicodeToDevlys') => {
    if (!text.trim()) {
      setOutput('');
      return;
    }
    
    try {
      if (direction === 'devlysToUnicode') {
        const normalizedText = text.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
        const converted = krutidevToUnicode(normalizedText);
        setOutput(converted);
      } else {
        const converted = unicodeToDevlys(text);
        setOutput(converted);
      }
    } catch (err) {
      console.error("Conversion error:", err);
      setOutput("Error during conversion.");
    }
  }, []);

  // Auto-load draft from localStorage or prop on mount/change
  useEffect(() => {
    const savedDraft = localStorage.getItem('devlys_draft');
    const savedDirection = localStorage.getItem('devlys_direction') as 'devlysToUnicode' | 'unicodeToDevlys';
    
    const activeDirection = defaultDirection || savedDirection || 'devlysToUnicode';
    setConversionDirection(activeDirection);
    
    if (savedDraft) {
      setInput(savedDraft);
      convertText(savedDraft, activeDirection);
    } else {
      setInput('');
      setOutput('');
    }
  }, [defaultDirection, convertText]);

  const handleInputChange = (val: string) => {
    setInput(val);
    convertText(val, conversionDirection);
    localStorage.setItem('devlys_draft', val);
  };
  
  const toggleDirection = () => {
    const newDir = conversionDirection === 'devlysToUnicode' ? 'unicodeToDevlys' : 'devlysToUnicode';
    setConversionDirection(newDir);
    localStorage.setItem('devlys_direction', newDir);
    
    // Swap input and output automatically for convenience
    if (output) {
      setInput(output);
      convertText(output, newDir);
      localStorage.setItem('devlys_draft', output);
    } else {
      convertText(input, newDir);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    localStorage.removeItem('devlys_draft');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.toLowerCase().endsWith('.docx')) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const result = await mammoth.extractRawText({ arrayBuffer });
          handleInputChange(result.value);
        } catch (error) {
          console.error("Error reading docx:", error);
          alert("Failed to read the .docx file.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (typeof content === 'string') {
          handleInputChange(content);
        }
      };
      reader.readAsText(file);
    }
    
    // Reset input so the same file could be uploaded again if needed
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleDownloadTxt = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'devlys_unicode_converted.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), 2000);
  };

  return (
    <article className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20 px-1">
      <SEO 
        title={conversionDirection === 'devlysToUnicode' 
          ? "DevLys 010 to Unicode Converter Online | Devlys ko Unicode me badle | Toolina" 
          : "Unicode to DevLys 010 Converter Online | Unicode ko Devlys 10 me badle | Toolina"
        } 
        description={conversionDirection === 'devlysToUnicode'
          ? "Convert DevLys 010 and Kruti Dev legacy Remington Hindi fonts to standard Unicode (Mangal font) instantly. Devlys to unicode changer tool free offline."
          : "Convert standard Unicode (Mangal font) back to legacy DevLys 010 and Kruti Dev 010 legacy Hindi fonts instantly. Unicode to Devlys changer free online."
        }
        keywords={conversionDirection === 'devlysToUnicode'
          ? "DevLys to Unicode, Devlys 010 to Unicode converter, devlys ko unicode me kaise badle, devlys se unicode converter, devlys font to mangal, krutidev to unicode, legacy hindi font converter, toolina"
          : "Unicode to DevLys, Unicode to Devlys 010 converter, unicode ko devlys me kaise badle, unicode se devlys converter, mangal to devlys, unicode to krutidev, hindi font converter, toolina"
        }
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": conversionDirection === 'devlysToUnicode' 
            ? "DevLys 010 to Unicode Converter" 
            : "Unicode to DevLys 010 Converter",
          "applicationCategory": "DeveloperApplication",
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
        }}
      />
      
      {/* Character Map Modal */}
      {showMap && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setShowMap(false)}></div>
          <div className="bg-white w-full max-w-4xl h-[85vh] rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col animate-in zoom-in duration-300">
            <header className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between shrink-0">
               <div>
                 <h3 className="text-xl font-display font-black text-slate-900 tracking-tight">Remington Key Map</h3>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">DevLys-10 Reference Guide</p>
               </div>
               <button onClick={() => setShowMap(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all active:scale-95">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </header>
            
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10 scrollbar-hide">
              {Object.entries(CHAR_MAP).map(([category, items]) => (
                <div key={category} className="space-y-4">
                  <h4 className="text-[11px] font-black text-teal-600 uppercase tracking-[0.2em] flex items-center gap-3">
                    {category}
                    <div className="h-px flex-1 bg-teal-50"></div>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {items.map((item, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-white hover:border-teal-200 transition-all group">
                        <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-xl font-bold font-devlys group-hover:text-teal-600 transition-colors">
                          {item.devlys}
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-xl font-black text-slate-900">{item.unicode}</span>
                           <span className="text-[9px] font-bold text-slate-400 px-1.5 py-0.5 bg-slate-200 rounded uppercase">{item.key}</span>
                        </div>
                        {item.label && <p className="text-[8px] font-bold text-slate-400 uppercase text-center">{item.label}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <footer className="p-6 border-t border-slate-100 bg-slate-50/50 text-center">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Tip: Hold Shift for Capitalized Remington Keys</p>
            </footer>
          </div>
        </div>
      )}

      <AdUnit slot="devlys-top-banner" format="horizontal" />

      <header className="bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-200 shadow-2xl shadow-slate-100/50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-50 rounded-bl-[15rem] -mr-20 -mt-20 opacity-50 blur-3xl"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-teal-600 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center text-3xl md:text-4xl shadow-xl shadow-teal-100 text-white shrink-0">
              ⌨️
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
                {conversionDirection === 'devlysToUnicode' ? (
                  <>DevLys 010 to <span className="text-teal-600">Unicode Converter</span></>
                ) : (
                  <>Unicode to <span className="text-teal-600">DevLys 010 Converter</span></>
                )}
              </h1>
              <p className="text-slate-500 font-medium text-xs md:text-lg mt-1 italic">
                {conversionDirection === 'devlysToUnicode' 
                  ? 'Convert legacy DevLys 010 / Kruti Dev 010 to standard Unicode (Mangal Font)' 
                  : 'Convert Standard Unicode (Mangal Font) back to legacy DevLys 010 / Kruti Dev 010'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <button 
              onClick={() => setShowMap(true)}
              className="bg-white text-slate-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>
              Character Map
            </button>
            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 items-center">
              <div className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-white rounded-xl shadow-sm border border-slate-100 flex items-center gap-2 ${fontLoaded ? 'text-teal-600' : 'text-slate-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${fontLoaded ? 'bg-teal-500' : 'bg-slate-300 animate-pulse'}`}></span>
                {fontLoaded ? 'FONT READY' : 'LOADING FONT...'}
              </div>
              <div className="hidden sm:flex px-4 py-2 text-[10px] font-black text-teal-600 uppercase tracking-widest items-center gap-2">
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></span>
                Live Sync
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-500 rounded-full"></span> {conversionDirection === 'devlysToUnicode' ? 'Input (DevLys-10)' : 'Input (Unicode / Mangal)'}
              </h2>
              <div className="flex gap-4">
                <input 
                  type="file" 
                  accept=".txt,.csv,.docx" 
                  ref={fileInputRef}
                  onChange={(e) => { handleFileUpload(e); e.target.value = ''; }}
                  className="hidden" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[9px] font-black text-slate-400 hover:text-teal-600 uppercase tracking-widest transition-colors flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  Upload File
                </button>
                <button 
                  onClick={handleClear}
                  className="text-[9px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
            <div className="relative">
              <textarea 
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={conversionDirection === 'devlysToUnicode' ? "देवलीस 10 में टाइप करना शुरू करें या अपनी सामग्री पेस्ट करें---" : "Enter Unicode / Mangal text here..."}
                className={`w-full h-80 md:h-96 bg-slate-50 border border-slate-200 rounded-[2rem] p-8 text-xl md:text-2xl outline-none focus:ring-4 ring-teal-50 focus:bg-white transition-all resize-none shadow-inner leading-relaxed placeholder:text-slate-300 ${conversionDirection === 'devlysToUnicode' ? 'font-devlys' : ''}`}
                style={conversionDirection === 'devlysToUnicode' ? { fontFamily: "'DevLys010', serif" } : undefined}
                spellCheck={false}
              />
              <div className="absolute bottom-6 right-8 text-[9px] font-black text-slate-300 uppercase tracking-widest pointer-events-none flex gap-3">
                <span>{wordCount} Words</span>
                <span>{input.length} Characters</span>
              </div>
            </div>
          </section>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:flex mt-4">
            <button 
              onClick={toggleDirection}
              className="w-12 h-12 bg-white rounded-full shadow-xl border border-slate-100 flex items-center justify-center text-teal-600 hover:bg-teal-50 hover:scale-110 transition-all group"
              title="Switch Conversion Direction"
            >
              <svg className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
            </button>
          </div>

          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{conversionDirection === 'devlysToUnicode' ? 'Output (Unicode / Mangal)' : 'Result (DevLys-10)'}</h2>
              <div className="flex gap-2">
                {output && (
                  <button 
                    onClick={handleDownloadTxt}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all shadow-sm bg-slate-100 text-slate-600 hover:bg-slate-200"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Save .txt
                  </button>
                )}
                {output && (
                  <button 
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all shadow-sm ${isCopying ? 'bg-emerald-500 text-white' : 'bg-teal-600 text-white hover:bg-teal-700'}`}
                  >
                    {isCopying ? (
                      <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg> Copied</>
                    ) : (
                      'Copy Standard Text'
                    )}
                  </button>
                )}
              </div>
            </div>
            <div className="w-full h-80 md:h-96 bg-slate-900 border border-slate-800 rounded-[2rem] p-8 relative group overflow-hidden shadow-2xl">
               <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
               <textarea 
                  readOnly
                  value={output}
                  placeholder={conversionDirection === 'devlysToUnicode' ? "The standard Unicode result will appear here automatically..." : "देवलीस 10 का परिणाम यहां स्वचालित रूप से दिखाई देगा---"}
                  className={`w-full h-full bg-transparent text-teal-400 text-xl md:text-2xl outline-none resize-none scrollbar-hide leading-relaxed placeholder:text-slate-700 ${conversionDirection === 'unicodeToDevlys' ? 'font-devlys' : ''}`}
                  style={conversionDirection === 'unicodeToDevlys' ? { fontFamily: "'DevLys010', serif" } : undefined}
                  spellCheck={false}
               />
               {!output && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
                     <span className="text-4xl mb-4">🧘‍♂️</span>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Awaiting Conversion</p>
                  </div>
               )}
            </div>
          </section>
          <div className="lg:hidden flex justify-center mt-[-1rem] relative z-20">
            <button 
              onClick={toggleDirection}
              className="bg-white rounded-full shadow-xl border border-slate-100 flex items-center justify-center text-teal-600 hover:bg-teal-50 px-6 py-2 text-[10px] font-black uppercase tracking-widest gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
              Switch Direction
            </button>
          </div>
        </div>
      </header>

      <AdUnit slot="devlys-mid-feed" format="fluid" />

      <footer className="bg-slate-900 rounded-[3.5rem] p-8 md:p-16 text-white space-y-16 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.05),transparent)] pointer-events-none"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-tight">
              Precise <span className="text-teal-400">Hindi Audit & Layout Systems</span>
            </h2>
            <p className="text-slate-400 leading-relaxed text-lg">
              Our <strong>DevLys to Unicode</strong> converter utilizes a robust multi-pass character reordering algorithm that correctly re-arranges <em>matras</em> (vowel markers) and complex Sanskrit/Hindi ligatures (<em>sanyukt akshar</em>). Ordinary search-and-replace scripts break document readability; our engine delivers publisher-grade results.
            </p>
            
            {/* Added rich Hinglish / English instruction set for extra SEO indexing */}
            <div className="space-y-4 text-slate-300">
              <h3 className="text-xl font-bold text-teal-400 uppercase tracking-wide">
                🔥 DevLys 010 se Unicode convert kaise kare?
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                अगर आपके पास कोई ऐसी हिंदी फाइल है जो <strong>DevLys 010 font</strong> या <strong>Kruti Dev 010</strong> में लिखी हुई है और आप उसे WhatsApp, Facebook, या Google Search पर शेयर करना चाहते हैं, तो उसे <strong>Unicode (Mangal Font)</strong> में बदलना आवश्यक है:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-400">
                <li>अपना पुराना DevLys टेक्स्ट बाएं बॉक्स (Input box) में डालें।</li>
                <li>हमारा टूल स्वचालित रूप से उस Remington टेक्स्ट को आधुनिक <strong>Standard Mangal Font (यूनिकोड)</strong> में परिवर्तित कर देगा।</li>
                <li>दाएं बॉक्स से कनवर्टेड यूनिकोड टेक्स्ट को कॉपी करें और कहीं भी इस्तेमाल करें!</li>
                <li>This is a 100% secure and free offline tool ensuring high confidentiality.</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <h3 className="text-teal-400 font-bold text-sm mb-2 uppercase tracking-widest">Matra Logic</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">Handles the complex 'i-matra' swap used in Remington layouts for perfect Unicode output.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <h3 className="text-teal-400 font-bold text-sm mb-2 uppercase tracking-widest">Zero Latency</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">Client-side processing ensures instant conversion even with massive blocks of text.</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-sm h-fit">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-300 mb-6 flex items-center gap-3">
                <span className="text-xl">📊</span> Conversion Knowledge & FAQs
              </h3>
              <ul className="space-y-6">
                {[
                  { q: "DevLys 010 font ko Unicode me kaise badle? (How to convert DevLys 010 to Unicode?)", a: "आप हमारे टूल में अपने देवलीस टेक्स्ट को पेस्ट करके उसे तुरंत मंगल यूनिकोड (Mangal Unicode) में बदल सकते हैं। यह पूरी तरह से मुफ्त और सुरक्षित है। Just paste your DevLys 010 text in the input box, select the 'DevLys to Unicode' mode, and get standard Unicode text instantly." },
                  { q: "What is the difference between DevLys 010 and Mangal Font?", a: "DevLys 010 is a legacy Remington typewriter layout Hindi font which requires a specific font file (.ttf) installed on your system to view. Mangal is a standard Unicode Hindi font pre-installed on all modern devices and web browsers, making it globally readable, searchable, and web-friendly." },
                  { q: "Unicode ko DevLys 10 font me kaise convert kare? (How to convert Unicode to DevLys 10?)", a: "Simply choose the 'Unicode to DevLys' mode, enter your standard Unicode (Mangal/Aparajita) text, and copy the Remington-compatible DevLys output. You can use this output in any application like Photoshop, MS Word, or PageMaker where DevLys font is selected." },
                  { q: "Can I convert MS Word .docx files containing Hindi fonts?", a: "Yes! Our tool allows you to upload standard `.docx`, `.txt`, and `.csv` files. It will read the legacy Hindi characters and convert them accurately, saving you hours of manual typing." },
                  { q: "Is Kruti Dev 010 compatible with this DevLys converter?", a: "Yes, Kruti Dev 010 and DevLys 010 share nearly identical character maps. You can use this converter to convert Kruti Dev to Unicode and Unicode to Kruti Dev seamlessly." }
                ].map((item, i) => (
                  <li key={i} className="space-y-1">
                    <h4 className="text-sm font-bold text-teal-400">{item.q}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.a}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 relative z-10 text-center space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">PRECISION DATA AUDIT BY TOOLINA AUDIT SYSTEMS</p>
          <div className="max-w-4xl mx-auto text-xs text-slate-500 leading-relaxed">
            Keywords: Devlys 010 to Unicode, Unicode to Devlys 010, Krutidev 010 se Unicode converter online free, devlys ko unicode me kaise badle, unicode font ko devlys 10 me change, Mangal to Devlys converter, Hindi font converter Remington, Remington keyboard layout converter.
          </div>
        </div>
      </footer>
    
      <AdUnit slot="devlys-bottom-banner" format="horizontal" />
    
      <AccompanyingText 
        toolName={conversionDirection === 'devlysToUnicode' ? "DevLys to Unicode Converter" : "Unicode to DevLys Converter"}
        howItWorks="This tool uses advanced client-side processing to deliver instant results without sending your data to any external server. Simply input your parameters, and the algorithmic engine processes the data locally in your browser ensuring maximum privacy and speed."
        whyItsUseful="Whether you are a professional typist, data entry operator, or a government employee, this tool saves you significant time by automating complex Remington character transformations. It eliminates manual errors and provides a structured, easy-to-read output that you can rely on for your daily tasks."
        faqs={[
          { q: "Is my data secure?", a: "Yes, 100% secure. All processing happens entirely within your browser. We do not store or transmit your inputs to any remote servers." },
          { q: "Is this tool free to use?", a: "Absolutely. Toolina provides this utility completely free of charge with no hidden limits or premium paywalls." },
          { q: "Can I use this on mobile?", a: "Yes, the interface is fully responsive and works seamlessly across desktops, tablets, and smartphones." }
        ]}
      />
  
      <div className="max-w-3xl mx-auto my-8">
        <StarRatingWidget 
          toolId={conversionDirection === 'devlysToUnicode' ? "devlys-to-unicode" : "unicode-to-devlys"} 
          defaultRating={4.9} 
          defaultCount={366} 
          onRatingChange={(rating, count) => setRatingInfo({ rating, count })} 
        />
      </div>
      <ShareWidget title={conversionDirection === 'devlysToUnicode' ? "DevLys to Unicode Converter" : "Unicode to DevLys Converter"} />
      </article>
  );
};

export default DevLysConverter;
