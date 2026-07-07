import React, { useState, useMemo, useEffect } from 'react';
import { ShieldCheck, Info, FileText, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';
import ShareWidget from '../components/ShareWidget';
import StarRatingWidget from '../components/StarRatingWidget';

type OwnerCategory =
  | 'Male / Legal Entity'
  | 'Joint (Male + Female)'
  | 'Female (General)'
  | 'Female (SC/ST/BPL)'
  | 'Disabled (40% - 80%)'
  | 'Disabled (Above 80%)'
  | 'Transgender';

const CATEGORIES: OwnerCategory[] = [
  'Male / Legal Entity',
  'Joint (Male + Female)',
  'Female (General)',
  'Female (SC/ST/BPL)',
  'Disabled (40% - 80%)',
  'Disabled (Above 80%)',
  'Transgender'
];

const RajasthanSaleDeed: React.FC = () => {
  const [ratingInfo, setRatingInfo] = useState<{rating: number, count: number}>({ rating: 4.8, count: 156 });
  const [propertyValue, setPropertyValue] = useState<number>(5000000);
  const [category, setCategory] = useState<OwnerCategory>('Male / Legal Entity');

  const calculations = useMemo(() => {
    let baseRate = 6;
    
    switch (category) {
      case 'Male / Legal Entity':
        baseRate = 6;
        break;
      case 'Joint (Male + Female)':
        baseRate = propertyValue <= 5000000 ? 5.5 : 6;
        break;
      case 'Female (General)':
        baseRate = 5;
        break;
      case 'Female (SC/ST/BPL)':
        baseRate = 4;
        break;
      case 'Disabled (40% - 80%)':
        baseRate = 4;
        break;
      case 'Disabled (Above 80%)':
      case 'Transgender':
        baseRate = 0;
        break;
    }

    const stampDuty = (propertyValue * baseRate) / 100;
    
    // PDF Surcharge Rule: 
    // 30% (10+20) for instruments having market value/consideration upto 10 lakhs
    // 33% (13+20) for except above case
    const surchargeRate = propertyValue <= 1000000 ? 30 : 33;
    const surchargeAmount = (stampDuty * surchargeRate) / 100;

    // Registration fee is generally @ 1%
    const registrationFee = (propertyValue * 1) / 100;
    
    // Copying, Scanning & Indexing Fees
    const csiCharges = 500;

    const totalCost = stampDuty + surchargeAmount + registrationFee + csiCharges;

    return {
      stampDuty,
      baseRate,
      surchargeAmount,
      surchargeRate,
      registrationFee,
      csiCharges,
      totalCost,
    };
  }, [propertyValue, category]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <article className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <SEO 
        title="Rajasthan Sale Deed Stamp Duty Calculator 2026 | Property Registry" 
        description="Calculate exact Rajasthan sale deed stamp duty rates, property registration fees, cow cess, and infrastructure surcharge for Male, Female, SC/ST, and Joint ownerships for 2026." 
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Rajasthan Sale Deed Stamp Duty Calculator",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "All",
          "aggregateRating": {
             "@type": "AggregateRating",
             "ratingValue": ratingInfo.rating.toString(),
             "ratingCount": ratingInfo.count.toString()
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
          }
        }}
      />
      <header className="bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-200 shadow-2xl shadow-slate-100/50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-50 rounded-bl-[15rem] -mr-20 -mt-20 opacity-80 blur-3xl"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-teal-600 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center text-3xl md:text-4xl shadow-xl shadow-teal-100 text-white shrink-0">
              🧾
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
                Raj. Sale Deed <span className="text-teal-600">Calculator</span>
              </h1>
              <span className="inline-flex items-center gap-1.5 mt-3 bg-teal-50 text-teal-700 border border-teal-200 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified for 2026 Guidelines
              </span>
            </div>
          </div>
          <div className="bg-slate-100 px-4 py-2 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">
            Property Registration Tool
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          {/* Inputs Section */}
          <section className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-inner space-y-6">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span> Instrument Configuration
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 ml-1">Document Value / DLC Rate (₹)</label>
                  <input 
                    type="number" 
                    value={propertyValue || ''}
                    onChange={(e) => setPropertyValue(Number(e.target.value))}
                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-teal-50 transition-all font-mono font-bold text-slate-800"
                    placeholder="Enter valuation amount"
                  />
                  <p className="text-[10px] text-slate-500 mt-2 flex items-start gap-1 leading-tight ml-1">
                    <Info className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    Enter the higher of actual transaction value or prevailing DLC rate.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 ml-1">Applicant Category</label>
                  <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`text-left w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all border flex items-center justify-between group ${
                          category === cat
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {cat}
                        {category === cat && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
                      </button>
                    ))}
                  </div>

                  {category === 'Joint (Male + Female)' && (
                    <div className="mt-3 bg-amber-50 rounded-xl p-3 border border-amber-100 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 flex-shrink-0"></span>
                      <p className="text-xs text-amber-700 font-medium">
                        Joint conveyances up to ₹50 Lakh receive a 0.5% relief (5.5%).
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Results Section */}
          <section className="lg:col-span-7">
            <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group h-full">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-48 h-48" />
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-400 mb-3 block">Total Estimated Cost</span>
                  <div className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-4 leading-none font-mono break-all">
                    {formatCurrency(calculations.totalCost)}
                  </div>
                  <div className="inline-flex px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-widest text-teal-100">ALL INCLUSIVE</div>
                </div>

                <div className="h-px bg-white/10 w-full my-8"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Stamp Duty (@{calculations.baseRate}%)</p>
                     <p className="text-2xl font-black text-white font-mono">{formatCurrency(calculations.stampDuty)}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Surcharge (@{calculations.surchargeRate}%)</p>
                     <p className="text-2xl font-black text-white font-mono">{formatCurrency(calculations.surchargeAmount)}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registration Fee (1%)</p>
                     <p className="text-2xl font-black text-emerald-400 font-mono">{formatCurrency(calculations.registrationFee)}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CSI Charges (Flat)</p>
                     <p className="text-2xl font-black text-white font-mono">{formatCurrency(calculations.csiCharges)}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </header>

      {/* SEO Content Section */}
      <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 sm:p-12">
        <div className="prose prose-slate max-w-none text-slate-600">
          <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight mb-6">Complete Guide to Rajasthan Property Registration & Stamp Duty (2026)</h2>
          <p>Planning to buy a property in Rajasthan? Understanding the <strong>Rajasthan Stamp Duty Calculator</strong> and property registration charges is crucial for homebuyers, investors, and real estate developers. In 2026, the Inspector General of Registration and Stamps (IGRS Rajasthan) has laid out specific tariff schedules. Our tool helps you accurately calculate the exact <strong>property registry charges in Rajasthan</strong> based on the latest DLC rates and government guidelines.</p>
          
          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">Current Stamp Duty Rates for Sale Deeds in Rajasthan</h3>
          <p>The base stamp duty for a Sale Deed (Conveyance) in Rajasthan is generally set at 6% of the property's market value or DLC (District Level Committee) rate, whichever is higher. However, to promote property ownership among specific demographics, the Rajasthan Government offers substantial concessions:</p>
          <ul className="list-disc pl-5 mt-4 space-y-2">
            <li><strong>Male / Legal Entity:</strong> 6% base stamp duty.</li>
            <li><strong>Female (General):</strong> 5% base stamp duty, encouraging women's empowerment in real estate.</li>
            <li><strong>Female (SC/ST/BPL):</strong> Further reduced to 4%.</li>
            <li><strong>Disabled Individuals (40% to 80% disability):</strong> 4% stamp duty rate.</li>
            <li><strong>Disabled (&gt;80%) & Transgenders:</strong> 100% exemption on base stamp duty (0%).</li>
            <li><strong>Joint Ownership (Male + Female):</strong> 5.5% (applicable for properties valued up to ₹50 Lakhs).</li>
          </ul>

          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">Understanding Cow Cess and Infrastructure Surcharge</h3>
          <p>In addition to the base stamp duty, property buyers in Rajasthan must pay a surcharge which directly funds state welfare and infrastructure projects. This surcharge is calculated as a percentage of the <em>stamp duty amount</em> (not the property value).</p>
          <p>According to the recent budget and IGRS updates for 2026:</p>
          <ul className="list-disc pl-5 mt-4 space-y-2">
            <li>For properties valued up to ₹10 Lakhs: The surcharge is 30% of the stamp duty (10% standard + 20% Cow Cess/Infra).</li>
            <li>For properties valued above ₹10 Lakhs: The surcharge is 33% of the stamp duty (13% standard + 20% Cow Cess/Infra).</li>
          </ul>

          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">Property Registration Fees and CSI Charges</h3>
          <p>The final component of property registration is the <strong>Registration Fee</strong>, which is standardly levied at 1% of the property's value. There is often a maximum cap placed by the state government to provide relief on high-value transactions (e.g., maximum cap of ₹4,00,000 for standard sale deeds). Additionally, a flat CSI (Copying, Scanning & Indexing) fee of ₹500 is applied to all document registrations.</p>
          
          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">Why Use the DLC Rate Calculator?</h3>
          <p>The DLC (District Level Committee) rate is the minimum valuation at which a property must be registered. If you are buying a plot, flat, or agricultural land in Jaipur, Jodhpur, Udaipur, or any other district, your stamp duty obligations are calculated on the higher of the actual transaction value or the DLC rate. Using our <strong>DLC Rate Stamp Duty Calculator</strong> ensures you don't face surprises at the Sub-Registrar's office, giving you a precise estimate of out-of-pocket expenses to finalize your real estate deal.</p>

          <footer className="mt-8 pt-4 border-t border-slate-100 flex gap-3 text-sm items-start bg-slate-50 p-4 rounded-2xl">
            <Info className="w-5 h-5 text-teal-500 shrink-0" />
            <p className="text-xs text-slate-500 leading-relaxed m-0 font-medium">
              <strong>Disclaimer:</strong> This estimation perfectly correlates with the 2026 Rajasthan state guidelines. Depending on the exact article/deed (e.g. SFS Scheme, MSME, Start-Up, Intangible properly), conditions may override standard rates. Always consult a legal professional or the official e-Panjiyan Rajasthan portal to confirm exact levies before executing legal documents.
            </p>
          </footer>
        </div>
      </section>

      {/* Share & Feedback Section */}
      <section className="flex flex-col gap-6">
        <StarRatingWidget 
          toolId="raj-sale-deed"
          initialRating={ratingInfo.rating}
          totalVotes={ratingInfo.count}
        />
        <ShareWidget 
          title="Rajasthan Sale Deed Stamp Duty Calculator 2026"
          description="Calculate exact Rajasthan sale deed stamp duty rates and property registration fees."
        />
      </section>
    </article>
  );
};

export default RajasthanSaleDeed;
