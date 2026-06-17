---
name: supplier-reorder
description: Turn a reorder list into per-supplier order messages, each in that supplier's preferred channel and format (WhatsApp, email, or template). Use after restaurant-shared. Messages are drafts the owner approves before sending — nothing is submitted by an agent.
version: 1.0.0
author: clawix-sme
tags: [restaurant, fnb, supplier, ordering, sme]
---

# Supplier Reorder

Read `restaurant-shared` first.

## When to invoke

"Draft my reorders", "message the suppliers", "send the vegetable order to Kwan's".

## Procedure

1. **Group by supplier.** Take the reorder list (from `stock-reconciliation`) and split items by supplier using `suppliers.md`.
2. **Match channel and format.** For each supplier, read their preferred channel (WhatsApp / email) and order format from `suppliers.md`. Render the message in that format — concise, with quantities and units, delivery date, and the venue name.
3. **Draft, don't send.** Write each message to `service/<date>/orders/<supplier>.md` marked as a draft. List the channel each one should go out on.
4. **Summarise.** One line per supplier: item count, total quantity, target delivery.

## Rules

- Quantities come straight from the reorder list — do not re-estimate.
- Each message is a **draft for owner approval**; the owner sends via `supplier-relay` (WhatsApp/email tools require human approval).
- End with `Draft / Sources / Confidence / Review required`.
