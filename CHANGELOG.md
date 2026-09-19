# Changelog

All notable changes to DevOps Skills. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); the collection uses
semantic versioning, and each skill also carries its own `metadata.version`.

## [1.2.0] — 2026-09-19

### Added

- **`/upgrade-review`** (v1.0.0) — Kubernetes API deprecations, cluster add-on and node containerd compatibility, Terraform provider major-version breaking changes (v4 → v5), and runtime EOL checks. Generates an upgrade posture table and sequenced zero-downtime execution plans (manifests → add-ons → control plane → worker drain).
- **`/gitops-review`** (v1.0.0) — ArgoCD and Flux delivery pipeline reviews. Diagnoses out-of-sync drift root causes (HPA replicas, mutating webhooks), dangerous automated prune policies on stateful storage, self-heal collision with emergency hotfixes, sync-wave dependencies, and secret operator reconciliation loops.
- **GitHub Actions CI validation workflow** (`.github/workflows/validate.yml`) — automatically validates YAML frontmatter, link resolution, `.claude-plugin/plugin.json` sync, and documentation routing on pull requests.
- **Validation script** (`scripts/validate.js`) — automated test suite for local and CI skill validation.

## [1.1.1] — 2026-09-19

### Fixed

- **Claude Code plugin skill discovery** — added explicit `"skills"` array in `.claude-plugin/plugin.json` listing all 13 skill directories so Claude Code and marketplace installations discover and load every skill automatically.
- **Docker review safety** — clarified that `docker build` must never be run during review on untrusted code (arbitrary code execution risk via `RUN` instructions); standardized on static analysis (`hadolint`, `trivy config .`) and pre-existing image inspection.
- **Terraform non-blocking diagnostics** — recommended `terraform plan -lock=false` for diagnostic inspections to avoid locking remote backends, and documented that exit code 2 from `terraform plan -detailed-exitcode` signals diff presence rather than command failure.
- **Cost query execution syntax** — added required `--time-period`, `--granularity`, and `--metrics` parameter templates for `aws ce get-cost-and-usage`, plus multi-cloud equivalents (`gcloud billing`, `az consumption`) and Kubernetes cost tools (`Kubecost`, `OpenCost`).
- **Audit subagent resilience** — updated Phase 2 subagent dispatch to gracefully fall back to sequential category review when runtimes do not support subagent spawning.
- **Modernized Kubernetes tooling** — removed deprecated `kubeval` in `/k8s-review` and standardized on `kubeconform`.

### Added

- **Gateway API & Ingress checks** (`/k8s-review`) — added inspection for Gateway API routes, Ingress timeouts, and TLS / cert-manager annotations.
- **IMDSv2 & secret scanners** (`/security-review`) — added checks for EC2 IMDSv1 vs IMDSv2 (`http_tokens = "required"`) to prevent SSRF credential theft, and added `gitleaks`/`trufflehog` to scanner references.
- **OpenTelemetry Collector & trace sampling checks** (`/observability`) — added checks for OTel Collector `memory_limiter` processor to prevent OOM crash loops, and trace head/tail sampling rates to prevent runaway APM costs.
- **Disaster recovery split-brain & compliance checks** (`/dr-review`) — added checks for split-brain prevention (fencing/STONITH) during regional failover and annual compliance restore proof (SOC 2, ISO 27001, HIPAA, PCI-DSS).
- **Supply-chain provenance & cache poisoning** (`/pipeline-review`) — added checks for SLSA provenance / OpenSSF Scorecard and `actions/cache` branch key isolation.
- **CDN Cache-Control & flag fallback** (`/release-readiness`) — added checks for `Cache-Control` TTL on entry assets (`index.html`) to ensure immediate rollback capability, and safe fallback states for feature flags.
- **NoSQL / distributed datastore checklist** (`/db-review`) — added checks for DynamoDB partition hot-spotting/throttling and MongoDB replica write concerns.

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
