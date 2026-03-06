from langgraph.graph import StateGraph, END
from typing import TypedDict, Optional
from integrations.zai import set_fallback_used, get_fallback_used
from agents.orchestrator import run_orchestrator
from agents.operations_agent import run_operations_agent
from agents.adoption_agent import run_adoption_agent
from agents.hr_agent import run_hr_agent
from agents.market_intelligence_agent import run_market_intelligence_agent
from agents.reviewer import run_reviewer
from integrations.anyway import trace
import uuid

class PipelineState(TypedDict):
    query: str
    query_id: str
    context: dict
    orchestrator_result: Optional[dict]
    specialist_result: Optional[dict]
    final_result: Optional[dict]
    pipeline_trace: list
    deploy: bool

async def orchestrator_node(state: PipelineState) -> PipelineState:
    result = await run_orchestrator(state["query"], state.get("context", {}))
    state["orchestrator_result"] = result
    state["pipeline_trace"].append("orchestrator")
    await trace("orchestrator", state["query_id"], result)
    return state

VALID_SPECIALISTS = frozenset({"operations_agent", "hr_agent", "adoption_agent", "market_intelligence_agent"})


async def route_to_specialist(state: PipelineState) -> str:
    """Route to exactly one of operations_agent, hr_agent, adoption_agent, market_intelligence_agent."""
    orch = state.get("orchestrator_result") or {}
    agent = orch.get("selected_agent", "operations_agent")
    return agent if agent in VALID_SPECIALISTS else "operations_agent"

async def operations_node(state: PipelineState) -> PipelineState:
    result = await run_operations_agent(state["query"])
    state["specialist_result"] = result
    state["pipeline_trace"].append("operations_agent")
    await trace("operations_agent", state["query_id"], result)
    return state

async def adoption_node(state: PipelineState) -> PipelineState:
    result = await run_adoption_agent(state["query"])
    state["specialist_result"] = result
    state["pipeline_trace"].append("adoption_agent")
    await trace("adoption_agent", state["query_id"], result)
    return state

async def hr_node(state: PipelineState) -> PipelineState:
    result = await run_hr_agent(state["query"])
    state["specialist_result"] = result
    state["pipeline_trace"].append("hr_agent")
    await trace("hr_agent", state["query_id"], result)
    return state

async def market_intelligence_node(state: PipelineState) -> PipelineState:
    result = await run_market_intelligence_agent(state["query"])
    state["specialist_result"] = result
    state["pipeline_trace"].append("market_intelligence_agent")
    await trace("market_intelligence_agent", state["query_id"], result)
    return state

async def reviewer_node(state: PipelineState) -> PipelineState:
    reviewed = await run_reviewer(state["specialist_result"], state["query"])
    state["final_result"] = reviewed
    state["pipeline_trace"].append("reviewer")
    await trace("reviewer", state["query_id"], reviewed)
    return state

def build_pipeline():
    graph = StateGraph(PipelineState)
    
    graph.add_node("orchestrator", orchestrator_node)
    graph.add_node("operations_agent", operations_node)
    graph.add_node("adoption_agent", adoption_node)
    graph.add_node("hr_agent", hr_node)
    graph.add_node("market_intelligence_agent", market_intelligence_node)
    graph.add_node("reviewer", reviewer_node)
    
    graph.set_entry_point("orchestrator")
    
    graph.add_conditional_edges(
        "orchestrator",
        route_to_specialist,
        {
            "operations_agent": "operations_agent",
            "hr_agent": "hr_agent",
            "adoption_agent": "adoption_agent",
            "market_intelligence_agent": "market_intelligence_agent"
        }
    )
    
    graph.add_edge("operations_agent", "reviewer")
    graph.add_edge("adoption_agent", "reviewer")
    graph.add_edge("hr_agent", "reviewer")
    graph.add_edge("market_intelligence_agent", "reviewer")
    graph.add_edge("reviewer", END)
    
    return graph.compile()


async def run_pipeline(query: str, context: dict = {}, deploy: bool = False) -> dict:
    set_fallback_used(False)
    pipeline = build_pipeline()
    
    initial_state: PipelineState = {
        "query": query,
        "query_id": str(uuid.uuid4()),
        "context": context,
        "orchestrator_result": None,
        "specialist_result": None,
        "final_result": None,
        "pipeline_trace": [],
        "deploy": deploy
    }
    
    final_state = await pipeline.ainvoke(initial_state)
    
    orch = final_state.get("orchestrator_result") or {}
    result = final_state["final_result"] or {}
    result["query_id"] = final_state["query_id"]
    result["detected_business_type"] = orch.get("detected_business_type")
    result["detected_role"] = orch.get("detected_role")
    result["intent"] = orch.get("intent")
    result["selected_agent"] = orch.get("selected_agent")
    result["pipeline_trace"] = final_state["pipeline_trace"]
    result["fallback_used"] = get_fallback_used()
    
    return result
