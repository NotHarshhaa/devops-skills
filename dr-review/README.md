# `/dr-review` — Disaster Recovery & Backup Readiness

A senior SRE advisor for disaster recovery. It establishes what would actually happen if a database, cluster, region, or cloud account were lost, compares that to your recovery bar, and writes remediation plans.

The guiding question: **has anyone ever restored from this backup, and do we know how long it takes?**

---

## What It Does

- **Distinguishes configuration from proof**: Configuration evidence (a snapshot exists) is separated from recoverability evidence (a dated restore test with measured duration).
- **Quantifies RPO and RTO gaps**: Compares the stated business target with the achievable target implied by snapshot intervals and cutover procedures.
- **Audits ransomware and deletion protection**: Checks object immutability (WORM / Object Lock), cross-account backup copies, and credential isolation.
- **Strictly read-only**: Runs read-only discovery (`aws backup list-*`, `describe-db-snapshots`, `velero get backups`); never initiates a live restore or deletes backups.

---

## Usage

```text
/dr-review                      full disaster recovery review of stateful assets
/dr-review quick                posture table for critical assets + zero-backup gaps
/dr-review deep                 exhaustive review: cross-region KMS keys, DNS, and drill plans
/dr-review scenario <loss>      walk one failure scenario (e.g. /dr-review scenario primary region down)
/dr-review <focus>              focus on one lens (backups, rpo, rto, failover, immutability)
/dr-review plan <description>   spec one recovery improvement plan
```

---

## Review Checklist

- **Coverage**: Unprotected stateful volumes, S3 buckets lacking versioning, `skip_final_snapshot` enabled in IaC, self-managed databases with unmonitored cron dumps.
- **RPO Gaps**: Snapshot frequency longer than stated RPO, PITR retention too short for slow corruption detection, replicas mistaken for backups.
- **RTO Gaps**: No documented restore duration, manual multi-step database restore paths, slow DNS TTLs.
- **Isolation & Immutability**: Backups stored in the same account/credentials as primary resources, missing Object Lock / vault lock, KMS keys not replicated.
- **Verification & Testing**: Untested restore procedures, lack of alerting on backup job failures, compliance drill gaps (SOC 2, ISO 27001, HIPAA).
- **Failover Readiness**: Split-brain risk during regional failover (missing fencing/STONITH), undocumented failback procedures.

---

## Output

1. **Recovery Posture Table**: Summarizes asset, stated RPO/RTO, achievable RPO/RTO, last proven restore, and verdict (`GAP`, `UNTESTED`, `HEALTHY`).
2. **Remediation Plans**: Self-contained plans in `plans/` specifying safe restore drills into isolated scratch environments with stop conditions.

---

## Install

```bash
# Install this skill individually
npx skills add NotHarshhaa/devops-skills/dr-review

# Or install the complete collection
npx skills add NotHarshhaa/devops-skills
```

---

## Documentation & References

- [SKILL.md](SKILL.md) — complete agent instructions and workflow.
- [Shared Skill Contract](../docs/skill-contract.md) — hard rules, preflight, and reporting standards.
- [Finding Format](../docs/finding-format.md) — canonical finding schema.
- [Plan Template](../docs/plan-template.md) — remediation plan specification.
