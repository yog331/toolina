import React, { useState, useCallback } from 'react';
import AccompanyingText from '../components/AccompanyingText';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import SEO from '../components/SEO';
import StarRatingWidget from '../components/StarRatingWidget';
import ShareWidget from '../components/ShareWidget';
import { Download, Files, X, RefreshCw, FileText } from 'lucide-react';

interface PDFFile {
  id: string;
  file: File;
}

const MergePDF: React.FC = () => {
  const [ratingInfo, setRatingInfo] = useState<{rating: number, count: number}>({ rating: 4.7, count: 201 });

    const [pdfs, setPdfs] = useState<PDFFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newPdfs = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      file
    }));
    setPdfs(prev => [...prev, ...newPdfs]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true
  } as any);

  const removePdf = (id: string) => {
    setPdfs(prev => prev.filter(pdf => pdf.id !== id));
  };

  const movePdf = (index: number, direction: 'up' | 'down') => {
    const newPdfs = [...pdfs];
    if (direction === 'up' && index > 0) {
      [newPdfs[index - 1], newPdfs[index]] = [newPdfs[index], newPdfs[index - 1]];
    } else if (direction === 'down' && index < newPdfs.length - 1) {
      [newPdfs[index + 1], newPdfs[index]] = [newPdfs[index], newPdfs[index + 1]];
    }
    setPdfs(newPdfs);
  };

  const clearAll = () => setPdfs([]);

  const handleMerge = async () => {
    if (pdfs.length < 2) {
      alert("Please add at least 2 PDF files to merge.");
      return;
    }
    
    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const pdf of pdfs) {
        const arrayBuffer = await pdf.file.arrayBuffer();
        const doc = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(doc, doc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `Merged_Document_\${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Merge error:", error);
      alert("An error occurred while merging the PDF files.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <article className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <SEO 
        title="Merge PDF Files - Combine & Join PDFs Securely Offline"
        description="Combine multiple PDF files into one single document securely in your browser. Rearrange pages easily. No files are uploaded to any server."
        url="https://toolina.in/merge-pdf-combine-documents"
        keywords="Merge PDF, combine PDF files offline, join PDF documents, free PDF merger, secure PDF compiler, merge PDF no upload"
      
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Merge PDF Files - Combine & Join PDFs Securely Offline",
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
              📑
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
                Merge <span className="text-teal-600">PDFs</span>
              </h1>
              <p className="text-slate-500 font-medium text-xs md:text-lg mt-1 italic">Combine multiple PDFs securely</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          
          {/* Top Controls */}
          {pdfs.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 gap-4">
               <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                    {pdfs.length} File{pdfs.length !== 1 && 's'} Selected
                  </span>
               </div>
               
               <div className="flex items-center gap-2 w-full sm:w-auto">
                 <button 
                  onClick={clearAll}
                  className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none"
                 >
                   <RefreshCw className="w-4 h-4" /> Clear
                 </button>
                 <button 
                   onClick={handleMerge}
                   disabled={isProcessing || pdfs.length < 2}
                   className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 flex-1 sm:flex-none"
                 >
                   {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                   Merge PDFs
                 </button>
               </div>
            </div>
          )}

          {/* DND Target */}
          <div 
            {...getRootProps()} 
            className={`group cursor-pointer border-[6px] border-dashed rounded-[3rem] p-12 md:p-24 text-center transition-all flex flex-col items-center justify-center gap-6 mb-6 ${
              isDragActive ? 'border-teal-400 bg-teal-50/50' : 'border-slate-100 hover:border-teal-100 hover:bg-teal-50/20'
            }`}
          >
            <input {...getInputProps()} />
            <div className="w-24 h-24 bg-slate-50 text-teal-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner group-hover:scale-110 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-teal-100/50 transition-all duration-500">
              <Files className="w-12 h-12" />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-display font-black text-slate-800 tracking-tight">
                {isDragActive ? 'Drop PDFs here' : 'Drag & Drop PDF Files Here'}
              </p>
              <p className="text-slate-400 font-medium mt-2">Order matters! You can rearrange them after adding.</p>
            </div>
            <button className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs cursor-pointer shadow-xl tracking-widest uppercase hover:bg-black active:scale-95 transition-all mt-2">Select PDFs</button>
          </div>

          {/* List of PDFs */}
          {pdfs.length > 0 && (
            <div className="space-y-3">
              {pdfs.map((pdf, index) => (
                <div key={pdf.id} className="group bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-teal-300 transition-colors">
                  <div className="flex flex-col gap-1 shrink-0">
                    <button 
                      onClick={() => movePdf(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-30 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" /></svg>
                    </button>
                    <button 
                      onClick={() => movePdf(index, 'down')}
                      disabled={index === pdfs.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-30 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                  </div>
                  
                  <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm border border-teal-100">
                    {index + 1}
                  </div>
                  
                  <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 text-sm sm:text-base truncate">{pdf.file.name}</p>
                    <p className="text-xs text-slate-500">{(pdf.file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  
                  <button 
                    onClick={() => removePdf(pdf.id)}
                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
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
              Merge PDF Files Securely: <span className="text-teal-400">free offline PDF combiner</span>
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Easily combine and join multiple PDF files into one single organized document. This free tool allows you to merge documents fast without requiring cloud uploads or compromising data privacy. Because all processing runs directly inside your web browser using offline logic, it is one of the most secure ways to merge PDF files containing sensitive or personal information.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="text-teal-400 font-bold text-sm mb-1 uppercase tracking-widest">100% Offline</h3>
                <p className="text-[10px] text-slate-500">Your files never touch our servers. Absolute privacy.</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="text-teal-400 font-bold text-sm mb-1 uppercase tracking-widest">Instant Results</h3>
                <p className="text-[10px] text-slate-500">No upload/download delays for virtually instant merge.</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-300">Frequently Asked Questions (FAQ)</h3>
              <ul className="space-y-4">
                 <li className="space-y-1">
                    <h4 className="text-sm font-bold text-teal-400">How to Merge PDF files?</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">Drag and drop the PDF documents, arrange them using the arrows, and click Merge PDFs to download the single document.</p>
                  </li>
                  <li className="space-y-1">
                    <h4 className="text-sm font-bold text-teal-400">Is it free and unlimited?</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">Yes, there are no file size constraints or daily caps. Combine as many files as you need, entirely free.</p>
                  </li>
                  <li className="space-y-1">
                    <h4 className="text-sm font-bold text-teal-400">Common uses for the PDF Merger?</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">Merging invoices for tax returns, combining portfolios and pitch decks, appending signed contract pages, or stitching study materials.</p>
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
        toolName="Merge P D F"
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
          toolId="mergepdf" 
          defaultRating={4.7} 
          defaultCount={201} 
          onRatingChange={(rating, count) => setRatingInfo({ rating, count })} 
        />
      </div>
      <ShareWidget url="https://toolina.in/merge-pdf-combine-documents" title="Toolina Merge PDF" />
    </article>
  );
};

export default MergePDF;
