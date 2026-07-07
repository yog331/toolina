
import React, { useState, useEffect } from 'react';
import SEO from './SEO';
import { Link } from 'react-router-dom';
import { Tool } from '../types';
import BrandLogo from './BrandLogo';

interface DashboardProps {
  searchTerm?: string;
  tools: Tool[];
}

interface Announcement {
  id: string;
  date: string;
  content: string;
  color: string;
  isActive?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ searchTerm = '', tools }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setAnnouncements(data.filter((a: any) => a.isActive !== false && a.isActive !== 0 && a.isActive !== '0'));
        }
      })
      .catch(err => console.error("Failed to load announcements", err));
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredTools = tools.filter(tool => 
    !tool.isOffline && 
    (activeCategory === 'All' || tool.category === activeCategory) &&
    (
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const categories = ['All', ...Array.from(new Set(tools.filter(t => !t.isOffline).map(t => t.category))).sort()];

  return (
    <div className="space-y-12 md:space-y-20 animate-in fade-in duration-500 pb-20">
      <SEO title="Professional Digital Tools | Toolina" description="Free professional calculator and internal tool by Toolina. Accurate, fast, and easy to use." />
      {/* Hero Section */}
      <div className="bg-white p-6 md:p-10 lg:p-16 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-200 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="relative z-10 flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            Precision Tools Platform
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-slate-900 mb-6 tracking-tight leading-[1.1]">
            Elevate Your <br className="hidden lg:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-green-500">Calculations</span>
          </h2>
          <p className="text-slate-500 max-w-xl text-sm md:text-lg leading-relaxed mx-auto md:mx-0">
            Welcome to <span className="font-semibold text-slate-700">Toolina</span>. Professional digital tools for government employees, health, and developers. Built for speed, privacy, and precision.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button 
              onClick={() => scrollToSection('tools-grid')}
              className="bg-teal-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-teal-700 transition-all shadow-xl shadow-teal-100 active:scale-95"
            >
              Explore All Tools
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="bg-slate-100 text-slate-600 px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all active:scale-95"
            >
              How it Works
            </button>
          </div>
        </div>
        
        <div className="relative z-10 w-48 h-48 md:w-80 md:h-80 shrink-0 bg-slate-50 rounded-[3rem] md:rounded-[4.5rem] p-8 md:p-12 shadow-inner flex items-center justify-center overflow-hidden border border-slate-100">
          <BrandLogo className="w-full h-full p-2 md:p-4 drop-shadow-2xl animate-float" />
          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-15px); }
            }
            .animate-float { animation: float 5s ease-in-out infinite; }
            @keyframes pulse-soft {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
            .animate-pulse-soft { animation: pulse-soft 2s ease-in-out infinite; }
          `}</style>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-50 rounded-full blur-[120px] -mr-64 -mt-64 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-green-50 rounded-full blur-[100px] -ml-40 -mb-40 opacity-60"></div>
      </div>

      {/* Announcements Banner */}
      <div className={`transition-all duration-700 ease-in-out ${announcements.length > 0 ? 'max-h-[500px] opacity-100 mb-8 md:mb-12' : 'max-h-0 opacity-0 overflow-hidden m-0'}`}>
        {announcements.length > 0 && (
          <section className="bg-slate-900 rounded-[2.5rem] p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row gap-6 items-start md:items-center border border-slate-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full blur-[80px] opacity-20 -mr-32 -mt-32"></div>
            
            <div className="shrink-0 flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 bg-teal-500/20 rounded-2xl flex items-center justify-center text-teal-400 border border-teal-500/30">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-teal-400">Latest Updates</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">From the Toolina Team</p>
              </div>
            </div>

            <div className="flex-1 w-full relative z-10">
              <div className="flex flex-col gap-3 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
                {announcements.map((ann) => (
                  <div key={ann.id} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                    <span className={`text-[10px] font-black uppercase shrink-0 mt-0.5 ${ann.color || 'text-teal-400'}`}>
                      {ann.date}
                    </span>
                    <p className="text-sm font-medium text-slate-200 leading-snug">
                      {ann.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Grid Section */}
      <section id="tools-grid" className="scroll-mt-24 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
          <div>
            <h3 className="text-[10px] font-black text-teal-600 uppercase tracking-[0.3em] mb-2">Our Digital Suite</h3>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              {searchTerm ? `Search Results for "${searchTerm}"` : 'Available Tools'}
            </h2>
          </div>
          <p className="text-slate-400 text-sm font-medium max-w-xs md:text-right">
            Browse our collection of specialized calculators and productivity utilities.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 px-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                activeCategory === category
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-teal-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {filteredTools.length > 0 ? (
          <div className="space-y-16">
            {Array.from(new Set(filteredTools.map(t => t.category))).map(category => (
              <div key={category} className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-bold text-slate-800">{category}</h3>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filteredTools.filter(tool => tool.category === category).map((tool) => (
                    <Link 
                      key={tool.id} 
                      to={tool.path}
                      className="group bg-white p-6 rounded-[2rem] border border-slate-200 hover:border-teal-200 hover:shadow-2xl hover:shadow-teal-100/30 transition-all duration-300 flex flex-col active:scale-[0.98] relative"
                    >
                      {/* NEW Badge */}
                      {tool.isNew && (
                        <div className="absolute -top-2 -right-2 z-20">
                          <span className="bg-gradient-to-tr from-orange-600 to-amber-400 text-white text-[9px] font-black px-2.5 py-1 rounded-lg shadow-lg shadow-orange-500/20 uppercase tracking-widest animate-pulse-soft border border-orange-500/20">
                            New
                          </span>
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-6">
                        <div className="text-4xl bg-slate-50 group-hover:bg-teal-50 p-4 rounded-2xl transition-all duration-500 shrink-0 group-hover:scale-110 rotate-0 group-hover:rotate-6">
                          {tool.icon}
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                          {tool.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-teal-700 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed flex-1">
                        {tool.description}
                      </p>
                      <div className="mt-6 pt-6 border-t border-slate-50 flex items-center text-teal-600 font-bold text-xs group-hover:translate-x-1 transition-all">
                        Launch Tool
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <div className="text-6xl mb-6 grayscale opacity-30">🧘‍♂️</div>
            <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">No tools found matching your search</h3>
            <p className="text-slate-300 text-sm mt-2">Try different keywords or browse by category in the sidebar.</p>
          </div>
        )}
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="scroll-mt-24 py-16 px-6 md:px-12 bg-slate-900 rounded-[3rem] md:rounded-[4rem] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.1),transparent)] pointer-events-none"></div>
        
        <div className="relative z-10 text-center mb-16 space-y-4">
          <h3 className="text-xs font-black text-teal-400 uppercase tracking-[0.4em]">Simple & Powerful</h3>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">How Toolina Works</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Our platform is designed to be as effortless as a morning meditation. Get professional results in three easy steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
          {[
            { 
              step: "01", 
              title: "Select a Tool", 
              desc: "Choose from our wide range of government, utility, and health tools designed for specific use cases.", 
              icon: "🔍" 
            },
            { 
              step: "02", 
              title: "Input Data", 
              desc: "Enter your values into our intuitive, optimized forms. All calculations happen locally in your browser for privacy.", 
              icon: "⌨️" 
            },
            { 
              step: "03", 
              title: "Get Results", 
              desc: "Instantly view high-precision results, download reports, or share structured data as per your requirements.", 
              icon: "✅" 
            }
          ].map((item, idx) => (
            <div key={idx} className="relative group">
              <div className="text-6xl md:text-8xl font-black text-white/5 absolute -top-10 -left-6 select-none group-hover:text-teal-50/10 transition-colors">{item.step}</div>
              <div className="relative space-y-4">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-3xl border border-white/10 group-hover:bg-teal-500 group-hover:scale-110 transition-all duration-500">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold tracking-tight">{item.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-10 border-t border-white/5 text-center">
          <div className="inline-flex items-center gap-6 opacity-30 grayscale brightness-200">
             <div className="text-[10px] font-black uppercase tracking-widest">Client-Side Logic</div>
             <div className="text-[10px] font-black uppercase tracking-widest">No Server Uploads</div>
             <div className="text-[10px] font-black uppercase tracking-widest">100% Secure</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
