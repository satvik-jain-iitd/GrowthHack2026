# Troubleshooting Guide — architecture-portal

Control: **CR-KM1**

## Common Issues

### 1. Pods fail readiness / CrashLoopBackOff after deploy
- **Symptoms**: Hydra deployment stuck, `GET /` probe failing, pods restarting.
- **Likely causes**: Vault secrets not rendered to `/opt/epaas/vault/secrets/secrets`; Redis
  unreachable at startup; Node runtime mismatch (Node 20 crashes the OpenTelemetry
  instrumentation hook with `webidl.util.markAsUncloneable is not a function` — Node 22 required);
  `next build` output missing in the image.
- **Resolution**: read pod logs; verify the Vault sidecar and secret path; verify Redis
  connectivity from the cluster; confirm the Dockerfile base image is Node 22. If the previous
  version was healthy, follow [`rollback-plan.md`](./rollback-plan.md).

### 2. Pages return 5xx or "Something went wrong" when loading data
- **Symptoms**: docs/initiatives/company-domain pages error; `/api/proxy/*` returns 5xx.
- **Likely causes**: `architecture-api` down or degraded; wrong API host because `NEXT_PUBLIC_ENV` was not set correctly at build time (`src/constants/env.ts`);
  auth token not forwarded by the proxy.
- **Resolution**: check `https://architectureportalapi[-dev|-qa].aexp.com/api/health`. If the API
  is healthy, inspect portal logs for the proxy request (correlation ID) and check
  `src/constants/urls.ts` mapping for the environment.

### 3. Users cannot sign in ("unable to sign you on" modal)
- **Symptoms**: AuthBlue modal for all users, or NextAuth callback errors.
- **Likely causes**: AuthBlue outage; expired/rotated `NEXTAUTH_SECRET`,
  `GITHUB_ENTERPRISE_CLIENT_*` / `GITHUB_CLOUD_CLIENT_*`; `NEXTAUTH_URL` mismatch with the
  environment host.
- **Resolution**: confirm AuthBlue status; verify secret values in Vault; redeploy after
  rotation. Locally, unauthenticated pages show this modal after ~60 s — expected.

### 4. Stale content after a docs/playbook change
- **Symptoms**: GitHub shows updated Markdown but the portal renders the old version.
- **Likely causes**: Redis-backed ISR cache still holding the old entry.
- **Resolution**: wait for revalidation, or flush the relevant cache keys in Redis. Debug the
  cache handler locally with `NEXT_PRIVATE_DEBUG_CACHE=1 npm run dev`.

### 5. Search returns no results
- **Symptoms**: Global search empty or erroring.
- **Likely causes**: Typesense cluster unavailable; `TYPESENSE_API_KEY` rotated; index not
  rebuilt after a schema change.
- **Resolution**: check Typesense health; verify the key in Vault; re-run the index job
  (owned by `architecture-api` — see its runbook).

### 6. WYSIWYG "Edit" flow fails to create a PR
- **Symptoms**: Error when saving edits; no fork/branch/PR created on `github.aexp.com`.
- **Likely causes**: GitHub OAuth token expired; user lacks repo permissions; GitHub Enterprise
  rate limiting or outage.
- **Resolution**: ask the user to sign out/in of GitHub in the portal; verify OAuth app
  credentials; check `github.aexp.com` status.

### 7. HTTP 429 responses
- **Symptoms**: Automation or heavy users receive 429.
- **Likely causes**: `rate-limiter-flexible` limits (`RL_PER_MINUTE_LIMIT`, `RL_PER_HOUR_LIMIT`) exceeded.
- **Resolution**: add legitimate callers to `RL_ALLOWLIST` (identified via `RL_ID_HEADER`) or
  adjust limits, then redeploy.

### 8. High latency / HPA at max replicas
- **Symptoms**: p95 latency > threshold; 4/4 replicas at high CPU.
- **Likely causes**: Traffic spike; expensive server rendering (large MDX, Mermaid diagrams,
  XLSX exports); cache misses due to Redis issues.
- **Resolution**: check Redis health first; review traces for slow routes; temporarily raise
  `hpa.maxReplicas` in `helm/values_<env>.yaml` and redeploy.

### 9. Local dev: `ADS_ID / ADS_PASSWORD not provided for Vault fetch`
- **Cause**: first `npm run dev` without credentials.
- **Resolution**: `ADS_ID='…' ADS_PASSWORD='…' npm run dev` once; subsequent runs use the
  cached secrets. See `README.md`.

## Dashboards & Observability

| Tool | Link | Notes |
| --- | --- | --- |
| Grafana — service dashboard | TODO: link Grafana dashboard | Request rate, 5xx, p95 latency, pod CPU/memory |
| ELF (logs) | TODO: link ELF query for `architecture-portal` | OTLP logs exported to `ELF_INGEST_URL` |
| Traces | TODO: link tracing UI | OpenTelemetry auto-instrumentation (HTTP, Redis) |
| Hydra console | `https://go.aexp.com/deploy-to-hydra` | Deployments, pods, rollouts |
| GitHub Actions | `https://github.aexp.com/amex-eng/architecture-portal/actions` | CI and deployment history |
| Deploy notifications | Slack channel `C0887PMFF3R` | |
| Upstream API health | `https://architectureportalapi[-dev|-qa].aexp.com/api/health` | |

## Getting Help

- Slack: `#arch-portal-help` (portal), `#ea-design-playbook` (playbook content)
- Email: `archportal@aexp.com`
- Escalation path: see [`runbook.md`](./runbook.md)
