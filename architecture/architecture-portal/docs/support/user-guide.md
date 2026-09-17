# User Guide — architecture-portal

Control: **CR-KM1**

## What This Service Does

`architecture-portal` is the web front end of the **Architecture Portal**, the central technical
architecture site for American Express engineers. It is a Next.js 16 (App Router) / React /
Chakra UI application that provides:

- **Docs & Playbooks** — rendering of Markdown/MDX architecture standards, the EA Design
  Playbook and domain playbooks, with a WYSIWYG "edit in GitHub" flow that automates the
  fork → branch → PR lifecycle (`src/app/api`, `src/app/docs`).
- **Initiatives** — metamodel-linked initiative landing pages, ADRs, Build-vs-Buy assessments and
  attestations (`src/app/initiatives`).
- **Business Architecture** — Enterprise Business Capability Model (EBCM) maps and customer
  journey views (`src/app/business-architecture`).
- **Company Domains / API directory** — API registration, NFR management and DARB/EARB review
  workflows (`src/app/company-domains`).
- **Metrics** — API certification and health dashboards (`src/app/resources/metrics`).
- **Skills** — AI-agent instruction sets and guidance (`src/app/resources/skills`).
- **Search** — Typesense-backed global search.

Users authenticate via AuthBlue SSO; GitHub (Enterprise/Cloud) OAuth is used only for the
contribution/editing flow.

Environments: E1 (dev), E2 (QA), E3 (prod). Local development runs on `http://localhost:3000`
(`npm run dev`). See [`runbook.md`](./runbook.md) for operations.

## Dependencies

### Upstream (this service depends on)

| Dependency | Purpose | Reference |
| --- | --- | --- |
| `architecture-api` (`github.aexp.com/amex-eng/architecture-api`) | All business data; called through `/api/proxy/[...path]` | `https://architectureportalapi[-dev|-qa].aexp.com` |
| Redis | Next.js ISR/data cache (`cache-handler.js`) | `REDIS_HOST/PORT/PWD` |
| Typesense | Search index | `TYPESENSE_API_KEY` |
| AuthBlue SSO | User authentication | `use-authblue-sso` |
| GitHub Enterprise (`github.aexp.com`) / GitHub Cloud | OAuth + content source for docs editing | NextAuth providers |
| Vault | Secret delivery | `/opt/epaas/vault/secrets/secrets` |
| OpenTelemetry / ELF | Traces and logs | `ELF_INGEST_URL` |
| Hydra | Hosting platform | `https://go.aexp.com/deploy-to-hydra` |

### Downstream (depends on this service)

| Consumer | Notes |
| --- | --- |
| Amex engineers, architects, DARB/EARB reviewers | Browser users of the portal |
| `ea-design-playbook` and domain playbook repositories | Rendered by the portal; PRs created by the WYSIWYG flow |

## SLOs

TODO: confirm SLO targets with the team; proposed values below are used as thresholds in
[`deployment-plan.md`](./deployment-plan.md) and [`rollback-plan.md`](./rollback-plan.md).

| SLI | Proposed target | Measurement |
| --- | --- | --- |
| Availability (E3) | 99.9 % monthly (`GET /` 2xx/3xx) | TODO: link uptime / synthetic monitor |
| Latency | p95 server response < 1.5 s; p99 < 3 s | OpenTelemetry traces (TODO: link Grafana dashboard) |
| Error rate | < 1 % 5xx (excluding upstream API outages) | ELF logs / traces |
| Support hours | Business hours (US Mountain / Phoenix), best effort otherwise | `#arch-portal-help` |

## Ownership

| Item | Value |
| --- | --- |
| Owning team | Enterprise Architecture — Architecture Portal team |
| CAR ID | `600002899` |
| Slack | `#arch-portal-help` (portal help) — https://my.slack.com/archives/C05655U6GMC; `#ea-design-playbook` (playbook content) — https://my.slack.com/archives/C0565A59YAZ |
| Email | `archportal@aexp.com` |
| On-call rotation | TODO: link on-call schedule |
| Source | `https://github.aexp.com/amex-eng/architecture-portal` |
| Deploy notifications | Slack channel `C0887PMFF3R` |

See also: [`troubleshooting-guide.md`](./troubleshooting-guide.md),
[`config-references.md`](./config-references.md).
