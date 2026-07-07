import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, 
  Upload, 
  Type, 
  Settings, 
  Trash2, 
  AlertCircle, 
  Sparkles, 
  Check, 
  FileDown, 
  Search, 
  Sliders, 
  RefreshCw,
  QrCode,
  Barcode,
  ChevronDown
} from 'lucide-react';
import JSZip from 'jszip';
import AccompanyingText from '../components/AccompanyingText';
import ShareWidget from '../components/ShareWidget';
import SEO from '../components/SEO';
import StarRatingWidget from '../components/StarRatingWidget';

// Definition of standard format categories
type BarcodeFormat = 'CODE128' | 'CODE39' | 'EAN13';

interface BarcodeElement {
  width: number;
  type: 'bar' | 'space';
}

// 1. CODE128 - Standard B subset character width configurations (Indices 0 to 106)
const CODE128_WIDTHS = [
  "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213", // 0-9
  "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132", // 10-19
  "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211", // 20-29
  "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313", // 30-39
  "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331", // 40-49
  "231131", "213113", "213311", "213131", "311123", "311321", "313111", "311132", "311231", "313112", // 50-59
  "312113", "312311", "331112", "331311", "111224", "111422", "121124", "121421", "141122", "141221", // 60-69
  "112214", "112412", "122114", "122411", "142112", "142211", "241211", "221114", "213111", "214112", // 70-79
  "223111", "111233", "111332", "121133", "121331", "113113", "113311", "311113", "311311", "331111", // 80-89
  "211133", "211331", "231111", "211113", "211311", "211131", "211112", "211211", "211231", "221111", // 90-99
  "2111112", "2112111", "2111121", "2111114", "2112114", "2111214", "211232" // 100-106
];

const sanitizeCode128 = (input: string): string => {
  return input.split('').map(char => {
    const code = char.charCodeAt(0);
    return (code >= 32 && code <= 127) ? char : ' ';
  }).join('');
};

const encodeCode128 = (input: string): BarcodeElement[] => {
  const sanitized = sanitizeCode128(input);
  const indices: number[] = [];
  
  // Start B subset is index 104
  indices.push(104);
  
  let sum = 104;
  for (let i = 0; i < sanitized.length; i++) {
    const code = sanitized.charCodeAt(i) - 32;
    indices.push(code);
    sum += code * (i + 1);
  }
  
  const checksum = sum % 103;
  indices.push(checksum);
  
  // Stop character is 106
  indices.push(106);
  
  const elements: BarcodeElement[] = [];
  indices.forEach((idx) => {
    const widthStr = idx === 106 ? "2112322" : CODE128_WIDTHS[idx];
    for (let c = 0; c < widthStr.length; c++) {
      const isBar = c % 2 === 0;
      const width = parseInt(widthStr[c], 10);
      elements.push({ width, type: isBar ? 'bar' : 'space' });
    }
  });
  
  return elements;
};

// 2. CODE39 - Character patterns
const CODE39_PATTERNS: Record<string, string> = {
  '0': '101001101101', '1': '110100101011', '2': '101100101011', '3': '110110010101',
  '4': '101001101011', '5': '110100110101', '6': '101100110101', '7': '101001011011',
  '8': '110100101101', '9': '101100101101', 'A': '110101001011', 'B': '101101001011',
  'C': '110110100101', 'D': '101011001011', 'E': '110101100101', 'F': '101101100101',
  'G': '101010011011', 'H': '110101001101', 'I': '101101001101', 'J': '101011001101',
  'K': '110101010011', 'L': '101101010011', 'M': '110110101001', 'N': '101011010011',
  'O': '110101101001', 'P': '101101101001', 'Q': '101010110011', 'R': '110101011001',
  'S': '101101011001', 'T': '101011011001', 'U': '110010101011', 'V': '100110101011',
  'W': '110011010101', 'X': '100101101011', 'Y': '110010110101', 'Z': '100110110101',
  '-': '100101011011', '.': '110010101101', ' ': '100110101101', '$': '100100100101',
  '/': '100100101001', '+': '100101001001', '%': '101001001001', '*': '100101101101'
};

const sanitizeCode39 = (input: string): string => {
  const allowed = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%";
  return input.toUpperCase().split('').map(char => {
    return allowed.includes(char) ? char : ' ';
  }).join('');
};

const encodeCode39 = (input: string): BarcodeElement[] => {
  const sanitized = sanitizeCode39(input);
  const fullText = `*${sanitized}*`;
  const elements: BarcodeElement[] = [];
  
  for (let i = 0; i < fullText.length; i++) {
    const char = fullText[i];
    const pattern = CODE39_PATTERNS[char] || CODE39_PATTERNS[' '];
    
    for (let p = 0; p < pattern.length; p++) {
      const isBar = pattern[p] === '1';
      elements.push({ width: 1, type: isBar ? 'bar' : 'space' });
    }
    
    // Joint spacing
    if (i < fullText.length - 1) {
      elements.push({ width: 1, type: 'space' });
    }
  }
  
  return elements;
};

// 3. EAN-13 - Standard Retail Encoding
const EAN_L_CODES = ["0001101", "0011001", "0010011", "0111101", "0100011", "0110001", "0101111", "0111011", "0110111", "0001011"];
const EAN_G_CODES = ["0100111", "0110011", "0011011", "0100001", "0011101", "0111001", "0000101", "0010001", "0001001", "0010111"];
const EAN_R_CODES = ["1110010", "1100110", "1101100", "1000010", "1011100", "1001110", "1010000", "1000100", "1001000", "1110100"];

const EAN_PARITY = [
  "LLLLLL", "LLGLGG", "LLGGLG", "LLGGGL", "LGLLGG", 
  "LGGLLG", "LGGGLL", "LGLGLG", "LGLGGL", "LGGLGL"
];

const sanitizeEan13 = (input: string): string => {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 0) return '0000000000000';
  
  let base = digits.substring(0, 12);
  if (base.length < 12) {
    base = base.padStart(12, '0');
  }
  
  // Modulo 10 checksum
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const val = parseInt(base[i], 10);
    sum += i % 2 === 0 ? val : val * 3;
  }
  const checksum = (10 - (sum % 10)) % 10;
  return `${base}${checksum}`;
};

