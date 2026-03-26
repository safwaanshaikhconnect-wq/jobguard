import React from 'react';
import { ShieldCheck } from 'lucide-react';
import JobAnalyzer from './components/JobAnalyzer';
import Chatbot from './components/Chatbot';
import BackgroundEffects from './components/BackgroundEffects';

export default function App() {
  return (
    <div className="min-h-screen relative z-0 text-[var(--color-foreground)] font-sans selection:bg-primary/30">
      <BackgroundEffects />
      
      {/* Header / Hero */}
      <header className="pt-16 pb-12 px-6 text-center border-b border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="flex flex-col items-center">
          <div className="inline-flex items-center justify-center p-3 border border-[var(--color-border)] bg-[var(--color-surface)] mb-6">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--color-foreground)] mb-4 uppercase">
            Job<span className="text-primary">Guard</span>
          </h1>
          <p className="text-base md:text-lg text-[var(--color-muted-foreground)] font-mono max-w-xl mx-auto uppercase tracking-widest">
            Protect yourself from fake job scams
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-12 relative z-10 max-w-7xl mx-auto">
        <JobAnalyzer />
      </main>

      <Chatbot />
    </div>
  );
}
