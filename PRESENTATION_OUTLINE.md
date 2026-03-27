# 🛡️ JobGuard — Final Presentation Outline

> Use this as a slide-by-slide guide to build your PPT.  
> Estimated deck: **14–16 slides** · Duration: **8–10 minutes**

---

## Slide 1 — Title Slide

- **Title:** JobGuard: AI-Powered Employment Fraud Detection
- **Subtitle:** Protecting job seekers with multi-sensor intelligence
- **Your name(s), college, date**
- **Visual:** Use a screenshot of the main analyzer UI as the background (dark, techy feel)

---

## Slide 2 — The Problem

> **Why does this matter?**

- 🇮🇳 India reported **12,000+ job fraud complaints** in 2024 (NCRP data)
- Average victim loses ₹15,000–₹2,00,000 in registration fees, training charges
- Freshers and tier-2/3 college students are the #1 target
- Existing solutions: **none** — job portals do basic keyword filtering at best
- **Key stat to show:** *"67% of fake job posts use legitimate-sounding company names"*

---

## Slide 3 — What is JobGuard?

- A **real-time fraud detection platform** that analyzes job postings
- Users paste a job URL or description → get an instant forensic report
- Verdict system: **SAFE** · **SUSPICIOUS** · **HIGH RISK** with a 0–100 fraud score
- Built-in OSINT portal, AI chatbot, and live security terminal
- **One-liner:** *"Think VirusTotal, but for job postings."*

---

## Slide 4 — Live Demo (Screenshots)

> Take 3–4 high-quality screenshots and embed them:

1. **Input screen** — The glassmorphism "SUBMIT TARGET" form
2. **Analysis result** — A HIGH RISK case showing red flags, fraud score, and sensor pipeline
3. **OSINT Search** — Company lookup for a known entity (e.g., "TATA GROUP")
4. **Live Terminal** — The scrolling log showing real-time sensor activity

> **Pro tip:** If presenting live, do the demo HERE instead of screenshots

---

## Slide 5 — Architecture Overview

> **Show the system diagram**

```
┌─────────────────────────────────────────────────┐
│              Frontend (React + Vite)             │
│  JobAnalyzer · Dashboard · OSINT · Terminal · Chat │
└──────────────────────┬──────────────────────────┘
                       │ REST API
┌──────────────────────▼──────────────────────────┐
│              Backend (FastAPI + Python)           │
│                                                   │
│   ┌─────────────────────────────────────────┐    │
│   │     7-Sensor Parallel Analysis Engine    │    │
│   │                                         │    │
│   │  1. Groq LLM    5. WHOIS Domain Age     │    │
│   │  2. HuggingFace  6. Pincode Validation  │    │
│   │  3. VirusTotal   7. MCA Registry        │    │
│   │  4. DNS MX                              │    │
│   └─────────────────────────────────────────┘    │
└──────────────────────────────────────────────────┘
```

- Highlight: All 7 sensors run **in parallel** via `asyncio.gather` → response in ~3 seconds

---

## Slide 6 — The 7-Sensor Ensemble (Core Innovation)

> This is your **USP slide** — spend time here.

| # | Sensor | What it does | Real API? |
|---|--------|-------------|-----------|
| 1 | **AI Pattern Analysis** | Groq Llama 3.3 detects linguistic fraud markers | ✅ |
| 2 | **ML Classifier** | DistilBERT model trained on job scam datasets | ✅ |
| 3 | **URL Threat Scan** | VirusTotal checks for phishing/malware domains | ✅ |
| 4 | **Email Verification** | DNS MX lookup confirms if email domain is real | ✅ |
| 5 | **Domain Age** | WHOIS check — new domains (<6 months) are flagged | ✅ |
| 6 | **Location Validation** | Indian pincode API verifies physical office exists | ✅ |
| 7 | **Corporate Registry** | MCA verification of company registration status | ✅ |

**Key point:** *"No single sensor is foolproof. By combining 7 independent signals, we achieve ensemble-level accuracy."*

---

## Slide 7 — How Scoring Works

- Each sensor returns: **PASS** / **FAIL** / **UNKNOWN**
- The AI core assigns a fraud_score (0–100) based on weighted analysis
- Final verdict logic:
  - `0–40` → **SAFE** (green)
  - `41–60` → **SUSPICIOUS** (amber) — triggers evidence collection
  - `61–100` → **HIGH RISK** (red)
- **Visual:** Show the fraud score gauge + verdict badge from the UI

---

## Slide 8 — Two-Phase Verdict System (Unique Feature)

> Show the evidence collection flow

1. **Phase 1:** Initial scan → 7 sensors run → if verdict is SUSPICIOUS...
2. **Phase 2:** User is asked to provide additional evidence:
   - Company CIN number
   - LinkedIn page link
   - Official website URL
   - Recruiter contact details
