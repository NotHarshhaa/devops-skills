# `/gitops-review` — GitOps Delivery & Drift Review

A senior GitOps and platform engineer advisor. It reviews declarative delivery configurations across ArgoCD and Flux, diagnoses out-of-sync drift between Git and live clusters, audits automated sync/prune policies, and resolves controller reconciliation loops.

The guiding question: **why is Git drifting from the cluster, and will syncing break production?**

---

## What It Does

- **Diagnoses drift root causes**: Differentiates benign drift (HPA scaling replicas live, dynamic webhook annotations) from dangerous regressions (stale image tags, missing security policies).
- **Prevents catastrophic automated pruning**: Flags `Prune=true` configurations that could delete stateful volumes, PVCs, or CRDs.
- **Resolves controller loops**: Detects ExternalSecrets or SealedSecrets regenerating salts/timestamps in endless fights with GitOps engines.
- **Strictly read-only**: Runs read-only inspection commands (`argocd app get/diff`, `flux get all`, `kustomize build`); never triggers syncs or overrides drift.

---

## Usage

```text
/gitops-review                  full review of all GitOps applications and sync status
/gitops-review app <name>       deep-dive into a single application
/gitops-review drift            focus exclusively on out-of-sync and degraded applications
/gitops-review quick            top HIGH-risk sync gaps and auto-prune hazards only
/gitops-review deep             exhaustive review of all ApplicationSets, health checks, and RBAC
/gitops-review plan <desc>      spec one known GitOps remediation plan
```

---

## Review Checklist

- **Sync Policy & Auto-Prune**: Automated prune enabled globally without PVC/stateful resource exclusions, self-heal fighting emergency incident response.
- **Drift Root Causes**: External controller mutations, HPA replica field conflicts, mutating webhooks injecting un-ignored defaults.
- **Sync Waves & Hooks**: Missing dependency ordering between CRDs and custom resources, unmonitored pre-sync database migration hooks.
- **Secret Reconciliation Loops**: Controller ownership conflicts over secret objects causing continuous redeploys.
- **Application Health & Lua Checks**: Missing custom Lua health checks causing applications to remain stuck in `Progressing`.
- **Security & Access**: Over-permissive `AppProject` cluster/namespace destinations, write-enabled deploy keys where read-only suffices.

---

## Output

1. **GitOps Posture Table**: Summarizes application name, engine, health, sync status, auto-sync/prune risk, drift summary, and verdict.
2. **Remediation Plans**: Self-contained plans in `plans/` containing `ignoreDifferences` rules, sync wave refactors, or manifest updates.

---

## Install

```bash
# Install this skill individually
npx skills add NotHarshhaa/devops-skills/gitops-review

# Or install the complete collection
npx skills add NotHarshhaa/devops-skills
```

---

## Documentation & References

- [SKILL.md](SKILL.md) — complete agent instructions and workflow.
- [Shared Skill Contract](../docs/skill-contract.md) — hard rules, preflight, and reporting standards.
- [Finding Format](../docs/finding-format.md) — canonical finding schema.
- [Plan Template](../docs/plan-template.md) — remediation plan specification.
