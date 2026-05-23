'use client';

import { useCartStore } from '../store/cartStore';
import { useCatalogStore } from '../store/catalogStore';
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

export default function CartDrawer() {
  const { cart, isDrawerOpen, toggleDrawer, updateQty, removeItem } = useCartStore();
  const itemsCache = useCatalogStore((state) => state.items);

  if (!isDrawerOpen) return null;

  // Derive cart details by joining local cart keys with the product cache
  const fullCartItems = cart.map((cartItem) => {
    const matchedProduct = itemsCache.find((p) => p.id === cartItem.item_id);
    return {
      ...cartItem,
      product: matchedProduct,
    };
  });

  const cartTotalMinor = fullCartItems.reduce((acc, curr) => {
    if (!curr.product) return acc;
    return acc + curr.product.price_minor * curr.qty;
  }, 0);

  // LOCAL TRANSACTIONAL OVERHEAD COMPUTATION (1% Estimated MoMo Escrow Network Rate)
  const estimatedMomoFeeMinor = Math.round(cartTotalMinor * 0.01);
  const localizedGrossTotalMinor = cartTotalMinor + estimatedMomoFeeMinor;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/65 backdrop-blur-md animate-fade-in">
      {/* Background Overlay */}
      <div className="absolute inset-0" onClick={() => toggleDrawer(false)} />
      
      {/* Drawer Body */}
      <div className="relative w-full max-w-md h-full bg-[#09090b] border-l border-[#1c1c24] p-8 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-slide-left text-[#f4f4f5] z-10">
        
        {/* Drawer Header */}
        <div className="flex justify-between items-center border-b border-[#1c1c24] pb-5 mb-8">
          <div className="flex flex-col space-y-1">
            <h2 className="font-sans text-xl font-light tracking-[0.15em] uppercase">
              Your Selection
            </h2>
            <span className="font-mono text-[9px] text-[#71717a] tracking-widest uppercase">
              Bag // {cart.length} item{cart.length === 1 ? '' : 's'}
            </span>
          </div>
          <button 
            onClick={() => toggleDrawer(false)} 
            className="text-[10px] font-mono tracking-[0.2em] text-[#71717a] hover:text-[#d4af37] border border-[#272730] hover:border-[#d4af37]/30 px-3 py-1.5 transition-all duration-300"
          >
            [ CLOSE ]
          </button>
        </div>

        {/* Dynamic Item List Container */}
        <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
          {fullCartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 rounded-full border border-[#272730] flex items-center justify-center text-[#71717a] font-mono text-sm">
                o
              </div>
              <p className="font-mono text-[10px] text-[#71717a] tracking-[0.25em] uppercase">Cart is Empty</p>
            </div>
          ) : (
            fullCartItems.map((item) => {
              const resolvedImageUrl = resolveProductImage(item.product?.image_urls[0]);

              return (
                <div 
                  key={item.item_id} 
                  className="flex border-b border-[#1c1c24] pb-6 space-x-5 items-center group/item hover:border-[#272730] transition-colors duration-300"
                >
                  {/* Thumb Container */}
                  <div className="w-20 h-24 bg-[#16161e] border border-[#1c1c24] overflow-hidden flex-shrink-0 relative">
                    <img
                      src={resolvedImageUrl}
                      alt={item.product?.name || 'Garment'}
                      className="w-full h-full object-cover filter grayscale group-hover/item:grayscale-0 transition-all duration-700 ease-out"
                      onError={(e) => {
                        // Defensively Safe Image Fallback Engine (The 404 Counter-Measure)
                        const target = e.target as HTMLImageElement;
                        if (target.src !== PREMIUM_FALLBACK_IMAGE) {
                          target.src = PREMIUM_FALLBACK_IMAGE;
                        }
                      }}
                    />
                    <div className="absolute inset-0 border border-transparent group-hover/item:border-[#d4af37]/20 pointer-events-none transition-all duration-300" />
                  </div>
                  
                  {/* Detail Section */}
                  <div className="flex-1 min-w-0 flex flex-col space-y-1">
                    <h4 className="font-sans text-sm font-light tracking-wide text-[#f4f4f5] truncate uppercase group-hover/item:text-[#d4af37] transition-colors duration-300">
                      {item.product?.name || 'Unknown Item'}
                    </h4>
                    <p className="font-mono text-[9px] text-[#d4af37] tracking-widest uppercase">
                      {item.item_note}
                    </p>
                    <p className="font-mono text-xs text-[#71717a] pt-1">
                      {item.product ? formatMinorToCedi(item.product.price_minor) : 'GH₵ 0.00'}
                    </p>
                  </div>
                  
                  {/* Controls Area */}
                  <div className="flex flex-col items-end space-y-3.5">
                    <div className="flex items-center border border-[#272730] divide-x divide-[#272730] text-[10px] font-mono rounded-sm">
                      <button 
                        onClick={() => updateQty(item.item_id, item.qty - 1)} 
                        className="px-2.5 py-1 text-[#71717a] hover:text-[#f4f4f5] hover:bg-[#16161e] transition-colors"
                      >
                        -
                      </button>
                      <span className="px-3.5 py-1 text-[#f4f4f5]">{item.qty}</span>
                      <button 
                        onClick={() => updateQty(item.item_id, item.qty + 1)} 
                        className="px-2.5 py-1 text-[#71717a] hover:text-[#f4f4f5] hover:bg-[#16161e] transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.item_id)} 
                      className="font-mono text-[9px] tracking-[0.2em] text-[#71717a] hover:text-red-400 uppercase transition-colors duration-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        {fullCartItems.length > 0 && (
          <div className="border-t border-[#1c1c24] pt-8 mt-auto space-y-4">
            <div className="space-y-1.5 font-mono text-xs text-[#a1a1aa]">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="text-[#f4f4f5]">{formatMinorToCedi(cartTotalMinor)}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>Est. Mobile Money Processing Fee (1%):</span>
                <span className="text-[#f4f4f5]">{formatMinorToCedi(estimatedMomoFeeMinor)}</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-2 border-t border-[#1c1c24]">
              <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#71717a]">
                Gross Total Summary
              </span>
              <span className="font-mono text-2xl font-semibold text-[#d4af37] tracking-wider">
                {formatMinorToCedi(localizedGrossTotalMinor)}
              </span>
            </div>
            
            <button 
              onClick={() => {
                if (typeof window !== 'undefined') window.location.href = '/checkout';
              }}
              className="w-full bg-[#f4f4f5] text-[#09090b] border border-transparent py-4 text-[10px] font-mono tracking-[0.2em] uppercase hover:bg-[#d4af37] hover:text-[#09090b] transition-all duration-300"
            >
              Proceed to Handshake Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
