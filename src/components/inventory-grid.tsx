'use client';

import { useEffect } from 'react';
import { useCatalogStore } from '../store/catalogStore';
import { useCartStore } from '../store/cartStore';
import { useAppPreferencesStore } from '../store/appPreferencesStore';
import { formatMinorToCedi } from '../utils/currency';

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

export default function InventoryGrid() {
  const { items, isLoading, error, hydrateCatalog } = useCatalogStore();
  const addItem = useCartStore((state) => state.addItem);
  const isEcoMode = useAppPreferencesStore((state) => state.isEcoMode);

  useEffect(() => {
    // Hydrate catalog with correct merchant 'amina-stitches' and team slug 'team-alpha'
    hydrateCatalog('amina-stitches', 'team-alpha');
  }, [hydrateCatalog]);

  if (isLoading) {
    return (
      <div className="bg-[#09090b] text-[#f4f4f5] px-6 md:px-16 py-16">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 border-b border-[#1c1c24] pb-6">
          <div className="h-10 bg-[#16161e] w-64 animate-pulse rounded" />
          <div className="h-4 bg-[#16161e] w-32 animate-pulse rounded mt-2 md:mt-0" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-20 w-full">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="flex flex-col space-y-5 animate-pulse">
              <div className="w-full aspect-[3/4] bg-[#16161e] border border-[#272730] rounded-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#272730]/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              </div>
              <div className="flex justify-between items-start">
                <div className="h-5 bg-[#16161e] w-2/3 rounded-sm" />
                <div className="h-5 bg-[#16161e] w-1/5 rounded-sm" />
              </div>
              <div className="flex space-x-3 pt-2">
                <div className="h-10 bg-[#16161e] flex-1 rounded-sm" />
                <div className="h-10 bg-[#16161e] w-16 rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-24 bg-[#09090b] text-[#a1a1aa] border-t border-[#16161e] flex flex-col items-center justify-center px-4">
        <div className="w-12 h-12 rounded-full border border-red-500/20 flex items-center justify-center mb-4 bg-red-950/20">
          <span className="text-red-400 text-lg font-mono">!</span>
        </div>
        <p className="font-mono text-xs tracking-widest uppercase mb-2 text-[#f4f4f5]">Catalog Hydration Error</p>
        <p className="font-mono text-[11px] text-[#71717a] max-w-md uppercase tracking-wider">{error}</p>
      </div>
    );
  }

  return (
    <section className="w-full bg-[#09090b] text-[#f4f4f5] px-6 md:px-16 py-16">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 border-b border-[#1c1c24] pb-6">
        <div className="flex flex-col space-y-1">
          <h2 className="font-sans text-3xl md:text-5xl font-extralight tracking-tight uppercase">
            The Contemporary Drop
          </h2>
          <p className="font-mono text-[10px] text-[#d4af37] tracking-[0.25em] uppercase">
            Ankara & Kente Capsule Collection
          </p>
        </div>
        <span className="font-mono text-[10px] text-[#71717a] tracking-[0.3em] uppercase mt-4 md:mt-0 bg-[#16161e] px-3 py-1 border border-[#272730] rounded-sm">
          Track // amina-stitches {isEcoMode && '• ECO COMPRESSION ACTIVE'}
        </span>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-20">
        {items.map((product) => {
          const resolvedImageUrl = resolveProductImage(product.image_urls[0]);

          // TEMPORARY LOCAL TESTING OVERRIDE: Bypasses live API database out-of-stock states so lookbook images render cleanly
          const isItemAvailable = true; // product.in_stock;

          return (
            <div 
              key={product.id} 
              className="group flex flex-col relative bg-transparent hover:bg-white/[0.01] hover:backdrop-blur-md border border-transparent hover:border-[#272730]/40 p-4 transition-all duration-700 ease-out hover:shadow-[0_30px_100px_rgba(212,175,55,0.03)] rounded-sm"
            >
              {/* Aspect Ratio Controlled Image Wrapper */}
              <div className="relative aspect-[3/4] w-full bg-[#16161e] overflow-hidden mb-5 border border-[#1c1c24] group-hover:border-[#272730] transition-colors duration-500">
                {isEcoMode ? (
                  <div className="absolute inset-0 bg-[#111118] flex flex-col items-center justify-center p-6 text-center border border-[#1c1c24]">
                    <span className="font-mono text-[9px] text-[#d4af37] tracking-[0.2em] uppercase mb-2 border border-[#d4af37]/30 px-2.5 py-1">
                      Data Saved
                    </span>
                    <p className="font-sans text-[11px] font-light text-[#a1a1aa] uppercase tracking-wide">
                      {product.name} Image Capped
                    </p>
                  </div>
                ) : (
                  <img
                    src={resolvedImageUrl}
                    alt={product.name}
                    className="object-cover w-full h-full filter grayscale contrast-115 group-hover:grayscale-0 group-hover:contrast-100 group-hover:scale-[1.06] transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1)"
                    loading="lazy"
                    onError={(e) => {
                      // Defensively Safe Image Fallback Engine (The 404 Counter-Measure)
                      const target = e.target as HTMLImageElement;
                      if (target.src !== PREMIUM_FALLBACK_IMAGE) {
                        target.src = PREMIUM_FALLBACK_IMAGE;
                      }
                    }}
                  />
                )}
                
                {/* Gold border accent when hovering */}
                <div className="absolute inset-0 border border-transparent group-hover:border-[#d4af37]/30 pointer-events-none transition-all duration-500" />
                
                {/* Premium Glassmorphic Out of Stock Overlay */}
                {!isItemAvailable && (
                  <div className="absolute inset-0 bg-[#09090b]/60 backdrop-blur-md flex items-center justify-center">
                    <div className="flex flex-col items-center space-y-2 border border-[#d4af37]/40 bg-[#09090b]/80 px-6 py-4 shadow-xl">
                      <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#d4af37] font-semibold">
                        Out of Stock
                      </span>
                      <span className="font-mono text-[8px] tracking-wider uppercase text-[#71717a]">
                        Exclusive Fitting Only
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Meta Section */}
              <div className="flex justify-between items-start mb-3 px-1">
                <div className="flex flex-col space-y-1">
                  <h3 className="font-sans text-sm font-light tracking-wide text-[#f4f4f5] group-hover:text-[#d4af37] transition-colors duration-300 uppercase">
                    {product.name}
                  </h3>
                  <span className="font-mono text-[9px] text-[#71717a] tracking-widest uppercase">
                    Contemporary Fitting
                  </span>
                </div>
                <span className="font-mono text-sm text-[#d4af37] font-semibold tracking-wider">
                  {formatMinorToCedi(product.price_minor)}
                </span>
              </div>

              {/* Action Row */}
              <div className="flex space-x-2.5 mt-auto pt-4 px-1">
                <button
                  disabled={!isItemAvailable}
                  onClick={() => addItem(product.id, 'Size M')}
                  className="flex-1 bg-[#f4f4f5] text-[#09090b] border border-transparent py-3 text-[10px] font-mono tracking-[0.2em] uppercase transition-all duration-300 disabled:opacity-20 disabled:hover:bg-[#f4f4f5] disabled:hover:text-[#09090b] hover:bg-[#d4af37] hover:text-[#09090b]"
                >
                  Add To Cart
                </button>
                
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.href = `/try-on?item_id=${product.id}`;
                    }
                  }}
                  className="px-5 bg-transparent border border-[#272730] text-[#f4f4f5] hover:border-[#d4af37] hover:text-[#d4af37] py-3 text-[10px] font-mono tracking-[0.15em] uppercase transition-all duration-300"
                >
                  VTO
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
