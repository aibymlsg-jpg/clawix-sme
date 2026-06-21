# Clawix SME · Agentic Intelligence for Small Business

## Layout Description & Claude Code Build Instructions

> **Purpose of this document**: Hand this file to Claude Code and instruct it to build the Next.js / Tailwind frontend for `clawix-sme.aibyml.com`. All sections include design intent, copy, component structure, and data shapes. Claude Code should follow this spec exactly; where a decision is left open it is marked `[DECIDE]`.

---

## 0 · Project Identity

| Field                  | Value                                                                                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Product name**       | Clawix SME                                                                                                                                     |
| **Tagline**            | _Your business, backed by a team of agents_                                                                                                    |
| **Target users**       | Owner-operators of small builders, property agencies, property management firms, small restaurants, and accounting practices in HK / SG / APAC |
| **Emotional register** | Reassuring, plain-spoken, quietly confident — the feeling of having a capable back-office team without the overhead                            |
| **Repo to mirror**     | `github.com/aibyml-ngo/clawix-account` (conversations page, agent examples, skill set patterns)                                                |
| **Reference frontend** | `https://accountclawix.aibyml.com` (hero layout, how-it-works flow, trust section)                                                             |
| **Framework**          | Next.js 14 (App Router), Tailwind CSS, TypeScript                                                                                              |
| **Deployment**         | Vercel                                                                                                                                         |

---

## 1 · Design Token System

### 1.1 Colour Palette

```css
/* globals.css — add to :root */
--clr-midnight: #0f1523; /* page background, nav */
--clr-slate: #1c2333; /* card backgrounds */
--clr-mist: #2e3a50; /* borders, dividers */
--clr-amber: #f5a623; /* primary accent — warmth, human, trade */
--clr-jade: #2ecc9a; /* success states, agent-ready indicators */
--clr-coral: #e8584a; /* review-required / alert badges */
--clr-snow: #f0f4fa; /* body text */
--clr-fog: #8a96a8; /* secondary text, captions */
--clr-glass: rgba(255, 255, 255, 0.04); /* card glassmorphism */
```

**Design rationale**: Deep midnight + warm amber speaks to trades and hospitality without feeling fintech-cold. Jade confirms agent readiness. Coral catches human attention at review gates — echoing the HITL philosophy baked into every Clawix system.

### 1.2 Typography

```css
/* Use via next/font or @import in globals.css */
--font-display: 'Plus Jakarta Sans', sans-serif; /* headlines, hero */
--font-body: 'Inter', sans-serif; /* body, UI labels */
--font-mono: 'JetBrains Mono', monospace; /* agent task streams */
```

### 1.3 Spacing & Radius

```css
--radius-card: 12px;
--radius-badge: 6px;
--section-gap: 96px; /* between major sections on desktop */
--card-pad: 28px;
```

---

## 2 · Site Architecture

```
/                    ← Landing page (this spec)
/login               ← Auth (reuse from clawix-account pattern)
/conversations       ← Main agent chat UI
/agents              ← Agent directory & examples
/skills              ← Skill set browser
/dashboard           ← Business overview (future)
```

---

## 3 · Page: Landing (`/`)

### 3.1 Navigation Bar

**Component**: `<Navbar />`  
**Behaviour**: Sticky, blurs background on scroll. Transparent at top, `--clr-midnight` at scroll > 40px.

```
[ Logo: 🏗 Clawix SME ]   [ How it works ][ Our Agents ][ Skills ][ Trust ]   [ EN / 中 ]   [ Sign in ]  [ Try free → ]
```

- Logo: Emoji icon + wordmark in `--font-display` weight 700, colour `--clr-snow`
- Nav links: `--font-body` 14px, `--clr-fog`, hover `--clr-snow`
- Language toggle: `EN` / `中文` — plain text switcher (i18n ready, no implementation required in v1)
- **Sign in**: ghost button, border `--clr-mist`
- **Try free**: filled button, background `--clr-amber`, text `--clr-midnight`, weight 600

---

### 3.2 Hero Section

**Component**: `<HeroSection />`  
**Layout**: Full viewport height on desktop, auto on mobile. Two columns: left = copy, right = animated agent task panel.

