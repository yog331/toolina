import React, { useState, useEffect, useMemo } from 'react';
import AccompanyingText from '../components/AccompanyingText';
import ShareWidget from '../components/ShareWidget';
import SEO from '../components/SEO';
import StarRatingWidget from '../components/StarRatingWidget';
import { 
  Ruler, 
  Scale, 
  Droplet, 
  Maximize, 
  Thermometer, 
  Database, 
  Clock, 
  ArrowLeftRight, 
  Copy, 
  Check, 
  RotateCcw, 
  Info, 
  HelpCircle 
} from 'lucide-react';

interface Unit {
  id: string;
  name: string;
  factor: number; // Factor to convert to base unit
  symbol: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  baseUnit: string;
  units: Unit[];
}

const CATEGORIES: Category[] = [
  {
    id: 'length',
    name: 'Length',
    icon: <Ruler className="w-5 h-5" />,
    baseUnit: 'm',
    units: [
      { id: 'mm', name: 'Millimeters', factor: 0.001, symbol: 'mm' },
      { id: 'cm', name: 'Centimeters', factor: 0.01, symbol: 'cm' },
      { id: 'm', name: 'Meters', factor: 1, symbol: 'm' },
      { id: 'km', name: 'Kilometers', factor: 1000, symbol: 'km' },
      { id: 'in', name: 'Inches', factor: 0.0254, symbol: 'in' },
      { id: 'ft', name: 'Feet', factor: 0.3048, symbol: 'ft' },
      { id: 'yd', name: 'Yards', factor: 0.9144, symbol: 'yd' },
      { id: 'mi', name: 'Miles', factor: 1609.344, symbol: 'mi' },
      { id: 'nmi', name: 'Nautical Miles', factor: 1852, symbol: 'nmi' },
      { id: 'gaj', name: 'Gaj (Guz)', factor: 0.9144, symbol: 'gaj' }
    ]
  },
  {
    id: 'weight',
    name: 'Weight & Mass',
    icon: <Scale className="w-5 h-5" />,
    baseUnit: 'kg',
    units: [
      { id: 'mg', name: 'Milligrams', factor: 0.000001, symbol: 'mg' },
      { id: 'g', name: 'Grams', factor: 0.001, symbol: 'g' },
      { id: 'kg', name: 'Kilograms', factor: 1, symbol: 'kg' },
      { id: 't', name: 'Metric Tons', factor: 1000, symbol: 't' },
      { id: 'oz', name: 'Ounces', factor: 0.028349523, symbol: 'oz' },
      { id: 'lb', name: 'Pounds', factor: 0.45359237, symbol: 'lb' },
      { id: 'st', name: 'Stones', factor: 6.35029318, symbol: 'st' },
      { id: 'tola', name: 'Tola (Indian)', factor: 0.0116638, symbol: 'tola' },
      { id: 'maund', name: 'Maund (Mann)', factor: 37.324, symbol: 'maund' }
    ]
  },
  {
    id: 'volume',
    name: 'Volume',
    icon: <Droplet className="w-5 h-5" />,
    baseUnit: 'l',
    units: [
      { id: 'ml', name: 'Milliliters', factor: 0.001, symbol: 'ml' },
      { id: 'l', name: 'Liters', factor: 1, symbol: 'l' },
      { id: 'm3', name: 'Cubic Meters', factor: 1000, symbol: 'm³' },
      { id: 'floz', name: 'Fluid Ounces (US)', factor: 0.029573529, symbol: 'fl oz' },
      { id: 'cup', name: 'Cups (US)', factor: 0.236588236, symbol: 'cup' },
      { id: 'pt', name: 'Pints (US)', factor: 0.473176473, symbol: 'pt' },
      { id: 'qt', name: 'Quarts (US)', factor: 0.946352946, symbol: 'qt' },
      { id: 'gal', name: 'Gallons (US)', factor: 3.785411784, symbol: 'gal' }
    ]
  },
  {
    id: 'area',
    name: 'Area',
    icon: <Maximize className="w-5 h-5" />,
    baseUnit: 'm2',
    units: [
      { id: 'm2', name: 'Square Meters', factor: 1, symbol: 'm²' },
      { id: 'km2', name: 'Square Kilometers', factor: 1000000, symbol: 'km²' },
      { id: 'ft2', name: 'Square Feet', factor: 0.09290304, symbol: 'ft²' },
      { id: 'yd2', name: 'Square Yards', factor: 0.83612736, symbol: 'yd²' },
      { id: 'ac', name: 'Acres', factor: 4046.85642, symbol: 'ac' },
      { id: 'ha', name: 'Hectares', factor: 10000, symbol: 'ha' },
      { id: 'bigha', name: 'Bigha (Rajasthan)', factor: 2529.285, symbol: 'bigha' },
      { id: 'gaj2', name: 'Square Gaj', factor: 0.836127, symbol: 'sq gaj' },
      { id: 'guntha', name: 'Guntha', factor: 101.17, symbol: 'guntha' }
    ]
  },
  {
    id: 'temperature',
    name: 'Temperature',
    icon: <Thermometer className="w-5 h-5" />,
    baseUnit: 'C',
    units: [
      { id: 'C', name: 'Celsius', factor: 1, symbol: '°C' },
      { id: 'F', name: 'Fahrenheit', factor: 1, symbol: '°F' },
      { id: 'K', name: 'Kelvin', factor: 1, symbol: 'K' }
    ]
  },
  {
    id: 'data',
    name: 'Data Storage',
    icon: <Database className="w-5 h-5" />,
    baseUnit: 'B',
    units: [
      { id: 'b', name: 'Bits', factor: 0.125, symbol: 'b' },
      { id: 'B', name: 'Bytes', factor: 1, symbol: 'B' },
      { id: 'KB', name: 'Kilobytes (KB)', factor: 1024, symbol: 'KB' },
      { id: 'MB', name: 'Megabytes (MB)', factor: 1024 * 1024, symbol: 'MB' },
      { id: 'GB', name: 'Gigabytes (GB)', factor: 1024 * 1024 * 1024, symbol: 'GB' },
      { id: 'TB', name: 'Terabytes (TB)', factor: 1024 * 1024 * 1024 * 1024, symbol: 'TB' }
    ]
  },
  {
    id: 'time',
    name: 'Time',
    icon: <Clock className="w-5 h-5" />,
    baseUnit: 's',
    units: [
      { id: 'ms', name: 'Milliseconds', factor: 0.001, symbol: 'ms' },
      { id: 's', name: 'Seconds', factor: 1, symbol: 's' },
      { id: 'min', name: 'Minutes', factor: 60, symbol: 'min' },
      { id: 'h', name: 'Hours', factor: 3600, symbol: 'h' },
      { id: 'd', name: 'Days', factor: 86400, symbol: 'd' },
      { id: 'wk', name: 'Weeks', factor: 604800, symbol: 'wk' },
      { id: 'mo', name: 'Months (Avg)', factor: 2629743, symbol: 'mo' },
      { id: 'yr', name: 'Years (365d)', factor: 31536000, symbol: 'yr' }
    ]
  }
];

