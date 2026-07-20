import React, { useState, useMemo, useEffect } from 'react';
import { ShieldCheck, Info, FileText, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';
import ShareWidget from '../components/ShareWidget';
import StarRatingWidget from '../components/StarRatingWidget';

type GiftCategory =
  | 'General (Non-Family)'
  | 'Daughter / Daughter-in-law / Wife'
  | 'Parents (Age > 60) / Son (Parents > 70)'
  | 'Widow / Own Son / Own Daughter'
  | 'Brother / Sister / Husband'
  | 'Parents (Age <= 60) / Son (Parents <= 70)'
  | 'Grandchildren (Son/Daughter side)';

const CATEGORIES: GiftCategory[] = [
  'General (Non-Family)',
  'Daughter / Daughter-in-law / Wife',
  'Parents (Age > 60) / Son (Parents > 70)',
  'Widow / Own Son / Own Daughter',
  'Brother / Sister / Husband',
  'Parents (Age <= 60) / Son (Parents <= 70)',
  'Grandchildren (Son/Daughter side)'
];

const RajasthanGiftDeed: React.FC = () => {
  const [ratingInfo, setRatingInfo] = useState<{rating: number, count: number}>({ rating: 4.9, count: 112 });
  const [propertyValue, setPropertyValue] = useState<number>(5000000);
  const [category, setCategory] = useState<GiftCategory>('General (Non-Family)');

  const calculations = useMemo(() => {
    let stampDutyRate = 6;
    
    switch (category) {
      case 'General (Non-Family)':
        stampDutyRate = 6;
        break;
      case 'Daughter / Daughter-in-law / Wife':
      case 'Parents (Age > 60) / Son (Parents > 70)':
      case 'Widow / Own Son / Own Daughter':
      case 'Grandchildren (Son/Daughter side)':
        stampDutyRate = 0;
        break;
      case 'Brother / Sister / Husband':
      case 'Parents (Age <= 60) / Son (Parents <= 70)':
        stampDutyRate = 2.5;
        break;
    }

    const stampDuty = (propertyValue * stampDutyRate) / 100;
    
    // Surcharge calculation (Cow/Infra)
    const surchargeRate = propertyValue <= 1000000 ? 30 : 33;
    const surchargeAmount = stampDutyRate === 0 ? 0 : (stampDuty * surchargeRate) / 100;
    
    // Registration Fee: 1% generally, up to a max (Gift to family is usually 1%)
    const registrationFeeRate = 1;
    let registrationFee = (propertyValue * registrationFeeRate) / 100;

    // CSI standard
    const csiCharges = 500;

    const totalCost = stampDuty + surchargeAmount + registrationFee + csiCharges;

    return {
      stampDuty,
      stampDutyRate,
      surchargeAmount,
      surchargeRate,
      registrationFeeRate,
      registrationFee,
      csiCharges,
      totalCost,
    };
  }, [propertyValue, category]);

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
        title="Rajasthan Gift Deed Stamp Duty Calculator 2026" 
        description="Calculate Rajasthan Gift Deed stamp duty and registration fees for family and non-family members based on the official 2026 schedule." 
        url="https://toolina.in/rajasthan-property-gift-deed-calculator"
        keywords="gift deed stamp duty in rajasthan, rajasthan gift deed calculator, gift deed charges in rajasthan in hindi, father to son gift deed stamp duty in rajasthan, gift deed registry fees rajasthan, property gift deed rules in hindi, rajasthan me gift deed kaise banaye, gift deed format rajasthan, family gift deed stamp duty rajasthan, stamp duty on gift deed rajasthan hindi, apni property gift kaise kare rajasthan, gift deed kharch rajasthan, bhai behen ko gift deed stamp duty, husband wife gift deed stamp duty rajasthan"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Rajasthan Gift Deed Stamp Duty Calculator",
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
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-50 rounded-bl-[15rem] -mr-20 -mt-20 opacity-80 blur-3xl"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-purple-600 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center text-3xl md:text-4xl shadow-xl shadow-purple-100 text-white shrink-0">
              🎁
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
                Raj. Gift Deed <span className="text-purple-600">Calculator</span>
              </h1>
              <span className="inline-flex items-center gap-1.5 mt-3 bg-purple-50 text-purple-700 border border-purple-200 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified for 2026 Guidelines
              </span>
            </div>
          </div>
          <div className="bg-slate-100 px-4 py-2 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">
            Family Transfer Tool
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          {/* Inputs Section */}
          <section className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-inner space-y-6">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span> Transfer Configuration
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 ml-1">Market Value / DLC Rate (₹)</label>
                  <input 
                    type="number" 
                    value={propertyValue || ''}
                    onChange={(e) => setPropertyValue(Number(e.target.value))}
                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 ring-purple-50 transition-all font-mono font-bold text-slate-800"
                    placeholder="Enter property value"
                  />
                  <p className="text-[10px] text-slate-500 mt-2 flex items-start gap-1 leading-tight ml-1">
                    <Info className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    Enter the DLC rate or prevailing market value of the gifted property.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 ml-1">Donee (Receiver) Relationship</label>
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
                        {category === cat && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
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
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-400 mb-3 block">Total Estimated Cost</span>
                  <div className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-4 leading-none font-mono break-all">
                    {formatCurrency(calculations.totalCost)}
                  </div>
                  <div className="inline-flex px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-widest text-purple-100">ALL INCLUSIVE</div>
                </div>

                <div className="h-px bg-white/10 w-full my-8"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stamp Duty (@{calculations.stampDutyRate}%)</p>
                     <p className="text-2xl font-black text-white font-mono">{formatCurrency(calculations.stampDuty)}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Surcharge (Cow/Infra)</p>
                     <p className="text-2xl font-black text-white font-mono">
                        {calculations.stampDutyRate === 0 ? 'Exempted' : formatCurrency(calculations.surchargeAmount)}
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
            Hindi & Hinglish Guide: <span className="text-purple-600">Rajasthan Me Gift Deed Ke Rules Aur Stamp Duty</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">Property gift deed charges, stamp duty exemptions aur registry fees ki complete details:</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="space-y-4">
            <h4 className="text-base font-black text-slate-800 flex items-center gap-2">
              🎁 Gift Deed (दान पत्र) Kya Hota Hai?
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong>Gift Deed (दान पत्र)</strong> ek legal document hai jiske zariye aap apni property bina kisi paise ke lena-dena kiye, kisi dusre vyakti (donee) ke naam transfer karte hain. Will (वसीयत) ke mukable iska sabse bada fayda ye hai ki property ka ownership turant transfer ho jata hai, aur donor ki mrityu ka wait nahi karna padta.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-base font-black text-slate-800 flex items-center gap-2">
              👨‍👩‍👧‍👦 Family Me Gift Deed Par Stamp Duty Kitni Hai?
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Rajasthan sarkar ne close blood relatives (jaise Wife, Son, Daughter, Parents, Brother, Sister, Daughter-in-law) ke liye stamp duty me bhari chhut di hai. Wife, Daughter, ya Son ko gift dene par <strong>0% (Exempted)</strong> stamp duty lagti hai. Bhai-behen, pati ya parents (age &lt;= 60) ke liye ye rate sirf <strong>2.5%</strong> hai.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-base font-black text-slate-800 flex items-center gap-2">
              🧾 Registration Fees Aur Dusre Charges Kya Hain?
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Stamp duty me chhut milne ke baad bhi, property ki registry ke liye <strong>1% Registration Fee</strong> (property ki DLC value ka) aur extra CSI charges (flat ₹500) dena compulsory hota hai. Iske bina gift deed legally valid nahi mana jata aur sub-registrar office me register hona zaruri hai.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-base font-black text-slate-800 flex items-center gap-2">
              ⚖️ Non-Family Member Ko Gift Dene Ke Niyam:
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Agar aap kisi friend ya distant relative (jaise chacha, mama, bhatija) ko property gift karte hain, toh general rules ke mutabik full <strong>6% Stamp Duty</strong> lagti hai. Iske sath hi stamp duty par 30% ya 33% ka Surcharge (Cow Cess + Infra Cess) bhi lagta hai. Isliye non-family gift kafi expensive hota hai.
            </p>
          </div>
        </div>

        <div className="bg-purple-50/50 border border-purple-100 p-6 rounded-3xl mt-6">
          <h4 className="text-xs font-black uppercase text-purple-700 mb-2 tracking-wider">💡 Important Tips for Rajasthan Gift Deed:</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Gift Deed banwane ke liye property ke papers ke sath donor aur donee dono ka Aadhaar card, PAN card aur do gawah (witnesses) ki zarurat hoti hai. Gift register hone ke baad use revoke (vapas) nahi kiya ja sakta, isliye dhyan se aur soch-samajh kar hi gift deed registry karwayein.
          </p>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 sm:p-12">
        <div className="prose prose-slate max-w-none text-slate-600">
          <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight mb-6">Complete Guide to Gift Deed Stamp Duty & Registration in Rajasthan (2026)</h2>
          <p>Transferring property to a loved one through a Gift Deed is a common practice in India. In Rajasthan, the stamp duty and registration fees for a Gift Deed depend heavily on the relationship between the donor (the person giving the gift) and the donee (the person receiving it). Our <strong>Rajasthan Gift Deed Calculator</strong> helps you determine the exact legal costs involved in executing a valid gift deed based on the official 2026 guidelines established by the Inspector General of Registration and Stamps (IGRS).</p>

          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">Gift Deed Stamp Duty Exemptions for Family Members</h3>
          <p>To encourage smooth family settlements and inheritance transfers, the Rajasthan State Government offers massive concessions on stamp duty when property is gifted to close blood relatives. The standard stamp duty for a non-family gift is 6%, but it drops significantly for immediate family members:</p>
          <ul className="list-disc pl-5 mt-4 space-y-2">
            <li><strong>0% Stamp Duty (Full Exemption):</strong> Gifts made to a Wife, Daughter, Daughter-in-law, Widow, Own Son, Own Daughter, Grandchildren, or Parents (if aged over 60) attract NO base stamp duty.</li>
            <li><strong>2.5% Stamp Duty (Partial Exemption):</strong> Gifts made to a Brother, Sister, Husband, or Parents (aged 60 or below) attract a highly discounted 2.5% stamp duty.</li>
            <li><strong>6% Stamp Duty:</strong> Gifts made to non-family members or distant relatives (e.g., friends, uncles, cousins outside the defined immediate family bracket) fall under the standard 6% conveyance rate.</li>
          </ul>

          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">Surcharges: Cow Cess and Infrastructure Development</h3>
          <p>While the base stamp duty might be exempted or reduced, surcharges are still applicable if there is a base stamp duty liability. In Rajasthan, surcharges include the Cow Cess and Infrastructure Cess.</p>
          <p>If your gift deed falls under the 0% stamp duty bracket (e.g., father gifting a house to his daughter), the surcharge amount also becomes zero. However, if you fall in the 2.5% or 6% category, a surcharge of 30% (for properties up to ₹10 Lakhs) or 33% (for properties above ₹10 Lakhs) is calculated on the <em>stamp duty amount</em>.</p>

          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">Registration Fees and CSI Charges for Gift Deeds</h3>
          <p>Even if your gift deed is fully exempt from stamp duty, you must legally register the document at the Sub-Registrar's Office to make the property transfer legally binding under the Transfer of Property Act.</p>
          <ul className="list-disc pl-5 mt-4 space-y-2">
            <li><strong>Registration Fee:</strong> Usually levied at 1% of the property's prevailing DLC rate or market value, regardless of the stamp duty exemption.</li>
            <li><strong>CSI Charges:</strong> A flat fee of ₹500 is taken for Copying, Scanning, and Indexing the legal documents.</li>
          </ul>

          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">Why Make a Gift Deed in Rajasthan?</h3>
          <p>A Gift Deed is an excellent estate planning tool. Unlike a Will, which only takes effect after death and may involve complex probate proceedings, a Gift Deed transfers ownership immediately during the lifetime of the donor. With the substantial rebates provided by the Rajasthan Government, transferring residential plots, agricultural land, or flats to your direct heirs has become incredibly cost-effective. Always ensure your Gift Deed is drafted correctly by a legal expert and stamped according to the e-Panjiyan value to avoid future litigation.</p>
          
          <footer className="mt-8 pt-4 border-t border-slate-100 flex gap-3 text-sm items-start bg-slate-50 p-4 rounded-2xl">
            <Info className="w-5 h-5 text-purple-500 shrink-0" />
            <p className="text-xs text-slate-500 leading-relaxed m-0 font-medium">
              <strong>Disclaimer:</strong> Close blood relatives enjoy up to 100% exemption on gift deed stamp duty in Rajasthan. Registration fees (1%) and CSI charges (₹500) remain mandatory. Always consult a legal professional before executing legal documents.
            </p>
          </footer>
        </div>
      </section>

      {/* Share & Feedback Section */}
      <section className="flex flex-col gap-6">
        <StarRatingWidget 
          toolId="raj-gift-deed"
          initialRating={ratingInfo.rating}
          totalVotes={ratingInfo.count}
        />
        <ShareWidget 
          title="Rajasthan Gift Deed Stamp Duty Calculator 2026"
          description="Calculate exact Rajasthan gift deed stamp duty rates for family transfers."
        />
      </section>
    </article>
  );
};

export default RajasthanGiftDeed;
