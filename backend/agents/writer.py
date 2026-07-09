import html
import time
from typing import Any

from models.context_schema import validate_context
from services.data_schema_builder import build_data_schema
from services.openai_client import log_latency


ARCHITECTURE_LAYER_LABELS = {
    "intake": ["intake", "capture", "lead", "form", "upload", "source"],
    "processing": ["process", "workflow", "routing", "validation", "screen", "sync", "automation"],
    "ai": ["ai", "screening", "scoring", "classification", "summarization"],
    "database": ["database", "crm", "zoho", "supabase", "store", "record"],
    "communication": ["email", "sms", "message", "notification", "invite", "communication", "outreach"],
}


def _esc(value: Any) -> str:
    return html.escape(str(value or ""), quote=True)


def _as_list(value: Any) -> list[str]:
    return [str(item).strip() for item in value if str(item).strip()] if isinstance(value, list) else []


def _label_from_step(step: str) -> str:
    cleaned = step.strip().rstrip(".")
    return cleaned[:52] + ("..." if len(cleaned) > 52 else "")


def _workflow_title(step: str) -> str:
    text = step.lower()
    rules = [
        (["ingest", "intake", "import", "job post", "source"], "Intake"),
        (["dedupe", "duplicate", "identity", "rehire"], "Match"),
        (["screen", "score", "rank", "qualification"], "Screen"),
        (["route", "status", "pipeline", "stage"], "Route"),
        (["notify", "endorsement", "manager", "handoff"], "Endorse"),
        (["hr", "selected", "candidate records"], "HR Handoff"),
        (["follow", "pending", "missing", "communication"], "Follow Up"),
        (["lookup", "matching", "prior talent"], "Reuse"),
        (["dashboard", "report", "visibility"], "Monitor"),
        (["store", "database", "history"], "Store"),
    ]
    for words, label in rules:
        if any(word in text for word in words):
            return label
    words = [word.strip(".,:;()[]") for word in step.split() if word.strip(".,:;()[]")]
    return " ".join(words[:2]).title() if words else "Step"


def _field_labels(data_schema: dict[str, Any]) -> list[str]:
    labels = []
    for field in data_schema.get("fields", []):
        if isinstance(field, dict):
            label = str(field.get("label") or field.get("name") or field.get("key") or "").strip()
        else:
            label = str(field).strip()
        if label:
            labels.append(label)
    return labels


def _sample_value(label: str, row_index: int) -> str:
    lowered = label.lower()
    names = ["Maya Santos", "Jordan Lee", "Ari Chen", "Sam Rivera", "Nina Patel"]
    statuses = ["New", "Screening", "Interview", "Approved", "Follow-up"]
    if "name" in lowered or "applicant" in lowered or "candidate" in lowered:
        return names[row_index % len(names)]
    if "email" in lowered:
        return f"candidate{row_index + 1}@example.com"
    if "position" in lowered or "role" in lowered:
        return ["Caregiver", "Coordinator", "Assistant", "Specialist"][row_index % 4]
    if "source" in lowered:
        return ["Facebook", "Indeed", "Referral", "Website"][row_index % 4]
    if "status" in lowered or "stage" in lowered:
        return statuses[row_index % len(statuses)]
    if "interview" in lowered or "date" in lowered or "due" in lowered or "updated" in lowered:
        return f"2026-07-{12 + row_index:02d}"
    if "owner" in lowered or "team" in lowered or "assigned" in lowered:
        return ["Recruiting", "Operations", "Admin", "Client Success"][row_index % 4]
    if "priority" in lowered:
        return ["Normal", "High", "Normal", "Urgent"][row_index % 4]
    if "id" in lowered:
        return f"REC-{1040 + row_index}"
    return ["Validated", "Pending Review", "Ready", "Synced"][row_index % 4]


def _sample_rows(fields: list[str], count: int = 5) -> list[list[str]]:
    return [[_sample_value(field, row_index) for field in fields] for row_index in range(count)]


