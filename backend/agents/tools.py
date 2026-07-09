from __future__ import annotations

from typing import Any

from models.context_schema import calculate_confidence, is_process_complete, refresh_context_state


def completeness_tool(structured_context: dict[str, Any]) -> dict[str, Any]:
    context = refresh_context_state(structured_context)
    return {
        "process_complete": context["process_complete"],
        "confidence": context["confidence"],
    }


def process_summary_tool(structured_context: dict[str, Any], partial: bool = False) -> dict[str, str]:
    context = refresh_context_state(structured_context)
    lines = [
        "Here is how I understand your workflow so far:"
        if partial
        else "Here is how I understand your workflow:"
    ]
    labels = {
        "recruitment": "Recruitment",
        "pre_onboarding": "Pre-Onboarding",
        "probation": "Probation",
        "other": "Other",
    }
    for category, label in labels.items():
        steps = context["process_flow"][category]
        if not steps:
            continue
        lines.append("")
        lines.append(f"{label}:")
        for index, step in enumerate(steps, start=1):
            lines.append(f"{index}. {step}")

    if context["tools_detected"]:
        lines.append("")
        lines.append("Tools detected: " + ", ".join(context["tools_detected"]))

    if context["automation_opportunities"]:
        lines.append("")
        lines.append("Potential automation opportunities:")
        for index, opportunity in enumerate(context["automation_opportunities"], start=1):
            lines.append(f"{index}. {opportunity}")

    lines.append("")
    lines.append("Does this look accurate?")
    lines.append("")
    lines.append("A) Add another process")
    lines.append("B) Refine an existing step")
    lines.append("C) Proceed to solution design")
    return {"summary": "\n".join(lines)}


def next_discovery_question_tool(structured_context: dict[str, Any]) -> dict[str, str]:
    context = refresh_context_state(structured_context)
    steps = [
        step
        for category_steps in context["process_flow"].values()
        for step in category_steps
    ]
    if not steps:
        question = "What process should we map first, and where does it start?"
    elif len(steps) == 1:
        question = "After that first step, what happens next and who handles it?"
    else:
        question = "What is the final output of this process, and which tool or person receives it?"
    return {"question": question}


def context_quality_tool(structured_context: dict[str, Any]) -> dict[str, Any]:
    return {
        "is_process_complete": is_process_complete(structured_context),
        "confidence": calculate_confidence(structured_context),
    }

