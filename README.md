# Nugget

English | [简体中文](README.zh-CN.md)

**Find golden ideas inside messy briefs.**

Nugget is a global design competition discovery and AI-assisted proposal workflow for students and independent designers.

It helps designers find worthwhile opportunities, understand whether a competition is worth entering, decode complex briefs, and turn requirements into structured concept directions and submission-ready materials.

Rather than treating AI as a one-click idea generator, Nugget puts **eligibility, rules, deliverables, and source confidence before generation**.

---

## Overview

Design competitions are scattered across different websites, countries, languages, and disciplines. Important information such as eligibility, entry fees, deadlines, deliverables, and judging criteria is often buried inside long competition pages or briefs.

For students and independent designers, the challenge is not only finding competitions. It is deciding:

- Is this competition relevant to me?
- Am I eligible to enter?
- Is there an entry fee?
- What exactly needs to be submitted?
- What does the jury appear to value?
- How can the brief become a workable design direction?

Nugget brings these decisions into one workflow:

**Discover → Qualify → Analyze → Create → Review → Submit**

---

## Core Workflow

### 1. Discover

Browse a global competition radar across design disciplines, countries, and competition types.

Search and filters help narrow opportunities by factors such as:

- discipline
- entry fee
- eligibility
- competition type
- prize
- deadline

Free-entry opportunities are prioritized to make discovery more useful for students and independent designers.

### 2. Qualify

Before generating ideas, Nugget surfaces the practical constraints that determine whether a competition is worth pursuing.

Competition details include:

- eligibility
- entry fee
- prize
- deadline
- source confidence
- official source evidence

### 3. Analyze

A competition brief can be handed directly from Discover into Studio.

Nugget structures the brief into:

- key requirements
- deliverables
- format constraints
- judging signals
- hidden opportunities
- risks and watch-outs

### 4. Create

Instead of returning a single generic AI answer, Studio produces three structured concept directions.

Each direction can include:

- concept strategy
- spatial or product approach
- visual mood
- jury relevance
- image-generation prompts
- concept statement
- board layout plan
- submission checklist

### 5. Review

The production workflow keeps important decisions visible before moving forward.

Concepts, visual assets, layouts, and submission materials are treated as reviewable stages rather than automatically accepted AI output.

### 6. Submit

The workflow can assemble proposal materials into a structured submission package and produce a simulated submission receipt with a handoff to the official competition source.

The current public prototype does not automatically submit entries to third-party competition platforms.

---

## Product Principles

### Free entry first

Competition discovery prioritizes opportunities with low barriers to participation, particularly for students and independent designers.

### Trust before generation

Source information, eligibility, deadlines, and competition requirements are surfaced before AI-assisted ideation begins.

### Rules before AI

Nugget treats the brief as a set of constraints to understand, not simply a prompt to generate from.

### Structure before automation

Complex competition tasks are broken into visible stages so users can understand what the system is doing and intervene when necessary.

### AI proposes, human decides

AI-generated directions and assets are treated as proposals. Important decisions remain reviewable by the designer.

---

## Key Features

- Global design competition discovery radar
- Search and multi-dimensional competition filters
- Free-entry-first recommendation logic
- Eligibility, prize, deadline, and fee visibility
- Source confidence and official-source evidence
- Discover-to-Studio brief handoff
- Structured brief analysis
- Three complete concept directions
- Rule-aware competition workflow
- Mock and optional live AI providers
- Built-in and AI-generated visual asset workflows
- Proposal board composition
- Editable proposal materials
- Submission checklist and package generation
- Local project save, reopen, and delete
- Markdown and JSON export
- Responsive product interface
- End-to-end Playwright smoke testing

---

## AI Architecture

Nugget uses a provider-based AI architecture with three supported modes:

- `mock`
- `openai`
- `anthropic`

Mock mode is the default experience and requires no API key.

When configured with a supported provider, server-side API routes can use OpenAI or Anthropic for AI-assisted analysis. The visual-generation workflow can also use the OpenAI Images API when a valid key is available.

API keys are read only on the server and are never intentionally exposed to the browser.

If provider credentials are unavailable, Nugget falls back to the built-in mock experience.

---

## Mock AI

The mock system is designed as a complete demonstration mode rather than an empty placeholder.

