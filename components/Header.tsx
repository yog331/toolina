
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import UPIDonation from './UPIDonation';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen, searchTerm, onSearchChange }) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <header 
      className={`sticky top-0 z-40 transition-all duration-300 w-full
      ${isScrolled 
        ? 'bg-white/95 backdrop-blur-md py-3 shadow-md border-b border-slate-200' 
        : 'bg-white py-4 md:py-6 border-b border-slate-100'
      } px-4 md:px-8 flex items-center justify-between`}
    >
      {/* Left Section: Branding & Toggle */}
      <div className="flex items-center gap-4 lg:gap-8">
        <button 
          onClick={toggleSidebar}
          className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors lg:hidden"
          aria-label="Toggle Navigation Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link to="/" className="flex items-center gap-3 group">
          <BrandLogo className="w-9 h-9 md:w-11 md:h-11 transition-transform group-hover:scale-105" />
          <div className="flex flex-col -space-y-1">
            <span className="font-display font-black text-xl md:text-2xl tracking-tighter text-slate-900">
              Toolina<span className="text-teal-600">.</span>
            </span>
            <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hidden sm:block">
              Digital Tools Platform
            </span>
          </div>
        </Link>
      </div>

      {/* Middle Section: Professional Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-slate-400 group-focus-within:text-teal-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Search for a tool (e.g. Salary, Image, QR)..." 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-bold outline-none focus:ring-4 ring-teal-50 focus:bg-white focus:border-teal-300 transition-all placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
              title="Clear search"
              aria-label="Clear search"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Right Section: Navigation Links & Mobile Search Toggle */}
      <div className="flex items-center gap-2 lg:gap-6">
        {/* Desktop Quick Nav */}
        <nav className="hidden lg:flex items-center gap-4 border-r border-slate-100 pr-6 mr-2">
          <Link to="/" className={`text-xs font-black uppercase tracking-widest transition-colors ${location.pathname === '/' ? 'text-teal-600' : 'text-slate-500 hover:text-teal-600'}`}>
            Home
          </Link>
          <Link to="/help" className={`text-xs font-black uppercase tracking-widest transition-colors ${location.pathname === '/help' ? 'text-teal-600' : 'text-slate-500 hover:text-teal-600'}`}>
            Guides
          </Link>
          <Link to="/contact" className={`text-xs font-black uppercase tracking-widest transition-colors ${location.pathname === '/contact' ? 'text-teal-600' : 'text-slate-500 hover:text-teal-600'}`}>
            Support
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 md:gap-3">
          {/* Mobile Search Button (Visible only on small screens) */}
          <button 
            className="md:hidden p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
            onClick={() => {
              // Focus the search in sidebar or open a mobile search modal if desired
              toggleSidebar();
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <button 
            onClick={async () => {
              const shareData = {
                title: 'Toolina - All-In-One Web Tools',
                text: 'Check out Toolina, a collection of useful everyday web tools!',
                url: window.location.href,
              };
              try {
                if (navigator.share) {
                  try {
                    await navigator.share(shareData);
                  } catch (shareErr: any) {
                    // Fallback if user cancels or share fails
                    if (shareErr.name !== 'AbortError') {
                      await navigator.clipboard.writeText(shareData.url);
                      alert('URL copied to clipboard!');
                    }
                  }
                } else {
                  await navigator.clipboard.writeText(shareData.url);
                  alert('URL copied to clipboard!');
                }
              } catch (err) {
                console.error('Error sharing:', err);
              }
            }}
            className="flex items-center gap-1 sm:gap-2 bg-slate-900 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="hidden sm:inline">Share</span>
          </button>
          
          <button 
            onClick={() => setIsDonationOpen(true)}
            className="group relative flex items-center gap-2 bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all active:scale-95 overflow-hidden"
            title="Support Toolina"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out skew-x-12 z-0"></div>
            <svg className="w-4 h-4 animate-pulse relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="hidden sm:inline relative z-10">Donate (0% Fee)</span>
            <span className="inline sm:hidden relative z-10">Donate</span>
          </button>

          <Link 
            to="/help"
            className="p-2.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all border border-transparent hover:border-teal-100"
            title="Knowledge Base"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </Link>
        </div>
      </div>

      <UPIDonation 
        isOpen={isDonationOpen} 
        onClose={() => setIsDonationOpen(false)} 
        upiId="toolina.in@ybl" // Placeholder mapped to user email intent (optional, could be any)
      />
    </header>
  );
};

export default Header;
