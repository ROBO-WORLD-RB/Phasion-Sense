# MISSION: Tech Stack & File Structure Definition

## INSTRUCTIONS FOR AI AGENT
Read `Solution.md`. Your task is to translate that abstract solution blueprint into a concrete, realistic technical development environment. You must select the most efficient, modern, and lightweight frameworks, libraries, and databases suited for this specific architecture.

## TECHNICAL ENVIRONMENT DEFINITION

### 1. Technology Stack Selection & Justifications

* **Frontend Environment & Framework: Next.js 14 (App Router) + `next-pwa`**
  * *Justification:* Next.js 14 App Router provides the perfect bridge between fast initial load times and interactive client-side operations. We leverage React Server Components (RSC) to serve pre-cached, lightweight shell structures and static skeletons. We integrate `next-pwa` to configure custom Workbox Service Workers. The worker automatically intercepts lookbook fetches, custom fonts (e.g., *Outfit* and *Playfair Display* for the contemporary luxury feel), and stylesheets, caching them directly in the browser's Cache Storage. This enables instant load times on subsequent launches under total offline conditions. It is optimized specifically for the **`amina-stitches`** brand track to render vibrant, high-fidelity Ankara and Kente contemporary designs using Next.js `next/image` with WebP client-side conversion.
* **Local Database & Storage: Dexie.js (IndexedDB wrapper)**
  * *Justification:* Standard browser `localStorage` suffers from synchronous blocking behavior, a strict 5MB quota, and lack of relational search capabilities. `Dexie.js` provides an elegant, promise-based transactional interface over IndexedDB. It offers abundant storage capacity (up to 50%+ of free disk space) and native transaction boundaries. This is critical for storing:
    * Complex product arrays including heavy Ankara texture image paths and custom size metrics.
    * Base64/Blob representations of user-uploaded reference selfies for the Virtual Try-On flow.
    * A resilient, sequential outbound transaction sync queue database.
* **State Management & Network Interceptors: Zustand + Axios**
  * *Justification:* `Zustand` offers a lightweight, zero-boilerplate global state manager. It does not clutter the client bundle, maintaining the high performance required for competitive PWAs. It provides a simple, direct interface to synchronize in-memory view states with IndexedDB database writes. `Axios` is selected over raw `fetch` to easily inject global middleware:
    * *Axios Request Interceptor:* Seamlessly monitors network state; if offline, it catches the request and passes it directly to the IndexedDB write pipeline instead of letting the network request fail.
    * *Axios Response Interceptor:* Automatically handles HTTP status codes globally (e.g., catching `422 items_unavailable` and `409 team_slug_taken` errors) and maps them into localized client-side handlers without freezing the application UI.
* **External AI Try-On Integration: fal.ai (IDM-VTON) API Pipeline**
  * *Justification:* Virtual Try-On requires high-fidelity, garment-to-person diffusion that respects the complex patterns and vivid geometries of Ankara and Kente materials. `fal.ai/IDM-VTON` (Image-based Diﬀusion Model for Virtual Try-On) is selected for its superior preservation of clothing details (text, prints, collar styles). The pipeline integrates cleanly by compressing user selfies client-side, uploading them temporarily to a secure cloud asset bucket when a network connection is verified, and then invoking the `fal.ai` edge endpoint to perform the try-on diffusion using the product's high-res catalog image and the user's selfie. The result URL is then cached back into IndexedDB.

---

### 2. Complete Directory Tree