def _context_text(context: dict[str, Any], plan: dict[str, Any] | None = None) -> str:
    plan = plan or {}
    context_parts = [
        context.get("industry", ""),
        " ".join(step for steps in context.get("process_flow", {}).values() for step in steps),
        " ".join(context.get("tools_detected", [])),
        " ".join(context.get("pain_points", [])),
        " ".join(context.get("automation_opportunities", [])),
        " ".join(_as_list(plan.get("recommended_stack"))),
        " ".join(_as_list(plan.get("workflow_design"))),
        " ".join(_as_list(plan.get("automation_layers"))),
    ]
    return " ".join(context_parts).lower()


def _extract_volume_hint(text: str) -> str:
    import re

    match = re.search(r"(\d{1,3}(?:,\d{3})+|\d{4,})", text)
    return match.group(1) if match else "High"


def _project_scale(context: dict[str, Any], plan: dict[str, Any]) -> str:
    source = _context_text(context, plan)
    complexity = str(plan.get("complexity_level") or "").lower()
    enterprise_signals = ["enterprise", "multi department", "multiple departments", "compliance", "migration", "erp", "security", "approval matrix"]
    mid_signals = ["integration", "dashboard", "crm", "database", "supabase", "zoho", "api", "40,000", "40000", "high-volume", "bulk", "matching"]
    if "high" in complexity or "complex" in complexity or any(signal in source for signal in enterprise_signals):
        return "enterprise"
    if "medium" in complexity or any(signal in source for signal in mid_signals):
        return "mid"
    return "simple"


def _dashboard_metrics(context: dict[str, Any], plan: dict[str, Any], row_count: int) -> list[tuple[str, str, str]]:
    source = _context_text(context, plan)
    if any(word in source for word in ["recruit", "applicant", "candidate", "hiring"]):
        volume = _extract_volume_hint(source)
        return [
            (volume, "Total applicants", "captured in the operating system"),
            ("1,248", "Open applicants", "active pipeline records"),
            ("312", "Pending review", "after automated screening"),
            ("68%", "Qualified rate", "AI-prioritized shortlist"),
        ]
    if any(word in source for word in ["project", "task", "deadline", "milestone"]):
        return [
            ("84", "Active tasks", "currently in progress"),
            ("17", "At-risk items", "approaching due date"),
            ("92%", "SLA compliance", "on-time completion"),
            ("6.4d", "Avg cycle time", "request to done"),
        ]
    if any(word in source for word in ["ticket", "support", "request", "issue"]):
        return [
            ("126", "Open requests", "current service queue"),
            ("31", "Pending review", "needs human action"),
            ("88%", "Response SLA", "within target window"),
            ("14h", "Avg resolution", "sample cycle time"),
        ]
    return [
        ("128", "Open records", "active operational items"),
        ("34", "Pending review", "waiting for validation"),
        ("91%", "Completion rate", "sample process health"),
        ("2.6d", "Avg cycle time", "record start to close"),
    ]