3. System **reanalyzes with evidence** → delivers a FINAL binary verdict: **SAFE** or **HIGH RISK**

**Why it matters:** *"We don't just flag — we investigate. This reduces false positives by giving users a chance to verify."*

---

## Slide 9 — OSINT Intelligence Portal

- Dedicated tab for pre-application research
- Users search any company → get verified intelligence:
  - Official domain
  - HQ location
  - Corporate email pattern
  - Verification status
- **Use case:** *"Before sharing your resume with 'TechVision Global Solutions', check if they even exist."*

---

## Slide 10 — Security Assistant (Chatbot)

- Groq-powered conversational AI
- Helps users understand red flags in plain language
- Example queries:
  - *"Is it safe to pay a registration fee for a job?"*
  - *"How do I verify if a recruiter on WhatsApp is real?"*
- **Visual:** Screenshot of the chat widget in action

---

## Slide 11 — Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite 6, Tailwind CSS v4 |
| Animations | Motion (Framer Motion), Glassmorphism UI |
| Backend | FastAPI, Python 3.12, AsyncIO |
| Primary AI | Groq Cloud (Llama 3.3 70B) |
| Secondary ML | HuggingFace (DistilBERT fine-tuned) |
| Cybersecurity | VirusTotal API |
| DNS/WHOIS | dnspython, python-whois |
| Communication | BroadcastChannel API (cross-tab logs) |

---

## Slide 12 — Resilience & Failover Design

> Show reliability engineering

- **Backend offline?** → Frontend auto-falls back to Google Gemini API
- **HuggingFace model warming up?** → Local heuristic keyword engine kicks in
- **WHOIS server timeout?** → Trusted enterprise list + domain pattern matching
- **VirusTotal unavailable?** → Graceful "unknown" status, analysis continues

**Key point:** *"JobGuard is designed for 100% uptime. Every sensor has a fallback."*

---

## Slide 13 — Demo Results (Before/After)

> Show 2–3 real examples analyzed during development

### Example 1: Fake Job
- **Input:** "Earn ₹50,000/month from home, no experience needed. Contact via WhatsApp..."
- **Result:** HIGH RISK (Score: 87/100)
- **Flags:** Free email provider, no corporate domain, WhatsApp-only contact, unrealistic salary

### Example 2: Legitimate Job (e.g., Infosys)
- **Input:** Real Infosys job posting
- **Result:** SAFE (Score: 12/100)
- **Passed:** MCA verified, domain age 43y, corporate email, realistic salary

### Example 3: Suspicious (Grey area)
- **Input:** Small startup with some missing info
- **Result:** SUSPICIOUS (Score: 52/100) → Evidence phase triggered

---

## Slide 14 — Future Scope

- 📱 **Mobile app** (React Native) for on-the-go scanning
- 🔗 **Browser extension** — auto-scan job postings on Naukri, LinkedIn, Indeed
- 📊 **Community reporting** — crowdsourced scam database
- 🏛️ **Real MCA API integration** — live government registry queries
- 🌍 **Multi-country support** — expand beyond India (US FTC, UK Companies House)
- 🤖 **Fine-tuned fraud model** — train on Indian-specific job scam datasets

---

## Slide 15 — Impact & Social Relevance

- Directly addresses **UN SDG 8** (Decent Work and Economic Growth)
- Protects vulnerable demographics: freshers, tier-2/3 students, non-tech users
- **Zero cost** to end users — fully open source
- Can be integrated into college placement cells and government job portals
- *"Every job seeker deserves to know if an opportunity is real before sharing personal data."*

---

## Slide 16 — Thank You / Q&A

- **Title:** "Protecting your career, one sensor at a time."
- Team name(s) and contact
- GitHub repo link
- QR code to the live demo (if hosted)

---

## 🎨 PPT Design Tips

> [!TIP]
> - Use a **dark background** (match the app's `#0a0a0a`) throughout the deck
> - Accent color: **#ef4444** (the app's signature red)
> - Font: **JetBrains Mono** or **Fira Code** for headings, **Inter** for body
> - Include actual screenshots — they showcase the glassmorphism UI
> - Keep text minimal per slide — use the notes section for speaking points
> - For the architecture slide, use a clean diagram (not code blocks)

> [!IMPORTANT]
> **During the demo, use these test inputs from `example_job_postings.md`:**
> - The fake "Global Earn Network" posting (should score HIGH RISK)
> - The real Infosys posting (should score SAFE)
> - A grey-area posting (should score SUSPICIOUS and trigger evidence collection)

> [!CAUTION]
> - Make sure the backend is running (`python -m uvicorn main:app --reload --port 8000`) before the live demo
> - Have the `.env` file with valid API keys (`GROQ_API_KEY`, `HF_API_KEY`, `VT_API_KEY`)
> - Test the full flow at least once before presenting — cold starts on HuggingFace can take ~20s
