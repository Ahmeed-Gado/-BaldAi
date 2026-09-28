import io
import os

import pytest
from PIL import Image

# Never let tests reach OpenAI with a real key from the shell or backend/.env.
os.environ["OPENAI_API_KEY"] = "test-dummy-key"

from fastapi.testclient import TestClient  # noqa: E402

import main  # noqa: E402

FAKE_RESULT = {
    "score": 70,
    "zone": "Yellow",
    "confidence": 0.9,
    "summary": "Test summary",
    "findings": ["a", "b", "c"],
}


def image_bytes(fmt: str, size: tuple[int, int] = (64, 64)) -> bytes:
    buf = io.BytesIO()
    Image.new("RGB", size, (120, 80, 60)).save(buf, format=fmt)
    return buf.getvalue()


@pytest.fixture
def client(monkeypatch):
    """Client with the OpenAI call replaced by a canned result."""
    monkeypatch.setattr(main, "analyze_hair", lambda img: dict(FAKE_RESULT))
    return TestClient(main.app)


def upload(client, content: bytes, content_type: str, filename: str = "scalp.jpg"):
    return client.post(
        "/analyze", files={"image": (filename, content, content_type)}
    )