It detects basic signals in a supplied brief, such as title, deadline, fee, and design domain, and returns a structured competition analysis with three concept directions.

This makes the main product workflow testable without requiring external AI services or API costs.

---

## Discovery Data

The current competition radar uses a curated demonstration dataset designed to test and communicate the product experience.

It does **not** claim real-time or comprehensive whole-web competition coverage.

A production-scale discovery system would require infrastructure such as:

- scheduled data collection
- persistent competition storage
- multilingual search
- source-specific parsers
- deduplication
- deadline revalidation
- source revalidation

This distinction is intentional: the current prototype focuses on validating the product workflow rather than presenting simulated data as live coverage.

---

## Local-First Projects

Studio projects are stored in browser `localStorage`.

Users can:

- save an analysis
- reopen a previous project
- delete a project
- export the project as Markdown
- export the complete structured record as JSON

No account is required for the current prototype.

Projects are not currently synchronized across browsers or devices.

---

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Browser `localStorage`
- Playwright
- Lucide icons

The full version uses Next.js server API routes for provider-based AI functionality while keeping project storage local to the browser.

---

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

Main routes:

```text
/             Landing page
/discover     Competition discovery radar
/studio       Brief analysis and concept generation
/demo         Instant Studio demo
/library      Locally saved projects
/production   End-to-end competition workflow
/about        Product and provider information
```

For the built-in competition workflow demo:

```text
http://localhost:3000/production?competition=real-leather-student-2026
```

---

## Environment Variables

Create a local `.env.local` file if you want to use an external AI provider.

```env
AI_PROVIDER=mock
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
```

Supported `AI_PROVIDER` values:

```text
mock
openai
anthropic
```

Missing provider credentials fall back to mock mode.

Do not commit `.env.local` or API keys to the repository.

Without an OpenAI image-generation key, the production workflow uses built-in design samples.

---

## Demo Flow

A typical Nugget workflow is:

1. Open **Discover**.
2. Search or filter available competitions.
3. Open a competition and review its eligibility, fee, prize, deadline, and sources.
4. Send the competition brief to **Studio**.
5. Review requirements, judging signals, risks, and opportunities.
6. Explore three concept directions.
7. Save the project or export it as Markdown or JSON.
8. For eligible competitions, continue into the production workflow.
9. Review deliverables and concept decisions.
10. Generate or load visual assets.
11. Compose the proposal board.
12. Review the submission package before the simulated final handoff.

---

## Exports

### Markdown

A readable proposal document containing structured requirements, concepts, prompts, statements, and submission checklists.

### JSON

The complete structured project record, including the original brief, analysis data, concept directions, and timestamps.

Exports are generated locally in the browser.

---

## Testing

Useful development commands:

```bash
npm run lint
npm run typecheck
npm run build
npm run test:e2e
npm run demo:screenshots
npm run demo:proof
```

Playwright is used for end-to-end smoke testing of key product flows.

Generated proof screenshots are written to:

```text
artifacts/screenshots/
```

---

## Project Scope

Nugget is currently a functional product prototype.

The prototype validates:

- competition discovery and filtering
- eligibility-first decision support
- structured brief analysis
- AI-assisted concept exploration
- staged human review
- local project persistence
- proposal packaging
- the feasibility of connecting discovery and creation in one workflow

It does not currently claim:

- live whole-web competition indexing
- guaranteed competition eligibility
- autonomous third-party submission
- cloud project synchronization
- production-scale authentication or billing

---

## Roadmap

Future directions include:

- editable concept refinement
- user-defined competition sources
- live competition collection and revalidation
- exportable PDF/JPG presentation boards
- authenticated submission adapters
- cloud synchronization
- collaborative review
- structured AI output validation
- provider and model selection
- submission calendar and deadline reminders

---

## Role & Development Approach

Nugget was developed as an independent product design and prototyping project.

My role covered:

- product definition
- workflow and information architecture
- UX/UI design
- interaction rules
- feature prioritization
- prototyping
- testing and iteration

Implementation was developed with AI-assisted coding tools.

Rather than treating generated code as the final output, the development process involved defining product requirements and interaction behavior, setting acceptance criteria, testing implemented flows, identifying failures, and iterating on both the product and implementation.