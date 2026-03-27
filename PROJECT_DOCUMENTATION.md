# 🛡️ JobGuard: Advanced Fraud Intelligence & Detection

## 0x01: Overview
**JobGuard** is a high-performance cybersecurity platform designed to detect and expose recruitment fraud in real-time. Moving beyond simple keyword matching, JobGuard utilizes a multi-layered **Ensemble Defense System** to analyze job postings across seven distinct security sensors.

The project is built with a "Security Operations Center" (SOC) aesthetic, providing professional-grade forensic analysis for everyday job seekers.

---

## 0x02: Technical Architecture (The 7-Sensor Ensemble)
JobGuard doesn't just "guess"—it investigates. Each analysis triggers a parallel execution of specialized sensors:

1.  **🧠 Primary AI Core (Groq Llama 3.3)**: Performs high-level semantic analysis to identify linguistic markers of urgency, ghost-recruiting, and suspicious compensation structures.
2.  **🧬 Ensemble ML Classifier (HuggingFace)**: Uses a specialized `distilbert-base-uncased` model fine-tuned for job scam detection to provide a secondary, independent machine learning verdict.
3.  **🛡️ Cybersecurity Layer (VirusTotal)**: Real-time API integration to scan job URLs for phishing, malware, and blacklisted domains.
4.  **📧 Inbound Mail Verification (DNS MX)**: Automatically extracts contact emails and verifies if the domain actually has a configured mail server (prevents "ghost domain" spoofing).
5.  **🕰️ Temporal Intelligence (WHOIS)**: Analyzes the age of the job's host domain. New domains (< 6 months) are automatically flagged as high risk.
6.  **📍 Geo-Spatial Mapping (Pincode/Location)**: Cross-references physical office locations and pincodes against regional databases to ensure the advertised office actually exists.
7.  **🏛️ Corporate Registry (MCA/OSINT)**: Leverages Open-Source Intelligence to verify the company's legal status and corporate history.

---

## 0x03: Key Features & "Wow" Factors
### 🕵️ Forensic Evidence Overlay
Instead of a simple "Safe/Unsafe" verdict, JobGuard provides **Visual Proof**. The AI identifies specific fraud markers within the job description and highlights them in a glowing red "Forensic Overlay," showing users exactly *why* a post was flagged.

### 📟 The "Engine Room" (Live Terminal)
To provide full technical transparency, JobGuard features a real-time, scrolling system log. This "Hacker Aesthetic" terminal visualizes the backend sensor pings, API handshakes, and DNS queries as they happen, proving the technical depth of the analysis.

### 🌐 Global OSINT Intelligence Portal
A dedicated search tab that allows users to perform deep-dives into company backgrounds, pulling real-time corporate intelligence and history before they share their private resume data.

### 💬 Security Assistant (Chatbot)
A Groq-powered situational assistant that helps users understand complex red flags and provides actionable advice on how to handle suspicious recruiters.

---

## 0x04: Tech Stack
- **Frontend**: React 18, Tailwind CSS (Custom Design System), Framer Motion (Micro-animations), Lucide Icons.
- **Backend**: FastAPI (Python), Uvicorn, AsyncIO (Parallel processing).
- **Intelligence**: Groq (Llama 3.3 70B), HuggingFace (DistilBERT), VirusTotal API, Google Search API (OSINT).
- **Communication**: Cross-tab log streaming via `BroadcastChannel` API.

---

## 0x05: Why JobGuard Wins (USPs)
1.  **Explainability**: It doesn't just give a score; it points to the evidence.
2.  **Multi-Vector Defense**: It combines LLMs, BERT-based ML, and traditional network security (DNS/WHOIS).
3.  **Professional UX**: The high-tech, dark-mode "SOC" interface stands out from standard "web app" templates.
4.  **Resilience**: Features built-in "Hackathon Safe" failovers (Local Heuristic Engine) for 100% uptime during demos.

---

## 0x06: Installation & Setup
1.  **Backend**:
    ```bash
    cd backend
    pip install -r requirements.txt
    python -m uvicorn main:app --reload --port 8000
    ```
2.  **Frontend**:
    ```bash
    npm install
    npm run dev
    ```

---
**"Protecting your career, one sensor at a time."**