#### Left column — Copy

```
EYEBROW (small caps, --clr-amber, 12px tracking-widest)
Agentic AI · Built for real business

H1 (--font-display, 56px desktop / 36px mobile, --clr-snow, weight 800)
Your business,
backed by a team
of agents.

BODY (--font-body, 18px, --clr-fog, max-width 460px)
Ask in plain English. Specialist agents handle the
quotes, bookings, tenancy records, stock counts, and
month-end close — then hand you a sourced draft to
review and approve. Your decisions. Their legwork.

CTA ROW
[ Open the workspace → ]   [ See how it works ↓ ]
```

- Primary CTA: `--clr-amber` fill, links to `/conversations`
- Secondary CTA: text-link with arrow, anchor-scrolls to `#how`

#### Right column — Animated agent task panel

Render a mock "live task stream" card that loops through five business scenarios. Use CSS keyframe fade/slide between them. Each scenario shows:

```
┌──────────────────────────────────────────────┐
│  request · [scenario label]                  │
│                                              │
│  "[Plain English task the owner typed]"      │
│                                              │
│  ● agent-name · task description   ✅        │
│  ● agent-name · task description   ✅        │
│  ● agent-name · task description   ⏳        │
│  ● agent-name · task description   ···       │
│                                              │
│  [status badge] · confidence Medium          │
│  🔴 review before sending                   │
└──────────────────────────────────────────────┘
```

**Five rotating scenarios** (cycle every 4 s):

| #   | Label                          | Owner request                                                                  | Agents shown                                                       |
| --- | ------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| 1   | 🏗 Builder · Quote             | "Draft the quote for the Kowloon Tong renovation — materials, labour, margin." | quoting · material costs ✅ · labour schedule ✅ · margin check ⏳ |
| 2   | 🏠 Property Agency · Listing   | "Prepare the listing for Unit 12B, photos sorted, tenancy terms drafted."      | listing-writer ✅ · photo-brief ✅ · tenancy-drafter ⏳            |
| 3   | 🏢 Property Mgmt · Maintenance | "Log the plumbing fault at Block C, assign contractor, notify tenant."         | fault-logger ✅ · contractor-match ✅ · tenant-notify ⏳           |
| 4   | 🍜 Restaurant · Orders         | "Reconcile today's orders with stock, flag what to reorder before Saturday."   | pos-reader ✅ · stock-check ✅ · reorder-draft ⏳                  |
| 5   | 📊 Accounting · Month-end      | "Close April — draft the entries, reconcile the bank, build the pack."         | bookkeeping ✅ · reconciliation ✅ · reporting ⏳                  |

Card styling: `--clr-slate` background, `--clr-mist` border, `--radius-card`, inner font `--font-mono` 13px for task rows, amber left-border stripe.

**Pill badges below hero** (static row, centred):

```
🏗 quotes & contracts   🏠 property listings   🏢 maintenance logs   🍜 stock & reorders   📊 month-end close   🔒 self-hosted
```

---

### 3.3 Social Proof / Context Strip

**Component**: `<ContextStrip />`  
Thin horizontal band, `--clr-slate` background.

```
Trusted by owner-operators across Hong Kong · Singapore · APAC
Built on the Clawix multi-agent platform · Self-hosted · Human-in-the-loop
```

Centred, `--clr-fog` 14px. No fake logos in v1.

---

### 3.4 How It Works — Section `#how`

**Component**: `<HowItWorks />`  
Three steps, horizontal on desktop, stacked on mobile. Each step has an icon zone, a step label, a headline, and body copy.

```
Section heading (--font-display, 36px, --clr-snow, centred)
Ask once. Agents handle the detail. You decide.
```

| Step                 | Icon | Headline                               | Body                                                                                                                                                                                      |
| -------------------- | ---- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 · Ask              | 💬   | **Tell it what you need**              | Type a task in plain English — "Chase the outstanding invoice for Mr Chan" or "Rebook Table 4 for Friday." No forms. No dropdowns. The coordinator reads your intent and routes the work. |
| 2 · Dispatch & Draft | ⚡   | **Agents get to work**                 | The right specialists — quoting, tenancy, maintenance, kitchen ops, bookkeeping — spin up in parallel, pull your documents and records, and assemble a sourced draft ready for your eyes. |
| 3 · Review & Act     | ✅   | **You approve before anything leaves** | Every draft arrives with its sources, a confidence level, and a human-review gate. You press send, post the entry, or assign the contractor — never the agents alone.                     |

