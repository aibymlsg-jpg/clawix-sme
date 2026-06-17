---
name: property-mgmt-shared
description: Shared conventions for property-management tasks — building/unit workspace layout, tenant data handling, urgency vocabulary, approved-contractor rule, and the human-review gate on tenant comms and work orders. Read first before fault-routing or service-charge-recon.
version: 1.0.0
author: clawix-sme
tags: [property, management, facilities, shared, sme, hitl]
---

# Property Management — Shared Layer

Foundation for:

- `fault-routing` — log faults, classify urgency, assign contractors
- `service-charge-recon` — reconcile receipts against budgets

Read this **first** for any task touching a building, a tenant, or an outbound message.

## When to invoke

"Log a fault", "assign a contractor", "draft a notice to the tenant", "reconcile service charge", "what's open across my buildings".

## Hard rules

1. **Drafts, not actions.** Tenant communications and work orders are **drafts for human review**. The manager sends and dispatches — never the agent.
2. **Approved contractors only.** Assignments may only use contractors on the approved list under `/workspace/<building>/contractors.md`. No ad-hoc vendors.
3. **Urgency is a safety decision.** Use the canonical scale — `emergency` (risk to life/property, act now), `urgent` (within 24h), `routine` (scheduled). Emergencies are surfaced immediately and never queued silently.
4. **Tenant data lives in files.** Names, unit numbers, and contact details go under `/workspace/<building>/units/`. Use `memory_save` only for non-identifying building metadata.
5. **Never write outside `/workspace/`.**

## Building skeleton

```
/workspace/<building-slug>/
  building.md          # address, units, manager
  units/               # tenant details (personal data)
  contractors.md       # approved contractor list
  faults/              # one file per logged fault
  finance/             # budgets, receipts, statements
```

## Output contract

Every deliverable ends with: `Draft / Sources / Confidence / Review required`.
