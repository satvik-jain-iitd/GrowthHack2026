# Reconciliation: prd.md vs hero-journey-floor-plan.md

*(Recovered from explore-agent summary; the agent's read-only toolset could not write files directly.)*

**Gaps found:**

1. `Single Day Edit` is a numbered step (Step 7) in the ground-truth journey, but the PRD treats it as optional/out-of-scope rather than a modeled FR (`prd.md` §6.2 vs `hero-journey-floor-plan.md` Step 7).
2. `Assigned Seating Events require a selectable floor plan` is a documented dependency in the ground truth, but no FR in the PRD covers it or explicitly scopes it out (`hero-journey-floor-plan.md`, "Documented friction / exceptions").
3. `Resy/POS table names must match exactly` is a documented friction point in the ground truth; the PRD mentions POS/table-name matching only as out-of-scope, not as an acknowledged dependency risk.
4. **Step-count mismatch:** ground truth documents 7 steps including Single Day Edit, while the PRD's UJ-1 path and FR-3 describe only a 6-step core journey without clearly stating Step 7 is the one being excluded — creates an internal inconsistency between "confirmed 7-step sequence" (stated in FR-3) and the 6 steps actually walked through.
5. The save-vs-activate framing is directionally accurate, but the PRD underplays that the ground truth also treats cross-system table-name matching as a friction point worth naming alongside it, even if out of scope.
