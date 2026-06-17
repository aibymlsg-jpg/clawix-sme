---
name: listing-writer
description: Write property listing copy, produce a photographer shot list, and format a portal-ready data sheet from the owner's property notes. Use after property-agency-shared whenever the task is to market a unit. Output is always a draft for human review before publishing.
version: 1.0.0
author: clawix-sme
tags: [property, agency, listing, copywriting, sme]
---

# Listing Writer

Read `property-agency-shared` first. This skill turns raw property notes into three artifacts: **listing copy**, a **photo brief**, and a **portal data sheet**.

## When to invoke

"Prepare the listing", "write the copy for Unit X", "give me a photo brief", "format this for the portal".

## Procedure

1. **Confirm the facts.** Pull the unit details from `deal.md` and the owner's notes — size, beds/baths, floor, aspect, age, renovation, fixtures included, asking price. If a fact is missing, mark it `TBC` and ask; never invent selling points.
2. **Write the copy.** Lead with the strongest verified feature. Keep it honest — no superlatives that the facts don't support. Provide a 60-word short version and a 150-word long version.
3. **Photo brief.** Produce a shot list (room-by-room order, angles, time of day for the best light, staging notes). Output to `listing/photo-brief.md`.
4. **Portal data sheet.** Fill the structured fields the portal needs (size, price, beds, baths, district, facing, completion year, features). Write to `listing/portal-sheet.md`. If a portal-specific format is supplied, defer rendering to the `portal-formatter` sub-agent.

## Rules

- Every claim traces to a fact in `deal.md` or the owner's notes.
- The asking price is shown with its currency and matches `deal.md` exactly.
- Nothing is published. End with the standard draft/sources/confidence/review block.
