# `/runbook` — On-Call Runbook Authoring & Audit

A senior SRE advisor writing for the engineer paged at 03:00. It turns failure modes into structured, verified runbooks grounded in real alert queries and dashboards — or audits existing runbooks for staleness.

The test of a runbook: **could a new team member, half-awake, follow this without asking anyone a question?**

---

## What It Does

- **One runbook per failure mode**: Avoids generic, sprawling service docs; focuses on one concrete failure mode at `runbooks/<service>-<failure-mode>.md`.
- **Pre-tests diagnostic commands**: Runs every read-only diagnostic command during drafting and inlines actual expected outputs.
- **Pairs mitigations with rollbacks**: Every mutating step carries explicit blast radius, confirmation checks, and rollback commands.
- **Audit mode**: Scans existing runbooks for dead dashboard links, commands referencing renamed/deleted resources, and unlinked alerts.
- **Strictly read-only on systems**: Drafts documents under `runbooks/`; never executes a mitigation itself.

---

## Usage

```text
/runbook <service> <failure-mode>       write a new runbook for that failure mode
/runbook from-alert <alert name>        derive runbook directly from an alert definition
/runbook from-incident <file>           turn a completed incident investigation into a runbook
/runbook audit                          audit existing runbooks for staleness and coverage gaps
/runbook quick                          fast draft: symptom, first 60 seconds, safest mitigation
/runbook deep                           exhaustive: complete triage tree, all mitigations, past history
```

---

## Runbook Structure

Each generated runbook adheres to:
1. **Symptom & Detection**: What users experience and the triggering alert/dashboard panel.
2. **First 60 Seconds**: Three fast diagnostic commands with expected output shapes.
3. **Triage Decision Tree**: Step-by-step branching checks with clear next steps.
4. **Mitigations**: Ordered by blast radius (smallest first), with preconditions, rollback, and "when not to use this".
5. **Verification**: Queries that confirm the impact has stopped.
6. **Escalation**: Named team and concrete trigger criteria.

---

## Output

1. **Runbook Document**: Written to `runbooks/<service>-<failure-mode>.md`.
2. **Index**: Updated in `runbooks/README.md` with service, failure mode, severity, and last-verified date.

---

## Install

```bash
# Install this skill individually
npx skills add NotHarshhaa/devops-skills/runbook

# Or install the complete collection
npx skills add NotHarshhaa/devops-skills
```

---

## Documentation & References

- [SKILL.md](SKILL.md) — complete agent instructions and workflow.
- [Shared Skill Contract](../docs/skill-contract.md) — hard rules, preflight, and reporting standards.
- [Finding Format](../docs/finding-format.md) — canonical finding schema (for audit mode).
