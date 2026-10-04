# Nugget

English | [简体中文](README.zh-CN.md)

**Find golden ideas inside messy briefs.**

Nugget is a global design competition radar and local-first AI studio for students and independent designers. It helps designers discover worthwhile open calls, understand fee, prize, eligibility, and deadline information, then turn the brief into a structured proposal package.

## Features

- Portfolio-ready landing page and responsive product UI
- Global competition radar across countries, languages, and design disciplines
- Search, category, fee, eligibility, competition-type, prize, and deadline filters
- Free-entry-first recommendation scoring
- Source confidence grades, including official websites and WeChat sources
- Competition detail panel with prize, eligibility, deadline, and source evidence
- One-click handoff from a discovered competition into Studio analysis
- Seven-stage workflow: files, eligibility, deliverables, concept approval, image generation, layout, review, and submission receipt
- Three competition visuals from built-in demo assets or live OpenAI image generation
- Editable statement, automatic board composition, and downloadable submission manifest
- Human-reviewed simulated submission with a direct official-page handoff
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

Open the competition radar at [http://localhost:3000/discover](http://localhost:3000/discover).

Open the complete student workflow demo at [http://localhost:3000/production?competition=real-leather-student-2026](http://localhost:3000/production?competition=real-leather-student-2026).

For the instant completed Studio demo, open [http://localhost:3000/demo](http://localhost:3000/demo).

## Demo Flow

1. Open **Discover**.
2. Filter by free entry, discipline, eligibility, or competition type.
3. Open a competition to inspect prize, eligibility, deadline, and sources.
4. Click **用 Nugget 分析这场比赛**.
5. Explore the requirements and three concept directions.
6. Save the project or export it as Markdown or JSON.

For the end-to-end workflow, open an eligible competition and click **进入参赛工作流**. Nugget checks the rules and eligibility, extracts deliverables, creates concepts and visuals, composes a board, supports editing and approval, downloads a package manifest, and produces a simulated submission receipt.

## Discovery Data

The current radar uses a comprehensive demonstration index designed to prove the product experience. It does not claim live whole-web coverage yet. A production release requires scheduled collectors, a database, multilingual search, source-specific parsers, deduplication, and daily deadline/source revalidation.

## Environment Variables

Copy `.env.example` to `.env.local`:

```env
AI_PROVIDER=mock
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
```

Supported values for `AI_PROVIDER` are `mock`, `openai`, and `anthropic`. Missing keys always fall back to mock mode. Keys are read only by the server route and are never exposed to the browser.

Without `OPENAI_API_KEY`, the production workflow uses built-in design samples. With a valid key, it generates three new PNG visuals through the OpenAI Images API.

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
```

Screenshots are written to `artifacts/screenshots/`.

## Roadmap

- Editable concept refinement
- User-defined competition discovery sources
- Exportable PDF/JPG presentation boards
- Site-specific authenticated submission adapters
- Cloud sync and collaborative review
- Provider model selection and structured schema validation
- Submission calendar and deadline reminders
