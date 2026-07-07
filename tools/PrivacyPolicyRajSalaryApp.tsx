import React from 'react';
import SEO from '../components/SEO';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicyRajSalaryApp: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <SEO 
        title="Privacy Policy - Rajasthan Govt Salary Calculator App" 
        description="Privacy Policy for the Rajasthan Govt Salary Calculator mobile application hosted on the Google Play Store." 
        noindex={true}
      />

      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700 mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Toolina
        </Link>
        <div className="prose prose-slate max-w-none">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-8">
            Privacy Policy - Rajasthan Govt Salary Calculator App
          </h1>
          <p className="text-sm text-slate-500 font-medium">Last updated: May 27, 2026</p>

          <p>
            Welcome to the <strong>Rajasthan Govt Salary Calculator</strong> application. This Privacy Policy describes how your information is collected, used, and shared when you use our mobile application (the "App") downloaded from the Google Play Store.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Information We Collect</h2>
          <p>
            Our core principle is simple: <strong>We do not collect, transmit, distribute, or sell your personal data.</strong>
          </p>
          <ul>
            <li><strong>Personal Information:</strong> We do NOT collect personally identifiable information (such as your name, email address, phone number, or physical address).</li>
            <li><strong>Financial Information:</strong> The salary computations (including basic pay, allowances, deductions, and increments) are performed locally on your device. We do not store or transmit your financial data to external servers.</li>
            <li><strong>Device & Usage Data:</strong> We may collect non-personally identifiable diagnostic data (such as app crash logs and device type) solely to improve the performance and reliability of the App.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. How We Use Your Information</h2>
          <p>
            Since the App processes your salary data locally, any information entered into the App remains exclusive to your device. Any anonymous diagnostic data collected is used strictly to:
          </p>
          <ul>
            <li>Identify and fix bugs or app crashes.</li>
            <li>Enhance the functionality and user experience of the App.</li>
            <li>Ensure compatibility across different Android devices.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Third-Party Services</h2>
          <p>
            The App may use third-party services (such as Google AdMob for advertising or Google Analytics for crash reporting) that may collect information used to identify you. 
            These third-party providers have their own privacy policies detailing how they handle your data:
          </p>
          <ul>
            <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Play Services</a></li>
            <li><a href="https://support.google.com/admob/answer/6128543" target="_blank" rel="noopener noreferrer">AdMob</a></li>
            <li><a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">Google Analytics for Firebase</a></li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Permissions</h2>
          <p>
            The App requires minimal permissions to operate correctly. Depending on the functionality, it may request:
          </p>
          <ul>
            <li><strong>Internet Access:</strong> Required to display ads (if applicable) and send anonymous crash reports.</li>
            <li>We do <strong>NOT</strong> request permissions to access your contacts, camera, microphone, or precise location.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Data Security</h2>
          <p>
            We value your trust in providing us with your data (even locally). All calculations and personal input remain on your device. However, remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">6. Children's Privacy</h2>
          <p>
            These Services do not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers (if any data were to be collected).
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">7. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">8. Contact Us</h2>
          <p>
            If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.
          </p>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mt-4">
            <p className="font-medium text-slate-700 m-0">Email: support@toolina.in</p>
            <p className="font-medium text-slate-700 m-0 mt-2">Website: https://toolina.in</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyRajSalaryApp;
