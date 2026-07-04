import HealthIndicator from '../Diagnostics/HealthIndicator';
import React from 'react';
import { Activity } from 'lucide-react';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export default function Navbar() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <header style={{ height: '52px', borderBottom: '1px solid #1e1e1e', background: '#0d0d0d', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '0 12px 0 48px' : '0 28px', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Activity size={14} color="#4ade80" />
        <span style={{ fontSize: '12px', color: '#555', letterSpacing: '0.05em' }}>System Online</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
        <span style={{ fontSize: '11px', color: '#444' }}>localhost:5000</span>
      </div>
    </header>
  );
}
