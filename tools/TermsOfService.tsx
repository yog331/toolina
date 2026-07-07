
import React, { useEffect } from 'react';
import SEO from '../components/SEO';

const TermsOfService: React.FC = () => {
  useEffect(() => {
  }, []);

  return (
    <article className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <SEO title="Terms of Service - Toolina" description="Free professional calculator and internal tool by Toolina. Accurate, fast, and easy to use." />
      <header className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-display font-black text-slate-900 tracking-tight">Terms of <span className="text-teal-600">Service</span></h1>
        <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs">Standard Usage Agreement</p>
      </header>

      <div className="bg-white p-8 md:p-16 rounded-[2.5rem] border border-slate-200 shadow-sm prose prose-slate prose-sm max-w-none">
        <section className="space-y-6 text-slate-600">
          <h2 className="text-2xl font-black text-slate-800">1. Terms</h2>
          <p>By accessing this Website, accessible from https://toolina.in, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws.</p>

          <h2 className="text-2xl font-black text-slate-800">2. Use License</h2>
          <p>Permission is granted to temporarily use the tools on Toolina's Website for personal, non-commercial transitory viewing only.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Modify or copy the materials;</li>
            <li>Use the materials for any commercial purpose or for any public display;</li>
            <li>Attempt to reverse engineer any software contained on Toolina's Website;</li>
            <li>Remove any copyright or other proprietary notations from the materials.</li>
          </ul>

          <h2 className="text-2xl font-black text-slate-800">3. Disclaimer</h2>
          <p>All the materials on Toolina’s Website are provided "as is". Toolina makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, Toolina does not make any representations concerning the accuracy or reliability of the use of the materials on its Website.</p>

          <h2 className="text-2xl font-black text-slate-800">4. Limitations</h2>
          <p>Toolina or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on Toolina’s Website, even if Toolina or an authorize representative of this Website has been notified, orally or in writing, of the possibility of such damage.</p>

          <h2 className="text-2xl font-black text-slate-800">5. Revisions and Errata</h2>
          <p>The materials appearing on Toolina’s Website may include technical, typographical, or photographic errors. Toolina will not promise that any of the materials in this Website are accurate, complete, or current. Toolina may change the materials contained on its Website at any time without notice.</p>
        </section>
      </div>
    </article>
  );
};

export default TermsOfService;
