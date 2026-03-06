from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime


class KeyMetric(BaseModel):
    metric_name: str
    current_estimate: str
    uk_benchmark: str
    gap: str
    financial_impact: str


class ActionPlanWeek(BaseModel):
    week: int
    actions: List[str]
    owner: str
    time_required: str
    expected_outcome: str


class QuickWin(BaseModel):
    action: str
    effort: str
    impact: str
    how_to: str


class ToolRecommendation(BaseModel):
    tool: str
    purpose: str
    cost: str
    uk_available: bool = True


class MarketSignal(BaseModel):
    signal: str
    source_type: str
    uk_context: str
    business_implication: str
    recommended_action: str


class SeasonalEntry(BaseModel):
    period: str
    expected_impact: str
    preparation_action: str
    prepare_by: str


class Opportunity(BaseModel):
    opportunity: str
    effort: str
    potential_revenue_impact: str
    how_to_capture: str


class AIAdoptionTip(BaseModel):
    barrier: str
    response: str
    example_phrase: str


class LearningStep(BaseModel):
    step: int
    title: str
    resource: str
    time_to_complete: str


class IdentifiedUseCase(BaseModel):
    name: str
    department: str
    current_state: str
    ai_readiness: str
    potential_hours_saved_weekly: float = 0
    recommended_tool: str = ""


class AutomationRoadmapItem(BaseModel):
    priority: int
    workflow: str
    effort: str
    impact: str
    tool_recommendation: str
    implementation_time: str
    roi_payback_weeks: int = 0


class TrainingRecommendation(BaseModel):
    topic: str
    audience: str
    format: str
    free_resource: str


class ScoreComponent(BaseModel):
    score: int = 0
    notes: str = ""


class AgentResponse(BaseModel):
    summary: str = ""
    assumptions: List[str] = []
    risks: List[str] = []
    next_actions: List[str] = []
    confidence: float = 0.0

    # Trace metadata
    query_id: str = ""
    detected_role: str = ""
    detected_business_type: str = ""
    detected_sector_context: str = ""
    urgency: str = ""
    intent: str = ""
    selected_agent: str = ""
    pipeline_trace: List[str] = []
    timestamp: str = ""

    # Reviewer
    reviewer_flags: List[str] = []

    # Operations Agent fields
    sector: str = ""
    key_metrics: List[KeyMetric] = []
    action_plan: List[ActionPlanWeek] = []
    quick_wins: List[QuickWin] = []
    tools_to_use: List[ToolRecommendation] = []
    time_saved_weekly_hours: float = 0
    financial_impact_monthly_gbp: Optional[Dict[str, float]] = None
    confidence_reason: str = ""

    # HR Agent fields
    category: str = ""
    uk_legal_context: str = ""
    recommended_approach: Optional[Dict[str, List[str]]] = None
    staff_communication_template: str = ""
    ai_adoption_tips: List[AIAdoptionTip] = []
    learning_path: List[LearningStep] = []
    escalate_to_human: bool = False
    escalation_reason: Optional[str] = None

    # Adoption Agent fields
    adoption_score: Optional[float] = None
    score_label: str = ""
    score_breakdown: Optional[Dict[str, Any]] = None
    uk_benchmark_comparison: str = ""
    identified_use_cases: List[IdentifiedUseCase] = []
    financial_value_monthly_gbp: Optional[Dict[str, float]] = None
    automation_roadmap: List[AutomationRoadmapItem] = []
    training_recommendations: List[TrainingRecommendation] = []

    # Market Intelligence fields
    local_market_signals: List[MarketSignal] = []
    seasonal_calendar: List[SeasonalEntry] = []
    competitor_landscape: Optional[Dict[str, Any]] = None
    demand_forecast: Optional[Dict[str, Any]] = None
    opportunities: List[Opportunity] = []

    # Legacy / optional enrichments
    answer: str = ""
    deployed_url: Optional[str] = None
    stripe_product_url: Optional[str] = None
