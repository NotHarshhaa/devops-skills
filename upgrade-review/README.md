# `/upgrade-review` — Kubernetes & Terraform Upgrade Planning

A senior platform engineer advisor. It audits infrastructure for deprecated APIs, breaking changes, and End-of-Life (EOL) runtimes before upgrading Kubernetes clusters or Terraform providers, producing sequenced, zero-downtime execution plans.

The guiding question: **what will break if we upgrade this system, and how do we sequence the transition with zero downtime?**

---

## What It Does

- **Discovers API deprecations and removals**: Scans manifests, Helm releases, and live clusters using `pluto` and `kubent` to catch deprecated APIs *before* control plane upgrades.
- **Audits add-on and controller compatibility**: Validates CoreDNS, VPC CNI, CSI drivers, and admission webhooks against target Kubernetes releases.
- **Checks runtime and node lifecycle**: Assesses containerd versions, cgroups v1 → v2 migrations, and node OS AMI lifecycles.
- **Evaluates Terraform provider breaking changes**: Plans major provider jumps (e.g., AWS v4 → v5) and state migrations.
- **Strictly read-only**: Scans and evaluates only; never initiates a cluster upgrade or replaces node pools.

---

## Usage

```text
/upgrade-review                 full upgrade readiness review across Kubernetes and IaC
/upgrade-review k8s <target>    plan Kubernetes upgrade to target version (e.g. /upgrade-review k8s 1.30)
/upgrade-review terraform <p>   plan provider upgrade (e.g. /upgrade-review terraform aws v5.0)
/upgrade-review quick           top blocking deprecations and API removals only
/upgrade-review deep            exhaustive review of all Helm releases, CRDs, and add-ons
/upgrade-review plan <phase>    spec one phase of the upgrade execution sequence
```

---

## Review Checklist

- **Kubernetes API Deprecations**: Removed API versions in target release, deprecated fields in HPA/Ingress/PDB, Helm releases with obsolete metadata.
- **Add-on Compatibility**: CNI/CSI compatibility with target minor version, admission webhook failure policy during upgrades.
- **Node & Runtime Requirements**: containerd version requirements, cgroups v2 compatibility, worker node OS lifecycle.
- **Workload Drain Resilience**: Workloads with `replicas: 1` or missing PodDisruptionBudgets that would be dropped during rolling node replacement.
- **Terraform Provider Breaking Changes**: Renamed arguments, resource splits (e.g. S3 bucket resources), state moves required.

---

## Output

1. **Upgrade Posture Table**: Summarizes component, current version, target version, deprecated/removed APIs, breaking changes, and verdict (`BLOCKED`, `READY-WITH-PLAN`, `READY`).
2. **Sequenced Upgrade Plans**: Phased plans in `plans/` (Manifests prep → Add-ons → Control plane → Worker drain & replace → Post-upgrade verification).

---

## Install

```bash
# Install this skill individually
npx skills add NotHarshhaa/devops-skills/upgrade-review

# Or install the complete collection
npx skills add NotHarshhaa/devops-skills
```

---

## Documentation & References

- [SKILL.md](SKILL.md) — complete agent instructions and workflow.
- [Shared Skill Contract](../docs/skill-contract.md) — hard rules, preflight, and reporting standards.
- [Finding Format](../docs/finding-format.md) — canonical finding schema.
- [Plan Template](../docs/plan-template.md) — remediation plan specification.
