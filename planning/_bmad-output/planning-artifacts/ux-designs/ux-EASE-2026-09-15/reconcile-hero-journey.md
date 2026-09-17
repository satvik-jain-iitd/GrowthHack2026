# Reconciliation — hero-journey-floor-plan.md against DESIGN.md/EXPERIENCE.md

## Coverage summary
The two spines preserve the MVP's core Step 1-6 arc and correctly elevate the save-versus-activate gap as the key experience moment. Step 7 **Single Day Edit** does not appear to leak back into scope. Most reconciliation issues are concentrated in `EXPERIENCE.md`: exact Resy breadcrumbs/labels are simplified, and several evidence-backed constraints/exceptions from the hero journey are not yet captured as explicit experience or validation decisions.

## Gaps (in hero journey, missing from spines)
- **Step 1 edit-existing path is missing.** The source says the user can **create a new plan or select an existing one to edit**; `EXPERIENCE.md` hardcodes a greenfield setup state ("No Floor Plan exists yet") without calling that an intentional MVP simplification.
- **Multi-plan activation nuance is missing.** The source Step 6 says the operator can **select one or more plans** in Shift activation; the spines only model selecting a single plan and do not state whether this is a deliberate MVP narrowing.
- **Event-level completion coverage is missing.** The source says the journey is complete when the intended plan is selected in every relevant **Shift/Event** and tables appear under availability; the spines cover Shift activation/availability but omit Event or Assigned Seating Event applicability.
- **Operational-vs-artwork framing is not carried forward.** The source explicitly says the floor plan is a **logical operating representation, not merely artwork**, and includes physical placement/shape as part of configuration. The spines mention adding/placing tables, but do not convert this into a stated experience principle or validation concern.

## Contradictions (spines vs hero journey)
- **Activation breadcrumb is compressed beyond the source.** `EXPERIENCE.md` uses **Service → Shift Settings → Edit Shift → Floor Plans**, while the ground truth says **Service → Shift Settings → ⋮ beside Shift → Edit Shift → Step 2 Service Settings → Floor Plans**. That drops real intermediate labels/waypoints the source treats as part of the task.
- **Table combinations are narrowed to pairs without support in the source.** `EXPERIENCE.md` says EASE validates that a combination references **two real tables**. The hero journey only says to select **combinable tables** and define the resulting combined table/party capacity. If MVP intends pair-only combinations, that should be framed as a scoped simplification, not as the ground truth flow.

## Terminology drift
- `EXPERIENCE.md` uses shorthand like **"ID"** and **"type"**; the source uses the more exact Resy terms **"Table ID/name"** and **"Table Type."**
- The final verification point is labeled **"Shift Availability"** in the spine, while the source's completion criterion names **"Step 3 Availability"** and explains that shift availability is derived from the selected floor plan. If the mock UI uses a different label, the mapping should be explicit.
- The activation path in the spine drops the explicit **"⋮ beside Shift"** affordance and **"Step 2 Service Settings"** label, making the navigation read cleaner than the evidence-backed breadcrumb.
- The spine says **"add a room"**; the source says **"add rooms/areas as needed."** Minor, but it narrows the native vocabulary used in the journey.

## Dropped qualitative ideas
- The source's documented cross-system friction that **Resy/POS table names must match exactly** for check matching / Toast Digital Chits (`B1` vs `B 1` vs `b1` vs `1`) is not reflected as a validation rule, warning, guide note, or explicit out-of-scope decision in either spine.
- The source says **Assigned Seating Events require a selectable floor plan** and may require a new layout to be created first; this exception is not represented in either spine.
- The source's emphasis that the floor plan is an operational setup artifact, not just a visual drawing, is not surfaced as a UX/design decision even though it materially affects what EASE should validate and narrate.
