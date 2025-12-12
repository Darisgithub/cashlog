import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallCTA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('pwa_install_dismissed') === '1') return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setVisible(false);
    setDeferredPrompt(null);
    console.log('PWA install choice', choice);
  };

  const handleClose = () => {
    setVisible(false);
    // remember dismissal for 24 hours
    const expires = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem('pwa_install_dismissed', '1');
    localStorage.setItem('pwa_install_dismissed_at', String(expires));
  };

  // cleanup dismissal after expiry (simple)
  useEffect(() => {
    const at = localStorage.getItem('pwa_install_dismissed_at');
    if (at && Date.now() > Number(at)) {
      localStorage.removeItem('pwa_install_dismissed');
      localStorage.removeItem('pwa_install_dismissed_at');
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:right-6 sm:left-auto z-50 pointer-events-none">
      <div className="mx-auto sm:mx-0 max-w-xl sm:max-w-sm w-full pointer-events-auto transform transition-all duration-300 ease-out">
        <div className="flex items-center gap-3 bg-white/95 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-lg">
          <div className="flex-shrink-0 p-2 bg-blue-600 text-white rounded-md">
            <Download size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">Install CashLog</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">Tambahkan ke layar utama untuk akses cepat</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
              aria-label="Install app"
            >
              Install
            </button>
            <button onClick={handleClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-md" aria-label="Close install prompt">
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
