# Highstreet AI

> Autonomous AI workforce for small businesses. Idea → Landing Page → Revenue. Powered by Z.AI GLM.

Built for UK AI Agent Hack EP4 x OpenClaw.

## Prize Targets

- 🥇 **Z.AI Bounty** ($4,000 pool) — GLM-4-Plus powers all 6 agents across classification, generation, reasoning and orchestration
- 🥇 **FLock Track** ($5,000 pool) — SDG 8: Decent Work & Economic Growth for 5.5M UK SMBs
- 🏆 **Anyway Track** (Mac Mini) — Full agent tracing + Stripe Connect commercialisation

## Stack

- **LLM**: Z.AI GLM-5 (with FLock fallback)
- **Orchestration**: LangGraph multi-agent pipeline
- **Deploy**: Lovable Build with URL
- **Payments**: Stripe Connect
- **Tracing**: Anyway SDK (optional)
- **Backend**: FastAPI
- **Frontend**: Next.js 14

## Z.AI Integration

All agents are powered by Z.AI's GLM-4-Plus model via the Z.AI API.
FLock API serves as an automatic fallback using open-source models.

| Agent | GLM Usage Type |
|-------|---------------|
| Orchestrator Agent | Intent classification + role detection + routing logic |
| Operations Agent | Workflow reasoning + operational recommendation generation |
| HR & Wellbeing Agent | Policy interpretation + wellbeing response generation |
| AI Adoption Optimizer | Scoring logic + automation gap analysis + ROI estimation |
| Market Intelligence Agent | Trend synthesis + demand signal interpretation |
| Reviewer Agent | Output validation + risk flagging + clarity improvement |

**Model**: `glm-4-plus`  
**Endpoint**: Z.AI v1 Chat Completions API  
**Fallback**: FLock API (open-source models) — automatic, zero config  
**Orchestration**: LangGraph multi-agent pipeline  

### Why GLM-4-Plus?
GLM-4-Plus powers the entire reasoning layer of Highstreet AI — from understanding 
a bakery owner's inventory problem to generating a structured 4-week growth plan. 
Each of the 6 agents uses GLM for a different reasoning task, demonstrating 
the model's versatility across classification, generation, validation, and orchestration.

## Pipeline

```
User Query → Orchestrator → [CEO | Adoption | HR] Agent → Reviewer → Final Output
```

---

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- API keys for Z.AI (required) and optionally FLock, Stripe

### 1. Clone and setup environment

```bash
git clone https://github.com/amitsarkar007/ceo-claw.git
cd ceo-claw  # or cd highstreet-ai if you've renamed the project folder
cp .env.example .env
```

Edit `.env` and add your API keys (see [API Keys](#api-keys) below).

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

- Health: http://localhost:8000/api/health
- API docs: http://localhost:8000/docs

---

## API Keys

| Key | Required | Where to get |
|-----|----------|--------------|
| `ZAI_API_KEY` | **Yes** | [z.ai/manage-apikey](https://z.ai/manage-apikey/apikey-list) |
| `ZAI_BASE_URL` | No | Default: `https://api.z.ai/api/paas/v4` |
| `ZAI_MODEL` | No | Default: `glm-5` |
| `FLOCK_API_KEY` | No | [platform.flock.io](https://platform.flock.io) — fallback when Z.AI fails |
| `FLOCK_BASE_URL` | No | Default: `https://platform.flock.io/api/v1` |
| `STRIPE_SECRET_KEY` | No | [dashboard.stripe.com](https://dashboard.stripe.com) — for payment links |
| `ANYWAY_API_KEY` | No | Hackathon sponsor — set `ANYWAY_ENABLED=false` to disable |
| `ANYWAY_PROJECT_ID` | No | For Anyway tracing |

**Lovable** does not require an API key — it uses [Build with URL](https://docs.lovable.dev/integrations/build-with-url).

---

## Running with Docker

```bash
docker-compose up --build
```

- Backend: http://localhost:8000
- Frontend: http://localhost:3000

Create `.env` in the project root before running (copy from `.env.example`).

---

## Project Structure

```
highstreet-ai/
├── backend/                 # FastAPI
│   ├── main.py              # Entry point, routes
│   ├── agents/              # Orchestrator, CEO, Adoption, HR, Reviewer
│   ├── pipeline/graph.py    # LangGraph workflow
│   ├── integrations/       # Z.AI, Lovable, Stripe, Anyway
│   ├── schemas/
│   ├── registry.py
│   └── logger.py
├── frontend/                # Next.js 14
│   ├── app/page.tsx         # Main UI
│   └── ...
├── logs/                    # JSON run logs (gitignored)
├── .env.example             # Template — copy to .env
└── docker-compose.yml
```

---

## Agent Registry

| Agent | Purpose |
|-------|---------|
| **Orchestrator** | Routes by role + intent |
| **CEO Agent** | Startup ideas, landing pages, Lovable deploy, Stripe links |
| **Adoption Optimizer** | AI usage scoring, time saved, automation gaps |
| **HR Agent** | Onboarding, policy, wellbeing, training |
| **Reviewer** | Output QA, clarity, risk flagging |

---

## Demo Script (5 minutes)

**The Character**: Meet Emma, owner of a coffee shop on the high street.

**Step 1** — Enter this query:
"How can I reduce pastry waste and better manage the morning rush in my coffee shop?"

Hit Run. Walk the judge through the pipeline trace animating:
ORCHESTRATOR → OPERATIONS AGENT → REVIEWER → OUTPUT

**Step 2** — Show the output:
- Business Profile card: coffee_shop / owner
- Operations Agent recommendations
- Next actions panel
- Risks and assumptions

**Step 3** — Enter a second query to show multi-agent routing:
"I'm struggling to get my staff to use AI tools at my bakery — how do I measure if it's working?"

This routes to the ADOPTION AGENT instead — show that the orchestrator picks the right specialist automatically.

**Step 4** — Show the dashboard metrics panel:
Active Agents: 4
AI Adoption Score: 68%
Estimated Time Saved: 8 hrs/week
Recommended Next Automations: inventory tracking, shift scheduling, promotions

**Closing line**:
"Highstreet AI gives every small business owner their own digital workforce —
without needing a single developer on staff."

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `404 Not Found` for Z.AI | Ensure `ZAI_BASE_URL=https://api.z.ai/api/paas/v4` |
| `uvicorn` not found | Use `python -m uvicorn main:app --reload` |
| Anyway SSL errors | Add `ANYWAY_ENABLED=false` to `.env` |
| No Lovable URL | Use a startup/idea query (CEO agent), not HR/training |
| Hydration error | Ensure `globals.css` is imported in `layout.tsx` |

---

## Key Files

- `backend/pipeline/graph.py` — LangGraph workflow
- `backend/agents/` — All specialist agents
- `backend/integrations/zai.py` — Z.AI client
- `backend/integrations/lovable.py` — Lovable Build with URL
- `frontend/app/page.tsx` — Main UI

---

## License

MIT
