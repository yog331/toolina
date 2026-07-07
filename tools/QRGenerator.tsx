import React, { useState, useEffect, useRef } from 'react';
import AccompanyingText from '../components/AccompanyingText';
import ShareWidget from '../components/ShareWidget';
import SEO from '../components/SEO';
import StarRatingWidget from '../components/StarRatingWidget';
import JSZip from 'jszip';
import { 
  Download, 
  Upload, 
  Search, 
  Trash2, 
  Settings2, 
  FileText, 
  FileDown, 
  RefreshCw,
  Sparkles,
  Link as LinkIcon,
  Wifi,
  Mail,
  Type,
  Layers,
  Check,
  AlertCircle
} from 'lucide-react';

// @ts-ignore
import _QRCode from 'qr.js/lib/QRCode';
// @ts-ignore
import _ErrorCorrectLevel from 'qr.js/lib/ErrorCorrectLevel';

function bytesToBinaryString(bytes: number[]) {
  return bytes.map(function (b) {
    return String.fromCharCode(b & 0xff);
  }).join("");
}

function encodeStringToUtf8Bytes(input: string) {
  return Array.from(new TextEncoder().encode(input));
}

interface CustomQRCodeProps {
  id?: string;
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  bgColor?: string;
  fgColor?: string;
  className?: string;
  moduleStyle?: 'square' | 'dot' | 'rounded' | 'diamond' | 'star';
  eyeStyle?: 'square' | 'rounded' | 'circle' | 'leaf';
}

const CustomQRCode: React.FC<CustomQRCodeProps> = ({
  id,
  value,
  size = 256,
  level = 'Q',
  bgColor = '#ffffff',
  fgColor = '#000000',
  className,
  moduleStyle = 'square',
  eyeStyle = 'square'
}) => {
  const qrcode = new _QRCode(-1, _ErrorCorrectLevel[level]);
  const utf8Bytes = encodeStringToUtf8Bytes(value);
  const binaryString = bytesToBinaryString(utf8Bytes);
  qrcode.addData(binaryString, "Byte");
  qrcode.make();
  const cells: boolean[][] = qrcode.modules;
  const numCells = cells.length;

  const isFinderPattern = (row: number, col: number): boolean => {
    // Top-left
    if (row < 7 && col < 7) return true;
    // Top-right
    if (row < 7 && col >= numCells - 7) return true;
    // Bottom-left
    if (row >= numCells - 7 && col < 7) return true;
    return false;
  };

  const renderEye = (x: number, y: number, position: 'tl' | 'tr' | 'bl') => {
    switch (eyeStyle) {
      case 'rounded':
        return (
          <g key={`${x}-${y}`}>
            <rect x={x} y={y} width={7} height={7} rx={1.8} fill={fgColor} />
            <rect x={x + 1} y={y + 1} width={5} height={5} rx={1.0} fill={bgColor} />
            <rect x={x + 2} y={y + 2} width={3} height={3} rx={0.6} fill={fgColor} />
          </g>
        );
      case 'circle':
        return (
          <g key={`${x}-${y}`}>
            <circle cx={x + 3.5} cy={y + 3.5} r={3.5} fill={fgColor} />
            <circle cx={x + 3.5} cy={y + 3.5} r={2.5} fill={bgColor} />
            <circle cx={x + 3.5} cy={y + 3.5} r={1.5} fill={fgColor} />
          </g>
        );
      case 'leaf': {
        const outerPath = position === 'tl' 
          ? `M ${x+3.5} ${y} A 3.5 3.5 0 0 1 ${x+7} ${y+3.5} L ${x+7} ${y+7} A 3.5 3.5 0 0 1 ${x+3.5} ${y+7} A 3.5 3.5 0 0 1 ${x} ${y+3.5} L ${x} ${y} Z`
          : position === 'tr'
          ? `M ${x} ${y} L ${x+3.5} ${y} A 3.5 3.5 0 0 1 ${x+7} ${y+3.5} A 3.5 3.5 0 0 1 ${x+3.5} ${y+7} L ${x} ${y+7} A 3.5 3.5 0 0 1 ${x} ${y+3.5} Z`
          : `M ${x} ${y+3.5} A 3.5 3.5 0 0 1 ${x+3.5} ${y} L ${x+7} ${y} L ${x+7} ${y+3.5} A 3.5 3.5 0 0 1 ${x+3.5} ${y+7} A 3.5 3.5 0 0 1 ${x} ${y+3.5} Z`;

        const innerPath = position === 'tl'
          ? `M ${x+3.5} ${y+1} A 2.5 2.5 0 0 1 ${x+6} ${y+3.5} L ${x+6} ${y+6} A 2.5 2.5 0 0 1 ${x+3.5} ${y+6} A 2.5 2.5 0 0 1 ${x+1} ${y+3.5} L ${x+1} ${y+1} Z`
          : position === 'tr'
          ? `M ${x+1} ${y+1} L ${x+3.5} ${y+1} A 2.5 2.5 0 0 1 ${x+6} ${y+3.5} A 2.5 2.5 0 0 1 ${x+3.5} ${y+6} L ${x+1} ${y+6} A 2.5 2.5 0 0 1 ${x+1} ${y+3.5} Z`
          : `M ${x+1} ${y+3.5} A 2.5 2.5 0 0 1 ${x+3.5} ${y+1} L ${x+6} ${y+1} L ${x+6} ${y+3.5} A 2.5 2.5 0 0 1 ${x+3.5} ${y+6} A 2.5 2.5 0 0 1 ${x+1} ${y+3.5} Z`;

        return (
          <g key={`${x}-${y}`}>
            <path d={outerPath} fill={fgColor} />
            <path d={innerPath} fill={bgColor} fillRule="evenodd" />
            <rect x={x + 2} y={y + 2} width={3} height={3} rx={1.2} fill={fgColor} />
          </g>
        );
      }
      case 'square':
      default:
        return (
          <g key={`${x}-${y}`}>
            <rect x={x} y={y} width={7} height={7} fill={fgColor} />
            <rect x={x + 1} y={y + 1} width={5} height={5} fill={bgColor} />
            <rect x={x + 2} y={y + 2} width={3} height={3} fill={fgColor} />
          </g>
        );
    }
  };

  const renderModule = (row: number, col: number) => {
    switch (moduleStyle) {
      case 'dot':
        return <circle key={`${row}-${col}`} cx={col + 0.5} cy={row + 0.5} r={0.38} fill={fgColor} />;
      case 'rounded':
        return <rect key={`${row}-${col}`} x={col + 0.08} y={row + 0.08} width={0.84} height={0.84} rx={0.3} ry={0.3} fill={fgColor} />;
      case 'diamond':
        return (
          <path
            key={`${row}-${col}`}
            d={`M ${col + 0.5} ${row + 0.05} L ${col + 0.95} ${row + 0.5} L ${col + 0.5} ${row + 0.95} L ${col + 0.05} ${row + 0.5} Z`}
            fill={fgColor}
          />
        );
      case 'star':
        return (
          <path
            key={`${row}-${col}`}
            d={`M ${col + 0.5} ${row + 0.1} Q ${col + 0.5} ${row + 0.5} ${col + 0.9} ${row + 0.5} Q ${col + 0.5} ${row + 0.5} ${col + 0.5} ${row + 0.9} Q ${col + 0.5} ${row + 0.5} ${col + 0.1} ${row + 0.5} Q ${col + 0.5} ${row + 0.5} ${col + 0.5} ${row + 0.1} Z`}
            fill={fgColor}
          />
        );
      case 'square':
      default:
        return <rect key={`${row}-${col}`} x={col} y={row} width={1} height={1} fill={fgColor} />;
    }
  };

  return (
    <svg
      id={id}
      viewBox={`0 0 ${numCells} ${numCells}`}
      className={className}
      style={{ width: size, height: size }}
    >
      <rect width={numCells} height={numCells} fill={bgColor} />
      
      {/* Draw regular modules */}
      {cells.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (!cell || isFinderPattern(rowIndex, colIndex)) return null;
          return renderModule(rowIndex, colIndex);
        })
      )}

      {/* Draw the 3 static finder patterns */}
      {renderEye(0, 0, 'tl')}
      {renderEye(numCells - 7, 0, 'tr')}
      {renderEye(0, numCells - 7, 'bl')}
    </svg>
  );
};

