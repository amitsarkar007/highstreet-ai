# Highstreet AI

> Autonomous AI workforce for small businesses — Operations, HR, AI Adoption, Market Intelligence. Powered by Z.AI GLM.

Built for **UK AI Agent Hack EP4 x OpenClaw**.

---

## Prize Targets

### AI Agents for Good – Flock.io ($5,000)
Highstreet AI deploys a coordinated digital workforce of AI agents that help small and medium-sized businesses improve productivity, reduce operational inefficiencies, and adopt AI safely. With 5.5M SMBs in the UK alone — coffee shops, clinics, accountants, local retailers — these businesses have historically been priced out of enterprise AI. Highstreet AI changes that, directly supporting SDG 8: Decent Work & Economic Growth through inclusive digital transformation.

### Z.AI General Bounty ($4,000)
Highstreet AI uses Z.AI's GLM model to power the entire reasoning layer — from intent classification and business-type detection in the Orchestrator, to workflow analysis in the Operations Agent, policy interpretation in the HR Agent, and output validation in the Reviewer. Every agent uses GLM for a different reasoning task (classification, generation, orchestration, validation), demonstrating the model's versatility across a real multi-agent production system.

### CEO Claw Challenge – AfterQuery ($1,000)
Highstreet AI acts as an AI business advisor for small business owners — helping them make data-driven decisions without a consultant on payroll. The platform analyses business workflows and delivers actionable recommendations on staffing, inventory planning, marketing strategy, and operational optimisation. In practice it functions as an AI co-founder: ask it a question in plain English, get a structured plan back.

### AI Agent for Satellite Imagery Analytics – The Compression Company (£1,000)
The Market Intelligence Agent is designed to incorporate geospatial and environmental signals — including satellite-derived indicators such as weather patterns, urban activity, and regional infrastructure changes — alongside business data for demand forecasting and operational planning. For example, a coffee shop could use weather data to anticipate increased demand during rainy mornings or seasonal foot-traffic shifts, enabling smarter inventory and staffing decisions. *(Note: current implementation uses publicly available weather and trend signals; full satellite data integration is a natural extension of this architecture.)*

### Animoca Bounty ($1,000)
Highstreet AI introduces a structured digital workforce: autonomous AI agents with defined roles, capabilities, and collaboration patterns operating within a business ecosystem. The Orchestrator coordinates specialist agents (Operations, HR, Market Intelligence, AI Adoption) the way a management layer coordinates a team — each agent contributing to outcomes neither could achieve alone. This agent-as-worker model is a concrete instantiation of autonomous digital agents operating in an economic environment.

### AnyWay Bounty (Mac Mini)
Highstreet AI instruments every agent pipeline step with the Anyway SDK, providing full observability into agent activities, workflow execution, and performance. The platform also tracks productivity metrics (AI adoption score, tasks completed by agents, estimated hours saved) and includes Stripe Connect for commercial monetisation — demonstrating a path from hackathon prototype to paid product.

### Claw for Human – Imperial Blockchain ($500)
Highstreet AI is designed as a human-centred platform that empowers small business owners rather than replacing their judgment. Business owners interact through natural language queries and receive structured, plain-English recommendations they can act on immediately — no ML expertise required. The system augments human decision-making; it does not automate it away.

### Human for Claw – Imperial Blockchain ($500)
The Reviewer Agent acts as a governance and validation layer across every pipeline run. Before any output reaches the user, it validates factual consistency, enforces plain English, checks UK-specific regulatory content, and flags risks. This explicit oversight mechanism ensures AI-generated recommendations are responsible, transparent, and trustworthy — not just fast.

---

## Stack

| Layer | Technology |
|-------|------------|
| **LLM** | Z.AI GLM (`glm-4-plus`) with FLock fallback |
| **Orchestration** | LangGraph multi-agent pipeline |
| **Backend** | FastAPI + Python 3.11 |
| **Frontend** | Next.js 14 · React 18 · TypeScript · Tailwind CSS |
| **Tracing** | Anyway SDK (optional) |
| **Deployment** | Docker Compose |

---

## Architecture

