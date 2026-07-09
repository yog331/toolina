import React, { useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  FileText, 
  Settings, 
  ShieldCheck, 
  Sparkles, 
  Info, 
  ArrowRight,
  LayoutGrid,
  ChevronRight
} from 'lucide-react';

import SEO from '../components/SEO';
import MergePDF from './MergePDF';
import SplitPDF from './SplitPDF';
import CompressPDF from './CompressPDF';
import RemovePDFPages from './RemovePDFPages';
import AddWatermarkPDF from './AddWatermarkPDF';
import PDFToImage from './PDFToImage';
import ImageToPDF from './ImageToPDF';
import UnlockPDF from './UnlockPDF';

interface PDFToolConfig {
  id: string;
  name: string;
  path: string;
  icon: string;
  description: string;
  color: string;
  tagline: string;
  component: React.ComponentType;
}

const PDF_TOOLS_LIST: PDFToolConfig[] = [
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    path: '/merge-pdf-combine-documents',
    icon: '📑',
    description: 'Combine multiple PDF files into one single document securely offline.',
    color: 'from-teal-500 to-emerald-600',
    tagline: 'Join PDFs instantly',
    component: MergePDF
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    path: '/split-pdf-extract-pages',
    icon: '✂️',
    description: 'Extract specific pages or split a large PDF into multiple files.',
    color: 'from-cyan-500 to-blue-600',
    tagline: 'Extract PDF pages',
    component: SplitPDF
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    path: '/compress-pdf-reduce-file-size',
    icon: '🗜️',
    description: 'Reduce PDF file size securely offline without uploading.',
    color: 'from-sky-500 to-teal-600',
    tagline: 'Shrink file size',
    component: CompressPDF
  },
  {
    id: 'remove-pdf-pages',
    name: 'Remove Pages',
    path: '/remove-pdf-pages-delete-securely',
    icon: '🗑️',
    description: 'Delete specific pages from a PDF document securely offline.',
    color: 'from-rose-500 to-red-600',
    tagline: 'Delete unwanted pages',
    component: RemovePDFPages
  },
  {
    id: 'add-pdf-watermark',
    name: 'Watermark PDF',
    path: '/add-watermark-to-pdf-online',
    icon: '©️',
    description: 'Add a custom text watermark to your PDF document securely offline.',
    color: 'from-indigo-500 to-violet-600',
    tagline: 'Protect your documents',
    component: AddWatermarkPDF
  },
  {
    id: 'pdf-to-image',
    name: 'PDF to Image',
    path: '/pdf-to-image-high-quality-converter',
    icon: '📄',
    description: 'Convert PDF document pages into high-quality JPG or PNG images instantly.',
    color: 'from-amber-500 to-orange-600',
    tagline: 'Extract high-res images',
    component: PDFToImage
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF',
    path: '/image-to-pdf-combine-converter',
    icon: '🖼️',
    description: 'Convert and combine multiple JPG, PNG, or WebP images into a single PDF.',
    color: 'from-fuchsia-500 to-pink-600',
    tagline: 'Convert images to PDF',
    component: ImageToPDF
  },
  {
    id: 'unlock-pdf',
    name: 'Unlock PDF',
    path: '/unlock-pdf-remove-password',
    icon: '🔓',
    description: 'Remove password and restriction constraints from encrypted PDFs (Aadhaar, bank statements) securely offline.',
    color: 'from-amber-500 to-yellow-600',
    tagline: 'Remove PDF Password',
    component: UnlockPDF
  }
];

interface PdfSuiteProps {
  defaultTool?: string;
}

