"use client";

import { useState, useEffect, useCallback } from "react";
import type { HistoryEntry, AgentResult } from "./types";

const HISTORY_KEY = "highstreet-ai-history";
const MAX_HISTORY = 50;

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) setValue(JSON.parse(stored));
    } catch {
      // ignore parse errors
    }
    setLoaded(true);
  }, [key]);

  const setStoredValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof newValue === "function"
            ? (newValue as (prev: T) => T)(prev)
            : newValue;
        try {
          localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // quota exceeded
        }
        return resolved;
      });
    },
    [key]
  );

  return [value, setStoredValue, loaded] as const;
}

export function useQueryHistory() {
  const [history, setHistory, loaded] = useLocalStorage<HistoryEntry[]>(
    HISTORY_KEY,
    []
  );

  const addEntry = useCallback(
    (query: string, result: AgentResult) => {
      const entry: HistoryEntry = {
        id: crypto.randomUUID?.() ?? Date.now().toString(36),
        query,
        result,
        timestamp: Date.now(),
      };
      setHistory((prev) => [entry, ...prev].slice(0, MAX_HISTORY));
    },
    [setHistory]
  );

  const removeEntry = useCallback(
    (id: string) => {
      setHistory((prev) => prev.filter((e) => e.id !== id));
    },
    [setHistory]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  return { history, addEntry, removeEntry, clearHistory, loaded };
}

export function useToast() {
  const [toasts, setToasts] = useState<
    { id: string; message: string; type: "success" | "error" }[]
  >([]);

  const toast = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      const id = Date.now().toString(36);
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, toast, dismiss };
}
