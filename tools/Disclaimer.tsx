
import React, { useEffect } from 'react';
import SEO from '../components/SEO';

const Disclaimer: React.FC = () => {
  useEffect(() => {
  }, []);

  return (
    <article className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <SEO title="Disclaimer - Toolina" description="Free professional calculator and internal tool by Toolina. Accurate, fast, and easy to use." />
      <header className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-display font-black text-slate-900 tracking-tight">Legal <span className="text-teal-600">Disclaimer</span></h1>
        <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs">Accuracy & Liability Disclosure</p>
      </header>

      <div className="bg-white p-8 md:p-16 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-10">
        <section className="space-y-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-2xl">⚠️</div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Professional Notice</h2>
          </div>
          
          <div className="space-y-6 text-slate-600 leading-relaxed">
            <p>
              The information provided by <strong>Toolina</strong> ("we", "us", or "our") on this website is for general informational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
            </p>

            <h3 className="text-xl font-black text-slate-800">No Financial Advice</h3>
            <p>
              The <strong>Rajasthan Govt Salary Calculator</strong>, <strong>Central Govt Salary Calculator</strong>, and <strong>EMI Calculators</strong> are tools designed to provide estimates based on user input and currently known government rules. They do not constitute official financial advice or guarantee of pay. Actual salary disbursements are subject to department-specific audits and service rules.
            </p>

            <h3 className="text-xl font-black text-slate-800">External Links Disclaimer</h3>
            <p>
              The site may contain links to external websites that are not provided or maintained by or in any way affiliated with Toolina. Please note that Toolina does not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
            </p>

            <h3 className="text-xl font-black text-slate-800">Errors and Omissions</h3>
            <p>
              While we have made every attempt to ensure that the information contained in this site has been obtained from reliable sources, Toolina is not responsible for any errors or omissions, or for the results obtained from the use of this information.
            </p>
          </div>
          
          <div className="mt-12 p-8 bg-slate-900 rounded-[2rem] text-white">
            <p className="text-sm font-medium italic opacity-80">
              "By using our tools, you acknowledge that you are using them at your own risk and discretion. For official financial decisions, please consult your Drawing and Disbursing Officer (DDO) or a qualified financial consultant."
            </p>
          </div>
        </section>
      </div>
    </article>
  );
};

export default Disclaimer;
