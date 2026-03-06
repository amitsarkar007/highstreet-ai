from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pipeline.graph import run_pipeline
from logger import log_run
from registry import AGENT_REGISTRY
import os

app = FastAPI(
    title="Highstreet AI",
    description="Autonomous AI Workforce for Small and Medium Businesses. Powered by Z.AI GLM-4-Plus. Built for the High Street.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS enabled for frontend and cross-origin requests
_cors_origins = os.getenv("CORS_ORIGINS", "*")
app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins.split(",") if "," in _cors_origins else [_cors_origins],
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str
    context: dict = {}
    deploy: bool = False    # If True, triggers Lovable deploy + Stripe link creation

@app.post("/api/query")
async def handle_query(request: QueryRequest):
    try:
        result = await run_pipeline(
            query=request.query,
            context=request.context,
            deploy=request.deploy
        )
        log_run(request.query, result)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/agents")
async def get_agents():
    return AGENT_REGISTRY

@app.get("/api/health")
async def health():
    return {"status": "ok", "agents": list(AGENT_REGISTRY.keys())}
