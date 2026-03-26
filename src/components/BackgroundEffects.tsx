import React from 'react';

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Grid Pattern: CSS grid lines at #ffffff 2% opacity, 40px spacing */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Diagonal Scan Lines: #ef4444 at 3% opacity */}
      <div 
        className="absolute left-0 right-0 h-[200vh] top-[-50vh]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, rgba(239, 68, 68, 0.03) 0, rgba(239, 68, 68, 0.03) 1px, transparent 1px, transparent 20px)`,
          animation: 'scanlines 9s ease-in-out infinite'
        }}
      />

      {/* Floating Particles: 4 small dots, 2px, #ef4444 at 15% opacity */}
      <div className="absolute top-1/4 left-1/4 w-[2px] h-[2px] bg-[#ef4444] opacity-[0.15] rounded-full" style={{ animation: 'float1 18s ease-in-out infinite' }} />
      <div className="absolute top-3/4 left-1/3 w-[2px] h-[2px] bg-[#ef4444] opacity-[0.15] rounded-full" style={{ animation: 'float2 22s ease-in-out infinite' }} />
      <div className="absolute top-1/3 left-2/3 w-[2px] h-[2px] bg-[#ef4444] opacity-[0.15] rounded-full" style={{ animation: 'float3 20s ease-in-out infinite' }} />
      <div className="absolute top-2/3 left-3/4 w-[2px] h-[2px] bg-[#ef4444] opacity-[0.15] rounded-full" style={{ animation: 'float4 24s ease-in-out infinite' }} />
    </div>
  );
}
