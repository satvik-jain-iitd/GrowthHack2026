# Reconciliation — AmEx Architecture Portal ADRs vs ARCHITECTURE-SPINE.md

## Overall conformance verdict

The spine is directionally aligned with the ADRs it originally consulted (AI/ML, Database, Observability, Build-vs-Buy), but it is **not yet fully conformant** with the AmEx Architecture Portal as a Phase 5 architecture input. The largest gaps are from the previously-unconsulted Front-End ADRs: the spine selects **Next.js** where the One-App ADR prescribes **One App** for dynamic/high-interaction web experiences, and it deliberately keeps a non-DLS Host App Skin without satisfying the DLS ADR's formal exemption path.

The API Integration Platforms and Event Brokers ADRs are mostly non-applicable to the local, single-demo MVP as written, but the spine should explicitly say why they do not bind the in-process Next.js API route, in-browser pub/sub bridge, and local append-only telemetry log; otherwise production readers could interpret those choices as bypassing enterprise endpoint/messaging placement.

## 1. AI/ML Prescriptive ADR

### Conforms

- **AD-3 — LLM confined to one isolated, real-time inference boundary** follows the ADR's prescription table for real-time GenAI microservices: Safechain Framework is prescribed for **OLTP**, **SWE Developers**, **Code**, **Real-time**, **RAG Applications / other GenAI Microservices**. The EASE call sites are FR-1 intent-to-journey resolution and FR-2 screen-state-to-step inference, both interactive request/response paths.
- **AD-3** correctly rejects AIDA for the inline flow. The AI/ML ADR positions AIDA as **OLAP**, **Data Science Teams**, **No code / Low code**, **Batch**, for RAG workflows, vector DB maintenance, embeddings updates, and GenAI batch workflows; that does not fit the spine's interactive browser workflow.
- **AD-3 and the Stack** preserve configurability by forcing both LLM call sites through one seam and provider adapter, aligning to the AI/ML ADR's driver that enterprise GenAI solutions should be configuration-driven.
- **AD-4** also conforms to the spirit of the AI/ML ADR by keeping deterministic completion/validation out of prompts; the LLM is not asked to decide completion.

### Deviates (undocumented)

- None found at the decision level: the chosen pattern is the AI/ML ADR's real-time OLTP direction.

### Deviates (documented)

- **Stack — LLM Boundary Service runtime** chooses a **Next.js API route / Node.js colocated runtime** rather than the ADR-described Safechain reference implementation using **Python FastAPI services and safe chain**. The spine documents the reason: one isolated, stateless real-time seam without a second runtime/deploy target under hackathon time pressure. This is documented, but only as an assumption; if the ADR is read as prescribing the actual Safechain Framework rather than only the Safechain architectural pattern, the spine needs an explicit exception or a change to use Safechain.

### Not applicable

- ConfigML-Model-Training, Convo Chef, Finance Insight Assistant, Investor Relations Assistant, Ask Amex, One Find, and AI Services are not applicable based on the ADR's option descriptions: EASE is not model training/fine-tuning, batch text preprocessing, finance/IR assistant workflow, or an in-progress enterprise cognitive-search platform selection.

### Missed prescriptions

- The ADR's decision drivers include **Observability** for GenAI executions. The spine handles product telemetry in AD-6 but does not specify LLM-boundary execution observability (request IDs, latency, model/provider selection, error classes, redaction/substitution outcomes, prompt/response audit controls, or how these would feed the enterprise observability path).
- The spine should clarify whether it is adopting the **Safechain Framework** itself or only a **Safechain-like seam**. The current wording says “Safechain-pattern,” which is weaker than the ADR's prescription table naming Safechain Framework.

## 2. Database Type Selection Prescriptive ADR

### Conforms

