import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import { TOOLS } from '../constants';

interface BreadcrumbProps {}

const Breadcrumb: React.FC<BreadcrumbProps> = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // Do not show breadcrumbs on the homepage
  if (pathname === '/' || pathname === '') {
    return null;
  }

  // Find if it's a known tool page
  const currentTool = TOOLS.find(t => t.path === pathname);

  let crumbs: { label: string; path?: string }[] = [];

  if (currentTool) {
    crumbs = [
      { label: 'Home', path: '/' },
      { label: currentTool.category },
      { label: currentTool.name }
    ];
  } else {
    // Check for other standard pages
    const pageNameMap: Record<string, string> = {
      '/privacy': 'Privacy Policy',
      '/privacy-policy-raj-salary-app': 'Salary App Privacy Policy',
      '/terms': 'Terms of Service',
      '/disclaimer': 'Legal Disclaimer',
      '/contact': 'Contact Us',
      '/help': 'Help Center',
      '/sitemap': 'Sitemap',
      '/admin': 'Admin Control Panel',
      '/google-indexing-api-bulk-submitter': 'Google Indexing Tool'
    };

    const label = pageNameMap[pathname];
    if (label) {
      crumbs = [
        { label: 'Home', path: '/' },
        { label: label }
      ];
    } else {
      // Fallback for custom routing paths
      const segment = pathname.split('/').filter(Boolean)[0] || '';
      const fallbackLabel = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      crumbs = [
        { label: 'Home', path: '/' },
        { label: fallbackLabel }
      ];
    }
  }

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": crumbs.map((crumb, idx) => {
            const origin = 'https://toolina.in';
            let itemUrl = origin;
            if (crumb.path) {
              itemUrl = origin + (crumb.path === '/' ? '' : crumb.path);
            } else {
              const catSlug = encodeURIComponent(crumb.label.toLowerCase());
              itemUrl = `${origin}/?category=${catSlug}`;
            }
            return {
              "@type": "ListItem",
              "position": idx + 1,
              "name": crumb.label,
              "item": itemUrl
            };
          })
        })}
      </script>
      <nav 
        aria-label="Breadcrumb" 
        className="mb-8 flex flex-wrap items-center gap-2 text-xs md:text-sm font-medium text-slate-500 animate-in fade-in duration-300"
      >
        {crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1;

          return (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
              )}
              {isLast ? (
                <span className="text-slate-800 font-bold truncate max-w-[200px] sm:max-w-[300px] md:max-w-none">
                  {crumb.label}
                </span>
              ) : (
                crumb.path ? (
                  <Link
                    to={crumb.path}
                    className="hover:text-teal-600 transition-colors flex items-center gap-1 flex-shrink-0 text-slate-500 font-medium"
                  >
                    {crumb.label === 'Home' && <Home className="w-3.5 h-3.5 text-slate-400" />}
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-slate-400 font-medium flex-shrink-0">
                    {crumb.label}
                  </span>
                )
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </>
  );
};

export default Breadcrumb;
