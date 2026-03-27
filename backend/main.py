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
    company_name: Optional[str] = None
    job_title: Optional[str] = None
    salary: Optional[str] = None
    location: Optional[str] = None
    contact_email: Optional[str] = None
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
    from checks.whois_check import check_domain_age
    from checks.pincode_check import check_pincode
    from checks.mca_check import check_mca
    from checks.vt_check import check_url_safety
    from checks.hf_check import check_job_scam_hf
    from checks.dns_check import check_email_mx

    # We pass the AI-extracted company name to the MCA checker.
    extracted_company = ai_result.company_name if ai_result.company_name else "UNKNOWN_ENTITY"
    extracted_email = ai_result.contact_email if ai_result.contact_email else ""
    
    # Coordinator: Run all sensors in parallel to save time
    tasks = [
        check_domain_age(job.job_url),
        check_pincode(job.job_text),
        check_mca(extracted_company),
        check_url_safety(job.job_url),
        check_job_scam_hf(job.job_text),
        check_email_mx(extracted_email)
    ]
    
    results = await asyncio.gather(*tasks)
    domain_res, pincode_res, mca_res, vt_res, hf_res, dns_res = results

    # Compile the final checklist combining Core AI and External Digital Sensors
    real_checks = [
        Check(
            name="Primary AI Pattern Analysis",
            status="fail" if ai_result.fraud_score > 60 else "pass",
            detail=ai_result.summary,
        ),
        Check(**hf_res), # Ensemble AI Layer
        Check(**vt_res), # Cybersecurity Layer
        Check(**dns_res), # Inbound Mail Record Check
        Check(**domain_res),
        Check(**pincode_res),
        Check(**mca_res),
    ]

    return AnalysisResponse(
        verdict=ai_result.verdict,
        fraud_score=ai_result.fraud_score,
        company_name=ai_result.company_name,
        job_title=ai_result.job_title,
        salary=ai_result.salary,
        location=ai_result.location,
        contact_email=ai_result.contact_email,
        checks=real_checks,
        red_flags=ai_result.red_flags,
        green_flags=ai_result.green_flags,
        summary=ai_result.summary,
    )


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "jobguard-api"}


class SearchInput(BaseModel):
    query: str

@app.post("/search/intelligence")
async def search_intelligence(search: SearchInput):
    """
    Search for verified corporate intelligence on a company (OSINT).
    """
    from search_engine import get_corporate_intelligence
    intel = await get_corporate_intelligence(search.query)
    if not intel:
        return {"status": "error", "message": "Could not retrieve intelligence for this entity."}
    return intel


class ChatInput(BaseModel):
    message: str
    history: list[dict] = []

@app.post("/chat")
async def chat_with_assistant(chat: ChatInput):
    """
    Chat with the JobGuard assistant using Groq.
    """
    import os
    from groq import AsyncGroq
    
    api_key = os.environ.get("GROQ_API_KEY", "")
    if not api_key:
        return {"reply": "ERROR: Security engine offline. API key not found."}

    client = AsyncGroq(api_key=api_key)
    
    # Construct the message history for Groq
    messages = [
        {"role": "system", "content": """You are JobGuard Assistant, an expert in detecting employment scams and recruitment fraud. 
Help users identify red flags. 
Always use a clean, structured layout:
1. Use bullet points for lists.
2. Use clear line breaks between sections.
3. Keep responses concise but highly informative.
4. Maintain a professional, slightly hacker-ish tone."""}
    ]
    
    for msg in chat.history:
        role = "assistant" if msg["role"] == "model" else "user"
        messages.append({"role": role, "content": msg["text"]})
        
    messages.append({"role": "user", "content": chat.message})

    try:
        completion = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=300
        )
        return {"reply": completion.choices[0].message.content}
    except Exception as e:
        return {"reply": f"ERROR: Connection to intelligence server failed. {str(e)}"}
