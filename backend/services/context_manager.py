from __future__ import annotations

from typing import Any

try:
    from langgraph.checkpoint.memory import InMemorySaver
except Exception:  # pragma: no cover - fallback for minimal installs
    InMemorySaver = None

from models.context_schema import empty_context, merge_context, validate_context


class ContextManager:
    """Small MCP-style internal resource layer for shared agent context."""

    def __init__(self) -> None:
        self.memory = InMemorySaver() if InMemorySaver else None
        self._store: dict[str, dict[str, Any]] = {}

    def _session(self, session_id: str) -> dict[str, Any]:
        if session_id not in self._store:
            self._store[session_id] = {
                "structuredContext": empty_context(),
                "messages": [],
            }
        return self._store[session_id]

    def get_context(self, session_id: str, incoming: dict[str, Any] | None = None) -> dict[str, Any]:
        session = self._session(session_id)
        if incoming:
            session["structuredContext"] = merge_context(session["structuredContext"], incoming)
        return validate_context(session["structuredContext"])

    def update_context(self, session_id: str, update: dict[str, Any]) -> dict[str, Any]:
        session = self._session(session_id)
        session["structuredContext"] = merge_context(session["structuredContext"], update)
        return validate_context(session["structuredContext"])

    def replace_context(self, session_id: str, context: dict[str, Any]) -> dict[str, Any]:
        session = self._session(session_id)
        session["structuredContext"] = validate_context(context)
        return validate_context(session["structuredContext"])

    def append_message(self, session_id: str, role: str, content: str) -> None:
        session = self._session(session_id)
        session["messages"].append({"role": role, "content": content})

    def get_messages(self, session_id: str) -> list[dict[str, str]]:
        return list(self._session(session_id)["messages"])


context_manager = ContextManager()
