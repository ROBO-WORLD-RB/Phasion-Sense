// Type safety configuration matching hackathon endpoint references exactly

export interface Merchant {
  id: string;
  name: string;
  whatsapp_number: string;
}

export interface Item {
  id: string;
  merchant_id: string;
  name: string;
  price_minor: number; // Stored in integer pesewas
  currency: string;    // e.g., "GHS"
  image_urls: string[];
  in_stock: boolean;
}

export interface BasketItemRequest {
  item_id: string;
  qty: number;
  item_note?: string; // Optional per-item note (e.g., "Size L", "Custom Embroidery")
}

export interface BasketItemResponse extends BasketItemRequest {
  name: string;
  price_minor: number;
  in_stock: boolean;
}

export interface PostBasketPayload {
  merchant_id: string;
  items: BasketItemRequest[];
  customer_name?: string;
  customer_phone?: string;
  customer_note?: string;
  team_slug?: string;
}

export interface BasketResponse {
  id: string;
  merchant: Merchant;
  items: BasketItemResponse[];
  total_minor: number;
  currency: string;
  customer_name?: string;
  customer_phone?: string;
  customer_note?: string;
  team_slug?: string;
  created_at: number;
}

export interface CampaignPayload {
  merchant_id: string;
  title: string;
  copy_text?: string;
  image_urls?: string[];
  featured_item_ids?: string[];
  team_slug?: string;
}

export interface CampaignResponse {
  id: string;
  merchant: Merchant;
  title: string;
  copy_text?: string;
  featured_items: Item[];
  team_slug?: string;
  created_at: number;
}

export interface TeamPayload {
  slug: string;
  name: string;
  merchant_id: string;
  contact?: string;
}

// Offline/Sync Engine Specific Typings
export interface SyncTransaction {
  id?: number; // Auto-incrementing Dexie primary key
  timestamp: number;
  endpoint: '/baskets' | '/campaigns';
  payload: PostBasketPayload | CampaignPayload;
  status: 'pending' | 'failed';
  error_code?: string;
}
