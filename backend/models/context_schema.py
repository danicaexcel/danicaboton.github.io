from __future__ import annotations

from copy import deepcopy
from typing import Any


PROCESS_CATEGORIES = ("recruitment", "pre_onboarding", "probation", "other")

DEFAULT_CONTEXT: dict[str, Any] = {
    "industry": "",
    "process_flow": {
        "recruitment": [],
        "pre_onboarding": [],
        "probation": [],
        "other": [],
    },
    "tools_detected": [],
    "pain_points": [],
    "automation_opportunities": [],
    "process_complete": False,
    "confirmed": False,
    "confidence": 0.0,
    "discovery_question_count": 0,
    "conversation_stage": "Idle",
}

INPUT_WORDS = {
    "collect",
    "capture",
    "source",
    "receive",
    "intake",
    "submit",
    "import",
    "upload",
    "lead",
    "applicant",
    "candidate",
    "form",
}
TRANSFORM_WORDS = {
    "screen",
    "review",
    "verify",
    "check",
    "score",
    "filter",
    "validate",
    "match",
    "dedupe",
    "approve",
    "assess",
}
OUTPUT_WORDS = {
    "send",
    "invite",
    "schedule",
    "notify",
    "assign",
    "route",
    "create",
    "update",
    "store",
    "sync",
    "handoff",
    "onboard",
}


def infer_automation_opportunities(structured_context: dict[str, Any]) -> list[str]:
    """Infer serviceable opportunities from workflow symptoms without inventing client facts."""
    context = validate_context(structured_context)
    workflow_text = " ".join(
        step
        for category_steps in context["process_flow"].values()
        for step in category_steps
    )
    source = " ".join(
        [
            context["industry"],
            workflow_text,
            " ".join(context["tools_detected"]),
            " ".join(context["pain_points"]),
        ]
    ).lower()
    opportunities = list(context["automation_opportunities"])

    def add_if(condition: bool, text: str) -> None:
        if condition:
            opportunities.append(text)

    add_if(
        any(word in source for word in ["manual", "screen", "screening", "huge applicant", "applicant volume", "40,000"]),
        "AI-assisted applicant screening and scoring to prioritize qualified candidates",
    )
    add_if(
        any(word in source for word in ["google", "sheet", "monitor", "track", "application monitoring"]),
        "Centralized candidate tracker/dashboard with status visibility and filtering",
    )
    add_if(
        any(word in source for word in ["match", "rehire", "existing data", "database", "candidate history"]),
        "Candidate database with deduplication, rehire matching, and searchable history",
    )
    add_if(
        any(word in source for word in ["endorse", "hiring manager", "qualified", "route", "handoff"]),
        "Automated endorsement routing to hiring managers with notification triggers",
    )
    add_if(
        any(word in source for word in ["job posting", "facebook", "indeed", "linkedin", "source"]),
        "Multi-source applicant intake pipeline from job boards/social channels into one record system",
    )
    add_if(
        any(word in source for word in ["volume", "40,000", "huge", "bulk"]),
        "Bulk triage rules for high-volume applications, exceptions, and follow-up queues",
    )

    if context["pain_points"] and not opportunities:
        opportunities.append("Workflow automation layer to reduce manual coordination and improve operating visibility")

    return as_short_list(opportunities, limit=8)


def apply_inferred_recommendations(structured_context: dict[str, Any]) -> dict[str, Any]:
    context = validate_context(structured_context)
    context["automation_opportunities"] = infer_automation_opportunities(context)
    return context


def empty_context() -> dict[str, Any]:
    return deepcopy(DEFAULT_CONTEXT)


def as_short_list(value: Any, limit: int = 8) -> list[str]:
    if not isinstance(value, list):
        return []
    seen = set()
    items = []
    for item in value:
        text = str(item).strip()
        key = text.lower()
        if text and key not in seen:
            seen.add(key)
            items.append(text)
    return items[:limit]


def validate_context(context: dict[str, Any] | None) -> dict[str, Any]:
    source = context if isinstance(context, dict) else {}
    process_flow = source.get("process_flow") if isinstance(source.get("process_flow"), dict) else {}
    normalized = empty_context()
    normalized["industry"] = str(source.get("industry") or "").strip()
    normalized["process_flow"] = {
        category: as_short_list(process_flow.get(category))
        for category in PROCESS_CATEGORIES
    }
    normalized["tools_detected"] = as_short_list(source.get("tools_detected"))
    normalized["pain_points"] = as_short_list(source.get("pain_points"))
    normalized["automation_opportunities"] = as_short_list(source.get("automation_opportunities"))
    normalized["process_complete"] = bool(source.get("process_complete", False))
    normalized["confirmed"] = bool(source.get("confirmed", False))
    normalized["confidence"] = float(source.get("confidence") or 0.0)
    normalized["discovery_question_count"] = int(source.get("discovery_question_count") or 0)
    normalized["conversation_stage"] = str(source.get("conversation_stage") or "Idle")
    return normalized


def merge_context(base: dict[str, Any], update: dict[str, Any]) -> dict[str, Any]:
    merged = validate_context(base)
    incoming = validate_context(update)

    if incoming["industry"]:
        merged["industry"] = incoming["industry"]
    for category in PROCESS_CATEGORIES:
        merged["process_flow"][category] = as_short_list(
            merged["process_flow"][category] + incoming["process_flow"][category]
        )
    merged["tools_detected"] = as_short_list(merged["tools_detected"] + incoming["tools_detected"])
    merged["pain_points"] = as_short_list(merged["pain_points"] + incoming["pain_points"])
    merged["automation_opportunities"] = as_short_list(
        merged["automation_opportunities"] + incoming["automation_opportunities"]
    )
    merged = apply_inferred_recommendations(merged)
    merged["confirmed"] = merged["confirmed"] or incoming["confirmed"]
    merged["discovery_question_count"] = max(
        merged["discovery_question_count"], incoming["discovery_question_count"]
    )
    merged["process_complete"] = is_process_complete(merged)
    merged["confidence"] = calculate_confidence(merged)
    return merged


def contains_any(text: str, words: set[str]) -> bool:
    return any(word in text for word in words)


def is_process_complete(structured_context: dict[str, Any]) -> bool:
    context = validate_context(structured_context)
    for steps in context["process_flow"].values():
        if len(steps) < 2:
            continue
        joined = " ".join(step.lower() for step in steps)
        if (
            contains_any(joined, INPUT_WORDS)
            and contains_any(joined, TRANSFORM_WORDS)
            and contains_any(joined, OUTPUT_WORDS)
        ):
            return True
    return False


def calculate_confidence(structured_context: dict[str, Any]) -> float:
    context = validate_context(structured_context)
    steps = [
        step
        for category_steps in context["process_flow"].values()
        for step in category_steps
    ]
    score = 0.0
    score += min(len(steps) * 0.12, 0.48)
    score += min(len(context["tools_detected"]) * 0.05, 0.15)
    score += min(len(context["pain_points"]) * 0.06, 0.18)
    score += min(len(context["automation_opportunities"]) * 0.06, 0.12)
    if context["industry"]:
        score += 0.07
    if is_process_complete(context):
        score += 0.18
    return round(min(score, 1.0), 2)


def refresh_context_state(structured_context: dict[str, Any]) -> dict[str, Any]:
    context = apply_inferred_recommendations(structured_context)
    context["process_complete"] = is_process_complete(context)
    context["confidence"] = calculate_confidence(context)
    return context

