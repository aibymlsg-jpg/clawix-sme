# Scaling Clawix to 1,000 Users

"1,000 users" matters as **concurrent active sessions**, not registered users. The analysis below assumes ~10–15% concurrency (100–150 simultaneous agent runs), which is realistic for a productivity platform.

---

## Architecture: Current vs Suggested

### Current (single-node, default)

```
Users (browser / Telegram / WhatsApp)
         │
         ▼
  ┌─────────────┐
  │    nginx    │  (reverse proxy, TLS termination)
  └──────┬──────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│                  One Docker Host                    │
│                                                     │
│  ┌─────────────┐    ┌──────────┐   ┌─────────────┐  │
│  │ clawix-api  │    │ postgres │   │    redis    │  │
│  │ (NestJS ×1) │    │ (single) │   │   512 MB    │  │
│  └──────┬──────┘    └──────────┘   └─────────────┘  │
│         │ docker.sock                               │
│         ▼                                           │
│  ┌──────────────────────────────────────────────┐   │
│  │  Agent containers (max 30, same host)        │   │
│  │  [c1] [c2] [c3] ... [c30]                    │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  ┌──────────────┐   ┌──────────────┐                │
│  │clawix-browser│   │clawix-pypi-  │                │
│  │  (25 sess)   │   │   proxy      │                │
│  └──────────────┘   └──────────────┘                │
└─────────────────────────────────────────────────────┘
         │ HTTP (external API calls)
         ▼
┌─────────────────────────────┐
│  OpenAI / Anthropic / vLLM  │  (LLM inference — correctly external)
└─────────────────────────────┘
```

**Problem:** API, containers, Postgres, and Redis all share one host. Container ceiling is 30. Any spike kills everything.

---

### Suggested (1,000-user target)

```
Users (browser / Telegram / WhatsApp / Slack)
         │
         ▼
  ┌─────────────────────────┐
  │   CDN / Load Balancer   │  sticky sessions for WebSocket
  └────────────┬────────────┘
               │
       ┌───────┴───────┐
       ▼               ▼
┌─────────────┐  ┌─────────────┐
│  clawix-web │  │  clawix-web │  Next.js replicas (stateless)
│  replica 1  │  │  replica 2  │  served via CDN for static assets
└─────────────┘  └─────────────┘

       │ API calls / WebSocket
       ▼
┌──────────────────────────────────────────────┐
│              API Tier  (4 replicas)          │
│                                              │
│  ┌──────────────┐      ┌──────────────┐      │
│  │ clawix-api 1 │      │ clawix-api 2 │ ...  │
│  │NestJS+Fastify│      │NestJS+Fastify│      │
│  └──────┬───────┘      └──────┬───────┘      │
│         │   WebSocket fan-out via Redis      │
│         └──────────────┬───────┘             │
└────────────────────────│ ────────────────--──┘
                         │ BullMQ job dispatch
                         ▼
┌──────────────────────────────────────────────┐
│           Worker Fleet  (3–4 nodes)          │
│                                              │
│  ┌────────────────────┐                      │
│  │  Worker Node 1     │  24 vCPU / 96 GB     │
│  │  docker.sock       │                      │
│  │  [c1]..[c30]       │  30 agent containers │
│  └────────────────────┘                      │
│  ┌────────────────────┐                      │
│  │  Worker Node 2     │  24 vCPU / 96 GB     │
│  │  [c31]..[c60]      │                      │
│  └────────────────────┘                      │
│  ┌────────────────────┐                      │
│  │  Worker Node 3     │  24 vCPU / 96 GB     │
│  │  [c61]..[c90]      │                      │
│  └────────────────────┘                      │
│             ... up to ~120 concurrent        │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│              Data Tier                       │
│                                              │
│  ┌──────────────┐      ┌──────────────┐      │
│  │  PgBouncer   │─────▶│  PostgreSQL  │      │
│  │  (on each    │      │  4 vCPU/16GB │      │
│  │   API node)  │      │  NVMe SSD    │      │
│  └──────────────┘      └──────────────┘      │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │  Redis  2 GB  (pub/sub + BullMQ)     │    │
│  └──────────────────────────────────────┘    │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│           Browser Sidecar (2 nodes)          │
│  ┌──────────────┐   ┌──────────────┐         │
│  │  Browserless │   │  Browserless │         │
│  │   25 sess    │   │   25 sess    │         │
│  └──────────────┘   └──────────────┘         │
└──────────────────────────────────────────────┘

         │ HTTP (all LLM calls)
         ▼
┌─────────────────────────────┐
│  OpenAI / Anthropic / vLLM  │  LLM inference — always external
└─────────────────────────────┘
```

**Key differences from current:**

| | Current | Suggested |
|---|---|---|
| API instances | 1 | 4 (horizontally scaled) |
| Container host | Same as API | Dedicated worker fleet |
| Container ceiling | 30 total | 120+ (30 per worker node) |
| Job dispatch | In-process pool | BullMQ queue over Redis |
| DB connections | Direct (Prisma → Postgres) | PgBouncer → Postgres |
| Redis | 512 MB, single | 2 GB, dedicated |
| Browser | 1 sidecar | 2 sidecars behind LB |
| LLM | External API | External API (unchanged) |

