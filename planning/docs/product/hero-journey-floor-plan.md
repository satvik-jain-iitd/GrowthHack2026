# EASE MVP Hero Journey — Current-State: Build Floor Plans (Resy)

> **Status:** confirmed by the user (2026-09-14) as **the exact scope of the GrowthHack MVP hero journey** — *"Help me create a floor plan."* This document is the evidence-based, current-state (today, without EASE) walkthrough of how a Resy operator actually builds and activates a floor plan in ResyOS. It is the ground truth the EASE mocked application, intent understanding, deterministic validation, and telemetry must model and improve upon.
>
> The source material numbered this "Journey 1," implying more journeys may exist or be documented later (e.g. schedules/operating hours, reservation inventory, POS integration, test transactions — the other steps named in the Resy onboarding meeting recap, see [`growthhack-source-brief.md`](../growthhack-source-brief.md#5-resy-onboarding-process--meeting-recap-with-meagan-mccallum)). Add them here as additional `## Journey N` sections in the same structure as new evidence arrives.
>
> **Evidence tags used throughout** (preserved from the source): `[V]` = Verified against a cited source · `[I]` = Inferred · `[V/I]` = partially verified/partially inferred · `[U]` = Unverified / known gap.

[screenshot]: https://us-prod.asyncgw.teams.microsoft.com/v1/objects/0-wus-d8-861133a5e3df36f861bd25e510dfb905/views/original/5ef0bf886a.png "Resy floor-plan editor screenshot (org-internal Teams-hosted image; requires the author's Teams access to view)"

---

## Journey 1 — Build Floor Plans

**User goal:** represent every reservable physical table and valid table combination, then make the correct plan usable by services.

**Prerequisites `[V]`:** a ResyOS Dashboard/App login with floor-plan permissions; supported browser/iPad where applicable. ([screenshot])

### Numbered current-state sequence

1. **Start the editor `[V]`.**
   - Web: **Service → Floor Plan Settings**.
   - iPad: tap the **venue name → Settings → Floor Plans**.
   - Create a new plan or select an existing one to edit. ([screenshot])

2. **Name and lay out the plan `[V]`.** Add rooms/areas as needed, then place tables on the canvas. The retrieved article documents editable table identifiers, table type, and minimum/maximum party sizes; the plan is a logical operating representation, not merely artwork. ([screenshot])

3. **Configure each table `[V]`.** For every table, set:
   - **Table ID/name**;
   - **Table Type**;
   - **minimum party size**;
   - **maximum party size**;
   - physical placement/shape in the visual plan.

   Resy's launch checklist specifically asks operators to verify table labels, min/max covers, and table types. ([screenshot])

4. **Create table combinations `[V]`.** Select combinable tables and define the resulting combined table/party capacity. Resy's public product material says table combinations, party sizes, and customized turn times are used to optimize seating capacity. ([screenshot])

5. **Save the plan `[V]`.** Floor-plan editing and service activation are separate. Saving creates/updates the plan; it does **not** by itself make the plan active in a recurring service. ([screenshot])

6. **Activate it through a Shift `[V]`.** Go to **Service → Shift Settings → ⋮ beside Shift → Edit Shift → Step 2 Service Settings → Floor Plans**, select one or more plans, and **Update Shift**. The floor-plan article warns that newly built plans will not appear in ResyOS until activated in a Shift. ([screenshot])

7. **Handle one-off changes `[V]`.** Use **Service → Calendar → date → Single Day Edit** for holiday/special-service layouts. This changes only that date; existing reservations remain, and saved edits become live immediately when within the booking window, although the app may need to be reopened to refresh. *(cited to Resy support documentation — see "Citations" note below)*

### Validation and "complete"

**Journey complete `[V/I]`** when: every operating table has a unique identifier, type, and capacity; valid combinations exist; the intended plan is selected in every relevant Shift/Event; and those tables appear under **Step 3 Availability**. The last condition follows because Shift availability is explicitly based on tables in the selected floor plan. *(cited to Resy support documentation — see "Citations" note below)*

### Documented friction / exceptions

- A saved but non-activated plan does not reach service. ([screenshot])
- Resy/POS table names must match **exactly** for check matching and Toast Digital Chits; `B1`, `B 1`, `b1`, and `1` are different. *(cited to Resy support documentation)*
- Editing a live single day does not remove existing reservations; changed policies do not retroactively apply to already-booked guests. *(cited to Resy support documentation)*
- Assigned Seating Events require a selectable floor plan; if a new event layout is needed, create it first in Dashboard/iPad. *(cited to Resy support documentation)*
- **`[U]`** No retrieved public article defined a formal floor-plan "approval," collision validator, maximum number of plans/tables, or Implementation Specialist sign-off.

**EASE modelling checkpoints:** editor entry → room/table creation → capacity decisions → combination decisions → save → Shift activation → table visibility. The strongest evidence-backed friction is the hidden **save-versus-activate** distinction and the cross-system table-name dependency.

### Citations

The source research cited external Resy help-center/support articles using inline footnote-style markers (`resy`, `resy+1`) rather than full URLs. The specific article URLs were not included in the pasted material — request them from whoever ran this research if the PRD or dev team needs to click through to the original Resy documentation. The repeated `[screenshot]` reference above resolves to a single org-internal Microsoft Teams-hosted image (requires the original author's Teams access to view); if reusable for the demo, ask them to re-export a shareable copy.

---

## Why This Matters for the MVP

This journey directly supplies the two things the GrowthHack demo needs most, given the confirmed judging weights ([`brief.md`](/planning/_bmad-output/planning-artifacts/briefs/brief-EASE-2026-09-14/brief.md) — Feasibility 30% / Innovation 30% / Business Unit Value 30% / Completeness 10%):

- **A concrete validation checkpoint list** the deterministic validator can actually check: table ID/name, table type, min/max party size, table combinations defined, plan saved, plan selected in an active Shift, tables visible under Shift availability. This is what makes EASE's validation "real" rather than an LLM guessing.
- **A genuine, previously-undocumented friction point to dramatize** for the Innovation criterion: the **hidden save-vs-activate distinction** — a plan can be fully built and saved yet invisible to guests until a separate, non-obvious Shift-activation step happens. This is exactly the kind of "new experience-improvement opportunity that was previously unknown" the Innovation criterion asks about, and it's a strong, concrete moment for the demo to catch and guide the user through (EASE proactively saying "your plan is saved but not yet live — activate it in a Shift to make it bookable").