const COLOR_PRESETS = [
  { name: 'Classic', fg: '#000000', bg: '#ffffff' },
  { name: 'Teal Elegance', fg: '#0d9488', bg: '#f0fdfa' },
  { name: 'Royal Sapphire', fg: '#1d4ed8', bg: '#eff6ff' },
  { name: 'Sunset Burst', fg: '#ea580c', bg: '#fff7ed' },
  { name: 'Forest Moss', fg: '#15803d', bg: '#f0fdf4' },
  { name: 'Crimson Slate', fg: '#be123c', bg: '#fff1f2' },
  { name: 'Deep Violet', fg: '#6d28d9', bg: '#f5f3ff' },
  { name: 'Midnight Neon', fg: '#06b6d4', bg: '#0f172a' }
];

type QRType = 'URL' | 'Text' | 'WiFi' | 'Email';
type Mode = 'single' | 'bulk';

export const QRGenerator: React.FC = () => {
  const [ratingInfo, setRatingInfo] = useState<{rating: number, count: number}>({ rating: 5.0, count: 125 });
  const [mode, setMode] = useState<Mode>('single');

  // Styling States
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrLevel, setQrLevel] = useState<'L' | 'M' | 'Q' | 'H'>('Q');
  const [selectedPreset, setSelectedPreset] = useState('Classic');
  const [moduleStyle, setModuleStyle] = useState<'square' | 'dot' | 'rounded' | 'diamond' | 'star'>('square');
  const [eyeStyle, setEyeStyle] = useState<'square' | 'rounded' | 'circle' | 'leaf'>('square');

  const handlePresetSelect = (presetName: string, fg: string, bg: string) => {
    setSelectedPreset(presetName);
    setFgColor(fg);
    setBgColor(bg);
  };

  const handleFgColorChange = (color: string) => {
    setFgColor(color);
    setSelectedPreset('Custom');
  };

  const handleBgColorChange = (color: string) => {
    setBgColor(color);
    setSelectedPreset('Custom');
  };

  const renderStylePanel = () => (
    <div className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-inner space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Settings2 className="w-3.5 h-3.5 text-teal-650" /> QR Code Style Settings
        </h2>
        <span className="text-[10px] px-2.5 py-0.5 bg-teal-100 text-teal-800 font-extrabold rounded-full uppercase tracking-wider">
          {selectedPreset}
        </span>
      </div>

      {/* Preset Themes Grid */}
      <div className="space-y-3">
        <span className="block text-xs font-bold text-slate-705">Quick Style Presets</span>
        <div className="grid grid-cols-4 gap-2">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handlePresetSelect(preset.name, preset.fg, preset.bg)}
              className={`p-2 rounded-xl border text-center transition-all hover:scale-105 flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                selectedPreset === preset.name
                  ? 'border-teal-500 ring-2 ring-teal-500/20 bg-white shadow-xs font-black'
                  : 'border-slate-200 bg-white hover:border-slate-350'
              }`}
            >
              <div className="flex w-6 h-6 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                <div className="w-1/2 h-full" style={{ backgroundColor: preset.fg }}></div>
                <div className="w-1/2 h-full" style={{ backgroundColor: preset.bg }}></div>
              </div>
              <span className="text-[9px] font-extrabold text-slate-600 truncate max-w-full">
                {preset.name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Module Style Selection Grid */}
      <div className="pt-2 border-t border-slate-200/50 space-y-3">
        <div className="flex justify-between items-center">
          <span className="block text-xs font-bold text-slate-705">Module Design Shape</span>
          <span className="text-[10px] px-2 py-0.5 bg-slate-200/60 text-slate-700 font-black rounded-lg uppercase tracking-wider text-right">
            {moduleStyle}
          </span>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {[
            { key: 'square', label: 'Classic', desc: 'Square' },
            { key: 'dot', label: 'Sphere', desc: 'Dots' },
            { key: 'rounded', label: 'Pill', desc: 'Capsules' },
            { key: 'diamond', label: 'Crystal', desc: 'Diamonds' },
            { key: 'star', label: 'Sleek', desc: 'Stars' }
          ].map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setModuleStyle(opt.key as any)}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                moduleStyle === opt.key
                  ? 'bg-slate-900 border-slate-900 text-white font-extrabold shadow-sm scale-102'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350 hover:bg-slate-50'
              }`}
              title={opt.desc}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                {opt.key === 'square' && <div className={`w-3 h-3 ${moduleStyle === opt.key ? 'bg-white' : 'bg-slate-800'}`} />}
                {opt.key === 'dot' && <div className={`w-3 h-3 rounded-full ${moduleStyle === opt.key ? 'bg-white' : 'bg-slate-800'}`} />}
                {opt.key === 'rounded' && <div className={`w-3 h-2 rounded-[3px] ${moduleStyle === opt.key ? 'bg-white' : 'bg-slate-800'}`} />}
                {opt.key === 'diamond' && <div className={`w-2.5 h-2.5 rotate-45 ${moduleStyle === opt.key ? 'bg-white' : 'bg-slate-800'}`} />}
                {opt.key === 'star' && (
                  <svg className={`w-3.5 h-3.5 ${moduleStyle === opt.key ? 'fill-white' : 'fill-slate-800'}`} viewBox="0 0 24 24">
                    <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
                  </svg>
                )}
              </div>
              <span className="text-[9px] font-extrabold block truncate max-w-full">
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Corner Eyes Style Selection Grid */}
      <div className="pt-2 border-t border-slate-200/50 space-y-3">
        <div className="flex justify-between items-center">
          <span className="block text-xs font-bold text-slate-705">Corner Eyes Shape</span>
          <span className="text-[10px] px-2 py-0.5 bg-slate-200/60 text-slate-700 font-black rounded-lg uppercase tracking-wider text-right">
            {eyeStyle}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { key: 'square', label: 'Square', desc: 'Traditional squares' },
            { key: 'rounded', label: 'Rounded', desc: 'Smooth corners' },
            { key: 'circle', label: 'Circle', desc: 'Sleek circles' },
            { key: 'leaf', label: 'Leaf', desc: 'Eco/Futuristic' }
          ].map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setEyeStyle(opt.key as any)}
              className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                eyeStyle === opt.key
                  ? 'bg-slate-900 border-slate-900 text-white font-extrabold shadow-sm scale-102'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350 hover:bg-slate-50'
              }`}
              title={opt.desc}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                {opt.key === 'square' && (
                  <div className={`w-3.5 h-3.5 border-1.5 ${eyeStyle === opt.key ? 'border-white' : 'border-slate-800'} flex items-center justify-center`}>
                    <div className={`w-1.5 h-1.5 ${eyeStyle === opt.key ? 'bg-white' : 'bg-slate-800'}`} />
                  </div>
                )}
                {opt.key === 'rounded' && (
                  <div className={`w-3.5 h-3.5 border-1.5 rounded-[3px] ${eyeStyle === opt.key ? 'border-white' : 'border-slate-800'} flex items-center justify-center`}>
                    <div className={`w-1.5 h-1.5 rounded-[1px] ${eyeStyle === opt.key ? 'bg-white' : 'bg-slate-800'}`} />
                  </div>
                )}
                {opt.key === 'circle' && (
                  <div className={`w-3.5 h-3.5 border-1.5 rounded-full ${eyeStyle === opt.key ? 'border-white' : 'border-slate-800'} flex items-center justify-center`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${eyeStyle === opt.key ? 'bg-white' : 'bg-slate-800'}`} />
                  </div>
                )}
                {opt.key === 'leaf' && (
                  <div className={`w-3.5 h-3.5 border-1.5 rounded-tl-[10px] rounded-br-[10px] ${eyeStyle === opt.key ? 'border-white' : 'border-slate-800'} flex items-center justify-center`}>
                    <div className={`w-1.5 h-1.5 rounded-tl-[4px] rounded-br-[4px] ${eyeStyle === opt.key ? 'bg-white' : 'bg-slate-800'}`} />
                  </div>
                )}
              </div>
              <span className="text-[9px] font-extrabold block truncate max-w-full">
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Color Customizers (Pickers) */}
      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/50">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Foreground Color</label>
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 border border-slate-200 rounded-xl">
            <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-slate-200 shrink-0">
              <input 
                type="color" 
                value={fgColor}
                onChange={(e) => handleFgColorChange(e.target.value)}
                className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
              />
            </div>
            <input 
              type="text" 
              value={fgColor.toUpperCase()}
              onChange={(e) => handleFgColorChange(e.target.value)}
              className="w-full bg-transparent outline-none text-xs font-mono font-black text-slate-700 uppercase"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Background Color</label>
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 border border-slate-200 rounded-xl">
            <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-slate-100 shrink-0">
              <input 
                type="color" 
                value={bgColor}
                onChange={(e) => handleBgColorChange(e.target.value)}
                className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
              />
            </div>
            <input 
              type="text" 
              value={bgColor.toUpperCase()}
              onChange={(e) => handleBgColorChange(e.target.value)}
              className="w-full bg-transparent outline-none text-xs font-mono font-black text-slate-700 uppercase"
            />
          </div>
        </div>
      </div>

      {/* Error Correction Level */}
      <div className="pt-2 border-t border-slate-200/50 space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-xs font-bold text-slate-700">Error Correction Robustness</label>
          <span className="text-[10px] font-black text-slate-400 uppercase">{qrLevel}-Level</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { key: 'L', label: 'Low (~7%)', desc: 'Fastest scan, light pattern' },
            { key: 'M', label: 'Medium (~15%)', desc: 'Standard balance' },
            { key: 'Q', label: 'Quartile (~25%)', desc: 'Heavy protection' },
            { key: 'H', label: 'High (~30%)', desc: 'Max durability' }
          ].map((levelOption) => (
            <button
              key={levelOption.key}
              type="button"
              onClick={() => setQrLevel(levelOption.key as 'L' | 'M' | 'Q' | 'H')}
              className={`py-2 rounded-xl border text-center transition-all cursor-pointer ${
                qrLevel === levelOption.key
                  ? 'bg-slate-900 border-slate-900 text-white font-extrabold shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350 hover:bg-slate-50'
              }`}
              title={levelOption.desc}
            >
              <span className="text-[10px] block font-black">{levelOption.key}</span>
              <span className="text-[8px] block opacity-80 mt-0.5 truncate">{levelOption.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Single QR Code States
  const [activeType, setActiveType] = useState<QRType>('URL');
  const [inputValue, setInputValue] = useState('https://toolina.in');
  const [wifiData, setWifiData] = useState({ ssid: '', pass: '', enc: 'WPA' });
  const [emailData, setEmailData] = useState({ address: '', subject: '' });
  const [singleFormat, setSingleFormat] = useState<'png' | 'svg'>('png');
  const [singleSize, setSingleSize] = useState<number>(512);

  // Bulk QR Code States
  const [bulkInput, setBulkInput] = useState('https://toolina.in\nhttps://google.com\nhttps://github.com');
  const [bulkSeparator, setBulkSeparator] = useState<'newline' | 'comma' | 'semicolon'>('newline');
  const [bulkPrefix, setBulkPrefix] = useState('');
  const [bulkSuffix, setBulkSuffix] = useState('');
  const [bulkSize, setBulkSize] = useState<number>(512);
  const [bulkFormat, setBulkFormat] = useState<'png' | 'svg'>('png');
  const [bulkSearch, setBulkSearch] = useState('');
  const [visibleLimit, setVisibleLimit] = useState(24);
  const [dragActive, setDragActive] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic SEO Metadata Injection
  useEffect(() => {
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", "Generate high-quality, professional QR codes in bulk. Offline, private, secure, and zero tracking. Feed lists or CSV documents to export complete ZIP batches instantly.");

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute("content", "bulk qr code generator, batch qr creator, free offline qr maker, secure zip qr export, client-side bulk qr generator, wifi url csv qr, Toolina");
  }, []);

  const getFormattedData = () => {
    switch (activeType) {
      case 'WiFi':
        return `WIFI:T:${wifiData.enc};S:${wifiData.ssid};P:${wifiData.pass};;`;
      case 'Email':
        return `mailto:${emailData.address}?subject=${encodeURIComponent(emailData.subject)}`;
      case 'URL':
        return inputValue.startsWith('http') || inputValue.startsWith('mailto') ? inputValue : `https://${inputValue}`;
      default:
        return inputValue;
    }
  };

  // SVG to PNG dynamic Canvas transformation
  const svgToPng = (svgElement: SVGSVGElement, size = 512): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      try {
        const svgString = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.width = size;
        image.height = size;
        
        image.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const context = canvas.getContext('2d');
            if (context) {
              context.fillStyle = bgColor;
              context.fillRect(0, 0, size, size);
              // Draw image styled cleanly inside margins
              const margin = Math.round(size * 0.05);
              const qrSize = size - (margin * 2);
              context.drawImage(image, margin, margin, qrSize, qrSize);
              
              canvas.toBlob((blob) => {
                if (blob) {
                  resolve(blob);
                } else {
                  reject(new Error('Canvas to Blob conversion failed'));
                }
                URL.revokeObjectURL(url);
              }, 'image/png');
            } else {
              reject(new Error('Canvas 2D context not available'));
              URL.revokeObjectURL(url);
            }
          } catch (e) {
            reject(e);
            URL.revokeObjectURL(url);
          }
        };
        image.onerror = (err) => {
          reject(err);
          URL.revokeObjectURL(url);
        };
        image.src = url;
      } catch (e) {
        reject(e);
      }
    });
  };

  // Download Single QR Code
  const downloadSingleQR = async () => {
    const element = document.getElementById('single-qr-svg');
    if (!element) return;
    const svgElement = element as unknown as SVGSVGElement;

    if (singleFormat === 'svg') {
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = window.URL.createObjectURL(svgBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Toolina_QR_${activeType}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      try {
        const pngBlob = await svgToPng(svgElement, singleSize);
        const url = window.URL.createObjectURL(pngBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Toolina_QR_${activeType}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Download failed', err);
      }
    }
  };

  // Bulk processing helpers
  const getBulkItems = () => {
    let items: string[] = [];
    if (bulkSeparator === 'newline') {
      items = bulkInput.split('\n');
    } else if (bulkSeparator === 'comma') {
      items = bulkInput.split(',');
    } else {
      items = bulkInput.split(';');
    }
    return items
      .map(item => item.trim())
      .filter(item => item.length > 0);
  };

  const applyPrefixSuffix = (text: string) => {
    return `${bulkPrefix}${text}${bulkSuffix}`;
  };

  const sanitizeFilename = (text: string, index: number) => {
    let safe = text.replace(/[^a-zA-Z0-9-_]/g, '_');
    if (safe.length > 40) {
      safe = safe.substring(0, 40);
    }
    return `${String(index + 1).padStart(3, '0')}_${safe || 'qr'}`;
  };

  // Download Bulk ZIP
  const downloadBulkZIP = async () => {
    const items = getBulkItems();
    if (items.length === 0) return;
    
    setIsZipping(true);
    setZipProgress(0);

    try {
      const zip = new JSZip();
      const folder = zip.folder("toolina-bulk-qrcodes");

      // Give rendering engine 150ms to settle
      await new Promise(resolve => setTimeout(resolve, 150));

      for (let i = 0; i < items.length; i++) {
        const element = document.getElementById(`bulk-qr-svg-${i}`);
        if (element) {
          const svgElement = element as unknown as SVGSVGElement;
          const label = applyPrefixSuffix(items[i]);

          if (bulkFormat === 'svg') {
            const svgString = new XMLSerializer().serializeToString(svgElement);
            folder?.file(`${sanitizeFilename(items[i], i)}.svg`, svgString);
          } else {
            const pngBlob = await svgToPng(svgElement, bulkSize);
            folder?.file(`${sanitizeFilename(items[i], i)}.png`, pngBlob);
          }
        }
        setZipProgress(Math.round(((i + 1) / items.length) * 100));
        // Yield to browser execution loop occasionally to prevent UI lockup on massive batch compiles
        if (i % 20 === 0) {
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }

      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Toolina_Bulk_QR_Codes_${items.length}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("ZIP Generation error", err);
    } finally {
      setIsZipping(false);
      setZipProgress(0);
    }
  };

  // Download individual item from the bulk preview grid
  const downloadIndividualBulkItem = async (index: number, rawText: string) => {
    const element = document.getElementById(`bulk-qr-svg-${index}`);
    if (!element) return;
    const svgElement = element as unknown as SVGSVGElement;

    if (bulkFormat === 'svg') {
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = window.URL.createObjectURL(svgBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${sanitizeFilename(rawText, index)}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      try {
        const pngBlob = await svgToPng(svgElement, bulkSize);
        const url = window.URL.createObjectURL(pngBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${sanitizeFilename(rawText, index)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setBulkInput(text);
      }
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setBulkInput(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const bulkItems = getBulkItems();
  const filteredBulkItems = bulkItems
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.toLowerCase().includes(bulkSearch.toLowerCase()));

  return (
    <article className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <SEO 
        title="Free QR Code & Bulk QR Generator - Fast, Private & Professional | Toolina" 
        description="Free offline QR Code generator with support for standard generation and batch bulk QR creation with instant ZIP downloads." 
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Free Bulk QR Code Generator - Fast, Private & Professional",
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
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-bl-[10rem] -mr-16 -mt-16 opacity-50 blur-3xl"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-teal-600 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center text-3xl md:text-4xl shadow-xl shadow-teal-100 text-white shrink-0">
              📱
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
                QR Code <span className="text-teal-600">Generator</span>
              </h1>
              <p className="text-slate-500 font-medium text-xs md:text-lg mt-1 italic">Professional Digital Markers & Bulk Batch Engine</p>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 w-full lg:w-auto">
            <button
              onClick={() => setMode('single')}
              className={`flex-1 lg:px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                mode === 'single' 
                  ? 'bg-white shadow-sm text-teal-600 font-extrabold' 
                  : 'text-slate-500 hover:text-teal-600'
              }`}
            >
              <Type className="w-4 h-4" />
              Single QR
            </button>
            <button
              onClick={() => setMode('bulk')}
              className={`flex-1 lg:px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 relative ${
                mode === 'bulk' 
                  ? 'bg-white shadow-sm text-teal-600 font-extrabold' 
                  : 'text-slate-500 hover:text-teal-600'
              }`}
            >
              <Layers className="w-4 h-4" />
              Bulk Batch Generator
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black animate-pulse">
                PRO
              </span>
            </button>
          </div>
        </div>

        {/* MODE: SINGLE QR GENERATOR */}
        {mode === 'single' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start active-tab-animation animate-in fade-in duration-500">
            {/* Column 1: Input Code & Category Custom Fields */}
            <div className="lg:col-span-4 space-y-6 flex flex-col justify-start">
              <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl">
                {(['URL', 'Text', 'WiFi', 'Email'] as QRType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      setActiveType(type);
                      if (type === 'URL') {
                        setInputValue('https://toolina.in');
                      } else if (type === 'Text') {
                        setInputValue('Write a custom note here...');
                      }
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeType === type 
                        ? 'bg-white text-slate-800 shadow-sm font-extrabold' 
                        : 'text-slate-400 hover:text-slate-800'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-inner space-y-6">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span> Custom Fields
                </h2>
                
                {activeType === 'URL' && (
                  <div className="animate-in slide-in-from-left-2 duration-300">
                    <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">Destination URL</label>
                    <input 
                      type="text" 
                      placeholder="Enter website address (e.g. toolina.in)"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-teal-50 transition-all font-medium text-slate-800"
                    />
                  </div>
                )}

                {activeType === 'Text' && (
                  <div className="animate-in slide-in-from-left-2 duration-300">
                    <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">Embedded Message</label>
                    <textarea 
                      rows={4}
                      placeholder="Type your secure message or note..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-teal-50 transition-all font-medium text-slate-800 resize-none"
                    />
                  </div>
                )}

                {activeType === 'WiFi' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-left-2 duration-300">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">Network Name (SSID)</label>
                      <input 
                        type="text" 
                        placeholder="Your Home WiFi"
                        value={wifiData.ssid}
                        onChange={(e) => setWifiData({...wifiData, ssid: e.target.value})}
                        className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-teal-50 text-slate-800 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        value={wifiData.pass}
                        onChange={(e) => setWifiData({...wifiData, pass: e.target.value})}
                        className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-teal-50 text-slate-800 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">Security Type</label>
                      <select 
                        value={wifiData.enc}
                        onChange={(e) => setWifiData({...wifiData, enc: e.target.value})}
                        className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-teal-50 text-xs font-bold text-slate-700"
                      >
                        <option value="WPA">WPA/WPA2</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">None (Open)</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeType === 'Email' && (
                  <div className="space-y-4 animate-in slide-in-from-left-2 duration-300">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">Recipient Email</label>
                      <input 
                        type="email" 
                        placeholder="hello@example.com"
                        value={emailData.address}
                        onChange={(e) => setEmailData({...emailData, address: e.target.value})}
                        className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-teal-50 text-slate-800 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">Default Subject</label>
                      <input 
                        type="text" 
                        placeholder="Quick Inquiry"
                        value={emailData.subject}
                        onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                        className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-teal-50 text-slate-800 font-medium"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Column 2: Style Customization */}
            <div className="lg:col-span-4 space-y-6">
              {renderStylePanel()}
            </div>

            {/* Column 3: Live Preview & Action panel */}
            <div className="lg:col-span-4 space-y-6 flex flex-col justify-start lg:sticky lg:top-6">
              <div className="flex flex-col items-center justify-center">
                <div className="relative group w-full flex justify-center">
                  <div className="absolute -inset-6 bg-teal-500/10 rounded-[4rem] blur-2xl group-hover:bg-teal-500/20 transition-all duration-700"></div>
                  <div 
                    className="relative p-8 rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden min-w-[280px] min-h-[280px] md:min-w-[320px] md:min-h-[320px] flex items-center justify-center transition-all duration-300 w-full"
                    style={{ backgroundColor: bgColor }}
                  >
                    <div className="relative z-10 p-2 rounded-2xl transition-all duration-300" style={{ backgroundColor: bgColor }}>
                      <CustomQRCode 
                        id="single-qr-svg"
                        value={getFormattedData()}
                        size={256}
                        level={qrLevel}
                        bgColor={bgColor}
                        fgColor={fgColor}
                        moduleStyle={moduleStyle}
                        eyeStyle={eyeStyle}
                        className="w-56 h-56 md:w-64 md:h-64 object-contain mx-auto"
                      />
                      {/* Scan Line Animation */}
                      <div className="absolute left-0 top-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent shadow-[0_0_20px_rgba(20,184,166,0.6)] animate-scan"></div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-col items-center text-center">
                  <span className="text-[10px] font-black text-slate-350 uppercase tracking-[0.3em] mb-1.5 animate-pulse">100% Client-Side Rendered</span>
                  <p className="text-[11px] text-slate-400 font-medium max-w-[280px]">Scan with your mobile camera to test standard functionality.</p>
                </div>
              </div>

              {/* Format & Sizing configs nested beneath preview for super compact & visual layout */}
              <div className="bg-slate-50/70 p-5 rounded-3xl border border-slate-100/50 space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  📁 Export Settings & Downloads
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Image Format</label>
                    <select 
                      value={singleFormat}
                      onChange={(e) => setSingleFormat(e.target.value as 'png' | 'svg')}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none text-xs font-bold text-slate-700 cursor-pointer"
                    >
                      <option value="png">PNG (Raster)</option>
                      <option value="svg">SVG (Vector)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Target Size</label>
                    <select 
                      value={singleSize}
                      onChange={(e) => setSingleSize(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none text-xs font-bold text-slate-700 cursor-pointer"
                    >
                      <option value={256}>256 x 256 px</option>
                      <option value={512}>512 x 512 px</option>
                      <option value={1024}>1024 x 1024 px</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={downloadSingleQR}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-black transition-all shadow-md active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  Download {singleFormat.toUpperCase()} Code
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* MODE: BULK BATCH GENERATOR */
          <div className="space-y-12 active-tab-animation">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-500">
              {/* Column 1: Batch Data Source Input */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-inner space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-2 h-2 bg-teal-500 rounded-full animate-ping"></span> Data Feed Source
                    </h2>
                    <span className="text-[11px] font-bold text-slate-400 font-mono">
                      {bulkItems.length} lines detected
                    </span>
                  </div>

                  {/* Drag and Drop Box */}
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all ${
                      dragActive 
                        ? 'border-teal-500 bg-teal-50/50' 
                        : 'border-slate-200 hover:border-teal-400 bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-600">
                      Drag & Drop .csv / .txt list file
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Or click here to browse machine directories
                    </p>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".txt,.csv"
                      className="hidden" 
                    />
                  </div>

                  {/* Raw Text Input Area */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 ml-1">
                      Enter Lines (One QR code details per line)
                    </label>
                    <textarea 
                      rows={6}
                      placeholder="https://example1.com&#10;https://example2.com&#10;wifi-room-103&#10;Code12345"
                      value={bulkInput}
                      onChange={(e) => setBulkInput(e.target.value)}
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-teal-50 transition-all font-mono text-xs text-slate-800 leading-relaxed resize-none"
                    />
                  </div>

                  {/* Separators and prefix configs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/60">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Separator Delimiter</label>
                      <select 
                        value={bulkSeparator}
                        onChange={(e) => setBulkSeparator(e.target.value as 'newline' | 'comma' | 'semicolon')}
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none text-xs text-slate-705 font-bold cursor-pointer"
                      >
                        <option value="newline">Line Break (Default)</option>
                        <option value="comma">Comma (,)</option>
                        <option value="semicolon">Semicolon (;)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Constant Prefix (Optional)</label>
                      <input 
                        type="text"
                        placeholder="https://"
                        value={bulkPrefix}
                        onChange={(e) => setBulkPrefix(e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none text-xs text-slate-850"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Constant Suffix (Optional)</label>
                      <input 
                        type="text"
                        placeholder="?ref=qr"
                        value={bulkSuffix}
                        onChange={(e) => setBulkSuffix(e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none text-xs text-slate-850"
                      />
                    </div>

                    <div className="flex flex-col justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setBulkInput('');
                          setBulkPrefix('');
                          setBulkSuffix('');
                        }}
                        className="w-full px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100/60 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        Clear Configuration
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2: Bulk Style Settings */}
              <div className="lg:col-span-4 space-y-6">
                {renderStylePanel()}
              </div>

              {/* Column 3: Zip Downloader and Format Configs */}
              <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
                <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-10 space-y-6 relative overflow-hidden shadow-2xl shadow-slate-950/20">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-teal-500/20 to-transparent rounded-full blur-3xl"></div>
                  
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400 flex items-center gap-2">
                      <Sparkles className="w-3 h-3 fill-teal-400" /> Executive Batch Compiler
                    </span>
                    <h3 className="text-3xl font-display font-black tracking-tight text-white mt-2">
                      Ready to Build List
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-slate-450">Total QR Codes</p>
                      <p className="text-2xl font-black text-white mt-1 font-mono">{bulkItems.length}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-slate-450">Delivery Package</p>
                      <p className="text-2xl font-black text-teal-300 mt-1 uppercase font-mono">{bulkFormat}</p>
                    </div>
                  </div>

                  {/* Format Selection & PNG Sizing inside Compiler Settings */}
                  <div className="space-y-4 pt-4 border-t border-white/10 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Download Format</label>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={() => setBulkFormat('png')}
                            className={`py-1.5 rounded-lg text-[9px] font-black uppercase text-center border transition-all cursor-pointer ${
                              bulkFormat === 'png' 
                                ? 'bg-teal-500 border-teal-500 text-slate-950 font-black' 
                                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                            }`}
                          >
                            PNG
                          </button>
                          <button
                            type="button"
                            onClick={() => setBulkFormat('svg')}
                            className={`py-1.5 rounded-lg text-[9px] font-black uppercase text-center border transition-all cursor-pointer ${
                              bulkFormat === 'svg'
                                ? 'bg-teal-500 border-teal-500 text-slate-950 font-black' 
                                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                            }`}
                          >
                            SVG
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Target PNG Size</label>
                        <select
                          value={bulkSize}
                          onChange={(e) => setBulkSize(Number(e.target.value))}
                          className="w-full px-2 py-1.5 bg-white/5 border border-white/10 text-white rounded-lg outline-none text-[10px] font-bold cursor-pointer"
                          disabled={bulkFormat === 'svg'}
                        >
                          <option value={256} className="bg-slate-900 text-white font-bold">256 x 256 px</option>
                          <option value={512} className="bg-slate-900 text-white font-bold font-mono">512 px (HQ)</option>
                          <option value={1024} className="bg-slate-900 text-white font-bold font-mono">1024 px (Print)</option>
                        </select>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-450 flex items-start gap-1.5 leading-relaxed">
                      <AlertCircle className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                      Calculated fully locally. Packs multiple standard themed QR codes inside a clean ZIP directory download package.
                    </p>
                  </div>

                  {isZipping ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-teal-300 animate-pulse">Packing and compressing...</span>
                        <span className="text-xs font-black text-white">{zipProgress}%</span>
                      </div>
                      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-teal-500 h-full transition-all duration-300"
                          style={{ width: `${zipProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={downloadBulkZIP}
                      disabled={bulkItems.length === 0}
                      className={`w-full py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 cursor-pointer ${
                        bulkItems.length > 0 
                          ? 'bg-teal-500 text-slate-950 hover:bg-teal-400 hover:scale-[1.02] active:scale-95'
                          : 'bg-white/10 text-slate-500 cursor-not-allowed border border-white/5'
                      }`}
                    >
                      <FileDown className="w-5 h-5 stroke-[2.5]" />
                      Download ZIP ({bulkItems.length} codes)
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Live Interactive Grid with Filtering */}
            {bulkItems.length > 0 && (
              <div className="space-y-6 border-t border-slate-100 pt-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      Instant Batch Preview & Verification
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Verify dynamic renders. Showing {Math.min(filteredBulkItems.length, visibleLimit)} of {filteredBulkItems.length} matched codes.</p>
                  </div>

                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      placeholder="Filter compiled items..."
                      value={bulkSearch}
                      onChange={(e) => {
                        setBulkSearch(e.target.value);
                        setVisibleLimit(24);
                      }}
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 ring-teal-50 font-medium text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {filteredBulkItems.slice(0, visibleLimit).map(({ item, index }) => (
                    <div 
                      key={index} 
                      className="bg-white border border-slate-150 p-4 rounded-2xl text-center shadow-sm group hover:border-teal-400 hover:shadow-md transition-all relative overflow-hidden"
                    >
                      <div className="absolute top-2 left-2 bg-slate-100 px-2 py-0.5 rounded-md text-[9px] font-black text-slate-500">
                        #{index + 1}
                      </div>

                      <div className="my-3 px-2 flex justify-center p-2 rounded-xl" style={{ backgroundColor: bgColor }}>
                        {/* Interactive dynamic preview renderer */}
                        <CustomQRCode
                          id={`bulk-preview-svg-${index}`}
                          value={applyPrefixSuffix(item)}
                          size={120}
                          level={qrLevel}
                          bgColor={bgColor}
                          fgColor={fgColor}
                          moduleStyle={moduleStyle}
                          eyeStyle={eyeStyle}
                          className="w-24 h-24 object-contain mx-auto"
                        />
                      </div>

                      <div className="mt-2 space-y-2">
                        <p className="text-[10px] font-bold text-slate-700 truncate px-1" title={applyPrefixSuffix(item)}>
                          {item}
                        </p>
                        <button
                          type="button"
                          onClick={() => downloadIndividualBulkItem(index, item)}
                          className="w-full bg-slate-50 hover:bg-teal-50 hover:text-teal-600 border border-slate-100 p-1.5 rounded-lg text-[9px] font-black uppercase text-slate-500 tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Download className="w-3 h-3 stroke-[2.5]" />
                          {bulkFormat.toUpperCase()}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredBulkItems.length > visibleLimit && (
                  <div className="text-center pt-4">
                    <button
                      onClick={() => setVisibleLimit(prev => prev + 24)}
                      className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                    >
                      Load More Previews (+24)
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* HIDDEN COMPLETENESS POOL FOR ZIP PARSING */}
            {/* Renders all elements completely off-screen so JS can fetch the complete SVGs synchronously for ZIP bundling */}
            <div id="bulk-qr-pool" style={{ display: 'none', position: 'fixed', left: '-9999px', top: '-9999px' }}>
              {bulkItems.map((item, index) => (
                <div key={index} id={`bulk-qr-container-${index}`}>
                  <CustomQRCode 
                    id={`bulk-qr-svg-${index}`}
                    value={applyPrefixSuffix(item)} 
                    size={bulkSize}
                    level={qrLevel}
                    bgColor={bgColor}
                    fgColor={fgColor}
                    moduleStyle={moduleStyle}
                    eyeStyle={eyeStyle}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* SEO Content Section (Preserved and enhanced) */}
      <footer className="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-white space-y-16 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.1),transparent)] pointer-events-none"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative z-10">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-tight">
              The <span className="text-teal-400">Professional</span> Choice for Batch QR Building
            </h2>
            <p className="text-slate-400 leading-relaxed text-lg">
              Toolina provides a 100% free, <strong>private Single & Bulk QR Code generator</strong>. Unlike other generators that limit your batches, put watermark labels, track scanning histories, or expire codes, our codes are static, universal, and constructed locally on your machine structure.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                <h3 className="text-teal-400 font-bold text-sm mb-2 uppercase tracking-widest">WiFi Sharing</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Let guests join your home or business network without typing complex passwords.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                <h3 className="text-teal-400 font-bold text-sm mb-2 uppercase tracking-widest">Business Cards</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Link directly to your portfolio, LinkedIn profile, or official business website.</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-300 mb-6 flex items-center gap-3">
                <span className="text-xl">💡</span> Common Use Cases
              </h3>
              <ul className="space-y-6">
                {[
                  { q: "Can I use these QR codes for commercial print?", a: "Yes. Our high-density PNG and lossless vector SVG outputs are suitable for posters, flyers, and premium packaging." },
                  { q: "How many bulk codes can I generate?", a: "You can supply hundreds of lines at once. Compilation and compression are completely computed locally to ensure sub-second ZIP downloads." },
                  { q: "Do the QR codes expire?", a: "No. These are static, offline QR codes that embed data straight into physical patterns. They will scan forever." },
                  { q: "Is it safe to generate credentials offline?", a: "Absolutely. All processing happens inside your sandbox browser instance. No secrets ever leave your environment." }
                ].map((item, i) => (
                  <li key={i} className="space-y-1">
                    <h4 className="text-sm font-bold text-teal-400">{item.q}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.a}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 relative z-10 text-center">
          <div className="flex justify-center gap-8 mb-8 grayscale opacity-50">
             <div className="text-[10px] font-black uppercase tracking-widest">Universal Standard</div>
             <div className="text-[10px] font-black uppercase tracking-widest">Secure TLS 1.3</div>
             <div className="text-[10px] font-black uppercase tracking-widest">No Tracking</div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Optimized by Toolina Digital Labs</p>
        </div>
      </footer>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .active-tab-animation {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      <AccompanyingText 
        toolName="Q R Generator"
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
          toolId="qrgenerator" 
          defaultRating={5.0} 
          defaultCount={125} 
          onRatingChange={(rating, count) => setRatingInfo({ rating, count })} 
        />
      </div>
      <ShareWidget title="QR Generator" />
    </article>
  );
};

export default QRGenerator;