Step card styling: `--clr-slate` background, top `4px` solid `--clr-amber` border, `--radius-card`. Step number as large faint numeral background watermark (`--clr-mist`, 120px, positioned top-right of card).

---

### 3.5 Business Sectors — Section `#sectors`

**Component**: `<SectorGrid />`  
Five sector cards in a responsive grid (5-col desktop → 2-col tablet → 1-col mobile).

```
Section heading
Five industries. One platform. One place to ask.
```

Each card:

```
┌─────────────────────────┐
│   [EMOJI ICON]          │
│   Sector name           │
│   ─────────────────     │
│   What agents handle:   │
│   · task 1              │
│   · task 2              │
│   · task 3              │
│   · task 4              │
│                         │
│  [ See agent pack → ]   │
└─────────────────────────┘
```

**Card data**:

```typescript
const sectors = [
  {
    emoji: '🏗',
    name: 'Small Builders & Contractors',
    handle: [
      'Quote drafting from scope of works',
      'Subcontractor scheduling & reminders',
      'Variation order tracking',
      'Invoice generation & follow-up',
    ],
    agentPack: 'builder',
    accent: '#F5A623',
  },
  {
    emoji: '🏠',
    name: 'Property Agency',
    handle: [
      'Listing copy & photo brief',
      'Tenancy agreement drafting',
      'Viewing schedule coordination',
      'Commission & pipeline tracking',
    ],
    agentPack: 'property-agency',
    accent: '#2ECC9A',
  },
  {
    emoji: '🏢',
    name: 'Property Management',
    handle: [
      'Maintenance fault logging & routing',
      'Contractor assignment & follow-up',
      'Tenant communication drafts',
      'Service charge reconciliation',
    ],
    agentPack: 'property-mgmt',
    accent: '#7C9EF5',
  },
  {
    emoji: '🍜',
    name: 'Restaurant & F&B',
    handle: [
      'Daily stock reconciliation',
      'Supplier reorder drafts',
      'Reservation management',
      'Petty cash & daily takings log',
    ],
    agentPack: 'restaurant',
    accent: '#E8584A',
  },
  {
    emoji: '📊',
    name: 'Accounting Practice',
    handle: [
      'Journal entry drafting from documents',
      'Bank reconciliation',
      'Month-end close pack',
      'AP/AR aging & collection notes',
    ],
    agentPack: 'accounting',
    accent: '#F5A623',
  },
];
```

CTA link per card routes to `/agents?pack=[agentPack]`.

---

### 3.6 Agent Team Showcase — Section `#agents`

**Component**: `<AgentShowcase />`

```
Section heading
Meet your back-office team.

Subheading (--clr-fog)
Each agent is a specialist. One coordinator makes sure they work together.
```

Display the **Clawix SME Orchestrator** at the top as a wide hero card, then a grid of specialist sub-agents below.

#### Orchestrator card (full width)

```
┌──────────────────────────────────────────────────────────────┐
│  🧠  NEXUS · SME Orchestrator                                │
│  Reads your intent → plans the work → routes to specialists  │
│  → assembles the draft → holds for your review               │
│                                                              │
│  Skills: intent-parsing · task-routing · confidence-scoring  │
│          source-tracing · HITL gate management               │
└──────────────────────────────────────────────────────────────┘
```

#### Sub-agent grid (3-col desktop, 2-col tablet, 1-col mobile)

Each agent chip:

```
┌──────────────────────────┐
│  [EMOJI]  Agent Name     │
│  ─────────────────────   │
│  What it does (2 lines)  │
│                          │
│  Skills used:            │
│  [badge] [badge] [badge] │
└──────────────────────────┘
```

**Agent data** (use this as the `agents[]` array):