def _dashboard_charts(context: dict[str, Any], plan: dict[str, Any]) -> str:
    source = _context_text(context, plan)
    if any(word in source for word in ["recruit", "applicant", "candidate", "hiring"]):
        funnel_title = "Applicant Funnel"
        trend_title = "Time to Hire"
        donut_title = "Review Split"
        bars = [("Applied", "40,000", 100), ("Screened", "18,400", 46), ("Qualified", "7,200", 18), ("Endorsed", "2,850", 7)]
        split = ["52% AI-qualified", "31% Needs review", "17% Not matched"]
        trend_path = "M18 130 C52 92, 84 112, 116 76 S178 48, 222 34"
        trend_fill = "M18 130 C52 92, 84 112, 116 76 S178 48, 222 34 L222 154 L18 154 Z"
    else:
        funnel_title = "Workload Funnel"
        trend_title = "Cycle Time"
        donut_title = "Status Mix"
        bars = [("Received", "128", 100), ("Validated", "96", 75), ("In progress", "52", 41), ("Completed", "37", 29)]
        split = ["46% In progress", "27% Pending review", "27% Completed"]
        trend_path = "M18 118 C50 98, 74 122, 104 82 S164 42, 222 58"
        trend_fill = "M18 118 C50 98, 74 122, 104 82 S164 42, 222 58 L222 154 L18 154 Z"

    bar_rows = []
    for index, (label, value, width) in enumerate(bars):
        y = 24 + index * 34
        bar_width = max(18, int(width * 1.72))
        bar_rows.append(
            f'<g><text x="12" y="{y}" class="chart-label">{_esc(label)}</text>'
            f'<text x="220" y="{y}" class="chart-value">{_esc(value)}</text>'
            f'<rect x="12" y="{y + 8}" width="172" height="10" rx="5" class="bar-bg" />'
            f'<rect x="12" y="{y + 8}" width="{bar_width}" height="10" rx="5" class="bar-fill" /></g>'
        )
    bar_svg = '<svg class="chart-svg" viewBox="0 0 244 166" role="img" aria-label="sample bar chart">' + "".join(bar_rows) + '</svg>'
    split_html = "".join(f"<li><b>{_esc(item.split(' ', 1)[0])}</b> {_esc(item.split(' ', 1)[1])}</li>" for item in split)
    return f"""
          <div class="dashboard-visuals">
            <div class="dashboard-panel chart-panel">
              <div class="panel-head"><span>{_esc(funnel_title)}</span><small>sample conversion view</small></div>
              {bar_svg}
            </div>
            <div class="dashboard-panel chart-panel">
              <div class="panel-head"><span>{_esc(trend_title)}</span><small>sample monthly trend</small></div>
              <svg class="chart-svg" viewBox="0 0 244 166" role="img" aria-label="sample trend chart">
                <path class="line-fill" d="{trend_fill}" />
                <path class="grid-line" d="M18 42 H226 M18 82 H226 M18 122 H226" />
                <path class="trend-line" d="{trend_path}" />
                <circle cx="18" cy="130" r="4" class="chart-dot" /><circle cx="74" cy="104" r="4" class="chart-dot" /><circle cx="116" cy="76" r="4" class="chart-dot" /><circle cx="174" cy="50" r="4" class="chart-dot" /><circle cx="222" cy="34" r="4" class="chart-dot" />
              </svg>
            </div>
            <div class="dashboard-panel chart-panel">
              <div class="panel-head"><span>{_esc(donut_title)}</span><small>operational ratio</small></div>
              <div class="donut-wrap"><svg class="donut-svg" viewBox="0 0 120 120" role="img" aria-label="sample donut chart"><circle cx="60" cy="60" r="42" class="donut-base"/><circle cx="60" cy="60" r="42" class="donut-a"/><circle cx="60" cy="60" r="42" class="donut-b"/><circle cx="60" cy="60" r="42" class="donut-c"/><circle cx="60" cy="60" r="25" class="donut-hole"/></svg><ul>{split_html}</ul></div>
            </div>
          </div>
    """


def _kanban_columns(workflow_design: list[str]) -> str:
    labels = ["New", "Validate", "Review", "Route", "Done"]
    sample_cards = [
        ["New record", "Source captured", "Profile normalized"],
        ["Rules checked", "Duplicate check", "Missing data"],
        ["Needs review", "Exception queue", "Priority item"],
        ["Owner assigned", "Notification sent", "Next action"],
        ["Completed record", "Handoff notes", "Follow-up task"],
    ]
    if workflow_design:
        derived = [_workflow_title(step) for step in workflow_design[:5]]
        labels = (derived + labels)[:5]
    columns = []
    for label, cards in zip(labels, sample_cards):
        card_html = "".join(f"<li>{_esc(card)}</li>" for card in cards)
        columns.append(f'<div class="kanban-col"><h3>{_esc(label)}</h3><ul>{card_html}</ul></div>')
    return '<div class="kanban-board">' + "".join(columns) + '</div>'


def _render_list(items: list[str], class_name: str = "bp-list") -> str:
    if not items:
        return ""
    return f'<ul class="{class_name}">' + "".join(f"<li>{_esc(item)}</li>" for item in items) + "</ul>"


def _architecture_layers(automation_layers: list[str], recommended_stack: list[str]) -> list[tuple[str, str]]:
    source = " ".join(automation_layers + recommended_stack).lower()
    layers = []
    for layer, words in ARCHITECTURE_LAYER_LABELS.items():
        if any(word in source for word in words):
            detail = next((item for item in automation_layers if any(word in item.lower() for word in words)), "")
            layers.append((layer.title(), detail or f"{layer.title()} layer supported by selected stack."))
    return layers


