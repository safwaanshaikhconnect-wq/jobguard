import os
import json
from groq import AsyncGroq
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv(override=True)

class AIAnalysisResult(BaseModel):
    verdict: str
    fraud_score: int
    company_name: str | None = None
    red_flags: list[str]
    green_flags: list[str]
    summary: str

async def analyze_job_posting(job_text: str, job_url: str) -> AIAnalysisResult:
    api_key = os.environ.get("GROQ_API_KEY", "")
    
    if not api_key.startswith("gsk_"):
        # Fallback to mock data if no valid key is provided yet
        return AIAnalysisResult(
            verdict="HIGH RISK",
            fraud_score=87,
            company_name="Mock Company Ltd",
            red_flags=[
                "Mock AI Flag: Salary is suspiciously high.",
                "Mock AI Flag: Vague requirements."
            ],
            green_flags=[
                "Mock AI Flag: Company name provided."
            ],
            summary="Mock response (GROQ_API_KEY not set). This posting appears to be a scam."
        )

    client = AsyncGroq(api_key=api_key)
    
    prompt = f"""You are an expert fraud investigator specializing in employment scams.
Analyze the following job posting for potential fraud patterns.

Job URL: {job_url}
Job Description:
{job_text}

Provide a structured risk assessment in JSON format. Do not include markdown formatting like ```json or anything else. Just return valid raw JSON matching exactly this schema:
{{
  "verdict": "SAFE" | "SUSPICIOUS" | "HIGH RISK",
  "fraud_score": <int between 0 and 100, where 100 is definitely a scam. If extremely safe, use 0-5.>,
  "company_name": "<extracted company name from text/URL, or empty if unknown>",
  "red_flags": ["flag 1", "flag 2"],
  "green_flags": ["flag 1"],
  "summary": "<2 sentence explanation>"
}}
"""

    try:
        response = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You output JSON matching the requested schema. Nothing else."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.1,
            max_tokens=1024
        )
        
        content = response.choices[0].message.content
        # Strip potential markdown formatting that Llama sometimes adds
        content = content.replace("```json", "").replace("```", "").strip()
        data = json.loads(content)
        return AIAnalysisResult(**data)
    except Exception as e:
        error_msg = str(e)
        print(f"Failed to parse Groq response or API error: {error_msg}")
        return AIAnalysisResult(
            verdict="SUSPICIOUS",
            fraud_score=50,
            red_flags=[f"Error connecting to analysis engine: {error_msg}"],
            green_flags=[],
            summary="The AI analysis engine encountered an error. Check the server logs."
        )