const DYNAMIC_SEO_CONTENT: Record<string, {
  title: string;
  text: string;
  formula: string;
  table: { from: string; to: string }[];
}> = {
  length: {
    title: "Mastering Length & Distance Conversions (दूरी कनवर्टर)",
    text: "Whether you are calculating distances for running, sizing up materials for a construction project, or doing homework, converting between units of length is a fundamental daily task. Our free calculator bridges the gap between the Metric System (standardized as SI units like meters, centimeters, and kilometers used globally) and the Imperial System (including feet, inches, yards, and miles used extensively in the US and UK). We also support the Nautical Mile (nmi) for aviation and marine navigation, alongside localized Indian builders' Gaj (Sq/linear गज) to offer local support.",
    formula: "1 Meter (m) = 100 Centimeters (cm) = 1000 Millimeters (mm). 1 Inch (in) = 2.54 Centimeters (cm). 1 Foot (ft) = 12 Inches (in). 1 Mile (mi) = 1.60934 Kilometers (km).",
    table: [
      { from: "1 Meter (m)", to: "100 Centimeters (cm)" },
      { from: "1 Kilometer (km)", to: "0.6214 Miles (mi)" },
      { from: "1 Inch (in)", to: "2.54 Centimeters (cm)" },
      { from: "1 Foot (ft)", to: "30.48 Centimeters (cm)" },
      { from: "1 Yard (yd)", to: "3 Feet (ft)" },
      { from: "1 Gaj (Guz)", to: "3 Feet (ft)" }
    ]
  },
  weight: {
    title: "Comprehensive Weight & Mass Converter (वजन बदलने की गाइड)",
    text: "Mass and weight conversions are standard across medical applications, baking recipes, scientific labs, and commercial shipping. While metric units like grams (g) and kilograms (kg) are standard globally, imperial units like ounces (oz) and pounds (lb) are common in retail and gym weights. For specialized Indian trade, gold is weighed in Tolas (where 1 Tola ≈ 11.66 grams), and agricultural commodities are measured in Maund (Mann) which equates to 40 seers or approximately 37.324 kg.",
    formula: "1 Kilogram (kg) = 1000 Grams (g). 1 Pound (lb) = 16 Ounces (oz) = 0.45359237 Kilograms (kg). 1 Metric Ton (t) = 1000 Kilograms (kg). 1 Maund (Mann) = 37.324 Kilograms (kg).",
    table: [
      { from: "1 Kilogram (kg)", to: "2.2046 Pounds (lb)" },
      { from: "1 Pound (lb)", to: "453.59 Grams (g)" },
      { from: "1 Ounce (oz)", to: "28.35 Grams (g)" },
      { from: "1 Stone (st)", to: "14 Pounds (lb)" },
      { from: "1 Tola (Indian)", to: "11.6638 Grams (g)" },
      { from: "1 Maund (Mann)", to: "37.324 Kilograms (kg)" }
    ]
  },
  volume: {
    title: "Accurate Liquid Capacity & Volume Converter (आयतन कनवर्टर)",
    text: "Converting volume is crucial for chemistry experiments, baking recipes, and industrial manufacturing. Metric volume revolves around liters (l) and milliliters (ml). Imperial and US customary volume units, however, include fluid ounces, cups, pints, quarts, and gallons. Since US gallons are slightly smaller than UK Imperial gallons, our calculator aligns strictly with US standard liquid standards to match the most searched measurement scales.",
    formula: "1 Liter (l) = 1000 Milliliters (ml). 1 US Gallon (gal) = 3.78541 Liters (l) = 4 US Quarts (qt) = 8 US Pints (pt) = 16 US Cups (cup) = 128 US Fluid Ounces (fl oz).",
    table: [
      { from: "1 Liter (l)", to: "1000 Milliliters (ml)" },
      { from: "1 US Gallon (gal)", to: "3.7854 Liters (l)" },
      { from: "1 US Fluid Ounce (fl oz)", to: "29.5735 Milliliters (ml)" },
      { from: "1 US Cup (cup)", to: "236.59 Milliliters (ml)" },
      { from: "1 Cubic Meter (m³)", to: "1000 Liters (l)" },
      { from: "1 US Pint (pt)", to: "16 US Fluid Ounces (fl oz)" }
    ]
  },
  area: {
    title: "Advanced Area, Real Estate & Land Unit Converter (बीघा और गज कनवर्टर)",
    text: "Land and property area conversions can be extremely confusing because of local variations. In official and agricultural contexts, standard international systems like square meters (m²), square feet (sq ft), acres, and hectares are used. However, across northern and western India (especially Rajasthan, Punjab, and Haryana), traditional land units like Bigha and Sq Gaj are highly popular. A standard Rajasthan Bigha translates to exactly 27,225 sq ft, making our calculator a premium tool for local farmers, buyers, and builders.",
    formula: "1 Acre = 43,560 Square Feet (sq ft) = 4,046.85 Square Meters (m²). 1 Hectare = 10,000 Square Meters (m²). 1 Bigha (Rajasthan) = 27,225 Sq Ft = 2,529.285 Sq Meters (m²). 1 Square Gaj = 9 Sq Ft.",
    table: [
      { from: "1 Acre (ac)", to: "43,560 Square Feet (sq ft)" },
      { from: "1 Hectare (ha)", to: "2.4711 Acres (ac)" },
      { from: "1 Rajasthan Bigha", to: "27,225 Square Feet (sq ft)" },
      { from: "1 Rajasthan Bigha", to: "2,529.285 Square Meters (m²)" },
      { from: "1 Square Gaj (sq gaj)", to: "9 Square Feet (sq ft)" },
      { from: "1 Square Kilometer (km²)", to: "247.105 Acres (ac)" }
    ]
  },
  temperature: {
    title: "Precision Temperature Scale Converter (तापमान बदलने का फॉर्मूला)",
    text: "Unlike length or weight which start at a true zero point, temperature scales use distinct baselines. Celsius (°C) is based on the freezing and boiling points of water. Fahrenheit (°F) uses a different scale common in the United States. Kelvin (K) is the SI base unit of thermodynamic temperature where 0 K represents absolute zero. Converting between these requires specific algebraic formulas rather than standard multiplication.",
    formula: "Celsius to Fahrenheit: (°C × 9/5) + 32 = °F. Fahrenheit to Celsius: (°F - 32) × 5/9 = °C. Celsius to Kelvin: °C + 273.15 = K.",
    table: [
      { from: "0° Celsius (°C)", to: "32° Fahrenheit (°F)" },
      { from: "100° Celsius (°C)", to: "212° Fahrenheit (°F)" },
      { from: "0° Kelvin (K)", to: "-273.15° Celsius (°C)" },
      { from: "98.6° Fahrenheit (°F)", to: "37° Celsius (°C) (Body Temp)" },
      { from: "-40° Celsius (°C)", to: "-40° Fahrenheit (°F) (Equal Point)" },
      { from: "300° Kelvin (K)", to: "26.85° Celsius (°C)" }
    ]
  },
  data: {
    title: "Binary Data Storage & File Size Converter (डाटा साइज कनवर्टर)",
    text: "Computers store information in binary format. A single Bit represents a 0 or 1, and 8 Bits form 1 Byte. While consumer drive packaging often lists sizes in decimal multiples (where 1 KB = 1000 Bytes), operating systems calculate storage using the strict binary base-2 standard (where 1 KB = 1024 Bytes). Our professional developer-friendly converter applies standard binary calculations (1024-based multipliers) for high-fidelity technical calculations.",
    formula: "1 Byte (B) = 8 Bits (b). 1 Kilobyte (KB) = 1024 Bytes. 1 Megabyte (MB) = 1024 Kilobytes. 1 Gigabyte (GB) = 1024 Megabytes. 1 Terabyte (TB) = 1024 Gigabytes.",
    table: [
      { from: "1 Byte (B)", to: "8 Bits (b)" },
      { from: "1 Megabyte (MB)", to: "1,048,576 Bytes (B)" },
      { from: "1 Gigabyte (GB)", to: "1,024 Megabytes (MB)" },
      { from: "1 Terabyte (TB)", to: "1,024 Gigabytes (GB)" },
      { from: "1 Kilobyte (KB)", to: "1,024 Bytes (B)" },
      { from: "1 Megabyte (MB)", to: "8,192 Kilobits (Kb)" }
    ]
  },
  time: {
    title: "Universal Time Interval & Duration Converter (समय अवधि कनवर्टर)",
    text: "Time is calculated using sexagesimal (base-60) systems for seconds and minutes, standard 24-hour systems for days, and standard astronomical calculations for weeks, months, and years. This tool converts between precise scientific intervals (milliseconds and seconds) and calendar units (hours, days, weeks, average months, and 365-day years), ensuring absolute mathematical correctness for planning, homework, and software scheduling.",
    formula: "1 Minute (min) = 60 Seconds (s). 1 Hour (h) = 60 Minutes (min) = 3600 Seconds. 1 Day (d) = 24 Hours. 1 Week (wk) = 7 Days. 1 Year (yr) = 365 Days.",
    table: [
      { from: "1 Hour (h)", to: "3,600 Seconds (s)" },
      { from: "1 Day (d)", to: "1,440 Minutes (min)" },
      { from: "1 Week (wk)", to: "168 Hours (h)" },
      { from: "1 Year (yr)", to: "8,760 Hours (h)" },
      { from: "1 Average Month (mo)", to: "30.44 Days (d)" },
      { from: "1 Day (d)", to: "86,400,000 Milliseconds (ms)" }
    ]
  }
};

