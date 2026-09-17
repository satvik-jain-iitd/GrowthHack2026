# Rollback Plan — architecture-portal

Control: **CR-DPM6**

The portal is stateless (all persistent data lives in `architecture-api` / its databases), so a
rollback is a redeploy of the previous container image via Hydra blue/green. There are no
portal-owned database migrations to revert.

## Trigger Conditions

Initiate a rollback when, within 30 minutes of a deployment or blue/green switch, any of the
following is observed (thresholds are proposals — TODO: confirm against agreed SLOs):

| Signal | Threshold |
| --- | --- |
| HTTP 5xx rate (portal, excluding upstream `architecture-api` failures) | > 1 % of requests over 10 min |
| p95 page response latency | > 3 s sustained for 10 min |
| Readiness probes | Any pod failing readiness > 5 min, or CrashLoopBackOff |
| SSO / login | Users unable to sign in (AuthBlue/NextAuth errors) and dependency is healthy |
| Functional regression | A core journey (docs, initiatives, company domains, search) broken for all users |
| Cache | Redis errors causing page render failures |

The on-call engineer or change owner may trigger a rollback; no additional approval is needed
during an active incident, but the RFC must be updated.

## Rollback Steps

1. **Announce** in `#arch-portal-help`: "Rolling back architecture-portal <env> to version N-1, reason: …".
2. **Fast path — blue/green switch back** (if the previous slot is still running):
   run `Deploy To Hydra` (`.github/workflows/deploy-to-hydra.yml`) with
   `manual_op = Switch (b/g) - Switch between blue/green environments`, `manual_env = <e1|e2|e3>`,
   `rfc = <CHG number>` for E3.
3. **Full rollback** (previous slot unavailable or already switched):
   run `Deploy To Hydra` with `manual_op = Rollback - Rollback to n-1 or rollback_version in an environment`,
   `manual_env = <env>`, and optionally `rollback_version = <Hydra deployment number>`
   (defaults to n-1). Alternatively deploy a specific known-good image with
   `manual_op = Deploy an image` and `image_sha256 = <digest>` then switch.
4. **Helm values regression** — if the failure was caused by a values change
   (`helm/values_*.yaml`), revert the commit on `main` (`git revert`) so the next deployment
   carries the corrected values, then redeploy.
5. **Cache** — if the new version wrote incompatible entries to the Redis cache, flush the
   portal's Redis keys after rolling back so stale/incompatible pages are not served.
6. **Dependent releases** — if the portal release was coupled with an `architecture-api`
   release, coordinate rollback of the API using its `docs/support/rollback-plan.md`.
7. **Database** — not applicable (no portal-owned schema). Document "N/A" in the RFC.

## Validation

After rollback, repeat the *Validation Steps* from [`deployment-plan.md`](./deployment-plan.md):

- All pods Ready; probes passing.
- `GET /` returns 200; SSO login works.
- Docs, initiatives, company-domains and search pages load with data.
- 5xx rate and p95 latency back within thresholds on the dashboards
  (TODO: link Grafana / ELF dashboard).
- Confirm the running image digest matches the previous known-good version.

## Notifications

| Audience | Channel | When |
| --- | --- | --- |
| Portal users / stakeholders | `#arch-portal-help` | Start and completion of rollback |
| Playbook contributors | `#ea-design-playbook` | If the WYSIWYG/playbook editing flow was affected |
| Team | `archportal@aexp.com` | Summary after stabilisation |
| Change management | RFC / CHG record | Mark implementation as rolled back with reason |
| On-call | on-call schedule (TODO: link) | Incident ownership |

## Post-Mortem

Complete within 5 business days for any E3 rollback. Store in the team wiki
(TODO: link post-mortem space) and link from the RFC. Outline:

1. Summary and customer impact (duration, affected journeys).
2. Timeline (deploy, detection, decision, rollback complete).
3. Root cause.
4. What went well / what went poorly.
5. Action items (owner, due date) — including test or monitoring gaps that would have caught the issue in E1/E2.
