"use client";

import { X, Trash2, Clock, ArrowRight } from "lucide-react";
import { cn, truncate } from "@/lib/utils";
import type { HistoryEntry } from "@/lib/types";

interface QueryHistoryProps {
  open: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export function QueryHistory({
  open,
  onClose,
  history,
  onSelect,
  onRemove,
  onClear,
}: QueryHistoryProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/20 dark:bg-black/40 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full max-w-md",
          "bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800",
          "shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-label="Query history"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-5 py-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Query History
              </h2>
              {history.length > 0 && (
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                  {history.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {history.length > 0 && (
                <button
                  onClick={onClear}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear all
                </button>
              )}
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close history"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-3 py-3">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <Clock className="h-10 w-10 text-slate-200 dark:text-slate-700 mb-3" />
                <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
                  No queries yet
                </p>
                <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">
                  Your query history will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((entry) => (
                  <div
                    key={entry.id}
                    className="group rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-800/30 transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => onSelect(entry)}
                      className="w-full text-left px-4 py-3"
                    >
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 line-clamp-2">
                        {entry.query}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
                        <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
                        {entry.result.selected_agent && (
                          <>
                            <span>·</span>
                            <span className="capitalize">
                              {entry.result.selected_agent.replace(/_/g, " ")}
                            </span>
                          </>
                        )}
                        {entry.result.confidence != null && (
                          <>
                            <span>·</span>
                            <span>{Math.round(entry.result.confidence * 100)}%</span>
                          </>
                        )}
                      </div>
                    </button>
                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-4 py-1.5">
                      <button
                        type="button"
                        onClick={() => onSelect(entry)}
                        className="flex items-center gap-1 text-[11px] font-medium text-brand-500 hover:text-brand-600 transition-colors"
                      >
                        View result <ArrowRight className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(entry.id);
                        }}
                        className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
