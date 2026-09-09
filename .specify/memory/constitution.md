<!--
Sync Impact Report
- Version change: none -> 1.0.0
- Modified principles: (initial creation)
- Added sections: Purpose, Principles, Governance, Procedures, Security & Keys, Testing & CI, Deployment, PR/Issue workflow
- Removed sections: none
- Follow-up TODOs: none
-->

# Project Constitution — CA Buddy

**RATIFICATION_DATE**: 2026-09-09

**CONSTITUTION_VERSION**: 1.0.0

## Purpose

This constitution governs CA Buddy's project-level decisions: scope, security, testing and deployment rules, and contribution workflow. It is intentionally narrow: the project is a frontend-only chatbot integrating a cloud LLM in the browser and must follow the hard constraints documented in the PRD.

## Principles

- Principle 1 — Frontend-Only First
  - The project MUST remain frontend-only. No backend services, databases, or server-side storage are allowed.
  - Rationale: keeps legal surface limited and matches product constraints.

- Principle 2 — Explicit Key Handling
  - All production API keys MUST be provided via env/secrets. Development uses `VITE_GOOGLE_API_KEY` in a local `.env` only; CI reads a GitHub Actions secret. Keys MUST NOT be committed.
  - Rationale: prevents accidental leakage and centralizes secret handling in the platform's secure secrets store.

- Principle 3 — Minimal UI Surface
  - The UI MUST be single-screen: header, chat panel, input, `New chat` button, and a one-line disclaimer. No login, no saved history, no user settings.
  - Rationale: reduces complexity, privacy surface, and compliance concerns.

- Principle 4 — Test-First, Fake-Driven
  - Unit tests MUST run against a fake model implementation. Playwright e2e tests MUST intercept the Gemini call to assert request shape without calling production models during CI runs.
  - Rationale: deterministic, low-cost CI and reproducible test assertions.

- Principle 5 — Gate Deployments on Tests
  - GitHub Pages deployment MUST be gated: all unit and e2e tests must pass in GitHub Actions before deployment job runs.
  - Rationale: ensures shipping only validated artifacts.

- Principle 6 — Clear Escalation
  - The product MUST instruct users to consult a Chartered Accountant when a query falls outside the bot's safe scope. This escalation MUST be implemented as a clear fallback in the persona prompt and in the UI disclaimer.

## Procedures

- Versioning: bump `CONSTITUTION_VERSION` using semantic rules. MAJOR for breaking governance changes, MINOR for new principles, PATCH for wording.
- Amendments: propose via GitHub Issue referencing this constitution and a PR that updates `.specify/memory/constitution.md`. Merging the PR with a one-line explanation ratifies the amendment and updates `LAST_AMENDED_DATE`.

## Security & Keys

- Local development: `VITE_GOOGLE_API_KEY` in `.env` only.
- CI: store key in GitHub Actions secret and reference it in workflows; do not echo or leak the secret in logs.
- No keys in code, history, or environment variables checked into git.

## Testing & CI

- Unit tests: Vitest + Testing Library. Tests MUST use the fake `ChatService` implementation.
- E2E: Playwright tests MUST intercept the Gemini network call and assert payloads without contacting production.
- CI: GitHub Actions runs both test suites on push and pull_request.

## Deployment

- Deployment is GitHub Pages via GitHub Actions. Deployment job MUST depend on successful test jobs.

## PR / Issue Workflow

- Every task listed in the PRD MUST be an issue and have a single PR that closes it.
- PRs MUST reference their issue and pass CI before merging.

## Governance Metadata

- LAST_AMENDED_DATE: 2026-09-09
- RATIFIED_BY: project maintainers (see README for contact)