```typescript
const agents = [
  // ── BUILDER PACK ──
  {
    id: 'quoter',
    sector: 'builder',
    emoji: '📋',
    name: 'QuoteCraft',
    does: 'Drafts itemised quotes from your scope of works — materials, labour, margins — ready for your sign-off.',
    skills: ['document-reader', 'pricing-db', 'template-writer'],
  },
  {
    id: 'scheduler',
    sector: 'builder',
    emoji: '📅',
    name: 'SiteSync',
    does: 'Builds subcontractor schedules, sends reminders, and surfaces conflicts before they become delays.',
    skills: ['calendar-mcp', 'sms-notify', 'gantt-builder'],
  },
  {
    id: 'invoice',
    sector: 'builder',
    emoji: '🧾',
    name: 'InvoiceBot',
    does: 'Generates invoices from completed works, chases outstanding payments, and logs receipts.',
    skills: ['template-writer', 'email-drafter', 'ledger-writer'],
  },

  // ── PROPERTY AGENCY PACK ──
  {
    id: 'listing',
    sector: 'property-agency',
    emoji: '✍️',
    name: 'ListingPro',
    does: 'Writes listing copy, recommends photo angles, and prepares the MLS-ready data sheet from your property notes.',
    skills: ['copywriter', 'photo-brief', 'portal-formatter'],
  },
  {
    id: 'tenancy',
    sector: 'property-agency',
    emoji: '📄',
    name: 'TenancyDrafter',
    does: 'Drafts tenancy agreements from standard templates, flags non-standard clauses, and prepares stamp duty notes.',
    skills: ['legal-template', 'clause-checker', 'pdf-builder'],
  },
  {
    id: 'viewing',
    sector: 'property-agency',
    emoji: '🗓',
    name: 'ViewingSync',
    does: 'Coordinates viewing slots, confirms with prospects, and updates your pipeline without double-booking.',
    skills: ['calendar-mcp', 'email-drafter', 'crm-writer'],
  },

  // ── PROPERTY MANAGEMENT PACK ──
  {
    id: 'faultlog',
    sector: 'property-mgmt',
    emoji: '🔧',
    name: 'FaultLogger',
    does: 'Logs maintenance faults, classifies urgency, assigns to the right contractor, and notifies the tenant.',
    skills: ['form-reader', 'urgency-classifier', 'sms-notify'],
  },
  {
    id: 'contractor',
    sector: 'property-mgmt',
    emoji: '🏗',
    name: 'ContractorMatch',
    does: 'Matches faults to your approved contractor list, drafts the work order, and follows up on completion.',
    skills: ['contractor-db', 'email-drafter', 'work-order-writer'],
  },
  {
    id: 'servicecharge',
    sector: 'property-mgmt',
    emoji: '💰',
    name: 'ChargeReconciler',
    does: 'Reconciles service charge receipts against budgets, flags shortfalls, and drafts the annual statement.',
    skills: ['ledger-reader', 'reconciler', 'report-builder'],
  },

  // ── RESTAURANT PACK ──
  {
    id: 'stock',
    sector: 'restaurant',
    emoji: '📦',
    name: 'StockSense',
    does: 'Reads your POS and delivery notes, computes daily variance, and flags what to reorder before you run out.',
    skills: ['pos-reader', 'stock-calc', 'reorder-drafter'],
  },
  {
    id: 'supplier',
    sector: 'restaurant',
    emoji: '🚚',
    name: 'SupplierRelay',
    does: 'Drafts reorder messages to each supplier in their preferred format — WhatsApp, email, or fax template.',
    skills: ['email-drafter', 'whatsapp-notify', 'supplier-db'],
  },
  {
    id: 'reservation',
    sector: 'restaurant',
    emoji: '🍽',
    name: 'TableSync',
    does: 'Manages reservations, sends confirmation messages, and updates the floor plan without clashes.',
    skills: ['calendar-mcp', 'sms-notify', 'floor-planner'],
  },

  // ── ACCOUNTING PACK ──
  {
    id: 'bookkeeping',
    sector: 'accounting',
    emoji: '📚',
    name: 'BookBot',
    does: 'Drafts journal entries from invoices, receipts, and bank lines — coded to your chart of accounts.',
    skills: ['ocr-reader', 'gl-coder', 'journal-writer'],
  },
  {
    id: 'reconciler',
    sector: 'accounting',
    emoji: '🔁',
    name: 'Reconciler',
    does: 'Matches bank transactions to ledger entries, flags unmatched lines, and builds the reconciliation schedule.',
    skills: ['bank-reader', 'ledger-reader', 'match-engine'],
  },
  {
    id: 'reporter',
    sector: 'accounting',
    emoji: '📊',
    name: 'CloseBuilder',
    does: 'Assembles the month-end pack — trial balance, P&L, and cash-flow — with every figure traced to a source.',
    skills: ['report-builder', 'tb-compiler', 'pdf-builder'],
  },
];
```

