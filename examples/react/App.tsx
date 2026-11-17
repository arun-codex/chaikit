import React, { useRef, useState } from 'react';
import { ChaiSupport, type ChaiSupportRef, type ChaiKitTheme } from '@chaikit/react';

export function App() {
  const chaiRef = useRef<ChaiSupportRef>(null);
  const [theme, setTheme] = useState<ChaiKitTheme>('classic');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 10)]);
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'sans-serif', padding: 20 }}>
      <h1>ChaiKit React Integration Example</h1>
      <p style={{ color: '#666' }}>
        Interactive demo using the typed <code>&lt;ChaiSupport /&gt;</code> React component.
      </p>

      <div style={{ display: 'flex', gap: 10, margin: '20px 0' }}>
        <button onClick={() => chaiRef.current?.open()}>Open Modal (Ref)</button>
        <button onClick={() => chaiRef.current?.close()}>Close Modal (Ref)</button>
        <button onClick={() => setTheme(theme === 'classic' ? 'dark' : 'classic')}>
          Toggle Theme ({theme})
        </button>
      </div>

      <div style={{ background: '#f5f5f5', padding: 14, borderRadius: 8, marginTop: 20 }}>
        <h3>Event Log:</h3>
        {logs.map((log, i) => (
          <div key={i} style={{ fontFamily: 'monospace', fontSize: 13, color: '#333' }}>
            {log}
          </div>
        ))}
      </div>

      {/* ChaiKit React Component */}
      <ChaiSupport
        ref={chaiRef}
        creatorName="Neha Patel"
        upiId="neha@okaxis"
        description="Thanks for supporting my open-source projects!"
        theme={theme}
        position="bottom-right"
        buttonText="Buy Neha a Chai ☕"
        onOpen={() => addLog('onOpen callback fired')}
        onClose={() => addLog('onClose callback fired')}
        onTierSelected={(tier) => addLog(`onTierSelected: ${tier.name} (₹${tier.amountPaise / 100})`)}
        onAmountChanged={(paise, formatted) => addLog(`onAmountChanged: ${formatted}`)}
      />
    </div>
  );
}
