# Finding Format

Every DevOps skill in this repo reports findings in the same shape, so that
output is comparable across skills and any agent (or human) can act on it. A
finding is only a finding **with evidence**. "The cluster probably has resource
limits missing somewhere" is not a finding; `deploy/api.yaml:34 — container
`api` sets no `resources.limits`, so a memory leak can evict co-tenants on the
node` is.

The rules around findings — evidence, preflight, effort levels, output paths —
live in [skill-contract.md](skill-contract.md). This doc covers only the shape.

## The shape

```markdown
### [CATEGORY-NN] Short imperative title

- **Evidence**: `path/file.yaml:34` — one-sentence description of what's there.
  (Repeat per location; cite the 2–5 strongest, note "and ~N similar sites" if
  widespread. For live-system findings, cite the command run and the relevant
  line of its output instead of a file — e.g. `kubectl get pod api-7f... -o yaml`.)
- **Impact**: What goes wrong / what is being paid because of this. Concrete:
  "an OOMKill evicts neighbours on the node and takes ~40s to reschedule", not
  "suboptimal resource config".
- **Effort**: S (hours) / M (a day-ish) / L (multi-day) — for the *fix*,
  including validation.
- **Risk**: What the fix could break; LOW / MED / HIGH plus one line why.
- **Confidence**: HIGH (read the config / saw the evidence, certain) / MED
  (strong signal, needs verification against the live system) / LOW (smell,
  needs investigation). LOW-confidence findings may be reported but get an
  "investigate" plan, not a "fix" plan.
- **Fix sketch**: 1–3 sentences. Not the plan — just enough to judge effort and
  priority honestly.
```

## The summary table

Skills present findings as a table first (scannable, ordered by leverage), then
expand the selected ones in the shape above. Canonical columns — same in every
skill so output is comparable:

```markdown
| # | Finding | Category | Impact | Effort | Risk | Conf | Evidence |
|---|---------|----------|--------|--------|------|------|----------|
| 1 | `api` Deployment has no resources.limits | REL | OOMKill evicts node neighbours | S | MED | HIGH | `k8s/prod/api-deployment.yaml:31` |
```

`Impact` in the table is a short phrase; the full sentence lives in the expanded
finding. `Evidence` is a `file:line` or command reference, never prose.
Cost-style skills may swap `Impact` → `Est. monthly saving` and `Risk` →
`Reliability risk`, keeping every other column. Never drop `Conf` — a finding
without stated confidence invites false certainty.

## Category prefixes

Use the prefix that matches the skill and the nature of the finding:

| Prefix | Meaning |
|--------|---------|
| `COR`  | Correctness / functional bug in config or automation |
| `SEC`  | Security or compliance risk |
| `REL`  | Reliability / availability / resilience |
| `PERF` | Performance / scalability |
| `COST` | Cloud cost / waste |
| `OBS`  | Observability gap (metrics, logs, traces, alerts) |
| `OPS`  | Operability / DX / toil |
| `DOC`  | Missing or wrong runbook / documentation |

## Prioritization rubric

Order findings by **leverage = impact ÷ effort, discounted by confidence and
fix-risk**. Tiebreakers:

1. Anything that unblocks other findings (establish a metric, add a health
   check, fix a broken pipeline gate) floats up.
2. HIGH-confidence security and data-loss findings float above equivalent-
   leverage findings in other categories.
3. Prefer findings whose fix has a clean verification story — a change you can
   confirm with a command and expected output.
4. "Not worth doing" is a valid verdict; record it with one line of reasoning so
   nobody re-audits it next run.

## Handling secrets

Never copy a secret value into a finding or plan — these files get committed.
Reference the `file:line` and credential type only ("AWS access key at
`terraform.tfvars:8`"), and the fix sketch always includes **rotation**, not
just removal — a committed secret is burned even after deletion.
