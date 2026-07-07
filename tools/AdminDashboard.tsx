
import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { TOOLS as INITIAL_TOOLS } from '../constants';
import BrandLogo from '../components/BrandLogo';
import { Tool } from '../types';

const ADMIN_CREDENTIAL = import.meta.env.VITE_ADMIN_PASSWORD || "admin";

interface Feedback {
  id: string;
  user: string;
  email?: string;
  subject: string;
  message?: string;
  type?: string;
  date: string;
  status: 'New' | 'Assigned' | 'Resolved';
}

interface Announcement {
  id: string;
  date: string;
  content: string;
  color: string;
  isActive?: boolean;
}

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<'Stats' | 'Tools' | 'Feedback'>('Stats');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  
  const [toolsState, setToolsState] = useState<Tool[]>([]);
  const [feedbackState, setFeedbackState] = useState<Feedback[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [liveStats, setLiveStats] = useState({ latency: 42, load: 12 });
  const [globalDaRate, setGlobalDaRate] = useState<number>(50);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('yogi_admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    
    // Load persisted state from API
    Promise.all([
      fetch('/api/tools').then(res => res.json()).catch(() => []),
      fetch('/api/feedback').then(res => res.json()).catch(() => []),
      fetch('/api/announcements').then(res => res.json()).catch(() => []),
      fetch('/api/settings').then(res => res.json()).catch(() => ({}))
    ]).then(([tools, feedback, announcements, settings]) => {
      // Merge DB tools with INITIAL_TOOLS to ensure newly added tools show up
      let mergedTools = [...INITIAL_TOOLS];
      if (tools && tools.length > 0) {
        mergedTools = mergedTools.map(initialTool => {
          const dbTool = tools.find((t: Tool) => t.id === initialTool.id);
          return dbTool ? { ...initialTool, ...dbTool, icon: initialTool.icon } : initialTool;
        });
        
        // Add any DB tools that aren't in INITIAL_TOOLS
        tools.forEach((dbTool: Tool) => {
          if (!mergedTools.find(t => t.id === dbTool.id)) {
            mergedTools.push(dbTool);
          }
        });
      }

      setToolsState(mergedTools);
      setFeedbackState(Array.isArray(feedback) ? feedback : []);
      setAnnouncements(Array.isArray(announcements) ? announcements : []);
      if (settings.da_rate) setGlobalDaRate(settings.da_rate);
      setIsLoaded(true);
    });

    return () => clearInterval(timer);
  }, []);

  // Save state changes
  useEffect(() => { 
    if (isLoaded) {
      fetch('/api/tools', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(toolsState) }); 
    }
  }, [toolsState, isLoaded]);
  
  useEffect(() => { 
    if (isLoaded) {
      fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(feedbackState) }); 
    }
  }, [feedbackState, isLoaded]);
  
  useEffect(() => { 
    if (isLoaded) {
      fetch('/api/announcements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(announcements) }); 
    }
  }, [announcements, isLoaded]);
  
  useEffect(() => { 
    if (isLoaded) {
      fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ da_rate: globalDaRate }) }); 
    }
  }, [globalDaRate, isLoaded]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_CREDENTIAL) {
      setIsAuthenticated(true);
      setError(false);
      sessionStorage.setItem('yogi_admin_auth', 'true');
    } else {
      setError(true);
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('yogi_admin_auth');
  };

  // Tools Management
  const toggleNewBadge = (id: string) => {
    setToolsState(prev => prev.map(tool => tool.id === id ? { ...tool, isNew: !tool.isNew } : tool));
  };

  const toggleOffline = (id: string) => {
    setToolsState(prev => prev.map(tool => tool.id === id ? { ...tool, isOffline: !tool.isOffline } : tool));
  };

  const editToolMeta = (id: string) => {
    const tool = toolsState.find(t => t.id === id);
    if (!tool) return;
    const newDesc = window.prompt(`Edit description for ${tool.name}:`, tool.description);
    if (newDesc !== null) {
      setToolsState(prev => prev.map(t => t.id === id ? { ...t, description: newDesc } : t));
    }
  };

  const registerNewTool = () => {
    const name = window.prompt("Enter new tool name:");
    if (!name) return;
    const newTool: Tool = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      description: "Newly registered tool description.",
      icon: "🔧",
      category: "Utility",
      path: `/${name.toLowerCase().replace(/\s+/g, '-')}`,
      isNew: true
    };
    setToolsState(prev => [...prev, newTool]);
  };

  // Feedback Management
  const cycleFeedbackStatus = (id: string) => {
    setFeedbackState(prev => prev.map(f => {
      if (f.id !== id) return f;
      const nextStatus = f.status === 'New' ? 'Assigned' : f.status === 'Assigned' ? 'Resolved' : 'New';
      return { ...f, status: nextStatus };
    }));
  };

  const loadArchiveQueries = () => {
    const archive: Feedback = {
      id: Date.now().toString(),
      user: "Archived User",
      email: "archived_user@test.com",
      subject: "Old feature request",
      message: "This is an archived message.",
      type: "feature",
      date: "2 months ago",
      status: "Resolved"
    };
    setFeedbackState(prev => [...prev, archive]);
  };

  const clearFeedback = () => {
    if (window.confirm("Clear all resolved feedback?")) {
      setFeedbackState(prev => prev.filter(f => f.status !== 'Resolved'));
    }
  };

  // Announcements
  const postAnnouncement = () => {
    const content = window.prompt("Enter announcement content:");
    if (!content) return;
    const newAnn: Announcement = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      content,
      color: "text-emerald-400",
      isActive: true
    };
    setAnnouncements(prev => [newAnn, ...prev]);
  };

  const toggleAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.map(ann => 
      ann.id === id ? { ...ann, isActive: ann.isActive === false ? true : false } : ann
    ));
  };

  // Stats Simulation
  const refreshStats = () => {
    setLiveStats({
      latency: Math.floor(Math.random() * 30) + 20,
      load: Math.floor(Math.random() * 40) + 10
    });
  };

  const stats = [
    { label: "Monthly Sessions", value: "14,282", growth: "+12.5%", color: "text-teal-600" },
    { label: "Total Calculations", value: "894,302", growth: "+4.2%", color: "text-blue-600" },
    { label: "Avg. Latency", value: `${liveStats.latency}ms`, growth: "-15.0%", color: "text-emerald-600" },
    { label: "Conversion Rate", value: "24.8%", growth: "+0.8%", color: "text-orange-600" }
  ];

  const systemHealth = [
    { name: "Gemini AI Engine", status: "Healthy", uptime: "99.98%", load: `${liveStats.load}%` },
    { name: "Local Processing Node", status: "Active", uptime: "100%", load: `${Math.max(2, liveStats.load - 10)}%` },
    { name: "Global CDN (Fonts)", status: "Steady", uptime: "99.95%", load: "N/A" },
    { name: "Storage Sync", status: "Healthy", uptime: "99.99%", load: "0.4%" }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
      <SEO title="Admin Control Panel | Toolina Internal" description="Free professional calculator and internal tool by Toolina. Accurate, fast, and easy to use." />
        <div className="bg-white w-full max-w-md p-8 md:p-12 rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-200/50 animate-in zoom-in duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-8 -mt-8"></div>
          
          <div className="text-center space-y-6 relative z-10">
            <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl">
              <svg className="w-10 h-10 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            
            <div>
              <h1 className="text-2xl font-display font-black text-slate-900 tracking-tight">Access Restricted</h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Toolina Internal Environment</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <input 
                  autoFocus
                  type="password" 
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(false); }}
                  placeholder="Administrator Key"
                  className={`w-full px-6 py-4 bg-slate-50 border rounded-2xl outline-none focus:ring-4 transition-all text-center font-bold tracking-widest ${
                    error ? 'border-red-500 ring-red-50 focus:ring-red-100' : 'border-slate-200 focus:ring-teal-50 focus:border-teal-200'
                  }`}
                />
                {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Invalid Credentials</p>}
              </div>

              <button 
                type="submit"
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-black transition-all shadow-xl active:scale-95"
              >
                Authenticate System
              </button>
            </form>
            
            <div className="pt-6 border-t border-slate-100">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Encrypted Session Layer • v4.2.1</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20 px-1">
      {/* Admin Header */}
      <header className="bg-slate-900 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-50 rounded-bl-[20rem] blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-tr from-teal-500 to-emerald-400 rounded-2xl flex items-center justify-center text-3xl shadow-2xl shadow-teal-500/20 text-slate-900 font-black">
              T
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl md:text-5xl font-display font-black text-white tracking-tight leading-none">
                  Admin <span className="text-teal-400">Control Panel</span>
                </h1>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                  title="Secure Logout"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
              </div>
              <div className="flex items-center gap-3 mt-2">
                 <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest bg-teal-400/10 px-3 py-1 rounded-lg border border-teal-400/20">System Operator v2.5</span>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3 py-1 rounded-lg border border-slate-800">{currentTime}</span>
              </div>
            </div>
          </div>

          <nav className="flex bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700 w-full lg:w-auto">
            {(['Stats', 'Tools', 'Feedback'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 lg:px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'bg-teal-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-teal-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Stats Tab */}
      {activeTab === 'Stats' && (
        <div className="space-y-8 animate-in fade-in duration-500">
           <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {stats.map((s, i) => (
               <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{s.label}</p>
                  <div className={`text-4xl font-black tracking-tight mb-2 ${s.color}`}>{s.value}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">{s.growth}</span>
                    <span className="text-[9px] font-medium text-slate-400 uppercase">vs last month</span>
                  </div>
               </div>
             ))}
           </section>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <section className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-100 p-8 md:p-10 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">System Infrastructure Health</h3>
                  <div className="flex items-center gap-4">
                    <button onClick={refreshStats} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-teal-600 transition-colors">Refresh</button>
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-slate-50">
                         <th className="pb-4 text-[10px] font-black text-slate-400 uppercase">Resource</th>
                         <th className="pb-4 text-[10px] font-black text-slate-400 uppercase">Status</th>
                         <th className="pb-4 text-[10px] font-black text-slate-400 uppercase text-center">Uptime</th>
                         <th className="pb-4 text-[10px] font-black text-slate-400 uppercase text-right">Load</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {systemHealth.map((sys, i) => (
                        <tr key={i} className="group hover:bg-slate-50 transition-colors">
                          <td className="py-5 text-sm font-bold text-slate-700">{sys.name}</td>
                          <td className="py-5">
                            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase">{sys.status}</span>
                          </td>
                          <td className="py-5 text-center text-sm font-mono text-slate-500">{sys.uptime}</td>
                          <td className="py-5 text-right">
                             <div className="flex flex-col items-end gap-1">
                               <span className="text-[10px] font-black text-slate-800">{sys.load}</span>
                               <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-teal-500 transition-all duration-500" style={{ width: sys.load === 'N/A' ? '0%' : sys.load }}></div>
                               </div>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <aside className="lg:col-span-4 space-y-6">
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden h-full flex flex-col justify-between">
                   <div className="relative z-10">
                     <h3 className="text-xs font-black uppercase tracking-[0.2em] text-teal-400 mb-6">Internal Announcements</h3>
                     <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {announcements.map((ann) => (
                          <div key={ann.id} className={`p-4 border rounded-2xl transition-all ${ann.isActive === false ? 'bg-white/5 border-white/5 opacity-50' : 'bg-white/10 border-white/20'}`}>
                             <div className="flex justify-between items-start mb-2">
                               <p className={`text-[10px] font-black uppercase ${ann.color}`}>{ann.date}</p>
                               <button 
                                 onClick={() => toggleAnnouncement(ann.id)}
                                 className={`text-[9px] font-black uppercase px-2 py-1 rounded ${ann.isActive === false ? 'bg-slate-800 text-slate-400' : 'bg-teal-500/20 text-teal-400'}`}
                               >
                                 {ann.isActive === false ? 'Inactive' : 'Active'}
                               </button>
                             </div>
                             <p className="text-sm font-bold leading-relaxed">{ann.content}</p>
                          </div>
                        ))}
                     </div>
                   </div>
                   <button onClick={postAnnouncement} className="mt-10 w-full py-4 bg-teal-500 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-400 transition-all shadow-xl active:scale-95">
                     Post Internal Update
                   </button>
                </div>
              </aside>
           </div>
        </div>
      )}

      {/* Tools Management Tab */}
      {activeTab === 'Tools' && (
        <section className="bg-white rounded-[3rem] border border-slate-100 p-8 md:p-10 shadow-sm animate-in fade-in duration-500">
           <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
             <div>
               <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">Active Library</h3>
               <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Configure visibility & launch badges for all tools</p>
             </div>
             <div className="flex flex-wrap items-center gap-4">
               <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global DA Rate</span>
                 <input 
                   type="number" 
                   value={globalDaRate}
                   onChange={(e) => setGlobalDaRate(Number(e.target.value))}
                   className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold text-teal-600 outline-none focus:border-teal-400 text-center"
                 />
                 <span className="text-[10px] font-black text-slate-400">%</span>
               </div>
               <button onClick={registerNewTool} className="bg-slate-900 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-600 transition-all shadow-lg active:scale-95">
                  Register New Tool
               </button>
             </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {toolsState.map((tool) => (
               <div key={tool.id} className={`bg-slate-50 border border-slate-200 p-6 rounded-[2rem] flex flex-col gap-4 group hover:bg-white hover:border-teal-200 transition-all ${tool.isOffline ? 'opacity-50 grayscale' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="text-4xl grayscale group-hover:grayscale-0 transition-all">{tool.icon}</div>
                    <div className="flex flex-col items-end gap-2">
                       <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${tool.category === 'Govt' ? 'bg-indigo-100 text-indigo-600' : 'bg-teal-100 text-teal-600'}`}>
                         {tool.category}
                       </span>
                       <button 
                        onClick={() => toggleNewBadge(tool.id)}
                        className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all border flex items-center gap-1 ${
                          tool.isNew 
                            ? 'bg-orange-500 text-white border-orange-600 shadow-sm' 
                            : 'bg-white text-slate-400 border-slate-200'
                        }`}
                       >
                         {tool.isNew ? '✨ NEW Badge ON' : 'Badge OFF'}
                       </button>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{tool.name}</h4>
                    <p className="text-[10px] text-slate-500 line-clamp-2 mt-1">{tool.description}</p>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => editToolMeta(tool.id)} className="flex-1 py-2 text-[9px] font-black uppercase border border-slate-200 rounded-lg text-slate-400 hover:text-teal-600 hover:border-teal-200 transition-all">Edit Meta</button>
                    <button onClick={() => toggleOffline(tool.id)} className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg transition-all ${tool.isOffline ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-slate-900 text-white hover:bg-red-500'}`}>
                      {tool.isOffline ? 'Go Online' : 'Offline'}
                    </button>
                  </div>
               </div>
             ))}
           </div>
        </section>
      )}

      {/* Feedback Tab */}
      {activeTab === 'Feedback' && (
        <section className="bg-white rounded-[3rem] border border-slate-100 p-8 md:p-10 shadow-sm animate-in fade-in duration-500">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">Inbox <span className="text-teal-600">&</span> User Queries</h3>
              <div className="flex gap-2">
                 <button onClick={clearFeedback} title="Clear Resolved" className="p-2.5 rounded-xl border border-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                 <button onClick={() => setFeedbackState([...feedbackState].reverse())} title="Reverse Order" className="p-2.5 rounded-xl border border-slate-100 text-slate-400 hover:text-teal-600 hover:bg-slate-50 transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></button>
              </div>
           </div>

           <div className="space-y-3">
             {feedbackState.length === 0 ? (
               <div className="text-center py-12 text-slate-400 font-bold">No feedback queries found.</div>
             ) : feedbackState.map((f) => (
               <div key={f.id} className="flex flex-col md:flex-row md:items-start justify-between p-6 bg-slate-50 border border-slate-100 rounded-[2rem] hover:bg-white hover:border-teal-200 hover:shadow-xl hover:shadow-teal-100/20 transition-all group">
                  <div className="flex items-start gap-6 w-full">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 ${f.status === 'New' ? 'bg-orange-100 text-orange-600' : 'bg-slate-200 text-slate-500'}`}>
                      {f.user[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-black text-slate-900 group-hover:text-teal-600 transition-colors">{f.subject}</h4>
                        {f.type && (
                          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                            f.type === 'bug' ? 'bg-red-100 text-red-600' : f.type === 'feature' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {f.type}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium mb-2">
                        <span className="text-slate-700">{f.user}</span> 
                        {f.email && <span className="mx-1">• <a href={`mailto:${f.email}`} className="hover:text-teal-600">{f.email}</a></span>} 
                        <span className="opacity-60 mx-1">• {f.date}</span>
                      </p>
                      {f.message && (
                        <div className="bg-white border border-slate-100 p-3 rounded-xl text-xs text-slate-600 font-medium leading-relaxed mt-2">
                          {f.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4 md:mt-0 shrink-0">
                    <button 
                      onClick={() => cycleFeedbackStatus(f.id)}
                      className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all hover:scale-105 ${
                      f.status === 'New' ? 'bg-orange-50 border-orange-100 text-orange-600 hover:bg-orange-100' :
                      f.status === 'Assigned' ? 'bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100' :
                      'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100'
                    }`}>
                      {f.status}
                    </button>
                    <button onClick={() => setFeedbackState(prev => prev.filter(item => item.id !== f.id))} className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg></button>
                  </div>
               </div>
             ))}
           </div>
           
           <div className="mt-8 text-center">
             <button onClick={loadArchiveQueries} className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-teal-600 transition-colors">Load Archive Queries</button>
           </div>
        </section>
      )}

      {/* Footer Branding for Admin */}
      <footer className="text-center pt-12">
        <div className="inline-flex items-center gap-2 grayscale opacity-30 brightness-50">
           <BrandLogo className="w-6 h-6" />
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Internal System Environment • Toolina 2025</p>
        </div>
      </footer>
    </article>
  );
};

export default AdminDashboard;
