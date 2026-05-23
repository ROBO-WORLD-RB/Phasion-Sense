import { BasketResponse } from '../types';
import { useCatalogStore } from '../store/catalogStore';
import { formatMinorToCedi } from './currency';

/**
 * Compiles a professional WhatsApp deep-link URI for the checkout handshake.
 * Supports Online mode (attaching server-validated Basket ID) and Offline mode (Direct Fallback Invoice).
 */
export const compileWhatsAppLink = (
  whatsappNumber: string,
  merchantName: string,
  customerName: string,
  teamSlug: string,
  basketData: {
    onlineBasketId?: string;
    localCartItems?: { item_id: string; qty: number; item_note: string }[];
    totalMinor?: number;
  }
): string => {
  const cleanNumber = whatsappNumber.replace('+', '');
  let messageBody = `✨ *NEW ORDER - PHASION SENSE* ✨\n\n`;
  messageBody += `*Merchant:* ${merchantName}\n`;
  messageBody += `*Customer:* ${customerName || 'Valued Client'}\n`;
  messageBody += `*Track Tag:* ${teamSlug}\n`;
  messageBody += `─────────────────────────\n\n`;

  if (basketData.onlineBasketId) {
    // ONLINE MODE: Secure server-validated order reference
    messageBody += `🛍️ *Order Verified Securely*\n`;
    messageBody += `*Basket ID:* \`${basketData.onlineBasketId}\`\n\n`;
    messageBody += `Tap the link to review inventory metrics and fulfill order: \n`;
    messageBody += `https://api-hackathon.codedematrixtech.com/baskets/${basketData.onlineBasketId}\n\n`;
    
    if (basketData.totalMinor) {
      messageBody += `*Estimated Total:* ${formatMinorToCedi(basketData.totalMinor)}\n`;
    }
  } else if (basketData.localCartItems) {
    // OFFLINE MODE: Direct client-side itemized invoice compilation
    messageBody += `📡 *Order Compiled Offline (Connectivity Failover Saved)*\n\n`;
    
    const itemsCache = useCatalogStore.getState().items;
    let computedTotalMinor = 0;

    basketData.localCartItems.forEach((item, index) => {
      const product = itemsCache.find(p => p.id === item.item_id);
      if (product) {
        const itemTotal = product.price_minor * item.qty;
        computedTotalMinor += itemTotal;
        
        messageBody += `${index + 1}. *${product.name}* \n`;
        messageBody += `   Qty: ${item.qty} | Spec: _${item.item_note || 'Size M'}_\n`;
        messageBody += `   Sub: ${formatMinorToCedi(itemTotal)}\n\n`;
      }
    });

    messageBody += `─────────────────────────\n`;
    messageBody += `*Grand Total:* ${formatMinorToCedi(computedTotalMinor)}\n`;
  }

  messageBody += `\n💬 _Please reply to confirm availability, size fitting adjustments, and mobile money payment processing lines._`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(messageBody)}`;
};
