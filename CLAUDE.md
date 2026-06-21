# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What Clawix is

Clawix is a self-hosted, single-org, multi-agent AI orchestration platform. LLM-backed agents run inside isolated Docker containers and are reached through messaging channels (web WebSocket, Telegram, WhatsApp). A **primary agent** per user coordinates work and can **spawn sub-agents** (workers) to run focused tasks in parallel. The platform ships with industry "packs" made of skills + a pack manifest — currently 7, spanning finance, legal, NGO, home-build/construction, property management, property agency, and restaurant/F&B (`skills/packs/*.json`). Read `docs/SPEC.md` for the authoritative architecture; `docs/AGENTS.md`, `docs/SKILLS.md`, `docs/MEMORY.md`, `docs/GOVERNANCE.md`, `docs/PROVIDERS.md`, `docs/CONFIG.md`, `docs/MULTI-USERS.md`, `docs/SECURITY.md` cover subsystems in depth (`docs/README.md` is the index).

This fork is the **Clawix SME** flavor: `SME_Layout_Spec.md` at the repo root is the design/build spec for the SME marketing + landing surface (`packages/web/src/components/landing/sme/`, `lib/sme-data.ts`) and the five named domain agents below — read it before touching either.

## Monorepo layout

pnpm workspace (`packages/*`), Node ≥20, TypeScript strict, ESM throughout.

- `packages/shared` — `@clawix/shared`: types, Zod schemas, errors, logger, provider type contracts. **Must be built before the others** — `api` and `web` import its compiled `dist`. Exports are subpath-mapped (`@clawix/shared/types`, `/schemas`, `/errors`, `/logger`, `/providers`).
- `packages/api` — `@clawix/api`: NestJS + Fastify server. The engine, channels, auth, skills, packs, MCP, cron, Prisma all live here.
- `packages/web` — `@clawix/web`: Next.js 15 (App Router, React 19) dashboard. Talks to the API over REST + the `/ws/chat` WebSocket.

## Commands

Run from the repo root unless noted.

```bash
# Install / dev
pnpm install
pnpm run dev                 # all packages in parallel watch mode
pnpm --filter @clawix/web dev   # one package only

# Build (order enforced inside scripts: shared → prisma generate → rest)
pnpm run build

# Lint / format / types — what CI runs, in this order
pnpm run lint                # eslint . + typecheck
pnpm run lint:fix
pnpm run format:check        # prettier --check (CI fails on unformatted)
pnpm run format              # prettier --write
pnpm run typecheck           # builds shared, runs prisma generate, then tsc -b per package

# Tests (Vitest, workspace = packages/*/vitest.config.ts)
pnpm run test                # all
pnpm run test:coverage       # what CI runs
pnpm --filter @clawix/api test                       # one package
pnpm --filter @clawix/api exec vitest run path/to/file.test.ts   # one file
pnpm --filter @clawix/api exec vitest run -t "name"              # one test by name

# Database (Prisma, in @clawix/api)
pnpm run db:migrate          # migrate dev + generate
pnpm run db:seed
pnpm run db:reset            # destructive
pnpm run db:studio

# Docker stacks
pnpm run docker:dev          # docker-compose.dev.yml (postgres, redis, etc.)
pnpm run docker:prod
```

`typecheck` is **not** plain `tsc` — it first builds `@clawix/shared` and runs `prisma generate`, because both produce types the rest of the tree depends on. If you see missing-type errors after pulling, run `pnpm run typecheck` (or `pnpm --filter @clawix/shared build`) before debugging.

CI (`.github/workflows/ci.yml`) runs, in order: lint → format:check → typecheck → test:coverage. Match that locally before pushing.

## Engine architecture (`packages/api/src/engine`)

This is the heart of the system. The call path for one agent turn:

**`AgentRunnerService`** (`agent-runner.service.ts`) is the top-level orchestrator — it runs a single agent end-to-end (~22 documented steps: load `AgentDefinition`, check budget/provider, resolve a `MessageStore`, create an `AgentRun` row, build context, start a container, build the `ToolRegistry`, run the loop, persist messages, consolidate memory, record token usage). The header comment in that file is the canonical step-by-step; read it before changing run lifecycle, cancellation, or error handling.

- **`ReasoningLoop`** (`reasoning-loop.ts`) — the LLM ⇄ tool loop (default max 40 iterations, grace turn on limit). Wrapped in `recovery-loop.ts` for retry/recovery; errors classified by `error-classifier.ts`; runaway tool calls caught by `tool-loop-guard.ts`.
- **`ContextBuilderService`** — assembles the system prompt + history + skills + memory + worker list.
- **`SessionManagerService`** + `message-store/` — conversation persistence; `compressor.ts` / `microcompact.ts` / `memory-consolidation.service.ts` manage context-window pressure.
- **Containers** — `ContainerPoolService` keeps a warm pool (~50ms agent start), `ContainerRunner` execs tools inside. `mount-security.ts` validates every mount against an allowlist. `python-container-pool.service.ts` + `infra/docker/pypi-proxy` run Python with a package allowlist (`infra/python-allowlist/*.txt`).
- **Tools** (`engine/tools/`) — `file-io`, `shell`, `spawn` (sub-agents), `cron`, `web` (search providers), `browser` (local/Browserbase/CDP providers), `python`, `mcp`, `session`, `wiki`. Registered per-run via `tool-registry.ts`.
- **Providers** (`engine/providers/`) — `provider-factory.ts` picks anthropic / openai / openai-responses / gemini. **All LLM calls go through here** so tokens are counted (`budget-tracker.ts`, `token-counter.service.ts`).
- **Cron** — `cron-scheduler.service.ts` + `cron-task-processor.service.ts` run scheduled `Task`s through the same runner.

