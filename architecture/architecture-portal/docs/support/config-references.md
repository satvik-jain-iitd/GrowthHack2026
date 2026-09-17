# Configuration References — architecture-portal

Control: **CR-SDE10**

Infrastructure layout and key configuration values. Secret **values** are never stored in this
repository — only their names and the Vault location.

## Infrastructure Layout

| Item | Value |
| --- | --- |
| Platform | Hydra (Kubernetes PaaS) — `https://go.aexp.com/deploy-to-hydra` |
| Hydra project / service | `architecture-intra-hydra` / `architecture1` |
| CAR ID | `600002899` (`.amex/buildblocks.yaml`) |
| Container registry | `artifactory.aexp.com/paas-registry` (image `<repo>-image`) |
| Helm values registry | `https://artifactory.aexp.com/paas-raw-registry/com/aexp` |
| Container port | 8080 |
| Deployment strategy | Blue/green per environment (workflow `Switch (b/g)`) |

### Environments

| Env | Purpose | Helm values | Backend API | Triggered by |
| --- | --- | --- | --- | --- |
| E1 | Dev | `helm/values_e1.yaml` | `https://architectureportalapi-dev.aexp.com` | Manual `workflow_dispatch` (PRs to `main` run the CI/scan stages only) |
| E2 | QA | `helm/values_e2.yaml` | `https://architectureportalapi-qa.aexp.com` | Manual `workflow_dispatch` |
| E3 IPC1 | Prod | `helm/values_e3_ipc1.yaml` | `https://architectureportalapi.aexp.com` | Manual `workflow_dispatch` + RFC |
| E3 IPC2 | Prod | `helm/values_e3_ipc2.yaml` | `https://architectureportalapi.aexp.com` | Manual `workflow_dispatch` + RFC |

The API host per environment is defined in `src/constants/urls.ts` and selected by
`ENVIRONMENT` (`src/constants/env.ts`), which reads `NEXT_PUBLIC_ENV` (`e0`–`e3`, default `e0`).
`NEXT_PUBLIC_ENV` is baked in at build time, so changing it requires a rebuild, not just a
config change. `EPAAS_ENV` (Helm `configMap`) labels the Hydra environment for the platform.

### Kubernetes resources (from `helm/values_e1.yaml`; check the per-env file for differences)

| Setting | Value |
| --- | --- |
| CPU request / limit | 1 / 2 |
| Memory request / limit | 4G / 8G |
| HPA | enabled, min 1, max 4, target CPU 40 % |
| Probes | liveness + readiness `GET /` :8080, initialDelay 30 s, period 10 s, timeout 15 s, failureThreshold 3 |
| Filesystem | read-only root; scratch volumes at `/tmp` and `/usr/src/app/.next/cache` |
| Security | runAsUser/Group 1000, no privilege escalation |

## Dependencies

| Dependency | Identifier / location | Notes |
| --- | --- | --- |
| architecture-api | see Environments table | All data access; proxied through `src/app/api/proxy/[...path]`. |
| Redis | `REDIS_HOST`, `REDIS_PORT`, `REDIS_PWD` (Vault) | Next.js cache handler (`cache-handler.js`, `redis-client.js`). TODO: record cluster name per environment. |
| Typesense | `TYPESENSE_API_KEY` (Vault); host in `src/constants` | Global search. TODO: record cluster host per environment. |
| OpenTelemetry / ELF | `ELF_INGEST_URL` | OTLP HTTP traces + logs. |
| AuthBlue SSO | `use-authblue-sso` | Browser-side SSO. |
| GitHub Enterprise / Cloud OAuth | `GITHUB_ENTERPRISE_CLIENT_ID/SECRET`, `GITHUB_CLOUD_CLIENT_ID/SECRET` | NextAuth providers for the WYSIWYG fork-branch-PR flow. |
| Vault | `https://vaultcloud-dev.aexp.com/v1/hydra/cld-paas-d-eusw1/...` (dev); in-cluster sidecar for Hydra | See Secrets. |

## Secrets (Vault)

- **In Hydra**: the Vault sidecar renders secrets to `/opt/epaas/vault/secrets/secrets`;
  `src/scripts/server.js` loads them into `process.env` at startup.
- **Local dev**: on first run `src/scripts/server.js` logs in to Vault with `ADS_ID` /
  `ADS_PASSWORD` (LDAP) and reads
  `static_secrets/data/600002899_architecture-intra-hydra_architecture1`, caching the result
  locally for subsequent `npm run dev` runs.

| Secret name | Used by |
| --- | --- |
| `NEXTAUTH_SECRET` | NextAuth session signing |
| `NEXTAUTH_URL` | NextAuth callback base URL |
| `GITHUB_ENTERPRISE_CLIENT_ID`, `GITHUB_ENTERPRISE_CLIENT_SECRET` | GHES OAuth (`github.aexp.com`) |
| `GITHUB_CLOUD_CLIENT_ID`, `GITHUB_CLOUD_CLIENT_SECRET` | GitHub Cloud OAuth |
| `REDIS_HOST`, `REDIS_PORT`, `REDIS_PWD` | Cache handler |
| `TYPESENSE_API_KEY` | Search |
| `ELF_INGEST_URL` | Telemetry export |

## Non-secret Environment Variables / Flags

| Variable | Default / values | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_ENV` | `e0` / `e1` / `e2` / `e3` (build-time) | Selects backend API hosts via `ENVIRONMENT` in `src/constants/env.ts`; exposed to the browser |
| `EPAAS_ENV` | `e1` / `e2` / `e3` (Helm `configMap`) | Hydra/ePaaS environment label |
| `NODE_ENV` | `production` in Hydra, `development` locally | |
| `LOG_LEVEL` | e.g. `info` | Logger verbosity |
| `RL_PER_MINUTE_LIMIT`, `RL_PER_HOUR_LIMIT` | numeric | API rate limits (`rate-limiter-flexible`) |
| `RL_ALLOWLIST` | comma-separated identifiers | Callers exempt from rate limiting |
| `RL_ID_HEADER` | header name | Header used to identify rate-limit callers |
| `NEXT_PRIVATE_DEBUG_CACHE` | `1` | Verbose cache-handler logging (local debugging) |
| `ANALYZE` | `true` | Bundle analyzer during `npm run build` |

## Pipelines

| Pipeline | File | Purpose |
| --- | --- | --- |
| Continuous Integration | `.github/workflows/ci.yml` | prettier format check + lint on PRs |
| Deploy To Hydra | `.github/workflows/deploy-to-hydra.yml` | On PRs: build, tests & SonarQube, guardrail scans. On `workflow_dispatch`: build image, publish Helm values, deploy / switch / rollback (Slack channel `C0887PMFF3R`) |
| PR description enforcement | `.github/workflows/pr-desc-enforcement.yml` | Compliance guardrail on PRs |
| Jenkins (legacy) | `Jenkinsfile` | Build + publish artifact to XLR (`com.aexp.hydra.architecture-portal.cloudready`) |

## Local Development

| Item | Value |
| --- | --- |
| Node | 22.x |
| Start | `npm run dev` → `http://localhost:3000` |
| Docker | `docker-compose.yml`, `Dockerfile` |
| Certs | `certs/` (internal CA bundle for outbound TLS) |

TODO: add per-environment Redis / Typesense cluster identifiers and Hydra namespace names
once confirmed by the team (source of truth: Hydra console and Vault).