- **AD-5 — Journey/Micro-Guide state is relational** conforms to the Database ADR's relational database use cases: structured data, ACID compliance, referential integrity, transactional/workflow systems, and applications requiring strict consistency. Journey runs, Micro-Guide approval state, and Specialist Review actions need correctness and state-machine integrity.
- **AD-5 — Telemetry Events are append-only/schema-flexible** conforms to the Database ADR's document database use cases, which explicitly include **event logging**, schema-flexible event logging at scale, and applications requiring flexible/evolving schemas.
- **AD-5** correctly avoids forcing one database category onto two different data shapes, matching the ADR's core problem statement that database type must be finalized from functional and non-functional requirements.
- **Consistency Conventions** align with the ADR's data integrity guidance by specifying UUIDs, ISO 8601 timestamps, flat telemetry envelopes, and explicit Micro-Guide state transitions.

### Deviates (undocumented)

- None for **database type/category** selection.

### Deviates (documented)

- **Stack** chooses **SQLite** for relational state and a local **JSON Lines file** for telemetry. The spine documents these as demo-local choices (“embedded, file-based — no server” and local filesystem). This is adequate for a local GrowthHack MVP, but it is not a production database platform decision and does not satisfy the Database ADR's formal exception process if used beyond the demo.

### Not applicable

- Wide-column, time-series, vector, and graph categories are not applicable to the current MVP data model. The spine has no large-scale analytical/fraud workload, vector similarity retrieval, knowledge graph, or time-series database requirement beyond lightweight local telemetry.

### Missed prescriptions

- The Database ADR's decision drivers require explicit consideration of data structure, database size, scalability, consistency, availability, partition tolerance, read/write paths, frequency, cost, security/compliance, and nature of data. AD-5 provides a good category rationale, but the spine does not explicitly walk these drivers.
- The ADR includes a formal **Exemption Process** stating that no implicit/informal exemptions are permitted and that alternative platforms require EARB review, security/governance controls, cost-benefit analysis, migration roadmap, and Buy-vs-Build analysis. The spine should say that SQLite/JSONL are demo-only fixtures and define the production decision point rather than appearing to finalize them as enterprise platforms.

## 3. Application Observability & Auditability Prescriptive ADR

### Conforms

- **AD-6 — Telemetry Events are OTel-shaped** partially aligns with the Observability ADR's ELF/OTel direction: ELF is the starting point for application logs/traces/metrics, and the table says OTel tracing and OTel metrics should be stored/visualized/monitored via ELF.
- **AD-6** explicitly avoids a dead-end demo schema by using OTel-compatible event fields (`timestamp`, `event_type`, `journey_id`, `step`, `attributes`) and documenting future ELF/OTel wiring in Deferred.
- **Deferred — Production ELF/OpenTelemetry wiring** correctly identifies production observability as future work rather than pretending the local JSON telemetry is production observability.

### Deviates (undocumented)

- None for the demo's local-only observability posture; AD-6 clearly says full ELF/OTel wiring is deferred.

### Deviates (documented)

- **AD-6** intentionally does **not** wire ELF/OpenTelemetry for the demo and emits lightweight structured JSON only. This is documented, but the ADR's exception language is stricter than the spine: it says app teams should document with **EA Playbook ADRs** the reasons for not using ELF and the exclusive need for options other than ELF. The spine gives rationale and migration shape, but it is not itself an EA Playbook ADR exception record.

### Not applicable

- Mainframe tracing is not applicable; the spine has no mainframe path.
- Third-party/proprietary application instrumentation is only weakly applicable to the mocked Host App Skin. It is not a real COTS/proprietary application; it is a local simulation fixture.
- Session Replay is not required by the PRD/spine and should not be inferred without privacy/security review.

### Missed prescriptions

- The ADR maps **real-time customer UI experience / RUM** to **Dynatrace**, **comprehensive SSR/CSR Web UI observability** to **UXPulse**, and **business-level intelligence/business process monitoring/reporting/analytics** to **Splunk**. The spine does not state whether these are out of scope for MVP or production candidates.
- If FR-9 telemetry is used for product/business reporting rather than only local guide generation, the spine should classify it against the ADR's Splunk business-intelligence row, not only the ELF/OTel application-observability row.

## 4. Build-vs-Buy Overview Guidebook

### Conforms

