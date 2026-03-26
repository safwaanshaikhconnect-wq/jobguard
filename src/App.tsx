import React from 'react';
import { ShieldAlert, Activity, FileText, Search, Terminal, Lock, User } from 'lucide-react';
import JobAnalyzer from './components/JobAnalyzer';
import Chatbot from './components/Chatbot';
import BackgroundEffects from './components/BackgroundEffects';

export default function App() {
  return (
    <div className="min-h-screen flex bg-[#0a0a0a] relative z-0 text-[#f5f5f5] font-mono selection:bg-[#ef4444]/30">
      {/* Sidebar */}
      <aside className="w-16 flex-shrink-0 bg-[#0a0a0a] border-r border-[#2a2a2a] flex flex-col items-center py-6 z-20">
        <div className="mb-8 text-[#ef4444]">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <nav className="flex flex-col gap-6 text-[#737373] flex-1">
          <button className="hover:text-[#f5f5f5] transition-colors"><Activity className="w-5 h-5" /></button>
          <button className="text-[#f5f5f5] transition-colors"><FileText className="w-5 h-5" /></button>
          <button className="hover:text-[#f5f5f5] transition-colors"><Search className="w-5 h-5" /></button>
          <button className="hover:text-[#f5f5f5] transition-colors"><Terminal className="w-5 h-5" /></button>
        </nav>
        <div className="mt-auto text-[#737373]">
          <button className="hover:text-[#f5f5f5] transition-colors"><Lock className="w-5 h-5" /></button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Topbar */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-[#2a2a2a] bg-[#0a0a0a]">
          <div className="font-mono text-xs font-bold tracking-widest uppercase text-[#737373]">
            JOBGUARD <span className="mx-2 text-[#2a2a2a]">/</span> <span className="text-[#f5f5f5]">FRAUD ANALYSIS</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#22c55e]"></div>
              <span className="font-mono text-[10px] text-[#737373] tracking-widest">SYSTEM_ONLINE</span>
            </div>
            <div className="w-8 h-8 rounded-full border border-[#2a2a2a] flex items-center justify-center text-[#737373]">
              <User className="w-4 h-4" />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 bg-[#0f0f0f] p-6 lg:p-10 overflow-y-auto relative z-0">
          <BackgroundEffects />
          <JobAnalyzer />
        </main>
      </div>

      <Chatbot />
    </div>
  );
}
