# Skill Template

Copy this when adding a skill. Keep the section order — consistency is what lets
an agent (and a reviewer) trust a skill it hasn't read before. Target length:
**120–200 lines**. If a checklist grows past that, move the depth into a
`references/` file next to the `SKILL.md` and link it.

Directory shape:

```text
<skill-name>/
  SKILL.md
  references/          # optional, for long checklists or playbooks
```

Naming: lowercase, hyphenated, matches the invocation (`db-review` → `/db-review`).

---

## Frontmatter

```yaml
---
name: <skill-name>              # must equal the directory name
description: <what it does, as a senior <role>, what it produces, that it is strictly read-only, and "Use when asked to …" triggers>
license: MIT
metadata:
  author: devops-skills contributors
  version: "1.0.0"
---
```

The `description` is the only thing an agent sees when deciding whether to load
the skill. It must contain: the role, the output, the read-only constraint, and
explicit **"Use when asked to …"** triggers with the vocabulary a user would
actually type. One sentence each, no marketing.

---

## Body

```markdown
# <Title>

You are a **senior <role> reviewing <domain> — an advisor, not an operator**.
<Two or three sentences: what you understand, what you look for, what you
produce, and for whom (a different, less capable agent with zero context).>

<Optional: the one guiding question of the skill, e.g. "if this system broke
right now, would we know?">

Shared contract: [../docs/skill-contract.md](../docs/skill-contract.md) —
hard rules, environment preflight, effort levels, output paths, findings table,
and the finishing quality bar. Read it before you start.

## Hard Rules

<Only what is specific to this domain — the shared rules live in the contract.
Always spell out the exact read-only command allowlist and the forbidden verbs
for this domain, because that is where mistakes happen.>

1. **Read-only.** Allowed: `<cmd>`, `<cmd>`. Never: `<verb>`, `<verb>`.
2. **<Domain-specific evidence rule>** — what counts as proof here.
3. **<Domain-specific risk rule>** — e.g. "state files are sensitive", "a
   restore test is the only proof a backup works".

## Workflow

### Phase 1 — Recon

<How to map the territory: what to enumerate, what conventions to read, what
preflight this domain needs beyond the contract's.>

### Phase 2 — Review checklist

<3–7 bolded categories, each a comma-separated list of concrete, checkable
issues. Concrete beats exhaustive: "no `PodDisruptionBudget`" not "resilience
concerns". Note where a deep dive belongs to another skill.>

### Phase 3 — Vet, prioritize, confirm

Re-open every cited location before it makes the table. Present findings with
the canonical columns from the contract:

| # | Finding | Category | Impact | Effort | Risk | Conf | Evidence |

<Anything domain-specific about ordering, blast radius, or dependency order.>
Ask which findings to turn into plans.

### Phase 4 — Write the plans

One plan per selected finding per
[../docs/plan-template.md](../docs/plan-template.md), into `plans/` with an
index. <State what this domain's plans must always contain: the dry-run gate,
the validation command, the rollback, and what makes a change irreversible
here.>

## Invocation variants

Effort keywords (`quick` / `standard` / `deep`) and the shared `<focus>`,
`plan <description>`, and `branch` modifiers work per the contract.

- Bare → <default behaviour>.
- `quick` → <what gets cut>.
- `deep` → <what gets added>.
- Focus (`<lens>`, `<lens>`) → that lens only.
- `<domain-specific variant>` → <behaviour>.

## Related skills

<2–4 handoffs: which skill owns the adjacent depth, and what this skill defers
to it.>

## Before you finish

<4–6 domain-specific self-checks, on top of the contract's quality bar. These
should catch the failure modes reviewers of this domain actually see.>

## Tone of the output

<One or two sentences, including a concrete ranking example: "X outranks Y".>
```

---

## Review checklist for a new skill

- [ ] `name` matches the directory; `description` includes read-only + "Use when".
- [ ] No shared rule is restated instead of linked to the contract.
- [ ] The read-only allowlist and forbidden verbs are explicit for this domain.
- [ ] Checklist items are concrete enough to cite `file:line` against.
- [ ] Findings table uses the canonical columns.
- [ ] The skill's lane is clear, with handoffs instead of overlap.
- [ ] Added to the README skills table and the contract's routing table.
- [ ] Added to `CHANGELOG.md`.
