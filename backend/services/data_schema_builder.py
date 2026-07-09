from __future__ import annotations

import re
from typing import Any

from models.context_schema import validate_context


def _field_key(label: str) -> str:
    key = re.sub(r"[^a-z0-9]+", "_", label.strip().lower()).strip("_")
    return key or "field"


def _normalize_user_fields(fields: Any) -> list[dict[str, str]]:
    if not isinstance(fields, list):
        return []
    normalized = []
    for field in fields:
        if isinstance(field, dict):
            label = str(field.get("label") or field.get("name") or field.get("key") or "").strip()
            key = str(field.get("key") or _field_key(label)).strip()
        else:
            label = str(field).strip()
            key = _field_key(label)
        if label:
            normalized.append({"key": key, "label": label})
    return normalized


def _has_any(text: str, words: list[str]) -> bool:
    lowered = text.lower()
    return any(word in lowered for word in words)


def build_data_schema(structured_context: dict[str, Any], conversation: str = "") -> dict[str, Any]:
    context = validate_context(structured_context)
    explicit = structured_context.get("data_schema", {}).get("fields") if isinstance(structured_context, dict) else None
    user_fields = _normalize_user_fields(explicit or structured_context.get("fields") if isinstance(structured_context, dict) else None)
    if user_fields:
        return {"fields": user_fields, "source": "user_defined"}

    workflow_text = " ".join(
        step
        for category_steps in context["process_flow"].values()
        for step in category_steps
    )
    combined = " ".join(
        [
            workflow_text,
            " ".join(context["tools_detected"]),
            conversation,
        ]
    )

    fields: list[str]
    if _has_any(combined, ["applicant", "candidate", "resume", "interview", "caregiver", "recruit"]):
        fields = ["Full Name", "Email", "Position", "Source", "Status", "Interview Date"]
    elif _has_any(combined, ["order", "shipment", "delivery", "logistics", "tracking"]):
        fields = ["Record ID", "Customer", "Service Type", "Status", "Assigned Team", "Updated At"]
    elif _has_any(combined, ["ticket", "request", "support", "issue"]):
        fields = ["Ticket ID", "Requester", "Category", "Priority", "Status", "Owner"]
    elif _has_any(combined, ["project", "task", "milestone", "deadline"]):
        fields = ["Task ID", "Project", "Owner", "Status", "Due Date", "Last Update"]
    else:
        fields = ["Record ID", "Name", "Source", "Status", "Owner", "Last Update"]

    return {
        "fields": [{"key": _field_key(label), "label": label} for label in fields],
        "source": "inferred",
    }
