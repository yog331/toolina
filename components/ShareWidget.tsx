import React, { useState } from 'react';

interface ShareWidgetProps {
  title: string;
  text?: string;
}

const ShareWidget: React.FC<ShareWidgetProps> = ({ title, text }) => {
  const [copied, setCopied] = useState(false);
  
  // Safely get window.location.href if available
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://toolina.in';
  
  const defaultText = text || `Check out this free professional ${title} on Toolina!`;
  
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedText = encodeURIComponent(defaultText + '\n\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 text-center mt-12 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-teal-50 rounded-br-[10rem] opacity-50 blur-2xl flex-shrink-0"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-50 rounded-tl-[10rem] opacity-50 blur-2xl flex-shrink-0"></div>
      
      <div className="relative z-10">
        <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-2 font-display">
          Support <span className="text-teal-600">Toolina</span>
        </h3>
        <p className="text-sm md:text-base text-slate-500 mb-6 max-w-lg mx-auto leading-relaxed">
          If you found this tool helpful, please share it or consider making a small donation at the top of the page. Your donations and social mentions are what help us keep providing professional tools completely free of charge!
        </p>
        
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          <a href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-full font-bold text-xs md:text-sm hover:-translate-y-1 hover:shadow-lg hover:shadow-green-100 transition-all">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
            WhatsApp
          </a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#1877F2] text-white px-5 py-2.5 rounded-full font-bold text-xs md:text-sm hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-200 transition-all">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Facebook
          </a>
          <a href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#229ED9] text-white px-5 py-2.5 rounded-full font-bold text-xs md:text-sm hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-200 transition-all">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zM5.275 11.458l12.83-4.945c.594-.22 1.116.14.93.94l-2.174 10.23c-.186.837-.686 1.045-1.38.653l-3.818-2.812-1.842 1.775c-.204.204-.374.374-.766.374l.275-3.882 7.07-6.384c.307-.275-.067-.428-.475-.157l-8.736 5.503-3.766-1.176c-.818-.256-.834-.817.172-1.21z"/></svg>
            Telegram
          </a>
          <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}%23Toolina`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full font-bold text-xs md:text-sm hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200 transition-all">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 4.04H5.078z"/></svg>
            Post
          </a>
          <button onClick={handleCopy} className={`flex items-center gap-2 border px-5 py-2.5 rounded-full font-bold text-xs md:text-sm hover:-translate-y-1 transition-all ${copied ? 'bg-teal-50 text-teal-600 border-teal-200' : 'bg-white text-slate-700 border-slate-200 shadow-sm hover:shadow-md'}`}>
            {copied ? (
              <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> Copied!</>
            ) : (
              <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg> Copy Link</>
            )}
          </button>
        </div>
        
        <p className="text-xs text-slate-400 mt-6 md:mt-8 tracking-wide">
          💡 <span className="font-medium text-slate-500">Pro Tip:</span> Bookmark this page or search <strong className="text-slate-700 font-bold">"Toolina"</strong> on Google to find us instantly next time!
        </p>
      </div>
    </section>
  );
};

export default ShareWidget;
