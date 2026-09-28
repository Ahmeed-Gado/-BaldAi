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
  - `src/app/api/analyze/route.ts` Next API proxy (see Open questions, likely unused)
  - `src/components/*` UI; `src/app/globals.css` design tokens/animations
- **Backend** (`backend/`): FastAPI + Pillow + `openai` + `python-dotenv`. `main.py` (routes),
  `model.py` (`analyze_hair(img)` → OpenAI call), `requirements.txt` (unpinned), `Dockerfile`
  (python:3.11-slim, uvicorn on port 8080).
- **How they talk**
  - `scan/page.tsx` POSTs `multipart/form-data` field `image` **directly** to
    `NEXT_PUBLIC_AI_BACKEND_URL` (default `http://localhost:8000/analyze`).
  - Backend routes: `GET /health` → `{status, model}`; `POST /analyze` (field `image`) →
    `{score, zone, confidence, summary, findings[]}`.
  - Scan page then navigates to `/results?score=&zone=&confidence=` (numbers/strings only, never image data).
  - Env vars: `OPENAI_API_KEY` (backend, via `backend/.env`), `NEXT_PUBLIC_AI_BACKEND_URL` (frontend, public),
    `AI_BACKEND_URL` (used only by `route.ts`).

## 3. Commands
Frontend (from repo root, from `package.json`):
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build` (static export → `out/`)
- Start: `npm run start`
- Lint: `npm run lint` (ESLint 9, `eslint-config-next` core-web-vitals + typescript)
- Test: **none configured.** No test script, no test framework.

Backend (from `backend/`, from README + Dockerfile):
- Install: `pip install -r requirements.txt`
- Dev: `uvicorn main:app --reload --port 8000`
- Container: Dockerfile runs `uvicorn main:app --host 0.0.0.0 --port 8080`
- Lint/test: **none configured.** No pytest, ruff, black or mypy config exists.

## 4. Hard rules (non-negotiable)
**Privacy — images never persist.**
- Uploaded images live in memory only (`await image.read()` → `io.BytesIO` → PIL → base64 → OpenAI), then are discarded.
- Forbidden: writing image bytes/base64 to disk, temp files, DB, cache, cloud storage, logs, error messages,
  analytics, URLs/query strings, `localStorage`/`sessionStorage`/IndexedDB. No `img.save(<path>)`, no `tempfile`,
  no `UploadFile` spooling to disk beyond what FastAPI does internally.
- Frontend preview uses `URL.createObjectURL` + `revokeObjectURL`; keep it that way.
- Any change that could persist an image is rejected, even for debugging.

**Secrets.**
- `OPENAI_API_KEY` lives only in backend env (`backend/.env` locally, env vars in deploy). Never in frontend code,
  never in any `NEXT_PUBLIC_*` var (those ship to the browser), never in responses, never logged, never committed.
- `.env`, `.env.local`, `*.env` stay in `.gitignore`. Do not weaken those entries.

**Upload validation on the backend.**
- `/analyze` must reject non-JPEG/PNG and files > 10 MB (matching frontend limits) with a 4xx and a generic
  message, before calling PIL or OpenAI. Frontend checks (`UploadCard.tsx`, `route.ts`) are UX only.
- Currently NOT enforced in `backend/main.py` — fixing this is a priority.

**Error handling.**
- Never return stack traces, API keys, raw exception text or raw OpenAI errors to the client.
  Return a generic message + status code; log a sanitized error server-side (no image data, no key).
- Currently violated: `model.py` puts `str(e)` in `findings` and `print`s the raw OpenAI error;
  `main.py` has no try/except around `Image.open`. Do not copy these patterns.

## 5. Workflow rules for Claude
- Before editing: state the plan and the exact files you will touch. Wait if the change touches Section 4.
- Small steps: one feature or fix per step. No drive-by refactors.
- Every change needs a test. No test setup exists yet, so until one is added provide a manual test checklist.
  For every "allowed" case also test the "rejected" case, at minimum:
  - valid JPG and PNG → 200 with `{score, zone, confidence, summary, findings}`
  - wrong type (e.g. `.gif`, `.txt` renamed `.jpg`) → 4xx, generic message
  - file > 10 MB → 4xx, generic message
  - missing `image` field → 4xx
  - `OPENAI_API_KEY` unset → safe generic error, no key text leaked
  - OpenAI failure → generic error, no raw error in response
  - after each: confirm no new files on disk and no image data in logs
- Never mark a task done until it has been tested (run it, or walk the checklist and report results).
- Run `npm run lint` and `npm run build` after frontend changes.
- If a rule here changes, update this file in the same step.

## 6. Coding conventions (as the code does today)
- TypeScript strict; import via `@/*` alias (→ `src/*`).
- Components: one per file in `src/components/`, PascalCase filename, `export default function Name`.
  Hooks: `useX.ts`, named export (`useRevealOnScroll`).
- Props typed with a local `type Props = { ... }` or inline object type. Zone type is
  `"Green" | "Yellow" | "Red"` (currently duplicated in `results/page.tsx`, `Findings.tsx`, `ChatPanel.tsx`).
- Client components start with `"use client";`.
- Styling: Tailwind utility classes + custom classes from `globals.css` (`glass`, `btn-primary`, `btn-glass`,
  `animate-*`). Icons: Material Symbols (`<span className="material-symbols-outlined">`).
- Formatting: double quotes, semicolons. Indent is mixed (4 spaces in `src/app/scan`, `results`, `api`,
  most components; 2 spaces in `layout.tsx`, `page.tsx`). Match the file you edit. No Prettier config.
- Python: snake_case, module docstrings, type hints on public functions (`analyze_hair(img: Image.Image) -> dict`).
  No formatter configured.

## 7. Definition of done
- [ ] Plan + files stated before editing
- [ ] Change is one focused feature/fix
- [ ] No path writes/logs/stores image data
- [ ] No secret in frontend, logs, responses or commits; `.env` still ignored
- [ ] Backend validates type + size for any upload path touched
- [ ] Errors to client are generic (no traces, keys, raw OpenAI text)
- [ ] Tests or manual checklist run, including rejected cases; results reported
- [ ] `npm run lint` and `npm run build` pass (frontend changes)
- [ ] Backend starts with `uvicorn main:app --reload --port 8000` (backend changes)
- [ ] CLAUDE.md updated if a rule changed

## 8. Open questions
1. `route.ts` is a POST route handler but `next.config.ts` uses `output: 'export'`; the scan page bypasses it and
   calls the backend directly. Is `/api/analyze` dead code? Does `npm run build` even succeed with it?
2. Both the scan page and `route.ts` silently return **random demo results** when the backend fails.
   Intended for production, or should users see a real error?
3. Backend CORS is `allow_origins=["*"]` ("Restrict in production"). What is the production frontend origin?
4. Where is the backend deployed (Dockerfile port 8080 hints Cloud Run)? How is `OPENAI_API_KEY` set there?
5. OpenAI receives the image. Is OpenAI's data retention acceptable under the "never stored" claim in the UI?
6. `ChatPanel.tsx` renders AI text with `dangerouslySetInnerHTML`, and the greeting interpolates `zone`, which
   comes unvalidated from `?zone=` in the URL → possible XSS. Fix wanted?
7. Is a test framework wanted (e.g. pytest + FastAPI TestClient; Vitest/Playwright for frontend)?
8. README says `cd baldguard-ai` and mentions `.env.local`; neither exists. No `.env.example` either. Add one?
9. `requirements.txt` is unpinned; `numpy` is listed but unused. Pin/remove?
10. `14.02.2026_16.08.41_REC.mp4` (5.6 MB) sits at repo root. Keep in repo?
11. Deploy command for Firebase Hosting is not scripted (no `firebase-tools` in deps). Confirm the deploy steps.
12. Git history (5 commits) has no `.env` file and no `sk-...`/`OPENAI_API_KEY=` match (regex grep only).
    Want a proper secret scanner (e.g. gitleaks) added?
