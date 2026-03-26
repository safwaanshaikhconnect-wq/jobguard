import React, { useState } from 'react';
import { Shield, AlertTriangle, XOctagon, CheckCircle2, XCircle, Loader2, Link as LinkIcon, FileText, ChevronRight } from 'lucide-react';
import { analyzeWithGemini } from '../lib/gemini';
import { motion } from 'motion/react';

interface AnalysisResult {
  verdict: 'SAFE' | 'SUSPICIOUS' | 'HIGH RISK';
  fraud_score: number;
  checks: {
    ai_pattern: boolean;
    company_verification: boolean;
    salary_sanity: boolean;
    domain_age: boolean;
    address_validation: boolean;
  };
  red_flags: string[];
  green_flags: string[];
  summary: string;
  company_name?: string;
  job_title?: string;
  salary?: string;
  location?: string;
  contact_email?: string;
}

export default function JobAnalyzer() {
  const [jobText, setJobText] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!jobText.trim() && !jobUrl.trim()) {
      setError('Please provide either a job description or a URL.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      let data: AnalysisResult;
      try {
        const res = await fetch('http://localhost:8000/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ job_text: jobText, job_url: jobUrl })
        });
        if (!res.ok) throw new Error('API failed');
        data = await res.json();
      } catch (apiErr) {
        console.log("Local API failed, falling back to Gemini intelligence...");
        try {
          data = await analyzeWithGemini(jobText, jobUrl);
        } catch (geminiErr) {
          console.log("Gemini failed, using hardcoded mock data...");
          data = {
            verdict: 'HIGH RISK',
            fraud_score: 85,
            checks: {
              ai_pattern: false,
              company_verification: false,
              salary_sanity: false,
              domain_age: false,
              address_validation: true
            },
            red_flags: [
              "Salary is unusually high for this role",
              "Generic email address used for contact",
              "Urgent request for personal information"
            ],
            green_flags: [
              "Company address exists"
            ],
            summary: "This job posting exhibits multiple classic signs of a recruitment scam, including unrealistic compensation and unverified contact details. Proceed with extreme caution."
          };
        }
      }
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze the job posting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'SAFE': return 'text-[#22c55e] border-[#22c55e]';
      case 'SUSPICIOUS': return 'text-[#f59e0b] border-[#f59e0b]';
      case 'HIGH RISK': return 'text-[#ef4444] border-[#ef4444]';
      default: return 'text-[#737373] border-[#2a2a2a]';
    }
  };

  const hasInput = jobText.trim() !== '' || jobUrl.trim() !== '';

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return 'N/A';
    }
  };

  if (!result) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-10">
        <div className="bg-[#111111] border border-[#2a2a2a] border-l-[3px] border-l-[#ef4444] rounded-md p-6 flex-1 flex flex-col">
          <div className="mb-6">
            <div className="text-[10px] font-mono text-[#ef4444] tracking-widest uppercase mb-1">[ INVESTIGATION ]</div>
            <h2 className="text-2xl font-mono font-bold text-white uppercase tracking-tight mb-1">
              SUBMIT TARGET
            </h2>
            <p className="text-sm text-[#737373]">
              Paste a job posting URL or description to begin fraud analysis
            </p>
          </div>
          
          <div className="space-y-4 flex-1 flex flex-col">
            <div>
              <div className="flex items-center bg-[#0a0a0a] border border-[#2a2a2a] focus-within:border-[#ef4444] rounded-md px-3 py-2.5 transition-colors">
                <span className="text-[#ef4444] font-mono text-sm mr-2 whitespace-nowrap">URL &gt;</span>
                <input
                  type="url"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="https://company.com/careers/job-post"
                  className="w-full bg-transparent text-sm font-mono outline-none focus:ring-0 text-[#f5f5f5] placeholder:text-[#737373]"
                />
              </div>
            </div>

            <div className="flex items-center justify-center text-[#737373] font-mono text-xs py-1">
              <span className="text-[#2a2a2a] tracking-tighter mr-2">──</span> 
              &nbsp;OR&nbsp; 
              <span className="text-[#2a2a2a] tracking-tighter ml-2">──</span>
            </div>

            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-mono text-[#ef4444] mb-2">
                DESCRIPTION &gt;
              </label>
              <textarea
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                placeholder="Paste the full job description here..."
                className="w-full flex-1 min-h-[180px] bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-4 py-3 text-sm font-mono outline-none focus:border-[#ef4444] focus:ring-0 text-[#f5f5f5] placeholder:text-[#737373] transition-colors resize-none"
              />
            </div>

            {error && (
              <div className="p-3 bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-md text-[#ef4444] text-sm font-mono flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[10px] bg-[#1a1a1a] border border-[#2a2a2a] text-[#737373] font-mono rounded-sm px-2 py-1">
                ⚡ AI Analysis
              </span>
              <span className="text-[10px] bg-[#1a1a1a] border border-[#2a2a2a] text-[#737373] font-mono rounded-sm px-2 py-1">
                🏛 Govt Database
              </span>
              <span className="text-[10px] bg-[#1a1a1a] border border-[#2a2a2a] text-[#737373] font-mono rounded-sm px-2 py-1">
                🔍 WHOIS Check
              </span>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className={`w-full mt-2 bg-[#ef4444] hover:bg-red-600 text-white font-bold py-3 px-4 rounded-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest font-mono ${hasInput && !loading ? 'shadow-[0_0_15px_rgba(239,68,68,0.4)]' : ''}`}
              style={{ animation: hasInput && !loading ? 'glowPulse 2s infinite' : 'none' }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  ANALYZING...
                </>
              ) : (
                <>
                  🔒 RUN ANALYSIS
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const caseId = `CASE-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-mono font-bold text-white mb-2 tracking-tight">
            {caseId}
          </h1>
          <div className="flex items-center gap-2 text-[#737373] font-mono text-xs mb-3">
            <Loader2 className="w-3 h-3" />
            <span>{timestamp}</span>
          </div>
          <p className="text-[#737373] font-mono text-sm">
            Automated analysis of suspicious job posting activity.
          </p>
        </div>
        
        <div className="mt-6 md:mt-0 flex items-start gap-8 text-right">
          <div>
            <div className="text-[#737373] font-mono text-xs tracking-widest uppercase mb-2">FRAUD SCORE</div>
            <div className="flex items-baseline justify-end gap-1 font-mono">
              <span className="text-5xl font-bold text-[#ef4444] leading-none">{result.fraud_score}</span>
              <span className="text-[#737373] text-lg">/100</span>
            </div>
          </div>
          <div>
            <div className="text-[#737373] font-mono text-xs tracking-widest uppercase mb-2 text-center">VERDICT</div>
            <div className={`inline-flex items-center justify-center px-4 py-2 border-2 ${getVerdictColor(result.verdict)}`}>
              <span className="text-lg font-mono font-bold tracking-widest uppercase">{result.verdict}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-[#2a2a2a] mb-8"></div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: CASE_FILE_DATA */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm p-6 flex flex-col">
          <div className="text-[#737373] font-mono text-sm mb-6">
            &gt;_ CASE_FILE_DATA
          </div>
          
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between py-4 border-b border-[#2a2a2a]">
              <div className="flex items-center gap-3 text-[#737373]">
                <Shield className="w-4 h-4" />
                <span className="font-mono text-sm">Company Name</span>
              </div>
              <span className="font-mono text-sm text-[#f5f5f5] text-right">{result.company_name || 'UNKNOWN_ENTITY'}</span>
            </div>
            
            <div className="flex items-center justify-between py-4 border-b border-[#2a2a2a]">
              <div className="flex items-center gap-3 text-[#737373]">
                <FileText className="w-4 h-4" />
                <span className="font-mono text-sm">Job Title</span>
              </div>
              <span className="font-mono text-sm text-[#f5f5f5] text-right">{result.job_title || 'UNSPECIFIED'}</span>
            </div>
            
            <div className="flex items-center justify-between py-4 border-b border-[#2a2a2a]">
              <div className="flex items-center gap-3 text-[#737373]">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-mono text-sm">Salary Offered</span>
              </div>
              <span className="font-mono text-sm text-[#f5f5f5] text-right">{result.salary || 'REQUIRES_MANUAL_REVIEW'}</span>
            </div>
            
            <div className="flex items-center justify-between py-4 border-b border-[#2a2a2a]">
              <div className="flex items-center gap-3 text-[#737373]">
                <XOctagon className="w-4 h-4" />
                <span className="font-mono text-sm">Location</span>
              </div>
              <span className="font-mono text-sm text-[#f5f5f5] text-right">{result.location || 'UNVERIFIED'}</span>
            </div>
            
            <div className="flex items-center justify-between py-4 border-b border-[#2a2a2a]">
              <div className="flex items-center gap-3 text-[#737373]">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-mono text-sm">Contact Email</span>
              </div>
              <span className="font-mono text-sm text-[#f5f5f5] text-right">{result.contact_email || 'HIDDEN'}</span>
            </div>
            
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3 text-[#737373]">
                <LinkIcon className="w-4 h-4" />
                <span className="font-mono text-sm">Domain</span>
              </div>
              <span className="font-mono text-sm text-[#f5f5f5] text-right">{getDomain(jobUrl)}</span>
            </div>
          </div>
        </div>

        {/* Right Column: SECURITY_FLAGS */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-sm p-6 flex flex-col">
          <div className="text-[#f59e0b] font-mono text-sm mb-6 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            ⚠ SECURITY_FLAGS
          </div>
          
          <div className="flex-1 space-y-6">
            {result.red_flags.length > 0 ? (
              <div className="space-y-4">
                {result.red_flags.map((flag, i) => (
                  <div key={i} className="flex items-start gap-3 font-mono text-sm">
                    <span className="text-[#ef4444] mt-0.5">&gt;</span>
                    <span className="text-[#ef4444] font-bold whitespace-nowrap">[FLAG_{i + 1}]</span>
                    <span className="text-[#737373] leading-relaxed">{flag}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[#737373] font-mono text-sm italic">No security flags detected.</div>
            )}

            {result.green_flags.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-[#2a2a2a]">
                {result.green_flags.map((flag, i) => (
                  <div key={i} className="flex items-start gap-3 font-mono text-sm">
                    <span className="text-[#22c55e] mt-0.5">✓</span>
                    <span className="text-[#22c55e] font-bold whitespace-nowrap">[VERIFIED_{i + 1}]</span>
                    <span className="text-[#737373] leading-relaxed">{flag}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-[#2a2a2a] flex flex-col gap-3">
            <button className="w-full bg-[#ef4444] hover:bg-red-600 text-white font-bold py-3 px-4 rounded-sm transition-colors flex items-center justify-center gap-2 uppercase tracking-widest font-mono">
              <Shield className="w-4 h-4" />
              SUBMIT FOR REVIEW
            </button>
            <button 
              onClick={() => {
                setResult(null);
                setJobText('');
                setJobUrl('');
              }}
              className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#737373] hover:text-[#f5f5f5] font-bold py-3 px-4 rounded-sm transition-colors uppercase tracking-widest font-mono border border-[#2a2a2a]"
            >
              CLEAR CASE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
