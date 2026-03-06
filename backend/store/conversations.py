from typing import Dict
from schemas.conversation import ConversationState
import uuid

_store: Dict[str, ConversationState] = {}


def create_conversation() -> ConversationState:
    conv = ConversationState(
        conversation_id=str(uuid.uuid4())
    )
    _store[conv.conversation_id] = conv
    return conv


def get_conversation(conversation_id: str) -> ConversationState | None:
    return _store.get(conversation_id)


def update_conversation(conv: ConversationState) -> ConversationState:
    _store[conv.conversation_id] = conv
    return conv


def clear_conversation(conversation_id: str):
    _store.pop(conversation_id, None)
