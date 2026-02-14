from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
from model import analyze_hair

app = FastAPI(
    title="BaldGuard AI Backend",
    description="AI-powered hair thinning detection API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok", "model": "placeholder_v1"}


@app.post("/analyze")
async def analyze(image: UploadFile = File(...)):
    """
    Accepts a scalp image and returns AI analysis results.

    Returns:
        - score (int): Hair health score 0-100
        - zone (str): Green / Yellow / Red
        - confidence (float): Model confidence 0-1
        - summary (str): Human-readable summary
        - findings (list[str]): Key findings
    """
    # Read and validate image
    content = await image.read()
    img = Image.open(io.BytesIO(content)).convert("RGB")

    # Run AI inference
    result = analyze_hair(img)

    return result
