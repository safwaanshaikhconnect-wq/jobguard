import React, { useState } from 'react';
import { Search, Globe, MapPin, Mail, ShieldCheck, ShieldAlert, Loader2, Building2 } from 'lucide-react';

interface CorporateIntel {
  name: string;
  official_domain: string;
  official_hq: string;
  email_pattern: string;
  is_verified: boolean;
  description: string;
}

export default function OsintSearch() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CorporateIntel | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:8000/search/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      
      const data = await response.json();
      if (data.status === 'error') {
        setError(data.message);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Intelligence server is offline. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col font-mono max-w-4xl mx-auto w-full">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold uppercase tracking-[0.2em] text-[#f5f5f5] mb-2 flex items-center justify-center gap-3">
          <Globe className="w-8 h-8 text-[#ef4444]" />
          OSINT_INTELLIGENCE
        </h2>
        <p className="text-[#737373] text-xs tracking-widest uppercase">Global Business Registry & Domain Verification Portal</p>
      </div>

      <div className="relative group mb-12">
        <form onSubmit={handleSearch}>
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-[#737373] group-focus-within:text-[#ef4444] transition-colors" />
          </div>
          <input
            type="text"
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-sm py-4 pl-12 pr-4 text-[#f5f5f5] focus:outline-none focus:border-[#ef4444] transition-all placeholder:text-[#2a2a2a] text-lg uppercase tracking-widest font-mono shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
            placeholder="SEARCH ENTITY (E.G. TATA MOTORS)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={loading}
            className="absolute right-3 top-3 bg-[#111111] hover:bg-[#1a1a1a] border border-[#2a2a2a] text-[#737373] hover:text-[#f5f5f5] px-4 py-1.5 rounded-sm transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "EXECUTE_LOOKUP"}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 p-4 rounded-sm text-[#ef4444] text-sm flex items-center gap-3 mb-6">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {result && (
        <div className="bg-[#111111] border border-[#2a2a2a] p-8 rounded-sm animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
          <div className="flex justify-between items-start mb-8 pb-6 border-b border-[#2a2a2a]">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-6 h-6 text-[#ef4444]" />
                <h3 className="text-2xl font-bold uppercase tracking-widest text-[#f5f5f5]">{result.name}</h3>
              </div>
              <p className="text-[#737373] text-sm italic">{result.description}</p>
            </div>
            {result.is_verified ? (
              <div className="flex items-center gap-2 px-4 py-1.5 bg-[#22c55e]/10 border border-[#22c55e] text-[#22c55e] rounded-full text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" /> VERIFIED_ENTITY
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-1.5 bg-[#f59e0b]/10 border border-[#f59e0b] text-[#f59e0b] rounded-full text-[10px] font-bold uppercase tracking-widest">
                <ShieldAlert className="w-4 h-4" /> UNVERIFIED_ENTITY
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-sm">
                <Globe className="w-5 h-5 text-[#ef4444]" />
              </div>
              <div>
                <label className="text-[10px] text-[#737373] uppercase tracking-widest font-bold">OFFICIAL_DOMAIN</label>
                <div className="text-[#f5f5f5] font-mono text-lg">{result.official_domain}</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-sm">
                <MapPin className="w-5 h-5 text-[#ef4444]" />
              </div>
              <div>
                <label className="text-[10px] text-[#737373] uppercase tracking-widest font-bold">HQ_LOCATION</label>
                <div className="text-[#f5f5f5] font-mono text-lg">{result.official_hq}</div>
              </div>
            </div>

            <div className="flex items-start gap-4 col-span-1 md:col-span-2">
              <div className="p-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-sm">
                <Mail className="w-5 h-5 text-[#ef4444]" />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-[#737373] uppercase tracking-widest font-bold">HR_EMAIL_CONVENTION</label>
                <div className="text-[#f5f5f5] font-mono text-lg">{result.email_pattern}</div>
                <p className="text-[#737373] text-[10px] mt-2 italic font-sans tracking-wide">Note: Any job offer from a domain NOT matching '{result.official_domain}' is highly suspect.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!result && !loading && !error && (
        <div className="mt-20 flex flex-col items-center justify-center opacity-20 select-none">
          <div className="grid grid-cols-3 gap-8">
            <Building2 className="w-12 h-12" />
            <Globe className="w-12 h-12" />
            <MapPin className="w-12 h-12" />
          </div>
          <p className="mt-8 text-sm uppercase tracking-[0.4em]">Node ID: 8841 | Registry Offline</p>
        </div>
      )}
    </div>
  );
}
