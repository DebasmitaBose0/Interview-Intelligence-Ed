
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function CountdownTimer({ targetTime, onUnlock }) {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    const diff = Math.max(0, Math.floor((new Date(targetTime) - new Date()) / 1000));
    setSecondsLeft(diff);
    
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onUnlock();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetTime, onUnlock]);

  const hrs = Math.floor(secondsLeft / 3600);
  const mins = Math.floor((secondsLeft % 3600) / 60);
  const secs = secondsLeft % 60;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '14px' }}>
      <Clock size={16} />
      <span>Interview unlocks in: {hrs}h {mins}m {secs}s</span>
    </div>
  );
}
      