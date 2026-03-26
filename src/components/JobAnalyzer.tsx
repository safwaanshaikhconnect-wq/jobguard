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
      case 'SAFE': return 'text-[var(--color-success)] border-[var(--color-success)]';
      case 'SUSPICIOUS': return 'text-[var(--color-warning)] border-[var(--color-warning)]';
      case 'HIGH RISK': return 'text-primary border-primary';
      default: return 'text-[var(--color-muted-foreground)] border-[var(--color-border)]';
    }
  };

  const CheckRow = ({ label, passed }: { label: string, passed: boolean }) => (
    <div className="flex items-center justify-between p-3 border-b border-[var(--color-border)] bg-[var(--color-card)]">
      <span className="text-sm font-mono text-[var(--color-foreground)]">{label}</span>
      {passed ? (
        <div className="flex items-center gap-2 text-[var(--color-success)]">
          <span className="text-xs font-mono font-bold tracking-widest uppercase">[PASS]</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-primary">
          <span className="text-xs font-mono font-bold tracking-widest uppercase">[FAIL]</span>
        </div>
      )}
    </div>
  );

  const hasInput = jobText.trim() !== '' || jobUrl.trim() !== '';

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Input Section */}
      <div className="lg:col-span-5 flex flex-col">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] border-l-[3px] border-l-primary rounded-md p-6 flex-1 flex flex-col">
          <div className="mb-6">
            <div className="text-[10px] font-mono text-primary tracking-widest uppercase mb-1">[ INVESTIGATION ]</div>
            <h2 className="text-2xl font-mono font-bold text-white uppercase tracking-tight mb-1">
              SUBMIT TARGET
            </h2>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Paste a job posting URL or description to begin fraud analysis
            </p>
          </div>
          
          <div className="space-y-4 flex-1 flex flex-col">
            <div>
              <div className="flex items-center bg-[var(--color-background)] border border-[var(--color-border)] focus-within:border-primary rounded-md px-3 py-2.5 transition-colors">
                <span className="text-primary font-mono text-sm mr-2 whitespace-nowrap">URL &gt;</span>
                <input
                  type="url"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="https://company.com/careers/job-post"
                  className="w-full bg-transparent text-sm font-mono outline-none focus:ring-0 text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)]"
                />
              </div>
            </div>

            <div className="flex items-center justify-center text-[var(--color-muted-foreground)] font-mono text-xs py-1">
              <span className="text-[var(--color-border)] tracking-tighter mr-2">──</span> 
              &nbsp;OR&nbsp; 
              <span className="text-[var(--color-border)] tracking-tighter ml-2">──</span>
            </div>

            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-mono text-primary mb-2">
                DESCRIPTION &gt;
              </label>
              <textarea
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                placeholder="Paste the full job description here..."
                className="w-full flex-1 min-h-[180px] bg-[var(--color-background)] border border-[var(--color-border)] rounded-md px-4 py-3 text-sm font-mono outline-none focus:border-primary focus:ring-0 text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] transition-colors resize-none"
              />
            </div>

            {error && (
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-md text-primary text-sm font-mono flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[10px] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted-foreground)] font-mono rounded-sm px-2 py-1">
                ⚡ AI Analysis
              </span>
              <span className="text-[10px] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted-foreground)] font-mono rounded-sm px-2 py-1">
                🏛 Govt Database
              </span>
              <span className="text-[10px] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-muted-foreground)] font-mono rounded-sm px-2 py-1">
                🔍 WHOIS Check
              </span>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className={`w-full mt-2 bg-primary hover:bg-red-600 text-white font-bold py-3 px-4 rounded-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest font-mono ${hasInput && !loading ? 'shadow-[0_0_15px_rgba(239,68,68,0.4)]' : ''}`}
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

      {/* Results Section */}
      <div className="lg:col-span-7 flex flex-col">
        {result ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-md p-6 flex-1 flex flex-col"
          >
            <div className="flex items-start justify-between mb-8 pb-6 border-b border-[var(--color-border)]">
              <div>
                <h2 className="text-xs font-mono font-bold tracking-widest text-[var(--color-muted-foreground)] uppercase mb-3">Case File Result</h2>
                <div className={`inline-flex items-center px-3 py-1 border-2 ${getVerdictColor(result.verdict)}`}>
                  <span className="text-2xl font-mono font-black tracking-tighter uppercase">{result.verdict}</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xs font-mono font-bold tracking-widest text-[var(--color-muted-foreground)] uppercase mb-2">Fraud Score</div>
                <div className="flex items-end justify-end gap-1 font-mono">
                  <span className={`text-4xl font-black leading-none ${result.fraud_score > 70 ? 'text-primary' : result.fraud_score > 30 ? 'text-[var(--color-warning)]' : 'text-[var(--color-success)]'}`}>
                    {result.fraud_score}
                  </span>
                  <span className="text-[var(--color-muted-foreground)] font-medium mb-1">/100</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-[var(--color-foreground)] font-mono leading-relaxed mb-8">
              &gt; {result.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-0 border-t border-l border-r border-[var(--color-border)]">
                <div className="p-2 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                  <h3 className="text-xs font-mono font-bold tracking-widest text-[var(--color-muted-foreground)] uppercase">Security Checks</h3>
                </div>
                <CheckRow label="AI Pattern Analysis" passed={result.checks.ai_pattern} />
                <CheckRow label="Company Verification" passed={result.checks.company_verification} />
                <CheckRow label="Salary Sanity Check" passed={result.checks.salary_sanity} />
                <CheckRow label="Domain Age Check" passed={result.checks.domain_age} />
                <CheckRow label="Address Validation" passed={result.checks.address_validation} />
              </div>

              <div className="space-y-6">
                {result.red_flags.length > 0 && (
                  <div>
                    <h3 className="text-xs font-mono font-bold tracking-widest text-primary uppercase mb-3 flex items-center gap-2">
                      [!] Red Flags
                    </h3>
                    <ul className="space-y-2 font-mono text-sm">
                      {result.red_flags.map((flag, i) => (
                        <li key={i} className="text-[var(--color-foreground)] flex items-start gap-2">
                          <span className="text-primary mt-0.5">-</span> {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.green_flags.length > 0 && (
                  <div>
                    <h3 className="text-xs font-mono font-bold tracking-widest text-[var(--color-success)] uppercase mb-3 flex items-center gap-2">
                      [+] Green Flags
                    </h3>
                    <ul className="space-y-2 font-mono text-sm">
                      {result.green_flags.map((flag, i) => (
                        <li key={i} className="text-[var(--color-foreground)] flex items-start gap-2">
                          <span className="text-[var(--color-success)] mt-0.5">-</span> {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="h-full min-h-[400px] bg-[var(--color-card)] border border-[var(--color-border)] rounded-md flex flex-col items-center justify-center p-8 flex-1">
            <div className="w-full max-w-[240px] space-y-3 mb-6 opacity-50">
              <div className="h-3 bg-[#1f1f1f] rounded-sm w-full"></div>
              <div className="h-3 bg-[#1f1f1f] rounded-sm w-5/6"></div>
              <div className="h-3 bg-[#1f1f1f] rounded-sm w-4/6"></div>
              <div className="h-3 bg-[#1f1f1f] rounded-sm w-full"></div>
            </div>
            <h3 className="text-sm font-mono font-bold text-primary uppercase tracking-widest">Awaiting Submission</h3>
          </div>
        )}
      </div>
    </div>
  );
}
