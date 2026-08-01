# Contributing

Thanks for helping improve DevOps Skills. Whether you're fixing a checklist item,
sharpening a skill's judgment, or adding a whole new workflow — this is how to
keep it consistent.

## Ground rules

Everything in this repo is a **read-only advisor**. A contribution that lets a
skill apply changes, deploy, or edit files outside its documented output
directory will not be merged. The full contract lives in
[docs/skill-contract.md](docs/skill-contract.md) — read it before your first PR.

Three properties matter more than breadth:

1. **Evidence** — a skill's output must be traceable to a `file:line` or a
   command's output.
2. **Executability** — a plan must be runnable by a weaker agent with zero
   context from the session that wrote it.
3. **Honesty** — unknowns stay unknown; "not worth doing" is a valid verdict.

## Repository layout

```text
<skill>/SKILL.md      one directory per skill, name == directory name
docs/                 shared contract, formats, and templates
examples/             sample outputs (illustrative, never executable)
.claude-plugin/       plugin + marketplace manifests
```

## Improving an existing skill

- Keep the section order: intro → contract link → Hard Rules → Workflow (Phases
  1–4) → Invocation variants → Related skills → Before you finish → Tone.
- Prefer **sharper** over **longer**. If a checklist grows past ~200 lines, move
  depth into a `references/` file beside the `SKILL.md` and link it.
- Checklist items must be concrete enough to cite evidence against. "Resilience
  concerns" is not reviewable; "no `PodDisruptionBudget` on a multi-replica
  Deployment" is.
- Don't restate shared rules — link the contract instead. Duplication is how
  thirteen skills drift apart.
- Bump `metadata.version` in the frontmatter (minor for new behaviour, patch for
  wording) and add a `CHANGELOG.md` entry.

## Adding a new skill

1. Copy [docs/skill-template.md](docs/skill-template.md) into
   `<skill-name>/SKILL.md` and fill it in.
2. Make sure it has a **lane**. If 80% of it overlaps an existing skill, it is a
   variant or a checklist addition to that skill, not a new one. Prefer handoffs
   over overlap.
3. Write the `description` for retrieval: role, output, the read-only constraint,
   and explicit "Use when asked to …" triggers using the words a user would
   actually type. It is the only thing an agent sees when deciding to load the
   skill.
4. Register it in three places: the README skills table, the routing table in
   [docs/skill-contract.md](docs/skill-contract.md#6-cross-skill-routing), and
   `CHANGELOG.md`.
5. Optionally add a sample output under `examples/`, with the standard
   "Sample output / don't execute this" note at the top.

## Testing a skill change

There's no CI harness for judgment, so validate by running it:

- Run the skill against a real repo or environment you own and read the output as
  if you were the executor. Where did it guess? Where did it hedge? Where would a
  weaker agent get stuck?
- Check its output against the contract's quality bar
  ([§7](docs/skill-contract.md#7-quality-bar-check-before-finishing)).
- Confirm the skill stayed read-only: `git status` clean apart from
  `plans/`, `investigations/`, or `runbooks/`.
- Verify frontmatter parses and `name` matches the directory.

Include in your PR: what you ran it against, and a trimmed excerpt of the output
(secret-free) showing the improvement.

## Style

- Markdown, wrapped at ~80 characters, `-` for bullets.
- Second person, imperative, present tense. Terse over decorative.
- Use the shared vocabulary: findings, plans, investigations, runbooks, leverage,
  confidence, blast radius, effort levels.
- Fictional examples in docs — never real hostnames, account IDs, or credentials.

## Pull requests

- One concern per PR. A new skill and a refactor of three others are two PRs.
- Title in the imperative: "Add db-review skill", "Tighten cost estimate basis".
- Say what changes in the *behaviour* of the skill, not just the diff.
- By contributing you agree your work is licensed under the repo's MIT license.
