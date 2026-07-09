import json
import re
import time
from typing import Any

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate

from models.context_schema import refresh_context_state, validate_context
from services.openai_client import get_chat_model, log_latency


PLANNER_PROMPT = PromptTemplate.from_template(
    """
You are the Planner agent in an orchestrated AI consultant system.

Specialization:
- ONLY design system architecture.
- Use structuredContext as the source of truth for client facts.
- Infer automation recommendations from workflow steps, pain points, tools, volume, and handoffs even when the client did not explicitly name the solution.
- Do not invent hidden client systems, budgets, or policies.
- Do not write the final proposal.
- Return JSON only. No markdown.

Danica portfolio capabilities to recommend from when relevant:
- n8n workflow orchestration and retry-safe automation
- Python and JavaScript custom logic
- OpenAI-powered classification, screening, scoring, summarization, and matching
- Supabase or Zoho CRM for structured candidate/client records
- Google Sheets and Apps Script for lightweight operational systems
- Custom dashboards, REST endpoints, and low-code control panels
- Calendly, notifications, routing, and hiring-manager handoff flows
- Data cleanup, deduplication, status pipelines, and searchable history

Planning rules:
- recommended_stack must be selected from the capabilities above plus any client tools already detected.
- workflow_design must turn the current manual workflow into an improved future-state workflow.
- automation_layers must describe concrete automation components, not generic labels.
- ai_opportunities must include plausible AI uses derived from the pain points, such as screening, matching, deduplication, triage, or summarization.
- For recruitment/high-volume hiring workflows, consider applicant intake, AI screening/scoring, candidate database, dashboard/status pipeline, hiring-manager routing, rehire matching, and follow-up notifications.
- complexity_level must be one of: "Simple", "Medium", "Enterprise".
- Use "Simple" for one workflow, few fields, lightweight dashboard, and limited/no integrations. This usually supports a 1-2 week implementation.
- Use "Medium" for dashboards plus AI logic, database/CRM records, notifications, or 1-3 integrations. This usually supports a 2-4 week implementation.
- Use "Enterprise" for multi-department workflows, complex permissions, migrations, high compliance, many integrations, or broad rollout. This usually supports a 4-8 week implementation.
- Assume Danica leads implementation with assistant support for documentation and selected development tasks; do not overestimate unless project scale justifies it.

structuredContext:
{structured_context}

Return exactly this JSON shape:
{{
  "solution_summary": "",
  "recommended_stack": [],
  "workflow_design": [],
  "automation_layers": [],
  "ai_opportunities": [],
  "complexity_level": "",
  "estimated_impact": ""
}}
"""
)


def _parse_json(text: str) -> dict[str, Any]:
    cleaned = text.strip()
    match = re.search(r"\{.*\}", cleaned, flags=re.DOTALL)
    if match:
        cleaned = match.group(0)
    return json.loads(cleaned)


def create_plan(structured_context: dict[str, Any]) -> dict[str, Any]:
    started_at = time.perf_counter()
    chain = PLANNER_PROMPT | get_chat_model("gpt-5.4-mini", temperature=0.2) | StrOutputParser()
    enriched_context = refresh_context_state(validate_context(structured_context))
    result = chain.invoke({"structured_context": json.dumps(enriched_context, ensure_ascii=False)})
    log_latency("planner", started_at)
    return _parse_json(result)



