from integrations.zai import call_zai
from utils.json_parse import extract_json

MARKET_INTELLIGENCE_SYSTEM = """
You are a Market Intelligence Agent for small businesses.
You analyze demand patterns, seasonal trends, local market signals, supply chain
indicators, and competitor activity. You translate signals into actionable business
recommendations for SMB owners.

Return structured JSON:
{
  "answer": "string",
  "demand_signals": ["string"],
  "market_trends": ["string"],
  "recommended_actions": ["string"],
  "risk_indicators": ["string"],
  "opportunities": ["string"],
  "assumptions": ["string"],
  "risks": ["string"],
  "next_actions": ["string"],
  "confidence": 0.0-1.0
}

Be precise. Show your working in assumptions. Flag data gaps as risks.
"""

async def run_market_intelligence_agent(query: str) -> dict:
    fallback = {
        "answer": "",
        "demand_signals": [],
        "market_trends": [],
        "recommended_actions": [],
        "risk_indicators": [],
        "opportunities": [],
        "assumptions": [],
        "risks": ["JSON parse failed"],
        "next_actions": [],
        "confidence": 0.3
    }
    try:
        messages = [{"role": "user", "content": query}]
        raw = await call_zai(messages, system_prompt=MARKET_INTELLIGENCE_SYSTEM, temperature=0.4)
        if not raw:
            return fallback
        result = extract_json(raw)
        if result is not None:
            return result
        fallback["answer"] = raw
        return fallback
    except Exception:
        fallback["answer"] = "Market intelligence agent failed to process query."
        fallback["risks"] = ["Agent invocation failed"]
        return fallback
