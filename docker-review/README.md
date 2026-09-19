# `/docker-review` — Dockerfile & Container Hardening

A senior container engineer advisor. It analyzes Dockerfiles, image layering, build speed, security posture, and Docker Compose configurations, producing prioritized findings and actionable hardening plans.

---

## What It Does

- **Hardens container images**: Flags root runtime containers, unpinned base images, build secrets leaked into image layers, and unnecessary build toolchains.
- **Optimizes image size and build speed**: Recommends multi-stage builds, cache-friendly layer ordering, `.dockerignore` improvements, and package manager cache cleanup.
- **Checks signal handling and correctness**: Detects shell vs exec form bugs in `ENTRYPOINT`/`CMD` that prevent PID 1 from forwarding `SIGTERM` for graceful shutdown.
- **Strictly read-only & defensive**: Relies on static analysis (`hadolint`, `trivy config .`) and pre-existing local/registry image inspection. Never runs untrusted `docker build` during reviews.

---

## Usage

```text
/docker-review                  full container review across all Dockerfiles and Compose files
/docker-review quick            top HIGH-confidence findings: security and image size first
/docker-review deep             exhaustive review including full CVE reachability triage
/docker-review <focus>          focus on one lens (security, size, speed)
/docker-review plan <desc>      spec one known hardening change (e.g. multi-stage conversion)
```

---

## Review Checklist

- **Security**: Root execution (missing `USER`), `:latest` tags, unpinned digests, secrets in `ARG`/`ENV`/layers, known base image vulnerabilities, sensitive files missing from `.dockerignore`.
- **Image Size**: Absence of multi-stage builds, monolithic base images where distroless/slim fits, uncleaned package manager caches.
- **Build Speed**: Dependency installs not separated from source copies (busts layer cache), missing BuildKit cache mounts.
- **Correctness**: Shell vs. exec form in `CMD`/`ENTRYPOINT` affecting signal termination, platform mismatches (`--platform`), missing `EXPOSE` documentation.
- **Docker Compose**: Unbounded resource limits, exposed host ports, credentials in plain environment variables.

---

## Output

1. **Prioritized Findings Table**: Ordered by real security and operational leverage.
2. **Remediation Plans**: Self-contained plans in `plans/` with target Dockerfile excerpts, non-root user file ownership steps, and build validation commands.

---

## Install

```bash
# Install this skill individually
npx skills add NotHarshhaa/devops-skills/docker-review

# Or install the complete collection
npx skills add NotHarshhaa/devops-skills
```

---

## Documentation & References

- [SKILL.md](SKILL.md) — complete agent instructions and workflow.
- [Shared Skill Contract](../docs/skill-contract.md) — hard rules, preflight, and reporting standards.
- [Finding Format](../docs/finding-format.md) — canonical finding schema.
- [Plan Template](../docs/plan-template.md) — remediation plan specification.
