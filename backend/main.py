from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from analyzer import analyze_job_posting

app = FastAPI(
    title="JobGuard API",
    description="Fake job detection backend powered by AI analysis",
    version="1.0.0",
)

# CORS — allow React frontend (Vite dev server on port 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class JobInput(BaseModel):
    job_text: Optional[str] = ""
    job_url: Optional[str] = ""


class Check(BaseModel):
    name: str
    status: str  # "pass", "fail", or "unknown"
    detail: str


class AnalysisResponse(BaseModel):
    verdict: str  # "SAFE", "SUSPICIOUS", "HIGH RISK"
    fraud_score: int
    checks: list[Check]
    red_flags: list[str]
    green_flags: list[str]
    summary: str


@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_job(job: JobInput):
    """
    Analyze a job posting for potential fraud.
    Uses Groq AI (llama-3.3-70b-versatile) for analysis (Phase 2).
    Verification checks will be added in Phase 3 & 4.
    """
    ai_result = await analyze_job_posting(job.job_text, job.job_url)

    mock_checks = [
        Check(
            name="AI Pattern Analysis",
            status="fail" if ai_result.fraud_score > 50 else "pass",
            detail=ai_result.summary,
        ),
        Check(
            name="Company Verification",
            status="unknown",
            detail="Verification checks will be implemented in Phase 3.",
        ),
        Check(
            name="Salary Sanity Check",
            status="unknown",
            detail="Salary check will be implemented in Phase 3.",
        ),
        Check(
            name="Domain Age Check",
            status="unknown",
            detail="Domain age will be implemented in Phase 3.",
        ),
        Check(
            name="Address Validation",
            status="unknown",
            detail="Address validation will be implemented in Phase 3.",
        ),
    ]

    return AnalysisResponse(
        verdict=ai_result.verdict,
        fraud_score=ai_result.fraud_score,
        checks=mock_checks,
        red_flags=ai_result.red_flags,
        green_flags=ai_result.green_flags,
        summary=ai_result.summary,
    )


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "jobguard-api"}
