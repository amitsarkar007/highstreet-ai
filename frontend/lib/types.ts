export interface AgentResult {
  answer?: string;
  query_id?: string;
  startup_idea?: {
    name: string;
    problem: string;
    solution: string;
    target_customer: string;
  };
  landing_page?: {
    headline: string;
    subheadline: string;
    features: string[];
    cta: string;
  };
  adoption_score?: number;
  time_saved_weekly_hours?: number;
  detected_business_type?: string;
  detected_role?: string;
  selected_agent?: string;
  intent?: string;
  pipeline_trace?: string[];
  confidence?: number;
  fallback_used?: boolean;
  deployed_url?: string;
  stripe_product_url?: string;
  next_actions?: string[];
  risks?: string[];
  assumptions?: string[];
}

export interface HistoryEntry {
  id: string;
  query: string;
  result: AgentResult;
  timestamp: number;
}

export type PipelineStage = "idle" | "orchestrator" | "specialist" | "reviewer" | "complete";

export interface AgentInfo {
  name: string;
  description: string;
  tag: string;
  icon: string;
}