---

### 3.7 Skills Browser — Section `#skills`

**Component**: `<SkillsBrowser />`  
Filterable grid of skill badges. Skills are the atomic capabilities agents compose from (mirroring the SKILL.md pattern in `clawix-account` repo).

```
Section heading
Skills that power every agent.

Filter tabs: [ All ] [ Documents ] [ Communication ] [ Finance ] [ Calendar ] [ Notify ]
```

Skill card (compact chip style):

```
[ 📄 document-reader ]  [ ✉️ email-drafter ]  [ 📊 report-builder ]
[ 🔁 reconciler ]       [ 📅 calendar-mcp ]   [ 📱 sms-notify ]
[ 🔍 ocr-reader ]       [ 📋 template-writer ] [ 🗂 ledger-reader ]
[ 💬 whatsapp-notify ]  [ 🧮 stock-calc ]      [ ⚖️ clause-checker ]
```

Each chip: `--clr-slate` background, `--clr-mist` border, `--clr-fog` text. On hover: `--clr-amber` border, `--clr-snow` text.

Below the grid, a callout box:

```
┌──────────────────────────────────────────────────────────────┐
│  🔧  Build your own skill                                    │
│  Every skill is a plain-text SKILL.md file you own.          │
│  Add a custom pricing rule, a signature template, or a       │
│  supplier format — the platform picks it up automatically.   │
│                                                              │
│  [ Read the skill docs → ]                                   │
└──────────────────────────────────────────────────────────────┘
```

---

### 3.8 Trust Section — Section `#trust`

**Component**: `<TrustSection />`  
Mirrors the "Trustworthy by construction" block from accountclawix. Six trust pillars in a 3×2 grid.

```
Section heading (centred)
Trustworthy by design.
Not guidelines — rules every agent enforces on every run.
```

| Icon | Pillar                            | Body                                                                                                                                                             |
| ---- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✋   | **Drafts, not actions**           | No quote is sent, no payment released, and no message goes to a tenant until a person approves it. Every agent output waits at a human gate.                     |
| 🔗   | **Trace it or compute it**        | Every figure comes from a source document or a calculation. The agents never fill in plausible-looking numbers.                                                  |
| 🔒   | **Your data stays yours**         | Client records, supplier contacts, and business history are hosted on infrastructure you control — never pooled or used to train a shared model.                 |
| 🧱   | **Agents run in isolation**       | Each specialist agent runs in its own container. A restaurant agent cannot see a property management record. Cross-client leakage is architecturally impossible. |
| 📋   | **Full audit trail**              | Every action is logged with a timestamp, agent ID, input, output, and confidence score. You can trace any decision back to the second it was made.               |
| 👤   | **You post. You send. You sign.** | Agents surface the draft. You make the call. Consequential actions — sending emails, filing documents, posting entries — require your explicit approval.         |

Card styling: `--clr-slate` background, left `3px` border in `--clr-jade`, `--radius-card`, icon 24px, headline `--font-display` 16px weight 600.

---

### 3.9 Conversation Preview — Section `#preview`

**Component**: `<ConversationPreview />`  
A static screenshot-style mockup of the `/conversations` page, showing the chat interface in context. Renders as an HTML replica (not an image) so it stays crisp and themeable.

**Layout of the inner mockup**:

