# 🛡️ BaldGuard AI

**AI-powered early hair thinning detection** — a full-stack portfolio project demonstrating applied AI engineering, premium UI/UX, and production-aware system design.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-blue?logo=tailwindcss)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-green?logo=fastapi)

---

## ✨ Features

- **Animated Landing Page** — Gradient shifts, floating glassmorphism shapes, scroll-reveal animations
- **Image Upload** — Client-side validation, drag & drop, preview with clear guidance
- **Cinematic AI Scan** — Scanline animation, shimmer effects, corner markers, progress phases
- **Results Dashboard** — Conic-gradient score gauge, zone-based glow, key findings list
- **Hair Health Assistant (demo)** — Scripted guidance tailored to your result zone, suggestion chips
- **Privacy-First** — Images processed in memory, never stored, no sign-up required
- **Responsive** — Beautiful on desktop and mobile

## 🏗️ Architecture

```
[Browser]  (static Next.js export on Firebase Hosting)
   │
   │  POST image (multipart/form-data) → NEXT_PUBLIC_AI_BACKEND_URL
   ▼
[FastAPI Backend]  /analyze
   │
   │  Validate (JPEG/PNG, ≤ 10 MB) → OpenAI GPT-4o-mini vision (in memory, never stored)
   ▼
[JSON Result]  → score, zone, confidence, summary, findings
```

## 🚀 Quick Start

### Frontend (Next.js)

```bash
git clone https://github.com/Ahmeed-Gado/-BaldAi.git
cd ./-BaldAi
npm install
npm run dev
```

Live site: https://early-baldness-detector.web.app/

The frontend calls `NEXT_PUBLIC_AI_BACKEND_URL` (default `http://localhost:8000/analyze`).
To point it elsewhere, create a gitignored `.env.local` in the repo root with that variable.

### Backend (FastAPI) — Required

Create `backend/.env` with `OPENAI_API_KEY=<your key>` (gitignored — never commit it), then:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

> **Note:** Without a running backend the scan shows an error with a "Try again" button — no results are shown
> that the analysis did not produce.

### Backend tests

```bash
cd backend
pip install -r requirements-dev.txt
python -m pytest
```

Tests use a fake OpenAI client and never call the real API.

## 📁 Project Structure

```
-BaldAi/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout + fonts + SEO
│   │   ├── globals.css         # Design system (animations, glass, reveals)
│   │   ├── page.tsx            # Landing page
│   │   ├── scan/page.tsx       # Upload + scan flow (calls the backend directly)
│   │   └── results/page.tsx    # Dashboard + demo chat
│   └── components/
│       ├── Header.tsx          # Fixed glass header + nav
│       ├── Hero.tsx            # Animated hero section
│       ├── Stats.tsx           # Metric cards (4-col)
│       ├── HowItWorks.tsx      # 3-step process
│       ├── Science.tsx         # AI methodology cards
│       ├── Privacy.tsx         # Privacy guarantees
│       ├── CTA.tsx             # Bottom call-to-action
│       ├── Footer.tsx          # Footer + disclaimer
│       ├── UploadCard.tsx      # Image upload UI
│       ├── ScanAnimation.tsx   # Cinematic scan animation
│       ├── ScoreGauge.tsx      # Conic score gauge
│       ├── Findings.tsx        # Key findings list
│       ├── ChatPanel.tsx       # Scripted demo chat
│       └── useRevealOnScroll.ts # Scroll reveal hook
└── backend/
    ├── main.py                 # FastAPI server + upload validation
    ├── model.py                # OpenAI GPT-4o-mini vision analysis
    ├── requirements.txt        # Python dependencies
    ├── requirements-dev.txt    # + pytest, httpx
    ├── pytest.ini              # Test config
    ├── tests/                  # pytest suite
    └── Dockerfile              # Container (uvicorn on port 8080)
```

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#030303` |
| Glass | `rgba(255,255,255,0.04)` + `blur(16px)` |
| Primary | Indigo-600 (`#4F46E5`) |
| Gradient | Indigo → Rose → Amber |
| Font | Inter (300–900) |
| Spacing | 8px system |
| Border radius | 16px (cards), 24px (sections) |
| Animations | 60fps CSS keyframes |

## 🔌 Connecting Real AI

`backend/model.py` currently calls OpenAI GPT-4o-mini. To use your own model instead, replace
`analyze_hair` — keep the same return shape, and raise `AnalysisError` on failure so users get a
generic error instead of a made-up result:

```python
import torch
from torchvision import models, transforms

model = models.resnet50(pretrained=True)
# Fine-tune on dermatological dataset...

def analyze_hair(img):
    tensor = transform(img).unsqueeze(0)
    with torch.no_grad():
        output = model(tensor)
    # Post-process...
    return {"score": ..., "zone": ..., "confidence": ..., "summary": ..., "findings": [...]}
```

Compatible with:
- PyTorch / TorchServe
- NVIDIA Triton Inference Server
- TensorRT optimized models
- Custom CUDA pipelines

## ⚖️ Disclaimer

> This AI analysis is informational only and does not replace professional medical advice.
> Consult a dermatologist for clinical diagnoses.

## 📄 License

MIT

---

**Built as a portfolio-grade AI product prototype** demonstrating full-stack AI engineering, UI/UX excellence, and responsible AI design.
