# Quickstart: CA Buddy (developer validation)

Prerequisites

- Node 18+ and npm or pnpm installed.
- Local `VITE_GOOGLE_API_KEY` for manual Gemini testing.

Install

```bash
npm install
```

Run dev server

```bash
# create .env from the safe template, then set the real key
cp .env.example .env
npm run dev
```

Run unit tests (Vitest)

```bash
npm test
```

Run e2e (Playwright) with Gemini interception

```bash
# Start dev server in one terminal
npm run dev
# In another terminal, run Playwright tests which assert intercepted Gemini payloads
npm run test:e2e
```

Build and preview

```bash
npm run build
npm run preview
```

Deployment (GitHub Actions)

- CI must pass unit and e2e tests; deployment to GitHub Pages is gated on test success.
- Ensure `VITE_GOOGLE_API_KEY` is set as a GitHub Actions secret for production builds if you need to exercise real Gemini calls (not recommended for CI tests).
