# Akira

**A motorcycle service platform with AI-driven diagnostics - LangGraph orchestrates multi-step reasoning pipelines that search technical manuals, query the web, generate structured repair plans, and match parts against real inventory, all streamed to the client in real time.**

---

## Overview

Akira is a full-stack system built for motorcycle workshops. It pairs two AI products with workshop management tooling:

**Akira Chat** - A conversational assistant that streams responses token-by-token over WebSocket. Conversations maintain context indefinitely through a rolling summarization strategy that compresses history into a system message, so token usage stays flat regardless of conversation length.

**MIA (Mechanic Intelligence Assistant)** - A diagnostic pipeline. A mechanic describes symptoms, and the system simultaneously searches internal technical manuals (RAG over pgvector) and the open web (Tavily), feeds the results to an LLM that produces a structured repair plan with prioritized tasks, difficulty levels, time estimates, and torque specs - then enriches each suggested part with real inventory availability, pricing, and alternatives. The entire pipeline runs asynchronously via RabbitMQ, with stage-by-stage progress streamed to the client through Redis Pub/Sub and SSE.

The platform also handles the operational surface: customers, vehicles, mechanics, service jobs, and a content management API for ingesting PDF manuals into the vector store.

What makes it architecturally interesting is the separation between the API server (handles all client traffic, runs chat inline) and the worker process (consumes MIA jobs from a queue, publishes progress to Redis). They share infrastructure but never share memory, which means the API never blocks on long-running AI work, and workers can scale independently.

---

## Key Capabilities

- Token-by-token chat streaming over WebSocket with automatic conversation titling and rolling summarization
- Multi-step diagnostic pipeline with parallel RAG + web search fan-out, structured plan generation, and inventory enrichment
- Asynchronous job processing via RabbitMQ with application-level retry (3 attempts) and dead-letter routing
- Cross-process real-time progress streaming through Redis Pub/Sub relayed as SSE events
- PDF ingestion pipeline: extract, sentence-boundary chunk, batch embed, store as pgvector rows
- Vector-based parts matching with vehicle compatibility scoring
- Clerk authentication enforced across all three protocols - HTTP, WebSocket (JWT in sub-protocol header), SSE
- LLM-generated search queries - the model writes optimized RAG and web search queries given the service job context
- Sliding-window rate limiting keyed by user ID or client IP
- Provider abstraction - swap embedding backends (Vertex AI / LM Studio - local models) with a single config flag

---

## How It Works

Three request patterns flow through the system:

**CRUD** - Synchronous REST. Request passes through Clerk auth and rate limiting, hits the service layer, touches PostgreSQL, returns.

**Chat** - The client opens a WebSocket connection (JWT in `Sec-WebSocket-Protocol` header). The API server runs a LangGraph `StateGraph` inline - the assistant node calls `astream()` on Gemini and forwards each token as a JSON frame. Conditional edges fire title generation (first 2 messages only) and summary refresh (when the 15-message context window drifts past the last summary checkpoint).

**MIA** - Fully async. The API server publishes a job to RabbitMQ and returns `202`. A separate worker process picks it up, runs the full LangGraph pipeline (fetch job data → parallel RAG + web search → generate plan → enrich parts), and publishes stage updates to a Redis channel at each node. The API server subscribes to that channel and relays events to the client via SSE. The worker and API server never communicate directly - Redis is the bridge.

```
Queued (0%) → Fetching Data (15%) → Researching (35%) →
Generating Plan (60%) → Checking Inventory (85%) → Done (100%)
```

---

## System Design Highlights

### Workflow Orchestration

All AI behavior is expressed as LangGraph StateGraphs — explicit, testable graphs that define each node, conditional edge, and data flow. The chat graph streams model tokens, auto-generates titles, and performs incremental summarization based on a sliding message window. The MIA graph parallelizes RAG and external web search, synchronizes retrieved evidence, generates a validated structured technical plan, and enriches parts with inventory matches. The graph-first design delivers predictable, observable orchestration, built-in streaming, and simple extensibility.

### RAG Pipeline

PDFs are chunked at sentence boundaries using `tiktoken` token counting (512-token chunks, 50-token overlap), embedded in batches of 100 with exponential backoff on rate limits, and stored as pgvector rows indexed by source, vehicle model, and section. At retrieval time, the system doesn't just return matched chunks - it fetches neighboring chunks by `chunk_index` from the same source document, expanding context beyond the matched fragment. The LLM generates the search query itself given the service job context, rather than using the raw user input.

### Real-Time Communication

WebSocket and SSE are used for different reasons, not interchangeably. WebSocket handles chat because it's bidirectional - the client sends messages and receives streaming responses on the same connection. SSE handles MIA progress because it's unidirectional and works cross-process - the worker publishes to Redis, the API server subscribes and streams. The SSE implementation uses `fetch()` + `ReadableStream` on the client instead of `EventSource` because `EventSource` doesn't support auth headers.

### Token Optimization

The chat system loads only the last 15 messages and injects a rolling summary as a system message. When the conversation grows beyond the summary's coverage window, a new summary is generated incrementally from the old one - not from scratch. This gives the model context over arbitrarily long conversations while keeping token usage bounded. Thread titles are generated once from the first two messages and never regenerated.

