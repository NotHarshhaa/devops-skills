> **Sample output.** An illustrative remediation plan produced by `/k8s-review`
> against a demo `api` service. It shows the format the DevOps skills produce —
> self-contained context, verification gates, rollback, and STOP conditions.
> The manifests referenced here are fictional; don't execute this. Run a skill
> against your own repo instead.

# Plan 001: Add resource limits, readiness probe, and a PodDisruptionBudget to the `api` Deployment

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: MED
- **Blast radius**: `prod` namespace, `api` Deployment only
- **Depends on**: none
- **Category**: reliability
- **Change window**: maintenance window preferred (rolling restart of `api` pods)

## Why this matters

The `api` Deployment runs the checkout path and has three reliability gaps that
compound: (1) no `resources.limits`, so a memory leak in one pod can consume a
node and OOM-evict co-tenants; (2) no `readinessProbe`, so Kubernetes routes
traffic to pods before they can serve, causing 502s during every rollout; and
(3) no `PodDisruptionBudget`, so a node drain can take all replicas down at once.
Together these turn routine events (a deploy, a node upgrade) into user-facing
errors. Closing them makes rollouts and maintenance non-events.

## Current state

- `k8s/prod/api-deployment.yaml` — the `api` Deployment (3 replicas), container
  spec at lines 28–44:

```yaml
# k8s/prod/api-deployment.yaml:28
    spec:
      containers:
        - name: api
          image: registry.example.com/api:1.8.2
          ports:
            - containerPort: 8080
          livenessProbe:
            httpGet:
              path: /healthz
              port: 8080
            initialDelaySeconds: 10
            periodSeconds: 10
          # no readinessProbe
          # no resources block
```

- The app already serves a readiness endpoint at `GET /readyz` (returns 200 when
  DB pool is warm) — confirmed in `internal/health/handler.go:22`. It is simply
  not wired into the manifest.
- No `PodDisruptionBudget` exists for `api`: `kubectl get pdb -n prod` → `No
  resources found`.
- Convention: other prod services (see `k8s/prod/worker-deployment.yaml:30-52`)
  set requests/limits and both probes — match that style.

## Preconditions

- `kubectl` access to the `prod` namespace with apply rights.
- Confirm current pod resource usage to size limits sensibly:
  `kubectl top pods -n prod -l app=api` (record the p95 you observe).

## Commands you will need

| Purpose      | Command                                            | Expected on success        |
|--------------|----------------------------------------------------|----------------------------|
| Validate     | `kubeconform -strict k8s/prod/api-deployment.yaml` | `... is valid`             |
| Dry-run      | `kubectl diff -f k8s/prod/api-deployment.yaml`     | shows only intended fields |
| Apply        | `kubectl apply -f k8s/prod/api-deployment.yaml`    | `configured`               |
| Apply PDB    | `kubectl apply -f k8s/prod/api-pdb.yaml`           | `created`                  |
| Rollout wait | `kubectl rollout status deploy/api -n prod`        | `successfully rolled out`  |

## Scope

**In scope** (the only files you should modify):
- `k8s/prod/api-deployment.yaml` — add `resources` and `readinessProbe`
- `k8s/prod/api-pdb.yaml` — create the PodDisruptionBudget

**Out of scope** (do NOT touch):
- `k8s/staging/*` — staging is handled in a separate plan.
- The `livenessProbe` — it is correct; do not change its timings.
- The `image` tag — no version bump in this plan.

## Steps

### Step 1: Add resource requests/limits

Using the observed p95 from preconditions, add a `resources` block to the `api`
container. Requests near steady-state, limits with headroom (match the
`worker` exemplar's ratio):

```yaml
          resources:
            requests:
              cpu: 100m
              memory: 256Mi
            limits:
              cpu: 500m
              memory: 512Mi
```

**Verify**: `kubectl diff -f k8s/prod/api-deployment.yaml` → shows only the added
`resources` block, no other fields changed.

### Step 2: Add the readiness probe

Wire the existing `/readyz` endpoint:

```yaml
          readinessProbe:
            httpGet:
              path: /readyz
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 5
            failureThreshold: 3
```

**Verify**: `kubeconform -strict k8s/prod/api-deployment.yaml` → valid.

### Step 3: Create the PodDisruptionBudget

Create `k8s/prod/api-pdb.yaml`:

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: api
  namespace: prod
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: api
```

**Verify**: `kubeconform -strict k8s/prod/api-pdb.yaml` → valid.

### Step 4: Apply during the change window

Apply the deployment, wait for the rollout, then apply the PDB.

**Verify**: `kubectl rollout status deploy/api -n prod` → `successfully rolled
out`; `kubectl get pdb api -n prod` → `ALLOWED DISRUPTIONS` ≥ 1.

## Validation

- Pods become Ready and receive traffic only after `/readyz` passes:
  `kubectl get pods -n prod -l app=api` → all `1/1 Running`.
- A synthetic check of the checkout path returns 200 with no 502s during a test
  rollout: `kubectl rollout restart deploy/api -n prod` then watch the service's
  error-rate dashboard stay flat.
- `kubectl describe pod -n prod -l app=api` shows the limits applied and no
  `OOMKilled` restarts over the next hour.

## Rollback

- Re-apply the previous manifest: `git checkout HEAD~1 -- k8s/prod/api-deployment.yaml
  && kubectl apply -f k8s/prod/api-deployment.yaml`, then
  `kubectl rollout status deploy/api -n prod`.
- Delete the PDB if it blocks operations: `kubectl delete pdb api -n prod`.
- Fully reversible; no data or state is changed.

## Done criteria

- [ ] `kubectl diff` shows only the intended fields before apply
- [ ] `api` container has both `requests` and `limits` for cpu and memory
- [ ] `readinessProbe` on `/readyz` is present and pods report `1/1 Ready`
- [ ] `kubectl get pdb api -n prod` returns a PDB with `minAvailable: 2`
- [ ] No `OOMKilled` or `CrashLoop` on `api` pods one hour post-apply
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:

- The live manifest doesn't match the "Current state" excerpt (it drifted since
  this plan was written).
- After adding the readiness probe, pods never become Ready — the `/readyz`
  endpoint may behave differently than assumed; do not loosen the probe to force
  Ready, report instead.
- Setting `memory` limits triggers immediate OOMKills — the observed p95 was too
  low; report the real usage rather than guessing a higher limit.
- `minAvailable: 2` with 3 replicas blocks a required node drain — report so the
  value can be reconsidered.

## Maintenance notes

- If `api` replica count changes, revisit `minAvailable` (keep it below replica
  count or maintenance can't proceed).
- Right-size the limits from real usage after a week (a `/cost` follow-up).
- Reviewer focus: confirm the limits leave headroom for legitimate spikes — too
  tight trades availability for a smaller footprint.
