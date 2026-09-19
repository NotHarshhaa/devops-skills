# `/observability` — Monitoring, Metrics, Logging & Alerts

A senior SRE advisor for observability. It reviews metrics, logs, distributed tracing, dashboards, alert rules, and SLOs to close detection gaps and eliminate alert fatigue.

The guiding question: **if this system broke right now, would we know — and would the signal point to the cause?**

---

## What It Does

- **Validates the Three Pillars**: Audits metrics (Prometheus/CloudWatch/Datadog), structured logging with correlation IDs, and distributed tracing across service boundaries.
- **Enforces symptom-based alerting**: Flags alerts on causes rather than symptoms (pages on high CPU instead of elevated error rates), alerts missing runbook links, and flapping rules.
- **Protects collector infrastructure & budgets**: Checks OpenTelemetry Collector configurations for `memory_limiter` processors and audits trace sampling rates to prevent APM bill blowouts.
- **Strictly read-only**: Runs read-only queries; never edits dashboards, silences alerts, or modifies rules directly.

---

## Usage

```text
/observability                  full observability review across all pillars
/observability quick            gap analysis on critical paths: "would we detect top failure modes?"
/observability deep             exhaustive review of every dashboard, panel, and alert rule
/observability noise            focus specifically on eliminating noisy/flapping alerts
/observability <focus>          focus on one lens (alerts, metrics, logging, tracing, slo)
/observability plan <desc>      spec one known observability plan
```

---

## Review Checklist

- **Coverage**: Critical user journeys lacking metrics, unstructured logs, uninstrumented third-party boundaries, OTel Collector missing `memory_limiter`.
- **Golden Signals & SLOs**: Missing latency, traffic, error, and saturation metrics on key services; absence of SLI/SLO definitions.
- **Alerting Quality**: Alerts on causes instead of customer symptoms, missing alerts for historical outage modes, missing severity levels.
- **Alert Noise**: Flapping thresholds, duplicate alerts, un-inhibited dependent alerts.
- **Dashboards**: Absence of a single "service health" dashboard for core journeys, broken or unmaintained panels.
- **Operational Readiness**: Inadequate log retention for forensic analysis, high-cardinality metric explosion, 100% trace capture without head/tail sampling.

---

## Output

1. **Prioritized Findings Table**: Ordered by detection impact on critical user journeys.
2. **Remediation Plans**: Self-contained plans in `plans/` with target alert YAML/PromQL rules, threshold justifications, routing, and runbook links.

---

## Install

```bash
# Install this skill individually
npx skills add NotHarshhaa/devops-skills/observability

# Or install the complete collection
npx skills add NotHarshhaa/devops-skills
```

---

## Documentation & References

- [SKILL.md](SKILL.md) — complete agent instructions and workflow.
- [Shared Skill Contract](../docs/skill-contract.md) — hard rules, preflight, and reporting standards.
- [Finding Format](../docs/finding-format.md) — canonical finding schema.
- [Plan Template](../docs/plan-template.md) — remediation plan specification.
