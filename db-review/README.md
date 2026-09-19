# `/db-review` — Database Operations & Migration Safety

A senior Database Reliability Engineer (DBRE) advisor. It evaluates database migrations, locking and blocking risks, connection pooling math, indexing, replication lag, and operational safety.

---

## What It Does

- **Judges migrations by lock behavior**: Predicts exact table locks taken (`ACCESS EXCLUSIVE`, `SHARE UPDATE EXCLUSIVE`), what they block, and estimated hold duration at real table scales.
- **Enforces zero-downtime schema changes**: Evaluates rolling deploy backward compatibility (expand → migrate → contract sequencing).
- **Checks connection pool math**: Compares `max_connections` against total application instances × pool sizes to prevent connection exhaustion outages.
- **Strictly read-only**: Runs catalog queries and query plans (`EXPLAIN` without `ANALYZE` on mutating statements); never touches production row data, never runs DDL/DML.

---

## Usage

```text
/db-review                              full data-layer and operational posture review
/db-review quick                        migration verdict table for pending changes + HIGH risks
/db-review deep                         exhaustive review: every table, index, and parameter
/db-review migration <path|branch>      pre-merge review of pending schema migrations
/db-review <focus>                      focus on one lens (migrations, pooling, indexing, replication)
/db-review plan <description>           spec one zero-downtime change (e.g. concurrent index)
```

---

## Review Checklist

- **Migration Safety**: Blocking DDL under traffic (`ALTER TABLE` table rewrites, un-concurrent index builds, foreign key validation, column drops while old code runs).
- **Deploy Compatibility**: Backward compatibility with currently deployed application version during rolling updates.
- **Backfill Safety**: Unbatched updates on large tables causing replication lag, lock accumulation, and vacuum bloat.
- **Connection Pooling**: PgBouncer/RDS Proxy mode compatibility (transaction vs session pooling), serverless fan-out limits.
- **Indexing & Queries**: Missing indexes on hot foreign keys, unused or duplicate indexes, index bloat, sequential scans on large tables.
- **Reliability & Operations**: Missing statement timeouts, autovacuum starvation, transaction ID wraparound risk, single-AZ prod setups.

---

## Output

1. **Migration Verdict Table**: Shows lock type, blocking scope, estimated duration, reversibility, and verdict (`SAFE`, `SAFE-WITH-CONDITIONS`, `UNSAFE`).
2. **Findings Table**: Prioritized issues ranked by data-loss and availability risk.
3. **Remediation Plans**: Self-contained plans in `plans/` with safe DDL syntax, lock timeouts, backup checkpoints, and validation queries.

---

## Install

```bash
# Install this skill individually
npx skills add NotHarshhaa/devops-skills/db-review

# Or install the complete collection
npx skills add NotHarshhaa/devops-skills
```

---

## Documentation & References

- [SKILL.md](SKILL.md) — complete agent instructions and workflow.
- [Shared Skill Contract](../docs/skill-contract.md) — hard rules, preflight, and reporting standards.
- [Finding Format](../docs/finding-format.md) — canonical finding schema.
- [Plan Template](../docs/plan-template.md) — remediation plan specification.
