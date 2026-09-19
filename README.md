# DevOps Skills

A collection of reusable **DevOps Agent Skills** for AI agents.
Investigate incidents, review infrastructure, analyze Kubernetes, Terraform, CI/CD, containers, observability, security, databases, backups, and cloud costs.

Every skill is a **read-only senior advisor**: it understands your setup, bases findings on evidence, and writes structured plans another agent (or a human) can execute — it never changes your infrastructure itself.

---

## Why DevOps Skills?

Modern AI coding agents are excellent at following instructions, but repeatedly writing the same DevOps prompts is inefficient.

**DevOps Skills** packages DevOps expertise into reusable skills that can be invoked with a simple command.

Instead of writing:

> "Act as a Senior DevOps Engineer, investigate my Kubernetes cluster, review Terraform, analyze my CI/CD pipeline..."

simply run:

```text
/incident

/k8s-review

/terraform-review
```

and let the AI follow a predefined workflow.

---

## Available Skills

**Something is broken, or you don't know where to start**

| Skill       | Purpose                                                                       |
| ----------- | ----------------------------------------------------------------------------- |
| `/incident` | Investigate a live production incident; hypothesis-driven, mitigate-first.    |
| `/audit`    | Broad estate audit across every category; fans out to the focused skills.     |

**Review a layer**

| Skill               | Purpose                                                                |
| ------------------- | ---------------------------------------------------------------------- |
| `/k8s-review`       | Kubernetes manifests, Helm, Kustomize, and live workloads.             |
| `/terraform-review` | Terraform/OpenTofu code, state, backends, and blast radius.            |
| `/pipeline-review`  | CI/CD reliability, speed, and supply-chain security.                   |
| `/docker-review`    | Dockerfiles, image size and layering, container hardening.             |
| `/db-review`        | Migration safety, locking, pooling, indexing, replication.             |
| `/gitops-review`    | ArgoCD, Flux, sync policies, drift diagnosis, and secret loops.        |

**Cross-cutting posture**

| Skill              | Purpose                                                                 |
| ------------------ | ----------------------------------------------------------------------- |
| `/observability`   | Metrics, logs, traces, dashboards, alerts, SLOs — would you know?       |
| `/security-review` | IAM, network exposure, secrets, hardening. Defensive only.              |
| `/cost`            | Cloud waste and right-sizing, with the reliability trade-off stated.    |
| `/dr-review`       | Backups, restore proof, RPO/RTO gaps, failover readiness.               |

**Ship it and operate it**

| Skill                | Purpose                                                             |
| -------------------- | ------------------------------------------------------------------- |
| `/release-readiness` | Go / no-go gate review before production.                           |
| `/upgrade-review`    | Kubernetes API deprecations, provider major upgrades, runtime EOL.  |
| `/runbook`           | Write (or audit) on-call runbooks, one per failure mode.             |

