import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import BrandLogo from '../components/BrandLogo';

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
  mobile?: string;
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
  const [activeTab, setActiveTab] = useState<'Feedback' | 'DaRate' | 'Announcements'>('Feedback');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  
  const [feedbackState, setFeedbackState] = useState<Feedback[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [globalDaRate, setGlobalDaRate] = useState<number>(50);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSavingDa, setIsSavingDa] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('yogi_admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    
    // Load persisted state from API
    Promise.all([
      fetch('/api/feedback').then(res => res.json()).catch(() => []),
      fetch('/api/announcements').then(res => res.json()).catch(() => []),
      fetch('/api/settings').then(res => res.json()).catch(() => ({}))
    ]).then(([feedback, announcements, settings]) => {
      setFeedbackState(Array.isArray(feedback) ? feedback : []);
      setAnnouncements(Array.isArray(announcements) ? announcements : []);
      if (settings && settings.da_rate !== undefined) setGlobalDaRate(settings.da_rate);
      setIsLoaded(true);
    });

    return () => clearInterval(timer);
  }, []);

  // Feedback synchronization helper is replaced with individual granular secure updates below.

  const saveAnnouncements = async (newAnnouncements: Announcement[]) => {
    setAnnouncements(newAnnouncements);
    await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAnnouncements)
    });
  };

  const handleSaveDaRate = async () => {
    setIsSavingDa(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ da_rate: globalDaRate })
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save DA rate", err);
    } finally {
      setIsSavingDa(false);
    }
  };

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

  // Feedback Management
  const cycleFeedbackStatus = async (id: string) => {
    const target = feedbackState.find(f => f.id === id);
    if (!target) return;
    const nextStatus = target.status === 'New' ? 'Assigned' : target.status === 'Assigned' ? 'Resolved' : 'New';
    const updatedItem = { ...target, status: nextStatus };

    // Optimistically update UI state
    setFeedbackState(prev => prev.map(f => f.id === id ? updatedItem : f));

    try {
      const response = await fetch('/api/feedback', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Key': ADMIN_CREDENTIAL
        },
        body: JSON.stringify(updatedItem)
      });
      if (!response.ok) {
        throw new Error('Failed to update feedback status');
      }
    } catch (err) {
      console.error(err);
      // Rollback on failure
      setFeedbackState(prev => prev.map(f => f.id === id ? target : f));
    }
  };

  const deleteFeedbackItem = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      const original = [...feedbackState];
      setFeedbackState(prev => prev.filter(f => f.id !== id));
      try {
        const response = await fetch(`/api/feedback?id=${id}`, {
          method: 'DELETE',
          headers: {
            'X-Admin-Key': ADMIN_CREDENTIAL
          }
        });
        if (!response.ok) {
          throw new Error('Failed to delete feedback');
        }
      } catch (err) {
        console.error(err);
        setFeedbackState(original);
      }
    }
  };

  const loadArchiveQueries = async () => {
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
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Key': ADMIN_CREDENTIAL
        },
        body: JSON.stringify(archive)
      });
      if (response.ok) {
        setFeedbackState(prev => [...prev, archive]);
      } else {
        throw new Error('Failed to load archive queries');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const clearFeedback = async () => {
    if (window.confirm("Clear all resolved feedback?")) {
      const original = [...feedbackState];
      setFeedbackState(prev => prev.filter(f => f.status !== 'Resolved'));
      try {
        const response = await fetch('/api/feedback?clear=resolved', {
          method: 'DELETE',
          headers: {
            'X-Admin-Key': ADMIN_CREDENTIAL
          }
        });
        if (!response.ok) {
          throw new Error('Failed to clear resolved feedback');
        }
      } catch (err) {
        console.error(err);
        setFeedbackState(original);
      }
    }
  };

  // Announcements Management
  const postAnnouncement = () => {
    const content = window.prompt("Enter announcement content:");
    if (!content) return;
    const newAnn: Announcement = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      content,
      color: "text-teal-400",
      isActive: true
    };
    saveAnnouncements([newAnn, ...announcements]);
  };

  const toggleAnnouncement = (id: string) => {
    const updated = announcements.map(ann => 
      ann.id === id ? { ...ann, isActive: !ann.isActive } : ann
    );
    saveAnnouncements(updated);
  };

  const deleteAnnouncement = (id: string) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      const updated = announcements.filter(ann => ann.id !== id);
      saveAnnouncements(updated);
    }
  };

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
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Encrypted Session Layer • v5.0.0</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20 px-1">
      <SEO title="Admin Control Panel | Toolina" description="Admin dashboard to manage Feedback, DA Rate, and Internal Announcements." />
      
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
            {[
              { key: 'Feedback', label: 'Feedback' },
              { key: 'DaRate', label: 'DA Rate Change' },
              { key: 'Announcements', label: 'Announcements' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 lg:px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.key ? 'bg-teal-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-teal-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

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
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 bg-teal-100 text-teal-700`}>
                       {f.user ? f.user[0].toUpperCase() : 'U'}
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
                         {f.mobile && <span className="mx-1">• <span className="text-slate-600 font-bold">📞 {f.mobile}</span></span>}
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
                     <button onClick={() => deleteFeedbackItem(f.id)} className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg></button>
                   </div>
                </div>
             ))}
           </div>
           
           <div className="mt-8 text-center">
             <button onClick={loadArchiveQueries} className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-teal-600 transition-colors">Load Archive Queries</button>
           </div>
        </section>
      )}

      {/* DA Rate Change Tab */}
      {activeTab === 'DaRate' && (
        <section className="bg-white rounded-[3rem] border border-slate-100 p-8 md:p-12 shadow-sm animate-in fade-in duration-500 max-w-2xl mx-auto">
          <div className="text-center space-y-4 mb-8">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-3xl mx-auto">
              📊
            </div>
            <div>
              <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">Dearness Allowance (DA) Rate Change</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Configure the global dearness allowance rate</p>
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200/60 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Global DA Rate</span>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200">
                <input 
                  type="number" 
                  value={globalDaRate}
                  onChange={(e) => setGlobalDaRate(Number(e.target.value))}
                  className="w-20 bg-transparent text-xl font-black text-teal-600 text-center outline-none"
                />
                <span className="text-sm font-black text-slate-400">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={globalDaRate}
                onChange={(e) => setGlobalDaRate(Number(e.target.value))}
                className="w-full accent-teal-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>

            <button 
              onClick={handleSaveDaRate}
              disabled={isSavingDa}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-teal-600 hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-50"
            >
              {isSavingDa ? 'Saving Settings...' : 'Save Global DA Rate'}
            </button>

            {saveSuccess && (
              <div className="text-center text-emerald-600 text-xs font-bold uppercase tracking-widest animate-pulse">
                Successfully Updated and Saved!
              </div>
            )}
          </div>
        </section>
      )}

      {/* Announcements Tab */}
      {activeTab === 'Announcements' && (
        <section className="bg-white rounded-[3rem] border border-slate-100 p-8 md:p-10 shadow-sm animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
            <div>
              <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">Internal Announcements</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Post and manage bulletin updates for employees and visitors</p>
            </div>
            <button 
              onClick={postAnnouncement}
              className="bg-slate-900 text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-600 transition-all shadow-lg active:scale-95"
            >
              Create New Announcement
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {announcements.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-400 font-bold">
                No announcements posted yet. Click the button to create one!
              </div>
            ) : announcements.map((ann) => (
              <div 
                key={ann.id} 
                className={`p-6 border rounded-[2rem] flex flex-col justify-between gap-4 transition-all ${
                  ann.isActive === false 
                    ? 'bg-slate-100/50 border-slate-200/50 opacity-60' 
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-lg">
                      {ann.date}
                    </span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => toggleAnnouncement(ann.id)}
                        className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg transition-all ${
                          ann.isActive === false 
                            ? 'bg-slate-200 text-slate-500' 
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {ann.isActive === false ? 'Inactive' : 'Active'}
                      </button>
                      <button 
                        onClick={() => deleteAnnouncement(ann.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all"
                        title="Delete Announcement"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-slate-800 leading-relaxed">
                    {ann.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer Branding for Admin */}
      <footer className="text-center pt-12">
        <div className="inline-flex items-center gap-2 grayscale opacity-30 brightness-50">
           <BrandLogo className="w-6 h-6" />
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Internal System Environment • Toolina 2026</p>
        </div>
      </footer>
    </article>
  );
};

export default AdminDashboard;
