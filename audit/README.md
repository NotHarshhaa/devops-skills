# `/audit` — Infrastructure & DevOps Estate Audit

A broad, read-only platform engineering survey across your entire infrastructure estate. It maps IaC, clusters, pipelines, cloud accounts, and observability, identifies the highest-leverage risks and waste, and writes structured remediation plans.

For deep domain dives, `/audit` fans out to specialized skills (`/k8s-review`, `/terraform-review`, etc.).

---

## What It Does

- **Surveys the entire estate**: Inventories Terraform/OpenTofu, Kubernetes manifests, Helm charts, CI/CD pipelines, container definitions, and cloud accounts.
- **Identifies by-design tradeoffs**: Reads ADRs, runbooks, and architecture docs so intentional decisions are not flagged as findings (stale docs that contradict reality *are* flagged).
- **Checks the verification story**: Evaluates how changes are validated before reaching production (plan/diff, staging, automated tests).
- **Ranks findings by leverage**: Orders issues by `impact ÷ effort`, discounted by confidence and fix risk.
- **Strictly read-only**: Never applies changes, deploys code, or modifies infrastructure.

---

## Usage

```text
/audit                          full estate audit across all categories
/audit quick                    hotspots only: highest-criticality systems (~6 HIGH-confidence findings)
/audit deep                     exhaustive: every account, environment, and category
/audit <focus>                  audit one lens only (e.g. /audit security, /audit cost)
/audit plan <description>       skip survey; spec one known remediation plan
```

---

## Review Categories

- **Reliability**: Single points of failure, missing probes, autoscaling gaps, untested backups, multi-AZ resilience.
- **Security**: Public exposure, broad IAM policies, missing encryption, unpatched base images, secrets in code.
- **Cost**: Idle/over-provisioned resources, unattached storage volumes, missing lifecycle policies.
- **Observability**: Gaps in metrics, logs, or traces, absent SLOs, alert noise or missing detection on critical paths.
- **Operability**: Manual toil, configuration drift, missing rollback paths, absent runbooks.

---

## Output

1. **Scope Statement**: Pinned to commit, accounts, and environments examined, explicitly stating what was *not* audited.
2. **Prioritized Findings Table**: Evidence-backed table (`file:line` or CLI output) with category, impact, effort, risk, and confidence.
3. **Remediation Plans**: Self-contained plans written to `plans/NNN-*.md` with a `plans/README.md` index.

---

## Install

```bash
# Install this skill individually
npx skills add NotHarshhaa/devops-skills/audit

# Or install the complete collection
npx skills add NotHarshhaa/devops-skills
```

---

## Documentation & References

- [SKILL.md](SKILL.md) — complete agent instructions and workflow.
- [Shared Skill Contract](../docs/skill-contract.md) — hard rules, preflight, and reporting standards.
- [Finding Format](../docs/finding-format.md) — canonical finding schema.
- [Plan Template](../docs/plan-template.md) — remediation plan specification.
