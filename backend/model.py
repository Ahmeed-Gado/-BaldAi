"""
BaldGuard AI — OpenAI Vision Module
Uses GPT-4o-mini to analyze scalp images for hair density and health.
"""

import base64
import io
import json
import os
from PIL import Image
from openai import OpenAI
from dotenv import load_dotenv

# Load API key from .env
load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def analyze_hair(img: Image.Image) -> dict:
    """
    Sends the image to OpenAI GPT-4o-mini for visual analysis.
    """
    
    # Check if API Key exists
    if not os.getenv("OPENAI_API_KEY"):
        return {
            "score": 0,
            "zone": "Red",
            "confidence": 0.0,
            "summary": "API Key Missing",
            "findings": ["OpenAI API Key not found in backend/.env file."]
        }

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
        
        return result

    except Exception as e:
        print(f"OpenAI Error: {e}")
        return {
            "score": 50,
            "zone": "Red",
            "confidence": 0.5,
            "summary": "AI Error",
            "findings": [f"Error processing image: {str(e)}"]
        }