- **AD-7 — Build vs buy boundary** follows the Guidebook's intent to avoid duplicative custom build and excessive customization by reusing commodity rails (GrowthHack LLM API, Next.js/React, DLS v7, SQLite) and building only differentiating EASE IP (Journey model, deterministic validation, telemetry schema, Micro-Guide generator, Specialist Review workflow).
- **AD-7** correctly notes the Guidebook's formal trigger pattern: BvB must be used for major software procurement/development decisions when there is a new procurement/application/significant technology change **and** spend > $500K, Enterprise Top Priority / ECMI impact, or Critical/High application inherent risk.
- The spine does not include competitively sensitive cost information, aligning with the Guidebook's warning not to include such information in BvB artifacts.

### Deviates (undocumented)

- None found.

### Deviates (documented)

- **AD-7** documents that the formal BvB process is **informal/not triggered** for this hackathon scale and that a real production build would revisit formal submission if spend/risk thresholds are later met. This is consistent with the Guidebook's example that low-spend/low-risk software may use the framework as recommended best practice rather than as a mandatory process.

### Not applicable

- Formal EA attestation, Domain/Enterprise ARB review, GSM procurement path, and BvB SLAs are not applicable unless the project becomes an eligible BvB assessment candidate.

### Missed prescriptions

- The spine asserts that no formal trigger applies but does not record evidence for **estimated spend**, **ETP/ECMI status**, or **Application Inherent Risk**. For rigor, it should include a one-line eligibility basis, even if the answer is “demo-only, no procurement, no production CAR, assumed Low inherent risk.”

## 5. Design Language System Prescriptive ADR

### Conforms

- **Stack and Inherited Invariants** select `@americanexpress/dls-react` v7 for the **EASE Chrome Layer**, which conforms to the DLS ADR's decision that web-based experiences should use Design System components for consistent visual affordance, digital brand identity, accessibility, reusability, browser compatibility, performance, and supported developer experience.
- **AD-1 — Two-layer code boundary** prevents Host App Skin CSS from leaking into EASE Chrome and prevents shared styles/components, which helps protect the DLS surface from accidental non-DLS styling.
- **AD-7** treats DLS v7 as a bought/reused enterprise rail rather than a custom local component library, which aligns with the ADR's preference for Design System components over local component libraries.

### Deviates (undocumented)

- **High-confidence conflict:** **Inherited Invariants, AD-1, AD-2, and Stack** deliberately keep the **Host App Skin** as a non-DLS vanilla HTML/CSS/JS surface and even define a DLS component rendered inside Host App Skin markup as non-compliant. The DLS ADR does not provide a blanket allowance for an AmEx-built internal web surface to opt out of DLS. For intranet/internal applications, it says the decision is to use Design System components for the same reasons as internet applications; for unique experiences, teams should still use Design System as a foundation and extend it.
- The spine does not cite the DLS ADR in `sources`, does not label the Host App Skin as a DLS exception, and does not invoke the ADR's **formal architecture exception request to EARB**.

### Deviates (documented)

- The non-DLS Host App Skin is documented as an inherited product/design invariant and as a mocked third-party/ResyOS realism choice, but it is **not documented in the terms required by the DLS ADR**: detailed technical requirements not met by DLS, proposed alternative with accessibility review steps, cost-benefit analysis, and migration path to eventually adopt the enterprise platform.

### Not applicable

- None for EASE Chrome: it is clearly an AmEx-built web experience and the DLS ADR applies.
- The only plausible non-applicability argument for Host App Skin is that it is a **non-product demo fixture simulating a third-party host application**, not the EASE product surface. The spine implies this, but does not state it strongly enough to remove the conflict.

### Missed prescriptions

- The spine should explicitly add the DLS ADR to sources/governance and state one of two compliant positions: either (1) Host App Skin is not an AmEx product surface and is only an isolated third-party simulation fixture, with accessibility guardrails; or (2) Host App Skin is an exception requiring EARB documentation under the DLS ADR.
- The spine should mention the DLS ADR's customization process: custom/unique experiences should use Design System as a foundation and coordinate with the Design System team.

