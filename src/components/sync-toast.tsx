'use client';

import { useEffect, useState } from 'react';
import { db } from '../db/DexieDB';

export default function SyncToast() {
  const [pendingCount, setPendingCount] = useState<number>(0);

  useEffect(() => {
    // Setup a standard interval loop to monitor offline data row counts dynamically
    const pollQueueSize = async () => {
      try {
        const count = await db.sync_queue.where('status').equals('pending').count();
        setPendingCount(count);
      } catch (err) {
        console.error('Failed to poll local transaction database queue volume:', err);
      }
    };

    pollQueueSize();
    const interval = setInterval(pollQueueSize, 3000); // Check database logs every 3 seconds
    return () => clearInterval(interval);
  }, []);

  if (pendingCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 bg-[#16161e] border border-[#d4af37] p-4 shadow-2xl max-w-sm animate-fade-in font-mono text-xs text-[#f4f4f5] rounded-sm">
      <div className="flex items-center space-x-3">
        <div className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
        <div>
          <p className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#d4af37]">
            Local Sync Queue Active
          </p>
          <p className="text-[#a1a1aa] text-[9px] uppercase mt-1 tracking-wider leading-relaxed">
            ⚡ {pendingCount} Transaction secured in client storage ledger. Will auto-sync on connection pings.
          </p>
        </div>
      </div>
    </div>
  );
}
