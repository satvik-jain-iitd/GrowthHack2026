# Deployment Plan — architecture-portal

Control: **CR-SDE10** (Build Support Documentation)

`architecture-portal` is the Next.js 16 / React front end of the Architecture Portal. It is
deployed to **Hydra** (project `architecture-intra-hydra`, service `architecture1`,
CAR ID `600002899`) in three environments: E1 (dev), E2 (QA) and E3 (prod, IPC1 + IPC2).

## Roles and Responsibilities

| Role | Who | Notes |
| --- | --- | --- |
| Change owner | Engineer who authored the PR being released | Opens the RFC (or confirms auto-RFC) and drives the deployment. |
| Approvers | Architecture Portal team lead + one additional maintainer | PR approval on `main`; RFC approval per Amex change policy. |
| On-call | Architecture Portal on-call rotation — TODO: link PagerDuty/on-call schedule | Monitors the release window and owns rollback decisions. |
| Comms | Change owner | Posts in `#arch-portal-help` before/after the deployment. |
| Team contact | `archportal@aexp.com`, Slack `#arch-portal-help` | |

## Pre-Deployment Checklist (Go / No-Go)

- [ ] PR merged to `main` with green **Continuous Integration** (`.github/workflows/ci.yml`:
      `npm run format:check`, `npm run lint`) and a green "Run Tests & SonarQube" job from the
      `Deploy To Hydra` PR run. Run `npm run test` and `npm run build` locally before merging.
- [ ] PR description enforcement passed (`.github/workflows/pr-desc-enforcement.yml`).
- [ ] E1 deployment (see Deployment Steps) is healthy and smoke-tested.
- [ ] E2 deployment has been validated by QA / stakeholders.
- [ ] **Dependency checks**
  - [ ] `architecture-api` version in the target environment supports any new/changed
        endpoints consumed via `src/app/api/proxy/[...path]` (`architectureportalapi[-dev|-qa].aexp.com`).
  - [ ] Redis cache (`REDIS_HOST`/`REDIS_PORT`/`REDIS_PWD`) reachable — the custom
        `cache-handler.js` depends on it.
  - [ ] Typesense search cluster reachable (`TYPESENSE_API_KEY`).
  - [ ] Vault secrets for `600002899_architecture-intra-hydra_architecture1` are current
        (see `config-references.md`).
- [ ] Helm values reviewed for the target environment (`helm/values_e1.yaml`,
      `helm/values_e2.yaml`, `helm/values_e3_ipc1.yaml`, `helm/values_e3_ipc2.yaml`).
- [ ] RFC / CHG number available for E3 (workflow input `rfc`; default in the workflow
      is a placeholder — always supply the real CHG for prod).
- [ ] `rollback-plan.md` reviewed; previous known-good Hydra deployment version noted.
- [ ] Deployment window agreed and announced in `#arch-portal-help`.

## Deployment Steps

Deployments are performed through GitHub Actions
`.github/workflows/deploy-to-hydra.yml` ("Deploy To Hydra"), which builds the Docker image
(`Dockerfile`), pushes it to `artifactory.aexp.com/paas-registry`, publishes the Helm values
file and deploys blue/green to Hydra. A legacy `Jenkinsfile` (XLR "hydra_app" publish) also
exists; the GitHub Actions workflow is the primary path.

1. **E1 (dev)** — `Deploy To Hydra` is triggered on `pull_request` to `main` (CI/scan stages) and
   via `workflow_dispatch`; it has no `push` trigger, so after merging run it manually with
   `manual_op = Deploy an image`, `manual_env = e1`. Confirm the run succeeded in the Actions
   tab and that the Slack notification (channel `C0887PMFF3R`) is green.
2. **E2 (QA)** — run `Deploy To Hydra` via `workflow_dispatch`:
   `manual_op = Deploy an image`, `manual_env = e2`. Optionally pin `image_sha256` to the
   image built for E1.
3. **Validate E2** using the steps in *Validation Steps* below.
4. **E3 (prod)** — run `Deploy To Hydra` via `workflow_dispatch`:
   `manual_op = Deploy an image`, `manual_env = e3`, `rfc = <CHG number>`, and fill in
   `testing_completed`, `testing_artifacts`, `impact_analysis`.
   This deploys to the inactive (green) slot for both IPC1 and IPC2.
5. **Blue/green switch** — once green-slot validation passes, run
   `manual_op = Switch (b/g) - Switch between blue/green environments`, `manual_env = e3`.
6. Follow the operational verification checks in [`runbook.md`](./runbook.md)
   (health, cache, auth) after the switch.

## Validation Steps

| Check | How | Threshold |
| --- | --- | --- |
| Pod health | Kubernetes liveness/readiness probes `GET /` on port 8080 (see Helm values) pass; HPA replica count stable. | All replicas Ready within 5 min |
| Smoke test — home page | `GET https://<env host>/` returns 200 and renders. | 200 |
| Smoke test — SSO | Log in via AuthBlue / NextAuth; landing page loads with user identity. | Success |
| Smoke test — API proxy | Open a docs page and an initiatives page; data loads from `architecture-api` through `/api/proxy/...`. | No 5xx |
| Smoke test — search | Use global search; Typesense results returned. | Results within 2 s |
| Cache | Redis cache handler connected (no `ECONNREFUSED` in logs; `NEXT_PRIVATE_DEBUG_CACHE=1` locally if needed). | No cache errors |
| Error rate | OpenTelemetry traces/logs (ELF, `ELF_INGEST_URL`) — 5xx rate. | TODO: confirm SLO — proposed < 1 % over 15 min |
| Latency | p95 server response time. | TODO: confirm SLO — proposed p95 < 1.5 s |

Dashboards: TODO: link Grafana / ELF dashboards (see `troubleshooting-guide.md`).

If any threshold is breached, follow [`rollback-plan.md`](./rollback-plan.md).

## Communications

| When | Who | Channel |
| --- | --- | --- |
| ≥ 1 business day before E3 | Change owner | `#arch-portal-help` — announce window and RFC |
| Start of E3 deployment | Change owner | `#arch-portal-help` |
| After blue/green switch and validation | Change owner | `#arch-portal-help` (+ `#ea-design-playbook` if playbook-rendering behaviour changed) |
| Rollback or incident | On-call | `#arch-portal-help`, `archportal@aexp.com`, RFC update |
| Automated | GitHub Actions | Slack channel `C0887PMFF3R` (configured in `deploy-to-hydra.yml`) |

Related: [`runbook.md`](./runbook.md), [`config-references.md`](./config-references.md),
[`rollback-plan.md`](./rollback-plan.md).
