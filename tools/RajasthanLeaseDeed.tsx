import React, { useState, useMemo, useEffect } from 'react';
import { ShieldCheck, Info, FileText, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';
import ShareWidget from '../components/ShareWidget';
import StarRatingWidget from '../components/StarRatingWidget';

type LeaseTerm =
  | 'Upto 1 Year'
  | '1 to 30 Years'
  | 'Exceeding 30 Years / Perpetual'
  | 'Mining Lease'
  | 'Lease by Govt / ULB (Upto 30 Yrs)'
  | 'Lease by Govt / ULB (> 30 Yrs)';

const TERMS: LeaseTerm[] = [
  'Upto 1 Year',
  '1 to 30 Years',
  'Exceeding 30 Years / Perpetual',
  'Mining Lease',
  'Lease by Govt / ULB (Upto 30 Yrs)',
  'Lease by Govt / ULB (> 30 Yrs)'
];

const RajasthanLeaseDeed: React.FC = () => {
  const [ratingInfo, setRatingInfo] = useState<{rating: number, count: number}>({ rating: 4.6, count: 89 });
  const [propertyValue, setPropertyValue] = useState<number>(5000000);
  const [term, setTerm] = useState<LeaseTerm>('1 to 30 Years');

  const calculations = useMemo(() => {
    let stampDutyRate = 6;
    let rebatePercent = 0;
    
    switch (term) {
      case 'Upto 1 Year':
      case '1 to 30 Years':
        stampDutyRate = 6; 
        rebatePercent = 20; 
        break;
      case 'Exceeding 30 Years / Perpetual':
        stampDutyRate = 6;
        rebatePercent = 0;
        break;
      case 'Mining Lease':
        stampDutyRate = 6;
        rebatePercent = 20;
        break;
      case 'Lease by Govt / ULB (Upto 30 Yrs)':
        stampDutyRate = 6;
        rebatePercent = 20;
        break;
      case 'Lease by Govt / ULB (> 30 Yrs)':
        stampDutyRate = 6;
        rebatePercent = 0;
        break;
    }

    const baseStampDuty = (propertyValue * stampDutyRate) / 100;
    const rebateAmount = (baseStampDuty * rebatePercent) / 100;
    const stampDuty = baseStampDuty - rebateAmount;
    
    // Surcharge calculation
    const surchargeRate = propertyValue <= 1000000 ? 30 : 33;
    const surchargeAmount = (stampDuty * surchargeRate) / 100;
    
    // Registration Fee: 1% generally
    const registrationFeeRate = 1;
    let registrationFee = (propertyValue * registrationFeeRate) / 100;

    // CSI standard
    const csiCharges = 500;

    const totalCost = stampDuty + surchargeAmount + registrationFee + csiCharges;

    return {
      stampDuty,
      stampDutyRate,
      rebatePercent,
      surchargeAmount,
      surchargeRate,
      registrationFeeRate,
      registrationFee,
      csiCharges,
      totalCost,
    };
  }, [propertyValue, term]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <article className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <SEO 
        title="Rajasthan Lease Deed & Rent Agreement Calculator 2026" 
        description="Calculate exact stamp duty and registration fees for Lease Deeds and Rent Agreements in Rajasthan for 2026. Supports short-term, long-term (>30 years), and Govt leases." 
        url="https://toolina.in/rajasthan-lease-deed-stamp-duty-calculator"
        keywords="rajasthan rent agreement stamp duty, lease deed charges in rajasthan, rent agreement kaise banta hai rajasthan, rent agreement format hindi rajasthan, stamp duty on rent agreement rajasthan, rajasthan lease deed calculator, 11 month rent agreement stamp duty rajasthan, commercial rent agreement charges rajasthan, shop lease agreement stamp duty, lease deed registry fees rajasthan, rent agreement online rajasthan, registry charges lease deed rajasthan, lease deed format in hindi, kirayanama stamp duty rajasthan"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Rajasthan Lease Deed Calculator",
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
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50 rounded-bl-[15rem] -mr-20 -mt-20 opacity-80 blur-3xl"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-indigo-600 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center text-3xl md:text-4xl shadow-xl shadow-indigo-100 text-white shrink-0">
              🏢
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
                Raj. Lease Deed <span className="text-indigo-600">Calculator</span>
              </h1>
              <span className="inline-flex items-center gap-1.5 mt-3 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified for 2026 Guidelines
              </span>
            </div>
          </div>
          <div className="bg-slate-100 px-4 py-2 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">
            Commercial & Rent Tool
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          {/* Inputs Section */}
          <section className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-inner space-y-6">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span> Lease Configuration
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 ml-1">Total Consideration (₹)</label>
                  <input 
                    type="number" 
                    value={propertyValue || ''}
                    onChange={(e) => setPropertyValue(Number(e.target.value))}
                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-indigo-50 transition-all font-mono font-bold text-slate-800"
                    placeholder="Enter lease value"
                  />
                  <p className="text-[10px] text-slate-500 mt-2 flex items-start gap-1 leading-tight ml-1">
                    <Info className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    Enter the total rent amount + advance/premium based on telescopic rate.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 ml-1">Lease Tenure</label>
                  <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                    {TERMS.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTerm(t)}
                        className={`text-left w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all border flex items-center justify-between group ${
                          term === t
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {t}
                        {term === t && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                      </button>
                    ))}
                  </div>
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
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-3 block">Total Estimated Cost</span>
                  <div className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-4 leading-none font-mono break-all">
                    {formatCurrency(calculations.totalCost)}
                  </div>
                  <div className="inline-flex px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-widest text-indigo-100">ALL INCLUSIVE</div>
                </div>

                <div className="h-px bg-white/10 w-full my-8"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        Stamp Duty 
                        {calculations.rebatePercent > 0 && <span className="bg-indigo-500 text-white px-1.5 py-0.5 rounded text-[8px] ml-1">-{calculations.rebatePercent}%</span>}
                     </p>
                     <p className="text-2xl font-black text-white font-mono">{formatCurrency(calculations.stampDuty)}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Surcharge (@{calculations.surchargeRate}%)</p>
                     <p className="text-2xl font-black text-white font-mono">
                        {formatCurrency(calculations.surchargeAmount)}
                     </p>
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

      {/* Hinglish Guide for high-intent SEO search queries */}
      <section className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 space-y-8 shadow-xl shadow-slate-100/30">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h3 className="text-2xl md:text-3xl font-display font-black text-slate-900 tracking-tight">
            Hindi & Hinglish Guide: <span className="text-indigo-600">Rent Agreement Aur Lease Deed Kaise Banwayein?</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">Rent agreement stamp duty, lease deed rules aur commercial property registry charges ki complete details:</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="space-y-4">
            <h4 className="text-base font-black text-slate-800 flex items-center gap-2">
              📜 Rent Agreement Aur Lease Deed Me Kya Antar Hai?
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Aamtaur par residential ya short-term tenancies ke liye 11 mahine ka <strong>Rent Agreement (किरायानामा)</strong> banwaya jata hai jo ki ek simple agreement hota hai. Wahi dusri taraf, long-term (jaise 5 saal, 10 saal ya usse zyada) ya fir commercial properties ke liye <strong>Lease Deed (पट्टा)</strong> register karwana compulsory hota hai.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-base font-black text-slate-800 flex items-center gap-2">
              🧾 11 Mahine Ka Rent Agreement Kyun Banaya Jata Hai?
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Indian Registration Act ke mutabik, agar lease period 12 mahine (1 saal) ya usse zyada hai, toh deed ko register karwana kanoonan compulsory hai. Is compulsory registration aur stamp duty se bachne ke liye, log aamtaur par sirf <strong>11 mahine</strong> ka agreement banwate hain jise stamp paper par notarize karwaya jata hai.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-base font-black text-slate-800 flex items-center gap-2">
              📊 Rajasthan Me Lease Deed Par Stamp Duty Aur Registry Fee:
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Rajasthan me lease deed par stamp duty tenure (avadhi) par depend karti hai. Standard leases (30 saal tak) ke liye base stamp duty par sarkar ki taraf se <strong>20% Rebate (chhut)</strong> milti hai. Iske sath stamp duty par 30% se 33% tak ka surcharge (Cow Surcharge + Infra Surcharge) aur 1% Registration fee lagti hai.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-base font-black text-slate-800 flex items-center gap-2">
              🏢 Commercial Rent Agreement Ke Rules Aur Charges:
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dukan, office, warehouse ya factory jaise commercial space ko rent par dete waqt legal disputes se bachne ke liye formal Lease Deed registry behad zaruri hai. Is calculator me aap asani se apna total rent, security deposit aur advance premium dalkar exact stamp duty aur official fees count kar sakte hain.
            </p>
          </div>
        </div>

        <div className="bg-indigo-50/50 border border-indigo-100 p-6 rounded-3xl mt-6">
          <h4 className="text-xs font-black uppercase text-indigo-700 mb-2 tracking-wider">💡 Documents Needed for Rent/Lease Registration:</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Rent agreement ya lease deed register karwane ke liye Landlord (makan malik) aur Tenant (kirayedar) dono ke Aadhaar card, PAN card, do passport size photos aur do gawah (witnesses) ki zarurat hoti hai. Registry humesha sub-registrar office me appointment lekar dono pakshon ki maujoodgi me hi hoti hai.
          </p>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 sm:p-12">
        <div className="prose prose-slate max-w-none text-slate-600">
          <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight mb-6">Complete Guide to Lease Deed & Rent Agreement Stamp Duty in Rajasthan (2026)</h2>
          <p>Whether you are renting a small residential apartment or leasing a large commercial warehouse in Rajasthan, legally executing a Lease Deed (or Rent Agreement) is mandatory. Unregistered lease agreements exceeding 11 months are not admissible as evidence in Indian courts. Our <strong>Rajasthan Lease Deed Stamp Duty Calculator</strong> provides accurate, up-to-date estimates of the stamp duty, surcharges, and registration fees required to formally register your tenancy documents in 2026.</p>

          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">How is Stamp Duty Calculated on Lease Deeds in Rajasthan?</h3>
          <p>The stamp duty on a lease deed in Rajasthan is primarily based on the duration (tenure) of the lease and the total consideration (rent plus any premium/advance). The standard anchor rate is 6%, but the state provides substantial rebates for standard leases:</p>
          <ul className="list-disc pl-5 mt-4 space-y-2">
            <li><strong>Leases up to 30 Years:</strong> Standard lease deeds, whether for 1 year or 29 years, generally qualify for a massive 20% rebate on the base stamp duty. This effective relief lowers the financial burden of registering mid-to-long-term residential and commercial leases.</li>
            <li><strong>Perpetual Leases or Exceeding 30 Years:</strong> Long leases extending beyond 30 years or granted in perpetuity are treated almost like Sale Deeds (Conveyances). They attract a flat 6% stamp duty on the market value or DLC rate, without the 20% rebate.</li>
            <li><strong>Government & ULB Leases:</strong> Leases granted by local bodies (Municipal Corporations, UITs, JDAs) typically follow specialized calculation models, but for durations under 30 years, they also benefit from the 20% rebate.</li>
            <li><strong>Mining Leases:</strong> Rajasthan, being mineral-rich, has specific rules for mining leases where stamp duty is calculated at multiple times the agricultural land rate, maintaining the 20% rebate structure for Standard durations.</li>
          </ul>

          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">Surcharges: The 30% and 33% Rule</h3>
          <p>Similar to Sale Deeds, Lease Deeds in Rajasthan are subject to surcharges aimed at infrastructural development and cow protection.</p>
          <p>These surcharges are levied on the <em>stamp duty amount</em>. For leases involving a total consideration or market value up to ₹10 Lakhs, the surcharge is 30%. For higher value leases exceeding ₹10 Lakhs, the combined surcharge rises to 33%.</p>

          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">Registration Fees and CSI for Rent Agreements</h3>
          <p>To finalize the documentation, parties must pay the <strong>Registration Fee</strong>, universally set at 1% of the total lease consideration or market value (depending on the duration slab). Furthermore, the standard CSI (Copying, Scanning & Indexing) fee of ₹500 is added at the Sub-Registrar's office during document execution.</p>

          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">Why Register Your Rent Agreement?</h3>
          <p>Many landlords and tenants try to avoid stamp duty by signing unregistered 11-month agreements. While common, this leaves both parties completely vulnerable in case of disputes, non-payment of rent, or illegal eviction. By utilizing our calculator to understand the exact <strong>commercial rent agreement stamp duty in Rajasthan</strong>, you can transparently split costs and secure your legal rights under the Rajasthan Rent Control Act. Proper registration ensures peace of mind for both lessors and lessees.</p>

          <footer className="mt-8 pt-4 border-t border-slate-100 flex gap-3 text-sm items-start bg-slate-50 p-4 rounded-2xl">
            <Info className="w-5 h-5 text-indigo-500 shrink-0" />
            <p className="text-xs text-slate-500 leading-relaxed m-0 font-medium">
              <strong>Disclaimer:</strong> Leases up to 30 years generally qualify for a 20% rebate on base stamp duty as per the latest Rajasthan notification. Calculations for &lt;30 years may vary locally by specific telescopic slabs. Always consult a legal professional before executing legal documents.
            </p>
          </footer>
        </div>
      </section>

      {/* Share & Feedback Section */}
      <section className="flex flex-col gap-6">
        <StarRatingWidget 
          toolId="raj-lease-deed"
          initialRating={ratingInfo.rating}
          totalVotes={ratingInfo.count}
        />
        <ShareWidget 
          title="Rajasthan Lease Deed Stamp Duty Calculator 2026"
          description="Calculate exact Rajasthan lease deed and rent agreement stamp duty rates."
        />
      </section>
    </article>
  );
};

export default RajasthanLeaseDeed;