```
┌─────────────────────────────────────────────────────────────┐
│  SIDEBAR (220px)          │  CHAT AREA                      │
│  ─────────────────────    │  ─────────────────────────────   │
│  + New conversation       │                                  │
│                           │  [agent typing indicator]        │
│  Recent                   │                                  │
│  · March close pack  ✅   │  USER: Draft a quote for the    │
│  · Unit 12B listing  ✅   │  Wong's kitchen renovation —    │
│  · Saturday reorder  ✅   │  tiles, labour, 15% margin.     │
│  · Plumbing – Blk C  🔴   │                                  │
│                           │  NEXUS: Routing to QuoteCraft…  │
│  Agents                   │                                  │
│  · QuoteCraft        ●    │  QuoteCraft: Draft ready.        │
│  · StockSense        ●    │  Tiles: HK$12,400               │
│  · BookBot           ●    │  Labour: HK$8,200               │
│                           │  Margin (15%): HK$3,090         │
│  Skills                   │  Total: HK$23,690               │
│  · document-reader   ✓    │                                  │
│  · template-writer   ✓    │  [🔴 Review before sending]     │
│  · email-drafter     ✓    │  [ Approve & send ] [ Edit ]    │
└─────────────────────────────────────────────────────────────┘
```

Add a subtle `box-shadow: 0 0 80px rgba(245,166,35,0.08)` glow around the outer mockup container.

---

### 3.10 CTA Banner

**Component**: `<CTABanner />`

```
Your ledger. Your tenants. Your tables. Your jobs.
One platform you can read, audit, and own — pointed at the one job
that matters: getting your business done faster, cleaner, and with
less slipping through the cracks.

[ Open the workspace → ]
```

Background: `--clr-slate`, centred, generous vertical padding (80px). Headline `--font-display` 40px `--clr-snow`. Body `--font-body` 18px `--clr-fog`. CTA button: `--clr-amber` fill.

---

### 3.11 Footer

**Component**: `<Footer />`  
Background `--clr-midnight`, top border `1px --clr-mist`.

```
Left:  🏗 Clawix SME
       Agentic AI for small business.
       Self-hosted · HITL · Built on Clawix

Centre: Product        Company
        How it works   About AIbyML
        Agent packs    Clawix platform
        Skills         GitHub
        Sign in

Right:  © 2026 AIbyML.com SG Ltd.
        HK · SG · APAC
```

---

## 4 · Page: Conversations (`/conversations`)

**Mirror the `clawix-account` conversations page structure.**

### 4.1 Layout

Three-panel layout:

```
[ Navbar ]
┌──────────────┬──────────────────────────┬──────────────────┐
│  SIDEBAR     │  CONVERSATION THREAD     │  AGENT CONTEXT   │
│  220px       │  flex-1                  │  280px           │
└──────────────┴──────────────────────────┴──────────────────┘
```

### 4.2 Sidebar

```tsx
interface SidebarProps {
  conversations: Conversation[];
  agents: Agent[];
  skills: Skill[];
}
```

Sections:

- **+ New conversation** button (amber, full width)
- **Recent conversations** list — title, status badge (✅ done / 🔴 needs review / ⏳ in progress)
- **Active agents** — green dot indicator per loaded agent
- **Loaded skills** — checkmark list

### 4.3 Conversation Thread

Messages follow this pattern:

```tsx
type MessageRole = 'user' | 'orchestrator' | 'agent' | 'system';

interface Message {
  id: string;
  role: MessageRole;
  agentName?: string; // e.g. "QuoteCraft"
  agentEmoji?: string;
  content: string;
  confidence?: 'High' | 'Medium' | 'Low';
  requiresReview?: boolean;
  sources?: string[]; // e.g. ["Invoice_WW2024-03.pdf", "PriceList_Q1.xlsx"]
  timestamp: Date;
}
```

**Message bubble styles**:

- `user`: right-aligned, `--clr-amber` background, dark text
- `orchestrator` (NEXUS): left-aligned, `--clr-mist` background, `--clr-fog` label "NEXUS"
- `agent`: left-aligned, `--clr-slate` background, agent name + emoji label, monospace content for structured data
- `system`: centred, small, `--clr-fog` italic

**Review gate** (rendered when `requiresReview: true`):

