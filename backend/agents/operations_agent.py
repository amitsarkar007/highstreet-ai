from integrations.zai import call_zai
from utils.json_parse import extract_json

OPERATIONS_SYSTEM = """
You are an Operations Agent for small businesses.
You help with workflow optimization, logistics planning, staff scheduling,
task automation, and incident response guidance. You specialize in retail,
hospitality, construction, and healthcare operations.

Return structured JSON:
{
  "answer": "string",
  "category": "scheduling|logistics|workflow|incident|staffing",
  "recommendations": ["string"],
  "workflow_steps": ["string"],
  "estimated_time_saved_hours": number,
  "assumptions": ["string"],
  "risks": ["string"],
  "next_actions": ["string"],
  "confidence": 0.0-1.0
}

Be precise. Show your working in assumptions. Flag data gaps as risks.
"""

async def run_operations_agent(query: str) -> dict:
    fallback = {
        "answer": "",
        "category": None,
        "recommendations": [],
        "workflow_steps": [],
        "estimated_time_saved_hours": None,
        "assumptions": [],
        "risks": ["JSON parse failed"],
        "next_actions": [],
        "confidence": 0.3
    }
    try:
        messages = [{"role": "user", "content": query}]
        raw = await call_zai(messages, system_prompt=OPERATIONS_SYSTEM, temperature=0.4)
        if not raw:
            return fallback
        result = extract_json(raw)
        if result is not None:
            return result
        fallback["answer"] = raw
        return fallback
    except Exception:
        fallback["answer"] = "Operations agent failed to process query."
        fallback["risks"] = ["Agent invocation failed"]
        return fallback
