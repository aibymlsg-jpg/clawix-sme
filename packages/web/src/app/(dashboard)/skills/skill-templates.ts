/**
 * Create-Skill templates — mirrors the clawix-ngo pattern: a "Use template"
 * scaffold (its ## Workflow section is the textual flow) plus ready-to-load
 * example skills. Examples here are SME-flavoured (builder, property, F&B,
 * accounting, estate) rather than NGO.
 *
 * On submit the dialog POSTs {name, description} then, if content is present,
 * PUTs it to /api/v1/skills/<name>/content.
 */

/** Editable scaffold loaded by the "Use template" button. */
export const skillContentTemplate = (name: string, description: string): string =>
  `---
name: ${name || 'my-skill'}
description: ${description || 'What this skill does and when the agent should use it.'}
version: 1.0.0
author: Clawix SME
tags: []
---

# ${name || 'My Skill'}

## Purpose
[What problem this skill solves and when the agent should load it]

## When to invoke
Trigger on: "[example phrase]", "[example phrase]".

## Workflow
1. [Step 1 — read the input]
2. [Step 2 — do the work]
3. [Step 3 — produce the output]

## Tools used
- Use \`shell\` to run scripts in \`scripts/\`
- Use \`read_file\` / \`write_file\` for workspace files
- Use \`web_search\` / \`web_fetch\` only for published, citable sources

## Rules
- Trace every figure to a source or a shown calculation — never guess.
- Output is a draft for human review; nothing is sent, posted, or filed.
- Write only under /workspace/<job>/.

## Output
[The exact shape: JSON schema, table, or prose template]
`.trimEnd();

export interface SkillSample {
  label: string;
  emoji: string;
  name: string;
  description: string;
  content: string;
}

