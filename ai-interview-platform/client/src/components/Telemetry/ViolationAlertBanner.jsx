import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export default function ViolationAlertBanner({ violationCount, maxViolations = 5, lastViolationType }) {
  if (!violationCount || violationCount <= 0) return null;

  const isCritical = violationCount >= maxViolations;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '8px',
        backgroundColor: isCritical ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
        border: `1px solid ${isCritical ? '#ef4444' : '#f59e0b'}`,
        color: isCritical ? '#fca5a5' : '#fcd34d',
        marginBottom: '16px',
        fontSize: '13px',
        fontWeight: '500'
      }}
    >
      {isCritical ? <ShieldAlert size={20} color="#ef4444" /> : <AlertTriangle size={20} color="#f59e0b" />}
      <div style={{ flex: 1 }}>
        <span style={{ fontWeight: '700' }}>
          Proctoring Warning ({violationCount}/{maxViolations}):
        </span>{' '}
        {lastViolationType ? `Detected ${lastViolationType.replace('_', ' ')}. ` : ''}
        {isCritical
          ? 'Maximum violation limit reached. Interview session score may be adjusted.'
          : 'Please remain focused on this window during your evaluation session.'}
      </div>
    </div>
  );
}
