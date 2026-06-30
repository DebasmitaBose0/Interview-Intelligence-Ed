import React from 'react';
import { CameraOff, AlertTriangle } from 'lucide-react';

export default function CameraFallbackOverlay({ message }) {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: '#0d0d0d',
      border: '1px solid #222',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      padding: '24px',
      textAlign: 'center'
    }}>
      <div style={{ background: '#1a1a1a', padding: '12px', borderRadius: '50%' }}>
        <CameraOff size={24} color="#ef4444" />
      </div>
      <div>
        <h4 style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: '600', color: '#fff' }}>Camera Blocked or Missing</h4>
        <p style={{ margin: 0, fontSize: '12px', color: '#aaa', lineHeight: 1.5 }}>
          {message || 'Please connect a camera or check your browser site permission settings to enable proctored mock sessions.'}
        </p>
      </div>
    </div>
  );
}
