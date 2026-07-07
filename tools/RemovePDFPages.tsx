import React, { useState, useCallback } from 'react';
import AccompanyingText from '../components/AccompanyingText';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import SEO from '../components/SEO';
import StarRatingWidget from '../components/StarRatingWidget';
import ShareWidget from '../components/ShareWidget';
import { Download, Trash2, FileText, Loader2, RefreshCw } from 'lucide-react';

const RemovePDFPages: React.FC = () => {
  const [ratingInfo, setRatingInfo] = useState<{rating: number, count: number}>({ rating: 4.8, count: 313 });

    const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rangeInput, setRangeInput] = useState('');
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
    setRangeInput('');
  };

  const handleRemove = async () => {
    if (!file) return;
    if (!rangeInput.trim()) {
      alert('Please enter pages to remove.');
      return;
    }

    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const docPageCount = pdf.getPageCount();

      // Parse range input: "1-3, 5"
      const pageSetToRemove = new Set<number>();
      const parts = rangeInput.split(',').map(p => p.trim());
      for (const p of parts) {
        if (!p) continue;
        if (p.includes('-')) {
          let [start, end] = p.split('-').map(Number);
          if (!isNaN(start) && !isNaN(end)) {
             if (start > end) {
               const temp = start;
               start = end;
               end = temp;
             }
             for (let i = start; i <= end; i++) {
               if (i >= 1 && i <= docPageCount) pageSetToRemove.add(i - 1);
             }
          }
        } else {
          const num = Number(p);
          if (!isNaN(num) && num >= 1 && num <= docPageCount) {
            pageSetToRemove.add(num - 1);
          }
        }
      }
      
      const pagesToKeep = [];
      for (let i = 0; i < docPageCount; i++) {
        if (!pageSetToRemove.has(i)) {
          pagesToKeep.push(i);
        }
      }

      if (pagesToKeep.length === 0) {
        alert('You cannot remove all pages from the PDF.');
        setIsProcessing(false);
        return;
      }

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdf, pagesToKeep);
      copiedPages.forEach((page) => newPdf.addPage(page));
      
      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      downloadBlob(blob, `${file.name.replace('.pdf', '')}_removed.pdf`);

    } catch (err) {
      console.error(err);
      alert('Failed to process PDF.');
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
        title="Remove PDF Pages Securely Offline Free Tool"
        description="Delete pages from your PDF document easily and securely in your browser. No files are uploaded."
        url="https://toolina.in/remove-pdf-pages-delete-securely"
        keywords="Remove PDF pages offline, delete PDF pages, extract PDF, remove page from PDF document, free PDF editor, secure PDF tool"
      
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Remove PDF Pages Securely Offline Free Tool",
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
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-50 rounded-bl-[15rem] -mr-20 -mt-20 opacity-50 blur-3xl"></div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-red-600 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center text-3xl md:text-4xl shadow-xl shadow-red-100 text-white shrink-0">
              🗑️
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
                Remove <span className="text-red-600">PDF Pages</span>
              </h1>
              <p className="text-slate-500 font-medium text-xs md:text-lg mt-1 italic">Delete specific pages directly</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          {!file ? (
            <div 
              {...getRootProps()} 
              className={`group cursor-pointer border-[6px] border-dashed rounded-[3rem] p-12 md:p-24 text-center transition-all flex flex-col items-center justify-center gap-6 ${
                isDragActive ? 'border-red-400 bg-red-50/50' : 'border-slate-100 hover:border-red-100 hover:bg-red-50/20'
              }`}
            >
              <input {...getInputProps()} />
              <div className="w-24 h-24 bg-slate-50 text-red-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner group-hover:scale-110 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-red-100/50 transition-all duration-500">
                <Trash2 className="w-12 h-12" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-display font-black text-slate-800 tracking-tight">
                  {isDragActive ? 'Drop PDF here' : 'Drag & Drop PDF Here'}
                </p>
                <p className="text-slate-400 font-medium mt-2">to remove pages</p>
              </div>
              <button className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs cursor-pointer shadow-xl tracking-widest uppercase hover:bg-black active:scale-95 transition-all mt-2">Select File</button>
            </div>
          ) : (
             <div className="space-y-8 animate-in fade-in duration-300 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-100">
               <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm gap-4">
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
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
                      className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shrink-0"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>
               </div>

               <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                 <label className="block font-bold text-slate-800 mb-2">Pages to Remove</label>
                 <p className="text-sm text-slate-500 mb-4">Enter page numbers or ranges separated by commas (e.g. 1, 3, 5-8)</p>
                 <input 
                   type="text"
                   placeholder="e.g. 1-5, 8, 11-13"
                   value={rangeInput}
                   onChange={(e) => setRangeInput(e.target.value)}
                   className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl outline-none focus:border-red-500 text-lg font-medium transition-all"
                 />
                 
                 <div className="mt-8">
                   <button 
                     onClick={handleRemove}
                     disabled={isProcessing}
                     className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {isProcessing ? (
                       <>
                         <Loader2 className="w-5 h-5 animate-spin" />
                         Processing...
                       </>
                     ) : (
                       <>
                         <Download className="w-5 h-5" />
                         Remove Pages & Download
                       </>
                     )}
                   </button>
                 </div>
               </div>
             </div>
          )}
        </div>
      </header>

      {/* SEO Optimized Semantic Footer */}
      <footer className="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-white space-y-12 overflow-hidden relative mt-12">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.1),transparent)] pointer-events-none"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative z-10">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight leading-tight">
              Remove PDF Pages Offline: <span className="text-red-400">Fast & Free</span>
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Instantly delete blank, duplicate, or unwanted pages from your PDF document easily and securely. Our entirely client-side tool means your document never touched a server, keeping your sensitive information completely private. Extract only what you need and reduce document size in just a few clicks.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="text-red-400 font-bold text-sm mb-1 uppercase tracking-widest">100% Private</h3>
                <p className="text-[10px] text-slate-500">Processing happens directly in your browser. No data is stored.</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="text-red-400 font-bold text-sm mb-1 uppercase tracking-widest">Precise Control</h3>
                <p className="text-[10px] text-slate-500">Easily provide a range of pages or single pages to accurately strip them.</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-300">Frequently Asked Questions (FAQ)</h3>
              <ul className="space-y-4">
                <li className="space-y-1">
                  <h4 className="text-sm font-bold text-red-400">How to remove pages from PDF?</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Upload a PDF, input the pages or page ranges you want deleted (e.g. "1-3, 5"), and press download for an updated document without them.</p>
                </li>
                <li className="space-y-1">
                  <h4 className="text-sm font-bold text-red-400">Can I select multiple random pages?</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Yes, using a comma-separated list like "2, 5, 12, 19-22", you can tell the tool exactly which pages across your document to erase.</p>
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
        toolName="Remove P D F Pages"
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
          toolId="removepdfpages" 
          defaultRating={4.8} 
          defaultCount={313} 
          onRatingChange={(rating, count) => setRatingInfo({ rating, count })} 
        />
      </div>
      <ShareWidget url="https://toolina.in/remove-pdf-pages-delete-securely" title="Toolina Remove PDF Pages Tool" />
    </article>
  );
};

export default RemovePDFPages;
