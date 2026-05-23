import { create } from 'zustand';
import { Item, CampaignResponse } from '../types';
import { db } from '../db/DexieDB';
import { apiClient } from '../services/api-client';

interface CatalogState {
  items: Item[];
  campaigns: CampaignResponse[];
  isLoading: boolean;
  error: string | null;
  hydrateCatalog: (merchantSlug: string, teamSlug: string) => Promise<void>;
}

export const useCatalogStore = create<CatalogState>((set) => ({
  items: [],
  campaigns: [],
  isLoading: false,
  error: null,

  hydrateCatalog: async (merchantSlug: string, teamSlug: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // 1. Fire concurrent API requests for items and campaigns
      const [itemsResponse, campaignsResponse] = await Promise.all([
        apiClient.get<Item[]>(`/merchants/${merchantSlug}/items`),
        apiClient.get<CampaignResponse[]>(`/merchants/${merchantSlug}/campaigns?team_slug=${teamSlug}`)
      ]);

      const remoteItems = itemsResponse.data;
      const remoteCampaigns = Array.isArray(campaignsResponse.data) ? campaignsResponse.data : [];

      // 2. Clear out old caches and write the brand-new snapshots to Dexie IndexedDB
      await db.transaction('rw', [db.cached_items, db.cached_campaigns], async () => {
        await db.cached_items.clear();
        await db.cached_items.bulkAdd(remoteItems);
        
        if (remoteCampaigns.length > 0) {
          await db.cached_campaigns.clear();
          await db.cached_campaigns.bulkAdd(remoteCampaigns);
        }
      });

      set({ items: remoteItems, campaigns: remoteCampaigns, isLoading: false });
    } catch (apiErr) {
      console.warn('API Catalog hydration failed. Diverting to local storage cache backup...', apiErr);
      
      // 3. Fallback: If network is offline or server drops out, read from client persistent storage
      try {
        const cachedItems = await db.cached_items.where('merchant_id').equals(merchantSlug).toArray();
        const cachedCampaigns = await db.cached_campaigns.toArray();

        if (cachedItems.length === 0) {
          set({ 
            error: 'App is offline and no local storefront items have been cached yet.', 
            isLoading: false 
          });
          return;
        }

        set({ items: cachedItems, campaigns: cachedCampaigns, isLoading: false });
      } catch (dbErr) {
        set({ error: 'Critical failure reading from local storage buffer.', isLoading: false });
      }
    }
  }
}));
