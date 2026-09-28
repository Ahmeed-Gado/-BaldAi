# CLAUDE.md — BaldGuard AI

Rules for Claude Code on this repo. Section 4 overrides everything else.

## 1. Project overview
BaldGuard AI: user uploads a scalp photo (PNG/JPG), backend sends it to OpenAI `gpt-4o-mini` vision,
gets back a hair-density score (0-100), zone (Green/Yellow/Red), confidence, summary, findings.
Results page shows a gauge, findings and a scripted (non-AI) "Demo Chat". Informational only, not medical advice.

## 2. Stack and structure
- **Frontend** (repo root): Next.js 16.1.6, React 19.2.3, TypeScript 5 (strict), Tailwind CSS 4.
  `next.config.ts` sets `output: 'export'` (static site into `out/`), deployed to Firebase Hosting
  (`firebase.json` → `out`, project `early-baldness-detector` in `.firebaserc`).
  - `src/app/page.tsx` landing; `src/app/scan/page.tsx` upload + scan; `src/app/results/page.tsx` results
  - No Next API routes: `output: 'export'` silently drops them from `out/`, so they never reach Firebase
    Hosting. Don't add `src/app/api/*`; the frontend calls the backend directly.
  - `src/components/*` UI; `src/app/globals.css` design tokens/animations
- **Backend** (`backend/`): FastAPI + Pillow + `openai` + `python-dotenv`. `main.py` (routes, upload validation),
  `model.py` (`analyze_hair(img)` → OpenAI call, raises `AnalysisError`), `requirements.txt` (unpinned),
  `requirements-dev.txt` (+ pytest, httpx), `tests/` (pytest), `Dockerfile` (python:3.11-slim, uvicorn on 8080).
- **How they talk**
  - `scan/page.tsx` POSTs `multipart/form-data` field `image` **directly** to
    `NEXT_PUBLIC_AI_BACKEND_URL` (default `http://localhost:8000/analyze`).
  - `GET /health` → `{status, model}`. `POST /analyze` → 200 `{score, zone, confidence, summary, findings[]}`,
    or `{"error": "<generic message>"}` with 400 (not a valid JPG/PNG), 411 (no Content-Length),
    413 (> 10 MB), 415 (wrong type), 422 (no `image` field), 502 (OpenAI failed / bad reply), 503 (no API key).
  - On 200 with a valid shape, scan page navigates to `/results?score=&zone=&confidence=` (never image data).
    On any failure it shows an error with "Try again" and does not navigate.
  - Env vars: `OPENAI_API_KEY` (backend, via `backend/.env`), `NEXT_PUBLIC_AI_BACKEND_URL` (frontend, public).

## 3. Commands
Frontend (from repo root, from `package.json`):
- Install: `npm install` (or `npm ci`)
- Dev: `npm run dev` · Build: `npm run build` (static export → `out/`) · Start: `npm run start`
- Lint: `npm run lint` (ESLint 9, `eslint-config-next`). Must have 0 errors; 7 `<img>`/font warnings pre-exist.
- Typecheck: `npx tsc --noEmit`
- If build fails with "Cannot find module" in `.next/dev/types/*`, the gitignored `.next/` cache is stale
  (e.g. after deleting a route): delete `.next/` and rebuild.
- Test: **no frontend test framework.** Use the manual checklist in Section 5.

Backend (from `backend/`):
- Install: `python -m venv .venv`, then `.venv/Scripts/python -m pip install -r requirements-dev.txt`
  (Windows path; `.venv/bin/python` elsewhere). `.venv` is gitignored.
- Dev: `uvicorn main:app --reload --port 8000`
- Test: `.venv/Scripts/python -m pytest` (config in `backend/pytest.ini`; tests never call real OpenAI)
- Container: Dockerfile runs `uvicorn main:app --host 0.0.0.0 --port 8080`
- Lint/format: none configured.

## 4. Hard rules (non-negotiable)
**Privacy — images never persist.**
- Uploaded images live in memory only (`image.read()` → `io.BytesIO` → PIL → base64 → OpenAI), then are discarded.
- Forbidden: writing image bytes/base64 to disk, temp files, DB, cache, cloud storage, logs, error messages,
  analytics, URLs/query strings, `localStorage`/`sessionStorage`/IndexedDB. No `img.save(<path>)`, no `tempfile`.
- Starlette spools uploads > 1 MB to disk by default. `main.py` prevents this with
  `MultiPartParser.spool_max_size = MAX_REQUEST_BYTES` plus the Content-Length cap middleware. Never remove either;
  `test_large_upload_never_rolls_over_to_disk` guards it.
- Frontend preview uses `URL.createObjectURL` (in `handlePick`) + `revokeObjectURL` (effect cleanup); keep it.
- Any change that could persist an image is rejected, even for debugging.

**Secrets.**
- `OPENAI_API_KEY` lives only in backend env (`backend/.env` locally, env vars in deploy). Never in frontend code,
  never in any `NEXT_PUBLIC_*` var (those ship to the browser), never in responses, never logged, never committed.
- The OpenAI client is created per request in `model._get_client()`; do not move it back to import time.
- `.env`, `.env.local`, `*.env` stay in `.gitignore`. Do not weaken those entries.