### Worker Resilience

Failed MIA jobs don't disappear. The worker acks the message, increments an `x-retry-count` header, and republishes - up to 3 retries with a fresh database session each time. After exhaustion, the message routes to a dead-letter queue via a dedicated DLX exchange for post-mortem analysis. The queue uses `prefetch_count=1` for backpressure so a single slow job doesn't starve the worker.

---

## Architecture

![Architecture Diagram](resources/mermaid-architecture-diagram.png)

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui, Zustand, TanStack React Query, Zod, react-hook-form |
| **Backend** | Python, FastAPI, SQLModel, asyncpg, Pydantic, Uvicorn |
| **AI** | LangGraph, LangChain, Gemini, Vertex AI Embeddings (dim 3072), LM Studio (local alternative), Tavily Web Search, tiktoken |
| **Infrastructure** | PostgreSQL + pgvector, RabbitMQ, Redis, Docker, Clerk (auth) |
| **Tooling** | Poetry, Ruff, Biome, Husky, LangSmith |

---

## Monorepo Structure

```
akira/
├── server/                 # Python backend - API server + worker
│   ├── app/
│   │   ├── api/v1/         # Route handlers (chat, customer, vehicle, mia, rag, mechanic)
│   │   ├── workflows/      # LangGraph state graphs (chat, MIA)
│   │   ├── services/       # Business logic layer
│   │   ├── clients/        # LLM, embedding, and web search client abstractions
│   │   ├── prompts/        # System prompts for all agents
│   │   ├── model/          # SQLModel definitions, request/response schemas
│   │   ├── core/           # Database, Redis, RabbitMQ, WebSocket, SSE infrastructure
│   │   ├── middleware/     # Auth, rate limiting, logging
│   │   ├── config/         # Logger configuration
│   │   ├── settings/       # Environment-driven settings
│   │   ├── constants/      # Domain constants and enums
│   │   └── utils/          # Auth, chat, RAG, inventory utilities
│   ├── scripts/            # Dev server, worker, linting, DB seeding
│   ├── migrations/         # Database migrations
│   └── creds/              # Service account credentials
├── webclient/              # Next.js frontend
│   └── src/
│       ├── app/            # App Router pages (chat, mia, auth)
│       ├── components/     # 101 components across 8 domains
│       ├── hooks/          # React Query wrappers, WebSocket, SSE
│       ├── stores/         # Zustand stores
│       ├── actions/        # API call functions
│       ├── services/       # Axios client with auth interceptors
│       ├── schema/         # Zod validation schemas
│       ├── types/          # TypeScript domain models
│       ├── constants/      # Color maps, stage configs
│       └── lib/            # Utilities
├── docker-compose.yml      # RabbitMQ + Redis
└── package.json            # Root - Husky pre-commit hooks
```

---

## Local Development Setup

### Prerequisites

- Python 3.12+, Poetry 2.x
- Node.js 18+, npm
- PostgreSQL with pgvector extension
- Docker

### Start Infrastructure

```bash
docker compose up -d          # RabbitMQ (5672, 15672) + Redis (6379)
```

### Backend

```bash
cd server
poetry install
cp .env.example .env          # Fill in DATABASE_URL, API keys, Clerk public key
poetry run dev                # API server - localhost:8000, hot reload
poetry run worker             # Worker - separate terminal
```

### Frontend

```bash
cd webclient
npm install
npm run dev                   # localhost:3000 - Turbopack + HMR
```

<details>
<summary>Required environment variables</summary>

**Backend** (`server/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `RABBITMQ_USER` / `RABBITMQ_PASS` | RabbitMQ credentials |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GCP_PROJECT_ID` | GCP project for Vertex AI embeddings |
| `VERTEX_SERVICE_ACCOUNT_JSON_PATH` | Service account JSON path |
| `TAVILY_API_KEY` | Tavily web search API key |
| `CLERK_JWT_PUBLIC_KEY` | Clerk RSA public key for JWT verification |
| `CORS_ORIGINS` | Allowed origins (e.g., `["http://localhost:3000"]`) |

**Frontend** (`webclient/.env`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend URL (e.g., `http://localhost:8000`) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |

</details>

---

## Deployment

The current setup runs locally with Docker Compose providing RabbitMQ and Redis. The backend includes a Dockerfile for containerized deployment. The architecture is designed for horizontal scaling - workers are stateless queue consumers that can be replicated independently of the API server, and Redis Pub/Sub bridges the cross-process communication gap regardless of how many worker instances are running.

---

## Future Improvements

- Distributed rate limiting via Redis (currently in-memory, single-process only)
- Alembic migrations (schema is currently auto-created at startup)
- WebSocket connection recovery with message replay on reconnect
- Multi-model LLM routing - use cheaper models for summarization and title generation, reserve the primary model for diagnostic reasoning
- Streaming for MIA plan generation (currently returns the full plan after completion)
- Frontend test coverage (test harness exists but no tests are implemented)
- CI/CD pipeline with automated linting, type checking, and deployment