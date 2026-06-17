---
name: property-agency-shared
description: Shared conventions for any property-agency task — client/prospect data handling, deal workspace layout, money and area units, and the human-review gate on every outbound document. Read this first before invoking listing-writer or tenancy-drafting.
version: 1.0.0
author: clawix-sme
tags: [property, agency, shared, sme, hitl]
---

# Property Agency — Shared Layer

This skill is the foundation the role skills sit on:

- `listing-writer` — listing copy, photo briefs, portal data sheets
- `tenancy-drafting` — tenancy agreements, clause checks, stamp duty notes

Read this skill **first** any time you touch a deal, a client, or an outbound document.

---

## When to invoke

Trigger on any of: "prepare a listing", "draft a tenancy", "set up viewings", "summarise my pipeline", or any task that produces a document a client or prospect will see.

---

## Hard rules

1. **Never publish, send, or execute.** Listings, tenancies, and messages are **drafts for human review**. Surface the draft with its sources and a confidence level. The owner publishes, sends, or signs — never the agent.
2. **Never write outside `/workspace/`.** All deal artifacts go under `/workspace/<deal-slug>/`. Use kebab-case slugs derived from the unit (e.g. `tower3-12b`).
3. **Personal data lives in files, not memory.** Client and prospect names, phone numbers, and emails belong in `/workspace/<deal-slug>/clients/` files. Use `memory_save` only for non-identifying deal metadata (unit, asking price, stage).
4. **Money carries its currency.** `HK$28,000`, `S$3,200` — never a bare number.
5. **Area carries its unit.** `720 sq ft`, `66.9 m²`. Declare one canonical unit per deal in the deal header before quoting.
6. **Statutory figures are computed or sourced.** Stamp duty, agency commission caps, and notice periods come from a calculation or a cited source — never guessed.

---

## Deal skeleton

```
/workspace/<deal-slug>/
  deal.md            # unit, asking price, stage, owner contact (ref only)
  clients/           # prospect/landlord details (personal data)
  listing/           # copy, photo brief, portal sheet
  tenancy/           # draft agreement, clause notes
  pipeline.md        # stage, expected commission, next action
```

## Output contract

Every deliverable ends with a short block:

```
Draft: <what this is>
Sources: <files or computed>
Confidence: High | Medium | Low
Review: required before send/publish/execute
```
