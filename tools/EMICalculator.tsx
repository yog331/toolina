
import React, { useState, useEffect, useMemo } from 'react';
import AccompanyingText from '../components/AccompanyingText';
import ShareWidget from '../components/ShareWidget';
import SEO from '../components/SEO';
import StarRatingWidget from '../components/StarRatingWidget';

interface AmortizationRow {
  month: number;
  principal: number;
  interest: number;
  totalPayment: number;
  balance: number;
}

type TenureType = 'Years' | 'Months';

const EMICalculator: React.FC = () => {
  const [ratingInfo, setRatingInfo] = useState<{rating: number, count: number}>({ rating: 4.7, count: 202 });

    const [loanAmount, setLoanAmount] = useState<number>(1000000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenure, setTenure] = useState<number>(10);
  const [tenureType, setTenureType] = useState<TenureType>('Years');
  const [showAmortization, setShowAmortization] = useState(false);

  useEffect(() => {
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", "Calculate Equated Monthly Installments (EMI) for Home, Car, or Personal loans. Get detailed amortization schedules, total interest breakdown, and visual project summaries.");
  }, []);

  const results = useMemo(() => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureType === 'Years' ? tenure * 12 : tenure;
    
    if (r === 0) {
      const emi = P / n;
      return { emi, totalInterest: 0, totalPayment: P, schedule: [] };
    }

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    const schedule: AmortizationRow[] = [];
    let balance = P;
    for (let i = 1; i <= n; i++) {
      const interest = balance * r;
      const principal = emi - interest;
      balance = Math.max(0, balance - principal);
      schedule.push({
        month: i,
        principal,
        interest,
        totalPayment: emi,
        balance
      });
    }

    return { emi, totalInterest, totalPayment, schedule };
  }, [loanAmount, interestRate, tenure, tenureType]);

  const interestPercentage = (results.totalInterest / results.totalPayment) * 100;

  return (
    <article className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <SEO title="Loan EMI Calculator - Professional Home & Car Loan Planner | Toolina" description="Free professional calculator and internal tool by Toolina. Accurate, fast, and easy to use." 
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Loan EMI Calculator - Professional Home & Car Loan Planner",
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
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50 rounded-bl-[15rem] -mr-20 -mt-20 opacity-50 blur-3xl"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-indigo-600 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center text-3xl md:text-4xl shadow-xl shadow-indigo-100 text-white shrink-0">
              💳
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
                Loan <span className="text-indigo-600">EMI Calculator</span>
              </h1>
              <p className="text-slate-500 font-medium text-xs md:text-lg mt-1 italic">High-Precision Debt Planning Tool</p>
            </div>
          </div>
          <div className="bg-slate-100 px-4 py-2 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">
            Advanced Amortization Support
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          {/* Inputs Section */}
          <section className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-inner space-y-6">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span> Loan Configuration
              </h2>
              
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 ml-1">Loan Amount (₹)</label>
                  <input 
                    type="number" 
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-indigo-50 transition-all font-mono font-bold text-slate-800"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 ml-1">Interest Rate (% p.a.)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-indigo-50 transition-all font-mono font-bold text-indigo-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700 ml-1">Tenure ({tenureType})</label>
                    <div className="flex bg-slate-200 p-1 rounded-lg gap-1 scale-90">
                      {(['Years', 'Months'] as TenureType[]).map(type => (
                        <button
                          key={type}
                          onClick={() => setTenureType(type)}
                          className={`px-3 py-1 text-[9px] font-black uppercase rounded-md transition-all ${tenureType === type ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input 
                    type="number" 
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-indigo-50 transition-all font-mono font-bold text-slate-800"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Result Overview Section */}
          <section className="lg:col-span-7 flex flex-col justify-center">
            <div className="space-y-6">
              <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                  <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                </div>
                <div className="relative z-10 text-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-2 block">Your Monthly EMI</span>
                  <div className="text-5xl md:text-7xl font-black tracking-tighter mb-4 leading-none">
                    ₹{Math.round(results.emi).toLocaleString()}
                  </div>
                  <div className="inline-flex px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest text-indigo-300">Monthly Installment</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Interest</p>
                   <p className="text-3xl font-black text-indigo-600">₹{Math.round(results.totalInterest).toLocaleString()}</p>
                   <div className="h-1.5 w-full bg-slate-100 rounded-full mt-3 overflow-hidden">
                      <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${interestPercentage}%` }}></div>
                   </div>
                   <p className="text-[9px] font-bold text-slate-400 mt-2">{interestPercentage.toFixed(1)}% of Total Payment</p>
                </div>
                <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount</p>
                   <p className="text-3xl font-black text-slate-800">₹{Math.round(results.totalPayment).toLocaleString()}</p>
                   <div className="h-1.5 w-full bg-slate-100 rounded-full mt-3 overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${100 - interestPercentage}%` }}></div>
                   </div>
                   <p className="text-[9px] font-bold text-slate-400 mt-2">Principal: ₹{loanAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </header>

      {/* Amortization Table Toggle */}
      <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden transition-all duration-500">
        <button 
          onClick={() => setShowAmortization(!showAmortization)}
          className="w-full px-8 py-6 flex items-center justify-between group hover:bg-indigo-50/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">📊</span>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Full Amortization Schedule</h3>
          </div>
          <svg className={`w-6 h-6 text-slate-400 group-hover:text-indigo-600 transition-all ${showAmortization ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showAmortization && (
          <div className="border-t border-slate-100 overflow-x-auto max-h-[600px] scrollbar-hide animate-in slide-in-from-top-4 duration-500">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Month</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Principal (A)</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Interest (B)</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Total EMI (A+B)</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {results.schedule.map((row) => (
                  <tr key={row.month} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-8 py-4 font-black text-xs text-indigo-600">{row.month}</td>
                    <td className="px-8 py-4 font-mono text-sm text-slate-600">₹{Math.round(row.principal).toLocaleString()}</td>
                    <td className="px-8 py-4 font-mono text-sm text-red-400">₹{Math.round(row.interest).toLocaleString()}</td>
                    <td className="px-8 py-4 font-mono text-sm text-slate-800 font-bold">₹{Math.round(row.totalPayment).toLocaleString()}</td>
                    <td className="px-8 py-4 font-mono text-sm text-slate-500 text-right">₹{Math.round(row.balance).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Educational Footer Section */}
      <footer className="bg-slate-900 rounded-[3.5rem] p-8 md:p-16 text-white space-y-16 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.05),transparent)] pointer-events-none"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-tight">
              Master your <span className="text-indigo-400">Financial Future</span>
            </h2>
            <p className="text-slate-400 leading-relaxed text-lg">
              Choosing the right loan requires understanding the true cost of debt. Our <strong>EMI Auditor</strong> goes beyond basic calculations to show you exactly how your payments are split between principal and interest, helping you decide if <strong>prepayments</strong> or <strong>refinancing</strong> is right for you.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <h4 className="text-indigo-400 font-bold text-sm mb-2 uppercase tracking-widest">Smart Tenure</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">Shorter tenures drastically reduce total interest but increase monthly pressure. Find your balance.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <h4 className="text-indigo-400 font-bold text-sm mb-2 uppercase tracking-widest">Rate Impact</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">Even a 0.5% difference in interest rates can save lakhs over a 20-year home loan period.</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-sm">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-300 mb-6 flex items-center gap-3">
                <span className="text-xl">💡</span> Financial FAQs
              </h3>
              <ul className="space-y-6">
                {[
                  { q: "What is an EMI?", a: "Equated Monthly Installment is a fixed payment made by a borrower to a lender at a specified date each month." },
                  { q: "How is EMI calculated?", a: "EMI is calculated using the formula: [P x R x (1+R)^N]/[(1+R)^N-1], where P is principal, R is monthly rate, and N is months." },
                  { q: "Does prepaying a loan help?", a: "Yes, prepaying reduces the principal amount, which significantly lowers the interest burden and reduces your tenure." },
                  { q: "What is an amortization schedule?", a: "It's a table showing each periodic payment of an amortizing loan (typically a mortgage), showing principal and interest." }
                ].map((item, i) => (
                  <li key={i} className="space-y-1">
                    <h4 className="text-sm font-bold text-indigo-400">{item.q}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.a}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 relative z-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Engineered with Precision by Toolina Finance Labs</p>
        </div>
      </footer>
    
      
      
      <AccompanyingText 
        toolName="E M I Calculator"
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
          toolId="emicalculator" 
          defaultRating={4.7} 
          defaultCount={202} 
          onRatingChange={(rating, count) => setRatingInfo({ rating, count })} 
        />
      </div>
      <ShareWidget title="EMI Calculator" />
      </article>
  );
};

export default EMICalculator;
