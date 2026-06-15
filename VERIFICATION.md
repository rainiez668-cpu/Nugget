# Verification

Verified on June 14, 2026 in Windows PowerShell with Node.js 22.14.0.

## Commands Run

| Command | Result |
| --- | --- |
| `npm install --no-audit --no-fund` | Passed after retry |
| `npm ci --no-audit --no-fund --prefer-online` | Passed |
| `npm run lint` | Passed |
| `npm run typecheck` | Passed |
| `npm run build` | Passed |
| `npx playwright install chromium` | Passed |
| `npm run demo:screenshots` | Passed; 8 screenshots created |
| `npx playwright test` | Passed; 3 end-to-end tests |

## Errors Fixed

- The first dependency install timed out and left an incomplete package tree. The repo-local `node_modules` directory was verified, removed, and rebuilt with `npm ci`.
- The initial Windows screenshot runner could not spawn `npm.cmd`. It now launches the local Next.js binary through the current Node executable.
- Next.js workspace tracing was anchored to this project through `next.config.ts`.
- Sticky navigation was disabled only during the dedicated concept screenshot so the proof image remains unobstructed.

## Local URL

- [http://localhost:3000](http://localhost:3000)
- [http://localhost:3000/demo](http://localhost:3000/demo)

## Sample Brief

The built-in sample is the fictional **RE:FORM 2026 — International Student Furniture Competition**. It asks designers to create compact, repairable furniture for apartments under 40 square meters, with an A1 board, renders, exploded axonometric, and 150-word statement due October 18, 2026.

## Automated Product QA

- [x] Landing page loads.
- [x] Studio page loads.
- [x] Sample brief fills the textarea.
- [x] Analyze returns all generated sections in mock mode.
- [x] Markdown export triggers a `.md` download.
- [x] JSON export triggers a `.json` download.
- [x] Project saves to localStorage.
- [x] Library displays the saved project.
- [x] Saved project reopens in Studio.
- [x] Saved project can be deleted.
- [x] Global radar loads and displays open competitions.
- [x] Free-entry filtering works.
- [x] Competition details show prize, eligibility, deadline, and sources.
- [x] A discovered competition opens and automatically analyzes in Studio.
- [x] Student/open competitions receive default priority.
- [x] Official rule sources and downloadable extracted summaries appear in the file center.
- [x] A student-eligible competition can pass the eligibility gate.
- [x] A professional architect competition blocks the student workflow.
- [x] Deliverables are extracted and must be approved before generation stages unlock.
- [x] Desktop screenshots render without obvious breakage.
- [x] Mobile landing and result views render at 390 px width.

## Build Result

The production build completed successfully with static pages for Landing, Studio, Demo, Library, and About, plus the dynamic `/api/analyze` route.

## Known Limitations

- OpenAI and Anthropic adapters require the user’s own valid API key and were not called during verification.
- The global radar currently uses a designed demo index. Production whole-web daily discovery still requires persistent backend collectors and source integrations.
- Image generation and board production are intentionally represented as unlocked workflow stages; their implementation follows after the rule and eligibility pipeline is stable.
- Automated competition-site submission remains intentionally locked until eligibility, technical feasibility, AI rules, and final authorship approval are confirmed.
- Projects are browser-local and do not sync between devices.
- Mock mode is strongest for the included architecture, furniture, and product-design style briefs.
- No GIF was created; the eight required screenshots provide the visual proof set.
