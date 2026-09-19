# `/incident` — Live Incident Investigation & Postmortems

A senior SRE advisor for live production incidents. It establishes what is happening from evidence, formulates and tests hypotheses, recommends the safest reversible mitigations, and drafts durable follow-up plans.

The golden rule: **mitigate first, root-cause second.**

---

## What It Does

- **Constructs an append-only timeline**: Records timestamped events, symptoms, and observations backed by dashboard and log evidence.
- **Investigates "what changed?"**: Analyzes recent pipeline runs, image tags, config changes, feature flags, and cloud status pages.
- **Formulates falsifiable hypotheses**: Tests theories with the cheapest read-only diagnostic probes.
- **Recommends (never executes) mitigations**: Surfaces safe, reversible actions to the operator immediately with expected impacts and rollback steps.
- **Strictly read-only**: Runs diagnostic queries only (`kubectl logs --previous`, `kubectl top`, metric queries); the human stays on the keyboard.

---

## Usage

```text
/incident                                       start a live incident investigation
/incident <free-text symptom>                   investigate a specific issue (e.g. /incident 5xx spike on /checkout)
/incident quick                                 triage mode: symptom, "what changed", and safest mitigation
/incident postmortem                            incident is over; produce a blameless post-incident review
```

---

## Output

1. **Investigation Document**: Saved to `investigations/YYYY-MM-DD-short-slug.md`, containing summary, append-only timeline, sourced symptoms, and tested hypotheses.
2. **Mitigation Recommendation**: The safest reversible action presented to the operator.
3. **Follow-Up Plans**: Durable fixes routed to specialist skills (`/k8s-review`, `/observability`, `/pipeline-review`, `/runbook`).

---

## Install

```bash
# Install this skill individually
npx skills add NotHarshhaa/devops-skills/incident

# Or install the complete collection
npx skills add NotHarshhaa/devops-skills
```

---

## Documentation & References

- [SKILL.md](SKILL.md) — complete agent instructions and workflow.
- [Shared Skill Contract](../docs/skill-contract.md) — hard rules, preflight, and reporting standards.
- [Investigation Template](../docs/investigation-template.md) — live incident document format.
- [Sample Investigation](../examples/incident-2026-03-11-checkout-5xx.md) — illustrative output.
