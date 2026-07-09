import logging
import time
from functools import lru_cache

from dotenv import load_dotenv
from langchain_openai import ChatOpenAI


load_dotenv()
logger = logging.getLogger("ai_proposal_builder.openai")

MODEL_DEFAULTS = {
    "temperature": 0.2,
    "max_tokens": 1200,
    "timeout": 30,
    "max_retries": 2,
}


@lru_cache(maxsize=4)
def get_chat_model(
    model: str,
    temperature: float = MODEL_DEFAULTS["temperature"],
    max_tokens: int = MODEL_DEFAULTS["max_tokens"],
    timeout: int = MODEL_DEFAULTS["timeout"],
    max_retries: int = MODEL_DEFAULTS["max_retries"],
) -> ChatOpenAI:
    return ChatOpenAI(
        model=model,
        temperature=temperature,
        max_tokens=max_tokens,
        timeout=timeout,
        max_retries=max_retries,
    )


def log_latency(operation: str, started_at: float) -> None:
    elapsed_ms = round((time.perf_counter() - started_at) * 1000, 2)
    logger.info("%s completed in %sms", operation, elapsed_ms)
