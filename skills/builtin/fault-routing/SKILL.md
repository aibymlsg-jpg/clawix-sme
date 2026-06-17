---
name: fault-routing
description: Log a maintenance fault, classify its urgency, match it to an approved contractor, and draft the work order and tenant notice. Use after property-mgmt-shared. Work orders and tenant messages are drafts for human approval — never dispatched by an agent.
version: 1.0.0
author: clawix-sme
tags: [property, management, maintenance, routing, sme]
---

# Fault Routing

Read `property-mgmt-shared` first.

## When to invoke

"Log the plumbing fault at Block C", "assign a contractor", "draft the notice to the tenant", "follow up on the open jobs".

## Procedure

1. **Log it.** Create `faults/<date>-<unit>-<slug>.md` capturing reporter, unit, description, photos (stored as files, not in memory), and time reported.
2. **Classify urgency.** Use the `urgency-classifier` sub-agent against the safety scale in the shared skill (`emergency` / `urgent` / `routine`). Record the rationale. Emergencies are surfaced immediately.
3. **Match a contractor.** Choose from `contractors.md` by trade and availability. If no approved contractor fits, say so and stop — do not invent one.
4. **Draft the work order.** Scope, access details, urgency, and target date. Hold for approval.
5. **Draft the tenant notice.** Clear, courteous, sets expectations on timing. Use the `tenant-notify` sub-agent. Hold for approval.
6. **Set follow-up.** Note the SLA so `deadline-watcher` can surface it if it slips.

## Rules

- Only approved contractors. Only computed/known urgency — never a guess on safety.
- Nothing dispatched or sent. End with `Draft / Sources / Confidence / Review required`.
