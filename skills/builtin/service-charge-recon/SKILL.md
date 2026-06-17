---
name: service-charge-recon
description: Reconcile service-charge receipts against the building budget, flag overspends and shortfalls, and draft the owners' statement. Use after property-mgmt-shared. Figures are computed from source receipts and budgets, never estimated; the statement is a draft for review.
version: 1.0.0
author: clawix-sme
tags: [property, management, finance, reconciliation, sme]
---

# Service Charge Reconciliation

Read `property-mgmt-shared` first.

## When to invoke

"Reconcile this quarter's service charge", "check spend against budget", "draft the annual statement", "where are we over budget".

## Procedure

1. **Load the budget and receipts** from `finance/`. If a receipt is missing for a line, mark it `unsupported` — do not assume an amount.
2. **Reconcile line by line.** For each budget category, total the supported receipts and compute variance against budget. Money carries its currency; totals reconcile to the cent.
3. **Flag exceptions.** List every overspend, shortfall, and unsupported line with its amount. Do not smooth over discrepancies.
4. **Draft the statement.** Produce the owners' statement to `finance/statement-<period>.md` — budget, actual, variance, and a short plain-language summary. Defer final rendering to `report-builder` if a fixed format is required.

## Rules

- Every figure traces to a receipt or a calculation — never estimated.
- The statement is a **draft for review** before it goes to owners.
- End with `Draft / Sources / Confidence / Review required`.
