import React from 'react';

interface AccompanyingTextProps {
  toolName: string;
  howItWorks: string;
  whyItsUseful: string;
  faqs: { q: string; a: string }[];
}

const AccompanyingText: React.FC<AccompanyingTextProps> = ({ toolName, howItWorks, whyItsUseful, faqs }) => {
  return (
    <section className="bg-slate-900 rounded-[3.5rem] p-8 md:p-16 text-white space-y-16 overflow-hidden relative mt-16 print:hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.1),transparent)] pointer-events-none"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
        <div className="space-y-8">
          <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-tight">
            About the <span className="text-teal-400">{toolName}</span>
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
              <h3 className="text-teal-400 font-bold text-lg mb-3 uppercase tracking-widest flex items-center gap-2">
                <span className="text-2xl">⚙️</span> How It Works
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                {howItWorks}
              </p>
            </div>
            
            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
              <h3 className="text-teal-400 font-bold text-lg mb-3 uppercase tracking-widest flex items-center gap-2">
                <span className="text-2xl">💡</span> Why It's Useful
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                {whyItsUseful}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 h-full">
            <h3 className="text-lg font-black uppercase tracking-widest text-slate-300 mb-8 flex items-center gap-3">
              <span className="text-xl">❓</span> Frequently Asked Questions
            </h3>
            <ul className="space-y-6">
              {faqs.map((item, i) => (
                <li key={i} className="space-y-2">
                  <h4 className="text-[15px] font-bold text-teal-400 tracking-tight">{item.q}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.a}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccompanyingText;