def _timeline_phases(context: dict[str, Any], plan: dict[str, Any]) -> tuple[str, list[tuple[str, str, str]]]:
    scale = _project_scale(context, plan)
    if scale == "simple":
        return "1-2 weeks", [
            ("Scope & data map", "1-2 days", "Confirm fields, statuses, users, and acceptance criteria."),
            ("Build", "3-6 days", "Create the core automation, records table, dashboard, and handoff flow."),
            ("Test & launch", "2-3 days", "Validate sample records, fix exceptions, deploy, and document usage."),
        ]
    if scale == "enterprise":
        return "4-8 weeks", [
            ("Discovery & governance", "1 week", "Confirm departments, permissions, reporting rules, risk points, and success metrics."),
            ("Architecture & prototype", "1-2 weeks", "Design database, dashboard, automation layers, AI checks, and integration paths."),
            ("Core development", "2-3 weeks", "Build workflows, dashboard modules, routing, notifications, and data validation."),
            ("Integration & QA", "1-2 weeks", "Test scale, edge cases, access, audit trail, and production handoff."),
            ("Rollout", "3-5 days", "Launch with documentation, training notes, and post-launch monitoring."),
        ]
    return "2-4 weeks", [
        ("Scope & workflow design", "2-4 days", "Confirm the operating process, data fields, user roles, and success metrics."),
        ("Prototype", "3-5 days", "Build the first working dashboard, records table, and automation path."),
        ("Development", "1-2 weeks", "Complete AI logic, integrations, status pipeline, handoffs, and notifications."),
        ("Testing & handover", "3-5 days", "Validate records, tune prompts/rules, document usage, and launch."),
    ]


def _automation_logic(workflow_design: list[str]) -> list[tuple[str, str, str]]:
    logic = []
    for index, step in enumerate(workflow_design[:5], start=1):
        if index == 1:
            logic.append(("Trigger", step, "New record enters the system."))
        elif index == len(workflow_design[:5]):
            logic.append(("Output", step, "Record is updated, routed, or communicated."))
        else:
            logic.append(("Processing", step, "Automation applies validation, routing, or enrichment."))
    return logic


