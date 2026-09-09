# Research: CA Buddy

## Decisions

- Decision: Frontend-only SPA using React + TypeScript + Vite
  - Rationale: PRD and constitution mandate frontend-only; fast developer DX and simple GitHub Pages deployment.
  - Alternatives considered: backend proxy (rejected due to governance and key-handling constraints).

- Decision: Use LangChain.js with `@langchain/google-genai` to call Google Gemini from the browser
  - Rationale: PRD requirement; allows direct browser access to Gemini with `VITE_GOOGLE_API_KEY`.
  - Alternatives: server-side proxy or other LLMs — rejected by constitution (frontend-only) or cost/compatibility.

- Decision: Secrets: `VITE_GOOGLE_API_KEY` in local `.env` during development; GitHub Actions secret in CI
  - Rationale: Principle 2 requires explicit key handling and no committed keys.

- Decision: Testing: Vitest + Testing Library for unit tests; Playwright for e2e with network interception
  - Rationale: Matches PRD/conclusion that unit tests use a fake `ChatService`; Playwright can intercept Gemini calls.

- Decision: CI & Deployment using GitHub Actions; deploy to GitHub Pages gated on tests
  - Rationale: Constitution requires gating and Pages is compatible with a frontend-only SPA.

## Alternatives & Tradeoffs

- Using a backend to hide keys: simpler key security but violates frontend-only constitutional constraint.
- Using server-side Playwright e2e with real Gemini: higher fidelity but costly and breaks offline reproducibility; interception provides deterministic CI.

## Outstanding Clarifications (none)

All required hard-constraints from the PRD and constitution are satisfied by the decisions above.
