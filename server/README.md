# Akira

**A motorcycle service platform where AI does the diagnostics.**

Two processes. One API server handling HTTP, WebSocket, and SSE. One background worker consuming jobs from RabbitMQ. Between them: PostgreSQL with vector search, Redis for cross-process event streaming, and LangGraph orchestrating multi-step AI pipelines that pull from technical manuals, search the web, reason through repair plans, and match parts from inventory — all asynchronously, with real-time progress pushed back to the client.

```
Python  /  FastAPI  /  LangGraph  /  PostgreSQL + pgvector  /  RabbitMQ  /  Redis  /  Gemini
```

---

## What This System Actually Does

The backend serves two distinct AI products alongside standard CRUD operations:

**An AI chat assistant** that streams responses token-by-token over WebSocket, automatically titles conversations, and maintains a rolling summary so context survives indefinitely without blowing up the token budget.

**MIA (Mechanic Intelligence Assistant)** — a background pipeline that takes a service job request, fans out to simultaneously search internal technical manuals (RAG) and the open web (Tavily), feeds everything to an LLM that produces a structured repair plan with prioritized tasks, then enriches each suggested part with real inventory availability and pricing. The entire pipeline runs asynchronously via RabbitMQ with stage-by-stage progress streamed to the client through Redis Pub/Sub and SSE.

The remaining surface area is domain CRUD: customers, vehicles, mechanics, service jobs, and a RAG content management API for ingesting and searching PDF manuals.

---

## Architecture

![Backend Architecture Diagram](../resources/mermaid-backend-architecture.png)

The architecture splits into two processes that share infrastructure but never share memory:

**API Server** — Handles all client-facing traffic. Runs LangGraph chat workflows inline (streaming over WebSocket). For MIA jobs, it publishes a message to RabbitMQ and returns immediately. When clients want progress, it subscribes to a Redis Pub/Sub channel and streams SSE events.

**Worker** — Runs independently. Consumes from a durable RabbitMQ queue with `prefetch_count=1` for backpressure. Executes the full MIA LangGraph pipeline. Publishes progress events to Redis at each stage. On failure, implements application-level retry by acking, incrementing an `x-retry-count` header, and republishing — up to 3 retries before dead-lettering.

This separation means the API server never blocks on long-running AI work, and workers can be scaled independently.

### Three Request Patterns

**CRUD** — Synchronous. Request hits a router, passes through the service layer, touches PostgreSQL via an async session, returns.

**Chat** — Bidirectional streaming. Client connects via WebSocket (JWT in sub-protocol header). The API server runs the LangGraph ChatWorkflow, which calls `astream()` on Gemini, and forwards tokens back as JSON frames with `partial: true/false` markers.

**MIA** — Fully async. `POST /mia/service-jobs` publishes to RabbitMQ and returns `202`. The client opens an SSE connection to `/mia/service-jobs/{id}/status/stream`. The worker picks up the job, runs the pipeline, and publishes stage updates to a Redis channel (`sse:{job_id}`). The API server subscribes to that channel and relays events to the client. The worker and the API server never communicate directly.

---

## AI Workflows

Both are LangGraph `StateGraph` instances. Neither uses LLM-driven routing or tool-calling loops — the graph topology is fixed, and all routing decisions are rule-based.

### Chat

```
START ──► assistant (streaming)
              │
              ├── first 2 messages? ──► update_title ──┬── stale summary? ──► summarize ──► END
              │                                        └──► END
              ├── stale summary? ──► summarize ──► END
              └──► END
```

The interesting part isn't the graph — it's the context management. The system loads the last 15 messages from the database and injects a rolling conversation summary as a system message. When the conversation exceeds 5 messages and the previous summary checkpoint falls outside the current 15-message window, a new summary is generated incrementally from the old one. This gives the model context over the entire conversation history without scaling token usage linearly.

Thread titles are auto-generated from the first two messages and never regenerated after that.

### MIA

```
START ──► fetch job data from DB
              │
              ├──► RAG retrieval (parallel)  ──┐
              └──► web search (parallel)       ──┤
                                                 ├──► generate technical plan (fan-in)
                                                 │
                                                 └──► inventory lookup ──► END
```

The LLM doesn't just consume search queries — it *writes* them. The `retrieve_internal_knowledge` node asks the LLM to generate an optimized RAG query given the service job context, then executes it against pgvector. Same pattern for web search via Tavily. LangGraph handles the parallel fan-out and synchronization automatically.

The plan generation node receives all gathered context and produces a `TechnicalPlanResponse` — a Pydantic model with repair tasks, suggested parts, difficulty levels, and time estimates. The LLM receives the JSON schema in the prompt and the output is validated with `model_validate()`, using a dual-path extractor that checks for tool calls first, then falls back to raw JSON parsing.

