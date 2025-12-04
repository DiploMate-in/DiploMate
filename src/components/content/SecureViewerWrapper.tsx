import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { AlertTriangle, Ban } from 'lucide-react';

interface SecureViewerWrapperProps {
  children: React.ReactNode;
  watermarkText: string;
}

export const SecureViewerWrapper = ({ children, watermarkText }: SecureViewerWrapperProps) => {
  const [isBlurred, setIsBlurred] = useState(false);
  const [isTampered, setIsTampered] = useState(false);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Disable Right Click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // 2. Disable Keyboard Shortcuts (Preventative)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Windows Snipping Tool (Win + Shift + S)
      if (e.key === 'S' && e.shiftKey && (e.metaKey || e.getModifierState('OS'))) {
         const appRoot = document.getElementById('root');
         if (appRoot) appRoot.style.filter = 'blur(20px) grayscale(100%)';
         
         setIsBlurred(true);
         handleScreenshotAttempt();
         e.preventDefault();
         
         setTimeout(() => {
             if (appRoot) appRoot.style.filter = 'none';
             setIsBlurred(false);
         }, 3000);
         return false;
      }

      // Mac Screenshots (Cmd + Shift + 3 or 4)
      if ((e.key === '3' || e.key === '4') && e.shiftKey && e.metaKey) {
         const appRoot = document.getElementById('root');
         if (appRoot) appRoot.style.filter = 'blur(20px) grayscale(100%)';

         setIsBlurred(true);
         handleScreenshotAttempt();
         e.preventDefault();
         
         setTimeout(() => {
             if (appRoot) appRoot.style.filter = 'none';
             setIsBlurred(false);
         }, 3000);
         return false;
      }

      // Ctrl+P (Print), Ctrl+S (Save)
      if (
        (e.ctrlKey && (e.key === 'p' || e.key === 's' || e.key === 'u' || e.key === 'c')) ||
        (e.metaKey && (e.key === 'p' || e.key === 's' || e.key === 'u' || e.key === 'c')) ||
        (e.ctrlKey && e.shiftKey && e.key === 's')
      ) {
        e.preventDefault();
        const appRoot = document.getElementById('root');
        if (appRoot) appRoot.style.filter = 'blur(20px) grayscale(100%)';
        
        setIsBlurred(true);
        handleScreenshotAttempt();
        
        setTimeout(() => {
             if (appRoot) appRoot.style.filter = 'none';
             setIsBlurred(false);
         }, 3000);
        return false;
      }
    };

    // 3. The "Nuke" Switch & Clipboard Poisoning (Reactive)
    const handleKeyUp = (e: KeyboardEvent) => {
        // Print Screen
        if (e.key === 'PrintScreen' || e.keyCode === 44) {
            // Layer 2: Synchronous DOM Manipulation (The "Nuke" Switch)
            const appRoot = document.getElementById('root');
            if (appRoot) {
                appRoot.style.transition = 'none'; // Disable transition for instant effect
                appRoot.style.filter = 'blur(20px) grayscale(100%)';
            }

            setIsBlurred(true);
            handleScreenshotAttempt();

            // Layer 3: Clipboard Poisoning
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(`⚠️ COPYRIGHT VIOLATION LOGGED: User ID [${watermarkText}] ⚠️`)
                    .catch(err => console.error('Clipboard write failed', err));
            }

            // Reset after punishment
            setTimeout(() => {
                if (appRoot) {
                    appRoot.style.transition = '';
                    appRoot.style.filter = 'none';
                }
                setIsBlurred(false);
            }, 3000);
        }
    };

    // Prevent Copy
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      if (e.clipboardData) {
        e.clipboardData.setData('text/plain', 'Security Violation: Copying is prohibited.');
      }
      handleScreenshotAttempt();
    };

    // 4. Detect Focus Loss
    const handleVisibilityChange = () => {
      if (document.hidden) setIsBlurred(true);
    };

    const handleWindowBlur = () => setIsBlurred(true);
    const handleWindowFocus = () => setIsBlurred(false);

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [watermarkText]);

  // 5. Mutation Observer for Tamper Protection
  useEffect(() => {
    if (!watermarkRef.current || !containerRef.current) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            const removedNodes = Array.from(mutation.removedNodes);
            const isWatermarkRemoved = removedNodes.some(
                (node) => node === watermarkRef.current || (node as HTMLElement).id === 'secure-watermark'
            );
            if (isWatermarkRemoved) {
                setIsTampered(true);
            }
        }
        if (mutation.type === 'attributes' && mutation.target === watermarkRef.current) {
            const target = mutation.target as HTMLElement;
            if (target.style.display === 'none' || target.style.opacity === '0' || target.style.visibility === 'hidden') {
                setIsTampered(true);
            }
        }
      });
    });

    observer.observe(containerRef.current, { childList: true, subtree: true });
    observer.observe(watermarkRef.current, { attributes: true, attributeFilter: ['style', 'class'] });

    return () => observer.disconnect();
  }, []);

  const handleScreenshotAttempt = () => {
    toast.error("Security Alert: Screenshots are prohibited.", {
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
        duration: 3000
    });
  };

  if (isTampered) {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 text-red-600 p-8 text-center z-[9999] fixed inset-0">
              <Ban className="h-16 w-16 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Security Violation Detected</h2>
              <p>The document viewer has been tampered with. Access has been revoked.</p>
              <p className="text-sm mt-4">Please refresh the page to restore access.</p>
          </div>
      );
  }

  return (
    <div 
        ref={containerRef}
        className="relative w-full h-full bg-slate-100 select-none overflow-hidden group"
    >
      <style>
        {`
          @media print {
            body { display: none !important; }
          }
          @keyframes drift {
            0% { transform: translate(0, 0); }
            25% { transform: translate(10px, 10px); }
            50% { transform: translate(0, 20px); }
            75% { transform: translate(-10px, 10px); }
            100% { transform: translate(0, 0); }
          }
          @keyframes breathe {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
        `}
      </style>

      {/* Blur Overlay */}
      {isBlurred && (
        <div className="absolute inset-0 z-[200] bg-white/95 backdrop-blur-2xl flex items-center justify-center">
          <div className="text-center p-6">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Secure View Active</h3>
            <p className="text-slate-600">
              Content is hidden when the window loses focus.
            </p>
          </div>
        </div>
      )}

      {/* Layer 1: The "Drifting" Watermark (Screenshot Killer) */}
      <div 
        id="secure-watermark"
        ref={watermarkRef}
        className="absolute inset-0 pointer-events-none z-[100] overflow-hidden flex flex-wrap content-start justify-start p-0 select-none"
        style={{ 
            mixBlendMode: 'difference',
            animation: 'drift 20s infinite ease-in-out alternate' 
        }}
      >
        {Array.from({ length: 50 }).map((_, i) => (
            <div 
                key={i} 
                className="w-64 h-64 flex items-center justify-center transform -rotate-45"
                style={{ animation: `breathe ${3 + (i % 3)}s infinite ease-in-out` }}
            >
                <div className="text-center">
                    <p className="text-xl font-black text-slate-500/50 whitespace-nowrap">{watermarkText}</p>
                    <p className="text-sm font-bold text-slate-500/30 whitespace-nowrap">{new Date().toLocaleDateString()}</p>
                </div>
            </div>
        ))}
      </div>

      {/* Content Container */}
      <div className={`w-full h-full transition-opacity duration-100 ${isBlurred ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>
    </div>
  );
};
