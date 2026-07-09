from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from agents.consultant import consultant_chat
from agents.extractor import extract_context
from agents.planner import create_plan
from agents.writer import write_proposal
from models.context_schema import refresh_context_state
from services.context_manager import context_manager
from services.file_parser import extract_text_from_upload


load_dotenv()

app = FastAPI(title="AI Proposal Builder")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["null"],
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    structuredContext: dict[str, Any] = Field(default_factory=dict)
    message: str
    sessionId: str = "default"
    fileText: str | None = None


class ExtractRequest(BaseModel):
    structuredContext: dict[str, Any] = Field(default_factory=dict)
    message: str
    sessionId: str = "default"


class PlanRequest(BaseModel):
    structuredContext: dict[str, Any] = Field(default_factory=dict)


class ProposalRequest(BaseModel):
    structuredContext: dict[str, Any] = Field(default_factory=dict)
    plan: dict[str, Any] = Field(default_factory=dict)


@app.post("/chat")
def chat(payload: ChatRequest) -> dict[str, Any]:
    try:
        return consultant_chat(
            message=payload.message,
            structured_context=payload.structuredContext,
            session_id=payload.sessionId,
            file_text=payload.fileText,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/extract")
def extract(payload: ExtractRequest) -> dict[str, Any]:
    try:
        current = context_manager.get_context(payload.sessionId, payload.structuredContext)
        extracted = extract_context(current, payload.message)
        updated = context_manager.update_context(payload.sessionId, extracted)
        return refresh_context_state(updated)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/plan")
def plan(payload: PlanRequest) -> dict[str, Any]:
    try:
        return create_plan(payload.structuredContext)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


PROPOSAL_LIMIT_PER_IP = 3
proposal_request_counts: dict[str, int] = {}


def client_ip_from_request(request: Request) -> str:
    forwarded_for = request.headers.get("x-forwarded-for", "")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


@app.post("/proposal")
def proposal(payload: ProposalRequest, request: Request) -> dict[str, str]:
    client_ip = client_ip_from_request(request)
    current_count = proposal_request_counts.get(client_ip, 0)
    if current_count >= PROPOSAL_LIMIT_PER_IP:
        raise HTTPException(
            status_code=429,
            detail="Proposal generation limit reached for this IP. Please contact Danica to continue improving the workflow.",
        )
    proposal_request_counts[client_ip] = current_count + 1
    try:
        return {"proposal": write_proposal(payload.structuredContext, payload.plan), "proposal_format": "html"}
    except Exception as exc:
        proposal_request_counts[client_ip] = max(proposal_request_counts.get(client_ip, 1) - 1, 0)
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/upload")
async def upload(file: UploadFile = File(...)) -> dict[str, str]:
    try:
        content = await file.read()
        return extract_text_from_upload(file.filename or "upload", content)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

