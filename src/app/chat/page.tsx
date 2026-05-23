'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import StylistChat from '../../components/try-on/stylist-chat';

function ChatPageContent() {
  return (
    <main className="min-h-screen bg-[#09090b] text-[#f4f4f5] px-4 md:px-24 py-16 font-mono text-xs flex flex-col justify-between">
      {/* Immersive Atelier Header */}
      <div className="mb-12 border-b border-[#16161e] pb-6 flex flex-col md:flex-row justify-between items-start md:items-baseline flex-shrink-0">
        <div>
          <Link href="/" className="text-[#a1a1aa] hover:text-[#d4af37] transition-colors uppercase tracking-widest text-[9px] block mb-2">
            ← Return To Collection
          </Link>
          <h1 className="font-sans text-2xl md:text-4xl font-light tracking-tight uppercase text-[#f4f4f5]">
            AI Styling Atelier
          </h1>
        </div>
        <span className="text-[#d4af37] uppercase tracking-widest text-[9px] mt-4 md:mt-0 bg-[#16161e] px-3.5 py-1.5 border border-[#d4af37]/25 rounded-sm">
          Interactive Session // Nemotron-Nano
        </span>
      </div>

      {/* Main Conversation Container */}
      <div className="flex-1 max-w-5xl mx-auto w-full flex flex-col justify-center items-stretch my-6">
        <div className="bg-[#16161e] border border-[#272730] p-1 shadow-2xl rounded-sm">
          {/* We render a beautiful, large-viewport Stylist Chat */}
          <StylistChat />
        </div>
      </div>

      {/* Editorial Luxury Branding Footer */}
      <div className="border-t border-[#16161e] pt-8 mt-auto flex flex-col md:flex-row justify-between items-center text-[#71717a] text-[8px] uppercase tracking-widest flex-shrink-0 space-y-2 md:space-y-0">
        <span>© 2026 Phasion Sense // Private Consulting Suite</span>
        <span>Secured Uplink Active</span>
      </div>
    </main>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#09090b] text-[#f4f4f5] px-4 md:px-24 py-16 font-mono text-xs flex items-center justify-center">
        <p className="animate-pulse tracking-widest text-[#a1a1aa] uppercase">Opening Atelier Session...</p>
      </main>
    }>
      <ChatPageContent />
    </Suspense>
  );
}
