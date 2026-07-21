
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Breadcrumb from './components/Breadcrumb';
import ToolFeedback from './components/ToolFeedback';
import PWABanner from './components/PWABanner';
import { TOOLS } from './constants';
import { Tool } from './types';

// Tool Components
const AgeCalculator = React.lazy(() => import('./tools/AgeCalculator'));
const BMICalculator = React.lazy(() => import('./tools/BMICalculator'));
const TDEECalculator = React.lazy(() => import('./tools/TDEECalculator'));
const BoxBreathing = React.lazy(() => import('./tools/BoxBreathing'));
const CSVToJson = React.lazy(() => import('./tools/CSVToJson'));
const QRGenerator = React.lazy(() => import('./tools/QRGenerator'));
const BarcodeGenerator = React.lazy(() => import('./tools/BarcodeGenerator'));
const WordCounter = React.lazy(() => import('./tools/WordCounter'));
const RajasthanSalary = React.lazy(() => import('./tools/RajasthanSalary'));
const RajasthanPayMatrix = React.lazy(() => import('./tools/RajasthanPayMatrix'));
const CentralPayMatrix = React.lazy(() => import('./tools/CentralPayMatrix'));
const CentralSalary = React.lazy(() => import('./tools/CentralSalary'));
const NPSCalculator = React.lazy(() => import('./tools/NPSCalculator'));
const UtilityBillCalculator = React.lazy(() => import('./tools/UtilityBillCalculator'));
const SolarCalculator = React.lazy(() => import('./tools/SolarCalculator'));
const ImageConverter = React.lazy(() => import('./tools/ImageConverter'));
const RajasthanCalendar = React.lazy(() => import('./tools/RajasthanCalendar'));
const RajasthanSaleDeed = React.lazy(() => import('./tools/RajasthanSaleDeed'));
const RajasthanGiftDeed = React.lazy(() => import('./tools/RajasthanGiftDeed'));
const RajasthanLeaseDeed = React.lazy(() => import('./tools/RajasthanLeaseDeed'));
const EMICalculator = React.lazy(() => import('./tools/EMICalculator'));
const DevLysConverter = React.lazy(() => import('./tools/DevLysConverter'));
const IncomeTaxCalculator = React.lazy(() => import('./tools/IncomeTaxCalculator'));
const PdfSuite = React.lazy(() => import('./tools/PdfSuite'));
const PlaceholderTool = React.lazy(() => import('./tools/PlaceholderTool'));
const OnlineJsonFormatter = React.lazy(() => import('./tools/OnlineJsonFormatter'));
const UniversalConverter = React.lazy(() => import('./tools/UniversalConverter'));
const QuickMath = React.lazy(() => import('./tools/QuickMath'));