## 6. One-App Prescriptive ADR

### Conforms

- The spine's EASE Chrome Layer is React-based, dynamic, and high-interaction; those technical properties align with why the ADR favors One App for capability, security, SSR performance, micro-frontends, compliance, resilience, support, and skill availability.
- **AD-1**'s layer boundary and bridge pattern is conceptually compatible with One App micro-frontend/module boundaries, but the spine does not actually adopt One App.

### Deviates (undocumented)

- **Critical conflict:** **Stack and AD-2** choose a new **Next.js** application for the EASE Chrome Layer. The One-App ADR's Decision states that for **dynamic experiences of any size**, including logged-in experiences, dashboards, data-driven applications, high-interaction websites, large forms, multi-step journeys, and browser-managed state, the decision is to use **One App**. EASE is a dynamic, high-interaction, multi-step guided workflow with browser-managed state. The spine does not cite this ADR, does not explain why One App is not used, and does not invoke the ADR's formal exemption process.
- **Stack — Next.js 16.3.5 / React 19** is therefore not just an uncited technology choice; it is an alternative frontend application architecture where the ADR prescribes One App.

### Deviates (documented)

- None. The spine documents Next.js as the chosen stack, but it does not document the deviation against the One-App ADR or satisfy its formal exemption process.

### Not applicable

- One CMS is not applicable to EASE Chrome because the product is not mostly static/content-managed and requires dynamic interaction, multi-step journey state, validation, and guided overlay behavior.
- Documentation-site out-of-scope language is not applicable; EASE is a product/demo app, not developer documentation.

### Missed prescriptions

- The spine should either adopt One App (including Single Module Application if the MVP is small) or add a formal EARB exception with detailed technical requirements not met by One App, security/governance controls, cost-benefit analysis, and migration path.
- The spine should explicitly evaluate the Host App Skin separately: as a static third-party simulation fixture it may be outside the One-App production-surface prescription, but that boundary is not stated in One-App terms.

## 7. API Integration Platforms Prescriptive ADR

### Conforms

- **AD-8 — No real external system integration** avoids most API Integration ADR triggers by forbidding outbound calls to real Resy/Toast/Salesforce/POS endpoints and keeping the MVP boundary local.
- The spine's **LLM Boundary Service** is currently described as colocated with the Next.js app as an API route for the demo, not as an enterprise API Product exposed to independent consumers. If it remains private/in-process to the single demo app, the API endpoint placement ADR is not directly triggered.

### Deviates (undocumented)

- No definite deviation for the MVP as written, because the ADR is about API platform workload placement for API providers/consumers and enterprise integration patterns, while the spine describes a local demo with no production API onboarding.

### Deviates (documented)

- None. The spine has not documented an API Integration ADR applicability decision.

### Not applicable

- B2B inbound/outbound, partner sandbox, AED DevPortal, SFTP/file-transfer, POS/CoreSwitch, public-cloud-to-on-prem, and inter-cloud integration rows are not applicable because AD-8 forbids real external integrations for the MVP.
- Asynchronous API integration rows are not applicable to the browser-local bridge or local JSONL telemetry log.

### Missed prescriptions

- The spine should explicitly classify the **LLM Boundary Service API route**. If it is a production API workload exposed beyond the single web app, the ADR prescribes platform placement by integration pattern: e.g., C2B web/mobile to Amex services uses Choreo GraphQL, EWP REST/WebSocket, or One Data; A2A on-prem/internal routes use eCP Hydra Service Mesh, EAG API Gateway, or One Data.
- The ADR's workload-placement instructions require identifying the integration pattern, considering the first prescribed option, documenting ADR rationale if a later/alternative option is used, and submitting a TECH06.61 exception if no listed option fits. The spine does not do this for the LLM route because it assumes local demo scope.
- The API lifecycle guidance includes threat modeling, API metadata, CAR ID lifecycle state, auth, monitoring, support, and decommissioning for onboarded APIs. The spine should mark these deferred/not applicable for the local demo and production-required if the route becomes an API Product.

## 8. Event Brokers and Messaging Prescriptive ADR

