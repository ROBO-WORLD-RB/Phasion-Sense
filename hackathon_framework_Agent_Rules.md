# SYSTEM RULES: Engineering Standards & Guardrails

## 1. ARCHITECTURAL MANDATE: OFFLINE-FIRST
You must design and implement every layer under the absolute assumption that network connectivity is volatile, slow, or totally non-existent. Cloud dependencies are secondary syncing targets, never runtime requirements.
- **Local Storage Primacy:** Every transaction, record creation, or modification must successfully commit to local persistent storage (e.g., SQLite, local file-caches, IndexedDB) before any network call is initiated.
- **Optimistic UI Execution:** The user interface must reflect mutations immediately using local or cached state. Never block the layout or UI interactivity waiting for an asynchronous network response (`await fetch`).
- **Resilient Sync Queues:** Outbound mutations must be tracked in a transaction queue. If an action fails due to offline state, catch it immediately, preserve it inside a persistent sync queue, and resume processing gracefully once connectivity changes are verified.
- **Runtime Resource Self-Containment:** Do not dynamically pull heavy assets, engines, or scripts via remote endpoints/CDNs at runtime. Everything required for base operations must be packaged locally.

## 2. EXPLICIT ERROR HANDLING & RESILIENCE
Silent errors or generic handling blocks (`catch (e) {}`) are strictly banned. The system must remain stable, informative, and self-healing.
- **Granular Isolation:** Wrap all async operations, IO streams, and modular components in robust try/catch blocks or specialized UI Error Boundaries.
- **Fallback Configurations:** If a severe runtime error occurs, the system must immediately gracefully degrade to a safe backup state and render actionable feedback to the user rather than freezing or breaking.
- **Structured Debug Logs:** Every catch block must output structured, contextual error tracing logs (including function name, local state snapshots, and error cause) to make debugging instantaneous during deep execution loops.

## 3. CLEAN CODE, TYPES, & ARCHITECTURAL PATTERNS
Speed during rapid development is not a justification for architectural decay. Code must be highly maintainable and clean.
- **Strict Separation of Concerns:** Keep core business state, schema interfaces, database access objects, and UI components separated. Monolithic files performing mixed responsibilities are prohibited.
- **Uncompromising Type Safety:** If using typed systems (e.g., TypeScript), the use of `any` or explicit casting bypasses is entirely banned. Type all data models, sync packets, parameters, and states explicitly.
- **Intelligent Naming & Explanations:** Use explicit semantic naming patterns that reveal engineering intent (e.g., `enqueuePendingSyncTransaction()` over `doSync()`). Code comments must focus purely on *why* non-obvious architecture exists, not *what* the syntax is doing.
- **Zero Waste Dependencies:** Do not add third-party packages or modules for simple utilities that can be written natively in clean, high-performance local code in less than 30 lines.

## 4. CONSTRAINTS COMPLIANCE CHECK
You are required to evaluate all generated code blocks against these rules before presenting them. If a proposed implementation breaks local-first paradigms, skips error context, or mixes logic patterns, you must halt execution, explain the compliance risk, and present the corrected implementation.
