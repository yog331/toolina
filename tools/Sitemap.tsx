import React, { useEffect, useState } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { Tool } from '../types';
import { TOOLS as INITIAL_TOOLS } from '../constants';

const Sitemap: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>(INITIAL_TOOLS);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetch('/api/tools')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          // Merge API status into initial tools
          const mergedTools = INITIAL_TOOLS.map(initialTool => {
            const dbTool = data.find((t: Tool) => t.id === initialTool.id);
            return dbTool ? { ...initialTool, isOffline: dbTool.isOffline } : initialTool;
          });
          setTools(mergedTools.filter((t: Tool) => !t.isOffline));
        } else {
          setTools(INITIAL_TOOLS.filter((t: Tool) => !t.isOffline));
        }
      })
      .catch(err => console.error("Failed to load tools for sitemap", err));
  }, []);

  const categories = Array.from(new Set(tools.map(t => t.category)));

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <SEO title="Sitemap | Toolina" description="Free professional calculator and internal tool by Toolina. Accurate, fast, and easy to use." />
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-[80px] -mr-32 -mt-32 opacity-60 pointer-events-none"></div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 relative z-10">
          Sitemap
        </h1>
        <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-2xl relative z-10">
          Explore all the tools, calculators, and resources available on Toolina.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tools by Category */}
        <div className="space-y-8">
          <h2 className="text-xl font-black text-slate-800 tracking-tight border-b border-slate-200 pb-4">
            Tools & Calculators
          </h2>
          
          {categories.map(category => (
            <div key={category} className="space-y-4">
              <h3 className="text-xs font-black text-teal-600 uppercase tracking-widest">
                {category}
              </h3>
              <ul className="space-y-3">
                {tools.filter(t => t.category === category).map(tool => (
                  <li key={tool.id}>
                    <Link 
                      to={tool.path}
                      className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors flex items-center gap-2"
                    >
                      <span className="text-slate-300 text-xs">→</span>
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal & Support */}
        <div className="space-y-8">
          <h2 className="text-xl font-black text-slate-800 tracking-tight border-b border-slate-200 pb-4">
            Support & Legal
          </h2>
          
          <ul className="space-y-4">
            <li>
              <Link to="/help" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors flex items-center gap-2">
                <span className="text-slate-300 text-xs">→</span> Help Center
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors flex items-center gap-2">
                <span className="text-slate-300 text-xs">→</span> Contact Us
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors flex items-center gap-2">
                <span className="text-slate-300 text-xs">→</span> Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors flex items-center gap-2">
                <span className="text-slate-300 text-xs">→</span> Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/disclaimer" className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors flex items-center gap-2">
                <span className="text-slate-300 text-xs">→</span> Legal Disclaimer
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
