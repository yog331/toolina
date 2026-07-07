
import React, { useState, useEffect } from 'react';
import AccompanyingText from '../components/AccompanyingText';
import ShareWidget from '../components/ShareWidget';
import SEO from '../components/SEO';
import StarRatingWidget from '../components/StarRatingWidget';

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  totalHours: number;
  totalMinutes: number;
  nextBirthday: {
    months: number;
    days: number;
  };
  zodiac: string;
}

const getZodiac = (date: Date) => {
    const days = [21, 20, 21, 21, 22, 22, 23, 24, 24, 24, 23, 22];
  const signs = ["Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius"];
  let month = date.getMonth();
  let day = date.getDate();
  if (month === 0 && day < 20) return signs[0];
  if (day < days[month]) return signs[month];
  return signs[(month + 1) % 12];
};

const AgeCalculator: React.FC = () => {
  const [ratingInfo, setRatingInfo] = useState<{rating: number, count: number}>({ rating: 4.6, count: 140 });

  const [birthDate, setBirthDate] = useState('');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<AgeResult | null>(null);

  useEffect(() => {
    // Dynamic SEO Metadata Injection
    
    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", "Professional Exact Age Calculator & Chronological Age Finder. Ideal for government job age calculation (SSO Rajasthan, UPSC, SSC). Calculate your age in years, months, and days with high precision.");

    // Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute("content", "exact age calculator, chronological age finder, government job age calculation, age calculator for sso rajasthan, DOB calculator, UPSC age limit finder, Toolina");

    return () => {
      // Optional: Cleanup meta tags on unmount if they were dynamically added
      // However, usually it's fine to leave them for single-page performance
    };
  }, []);

  const calculate = () => {
    if (!birthDate) return;
    const b = new Date(birthDate);
    const t = new Date(targetDate);
    
    if (b > t) {
      alert("Birth date cannot be in the future relative to the target date!");
      return;
    }

    // Chronological Age Logic
    let y = t.getFullYear() - b.getFullYear();
    let m = t.getMonth() - b.getMonth();
    let d = t.getDate() - b.getDate();

    if (d < 0) {
      m -= 1;
      const lastMonth = new Date(t.getFullYear(), t.getMonth(), 0);
      d += lastMonth.getDate();
    }
    if (m < 0) {
      y -= 1;
      m += 12;
    }

    // Total Stats
    const diffTime = Math.abs(t.getTime() - b.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = (y * 12) + m;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    // Next Birthday Countdown
    let nextBday = new Date(t.getFullYear(), b.getMonth(), b.getDate());
    if (nextBday < t) {
      nextBday.setFullYear(t.getFullYear() + 1);
    }
    
    let nm = nextBday.getMonth() - t.getMonth();
    let nd = nextBday.getDate() - t.getDate();
    if (nd < 0) {
      nm -= 1;
      const prevMonth = new Date(nextBday.getFullYear(), nextBday.getMonth(), 0);
      nd += prevMonth.getDate();
    }
    if (nm < 0) nm += 12;

    setResult({
      years: y,
      months: m,
      days: d,
      totalDays,
      totalWeeks,
      totalMonths,
      totalHours,
      totalMinutes,
      nextBirthday: { months: nm, days: nd },
      zodiac: getZodiac(b)
    });
  };

  return (
    <article className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <SEO title="Exact Age Calculator | Chronological Age Finder for Govt Jobs - Toolina" description="Free professional calculator and internal tool by Toolina. Accurate, fast, and easy to use." 
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Exact Age Calculator",
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
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-teal-600 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center text-3xl md:text-4xl shadow-xl shadow-teal-100 text-white shrink-0">🎂</div>
            <div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
                Exact <span className="text-teal-600">Age Calculator</span>
              </h1>
              <p className="text-slate-500 font-medium text-xs md:text-lg mt-1 italic">The Ultimate Chronological Age Finder for Competitive Exams</p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Date of Birth</label>
            <input 
              type="date" 
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-teal-50 focus:bg-white transition-all text-sm font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Calculate Age As Of</label>
            <input 
              type="date" 
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-teal-50 focus:bg-white transition-all text-sm font-bold"
            />
          </div>
          <button 
            onClick={calculate}
            className="md:col-span-2 w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Determine Chronological Age
          </button>
        </div>
      </header>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Chronological Analysis */}
          <section className="lg:col-span-8 space-y-6">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center animate-in zoom-in duration-500">
               <span className="text-[10px] font-black text-teal-600 bg-teal-50 px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-6">Age Breakdown Results</span>
               <div className="grid grid-cols-3 gap-4 md:gap-12 w-full">
                 <div className="space-y-1">
                   <div className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter">{result.years}</div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Years</div>
                 </div>
                 <div className="space-y-1">
                   <div className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter">{result.months}</div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Months</div>
                 </div>
                 <div className="space-y-1">
                   <div className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter">{result.days}</div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Days</div>
                 </div>
               </div>
               
               <div className="w-full h-px bg-slate-100 my-10"></div>
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Months</div>
                   <div className="text-xl font-bold text-slate-800">{result.totalMonths.toLocaleString()}</div>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Weeks</div>
                   <div className="text-xl font-bold text-slate-800">{result.totalWeeks.toLocaleString()}</div>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Days</div>
                   <div className="text-xl font-bold text-slate-800">{result.totalDays.toLocaleString()}</div>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Hours</div>
                   <div className="text-xl font-bold text-slate-800">{result.totalHours.toLocaleString()}</div>
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex items-center justify-between group overflow-hidden relative">
                <div className="absolute -right-4 -bottom-4 text-7xl opacity-5 group-hover:scale-125 transition-transform duration-700">⌛</div>
                <div className="relative z-10">
                  <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-2">Total Minutes Lived</p>
                  <p className="text-4xl font-black tracking-tighter">{result.totalMinutes.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500 font-bold mt-2 uppercase">Life Time in Minutes</p>
                </div>
              </div>
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 flex items-center justify-between group">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Your Zodiac Sign</p>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter">{result.zodiac}</p>
                  <p className="text-[10px] text-teal-600 font-bold mt-2 uppercase tracking-wide">Sun Sign Analysis</p>
                </div>
                <div className="text-5xl filter grayscale group-hover:grayscale-0 transition-all duration-500">✨</div>
              </div>
            </div>
          </section>

          {/* Sidebar Insights */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-teal-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-teal-100 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-8 -mt-8"></div>
               <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-60 mb-6">Next Celebration</h3>
               <div className="flex items-center gap-6 mb-8">
                 <div className="text-6xl font-black tracking-tighter italic">
                   {result.nextBirthday.months === 0 && result.nextBirthday.days === 0 ? "Today!" : `${result.nextBirthday.months}m ${result.nextBirthday.days}d`}
                 </div>
               </div>
               <p className="text-xs font-medium opacity-80 leading-relaxed">
                 Countdown to your next birthday milestone. Precision for 2026 and beyond.
               </p>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span> Health & Biology Milestones
               </h3>
               <div className="space-y-4">
                 {[
                   { label: "Sleep Hours", val: Math.round(result.totalHours / 3).toLocaleString(), icon: "😴" },
                   { label: "Heartbeats", val: (result.totalDays * 100000).toLocaleString(), icon: "❤️" },
                   { label: "Breaths", val: (result.totalDays * 23000).toLocaleString(), icon: "🌬️" }
                 ].map((m, i) => (
                   <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:scale-[1.02] transition-transform cursor-default">
                     <span className="text-2xl">{m.icon}</span>
                     <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{m.label}</p>
                       <p className="text-sm font-bold text-slate-800 tracking-tight">{m.val} <span className="text-[10px] opacity-40">est.</span></p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </aside>
        </div>
      )}

      {/* SEO Optimized Semantic Footer */}
      <footer className="bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-white space-y-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.1),transparent)] pointer-events-none"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative z-10">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight leading-tight">
              About the <span className="text-teal-400">Exact Age Calculator</span> for Govt Exams
            </h2>
            <p className="text-slate-400 leading-relaxed">
              When applying for competitive examinations, a <strong>government job age calculation</strong> must be perfect. Most recruitment portals like <strong>SSO Rajasthan (RPSC/RSSB)</strong>, UPSC, or SSC define a cut-off date to determine eligibility. Our <strong>chronological age finder</strong> allows you to input that cut-off date to see if you meet the minimum or maximum age limits.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="text-teal-400 font-bold text-sm mb-1 uppercase tracking-widest">Accuracy</h3>
                <p className="text-[10px] text-slate-500">Includes leap year logic for 100% precision.</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="text-teal-400 font-bold text-sm mb-1 uppercase tracking-widest">Privacy</h3>
                <p className="text-[10px] text-slate-500">Browser-based processing. No data saved.</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-300">Frequently Asked Questions (FAQ)</h3>
              <ul className="space-y-4">
                {[
                  { q: "What is a chronological age finder?", a: "It's a tool that measures time elapsed between birth and a specific date in years, months, and days." },
                  { q: "How to calculate age for a Govt job application?", a: "Set 'Date of Birth' as your DOB and 'Calculate Age As Of' to the recruitment cut-off date." },
                  { q: "Is this age calculator free?", a: "Yes, Toolina provides this tool free of charge for students and job seekers." },
                  { q: "Does it handle leap years?", a: "Absolutely. Our algorithm accounts for February 29th and varying month lengths (28, 30, 31 days)." }
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
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Expertise provided by Toolina Digital Tools</p>
        </div>
      </footer>
    
      
      
      <AccompanyingText 
        toolName="Age Calculator"
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
          toolId="agecalculator" 
          defaultRating={4.6} 
          defaultCount={140} 
          onRatingChange={(rating, count) => setRatingInfo({ rating, count })} 
        />
      </div>
      <ShareWidget title="Age Calculator" />
      </article>
  );
};

export default AgeCalculator;
