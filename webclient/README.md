# Akira - Frontend

**The interface for a motorcycle service platform where AI handles diagnostics, chat knows your entire conversation history, and job progress streams in real time.**

A Next.js 15 application that connects to the backend through three protocols - REST for CRUD, WebSocket for bidirectional chat streaming, and SSE for background job progress. Zustand owns client state. React Query owns server state. Clerk auth flows through every layer - HTTP headers, WebSocket sub-protocols, and SSE fetch requests.

```
Next.js 15  /  React  /  TypeScript  /  Clerk  /  Zustand  /  TanStack React Query  /  Tailwind CSS  /  shadcn/ui
```

---

## Two Products, One Shell

**Akira Chat** - ChatGPT-style assistant for motorcycle enthusiasts. Messages stream token-by-token over WebSocket with exponential backoff reconnection. Conversations auto-title, persist across sessions, and maintain context indefinitely through backend summarization.

**MIA** - Workshop dashboard. Mechanics describe symptoms, the backend fans out to RAG + web search in parallel, an LLM generates a structured repair plan, and parts get matched against real inventory. The frontend opens an SSE stream and renders a live multi-stage progress tracker as the pipeline moves through each phase.

Plus: customer management, vehicle registration, mechanic roster - standard CRUD validated end-to-end with Zod.

---

## How It's Built

### State - Split by Ownership

**Server state** lives in React Query with hierarchical key factories per domain (`chatKeys`, `vehicleKeys`, etc.). Stale times are tuned per domain - chat threads: 30s, vehicles: 5min, mechanics: 10min. Dedicated invalidation hooks handle cross-domain cache busting (deleting a vehicle invalidates both vehicle and customer caches because customer records carry vehicle counts).

**Client state** is just two Zustand stores. `pendingMessageStore` bridges the "new chat" navigation gap - stores the message during the redirect from welcome screen to `/chat/{threadId}` so it isn't lost. `miaDataStore` holds mock data for offline UI development.

### API - One Axios Instance, Auth on Autopilot

A single Axios client with two interceptors: request adds Clerk Bearer tokens automatically, response handles 401 → refresh → retry. Wrapped in a typed `api` object that returns `T` directly - consumers never unwrap `.data`.

Actions are plain async functions (not Next.js Server Actions - no `"use server"` directive), consumed by React Query hooks to separate fetching from caching.

### Real-Time - Two Protocols, Two Reasons

**WebSocket for chat** - Bidirectional. JWT auth via `Sec-WebSocket-Protocol` header (browser API doesn't allow custom headers). Discriminated message types (`ai_response_stream`, `thread_update`, `error`). Exponential backoff reconnection (1s → 10s, max 5 attempts). Callbacks stored in refs for connection stability.

**SSE for MIA progress** - Unidirectional. Uses `fetch()` + `ReadableStream` instead of `EventSource` because `EventSource` can't send auth headers. Manual line-by-line parsing. Five event types as a discriminated union. `AbortController` cleanup on unmount.

### Auth - Clerk

Middleware protects all routes except `/`, `/sign-in`, `/sign-up`. Provider injects tokens into Axios. WebSocket sends JWT via sub-protocol. SSE sends it via fetch headers. Sign-up uses custom forms with Zod-validated passwords and Google/Apple OAuth.

### Forms - Zod All the Way Down

`react-hook-form` + `zodResolver`. Each domain has a schema file with base/create/update variants. Types are inferred from schemas (`z.infer<>`) - form values, API payloads, and validation are always in sync.

---

## Quick Start

```bash
cd webclient
npm install
npm run dev        # localhost:3000 - Turbopack + HMR
```

```
npm run build      # Production build
npm run lint       # Biome linter
npm run format     # Biome formatter
```

### Environment

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
CLERK_SECRET_KEY=<your-clerk-secret-key>
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### Tooling Notes

**Biome** replaces ESLint + Prettier. **Path aliases** - `@/*` maps to `./src/*`. **shadcn/ui** - new-york variant with Lucide icons, generated into `src/components/ui/`, fully editable.