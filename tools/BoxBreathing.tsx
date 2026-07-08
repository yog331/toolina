import React, { useState, useEffect, useRef } from 'react';
import AccompanyingText from '../components/AccompanyingText';
import ShareWidget from '../components/ShareWidget';
import SEO from '../components/SEO';
import StarRatingWidget from '../components/StarRatingWidget';
import { 
  Wind, 
  Play, 
  Pause, 
  RotateCcw, 
  Info, 
  Brain, 
  Heart, 
  Calendar, 
  Clock, 
  Award, 
  Sliders, 
  BookOpen, 
  CheckCircle2, 
  Sparkles,
  Volume2,
  VolumeX,
  Plus,
  Trash2
} from 'lucide-react';

interface BreathingPattern {
  id: string;
  name: string;
  inhale: number;
  holdIn: number;
  exhale: number;
  holdOut: number;
  description: string;
  benefits: string;
}

const PRESET_PATTERNS: BreathingPattern[] = [
  {
    id: 'box_breathing',
    name: 'Box Breathing (Navy SEALs)',
    inhale: 4,
    holdIn: 4,
    exhale: 4,
    holdOut: 4,
    description: 'A powerful technique used by military elite, athletes, and responders to calm the nervous system, clear the mind, and regain sharp focus under pressure.',
    benefits: 'Resets cortisol levels, increases mental clarity, down-regulates stress response.'
  },
  {
    id: 'relax_478',
    name: '4-7-8 Calming Breath',
    inhale: 4,
    holdIn: 7,
    exhale: 8,
    holdOut: 0,
    description: 'Developed by Dr. Andrew Weil, this pattern acts as a natural tranquilizer for the nervous system, heavily activating the parasympathetic mode.',
    benefits: 'Reduces anxiety, helps combat insomnia, lowers heart rate, promotes swift sleep onset.'
  },
  {
    id: 'coherent',
    name: 'Coherent Resonant Breathing',
    inhale: 5,
    holdIn: 0,
    exhale: 5,
    holdOut: 0,
    description: 'Equal intake and release times trigger cardiovascular resonance, balancing your autonomic nervous system and calming emotional turbulence.',
    benefits: 'Maximizes heart rate variability (HRV), stabilizes blood pressure, balances emotions.'
  },
  {
    id: 'anxiety_711',
    name: '7-11 Panic & Anxiety Relief',
    inhale: 7,
    holdIn: 0,
    exhale: 11,
    holdOut: 0,
    description: 'A structural bio-hack that extends exhalation to signal the brain that it is completely safe, immediately stopping hyperventilation or physical panic.',
    benefits: 'Fast panic relief, lowers central nervous system hyper-arousal, triggers immediate safety signaling.'
  },
  {
    id: 'custom',
    name: 'Custom Breath Cycle',
    inhale: 4,
    holdIn: 2,
    exhale: 4,
    holdOut: 2,
    description: 'Design your own breathing sequence to fit your personal meditation, breathwork, or performance training preferences.',
    benefits: 'Fully adaptable to your unique therapeutic or capacity parameters.'
  }
];

interface CompletedSession {
  timestamp: string;
  patternName: string;
  durationSeconds: number;
}

