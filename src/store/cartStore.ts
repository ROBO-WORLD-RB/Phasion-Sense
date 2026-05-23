import { create } from 'zustand';
import { db } from '../db/DexieDB';

interface CartItem {
  item_id: string;
  qty: number;
  item_note: string; // Used to store sizing metrics, e.g., "Size M"
}

interface CartState {
  cart: CartItem[];
  isDrawerOpen: boolean;
  initCart: () => Promise<void>;
  addItem: (itemId: string, note?: string) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQty: (itemId: string, newQty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleDrawer: (open?: boolean) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  isDrawerOpen: false,

  toggleDrawer: (open) => set((state) => ({ 
    isDrawerOpen: open !== undefined ? open : !state.isDrawerOpen 
  })),

  initCart: async () => {
    try {
      // Sync memory state with local IndexedDB records on boot
      const records = await db.local_cart.toArray();
      set({ cart: records });
    } catch (err) {
      console.error('Failed to initialize cart from Dexie DB:', err);
    }
  },

  addItem: async (itemId, note = 'Size M') => {
    const existing = get().cart.find(i => i.item_id === itemId);
    const updatedItem = existing 
      ? { ...existing, qty: existing.qty + 1 }
      : { item_id: itemId, qty: 1, item_note: note };

    // Optimistic UI state update & Auto-open drawer for premium commercial feedback
    set({
      cart: existing 
        ? get().cart.map(i => i.item_id === itemId ? updatedItem : i)
        : [...get().cart, updatedItem],
      isDrawerOpen: true
    });

    try {
      // Mirror write transaction downstream to IndexedDB
      await db.local_cart.put(updatedItem);
    } catch (err) {
      console.error('Dexie IndexedDB write failed in cartStore:', err);
    }
  },

  removeItem: async (itemId) => {
    set({ cart: get().cart.filter(i => i.item_id !== itemId) });
    try {
      await db.local_cart.delete(itemId);
    } catch (err) {
      console.error('Dexie IndexedDB delete failed in cartStore:', err);
    }
  },

  updateQty: async (itemId, newQty) => {
    if (newQty <= 0) {
      get().removeItem(itemId);
      return;
    }

    set({
      cart: get().cart.map(i => i.item_id === itemId ? { ...i, qty: newQty } : i)
    });

    try {
      const item = await db.local_cart.get(itemId);
      if (item) {
        await db.local_cart.put({ ...item, qty: newQty });
      }
    } catch (err) {
      console.error('Dexie IndexedDB read/write failed in cartStore:', err);
    }
  },

  clearCart: async () => {
    set({ cart: [] });
    try {
      await db.local_cart.clear();
    } catch (err) {
      console.error('Dexie IndexedDB clear failed in cartStore:', err);
    }
  }
}));