### Architectural invariants (do not violate)

- **No LLM calls outside `engine/providers/*`** — otherwise token accounting breaks.
- **No agent code runs on the host** — agents execute only inside Docker via `ContainerPoolService` / `ContainerRunner`.
- **Every container mount is validated** by `mount-security.ts`.
- **`AuditLog` is append-only** — there is no update/delete API surface for it.
- **Validate at the API boundary with Zod** — downstream code never reads raw `req.body`.

## API server conventions (NestJS)

- Global guard order in `app.module.ts` is deliberate and **must not be reordered**: `JwtAuthGuard` (populates `req.user`) → `RolesGuard` (checks role) → `PolicyThrottlerGuard` (reads `policyName`). An `AuditLogInterceptor` and `AppExceptionFilter` are also global.
- Modules are feature-folders under `src/` (auth, agents, tasks, skills, channels, chat, groups, mcp, wiki, tokens, audit, packs, etc.), each typically with an `index.ts` barrel and a `__tests__/` folder.
- Throttling uses Redis storage; policy limits resolve via `common/throttle.config.ts`.
- Circular deps between `AgentRunnerService` and `TaskExecutorService` are broken with string-token aliases (`'AgentRunnerService'` / `'TaskExecutorService'`) plus lazy `ModuleRef` resolution — follow that pattern rather than adding direct constructor injection.

## Channels (`src/channels`)

Pluggable adapters translate platform events into a shared `InboundMessage`/`OutboundMessage` contract. `ChannelRegistry` (factory) → `ChannelManagerService` (lifecycle, Redis pub/sub for async agent output) → `MessageRouterService` (ingress: user lookup, command detection, concurrency guard, session resolution, agent invocation). Per-channel secrets are AES-256-GCM encrypted via `channel-config-crypto.ts`. Telegram (grammy) and Web (`/ws/chat` WebSocket, JWT) and WhatsApp (baileys) are implemented; Slack is stubbed/pending.

## Data layer

Prisma schema at `packages/api/prisma/schema.prisma` (Postgres via `@prisma/adapter-pg`). Key models: `User`/`UserRole`, `AgentDefinition`/`AgentRole`/`AgentRun`, `UserAgent` (binds a user to exactly one primary agent + workspace path), `Session`/`SessionMessage`, `Task`/`TaskRun`, `Policy`, `TokenUsage`, `AuditLog`, `Group`/`GroupMember`, `WikiPage`/`WikiLink`/`WikiShare`, `Channel`, `McpServer`/`McpTool`/`McpConnection`, `Notification`, `SystemSettings`. Redis is used for cache, pub/sub, and throttler storage.

## Skills & Packs

- **Skills** live in `skills/builtin/<name>/SKILL.md` (loaded by `engine/skill-loader.service.ts`). Format reference: `reference/SKILL`, docs in `docs/SKILLS.md`.
- **Packs** are JSON manifests in `skills/packs/<industry>.json` (id, name, icon, skills, `agents`/`subagents`, `governance`, `inspirations`). Adding a pack needs no code — drop the skill folders + manifest and restart; the Explore page picks them up.
- **SME domain agents** — `packages/api/src/domain-agents.ts` defines one named `primary` `AgentDefinition` for 5 of the 7 packs (Accounts Assistant, Property Assistant, Restaurant Operations Assistant, Builder Assistant, Estate Agency Assistant — fin/property-mgmt/restaurant/builder/property-agency; legal and ngo define their primaries inline in the pack manifest instead). `bootstrap.ts` seeds them idempotently (created only if a primary of that name is missing); also creatable live via `POST /agents`. Specialization lives entirely in the system prompt — the skill loader exposes every file skill to every agent, so the prompt is what tells each one which skills to reach for.

## Conventions

- TypeScript strict, **no `any`** (README contract). `tsconfig.base.json` adds `noUncheckedIndexedAccess`, `noUnusedLocals/Parameters`, `noImplicitReturns`, `verbatimModuleSyntax`, `isolatedModules` — write code that satisfies these (e.g. index access can be `undefined`; use `import type` for type-only imports).
- ESM only; relative imports use `.js` extensions even from `.ts` sources (Node16 module resolution).
- Conventional commits (`feat:`, `fix:`, `refactor:`). Write Vitest tests for new features.
- Secrets (provider keys, channel tokens) are AES-256-GCM encrypted and never logged; use `scripts/encrypt-secret.mjs` and the crypto helpers rather than storing plaintext.

## Install / operate scripts

`scripts/install.mjs`, `update.mjs`, `uninstall.mjs` (exposed as `pnpm run install:clawix` etc.) drive the Dockerized prod stack and secret generation. The prod stack is `docker-compose.prod.yml`; dev infra is `docker-compose.dev.yml`. `.env.example` documents all config (also see `docs/CONFIG.md`).
