# Highstreet AI

> Autonomous AI workforce for small businesses — Operations, HR, AI Adoption, Market Intelligence. Powered by Z.AI GLM.

Built for **UK AI Agent Hack EP4 x OpenClaw**.

---

## Prize Targets

- **Z.AI Bounty** ($4,000 pool) — GLM powers all agents across classification, generation, reasoning and orchestration
- **FLock Track** ($5,000 pool) — SDG 8: Decent Work & Economic Growth for 5.5M UK SMBs
- **Anyway Track** (Mac Mini) — Full agent tracing + Stripe Connect commercialisation

---

## Stack

| Layer | Technology |
|-------|------------|
| **LLM** | Z.AI GLM (`glm-5`) with FLock fallback |
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
Guardrails (regex + LLM safety check)
   │
   ▼
Orchestrator Assess ──► needs_clarification? ──► return questions
   │ sufficient
   ▼
Orchestrator Route
   │
   ├─► Operations Agent
   ├─► HR & Wellbeing Agent
   ├─► AI Adoption Optimizer
   └─► Market Intelligence Agent
         │
         ▼
      Reviewer (QA + risk flagging)
         │
         ▼
      Final Output
```

Multi-turn conversations are supported — the orchestrator asks clarifying questions for vague queries before routing.

---

## Z.AI Integration

All agents are powered by Z.AI's GLM model via the Z.AI v1 Chat Completions API. FLock API serves as an automatic fallback (retries up to 3 times then switches).

| Agent | GLM Usage |
|-------|-----------|
| Guardrails | Safety classification — crisis detection, prompt injection, scope filtering |
| Orchestrator | Intent classification + business role detection + routing logic |
| Operations Agent | Workflow reasoning + operational recommendation generation |
| HR & Wellbeing Agent | UK employment policy interpretation + wellbeing response generation |
| AI Adoption Optimizer | Scoring logic + automation gap analysis + ROI estimation |
| Market Intelligence Agent | Trend synthesis + demand signal interpretation + seasonal forecasting |
| Reviewer | Output validation + risk flagging + clarity improvement |

**Model**: `glm-5` (configurable via `ZAI_MODEL`)
**Fallback**: FLock API (open-source models) — automatic, zero config

### Why GLM?

GLM powers the entire reasoning layer of Highstreet AI — from understanding a bakery owner's inventory problem to generating a structured 4-week growth plan. Each agent uses GLM for a different reasoning task, demonstrating the model's versatility across classification, generation, validation, and orchestration.

---

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Z.AI API key (required) — [z.ai/manage-apikey](https://z.ai/manage-apikey/apikey-list)

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
| `ZAI_API_KEY` | **Yes** | [z.ai/manage-apikey](https://z.ai/manage-apikey/apikey-list) |
| `ZAI_BASE_URL` | No | Default: `https://api.z.ai/api/paas/v4` |
| `ZAI_MODEL` | No | Default: `glm-5` |
| `FLOCK_API_KEY` | No | [platform.flock.io](https://platform.flock.io) — fallback when Z.AI is unavailable |
| `FLOCK_BASE_URL` | No | Default: `https://platform.flock.io/api/v1` |
| `ANYWAY_API_KEY` | No | Anyway tracing (hackathon sponsor) |
| `ANYWAY_PROJECT_ID` | No | Anyway project ID |
| `ANYWAY_ENABLED` | No | Set `false` to disable tracing |
| `STRIPE_SECRET_KEY` | No | Stripe integration |
| `FRONTEND_URL` | No | CORS origin (default: `http://localhost:3000`) |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/query` | Submit a query — runs the full agent pipeline |
| `DELETE` | `/api/conversation/{id}` | Clear a conversation |
| `GET` | `/api/agents` | List the agent registry |
| `GET` | `/api/health` | Health check |

Rate limited to 20 requests per 10 minutes per IP.

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
│   │   └── graph.py                     # LangGraph workflow definition
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
│   │   ├── api.ts                       # Backend API client
│   │   ├── types.ts                     # TypeScript interfaces
│   │   ├── hooks.ts                     # Custom React hooks
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

Watch the pipeline trace animate: `GUARDRAILS → ORCHESTRATOR → OPERATIONS AGENT → REVIEWER → OUTPUT`

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
| `404 Not Found` for Z.AI | Ensure `ZAI_BASE_URL=https://api.z.ai/api/paas/v4` |
| `uvicorn` not found | Run with `python -m uvicorn main:app --reload` |
| Anyway SSL errors | Set `ANYWAY_ENABLED=false` in `.env` |
| Hydration error in Next.js | Ensure `globals.css` is imported in `layout.tsx` |
| Rate limited | Wait 10 minutes or restart the backend |

---

## License

MIT
