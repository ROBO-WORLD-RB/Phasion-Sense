'use client';

import { useEffect, useState } from 'react';

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  useEffect(() => {
    setHasMounted(true);
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!hasMounted || isOnline) return null;

  return (
    <div className="w-full bg-gradient-to-r from-[#d4af37]/90 via-[#e5c158] to-[#d4af37]/90 text-[#09090b] text-[10px] font-mono tracking-[0.25em] uppercase py-2.5 text-center transition-all duration-500 animate-fade-in z-50 sticky top-0 shadow-[0_2px_20px_rgba(212,175,55,0.25)] flex items-center justify-center space-x-2">
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#09090b] animate-ping" />
      <span>Running in Offline-First Mode — Local Sync Guard Active</span>
    </div>
  );
}
