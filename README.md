# CA Buddy

CA Buddy is a frontend-only React and TypeScript chatbot for everyday Indian tax and audit questions. It uses LangChain.js and Google Gemini in the browser, keeps conversation memory in memory only, and clearly recommends consulting a Chartered Accountant when a question needs individualized advice.

## Run locally

```bash
cp .env.example .env
# Set VITE_GOOGLE_API_KEY in .env
npm install
npm run dev
```

## Validate

```bash
npm run test:unit
npm run test:e2e
npm run build
```

The Playwright suite intercepts Gemini requests, so it does not require a live model or API key. GitHub Actions runs both suites on pushes and pull requests. The Pages deployment workflow runs its own test jobs and deploys only after they pass.