```
┌─────────────────────────────────────────────────────┐
│  🔴  Review required before this draft is sent      │
│  Confidence: Medium · Sources: [Invoice_WW2024.pdf] │
│                                                     │
│  [ ✅ Approve & send ]  [ ✏️ Edit ]  [ ❌ Discard ] │
└─────────────────────────────────────────────────────┘
```

### 4.4 Agent Context Panel (right)

Shows context for the active conversation:

```
Active pack: Builder
─────────────────────
Agents running:
  ● QuoteCraft       ready
  ● InvoiceBot       idle
  ● SiteSync         idle

Skills loaded:
  ✓ document-reader
  ✓ template-writer
  ✓ email-drafter

Confidence score:  Medium
Sources used:       2
Review gates hit:   1
```

### 4.5 Input Bar

```
[ 🏗 Pack: Builder ▼ ]   [ _______ Type a task... _______ ]   [ ⌘↵ Send ]
```

- Pack switcher: dropdown to change active sector pack
- Input: multiline textarea, `--clr-slate` background
- Send: amber button

---

## 5 · Page: Agents (`/agents`)

### 5.1 Layout

```
Heading: Our specialist agents
Sub:     Pick a pack or browse every agent.

Filter bar: [ All ] [ Builder ] [ Property Agency ] [ Property Mgmt ] [ Restaurant ] [ Accounting ]
```

Agent cards (reuse sector card data from §3.6) displayed in a responsive grid.

Each card expands on click to show:

- Full description
- System prompt preview (first 200 chars, monospace)
- Skills used (badges)
- Sample task / sample output (two-column diff-style)
- "Add to workspace" button

---

## 6 · Page: Skills (`/skills`)

```
Heading: The skill library
Sub:     Skills are the atomic tools agents compose.
         Every skill is a plain-text SKILL.md file you can read, fork, and customise.

Search bar: [ 🔍 Search skills... ]

Grid of skill cards (full detail — name, description, input/output schema preview)
```

Each skill card shows:

```
┌────────────────────────────────┐
│  📄  document-reader           │
│  Extracts structured fields    │
│  from PDF, DOCX, and images.   │
│                                │
│  Input:  file (PDF/DOCX/IMG)   │
│  Output: JSON field map        │
│                                │
│  Used by: BookBot, QuoteCraft  │
│           ListingPro           │
│  [ View SKILL.md ]             │
└────────────────────────────────┘
```

---

## 7 · System Prompts for the Eight Quality Criteria

Every agent system prompt built for this platform **must** satisfy the eight criteria. Use this checklist when authoring or reviewing system prompts in `SUBAGENT_*.md` files:

| #   | Criterion                    | What to check                                                                                                                            |
| --- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Clear**                    | Single sentence states the agent's job, sector, and scope. No ambiguity about what it does and does not do.                              |
| 2   | **Relevant**                 | Prompt contains only facts, rules, and context the agent actually needs. No padding.                                                     |
| 3   | **Informative**              | Concrete output format specified (JSON schema, prose template, or table). Agent knows what "done" looks like.                            |
| 4   | **Emotional aspect**         | Acknowledges the human stakes — owner-operator pressure, time sensitivity, trust. Tone is reassuring, not robotic.                       |
| 5   | **Resourceful**              | Lists which MCP tools and skills the agent may invoke. Fallback behaviour specified if a source document is missing.                     |
| 6   | **Colourful**                | Uses vivid, domain-specific vocabulary ("scope of works", "variation order", "service charge schedule") rather than generic AI language. |
| 7   | **Care for human society**   | Includes HITL gate rule: agent must never send, post, or file without human approval. Data privacy reminder included.                    |
| 8   | **Well-defined target user** | Prompt names the user role: "a sole-trader builder in HK", "a two-person property agency in Singapore", etc.                             |

---

## 8 · File & Folder Conventions

Mirror `clawix-account` repo structure:

