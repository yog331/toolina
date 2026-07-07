
import React, { useState, useRef, useEffect } from 'react';
import { askAssistant } from '../services/gemini';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([
    {role: 'assistant', text: "Hello! I'm your Yogi Assistant. How can I help you navigate your digital tools today?"}
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const response = await askAssistant(userMsg);
    setMessages(prev => [...prev, { role: 'assistant', text: response || "I'm having a quiet moment. Could you try asking again?" }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-80 md:w-96 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-gradient-to-r from-teal-600 to-green-500 p-5 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-inner">✨</div>
              <div>
                <span className="font-bold block text-sm">Yogi Assistant</span>
                <span className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Always Zen</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 rounded-xl p-2 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <div ref={scrollRef} className="h-96 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-teal-600 text-white rounded-br-none' 
                    : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 flex gap-1.5 shadow-sm">
                  <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-white flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me for a tool..."
              className="flex-1 bg-slate-100 rounded-2xl px-5 py-3 text-sm outline-none focus:ring-2 ring-teal-100 focus:bg-white transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className="bg-teal-600 text-white p-3 rounded-2xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-100 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-tr from-teal-600 to-green-500 text-white w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-teal-200 hover:scale-110 transition-all active:scale-95 group"
        >
          <svg className="w-8 h-8 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default AIAssistant;
