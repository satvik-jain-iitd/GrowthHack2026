# Runbook — architecture-portal

Control: **CR-SDE10**

Day-to-day operational procedures for the Architecture Portal UI (Next.js 16, Hydra service
`architecture1`, CAR ID `600002899`).

## Service Summary

| Item | Value |
| --- | --- |
| Runtime | Node.js 22 / Next.js 16 (`npm run start` → `src/scripts/server.js next start`) |
| Container port | 8080 (Helm probes `GET /`) |
| Local dev port | 3000 (`npm run dev`) |
| Environments | E1 (dev), E2 (QA), E3 (prod: IPC1 + IPC2) |
| Backend | `architecture-api` — `https://architectureportalapi[-dev|-qa].aexp.com` (proxied via `/api/proxy/[...path]`) |
| Cache | Redis (`@neshca/cache-handler`, `cache-handler.js`, `redis-client.js`) |
| Search | Typesense |
| Auth | AuthBlue SSO (`use-authblue-sso`) + NextAuth (GitHub Enterprise / GitHub Cloud OAuth for the WYSIWYG editing flow) |
| Telemetry | OpenTelemetry SDK → OTLP HTTP (traces + logs) → ELF (`ELF_INGEST_URL`) |
| Owners | `#arch-portal-help`, `archportal@aexp.com` |

## Health & Endpoints

| Endpoint | Purpose |
| --- | --- |
| `GET /` | Liveness / readiness probe target; renders home page. |
| `GET /api/auth/*` | NextAuth handlers (session, sign-in callbacks). |
| `GET /api/proxy/<path>` | Authenticated proxy to `architecture-api` (`/api/v1/...`). |
| `GET /api/search` | Typesense-backed search. |
| `GET /api/v3/*`, `/api/genai/*`, `/api/chat/*` | Feature APIs (GitHub CMS, GenAI assistants). |

Quick check from a workstation on the Amex network:

```bash
curl -sk -o /dev/null -w '%{http_code}\n' https://<portal-host>/
```

## Alert Responses

| Alert / symptom | First response | Escalate if |
| --- | --- | --- |
| Pods CrashLooping / readiness failing | `kubectl -n <hydra-ns> logs <pod>` (or Hydra console). Common causes: Vault secrets missing at `/opt/epaas/vault/secrets/secrets`, Redis unreachable, wrong Node version. | Not recovered after restart → page on-call, consider `rollback-plan.md`. |
| 5xx spike on `/api/proxy/*` | Check `architecture-api` health (`GET https://architectureportalapi*.aexp.com/api/health`). Portal is usually a victim, not the cause. | `architecture-api` healthy but portal still 5xx → check portal logs for auth/token errors. |
| SSO "unable to sign you on" modal for all users | AuthBlue outage or expired `NEXTAUTH_SECRET`/OAuth client secrets in Vault. | AuthBlue platform healthy → rotate/verify secrets, redeploy. |
| Stale content / pages not updating | Redis cache handler serving old ISR entries. Flush the affected keys (or `FLUSHDB` on the portal Redis DB in non-prod) and re-request the page. | Redis down → pages still serve (fallback) but with higher latency; restore Redis. |
| Search returns nothing | Typesense cluster unhealthy or `TYPESENSE_API_KEY` rotated. | Typesense team engagement. |
| HPA at `maxReplicas` (4) with high CPU | Check for traffic spike or runaway rendering (Mermaid/MDX). Consider temporarily raising `hpa.maxReplicas` in the env values file. | Sustained > 30 min. |
| Rate-limit 429s (`rate-limiter-flexible`) | Verify `RL_PER_MINUTE_LIMIT`, `RL_PER_HOUR_LIMIT`, `RL_ALLOWLIST`, `RL_ID_HEADER`. Add legitimate automation callers to the allowlist. | — |

## Escalation Path

1. Architecture Portal on-call (TODO: link on-call schedule).
2. `#arch-portal-help` Slack channel.
3. `archportal@aexp.com` (team distribution list).
4. Platform dependencies: Hydra support (`https://go.aexp.com/deploy-to-hydra`), AuthBlue,
   Redis / Typesense platform teams (TODO: link support channels).

## Common Operational Tasks

### Deploy / redeploy an environment
Use `Deploy To Hydra` (`.github/workflows/deploy-to-hydra.yml`) with `manual_op = Deploy an image`
and the target `manual_env`. See [`deployment-plan.md`](./deployment-plan.md).

### Blue/green switch or rollback
`Deploy To Hydra` → `manual_op = Switch (b/g)` or `Rollback` (optionally `rollback_version`).
See [`rollback-plan.md`](./rollback-plan.md).

### Restart pods
Trigger a rollout restart of the deployment from the Hydra console, or redeploy the same
image via the workflow (`image_sha256` = current image).

### Rotate a secret
Update the value in Vault (path in `config-references.md`), then restart/redeploy so the
sidecar re-renders `/opt/epaas/vault/secrets/secrets`.

### Scale
Edit `hpa.minReplicas` / `hpa.maxReplicas` / `cpuUtilizationPercentage` in the relevant
`helm/values_*.yaml` and redeploy.

### Run locally
```bash
npm ci
ADS_ID='<ads id>' ADS_PASSWORD='<ads password>' npm run dev   # first run fetches Vault secrets
npm run dev                                                   # subsequent runs
NEXT_PRIVATE_DEBUG_CACHE=1 npm run dev                        # debug cache handler
```

### Tests / quality gates
```bash
npm run lint
npm run test            # or npm run test:changed
npm run build
```

## Scheduled / Background Work
The portal has no cron jobs of its own; background sync jobs live in `architecture-api`
(see that repository's `docs/support/runbook.md`).

Related: [`troubleshooting-guide.md`](./troubleshooting-guide.md),
[`config-references.md`](./config-references.md).
