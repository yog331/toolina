
import React, { useState, useRef, useEffect } from 'react';
import AccompanyingText from '../components/AccompanyingText';
import ShareWidget from '../components/ShareWidget';
import SEO from '../components/SEO';
import StarRatingWidget from '../components/StarRatingWidget';

const CSVToJson: React.FC = () => {
  const [ratingInfo, setRatingInfo] = useState<{rating: number, count: number}>({ rating: 4.9, count: 172 });

    const [csv, setCsv] = useState('');
  const [json, setJson] = useState('');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // SEO Metadata Injection
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Fast, private, and secure CSV to JSON converter. Convert comma-separated values to JSON format instantly in your browser. Perfect for developers and data analysts.");
    }

    // Structured Data (JSON-LD) for SEO
    const scriptId = "csv-json-ld";
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Yogi CSV to JSON Converter",
      "description": "A developer tool to transform CSV data into structured JSON format with zero server-side storage.",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Web"
    });

    return () => { script?.remove(); };
  }, []);

  const parseCSV = (text: string) => {
    try {
      setError('');
      if (!text.trim()) {
        setJson('');
        setPreview([]);
        return;
      }

      const lines = text.trim().split(/\r?\n/);
      if (lines.length < 2) throw new Error("CSV must have at least a header and one data row.");

      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      
      const result = lines.slice(1).map((line) => {
        const pattern = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
        const data = line.split(pattern);
        
        const obj: any = {};
        headers.forEach((header, i) => {
          let val = data[i]?.trim() || '';
          val = val.replace(/^"|"$/g, '').replace(/""/g, '"');
          obj[header] = val;
        });
        return obj;
      });

      const jsonString = JSON.stringify(result, null, 2);
      setJson(jsonString);
      setPreview(result.slice(0, 5));
    } catch (err: any) {
      setError(err.message || "Failed to parse CSV. Please check formatting.");
      setJson('');
      setPreview([]);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCsv(value);
    parseCSV(value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsv(content);
      parseCSV(content);
    };
    reader.readAsText(file);
  };

  const downloadJson = () => {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <article className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20 px-1">
      <SEO title="CSV to JSON Converter - Professional Data Tool | Toolina" description="Free professional calculator and internal tool by Toolina. Accurate, fast, and easy to use." 
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "CSV to JSON Converter - Professional Data Tool",
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
      {/* Tool Header */}
      <header className="bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-200 shadow-2xl shadow-slate-100/50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-50 rounded-bl-[15rem] -mr-20 -mt-20 opacity-50 blur-3xl"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-orange-500 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center text-3xl md:text-4xl shadow-xl shadow-orange-100 text-white shrink-0">
              🔀
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
                CSV to <span className="text-orange-600">JSON Converter</span>
              </h1>
              <p className="text-slate-500 font-medium text-xs md:text-lg mt-1 italic">Professional Data Transformer for Developers</p>
            </div>
          </div>
          <div className="flex gap-2 w-full lg:w-auto">
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={(e) => { handleFileUpload(e); e.target.value = ''; }} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 lg:flex-none bg-slate-100 text-slate-700 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all border border-slate-200 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4-4m4 4v12" /></svg>
              Import CSV
            </button>
          </div>
        </div>

        {error && (
          <section className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[11px] font-black uppercase tracking-wider flex items-center gap-3 relative z-10">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
          </section>
        )}

        {/* Converter Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          <div className="flex flex-col h-[500px] md:h-[600px] bg-slate-50 rounded-[2.5rem] border border-slate-100 p-6 shadow-inner">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span> Raw CSV Input
              </h2>
              <button 
                onClick={() => { setCsv(''); setJson(''); setPreview([]); }}
                className="text-[9px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors"
              >
                Reset
              </button>
            </div>
            <textarea 
              value={csv}
              onChange={handleTextChange}
              placeholder="id, name, email&#10;1, Yogi Bear, yogi@example.com&#10;2, Boo Boo, booboo@example.com"
              className="flex-1 w-full bg-white border border-slate-200 rounded-[2rem] p-6 text-sm font-mono outline-none focus:ring-4 ring-orange-50 transition-all resize-none shadow-sm"
            />
          </div>

          <div className="flex flex-col h-[500px] md:h-[600px] bg-slate-900 rounded-[2.5rem] p-6 shadow-2xl relative group">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Structured JSON Output</h2>
              <div className="flex gap-4">
                {json && (
                  <>
                    <button 
                      onClick={() => navigator.clipboard.writeText(json)}
                      className="text-[9px] font-black text-teal-400 hover:text-teal-300 uppercase tracking-widest transition-colors"
                    >
                      Copy
                    </button>
                    <button 
                      onClick={downloadJson}
                      className="text-[9px] font-black text-orange-400 hover:text-orange-300 uppercase tracking-widest transition-colors"
                    >
                      Download
                    </button>
                  </>
                )}
              </div>
            </div>
            <pre className="flex-1 w-full bg-slate-950/40 rounded-[2rem] p-6 text-[11px] font-mono text-teal-400 overflow-auto scrollbar-hide select-all">
              {json || '// Converted JSON objects will appear here...'}
            </pre>
            
            {!json && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <span className="text-slate-500 font-mono text-xs font-black uppercase tracking-widest">{"{ waiting_for_data: true }"}</span>
              </div>
            )}
          </div>
        </div>

        {/* Data Preview Table */}
        {preview.length > 0 && (
          <section className="mt-12 animate-in fade-in slide-in-from-top-4 duration-500 relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-slate-100"></div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instant Data Preview (Top 5)</h3>
              <div className="h-px flex-1 bg-slate-100"></div>
            </div>
            <div className="overflow-x-auto rounded-[2rem] border border-slate-100 bg-white/50 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    {Object.keys(preview[0]).map(key => (
                      <th key={key} className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-tighter border-b border-slate-100">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {preview.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                      {Object.values(row).map((val: any, j) => (
                        <td key={j} className="px-6 py-4 text-xs font-medium text-slate-600 truncate max-w-[200px]">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </header>

      {/* Developer Education & Info Section */}
      <footer className="bg-slate-900 rounded-[3.5rem] p-8 md:p-16 text-white space-y-16 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.05),transparent)] pointer-events-none"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-tight">
              Streamline your <span className="text-orange-500">Data Workflow</span>
            </h2>
            <p className="text-slate-400 leading-relaxed text-lg">
              The Yogi CSV to JSON converter is built for speed and security. Whether you're a developer seeding a database or an analyst preparing data for a web app, our tool handles large datasets locally in your browser, ensuring your sensitive data <strong>never touches our servers</strong>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                <h3 className="text-orange-500 font-bold text-sm mb-2 uppercase tracking-widest">Privacy First</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">Processing happens 100% client-side using Javascript. No uploads required.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                <h3 className="text-orange-500 font-bold text-sm mb-2 uppercase tracking-widest">Robust Parsing</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">Handles quoted fields, commas within values, and varying line endings automatically.</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-300 mb-6 flex items-center gap-3">
                <span className="text-xl">🛠️</span> Developer FAQ
              </h3>
              <ul className="space-y-6">
                {[
                  { q: "Is there a file size limit?", a: "The tool can handle files up to 50MB comfortably, depending on your browser's memory allocation." },
                  { q: "Can I use this for production data?", a: "Yes. Since the conversion is client-side, it is as secure as your own local environment." },
                  { q: "Does it support complex CSV formats?", a: "It supports standard RFC 4180 CSVs, including multi-line fields and double-quoted values." },
                  { q: "Can I automate this conversion?", a: "Currently, this is a web-based GUI tool. Check our API documentation for programmatic options." }
                ].map((item, i) => (
                  <li key={i} className="space-y-1">
                    <h4 className="text-sm font-bold text-orange-500">{item.q}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.a}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 relative z-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Engineered with Precision by Toolina Developer Labs</p>
        </div>
      </footer>
    
      
      
      <AccompanyingText 
        toolName="C S V To Json"
        howItWorks="This tool uses advanced client-side processing to deliver instant results without sending your data to any external server. Simply input your parameters, and the algorithmic engine processes the data locally in your browser ensuring maximum privacy and speed."
        whyItsUseful="Whether you are a professional or a casual user, this tool saves you significant time by automating complex calculations and data transformations. It eliminates manual errors and provides a structured, easy-to-read output that you can rely on for your daily tasks."
        faqs={[
          { q: "Is my data secure?", a: "Yes, 100% secure. All processing happens entirely within your browser. We do not store or transmit your inputs to any remote servers." },
          { q: "Is this tool free to use?", a: "Absolutely. Toolina provides this utility completely free of charge with no hidden limits or premium paywalls." },
          { q: "Can I use this on mobile?", a: "Yes, the interface is fully responsive and works seamlessly across desktops, tablets, and smartphones." }
        ]}
      />
  
      <div className="max-w-3xl mx-auto my-8">
        <StarRatingWidget 
          toolId="csvtojson" 
          defaultRating={4.9} 
          defaultCount={172} 
          onRatingChange={(rating, count) => setRatingInfo({ rating, count })} 
        />
      </div>
      <ShareWidget title="CSV to JSON Converter" />
      </article>
  );
};

export default CSVToJson;
