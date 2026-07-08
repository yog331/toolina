import React, { useState, useEffect } from 'react';
import AccompanyingText from '../components/AccompanyingText';
import ShareWidget from '../components/ShareWidget';
import SEO from '../components/SEO';
import StarRatingWidget from '../components/StarRatingWidget';
import { 
  Flame, 
  Info, 
  Heart, 
  Activity, 
  Scale, 
  Dumbbell, 
  Apple, 
  Droplet, 
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Settings,
  User,
  RefreshCw,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface MacroSplit {
  protein: number; // percentage
  carbs: number;   // percentage
  fat: number;     // percentage
}

const MACRO_PRESETS: Record<string, { name: string; split: MacroSplit; desc: string }> = {
  balanced: {
    name: 'Balanced',
    split: { protein: 30, carbs: 40, fat: 30 },
    desc: 'Ideal for general health, weight maintenance, and moderate activity levels.'
  },
  high_protein: {
    name: 'High Protein / Muscle Building',
    split: { protein: 35, carbs: 35, fat: 30 },
    desc: 'Optimized for muscle synthesis, strength training, and lean mass preservation.'
  },
  low_carb: {
    name: 'Low Carb / Ketogenic',
    split: { protein: 30, carbs: 5, fat: 65 },
    desc: 'High fat, very low carb setup designed for nutritional ketosis and rapid fat adaptation.'
  },
  low_fat: {
    name: 'Low Fat / Endurance',
    split: { protein: 25, carbs: 55, fat: 20 },
    desc: 'Rich in carbohydrates, perfect for glycogen replenishment and high-endurance performance.'
  },
  custom: {
    name: 'Custom Split',
    split: { protein: 33, carbs: 33, fat: 34 },
    desc: 'Manually adjust protein, carbs, and fats to fit your specific dietary protocol.'
  }
};

const TDEECalculator: React.FC = () => {
  const [ratingInfo, setRatingInfo] = useState<{ rating: number; count: number }>({ rating: 4.8, count: 185 });

  // Basic inputs
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number | ''>(28);
  const [weight, setWeight] = useState<number | ''>(75); // kg or lbs
  const [heightCm, setHeightCm] = useState<number | ''>(178);
  const [heightFt, setHeightFt] = useState<number | ''>(5);
  const [heightIn, setHeightIn] = useState<number | ''>(10);
  const [activityLevel, setActivityLevel] = useState<string>('moderate');
  const [bodyFat, setBodyFat] = useState<number | ''>(''); // Optional body fat %
  const [formula, setFormula] = useState<'mifflin' | 'harris' | 'katch'>('mifflin');

  // Goals & Macros
  const [goal, setGoal] = useState<string>('lose_standard');
  const [macroPreset, setMacroPreset] = useState<string>('balanced');
  const [customProtein, setCustomProtein] = useState<number>(30);
  const [customCarbs, setCustomCarbs] = useState<number>(40);
  const [customFat, setCustomFat] = useState<number>(30);

  // Computed results
  const [bmr, setBmr] = useState<number | null>(null);
  const [tdee, setTdee] = useState<number | null>(null);
  const [targetCalories, setTargetCalories] = useState<number | null>(null);
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Sync custom macro splits when preset changes
  useEffect(() => {
    if (macroPreset !== 'custom' && MACRO_PRESETS[macroPreset]) {
      const { split } = MACRO_PRESETS[macroPreset];
      setCustomProtein(split.protein);
      setCustomCarbs(split.carbs);
      setCustomFat(split.fat);
    }
  }, [macroPreset]);

  // Adjust custom sliders to maintain 100% total
  const handleCustomMacroChange = (type: 'protein' | 'carbs' | 'fat', value: number) => {
    setMacroPreset('custom');
    if (type === 'protein') {
      const remaining = 100 - value;
      const totalOthers = customCarbs + customFat;
      if (totalOthers === 0) {
        setCustomProtein(value);
        setCustomCarbs(Math.round(remaining / 2));
        setCustomFat(Math.round(remaining / 2));
      } else {
        setCustomProtein(value);
        setCustomCarbs(Math.round((customCarbs / totalOthers) * remaining));
        setCustomFat(Math.max(0, 100 - value - Math.round((customCarbs / totalOthers) * remaining)));
      }
    } else if (type === 'carbs') {
      const remaining = 100 - value;
      const totalOthers = customProtein + customFat;
      if (totalOthers === 0) {
        setCustomCarbs(value);
        setCustomProtein(Math.round(remaining / 2));
        setCustomFat(Math.round(remaining / 2));
      } else {
        setCustomCarbs(value);
        setCustomProtein(Math.round((customProtein / totalOthers) * remaining));
        setCustomFat(Math.max(0, 100 - value - Math.round((customProtein / totalOthers) * remaining)));
      }
    } else {
      const remaining = 100 - value;
      const totalOthers = customProtein + customCarbs;
      if (totalOthers === 0) {
        setCustomFat(value);
        setCustomProtein(Math.round(remaining / 2));
        setCustomCarbs(Math.round(remaining / 2));
      } else {
        setCustomFat(value);
        setCustomProtein(Math.round((customProtein / totalOthers) * remaining));
        setCustomCarbs(Math.max(0, 100 - value - Math.round((customProtein / totalOthers) * remaining)));
      }
    }
  };

  const calculateTDEE = () => {
    if (!age || !weight) return;

    // Convert inputs to metric if they are imperial
    let weightKg = weight as number;
    if (unitSystem === 'imperial') {
      weightKg = weightKg * 0.45359237;
    }

    let heightCmVal = 0;
    if (unitSystem === 'metric') {
      if (!heightCm) return;
      heightCmVal = heightCm as number;
    } else {
      if (heightFt === '' || heightIn === '') return;
      const totalInches = (Number(heightFt) * 12) + Number(heightIn);
      heightCmVal = totalInches * 2.54;
    }

    const ageNum = age as number;
    let bmrVal = 0;

    // Determine BMR Formula
    if (bodyFat !== '' && bodyFat !== 0 && formula === 'katch') {
      // Katch-McArdle Formula
      const leanBodyMass = weightKg * (1 - (Number(bodyFat) / 100));
      bmrVal = 370 + (21.6 * leanBodyMass);
    } else if (formula === 'harris') {
      // Revised Harris-Benedict Formula
      if (gender === 'male') {
        bmrVal = 88.362 + (13.397 * weightKg) + (4.799 * heightCmVal) - (5.677 * ageNum);
      } else {
        bmrVal = 447.593 + (9.247 * weightKg) + (3.098 * heightCmVal) - (4.330 * ageNum);
      }
    } else {
      // Mifflin-St Jeor (Default)
      if (gender === 'male') {
        bmrVal = (10 * weightKg) + (6.25 * heightCmVal) - (5 * ageNum) + 5;
      } else {
        bmrVal = (10 * weightKg) + (6.25 * heightCmVal) - (5 * ageNum) - 161;
      }
    }

    bmrVal = Math.round(bmrVal);

    // Activity multipliers
    const multipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    const multiplier = multipliers[activityLevel] || 1.2;
    const tdeeVal = Math.round(bmrVal * multiplier);

    // Target Calories based on Goal
    let calorieDiff = 0;
    if (goal === 'lose_mild') calorieDiff = -250;
    else if (goal === 'lose_standard') calorieDiff = -500;
    else if (goal === 'lose_extreme') calorieDiff = -750;
    else if (goal === 'gain_mild') calorieDiff = 250;
    else if (goal === 'gain_standard') calorieDiff = 500;
    else if (goal === 'gain_extreme') calorieDiff = 750;

    const targetVal = Math.round(tdeeVal + calorieDiff);

    setBmr(bmrVal);
    setTdee(tdeeVal);
    setTargetCalories(targetVal);
    setIsCalculated(true);
  };

  // Run initial calculation or recalculate on input changes
  useEffect(() => {
    if (age && weight && (heightCm || (heightFt !== '' && heightIn !== ''))) {
      calculateTDEE();
    }
  }, [unitSystem, gender, age, weight, heightCm, heightFt, heightIn, activityLevel, bodyFat, formula, goal]);

  // Macronutrient Grams
  const pPct = macroPreset === 'custom' ? customProtein : MACRO_PRESETS[macroPreset]?.split.protein || 30;
  const cPct = macroPreset === 'custom' ? customCarbs : MACRO_PRESETS[macroPreset]?.split.carbs || 40;
  const fPct = macroPreset === 'custom' ? customFat : MACRO_PRESETS[macroPreset]?.split.fat || 30;

  const getMacroGrams = () => {
    if (!targetCalories) return { proteinG: 0, carbsG: 0, fatG: 0, proteinCal: 0, carbsCal: 0, fatCal: 0 };
    const proteinCal = Math.round(targetCalories * (pPct / 100));
    const carbsCal = Math.round(targetCalories * (cPct / 100));
    const fatCal = Math.round(targetCalories * (fPct / 100));

    return {
      proteinG: Math.round(proteinCal / 4),
      carbsG: Math.round(carbsCal / 4),
      fatG: Math.round(fatCal / 9),
      proteinCal,
      carbsCal,
      fatCal
    };
  };

  const macros = getMacroGrams();

  // Water intake based on Weight (35ml per kg)
  const getWaterIntake = () => {
    if (!weight) return { liters: 0, ounces: 0 };
    let weightKg = weight as number;
    if (unitSystem === 'imperial') {
      weightKg = weightKg * 0.45359237;
    }
    const ml = weightKg * 35;
    const liters = parseFloat((ml / 1000).toFixed(1));
    const ounces = parseFloat((ml * 0.033814).toFixed(1));
    return { liters, ounces };
  };

  const water = getWaterIntake();

  // Safety Warnings for low calorie targets
  const getSafetyWarning = () => {
    if (!targetCalories) return null;
    const minCalories = gender === 'male' ? 1500 : 1200;
    if (targetCalories < minCalories) {
      return `Warning: Your target caloric intake (${targetCalories} kcal) falls below the widely recommended general safety threshold of ${minCalories} kcal per day for ${gender}s. Consider a milder calorie deficit or consult with a healthcare professional before pursuing this target.`;
    }
    return null;
  };

  const warning = getSafetyWarning();

  // BMI helper to show alongside
  const getBmiEstimation = () => {
    if (!weight) return null;
    let wKg = weight as number;
    if (unitSystem === 'imperial') { wKg = wKg * 0.45359237; }

    let hCm = 0;
    if (unitSystem === 'metric') {
      if (!heightCm) return null;
      hCm = heightCm as number;
    } else {
      if (heightFt === '' || heightIn === '') return null;
      hCm = ((Number(heightFt) * 12) + Number(heightIn)) * 2.54;
    }

    const bmiVal = parseFloat((wKg / ((hCm / 100) * (hCm / 100))).toFixed(1));
    let status = '';
    let color = '';
    if (bmiVal < 18.5) { status = 'Underweight'; color = 'text-blue-600'; }
    else if (bmiVal < 25) { status = 'Healthy Weight'; color = 'text-emerald-600'; }
    else if (bmiVal < 30) { status = 'Overweight'; color = 'text-orange-600'; }
    else { status = 'Obese'; color = 'text-red-600'; }

    return { bmiVal, status, color };
  };

  const bmiEst = getBmiEstimation();

  return (
    <article className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <SEO 
        title="TDEE & Macronutrient Target Calculator - Precise Fitness Planner" 
        description="Calculate your Total Daily Energy Expenditure (TDEE), BMR, and macronutrient targets (protein, fat, carbs) based on your custom weight loss or muscle building goals. High-accuracy fit calculator." 
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "TDEE & Macronutrient Target Calculator",
          "applicationCategory": "HealthApplication",
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
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-50 rounded-bl-[15rem] -mr-20 -mt-20 opacity-50 blur-3xl"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-rose-500 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center text-3xl md:text-4xl shadow-xl shadow-rose-100 text-white shrink-0">
              <Flame className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
                <span className="text-rose-600">TDEE</span> & Macro Calculator
              </h1>
              <p className="text-slate-500 font-medium text-xs md:text-lg mt-1 italic">Total Daily Energy Expenditure & Macronutrient Target Planner</p>
            </div>
          </div>
          <div className="bg-slate-100 px-4 py-2 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-200 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" /> Active Fitness Engine
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          
          {/* Main Controls Panel */}
          <section className="lg:col-span-6 space-y-6">
            <div className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-inner space-y-6">
              
              {/* Unit System & Gender Selectors */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-1 rounded-2xl border border-slate-150 flex">
                  <button
                    type="button"
                    onClick={() => setUnitSystem('metric')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${unitSystem === 'metric' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Metric (kg/cm)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnitSystem('imperial')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${unitSystem === 'imperial' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Imperial (lb/ft)
                  </button>
                </div>

                <div className="bg-white p-1 rounded-2xl border border-slate-150 flex">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${gender === 'male' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${gender === 'female' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Female
                  </button>
                </div>
              </div>

              {/* Physical Parameters Input */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 ml-1">Age (Years)</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="number" 
                      value={age}
                      min={10}
                      max={120}
                      onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full pl-11 pr-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-rose-50 transition-all font-mono font-bold text-slate-800"
                      placeholder="e.g. 28"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 ml-1">Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})</label>
                  <div className="relative">
                    <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="number" 
                      value={weight}
                      min={20}
                      max={500}
                      onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full pl-11 pr-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-rose-50 transition-all font-mono font-bold text-slate-800"
                      placeholder={unitSystem === 'metric' ? 'e.g. 75' : 'e.g. 165'}
                    />
                  </div>
                </div>
              </div>

              {/* Height Settings */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 ml-1">Height</label>
                {unitSystem === 'metric' ? (
                  <div className="relative">
                    <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="number" 
                      value={heightCm}
                      min={100}
                      max={250}
                      onChange={(e) => setHeightCm(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full pl-11 pr-14 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-rose-50 transition-all font-mono font-bold text-slate-800"
                      placeholder="e.g. 178"
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">cm</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input 
                        type="number" 
                        value={heightFt}
                        min={3}
                        max={8}
                        onChange={(e) => setHeightFt(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-rose-50 transition-all font-mono font-bold text-slate-800"
                        placeholder="Ft"
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">ft</span>
                    </div>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={heightIn}
                        min={0}
                        max={11}
                        onChange={(e) => setHeightIn(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-rose-50 transition-all font-mono font-bold text-slate-800"
                        placeholder="In"
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">in</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Activity level selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 ml-1">Activity Level</label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-rose-50 transition-all font-bold text-slate-800"
                >
                  <option value="sedentary">Sedentary (Little or no exercise, desk job)</option>
                  <option value="light">Lightly Active (Light exercise 1-3 days/week)</option>
                  <option value="moderate">Moderately Active (Moderate exercise 3-5 days/week)</option>
                  <option value="active">Active (Hard exercise 6-7 days/week)</option>
                  <option value="very_active">Very Active (Heavy sports, physical job, daily double-sessions)</option>
                </select>
              </div>

              {/* Advanced Formulas & Body Fat Option */}
              <div className="pt-2 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 focus:outline-none"
                >
                  <Settings className="w-3.5 h-3.5 animate-spin-slow" />
                  {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options & Body Fat %'}
                </button>

                {showAdvanced && (
                  <div className="mt-4 p-4 bg-white rounded-2xl border border-slate-200/70 space-y-4 animate-in slide-in-from-top-4 duration-300">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">Formula Preference</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setFormula('mifflin')}
                          className={`py-2 px-1 text-[10px] font-black uppercase tracking-wider rounded-xl border ${formula === 'mifflin' ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                        >
                          Mifflin-St Jeor
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormula('harris')}
                          className={`py-2 px-1 text-[10px] font-black uppercase tracking-wider rounded-xl border ${formula === 'harris' ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                        >
                          Harris-Benedict
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormula('katch')}
                          className={`py-2 px-1 text-[10px] font-black uppercase tracking-wider rounded-xl border ${formula === 'katch' ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                          disabled={bodyFat === ''}
                          title={bodyFat === '' ? 'Please enter Body Fat % below to unlock Katch-McArdle' : ''}
                        >
                          Katch-McArdle
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-bold text-slate-700">Body Fat Percentage (Optional)</label>
                        <span className="text-[10px] font-bold text-slate-400">Enables LBM Formula</span>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          value={bodyFat}
                          min={2}
                          max={60}
                          onChange={(e) => {
                            const val = e.target.value === '' ? '' : Number(e.target.value);
                            setBodyFat(val);
                            if (val === '') {
                              setFormula('mifflin');
                            } else {
                              setFormula('katch');
                            }
                          }}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 ring-rose-50 transition-all font-mono font-bold text-slate-800 text-sm"
                          placeholder="e.g. 15"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </section>

          {/* Goals and Macros Setting Panels */}
          <section className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-inner space-y-6 h-full flex flex-col">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span> Goal & Diet Configuration
              </h2>

              {/* Goal Selector */}
              <div className="space-y-2 flex-1">
                <label className="block text-xs font-bold text-slate-700 ml-1">What is your Fitness Goal?</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'lose_standard', title: 'Lose Weight', icon: <TrendingDown className="w-4 h-4" />, desc: '-500 kcal (Deficit)' },
                    { id: 'maintain', title: 'Maintain', icon: <Scale className="w-4 h-4" />, desc: '0 kcal (Balance)' },
                    { id: 'gain_standard', title: 'Gain Weight', icon: <TrendingUp className="w-4 h-4" />, desc: '+500 kcal (Surplus)' }
                  ].map((goalItem) => (
                    <button
                      key={goalItem.id}
                      type="button"
                      onClick={() => setGoal(goalItem.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${goal === goalItem.id ? 'bg-white border-rose-500 shadow-lg shadow-rose-100/50 ring-2 ring-rose-500/10' : 'bg-white border-slate-200/80 hover:bg-slate-50'}`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2.5 ${goal === goalItem.id ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {goalItem.icon}
                      </div>
                      <h3 className="font-bold text-xs text-slate-800 leading-none">{goalItem.title}</h3>
                      <p className="text-[10px] text-slate-400 font-medium mt-1">{goalItem.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-bold text-slate-600 ml-1 mb-2">Adjust Intensity Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {goal.startsWith('lose') ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setGoal('lose_mild')}
                          className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border ${goal === 'lose_mild' ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                        >
                          Mild (-250 kcal)
                        </button>
                        <button
                          type="button"
                          onClick={() => setGoal('lose_standard')}
                          className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border ${goal === 'lose_standard' ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                        >
                          Standard (-500)
                        </button>
                        <button
                          type="button"
                          onClick={() => setGoal('lose_extreme')}
                          className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border ${goal === 'lose_extreme' ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                        >
                          Extreme (-750)
                        </button>
                      </>
                    ) : goal.startsWith('gain') ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setGoal('gain_mild')}
                          className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border ${goal === 'gain_mild' ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                        >
                          Mild (+250 kcal)
                        </button>
                        <button
                          type="button"
                          onClick={() => setGoal('gain_standard')}
                          className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border ${goal === 'gain_standard' ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                        >
                          Standard (+500)
                        </button>
                        <button
                          type="button"
                          onClick={() => setGoal('gain_extreme')}
                          className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border ${goal === 'gain_extreme' ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                        >
                          Extreme (+750)
                        </button>
                      </>
                    ) : (
                      <div className="col-span-3 text-[10px] text-slate-400 italic text-center py-2 border border-dashed border-slate-200 rounded-xl">
                        Caloric intake locked at standard maintenance.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Macronutrient Presets Selector */}
              <div className="space-y-4 pt-4 border-t border-slate-200/60">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 ml-1">Macronutrient Distribution</label>
                  <select
                    value={macroPreset}
                    onChange={(e) => setMacroPreset(e.target.value)}
                    className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-rose-50 transition-all font-bold text-slate-800 text-sm"
                  >
                    <option value="balanced">Balanced (40% Carbs, 30% Protein, 30% Fat)</option>
                    <option value="high_protein">High Protein (35% Protein, 35% Carbs, 30% Fat)</option>
                    <option value="low_carb">Low Carb / Keto (65% Fat, 30% Protein, 5% Carbs)</option>
                    <option value="low_fat">Low Fat (55% Carbs, 25% Protein, 20% Fat)</option>
                    <option value="custom">Custom Split...</option>
                  </select>
                </div>

                {/* Macro Sliders for Custom/Preset representation */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-4">
                  {/* Slider Labels */}
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                    <span>Macros Split</span>
                    <span className={`${pPct + cPct + fPct === 100 ? 'text-emerald-500' : 'text-rose-500 font-black'}`}>
                      Total: {pPct + cPct + fPct}%
                    </span>
                  </div>

                  {/* Protein Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700 flex items-center gap-1"><span className="w-2.5 h-2.5 bg-rose-500 rounded-sm"></span> Protein</span>
                      <span className="font-mono text-slate-900">{pPct}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="80" 
                      value={pPct}
                      onChange={(e) => handleCustomMacroChange('protein', Number(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-500" 
                    />
                  </div>

                  {/* Carbs Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700 flex items-center gap-1"><span className="w-2.5 h-2.5 bg-indigo-500 rounded-sm"></span> Carbohydrates</span>
                      <span className="font-mono text-slate-900">{cPct}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="80" 
                      value={cPct}
                      onChange={(e) => handleCustomMacroChange('carbs', Number(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                    />
                  </div>

                  {/* Fat Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700 flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-sm"></span> Fats</span>
                      <span className="font-mono text-slate-900">{fPct}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="80" 
                      value={fPct}
                      onChange={(e) => handleCustomMacroChange('fat', Number(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500" 
                    />
                  </div>
                </div>
              </div>

            </div>
          </section>

        </div>

        {/* Results Presentation Block */}
        {isCalculated && targetCalories && bmr && tdee && (
          <section className="mt-12 pt-12 border-t border-slate-200 space-y-10 animate-in fade-in duration-500">
            
            {/* Top High-level Numbers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* BMR Card */}
              <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2.5rem] flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 group-hover:scale-125 transition-transform text-slate-800">
                  <User className="w-32 h-32" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Basal Metabolic Rate</span>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight font-mono">{bmr} <span className="text-sm font-normal text-slate-400 uppercase font-sans">kcal/day</span></h3>
                </div>
                <p className="text-slate-500 text-xs mt-3 leading-relaxed">
                  The caloric load your body expends resting in a completely neutral climate state, basic homeostasis.
                </p>
              </div>

              {/* TDEE Card */}
              <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2.5rem] flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 group-hover:scale-125 transition-transform text-slate-800">
                  <Activity className="w-32 h-32" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Maintenance (TDEE)</span>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight font-mono">{tdee} <span className="text-sm font-normal text-slate-400 uppercase font-sans">kcal/day</span></h3>
                </div>
                <p className="text-slate-500 text-xs mt-3 leading-relaxed">
                  Total Daily Energy Expenditure, accounting for both resting metabolism and your current activity multiplier.
                </p>
              </div>

              {/* Target Calories Card (Highlighted) */}
              <div className="bg-rose-50 border border-rose-100 p-6 rounded-[2.5rem] flex flex-col justify-between relative overflow-hidden group shadow-lg shadow-rose-50">
                <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 group-hover:scale-125 transition-transform text-rose-900">
                  <Flame className="w-32 h-32" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest block mb-1">Target Daily Caloric Intake</span>
                  <h3 className="text-4xl font-black text-rose-600 tracking-tight font-mono">{targetCalories} <span className="text-sm font-bold text-rose-400 uppercase font-sans">kcal/day</span></h3>
                </div>
                <div className="mt-3 flex items-center gap-1.5 bg-white border border-rose-200/50 rounded-full py-1 px-3 self-start text-[10px] font-bold text-rose-600">
                  {goal.startsWith('lose') ? <TrendingDown className="w-3 h-3" /> : goal.startsWith('gain') ? <TrendingUp className="w-3 h-3" /> : <Scale className="w-3 h-3" />}
                  {goal === 'maintain' ? 'Maintenance Target' : `${Math.abs(targetCalories - tdee)} kcal ${goal.startsWith('lose') ? 'Deficit' : 'Surplus'}`}
                </div>
              </div>

            </div>

            {/* Warnings Alert */}
            {warning && (
              <div className="bg-amber-50 border border-amber-200 p-5 rounded-3xl flex items-start gap-3.5 text-amber-800 text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 animate-bounce" />
                <p className="font-semibold leading-relaxed">{warning}</p>
              </div>
            )}

            {/* Detailed Macro Breakdown & Visual Bar Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Detailed Numbers */}
              <div className="lg:col-span-5 space-y-4">
                <h3 className="text-lg font-black tracking-tight text-slate-950 flex items-center gap-2">
                  <Apple className="w-5 h-5 text-rose-500" /> Macronutrient Breakdown
                </h3>

                {/* Protein row */}
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-3xl flex justify-between items-center group hover:bg-rose-50/20 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center font-bold text-sm">P</div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-800">Protein</h4>
                      <p className="text-[10px] text-slate-400 font-bold">{pPct}% of diet • 4 kcal/g</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-rose-600 font-mono">{macros.proteinG} g</div>
                    <div className="text-[10px] text-slate-400 font-bold font-mono">{macros.proteinCal} kcal</div>
                  </div>
                </div>

                {/* Carbs row */}
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-3xl flex justify-between items-center group hover:bg-indigo-50/20 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500 text-white rounded-xl flex items-center justify-center font-bold text-sm">C</div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-800">Carbohydrates</h4>
                      <p className="text-[10px] text-slate-400 font-bold">{cPct}% of diet • 4 kcal/g</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-indigo-600 font-mono">{macros.carbsG} g</div>
                    <div className="text-[10px] text-slate-400 font-bold font-mono">{macros.carbsCal} kcal</div>
                  </div>
                </div>

                {/* Fat row */}
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-3xl flex justify-between items-center group hover:bg-amber-50/20 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center font-bold text-sm">F</div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-800">Fats</h4>
                      <p className="text-[10px] text-slate-400 font-bold">{fPct}% of diet • 9 kcal/g</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-amber-600 font-mono">{macros.fatG} g</div>
                    <div className="text-[10px] text-slate-400 font-bold font-mono">{macros.fatCal} kcal</div>
                  </div>
                </div>

              </div>

              {/* Graphical Macro Visualizer */}
              <div className="lg:col-span-7 bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Visual Caloric Budget</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Interactive Layout</span>
                  </div>

                  {/* Stacked Proportional Bar */}
                  <div className="h-8 w-full rounded-2xl overflow-hidden flex shadow-inner border border-slate-250">
                    <div 
                      className="bg-rose-500 h-full flex items-center justify-center text-white text-[10px] font-black transition-all duration-500"
                      style={{ width: `${pPct}%` }}
                      title={`Protein: ${pPct}%`}
                    >
                      {pPct >= 10 ? `${pPct}%` : ''}
                    </div>
                    <div 
                      className="bg-indigo-500 h-full flex items-center justify-center text-white text-[10px] font-black transition-all duration-500"
                      style={{ width: `${cPct}%` }}
                      title={`Carbs: ${cPct}%`}
                    >
                      {cPct >= 10 ? `${cPct}%` : ''}
                    </div>
                    <div 
                      className="bg-amber-500 h-full flex items-center justify-center text-white text-[10px] font-black transition-all duration-500"
                      style={{ width: `${fPct}%` }}
                      title={`Fats: ${fPct}%`}
                    >
                      {fPct >= 10 ? `${fPct}%` : ''}
                    </div>
                  </div>

                  {/* Quick details about targets */}
                  <p className="text-xs text-slate-500 leading-relaxed pt-2">
                    This distribution utilizes <strong className="text-slate-800">{MACRO_PRESETS[macroPreset]?.name || 'Custom'}</strong> metrics. Adjust the percentage split above to fit any structured diet plans like carnivore, keto, vertical, or flexible dieting (IIFYM).
                  </p>
                </div>

                {/* Additional Health stats: BMI status estimation & Water targets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-200">
                  <div className="bg-white p-4 rounded-2xl border border-slate-150 flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 shrink-0">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase block leading-none">Estimated BMI</span>
                      {bmiEst ? (
                        <>
                          <span className="text-sm font-bold text-slate-800">{bmiEst.bmiVal} kg/m²</span>
                          <span className={`text-[9px] font-bold block ${bmiEst.color}`}>{bmiEst.status}</span>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No weight/height</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-150 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                      <Droplet className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-slate-400 uppercase block leading-none">Water Target</span>
                      <span className="text-sm font-bold text-slate-800">{water.liters} Liters</span>
                      <span className="text-[9px] font-bold text-slate-400 block">{water.ounces} Fl Oz per day</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </section>
        )}

      </header>

      {/* Helpful Quick Stats / Legend */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Sedentary', desc: 'No active workouts; desk job, minimal walking.', factor: 'BMR x 1.2', color: 'border-slate-200 bg-slate-50' },
          { label: 'Lightly Active', desc: 'Light structured exercise 1-3 days per week.', factor: 'BMR x 1.375', color: 'border-slate-200 bg-slate-50' },
          { label: 'Moderately Active', desc: 'Moderate intense workouts 3-5 days per week.', factor: 'BMR x 1.55', color: 'border-slate-200 bg-slate-50' },
          { label: 'Very Active', desc: 'Hard sports, physical manual labor, or double sessions.', factor: 'BMR x 1.725', color: 'border-slate-200 bg-slate-50' }
        ].map((item, i) => (
          <div key={i} className={`p-6 rounded-[2rem] border ${item.color} flex flex-col justify-between shadow-sm`}>
            <div>
              <h3 className="text-xs font-black uppercase text-slate-800 mb-1">{item.label}</h3>
              <p className="text-[11px] leading-relaxed text-slate-400 font-medium">{item.desc}</p>
            </div>
            <div className="text-[10px] font-mono font-bold text-rose-500 uppercase tracking-wider mt-4">{item.factor}</div>
          </div>
        ))}
      </section>

      {/* Structured Informational Block */}
      <footer className="bg-slate-900 rounded-[3.5rem] p-8 md:p-16 text-white space-y-16 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.05),transparent)] pointer-events-none"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-tight">
              Decoding <span className="text-rose-500">TDEE & Energy Balance</span>
            </h2>
            <p className="text-slate-400 leading-relaxed text-lg">
              Your Total Daily Energy Expenditure (TDEE) is an estimation of how many calories you burn per day. It is determined by assessing your basal metabolic rate (resting calories) and multiplying it by an activity coefficient representing physical exertion.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <h3 className="text-rose-400 font-bold text-sm mb-2 uppercase tracking-widest">Caloric Deficit</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">Eating fewer calories than your TDEE triggers your body to burn stored tissue (fat and muscle) for cellular energy, resulting in weight loss.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                <h3 className="text-rose-400 font-bold text-sm mb-2 uppercase tracking-widest">Caloric Surplus</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">Consuming more calories than your TDEE provides the excess energy needed for muscle synthesis and metabolic adaptations, resulting in weight gain.</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
              <h3 className="text-lg font-black uppercase tracking-widest text-slate-300 mb-6 flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-rose-500" /> TDEE Frequently Asked Questions
              </h3>
              <ul className="space-y-6">
                {[
                  { q: "How accurate is this TDEE calculator?", a: "This tool uses the Mifflin-St Jeor equation, the most reliable scientific standard for general populations. Adding your exact body fat percentage unlocks the highly specific Katch-McArdle formula." },
                  { q: "Why did my weight loss plateau?", a: "As your body mass decreases, your TDEE also naturally shrinks because smaller bodies require less heat energy. Make sure to update your weight weekly in this tool to re-calculate accurate metrics." },
                  { q: "How much protein do I really need?", a: "While general guidelines recommend 10-35% of calories, active lifters seeking muscle growth generally benefit from 1.6 to 2.2 grams of protein per kilogram of body weight (0.8-1g per lb)." },
                  { q: "What should I set my activity level to?", a: "Most people overestimate their daily activity. If you work a seated office desk job, set it to 'Sedentary' even if you exercise for 30-45 minutes a few times a week. This ensures you do not over-estimate and stall weight loss." }
                ].map((item, i) => (
                  <li key={i} className="space-y-1">
                    <h4 className="text-sm font-bold text-rose-400">{item.q}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.a}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 relative z-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Expertly Engineered by Toolina Body Mechanics</p>
        </div>
      </footer>
    
      <AccompanyingText 
        toolName="TDEE & Macronutrient Target Calculator"
        howItWorks="This high-accuracy health planner utilizes client-side algorithms like the Mifflin-St Jeor, Revised Harris-Benedict, and Katch-McArdle formulas to compute resting metabolism. It combines your parameters with standard physical activity level (PAL) multipliers to determine total daily expenditure and map out calorie targets with safe thresholds."
        whyItsUseful="Whether you are bodybuilding, cutting body fat, prepping for a marathon, or simply wanting to establish a solid diet routine, this tool completely replaces paid apps. It lets you customize macronutrient presets (Keto, High Protein, Balanced, or custom) on the fly, calculating exact grams of protein, carbs, and fats so you can hit your aesthetic and athletic goals effortlessly."
        faqs={[
          { q: "Is my personal physical data private?", a: "Absolutely. All metabolic calculations are handled 100% locally inside your web browser. We never store, collect, or transmit your body weight, fat, or other physical metrics to any remote server." },
          { q: "What is the difference between BMR and TDEE?", a: "BMR is the base amount of energy required to keep your body alive and functioning in a sleeping, rested state. TDEE includes BMR plus the energy needed to walk, talk, digest food, and perform structured physical exercises." },
          { q: "Can this help with a Ketogenic diet?", a: "Yes, our low carb / ketogenic macro preset automatically drops carbohydrate limits to 5% of your target calorie intake and shifts fat targets to 65%, letting you track keto targets with full accuracy." }
        ]}
      />
  
      <div className="max-w-3xl mx-auto my-8">
        <StarRatingWidget 
          toolId="tdeecalculator" 
          defaultRating={4.8} 
          defaultCount={185} 
          onRatingChange={(rating, count) => setRatingInfo({ rating, count })} 
        />
      </div>
      <ShareWidget title="TDEE & Macronutrient Target Calculator" />
    </article>
  );
};

export default TDEECalculator;
