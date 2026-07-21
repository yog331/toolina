import React, { useState, useEffect } from 'react';
import { ArrowDownToLine, Share, X, CheckCircle2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const PWABanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [installedSuccessfully, setInstalledSuccessfully] = useState<boolean>(false);

  useEffect(() => {
    // 1. Check if already running in standalone mode (installed PWA)
    const isInStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone || 
      document.referrer.includes('android-app://');
    
    setIsStandalone(isInStandaloneMode);
    if (isInStandaloneMode) return;

    // 2. Check if user dismissed the banner recently
    const isDismissed = localStorage.getItem('pwa_banner_dismissed') === 'true';
    if (isDismissed) return;

    // 3. Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleMobile = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleMobile);

    // 4. Listen for beforeinstallprompt event (Android / Desktop Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Wait slightly to show banner to not disrupt immediate user experience
      setTimeout(() => {
        setShowBanner(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, if not standalone and not dismissed, show the prompt with a delay
    if (isAppleMobile && !isInStandaloneMode && !isDismissed) {
      setTimeout(() => {
        setShowBanner(true);
      }, 5000);
    }

    // Handle post-installation event
    const handleAppInstalled = () => {
      console.log('Toolina was successfully installed!');
      setInstalledSuccessfully(true);
      setShowBanner(false);
      localStorage.setItem('pwa_banner_dismissed', 'true');
      setTimeout(() => setInstalledSuccessfully(false), 5000);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Hide our custom banner UI
    setShowBanner(false);
    
    // Show the native install prompt
    await deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and cannot use it again, discard it
    setDeferredPrompt(null);
    
    if (outcome === 'accepted') {
      setInstalledSuccessfully(true);
      localStorage.setItem('pwa_banner_dismissed', 'true');
      setTimeout(() => setInstalledSuccessfully(false), 5000);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    // Keep it dismissed for 7 days
    localStorage.setItem('pwa_banner_dismissed', 'true');
  };

  if (isStandalone) return null;

  return (
    <>
      {/* Installation Success Alert */}
      {installedSuccessfully && (
        <div id="pwa-success-toast" className="fixed bottom-6 right-6 z-[100] max-w-sm bg-teal-900 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-teal-500/30 animate-bounce">
          <CheckCircle2 className="w-6 h-6 text-teal-400 flex-shrink-0" />
          <div>
            <p className="font-bold text-sm">Toolina Installed!</p>
            <p className="text-xs text-teal-200">You can now access all tools from your home screen.</p>
          </div>
        </div>
      )}

      {/* Subtle PWA Add to Home Screen Banner */}
      {showBanner && (
        <div id="pwa-install-banner" className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-[90] bg-slate-900 text-white rounded-3xl p-5 shadow-2xl border border-slate-800/80 backdrop-blur-md flex flex-col md:flex-row gap-4 justify-between items-start md:items-center transition-all duration-300">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></span>
              <h4 className="text-sm font-black tracking-tight font-display text-slate-100">
                Install Toolina App
              </h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isIOS 
                ? "Add Toolina to your home screen for quick offline access and high-speed utility tools."
                : "Get a faster, native-like experience on your mobile with full offline utility calculations."
              }
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t border-slate-800/60 pt-3 md:pt-0 md:border-t-0">
            <button 
              id="pwa-dismiss-btn"
              onClick={handleDismiss}
              className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            >
              Later
            </button>
            
            {isIOS ? (
              <div className="relative group">
                <button 
                  id="pwa-ios-instructions-btn"
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Share className="w-3.5 h-3.5" />
                  How to Install
                </button>
                {/* iOS Instructions tooltip */}
                <div className="absolute bottom-full right-0 mb-3 w-64 bg-slate-800 text-slate-100 p-3 rounded-2xl shadow-xl text-xs space-y-2 border border-slate-700 pointer-events-none group-focus-within:block group-hover:block hidden">
                  <p className="font-bold text-teal-400">iOS Installation Steps:</p>
                  <ol className="list-decimal pl-4 space-y-1 text-slate-300">
                    <li>Tap the <span className="inline-block bg-slate-700 px-1 rounded"><Share className="w-3 h-3 inline pb-0.5" /> Share</span> button.</li>
                    <li>Scroll down and select <span className="font-semibold text-white">"Add to Home Screen"</span>.</li>
                    <li>Tap <span className="font-bold text-teal-400">Add</span> in the top right corner.</li>
                  </ol>
                </div>
              </div>
            ) : (
              <button 
                id="pwa-install-action-btn"
                onClick={handleInstallClick}
                disabled={!deferredPrompt}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ArrowDownToLine className="w-3.5 h-3.5" />
                Install
              </button>
            )}

            <button 
              id="pwa-close-icon-btn"
              onClick={handleDismiss}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-all hidden md:block"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PWABanner;
