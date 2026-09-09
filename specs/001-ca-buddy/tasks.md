# Tasks: CA Buddy

Feature directory: `specs/001-ca-buddy`

Phase 1 — Setup

- [x] T001 Create Chat UI shell, unit tests, and CI workflow that runs them — files: `src/components/ChatShell.tsx`, `src/components/ChatPanel.tsx`, `tests/unit/ChatShell.spec.tsx`, `.github/workflows/ci.yml`

Phase 2 — Foundational

- [x] T002 Implement `ChatService` interface; LangChain+Gemini implementation; fake implementation for tests — files: `src/services/ChatService.ts`, `src/services/langchainGemini.ts`, `tests/mocks/fakeChatService.ts`

Phase 3 — Persona and Conversation

- [x] T003 Add the CA persona: system prompt file, scope rules, "consult a CA" fallback, disclaimer, and in-memory conversation memory — files: `src/prompts/ca_persona.txt`, `src/services/conversationMemory.ts`, UI update in `src/components/ChatShell.tsx` to show disclaimer

Phase 4 — End-to-end Testing

- [x] T004 Implement Playwright end-to-end tests with the Gemini call intercepted and wire them into CI — files: `tests/e2e/chat.spec.ts`, `tests/e2e/playwright.config.ts`, update `.github/workflows/ci.yml` to run Playwright and intercept Gemini requests

Phase 5 — Deployment

- [x] T005 Add GitHub Pages deployment via GitHub Actions, gated on all tests passing — files: `.github/workflows/deploy.yml`, workflow must depend on the CI test jobs

Dependencies

- Execution order (linear): T001 -> T002 -> T003 -> T004 -> T005

Parallel opportunities

- T002 (service implementation) and T003 (persona prompt file + UI disclaimer) can be worked in parallel after T001's UI shell is available, but the project-level gating and repository policy require T002 and T003 to be completed before T004 and T005.

Total tasks: 5
