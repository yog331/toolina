import fs from 'fs';
import path from 'path';

const appFile = './App.tsx';
let content = fs.readFileSync(appFile, 'utf-8');

// Replace static imports with React.lazy
const importRegex = /import (\w+) from '\.\/tools\/([^']+)';/g;

content = content.replace(importRegex, (match, componentName, pathName) => {
  return `const ${componentName} = React.lazy(() => import('./tools/${pathName}'));`;
});

// Add Suspense around Routes
content = content.replace(/<Routes>/, '<React.Suspense fallback={<div className="flex items-center justify-center h-[50vh]"><div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div></div>}>\n                <Routes>');

content = content.replace(/<\/Routes>/, '</Routes>\n              </React.Suspense>');

fs.writeFileSync(appFile, content, 'utf-8');
console.log('App.tsx optimized');