```
/
├── app/
│   ├── page.tsx                    ← Landing page
│   ├── conversations/page.tsx
│   ├── agents/page.tsx
│   ├── skills/page.tsx
│   └── layout.tsx
├── components/
│   ├── Navbar.tsx
│   ├── HeroSection.tsx
│   ├── HowItWorks.tsx
│   ├── SectorGrid.tsx
│   ├── AgentShowcase.tsx
│   ├── SkillsBrowser.tsx
│   ├── TrustSection.tsx
│   ├── ConversationPreview.tsx
│   ├── CTABanner.tsx
│   ├── Footer.tsx
│   └── conversations/
│       ├── Sidebar.tsx
│       ├── MessageThread.tsx
│       ├── AgentContextPanel.tsx
│       ├── ReviewGate.tsx
│       └── InputBar.tsx
├── data/
│   ├── sectors.ts                  ← sectors[] array
│   ├── agents.ts                   ← agents[] array
│   └── skills.ts                   ← skills[] array
├── styles/
│   └── globals.css                 ← CSS variables from §1
├── public/
│   └── favicon.ico
├── agent-packs/
│   ├── SUBAGENT_QuoteCraft_Builder.md
│   ├── SUBAGENT_ListingPro_PropertyAgency.md
│   ├── SUBAGENT_FaultLogger_PropertyMgmt.md
│   ├── SUBAGENT_StockSense_Restaurant.md
│   └── SUBAGENT_BookBot_Accounting.md
└── skills/
    ├── SKILL_document-reader.md
    ├── SKILL_email-drafter.md
    ├── SKILL_template-writer.md
    ├── SKILL_reconciler.md
    └── SKILL_report-builder.md
```

---

## 9 · Environment Variables

```env
# .env.local
NEXT_PUBLIC_APP_NAME=Clawix SME
NEXT_PUBLIC_CLAWIX_API_URL=https://api.clawix.aibyml.com
NEXT_PUBLIC_PLATFORM_URL=https://clawix.aibyml.com
ANTHROPIC_API_KEY=                 # server-side only, never exposed
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://sme.clawix.aibyml.com
```

---

## 10 · HITL Rules — Non-Negotiable

Embed these rules as comments in every action component:

```typescript
/**
 * HITL GATE — CLAWIX SME PLATFORM RULE
 *
 * No agent output may be sent, posted, filed, or forwarded
 * without explicit human approval at a ReviewGate component.
 *
 * Consequential actions include:
 *   - Sending any email, WhatsApp, or SMS to an external party
 *   - Posting any journal entry or financial record
 *   - Submitting any form or portal data
 *   - Generating any client-facing document (quote, contract, invoice)
 *
 * The ReviewGate component must always render with:
 *   - The full draft content
 *   - Confidence score
 *   - Source document references
 *   - Three options: Approve / Edit / Discard
 *
 * Never auto-approve. Never skip the gate on a retry.
 */
```

---

## 11 · Claude Code Build Instructions

When handing this document to Claude Code, use the following prompt:

```
Read CLAWIX_SME_LAYOUT_SPEC.md in full before writing any code.

Build the Next.js 14 (App Router) frontend described in that spec:

1. Set up the project with Tailwind CSS and TypeScript.
2. Implement globals.css with the design tokens from §1.
3. Build the landing page (/) implementing all sections in §3 in order.
4. Build the /conversations page per §4.
5. Build the /agents page per §5.
6. Build the /skills page per §6.
7. Use the data arrays from §3.5 (sectors), §3.6 (agents), and §3.7 (skills) — put them in /data/*.ts files.
8. Follow the folder structure in §8 exactly.
9. Add the HITL comments from §10 to every action component.
10. Use the CSS variable names from §1.1 for every colour reference — never hardcode hex values in component files.
11. The animated hero task panel (§3.2 right column) should use CSS keyframe animation cycling through all five scenarios with a 4-second interval per scenario.
12. Make the site fully responsive: desktop (≥1024px), tablet (768–1023px), mobile (<768px).
13. Do not connect to a live API in v1 — use the static data arrays and mock message objects for the conversations page.
14. Add a /login route with a minimal sign-in form (email + password) matching the dark theme; no auth implementation required.

Output: a working Next.js project ready to deploy to Vercel.
```

---

_Document version: 1.0 · June 2026 · AIbyML.com SG Ltd._  
_Authored as a Clawix platform build specification._