The final node enriches each suggested part by running a vector similarity search against the parts inventory, scoring matches with a vehicle compatibility boost, and returning the best match plus alternatives with real pricing and availability.

Each node publishes SSE stage updates through a callback closure injected into the graph state.

### Provider Abstraction

All external AI services sit behind abstract interfaces:

```
BaseLLMClient           ──►  GeminiLLMClient (gemini-3-flash-preview)
BaseEmbeddingClient     ──►  GeminiEmbeddingClient (Vertex AI, dim 3072)
                        ──►  LMStudioEmbeddingClient (local, configurable)
BaseWebSearchClient     ──►  TavilyWebSearchClient (advanced, 5 results)
```

Embedding provider is swapped via a single config flag (`USE_LOCAL_EMBEDDINGS`). All clients use lazy singleton instantiation.

---

## Database and Vector Search

PostgreSQL serves double duty as the relational database and the vector store via pgvector.

### Data Model

```
Customer 1──* Vehicle 1──* ServiceJob *──1 Mechanic
ChatThread 1──* ChatMessage
ChatThread 1──* ChatSummary
PartInventory   (vector-searchable, standalone)
RagChunk        (vector-searchable, standalone)
```

All models are SQLModel classes (SQLAlchemy + Pydantic in one definition). The ORM layer is fully async via `asyncpg`. Schema is auto-created at startup — no Alembic migrations.

### RAG Ingestion

PDFs go through a four-stage pipeline:

1. **Extract** — `pypdf` pulls text page-by-page, strips NUL bytes, annotates page numbers
2. **Chunk** — `TextChunker` splits at sentence boundaries using `tiktoken` token counting (512-token chunks, 50-token overlap). Sentences are never split mid-sentence.
3. **Embed** — Batches of 100 chunks, 0.5s inter-batch delay, exponential backoff on 429s (3 retries at 2s/4s/6s)
4. **Store** — Each chunk becomes a `RagChunk` row with a pgvector embedding, indexed by source, vehicle model, and section

### RAG Retrieval

Queries are embedded and searched via cosine distance, filtered by vehicle model and section (case-insensitive ILIKE). What makes retrieval non-trivial: after finding the best-matching chunks, the system fetches neighboring chunks by `chunk_index` from the same source document — expanding context beyond the matched fragment. Results are formatted as annotated blocks with source and section metadata.

### Inventory Search

Parts matching works differently from document retrieval. The query is embedded and searched against `PartInventory`, but scores are adjusted: parts whose `compatible_models` list includes the target vehicle get a +0.08 compatibility boost. Results include a best match plus up to 3 alternatives, each with stock quantity, unit price, and availability status.

---

## Real-Time Communication

Two protocols, chosen for their specific communication patterns:

### WebSocket — Chat

Bidirectional. The client sends messages and receives streaming AI responses on the same persistent connection. Auth is handled by passing the Clerk JWT in the `Sec-WebSocket-Protocol` header. Connections are tracked in an in-memory map keyed by user ID.

The LangGraph workflow calls `astream()` on the LLM, and each yielded token is forwarded to the client as a JSON frame. A `partial` flag tells the client whether to keep accumulating or finalize the message.

### SSE — MIA Job Progress

Unidirectional, cross-process. The worker publishes to a Redis Pub/Sub channel; the API server subscribes and streams to the client. This works because SSE doesn't require the publisher and subscriber to be the same process — Redis bridges them.

Each job progresses through 6 stages with percentage markers:

```
Queued (0%) ──► Fetching Data (15%) ──► Researching (35%) ──►
Generating Plan (60%) ──► Checking Inventory (85%) ──► Done (100%)
```

The SSE stream sends keepalive comments every 120s to prevent proxy timeouts, and terminates cleanly with an explicit `close` event.

---

## Auth and Security

**Authentication** — Clerk handles identity. The backend's `ClerkAuthenticationMiddleware` extracts the Bearer token, verifies the JWT signature against a configured RSA public key, and sets `request.state.user_id`. Public routes (`/`, `/health`, `/docs` in dev) skip verification.

Auth is enforced across all three protocols:
- HTTP: `Authorization: Bearer` header
- WebSocket: JWT in `Sec-WebSocket-Protocol` header
- SSE: `Authorization: Bearer` header

**Rate Limiting** — Sliding window, 60 requests per 60 seconds. Keyed by `user:{user_id}` for authenticated requests, `ip:{client_ip}` for anonymous. Adds `X-RateLimit-*` headers to all responses. Currently in-memory only (not distributed).

