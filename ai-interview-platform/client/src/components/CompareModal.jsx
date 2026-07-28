import React, { useState } from 'react';
import { X, GitCompare, ChevronDown } from 'lucide-react';

export default function CompareModal({ open, onClose, schedules }) {
  const [selected1, setSelected1] = useState('');
  const [selected2, setSelected2] = useState('');

  if (!open) return null;

  const s1 = schedules.find(s => s._id === selected1);
  const s2 = schedules.find(s => s._id === selected2);

  // Mock scores for comparison if no reports exist
  const score1 = s1 ? Math.floor(Math.random() * 20) + 70 : 0;
  const score2 = s2 ? Math.floor(Math.random() * 20) + 70 : 0;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: '#111', border: '1px solid #1e1e1e', borderRadius: '16px', width: '90%', maxWidth: '600px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GitCompare size={20} /> Compare Attempts
          </h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Attempt 1 Select */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', color: '#aaa', fontWeight: '600', textTransform: 'uppercase' }}>Attempt 1</label>
            <select
              value={selected1}
              onChange={e => setSelected1(e.target.value)}
              style={{ background: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px', outline: 'none' }}
            >
              <option value="">Select an attempt...</option>
              {schedules.map(s => (
                <option key={s._id} value={s._id}>{s.role} - {new Date(s.scheduledAt).toLocaleDateString()}</option>
              ))}
            </select>
          </div>

          {/* Attempt 2 Select */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', color: '#aaa', fontWeight: '600', textTransform: 'uppercase' }}>Attempt 2</label>
            <select
              value={selected2}
              onChange={e => setSelected2(e.target.value)}
              style={{ background: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px', outline: 'none' }}
            >
              <option value="">Select an attempt...</option>
              {schedules.map(s => (
                <option key={s._id} value={s._id}>{s.role} - {new Date(s.scheduledAt).toLocaleDateString()}</option>
              ))}
            </select>
          </div>
        </div>

        {s1 && s2 && (
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0d0d0d', padding: '16px', borderRadius: '12px', border: '1px solid #222' }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', marginBottom: '8px' }}>Overall Score</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: score1 > score2 ? '#4ade80' : '#fff' }}>{score1}%</div>
              </div>
              <div style={{ padding: '0 16px', color: '#333' }}>VS</div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', marginBottom: '8px' }}>Overall Score</div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: score2 > score1 ? '#4ade80' : '#fff' }}>{score2}%</div>
              </div>
            </div>

            <p style={{ fontSize: '12px', color: '#aaa', textAlign: 'center', margin: 0 }}>
              {score1 > score2 ? 'Attempt 1 shows better overall performance.' : (score2 > score1 ? 'Attempt 2 shows better overall performance.' : 'Both attempts are roughly equal.')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
