---
name: stock-reconciliation
description: Read the day's POS export and delivery notes, compute stock variance against par levels, and produce a reorder list flagging what runs out before a target date. Use after restaurant-shared. Numbers are computed from source data, never estimated.
version: 1.0.0
author: clawix-sme
tags: [restaurant, fnb, stock, reconciliation, sme]
---

# Stock Reconciliation

Read `restaurant-shared` first.

## When to invoke

"Reconcile today's stock", "what do I need to reorder", "compute variance", "flag what runs out before Saturday".

## Procedure

1. **Normalise the inputs.** Use the `pos-reader` sub-agent to parse the POS export and delivery notes into a single sales-and-receipts table. If a file is missing, say so and stop — do not assume volumes.
2. **Compute variance.** For each tracked item: opening + deliveries − sales = expected closing. Compare against par level from `par-levels.md`. Quantities carry units.
3. **Project to the target date.** Using typical daily usage, flag items that fall below par before the requested date (e.g. "before Saturday").
4. **Produce the reorder list.** Item, current level, par, suggested order quantity, supplier. Write to `service/<date>/reorder-list.md`. Hand off to `reorder-drafter` / `supplier-reorder` to draft the actual messages.

## Rules

- Every quantity traces to the POS/delivery data or a stated assumption — never invented.
- Output is a reorder **list**, not a sent order.
- End with `Draft / Sources / Confidence / Review required`.
