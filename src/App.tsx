import React, { useState } from 'react';
import { ShieldAlert, Activity, FileText, Search, Terminal, Lock, User } from 'lucide-react';
import JobAnalyzer from './components/JobAnalyzer';
import Chatbot from './components/Chatbot';
import BackgroundEffects from './components/BackgroundEffects';
import OsintSearch from './components/OsintSearch';
import LiveTerminal from './components/LiveTerminal';

export default function App() {
  const [activeTab, setActiveTab] = useState('analyzer');
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('jg_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [logs, setLogs] = useState<any[]>(() => [
    { id: '1', type: 'info', timestamp: new Date().toISOString(), message: 'JOBGUARD_CORE OS [VERSION 2.0.4] INITIALIZED.' },
    { id: '2', type: 'debug', timestamp: new Date().toISOString(), message: 'ESTABLISHING SECURE TUNNEL TO INTELLIGENCE CLUSTERS...' },
    { id: '3', type: 'success', timestamp: new Date().toISOString(), message: 'GROQ_MODEL/LLAMA_3.3_70B: CONNECTED.' },
    { id: '4', type: 'success', timestamp: new Date().toISOString(), message: 'CYBER_THREAT_API/VIRUSTOTAL: READY.' },
    { id: '5', type: 'success', timestamp: new Date().toISOString(), message: 'ENSEMBLE_ML/HUGGINGFACE: SYNCHRONIZED.' },
    { id: '6', type: 'info', timestamp: new Date().toISOString(), message: 'SYSTEM STATUS: OPTIMAL. LISTENING FOR ANALYSIS TRIGGERS...' }
  ]);

  React.useEffect(() => {
    const bc = new BroadcastChannel('jobguard_logs');
    bc.onmessage = (event) => {
      const newLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...event.data
      };
      setLogs(prev => [...prev.slice(-100), newLog]);
    };
    return () => bc.close();
  }, []);

  const saveToHistory = (result: any, jobUrl: string) => {
    const newEntry = {
      id: `CASE-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      company: result.company_name || 'UNKNOWN',
      verdict: result.verdict,
      score: result.fraud_score,
      url: jobUrl || 'N/A',
      location: result.location,
      title: result.job_title
    };
    const updatedHistory = [newEntry, ...history].slice(0, 50);
    setHistory(updatedHistory);
    localStorage.setItem('jg_history', JSON.stringify(updatedHistory));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'analyzer':
        return <JobAnalyzer onAnalysisComplete={saveToHistory} />;
      case 'dashboard':
        return (
          <div className="h-full flex flex-col font-mono">
            <div className="mb-8 text-center flex flex-col items-center">
              <h2 className="text-2xl font-bold uppercase tracking-[0.3em] text-[#f5f5f5] mb-2">Threat Intelligence Dashboard</h2>
              <div className="h-px w-20 bg-[#ef4444] mb-2" />
              <p className="text-[#737373] text-[10px] uppercase tracking-widest">Real-time log of local investigations and security anomalies.</p>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 gap-4">
                {history.length > 0 ? (
                  history.map((item: any) => (
                    <div key={item.id} className="bg-[#111111] border border-[#2a2a2a] p-4 flex items-center justify-between hover:border-[#ef4444]/30 transition-all cursor-pointer group relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-[2px] h-full bg-[#ef4444] opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-center gap-6">
                        <div className="text-[10px] text-[#737373] font-bold tracking-tighter w-20 flex flex-col">
                          <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                          <span className="text-[#2a2a2a]">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div>
                          <div className="text-[#f5f5f5] text-sm font-bold uppercase tracking-wide truncate max-w-[200px]">{item.company}</div>
                          <div className="text-[10px] text-[#737373] mt-0.5 truncate max-w-[250px] italic font-sans">{item.url}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <div className={`text-xs font-bold font-mono tracking-widest uppercase ${
                            item.verdict === 'SAFE' ? 'text-[#22c55e]' : 
                            item.verdict === 'SUSPICIOUS' ? 'text-[#f59e0b]' : 'text-[#ef4444]'
                          }`}>
                            {item.verdict}
                          </div>
                          <div className="text-[10px] text-[#2a2a2a] mt-1 tracking-[0.2em] font-bold uppercase">Score: {item.score}/100</div>
                        </div>
                        <div className="text-[#1a1a1a] group-hover:text-[#ef4444] transition-colors">
                          <Activity className="w-5 h-5 flex-shrink-0" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 opacity-10">
                    <Activity className="w-16 h-16 mb-4" />
                    <p className="text-sm uppercase tracking-[0.3em]">NO_DATA_DETECTED</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'search':
        return <OsintSearch />;
      case 'terminal':
        return <LiveTerminal logs={logs} />;
      default:
        return <JobAnalyzer onAnalysisComplete={saveToHistory} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] relative z-0 text-[#f5f5f5] font-mono selection:bg-[#ef4444]/30">
      <aside className="w-16 flex-shrink-0 bg-[#0a0a0a] border-r border-[#2a2a2a] flex flex-col items-center py-6 z-20 shadow-2xl">
        <div className="mb-10 text-[#ef4444]">
          <ShieldAlert className="w-7 h-7 cursor-pointer hover:scale-110 transition-transform" onClick={() => setActiveTab('analyzer')} />
        </div>
        <nav className="flex flex-col gap-8 flex-1">
          <button onClick={() => setActiveTab('analyzer')} className={`transition-all duration-300 ${activeTab === 'analyzer' ? 'text-[#ef4444] scale-110' : 'text-[#2a2a2a] hover:text-[#f5f5f5]'}`}>
            <FileText className="w-5 h-5" />
          </button>
          <button onClick={() => setActiveTab('dashboard')} className={`transition-all duration-300 ${activeTab === 'dashboard' ? 'text-[#ef4444] scale-110' : 'text-[#2a2a2a] hover:text-[#f5f5f5]'}`}>
            <Activity className="w-5 h-5" />
          </button>
          <button onClick={() => setActiveTab('search')} className={`transition-all duration-300 ${activeTab === 'search' ? 'text-[#ef4444] scale-110' : 'text-[#2a2a2a] hover:text-[#f5f5f5]'}`}>
            <Search className="w-5 h-5" />
          </button>
          <button onClick={() => setActiveTab('terminal')} className={`transition-all duration-300 ${activeTab === 'terminal' ? 'text-[#ef4444] scale-110' : 'text-[#2a2a2a] hover:text-[#f5f5f5]'}`}>
            <Terminal className="w-5 h-5" />
          </button>
        </nav>
        <div className="mt-auto text-[#2a2a2a]">
          <button className="hover:text-[#f5f5f5] transition-colors"><Lock className="w-5 h-5" /></button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 z-10 overflow-hidden">
        <header className="h-14 flex items-center justify-between px-6 border-b border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-md">
          <div className="font-mono text-[9px] font-bold tracking-[0.5em] uppercase text-[#737373]">
            JOB_GUARD_SYSTEM <span className="mx-4 text-[#1a1a1a]">||</span> <span className="text-[#f5f5f5] animate-pulse">{activeTab.toUpperCase().replace('_', ' ')}</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e]"></div>
              <span className="font-mono text-[9px] text-[#737373] tracking-widest font-bold">CORE_ENVELOPE_SECURE</span>
            </div>
            <div className="w-8 h-8 rounded-sm border border-[#2a2a2a] flex items-center justify-center text-[#2a2a2a] hover:text-[#f5f5f5] hover:border-[#f5f5f5] transition-all cursor-crosshair">
              <User className="w-4 h-4" />
            </div>
          </div>
        </header>

        <main className="flex-1 bg-[#050505] p-6 lg:p-12 overflow-y-auto relative z-0 scrollbar-thin scrollbar-thumb-[#1a1a1a]">
          <BackgroundEffects />
          <div className="h-full animate-in fade-in duration-700">
            {renderContent()}
          </div>
        </main>
      </div>

      <Chatbot />
    </div>
  );
}
