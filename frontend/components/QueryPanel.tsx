"use client";

import { useState } from "react";
import {
  Send,
  Loader2,
  ChevronDown,
  ChevronUp,
  Network,
  ClipboardList,
  Users,
  BarChart3,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EXAMPLE_QUERIES = [
  "How can I reduce pastry waste and manage the morning rush in my coffee shop?",
  "I need to schedule staff for next week at my dental clinic, we have 3 dentists",
  "How do I know if AI is actually saving my accounting firm any time?",
];

const AGENTS = [
  {
    name: "Orchestrator",
    desc: "Routes queries to the right specialist agent",
    tag: "Classification",
    icon: Network,
    color: "text-blue-500",
  },
  {
    name: "Operations",
    desc: "Workflows, scheduling, logistics & efficiency",
    tag: "Reasoning",
    icon: ClipboardList,
    color: "text-brand-500",
  },
  {
    name: "HR & Wellbeing",
    desc: "Staff support, onboarding & team health",
    tag: "Generation",
    icon: Users,
    color: "text-violet-500",
  },
  {
    name: "Adoption Optimizer",
    desc: "Measures AI ROI, usage & adoption readiness",
    tag: "Analysis",
    icon: BarChart3,
    color: "text-emerald-500",
  },
  {
    name: "Market Intelligence",
    desc: "Demand signals, trends & competitive insights",
    tag: "Synthesis",
    icon: TrendingUp,
    color: "text-amber-500",
  },
  {
    name: "Reviewer",
    desc: "Validates every output before delivery",
    tag: "Validation",
    icon: ShieldCheck,
    color: "text-rose-500",
  },
];

interface QueryPanelProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export function QueryPanel({
  query,
  onQueryChange,
  onSubmit,
  loading,
}: QueryPanelProps) {
  const [agentsExpanded, setAgentsExpanded] = useState(false);

  return (
    <section
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
      aria-label="Query input"
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Ask your AI workforce
          </span>
        </div>

        <label htmlFor="query-input" className="sr-only">
          Describe your business question
        </label>
        <textarea
          id="query-input"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Describe your business question — operations, HR, AI adoption, or market intelligence..."
          className={cn(
            "w-full min-h-[120px] rounded-xl border border-slate-200 dark:border-slate-700",
            "bg-slate-50 dark:bg-slate-800/50 px-4 py-3",
            "text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500",
            "resize-y outline-none transition-all duration-200",
            "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:focus:ring-brand-500/30",
            "disabled:opacity-60 disabled:cursor-not-allowed"
          )}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) onSubmit();
          }}
          disabled={loading}
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLE_QUERIES.map((eq, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onQueryChange(eq)}
              disabled={loading}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150",
                "border border-slate-200 dark:border-slate-700",
                "text-slate-500 dark:text-slate-400",
                "hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50",
                "dark:hover:border-brand-700 dark:hover:text-brand-400 dark:hover:bg-brand-950/50",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-200"
              )}
            >
              {eq.length > 55 ? eq.substring(0, 55) + "…" : eq}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setAgentsExpanded((v) => !v)}
          className="mt-4 flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          aria-expanded={agentsExpanded}
        >
          <span>6 AI agents · Powered by Z.AI GLM-4-Plus · Built for 5.5M UK small businesses</span>
          {agentsExpanded ? (
            <ChevronUp className="h-3.5 w-3.5 flex-shrink-0" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 flex-shrink-0" />
          )}
        </button>

        {agentsExpanded && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 animate-fade-in">
            {AGENTS.map((agent) => {
              const Icon = agent.icon;
              return (
                <div
                  key={agent.name}
                  className="flex items-start gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-3 transition-colors hover:border-slate-200 dark:hover:border-slate-700"
                >
                  <Icon className={cn("h-4 w-4 mt-0.5 flex-shrink-0", agent.color)} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {agent.name}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      {agent.desc}
                    </p>
                    <span className="mt-1.5 inline-block rounded-full bg-slate-200/60 dark:bg-slate-700/60 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                      {agent.tag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 px-5 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">
            Press <kbd className="rounded bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 text-[10px] font-mono">⌘ Enter</kbd> to submit
          </p>
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading || !query.trim()}
            className={cn(
              "flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200",
              "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/25",
              "hover:shadow-lg hover:shadow-brand-500/30 hover:brightness-105",
              "active:scale-[0.98]",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:brightness-100"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running pipeline…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Run agents
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
