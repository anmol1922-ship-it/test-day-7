# Implementation Plan: CA Buddy

**Branch**: `001-ca-buddy` | **Date**: 2026-09-09 | **Spec**: [spec.md](spec.md)

## Summary

Build a single-screen React and TypeScript Vite SPA for everyday Indian tax and audit questions. The UI depends on a `ChatService` interface. Production uses LangChain.js with `@langchain/google-genai` in the browser; unit tests use a deterministic fake; Playwright intercepts Gemini requests; GitHub Pages deployment runs only after unit and e2e test jobs pass.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19, Node.js 22 in CI

**Primary Dependencies**: Vite, React, `@langchain/core`, `@langchain/google-genai`, Vitest, Testing Library, Playwright

**Storage**: In-memory `ConversationMemory` only; no database, server, localStorage, or persistent history

**Testing**: Vitest + Testing Library for unit tests; Playwright with intercepted Gemini network calls for e2e tests

**Target Platform**: Modern browsers and GitHub Pages static hosting

**Project Type**: Frontend-only single-page web application

**Performance Goals**: Typical user question should receive a response within 10 seconds on a broadband connection; responses are capped at 4096 output tokens

**Constraints**: No backend, server, database, accounts, saved history, or settings. `VITE_GOOGLE_API_KEY` is read from local `.env` during development and GitHub Actions secrets for builds. Deployments require passing unit and e2e tests.

**Scale/Scope**: One screen, one active in-memory conversation per browser page, and five implementation tasks

## Constitution Check

All gates pass:

- Frontend-only: the repository contains a Vite SPA and no backend or database.
- Key handling: the Gemini adapter reads `VITE_GOOGLE_API_KEY`; no key is committed; CI build receives it from a GitHub Actions secret.
- Minimal UI: the app has one screen with header, chat panel, input, `New chat`, and disclaimer.
- Fake-driven tests: unit tests use `FakeChatService`; e2e tests intercept Gemini.
- Deployment gate: Pages deployment has explicit `needs` on unit tests, e2e tests, and the build.
- Clear escalation: the persona prompt and UI disclaimer recommend consulting a Chartered Accountant.

## Project Structure

### Documentation

```text
specs/001-ca-buddy/
  plan.md
  research.md
  data-model.md
  quickstart.md
  contracts/ChatService.md
  tasks.md
```

### Source and Tests

```text
src/
  App.tsx
  main.tsx
  styles.css
  components/
    ChatShell.tsx
    ChatPanel.tsx
  prompts/
    ca_persona.txt
  services/
    ChatService.ts
    conversationMemory.ts
    langchainGemini.ts
  types/
    chat.ts

tests/
  setup.ts
  mocks/
    fakeChatService.ts
  unit/
    ChatShell.spec.tsx
  e2e/
    chat.spec.ts
    playwright.config.ts

.github/workflows/
  ci.yml
  deploy.yml
```

**Structure Decision**: Use one frontend project at the repository root. React components own the single-screen UI, services own the model boundary and ephemeral memory, and tests are split into deterministic unit tests and browser-level e2e tests.

## Implementation Phases

1. T001 creates the UI shell, unit test harness, Vite project configuration, and CI unit job.
2. T002 defines `ChatService`, adds the LangChain Gemini adapter, and supplies the fake test implementation.
3. T003 adds the CA persona prompt, memory reset behavior, streamed assistant rendering, and disclaimer.
4. T004 adds Playwright interception tests and CI browser setup.
5. T005 adds a GitHub Pages workflow whose build and deploy are gated by both test jobs.

## Complexity Tracking

No constitutional violations require justification. The separate service interface and memory class are required by the PRD and keep the production adapter replaceable by the fake test implementation.
