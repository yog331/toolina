
import React, { useEffect } from 'react';
import SEO from '../components/SEO';

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
  }, []);

  return (
    <article className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <SEO title="Privacy Policy - Toolina" description="Free professional calculator and internal tool by Toolina. Accurate, fast, and easy to use." />
      <header className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-display font-black text-slate-900 tracking-tight">Privacy <span className="text-teal-600">Policy</span></h1>
        <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs">Last Updated: March 2025</p>
      </header>

      <div className="bg-white p-8 md:p-16 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-200 shadow-sm prose prose-slate prose-sm max-w-none">
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-slate-800">Introduction</h2>
          <p className="text-slate-600 leading-relaxed">
            At Toolina ("we", "our", or "us"), we prioritize the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Toolina and how we use it.
          </p>
          
          <h2 className="text-2xl font-black text-slate-800">Log Files</h2>
          <p className="text-slate-600 leading-relaxed">
            Toolina follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.
          </p>

          <h2 className="text-2xl font-black text-slate-800">Google DoubleClick DART Cookie</h2>
          <p className="text-slate-600 leading-relaxed">
            Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy.
          </p>

          <h2 className="text-2xl font-black text-slate-800">Advertising Partners Privacy Policies</h2>
          <p className="text-slate-600 leading-relaxed">
            Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Toolina, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
          </p>

          <h2 className="text-2xl font-black text-slate-800">Calculation Privacy</h2>
          <p className="bg-teal-50 p-6 rounded-3xl border border-teal-100 text-teal-900 font-medium italic">
            Importantly: All calculations performed using our tools (Salary Calculators, CSV Transformers, Image Converters) occur entirely within your web browser (client-side). Your personal financial data, documents, or images are never uploaded to our servers.
          </p>

          <h2 className="text-2xl font-black text-slate-800">Children's Information</h2>
          <p className="text-slate-600 leading-relaxed">
            Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. Toolina does not knowingly collect any Personal Identifiable Information from children under the age of 13.
          </p>
        </section>
      </div>
    </article>
  );
};

export default PrivacyPolicy;
