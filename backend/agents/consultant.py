from __future__ import annotations

from typing import Any

from agents.extractor import extract_context
from agents.planner import create_plan
from agents.tools import completeness_tool, next_discovery_question_tool, process_summary_tool
from models.context_schema import merge_context, refresh_context_state
from services.context_manager import context_manager


CONFIRMATION_WORDS = {
    "yes",
    "correct",
    "accurate",
    "looks good",
    "that's right",
    "that is right",
    "proceed",
    "continue",
    "go ahead",
    "option c",
    "c)",
    "solution design",
}
ADD_PROCESS_WORDS = {"option a", "a)", "add another process", "another process", "add process"}
REFINE_WORDS = {"option b", "b)", "refine", "change step", "edit step", "fix step"}


def _has_intent(message: str, words: set[str]) -> bool:
    text = message.strip().lower()
    return any(word in text for word in words)


def _has_context(structured_context: dict[str, Any]) -> bool:
    if structured_context.get("industry"):
        return True
    if structured_context.get("tools_detected"):
        return True
    return any(structured_context["process_flow"][category] for category in structured_context["process_flow"])


def consultant_chat(
    message: str,
    structured_context: dict[str, Any] | None = None,
    session_id: str = "default",
    file_text: str | None = None,
) -> dict[str, Any]:
    """Controlled consultant turn. No loops: extractor runs at most once per call."""
    current = context_manager.get_context(session_id, structured_context)
    combined_message = "\n\n".join(part for part in (message, file_text or "") if part.strip())
    context_manager.append_message(session_id, "user", combined_message)

    if _has_intent(message, ADD_PROCESS_WORDS):
        current["confirmed"] = False
        current["conversation_stage"] = "Discovery"
        current = context_manager.replace_context(session_id, current)
        reply = "Which additional process should we map next, and what is the first step?"
        context_manager.append_message(session_id, "assistant", reply)
        return {
            **current,
            "conversation_stage": "Discovery",
            "consultant_reply": reply,
            "messages": context_manager.get_messages(session_id),
        }

    if _has_intent(message, REFINE_WORDS):
        current["confirmed"] = False
        current["conversation_stage"] = "Analysis"
        current = context_manager.replace_context(session_id, current)
        reply = "Which step should we refine, and what should it say instead?"
        context_manager.append_message(session_id, "assistant", reply)
        return {
            **current,
            "conversation_stage": "Analysis",
            "consultant_reply": reply,
            "messages": context_manager.get_messages(session_id),
        }

    if (current["process_complete"] or current["confidence"] > 0.6) and _has_intent(message, CONFIRMATION_WORDS):
        current["confirmed"] = True
        current["conversation_stage"] = "Solution"
        current = context_manager.replace_context(session_id, current)
        plan = create_plan(current)
        reply = (
            "Great. The workflow is confirmed, so we can move into solution design. "
            "I prepared the structured solution plan. Click Generate Proposal when you want Dee to write the client-ready proposal."
        )
        context_manager.append_message(session_id, "assistant", reply)
        return {
            **current,
            "conversation_stage": "Solution",
            "consultant_reply": reply,
            "solution_plan": plan,
            "messages": context_manager.get_messages(session_id),
        }

    if combined_message.strip():
        extracted = extract_context(current, combined_message)
        current = context_manager.update_context(session_id, merge_context(current, extracted))

    current = refresh_context_state(current)
    quality = completeness_tool(current)
    current["process_complete"] = quality["process_complete"]
    current["confidence"] = quality["confidence"]

    if not _has_context(current):
        current["conversation_stage"] = "Idle"
        reply = "What business process should we map first, and where does it start?"
    elif current["confirmed"]:
        current["conversation_stage"] = "Solution"
        reply = "The workflow is confirmed. Click Generate Proposal when you want the full proposal."
    else:
        force_summary = current["discovery_question_count"] >= 3
        should_confirm = current["process_complete"] or current["confidence"] > 0.6 or force_summary
        if should_confirm:
            current["conversation_stage"] = "Confirmation"
            reply = process_summary_tool(current, partial=force_summary and not current["process_complete"])["summary"]
        else:
            current["conversation_stage"] = "Discovery"
            current["discovery_question_count"] += 1
            reply = next_discovery_question_tool(current)["question"]

    current = context_manager.replace_context(session_id, current)
    context_manager.append_message(session_id, "assistant", reply)
    return {
        **current,
        "consultant_reply": reply,
        "messages": context_manager.get_messages(session_id),
    }
