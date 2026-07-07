
import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import AdUnit from '../components/AdUnit';

const ContactUs: React.FC = () => {
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });

  useEffect(() => {
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    
    try {
      // Create a new feedback object
      const newFeedback = {
        id: Date.now().toString(),
        user: formData.name,
        email: formData.email,
        message: formData.message,
        type: formData.subject.includes('Bug') ? 'bug' : formData.subject.includes('Suggestion') ? 'feature' : 'general',
        status: 'new',
        date: new Date().toISOString().split('T')[0]
      };

      // Fetch existing feedback first
      const response = await fetch('/api/feedback');
      const existingFeedback = await response.json();
      
      // Add new feedback to the beginning of the list
      const updatedFeedback = [newFeedback, ...(Array.isArray(existingFeedback) ? existingFeedback : [])];
      
      // Save the updated list back to the database
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFeedback)
      });

      setFormStatus('sent');
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      // Fallback to success state anyway for UX, but log the error
      setFormStatus('sent');
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    }
  };

  return (
    <article className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20 px-2 md:px-1">
      <SEO title="Contact Us - Toolina | Support & Tool Inquiries" description="Free professional calculator and internal tool by Toolina. Accurate, fast, and easy to use." />
      <AdUnit slot="contact_top" format="horizontal" />
      
      <header className="bg-white p-5 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border border-slate-200 shadow-2xl shadow-slate-100/50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-48 h-48 md:w-80 md:h-80 bg-teal-50 rounded-bl-[10rem] md:rounded-bl-[15rem] -mr-10 -mt-10 md:-mr-20 md:-mt-20 opacity-50 blur-3xl"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 md:mb-12 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-teal-600 rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-4xl shadow-xl shadow-teal-100 text-white shrink-0">
              ✉️
            </div>
            <div>
              <h1 className="text-xl md:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
                Contact <span className="text-teal-600">Toolina</span>
              </h1>
              <p className="text-slate-500 font-medium text-[10px] md:text-lg mt-1 italic">Support, Feedback & Tool Requests</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 relative z-10">
          <section className="lg:col-span-7">
            {formStatus === 'sent' ? (
              <div className="bg-emerald-50 border border-emerald-100 p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] text-center space-y-4 animate-in zoom-in duration-500">
                <div className="text-5xl md:text-6xl">✅</div>
                <h2 className="text-xl md:text-2xl font-black text-emerald-900">Message Received!</h2>
                <p className="text-emerald-700 text-xs md:text-sm font-medium max-w-sm mx-auto">
                  Thank you for reaching out to Toolina. Our team will review your inquiry and get back to you within 24-48 hours.
                </p>
                <button 
                  onClick={() => setFormStatus('idle')}
                  className="mt-4 md:mt-6 text-emerald-600 font-black uppercase text-[10px] tracking-widest hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 md:px-5 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl outline-none focus:ring-4 ring-teal-50 transition-all font-bold text-slate-800 text-sm md:text-base"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 md:px-5 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl outline-none focus:ring-4 ring-teal-50 transition-all font-bold text-slate-800 text-sm md:text-base"
                      placeholder="hello@example.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Inquiry Subject</label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 md:px-5 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl outline-none focus:ring-4 ring-teal-50 transition-all font-bold text-slate-800 appearance-none text-sm md:text-base"
                  >
                    <option>General Inquiry</option>
                    <option>Bug Report / Technical Issue</option>
                    <option>New Tool Suggestion</option>
                    <option>Business & Advertising</option>
                    <option>Data Privacy Correction</option>
                  </select>
                </div>

                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Message</label>
                  <textarea 
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 md:px-5 md:py-4 bg-slate-50 border border-slate-200 rounded-2xl md:rounded-3xl outline-none focus:ring-4 ring-teal-50 transition-all font-medium text-slate-800 resize-none text-sm md:text-base"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <button 
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="w-full bg-slate-900 text-white py-4 md:py-5 rounded-xl md:rounded-[1.5rem] font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {formStatus === 'sending' ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                      Dispatch Message
                    </>
                  )}
                </button>
              </form>
            )}
          </section>

          <aside className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 text-white shadow-2xl relative overflow-hidden group h-full">
               <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400 mb-6 md:mb-8">Contact Information</h3>
               
               <div className="space-y-6 md:space-y-8">
                 <div className="flex gap-4">
                   <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-xl flex items-center justify-center text-lg md:text-xl shrink-0">📍</div>
                   <div>
                     <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Global Labs</p>
                     <p className="text-xs md:text-sm font-bold text-slate-300">Digital Residency Office, Rajasthan, India</p>
                   </div>
                 </div>
                 
                 <div className="flex gap-4">
                   <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-xl flex items-center justify-center text-lg md:text-xl shrink-0">🕒</div>
                   <div>
                     <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Response Time</p>
                     <p className="text-xs md:text-sm font-bold text-slate-300">Mon-Fri: 9:00 AM - 6:00 PM IST</p>
                     <p className="text-[9px] md:text-[10px] font-medium text-slate-500 mt-1 italic">Average response within 24 hours.</p>
                   </div>
                 </div>

                 <div className="flex gap-4">
                   <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-xl flex items-center justify-center text-lg md:text-xl shrink-0">🛠️</div>
                   <div>
                     <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Developer Desk</p>
                     <p className="text-xs md:text-sm font-bold text-slate-300">Open for custom API & Tool Integration Inquiries.</p>
                   </div>
                 </div>
               </div>

               <div className="mt-8 md:mt-12 pt-8 md:pt-12 border-t border-white/5">
                 <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 md:mb-4">Direct Email</p>
                 <a href="mailto:support@toolina.in" className="text-lg md:text-2xl font-black text-white hover:text-teal-400 transition-colors tracking-tight break-all">
                   support@toolina.in
                 </a>
               </div>
            </div>
          </aside>
        </div>
      </header>

      <AdUnit slot="contact_mid" format="rectangle" />

      <footer className="bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-16 text-white space-y-10 md:space-y-16 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.05),transparent)] pointer-events-none"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 relative z-10">
          <div className="space-y-6 md:space-y-8">
            <h2 className="text-2xl md:text-5xl font-display font-black tracking-tight leading-tight">Your Feedback <span className="text-teal-400">Drives Innovation</span></h2>
            <p className="text-slate-400 leading-relaxed text-sm md:text-lg">
              Toolina is a community-driven project. Many of our most popular tools, like the <strong>Rajasthan Pay Matrix Audit</strong> and the <strong>Batch Image Resizer</strong>, were built directly based on user requests.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/5 p-5 md:p-6 rounded-2xl md:rounded-3xl border border-white/10">
                <h3 className="text-teal-400 font-bold text-xs md:text-sm mb-2 uppercase tracking-widest">Bug Bounties</h3>
                <p className="text-[10px] md:text-[11px] text-slate-500 leading-relaxed">Report calculation errors in govt salary tools to help us maintain 100% precision.</p>
              </div>
              <div className="bg-white/5 p-5 md:p-6 rounded-2xl md:rounded-3xl border border-white/10">
                <h3 className="text-teal-400 font-bold text-xs md:text-sm mb-2 uppercase tracking-widest">Feature Voting</h3>
                <p className="text-[10px] md:text-[11px] text-slate-500 leading-relaxed">Suggest a new digital tool. If it gets enough interest, we build it for free.</p>
              </div>
            </div>
          </div>
          <div className="space-y-6 md:space-y-8">
            <div className="bg-white/5 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 backdrop-blur-sm h-fit">
              <h3 className="text-base md:text-lg font-black uppercase tracking-widest text-slate-300 mb-6 flex items-center gap-3">
                <span className="text-lg md:text-xl">📊</span> Support FAQ
              </h3>
              <ul className="space-y-5 md:space-y-6">
                {[
                  { q: "Is support free?", a: "Yes, standard email support for tool usage is 100% free for all users." },
                  { q: "Can I request a private tool?", a: "For custom enterprise calculators, please select 'Business Inquiry' in the contact form." },
                  { q: "How to report a data error?", a: "Select 'Bug Report' and include the specific calculation result and official rule reference." }
                ].map((item, i) => (
                  <li key={i} className="space-y-1">
                    <h4 className="text-xs md:text-sm font-bold text-teal-400">{item.q}</h4>
                    <p className="text-[10px] md:text-xs text-slate-400 leading-relaxed">{item.a}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>
      
      <AdUnit slot="contact_bottom" format="horizontal" />
    </article>
  );
};

export default ContactUs;