```
User Query
   │
   ▼
Guardrails (regex + LLM safety check)       ◄── SSE: step started/complete
   │
   ▼
Orchestrator Assess ──► needs_clarification? ──► return questions
   │ sufficient                                  ◄── SSE: step started/complete
   ▼
Orchestrator Route                               ◄── SSE: step started/complete
   │
   ├─► Operations Agent
   ├─► HR & Wellbeing Agent                      ◄── SSE: step started/complete
   ├─► AI Adoption Optimizer
   └─► Market Intelligence Agent
         │
         ▼
      Reviewer (QA + risk flagging)              ◄── SSE: step started/complete
         │
         ▼
      Final Output                               ◄── SSE: result
```

Multi-turn conversations are supported — the orchestrator asks clarifying questions for vague queries before routing.

The entire pipeline streams real-time progress events via **Server-Sent Events (SSE)** so the frontend can display a live ticker showing exactly which agent is working and how long each step takes.

---

## Z.AI Integration

All agents are powered by Z.AI's GLM model via the [Z.AI Chat Completions API](https://docs.z.ai/api-reference/introduction). [FLock API](https://docs.flock.io/flock-products/api-platform/api-endpoint) serves as an automatic fallback (retries up to 3 times then switches).

| Agent | GLM Usage |
|-------|-----------|
| Guardrails | Safety classification — crisis detection, prompt injection, scope filtering |
| Orchestrator | Intent classification + business role detection + routing logic |
| Operations Agent | Workflow reasoning + operational recommendation generation |
| HR & Wellbeing Agent | UK employment policy interpretation + wellbeing response generation |
| AI Adoption Optimizer | Scoring logic + automation gap analysis + ROI estimation |
| Market Intelligence Agent | Trend synthesis + demand signal interpretation + seasonal forecasting |
| Reviewer | Output validation + risk flagging + clarity improvement |

**Model**: `glm-4-plus` (configurable via `ZAI_MODEL`)
**Fallback**: FLock API (open-source models, default: `deepseek-v3`) — automatic after 3 retries, zero config

> **Note**: `glm-5` is a reasoning model that only supports streaming responses. The backend uses non-streaming requests, so use `glm-4-plus` (recommended) or implement streaming if you want to use `glm-5`.

### Why GLM?

GLM powers the entire reasoning layer of Highstreet AI — from understanding a bakery owner's inventory problem to generating a structured 4-week growth plan. Each agent uses GLM for a different reasoning task, demonstrating the model's versatility across classification, generation, validation, and orchestration.

---

## Key Features

- **Real-time pipeline streaming** — SSE endpoint (`/api/query/stream`) emits live progress events as each agent works; the frontend displays a Pipeline Ticker with per-stage status, messages, and elapsed time
- **Per-chat state isolation** — each conversation stores its own pipeline events, results, and conversation ID; switching between chats instantly restores the correct view
- **Concurrent processing** — start a new query while another is still running; background streams keep writing to their respective history entries
- **Multi-turn conversations** — the orchestrator asks clarifying questions for vague queries before routing to a specialist
- **Chat management** — instant history sidebar updates, delete individual chats, "Processing" badge on in-flight entries
- **Automatic LLM fallback** — Z.AI GLM-4-Plus with seamless FLock failover after 3 retries
- **Two-tier guardrails** — regex pattern matching for crisis/injection + LLM safety classifier

