# Investigation Template

Used by `/incident` (and any skill investigating a live problem rather than
reviewing static config). An investigation is a **hypothesis-driven, evidence-
logged** document — not a fix. It captures what is known, what was ruled out,
the leading theory, and the next probe. It stays useful even if the person who
started it hands it off mid-incident.

File naming: `investigations/YYYY-MM-DD-short-slug.md`.

Golden rule during an incident: **mitigate first, root-cause second.** If you
identify a safe, reversible mitigation (roll back the last deploy, scale out,
fail over, disable a feature flag), recommend it before continuing the deep
dive — but still never apply it yourself; you recommend, the operator acts.

---

## Template

```markdown
# Incident: <one-line symptom as observed> — <date>

## Summary

- **Status**: INVESTIGATING | MITIGATED | RESOLVED | MONITORING
- **Severity**: SEV1 | SEV2 | SEV3 (state the criteria you used)
- **First observed**: <timestamp + timezone>
- **Detected by**: alert name / customer report / dashboard
- **Affected**: which services, regions, % of traffic or users
- **Current impact**: what users experience right now

## Timeline

Append-only, timestamped. Facts and actions, not speculation.

| Time (TZ) | Event / observation / action |
|-----------|------------------------------|
| 14:02     | Error rate on `/checkout` jumps 2% → 38% (dashboard link) |
| 14:05     | Investigation started |

## Symptoms (evidence)

What is actually observed, each with its source:

- `kubectl get pods -n prod` → `api` deployment: 6/10 pods in `CrashLoopBackOff`.
- Logs: `api` pods emit `pq: too many connections` since 14:01.
- Metric: DB active connections flat at 100 (the pool max) since 14:00.

## What changed

The single most valuable question in most incidents. Check and record:

- Recent deploys/releases (what, when, by whom) — cite the pipeline run or
  `git log` / release tag.
- Config or feature-flag changes, infra changes (Terraform apply), scaling
  events, cert/secret rotation, dependency/provider incidents.
- If nothing changed on your side, check upstream/provider status pages.

## Hypotheses

Ranked. Each with the evidence for/against and the cheapest probe to confirm or
kill it.

1. **<Leading hypothesis>** — supported by <evidence>; contradicted by <if any>.
   - Probe: `<read-only command>` → if <result>, confirmed.
2. **<Alternative>** — ...
   - Probe: ...

Record hypotheses you ruled out and why — it stops backtracking.

## Recommended mitigation (if any)

The safest reversible action to reduce impact now, and how to confirm it helped.
The operator decides and executes; this skill only recommends. Include rollback.

## Root cause (once known)

The causal chain from trigger to symptom, stated plainly. Distinguish the
**trigger** (what set it off) from the **root cause** (the latent condition that
let the trigger cause an outage).

## Follow-up actions

Hand off to the relevant review skill for durable fixes — each becomes a
remediation plan (see plan-template.md). Examples:

- Prevent recurrence: <action> → `/k8s-review` or `/terraform-review` plan.
- Detection gap: the alert fired 3 min late → `/observability` plan.
- Missing runbook for this failure mode → doc plan.
```

## Quality bar

- Every symptom and "what changed" entry cites its source (command, log line,
  dashboard, pipeline run) — no unsourced claims.
- The timeline is append-only and timestamped with a timezone.
- Hypotheses are falsifiable and each has a cheap read-only probe.
- Mitigation is separated from root cause, and both from durable follow-ups.
- No secret values — locations and credential types only.
