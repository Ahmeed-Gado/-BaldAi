from fastapi import FastAPI, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image, UnidentifiedImageError
from starlette.formparsers import MultiPartParser
import io
import logging
from model import AnalysisError, analyze_hair

logger = logging.getLogger(__name__)

MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10 MB, same limit as the frontend
MAX_REQUEST_BYTES = MAX_UPLOAD_BYTES + 64 * 1024  # room for multipart overhead
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png"}
ALLOWED_FORMATS = {"JPEG", "PNG"}

# Starlette spools uploads larger than 1 MB to a temp file on disk.
# Keep every accepted upload in memory: the request cap below guarantees
# no body can exceed this size.
MultiPartParser.spool_max_size = MAX_REQUEST_BYTES

app = FastAPI(
    title="BaldGuard AI Backend",
    description="AI-powered hair thinning detection API",
    version="1.0.0",
)


def error_response(status_code: int, message: str) -> JSONResponse:
    return JSONResponse(status_code=status_code, content={"error": message})


@app.middleware("http")
async def limit_upload_size(request: Request, call_next):
    """Reject oversized /analyze bodies before they are parsed."""
    if request.method == "POST" and request.url.path == "/analyze":
        length = request.headers.get("content-length")
        if length is None:
            return error_response(411, "Content-Length header is required")
        if not length.isdigit() or int(length) > MAX_REQUEST_BYTES:
            return error_response(413, "Image must be under 10MB")
    return await call_next(request)


# Added after the size middleware so CORS is outermost and error responses
# still carry CORS headers.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok", "model": "placeholder_v1"}


def load_image(content: bytes) -> Image.Image | None:
    """Decode bytes in memory. Returns None if not a valid JPEG/PNG."""
    try:
        with Image.open(io.BytesIO(content)) as probe:
            if probe.format not in ALLOWED_FORMATS:
                return None
            probe.verify()
        # verify() leaves the image unusable, so decode a fresh copy
        with Image.open(io.BytesIO(content)) as img:
            return img.convert("RGB")
    except (UnidentifiedImageError, OSError, SyntaxError, ValueError,
            Image.DecompressionBombError) as e:
        logger.warning("Rejected unreadable image: %s", type(e).__name__)
        return None


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
    if image.content_type not in ALLOWED_CONTENT_TYPES:
        return error_response(415, "Only JPG and PNG images are supported")

    # Read at most one byte past the limit so oversized files are detected
    content = await image.read(MAX_UPLOAD_BYTES + 1)
    await image.close()
    if len(content) > MAX_UPLOAD_BYTES:
        return error_response(413, "Image must be under 10MB")

    img = load_image(content)
    if img is None:
        return error_response(400, "File is not a valid JPG or PNG image")

    # Run AI inference
    try:
        result = analyze_hair(img)
    except AnalysisError as e:
        return error_response(e.status_code, "Analysis failed, please try again")

    return result