const encodeEan13 = (input: string): BarcodeElement[] => {
  const code = sanitizeEan13(input);
  const firstDigit = parseInt(code[0], 10);
  const parityStr = EAN_PARITY[firstDigit];
  
  let binary = "101"; // Start guard
  
  for (let i = 1; i <= 6; i++) {
    const digit = parseInt(code[i], 10);
    const type = parityStr[i - 1];
    if (type === 'L') {
      binary += EAN_L_CODES[digit];
    } else {
      binary += EAN_G_CODES[digit];
    }
  }
  
  binary += "01010"; // Middle guard
  
  for (let i = 7; i <= 12; i++) {
    const digit = parseInt(code[i], 10);
    binary += EAN_R_CODES[digit];
  }
  
  binary += "101"; // End guard
  
  const elements: BarcodeElement[] = [];
  for (let p = 0; p < binary.length; p++) {
    const isBar = binary[p] === '1';
    elements.push({ width: 1, type: isBar ? 'bar' : 'space' });
  }
  
  return elements;
};

// Pure SVG barcode renderer component
interface CustomBarcodeProps {
  id: string;
  value: string;
  format: BarcodeFormat;
  height: number;
  barWidth: number;
  textColor: string;
  bgColor: string;
  fgColor: string;
  showText: boolean;
  fontFamily: string;
  fontSize: number;
  textMargin: number;
  margin: number;
  className?: string;
  style?: React.CSSProperties;
}

const CustomBarcode: React.FC<CustomBarcodeProps> = ({
  id,
  value,
  format,
  height,
  barWidth,
  textColor,
  bgColor,
  fgColor,
  showText,
  fontFamily,
  fontSize,
  textMargin,
  margin,
  className = "",
  style = {}
}) => {
  let elements: BarcodeElement[] = [];
  let displayValue = value;
  
  try {
    if (format === 'CODE128') {
      elements = encodeCode128(value);
      displayValue = sanitizeCode128(value);
    } else if (format === 'CODE39') {
      elements = encodeCode39(value);
      displayValue = sanitizeCode39(value).toUpperCase();
    } else if (format === 'EAN13') {
      elements = encodeEan13(value);
      displayValue = sanitizeEan13(value);
    }
  } catch (err) {
    console.error("Barcode encoding error", err);
  }

  // Calculate widths
  const textSpaceMultiplier = showText ? (fontSize + textMargin) : 0;
  const barcodeWidthUnits = elements.reduce((sum, el) => sum + el.width, 0);
  const totalBarcodeWidth = barcodeWidthUnits * barWidth;
  const svgWidth = totalBarcodeWidth + (margin * 2);
  const svgHeight = height + (margin * 2) + textSpaceMultiplier;

  let currentX = margin;

  return (
    <svg
      id={id}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      width="100%"
      height="100%"
      className={className}
      style={{ 
        backgroundColor: bgColor, 
        maxWidth: '100%', 
        height: 'auto',
        ...style 
      }}
    >
      {/* Background */}
      <rect width={svgWidth} height={svgHeight} fill={bgColor} />

      {/* Render Bars */}
      <g>
        {elements.map((el, index) => {
          const elWidth = el.width * barWidth;
          const rectX = currentX;
          currentX += elWidth;

          if (el.type === 'bar') {
            return (
              <rect
                key={index}
                x={rectX}
                y={margin}
                width={elWidth}
                height={height}
                fill={fgColor}
              />
            );
          }
          return null;
        })}
      </g>

      {/* Render Text */}
      {showText && (
        <text
          x={svgWidth / 2}
          y={height + margin + textMargin + (fontSize * 0.75)}
          textAnchor="middle"
          fill={textColor}
          style={{
            fontFamily: fontFamily === 'mono' ? '"JetBrains Mono", monospace' : fontFamily === 'display' ? '"Space Grotesk", sans-serif' : '"Inter", sans-serif',
            fontSize: `${fontSize}px`,
            fontWeight: 'bold',
            letterSpacing: format === 'EAN13' ? '0.25em' : '0.15em'
          }}
        >
          {displayValue}
        </text>
      )}
    </svg>
  );
};

