import React, { useState, useCallback } from 'react';
import AccompanyingText from '../components/AccompanyingText';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import SEO from '../components/SEO';
import StarRatingWidget from '../components/StarRatingWidget';
import ShareWidget from '../components/ShareWidget';
import { Download, Images, X, Grid, List as ListIcon, RefreshCw, FileText } from 'lucide-react';

interface PreviewImage {
  id: string;
  file: File;
  dataUrl: string;
}

const ImageToPDF: React.FC = () => {
  const [ratingInfo, setRatingInfo] = useState<{rating: number, count: number}>({ rating: 4.5, count: 285 });

    const [images, setImages] = useState<PreviewImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pageSize, setPageSize] = useState<'A4' | 'FIT'>('A4');
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      dataUrl: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    multiple: true
  } as any);

  const removeImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      const removed = prev.find(img => img.id === id);
      if (removed) URL.revokeObjectURL(removed.dataUrl);
      return filtered;
    });
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    if (direction === 'up' && index > 0) {
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    } else if (direction === 'down' && index < newImages.length - 1) {
      [newImages[index + 1], newImages[index]] = [newImages[index], newImages[index + 1]];
    }
    setImages(newImages);
  };

  const convertToPDF = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();

      for (const img of images) {
        const arrayBuffer = await img.file.arrayBuffer();
        let pdfImage;
        
        if (img.file.type === 'image/jpeg' || img.file.type === 'image/jpg') {
          pdfImage = await pdfDoc.embedJpg(arrayBuffer);
        } else if (img.file.type === 'image/png') {
          pdfImage = await pdfDoc.embedPng(arrayBuffer);
        } else {
          // If unsupported (like WebP), we might skip or show error
          // Note: pdf-lib inherently only supports png and jpg natively easily,
          // for robust support across webp/etc we might need to draw them on canvas first.
          // Let's implement a fallback utilizing canvas to get PNG bytes!
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          const hImg = new Image();
          hImg.src = img.dataUrl;
          await new Promise(r => hImg.onload = r);
          
          canvas.width = hImg.width;
          canvas.height = hImg.height;
          context?.drawImage(hImg, 0, 0);
          
          const pngBytes = await new Promise<Uint8Array>(resolve => {
             canvas.toBlob(async blob => {
                const arr = new Uint8Array(await blob!.arrayBuffer());
                resolve(arr);
             }, 'image/png');
          });
          pdfImage = await pdfDoc.embedPng(pngBytes);
        }

        const imgDims = pdfImage.scale(1);
        
        let page;
        if (pageSize === 'FIT') {
          page = pdfDoc.addPage([imgDims.width, imgDims.height]);
          page.drawImage(pdfImage, {
            x: 0,
            y: 0,
            width: imgDims.width,
            height: imgDims.height,
          });
        } else { // A4 (595.28 x 841.89 points)
          const A4_WIDTH = 595.28;
          const A4_HEIGHT = 841.89;
          page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
          
          // Fit image to A4 while maintaining aspect ratio
          const scale = Math.min(A4_WIDTH / imgDims.width, A4_HEIGHT / imgDims.height);
          const drawW = imgDims.width * scale;
          const drawH = imgDims.height * scale;
          
          // Center it
          const x = (A4_WIDTH - drawW) / 2;
          const y = (A4_HEIGHT - drawH) / 2;
          
          page.drawImage(pdfImage, {
            x,
            y,
            width: drawW,
            height: drawH,
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `Converted_Images_\${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF. Make sure images are valid.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearAll = () => {
    images.forEach(img => URL.revokeObjectURL(img.dataUrl));
    setImages([]);
  };

  return (
    <article className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <SEO 
        title="Image to PDF Converter - Merge JPG/PNG to PDF Free"
        description="Convert multiple JPG, PNG, and WebP images to a professional PDF document. Adjust layout and sizes. Process securely offline in an instant."
        url="https://toolina.in/image-to-pdf-combine-converter"
        keywords="Image to PDF, convert JPG to PDF, PNG to PDF converter, merge images into PDF, photo to PDF offline, free image compiler"
      
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Image to PDF Converter - Merge JPG/PNG to PDF Free",
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
                Image to <span className="text-teal-600">PDF</span>
              </h1>
              <p className="text-slate-500 font-medium text-xs md:text-lg mt-1 italic">Combine multiple pictures into a secure PDF</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          
          {/* Top Controls when images are selected */}
          {images.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 gap-4">
               <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  <span className="text-sm font-bold text-slate-700 whitespace-nowrap bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                    {images.length} Image{images.length !== 1 && 's'}
                  </span>
                  
                  <div className="h-6 w-px bg-slate-300 hidden sm:block"></div>
                  
                  <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1 shadow-sm shrink-0">
                     <button 
                       onClick={() => setPageSize('A4')}
                       className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all \${pageSize === 'A4' ? 'bg-teal-50 text-teal-700' : 'text-slate-500 hover:text-slate-800'}`}
                     >
                       A4 Portrait
                     </button>
                     <button 
                       onClick={() => setPageSize('FIT')}
                       className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all \${pageSize === 'FIT' ? 'bg-teal-50 text-teal-700' : 'text-slate-500 hover:text-slate-800'}`}
                     >
                       Fit Image Size
                     </button>
                  </div>
               </div>
               
               <div className="flex items-center gap-2 w-full sm:w-auto">
                 <button 
                  onClick={clearAll}
                  className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none"
                 >
                   <RefreshCw className="w-4 h-4" /> Clear
                 </button>
                 <button 
                   onClick={convertToPDF}
                   disabled={isProcessing}
                   className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 flex-1 sm:flex-none"
                 >
                   {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                   Export PDF
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
              <Images className="w-12 h-12" />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-display font-black text-slate-800 tracking-tight">
                {isDragActive ? 'Drop Images here' : 'Drag & Drop Images Here'}
              </p>
              <p className="text-slate-400 font-medium mt-2">Accepts JPG, PNG, WebP. You can add more later.</p>
            </div>
            <button className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs cursor-pointer shadow-xl tracking-widest uppercase hover:bg-black active:scale-95 transition-all mt-2">Select Images</button>
          </div>

          {/* Grid of Images */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((img, index) => (
                <div key={img.id} className="relative group bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden aspect-[3/4] flex flex-col hover:border-teal-300 transition-colors">
                  <div className="flex-1 p-2 bg-white flex items-center justify-center relative overflow-hidden">
                     <img src={img.dataUrl} alt={img.file.name} className="w-full h-full object-contain pointer-events-none" />
                     <button 
                       onClick={() => removeImage(img.id)}
                       className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-sm"
                     >
                       <X className="w-3 h-3" />
                     </button>
                     <div className="absolute top-2 left-2 px-2 py-1 bg-slate-900/70 text-white rounded-md text-[10px] font-bold backdrop-blur-sm">
                        {index + 1}
                     </div>
                  </div>
                  <div className="bg-slate-50 p-2 sm:p-3 border-t border-slate-100 flex items-center justify-between">
                     <div className="flex gap-1">
                       <button 
                         onClick={() => moveImage(index, 'up')}
                         disabled={index === 0}
                         className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-lg disabled:opacity-30 transition-colors"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                       </button>
                       <button 
                         onClick={() => moveImage(index, 'down')}
                         disabled={index === images.length - 1}
                         className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-lg disabled:opacity-30 transition-colors"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                       </button>
                     </div>
                     <span className="text-[10px] sm:text-xs font-semibold text-slate-500 truncate max-w-[80px]" title={img.file.name}>
                       {img.file.name}
                     </span>
                  </div>
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
              Convert <span className="text-teal-400">Image to PDF</span> Offline: Easy & Secure
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Easily compile your photos, scans, and images into a single, professional PDF document. Whether you have JPGs, PNGs, or WebP files, this free tool allows you to merge them quickly. Because the tool runs directly offline within your web browser, <strong>no server uploads are required</strong>—ensuring complete privacy for your sensitive documents and ID cards.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="text-teal-400 font-bold text-sm mb-1 uppercase tracking-widest">Complete Privacy</h3>
                <p className="text-[10px] text-slate-500">Your images are processed locally on your device. Nothing is saved.</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="text-teal-400 font-bold text-sm mb-1 uppercase tracking-widest">No Sign-up</h3>
                <p className="text-[10px] text-slate-500">Free, unlimited conversions without any account requirements.</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-300">Frequently Asked Questions (FAQ)</h3>
              <ul className="space-y-4">
                <li className="space-y-1">
                  <h4 className="text-sm font-bold text-teal-400">How to convert Images into a PDF?</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Drag and drop your images, rearrange their order, select your preferred page size, and click "Export PDF".</p>
                </li>
                <li className="space-y-1">
                  <h4 className="text-sm font-bold text-teal-400">What formats are supported?</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">It works seamlessly with standard photo formats like JPG, JPEG, PNG, and WebP.</p>
                </li>
                <li className="space-y-1">
                  <h4 className="text-sm font-bold text-teal-400">Perfect uses for Image to PDF?</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Compiling assignment photos, merging front and back of ID cards, and combining scanned receipts.</p>
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
        toolName="Image To P D F"
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
          toolId="imagetopdf" 
          defaultRating={4.5} 
          defaultCount={285} 
          onRatingChange={(rating, count) => setRatingInfo({ rating, count })} 
        />
      </div>
      <ShareWidget url="https://toolina.in/image-to-pdf-combine-converter" title="Toolina Image to PDF Converter" />
    </article>
  );
};

export default ImageToPDF;
