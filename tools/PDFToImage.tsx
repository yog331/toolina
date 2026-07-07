import React, { useState, useCallback, useRef } from 'react';
import AccompanyingText from '../components/AccompanyingText';
import * as pdfjsLib from 'pdfjs-dist';
import { useDropzone } from 'react-dropzone';
import SEO from '../components/SEO';
import StarRatingWidget from '../components/StarRatingWidget';
import ShareWidget from '../components/ShareWidget';
import JSZip from 'jszip';
import { Download, FileImage, FileCheck2, Loader2, RefreshCw } from 'lucide-react';

// Set up worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface PageImage {
  pageNumber: number;
  dataUrl: string;
}

const PDFToImage: React.FC = () => {
  const [ratingInfo, setRatingInfo] = useState<{rating: number, count: number}>({ rating: 4.7, count: 245 });

    const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<PageImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [format, setFormat] = useState<'image/jpeg' | 'image/png'>('image/jpeg');
  const [quality, setQuality] = useState(0.8);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setImages([]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  } as any);

  const generateImages = async () => {
    if (!file) return;
    setIsProcessing(true);
    setImages([]);
    setProgress({ current: 0, total: 0 });
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      setProgress({ current: 0, total: pdf.numPages });
      
      const newImages: PageImage[] = [];
      const scale = 2; // High resolution

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport } as any).promise;
        
        const dataUrl = canvas.toDataURL(format, quality);
        newImages.push({ pageNumber: pageNum, dataUrl });
        
        setProgress(p => ({ ...p, current: pageNum }));
      }
      
      setImages(newImages);
    } catch (error) {
      console.error("Error generating images", error);
      alert("An error occurred while reading the PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = (dataUrl: string, fileName: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAllZip = async () => {
    if (images.length === 0) return;
    
    setIsProcessing(true);
    try {
      const zip = new JSZip();
      const ext = format === 'image/jpeg' ? 'jpg' : 'png';
      
      images.forEach((img, idx) => {
        const base64Data = img.dataUrl.split(',')[1];
        zip.file(`page-${idx + 1}.${ext}`, base64Data, { base64: true });
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(content);
      a.download = `${file?.name.replace('.pdf', '')}_images.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
    } catch (err) {
      console.error("Zip generation error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setImages([]);
  };

  return (
    <article className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <SEO 
        title="PDF to Image Converter Free - High Quality Export"
        description="Convert PDF pages to high-quality JPG or PNG images instantly. Processes securely offline in your browser without uploading to any server. Fast and unlimited."
        url="https://toolina.in/pdf-to-image-high-quality-converter"
        keywords="PDF to Image, convert PDF to JPG, PDF to PNG converter, extract images from PDF offline, high resolution PDF converter"
      
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "PDF to Image Converter Free - High Quality Export",
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
              🖼️
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
                PDF to <span className="text-teal-600">Image</span>
              </h1>
              <p className="text-slate-500 font-medium text-xs md:text-lg mt-1 italic">Extract pages instantly, securely in your browser</p>
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
                <FileImage className="w-12 h-12" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-display font-black text-slate-800 tracking-tight">
                  {isDragActive ? 'Drop PDF here' : 'Drag & Drop PDF Here'}
                </p>
                <p className="text-slate-400 font-medium mt-2">or click to browse from your device</p>
              </div>
              <button className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs cursor-pointer shadow-xl tracking-widest uppercase hover:bg-black active:scale-95 transition-all mt-2">Select File</button>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* File Info */}
              <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-100 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-teal-600 shrink-0">
                    <FileCheck2 className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-800 text-base sm:text-lg truncate max-w-xs">{file.name}</h3>
                    <p className="text-slate-500 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                
                <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
                   {images.length === 0 && !isProcessing && (
                     <>
                      <select 
                        value={format} 
                        onChange={(e) => setFormat(e.target.value as any)}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm font-medium"
                      >
                        <option value="image/jpeg">JPEG format</option>
                        <option value="image/png">PNG format</option>
                      </select>
                      <button 
                        onClick={generateImages}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        Generate Images
                      </button>
                     </>
                   )}
                   <button 
                    onClick={reset}
                    className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 px-4 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shrink-0"
                   >
                     <RefreshCw className="w-4 h-4" />
                     <span className="sm:hidden">Start Over</span>
                   </button>
                </div>
              </div>

              {/* Progress */}
              {isProcessing && progress.total > 0 && images.length === 0 && (
                <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-100">
                  <Loader2 className="w-10 h-10 text-teal-500 animate-spin mx-auto mb-4" />
                  <p className="text-lg font-bold text-slate-800 mb-2">Rendering Pages...</p>
                  <p className="text-sm font-medium text-slate-500 mb-4">Page {progress.current} of {progress.total}</p>
                  <div className="w-full bg-slate-200 rounded-full h-3 max-w-sm mx-auto overflow-hidden">
                    <div 
                      className="bg-teal-500 h-3 rounded-full transition-all duration-300 ease-out" 
                      style={{ width: `\${(progress.current / progress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Results Grid */}
              {images.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                     <h3 className="text-xl font-bold text-slate-800">Generated Images <span className="bg-teal-100 text-teal-700 text-sm px-2 py-0.5 rounded-full ml-2">{images.length}</span></h3>
                     <button
                        onClick={downloadAllZip}
                        disabled={isProcessing}
                        className="bg-teal-600 hover:bg-teal-500 text-white px-5 py-2 rounded-xl font-bold flex items-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
                     >
                       {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                       Download ZIP
                     </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {images.map((img) => (
                      <div key={img.pageNumber} className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden group">
                        <div className="aspect-[3/4] bg-white relative">
                          <img 
                            src={img.dataUrl} 
                            alt={`Page \${img.pageNumber}`} 
                            className="w-full h-full object-contain p-2"
                          />
                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                             <button
                               onClick={() => downloadImage(img.dataUrl, `page-\${img.pageNumber}.\${format === 'image/jpeg' ? 'jpg' : 'png'}`)}
                               className="bg-white text-slate-900 rounded-full p-3 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all hover:scale-110"
                             >
                               <Download className="w-5 h-5" />
                             </button>
                          </div>
                        </div>
                        <div className="p-3 text-center border-t border-slate-100">
                          <p className="text-sm font-semibold text-slate-700">Page {img.pageNumber}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
              Free <span className="text-teal-400">PDF to Image</span> Converter: Fast & Offline
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Convert your PDF documents into high-resolution JPG or PNG images directly in your browser. Our completely free online tool provides you with the highest quality image extraction without requiring any software installation or complicated registrations. Unlike many other online converters, <strong>your files never leave your device</strong>—the entire conversion happens securely and locally on your own machine.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="text-teal-400 font-bold text-sm mb-1 uppercase tracking-widest">100% Privacy</h3>
                <p className="text-[10px] text-slate-500">No files uploaded to our servers. Processing is client-side.</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="text-teal-400 font-bold text-sm mb-1 uppercase tracking-widest">High Quality</h3>
                <p className="text-[10px] text-slate-500">Extracts pages using a 2x resolution scale for crystal-clear images.</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-300">Frequently Asked Questions (FAQ)</h3>
              <ul className="space-y-4">
                <li className="space-y-1">
                  <h4 className="text-sm font-bold text-teal-400">How to convert PDF to Image?</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Drag your PDF file, choose JPEG or PNG format, click Generate Images, and download individual or ZIP files.</p>
                </li>
                <li className="space-y-1">
                  <h4 className="text-sm font-bold text-teal-400">When to convert PDFs to Images?</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Great for sharing on social media, inserting into PowerPoint, or uploading to portals like tax forms that only accept .jpg or .png.</p>
                </li>
                <li className="space-y-1">
                  <h4 className="text-sm font-bold text-teal-400">Is batch export supported?</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Yes! You can conveniently download all your converted pages as a single ZIP archive instantly.</p>
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
        toolName="P D F To Image"
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
          toolId="pdftoimage" 
          defaultRating={4.7} 
          defaultCount={245} 
          onRatingChange={(rating, count) => setRatingInfo({ rating, count })} 
        />
      </div>
      <ShareWidget url="https://toolina.in/pdf-to-image-high-quality-converter" title="Toolina PDF to Image" />
    </article>
  );
};

export default PDFToImage;
