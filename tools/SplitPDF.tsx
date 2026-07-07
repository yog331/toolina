import React, { useState, useCallback } from 'react';
import AccompanyingText from '../components/AccompanyingText';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import SEO from '../components/SEO';
import StarRatingWidget from '../components/StarRatingWidget';
import ShareWidget from '../components/ShareWidget';
import JSZip from 'jszip';
import { Download, Scissors, FileText, Loader2, RefreshCw } from 'lucide-react';

const SplitPDF: React.FC = () => {
  const [ratingInfo, setRatingInfo] = useState<{rating: number, count: number}>({ rating: 4.8, count: 257 });

    const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<'all' | 'range'>('all');
  const [rangeInput, setRangeInput] = useState('1-3, 5');
  const [totalPages, setTotalPages] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const f = acceptedFiles[0];
      setFile(f);
      try {
        const ab = await f.arrayBuffer();
        const doc = await PDFDocument.load(ab);
        setTotalPages(doc.getPageCount());
      } catch(e) {
        setTotalPages(0);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  } as any);

  const reset = () => {
    setFile(null);
    setTotalPages(0);
  };

  const handleSplit = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const docPageCount = pdf.getPageCount();

      if (mode === 'all') {
        const zip = new JSZip();
        for (let i = 0; i < docPageCount; i++) {
          const newPdf = await PDFDocument.create();
          const [copiedPage] = await newPdf.copyPages(pdf, [i]);
          newPdf.addPage(copiedPage);
          const pdfBytes = await newPdf.save();
          zip.file(`page-\${i + 1}.pdf`, pdfBytes);
        }
        
        const blob = await zip.generateAsync({ type: 'blob' });
        downloadBlob(blob, `\${file.name.replace('.pdf', '')}_split.zip`);
      } else {
        // Parse range input: "1-3, 5"
        const pageSet = new Set<number>();
        const parts = rangeInput.split(',').map(p => p.trim());
        for (const p of parts) {
          if (p.includes('-')) {
            const [start, end] = p.split('-').map(Number);
            if (!isNaN(start) && !isNaN(end)) {
               for (let i = start; i <= end; i++) {
                 if (i >= 1 && i <= docPageCount) pageSet.add(i - 1);
               }
            }
          } else {
            const num = Number(p);
            if (!isNaN(num) && num >= 1 && num <= docPageCount) {
              pageSet.add(num - 1);
            }
          }
        }
        
        const pagesToExtract = Array.from(pageSet).sort((a,b) => a-b);
        if (pagesToExtract.length === 0) {
          alert('Invalid range or out of bounds.');
          setIsProcessing(false);
          return;
        }

        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(pdf, pagesToExtract);
        copiedPages.forEach((page) => newPdf.addPage(page));
        
        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        downloadBlob(blob, `\${file.name.replace('.pdf', '')}_extracted.pdf`);
      }

    } catch (err) {
      console.error(err);
      alert('Failed to split PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <article className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <SEO 
        title="Split PDF - Extract Pages Securely Offline Free Tool"
        description="Extract specific pages or split a PDF into separate files. Fast, secure, and processes entirely inside your browser. No size limits."
        url="https://toolina.in/split-pdf-extract-pages"
        keywords="Split PDF offline, extract pages from PDF, separate PDF pages, divide PDF document, cut PDF, free PDF splitter, secure online PDF tool"
      
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Split PDF - Extract Pages Securely Offline Free Tool",
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
      <header className="bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-200 shadow-2xl shadow-slate-100/50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-50 rounded-bl-[15rem] -mr-20 -mt-20 opacity-50 blur-3xl"></div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-teal-600 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center text-3xl md:text-4xl shadow-xl shadow-teal-100 text-white shrink-0">
              ✂️
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
                Split <span className="text-teal-600">PDF</span>
              </h1>
              <p className="text-slate-500 font-medium text-xs md:text-lg mt-1 italic">Extract exact pages securely</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          
          {!file ? (
            <div 
              {...getRootProps()} 
              className={`group cursor-pointer border-[6px] border-dashed rounded-[3rem] p-12 md:p-24 text-center transition-all flex flex-col items-center justify-center gap-6 ${
                isDragActive ? 'border-teal-400 bg-teal-50/50' : 'border-slate-100 hover:border-teal-100 hover:bg-teal-50/20'
              }`}
            >
              <input {...getInputProps()} />
              <div className="w-24 h-24 bg-slate-50 text-teal-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner group-hover:scale-110 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-teal-100/50 transition-all duration-500">
                <Scissors className="w-12 h-12" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-display font-black text-slate-800 tracking-tight">
                  {isDragActive ? 'Drop PDF here' : 'Drag & Drop PDF Here'}
                </p>
                <p className="text-slate-400 font-medium mt-2">to extract pages</p>
              </div>
              <button className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs cursor-pointer shadow-xl tracking-widest uppercase hover:bg-black active:scale-95 transition-all mt-2">Select File</button>
            </div>
          ) : (
             <div className="space-y-8 animate-in fade-in duration-300">
               <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-100 gap-4">
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-teal-600 shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-800 text-base sm:text-lg truncate">{file.name}</h3>
                      <p className="text-slate-500 text-sm">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • {totalPages} Pages
                      </p>
                    </div>
                    <button 
                      onClick={reset}
                      className="p-2 sm:p-3 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-all"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <button 
                   onClick={() => setMode('all')}
                   className={`p-6 rounded-2xl border-2 text-left transition-all \${mode === 'all' ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-teal-200'}`}
                 >
                   <div className={`w-6 h-6 rounded-full border-4 mb-4 \${mode === 'all' ? 'border-teal-500' : 'border-slate-300'}`}></div>
                   <h3 className="font-bold text-slate-900 text-lg mb-1">Extract All</h3>
                   <p className="text-sm text-slate-500">Every single page will be saved as a separate PDF file inside a ZIP archive.</p>
                 </button>
                 
                 <div className={`p-6 rounded-2xl border-2 text-left transition-all flex flex-col \${mode === 'range' ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-teal-200 cursor-pointer'}`} onClick={() => setMode('range')}>
                   <div className={`w-6 h-6 rounded-full border-4 mb-4 \${mode === 'range' ? 'border-teal-500' : 'border-slate-300'}`}></div>
                   <h3 className="font-bold text-slate-900 text-lg mb-1">Select Range</h3>
                   <p className="text-sm text-slate-500 mb-4">Extract only specific pages into a single new PDF document.</p>
                   {mode === 'range' && (
                     <input 
                       type="text"
                       placeholder="e.g. 1-5, 8, 11-13"
                       value={rangeInput}
                       onChange={(e) => setRangeInput(e.target.value)}
                       className="w-full mt-auto px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium"
                       onClick={(e) => e.stopPropagation()}
                     />
                   )}
                 </div>
               </div>

               <div className="flex justify-end pt-4">
                 <button 
                   onClick={handleSplit}
                   disabled={isProcessing}
                   className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                 >
                   {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Scissors className="w-5 h-5" />}
                   {mode === 'all' ? 'Split to ZIP' : 'Extract PDF'}
                 </button>
               </div>
             </div>
          )}

        </div>
      </header>
        
      {/* SEO Optimized Semantic Footer */}
      <footer className="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-white space-y-12 overflow-hidden relative mt-12">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.1),transparent)] pointer-events-none"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative z-10">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight leading-tight">
              Split PDF Files Offline: <span className="text-teal-400">Extract Pages Fast</span>
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Extract specific pages or separate a large PDF document into multiple smaller files instantly using our free offline PDF splitter. Whether you need to pull just one crucial page from a massive report or divide a book into individual chapters, this tool gives you precise control. Because it processes everything locally in your browser, it is the safest way to split confidential documents.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="text-teal-400 font-bold text-sm mb-1 uppercase tracking-widest">Zero Uploads</h3>
                <p className="text-[10px] text-slate-500">Secures your data by doing all the heavy lifting locally.</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="text-teal-400 font-bold text-sm mb-1 uppercase tracking-widest">No Size Limits</h3>
                <p className="text-[10px] text-slate-500">Because there are no cloud uploads, you can split massive PDFs.</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-300">Frequently Asked Questions (FAQ)</h3>
              <ul className="space-y-4">
                <li className="space-y-1">
                  <h4 className="text-sm font-bold text-teal-400">How to extract pages from a PDF?</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Upload the PDF, choose "Extract All" or "Select Range" (e.g. 1-5, 8), and click the download button.</p>
                </li>
                <li className="space-y-1">
                  <h4 className="text-sm font-bold text-teal-400">Can I extract multiple non-sequential pages?</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Yes, use standard comma-separated ranges (e.g. 1-5, 8, 12) to pull precisely exactly what you need.</p>
                </li>
                <li className="space-y-1">
                  <h4 className="text-sm font-bold text-teal-400">When should you split a PDF?</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">To bypass email size limits, share targeted clauses of a contract, improve organization, or save printer ink.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 relative z-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Expertise provided by Toolina Digital Tools</p>
        </div>
      </footer>

        
      
      <AccompanyingText 
        toolName="Split P D F"
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
          toolId="splitpdf" 
          defaultRating={4.8} 
          defaultCount={257} 
          onRatingChange={(rating, count) => setRatingInfo({ rating, count })} 
        />
      </div>
      <ShareWidget url="https://toolina.in/split-pdf-extract-pages" title="Toolina Split PDF Tool" />
    </article>
  );
};

export default SplitPDF;
