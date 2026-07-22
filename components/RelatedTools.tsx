import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TOOLS } from '../constants';
import { Tool } from '../types';

interface RelatedToolsProps {
  currentToolId: string;
}

// Hand-crafted functional relationship groups to maximize SEO relevancy
const RELATIONSHIP_GROUPS = [
  // Govt & Finance Group
  ['raj-salary', 'central-salary', 'pay-matrix-raj', 'pay-matrix-central', 'income-tax-calc', 'nps-calc', 'emi-calc', 'solar-calc'],
  // Rajasthan Specific Govt Group
  ['raj-salary', 'pay-matrix-raj', 'raj-calendar', 'raj-sale-deed', 'raj-gift-deed', 'raj-lease-deed'],
  // Font & Content Utilities
  ['devlys-unicode', 'unicode-devlys', 'remington-typing', 'word-counter', 'qr-gen', 'barcode-generator'],
  // Health & Mindfulness Group
  ['bmi-calc', 'tdee-calc', 'box-breathing'],
  // PDF Tools Suite Group
  ['pdf-to-image', 'image-to-pdf', 'merge-pdf', 'split-pdf', 'compress-pdf', 'remove-pdf-pages', 'add-pdf-watermark', 'unlock-pdf'],
  // Developer Group
  ['url-indexing', 'csv-json', 'online-json-formatter', 'qr-gen', 'barcode-generator', 'quick-math-calculator']
];

const RelatedTools: React.FC<RelatedToolsProps> = ({ currentToolId }) => {
  // Find current tool to know its category
  const currentTool = TOOLS.find(t => t.id === currentToolId);
  const currentCategory = currentTool?.category;

  // 1. Calculate matching weights for each tool
  const weights: Record<string, number> = {};

  // Find all groups the current tool belongs to
  const matchingGroups = RELATIONSHIP_GROUPS.filter(group => group.includes(currentToolId));

  TOOLS.forEach(tool => {
    if (tool.id === currentToolId) return; // Skip current tool

    let weight = 0;

    // Weight for shared group membership
    matchingGroups.forEach(group => {
      if (group.includes(tool.id)) {
        weight += 5; // High relevance for being in the same hand-crafted functional group
      }
    });

    // Weight for shared category
    if (currentCategory && tool.category === currentCategory) {
      weight += 3; // Medium relevance for same category
    }

    // Default weight boost for popular tools to fill slots
    const popularIds = ['income-tax-calc', 'raj-salary', 'emi-calc', 'devlys-unicode', 'pdf-to-image', 'age-calc'];
    if (popularIds.includes(tool.id)) {
      weight += 1;
    }

    if (weight > 0) {
      weights[tool.id] = weight;
    }
  });

  // Sort tools based on calculated weights
  const recommendedTools = TOOLS
    .filter(t => t.id !== currentToolId)
    .map(tool => ({ tool, weight: weights[tool.id] || 0 }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 4) // Get top 4 matches
    .map(item => item.tool);

  if (recommendedTools.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-slate-200" id="related-tools-section">
      <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-8 gap-2">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-slate-800 font-display">
            Related <span className="text-teal-600">Calculators & Tools</span>
          </h3>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Hand-picked tools often used together with this converter to save you time.
          </p>
        </div>
        <Link 
          to="/" 
          className="text-teal-600 hover:text-teal-700 font-bold text-xs md:text-sm flex items-center gap-1 transition-colors whitespace-nowrap"
        >
          View all tools
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendedTools.map((tool) => (
          <Link
            key={tool.id}
            to={tool.path}
            id={`related-tool-card-${tool.id}`}
            className="group bg-white border border-slate-200 hover:border-teal-500/30 rounded-2xl p-5 hover:shadow-lg hover:shadow-teal-500/5 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl p-2 bg-slate-50 rounded-xl group-hover:bg-teal-50 transition-colors" role="img" aria-label={tool.name}>
                  {tool.icon}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                  {tool.category}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 group-hover:text-teal-600 transition-colors line-clamp-1">
                {tool.name}
              </h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                {tool.description}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400 group-hover:text-teal-600 transition-colors">
              <span>Open Tool</span>
              <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export const RelatedToolsWrapper: React.FC = () => {
  const location = useLocation();
  const activeTool = TOOLS.find(t => t.path === location.pathname);
  if (!activeTool) return null;
  return (
    <div className="max-w-6xl mx-auto px-1">
      <RelatedTools currentToolId={activeTool.id} />
    </div>
  );
};

export default RelatedTools;
