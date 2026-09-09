# PRD: CA Buddy

One paragraph
CA Buddy is a single-screen, frontend-only chatbot that answers everyday Indian tax and audit questions (GST, TDS, ITR deadlines, audit basics) for small-business owners and tells them when to consult a Chartered Accountant. The product is intentionally lightweight: no accounts, no history, and no backend — it demonstrates a secure client-side integration to a large language model for fast, practical guidance and clear escalation to a CA when issues exceed the bot's safe scope.

User
Small-business owners and sole proprietors in India who need quick, practical answers to routine tax and audit questions and a clear recommendation when they should consult a Chartered Accountant.

Happy path (three-minute demo)

- User opens the site, sees the header, chat panel, message input, `New chat` button and a one-line disclaimer.
- User types: "When is the next ITR deadline for FY2025 and do I need a tax audit?" and submits.
- The UI immediately shows the user's message and then a typing/response state while calling the model via LangChain.js -> Google Gemini.
- The model replies with a concise answer, cites relevant rules briefly, and either: (a) states no immediate CA consultation required and suggests next steps, or (b) recommends "consult a CA" with a short reason and next steps.
- User clicks `New chat` to start over; conversation clears.

Out of scope

- Any server-side storage, user accounts, saved chat history, analytics that persist on a server, or any backend service. No legal/advisory guarantees; the bot only gives informational guidance and points to consult a CA.

Architecture

- Frontend-only single-page app built with React + TypeScript + Vite. The UI calls a `ChatService` interface. Production client code calls LangChain.js's Google Gemini adapter in the browser using an API key read from `VITE_GOOGLE_API_KEY`. Unit tests use a fake `ChatService`; Playwright e2e intercepts Gemini network calls.

Hard constraints — write them into the PRD exactly as given; do not soften, expand or add to them:

- Frontend only. React + TypeScript + Vite. No backend, no server, no database. The browser calls Google Gemini directly through LangChain.js (@langchain/google-genai). The API key is read from VITE_GOOGLE_API_KEY — a local .env during development, a GitHub Actions secret when built in CI.

- Design: modern, attractive and simple. One screen: a header, one chat panel, an input, a "New chat" button, a one-line disclaimer. No login, no saved history, no settings.

- Testing: unit tests (Vitest + Testing Library) with the model faked; end-to-end tests (Playwright) with the Gemini request intercepted; both run in GitHub Actions on every push and pull request.

- Deployment: GitHub Pages through GitHub Actions. Tests must pass before anything deploys.

- Exactly five tasks build the whole app, in this order, one GitHub issue and one pull request each:
  1. Chat UI shell, unit tests, and the CI workflow that runs them.

  2. ChatService interface; LangChain + Gemini implementation; a fake implementation for tests.

  3. The CA persona: system prompt in a file, scope rules, "consult a CA" fallback, disclaimer, conversation memory.

  4. Playwright end-to-end tests with the Gemini call intercepted, wired into CI.

  5. GitHub Pages deployment, gated on all tests passing.

Functional requirements (each testable)
FR-1: Single-screen UI (header, chat panel, input, `New chat` button, one-line disclaimer). Test: component renders elements and is accessible.
FR-2: Sending a message displays the user's message immediately and calls `ChatService`. Test: mock `ChatService` verifies call on submit and UI shows user message.
FR-3: ChatService has two implementations: a LangChain+Gemini client and a fast fake for tests. Test: unit tests wire the fake and verify responses.
FR-4: System prompt and CA persona live in a file under `src/prompts/ca_persona.txt` and are passed as the system prompt to the model. Test: unit tests assert the model client receives the file content as the system prompt.
FR-5: No persistent storage. `New chat` clears in-memory conversation; nothing is written to disk or network for storage. Test: UI state resets and no storage APIs are called.
FR-6: Conversation memory is ephemeral for the page session only and replayed to the model during the session. Test: session memory exists during runtime, but is cleared on reload or `New chat`.
FR-7: Unit tests (Vitest) run with a faked model; Playwright e2e intercepts Gemini and asserts request payloads. Test: CI job executes both test suites and fails on any test failure.
FR-8: Deployment to GitHub Pages is gated on CI: all tests must pass before the deployment job runs. Test: release workflow includes test jobs as prerequisites.

The model

- Provider: Google Gemini (accessed via LangChain.js adapter `@langchain/google-genai`).
- Model name: Gemini (select the available production model variant, e.g. `gemini-1.5` or the up-to-date production name at integration time).
- System prompt lives in: `src/prompts/ca_persona.txt` (maintained as plain text and version-controlled).
- Max tokens / response budget: configure a conservative token limit (e.g. 4096) to bound cost and response size; truncate long user input client-side if needed.

Quality gates

- All Vitest unit tests and Playwright e2e tests must pass in GitHub Actions on push and pull request.
- PR must include one GitHub Issue reference and pass CI before merging.

The five tasks (one issue + one PR each, in order)

1. Chat UI shell, unit tests, and the CI workflow that runs them.
2. ChatService interface; LangChain + Gemini implementation; a fake implementation for tests.
3. The CA persona: system prompt in a file, scope rules, "consult a CA" fallback, disclaimer, conversation memory.
4. Playwright end-to-end tests with the Gemini call intercepted, wired into CI.
5. GitHub Pages deployment, gated on all tests passing.

Acceptance walkthrough

- Open the deployed site or run locally with `VITE_GOOGLE_API_KEY` set.
- Confirm the single-screen UI appears with header, chat panel, input, `New chat` and disclaimer.
- Type a tax question; observe the user message, the model response, and either practical guidance or a clear "consult a CA" recommendation.
- Click `New chat` and confirm conversation clears.
- Verify CI: push a branch/PR and confirm Vitest and Playwright jobs run; ensure the deployment waits for tests and only runs after success.