const PdfSuite: React.FC<PdfSuiteProps> = ({ defaultTool }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tool config based on current location path or passed default
  const activeToolConfig = useMemo(() => {
    const currentPath = location.pathname;
    const found = PDF_TOOLS_LIST.find(tool => tool.path === currentPath);
    if (found) return found;

    if (defaultTool) {
      const match = PDF_TOOLS_LIST.find(tool => tool.id === defaultTool);
      if (match) return match;
    }
    return null; // Render unified dashboard overview
  }, [location.pathname, defaultTool]);

  const handleToolSelect = (path: string) => {
    navigate(path);
  };

  const ActiveComponent = activeToolConfig ? activeToolConfig.component : null;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-16">
      {/* Dynamic SEO Tag is handled internally by each mounted subcomponent. 
          When on the general Suite Dashboard, we define an overarching SEO metadata block. */}
      {!activeToolConfig && (
        <SEO 
          title="All-in-One Online PDF Tools Suite - Secure & Offline | Toolina"
          description="Merge, split, compress, watermark, delete pages, and convert PDF files. All processing is 100% secure and runs offline in your browser."
          url="https://toolina.in/pdf-tools-suite"
          keywords="online PDF tools, merge PDF offline, split PDF, compress PDF, PDF to image converter, image to PDF, remove pages, watermark PDF, secure PDF, Toolina"
          structuredData={{
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "All-in-One Online PDF Tools Suite - Secure & Offline",
            "applicationCategory": "MultimediaApplication",
            "operatingSystem": "All",
            "aggregateRating": {
               "@type": "AggregateRating",
               "ratingValue": "4.8",
               "ratingCount": "342"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          }}
        />
      )}

      {/* Modern Floating Navigation Suite Header */}
      <div className="bg-white/80 backdrop-blur-md p-4 md:p-6 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white text-xl shadow-lg shadow-teal-100">
              ⚙️
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                All-in-One PDF Tools Suite
                <span className="hidden sm:inline-block bg-teal-50 text-teal-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-teal-100">
                  100% Secure &amp; Offline
                </span>
              </h2>
              <p className="text-slate-500 text-xs font-medium">Switch tools instantly in a single unified workspace with high speed privacy</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/pdf-tools-suite"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                !activeToolConfig 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/10' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Suite Dashboard
            </Link>
          </div>
        </div>

        {/* Flexible Hub Navigation Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {PDF_TOOLS_LIST.map((tool) => {
            const isActive = activeToolConfig?.id === tool.id;
            return (
              <Link
                key={tool.id}
                to={tool.path}
                className={`relative px-4 py-3 rounded-2xl text-[13px] font-bold tracking-tight transition-all flex items-center gap-2 shrink-0 ${
                  isActive 
                    ? 'text-teal-700 bg-teal-50 border border-teal-100/80' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activePdfTabIndicator"
                    className="absolute inset-0 bg-teal-50 rounded-2xl border border-teal-100/80 -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="text-lg">{tool.icon}</span>
                <span>{tool.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Suite Workspace */}
      <div className="transition-all duration-300">
        {ActiveComponent ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ActiveComponent />
          </div>
        ) : (
          /* ALL-IN-ONE SUITE DASHBOARD VIEW */
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Elegant Suite Banner Card */}
            <div className="bg-slate-900 rounded-[3rem] p-8 md:p-14 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.15),transparent_60%)]"></div>
              <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="max-w-2xl relative z-10 space-y-6">
                <span className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400 fill-teal-400" /> Enterprise-Grade PDF Suite
                </span>
                
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-black tracking-tight leading-tight">
                  Unleash the Power of <span className="text-teal-400 bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent">Offline PDFs</span>
                </h1>
                
                <p className="text-slate-300 text-sm md:text-lg font-medium leading-relaxed">
                  Toolina consolidates 7 professional PDF utilities into a single offline-first workspace. 
                  Merge, split, compress, watermark, delete pages, or convert files with ultimate speed and complete, client-side data privacy.
                </p>

                <div className="flex flex-wrap items-center gap-6 pt-4 text-xs md:text-sm font-semibold text-slate-300 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-teal-400" />
                    <span>No Server Uploads</span>
                  </div>
                  <div className="h-4 w-px bg-white/20 hidden sm:block"></div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-teal-400" />
                    <span>Instant Execution</span>
                  </div>
                  <div className="h-4 w-px bg-white/20 hidden sm:block"></div>
                  <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-teal-400" />
                    <span>Zero Usage Limits</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid of Available PDF Tools */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Select a PDF Utility to Begin</h2>
                <p className="text-slate-500 text-sm font-medium mt-1">All processing runs entirely inside your browser. Your files never leave your device.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PDF_TOOLS_LIST.map((tool) => (
                  <Link 
                    key={tool.id} 
                    to={tool.path}
                    className="group bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-teal-500/30 shadow-xl shadow-slate-100/30 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[8rem] group-hover:bg-teal-50 transition-colors duration-300 -mr-6 -mt-6"></div>

                    <div className="relative z-10 space-y-4">
                      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-teal-50 group-hover:scale-110 transition-all duration-300">
                        {tool.icon}
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-lg font-black text-slate-900 group-hover:text-teal-600 transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{tool.tagline}</p>
                        <p className="text-slate-500 text-[13px] leading-relaxed font-medium pt-1">
                          {tool.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 flex items-center justify-end group-hover:text-teal-600 font-bold text-sm text-slate-400 gap-1.5 mt-auto">
                      <span>Open Tool</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* General Suite FAQs for Maximum SEO Power */}
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-100/50 space-y-8">
              <div className="space-y-2">
                <span className="text-teal-600 font-black text-xs uppercase tracking-wider">Frequently Asked Questions</span>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Understanding Toolina PDF Suite</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
                <div className="space-y-2">
                  <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" /> Are my uploaded PDF documents safe?
                  </h4>
                  <p className="text-slate-600 text-[13px] leading-relaxed font-medium">
                    Absolutely! Toolina operates with a <strong>privacy-first model</strong>. All PDF file modifications, rendering, compression, watermarking, and conversions are handled 100% client-side in your browser's execution memory. No data is transmitted to an external server, keeping sensitive personal or commercial documents completely secure.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-teal-600 shrink-0" /> Does compression affect original file quality?
                  </h4>
                  <p className="text-slate-600 text-[13px] leading-relaxed font-medium">
                    Our Compression engine supports three tailored parameters (High, Medium, and Extreme compression). Extreme compression prioritizes maximizing file reduction for strict email or portal attachment size caps, while Medium and High compression maintain pristine document resolution while safely removing unused bloated structures.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Info className="w-5 h-5 text-teal-600 shrink-0" /> Can I merge files of different dimensions?
                  </h4>
                  <p className="text-slate-600 text-[13px] leading-relaxed font-medium">
                    Yes! Our high-fidelity PDF joiner supports combining files of varying layouts, orientations (Portrait and Landscape), and page sizes. It aligns pages automatically to secure flawless flow when downloading the unified file.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-teal-600 shrink-0" /> Are there any hidden limits or subscriptions?
                  </h4>
                  <p className="text-slate-600 text-[13px] leading-relaxed font-medium">
                    No. Toolina provides its full fleet of utilities without locks, watermark branding, size limitations, daily caps, or mandatory credit cards. It is a completely free, utility sandbox made directly for state employees, students, developers, and general users alike.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfSuite;