### Conforms

- The spine does not select an enterprise event broker for the MVP, which is acceptable for the described local-only architecture: the bridge is in-browser pub/sub and the telemetry log is a local append-only JSONL file, not enterprise inter-service event delivery.
- **AD-5 and AD-6** correctly treat telemetry as persisted product/application events rather than as guaranteed brokered messaging between independent services.

### Deviates (undocumented)

- None for the MVP as written.

### Deviates (documented)

- None. The spine does not explicitly discuss why RTF/Hyperdrive are not used.

### Not applicable

- The ADR is about AmEx enterprise event-driven solutions using **RTF** and **Hyperdrive**: guaranteed delivery from publishers to subscribers, event exchange, validation/filter/transform/enrich/route workflows, replay/history, schema lifecycle, and push/pull ingress/egress. The in-browser event bus is an implementation detail inside one tab and has no inter-service publisher/subscriber delivery requirement.
- The local append-only telemetry event log is a persistence/audit input for Micro-Guide generation, not an enterprise broker. It has no independent consumers, no guaranteed delivery requirement, no replay service, and no cross-application schema lifecycle in the MVP.

### Missed prescriptions

- The spine should explicitly say the Event Brokers ADR is not triggered for the in-browser bridge or local JSONL telemetry. If future EASE production publishes telemetry/events to other applications or needs guaranteed delivery/replay, it must select RTF, Hyperdrive, or another prescribed platform according to the ADR/API Integration async rows.
- If telemetry becomes an enterprise event stream, the spine will need to address at-least-once delivery, idempotent consumers, payload size, curated schema lifecycle, replay/history, and active-active/GDHA expectations from the ADR.

## Summary of findings by severity

- **critical** finding: One-App ADR conflict. The spine chooses Next.js for a dynamic, high-interaction, multi-step, browser-state web experience where the ADR prescribes One App. *Fix:* adopt One App/Single Module Application or add a formal EARB exception with technical gaps, controls, cost-benefit, and migration path.
- **high** finding: DLS ADR conflict for Host App Skin. The spine deliberately keeps an AmEx-built repo surface non-DLS without satisfying the DLS exemption process. *Fix:* reframe Host App Skin as an isolated third-party simulation fixture with guardrails, or document a formal DLS exception; keep EASE Chrome strictly DLS.
- **medium** finding: AI/ML Safechain implementation ambiguity. The spine adopts a Safechain-pattern seam but not the ADR-described Safechain Framework/Python FastAPI implementation. *Fix:* either use Safechain Framework or document a real exception/assumption closure for the Next.js API route.
- **medium** finding: Observability exception is documented but not formal. AD-6 explains no ELF/OTel for demo, but the ADR calls for EA Playbook ADR documentation for not using ELF. *Fix:* mark JSON telemetry as demo-only and add production observability mapping to ELF/OTel plus UXPulse/Dynatrace/Splunk applicability.
- **medium** finding: API endpoint placement not classified. The local LLM Boundary Service route is likely not an enterprise API workload, but the spine never says so. *Fix:* add an applicability note; if production/exposed, place through Choreo/EWP/EAG/Hydra/One Data per pattern or exception.
- **medium** finding: Database platform choices are demo fixtures. Relational/document categories conform, but SQLite/JSONL are not enterprise platform decisions and no formal exemption is recorded. *Fix:* state demo-only status and define production database selection/exception trigger with DB ADR drivers.
- **medium** finding: ADR traceability gap. Frontmatter sources omit DLS, One-App, API Integration, and Event Brokers ADRs even though at least DLS and One-App bind the architecture. *Fix:* add all consulted/binding ADRs to sources and explicit applicability notes.
- **low** finding: BvB non-eligibility is asserted but not evidenced. *Fix:* add a one-line basis for no spend/procurement, no ETP/ECMI, and assumed Low inherent risk.
- **low** finding: Event Brokers non-applicability is implicit only. *Fix:* state RTF/Hyperdrive are not triggered for in-browser pub/sub/local JSONL, and define production trigger if events leave the app boundary.
