'use client';

import dynamic from 'next/dynamic';

const GameClient = dynamic(() => import('./GameClient'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#0f172a'
    }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '1.5rem',
        color: '#4ade80'
      }}>
        <svg width="80" height="80" viewBox="0 0 120 120" style={{ animation: 'pulse 2s ease-in-out infinite' }}>
          <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="4"/>
          <path d="M60 20 L60 55 M45 40 L60 55 L75 40" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="60" cy="60" r="12" fill="currentColor"/>
          <circle cx="60" cy="60" r="4" fill="#0f172a"/>
        </svg>
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '1.125rem', fontWeight: 500 }}>Carregando jogo...</p>
      </div>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  ),
});

export default function GamePage() {
  return <GameClient />;
}