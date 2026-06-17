---
name: restaurant-shared
description: Shared conventions for restaurant/F&B tasks — service workspace layout, supplier and par-level records, money/quantity units, customer data handling, and the human-review gate on supplier orders and customer messages. Read first before stock-reconciliation or supplier-reorder.
version: 1.0.0
author: clawix-sme
tags: [restaurant, fnb, hospitality, shared, sme, hitl]
---

# Restaurant & F&B — Shared Layer

Foundation for:

- `stock-reconciliation` — POS + delivery → variance → reorder list
- `supplier-reorder` — per-supplier reorder drafts

Read this **first** for any stock, supplier, reservation, or takings task.

## When to invoke

"Reconcile today's stock", "draft my reorders", "manage Friday's bookings", "reconcile the takings".

## Hard rules

1. **Drafts, not actions.** Supplier orders and customer confirmations are **drafts for the owner to approve**. The owner sends and submits — never the agent.
2. **Compute from source.** Variance and takings come from the POS export and delivery notes. Never estimate a number that a source can provide.
3. **Reconcile to the cent.** Daily takings and petty cash must balance; flag discrepancies rather than smoothing them.
4. **Customer data lives in files.** Reservation names and contacts go under `/workspace/service/<date>/`. Use `memory_save` only for non-identifying operational metadata (par levels, supplier channels).
5. **Quantities and money carry units.** `12 kg`, `3 cases`, `HK$1,240`.
6. **Never write outside `/workspace/`.**

## Workspace skeleton

```
/workspace/
  suppliers.md         # supplier, channel (WhatsApp/email), order format
  par-levels.md        # item, par quantity, unit
  service/<date>/      # POS export, delivery notes, takings, reservations
```

## Output contract

Every deliverable ends with: `Draft / Sources / Confidence / Review required`.