const BoxBreathing: React.FC = () => {
  const [ratingInfo, setRatingInfo] = useState<{ rating: number; count: number }>({ rating: 4.9, count: 215 });

  // Breathing configuration states
  const [activePatternId, setActivePatternId] = useState<string>('box_breathing');
  const [customInhale, setCustomInhale] = useState<number>(4);
  const [customHoldIn, setCustomHoldIn] = useState<number>(2);
  const [customExhale, setCustomExhale] = useState<number>(4);
  const [customHoldOut, setCustomHoldOut] = useState<number>(2);

  // Sound and feedback
  const [isMuted, setIsMuted] = useState<boolean>(true);

  // Timer & Loop states
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentPhase, setCurrentPhase] = useState<'Inhale' | 'Hold (Full)' | 'Exhale' | 'Hold (Empty)'>('Inhale');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(4);
  const [totalSessionSeconds, setTotalSessionSeconds] = useState<number>(0);
  const [cycleCount, setCycleCount] = useState<number>(0);

  // Logs & Streaks
  const [history, setHistory] = useState<CompletedSession[]>([]);
  const [streak, setStreak] = useState<number>(0);

  // Audio Context Ref (for synth feedback without external sound files)
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Get active configuration
  const currentPattern = PRESET_PATTERNS.find(p => p.id === activePatternId) || PRESET_PATTERNS[0];
  const inhaleTime = activePatternId === 'custom' ? customInhale : currentPattern.inhale;
  const holdInTime = activePatternId === 'custom' ? customHoldIn : currentPattern.holdIn;
  const exhaleTime = activePatternId === 'custom' ? customExhale : currentPattern.exhale;
  const holdOutTime = activePatternId === 'custom' ? customHoldOut : currentPattern.holdOut;

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('breathing_history_logs');
      if (storedHistory) {
        const parsed = JSON.parse(storedHistory) as CompletedSession[];
        setHistory(parsed);
        calculateStreak(parsed);
      }
    } catch (e) {
      console.error("Failed to load history logs", e);
    }
  }, []);

  // Compute stats
  const totalMinutesMindful = Math.round(history.reduce((acc, curr) => acc + curr.durationSeconds, 0) / 60);

  // Check and calculate current daily streak
  const calculateStreak = (logs: CompletedSession[]) => {
    if (logs.length === 0) {
      setStreak(0);
      return;
    }
    
    const uniqueDays = Array.from(new Set(logs.map(log => log.timestamp.split('T')[0]))).sort();
    let currentStreak = 0;
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // If no session today or yesterday, streak is broken
    if (!uniqueDays.includes(todayStr) && !uniqueDays.includes(yesterdayStr)) {
      setStreak(0);
      return;
    }

    let checkDate = new Date();
    let index = uniqueDays.length - 1;
    
    // Walk back and count consecutive days
    while (index >= 0) {
      const dayStr = checkDate.toISOString().split('T')[0];
      if (uniqueDays.includes(dayStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    setStreak(currentStreak);
  };

  // Play synthetic tone helper to guide eyes-free meditation
  const playTone = (frequency: number, type: 'sine' | 'triangle', durationSeconds: number) => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      // Soft release
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSeconds);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + durationSeconds);
    } catch (e) {
      console.warn("Audio feedback initialization skipped/blocked", e);
    }
  };

  // Core Breathing loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRunning) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Cycle through phases depending on non-zero duration
            let nextPhase: typeof currentPhase = currentPhase;
            let nextDuration = 4;

            if (currentPhase === 'Inhale') {
              if (holdInTime > 0) {
                nextPhase = 'Hold (Full)';
                nextDuration = holdInTime;
                playTone(440, 'triangle', 0.4); // Standard tick
              } else {
                nextPhase = 'Exhale';
                nextDuration = exhaleTime;
                playTone(330, 'sine', 0.6); // Lower release tone
              }
            } else if (currentPhase === 'Hold (Full)') {
              nextPhase = 'Exhale';
              nextDuration = exhaleTime;
              playTone(330, 'sine', 0.6);
            } else if (currentPhase === 'Exhale') {
              if (holdOutTime > 0) {
                nextPhase = 'Hold (Empty)';
                nextDuration = holdOutTime;
                playTone(440, 'triangle', 0.4);
              } else {
                nextPhase = 'Inhale';
                nextDuration = inhaleTime;
                playTone(550, 'sine', 0.8); // Higher refresh tone
                setCycleCount(c => c + 1);
              }
            } else if (currentPhase === 'Hold (Empty)') {
              nextPhase = 'Inhale';
              nextDuration = inhaleTime;
              playTone(550, 'sine', 0.8);
              setCycleCount(c => c + 1);
            }

            setCurrentPhase(nextPhase);
            return nextDuration;
          }
          
          // Play a small click tone on remaining ticks
          if (prev === 2) {
            playTone(220, 'triangle', 0.1);
          }
          return prev - 1;
        });

        setTotalSessionSeconds(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, currentPhase, inhaleTime, holdInTime, exhaleTime, holdOutTime]);

  // Handle patterns swap - Reset to safe state
  const handlePatternChange = (id: string) => {
    setActivePatternId(id);
    setIsRunning(false);
    setCurrentPhase('Inhale');
    const selected = PRESET_PATTERNS.find(p => p.id === id) || PRESET_PATTERNS[0];
    const initialSeconds = id === 'custom' ? customInhale : selected.inhale;
    setSecondsRemaining(initialSeconds);
  };

  // Play/Pause Action
  const togglePlay = () => {
    if (!isRunning) {
      // Warm up audio context if starting
      if (typeof window !== 'undefined') {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass && !audioCtxRef.current) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      playTone(550, 'sine', 0.5);
    }
    setIsRunning(!isRunning);
  };

  // Reset Session
  const handleReset = () => {
    setIsRunning(false);
    setCurrentPhase('Inhale');
    setSecondsRemaining(inhaleTime);
    setCycleCount(0);
    
    // Save session logs if user practiced more than 10 seconds
    if (totalSessionSeconds >= 10) {
      const newSession: CompletedSession = {
        timestamp: new Date().toISOString(),
        patternName: activePatternId === 'custom' ? 'Custom Session' : currentPattern.name,
        durationSeconds: totalSessionSeconds
      };
      
      const updatedHistory = [newSession, ...history].slice(0, 50); // limit to last 50 entries
      setHistory(updatedHistory);
      calculateStreak(updatedHistory);
      try {
        localStorage.setItem('breathing_history_logs', JSON.stringify(updatedHistory));
      } catch (e) {
        console.error("Local storage sync failed", e);
      }
    }
    setTotalSessionSeconds(0);
  };

  // Clear Session History
  const clearHistory = () => {
    if (confirm("Are you sure you want to clear your local breathing session history?")) {
      setHistory([]);
      setStreak(0);
      try {
        localStorage.removeItem('breathing_history_logs');
      } catch (e) {
        console.error("Local storage removal failed", e);
      }
    }
  };

  // Calculate dynamic circular scaling class for breathing circle
  // Inhale expands, Exhale contracts, Holds keep state static
  const getCircleStateClasses = () => {
    if (!isRunning) return 'scale-90 bg-emerald-50 text-emerald-800 border-emerald-200';
    
    switch (currentPhase) {
      case 'Inhale':
        return 'scale-110 bg-emerald-100 text-emerald-950 border-emerald-300 shadow-2xl shadow-emerald-200/50 transition-all ease-in-out duration-[4000ms]';
      case 'Hold (Full)':
        return 'scale-110 bg-indigo-100 text-indigo-950 border-indigo-300 shadow-xl shadow-indigo-200/40 transition-none';
      case 'Exhale':
        return 'scale-90 bg-slate-100 text-slate-900 border-slate-300 shadow-sm transition-all ease-in-out duration-[4000ms]';
      case 'Hold (Empty)':
        return 'scale-90 bg-amber-50 text-amber-950 border-amber-300 shadow-inner transition-none';
      default:
        return 'scale-95';
    }
  };

  // Format digital timers
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <article className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <SEO 
        title="Box Breathing & Stress Relief Guide - Deep Relaxation Timer" 
        description="Release stress and focus your mind with our interactive Box Breathing Guide. Clean, customizable pacing with medical benefits and local session logger." 
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Box Breathing & Stress Relief Guide",
          "applicationCategory": "HealthApplication",
          "operatingSystem": "All",
          "aggregateRating": {
             "@type": "AggregateRating",
             "ratingValue": ratingInfo.rating.toString(),
             "ratingCount": ratingInfo.count.toString()
          }
        }}
      />

      <header className="bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-200 shadow-2xl shadow-slate-100/50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-bl-[15rem] -mr-20 -mt-20 opacity-40 blur-3xl"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-emerald-600 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-emerald-100 text-white shrink-0">
              <Wind className={`w-8 h-8 text-white ${isRunning && currentPhase === 'Inhale' ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
                <span className="text-emerald-600">Stress Relief</span> Breathing Guide
              </h1>
              <p className="text-slate-500 font-medium text-xs md:text-lg mt-1 italic">Interactive Box Breathing, Relaxing Cycles & HRV Resonant Guide</p>
            </div>
          </div>
          <div className="bg-slate-100 px-4 py-2 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-200 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Vagus Nerve System
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          
          {/* Visual Breathing Core Block */}
          <section className="lg:col-span-7 bg-slate-50 p-6 md:p-10 rounded-[2.5rem] border border-slate-150 flex flex-col items-center justify-between min-h-[500px]">
            
            {/* Top Bar controls of Breathing Box */}
            <div className="w-full flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  {isRunning ? 'Guide Active' : 'Ready to Breathe'}
                </span>
              </div>

              {/* Sound Feedback Toggle */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2.5 rounded-xl border transition-all ${!isMuted ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'}`}
                title={isMuted ? 'Unmute Sound Guide' : 'Mute Sound Guide'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Breathing Interactive Stage */}
            <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center my-6">
              
              {/* Outer Glow Wave rings (pulsates out when inhale) */}
              {isRunning && currentPhase === 'Inhale' && (
                <div className="absolute inset-0 border-2 border-emerald-300 rounded-full animate-ping opacity-25 scale-125 duration-1000"></div>
              )}
              {isRunning && currentPhase === 'Hold (Full)' && (
                <div className="absolute -inset-4 border border-dashed border-indigo-200 rounded-full animate-spin-slow opacity-50"></div>
              )}

              {/* Inner Circle representing current breath target */}
              <div className={`w-52 h-52 md:w-60 md:h-60 rounded-full border-4 flex flex-col items-center justify-center text-center relative z-10 transition-transform ${getCircleStateClasses()}`}>
                
                {/* Visual second markers */}
                <div className="absolute top-10 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {currentPhase}
                </div>

                <div className="text-5xl md:text-6xl font-black font-mono leading-none tracking-tight my-2">
                  {secondsRemaining}s
                </div>

                <div className="absolute bottom-10 px-4 text-[10px] md:text-xs font-bold opacity-75">
                  {currentPhase === 'Inhale' && 'Expand your chest'}
                  {currentPhase === 'Hold (Full)' && 'Keep air locked'}
                  {currentPhase === 'Exhale' && 'Release with ease'}
                  {currentPhase === 'Hold (Empty)' && 'Rest before breath'}
                </div>

                {/* Arc Progress line */}
                <div className="absolute inset-0 rounded-full border-2 border-slate-100/30"></div>
              </div>

            </div>

            {/* Controls Bar */}
            <div className="w-full space-y-4">
              
              {/* Progress and status counts */}
              <div className="flex justify-between text-xs font-black uppercase tracking-wider text-slate-400 font-mono px-2">
                <div>Timer: <span className="text-slate-800">{formatTime(totalSessionSeconds)}</span></div>
                <div>Completed: <span className="text-slate-800">{cycleCount} {cycleCount === 1 ? 'Cycle' : 'Cycles'}</span></div>
              </div>

              {/* Main Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={togglePlay}
                  className={`flex-1 py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm shadow-md transition-all ${isRunning ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg shadow-emerald-100'}`}
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-5 h-5 fill-white" /> Pause Session
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-white" /> Start Breathing
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm shadow-sm transition-all"
                  title="Finish session and save log"
                >
                  <RotateCcw className="w-4 h-4" /> Save & Reset
                </button>
              </div>

            </div>

          </section>

          {/* Preset Patterns & Configuration */}
          <section className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            <div className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border border-slate-150 space-y-6 h-full flex flex-col">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Brain className="w-4 h-4 text-emerald-500" /> Choose Breathing Pattern
              </h2>

              {/* Preset Cards Selector */}
              <div className="space-y-3 overflow-y-auto max-h-[320px] pr-1 scrollbar-thin">
                {PRESET_PATTERNS.map((pattern) => (
                  <button
                    key={pattern.id}
                    onClick={() => handlePatternChange(pattern.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all ${activePatternId === pattern.id ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/5' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-xs text-slate-800">{pattern.name}</h3>
                      <span className="text-[10px] font-mono font-black text-emerald-600 shrink-0">
                        {pattern.id === 'custom' 
                          ? `${customInhale}-${customHoldIn}-${customExhale}-${customHoldOut}`
                          : `${pattern.inhale}-${pattern.holdIn}-${pattern.exhale}-${pattern.holdOut}`}s
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{pattern.description}</p>
                  </button>
                ))}
              </div>

              {/* Custom Parameter Adjusters (visible only when custom is selected) */}
              {activePatternId === 'custom' && (
                <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-4 animate-in slide-in-from-top-4 duration-300">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-emerald-500" /> Customize Cycle Durations
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-700">
                        <span>Inhale (sec)</span>
                        <span className="font-mono">{customInhale}s</span>
                      </div>
                      <input 
                        type="range" min="1" max="15" value={customInhale}
                        onChange={(e) => {
                          setCustomInhale(Number(e.target.value));
                          if (!isRunning) setSecondsRemaining(Number(e.target.value));
                        }}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-700">
                        <span>Hold In (sec)</span>
                        <span className="font-mono">{customHoldIn}s</span>
                      </div>
                      <input 
                        type="range" min="0" max="15" value={customHoldIn}
                        onChange={(e) => setCustomHoldIn(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-700">
                        <span>Exhale (sec)</span>
                        <span className="font-mono">{customExhale}s</span>
                      </div>
                      <input 
                        type="range" min="1" max="15" value={customExhale}
                        onChange={(e) => setCustomExhale(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-700">
                        <span>Hold Out (sec)</span>
                        <span className="font-mono">{customHoldOut}s</span>
                      </div>
                      <input 
                        type="range" min="0" max="15" value={customHoldOut}
                        onChange={(e) => setCustomHoldOut(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Core Benefits block of selected */}
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-start gap-3 text-xs text-emerald-800">
                <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black uppercase text-[10px] text-emerald-600 mb-0.5">Primary Benefits</h4>
                  <p className="font-semibold leading-relaxed">{currentPattern.benefits}</p>
                </div>
              </div>

            </div>

          </section>

        </div>

      </header>

      {/* Stats, Log History, and Streak Board */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Mindfulness Stats Summary */}
        <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 flex flex-col justify-between shadow-lg shadow-slate-100/50">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-500" /> Daily Streak & Progress
          </h3>

          <div className="grid grid-cols-2 gap-4 flex-1">
            
            {/* Streak Counter */}
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex flex-col justify-center items-center text-center">
              <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center font-bold mb-3">
                🔥
              </div>
              <span className="text-3xl font-black text-slate-800 font-mono leading-none">{streak}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">Day Streak</span>
            </div>

            {/* Total Minutes Mindful */}
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex flex-col justify-center items-center text-center">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center font-bold mb-3">
                ⏱️
              </div>
              <span className="text-3xl font-black text-slate-800 font-mono leading-none">{totalMinutesMindful}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">Minutes Mindful</span>
            </div>

          </div>

          <p className="text-[11px] text-slate-400 font-bold text-center mt-6 uppercase tracking-wider">
            Practice daily for heart rate variability optimization
          </p>
        </div>

        {/* History Log Book */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-lg shadow-slate-100/50 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" /> Recent Session History
            </h3>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 text-[10px] font-bold uppercase"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear History
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin flex-1">
            {history.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-xs font-bold uppercase">No logged sessions yet</p>
                <p className="text-[10px] mt-1">Complete at least 10 seconds of breathing to save a session.</p>
              </div>
            ) : (
              history.map((log, index) => (
                <div key={index} className="flex justify-between items-center p-3.5 bg-slate-50 border border-slate-100 rounded-xl hover:bg-emerald-50/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center font-bold text-[10px]">
                      ✔
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800 leading-none">{log.patternName}</h4>
                      <span className="text-[9px] text-slate-400 font-medium font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-slate-700 font-mono">{log.durationSeconds}s</span>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </section>

      {/* Guide & Medical/Physiological benefits details */}
      <section className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 space-y-8 shadow-xl shadow-slate-100/30">
        
        <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600" /> The Science of Guided Breathwork
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-2">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-sm">01</div>
            <h4 className="font-bold text-sm text-slate-800">Parasympathetic Activation</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Exhalation triggers the vagus nerve, which releases acetylcholine. This signal directly instructions the heart to slow down, decreasing systemic cortisol and inducing instant calm.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-sm">02</div>
            <h4 className="font-bold text-sm text-slate-800">CO2 Tolerance & O2 Efficiency</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Gentle breath retention (holds) safely increases carbon dioxide tolerance in the blood. This improves the Bohr effect, facilitating better oxygen release from red blood cells to vital tissues.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold text-sm">03</div>
            <h4 className="font-bold text-sm text-slate-800">Somatic Stress Disruption</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Stress and anxiety physically manifest as shallow chest breathing. Forcing a slow, rhythmic, abdominal diaphragm loop breaks this biological feed-forward loop, signaling total safety to the amygdala.
            </p>
          </div>

        </div>

      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <StarRatingWidget rating={ratingInfo.rating} count={ratingInfo.count} onRatingChange={(val) => setRatingInfo(prev => ({ rating: parseFloat(((prev.rating * prev.count + val) / (prev.count + 1)).toFixed(2)), count: prev.count + 1 }))} />
        <ShareWidget url={window.location.href} title="Try this amazing Box Breathing & Stress Relief tool!" />
      </section>

      <AccompanyingText 
        toolName="Box Breathing & Stress Relief Guide"
        howItWorks="Paced respiration techniques regulate heart rate variability and down-regulate the sympathetic nervous system. Choosing specific cycles of inhales, holds, and exhales allows you to consciously control autonomic arousal, pivoting from fight-or-flight to a restorative parasympathetic baseline."
        whyItsUseful="Whether preparing for high-pressure situations, dealing with acute anxiety, or easing into restful sleep, devoting 3-5 minutes to these guided cycles triggers immediate physiological relaxation, enhances mental clarity, and resets cortisol levels."
        faqs={[
          {
            q: "How does Box Breathing reduce stress?",
            a: "Box breathing stimulates the vagus nerve, sending direct signals to the brain to slow down heart rate, reduce blood pressure, and suppress stress-inducing cortisol secretion."
          },
          {
            q: "What is the best time to practice paced breathing?",
            a: "You can practice any time you need immediate grounding. It is especially beneficial before demanding tasks, during high-anxiety moments, or as part of a calming bedtime ritual."
          },
          {
            q: "Can I customize the breath durations?",
            a: "Yes! Our application features a Custom Breath Cycle preset where you can adjust individual sliders for inhales, holds, exhales, and holds-empty to suit your personal comfort and capability."
          }
        ]}
      />
    </article>
  );
};

export default BoxBreathing;
