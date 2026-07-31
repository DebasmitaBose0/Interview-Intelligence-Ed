import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useOfflineSync } from '../../hooks/useOfflineSync';

export default function OfflineBanner() {
  const { isOnline, unsyncedCount, isSyncing, syncQueue } = useOfflineSync();

  if (isOnline && unsyncedCount === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '16px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: isOnline ? '#3b82f6' : '#ef4444',
      color: '#fff',
      padding: '10px 20px',
      borderRadius: '30px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
      zIndex: 9999,
      fontFamily: 'Inter, sans-serif',
      fontSize: '13px',
      fontWeight: '500'
    }}>
      <WifiOff size={16} />
      <span>
        {!isOnline
          ? 'You are currently offline. Responses will be queued.'
          : `${unsyncedCount} queued response(s) pending sync.`}
      </span>
      {unsyncedCount > 0 && isOnline && (
        <button
          onClick={syncQueue}
          disabled={isSyncing}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: '#fff',
            padding: '4px 10px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
          {isSyncing ? 'Syncing...' : 'Sync Now'}
        </button>
      )}
    </div>
  );
}
