
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ToolCategory, Tool } from '../types';
import BrandLogo from './BrandLogo';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
  onItemClick?: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  tools: Tool[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle, onItemClick, searchTerm, onSearchChange, tools, favorites = [], toggleFavorite }) => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'All'>('All');
  
  const categories: ToolCategory[] = ['Govt', 'Utility', 'Health', 'Developer', 'PDF Tools'];

  const filteredTools = tools.filter(tool => {
    if (tool.isOffline) return false;
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none
      ${isOpen ? 'translate-x-0 w-[280px] sm:w-72' : '-translate-x-full lg:translate-x-0 lg:w-20'}`}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Logo Section */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-50 shrink-0">
          <Link to="/" className="flex items-center gap-3 active:scale-95 transition-transform" onClick={onItemClick}>
            <BrandLogo className="w-10 h-10 shrink-0" />
            <span className={`font-display font-black text-xl tracking-tight text-slate-900 transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
              Toolina<span className="text-teal-600">.</span>
            </span>
          </Link>
          <button 
            onClick={toggle} 
            className="lg:hidden p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search & Filters */}
        <div className={`px-4 pt-6 pb-2 transition-all duration-300 shrink-0 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none h-0 overflow-hidden p-0'}`}>
          <div className="relative group mb-6">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 bg-slate-100/50 border border-slate-200/60 rounded-2xl text-[13px] font-medium outline-none focus:ring-4 ring-teal-50 focus:border-teal-200 focus:bg-white transition-all shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
                title="Clear search"
                aria-label="Clear search"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                activeCategory === 'All' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                  activeCategory === cat ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-500 border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto scrollbar-hide">
          {/* Pinned Tools Section at the top */}
          {favorites.length > 0 && activeCategory === 'All' && !searchTerm && (
            <div className="space-y-2">
              <div className={`flex items-center gap-3 px-3 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] whitespace-nowrap">📌 Pinned Tools</h3>
                <div className="h-px flex-1 bg-rose-100"></div>
              </div>
              <ul className="space-y-1">
                {tools.filter(t => !t.isOffline && favorites.includes(t.id)).map(tool => (
                  <li key={`pinned-side-${tool.id}`} className="relative group">
                    <div className="flex items-center justify-between rounded-2xl transition-all min-h-[48px] hover:bg-slate-50 relative">
                      <Link
                        to={tool.path}
                        onClick={onItemClick}
                        className={`flex-1 flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all min-h-[48px]
                          ${location.pathname === tool.path 
                            ? 'bg-teal-50 text-teal-700 font-bold' 
                            : 'text-slate-500'}`}
                      >
                        <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">{tool.icon}</span>
                        <span className={`whitespace-nowrap font-medium text-[13px] tracking-tight transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
                          {tool.name}
                        </span>
                        {location.pathname === tool.path && !favorites.includes(tool.id) && (
                          <div className="absolute right-12 w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.6)]"></div>
                        )}
                      </Link>
                      
                      {isOpen && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(tool.id);
                          }}
                          className="p-3 mr-1 text-rose-500 hover:text-rose-600 transition-colors shrink-0 z-10"
                          title="Unpin tool"
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        </button>
                      )}

                      {!isOpen && (
                        <div className="absolute left-16 bg-slate-900 text-white text-[10px] font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap z-50 shadow-xl">
                          {tool.name} ❤️
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Regular Categories */}
          {categories.map(cat => {
            if (activeCategory !== 'All' && activeCategory !== cat) return null;
            const catTools = filteredTools.filter(t => t.category === cat);
            if (catTools.length === 0) return null;

            return (
              <div key={cat} className="space-y-2">
                <div className={`flex items-center gap-3 px-3 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                  <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] whitespace-nowrap">{cat}</h3>
                  <div className="h-px flex-1 bg-slate-100"></div>
                </div>
                <ul className="space-y-1">
                  {catTools.map(tool => (
                    <li key={tool.id} className="relative group">
                      <div className="flex items-center justify-between rounded-2xl transition-all min-h-[48px] hover:bg-slate-50 relative">
                        <Link
                          to={tool.path}
                          onClick={onItemClick}
                          className={`flex-1 flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all min-h-[48px]
                            ${location.pathname === tool.path 
                              ? 'bg-teal-50 text-teal-700 font-bold' 
                              : 'text-slate-500'}`}
                        >
                          <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">{tool.icon}</span>
                          <span className={`whitespace-nowrap font-medium text-[13px] tracking-tight transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
                            {tool.name}
                          </span>
                          {location.pathname === tool.path && !favorites.includes(tool.id) && (
                            <div className="absolute right-12 w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.6)]"></div>
                          )}
                        </Link>
                        
                        {isOpen && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleFavorite(tool.id);
                            }}
                            className={`p-3 mr-1 transition-colors shrink-0 z-10 ${
                              favorites.includes(tool.id) 
                                ? 'text-rose-500 hover:text-rose-600' 
                                : 'text-slate-300 hover:text-rose-400 opacity-0 group-hover:opacity-100 focus:opacity-100'
                            }`}
                            title={favorites.includes(tool.id) ? "Remove PIN" : "PIN to top"}
                          >
                            <svg className={`w-4 h-4 ${favorites.includes(tool.id) ? 'fill-current' : 'stroke-current fill-none'}`} viewBox="0 0 24 24" strokeWidth="2.5">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                          </button>
                        )}

                        {!isOpen && (
                          <div className="absolute left-16 bg-slate-900 text-white text-[10px] font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap z-50 shadow-xl">
                            {tool.name} {favorites.includes(tool.id) ? '❤️' : ''}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          
          {/* Admin Entry - Private Access */}
          <div className="pt-6 mt-6 border-t border-slate-50">
             <Link
                to="/admin"
                onClick={onItemClick}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative
                  ${location.pathname === '/admin' 
                    ? 'bg-slate-900 text-white shadow-xl' 
                    : 'text-slate-400 hover:bg-slate-50'}`}
              >
                <span className="text-xl shrink-0">🛠️</span>
                <span className={`whitespace-nowrap font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
                  Admin Panel
                </span>
             </Link>
          </div>
        </nav>

        {/* Footer Toggle */}
        <div className="p-4 border-t border-slate-50 hidden lg:block shrink-0">
          <button 
            onClick={toggle}
            className={`w-full flex items-center justify-center p-3 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-2xl transition-all duration-300 active:scale-95 ${isOpen ? '' : 'rotate-180'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
