# Nugget

**Find golden ideas inside messy briefs.**

Nugget is a cute, local-first AI competition studio for students and independent designers. It turns dense design competition briefs into a structured proposal package: requirements, hidden opportunities, risks, three concept directions, visual prompt packs, concept statements, board layouts, and submission checklists.

## Features

- Portfolio-ready landing page and responsive product UI
- Built-in realistic furniture competition brief
- One-click `/demo` route with generated output
- Structured mock AI analysis with three complete concept directions
- Optional OpenAI and Anthropic provider adapters
- Local project save, reopen, and delete
- Markdown and JSON exports
- Desktop and mobile proof screenshots
- Playwright end-to-end smoke test

## Tech Stack

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- Browser `localStorage`
- Playwright
- Lucide icons

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For the instant completed demo, open [http://localhost:3000/demo](http://localhost:3000/demo).

## Demo Flow

1. Open the app.
2. Click **Start with a brief**.
3. Click **Try sample brief**.
4. Click **Analyze the brief**.
5. Explore the requirements and three concept directions.
6. Click **Save project**.
7. Open **Library** to reopen, export, or delete the project.

## Environment Variables

Copy `.env.example` to `.env.local`:

```env
AI_PROVIDER=mock
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
```

Supported values for `AI_PROVIDER` are `mock`, `openai`, and `anthropic`. Missing keys always fall back to mock mode. Keys are read only by the server route and are never exposed to the browser.

## Mock AI

Mock mode is the complete default experience. It detects basic signals in the supplied brief, such as title, deadline, fee, and design domain, then returns a detailed competition strategy and three polished furniture directions. It requires no network request or API key.

## Exports

The Studio and Library provide:

- **Markdown:** A readable proposal document with requirements, concepts, prompts, statements, and checklists.
- **JSON:** The complete typed project record, including the original brief and timestamps.

Downloads are created locally in the browser.

## Useful Commands

```bash
npm run lint
npm run typecheck
npm run build
npm run test:e2e
npm run demo:screenshots
npm run demo:proof
```

Screenshots are written to `artifacts/screenshots/`.

## Roadmap

- Editable concept refinement
- User-defined competition discovery sources
- Image generation and board composition
- Cloud sync and collaborative review
- Provider model selection and structured schema validation
- Submission calendar and deadline reminders
