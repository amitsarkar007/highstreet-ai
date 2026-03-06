AGENT_REGISTRY = {
    "orchestrator": {
        "name": "Orchestrator",
        "description": "Detects user role and intent, routes to specialist agent",
        "routing_tags": ["all"],
        "model": "glm-4-plus"
    },
    "operations_agent": {
        "name": "Operations Agent",
        "description": "Optimises workflows, logistics, scheduling and incident response for SMBs",
        "routing_tags": ["operations", "scheduling", "logistics", "inventory", "staffing", "workflow", "incident", "supply"],
        "model": "glm-4-plus",
        "capabilities": [
            "workflow_optimization",
            "logistics_planning",
            "scheduling_automation",
            "incident_response"
        ]
    },
    "hr_agent": {
        "name": "HR & Wellbeing Agent",
        "description": "Handles onboarding, HR queries, wellbeing check-ins, learning suggestions",
        "routing_tags": ["hr", "onboarding", "wellbeing", "training", "people", "staff", "employees"],
        "model": "glm-4-plus",
        "capabilities": [
            "onboarding_guidance",
            "hr_knowledge_support",
            "wellbeing_checkin",
            "learning_suggestions"
        ]
    },
    "adoption_agent": {
        "name": "Adoption Optimizer",
        "description": "Classifies AI use cases, scores adoption, estimates time saved",
        "routing_tags": ["adoption", "productivity", "ai_usage", "automation", "training", "roi", "measurement"],
        "model": "glm-4-plus",
        "capabilities": [
            "classify_ai_use_case",
            "estimate_time_saved",
            "score_adoption",
            "suggest_automation_workflows",
            "generate_training_tips"
        ]
    },
    "market_intelligence_agent": {
        "name": "Market Intelligence Agent",
        "description": "Analyses demand, trends, and market signals for SMB decision-making",
        "routing_tags": ["market", "demand", "trends", "competitors", "pricing", "forecast", "seasonal", "supply_chain"],
        "model": "glm-4-plus",
        "capabilities": [
            "demand_forecasting",
            "trend_analysis",
            "market_signals",
            "competitor_monitoring"
        ]
    },
    "reviewer": {
        "name": "Reviewer Agent",
        "description": "Reviews specialist output, improves clarity, adds next steps, flags risks",
        "routing_tags": ["all"],
        "model": "glm-4-plus"
    }
}