const UniversalConverter: React.FC = () => {
  const [ratingInfo, setRatingInfo] = useState<{rating: number, count: number}>({ rating: 4.8, count: 182 });
  
  // States
  const [activeCategoryId, setActiveCategoryId] = useState('length');
  const [fromUnitId, setFromUnitId] = useState('m');
  const [toUnitId, setToUnitId] = useState('cm');
  const [inputValue, setInputValue] = useState<string>('1');
  const [outputValue, setOutputValue] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [copiedMatrixId, setCopiedMatrixId] = useState<string | null>(null);

  // Dynamic SEO Text Lookups
  const dynamicSeo = useMemo(() => {
    return DYNAMIC_SEO_CONTENT[activeCategoryId] || DYNAMIC_SEO_CONTENT.length;
  }, [activeCategoryId]);

  // Get active category details
  const activeCategory = useMemo(() => {
    return CATEGORIES.find(c => c.id === activeCategoryId) || CATEGORIES[0];
  }, [activeCategoryId]);

  // Handle active category change, reset defaults
  const handleCategoryChange = (catId: string) => {
    setActiveCategoryId(catId);
    const cat = CATEGORIES.find(c => c.id === catId) || CATEGORIES[0];
    
    // Pick first two units as defaults
    if (cat.units.length >= 2) {
      setFromUnitId(cat.units[0].id);
      setToUnitId(cat.units[1].id);
    } else {
      setFromUnitId(cat.units[0].id);
      setToUnitId(cat.units[0].id);
    }
  };

  // Safe numerical parser
  const numericInput = useMemo(() => {
    const val = parseFloat(inputValue);
    return isNaN(val) ? 0 : val;
  }, [inputValue]);

  // Calculate standard/custom conversions
  const performConversion = (val: number, from: string, to: string, catId: string): number => {
    if (from === to) return val;

    if (catId === 'temperature') {
      // Custom temperature conversions
      if (from === 'C' && to === 'F') return (val * 9/5) + 32;
      if (from === 'C' && to === 'K') return val + 273.15;
      if (from === 'F' && to === 'C') return (val - 32) * 5/9;
      if (from === 'F' && to === 'K') return ((val - 32) * 5/9) + 273.15;
      if (from === 'K' && to === 'C') return val - 273.15;
      if (from === 'K' && to === 'F') return ((val - 273.15) * 9/5) + 32;
      return val;
    }

    // Standard multipliers
    const fromUnit = activeCategory.units.find(u => u.id === from);
    const toUnit = activeCategory.units.find(u => u.id === to);
    if (!fromUnit || !toUnit) return val;

    // Convert to base unit, then convert to target unit
    const valueInBase = val * fromUnit.factor;
    return valueInBase / toUnit.factor;
  };

  // Dynamic conversion effect
  useEffect(() => {
    const result = performConversion(numericInput, fromUnitId, toUnitId, activeCategoryId);
    
    // Format elegantly (remove trailing zeros for integers, limit to max 8 decimal places for decimals)
    if (isNaN(result)) {
      setOutputValue('0');
    } else {
      const formatted = Number(result.toFixed(8)).toString();
      setOutputValue(formatted);
    }
  }, [numericInput, fromUnitId, toUnitId, activeCategoryId, activeCategory]);

  // Swap units handler
  const handleSwap = () => {
    const prevFrom = fromUnitId;
    setFromUnitId(toUnitId);
    setToUnitId(prevFrom);
    
    // Also swap values if applicable
    const parsedOutput = parseFloat(outputValue);
    if (!isNaN(parsedOutput) && parsedOutput !== 0) {
      setInputValue(Number(parsedOutput.toFixed(8)).toString());
    }
  };

  // Quick reset
  const handleReset = () => {
    setInputValue('1');
  };

  // Copy output to clipboard
  const copyToClipboard = (text: string, isMatrix: boolean, matrixId: string | null = null) => {
    navigator.clipboard.writeText(text).then(() => {
      if (isMatrix) {
        setCopiedMatrixId(matrixId);
        setTimeout(() => setCopiedMatrixId(null), 1500);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    }).catch(err => console.error('Could not copy text: ', err));
  };

  // Find active unit objects
  const fromUnitObj = useMemo(() => activeCategory.units.find(u => u.id === fromUnitId), [activeCategory, fromUnitId]);
  const toUnitObj = useMemo(() => activeCategory.units.find(u => u.id === toUnitId), [activeCategory, toUnitId]);

  // Generate formula text
  const formulaText = useMemo(() => {
    if (!fromUnitObj || !toUnitObj) return '';
    
    if (activeCategoryId === 'temperature') {
      if (fromUnitId === 'C' && toUnitId === 'F') return `(Value × 9/5) + 32 = Result`;
      if (fromUnitId === 'C' && toUnitId === 'K') return `Value + 273.15 = Result`;
      if (fromUnitId === 'F' && toUnitId === 'C') return `(Value - 32) × 5/9 = Result`;
      if (fromUnitId === 'F' && toUnitId === 'K') return `((Value - 32) × 5/9) + 273.15 = Result`;
      if (fromUnitId === 'K' && toUnitId === 'C') return `Value - 273.15 = Result`;
      if (fromUnitId === 'K' && toUnitId === 'F') return `((Value - 273.15) × 9/5) + 32 = Result`;
      return 'Equal Units';
    }

    const conversionFactor = fromUnitObj.factor / toUnitObj.factor;
    const formattedFactor = Number(conversionFactor.toFixed(8)).toString();
    return `Value × ${formattedFactor} = Result`;
  }, [fromUnitObj, toUnitObj, activeCategoryId, fromUnitId, toUnitId]);

  // Compute conversion table for all units in category
  const matrixConversions = useMemo(() => {
    return activeCategory.units.map(unit => {
      const value = performConversion(numericInput, fromUnitId, unit.id, activeCategoryId);
      const formatted = Number(value.toFixed(8)).toString();
      return {
        ...unit,
        value: formatted
      };
    });
  }, [numericInput, fromUnitId, activeCategoryId, activeCategory]);

  return (
    <article className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <SEO 
        title="Universal Unit Converter | Length, Area, Weight & Volume - Toolina" 
        description="Calculate conversions instantly across Length, Weight, Area (Bigha, Gaj, Hectare), Volume, Temperature, Data, and Time. High-precision browser-based converter." 
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "SoftwareApplication",
              "name": "Universal Unit Converter",
              "applicationCategory": "UtilityApplication",
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
            },
            {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How to convert units online with high precision?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Choose the category (Length, Area, Weight, Volume, Temperature, Time, or Data) using the top navigation bar. Select your source and target units, enter the value, and the converter will instantly calculate the results using accurate multipliers."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How is a local Rajasthani Bigha converted?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Under the Area tab, we support local Indian measurements. A standard Rajasthani Bigha is calculated as 27,225 square feet (or approximately 2,529.285 square meters)."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How do temperature conversions differ from other units?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "While most units are converted using simple linear multiplication factors, temperature scales like Celsius, Fahrenheit, and Kelvin are calculated using dynamic offset formulas (e.g., Celsius = (Fahrenheit - 32) × 5/9)."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is my input data safe and private?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, absolutely. All calculations are executed on-the-fly directly inside your local web browser. No data ever leaves your device or is transmitted to any external servers."
                  }
                }
              ]
            }
          ]
        }}
      />

      <header className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-black uppercase tracking-wider">
          ⚖️ Precision Utility
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-slate-800 leading-tight">
          Universal <span className="text-teal-600">Unit Converter</span>
        </h1>
        <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed">
          Instantly convert units of measurement for length, area (including local Bigha and Gaj), mass, volume, temperature, time, and data storage. Fully private and fast.
        </p>
      </header>

      {/* Category Tabs */}
      <section className="bg-white p-2 rounded-2xl md:rounded-[2rem] border border-slate-200/80 shadow-sm overflow-x-auto scrollbar-none flex gap-1.5 items-center">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl md:rounded-[1.2rem] font-bold text-xs md:text-sm whitespace-nowrap transition-all duration-300 shrink-0 cursor-pointer ${
              activeCategoryId === cat.id
                ? 'bg-teal-600 text-white shadow-md shadow-teal-500/10'
                : 'text-slate-600 hover:bg-slate-50 hover:text-teal-600'
            }`}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </section>

      {/* Two Way Converter Interface */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Conversion Controls (7 Columns) */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-wider">
              {activeCategory.name} Calculations
            </h2>
            <button
              onClick={handleReset}
              className="p-2 text-slate-400 hover:text-teal-600 hover:bg-slate-50 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold"
              title="Reset Converter"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-9 gap-4 md:gap-2 items-center">
            
            {/* Input / From Unit Card */}
            <div className="md:col-span-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-2">
              <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">From Unit</label>
              <select
                value={fromUnitId}
                onChange={(e) => setFromUnitId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
              >
                {activeCategory.units.map(unit => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} ({unit.symbol})
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="0.00"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-mono font-bold text-lg text-slate-800 outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            {/* Swap Button (1 Column) */}
            <div className="md:col-span-1 flex justify-center py-2 md:py-0">
              <button
                onClick={handleSwap}
                className="bg-teal-50 hover:bg-teal-600 text-teal-600 hover:text-white p-3.5 rounded-full transition-all duration-300 shadow-sm border border-teal-100/40 hover:rotate-180 cursor-pointer"
                title="Swap Units"
              >
                <ArrowLeftRight className="w-4 h-4 md:rotate-90" />
              </button>
            </div>

            {/* Output / To Unit Card */}
            <div className="md:col-span-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-2">
              <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">To Unit</label>
              <select
                value={toUnitId}
                onChange={(e) => setToUnitId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
              >
                {activeCategory.units.map(unit => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} ({unit.symbol})
                  </option>
                ))}
              </select>
              <div className="relative">
                <input
                  type="text"
                  value={outputValue}
                  readOnly
                  placeholder="Result"
                  className="w-full bg-slate-100/80 border border-slate-200/60 rounded-xl px-4 py-3 font-mono font-bold text-lg text-slate-700 outline-none pr-12"
                />
                <button
                  onClick={() => copyToClipboard(outputValue, false)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-white transition-all cursor-pointer"
                  title="Copy Result"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

          </div>

          {/* Formula Display */}
          {formulaText && (
            <div className="bg-teal-50/40 p-4 rounded-xl border border-teal-100/40 flex items-start gap-3">
              <Info className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-teal-800">Mathematical Formula</p>
                <code className="text-xs font-mono font-bold text-teal-900 block bg-white/60 px-2 py-1 rounded border border-teal-100/20 inline-block">
                  {formulaText}
                </code>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Calculated based on standard base ratios with up to 8 decimal decimal points accuracy.
                </p>
              </div>
            </div>
          )}

          {/* Result Highlight Card */}
          {inputValue && (
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-6 rounded-2xl border border-teal-100 text-center space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">Conversion Equivalent</span>
              <p className="text-xl md:text-2xl font-black text-slate-800">
                <span className="font-mono text-teal-700">{inputValue}</span> {fromUnitObj?.name} = <span className="font-mono text-emerald-700">{outputValue}</span> {toUnitObj?.name}
              </p>
            </div>
          )}

        </div>

        {/* Dynamic Multi-Unit Conversion Grid (5 Columns) */}
        <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-wider">
              Quick Matrix View
            </h2>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
              Equivalents of your input <span className="font-bold font-mono">{inputValue} {fromUnitObj?.symbol}</span> across all available units.
            </p>
          </div>

          <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
            {matrixConversions.map((unit) => {
              const isFromUnit = unit.id === fromUnitId;
              const isToUnit = unit.id === toUnitId;
              
              return (
                <div
                  key={unit.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                    isFromUnit 
                      ? 'bg-slate-50 border-slate-300/60 ring-2 ring-slate-100/50' 
                      : isToUnit
                        ? 'bg-teal-50/40 border-teal-200 ring-2 ring-teal-50'
                        : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                      {unit.name} 
                      {isFromUnit && <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[8px] font-black tracking-normal uppercase">Source</span>}
                      {isToUnit && <span className="bg-teal-500 text-white px-1.5 py-0.5 rounded text-[8px] font-black tracking-normal uppercase">Target</span>}
                    </span>
                    <p className="text-sm font-mono font-bold text-slate-700 break-all select-all">
                      {unit.value} <span className="text-xs font-sans text-slate-400 font-medium">{unit.symbol}</span>
                    </p>
                  </div>
                  
                  <div className="flex gap-1.5 items-center">
                    {/* Selectable */}
                    <button
                      onClick={() => setFromUnitId(unit.id)}
                      disabled={isFromUnit}
                      className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-all ${
                        isFromUnit 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-teal-600'
                      }`}
                      title="Set as From Unit"
                    >
                      Set Src
                    </button>
                    
                    <button
                      onClick={() => copyToClipboard(unit.value, true, unit.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-slate-50 transition-all cursor-pointer"
                      title="Copy Value"
                    >
                      {copiedMatrixId === unit.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </section>

      {/* Dynamic SEO Cheat Sheet & Reference Table */}
      <section className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase text-teal-600 tracking-wider">Interactive Reference Guide</span>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight mt-0.5">
              {dynamicSeo.title}
            </h2>
          </div>
          <div className="bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-100 text-[11px] text-teal-800 font-bold self-start sm:self-auto">
            ⚡ Quick Reference Cheat Sheet
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Informational Text & Explanations (7 Columns) */}
          <div className="lg:col-span-7 space-y-5">
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              {dynamicSeo.text}
            </p>
            
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2.5">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <Info className="w-4 h-4 text-teal-500" />
                Standard Mathematical Conversion Ratios
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Standard multiplier scale used by academic bureaus, scientific organizations, and public registries:
              </p>
              <div className="bg-white p-3 rounded-xl border border-slate-200/60 font-mono text-xs text-slate-800 font-bold select-all leading-relaxed break-all">
                {dynamicSeo.formula}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex flex-wrap gap-x-6 gap-y-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                <span className="text-teal-500">✓</span> 100% Client-Side
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                <span className="text-teal-500">✓</span> High-Precision Multipliers
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                <span className="text-teal-500">✓</span> Local Rajasthani Definition Added
              </div>
            </div>
          </div>

          {/* Cheat Sheet Precalculated Conversion Table (5 Columns) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 to-teal-50/20 p-5 rounded-2xl border border-slate-100/80 space-y-4">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              Common Equivalent Cheat Sheet ({activeCategory.name})
            </h3>
            
            <div className="divide-y divide-slate-100 bg-white rounded-xl border border-slate-200/60 overflow-hidden shadow-sm">
              {dynamicSeo.table.map((row, idx) => (
                <div key={idx} className="flex justify-between items-center px-4 py-3 text-xs font-medium hover:bg-slate-50 transition-colors">
                  <span className="text-slate-500 font-bold">{row.from}</span>
                  <span className="text-slate-400 font-mono">➡</span>
                  <span className="text-slate-800 font-mono font-bold bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{row.to}</span>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              *All calculations are evaluated locally inside your web browser. Absolutely free, safe, and private.
            </p>
          </div>

        </div>
      </section>

      {/* Structured SEO Guide Content */}
      <footer className="bg-slate-900 text-white p-8 md:p-12 rounded-[3rem] space-y-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative z-10">
          
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight leading-tight">
              About the <span className="text-teal-400">Universal Unit Converter</span> Tool
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm">
              Our <strong>Universal Unit Converter</strong> provides high-precision calculations for everyday as well as specialized academic, real estate, and scientific tasks. From length conversions to localized land area calculations such as the <strong>Rajasthan Bigha</strong>, <strong>Gaj</strong>, and standard <strong>Hectares</strong>, it handles standard multiplier formulas effortlessly in the client-side sandbox.
            </p>
            <p className="text-slate-400 leading-relaxed text-sm">
              Unlike online portals that reload pages or store custom input metrics on remote databases, our system utilizes lightweight local Javascript execution. This guarantees 100% data privacy and near-instant processing capabilities.
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="text-teal-400 font-bold text-sm mb-1 uppercase tracking-widest">Multi-View Grid</h3>
                <p className="text-[10px] text-slate-400">See equivalents in all metric units instantly without changing dropdown selectors.</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="text-teal-400 font-bold text-sm mb-1 uppercase tracking-widest">Local Indian Units</h3>
                <p className="text-[10px] text-slate-400">Pre-configured local Rajasthani area (Bigha, Sq Gaj) and weight (Maund, Tola) units.</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-teal-400" />
                Frequently Asked Questions (FAQ)
              </h3>
              <ul className="space-y-4">
                {[
                  { 
                    q: "How accurate are the land area calculations for Bigha?", 
                    a: "We use the standard Rajasthani definition of a Bigha, which equals 27,225 square feet (or approximately 2,529.285 square meters). Be sure to check with local district land records for regional sub-definitions." 
                  },
                  { 
                    q: "How does the Temperature conversion work?", 
                    a: "Unlike linear units with standard multiplier scales, temperature uses dynamic offsets (e.g., Celsius = (Fahrenheit - 32) × 5/9). Our algorithms apply distinct mathematical formulas for all Celsius, Fahrenheit, and Kelvin states." 
                  },
                  { 
                    q: "Is my converted data stored online?", 
                    a: "Absolutely not. All operations are processed on-the-fly directly inside your local web browser. No data ever leaves your computer." 
                  },
                  { 
                    q: "Does it support data storage units like Gigabytes and Megabytes?", 
                    a: "Yes! It fully supports standard binary conversions (1024-based system) from bits and bytes up to terabytes, making it useful for developers and network administrators." 
                  }
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
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
            Crafted securely with 100% Offline client-side sandbox execution
          </p>
        </div>
      </footer>

      {/* Hinglish SEO & Rich Text Section */}
      <section className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            🚀 Popular Conversions & Search Guide (यूनिट बदलने की गाइड)
          </h2>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Quickly understand how to perform local and standard conversions with our step-by-step Hinglish guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              📐 Land Area (बीघा और गज कैलकुलेशन)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Rajasthan state me <strong>Bigha se Square Feet nikalna</strong> ya fir <strong>Bigha se Hectare convert karna</strong> kaafi aasan hai. Hamara tool standard land conversions support karta hai:
            </p>
            <ul className="text-[11px] text-slate-500 space-y-1.5 list-disc pl-4 font-medium">
              <li>1 Bigha (Rajasthan) = 27,225 Sq Ft</li>
              <li>1 Bigha = 2,529.285 Square Meters</li>
              <li><strong>Gaj se Square Feet badalna</strong>: 1 Gaj = 9 Sq Ft (approx)</li>
            </ul>
          </div>

          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              🌡️ Temperature (तापमान बदलना)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Agar aapko <strong>Celsius se Fahrenheit me temperature convert karna</strong> hai, toh simple mathematical offset formula apply hota hai:
            </p>
            <ul className="text-[11px] text-slate-500 space-y-1.5 list-disc pl-4 font-medium">
              <li><strong>Celsius se Fahrenheit formula</strong>: (Celsius × 9/5) + 32</li>
              <li><strong>Fahrenheit se Celsius formula</strong>: (Fahrenheit - 32) × 5/9</li>
              <li>Aap instantly Kelvin, Celsius aur Fahrenheit switch kar sakte hain.</li>
            </ul>
          </div>

          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              ⚖️ Weight & Mass (वजन कनवर्टर)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Indian units jaise ki <strong>Maund ya Mann se Kilogram nikalna</strong>, aur <strong>Tola se Gram calculate karna</strong> ab behad simple hai:
            </p>
            <ul className="text-[11px] text-slate-500 space-y-1.5 list-disc pl-4 font-medium">
              <li>1 Maund (Rajasthan/North India) = 37.324 Kg</li>
              <li>1 Tola = 11.6638 Grams</li>
              <li><strong>Pound se Kg me convert karna</strong>: 1 Lb = 0.4535 Kg</li>
            </ul>
          </div>
        </div>

        <div className="bg-teal-50/30 p-4 rounded-xl border border-teal-100/40">
          <h4 className="text-xs font-black text-teal-800 uppercase tracking-wider mb-2">
            🔍 Hinglish Quick Search Keywords Index (अक्सर सर्च किए जाने वाले कीवर्ड्स)
          </h4>
          <div className="flex flex-wrap gap-2">
            {[
              "Length meter se centimeter converter",
              "Bigha ko Square feet me kaise badle",
              "Rajasthan bigha in square meters",
              "Unit converter calculator online",
              "Kilogram se pound converter online",
              "Data storage bytes se gigabytes calculator",
              "Gallon se liter conversion online",
              "Celsius to Fahrenheit conversion kaise kare",
              "Rajasthan land area conversion calculator"
            ].map((kw, idx) => (
              <span key={idx} className="bg-white px-2.5 py-1 rounded-lg border border-slate-200/60 text-[11px] font-medium text-slate-600 hover:text-teal-600 hover:border-teal-300 transition-all cursor-pointer">
                # {kw}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Standard App Widgets */}
      <AccompanyingText 
        toolName="Universal Unit Converter"
        howItWorks="This unit converter leverages custom client-side TypeScript multipliers and linear scaling formulas to yield real-time results in your browser. When you switch between categories, our algorithm automatically shifts ratios to match international standards."
        whyItsUseful="Instead of forcing you to search multiple web portals for length, mass, and temperature offsets, this consolidated workspace delivers comprehensive multi-unit grids, exact formulas, and support for specialized Indian measurements in a sleek layout."
        faqs={[
          { q: "Which unit systems are supported?", a: "We support Metric (SI), Imperial, and traditional Indian systems (Bigha, Maund, Tola, Gaj) to serve all scientific and local calculations." },
          { q: "Is there a limit to how many calculations I can perform?", a: "No. The converter is fully free, open-source, and has no throttling or rate limits." },
          { q: "Does the app support negative values?", a: "Yes, specifically helpful for temperature scales such as Fahrenheit or Celsius." }
        ]}
      />

      <div className="max-w-3xl mx-auto my-8">
        <StarRatingWidget 
          toolId="universal-unit-converter" 
          defaultRating={4.8} 
          defaultCount={182} 
          onRatingChange={(rating, count) => setRatingInfo({ rating, count })} 
        />
      </div>

      <ShareWidget title="Universal Unit Converter" />

    </article>
  );
};

export default UniversalConverter;
