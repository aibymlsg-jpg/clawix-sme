---
name: tenancy-drafting
description: Draft a tenancy agreement from a standard template, flag every non-standard clause for human review, and prepare stamp duty notes. Use after property-agency-shared. The draft is never executed by an agent — it is prepared for a person to review and sign.
version: 1.0.0
author: clawix-sme
tags: [property, agency, tenancy, legal-template, sme]
---

# Tenancy Drafting

Read `property-agency-shared` first. This skill prepares a tenancy **draft** — it does not give legal advice and does not execute anything.

## When to invoke

"Draft a tenancy", "prepare the lease for Unit X", "check these tenancy terms", "what's the stamp duty".

## Procedure

1. **Gather the terms.** Parties, unit, term length, rent, deposit, payment date, break clause, included fixtures, special conditions. Missing terms are listed as open questions — do not fill defaults silently.
2. **Render from template.** Use the standard template under the deal's `tenancy/` folder (or the agency's template if provided). Insert the gathered terms verbatim.
3. **Flag deviations.** Run the draft past the `clause-checker` sub-agent. Every clause that differs from the standard template — or that is unusual (e.g. atypical break terms, non-standard deposit) — is listed in `tenancy/clause-notes.md` for human review. Never accept a non-standard clause silently.
4. **Stamp duty note.** Compute the stamp duty from the rent and term using the applicable rate, or cite the source if the rate is jurisdiction-specific. Show the calculation.

## Rules

- This is a **draft for the landlord/agent and their lawyer** — include a one-line reminder that it requires professional review before signing.
- Statutory figures (stamp duty, notice periods) are computed or cited, never guessed.
- Nothing is executed. End with the standard draft/sources/confidence/review block.
