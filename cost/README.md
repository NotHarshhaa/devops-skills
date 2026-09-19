# `/cost` — Cloud Cost Optimization & Right-Sizing

A senior FinOps and cloud cost optimization advisor. It identifies waste, over-provisioned infrastructure, unattached storage, and purchasing inefficiencies from IaC and billing data — without ever sacrificing the reliability your system needs.

---

## What It Does

- **Quantifies savings and trade-offs**: Every recommendation pairs an estimated dollar saving with its reliability risk and trade-off. Redundancy is never cut silently.
- **Analyzes the big line items first**: Targets major spend drivers (compute, databases, NAT gateways, data egress) rather than micro-optimizations.
- **Validates with usage evidence**: Requires real utilization metrics (e.g. 30-day p95 CPU/memory) before claiming an instance or pod is over-provisioned.
- **Strictly read-only**: Runs diagnostic and billing queries only; never resizes, stops, or deletes resources.

---

## Usage

```text
/cost                           full cost review across all categories, big items first
/cost quick                     top handful of safe, high-value wins only
/cost deep                      exhaustive: every service, account, and resource tier
/cost <focus>                   focus on one lens (compute, storage, network, purchasing, waste)
/cost plan <description>        spec one known cost optimization plan
```

---

## Review Categories

- **Compute Right-Sizing**: Instances and pods with low CPU/RAM utilization, oversized types, always-on non-prod environments, Kubernetes requests vs. actual usage (VPA, Kubecost).
- **Purchasing Options**: On-demand usage that fits Savings Plans / Reserved Instances / committed-use discounts; Spot instances for fault-tolerant workloads.
- **Storage Optimization**: Unattached volumes, orphaned snapshots, missing S3/GCS lifecycle policies, over-provisioned IOPS.
- **Networking Costs**: Cross-AZ and cross-region data transfer, NAT gateway data-processing fees, idle load balancers.
- **Managed Services & Waste**: Over-sized database/cache tiers, idle clusters, high-cardinality metric spend, untagged orphan resources.

---

## Output

1. **Cost Posture & Opportunity Table**: Summarizes estimated monthly savings, basis of calculation, effort, and reliability risk.
2. **Remediation Plans**: Step-by-step plans in `plans/` with staged downsizing steps (step, observe, verify) and performance validation gates.

---

## Install

```bash
# Install this skill individually
npx skills add NotHarshhaa/devops-skills/cost

# Or install the complete collection
npx skills add NotHarshhaa/devops-skills
```

---

## Documentation & References

- [SKILL.md](SKILL.md) — complete agent instructions and workflow.
- [Shared Skill Contract](../docs/skill-contract.md) — hard rules, preflight, and reporting standards.
- [Finding Format](../docs/finding-format.md) — canonical finding schema.
- [Plan Template](../docs/plan-template.md) — remediation plan specification.
