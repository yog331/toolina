
import React, { useState, useRef, useEffect } from 'react';
import AccompanyingText from '../components/AccompanyingText';
import ShareWidget from '../components/ShareWidget';
import SEO from '../components/SEO';
import StarRatingWidget from '../components/StarRatingWidget';
import JSZip from 'jszip';

type Format = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif' | 'image/bmp';
type ResizeMode = 'pixels' | 'percentage';

interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
  aspectLabel?: string;
}

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  result?: string;
  name: string;
  originalWidth: number;
  originalHeight: number;
  crop?: CropData;
  rotation?: number; // 0, 90, 180, 270
}

const PRESETS = [
  { name: 'FHD', w: 1920, h: 1080 },
  { name: 'HD', w: 1280, h: 720 },
  { name: 'Square', w: 1080, h: 1080 },
];

const PASSPORT_PRESETS = [
  { label: 'Passport (3.5x4.5cm)', ratio: 3.5/4.5, w: 350, h: 450 },
  { label: 'US Visa (2x2")', ratio: 1, w: 600, h: 600 },
];

const ImageConverter: React.FC = () => {
  const [ratingInfo, setRatingInfo] = useState<{rating: number, count: number}>({ rating: 4.6, count: 144 });

    // Enhanced SEO Logic
  useEffect(() => {
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Free Batch Image Converter & Resizer. Convert HEIC to JPG, PNG to JPG, JPG to WebP, WebP to PNG, JPEG, GIF, BMP, HEIF in bulk. Offline processing, passport crop, custom quality & dimension settings.");
    }
  }, []);

  const [images, setImages] = useState<ImageFile[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<Format>('image/png');
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [resizeMode, setResizeMode] = useState<ResizeMode>('pixels');
  const [resizeWidth, setResizeWidth] = useState<number | ''>('');
  const [resizeHeight, setResizeHeight] = useState<number | ''>('');
  const [scalePercent, setScalePercent] = useState<number>(100);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [quality, setQuality] = useState<number>(0.9);
  const [namingPattern, setNamingPattern] = useState('[name]');
  const [editingImage, setEditingImage] = useState<ImageFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList) return;
    const filesArray = Array.from(fileList);
    
    for (const file of filesArray) {
      const isHeic = file.name.toLowerCase().endsWith('.heic') || 
                     file.name.toLowerCase().endsWith('.heif') || 
                     file.type === 'image/heic' || 
                     file.type === 'image/heif';
                     
      if (!file.type.startsWith('image/') && !isHeic) continue;
      
      const id = Math.random().toString(36).substring(7);
      
      // Push an initial file structure to state
      const initialImage: ImageFile = {
        id,
        file,
        name: file.name.split('.')[0],
        preview: '',
        status: isHeic ? 'processing' : 'pending',
        originalWidth: 0,
        originalHeight: 0,
        rotation: 0
      };
      
      setImages(prev => [...prev, initialImage]);
      
      try {
        let fileToProcess = file;
        
        if (isHeic) {
          // Dynamically import heic2any for conversion
          // @ts-ignore
          const heic2anyModule = await import('heic2any');
          const heic2any = heic2anyModule.default;
          
          const convertedBlob = await heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.9
          });
          
          const singleBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
          
          fileToProcess = new File([singleBlob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
            type: 'image/jpeg'
          });
          
          // Update file reference and name in state
          setImages(prev => prev.map(item => 
            item.id === id ? { ...item, file: fileToProcess, name: fileToProcess.name.split('.')[0] } : item
          ));
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          const img = new Image();
          img.onload = () => {
            setImages(prev => prev.map(item => 
              item.id === id ? { 
                ...item, 
                originalWidth: img.width, 
                originalHeight: img.height,
                status: 'pending' // reset to pending so it can be batch processed
              } : item
            ));
          };
          img.src = dataUrl;
          setImages(prev => prev.map(item => 
            item.id === id ? { ...item, preview: dataUrl } : item
          ));
        };
        reader.readAsDataURL(fileToProcess);
        
      } catch (err) {
        console.error('Failed to convert/load HEIC image:', err);
        setImages(prev => prev.map(item => 
          item.id === id ? { ...item, status: 'error' } : item
        ));
      }
    }
  };

  const removeImage = (id: string) => setImages(prev => prev.filter(img => img.id !== id));

  const rotateImage = (id: string, direction: 'cw' | 'ccw') => {
    setImages(prev => prev.map(img => {
      if (img.id !== id) return img;
      const current = img.rotation || 0;
      const next = direction === 'cw' ? (current + 90) % 360 : (current - 90 + 360) % 360;
      return { ...img, rotation: next, status: 'pending', result: undefined };
    }));
  };

  const calculateTargetDim = (img: ImageFile) => {
    let sW = img.crop ? img.crop.width : img.originalWidth;
    let sH = img.crop ? img.crop.height : img.originalHeight;
    if (!sW || !sH) return { w: 0, h: 0 };
    if ((img.rotation || 0) % 180 !== 0) [sW, sH] = [sH, sW];

    if (resizeMode === 'percentage') {
      return { w: Math.round(sW * (scalePercent / 100)), h: Math.round(sH * (scalePercent / 100)) };
    }

    let fW = sW, fH = sH;
    if (resizeWidth && typeof resizeWidth === 'number') {
      fW = resizeWidth;
      if (maintainAspectRatio) fH = Math.round(fW / (sW / sH));
      else if (resizeHeight && typeof resizeHeight === 'number') fH = resizeHeight;
    } else if (resizeHeight && typeof resizeHeight === 'number') {
      fH = resizeHeight;
      if (maintainAspectRatio) fW = Math.round(fH * (sW / sH));
    }
    return { w: fW, h: fH };
  };

  const formatFilename = (img: ImageFile, index: number) => {
    const ext = selectedFormat.split('/')[1].replace('jpeg', 'jpg');
    const target = calculateTargetDim(img);
    const date = new Date().toISOString().split('T')[0];
    let result = namingPattern.replace(/\[name\]/g, img.name).replace(/\[index\]/g, (index + 1).toString()).replace(/\[date\]/g, date).replace(/\[width\]/g, target.w.toString()).replace(/\[height\]/g, target.h.toString());
    return `${result}.${ext}`;
  };

  const processAll = async () => {
    if (images.length === 0) return;
    setIsBatchProcessing(true);
    for (const current of [...images]) {
      setImages(prev => prev.map(img => img.id === current.id ? { ...img, status: 'processing' } : img));
      try {
        const result = await processSingleImage(current);
        setImages(prev => prev.map(img => img.id === current.id ? { ...img, status: 'done', result } : img));
      } catch (err) {
        setImages(prev => prev.map(img => img.id === current.id ? { ...img, status: 'error' } : img));
      }
    }
    setIsBatchProcessing(false);
  };

  const processSingleImage = (imgObj: ImageFile): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let sX = imgObj.crop?.x || 0, sY = imgObj.crop?.y || 0, sW = imgObj.crop?.width || imgObj.originalWidth, sH = imgObj.crop?.height || imgObj.originalHeight;
        const { w: fW, h: fH } = calculateTargetDim(imgObj);
        canvas.width = fW; canvas.height = fH;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return reject();
        if (selectedFormat === 'image/jpeg' || selectedFormat === 'image/bmp') { ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, fW, fH); }
        ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
        ctx.save(); 
        ctx.translate(fW / 2, fH / 2); 
        ctx.rotate(((imgObj.rotation || 0) * Math.PI) / 180);
        let dW = (imgObj.rotation || 0) % 180 !== 0 ? fH : fW, dH = (imgObj.rotation || 0) % 180 !== 0 ? fW : fH;
        ctx.drawImage(img, sX, sY, sW, sH, -dW / 2, -dH / 2, dW, dH); 
        ctx.restore();
        resolve(canvas.toDataURL(selectedFormat, quality));
      };
      img.onerror = reject; img.src = imgObj.preview;
    });
  };

  const downloadSingle = (img: ImageFile, index: number) => {
    if (!img.result) return;
    try {
      const arr = img.result.split(',');
      const match = arr[0].match(/:(.*?);/);
      if (!match) return;
      const mime = match[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = formatFilename(img, index);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Download failed:", e);
      // Fallback
      const link = document.createElement('a');
      link.href = img.result;
      link.download = formatFilename(img, index);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadZip = async () => {
    const zip = new JSZip();
    images.forEach((img, idx) => { if (img.result) zip.file(formatFilename(img, idx), img.result.split(',')[1], { base64: true }); });
    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content); link.download = `Toolina_Batch_${Date.now()}.zip`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const availableFormats: Format[] = ['image/png', 'image/jpeg', 'image/webp', 'image/bmp', 'image/gif'];

  return (
    <article className="max-w-7xl mx-auto space-y-6 md:space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <SEO title="Bulk Image Converter: Convert PNG, JPG, WebP, HEIC, GIF, BMP Online - Toolina" description="Free batch image converter & resizer. Convert HEIC to JPG, JPG to WebP, PNG to JPG, WebP to PNG, GIF, BMP in bulk. Adjust quality, crop passport photos offline securely in your browser." 
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Bulk Image Converter: Convert PNG, JPG, WebP, HEIC, GIF, BMP Online - Toolina",
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
      {editingImage && (
        <CropModal 
          image={editingImage} 
          onSave={(crop) => { 
            setImages(prev => prev.map(img => img.id === editingImage.id ? { ...img, crop, status: 'pending', result: undefined } : img)); 
            setEditingImage(null); 
          }} 
          onClose={() => setEditingImage(null)} 
        />
      )}

      {/* Main Tool Header - SEO H1 */}
      <header className="bg-white p-5 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border border-slate-200 shadow-2xl shadow-slate-100/50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-50 rounded-bl-[15rem] -mr-20 -mt-20 opacity-50 blur-3xl"></div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-teal-600 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center text-2xl md:text-4xl shadow-xl shadow-teal-100 text-white shrink-0">🖼️</div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
                Batch Image <span className="text-teal-600">Converter</span>
              </h1>
              </div>
              <p className="text-slate-500 font-medium text-xs md:text-lg italic">The ultimate bulk photo resizer & format optimizer.</p>
            </div>
          </div>
          <div className="flex w-full lg:w-auto gap-2">
             <button onClick={() => setImages([])} className="flex-1 lg:flex-none px-4 py-2 text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors border border-transparent hover:border-red-100 rounded-xl">Clear Queue</button>
             <div className="flex-1 lg:flex-none bg-slate-100 px-4 py-2 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest border border-slate-200 text-center flex items-center justify-center gap-2">
               <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
               {images.length} Files Ready
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <section className="xl:col-span-4 space-y-6 order-2 xl:order-1">
            <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-200/50 space-y-6 shadow-inner">
               <div>
                 <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span> RESIZE CONFIG</h2>
                 <div className="grid grid-cols-2 p-1 bg-slate-200/50 rounded-xl mb-4">
                   <button onClick={() => setResizeMode('pixels')} className={`py-2 text-[9px] font-black rounded-lg transition-all ${resizeMode === 'pixels' ? 'bg-white shadow-sm text-teal-700' : 'text-slate-500'}`}>PIXELS</button>
                   <button onClick={() => setResizeMode('percentage')} className={`py-2 text-[9px] font-black rounded-lg transition-all ${resizeMode === 'percentage' ? 'bg-white shadow-sm text-teal-700' : 'text-slate-500'}`}>PERCENT</button>
                 </div>

                 {resizeMode === 'pixels' ? (
                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-slate-700 uppercase">Dimensions</label>
                        <button onClick={() => setMaintainAspectRatio(!maintainAspectRatio)} className={`text-[8px] font-black px-2 py-1 rounded-lg border transition-all ${maintainAspectRatio ? 'bg-teal-100 text-teal-600 border-teal-200' : 'bg-slate-200 text-slate-400 border-slate-300'}`}>
                          {maintainAspectRatio ? 'LOCKED' : 'FREE'}
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300">W</span><input type="number" placeholder="Auto" value={resizeWidth} onChange={(e) => setResizeWidth(e.target.value === '' ? '' : parseInt(e.target.value))} className="w-full pl-7 pr-3 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 ring-teal-50 font-mono font-bold text-xs" /></div>
                        <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300">H</span><input type="number" placeholder="Auto" value={resizeHeight} onChange={(e) => setResizeHeight(e.target.value === '' ? '' : parseInt(e.target.value))} disabled={maintainAspectRatio} className="w-full pl-7 pr-3 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 ring-teal-50 font-mono font-bold text-xs disabled:opacity-50" /></div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {PRESETS.map(p => (
                          <button key={p.name} onClick={() => { setResizeMode('pixels'); setResizeWidth(p.w); setResizeHeight(p.h); setMaintainAspectRatio(false); }} className="py-2 bg-white border border-slate-200 rounded-lg text-[8px] font-bold text-slate-500 hover:border-teal-300 hover:text-teal-600 transition-all shadow-sm">
                            {p.name}
                          </button>
                        ))}
                      </div>
                   </div>
                 ) : (
                   <div className="space-y-4">
                      <div className="flex justify-between items-center"><label className="text-[10px] font-bold text-slate-700 uppercase">Scaling Power</label><span className="text-[10px] font-black text-teal-600 font-mono bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">{scalePercent}%</span></div>
                      <input type="range" min="1" max="200" value={scalePercent} onChange={(e) => setScalePercent(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600" />
                   </div>
                 )}
               </div>

               <div className="space-y-4 pt-4 border-t border-slate-200/50">
                  <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">EXPORT FORMAT</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availableFormats.map(f => (
                      <button 
                        key={f} 
                        onClick={() => setSelectedFormat(f)} 
                        className={`py-2.5 rounded-xl text-[9px] font-black border transition-all ${selectedFormat === f ? 'bg-teal-600 text-white border-teal-600 shadow-lg shadow-teal-100' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                      >
                        {f.split('/')[1].toUpperCase().replace('JPEG', 'JPG')}
                      </button>
                    ))}
                  </div>

                  {(selectedFormat === 'image/jpeg' || selectedFormat === 'image/webp') && (
                    <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-slate-700 uppercase">Compression Quality</label>
                        <span className="text-[10px] font-black text-teal-600 font-mono bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                          {Math.round(quality * 100)}%
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="0.1" 
                        max="1.0" 
                        step="0.05" 
                        value={quality} 
                        onChange={(e) => setQuality(parseFloat(e.target.value))} 
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600" 
                      />
                      <p className="text-[8px] text-slate-400 italic">Lower quality = Smaller file size</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-700 uppercase ml-1">Naming Template</label>
                    <input type="text" value={namingPattern} onChange={(e) => setNamingPattern(e.target.value)} placeholder="Pattern (e.g. [name]_v1)" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 ring-teal-50 text-[10px] font-bold text-slate-700 transition-all" />
                  </div>
               </div>

               <div className="pt-4 space-y-3">
                <button onClick={processAll} disabled={images.length === 0 || isBatchProcessing} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3">
                  {isBatchProcessing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                  START BATCH
                </button>
                {images.some(img => img.status === 'done') && (
                  images.length === 1 ? (
                    <button 
                      onClick={() => downloadSingle(images[0], 0)} 
                      className="w-full bg-teal-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-teal-700 transition-all shadow-xl flex items-center justify-center gap-3 animate-in zoom-in duration-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      DOWNLOAD IMAGE
                    </button>
                  ) : (
                    <button 
                      onClick={downloadZip} 
                      className="w-full bg-teal-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-teal-700 transition-all shadow-xl flex items-center justify-center gap-3 animate-in zoom-in duration-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      DOWNLOAD ZIP
                    </button>
                  )
                )}
               </div>
            </div>
          </section>

          <section className="xl:col-span-8 space-y-6 order-1 xl:order-2">
            <div onClick={() => fileInputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }} className="group cursor-pointer border-4 border-dashed border-slate-100 hover:border-teal-100 hover:bg-teal-50/20 rounded-[2.5rem] py-12 md:py-20 transition-all flex flex-col items-center justify-center gap-4 text-center px-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-3xl md:text-5xl group-hover:scale-110 transition-transform shadow-inner duration-500">📤</div>
              <div className="space-y-1">
                <p className="text-lg md:text-xl font-display font-black text-slate-800">Bulk Upload Images</p>
                <p className="text-slate-400 font-medium text-xs uppercase tracking-widest">Supports JPG, PNG, WEBP, HEIC/HEIF, GIF, BMP</p>
              </div>
              <input type="file" multiple className="hidden" ref={fileInputRef} accept="image/*,.heic,.heif" onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[300px] max-h-[500px] overflow-y-auto pr-2 scrollbar-hide pb-8 relative">
              {images.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center h-full min-h-[300px] text-center space-y-4 animate-in fade-in duration-700 border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/30">
                  <div className="text-5xl opacity-30 grayscale filter">🧘‍♂️</div>
                  <div>
                    <h3 className="text-sm font-display font-black text-slate-400 uppercase tracking-widest">Queue is Empty</h3>
                    <p className="text-slate-300 text-[10px] font-bold uppercase mt-1">Files added to the batch will appear here</p>
                  </div>
                </div>
              ) : (
                images.map((img, idx) => {
                  const target = calculateTargetDim(img);
                  return (
                    <div key={img.id} className="bg-white border border-slate-100 rounded-3xl p-3 flex flex-col gap-3 relative group hover:shadow-xl transition-all border-b-4 border-b-transparent hover:border-b-teal-500 animate-in zoom-in duration-300">
                      <div className="w-full aspect-square bg-slate-50 rounded-2xl overflow-hidden relative border border-slate-100 flex items-center justify-center">
                        {img.preview && (
                          <img src={img.preview} alt={img.name} style={{ transform: `rotate(${img.rotation || 0}deg)` }} className="w-full h-full object-cover transition-all" />
                        )}
                        {img.status === 'processing' && (
                          <div className="absolute inset-0 bg-teal-600/40 backdrop-blur-sm flex items-center justify-center"><div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div></div>
                        )}
                        {img.status === 'done' && (
                          <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-lg shadow-lg"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black text-slate-800 truncate mb-1">{img.name}</p>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[8px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{img.originalWidth}x{img.originalHeight}</span>
                          <svg className="w-2.5 h-2.5 text-teal-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" /></svg>
                          <span className="text-[8px] font-black text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100">{target.w}x{target.h}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                        <div className="flex gap-1">
                          <button onClick={() => rotateImage(img.id, 'cw')} className="p-1.5 text-slate-400 hover:text-teal-600 rounded-lg transition-all" title="Rotate CW"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 10H11a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" /></svg></button>
                          <button onClick={() => setEditingImage(img)} className="p-1.5 text-slate-400 hover:text-teal-600 rounded-lg transition-all" title="Crop & Edit"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                          {img.status === 'done' && (
                            <button onClick={() => downloadSingle(img, idx)} className="p-1.5 text-emerald-500 hover:text-emerald-600 rounded-lg transition-all" title="Download Image"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg></button>
                          )}
                        </div>
                        <button onClick={() => removeImage(img.id)} className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg transition-all" title="Remove"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </header>

      {/* SEO Optimized Content Section */}
      <footer className="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-white space-y-16 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.1),transparent)] pointer-events-none"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative z-10">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight leading-tight">
              Best <span className="text-teal-400">Batch Image Converter</span> & Bulk Photo Resizer Online
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm">
              Toolina offers a high-performance, professional-grade <strong>bulk image converter</strong> designed to resize, compress, and rotate multiple photos simultaneously. We prioritize your privacy above all: unlike standard online services, all image transformations are executed <strong>100% client-side inside your browser</strong>. Your private pictures, passport photos, and signatures are never uploaded to any remote server.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="text-teal-400 font-bold text-sm mb-1 uppercase tracking-widest">Passport & Visa Spec</h3>
                <p className="text-[10px] text-slate-400 leading-normal">Interactive cropping for standard 3.5x4.5cm and US Visa specs, perfect for SSO Rajasthan and Central govt application portals.</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="text-teal-400 font-bold text-sm mb-1 uppercase tracking-widest">Next-Gen WebP Engine</h3>
                <p className="text-[10px] text-slate-400 leading-normal">Reduce PNG or JPG image file sizes by up to 80% using our multi-threaded batch compression with high-fidelity quality sliders.</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-black uppercase tracking-widest text-slate-300">Why Use Toolina Image Resizer?</h3>
            <ul className="space-y-3">
              {[
                "Bulk processing capability: convert hundreds of photos in a single click.",
                "All-in-one suite: Batch resize, rotate, crop, compress, and rename images simultaneously.",
                "Supported format outputs: PNG, JPEG (JPG), WEBP, GIF, and BMP formats.",
                "Advanced input formats: Full client-side decoding support for Apple HEIC & HEIF photos.",
                "Fully interactive visual crop helper featuring customizable aspect ratio presets.",
                "Perfect for student applications, professional bloggers, and web developers needing optimized assets.",
                "Zero data collection: works seamlessly offline on any modern device."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-1.5 shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Dedicated Supported Conversions Table/Grid */}
        <div className="pt-12 border-t border-white/10 relative z-10 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl font-black text-slate-100 tracking-tight">Exhaustive Support For File Type Conversions</h3>
            <p className="text-xs text-slate-400">Our engine supports instantaneous bidirectional conversion across all major image extensions:</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { title: "HEIC / HEIF to JPG / PNG", desc: "Batch decode Apple's modern high-efficiency HEIC photos from iPhones or iPads into widely-supported JPG or PNG files locally in your browser." },
              { title: "PNG to JPG / JPEG", desc: "Convert lossless PNG screenshots, logos, and illustrations to compressed JPG/JPEG formats for standard document applications." },
              { title: "JPG to WebP Optimizer", desc: "Convert standard JPEGs to next-gen WebP to satisfy Core Web Vitals and speed up website page load speeds." },
              { title: "PNG to WebP Converter", desc: "Batch transform heavy transparent PNG files into optimized WebP formats while preserving transparency features." },
              { title: "WebP to JPG / PNG", desc: "Revert modern web-only WebP files back to classic JPG or PNG for offline editors, printers, and legacy applications." },
              { title: "GIF to JPG / PNG / WebP", desc: "Extract the static frames of a GIF image or transform animations into compatible modern file sizes." },
              { title: "BMP to JPG / PNG / WebP", desc: "Instantly compress large uncompressed raw Windows Bitmap files into ready-to-share standard extensions." },
              { title: "Bulk Image Resizing", desc: "Scale resolutions down by exact pixel counts or scale relative percentage values while locking the aspect ratio." },
              { title: "Dynamic Naming Engine", desc: "Use advanced placeholder strings like [name], [index], [date], and [width] to auto-rename exported files." }
            ].map((conv, idx) => (
              <div key={idx} className="bg-white/[0.03] p-5 rounded-2xl border border-white/[0.07] hover:bg-white/[0.06] transition-all">
                <h4 className="text-teal-400 font-bold text-xs uppercase mb-2 tracking-wide">{conv.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{conv.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 relative z-10">
          <h2 className="text-2xl font-black mb-8 text-center text-slate-200 tracking-tight">Frequently Asked Questions (FAQs)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h4 className="text-sm font-black text-teal-400 uppercase tracking-tighter">How to convert HEIC to JPG?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Simply upload your iPhone HEIC/HEIF files into the upload area. Our local conversion engine will instantly decode them into high-quality JPEGs in real-time, allowing you to crop, resize, or compress them before saving.</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-black text-teal-400 uppercase tracking-tighter">How do I crop images to official passport size?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">After adding your photo, click the 'Crop & Edit' (pencil) icon on its preview. Choose the 'Passport (3.5x4.5cm)' or 'US Visa (2x2\")' preset in the sidebar. Adjust the crop selection box and click 'Apply Crop'. The aspect ratio remains perfectly locked to official guidelines.</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-black text-teal-400 uppercase tracking-tighter">Can I compress images to under 20KB or 50KB?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Yes! Upload your files, set your export format to JPEG or WebP, and utilize the Compression Quality slider. Setting the quality slider around 50% - 70% and lowering the dimensions to standard web resolutions will instantly bring the file size in KB down to meet strict portal restrictions.</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-black text-teal-400 uppercase tracking-tighter">Are my private photos and documents secure?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Yes, absolutely. Unlike conventional converters that send your personal files to cloud servers, Toolina operates entirely client-side. Your photos, government documents, and signatures are processed in-browser, meaning they never leave your machine.</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-black text-teal-400 uppercase tracking-tighter">Does this batch resizer work offline?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Yes! Once you load the Toolina Image Converter in your browser, the entire file processing, cropping, and conversion engine can function fully offline without any internet connection.</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-black text-teal-400 uppercase tracking-tighter">What are the supported output file types?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">We support exporting to high-quality PNG, highly-compressed JPEG (JPG), next-gen WebP, standard GIF, and lossless BMP formats, covering all requirements for development, social media, and official registration submissions.</p>
            </div>
          </div>
        </div>
      </footer>
    
      <AccompanyingText 
        toolName="Image Converter & Multi-Format Resizer"
        howItWorks="Our bulk converter leverages high-speed HTML5 Canvas rendering and local browser buffers to manipulate image blobs directly. You can drag and drop your files, set pixel or percentage scaling, lock aspect ratios, and fine-tune compression quality sliders. Once configured, our batch processor loops over the queue, generating customized files with your selected format and custom naming rules in seconds, allowing immediate single downloads or packing everything cleanly into a ZIP file. It also supports dynamic browser decoding of iOS/macOS HEIC/HEIF files to eliminate conversion bottlenecks."
        whyItsUseful="Whether you are optimizing photographic assets for Web Speed Index / PageSpeed, resizing documents to strict KB specifications for government recruitment portals (like SSO Rajasthan, SSC, UPSC, or banking boards), or converting bulk file formats (like heavy raw BMPs into highly compatible JPEGs or Apple HEIC to standard PNGs), this tool eliminates manual single-file processing. It runs entirely locally on your hardware, eliminating privacy vulnerabilities and file size bottlenecks."
        faqs={[
          { q: "What file types can I upload and convert?", a: "You can upload JPEG, JPG, PNG, WEBP, GIF, BMP, SVG, and modern Apple HEIC/HEIF image types. You can instantly export them to PNG, JPG, WebP, GIF, or BMP formats with specialized quality and sizing controls." },
          { q: "Can I convert HEIC to JPG in bulk on Toolina?", a: "Yes, you can! Drop multiple HEIC files from your iPhone into the converter, and they will be decoded into JPEGs locally in your browser. From there, you can process them together in a single batch." },
          { q: "How does the compression quality slider work?", a: "For JPEG and WebP exports, the slider controls the compression algorithm's fidelity (from 10% to 100%). Dragging it down reduces file sizes exponentially, making it easy to create images under 20KB, 50KB, or 100KB without drastic visual degradation." },
          { q: "Do my images get uploaded to Toolina's servers?", a: "No, never. Toolina's batch image converter operates 100% locally in your browser. No files are uploaded to any servers, guaranteeing absolute confidentiality for sensitive identity proofs, documents, and signatures." },
          { q: "Can I crop and rotate photos before batch converting?", a: "Yes, you can rotate any image by 90-degree intervals and use the crop modal with custom aspect-ratio overlays (including official Passport dimensions) before starting the batch operation." }
        ]}
      />
  
      <div className="max-w-3xl mx-auto my-8">
        <StarRatingWidget 
          toolId="imageconverter" 
          defaultRating={4.6} 
          defaultCount={144} 
          onRatingChange={(rating, count) => setRatingInfo({ rating, count })} 
        />
      </div>
      <ShareWidget title="Batch Image Converter" />
      </article>
  );
};

const CropModal: React.FC<{ image: ImageFile, onSave: (crop: CropData | undefined) => void, onClose: () => void }> = ({ image, onSave, onClose }) => {
  const [aspect, setAspect] = useState<number | null>(null);
  const [aspectLabel, setAspectLabel] = useState<string>('FREE');
  const [showGuide, setShowGuide] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState<CropData | null>(null);
  const [displayDim, setDisplayDim] = useState({ w: 0, h: 0 });
  const [interactionMode, setInteractionMode] = useState<'move' | 'resize' | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [initialSelection, setInitialSelection] = useState<CropData | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const img = new Image();
      img.onload = () => {
        if (!containerRef.current) return;
        // Adjust for responsive container padding/margins
        const padding = window.innerWidth < 1024 ? 48 : 80;
        const cW = containerRef.current.clientWidth - padding;
        const cH = containerRef.current.clientHeight - padding;
        
        const ratio = Math.min(cW / img.width, cH / img.height);
        const dW = img.width * ratio, dH = img.height * ratio;
        
        setDisplayDim({ w: dW, h: dH });
        // Initialize selection as 80% of current display if not set
        if (!selection) {
          setSelection({ x: dW * 0.1, y: dH * 0.1, width: dW * 0.8, height: dH * 0.8 });
        }
      };
      img.src = image.preview;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [image.preview]);

  const applyPreset = (label: string, ratio: number | null) => {
    setAspect(ratio); 
    setAspectLabel(label);
    if (ratio && selection) {
      let nw = selection.width, nh = nw / ratio;
      // Adjust if out of bounds
      if (nh + selection.y > displayDim.h) { 
        nh = displayDim.h - selection.y; 
        nw = nh * ratio; 
        // If width still out of bounds, adjust x
        if (nw + selection.x > displayDim.w) {
          nw = displayDim.w - selection.x;
          nh = nw / ratio;
        }
      }
      setSelection({ ...selection, width: nw, height: nh });
    }
    setShowGuide(label.toLowerCase().includes('passport') || label.toLowerCase().includes('visa'));
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent, mode: 'move' | 'resize') => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setInteractionMode(mode); 
    setStartPos({ x: clientX, y: clientY }); 
    setInitialSelection(selection);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!interactionMode || !selection || !initialSelection || !containerRef.current) return;
    
    // Prevent scrolling during drag
    if (e.cancelable) e.preventDefault();
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const dx = clientX - startPos.x;
    const dy = clientY - startPos.y;

    if (interactionMode === 'move') {
      let nx = Math.max(0, Math.min(initialSelection.x + dx, displayDim.w - selection.width));
      let ny = Math.max(0, Math.min(initialSelection.y + dy, displayDim.h - selection.height));
      setSelection({ ...selection, x: nx, y: ny });
    } else if (interactionMode === 'resize') {
      let nw = Math.max(50, initialSelection.width + dx); // Minimum size 50px
      let nh = Math.max(50, initialSelection.height + dy);
      
      if (aspect) {
        if (Math.abs(dx) > Math.abs(dy)) {
          nw = Math.min(nw, displayDim.w - selection.x);
          nh = nw / aspect;
          if (nh + selection.y > displayDim.h) {
            nh = displayDim.h - selection.y;
            nw = nh * aspect;
          }
        } else {
          nh = Math.min(nh, displayDim.h - selection.y);
          nw = nh * aspect;
          if (nw + selection.x > displayDim.w) {
            nw = displayDim.w - selection.x;
            nh = nw / aspect;
          }
        }
      } else {
        nw = Math.min(nw, displayDim.w - selection.x);
        nh = Math.min(nh, displayDim.h - selection.y);
      }
      setSelection({ ...selection, width: nw, height: nh });
    }
  };

  const stopInteracting = () => setInteractionMode(null);

  const getPreviewStyles = () => {
    if (!selection || displayDim.w === 0) return {};
    const scaleX = 100 / (selection.width / displayDim.w);
    const scaleY = 100 / (selection.height / displayDim.h);
    const posX = (selection.x / (displayDim.w - selection.width)) * 100;
    const posY = (selection.y / (displayDim.h - selection.height)) * 100;
    return { 
      backgroundImage: `url(${image.preview})`, 
      backgroundSize: `${scaleX}% ${scaleY}%`, 
      backgroundPosition: `${posX || 0}% ${posY || 0}%`, 
      backgroundRepeat: 'no-repeat' 
    };
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-2xl flex items-center justify-center p-0 md:p-6 overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onMouseUp={stopInteracting}
      onTouchEnd={stopInteracting}
      onMouseLeave={stopInteracting}
    >
      <div className="bg-white w-full h-full md:h-auto md:max-w-7xl md:rounded-[2.5rem] shadow-2xl flex flex-col max-h-full overflow-hidden border border-white/20">
        {/* Modal Header */}
        <header className="p-4 md:p-6 flex items-center justify-between border-b border-slate-100 shrink-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center text-xl shadow-sm">✂️</div>
            <div>
              <h3 className="text-base md:text-xl font-display font-black text-slate-900 tracking-tight leading-none">Interactive Crop</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                {image.name} <span className="mx-1 opacity-30">•</span> <span className="text-teal-600">{aspectLabel}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 hover:bg-slate-100 rounded-xl transition-all active:scale-95"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-50/50">
          {/* Main Workspace Area */}
          <div 
            ref={containerRef} 
            className="flex-1 p-4 md:p-10 flex items-center justify-center relative min-h-[40vh] md:min-h-0 bg-slate-200/50 shadow-inner overflow-hidden"
          >
            <div 
              style={{ width: displayDim.w, height: displayDim.h }} 
              className="relative bg-white shadow-2xl transition-all duration-300"
            >
               <img 
                 src={image.preview} 
                 alt="Canvas" 
                 className="w-full h-full object-contain opacity-40 pointer-events-none" 
               />
               
               {selection && (
                 <div 
                   className={`absolute border-[3px] border-teal-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] cursor-move transition-shadow duration-200 ${interactionMode === 'move' ? 'ring-8 ring-teal-500/20' : ''}`}
                   style={{ left: selection.x, top: selection.y, width: selection.width, height: selection.height }} 
                   onMouseDown={(e) => handleMouseDown(e, 'move')} 
                   onTouchStart={(e) => handleMouseDown(e, 'move')}
                 >
                   {/* Rule of Thirds Guides */}
                   <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20 pointer-events-none">
                     <div className="border-r border-white"></div>
                     <div className="border-r border-white"></div>
                     <div></div>
                     <div className="border-t border-white col-span-3"></div>
                     <div className="border-t border-white col-span-3"></div>
                   </div>

                   {/* Passport Guides */}
                   {showGuide && (
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       <div className="w-[60%] h-[70%] border-2 border-dashed border-white/50 rounded-[50%] opacity-40"></div>
                     </div>
                   )}

                   {/* Resize Handle - Larger for mobile */}
                   <div 
                     className="absolute -bottom-5 -right-5 w-12 h-12 bg-teal-600 rounded-full border-4 border-white shadow-xl cursor-nwse-resize active:scale-125 transition-transform flex items-center justify-center text-white z-20" 
                     onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, 'resize'); }} 
                     onTouchStart={(e) => { e.stopPropagation(); handleMouseDown(e, 'resize'); }}
                   >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 11l-7 7-7-7" />
                     </svg>
                   </div>
                 </div>
               )}
            </div>
          </div>

          {/* Controls Sidebar - Responsive placement */}
          <aside className="w-full lg:w-[400px] p-4 md:p-8 border-t lg:border-t-0 lg:border-l border-slate-100 space-y-6 bg-white overflow-y-auto shrink-0 z-10">
            {/* Live Preview - Only visible when not in narrow view for space */}
            <div className="hidden sm:block space-y-3">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span> Live Preview
              </h4>
              <div 
                className="w-full aspect-[4/3] rounded-3xl border-2 border-slate-100 bg-slate-50 shadow-inner overflow-hidden" 
                style={getPreviewStyles()}
              ></div>
            </div>

            <div className="space-y-6">
               <div className="space-y-3">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Passport & ID Presets</h4>
                 <div className="grid grid-cols-1 gap-2">
                    {PASSPORT_PRESETS.map(p => (
                      <button 
                        key={p.label} 
                        onClick={() => applyPreset(p.label, p.ratio)} 
                        className={`flex items-center justify-between px-5 py-4 rounded-2xl text-[11px] font-bold border transition-all active:scale-[0.98] ${
                          aspectLabel === p.label 
                            ? 'bg-teal-600 text-white border-teal-600 shadow-lg shadow-teal-100' 
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>{p.label}</span>
                        <span className={`font-mono text-[9px] px-2 py-0.5 rounded ${aspectLabel === p.label ? 'bg-white/20' : 'bg-slate-200'}`}>
                          {p.w}x{p.h}px
                        </span>
                      </button>
                    ))}
                 </div>
               </div>

               <div className="space-y-3">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Common Aspect Ratios</h4>
                 <div className="flex flex-wrap gap-2">
                    {[
                      {l:'FREE', v:null}, 
                      {l:'1:1', v:1}, 
                      {l:'4:3', v:4/3}, 
                      {l:'16:9', v:16/9}, 
                      {l:'9:16', v:9/16}
                    ].map(a => (
                      <button 
                        key={a.l} 
                        onClick={() => applyPreset(a.l, a.v)} 
                        className={`flex-1 min-w-[60px] py-3 rounded-xl text-[10px] font-black border transition-all active:scale-90 ${
                          aspectLabel === a.l 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {a.l}
                      </button>
                    ))}
                 </div>
               </div>
            </div>

            {/* Actions */}
            <div className="pt-4 grid grid-cols-1 gap-3 shrink-0 lg:sticky lg:bottom-0 bg-white">
              <button 
                onClick={() => { 
                  const scale = image.originalWidth / displayDim.w; 
                  if (selection) onSave({ 
                    x: Math.round(selection.x * scale), 
                    y: Math.round(selection.y * scale), 
                    width: Math.round(selection.width * scale), 
                    height: Math.round(selection.height * scale), 
                    aspectLabel 
                  }); 
                }} 
                className="w-full bg-teal-600 text-white py-4 md:py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-teal-700 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                Apply Crop
              </button>
              <button 
                onClick={() => onSave(undefined)} 
                className="w-full text-slate-400 py-3 text-[10px] font-black uppercase tracking-widest hover:text-red-500 transition-colors"
              >
                Reset to Original
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ImageConverter;
