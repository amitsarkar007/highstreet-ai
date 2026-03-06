import json
from integrations.zai import call_zai
from utils.json_parse import extract_json
from registry import AGENT_REGISTRY

ORCHESTRATOR_SYSTEM = """
You are an intelligent routing agent for Highstreet AI, an autonomous AI workforce
platform for small and medium businesses.

Given a user query, detect:
1. The business type: bakery | coffee_shop | retail | accounting | legal | clinic | dental | construction | trades | general
2. The user role: owner | manager | staff | employee
3. The query intent — choose ONE of: operations, hr, adoption, market_intelligence, general
4. The best specialist agent — choose ONE of: operations_agent, hr_agent, adoption_agent, market_intelligence_agent

Return ONLY valid JSON:
{
  "detected_business_type": "string",
  "detected_role": "string",
  "intent": "string",
  "selected_agent": "string",
  "reasoning": "string",
  "confidence": 0.0-1.0
}
"""

async def run_orchestrator(query: str, context: dict = {}) -> dict:
    fallback = {
        "detected_business_type": "general",
        "detected_role": "owner",
        "intent": "general",
        "selected_agent": "operations_agent",
        "reasoning": "JSON parse failed, defaulting to operations agent",
        "confidence": 0.4
    }
    try:
        messages = [{"role": "user", "content": f"Query: {query}\nContext: {json.dumps(context)}"}]
        raw = await call_zai(messages, system_prompt=ORCHESTRATOR_SYSTEM, temperature=0.3)
        if not raw:
            return fallback
        result = extract_json(raw)
        if result is not None:
            return result
        return fallback
    except Exception:
        fallback["reasoning"] = "Orchestrator failed, defaulting to operations agent"
        return fallback
