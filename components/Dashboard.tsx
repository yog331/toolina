
import React, { useState, useEffect } from 'react';
import SEO from './SEO';
import { Link } from 'react-router-dom';
import { Tool } from '../types';
import BrandLogo from './BrandLogo';
import {
  DEPARTMENT_DATA,
  PAY_MATRIX,
  RGHS_SLABS,
  SI_SLABS,
  GPF_SLABS
} from '../tools/constants';

interface DashboardProps {
  searchTerm?: string;
  tools: Tool[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

interface Announcement {
  id: string;
  date: string;
  content: string;
  color: string;
  isActive?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ searchTerm = '', tools, favorites = [], toggleFavorite }) => {
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
  const [viewMode, setViewMode] = useState<'grid' | 'compact' | 'list'>(() => {
    try {
      const saved = localStorage.getItem('toolina_dashboard_view_mode');
      return (saved as 'grid' | 'compact' | 'list') || 'grid';
    } catch {
      return 'grid';
    }
  });

  const handleViewModeChange = (mode: 'grid' | 'compact' | 'list') => {
    setViewMode(mode);
    try {
      localStorage.setItem('toolina_dashboard_view_mode', mode);
    } catch {}
  };

  // ----------------------------------------------------
  // Dynamic parsing of Rajasthan Salary search query
  // ----------------------------------------------------
  let isSalaryQuery = false;
  let queryLevel = '';
  let queryPay = 0;
  let queryDept = '';
  let queryPost = '';
  let calculatedSalary: {
    basic: number;
    da: number;
    hra: number;
    cca: number;
    gross: number;
    deductions: number;
    net: number;
    rghs: number;
    gpf: number;
    si: number;
  } | null = null;

  if (searchTerm.trim()) {
    const cleanQuery = searchTerm.toLowerCase();
    
    // Check level: e.g. L-10, l-12, level 10, etc.
    const levelMatch = cleanQuery.match(/\b(?:level\s*|l-?|l\s*)(\d+)\b/i);
    if (levelMatch) {
      const lvlNum = parseInt(levelMatch[1]);
      if (lvlNum >= 1 && lvlNum <= 24) {
        queryLevel = `L-${lvlNum}`;
        isSalaryQuery = true;
      }
    }

    // Check basic pay: e.g. any 5-digit or 6-digit number between 10,000 and 250,000
    const payMatch = cleanQuery.match(/\b(\d{5,6})\b/);
    if (payMatch) {
      const payVal = parseInt(payMatch[1]);
      if (payVal >= 10000 && payVal <= 250000) {
        queryPay = payVal;
        isSalaryQuery = true;
      }
    }

    // Try to match Department
    for (const d of DEPARTMENT_DATA) {
      if (cleanQuery.includes(d.name.toLowerCase())) {
        queryDept = d.name;
        isSalaryQuery = true;
        break;
      }
    }

    // Significant keywords for departments if no exact name matched
    if (!queryDept) {
      if (cleanQuery.includes('education') || cleanQuery.includes('shiksha') || cleanQuery.includes('teacher') || cleanQuery.includes('school')) {
        const found = DEPARTMENT_DATA.find(d => d.name.toLowerCase().includes('education'));
        if (found) {
          queryDept = found.name;
          isSalaryQuery = true;
        }
      } else if (cleanQuery.includes('police') || cleanQuery.includes('constable') || cleanQuery.includes('jail') || cleanQuery.includes('subordinate police')) {
        const found = DEPARTMENT_DATA.find(d => d.name.toLowerCase().includes('police') || d.name.toLowerCase().includes('jail'));
        if (found) {
          queryDept = found.name;
          isSalaryQuery = true;
        }
      } else if (cleanQuery.includes('account') || cleanQuery.includes('audit')) {
        const found = DEPARTMENT_DATA.find(d => d.name.toLowerCase().includes('accounts'));
        if (found) {
          queryDept = found.name;
          isSalaryQuery = true;
        }
      } else if (cleanQuery.includes('medical') || cleanQuery.includes('health') || cleanQuery.includes('nurse') || cleanQuery.includes('hospital')) {
        const found = DEPARTMENT_DATA.find(d => d.name.toLowerCase().includes('medical') || d.name.toLowerCase().includes('health'));
        if (found) {
          queryDept = found.name;
          isSalaryQuery = true;
        }
      }
    }

    // Try to match designation (post)
    const deptsToSearch = queryDept 
      ? [DEPARTMENT_DATA.find(d => d.name === queryDept)!] 
      : DEPARTMENT_DATA;

    for (const d of deptsToSearch) {
      for (const p of d.posts) {
        if (cleanQuery.includes(p.title.toLowerCase())) {
          queryPost = p.title;
          if (!queryDept) {
            queryDept = d.name;
          }
          if (!queryLevel) {
            queryLevel = p.level;
          }
          if (!queryPay) {
            queryPay = p.initialPay;
          }
          isSalaryQuery = true;
          break;
        }
      }
      if (queryPost) break;
    }

    // General keyword checks to fall back to salary query if user searches for "Rajasthan salary", "rsr salary", etc.
    if (!isSalaryQuery) {
      const salaryKeywords = ['salary', 'pay', 'allowance', 'da', 'hra', 'deduction', 'matrix', 'raj', 'rajasthan', 'rsr', 'gp', 'grade pay'];
      if (salaryKeywords.some(k => cleanQuery.includes(k))) {
        isSalaryQuery = true;
      }
    }

    // Set default values if we identified it as a salary search query but some parts are missing
    if (isSalaryQuery) {
      if (!queryLevel) {
        queryLevel = 'L-10'; // Default Level 10
      }
      if (!queryPay) {
        const steps = PAY_MATRIX[queryLevel] || [33800];
        queryPay = steps[0];
      }

      // Calculate dynamic salary results
      const basic = queryPay;
      const daRate = 60; // Current Rajasthan standard DA rate
      const daAmount = Math.round((basic * daRate) / 100);
      
      // Check for cities in search query
      let hraCategory: 'Y' | 'Z' = 'Z';
      let cityName = 'Other Cities';
      if (cleanQuery.includes('jaipur')) {
        hraCategory = 'Y';
        cityName = 'Jaipur';
      } else if (cleanQuery.includes('jodhpur')) {
        hraCategory = 'Y';
        cityName = 'Jodhpur';
      } else if (cleanQuery.includes('bikaner')) {
        hraCategory = 'Y';
        cityName = 'Bikaner';
      } else if (cleanQuery.includes('ajmer')) {
        hraCategory = 'Y';
        cityName = 'Ajmer';
      } else if (cleanQuery.includes('kota')) {
        hraCategory = 'Y';
        cityName = 'Kota';
      }

      const hraRate = hraCategory === 'Y' ? (daRate >= 50 ? 20 : 18) : (daRate >= 50 ? 10 : 9);
      const hraAmount = Math.round((basic * hraRate) / 100);

      // CCA
      let ccaAmount = 0;
      if (cityName === 'Jaipur') ccaAmount = basic <= 23100 ? 620 : 1000;
      else if (['Bikaner', 'Jodhpur', 'Kota', 'Ajmer'].includes(cityName)) ccaAmount = basic <= 23100 ? 320 : 620;

      const grossPay = basic + daAmount + hraAmount + ccaAmount;

      // Deductions
      const rghsDeduction = RGHS_SLABS.find(s => basic <= s.maxPay)?.rate || 875;
      const gpfDeduction = GPF_SLABS.find(s => basic <= s.maxPay)?.rate || 10500;
      const siDeduction = SI_SLABS.find(s => basic >= s.minPay && basic <= s.maxPay)?.rate || 2200;

      const totalDeductions = rghsDeduction + gpfDeduction + siDeduction;
      const netPay = Math.max(0, grossPay - totalDeductions);

      calculatedSalary = {
        basic,
        da: daAmount,
        hra: hraAmount,
        cca: ccaAmount,
        gross: grossPay,
        deductions: totalDeductions,
        net: netPay,
        rghs: rghsDeduction,
        gpf: gpfDeduction,
        si: siDeduction
      };
    }
  }

  const filteredTools = tools.filter(tool => 
    !tool.isOffline && 
    (activeCategory === 'All' || tool.category === activeCategory) &&
    (
      (isSalaryQuery && tool.id === 'raj-salary') ||
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

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-2">
          <div className="flex flex-wrap gap-2">
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

          {/* View Mode Segmented Control */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/50 self-start lg:self-auto shrink-0">
            <button
              onClick={() => handleViewModeChange('grid')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-teal-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Comfortable Grid View"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
              <span className="hidden sm:inline">Grid</span>
            </button>
            
            <button
              onClick={() => handleViewModeChange('compact')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'compact'
                  ? 'bg-white text-teal-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Compact Grid View"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <rect x="3" y="3" width="5" height="5" rx="1" />
                <rect x="10" y="3" width="5" height="5" rx="1" />
                <rect x="17" y="3" width="5" height="5" rx="1" />
                <rect x="3" y="10" width="5" height="5" rx="1" />
                <rect x="10" y="10" width="5" height="5" rx="1" />
                <rect x="17" y="10" width="5" height="5" rx="1" />
                <rect x="3" y="17" width="5" height="5" rx="1" />
                <rect x="10" y="17" width="5" height="5" rx="1" />
                <rect x="17" y="17" width="5" height="5" rx="1" />
              </svg>
              <span className="hidden sm:inline">Compact</span>
            </button>

            <button
              onClick={() => handleViewModeChange('list')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-teal-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="List View"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <circle cx="4" cy="6" r="1" />
                <circle cx="4" cy="12" r="1" />
                <circle cx="4" cy="18" r="1" />
              </svg>
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
        
        {filteredTools.length > 0 ? (
          <div className="space-y-16">
            {/* Pinned Tools Section */}
            {favorites.length > 0 && activeCategory === 'All' && !searchTerm && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-bold text-rose-600 flex items-center gap-2">
                    <span>📌</span> Pinned Tools
                  </h3>
                  <div className="h-px bg-rose-100 flex-1"></div>
                </div>
                <div className={
                  viewMode === 'grid'
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                    : viewMode === 'compact'
                    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4"
                    : "flex flex-col gap-2.5"
                }>
                  {tools.filter(tool => !tool.isOffline && favorites.includes(tool.id)).map((tool) => {
                    if (viewMode === 'list') {
                      return (
                        <Link 
                          key={`pinned-dash-${tool.id}`} 
                          to={tool.path}
                          className="group bg-white p-3 md:p-4 rounded-2xl border border-rose-100 hover:border-rose-300 hover:shadow-md transition-all duration-300 flex items-center justify-between gap-3 active:scale-[0.99] relative"
                        >
                          <div className="flex items-center gap-3.5 flex-1 min-w-0">
                            <div className="text-2xl shrink-0 bg-rose-50/50 group-hover:bg-rose-50 p-2.5 rounded-xl transition-all">
                              {tool.icon}
                            </div>
                            <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between sm:gap-4">
                              <div>
                                <h3 className="text-sm font-bold text-slate-800 group-hover:text-rose-700 transition-colors flex items-center gap-2">
                                  {tool.name}
                                  <span className="bg-rose-100 text-rose-800 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">Pinned</span>
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5 font-bold uppercase tracking-widest sm:hidden">
                                  {tool.category}
                                </p>
                                <p className="hidden md:block text-xs text-slate-400 line-clamp-1 mt-1 font-medium">
                                  {tool.description}
                                </p>
                              </div>
                              <span className="hidden sm:inline-block text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-50 text-slate-400 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300 shrink-0">
                                {tool.category}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleFavorite(tool.id);
                              }}
                              className="p-2 rounded-xl bg-rose-50 text-rose-500 hover:scale-110 transition-all duration-300"
                              title="Unpin tool"
                            >
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                              </svg>
                            </button>
                            <div className="p-2 rounded-xl border border-slate-100 text-slate-400 group-hover:text-rose-600 group-hover:bg-rose-50/50 transition-all">
                              <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </div>
                          </div>
                        </Link>
                      );
                    } else if (viewMode === 'compact') {
                      return (
                        <Link 
                          key={`pinned-dash-${tool.id}`} 
                          to={tool.path}
                          className="group bg-white p-4 rounded-2xl border border-rose-100 hover:border-rose-300 hover:shadow-lg transition-all duration-300 flex flex-col active:scale-[0.98] relative text-center items-center justify-center min-h-[140px]"
                        >
                          <div className="text-3xl bg-rose-50/50 group-hover:bg-rose-50 p-2.5 rounded-xl transition-all duration-300 mb-2 shrink-0">
                            {tool.icon}
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleFavorite(tool.id);
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-50 text-rose-500 hover:scale-110 transition-all duration-300"
                            title="Unpin tool"
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                          </button>

                          <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-rose-700 transition-colors flex-1 flex items-center justify-center">
                            {tool.name}
                          </h3>
                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1.5 shrink-0">
                            {tool.category}
                          </span>
                        </Link>
                      );
                    } else {
                      // Default Grid view
                      return (
                        <Link 
                          key={`pinned-dash-${tool.id}`} 
                          to={tool.path}
                          className="group bg-white p-6 rounded-[2rem] border-2 border-rose-100 hover:border-rose-300 hover:shadow-2xl hover:shadow-rose-100/30 transition-all duration-300 flex flex-col active:scale-[0.98] relative"
                        >
                          <div className="flex items-start justify-between mb-6">
                            <div className="text-4xl bg-rose-50/50 group-hover:bg-rose-50 p-4 rounded-2xl transition-all duration-500 shrink-0 group-hover:scale-110 rotate-0 group-hover:rotate-6">
                              {tool.icon}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                                {tool.category}
                              </span>
                              
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleFavorite(tool.id);
                                }}
                                className="p-2 rounded-xl bg-rose-50 text-rose-500 hover:scale-110 transition-all duration-300"
                                title="Unpin tool"
                              >
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-rose-700 transition-colors">
                            {tool.name}
                          </h3>
                          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed flex-1">
                            {tool.description}
                          </p>
                          <div className="mt-6 pt-6 border-t border-slate-50 flex items-center text-rose-600 font-bold text-xs group-hover:translate-x-1 transition-all">
                            Launch Pinned Tool
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </div>
                        </Link>
                      );
                    }
                  })}
                </div>
              </div>
            )}

            {Array.from(new Set(filteredTools.map(t => t.category))).map(category => (
              <div key={category} className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-bold text-slate-800">{category}</h3>
                  <div className="h-px bg-slate-200 flex-1"></div>
                </div>
                <div className={
                  viewMode === 'grid'
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                    : viewMode === 'compact'
                    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4"
                    : "flex flex-col gap-2.5"
                }>
                  {filteredTools.filter(tool => tool.category === category).map((tool) => {
                    const hasLiveCalculations = tool.id === 'raj-salary' && calculatedSalary;
                    const destinationPath = hasLiveCalculations
                      ? `${tool.path}?dept=${encodeURIComponent(queryDept || 'None')}&post=${encodeURIComponent(queryPost || 'None')}&level=${queryLevel}&basic=${queryPay}`
                      : tool.path;

                    if (viewMode === 'list') {
                      return (
                        <Link 
                          key={tool.id} 
                          to={destinationPath}
                          className={`group bg-white p-3 md:p-4 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-3 active:scale-[0.99] relative ${
                            hasLiveCalculations
                              ? 'border-teal-500 shadow-md shadow-teal-50/50 ring-2 ring-teal-50'
                              : 'border-slate-200 hover:border-teal-200 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 flex-1 min-w-0">
                            <div className={`text-2xl shrink-0 p-2.5 rounded-xl transition-all duration-500 ${
                              hasLiveCalculations ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-50 group-hover:bg-teal-50'
                            }`}>
                              {tool.icon}
                            </div>
                            <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between sm:gap-4">
                              <div>
                                <h3 className="text-sm font-bold text-slate-800 group-hover:text-teal-700 transition-colors flex items-center gap-2">
                                  {tool.name}
                                  {hasLiveCalculations && (
                                    <span className="bg-teal-100 text-teal-800 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">Live</span>
                                  )}
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5 font-bold uppercase tracking-widest sm:hidden">
                                  {tool.category}
                                </p>
                                <p className="hidden md:block text-xs text-slate-400 line-clamp-1 mt-1 font-medium">
                                  {tool.description}
                                </p>
                              </div>

                              {hasLiveCalculations && calculatedSalary ? (
                                <div className="hidden sm:flex items-center gap-3 bg-teal-50/50 border border-teal-100/30 px-3 py-1.5 rounded-xl shrink-0">
                                  <span className="text-[9px] font-black uppercase tracking-wider text-teal-600">Net Pay:</span>
                                  <span className="text-xs font-black text-teal-700">₹{calculatedSalary.net.toLocaleString('en-IN')}</span>
                                </div>
                              ) : (
                                <span className="hidden sm:inline-block text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-50 text-slate-400 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300 shrink-0">
                                  {tool.category}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between md:justify-end gap-3 border-t border-slate-100 md:border-none pt-2 md:pt-0 shrink-0">
                            <div className="sm:hidden text-xs">
                              {hasLiveCalculations && calculatedSalary && (
                                <div className="flex items-center gap-1.5 bg-teal-50 border border-teal-100/30 px-2 py-1 rounded-lg">
                                  <span className="text-[9px] font-black uppercase tracking-wider text-teal-600">Net:</span>
                                  <span className="font-extrabold text-teal-700">₹{calculatedSalary.net.toLocaleString('en-IN')}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleFavorite(tool.id);
                                }}
                                className={`p-2 rounded-xl transition-all duration-300 ${
                                  favorites.includes(tool.id)
                                    ? 'bg-rose-50 text-rose-500 hover:scale-110'
                                    : 'bg-slate-50 text-slate-300 hover:text-rose-400 hover:bg-rose-50 hover:scale-110'
                                }`}
                                title={favorites.includes(tool.id) ? "Remove PIN" : "PIN to top"}
                              >
                                <svg className={`w-3.5 h-3.5 ${favorites.includes(tool.id) ? 'fill-current' : 'stroke-current fill-none'}`} viewBox="0 0 24 24" strokeWidth="2.5">
                                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                              </button>
                              <div className={`p-2 rounded-xl border ${
                                hasLiveCalculations ? 'border-teal-200 text-teal-600 bg-teal-50/50' : 'border-slate-100 text-slate-400 group-hover:text-teal-600 group-hover:bg-teal-50/50'
                              } transition-all`}>
                                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    } else if (viewMode === 'compact') {
                      return (
                        <Link 
                          key={tool.id} 
                          to={destinationPath}
                          className={`group bg-white p-4 rounded-2xl border transition-all duration-300 flex flex-col active:scale-[0.98] relative text-center items-center justify-center min-h-[140px] ${
                            hasLiveCalculations
                              ? 'col-span-2 sm:col-span-2 lg:col-span-3 border-teal-500 shadow-xl shadow-teal-50/50 ring-4 ring-teal-50'
                              : 'border-slate-200 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-100/10'
                          }`}
                        >
                          <div className={`text-3xl p-2.5 rounded-xl transition-all duration-300 mb-2 shrink-0 ${
                            hasLiveCalculations ? 'bg-teal-600 text-white shadow-lg shadow-teal-100' : 'bg-slate-50 group-hover:bg-teal-50'
                          }`}>
                            {tool.icon}
                          </div>

                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleFavorite(tool.id);
                            }}
                            className={`absolute top-2 right-2 p-1.5 rounded-lg transition-all duration-300 ${
                              favorites.includes(tool.id)
                                ? 'bg-rose-50 text-rose-500 hover:scale-110'
                                : 'bg-slate-50 text-slate-300 hover:text-rose-400 hover:bg-rose-50 hover:scale-110'
                            }`}
                            title={favorites.includes(tool.id) ? "Remove PIN" : "PIN to top"}
                          >
                            <svg className={`w-3.5 h-3.5 ${favorites.includes(tool.id) ? 'fill-current' : 'stroke-current fill-none'}`} viewBox="0 0 24 24" strokeWidth="2.5">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                          </button>

                          <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-teal-700 transition-colors flex-1 flex items-center justify-center">
                            {tool.name}
                          </h3>

                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1.5 shrink-0">
                            {tool.category}
                          </span>

                          {hasLiveCalculations && calculatedSalary && (
                            <div className="mt-2 w-full bg-slate-50 border border-slate-100 p-2 rounded-xl text-[10px] space-y-1 shrink-0">
                              <div className="flex justify-between text-slate-500 font-bold">
                                <span>Net Pay:</span>
                                <span className="text-teal-600">₹{calculatedSalary.net.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                          )}
                        </Link>
                      );
                    } else {
                      // Comfort Grid view
                      return (
                        <Link 
                          key={tool.id} 
                          to={destinationPath}
                          className={`group bg-white p-6 rounded-[2rem] border transition-all duration-300 flex flex-col active:scale-[0.98] relative ${
                            hasLiveCalculations
                              ? 'col-span-1 sm:col-span-2 lg:col-span-2 border-teal-500 shadow-xl shadow-teal-50/50 ring-4 ring-teal-50'
                              : 'border-slate-200 hover:border-teal-200 hover:shadow-2xl hover:shadow-teal-100/30'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-6">
                            <div className={`text-4xl p-4 rounded-2xl transition-all duration-500 shrink-0 group-hover:scale-110 rotate-0 group-hover:rotate-6 ${
                              hasLiveCalculations ? 'bg-teal-600 text-white shadow-lg shadow-teal-100' : 'bg-slate-50 group-hover:bg-teal-50'
                            }`}>
                              {tool.icon}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                                {tool.category}
                              </span>
                              
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleFavorite(tool.id);
                                }}
                                className={`p-2 rounded-xl transition-all duration-300 ${
                                  favorites.includes(tool.id)
                                    ? 'bg-rose-50 text-rose-500 hover:scale-110'
                                    : 'bg-slate-50 text-slate-300 hover:text-rose-400 hover:bg-rose-50 hover:scale-110'
                                }`}
                                title={favorites.includes(tool.id) ? "Remove PIN" : "PIN to top"}
                              >
                                <svg className={`w-4 h-4 ${favorites.includes(tool.id) ? 'fill-current' : 'stroke-current fill-none'}`} viewBox="0 0 24 24" strokeWidth="2.5">
                                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-teal-700 transition-colors">
                            {tool.name}
                          </h3>
                          
                          {hasLiveCalculations && calculatedSalary ? (
                            <div className="space-y-4 mt-2 flex-1">
                              <p className="text-xs font-semibold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-lg inline-block">
                                ⚡ Live calculation results for your query
                              </p>
                              <div className="bg-slate-50 rounded-2xl p-4 space-y-3 border border-slate-100 text-xs">
                                <div className="grid grid-cols-2 gap-2 text-slate-500 font-medium">
                                  {queryDept && (
                                    <div className="col-span-2 border-b border-slate-200/40 pb-1.5 mb-1">
                                      <span className="text-[10px] uppercase font-black tracking-wider block text-slate-400">Department</span>
                                      <span className="text-slate-700 font-bold line-clamp-1">{queryDept}</span>
                                    </div>
                                  )}
                                  {queryPost && (
                                    <div className="border-r border-slate-200/40 pr-2">
                                      <span className="text-[10px] uppercase font-black tracking-wider block text-slate-400">Designation</span>
                                      <span className="text-slate-700 font-bold line-clamp-1">{queryPost}</span>
                                    </div>
                                  )}
                                  <div>
                                    <span className="text-[10px] uppercase font-black tracking-wider block text-slate-400">Pay Level</span>
                                    <span className="text-slate-700 font-bold">{queryLevel}</span>
                                  </div>
                                </div>

                                <div className="border-t border-slate-200/60 pt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                                  <div className="bg-white p-2 rounded-xl border border-slate-100">
                                    <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Basic Pay</span>
                                    <p className="text-xs sm:text-sm font-bold text-slate-800">₹{calculatedSalary.basic.toLocaleString('en-IN')}</p>
                                  </div>
                                  <div className="bg-white p-2 rounded-xl border border-slate-100">
                                    <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">DA (60%)</span>
                                    <p className="text-xs sm:text-sm font-bold text-slate-800">₹{calculatedSalary.da.toLocaleString('en-IN')}</p>
                                  </div>
                                  <div className="bg-white p-2 rounded-xl border border-slate-100">
                                    <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">HRA</span>
                                    <p className="text-xs sm:text-sm font-bold text-slate-800">₹{calculatedSalary.hra.toLocaleString('en-IN')}</p>
                                  </div>
                                  <div className="bg-teal-50/50 p-2 rounded-xl border border-teal-100/30">
                                    <span className="text-[9px] uppercase font-black text-teal-600 tracking-wider">Gross Pay</span>
                                    <p className="text-xs sm:text-sm font-extrabold text-teal-700">₹{calculatedSalary.gross.toLocaleString('en-IN')}</p>
                                  </div>
                                </div>

                                <div className="border-t border-slate-200/60 pt-3 flex flex-col sm:flex-row justify-between items-center gap-3">
                                  <div className="text-slate-500 font-medium text-center sm:text-left">
                                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">Total Deductions</span>
                                    <span className="text-xs sm:text-sm font-bold text-rose-600">₹{calculatedSalary.deductions.toLocaleString('en-IN')}</span>
                                  </div>
                                  <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-4 py-2 rounded-2xl shadow-md text-center flex-1 sm:flex-none w-full sm:w-auto">
                                    <span className="text-[9px] uppercase font-black text-teal-100 tracking-wider block leading-none mb-1">Net Take-Home Pay</span>
                                    <span className="text-sm sm:text-base font-black leading-none">₹{calculatedSalary.net.toLocaleString('en-IN')}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed flex-1">
                              {tool.description}
                            </p>
                          )}

                          <div className="mt-6 pt-6 border-t border-slate-50 flex items-center text-teal-600 font-bold text-xs group-hover:translate-x-1 transition-all">
                            {hasLiveCalculations ? 'Open Full Salary Calculator' : 'Launch Tool'}
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </div>
                        </Link>
                      );
                    }
                  })}
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