---

## Error Handling

**Exceptions** — Custom hierarchy: `AppError` base, with `ConflictError` (duplicate resources) and `ValidationError` (business rule violations). Caught and translated to HTTP responses at the router layer.

**Request validation** — Pydantic models enforce constraints at the boundary: email format, string lengths, numeric ranges, file size limits (50MB for uploads, 1M chars for text, 2K for queries).

**Worker resilience** — Failed MIA jobs are retried up to 3 times with explicit retry counting via message headers. Each retry gets a fresh database session. After exhaustion, messages route to a dead-letter queue via a dedicated DLX exchange for post-mortem analysis.

---

## Running Locally

### Prerequisites

- Python 3.12+
- Poetry 1.8+ (including 2.x)
- PostgreSQL with pgvector
- Docker

### Setup

```bash
# Start RabbitMQ and Redis
docker compose up -d

# Install dependencies
cd server
poetry install

# Configure environment
cp .env.example .env  # Then fill in your API keys and credentials

# Start the API server
poetry run dev

# Start the worker (separate terminal)
poetry run worker

# Seed inventory data (optional)
poetry run python -m scripts.populate_db.seed_parts
```

The API server starts on `0.0.0.0:8000` with hot reload. The worker connects to RabbitMQ and waits for jobs.

### Required `.env`

```env
DATABASE_URL=postgresql://user:password@localhost:5432/akira
RABBITMQ_USER=akira
RABBITMQ_PASS=akira_dev
CLERK_JWT_PUBLIC_KEY=<your-clerk-rsa-public-key>
GEMINI_API_KEY=<your-gemini-api-key>
GCP_PROJECT_ID=<your-gcp-project>
VERTEX_SERVICE_ACCOUNT_JSON_PATH=creds/your-service-account.json
TAVILY_API_KEY=<your-tavily-api-key>
CORS_ORIGINS=["http://localhost:3000"]
```

<details>
<summary>All environment variables</summary>

| Variable | Required | Default | Description |
|----------|:--------:|---------|-------------|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `RABBITMQ_USER` | Yes | — | RabbitMQ username |
| `RABBITMQ_PASS` | Yes | — | RabbitMQ password |
| `RABBITMQ_HOST` | | `localhost` | RabbitMQ host |
| `RABBITMQ_PORT` | | `5672` | RabbitMQ port |
| `REDIS_HOST` | | `localhost` | Redis host |
| `REDIS_PORT` | | `6379` | Redis port |
| `GEMINI_API_KEY` | | — | Google Gemini API key |
| `GCP_PROJECT_ID` | | — | GCP project for Vertex AI |
| `VERTEX_SERVICE_ACCOUNT_JSON_PATH` | | — | GCP service account JSON path |
| `OPENAI_API_KEY` | | — | OpenAI API key (reserved) |
| `TAVILY_API_KEY` | | — | Tavily web search API key |
| `CLERK_JWT_PUBLIC_KEY` | | — | Clerk RSA public key |
| `CORS_ORIGINS` | | `[""]` | Allowed CORS origins |
| `ENVIRONMENT` | | `""` | Environment label |
| `LOG_LEVEL` | | `debug` | Logging level |
| `USE_LOCAL_EMBEDDINGS` | | `false` | Use LM Studio instead of Vertex AI |
| `LOCAL_EMBEDDING_DIMENSION` | | `1024` | Local embedding dimensions |
| `LMSTUDIO_EMBEDDING_URL` | | `http://127.0.0.1:1234` | LM Studio URL |
| `LMSTUDIO_EMBEDDING_MODEL` | | `text-embedding-qwen3-embedding-0.6b` | LM Studio model |
| `LANGSMITH_API_KEY` | | — | LangSmith API key |
| `LANGSMITH_ENDPOINT` | | `https://api.smith.langchain.com` | LangSmith endpoint |
| `LANGSMITH_PROJECT` | | — | LangSmith project |
| `LANGSMITH_TRACING` | | — | Enable tracing |
| `RATE_LIMIT_ENABLED` | | `true` | Enable rate limiter |
| `RATE_LIMIT_MAX_REQUESTS` | | `60` | Requests per window |
| `RATE_LIMIT_WINDOW_SECONDS` | | `60` | Window duration |
| `RATE_LIMIT_EXEMPT_PATHS` | | `[]` | Exempt path patterns |

</details>

---

## Scripts

```
poetry run dev          # API server — Uvicorn, hot reload, port 8000
poetry run worker       # RabbitMQ consumer — MIA pipeline worker
poetry run lint         # Ruff linter
poetry run lint-fix     # Ruff with auto-fix
poetry run format       # Ruff formatter
```