import React, { useState, useCallback, useEffect } from 'react';
import AccompanyingText from '../components/AccompanyingText';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';
import { useDropzone } from 'react-dropzone';
import SEO from '../components/SEO';
import StarRatingWidget from '../components/StarRatingWidget';
import ShareWidget from '../components/ShareWidget';
import { Download, Minimize2, FileText, Loader2, RefreshCw } from 'lucide-react';

// Set up worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const CompressPDF: React.FC = () => {
  const [ratingInfo, setRatingInfo] = useState<{rating: number, count: number}>({ rating: 4.8, count: 163 });

  const [file, setFile] = useState<File | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [level, setLevel] = useState<'high' | 'medium' | 'extreme'>('medium');
  const [colorMode, setColorMode] = useState<'color' | 'grayscale'>('color');
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setCompressedBlob(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  } as any);

  const reset = () => {
    setFile(null);
    setCompressedBlob(null);
    setProgress({ current: 0, total: 0 });
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    setCompressedBlob(null);
    setProgress({ current: 0, total: 0 });

    try {
      // Logic for compression by rasterizing pages
      let scale = 1.5;
      let quality = 0.7;

      if (level === 'high') { // high quality, less compression
        scale = 2.0;
        quality = 0.85;
      } else if (level === 'extreme') { // low quality, high compression
        scale = 1.0;
        quality = 0.5;
      }

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      
      setProgress({ current: 0, total: totalPages });

      const newPdf = await PDFDocument.create();

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;

        // Set background to white
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({ canvasContext: context, viewport } as any).promise;
        
        if (colorMode === 'grayscale') {
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
             const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
             data[i] = gray;
             data[i + 1] = gray;
             data[i + 2] = gray;
          }
          context.putImageData(imageData, 0, 0);
        }

        const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
        const jpegBytes = fetch(jpegDataUrl).then(res => res.arrayBuffer());
        
        const [jpgImage] = await Promise.all([
          newPdf.embedJpg(await jpegBytes)
        ]);

        const scaledDims = jpgImage.scale(1 / scale);

        const newPage = newPdf.addPage([scaledDims.width, scaledDims.height]);
        newPage.drawImage(jpgImage, {
          x: 0,
          y: 0,
          width: scaledDims.width,
          height: scaledDims.height,
        });
        
        setProgress(p => ({ ...p, current: pageNum }));
      }

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setCompressedBlob(blob);

    } catch (err) {
      console.error(err);
      alert('Failed to compress PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadCompressed = () => {
    if (!compressedBlob || !file) return;
    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.replace('.pdf', '')}_compressed.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <article className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <SEO 
        title="Compress PDF Files Securely Offline Free Tool"
        description="Reduce PDF file size offline ensuring ultimate privacy. High compression quality entirely in your browser without uploading."
        url="https://toolina.in/compress-pdf-reduce-file-size"
        keywords="Compress PDF offline, reduce PDF size, shrink PDF, free PDF compressor, compact PDF online, secure PDF tool"
      
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Compress PDF Files Securely Offline Free Tool",
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
              🗜️
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
                Compress <span className="text-teal-600">PDF</span>
              </h1>
              <p className="text-slate-500 font-medium text-xs md:text-lg mt-1 italic">Reduce file size securely offline</p>
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
                <FileText className={`w-12 h-12 ${isDragActive ? 'text-teal-500' : 'text-slate-400'}`} />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-display font-black text-slate-800 tracking-tight">
                  {isDragActive ? 'Drop PDF here' : 'Drag & Drop PDF Here'}
                </h3>
                <p className="text-slate-400 font-medium mt-2">or click to browse from your device</p>
              </div>
              <button className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs cursor-pointer shadow-xl tracking-widest uppercase hover:bg-black active:scale-95 transition-all mt-2">Select File</button>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4 overflow-hidden w-full">
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-800 truncate">{file.name}</p>
                    <p className="text-sm text-slate-500">{formatBytes(file.size)}</p>
                  </div>
                </div>
                <button 
                  onClick={reset}
                  className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                  title="Remove file"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>

              {!compressedBlob && !isProcessing && (
                <div className="mb-8">
                  <label className="block text-sm font-bold text-slate-700 mb-3">Compression Level</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => setLevel('high')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        level === 'high' 
                          ? 'border-teal-500 bg-teal-50' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="font-bold text-slate-800 mb-1">Less Compression</div>
                      <div className="text-xs text-slate-500">High quality, larger file size</div>
                    </button>
                    <button
                      onClick={() => setLevel('medium')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        level === 'medium' 
                          ? 'border-teal-500 bg-teal-50' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="font-bold text-slate-800 mb-1">Recommended</div>
                      <div className="text-xs text-slate-500">Good quality, balanced size</div>
                    </button>
                    <button
                      onClick={() => setLevel('extreme')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        level === 'extreme' 
                          ? 'border-teal-500 bg-teal-50' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="font-bold text-slate-800 mb-1">Extreme</div>
                      <div className="text-xs text-slate-500">Lowest quality, smallest size</div>
                    </button>
                  </div>

                  <label className="block text-sm font-bold text-slate-700 mb-3 mt-6">Color Mode</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => setColorMode('color')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        colorMode === 'color' 
                          ? 'border-teal-500 bg-teal-50' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="font-bold text-slate-800 mb-1">Full Color</div>
                      <div className="text-xs text-slate-500">Keep original colors</div>
                    </button>
                    <button
                      onClick={() => setColorMode('grayscale')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        colorMode === 'grayscale' 
                          ? 'border-teal-500 bg-teal-50' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="font-bold text-slate-800 mb-1">Grayscale</div>
                      <div className="text-xs text-slate-500">Black & white (reduces size)</div>
                    </button>
                  </div>
                  
                  <div className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-xl text-sm justify-between flex-row flex text-orange-800">
                    <div>
                        <strong>Note:</strong> Compressing an offline PDF will convert text into images. If there's text you'd like to copy or search through, it will no longer be selectable. 
                    </div>
                  </div>
                </div>
              )}

              {isProcessing && (
                <div className="py-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-700">Compressing...</span>
                    <span className="text-teal-600 font-bold">{Math.round((progress.current / progress.total) * 100) || 0}%</span>
                  </div>
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal-500 transition-all duration-300 ease-out"
                      style={{ width: `${(progress.current / progress.total) * 100 || 0}%` }}
                    />
                  </div>
                </div>
              )}

              {compressedBlob && (
                <div className="py-6 border-t border-slate-200 mt-4 flex flex-col items-center animate-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-4">
                    <Download className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Compression Complete!</h3>
                  <div className="flex items-center gap-4 text-sm mb-6">
                    <div className="bg-slate-100 px-3 py-1 rounded-lg">
                      <span className="text-slate-500">Original:</span> <span className="font-bold text-slate-700">{formatBytes(file.size)}</span>
                    </div>
                    <span>→</span>
                    <div className={`px-3 py-1 rounded-lg border ${
                      compressedBlob.size > file.size 
                        ? 'bg-orange-50 border-orange-200' 
                        : 'bg-teal-50 border-teal-100'
                    }`}>
                      <span className={compressedBlob.size > file.size ? "text-orange-600" : "text-teal-600"}>Compressed:</span> <span className={`font-bold ${compressedBlob.size > file.size ? 'text-orange-700' : 'text-teal-700'}`}>{formatBytes(compressedBlob.size)}</span>
                      <span className={`ml-2 text-xs font-bold px-2 py-0.5 text-white rounded-full ${
                        compressedBlob.size > file.size ? 'bg-orange-500' : 'bg-teal-500'
                      }`}>
                        {compressedBlob.size > file.size 
                          ? `+${Math.round((compressedBlob.size / file.size - 1) * 100)}%` 
                          : `-${Math.round((1 - compressedBlob.size / file.size) * 100)}%`
                        }
                      </span>
                    </div>
                  </div>
                  
                  {compressedBlob.size >= file.size && (
                    <div className="mb-6 max-w-md text-center p-3 bg-slate-50 rounded-xl text-sm justify-between flex-row flex text-slate-600 border border-slate-200 shadow-sm">
                      <p>
                        <strong>Note:</strong> Your original PDF was likely mostly text. Our offline compression converts pages into images which can sometimes increase the file size.
                      </p>
                    </div>
                  )}

                  <button 
                    onClick={downloadCompressed}
                    className="w-full sm:w-auto px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-teal-500/30 flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download Compressed PDF
                  </button>
                </div>
              )}

              {!isProcessing && !compressedBlob && (
                <button 
                  onClick={handleCompress}
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
                >
                  <Minimize2 className="w-5 h-5" />
                  Compress PDF
                </button>
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
              Compress PDF Offline: <span className="text-teal-400">Reduce Size Fast</span>
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Quickly reduce the file size of your PDF documents with our free offline PDF compressor. This simple tool turns heavier files into optimized image-based PDFs using your selected compression level. Because it operates completely in your browser, your private data is never uploaded to external servers, providing an ultra-secure and high-speed compression experience.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="text-teal-400 font-bold text-sm mb-1 uppercase tracking-widest">Ultra Secure</h3>
                <p className="text-[10px] text-slate-500">All processing is done entirely within your local browser logic.</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="text-teal-400 font-bold text-sm mb-1 uppercase tracking-widest">Variable Quality</h3>
                <p className="text-[10px] text-slate-500">Pick from High, Medium, or Extreme compression presets.</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-300">Frequently Asked Questions (FAQ)</h3>
              <ul className="space-y-4">
                <li className="space-y-1">
                  <h4 className="text-sm font-bold text-teal-400">How to compress a PDF document?</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Simply upload your PDF, choose between Less, Recommended, or Extreme compression levels, and click 'Compress PDF'. Let it process and click download!</p>
                </li>
                <li className="space-y-1">
                  <h4 className="text-sm font-bold text-teal-400">Does compressing affect readability?</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">It relies on converting pages to JPEG images. Extremely high compression may result in blurrier text but yields to the smallest sizes. We recommend the "Recommended" preset.</p>
                </li>
                <li className="space-y-1">
                  <h4 className="text-sm font-bold text-teal-400">Is the text still searchable?</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Because our offline compression tool converts your PDF into a flattened image-based PDF document, the text will no longer be selectable or searchable.</p>
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
        toolName="Compress P D F"
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
          toolId="compresspdf" 
          defaultRating={4.8} 
          defaultCount={163} 
          onRatingChange={(rating, count) => setRatingInfo({ rating, count })} 
        />
      </div>
      <ShareWidget url="https://toolina.in/compress-pdf-reduce-file-size" title="Toolina Compress PDF" />
    </article>
  );
};

export default CompressPDF;
