# `/pipeline-review` — CI/CD Pipeline & Supply Chain Review

A senior release and build engineer advisor. It reviews CI/CD workflows (GitHub Actions, GitLab CI, Jenkins, CircleCI) for reliability, build speed, supply-chain security, and release correctness.

---

## What It Does

- **Hardens supply chain & secrets**: Catches script-injection vulnerabilities (untrusted PR input in shell steps), unpinned third-party actions, over-broad `GITHUB_TOKEN` permissions, and `actions/cache` poisoning risks.
- **Eliminates pipeline flakiness**: Detects missing network retries, order dependencies, and hung jobs lacking execution timeouts.
- **Accelerates builds & cuts cost**: Identifies redundant steps, missing dependency caching, and opportunities for job parallelization and matrix builds.
- **Strictly read-only**: Inspects workflow YAMLs and CLI run histories (`gh run list/view`, `glab ci`); never triggers, cancels, or alters pipelines.

---

## Usage

```text
/pipeline-review                full review of CI/CD workflows and deployment pipelines
/pipeline-review quick          top HIGH-confidence findings: security and broken gates first
/pipeline-review deep           exhaustive review including historical run failure rate analysis
/pipeline-review <focus>        focus on one lens (security, speed, reliability)
/pipeline-review plan <desc>    spec one known pipeline enhancement plan
```

---

## Review Checklist

- **Security & Supply Chain**: `pull_request_target` checkout of untrusted PR head refs, unpinned actions (missing full commit SHA), broad `permissions:`, missing SLSA provenance / OpenSSF Scorecard, cache poisoning across branches.
- **Reliability & Flakiness**: Missing timeouts on steps and jobs, non-deterministic builds, absent `concurrency` control causing race conditions on deploy.
- **Speed & Cost**: Uncached package installations, oversized runners, rebuilding container images between test and deploy instead of promoting the tested artifact.
- **Release Flow Correctness**: Deploying without passing test gates, missing environment approvals for production, absent deploy-verification steps.

---

## Output

1. **Prioritized Findings Table**: Evidence-backed table (`.github/workflows/*.yml:line` or CLI logs) ranked by leverage.
2. **Remediation Plans**: Step-by-step plans in `plans/` with target workflow YAML excerpts, branch validation steps, and revert instructions.

---

## Install

```bash
# Install this skill individually
npx skills add NotHarshhaa/devops-skills/pipeline-review

# Or install the complete collection
npx skills add NotHarshhaa/devops-skills
```

---

## Documentation & References

- [SKILL.md](SKILL.md) — complete agent instructions and workflow.
- [Shared Skill Contract](../docs/skill-contract.md) — hard rules, preflight, and reporting standards.
- [Finding Format](../docs/finding-format.md) — canonical finding schema.
- [Plan Template](../docs/plan-template.md) — remediation plan specification.
