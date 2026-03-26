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
    Uses Groq AI (llama-3.3-70b-versatile) for analysis (Phase 2),
    alongside parallel verification checks (Phase 3 & 4).
    """
    import asyncio
    from checks.whois_check import check_domain_age
    from checks.pincode_check import check_pincode
    from checks.mca_check import check_mca

    # Phase 2: Run AI Analysis
    ai_result = await analyze_job_posting(job.job_text, job.job_url)

    # Phase 3 & 4: External Verification Layer
    # We pass the AI-extracted company name to the MCA checker.
    extracted_company = ai_result.company_name if ai_result.company_name else "UNKNOWN_ENTITY"
    
    # Run the 3 heavy IO-bound checks in parallel to save time
    domain_task = check_domain_age(job.job_url)
    pincode_task = check_pincode(job.job_text)
    mca_task = check_mca(extracted_company)
    
    domain_res, pincode_res, mca_res = await asyncio.gather(
        domain_task, pincode_task, mca_task
    )

    # Compile the final checklist combining AI and External sensors
    real_checks = [
        Check(
            name="AI Pattern Analysis",
            status="fail" if ai_result.fraud_score > 50 else "pass",
            detail=ai_result.summary,
        ),
        Check(**domain_res),
        Check(**pincode_res),
        Check(**mca_res),
    ]

    return AnalysisResponse(
        verdict=ai_result.verdict,
        fraud_score=ai_result.fraud_score,
        checks=real_checks,
        red_flags=ai_result.red_flags,
        green_flags=ai_result.green_flags,
        summary=ai_result.summary,
    )


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "jobguard-api"}
