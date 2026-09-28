"""
BaldGuard AI — OpenAI Vision Module
Uses GPT-4o-mini to analyze scalp images for hair density and health.
"""

import base64
import io
import json
import logging
import os
from PIL import Image
from openai import OpenAI
from dotenv import load_dotenv

# Load API key from .env
load_dotenv()

logger = logging.getLogger(__name__)

VALID_ZONES = {"Green", "Yellow", "Red"}


class AnalysisError(Exception):
    """Analysis could not produce a real result. Message is never shown to users."""

    def __init__(self, status_code: int):
        super().__init__(status_code)
        self.status_code = status_code


def _get_client() -> OpenAI:
    # Created per call so a missing key is a handled error, not an import crash
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        logger.error("OPENAI_API_KEY is not set")
        raise AnalysisError(503)
    return OpenAI(api_key=api_key)


def _is_valid_result(result: object) -> bool:
    if not isinstance(result, dict):
        return False
    score = result.get("score")
    confidence = result.get("confidence")
    findings = result.get("findings")
    return (
        isinstance(score, int) and not isinstance(score, bool) and 0 <= score <= 100
        and result.get("zone") in VALID_ZONES
        and isinstance(confidence, (int, float)) and not isinstance(confidence, bool)
        and 0 <= confidence <= 1
        and isinstance(result.get("summary"), str)
        and isinstance(findings, list) and all(isinstance(f, str) for f in findings)
    )


def analyze_hair(img: Image.Image) -> dict:
    """
    Sends the image to OpenAI GPT-4o-mini for visual analysis.
    Raises AnalysisError if no real result can be produced.
    """
    client = _get_client()

    # 1. Convert PIL Image to Base64
    buffered = io.BytesIO()
    img.save(buffered, format="JPEG")
    img_b64 = base64.b64encode(buffered.getvalue()).decode("utf-8")

    # 2. Construct the Prompt
    system_prompt = """
    You are a dermatological AI assistant specialized in hair density analysis.
    Analyze the provided scalp image and return a JSON object with:
    - score: integer (0-100, where 100 is perfect density)
    - zone: string ("Green", "Yellow", or "Red")
    - confidence: float (0.00-1.00)
    - summary: string (1 sentence overview)
    - findings: list of strings (3 bullet points)

    Strictly output ONLY valid JSON.
    """

    user_prompt = "Analyze this scalp image for hair thinning and density."

    try:
        # 3. Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": [
                    {"type": "text", "text": user_prompt},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_b64}"}}
                ]}
            ],
            response_format={"type": "json_object"},
            max_tokens=300
        )

        # 4. Parse Response
        content = response.choices[0].message.content
        result = json.loads(content)

    except Exception as e:
        # Type only: exception text can echo request data or credentials
        logger.error("OpenAI analysis failed: %s", type(e).__name__)
        raise AnalysisError(502) from None

    if not _is_valid_result(result):
        logger.error("OpenAI returned an invalid result shape")
        raise AnalysisError(502)

    return result
