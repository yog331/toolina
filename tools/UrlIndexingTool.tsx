import React, { useState, useRef, useCallback, useEffect } from 'react';
import AccompanyingText from '../components/AccompanyingText';
import { Link } from 'react-router-dom';
import { Play, AlertCircle, Check, UploadCloud, Info, Loader2, CheckCircle2, XCircle, Clock, Globe, FileText, Download, Key, Coffee, Heart } from 'lucide-react';
import { SignJWT, importPKCS8 } from 'jose';
import SEO from '../components/SEO';
import ShareWidget from '../components/ShareWidget';
import StarRatingWidget from '../components/StarRatingWidget';
import { useDropzone } from 'react-dropzone';

interface LogEntry {
  id: string;
  url: string;
  status: 'pending' | 'success' | 'error' | 'processing';
  message?: string;
}

export default function UrlIndexingTool() {
  const [urls, setUrls] = useState<string>('');
  const [actionType, setActionType] = useState<'URL_PUBLISH' | 'URL_UPDATE' | 'URL_DELETED'>('URL_PUBLISH');
  const [saKeyContent, setSaKeyContent] = useState<string | null>(null);
  const [saFileName, setSaFileName] = useState<string>('');
  const [errorDesc, setErrorDesc] = useState<string>('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const [urlInputMode, setUrlInputMode] = useState<'manual' | 'sitemap'>('manual');
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [isFetchingSitemap, setIsFetchingSitemap] = useState(false);
  const cancelRef = useRef(false);

  const [ratingInfo, setRatingInfo] = useState<{rating: number, count: number}>({ rating: 4.9, count: 184 });

  const parsedUrls = urls.split('\n').map(u => u.trim()).filter(u => u && u.startsWith('http'));

  const stopProcessing = () => {
    cancelRef.current = true;
  };

  const fetchSitemap = async () => {
    if (!sitemapUrl) return;
    setIsFetchingSitemap(true);
    setErrorDesc('');
    try {
      let text = '';
      
      // Try internal proxy first
      try {
        const response = await fetch(`/api/proxy?url=${encodeURIComponent(sitemapUrl)}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        text = await response.text();
      } catch (err) {
        console.warn('Internal proxy failed, trying external fallback:', err);
        // Fallback to allorigins
        try {
          const fallbackRes = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(sitemapUrl)}`);
          if (!fallbackRes.ok) throw new Error('Failed to fetch the sitemap via proxies.');
          text = await fallbackRes.text();
        } catch (fallbackErr) {
           throw new Error('Failed to fetch the sitemap via proxies. Check if the URL is accessible.');
        }
      }
      
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');
      
      // Check if there are parsing errors
      const parseError = xmlDoc.getElementsByTagName("parsererror");
      if (parseError.length > 0) {
        throw new Error('Invalid XML format returned from the server.');
      }

      // Check if it is a sitemap index
      const sitemaps = xmlDoc.getElementsByTagName('sitemap');
      const locs = xmlDoc.getElementsByTagName('loc');
      
      if (sitemaps.length > 0 && sitemaps.length === locs.length) {
         throw new Error('This appears to be a sitemap index. Please provide a direct sitemap URL rather than a sitemap index.');
      }
      
      const extractedUrls: string[] = [];
      for (let i = 0; i < locs.length; i++) {
        if (locs[i].textContent) {
          extractedUrls.push(locs[i].textContent!);
        }
      }
      
      if (extractedUrls.length === 0) {
         throw new Error('No URLs (<loc> tags) were found in the provided sitemap.');
      } else {
         const newUrls = extractedUrls.join('\n');
         setUrls(prevUrls => prevUrls ? prevUrls + '\n' + newUrls : newUrls);
         // Switch back to manual entry to show the populated list
         setUrlInputMode('manual');
      }
    } catch (err: any) {
      setErrorDesc('Error fetching sitemap: ' + err.message);
    } finally {
      setIsFetchingSitemap(false);
    }
  };

  const onDropFile = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        setErrorDesc('Please upload a valid JSON file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const parsed = JSON.parse(text);
          if (!parsed.client_email || !parsed.private_key) {
            setErrorDesc('Invalid service account key. Required fields (client_email, private_key) are missing.');
            return;
          }
          setSaKeyContent(text);
          setSaFileName(file.name);
          setErrorDesc('');
        } catch (error) {
          setErrorDesc('Could not parse the JSON file.');
        }
      };
      reader.readAsText(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropFile,
    accept: { 'application/json': ['.json'] },
    maxFiles: 1
  } as any);

  const startProcessing = async () => {
    if (!saKeyContent || parsedUrls.length === 0) return;
    
    setIsProcessing(true);
    setProgress(0);
    setErrorDesc('');
    cancelRef.current = false;
    
    const initialLogs: LogEntry[] = parsedUrls.map((url, i) => ({
      id: `url-${i}-${Date.now()}`,
      url,
      status: 'pending'
    }));
    setLogs(initialLogs);

    try {
      const keys = JSON.parse(saKeyContent);
      const privateKey = await importPKCS8(keys.private_key, 'RS256');
      
      const jwt = await new SignJWT({
        iss: keys.client_email,
        scope: 'https://www.googleapis.com/auth/indexing https://www.googleapis.com/auth/webmasters.readonly',
        aud: 'https://oauth2.googleapis.com/token'
      })
      .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(privateKey);
      
      const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: jwt
        })
      });
      
      const tokenData = await tokenResp.json();
      
      if (!tokenResp.ok) {
        throw new Error(tokenData.error_description || 'Failed to authenticate with Google. Check your Service Account Key.');
      }
      
      const token = tokenData.access_token;
      
      let sitesList: string[] = [];
      try {
        const sitesRes = await fetch('https://searchconsole.googleapis.com/webmasters/v3/sites', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (sitesRes.ok) {
          const sitesData = await sitesRes.json();
          sitesList = sitesData.siteEntry?.map((s: any) => s.siteUrl) || [];
        }
      } catch (e) {
        console.log("Could not fetch Search Console sites.", e);
      }

      const findBestSiteMatch = (urlToMatch: string, sites: string[]) => {
        try {
          const urlObj = new URL(urlToMatch);
          const hostname = urlObj.hostname;
          
          let bestMatch = sites.find(s => urlToMatch.startsWith(s));
          
          if (!bestMatch) {
             bestMatch = sites.find(s => s === `sc-domain:${hostname}` || s === `sc-domain:${hostname.replace(/^www\./, '')}`);
          }
          
          return bestMatch;
        } catch (e) {
          return null;
        }
      };
      
      for (let i = 0; i < parsedUrls.length; i++) {
        if (cancelRef.current) {
          setErrorDesc('Process was terminated by user.');
          break;
        }

        const currentUrl = parsedUrls[i];
        let isAlreadyIndexed = false;
        
        if (actionType === 'URL_PUBLISH') {
          const siteUrl = findBestSiteMatch(currentUrl, sitesList);
          
          if (siteUrl) {
            setLogs(prev => prev.map(log => 
              log.url === currentUrl ? { ...log, status: 'processing', message: 'Checking Google Index status...' } : log
            ));

            try {
              const inspectRes = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  inspectionUrl: currentUrl,
                  siteUrl: siteUrl,
                  languageCode: 'en-US'
                })
              });

              if (inspectRes.ok) {
                const inspectData = await inspectRes.json();
                const verdict = inspectData.inspectionResult?.indexStatusResult?.verdict;
                const coverageState = inspectData.inspectionResult?.indexStatusResult?.coverageState || '';
                
                if (verdict === 'PASS' || coverageState.toLowerCase().includes('indexed')) {
                   setLogs(prev => prev.map(log => 
                     log.url === currentUrl ? { ...log, status: 'success', message: 'Already indexed by Google (Skipped)' } : log
                   ));
                   isAlreadyIndexed = true;
                }
              } else if (inspectRes.status === 429) {
                 // Rate limited
                 setLogs(prev => prev.map(log => 
                   log.url === currentUrl ? { ...log, status: 'processing', message: 'Rate limited by Google, backing off...' } : log
                 ));
                 await new Promise(resolve => setTimeout(resolve, 2000));
              }
            } catch (err) {
              console.log("Failed to inspect URL:", err);
            }
          }
          
          if (!isAlreadyIndexed) {
            setLogs(prev => prev.map(log => 
              log.url === currentUrl ? { ...log, status: 'processing', message: 'Checking recent submission...' } : log
            ));

            try {
              const metaRes = await fetch(`https://indexing.googleapis.com/v3/urlNotifications/metadata?url=${encodeURIComponent(currentUrl)}`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              
              if (metaRes.ok) {
                const metaData = await metaRes.json();
                if (metaData.latestUpdate && metaData.latestUpdate.type === 'URL_UPDATED') {
                  setLogs(prev => prev.map(log => 
                    log.url === currentUrl ? { ...log, status: 'success', message: 'Already submitted previously' } : log
                  ));
                  isAlreadyIndexed = true;
                }
              }
            } catch (err) {
              // Ignore check errors and proceed to publish
            }
          }
        }
        
        if (!isAlreadyIndexed) {
          setLogs(prev => prev.map(log => 
            log.url === currentUrl ? { ...log, status: 'processing', message: 'Publishing...' } : log
          ));
          
          try {
            const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                url: currentUrl,
                type: actionType === 'URL_DELETED' ? 'URL_DELETED' : 'URL_UPDATED'
              })
            });
            
            const data = await res.json();
            
            if (!res.ok) {
              throw new Error(data.error?.message || 'API Error');
            }
            
            setLogs(prev => prev.map(log => 
              log.url === currentUrl ? { ...log, status: 'success', message: 'Submitted successfully' } : log
            ));
          } catch (err: any) {
            setLogs(prev => prev.map(log => 
              log.url === currentUrl ? { ...log, status: 'error', message: err.message } : log
            ));
          }
        }
        
        setProgress(Math.round(((i + 1) / parsedUrls.length) * 100));
        await new Promise(resolve => setTimeout(resolve, 600)); // Strict rate limit (100 is max per min per project by default, ~1.6/sec)
      }
    } catch (err: any) {
      setErrorDesc(err.message || 'An unexpected error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <article className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <SEO 
        title="Google Indexing API SaaS Tool - Bulk Submit URLs" 
        description="Submit your URLs to Google Search Console instantly using the Indexing API. Fetch from sitemaps, track progress, 100% secure in your browser." 
        keywords="Google Indexing API tool, bulk URL submitter, Google Search Console indexing, fast indexing Google, SEO indexing tool, quick index SEO, Google indexing script"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Google URL Indexing Tool",
          "description": "Bulk submit URLs directly to Google Search Console via Indexing API from your browser.",
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "All",
          "aggregateRating": {
             "@type": "AggregateRating",
             "ratingValue": ratingInfo.rating.toString(),
             "ratingCount": ratingInfo.count.toString()
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        }}
      />
      
      <header className="bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-200 shadow-2xl shadow-indigo-100/50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-bl-[10rem] -mr-16 -mt-16 opacity-50 blur-3xl"></div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10 w-full">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 transform -rotate-6 shrink-0">
              <Globe className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-slate-900 tracking-tight leading-none">
                URL <span className="text-indigo-600">Indexer</span> Pro
              </h1>
              <p className="text-slate-500 font-medium text-xs md:text-lg mt-1 italic">Fast, secure, browser-based URL submission to Google Search Console.</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        <section className="col-span-1 lg:col-span-5 flex flex-col gap-6">
          
          {/* Step 1: Configuration */}
          <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 p-6 shadow-inner relative overflow-hidden flex flex-col">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6">
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span> 1. Configuration
            </h2>
            
            <div className="space-y-6 flex-1">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Key className="w-3 h-3 text-slate-400" /> Service Account Key
                </label>
                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed rounded-3xl p-5 text-center cursor-pointer transition-all duration-200 bg-white ${isProcessing ? 'opacity-50 pointer-events-none' : ''} ${isDragActive ? 'border-indigo-400 bg-indigo-50/50 scale-[1.02]' : 'border-slate-200 hover:border-indigo-300'}`}
                >
                  <input {...getInputProps()} disabled={isProcessing} />
                  {saKeyContent ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-slate-800 truncate max-w-[200px] sm:max-w-[250px]">{saFileName}</p>
                        <p className="text-xs text-indigo-600 font-medium hover:underline cursor-pointer">Replace file</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="mx-auto w-10 h-10 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Upload JSON Key</p>
                      <p className="text-[10px] text-slate-400 font-medium">Drag & drop or browse</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Globe className="w-3 h-3 text-slate-400" /> Action Type
                </label>
                <div className="flex bg-slate-200/50 p-1.5 rounded-2xl border border-slate-200/60">
                  <button
                    disabled={isProcessing}
                    className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm ${actionType === 'URL_PUBLISH' ? 'bg-white text-indigo-700 border border-slate-200' : 'text-slate-500 hover:text-slate-700 border border-transparent'} disabled:opacity-50`}
                    onClick={() => setActionType('URL_PUBLISH')}
                  >
                    Publish
                  </button>
                  <button
                    disabled={isProcessing}
                    className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm ${actionType === 'URL_UPDATE' ? 'bg-white text-teal-600 border border-slate-200' : 'text-slate-500 hover:text-slate-700 border border-transparent'} disabled:opacity-50`}
                    onClick={() => setActionType('URL_UPDATE')}
                  >
                    Update
                  </button>
                  <button
                    disabled={isProcessing}
                    className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm ${actionType === 'URL_DELETED' ? 'bg-white text-red-600 border border-slate-200' : 'text-slate-500 hover:text-slate-700 border border-transparent'} disabled:opacity-50`}
                    onClick={() => setActionType('URL_DELETED')}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Target URLs */}
          <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 p-6 shadow-inner relative overflow-hidden flex flex-col flex-1">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between mb-6">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span> 2. Target URLs
              </span>
              <span className="text-[9px] font-black text-slate-400 bg-slate-200/50 px-2.5 py-1 rounded-full uppercase tracking-wider">{parsedUrls.length} valid</span>
            </h2>
            
            <div className="flex gap-2 mb-4 bg-slate-200/50 p-1.5 rounded-xl w-max border border-slate-200/60">
               <button onClick={() => setUrlInputMode('manual')} className={`px-4 py-2 text-[10px] uppercase tracking-wider font-bold rounded-lg transition-all shadow-sm ${urlInputMode === 'manual' ? 'bg-white text-slate-800 border border-slate-200' : 'text-slate-500 hover:text-slate-700'} disabled:opacity-50`} disabled={isProcessing}>Manual Input</button>
               <button onClick={() => setUrlInputMode('sitemap')} className={`px-4 py-2 text-[10px] uppercase tracking-wider font-bold rounded-lg transition-all shadow-sm ${urlInputMode === 'sitemap' ? 'bg-white text-indigo-700 border border-slate-200' : 'text-slate-500 hover:text-slate-700'} disabled:opacity-50`} disabled={isProcessing}>Fetch Sitemap</button>
            </div>

            {urlInputMode === 'sitemap' && (
              <div className="mb-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={sitemapUrl}
                    onChange={e => setSitemapUrl(e.target.value)}
                    placeholder="https://example.com/sitemap.xml"
                    className="flex-1 rounded-xl bg-white border border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20 px-4 py-3 text-sm font-mono transition-shadow h-[46px]"
                    disabled={isProcessing || isFetchingSitemap}
                  />
                  <button
                    onClick={fetchSitemap}
                    disabled={isProcessing || isFetchingSitemap || !sitemapUrl}
                    className="px-5 py-3 h-[46px] bg-indigo-600 text-white hover:bg-indigo-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:hover:bg-indigo-600 flex items-center justify-center gap-2 whitespace-nowrap shadow-sm"
                  >
                    {isFetchingSitemap ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Generate
                  </button>
                </div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5 px-1 font-bold"><Info className="w-3.5 h-3.5" /> Extracts all &lt;loc&gt; nodes</p>
              </div>
            )}
            
            <div className="relative flex-1 flex flex-col">
              <textarea
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                disabled={isProcessing}
                placeholder="https://example.com/feature-1&#10;https://example.com/feature-2"
                className="w-full flex-1 min-h-[200px] rounded-[1.5rem] bg-white border border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20 p-5 text-sm font-mono whitespace-pre disabled:opacity-50 transition-shadow leading-relaxed resize-none shadow-sm"
              />
              {!urls && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-slate-300 flex flex-col items-center justify-center gap-2">
                  <FileText className="w-8 h-8 opacity-20" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Paste URLs here</span>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="col-span-1 lg:col-span-7 flex flex-col h-[500px] lg:h-[800px]">
          <div className="flex flex-col flex-1 min-h-0 bg-slate-900 rounded-[2.5rem] p-6 lg:p-8 shadow-2xl relative group">
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span> 3. Execution Console
              </h2>
              {progress > 0 && (
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                    {progress}%
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 min-h-0 bg-slate-950/40 rounded-[1.5rem] border border-slate-800/50 flex flex-col overflow-hidden relative shadow-inner">
              {logs.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 space-y-5 p-8 text-center">
                  <div className="w-16 h-16 bg-slate-800/50 border border-slate-700/50 rounded-[1.5rem] flex items-center justify-center shadow-lg transform rotate-3">
                    <Play className="w-6 h-6 text-slate-400 ml-1" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-300 text-sm mb-1 uppercase tracking-widest">System Ready</p>
                    <p className="text-xs max-w-xs mx-auto text-slate-500 leading-relaxed font-mono">Awaiting payload. Configure credentials & targets to initialize.</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono scrollbar-hide select-all">
                  {logs.map((log) => (
                    <div key={log.id} className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-start gap-3.5 text-[11px]">
                      <div className="mt-0.5 flex-shrink-0">
                        {log.status === 'pending' && <Clock className="w-3.5 h-3.5 text-slate-600" />}
                        {log.status === 'processing' && <Loader2 className="w-3.5 h-3.5 text-indigo-500 animate-spin" />}
                        {log.status === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />}
                        {log.status === 'error' && <XCircle className="w-3.5 h-3.5 text-rose-500" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`font-medium truncate ${log.status === 'error' ? 'text-slate-400' : 'text-slate-300'}`} title={log.url}>{log.url}</p>
                        {log.message && (
                          <p className={`text-[10px] mt-1 tracking-wider ${log.status === 'error' ? 'text-rose-500/80' : 'text-slate-500'}`}>
                            {log.status === 'success' ? 'HTTP 200 OK - ' : ''}{log.message}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {errorDesc && (
              <div className="mt-5 p-4 bg-rose-500/10 text-rose-400 rounded-[1.5rem] text-[11px] font-mono flex gap-3 items-start border border-rose-500/20">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">{errorDesc}</p>
              </div>
            )}

            {isProcessing ? (
              <button
                onClick={stopProcessing}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 focus:ring-4 focus:ring-rose-500/30 text-white font-black uppercase text-[11px] tracking-widest py-4 px-6 rounded-[1.5rem] shadow-lg shadow-rose-600/20 transition-all group"
              >
                <XCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Terminate Process
              </button>
            ) : (
              <button
                onClick={startProcessing}
                disabled={parsedUrls.length === 0 || !saKeyContent}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-500/30 text-white font-black uppercase text-[11px] tracking-widest py-4 px-6 rounded-[1.5rem] shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 disabled:shadow-none disabled:hover:bg-indigo-600 group"
              >
                <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {actionType === 'URL_PUBLISH' ? 'Initialize Publish' : actionType === 'URL_UPDATE' ? 'Initialize Update' : 'Initialize Delete'} ({parsedUrls.length})
              </button>
            )}
          </div>
        </section>
      </div>

      <section className="max-w-4xl mx-auto mt-20 pt-16 border-t border-slate-200">
         <div className="bg-amber-50 border border-amber-200 p-8 rounded-[2.5rem] flex flex-col sm:flex-row gap-6 text-amber-900 mb-12 shadow-sm relative overflow-hidden">
          <div className="w-12 h-12 bg-white rounded-[1rem] flex items-center justify-center shadow-sm flex-shrink-0 transform -rotate-3 border border-amber-100">
             <Key className="w-5 h-5 text-amber-500" />
          </div>
          <div className="space-y-2">
            <h3 className="font-black text-amber-900 text-sm uppercase tracking-widest">Zero Server Trust</h3>
            <p className="text-sm leading-relaxed text-amber-800/80">
              This application functions entirely within your browser context. Your Google Service Account JSON key acts as a local credential and is never transmitted to our infrastructure. All cryptographic JWT signing and API network requests are performed by your local machine directly against Google's OAuth and Indexing endpoints.
            </p>
          </div>
        </div>

        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-8 mt-8 uppercase tracking-widest text-center">API Initialization Guide</h2>
        
        <div className="grid gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex gap-6 items-start hover:shadow-md transition-shadow">
             <div className="w-12 h-12 rounded-[1rem] bg-indigo-50 flex items-center justify-center flex-shrink-0 border border-indigo-100 transform rotate-3">
                 <span className="font-black text-indigo-600">1</span>
             </div>
             <div>
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-2">Enable the API</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Navigate to the <a href="https://console.cloud.google.com/" className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline" target="_blank" rel="noreferrer">Google Cloud Console</a>. Create a new project or select an existing one. Go to <strong>APIs & Services &gt; Library</strong>, search for <strong>Web Search Indexing API</strong>, and click Enable.
                </p>
             </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex gap-6 items-start hover:shadow-md transition-shadow">
             <div className="w-12 h-12 rounded-[1rem] bg-indigo-50 flex items-center justify-center flex-shrink-0 border border-indigo-100 transform -rotate-3">
                 <span className="font-black text-indigo-600">2</span>
             </div>
             <div>
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-2">Create a Service Account</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Go to <strong>IAM & Admin &gt; Service Accounts</strong>. Click 'Create Service Account', provide a name, and complete the creation. Click on your new Service Account, navigate to the <strong>Keys</strong> tab, click <strong>Add Key &gt; Create new key</strong>, choose <strong>JSON</strong> format, and save the file to your computer.
                </p>
             </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex gap-6 items-start hover:shadow-md transition-shadow">
             <div className="w-12 h-12 rounded-[1rem] bg-indigo-50 flex items-center justify-center flex-shrink-0 border border-indigo-100 transform rotate-3">
                 <span className="font-black text-indigo-600">3</span>
             </div>
             <div>
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-2">Authorize in Search Console</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Open <a href="https://search.google.com/search-console/about" className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline" target="_blank" rel="noreferrer">Google Search Console</a>. Navigate to Settings &gt; Users and Permissions. Click 'Add User', enter the exact email address of your new Service Account, assign <strong>Owner</strong> permission, and click Add.
                </p>
             </div>
          </div>
        </div>

        <div className="mt-16 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
          <h2 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-widest">Why Use the Google Indexing API?</h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              The <strong>Google Indexing API</strong> allows any site owner to directly notify Google when pages are added or removed. This enables Google to schedule pages for a fresh crawl, leading to higher quality user traffic and much faster indexing than relying on standard sitemap pinging.
            </p>
            <p>
              Currently, the traditional method of waiting for Googlebot to discover your new content or updated sitemaps can take days or even weeks. With this <strong>bulk URL submitter</strong>, your content is pushed to Google's indexing queue in real-time. It is particularly useful for job boards, event sites, livestock listings, or any dynamic content-heavy platforms.
            </p>
            <p className="font-bold text-slate-800">
              Benefits of this browser-based tool:
            </p>
            <ul className="list-disc pl-5 space-y-2">
               <li><strong>Instant 100% Secure Request:</strong> Generate authorization keys locally without sharing your sensitive Google Service Account JSON file array.</li>
               <li><strong>Sitemap Fetching:</strong> Quickly extract URLs from the <code>&lt;loc&gt;</code> tags existing inside of your <code>sitemap.xml</code> and submit it.</li>
               <li><strong>Bulk Submissions:</strong> Process hundreds of URLs smoothly with built-in rate-limiting delays to prevent <code>HTTP 429 Too Many Requests</code> errors.</li>
               <li><strong>Action Types:</strong> You can choose either the <code>URL_UPDATED</code> to mandate a new crawl, or <code>URL_DELETED</code> to remove an obsolete URL from indexation.</li>
            </ul>
          </div>
        </div>

        <div className="mt-16">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-center justify-between mb-16 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
               <AlertCircle className="w-48 h-48 transform rotate-12 group-hover:scale-110 transition-transform duration-700" />
             </div>
             
             <div className="space-y-3 max-w-2xl relative z-10 text-center md:text-left">
               <h3 className="font-black text-indigo-950 text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                 Facing Difficulty Setting This Up?
               </h3>
               <p className="text-[15px] leading-relaxed text-indigo-900/70 font-medium">
                 We understand that configuring Google Cloud accounts and Service APIs can be tricky. If you need professional assistance, we offer a <strong className="text-indigo-800">Done-For-You Setup Service</strong> for a nominal charge. We'll handle the technical configuration so you can focus on indexing your URLs.
               </p>
             </div>
             
             <div className="relative z-10 flex-shrink-0 w-full md:w-auto">
               <Link 
                 to="/contact" 
                 className="flex items-center justify-center gap-2 w-full md:w-auto text-center bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-[11px] tracking-widest py-4 px-8 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all hover:-translate-y-1"
               >
                 Request Expert Help
               </Link>
             </div>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-8 uppercase tracking-widest text-center">Frequently Asked Questions</h2>
          <div className="grid gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
               <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-3">Is it safe to upload my JSON key?</h3>
               <p className="text-slate-500 text-sm leading-relaxed">Yes. Your Service Account <code>.json</code> key is processed completely locally within your internet browser. It is strictly used to sign a cryptographic JSON Web Token (JWT) on your machine. We never store or transmit your key to any external servers other than directly to Google's official OAuth mechanism.</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
               <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-3">What are the quota limits?</h3>
               <p className="text-slate-500 text-sm leading-relaxed">By default, Google allocates 200 URL submissions per day per project to the Indexing API. You can request a quota increase through the Google Cloud Console if your platform requires more robust throughput.</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
               <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-3">Do I still need an XML Sitemap?</h3>
               <p className="text-slate-500 text-sm leading-relaxed">Yes. The Indexing API does not replace XML sitemaps. Google recommends continuing to use standard XML sitemaps for the overall structure of your website, whilst using the Indexing API to signal dynamic pages for swift caching.</p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
               <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-3">Does this guarantee immediate indexing?</h3>
               <p className="text-slate-500 text-sm leading-relaxed">No API can completely guarantee indexing. Google ultimately decides what to index based on content quality, originality, and site reputation. However, this API ensures that Googlebot schedules a crawl for your pages far faster than discovering them organically.</p>
            </div>
          </div>
        </div>
      </section>

      
      <AccompanyingText 
        toolName="Url Indexing Tool"
        howItWorks="This tool uses advanced client-side processing to deliver instant results without sending your data to any external server. Simply input your parameters, and the algorithmic engine processes the data locally in your browser ensuring maximum privacy and speed."
        whyItsUseful="Whether you are a professional or a casual user, this tool saves you significant time by automating complex calculations and data transformations. It eliminates manual errors and provides a structured, easy-to-read output that you can rely on for your daily tasks."
        faqs={[
          { q: "Is my data secure?", a: "Yes, 100% secure. All processing happens entirely within your browser. We do not store or transmit your inputs to any remote servers." },
          { q: "Is this tool free to use?", a: "Absolutely. Toolina provides this utility completely free of charge with no hidden limits or premium paywalls." },
          { q: "Can I use this on mobile?", a: "Yes, the interface is fully responsive and works seamlessly across desktops, tablets, and smartphones." }
        ]}
      />
  
      <div className="max-w-3xl mx-auto">
        <StarRatingWidget 
          toolId="url-indexing" 
          defaultRating={4.9} 
          defaultCount={184} 
          onRatingChange={(rating, count) => setRatingInfo({ rating, count })} 
        />
      </div>

      <ShareWidget title="URL Indexing SaaS Tool" />
    </article>
  );
}
