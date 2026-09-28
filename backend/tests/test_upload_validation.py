import os
import tempfile

from starlette.formparsers import MultiPartParser

import main
from conftest import FAKE_RESULT, image_bytes, upload


# --- accepted -------------------------------------------------------------

def test_valid_jpeg_is_accepted(client):
    res = upload(client, image_bytes("JPEG"), "image/jpeg")
    assert res.status_code == 200
    assert res.json() == FAKE_RESULT


def test_valid_png_is_accepted(client):
    res = upload(client, image_bytes("PNG"), "image/png", "scalp.png")
    assert res.status_code == 200
    assert res.json() == FAKE_RESULT


# --- rejected: type ---------------------------------------------------------

def test_wrong_declared_type_is_rejected(client):
    res = upload(client, image_bytes("GIF"), "image/gif", "scalp.gif")
    assert res.status_code == 415
    assert res.json() == {"error": "Only JPG and PNG images are supported"}


def test_gif_disguised_as_jpeg_is_rejected(client):
    res = upload(client, image_bytes("GIF"), "image/jpeg")
    assert res.status_code == 400
    assert res.json() == {"error": "File is not a valid JPG or PNG image"}


def test_text_file_renamed_to_jpg_is_rejected(client):
    res = upload(client, b"just some text, not an image", "image/jpeg")
    assert res.status_code == 400
    assert res.json() == {"error": "File is not a valid JPG or PNG image"}


def test_truncated_jpeg_is_rejected(client):
    data = image_bytes("JPEG", (256, 256))
    res = upload(client, data[: len(data) // 2], "image/jpeg")
    assert res.status_code == 400
    assert res.json() == {"error": "File is not a valid JPG or PNG image"}


def test_missing_image_field_is_rejected(client):
    res = client.post("/analyze", data={"other": "x"})
    assert res.status_code == 422


# --- rejected: size ---------------------------------------------------------

def test_file_just_over_limit_is_rejected(client):
    res = upload(client, b"\0" * (main.MAX_UPLOAD_BYTES + 1), "image/jpeg")
    assert res.status_code == 413
    assert res.json() == {"error": "Image must be under 10MB"}


def test_request_over_cap_is_rejected_before_parsing(client):
    res = upload(client, b"\0" * (main.MAX_REQUEST_BYTES + 1), "image/jpeg")
    assert res.status_code == 413
    assert res.json() == {"error": "Image must be under 10MB"}


def test_missing_content_length_is_rejected(client):
    def chunks():
        yield b"--x\r\n"

    res = client.post(
        "/analyze",
        content=chunks(),
        headers={"content-type": "multipart/form-data; boundary=x"},
    )
    assert res.status_code == 411


# --- privacy: nothing written to disk --------------------------------------

def test_spool_limit_covers_every_allowed_request():
    assert MultiPartParser.spool_max_size >= main.MAX_REQUEST_BYTES


def test_large_upload_never_rolls_over_to_disk(client, monkeypatch):
    rolled = []
    original = tempfile.SpooledTemporaryFile.rollover

    def spy(self):
        rolled.append(True)
        return original(self)

    monkeypatch.setattr(tempfile.SpooledTemporaryFile, "rollover", spy)
    upload(client, os.urandom(9 * 1024 * 1024), "image/jpeg")
    assert rolled == []
