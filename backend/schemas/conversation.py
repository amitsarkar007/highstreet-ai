from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid


class Message(BaseModel):
    role: str  # "user" | "assistant" | "system"
    content: str
    timestamp: str = datetime.utcnow().isoformat()
    agent: Optional[str] = None


class ConversationState(BaseModel):
    conversation_id: str
    messages: List[Message] = []
    context: Dict[str, Any] = {}
    status: str = "awaiting_input"
    # statuses: awaiting_input | clarifying | processing | complete | guardrail_triggered
    turn_count: int = 0
    detected_sector: Optional[str] = None
    detected_role: Optional[str] = None


class QueryRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    context: Dict[str, Any] = {}


class QueryResponse(BaseModel):
    conversation_id: str
    status: str  # "clarifying" | "complete" | "guardrail_triggered"
    clarifying_questions: Optional[List[Dict]] = None
    result: Optional[Dict] = None
    guardrail_message: Optional[str] = None
    guardrail_type: Optional[str] = None