**What does NOT change:** `reasoning-loop.ts`, channel adapters, skill system, RBAC guards, memory consolidation — all scale horizontally without modification.

---

## Current Hard Limits (single-node defaults)

| Bottleneck | Default | Notes |
|---|---|---|
| Warm agent containers | 20 (`maxWarmContainers`) | `container-pool.types.ts:21` |
| Ephemeral overflow | 10 (`maxEphemeralContainers`) | Same file, line 22 |
| Python containers | 20 (`PYTHON_POOL_MAX_SIZE`) | `python-container-pool.service.ts` |
| Browser sessions | 25 (`BROWSER_SIDECAR_MAX_SESSIONS`) | `docker-compose.prod.yml:177` |
| API instances | 1 | Single `clawix-api` container |
| Redis cap | 512 MB | `docker-compose.prod.yml:66` |

At 100 concurrent agent runs, the current single-node setup hits its container ceiling immediately.

---

## What Needs to Change

### 1. Horizontal API scaling (most critical)

The API is stateless by design — WebSocket events fan out via Redis pub/sub (`redis-pubsub.service.ts`). You can run multiple `clawix-api` replicas behind nginx or a load balancer with sticky sessions for WebSocket connections.

**Change in `docker-compose.prod.yml`:**
```yaml
api:
  deploy:
    replicas: 4   # each handles ~25 concurrent containers
```

Each replica manages its own container pool. With 4 replicas × 30 containers = 120 concurrent agent runs.

### 2. Container pool sizing per node

Each agent container needs roughly:
- **512 MB – 1 GB RAM** (base image + LLM context buffer)
- **0.25–0.5 CPU** (idle; spikes to 1–2 during tool execution)

Set via env vars on the API service:
```bash
POOL_MAX_WARM_CONTAINERS=30
POOL_MAX_EPHEMERAL_CONTAINERS=15
```

### 3. PostgreSQL connection pooling

NestJS + Prisma opens a connection per query. At 1,000 users Postgres hits its default `max_connections=100`.

**Required:** Add **PgBouncer** between API and Postgres:
```yaml
pgbouncer:
  image: pgbouncer/pgbouncer
  environment:
    POOL_MODE: transaction
    MAX_CLIENT_CONN: 500
    DEFAULT_POOL_SIZE: 25
```

Then point `DATABASE_URL` at PgBouncer. Postgres itself needs `max_connections=200` and at least 16 GB RAM for this load.

### 4. Redis

Bump from 512 MB to at least **2 GB** for pub/sub fan-out across replicas and session caching at this scale. If you add Redis Cluster, update `REDIS_URL` accordingly.

### 5. Browser sidecar

The `clawix-browser` sidecar has `mem_limit: 2g` and `MAX_CONCURRENT_SESSIONS: 25`. For web-browsing agents at scale, run **2–3 browser sidecar replicas** and add a load-balancing layer, or use a managed Browserless/Browserbase endpoint.

---

## Resource Requirements Summary

### Minimum viable (100–150 concurrent runs)

| Component | CPU | RAM | Notes |
|---|---|---|---|
| 4× API replicas | 2 vCPU each | 2 GB each | 4× NestJS processes |
| Docker host for containers | 16–32 vCPU | 64–128 GB | ~100 containers × 512 MB–1 GB each |
| PostgreSQL + PgBouncer | 4 vCPU | 16 GB | With connection pooling |
| Redis | 2 vCPU | 4 GB | Pub/sub + session cache |
| Browser sidecar (2×) | 2 vCPU each | 4 GB each | 25 sessions each |
| nginx proxy | 2 vCPU | 1 GB | |
| **Total** | **~50 vCPU** | **~160 GB** | |

### Recommended cloud equivalent

- **AWS**: `r6i.8xlarge` (32 vCPU / 256 GB) as the Docker host + `db.r6g.2xlarge` RDS Postgres + `cache.r6g.large` ElastiCache Redis
- **GCP**: `n2-highmem-32` + Cloud SQL + Memorystore
- **Hetzner** (self-hosted, cheapest): 3× `AX102` (24-core / 128 GB) in a Swarm/K8s cluster

---

## What Doesn't Need to Change

- The **reasoning loop** (`reasoning-loop.ts`) — it's async and scales per-container.
- The **channel adapters** — Telegram/WhatsApp adapters are stateless.
- The **skill system** — skills are filesystem reads, no shared state.
- The **JWT → Roles → Throttler guard order** in `app.module.ts` — works fine horizontally.

---

## Key Config Levers

```bash
# Per API instance (in .env or docker-compose env block)
POOL_MAX_WARM_CONTAINERS=30
POOL_MAX_EPHEMERAL_CONTAINERS=15
POOL_IDLE_TIMEOUT_SEC=180        # reclaim idle containers faster under load
POOL_MAX_CONTAINER_LIFETIME_SEC=1800

# Python pool
PYTHON_POOL_MAX_SIZE=20
PYTHON_POOL_IDLE_TIMEOUT_SEC=120

# Browser
BROWSER_SIDECAR_MAX_SESSIONS=25  # per sidecar instance
```

The biggest single win is **horizontal API scaling** — the architecture already supports it (Redis pub/sub, stateless API, no shared in-process state). Everything else is tuning.
