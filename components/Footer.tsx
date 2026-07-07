
import React from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-slate-200 bg-white pt-12 md:pt-20 pb-8 px-4 sm:px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="md:col-span-2 space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/" className="flex items-center gap-3">
              <BrandLogo className="w-10 h-10" />
              <span className="font-display font-black text-2xl tracking-tight text-slate-900">
                Toolina<span className="text-teal-600">.</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-md">
              The premier platform for professional government salary audits, utility converters, and digital productivity tools. Built with a focus on precision, speed, and user privacy.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 md:border-none pb-2 md:pb-0 w-full md:w-auto">Regulatory</h4>
            <ul className="space-y-4">
              <li><Link to="/privacy" className="text-xs font-bold text-slate-600 hover:text-teal-600 transition-colors block md:inline">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-xs font-bold text-slate-600 hover:text-teal-600 transition-colors block md:inline">Terms of Service</Link></li>
              <li><Link to="/disclaimer" className="text-xs font-bold text-slate-600 hover:text-teal-600 transition-colors block md:inline">Legal Disclaimer</Link></li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 md:border-none pb-2 md:pb-0 w-full md:w-auto">Support</h4>
            <ul className="space-y-4">
              <li><Link to="/help" className="text-xs font-bold text-slate-600 hover:text-teal-600 transition-colors block md:inline">Help Center</Link></li>
              <li><Link to="/contact" className="text-xs font-bold text-slate-600 hover:text-teal-600 transition-colors block md:inline">Contact Us</Link></li>
              <li><Link to="/sitemap" className="text-xs font-bold text-slate-600 hover:text-teal-600 transition-colors block md:inline w-full md:w-auto">Sitemap</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center md:text-left">
            © {currentYear} Toolina Digital Labs. All Rights Reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 grayscale opacity-40">
             <div className="text-[9px] font-black uppercase tracking-tighter bg-slate-100 px-2 py-1 rounded">SSL Secure</div>
             <div className="text-[9px] font-black uppercase tracking-tighter bg-slate-100 px-2 py-1 rounded">GDPR Ready</div>
             <div className="text-[9px] font-black uppercase tracking-tighter bg-slate-100 px-2 py-1 rounded">CCPA Compliant</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
