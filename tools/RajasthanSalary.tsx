import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AccompanyingText from '../components/AccompanyingText';
import ShareWidget from '../components/ShareWidget';
import SEO from '../components/SEO';
import StarRatingWidget from '../components/StarRatingWidget';
import AdUnit from '../components/AdUnit';
import { 
  PAY_LEVELS, 
  PAY_MATRIX,
  PROBATIONER_PAY_MAP,
  MAJOR_CITIES,
  DEPARTMENT_DATA,
  MESS_RATE_PRESETS,
  HARD_DUTY_PRESETS,
  getHraRate,
  getCCARate,
  NPA_PERCENT,
  WASH_ALLOWANCE_FIXED,
  RGHS_SLABS as DEFAULT_RGHS, 
  SI_SLABS as DEFAULT_SI, 
  GPF_SLABS as DEFAULT_GPF,
  GRADE_PAY_MAP
} from './constants';
import { SalaryState, CalculatedResult, Slab, SISlab } from './types';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip
} from 'recharts';
import { 
  Landmark, User, ChevronUp, ChevronDown, Banknote, 
  Layers, Utensils, ShieldHalf, Building2, BriefcaseMedical, 
  Shirt, TreePine, FileCheck, Info, ArrowUp, MinusCircle, 
  PlusCircle, CalendarCheck, Coins, Calculator, 
  Table, PieChart as PieChartIcon, Book, BookOpen, ShieldCheck
} from 'lucide-react';

const COLORS = ['#0d9488', '#0f766e', '#14b8a6', '#5eead4', '#2dd4bf', '#99f6e4'];

