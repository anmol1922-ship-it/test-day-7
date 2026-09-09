# Spec: CA Buddy

Short name: ca-buddy

Overview
CA Buddy is a focused feature that delivers a single-screen, frontend-only chatbot to answer everyday Indian tax and audit questions (GST, TDS, ITR deadlines, audit basics) for small-business owners and to recommend consulting a Chartered Accountant when appropriate. The spec captures user scenarios, functional requirements, success criteria, assumptions, and acceptance tests; implementation work will follow the five-task plan defined in the PRD.

Actors

- Small-business owner (primary)
- Project maintainer (for governance and releases)

User scenarios

- Primary happy path: User opens the site, composes a tax/audit question, submits, reads a concise answer or a "consult a CA" recommendation, and optionally starts a new chat.

Functional requirements (testable)

- FR-1: Single-screen UI including header, chat panel, input field, `New chat` button, and a one-line disclaimer. (Test: render and accessibility checks present.)
- FR-2: Submitting a message shows the user message immediately and invokes `ChatService`. (Test: mock `ChatService` verifies invocation and UI shows message.)
- FR-3: `ChatService` supports two configurable implementations: fake (for tests) and LangChain+Gemini (for production). (Test: unit tests wire fake implementation.)
- FR-4: System prompt / persona stored at `src/prompts/ca_persona.txt` and provided as system prompt to the model. (Test: unit asserts client receives file content.)
- FR-5: No persistent storage; `New chat` clears in-memory conversation only. (Test: UI state resets; no storage APIs called.)
- FR-6: Conversation memory is ephemeral and replayed only for the active session. (Test: memory cleared on reload/`New chat`.)
- FR-7: Unit tests (Vitest + Testing Library) run with fake model; Playwright intercepts Gemini and asserts request payloads. (Test: CI runs both suites and fails on any failure.)
- FR-8: Deployment to GitHub Pages gated on CI success. (Test: deployment job depends on test jobs.)

Success criteria

- Users can submit a question and receive a model reply within 10 seconds on a typical broadband connection.
- 100% of the unit tests for UI and `ChatService` pass in CI.
- All Playwright e2e tests pass in CI when Gemini is intercepted.
- Deployment job runs only after tests succeed in CI.

Assumptions

- The project will remain frontend-only per the PRD constraints.
- The Google Gemini model is accessed via LangChain.js in the browser using `VITE_GOOGLE_API_KEY` set in CI and local env.
- No persisted user data is required or stored.

Dependencies

- GitHub Actions availability for CI and GitHub Pages deployment.
- Playwright and Vitest support in CI runners.

Acceptance tests (walkthrough)

- Start locally with `VITE_GOOGLE_API_KEY` set or run the deployed site.
- Verify UI renders header, chat panel, input, `New chat` and disclaimer.
- Submit a question; confirm UI shows user message and model reply (or a "consult a CA" recommendation).
- Click `New chat`; confirm UI resets.

Notes

- Refer to `.specify/memory/constitution.md` for governance principles that constrain implementation choices (frontend-only, key handling, gating tests before deploy).
