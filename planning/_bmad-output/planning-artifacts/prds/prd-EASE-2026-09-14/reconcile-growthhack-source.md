# Reconciliation: prd.md vs growthhack-source-brief.md

*(Recovered from explore-agent summary; the agent's read-only toolset could not write files directly.)*

**Gaps found:**

1. **Missing Gen AI FAQ capability constraints:** the PRD's Constraints/Guardrails lists supported models and the no-credential-sharing rule, but does not reflect the FAQ's allowed capabilities: **Redaction, Substitution, Safechain, Local Memory**.
2. **Missing MVP core from vision §53:** the source vision's own "GrowthHack MVP" definition explicitly includes **friction identification** and **approval of improved journey knowledge**. The PRD covers telemetry (FR-9) and approve/reject (FR-11), but its Non-Goals language around "EASE Signals" risks scoping out friction identification, which the vision's own stated MVP wants demonstrated.
3. **Glossary omission:** the PRD's Glossary omits the source's core product-family/stage terminology, especially **EASE Guide** (Stage 1 — literally what this MVP embodies) and the framing of the Implementation Specialist as evolving toward "quality controller."
4. **Non-Goals may over-exclude stated MVP scope:** the source vision ties the MVP to a complete loop including Learn/Improve and specialist approval of journey knowledge (which the PRD's §4.7 does cover) — but the Non-Goals' broad exclusion of "Signals" without qualifying that per-run friction telemetry (FR-9) is still in-scope could be read as contradicting the vision's own MVP definition.
