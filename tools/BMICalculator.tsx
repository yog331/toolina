
import React, { useState, useEffect } from 'react';
import AccompanyingText from '../components/AccompanyingText';
import ShareWidget from '../components/ShareWidget';
import SEO from '../components/SEO';
import StarRatingWidget from '../components/StarRatingWidget';

interface BMIStatus {
  text: string;
  color: string;
  bg: string;
  border: string;
  description: string;
}

const BMICalculator: React.FC = () => {
  const [ratingInfo, setRatingInfo] = useState<{rating: number, count: number}>({ rating: 4.7, count: 297 });

    const [weight, setWeight] = useState<number | ''>(70);
  const [height, setHeight] = useState<number | ''>(175);
  const [bmi, setBmi] = useState<number | null>(null);

  useEffect(() => {
    // SEO Metadata Injection
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Professional BMI Calculator for adults. Calculate your Body Mass Index (BMI) and determine your health status (Underweight, Normal, Overweight, or Obese) instantly. Fast and secure.");
    }

    // Structured Data (JSON-LD) for SEO
    const scriptId = "bmi-json-ld";
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Yogi BMI Analyzer",
      "description": "Calculate Body Mass Index (BMI) and health risk assessments.",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web"
    });

    return () => {
      script?.remove();
    };
  }, []);

  const calculate = () => {
    if (!weight || !height) return;
    const h = (height as number) / 100;
    const w = weight as number;
    setBmi(parseFloat((w / (h * h)).toFixed(1)));
  };

  const getStatus = (val: number): BMIStatus => {
    if (val < 18.5) return { 
      text: 'Underweight', 
      color: 'text-blue-600', 
      bg: 'bg-blue-50', 
      border: 'border-blue-100',
      description: 'You are below the healthy weight range. Consider consulting a healthcare provider.' 
    };
    if (val < 25) return { 
      text: 'Healthy Weight', 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50', 
      border: 'border-emerald-100',
      description: 'You are in the ideal range. Maintain your lifestyle with a balanced diet and exercise.' 
    };
    if (val < 30) return { 
      text: 'Overweight', 
      color: 'text-orange-600', 
      bg: 'bg-orange-50', 
      border: 'border-orange-100',
      description: 'You are slightly above the healthy range. Focus on physical activity and nutrition.' 
    };
    return { 
      text: 'Obesity', 
      color: 'text-red-600', 
      bg: 'bg-red-50', 
      border: 'border-red-100',
      description: 'You are in the obese range, which may increase health risks. Professional advice is recommended.' 
    };
  };

  return (
    <article className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <SEO title="BMI Calculator - Body Mass Index Finder & Health Status | Toolina" description="Free professional calculator and internal tool by Toolina. Accurate, fast, and easy to use." 
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "BMI Calculator - Body Mass Index Finder & Health Status",
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
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-50 rounded-bl-[15rem] -mr-20 -mt-20 opacity-50 blur-3xl"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-orange-500 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center text-3xl md:text-4xl shadow-xl shadow-orange-100 text-white shrink-0">
              🏃
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
                <span className="text-orange-600">BMI</span> Calculator
              </h1>
              <p className="text-slate-500 font-medium text-xs md:text-lg mt-1 italic">Professional Body Mass Index Calculator</p>
            </div>
          </div>
          <div className="bg-slate-100 px-4 py-2 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">
            WHO Standard Assessment
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
          <section className="space-y-6 flex flex-col justify-center">
            <div className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-inner space-y-6">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span> Metrics Input
              </h2>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 ml-1">Body Weight (kg)</label>
                  <input 
                    type="number" 
                    value={weight}
                    onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-orange-50 transition-all font-mono font-bold text-slate-800"
                    placeholder="e.g. 70"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 ml-1">Height (cm)</label>
                  <input 
                    type="number" 
                    value={height}
                    onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-orange-50 transition-all font-mono font-bold text-slate-800"
                    placeholder="e.g. 175"
                  />
                </div>
              </div>

              <button
                onClick={calculate}
                className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                Calculate Health Index
              </button>
            </div>
          </section>

          <section className="flex flex-col items-center justify-center min-h-[300px]">
            {!bmi ? (
              <div className="text-center space-y-4 animate-in fade-in duration-700">
                <div className="text-6xl grayscale opacity-20">🧘‍♂️</div>
                <p className="text-xs font-black text-slate-300 uppercase tracking-[0.3em]">Awaiting Input</p>
                <p className="text-[10px] text-slate-400 max-w-[200px] font-medium leading-relaxed">Enter your weight and height to reveal your Body Mass Index results.</p>
              </div>
            ) : (
              <div className="w-full space-y-6 animate-in zoom-in duration-500">
                <div className={`p-8 md:p-10 rounded-[3rem] border ${getStatus(bmi).bg} ${getStatus(bmi).border} text-center shadow-sm relative overflow-hidden group`}>
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform text-slate-900">
                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                  </div>
                  
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Your Score</span>
                  <div className={`text-7xl md:text-8xl font-black tracking-tighter mb-2 ${getStatus(bmi).color}`}>{bmi}</div>
                  <div className={`inline-flex px-4 py-1 rounded-full ${getStatus(bmi).color} bg-white border border-current/10 font-black text-xs uppercase tracking-widest mb-4`}>
                    {getStatus(bmi).text}
                  </div>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed max-w-xs mx-auto">
                    {getStatus(bmi).description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
                      <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Ideal Range</span>
                      <p className="text-xl font-bold text-emerald-600">18.5 - 24.9</p>
                   </div>
                   <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
                      <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Status Class</span>
                      <p className="text-xl font-bold text-slate-800">WHO Grade 1</p>
                   </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Underweight', range: '< 18.5', color: 'bg-blue-500' },
          { label: 'Healthy', range: '18.5 - 24.9', color: 'bg-emerald-500' },
          { label: 'Overweight', range: '25.0 - 29.9', color: 'bg-orange-500' },
          { label: 'Obese', range: '≥ 30.0', color: 'bg-red-500' }
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className={`w-3 h-3 ${item.color} rounded-full mb-3`}></div>
            <h3 className="text-xs font-black uppercase text-slate-800 mb-1">{item.label}</h3>
            <p className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter">{item.range}</p>
          </div>
        ))}
      </section>

      <footer className="bg-slate-900 rounded-[3.5rem] p-8 md:p-16 text-white space-y-16 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.05),transparent)] pointer-events-none"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-tight">
              Understanding <span className="text-orange-500">Body Mass Index</span>
            </h2>
            <p className="text-slate-400 leading-relaxed text-lg">
              Body Mass Index (BMI) is a simple index of weight-for-height that is commonly used to classify underweight, overweight, and obesity in adults. It is defined as weight in kilograms divided by the square of height in meters (kg/m²).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <h3 className="text-orange-500 font-bold text-sm mb-2 uppercase tracking-widest">Health Risk</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">BMI is an affordable and easy-to-use screening tool for potential weight-related health problems.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <h3 className="text-orange-500 font-bold text-sm mb-2 uppercase tracking-widest">Limitations</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">It does not directly measure body fat or account for muscle mass, age, or bone density.</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-300 mb-6 flex items-center gap-3">
                <span className="text-xl">💡</span> Health FAQs
              </h3>
              <ul className="space-y-6">
                {[
                  { q: "What is a healthy BMI?", a: "For most adults, an ideal BMI is in the 18.5 to 24.9 range." },
                  { q: "Is BMI the same for men and women?", a: "Yes, the calculation formula is the same, though body fat distributions vary between sexes." },
                  { q: "How often should I check my BMI?", a: "Checking monthly or quarterly as part of a health routine is sufficient for most adults." },
                  { q: "Is BMI accurate for athletes?", a: "Muscular individuals may have a high BMI without being overweight because muscle is denser than fat." }
                ].map((item, i) => (
                  <li key={i} className="space-y-1">
                    <h4 className="text-sm font-bold text-orange-500">{item.q}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.a}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 relative z-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Expertly Crafted by Toolina Health Systems</p>
        </div>
      </footer>
    
      
      
      <AccompanyingText 
        toolName="B M I Calculator"
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
          toolId="bmicalculator" 
          defaultRating={4.7} 
          defaultCount={297} 
          onRatingChange={(rating, count) => setRatingInfo({ rating, count })} 
        />
      </div>
      <ShareWidget title="BMI Calculator" />
      </article>
  );
};

export default BMICalculator;