const BarcodeGenerator: React.FC = () => {
  const [ratingInfo] = useState({ rating: 4.8, count: 185 });
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [activeFormat, setActiveFormat] = useState<BarcodeFormat>('CODE128');
  
  // Setup inputs
  const [singleValue, setSingleValue] = useState('TOOLINA-128');
  const [singleFormatOption, setSingleFormatOption] = useState<'png' | 'svg'>('png');
  const [singleDownloadScale, setSingleDownloadScale] = useState<number>(2);

  // Style properties
  const [barHeight, setBarHeight] = useState<number>(90);
  const [barWidthUnit, setBarWidthUnit] = useState<number>(3);
  const [showLabel, setShowLabel] = useState<boolean>(true);
  const [textGap, setTextGap] = useState<number>(8);
  const [labelSize, setLabelSize] = useState<number>(14);
  const [labelFont, setLabelFont] = useState<string>('mono');
  const [borderMargin, setBorderMargin] = useState<number>(24);

  // Colors
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [fgColor, setFgColor] = useState('#0F172A');
  const [lblColor, setLblColor] = useState('#0F172A');

  // Bulk parameters
  const [bulkInput, setBulkInput] = useState("ITEM-001\nITEM-002\nITEM-003\nBATCH-994\nPROD-772A");
  const [bulkSeparator, setBulkSeparator] = useState<'newline' | 'comma' | 'semicolon'>('newline');
  const [bulkPrefix, setBulkPrefix] = useState("");
  const [bulkSuffix, setBulkSuffix] = useState("");
  const [bulkFormat, setBulkFormat] = useState<'png' | 'svg'>('png');
  const [bulkDownloadScale, setBulkDownloadScale] = useState<number>(2);
  const [bulkSearch, setBulkSearch] = useState('');
  
  // Drag active state
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ZIP states
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

  // Educational Hub State
  const [eduTab, setEduTab] = useState<'overview' | 'code128' | 'code39' | 'ean13' | 'printing'>('overview');

  // Trigger content correction on EAN-13
  useEffect(() => {
    if (activeFormat === 'EAN13') {
      // Clean letters, keep only digits
      const digits = singleValue.replace(/\D/g, '');
      if (digits.length > 0) {
        setSingleValue(digits.substring(0, 12));
      } else {
        setSingleValue('400638133393'); // Standard sample EAN-13 base
      }
    } else if (activeFormat === 'CODE39') {
      setSingleValue(prev => sanitizeCode39(prev) || 'TOOLINA39');
    }
  }, [activeFormat]);

  // Color preset options
  const colorPresets = [
    { label: 'Matte Charcoal', fg: '#0F172A', bg: '#FFFFFF' },
    { label: 'Royal Sapphire', fg: '#1E3A8A', bg: '#F8FAFC' },
    { label: 'Forest Green', fg: '#064E3B', bg: '#F0FDF4' },
    { label: 'Crimson Ember', fg: '#7F1D1D', bg: '#FEF2F2' },
    { label: 'Amber Gold', fg: '#78350F', bg: '#FFFBEB' },
    { label: 'Deep Burgundy', fg: '#4C1D95', bg: '#F5F3FF' }
  ];

  // Drag handlers for files
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
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setBulkInput(text);
      }
    };
    reader.readAsText(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

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
    if (safe.length > 30) {
      safe = safe.substring(0, 30);
    }
    return `${String(index + 1).padStart(3, '0')}_${safe || 'barcode'}`;
  };

  // Convert SVG to Canvas and extract PNG Blob
  const svgToPngBlob = (svgElement: SVGSVGElement, downloadScale = 2): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      try {
        const svgString = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        
        // Find dimensions from original elements
        const viewBox = svgElement.viewBox.baseVal;
        const width = viewBox.width || 400;
        const height = viewBox.height || 180;

        const targetWidth = width * downloadScale;
        const targetHeight = height * downloadScale;

        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.width = targetWidth;
        image.height = targetHeight;
        
        image.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const context = canvas.getContext('2d');
            
            if (context) {
              // Paint background
              context.fillStyle = bgColor;
              context.fillRect(0, 0, targetWidth, targetHeight);
              
              // Draw scaled vector image
              context.drawImage(image, 0, 0, targetWidth, targetHeight);
              
              canvas.toBlob((blob) => {
                if (blob) {
                  resolve(blob);
                } else {
                  reject(new Error('Canvas conversion failed'));
                }
                URL.revokeObjectURL(url);
              }, 'image/png');
            } else {
              reject(new Error('Canvas context unavailable'));
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

  // Single barcode download
  const handleDownloadSingle = async () => {
    const svgElement = document.getElementById('single-barcode-svg') as unknown as SVGSVGElement;
    if (!svgElement) return;

    const fileName = `Toolina_Barcode_${singleValue.replace(/[^a-zA-Z0-9-_]/g, '_')}`;

    if (singleFormatOption === 'svg') {
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = window.URL.createObjectURL(svgBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      try {
        const pngBlob = await svgToPngBlob(svgElement, singleDownloadScale);
        const url = window.URL.createObjectURL(pngBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Single download failed", err);
      }
    }
  };

  // Bulk ZIP compiler download
  const handleDownloadBulkZIP = async () => {
    const items = getBulkItems();
    if (items.length === 0) return;

    setIsZipping(true);
    setZipProgress(0);

    try {
      const zip = new JSZip();
      const folder = zip.folder("toolina-bulk-barcodes");

      // Tiny delay for system settlement
      await new Promise(resolve => setTimeout(resolve, 150));

      for (let i = 0; i < items.length; i++) {
        const element = document.getElementById(`bulk-barcode-svg-${i}`) as unknown as SVGSVGElement;
        if (element) {
          if (bulkFormat === 'svg') {
            const svgString = new XMLSerializer().serializeToString(element);
            folder?.file(`${sanitizeFilename(items[i], i)}.svg`, svgString);
          } else {
            const pngBlob = await svgToPngBlob(element, bulkDownloadScale);
            folder?.file(`${sanitizeFilename(items[i], i)}.png`, pngBlob);
          }
        }
        
        setZipProgress(Math.round(((i + 1) / items.length) * 100));

        // Yield execution occasionally for smooth UI updates
        if (i % 25 === 0) {
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }

      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Toolina_Bulk_Barcodes_${items.length}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Bulk compilation ZIP failed", err);
    } finally {
      setIsZipping(false);
      setZipProgress(0);
    }
  };

  // Download single item card from grid preview
  const downloadGridItem = async (index: number, text: string) => {
    const element = document.getElementById(`bulk-barcode-svg-${index}`) as unknown as SVGSVGElement;
    if (!element) return;

    const fileBase = sanitizeFilename(text, index);

    if (bulkFormat === 'svg') {
      const svgString = new XMLSerializer().serializeToString(element);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = window.URL.createObjectURL(svgBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileBase}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      try {
        const pngBlob = await svgToPngBlob(element, bulkDownloadScale);
        const url = window.URL.createObjectURL(pngBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileBase}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const bulkItems = getBulkItems();
  const filteredBulkItems = bulkItems
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.toLowerCase().includes(bulkSearch.toLowerCase()));

  // Style Customizer panel content
  const renderStylePanel = () => {
    return (
      <div className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-inner space-y-6">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-teal-600" /> Linear Barcode Customization
        </h2>

        {/* Preset palette chips */}
        <div>
          <label className="block text-[10px] font-black uppercase text-slate-500 mb-2">Preset Theme Styles</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {colorPresets.map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setFgColor(preset.fg);
                  setBgColor(preset.bg);
                  setLblColor(preset.fg);
                }}
                className="p-2 rounded-xl text-[10px] font-bold border border-slate-200 bg-white hover:border-slate-300 transition-colors text-left flex items-center gap-1.5 cursor-pointer"
              >
                <span className="w-3 h-3 rounded border border-slate-200 shrink-0" style={{ backgroundColor: preset.fg }} />
                <span className="truncate text-slate-700">{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Height and Width adjustments */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">
              Bar Height ({barHeight}px)
            </label>
            <input 
              type="range"
              min={40}
              max={180}
              value={barHeight}
              onChange={(e) => setBarHeight(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-ew-resize accent-teal-600"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">
              Bar Resolution ({barWidthUnit}x)
            </label>
            <input 
              type="range"
              min={1}
              max={5}
              value={barWidthUnit}
              onChange={(e) => setBarWidthUnit(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-ew-resize accent-teal-600"
            />
          </div>
        </div>

        {/* Margins */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">
              Side Margins ({borderMargin}px)
            </label>
            <input 
              type="range"
              min={0}
              max={64}
              value={borderMargin}
              onChange={(e) => setBorderMargin(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-ew-resize accent-teal-600"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">
              Text Gap ({textGap}px)
            </label>
            <input 
              type="range"
              min={2}
              max={20}
              value={textGap}
              onChange={(e) => setTextGap(parseInt(e.target.value))}
              disabled={!showLabel}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-ew-resize accent-teal-600 disabled:opacity-40"
            />
          </div>
        </div>

        {/* Toggle options */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/50">
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Human Readable Label</label>
            <div className="flex gap-1 bg-slate-200/60 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setShowLabel(true)}
                className={`flex-1 py-1 text-[9px] font-bold uppercase rounded ${showLabel ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
              >
                ON
              </button>
              <button
                type="button"
                onClick={() => setShowLabel(false)}
                className={`flex-1 py-1 text-[9px] font-bold uppercase rounded ${!showLabel ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
              >
                OFF
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Font Family</label>
            <select
              value={labelFont}
              onChange={(e) => setLabelFont(e.target.value)}
              disabled={!showLabel}
              className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-705 cursor-pointer disabled:opacity-40"
            >
              <option value="mono">JetBrains Mono</option>
              <option value="sans">Inter Sans</option>
              <option value="display">Space Grotesk</option>
            </select>
          </div>
        </div>

        {/* Color pickers */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/50">
          <div>
            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Bar Color</label>
            <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg bg-white p-1">
              <input 
                type="color" 
                value={fgColor} 
                onChange={(e) => {
                  setFgColor(e.target.value);
                  setLblColor(e.target.value);
                }} 
                className="w-6 h-6 rounded border cursor-pointer border-slate-200 shrink-0" 
              />
              <span className="text-[9px] font-bold text-slate-600 font-mono block truncate">{fgColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">BG Canvas</label>
            <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg bg-white p-1">
              <input 
                type="color" 
                value={bgColor} 
                onChange={(e) => setBgColor(e.target.value)} 
                className="w-6 h-6 rounded border cursor-pointer border-slate-200 shrink-0" 
              />
              <span className="text-[9px] font-bold text-slate-600 font-mono block truncate">{bgColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Label Color</label>
            <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg bg-white p-1">
              <input 
                type="color" 
                value={lblColor} 
                onChange={(e) => setLblColor(e.target.value)} 
                disabled={!showLabel}
                className="w-6 h-6 rounded border cursor-pointer border-slate-200 shrink-0 disabled:opacity-40" 
              />
              <span className="text-[9px] font-bold text-slate-600 font-mono block truncate disabled:opacity-40">{lblColor}</span>
            </div>
          </div>
        </div>

        {/* FontSize configuration */}
        {showLabel && (
          <div className="pt-2 border-t border-slate-200/50">
            <label className="block text-[10px] font-black uppercase text-slate-500 mb-1.5">
              Label Text Size ({labelSize}px)
            </label>
            <input 
              type="range"
              min={10}
              max={24}
              value={labelSize}
              onChange={(e) => setLabelSize(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-ew-resize accent-teal-600"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <article className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <SEO 
        title="Free Bulk Barcode Generator (Excel/CSV support) - CODE-128, EAN-13, CODE-39 | Toolina" 
        url="https://toolina.in/barcode-generator"
        description="Generate top-density linear barcodes (CODE128, CODE39, EAN-13) in single or unlimited bulk batches offline instantly. Free, fully customizable vector parameters, with support for copying or compiling to ZIP archive sheets." 
        keywords="bulk barcode generator, barcode creator, barcode maker, free barcode generator, ean 13 generator, code 128 generator, barcode excel sheet, offline barcode tool"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "SoftwareApplication",
              "name": "Free Bulk Code-128, Code-39 & EAN-13 Barcode Generator Online",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "All",
              "browserRequirements": "Requires JavaScript. Runs 100% locally.",
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
            },
            {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Which barcode standard should I select for warehousing and cataloging?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "For general warehousing, inventory tracking, and custom packaging, the CODE-128 standard is highly recommended because of its compact density and full alphanumeric character set. It encodes both letters and numbers efficiently."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What are the rules and limits for generating EAN-13 barcodes?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The international retail standard EAN-13 requires exactly 12 numerical digits. The 13th digit represents an automatically solved check digit computed using modulo-10 calculations. It does not support alphabetical letters."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How big should the Quiet Zone surrounding the linear bars be?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Quiet zones must measure at least 10 times the width of the narrowest dark bar (known as X-dimension) on both the left and right margins to prevent optical laser scan errors."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I bulk compile raw listings from Excel or notepad files?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! Our Bulk Barcode Compiler parses line-separated SKUs, item serials, or logistics codes. It will compute and bundle hundreds of downloads instantly inside a high-res .zip package completely offline."
                  }
                }
              ]
            }
          ]
        }}
      />
      
      <header className="bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-200 shadow-2xl shadow-slate-100/50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-bl-[10rem] -mr-16 -mt-16 opacity-50 blur-3xl"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-teal-600 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-teal-100 text-white shrink-0">
              <Barcode className="w-8 h-8 md:w-10 md:h-10 text-white stroke-[1.5]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight leading-none flex items-center gap-2">
                Barcode <span className="text-teal-600">Generator</span>
              </h1>
              <p className="text-slate-500 font-medium text-xs md:text-lg mt-1 italic">Professional Logistics, Retail & Bulk Batch Engine</p>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 w-full lg:w-auto">
            <button
              onClick={() => setMode('single')}
              className={`flex-1 lg:px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'single' 
                  ? 'bg-white shadow-sm text-teal-600 font-extrabold' 
                  : 'text-slate-500 hover:text-teal-600'
              }`}
            >
              <Type className="w-4 h-4" />
              Single Barcode
            </button>
            <button
              onClick={() => setMode('bulk')}
              className={`flex-1 lg:px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'bulk' 
                  ? 'bg-white shadow-sm text-teal-600 font-extrabold' 
                  : 'text-slate-500 hover:text-teal-600'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              Bulk Barcode
            </button>
          </div>
        </div>

        {/* MODE: SINGLE BARCODE GENERATOR */}
        {mode === 'single' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start active-tab-animation animate-in fade-in duration-500">
            {/* Column 1: Format Selector & Input Value */}
            <div className="lg:col-span-4 space-y-6 flex flex-col justify-start">
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-600">Select Barcode Standard</label>
                  <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
                    {(['CODE128', 'CODE39', 'EAN13'] as BarcodeFormat[]).map(fmt => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setActiveFormat(fmt)}
                        className={`py-2 rounded-lg text-[9px] font-black tracking-widest transition-all cursor-pointer ${
                          activeFormat === fmt 
                            ? 'bg-white text-slate-800 shadow-sm font-black' 
                            : 'text-slate-400 hover:text-slate-800'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-inner space-y-4">
                  <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Type className="w-3.5 h-3.5 text-teal-600" /> Barcode Contents
                  </h2>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Value Segment</label>
                    <input 
                      type="text" 
                      value={singleValue}
                      onChange={(e) => setSingleValue(e.target.value)}
                      placeholder={activeFormat === 'EAN13' ? "e.g. 400638133393" : "e.g. ITEM-4592"}
                      maxLength={activeFormat === 'EAN13' ? 12 : 50}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 ring-teal-50 transition-all font-mono font-bold text-sm text-slate-800"
                    />
                  </div>

                  {activeFormat === 'EAN13' && (
                    <p className="text-[10px] text-slate-500 italic mt-1 bg-slate-100 p-2.5 rounded-lg border border-slate-200/50 leading-relaxed">
                      💡 <strong>EAN-13 Standard parity requirements:</strong> Provide 12 digits. The generator automatically calculates and Appends the correct 13th checksum digit.
                    </p>
                  )}
                  {activeFormat === 'CODE39' && (
                    <p className="text-[10px] text-slate-500 italic mt-1 bg-slate-100 p-2.5 rounded-lg border border-slate-200/50 leading-relaxed">
                      💡 <strong>Code 39 Alphanumeric standard:</strong> Uppercase letters and key symbols only. Other chars will be translated to spacing. Start/Stop asterisks are auto-injected.
                    </p>
                  )}
                </div>
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
                    className="relative p-8 rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden min-w-[280px] min-h-[200px] md:min-w-[320px] flex items-center justify-center transition-all duration-300 w-full"
                    style={{ backgroundColor: bgColor }}
                  >
                    <div className="relative z-10 w-full p-2 rounded-2xl transition-all duration-300 flex items-center justify-center overflow-x-auto" style={{ backgroundColor: bgColor }}>
                      <CustomBarcode 
                        id="single-barcode-svg"
                        value={singleValue}
                        format={activeFormat}
                        height={barHeight}
                        barWidth={barWidthUnit}
                        textColor={lblColor}
                        bgColor={bgColor}
                        fgColor={fgColor}
                        showText={showLabel}
                        fontFamily={labelFont}
                        fontSize={labelSize}
                        textMargin={textGap}
                        margin={borderMargin}
                        className="w-full h-auto object-contain mx-auto max-h-[160px]"
                      />
                      {/* Scan Line Animation */}
                      <div className="absolute left-0 top-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.7)] animate-scan"></div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-col items-center text-center">
                  <span className="text-[10px] font-black text-slate-350 uppercase tracking-[0.3em] mb-1 animate-pulse">100% Client-Side Rendered</span>
                  <p className="text-[10px] text-slate-400 font-medium max-w-[280px]">Laser red alignment line represents universal laser capability sweep.</p>
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
                      value={singleFormatOption}
                      onChange={(e) => setSingleFormatOption(e.target.value as 'png' | 'svg')}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none text-xs font-bold text-slate-700 cursor-pointer"
                    >
                      <option value="png">PNG (Raster)</option>
                      <option value="svg">SVG (Vector)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Vector Scale</label>
                    <select 
                      value={singleDownloadScale}
                      onChange={(e) => setSingleDownloadScale(Number(e.target.value))}
                      disabled={singleFormatOption === 'svg'}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none text-xs font-bold text-slate-700 cursor-pointer disabled:opacity-50"
                    >
                      <option value={1}>1x Normal</option>
                      <option value={2}>2x High Quality</option>
                      <option value={3}>3x Ultra Print</option>
                      <option value={4}>4x Maximum Resolution</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleDownloadSingle}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-black transition-all shadow-md active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  Download {singleFormatOption.toUpperCase()} Code
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
                      Enter Value Feed (One barcode value per line)
                    </label>
                    <textarea 
                      rows={6}
                      placeholder="ITEM-001&#10;ITEM-002&#10;BARCODE-A&#10;BATCH-B"
                      value={bulkInput}
                      onChange={(e) => setBulkInput(e.target.value)}
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-teal-50 transition-all font-mono text-xs text-slate-800 leading-relaxed resize-none"
                    />
                  </div>

                  {/* Separators and prefix configs */}
                  <div className="grid grid-cols-1 gap-4 pt-2 border-t border-slate-200/60">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Separator Delimiter</label>
                      <select 
                        value={bulkSeparator}
                        onChange={(e) => setBulkSeparator(e.target.value as 'newline' | 'comma' | 'semicolon')}
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none text-xs font-bold cursor-pointer"
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
                        placeholder="e.g. KEY-"
                        value={bulkPrefix}
                        onChange={(e) => setBulkPrefix(e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Constant Suffix (Optional)</label>
                      <input 
                        type="text"
                        placeholder="e.g. -X"
                        value={bulkSuffix}
                        onChange={(e) => setBulkSuffix(e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none text-xs font-bold text-slate-850"
                      />
                    </div>

                    <div className="flex flex-col justify-end pt-2">
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
                <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-600">Select Barcode Standard</label>
                  <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-xl">
                    {(['CODE128', 'CODE39', 'EAN13'] as BarcodeFormat[]).map(fmt => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setActiveFormat(fmt)}
                        className={`py-1.5 rounded-lg text-[9px] font-black tracking-widest transition-all cursor-pointer ${
                          activeFormat === fmt 
                            ? 'bg-slate-900 text-white shadow-sm font-black' 
                            : 'text-slate-450 hover:text-slate-850'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>
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
                      <p className="text-[10px] uppercase font-bold tracking-wider text-slate-450">Total Codes</p>
                      <p className="text-2xl font-black text-white mt-1 font-mono">{bulkItems.length}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-slate-450">Target Package</p>
                      <p className="text-2xl font-black text-teal-300 mt-1 uppercase font-mono">{bulkFormat}</p>
                    </div>
                  </div>

                  {/* Format Selection & PNG Sizing inside Compiler Settings */}
                  <div className="space-y-4 pt-4 border-t border-white/10 text-xs text-white">
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
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">PNG Scale</label>
                        <select
                          value={bulkDownloadScale}
                          onChange={(e) => setBulkDownloadScale(Number(e.target.value))}
                          className="w-full px-2 py-1.5 bg-white/5 border border-white/10 text-white rounded-lg outline-none text-[10px] font-bold cursor-pointer disabled:opacity-50"
                          disabled={bulkFormat === 'svg'}
                        >
                          <option value={1} className="bg-slate-900 text-white font-bold">1x (Standard)</option>
                          <option value={2} className="bg-slate-900 text-white font-bold font-mono">2x (High Res)</option>
                          <option value={3} className="bg-slate-900 text-white font-bold font-mono">3x (Print)</option>
                        </select>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400 flex items-start gap-1.5 leading-relaxed">
                      <AlertCircle className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                      We bundle and organize the codes inside a single standard ZIP archive locally. Sub-second compile times.
                    </p>
                  </div>

                  {isZipping ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-teal-300 animate-pulse">Packing ZIP folder...</span>
                        <span className="text-xs font-black text-white font-mono">{zipProgress}%</span>
                      </div>
                      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-teal-500 h-full transition-all duration-300 animate-pulse"
                          style={{ width: `${zipProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleDownloadBulkZIP}
                      disabled={bulkItems.length === 0}
                      className={`w-full bg-teal-500 hover:bg-teal-400 text-slate-950 py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 cursor-pointer ${
                        bulkItems.length === 0 ? 'opacity-40 cursor-not-allowed' : ''
                      }`}
                    >
                      <FileDown className="w-5 h-5 stroke-[2.5]" />
                      Download ZIP ({bulkItems.length} codes)
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Live Interactive Grid Workspace preview layout */}
            {bulkItems.length > 0 && (
              <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-100/50 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Interactive Compiler Visualizer</h3>
                    <p className="text-slate-500 text-xs">Verify layouts individually or download selective indices.</p>
                  </div>

                  <div className="relative max-w-xs w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      placeholder="Search values..."
                      value={bulkSearch}
                      onChange={(e) => setBulkSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-705 outline-none focus:ring-2 ring-teal-350"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredBulkItems.map(({ item, index }) => {
                    const compiledValue = applyPrefixSuffix(item);
                    return (
                      <div 
                        key={index}
                        className="border border-slate-100 bg-slate-50 p-4 rounded-3xl hover:shadow-lg transition-all duration-300 relative group flex flex-col justify-between"
                      >
                        <span className="absolute top-3 left-3 bg-slate-200 font-mono text-[9px] px-2 py-0.5 rounded-full font-bold text-slate-600 block z-10">
                          #{index + 1}
                        </span>

                        <div className="my-3 px-2 flex justify-center p-2 rounded-xl h-24 items-center overflow-hidden" style={{ backgroundColor: bgColor }}>
                          <CustomBarcode 
                            id={`bulk-barcode-svg-${index}`}
                            value={compiledValue}
                            format={activeFormat}
                            height={barHeight}
                            barWidth={barWidthUnit}
                            textColor={lblColor}
                            bgColor={bgColor}
                            fgColor={fgColor}
                            showText={showLabel}
                            fontFamily={labelFont}
                            fontSize={labelSize}
                            textMargin={textGap}
                            margin={borderMargin}
                            className="w-full h-auto object-contain max-h-20"
                          />
                        </div>

                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2.5">
                          <div className="truncate text-left shrink">
                            <p className="text-[10px] font-black text-slate-800 truncate" title={compiledValue}>
                              {compiledValue}
                            </p>
                            <p className="text-[8px] font-bold text-slate-400 font-mono">Format: {activeFormat}</p>
                          </div>

                          <button
                            type="button"
                            onClick={() => downloadGridItem(index, item)}
                            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-900 text-white group-hover:bg-teal-500 group-hover:border-teal-500 group-hover:text-slate-950 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredBulkItems.length === 0 && (
                  <div className="p-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-3xl">
                    <p className="font-bold text-xs">No matching barcode values detected.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </header>

      {/* Interactive Barcode Knowledge & SEO Information Center */}
      <section className="bg-white p-8 md:p-14 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-100/50 space-y-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-slate-50 rounded-br-[8rem] opacity-75 pointer-events-none"></div>
        
        <div className="relative z-10 space-y-4">
          <span className="text-[10px] font-black uppercase text-teal-600 tracking-[0.3em] bg-teal-50 px-3 py-1.5 rounded-full inline-block">
            Barcode Symbology & Engineering Standards
          </span>
          <h2 className="text-2xl md:text-4xl font-display font-black text-slate-900 tracking-tight">
            Universal Barcode Standards <span className="text-slate-400">&amp;</span> Print Integration Guide
          </h2>
          <p className="text-slate-500 text-sm md:text-base max-w-4xl leading-relaxed">
            Gain complete mastery over linear (1D) scanner technology. Learn how different barcode standards process data, calculate check digits, and configure physical printing layouts for maximum scanning speed and absolute reading accuracy.
          </p>
        </div>

        {/* Tab System Selector */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-2xl relative z-10 max-w-3xl">
          {[
            { id: 'overview', label: '📊 Symbologies Matrix' },
            { id: 'code128', label: '🔒 Code 128 (High-Density)' },
            { id: 'code39', label: '🛠️ Code 39 (Industrial)' },
            { id: 'ean13', label: '🛒 EAN-13 (Global Retail)' },
            { id: 'printing', label: '🖨️ Printing & Color Rules' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setEduTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                eduTab === tab.id 
                  ? 'bg-white text-slate-900 shadow-md font-extrabold scale-102' 
                  : 'text-slate-500 hover:text-slate-805 hover:bg-white/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="bg-slate-50/50 p-6 md:p-8 rounded-3xl border border-slate-100 relative z-10 animate-in fade-in duration-300">
          
          {eduTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-black text-slate-850">Comparison Matrix of Linear (1D) Barcodes</h3>
              <p className="text-xs text-slate-505 leading-relaxed">
                Linear or one-dimensional (1D) barcodes encode alphabetical and numerical values of varying lengths into systematic black lines and white spaces. Choosing the appropriate symbology depends heavily on packaging dimensions, scanning hardware, and localized regulatory registries.
              </p>
              
              <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Symbology Standard</th>
                      <th className="p-4">Character Set Supported</th>
                      <th className="p-4">Data Density</th>
                      <th className="p-4">Verification Check Digit</th>
                      <th className="p-4">Primary Industry Verticals</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-bold text-slate-905">CODE 128</td>
                      <td className="p-4">Full 128 ASCII Set (Letters, Numbers, Symbols)</td>
                      <td className="p-4 text-emerald-600 font-bold">Ultra High (Compressed)</td>
                      <td className="p-4 font-mono">Modulo 103 algorithm</td>
                      <td className="p-4">DHL/FedEx Logistics, Freight Shipments, Supply Chain</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-bold text-slate-905">CODE 39 (3 of 9)</td>
                      <td className="p-4">Capital Letters (A-Z), Numbers (0-9), Key Symbols (- . $ / + % *)</td>
                      <td className="p-4 text-amber-600 font-bold">Medium to Low</td>
                      <td className="p-4 font-mono">Self-Checking (Optional Modulo 43)</td>
                      <td className="p-4">Defense logistics (MIL-STD), Automotive, Government inventory</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-bold text-slate-905">EAN-13 (GTIN-13)</td>
                      <td className="p-4">Strictly Numeric (0-9 digits only)</td>
                      <td className="p-4 text-blue-600 font-bold">Fixed Dimension</td>
                      <td className="p-4 font-mono">Weighted Modulo 10 Check digit</td>
                      <td className="p-4">Global retail sales terminals, POS checkouts, GS1 registries</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {eduTab === 'code128' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-850">Code 128 Symbology Specifications (ISO/IEC 15417)</h3>
                <p className="text-xs text-slate-505 leading-relaxed">
                  Code 128 is a highly compact, variable-length, high-density linear barcode. It utilizes four distinct bar widths to compress numerical, alphabetical, and complex operational control codes seamlessly.
                </p>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold font-mono">✓</span>
                    <span><strong>Dynamically Shiftable Subsets:</strong> Combines Subset A (Control characters/numbers), Subset B (Standard alphanumeric), and Subset C (Double-density numeric pairs).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold font-mono">✓</span>
                    <span><strong>Modulo 103 Verification:</strong> Employs state-of-the-art error checker. An internal positional math calculation verifies line geometry to suppress reading error rates.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold font-mono">✓</span>
                    <span><strong>Optimal Density:</strong> Because it supports three standard subsets, numerical strings are automatically packed into double density, consuming half the width.</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4 shadow-sm">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">How Modulo 103 Checksum Works</h4>
                <div className="font-mono text-[11px] bg-slate-50 p-4 rounded-xl text-slate-700 leading-relaxed space-y-2">
                  <p>1. Start Code Value B is loaded (104)</p>
                  <p>2. Multiply each subsequent character by its index offset index position (Position × CharValue)</p>
                  <p>3. Sum all matching results: TotalSum = StartValue + (Index 1 × V1) + (Index 2 × V2) + ...</p>
                  <p>4. Dividable remainder check: Checksum = TotalSum % 103</p>
                  <p>5. Append checksum directly before the final Stop byte (Value 106)</p>
                </div>
              </div>
            </div>
          )}

          {eduTab === 'code39' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-850">Code 39 (3 of 9) Alphanumeric Standard</h3>
                <p className="text-xs text-slate-505 leading-relaxed">
                  Code 39 is a discrete, variable-length barcode symbology. Its moniker is derived from its design: out of any consecutive 9 elements (bars and spaces) representing a code character, exactly 3 are wide while the other 6 are narrow.
                </p>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold font-mono">✓</span>
                    <span><strong>Self-Checking Geometry:</strong> Since each single character has its own self-enclosed scanner parity checks, a checksum is completely optional. This yields massive legacy system hardware compatibility.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold font-mono">✓</span>
                    <span><strong>Start/Stop Asterisks (*):</strong> Code 39 requires an asterisk symbol at both the start and end of strings. Our generator automatically wraps these so you can compile raw strings with complete peace-of-mind.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold font-mono">✓</span>
                    <span><strong>Physical Overhead:</strong> Because of its wide element geometry, strings over 15 characters become physically wide and require substantial catalog space. Use Code 128 for longer character fields.</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Usage Recommendations</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Perfect for defense acquisitions, military supplier crates (LOGMARS specifications), manufacturing assemblies, name badge indices, and localized barcode systems where legacy 3-of-9 scanning readers are deployed.
                </p>
                <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl text-[11px] text-teal-800 leading-relaxed font-semibold">
                  ⚠️ Avoid lowercase letters unless you explicitly set up Full ASCII Extended Mode configuration. This generator converts lowercase to uppercase to maintain 100% scanner interoperability.
                </div>
              </div>
            </div>
          )}

          {eduTab === 'ean13' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-850">EAN-13 (European Article Numbering) &amp; GTIN-13</h3>
                <p className="text-xs text-slate-505 leading-relaxed">
                  EAN-13 is a globally deployed 13-digit commercial marking system. Standardized by GS1, this symbology is universally read by Point-of-Sale (POS) optical scanner arrays in supermarkets and retail checkouts.
                </p>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold font-mono">✓</span>
                    <span><strong>Country Registry Prefix (Digits 1-3):</strong> Identifies the GS1 organization country location where the product has been registered.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold font-mono">✓</span>
                    <span><strong>Manufacturer Identifier (Digits 4-8):</strong> Assigned by GS1 to represent the unique manufacturing enterprise.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold font-mono">✓</span>
                    <span><strong>Product Reference (Digits 9-12):</strong> Denotes the specific SKU, package type, or item style variant.</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Checksum Modulo 10 Mathematics</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The last digit (13th positional number) is computed using weighted modulo mathematical parameters to verify total line alignment:
                </p>
                <div className="font-mono text-[11px] bg-slate-50 p-4 rounded-xl text-slate-700 leading-relaxed space-y-1.5">
                  <p>1. Multiply digits in odd positions (1st, 3rd, 5th, etc.) by 1</p>
                  <p>2. Multiply digits in even positions (2nd, 4th, 6th, etc.) by 3</p>
                  <p>3. Add all calculated factors: SumTotal = OddSum + EvenSum</p>
                  <p>4. Checksum = (10 - (SumTotal % 10)) % 10</p>
                </div>
              </div>
            </div>
          )}

          {eduTab === 'printing' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-850">Barcode Printing Dimensions &amp; Color Rules</h3>
                <p className="text-xs text-slate-505 leading-relaxed">
                  Generating a digital barcode vector is only half the battle. To ensure high scan success rates on shipping labels and retail catalog panels, adhere to strict optical layout rules:
                </p>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold font-mono">✖</span>
                    <span><strong>Red-Light Inversion Warning:</strong> Scanners sweep with Red laser or LED arrays. Because red bars reflect red light fully, <strong>red bars on white backgrounds CANNOT be detected</strong>. Only use black, navy blue, dark green, or deep charcoal bar colors.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold font-mono">✓</span>
                    <span><strong>Sufficient Quiet Zones:</strong> Leave at least 10 times the width of a single narrow bar element as blank side margin spacing. Failing to maintain this margin prevents devices from recognizing start bytes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-500 font-bold font-mono">✓</span>
                    <span><strong>SVG vs PNG selection:</strong> Choose SVG vectors when printing onto high density commercial label runs. If you use PNG, set our scale option to 3x (Print) or 4x (Max) to maximize DPI boundaries on thermal printers.</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Color Compatibility Rules</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                    <span className="text-emerald-600 font-extrabold font-mono text-sm">SCAN OK</span>
                    <span className="text-[11px] text-emerald-800">Black/Navy/Charcoal bars on White/Yellow/Light backgrounds.</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-rose-50 border border-rose-100">
                    <span className="text-rose-600 font-extrabold font-mono text-sm">NO SCAN</span>
                    <span className="text-[11px] text-rose-800">Red/Orange bars on White background. Or Black bars on Blue/Dark background.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Accompanying SEO Information & Star ratings */}
      <footer className="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-white space-y-16 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.1),transparent)] pointer-events-none"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative z-10">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-tight">
              High-Density <span className="text-teal-400">Accurate</span> Linear Code Compilation
            </h2>
            <p className="text-slate-400 leading-relaxed text-base">
              Toolina brings you a secure, enterprise-level **Single &amp; Batch Bulk Barcode compiler**. Create retail and delivery packaging markings containing custom identifiers instantly. No usage limits, no expiry, no watermarks, and zero network transmissions.
            </p>
            
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                📊 Linear Symbology Standards Reference &amp; Specifications
              </h3>
              {/* Responsive Symbology Comparison Matrix Table */}
              <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-2xl">
                <table className="w-full text-left text-xs min-w-[450px]">
                  <thead>
                    <tr className="bg-white/10 border-b border-white/10 text-[10px] font-black uppercase tracking-wider text-slate-300">
                      <th className="p-3">Symbology Standard</th>
                      <th className="p-3">Character Set Allowed</th>
                      <th className="p-3">Check Digit Calc</th>
                      <th className="p-3">Typical Enterprise Uses</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-slate-400 font-medium">
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-3 font-bold text-teal-400">CODE-128</td>
                      <td className="p-3 text-[11px]">Full ASCII (Alphanumeric + Symbols)</td>
                      <td className="p-3 font-mono text-[11px]">Modulo 103 (Auto-solved)</td>
                      <td className="p-3 text-[11px]">Logistics, Freight, Inventory control</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-3 font-bold text-teal-400">CODE-39</td>
                      <td className="p-3 text-[11px]">Numbers, Uppercase letters, &amp; symbols</td>
                      <td className="p-3 font-mono text-[11px]">Optional Modulo 43</td>
                      <td className="p-3 text-[11px]">Automotive, Defense logistics, Industry IDs</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="p-3 font-bold text-teal-400">EAN-13</td>
                      <td className="p-3 text-[11px]">Strictly 12 numeric digits</td>
                      <td className="p-3 font-mono text-[11px]">Modulo 10 (Built-in check)</td>
                      <td className="p-3 text-[11px]">Point of Sale (Retail checkout barcodes)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                <h3 className="text-teal-400 font-bold text-sm mb-2 uppercase tracking-widest">Alphanumeric Code-128</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">Supports all letters, symbols, and numbers. Perfect for inventory counts and catalog marking sweeps.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                <h3 className="text-teal-400 font-bold text-sm mb-2 uppercase tracking-widest">Global EAN-13 Retail</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">Standard barcode layout for storefront retail checkouts with automatic checksum calculation safety.</p>
              </div>
            </div>
          </div>

          <div className="space-y-8 w-full">
            <div>
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-300 mb-2 flex items-center gap-3">
                <span className="text-xl">💡</span> Barcoding Guidelines &amp; FAQs
              </h3>
              <p className="text-slate-400 text-xs">Click questions to expand direct explanations.</p>
            </div>

            {/* Interactive SEO Accordion FAQs */}
            <div className="space-y-4">
              {[
                { 
                  q: "Which barcode standard should I choose for general logistics?", 
                  a: "Choose the high-density CODE-128 standard. It allows you to encode letters, numeric digits, and special characters automatically. This standard is universally accepted across shipping houses (FedEx, DHL), warehouse scanning sweeps, and asset tracking labels." 
                },
                { 
                  q: "What are the rules and limitations of EAN-13 barcodes?", 
                  a: "The international retail standard EAN-13 strictly allows 12 numeric digits. The 13th digit represents a solved check digit computed via standard modulo-10 algorithms (which our app handles automatically). If you enter letters or incorrect string lengths, the compiler cleans them to prevent scanning errors." 
                },
                { 
                  q: "What is a 'Quiet Zone' and how does it prevent scanning errors?", 
                  a: "A Quiet Zone is the blank, high-contrast margin space surrounding both ends of the dark printed bars. Standard rules require quiet zones to measure at least 10 times the width of your narrowest bar (X-dimension). Insufficient boundary spacing prevents optical scanner lasers from calibrating correctly." 
                },
                { 
                  q: "Are the data codes processed inside external server networks?", 
                  a: "ABSOLUTELY NOT. Our Bulk Barcode Generator runs entirely locally within your client sandbox environment using pure browser-based canvas rendering script logic. Your inventory data, company serial identifiers, and client names are never transmitted over network APIs, providing complete database confidentiality." 
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all hover:bg-white/10">
                  <button
                    onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                    className="w-full text-left p-5 font-black text-slate-200 flex justify-between items-center transition-colors hover:text-teal-400 focus:outline-none cursor-pointer"
                  >
                    <span className="text-xs md:text-sm flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-teal-400 rounded-full"></span>
                      {item.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${faqOpen === idx ? 'rotate-180' : ''}`} />
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-300 ${
                      faqOpen === idx ? 'max-h-60 opacity-100 px-5 pb-5 border-t border-white/5 pt-2' : 'max-h-0 opacity-0 pointer-events-none'
                    }`}
                  >
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      {item.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 relative z-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-5">Optimized by Toolina Digital Labs</p>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-slate-400 font-bold font-sans">Help improve our layout:</span>
            <StarRatingWidget rating={ratingInfo.rating} count={ratingInfo.count} onChange={() => {}} />
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes scan {
          0% { top: 3%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: 97%; opacity: 0; }
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
    </article>
  );
};

export default BarcodeGenerator;