---

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Z.AI API key (required) — [z.ai/manage-apikey](https://z.ai/manage-apikey/apikey-list) · [API reference](https://docs.z.ai/api-reference/introduction)

### 1. Clone and configure

```bash
git clone https://github.com/amitsarkar007/highstreet-ai.git
cd highstreet-ai
cp .env.example .env
```

Edit `.env` and add your API keys (see [Environment Variables](#environment-variables)).

### 2. Start the backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at **http://localhost:8000**

### 3. Start the frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:3000**

### 4. Verify

- Health check: http://localhost:8000/api/health
- API docs: http://localhost:8000/docs

---

## Running with Docker

```bash
docker-compose up --build
```

- Backend: http://localhost:8000
- Frontend: http://localhost:3000

Create `.env` in the project root before running (copy from `.env.example`).

---

## Environment Variables

| Key | Required | Description |
|-----|----------|-------------|
| `ZAI_API_KEY` | **Yes** | [Z.AI API Keys](https://z.ai/manage-apikey/apikey-list) · [API docs](https://docs.z.ai/api-reference/introduction) |
| `ZAI_BASE_URL` | No | Default: `https://api.z.ai/api/paas/v4` |
| `ZAI_MODEL` | No | Default: `glm-4-plus` (`glm-5` requires streaming, not yet supported) |
| `FLOCK_API_KEY` | No | [FLock Platform](https://platform.flock.io) · [API docs](https://docs.flock.io/flock-products/api-platform/api-endpoint) — fallback when Z.AI is unavailable |
| `FLOCK_BASE_URL` | No | Default: `https://api.flock.io/v1` |
| `ANYWAY_API_KEY` | No | Anyway tracing (hackathon sponsor) |
| `ANYWAY_PROJECT_ID` | No | Anyway project ID |
| `ANYWAY_ENABLED` | No | Set `false` to disable tracing |
| `STRIPE_SECRET_KEY` | No | Stripe integration |
| `FRONTEND_URL` | No | CORS origin (default: `http://localhost:3000`) |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/query` | Submit a query — blocking, returns full result |
| `POST` | `/api/query/stream` | Submit a query — SSE stream with real-time pipeline events |
| `DELETE` | `/api/conversation/{id}` | Clear a conversation |
| `GET` | `/api/agents` | List the agent registry |
| `GET` | `/api/health` | Health check |

Rate limited to 20 requests per 10 minutes per IP.

### SSE Stream Events

The `/api/query/stream` endpoint returns `text/event-stream` with these event types:

| Event Type | Description |
|------------|-------------|
| `conversation` | Emitted first — contains the `conversation_id` |
| `step` | Pipeline progress — includes `agent`, `status` (`started`/`complete`), `message` |
| `clarifying` | Orchestrator needs more info — contains `questions` array |
| `guardrail` | Safety check triggered — contains `guardrail_message` |
| `result` | Final output — contains the full `data` object |
| `error` | Something went wrong — contains error `message` |

---

## Project Structure

```
highstreet-ai/
├── backend/
│   ├── main.py                          # FastAPI entry point + routes
│   ├── agents/
│   │   ├── orchestrator.py              # Intent classification + routing
│   │   ├── operations_agent.py          # Workflow, logistics, scheduling
│   │   ├── hr_agent.py                  # HR, wellbeing, UK employment
│   │   ├── adoption_agent.py            # AI adoption scoring + automation
│   │   ├── market_intelligence_agent.py # Demand forecasting + trends
│   │   ├── reviewer.py                  # Output QA + risk flagging
│   │   └── guardrails.py               # Safety: regex + LLM classifier
│   ├── pipeline/
│   │   └── graph.py                     # LangGraph workflow + SSE streaming generators
│   ├── integrations/
│   │   ├── zai.py                       # Z.AI client (with FLock fallback)
│   │   └── anyway.py                    # Anyway SDK tracing
│   ├── schemas/
│   │   ├── conversation.py              # QueryRequest, QueryResponse, Message
│   │   └── response.py                  # Structured response models
│   ├── store/
│   │   └── conversations.py             # In-memory conversation state
│   ├── utils/
│   │   └── json_parse.py               # Robust JSON extraction from LLM output
│   ├── registry.py                      # Agent metadata registry
│   ├── logger.py                        # JSON run logging
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── app/
│   │   ├── layout.tsx                   # Root layout + metadata
│   │   ├── page.tsx                     # Main chat UI
│   │   ├── globals.css                  # Global styles
│   │   ├── dashboard/page.tsx           # Dashboard view
│   │   └── product/[id]/page.tsx        # Product detail view
│   ├── components/
│   │   ├── Header.tsx                   # App header
│   │   ├── Footer.tsx                   # App footer
│   │   ├── QueryInput.tsx               # Query input form
│   │   ├── QueryPanel.tsx               # Query submission panel
│   │   ├── QueryHistory.tsx             # Conversation history sidebar
│   │   ├── ResultsPanel.tsx             # Structured results display
│   │   ├── PipelineIndicator.tsx        # Agent pipeline animation
│   │   └── Toast.tsx                    # Notification toasts
│   ├── lib/
│   │   ├── api.ts                       # Backend API client (REST + SSE streaming)
│   │   ├── types.ts                     # TypeScript interfaces (PipelineEvent, HistoryEntry, etc.)
│   │   ├── hooks.ts                     # Custom React hooks (per-entry pipeline events)
│   │   └── utils.ts                     # Utility functions
│   ├── public/
│   │   └── favicon.svg
│   ├── package.json
│   ├── tailwind.config.js
│   └── Dockerfile
├── logs/                                # JSON run logs (gitignored)
├── .env.example
├── docker-compose.yml
└── README.md
```

---

## Agent Registry

| Agent | Purpose |
|-------|---------|
| **Guardrails** | Two-tier safety — regex patterns for crisis/injection + LLM classifier for scope |
| **Orchestrator** | Classifies business type, sector, role, and intent; routes to the right specialist |
| **Operations Agent** | Workflow optimisation, logistics, scheduling, incident response with UK sector metrics |
| **HR & Wellbeing Agent** | Onboarding, policy, wellbeing, training — grounded in UK employment law |
| **AI Adoption Optimizer** | AI readiness score (0–100), automation roadmap, time-saved estimates |
| **Market Intelligence Agent** | Demand forecasting, seasonal calendar, competitor landscape, opportunity signals |
| **Reviewer** | Validates numbers, enforces plain English, UK-specific content, safety checks |

---

## Demo Script (5 minutes)

**The Character**: Meet Emma, owner of a coffee shop on the high street.

**Step 1** — Enter this query:

> "How can I reduce pastry waste and better manage the morning rush in my coffee shop?"

Watch the **live Pipeline Ticker** — real-time SSE events show each stage as it runs:

```
✓ Safety Check        Safety checks passed                 0.4s
✓ Context Analysis    Context analysed                     0.8s
✓ Orchestrator        Detected coffee shop → Operations    1.1s
⟳ Operations Agent    Analysing operations & workflows
○ Quality Review      Waiting
```

**Step 2** — Show the structured output:
- Business Profile card (coffee_shop / owner)
- Operations Agent recommendations with quick wins
- Action plan with timeline
- Risks and assumptions

**Step 3** — Enter a second query to demonstrate multi-agent routing:

> "I'm struggling to get my staff to use AI tools at my bakery — how do I measure if it's working?"

This routes to the **Adoption Agent** instead — the orchestrator picks the right specialist automatically.

**Step 4** — Show the dashboard metrics:
- Active Agents: 4
- AI Adoption Score: 68%
- Estimated Time Saved: 8 hrs/week
- Recommended Next Automations: inventory tracking, shift scheduling, promotions

**Closing**:
"Highstreet AI gives every small business owner their own digital workforce — without needing a single developer on staff."

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Z.AI returns `500` error | You're likely using `glm-5` which only supports streaming. Change `ZAI_MODEL=glm-4-plus` in `.env` |
| "Z.AI failed after 3 attempts" in logs | Check `ZAI_MODEL` (use `glm-4-plus`), verify API key at [z.ai/manage-apikey](https://z.ai/manage-apikey/apikey-list) |
| React error: "Objects are not valid as a React child" | The LLM returned structured objects instead of strings. The frontend `safeText()` helper handles this — ensure you're on the latest code |
| `404 Not Found` for Z.AI | Ensure `ZAI_BASE_URL=https://api.z.ai/api/paas/v4` — see [Z.AI docs](https://docs.z.ai/api-reference/introduction) |
| `401 Unauthorized` for Z.AI | Regenerate your API key at [z.ai/manage-apikey](https://z.ai/manage-apikey/apikey-list) |
| FLock fallback fires on every request | Normal if Z.AI model is misconfigured. Check `ZAI_MODEL` — `glm-4-plus` is recommended |
| FLock fallback also fails | Ensure `FLOCK_BASE_URL=https://api.flock.io/v1` — see [FLock docs](https://docs.flock.io/flock-products/api-platform/api-endpoint) |
| `uvicorn` not found | Run with `python -m uvicorn main:app --reload` |
| Anyway SSL errors | Set `ANYWAY_ENABLED=false` in `.env` |
| Hydration error in Next.js | Ensure `globals.css` is imported in `layout.tsx` |
| Rate limited | Wait 10 minutes or restart the backend |

---

## License

MIT
