import React, { useState } from 'react';
import QRCode from 'react-qr-code';

interface UPIDonationProps {
  isOpen: boolean;
  onClose: () => void;
  upiId?: string;
  payeeName?: string;
}

const UPIDonation: React.FC<UPIDonationProps> = ({ 
  isOpen, 
  onClose, 
  upiId = "gunnu@upi", // Using placeholder derived from user email
  payeeName = "Developer"
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&purpose=toolina`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Ribbon */}
        <div className="bg-teal-500 p-6 text-center text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-black tracking-tight">Support Toolina</h2>
          <p className="text-teal-50 text-xs font-semibold mt-2 flex flex-col gap-1">
            <span>Your donation helps us keep building and sharing free tools.</span>
            <span className="opacity-90">0% Gateway Fees. 100% Direct Support.</span>
          </p>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col items-center bg-slate-50">
          
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6">
            <QRCode 
              value={upiString} 
              size={180} 
              level="M"
              className="mx-auto"
            />
          </div>

          <div className="text-center w-full">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Scan & Pay with any UPI App</p>
            <div className="flex items-center justify-center gap-3 mb-6">
               {/* generic icons pretending to be UPI apps */}
               <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500">GPay</div>
               <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500">PhPe</div>
               <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500">PTM</div>
               <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500">BHIM</div>
            </div>
            
            <div className="flex items-center justify-between bg-slate-200/50 p-3 rounded-xl border border-slate-200 w-full group hover:border-teal-300 transition-colors">
              <div className="flex flex-col text-left overflow-hidden">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">UPI ID</span>
                <span className="text-sm font-bold text-slate-700 truncate">{upiId}</span>
              </div>
              <button 
                onClick={copyToClipboard}
                className={`p-2 rounded-lg transition-colors flex-shrink-0 ${copied ? 'bg-green-100 text-green-600' : 'bg-white text-slate-500 hover:text-teal-600 shadow-sm'}`}
                title="Copy UPI ID"
              >
                {copied ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                )}
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default UPIDonation;