```text
.
├── public/
│   ├── icon-192x192.png
│   ├── icon-512x512.png
│   ├── manifest.json
│   └── sw.js
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── try-on/
│   │   │   └── page.tsx
│   │   └── cart/
│   │       └── page.tsx
│   ├── components/
│   │   ├── catalog/
│   │   │   ├── CatalogGrid.tsx
│   │   │   └── ProductCard.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── SyncIndicator.tsx
│   │   └── try-on/
│   │       ├── TryOnCamera.tsx
│   │       ├── TryOnHistory.tsx
│   │       └── TryOnPreview.tsx
│   ├── db/
│   │   ├── DexieDB.ts
│   │   └── schema.ts
│   ├── hooks/
│   │   ├── useNetwork.ts
│   │   └── useSync.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── syncEngine.ts
│   │   └── vtoService.ts
│   ├── store/
│   │   ├── cartStore.ts
│   │   └── catalogStore.ts
│   └── utils/
│       ├── currency.ts
│       ├── imageCompressor.ts
│       └── whatsappCompiler.ts
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

---

### 3. Detailed File Manifest

* **`src/db/DexieDB.ts`**
  * *Responsibility:* Initializes and configures the local IndexedDB database using Dexie.js. Establishes the core tables (`catalog`, `local_cart`, and `sync_queue`). It manages safe database upgrade paths and provides native transactional operations for adding, updating, or clearing records.
  * *Data Models:* `catalog` stores Ankara/Kente product cards, pricing, and size arrays; `local_cart` stores cart objects, quantities, selected size, and user embroidery/design notes; `sync_queue` stores pending transaction packets.
  * *Behavior on Network Toggle:* Fully offline-resilient. It serves as the local database buffer regardless of whether the network is offline or online. When the network shifts to online, it remains unaffected directly but allows the sync engine to securely fetch and purge pending queue rows.
* **`src/store/cartStore.ts`**
  * *Responsibility:* The Zustand-driven cart store that governs active state in-memory. Exposes actions like `addItem`, `updateQuantity`, and `removeItem`.
  * *Data Models:* Stores the current in-memory cart state list, optimistic checkout totals, and sync metadata.
  * *Behavior on Network Toggle:* When offline, it executes actions optimistically and writes directly to IndexedDB. When online, it triggers background sync processes via the sync hook and adjusts active item states (e.g. changing status from `LOCALLY_SAVED` to `SYNCHRONIZED`) once the server responds successfully.
* **`src/services/syncEngine.ts`**
  * *Responsibility:* The core engine that processes the `sync_queue`. It checks connectivity, pops pending mutations, executes backend REST calls using Axios, and manages transaction outcomes.
  * *Data Models:* Parses transaction logs from `sync_queue`. Maps payload schemas to `/baskets` and `/teams` formats.
  * *Behavior on Network Toggle:* Listens to browser online/offline events. When offline, it goes to sleep, pausing the queue. When online, it wakes up, runs a lightweight server ping, sequentially syncs all queued tasks, handles conflict resolution (e.g., item sold out, slug conflict), and cleans up IndexedDB upon completion.
* **`src/utils/whatsappCompiler.ts`**
  * *Responsibility:* A deterministic payload builder that formats local cart contents into a highly structured Kente/Ankara invoice text and generates the WhatsApp deep-link.
  * *Data Models:* Receives cart lists, computed prices, user customization notes, and the synchronized server basket ID.
  * *Behavior on Network Toggle:* Fully offline-first and executable without network. It constructs a complete checkout fallback link directly from the local cart state if the server is offline, ensuring the transaction is never lost, or incorporates the server basket ID if the basket was successfully synced online.
* **`src/components/try-on/TryOnPreview.tsx`**
  * *Responsibility:* Governs the Virtual Try-On presentation panel. Provides UI views for uploading a selfie, displaying rendering states, and comparing outfits.
  * *Data Models:* Handles the user's temporary selfie image Blob/base64 string and the generated clothes-diffusion model response from `fal.ai/IDM-VTON`.
  * *Behavior on Network Toggle:* When online, it allows initiating new try-on actions and shows upload/render progress bars. When offline, it disables the "Generate Try-On" button, replaces it with a styled *"VTO requires online connection"* warning, but keeps the local history tab interactive, loading previous try-ons from the Dexie catalog store.
* **`src/utils/imageCompressor.ts`**
  * *Responsibility:* Provides high-performance, client-side canvas-based image resizing and compression utilities for Ankara/Kente lookbook photos or user selfies prior to upload.
  * *Data Models:* Takes a standard File or Blob, creates an HTML5 Image element, downsamples it to a maximum dimension (e.g., 1024px), converts it to WebP at 0.8 quality, and returns the compressed Blob.
  * *Behavior on Network Toggle:* Operates entirely in browser CPU space, thus completely independent of network state. It ensures that when online, the user uploads minimal bytes, mitigating slow-connection upload failures.
