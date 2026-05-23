'use client';

import { useSearchParams } from 'next/navigation';
import { useCatalogStore } from '../../store/catalogStore'; // Core catalog store path
import FittingCanvas from '../../components/try-on/fitting-canvas';
import { formatMinorToCedi } from '../../utils/currency';
import Link from 'next/link';
import { Suspense } from 'react';

// High-fidelity premium contemporary African fashion alternative CDN image (Unsplash curated lookbook asset)
const PREMIUM_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop';

/**
 * Resolves a dynamic base URL path matrix for product images.
 * Prepend absolute remote host domain for relative API asset paths.
 */
const resolveProductImage = (url: string | undefined): string => {
  if (!url) return PREMIUM_FALLBACK_IMAGE;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://api-hackathon.codedematrixtech.com${url.startsWith('/') ? '' : '/'}${url}`;
};

function TryOnPageContent() {
  const searchParams = useSearchParams();
  const targetId = searchParams.get('item_id');
  const itemsCache = useCatalogStore((state) => state.items);

  const matchedGarment = itemsCache.find((p) => p.id === targetId);

  const resolvedImageUrl = resolveProductImage(matchedGarment?.image_urls[0]);

  return (
    <main className="min-h-screen bg-[#09090b] text-[#f4f4f5] px-4 md:px-24 py-16 font-mono text-xs">
      <div className="mb-12 border-b border-[#16161e] pb-6 flex flex-col md:flex-row justify-between items-start md:items-baseline">
        <div>
          <Link href="/" className="text-[#a1a1aa] hover:text-[#d4af37] transition-colors uppercase tracking-widest text-[10px] block mb-2">
            ← Return To Collection
          </Link>
          <h1 className="font-sans text-2xl md:text-4xl font-light tracking-tight uppercase text-[#f4f4f5]">
            Virtual Fitting Suite
          </h1>
        </div>
        <span className="text-[#27272a] uppercase tracking-widest text-[10px] mt-4 md:mt-0">
          Module // VTO-IDM-VTON
        </span>
      </div>

      {matchedGarment ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Left Column: Selected Product Meta Spec */}
          <div className="bg-[#16161e] border border-[#27272a] p-6 flex flex-col">
            <div className="aspect-[3/4] w-full bg-[#09090b] overflow-hidden border border-[#27272a] mb-6">
              <img 
                src={resolvedImageUrl} 
                alt={matchedGarment.name} 
                className="w-full h-full object-cover filter grayscale contrast-125"
                onError={(e) => {
                  // Defensively Safe Image Fallback Engine (The 404 Counter-Measure)
                  const target = e.target as HTMLImageElement;
                  if (target.src !== PREMIUM_FALLBACK_IMAGE) {
                    target.src = PREMIUM_FALLBACK_IMAGE;
                  }
                }}
              />
            </div>
            <h2 className="font-sans text-lg font-medium tracking-wide mb-1">{matchedGarment.name}</h2>
            <p className="text-[#d4af37] font-semibold text-sm mb-4">{formatMinorToCedi(matchedGarment.price_minor)}</p>
            <div className="border-t border-[#27272a] pt-4 space-y-2 text-[#a1a1aa]">
              <p>TRACK TARGET: <span className="text-[#f4f4f5]">amina-stitches</span></p>
              <p>SKU HARNESS: <span className="text-[#f4f4f5]">{matchedGarment.id}</span></p>
              <p>AVAILABILITY: <span className={matchedGarment.in_stock ? 'text-green-400' : 'text-red-400'}>{matchedGarment.in_stock ? 'In Stock' : 'Out of Stock'}</span></p>
            </div>
          </div>

          {/* Right Columns: The AI Generation Interactive Canvas Canvas */}
          <div className="lg:col-span-2">
            <FittingCanvas 
              garmentId={matchedGarment.id} 
              garmentImageUrl={resolvedImageUrl} 
            />
          </div>
        </div>
      ) : (
        <div className="w-full text-center py-24 border border-dashed border-[#27272a]">
          <p className="text-[#a1a1aa] uppercase tracking-widest mb-4">No Garment Selected For AI Try-On Parsing</p>
          <Link href="/" className="px-6 py-3 bg-[#f4f4f5] text-[#09090b] font-sans text-[11px] font-bold tracking-widest uppercase hover:bg-[#d4af37] transition-colors">
            Browse Storefront
          </Link>
        </div>
      )}
    </main>
  );
}

export default function TryOnPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#09090b] text-[#f4f4f5] px-4 md:px-24 py-16 font-mono text-xs flex items-center justify-center">
        <p className="animate-pulse tracking-widest text-[#a1a1aa] uppercase">Loading Fitting Suite...</p>
      </main>
    }>
      <TryOnPageContent />
    </Suspense>
  );
}
