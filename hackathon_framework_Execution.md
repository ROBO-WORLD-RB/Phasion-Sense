# MISSION: Execution Roadmap

## INSTRUCTIONS FOR AI AGENT
Synthesize the architectural plan from `Solution.md` and the selected technical environment from `Tools_&_File_Structure.md`. Create a highly disciplined, step-by-step execution plan to bring this project to life under high time pressure.

Break the development process into logical, highly cohesive phases. Every phase must be isolated and fully testable before moving to the next. Do not build ahead of the current phase.

## PRODUCTION ROADMAP & SHARDED IMPLEMENTATION PLAN

---

### **Phase 1: Foundation, Local Storage, & Schema Setup**
*   **Phase Objectives:**
    *   Initialize the core technical framework and directory architecture with zero compile errors.
    *   Initialize the local IndexedDB database using Dexie.js, validating database creations and upgrades.
    *   Implement an Axios client wrapper that intercepts outbound calls, monitoring network presence and routing operations cleanly.
    *   Develop a secure, local-first team registration layout saving the active brand slug (`amina-stitches`) directly to persistent browser configurations.
*   **Action Items:**
    *   [x] Configure `tsconfig.json`, `next.config.js`, and PWA plugin hooks to cache layout shells, static assets, and local style sheets.
    *   [x] Create [schema.ts](file:///c:/Users/JERRY%20JUSTICE/Desktop/Hackathon_Project/src/db/schema.ts) defining our IndexedDB table schemas:
        *   `catalog`: `id`, `slug`, `name`, `price`, `currency`, `image`, `sizes` (primary key: `id`).
        *   `local_cart`: `id`, `itemId`, `quantity`, `size`, `notes`, `syncStatus` (primary key: `id`).
        *   `sync_queue`: `id`, `endpoint`, `method`, `payload`, `status`, `timestamp` (primary key: `id`).
    *   [x] Create [DexieDB.ts](file:///c:/Users/JERRY%20JUSTICE/Desktop/Hackathon_Project/src/db/DexieDB.ts) initializing our `AminaStitchesDB` Dexie instance, wrapping migrations and transactions safely.
    *   [x] Write [api.ts](file:///c:/Users/JERRY%20JUSTICE/Desktop/Hackathon_Project/src/services/api.ts) setting up our custom Axios interceptors. It intercepts request triggers; if `navigator.onLine` evaluates to offline, it intercepts `/items` queries to return cached tables from Dexie instead of throwing network errors.
    *   [x] Create [page.tsx](file:///c:/Users/JERRY%20JUSTICE/Desktop/Hackathon_Project/src/app/register/page.tsx) building a luxury registration screen that secures the team slug in `localStorage`.
*   **Testing & Verification Protocol:**
    *   *IndexedDB Verification:* Launch the developer server, inspect Chrome DevTools -> Application -> IndexedDB, and verify that the database `AminaStitchesDB` compiles with three tables having correct schemas.
    *   *Offline Catch Testing:* Open network inspector, block internet connection, navigate through mock product listings. Verify that the Axios interceptor catches the fetch trigger and loads cached items from IndexedDB.
    *   *Storage Integration Check:* Trigger registration submission inside the view and verify that `localStorage.getItem("active_team_slug")` equals `"amina-stitches"`.

---

### **Phase 2: Core Offline Logic & Local Operations**
*   **Phase Objectives:**
    *   Establish our Zustand stores to orchestrate in-memory view operations and background IndexedDB updates.
    *   Program a pure, high-precision currency converter mapping Ghana Pesewas to Ghana Cedis (GH₵) with zero floating-point calculation errors.
    *   Code a background hydrator that automatically pulls fresh catalog elements from `/items` when online, updating local stores, and switches to stale local reads offline.
*   **Action Items:**
    *   [x] Create [currency.ts](file:///c:/Users/JERRY%20JUSTICE/Desktop/Hackathon_Project/src/utils/currency.ts) containing two core functions:
        *   `pesewasToCedis(pesewas: number): string` -> divides by 100 and outputs a luxury string (e.g. `GH₵ 120.00`).
        *   `calculateTotals(items: CartItem[]): { subtotal: number, tax: number, total: number }` -> handles tax (e.g., 15% VAT) using safe integer addition in pesewas to avoid Javascript rounding errors.
    *   [x] Build [cartStore.ts](file:///c:/Users/JERRY%20JUSTICE/Desktop/Hackathon_Project/src/store/cartStore.ts) defining our Zustand state machine. The actions `addItem`, `updateQuantity`, and `removeItem` must modify in-memory arrays and execute corresponding database operations in Dexie `local_cart` as atomic database operations.
    *   [x] Build [catalogStore.ts](file:///c:/Users/JERRY%20JUSTICE/Desktop/Hackathon_Project/src/store/catalogStore.ts) to manage product queries. Create a catalog hydrator method `hydrateCatalog()` that tries fetching `/items` online to update the database, falling back gracefully to Dexie catalog tables offline.
*   **Testing & Verification Protocol:**
    *   *Floating Point Assertions:* Execute unit assertions passing `1050` pesewas and `2040` pesewas. Verify the subtotal evaluates exactly to `GH₵ 30.90` and tax parses properly.
    *   *Local Storage Persistence:* Click "Add to Bag" offline, reload browser. Verify that Zustand store hydrator reads the IndexedDB state upon initial startup, rendering the item with the correct details and notes.

---

### **Phase 3: Frontend Integration & Optimistic UI**
*   **Phase Objectives:**
    *   Develop a gorgeous, premium contemporary visual theme ("Phasion Sense") utilizing harmony in typography, styling, and motion transitions.
    *   Create a fluid, fully responsive product list grid displaying our contemporary Ankara/Kente collection.
    *   Implement high-performance asynchronous skeleton placeholders for lazy-loaded catalogs, preventing visual layout shifts.
    *   Construct an active, elegant header indicator notifying the user of active connectivity states.
*   **Action Items:**
    *   [x] Configure [index.css](file:///c:/Users/JERRY%20JUSTICE/Desktop/Hackathon_Project/src/app/index.css) defining modern custom typography (Outfit and Playfair Display) and our core theme colors: Background `#09090b` (luxury dark), Cards `#18181b`, Gold Accent `#d4af37`, and Emerald `#10b981`.
    *   [x] Create [CatalogGrid.tsx](file:///c:/Users/JERRY%20JUSTICE/Desktop/Hackathon_Project/src/components/catalog/CatalogGrid.tsx) and [ProductCard.tsx](file:///c:/Users/JERRY%20JUSTICE/Desktop/Hackathon_Project/src/components/catalog/ProductCard.tsx) establishing flex-grids, micro-animations (slow transform scaling on card hover), and custom Ankara badge tags.
    *   [x] Integrate loading states within `ProductCard.tsx` using absolute-positioned CSS shimmers. Use the HTML5 `img.onLoad` callback to transition seamlessly from shimmer skeleton to high-resolution item lookbook.
    *   [x] Build [SyncIndicator.tsx](file:///c:/Users/JERRY%20JUSTICE/Desktop/Hackathon_Project/src/components/layout/SyncIndicator.tsx) in the header. Use CSS transitions to pulse golden-amber when offline or green-emerald when online and synchronized.
*   **Testing & Verification Protocol:**
    *   *Aesthetic & Responsive View:* Test storefront display on mobile screen width (375px) and widescreen (1440px). Verify that no text wraps awkwardly, zero scrollbars appear horizontally, and buttons retain proper touch padding (min 44px).
    *   *Shimmer Lazy Load verification:* Set network throttle to Slow 3G in Chrome DevTools. Refresh page, verify that shimmers represent structural layouts until lookbook WebP images fully resolve.

---

### **Phase 4: Sync Engine & Conflict Resolution**
*   **Phase Objectives:**
    *   Implement an asynchronous background synchronization queue manager that automatically captures network changes, processes queued operations sequentially, and guarantees transaction integrity.
    *   Write a dual-mode WhatsApp invoice payload compiler supporting online Server ID mode and offline Client Local fallback.
*   **Action Items:**
    *   [x] Write [syncEngine.ts](file:///c:/Users/JERRY%20JUSTICE/Desktop/Hackathon_Project/src/services/syncEngine.ts) setting up a global event listener on `window.addEventListener('online')`.
    *   [x] Implement a queue worker inside `syncEngine.ts` that runs on network recovery: it locks operations, reads the Dexie `sync_queue` table sequentially, executes API calls to `/baskets` using Axios, removes completed tasks from the database queue, and flags local cart states as `'SYNCHRONIZED'`.
    *   [x] Develop [whatsappCompiler.ts](file:///c:/Users/JERRY%20JUSTICE/Desktop/Hackathon_Project/src/utils/whatsappCompiler.ts) implementing a dual-mode WhatsApp checkout compiler:
        *   *Mode A (Online / Sync Success):* Formats a professional text link integrating the team slug, custom order totals, and the official synchronized server `basketId`.
        *   *Mode B (Offline Fallback):* Dynamically processes local cart items from IndexedDB, formatting a detailed invoice containing item names, chosen sizes, embroidered customization notes, calculated Cedi values, and team slug in a readable text bloc.
*   **Testing & Verification Protocol:**
    *   *Sync Engine Robustness:* Block network connection, make 3 distinct cart additions. Re-enable network. Verify that the sync manager wakes up, sequentially issues 3 API POST requests to `/baskets`, updates the cart item states, and empties the database `sync_queue`.
    *   *WhatsApp Compiler Branching:* Mock a failed `/baskets` sync, trigger checkout, and inspect the opened `wa.me` URL query string. Verify it contains the complete, itemized text block fallback rather than crashing on missing server IDs.

---

### **Phase 5: Polish, Edge-Case Verification, & Hardening**
*   **Phase Objectives:**
    *   Establish high-integrity React Error Boundaries to catch rendering faults, preserving local application states.
    *   Implement Axios response interceptors to capture server conflicts dynamically (e.g. 422 stock conflicts and 409 team slug issues), displaying elegant custom warning layers.
    *   Build a temporary VTO pipeline that applies client-side canvas downsampling and WebP compression on user photos prior to uploading.
*   **Action Items:**
    *   [x] Create [ErrorBoundary.tsx](file:///c:/Users/JERRY%20JUSTICE/Desktop/Hackathon_Project/src/components/layout/ErrorBoundary.tsx) wrapping page roots to catch React component crashes, rendering an elegant luxury-styled recovery sheet.
    *   [x] Program out-of-stock resolution inside `syncEngine.ts`: if the server returns a `422 items_unavailable` error during synchronization, the system intercepts the error, marks the item status as `'OUT_OF_STOCK'` in IndexedDB, and alerts the user inside the cart UI to adjust their selection.
    *   [x] Create [imageCompressor.ts](file:///c:/Users/JERRY%20JUSTICE/Desktop/Hackathon_Project/src/utils/imageCompressor.ts) utilizing canvas APIs to resize photos to max 1024px dimensions and convert them to lightweight WebP files (<500KB) to ensure rapid uploads on poor mobile connections.
    *   [x] Build [TryOnPreview.tsx](file:///c:/Users/JERRY%20JUSTICE/Desktop/Hackathon_Project/src/components/try-on/TryOnPreview.tsx) integrating our compressed selfie flow with the external `fal.ai/IDM-VTON` dressing endpoint, displaying progress trackers, and caching returned result URLs in the IndexedDB VTO history.
*   **Testing & Verification Protocol:**
    *   *Image Compression Validation:* Upload a high-resolution 12MB portrait image. Check logs and confirm that the canvas output formats to WebP, downsizes to less than 500KB, and retains facial details.
    *   *Conflict Simulation:* Mock a `422` API error response on basket sync. Verify that the storefront displays a styled warning, marks the exact sold-out item inside the bag layout, and safely blocks WhatsApp checkouts until the item is adjusted.
    *   *VTO Status Polling:* Trigger a virtual try-on workflow online and confirm that loading indicators scale smoothly from "Uploading Selfie" to "Generating Ankara Fitting". Confirm that generated files are saved into Dexie's VTO tables for offline lookups.
