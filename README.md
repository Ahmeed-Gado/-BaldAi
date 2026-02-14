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
- **AI Chat Assistant** — Context-aware responses based on analysis results, suggestion chips
- **Privacy-First** — Images processed in memory, never stored, no sign-up required
- **Responsive** — Beautiful on desktop and mobile

## 🏗️ Architecture

```
[Browser]
   │
   │  POST image (multipart/form-data)
   ▼
[Next.js API Route]  /api/analyze
   │
   │  Forward to AI backend
   ▼
[FastAPI Backend]  /analyze
   │
   │  PyTorch / CNN inference
   ▼
[JSON Result]  → score, zone, confidence, findings
```

## 🚀 Quick Start

### Frontend (Next.js)

```bash
cd baldguard-ai
npm install
npm run dev
# → http://localhost:3000
```

### Backend (FastAPI) — Optional

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

> **Note:** The frontend works without the backend — it falls back to demo results automatically.

## 📁 Project Structure

```
baldguard-ai/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout + fonts + SEO
│   │   ├── globals.css         # Design system (animations, glass, reveals)
│   │   ├── page.tsx            # Landing page
│   │   ├── scan/page.tsx       # Upload + scan flow
│   │   ├── results/page.tsx    # Dashboard + AI chat
│   │   └── api/analyze/route.ts # API proxy → FastAPI backend
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
│       ├── ChatPanel.tsx       # AI chat assistant
│       └── useRevealOnScroll.ts # Scroll reveal hook
├── backend/
│   ├── main.py                 # FastAPI server
│   ├── model.py                # AI model (placeholder)
│   └── requirements.txt       # Python dependencies
└── .env.local                 # Backend URL config
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

Replace `backend/model.py` with your real inference:

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
    return {"score": ..., "zone": ..., "confidence": ...}
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
