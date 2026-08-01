> **Sample output.** An illustrative investigation document produced by
> `/incident` against a fictional checkout outage. It shows the format the skill
> produces — sourced symptoms, a "what changed" sweep, falsifiable hypotheses
> with read-only probes, a *recommended* (never applied) mitigation, and durable
> follow-ups routed to other skills. The systems and timestamps here are
> invented; don't execute anything from this file. Run the skill against your own
> environment instead.

# Incident: `/checkout` returning 5xx for ~35% of requests — 2026-03-11

## Summary

- **Status**: MITIGATED (monitoring)
- **Severity**: SEV2 — revenue-path degradation, partial (criteria: >5% error
  rate on a revenue endpoint for >5 min, no data loss)
- **First observed**: 2026-03-11 14:01 UTC
- **Detected by**: alert `CheckoutErrorRateHigh` (fired 14:04, 3 min after onset)
- **Affected**: `checkout-api` in `prod`/`eu-west-1`; ~35% of checkout attempts.
  Browsing, cart, and auth unaffected.
- **Current impact**: error rate back to baseline (0.2%) since 14:39 after the
  operator scaled the connection pooler; root cause understood, permanent fix
  outstanding.

## Timeline

| Time (UTC) | Event / observation / action |
|-----------|------------------------------|
| 13:52 | `checkout-api` v2.31.0 rolled out (pipeline run #4471), replicas 6 → 6 |
| 14:01 | Error rate on `POST /checkout` rises 0.2% → 34% (dashboard `checkout-overview`, panel "5xx rate") |
| 14:04 | Alert `CheckoutErrorRateHigh` fires, pages on-call |
| 14:07 | Investigation started; symptom confirmed from dashboard, not from reports |
| 14:11 | `kubectl logs` shows `pq: sorry, too many clients already` on 4 of 6 pods |
| 14:15 | DB `active_connections` flat at 200 (instance max) since 14:00 (metric `rds_database_connections`) |
| 14:21 | Hypothesis 2 (bad deploy logic) ruled out — see below |
| 14:26 | Mitigation recommended to operator: raise PgBouncer pool / scale poolers |
| 14:33 | Operator applied pooler scaling (2 → 4 replicas). *Action taken by operator, not by this skill.* |
| 14:39 | Error rate returns to 0.2%; `active_connections` 200 → 118 |
| 15:05 | Root cause confirmed; follow-ups drafted |

## Symptoms (evidence)

- Dashboard `checkout-overview`, panel "5xx rate": `POST /checkout` 5xx at 34%
  from 14:01, flat until 14:39.
- `kubectl logs deploy/checkout-api -n prod --since=20m | grep -c "too many clients"`
  → `1,842` occurrences across 4 of 6 pods.
- `kubectl get pods -n prod -l app=checkout-api` → all 6 pods `Running`, `0`
  restarts. **Not** a crash loop; the app is up and failing at the data layer.
- Metric `rds_database_connections{db="prod-orders"}` → pinned at `200` (the
  instance's `max_connections`) since 14:00. Previous 7-day peak: `126`.
- `kubectl exec … -- pgbouncer -V` not needed; pooler config read from
  `k8s/prod/pgbouncer-config.yaml:14` → `default_pool_size = 25`,
  `max_client_conn = 200`, 2 pooler replicas.

## What changed

- **Deploy**: `checkout-api` v2.31.0 at 13:52 (pipeline run #4471), 9 minutes
  before onset. `git log v2.30.4..v2.31.0 --oneline` → 11 commits, including
  `a1f3c2e "add order-history sidebar query"`.
- **Config/flags**: no feature-flag changes in the window (flag audit log, 14:00
  ± 2 h empty).
- **Infra**: no `terraform apply` since 2026-03-04 (state history).
- **Scaling**: no HPA events; replica count unchanged at 6.
- **Certs/secrets**: no rotation in the window.
- **Upstream**: provider status page green; no other service degraded.

The deploy is the only change, and it is 9 minutes before onset — consistent with
traffic ramping into the new code path rather than an instant break.

## Hypotheses

1. **Connection-pool exhaustion caused by a new per-request connection in
   v2.31.0** — *leading, now confirmed.*
   - For: `too many clients` errors; connections pinned at the 200 max from
     14:00; the new `order-history sidebar query` in `a1f3c2e` opens its own
     connection outside the shared pool
     (`internal/orders/history.go:41` — `sql.Open` per request, not the injected pool).
   - Against: nothing.
   - Probe (read-only): `git show a1f3c2e -- internal/orders/history.go` and
     count `sql.Open` call sites → confirmed 1 new call site inside a request
     handler.
2. **DB instance degradation (CPU/IO saturation) independent of the deploy** —
   *ruled out 14:21.* CPU 22%, IOPS well under provisioned, no slow-query spike
   in `pg_stat_statements` top-10 deltas; only the connection count is anomalous.
3. **Pooler crash reducing capacity** — *ruled out 14:21.* Both PgBouncer pods
   `Running`, `0` restarts, `pgbouncer` logs show client rejections, not failures.
4. **Upstream payment provider timeouts holding connections open** — *ruled out
   14:29.* Payment call p99 unchanged (240 ms); errors are raised before the
   payment call in the request path.

## Recommended mitigation (recommended at 14:26; applied by the operator at 14:33)

**Option A (chosen) — scale the connection pooler and cap app pools.** Lowest
blast radius, reversible, no code change:

- Action: raise PgBouncer replicas 2 → 4 (`k8s/prod/pgbouncer.yaml`) so
  `default_pool_size` aggregate absorbs the extra connections.
- Expected effect: `rds_database_connections` drops below 200; `too many clients`
  stops; 5xx returns to baseline within ~2 min.
- Confirm: `rds_database_connections` < 150 and 5xx rate < 1% on
  `checkout-overview`.
- Rollback: scale poolers back to 2 (`kubectl scale deploy/pgbouncer -n prod
  --replicas=2`); the prior state is fully restored.
- **Not executed by this skill** — the operator applied it.

**Option B (fallback, not used) — roll back to v2.30.4.** Removes the new query
entirely; higher blast radius (reverts 11 commits, including two unrelated fixes)
and slower. Recommended only if Option A had not held.

Rejected: raising the database's `max_connections`. It requires a parameter-group
change and trades one limit for memory pressure on the instance — treating the
symptom at the riskiest layer.

## Root cause

- **Trigger**: v2.31.0 introduced a request-scoped `sql.Open` in the order-history
  sidebar (`internal/orders/history.go:41`), adding roughly one new database
  connection per in-flight checkout request instead of borrowing from the shared
  pool.
- **Root cause** (the latent condition): total connection capacity was never
  bounded end to end. App pool sizes × replicas × pooler settings summed above the
  instance's `max_connections` with no guardrail, no alert on connection
  saturation, and no CI check on connection math. Any code path that opened an
  extra connection would have produced this outage; the sidebar query was simply
  the first to do so.

## Follow-up actions

| # | Follow-up | Route to | Why |
|---|-----------|----------|-----|
| 1 | Use the injected pool in `history.go`; forbid request-scoped `sql.Open` via lint | code fix (owning team) | Removes the trigger |
| 2 | Reconcile connection math: app pools × replicas × pooler vs. `max_connections`, with headroom | `/db-review` | Removes the latent condition |
| 3 | Alert on `rds_database_connections > 80%` of max, and on pooler client rejections | `/observability` | Detection would have fired at 14:00, not 14:04 — before user impact |
| 4 | Runbook for `checkout` connection-pool exhaustion (this document's triage path) | `/runbook` | No runbook existed for this failure mode |
| 5 | Add a canary stage so a new query path ramps on 5% of traffic first | `/pipeline-review` | Would have contained blast radius to 5% |

Each becomes a plan under `plans/` via the routed skill; this investigation stays
as the record of what happened.

## Notes

- Nothing in this investigation was applied by the skill. Every state change
  (pooler scaling) was performed by the operator on their own decision.
- No credential values appear in this document. The database credentials
  referenced by `k8s/prod/pgbouncer-config.yaml` were not read.