// Legal, Support & Admin
const PrivacyPolicy = React.lazy(() => import('./tools/PrivacyPolicy'));
const PrivacyPolicyRajSalaryApp = React.lazy(() => import('./tools/PrivacyPolicyRajSalaryApp'));
const TermsOfService = React.lazy(() => import('./tools/TermsOfService'));
const Disclaimer = React.lazy(() => import('./tools/Disclaimer'));
const ContactUs = React.lazy(() => import('./tools/ContactUs'));
const HelpCenter = React.lazy(() => import('./tools/HelpCenter'));
const Sitemap = React.lazy(() => import('./tools/Sitemap'));
const AdminDashboard = React.lazy(() => import('./tools/AdminDashboard'));
const UrlIndexingTool = React.lazy(() => import('./tools/UrlIndexingTool'));

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [searchTerm, setSearchTerm] = useState('');
  const [tools] = useState<Tool[]>(TOOLS);

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('tool_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const updated = prev.includes(id) 
        ? prev.filter(fId => fId !== id) 
        : [...prev, id];
      try {
        localStorage.setItem('tool_favorites', JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save favorites to localStorage", e);
      }
      return updated;
    });
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeSidebarOnMobile = () => {
    if (window.innerWidth <= 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden selection:bg-teal-100 selection:text-teal-900 font-sans">
        <div 
          className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[45] transition-opacity duration-300 lg:hidden ${
            sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setSidebarOpen(false)}
        />

        <Sidebar 
          isOpen={sidebarOpen} 
          toggle={() => setSidebarOpen(!sidebarOpen)} 
          onItemClick={closeSidebarOnMobile}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          tools={tools}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />

        <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'} w-full`}>
          <Header 
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
            isSidebarOpen={sidebarOpen}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          
          <main className="flex-1 flex flex-col w-full max-w-[100vw]">
            <div className="flex-1 p-4 md:p-6 lg:p-10">
              <Breadcrumb />
              <React.Suspense fallback={<div className="flex items-center justify-center h-[50vh]"><div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div></div>}>
                <Routes>
                <Route path="/" element={<Dashboard searchTerm={searchTerm} tools={tools} favorites={favorites} toggleFavorite={toggleFavorite} />} />
                <Route path="/chronological-age-calculator" element={<AgeCalculator />} />
                <Route path="/body-mass-index-bmi-calculator" element={<BMICalculator />} />
                <Route path="/tdee-and-macronutrient-target-calculator" element={<TDEECalculator />} />
                <Route path="/box-breathing-stress-relief-guide" element={<BoxBreathing />} />
                <Route path="/csv-to-json-converter" element={<CSVToJson />} />
                <Route path="/qr-code-generator" element={<QRGenerator />} />
                <Route path="/barcode-generator" element={<BarcodeGenerator />} />
                <Route path="/online-word-counter" element={<WordCounter />} />
                <Route path="/rajasthan-government-salary-calculator" element={<RajasthanSalary />} />
                <Route path="/central-government-salary-calculator" element={<CentralSalary />} />
                <Route path="/national-pension-scheme-nps-calculator" element={<NPSCalculator />} />
                <Route path="/electricity-water-utility-bill-calculator" element={<UtilityBillCalculator />} />
                <Route path="/rooftop-solar-subsidy-calculator" element={<SolarCalculator />} />
                <Route path="/passport-photo-image-converter-resizer" element={<ImageConverter />} />
                <Route path="/rajasthan-government-holiday-calendar" element={<RajasthanCalendar />} />
                <Route path="/rajasthan-property-sale-deed-calculator" element={<RajasthanSaleDeed />} />
                <Route path="/rajasthan-property-gift-deed-calculator" element={<RajasthanGiftDeed />} />
                <Route path="/rajasthan-lease-deed-stamp-duty-calculator" element={<RajasthanLeaseDeed />} />
                <Route path="/loan-emi-calculator-amortization" element={<EMICalculator />} />
                <Route path="/devlys-to-unicode-hindi-font-converter" element={<DevLysConverter />} />
                <Route path="/income-tax-calculator-new-old-regime" element={<IncomeTaxCalculator />} />
                <Route path="/7th-pay-matrix-rajasthan-government" element={<RajasthanPayMatrix />} />
                <Route path="/7th-pay-matrix-central-government" element={<CentralPayMatrix />} />
                <Route path="/pdf-tools-suite" element={<PdfSuite />} />
                <Route path="/pdf-to-image-high-quality-converter" element={<PdfSuite defaultTool="pdf-to-image" />} />
                <Route path="/image-to-pdf-combine-converter" element={<PdfSuite defaultTool="image-to-pdf" />} />
                <Route path="/merge-pdf-combine-documents" element={<PdfSuite defaultTool="merge-pdf" />} />
                <Route path="/split-pdf-extract-pages" element={<PdfSuite defaultTool="split-pdf" />} />
                <Route path="/compress-pdf-reduce-file-size" element={<PdfSuite defaultTool="compress-pdf" />} />
                <Route path="/remove-pdf-pages-delete-securely" element={<PdfSuite defaultTool="remove-pdf-pages" />} />
                <Route path="/add-watermark-to-pdf-online" element={<PdfSuite defaultTool="add-pdf-watermark" />} />
                <Route path="/unlock-pdf-remove-password" element={<PdfSuite defaultTool="unlock-pdf" />} />
                <Route path="/online-json-formatter-and-validator" element={<OnlineJsonFormatter />} />
                <Route path="/universal-unit-converter" element={<UniversalConverter />} />
                <Route path="/quick-math-calculator-online" element={<QuickMath />} />

                {/* Permanent Redirects for Old Slugs to retain SEO Ranking */}
                <Route path="/age-calc" element={<Navigate to="/chronological-age-calculator" replace />} />
                <Route path="/bmi-calc" element={<Navigate to="/body-mass-index-bmi-calculator" replace />} />
                <Route path="/csv-json" element={<Navigate to="/csv-to-json-converter" replace />} />
                <Route path="/json-formatter" element={<Navigate to="/online-json-formatter-and-validator" replace />} />
                <Route path="/qr-gen" element={<Navigate to="/qr-code-generator" replace />} />
                <Route path="/word-counter" element={<Navigate to="/online-word-counter" replace />} />
                <Route path="/raj-salary" element={<Navigate to="/rajasthan-government-salary-calculator" replace />} />
                <Route path="/central-salary" element={<Navigate to="/central-government-salary-calculator" replace />} />
                <Route path="/nps-calc" element={<Navigate to="/national-pension-scheme-nps-calculator" replace />} />
                <Route path="/utility-bill" element={<Navigate to="/electricity-water-utility-bill-calculator" replace />} />
                <Route path="/solar-calc" element={<Navigate to="/rooftop-solar-subsidy-calculator" replace />} />
                <Route path="/img-conv" element={<Navigate to="/passport-photo-image-converter-resizer" replace />} />
                <Route path="/raj-calendar" element={<Navigate to="/rajasthan-government-holiday-calendar" replace />} />
                <Route path="/raj-sale-deed" element={<Navigate to="/rajasthan-property-sale-deed-calculator" replace />} />
                <Route path="/raj-gift-deed" element={<Navigate to="/rajasthan-property-gift-deed-calculator" replace />} />
                <Route path="/raj-lease-deed" element={<Navigate to="/rajasthan-lease-deed-stamp-duty-calculator" replace />} />
                <Route path="/emi-calc" element={<Navigate to="/loan-emi-calculator-amortization" replace />} />
                <Route path="/devlys-unicode" element={<Navigate to="/devlys-to-unicode-hindi-font-converter" replace />} />
                <Route path="/income-tax-calc" element={<Navigate to="/income-tax-calculator-new-old-regime" replace />} />
                <Route path="/7th-pay-matrix-rajasthan" element={<Navigate to="/7th-pay-matrix-rajasthan-government" replace />} />
                <Route path="/7th-pay-matrix-central" element={<Navigate to="/7th-pay-matrix-central-government" replace />} />
                <Route path="/pdf-to-image" element={<Navigate to="/pdf-to-image-high-quality-converter" replace />} />
                <Route path="/image-to-pdf" element={<Navigate to="/image-to-pdf-combine-converter" replace />} />
                <Route path="/merge-pdf" element={<Navigate to="/merge-pdf-combine-documents" replace />} />
                <Route path="/split-pdf" element={<Navigate to="/split-pdf-extract-pages" replace />} />
                <Route path="/compress-pdf" element={<Navigate to="/compress-pdf-reduce-file-size" replace />} />
                <Route path="/remove-pdf-pages" element={<Navigate to="/remove-pdf-pages-delete-securely" replace />} />
                <Route path="/add-pdf-watermark" element={<Navigate to="/add-watermark-to-pdf-online" replace />} />
                <Route path="/unlock-pdf" element={<Navigate to="/unlock-pdf-remove-password" replace />} />
                <Route path="/url-indexing" element={<Navigate to="/google-indexing-api-bulk-submitter" replace />} />
                <Route path="/tdee-calc" element={<Navigate to="/tdee-and-macronutrient-target-calculator" replace />} />
                <Route path="/box-breathing" element={<Navigate to="/box-breathing-stress-relief-guide" replace />} />
                <Route path="/universal-converter" element={<Navigate to="/universal-unit-converter" replace />} />
                <Route path="/quick-math" element={<Navigate to="/quick-math-calculator-online" replace />} />
                
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/privacy-policy-raj-salary-app" element={<PrivacyPolicyRajSalaryApp />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/disclaimer" element={<Disclaimer />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/help" element={<HelpCenter />} />
                <Route path="/sitemap" element={<Sitemap />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/google-indexing-api-bulk-submitter" element={<UrlIndexingTool />} />
                
                <Route path="*" element={<PlaceholderTool />} />
              </Routes>
              </React.Suspense>
            </div>
            <ToolFeedback />
            <Footer />
            <PWABanner />
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
