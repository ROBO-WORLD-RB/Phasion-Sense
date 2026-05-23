import { db } from '../db/DexieDB';
import { apiClient } from './api-client';
import { PostBasketPayload, BasketResponse } from '../types';

class SyncEngineManager {
  private isSyncing = false;

  /**
   * Initializes background window listeners to capture auto-reconnection events.
   */
  public init() {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      console.log('📡 Connectivity restored. Initializing automatic synchronization sequence...');
      this.processSyncQueue();
    });
  }

  /**
   * Processes chronologically queued offline mutations sequentially.
   */
  public async processSyncQueue() {
    // Mutual exclusion lock to guarantee thread safety during fast connection switches
    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      const pendingTransactions = await db.sync_queue
        .where('status')
        .equals('pending')
        .toArray();

      if (pendingTransactions.length === 0) {
        this.isSyncing = false;
        return;
      }

      console.log(`Processing ${pendingTransactions.length} pending offline transactions...`);

      for (const transaction of pendingTransactions) {
        if (!transaction.id) continue;

        try {
          if (transaction.endpoint === '/baskets') {
            const payload = transaction.payload as PostBasketPayload;
            
            // Dispatch request downstream to live hackathon endpoints
            const response = await apiClient.post<BasketResponse>('/baskets', payload);
            console.log(`Successfully reconciled background basket: ${response.data.id}`);

            // Update record status to clear from operational retry queue
            await db.sync_queue.delete(transaction.id);
          }
        } catch (apiError) {
          console.error(`Transaction ID ${transaction.id} reconciliation failed. Inspecting status...`, apiError);
          
          if (apiError && typeof apiError === 'object' && 'status' in apiError) {
            const err = apiError as { status: number; error?: string };
            if (err.status === 422) {
              // Hard Validation Failure: e.g. Item unavailable or out of stock. Mark failed so we can prompt UI warnings.
              await db.sync_queue.update(transaction.id, {
                status: 'failed',
                error_code: err.error || 'validation_error'
              });
            }
          }
          // For standard network timeouts (5xx / transport drops), break out and retry on next connection ping
          break;
        }
      }
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Safe entry gateway for submitting checkouts. Automatically queues if offline.
   */
  public async submitBasket(payload: PostBasketPayload): Promise<string | null> {
    try {
      const response = await apiClient.post<BasketResponse>('/baskets', payload);
      return response.data.id;
    } catch (error) {
      if (error && typeof error === 'object' && 'error' in error) {
        const err = error as { error: string };
        if (err.error === 'fetch_failed') {
          console.warn('Network unreachable during checkout dispatch. Shifting transaction into IndexedDB sync queue...');
          
          await db.sync_queue.add({
            timestamp: Date.now(),
            endpoint: '/baskets',
            payload: payload,
            status: 'pending'
          });
          
          return null; // Signals client fallback code to compile itemized direct link instead
        }
      }
      throw error; // Re-throw hard validation parameters to UI try/catch loops
    }
  }
}

export const syncEngine = new SyncEngineManager();