def write_proposal(structured_context: dict[str, Any], plan: dict[str, Any]) -> str:
    started_at = time.perf_counter()
    context = validate_context(structured_context)
    data_schema = build_data_schema(context)
    fields = _field_labels(data_schema)

    workflow_design = _as_list(plan.get("workflow_design"))
    automation_layers = _as_list(plan.get("automation_layers"))
    recommended_stack = _as_list(plan.get("recommended_stack"))
    ai_opportunities = _as_list(plan.get("ai_opportunities"))
    solution_summary = str(plan.get("solution_summary") or "A structured automation system designed around the confirmed workflow.")
    estimated_impact = str(plan.get("estimated_impact") or "Improved workflow consistency and reduced manual coordination.")
    complexity = str(plan.get("complexity_level") or "Medium")
    industry = context["industry"] or "Client Workflow"
    project_title = f"{industry} Automation System Blueprint"
    client_name = "Client"

    rows = _sample_rows(fields)
    has_status_field = any("status" in field.lower() or "stage" in field.lower() for field in fields)
    has_structured_records = bool(fields)
    architecture_layers = _architecture_layers(automation_layers, recommended_stack)
    automation_logic = _automation_logic(workflow_design)
    estimated_timeline, timeline_steps = _timeline_phases(context, plan)
    dashboard_metrics = _dashboard_metrics(context, plan, len(rows))

    table_html = ""
    if has_structured_records:
        header = "".join(f"<th>{_esc(field)}</th>" for field in fields)
        body = "".join(
            "<tr>" + "".join(f"<td>{_esc(value)}</td>" for value in row) + "</tr>"
            for row in rows
        )
        table_html = f"""
          <div class="dashboard-panel table-panel">
            <div class="panel-head"><span>Review Queue</span><small>open and pending applicant records</small></div>
            <div class="table-wrap"><table><thead><tr>{header}</tr></thead><tbody>{body}</tbody></table></div>
          </div>
        """

    status_html = ""
    if has_status_field and workflow_design:
        status_items = "".join(f"<span>{_esc(_workflow_title(step))}</span>" for step in workflow_design[:5])
        status_html = f'<div class="dashboard-panel"><div class="panel-head"><span>Status Pipeline</span><small>quick stage view</small></div><div class="stage-track">{status_items}</div></div>'

    metrics_html = """
          <div class="metric-grid">
    """ + "".join(
        f'<div class="metric-card"><strong>{_esc(value)}</strong><span>{_esc(label)}</span><small>{_esc(note)}</small></div>'
        for value, label, note in dashboard_metrics
    ) + """
          </div>
    """

    activity_html = ""
    if automation_layers and any(
        word in " ".join(automation_layers).lower()
        for word in ["trigger", "sync", "route", "email", "notification", "automation", "update"]
    ):
        events = automation_layers[:4]
        activity_html = '<div class="dashboard-panel"><div class="panel-head"><span>Automation Events</span><small>from automation_layers</small></div><ol class="event-log">' + "".join(f"<li>{_esc(event)}</li>" for event in events) + "</ol></div>"

    layers_html = "".join(
        f'<div class="layer-card"><span>{_esc(label)}</span><p>{_esc(detail)}</p></div>'
        for label, detail in architecture_layers
    )

    workflow_html = "".join(
        f'<div class="workflow-step"><strong>{index}</strong><span>{_esc(_workflow_title(step))}</span><p>{_esc(step)}</p></div>'
        for index, step in enumerate(workflow_design, start=1)
    )
    dashboard_charts_html = _dashboard_charts(context, plan)
    kanban_html = _kanban_columns(workflow_design)

    logic_html = "".join(
        f"<tr><th>{_esc(kind)}</th><td>{_esc(processing)}</td><td>{_esc(output)}</td></tr>"
        for kind, processing, output in automation_logic
    )

    timeline_html = "".join(
        f'<div class="timeline-item"><span>{_esc(duration)}</span><h3>{_esc(title)}</h3><p>{_esc(deliverable)}</p></div>'
        for title, duration, deliverable in timeline_steps
    )

    stack_html = "".join(f"<span>{_esc(tool)}</span>" for tool in recommended_stack)
    field_html = "".join(f"<code>{_esc(field)}</code>" for field in fields)

    html_output = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{_esc(project_title)}</title>
  <style>
    :root {{ --bg:#080a10; --panel:rgba(255,255,255,.075); --panel2:rgba(255,255,255,.115); --line:rgba(255,255,255,.16); --text:#f6f8ff; --muted:#aab4c8; --accent:#71f4d3; --accent2:#9ca7ff; --warn:#ffbd7a; }}
    * {{ box-sizing:border-box; }}
    body {{ margin:0; font-family:Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif; background:radial-gradient(circle at 12% 0%, rgba(113,244,211,.15), transparent 32%), radial-gradient(circle at 88% 10%, rgba(156,167,255,.14), transparent 28%), var(--bg); color:var(--text); }}
    .proposal-shell {{ width:min(297mm, calc(100% - 32px)); margin:0 auto; padding:14mm 0 18mm; }}
    .page {{ min-height:190mm; padding:0 0 12mm; border-bottom:1px solid var(--line); break-after:page; }}
    .hero {{ display:grid; grid-template-columns:1.2fr .8fr; gap:18px; align-items:end; margin-bottom:22px; }}
    .eyebrow, .panel-head small, .data-source {{ color:var(--accent); font:600 12px/1.3 ui-monospace, SFMono-Regular, Menlo, monospace; }}
    h1 {{ margin:10px 0 14px; font-size:clamp(38px, 7vw, 78px); line-height:.93; letter-spacing:-.06em; }}
    h2 {{ margin:0 0 16px; font-size:clamp(24px, 3vw, 38px); letter-spacing:-.04em; }}
    h3 {{ margin:0 0 8px; }}
    p {{ color:var(--muted); line-height:1.65; }}
    .card, .dashboard-panel, .layer-card, .timeline-item, .metric-card {{ border:1px solid var(--line); background:linear-gradient(145deg, var(--panel2), var(--panel)); border-radius:18px; box-shadow:0 24px 80px rgba(0,0,0,.28); }}
    .card {{ padding:22px; margin:16px 0; }}
    .summary-card {{ font-size:18px; }}
    .workflow-pipe {{ display:grid; grid-template-columns:repeat(auto-fit, minmax(180px,1fr)); gap:12px; }}
    .dashboard-visuals {{ display:grid; grid-template-columns:1.25fr 1fr 1fr; gap:12px; }}
    .workflow-step {{ position:relative; padding:18px; border:1px solid var(--line); border-radius:16px; background:rgba(0,0,0,.18); }}
    .workflow-step strong {{ display:grid; place-items:center; width:30px; height:30px; border-radius:999px; background:rgba(113,244,211,.14); color:var(--accent); margin-bottom:12px; }}
    .workflow-step span {{ display:block; font-weight:800; margin-bottom:8px; }}
    .layer-grid, .metric-grid {{ display:grid; grid-template-columns:repeat(auto-fit, minmax(170px,1fr)); gap:12px; }}
    .layer-card, .metric-card {{ padding:16px; }}
    .layer-card span {{ color:var(--accent); font-weight:800; }}
    .stack {{ display:flex; flex-wrap:wrap; gap:8px; }}
    .stack span, .field-list code {{ border:1px solid var(--line); border-radius:999px; padding:8px 10px; background:rgba(0,0,0,.18); color:#dfe6f8; }}
    .dashboard-grid {{ display:grid; gap:12px; }}
    .chart-panel {{ min-height:220px; }}
    .chart-svg {{ width:100%; height:180px; display:block; padding:12px 14px 8px; overflow:visible; }}
    .chart-label {{ fill:var(--text); font-size:11px; font-weight:800; }}
    .chart-value {{ fill:var(--muted); font-size:11px; text-anchor:end; }}
    .bar-bg {{ fill:rgba(255,255,255,.10); }}
    .bar-fill {{ fill:url(#none); fill:var(--accent); opacity:.92; }}
    .grid-line {{ stroke:rgba(255,255,255,.10); stroke-width:1; fill:none; }}
    .line-fill {{ fill:rgba(113,244,211,.14); }}
    .trend-line {{ fill:none; stroke:var(--accent); stroke-width:5; stroke-linecap:round; filter:drop-shadow(0 0 8px rgba(113,244,211,.35)); }}
    .chart-dot {{ fill:var(--accent); stroke:var(--bg); stroke-width:3; }}
    .donut-wrap {{ display:grid; grid-template-columns:110px 1fr; gap:14px; align-items:center; padding:18px; }}
    .donut-svg {{ width:106px; height:106px; transform:rotate(-90deg); }}
    .donut-base {{ fill:none; stroke:rgba(255,255,255,.10); stroke-width:18; }}
    .donut-a, .donut-b, .donut-c {{ fill:none; stroke-width:18; stroke-linecap:round; }}
    .donut-a {{ stroke:var(--accent); stroke-dasharray:137 264; stroke-dashoffset:0; }}
    .donut-b {{ stroke:var(--accent2); stroke-dasharray:82 264; stroke-dashoffset:-142; }}
    .donut-c {{ stroke:var(--warn); stroke-dasharray:45 264; stroke-dashoffset:-229; }}
    .donut-hole {{ fill:var(--bg); }}
    .donut-wrap ul {{ margin:0; padding-left:18px; color:var(--muted); line-height:1.7; }}
    .kanban-board {{ display:grid; grid-template-columns:repeat(5, minmax(140px,1fr)); gap:10px; overflow:auto; padding-bottom:4px; }}
    .kanban-col {{ min-width:140px; border:1px solid var(--line); border-radius:16px; background:rgba(0,0,0,.16); padding:12px; }}
    .kanban-col h3 {{ color:var(--accent); font-size:14px; margin-bottom:10px; }}
    .kanban-col ul {{ display:grid; gap:8px; list-style:none; margin:0; padding:0; }}
    .kanban-col li {{ border:1px solid rgba(255,255,255,.12); border-radius:12px; padding:9px; color:#dce3f5; background:rgba(255,255,255,.06); font-size:13px; }}
    .panel-head {{ display:flex; justify-content:space-between; gap:12px; align-items:center; padding:14px 16px; border-bottom:1px solid var(--line); }}
    .panel-head span {{ font-weight:800; }}
    .table-wrap {{ overflow:auto; }}
    table {{ width:100%; border-collapse:collapse; min-width:680px; }}
    th, td {{ padding:13px 14px; border-bottom:1px solid rgba(255,255,255,.10); text-align:left; }}
    th {{ color:var(--accent); font-size:12px; text-transform:uppercase; letter-spacing:.04em; }}
    td {{ color:#dce3f5; }}
    .stage-track {{ display:flex; flex-wrap:wrap; gap:9px; padding:16px; }}
    .stage-track span {{ padding:9px 11px; border:1px solid rgba(113,244,211,.25); border-radius:999px; background:rgba(113,244,211,.08); }}
    .event-log {{ margin:0; padding:16px 16px 16px 38px; color:var(--muted); line-height:1.7; }}
    .metric-card strong {{ display:block; font-size:30px; letter-spacing:-.05em; }}
    .metric-card span {{ display:block; color:var(--text); font-weight:800; margin-top:4px; }}
    .metric-card small {{ display:block; color:var(--muted); margin-top:5px; line-height:1.35; }}
    .logic-table th {{ width:150px; }}
    .field-list {{ display:flex; flex-wrap:wrap; gap:8px; margin-top:10px; }}
    .timeline {{ position:relative; display:grid; gap:14px; }}
    .timeline-item {{ padding:18px 18px 18px 24px; border-left:3px solid var(--accent); }}
    .timeline-item span {{ color:var(--warn); font:600 12px ui-monospace, SFMono-Regular, Menlo, monospace; }}
    .injection-grid {{ display:grid; grid-template-columns:repeat(auto-fit, minmax(240px,1fr)); gap:12px; }}
    .injection-grid code {{ display:block; white-space:pre-wrap; color:#dfe6f8; background:rgba(0,0,0,.24); border:1px solid var(--line); border-radius:12px; padding:12px; }}
    .timeline-note {{ margin-top:12px; color:var(--muted); font-size:14px; }}
    .cta-card {{ display:grid; grid-template-columns:1.25fr auto; gap:26px; align-items:center; padding:32px; border:2px solid rgba(113,244,211,.46); background:radial-gradient(circle at 10% 0%, rgba(113,244,211,.28), transparent 34%), linear-gradient(145deg, rgba(113,244,211,.18), rgba(156,167,255,.13)); box-shadow:0 26px 90px rgba(113,244,211,.16); }}
    .cta-card h2 {{ font-size:clamp(30px, 4vw, 52px); line-height:.98; margin-bottom:12px; }}
    .cta-card p {{ margin:10px 0 0; font-size:17px; line-height:1.7; color:#dce5f7; }}
    .cta-actions {{ display:flex; flex-wrap:wrap; justify-content:flex-end; gap:12px; min-width:250px; }}
    .cta-actions a {{ display:inline-flex; align-items:center; justify-content:center; min-height:52px; border-radius:999px; padding:0 22px; border:1px solid rgba(113,244,211,.54); color:#071019; background:var(--accent); font-weight:900; text-decoration:none; box-shadow:0 14px 36px rgba(113,244,211,.18); }}
    .cta-actions a.secondary {{ color:var(--text); background:rgba(255,255,255,.08); }}
    @media (max-width:900px) {{ .dashboard-visuals {{ grid-template-columns:1fr; }} .kanban-board {{ grid-template-columns:repeat(5, 160px); }} .cta-card {{ grid-template-columns:1fr; }} .cta-actions {{ justify-content:flex-start; }} }}
    @media (max-width:760px) {{ .hero {{ grid-template-columns:1fr; }} .proposal-shell {{ width:min(100% - 22px, 297mm); }} }}
    @page {{ size:A4 landscape; margin:0; }}
    @media print {{
      html, body {{ background:var(--bg) !important; color:var(--text); -webkit-print-color-adjust:exact; print-color-adjust:exact; }}
      .proposal-shell {{ width:100%; padding:0; }}
      .page {{ min-height:210mm; padding:10mm; border-bottom:0; break-after:page; background:radial-gradient(circle at 12% 0%, rgba(113,244,211,.15), transparent 32%), radial-gradient(circle at 88% 10%, rgba(156,167,255,.14), transparent 28%), var(--bg) !important; }}
      .page:last-child {{ break-after:auto; }}
      .card, .dashboard-panel, .layer-card, .timeline-item, .metric-card, .workflow-step, .kanban-col, .chart-panel {{ box-shadow:none; break-inside:avoid; page-break-inside:avoid; }}
      .card {{ margin:8mm 0; padding:6mm; }}
      .cta-card {{ padding:8mm; }}
      .cta-card h2 {{ font-size:24pt; }}
      .cta-card p {{ font-size:10.5pt; }}
      h1 {{ font-size:34pt; }}
      h2 {{ font-size:20pt; }}
      p, li, td {{ font-size:10pt; line-height:1.45; }}
      table {{ min-width:0; font-size:9pt; }}
      .dashboard-visuals {{ grid-template-columns:1fr 1fr; }}
      .kanban-board {{ grid-template-columns:repeat(5, 1fr); overflow:visible; }}
      th, td {{ padding:7px 8px; }}
    }}
  </style>
</head>
<body>
  <main class="proposal-shell">
    <section class="page" aria-label="System Blueprint">
      <div class="hero">
        <div>
          <div class="eyebrow">System Blueprint UI</div>
          <h1>{_esc(project_title)}</h1>
          <p>{_esc(solution_summary)}</p>
        </div>
        <div class="card">
          <strong>Client</strong>
          <p>{_esc(client_name)}</p>
          <strong>Estimated implementation</strong>
          <p>{_esc(estimated_timeline)} depending on integration access, revision scope, and approval speed.</p>
          <strong>Blueprint basis</strong>
          <p>workflow_design, automation_layers, recommended_stack, and data_schema.fields</p>
        </div>
      </div>

      <section class="card summary-card"><h2>Executive Summary</h2><p>{_esc(solution_summary)}</p></section>


      <section class="card"><h2>System Architecture</h2><div class="layer-grid">{layers_html}</div></section>

      <section class="card"><h2>Tools Stack</h2><div class="stack">{stack_html}</div></section>

      <section class="card">
        <h2>Operations Dashboard</h2>
        <div class="dashboard-grid">
          {metrics_html}
          {dashboard_charts_html}
          {table_html}
          {activity_html}
        </div>
      </section>

      <section class="card"><h2>Status Board</h2>{kanban_html}</section>

      <section class="card"><h2>Automation Logic</h2><table class="logic-table"><tbody>{logic_html}</tbody></table></section>

      <section class="card"><h2>Expected Impact</h2><p>{_esc(estimated_impact)}</p>{_render_list(ai_opportunities)}</section>

      <section class="card cta-card">
        <div>
          <h2>Next Step: Improve This Workflow Together</h2>
          <p>This generated proposal is an initial draft based only on the workflow details shared so far. It is not the final or best possible solution I can provide. With a short call or email follow-up, I can validate the real process, uncover missing edge cases, and enhance the system design into a stronger implementation plan for your team.</p>
        </div>
        <div class="cta-actions">
          <a href="mailto:boton.danicamarie@gmail.com?subject=Workflow%20Improvement%20Call">Email Danica</a>
          <a class="secondary" href="tel:+639638506071">Book / Call</a>
        </div>
      </section>
    </section>

    <section class="page" aria-label="Project Timeline">
      <div class="card"><h2>Project Timeline</h2><p class="timeline-note">Estimated range: <strong>{_esc(estimated_timeline)}</strong>. Simple builds can finish in 1-2 weeks; mid-level automation systems usually fit 2-4 weeks; enterprise or multi-department builds may require 4-8 weeks.</p><div class="timeline">{timeline_html}</div></div>
      <div class="card">
        <h2>Dynamic Data Injection</h2>
        <div class="injection-grid">
          <code>data_schema.source: {_esc(data_schema["source"])}</code>
          <code>fields: {", ".join(_esc(field) for field in fields)}</code>
          <code>workflow_design -> Workflow Pipeline, Status Board, Automation Logic</code>
          <code>automation_layers -> System Architecture, Automation Events</code>
          <code>recommended_stack -> Tools Stack, Architecture layer support</code>
        </div>
      </div>
    </section>
  </main>
</body>
</html>"""
    log_latency("writer_html_blueprint", started_at)
    return html_output










