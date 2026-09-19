# `/terraform-review` — Terraform & IaC Review

A senior cloud and IaC engineer advisor. It reviews Terraform and OpenTofu code, state management, module structure, and blast radius to detect correctness, security, cost, and maintainability issues.

---

## What It Does

- **Predicts replacement and blast radius**: Clearly flags when an HCL change causes resource replacement or destruction.
- **Audits state and backends**: Detects unencrypted remote state, missing state locking (corruption hazard), and giant monolithic state files.
- **Safe diagnostic planning**: Uses `terraform plan -lock=false` during checks to prevent blocking production deployment pipelines.
- **Strictly read-only**: Runs `validate`, `fmt -check`, `tflint`, and `plan -lock=false`; never executes `apply` or state mutations.

---

## Usage

```text
/terraform-review               full review of Terraform modules and root configurations
/terraform-review quick         top HIGH-confidence findings: security and state issues first
/terraform-review deep          exhaustive review across all workspaces and environments
/terraform-review branch        review only what the current git branch changes (pre-PR gate)
/terraform-review <focus>       focus on one lens (security, cost, state, modules)
/terraform-review plan <desc>   spec one known IaC remediation plan
```

---

## Review Checklist

- **State & Backend**: Local state in git, missing state locking, unencrypted state, secrets in state, monolithic state architecture.
- **Security**: Over-permissive IAM policies, open security groups, missing KMS encryption, sensitive outputs lacking `sensitive = true`, missing `prevent_destroy` on stateful resources.
- **Correctness & Safety**: Force-replace triggers on benign edits, dynamic count/for_each on unstable keys, missing `lifecycle` blocks.
- **Maintainability**: Duplicated HCL blocks that should be reusable modules, missing variable descriptions/validations, multi-platform `.terraform.lock.hcl` hash gaps.
- **Cost**: Oversized instances, unattached disks, absent snapshot retention.

---

## Output

1. **Prioritized Findings Table**: Evidence-backed table (`path/main.tf:line` or plan diff) highlighting blast radius.
2. **Remediation Plans**: Step-by-step plans in `plans/` with target HCL excerpts, required `terraform plan` diff gates, and rollback steps.

---

## Install

```bash
# Install this skill individually
npx skills add NotHarshhaa/devops-skills/terraform-review

# Or install the complete collection
npx skills add NotHarshhaa/devops-skills
```

---

## Documentation & References

- [SKILL.md](SKILL.md) — complete agent instructions and workflow.
- [Shared Skill Contract](../docs/skill-contract.md) — hard rules, preflight, and reporting standards.
- [Finding Format](../docs/finding-format.md) — canonical finding schema.
- [Plan Template](../docs/plan-template.md) — remediation plan specification.
