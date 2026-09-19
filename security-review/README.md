# `/security-review` — Defensive Infrastructure Security Review

A senior DevSecOps engineer advisor. It identifies infrastructure misconfigurations, IAM over-permissioning, network exposures, secrets handling risks, and supply-chain vulnerabilities from code and config evidence.

**Strictly defensive**: Identifies risky patterns, explains the impact, and provides hardening plans. Never produces exploit payloads, attack strings, or weaponized instructions.

---

## What It Does

- **Focuses on reachability and impact**: Distinguishes public attack surfaces from internal-only components.
- **Enforces secrets rotation**: Any exposed secret finding always includes a rotation step — a committed secret is considered permanently compromised.
- **Audits cloud metadata hardening**: Checks EC2 IMDSv1 vs. IMDSv2 (`http_tokens = "required"`) to prevent SSRF-driven cloud credential theft.
- **Strictly read-only**: Runs scanners in check mode (`tfsec`, `checkov`, `trivy`, `kube-bench`, `gitleaks`); never alters IAM permissions or network rules.

---

## Usage

```text
/security-review                full defensive security review across all layers
/security-review quick          top HIGH-confidence exposures only (public surfaces, secrets, IAM)
/security-review deep           exhaustive review across all accounts and scanner outputs
/security-review <focus>        focus on one lens (iam, network, secrets, k8s, supply-chain)
/security-review compliance <fw> map findings to control sets (CIS, SOC 2, PCI) as engineering input
/security-review plan <desc>    spec one known hardening plan
```

---

## Review Checklist

- **Identity & Access**: Over-permissive IAM (`*` wildcards), missing least-privilege, static keys where OIDC/roles fit, lack of IMDSv2 (`http_tokens = "required"`).
- **Network Exposure**: Sensitive ports exposed to `0.0.0.0/0`, public S3 buckets/databases, missing NetworkPolicies, lack of WAF.
- **Secrets Management**: Hardcoded credentials in code/IaC/images, secrets in git history (`gitleaks`), missing secrets manager.
- **Data Protection**: Missing encryption at rest (KMS) or in transit (TLS), unencrypted PII.
- **Workload Hardening**: Containers running as root, privileged pods, dropped Linux capabilities, mutable tags.
- **Supply Chain**: Unpinned CI actions, lack of SLSA provenance, script-injection paths.

---

## Output

1. **Prioritized Findings Table**: Ordered by leverage and reachability.
2. **Hardening Plans**: Self-contained plans in `plans/` with target policy/config excerpts, scanner validation steps, and rotation sequencing.

---

## Install

```bash
# Install this skill individually
npx skills add NotHarshhaa/devops-skills/security-review

# Or install the complete collection
npx skills add NotHarshhaa/devops-skills
```

---

## Documentation & References

- [SKILL.md](SKILL.md) — complete agent instructions and workflow.
- [Shared Skill Contract](../docs/skill-contract.md) — hard rules, preflight, and reporting standards.
- [Finding Format](../docs/finding-format.md) — canonical finding schema.
- [Plan Template](../docs/plan-template.md) — remediation plan specification.