**Upload validation on the backend.**
- `/analyze` rejects non-JPEG/PNG (declared type **and** real PIL format) and files > 10 MB with a 4xx before
  OpenAI is called. `Image.open` stays inside try/except (`load_image`). Frontend checks are UX only.

**Error handling.**
- Never return stack traces, API keys, `str(e)` or raw OpenAI errors to the client. Backend returns
  `{"error": ...}` with fixed strings; frontend shows fixed client-side strings, never server text.
- Log with `logging` and the **exception type only** (`type(e).__name__`). No `print`, no `exc_info`,
  no exception message, no image data.

**Never show a result the analysis did not produce.**
- No demo/random/fallback scores anywhere. On failure show an error state with retry.
- Values read from the URL (`?zone=` etc.) are untrusted: allowlist them. No `dangerouslySetInnerHTML`.

## 5. Workflow rules for Claude
- Before editing: state the plan and the exact files you will touch. Wait if the change touches Section 4.
- Small steps: one feature or fix per step. No drive-by refactors.
- Every change needs a test. Backend: add pytest cases in `backend/tests/`. Frontend: manual checklist.
  For every "allowed" case also test the "rejected" case. Backend minimum (all covered by current tests):
  valid JPG/PNG → 200; wrong type, disguised/corrupt/truncated image, > 10 MB, missing field → 4xx;
  missing key → 503; OpenAI error or bad reply → 502; no raw error text or key in response or logs.
- Frontend manual checklist (run with `npm run dev`):
  - backend down → "Analysis failed, please try again." + "Try again" button, no navigation, no scores
  - `/results?zone=<script>alert(1)</script>` → page renders, no alert, greeting says "Yellow zone"
  - `/results?zone=Purple` → falls back to Yellow; `?zone=Red` → Red
- Never mark a task done until it has been tested (run it, or walk the checklist and report results).
- Run `npm run lint`, `npx tsc --noEmit` and `npm run build` after frontend changes; pytest after backend changes.
- If a rule here changes, update this file in the same step.

## 6. Coding conventions (as the code does today)
- TypeScript strict; import via `@/*` alias (→ `src/*`). Use `unknown` + type guards for fetched JSON.
- Components: one per file in `src/components/`, PascalCase filename, `export default function Name`.
  Hooks: `useX.ts`, named export (`useRevealOnScroll`).
- Props typed with a local `type Props = { ... }` or inline object type. Zone type `"Green" | "Yellow" | "Red"`
  is duplicated in `results/page.tsx`, `scan/page.tsx`, `Findings.tsx`, `ChatPanel.tsx`.
- Client components start with `"use client";`. Don't call setState synchronously in effects (lint error).
- Styling: Tailwind utility classes + custom classes from `globals.css` (`glass`, `btn-primary`, `btn-glass`,
  `animate-*`). Icons: Material Symbols (`<span className="material-symbols-outlined">`).
- Formatting: double quotes, semicolons. Indent is mixed (4 spaces in `src/app/scan`, `results`,
  most components; 2 spaces in `layout.tsx`, `page.tsx`). Match the file you edit. No Prettier config.
- Python: snake_case, module docstrings, type hints on functions, `logger = logging.getLogger(__name__)`.

## 7. Definition of done
- [ ] Plan + files stated before editing
- [ ] Change is one focused feature/fix
- [ ] No path writes/logs/stores image data
- [ ] No secret in frontend, logs, responses or commits; `.env` still ignored
- [ ] Backend validates type + size for any upload path touched
- [ ] Errors to client are generic (no traces, keys, raw OpenAI text); no fake results
- [ ] Backend: `python -m pytest` passes, with rejected cases tested
- [ ] Frontend: lint 0 errors, `tsc --noEmit` and `npm run build` pass, manual checklist run
- [ ] CLAUDE.md updated if a rule changed

## 8. Open questions
1. `/results` with no params still shows default score 72 / confidence 0.91 (`results/page.tsx`), i.e. a result
   no analysis produced. `?score=`/`?confidence=` are not validated (can be NaN). Fix?
2. `Findings.tsx` shows static zone-based text, not the backend's `findings`/`summary` (never passed along). Intended?
3. Backend CORS is `allow_origins=["*"]` ("Restrict in production"). What is the production frontend origin?
4. Where is the backend deployed (Dockerfile port 8080 hints Cloud Run)? How is `OPENAI_API_KEY` set there?
5. OpenAI receives the image. Is OpenAI's data retention acceptable under the "never stored" claim in the UI?
6. Frontend test framework wanted (e.g. Vitest + Testing Library, or Playwright) to replace the manual checklist?
7. README is stale: says `cd baldguard-ai`, mentions `.env.local` (neither exists) and still shows the removed
   `/api/analyze` route in its architecture diagram and file tree. No `.env.example` either. Update README / add one?
8. `requirements.txt` is unpinned; `numpy` is listed but unused. Pin/remove?
9. `14.02.2026_16.08.41_REC.mp4` (5.6 MB) sits at repo root. Keep in repo?
10. Deploy command for Firebase Hosting is not scripted (no `firebase-tools` in deps). Confirm the deploy steps.
11. Git history (5 commits) has no `.env` file and no `sk-...`/`OPENAI_API_KEY=` match (regex grep only).
    Want a proper secret scanner (e.g. gitleaks) added?
