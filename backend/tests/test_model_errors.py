import json
import logging
import os
import subprocess
import sys
from pathlib import Path

import httpx
import openai
import pytest
from fastapi.testclient import TestClient

import main
import model
from conftest import FAKE_RESULT, image_bytes, upload

GENERIC = {"error": "Analysis failed, please try again"}
SECRET = "sk-test-SECRET123"


def fake_openai(behavior):
    """Stand-in for openai.OpenAI; behavior() returns content or raises."""

    class Message:
        def __init__(self, content):
            self.content = content

    class Choice:
        def __init__(self, content):
            self.message = Message(content)

    class Completions:
        def create(self, **kwargs):
            return type("Resp", (), {"choices": [Choice(behavior())]})()

    class Client:
        def __init__(self, api_key):
            self.chat = type("Chat", (), {"completions": Completions()})()

    return Client


@pytest.fixture
def real_client():
    """Client that runs the real analyze_hair (OpenAI itself is faked per test)."""
    return TestClient(main.app)


def post_jpeg(client):
    return upload(client, image_bytes("JPEG"), "image/jpeg")


def assert_no_leak(res, caplog):
    for text in (res.text, caplog.text):
        assert SECRET not in text
        assert "data:image" not in text
        assert "Traceback" not in text


# --- accepted -------------------------------------------------------------

def test_valid_openai_result_is_returned(real_client, monkeypatch):
    monkeypatch.setattr(model, "OpenAI", fake_openai(lambda: json.dumps(FAKE_RESULT)))
    res = post_jpeg(real_client)
    assert res.status_code == 200
    assert res.json() == FAKE_RESULT


# --- rejected -------------------------------------------------------------

def test_missing_api_key_returns_generic_503(real_client, monkeypatch, caplog):
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    res = post_jpeg(real_client)
    assert res.status_code == 503
    assert res.json() == GENERIC
    assert "OPENAI" not in res.text and ".env" not in res.text


def test_openai_exception_text_never_leaks(real_client, monkeypatch, caplog):
    def boom():
        raise Exception(f"Incorrect API key provided: {SECRET}")

    monkeypatch.setattr(model, "OpenAI", fake_openai(boom))
    with caplog.at_level(logging.DEBUG):
        res = post_jpeg(real_client)
    assert res.status_code == 502
    assert res.json() == GENERIC
    assert_no_leak(res, caplog)
    assert "OpenAI analysis failed: Exception" in caplog.text


def test_openai_sdk_error_logs_type_only(real_client, monkeypatch, caplog):
    def boom():
        raise openai.APIConnectionError(
            message=f"connection failed {SECRET}",
            request=httpx.Request("POST", "https://api.openai.com"),
        )

    monkeypatch.setattr(model, "OpenAI", fake_openai(boom))
    with caplog.at_level(logging.DEBUG):
        res = post_jpeg(real_client)
    assert res.status_code == 502
    assert res.json() == GENERIC
    assert_no_leak(res, caplog)
    assert "APIConnectionError" in caplog.text


def test_non_json_reply_is_rejected(real_client, monkeypatch):
    monkeypatch.setattr(model, "OpenAI", fake_openai(lambda: "not json at all"))
    res = post_jpeg(real_client)
    assert res.status_code == 502
    assert res.json() == GENERIC


@pytest.mark.parametrize("bad", [
    {**FAKE_RESULT, "score": 150},
    {**FAKE_RESULT, "score": "70"},
    {**FAKE_RESULT, "zone": "<script>alert(1)</script>"},
    {**FAKE_RESULT, "confidence": 2},
    {k: v for k, v in FAKE_RESULT.items() if k != "findings"},
    ["not", "a", "dict"],
])
def test_badly_shaped_reply_is_rejected(real_client, monkeypatch, bad):
    monkeypatch.setattr(model, "OpenAI", fake_openai(lambda: json.dumps(bad)))
    res = post_jpeg(real_client)
    assert res.status_code == 502
    assert res.json() == GENERIC


def test_backend_imports_without_api_key():
    env = {k: v for k, v in os.environ.items() if k != "OPENAI_API_KEY"}
    backend = Path(__file__).resolve().parent.parent
    proc = subprocess.run(
        [sys.executable, "-c", "import main"],
        cwd=backend, env=env, capture_output=True, text=True,
    )
    assert proc.returncode == 0, proc.stderr