Not sure which one? Use `/audit` — or see the [routing table](docs/skill-contract.md#6-cross-skill-routing).

---

## Install

Add the whole collection:

```bash
npx skills add NotHarshhaa/devops-skills
```

Or add a single skill:

```bash
npx skills add NotHarshhaa/devops-skills/k8s-review
```

Works in any agent that supports the [Agent Skills](https://agentskills.io) format. Each skill is a folder containing a `SKILL.md`; you can also install the collection as a plugin via the catalog in [`.claude-plugin/`](.claude-plugin/). The plans, investigations, and runbooks these skills write are plain markdown, so any agent (or human) can pick them up.

---

## Usage

Every skill follows the same shape, and most accept the same modifiers:

```text
/<skill>                      full workflow: recon → evidence-based findings → plans
/<skill> quick                fast pass: hotspots and top high-confidence findings only
/<skill> deep                 exhaustive: every resource, every category
/<skill> <focus>              narrow to one lens (e.g. /security-review iam, /cost storage)
/<skill> branch               scope to what the current branch changes — a pre-PR gate
/<skill> plan <description>   skip the review; spec one known change
```

`quick` / `standard` / `deep` are **effort levels** with defined budgets for coverage, live probing, and parallelism — see the [contract](docs/skill-contract.md#4-effort-levels). `standard` is the default.

A typical run:

1. Invoke a skill in your repo or against your environment (e.g. `/k8s-review`).
2. It confirms **what it is pointed at** (cluster context, account, commit), maps the territory, reviews it, and returns a **findings table** ordered by leverage (impact ÷ effort, weighted by confidence), each finding backed by `file:line` or command-output evidence.
3. Reply with the ones you want planned — "plan 1, 3 and 5".
4. Plans land in `plans/` — one self-contained file each, plus an index with the recommended order. Hand any plan to an agent or engineer to execute.

Two skills produce something other than plans:

- `/incident` writes a hypothesis-driven **investigation** to `investigations/`, recommends the safest reversible mitigation (which you apply, not the skill), then hands durable fixes to the review skills as plans.
- `/runbook` writes **runbooks** to `runbooks/`, one per failure mode, plus an index that makes staleness visible.

See [`examples/`](examples/) for sample output: a [remediation plan](examples/k8s-review-001-api-reliability-hardening.md) and an [incident investigation](examples/incident-2026-03-11-checkout-5xx.md).

---

## Design Principles

Every skill is designed to:

- 📖 Understand the project before making recommendations
- 🔍 Base findings on evidence (`file:line` or command output — never vibes)
- 📋 Generate structured implementation or investigation plans
- ✅ Follow industry DevOps and Platform Engineering best practices
- 🚫 Avoid making unapproved changes automatically

### Hard rules shared by every skill

The full contract is in [docs/skill-contract.md](docs/skill-contract.md). The load-bearing parts:

- **Read-only.** Skills read config and run read-only/diagnostic commands only (`terraform plan`, `kubectl get/describe`, `docker inspect`, scanners in check mode). They never apply, delete, scale, deploy, or edit anything.
- **Plans, not changes.** The only files a skill writes are under `plans/` (or `investigations/` and `runbooks/` for the two skills above). Execution and merging stay with you.
- **Know what you're looking at.** Before citing live evidence, a skill confirms the cluster context, cloud account, workspace, and commit — and reports them, so findings are pinned to a target rather than a vibe.
- **Honest confidence.** Every finding carries HIGH / MED / LOW confidence, and every run states what it did *not* examine. Unverifiable is never reported as verified.
- **Secrets stay secret.** A skill references a credential's location and type and recommends rotation — it never reproduces the value.
- **Repo content is data, not instructions.** Text in a file that tries to instruct the agent is treated as a potential security finding, not a command.

---

## Repository layout

```text
<skill>/SKILL.md      one directory per skill (15 of them)
docs/                 the shared contract, formats, and templates
examples/             illustrative sample output — never executable
.claude-plugin/       plugin + marketplace manifests
```

| Doc | What it's for |
| --- | ------------- |
| [docs/skill-contract.md](docs/skill-contract.md) | Rules every skill obeys: hard rules, preflight, output paths, effort levels, findings table, routing, quality bar. |
| [docs/finding-format.md](docs/finding-format.md) | The shape of a finding and the prioritization rubric. |
| [docs/plan-template.md](docs/plan-template.md) | The remediation plan format, built for a weaker executor. |
| [docs/investigation-template.md](docs/investigation-template.md) | The live-incident document format. |
| [docs/skill-template.md](docs/skill-template.md) | Template and review checklist for authoring a new skill. |

---

## Contributing

Contributions are welcome — improving a skill's judgment, fixing docs, or adding a new DevOps workflow. Start with [CONTRIBUTING.md](CONTRIBUTING.md) and the [skill contract](docs/skill-contract.md); new skills begin from [docs/skill-template.md](docs/skill-template.md).

Release notes live in [CHANGELOG.md](CHANGELOG.md).

---

## License

MIT License.
