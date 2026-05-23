'use client';

import { useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { useCatalogStore } from '../../store/catalogStore';
import { syncEngine } from '../../services/syncEngine';
import { compileWhatsAppLink } from '../../utils/whatsappCompiler';
import { formatMinorToCedi } from '../../utils/currency';
import Link from 'next/link';

// High-fidelity premium contemporary African fashion alternative CDN image (Unsplash curated lookbook asset)
const PREMIUM_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop';

export default function CheckoutPage() {
  const { cart, clearCart } = useCartStore();
  const itemsCache = useCatalogStore((state) => state.items);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Hardcoded merchant details corresponding to our amina-stitches track asset registry
  const merchantInfo = {
    whatsapp_number: '+233535186123', // Preloaded reference matching API metadata
    name: 'Amina Stitches',
    slug: 'amina-stitches'
  };

  const fullCartItems = cart.map(i => ({ ...i, product: itemsCache.find(p => p.id === i.item_id) }));
  const totalMinor = fullCartItems.reduce((acc, curr) => acc + (curr.product?.price_minor || 0) * curr.qty, 0);

  const handleHandshakeCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setCheckoutError(null);

    const payload = {
      merchant_id: merchantInfo.slug,
      items: cart.map(i => ({ item_id: i.item_id, qty: i.qty, item_note: i.item_note })),
      customer_name: name,
      customer_phone: phone,
      customer_note: note,
      team_slug: 'team-alpha' // Our registered team identifier tag
    };

    try {
      // Dispatch via sync gateway
      const onlineBasketId = await syncEngine.submitBasket(payload);
      let targetWhatsAppUrl = '';

      if (onlineBasketId) {
        // ONLINE EXECUTION: Attach valid short ID string
        targetWhatsAppUrl = compileWhatsAppLink(
          merchantInfo.whatsapp_number,
          merchantInfo.name,
          name,
          'team-alpha',
          { onlineBasketId, totalMinor }
        );
      } else {
        // OFFLINE EXECUTION: Create direct itemized fallback description block
        targetWhatsAppUrl = compileWhatsAppLink(
          merchantInfo.whatsapp_number,
          merchantInfo.name,
          name,
          'team-alpha',
          { localCartItems: cart }
        );
      }

      // Evacuate user cart state locally and execute native browser window transfer
      await clearCart();
      setIsProcessing(false);
      window.location.href = targetWhatsAppUrl;
    } catch (err) {
      setIsProcessing(false);
      if (err && typeof err === 'object' && 'error' in err) {
        const errorDetails = err as { error: string; message?: string };
        if (errorDetails.error === 'items_unavailable') {
          setCheckoutError('One or more luxury garments in your bag have sold out on the server. Please return to your cart to update details.');
        } else {
          setCheckoutError(errorDetails.message || 'An unhandled transactional validation anomaly occurred.');
        }
      } else {
        setCheckoutError('An unhandled transactional validation anomaly occurred.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] px-6 md:px-24 py-20">
      
      {/* Editorial Header */}
      <div className="mb-16 border-b border-[#1c1c24] pb-6 flex flex-col md:flex-row justify-between items-start md:items-baseline">
        <div className="flex flex-col space-y-1">
          <Link href="/" className="text-[#71717a] hover:text-[#d4af37] transition-colors uppercase tracking-[0.25em] text-[9px] mb-2 block">
            ← Return to Studio
          </Link>
          <h1 className="font-sans text-2xl md:text-4xl font-extralight tracking-tight uppercase">
            Customer Intake
          </h1>
        </div>
        <span className="font-mono text-[9px] text-[#71717a] tracking-[0.3em] uppercase mt-4 md:mt-0 bg-[#16161e] px-3 py-1 border border-[#272730] rounded-sm">
          Handshake // Checkout
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-16 items-start">
        
        {/* Checkout Form */}
        <div className="flex-1 w-full max-w-xl">
          {checkoutError && (
            <div className="mb-10 p-5 bg-red-950/20 border border-red-800/40 text-red-200 text-[10px] font-mono tracking-widest uppercase rounded-sm shadow-lg flex items-center space-x-3">
              <span className="text-[#d4af37] text-sm">⚠️</span>
              <span>{checkoutError}</span>
            </div>
          )}

          <form onSubmit={handleHandshakeCheckout} className="space-y-8 font-mono text-[10px]">
            <div className="flex flex-col space-y-2">
              <label className="text-[#71717a] uppercase tracking-[0.25em] font-semibold">
                Full Name *
              </label>
              <input 
                required 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="bg-[#16161e] border border-[#1c1c24] focus:border-[#d4af37] p-4 text-xs text-[#f4f4f5] outline-none transition-all duration-300 rounded-sm focus:ring-1 focus:ring-[#d4af37]/20 placeholder-[#3f3f46]" 
                placeholder="e.g., Kwame Mensah" 
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              <label className="text-[#71717a] uppercase tracking-[0.25em] font-semibold">
                WhatsApp Mobile Contact *
              </label>
              <input 
                required 
                type="tel" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                className="bg-[#16161e] border border-[#1c1c24] focus:border-[#d4af37] p-4 text-xs text-[#f4f4f5] outline-none transition-all duration-300 rounded-sm focus:ring-1 focus:ring-[#d4af37]/20 placeholder-[#3f3f46]" 
                placeholder="e.g., +233 50 000 0000" 
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              <label className="text-[#71717a] uppercase tracking-[0.25em] font-semibold">
                Tailoring Instructions & Design Notes
              </label>
              <textarea 
                value={note} 
                onChange={e => setNote(e.target.value)} 
                rows={4} 
                className="bg-[#16161e] border border-[#1c1c24] focus:border-[#d4af37] p-4 text-xs text-[#f4f4f5] outline-none transition-all duration-300 rounded-sm focus:ring-1 focus:ring-[#d4af37]/20 placeholder-[#3f3f46] resize-none" 
                placeholder="Provide height, standard sizes, or custom Ankara/Kente sleeve embroidery directives..." 
              />
            </div>

            <button 
              type="submit" 
              disabled={cart.length === 0 || isProcessing} 
              className="w-full bg-[#f4f4f5] text-[#09090b] font-mono text-[10px] py-4.5 uppercase tracking-[0.25em] hover:bg-[#d4af37] hover:text-[#09090b] disabled:opacity-20 disabled:hover:bg-[#f4f4f5] disabled:hover:text-[#09090b] transition-all duration-300 mt-6 border border-transparent"
            >
              {isProcessing ? 'COMPILING SECURE INVOICE...' : 'INITIALIZE WHATSAPP HANDSHAKE'}
            </button>
          </form>
        </div>

        {/* Bag Review Container */}
        <div className="w-full lg:w-96 bg-[#16161e] border border-[#1c1c24] p-8 h-fit flex flex-col shadow-xl">
          <h3 className="font-sans text-base font-light tracking-[0.2em] uppercase mb-8 border-b border-[#272730] pb-4">
            Bag Review
          </h3>
          
          <div className="flex-1 space-y-6 max-h-80 overflow-y-auto mb-8 pr-2 custom-scrollbar">
            {fullCartItems.map(item => (
              <div 
                key={item.item_id} 
                className="flex items-center space-x-4 border-b border-[#1c1c24] pb-4 group"
              >
                {/* Product Thumbnail */}
                <div className="w-12 h-16 bg-[#09090b] border border-[#1c1c24] overflow-hidden flex-shrink-0">
                  <img
                    src={
                      item.product?.image_urls[0]
                        ? item.product.image_urls[0].startsWith('http')
                          ? item.product.image_urls[0]
                          : `https://api-hackathon.codedematrixtech.com${item.product.image_urls[0].startsWith('/') ? '' : '/'}${item.product.image_urls[0]}`
                        : PREMIUM_FALLBACK_IMAGE
                    }
                    alt={item.product?.name || 'Garment'}
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                    onError={(e) => {
                      // Defensively Safe Image Fallback Engine (The 404 Counter-Measure)
                      const target = e.target as HTMLImageElement;
                      if (target.src !== PREMIUM_FALLBACK_IMAGE) {
                        target.src = PREMIUM_FALLBACK_IMAGE;
                      }
                    }}
                  />
                </div>
                
                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col space-y-0.5">
                  <span className="text-xs font-sans font-light tracking-wide text-[#f4f4f5] truncate uppercase group-hover:text-[#d4af37] transition-colors">
                    {item.product?.name || 'Garment'}
                  </span>
                  <span className="text-[#71717a] text-[9px] font-mono tracking-widest uppercase">
                    Qty: {item.qty} | {item.item_note}
                  </span>
                </div>
                
                {/* Price */}
                <span className="text-[#d4af37] text-xs font-mono tracking-wider whitespace-nowrap">
                  {item.product ? formatMinorToCedi(item.product.price_minor * item.qty) : 'GH₵ 0.00'}
                </span>
              </div>
            ))}
          </div>
          
          {/* Summary Row */}
          <div className="border-t border-[#272730] pt-6 flex justify-between items-baseline mt-auto">
            <span className="text-[10px] font-mono text-[#71717a] uppercase tracking-[0.25em]">
              Total Summary
            </span>
            <span className="font-mono text-xl font-bold text-[#d4af37] tracking-wider">
              {formatMinorToCedi(totalMinor)}
            </span>
          </div>
        </div>
        
      </div>
    </div>
  );
}
