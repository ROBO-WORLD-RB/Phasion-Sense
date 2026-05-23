import Dexie, { type Table } from 'dexie';
import { Item, CampaignResponse, SyncTransaction } from '../types';

export class PhasionSenseDatabase extends Dexie {
  cached_items!: Table<Item, string>;
  cached_campaigns!: Table<CampaignResponse, string>;
  sync_queue!: Table<SyncTransaction, number>;
  local_cart!: Table<{ item_id: string; qty: number; item_note: string }, string>;

  constructor() {
    super('PhasionSenseDB');
    
    // Explicit schema declarations for indexing fields
    this.version(1).stores({
      cached_items: 'id, merchant_id, in_stock',
      cached_campaigns: 'id, team_slug',
      sync_queue: '++id, timestamp, endpoint, status',
      local_cart: 'item_id'
    });
  }
}

// Instantiate a single exportable database singleton instance
export const db = new PhasionSenseDatabase();
