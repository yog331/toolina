
import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import AdUnit from '../components/AdUnit';

const HelpCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
  }, []);

  const categories = [
    {
      title: "Salary & Pay Rules",
      icon: "🏰",
      items: [
        "Rajasthan 7th CPC Rules",
        "Central Govt Pay Fixation",
        "DA & HRA Calculation Logic",
        "Annual Increment Audit"
      ]
    },
    {
      title: "Digital Converters",
      icon: "🖼️",
      items: [
        "Batch Image Resizing Guide",
        "CSV to JSON Formatting",
        "DevLys to Unicode Typing",
        "QR Code Security"
      ]
    },
    {
      title: "Financial Planning",
      icon: "💰",
      items: [
        "EMI Amortization Explained",
        "NPS Retirement Planning",
        "Solar ROI & Subsidies",
        "Income Tax Regime Comparison"
      ]
    },
    {
      title: "Platform & Privacy",
      icon: "🛡️",
      items: [
        "How our tools stay private",
        "Offline functionality",
        "Reporting tool errors",
        "Mobile app shortcut guide"
      ]
    }
  ];

  const faqs = [
    {
      q: "Are the salary results accurate?",
      a: "Yes, our calculators follow the latest official gazette notifications from the Finance Department. However, these are for audit and planning purposes; final disbursements are subject to your department's DDO verification."
    },
    {
      q: "Is my data uploaded to your servers?",
      a: "No. Toolina is built on a 'Privacy-First' architecture. All calculations for salary, images, and data conversion happen locally in your browser. We never see or store your sensitive information."
    },
    {
      q: "How do I resize a photo for a Govt form?",
      a: "Use our Image Converter tool. Select the 'Passport' preset, upload your photo, and hit 'Start Batch'. It will perfectly scale your image to standard requirements (3.5x4.5cm)."
    },
    {
      q: "Does the Solar Calculator include current subsidies?",
      a: "Yes, it includes the latest PM Surya Ghar: Muft Bijli Yojana subsidy slabs, providing a realistic ROI and payback period based on current Indian grid tariffs."
    }
  ];

  const filteredCategories = categories.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.toLowerCase().includes(searchTerm.toLowerCase()) || 
      cat.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <article className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20 px-2 md:px-1">
      <SEO title="Help Center - Toolina | Support & User Guides" description="Free professional calculator and internal tool by Toolina. Accurate, fast, and easy to use." />
      <AdUnit slot="help_top" format="horizontal" />

      <header className="bg-white p-8 md:p-16 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-200 shadow-2xl shadow-slate-100/50 relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-50 rounded-bl-[20rem] opacity-60 blur-3xl"></div>
        
        <div className="relative z-10 space-y-6 md:space-y-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-display font-black text-slate-900 tracking-tight">
              How can we <span className="text-teal-600">Help?</span>
            </h1>
            <p className="text-slate-500 font-medium text-sm md:text-lg mt-4 max-w-2xl mx-auto italic leading-relaxed">
              Search our knowledge base for guides on government pay rules, digital utilities, and financial tools.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-300 group-focus-within:text-teal-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search help articles..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-8 py-5 md:py-6 bg-slate-50 border border-slate-200 rounded-[2rem] outline-none focus:ring-4 ring-teal-50 focus:bg-white transition-all font-bold text-slate-800 shadow-inner text-base md:text-lg"
            />
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredCategories.map((cat, i) => (
          <div key={i} className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="text-3xl md:text-4xl mb-6 bg-slate-50 w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">{cat.icon}</div>
            <h3 className="text-base md:text-lg font-black text-slate-800 mb-6 uppercase tracking-tight">{cat.title}</h3>
            <ul className="space-y-4">
              {cat.items.map((item, j) => (
                <li key={j} className="text-[11px] font-bold text-slate-400 hover:text-teal-600 cursor-pointer flex items-start gap-3 transition-colors">
                  <span className="text-teal-500">▸</span> {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <AdUnit slot="help_mid" format="rectangle" />

      <section className="bg-slate-900 rounded-[3rem] md:rounded-[4rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.1),transparent)] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row gap-12 md:gap-20">
          <div className="lg:w-1/3 space-y-6 md:space-y-8">
            <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-tight">Common <span className="text-teal-400">Questions</span></h2>
            <p className="text-slate-400 text-sm md:text-lg leading-relaxed font-medium">Direct answers to the most frequent inquiries from our users.</p>
            <div className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-md">
              <p className="text-[10px] font-black uppercase tracking-widest text-teal-400 mb-2">Still stuck?</p>
              <Link to="/contact" className="flex items-center justify-center gap-2 w-full bg-teal-600 hover:bg-teal-700 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95">
                Contact Support
              </Link>
            </div>
          </div>
          
          <div className="lg:w-2/3 space-y-6 md:space-y-8">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white/5 p-6 md:p-10 rounded-[2.5rem] border border-white/5 hover:border-teal-500/30 transition-all group">
                <h4 className="text-base md:text-xl font-bold text-teal-500 group-hover:text-white transition-colors tracking-tight leading-tight mb-4">{faq.q}</h4>
                <p className="text-xs md:text-base text-slate-400 leading-relaxed font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="text-center pt-8">
         <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Help Center Documentation • Updated Regularly</p>
      </footer>
    </article>
  );
};

export default HelpCenter;
