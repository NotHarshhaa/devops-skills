# `/release-readiness` — Production Launch Gate & Go/No-Go Review

A senior release manager and SRE advisor. It evaluates whether a new service or release meets production reliability, security, observability, and rollback standards before shipping.

The value of this skill: **an honest, evidence-backed no-go before an outage, not a rubber stamp.**

---

## What It Does

- **Delivers an explicit verdict**: Starts with an upfront decision: `GO`, `GO-WITH-CONDITIONS`, or `NO-GO`.
- **Enforces hard gates**: Treats untested rollbacks, breaking database migrations, or missing critical alerts as blockers.
- **Differentiates blockers from follow-ups**: Clearly separates hard blockers that must be resolved before deployment from safe follow-ups.
- **Strictly read-only**: Analyzes code, IaC, CI runs, and dashboards; never deploys or changes environment state.

---

## Usage

```text
/release-readiness              full readiness review and go/no-go assessment
/release-readiness quick        evaluate core blocker gates only (rollback, safe deploy, alerts)
/release-readiness deep         exhaustive review crossing live configs, test reports, and dashboards
/release-readiness <focus>      focus on one gate group (rollback, observability, security, capacity)
/release-readiness plan <desc>  spec a remediation plan for a specific release blocker
```

---

## Readiness Gates

- **Deployment Safety**: Safe deployment strategy (canary/rolling/blue-green), proven rollback path, immutable artifact promotion, reversible schema changes, CDN `Cache-Control` header inspection (long TTLs on `index.html` prevent instant frontend rollbacks).
- **Reliability & Capacity**: Health/readiness probes, capacity headroom, dependency timeouts and circuit breakers.
- **Observability**: Golden signal metrics, dedicated release dashboards, alerts capable of detecting rollout failures, deploy markers/annotations.
- **Security**: Zero unaddressed critical vulnerabilities on release path, least-privilege permissions, safe secret handling.
- **Operational Preparedness**: Runbooks for new failure modes, on-call team briefed, service ownership assigned.
- **Verification**: Passing automated test suites in CI, successful staging verification.

---

## Output

1. **Overall Verdict & Gate Table**: Lists every gate, verdict (`PASS`, `FAIL`, `N/A`, `UNVERIFIED`), evidence, and blocker status.
2. **Blocker Remediation Plans**: Self-contained plans written to `plans/` targeting specific failed gates.

---

## Install

```bash
# Install this skill individually
npx skills add NotHarshhaa/devops-skills/release-readiness

# Or install the complete collection
npx skills add NotHarshhaa/devops-skills
```

---

## Documentation & References

- [SKILL.md](SKILL.md) — complete agent instructions and workflow.
- [Shared Skill Contract](../docs/skill-contract.md) — hard rules, preflight, and reporting standards.
- [Finding Format](../docs/finding-format.md) — canonical finding schema.
- [Plan Template](../docs/plan-template.md) — remediation plan specification.
