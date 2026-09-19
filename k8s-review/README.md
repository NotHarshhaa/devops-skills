# `/k8s-review` — Kubernetes Workload & Manifest Review

A senior Kubernetes and platform engineer advisor. It reviews Kubernetes manifests, Helm charts, Kustomize overlays, and live workloads to uncover reliability, security, availability, and resource management gaps.

---

## What It Does

- **Reviews effective rendered manifests**: Evaluates rendered YAML (`helm template`, `kustomize build`) rather than un-substituted templates.
- **Audits availability and scheduling**: Identifies critical services with `replicas: 1`, missing `PodDisruptionBudget` (PDBs), absence of `topologySpreadConstraints`, and missing `HorizontalPodAutoscaler` (HPA).
- **Inspects health and graceful shutdown**: Catches missing or misconfigured probes (`livenessProbe`, `readinessProbe`, `startupProbe`) and missing `preStop` hooks.
- **Strictly read-only**: Runs inspection commands (`kubectl get/describe/top`, `kubectl diff`, `kubeconform`); never applies, scales, or deletes workloads.

---

## Usage

```text
/k8s-review                     full review of all manifests and charts in scope
/k8s-review quick               top HIGH-confidence findings on critical workloads only
/k8s-review deep                exhaustive review: every resource, category, and live cluster state
/k8s-review live                prioritize live-cluster state over static files to catch drift
/k8s-review <focus>             focus on one lens (security, resources, reliability)
/k8s-review plan <description>  spec one known fix (e.g. "add PDBs to prod Deployments")
```

---

## Review Checklist

- **Resource Management**: Missing requests/limits, requests == limits causing throttling, QoS class implications (BestEffort pods on critical paths).
- **Health & Lifecycle**: Missing readiness/liveness/startup probes, missing `preStop` hooks or inadequate `terminationGracePeriodSeconds`.
- **Availability & Scheduling**: Single replica deployments, missing PodDisruptionBudgets, lack of anti-affinity across failure zones.
- **Networking & Ingress**: Gateway API and Ingress route misconfigurations, TLS certificate expiration annotations, missing timeout annotations causing 504 drops.
- **Security**: Root containers (missing `securityContext`), privileged escalation, missing `NetworkPolicy`, broad RBAC wildcard permissions, unpinned `:latest` tags.
- **Config & Secrets**: Secrets exposed in plain environment variables, config baked into images.

---

## Output

1. **Prioritized Findings Table**: Evidence-backed table (`manifest.yaml:line` or CLI output) ranked by leverage.
2. **Remediation Plans**: Self-contained plans in `plans/` with target YAML excerpts, dry-run commands (`kubectl diff`), apply commands, and rollout undo rollbacks.

---

## Install

```bash
# Install this skill individually
npx skills add NotHarshhaa/devops-skills/k8s-review

# Or install the complete collection
npx skills add NotHarshhaa/devops-skills
```

---

## Documentation & References

- [SKILL.md](SKILL.md) — complete agent instructions and workflow.
- [Shared Skill Contract](../docs/skill-contract.md) — hard rules, preflight, and reporting standards.
- [Finding Format](../docs/finding-format.md) — canonical finding schema.
- [Plan Template](../docs/plan-template.md) — remediation plan specification.
- [Sample Remediation Plan](../examples/k8s-review-001-api-reliability-hardening.md) — illustrative output.