const RajasthanSalary: React.FC = () => {
  const [ratingInfo, setRatingInfo] = useState<{rating: number, count: number}>({ rating: 4.6, count: 137 });

    // SEO Optimization
  useEffect(() => {
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", "Calculate Rajasthan State Government Employee Salary as per 7th Pay Commission. Includes DA, HRA, Arrears, GPF/NPS deductions, and detailed pay breakdown for all departments.");

    // Structured Data (JSON-LD)
    const scriptId = "rajasthan-salary-json-ld";
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Rajasthan Govt Salary Calculator",
      "description": "Salary calculation tool for Rajasthan government employees based on the 7th Pay Commission rules.",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "All",
      "author": {
        "@type": "Organization",
        "name": "Toolina"
      }
    });

    return () => { script?.remove(); };
  }, []);

  const [showOptional, setShowOptional] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  
  const [rghsSlabs] = useState<Slab[]>(DEFAULT_RGHS);
  const [siSlabs] = useState<SISlab[]>(DEFAULT_SI);
  const [gpfSlabs] = useState<Slab[]>(DEFAULT_GPF);
  const [isManualGpf, setIsManualGpf] = useState<boolean>(false);
  const [isProbationer, setIsProbationer] = useState<boolean>(false);

  const [salary, setSalary] = useState<SalaryState>({
    department: 'None',
    post: 'None',
    basicPay: 33800,
    level: 'L-10',
    daRate: 60,
    hraCategory: 'Z',
    cityName: 'Other Cities',
    hasCca: true,
    hasNpa: false,
    hasWash: false,
    hasMess: false,
    hasRural: false,
    hasHardDuty: false,
    manualMessRate: 0,
    manualHardDutyRate: 0,
    manualRuralRate: 1000,
    otherAllowances: 0,
    arrears: 0,
    pensionType: 'GPF',
    siDeduction: 2200,
    gpfDeduction: 0,
    rghsDeduction: 0,
    incomeTax: 0,
    otherDeductions: 0
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.da_rate) {
          setSalary(prev => ({ ...prev, daRate: data.da_rate }));
        }
      })
      .catch(err => console.error("Failed to fetch DA rate:", err));
  }, []);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const deptParam = searchParams.get('dept') || searchParams.get('department');
    const postParam = searchParams.get('post') || searchParams.get('designation') || searchParams.get('desig');
    const levelParam = searchParams.get('level');
    const basicParam = searchParams.get('basic') || searchParams.get('basicPay') || searchParams.get('pay');

    if (deptParam || postParam || levelParam || basicParam) {
      setSalary(prev => {
        let targetDept = prev.department;
        let targetPost = prev.post;
        let targetLevel = prev.level;
        let targetBasic = prev.basicPay;

        if (deptParam) {
          const matchedDept = DEPARTMENT_DATA.find(d => 
            d.name.toLowerCase() === deptParam.toLowerCase() || 
            d.name.toLowerCase().includes(deptParam.toLowerCase())
          );
          if (matchedDept) {
            targetDept = matchedDept.name;
            if (matchedDept.posts.length > 0) {
              targetPost = matchedDept.posts[0].title;
              targetLevel = matchedDept.posts[0].level;
              targetBasic = matchedDept.posts[0].initialPay;
            }
          }
        }

        if (postParam) {
          const searchDepts = deptParam ? (DEPARTMENT_DATA.filter(d => d.name === targetDept)) : DEPARTMENT_DATA;
          for (const d of searchDepts) {
            const matchedPost = d.posts.find(p => 
              p.title.toLowerCase() === postParam.toLowerCase() || 
              p.title.toLowerCase().includes(postParam.toLowerCase())
            );
            if (matchedPost) {
              targetDept = d.name;
              targetPost = matchedPost.title;
              targetLevel = matchedPost.level;
              targetBasic = matchedPost.initialPay;
              break;
            }
          }
        }

        if (levelParam) {
          const upperLevel = levelParam.toUpperCase();
          if (PAY_LEVELS.includes(upperLevel)) {
            targetLevel = upperLevel;
            const matrixVals = PAY_MATRIX[upperLevel] || [];
            if (matrixVals.length > 0) {
              targetBasic = matrixVals[0];
            }
          }
        }

        if (basicParam) {
          const bpNum = parseInt(basicParam);
          if (!isNaN(bpNum)) {
            targetBasic = bpNum;
          }
        }

        return {
          ...prev,
          department: targetDept,
          post: targetPost,
          level: targetLevel,
          basicPay: targetBasic
        };
      });
    }
  }, [searchParams]);

  const currentDepartment = useMemo(() => 
    DEPARTMENT_DATA.find(d => d.name === salary.department) || null
  , [salary.department]);

  const uniquePosts = useMemo(() => {
    if (!currentDepartment) return [];
    const unique = currentDepartment.posts.reduce((acc, current) => {
      const isDup = acc.some(p => p.title === current.title && p.level === current.level);
      if (!isDup) {
        acc.push(current);
      }
      return acc;
    }, [] as typeof currentDepartment.posts);
    return [...unique].sort((a, b) => a.title.localeCompare(b.title));
  }, [currentDepartment]);

  const eligibleSiRates = useMemo(() => {
    const basic = Number(salary.basicPay) || 0;
    const baseIndex = siSlabs.findIndex(s => basic >= s.minPay && basic <= s.maxPay);
    if (baseIndex === -1) return [siSlabs[siSlabs.length - 1]?.rate || 0];
    
    const rates = [];
    for (let i = 0; i < 3; i++) {
      if (siSlabs[baseIndex + i]) {
        rates.push(siSlabs[baseIndex + i].rate);
      }
    }
    return rates.length > 0 ? rates : [0];
  }, [salary.basicPay, siSlabs]);

  const results = useMemo((): CalculatedResult => {
    const basic = Number(salary.basicPay) || 0;
    const daRate = isProbationer ? 0 : (Number(salary.daRate) || 0);
    
    // NPA is treated as pay for DA and HRA calculation in Rajasthan
    const npaAmount = (!isProbationer && salary.hasNpa) ? Math.round(basic * NPA_PERCENT) : 0;
    const payForAllowances = basic + npaAmount;
    
    const daAmount = isProbationer ? 0 : Math.round((payForAllowances * daRate) / 100);
    const hraRate = isProbationer ? 0 : getHraRate(salary.hraCategory, daRate);
    const hraAmount = isProbationer ? 0 : Math.round((payForAllowances * hraRate) / 100);
    
    const ccaAmount = (!isProbationer && salary.hasCca) ? getCCARate(basic, salary.cityName) : 0;
    const washAmount = (!isProbationer && salary.hasWash) ? WASH_ALLOWANCE_FIXED : 0;
    const messAmount = (!isProbationer && salary.hasMess) ? (Number(salary.manualMessRate) || 0) : 0;
    const hardDutyAmount = (!isProbationer && salary.hasHardDuty) ? (Number(salary.manualHardDutyRate) || 0) : 0; 
    const ruralAmount = (!isProbationer && salary.hasRural) ? (Number(salary.manualRuralRate) || 0) : 0;
    const arrearsAmount = Number(salary.arrears) || 0;

    const optionalTotal = ccaAmount + npaAmount + washAmount + messAmount + hardDutyAmount + ruralAmount + (isProbationer ? 0 : (Number(salary.otherAllowances) || 0));
    const totalAllowances = daAmount + hraAmount + optionalTotal;
    const grossPay = basic + totalAllowances + arrearsAmount;
    const actualSi = isProbationer ? 0 : (Number(salary.siDeduction) || 0);
    const actualGpf = Number(salary.gpfDeduction) || 0;
    const actualRghs = Number(salary.rghsDeduction) || 0;
    const actualIt = Number(salary.incomeTax) || 0;
    const actualOther = Number(salary.otherDeductions) || 0;

    const totalDeductions = actualSi + actualGpf + actualRghs + actualIt + actualOther;
    
    return { 
      grossPay, totalDeductions, netPay: Math.max(0, grossPay - totalDeductions), 
      arrearsAmount,
      daAmount, hraAmount, hraRate, optionalTotal, totalAllowances,
      ccaAmount, npaAmount, washAmount, messAmount, ruralAmount, hardDutyAmount
    };
  }, [salary, isProbationer]);

  const handleDepartmentChange = (deptName: string) => {
    const dept = DEPARTMENT_DATA.find(d => d.name === deptName);
    if (dept) {
      const post = dept.posts[0];
      const bp = isProbationer ? (PROBATIONER_PAY_MAP[post.level] || 12400) : post.initialPay;
      setSalary(prev => ({ 
        ...prev, 
        department: deptName, 
        post: post.title, 
        level: post.level,
        basicPay: bp,
        manualMessRate: post.messRate || 0,
        manualHardDutyRate: post.hardDutyRate || 0,
        manualRuralRate: post.ruralRate || 1000,
        hasMess: (post.messRate || 0) > 0,
        hasHardDuty: (post.hardDutyRate || 0) > 0,
        hasRural: (post.ruralRate || 0) > 0
      }));
    } else {
      setSalary(prev => ({ ...prev, department: deptName, post: 'None' }));
    }
  };

  const handlePostChange = (postValue: string) => {
    if (currentDepartment) {
      const [postTitle, postLevel] = postValue.split('|');
      const post = currentDepartment.posts.find(p => p.title === postTitle && p.level === postLevel);
      if (post) {
        const bp = isProbationer ? (PROBATIONER_PAY_MAP[post.level] || 12400) : post.initialPay;
        setSalary(prev => ({ 
          ...prev, 
          post: post.title, 
          level: post.level,
          basicPay: bp,
          manualMessRate: post.messRate || 0,
          manualHardDutyRate: post.hardDutyRate || 0,
          manualRuralRate: post.ruralRate || 1000,
          hasMess: (post.messRate || 0) > 0,
          hasHardDuty: (post.hardDutyRate || 0) > 0,
          hasRural: (post.ruralRate || 0) > 0
        }));
      }
    }
  };

  const handleLevelChange = (newLevel: string) => {
    if (isProbationer) {
      const bp = PROBATIONER_PAY_MAP[newLevel] || 12400;
      setSalary(prev => ({ ...prev, level: newLevel, basicPay: bp }));
    } else {
      const availableSteps = PAY_MATRIX[newLevel] || [0];
      setSalary(prev => ({ ...prev, level: newLevel, basicPay: availableSteps[0] }));
    }
  };

  const handleCityChange = (cityName: string) => {
    const city = MAJOR_CITIES.find(c => c.name === cityName);
    if (city) setSalary(prev => ({ ...prev, cityName, hraCategory: city.category as 'Y' | 'Z' }));
  };

  useEffect(() => {
    const basic = Number(salary.basicPay) || 0;
    const rghs = rghsSlabs.find(s => basic <= s.maxPay)?.rate || rghsSlabs[rghsSlabs.length - 1].rate;

    if (isProbationer) {
      let gpfVal = 0;
      if (salary.pensionType === 'GPF') {
        const num = parseInt(salary.level.replace('L-', '')) || 0;
        if (num >= 1 && num <= 7) gpfVal = 700;
        else if (num >= 8 && num <= 9) gpfVal = 800;
        else if (num >= 10 && num <= 11) gpfVal = 1100;
        else if (num >= 12 && num <= 14) gpfVal = 1400;
        else if (num === 15) gpfVal = 1800;
        else if (num >= 16 && num <= 17) gpfVal = 2100;
        else if (num >= 18 && num <= 19) gpfVal = 2400;
        else if (num >= 20 && num <= 21) gpfVal = 3000;
        else if (num >= 22 && num <= 23) gpfVal = 4500;
        else if (num === 24) gpfVal = 5000;
      }
      setSalary(prev => ({
        ...prev,
        rghsDeduction: rghs,
        gpfDeduction: isManualGpf ? prev.gpfDeduction : gpfVal,
        siDeduction: 0
      }));
      return;
    }

    const baseSiRate = eligibleSiRates[0] || 0;
    const isCurrentSiValid = eligibleSiRates.includes(salary.siDeduction);
    
    let autoPensionDed = 0;
    if (salary.pensionType === 'NPS') {
      const daAmount = Math.round((basic * (Number(salary.daRate) || 0)) / 100);
      autoPensionDed = Math.round((basic + daAmount) * 0.10);
    } else {
      autoPensionDed = gpfSlabs.find(s => basic <= s.maxPay)?.rate || gpfSlabs[gpfSlabs.length - 1].rate;
    }

    setSalary(prev => ({
      ...prev,
      rghsDeduction: rghs,
      siDeduction: isCurrentSiValid ? prev.siDeduction : baseSiRate,
      gpfDeduction: isManualGpf ? prev.gpfDeduction : autoPensionDed
    }));
  }, [salary.basicPay, salary.daRate, salary.pensionType, salary.level, rghsSlabs, eligibleSiRates, gpfSlabs, isManualGpf, isProbationer]);

  const chartData = [
    { name: 'Basic', value: Number(salary.basicPay) || 0 },
    { name: 'DA', value: results.daAmount },
    { name: 'HRA', value: results.hraAmount },
    { name: 'Allowances', value: results.optionalTotal },
    ...(results.arrearsAmount > 0 ? [{ name: 'Arrears', value: results.arrearsAmount }] : []),
  ];

  const seoTitle = useMemo(() => {
    if (salary.department && salary.post) {
      return `${salary.post} (${salary.level}) Salary Calculator - Rajasthan ${salary.department} | Toolina`;
    }
    if (salary.level) {
      return `${salary.level} Pay Scale Salary Calculator - Rajasthan 7th Pay Matrix | Toolina`;
    }
    return "Rajasthan Govt Salary Calculator - 7th Pay Commission | Toolina";
  }, [salary.department, salary.post, salary.level]);

  const seoDescription = useMemo(() => {
    const basic = Number(salary.basicPay) || 0;
    const net = results.netPay;
    if (salary.post) {
      return `Calculate exact monthly salary for ${salary.post} in Rajasthan. Current Basic Pay: ₹${basic.toLocaleString('en-IN')}, Estimated Net Take-Home Pay: ₹${net.toLocaleString('en-IN')} with 60% DA and HRA allowances.`;
    }
    return "Calculate Rajasthan Government employee salary with 7th Pay Commission pay matrix. Get accurate DA, HRA, GPF, SI, RGHS, and net take-home salary.";
  }, [salary.post, salary.basicPay, results.netPay]);

  const takeHomeRatio = results.grossPay > 0 ? Math.round((results.netPay / results.grossPay) * 100) : 0;

  const colorMap: Record<string, { text: string, bg: string }> = {
    teal: { text: 'text-teal-500', bg: 'bg-teal-50' },
    emerald: { text: 'text-emerald-500', bg: 'bg-emerald-50' },
    amber: { text: 'text-amber-500', bg: 'bg-amber-50' },
    pink: { text: 'text-pink-500', bg: 'bg-pink-50' },
    rose: { text: 'text-rose-500', bg: 'bg-rose-50' }
  };

  return (
    <article className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <SEO title={seoTitle} description={seoDescription} 
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Rajasthan Govt Salary Calculator - 7th Pay Commission",
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
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-50 rounded-bl-[15rem] -mr-20 -mt-20 opacity-50 blur-3xl"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-teal-600 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center text-3xl md:text-4xl shadow-xl shadow-teal-100 text-white shrink-0">
              <Landmark className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
                Rajasthan Govt <span className="text-teal-600">Salary Calculator</span>
              </h1>
              <p className="text-slate-500 font-medium text-xs md:text-lg mt-1 italic">7th Pay Commission Salary Calculator</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="bg-slate-100 px-4 py-2 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">
              Rule Compliance: Rajasthan RSR
            </div>
            <div className="flex items-center gap-2 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-100">
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-teal-700 uppercase tracking-widest">Live Calculation</span>
            </div>
          </div>
        </div>
      </header>

      {/* Top Banner Ad */}
      <AdUnit slot="rajasthan-salary-top-banner" format="horizontal" />

      <main className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Employee Profile & Core Pay */}
            <section className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center shadow-lg shadow-teal-100">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Employee Profile</h3>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                  <ShieldCheck className="w-3 h-3" />
                  Verified RSR 2025
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
                  <div className="relative">
                    <select 
                      value={salary.department} 
                      onChange={(e) => handleDepartmentChange(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-800 outline-none focus:ring-4 ring-teal-50 transition-all cursor-pointer appearance-none"
                    >
                      <option value="None">None (Manual Entry)</option>
                      {[...DEPARTMENT_DATA].sort((a, b) => a.name.localeCompare(b.name)).map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Designation</label>
                  <div className="relative">
                    <select 
                      value={salary.department === 'None' ? 'None' : `${salary.post}|${salary.level}`} 
                      onChange={(e) => handlePostChange(e.target.value)} 
                      disabled={salary.department === 'None'}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-800 outline-none focus:ring-4 ring-teal-50 transition-all disabled:opacity-50 cursor-pointer appearance-none"
                    >
                      {currentDepartment ? (
                        uniquePosts.map(p => {
                          const isDuplicateTitle = uniquePosts.filter(x => x.title === p.title).length > 1;
                          const displayText = isDuplicateTitle ? `${p.title} (${p.level})` : p.title;
                          const val = `${p.title}|${p.level}`;
                          return (
                            <option key={val} value={val}>{displayText}</option>
                          );
                        })
                      ) : (
                        <option value="None">Select Department First</option>
                      )}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pay Level</label>
                  <div className="relative">
                    <select 
                      value={salary.level} 
                      onChange={(e) => handleLevelChange(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-800 outline-none focus:ring-4 ring-teal-50 transition-all cursor-pointer appearance-none"
                    >
                      {PAY_LEVELS.map(level => (
                        <option key={level} value={level}>{level} (GP: {GRADE_PAY_MAP[level]})</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                 <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Basic Pay</label>
                  <div className="relative">
                    <select 
                      value={isProbationer ? 'probationer' : salary.basicPay} 
                      onChange={(e) => {
                        if (e.target.value === 'probationer') {
                          setIsProbationer(true);
                          const pPay = PROBATIONER_PAY_MAP[salary.level] || 12400;
                          setSalary(prev => ({ 
                            ...prev, 
                            basicPay: pPay,
                            gpfDeduction: 0,
                            siDeduction: 0,
                            hasCca: false,
                            hasNpa: false,
                            hasWash: false,
                            hasMess: false,
                            hasRural: false,
                            hasHardDuty: false,
                            otherAllowances: 0
                          }));
                        } else {
                          setIsProbationer(false);
                          const val = parseInt(e.target.value) || 0;
                          setSalary(prev => ({ ...prev, basicPay: val }));
                        }
                      }} 
                      className="w-full bg-teal-50 border border-teal-100 rounded-2xl p-4 text-sm font-black text-teal-700 outline-none focus:ring-4 ring-teal-50 transition-all cursor-pointer appearance-none"
                    >
                      <option value="probationer">Probationer Pay - ₹{(PROBATIONER_PAY_MAP[salary.level] || 12400).toLocaleString('en-IN')}</option>
                      {(PAY_MATRIX[salary.level] || []).map((pay, idx) => (
                        <option key={pay} value={pay}>Regular Year {idx + 1} - ₹{pay.toLocaleString('en-IN')}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-600 pointer-events-none" />
                  </div>
                </div>
              </div>
            </section>
            
            {isProbationer && (
              <div className="bg-amber-50/80 border border-amber-200 p-6 rounded-[2rem] text-amber-900 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full -mr-16 -mt-16 opacity-30 pointer-events-none"></div>
                <div className="flex items-center gap-2.5 text-amber-800 font-black text-xs uppercase tracking-wider">
                  <Info className="w-5 h-5 text-amber-600 animate-bounce" />
                  Probationer Trainee Rules (Rule 16 / Schedule IV)
                </div>
                <p className="text-xs md:text-[13px] leading-relaxed font-semibold text-amber-700">
                  As per the Rajasthan Service Rules (RSR), a probationer-trainee is entitled <span className="underline decoration-amber-400 font-bold">only to the fixed monthly remuneration</span>. 
                  They are not eligible for any allowances (DA, HRA, CCA, Special Pay, Mess, Washing, NPA, etc.) or bonus, and no deductions towards GPF/NPS and State Insurance (SI) apply. 
                  Only standard health contributions (RGHS) and Income Tax (if applicable) are processed.
                </p>
              </div>
            )}

            {/* 2. Allowances & Perks */}
            <section className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-100">
                    <Coins className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Allowances & Perks</h3>
                </div>
                <div className="bg-amber-50 px-4 py-1.5 rounded-full border border-amber-100">
                  <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Total: ₹{results.totalAllowances.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* DA Card */}
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dearness Allowance (DA)</label>
                      <div className="text-2xl font-black text-slate-800">
                        ₹{results.daAmount.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                      <input 
                        type="number" 
                        value={salary.daRate} 
                        onChange={(e) => setSalary({...salary, daRate: parseFloat(e.target.value) || 0})}
                        className="w-12 bg-transparent text-lg font-black text-teal-600 text-center outline-none"
                      />
                      <span className="text-sm font-black text-slate-400">%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <input 
                      type="range" min="0" max="100" step="1" 
                      value={salary.daRate} 
                      onChange={(e) => setSalary({...salary, daRate: parseFloat(e.target.value) || 0})} 
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600" 
                    />
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {[50, 54, 58].map(rate => (
                      <button
                        key={rate}
                        onClick={() => setSalary({...salary, daRate: rate})}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all border ${salary.daRate === rate ? 'bg-teal-600 text-white border-teal-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-teal-200 hover:text-teal-600'}`}
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* City Category / HRA Card */}
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">City Category (HRA)</label>
                      <div className="text-2xl font-black text-slate-800">
                        ₹{results.hraAmount.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                        HRA Rate: {results.hraRate}%
                      </span>
                      {salary.hasCca && results.ccaAmount > 0 && (
                        <span className="text-[9px] font-bold text-slate-500">
                          + ₹{results.ccaAmount} CCA
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1">Category Y (Higher HRA)</div>
                    <div className="grid grid-cols-3 gap-2">
                      {MAJOR_CITIES.filter(c => c.category === 'Y').map(city => (
                        <button 
                          key={city.name} 
                          onClick={() => handleCityChange(city.name)} 
                          className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${salary.cityName === city.name ? 'bg-teal-600 text-white border-teal-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-teal-200 hover:text-teal-600'}`}
                        >
                          {city.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1">Category Z (Standard HRA)</div>
                    <div className="grid grid-cols-1 gap-2">
                      {MAJOR_CITIES.filter(c => c.category === 'Z').map(city => (
                        <button 
                          key={city.name} 
                          onClick={() => handleCityChange(city.name)} 
                          className={`py-2.5 rounded-xl text-[10px] font-black uppercase transition-all border ${salary.cityName === city.name ? 'bg-teal-600 text-white border-teal-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-teal-200 hover:text-teal-600'}`}
                        >
                          {city.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Toggleable Allowances Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {[
                  { label: 'CCA', field: 'hasCca', icon: Building2, amount: getCCARate(Number(salary.basicPay) || 0, salary.cityName) },
                  { label: 'NPA', field: 'hasNpa', icon: BriefcaseMedical, amount: Math.round((Number(salary.basicPay) || 0) * NPA_PERCENT) },
                  { label: 'Wash', field: 'hasWash', icon: Shirt, amount: WASH_ALLOWANCE_FIXED },
                  { label: 'Rural', field: 'hasRural', icon: TreePine, amount: Number(salary.manualRuralRate) || 0 },
                  { label: 'Mess', field: 'hasMess', icon: Utensils, amount: Number(salary.manualMessRate) || 0 },
                  { label: 'Hard Duty', field: 'hasHardDuty', icon: ShieldHalf, amount: Number(salary.manualHardDutyRate) || 0 }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = (salary as any)[item.field];
                  return (
                    <button 
                      key={item.field} 
                      onClick={() => setSalary(prev => ({ ...prev, [item.field]: !isActive }))} 
                      className={`group p-4 rounded-[1.5rem] border transition-all flex flex-col items-center gap-2 ${isActive ? 'bg-teal-600 border-teal-600 shadow-lg scale-105' : 'bg-slate-50 border-slate-100 hover:border-teal-200'}`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-500'}`} />
                      <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-slate-500'}`}>{item.label}</span>
                      {isActive && item.amount > 0 && (
                        <span className="text-[10px] font-bold text-teal-100 bg-teal-700/50 px-2 py-0.5 rounded-full">₹{item.amount.toLocaleString('en-IN')}</span>
                      )}
                      {!isActive && item.amount > 0 && (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">₹{item.amount.toLocaleString('en-IN')}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {(salary.hasRural || salary.hasMess || salary.hasHardDuty) && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  {salary.hasRural && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rural Allowance Rate</label>
                      <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-teal-600 transition-colors">₹</span>
                        <input 
                          type="number" 
                          value={salary.manualRuralRate} 
                          onChange={(e) => setSalary({...salary, manualRuralRate: parseInt(e.target.value) || 0})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-8 text-sm font-bold text-slate-800 outline-none focus:ring-4 ring-teal-50 transition-all"
                        />
                      </div>
                    </div>
                  )}
                  {salary.hasMess && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mess Allowance Rate</label>
                      <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-teal-600 transition-colors">₹</span>
                        <input 
                          type="number" 
                          value={salary.manualMessRate} 
                          onChange={(e) => setSalary({...salary, manualMessRate: parseInt(e.target.value) || 0})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-8 text-sm font-bold text-slate-800 outline-none focus:ring-4 ring-teal-50 transition-all"
                        />
                      </div>
                    </div>
                  )}
                  {salary.hasHardDuty && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hard Duty Rate</label>
                      <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-teal-600 transition-colors">₹</span>
                        <input 
                          type="number" 
                          value={salary.manualHardDutyRate} 
                          onChange={(e) => setSalary({...salary, manualHardDutyRate: parseInt(e.target.value) || 0})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-8 text-sm font-bold text-slate-800 outline-none focus:ring-4 ring-teal-50 transition-all"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Other Allowances</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-teal-600 transition-colors">₹</span>
                    <input 
                      type="number" 
                      value={salary.otherAllowances} 
                      onChange={(e) => setSalary({...salary, otherAllowances: parseInt(e.target.value) || 0})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-8 text-sm font-bold text-slate-800 outline-none focus:ring-4 ring-teal-50 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Arrears (One-time)</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-blue-600 transition-colors">₹</span>
                    <input 
                      type="number" 
                      value={salary.arrears} 
                      onChange={(e) => setSalary({...salary, arrears: parseInt(e.target.value) || 0})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-8 text-sm font-bold text-slate-800 outline-none focus:ring-4 ring-blue-50 transition-all"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Mid-feed In-article Ad */}
            <AdUnit slot="rajasthan-salary-mid-feed" format="fluid" />

            {/* 3. Deductions & Savings */}
            <section className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-50 rounded-full -ml-16 -mb-16 opacity-50"></div>
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-100">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Deductions & Savings</h3>
                </div>
                <div className="bg-rose-50 px-4 py-1.5 rounded-full border border-rose-100">
                  <span className="text-[10px] font-black text-rose-700 uppercase tracking-widest">Total: ₹{results.totalDeductions.toLocaleString()}</span>
                </div>
              </div>

              {/* Pension Type Toggle */}
              <div className="p-1.5 bg-slate-100 rounded-2xl flex relative h-12 z-10">
                <button 
                  onClick={() => {
                    setIsManualGpf(false);
                    setSalary(prev => ({...prev, pensionType: 'GPF'}));
                  }} 
                  className={`flex-1 z-10 text-[10px] font-black uppercase transition-all duration-300 ${salary.pensionType === 'GPF' ? 'text-teal-700' : 'text-slate-400'}`}
                >
                  GPF (Old Scheme)
                </button>
                <button 
                  onClick={() => {
                    setIsManualGpf(false);
                    setSalary(prev => ({...prev, pensionType: 'NPS'}));
                  }} 
                  className={`flex-1 z-10 text-[10px] font-black uppercase transition-all duration-300 ${salary.pensionType === 'NPS' ? 'text-teal-700' : 'text-slate-400'}`}
                >
                  NPS (New Scheme)
                </button>
                <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm transition-all duration-300 ease-out ${salary.pensionType === 'NPS' ? 'translate-x-[calc(100%+6px)]' : 'translate-x-0'}`}></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {/* GPF or NPS Manual Deduction */}
                <div className="space-y-1.5 md:col-span-2 bg-slate-50 p-5 rounded-2xl border border-slate-100/80 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      {salary.pensionType} Contribution
                    </label>
                    <div className="flex items-center gap-2">
                      {isManualGpf ? (
                        <button
                          type="button"
                          onClick={() => {
                            setIsManualGpf(false);
                            const basic = Number(salary.basicPay) || 0;
                            let autoVal = 0;
                            if (isProbationer) {
                              if (salary.pensionType === 'GPF') {
                                const num = parseInt(salary.level.replace('L-', '')) || 0;
                                if (num >= 1 && num <= 7) autoVal = 700;
                                else if (num >= 8 && num <= 9) autoVal = 800;
                                else if (num >= 10 && num <= 11) autoVal = 1100;
                                else if (num >= 12 && num <= 14) autoVal = 1400;
                                else if (num === 15) autoVal = 1800;
                                else if (num >= 16 && num <= 17) autoVal = 2100;
                                else if (num >= 18 && num <= 19) autoVal = 2400;
                                else if (num >= 20 && num <= 21) autoVal = 3000;
                                else if (num >= 22 && num <= 23) autoVal = 4500;
                                else if (num === 24) autoVal = 5000;
                              } else {
                                autoVal = 0;
                              }
                            } else {
                              if (salary.pensionType === 'NPS') {
                                const daAmount = Math.round((basic * (Number(salary.daRate) || 0)) / 100);
                                autoVal = Math.round((basic + daAmount) * 0.10);
                              } else {
                                autoVal = gpfSlabs.find(s => basic <= s.maxPay)?.rate || gpfSlabs[gpfSlabs.length - 1].rate;
                              }
                            }
                            setSalary(prev => ({ ...prev, gpfDeduction: autoVal }));
                          }}
                          className="text-[9px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 px-2.5 py-1 rounded-lg border border-rose-100 hover:bg-rose-100 transition-colors"
                        >
                          Reset to Auto-Slab
                        </button>
                      ) : (
                        <span className="text-[9px] font-black uppercase tracking-wider bg-teal-50 text-teal-600 px-2.5 py-1 rounded-lg border border-teal-100">
                          Auto Slabs (RSR)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-600 font-bold">₹</span>
                    <input 
                      type="number" 
                      value={salary.gpfDeduction} 
                      onChange={(e) => {
                        setIsManualGpf(true);
                        setSalary(prev => ({ ...prev, gpfDeduction: parseInt(e.target.value) || 0 }));
                      }}
                      className="w-full bg-white border border-slate-200 rounded-2xl p-4 pl-8 text-sm font-black text-teal-700 outline-none focus:ring-4 ring-teal-50 transition-all"
                      placeholder={`Enter custom ${salary.pensionType} amount`}
                    />
                  </div>
                  {!isManualGpf && salary.pensionType === 'GPF' && isProbationer && (
                    <p className="text-[10px] font-bold text-slate-400 pl-1">
                      GPF contribution for Probationer Trainee (Pay Level {salary.level}) as per 26-May-2022 order is ₹{salary.gpfDeduction.toLocaleString('en-IN')}.
                    </p>
                  )}
                  {!isManualGpf && salary.pensionType === 'GPF' && !isProbationer && (
                    <p className="text-[10px] font-bold text-slate-400 pl-1">
                      Minimum required GPF contribution for Basic ₹{salary.basicPay.toLocaleString('en-IN')} is ₹{salary.gpfDeduction.toLocaleString('en-IN')}.
                    </p>
                  )}
                  {!isManualGpf && salary.pensionType === 'NPS' && isProbationer && (
                    <p className="text-[10px] font-bold text-slate-400 pl-1">
                      No standard NPS contribution is required for Probationer Trainees.
                    </p>
                  )}
                  {!isManualGpf && salary.pensionType === 'NPS' && !isProbationer && (
                    <p className="text-[10px] font-bold text-slate-400 pl-1">
                      Standard 10% NPS deduction is ₹{salary.gpfDeduction.toLocaleString('en-IN')} (calculated on Basic + DA).
                    </p>
                  )}
                  {isManualGpf && (
                    <p className="text-[10px] font-bold text-amber-600 pl-1 flex items-center gap-1.5 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Manual contribution override is active.
                    </p>
                  )}
                </div>
                {/* SI Selection */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">State Insurance (SI)</label>
                  <div className="flex gap-2">
                    {eligibleSiRates.map((rate, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setSalary({...salary, siDeduction: rate})}
                        className={`flex-1 py-3 rounded-2xl border text-[10px] font-black uppercase transition-all ${salary.siDeduction === rate ? 'bg-teal-600 border-teal-600 text-white shadow-md scale-105' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-teal-200'}`}
                      >
                        <span className="block opacity-60 mb-1">{idx === 0 ? 'Base' : `Step ${idx}`}</span>
                        ₹{rate.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* RGHS Display */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">RGHS Health Scheme</label>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between h-[4.5rem]">
                    <div className="flex items-center gap-2">
                      <BriefcaseMedical className="w-4 h-4 text-rose-400" />
                      <span className="text-xs font-bold text-slate-600">Auto-calculated</span>
                    </div>
                    <span className="text-lg font-black text-rose-600">₹{salary.rghsDeduction.toLocaleString()}</span>
                  </div>
                </div>

                {/* Income Tax */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Income Tax (Monthly)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400 font-bold">₹</span>
                    <input 
                      type="number" 
                      value={salary.incomeTax} 
                      onChange={(e) => setSalary({...salary, incomeTax: parseInt(e.target.value) || 0})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-8 text-sm font-bold text-rose-600 outline-none focus:ring-4 ring-rose-50 transition-all"
                    />
                  </div>
                </div>

                {/* Other Deductions */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Other Deductions</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400 font-bold">₹</span>
                    <input 
                      type="number" 
                      value={salary.otherDeductions} 
                      onChange={(e) => setSalary({...salary, otherDeductions: parseInt(e.target.value) || 0})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-8 text-sm font-bold text-rose-600 outline-none focus:ring-4 ring-rose-50 transition-all"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Results Panel */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-8">
            <section className="bg-slate-900 rounded-[3rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              
              <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400 mb-2">Net Take-Home</p>
                    <div className="text-5xl md:text-6xl font-black tracking-tighter">₹{results.netPay.toLocaleString('en-IN')}</div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest border-b border-white/10 pb-4">
                    <span className="text-slate-400">Earnings Breakdown</span>
                    <span className="text-teal-400">Monthly</span>
                  </div>

                  <div className="space-y-5">
                    {[
                      { label: 'Basic Pay', value: salary.basicPay, color: 'bg-teal-500' },
                      { label: `DA (${salary.daRate}%)`, value: results.daAmount, color: 'bg-teal-400' },
                      { label: `HRA (${results.hraRate}%)`, value: results.hraAmount, color: 'bg-teal-300' },
                      ...(results.optionalTotal > 0 ? [{ label: 'Allowances', value: results.optionalTotal, color: 'bg-amber-400' }] : []),
                      ...(results.arrearsAmount > 0 ? [{ label: 'Arrears', value: results.arrearsAmount, color: 'bg-blue-400' }] : [])
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-400 font-medium">{item.label}</span>
                          <span className="font-bold">₹{item.value.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${item.color} rounded-full transition-all duration-1000`} 
                            style={{ width: `${(item.value / results.grossPay) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-teal-400">Gross Earnings</span>
                      <span className="text-xl font-black">₹{results.grossPay.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest border-b border-white/10 pb-4">
                    <span className="text-slate-400">Deductions Breakdown</span>
                    <span className="text-rose-400">Monthly</span>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: salary.pensionType, value: salary.pensionType === 'NPS' ? results.totalDeductions - (salary.siDeduction + salary.rghsDeduction + salary.incomeTax + salary.otherDeductions) : salary.gpfDeduction, color: 'bg-rose-400' },
                      { label: 'State Insurance', value: salary.siDeduction, color: 'bg-rose-500' },
                      { label: 'RGHS', value: salary.rghsDeduction, color: 'bg-rose-600' },
                      ...(salary.incomeTax > 0 ? [{ label: 'Income Tax', value: salary.incomeTax, color: 'bg-rose-700' }] : []),
                      ...(salary.otherDeductions > 0 ? [{ label: 'Other', value: salary.otherDeductions, color: 'bg-rose-800' }] : [])
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${item.color}`}></div>
                          <span className="text-slate-400 font-medium">{item.label}</span>
                        </div>
                        <span className="font-bold text-rose-300">₹{item.value.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-rose-400">Total Deductions</span>
                      <span className="text-lg font-black text-rose-300">₹{results.totalDeductions.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-3xl p-6 border border-white/10 flex items-center justify-between gap-6">
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Efficiency</p>
                    <div className="text-2xl font-black text-teal-400">{takeHomeRatio}%</div>
                    <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">Take-home ratio</p>
                  </div>
                  <div className="w-20 h-20 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={[{value: takeHomeRatio}, {value: 100-takeHomeRatio}]} 
                          cx="50%" cy="50%" innerRadius={25} outerRadius={35} 
                          stroke="none" dataKey="value" startAngle={90} endAngle={-270}
                        >
                          <Cell fill="#2dd4bf" />
                          <Cell fill="rgba(255,255,255,0.1)" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PieChartIcon className="w-4 h-4 text-teal-400 opacity-50" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Tips / Info */}
            <div className="bg-teal-50 rounded-[2rem] p-6 border border-teal-100 space-y-4">
              <div className="flex items-center gap-2 text-teal-800">
                <Info className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Quick Tip</span>
              </div>
              <p className="text-xs text-teal-700 leading-relaxed font-medium">
                DA is usually revised twice a year (Jan & July). Ensure you have the latest rate for accurate results. HRA categories are based on population census.
              </p>
            </div>

            {/* Sidebar Square/Rectangle Ad */}
            <AdUnit slot="rajasthan-salary-sidebar" format="rectangle" />

            {/* Mobile App Promotion */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-6 border border-slate-700 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-teal-500/30 transition-all"></div>
              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-slate-800" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.523 15.3414c-.011.6669.578 1.157 1.2585 1.1122 2.7663-.1865 4.9624-2.5292 4.9624-5.321 0-2.855-2.2858-5.188-5.109-5.3343-.6328-.0327-1.1218.4905-1.1118 1.1243.0232 1.5034-1.229 2.7483-2.7302 2.7214-1.5794-.029-2.836-1.3411-2.7397-2.9238.049-1.0965-.9673-1.954-2.0623-1.7483-2.6517.4983-4.6308 2.825-4.6308 5.617 0 3.03 2.3486 5.5134 5.3426 5.642.668.0287 1.233-.503 1.221-1.171-.027-1.5543 1.34-2.8126 2.894-2.716 1.488.0924 2.6845 1.4014 2.705 2.9972z"></path>
                    <path d="M3.774 21.056c-1.349-1.002-2.193-2.593-2.193-4.364 0-2.518 1.636-4.664 3.92-5.462.639-.224 1.354.269 1.378.948.043 1.176.993 2.138 2.17 2.193 1.23.057 2.274-.888 2.336-2.122.029-.569.549-.974 1.11-.861 2.502.507 4.378 2.709 4.378 5.38 0 2.247-1.328 4.184-3.235 5.093-.563.268-1.231-.119-1.282-.743-.092-1.144-1.077-2.046-2.227-2.027-1.119.018-2.035.918-2.08 2.037-.021.516-.506.877-.999.735-1.107-.318-2.115-.992-2.894-1.921l-.382-.486zM4.697 5.76C3.992 5.011 3.523 4.025 3.393 2.955c-.07-.582.527-1.037 1.096-.867 2.87 0 5.418.528 7.4.78.629.078 1.037.662.923 1.283-.178.966-1.032 1.666-2.023 1.657-1.118-.01-2.072-.888-2.155-2.001-.018-.237-.21-.422-.448-.42-1.947.01-4.041-.259-6.387-.714.288 1.192.936 2.261 1.83 3.09.435.405.352 1.112-.132 1.428-1.579.52-2.316 2.45-2.909 3.84-.218.513-1.01.408-1.094-.132-.128-.83-.105-1.688.083-2.518.158-.696.538-1.565 1.12-2.621z"></path>
                    <path d="M15.42 21.034c2.259-1.503 3.731-4.015 3.731-6.843 0-.9-.133-1.776-.381-2.6-.145-.484.237-.96.746-.928 1.055.065 1.956.883 2.084 1.936.142 1.155-.705 2.222-1.855 2.424-.543.095-.91.611-.84 1.16 2.502 4.14-.99 9.387-5.59 7.784-.576-.2-1.137-.988-.868-1.57.48-.158.916-.48.973-1.363z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-bold tracking-tight">Available on Android</h4>
                  <p className="text-slate-400 text-xs mt-1">Get the official Rajasthan Salary App for faster mobile access.</p>
                </div>
                <a 
                  href="https://play.google.com/store/apps/details?id=com.yogicalculator.rajsalpro" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-2 transition-transform hover:scale-105 active:scale-95"
                >
                  <img 
                    alt="Get it on Google Play" 
                    src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                    className="h-14"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 rounded-[3.5rem] p-8 md:p-16 text-white space-y-16 overflow-hidden relative mt-12">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.05),transparent)] pointer-events-none"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-tight">
              Rajasthan <span className="text-teal-400">Govt Pay Guidance</span>
            </h2>
            <p className="text-slate-400 leading-relaxed text-lg">
              The <strong>Rajasthan 7th Pay Commission</strong> restructured the salary of state government employees to provide a fair and competitive pay structure. Our tool includes calculation for <strong>X, Y, Z city categories</strong> for HRA, <strong>State Insurance (SI)</strong>, <strong>GPF/NPS</strong>, and <strong>RGHS</strong> deductions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <h4 className="text-teal-400 font-bold text-sm mb-2 uppercase tracking-widest">How to Use</h4>
                <ul className="text-[10px] text-slate-500 list-disc list-inside space-y-1">
                  <li>Select Department & Post</li>
                  <li>Enter Basic Pay or Pay Level</li>
                  <li>Adjust DA & HRA Category</li>
                  <li>Review Deductions (SI, GPF, RGHS)</li>
                </ul>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <h4 className="text-teal-400 font-bold text-sm mb-2 uppercase tracking-widest">Key Rules</h4>
                <p className="text-[10px] text-slate-500">Calculations follow Rajasthan RSR 2025 and latest 7th CPC notifications for state employees.</p>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-300 mb-6">Rajasthan Employee FAQ</h3>
              <ul className="space-y-6">
                {[
                  { q: "How is Rajasthan Govt Salary calculated?", a: "It is based on the 7th Pay Commission pay matrix, including Basic Pay, DA, HRA, and other allowances minus SI, GPF/NPS, and RGHS." },
                  { q: "What is the current DA rate in Rajasthan?", a: "DA is updated periodically. Our tool allows you to input the latest rate for accurate projections." },
                  { q: "What are the common deductions?", a: "Common deductions include State Insurance (SI), GPF or NPS, RGHS contribution, and Income Tax." },
                  { q: "How is HRA calculated?", a: "HRA is a percentage of Basic Pay (X: 30%, Y: 20%, Z: 10% when DA > 50%) based on city category." }
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
      </footer>
    
      {/* Hinglish SEO on-page guide */}
      <section className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center font-bold">
            💡
          </div>
          <h2 className="text-xl md:text-2xl font-display font-black text-slate-900 tracking-tight">
            Rajasthan Govt Salary Guide & Calculator (Hinglish Help)
          </h2>
        </div>
        
        <p className="text-sm md:text-base text-slate-600 leading-relaxed">
          Kya aap ek Rajasthan Government Employee hain aur apni <strong>7th Pay Commission monthly salary</strong>, <strong>Dearness Allowance (DA)</strong>, aur <strong>House Rent Allowance (HRA)</strong> ko online compute karna chahte hain? Sabhi departments (jaise Education, Police, Revenue, State GST, and Health) ke employees ke liye salary check karne ka yeh sabse reliable aur automated tool hai.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-3">
            <h3 className="text-base font-black text-slate-800">
              1. Salary Calculation Kaise Hoti Hai?
            </h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              Rajasthan government employee ki gross pay primary teen components se banti hai: <strong>Basic Pay</strong> (jo aapke L-1 se L-24 matrix level par depend karta hai), current <strong>Dearness Allowance (DA)</strong>, aur aapke city category ke mutabik mila <strong>HRA (House Rent Allowance)</strong>. Inme anya benefits jaise CCA, Special Pay, ya Hard Duty Allowances ko bhi add kiya jata hai.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-black text-slate-800">
              2. Probationer Trainee Salary Kitni Hoti Hai?
            </h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              Rajasthan Service Rules (RSR Rule 16) ke hisab se, starting ke 2 saal ka probation period mandatory hota hai. Is <strong>2 years probation period</strong> ke dauran employee ko ek <strong>Fixed Remuneration</strong> (Niyat Masik Vetany) milti hai. Isme DA, HRA, CCA, ya koi extra allowances nahi milte hain. Sirf RGHS aur applicable Income Tax deduct hota hai.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-black text-slate-800">
              3. GPF and RGHS Deductions List
            </h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              Gross pay se statutory deductions hote hain: State Insurance (SI), Rajasthan Government Health Scheme (RGHS), aur <strong>General Provident Fund (GPF)</strong> ya NPS. Hamara calculator automatically aapke level ke anusar minimum GPF deduction slab select kar leta hai, jise aap chahein toh badha bhi sakte hain.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-black text-slate-800">
              4. City Category (X, Y, Z) Rules for HRA
            </h3>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              Rajasthan me HRA rate cities par nirbhar karta hai. Jaipur, Jodhpur, Ajmer, Kota, aur Bikaner jaisi Class Y cities me <strong>HRA rate high (Y Category)</strong> hota hai, jabki baki sabhi locations Standard HRA Class Z me aate hain. Hamara tool automatically current rules ke anusar exact HRA apply karta hai.
            </p>
          </div>
        </div>

        <div className="bg-teal-50/50 p-6 rounded-3xl border border-teal-100/80 text-teal-950 space-y-2">
          <h4 className="text-xs font-black uppercase tracking-widest text-teal-800">
            Quick Steps: Online Salary Kaise Check Karein?
          </h4>
          <ul className="list-decimal pl-5 space-y-1 text-xs md:text-sm text-teal-900/90 font-medium">
            <li>Sabse pehle dropdown se apna <strong>Department</strong> aur <strong>Designation/Post</strong> select karein.</li>
            <li>Apna current <strong>7th CPC Pay Level (L-1 se L-24)</strong> aur basic pay select karein.</li>
            <li>Agar aap abhi nayi joining me hain, toh <strong>Probationer Trainee</strong> checkbox/dropdown opt karein.</li>
            <li>Apna shehar (City) choose karein taaki sahi HRA aur CCA system calculate kar sake.</li>
            <li>Kuch hi seconds me aapki precise <strong>Gross Salary, Deductions, and Net Take-home cash in hand</strong> screen par display ho jayegi!</li>
          </ul>
        </div>
      </section>
      
      <AccompanyingText 
        toolName="Rajasthan Salary"
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
          toolId="rajasthansalary" 
          defaultRating={4.6} 
          defaultCount={137} 
          onRatingChange={(rating, count) => setRatingInfo({ rating, count })} 
        />
      </div>
      <ShareWidget title="Rajasthan Govt Salary Calculator" />
      </article>
  );
};

export default RajasthanSalary;