export const SKILL_SAMPLES: SkillSample[] = [
  {
    label: 'Builder · Take-off & quote',
    emoji: '🏗',
    name: 'builder-takeoff-quote',
    description:
      'Turn a scope of works into a take-off, a wholesale-priced bill of materials, and a client-ready quote. Prices come only from named, dated supplier pages.',
    content: `---
name: builder-takeoff-quote
description: Turn a scope of works into a take-off, a wholesale-priced bill of materials, and a client-ready quote. Prices come only from named, dated supplier pages.
version: 1.0.0
author: Clawix SME
tags: [builder, takeoff, quote, bom, pricing]
---

# Builder Take-off & Quote

## Purpose
Convert a builder's scope notes or drawing into a costed quote a client can accept.

## When to invoke
Trigger on: "quote this job", "build me a take-off", "price this scope".

## Workflow
1. Parse the scope into measured line items (quantities carry units: m, m², no.).
2. Build the bill of materials; for each item fetch a published price from a named
   trade counter (Screwfix, Travis Perkins, …) with the URL and date — never guess.
3. Add wastage allowance, labour, markup, and VAT.
4. Roll up into a client-ready quote with a clear total.

## Rules
- Any missing price is left as TBC with a note — never invented.
- Flag work needing licensed certification (Part P, Gas Safe, MCS, DNO).
- Output is a draft for the builder's review before it reaches the client.

## Output
A markdown quote: line items (qty · unit · unit price · source) → subtotal,
wastage, labour, markup, VAT, total. Followed by the Draft/Sources/Confidence/Review block.`,
  },
  {
    label: 'Property mgmt · Fault routing',
    emoji: '🏢',
    name: 'fault-routing-notice',
    description:
      'Log a maintenance fault, classify urgency, match it to an approved contractor, and draft the work order and tenant notice. Emergencies are surfaced immediately.',
    content: `---
name: fault-routing-notice
description: Log a maintenance fault, classify urgency, match it to an approved contractor, and draft the work order and tenant notice. Emergencies are surfaced immediately.
version: 1.0.0
author: Clawix SME
tags: [property, maintenance, routing, tenant]
---

# Fault Routing & Notice

## Purpose
Triage a reported building fault into a routed, drafted action — safely and courteously.

## When to invoke
Trigger on: "log a fault", "assign a contractor", "notify the tenant".

## Workflow
1. Log the fault to /workspace/<building>/faults/ (reporter, unit, description, photos as files).
2. Classify urgency: emergency / urgent / routine. Surface emergencies immediately.
3. Match an approved contractor from contractors.md; if none fits, say so and stop.
4. Draft the work order (scope, access, target date) and a courteous tenant notice.

## Rules
- Only approved contractors — never an ad-hoc vendor.
- Work orders and tenant messages are drafts held for human approval.
- Tenant personal data stays in /workspace files, not in memory.

## Output
A fault record + draft work order + draft tenant notice, then the
Draft/Sources/Confidence/Review block.`,
  },
  {
    label: 'Restaurant · Stock reconcile',
    emoji: '🍜',
    name: 'stock-reconcile-reorder',
    description:
      'Read the POS export and delivery notes, compute stock variance against par levels, and produce a reorder list flagging what runs out before a target date.',
    content: `---
name: stock-reconcile-reorder
description: Read the POS export and delivery notes, compute stock variance against par levels, and produce a reorder list flagging what runs out before a target date.
version: 1.0.0
author: Clawix SME
tags: [restaurant, stock, variance, reorder]
---

# Stock Reconcile & Reorder

## Purpose
Tell the operator exactly what to reorder before they run out — from real data.

## When to invoke
Trigger on: "reconcile today's stock", "what do I reorder", "compute variance".

## Workflow
1. Normalise the POS export + delivery notes into one sales-and-receipts table.
2. For each tracked item: opening + deliveries − sales = expected closing; compare to par.
3. Project typical daily usage to the target date (e.g. "before Saturday").
4. Produce a reorder list: item, current level, par, suggested order qty, supplier.

## Rules
- Every quantity is computed from the source data — never estimated.
- The output is a reorder list, not a sent order.

## Output
A reorder table grouped by supplier, then the Draft/Sources/Confidence/Review block.`,
  },
  {
    label: 'Accounting · Bank reconcile',
    emoji: '📊',
    name: 'bank-reconcile-schedule',
    description:
      'Match bank transactions to ledger entries, flag unmatched lines, and build the reconciliation schedule. Figures are computed, never estimated.',
    content: `---
name: bank-reconcile-schedule
description: Match bank transactions to ledger entries, flag unmatched lines, and build the reconciliation schedule. Figures are computed, never estimated.
version: 1.0.0
author: Clawix SME
tags: [accounting, reconciliation, bank, ledger]
---

# Bank Reconciliation Schedule

## Purpose
Produce a clean bank reconciliation a practitioner can sign off.

## When to invoke
Trigger on: "reconcile the bank", "match these transactions", "build the rec".

## Workflow
1. Load the bank statement and the ledger for the period.
2. Match line by line on amount + date + reference; mark confident vs probable matches.
3. List unmatched bank lines and unmatched ledger lines separately.
4. Build the reconciliation schedule: balance per bank → adjustments → balance per ledger.

## Rules
- Money carries its currency; totals reconcile to the cent.
- Unmatched and uncertain items are flagged, never smoothed over.

## Output
A reconciliation schedule + an exceptions list, then the
Draft/Sources/Confidence/Review block.`,
  },
  {
    label: 'Estate · Listing pack',
    emoji: '🏠',
    name: 'listing-pack',
    description:
      'Write listing copy (short + long) and a photographer shot list from property notes, and prepare a portal-ready data sheet.',
    content: `---
name: listing-pack
description: Write listing copy (short + long) and a photographer shot list from property notes, and prepare a portal-ready data sheet.
version: 1.0.0
author: Clawix SME
tags: [property, agency, listing, copywriting]
---

# Listing Pack

## Purpose
Turn raw property notes into a market-ready listing the agent can publish after review.

## When to invoke
Trigger on: "prepare the listing", "write the copy", "give me a photo brief".

## Workflow
1. Pull verified facts from the property notes (size, beds/baths, floor, aspect, price).
2. Write a 60-word short version and a 150-word long version — honest, no unsupported claims.
3. Produce a photographer shot list (room order, angles, best light, staging).
4. Fill the portal data sheet fields.

## Rules
- Every claim traces to a fact in the notes; missing facts are marked TBC.
- The asking price shows its currency and matches the source exactly.
- Nothing is published — the pack is a draft for the agent.

## Output
listing copy (short + long) + shot list + portal sheet, then the
Draft/Sources/Confidence/Review block.`,
  },
];
