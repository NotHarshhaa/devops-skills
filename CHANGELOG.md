# Changelog

All notable changes to DevOps Skills. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); the collection uses
semantic versioning, and each skill also carries its own `metadata.version`.

## [1.1.0] — 2026-08-01

### Added

- **`/dr-review`** (v1.0.0) — backup, restore, and disaster-recovery readiness.
  Produces a recovery posture table (stated vs. achievable RPO/RTO, last proven
  restore), distinguishes config evidence from restore-proven evidence, and
  checks backup isolation and immutability. Includes a `scenario <what is lost>`
  variant that walks a single loss end to end.
- **`/db-review`** (v1.0.0) — database operations and schema-change safety.
  Produces a migration verdict table (lock taken, what it blocks, estimated
  duration at real row counts, reversibility), plus connection-pool math,
  indexing, and replication review. `migration <path|branch>` works as a
  pre-merge gate.
- **`/runbook`** (v1.0.0) — writes one runbook per failure mode under
  `runbooks/`, with detection signal, first-60-seconds checks, a triage decision
  tree, mitigations carrying blast radius and rollback, and escalation. `audit`
  mode reviews existing runbooks for staleness and coverage gaps.
- **`docs/skill-contract.md`** — the shared contract every skill links to: hard
  rules, environment preflight, output locations, effort levels, the canonical
  findings table, the reporting contract, cross-skill routing, and the finishing
  quality bar.
- **`docs/skill-template.md`** — authoring template and review checklist for new
  skills.
- **Environment preflight** — skills now confirm and report which cluster,
  account, workspace, and commit their findings describe before making live
  claims, and downgrade confidence when tooling is missing or unauthenticated.
- **`CONTRIBUTING.md`** and this changelog.
- Second sample output: `examples/incident-2026-03-11-checkout-5xx.md`, an
  `/incident` investigation document.
- Every skill gained a **Related skills** section (explicit handoffs instead of
  overlapping depth) and a domain-specific **Before you finish** self-check.

### Changed

- **Findings tables now carry a `Conf` (confidence) column** in every skill —
  previously the finding format required confidence but the summary tables
  dropped it, which invited false certainty. Tables also render correctly now
  (they were missing separator rows).
- `/release-readiness` gate table is explicit, and adds an **`UNVERIFIED`**
  verdict that must never be counted as `PASS`.
- `/cost` must state the **basis** of every saving estimate (billing line item,
  list price × count, utilization window) plus currency and period.
- Effort keywords (`quick` / `standard` / `deep`) are now defined once in the
  contract with concrete coverage, subagent, and probe budgets, instead of being
  described loosely per skill.
- `docs/finding-format.md` defines the canonical summary table and links the
  contract.
- Plan output fallback directory standardized to `devops-plans/` (was
  `advisor-plans/` in `/audit` only).
- All ten original skills bumped to `metadata.version` 1.1.0.

### Fixed

- `.claude-plugin/plugin.json` `homepage` and `repository` pointed at the
  placeholder `github.com/your-org/devops-skills`; they now point at the real
  repository. Added an author URL and keywords for the new skills.

## [1.0.0] — 2026-07-12

### Added

- Initial release: `/incident`, `/audit`, `/k8s-review`, `/terraform-review`,
  `/pipeline-review`, `/docker-review`, `/observability`, `/security-review`,
  `/cost`, `/release-readiness`.
- Shared `docs/finding-format.md`, `docs/plan-template.md`, and
  `docs/investigation-template.md`.
- Plugin and marketplace manifests under `.claude-plugin/`.
- Sample output: `examples/k8s-review-001-api-reliability-hardening.md`.
