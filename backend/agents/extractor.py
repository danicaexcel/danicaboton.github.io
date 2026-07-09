import json
import re
import time
from typing import Any

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate

from models.context_schema import validate_context
from services.openai_client import get_chat_model, log_latency


EXTRACTOR_PROMPT = PromptTemplate.from_template(
    """
You are the Extractor agent in an orchestrated AI consultant system.

Specialization:
- ONLY extract structured workflow data.
- NEVER explain, summarize, recommend, or ask questions.
- Preserve existing data unless the latest message clearly corrects it.
- Keep entries short.
- Do not invent workflows.
- Return strict JSON only. No markdown.

Existing structuredContext:
{structured_context}

Latest message or file text:
{message}

Return exactly this JSON shape:
{{
  "industry": "",
  "process_flow": {{
    "recruitment": [],
    "pre_onboarding": [],
    "probation": [],
    "other": []
  }},
  "tools_detected": [],
  "pain_points": [],
  "automation_opportunities": [],
  "process_complete": false,
  "confirmed": false,
  "confidence": 0.0
}}
"""
)


def _parse_json(text: str) -> dict[str, Any]:
    cleaned = text.strip()
    match = re.search(r"\{.*\}", cleaned, flags=re.DOTALL)
    if match:
        cleaned = match.group(0)
    return json.loads(cleaned)


def extract_context(structured_context: dict[str, Any], message: str) -> dict[str, Any]:
    started_at = time.perf_counter()
    chain = EXTRACTOR_PROMPT | get_chat_model("gpt-5.4-nano", temperature=0) | StrOutputParser()
    result = chain.invoke(
        {
            "structured_context": json.dumps(validate_context(structured_context), ensure_ascii=False),
            "message": message,
        }
    )
    log_latency("extractor", started_at)
    return validate_context(_parse_json(result))
