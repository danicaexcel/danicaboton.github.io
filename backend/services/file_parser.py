from __future__ import annotations

from pathlib import Path


TEXT_EXTENSIONS = {".txt", ".text", ".md", ".csv", ".json", ".html", ".htm", ".xml", ".log"}


def extract_text_from_upload(filename: str, content: bytes) -> dict[str, str]:
    suffix = Path(filename or "").suffix.lower()
    if suffix and suffix not in TEXT_EXTENSIONS:
        return {
            "filename": filename,
            "text": "",
            "warning": "Unsupported binary file type. Upload a text, CSV, JSON, markdown, or HTML file for extraction.",
        }

    for encoding in ("utf-8-sig", "utf-8", "cp1252"):
        try:
            text = content.decode(encoding)
            return {
                "filename": filename,
                "text": text.strip()[:12000],
                "warning": "",
            }
        except UnicodeDecodeError:
            continue

    return {
        "filename": filename,
        "text": "",
        "warning": "Could not decode file as text.",
    }
