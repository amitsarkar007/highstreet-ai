import type { AgentResult, ConversationResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 2
): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (res.ok) return res;
      if (res.status >= 500 && attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      const body = await res.text().catch(() => "");
      throw new ApiError(
        body || `Request failed with status ${res.status}`,
        res.status
      );
    } catch (err) {
      if (err instanceof ApiError) throw err;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      throw new ApiError(
        err instanceof Error ? err.message : "Network error",
        0
      );
    }
  }
  throw new ApiError("Max retries exceeded", 0);
}

export async function queryAgents(
  message: string,
  conversationId?: string | null,
  context: Record<string, unknown> = {},
): Promise<ConversationResponse> {
  const res = await fetchWithRetry(`${API_URL}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      conversation_id: conversationId ?? null,
      context,
    }),
  });
  return res.json();
}

export async function clearConversation(conversationId: string): Promise<void> {
  await fetchWithRetry(`${API_URL}/api/conversation/${conversationId}`, {
    method: "DELETE",
  });
}

export async function getAgents() {
  const res = await fetchWithRetry(`${API_URL}/api/agents`, {});
  return res.json();
}

export async function healthCheck(): Promise<{ status: string; agents: string[] }> {
  const res = await fetchWithRetry(`${API_URL}/api/health`, {}, 1);
  return res.json();
}
